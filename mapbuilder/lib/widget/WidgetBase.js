/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Base Class for widgets. All widgets must extend this base class.
 * Defines the default prePaint() and postPaint() methods for all widgets.
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
	var templatedWidget = false;
	if(model.modelNode.attributes.getNamedItem("createByTemplate") && model.modelNode.attributes.getNamedItem("createByTemplate").nodeValue=='true'){
		widgetNode.setAttribute("id","MbWidget_" + mbIds.getId());
	  templatedWidget = true;
  }

  /** Widget's Id defined in the Config (required) */
  if (widgetNode.attributes.getNamedItem("id")) {
    this.id = widgetNode.attributes.getNamedItem("id").nodeValue;
  } else {
    alert(mbGetMessage("idRequired", widgetNode.nodeName));
  }
  
  /**
   * Convenient access to Mapbuilder.getProperty
   * @param property property to get
   * @param default value to use if property is not set
   * @return the value for the property
   */
  this.getProperty = function(property, defaultValue) {
    return Mapbuilder.getProperty(widgetNode, property, defaultValue);
  }

  //allow the widget output to be replaced on each paint call
  if(templatedWidget){
    this.outputNodeId = this.id;
  }else {
    this.outputNodeId = this.getProperty("mb:outputNodeId", "MbWidget_" + mbIds.getId());
  }

  //until htmlTagNode becomes required allow setting of it by widget id
  if (!this.htmlTagId) {
    this.htmlTagId = this.getProperty("mb:htmlTagId", this.id);
  }

  this.getNode = function() {
    // Node in main HTML to attach widget to.
    var node = document.getElementById(this.htmlTagId);
    if(!node) {
      //alert("htmlTagId: "+this.htmlTagId+" for widget "+widgetNode.nodeName+" not found in config");
    }
    return node;
  }

  //allow widgets to not automatically update themseleves in certain circumstances (see layerControl for example)
  this.autoRefresh = Mapbuilder.parseBoolean(this.getProperty("mb:autoRefresh", true));

  //set an empty debug property in config to see inputs and outputs of stylehseet
  this.debug = Mapbuilder.parseBoolean(this.getProperty("mb:debug", false));

  /**
   * Initialize dynamic properties.set the target model
   * @param toolRef Pointer to this object.
   */
  this.initTargetModel = function(objRef) {
    //set the target model
    var targetModel = objRef.getProperty("mb:targetModel");
    if (targetModel) {
      objRef.targetModel = window.config.objects[targetModel];
      if ( !objRef.targetModel ) {
        alert(mbGetMessage("noTargetModelWidget", targetModel, objRef.id));
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
    //with node remove child
    var outputNode = document.getElementById( objRef.outputNodeId );
    var node = objRef.getNode();
    if (node && outputNode) node.removeChild(outputNode);
  }
  this.model.addListener("newModel",this.clearWidget, this);
}
