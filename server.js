// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

let blobs = [];

function Blob(id, name, x, y, r, color) {
  this.id = id;
  this.name = name;
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
}

// Using express: http://expressjs.com/
let express = require('express');
// Create the app
let app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
let server = app.listen(process.env.PORT || 3000, listen);
// This call back just tells us that the server has started
function listen() {
  var host = "localhost";
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
let io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', blobs);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
  'connection',
  // We are given a websocket object in our function
  function (socket) {
    // announcing new blob
    console.log('We have a new client: ' + socket.id);

    socket.on('start', function (data) {
      // Adding Blob to the sever
      console.log("its name is " + data.name);
      let blob = new Blob(socket.id, data.name, data.x, data.y, data.r, data.color);
      blobs.push(blob);
    });

    socket.on('update', function (data) {
      // Updating Blob Position and size
      //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
      let blob;
      for (let i = 0; i < blobs.length; i++) {
        if (socket.id == blobs[i].id) {
          blob = blobs[i];
        }
      }
      blob.name = data.name;
      blob.x = data.x;
      blob.y = data.y;
      blob.r = data.r;
      blob.color = data.color;
    });

    socket.on('disconnect', function () {
      // disconnecting blob will be removed
      for (var i = 0; i < blobs.length; i++) {
        if (blobs[i].id == socket.id) {
          blobs.splice(i, 1);
        }
      }
      console.log('Client has disconnected');
    });
  }
);