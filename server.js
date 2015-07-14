var express = require("express");
var path = require("path");
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

app.use(bodyParser.urlencoded());
// static content
app.use(express.static(path.join(__dirname, "./static")));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
 res.render("index", {});
});


var users = [];
var messages = [];
var disconnected = [];

// ---------- SOCKETS ---------- //
io.sockets.on('connection', function (socket) {
  console.log("socket ID below:");
  console.log(socket.id);
  console.log('a user connected: ' + socket.id);
  socket.on('disconnect', function(){
    console.log(users);
    for(var x in users) {
      console.log(x);
      if(socket.id === users[x].id) {
        console.log('removing user with ID:', socket.id);
        io.emit('disconnect_user',{user: users[x]});
        users.pop(x);
      }
    }
    console.log('user disconnected');
  });
    socket.on('client-emit', function (name) {
        var new_user = {
          id: socket.id,
          name: name
        };
        console.log(new_user);
        users.push(new_user);
        io.emit("users_in_chat", users);
    });

    socket.on("client-message", function (data){
      console.log('passing data through sockets:', data);
      io.emit('server_response', {data: data.data, name: data.name, users:users});
    });

});




