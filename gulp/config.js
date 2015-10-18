var gutil = require('gulp-util');

exports.PATH = {
    src: 'src/',
    tmp: '.tmp/',
    dist: 'dist/',
    unit: 'test/unit/',
		srcFiles: ['src/**/*.js'],
    unitTestFiles: 'test/unit/*.spec.js',
    moduleSrcFiles: ['src/**/*.module.js'],
		e2eTestFiles: ['test/e2e/**/.spec.js'],
    scssFiles: ['src/scss/**.scss', 'src/components/**/scss/*.scss'],
};

exports.packgeInfo = require('../package.json');

exports.wiredep = {
  exclude: [/bootstrap.js$/, /bootstrap-sass-official\/.*\.js/, /bootstrap\.css/],
  bowerJson: require(__dirname + '/../bower.json')
};

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};