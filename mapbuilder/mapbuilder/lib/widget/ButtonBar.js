/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * A widget which contains a collection of buttons.  One button can
 * be selected (Eg a ZoomInButton) and will determine how mouse clicks on a
 * MapPane are processed.
 * ButtonBar tools process mouseClicks on behalf of the mouseWidget. The
 * mouseWidget is usually a MapPane.
 * This widget extends WidgetBase.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function ButtonBar(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Render this widget.
   * This over-rides the default paint() method to transform the config doc 
   * instead of the model.
   */
  this.paint = function() {
    var s = this.stylesheet.transformNode(config.doc);
    this.node.innerHTML=s;
    this.callListeners("paint");
  }

  // if the mouseWidget property is definde for this tool then
  var mouseWidget = widgetNode.selectSingleNode("mouseWidget");
  if (mouseWidget) {
    this.mouseWidget = eval(mouseWidget.firstChild.nodeValue);

    /**
     * Process mouseup event to select a different button.
     * @param objRef      Pointer to this ButtonBar object.
     * @param targetNode  The node for the enclosing HTML tag for this widget
     */
    this.mouseUpHandler = function(objRef,targetNode) {
      objRef.selectedRadioButton.mouseUpHandler(objRef.model,targetNode) 
    }
    this.mouseWidget.addListener('mouseup',this.mouseUpHandler,this);
  }

  /**
   * Called when a user clicks on a button.
   * @param buttonName Name of the button.
   * @param buttonType "RadioButton", "Button" or "SelectBox".
   */
  this.selectButton = function(buttonName, buttonType) {

    //disable all tools
    //TBD: need a way to not hard code these; loop through xml nodes?
    this.mouseWidget["AoiMouseHandler"].enable(false);
    this.mouseWidget["DragPanHandler"].enable(false);

    switch(buttonType){
      case "RadioButton":
        // Deselect previous RadioButton
        if (this.selectedRadioButton){
          this.selectedRadioButton.image.src=this.selectedRadioButton.disabledImage.src;
        }
        this.selectedRadioButton=this[buttonName];
        this.selectedRadioButton.image.src = this.selectedRadioButton.enabledImage.src;
        this.selectedRadioButton.selectButton();
        break;
      case "Button":
        break;
      case "SelectBox":
        break;
      default:
        alert("ButtonBar.js: Unknown buttonType: "+buttonType);
    }
    //if ( this.mouseWidget.acceptToolTips ) this.mouseWidget.setToolTip( this.title );
  }


  /**
   * Initialise the widget after the widget tags have been created by the first paint().
   */
  this.postPaintInit = function() {
    var initialMode = this.widgetNode.selectSingleNode("initialMode").firstChild.nodeValue;
    this.selectButton( initialMode, "RadioButton" );
  }

  config.buttonBar = this;
}


/**
 * Base Button object that all Buttons extend.
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function ButtonBase(toolNode, parentWidget) {
  this.parentWidget = parentWidget;

  //pre-load the button bar images; add them to the config
  this.disabledImage = document.createElement("IMG");
  this.disabledImage.src = config.skinDir + toolNode.selectSingleNode("disabledSrc").firstChild.nodeValue;

  var modalImage = toolNode.selectSingleNode("enabledSrc");
  if (modalImage) {
    this.enabledImage = document.createElement("IMG");
    this.enabledImage.src = config.skinDir + modalImage.firstChild.nodeValue;
  }

  this.title = toolNode.selectSingleNode("tooltip").firstChild.nodeValue;
  this.id = toolNode.selectSingleNode("@id").firstChild.nodeValue;

  /**
   * TBD Document me.
   * @param objRef TBD Document me.
   */
  this.init = function(objRef) {
    objRef.image = document.getElementById( objRef.id );
    if ( objRef.parentWidget.mouseWidget==null ) {
      objRef.image = document.getElementById( objRef.id );
      objRef.image.model = objRef.model;
      objRef.image.onmouseup = objRef.mouseUpHandler;
    }
  }
}

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn at that
 * point.
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function ZoomIn(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  this.selectButton = function() {
    this.parentWidget.mouseWidget["AoiMouseHandler"].enable(true);
  }

  /**
   * TBD document me.
   * @param targetNode TBD: Document me.
   * @param model The model that this tool will update.
   */
  this.mouseUpHandler = function(model,targetNode) {
    var bbox = model.getAoi();
    var ul = model.extent.GetXY( bbox[0] );
    var lr = model.extent.GetXY( bbox[1] );
    if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
      model.extent.CenterAt( ul, model.extent.res[0]/model.extent.zoomBy );
    } else {
      model.extent.ZoomToBox( ul, lr );
    }
  }

  this.parentWidget.addListener( "paint", this.init, this );
}

function ZoomOut(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty];    
  } 

  this.selectButton = function() {
    this.parentWidget.mouseWidget["AoiMouseHandler"].enable(true);
  }

  this.mouseUpHandler = function(model,targetNode) {
    //should be aoi center
    model.extent.CenterAt(targetNode.evxy, model.extent.res[0]*model.extent.zoomBy);
  }

  this.parentWidget.addListener( "paint", this.init, this );
}

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn at that
 * point.
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function DragPan(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  this.selectButton = function() {
    this.parentWidget.mouseWidget["DragPanHandler"].enable(true);
  }

  /**
   * TBD document me.
   * @param targetNode TBD: Document me.
   * @param model The model that this tool will update.
   */
  this.mouseUpHandler = function(model,targetNode) {
    alert("drag pan mouseup");
    //TBD: hide the mappane and then recenter at the new position
  }

  this.parentWidget.addListener( "paint", this.init, this );
}

function Reset(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  this.doReset = function(ev) {
    ev.target.extent.Reset();
  }
  
  this.init = function(objRef) {
    objRef.image = document.getElementById( objRef.id );
    objRef.image.extent = objRef.parentWidget.model.extent;
    objRef.image.onclick = objRef.doReset;
  }
  this.parentWidget.addListener( "paint", this.init, this );

}
