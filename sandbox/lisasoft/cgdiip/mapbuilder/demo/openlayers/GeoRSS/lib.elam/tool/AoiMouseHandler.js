/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: AoiMouseHandler.js 2983 2007-07-16 07:36:01Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Tool which implements a click and drag behaviour to set the 
 * Area Of Interest on the model from mouse events.
 * The tool must be enabled before use by calling tool.enable(true);
 * This tool registers mouse event listeners on the parent model.
 * This tool processes screen coordinates and stores AOI in the current map
 * projection coordinates.
 * WARNING: This tool cannot be used in maps that use button controls.
 * Button controls take care of aoi handling themselves.
 * It is designed for use in locator map setups only.
 * @deprecated
 * @constructor
 * @base ToolBase
 * @param toolNode The node for this tool from the configuration document.
 * @param model  The model object that contains this tool
 */

function AoiMouseHandler(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));

  /**
   * Process a the mouseout action when the mouse moves out of the mappane
   * @param objRef      Pointer to this object.
   * @param targetNode  The HTML node that the event occured on
   */
  this.mouseOutHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.started) objRef.started = false;
    }
  }

  /**
   * Process a the mousemove action as dragging out a box.
   * @param objRef      Pointer to this object.
   * @param targetNode  The HTML node that the event occured on
   */
  this.mouseOverHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      //if (objRef.started) objRef.dragBox(targetNode.evpl);
    }
  }

  /** Change the coordinate of one corner of the box.  The anchor point stays fixed. 
   * @param evpl    new corner coordinate.
   */
  this.dragBox = function( evpl ) {	
    var ul = new Array();
    var lr = new Array();
    if (this.anchorPoint[0] > evpl[0]) {
      ul[0] = evpl[0];
      lr[0] = this.anchorPoint[0];
    } else {
      ul[0] = this.anchorPoint[0];
      lr[0] = evpl[0];
    }
    if (this.anchorPoint[1] > evpl[1]) {
      ul[1] = evpl[1];
      lr[1] = this.anchorPoint[1];
    } else {
      ul[1] = this.anchorPoint[1];
      lr[1] = evpl[1];
    }

    //set new AOI in context
    ul = this.model.extent.getXY( ul );
    lr = this.model.extent.getXY( lr );
    this.model.setParam("aoi", new Array(ul,lr) );
  }

  this.mapInit = function(objRef) {
    //register the listeners on the model
    objRef.model.map.events.register('mousedown', objRef, objRef.mouseDownHandler);
    objRef.model.map.events.register('mousemove', objRef, objRef.mouseMoveHandler);
    objRef.model.map.events.register('mouseup', objRef, objRef.mouseUpHandler);
    //this.model.addListener('mouseout',this.mouseOutHandler,this);
    //this.model.addListener('mouseover',this.mouseOutHandler,this);
  }
  this.model.addListener("loadModel", this.mapInit, this);
}

/**
 * Process the mouseup action by stopping the drag.
 * @param e OpenLayers event
 */
AoiMouseHandler.prototype.mouseUpHandler = function(e) {
  if (this.enabled) {
    if (this.started) this.started = false;
  	OpenLayers.Event.stop(e);  
  }
}

/**
 * Process the mousedown action by setting the anchor point.
 * @param e OpenLayers.event
 */
AoiMouseHandler.prototype.mouseDownHandler = function(e) {
  if (this.enabled && !this.started) {
    this.started = true;
    this.anchorPoint = [e.xy.x, e.xy.y];
    this.dragBox( [e.xy.x, e.xy.y] );
  	OpenLayers.Event.stop(e);  
  }
}

/**
 * Process a the mousemove action as dragging out a box.
 * @param e OpenLayers event
 */
AoiMouseHandler.prototype.mouseMoveHandler = function(e) {
  if (this.enabled) {
    if (this.started) this.dragBox([e.xy.x, e.xy.y]);
  	OpenLayers.Event.stop(e);  
  }
}