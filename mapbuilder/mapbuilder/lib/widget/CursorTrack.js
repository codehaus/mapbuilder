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
  this.showDMS	  = false;		// Lat/long in DD MM SS format
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

      if( objRef.coordForm.latdeg )
        objRef.coordForm.latdeg.value = "";
      if( objRef.coordForm.latmin )
        objRef.coordForm.latmin.value = "";
      if( objRef.coordForm.latsec )
        objRef.coordForm.latsec.value = "";
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
    } else {
      alert(objRef.getMessage("noMouseHandler"));
    }
    
    if( objRef.showLatLong || objRef.showDMS || objRef.showMGRS ) {
      objRef.proj = new Proj( objRef.model.getSRS() );
    }

    if( this.showMGRS )
      this.MGRS = new MGRS();
  }
  
  this.model.addListener("loadModel", this.init, this );

  //set some properties for the form output
  this.formName = "CursorTrackForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);

}

/**
  * Decimal to DMS conversion
  */
function convertDMS(coordinate, type) {

    coordinate = Math.floor(coordinate*100);
    coordinate = coordinate/100;

    abscoordinate = Math.abs(coordinate)
    coordinatedegrees = Math.floor(abscoordinate);

    coordinateminutes = (abscoordinate - coordinatedegrees)/(1/60);
    tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    coordinateseconds = (tempcoordinateminutes - coordinateminutes)/(1/60);
    coordinateseconds =  Math.floor(coordinateseconds);

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
  if( coordinatedegrees < 10 )
    coordinatedegrees = "0" + coordinatedegrees;
    
  if( coordinateminutes < 10 )
    coordinateminutes = "0" + coordinateminutes;
    
  if( coordinateseconds < 10 )
    coordinateseconds = "0" + coordinateseconds;
    
  coordinate = coordinatedegrees + " " + coordinateminutes + " " + coordinateseconds + " " + coordinatehemi;

  return coordinate;       
}

/**
 * A method which actually outputs the coordinates to the form.  This is a
 * global method because it is called by a Javascript setInterval timer.
 */
function ReportCoords() {
  var objRef = window.cursorTrackObject;
  
  if (objRef.mouseOver) {
    var evPL =  window.cursorTrackNode.evpl;

	// capture the pixel coordinates
	if( objRef.showPx ) {    
      if( objRef.coordForm.px )
        objRef.coordForm.px.value = evPL[0];

      if( objRef.coordForm.py )
        objRef.coordForm.py.value = evPL[1];
    }
    
    // capture XY coordinates
    var evXY = objRef.model.extent.getXY( evPL );
    
    // store them
    if( objRef.showXY ) {
      if( objRef.coordForm.x )
        objRef.coordForm.x.value = evXY[0].toFixed(objRef.precision);;
      if( objRef.coordForm.y )
        objRef.coordForm.y.value = evXY[1].toFixed(objRef.precision);;
    }
    
    if( objRef.showLatLong || objRef.showDMS || objRef.showMGRS ) {
	    var evLatLon = objRef.proj.Inverse( evXY );   //convert to lat/long
	    
        if( objRef.showLatLong ) {
	      if( objRef.coordForm.longitude )
	        objRef.coordForm.longitude.value = evLatLon[0].toFixed(objRef.precision);
	    
	      if( objRef.coordForm.latitude )
	        objRef.coordForm.latitude.value = evLatLon[1].toFixed(objRef.precision);
	    }
        
        if( objRef.showDMS ) {
          var longitude = convertDMS(evLatLon[0], 'LON').split(" ");
          if( objRef.coordForm.longdeg )
            objRef.coordForm.longdeg.value = longitude[0];          
          if( objRef.coordForm.longmin )
            objRef.coordForm.longmin.value = longitude[1];
          if( objRef.coordForm.longsec )
            objRef.coordForm.longsec.value = longitude[2];           
         if( objRef.coordForm.longH )
            objRef.coordForm.longH.value = longitude[3];

          var latitude = convertDMS(evLatLon[1], 'LAT').split(" ");
          if( objRef.coordForm.latdeg )
            objRef.coordForm.latdeg.value = latitude[0];          
          if( objRef.coordForm.latmin )
            objRef.coordForm.latmin.value = latitude[1];
          if( objRef.coordForm.latsec )
            objRef.coordForm.latsec.value = latitude[2];
          if( objRef.coordForm.latH )
            objRef.coordForm.latH.value = latitude[3];
        }
        
	    if( objRef.showMGRS ) {
	      if( !objRef.MGRS )
	        objRef.MGRS = new MGRS();
          objRef.coordForm.mgrs.value = objRef.MGRS.convert(evLatLon[1],evLatLon[0]) ;
        }
      }
  }
}
