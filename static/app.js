//
//     <script src="{{url_for('static', filename='app.js')}}"></script>


// helper function
// 4 Coordinate system used
// w & h = Pixel Width and Height with 640x360
// w_cursor & h_cursor = Pixel with 0,0 origin -320 to 320, -180 to 180
// a & b = Angle with 0,0 origin -90 to 90, 90 to -90
// A & B = Angle with 0 to 180, 0 to 180 
// P & T = PWM Signal send to servo with 0 to 180, 0 to 180 
const RADIUS = 18;

function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

// setup of the canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var a_global = 0
var b_global = 0

var w_origin = Math.floor(canvas.width / 2) + 0.5;
var h_origin = Math.floor(canvas.height / 2) + 0.5;
var w_cursor = w_origin;
var h_cursor = h_origin;
var x_cursor = 0
var y_cursor = 0
var a_cursor = 0
var b_cursor = 0
var A_global = 90
var B_global = 90
var A_move = 90
var B_move = 90
var P_global = 90
var T_global = 90
var P_move = 90
var T_move = 90

var list_angle_2_pixel = [0, 20, 40, 60, 80]

function canvasDraw() {
  // ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(w_origin, h_origin, RADIUS, 0, degToRad(360), true);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath()

  // remove aliasing
  ctx.beginPath();
  ctx.arc(w_cursor, h_cursor, 2, 0, degToRad(360), true);
  // ctx.moveTo(w_cursor, h_cursor - 30);
  // ctx.lineTo(w_cursor, h_cursor + 30);
  // ctx.moveTo(w_cursor - 30,  h_cursor);
  // ctx.lineTo(w_cursor + 30,  h_cursor);
  // Line color
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath()

  // Line from center to mouse
  ctx.beginPath();
  ctx.moveTo(w_origin,  h_origin);
  ctx.lineTo(w_cursor ,  h_cursor);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath()

  // Grid
  ctx.beginPath();
  for(let i = 0; i < list_angle_2_pixel.length; i++){
    pixel = list_angle_2_pixel[i]
    var x_up = w_origin + pixel
    var y_up = h_origin + pixel
    var x_down = w_origin - pixel
    var y_down = h_origin - pixel
    ctx.moveTo(x_up, 0);
    ctx.lineTo(x_up, canvas.height);
    ctx.moveTo(0, y_up);
    ctx.lineTo(canvas.width, y_up);
    ctx.moveTo(x_down, 0);
    ctx.lineTo(x_down, canvas.height);
    ctx.moveTo(0, y_down);
    ctx.lineTo(canvas.width, y_down);
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath()
}
canvasDraw();

// pointer lock object forking for cross browser

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

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
  w_cursor += e.movementX;
  h_cursor += e.movementY;
  if (w_cursor > canvas.width) {
    w_cursor = canvas.width;
  }
  if (h_cursor > canvas.height) {
    h_cursor = canvas.height;
  }  
  if (w_cursor < 0) {
    w_cursor = 0;
  }
  if (h_cursor < 0) {
    h_cursor = 0;
  }
  redrawTracker()
}

function redrawTracker() {
  // console.log("w_cursor: "+w_cursor+" h_cursor: "+h_cursor)
  // tracker.textContent = "X: " + x_cursor + ", Y: " + y_cursor + ", a: " + a_cursor + ", b: " + b_cursor;
  tracker.textContent = "a: " + a_cursor + ", b: " + b_cursor + ", A: " + A_global + ", B: " + B_global;

  if (!animation) {
    animation = requestAnimationFrame(function() {
      animation = null;
      canvasDraw();
    });
  }
}

var hyp_move = 20; // 2 px movement
var hyp_origin = 2; // 2 px movement
function loop() {
  if (!(w_cursor == w_origin && h_cursor == h_origin)) {
    // Convert to cartesian with center 0,0
    x_cursor = convert_w_to_x(w_cursor)
    y_cursor = convert_h_to_y(h_cursor)
    var hyp_cursor = Math.hypot(x_cursor, y_cursor)
    if (hyp_origin > hyp_cursor) { // If close to origin, round off to zero
      x_cursor = 0
      y_cursor = 0
    }
    a_cursor = convert_x_to_a(x_cursor)
    b_cursor = convert_y_to_b(y_cursor)
    if (!(a_cursor == 0 && b_cursor == 0)) {
      var hyp_move_delta = hyp_cursor - hyp_move
      var x_move_delta = x_cursor/hyp_cursor*hyp_move_delta
      var y_move_delta = y_cursor/hyp_cursor*hyp_move_delta
      x_cursor = x_move_delta
      y_cursor = y_move_delta
      moveCamera(a_cursor, b_cursor)
    }
    // console.log("x: "+x_cursor+" y: "+y_cursor+" a: "+a_cursor+" b: "+b_cursor)
    w_cursor = convert_x_to_w(x_cursor)
    h_cursor = convert_y_to_h(y_cursor)
    // execute loop function over and over
    redrawTracker();
  }
  requestAnimationFrame(loop);
}
function moveCamera(a, b){
  var A_move_new = A_global + a
  var B_move_new = B_global + b
  if (A_move_new<0){
    A_move_new = 0
  }
  if (A_move_new>180){
    A_move_new = 180
  }
  if (B_move_new<0){
    B_move_new = 0
  }
  if (B_move_new>180){
    B_move_new = 180
  }
  var P_move_new = convert_A_to_P(A_move_new)
  var T_move_new = convert_B_to_T(B_move_new)
  if (!(P_move_new == P_move && T_move_new == T_move)){
    message = {
      "camera_pan": P_move_new,
      "camera_tilt": T_move_new
    }
    sendMessage(JSON.stringify(message))
    P_move = P_move_new
    T_move = T_move_new
  }
}
function convert_A_to_P(A) {
  return 180 - A
}
function convert_B_to_T(B) {
  return B
}
function convert_P_to_A(P) {
  return 180 - P
}
function convert_T_to_B(T) {
  return T
}
function convert_x_to_w(x){
  return x + w_origin
}
function convert_y_to_h(y){
  return h_origin - y
}
function convert_w_to_x(w){
  return w - w_origin
}
function convert_h_to_y(h){
  return -(h - h_origin)
}

function convert_x_to_a(x){
  var index = 0
  for(let i = 1; i < list_angle_2_pixel.length; i++){
    index = i
    // Skip checking for 0 case
    pixel = list_angle_2_pixel[i]
    if (Math.abs(x) < pixel) {
      index = index - 1
      break;
    }
  }
  if (x < 0) {
    return -index
  }
  else {
    return index
  }
}
function convert_y_to_b(y){
  return convert_x_to_a(y)
}

loop()