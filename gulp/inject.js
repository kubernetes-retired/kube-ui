var path = require('path');
var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var config = require('./config');
var lodash = require('lodash');

var plugins = require('gulp-load-plugins')();

gulp.task('inject', ['scripts', 'styles'], function () {
  var injectStyles = gulp.src([
    path.join(config.PATH.tmp, '/serve/styles/*.css'),
    path.join('!' + config.PATH.tmp, '/serve/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(config.PATH.src, '/app*.js'),
    path.join(config.PATH.src, '/modules/**/*.module.js'),
    path.join(config.PATH.src, '/modules/**/*.js'),
    path.join(config.PATH.src, '/components/**/*.module.js'),
    path.join(config.PATH.src, '/components/**/*.js'),
    path.join('!' + config.PATH.src, '/shared/**/*.js'), // todo: remove line
    path.join('!' + config.PATH.src, '/**/**/*.spec.js'),
    path.join('!' + config.PATH.src, '/**/**/*.mock.js'),
  ])

  var injectOptions = {
    ignorePath: [config.PATH.src, path.join(config.PATH.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(config.PATH.src, '/*.html'))
    .pipe(plugins.inject(injectStyles, injectOptions))
    .pipe(plugins.inject(injectScripts, injectOptions))
    .pipe(wiredep(lodash.extend({}, config.wiredep)))
    .pipe(gulp.dest(path.join(config.PATH.tmp, '/serve')));;
});
