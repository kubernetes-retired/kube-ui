'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === config.PATH.src || (util.isArray(baseDir) && baseDir.indexOf(config.PATH.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line bellow.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.0.5/README.md
   */
  server.middleware = proxyMiddleware('/api', {target: 'http://localhost:8080', proxyHost: 'localhost'});



  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}

/*browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));*/

gulp.task('serve', ['html', 'watch'], function () {
  browserSyncInit([path.join(config.PATH.tmp, '/serve'), config.PATH.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(config.PATH.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([config.PATH.tmp + '/serve', config.PATH.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(config.PATH.dist, []);
});
