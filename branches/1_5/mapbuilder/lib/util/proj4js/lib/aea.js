/* Function to eliminate roundoff errors in asin
----------------------------------------------*/

function asinz(x){x=(Math.abs(x)>1.0)?1.0:-1.0;return(x);}





/* Function to compute constant small q which is the radius of a 
   parallel of latitude, phi, divided by the semimajor axis. 
------------------------------------------------------------*/
function qsfnz (eccent,sinphi,cosphi)
{
var con;
   if (eccent > 1.0e-7)
     {
     con = eccent * sinphi;
     return (( 1.0- eccent * eccent) * (sinphi /(1.0 - con * con) - (.5/eccent)*
             Math.log((1.0 - con)/(1.0 + con))));
     }
   else
     return(2.0 * sinphi);
     }

/* Function to compute phi1, the latitude for the inverse of the
   Albers Conical Equal-Area projection.
-------------------------------------------*/
function phi1z (eccent,qs)
   
{
var eccnts;
var dphi;
var con;
var com;
var sinpi;
var cospi;
var phi;
var i;

      phi = asinz(.5 * qs);
      if (eccent < EPSLN) 
         return(phi);
      eccnts = eccent * eccent; 
      for (i = 1; i <= 25; i++)
        {
	sinpi=Math.sin(phi);
        cospi=Math.cos(phi);
       
        con = eccent * sinpi; 
        com = 1.0 - con * con;
        dphi = .5 * com * com / cospi * (qs / (1.0 - eccnts) - sinpi / com + 
               .5 / eccent * Math.log ((1.0 - con) / (1.0 + con)));
       phi = phi + dphi;
       if (Math.abs(dphi) <= 1e-7)
          return(phi);
        }
  if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("phi1zNoConvergence"));
 
  return(-9999);//random error code
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
  if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("phi2zNoConvergence"));
  return -9999;
}

// Function to return the sign of an argument
function sign(x) { if (x < 0.0) return(-1); else return(1);}

// Function to adjust longitude to -180 to 180; input in radians
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}












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



 
 aeaInit=function(def){

if (Math.abs(def.lat1 + def.lat2) < EPSLN)
   {
   if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("aeaInitEqualLatitudes"));
   return(31);
   }
def.temp = def.b / def.a;
def.es = 1.0 - Math.pow(def.temp,2);
def.e3 = Math.sqrt(def.es);

def.sin_po=Math.sin(def.lat1);
def.cos_po=Math.cos(def.lat1);
def.t1=def.sin_po


def.con = def.sin_po;

def.ms1 = msfnz(def.e3,def.sin_po,def.cos_po);
def.qs1 = qsfnz(def.e3,def.sin_po,def.cos_po);

def.sin_po=Math.sin(def.lat2);
def.cos_po=Math.cos(def.lat2);
def.t2=def.sin_po;

def.ms2 = msfnz(def.e3,def.sin_po,def.cos_po);
def.qs2 = qsfnz(def.e3,def.sin_po,def.cos_po);

def.sin_po=Math.sin(def.lat0);
def.cos_po=Math.cos(def.lat0);

def.t3=def.sin_po;


def.qs0 = qsfnz(def.e3,def.sin_po,def.cos_po);

if (Math.abs(def.lat1 - def.lat2) > EPSLN)
   def.ns0 = (def.ms1 * def.ms1 - def.ms2 *def.ms2)/ (def.qs2 - def.qs1);
else
def.ns0 = def.con;
def.c = def.ms1 * def.ms1 + def.ns0 * def.qs1;
def.rh = def.a * Math.sqrt(def.c - def.ns0 * def.qs0)/def.ns0;

}




/* Albers Conical Equal Area forward equations--mapping lat,long to x,y
  -------------------------------------------------------------------*/
aeaFwd=function(p){


var lon=p.x;
var lat=p.y;

this.sin_phi=Math.sin(lat);
this.cos_phi=Math.cos(lat);


var qs = qsfnz(this.e3,this.sin_phi,this.cos_phi);
var rh1 =this.a * Math.sqrt(this.c - this.ns0 * qs)/this.ns0;
var theta = this.ns0 * adjust_lon(lon - this.long0); 
var x = rh1 * Math.sin(theta) + this.y0;
var y = this.rh - rh1 * Math.cos(theta) + this.x0;

p.x=x;
p.y=y;

}




aeaInv=function(p){

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
      lat = phi1z(this.e3,qs);
      
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
   lat = phi1z(e3,qs);
    }

lon = adjust_lon(theta/this.ns0 + this.long0);

p.x=lon;
p.y=lat;
}



