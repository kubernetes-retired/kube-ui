angular.module('k8s.sdk.directives').directive('k8sPagination', function() {
  return {
    restrict: 'E',
    require: '^stTable',
    templateUrl: 'modules/sdk/partials/k8sPagination.html',
  };
});