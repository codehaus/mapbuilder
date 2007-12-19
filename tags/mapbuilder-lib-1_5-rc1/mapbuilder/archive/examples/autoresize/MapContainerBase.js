/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: MapContainerBase.js 2511 2007-01-05 11:55:23Z gjvoosten $
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
    alert(mbGetMessage("noMapContainerId", this.id));
  }
  var contextSizeNode = widgetNode.selectSingleNode("mb:contextSize");
  if (contextSizeNode) {
    this.contextSize = contextSizeNode.firstChild.nodeValue;
  } else {
    this.contextSize = true;
  }
  //check if there are fixed zoom levels defined
  var zoomLevelsNode = widgetNode.selectSingleNode("mb:zoomLevels");
  this.zoomLevels = null;
  if (zoomLevelsNode) {
    this.zoomLevels = zoomLevelsNode.firstChild.nodeValue.split(",");
  }

  this.setContainerWidth = function(objRef) {
  	if(objRef.contextSize){
  	 	objRef.node.style.width=objRef.containerModel.getWindowWidth()+'px';
    	objRef.node.style.height=objRef.containerModel.getWindowHeight()+'px';
  	  if (this.stylesheet) {
	      this.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
      	this.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
    	}
  	}
  }


  /**
   * method to adjust the width of the container DIV on startup.  If the 
   * <fixedWidth> property is set in config, width and height of the context
   * doc will be adjusted.
   * @param objRef pointer to this object.
   */
  this.setFixedWidth = function(objRef) {
    //adjust the context width and height if required.
    var fixedWidth = widgetNode.selectSingleNode("mb:fixedWidth");
    if ( fixedWidth ) {
    	alert(fixedWidth);
      fixedWidth = fixedWidth.firstChild.nodeValue;
      var aspectRatio = objRef.containerModel.getWindowHeight()/objRef.containerModel.getWindowWidth();
      var newHeight = Math.round(aspectRatio*fixedWidth);
      objRef.containerModel.setWindowSize( new Array(fixedWidth, newHeight) );
    }
  }

/**
 * Initialize the container.  Only the first widget to attach to this container
 * configures the container, all others carry out a much simpler initialization.
 * All widgets share the same widget.containerModel, widget.containerModel.extent
 * and HTML containerNode.
 */
  var containerNode = document.getElementById(this.containerNodeId);
  if (containerNode.containerModel) {
    this.containerModel = containerNode.containerModel;
    model.containerModel = containerNode.containerModel;
    //this.containerModel.addListener("bbox",this.paint,this);

/**
 * the containerModel is initialized here
 */
  } else {
    //create the container node and set it's properties
  /*  containerNode = document.createElement("div");
    containerNode.setAttribute("id",this.containerNodeId);
    containerNode.id=this.containerNodeId;
    containerNode.style.position="relative";
    containerNode.style.overflow="hidden";
    containerNode.style.width="100%";
    containerNode.style.height="100%";
    */
    containerNode.containerModel = this.model;
    this.containerModel = this.model;
    model.containerModel = containerNode.containerModel;   

    //add the extent tool
    this.containerModel.extent = new Extent( this.containerModel );
    //Enable fixed scales
    if (this.zoomLevels) {
      this.containerModel.extent.setZoomLevels(true,this.zoomLevels);
    } else {
      this.containerModel.extent.setZoomLevels(false);
    }
    this.containerModel.addFirstListener( "loadModel", this.containerModel.extent.firstInit, this.containerModel.extent );
    this.containerModel.addListener( "bbox", this.containerModel.extent.init, this.containerModel.extent );
    this.containerModel.addListener( "resize", this.containerModel.extent.init, this.containerModel.extent );

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
        var p = window.event.clientX - getOffsetLeft(this) + document.documentElement.scrollLeft + document.body.scrollLeft;
        var l = window.event.clientY - getOffsetTop(this) + document.documentElement.scrollTop + document.body.scrollTop;
        this.evpl = new Array(p,l);
        this.eventTarget = window.event.srcElement;
        this.altKey = window.event.altKey;
        this.ctrlKey = window.event.ctrlKey;
        this.shiftKey = window.event.shiftKey;
        this.eventType = window.event.type;
        // mousedown event is not received on IE when using gmaps version 1,
        // so we simulate a mousedown event by noticing a change in mouse
        // button state during the mousemove event.
        //if ((this.eventType=="mousemove") && (this.button % 1 == 0) && (window.event.button % 1 == 1)){

        //if ((this.eventType=="mousemove") && (this.button != window.event.button)){
        //  alert("MapContainerBase.eventHandler this.button="+this.button+" ev.button="+window.event.button);
        //  this.eventType="mousedown";
        //}}
        //this.button=window.event.button;
        window.event.returnValue = false;
        window.event.cancelBubble = true;
      } else {
        //mozilla browsers
        var p = ev.clientX + window.scrollX - getOffsetLeft(this);
        var l = ev.clientY + window.scrollY - getOffsetTop(this);
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
    this.node =containerNode;
  }
  this.node = document.getElementById(this.containerNodeId);

  this.setContainerWidth = this.setContainerWidth;
  this.containerModel.addFirstListener( "loadModel", this.setContainerWidth, this );
  this.containerModel.addFirstListener( "loadModel", this.setFixedWidth, this );
	// the following line added by schut@sarvision.nl according to http://article.gmane.org/gmane.comp.gis.mapbuilder.user/1040
	this.containerModel.addFirstListener( "resize", this.setContainerWidth, this );
  this.containerModel.addListener( "bbox", this.paint, this );
}

/** Functions to get the offset of the mapPane to its parent div. Important in nested div situations
  * fix proposed by Henk Haveman on bug MAP-106
  * @param node the node containing mappane
  */
function getOffsetLeft(node) {
  var offsetLeft = 0;
  if (node == null) {
    return offsetLeft;
  } 
  else {
    if (node.offsetLeft) {
      offsetLeft = node.offsetLeft + getOffsetLeft(node.offsetParent);
    }
    else {
      offsetLeft = getOffsetLeft(node.offsetParent);
    }
    return offsetLeft;
  }
} 
    
function getOffsetTop(node) {
  var offsetTop = 0;
  if (node == null) {
    return offsetTop;
  }
  else {
    if (node.offsetTop) {
      offsetTop = node.offsetTop + getOffsetTop(node.offsetParent);
    }
    else {
      offsetTop = getOffsetTop(node.offsetParent);
    }
    return offsetTop;
  }
} 
