rem node_modules/nodeunit/bin/nodeunit servicemanager-tests.js 

start node provisioner.js

timeout 2

start node proxy.js .\
start node proxy.js .\

timeout 2

start node test.js

