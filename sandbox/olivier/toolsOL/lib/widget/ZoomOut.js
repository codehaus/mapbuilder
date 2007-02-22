/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomOut.js 2133M 2007-01-26 15:13:07Z (local) $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, click on the map to zoom out centered at the click.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function ZoomOut(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  this.cursor = "cross";
  /**
  Set the zoomfactor and check if it is set in de configuration file.
  */

  this.model.ZoomOut = new OpenLayers.MouseListener.ZoomOut();
  /**
   * Calls the centerAt method of the context doc to zoom out, recentering at 
   * the mouse event coordinates.
   * TBD: set the zoomFactor property as a button property in conifg
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(e) {
  if (this.enabled) {
  alert(this.model.map.getExtent());
  
    /*var bbox = objRef.targetModel.getParam("aoi");
    if ( bbox!=null) 
    {
    	////coordinates must be in Lon/Lat for OL
    	var ul = bbox[0];
    	var lr = bbox[1];

	    center=new Array((lr[0]+ul[0])/2,(ul[1]+lr[1])/2);
	      objRef.targetModel.extent.centerAt(center,-1);
	    //objRef.targetModel.setParam("zoomOut",center);
    }  */
  }
  else{
  	this.model.map.removeMouseListener(this.model.ZoomOut); 
  }
  }

this.addListener = function(e) 
{
	if (this.enabled) {
		this.model.map.addMouseListener(this.model.ZoomOut);  
	}
}  
  /**
   * Register for mouseUp events.
   * @param objRef  Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
  			//objRef.model.map.addMouseListener(objRef.model.ZoomOut);  
  			objRef.model.map.events.register("mousedown", objRef, objRef.addListener);
  			objRef.model.map.events.register("mouseup", objRef, objRef.doAction);
  			
  }
  this.model.addListener( "mapLoaded", this.setMouseListener, this );

}
