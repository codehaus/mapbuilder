/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: GoogleMapZoomIn.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/tool/GoogleMapTools.js");

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function GoogleMapZoomIn(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Calls the model's ceter at method to zoom in.  If the AOI is a single point,
   * it zooms in by the zoomBy factor.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      var bbox = objRef.targetModel.getParam("aoi");
      if ( bbox!=null) {
        var extent = objRef.targetModel.extent;
        var ul = bbox[0];
        var lr = bbox[1];
        if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
          objRef.googleMapTools.zoomTo(objRef.targetModel,ul,1);
        } else {
          objRef.googleMapTools.setGmapExtent(objRef.targetModel,new Array(lr[0],ul[1],ul[0],lr[1]));
        }
      }
    }
  }

  /**
   * Register for mouseUp events.
   * @param objRef  Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.model.addListener('mouseup',objRef.doAction,objRef);
    }
    // Create a googleMapTools instance
    if(!objRef.googleMapTools){
      objRef.googleMapTools=new GoogleMapTools();
    }
  }
  this.model.addListener( "loadModel", this.setMouseListener, this );

}

