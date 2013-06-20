s = null;

Object.extend = function(dest, src) {
    //alert("Copying properties of " + src + " to " + dest);
    for(property in src)
        dest[property] = src[property];
    return dest;
};


Class = { 
    create:function() {
        return function() {
            this.initialize.apply(this, arguments);
        }
    }
};

Object.getPrototypeOf(document.createElement('canvas').getContext('2d')).roundRect=
function(x, y, width, height, radius, fill, stroke) {

    if (typeof stroke == "undefined" ) {
        stroke = true;
    }

    if (typeof radius === "undefined") {
        radius = 5;
    }

    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();

    if (stroke) {
        this.stroke();
    }

    if (fill) {
        this.fill();
    }
}

var scrollPad = Class.create();
Object.extend(scrollPad.prototype, {

  canvas: null,

  curx: 0,

  cury: 0,

  scrollEnable: true,

  drag: false,

  viewPort: function() {

      var size = {
          width : $(window).width(),
          height : $(window).height()
      }

      return size;
  },

  bodySize: function() {

      var size = {
          width: document.width,
          height: document.height
      }

      return size;
  },

  viewSize: function() {

      var clsize = this.viewPort();
      var bsize = this.bodySize();
      var w = (clsize.width * this.canvas.width) / parseInt(bsize.width);
      var h = (clsize.height * this.canvas.height) / parseInt(bsize.height);

      var size = {

          width: parseInt(w)<2 ? 2: parseInt(w),
          height: parseInt(h) < 2 ? 2: parseInt(h)
      }

      return size;
  },

  drawView: function(x, y) {
      var context = this.canvas.getContext('2d');
      var vsize = this.viewSize();

      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context.fillStyle = "white";
      context.roundRect(x-(vsize.width/2), y-(vsize.height/2), vsize.width, vsize.height, 2, true, false);
  },

  //position in canvas
  scrollPage: function(pos) {
      var v = this.viewSize();
      var b = this.bodySize();

      var scroll = {
          x: b.width / this.canvas.width,
          y: b.height / this.canvas.height
      };

      $('html,body').animate({ scrollTop: ((pos.y - (v.height / 2)) * scroll.y) }, 0);
      $('html,body').animate({ scrollLeft: ((pos.x - (v.width  / 2)) * scroll.x) }, 0);
  },

  scrollView: function(evt) {
      var pos = this.getMousePos(evt);
      var vsize = this.viewSize();
      var x = pos.x;
      var y = pos.y;

      if ((pos.x - (vsize.width/2)) <= 0 ) {
          x = vsize.width/2;
      }

      if ((pos.x + (vsize.width/2)) >= this.canvas.width) {
          x = this.canvas.width - vsize.width/2;
      }

      if ((pos.y - (vsize.height/2)) <= 0 ) {
          y = vsize.height/2;
      }

      if ((pos.y + (vsize.height/2)) >= this.canvas.height) {
          y = this.canvas.height - vsize.height/2;
      }

      this.drawView(x, y);
      this.scrollPage(pos);
  },

  getMousePos: function(evt) {

      var rect = this.canvas.getBoundingClientRect();

      return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
      };
  },

  createCanvas: function() {
        var canvas = document.createElement('canvas');
        canvas.id = "scrollpad";
        canvas.setAttribute('width', 75);
        canvas.setAttribute('height', 75);
        canvas.style.zIndex = 2147483648;
        canvas.style.position = 'fixed';
        canvas.style.background = 'black';
        canvas.style.borderRadius = '5px';
        canvas.style.overflow = 'hidden';
        canvas.style.opacity = 0.4;
        canvas.style.top = '100px';
        canvas.style.right = '20px';
        canvas.style.margin = '0px 0px 0px 0px';
        //canvas.style.border= 'rgba(82, 168, 236, 0.8) 4px';
        canvas.style.WebkitBoxShadow = '0 0 8px 4px rgba(82, 168, 236, 0.6)'

        document.body.insertBefore(canvas, document.body.firstChild);
        canvas.style.top = 10;
    },

    clearCanvas: function() {
        var context = this.canvas.getContext('2d');
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.restore();
    },

    applyStyles: function() {
      if(this.scrollEnable)
        this.canvas.style.opacity = 0.4;
      else {
        this.canvas.style.opacity = 0.1;
      }
    },

    loadScrollPad: function() {
        var self = this;
        self.createCanvas();
        self.canvas = document.getElementById('scrollpad');

        self.canvas.addEventListener('mouseup', function(evt) {
            //setDrag called from drag.js
            if(!self.drag) {
                self.scrollEnable = !self.scrollEnable;
                self.applyStyles();
                self.scrollView(evt);
            }
            self.drag = false;
        }, false);

        self.canvas.addEventListener("mousemove", function(evt) {
            if(self.scrollEnable && !self.drag) {
                self.scrollView(evt);
            }
        }, false);

        self.canvas.addEventListener("mouseout", function(evt){
            self.clearCanvas();
        });

        //TODO: add reverse mapping from page to canvas.
        //TODO: fix rendering while drag
    },

    setDrag: function(drag) {
        this.drag = true;
    },

    initialize: function() {
        var b = this.bodySize();
        var c = this.viewPort();
        if (b.width > c.width || b.height > c.height) {
            this.loadScrollPad();
        }

    }
});

window.onload = function() {
    s = new scrollPad();
    InitDragDrop();
}
