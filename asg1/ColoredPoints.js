// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
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

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
// Globals related to UI elements
let g_selectColor=[1.0,1.0,1.0,1.0]; // Default color is white
let g_selectedSize=5; // Default size is 5
let g_selectedType=POINT; // Default shape is point
// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {

    // Button Events (Shape Type)
    document.getElementById('green').onclick = function(){ g_selectColor=[0.0,1.0,0.0,1.0]; };
    document.getElementById('red').onclick   = function(){ g_selectColor=[1.0,0.0,0.0,1.0]; };
    document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes();};
    document.getElementById("drawButton").onclick = function() {drawDaisy();}

    document.getElementById('pointButton').onclick = function() { g_selectedType=POINT};
    document.getElementById('triButton').onclick = function() { g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick = function() { g_selectedType=CIRCLE};


    // Color Slider Events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectColor[2] = this.value/100; });

    // Size Slider Event
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });



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
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
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
  g_shapesList.push(point);


  // // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // // Store the color to g_colors array
  // g_colors.push(g_selectColor.slice());
 
  // // Store the size to g_sizes array
  // g_sizes.push(g_selectedSize);

  // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

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

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();

  }

  // Check the time at the end of this function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + "ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");

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

function drawDaisy() {
  renderAllShapes();
  gl.uniform4f(u_FragColor, 0.600, 0.741, 0.839, 1.0); // soft blue
  // head
  drawTriangle( [-3/10, -1/10, -3/10, 4/10, 3/10, 4/10] );
  drawTriangle( [-3/10, -1/10, 3/10, 4/10, 3/10, -1/10] );
  drawTriangle( [-2/10, 4/10, -2/10, 9/10, -0.5/10, 9/10] );
  drawTriangle( [-2/10, 4/10, -0.5/10, 4/10, -0.5/10, 9/10] );

  // ears
  drawTriangle( [2/10, 4/10, 2/10, 9/10, 0.5/10, 9/10] );
  drawTriangle( [2/10, 4/10, 0.5/10, 4/10, 0.5/10, 9/10] );

  // body
  drawTriangle( [-3/10, -1/10, 3/10, -1/10, -3/10, -6/10] );
  drawTriangle( [-3/10, -6/10, 3/10, -1/10, 3/10, -6/10] );

  // arms
  gl.uniform4f(u_FragColor, 0.698, 0.847, 0.949, 1.0); // light blue
  drawTriangle( [-4/10, -1/10, -4/10, -2.5/10, -1/10, -1/10] );
  drawTriangle( [-4/10, -2.5/10, -1/10, -2.5/10, -1/10, -1/10] );

  drawTriangle( [4/10, -1/10, 4/10, -2.5/10, 1/10, -1/10] );
  drawTriangle( [4/10, -2.5/10, 1/10, -2.5/10, 1/10, -1/10] );

  // legs
  drawTriangle( [-4/10, -4/10, -4/10, -7/10, -1/10, -4/10] );
  drawTriangle( [-4/10, -7/10, -1/10, -7/10, -1/10, -4/10] );

  drawTriangle( [4/10, -4/10, 4/10, -7/10, 1/10, -4/10] );
  drawTriangle( [4/10, -7/10, 1/10, -7/10, 1/10, -4/10] );

  // eyes
  gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0); // black
  drawTriangle( [-2/10, 1/10, -2/10, 2/10, -1/10, 2/10] );
  drawTriangle( [-2/10, 1/10, -1/10, 1/10, -1/10, 2/10] );

  drawTriangle( [2/10, 1/10, 2/10, 2/10, 1/10, 2/10] );
  drawTriangle( [2/10, 1/10, 1/10, 1/10, 1/10, 2/10] );
  
  // mouth
  drawTriangle( [0, 0, -0.3/10, 0.3/10, 0, 0.3/10] );
  drawTriangle( [0, 0, 0.3/10, 0.3/10, 0, 0.3/10] );


}
