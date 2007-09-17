/*******************************************************************************
NAME                     ALBERS CONICAL EQUAL AREA 

PURPOSE:	Transforms input longitude and latitude to Easting and Northing
		for the Albers Conical Equal Area projection.  The longitude
		and latitude must be in radians.  The Easting and Northing
		values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan,       	Feb, 1992

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/



 
Proj4js.Proj.lcc = Class.create();
Proj4js.Proj.lcc.prototype = {
  init : function() {

    if (Math.abs(this.lat1 + this.lat2) < EPSLN)
       {
       if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("aeaInitEqualLatitudes"));
       return(31);
       }
    this.temp = this.b / this.a;
    this.es = 1.0 - Math.pow(this.temp,2);
    this.e3 = Math.sqrt(this.es);

    this.sin_po=Math.sin(this.lat1);
    this.cos_po=Math.cos(this.lat1);
    this.t1=this.sin_po


    this.con = this.sin_po;

    this.ms1 = msfnz(this.e3,this.sin_po,this.cos_po);
    this.qs1 = qsfnz(this.e3,this.sin_po,this.cos_po);

    this.sin_po=Math.sin(this.lat2);
    this.cos_po=Math.cos(this.lat2);
    this.t2=this.sin_po;

    this.ms2 = msfnz(this.e3,this.sin_po,this.cos_po);
    this.qs2 = qsfnz(this.e3,this.sin_po,this.cos_po);

    this.sin_po=Math.sin(this.lat0);
    this.cos_po=Math.cos(this.lat0);

    this.t3=this.sin_po;


    this.qs0 = qsfnz(this.e3,this.sin_po,this.cos_po);

    if (Math.abs(this.lat1 - this.lat2) > Proj4js.const.EPSLN)
       this.ns0 = (this.ms1 * this.ms1 - this.ms2 *this.ms2)/ (this.qs2 - this.qs1);
    else
    this.ns0 = this.con;
    this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
    this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0)/this.ns0;

  },




/* Albers Conical Equal Area forward equations--mapping lat,long to x,y
  -------------------------------------------------------------------*/
  forward: function(p){

    var lon=p.x;
    var lat=p.y;

    this.sin_phi=Math.sin(lat);
    this.cos_phi=Math.cos(lat);


    var qs = Proj4js.const.qsfnz(this.e3,this.sin_phi,this.cos_phi);
    var rh1 =this.a * Math.sqrt(this.c - this.ns0 * qs)/this.ns0;
    var theta = this.ns0 * Proj4js.const.adjust_lon(lon - this.long0); 
    var x = rh1 * Math.sin(theta) + this.y0;
    var y = this.rh - rh1 * Math.cos(theta) + this.x0;

    return new Proj4js.Point(x, y);
  },


  inverse: function(p) {

    var rh1,qs,con,theta,lon,lat;

    p.x -= this.x0;
    p.y = this.rh - p.y + this.y0;
    if (this.ns0 >= 0)
       {
        rh1 = Math.sqrt(p.x *p.x + p.y * p.y);
       con = 1.0;
       }
    else
       {
       rh1 = -Math.sqrt(p.x * p.x + p.y *p.y);
       con = -1.0;
       }
     theta = 0.0;
    if (rh1 != 0.0)
       theta = Math.atan2(con * p.x, con * p.y);
    con = rh1 * this.ns0 / this.a;
    qs = (this.c - con * con) / this.ns0;
    if (this.e3 >= 1e-10)
       {
       con = 1 - .5 * (1.0 -this.es) * Math.log((1.0 - this.e3) / (1.0 + this.e3))/this.e3;
       if (Math.abs(Math.abs(con) - Math.abs(qs)) > .0000000001 )
          {
          lat = Proj4js.const.phi1z(this.e3,qs);

          }
       else
          {
          if (qs >= 0)
             lat = .5 * PI;
          else
             lat = -.5 * PI;
          }
       }
    else
       {
       lat = Proj4js.const.phi1z(e3,qs);
        }

    lon = Proj4js.const.adjust_lon(theta/this.ns0 + this.long0);

    return new Proj4js.Point(lon, lat);
  }
};



