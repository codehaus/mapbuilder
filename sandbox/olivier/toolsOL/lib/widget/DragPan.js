/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: DragPan.js 1671 2005-09-20 02:37:54Z madair1 $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode  The widget node from the Config XML file.
 * @param model  The parent model for this widget
 */
function DragPan(widgetNode, model) {

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
    if (objRef.enabled) {
      var bbox = objRef.targetModel.getParam("aoi");
      if ( bbox!=null) {
      

        var ul = bbox[0];
        var lr = bbox[1];
         center=new Array((lr[0]+ul[0])/2,(ul[1]+lr[1])/2);
        objRef.targetModel.extent.centerAt(center,0);
       // objRef.targetModel.setParam("zoomToBbox",new Array(ul[0],lr[1],lr[0],ul[1]));
      }
    }
  }

  /**
   * Register for mouseUp events.
   * @param objRef      Pointer to this DragPan object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.model.addListener('mouseup',objRef.doAction,objRef);
    }
  }
  this.model.addListener( "refresh", this.setMouseListener, this );

}
