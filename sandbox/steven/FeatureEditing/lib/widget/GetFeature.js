/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: GetFeature.js 2133 2006-06-22 15:28:52Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, click on a feature in the (WMS) map to 
 * send a WFS GetFeature REquest and request it as GML.
 * @constructor
 * @base ButtonBase
 * @author Steven Ottens steven.ottensATgeodan.nl
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function GetFeature(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
	this.cursor = "crosshair";	

	//Get the different models from the config file
   this.tc=widgetNode.selectSingleNode("mb:targetContext").firstChild.nodeValue;

  /**
   * Get the coordinates of the point and transform it to a small bounding box
   * TBD: 
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
    	if (!objRef.targetContext){
        objRef.targetContext=window.config.objects[objRef.tc];
      }
      //Create a small aoi of 10pixels around the mouseclick
      var evplul = targetNode.evpl;
      var evpllr = targetNode.evpl;
      evplul[0] = parseInt(evplul[0]) - 5;
      evplul[1] = parseInt(evplul[1]) - 5;
      var pointUl =objRef.mouseHandler.model.extent.getXY(evplul);
 			evpllr[0] = parseInt(evpllr[0]) + 5;
      evpllr[1] = parseInt(evpllr[1]) + 5;
      var pointLr =objRef.mouseHandler.model.extent.getXY(evpllr);

			//make sure we are posting a getFeature Request
      objRef.targetModel.method = "post";
      objRef.targetContext.setParam("aoi",new Array(pointUl,pointLr));
      
      //Use webservice form to do the actual request
      config.objects.webServiceForm.submitForm();
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
