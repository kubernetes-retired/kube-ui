angular.module('k8s.sdk.restApi').factory('k8sApiNamespaces', function(Restangular, k8sBaseProxyPath) {
  return function(clusterId) {
    return Restangular.service('api/clusters/' + clusterId + '/proxy/api/v1/namespaces');
  };
})