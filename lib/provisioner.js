//
// Service provisioner
//

var ServiceManager = require('./servicemanager.js').ServiceManager;

exports.Provisioner = function (options) {

	var _channel = options.channel || 'provisioner';
	var _bus = options.bus || null;
	var _updateInterval = options.interval || 1.0;

	var manager = new ServiceManager();

	var _busMessage = function (chan, msg) {
		if (msg.type == 'ping') {
			manager.ping(msg.channel, msg.utilization);
		}
		else if (msg.type == 'provision') {
			var server = manager.provision(msg.service);
			console.log('provisioned:', server);
			_bus.publish(msg.channel, { type: 'proxy-called.' });
			_bus.publish(server.url, {
				type: 'start-service',
				service: msg.service,
				channel: msg.channel,
				arguments: msg.arguments
			});
		}
		else
			console.log('unhandled message on provisioner channel ' + chan, msg);
	};

	var _start = function () {
		console.log('## Provisioner');
		_bus.subscribe('provisioner', _busMessage);
		setInterval(function () { manager.tick(_updateInterval); }, _updateInterval * 1000);
	};

	return { start: _start };
};