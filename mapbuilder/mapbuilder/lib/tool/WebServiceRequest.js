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
function WebServiceRequest(model, styleUrl) {
  this.model = model;
  this.stylesheet = new XslProcessor(styleUrl);
  this.requestName = this.model.modelNode.nodeName;


  /**
   * Listener function which will issue the request
   * @param objRef Pointer to this tool object.
   */
  this.loadFeature = function(objRef, feature) {
    var model = feature[objRef.requestName];
    if (!model) {
      model = objRef.model.parentModel.featureList.appendModel(objRef.model.modelNode, feature);
    }
    objRef.issueRequest(model);
  }
  if (this.model.template) {
    this.model.modelNode.removeAttribute("id");
    this.model.parentModel.addListener(this.requestName, this.loadFeature, this);
  }

  /**
   * Render the widget.  Equivalent function to paint.
   * @param objRef Pointer to this object.
   */
  this.issueRequest = function(targetModel) {
    //confirm inputs
    if (this.debug) alert("source:"+targetModel.featureNode.xml);
    //if (this.debug) alert("stylesheet:"+this.stylesheet.xslDom.xml);

    //process the doc with the stylesheet
    var httpPayload = new Object();
    httpPayload.method = targetModel.method;
    this.stylesheet.setParameter("httpMethod", httpPayload.method );
    if (targetModel.containerModel) {
      var bBox = targetModel.containerModel.getBoundingBox();
      var bboxStr = bBox[0]+","+bBox[1]+","+bBox[2]+","+bBox[3];
      this.stylesheet.setParameter("bbox", bboxStr );
    }
    httpPayload.postData = this.stylesheet.transformNodeToObject(targetModel.featureNode);
    if (this.debug) alert("request data:"+httpPayload.postData.xml);
    httpPayload.url = this.model.parentModel.getServerUrl(targetModel.featureNode, this.requestName);
    if (httpPayload.method.toLowerCase() == "get") {
      var queryString = httpPayload.postData.selectSingleNode("//QueryString");
      if (httpPayload.url.indexOf("?") < 0) httpPayload.url += "?";
      httpPayload.url += queryString.firstChild.nodeValue;
      httpPayload.postData = null;
    }
    
    targetModel.setParam("httpPayload", httpPayload);
  }

}
