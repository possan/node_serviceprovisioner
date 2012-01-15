//
// Service proxy 
//

var os = require('os');
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var uuid = require('node-uuid');

exports.Proxy = function (options) {

	var _channelPrefix = options.channelPrefix || 'proxy/';
	var _serviceRoot = options.root || './';
	var _bus = options.bus || null;
	var _pingInterval = options.pingInterval || 5.0;

	var proxychannel = _channelPrefix + uuid.v1();

	var _spawnService = function (fn, channel, extraargs) {
		console.log('start service', fn);
		_bus.publish(channel, { type: 'service-starting', filename: fn });
		if (os.platform() == "win32") {
			var args = ['/s', '/k', 'start', process.execPath, fn, channel];
			for (var k in extraargs)
				args.push(extraargs[k]);
			cp.spawn('c:\\windows\\system32\\cmd.exe', args);
		}
		else {
			var args = [fn, channel];
			for (var k in extraargs)
				args.push(extraargs[k]);
			cp.spawn(process.execPath, args);
		}
	}

	var _pingonce = function () {
		var avg = os.loadavg();
		_bus.publish('provisioner', {
			type: 'ping',
			channel: proxychannel,
			utilization: avg[0]
		});
		setInterval(function () {
			_pingonce();
		}, _pingInterval * 1000);
	};

	var _busMessage = function (chan, msg) {
		if (msg.type == 'start-service') {
			console.log('start service', msg);
			var fn2 = path.join(_serviceRoot, msg.service, "service.js");
			var fn = path.join(_serviceRoot, msg.service + ".js");
			var st2;
			try {
				st2 = fs.statSync(fn2);
			} catch (e) { }
			var st;
			try {
				st = fs.statSync(fn);
			} catch (e) { }
			console.log(st2, st);
			if (st2 && st2.isFile())
				_spawnService(fn2, msg.channel, msg.arguments);
			else if (st && st.isFile())
				_spawnService(fn, msg.channel, msg.arguments);
			else
				_bus.publish(channel, { type: 'service-not-found', service: msg.service });
		}
		else
			console.log('unhandled message on proxy channel ' + proxychannel, msg);
	};

	var _start = function () {
		_bus.subscribe(proxychannel, _busMessage);
		_pingonce();
	};

	return {
		channel: proxychannel,
		start: _start
	};
}

