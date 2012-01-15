//
// node.js actual sample service
//

if( process.argv.length < 3 ) {
	console.log('Usage: node sampleservice.js [command-channel]');
	return; 
}

var busmodule = require('./bus.js');

var bus = new busmodule.bus();

var commchannel = process.argv[2];

console.log('## Sample service - communicating on channel '+commchannel);

bus.subscribe(commchannel, function (chan, msg) {
	if (msg.type == 'exit') {
		process.exit();
	}
	else
		console.log('unhandled message on provisioner channel ' + chan, msg);
});

setInterval( function () { 
	bus.publish(commchannel, {
		type:'data', 
		value:Math.random()*1000
	} );
}, 2000);

// bus.publish('provisioner', { type: 'alive' });
