Node.js service broker and provisioner
======================================

Simple scalable example setup
-----------------------------
 
* one or more provisioning servers (examples/provisioner.js) 
* one or more service proxies per provisioning server (examples/proxy.js)
* multiple clients (examples/trigger.js)
* a pubsub-capable messagebus (redis implementation included)

Typical client workflow
-----------------------

1. client picks a random channel name.

``` javascript
var commchannel = 'mycomm/' + uuid.v1();
```

2. client tells the provisioner that it expects a specific service running on that channel.

``` javascript
bus.publish('provisioner', { 
	type: 'provision',
	service: 'randomnumberservice',
	channel: commchannel
});
```

3. provisioner then tells one of all available proxies to start that service up on that channel.

4. client talks directly to service on selected channel.

``` javascript
bus.subscribe(commchannel, function (chan, msg) {
	console.log('message from service:', msg);
});

bus.publish(commchannel, {
	action: 'something',
});
```

Writing services is also simple
-------------------------------

This is a sample service reporting random values back at given intervals to the client, and listens for an killsignal which stops it.

``` javascript
var commchannel = process.argv[2]; // channel name is first argument 
console.log('## Sample service - communicating on channel '+commchannel);

bus.subscribe(commchannel, function (chan, msg) {
	if (msg.type == 'stop-service')
		process.exit();
});
	
setInterval(function () { 
	bus.publish( commchannel, { type:'data', value:Math.random()*1000 } );
}, 2000);
```

	

	