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
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function ModelList(toolNode, parentWidget) {
  this.parentWidget = parentWidget;
  this.toolNode = toolNode;
  this.model = parentWidget.model;            //.model is the parent model, eg. WFS caps doc
  this.targetModel = parentWidget.targetModel;//.targetModel is a template for creating new models
  this.models = new Array();                  //.models is an array of the dynamic models created
                                              //TBD: actually insert Model nodes for these in the config.doc

  //get the xpath to select nodes from the parent doc
  var nodeSelectXpath = toolNode.selectSingleNode("mb:nodeSelectXpath");
  if (nodeSelectXpath) {
    this.nodeSelectXpath = nodeSelectXpath.firstChild.nodeValue;
  } else {
    alert("no nodeSelectXpath");
  }

  //
  this.targetModelNode = this.parentWidget.model.modelNode.selectSingleNode("//mb:*[@id='"+this.targetModel+"']");

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.initModelList = function(tool) {
    var featureList = tool.model.getFeatureList(tool.nodeSelectXpath);
    for (var i=0; i<featureList.length; i++) {
      var sourceNode = featureList[i];
      tool.appendModel(sourceNode);
    }
  }
  this.model.addListener("loadModel", this.initModelList, this);

  /**
   * loads an instance of the targetModel model with the document
   * @param objRef Pointer to this object.
   */
  this.updateModel = function(tool) {
    tool.parentWidget.createQuery(feature);
      model.url=this.model.getServerUrl(sourceNode);
      model.method=this.model.getHttpMethod(sourceNode);
      model.postData=null;
    serverUrl = model.url
    postData = model.postData
    model.loadModelDoc(serverUrl,postData);
    alert("loaded:"+model.doc.xml);
    model.callListeners("loadModel");
  }

  /**
   * appends a new instance of the targetModel model to the list
   * @param objRef Pointer to this object.
   */
  this.appendModel = function(sourceNode) {
    var evalStr = "new " + this.targetModelNode.nodeName + "(sourceNode);";
    var model = eval( evalStr );
    if ( model ) {
alert("appending:"+evalStr+":"+model.id);
      this.model[model.id] = model;
      this.models.push(model);
    } else { 
      alert("ModelList: error creating dynamic model object:" + tool.targetModelNode.nodeName);
    }

    //add listeners for this new model instance
    model.addListener("paint", this.updateModel, model);
  }

  /**
   * removes an instance of the targetModel model from the list
   * @param objRef Pointer to this object.
   */
  this.deleteModel = function(objRef, modelId, feature) {
  }

  
}
