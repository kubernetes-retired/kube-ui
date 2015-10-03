angular.module('k8s.sdk.directives').directive('k8sLoading', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      promise: '='
    },
    templateUrl: 'modules/sdk/partials/k8sLoading.html',
    link: function(scope, elem, attrs) {
      scope.show = !attrs.promise;

      scope.$watch('promise', function(promise) {
        if (!_.isObject(promise) || !_.isFunction(promise.then)) {
          return;
        }
        scope.show = true;
        promise.finally(function() {
          scope.show = false;
        })
      })
    }
  };
});