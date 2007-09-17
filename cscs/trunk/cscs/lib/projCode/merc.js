/*******************************************************************************
NAME                            MERCATOR

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Mercator projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
D. Steinwand, EROS      Nov, 1991
T. Mittan		Mar, 1993

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/

//static double r_major = a;		   /* major axis 				*/
//static double r_minor = b;		   /* minor axis 				*/
//static double lon_center = long0;	   /* Center longitude (projection center) */
//static double lat_origin =  lat0;	   /* center latitude			*/
//static double e,es;		           /* eccentricity constants		*/
//static double m1;		               /* small value m			*/
//static double false_northing = y0;   /* y offset in meters			*/
//static double false_easting = x0;	   /* x offset in meters			*/
//scale_fact = k0 

Proj4js.Proj.merc = Class.create();
Proj4js.Proj.merc = {
  init : function() {
	//?this.temp = this.r_minor / this.r_major;
	this.temp = this.b / this.a;
	this.es = 1.0 - Math.sqrt(this.temp);
	this.e = Math.sqrt( this.es );
	//?this.m1 = Math.cos(this.lat_origin) / (Math.sqrt( 1.0 - this.es * Math.sin(this.lat_origin) * Math.sin(this.lat_origin)));
	this.m1 = Math.cos(0.0) / (Math.sqrt( 1.0 - this.es * Math.sin(0.0) * Math.sin(0.0)));
},

/* Mercator forward equations--mapping lat,long to x,y
  --------------------------------------------------*/

  forward : function(p) {	
    //alert("ll2m coords : "+coords);
    lon = p.x;
    lat = p.y;
    // convert to radians
    if ( lat*Proj4js.const.R2D > 90.0 && 
          lat*Proj4js.const.R2D < -90.0 && 
          lon*Proj4js.const.R2D > 180.0 && 
          lon*Proj4js.const.R2D < -180.0) {
      Proj4js.reportError("merc:forward: llInputOutOfRange: "+ lon +" : " + lat);
      return null;
    } else {
      lon = lon * Proj4js.const.D2R;
      lat = lat * Proj4js.const.D2R;
    }

    if(Math.abs( Math.abs(lat) - Proj4js.const.HALF_PI)  <= Proj4js.const.EPSLN) {
      alert(mbGetMessage("ll2mAtPoles"));
      Proj4js.reportError("merc:forward: ll2mAtPoles");
      return null;
    } else {
      var sinphi = Math.sin(lat);
      var ts = Proj4js.const.tsfnz(this.e,lat,sinphi);
      var x = this.x0 + this.a * this.m1 * Proj4js.const.adjust_lon(lon - this.long0);
      var y = this.y0 - this.a * this.m1 * Math.log(ts);
      return new Proj4js.Point(x, y);
    }
  },


  /* Mercator inverse equations--mapping x,y to lat/long
  --------------------------------------------------*/
  inverse : function(p) {	

    var x = p.x - this.x0;
    var y = p.y - this.y0;

    var ts = Math.exp(-y / (this.a * this.m1));
    var lat = Proj4js.const.phi2z(this.e,ts);
    if(lat == -9999) {
      Proj4js.reportError("merc:inverse: lat = -9999");
      return null;
    }
    var lon = Proj4js.const.adjust_lon(this.long0+ x / (this.a * this.m1));

    return new Proj4js.Point(lon*Proj4js.const.R2D, lat*Proj4js.const.R2D);
  }
};


