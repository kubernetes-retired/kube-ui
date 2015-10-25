angular.module('k8s.components.clustermanagement.replicationControllers.states')
  .config(function($stateProvider) {
    $stateProvider.state('k8s.components.clustermanagement.replicationControllers.list', {
      url: '/list',
      controller: 'ReplicationControllerListController',
      controllerAs: 'ctrl',
      templateUrl: 'components/clustermanagement/replicationControllers/partials/replicationController.list.html',
      resolve: {
        /** @ngInject */
        rcs: function(k8sApiReplicationControllers, k8sClusterNamespaceInfo, k8sSelectClusterNamespaceFromURL) {
          return k8sApiReplicationControllers(k8sClusterNamespaceInfo.getSelectedCluster().uid, k8sClusterNamespaceInfo.getSelectedNamespace().metadata.name).getList();
        }
      }
    });
  });

angular.module('k8s.components.clustermanagement.replicationControllers.controllers')
  .controller('ReplicationControllerListController', function(rcs, $uibModal) {
    this.replicationControllers = rcs;

    this.modifyReplicas = function modifyReplicas(replicationController) {
      $uibModal.open({
        controller: 'ModifyReplicasModalController',
        controllerAs: 'ctrl',
        templateUrl: 'components/clustermanagement/replicationControllers/partials/replicationController.modifyReplicas.html',
        resolve: {
          replicationController: function() {
            return replicationController;
          }
        }
      });
    };

    this.deleteRc = function deleteRc(replicationController) {
      $uibModal.open({
        controller: 'ReplicationControllerDeleteModalController',
        controllerAs: 'ctrl',
        templateUrl: 'components/clustermanagement/replicationControllers/partials/replicationController.delete.html',
        resolve: {
          replicationController: function() {
            return replicationController;
          }
        }
      });
    };
  });