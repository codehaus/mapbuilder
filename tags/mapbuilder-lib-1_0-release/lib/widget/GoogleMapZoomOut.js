/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomOut.js 1671 2005-09-20 02:37:54Z madair1 $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/tool/GoogleMapTools.js");

/**
 * When this button is selected, click on the map to zoom out centered at the click.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function GoogleMapZoomOut(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Calls the centerAt method of the context doc to zoom out, recentering at
   * the mouse event coordinates.
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
      bbox = objRef.targetModel.getParam("aoi");
      if ( bbox!=null) {
        extent = objRef.targetModel.extent;
        ul=bbox[0];
        lr=bbox[1];
        mid=new Array((ul[0]+lr[0])/2,(ul[1]+ul[1])/2);
        objRef.googleMapTools.zoomTo(objRef.targetModel,mid,-1);
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
