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

// Necessary classes
var segmentCount = 0;
class Segment {
  constructor(parent, size, angle, range, stiffness) {
    segmentCount++;
    this.isSegment = true;
    this.parent = parent; //Segment which this one is connected to
    if (typeof parent.children == "object") {
      parent.children.push(this);
    }

    this.children = []; //Segments connected to this segment
    this.size = size; //Distance from parent
    this.relAngle = angle; //Angle relative to parent
    this.defAngle = angle; //Default angle relative to parent
    this.absAngle = parent.absAngle + angle;
    this.range = range; //Differences between maximum and minimum angles
    this.stiffness = stiffness; //How closely it conforms to default angle
    this.updateRelative(false, true);
  }
}

updateRelative(iter, flex) {
  this.relAngle = this.relAngle - 2 * Math.PI * Math.floor((this.relAngle - this.defAngle) / 2 / Math.PI + 1 / 2);
  if (flex) {
    this.relAngle = Math.min(
      this.defAngle + this.range / 2, 
      Math.max(
        this.defAngle - this.range / 2, 
        (this.relAngle - this.defAngle) / this.stiffness + this.defAngle
      )
    );
  }
  this.absAngle = this.parent.absAngle + this.relAngle;
  this.x = this.parent.x + Math.cos(this.absAngle) * this.size; //position
  this.y = this.parent.y + Math.sin(this.absAngle) * this.size; //position
  if (iter) {
    for (var i = 0; i< this.children.length; i++){
      this.children[i].updateRelative(iter, flex);
    }
  }
}

draw(iter) {
  ctx.beginPath();
  ctx.moveTo(this.parent.x, this.parent.y);
  ctx.lineTo(this.x, this.y);
  ctx.stroke();
  if (iter) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].draw(true);
    }
  }
}