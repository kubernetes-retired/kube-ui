angular.module('k8s.core.controllers').controller('MainContentController', function(k8sSidebar) {
  this.isSidebarCollapsed = function() {
    return k8sSidebar.isCollapsed();
  };
});