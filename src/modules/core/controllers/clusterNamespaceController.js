angular.module('k8s.core.controllers').controller('ClusterNamespaceController', function($scope, kubeuiApiClusters, k8sClusterNamespaceInfo, k8sApiNamespaces, isClosable, $state, $timeout) {
  this.isClosable = isClosable;
  this.clusters = null;
  this.newCluster = {
    kubeApiUrl: 'http://'
  };

  this.selectedClusterUid = k8sClusterNamespaceInfo.getSelectedCluster() ? k8sClusterNamespaceInfo.getSelectedCluster().uid : null;
  this.selectedNamespaceName = k8sClusterNamespaceInfo.getSelectedNamespace() ? k8sClusterNamespaceInfo.getSelectedNamespace().metadata.name : null;

  this.loadClusters = function loadClusters() {
    this.clusters = null;
    this.clusterPromise = kubeuiApiClusters.getList().then(function(data) {
      this.clusters = data;
      if (this.clusters.length > 0) {
        if (this.clusters.length === 1 && this.selectedClusterUid === null) {
          this.selectedClusterUid = this.clusters[0].uid;
        }
        return this.loadNamespaces();
      }
    }.bind(this))
  }
  this.loadClusters();

  /**
   * loads all available namespaces for the currently selected cluster.
   */
  this.loadNamespaces = function loadNamespaces() {
    if (!this.selectedClusterUid) {
      return;
    }
    this.namespaces = null;
    this.namespacePromise = k8sApiNamespaces(this.selectedClusterUid).getList().then(function(data) {
      this.namespaces = data;
      if (this.namespaces.length === 1) {
        this.selectedNamespaceName = this.namespaces[0].metadata.name;
      }
    }.bind(this))
  };

  /**
   * this method gets called when the user submits the "create cluster" form in modal window.
   */
  this.createCluster = function createCluster() {
    this.clusterCreatePromise = kubeuiApiClusters.post(this.newCluster).then(function() {
      $timeout(function() {
        this.loadClusters();
      }.bind(this), 200);
    }.bind(this)).finally(function() {
      this.newCluster = {};
    }.bind(this));
  };

  /**
   * this method gets called when the user submits the "create namespace" form in modal window.
   */
  this.createNamespace = function createNamespace() {
    this.namespacePromise = k8sApiNamespaces(this.currentClusterUid).post({
      metadata: {
        name: this.newNamespaceName
      }
    }).finally(function() {
      this.newNamespaceName = '';
      this.loadNamespaces();
    }.bind(this));
  };

  this.useCurrentSettings = function useCurrentSettings() {
    var activeNamespaceName = k8sClusterNamespaceInfo.getSelectedNamespace() ? k8sClusterNamespaceInfo.getSelectedNamespace().metadata.name : null;
    var activeClusterUid = k8sClusterNamespaceInfo.getSelectedCluster() ? k8sClusterNamespaceInfo.getSelectedCluster().uid : null;
    if (this.selectedClusterUid !== activeClusterUid || this.selectedNamespaceName !== activeNamespaceName) {
      // cluster or namespace changed
      k8sClusterNamespaceInfo.selectClusterNamespace(this.selectedClusterUid, this.selectedNamespaceName, true);
      $scope.$close();
    }
  };
});
