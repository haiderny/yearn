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
			unit: [
				'tests/**/*tests.js',
				'!tests/yearn*tests.js',
				'!tests/*cli-tests.js'
			],
			dependency: [
				'tests/yearn-dependency-tests.js'	
			],
			utils: [
			     'tests/utils/*utils-tests.js'           
			],
			ynpm: [
			    'tests/ynpm-tests.js',
                'tests/ynpm-list-tests.js'
			],
			yearn: [
			    'tests/yearn-tests.js',
				'tests/yearn-dependency-tests.js',
				'tests/yearn-loose-semver-tests.js',
				'tests/yearn-legacy-tests.js',
			    'tests/yearn-logger-tests.js',
			    'tests/yearn-override-tests.js',
			    'tests/yearn-override-function-tests.js'
			],
			logger: [
			    'tests/yearn-logger-tests.js'
			],
            config: [
                'tests/utils/config-tests.js'
            ],
            list: [
                'tests/utils/ynpm-utils-find-tests.js',
                'tests/ynpm-list-tests.js'
            ],
			core: [
			    'tests/core-tests.js'
			],
			cli: [
			    'tests/*cli-tests.js'
			],
			options: {
				reporter: 'verbose'
			}
		},
		
		coveralls: {
			options: {
				force: false
			},
			submit_coverage: {
				src: 'coverage/lcov.info'
			}
		}
	});
	
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );
	grunt.loadNpmTasks( 'grunt-coveralls' );
	
	grunt.registerTask( 'test', [ 'jshint', 'nodeunit:unit', 'nodeunit:cli', 'nodeunit:yearn' ] );
	grunt.registerTask( 'default', [ 'test' ] );
};