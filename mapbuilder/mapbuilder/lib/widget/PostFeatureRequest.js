/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/Listener.js");

/**
 * Widget to render a map from an OGC context document.
 * If the widget has the fixedWidth property set to true, then the width of the
 * MapPane will be taken from the width of the HTML element.  Height will be set
 * to maintain a constant aspect ratio.
 * This widget implements listeners for all mouse event types so that tools can
 * define mouse event callbacks.
 * @constructor
 * @base Listener
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function PostFeatureRequest(widgetNode, model) {
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

  // Set stylesheet parameters for all the child text nodes from the config file
  for (var j=0;j<widgetNode.childNodes.length;j++) {
    with (widgetNode.childNodes[j]) {
      if (firstChild.nodeName == "tools") continue;
      if (firstChild.nodeValue) this.stylesheet.setParameter( firstChild.nodeName, firstChild.nodeValue);
    }
  }

  //all stylesheets will have these properties available
  this.stylesheet.setParameter("modelId", this.model.id );
  this.stylesheet.setParameter("widgetId", this.id );
  this.stylesheet.setParameter("targetModel", this.targetModel.id );
  this.stylesheet.setParameter("skinDir", config.skinDir );
  this.stylesheet.setParameter("lang", config.lang );

  this.paint = function() { }

  /**
   * Render the widget.
   * @param objRef Pointer to this object.
   */
  this.loadFeature = function(objRef, modelId, feature) {
    var model = objRef.model[modelId];
    if (model) {

      //confirm inputs
      if (objRef.debug) alert("source:"+feature.xml);
      if (objRef.debug) alert("stylesheet:"+objRef.stylesheet.xslDom.xml);

      //process the doc with the stylesheet
      var newDoc = objRef.stylesheet.transformNodeToObject(feature);

      var serverUrl = feature.serverUrl;
      if (feature.method == "get") {
        newDoc = null;
        if (objRef.debug) alert("http get:"+objRef.id+":"+serverUrl);
      } else {
        //serverUrl = "/mapbuilder/writeXml";
        if (objRef.debug) alert("http post:"+objRef.id+": to :"+serverUrl+":"+newDoc.xml);
      }
      model.loadModelDoc(serverUrl,newDoc);
      alert("loaded:"+model.doc.xml);
      model.callListeners("loadModel");
    } else {
      alert("loadFeature: unable to locate model:" + modelId);
    }
  }

  /**
   * Instantiate all the child tools of this widget.
   */
  this.loadFeatureList = function(objRef) {
    var featureList = objRef.model.getNodeList();
    for (var i=0; i<featureList.length; i++) {
      var feature = featureList[i];

      //instantiate the Model object
      //var modelNode = config.doc.getElementById(objRef.targetModel);  //not sure why getEleById doesn't work with the config doc
      var targetModelNode = config.doc.documentElement.selectSingleNode("//mb:*[@id='"+objRef.targetModel+"']");
      var evalStr = "new " + targetModelNode.nodeName + "(targetModelNode);";
      var model = eval( evalStr );
      if ( model ) {
        //auto generated ID assigned to this model
        model.id = "MbModel_" + mbIds.getId();
        objRef.model[model.id] = model;
      } else { 
        alert("error creating model object:" + modelType);
      }

      //model.addListener("loadModel",objRef.loadFeature, objRef);
      objRef.loadFeature(objRef, model.id, feature);
    }
  }
  // Call paint when model changes
  this.model.addListener("loadModel",this.loadFeatureList, this);
  
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
