
var scrollPad = {

  curx: 0,

  cury: 0,

  mousemove: false,

  mousedown: false,

  scroll: true,

  roundRect: function(ctx, x, y, width, height, radius, fill, stroke) {

      if (typeof stroke == "undefined" ) {
          stroke = true;
      }

      if (typeof radius === "undefined") {
          radius = 5;
      }

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      if (stroke) {
          ctx.stroke();
      }

      if (fill) {
          ctx.fill();
      }
  },

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

  getViewSize: function(canvas) {

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

  draw: function(canvas, x, y) {
      var context = canvas.getContext('2d');
      var vsize = this.getViewSize(canvas);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "white";
      this.roundRect(context,x-(vsize.width/2), y-(vsize.height/2), vsize.width, vsize.height, 2, true, false);
  },

  //position in canvas
  scrollPage: function(c, pos) {
      var v = this.getViewSize(c);
      var b = this.bodySize();

      var scroll = {
          x: b.width / c.width,
          y: b.height / c.height
      };

      $('html,body').animate({ scrollTop: ((pos.y - (v.height / 2)) * scroll.y) }, 0);
      $('html,body').animate({ scrollLeft: ((pos.x - (v.width  / 2)) * scroll.x) }, 0);
  },

  scrollpad: function(canvas, evt) {
      var pos = this.getMousePos(canvas, evt);
      var vsize = this.getViewSize(canvas);
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

      this.draw(canvas, x, y);
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
        // Will always clear the right space
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }
}

function main() {
    scrollPad.loadCanvas();
    var canvas = document.getElementById('scrollpad');

    canvas.addEventListener('click', function(evt) {
        var pos = scrollPad.getMousePos(canvas, evt);
    }, false);


    canvas.addEventListener("mousedown", function() {
        scrollPad.mousedown = true;
    }, false);

    canvas.addEventListener("mousemove", function(evt) {
        //drag
        if (scrollPad.mousedown) {
            scrollPad.mousemove = true;
            //adjustCanvas(canvas, evt);
            console.log("drag");
            scrollPad.scroll = false;
        }
        if(scrollPad.scroll) {
            scrollPad.scrollpad(canvas, evt);
        }
    }, false);

    canvas.addEventListener("mouseout", function(evt){
        scrollPad.clearCanvas(canvas);
    });

    canvas.addEventListener("mouseup", function(evt) {

        scrollPad.mousedown = false;
        //click
        if(!scrollPad.mousedown && !scrollPad.mousemove) {
            scrollPad.scroll = !scrollPad.scroll;
            if(scrollPad.scroll)
               canvas.style.opacity = 0.4
            else
               canvas.style.opacity = 0.1
            scrollPad.scrollpad(canvas, evt);
        }
        scrollPad.mousemove = false;
    }, false);

    /*$(window).scroll(function (evt) {
     //TODO backword scrolling needs to be added
    });*/
}

function loadscrollPad() {
  var b = scrollPad.bodySize()
  var c = scrollPad.clientSize()
  if (b.width > c.width || b.height > c.height)
      main();
}

loadscrollPad()
