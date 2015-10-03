angular.module('k8s.core.services')
  /**
   * todo: maybe move this to k8s.sdk module? (maybe its useful for other component developers to open the modal)
   */
  .service('k8sClusterNamespaceModal', function($modal, $q) {
    /**
     * @param {boolean=} closable Is the user allowed to close the modal window?
     */
    this.open = function open(closable) {
      var modalConfig = {
        templateUrl: 'modules/core/partials/modals/clusterNamespaceSettings.html',
        controller: 'ClusterNamespaceController',
        controllerAs: 'ctrl',
        resolve: {
          isClosable: $q.resolve(true)
        }
      };
      if (closable === false) {
        modalConfig.backdrop = 'static';
        modalConfig.keyboard = false;
        modalConfig.resolve.isClosable = $q.resolve(false);
      }
      return $modal.open(modalConfig);
    };
  });