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
  this.modelArray = new Array();                  //.models is an array of the dynamic models created
  //TBD: actually insert Model nodes for these in the config.doc
  this.id = model.id + "_ModelList";


  /**
   * appends a new instance of a model to the model list
   * @param objRef Pointer to this object.
   */
  this.appendModel = function(targetModelNode, featureNode) {
    var evalStr = "new " + targetModelNode.nodeName + "(targetModelNode,this.model);";
    var model = eval( evalStr );
    if ( model ) {
      this.modelArray.push(model);

      featureNode.modelId = model.id;
      model.featureNode=featureNode;
      //call the loadModel event
      //model.callListeners("loadModel");
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
