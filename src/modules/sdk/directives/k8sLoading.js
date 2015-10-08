angular.module('k8s.sdk.directives').controller('K8sLoadingController', function($scope, $attrs) {
  this.showLoading = !$attrs.promise;
  this.showErrorMessage = false;

  $scope.$watch('ctrl.promise', function(promise) {
    if (!_.isObject(promise) || !_.isFunction(promise.then)) {
      return;
    }
    scope.showLoading = true;
    promise.finally(function() {
      this.showLoading = false;
    }.bind(this));

    promise.catch(function() {
      this.showErrorMessage = true;
    }.bind(this));
  });
})

angular.module('k8s.sdk.directives').directive('k8sLoading', function() {
  return {
    restrict: 'E',
    scope: {},
    controller: 'K8sLoadingController',
    controllerAs: 'ctrl',
    bindToController: {
      promise: '='
    },
    templateUrl: 'modules/sdk/partials/k8sLoading.html'
  };
});