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
    model.addListener('loadModel', objRef.buildModel, objRef);
  }
  
  this.mergeModel = function(objRef, docToMerge) {
    if (!docToMerge) return;
    objRef.callListeners('newModel');
    if (!objRef.doc) {
      objRef.doc = docToMerge.cloneNode(docToMerge.documentElement);
    } else {
      var nodes = docToMerge.documentElement.childNodes;
      for (var i = 0; i < nodes.length; i++) {
        objRef.doc.documentElement.appendChild(nodes[i]);
      }
    }
  }
  
  this.buildModel = function(objRef) {
    for (var i in objRef.models) {
      objRef.mergeModel(objRef, objRef.models[i].doc);
    }
    objRef.callListeners('loadModel');
    objRef.callListeners('refresh');
  }
  
  this.updateEvents = function(objRef) {
    objRef.listeners = new Array();
    var listeners;
    for (var i in objRef.models) {
      listeners = objRef.models[i].listeners;
      for (var param in listeners) {
        for (var j in listeners[param]) {
          objRef.addListener(param, listeners[param][j][0], listeners[param][j][1]);
        }
      }
    }
  }

  this.CLASS_NAME = 'MergeModel';
}
