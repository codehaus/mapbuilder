/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Extent.js 2546M 2007-01-26 16:22:11Z (local) $
*/

OpenLayers.DOTS_PER_INCH = 90.714; 		//option in mapbuilder
//OpenLayers.DOTS_PER_INCH = 72;       //option in openlayer 



var Rearth = 6378137.0;                 // Radius of the earth (sphere); different from Proj value?
var degToMeter = Rearth*2*Math.PI/360;
//var mbScaleFactor = 72 * 39.3701;   //PixelsPerInch*InchesPerMapUnit; magic numbers 
                               //need to determine magic number for lat/lon

var mbScaleFactorDegrees = OpenLayers.DOTS_PER_INCH * 4374754; 
var mbScaleFactorMeters = OpenLayers.DOTS_PER_INCH * 39.3701;
//var mbScaleFactorMeters = 3571.428;   //magic number, for Geoserver SLD compatibility
                               // 1/0.00028 (0.28 mm "is a common actual size for
                               // contemporary display" as written in the SLD specification ...
 
/*
 * FD 2005/03/04 : minScale et maxScale
 * DGR : should be in config ?
 */
var minScale = 1000;
var maxScale = 200000;

/**
 * A tool designed to handle geography calculations for widgets which render
 * the model in 2D.
 * Use of this tool requires that it's model implements get/setWindowHeight/Width
 * methods.
 * Encapsulates all geography and image size aspects of a geographic object 
 * displayed in a rectangular area on the screen.
 * All coordinates are handled as points which is a 2 element array, where x is 
 * the first element and y is the second. Coordinates are either pixel and lixel
 * (pl) relative to the top left of the extent or projection XY values (xy). 
 *
 * @constructor
 * @param model       the model document that this extent represents
 * @param initialRes  (optional) if supplied the extent resolution will be set to this value
 */
function Extent( model, initialRes ) {
  this.model = model;
  this.id = model.id + "_MbExtent" + mbIds.getId();
  this.size = new Array();
  this.res = new Array();
  this.zoomBy = 4;
  
  /**
   * Returns the bounding box as stored in the model
   * @return array with the bounding box
   */
  this.getBbox = function() {
    var bbox = this.model.getBoundingBox();
    return bbox;
  }
  
  /**
   * Recalculates a given bbox and stores a proper aspect one in the model
   * @param bbox  an array with a bounding box
   */
  this.setBbox = function(bbox){
    size = this.getSize();
    res = Math.max((bbox[2] - bbox[0])/size[0], (bbox[3] - bbox[1])/size[1]);
    scale=this.getFixedScale(res);
    center = new Array((bbox[1]-bbox[3])/2,(bbox[0]-bbox[2])/2);//center=horizontal,vertical
    half = new Array(size[0]/2,size[1]/2);
    bbox = new Array(center[0]-half[0]*scale, center[1]-half[1]*scale, center[0]+half[0]*scale,center[1]+half[1]*scale);
    this.model.setBoundingBox(bbox);
  }
  
   /**
   * Returns the window size as stored in the model
   * @return array with the window size
   */
  this.getSize = function() {
    size= new Array();
    size[0] = this.model.getWindowWidth();
    size[1] = this.model.getWindowHeight();
    return size;
  }
  
   /**
   * Stores a given window size in the model.
   * Can be used in the future for dynamic window resizing
   * @param size  an array with a window size
   */
  this.setSize = function(size){
    this.model.setWindowWidth(size[0]);
    this.model.setWindowHeight(size[1]);
  }
  
   /**
   * When given a res, it recalculates it to match the zoomlevels, when present and returns a fixed scale.
   * When no res is given it returns the maximum resolution
   * @param res optional resolution to be checked
   * @return fixedScale the resolution to display the map with
   */
  this.getFixedScale = function(res) {
  if (this.zoomLevels){
    if (!res) {
      this.setResolution( new Array(this.model.getWindowWidth(), this.model.getWindowHeight() ) );
      res = Math.max(this.res[0],this.res[1]);
     
    }
    var zoomLevels = this.zoomLevels.sort(function sort(a,b){return b-a});
    var i=0;
    while(zoomLevels[i] >= res){
      i++;
    }
    if(i==0) {
    i=1;
    }
    this.fixedScale = zoomLevels[i-1];
    }
    else this.fixedScale = Math.max(this.res[0],this.res[1]);
    return this.fixedScale;
    
  }
  
  /* 
   * Sets the zoomLevels in the extent
   * @param enabled boolean to enable or disable zoomLevels support
   * @param zoomLevels an array containing a fixed set of zoomLevels
   */
  this.setZoomLevels = function(enabled,zoomLevels){
    if(enabled) {
      this.zoomLevels = zoomLevels;
    }
    else this.zoomLevels = null;
  }
 
  /*
   * Recalculates the lr and ul to a proper aspect. It also takes into account zoomLevels when present.
   */
  this.checkBbox = function() {
    var center = this.getCenter();
    var half = new Array(this.size[0]/2, this.size[1]/2);
    var res = this.res[0];
    this.lr = new Array(center[0]+half[0]*res, center[1]-half[1]*res);
    this.ul = new Array(center[0]-half[0]*res, center[1]+half[1]*res);
  }
  /**
   * Returns the XY center of this extent
   * @return  array of XY for th center of the extent
   */
  this.getCenter = function() {
    return new Array((this.ul[0]+this.lr[0])/2, (this.ul[1]+this.lr[1])/2);
  }

  /**
   * Returns XY coordinates for given pixel line coords w.r.t. top left corner
   * @param pl   pixel line in extent to calculate
   * @return     point array of XY coordinates
   */
  this.getXY = function(pl) {

    var pixel = new OpenLayers.Pixel(pl[0],pl[1]);
	var coord = this.model.map.getLonLatFromPixel(pixel);
	var xy = coord.toShortString().split(',');
	return new Array(parseFloat(xy[0]),parseFloat(xy[1]));

  }

  /**
   * Returns pixel/line coordinates for given XY projection coords
   * @param xy   projection XY coordinate to calculate
   * @return     point array of pxiel/line coordinates w.r.t. top left corner
   */
  this.getPL = function(xy) {

	var plOL = this.model.map.getPixelFromLonLat(new OpenLayers.LonLat(xy[0],xy[1]));
	var pl = plOL.toString().split(',');
	var plx = pl[0].split('=');
	var ply = pl[1].split('=');
    return new Array(Math.floor(parseFloat(plx[1])),Math.floor(parseFloat(ply[1])));
    
  }

  /**
   * Adjust the extent so that it is centered at given XY coordinate with given
   * resolution.  Extent width and height remain fixed.  Optionally check to 
   * ensure that it doesn't go beyond available extent.
   *
   * @param center      projection XY coordinate to center at
   * @param newres      resolution to display at
   * @param limitExtent ensure that the extent doesn't go beyond available bbox (TBD: not complete/tested)
   * @return            none
   */
  this.centerAt = function(center, zoom) {
    
    this.model.map.setCenter(new OpenLayers.LonLat(center[0],center[1]),this.model.map.getZoom()+zoom);
    this.updateMB();
  }

  /**
   * Adjust the extent to the given bbox.  Resolution is recalculated. 
   * Extent width and height remain fixed.  
   * @param ul      upper left coordinate of bbox in XY projection coords
   * @param lr      lower right coordinate of bbox in XY projection coords
   */
  this.zoomToBox = function(ul, lr) {    //pass in xy
    var center = new Array((ul[0]+lr[0])/2, (ul[1]+lr[1])/2);
    this.model.map.zoomToExtent(new OpenLayers.Bounds(ul[0], lr[1], lr[0], ul[1]));
    this.updateMB();
    
  } 

/**
   * Adjust the width and height to that bbox is displayed at specified resolution
   * @param res   the resolution to be set
   */
  //TBD update the model doc
  this.setSize = function(res) {     //pass in a resolution and width, height are recalculated
    this.res[0] = res[0];
    this.res[1] = res[1];
    this.size[0] = (this.lr[0] - this.ul[0])/this.res[0];
    this.size[1] = (this.ul[1] - this.lr[1])/this.res[1];
    this.width = Math.ceil(this.size[0]);
    this.height = Math.ceil(this.size[1]);
  }

  /**
   * Adjust the resolution so the bbox fits in the specified width and height
   * @param size   width, height array passed in
   */
  //TBD update the model doc
  this.setResolution = function(size) {    //pass in a width, height and res is recalculated
    this.size[0] = size[0];
    this.size[1] = size[1];
    this.res[0] = (this.lr[0] - this.ul[0])/this.size[0];
    this.res[1] = (this.ul[1] - this.lr[1])/this.size[1];
    this.width = Math.ceil(this.size[0]);
    this.height = Math.ceil(this.size[1]);
  }

  /**
   * Returns the map scale denominator for the current extent resolution
   * @return map scale denominator
   */
  this.getScale = function() {
    var pixRes = null;
    switch(this.model.proj.units) {
      case "GMAPS":
        break;
      case "degrees":				//all projection codes in degrees		
        
        scale=this.res[0]*mbScaleFactorDegrees;
        break;
      case "m":                //all projection codes in meters
        scale=this.res[0]*mbScaleFactorMeters;
        break;
    }
    
    return scale ;
  }

  /**
   * Sets the model's resolution from mapScale input value.  The map center 
   * remains fixed.
   * @param scale   map scale denominator value
   */
  this.setScale = function(scale) {
    var newRes = null;
	var currentZoom=this.model.map.getZoom();
	
    switch(this.model.proj.units) {
      case "degrees":				//all projection codes in degrees		
        //convert to resolution in degrees
        newRes = scale/mbScaleFactorDegrees;
        break;
      case "m":                     //all projection codes in meters
        newRes = scale/mbScaleFactorMeters;
        break;
    }
    //alert("extent.js l274 "+mbScaleFactor+" * "+degToMeter);
    this.model.map.zoomToScale(scale);
    if(this.model.map.getZoom()==currentZoom)
    {	
    	this.model.map.zoomTo(currentZoom+1);
		this.model.map.zoomTo(currentZoom);
	}
    //this.model.map.zoomToResolution(newRes);
    
    //OpenLayers.Util.getResolutionFromScale(this.extent.getScale(),"m"));
//alert(objRef.model.extent.getScale()+" "+360/600+" "+OpenLayers.Util.getResolutionFromScale(objRef.model.extent.getScale(),"m"));
            //objRef.oLlayers[name2].resolutions = [];
			//objRef.model.map.zoomTo(1);
			//objRef.model.map.zoomTo(0);
			// var resolution = scale /( OpenLayers.INCHES_PER_UNIT[units]* OpenLayers.DOTS_PER_INCH *6378137.0*2*Math.PI/360);
  //objRef.model.map.zoomTo(1);
//objRef.model.map.zoomTo(0);
   this.updateMB();
   
    
  }

/**
   * Update resolution and bbox of MB after OL transformation
   * @param 
   */
  this.updateMB = function() {
  	var bboxOL=this.model.map.getExtent().toBBOX().split(',');
    this.ul = new Array(bboxOL[0],bboxOL[3]);
    this.lr = new Array(bboxOL[2],bboxOL[1]);
    this.model.setBoundingBox( new Array(this.ul[0], this.lr[1], this.lr[0], this.ul[1]) );
    this.setSize(new Array(this.model.map.getResolution(),this.model.map.getResolution()));
  }
  /**
   * Initialization of the Extent tool, called as a loadModel event listener.
   * @param extent      the object being initialized
   * @param initialRes  (optional) if supplied the extent resolution will be set to this value
   */
  this.init = function(extent, initialRes) {
    var bbox = extent.model.getBoundingBox();
    extent.ul = new Array(bbox[0],bbox[3]);
    extent.lr = new Array(bbox[2],bbox[1]);
    

/*
TBD: when called as a listener this gets a bbox array passed in, not initialRes value
    if ( initialRes ) {
      extent.setSize( initialRes );
    } else {
      extent.setResolution( new Array(extent.model.getWindowWidth(), extent.model.getWindowHeight() ) );
    }
*/
    extent.setResolution( new Array(extent.model.getWindowWidth(), extent.model.getWindowHeight() ) );
    extent.checkBbox();
  }
  if ( initialRes ) this.init(this, initialRes);


  this.firstInit = function(extent, initialRes) {
  	extent.init(extent, initialRes);
  }

}

  
  
