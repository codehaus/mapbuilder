/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
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
 * @base WidgetBase
 * @author Mike Adair 
 * @param widget      Pointer to the widget instance being created
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapContainerBase(widget,widgetNode,model) {
  var base = new WidgetBase(widget, widgetNode, model);

  //if there is a container node for this widget, initialized later
  var mapContainerNode = widgetNode.selectSingleNode("mb:mapContainerId");
  if (mapContainerNode) {
    widget.containerNodeId = mapContainerNode.firstChild.nodeValue;
  } else {
    alert("MapContainerBase: required property mapContainerId missing in config:"+widget.id);
  }

/**
 * Initialize the container if required.
 */
  var containerNode = document.getElementById(widget.containerNodeId);
  if (containerNode) {
    widget.containerModel = containerNode.containerModel;
    model.containerModel = containerNode.containerModel;
    //widget.containerModel.addListener("bbox",widget.paint,widget);

    this.setContainerWidth = function(objRef) {
      objRef.node.style.width=objRef.containerModel.getWindowWidth();
      objRef.node.style.height=objRef.containerModel.getWindowHeight();
      widget.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
      widget.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
    }

/**
 * the containerModel is initialized here
 */
  } else {
    containerNode = document.createElement("DIV");
    containerNode.setAttribute("id",widget.containerNodeId);
    containerNode.id=widget.containerNodeId;
    // Set dimensions of containing <div>widget.
    containerNode.style.position="relative";
    containerNode.style.overflow="hidden";

    containerNode.containerModel = widget.model;
    widget.containerModel = widget.model;
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
      objRef.node.style.width=objRef.containerModel.getWindowWidth();
      objRef.node.style.height=objRef.containerModel.getWindowHeight();
      widget.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
      widget.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
    }

    //add the extent tool
    widget.containerModel.extent = new Extent( widget.containerModel );
    widget.containerModel.addFirstListener( "loadModel", widget.containerModel.extent.init, widget.containerModel.extent );
    widget.containerModel.addListener( "bbox", widget.containerModel.extent.init, widget.containerModel.extent );
    //TBD: do an extent history by storing extents every time the aoi changes

    /**
     * Called just before paint to set the map scale as stylesheet param
     * @param objRef pointer to this object.
     */
    widget.prePaint = function(objRef) {
      var mapScale = objRef.model.extent.getScale();
      widget.stylesheet.setParameter("mapScale", mapScale );
      if (_SARISSA_IS_IE) widget.stylesheet.setParameter("isIE", "true" );
    }

    /**
     * Called just before paint to set a help message for when the cursor is 
     * over the map container.
      //TBD: implement some sort of map pane hover mechanism to show the tooltip
     * @param objRef pointer to this object.
     */
    widget.setTooltip = function(objRef, tooltip) {
      //alert("setting mappane tooltip to:"+tooltip);
    }
    widget.containerModel.addListener( "tooltip", widget.setTooltip, widget);

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
    widget.eventHandler = this.eventHandler;

    containerNode.onmousemove = widget.eventHandler;
    containerNode.onmouseout = widget.eventHandler;
    containerNode.onmouseover = widget.eventHandler;
    containerNode.onmousedown = widget.eventHandler;
    containerNode.onmouseup = widget.eventHandler;
    widget.node.appendChild(containerNode);
  }
  widget.node = document.getElementById(widget.containerNodeId);

  widget.setContainerWidth = this.setContainerWidth;
  widget.containerModel.addFirstListener( "loadModel", widget.setContainerWidth, widget );
  widget.containerModel.addListener( "bbox", widget.paint, widget );
}
