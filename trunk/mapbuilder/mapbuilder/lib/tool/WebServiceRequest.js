/*
Author:       Mike Adair  mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * A controller for manipulating a Model's list of models for append/delete/update
 * The list of models is driven by a set of nodes selected from the parent model doc.
 * @constructor
 * @param toolNode      The tools's XML object node from the configuration document.
 * @param model  The widget that this tool belongs to
 */
function WebServiceRequest(toolNode, model) {
  var base = new ToolBase(this, toolNode, model);
  
  //get the request name to add listener to
  var requestName = toolNode.selectSingleNode("mb:requestName");
  if (requestName) {
    this.requestName = requestName.firstChild.nodeValue;
  }

  /**
   * Listener function which will issue the request
   * @param requestName the name of the web service operation to execute
   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
   */
  this.doRequest = function(objRef, featureName) {
    var feature = objRef.model.getFeatureNode(featureName);

    if (objRef.targetModel.template) {
      objRef.targetModel.modelNode.removeAttribute("id");
      objRef.targetModel = objRef.model.createObject(objRef.targetModel.modelNode, objRef.model.models);
    }
    objRef.targetModel.featureName = featureName;

    var styleUrl = baseDir+"/tool/xsl/"+objRef.requestName.replace(/:/,"_")+".xsl";
    var requestStylesheet = new XslProcessor(styleUrl);

    //confirm inputs
    if (objRef.debug) alert("source:"+feature.xml);
    //if (objRef.debug) alert("stylesheet:"+requestStylesheet.xslDom.xml);

    //process the doc with the stylesheet
    var httpPayload = new Object();
    httpPayload.method = objRef.targetModel.method;
    requestStylesheet.setParameter("httpMethod", httpPayload.method );

    if (objRef.targetModel.containerModel) {
      var bBox = objRef.targetModel.containerModel.getBoundingBox();
      var bboxStr = bBox[0]+","+bBox[1]+","+bBox[2]+","+bBox[3];
      requestStylesheet.setParameter("bbox", bboxStr );
      requestStylesheet.setParameter("srs", objRef.targetModel.containerModel.getSRS() );
      requestStylesheet.setParameter("width", objRef.targetModel.containerModel.getWindowWidth() );
      requestStylesheet.setParameter("height", objRef.targetModel.containerModel.getWindowHeight() );
      requestStylesheet.setParameter("version", objRef.model.getVersion(feature) );
    }

    httpPayload.postData = requestStylesheet.transformNodeToObject(feature);
    alert("request data:"+httpPayload.postData.xml);

    if (objRef.serverUrl) {
      httpPayload.url = objRef.serverUrl;
    } else {
      httpPayload.url = objRef.model.getServerUrl(objRef.requestName, httpPayload.method, feature);
    }

    if (httpPayload.method.toLowerCase() == "get") {
      var queryString = httpPayload.postData.selectSingleNode("//QueryString");
      if (httpPayload.url.indexOf("?") < 0) httpPayload.url += "?";
      httpPayload.url += queryString.firstChild.nodeValue;
      httpPayload.postData = null;
    }
    
    objRef.targetModel.setParam("httpPayload", httpPayload);
  }
  this.model.addListener(this.requestName.replace(/:/,"_"), this.doRequest, this);
}
