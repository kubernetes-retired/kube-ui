(function() {
  "use strict";

  angular.module('kubernetesApp.services')
    .provider('k8sApi',
             function() {

               var urlBase = '';
               var _namespace = undefined;

               this.setUrlBase = function(value) { urlBase = value; };

               this.setNamespace = function(value) { _namespace = value; };
               this.getNamespace = function() { return _namespace; };

               var _get = function($http, baseUrl, query) {
                 var _fullUrl = baseUrl;

                 if (query !== undefined) {
                   _fullUrl += '/' + query;
                 }

                 return $http.get(_fullUrl);
               };

               this.$get = function($http, $q) {
                 var api = {};

                 api.getUrlBase = function() { return urlBase; };

                 api.getNamespacedUrlBase = function(namespace) {
                   var ns = namespace || _namespace;
                   return ns ?
                       urlBase + '/namespaces/' + ns :
                       urlBase;
                 };

                 api.getPods = function(query, namespace) { return _get($http, api.getNamespacedUrlBase(namespace) + '/pods', query); };

                 api.getNodes = function(query) { return _get($http, urlBase + '/nodes', query); };

                 api.getMinions = api.getNodes;

                 api.getServices = function(query, namespace) { return _get($http, api.getNamespacedUrlBase(namespace) + '/services', query); };

                 api.getReplicationControllers = function(query, namespace) {
                   return _get($http, api.getNamespacedUrlBase(namespace) + '/replicationcontrollers', query);
                 };

                 api.getEvents = function(query) { return _get($http, api.getNamespacedUrlBase() + '/events', query); };

                 return api;
               };
             })
    .config(function(k8sApiProvider, ENV) {
      if (ENV && ENV['/'] && ENV['/']['k8sApiServer']) {
        var base = ENV['/']['k8sApiServer']

        if (base[0] == '/') {
          // try to find the k8sApiServer location in the current path, falling
          // back to <k8sApiServer> if not found:
          // e.g.: /some/prefix/api/v1/proxy/.../kube-ui => /some/prefix/api/v1
          //       /kube-ui                              => /api/v1
          //       /a/api/v1/b/api/v1/.../kube-ui        => /a/api/v1/b/api/v1
          var i = window.location.pathname.lastIndexOf(base)
          if (i != -1) {
            base = window.location.pathname.substr(0, i + base.length)
          }
        }

        k8sApiProvider.setUrlBase(base);
      }
    });
})();
