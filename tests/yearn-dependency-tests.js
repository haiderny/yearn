
/* Node unit quick reference:
 * 
 *	ok(value, [message]) 
 *		- Tests if value is a true value.
 *	equal(actual, expected, [message]) 
 *		- Tests shallow, coercive equality with the equal comparison operator ( == ).
 *	notEqual(actual, expected, [message]) 
 *		- Tests shallow, coercive non-equality with the not equal comparison operator ( != ).
 *	deepEqual(actual, expected, [message]) 
 *		- Tests for deep equality.
 *	notDeepEqual(actual, expected, [message]) 
 *		- Tests for any deep inequality.
 *	strictEqual(actual, expected, [message]) 
 *		- Tests strict equality, as determined by the strict equality operator ( === )
 *	notStrictEqual(actual, expected, [message]) 
 *		- Tests strict non-equality, as determined by the strict not equal operator ( !== )
 *	throws(block, [error], [message]) 
 *		- Expects block to throw an error.
 *	doesNotThrow(block, [error], [message]) 
 *		- Expects block not to throw an error.
 *	ifError(value) 
 *		- Tests if value is not a false value, throws if it is a true value.
 *	
 *	expect(amount) 
 *		- Specify how many assertions are expected to run within a test. 
 *	done() 
 *		- Finish the current test function, and move on to the next. ALL tests should call this!
 */

var path = require( 'path' );
var yearn = null;

module.exports.setUp = function( callback ){
	process.env.LOG4JS_CONFIG = path.resolve( __dirname, './test-configs/test-log4js-config.json' );
	
	var logger = require( 'log4js' ).getLogger( 'yearn' );
	
	try {
		yearn = require( '../lib/yearn' )({ 
			orgs: { 
				'': './node_modules',
				'test': path.join( __dirname, 'test-modules' ) 
			},
			legacy: false,
			override: true
		} );
	} catch( exception ){
		console.log( 'Exception during test yearn setup.' );
		console.log( exception, exception.stack.split( '\n' ) );
	}
	
	yearn.setLogger( logger );
	
	callback( );
};

module.exports.tearDown = function( callback ){
	process.env.LOG4JS_CONFIG = undefined;
	yearn.revert( );
	
	//wipe the cache of all yearn test node_modules
	Object.keys( require.cache ).forEach( function( item ){
		if( item.indexOf( path.resolve( __dirname, './node_modules' ) ) === 0 ){
			delete require.cache[ item ];
		}
		if( item.indexOf( path.resolve( __dirname, './test-modules' ) ) === 0 ){
			delete require.cache[ item ];
		}
	});
	
	callback( );
};

module.exports.nestedDependencyTests = {
	
	"A v 0.0.1": function( unit ){
		unit.equal( yearn( 'test:A@0.0.1' )( ), [
			'Hello from A @ 0.0.1.'
		].join( '\n' ) );
		unit.done();	
	},
	
	"A v 0.0.2": function( unit ){
		unit.equal( yearn( 'test:A@0.0.2' )( ), [
			'Hello from A @ 0.0.2.'
		].join( '\n' ) );
		unit.done();	
	},
	
	"A v 0.1.0": function( unit ){
		unit.equal( yearn( 'test:A@0.1.0' )( ), [
			'Hello from A @ 0.1.0.'
		].join( '\n' ) );
		unit.done();	
	},
	
	"B v 0.0.1": function( unit ){
		unit.equal( yearn( 'test:B@0.0.1' )( ), [
			'Hello from B @ 0.0.1.',
			'Hello from A @ 0.0.1.'
		].join( '\n' ) );
		unit.done();	
	},
	
	"B v 0.0.2": function( unit ){
		unit.equal( yearn( 'test:B@0.0.2' )( ), [
			'Hello from B @ 0.0.2.',
			'Hello from A @ 0.0.2.'
		].join( '\n' ) );
		unit.done();	
	},
	
	"C v 0.0.1": function( unit ){
		unit.equal( yearn( 'test:C@0.0.1' )( ), [
			'Hello from C @ 0.0.1.',
			'Hello from A @ 0.0.1.'
		].join( '\n' ) );
		unit.done();	
	},
	
	"D v 0.0.1": function( unit ){
		unit.equal( yearn( 'test:D@0.0.1' )( ), [
			'Hello from D @ 0.0.1.',
			'Hello from B @ 0.0.1.',
			'Hello from A @ 0.1.0.',
			'Hello from C @ 0.0.1.',
			'Hello from A @ 0.0.2.'
		].join( '\n' ) );
		unit.done();	
	}
	
};