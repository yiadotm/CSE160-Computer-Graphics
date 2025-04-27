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


// Globals related to UI elements
let g_globalAnglex = 0;
let g_globalAngley = 0;
let leftEarSlider = 0;
let rightEarSlider = 0;
let leftArmSlider = 0;
let leftHandSlider = 0;
let rightArmSlider = 0;
let rightHandSlider = 0;
let leftMouthSlider = 0;
let rightMouthSlider = 0;
let treeSlider = 0;
let g_animationLeftEar = false;
let g_animationRightEar = false;
let g_animationLeftArm = false;
let g_animationRightArm = false;
let g_animateAll = false;
let g_hiddenAnimation = false;
let g_animationTree = false;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {

    let log = document.querySelector("#log");
    document.addEventListener("click", logKey);

    function logKey(e) {
      // log.textContent = `The shift key is pressed: ${e.shiftKey}`;
      if (e.shiftKey) {
        g_hiddenAnimation = true;
      }

      
    }
    
    // Size Slider Event
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAnglex = this.value; renderScene(); });

    document.getElementById('everythingAnimationOnButton').onclick = function() {g_animateAll = true;};
    document.getElementById('everythingAnimationOffButton').onclick = function() {g_animateAll = false; g_hiddenAnimation = false;};

    // Animation
    document.getElementById('leftEarSlide').addEventListener('mousemove', function() {leftEarSlider = this.value; renderScene(); });
    document.getElementById('leftEarAnimationOnButton').onclick = function() {g_animationLeftEar = true;};
    document.getElementById('leftEarAnimationOffButton').onclick = function() {g_animationLeftEar = false;};


    document.getElementById('rightEarSlide').addEventListener('mousemove', function() {rightEarSlider = this.value; renderScene(); });
    document.getElementById('rightEarAnimationOnButton').onclick = function() {g_animationRightEar = true;};
    document.getElementById('rightEarAnimationOffButton').onclick = function() {g_animationRightEar = false;};

    
    document.getElementById('leftArmSlide').addEventListener('mousemove', function() {leftArmSlider = this.value; renderScene(); });
    document.getElementById('leftHandSlide').addEventListener('mousemove', function() {leftHandSlider = this.value; renderScene(); });
    document.getElementById('leftArmAnimationOnButton').onclick = function() {g_animationLeftArm = true;};
    document.getElementById('leftArmAnimationOffButton').onclick = function() {g_animationLeftArm = false;};

    
    document.getElementById('rightArmSlide').addEventListener('mousemove', function() {rightArmSlider = this.value; renderScene(); });
    document.getElementById('rightHandSlide').addEventListener('mousemove', function() {rightHandSlider = this.value; renderScene(); });
    document.getElementById('rightArmAnimationOnButton').onclick = function() {g_animationRightArm = true;};
    document.getElementById('rightArmAnimationOffButton').onclick = function() {g_animationRightArm = false;};

    document.getElementById('treeSlide').addEventListener('mousemove', function() {treeSlider = this.value; renderScene(); });
    document.getElementById('treeAnimationOnButton').onclick = function() {g_animationTree = true;};
    document.getElementById('treeAnimationOffButton').onclick = function() {g_animationTree = false;};
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
  // renderScene();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  
  // console.log(g_seconds);
  updateAnimations();
  hiddenAnimation();


  renderScene();
  requestAnimationFrame(tick);
}

function hiddenAnimation() {
  
  if (g_hiddenAnimation) {
    console.log("here ", g_hiddenAnimation);
    leftMouthSlider = (15*Math.sin(5*g_seconds));
    rightMouthSlider = (15*Math.sin(5*g_seconds));
    treeSlider = (10*Math.sin(2*g_seconds));

  }



}

function updateAnimations() {
  if (g_animationLeftEar) {
    leftEarSlider = (-5*Math.sin(3*g_seconds));
  }
  if (g_animationRightEar) {
    rightEarSlider = (5*Math.sin(3*g_seconds));
  }
  if (g_animationLeftArm) {
    leftArmSlider = (10*Math.sin(2*g_seconds));
  }
  if (g_animationRightArm) {
    rightArmSlider = (-10*Math.sin(2*g_seconds));
  }
  if (g_animationTree) {
    treeSlider = (10*Math.sin(2*g_seconds));
  }
  if (g_animateAll) {
    leftEarSlider = (-5*Math.sin(3*g_seconds));
    rightEarSlider = (5*Math.sin(3*g_seconds));
    leftArmSlider = (10*Math.sin(2*g_seconds));
    rightArmSlider  = (-10*Math.sin(2*g_seconds));
    treeSlider = (10*Math.sin(2*g_seconds));
  }
}


function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);
  g_globalAnglex = x *100;
  g_globalAngley = y *100;




  // Draw every shape that is supposed to be in the canvas
  renderScene();
  
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
function renderScene() {

  // Check the time at the start of this function
  var startTime = performance.now();

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAnglex, 0, 1, 0);
  globalRotMat = globalRotMat.rotate(g_globalAngley,1,0,0);
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
  leftEar.matrix.translate(-0.16, .30, 0.3);
  // leftEar.matrix.rotate(180,0,1,0);
  leftEar.matrix.rotate(leftEarSlider,0,0,1);
  leftEar.matrix.scale(0.25, 0.50, 0.20);
  leftEar.render();

  var rightEar = new Cube();
  rightEar.color = BEIGE;
  rightEar.matrix.translate( 0.11, .30, 0.3);
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
  mouth1.matrix.rotate(leftMouthSlider,1,0,0);
  mouth1.matrix.rotate(20, 0, 0, 1);
  mouth1.matrix.scale(0.20, 0.05, 0.05);
  mouth1.render();

  // “X” Mouth — second stroke
  var mouth2 = new Cube();
  mouth2.color = [0.0, 0.0, 0.0, 1.0];
  mouth2.matrix.translate(-.01, -0.06, -.05);
  mouth2.matrix.rotate(rightMouthSlider,1,0,0);
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
  leftArm.matrix.translate(-0.09, -0.2200, 0.20);
  // leftArm.matrix.rotate(20,0,0,1);
  leftArm.matrix.rotate(180,0,0,1);
  leftArm.matrix.rotate(leftArmSlider,0,0,1);
  var leftArmMatrix = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.3, 0.20, 0.30);
  leftArm.render();

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
  leftHand.matrix.translate(0.15, 0.049, 0.05);
  // leftHand.matrix.rotate(20,0,0,1);
  leftHand.matrix.rotate(leftHandSlider,1,0,0);
  var leftHandMatrix = new Matrix4(leftHand.matrix);
  leftHand.matrix.scale(0.25, 0.15, 0.20);
  // leftHand.matrix.scale(1, 0.8, 0.8);
  leftHand.render();


  var rightArmShirt = new Cube();
  rightArmShirt.color = GREY;
  rightArmShirt.matrix.translate( 0.33, -0.4200, 0.20);
  // rightArm.matrix.rotate(-20,0,0,1);
  rightArmShirt.matrix.rotate(rightArmSlider,0,0,1);
  var rightArmMatrix = new Matrix4(rightArmShirt.matrix);
  rightArmShirt.matrix.scale(0.25, 0.20, 0.30);
  rightArmShirt.render();

  var rightHand = new Cube();
  rightHand.matrix = rightArmMatrix;
  rightHand.color = BEIGE;
  rightHand.matrix.translate( 0.17, 0.003, 0.05);
  // rightHand.matrix.rotate(-20,0,0,1);
  rightHand.matrix.rotate(rightHandSlider,1,0,0);
  var rightHandMatrix = new Matrix4(rightHand.matrix);
  rightHand.matrix.scale(0.25, 0.15, 0.20);
  // rightArm.matrix.scale(1, 0.80, 0.80);
  rightHand.render();

  // Legs
  var leftLeg = new Cube();
  leftLeg.color = BEIGE;
  leftLeg.matrix.translate(-0.19, -0.69, -0.2);
  leftLeg.matrix.rotate(0,1,0,0);
  leftLeg.matrix.scale(0.21, 0.20, 0.40);
  leftLeg.render();



  var rightLeg = new Cube();
  rightLeg.color = BEIGE;
  rightLeg.matrix.translate( 0.18, -.69, -.2);
  rightLeg.matrix.rotate(0,1,0,0);
  rightLeg.matrix.scale(0.21, 0.20, 0.40);
  rightLeg.render();


  var stump = new Cube();
  stump.matrix = leftHandMatrix;
  stump.color = [0.38, 0.29, 0.24, 1];
  stump.matrix.translate(0.35, 0.15, 0.05);
  stump.matrix.rotate(180, 0, 0, 1);
  stump.matrix.rotate(treeSlider, 1, 0, 0);
  var stumpMatrix = new Matrix4(stump.matrix);
  stump.matrix.scale(0.1, 0.3, 0.1);
  stump.render();

  var cone = new Cone();
  cone.matrix = stumpMatrix;
  cone.color = [0.24, 0.38, 0.34, 1.0]; 
  cone.matrix.translate(0.05, 0.3, 0.05); // Position the cone
  // cone.matrix.translate(1.2, 0.1, .4); // Position the cone
  // cone.matrix.rotate(-90, 0, 0, 1); // Rotate the cone
  cone.matrix.scale(0.3, .7, 0.3);  // Scale the cone
  cone.render();



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
