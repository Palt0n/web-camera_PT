// helper function

const RADIUS = 20;

function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

// setup of the canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var x_0 = Math.floor(canvas.width / 2) + 0.5;
var y_0 = Math.floor(canvas.height / 2) + 0.5;
var x = x_0;
var y = y_0;

function canvasDraw() {
  // ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f00";
  ctx.beginPath();
  ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
  ctx.fill();

  // remove aliasing
  ctx.strokeWidth = 1;
  ctx.moveTo(x_0, y_0 - 10);
  ctx.lineTo(x_0, y_0 + 10);
  ctx.moveTo(x_0 - 10,  y_0);
  ctx.lineTo(x_0 + 10,  y_0);
  // Line color
  ctx.strokeStyle = 'green';
  ctx.stroke();
  ctx.moveTo(x_0,  y_0);
  ctx.lineTo(x ,  y);
  ctx.strokeStyle = 'green';
  ctx.stroke();
}
canvasDraw();

// pointer lock object forking for cross browser

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

canvas.onclick = function() {
  canvas.requestPointerLock();
};

// pointer lock event listeners

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');  
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

var tracker = document.getElementById('tracker');

var animation;
function updatePosition(e) {
  x += e.movementX;
  y += e.movementY;
  if (x > canvas.width) {
    x = canvas.width;
  }
  if (y > canvas.height) {
    y = canvas.height;
  }  
  if (x < 0) {
    x = 0;
  }
  if (y < 0) {
    y = 0;
  }
  redrawTracker()
}

function redrawTracker() {
  tracker.textContent = "X position: " + x + ", Y position: " + y;

  if (!animation) {
    animation = requestAnimationFrame(function() {
      animation = null;
      canvasDraw();
    });
  }
}

var h_move = 2; // 2 px movement
function loop() {
  if (!(x == x_0 && y == y_0)) {
    // Convert to cartesian with center 0,0
    var x_rel = x - x_0
    var y_rel = y - y_0
    var h = Math.hypot(x_rel, y_rel)
    if (h_move > h) { // Close to origin case
      x = x_0
      y = y_0
    }
    else {
      var h_move_delta = h - h_move
      x = x_rel/h*h_move_delta + x_0
      y = y_rel/h*h_move_delta + y_0
    }
    console.log("x: "+x+" y: "+y)
    // execute loop function over and over
    redrawTracker();
  }
  requestAnimationFrame(loop);
}
loop()