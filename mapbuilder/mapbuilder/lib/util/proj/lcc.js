var PI = Math.PI;
var HALF_PI = PI*0.5;
var TWO_PI = PI*2.0;
var EPSLN = 1.0e-10;
var R2D = 57.2957795131;
var D2R =0.0174532925199;
var R = 6370997.0;				// Radius of the earth (sphere)


// Initialize the Lambert Conformal conic projection
// -----------------------------------------------------------------
function lccinit(param) {
// array of:  r_maj,r_min,lat1,lat2,c_lon,c_lat,false_east,false_north
//double c_lat;                   /* center latitude                      */
//double c_lon;                   /* center longitude                     */
//double lat1;                    /* first standard parallel              */
//double lat2;                    /* second standard parallel             */
//double r_maj;                   /* major axis                           */
//double r_min;                   /* minor axis                           */
//double false_east;              /* x offset in meters                   */
//double false_north;             /* y offset in meters                   */

	this.r_major = param[0];
	this.r_minor = param[1];
	var lat1 = param[2] * D2R;
	var lat2 = param[3] * D2R;
	this.center_lon = param[4] * D2R;
	this.center_lat = param[5] * D2R;
	this.false_easting = param[6];
	this.false_northing = param[7];

// Standard Parallels cannot be equal and on opposite sides of the equator
	if (Math.abs(lat1+lat2) < EPSLN) {
		alert("Equal Latitiudes for St. Parallels on opposite sides of equator - lccinit");
		return;
	}

	var temp = this.r_minor / this.r_major;
	this.e = Math.sqrt(1.0 - temp*temp);

	var sin1 = Math.sin(lat1);
	var cos1 = Math.cos(lat1);
	var ms1 = msfnz(this.e, sin1, cos1);
	var ts1 = tsfnz(this.e, lat1, sin1);
	
	var sin2 = Math.sin(lat2);
	var cos2 = Math.cos(lat2);
	var ms2 = msfnz(this.e, sin2, cos2);
	var ts2 = tsfnz(this.e, lat2, sin2);
	
	var ts0 = tsfnz(this.e, this.center_lat, Math.sin(this.center_lat));

	if (Math.abs(lat1 - lat2) > EPSLN) {
		this.ns = Math.log(ms1/ms2)/Math.log(ts1/ts2);
	} else {
		this.ns = sin1;
	}
	this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
	this.rh = this.r_major * this.f0 * Math.pow(ts0, this.ns);
}


// Lambert Conformal conic forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
function ll2lcc(coords) {

	var lon = coords[0];
	var lat = coords[1];

// convert to radians
	if ( lat <= 90.0 && lat >= -90.0 && lon <= 180.0 && lon >= -180.0) {
		lat *= D2R;
		lon *= D2R;
	} else {
		alert("*** Input out of range ***: lon: "+lon+" - lat: "+lat);
		return null;
	}

	var con  = Math.abs( Math.abs(lat) - HALF_PI);
	var ts;
	if (con > EPSLN) {
		ts = tsfnz(this.e, lat, Math.sin(lat) );
		rh1 = this.r_major * this.f0 * Math.pow(ts, this.ns);
	} else {
		con = lat * this.ns;
		if (con <= 0) {
			alert("Point can not be projected - ll2lcc");
			return null;
		}
		rh1 = 0;
	}
	var theta = this.ns * adjust_lon(lon - this.center_lon);
	var x = rh1 * Math.sin(theta) + this.false_easting;
	var y = this.rh - rh1 * Math.cos(theta) + this.false_northing;

	return new Array(x,y);
}

// Lambert Conformal Conic inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
function lcc2ll(coords) {

	var rh1, con, ts;
	var lat, lon;
	x = coords[0] - this.false_easting;
	y = this.rh - coords[1] + this.false_northing;
	if (this.ns > 0) {
		rh1 = Math.sqrt (x * x + y * y);
		con = 1.0;
	} else {
		rh1 = -Math.sqrt (x * x + y * y);
		con = -1.0;
	}
	var theta = 0.0;
	if (rh1 != 0) {
		theta = Math.atan2((con * x),(con * y));
	}
	if ((rh1 != 0) || (this.ns > 0.0)) {
		con = 1.0/this.ns;
		ts = Math.pow((rh1/(this.r_major * this.f0)), con);
		lat = phi2z(this.e, ts);
		if (lat == -9999) return null;
	} else {
		lat = -HALF_PI;
	}
	lon = adjust_lon(theta/this.ns + this.center_lon);
	return new Array(R2D*lon, R2D*lat);
}

// Function to compute the constant small m which is the radius of
//   a parallel of latitude, phi, divided by the semimajor axis.
// -----------------------------------------------------------------
function msfnz(eccent, sinphi, cosphi) {
      var con = eccent * sinphi;
      return cosphi/(Math.sqrt(1.0 - con * con));
}

// Function to compute the constant small t for use in the forward
//   computations in the Lambert Conformal Conic and the Polar
//   Stereographic projections.
// -----------------------------------------------------------------
function tsfnz(eccent, phi, sinphi) {
	var con = eccent * sinphi;
	var com = .5 * eccent; 
	con = Math.pow(((1.0 - con) / (1.0 + con)), com);
	return (Math.tan(.5 * (HALF_PI - phi))/con);
}


// Function to compute the latitude angle, phi2, for the inverse of the
//   Lambert Conformal Conic and Polar Stereographic projections.
// ----------------------------------------------------------------
function phi2z(eccent, ts) {
	var eccnth = .5 * eccent;
	var con, dphi;
	var phi = HALF_PI - 2 * Math.atan(ts);
	for (i = 0; i <= 15; i++) {
		con = eccent * Math.sin(phi);
		dphi = HALF_PI - 2 * Math.atan(ts *(Math.pow(((1.0 - con)/(1.0 + con)),eccnth))) - phi;
		phi += dphi; 
		if (Math.abs(dphi) <= .0000000001) return phi;
	}
	alert("Convergence error - phi2z");
	return -9999;
}

// Function to return the sign of an argument
function sign(x) { if (x < 0.0) return(-1); else return(1);}

// Function to adjust longitude to -180 to 180; input in radians
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}


