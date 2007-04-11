/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");

/**
 * Widget to display the mouse coordinates when it is over a MapContainer widget.
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function CursorTrack(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  //by default, display coords in latlon; if false show map XY
  this.showPx 	  = false;		// pixel coordinates
  this.showXY 	  = false;		// XY Coordinates
  this.showLatLong = true;		// Standard lat long
  this.showDMS	  = false;		// Lat/long in DD MM SS.S format
  this.showDM	    = false;    // Lat/long in DD MM.MMMM format
  this.showMGRS 	  = false;		// Military Grid Reference System
  this.precision   = 2;
	
  var showXYNode = widgetNode.selectSingleNode("mb:showXY");
  if (showXYNode) 
  	this.showXY = (showXYNode.firstChild.nodeValue=="false")?false:true;
  
  var showPx = widgetNode.selectSingleNode("mb:showPx");
  if( showPx )
  	this.showPx = (showPx.firstChild.nodeValue=="false")?false:true;

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
  
  /**
   * Start cursor tracking when the mouse is over the MapContainer.
   * set an interval to output the coords so that it doesn't execute on every
   * move event.  The setInterval method in IE doesn't allow passing of an
   * argument to the function called so set a global reference to MapContainer
   * here;  mouse can only be over one MapContainer at time so this should be safe.
   * @param objRef Pointer to this CurorTrack object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseOverHandler = function(objRef, targetNode) {
    objRef.coordForm = document.getElementById(objRef.formName);
    window.cursorTrackObject = objRef;
    window.cursorTrackNode = targetNode;
    objRef.mouseOver = true;
    objRef.mouseTrackTimer = setInterval( ReportCoords, 100, objRef);
  }

  /**
   * Stop cursor tracking when the mouse leaves the MapContainer.
   * @param objRef Pointer to this CurorTrack object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseOutHandler = function(objRef, targetNode) {
    
    if (objRef.mouseTrackTimer) 
    		clearInterval(objRef.mouseTrackTimer);
    
    objRef.mouseOver = false;
    
    if( objRef.showLatLong ) {
      if( objRef.coordForm.longitude )
        objRef.coordForm.longitude.value = "";
  	    if( objRef.coordForm.latitude )
        objRef.coordForm.latitude.value = "";
    } 

    if( objRef.showDMS ) {
      if( objRef.coordForm.longdeg )
        objRef.coordForm.longdeg.value = "";
      if( objRef.coordForm.longmin )
        objRef.coordForm.longmin.value = "";
      if( objRef.coordForm.longsec )
        objRef.coordForm.longsec.value = "";
      if( objRef.coordForm.longH )
        objRef.coordForm.longH.value = "";

      if( objRef.coordForm.latdeg )
        objRef.coordForm.latdeg.value = "";
      if( objRef.coordForm.latmin )
        objRef.coordForm.latmin.value = "";
      if( objRef.coordForm.latsec )
        objRef.coordForm.latsec.value = "";
      if( objRef.coordForm.latH )
        objRef.coordForm.latH.value = "";
    } 

    if( objRef.showDM ) {
      if( objRef.coordForm.longDMdeg )
        objRef.coordForm.longDMdeg.value = "";
      if( objRef.coordForm.longDMmin )
        objRef.coordForm.longDMmin.value = "";
      if( objRef.coordForm.longDMH )
        objRef.coordForm.longDMH.value = "";

      if( objRef.coordForm.latDMdeg )
        objRef.coordForm.latDMdeg.value = "";
      if( objRef.coordForm.latDMmin )
        objRef.coordForm.latDMmin.value = "";
      if( objRef.coordForm.latDMH )
        objRef.coordForm.latDMH.value = "";
    } 
    
    if( objRef.showXY ) {
    	  if( objRef.coordForm.x)
        objRef.coordForm.x.value = "";
      if( objRef.coordForm.y)
        objRef.coordForm.y.value = "";
    }
    
    if( objRef.showPx ) {
      if( objRef.coordForm.px)
        objRef.coordForm.px.value = "";
      if( objRef.coordForm.py)
        objRef.coordForm.py.value = "";
    }
    
    if( objRef.showMGRS ) {
      if( objRef.coordForm.mgrs )
        objRef.coordForm.mgrs.value = "";
    }
  }

  /**
   * Add mouse event listeners to the MapContainer object sepecified by the
   * mouseHandler property in config.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.init = function(objRef) {
    //associate the cursor track with a mappane widget
    var mouseHandler = widgetNode.selectSingleNode("mb:mouseHandler");
    if (mouseHandler) {
      objRef.mouseHandler = window.config.objects[mouseHandler.firstChild.nodeValue];
      objRef.mouseHandler.addListener('mouseover', objRef.mouseOverHandler, objRef);
      objRef.mouseHandler.addListener('mouseout', objRef.mouseOutHandler, objRef);
      objRef.model.map.events.register('mousemove', objRef, objRef.redraw);
    } else {
      alert(mbGetMessage("noMouseHandlerCursorTrack"));
    }
    
    if( objRef.showLatLong || objRef.showDMS || objRef.showDM || objRef.showMGRS ) {
      objRef.proj = new Proj( objRef.model.getSRS() );
    }

    if( this.showMGRS )
      this.MGRS = new MGRS();
  }
  
  this.model.addListener("loadModel", this.init, this );

  //set some properties for the form output
  this.formName = "CursorTrackForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);

  /**
   * OpenLayers mouse event listener.
   * @param evt OpenLayers mouse event
   */
  this.redraw = function(evt) {
    if (evt == null) {
      this.lastXy = new OpenLayers.Pixel(0, 0);
    }
    else {
      this.lastXy = evt.xy;
    }
  }
}

/**
  * Decimal to DMS conversion
  */
function convertDMS(coordinate, type) {
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
  coords[3] = getHemi(coordinate, type);

  return coords;       
}

/**
  * Decimal to DM (degrees plus decimal minutes) conversion
  */
function convertDM(coordinate, type) {
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
  coords[2] = getHemi(coordinate, type);

  return coords;       
}

/**
 * Return the hemisphere abbreviation for this coordinate.
 */
function getHemi(coordinate, type) {
  var coordinatehemi = "";
  if (type == 'LAT') {
    if (coordinate >= 0) {
      coordinatehemi = "N";
    } else {
      coordinatehemi = "S";
    }
  } else if (type == 'LON') {
    if (coordinate >= 0) {
      coordinatehemi = "E";
    } else {
      coordinatehemi = "W";
    }
  }
  
  return coordinatehemi;
}

/**
 * A method which actually outputs the coordinates to the form.  This is a
 * global method because it is called by a Javascript setInterval timer.
 */
function ReportCoords() {
  var objRef = window.cursorTrackObject;
  
  if (objRef.mouseOver) {
	// capture the pixel coordinates
	if( objRef.showPx ) {    
      if( objRef.coordForm.px )
        objRef.coordForm.px.value = objRef.lastXy.x;

      if( objRef.coordForm.py )
        objRef.coordForm.py.value = objRef.lastXy.y;
    }
    
    // capture XY coordinates 
    var evXY = objRef.model.map.getLonLatFromPixel(objRef.lastXy);
    var evInverse = objRef.proj.Inverse([evXY.lon, evXY.lat]);
    var evLonLat=new OpenLayers.LonLat(evInverse[0],evInverse[1]);
    // store them
    if( objRef.showXY ) {
      if( objRef.coordForm.x )
        objRef.coordForm.x.value = evXY.lon.toFixed(objRef.precision);;
      if( objRef.coordForm.y )
        objRef.coordForm.y.value = evXY.lat.toFixed(objRef.precision);;
    }
    
    if( objRef.showLatLong || objRef.showDMS || objRef.showDM || objRef.showMGRS ) {
        if( objRef.showLatLong ) {
	      if( objRef.coordForm.longitude )
	        objRef.coordForm.longitude.value = evLonLat.lon.toFixed(objRef.precision);
	    
	      if( objRef.coordForm.latitude )
	        objRef.coordForm.latitude.value = evLonLat.lat.toFixed(objRef.precision);
	    }
        
        if( objRef.showDMS ) {
          var longitude = convertDMS(evLonLat.lon, 'LON');
          if( objRef.coordForm.longdeg )
            objRef.coordForm.longdeg.value = longitude[0];          
          if( objRef.coordForm.longmin )
            objRef.coordForm.longmin.value = longitude[1];
          if( objRef.coordForm.longsec )
            objRef.coordForm.longsec.value = longitude[2];           
         if( objRef.coordForm.longH )
            objRef.coordForm.longH.value = longitude[3];

          var latitude = convertDMS(evLonLat.lat, 'LAT');
          if( objRef.coordForm.latdeg )
            objRef.coordForm.latdeg.value = latitude[0];          
          if( objRef.coordForm.latmin )
            objRef.coordForm.latmin.value = latitude[1];
          if( objRef.coordForm.latsec )
            objRef.coordForm.latsec.value = latitude[2];
          if( objRef.coordForm.latH )
            objRef.coordForm.latH.value = latitude[3];
        }
        
        if( objRef.showDM ) {
          var longitude = convertDM(evLonLat.lon, 'LON');
          if( objRef.coordForm.longDMdeg )
            objRef.coordForm.longDMdeg.value = longitude[0];          
          if( objRef.coordForm.longDMmin )
            objRef.coordForm.longDMmin.value = longitude[1];
         if( objRef.coordForm.longDMH )
            objRef.coordForm.longDMH.value = longitude[2];

          var latitude = convertDM(evLonLat.lat, 'LAT');
          if( objRef.coordForm.latDMdeg )
            objRef.coordForm.latDMdeg.value = latitude[0];          
          if( objRef.coordForm.latDMmin )
            objRef.coordForm.latDMmin.value = latitude[1];
          if( objRef.coordForm.latDMH )
            objRef.coordForm.latDMH.value = latitude[2];
        }
        
	    if( objRef.showMGRS ) {
	      if( !objRef.MGRS )
	        objRef.MGRS = new MGRS();
          objRef.coordForm.mgrs.value = objRef.MGRS.convert(evLonLat.lat,evLonLat.lon) ;
        }
      }
  }
}
