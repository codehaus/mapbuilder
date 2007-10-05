/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: MergeModels.js 3091 2007-08-09 12:21:54Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Model that allows to merge multiple models into one. The first model
 * determines the root node, other models are appended within the same
 * root node.
 * @constructor
 * @base ToolBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param modelNode The model's XML object node from the configuration document
 * @param model model this tool belongs to.
 */
function MergeModels(toolNode, model) {
  // Inherit the ModelBase functions and parameters
  ToolBase.apply(this, new Array(toolNode, model));
  
  this.template = null;

  this.init = function(objRef) {
    objRef.model.mergeModels = new Array();
    var models = toolNode.selectSingleNode('mb:merges');
    if (models) {
      var model = models.childNodes;
      for (var i = 0; i < model.length; i++) {
        if (model[i].firstChild) {
          objRef.addModel(objRef, config.objects[model[i].firstChild.nodeValue]);
        }
      }
    }
  }
  // it is important to be registered before other tools that
  // check for model.mergeModels
  model.addListener('init', this.init, this);
  
  this.getTemplate = function(objRef) {
    objRef.template = objRef.model.doc ? objRef.model.doc.cloneNode(true) : null;
    if (objRef.template) {
      objRef.model.removeListener('loadModel', objRef.getTemplate, objRef);
      objRef.buildModel(objRef);
    }
  }
  model.addListener('loadModel', this.getTemplate, this);

  this.addModel = function(objRef, model) {
    objRef.model.mergeModels.push(model);
    if (model.doc) {
      objRef.mergeModel(objRef, model.doc);
    }
    model.addListener('refresh', objRef.buildModel, objRef);
  }
  
  this.mergeModel = function(objRef, modelToMerge) {
    var docToMerge = modelToMerge.doc ? modelToMerge.doc.cloneNode(true) : null;
    var nodes = docToMerge ? docToMerge.selectNodes('//*[@fid]') : null;
    if (!nodes) return;
    var node;
    for (var i=0; i<nodes.length; i++) {
      node = nodes[i];
      if (node.nodeName) {
        node.setAttribute('sourceModel', modelToMerge.id);
      }
    }    
    Sarissa.copyChildNodes(docToMerge.documentElement, objRef.model.doc.documentElement, true);
  }
  
  this.buildModel = function(objRef) {
    if (!objRef.template) return;
    objRef.model.callListeners('newModel');
    objRef.model.doc = objRef.template.cloneNode(true);
    for (var i in objRef.model.mergeModels) {
      objRef.mergeModel(objRef, objRef.model.mergeModels[i]);
    }
    objRef.model.callListeners('loadModel');
  }
}
