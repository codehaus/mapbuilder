/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomIn.js 1671 2005-09-20 02:37:54Z madair1 $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/tool/GmapTools.js");

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function GmapZoomIn(widgetNode, model) {
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
          //extent.centerAt( ul, extent.res[0]/objRef.zoomBy );
          alert("GmapZoomIn: TBD");
        } else {
          extent.zoomToBox( ul, lr );
          gmapTools(objRef.model,lr[0],ul[1],ul[0],lr[1]);
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
    // Create a gmapTools instance
    if(!objRef.gmapTools){
      objRef.gmapTools=new GMapTools();
    }
  }
  this.model.addListener( "loadModel", this.setMouseListener, this );

}

