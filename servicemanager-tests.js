var module = require('./servicemanager.js');

exports.emptyAtStart = function(test) {
	var m = new module.serviceManager();
	var u = m.getUrls();
	test.equals(u.length, 0);
	test.done();
};

exports.pingRegistersServer = function(test) {
	var m = new module.serviceManager();
	m.ping('url1');
	var u = m.getUrls();
	test.equals(u.length, 1);
	var meta = m.getByUrl('url1');
	test.equals(meta.utilization, 0);
	test.equals(meta.type, '');
	test.done();
};

exports.tickIncreasesTimeout = function(test) {
	var m = new module.serviceManager();
	m.ping('url1');
	m.tick(5.0);
	m.ping('url2');
	test.ok(m.getByUrl('url1').timeout > 4.0);
	test.done();
};

exports.pingSetsTimeout = function(test) {
	var m = new module.serviceManager();
	m.ping('url1');
	m.tick(5.0);
	m.ping('url2');
	m.tick(1.0);
	test.ok(m.getByUrl('url1').timeout > 4.0);
	test.ok(m.getByUrl('url2').timeout < 2.0);
	test.done();
};

exports.pingSetsTimeout2 = function(test) {
	var m = new module.serviceManager();
	m.ping('url1');
	m.tick(5.0);
	m.ping('url2');
	m.tick(1.0);
	m.ping('url1');
	test.ok(m.getByUrl('url1').timeout < 2.0);
	test.ok(m.getByUrl('url2').timeout < 2.0);
	test.done();
};

exports.provisionsBestChoice1 = function(test) {
	var m = new module.serviceManager();
	m.ping('url1',99);
	m.ping('url2',5);
	m.ping('url3',19);
	test.equals(m.provision('test').url, 'url2');
	test.done();
};

exports.provisionsBestChoice2 = function(test) {
	var m = new module.serviceManager();
	m.ping('url1',99);
	m.ping('url2',5);
	m.ping('url3',19);
	m.ping('url3',0);
	test.equals(m.provision('test').url, 'url3');
	test.done();
};

