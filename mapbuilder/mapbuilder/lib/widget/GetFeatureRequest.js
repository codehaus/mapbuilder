/*
Author:       Mike Adair  mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
//mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget which generates a WFS query from it's parent document
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GetFeatureRequest(widgetNode, model) {
  // Inherit the Listener functions and parameters
  var listener = new Listener();
  for (sProperty in listener) { 
    this[sProperty] = listener[sProperty]; 
  } 
  this.model = model;
  this.widgetNode = widgetNode;

  /** mbWidgetId is an auto generated ID assigned to the widget output node */
  this.mbWidgetId = "MbWidget_" + mbIds.getId();

  /** Widget's Id defined in the Config (optional) */
  if (widgetNode.attributes.getNamedItem("id")) {
    this.id = widgetNode.attributes.getNamedItem("id").nodeValue;
  } else {
    this.id = this.mbWidgetId;
  }

  //set an empty debug property in config to see inputs and outputs of stylehseet
  if ( widgetNode.selectSingleNode("mb:debug") ) this.debug=true;

  // Set this.stylesheet
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  var styleNode = widgetNode.selectSingleNode("mb:stylesheet");
  var styleUrl;
  if ( styleNode ) styleUrl = styleNode.firstChild.nodeValue;
  else styleUrl = baseDir+"/widget/"+widgetNode.nodeName+".xsl";
  this.stylesheet = new XslProcessor(styleUrl);

  //set the target model
  var targetModel = widgetNode.selectSingleNode("mb:targetModel");
  if (targetModel) {
    this.targetModel = targetModel.firstChild.nodeValue;
  } else {
    alert("no targetModel");
  }

  for (var j=0;j<widgetNode.childNodes.length;j++) {
    if (widgetNode.childNodes[j].firstChild
      && widgetNode.childNodes[j].firstChild.nodeValue)
    {
      this.stylesheet.setParameter(
        widgetNode.childNodes[j].nodeName,
        widgetNode.childNodes[j].firstChild.nodeValue);
    }
  }

  //all stylesheets will have these properties available
  this.stylesheet.setParameter("modelId", this.model.id );
  this.stylesheet.setParameter("widgetId", this.id );
  this.stylesheet.setParameter("targetModel", this.targetModel.id );
  this.stylesheet.setParameter("skinDir", config.skinDir );
  this.stylesheet.setParameter("lang", config.lang );

  this.xxpaint = function() {
    //no-op
  }

  /**
   * Render the widget.
   * @param objRef Pointer to this object.
   */
  this.paint = function(objRef) {
    if (objRef.dynModel) {
      var feature = objRef.modelNode;
      //confirm inputs
      if (objRef.debug) alert("source:"+feature.xml);
      if (objRef.debug) alert("stylesheet:"+objRef.stylesheet.xslDom.xml);

      //process the doc with the stylesheet
      objRef.postData = objRef.stylesheet.transformNodeToObject(feature);
      if (objRef.debug) alert("result:"+objRef.postData.xml);

      objRef.callListeners("paint");
    }
  }

//calls the ModelList controller of the targetModel which is the FeatureTemplate model

  /**
   * Instantiate all the child tools of this widget.
   */
  this.loadTools = function() {
    var toolNodes = this.widgetNode.selectNodes( "mb:tools/*" );
    for (var i=0; i<toolNodes.length; i++ ) {
      var toolNode = toolNodes[i];
      var evalStr = "new " + toolNode.nodeName + "(toolNode, this);";
      var newTool = eval( evalStr );
      if (newTool) {
        this[toolNode.nodeName] = newTool;
      } else {
        alert("error creating tool:" + toolNode.nodeName);
      }
    }
  }
}
