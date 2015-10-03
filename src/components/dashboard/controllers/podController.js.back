/**=========================================================
 * Module: Pods
 * Visualizer for pods
 =========================================================*/

/* todo: replace */angular.module('k8s.app').controller('PodCtrl', [
  '$scope',
  '$interval',
  '$stateParams',
  'k8sApi',
  '$rootScope',
  function($scope, $interval, $stateParams, k8sApi, $rootScope) {
    'use strict';
    $scope.doTheBack = function() { window.history.back(); };

    $rootScope.doTheBack = $scope.doTheBack;

    $scope.handleError = function(data, status, headers, config) {
      console.log("Error (" + status + "): " + data);
      $scope_.loading = false;
    };

    $scope.handlePod = function(podId, namespaceId) {
      $scope.loading = true;
      k8sApi.getPods(podId, namespaceId).success(angular.bind(this, function(data) {
        $scope.pod = data;
        $scope.loading = false;
      })).error($scope.handleError);
    };
    
    $scope.handlePod($stateParams.podId);
  }
]);
