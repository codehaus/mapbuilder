
/* Function to eliminate roundoff errors in asin
----------------------------------------------*/
function asinz(x){x=(Math.abs(x)>1.0)?1.0:-1.0;return(x);}

// following functions from gctpc cproj.c for transverse mercator projections
function e0fn(x){return(1.0-0.25*x*(1.0+x/16.0*(3.0+1.25*x)));}
function e1fn(x){return(0.375*x*(1.0+0.25*x*(1.0+0.46875*x)));}
function e2fn(x){return(0.05859375*x*x*(1.0+0.75*x));}
function e3fn(x){return(x*x*x*(35.0/3072.0));}
function mlfn(e0,e1,e2,e3,phi){return(e0*phi-e1*Math.sin(2.0*phi)+e2*Math.sin(4.0*phi)-e3*Math.sin(6.0*phi));}
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
  if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("phi2zNoConvergence"));
  return -9999;
}









/*******************************************************************************
NAME                       OBLIQUE MERCATOR (HOTINE) 

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Oblique Mercator projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan		Mar, 1993

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/



 


/* Initialize the Oblique Mercator  projection
  ------------------------------------------*/
omercInit=function(def) 
{
if (!def.mode) def.mode=0;
if(!def.lon1)   {def.lon1=0;def.mode=1;}
if(!def.lon2)   def.lon2=0;
if(!def.lat2)    def.lat2=0;

/* Place parameters in static storage for common use
  -------------------------------------------------*/


var temp = def.b/ def.a;
var es = 1.0 - Math.pow(temp,2);
var e = Math.sqrt(es);

def.sin_p20=Math.sin(def.lat0);
def.cos_p20=Math.cos(def.lat0);

def.con = 1.0 - def.es * def.sin_p20 * def.sin_p20;
def.com = Math.sqrt(1.0 - es);
def.bl = Math.sqrt(1.0 + def.es * Math.pow(def.cos_p20,4.0)/(1.0 - es));
def.al = def.a * def.bl * def.k0 * def.com / def.con;
if (Math.abs(def.lat0) < EPSLN)
   {
   def.ts = 1.0;
   def.d = 1.0;
   def.el = 1.0;
   }
else
   {
   def.ts = tsfnz(def.e,def.lat0,def.sin_p20);
   def.con = Math.sqrt(def.con);
   def.d = def.bl * def.com / (def.cos_p20 * def.con);
   if ((def.d * def.d - 1.0) > 0.0)
      {
      if (def.lat0 >= 0.0)
         def.f = def.d + Math.sqrt(def.d * def.d - 1.0);
      else
         def.f = def.d - Math.sqrt(def.d * def.d - 1.0);
      }
   else
   def.f = def.d;
   def.el = def.f * Math.pow(def.ts,def.bl);
   }

//def.longc=52.60353916666667;

if (def.mode != 0)
   {
   def.g = .5 * (def.f - 1.0/def.f);
   def.gama = asinz(Math.sin(def.alpha) / def.d);
   def.longc= def.longc - asinz(def.g * Math.tan(def.gama))/def.bl;

   /* Report parameters common to format B
   -------------------------------------*/
   //genrpt(azimuth * R2D,"Azimuth of Central Line:    ");
   //cenlon(lon_origin);
  // cenlat(lat_origin);
   
   def.con = Math.abs(def.lat0);
   if ((def.con > EPSLN) && (Math.abs(def.con - HALF_PI) > EPSLN))
      {
        def.singam=Math.sin(def.gama);
	def.cosgam=Math.cos(def.gama);
	
	def.sinaz=Math.sin(def.alpha);
	def.cosaz=Math.cos(def.alpha);

     
      if (def.lat0>= 0)
         def.u =  (def.al / def.bl) * Math.atan(Math.sqrt(def.d*def.d - 1.0)/def.cosaz);
      else
         def.u =  -(def.al / def.bl) *Math.atan(Math.sqrt(def.d*def.d - 1.0)/def.cosaz);
      }
   else
      {
       if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("omercInitDataError"));
      
      }
   }
else
   {
   def.sinphi =Math. sin(def.at1);
   def.ts1 = tsfnz(def.e,def.lat1,def.sinphi);
   def.sinphi = Math.sin(def.lat2);
   def.ts2 = tsfnz(def.e,def.lat2,def.sinphi);
   def.h = Math.pow(def.ts1,def.bl);
   def.l = Math.pow(def.ts2,def.bl);
   def.f = def.el/def.h;
   def.g = .5 * (def.f - 1.0/def.f);
   def.j = (def.el * def.el - def.l * def.h)/(def.el * def.el + def.l * def.h);
   def.p = (def.l - def.h) / (def.l + def.h);
   def.dlon = def.lon1 - def.lon2;
   if (def.dlon < -PI)
      def.lon2 = def.lon2 - 2.0 * PI;
   if (def.dlon > PI)
      def.lon2 = def.lon2 + 2.0 * PI;
   def.dlon = def.lon1 - def.lon2;
   def.longc = .5 * (def.lon1 + def.lon2) -Math.atan(def.j * Math.tan(.5 * def.bl * def.dlon)/def.p)/def.bl;
   def.dlon  = adjust_lon(def.lon1 - def.longc);
   def.gama = Math.atan(Math.sin(def.bl * def.dlon)/def.g);
   def.alpha = asinz(def.d * Math.sin(def.gama));
   
   /* Report parameters common to format A
   -------------------------------------*/
  
   if (Math.abs(def.lat1 - def.lat2) <= EPSLN)
      {
      alert("omercInitDataError");
      //return(202);
      }
   else
      def.con = Math.abs(def.lat1);
   if ((def.con <= EPSLN) || (Math.abs(def.con - HALF_PI) <= EPSLN))
      {
       if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("omercInitDataError"));
            //return(202);
      }
   else 
   if (Math.abs(Math.abs(def.lat0) - HALF_PI) <= EPSLN)
      {
      if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("omercInitDataError"));
      //return(202);
      }
      
     def.singam=Math.sin(def.gam);
     def.cosgam=Math.cos(def.gam);
	
     def.sinaz=Math.sin(def.alpha);
     def.cosaz=Math.cos(def.alpha);  
     
  
   if (def.lat0 >= 0)
      def.u =  (def.al/def.bl) * Math.atan(Math.sqrt(def.d * def.d - 1.0)/def.cosaz);
   else
      def.u = -(def.al/def.bl) * Math.atan(Math.sqrt(def.d * def.d - 1.0)/def.cosaz);
   }

}


/* Oblique Mercator forward equations--mapping lat,long to x,y
  ----------------------------------------------------------*/
 omercFwd=function(p)
{
var theta;		/* angle					*/
var sin_phi, cos_phi;/* sin and cos value				*/
var b;		/* temporary values				*/
var c, t, tq;	/* temporary values				*/
var con, n, ml;	/* cone constant, small m			*/
var q,us,vl;
var ul,vs;
var s;
var dlon;
var ts1;


var lon=p.x;
var lat=p.y;
/* Forward equations
  -----------------*/
sin_phi = Math.sin(lat);
dlon = adjust_lon(lon - this.longc);
vl = Math.sin(this.bl * dlon);
if (Math.abs(Math.abs(lat) - HALF_PI) > EPSLN)	
   {
   ts1 = tsfnz(this.e,lat,sin_phi);
   q = this.el / (Math.pow(ts1,this.bl));
   s = .5 * (q - 1.0 / q);
   t = .5 * (q + 1.0/ q);
   ul = (s * this.singam - vl * this.cosgam) / t;
   con = Math.cos(this.bl * dlon);
   if (Math.abs(con) < .0000001)
      {
      us = this.al * this.bl * dlon;
      }
   else
      {
      us = this.al * Math.atan((s * this.cosgam + vl * this.singam) / con)/this.bl;
      if (con < 0)
         us = us + PI * this.al / this.bl;
      }
   }
else
   {
   if (lat >= 0)
      ul = this.singam;
   else
      ul = -this.singam;
   us = this.al * lat / this.bl;
   }
if (Math.abs(Math.abs(ul) - 1.0) <= EPSLN)
   {
   //alert("Point projects into infinity","omer-for");
    if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("omercFwdInfinity"));
   //return(205);
   }
vs = .5 * this.al * Math.log((1.0 - ul)/(1.0 + ul)) / this.bl;
us = us - this.u;
var x = this.x0 + vs * this.cosaz + us * this.sinaz;
var y = this.y0 + us * this.cosaz - vs * this.sinaz;

p.x=x;
p.y=y;
}





omercInv=function(p)
{
var delta_lon;	/* Delta longitude (Given longitude - center 	*/
var theta;		/* angle					*/
var delta_theta;	/* adjusted longitude				*/
var sin_phi, cos_phi;/* sin and cos value				*/
var b;		/* temporary values				*/
var c, t, tq;	/* temporary values				*/
var con, n, ml;	/* cone constant, small m			*/
var vs,us,q,s,ts1;
var vl,ul,bs;
var dlon;
var  flag;

/* Inverse equations
  -----------------*/
p.x -= this.x0;
p.y -= this.y0;
flag = 0;
vs = p.x * this.cosaz - p.y * this.sinaz;
us = p.y * this.cosaz + p.x * this.sinaz;
us = us + this.u;
q = Math.exp(-this.bl * vs / this.al);
s = .5 * (q - 1.0/q);
t = .5 * (q + 1.0/q);
vl = Math.sin(this.bl * us / this.al);
ul = (vl * this.cosgam + s * this.singam)/t;
if (Math.abs(Math.abs(ul) - 1.0) <= EPSLN)
   {
   lon = this.longc;
   if (ul >= 0.0)
      lat = HALF_PI;
   else
     lat = -HALF_PI;
   }
else
   {
   con = 1.0 / this.bl;
   ts1 =Math.pow((this.el / Math.sqrt((1.0 + ul) / (1.0 - ul))),con);
   lat = phi2z(this.e,ts1);
   //if (flag != 0)
      //return(flag);
   //~ con = Math.cos(this.bl * us /al);
   theta = this.longc - Math.atan2((s * this.cosgam - vl * this.singam) , con)/this.bl;
   lon = adjust_lon(theta);
   }
p.x=lon;
p.y=lat;
}
