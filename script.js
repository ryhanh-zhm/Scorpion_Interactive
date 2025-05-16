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
