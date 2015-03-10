module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],

    frameworks: ['jasmine', 'browserify'],

    files: [
      'spec/**/*_spec.js'
    ],

    preprocessors: {
      '**/*_spec.js': 'browserify'
    },

    browserify: {
      debug: true,
      watch: true,
      transform: [ 'reactify' ],
      extensions: ['.js', '.jsx'],
    }
  });
};
