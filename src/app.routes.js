angular.module('k8s.app')
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    // route for choosing the default cluster and namespace
    $stateProvider.state('root', {
      url: '/',
      template: '<div></div>',
      resolve: {
        /* @ngInject */
        k8sClusterNamespace: function(k8sClusterNamespaceInfo) {
          return k8sClusterNamespaceInfo._selectDefault();
        }
      },
      /* @ngInject */
      onEnter: function(k8sClusterNamespaceInfo, $state, k8sClusterNamespaceModal) {
        if (k8sClusterNamespaceInfo.getSelectedCluster() === null) {
          k8sClusterNamespaceModal.open(false);
          return;
        }
        var clusterUid = k8sClusterNamespaceInfo.getSelectedCluster().uid;
        var namespaceName = k8sClusterNamespaceInfo.getSelectedNamespace().metadata.name;
        $state.transitionTo('k8s.components.dashboard', {
          clusterUid: clusterUid,
          namespaceName: namespaceName
        }, {location:'replace'});  
      }
    });

    // route for main application layout
    $stateProvider.state('k8s', {
      url: '/cluster/{clusterUid}/ns/{namespaceName}',
      abstract: true,
      controller: 'MainContentController',
      controllerAs: 'main',
      templateUrl: 'modules/core/partials/layout/main.html',
      resolve: {
        /* @ngInject */
        k8sSelectClusterNamespaceFromURL: function($stateParams, k8sClusterNamespaceInfo) {
          return k8sClusterNamespaceInfo.selectClusterNamespace($stateParams.clusterUid, $stateParams.namespaceName);
        }
      }
    });

    // base route for all components
    $stateProvider.state('k8s.components', {
      abstract: true,
      url: '/components',
      template: '<div class="row"><div class="col-md-12" ui-view></div></div>'
    });
  })
  .run(function($rootScope, $state, k8sClusterNamespaceInfo) {
    var loadedClusterInfo = false;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (!loadedClusterInfo && toState.name !== 'root' && fromState.name === '') {
        event.preventDefault();
        k8sClusterNamespaceInfo.selectClusterNamespace(toParams.clusterUid, toParams.namespaceName, false).then(function() {
          loadedClusterInfo = true;
          $state.go(toState.name, toParams);
        }, function(error) {
          $state.go('error', {
            uiRouterDetails: JSON.stringify({
              toState: toState,
              toParams: toParams,
              fromState: fromState,
              fromParams: fromParams,
              error: error
            })
          });
        });
      }
    })

    // general state error handling
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // we prevent the $UrlRouter from reverting the URL to the previous valid location (in case of a URL navigation).
      event.preventDefault();
      console.error('$stateChangeError', error, event, toState, toParams, fromState, fromParams);
      $state.go('error', {
        uiRouterDetails: JSON.stringify({
          toState: toState,
          toParams: toParams,
          fromState: fromState,
          fromParams: fromParams,
          error: error
        })
      }, {
        location: false
      })
    });
  });