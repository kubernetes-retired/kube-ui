angular.module('k8s.components.clustermanagement.replicationControllers.controllers')
  .controller('ModifyReplicasModalController', function(replicationController, $interval, k8sApiReplicationControllers, $scope) {
    this.replicationController = replicationController;
    this.replicas = this.replicationController.spec.replicas;
    this.saveSuccess = null;

    this.save = function save() {
      if (this.saveInProgress) {
        return;
      }
      this.saveInProgress = true;
      this.saveSuccess = null;
      this.replicationController.spec.replicas = this.replicas;
      this.replicationControllerPromise = this.replicationController.put().then(function() {
        this.saveSuccess = true;
      }.bind(this), function() {
        this.saveSuccess = false;
      }.bind(this)).finally(function() {
        this.saveInProgress = false;
      });
    };
  });