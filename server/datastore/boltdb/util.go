package boltdb

import (
	"github.com/boltdb/bolt"
)

func (d *Datastore) getAllInBucket(bucketName string, iterateFn func(key []byte, value []byte) error) error {
	return d.db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			if err := iterateFn(k, v); err != nil {
				return err
			}
		}
		return nil
	})
}
