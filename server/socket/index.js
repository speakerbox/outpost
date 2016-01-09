'use strict';

let Speaker = require('speaker');
let ioClient = require('socket.io-client');
let ioStream = require('socket.io-stream');
let mic = require('microphone');
let stream = ioStream.createStream();
let nconf = require('nconf');
let token = nconf.get('TOKEN');
let socketUrl = nconf.get('socket:url');
let socket;
let speaker = new Speaker({
  channels: 2,
  bitDepth: 16,     
  sampleRate: 44100    
});

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

  ioStream(socket).emit('streamAudio', stream);
  ioStream(socket).on('receiveAudio', function(stream){
    console.log(stream);
    stream.pipe(speaker);
  });

  mic.startCapture();
  mic.audioStream.on('data', function(data){
    console.log(data);
    //stream.pipe(data);
  });
};

function disconnect(done){
  socket.disconnect();
  done(socket);
}
