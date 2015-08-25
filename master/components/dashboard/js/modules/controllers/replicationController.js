/**=========================================================
 * Module: Replication
 * Visualizer for replication controllers
 =========================================================*/
(function() {
	function Replicationcontroller() {
	}

	Replicationcontroller.prototype.getdata = function(dataid) {
		this.scope.loading = true;
		this.k8sapi.getreplicationcontrollers(dataid).success(angular.bind(this, function(data) {
			this.scope.replicationcontroller = data;
			this.scope.loading = false;
		})).error(angular.bind(this, this.handleError));
	};

	Replicationcontroller.prototype.handleError = function(data, status, headers, config) {
		console.log("error (" + status + "): " + data);
		this.scope.loading = false;
	};

	app.controller('ReplicationControllerCtrl', [
		'$scope',
		'$routeParams',
		'k8sApi',
		function($scope, $routeParams, k8sApi) {
			$scope.controller = new ReplicationController();
			$scope.controller.k8sApi = k8sApi;
			$scope.controller.scope = $scope;
			$scope.controller.getData($routeParams.replicationControllerId);

			$scope.doTheBack = function() { window.history.back(); };
			$scope.getSelectorUrlFragment = function(sel){ return _.map(sel, function(v, k) { return k + '=' + v }).join(','); };

		}
	]);
})();
