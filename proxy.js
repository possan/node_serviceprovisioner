var busmodule = require('./bus.js');
var os = require('os');
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var uuid = require('node-uuid');

if( process.argv.length < 3 ) {
	console.log('Usage: node proxy.js [services root]');
	return; 
}

var proxychannel = 'proxy/' + uuid.v1();
var bus = new busmodule.bus();
var serviceroot = process.argv[2]; 

console.log(process.execPath, os.platform());
console.log('## Proxy ' + proxychannel);

function spawnService( fn, channel, extraargs ) {
	console.log('start service', fn);
	bus.publish( channel, { type: 'service-starting', filename : fn2 });
	if( os.platform() == "win32" )
	{
		var args = ['/s', '/k', 'start', process.execPath, fn, channel];
		for( var k in extraargs )
			args.push(extraargs[k]);
		cp.spawn('c:\\windows\\system32\\cmd.exe', args);
	}
	else
	{			
		var args = [fn, channel];
		for( var k in extraargs )
			args.push(extraargs[k]);
		cp.spawn(process.execPath, args);
	}
}

bus.subscribe(proxychannel, function (chan, msg) {
	if (msg.type == 'start-service') {
		console.log('start service', msg);
		var fn2 = path.join( __dirname, serviceroot, msg.service, "service.js" );
		var fn = path.join( __dirname, serviceroot, msg.service + ".js" );
		var fs2 = fs.statSync(fn2);
		var fs = fs.statSync(fn);
		console.log(fs2,fs);
		if( fs2.isFile() )
			spawnService( fn2, msg.channel, msg.arguments );
		else if( fs.isFile() )
			spawnService( fn, msg.channel, msg.arguments );
		else
			bus.publish( channel, { type: 'service-not-found', service: msg.service });
	}
	else
		console.log('unhandled message on proxy channel ' + proxychannel, msg);
});


console.log('pinging provisioner...');

function pingonce() {
	var avg = os.loadavg();	
	bus.publish('provisioner', {
		type: 'ping',
		channel: proxychannel,
		utilization: avg[0]
	});
	setInterval(function () {
		pingonce();
	}, 5000);
};

pingonce();


