angular.module('k8s.sdk.filters').filter('k8sTimeSince', function() {
  return function(value) {
    return moment(value).fromNow();
  };
});