/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Controller for the locator map widget.  
 * Specify the context that this widget follows by setting the targetModel 
 * property in config.
 * This will display the AOI of the target model using the AoiBox tool. 
 * This will also process mouse events (click and dragbox) to recenter the 
 * target model and includes coordinate projection transformations if required.
 * Checking for extent limits is not yet implemented.
 * 
 * WARNING: it is recommended to use the OverviewMap widget. However since the behavior
 * is slightly different from this widget, this one is still available.
 * See also MAP-300
 * @deprecated
 * @constructor
 * @base ToolBase
 * @author Adair
 * @param toolNode      The tool node from the config document for this tool
 * @param model  Reference to the widget object that creates this tool
 */
function ZoomToAoi(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));

  /**
   * Target model loadModel change listener.  This resets the projection objects
   * if the target model changes.
   * @param tool        Pointer to this ZoomToAoi object.
   */
  this.initProj = function( toolRef ) {
    if( toolRef.model.doc && toolRef.targetModel.doc ) {
      if ( toolRef.model.getSRS() != toolRef.targetModel.getSRS() ) {
          toolRef.model.proj = new OpenLayers.Projection( toolRef.model.getSRS() );
          toolRef.targetModel.proj = new OpenLayers.Projection( toolRef.targetModel.getSRS() );
      }
    }
  }
  this.setListeners = function( toolRef ) {
    toolRef.model.addListener( "loadModel", toolRef.initProj, toolRef );
    toolRef.targetModel.addListener( "loadModel", toolRef.initProj, toolRef );
    toolRef.initProj( toolRef );
  }
  this.model.addListener( "loadModel", this.setListeners, this);

  /**
   * Target model bbox change listener.  This sets this model's AOI to be the
   * same as the target model bounding box.
   * @param tool        Pointer to this ZoomToAoi object.
   */
  this.showTargetAoi = function( tool ) {
    if( tool.targetModel.doc ) {
      var bbox = tool.targetModel.getBoundingBox();  
      var ul = new Array(bbox[0],bbox[3]);
      var lr = new Array(bbox[2],bbox[1]);
      if ( tool.model.getSRS() != tool.targetModel.getSRS() ) {
        var ptUL=new OpenLayers.Geometry.Point(ul[0],ul[1]);
        var ptLR=new OpenLayers.Geometry.Point(lr[0],lr[1]);
        ptUL.transform(tool.targetModel.proj,tool.model.proj);
        ptLR.transform(tool.targetModel.proj,tool.model.proj);
        ul = new Array(ptUL.x,ptUL.y);
        lr = new Array(ptLR.x,ptLR.y);      
        
      }
      tool.model.setParam("aoi", new Array(ul, lr) );
    }
  }
  
  this.firstInit = function(tool) {
    tool.model.map.events.register('mouseup',tool, tool.mouseUpHandler);
    tool.targetModel.addListener( "loadModel", tool.showTargetAoi, tool );
    tool.targetModel.addListener( "bbox", tool.showTargetAoi, tool );
    tool.showTargetAoi(tool);
  }
  this.model.addListener( "loadModel", this.firstInit, this );
  
  this.clear = function(tool) {
    if (tool.model.map && tool.model.map.events) {
      tool.model.map.events.unregister('mouseup',tool, tool.mouseUpHandler);
    }
  }
  this.model.addListener("clearModel", this.clear, this);
}

/**
 * Process a mouse up action.  This will recenter the target model's bbox
 * to be equal to this model's AOI.
 * @param e OpenLayers event
 */
ZoomToAoi.prototype.mouseUpHandler = function(e) {
  var bbox = this.model.getParam("aoi");
  var ul = bbox[0];
  var lr = bbox[1];
  if ( this.model.getSRS() != this.targetModel.getSRS() ) {
    //TBD: convert XY to lat/long first
      var ptUL=new OpenLayers.Geometry.Point(ul[0],ul[1]);
      var ptLR=new OpenLayers.Geometry.Point(lr[0],lr[1]);
      ptUL.transform(this.model.proj,this.targetModel.proj);
      ptLR.transform(this.model.proj,this.targetModel.proj);
      ul = new Array(ptUL.x,ptUL.y);
      lr = new Array(ptLR.x,ptLR.y);    
  }
  if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
    this.targetModel.map.setCenter(new OpenLayers.LonLat(ul[0],ul[1]));
  } else {
    this.targetModel.map.zoomToExtent(new OpenLayers.Bounds(ul[0], lr[1], lr[0], ul[1]));
  }
}
