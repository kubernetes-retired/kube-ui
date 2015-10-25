angular.module('k8s.components.clustermanagement.replicationControllers.controllers')
  .controller('ReplicationControllerDeleteModalController', function(replicationController) {
    this.replicationController = replicationController;
    this.deleteInProgress = null;
    this.deleteSuccess = null;

    this.deleteRc = function deleteRc() {
      if (this.deleteInProgress) {
        return;
      }
      this.deleteInProgress = true;

      this.replicationControllerPromise = this.replicationController.remove().then(function() {
        this.deleteSuccess = true;
      }.bind(this), function() {
        this.deleteSuccess = false;
      }.bind(this)).finally(function() {
        this.deleteInProgress = false;
      });
    };
  });