exports.config = {
  specs: [
    'chrome/**/*.js',
    '../components/**/protractor/*.js'
  ],

   capabilities: {
       browserName: 'chrome'
  }
};
