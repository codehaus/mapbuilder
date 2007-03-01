/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: WidgetBaseWZ.js 1689 2005-09-27 14:52:33Z madair1 $
*/

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Base Class for widgets.  Associates a node on the page with a stylesheet and
 * model.  All widgets must extend this base class.
 * Defines the default paint() method for all widgets which is where the 
 * stylesheet is applied to the model XML document.
 * To override widget.paint(), define it before calling this constructor.
 * The stylesheet URL defaults to "widget/<widgetName>.xsl" if it is not defined
 * in config file.  Set a stylesheet property containing an XSL URL in config
 * to customize the stylesheet used.
 * All stylesheets will have "modelId" and "widgetId" parameters set when called.
 *
 * @constructor
 * @author Mike Adair 
 * @param widget      Pointer to the widget instance being created
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function WidgetBaseWZ(widgetNode,model) {
  // Extend WidgetBase
  WidgetBase.apply(this, new Array(widgetNode, model));

  // Set this.stylesheet
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  if ( !widget.stylesheet ) {
    var styleNode = widgetNode.selectSingleNode("mb:stylesheet");
    if (styleNode ) {
      widget.stylesheet = new XslProcessor(styleNode.firstChild.nodeValue,model.namespace);
    } else {
      widget.stylesheet = new XslProcessor(baseDir+"/widget/"+widgetNode.nodeName+".xsl",model.namespace);
    }
  }

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<widgetNode.childNodes.length;j++) {
    if (widgetNode.childNodes[j].firstChild
      && widgetNode.childNodes[j].firstChild.nodeValue)
    {
      widget.stylesheet.setParameter(
        widgetNode.childNodes[j].nodeName,
        widgetNode.childNodes[j].firstChild.nodeValue);
    }
  }

  // Set widget text values as parameters 
  if (config.widgetText) {
    var textNodeXpath = "/mb:WidgetText/mb:widgets/mb:" + widgetNode.nodeName;
    var textParams = config.widgetText.selectNodes(textNodeXpath+"/*");
    for (var j=0;j<textParams.length;j++) {
      widget.stylesheet.setParameter(textParams[j].nodeName,textParams[j].firstChild.nodeValue);
    }
  }

  //all stylesheets will have these properties available
  widget.stylesheet.setParameter("modelId", widget.model.id );
  widget.stylesheet.setParameter("modelTitle", widget.model.title );
  widget.stylesheet.setParameter("widgetId", widget.id );
  widget.stylesheet.setParameter("skinDir", config.skinDir );
  widget.stylesheet.setParameter("lang", config.lang );

  /**
   * Render the widget.
   * @param objRef Pointer to widget object.
   */
  this.paint = function(objRef) {
    if (objRef.model.doc && objRef.node) {
      objRef.stylesheet.setParameter("modelUrl", objRef.model.url);
      objRef.stylesheet.setParameter("targetModelId", objRef.targetModel.id );

      //if (objRef.debug) alert("source:"+Sarissa.serialize(objRef.model.doc));
      objRef.resultDoc = objRef.model.doc; // resultDoc sometimes modified by prePaint()
      objRef.prePaint(objRef);

      //confirm inputs
      if (objRef.debug) alert("prepaint:"+Sarissa.serialize(objRef.resultDoc));
      if (objRef.debug) alert("stylesheet:"+Sarissa.serialize(objRef.stylesheet.xslDom));

      //set to output to a temporary node
      //hack to get by doc parsing problem in IE
      //the firstChild of tempNode will be the root element output by the stylesheet
      var outputNode = document.getElementById( objRef.outputNodeId );
      var tempNode = document.createElement("DIV");

      //process the doc with the stylesheet
      var s = objRef.stylesheet.transformNodeToString(objRef.resultDoc);
      if (config.serializeUrl && objRef.debug) postLoad(config.serializeUrl, s);
      if (objRef.debug) alert("painting:"+objRef.id+":"+s);
      tempNode.innerHTML = s;
      tempNode.firstChild.setAttribute("id", objRef.outputNodeId);

      //look for this widgets output and replace if found,
      //otherwise append it
      if (outputNode) {
        objRef.node.replaceChild(tempNode.firstChild,outputNode);
      } else {
        objRef.node.appendChild(tempNode.firstChild);
      }

      objRef.postPaint(objRef);
    }
  }

  /**
   * Remove widget from display.
   * @param objRef Pointer to this object.
   */ 
  this.clearWidget = function(objRef) {
    //with objRef.node remove child
    var outputNode = document.getElementById( objRef.outputNodeId );
    if (outputNode) objRef.node.removeChild(outputNode);
  }

  // Call paint when model changes
  widget.model.addListener("refresh",widget.paint, widget);
  widget.model.addListener("newModel",widget.clearWidget, widget);
}
