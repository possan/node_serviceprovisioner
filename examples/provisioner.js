//
// Example provisioner
//

var config = require('./config.js');
var lib = require('../lib/lib.js');

var bus = new lib.RedisBus(config.redis);
var provisioner = new lib.ServiceProvisioner({ bus: bus });
provisioner.start();
