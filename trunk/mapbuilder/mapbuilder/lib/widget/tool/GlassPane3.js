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
  this.node = document.getElementById( parentWidget.containerId );
  this.node.parentWidget = parentWidget;

  this.node.onmousemove = mouseMoveHandler;
  this.node.onmouseout = mouseOutHandler;
  this.node.onmouseover = mouseOverHandler;
  this.node.onmousedown = mouseDownHandler;
  this.node.onmouseup = mouseUpHandler;
  this.node.getEvent = getEvent;
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
  this.evxy = this.parentWidget.model.extent.GetXY( this.evpl );
}


function mouseDownHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.parentWidget.mouseDownListeners.length; i++) {
    this.parentWidget.mouseDownListeners[i]( this, this.parentWidget.mouseDownObjects[i] );
  }
  if (window.event) {
    window.event.returnValue = false;
    window.event.cancelBubble = true;
  } else {
    ev.stopPropagation();
  }
  return false;
}

function mouseUpHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.parentWidget.mouseUpListeners.length; i++) {
    this.parentWidget.mouseUpListeners[i]( this, this.parentWidget.mouseUpObjects[i] );
  }
  if (window.event) {
    window.event.returnValue = false;
    window.event.cancelBubble = true;
  } else {
    ev.stopPropagation();
  }
  return false;
}

function mouseMoveHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.parentWidget.mouseMoveListeners.length; i++) {
    this.parentWidget.mouseMoveListeners[i]( this, this.parentWidget.mouseMoveObjects[i] );
  }
  if (window.event) {
    window.event.returnValue = false;
    window.event.cancelBubble = true;
  } else {
    ev.stopPropagation();
  }
  return false;
}

function mouseOverHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.parentWidget.mouseOverListeners.length; i++) {
    this.parentWidget.mouseOverListeners[i]( this, this.parentWidget.mouseOverObjects[i] );
  }
  if (window.event) {
    window.event.returnValue = false;
    window.event.cancelBubble = true;
  } else {
    ev.stopPropagation();
  }
  return false;
}

function mouseOutHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.parentWidget.mouseOutListeners.length; i++) {
    this.parentWidget.mouseOutListeners[i]( this, this.parentWidget.mouseOutObjects[i] );
  }
  if (window.event) {
    window.event.returnValue = false;
    window.event.cancelBubble = true;
  } else {
    ev.stopPropagation();
  }
  return false;
}
