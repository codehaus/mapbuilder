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
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GetFeatureRequest(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  //
  this.targetModelNode = config.modelNode.selectSingleNode("//mb:*[@id='"+this.targetModel.id+"']");
  this.targetModelNode.removeAttribute("template");
  this.targetModelNode.removeAttribute("id");

  /**
   * Render the widget.  Equivalent function to paint.
   * @param objRef Pointer to this object.
   */
  this.loadFeature = function(objRef, feature) {
    var model = feature[objRef.targetModelNode.nodeName];
    if (!model) {
      model = objRef.model.featureList.appendModel(objRef.targetModelNode, feature);
    }
    objRef.issueRequest(model);
  }
  this.model.addListener("GetFeature", this.loadFeature, this);

  /**
   * Render the widget.  Equivalent function to paint.
   * @param objRef Pointer to this object.
   */
  this.issueRequest = function(targetModel) {
    //confirm inputs
    if (this.debug) alert("source:"+targetModel.featureNode.xml);
    if (this.debug) alert("stylesheet:"+this.stylesheet.xslDom.xml);

    //process the doc with the stylesheet
    var httpPayload = new Object();
    httpPayload.postData = this.stylesheet.transformNodeToObject(targetModel.featureNode);
    if (this.debug) alert("postData:"+httpPayload.postData.xml);
    httpPayload.url = this.model.getServerUrl(targetModel.featureNode, "GetFeature");
    httpPayload.method = "post";//this.model.getMethod(targetModel.featureNode);
    
    targetModel.setParam("httpPayload", httpPayload);
  }

}
