angular.module('k8s.sdk.directives').directive('k8sLabelView', function() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      labels: '='
    },
    controller: function() {},
    controllerAs: 'ctrl',
    templateUrl: 'modules/sdk/partials/k8sLabelView.html'
  };
})