//
//     <script src="{{url_for('static', filename='app.js')}}"></script>


// helper function
// 4 Coordinate system used
// w & h = Pixel Width and Height with 640x360
// w_cursor & h_cursor = Pixel with 0,0 origin -320 to 320, -180 to 180
// a & b = Angle with 0,0 origin -90 to 90, 90 to -90
// A & B = Angle with 0 to 180, 0 to 180 
// P & T = PWM Signal send to servo with 0 to 180, 0 to 180
LIST_ANGLE_to_ab = [
  // TODO: How to get this formula?
  // H < LIST_RADIUS_ab[1]
  //  1,  0 =  22.5 < angle <     0 (-22.5)
  //  1,  1 =  67.5 < angle <  22.5
  //  0,  1 = 112.5 < angle <  67.5
  // -1,  1 = 157.5 < angle < 112.5
  // -1,  0 = 202.5 < angle < 157.5
  // -1, -1 = 247.5 < angle < 202.5
  //  0, -1 = 292.5 < angle < 247.5
  //  1, -1 = 337.5 < angle < 292.5
  //  1,  0 = 360 (382.5) < angle < 337.5
  [
    [  1,  0,  22.5,      0],
    [  1,  1,  67.5,   22.5],
    [  0,  1, 112.5,   67.5],
    [ -1,  1, 157.5,  112.5],
    [ -1,  0, 202.5,  157.5],
    [ -1, -1, 247.5,  202.5],
    [  0, -1, 292.5,  247.5],
    [  1, -1, 337.5,  292.5],
    [  1,  0,   360,  337.5]
  ],
  //
  // H < LIST_RADIUS_ab[2]
  //  2, 0 =  11.25 < angle <      0 (-11.25) 
  //  2, 1 =  33.75 < angle <  11.25 
  //  2, 2 =  56.25 < angle <  33.75 
  //  1, 2 =  78.75 < angle <  56.25 
  //  0, 2 = 101.25 < angle <  78.75 
  // -1, 2 = 123.75 < angle < 101.25 
  // -2, 2 = 146.25 < angle < 123.75
  // -2, 1 = 168.75 < angle < 146.25 
  // -2, 0 = 191.25 < angle < 168.75 
  // -2,-1 = 213.75 < angle < 191.25 
  // -2,-2 = 236.25 < angle < 213.75 
  // -1,-2 = 258.75 < angle < 236.25 
  //  0,-2 = 281.25 < angle < 258.75 
  //  1,-2 = 303.75 < angle < 281.25 
  //  2,-2 = 326.25 < angle < 303.75 
  //  2,-1 = 348.75 < angle < 326.25 
  //  2, 0 = 360 (371.25) < angle < 348.75
  [
    [ 2, 0,  11.25,      0],
    [ 2, 1,  33.75,  11.25],
    [ 2, 2,  56.25,  33.75],
    [ 1, 2,  78.75,  56.25],
    [ 0, 2, 101.25,  78.75],
    [-1, 2, 123.75, 101.25],
    [-2, 2, 146.25, 123.75],
    [-2, 1, 168.75, 146.25],
    [-2, 0, 191.25, 168.75],
    [-2,-1, 213.75, 191.25],
    [-2,-2, 236.25, 213.75],
    [-1,-2, 258.75, 236.25],
    [ 0,-2, 281.25, 258.75],
    [ 1,-2, 303.75, 281.25],
    [ 2,-2, 326.25, 303.75],
    [ 2,-1, 348.75, 326.25],
    [ 2, 0,    360, 348.75]
  ],
  //
  // H < LIST_RADIUS_ab[3]
  //  3, 0 =   7.5 < angle <     0 (-7.5) 
  //  3, 1 =  22.5 < angle <   7.5 
  //  3, 2 =  37.5 < angle <  22.5 
  //  3, 3 =  52.5 < angle <  37.5 
  //  2, 3 =  67.5 < angle <  52.5 
  //  1, 3 =  82.5 < angle <  67.5 
  //  0, 3 =  97.5 < angle <  82.5 
  // -1, 3 = 112.5 < angle <  97.5 
  // -2, 3 = 127.5 < angle < 112.5 
  // -3, 3 = 142.5 < angle < 127.5 
  // -3, 2 = 157.5 < angle < 142.5 
  // -3, 1 = 172.5 < angle < 157.5 
  // -3, 0 = 187.5 < angle < 172.5 
  // -3,-1 = 202.5 < angle < 187.5 
  // -3,-2 = 217.5 < angle < 202.5 
  // -3,-3 = 232.5 < angle < 217.5 
  // -2,-3 = 247.5 < angle < 232.5 
  // -1,-3 = 262.5 < angle < 247.5 
  //  0,-3 = 277.5 < angle < 262.5 
  //  1,-3 = 292.5 < angle < 277.5 
  //  2,-3 = 307.5 < angle < 292.5 
  //  3,-3 = 322.5 < angle < 307.5 
  //  3,-2 = 337.5 < angle < 322.5 
  //  3,-1 = 352.5 < angle < 337.5 
  //  3, 0 = 360 (367.5) < angle < 352.5
  [
    [ 3, 0,   7.5,     0],
    [ 3, 1,  22.5,   7.5],
    [ 3, 2,  37.5,  22.5],
    [ 3, 3,  52.5,  37.5],
    [ 2, 3,  67.5,  52.5],
    [ 1, 3,  82.5,  67.5],
    [ 0, 3,  97.5,  82.5],
    [-1, 3, 112.5,  97.5],
    [-2, 3, 127.5, 112.5],
    [-3, 3, 142.5, 127.5],
    [-3, 2, 157.5, 142.5],
    [-3, 1, 172.5, 157.5],
    [-3, 0, 187.5, 172.5],
    [-3,-1, 202.5, 187.5],
    [-3,-2, 217.5, 202.5],
    [-3,-3, 232.5, 217.5],
    [-2,-3, 247.5, 232.5],
    [-1,-3, 262.5, 247.5],
    [ 0,-3, 277.5, 262.5],
    [ 1,-3, 292.5, 277.5],
    [ 2,-3, 307.5, 292.5],
    [ 3,-3, 322.5, 307.5],
    [ 3,-2, 337.5, 322.5],
    [ 3,-1, 352.5, 337.5],
    [ 3, 0,   360, 352.5]
  ]
]
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

var LIST_RADIUS_ab = [5, 30, 70, 140]

var mouseIsDown = false;

var statusMouseCanvas = 0

canvas.onmousedown = function(e){
  if (statusMouseCanvas == 0){
    return
  }
  mouseIsDown = true;
  message = {
    "relay_1": 1,
  }
  sendMessage(JSON.stringify(message))
}

canvas.onmouseup = function(e){
  mouseIsDown = false;
  message = {
    "relay_1": 0,
  }
  sendMessage(JSON.stringify(message))
}

function calculateCircleSectionCoordinates(xCenter, yCenter, radiusInner, radiusOuter, section){
  var angleSection = 360/section;
  var countSection = 360/angleSection;
  var listCircleSectionCoordinates = []
  var angleOffset = angleSection/2
  for(let i = 0; i < countSection; i++){
    var angle = angleOffset + i*angleSection
    var xInner = xCenter + radiusInner * Math.sin(Math.PI * 2 * angle / 360);
    var yInner = yCenter + radiusInner * Math.cos(Math.PI * 2 * angle / 360);
    var xOuter = xCenter + radiusOuter * Math.sin(Math.PI * 2 * angle / 360);
    var yOuter = yCenter + radiusOuter * Math.cos(Math.PI * 2 * angle / 360);
    listCircleSectionCoordinates.push([xInner, yInner, xOuter, yOuter])
  }
  return listCircleSectionCoordinates
}

function canvasDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ctx.beginPath();
  // ctx.arc(w_origin, h_origin, RADIUS, 0, degToRad(360), true);
  // ctx.lineWidth = 3;
  // ctx.strokeStyle = 'lime';
  // ctx.stroke();
  // ctx.closePath()

  // remove aliasing
  ctx.beginPath();
  ctx.arc(w_cursor, h_cursor, 2, 0, degToRad(360), true);
  // ctx.moveTo(w_cursor, h_cursor - 30);
  // ctx.lineTo(w_cursor, h_cursor + 30);
  // ctx.moveTo(w_cursor - 30,  h_cursor);
  // ctx.lineTo(w_cursor + 30,  h_cursor);
  // Line color
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'lime';
  ctx.stroke();
  ctx.closePath()

  // Line from center to mouse
  ctx.beginPath();
  ctx.moveTo(w_origin,  h_origin);
  ctx.lineTo(w_cursor ,  h_cursor);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'lime';
  ctx.stroke();
  ctx.closePath()

  // Grid
  ctx.moveTo(w_origin,  h_origin);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'lime';
  for(let i = 0; i < LIST_RADIUS_ab.length; i++){
    var pixel = LIST_RADIUS_ab[i]
    // ctx.moveTo(x_up, 0);
    ctx.beginPath();
    ctx.arc(w_origin, h_origin, pixel, 0, degToRad(360), true);
    ctx.stroke();
    ctx.closePath()
    if (i < LIST_RADIUS_ab.length) {
      var radiusInner = LIST_RADIUS_ab[i]
      var radiusOuter = LIST_RADIUS_ab[i + 1]
      var listCircleSectionCoordinates = calculateCircleSectionCoordinates(w_origin, h_origin, radiusInner, radiusOuter, 8*(i+1))
      for(let j = 0; j < listCircleSectionCoordinates.length; j++){
        // [xInner, yInner, xOuter, yOuter]
        var sectionCoordinates = listCircleSectionCoordinates[j]
        var xInner = sectionCoordinates[0]
        var yInner = sectionCoordinates[1]
        var xOuter = sectionCoordinates[2]
        var yOuter = sectionCoordinates[3]
        ctx.beginPath();
        ctx.moveTo(xInner, yInner);
        ctx.lineTo(xOuter,  yOuter);
        ctx.stroke();
        ctx.closePath()
      }
    }
  }

  // Horizontal Position Bar
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'lime';
  ctx.moveTo(10, 350);
  ctx.lineTo(630,  350);
  ctx.stroke();

  // Vertical Position Bar
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'lime';
  ctx.moveTo(10, 10);
  ctx.lineTo(10, 350);
  ctx.stroke();

  // Horizontal Position Cursor
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'lime';
  ctx.arc(10+(A_global/180)*620, 350, 10, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Vertical Position Cursor
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'lime';
  ctx.arc(10, 350-(B_global/180)*340, 10, 0, 2 * Math.PI);
  ctx.stroke();
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
        
    statusMouseCanvas = 1
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');
    statusMouseCanvas = 0
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
    var ab_cursor = convert_xy_to_ab(x_cursor, y_cursor)
    a_cursor = ab_cursor[0]
    b_cursor = ab_cursor[1]
    if (!(a_cursor == 0 && b_cursor == 0)) {
      // var hyp_move_delta = hyp_cursor - hyp_move
      // var x_move_delta = x_cursor/hyp_cursor*hyp_move_delta
      // var y_move_delta = y_cursor/hyp_cursor*hyp_move_delta
      x_cursor = 0;//x_move_delta
      y_cursor = 0;//y_move_delta
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
  for(let i = 0; i < LIST_RADIUS_ab.length; i++){
    index = i
    // Skip checking for 0 case
    pixel = LIST_RADIUS_ab[i]
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
function convert_xy_to_ab(x, y){
  var polarCoor = cartesian2Polar(x, y)
  for(let i = 0; i < LIST_RADIUS_ab.length; i++){
    var r = LIST_RADIUS_ab[i]
    if (polarCoor.distance < r || i == LIST_RADIUS_ab.length - 1) { // For case of distance large than the largest r, use largest r
      if(i == 0) {
        return [0, 0]
      }
      for(let j = 0; j < LIST_ANGLE_to_ab[i-1].length; j++){
        var a = LIST_ANGLE_to_ab[i-1][j][0]
        var b = LIST_ANGLE_to_ab[i-1][j][1]
        var angle_end = LIST_ANGLE_to_ab[i-1][j][2]
        var angle_start = LIST_ANGLE_to_ab[i-1][j][3]
        if (polarCoor.degrees >= angle_start && polarCoor.degrees <= angle_end) {
          return [a, b]
        }
      }
    }
  }

  console.log("Cannot find for r=" + polarCoor.distance + " angle="+polarCoor.degrees)
}
function cartesian2Polar(x, y){
  var distance = Math.hypot(x, y)
  var radians = Math.atan2(y, x) //This takes y first
  var degrees = radians * (180/Math.PI)
  if(degrees < 0){
    degrees = 360 + degrees
  }
  var polarCoor = { distance:distance, radians:radians, degrees:degrees}
  return polarCoor
}

loop()