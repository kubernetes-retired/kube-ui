package proxypool

import (
	"errors"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"sync"

	"k8s.io/kube-ui/server/types"
	"labix.org/v2/mgo/bson"
)

type ProxyPool struct {
	rwl     sync.RWMutex
	proxies map[bson.ObjectId]*httputil.ReverseProxy
}

type Pool interface {
	AddCluster(c *types.Cluster) error
	DeleteCluster(c *types.Cluster) error
	ServeHTTP(w http.ResponseWriter, r *http.Request, clusterUID bson.ObjectId)
}

// new creates a new ProxyPool for Kubernetes clusters.
func New() *ProxyPool {
	return &ProxyPool{
		proxies: make(map[bson.ObjectId]*httputil.ReverseProxy),
	}
}

func (p *ProxyPool) AddCluster(c *types.Cluster) error {
	if c == nil {
		return errors.New("cluster is nil")
	}
	log.Printf("Adding cluster %s to proxy pool\n", c.UID.Hex())
	p.rwl.Lock()
	defer p.rwl.Unlock()
	u, _ := url.Parse(c.KubeAPIURL)
	c.KubeAPIURLParsed = u
	p.proxies[c.UID] = newKubernetesProxy(c)
	return nil
}

func (p *ProxyPool) DeleteCluster(c *types.Cluster) error {
	if c == nil {
		return errors.New("cluster is nil")
	}
	p.rwl.Lock()
	defer p.rwl.Unlock()
	delete(p.proxies, c.UID)
	return nil
}

func (p *ProxyPool) ServeHTTP(w http.ResponseWriter, r *http.Request, clusterUID bson.ObjectId) {
	p.rwl.RLock()
	defer p.rwl.RUnlock()
	if proxy, ok := p.proxies[clusterUID]; ok {
		proxy.ServeHTTP(w, r)
		return
	}
	w.WriteHeader(http.StatusNotFound)
}

// newKubernetesProxy creates a rerverse proxy for kube-apiserver communication.
func newKubernetesProxy(cluster *types.Cluster) *httputil.ReverseProxy {
	targetQuery := cluster.KubeAPIURLParsed.RawQuery
	director := func(req *http.Request) {
		req.URL.Scheme = cluster.KubeAPIURLParsed.Scheme
		req.URL.Host = cluster.KubeAPIURLParsed.Host
		// todo: the TrimPrefix path should not be hardcoded
		req.URL.Path = strings.TrimPrefix(req.URL.Path, "/api/clusters/"+cluster.UID.Hex()+"/proxy")
		if targetQuery == "" || req.URL.RawQuery == "" {
			req.URL.RawQuery = targetQuery + req.URL.RawQuery
		} else {
			req.URL.RawQuery = targetQuery + "&" + req.URL.RawQuery
		}
	}
	return &httputil.ReverseProxy{Director: director}
}
