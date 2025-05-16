var Input = {
  keys: [],
  mouse: {
    left: false,
    right: false,
    middle: false,
    x: 0,
    y: 0,
  },
};

for (var i = 0; i < 230; i++) {
  Input.keys.push(false);
}

document.addEventListener("keydown", function (event) {
  Input.keys[event.keyCode] = true;
});

document.addEventListener("keyup", function (event) {
  Input.keys[event.keyCode] = false;
});

document.addEventListener("mousedown", function (event) {
  if (event.button === 0) {
    Input.mouse.left = true;
  }
  if (event.button === 1) {
    Input.mouse.middle = true;
  }
  if (event.button === 2) {
    Input.mouse.right = true;
  }
});

document.addEventListener("mouseup", function (event) {
  Input.mouse.x = event.clientX;
  Input.mouse.y = event.clientY;
});

// Canvas setup
var Canvas = document.createElement("canvas");
document.body.appendChild(Canvas);
Canvas.width = Math.max(window.innerWidth, window.innerWidth);
Canvas.height = window.innerHeight;
// Makes the canvas take up the full screen and disables scrolling
Canvas.style.position = "absolute";
Canvas.style.left = "0px";
Canvas.style.top = "0px";
document.body.style.overflow = "hidden";
// Gets 2D drawing context for rendering shapes and lines
var ctx = Canvas.getContext("2d");
