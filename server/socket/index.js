'use strict';

let ioClient = require('socket.io-client');
let nconf = require('nconf');
let token = nconf.get('TOKEN');
let socketUrl = nconf.get('socket:url');
let socket;

module.exports = {
  connect: connect,
  disconnect: disconnect
}

function connect(done){
  let url = socketUrl + '?token=' + token;
  socket = ioClient.connect(url);

  socket.on('error', function(err) {
    console.log(err);
  });

  socket.on('connect', function(socket, err) {
    console.log('Socket is connected to ' + socketUrl);
  });

  socket.on('disconnect', function(socket) {
    console.log('Socket has been disconnected');
  });
};

function disconnect(done){
  socket.disconnect();
  done(socket);
}
