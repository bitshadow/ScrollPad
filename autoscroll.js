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

function scrollpad(canvas, pos) {
    var body = $('html,body');
    var context = canvas.getContext('2d');

    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }

    var message = ' window :'+ body.width() +' , '+ body.height(); message = message + ' inner window: '+ size.width + ' , ' + size.height;
    var rectwidth = 40
    var rectheight = 40
    var bodywidth = window.getComputedStyle(document.body,null).getPropertyValue("width");
    var bodyheight = window.getComputedStyle(document.body,null).getPropertyValue("height");
    message = message + "body params : " + bodywidth + " , " + bodyheight;
    var canvaswidth = ParseInt(bodywidth/size.width) * rectwidth;
    var canvasheight = (bodyheight/size.height)* rectheight;
    message = message + " canvas: " + canvaswidth + " , " + canvasheight;
    console.log (message);

    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.beginPath();
    //context.lineWidth="1";
    //context.strokeStyle="white";
    context.fillStyle = "white";
    //context.fillRect(pos.x-20,pos.y-20,40,40);
    roundRect(context, pos.x-20, pos.y-20, 40, 40, 5, true, false)
    //context.stroke();

    body.animate({ scrollTop: (pos.y*($(window).height()/100))  }, 0);
    body.animate({ scrollLeft: (pos.x*($(window).width()/50)) }, 0);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

$(document).ready(function() {
    var canvas = document.getElementById('scrollpad');
    canvas.addEventListener('mousemove', function(evt) {
        var pos = getMousePos(canvas, evt);
        scrollpad(canvas, pos);
        //var message = 'Mouse position: ' + pos.x + ',' + pos.y;
    }, false);

    canvas.addEventListener('click', function(evt) {
        var pos = getMousePos(canvas, evt);
        //TODO Use scrollTo instead 
        //$.scrollTo({top:'0px', left:'100%'}, 800)
        //body.animate({ scrollTop: (pos.y*50)  }, "slow");
        //body.animate({ scrollLeft: (pos.x*50) }, "slow");
    }, false);

});



