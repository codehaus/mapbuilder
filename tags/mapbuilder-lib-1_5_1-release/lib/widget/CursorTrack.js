/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display the mouse coordinates when it is over a MapContainer widget.
 *
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */
function CursorTrack(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  //by default, display coords in latlon; if false show map XY
  this.showPx = Mapbuilder.parseBoolean(this.getProperty("mb:showPx", false)); // pixel coordinates
  this.showXY = Mapbuilder.parseBoolean(this.getProperty("mb:showXY", false)); // XY Coordinates
  this.showLatLong = Mapbuilder.parseBoolean(this.getProperty("mb:showLatLong", true)); // Standard lat long
  this.showDMS = Mapbuilder.parseBoolean(this.getProperty("mb:showDMS", false)); // Lat/long in DD MM SS.S format
  this.showDM = Mapbuilder.parseBoolean(this.getProperty("mb:showDM", false)); // Lat/long in DD MM.MMMM format
  this.showMGRS = Mapbuilder.parseBoolean(this.getProperty("mb:showMGRS", false)); // Military Grid Reference System
  if( this.showMGRS ) {
    // load this here so it is not required for everyone
    mapbuilder.loadScript(baseDir+"/util/MGRS.js");
  }

  this.precision = this.getProperty("mb:precision", 2);

  //set some properties for the form output
  this.formName = "CursorTrackForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);

  this.showPanButton = Mapbuilder.parseBoolean(this.getProperty("mb:showPanButton", false)); // show a pan button
  this.showZoomButton = Mapbuilder.parseBoolean(this.getProperty("mb:showZoomButton", false)); // show a zoom button
  this.zoomLevel = this.getProperty("mb:zoomLevel", null); // level for zooming (used first)
  this.zoomScale = this.getProperty("mb:zoomScale", null); // scale for zooming (used second)


  /**
   * Add mouse event listeners to the map object in the model.
   * @param objRef Pointer to this CursorTrack object.
   */
  this.init = function(objRef) {
    objRef.proj = new OpenLayers.Projection( objRef.model.getSRS() );

    objRef.model.map.events.register('mousemove', objRef, objRef.mousemoveHandler);
    objRef.model.map.events.register('mouseout',  objRef, objRef.mouseoutHandler);

    if( this.showMGRS )
      this.MGRS = new MGRS();
  }
  this.model.addListener("loadModel", this.init, this );
  
  this.clear = function(objRef) {
    if (objRef.model.map && objRef.model.map.events) {
      objRef.model.map.events.unregister('mousemove', objRef, objRef.mousemoveHandler);
      objRef.model.map.events.unregister('mouseout',  objRef, objRef.mouseoutHandler);
    }
  }
  this.model.addListener("newModel", this.clear, this);

  /**
   * OpenLayers mousemove event listener.
   * @param evt OpenLayers mouse event
   */
  this.mousemoveHandler = function(evt) {
    var coordForm = document.getElementById(this.formName);
    if (!evt) return;

    // capture XY coordinates
    var evXY = this.model.map.getLonLatFromPixel(evt.xy);

    ///CSCS
    var pt=new OpenLayers.Geometry.Point(evXY.lon, evXY.lat)
    pt.transform(this.proj, new OpenLayers.Projection("EPSG:4326"));
    var evLonLat = new OpenLayers.LonLat(pt.x,pt.y);


    if( this.showPx ) {
      if( coordForm.px )
        coordForm.px.value = evt.xy.x;
      if( coordForm.py )
        coordForm.py.value = evt.xy.y;
    }

    if( this.showXY ) {
      if( coordForm.x )
        coordForm.x.value = evXY.lon.toFixed(this.precision);;
      if( coordForm.y )
        coordForm.y.value = evXY.lat.toFixed(this.precision);;
    }

    if( this.showLatLong ) {
      if( coordForm.longitude )
        coordForm.longitude.value = evLonLat.lon.toFixed(this.precision);
      if( coordForm.latitude )
        coordForm.latitude.value = evLonLat.lat.toFixed(this.precision);
    }

    if( this.showDMS ) {
      var longitude = this.convertDMS(evLonLat.lon, 'LON');
      if( coordForm.longdeg )
        coordForm.longdeg.value = longitude[0];
      if( coordForm.longmin )
        coordForm.longmin.value = longitude[1];
      if( coordForm.longsec )
        coordForm.longsec.value = longitude[2];
     if( coordForm.longH )
        coordForm.longH.value = longitude[3];

      var latitude = this.convertDMS(evLonLat.lat, 'LAT');
      if( coordForm.latdeg )
        coordForm.latdeg.value = latitude[0];
      if( coordForm.latmin )
        coordForm.latmin.value = latitude[1];
      if( coordForm.latsec )
        coordForm.latsec.value = latitude[2];
      if( coordForm.latH )
        coordForm.latH.value = latitude[3];
    }

    if( this.showDM ) {
      var longitude = this.convertDM(evLonLat.lon, 'LON');
      if( coordForm.longDMdeg )
        coordForm.longDMdeg.value = longitude[0];
      if( coordForm.longDMmin )
        coordForm.longDMmin.value = longitude[1];
      if( coordForm.longDMH )
        coordForm.longDMH.value = longitude[2];

      var latitude = this.convertDM(evLonLat.lat, 'LAT');
      if( coordForm.latDMdeg )
        coordForm.latDMdeg.value = latitude[0];
      if( coordForm.latDMmin )
        coordForm.latDMmin.value = latitude[1];
      if( coordForm.latDMH )
        coordForm.latDMH.value = latitude[2];
    }

    if( this.showMGRS ) {
      if( !this.MGRS )
        this.MGRS = new MGRS();
      coordForm.mgrs.value = this.MGRS.convert(evLonLat.lat,evLonLat.lon) ;
    }
  }

  /**
   * OpenLayers mouseout event listener.
   * @param evt OpenLayers mouse event
   */
  this.mouseoutHandler = function(evt) {
    var coordForm = document.getElementById(this.formName);

    if( this.showPx ) {
      if( coordForm.px)
        coordForm.px.value = "";
      if( coordForm.py)
        coordForm.py.value = "";
    }

    if( this.showXY ) {
      if( coordForm.x)
        coordForm.x.value = "";
      if( coordForm.y)
        coordForm.y.value = "";
    }

    if( this.showLatLong ) {
      if( coordForm.longitude )
        coordForm.longitude.value = "";
      if( coordForm.latitude )
        coordForm.latitude.value = "";
    }

    if( this.showDMS ) {
      if( coordForm.longdeg )
        coordForm.longdeg.value = "";
      if( coordForm.longmin )
        coordForm.longmin.value = "";
      if( coordForm.longsec )
        coordForm.longsec.value = "";
      if( coordForm.longH )
        coordForm.longH.value = "";

      if( coordForm.latdeg )
        coordForm.latdeg.value = "";
      if( coordForm.latmin )
        coordForm.latmin.value = "";
      if( coordForm.latsec )
        coordForm.latsec.value = "";
      if( coordForm.latH )
        coordForm.latH.value = "";
    }

    if( this.showDM ) {
      if( coordForm.longDMdeg )
        coordForm.longDMdeg.value = "";
      if( coordForm.longDMmin )
        coordForm.longDMmin.value = "";
      if( coordForm.longDMH )
        coordForm.longDMH.value = "";

      if( coordForm.latDMdeg )
        coordForm.latDMdeg.value = "";
      if( coordForm.latDMmin )
        coordForm.latDMmin.value = "";
      if( coordForm.latDMH )
        coordForm.latDMH.value = "";
    }

    if( this.showMGRS ) {
      if( coordForm.mgrs )
        coordForm.mgrs.value = "";
    }
  }

  /**
   * Decimal to DMS conversion
   */
  this.convertDMS = function(coordinate, type) {
    var coords = new Array();

    abscoordinate = Math.abs(coordinate)
    coordinatedegrees = Math.floor(abscoordinate);

    coordinateminutes = (abscoordinate - coordinatedegrees)/(1/60);
    tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    coordinateseconds = (tempcoordinateminutes - coordinateminutes)/(1/60);
    coordinateseconds =  Math.round(coordinateseconds*10);
    coordinateseconds /= 10;

    if( coordinatedegrees < 10 )
      coordinatedegrees = "0" + coordinatedegrees;

    if( coordinateminutes < 10 )
      coordinateminutes = "0" + coordinateminutes;

    if( coordinateseconds < 10 )
      coordinateseconds = "0" + coordinateseconds;

    coords[0] = coordinatedegrees;
    coords[1] = coordinateminutes;
    coords[2] = coordinateseconds;
    coords[3] = this.getHemi(coordinate, type);

    return coords;
  }

  /**
   * Decimal to DM (degrees plus decimal minutes) conversion
   */
  this.convertDM = function(coordinate, type) {
    var coords = new Array();

    abscoordinate = Math.abs(coordinate)
    coordinatedegrees = Math.floor(abscoordinate);

    coordinateminutes = (abscoordinate - coordinatedegrees)*60;
    coordinateminutes = Math.round(coordinateminutes*1000);
    coordinateminutes /= 1000;

    if( coordinatedegrees < 10 )
      coordinatedegrees = "0" + coordinatedegrees;

    if( coordinateminutes < 10 )
      coordinateminutes = "0" + coordinateminutes;

    coords[0] = coordinatedegrees;
    coords[1] = coordinateminutes;
    coords[2] = this.getHemi(coordinate, type);

    return coords;
  }

  /**
   * Return the hemisphere abbreviation for this coordinate.
   */
  this.getHemi = function(coordinate, type) {
    var coordinatehemi = "";
    if (type == 'LAT') {
      if (coordinate >= 0) {
        coordinatehemi = "N";
      }
      else {
        coordinatehemi = "S";
      }
    }
    else if (type == 'LON') {
      if (coordinate >= 0) {
        coordinatehemi = "E";
      } else {
        coordinatehemi = "W";
      }
    }

    return coordinatehemi;
  }

  /**
   * Handles submission of the form (via javascript in an <a> tag or onsubmit handler)
   */
  this.submitForm = function() {
    this.doPan();
    return false;   //prevent the form from actually being submitted
  }

  /**
   * handles keypress events to filter out everything except "enter".  
   * Pressing the "enter" key will trigger a form submit
   * @param event  the event object passed in for Mozilla; IE uses window.event
   */
  this.handleKeyPress = function(event) {
    var keycode;
    var target;
    if (event){
      //Mozilla
      keycode=event.which;
      target=event.currentTarget;
    }else{
      //IE
      keycode=window.event.keyCode;
      target=window.event.srcElement.form;
    }

    if (keycode == 13) {    //enter key
      target.parentWidget.submitForm();
      return false
    }
  }

  /**
   * Refreshes the form and event handlers when this widget is painted.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.postPaint = function(objRef) {
    var coordForm = document.getElementById(objRef.formName);
    coordForm.parentWidget = objRef;
    coordForm.onkeypress = objRef.handleKeyPress;
  }

  /**
   * Pan to the actual coordinate
   */
  this.doPan = function() {
    var lonlat = this.getLonLat();
    if (lonlat) {
      this.model.map.panTo(lonlat);
    }
  }

  /**
   * Zoom to the actual coordinate. First use zoomLevel, then zoomScale.
   */
  this.doZoom = function() {
    var lonlat = this.getLonLat();
    if (lonlat) {
      if (this.zoomLevel) {
        this.model.map.setCenter(lonlat, this.zoomLevel);
      } else if (this.zoomScale) {
        var res = OpenLayers.Util.getResolutionFromScale(this.zoomScale, this.model.map.baseLayer.units);
        var size = this.model.map.getSize();
        var w_deg = size.w * res;
        var h_deg = size.h * res;
        var center = this.model.map.getCenter();
        var extent = new OpenLayers.Bounds(center.lon - w_deg / 2,
                                           center.lat - h_deg / 2,
                                           center.lon + w_deg / 2,
                                           center.lat + h_deg / 2);
        this.model.map.setCenter(lonlat, this.model.map.getZoomForExtent(extent));
      }
    }
  }

  /**
   * Get the LonLat representation of the actual coordinate
   * @return OpenLayers.LonLat
   */
  this.getLonLat = function() {
    var coordForm = document.getElementById(this.formName);
    var lonlat = null;
    if (this.showPx) {
      if (coordForm.px && coordForm.py)
        if (coordForm.px.value.length >0 && coordForm.py.value.length > 0)
          lonlat = this.model.map.getLonLatFromPixel(new OpenLayers.Pixel(coordForm.px.value, coordForm.py.value));
        else if (coordForm.px.value.length >0)
          lonlat = this.model.map.getLonLatFromPixel(new OpenLayers.Pixel(coordForm.px.value, 0));
        else if (coordForm.py.value.length >0)
          lonlat = this.model.map.getLonLatFromPixel(new OpenLayers.Pixel(0, coordForm.py.value));
    }
    if (this.showXY) {
      if (coordForm.x && coordForm.y)
        if (coordForm.x.value.length > 0 && coordForm.y.value.length > 0)
          lonlat = new OpenLayers.LonLat(coordForm.x.value, coordForm.y.value);
        else if (coordForm.x.value.length >0)
          lonlat = new OpenLayers.LonLat(coordForm.x.value, 0);
        else if (coordForm.y.value.length >0)
          lonlat = new OpenLayers.LonLat(0, coordForm.y.value);
    }
    if (this.showLatLong) {
      if (coordForm.longitude && coordForm.latitude) 
        if (coordForm.longitude.value.length > 0 && coordForm.latitude.value.length > 0) 
          lonlat = new OpenLayers.LonLat(coordForm.longitude.value, coordForm.latitude.value);
        else if (coordForm.longitude.value.length >0)
          lonlat = new OpenLayers.LonLat(coordForm.longitude.value, 0);
        else if (coordForm.latitude.value.length >0)
          lonlat = new OpenLayers.LonLat(0, coordForm.latitude.value);
    }
    // TODO support this.showDMS, this.showDM and this.showMGRS
    return lonlat;
  }
}
