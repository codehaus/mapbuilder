/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

function Config(url) {

  /**
   * Load the mapbuilder configuration file
   */
  this.doc = Sarissa.getDomDocument();
  this.doc.async = false;
  // the following two lines are needed for IE
  this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  this.doc.setProperty("SelectionLanguage", "XPath");
  this.doc.load(url);

  //set some global application properties
  this.skinDir = this.doc.selectSingleNode("/MapbuilderConfig/skinDir").firstChild.nodeValue;
  this.baseDir = this.doc.selectSingleNode("/MapbuilderConfig/baseDir").firstChild.nodeValue;

  this.modelArray = new Array();
  this.groupArray = new Array();

  var scriptFileNodes = this.doc.selectNodes("//scriptFile");
  for (var i=0; i<scriptFileNodes.length; i++ ) {
    scriptFile = this.baseDir + scriptFileNodes[i].firstChild.nodeValue;
    //TBD: add some checks to see if it is already loaded?
    //alert("loading script file:" + scriptFile);
    loadScript( scriptFile );
  }

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
      this.loadModel( group.initialModel, group.id );
    }
  }



  this.loadModel = function(modelUrl, groupId) {
    var group = this[groupId];
    var evalStr = "new " + group.modelType + "('" + modelUrl + "');";
    //alert("group.loadModel eval:" + evalStr);
    group.model = eval( evalStr );
    //send out an update event?
    group.model.modelIndex = config.modelArray.push( group.model ) - 1;  //or replace if it exists?
    group.widgetArray = new Array();

    var widgets = group.modelNode.selectNodes("widgets/*");
    for (var j=0; j<widgets.length; j++) {
      var widgetNode = widgets[j];

      //call the widget constructor and paint
      var evalStr = "new " + widgetNode.nodeName + "(widgetNode, group);";
      //alert("Config.loadWidgets eval:" + evalStr);
      var widget = eval( evalStr );
      widget.modelType = group.modelType;

      widget.paint();
      //this has to be called after widgets are painted
      widget.addListeners();
      widget.loadTools();

      group.widgetArray[j] = widget;
    }

  }


}
