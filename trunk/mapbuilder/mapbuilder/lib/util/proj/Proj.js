/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Provides latitude/longitude to map projection transformation methods. 
 * Initialized with EPSG codes.  Has properties for untis and title strings.
 * All coordinates are handled as points which is a 2 element array where x is 
 * the first element and y is the second. 
 *
 * TBD: retrieve initialization params (and conversion code?) from a web service 
 *
 * @constructor
 *
 * @param srs         The SRS (EPSG code) of the projection
 *
 * @method Forward    pass in lat/lon, returns XY
 * @method Inverse    pass in XY, returns lat/long
 */


function proj(srs) {
	this.srs = srs;
	switch(this.srs) {
		case "EPSG:4326":				//lat/lon projection WGS_84
		case "EPSG:4269":				//lat/lon projection WGS_84
			this.Forward = identity;
			this.Inverse = identity;
      this.units = "degrees";
      this.title = "Lat/Long";
			break;
		case "EPSG:42101":				//North American LCC WGS_84
			this.Init = lccinit;
			this.Forward = ll2lcc;
			this.Inverse = lcc2ll;
			this.Init(new Array(6378137.0,6356752.314245,49.0,77.0,-95.0, 0.0, 0.0, -8000000));
      this.units = "meters";
      this.title = "Lambert Conformal Conic";
			break;
		case "EPSG:42304":				//North American LCC NAD_83
			this.Init = lccinit;
			this.Forward = ll2lcc;
			this.Inverse = lcc2ll;
			this.Init(new Array(6378137.0,6356752.314,49.0,77.0,-95.0, 49.0, 0.0, 0));
      this.units = "meters";
      this.title = "Lambert Conformal Conic";
			break;
		case "EPSG:32761":				//Polar Stereographic
		case "EPSG:32661":
			this.Init = psinit;
			this.Forward = ll2ps;
			this.Inverse = ps2ll;
			this.Init(new Array(6378137.0, 6356752.314245, 0.0, -90.0, 2000000, 2000000));
      this.units = "meters";
      this.title = "Polar Stereographic";
			break;
		case "scene":							//this is really a pixel projection with bilinear interpolation of the corners to get ll
			this.Init = sceneInit;
			this.Forward = ll2scene;
			this.Inverse = scene2ll;
			this.GetXYCoords = identity;	//override to get line 0 at top left
			this.GetPLCoords = identity; //
			break;
		case "pixel":
			this.Forward = ll2pixel;
			this.Inverse = pixel2ll;
			this.units = "pixels";
			this.GetXYCoords = identity;	//override to get line 0 at top left
			this.GetPLCoords = identity; //
			break;
		default:
      //or retrieve parameters from web service based on SRS lookup
			alert("unsupported map projection: "+this.srs);
	}

}

function identity(coords) {
	return coords;
}

// scene projection object definition
// really a pixel representation with bi-linear interpolation of the corner coords
// forward trasnformation need reverse bilinear interpolation or orbit modelling here
// forward transformation
function ll2scene(coords) {
	alert("ll2scene not defined");
	//return new Array(124, 15+256);	//for testing only, 
	return null;
}

// inverse transformation
function scene2ll(coords) {
	var xpct = (coords[0]-this.ul[0])/(this.lr[0]-this.ul[0]);
	var ypct = (coords[1]-this.ul[1])/(this.lr[1]-this.ul[1]);
//	alert("pct:"+xpct+":"+ypct);
	var lon = bilinterp(xpct, ypct, this.cul[0], this.cur[0], this.cll[0], this.clr[0])
	var lat = bilinterp(xpct, ypct, this.cul[1], this.cur[1], this.cll[1], this.clr[1])
	return new Array(lon, lat);
}

function sceneInit(param) {
	this.cul = param[0];
	this.cur = param[1];
	this.cll = param[2];
	this.clr = param[3];
}

function bilinterp(x, y, a, b, c, d) {
	var top = x*(b-a) + a;
	var bot = x*(d-c) + c;
//	alert("top:"+top+"  bot:"+bot);
	return y*(bot-top) + top;
}

// pixel projection object definition
// a pixel representation 
// forward transformation
function ll2pixel(coords) {
	alert("ll2pixel not defined");
	return null;
}

// inverse transformation
function pixel2ll(coords) {
	alert("pixel2ll not defined");
//	return new Array(lon, lat);
	return null;
}


