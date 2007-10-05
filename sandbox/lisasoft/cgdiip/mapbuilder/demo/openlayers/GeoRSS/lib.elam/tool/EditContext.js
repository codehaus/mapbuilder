/*
Author:       Mike Adair  mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: EditContext.js 2546 2007-01-23 12:07:39Z gjvoosten $
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
  ToolBase.apply(this, new Array(toolNode, model));

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
   * @param featureName the name of the feature to be added
   */
  this.addNodeToModel = function(featureName) {
    var feature = this.model.getFeatureNode(featureName);
    this.stylesheet.setParameter("version", this.model.getVersion() );
    this.stylesheet.setParameter("serverUrl", this.model.getServerUrl("GetMap","get") );
    this.stylesheet.setParameter("serverTitle", this.model.getServerTitle() );
    this.stylesheet.setParameter("serviceName", "wms");//this.model.getServiceName() );
    this.stylesheet.setParameter("format", this.model.getImageFormat() );
    var newNode = this.stylesheet.transformNodeToObject(feature);
    Sarissa.setXpathNamespaces(newNode, this.targetModel.namespace);
    mbDebugMessage(this, newNode.xml);
    this.targetModel.setParam('addLayer',newNode.documentElement);
  }

  /**
   * Adds a new layer to the end of the context document
   * @param featureName the name of the feature to be added
   */
  this.addLayerFromCat = function(featureName) {
    var feature = this.model.getFeatureNode(featureName);
    var newNode = this.stylesheet.transformNodeToObject(feature);
    Sarissa.setXpathNamespaces(newNode, this.targetModel.namespace);
    mbDebugMessage(this, newNode.xml);
    this.targetModel.setParam('addLayer',newNode.documentElement);
  }

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
