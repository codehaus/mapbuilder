/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tools to build a MapPane from a Web Map Context.
 * This widget extends WidgetBase.
 * @constructor
 * @param widgetNode The Widget's XML object node from the configuration
 *   document.
 * @param group The ModelGroup XML object from the configuration
 *   document that this widget will update.
 * @requires Context
 * @requires Sarissa
 * @requires Util
 * @see WidgetBase
 */
function MapPane(widgetNode, group) {
  // Inherit the WidgetBase functions and parameters
  var base = new WidgetBase(widgetNode, group);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  this.containerId = "mappane_"+group.id;
  this.stylesheet.setParameter("mapContainerId", this.containerId );

  this.setContainerNodeHandlers = function(objRef) {
    //reset these on a paint because the containerNode is created on paint
    //these added to the containerNode because they will be referenced in that context
    objRef.containerNode = document.getElementById( objRef.containerId );
    objRef.containerNode.parentObject = objRef;
    objRef.containerNode.extent = new Extent( objRef.model );
    objRef.containerNode.onmousemove = mouseMoveHandler;
    objRef.containerNode.onmouseout = mouseOutHandler;
    objRef.containerNode.onmouseover = mouseOverHandler;
    objRef.containerNode.onmousedown = mouseDownHandler;
    objRef.containerNode.onmouseup = mouseUpHandler;
    objRef.containerNode.getEvent = getEvent;
  }

   /**
    * TBD: Comment me.
    */
   this.setClip=function(objRef){
     width=objRef.model.getWindowWidth();
     height=objRef.model.getWindowHeight();
     objRef.node.style.clip="rect(0," + width + "," + height + ",0)";
   }

    this.addPaintListener( this.setClip, this );
    this.addPaintListener( this.setContainerNodeHandlers, this );


   /**
    * TBD: Comment me.
    */
   this.moveImages=function(left,top){
    images=this.node.firstChild.getElementsByTagName("img");
    for(i=0;i<images.length;i++){
      img=images.item(i);
      img.style.left=left;
      img.style.top=top;
     }
   }

  /**
   * Called when the context's hidden attribute changes.
   * @param layerIndex The index of the LayerList/Layer from the Context which
   * has changed.
   * @param target This object.
   */
  this.hiddenListener=function(layerIndex,target){
    var vis="visible";
    if(target.model.getHidden(layerIndex)=="1"){
      vis="hidden";
    }
    document.getElementById(layerIndex).style.visibility=vis;
  }

  /**
   * Called when the context's boundingBox attribute changes.
   * @param target This object.
   */
  this.boundingBoxChangeListener=function(target){
    target.paint();
  }

  /**
   * Call all this object's listeners.
   */
  this.addListeners = function() {
    this.model.addListener("boundingBox",this.boundingBoxChangeListener,this);
    this.model.addListener("hidden",this.hiddenListener,this);
  }

  this.mouseUpListeners = new Array();
  this.mouseDownListeners = new Array();
  this.mouseMoveListeners = new Array();
  this.mouseOverListeners = new Array();
  this.mouseOutListeners = new Array();
  this.mouseUpObjects = new Array();
  this.mouseDownObjects = new Array();
  this.mouseMoveObjects = new Array();
  this.mouseOverObjects = new Array();
  this.mouseOutObjects = new Array();

  this.addMouseListener = function(mouseEvent, listener, objRef) {
    switch(mouseEvent) {
      case 'mouseUp':
        this.mouseUpListeners.push( listener );
        this.mouseUpObjects.push( objRef );
        break;
      case 'mouseDown':				//zoom out
        this.mouseDownListeners.push( listener );
        this.mouseDownObjects.push( objRef );
        break;
      case 'mouseMove':            //pan
        this.mouseMoveListeners.push( listener );
        this.mouseMoveObjects.push( objRef );
        break;
      case 'mouseOver':				//setting AOI
        this.mouseOverListeners.push( listener );
        this.mouseOverObjects.push( objRef );
        break;
      case 'mouseOut':
        this.mouseOutListeners.push( listener );
        this.mouseOutObjects.push( objRef );
        break;	
      default:
        alert("unreconized mouse event:" + mouseEvent);
        break;
    }
  }

}

/** The remaining functions in the file execute as event handlers in the context 
  * of the MapPane container node, ie. this = the container id set in MapPane stylesheet

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
    //this.evpl = new Array(window.event.offsetX, window.event.offsetY);
    var x = window.event.clientX - this.offsetLeft + document.documentElement.scrollLeft + document.body.scrollLeft;
    var y = window.event.clientY - this.offsetTop + document.documentElement.scrollTop + document.body.scrollTop;
    this.evpl = new Array(x,y);
    this.altKey = window.event.altKey;
    this.ctrlKey = window.event.ctrlKey;
    this.shiftKey = window.event.shiftKey;
  } else {
    //mozilla
    //this.evpl = new Array(ev.layerX, ev.layerY);
    var x = ev.clientX + window.scrollX - this.offsetLeft;
    var y = ev.clientY + window.scrollY - this.offsetTop;
    this.evpl = new Array(x,y);
    this.altKey = ev.altKey;
    this.ctrlKey = ev.ctrlKey;
    this.shiftKey = ev.shiftKey;
  }
  this.evxy = this.extent.GetXY( this.evpl );
}


function mouseDownHandler(ev) {
  this.getEvent(ev);
  for (var i=0; i<this.parentObject.mouseDownListeners.length; i++) {
    this.parentObject.mouseDownListeners[i]( this, this.parentObject.mouseDownObjects[i] );
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
  for (var i=0; i<this.parentObject.mouseUpListeners.length; i++) {
    this.parentObject.mouseUpListeners[i]( this, this.parentObject.mouseUpObjects[i] );
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
  for (var i=0; i<this.parentObject.mouseMoveListeners.length; i++) {
    this.parentObject.mouseMoveListeners[i]( this, this.parentObject.mouseMoveObjects[i] );
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
  for (var i=0; i<this.parentObject.mouseOverListeners.length; i++) {
    this.parentObject.mouseOverListeners[i]( this, this.parentObject.mouseOverObjects[i] );
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
  for (var i=0; i<this.parentObject.mouseOutListeners.length; i++) {
    this.parentObject.mouseOutListeners[i]( this, this.parentObject.mouseOutObjects[i] );
  }
  if (window.event) {
    window.event.returnValue = false;
    window.event.cancelBubble = true;
  } else {
    ev.stopPropagation();
  }
  return false;
}

