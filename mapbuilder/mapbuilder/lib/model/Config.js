/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * The config object is the parent model of all mapbuilder objects.
 * The application creates a global object called 'config' which represents
 * the mapbuilder configuration xml file passed in as a parameter.
 * Config is a model like any other model.  
 * Any mapbuilder object can be de-referenced by using the 'config.objects' 
 * property as in config.objects.idValueFromConfig.
 * The schema for the config can be found at /mabuilder/lib/schemas/config.xsd
 *
 * @constructor
 * @base ModelBase
 * @author adair
 * @requires Sarissa
 * @param url URL of the configuration file.
 */
function Config(url) {
/**
 * open the application specific configuration document, passed in aas the url argument.
 */
  this.doc = Sarissa.getDomDocument();
  this.doc.async = false;
  this.doc.validateOnParse=false;  //IE6 SP2 parsing bug
  this.doc.load(url);
  if (this.doc.parseError < 0){
    alert("error loading config document: " + url );//+ " - " + Sarissa.getParseErrorText(this.doc) );
  }
  this.url = url;
  this.namespace = "xmlns:mb='"+mbNsUrl+"'";
  this.doc.setProperty("SelectionLanguage", "XPath");
  Sarissa.setXpathNamespaces(this.doc, this.namespace);

/**
 * Set the serializeUrl and proxyUrl values from a global configuration document
 * Optional, these can also be set in individual config docs.
 */
  var configDoc = Sarissa.getDomDocument();
  configDoc.async = false;
  configDoc.validateOnParse=false;  //IE6 SP2 parsing bug
  configDoc.load(baseDir+"/"+mbServerConfig);
  if (configDoc.parseError < 0) {
    //alert("error loading server config document: " + baseDir+"/"+mbServerConfig );
  } else {
    configDoc.setProperty("SelectionLanguage", "XPath");
    Sarissa.setXpathNamespaces(configDoc, this.namespace);
    var node = configDoc.selectSingleNode("/mb:MapbuilderConfig/mb:proxyUrl");
    if (node) this.proxyUrl = node.firstChild.nodeValue;
    node = configDoc.selectSingleNode("/mb:MapbuilderConfig/mb:serializeUrl");
    if (node) this.serializeUrl = node.firstChild.nodeValue;
  }
  configDoc = null;

  /**
   * Dynamic loading of the javascript files for objects defined in the Config file.
   * @private
   */
  this.loadConfigScripts=function(){
    // Load script files for all components that don't have <scriptfile> specified
    // in the config file.
    mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:models/*"),"model/");
    mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:widgets/*"),"widget/");
    mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:tools/*"),"tool/");

    //TBD: Deprecate the following block and move into loadScriptsFromXpath instead.
    //load all scriptfiles called for in the config file.  There seems to be a 
    //problem if this is done anywhere except in the page <HEAD> element.
    var scriptFileNodes = this.doc.selectNodes("//mb:scriptFile");
    for (var i=0; i<scriptFileNodes.length; i++ ) {
      scriptFile = scriptFileNodes[i].firstChild.nodeValue;
      mapbuilder.loadScript(scriptFile);
    }
  }

  /**
  * multilingual support; defaults to english 
  * Set via a "language" parameter in the URL, 
  * or by setting a global "language" Javascript variable in the page <HEAD>.
  * Retrieve the language value from the global conifg object as "config.lang"
  */
  this.defaultLang = "en";
  this.lang = this.defaultLang;
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

  /**
   * Convenience method to load widgetText from a URL.
   * Has the possible side-effect of changing config.lang to config.defaultLang
   * if the widgetText for the selected language is not found.
   * @param config the config object
   * @param dir    the base dir for the widget text
   * @param url    the (relative) url under dir/config.lang for the widget text
   * @private
   */
  function loadWidgetText(config, dir, url) {
    var widgetText;
    if (url) {
      var widgetTextUrl = dir + "/" + config.lang + "/" + url.firstChild.nodeValue;
      widgetText = Sarissa.getDomDocument();
      widgetText.async = false;
      widgetText.validateOnParse=false;  //IE6 SP2 parsing bug
      widgetText.load(widgetTextUrl);
      if (widgetText.parseError < 0){
        var errMsg = "Error loading widgetText document: " + widgetTextUrl;
        if (config.lang == config.defaultLang) {
          alert(errMsg);
        }
        else {
          // Try to fall back on default language
          alert(errMsg + "\nFalling back on default language=\"" + config.defaultLang + "\"");
          config.lang = config.defaultLang;
          widgetTextUrl = dir + "/" + config.lang + "/" + url.firstChild.nodeValue;
          widgetText.load(widgetTextUrl);
          if (widgetText.parseError < 0){
            alert("Falling back on default language failed!");
          }
        }
      }
      widgetText.setProperty("SelectionLanguage", "XPath");
      Sarissa.setXpathNamespaces(widgetText, config.namespace);
    }
    return widgetText;
  }
  
  // Load widgetText
  this.widgetText = loadWidgetText(this, this.skinDir,
    modelNode.selectSingleNode("mb:widgetTextUrl"));
  // Try to load userWidgetText
  userWidgetTextDir = modelNode.selectSingleNode("mb:userWidgetTextDir");
  if (userWidgetTextDir) {
    var userWidgetText = loadWidgetText(this, userWidgetTextDir.firstChild.nodeValue,
      modelNode.selectSingleNode("mb:userWidgetTextUrl"));
    if (userWidgetText) {
      // User has specified userWidgetText, merge with widgetText
      var userWidgets = userWidgetText.selectSingleNode("/mb:WidgetText/mb:widgets");
      var configWidgets = this.widgetText.selectSingleNode("/mb:WidgetText/mb:widgets");
      if (userWidgets && configWidgets) {
        // Merge <widgets/> texts
        Sarissa.copyChildNodes(userWidgets, configWidgets, true);
      }
      var userMessages = userWidgetText.selectSingleNode("/mb:WidgetText/mb:messages");
      var configMessages = this.widgetText.selectSingleNode("/mb:WidgetText/mb:messages");
      if (userMessages && configMessages) {
        // Merge <messages/> texts
        Sarissa.copyChildNodes(userMessages, configMessages, true);
      }
    }
  }

  /**
  * the objects property holds a reference to every mapbuilder javascript object
  * created.  Each object is added as a property of config.objects using the
  * value of the object id from the configuration file
  */
  this.objects = new Object();

  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode));

  /**
   * Load a model and its child models, widgets and tools.
   * This function can be called at any time to load a new model or replace an
   * existing model object.
   * @param modelId   the id of the model in config XML to be updated
   * @param modelUrl  URL of the XML model document to be loaded
   */
  this.loadModel = function( modelId, modelUrl ) {
    var model = this.objects[modelId];
    if (model && modelUrl) {
      var httpPayload = new Object();
      httpPayload.method = model.method;
      httpPayload.url = modelUrl;
      model.newRequest(model,httpPayload);
    } else {
      alert(mbGetMessage("errorLoadingModel", modelId, modelUrl));
    }
  }

  /**
   * Repaint the widget passed in.  
   * This function can be called at any time to paint the widget.
   * @param widget   a pointer to the widget object to be painted.
   */
  this.paintWidget = function( widget ) {
    if (widget) {
      widget.paint(widget, widget.id);
    } else {
      alert(mbGetMessage("errorPaintingWidget"));
    }
  }
}

/**
* Initialise the global config object for Mozilla browsers.
*/
if (document.readyState==null){
  // Mozilla
  mapbuilder.setLoadState(MB_LOAD_CONFIG);
  config=new Config(mbConfigUrl);
  config[config.id] = config;
  config.loadConfigScripts();
}
