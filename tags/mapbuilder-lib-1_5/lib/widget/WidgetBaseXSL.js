/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
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
 * @base WidgetBase
 * @author Mike Adair 
 * @param widget      Pointer to the widget instance being created
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function WidgetBaseXSL(widgetNode,model) {
  // Extend WidgetBase
  WidgetBase.apply(this, new Array(widgetNode, model));

  // Set this.stylesheet
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  if ( !this.stylesheet ) {
    this.stylesheet = new XslProcessor(this.getProperty("mb:stylesheet", baseDir+"/widget/"+widgetNode.nodeName+".xsl", model.namespace));
  }

  // Do we allow to parse HTML nodes?
  this.parseHTMLNodes = Mapbuilder.parseBoolean(this.getProperty("mb:parseHTMLNodes", false));

  // Set widget text values as parameters 
  if (config.widgetText) {
    var textNodeXpath = "/mb:WidgetText/mb:widgets/mb:" + widgetNode.nodeName;
    var textParams = config.widgetText.selectNodes(textNodeXpath+"/*");
    for (var j=0;j<textParams.length;j++) {
      this.stylesheet.setParameter(textParams[j].nodeName,getNodeValue(textParams[j]));
    }
  }

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<widgetNode.childNodes.length;j++) {
    if (widgetNode.childNodes[j].firstChild)
    {
      this.stylesheet.setParameter(
        widgetNode.childNodes[j].nodeName, widgetNode.childNodes[j].firstChild.nodeValue);
    }
  }

  //all stylesheets will have these properties available
  this.stylesheet.setParameter("modelId", this.model.id );
  this.stylesheet.setParameter("modelTitle", this.model.title );
  this.stylesheet.setParameter("widgetId", this.id );
  this.stylesheet.setParameter("skinDir", config.skinDir );
  this.stylesheet.setParameter("lang", config.lang );

  /**
   * Render the widget.
   * @param objRef Pointer to widget object.
   */
  this.paint = function(objRef, refreshId) {

    //pass in a widget ID to refresh only that widget
    if (refreshId && (refreshId!=objRef.id)) return;

    if (objRef.model.doc && objRef.getNode()) {
      objRef.stylesheet.setParameter("modelUrl", objRef.model.url);
      objRef.stylesheet.setParameter("targetModelId", objRef.targetModel.id );

      //if (objRef.debug) mbDebugMessage(objRef, "source:"+(new XMLSerializer()).serializeToString(objRef.model.doc));
      objRef.resultDoc = objRef.model.doc; // resultDoc sometimes modified by prePaint()
      objRef.model.setParam("prePaint", objRef);
      objRef.prePaint(objRef);

      //confirm inputs
      if (objRef.debug) mbDebugMessage(objRef, "prepaint:"+(new XMLSerializer()).serializeToString(objRef.resultDoc));
      if (objRef.debug) mbDebugMessage(objRef, "stylesheet:"+(new XMLSerializer()).serializeToString(objRef.stylesheet.xslDom));

      //set to output to a temporary node
      //hack to get by doc parsing problem in IE
      //the firstChild of tempNode will be the root element output by the stylesheet
      var outputNode = document.getElementById( objRef.outputNodeId );
      var tempNode = document.createElement("DIV");

      //process the doc with the stylesheet
      var s = objRef.stylesheet.transformNodeToString(objRef.resultDoc);
      if (config.serializeUrl && objRef.debug) postLoad(config.serializeUrl, s);
      if (objRef.debug) mbDebugMessage(objRef, "painting:"+objRef.id+":"+s);
      tempNode.innerHTML = objRef.parseHTMLNodes ? Sarissa.unescape(s) : s;
      if( tempNode.firstChild != null ) { //Could be null!
        // check if we should use the fist child or the next sibling
        // (if we have a stylesheet that outputs an xml declaration, we have a
        // text node containing a linke break above the first node of the
        // stylesheet output content)
        // This is needed for FF3 (MAP-548)
        var ctNode = tempNode.firstChild;
        if (ctNode.nodeType == 3) {
          ctNode = ctNode.nextSibling;   
        }
        ctNode.setAttribute("id", objRef.outputNodeId);

  	    //look for this widgets output and replace if found,
  	    //otherwise append it
  	    if (outputNode) {
  	      objRef.getNode().replaceChild(ctNode,outputNode);
  	    } else {
  	      objRef.getNode().appendChild(ctNode);
  	    }
      }
      objRef.postPaint(objRef);
      objRef.model.setParam("postPaint", objRef);
    }
  }
  // Call paint when model changes
  this.model.addListener("refresh",this.paint, this);

}
