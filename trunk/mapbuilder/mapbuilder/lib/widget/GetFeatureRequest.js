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

  //get the xpath to select nodes from the parent doc
  var nodeSelectXpath = widgetNode.selectSingleNode("mb:nodeSelectXpath");
  if (nodeSelectXpath) {
    this.nodeSelectXpath = nodeSelectXpath.firstChild.nodeValue;
  } else {
    this.nodeSelectXpath = "/";   //use the root element of the document by default
  }

  //
  this.targetModelNode = config.modelNode.selectSingleNode("//mb:*[@id='"+this.targetModel.id+"']");
  this.targetModelNode.removeAttribute("template");
  this.targetModelNode.removeAttribute("id");

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.initDynModelList = function(objRef) {
    var featureList = objRef.model.getFeatureList(objRef.nodeSelectXpath);
    for (var i=0; i<featureList.length; i++) {
      var feature = featureList[i];

      //assign an id to the model created so it can be tied to the source node
      if (feature.attributes.getNamedItem("id")) {
      } else {
        feature.setAttribute("id", "MbDynModel_" + mbIds.getId());
      }

      objRef.model.models.appendModel(objRef.targetModelNode, feature);
    }
  }
  this.model.addListener("loadModel", this.initDynModelList, this);

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.refreshDynModelList = function(objRef) {
    for (var i=0; i<objRef.model.models.modelArray.length; i++) {
      var model = objRef.model.models.modelArray[i];
      objRef.paint(model);  
    }
  }
  this.model.addListener("refresh", this.refreshDynModelList, this);

  /**
   * Render the widget.  Equivalent function to paint.
   * @param objRef Pointer to this object.
   */
  this.paint = function(targetModel) {
    //confirm inputs
    if (this.debug) alert("source:"+targetModel.featureNode.xml);
    if (this.debug) alert("stylesheet:"+this.stylesheet.xslDom.xml);

    //process the doc with the stylesheet
    var httpPayload = new Object();
    httpPayload.postData = this.stylesheet.transformNodeToObject(targetModel.featureNode);
    if (this.debug) alert("postData:"+httpPayload.postData.xml);
    httpPayload.url = this.model.getServerUrl(targetModel.featureNode);
    httpPayload.method = "post";//this.model.getMethod(targetModel.featureNode);
    
    targetModel.setParam("httpPayload", httpPayload);
  }

}
