/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

///////////////////////////////////////////////////////////////////////
// Extent 
//
// Purpose: this object defines the map projection and geographic extent 
//          and resolution of the map layers served by the WMS.
//          Provides methods to convert map xy to image pixel/line.
//
// Parameters:
// srs  - Spatial Reference System; EPSG code to define the map projection
//        in principle any SRS can be supported but currently only these:
//        EPSG:4326 - latitude/longitude grid; xy values are defined in decimal degree units
//        EPSG:42101 - Lambert Conformal Conic (Canada); xy units in meters
//        code for UTM is available but not tested
// ul   - map xy of the upper left corner of the map layer; 2 point array
// lr   - map xy of the lower right corner of the map layer; 2 point array
// minscale - smallest pixel size for the layer to be displayed at (in xy units)
//            will not allow zooming beyond this resolution      
// maxscale - largest pixel size for the layer to be displayed at (in xy units)
//            will not allow zooming less than this resolution      
//
// Methods: (not usually invoked directly in main HTML page
// GetCenter()   - returns the midpoint of the extent
// GetXY(pl)     - converts image pixel line (relative to UL of the extent) to map XY
// GetPL(xy)     - converts to map XY image pixel line (relative to UL of the extent) 
// FitToWindow(size) - sets the width and height of the extent to fit within the specified size
// Reset(extent) - resets the extent objectto have same values as the one passed in
// SetSize(res)  - pass in a resolution and width, height are recalculated
// InitSrs()     - function to initialize the SRS parameters and map projection code
//
function Extent( context ) {
  this.context = context;
  var bbox = this.context.getBoundingBox();
  this.ul = new Array(bbox[0],bbox[3]);
  this.lr = new Array(bbox[2],bbox[1]);
  this.size = new Array();
  this.res = new Array();

  this.proj = new proj( this.context.getSRS() );
	
//give some methods for an extent object
	this.GetCenter = getCenter;
	this.GetXY = getXYCoords;
	this.GetPL = getPLCoords;
	this.FitToWindow = fitToWindow;
	this.CenterAt = centerAt;
	this.ZoomToBox = zoomToBox;
  this.SetSize = setSize;                 //pass in a resolution and width, height are recalculated
	this.SetResolution = setResolution;     //pass in a width, height and res is recalculated

  this.SetResolution( new Array(context.getWindowWidth(), context.getWindowHeight() ) );
}

function setSize(res) {
	this.res[0] = this.res[1] = res;
	this.size[0] = (this.lr[0] - this.ul[0])/this.res[0];
	this.size[1] = (this.ul[1] - this.lr[1])/this.res[1];
	this.width = Math.ceil(this.size[0]);
	this.height = Math.ceil(this.size[1]);
//TBD update the context doc
}

function setResolution(size) {
	this.size[0] = size[0];
	this.size[1] = size[1];
	this.res[0] = (this.lr[0] - this.ul[0])/this.size[0];
	this.res[1] = (this.ul[1] - this.lr[1])/this.size[1];
	this.width = Math.ceil(this.size[0]);
	this.height = Math.ceil(this.size[1]);
//TBD update the context doc
}


function getCenter() {
	return new Array((this.ul[0]+this.lr[0])/2, (this.ul[1]+this.lr[1])/2);
}

function getXYCoords(pl) {
	var x = this.ul[0]+pl[0]*this.res[0];
	var y = this.ul[1]- pl[1]*this.res[1];
	return new Array(x,y);
}

function getPLCoords(xy) {
	var p = Math.floor( (xy[0]-this.ul[0])/this.res[0] );
	var l = Math.floor( (this.ul[1]-xy[1])/this.res[1] );
	return new Array(p,l);
}

function centerAt(center, newres, limitExtent) {
  var half = new Array(this.size[0]/2, this.size[1]/2);
	this.lr = new Array(center[0]+half[0]*newres, center[1]-half[1]*newres);
	this.ul = new Array(center[0]-half[0]*newres, center[1]+half[1]*newres);
  
  //make sure the request doesn't extend beyond the available context
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

function zoomToBox(ul, lr) {    //pass in xy
  var center = new Array((ul[0]+lr[0])/2, (ul[1]+lr[1])/2);
  newres = Math.max((lr[0] - ul[0])/this.size[0], (ul[1] - lr[1])/this.size[1]);
  this.CenterAt( center, newres );
} 


//fit the whole coverage in the DIV by default, zoom out by 2 until it fits
//not tested
function fitToWindow(size, minres, maxres) {
	var zoomby = 2;
	this.res[0] = this.res[1] = minres;		//assumes square pixels
	var test =  this.GetPL(this.lr);
	while	( (test[0]>size[0] || test[1]>size[1]) && (this.res[0] < maxres) ) {
		this.res[0] *= zoomby;
		this.res[1] *= zoomby;
		test =  this.GetPL(this.lr);
	}
  //call center at with test as res
}





