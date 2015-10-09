angular.module('k8s.core.controllers').controller('K8sEventBarController', function(k8sClusterNamespaceInfo, k8sClusterNamespaceInfo, k8sApiEvents, $interval, $rootScope) {
  this.showBar = false;

  this.toggleBar = function toggleBar() {
    this.showBar = !this.showBar;
  };

  this.loadEvents = function loadEvents(isInitialLoad) {
    var promise = k8sApiEvents(k8sClusterNamespaceInfo.getSelectedCluster().uid, k8sClusterNamespaceInfo.getSelectedNamespace().metadata.name).getList().then(function(events) {
      this.events = events;
    }.bind(this));

    if (isInitialLoad) {
      this.eventsPromise = promise;
    }
  };

  // TODO: make this configurable in the future
  $interval(function() {
    this.loadEvents(false);
  }.bind(this), 3000);

  this.loadEvents(true);
});