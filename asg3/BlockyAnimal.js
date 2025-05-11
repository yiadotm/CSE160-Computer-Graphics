// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    // gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform sampler2D u_Sampler7;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    } else if (u_whichTexture == 5) {
      gl_FragColor = texture2D(u_Sampler5, v_UV);
    } else if (u_whichTexture == 6) {
      gl_FragColor = texture2D(u_Sampler6, v_UV);
    } else if (u_whichTexture == 7) {
      gl_FragColor = texture2D(u_Sampler7, v_UV);
    } else {
      gl_FragColor = vec4(1, .2, .2, 1);
    }
  }`

// Global Variables
let n = 15;
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_Sampler7;
let u_whichTexture;


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

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return;
  }
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return;
  }
  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return;
  }
  u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
  if (!u_Sampler6) {
    console.log('Failed to get the storage location of u_Sampler6');
    return;
  }
  u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
  if (!u_Sampler7) {
    console.log('Failed to get the storage location of u_Sampler7');
    return;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
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
let g_camera = new Camera();
let g_selectedCell = { x: 0, y: 0 };



let BEIGE = [0.87, 0.90, 0.92, 1];
let GREY = [.52, .52, .52, 1.0];
let BLUE = [0.6745, 0.8039, 0.8784, 1.0];
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
    document.getElementById('addCell').onclick = () => {
      let x = parseInt(document.getElementById('cellX').value, 10);
      let y = parseInt(document.getElementById('cellY').value, 10);
      if (x >= 0 && x < n && y >= 0 && y < n) {
        g_map[x][y] = 1;
        renderScene();
      } else {
        alert(`Invalid cell: must be 0–${n-1}`);
      }
    };
    
    document.getElementById('deleteCell').onclick = () => {
      let x = parseInt(document.getElementById('cellX').value, 10);
      let y = parseInt(document.getElementById('cellY').value, 10);
      if (x >= 0 && x < n && y >= 0 && y < n) {
        g_map[x][y] = 0;
        renderScene();
      } else {
        alert(`Invalid cell: must be 0–${n-1}`);
      }
    };
    
}

function initTextures() {

  var quartzImg = new Image();
  var blackStoneImg = new Image();
  var skyImg = new Image();
  var grassImg = new Image();
  var waterImg = new Image();
  var stoneImg = new Image();
  var sakuraImg = new Image();
  var woodImg = new Image();



  if (!quartzImg || !blackStoneImg || !skyImg || !grassImg || !waterImg || !stoneImg || !sakuraImg || !woodImg) {
    console.log('Failed to create the image object');
    return false;
  }
  quartzImg.onload = function() { sendImageToTEXTURE(0, quartzImg, u_Sampler0); };
  quartzImg.src = 'images/quartz.jpg';
  blackStoneImg.onload = function() { sendImageToTEXTURE(1, blackStoneImg, u_Sampler1); };
  blackStoneImg.src = 'images/blackstone.jpg';
  skyImg.onload = function() { sendImageToTEXTURE(2, skyImg, u_Sampler2); };
  skyImg.src = 'images/sky.jpg';
  grassImg.onload = function() { sendImageToTEXTURE(3, grassImg, u_Sampler3); };
  grassImg.src = 'images/grass.jpg';
  waterImg.onload = function() { sendImageToTEXTURE(4, waterImg, u_Sampler4); };
  waterImg.src = 'images/water.jpg';
  stoneImg.onload = function() { sendImageToTEXTURE(5, stoneImg, u_Sampler5); };
  stoneImg.src = 'images/stone.jpg';
  sakuraImg.onload = function() { sendImageToTEXTURE(6, sakuraImg, u_Sampler6); };
  sakuraImg.src = 'images/sakura.jpg';
  woodImg.onload = function() { sendImageToTEXTURE(7, woodImg, u_Sampler7); };
  woodImg.src = 'images/birch.jpg';
  console.log("finished loadTexture");

  return true;
}
function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
function sendImageToTEXTURE(unit, image, u_Sampler) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  gl.activeTexture(gl.TEXTURE0 + unit); // Activate texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture object to target
  // Set the texture parameters
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); // Set the image to texture object
 
  // if image is power of 2,then mipmap
  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  gl.uniform1i(u_Sampler, unit); // Set the texture unit 0 to u_Sampler0

  // console.log(`finished loadTexture into TEXTURE${unit}`, { unit, u_Sampler });


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


function main() {
  setupWebGL();

  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();
  // canvas.onmousedown = function(ev) {
  //   click(ev);                    // set g_selectedCell
  //   canvas.requestPointerLock();  // then grab the mouse
  // };
  canvas.onmousedown = () => canvas.requestPointerLock();

    document.addEventListener("mousemove", mouseLook, false);

  document.onkeydown = keydown;
  initTextures();
  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;

  // canvas.onmousemove = click;
  // canvas.onmousemove = function(ev) { if(ev.buttons == 1) click(ev); }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.6745, 0.8039, 0.8784, 1.0);

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

function mouseLook(event) {
  if (document.pointerLockElement !== canvas) return;
  const sensitivity = 0.005;
  let lr = -event.movementX * sensitivity; // Left/right rotation
  let ud = -event.movementY * sensitivity; // Up/down rotation
  g_camera.lr(lr);
  g_camera.ud(ud);
  renderScene();
}

function keydown(ev) {
  if (ev.keyCode==68) { //D
    g_camera.moveRight();
  } else if (ev.keyCode == 65) { //A
    g_camera.moveLeft();
  } else if (ev.keyCode == 87) { //W
    g_camera.moveForward();
  } else if (ev.keyCode == 83) { //S
    g_camera.moveBackwards();
  } else if (ev.keyCode == 81) { //Q
    g_camera.panLeft();
  } else if (ev.keyCode == 69) { //E
    g_camera.panRight();
  } else if (ev.keyCode === 82) { // 'R'
    // add a wall
    if (g_selectedCell.x !== null) {
      g_map[g_selectedCell.x][g_selectedCell.y] = 1;
      console.log("r:", g_map[g_selectedCell.x][g_selectedCell.y]);
    }
  } else if (ev.keyCode === 70) { // 'F'
    // delete a wall
    if (g_selectedCell.x !== null) {
      g_map[g_selectedCell.x][g_selectedCell.y] = 0;
      console.log("f:", g_map[g_selectedCell.x][g_selectedCell.y]);

    }
  }
  renderScene();
  // console.log(ev.keyCode);
}

let g_map = [
// 1  2  3  4  5  6  7  8  9  10  11  12  13  14  15
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1,  1,  1,  1,  1, 1], 
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 1,  1,  1,  1,  1,  1, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 1,  0,  0,  0,  0,  0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1,  0,  1,  1,  1,  0, 1],
  [1, 0, 0, 0, 1, 1, 0, 1, 1, 1,  0,  1,  0,  1,  0, 1],
  [1, 0, 1, 0, 1, 1, 0, 0, 1, 1,  0,  1,  0,  1,  0, 1],
  [1, 0, 1, 0, 0, 1, 1, 1, 1, 1,  0,  1,  0,  1,  0, 1],
  [1, 0, 1, 0, 0, 1, 3, 3, 3, 3,  0,  1,  0,  1,  0, 1],
  [1, 0, 1, 0, 1, 1, 3, 3, 3, 3,  1,  0,  0,  0,  0, 1],
  [1, 0, 1, 0, 0, 1, 3, 3, 3, 3,  1,  0,  1,  0,  0, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 1, 1,  1,  0,  1,  1,  0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 0,  0,  0,  1,  0,  0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 0,  0,  0,  1,  0,  1, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1,  1,  0,  0,  0,  1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,  1,  0,  1,  0,  0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1,  2,  1,  1,  1, 1]
];

function drawMap() {
  let n = g_map.length;
  var wall = new Cube();  
  var start = new Cube();
  // for (let i = 0; i< 2; i++) {
    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        let height = g_map[x][y];
        if (height == 1) {
          
          wall.color = [0, 1, 1, 1];
          wall.textureNum = 0;
          wall.matrix.setTranslate(0, -.70, 0);
          wall.matrix.scale(3, 3, 3);
          wall.matrix.translate(x - n/2, 0, y - n/2);
          wall.renderFaster();
          // console.log("wall done: ", x, y);
        }
        if (height == 2) {
          start.color = [1, 1, 0, 1];
          start.textureNum = 6;
          start.matrix.setTranslate(0, -0.5, 0);
          start.matrix.scale(3, 0.4, 3);
          start.matrix.translate(x - n/2, 0, y - n/2)
          start.renderFaster();
        }
        if (height == 3) {
          start.color = [1, 1, 0, 1];
          start.textureNum = 4;
          start.matrix.setTranslate(0, -1.1, 0);
          start.matrix.scale(3, 0.4, 3);
          start.matrix.translate(x - n/2, 0, y - n/2)
          start.renderFaster();
        }

        // console.log("x: ", x, "y: ", y, "height: ", height);
      }
    }
    // console.log("rendered map");
  // }
}

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);
  g_globalAnglex = x *100;
  g_globalAngley = y *100;

  // Draw every shape that is supposed to be in the canvas
  renderScene();
  
}

// function click(ev) {
//   // 1) get normalized GL coords [-1…1]
//   const [glX, glY] = convertCoordinatesEventToGL(ev);

//   // 2) turn into 0…n−1 indices
//   const n = g_map.length;                      // your map is n×n :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
//   let i = Math.floor((glX + 1) * n / 2);
//   let j = Math.floor((glY + 1) * n / 2);
//   // clamp
//   i = Math.min(n-1, Math.max(0, i));
//   j = Math.min(n-1, Math.max(0, j));

//   // 3) stash for later
//   g_selectedCell.x = i;
//   g_selectedCell.y = j;
//   console.log(`Selected cell: [${i},${j}]`);

//   // 4) re-draw so you see any highlight logic
//   renderScene();
// }


function drawMiffy() {
    // START OF CHARACTER MIFFY
    // Ears
    var leftEar = new Cube();
    leftEar.color = BEIGE;
    leftEar.textureNum = 7;
    leftEar.matrix.translate(-0.16, .30, 0.3);
    // leftEar.matrix.rotate(180,0,1,0);
    leftEar.matrix.rotate(leftEarSlider,0,0,1);
    leftEar.matrix.scale(0.25, 0.50, 0.20);
    leftEar.renderFaster();
  
    var rightEar = new Cube();
    rightEar.color = BEIGE;
    rightEar.textureNum = 7;
    rightEar.matrix.translate( 0.11, .30, 0.3);
    rightEar.matrix.rotate(rightEarSlider,0,0,1);
    rightEar.matrix.scale(0.25, 0.50, 0.20);
    rightEar.renderFaster();
  
    // Head
    var head = new Cube();
    head.color = BEIGE;
    head.textureNum = 7;
    head.matrix.translate(-.3, -0.20, 0.00);
    head.matrix.rotate(0,1,0,0);
    head.matrix.scale(0.80, 0.70, 0.80);
    head.renderFaster();
  
      // Eyes
    var eyeLeft = new Cube();
    eyeLeft.color = [0.0, 0.0, 0.0, 1.0];
    eyeLeft.textureNum = 1;
    eyeLeft.matrix.translate(-0.16, 0.07, -0.05);
    eyeLeft.matrix.rotate(0,1,0,0);
    eyeLeft.matrix.scale(0.1, 0.15, 0.05);
    eyeLeft.renderFaster();
  
    var eyeRight = new Cube();
    eyeRight.color = [0.0, 0.0, 0.0, 1.0];
    eyeRight.textureNum = 1;
    eyeRight.matrix.translate( 0.25, 0.07, -.05);
    eyeRight.matrix.rotate(0,1,0,0);
    eyeRight.matrix.scale(0.1, 0.15, 0.05);
    eyeRight.renderFaster();
  
      // “X” Mouth — first stroke
    var mouth1 = new Cube();
    mouth1.color = [0.0, 0.0, 0.0, 1.0];
    mouth1.textureNum = 1;
    mouth1.matrix.translate(0.01, -0.13, -.05);
    mouth1.matrix.rotate(leftMouthSlider,1,0,0);
    mouth1.matrix.rotate(20, 0, 0, 1);
    mouth1.matrix.scale(0.20, 0.05, 0.05);
    mouth1.renderFaster();
  
    // “X” Mouth — second stroke
    var mouth2 = new Cube();
    mouth2.color = [0.0, 0.0, 0.0, 1.0];
    mouth2.textureNum = 1;
    mouth2.matrix.translate(-.01, -0.06, -.05);
    mouth2.matrix.rotate(rightMouthSlider,1,0,0);
    mouth2.matrix.rotate(-20, 0, 0, 1);
    mouth2.matrix.scale(0.20, 0.05, 0.05);
    mouth2.renderFaster();
  
    // Body
    var body = new Cube();
    body.color = GREY;
    body.matrix.translate(-0.2, -0.70, 0.1);
    body.matrix.rotate(0,1,0,0);
    body.matrix.scale(0.60, 0.60, 0.50);
    body.renderFaster();
  
    // Arms
    var leftArm = new Cube();
    leftArm.color = GREY;
    leftArm.matrix.translate(-0.09, -0.2200, 0.20);
    // leftArm.matrix.rotate(20,0,0,1);
    leftArm.matrix.rotate(180,0,0,1);
    leftArm.matrix.rotate(leftArmSlider,0,0,1);
    var leftArmMatrix = new Matrix4(leftArm.matrix);
    leftArm.matrix.scale(0.3, 0.20, 0.30);
    leftArm.renderFaster();
  
    var leftHand = new Cube();
    leftHand.matrix = leftArmMatrix;
    leftHand.color = BEIGE;
    leftHand.textureNum = 7;
    leftHand.matrix.translate(0.15, 0.049, 0.05);
    // leftHand.matrix.rotate(20,0,0,1);
    leftHand.matrix.rotate(leftHandSlider,1,0,0);
    var leftHandMatrix = new Matrix4(leftHand.matrix);
    leftHand.matrix.scale(0.25, 0.15, 0.20);
    // leftHand.matrix.scale(1, 0.8, 0.8);
    leftHand.renderFaster();
  
  
    var rightArmShirt = new Cube();
    rightArmShirt.color = GREY;
    rightArmShirt.matrix.translate( 0.33, -0.4200, 0.20);
    // rightArm.matrix.rotate(-20,0,0,1);
    rightArmShirt.matrix.rotate(rightArmSlider,0,0,1);
    var rightArmMatrix = new Matrix4(rightArmShirt.matrix);
    rightArmShirt.matrix.scale(0.25, 0.20, 0.30);
    rightArmShirt.renderFaster();
  
    var rightHand = new Cube();
    rightHand.matrix = rightArmMatrix;
    rightHand.color = BEIGE;
    rightHand.textureNum = 7;
    rightHand.matrix.translate( 0.17, 0.003, 0.05);
    // rightHand.matrix.rotate(-20,0,0,1);
    rightHand.matrix.rotate(rightHandSlider,1,0,0);
    var rightHandMatrix = new Matrix4(rightHand.matrix);
    rightHand.matrix.scale(0.25, 0.15, 0.20);
    // rightArm.matrix.scale(1, 0.80, 0.80);
    rightHand.renderFaster();
  
    // Legs
    var leftLeg = new Cube();
    leftLeg.color = BEIGE;
    leftLeg.textureNum = 7;
    leftLeg.matrix.translate(-0.19, -0.69, -0.2);
    leftLeg.matrix.rotate(0,1,0,0);
    leftLeg.matrix.scale(0.21, 0.20, 0.40);
    leftLeg.renderFaster();
  
    var rightLeg = new Cube();
    rightLeg.color = BEIGE;
    rightLeg.textureNum = 7;
    rightLeg.matrix.translate( 0.18, -.69, -.2);
    rightLeg.matrix.rotate(0,1,0,0);
    rightLeg.matrix.scale(0.21, 0.20, 0.40);
    rightLeg.renderFaster();
  
  
    var stump = new Cube();
    stump.matrix = leftHandMatrix;
    stump.color = [0.38, 0.29, 0.24, 1];
    stump.matrix.translate(0.35, 0.15, 0.05);
    stump.matrix.rotate(180, 0, 0, 1);
    stump.matrix.rotate(treeSlider, 1, 0, 0);
    var stumpMatrix = new Matrix4(stump.matrix);
    stump.matrix.scale(0.1, 0.3, 0.1);
    stump.renderFaster();
  
    var cone = new Cone();
    cone.matrix = stumpMatrix;
    cone.color = [0.24, 0.38, 0.34, 1.0]; 
    cone.matrix.translate(0.05, 0.3, 0.05); // Position the cone
    // cone.matrix.translate(1.2, 0.1, .4); // Position the cone
    // cone.matrix.rotate(-90, 0, 0, 1); // Rotate the cone
    cone.matrix.scale(0.3, .7, 0.3);  // Scale the cone
    cone.render();
  
}
// var g_eye = [0,0,3];
// var g_at = [0,0,-100];
// var g_up = [0,1,0];
// Draw every shape that is supposed to be in the canvas
function renderScene() {

  // Check the time at the start of this function
  var startTime = performance.now();

  // Pass the projection matrix to u_ProjectionMatrix attribute
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 100); // (fov, aspect, near, far)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix to u_ViewMatrix attribute
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
  );
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAnglex, 0, 1, 0);
  globalRotMat = globalRotMat.rotate(g_globalAngley,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw floor
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum = 3;
  floor.matrix.translate(0.0, -0.75, 0.0);
  floor.matrix.scale(50,0,50);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.renderFaster();

  // draw sky
  var sky = new Cube();
  sky.color = BLUE;
  sky.textureNum = 2;
  sky.matrix.scale(50, 70, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.renderFaster();


  
  // draw Miffy
  drawMiffy();

    // draw map
  drawMap();

  


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
