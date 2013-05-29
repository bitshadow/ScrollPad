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

function clientSize() {

    var size = {

        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }

    return size;
}

function bodySize() {

    var w = window.getComputedStyle(document.body,null).getPropertyValue("width");
    var h = window.getComputedStyle(document.body,null).getPropertyValue("height")

    var size = {

        width: parseInt(w),
        height: parseInt(h)
    }

    return size;
}

function getViewSize() {

  var clsize = clientSize();
  var bsize = bodySize();
  var w = (clsize.width * 100) / parseInt(bsize.width);
  var h = (clsize.height * 100) / parseInt(bsize.height);
  var size = {

    width: parseInt(w),
    height: parseInt(h)

  }

  return size;
}

function draw(canvas, x, y) {
    var context = canvas.getContext('2d');
    var vsize = getViewSize();

    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.beginPath();
    //context.lineWidth="1";
    //context.strokeStyle="white"
    context.fillStyle = "white"
    //context.fillRect(x-(vsize.width/2), x-(vsize.height/2),
    //                 vsize.width, vsize.height, 2, true, false);
    roundRect(context,x-(vsize.width/2), y-(vsize.height/2),
              vsize.width, vsize.height, 2, true, false);
    //context.stroke();
}

//position in canvas
function scrollPage(c, pos) {
    var message="";
    var v = getViewSize();
    var b = bodySize();

    var scroll = {
        x: b.width / (c.width-v.width),
        y: b.height / (c.height-v.height)
    };

    $('html,body').animate({ scrollTop: ((pos.y - (v.height / 2)) * scroll.y) }, 0);
    $('html,body').animate({ scrollLeft: ((pos.x - (v.width  / 2)) * scroll.x) }, 0);
}

function scrollpad(canvas, pos) {
    var vsize = getViewSize();
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

    draw(canvas, x, y);
    scrollPage(canvas, pos);
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



