var busmodule = require('./bus.js');
var uuid = require('node-uuid');
var readline = require('readline');

var bus = new busmodule.bus();
var commchannel = 'comm/' + uuid.v1();
var rl = readline.createInterface(process.stdin, process.stdout);
var nodebin = process.argv[0];

console.log('## Test client ' + commchannel);

bus.subscribe(commchannel, function (chan, msg) {
	console.log('unhandled message on comm-channel ' + chan, msg);
});

console.log('Sending provisioning request...');
bus.publish('provisioner', {
	type: 'provision',
	service: 'sampleservice',
	channel: commchannel,
	arguments: ['something', 'other']
});

// rl.question('Enter anything to exit...', function (answer) { process.exit(); });
