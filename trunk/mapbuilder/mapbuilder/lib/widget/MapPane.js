/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to render a map from an OGC context document.
 * This widget extends WidgetBase.
 * If the widget has the fixedWidth property set to true, then the width of the
 * MapPane will be taken from the width of the HTML element.  Height will be set
 * to maintain a constant aspect ratio.
 * This widget implements listeners for all mouse event types so that tools can
 * define mouse event callbacks.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapPane(widgetNode, model) {
  // Inherit the WidgetBase functions and parameters
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /** Id of <DIV> tag which contains the MapPane HTML. The <DIV> tag is built
   *  by MapPane.xsl. */
  this.containerId = "mappane_"+model.id;
  this.stylesheet.setParameter("mapContainerId", this.containerId );

  //adjust the context width and height if required.
  var fixedWidth = widgetNode.selectSingleNode("fixedWidth");
  if ( fixedWidth ) {
    fixedWidth = fixedWidth.firstChild.nodeValue;
    var aspectRatio = this.model.getWindowHeight()/this.model.getWindowWidth();
    var newHeight = Math.round(aspectRatio*fixedWidth);
    this.model.setWindowWidth( fixedWidth );
    this.model.setWindowHeight( newHeight );
    this.model.extent.SetResolution( new Array(fixedWidth, newHeight) );
    this.node.style.width = fixedWidth;
  }

  /**
   * Define mouse event handler functions for the MapPane.  This function should
   * be called after each paint since the <DIV> tag is recreated after each paint.
   * @param objRef The MapPane object.
   */
  this.setContainerNodeHandlers = function(objRef) {
    //reset these on a paint because the containerNode is created on paint
    //these added to the containerNode because they will be referenced in that context
    //var containerNode = objRef.node;
    var containerNode = document.getElementById( objRef.containerId );
    containerNode.widget = objRef;
    containerNode.extent = objRef.model.extent;
    containerNode.onmousemove = objRef.eventHandler;
    containerNode.onmouseout = objRef.eventHandler;
    containerNode.onmouseover = objRef.eventHandler;
    containerNode.onmousedown = objRef.eventHandler;
    containerNode.onmouseup = objRef.eventHandler;
  }
  this.addListener( "paint", this.setContainerNodeHandlers, this );

  /**
   * TBD: Comment me.
   * @param objRef MapPane's containing <DIV> tag as an XML node.
   */
  this.setClip=function(objRef){
    //width=objRef.model.getWindowWidth();
    //height=objRef.model.getWindowHeight();
    //objRef.node.style.clip="rect(0," + width + "," + height + ",0)";
  }
  //this.addListener( "paint", this.setClip, this );

  /**
   * TBD: Comment me.
   */
  this.moveImages=function(left,top){
    var images=this.node.firstChild.getElementsByTagName("img");
    for(var i=0; i<images.length; i++) {
      var img=images.item(i);
      img.style.left=left;
      img.style.top=top;
    }
  }

  /**
   * Called when the context's hidden attribute changes.
   * @param layerName The Name of the LayerList/Layer from the Context which
   * has changed.
   * @param thisWidget This object.
   * @param layerName  The name of the layer that was toggled.
   */
  this.hiddenListener=function(thisWidget, layerName){
    var vis="visible";
    if(thisWidget.model.getHidden(layerName)=="1"){
      vis="hidden";
    }
    var layerId = thisWidget.model.id + "_" + thisWidget.id + "_" + layerName;
    document.getElementById(layerId).style.visibility=vis;
  }
  this.model.addListener("hidden",this.hiddenListener,this);

  /**
   * Called when the context's boundingBox attribute changes.
   * @param thisWidget This object.
   */
  this.boundingBoxChangeListener=function(thisWidget){
    thisWidget.paint();
  }
  this.model.addListener("boundingBox",this.boundingBoxChangeListener,this);


/** Cross-browser mouse event handling.
  * This function is the event handler for all MapPane mouse events.
  * Listeners are defined for all the mouse actions.  This includes:
  * "mouseup", "mousedown", "mousemove", "mouseover", "mouseout".
  * This function executes in the context of the MapPane container node, 
  * ie. this = the container with id set in MapPane stylesheet.
  * It will set some properties on this node, which is passed on for further 
  * use by any regsitered listeners:
  * * evpl      pixel/line of the event relative to the upper left corner of the DIV.
  * * evxy      projection x and y of the event calculated via the context.extent.
  * * evTarget  projection x and y of the event calculated via the context.extent.
  * * evType    projection x and y of the event calculated via the context.extent.
  * * keypress state for ALT CTL and SHIFT keys.
  *
  * @param ev the mouse event oject passed in from the browser (will be null for IE)
  */
  this.eventHandler=function(ev) {
    if (window.event) {
      //IE events
      var p = window.event.clientX - this.offsetLeft + document.documentElement.scrollLeft + document.body.scrollLeft;
      var l = window.event.clientY - this.offsetTop + document.documentElement.scrollTop + document.body.scrollTop;
      this.evpl = new Array(p,l);
      this.eventTarget = window.event.srcElement;
      this.eventType = window.event.type;
      this.altKey = window.event.altKey;
      this.ctrlKey = window.event.ctrlKey;
      this.shiftKey = window.event.shiftKey;
      window.event.returnValue = false;
      window.event.cancelBubble = true;
    } else {
      //mozilla browsers
      var p = ev.clientX + window.scrollX - this.offsetLeft;
      var l = ev.clientY + window.scrollY - this.offsetTop;
      this.evpl = new Array(p,l);
      this.eventTarget = ev.target;
      this.eventType = ev.type;
      this.altKey = ev.altKey;
      this.ctrlKey = ev.ctrlKey;
      this.shiftKey = ev.shiftKey;
      ev.stopPropagation();
    }

    this.evxy = this.extent.GetXY( this.evpl );
    this.widget.callListeners(this.eventType,this);
    return false;
  }
}
