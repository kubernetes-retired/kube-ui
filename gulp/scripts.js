var gulp = require('gulp');
var config = require('./config');
var browserSync = require('browser-sync');

gulp.task('scripts', function () {
    var plugins = require('gulp-load-plugins')();
    return gulp.src(config.PATH.srcFiles
        .concat(config.PATH.unitTestFiles)
        .concat(config.PATH.e2eTestFiles)
      )
      //.pipe(plugins.eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      //.pipe(plugins.eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      //.pipe(plugins.eslint.failAfterError())
      //.pipe(browserSync.reload({ stream: true }))
      .pipe(plugins.size())
});
