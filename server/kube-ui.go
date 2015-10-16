/*
Copyright 2015 The Kubernetes Authors All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// The Kubernetes UI server.
package main

import (
	"flag"
	"fmt"
	"log"
	"mime"
	"net/http"
	"os"

	"github.com/codegangsta/negroni"
	"github.com/elazarl/go-bindata-assetfs"
	"k8s.io/kube-ui/server/api"
	"k8s.io/kube-ui/server/data"
	"k8s.io/kube-ui/server/datastore"
	"k8s.io/kube-ui/server/datastore/boltdb"
	"k8s.io/kube-ui/server/proxypool"
)

// cli flags
var (
	insecurePort        = flag.Int("insecure-port", 8080, "The port on which to serve unsecured, unauthenticated access. Default 8080. It is assumed that firewall rules are set up such that this port is not reachable from outside of the network and that port 443 on the server's public address is proxied to this port.")
	port                = flag.Int("port", 0, "DEPRECATED. The port on which to serve unsecured, unauthenticated access. Default 8080. It is assumed that firewall rules are set up such that this port is not reachable from outside of the network and that port 443 on the server's public address is proxied to this port.")
	insecureBindAddress = flag.String("insecure-bind-address", "0.0.0.0", "The IP address on which to serve the --insecure-port (set to 0.0.0.0 for all interfaces). Defaults to localhost.")

	datastoreType = flag.String("datastore", "boltdb", "The datastore type (currently only boltdb available) to store kube-ui related data")
	boltDBFile    = flag.String("boltdb-file", "kube-ui.db", "BoltDB database file")
)

// proxy pool for all kubeapi-server
func warmupProxyPool() (*proxypool.ProxyPool, error) {
	pool := proxypool.New()
	clusters, err := datastore.Get().GetAllClusters()
	if err != nil {
		return nil, err
	}
	log.Println("Warming up proxy pool for", len(clusters), "Kubernetes clusters")
	for _, c := range clusters {
		pool.AddCluster(c)
	}
	return pool, nil
}

func main() {
	flag.Parse()

	// validate flag values
	if *datastoreType != "boltdb" {
		log.Println("invalid --datastore type provided! Valid options: boltdb")
		os.Exit(2)
	}
	if *boltDBFile == "" && *datastoreType == "boltdb" {
		log.Println("--boltdb-file flag is required!")
		os.Exit(2)
	}

	if *port > 0 {
		log.Println("WARNING: port is deprecated! Please use --insecure-port.")
		*insecurePort = *port
	}

	store := boltdb.NewBoltDBDataStore(*boltDBFile)
	if err := datastore.Init(store); err != nil {
		log.Fatal("Error initializing datastore", *datastoreType, ":", err.Error())
		os.Exit(2)
	}

	pool, err := warmupProxyPool()
	if err != nil {
		log.Fatal("Error warming up proxy pool:", err)
		os.Exit(2)
	}

	router := api.SetupRouter(&api.BaseContext{
		Datastore: store,
		ProxyPool: pool,
	})
	n := negroni.New(negroni.NewRecovery())
	n.UseHandler(router)

	// Send correct mime type for .svg files.  TODO: remove when
	// https://github.com/golang/go/commit/21e47d831bafb59f22b1ea8098f709677ec8ce33
	// makes it into all of our supported go versions.
	mime.AddExtensionType(".svg", "image/svg+xml")

	fileServer := http.FileServer(&assetfs.AssetFS{
		Asset:    data.Asset,
		AssetDir: data.AssetDir,
	})
	router.PathPrefix("/").Handler(fileServer)

	listenAddr := fmt.Sprintf("%s:%d", *insecureBindAddress, *insecurePort)
	log.Println("Kube-UI listening on:", listenAddr)
	log.Fatal("Error ListenAndServe:", http.ListenAndServe(listenAddr, n))
}
