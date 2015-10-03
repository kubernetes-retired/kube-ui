var gulp = require('gulp');
var wrench = require('wrench');

/**
 * Load all files in gulp directory
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});