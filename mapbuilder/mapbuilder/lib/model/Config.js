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
        loadScript(scriptFile,dir+nodes[i].nodeName);
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

