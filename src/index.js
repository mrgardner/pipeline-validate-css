/* global require, module */

'use strict';

var gulpFilter = require('gulp-filter');
var gutil = require('gulp-util');
var lazypipe = require('lazypipe');
var plugins = require('gulp-load-plugins')({ lazy: true });

var cssFilter = gulpFilter('*.css', { matchBase: true, restore: true });

module.exports = {
  validateCSS: function() {
    return pipelineFactory();
  }
};

function pipelineFactory() {
  var stream;

  gutil.log('Validating CSS files.');
  stream = lazypipe()
    .pipe(function() {
      return cssFilter;
    })
    .pipe(plugins.csslint)
    .pipe(plugins.csslint.reporter)
    .pipe(plugins.csslint.reporter, customReporter)
    .pipe(plugins.csslint.failReporter)
    .pipe(function() {
      gutil.log('Restoring CSS Filter.');
      return cssFilter.restore;
    });

  return stream();
}

function customReporter(file) {
  var color = gutil.colors;

  gutil.log(color.red('Errors in: ' + file.path));
  file.csslint.results.forEach(function(result) {
    gutil.log(color.grey('line ' + result.error.line + ':' + result.error.message));
  });
  gutil.log(color.red(' -- End Errors -- '));
}

