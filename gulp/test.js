var path = require('path');
var gulp = require('gulp');

var karma = require('karma');

function runTests (singleRun, done) {
  var server = new karma.Server({
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, function() {
    done();
  });
  server.start();
}

gulp.task('test:unit', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:unit:watch', ['watch'], function(done) {
  runTests(false, done);
});