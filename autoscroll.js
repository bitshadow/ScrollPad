/**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
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
}

$(document).ready(function() {
    var canvas = document.getElementById('autoscroll');
    var context = canvas.getContext('2d');
    var body = $('html,body');

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvas.addEventListener('mousemove', function(evt) {
        var pos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + pos.x + ',' + pos.y;

        context.clearRect(0, 0, canvas.width, canvas.height);
        //context.beginPath();
        //context.lineWidth="1";
        //context.strokeStyle="white";
        context.fillStyle = "white";
        //context.fillRect(pos.x-20,pos.y-20,40,40);
        roundRect(context, pos.x-20, pos.y-20, 40, 40, 5, true, false)
        //context.stroke();
        console.log (message);

        body.animate({ scrollTop: (pos.y*($(window).height()/100))  }, 0);
        body.animate({ scrollLeft: (pos.x*($(window).width()/50)) }, 0);
    }, false);

    canvas.addEventListener('click', function(evt) {
        var pos = getMousePos(canvas, evt);
        //TODO Use scrollTo instead 
        //$.scrollTo({top:'0px', left:'100%'}, 800)
        //body.animate({ scrollTop: (pos.y*50)  }, "slow");
        //body.animate({ scrollLeft: (pos.x*50) }, "slow");
    }, false);

});



