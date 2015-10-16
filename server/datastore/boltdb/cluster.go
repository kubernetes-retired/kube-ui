package boltdb

import (
	"github.com/boltdb/bolt"
	"k8s.io/kube-ui/server/types"
	"labix.org/v2/mgo/bson"
)

const bucketNameCluster = "cluster"

func (d *Datastore) GetAllClusters() ([]*types.Cluster, error) {
	clusters := make([]*types.Cluster, 0)
	iterateFn := func(key []byte, value []byte) error {
		var c = &types.Cluster{}
		if err := bson.Unmarshal(value, c); err != nil {
			return err
		}
		clusters = append(clusters, c)
		return nil
	}
	err := d.getAllInBucket(bucketNameCluster, iterateFn)
	return clusters, err
}

func (d *Datastore) CreateCluster(c *types.Cluster) error {
	return d.db.Update(func(tx *bolt.Tx) error {
		j, err := bson.Marshal(c)
		if err != nil {
			return err
		}
		return tx.Bucket([]byte(bucketNameCluster)).Put([]byte(c.UID.Hex()), j)
	})
}

func (d *Datastore) GetClusterByUID(UID bson.ObjectId) (*types.Cluster, error) {
	var cluster *types.Cluster
	err := d.db.View(func(tx *bolt.Tx) error {
		clusterBytes := tx.Bucket([]byte(bucketNameCluster)).Get([]byte(UID.Hex()))
		return bson.Unmarshal(clusterBytes, &cluster)
	})
	return cluster, err
}

func (d *Datastore) DeleteCluster(c *types.Cluster) error {
	return nil
}
