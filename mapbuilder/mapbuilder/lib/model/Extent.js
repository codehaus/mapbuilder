/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Encapsulates all geographic and image size aspects of a context document.
 * All coordinates are handled as points which is a 2 element array, where x is 
 * the first element and y is the second. Coordinates are either pixel and lixel
 * (pl) relative to the top left of the extent or projection XY values (xy). 
 *
 * @constructor
 *
 * @param context       the context document that this extent represents
 *
 * @method GetCenter    returns the XY coordinates of the center of the extent
 * @method GetXY        pass in PL coords and returns projection XY
 * @method GetPL        pass in projection XY and returns PL coords 
 * @method FitToWindow  adjusts the resolution so that it fits 
 * @method CenterAt     reset the extent to be centered at given xy and resolution
 * @method ZoomToBox    reset the extent to given bbox
 * @method SetSize      pass in a resolution and width, height are recalculated
 * @method SetResolution pass in a width, height and res is recalculated
 */

function Extent( context ) {
  this.context = context;
  var bbox = this.context.getBoundingBox();
  this.ul = new Array(bbox[0],bbox[3]);
  this.lr = new Array(bbox[2],bbox[1]);
  this.size = new Array();
  this.res = new Array();
  this.zoomBy = 4;

//give some methods for an extent object
	this.GetCenter = getCenter;
	this.GetXY = getXYCoords;
	this.GetPL = getPLCoords;
	this.FitToWindow = fitToWindow;
	this.Reset = reset;
	this.CenterAt = centerAt;
	this.ZoomToBox = zoomToBox;
  this.SetSize = setSize;                 //pass in a resolution and width, height are recalculated
	this.SetResolution = setResolution;     //pass in a width, height and res is recalculated

  this.SetResolution( new Array(context.getWindowWidth(), context.getWindowHeight() ) );
}

/**
 * Adjust the width and height to that bbox is displayed at specified resolution
 * @param res   the resolution to be set
 */
//TBD not tested;  update the context doc
function setSize(res) {
	this.res[0] = this.res[1] = res;
	this.size[0] = (this.lr[0] - this.ul[0])/this.res[0];
	this.size[1] = (this.ul[1] - this.lr[1])/this.res[1];
	this.width = Math.ceil(this.size[0]);
	this.height = Math.ceil(this.size[1]);
}

/**
 * Adjust the resolution so the bbox fits in the specified width and height
 * @param size   width, height array passed in
 */
//TBD not tested;  update the context doc
function setResolution(size) {
	this.size[0] = size[0];
	this.size[1] = size[1];
	this.res[0] = (this.lr[0] - this.ul[0])/this.size[0];
	this.res[1] = (this.ul[1] - this.lr[1])/this.size[1];
	this.width = Math.ceil(this.size[0]);
	this.height = Math.ceil(this.size[1]);
}


/**
 * Returns the XY center of this extent
 * @return  array of XY for th center of the extent
 */
function getCenter() {
	return new Array((this.ul[0]+this.lr[0])/2, (this.ul[1]+this.lr[1])/2);
}

/**
 * Returns XY coordinates for given pixel line coords w.r.t. top left corner
 * @param pl   pixel line in extent to calculate
 * @return     point array of XY coordinates
 */
function getXYCoords(pl) {
	var x = this.ul[0]+pl[0]*this.res[0];
	var y = this.ul[1]- pl[1]*this.res[1];
	return new Array(x,y);
}

/**
 * Returns pixel/line coordinates for given XY projection coords
 * @param xy   projection XY coordinate to calculate
 * @return     point array of pxiel/line coordinates w.r.t. top left corner
 */
function getPLCoords(xy) {
	var p = Math.floor( (xy[0]-this.ul[0])/this.res[0] );
	var l = Math.floor( (this.ul[1]-xy[1])/this.res[1] );
	return new Array(p,l);
}

/**
 * Adjust the extent so that it is centered at given XY coordinate with given
 * resolution.  Extent width and height remain fixed.  Optionally check to 
 * ensure that it doesn't go beyond available extent.
 *
 * @param center      projection XY coordinate to center at
 * @param res         resolution to display at
 * @param limitExtent ensure that the extent doesn't go beyond available bbox (TBD: not complete/tested)
 * @return            none
 */
function centerAt(center, newres, limitExtent) {
  var half = new Array(this.size[0]/2, this.size[1]/2);
	this.lr = new Array(center[0]+half[0]*newres, center[1]-half[1]*newres);
	this.ul = new Array(center[0]-half[0]*newres, center[1]+half[1]*newres);
  
  //make sure the request doesn't extend beyond the available context
  //TBD this block not tested
  if ( limitExtent ) {
    var xShift = 0;
    if ( this.lr[0] > ContextExtent.lr[0] ) xShift = ContextExtent.lr[0] - this.lr[0];
    if ( this.ul[0] < ContextExtent.ul[0] ) xShift = ContextExtent.ul[0] - this.ul[0];
    this.lr[0] += xShift;
    this.ul[0] += xShift;

    var yShift = 0;
    if ( this.lr[1] < ContextExtent.lr[1] ) yShift = ContextExtent.lr[1] - this.lr[1];
    if ( this.ul[1] > ContextExtent.ul[1] ) yShift = ContextExtent.ul[1] - this.ul[1];
    this.lr[1] += yShift;
    this.ul[1] += yShift;
  }

  this.context.setBoundingBox( new Array(this.ul[0], this.lr[1], this.lr[0], this.ul[1]) );
	//this.SetResolution(size);
	this.SetSize(newres);
}

/**
 * Adjust the extent to the given bbox.  Resolution is recalculated. 
 * Extent width and height remain fixed.  
 *
 * @param ul      upper left coordinate of bbox in XY projection coords
 * @param lr      lower right coordinate of bbox in XY projection coords
 * @param limitExtent ensure that the extent doesn't go beyond available bbox (TBD: not complete/tested)
 * @return            none
 */
function zoomToBox(ul, lr) {    //pass in xy
  var center = new Array((ul[0]+lr[0])/2, (ul[1]+lr[1])/2);
  newres = Math.max((lr[0] - ul[0])/this.size[0], (ul[1] - lr[1])/this.size[1]);
  this.CenterAt( center, newres );
} 


/**
 * Fit the whole extent in the given sized window.  Starts at given res and zooms
 * out by 2 until it fits, or maxres is reached.
 * TBD: not  complete or tested
 *
 * @param size      size of the window to fit to
 * @param minres    resolution starting point 
 * @param maxres    resolution stopping point
 * @return            none
 */
function fitToWindow(size, minres, maxres) {
	var zoomby = 2;
	this.res[0] = this.res[1] = minres;		//assumes square pixels
	var test =  this.GetPL(this.lr);
	while	( (test[0]>size[0] || test[1]>size[1]) && (this.res[0] < maxres) ) {
		this.res[0] *= zoomby;
		this.res[1] *= zoomby;
		test =  this.GetPL(this.lr);
	}
  //call centerAt with test as res
}

function reset() {
  //TBD: do something with size?
  var originalExtent = this.context.originalExtent;
  this.CenterAt( originalExtent.GetCenter(), originalExtent.res[0] );
}

