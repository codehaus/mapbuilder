/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base class for a MapContainer.  Widgets extending this class will have their
 * output appended to the document in a shared container. 
 * The container instance is specified by the mapContainerId property in config. 
 * Only one instance of the container can be created and it should have only 
 * one model which defines it.  
 * Therefore only the first instance of this class with the given id will actually 
 * create the container div and it will have only one source model.
 * For subsequent instances of this class with same id, the widget.node value is 
 * simply replaced with the container node.
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
  if (!containerNode) {
    containerNode = document.createElement("DIV");
    containerNode.setAttribute("id",widget.containerNodeId);
    containerNode.id=widget.containerNodeId;
    // Set dimensions of containing <div>widget.
    containerNode.style.position="relative";
    containerNode.style.overflow="hidden";

    widget.sourceModel = widget.model;
    //widget.sourceModel = widget.node.widget.model;

    widget.setFixedWidth = function(objRef) {
      //adjust the context width and height if required.
      var fixedWidth = widgetNode.selectSingleNode("mb:fixedWidth");
      if ( fixedWidth ) {
        fixedWidth = fixedWidth.firstChild.nodeValue;
        var aspectRatio = objRef.sourceModel.getWindowHeight()/objRef.sourceModel.getWindowWidth();
        var newHeight = Math.round(aspectRatio*fixedWidth);
        objRef.sourceModel.setWindowWidth( fixedWidth );
        objRef.sourceModel.setWindowHeight( newHeight );
      }
      objRef.node.style.width=objRef.sourceModel.getWindowWidth();
      objRef.node.style.height=objRef.sourceModel.getWindowHeight();
    }
    widget.sourceModel.addListener( "loadModel", widget.setFixedWidth, widget );

    //add the extent tool
    widget.sourceModel.extent = new Extent( widget.sourceModel );
    widget.sourceModel.addListener( "aoi", widget.sourceModel.extent.init, widget.sourceModel.extent );
    //TBD: do an extent history too by storing extents everytime the aoi changes

    widget.clearContainer = function(objRef) {
      //with objRef.node remove child
    }
    widget.sourceModel.addListener("newModel",widget.clearContainer, widget);

    /**
     * Called when the context's boundingBox attribute changes.
     * @param thisWidget This object.
     */
    widget.boundingBoxChangeListener=function(thisWidget){
      //this.node.extent = 
      thisWidget.sourceModel.extent.init(thisWidget.sourceModel.extent);
      thisWidget.paint(thisWidget);
    }
    widget.sourceModel.addListener("boundingBox",widget.boundingBoxChangeListener,widget);

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
    widget.eventHandler=function(ev) {
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

      this.widget.callListeners(this.eventType,this);
      return false;
    }

    containerNode.widget = widget;
    containerNode.onmousemove = widget.eventHandler;
    containerNode.onmouseout = widget.eventHandler;
    containerNode.onmouseover = widget.eventHandler;
    containerNode.onmousedown = widget.eventHandler;
    containerNode.onmouseup = widget.eventHandler;
    widget.node.appendChild(containerNode);
  }
  widget.node = document.getElementById(widget.containerNodeId);

  /**
   * Called when the context's hidden attribute changes.
   * @param layerName The Name of the LayerList/Layer from the Context which
   * has changed.
   * @param thisWidget This object.
   * @param layerName  The name of the layer that was toggled.
   */
  widget.hiddenListener=function(thisWidget, layerName){
    var vis="visible";
    if(thisWidget.model.getHidden(layerName)=="1"){
      vis="hidden";
    }
    var layerId = thisWidget.model.id + "_" + thisWidget.id + "_" + layerName;
    document.getElementById(layerId).style.visibility=vis;
  }
  widget.model.addListener("hidden",widget.hiddenListener,widget);

}
