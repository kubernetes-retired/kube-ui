package types

import (
	"labix.org/v2/mgo/bson"
	"net/url"
)

// Cluster represents a Kubernetes cluster.
type Cluster struct {
	UID               bson.ObjectId `json:"uid"`
	Name              string        `json:"name"`
	KubeAPIURL        string        `json:"kubeApiUrl"`
	KubeAPIURLParsed  *url.URL      `json:"-"`
	KubeAPIAuthMethod string        `json:"kubeApiAuthMethod"`
}
