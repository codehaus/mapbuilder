/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Model that allows to merge multiple models into one. The first model
 * determines the root node, other models are appended within the same
 * root node.
 * @constructor
 * @base ModelBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param modelNode The model's XML object node from the configuration document
 * @param parent Parent of this model, set to null if there is no parent.
 */
function MergeModel(modelNode, parent) {
  var listener = Listener.prototype;
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));
  
  this.models = new Array();

  this.init = function(objRef) {
    var models = modelNode.selectSingleNode('mb:merges');
    if (models) {
      var model = models.childNodes;
      for (var i = 0; i < model.length; i++) {
        if (model[i].firstChild) {
          objRef.addModel(objRef, config.objects[model[i].firstChild.nodeValue]);
        }
      }
    }
  }
  this.addListener('init', this.init, this);

  this.addModel = function(objRef, model) {
    objRef.models.push(model);
    if (model.doc) {
      objRef.mergeModel(objRef, model.doc);
    }
    model.addListener('refresh', objRef.buildModel, objRef);
  }
  
  this.mergeModel = function(objRef, modelToMerge) {
    var docToMerge = modelToMerge.doc;
    if (!docToMerge) return;
    if (!objRef.doc) {
      objRef.doc = docToMerge.cloneNode(true);
    } else {
      Sarissa.copyChildNodes(docToMerge.documentElement, objRef.doc.documentElement, true);
    }
  }
  
  this.buildModel = function(objRef) {
    objRef.callListeners('newModel');
    objRef.doc = null;
    for (var i in objRef.models) {
      objRef.mergeModel(objRef, objRef.models[i]);
    }
    objRef.callListeners('loadModel');
  }
  
  this.CLASS_NAME = 'MergeModel';
}
