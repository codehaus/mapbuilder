/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tool to draw a region of interest box on a view.  The box can be drawn with
 * the drawBox() method and can be tied to mouse drag with the dragBox() method.
 * This object works entirely in pixel/line coordinate space and knows nothing
 * about geography.
 *
 * @constructor
 *
 * @param viewNode    the view object node to attach the RoiBox to.
 */
function ButtonBar2(controller, node) {
  this.mapController = controller;
  this.EnabledIcon = null;
  this.node = node;
  var buttonBarConfig = config.doc.selectSingleNode("/MapbuilderConfig/controllers/ButtonBar");

  var stylesheet = config.baseDir + buttonBarConfig.selectSingleNode("stylesheet").firstChild.nodeValue;
  this.stylesheet = new XslProcessor(stylesheet);
  var s = this.stylesheet.transformNode(config.doc);
  this.node.innerHTML=s;

  //pre-load the button bar images
/*  this.ModeImagesEn = new Array();
  this.ModeImagesDis = new Array();
  var buttonNodes = buttonBarEl.selectNodes("buttonArray/Button");
  for (var i = 0; i<buttonNodes.length; i++) {
  this.ModeImagesEn[MODE_ZOOM_IN] = new Image();
  this.ModeImagesEn[MODE_ZOOM_IN].src = skin+"images/zoom_in_en.gif";
  this.ModeImagesDis[MODE_ZOOM_IN] = new Image();
  this.ModeImagesDis[MODE_ZOOM_IN].src = skin+"images/zoom_in_dis.gif";
  var icon = document.getElementById("ZoomInButton");
  icon.src = this.ModeImagesDis[MODE_ZOOM_IN].src;
  icon.title = "click and drag to zoom in";
  }
*/
  this.setMode = function(mode) {
    if (this.EnabledIcon) this.EnabledIcon.src = this.ModeImagesDis[this.mode].src;
    this.mode = mode;
    this.mapController.setMode(this.mode);
    switch(this.mode) {
      case MODE_ZOOM_IN:				//zoom in
        this.EnabledIcon = document.getElementById("ZoomInButton");
        break;
      case MODE_ZOOM_OUT:				//zoom out
        this.EnabledIcon = document.getElementById("ZoomOutButton");
        break;
      case MODE_PAN:				//pan
        this.EnabledIcon = document.getElementById("PanButton");
        break;
      case MODE_SET_ROI:				//set roi
        this.EnabledIcon = document.getElementById("SetRoiButton");
        break;
      case MODE_GETFEATUREINFO:				//query mode
        this.EnabledIcon = document.getElementById("QueryButton");
        break;
      default:
        //alert("invalid mode:" +MapMode);
        break;
    }
    if (this.EnabledIcon) {
      this.EnabledIcon.src = this.ModeImagesEn[mode].src;
      if ( this.mapController.acceptToolTips ) this.mapController.setToolTip( this.EnabledIcon.title );
    }
  }

  this.resetExtent = function() {
    this.mapController.resetExtent();
  }

  //initialize the button bar
  this.setMode( this.mapController.glassPane.mode );
}