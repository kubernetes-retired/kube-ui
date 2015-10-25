angular.module('k8s.sdk.restApi').factory('k8sApiReplicationControllers', function(Restangular, k8sBaseProxyPath) {
  return function(clusterId, namespace) {
    return Restangular.service('api/clusters/' + clusterId + '/proxy/api/v1/namespaces/' + namespace + '/replicationcontrollers');
  };
});