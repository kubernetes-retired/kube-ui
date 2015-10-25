angular.module('k8s.components.clustermanagement.pods', [
  'k8s.components.clustermanagement.pods.states',
  'k8s.components.clustermanagement.pods.controllers'
]);

angular.module('k8s.components.clustermanagement.pods.controllers', []);

angular.module('k8s.components.clustermanagement.pods.states', [])
  .config(function($stateProvider) {
    $stateProvider.state('k8s.components.clustermanagement.pods', {
      url: '/pods',
      abstract: true,
      template: '<div class="row"><div class="col-md-12" ui-view></div></div>'
    });
  });