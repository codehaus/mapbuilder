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
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 * @param position    Style position = "absolute" or "relative" used to specify if the
 *                    widget should overlay others or not, defaults to "relative".
 */
function WidgetBase(widgetNode,model) {
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

  /** Transient var used to store model XML before and then after XSL transform.
   *  It can be modified by prePaint() .
   */
  this.resultDoc = null;

  //until htmlTagNode becomes required allow setting of it by widget id
  var htmlTagNode = widgetNode.selectSingleNode("mb:htmlTagId");
  var htmlTagId = this.id;
  if (htmlTagNode) {
    htmlTagId = htmlTagNode.firstChild.nodeValue;
  }

  // Node in main HTML to attach widget to.
  this.node = document.getElementById(htmlTagId);
  if(!this.node) {
    alert("htmlTagId: "+htmlTagId+" for widget "+widgetNode.nodeName+" not found in config");

  }else{

    //if there is a container node for this widget, initialize it if required
    var mapContainerNode = widgetNode.selectSingleNode("mb:mapContainerId");
    if (mapContainerNode) {
      this.containerNodeId = mapContainerNode.firstChild.nodeValue;
      var testNode = document.getElementById(this.containerNodeId);
      if (!testNode) {
        var newNode = document.createElement("DIV");
        newNode.setAttribute("id",this.containerNodeId);
        newNode.id=this.containerNodeId;
        // Set dimensions of containing <div>this.
        newNode.style.position="relative";
        newNode.style.width=this.model.getWindowWidth();
        newNode.style.height=this.model.getWindowHeight();
        newNode.style.overflow="hidden";
        this.node.appendChild(newNode);
      }
      this.node = document.getElementById(this.containerNodeId);
      this.removeContainer = function(objRef) {
        var parent = objRef.node.parentNode;
        parent.removeChild(objRef.node);
      }
    }
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
      alert("error finding targetModel:" + targetModel + " for:" + this.id);
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
  this.stylesheet.setParameter("widgetId", this.id );
  this.stylesheet.setParameter("targetModel", this.targetModel.id );
  this.stylesheet.setParameter("skinDir", config.skinDir );
  this.stylesheet.setParameter("lang", config.lang );

  /**
   * Move this widget to the absolute (left,top) position in the browser.
   * @param left Absolute left coordinate.
   * @param top AMike.Adair@CCRS.NRCan.gc.cabsolute top coordinate.
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
   * Called before paint(), can be used to set up a widget's paint parameters,
   * or modify model using this.resultDoc().
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    //no-op by default
  }

  /**
   * Render the widget.
   * @param objRef Pointer to this object.
   */
  this.paint = function(objRef) {
    if (objRef.model.doc) {

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
  // Call paint when model changes
  this.model.addListener("modelChange",this.paint, this);

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
