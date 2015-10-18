describe('Controller: NavbarController', function() {
  var $rootScope;
  var $controller;

  var k8sClusterNamespaceInfo;
  var k8sClusterNamespaceModal;
  var navbarController;

  beforeEach(function() {
    module('k8s.core.controllers');

    module(function($provide) {
      k8sClusterNamespaceModal = jasmine.createSpyObj('k8sClusterNamespaceModal', ['open']);
      $provide.value('k8sClusterNamespaceModal', k8sClusterNamespaceModal);

      k8sClusterNamespaceInfo = jasmine.createSpyObj('k8sClusterNamespaceInfo', ['getSelectedCluster', 'getSelectedNamespace']);
      $provide.value('k8sClusterNamespaceInfo', k8sClusterNamespaceInfo);
    });

    inject(function(_$rootScope_, _$controller_) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
    });
  });

  createController = function() {
    navbarController = $controller('NavbarController', {});
  };

  it('should hold the selected cluster & namespace', function() {
    var cluster = {
      uuid: '123'
    };
    var namespace = {
      metadata: {
        name: 'default'
      }
    };
    k8sClusterNamespaceInfo.getSelectedCluster.and.returnValue(cluster);
    k8sClusterNamespaceInfo.getSelectedNamespace.and.returnValue(namespace);
    createController();

    expect(k8sClusterNamespaceInfo.getSelectedCluster).toHaveBeenCalled();
    expect(k8sClusterNamespaceInfo.getSelectedNamespace).toHaveBeenCalled();
    expect(navbarController.selectedCluster).toEqual(cluster);
    expect(navbarController.selectedNamespace).toEqual(namespace);
  });

  it('should refresh current cluster/namespace on cluster/namespace change event', function() {
    createController();
    k8sClusterNamespaceInfo.getSelectedCluster.calls.reset();
    k8sClusterNamespaceInfo.getSelectedNamespace.calls.reset();

    $rootScope.$emit('k8sClusterNamespaceChangeSuccess');
    $rootScope.$digest();
    expect(k8sClusterNamespaceInfo.getSelectedCluster).toHaveBeenCalled();
    expect(k8sClusterNamespaceInfo.getSelectedNamespace).toHaveBeenCalled();
  });
});