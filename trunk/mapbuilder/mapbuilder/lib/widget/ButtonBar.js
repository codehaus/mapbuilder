/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * A widget which contains a collection of buttons.  One button can
 * be selected (Eg a ZoomInButton) and will determine how mouse clicks on a
 * MapPane are processed.
 * This widget extends WidgetBase.
 * @constructor
 * @param widgetNode The Widget's XML object node from the configuration
 *     document.
 * @param group The ModelGroup XML object from the configuration
 *     document that this widget will update.
 * @requires WidgetBase
 */
function ButtonBar(widgetNode, group) {
  var base = new WidgetBase(widgetNode, group);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /** Render this widget. */
  this.paint = function() {
    var s = this.stylesheet.transformNode(config.doc);
    this.node.innerHTML=s;

    for (var i=0; i<this.paintListeners.length; i++) {
      this.paintListeners[i][0]( this.paintListeners[i][1] );
    }
  }

  var mouseWidget = widgetNode.selectSingleNode("mouseWidget");
  if (mouseWidget) {
    this.mouseWidget = eval(mouseWidget.firstChild.nodeValue);
    this.modalMouseUp = function(buttonBar,targetNode) {
      buttonBar.selectedButton.modalMouseUp(buttonBar.model,targetNode) 
    }
    this.mouseWidget.addListener('mouseup',this.modalMouseUp,this);
  }
  
  /**
   * Select one of the buttons, which deselects all the other buttons.
   * TBD: I'd prefer to call this selectButton(). Cameron 19 March 2004.
   * TBD: I suggest remove <modeValue> from config and use the Node's name instead.
   *      Eg: <ZoomInButton> and call it buttonName (or similar). Cameron 19 March 2004.
   * @param mode The modeValue of a Button to select.
   */
  this.setMode = function(mode) {
    if (this.selectedButton) this.selectedButton.image.src = this.selectedButton.disabledImage.src;
    this.mode = mode;
    if ( this[this.mode].enabledImage) {
      this.selectedButton = this[this.mode];
      this.selectedButton.image.src = this.selectedButton.enabledImage.src;
    }
    //if ( this.parentWidget.acceptToolTips ) this.parentWidget.setToolTip( this.title );
  }

  /**
   * Initialise the widget after the widget tags have been created by the first paint().
   */
  this.postPaintInit = function() {
    var initialMode = this.widgetNode.selectSingleNode("initialMode").firstChild.nodeValue;
    this.setMode( initialMode );
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
  this.mode = toolNode.nodeValue; 
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
      objRef.image.onmouseup = objRef.modalMouseUp;
    }
  }
}

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn at that
 * point.
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function ZoomInButton(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * TBD document me.
   * @param targetNode TBD: Document me.
   * @param model The model that this tool will update.
   */
  this.modalMouseUp = function(model,targetNode) {
    var bbox = model.getAoi();
    var ul = model.extent.GetXY( bbox[0] );
    var lr = model.extent.GetXY( bbox[1] );
    if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
      model.extent.CenterAt( ul, model.extent.res[0]/model.extent.zoomBy );
    } else {
      model.extent.ZoomToBox( ul, lr );
    }
  }

  this.parentWidget.addPaintListener( this.init, this );
  this.parentWidget[this.mode] = this;
}

function ZoomOutButton(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty];    
  } 
  this.modalMouseUp = function(model,targetNode) {
    //should be aoi center
    model.extent.CenterAt(targetNode.evxy, model.extent.res[0]*model.extent.zoomBy);
  }

  this.parentWidget.addPaintListener( this.init, this );
  this.parentWidget[this.mode] = this;
}

function ResetButton(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  this.doReset = function(ev) {
    ev.target.extent.Reset();
  }
  this.parentWidget[this.mode] = this;
  
  this.init = function(objRef) {
    objRef.image = document.getElementById( objRef.id );
    objRef.image.extent = objRef.parentWidget.model.extent;
    objRef.image.onclick = objRef.doReset;
  }
  this.parentWidget.addPaintListener( this.init, this );

}

/** A function stub that does nothing.*/
function noop() {;}
