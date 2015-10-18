angular.module('k8s.core.controllers').controller('SidebarController', function(k8sMenu, k8sSidebar) {
	this.sections = k8sMenu.getSidebarSections();

  this.isSidebarCollapsed = function isSidebarCollapsed() {
    return k8sSidebar.isCollapsed();
  }
});