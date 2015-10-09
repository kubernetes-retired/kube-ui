angular.module('k8s.core.states').config(function($stateProvider) {
  $stateProvider.state('error', {
    url: '/error?uiRouterDetails',
    controller: 'ErrorController',
    controllerAs: 'ctrl',
    templateUrl: 'modules/core/partials/pages/error.html'
  });
});

angular.module('k8s.core.controllers')
.controller('ErrorController', function($stateParams) {
  this.$stateParams = angular.copy($stateParams);
  if (this.$stateParams.uiRouterDetails) {
    this.$stateParams.uiRouterDetails = JSON.parse(this.$stateParams.uiRouterDetails);
  }

  this.isObject = function isObject(value) {
    return _.isObject(value);
  };
});