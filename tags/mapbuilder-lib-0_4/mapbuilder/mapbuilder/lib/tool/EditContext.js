/*
Author:       Mike Adair  mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Tool which manipulates the Layer list of a Web Map Context document.
 * @constructor
 * @base ToolBase
 * @param toolNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function EditContext(toolNode, model) {
  var base = new ToolBase(this, toolNode, model);

  var styleUrl = baseDir+"/tool/xsl/wmc_AddResource.xsl";   //TBD figure out a way to set this for other operations
  this.stylesheet = new XslProcessor(styleUrl);

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<toolNode.childNodes.length;j++) {
    if (toolNode.childNodes[j].firstChild && toolNode.childNodes[j].firstChild.nodeValue) {
      this.stylesheet.setParameter(toolNode.childNodes[j].nodeName,toolNode.childNodes[j].firstChild.nodeValue);
    }
  }

  /**
   * Adds a new layer to the end of the context document
   * @param objRef Pointer to this object.
   */
  this.addNodeToModel = function(objRef, featureName) {
    var feature = objRef.model.getFeatureNode(featureName);
    objRef.stylesheet.setParameter("version", objRef.model.getVersion() );
    objRef.stylesheet.setParameter("serverUrl", objRef.model.getServerUrl("GetMap","get") );
    objRef.stylesheet.setParameter("serverTitle", objRef.model.getServerTitle() );
    objRef.stylesheet.setParameter("serviceName", "wms");//objRef.model.getServiceName() );
    var newNode = objRef.stylesheet.transformNodeToObject(feature);
    if (objRef.debug) alert(newNode.xml);
    objRef.targetModel.addLayer(newNode.documentElement);
  }
  this.model.addListener("mapLayer", this.addNodeToModel, this);

  /**
   * Reorders layers in the context document
   * @param objRef Pointer to this object.
   */
  this.moveNode = function(objRef, featureName) {
    //TBD
  }
  this.model.addListener("MoveNode", this.addNodeToModel, this);

  /**
   * Deletes layers from a context doc
   * @param objRef Pointer to this object.
   */
  this.deleteNode = function(objRef, featureName) {
    //TBD
  }
  this.model.addListener("DeleteNode", this.addNodeToModel, this);

}
