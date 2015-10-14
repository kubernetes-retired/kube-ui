angular.module('k8s.sdk.k8sapi').factory('kubeuiApiClusters', function(Restangular) {
  return Restangular.service('api/clusters');
});