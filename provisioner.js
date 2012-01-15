var busmodule = require('./bus.js');
var serviceManager = require('./servicemanager.js').serviceManager;

var bus = new busmodule.bus();
var manager = new serviceManager();

console.log('## Provisioner');

bus.subscribe('provisioner', function (chan, msg) {
	if (msg.type == 'ping') {
		manager.ping(msg.channel, msg.utilization);
	}
	else if (msg.type == 'provision') {
		var tmp = manager.provision(msg.service);
		console.log('provisioned:', tmp);
		bus.publish(msg.channel, {
			type: 'proxy-called.',
		});
		bus.publish(tmp.url, { 
			type: 'start-service', 
			service: msg.service,
			channel: msg.channel,
			arguments: msg.arguments
		});
	}
	else
		console.log('unhandled message on provisioner channel ' + chan, msg);
});

setInterval(function () {
	manager.tick(2.0);
}, 2000);

// bus.publish('provisioner', { type: 'alive' });

