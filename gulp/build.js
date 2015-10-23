'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');
var runSequence = require('run-sequence').use(gulp);

var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(config.PATH.src, '/**/*.html'),
    path.join(config.PATH.tmp, '/serve/**/*.html'),
    path.join('!' + config.PATH.src, '/index.html')
  ])
    .pipe(plugins.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(plugins.angularTemplatecache('k8sTemplateCache.js', {
      module: 'k8s.app',
      root: ''
    }))
    .pipe(gulp.dest(config.PATH.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(config.PATH.tmp, '/partials/k8sTemplateCache.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(config.PATH.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = plugins.filter('*.html');
  var jsFilter = plugins.filter('**/*.js');
  var cssFilter = plugins.filter('**/*.css');
  var assets;

  return gulp.src(path.join(config.PATH.tmp, '/serve/*.html'))
    .pipe(plugins.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = plugins.useref.assets())
    .pipe(plugins.rev())
    .pipe(jsFilter)
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify({ preserveComments: plugins.uglifySaveLicense })).on('error', config.errorHandler('Uglify'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(plugins.replace('../../bower_components/bootstrap-sass-official/assets/fonts/bootstrap/', '../fonts/'))
    .pipe(plugins.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe(plugins.useref())
    .pipe(plugins.revReplace())
    .pipe(htmlFilter)
    .pipe(plugins.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(config.PATH.dist, '/')))
    .pipe(plugins.size({ title: path.join(config.PATH.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(plugins.flatten())
    .pipe(gulp.dest(path.join(config.PATH.dist, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = plugins.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(config.PATH.src, '/**/*'),
    path.join('!' + config.PATH.src, '/**/*.{html,css,js,scss}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(config.PATH.dist, '/')));
});

gulp.task('clean', function (done) {
  plugins.del([path.join(config.PATH.dist, '/'), path.join(config.PATH.tmp, '/')], done);
});

gulp.task('build', function() {
  runSequence('clean', ['html', 'fonts', 'other']);
});
