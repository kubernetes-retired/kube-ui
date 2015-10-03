angular.module('k8s.core.controllers').controller('SidebarController', function(k8sMenu) {
	this.sections = k8sMenu.getSidebarSections();
});