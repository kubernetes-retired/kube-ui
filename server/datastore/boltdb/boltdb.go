package boltdb

import (
	"github.com/boltdb/bolt"
)

type Datastore struct {
	dbFile string
	db     *bolt.DB
}

func NewBoltDBDataStore(dbFile string) *Datastore {
	return &Datastore{
		dbFile: dbFile,
	}
}

func (d *Datastore) Connect() error {
	db, err := bolt.Open(d.dbFile, 0600, nil)
	if err != nil {
		return err
	}
	d.db = db
	return nil
}

func (d *Datastore) InitDatastoreStructure() error {
	return d.db.Batch(func(tx *bolt.Tx) error {
		if _, err := tx.CreateBucketIfNotExists([]byte(bucketNameCluster)); err != nil {
			return err
		}
		return nil
	})
}

func (d *Datastore) Disconnect() error {
	return d.db.Close()
}
