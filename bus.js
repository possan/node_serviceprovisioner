var redis = require('redis');

// redis.debug_mode = true;

var default_hostport = 'localhost:6379';

exports.bus = function (hostport) {

	if (typeof (hostport) === 'undefined')
		hostport = default_hostport;

	var s = hostport.split(':');
	var _ret = {};
	var _callback = null;
	var _client1 = redis.createClient(s[1], s[0], {});
	var _client2 = redis.createClient(s[1], s[0], {});

	_client1.on("error", function (err) {
		// console.log("pubsub: error: " + err);
	});
	_client1.on('disconnect', function () {
		// console.log("pubsub: disconnect.");
	});
	_client2.on("error", function (err) {
		// console.log("pubsub: error: " + err);
	});
	_client2.on('disconnect', function () {
		// console.log("pubsub: disconnect.");
	});

	var _fromjson = function (input) {
		if (typeof (input) === 'string')
			if (input[0] == '{')
				return JSON.parse(input);
		return input;
	};

	var _tojson = function (input) {
		if (typeof (input) !== 'string')
			return JSON.stringify(input);
		return input;
	};

	_client1.on("message", function (channel, message) {
		message = _fromjson(message);
		// console.log("pubsub: received message on channel " + channel + ":", message);
		_callback(channel, message);
	});

	_client1.on("pmessage", function (channelmask, channel, message) {
		message = _fromjson(message);
		// console.log("pubsub: received message on channel " + channel + ":", message);
		_callback(channel, message);
	});

	_ret.subscribe = function (channel, cb) {
		// console.log("pubsub: subscribe to channel " + channel);
		if (channel.indexOf('*') != -1)
			_client1.psubscribe(channel);
		else
			_client1.subscribe(channel);
		_callback = cb;
	};

	_ret.unsubscribe = function (channel) {
		// console.log("pubsub: unsubscribe from channel " + channel);
		_client1.unsubscribe(channel);
	};

	_ret.publish = function (channel, data) {
		data = _tojson(data);
		// console.log("pubsub: publish on channel " + channel + ":", data);
		_client2.publish(channel, data);
	};

	_ret.set = function (key, value) {
		_client2.set(key, value, redis.print);
	};

	_ret.get = function (key, callback) {
		_client2.get(key, function (err, value) { callback(value); });
	};

	return _ret;
};