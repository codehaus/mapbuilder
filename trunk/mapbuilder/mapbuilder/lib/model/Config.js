/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Config
 * This Javascript file must be included in the page <HEAD> element.
 * The application creates a global object called mbConfig from the mapbuilder 
 * configuration xml file passed in as a parameter.
 *
 * @constructor
 * @author adair
 * @requires Sarissa
 * @param url URL of the configuration file.
 */
function Config(url) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this);
  this.namespace = "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'";

  this.url = url;
  this.loadModelDoc(this);
  this.modelNode = this.doc.documentElement;
  this.id = this.modelNode.attributes.getNamedItem("id").nodeValue;

  //set some global application properties
  this.skinDir = this.modelNode.selectSingleNode("mb:skinDir").firstChild.nodeValue;
  var proxyUrl = this.modelNode.selectSingleNode("mb:proxyUrl");
  if (proxyUrl) this.proxyUrl = proxyUrl.firstChild.nodeValue;

  /**
   * Internal function to load scripts for components that don't have <scriptfile>
   * specified in the config file.
   * @param xPath Xpath match of components from the Config file.
   * @param dir The directory the script is located in.
   */
  this.loadScriptsFromXpath=function(xPath,dir) {
    var nodes = this.doc.selectNodes(xPath);
    for (var i=0; i<nodes.length; i++) {
      if (nodes[i].selectSingleNode("mb:scriptFile")==null){
        scriptFile = baseDir+"/"+dir+nodes[i].nodeName+".js";
        mapbuilder.loadScript(scriptFile);
      }
    }
  }

  /**
   * Loads the scripts defined in the Config file.
   */
  this.loadConfigScripts=function(){
    // Load script files for all components that don't have <scriptfile> specified
    // in the config file.
    this.loadScriptsFromXpath("//mb:models/*","model/");
    this.loadScriptsFromXpath("//mb:widgets/*","widget/");
    this.loadScriptsFromXpath("//mb:tools/*","tool/");

    //TBD: Deprecate the following block and move into loadScriptsFromXpath instead.
    //load all scriptfiles called for in the config file.  There seems to be a 
    //problem if this is done anywhere except in the page <HEAD> element.
    var scriptFileNodes = this.doc.selectNodes("//mb:scriptFile");
    for (var i=0; i<scriptFileNodes.length; i++ ) {
      scriptFile = baseDir+"/"+scriptFileNodes[i].firstChild.nodeValue;
      mapbuilder.loadScript(scriptFile);
    }
  }

  /**
  * @function init
  *
  * Main initialization method for mapbuilder applications.  
  * This method calls the loadModel method for all models included in the config
  * file a store them as a property of the config object using the model ID as
  * the property name.  This means that the model object can then be referenced 
  * as in config["modelId"] in subsequent javascript code.
  */
  this.init = function() {
    this.cgiArgs = getArgs();

    //language to select; defaults to english 
    //Set via a "language" parameter in the URL, 
    //or by setting a global "language" Javascript variable in the page <HEAD>
    //Retrieve the value from the global conifg object as "config.lang"
    this.lang = "en";
    if (this.cgiArgs["language"]) {
      this.lang = this.cgiArgs["language"];
    } else if (window.language) {
      this.lang = window.language;
    }

    //load in widgets of the config doc
    this.loadModels(this);
    this.loadWidgets(this);

    //defered call for the loadModel event
    this.callListeners( "loadModel" );
    //this.addListener("loadModel", this.loadWidgets, this);
  }

  /**
   * Load a model and it's widgets.  
   * This function can be called at any time to load a new model.
   * TBD Need to distinguish between creating and initialising.
   * @param modelId   the id of the model in config XML to be updated
   * @param modelUrl  URL of the XML model document to be loaded
   */
  this.loadModel = function( modelId, modelUrl ) {
    var model = this[modelId];
    if (model && modelUrl) {
      model.url = modelUrl;
      model.loadModelDoc(model);
    } else {
      alert("config loadmodel error:"+modelId+":"+modelUrl);
    }
  }
}

// Initialise config object.
if (document.readyState==null){
  // Mozilla
  mapbuilder.setLoadState(MB_LOAD_WIDGET);
  config=new Config(mbConfigUrl);
  config.loadConfigScripts();
}
