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


function GlassPane(toolNode, parentWidget) {

  this.mode = 'MODE_SET_AOI';   //TBD: get this from config.xml widgetNode
  this.zoomBy = 4;   //default fraction to zoom in/out on a click
  this.node = document.getElementById( parentWidget.containerId );
  this.node.context = parentWidget.model;

  this.node.mouseUpListeners = new Array();
  this.node.mouseDownListeners = new Array();
  this.node.mouseMoveListeners = new Array();
  this.node.mouseOverListeners = new Array();
  this.node.mouseOutListeners = new Array();
  this.node.mouseUpObjects = new Array();
  this.node.mouseDownObjects = new Array();
  this.node.mouseMoveObjects = new Array();
  this.node.mouseOverObjects = new Array();
  this.node.mouseOutObjects = new Array();

  this.node.onmousemove = mouseMoveHandler;
  this.node.onmouseout = mouseOutHandler;
  this.node.onmousedown = mouseDownHandler;
  this.node.onmouseup = mouseUpHandler;
  this.node.getEvent = getEvent;


/** Set the mode of the GlassPane
  * @param mode   the mode to be set; defined by global constants above
  * @return       none
  */
  this.setMode = function( mode ) {
    if ( mode == 'MODE_RESET' ) {
      this.model.reset();
    } else {
      this.mode = mode;
      this.node.mode = mode;
    }
  }
  this.setMode( this.mode );


  this.acceptToolTips = true;   //set to false to prevent button bar from changing the tooltip
  this.setToolTip = function( tip ) {
    //this.node.image??.title = tip;
  }

  this.addMouseListener = function(mouseEvent, listener, objRef) {
    switch(mouseEvent) {
      case 'mouseUp':
        this.node.mouseUpListeners.push( listener );
        this.node.mouseUpObjects.push( objRef );
        break;
      case 'mouseDown':				//zoom out
        this.node.mouseDownListeners.push( listener );
        this.node.mouseDownObjects.push( objRef );
        break;
      case 'mouseMove':            //pan
        this.node.mouseMoveListeners.push( listener );
        this.node.mouseMoveObjects.push( objRef );
        break;
      case 'mouseOver':				//setting AOI
        this.node.mouseOverListeners.push( listener );
        this.node.mouseOverObjects.push( objRef );
        break;
      case 'mouseOut':
        this.node.mouseOutListeners.push( listener );
        this.node.mouseOutObjects.push( objRef );
        break;	
      default:
        alert("unreconized mouse event:" + mouseEvent);
        break;
    }
  }
}



/** The remaining functions in the file execute as event handlers in the context 
  * of the GlassPane node, ie. this = the glass div loaded by MapPane stylesheet

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
    //IE events
    this.evpl = new Array(window.event.offsetX, window.event.offsetY);
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
  //alert(this.evpl[0] + ":" + this.evpl[1]);
  this.evxy = this.context.extent.GetXY( this.evpl );
}


function mouseDownHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.mouseDownListeners.length; i++) {
    this.mouseDownListeners[i]( this, this.mouseDownObjects[i] );
  }
}

function mouseUpHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.mouseUpListeners.length; i++) {
    this.mouseUpListeners[i]( this, this.mouseUpObjects[i] );
  }
}

function mouseMoveHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.mouseMoveListeners.length; i++) {
    this.mouseMoveListeners[i]( this, this.mouseMoveObjects[i] );
  }
}

function mouseOverHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.mouseOverListeners.length; i++) {
    this.mouseOverListeners[i]( this, this.mouseOverObjects[i] );
  }
}

function mouseOutHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.mouseOutListeners.length; i++) {
    this.mouseOutListeners[i]( this, this.mouseOutObjects[i] );
  }
}
