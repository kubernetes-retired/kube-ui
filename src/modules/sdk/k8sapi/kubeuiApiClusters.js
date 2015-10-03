angular.module('k8s.sdk.k8sapi').factory('kubeuiApiClusters', function(Restangular, k8sBaseProxyPath) {
  return Restangular.service('api/clusters');
})