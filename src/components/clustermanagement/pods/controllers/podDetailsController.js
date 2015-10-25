angular.module('k8s.components.clustermanagement.pods.states')
  .config(function($stateProvider) {
    $stateProvider.state('k8s.components.clustermanagement.pods.details', {
      url: '/details/:podName',
      controller: 'PodDetailsController',
      controllerAs: 'ctrl',
      templateUrl: 'components/clustermanagement/pods/partials/pod.details.html',
      resolve: {
        /** @ngInject */
        pod: function(k8sApiPods, k8sClusterNamespaceInfo, $stateParams) {
          return k8sApiPods(k8sClusterNamespaceInfo.getSelectedCluster().uid, k8sClusterNamespaceInfo.getSelectedNamespace().metadata.name).one($stateParams.podName).get();
        }
      }
    });
  });

angular.module('k8s.components.clustermanagement.pods.controllers')
  .controller('PodDetailsController', function(pod) {
    this.pod = pod;
    this.containerStatusesByName = _.indexBy(this.pod.status.containerStatuses, 'name');
  });