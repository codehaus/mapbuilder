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
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  this.cursor = "cross";	
  
 // this.objectOL = new OpenLayers.MouseListener.ZoomIn();
   
  /**
   * Calls the model's ceter at method to zoom in.  If the AOI is a single point,
   * it zooms in by the zoomFactor factor.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(e) {
  
  if (this.enabled) {
  
  //alert(this.model.map.getExtent());
 // this.model.map.removeMouseListener(this.model.ZoomIn);
    	/*ul=this.model.extent.getXY(e.xy);
 		lr=ul;
 		this.model.setParam("aoi",new Array(ul,lr));
 	
        var bbox = this.model.getParam("aoi");
      
        if ( bbox!=null) {
     
        ////coordinates must be in Lon/Lat for OL
        
        ul = bbox[0];
        lr = bbox[1];

        if (( ul[0]==lr[0] ) && ( ul[1]==lr[1] )) 
        {
        	this.model.extent.centerAt(ul,1);    
        } 
        else 
        {
        	this.model.extent.zoomToBox(ul,lr);
        }
      }*/
  }
    else{
  	this.model.map.removeMouseListener(this.objectOL); 
  }
}

this.addListener = function(e) 
{
		this.model.map.addMouseListener(this.objectOL);  
} 
  /**
   * Register for mouseUp events.
   * @param objRef  Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
  			objRef.model.map.addMouseListener(objRef.model.ZoomIn);  
  			objRef.model.map.events.register("mousedown", objRef, objRef.addListener);
  			objRef.model.map.events.register("mouseup", objRef, objRef.doAction);
  			
  }
  this.model.addListener( "mapLoaded", this.setMouseListener, this );

}

