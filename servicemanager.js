exports.serviceManager = function () {

	var _meta = {};
	var _available = [];
	var _ids = [];

	var ret = {

		getByUrl: function (url) {
			if (typeof (_meta[url]) === 'undefined')
				_meta[url] = { url: url, timeout: 0, utilization: 0, type: '' };
			return _meta[url];
		},

		getUrls: function () {
			return _ids;
		},

		filter: function (callback) {
			var ret2 = [];
			for (var k = 0; k < _ids.length; k++) {
				var item = _meta[_ids[k]];
				if (callback(item))
					ret2.push(item);
			}
			return ret2;
		},

		ping: function (url, utilization) {
			// console.log('ServiceManager: Pinging url ' + url);
			var meta = ret.getByUrl(url);

			if (typeof (utilization) !== 'undefined')
				meta.utilization = utilization;

			meta.timeout = 0;

			if (_ids.indexOf(url) == -1)
				_ids.push(url);

			if (_available.indexOf(url) == -1)
				_available.push(url);
		},

		findRandomFreeServer: function () {
			var ret2 = ret.filter(function (item) { return item.utilization < 5; });
			// console.log('randomfree',ret2);
			return ret2[Math.round(Math.random() * ret2.length)];
		},

		findLeastUsedServer: function () {
			var ret2 = ret.filter(function (item) { return true });
			ret2.sort(function (a, b) { return a.utilization > b.utilization; });
			// console.log('leastused',ret2);
			return ret2[0];
		},

		findServerForProvisioning: function () {
			var randfree = ret.findRandomFreeServer();
			if (typeof (randfree) !== 'undefined')
				return randfree;

			var least = ret.findLeastUsedServer();
			return least;
		},

		provision: function (type) {
			// console.log('ServiceManager: Provisioning a ' + type);
			var p = ret.findServerForProvisioning();
			if (typeof (p) !== 'undefined') {
				p.utilization += 10.0;
				p.type = type;
			}
			// console.log('ServiceManager: Provisioned ', p);
			return p;
		},

		tick: function (secs) {
			for (var k = 0; k < _ids.length; k++) {
				_meta[_ids[k]].timeout += secs;
				_meta[_ids[k]].utilization += secs / 10.0;
			}
		}
	};

	return ret;
};


