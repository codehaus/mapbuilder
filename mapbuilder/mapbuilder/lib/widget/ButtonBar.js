/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * A widget which contains a collection of buttons.  Supports radio buttons,
 * select buttons and simple push buttons.  A radio button can
 * be selected (Eg a ZoomInButton) and will determine how mouse clicks on a
 * MapPane are processed.
 * ButtonBar tools process mouseClicks on behalf of the mouseWidget. The
 * mouseWidget is usually a MapPane.  If the mouseWidget property is not set in 
 * config, then the mouseUp action only happens when the button is click
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

  // if the mouseWidget property is defined for this tool then, a mouseup event 
  // listeners is registered with that widget, otherwise mouseup event is for 
  // the button image itself
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

    switch(buttonType){
      case "RadioButton":
        //disable tools
        //TBD: need a way to not hard code these; loop through xml nodes?
        this.mouseWidget.tools["AoiMouseHandler"].enable(false);
        this.mouseWidget.tools["DragPanHandler"].enable(false);

        // Deselect previous RadioButton
        if (this.selectedRadioButton){
          this.selectedRadioButton.image.src=this.selectedRadioButton.disabledImage.src;
        }
        this.selectedRadioButton=this.tools[buttonName];
        this.selectedRadioButton.image.src = this.selectedRadioButton.enabledImage.src;
        this.selectedRadioButton.selectButton();
        break;
      case "Button":
        this.tools[buttonName].selectButton();
        break;
      case "SelectBox":
        break;
      default:
        alert("ButtonBar.js: Unknown buttonType: "+buttonType);
    }
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

  this.title = toolNode.selectSingleNode("tooltip").firstChild.nodeValue;
  this.id = toolNode.selectSingleNode("@id").firstChild.nodeValue;

  //pre-load the button bar images; add them to the config
  this.disabledImage = document.createElement("IMG");
  this.disabledImage.src = config.skinDir + toolNode.selectSingleNode("disabledSrc").firstChild.nodeValue;
  this.disabledImage.title = this.title;         //img.title is for tool tips, alt for images disabled browsers

  var modalImage = toolNode.selectSingleNode("enabledSrc");
  if (modalImage) {
    this.enabledImage = document.createElement("IMG");
    this.enabledImage.src = config.skinDir + modalImage.firstChild.nodeValue;
    this.enabledImage.title = this.title;         //img.title is for tool tips, alt for images disabled browsers
  }

  /**
   * TBD Document me.
   * @param objRef TBD Document me.
   */
  this.init = function(objRef) {
    objRef.image = document.getElementById( objRef.id );
    if ( objRef.parentWidget.mouseWidget==null ) {
      objRef.image.model = objRef.model;
      objRef.image.onmouseup = objRef.mouseUpHandler;
    }
    objRef.image.title = objRef.title;         //img.title is for tool tips, alt for images disabled browsers
  }
}

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function ZoomIn(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  this.selectButton = function() {
    this.parentWidget.mouseWidget.tools["AoiMouseHandler"].enable(true);
  }

  /**
   * Calls the model's ceter at method to zoom in.  If the AOI is a single point,
   * it zooms in by the zoomBy factor.
   * @param model       The model that this tool will update.
   * @param targetNode  The element on which the mouse event occured
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

/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function ZoomOut(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty];    
  } 

  this.selectButton = function() {
    this.parentWidget.mouseWidget.tools["AoiMouseHandler"].enable(true);
  }

  /**
   * Calls the centerAt method of the context doc to zoom out, recentering at 
   * the mouse event coordinates.
   * TBD: set the zoomBy property as a button property in conifg
   * @param model       The model that this tool will update.
   * @param targetNode  The element on which the mouse event occured
   */
  this.mouseUpHandler = function(model,targetNode) {
    //should be aoi center?
    model.extent.CenterAt(targetNode.evxy, model.extent.res[0]*model.extent.zoomBy);
  }

  this.parentWidget.addListener( "paint", this.init, this );
}

/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function DragPan(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  this.selectButton = function() {
    this.parentWidget.mouseWidget.tools["DragPanHandler"].enable(true);
  }

  /**
   * Calls the centerAt method of the context doc to recenter with the given 
   * offset
   * @param model       The model that this tool will update.
   * @param targetNode  The element on which the mouse event occured
   */
  this.mouseUpHandler = function(model,targetNode) {
    alert("drag pan mouseup");
    //TBD: hide the mappane and then recenter at the new position
  }

  this.parentWidget.addListener( "paint", this.init, this );
}

/**
 * When this button is pressed the map will reload with it's original extent
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function Reset(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Calls the reset() method of the context doc to reload at with the original extent
   */
  this.selectButton = function() {
    this.parentWidget.mouseWidget.model.extent.Reset();
  }

  this.parentWidget.addListener( "paint", this.init, this );

}
