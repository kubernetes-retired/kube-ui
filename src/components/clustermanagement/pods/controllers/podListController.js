angular.module('k8s.components.clustermanagement.pods.states')
  .config(function($stateProvider) {
    $stateProvider.state('k8s.components.clustermanagement.pods.list', {
      url: '/list',
      controller: 'PodListController',
      controllerAs: 'ctrl',
      templateUrl: 'components/clustermanagement/pods/partials/pod.list.html',
      resolve: {
        /** @ngInject */
        pods: function(k8sApiPods, k8sClusterNamespaceInfo) {
          return k8sApiPods(k8sClusterNamespaceInfo.getSelectedCluster().uid, k8sClusterNamespaceInfo.getSelectedNamespace().metadata.name).getList();
        }
      }
    });
  });

angular.module('k8s.components.clustermanagement.pods.controllers')
  .controller('PodListController', function(pods) {
    this.pods = pods;
  });