
// Keep track of our socket connection
let socket;

let blob;

let blobs = [];
let zoom = 1;

function setup() {
  // The canvas and game setup
  createCanvas(windowWidth, windowHeight);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
<<<<<<< HEAD
  socket = io.connect('http://3.91.44.133:3000');
  // The server's link and the colors that we are going to use
=======
  socket = io.connect('http://127.0.0.1:3000');
>>>>>>> parent of 3082498... alah
  let R = random(255);
  let G = random(255);
  let B = random(255);
  let randColor = color(R, G, B);
  let name = prompt("Please enter your name");
  blob = new Blob(name, random(width), random(height), 18, randColor);
  // Make a little object with  and y
  let data = {
    name: blob.name,
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    color: blob.color
  };
  socket.emit('start', data);

  socket.on('heartbeat', function (data) {
    //console.log(data);
    blobs = data;
  });
}


function draw() {
  // Map Properties and functionalities
  background(0);

  translate(width / 2, height / 2);
  let newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);

  for (let i = blobs.length - 1; i >= 0; i--) {
    let id = blobs[i].id;
    if (id !== socket.id) {
      noStroke();
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);
    }
    noStroke();
    fill(255, 62, 250);
    textAlign(CENTER, CENTER);
    textSize(14);
    textSize(6);
    text(blobs[i].name, blobs[i].x, blobs[i].y + blobs[i].r);

    // blobs[i].show();
    // if (blob.eats(blobs[i])) {
    //   blobs.splice(i, 1);
    // }
  }

  blob.show();
  // Moving the blob
  if (mouseIsPressed) {
    blob.update();
  }
  blob.constrain();

  let data = {
    name: blob.name,
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    color: blob.color
  };
  socket.emit('update', data);
  // Sending the new data to the socket
}