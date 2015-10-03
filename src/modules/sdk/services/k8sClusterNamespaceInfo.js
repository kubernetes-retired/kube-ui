angular.module('k8s.sdk.services').service('k8sClusterNamespaceInfo', function($q, kubeuiApiClusters, k8sApiNamespaces, $state) {

  var selectedCluster = null;
  var selectedNamespace = null;
  
  this.selectClusterNamespace = function selectClusterNamespace(clusterUid, namespaceName, changeState) {
    return kubeuiApiClusters.one(clusterUid).get().then(function(cluster) {
      selectedCluster = cluster;
      return k8sApiNamespaces(clusterUid).one(namespaceName).get().then(function(namespace) {
        selectedNamespace = namespace;
      }).then(function() {
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
    })
    });
  };

  this.getSelectedCluster = function getSelectedCluster() {
    return selectedCluster;
  };

  this.getSelectedNamespace = function getSelectedNamespace() {
    return selectedNamespace;
  };

  this.selectDefault = function selectDefault() {
    selectedCluster = null;
    selectedNamespace = null;
    return kubeuiApiClusters.getList().then(function(availableClusters) {
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