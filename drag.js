var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var _drag = false;

function OnMouseDown(e)
{

    var target = e.target != null ? e.target : e.srcElement;

    if ((e.button == 1 && window.event != null ||
        e.button == 0) && target.id == 'scrollpad')
    {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;

        // grab the clicked element's position
        _offsetX = ExtractNumber(target.style.left);
        _offsetY = ExtractNumber(target.style.top);

        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;

        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };

        // prevent text selection (except IE)
        return false;
    }
}

function OnMouseMove(e)
{
    if (e == null)
        var e = window.event;
    if (s)
        s.setDrag(true);

    // this is the actual "drag code"
    _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
}

function OnMouseUp(e)
{
    if (_dragElement != null)
    {
        _dragElement.style.zIndex = _oldZIndex;
        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging      
        _dragElement = null;
    }
}

function ExtractNumber(value)
{
    var n = parseInt(value);
    return n == null || isNaN(n) ? 0 : n;
}

function InitDragDrop()
{
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
}

