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

      widget.paint();
      widget.loadTools();
      //this has to be called after widgets are painted
      widget.addListeners();
      group[widgetNode.nodeName] = widget;
    }
  }

  /**
   * Set the selected tool for a MapPane.
   */
  this.setSelectedTool = function(modelId, toolId) {
    alert("setSelectedTool");
    /*
    mapPaneTools=doc.selectNodes(
      "/MapbuilderConfig/modelGroups/Model[id="
      +modelId
      +"]/widgets/MapPane/tools/GlassPane/toolSelect/*");

    //you might want to try this: pass in groupId instead of model Id
    //config[groupId] is a pointer to a group object created in config.init
    //config[groupId].model  - is the currently loaded model in that group
    //config[groupId]['Mappane'] - is a reference to the javascript widget object 
    //we could also reference the widgets using an id instead
    //
    //Also, I don't think this function belongs in config.js since it is seems 
    //to be specific to the mappane.  config.js should not know about the details
    //of any  widgets or tools or models.
    //Mike 11 Mar 2004

    // Set all the tools/selected in the selectedToolList to true/false.
    for(var i=0;i<mapPaneTools.length;i++){
      if (mapPaneTools[i].getAttribute("id")==toolId) {
        mapPaneTools[i].selectSingleNode("selected").nodeValue="true";
      } else {
        mapPaneTools[i].selectSingleNode("selected").nodeValue="false";
      }
    }

    // Call the listeners
    for (var i=0; i<this.selectedToolListeners.length; i++) {
      this.selectedToolListeners[i][0](
        this.selectedToolListeners[i][1]);
    }
    */
  }
}
