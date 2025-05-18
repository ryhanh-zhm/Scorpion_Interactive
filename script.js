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

  updateRelative(iter, flex) {
    this.relAngle =
      this.relAngle -
      2 *
        Math.PI *
        Math.floor((this.relAngle - this.defAngle) / 2 / Math.PI + 1 / 2);
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
      for (var i = 0; i < this.children.length; i++) {
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

  follow(iter) {
    var x = this.parent.x;
    var y = this.parent.y;
    var dist = ((this.x - x) ** 2 + (this.y - y) ** 2) ** 0.5;
    this.x = x + (this.size * (this.x - x)) / dist;
    this.y = y + (this.size * (this.y - y)) / dist;
    this.absAngle = Math.atan2(this.y - y, this.x - x);
    this.relAngle = this.absAngle - this.parent.absAngle;
    this.updateRelative(false, true);
    if (iter) {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].follow(true);
      }
    }
  }
}

// A system of connected segments like a limb(arm, tail, leg)
class LimbSystem {
  constructor(end, length, speed, creature) {
    this.end = end;
    this.length = Math.max(1, length);
    this.creature = creature;
    this.speed = speed;
    creature.systems.push(this);
    this.nodes = [];
    var node = end;
    for (var i = 0; i < length; i++) {
      this.nodes.unshift(node);
      node = node.parent;
      if (!node.isSegment) {
        this.length = i + 1;
        break;
      }
    }
    this.hip = this.nodes[0].parent;
  }
  moveTo(x, y) {
    this.nodes[0].updateRelative(true, true);
    var dist = ((x - this.end.x) ** 2 + (y - this.end.y) ** 2) ** 0.5;
    var len = Math.max(0, dist - this.speed);
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      var node = this.nodes[i];
      var ang = Math.atan2(node.y - y, node.x - x);
      node.x = x + len * Math.cos(ang);
      node.y = y + len * Math.sin(ang);
      x = node.x;
      y = node.y;
      len = node.size;
    }
    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      node.absAngle = Math.atan2(
        node.y - node.parent.y,
        node.x - node.parent.x
      );
      node.relAngle = node.absAngle - node.parent.absAngle;
      for (var ii = 0; ii < node.children.length; ii++) {
        var childNode = node.children[ii];
        if (!this.nodes.includes(childNode)) {
          childNode.updateRelative(true, false);
        }
      }
    }
    // this.nodes[0].updateRelative(true, false)
  }
  update() {
    this.moveTo(Input.mouse.x, Input.mouse.y);
  }
}
