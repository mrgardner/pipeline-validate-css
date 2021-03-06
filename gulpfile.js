'use strict';

var fs = require('fs');
var gulp = require('gulp');
var testPipeline = require('pipeline-test-node')({ plugins: {
  mocha: {
    reporter: 'spec'
  },
  istanbul: {
    reporters: ['text-summary'],
    thresholds: {
      global: 60
    }
  }
}});
var validateCssPipeline = require('./src/index.js')();
var validatePipeline = require('pipeline-validate-js');

var config = {
  files: [
   'src/*.js',
   'test/**/*.js',
   'test/*.js'
  ],

  cssFiles: [
   'test/**/*.css'
  ]

};

gulp.task('validate', function() {
  return gulp
    .src(config.files)
    .pipe(validatePipeline.validateJS());
});

gulp.task('validateCSS', ['validate'], function() {
  return gulp
    .src(config.cssFiles)
    .pipe(validateCssPipeline.validateCSS());
});

gulp.task('default', ['validateCSS'], function() {
  var dirPath = './coverage';

  deleteFolderRecursive(dirPath);
  return gulp
    .src(config.files)
    .pipe(testPipeline.test());

  function deleteFolderRecursive (dir) {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(function(file) {
        var curPath = dir + '/' + file;

        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dir);
    }
  }
});

