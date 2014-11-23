/**
 * Test and Validation file.
 */

'use strict';

module.exports = function( grunt ){

	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'bin/**/*.js',
				'lib/**/*.js',
				'tests/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		
		nodeunit: {
			tests: [
				'tests/**/*tests.js',
				'tests/**/*tests.js'
			],
			options: {
				reporter: 'verbose'
			}
		},
		
		jsonlint: {
			all: [ 
			    'package.json',
			    'tests/**/*.json'
			]	  
		},
		
		coveralls: {
			submit_coverage: {
				src: 'coverage/lcov.info'
			}
		}
	});
	
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );
	grunt.loadNpmTasks( 'grunt-travis-lint' );
	grunt.loadNpmTasks( 'grunt-coveralls' );
	
	grunt.registerTask( 'test', [ 'jshint', 'nodeunit' ] );
	grunt.registerTask( 'full-test', [ 'jshint', 'jsonlint', 'travis-lint', 'nodeunit' ] );
	grunt.registerTask( 'default', [ 'full-test' ] );
};