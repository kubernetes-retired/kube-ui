package datastore

import (
	"github.com/kubernetes/kube-ui/server/types"
	"labix.org/v2/mgo/bson"
	"os"
	"os/signal"
	"syscall"
)

var usedDatastore Datastore

type Datastore interface {
	Connect() error
	Disconnect() error
	InitDatastoreStructure() error
	Clusterstore
}

type Clusterstore interface {
	GetAllClusters() ([]*types.Cluster, error)
	GetClusterByUID(UID bson.ObjectId) (*types.Cluster, error)
	CreateCluster(*types.Cluster) error
	DeleteCluster(*types.Cluster) error
}

func Init(d Datastore) error {
	usedDatastore = d
	if err := usedDatastore.Connect(); err != nil {
		return err
	}
	if err := usedDatastore.InitDatastoreStructure(); err != nil {
		return err
	}
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, syscall.SIGTERM)
	go func() {
		<-c
		if usedDatastore != nil {
			usedDatastore.Disconnect()
		}
		os.Exit(0)
	}()
	return nil
}

func Get() Datastore {
	return usedDatastore
}
