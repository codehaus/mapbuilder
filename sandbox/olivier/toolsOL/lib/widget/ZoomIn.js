/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomIn.js 2133M 2007-01-26 15:08:53Z (local) $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function ZoomIn(widgetNode, model) {
 this.options=new Object();

  ButtonBase.apply(this, new Array(widgetNode, model));
  
  this.options.id=this.id;
  this.options.cursor = "crosshair";
  this.options.size=new OpenLayers.Size(24,24);
  this.objectOL=new OpenLayers.Button.ZoomIn(this.options);
  
  
  
  this.addButton = function(objRef){

		  objRef.targetModel.toolbar.div=document.getElementById(objRef.htmlTagId);
		  objRef.targetModel.toolbar.addTools(objRef.objectOL);
		  if(objRef.selected)
		  {	
		  		objRef.targetModel.toolbar.setTool(objRef.objectOL);
		  }
   }
  /**
   * Calls the model's ceter at method to zoom in.  If the AOI is a single point,
   * it zooms in by the zoomFactor factor.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.updateMB = function() {
  
  if (this.enabled) {
  
    	/*var bboxOL=this.taretModel.map.getExtent().toBBOX().split(',');
    	this.ul = this.targetModel.extent.getXY(new Array(bboxOL[0],bboxOL[3]));
    	this.lr = this.targetModel.extent.getXY(new Array(bboxOL[2],bboxOL[1]));
    	this.targetModel.setBoundingBox( new Array(this.ul[0], this.lr[1], this.lr[0], this.ul[1]) );
    	this.targetModel.extent.setSize(new Array(this.targetModel.map.getResolution(),this.targetModel.map.getResolution()));
      
      alert(this.targetModel.getBoundingBox());*/
  }
}
  /**
   * Register for zoomend events.
   * @param objRef  Pointer to this object.
   */
  this.setMapListener = function(objRef) {
  			objRef.targetModel.map.events.register("zoomend", objRef, objRef.updateMB);
  }
   this.model.addListener( "mapLoaded", this.addButton, this );
  //this.model.addListener( "mapLoaded", this.setMapListener, this );

}

