
angular.module('k8s.core.controllers').controller('NavbarController', function(k8sClusterNamespaceModal, k8sClusterNamespaceInfo) {
	this.openClusterNamespaceModal = function openClusterNamespaceModal() {
    k8sClusterNamespaceModal.open(true);
  };

  this.selectedCluster = k8sClusterNamespaceInfo.getSelectedCluster();
  this.selectedNamespace = k8sClusterNamespaceInfo.getSelectedNamespace();
});