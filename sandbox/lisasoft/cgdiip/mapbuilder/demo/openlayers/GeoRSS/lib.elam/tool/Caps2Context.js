/*
Author:   
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: Caps2Context.js 3091 2007-08-09 12:21:54Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**

 * Build a Web Map Context (WMC) from a Web Map Server getCapabilities response.

 * This tool will replace the identified targetModel as opposed to editing

 * the target model which the EditContext tool will do. 

 * @constructor

 * @base ToolBase

 * @param toolNode The tools's XML object node from the configuration document.

 * @param model    The model that this tool belongs to

 */

function Caps2Context(toolNode, model) {

  ToolBase.apply(this, new Array(toolNode, model));

  

  var styleUrl = baseDir+"/tool/xsl/Caps2Context.xsl";

  this.stylesheet = new XslProcessor(styleUrl,model.namespace);



  // Set stylesheet parameters for all the child nodes from the config file

  for (var j=0;j<toolNode.childNodes.length;j++) {

    if (toolNode.childNodes[j].firstChild && toolNode.childNodes[j].firstChild.nodeValue) {

      this.stylesheet.setParameter(toolNode.childNodes[j].nodeName,toolNode.childNodes[j].firstChild.nodeValue);

    }

  }



  /**

   * Listener function which does the transformation and loads the target model

   * @param requestName the name of the web service operation to execute

   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet

   */

  this.mapAllLayers = function(objRef) {

    objRef.stylesheet.setParameter("selectedLayer",'');

    var newContext = objRef.stylesheet.transformNodeToObject(objRef.model.doc);

    objRef.targetModel.setParam("newModel", null);

    objRef.targetModel.url = '';

    objRef.targetModel.doc = newContext;

    objRef.targetModel.finishLoading();

  }

  this.model.addListener("mapAllLayers", this.mapAllLayers, this);



  /**

   * Listener function which does the transformation and loads the target model.

   * this wersion will convert a single layer from the Capabilities doc into a

   * context doc.

   * @param requestName the name of the web service operation to execute

   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet

   */

  this.mapSingleLayer = function(objRef, layerName) {

    objRef.stylesheet.setParameter("selectedLayer",layerName);

    var newContext = objRef.stylesheet.transformNodeToObject(objRef.model.doc);

    objRef.targetModel.setParam("newModel", null);

    objRef.targetModel.url = '';

    objRef.targetModel.doc = newContext;

    objRef.targetModel.finishLoading();

  }

  this.model.addListener("mapLayer", this.mapSingleLayer, this);



}

