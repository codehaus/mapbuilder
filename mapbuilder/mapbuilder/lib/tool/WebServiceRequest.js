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
  
  //get the xpath to select nodes from the parent doc
  var nodeSelectXpath = toolNode.selectSingleNode("mb:nodeSelectXpath");
  if (nodeSelectXpath) {
    this.nodeSelectXpath = nodeSelectXpath.firstChild.nodeValue;
  }

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.getFeatureNode = function(id) {
    return this.model.doc.selectSingleNode(this.nodeSelectXpath+"[@id='"+id+"']");
  }

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.getFeatureList = function() {
    return this.model.doc.selectNodes(this.nodeSelectXpath);
  }

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.initFeatureList = function(objRef) {
    var featureList = objRef.getFeatureList();
    for (var i=0; i<featureList.length; i++) {
      var feature = featureList[i];
      feature.setAttribute("id", "MbFeatureNode_" + mbIds.getId());
      //feature.setAttribute("select", "true");
    }
  }
  this.model.addListener("loadModel", this.initFeatureList, this);

  /**
   * Listener function which will issue the request
   * @param requestName the name of the web service operation to execute
   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
   */
  this.doRequest = function(requestName, featureNodeId, serverUrl) {
    var feature = this.getFeatureNode(featureNodeId);

    var targetModelProperty = this.toolNode.selectSingleNode("mb:targetModel[@request='"+requestName+"']");
    if (targetModelProperty) {
      var targetModelId = targetModelProperty.firstChild.nodeValue;
      var targetModel = config[targetModelId];
      if (targetModel.template) {
        targetModel.modelNode.removeAttribute("id");
        targetModel = this.appendModel(targetModel.modelNode, feature);
      }
    } else {
      alert("unable to locate targetModel for web service request:" + requestName);
      return;
    }

    var styleUrl = baseDir+"/tool/xsl/"+requestName.replace(/:/,"_")+".xsl";
    var requestStylesheet = new XslProcessor(styleUrl);

    //confirm inputs
    if (this.debug) alert("source:"+feature.xml);
    //if (this.debug) alert("stylesheet:"+requestStylesheet.xslDom.xml);

    //process the doc with the stylesheet
    var httpPayload = new Object();
    httpPayload.method = targetModel.method;
    requestStylesheet.setParameter("httpMethod", httpPayload.method );
    if (targetModel.containerModel) {
      var bBox = targetModel.containerModel.getBoundingBox();
      var bboxStr = bBox[0]+","+bBox[1]+","+bBox[2]+","+bBox[3];
      requestStylesheet.setParameter("bbox", bboxStr );
    }
    httpPayload.postData = requestStylesheet.transformNodeToObject(feature);
    if (this.debug) alert("request data:"+httpPayload.postData.xml);
alert("request data:"+httpPayload.postData.xml);
    if (serverUrl) {
      httpPayload.url = serverUrl;
    } else {
      httpPayload.url = this.model.getServerUrl(requestName, httpPayload.method);
    }
    if (httpPayload.method.toLowerCase() == "get") {
      var queryString = httpPayload.postData.selectSingleNode("//QueryString");
      if (httpPayload.url.indexOf("?") < 0) httpPayload.url += "?";
      httpPayload.url += queryString.firstChild.nodeValue;
      httpPayload.postData = null;
    }
    
    targetModel.setParam("httpPayload", httpPayload);
  }

  /**
   * appends a new instance of a model to the model list
   * @param objRef Pointer to this object.
   */
  this.appendModel = function(targetModelNode, featureNode) {
    var evalStr = "new " + targetModelNode.nodeName + "(targetModelNode,this.model);";
    var model = eval( evalStr );
    if ( model ) {
      this.model[model.id] = model;
      config[model.id] = model;
      featureNode[targetModelNode.nodeName] = model;
      return model;
    } else { 
      alert("ModelList: error creating dynamic model object:" + targetModelNode.nodeName);
    }
  }

  /**
   * loads an instance of the targetModel model with the document
   * @param objRef Pointer to this object.
   */
  this.updateModel = function(model) {
  }

  /**
   * removes an instance of the targetModel model from the list
   * @param objRef Pointer to this object.
   */
  this.deleteModel = function(objRef, modelId, feature) {
  }

  
}
