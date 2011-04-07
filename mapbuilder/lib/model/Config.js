/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

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
  if (Sarissa._SARISSA_IS_SAFARI) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send(null);
    this.doc = xmlhttp.responseXML;
  } else {
    this.doc.load(url);
  }
  if (Sarissa.getParseErrorText(this.doc) != Sarissa.PARSED_OK){
    alert("error loading config document: " + url );//+ " - " + Sarissa.getParseErrorText(this.doc) );
  }
  this.url = url;
  this.namespace = "xmlns:mb='"+mbNsUrl+"'";
  if (!Sarissa._SARISSA_IS_SAFARI_OLD) {
    this.doc.setProperty("SelectionLanguage", "XPath");
    Sarissa.setXpathNamespaces(this.doc, this.namespace);
  }

/**
 * Set the serializeUrl and proxyUrl values from a global configuration document
 * Optional, these can also be set in individual config docs.
 */
  var configDoc = Sarissa.getDomDocument();
  configDoc.async = false;
  configDoc.validateOnParse=false;  //IE6 SP2 parsing bug
  if (Sarissa._SARISSA_IS_SAFARI) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", baseDir+"/"+mbServerConfig, false);
    xmlhttp.send(null);
    configDoc = xmlhttp.responseXML;
  } else {
    configDoc.load(baseDir+"/"+mbServerConfig);
  }
  if (Sarissa.getParseErrorText(configDoc) != Sarissa.PARSED_OK) {
    //alert("error loading server config document: " + baseDir+"/"+mbServerConfig );
  } else {
    if (!Sarissa._SARISSA_IS_SAFARI_OLD) {
      configDoc.setProperty("SelectionLanguage", "XPath");
      Sarissa.setXpathNamespaces(configDoc, this.namespace);
    }
    this.proxyUrl = Mapbuilder.getProperty(configDoc, "/mb:MapbuilderConfig/mb:proxyUrl", this.proxyUrl);
    this.serializeUrl = Mapbuilder.getProperty(configDoc, "/mb:MapbuilderConfig/mb:serializeUrl", this.serializeUrl);
  }
  configDoc = null;

  /**
   * Dynamic loading of the javascript files for objects defined in the Config file.
   * @private
   */
  this.loadConfigScripts=function(){
    // load css stylesheets that were requested before skindir was known.
    if (mapbuilder.cssToLoad) {
      for (var i=0; i<mapbuilder.cssToLoad.length; i++) {
        loadCss(mapbuilder.cssToLoad[i]);
      }
      mapbuilder.cssToLoad = null;
    }
    
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
      scriptFile = getNodeValue(scriptFileNodes[i]);
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
  this.skinDir = Mapbuilder.getProperty(modelNode, "mb:skinDir");
  this.proxyUrl = Mapbuilder.getProperty(modelNode, "mb:proxyUrl", this.proxyUrl);
  this.serializeUrl = Mapbuilder.getProperty(modelNode, "mb:serializeUrl", this.serializeUrl);

  /**
   * Convenience method to load widgetText from a dir.
   * Has the possible side-effect of changing config.lang to config.defaultLang
   * if the widgetText for the selected language is not found.
   * @param config the config object
   * @param dir    the base dir for the widget text
   * @private
   */
  function loadWidgetText(config, dir) {
    var widgetFile = "/widgetText.xml";
    var widgetText;
    var widgetTextUrl = dir + "/" + config.lang + widgetFile;
    widgetText = Sarissa.getDomDocument();
    widgetText.async = false;
    widgetText.validateOnParse=false;  //IE6 SP2 parsing bug
    
    if (typeof(inlineXSL)!="undefined") {
      var xmlString = inlineXSL[widgetTextUrl];
      xmlString = xmlString.replace(/DOUBLE_QUOTE/g,"\"");
      widgetText = (new DOMParser()).parseFromString(xmlString, "text/xml");
    }
    else {
      if (Sarissa._SARISSA_IS_SAFARI) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", widgetTextUrl, false);
        xmlhttp.send(null);
        widgetText = xmlhttp.responseXML;
      } else {
        try {
          widgetText.load(widgetTextUrl);
        }
        catch (ignoredErr) {}
      }
    }      
    if (Sarissa.getParseErrorText(widgetText) != Sarissa.PARSED_OK) {
      var errMsg = "Error loading widgetText document: " + widgetTextUrl;
      if (config.lang == config.defaultLang) {
        alert(errMsg);
      }
      else {
        // Try to fall back on default language
        alert(errMsg + "\nFalling back on default language=\"" + config.defaultLang + "\"");
        config.lang = config.defaultLang;
        widgetTextUrl = dir + "/" + config.lang + widgetFile;
        if(Sarissa._SARISSA_IS_SAFARI) {
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.open("GET", widgetTextUrl, false);
          xmlhttp.send(null);
          widgetText = xmlhttp.responseXML;
        }
        else {
          widgetText.load(widgetTextUrl);
        }
        if (Sarissa.getParseErrorText(widgetText) != Sarissa.PARSED_OK) {
          alert("Falling back on default language failed!");
        }
      }
    }
    if(!Sarissa._SARISSA_IS_SAFARI_OLD) {
      widgetText.setProperty("SelectionLanguage", "XPath");
      Sarissa.setXpathNamespaces(widgetText, config.namespace);
    }
    return widgetText;
  }
  
  // Load widgetText
  this.widgetText = loadWidgetText(this, baseDir + "/text");
  // Try to load userWidgetText
  userWidgetTextDir = modelNode.selectSingleNode("mb:userWidgetTextDir");
  if (userWidgetTextDir) {
    var userWidgetText = loadWidgetText(this, getNodeValue(userWidgetTextDir));
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
* Initialise the global config object for Mozilla browsers older than FF3.6.
*/
if (document.readyState==null){
  // Mozilla
  mapbuilder.setLoadState(MB_LOAD_CONFIG);
  config=new Config(mbConfigUrl);
  config[config.id] = config;
  config.loadConfigScripts();
}