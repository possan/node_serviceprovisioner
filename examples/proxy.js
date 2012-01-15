//
// Example service proxy
// 

if( process.argv.length < 3 ) {
	console.log('Usage: node proxy.js [services root]');
	return; 
}

var config = require('./config.js');
var lib = require('../lib/lib.js');
var path = require('path');

var bus = new lib.RedisBus( config.redis );
var proxy = new lib.ServiceProxy( { bus:bus, root: path.join( __dirname, process.argv[2] ) } );
console.log('## Proxy ' + proxy.channel);
proxy.start();
