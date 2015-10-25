angular.module('k8s.sdk.restApi').factory('k8sKubeUiApiClusters', function(Restangular) {
  return Restangular.service('api/clusters');
});