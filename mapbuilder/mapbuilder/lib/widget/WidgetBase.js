/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

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
function WidgetBase(widgetNode,model) {
  this.model = model;
  this.widgetNode = widgetNode;
//alert(widgetNode.nodeName);

  /** Widget's Id defined in the Config (required) */
  if (widgetNode.attributes.getNamedItem("id")) {
    this.id = widgetNode.attributes.getNamedItem("id").nodeValue;
  } else {
    alert("id required for object:" + widgetNode.nodeName );
  }

  //allow the widget output to be replaced on each paint call
  var outputNode = widgetNode.selectSingleNode("mb:outputNodeId");
  if ( outputNode ) {
    this.outputNodeId = outputNode.firstChild.nodeValue;
  } else {
    this.outputNodeId = "MbWidget_" + mbIds.getId();
  }

  //until htmlTagNode becomes required allow setting of it by widget id
  if (!this.htmlTagId) {
    var htmlTagNode = widgetNode.selectSingleNode("mb:htmlTagId");
    if (htmlTagNode) {
      this.htmlTagId = htmlTagNode.firstChild.nodeValue;
    } else {
      this.htmlTagId = this.id;
    }
  }

  // Node in main HTML to attach widget to.
  this.node = document.getElementById(this.htmlTagId);
  if(!this.node) {
    //alert("htmlTagId: "+this.htmlTagId+" for widget "+widgetNode.nodeName+" not found in config");
  }

  //allow widgets to not automatically update themseleves in certain circumstances (see layerControl for example)
  this.autoRefresh = true;
  var autoRefresh = widgetNode.selectSingleNode("mb:autoRefresh");
  if (autoRefresh && autoRefresh.firstChild.nodeValue=="false") this.autoRefresh = false;

  //set an empty debug property in config to see inputs and outputs of stylehseet
  if ( widgetNode.selectSingleNode("mb:debug") ) this.debug=true;

  /**
   * Initialize dynamic properties.set the target model
   * @param toolRef Pointer to this object.
   */
  this.initTargetModel = function(objRef) {
    //set the target model
    var targetModel = objRef.widgetNode.selectSingleNode("mb:targetModel");
    if (targetModel) {
      objRef.targetModel = eval("config.objects."+targetModel.firstChild.nodeValue);
      if ( !objRef.targetModel ) {
        alert("error finding targetModel:" + targetModel.firstChild.nodeValue + " for:" + objRef.id);
      }
    } else {
      objRef.targetModel = objRef.model;
    }
  }
  this.model.addListener("init", this.initTargetModel, this);

  /**
   * Called before paint(), can be used to set up a widget's paint parameters,
   * or modify model using this.resultDoc().
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    //no-op by default
  }

  /**
   * Called after paint(), can be used to initialize things that depend on the
   * the widget output being presetn, eg. form and form elements
   * @param objRef Pointer to this object.
   */
  this.postPaint = function(objRef) {
    //no-op by default
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
  this.model.addListener("newModel",this.clearWidget, this);
}
