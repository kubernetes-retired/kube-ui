package api

import (
	"log"
	"net/http"
	"net/url"

	"github.com/gorilla/mux"
	"k8s.io/kube-ui/server/types"
	"labix.org/v2/mgo/bson"
)

func kubernetesProxyHandler(c *Context) {
	uid := mux.Vars(c.r)["uid"]
	if !bson.IsObjectIdHex(uid) {
		c.w.WriteHeader(http.StatusBadRequest)
		c.w.Write([]byte("invalid uid"))
		return
	}
	c.ProxyPool.ServeHTTP(c.w, c.r, bson.ObjectIdHex(uid))
}

func listClusterHandler(c *Context) {
	clusters, err := c.Datastore.GetAllClusters()
	if err != nil {
		c.w.WriteHeader(http.StatusInternalServerError)
		return
	}
	c.WriteJSON(http.StatusOK, clusters)
}

func getClusterHandler(c *Context) {
	uid := mux.Vars(c.r)["uid"]
	if !bson.IsObjectIdHex(uid) {
		c.w.WriteHeader(http.StatusNotAcceptable)
		c.w.Write([]byte("invalid uid"))
		return
	}
	cluster, err := c.Datastore.GetClusterByUID(bson.ObjectIdHex(uid))
	if err != nil {
		c.w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if cluster == nil {
		http.NotFound(c.w, c.r)
	}
	c.WriteJSON(200, cluster)
}

func createClusterHandler(c *Context) {
	var newCluster types.Cluster
	if err := c.ReadJSON(&newCluster); err != nil {
		return
	}
	newCluster.UID = bson.NewObjectId()

	_, err := url.Parse(newCluster.KubeAPIURL)
	c.validations.Add((err != nil), "please provide a kubeApiURL")
	c.validations.Add(newCluster.Name == "", "name cannot be empty")
	c.validations.Add(len(newCluster.Name) > 50, "name too long. max 50 chars")

	if valid := c.validations.Validate(c); !valid {
		return
	}

	if err := c.Datastore.CreateCluster(&newCluster); err != nil {
		log.Println("Error creating new cluster:", err)
		c.w.WriteHeader(http.StatusInternalServerError)
		return
	}
	go func(context *Context, cluster *types.Cluster) {
		if err := context.ProxyPool.AddCluster(cluster); err != nil {
			log.Println("Error adding new cluster to proxy pool:", err)
		}
	}(c, &newCluster)
}
