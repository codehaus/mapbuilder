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
 * @base Listener
 * @author Mike Adair 
 * @param widget      Pointer to the widget instance being created
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function WidgetBase(widget,widgetNode,model) {
  // Inherit the Listener functions and parameters
  var listener = new Listener(widget);
  this.model = model;
  this.widgetNode = widgetNode;

  /** Method used for painting.
   * xsl2html (default) => output of XSL will be HTML.
   * xsl2js => output of XSL will be javascript to execute.
   */
  this.paintMethod="xsl2html";

  //allow the widget output to be replaced on each paint call
  var outputNodeId = widgetNode.selectSingleNode("mb:outputNodeId");
  if ( outputNodeId ) {
    this.outputNodeId = outputNodeId.firstChild.nodeValue;
  } else {
    this.outputNodeId = "MbWidget_" + mbIds.getId();
  }

  /** Widget's Id defined in the Config (optional) */
  if (widgetNode.attributes.getNamedItem("id")) {
    this.id = widgetNode.attributes.getNamedItem("id").nodeValue;
  } else {
    this.id = this.outputNodeId;
  }

  //set an empty debug property in config to see inputs and outputs of stylehseet
  if ( widgetNode.selectSingleNode("mb:debug") ) this.debug=true;

  /** Transient var used to store model XML before and then after XSL transform.
   *  It can be modified by prePaint() .
   */
  this.resultDoc = null;

  //until htmlTagNode becomes required allow setting of it by widget id
  var htmlTagNode = widgetNode.selectSingleNode("mb:htmlTagId");
  var htmlTagId = null;
  if (htmlTagNode) {
    htmlTagId = htmlTagNode.firstChild.nodeValue;
  } else {
    htmlTagId = this.id;
  }

  // Node in main HTML to attach widget to.
  this.node = document.getElementById(htmlTagId);
  if(!this.node) {
    //alert("htmlTagId: "+htmlTagId+" for widget "+widgetNode.nodeName+" not found in config");
  }


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
    this.targetModel = eval("config."+targetModel.firstChild.nodeValue);
    if ( !this.targetModel ) {
      alert("error finding targetModel:" + targetModel.firstChild.nodeValue + " for:" + this.id);
    } 
  } else {
    this.targetModel = this.model;
  }

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
  //this is supposed to work too instead of above?
  //this.stylesheet.setParameter("widgetNode", widgetNode );

  //all stylesheets will have these properties available
  this.stylesheet.setParameter("modelId", this.model.id );
  this.stylesheet.setParameter("targetModelId", this.targetModel.id );
  this.stylesheet.setParameter("widgetId", this.id );
  this.stylesheet.setParameter("skinDir", config.skinDir );
  this.stylesheet.setParameter("lang", config.lang );

  /**
   * Move this widget to the absolute (left,top) position in the browser.
   * @param left Absolute left coordinate.
   * @param top Absolute top coordinate.
   */
  this.move = function(left,top) {
    this.node.style.left = left;
    this.node.style.top = top;
  }

  /**
   * Resize this widget.
   * @param width New width.
   * @param height New height.
   */
  this.resize = function(width,height) {
    this.node.style.width = width;
    this.node.style.height = height;
  }

  /**
   * Called change the visibility of this widget's output node
   * @param vis   boolean true or false 
   */
  this.setVisibility = function(vis) {
    var vis="visible";
    if (vis) vis="hidden";
    document.getElementById(this.outputNodeId).style.visibility = vis;
  }

  /**
   * Called before paint(), can be used to set up a widget's paint parameters,
   * or modify model using this.resultDoc().
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    //no-op by default
  }

  /**
   * Render the widget.
   * @param objRef Pointer to widget object.
   */
  this.paint = function(objRef) {
    if (objRef.model.doc && objRef.node && !objRef.override) {

      //if (objRef.debug) alert("source:"+objRef.model.doc.xml);
      objRef.resultDoc = objRef.model.doc; // resultDoc sometimes modified by prePaint()
      objRef.prePaint(objRef);

      //confirm inputs
      if (objRef.debug) alert("prepaint:"+objRef.resultDoc.xml);
      if (objRef.debug) alert("stylesheet:"+objRef.stylesheet.xslDom.xml);

      //set to output to a temporary node
      //hack to get by doc parsing problem in IE
      //the firstChild of tempNode will be the root element output by the stylesheet
      var outputNode = document.getElementById( objRef.outputNodeId );
      var tempNode = document.createElement("DIV");
      switch (objRef.paintMethod) {
        case "xsl2html":
          //process the doc with the stylesheet
          s = objRef.stylesheet.transformNode(objRef.resultDoc);
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
          break;
        case "xsl2js":
          jsNode = objRef.stylesheet.transformNodeToObject(objRef.resultDoc);
          js=jsNode.firstChild.firstChild.nodeValue;
          if (!outputNode) {
            tempNode.innerHTML = "<div>";
            tempNode.firstChild.setAttribute("id", objRef.outputNodeId);
            objRef.node.appendChild(tempNode.firstChild);
          }
          //alert("WidgetBase: js ="+js);
          eval(js);
          break;
        default:
          alert("WidgetBase: Invalid paintMethod="+objRef.paintMethod);
      }

      objRef.callListeners("paint");
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



  // If this object is being created because a child is extending this object,
  // then child.properties = this.properties
  for (sProperty in this) {
    widget[sProperty] = this[sProperty];
  }
  // Call paint when model changes
  widget.model.addListener("refresh",widget.paint, widget);
  widget.model.addListener("newModel",widget.clearWidget, widget);
}
