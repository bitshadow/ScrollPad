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


var scrollPad = {

  curx: 0,

  cury: 0,

  mousemove: false,

  mousedown: false,

  scroll: true,

  clientSize: function() {

      var size = {

          width : $(window).width(),
          height : $(window).height()
      }

      console.log("client size: "+ size.width + " , " + size.height);
      return size;
  },

  bodySize: function() {

      var size = {

          width: document.width,
          height: document.height
      }
      console.log("body size: "+ size.width + " , " + size.height);

      return size;
  },

  viewSize: function(canvas) {

      var clsize = this.clientSize();
      var bsize = this.bodySize();
      var w = (clsize.width * canvas.width) / parseInt(bsize.width);
      var h = (clsize.height * canvas.height) / parseInt(bsize.height);

      var size = {

          width: parseInt(w)<2 ? 2: parseInt(w),
          height: parseInt(h) < 2 ? 2: parseInt(h)
      }

      console.log("view size: "+ size.width + " , " + size.height + " canvas size:  "+ canvas.width + " , "+ canvas.height);
      return size;
  },

  drawView: function(canvas, x, y) {
      var context = canvas.getContext('2d');
      var vsize = this.viewSize(canvas);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "white";
      context.roundRect(x-(vsize.width/2), y-(vsize.height/2), vsize.width, vsize.height, 2, true, false);
  },

  //position in canvas
  scrollPage: function(c, pos) {
      var v = this.viewSize(c);
      var b = this.bodySize();

      var scroll = {
          x: b.width / c.width,
          y: b.height / c.height
      };

      $('html,body').animate({ scrollTop: ((pos.y - (v.height / 2)) * scroll.y) }, 0);
      $('html,body').animate({ scrollLeft: ((pos.x - (v.width  / 2)) * scroll.x) }, 0);
  },

  scrollView: function(canvas, evt) {
      var pos = this.getMousePos(canvas, evt);
      var vsize = this.viewSize(canvas);
      var x = pos.x;
      var y = pos.y;

      if ((pos.x - (vsize.width/2)) <= 0 ) {
          x = vsize.width/2;
      }

      if ((pos.x + (vsize.width/2)) >= canvas.width) {
          x = canvas.width - vsize.width/2;
      }

      if ((pos.y - (vsize.height/2)) <= 0 ) {
          y = vsize.height/2;
      }

      if ((pos.y + (vsize.height/2)) >= canvas.height) {
          y = canvas.height - vsize.height/2;
      }

      this.drawView(canvas, x, y);
      this.scrollPage(canvas, pos);
  },

  getMousePos: function(canvas, evt) {

      var rect = canvas.getBoundingClientRect();

      return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
      };
  },

  loadCanvas: function() {
        var canvas = document.createElement('canvas');
        canvas.id     = "scrollpad";
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

    clearCanvas: function(canvas) {
        var context = canvas.getContext('2d');
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    },

    applyStyles: function(canvas) {
      if(this.scroll)
        canvas.style.opacity = 0.4;
      else
        canvas.style.opacity = 0.1;
    },

    loadscrollPad: function() {
        this.loadCanvas();
        var canvas = document.getElementById('scrollpad');

        canvas.addEventListener('click', function(evt) {
            scrollPad.scroll = !scrollPad.scroll;
            scrollPad.applyStyles(canvas);
            scrollPad.scrollView(canvas, evt);
        }, false);

        canvas.addEventListener("mousedown", function() {
            scrollPad.mousedown = true;
        }, false);

        canvas.addEventListener("mousemove", function(evt) {
            if(scrollPad.scroll) {
                scrollPad.scrollView(canvas, evt);
            }
        }, false);

        canvas.addEventListener("mouseout", function(evt){
            scrollPad.clearCanvas(canvas);
        });

        //TODO: add drag event functionalities
        //TODO: add reverse mapping from page to canvas.
    }
}

function main() {
  var b = scrollPad.bodySize();
  var c = scrollPad.clientSize();
  if (b.width > c.width || b.height > c.height) {
      scrollPad.loadscrollPad();
  }
}

main()
