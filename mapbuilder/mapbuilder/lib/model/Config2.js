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

  //set some properties
  this.skinDir = this.doc.selectSingleNode("/MapbuilderConfig/skinDir").firstChild.nodeValue;
  this.baseDir = this.doc.selectSingleNode("/MapbuilderConfig/baseDir").firstChild.nodeValue;

  this.modelArray = new Array();
  this.widgetArray = new Array();

  var scriptFileNodes = this.doc.selectNodes("//scriptFile");
  for (var i=0; i<scriptFileNodes.length; i++ ) {
    scriptFile = this.baseDir + scriptFileNodes[i].firstChild.nodeValue;
    //alert("loading script file:" + scriptFile);
    loadScript( scriptFile );
  }

  this.loadWidgetModel = function(modelUrl, widgetId ) {
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

  this.loadWidgets = function(parentNode, parentWidget) {
    //load in widgets
    var widgets = parentNode.selectNodes( "widgets/*" );
    for (var i=0; i<widgets.length; i++ ) {
      var widgetNode = widgets[i];

      //call the widget constructor and paint
      var evalStr = "new " + widgetNode.nodeName + "(widgetNode);";
      //alert("Config.loadWidgets eval:" + evalStr);
      var widget = eval( evalStr );

      if ( parentWidget ) {
        widget.parentWidget = parentWidget;
        parentWidget.childWidgets.push( widget );
        widget.modelType = parentWidget.modelType;
        widget.model = parentWidget.model;

      } else {
        //otherwise instantiate the model for this tree of widgets
        widget.parentWidget = null;
        var initialModel = widgetNode.selectSingleNode("defaultModelUrl");
        if ( initialModel ) {
          widget.loadModel( initialModel.firstChild.nodeValue );
        }
      }
      widget.paint();

      //recursively instantiate child widgets
      this.loadWidgets( widgetNode, widget );

      widget.addListeners();

      this.widgetArray[i] = widget;
/*
      widget.toolArray = new Array();
      var tools = widgetNode.selectNodes( "/tools/*" );
      for (var i=0; i<tools.length; i++ ) {
        var toolNode = tools[i];
        //var stylesheetUrl = toolNode.selectSingleNode("stylesheet").firstChild.nodeValue;
        evalStr = "new " + toolNode.nodeName + "(toolNode, widget.model);";
        alert("Config.loadWidgets eval:" + evalStr);
        var tool = eval( evalStr );
        widget.toolArray[i] = tool;
      }
*/
    }
  }

}
