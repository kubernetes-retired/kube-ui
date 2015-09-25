module.exports = function(config) {
  var configuration = {

    basePath: '../',

    files: [
      'third_party/ui/bower_components/angular/angular.js',
      'third_party/ui/bower_components/angular-aria/angular-aria.js',
      'third_party/ui/bower_components/angular-material/angular-material.js',
      'third_party/ui/bower_components/angular-mocks/angular-mocks.js',
      'third_party/ui/bower_components/angular-route/angular-route.js',
      'third_party/ui/bower_components/angularjs-jasmine-matchers/dist/matchers.js',
      'third_party/ui/bower_components/hammerjs/hammer.js',
      'third_party/ui/bower_components/lodash/dist/lodash.js',
      'app/assets/js/app.js',
      'app/assets/js/base.js',
      'app/vendor/**/*.js',
      'master/test/**/*.js',
      'master/components/**/test/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    reporters: ['progress', 'junit'],

    customLaunchers: {
      Chrome_travis: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-story-reporter',
    ],

    junitReporter: {outputFile: 'test_out/unit.xml', suite: 'unit'}

  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis'];
  }

  config.set(configuration);
};
