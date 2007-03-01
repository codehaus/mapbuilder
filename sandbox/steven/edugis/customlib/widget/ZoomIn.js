/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomIn.js,v 1.7 2005/09/20 02:37:54 madair1 Exp $
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

  this.zoomBy = 2;//TBD: get this from config

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
				
				if(extent.res[0] < 1) {
					objRef.targetModel.setParam("bbox");
					alert("U kunt niet verder inzoomen");
					}
				else {
				  if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
						extent.centerAt( ul, extent.res[0]/objRef.zoomBy );
					} 
					else {
					if (lr[0]-ul[0]<100 || ul[1]-lr[1]<100) {
					objRef.targetModel.setParam("bbox");
					alert("Het gesleepte rechthoek is te klein om op in te zoomen.");
					}
				    else { extent.zoomToBox( ul, lr );}
					}
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
  }
  this.model.addListener( "loadModel", this.setMouseListener, this );

}

