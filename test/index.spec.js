/* global require */
'use strict';
var chai = require('chai');
var isStream = require('isstream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var validatePipeline = require('../src/index');

var fixtures = function (glob) { return path.join(__dirname, 'fixtures', glob); };

chai.should();
chai.use(sinonChai);

describe('pipeline-validate-css', function() {
  describe('Passing correct CSS', function() {
    var stream;

    it('Should return the stream after validation', function (done) {
      stream = gulp
	      .src(fixtures('test-css2.css'))
	      .pipe(validatePipeline().validateCSS());

      isStream(stream).should.equal(true);
      done();
    });
  });
});

describe('check inner functions spies', function() {
  var sandbox = {};
  var spy = {};

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    spy = sandbox.spy(gutil, 'log');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should be called once validateCSS is called', function() {
    validatePipeline().validateCSS();
    spy.should.have.been.calledWith('Validating CSS files.');
  });

  it('should be called once customReporter is called', function() {
    validatePipeline().validateCSS();
    spy.should.have.been.calledWith('Restoring CSS Filter.');
  });

 //  it('Invalid file simulation', function () {
 //    var stream = function(){
 //    	gulp
	//     .src(fixtures('test-css1.css'))
	//     .pipe(validatePipeline().validateCSS());
	//   };

	//   stream();
	//   // setTimeout(function(){
	//   // 	it('should fail', function(){
	//   // 			  	spy.should.have.been.calledWith('NO oTHER OPTIONS');
	//   // 	});
	//   // 	// spy.should.have.been.calledWith('CUSTOM');
	//   // 	// true.should.equal(false)

	//   // }, 5);
	// });
});
