/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Class for widgets.  Associates a node on the page with a stylesheet and
 * model.  All widgets must extend this base class.
 * Defines the default paint() method for all widgets which is where the 
 * stylesheet is applied to the model XML document.
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
function WidgetBase(widget,widgetNode,model) {
  // Inherit the Listener functions and parameters
  var listener = new Listener(widget);
  widget.model = model;
  widget.widgetNode = widgetNode;

  /** mbWidgetId is an auto generated ID assigned to the widget output node */
  widget.mbWidgetId = "MbWidget_" + mbIds.getId();

  /** Widget's Id defined in the Config (optional) */
  if (widgetNode.attributes.getNamedItem("id")) {
    widget.id = widgetNode.attributes.getNamedItem("id").nodeValue;
  } else {
    widget.id = widget.mbWidgetId;
  }

  //set an empty debug property in config to see inputs and outputs of stylehseet
  if ( widgetNode.selectSingleNode("mb:debug") ) widget.debug=true;

  /** Transient var used to store model XML before and then after XSL transform.
   *  It can be modified by prePaint() .
   */
  widget.resultDoc = null;

  //until htmlTagNode becomes required allow setting of it by widget id
  var htmlTagNode = widgetNode.selectSingleNode("mb:htmlTagId");
  var htmlTagId = null;
  if (htmlTagNode) {
    htmlTagId = htmlTagNode.firstChild.nodeValue;
  } else {
    htmlTagId = widget.id;
  }

  // Node in main HTML to attach widget to.
  widget.node = document.getElementById(htmlTagId);
  if(!widget.node) {
    //alert("htmlTagId: "+htmlTagId+" for widget "+widgetNode.nodeName+" not found in config");
  }


  // Set this.stylesheet
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  var styleNode = widgetNode.selectSingleNode("mb:stylesheet");
  var styleUrl;
  if ( styleNode ) styleUrl = styleNode.firstChild.nodeValue;
  else styleUrl = baseDir+"/widget/"+widgetNode.nodeName+".xsl";
  widget.stylesheet = new XslProcessor(styleUrl);

  //set the target model
  var targetModel = widgetNode.selectSingleNode("mb:targetModel");
  if (targetModel) {
    widget.targetModel = eval("config."+targetModel.firstChild.nodeValue);
    if ( !widget.targetModel ) {
      alert("error finding targetModel:" + targetModel.firstChild.nodeValue + " for:" + widget.id);
    } 
  } else {
    widget.targetModel = widget.model;
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
  //this is supposed to work too instead of above?
  //widget.stylesheet.setParameter("widgetNode", widgetNode );

  //all stylesheets will have these properties available
  widget.stylesheet.setParameter("modelId", widget.model.id );
  widget.stylesheet.setParameter("widgetId", widget.id );
  widget.stylesheet.setParameter("skinDir", config.skinDir );
  widget.stylesheet.setParameter("lang", config.lang );

  /**
   * Move this widget to the absolute (left,top) position in the browser.
   * @param left Absolute left coordinate.
   * @param top AMike.Adair@CCRS.NRCan.gc.cabsolute top coordinate.
   */
  this.move = function(left,top) {
    this.node.style.left = left;
    this.node.style.top = top;
  }
  widget.move = this.move;

  /**
   * Resize this widget.
   * @param width New width.
   * @param height New height.
   */
  this.resize = function(width,height) {
    this.node.style.width = width;
    this.node.style.height = height;
  }
  widget.resize = this.resize;

  /**
   * Called before paint(), can be used to set up a widget's paint parameters,
   * or modify model using this.resultDoc().
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    //no-op by default
  }
  widget.prePaint = this.prePaint;


  /**
   * Render the widget.
   * @param objRef Pointer to widget object.
   */
  this.paint = function(objRef) {
    if (objRef.model.doc && objRef.node) {

      if (objRef.debug) alert("source:"+objRef.model.doc.xml);
      objRef.resultDoc = objRef.model.doc; // resultDoc sometimes modified by prePaint()
      objRef.prePaint(objRef);

      //confirm inputs
      if (objRef.debug) alert("prepaint:"+objRef.resultDoc.xml);
      if (objRef.debug) alert("stylesheet:"+objRef.stylesheet.xslDom.xml);

      //process the doc with the stylesheet
      var s = objRef.stylesheet.transformNode(objRef.resultDoc);
      if (objRef.debug) alert("painting:"+objRef.id+":"+s);

      //set to output to a temporary node
      //hack to get by doc parsing problem in IE
      //the firstChild of tempNode will be the root element output by the stylesheet
      var tempNode = document.createElement("DIV");
      tempNode.innerHTML = s;
      tempNode.firstChild.setAttribute("id", objRef.mbWidgetId);

      //look for this widgets output and replace if found, otherwise append it
      var outputNode = document.getElementById( objRef.mbWidgetId );
      if (outputNode) {
        objRef.node.replaceChild(tempNode.firstChild,outputNode);
      } else {
        objRef.node.appendChild(tempNode.firstChild);
      }
      objRef.callListeners("paint");
    }
  }
  widget.paint = this.paint;
  // Call paint when model changes
  widget.model.addListener("loadModel",widget.paint, widget);

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
  widget.loadTools = this.loadTools;
}
