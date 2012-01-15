//
// Sample service
//

if( process.argv.length < 3 ) {
	console.log('Usage: node sampleservice.js [command-channel]');
	return; 
}

var config = require('./config.js');
var servicemodule = require('../lib/lib.js');
var bus = new servicemodule.RedisBus(config.redis);

var commchannel = process.argv[2];

console.log('## Sample service - communicating on channel '+commchannel);

bus.subscribe(commchannel, function (chan, msg) {
	if (msg.type == 'exit' || msg.type == 'stop-service') {
		console.log('stopping service.');
		process.exit();
	}
	else
		console.log('unhandled message', msg);
});

setInterval( function () { 
	bus.publish(commchannel, {
		type:'data', 
		value:Math.random()*1000
	} );
}, 2000);

// bus.publish('provisioner', { type: 'alive' });
