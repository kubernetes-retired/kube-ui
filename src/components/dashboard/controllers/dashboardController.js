angular.module('k8s.components.dashboard.states').config(function($stateProvider) {
  $stateProvider.state('k8s.components.dashboard', {
    url: '/dashboard',
    controller: 'DashboardController',
    controllerAs: 'dashboard',
    templateUrl: 'components/dashboard/views/dashboard.html'
  });
});

angular.module('k8s.components.dashboard.controllers')
  .controller('DashboardController', function(k8sClusterNamespaceInfo, k8sApiNodes, k8sApiReplicationControllers, k8sApiPods, k8sApiServices) {
    this.nodes = null;
    this.replicationControllers = null;
    this.pods = null;
    this.services = null;

    this.cluster = k8sClusterNamespaceInfo.getSelectedCluster();
    this.namespace = k8sClusterNamespaceInfo.getSelectedNamespace();

    this.nodesPromise = k8sApiNodes(this.cluster.uid).getList().then(function(data) {
      this.nodes = data;
    }.bind(this));

    this.replicationControllersPromise = k8sApiReplicationControllers(this.cluster.uid, this.namespace.metadata.name).getList().then(function(data) {
      this.replicationControllers = data;
    }.bind(this));

    this.podsPromise = k8sApiPods(this.cluster.uid, this.namespace.metadata.name).getList().then(function(data) {
      this.pods = data;
    }.bind(this));

    this.servicesPromise = k8sApiServices(this.cluster.uid, this.namespace.metadata.name).getList().then(function(data) {
      this.services = data;
    }.bind(this));  
  });