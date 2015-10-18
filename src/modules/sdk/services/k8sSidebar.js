angular.module('k8s.sdk.services').service('k8sSidebar', function() {
  var state = {
    collapsed: false
  };
  
  this.isCollapsed = function isCollapsed() {
    return state.collapsed;
  };

  this.show = function show() {
    state.collapsed = false;
  };

  this.toggle = function toggle() {
    state.collapsed = !state.collapsed;
  };
});