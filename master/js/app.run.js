app.run(['$route', angular.noop])
    .run(['lodash', function(lodash) {
      // Alias lodash
      window['_'] = lodash;
    }]);
