var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var count = 1;
io.on('connection', function(socket){
  var name = "user " + count++;
  console.log(name + ' is connected');
  io.emit('chat message', name + " enter the room.");
  socket.on('disconnect', function(){
    console.log(name + ' is disconnected');
    io.emit('chat message', name + " leave the room.");
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
 
http.listen(3000, function(){
  console.log('listening on *:3000');
});