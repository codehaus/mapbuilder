/*
Author:       Mike Adair  mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
//mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget which generates a WFS query from it's parent document
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GetFeatureRequest(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);


  this.paint = function() {
    //no-op
  }
  //this.model.addListener("loadModel",this.paint, this);

  /**
   * Render the widget.
   * @param objRef Pointer to this object.
   */
  this.createQuery = function(model) {
    if (model.sourceNode) {
      var feature = model.sourceNode;
      //confirm inputs
      if (this.debug) alert("source:"+feature.xml);
      if (this.debug) alert("stylesheet:"+this.stylesheet.xslDom.xml);

      //process the doc with the stylesheet
      var httpPayload = new Object();
      httpPayload.postData = this.stylesheet.transformNodeToObject(feature);
      httpPayload.url = this.model.getServerUrl(feature);
      httpPayload.method = "post";//this.model.getMethod(feature);
      model.setParam("httpPayload", httpPayload);
      if (this.debug) alert("result:"+model.postData.xml);
    }
  }
}
