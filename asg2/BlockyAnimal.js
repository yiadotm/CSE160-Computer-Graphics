// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST); // Enable depth test

}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
// Globals related to UI elements
let g_selectColor=[1.0,1.0,1.0,1.0]; // Default color is white
let g_selectedSize=5; // Default size is 5
let g_selectedType=POINT; // Default shape is point
let g_globalAngle = 0;
let leftEarSlider = 13;
let rightEarSlider = -15;
let leftArmSlider = 0;
let rightArmSlider = 0;
// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {

    // Button Events (Shape Type)
    
    // Size Slider Event
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });

    // Animation
    document.getElementById('leftEarSlide').addEventListener('mousemove', function() {leftEarSlider = this.value; renderAllShapes(); });
    document.getElementById('rightEarSlide').addEventListener('mousemove', function() {rightEarSlider = this.value; renderAllShapes(); });
    document.getElementById('leftArmSlide').addEventListener('mousemove', function() {leftArmSlider = this.value; renderAllShapes(); });
    document.getElementById('rightArmSlide').addEventListener('mousemove', function() {rightArmSlider = this.value; renderAllShapes(); });
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  // canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) click(ev); }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.6745, 0.8039, 0.8784, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
}



var g_shapesList = []; // Store the shapes

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of a point

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  }
  else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  }
  else {
    point = new Circle();
  }


  // Create and store the new point
  point.position = [x, y];
  point.color = g_selectColor.slice();
  point.size = g_selectedSize;
  // point.segments = g_segments;
  g_shapesList.push(point);



  // console.log("segments", g_segments)
  console.log(g_shapesList); // Debug: Check the contents of g_shapesList
  console.log(typeof point, point instanceof Point); // Debug: Ensure it's a Point instance

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
  
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
}


// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

  // Check the time at the start of this function
  var startTime = performance.now();

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // drawTriangle3D( [-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0] );

  // // Draw the body cube
  // var body = new Cube();
  // body.color = [1.0,0.0,0.0,1.0];
  // body.matrix.translate(-0.25, -0.5, 0.0);
  // body.matrix.scale(0.5, 1, 0.5);
  // body.render();

  // // Draw the left arm
  // var leftArm = new Cube();
  // leftArm.color = [1,1,0,1];
  // leftArm.matrix.setTranslate(0.7, 0, 0.0);
  // leftArm.matrix.rotate(45, 0, 0, 1);
  // leftArm.matrix.scale(0.25, 0.7, 0.5);
  // leftArm.render();

  // // Test box
  // var box = new Cube();
  // box.color = [1,0,1,1];
  // box.matrix.translate(0, 0, -0.5, 0.0);
  // box.matrix.rotate(-30, 1, 0, 0);
  // box.matrix.scale(0.5, 0.5, 0.5);
  // box.render();


  // START OF CHARACTER MIFFY
  let BEIGE = [0.87, 0.90, 0.92, 1];
  let GREY = [.52, .52, .52, 1.0];
  // Ears
  var leftEar = new Cube();
  leftEar.color = BEIGE;
  leftEar.matrix.translate(-0.15, .30, 0.3);
  leftEar.matrix.rotate(leftEarSlider,0,0,1);
  leftEar.matrix.scale(0.25, 0.50, 0.20);
  leftEar.render();

  var rightEar = new Cube();
  rightEar.color = BEIGE;
  rightEar.matrix.translate( 0.10, .30, 0.3);
  rightEar.matrix.rotate(rightEarSlider,0,0,1);
  rightEar.matrix.scale(0.25, 0.50, 0.20);
  rightEar.render();

  // Head
  var head = new Cube();
  head.color = BEIGE;
  head.matrix.translate(-.3, -0.20, 0.00);
  head.matrix.rotate(0,1,0,0);
  head.matrix.scale(0.80, 0.70, 0.80);
  head.render();

    // Eyes
  var eyeLeft = new Cube();
  eyeLeft.color = [0.0, 0.0, 0.0, 1.0];
  eyeLeft.matrix.translate(-0.16, 0.07, -0.05);
  eyeLeft.matrix.rotate(0,1,0,0);
  eyeLeft.matrix.scale(0.1, 0.15, 0.05);
  eyeLeft.render();

  var eyeRight = new Cube();
  eyeRight.color = [0.0, 0.0, 0.0, 1.0];
  eyeRight.matrix.translate( 0.25, 0.07, -.05);
  eyeRight.matrix.rotate(0,1,0,0);
  eyeRight.matrix.scale(0.1, 0.15, 0.05);
  eyeRight.render();

    // “X” Mouth — first stroke
  var mouth1 = new Cube();
  mouth1.color = [0.0, 0.0, 0.0, 1.0];
  mouth1.matrix.translate(0.01, -0.13, -.05);
  mouth1.matrix.rotate(0,1,0,0);
  mouth1.matrix.rotate(20, 0, 0, 1);
  mouth1.matrix.scale(0.20, 0.05, 0.05);
  mouth1.render();

  // “X” Mouth — second stroke
  var mouth2 = new Cube();
  mouth2.color = [0.0, 0.0, 0.0, 1.0];
  mouth2.matrix.translate(-.01, -0.06, -.05);
  mouth2.matrix.rotate(0,1,0,0);
  mouth2.matrix.rotate(-20, 0, 0, 1);
  mouth2.matrix.scale(0.20, 0.05, 0.05);
  mouth2.render();

  // Body
  var body = new Cube();
  body.color = GREY;
  body.matrix.translate(-0.2, -0.70, 0.1);
  body.matrix.rotate(0,1,0,0);
  body.matrix.scale(0.60, 0.60, 0.50);
  body.render();

  // Arms
  var leftArm = new Cube();
  leftArm.color = GREY;
  leftArm.matrix.translate(-0.38, -0.4200, 0.20);
  // leftArm.matrix.rotate(20,0,0,1);
  leftArm.matrix.rotate(leftArmSlider,0,0,1);
  leftArm.matrix.scale(0.25, 0.20, 0.30);
  leftArm.render();
  var leftArmMatrix = new Matrix4(leftArm.matrix);

  // var leftHand = new Cube();
  // leftHand.color = BEIGE;
  // leftHand.matrix.translate(-0.5, -0.4200, 0.20);
  // // leftHand.matrix.rotate(20,0,0,1);
  // leftHand.matrix.rotate(leftArmSlider,0,0,1);
  // leftHand.matrix.scale(0.15, 0.20, 0.30);
  // leftHand.render();

  var leftHand = new Cube();
  leftHand.matrix = leftArmMatrix;
  leftHand.color = BEIGE;
  leftHand.matrix.translate(-0.5, 0, .1);
  // leftHand.matrix.rotate(20,0,0,1);
  leftHand.matrix.rotate(leftArmSlider,0,0,1);
  leftHand.matrix.scale(1, 0.8, 0.8);
  leftHand.render();


  var rightArm = new Cube();
  rightArm.color = GREY;
  rightArm.matrix.translate( 0.35, -0.4200, 0.20);
  // rightArm.matrix.rotate(-20,0,0,1);
  leftHand.matrix.rotate(rightArmSlider,0,0,1);
  rightArm.matrix.scale(0.25, 0.20, 0.30);
  rightArm.render();
  var rightArmMatrix = new Matrix4(rightArm.matrix);

  var rightArm = new Cube();
  rightArm.matrix = rightArmMatrix;
  rightArm.color = BEIGE;
  rightArm.matrix.translate( 0.5, 0, 0.1);
  // rightArm.matrix.rotate(-20,0,0,1);
  leftHand.matrix.rotate(rightArmSlider,0,0,1);
  rightArm.matrix.scale(1, 0.80, 0.80);
  rightArm.render();

  // Legs
  var leftLeg = new Cube();
  leftLeg.color = BEIGE;
  leftLeg.matrix.translate(-0.19, -0.7, -0.2);
  leftLeg.matrix.rotate(0,1,0,0);
  leftLeg.matrix.scale(0.21, 0.20, 0.40);
  leftLeg.render();

  var rightLeg = new Cube();
  rightLeg.color = BEIGE;
  rightLeg.matrix.translate( 0.19, -.7, -.2);
  rightLeg.matrix.rotate(0,1,0,0);
  rightLeg.matrix.scale(0.21, 0.20, 0.40);
  rightLeg.render();





  // Check the time at the end of this function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");

}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
