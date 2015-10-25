angular.module('k8s.components.clustermanagement', [
  'k8s.sdk',
  'k8s.components.clustermanagement.pods',
  'k8s.components.clustermanagement.replicationControllers'
]);

angular.module('k8s.components.clustermanagement')
  .config(function($stateProvider, k8sMenuProvider) {
  	k8sMenuProvider.addSidebarSection('k8s.components.clustermanagement', 'Cluster management', 1)
  		.addMenuEntry('Pods', 'k8s.components.clustermanagement.pods.list')
  		.addMenuEntry('Services', 'k8s.components.clustermanagement.services.list')
  		.addMenuEntry('Replication Controllers', 'k8s.components.clustermanagement.replicationControllers.list')
      .addMenuEntry('Nodes', 'k8s.components.clustermanagement.nodes.list')
      .addMenuEntry('Events', 'k8s.components.clustermanagement.events.list');

    $stateProvider.state('k8s.components.clustermanagement', {
      abstract: true,
      url: '/clustermanagement',
      template: '<div class="row"><div class="col-md-12" ui-view></div></div>'
    });
  });