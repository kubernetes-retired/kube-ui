angular.module('k8s.sdk.services').service('k8sClusterNamespaceInfo', function($q, k8sKubeUiApiClusters, k8sApiNamespaces, $state, $rootScope) {

  var selectedCluster = null;
  var selectedNamespace = null;
  
  this.selectClusterNamespace = function selectClusterNamespace(clusterUid, namespaceName, changeState) {
    return k8sKubeUiApiClusters.one(clusterUid).get().then(function(cluster) {
      selectedCluster = cluster;
      return k8sApiNamespaces(clusterUid).one(namespaceName).get().then(function(namespace) {
        selectedNamespace = namespace;

        if (!changeState) {
          return;
        }

        $state.go($state.current.name, {
          clusterUid: selectedCluster.uid,
          namespaceName: selectedNamespace.metadata.name
        }, {
          reload: true,
          location: 'replace'
        });

        $rootScope.$emit('k8sClusterNamespaceChangeSuccess', selectedCluster, selectedNamespace);
        return true;
      });
    });
  };

  this.getSelectedCluster = function getSelectedCluster() {
    return selectedCluster;
  };

  this.getSelectedNamespace = function getSelectedNamespace() {
    return selectedNamespace;
  };

  /**
   * @private
   * @return {$q.Promise} A promise that gets resolved when the cluster and namespace are selected successfuly.
   */
  this._selectDefault = function selectDefault() {
    selectedCluster = null;
    selectedNamespace = null;
    return k8sKubeUiApiClusters.getList().then(function(availableClusters) {
      if (availableClusters.length === 0) {
        return;
      }
      selectedCluster = availableClusters[0];
      return k8sApiNamespaces(selectedCluster.uid).getList().then(function(namespaces) {
        if (namespaces.length > 0) {
          selectedNamespace = namespaces[0];
          return;
        }
      });
    });
  };
});