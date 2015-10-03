angular.module('k8s.components.clustermanagement', [
	'k8s.sdk',
	'k8s.components.clustermanagement.controllers',
	'k8s.components.clustermanagement.services',
	'k8s.components.clustermanagement.directives'
]);

angular.module('k8s.components.clustermanagement.controllers', []);
angular.module('k8s.components.clustermanagement.services', []);
angular.module('k8s.components.clustermanagement.directives', []);

angular.module('k8s.components.clustermanagement').config(function(k8sMenuProvider) {
	k8sMenuProvider.addSidebarSection('k8s.clustermanagement', 'Cluster management', 1)
		.addMenuEntry('Pods', 'k8s.clustermanagement.podsList')
		.addMenuEntry('Services', 'k8s.clustermanagement.servicesList')
		.addMenuEntry('Replication Controllers', 'k8s.clustermanagement.replicationControllersList')
    .addMenuEntry('Events', 'k8s.clustermanagement.replicationControllersList');
});