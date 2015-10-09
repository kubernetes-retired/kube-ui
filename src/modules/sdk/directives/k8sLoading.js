angular.module('k8s.sdk.directives').controller('K8sLoadingController', function($scope, $attrs, $timeout) {
  this.showLoading = !$attrs.promise;
  this.showErrorMessage = false;

  $scope.$watch('ctrl.promise', function(promise) {
    if (!_.isObject(promise) || !_.isFunction(promise.then)) {
      return;
    }
    
    var showTimeout = $timeout(function() {
      this.showLoading = true;
    }.bind(this), 200);
    
    promise.finally(function() {
      if (showTimeout) {
        $timeout.cancel(showTimeout);
      }
      this.showLoading = false;
    }.bind(this));

    promise.catch(function() {
      this.showErrorMessage = true;
    }.bind(this));
  }.bind(this));
})

angular.module('k8s.sdk.directives').directive('k8sLoading', function() {
  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    controller: 'K8sLoadingController',
    controllerAs: 'ctrl',
    bindToController: {
      promise: '=',
      errorMessage: '=',
      size: '@',
      hideErrorMessage: '@'
    },
    templateUrl: 'modules/sdk/partials/k8sLoading.html'
  };
});