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
 * @param parentWidget  The widget that this tool belongs to
 */
function ModelList(model) {
  this.model = model;            //.model is the parent model, eg. WFS caps doc
  this.id = model.id + "_ModelList";

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.getFeatureNode = function(id) {
    return this.model.doc.selectSingleNode(this.model.nodeSelectXpath+"[@id='"+id+"']");
  }

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.getFeatureList = function() {
    return this.model.doc.selectNodes(this.model.nodeSelectXpath);
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
      feature.setAttribute("select", "true");
    }
  }
  this.model.addListener("loadModel", this.initFeatureList, this);

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.refreshDynModelList = function(objRef) {
    var featureList = objRef.getFeatureList();
    for (var i=0; i<featureList.length; i++) {
      var feature = featureList[i];
      objRef.model.setParam("loadFeature", feature);
    }
  }
  this.model.addListener("refresh", this.refreshDynModelList, this);

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
      model.featureNode=featureNode;
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
