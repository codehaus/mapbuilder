/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/****************************************************************************
 * Config
 * This Javascript file must be included in the page <HEAD> element.
 * The application creates a global object called Config from the mapbuilder 
 * configuration xml file passed in as a parameter.
 *
 * @constructor
 * @author adair
 * @requires Sarissa
 * @param url URL of the configuration file.
 */
function Config(url) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase();
  for (sProperty in modelBase) { 
    this[sProperty] = modelBase[sProperty]; 
  }

  this.loadModelDoc(url);

  //set some global application properties
  this.skinDir = this.doc.selectSingleNode("/MapbuilderConfig/skinDir").firstChild.nodeValue;
  this.baseDir = this.doc.selectSingleNode("/MapbuilderConfig/baseDir").firstChild.nodeValue;

  /**
   * Internal function to load scripts for components that don't have <scriptfile>
   * specified in the config file.
   * @param xPath Xpath match of components from the Config file.
   * @param dir The directory the script is located in.
   */
  this.loadScriptFiles=function(xPath,dir) {
    var nodes = this.doc.selectNodes(xPath);
    for (var i=0; i<nodes.length; i++) {
      if (nodes[i].selectSingleNode("scriptFile")==null){
        scriptFile = this.baseDir + dir + nodes[i].nodeName+".js";
        loadScript( scriptFile );
      }
    }
  }

  // Load script files for all components that don't have <scriptfile> specified
  // in the config file.
  this.loadScriptFiles("//widgets/*","widget/");
  this.loadScriptFiles("//models/*","model/");
  //this.loadScriptFiles("//tools/*","/tool/");

  //TBD: Deprecate the following block and move into loadScriptFiles instead.
  //load all scriptfiles called for in the config file.  There seems to be a 
  //problem if this is done anywhere except in the page <HEAD> element.
  var scriptFileNodes = this.doc.selectNodes("//scriptFile");
  for (var i=0; i<scriptFileNodes.length; i++ ) {
    scriptFile = this.baseDir + scriptFileNodes[i].firstChild.nodeValue;
    //TBD: add some checks to see if it is already loaded?
    //alert("loading script file:" + scriptFile);
    loadScript( scriptFile );
  }

  /**
  * @function init
  *
  * Provides model group objects as properties of config.  A model group is a 
  * collection of widgets and assocaited tools (controllers) of the same instance 
  * of a model.  The group object can then be referenced using the id of the 
  * Model objects in the config file as in config["modelGroupId"].
  * Also sets the modelType and model properties for the group object.
  * This must be called once, probably in the body onload event, to initialize the 
  * global config object from the mapbuilder configuration XML file.
  */
  this.init = function() {
    var cgiArgs = getArgs();

    var models = this.doc.selectNodes( "/MapbuilderConfig/models/*" );
    for (var i=0; i<models.length; i++ ) {
      modelNode = models[i];

      var modelType = modelNode.nodeName;
      var evalStr = "new " + modelType + "(modelNode, this);";
      //alert("init model:" + evalStr);
      var model = eval( evalStr );

      this[model.id] = model;

      var initialModel = null;
      if (cgiArgs[modelType]) {  //TBD: need a better way to do this comparison
        initialModel = cgiArgs[modelType];
      } else {
        initialModel = modelNode.selectSingleNode("defaultModelUrl").firstChild.nodeValue;
      }
      this.loadModel( model.id, initialModel );
    }
  }

  /**
   * Load a model and it's widgets scripts.  This function can be called at any time
   * to load a new model.
   * @param modelId TBD Comment me.
   * @param modelUrl TBD Comment me.
   */
  this.loadModel = function( modelId, modelUrl ) {
    var model = this[modelId];
    model.loadModelDoc( modelUrl );
    model.loadWidgets();
    this.callListeners("loadModel");
  }
}


/****************************************************************************
Transform an XML document using the provided XSL and use the results to build
a web page.
@constructor
@param xslUrl The URL of an XSL stylesheet.
@author Cameron Shorter - Cameron AT Shorter.net
*/
function XslProcessor(xslUrl) {
  // get the stylesheet document
  this.xslDom = Sarissa.getDomDocument();
  this.xslDom.async = false;
  this.xslDom.load(xslUrl);

  /**
   * Transforms XML in the provided xml node according to this XSL.
   * @param xmlNode The XML node to be transformed.
   * @return The transformed String.
   */
  this.transformNode=function(xmlNode) {
    // transform and build a web page with result
    s=new String(xmlNode.transformNode(this.xslDom));
    // Some browsers XSLT engines don't transform &lt; &gt; to < >, so do it here.
    a=s.split("&lt;");
    s=a.join("<");
    a=s.split("&gt;");
    s=a.join(">");
    return s;
  }
  this.transformNodeToObject=function(xmlNode) {
    // transform and build a web page with result
    var result = Sarissa.getDomDocument();
    xmlNode.transformNodeToObject(this.xslDom,result);
    return result;
  }
  this.setParameter=function(paramName, paramValue) {
    Sarissa.setXslParameter( this.xslDom, paramName, "'"+paramValue+"'");
  }
}

/****************************************************************************
 * Base Listener class that is instantiated by all objects which provide
 * event listeners.
 * @constructor
 * @author Cameron Shorter
 */
function Listener() {
  /** An array [params] of (listener, target). */
  this.listeners=new Array();

  /**
   * An array [params] of values. These values might not be used if the set/get
   * functions are overwritten.
   */
  this.values=new Array();

  /**
   * Add a listener function which will be called when param is updated;  The
   * listener function should usually be: paint(target).
   * @param listener The function to call when the parameter changes.
   * @param target The object which owns the listener function.
   * @param param Parameter name; if this parameter changes then an event is
   * sent to all interested listeners.
   */
  this.addListener=function(param, listener, target) {
    if(!this.listeners[param]){
      this.listeners[param]=new Array();
    }
    this.listeners[param].push(new Array(listener,target));
  }

  /**
   * Call all the listeners that have registered interest in this parameter
   * using addListener.
   * @param param The parameter to change.
   */
  this.callListeners=function(param) {
    if (this.listeners[param]){
      for(var i=0;i<this.listeners[param].length;i++){
        this.listeners[param][i][0](this.listeners[param][i][1]);
      }
    }
  }

  /**
   * Update parameter and call all interested listeners.  This function may
   * be overloaded to store the parameter in a elsewhere (eg in an XML
   * document).
   * @param param The parameter to change.
   * @parma value The new value of the param.
   */
  this.setParam=function(param,value) {
    this.params[param] = value;

    // Call all the interested listeners
    this.callListeners(param);
  }

  /**
   * Return the param value, or return null if it does not exist.  This
   * function may be overloaded to store the param elsewhere (eg in
   * an XML document).
   */
  this.getParam=function(param) {
    return this.params[param][0];
  }
}

/****************************************************************************
 * Base Model class to be instantiated by all Model objects.
 * loads the XML document as the doc property of the model
 * event listeners.  ModelBase extends Listener.
 * @constructor
 * @author Cameron Shorter
 * @see Listener
 */
function ModelBase(modelNode, parent) {
  // Inherit the Listener functions and parameters
  var listener = new Listener();
  for (sProperty in listener) { 
    this[sProperty] = listener[sProperty]; 
  } 

  //calling ModelBase with no params skips this section
  if (modelNode) {
    this.id = modelNode.attributes.getNamedItem("id").nodeValue;
    this.modelNode = modelNode;
  }

  /**
   * Load a Model's configuration file from url.
   * @param url Url of the configuration file.
   */
  this.loadModelDoc = function( url ){
    this.doc = Sarissa.getDomDocument();
    this.doc.async = false;
    // the following two lines are needed for IE
    this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
    this.doc.setProperty("SelectionLanguage", "XPath");
    this.doc.load(url);
    if ( this.doc.parseError < 0 ) alert("error loading document: " + url);

    var docId = this.doc.documentElement.attributes.getNamedItem("id");
    if (docId) this.docId = docId.nodeValue;
  }

  /**
   * Paint all the widgets and initialise any tools the widget may have.
   */
  this.loadWidgets = function() {
    var widgets = this.modelNode.selectNodes("widgets/*");
    for (var j=0; j<widgets.length; j++) {
      var widgetNode = widgets[j];

      //call the widget constructor and paint
      var evalStr = "new " + widgetNode.nodeName + "(widgetNode, this);";
      var widget = eval( evalStr );

      widget.loadTools();
      widget.paint();
      //this has to be called after widgets are painted
      widget.postPaintInit();
      this[widgetNode.nodeName] = widget;

      this.callListeners( "loadWidget" );
    }
  }
}

/****************************************************************************
 * Base Class for widgets.  Associates a node on the page with a stylesheet and
 * model.  All widgets must extend this base class.
 * TBD: find a way to use the .prototype property to do inheritance.
 *
 * @constructor
 * @author Mike Adair 
 * @param widgetNode The Widget's XML object node from the configuration
 *     document.
 * @param model      The javascript model object from the configuration
 *                    document that this widget belongs to.
 */
function WidgetBase(widgetNode, model) {
  if ( arguments.length > 0 ) {   //need this for .prototype?

    this.id = widgetNode.attributes.getNamedItem("id").nodeValue;
    this.node = document.getElementById( this.id );
    if( this.node==null ) {
      alert("HTML node for " + widgetNode.nodeName + " not found: id:" + this.id);
    }
    this.model = model;
    this.widgetNode = widgetNode;

    // Set this.stylesheet
    // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
    var styleNode = widgetNode.selectSingleNode("stylesheet");
    var styleUrl;
    if ( styleNode ) styleUrl = styleNode.firstChild.nodeValue;
    else styleUrl = "widget/"+widgetNode.nodeName+".xsl";
    this.stylesheet = new XslProcessor( config.baseDir + styleUrl);

    var targetGroup = widgetNode.selectSingleNode("targetWidgetGroup");
    if ( targetGroup ) this.targetGroup = targetGroup.firstChild.nodeValue;


    /**
     * Move this widget to the absolute (left,top) position in the browser.
     * @param left Absolute left coordinate.
     * @param top Absolute top coordinate.
     */
    this.move = function(left,top) {
      this.node.style.left = left;
      this.node.style.top = top;
    }

    /**
     * Resize this widget.
     * @param width New width.
     * @param height New height.
     */
    this.resize = function(width,height) {
      this.node.style.width = width;
      this.node.style.height = height;
    }

    /**
     * Render the widget.
     */
    this.paint = function() {
      this.stylesheet.setParameter("modelIndex", this.model.modelIndex );
      var s = this.stylesheet.transformNode(this.model.doc);
      this.node.innerHTML = s;

      for (var i=0; i<this.paintListeners.length; i++) {
        this.paintListeners[i][0]( this.paintListeners[i][1] );
      }
    }

    /**
     * Instantiate all the child tools of this widget.
     */
    this.loadTools = function() {
      var tools = this.widgetNode.selectNodes( "tools/*" );
      for (var i=0; i<tools.length; i++ ) {
        var toolNode = tools[i];
        evalStr = "new " + toolNode.nodeName + "(toolNode, this);";
        this[toolNode.nodeName] = eval( evalStr );
      }
    }

    /** Functions to call when the widget is painted */
    this.paintListeners = new Array();

    /**
     * Add a Listener for AoiBox change.
     * @param listener The function to call when the Area Of Interest changes.
     * @param target The object which owns the listener function.
     */
    this.addPaintListener = function(listener,target) {
      this.paintListeners[this.paintListeners.length] = new Array(listener,target);
    }

    /**
     * no-op function; override in derived classes to add listeners to the model.
     */
    this.postPaintInit = function() {}
  }
}

/****************************************************************************
 * Create a unique Id which can be used for classes to link themselves to HTML
 * Ids.
 * @constructor
 */
function UniqueId(){
  this.lastId=0;

  /** Return a numeric unique Id. */
  this.getId=function() {
    this.lastId++;
    return this.lastId;
  }
}

/****************************************************************************
 * parse comma-separated name=value argument pairs from the query string of 
 * the URL; the function stores name=value pairs in properties of an object and 
 * returns that object. 
 * @return args Array of arguments passed to page, in form args[argname] = value.
 */
function getArgs(){
  var args = new Object();
  var query = location.search.substring(1);
  var pairs = query.split("&");
  for(var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos == -1) continue;
    var argname = pairs[i].substring(0,pos);
    var value = pairs[i].substring(pos+1);
    args[argname] = unescape(value.replace(/\+/g, " "));
  }
  return args;
}

/****************************************************************************
 * Dynamically load a script file if it has not already been loaded.
 * @param url The url of the script.
 */
function loadScript (url) {
  if(!document.getElementById(url)){
    var script = document.createElement('script');
    script.defer = false;   //not sure of effect of this?
    script.type = "text/javascript";
    script.src = url;
    script.id = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}

