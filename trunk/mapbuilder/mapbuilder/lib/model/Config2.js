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

  this.loadWidgets = function() {
    //load in widgets
    var widgetGroups = this.doc.selectNodes( "/MapbuilderConfig/widgetGroups/*" );
    for (var i=0; i<widgetGroups.length; i++ ) {
      var modelNode = widgetGroups[i];
      var group = new Object();
      group.modelType = modelNode.selectSingleNode("modelType").firstChild.nodeValue;
      var initialModel = modelNode.selectSingleNode("defaultModelUrl");
      if ( initialModel ) {
        var evalStr = "new " + group.modelType + "('" + initialModel.firstChild.nodeValue + "');";
        //alert("group.loadModel eval:" + evalStr);
        group.model = eval( evalStr );
        //send out an update event?
        group.model.modelIndex = config.modelArray.push( group.model ) - 1;  //or replace if it exists?
      }
      group.widgetArray = new Array();

      var widgets = modelNode.selectNodes("widgets/*");
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

        widget.toolArray = new Array();
        var tools = widgetNode.selectNodes( "tools/*" );
        for (var k=0; k<tools.length; k++ ) {
          var toolNode = tools[k];
          evalStr = "new " + toolNode.nodeName + "(toolNode, widget);";
          alert("Config.loadWidgets eval:" + evalStr);
          var tool = eval( evalStr );
          widget.toolArray[k] = tool;
        }

        group.widgetArray[j] = widget;
      }
      this.groupArray[i] = group;
    }
  }

  this.loadModel = function(modelUrl, widgetGroupId ) {
    //load in a model
    for (var i=0; i<this.widgetArray.length; i++ ) {
      var widget = this.widgetArray[i];
      if ( widget.id == widgetId ) {
        widget.loadModel( modelUrl, widget.modelType );
        widget.paint();
        //paint all child widgets
        for (var i=0; i<widget.childWidgets.length; i++ ) {
          widget.childWidgets[i].model = widget.model;
          widget.childWidgets[i].paint();
        }
        break;
      }
    }
  }

}
