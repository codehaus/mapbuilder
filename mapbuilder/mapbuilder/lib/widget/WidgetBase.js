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
function WidgetBase(widgetNode,model,position) {
  // Inherit the Listener functions and parameters
  var listener = new Listener();
  for (sProperty in listener) { 
    this[sProperty] = listener[sProperty]; 
  } 

  this.model = model;
  this.widgetNode = widgetNode;
  /** Widget's Id defined in the Config */
  this.id = widgetNode.attributes.getNamedItem("id").nodeValue;
  this.mbWidgetId = "MbWidget_" + mbIds.getId();

  /** HTML root <div> node for this widget */
  this.node=document.getElementById(this.id);

  /** Transient var used to store model XML before and then after XSL transform.
   *  It can be modified by prePaint() .
   */
  this.resultDoc = null;

  // Set this.stylesheet
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  var styleNode = widgetNode.selectSingleNode("stylesheet");
  var styleUrl;
  if ( styleNode ) styleUrl = styleNode.firstChild.nodeValue;
  else styleUrl = baseDir+"/widget/"+widgetNode.nodeName+".xsl";
  this.stylesheet = new XslProcessor(styleUrl);

  //set the target model
  var targetModel = widgetNode.selectSingleNode("targetModel");
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
      this.resultDoc = objRef.model.doc; // resultDoc sometimes modified by prePaint()
      objRef.prePaint(this);
      this.resultDoc = objRef.stylesheet.transformNodeToObject(this.resultDoc);
      this.resultDoc.documentElement.setAttribute("id", objRef.mbWidgetId);
      if (objRef.widgetNode.selectSingleNode("debug") ) alert("painting:"+objRef.id+":"+this.resultDoc.xml);
      var outputNode = document.getElementById( objRef.mbWidgetId );
      if (outputNode) {
        objRef.node.replaceChild(document.importNode(this.resultDoc.documentElement,true),outputNode);
      } else {
        objRef.node.appendChild(document.importNode(this.resultDoc.documentElement,true));
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
    var toolNodes = this.widgetNode.selectNodes( "tools/*" );
    for (var i=0; i<toolNodes.length; i++ ) {
      var toolNode = toolNodes[i];
      evalStr = "new " + toolNode.nodeName + "(toolNode, this);";
      var newTool = eval( evalStr );
      if (newTool) {
        this[toolNode.nodeName] = newTool;
      } else {
        alert("error creating tool:" + toolNode.nodeName);
      }
    }
  }
}
