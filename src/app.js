(function() {
  var coreModules = [
    'k8s.sdk',
  	'k8s.core',
  	'k8s.components.dashboard',
  	'k8s.components.clustermanagement'
  ];

  var k8sVendorModules = window.k8sVendorModules || [];

  var ngModules = coreModules
  	.concat(k8sVendorModules);

  /** 
   * main application module - used in ng-app 
   */
  angular.module('k8s.app', ngModules);
})();
