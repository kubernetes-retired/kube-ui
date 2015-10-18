
angular.module('k8s.core.controllers').controller('NavbarController', function($rootScope, k8sClusterNamespaceModal, k8sClusterNamespaceInfo, k8sSidebar) {
	this.openClusterNamespaceModal = function openClusterNamespaceModal() {
    k8sClusterNamespaceModal.open(true);
  };

  var setState = function() {
    this.selectedCluster = k8sClusterNamespaceInfo.getSelectedCluster();
    this.selectedNamespace = k8sClusterNamespaceInfo.getSelectedNamespace();
  }.bind(this);

  setState();

  this.isSidebarCollapsed = function isSidebarCollapsed() {
    return k8sSidebar.isCollapsed();
  };

  this.toggleSidebar = function toggleSidebar() {
    return k8sSidebar.toggle();
  }

  $rootScope.$on('k8sClusterNamespaceChangeSuccess', setState);
});