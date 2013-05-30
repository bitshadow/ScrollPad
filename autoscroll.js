
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

          width: window.innerWidth || document.body.clientWidth,
          height: window.innerHeight || document.body.clientHeight
      }

      return size;
  },

  bodySize: function() {

      var w = window.getComputedStyle(document.body,null).getPropertyValue("width");
      var h = window.getComputedStyle(document.body,null).getPropertyValue("height")

      var size = {

          width: parseInt(w),
          height: parseInt(h)
      }

      return size;
  },

  getViewSize: function() {

      var clsize = this.clientSize();
      var bsize = this.bodySize();
      var w = (clsize.width * 75) / parseInt(bsize.width);
      var h = (clsize.height * 75) / parseInt(bsize.height);

      var size = {

          width: parseInt(w),
          height: parseInt(h)
      }

      return size;
  },

  draw: function(canvas, x, y) {
      var context = canvas.getContext('2d');
      var vsize = this.getViewSize();

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "white";
      this.roundRect(context,x-(vsize.width/2), y-(vsize.height/2), vsize.width, vsize.height, 2, true, false);
  },

  //position in canvas
  scrollPage: function(c, pos) {
      var message="";
      var v = this.getViewSize();
      var b = this.bodySize();

      var scroll = {
          x: b.width / (c.width-v.width),
          y: b.height / (c.height-v.height)
      };

      $('html,body').animate({ scrollTop: ((pos.y - (v.height / 2)) * scroll.y) }, 0);
      $('html,body').animate({ scrollLeft: ((pos.x - (v.width  / 2)) * scroll.x) }, 0);
  },

  scrollpad: function(canvas, evt) {
      var pos = this.getMousePos(canvas, evt);
      var vsize = this.getViewSize();
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
  }
}

$(document).ready(function() {
    var canvas = document.getElementById('scrollpad');

    canvas.addEventListener('click', function(evt) {
        var pos = scrollPad.getMousePos(canvas, evt);
    }, false);


    canvas.addEventListener("mousedown", function() {
        scrollPad.mousedown = true;
    }, false);

    canvas.addEventListener("mousemove", function(evt) {

        if (scrollPad.mousedown) {
            scrollPad.mousemove = true;
            //adjustCanvas();
            console.log("drag");
        }

        if(scrollPad.scroll) {
            scrollPad.scrollpad(canvas, evt);
        }
    }, false);

    canvas.addEventListener("mouseup", function(evt) {

        scrollPad.mousedown = false;
        if(!scrollPad.mousedown && !scrollPad.mousemove) {
            scrollPad.scroll = !scrollPad.scroll;
            scrollPad.scrollpad(canvas, evt);
        }
    }, false);

});
