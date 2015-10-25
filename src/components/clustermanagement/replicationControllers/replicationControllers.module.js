angular.module('k8s.components.clustermanagement.replicationControllers', [
  'k8s.components.clustermanagement.replicationControllers.states',
  'k8s.components.clustermanagement.replicationControllers.controllers'
]);

angular.module('k8s.components.clustermanagement.replicationControllers.controllers', []);

angular.module('k8s.components.clustermanagement.replicationControllers.states', [])
  .config(function($stateProvider) {
    $stateProvider.state('k8s.components.clustermanagement.replicationControllers', {
      url: '/replicationcontrollers',
      abstract: true,
      template: '<div class="row"><div class="col-md-12" ui-view></div></div>'
    });
  });