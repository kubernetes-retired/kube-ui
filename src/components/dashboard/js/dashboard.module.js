angular.module('k8s.components.dashboard', [
	'k8s.sdk',
	'k8s.components.dashboard.states',
	'k8s.components.dashboard.controllers',
	'k8s.components.dashboard.services',
	'k8s.components.dashboard.directives'
]);

angular.module('k8s.components.dashboard.states', []);
angular.module('k8s.components.dashboard.controllers', []);
angular.module('k8s.components.dashboard.services', []);
angular.module('k8s.components.dashboard.directives', []);

angular.module('k8s.components.dashboard').config(function(k8sMenuProvider) {
	k8sMenuProvider.addSidebarSection('k8s.components.dashboard', 'Cluster overview', 0)
		.addMenuEntry('Dashboard', 'k8s.components.dashboard');
});