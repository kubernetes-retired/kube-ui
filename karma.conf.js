// Karma configuration

var path = require('path');
var config = require('./gulp/config');

var _ = require('lodash');
var wiredep = require('wiredep');

module.exports = function(conf) {

  var baseConfig = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: (function() {
      var wiredepOptions = _.extend({}, conf.wiredep, {
        dependencies: true,
        devDependencies: true
      });

      return wiredep(wiredepOptions).js
        .concat([
          path.join(config.PATH.src, '/*.js'),
          path.join(config.PATH.src, '/modules/**/*.module.js'),
          path.join(config.PATH.src, '/components/**/*.module.js'),
          path.join(config.PATH.src, '/modules/**/*.js'),
          path.join(config.PATH.src, '/components/**/*.js'),
          path.join(config.PATH.src, '/modules/**/*.html'),
          path.join(config.PATH.src, '/components/**/*.html'),

          path.join(config.PATH.src, '/*.spec.js'),
          path.join(config.PATH.src, '/modules/**/*.spec.js'),
          path.join(config.PATH.src, '/components/**/*.spec.js'),
        ]);
    })(),


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: conf.LOG_DISABLE || conf.LOG_ERROR || conf.LOG_WARN || conf.LOG_INFO || conf.LOG_DEBUG
    logLevel: conf.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  };
  
  // Travis CI configuration
  if(process.env.TRAVIS) {
    baseConfig.customLaunchers = {
      'chrome-travis': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    baseConfig.browsers = ['chrome-travis'];
  };

  conf.set(baseConfig);
};
