/*
Author:       Mike Adair mike.adair@ccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tools to handle mouse events on the mappane object 
 *
 * @constructor
 * @param context The Web Map Context to use when building this MapPane.
 * @param name Variable name referencing this MapPane object
 * @param node Node from the HTML DOM to insert legend HTML into.
 * @requires Context
 * @requires Sarissa
 * @requires Util
 */

var zoomby = 4;
var MODE_ZOOM_IN = 1;
var MODE_ZOOM_OUT = 2;
var MODE_PAN = 3;
var MODE_SET_ROI = 4;
var MODE_ALT_CLICK = 5;
var MODE_GETFEATUREINFO = 6;

function GlassDiv(mappane, mode) {
  this.view = mappane;


  this.glassDiv = document.getElementById("glass");    //or create this dynamically?
/*
  this.glassDiv = document.createElement("DIV");
  this.view.node.firstChild.firstChild.appendChild( this.glassDiv );
  var imgsrc = mappane.context.baseDir + "/widget/mappane/dot.gif";
  this.glassDiv.innerHTML = "<IMG SRC='" + imgsrc + "' WIDTH='1' HEIGHT='1'/>";
  this.glassDiv.style.position = "absolute";
  this.glassDiv.style.zIndex = 1000;
  this.glassDiv.style.width = this.glassDiv.context.getWindowWidth();
  this.glassDiv.style.height = this.glassDiv.context.getWindowHeight();
  this.glassDiv.style.offsetLeft = 0;
  this.glassDiv.style.offsetTop = 0;
*/
  this.glassDiv.context = mappane.context;

  this.glassDiv.featureInfo = new FeatureInfo(mappane.context);

  this.glassDiv.mode = 0;     //no mouse handling by default
  if (mode) {
    this.glassDiv.mode = mode;
    this.glassDiv.mouseBox = new MouseBox( this.glassDiv );
    this.glassDiv.onmousemove = mouseMoveHandler;
    this.glassDiv.onmouseout = mouseOutHandler;
    this.glassDiv.onmousedown = mouseDownHandler;
    this.glassDiv.onmouseup = mouseUpHandler;
    this.glassDiv.getEvent = getEvent;
  }

  this.setMode = function( mode ) {
    this.glassDiv.mode = mode;
  }

  this.setCursorTrackForm = function(form) {   //pass in a form to display coordinates in
    this.glassDiv.coordForm = form;					
    this.glassDiv.onmouseover = mouseOverHandler;
  }

  this.setClickCallBack = function( callBackFunction ) {
    this.callBack = callBackFunction;
    this.glassDiv.onmouseup = mouseUpHandler;
    this.glassDiv.getEvent = getEvent;
  }

  /**
   * Called when the context's boundingBox attribute changes.
   * @param e The event sent to the listener.
   */
  this.boundingBoxChangeListener=function(target){
    target.view.node.firstChild.firstChild.appendChild( target.glassDiv );
  }

  mappane.context.addBoundingBoxChangeListener(this.boundingBoxChangeListener,this);

}



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
    case 5://MODE_ALT_CLICK:	
	  //zoom by ALT/CTRL click
    case 6:
      this.featureInfo.get(this.evpl);
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
      if (this.mouseBox.started) this.mouseBox.setBox(this.evpl);
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
    var evll = glass.context.extent.proj.Inverse( glass.evxy );
    glass.coordForm.longitude.value = Math.round(evll[0]*100)/100;
    glass.coordForm.latitude.value = Math.round(evll[1]*100)/100;
}





var mouseBoxColor = "#FF0000";	// color of zoombox
var ovBoxSize = 2;            // Zoombox line width;
var x1=0;
var y1=0;
var x2=0;
var y2=0;
var zleft=0;
var zright=0;
var ztop=0;
var zbottom=0;


function MouseBox( glass ) {
  this.Top = GetImageDiv( glass );
  this.Bottom = GetImageDiv( glass );
  this.Left = GetImageDiv( glass );
  this.Right = GetImageDiv( glass );

  this.setVis = function(vis) {
    var visibility = "hidden";
		if (vis) visibility = "visible";
    this.Top.style.visibility = visibility;
    this.Left.style.visibility = visibility;
    this.Right.style.visibility = visibility;
    this.Bottom.style.visibility = visibility;
  }

  this.boxIt = function(theLeft,theTop,theRight,theBottom) {
    //Offset = BaseLayer.layer.GetPageOffset();  
    Offset = new Array(0,0);
    this.Top.style.left = theLeft+Offset[0]
    this.Top.style.top = theTop+Offset[1];
    this.Top.style.width = theRight-theLeft
    this.Top.style.height = ovBoxSize;

    this.Left.style.left = theLeft+Offset[0];
    this.Left.style.top = theTop+Offset[1];
    this.Left.style.width = ovBoxSize;
    this.Left.style.height = theBottom-theTop;

    this.Right.style.left = theRight-ovBoxSize+Offset[0]
    this.Right.style.top = theTop+Offset[1];
    this.Right.style.width = ovBoxSize;
    this.Right.style.height = theBottom-theTop;

    this.Bottom.style.left = theLeft+Offset[0];
    this.Bottom.style.top = theBottom-ovBoxSize+Offset[1];
    this.Bottom.style.width = theRight-theLeft;
    this.Bottom.style.height = ovBoxSize;

    this.setVis(true);
  }
		
  // start zoom in.... box displayed
  this.start = function(evpl) {
    if (this.started) {
      this.stop(true);
    } else {
      x1=evpl[0];  
      y1=evpl[1];  
      x2=x1+ovBoxSize;
      y2=y1+ovBoxSize;
      zleft=x1;
      ztop=y1;
      zbottom=y1;
      zright=x1
      this.boxIt(x1,y1,x2,y2);
      this.started=true;
    }
    return false;
  }

  // stop zoom box display... 
  this.stop = function(vis) {
    this.started=false;
    this.setVis(vis);
    //alert(GetLatLonROI());
  }

  // adjust mouse box layers to mouse coords
  this.setBox = function( evpl ) {	
    var tempX=x1;
    var tempY=y1;
    x2=evpl[0]; 
    y2=evpl[1]; 
    if (x1>x2) {
      zright=x1;
      zleft=x2;
    } else {
      zleft=x1;
      zright=x2;
    }
    if (y1>y2) {
      zbottom=y1;
      ztop=y2;
    } else {
      ztop=y1;
      zbottom=y2;
    }

    if ((x1 != x2) && (y1 != y2)) {
      this.boxIt(zleft,ztop,zright,zbottom);
    }
  }

  this.getBox = function() {
    var ulpl = new Array(zleft, ztop);
    var lrpl = new Array(zright, zbottom);
    return new Array(ulpl, lrpl);
  }


  //test case
  this.boxIt(50,50,200,200);

}

function GetImageDiv( glass ) {
  var newDiv = document.createElement("DIV");
  newDiv.innerHTML = "<IMG SRC='' WIDTH='1' HEIGHT='1'/>";
  newDiv.style.position = "absolute";
  newDiv.style.backgroundColor = mouseBoxColor;
//  newDiv.style.zIndex = glass.style.zIndex;
  newDiv.style.zIndex = 300;
  newDiv.style.visibility = "hidden";
  newDiv.onmouseup = mouseUpHandler;
  glass.appendChild( newDiv );
  return newDiv;
}



//not tested past here

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
  boxIt(ulpl[0], ulpl[1], lrpl[0], lrpl[1]);
  setFormROI(ul, lr);
}

function GetLatLonROI() {
  var corners = GetROI();
  var ulll = BaseLayer.extent.Inverse(corners[0]);
  var lrll = BaseLayer.extent.Inverse(corners[1]);
  return new Array(ulll, lrll);
}

