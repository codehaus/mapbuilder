/*
Author:       Cameron Shorter cameronATshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/util/wz_jsgraphics/wz_jsgraphics.js");

/**
 * Render GML into HTML.
 * Calls GmlCoordinates2Coord.xsl to convert GML to a simpler form.
 * Calls GmlRendererWZ.xsl to convert GML to wz_jsgraphics graphic function
 * calls.
 * this.targetModel references the context model with
 * width/height attributes.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererWZ(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  // Set this.stylesheet
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  var styleNode = widgetNode.selectSingleNode("mb:stylesheet");
  if (styleNode ) {
    this.stylesheet = new XslProcessor(styleNode.firstChild.nodeValue,model.namespace);
  } else {
    this.stylesheet = new XslProcessor(baseDir+"/widget/"+widgetNode.nodeName+".xsl",model.namespace);
  }

  this.paint = function(objRef) {
    if (objRef.model.doc && objRef.node && objRef.containerModel && objRef.containerModel.doc) {
      objRef.stylesheet.setParameter("modelUrl", objRef.model.url);

      //if (objRef.debug) mbDebugMessage(objRef, "source:"+Sarissa.serialize(objRef.model.doc));
      objRef.resultDoc = objRef.model.doc; // resultDoc sometimes modified by prePaint()
      objRef.prePaint(objRef);

      //confirm inputs
      if (objRef.debug) mbDebugMessage(objRef, "prepaint:"+Sarissa.serialize(objRef.resultDoc));
      if (objRef.debug) mbDebugMessage(objRef, "stylesheet:"+Sarissa.serialize(objRef.stylesheet.xslDom));

      //set to output to a temporary node
      //hack to get by doc parsing problem in IE
      //the firstChild of tempNode will be the root element output by the stylesheet
      var outputNode = document.getElementById( objRef.outputNodeId );
      var tempNode = document.createElement("DIV");

      tempNode.style.position="absolute";
      tempNode.style.top=0;
      tempNode.style.left=0;
      tempNode.style.zindex=300;
      tempNode.setAttribute("id", objRef.outputNodeId);
      //look for this widgets output and replace if found,
      //otherwise append it
      if (outputNode) {
        objRef.node.replaceChild(tempNode,outputNode);
      } else {
        objRef.node.appendChild(tempNode);
      }
      objRef.stylesheet.setParameter('objRef','objRef');
      jsNode = objRef.stylesheet.transformNodeToObject(objRef.resultDoc);
      js=jsNode.selectSingleNode("js").firstChild.nodeValue;
      mbDebugMessage(objRef, "javascript eval:"+js);
      objRef.model.setParam("modelStatus",mbGetMessage("rendering"));
      eval(js);

      objRef.postPaint(objRef);
    }
  }
  this.model.addListener("refresh",this.paint, this);

  MapContainerBase.apply(this,new Array(widgetNode, model));

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<widgetNode.childNodes.length;j++) {
    if (widgetNode.childNodes[j].firstChild
      && widgetNode.childNodes[j].firstChild.nodeValue)
    {
      this.stylesheet.setParameter(
        widgetNode.childNodes[j].nodeName,
        widgetNode.childNodes[j].firstChild.nodeValue);
    }
  }

  // Set widget text values as parameters 
  if (config.widgetText) {
    var textNodeXpath = "/mb:WidgetText/mb:widgets/mb:" + widgetNode.nodeName;
    var textParams = config.widgetText.selectNodes(textNodeXpath+"/*");
    for (var j=0;j<textParams.length;j++) {
      this.stylesheet.setParameter(textParams[j].nodeName,textParams[j].firstChild.nodeValue);
    }
  }

  //all stylesheets will have these properties available
  this.stylesheet.setParameter("modelId", this.model.id );
  this.stylesheet.setParameter("modelTitle", this.model.title );
  this.stylesheet.setParameter("widgetId", this.id );
  this.stylesheet.setParameter("skinDir", config.skinDir );
  this.stylesheet.setParameter("lang", config.lang );

  /** Xsl to convert GML Coordinates to Coords. */
  this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");

  /**
   * Set up XSL params and convert Gml Coordinate nodes to Gml Coords so
   * that they are easier to process by XSL.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    objRef.model.setParam("modelStatus",mbGetMessage("preparingCoords"));
    objRef.stylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
    objRef.stylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
    bBox=objRef.containerModel.getBoundingBox();
    objRef.stylesheet.setParameter("bBoxMinX", bBox[0] );
    objRef.stylesheet.setParameter("bBoxMinY", bBox[1] );
    objRef.stylesheet.setParameter("bBoxMaxX", bBox[2] );
    objRef.stylesheet.setParameter("bBoxMaxY", bBox[3] );
    objRef.stylesheet.setParameter("color", "#FF0000" );

    objRef.resultDoc = objRef.coordXsl.transformNodeToObject(objRef.resultDoc);

    // Force refresh of the wz_jsgraphics handle when the widget's node
    // has been refreshed.
    if (!document.getElementById(objRef.outputNodeId)){
      //objRef.jg=null;
    }
  }

  /**
   * Called when the context's hidden attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
  this.hiddenListener=function(objRef, layerName){
    var vis="visible";
    if(objRef.model.getHidden(layerName)) {
      vis="hidden";
    }
    var outputNode = document.getElementById(objRef.outputNodeId)
    for (var i=0; i< outputNode.childNodes.length; ++i) {
      outputNode.childNodes[i].style.visibility=vis;
    }
  }
  this.model.addListener("hidden",this.hiddenListener,this);

}
