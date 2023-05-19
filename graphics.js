"use strict";

var canvas;
var gl;

var numVertices = 54;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];
var thetaLoc;

var points = [];
var colors = [];
var vertexColors = [];

var near = -1;
var far = 1;
var radius = .05;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var fovy = 45.0;
var aspect;

var rotating;
var sphereTheta = 0;
var spherePhi = 1;

var sphereX, sphereY, sphereZ, sphereRadius;

var animating;
var lineX1, lineY1, lineZ1, lineX2, lineY2, lineZ2;
var lineDistance = 0;

var SELECTION = 0;
const SPHERE = 0;
const LINE = 1;

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
    vec4(0.0, 1.0, 0.5, 1.0),
    vec4(0.0, 1.0, -0.5, 1.0)
];

// indices of the 18 triangles that comprise the shape
var indices = [
    1, 0, 3,
    3, 2, 1, //face1 0 through 5
    2, 3, 7,
    7, 6, 2, //face2 6 through 11
    3, 0, 4,
    4, 7, 3, //face3 12 to 17
    6, 5, 1,
    1, 2, 6, //face4 18 to 23
    4, 5, 6,
    6, 7, 4, //face5 24 to 29
    5, 4, 0,
    0, 1, 5, //face6 30 to 35
    8, 2, 6,
    6, 9, 8, //face7
    5, 1, 8,
    8, 9, 5, //face8
    8, 1, 2, //face9
    9, 6, 5  //face10
];

function colorHouse() {
    quad(0, 3, 2, 1);
    quad(7, 6, 2, 3);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(8, 2, 6, 9);
    quad(1, 8, 9, 5);
    tri(2, 8, 1);
    tri(9, 6, 5);
}

function quad(a, b, c, d) {
    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        // for solid colored faces use
        colors.push(vertexColors[a]);
    }
}

function tri(a, b, c) {
    var indices = [a, b, c];
    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        // for solid colored faces use
        colors.push(vertexColors[a]);
    }
}

function randomColor() {
    var r = Math.random();
    var g = Math.random();
    var b = Math.random();
    var a = 1;
    return vec4(r, g, b, a);
}

//randomize the colors of the faces of the shape
function initializeRandomColors() {
    for (var i = 0; i < 10; i++) {
        vertexColors.push(randomColor());
    }
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    aspect = canvas.width / canvas.height;

    initializeRandomColors();
    colorHouse();

    //Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //color array atrribute buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //thetaLoc = gl.getUniformLocation(program, "theta");
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    //for displaying/hiding elements depending on selection
    const perspectiveSelect = document.getElementById("perspective");
    const linePerspectiveDiv = document.getElementById("line-perspective");
    const spherePerspectiveDiv = document.getElementById("sphere-perspective");

    perspectiveSelect.addEventListener("change", () => {
        if (perspectiveSelect.value === "line") {
            linePerspectiveDiv.style.display = "block";
            spherePerspectiveDiv.style.display = "none";
        } else {
            spherePerspectiveDiv.style.display = "block";
            linePerspectiveDiv.style.display = "none";
        }
        SELECTION = perspectiveSelect.selectedIndex;
    });

    //get sphere X data from input
    const sphereXinput = document.getElementById("sphere-x");
    sphereX = 0;
    sphereXinput.onchange = function (event) {
        sphereX = parseFloat(event.target.value);
    };

    //get sphere Y data from input
    const sphereYinput = document.getElementById("sphere-y");
    sphereY = 0;
    sphereYinput.onchange = function (event) {
        sphereY = parseFloat(event.target.value);
    };

    //get sphere Z data from input
    const sphereZinput = document.getElementById("sphere-z");
    sphereZ = 0;
    sphereZinput.onchange = function (event) {
        sphereZ = parseFloat(event.target.value);
    };

    //get sphere radius data from input
    const sphereRadiusinput = document.getElementById("sphere-radius");
    sphereRadius = 3;
    sphereRadiusinput.onchange = function (event) {
        sphereRadius = parseFloat(event.target.value);
    };

    //toggle the camera rotation
    const animationToggle = document.getElementById("animation-toggle");
    rotating = animationToggle.checked;
    animationToggle.onchange = function (event) {
        rotating = animationToggle.checked;
    };

    //get line X1 data from input
    const lineX1input = document.getElementById("line-x1");
    lineX1 = parseFloat(lineX1input.value);
    lineX1input.onchange = function (event) {
        lineX1 = parseFloat(lineX1input.value);
    }

    //get line Y1 data from input
    const lineY1input = document.getElementById("line-y1");
    lineY1 = parseFloat(lineY1input.value);
    lineY1input.onchange = function (event) {
        lineY1 = parseFloat(lineY1input.value);
    }

    //get line Z1 data from input
    const lineZ1input = document.getElementById("line-z1");
    lineZ1 = parseFloat(lineZ1input.value);
    lineZ1input.onchange = function (event) {
        lineZ1 = parseFloat(lineZ1input.value);
    }

    //get line X2 data from input
    const lineX2input = document.getElementById("line-x2");
    lineX2 = parseFloat(lineX2input.value);
    lineX2input.onchange = function (event) {
        lineX2 = parseFloat(lineX2input.value);
    }

    //get line Y2 data from input
    const lineY2input = document.getElementById("line-y2");
    lineY2 = parseFloat(lineY2input.value);
    lineY2input.onchange = function (event) {
        lineY2 = parseFloat(lineY2input.value);
    }

    //get line Z2 data from input
    const lineZ2input = document.getElementById("line-z2");
    lineZ2 = parseFloat(lineZ2input.value);
    lineZ2input.onchange = function (event) {
        lineZ2 = parseFloat(lineZ2input.value);
    }

    //toggle the camera moving along the line
    const lineAnimationToggle = document.getElementById("line-animation-toggle");
    animating = lineAnimationToggle.checked;
    lineAnimationToggle.onchange = function (event) {
        animating = lineAnimationToggle.checked;
    };

    render();
}

function render() {
    setTimeout(function () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //set up the projection matrix
        projectionMatrix = ortho(left, right, bottom, ytop, near, far);

        //determine the camera positioning (sphere/line)
        if (SELECTION == SPHERE) {
            if (rotating) sphereTheta += 0.1;
            sphericalPerspective(sphereX, sphereY, sphereZ, sphereRadius, sphereTheta, spherePhi);
        }
        else if (SELECTION == LINE) {
            if(animating) lineDistance += 0.1;
            linearPerspective(lineX1, lineY1, lineZ1, lineX2, lineY2, lineZ2, lineDistance);
        }

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
        requestAnimFrame(render);
    }, 100);
}

//changes the camera position to a position on a sphere. camera looks at sphere origin.
function sphericalPerspective(x, y, z, radius, sphereTheta, spherePhi) {
    var sphereCenter = vec3(x, y, z);
    var spherePosition = vec3(radius * Math.sin(spherePhi) * Math.cos(sphereTheta),
        radius * Math.cos(spherePhi),
        radius * Math.sin(spherePhi) * Math.sin(sphereTheta));
    eye = add(sphereCenter, spherePosition);

    modelViewMatrix = lookAt(eye, sphereCenter, up);
    projectionMatrix = perspective(60, aspect, 0.3, 4.0);
}

function linearPerspective(x1, y1, z1, x2, y2, z2, offset) {
    // calculate the distance between the two endpoints
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dz = z2 - z1;
    var lineLength = Math.sqrt(dx * dx + dy * dy + dz * dz);

    //reset the offset if it goes beyond the line
    offset = offset % lineLength;

    //calculate the direction vector of the line
    var directionX = dx / lineLength;
    var directionY = dy / lineLength;
    var directionZ = dz / lineLength;

    //calculate the position of the camera along the line
    var cameraX = x1 + directionX * offset;
    var cameraY = y1 + directionY * offset;
    var cameraZ = z1 + directionZ * offset;

    modelViewMatrix = lookAt([cameraX, cameraY, cameraZ], [x2, y2, z2], [0, 1, 0]);
}   

