/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: WidgetBase.js 3091 2007-08-09 12:21:54Z gjvoosten $
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

  //allow the widget output to be replaced on each paint call
  var outputNode = widgetNode.selectSingleNode("mb:outputNodeId");
  if(templatedWidget){
    this.outputNodeId = this.id;
  }else if ( outputNode ) {
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
  //6Rows added DVDE         
   if(this.buttonBarGroup){
   	this.groupnode = document.getElementById(this.buttonBarGroup);
   }
  if(!this.groupnode){
   this.groupnode = this.node;
  }  
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
      objRef.targetModel = window.config.objects[targetModel.firstChild.nodeValue];
      if ( !objRef.targetModel ) {
        alert(mbGetMessage("noTargetModelWidget", targetModel.firstChild.nodeValue, objRef.id));
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
