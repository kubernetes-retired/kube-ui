package api

import (
	"encoding/json"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/kubernetes/kube-ui/server/datastore"
	"github.com/kubernetes/kube-ui/server/proxypool"
	"net/http"
)

type BaseContext struct {
	Datastore datastore.Datastore
	ProxyPool proxypool.Pool
}

type Context struct {
	*BaseContext
	w           http.ResponseWriter
	r           *http.Request
	validations BasicValidator
}

type errorResponse struct {
	StatusCode       int      `json:"statusCode"`
	Message          string   `json:"errorMessage"`
	ValidationErrors []string `json:"validationErrors"`
}

type BasicValidator interface {
	Add(isValid bool, validationErrorMsg string)
	Validate(c *Context) bool
}

type basicValidation struct {
	validations []*basicValidationEntry
}

func newBasicValidation() *basicValidation {
	return &basicValidation{
		validations: make([]*basicValidationEntry, 0),
	}
}

type basicValidationEntry struct {
	isInvalid          bool
	validationErrorMsg string
}

func (b *basicValidation) Add(isInvalid bool, validationErrorMsg string) {
	b.validations = append(b.validations, &basicValidationEntry{
		isInvalid:          isInvalid,
		validationErrorMsg: validationErrorMsg,
	})
}

func (b *basicValidation) Validate(c *Context) bool {
	e := &errorResponse{
		StatusCode:       http.StatusBadRequest,
		Message:          "validation errors occured",
		ValidationErrors: make([]string, 0),
	}
	valid := true
	for _, v := range b.validations {
		if v.isInvalid {
			valid = false
			e.ValidationErrors = append(e.ValidationErrors, v.validationErrorMsg)
		}
	}
	if !valid {
		c.WriteJSON(http.StatusBadRequest, e)
	}
	return valid
}

func (c *Context) WriteJSON(statusCode int, v interface{}) {
	e := json.NewEncoder(c.w)
	c.w.Header().Set("Content-Type", "application/json")
	if err := e.Encode(v); err != nil {
		c.w.WriteHeader(http.StatusInternalServerError)
	}
}

func (c *Context) ReadJSON(v interface{}) error {
	e := json.NewDecoder(c.r.Body)
	if err := e.Decode(v); err != nil {
		c.w.WriteHeader(http.StatusBadRequest)
	}
	return nil
}

func SetupRouter(c *BaseContext) http.Handler {
	// setup routes
	router := mux.NewRouter()

	n := negroni.New(negroni.NewRecovery())

	// kube-ui related routes
	router.HandleFunc("/api/clusters", handleFuncWithContext(listClusterHandler, c)).Methods("GET")
	router.HandleFunc("/api/clusters", handleFuncWithContext(createClusterHandler, c)).Methods("POST")
	router.HandleFunc("/api/clusters/{uid}", handleFuncWithContext(getClusterHandler, c)).Methods("GET")

	// kubernetes proxy handler
	router.HandleFunc("/api/clusters/{uid}/proxy/{rest:.*}", handleFuncWithContext(kubernetesProxyHandler, c))
	router.HandleFunc("/api/clusters/{uid}/proxy", handleFuncWithContext(kubernetesProxyHandler, c))
	n.UseHandler(router)
	return n
}

func handleFuncWithContext(h func(*Context), b *BaseContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		h(&Context{b, w, r, newBasicValidation()})
	}
}
