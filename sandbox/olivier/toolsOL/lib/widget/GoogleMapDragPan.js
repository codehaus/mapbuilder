/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: GoogleMapDragPan.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/tool/GoogleMapTools.js");


/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode  The widget node from the Config XML file.
 * @param model  The parent model for this widget
 */
function GoogleMapDragPan(widgetNode, model) {

  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "move";	

  /**
   * Calls the centerAt method of the context doc extent to recenter to its AOI
   * @param objRef      Pointer to this DragPan object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (!objRef.enabled) return;
    var bbox = objRef.targetModel.getParam("aoi");
    //objRef.googleMapTools.zoomTo(objRef.targetModel,ul,-1);
    mid= new Array((bbox[0][0]+bbox[1][0])/2,(bbox[0][1]+bbox[1][1])/2);
    objRef.googleMapTools.zoomTo(objRef.targetModel,mid,0);
  }

  /**
   * Register for mouseUp events.
   * @param objRef      Pointer to this DragPan object.
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
