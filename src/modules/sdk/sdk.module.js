(function() {

  var vendorModules = [
    'ui.router',
    'ui.bootstrap',
    'restangular'
  ];

  var subModules = [
    'k8s.sdk.services',
    'k8s.sdk.directives',
    'k8s.sdk.k8sapi'
  ];

  angular.module('k8s.sdk', vendorModules.concat(subModules));

  _.forEach(subModules, function(moduleName) {
    angular.module(moduleName, vendorModules);
  });

  angular.module('k8s.sdk.k8sapi')
    .constant('k8sBaseProxyPath', '/api/clusters/:clusterId/proxy')
    .config(function(RestangularProvider) {
      RestangularProvider.addResponseInterceptor(function (data, operation, what, url, responses, deferred) {
        if(operation !== 'getList') {
          return data;
        }
        return _.isArray(data.items) ? data.items : data;
      });
    });
})();
