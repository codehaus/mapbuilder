/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tool to handle mouse events on the mappane object.  This is the equivalent 
 * to laying a transparent sheet of glass over the mappane and all onmouse*
 * events are handled by this object.  The mouse handler is set to one of several
 * modes for zoom-in, zoom-out, etc.
 *
 * @constructor
 *
 * @requires AoiBox
 *
 * @param view    the view object for which this object handles mouse events.
 *                the view must have a context object property
 *                the view must have a "node" property which represents the HTML
 *                element on which the GlassPane will be overlaid. 
 * @param mode    (optional) the initial mode to start the GlassPane in; to enable 
 *                the mouse box behaviour, it must be started with a non-null mode
 */

//modes supported by this controller
var MODE_ZOOM_IN = 1;     //single click or drag a box to zoom in to that area
var MODE_ZOOM_OUT = 2;    //single click to zoom out centered at that point
var MODE_PAN = 3;         //click and drag to pan the image
var MODE_SET_ROI = 4;     //click and drag to set a bbox without any change to the image
var MODE_ALT_CLICK = 5;   //alt-click zooms in; ctl-click zooms out
var MODE_GETFEATUREINFO = 6;  //single click to send a query to that point

var zoomby = 4;   //default fraction to zoom in/out on a click

function GlassPane(view, mode) {
  this.view = view;

// fixed ID created by mappane stylesheet
// TDB create this dynamically
  this.glassPane = document.getElementById("glass");    //or create this dynamically?
/*
TBD: find out why this isn't working
  this.glassPane = document.createElement("DIV");
  this.view.node.firstChild.firstChild.appendChild( this.glassPane );
  var imgsrc = view.context.baseDir + "/widget/mappane/dot.gif";
  this.glassPane.innerHTML = "<IMG SRC='" + imgsrc + "' WIDTH='1' HEIGHT='1'/>";
  this.glassPane.style.position = "absolute";
  this.glassPane.style.zIndex = 1000;
  this.glassPane.style.width = this.glassPane.context.getWindowWidth();
  this.glassPane.style.height = this.glassPane.context.getWindowHeight();
  this.glassPane.style.offsetLeft = 0;
  this.glassPane.style.offsetTop = 0;
*/
  this.glassPane.context = view.context;
  this.glassPane.featureInfo = new FeatureInfo(view.context);

  // non-null initial mode initializes the MouseBox
  this.glassPane.mode = 0;     //no mouse handling by default
  if (mode) {
    this.glassPane.mode = mode;
    this.glassPane.mouseBox = new RoiBox( this.glassPane );
    this.glassPane.onmousemove = mouseMoveHandler;
    this.glassPane.onmouseout = mouseOutHandler;
    this.glassPane.onmousedown = mouseDownHandler;
    this.glassPane.onmouseup = mouseUpHandler;
    this.glassPane.getEvent = getEvent;
  }

/** Set the mode of the GlassPane
  * @param mode   the mode to be set; defined by global constants above
  * @return       none
  */
  this.setMode = function( mode ) {
    this.glassPane.mode = mode;
  }

/** Enable and set the form for cursor tracking output.  If this is called 
  * then the Proj utility is used.
  * @requires proj
  * @param form   the form for coordinate output; it must have text input
  *               elements named latitude and longitude
  * @return       none
  */
  this.setCursorTrackForm = function(form) {   //pass in a form to display coordinates in
    this.glassPane.proj = new proj( this.glassPane.context.getSRS() );
    this.glassPane.coordForm = form;					
    this.glassPane.onmouseover = mouseOverHandler;
  }

/** Set a function to be called on the mouseup event.  It will be called with
  * this.glassPane as an argument.
  * @param callBackFunction    the funciton to be called on mouseup
  * @return       none
  */
  this.setClickCallBack = function( callBackFunction ) {
    this.callBack = callBackFunction;
    this.glassPane.onmouseup = mouseUpHandler;
    this.glassPane.getEvent = getEvent;
  }

/**
 * Listener function called when the context's boundingBox attribute changes.  
 * This function executes as a context ie. this = context
 * @param target  second argument in the addListener function
   */
  this.boundingBoxChangeListener=function(target){
    target.view.node.firstChild.firstChild.appendChild( target.glassPane );
  }

  view.context.addBoundingBoxChangeListener(this.boundingBoxChangeListener,this);
}



/** The remaining functions in the file execute as event handlers in the context 
  * of the glassPane, ie. this = the glassPane div

/** General purpose function for cross-browser event handling.  This function
  * sets properties on this.glassPan: 
  *   evpl pixel/line of the event relative to the upper left corner of the DIV
  *   evxy projection x and y of the event calculated via the context.extent
  *   keypress state for ALT CTL and SHIFT keys
  * @param ev    the mouse event oject passed in from the browser (may be null for IE)
  * @return       none
  */
function getEvent(ev) {
  if (window.event) {
    //TBD: Correct this for IE
    //this.evpl = new Array();
    this.altKey = window.event.altKey;
    this.ctrlKey = window.event.ctrlKey;
    this.shiftKey = window.event.shiftKey;
  } else {
    //mozilla
    this.evpl = new Array(ev.layerX, ev.layerY);
    this.altKey = ev.altKey;
    this.ctrlKey = ev.ctrlKey;
    this.shiftKey = ev.shiftKey;
  }
  this.evxy = this.context.extent.GetXY( this.evpl );
}

function mouseUpHandler(ev) {
  this.getEvent(ev);
  switch(this.mode) {
    case 1://MODE_ZOOM_IN:				//zoom in
      if (this.mouseBox.started) {
        this.mouseBox.stop(false);
        var bbox = this.mouseBox.getBox();
        var ul = this.context.extent.GetXY( bbox[0] );
        var lr = this.context.extent.GetXY( bbox[1] );
        this.context.extent.ZoomToBox( ul, lr );
      }
      //this.updateRoiFromCoords();
      break;
    case 2://MODE_ZOOM_OUT:				//zoom out
      this.context.extent.CenterAt(this.evxy, this.context.extent.res[0]*zoomby);
      //this.updateRoiFromCoords();
      break;
    case 3://MODE_PAN:            //pan
      this.stopPan(this.evpl);
      break;
    case 4://MODE_SET_ROI:				//setting ROI
      if (this.mouseBox.started) this.mouseBox.stop(true);
      var ROIBox = this.GetROI();
      this.setFormROI(ROIBox[0], ROIBox[1]);
      break;
    case 5://MODE_ALT_CLICK:		  //zoom by ALT/CTRL click
      if (this.altKey) {
        this.context.extent.CenterAt(this.evxy, this.context.extent.res[0]/zoomby);
      } else if (this.ctrlKey) {
        this.context.extent.CenterAt(this.evxy, this.context.extent.res[0]*zoomby);
      }
      break;
    case 6://MODE_GETFEATUREINFO
      this.featureInfo.get(this.evpl);
      break;	
    default:
      //alert("invalid mode:" +this.mode);
      break;
  }

  if (this.callBack) this.callBack( this );

  if (window.event) {
    window.event.returnValue=false;
    window.event.cancelBubble = true;
  }
  return false;
}

function mouseDownHandler(ev) {
  this.getEvent(ev);
  switch(this.mode) {
    case 1://MODE_ZOOM_IN:				//zoom in
    case 4://MODE_SET_ROI:				//setting ROI
      this.mouseBox.start(this.evpl);
      break;
    case 3://MODE_PAN:            //pan
      this.startPan(this.evpl);
      break;
    case 2://MODE_ZOOM_OUT:				//zoom out
      //no-op, action happens on mouse up
      break;
    default:
      //alert("invalid mode:" +this.mode);
      break;
  }
  if (window.event) window.event.returnValue=false;
  return false;
}

function mouseMoveHandler(ev) {
  this.getEvent(ev);

  //set globals for cursor tracking
  this.mouseMoved = true;

  switch(this.mode) {
    case 1://MODE_ZOOM_IN:				//zoom in
    case 4://MODE_SET_ROI:				//setting ROI
      if (this.mouseBox.started) this.mouseBox.dragBox(this.evpl);
      break;
    case 3://MODE_PAN:            //pan
      this.panImage(this.evpl);
      break;
    case 5://MODE_ALT_CLICK:		  //zoom by ALT/CTRL click
    case 2://MODE_ZOOM_OUT:				//zoom out
      //no-op, action happens on mouse up
      break;
    default:
      //alert("invalid mode:" +this.mode);
      break;
  }
  if (window.event) window.event.returnValue=false;
  return false;
}

function mouseOutHandler(ev) {
  if (this.mouseTrackTimer) clearInterval(this.mouseTrackTimer);
}

function mouseOverHandler(ev) {
  this.mouseTrackTimer = setInterval( ReportCoords, 100, this);
}

function ReportCoords(glass) {
    if (!glass.mouseMoved) return;
    glass.mouseMoved=false;
    var evll = glass.proj.Inverse( glass.evxy );
    glass.coordForm.longitude.value = Math.round(evll[0]*100)/100;
    glass.coordForm.latitude.value = Math.round(evll[1]*100)/100;
}



// **** not tested past here *****

function startPan(evp,evl) {
  if (panning) {
    stopPan(evpl);
  } else {
    x2=evp;  
    y2=evl;  
    elStart = BaseLayer.layer.GetPageOffset();
    x1=elStart[0];
		y1=elStart[1];
    panning=true;
  }
  return false;
}

function stopPan(evpl) {
  panning=false;
}

function panImage(evp,evl) {
  var pl = new Array(x1+evp-x2,y1+evl-y2);
  BaseLayer.GeoImageMoveTo(pl);
}


function SetROI(ul, lr) {     //pass coords in lat/lon
  ulxy = BaseLayer.extent.Forward(ul);
  lrxy = BaseLayer.extent.Forward(lr);
  ulpl = BaseLayer.GeoImagePLCoords(ulxy);
  lrpl = BaseLayer.GeoImagePLCoords(lrxy);
  drawBox(ulpl[0], ulpl[1], lrpl[0], lrpl[1]);
  setFormROI(ul, lr);
}

function GetLatLonROI() {
  var corners = GetROI();
  var ulll = BaseLayer.extent.Inverse(corners[0]);
  var lrll = BaseLayer.extent.Inverse(corners[1]);
  return new Array(ulll, lrll);
}
