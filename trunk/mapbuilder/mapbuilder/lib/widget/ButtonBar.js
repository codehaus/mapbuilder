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
function ButtonBar(controller, skin) {
  this.mapController = controller;
  this.EnabledIcon = null;

alert(skin);
  //pre-load the button bar images
  this.ModeImagesEn = new Array();
  this.ModeImagesEn[MODE_ZOOM_IN] = new Image();
  this.ModeImagesEn[MODE_ZOOM_IN].src = skin+"images/zoom_in_en.gif";
  this.ModeImagesEn[MODE_ZOOM_OUT] = new Image();
  this.ModeImagesEn[MODE_ZOOM_OUT].src = skin+"images/zoom_out_en.gif";
  this.ModeImagesEn[MODE_PAN] = new Image();
  this.ModeImagesEn[MODE_PAN].src = skin+"images/pan_en.gif";
  this.ModeImagesEn[MODE_SET_ROI] = new Image();
  this.ModeImagesEn[MODE_SET_ROI].src = skin+"images/setAOI_en.gif";
  this.ModeImagesEn[MODE_GETFEATUREINFO] = new Image();
  this.ModeImagesEn[MODE_GETFEATUREINFO].src = skin+"images/query_en.gif";

  this.ModeImagesDis = new Array();
  this.ModeImagesDis[MODE_ZOOM_IN] = new Image();
  this.ModeImagesDis[MODE_ZOOM_IN].src = skin+"images/zoom_in_dis.gif";
  this.ModeImagesDis[MODE_ZOOM_OUT] = new Image();
  this.ModeImagesDis[MODE_ZOOM_OUT].src = skin+"images/zoom_out_dis.gif";
  this.ModeImagesDis[MODE_PAN] = new Image();
  this.ModeImagesDis[MODE_PAN].src = skin+"images/pan_dis.gif";
  this.ModeImagesDis[MODE_SET_ROI] = new Image();
  this.ModeImagesDis[MODE_SET_ROI].src = skin+"images/setAOI_dis.gif";
  this.ModeImagesDis[MODE_GETFEATUREINFO] = new Image();
  this.ModeImagesDis[MODE_GETFEATUREINFO].src = skin+"images/query_dis.gif";

  var icon = document.getElementById("ZoomInButton");
  icon.src = this.ModeImagesDis[MODE_ZOOM_IN].src;
  icon.title = "click and drag to zoom in";
  icon = document.getElementById("ZoomOutButton");
  icon.src = this.ModeImagesDis[MODE_ZOOM_OUT].src;
  icon.title = "click to zoom out";
  icon = document.getElementById("PanButton");
  icon.src = this.ModeImagesDis[MODE_PAN].src;
  icon.title = "click and drag to pan";
  icon = document.getElementById("SetRoiButton");
  icon.src = this.ModeImagesDis[MODE_SET_ROI].src;
  icon.title = "click and drag to set the area of interest";
  icon = document.getElementById("QueryButton");
  icon.src = this.ModeImagesDis[MODE_GETFEATUREINFO].src;
  icon.title = "click to query the layer";

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