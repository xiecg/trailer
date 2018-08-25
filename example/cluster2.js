
var cluster = require('cluster');
var os = require('os');
var http = require('http');

if (cluster.isMaster) {
  var worker = cluster.fork();
  worker.send('hi there');
} else if (cluster.isWorker) {
  process.on('message', function(msg) {
    process.send(msg);
  });
}
console.log('end');