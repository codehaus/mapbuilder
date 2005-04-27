/*
Author:       Tom Kralidis
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display a list of resources in a context doc to be selected for use
 * as input to another form.
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */


function ResourceDropDown(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  /**
   * Change the AOI coordinates from select box choice of prefined locations
   * @param bbox the bbox value of the location keyword chosen
   */

  this.selectResource = function(selectedOption) {
    if (selectedOption.value.length>0) {
      var httpPayload = null;
      var feature = this.model.getFeatureNode(selectedOption.value);
      var resourceType = selectedOption.getAttribute("resourceType");
      switch(resourceType) {
        case "OGC:WFS":
          httpPayload = config.objects.wfsController.createHttpPayload(feature);//TBD: remove hard-coded ID
          break;
        case "OGC:WCS":
          httpPayload = config.objects.wcsController.createHttpPayload(feature);//TBD: remove hard-coded ID
          break;
        case "wms":
          alert("not implemented yet; this will populate the URI input box with the URI to:"+featureName);
          break;
        case "OGC:GML":
          httpPayload = new Object();
          httpPayload.url = feature.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href").nodeValue;
          break;
      }
      this.targetInput.value = httpPayload.url;
    }
  }

  this.setTargetListener = function(objRef) {
    objRef.targetModel.addListener("refresh",objRef.paint,objRef);
  }
  this.model.addListener("loadModel",this.setTargetListener,this);
}
