/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
Dependancies: Context
$Id$
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
 * @author Adair
 * @param toolNode      The tool node from the config document for this tool
 * @param parentWidget  Reference to the widget object that creates this tool
 */
function ZoomToAoi(toolNode, parentWidget) {
  var base = new ToolBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Target model loadModel change listener.  This resets the projection objects
   * if the target model changes.
   * @param tool        Pointer to this ZoomToAoi object.
   */
  this.setModel = function( tool ) {
    //tool.targetModel = config[tool.targetModelName];
    tool.targetModel.proj = new Proj( tool.targetModel.getSRS() );
    tool.model.proj = new Proj( tool.model.getSRS() );
  }
  this.setModel(this);
  this.targetModel.addListener( "loadModel", this.setModel, this );

  /**
   * Target model bbox change listener.  This sets this model's AOI to be the
   * same as the target model bounding box.
   * @param tool        Pointer to this ZoomToAoi object.
   * @param targetNode  The node for the enclosing HTML tag for this widget, not used.
   */
  this.showTargetAoi = function( tool, targetNode ) {
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
    tool.model.extent.setAoi( ul, lr );
  }
  this.targetModel.addListener( "boundingBox", this.showTargetAoi, this );
  this.targetModel.addListener( "loadModel", this.showTargetAoi, this );
  this.showTargetAoi(this);   


  /**
   * Process a mouse up action.  This will recenter the target model's bbox
   * to be equal to this model's AOI.
   * @param tool        Pointer to this ZoomToAoi object.
   * @param targetNode  The node for the enclosing HTML tag for this widget, not used.
   */
  this.mouseUpHandler = function(tool,targetNode) {
    var bbox = tool.model.getAoi();
    var ul = tool.model.extent.GetXY( bbox[0] );
    var lr = tool.model.extent.GetXY( bbox[1] );
    if ( tool.model.getSRS() != tool.targetModel.getSRS() ) {
      ul = tool.targetModel.proj.Forward( ul ); //to target XY
      lr = tool.targetModel.proj.Forward( lr );
    }
    if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
      tool.targetModel.extent.CenterAt( ul, tool.targetModel.extent.res[0] );
    } else {
      tool.targetModel.extent.ZoomToBox( ul, lr );
    }
  }
  this.parentWidget.addListener('mouseup',this.mouseUpHandler,this);
}
