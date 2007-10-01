/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");

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
  this.showPx      = false; // pixel coordinates
  this.showXY      = false; // XY Coordinates
  this.showLatLong = true;  // Standard lat long
  this.showDMS     = false; // Lat/long in DD MM SS.S format
  this.showDM      = false; // Lat/long in DD MM.MMMM format
  this.showMGRS    = false; // Military Grid Reference System
  this.precision   = 2;

  var showPx = widgetNode.selectSingleNode("mb:showPx");
  if( showPx )
    this.showPx = (showPx.firstChild.nodeValue=="false")?false:true;

  var showXYNode = widgetNode.selectSingleNode("mb:showXY");
  if (showXYNode)
    this.showXY = (showXYNode.firstChild.nodeValue=="false")?false:true;

  var showLatLong = widgetNode.selectSingleNode("mb:showLatLong");
  if( showLatLong )
    this.showLatLong = (showLatLong.firstChild.nodeValue=="false")?false:true;

  var showDMS = widgetNode.selectSingleNode("mb:showDMS");
  if( showDMS )
    this.showDMS = (showDMS.firstChild.nodeValue=="false")?false:true;

  var showDM = widgetNode.selectSingleNode("mb:showDM");
  if( showDM )
    this.showDM = (showDM.firstChild.nodeValue=="false")?false:true;

  var showMGRS = widgetNode.selectSingleNode("mb:showMGRS");
  if( showMGRS ) {
    this.showMGRS = (showMGRS.firstChild.nodeValue=="false")?false:true;
    // load this here so it is not required for everyone
    mapbuilder.loadScript(baseDir+"/util/MGRS.js");
  }

  var precision = widgetNode.selectSingleNode("mb:precision");
  if (precision)
    this.precision = precision.firstChild.nodeValue;

  //set some properties for the form output
  this.formName = "CursorTrackForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);


  /**
   * Add mouse event listeners to the map object in the model.
   * @param objRef Pointer to this CursorTrack object.
   */
  this.init = function(objRef) {
    objRef.proj = new Proj( objRef.model.getSRS() );
    objRef.epsg4326 = new CS(csList.EPSG4326);

    objRef.model.map.events.register('mousemove', objRef, objRef.mousemoveHandler);
    objRef.model.map.events.register('mouseout',  objRef, objRef.mouseoutHandler);

    if( this.showMGRS )
      this.MGRS = new MGRS();
  }

  this.model.addListener("loadModel", this.init, this );

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
    var pt=new PT(evXY.lon, evXY.lat)
    cs_transform(this.proj, this.epsg4326, pt);
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
}
