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
 * @base ModelBase
 * @author adair
 * @requires Sarissa
 * @param url URL of the configuration file.
 */
function Config(url) {
  this.doc = Sarissa.getDomDocument();
  this.doc.async = false;
  this.doc.validateOnParse=false;  //IE6 SP2 parsing bug
  this.doc.load(url);
  if (this.doc.parseError < 0){
    alert("error loading config document: " + url + " - " + Sarissa.getParseErrorText(this.doc) );
  }
  this.namespace = "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'";
  this.doc.setProperty("SelectionLanguage", "XPath");
  if (this.namespace) Sarissa.setXpathNamespaces(this.doc, this.namespace);

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

  //language to select; defaults to english 
  //Set via a "language" parameter in the URL, 
  //or by setting a global "language" Javascript variable in the page <HEAD>
  //Retrieve the value from the global conifg object as "config.lang"
  this.lang = "en";
  if (window.cgiArgs["language"]) {
    this.lang = window.cgiArgs["language"];
  } else if (window.language) {
    this.lang = window.language;
  }

  //set some global application properties
  var modelNode = this.doc.documentElement;
  this.skinDir = modelNode.selectSingleNode("mb:skinDir").firstChild.nodeValue;
  var proxyUrl = modelNode.selectSingleNode("mb:proxyUrl");
  if (proxyUrl) this.proxyUrl = proxyUrl.firstChild.nodeValue;
  var serializeUrl = modelNode.selectSingleNode("mb:serializeUrl");
  if (serializeUrl) this.serializeUrl = serializeUrl.firstChild.nodeValue;

  this.objects = new Object();

  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode);

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
      model.callListeners("refresh");
    } else {
      alert("config loadModel error:"+modelId+":"+modelUrl);
    }
  }

  /**
   * repaint a widget.  
   * This function can be called at any time to load a new model.
   * TBD Need to distinguish between creating and initialising.
   * @param modelId   the id of the model in config XML to be updated
   * @param modelUrl  URL of the XML model document to be loaded
   */
  this.paintWidget = function( widget ) {
    if (widget) {
      widget.paint(widget, true);
    } else {
      alert("config paintWidget error: widget does not exist");
    }
  }
}

// Initialise config object.
if (document.readyState==null){
  // Mozilla
  mapbuilder.setLoadState(MB_LOAD_CONFIG);
  config=new Config(mbConfigUrl);
  config[config.id] = config;
  config.loadConfigScripts();
}
