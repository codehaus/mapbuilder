/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * A collection of buttons.
 *
 * @constructor
 *
 * @param widgetNode The Widget's XML object node from the configuration
 *     document.
 * @param group      The ModelGroup XML object from the configuration
 *     document that this widget will update.
 */
function ButtonBar(widgetNode, group) {
  var base = new WidgetBase(widgetNode, group);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  //override to process the config doc instead of model doc
  this.paint = function() {
    var s = this.stylesheet.transformNode(config.doc);//widgetNode);//ideally only process widgetNode here?
    //alert(s);
    this.node.innerHTML=s;

    for (var i=0; i<this.paintListeners.length; i++) {
      this.paintListeners[i][0]( this.paintListeners[i][1] );
    }
  }

  var mouseWidget = widgetNode.selectSingleNode("mouseWidget");
  if (mouseWidget) {
    this.mouseWidget = eval(mouseWidget.firstChild.nodeValue);
    this.modalMouseUp = function(targetNode, buttonBar) {
      //alert(buttonBar.selectedButton.modalMouseUp);
      buttonBar.selectedButton.modalMouseUp(targetNode, buttonBar.model) 
    }
    this.modalMouseDown = function(targetNode, buttonBar) {
      buttonBar.selectedButton.modalMouseDown(targetNode, buttonBar.model) 
    }
    this.modalMouseMove = function(targetNode, buttonBar) {
      buttonBar.selectedButton.modalMouseMove(targetNode, buttonBar.model) 
    }
    this.mouseWidget.addMouseListener('mouseUp', this.modalMouseUp, this);
    this.mouseWidget.addMouseListener('mouseDown', this.modalMouseDown, this);
    this.mouseWidget.addMouseListener('mouseMove', this.modalMouseMove, this);
  }
  
  this.setMode = function(mode) {
    if (this.selectedButton) this.selectedButton.image.src = this.selectedButton.disabledImage.src;
    this.mode = mode;
    if ( this[this.mode].enabledImage) {
      this.selectedButton = this[this.mode];
      this.selectedButton.image.src = this.selectedButton.enabledImage.src;
    }
    //if ( this.parentWidget.acceptToolTips ) this.parentWidget.setToolTip( this.title );
  }

  this.addListeners = function() {
    var initialMode = this.widgetNode.selectSingleNode("initialMode").firstChild.nodeValue;
    this.setMode( initialMode );
  }

  config.buttonBar = this;
}


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
  this.mode = toolNode.selectSingleNode("modeValue").firstChild.nodeValue; 
  this.id = toolNode.selectSingleNode("@id").firstChild.nodeValue;

  this.init = function(objRef) {
    objRef.image = document.getElementById( objRef.id );
    if ( objRef.parentWidget.mouseWidget==null ) {
      objRef.image = document.getElementById( objRef.id );
      objRef.image.model = objRef.model;
      objRef.image.onmouseup = objRef.modalMouseUp;
    }
  }

  this.modalMouseDown = noop;
  this.modalMouseMove = noop;
}

function ZoomInButton(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 
  this.modalMouseUp = function(targetNode, model) {
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
  this.modalMouseUp = function(targetNode, model) {
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

function noop() {;}
