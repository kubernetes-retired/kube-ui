var path = require('path');
var gulp = require('gulp');
var config = require('./config');

var browserSync = require('browser-sync');

var plugins = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles', function () {
  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src(config.PATH.scssFiles, { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(config.PATH.src + '/scss/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };


  return gulp.src([
    path.join(config.PATH.src, '/scss/app.scss')
  ])
    .pipe(plugins.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, config.wiredep)))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass(sassOptions)).on('error', config.errorHandler('Sass'))
    .pipe(plugins.autoprefixer()).on('error', config.errorHandler('Autoprefixer'))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.PATH.tmp, '/serve/styles/')))
    .pipe(browserSync.reload({ stream: true }));
});
