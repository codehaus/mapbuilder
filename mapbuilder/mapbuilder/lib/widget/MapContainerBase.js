/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/Extent.js");

/**
 * Base class for a MapContainer.  Widgets extending this class will have their
 * output appended to the document in a shared container. 
 * The container instance is specified by the mapContainerId property in config. 
 * Only one instance of the container can be created and it should have only 
 * one model which defines it and set as the widget.containerModel property.  
 * Therefore only the first instance of this class with the given id will actually 
 * create the container div and containerModel property.  
 * Subsequent instances of this class with same mapContainerId will have their
 * widget.node value set to the container node and will have access to a 
 * widget.containerModel property.
 * If the widget has the fixedWidth property set to true, then the width of the
 * MapPane will be taken from the width of the HTML element.  Height will be set
 * to maintain a constant aspect ratio.
 * This widget implements listeners for all mouse event types so that tools can
 * define mouse event callbacks.
 *
 * @constructor
 * @author Mike Adair 
 * @param widget      Pointer to the widget instance being created
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapContainerBase(widgetNode,model) {

  //make sure that the containerNodeId is set in config
  var mapContainerNode = widgetNode.selectSingleNode("mb:mapContainerId");
  if (mapContainerNode) {
    this.containerNodeId = mapContainerNode.firstChild.nodeValue;
  } else {
    alert("MapContainerBase: required property mapContainerId missing in config:"+this.id);
  }

/**
 * Initialize the container.  Only the first widget to attach to this container
 * configures the container, all others carry out a much simpler initialization.
 * All widgets share the same widget.containerModel, widget.containerModel.extent
 * and HTML containerNode.
 */
  var containerNode = document.getElementById(this.containerNodeId);
  if (containerNode) {
    this.containerModel = containerNode.containerModel;
    model.containerModel = containerNode.containerModel;
    //this.containerModel.addListener("bbox",this.paint,this);

    this.setContainerWidth = function(objRef) {
      objRef.node.style.width=objRef.containerModel.getWindowWidth()+'px';
      objRef.node.style.height=objRef.containerModel.getWindowHeight()+'px';
      if (this.stylesheet) {
        this.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
        this.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
      }
    }

/**
 * the containerModel is initialized here
 */
  } else {
    //create the container node and set it's properties
    containerNode = document.createElement("div");
    containerNode.setAttribute("id",this.containerNodeId);
    containerNode.id=this.containerNodeId;
    containerNode.style.position="relative";
    containerNode.style.overflow="hidden";

    containerNode.containerModel = this.model;
    this.containerModel = this.model;
    model.containerModel = containerNode.containerModel;   

    /**
     * method to adjust the width of the container DIV on startup.  If the 
     * <fixedWidth> property is set in config, width and height of the context
     * doc will be adjusted.
     * @param objRef pointer to this object.
     */
    this.setContainerWidth = function(objRef) {
      //adjust the context width and height if required.
      var fixedWidth = widgetNode.selectSingleNode("mb:fixedWidth");
      if ( fixedWidth ) {
        fixedWidth = fixedWidth.firstChild.nodeValue;
        var aspectRatio = objRef.containerModel.getWindowHeight()/objRef.containerModel.getWindowWidth();
        var newHeight = Math.round(aspectRatio*fixedWidth);
        objRef.containerModel.setWindowWidth( fixedWidth );
        objRef.containerModel.setWindowHeight( newHeight );
      }
      objRef.node.style.width=objRef.containerModel.getWindowWidth() +'px';
      objRef.node.style.height=objRef.containerModel.getWindowHeight()+'px';
      if (this.stylesheet) {
        this.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
        this.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
      }
    }

    //add the extent tool
    this.containerModel.extent = new Extent( this.containerModel );
    this.containerModel.addListener( "contextLoaded", this.containerModel.extent.firstInit, this.containerModel.extent );
    this.containerModel.addListener( "bbox", this.containerModel.extent.init, this.containerModel.extent );
    this.containerModel.addListener( "resize", this.containerModel.extent.init, this.containerModel.extent );
    //TBD: do an extent history by storing extents every time the aoi changes

    /**
     * Called just before paint to set a help message for when the cursor is 
     * over the map container.
      //TBD: implement some sort of map pane hover mechanism to show the tooltip
     * @param objRef pointer to this object.
     */
    this.setTooltip = function(objRef, tooltip) {
      //alert("setting mappane tooltip to:"+tooltip);
    }
    this.containerModel.addListener( "tooltip", this.setTooltip, this);

  /** Cross-browser mouse event handling.
    * This function is the event handler for all MapContainer mouse events.
    * Listeners are defined for all the mouse actions.  This includes:
    * "mouseup", "mousedown", "mousemove", "mouseover", "mouseout".
    * This function executes in the context of the MapContainer node, 
    * ie. this = MapContainer node
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

      this.containerModel.setParam(this.eventType,this);
      return false;
    }
    this.eventHandler = this.eventHandler;

    containerNode.onmousemove = this.eventHandler;
    containerNode.onmouseout = this.eventHandler;
    containerNode.onmouseover = this.eventHandler;
    containerNode.onmousedown = this.eventHandler;
    containerNode.onmouseup = this.eventHandler;
    this.node.appendChild(containerNode);
  }
  this.node = document.getElementById(this.containerNodeId);

  this.setContainerWidth = this.setContainerWidth;
  this.containerModel.addFirstListener( "loadModel", this.setContainerWidth, this );
  this.containerModel.addListener( "bbox", this.paint, this );
}
