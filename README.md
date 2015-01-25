# yearn
[![Build Status](https://img.shields.io/travis/doctorrustynelson/yearn.svg)](http://travis-ci.org/doctorrustynelson/yearn)
[![Coverage Status](http://img.shields.io/coveralls/doctorrustynelson/yearn.svg)](https://coveralls.io/r/doctorrustynelson/yearn)
[![NPM Version](https://img.shields.io/npm/v/yearn.svg)](https://npmjs.org/package/yearn)
![NPM License](https://img.shields.io/npm/l/yearn.svg)

### Overview
yearn is a library that injects functionality into Node's require mechanism providing the ability to transform the require before it's passed to load.  A default mechanism is injected so that all requires look for *./node_modules/module/version* instead of node's default *./node_modules/module* location. There is also support for __orgs__, which allows for a more central placement of all modules or separation of public and private modules (default __org__ points to *./node_modules* for backward compatibility).  yearn also provides wrappers around node (__ynode__) and npm (__ynpm__) to automaticaly enforce yearn requiring.

### Installation

Local installation:

    $ npm install yearn

Global installation:

    $ npm install yearn -g

### Local Usage
To use yearn for a single project it needs to be installed locally. Due to the fact that it needs to be bootstrapped it must be installed in the traditional npm structure. All other modules may be installed in any way compatible with the yearn implementation.

Once installed locally require it and provide initialization options before using the new require mechanism.

Example initialization with a few options and then some requires: 

	var yearn = require( 'yearn' )({ 
		orgs: {
			test: '/usr/bin/test_modules'
			local: '/usr/bin/my_modules'
		},
		override: true
	});
	
	// Simple backward compatible yearning 
	var log4js = yearn( 'log4js' );
	
	// Explicit yearning for a semantic version with modern syntax
	var nodeunit = yearn( { org: 'test', module: 'nodeunit', version: '0.9.x' } );
	
	// Implicit require for a specific version with string syntax
	var lodash = require( 'lodash@2.4.0' );
	
	// Explicit require without org or version (default with pull version and org from package.json) 
	var loca_module = require( { module: 'my_local_module' } );

### Global Usage

See ynode and ynpm below for the global scripts that are provided with yearn.

YEARN_CONFIG is an eviroment variable that is read when ever ynode and ynpm are started up.  This config variable should point to a .json file containing the global yearn config.  All the options for local yearn below are supported.

### Options

	var yearn = require( 'yearn' )({
		orgs: { '', './node_modules' },
		logger: 'default',
		override: true,
		delimiters: {
			org: ':',
			semver: '@',
			file: '/'
		}
	});

+ __orgs__: The __orgs__ config object is a mapping of organization names to their locations.  The default location ( `''` ) will point to the module's local node_modules folder (*./node_modules*) unless overridden.
   
   Example:
   
		var yearn = require( 'yearn' )({
			orgs: { 
				'', '//usr/bin/default_node_modules_location' 
				'other_loc': '//some/other/location'	
			}
		});
	
		// require looking in '//usr/bin/default_node_modules_location/module1' for a version specified in the package.json for module1.
		var regular_module = require( 'module1' );  
	
		// require looking in '//some/other/location/module2' for a version specified in the package.json for module2.
		var other_modules = require( 'other:module2' );
   
+ __logger__: As of yearn 0.2.0, yearn has no built in logger.  This option allows for bootstrapping loggers.  The suggested logger is [log4js](https://www.npmjs.com/package/log4js).  Any logger can be supported as long as it can be instantiated with the line `require( config.logger ).getLogger( 'yearn|ynpm' );`  Note: the setup of any optional logger will happen after setting up yearn so the logger must be installed in a way that the possibly overridden require will work.
   
   + `'default'`: no logging (default).
   + `'${other logger}'`: user specified logger.

+ __override__: This boolean specifies if yearn should override Node's require mechanism or should only return the yearn functionality.  Additionaly if a function is provided than yearn will ignore all of it's default funtionality and override require with that functionality instead.

   There are a few thing that one should know if your going to override the functionality yourself.  Firstly this does not override the most outer form of require and thus you end up limited to a single argument getting passed to your require function.  Secondly if you want to call the underlying load mechanism use `module.constructor._load( path, this )` where path is the location of the modules (or name of the modules to get Node's default loading mechanism instead).
   
+ __delimiters__: The __delimiters__ option is a way to set the delimiters between org, module, version and specific file parts of a string based require.  By default these values are `:` between org and module, `@` between module and version similarly to how semver does their versioning and `/` to state that the require is for a particular file in the module.  These should not be the same delimiter (prior to version 0.2.0 of yearn they were all `/` and that lead to problems with pre-exisiting modules like npm and grunt).  

   + __org__: the seperator between an org and module (defaults to `:`).
   + __semver__: the seperator between a module and the desired semver to match (defaults to `@`).
   + __file__: the seperator to determine the path to find the file within the found module (defaults to `/`).

### ynode

ynode is a small wrapper around node itself that will enforce a YEARN_CONFIG.  Running with arguments will interpert the first as a script and preform a require of it.  Executing ynode without any arguments will open a REPL with a YEARN_CONFIG already interperted.

If one wants to force the use of ynode over node then change the globally installed scripts from `ynode` and `ynode.cmd` to `node` and `node.cmd`.  Then make sure that the folder where the scripts appears before the folder where `node` is installed.  Finally go into the altered `ynode` script and change the `#!` to point to the actual `node` instead of `/usr/bin/env node`.  Then whenever `node` is called or a `node` script is run it will be run through the `ynode` script.

### ynpm

ynpm is a small wrapper around some of npm's functionality.  This script can be used to install modules into the org/module/version structure that yearn uses by default.  There are only a few functionalities supported thus far:

+ `ynpm check [orgs_or_specific_modules...]`: Print the modules that need to be updated and to what version.

+ `ynpm help`: Print the ynpm usage information.

+ `ynpm install [modules...]`: Install modules from npm to the flattened yearn structure.

+ `ynpm npmconfig [args]`(IN DEVELOPMENT): Manage npm configuration.

+ `ynpm orgs`: Print the current orgs as specified by the YEARN_CONFIG.

+ `ynpm version`: Print the version of yearn currently assciated with ynpm
