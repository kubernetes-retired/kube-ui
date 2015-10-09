angular.module('k8s.sdk.k8sapi').factory('k8sApiEvents', function(Restangular, k8sBaseProxyPath) {
  return function(clusterId, namespaceName) {
    return Restangular.service('api/clusters/' + clusterId + '/proxy/api/v1/namespaces/' + namespaceName + '/events');
  };
})