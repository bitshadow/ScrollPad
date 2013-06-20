var SPStartX = 0;            // mouse starting positions
var SPStartY = 0;
var SPOffsetX = 0;           // current element offset
var SPOffsetY = 0;
var SPDragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var SPOldZIndex = 0;         // we temporarily increase the z-index during drag

function OnMouseDown(e)
{

    var target = e.target != null ? e.target : e.srcElement;

    if ((e.button == 1 && window.event != null ||
        e.button == 0) && target.id == 'scrollpad')
    {
        // grab the mouse position
        SPStartX = e.clientX;
        SPStartY = e.clientY;

        // grab the clicked element's position
        SPOffsetX = ExtractNumber(target.style.left);
        SPOffsetY = ExtractNumber(target.style.top);

        // bring the clicked element to the front while it is being dragged
        SPOldZIndex = target.style.zIndex;
        target.style.zIndex = 2147483648;

        // we need to access the element in OnMouseMove
        SPDragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;

        // cancel out any text selections
        document.body.focus();

        document.onselectstart = function () { return false; };
        target.ondragstart = function() { return false; };

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
    SPDragElement.style.left = (SPOffsetX + e.clientX - SPStartX) + 'px';
    SPDragElement.style.top = (SPOffsetY + e.clientY - SPStartY) + 'px';
}

function OnMouseUp(e)
{
    if (SPDragElement != null)
    {
        SPDragElement.style.zIndex = SPOldZIndex;
        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        SPDragElement.ondragstart = null;

        SPDragElement = null;
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

