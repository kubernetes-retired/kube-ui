package types

import (
	"net/url"

	"labix.org/v2/mgo/bson"
)

// Cluster represents a Kubernetes cluster.
type Cluster struct {
	UID               bson.ObjectId `json:"uid"`
	Name              string        `json:"name"`
	KubeAPIURL        string        `json:"kubeApiUrl"`
	KubeAPIURLParsed  *url.URL      `json:"-"`
	KubeAPIAuthMethod string        `json:"kubeApiAuthMethod"`
}
