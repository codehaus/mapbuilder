/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id: ZoomToAoi.js 2384 2006-12-05 09:38:47Z vincentschut $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");

/**
 * Controller for the locator map widget.  
 * Specify the context that this widget follows by setting the targetModel 
 * property in config.
 * This will display the AOI of the target model using the AoiBox tool. 
 * This will also process mouse events (click and dragbox) to recenter the 
 * target model and includes coordinate projection transformations if required.
 * Checking for extent limits is not yet implemented.
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
          toolRef.model.proj = new Proj( toolRef.model.getSRS() );
          toolRef.targetModel.proj = new Proj( toolRef.targetModel.getSRS() );
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
	      ul = tool.targetModel.proj.Inverse( ul ); //to lat-long
	      lr = tool.targetModel.proj.Inverse( lr );
	      if (ul[0]>lr[0]) ul[0] = ul[0]-360.0;     //make sure ul is left of lr
	      ul = tool.model.proj.Forward( ul );       //back to XY
	      lr = tool.model.proj.Forward( lr );
	    }
	    tool.model.setParam("aoi", new Array(ul, lr) );
    }
  }
  this.firstInit = function(tool) {
    tool.targetModel.addListener( "loadModel", tool.showTargetAoi, tool );
    tool.targetModel.addListener( "bbox", tool.showTargetAoi, tool );
    tool.showTargetAoi(tool);
  }
  this.model.addListener( "loadModel", this.firstInit, this );


  /**
   * Process a mouse up action.  This will recenter the target model's bbox
   * to be equal to this model's AOI.
   * @param tool        Pointer to this ZoomToAoi object.
   * @param targetNode  The node for the enclosing HTML tag for this widget, not used.
   */
  this.mouseUpHandler = function(tool,targetNode) {
    var bbox = tool.model.getParam("aoi");
    var ul = bbox[0];
    var lr = bbox[1];
    if ( tool.model.getSRS() != tool.targetModel.getSRS() ) {
      //TBD: convert XY to lat/long first
      ul = tool.targetModel.proj.Forward( ul ); //to target XY
      lr = tool.targetModel.proj.Forward( lr );
    }
    if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
      tool.targetModel.extent.centerAt( ul, tool.targetModel.extent.res[0] );
    } else {
      tool.targetModel.extent.zoomToBox( ul, lr );
    }
  }
  this.model.addListener('mouseup',this.mouseUpHandler,this);
}
