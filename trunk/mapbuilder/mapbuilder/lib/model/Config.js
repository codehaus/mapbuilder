/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
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

  // Load the mapbuilder configuration file
  this.doc = Sarissa.getDomDocument();
  this.doc.async = false;
  // the following two lines are needed for IE
  this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  this.doc.setProperty("SelectionLanguage", "XPath");
  this.doc.load(url);
  if (this.doc.parseError < 0) alert("Unable to load config file: " + url + "\nCorrect this value in the config(configUrl) constructor in your page head");

  //set some global application properties
  this.skinDir = this.doc.selectSingleNode("/MapbuilderConfig/skinDir").firstChild.nodeValue;
  this.baseDir = this.doc.selectSingleNode("/MapbuilderConfig/baseDir").firstChild.nodeValue;

  //a global array of the models loaded
  this.modelArray = new Array();

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
    var modelGroups = this.doc.selectNodes( "/MapbuilderConfig/modelGroups/*" );
    for (var i=0; i<modelGroups.length; i++ ) {
      var group = new Object();
      group.modelNode = modelGroups[i];
      group.id = group.modelNode.attributes.getNamedItem("id").nodeValue;
      group.modelType = group.modelNode.selectSingleNode("modelType").firstChild.nodeValue;

      // Get the CGI parameters.  If context is not defined, then set a default.
      group.initialModel = null;
      cgiArgs=getArgs();
      if (group.modelType=="Context" && cgiArgs.context) {  //TBD: need a better way to do this comparison
        group.initialModel = cgiArgs.context;
      } else {
        group.initialModel = group.modelNode.selectSingleNode("defaultModelUrl");
        if ( group.initialModel ) group.initialModel = group.initialModel.firstChild.nodeValue;
      }

      /** Functions to call when the a model is loaded*/
      group.modelListeners = new Array();
      /**
       * Add a Listener for loadModel event.
       * @param listener The function to call when the model is loaded.
       * @param target The object which owns the listener function.
       */
      group.addModelListener = function(listener,target) {
        this.modelListeners[this.modelListeners.length] = new Array(listener,target);
      }


      this[group.id] = group;
      this.loadModel( group.id, group.initialModel );
    }
  }


  /**
  * @function loadModel
  *
  * Loads a model group with a new instance of a model.  The model object is 
  * created from the URL passed in as a param and all the widgets in this model 
  * group are repainted.  This method can be called at any time.
  * TBD: handle the case of loading an already loaded model from the model array?
  *
  * @param groupId   the id of the model group element from the application config file
  * @param modelUrl  the URL of the model to load
  */
  this.loadModel = function(groupId, modelUrl) {
    var group = this[groupId];
    if ( modelUrl ) {
      var evalStr = "new " + group.modelType + "('" + modelUrl + "');";
      //alert("group.loadModel eval:" + evalStr);
      group.model = eval( evalStr );
      //send out an update event?
    } else {
      if (group.model==null) alert("null model attempting to load widget: " + groupId );
    }
    group.model.modelIndex = config.modelArray.push( group.model ) - 1;  //or replace if it exists?

    var widgets = group.modelNode.selectNodes("widgets/*");
    for (var j=0; j<widgets.length; j++) {
      var widgetNode = widgets[j];

      //call the widget constructor and paint
      var evalStr = "new " + widgetNode.nodeName + "(widgetNode, group);";
      //alert("Config.loadWidgets eval:" + evalStr);
      var widget = eval( evalStr );
      widget.modelType = group.modelType;

      widget.loadTools();
      widget.paint();
      //this has to be called after widgets are painted
      //I'd like to get rid of this, they should be handled as paintListeners
      widget.addListeners();
      group[widgetNode.nodeName] = widget;

      for (var i=0; i<group.modelListeners.length; i++) {
        group.modelListeners[i][0]( group.modelListeners[i][1] );
      }
    }
  }
}
