// Danee Dang
// dudang@ucsc.edu
// asg0.js
// I used the Internet and ChatGPT to help me with the code.
window.onload = main;

let canvas = document.getElementById('example');

// Get the rendering context for 2DCG                          <- (2)
let ctx = canvas.getContext('2d');

// Create vector objects
let v1, v2;

// Operation and Scalar input
let operationSelect;
let scalarInput;


function resetCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, example.width, example.height);

    // Redraw the black square
    blackCanvas();
    
}


function blackCanvas() {
    // Draw a black square                                     <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a square with the color
}
function drawVector(v, color) {

    // Set the stroke color
    ctx.strokeStyle = color;

    // Set origins
    let originx = 200;
    let originy = 200;
    // Draw the vector as a line from the origin (0, 0) to (v.x, v.y)
    ctx.beginPath();
    ctx.moveTo(originx, originy);
    ctx.lineTo(originx + v.elements[0] * 20, originy - v.elements[1] * 20);
    ctx.stroke();

}

function handleDrawEvent() {
    resetCanvas();

    // Get user input from text boxes
    let x1 = parseFloat(document.getElementById("x1").value);
    let y1 = parseFloat(document.getElementById("y1").value);

    let x2 = parseFloat(document.getElementById("x2").value);
    let y2 = parseFloat(document.getElementById("y2").value);

    // Validate input (ensure it's a number)
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        alert("Please enter valid numbers for x and y.");
        return;
    }

    // Create a Vector3 object for the first vector
    v1 = new Vector3([x1, y1, 0]);

    // Create a Vector3 object for the second vector
    v2 = new Vector3([x2, y2, 0]);

    // Draw the vector in red
    drawVector(v1, "red");

    // Draw the vector in blue  
    drawVector(v2, "blue");
}



function handleDrawOperationEvent() {
    handleDrawEvent();
    drawVector(v1, "red");
    drawVector(v2, "blue");

    let v3, v4;
    if (operationSelect.value === "add") {
        // Perform addition operation
        v3 = v1.add(v2);
    }
    else if (operationSelect.value === "sub") {
        // Perform subtraction operation
        v3 = v1.sub(v2);
 
    }
    else if (operationSelect.value === "mul") {
        // Perform multiplication operation
        let scalar = parseFloat(scalarInput.value);
        v3 = v1.mul(scalar);
        v4 = v2.mul(scalar);
  

    }
    else if (operationSelect.value === "div") {
        // Perform division operation
        let scalar = parseFloat(scalarInput.value);
        v3 = v1.div(scalar);
        v4 = v2.div(scalar);

    }
    else if (operationSelect.value === "dot") {
        // Perform dot product operation
        let result = Vector3.dot(v1, v2);
        // console.log("Dot product:", result);
        let alpha = Math.acos(result / (v1.magnitude() * v2.magnitude()));
        let degrees = alpha * (180 / Math.PI);
        console.log("Angle:", degrees);
    }
    else if (operationSelect.value === "cross") {
        let result = Vector3.cross(v1, v2);
        // console.log("Cross product:", result);
        let area = result.magnitude() / 2;
        console.log("Area of the triangle:", area);

    }
    else if (operationSelect.value === "mag") {
        console.log("Magnitude of v1:", v1.magnitude());
        console.log("Magnitude of v2:", v2.magnitude());
    }
    else if (operationSelect.value === "nor") {
        v3 = v1.normalize();
        v4 = v2.normalize();
    }

    if (operationSelect.value === "add" || operationSelect.value === "sub") {
        // Draw the result vector in green
        drawVector(v3, "green");
    }
    else if (operationSelect.value === "mul" || operationSelect.value === "div" || operationSelect.value === "nor") {
        // Draw the result vector in green
        drawVector(v3, "green");
        drawVector(v4, "green");

    }




}

function main() {
    // Retrieve <canvas> element                                  <- (1)
    operationSelect = document.getElementById("operation");
    scalarInput = document.getElementById("scalar");
    function toggleScalarInput() {
        let selectedOperation = operationSelect.value;
        if (selectedOperation === "mul" || selectedOperation === "div") {
            scalarInput.disabled = false;
        } else {
            scalarInput.value = null;
            scalarInput.disabled = true;
        }
    }
    let v10 = new Vector3([1, 2, 3]);
    console.log("v10 normalized:", v10.normalize().elements);
    let v4 = new Vector3([2, 4, 8]);
    let v5 = new Vector3([6, 4, 2]);
    let v9 = new Vector3([-87, 22, 66.45623]);
    // let v6 = new Vector3([2, 4, 6]);
    // v5.sub(v4);  // v1 is now [5, 7, 9]
    // v6.div(2); 
    // console.log("v6 div:", v6.elements, "end"); // Output: Float32Array [1, 2, 3]
    // v6.mul(3);
    // console.log("v6 mul:", v6.elements, "end"); // Output: Float32Array [3, 6, 9]
    // console.log("v4 sub:", v4.elements, "end"); // Output: Float32Array [5, 7, 9]
    let v7 = v9.normalize().elements
    console.log("v9 normalized:", v7); // Output: 32
    console.log("actual: [-0.779104913, 0.197015035, 0.595130751]");
    
    blackCanvas();


    // Create a new Vector3 instance
    let v1 = new Vector3([2.25, 2.25, 0]); 
    let v2 = new Vector3([1.25, 1.25, 0]);

    // Set the color to red
    drawVector(v1, "red", ctx);

    document.getElementById("drawButton").addEventListener("click", handleDrawEvent);
    document.getElementById("operationDrawButton").addEventListener("click", handleDrawOperationEvent);
    operationSelect.addEventListener("change", toggleScalarInput);

    toggleScalarInput();


}

