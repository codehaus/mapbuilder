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
  var modelBase = new ModelBase();
  for (sProperty in modelBase) { 
    this[sProperty] = modelBase[sProperty]; 
  }

  this.loadModelDoc(url);

  //set some global application properties
  this.skinDir = this.doc.selectSingleNode("/MapbuilderConfig/skinDir").firstChild.nodeValue;

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
        scriptFile = baseDir+"/"+dir+nodes[i].nodeName+".js";
        mapbuilder.loadScript( scriptFile );
      }
    }
  }

  // Load script files for all components that don't have <scriptfile> specified
  // in the config file.
  this.loadScriptFiles("//models/*","model/");
  this.loadScriptFiles("//widgets/*","widget/");
  //this.loadScriptFiles("//tools/*","widget/tool/");
  //this.loadScriptFiles("//tools/*","/tool/");

  //TBD: Deprecate the following block and move into loadScriptFiles instead.
  //load all scriptfiles called for in the config file.  There seems to be a 
  //problem if this is done anywhere except in the page <HEAD> element.
  var scriptFileNodes = this.doc.selectNodes("//scriptFile");
  for (var i=0; i<scriptFileNodes.length; i++ ) {
    scriptFile = baseDir+"/"+scriptFileNodes[i].firstChild.nodeValue;
    mapbuilder.loadScript(scriptFile);
  }

  /**
  * @function init
  *
  * Main initialization method for mapbuilder applications.  
  * This method calls the loadModel method for all models included in the config
  * file a store them as a property of the config object using the model ID as
  * the property name.  This means that the model object can then be referenced 
  * as in config["modelId"] in subsequent javascript code.
  * This must be called once in the body onload event.
  */
  this.init = function() {
    var cgiArgs = getArgs();

    //loop through all models in the config file
    var models = this.doc.selectNodes( "/MapbuilderConfig/models/*" );
    for (var i=0; i<models.length; i++ ) {
      modelNode = models[i];

      //instantiate the Model object
      var modelType = modelNode.nodeName;
      var evalStr = "new " + modelType + "(modelNode, this);";
      //alert("init model:" + evalStr);
      var model = eval( evalStr );

      this[model.id] = model;

      //load the Model object from the initial URL in config or from a URL param.
      //the URL can also be passed in as a URL parameter by using the model ID
      //as the parameter name (this method takes precendence over the config file
      var initialModel = null;
      if (cgiArgs[model.id]) {  
        initialModel = cgiArgs[model.id];
      } else {
        initialModel = modelNode.selectSingleNode("defaultModelUrl").firstChild.nodeValue;
      }
      this.loadModel( model.id, initialModel );
    }
  }

  /**
   * Load a model and it's widgets scripts.  This function can be called at any
   * time to load a new model.
   * @param modelId   the id of the model in config XML to be updated
   * @param modelUrl  URL of the XML model document to be loaded
   */
  this.loadModel = function( modelId, modelUrl ) {
    var model = this[modelId];
    model.loadModelDoc( modelUrl );
    model.loadWidgets();
  }
}
