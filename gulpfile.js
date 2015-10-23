var gulp = require('gulp');
var wrench = require('wrench');
var runSequence = require('run-sequence').use(gulp);

/**
 * Load all files in gulp directory
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

gulp.task('default', function() {
  runSequence('test:unit', 'build')
});