/**

 * Build a Web Map Context (WMC) from a Web Map Server getCapabilities response.

 * @constructor

 * @param url TBD Comment me.

 * @param node TBD Comment me.

 */

function Caps2Context(toolNode, model) {

  var base = new ToolBase(this, toolNode, model);

  

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

  this.doRequest = function(objRef) {

    var newContext = objRef.stylesheet.transformNodeToObject(objRef.model.doc);

    newContext.setProperty("SelectionLanguage", "XPath");

    if (objRef.targetModel.namespace) Sarissa.setXpathNamespaces(newContext, objRef.targetModel.namespace);

    objRef.targetModel.url = '';

    objRef.targetModel.doc = newContext;

    objRef.targetModel.callListeners("loadModel");

    objRef.targetModel.callListeners("refresh");

  }

  this.model.addListener("loadModel", this.doRequest, this);



}

