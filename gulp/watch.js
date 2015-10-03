'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

  gulp.watch([path.join(config.PATH.src, '/*.html'), 'bower.json'], ['inject']);

  gulp.watch([
    path.join(config.PATH.src, '/**/*.css'),
    path.join(config.PATH.src, '/**/*.scss')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles');
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(config.PATH.src, '/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts');
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(config.PATH.src, '/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});
