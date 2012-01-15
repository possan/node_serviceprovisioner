//
// Example trigger
//

var config = require('./config.js'); 
var lib = require('../lib/lib.js');
var uuid = require('node-uuid');

var bus = new lib.RedisBus(config.redis);
var commchannel = 'comm/' + uuid.v1();

console.log('## Test client ' + commchannel);

bus.subscribe(commchannel, function (chan, msg) {
	console.log('message on comm-channel:', msg);
});

console.log('Sending provisioning request...');

bus.publish('provisioner', { 
	type: 'provision',
	service: 'sampleservice',
	channel: commchannel,
	arguments: ['something', 'other']
});

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
rl.question('Enter anything to exit and stop service...', function (answer) { process.exit(); });

bus.publish( commchannel, { type: 'stop-service' } );



