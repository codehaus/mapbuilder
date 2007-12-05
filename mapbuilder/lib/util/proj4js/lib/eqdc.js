// Function to compute the constant small m which is the radius of
//   a parallel of latitude, phi, divided by the semimajor axis.
// -----------------------------------------------------------------
function msfnz(eccent, sinphi, cosphi) {
      var con = eccent * sinphi;
      return cosphi/(Math.sqrt(1.0 - con * con));
}



function phi3z(ml,e0,e1,e2,e3){
var phi,dphi,i;
phi=ml;
for (i = 0; i < 15; i++) {
  dphi = (ml + e1 * Math.sin(2.0 * phi) - e2 * Math.sin(4.0 * phi) + e3 * Math.sin(6.0 * phi))
         / e0 - phi;  phi += dphi;
  if (Math.abs(dphi) <= .0000000001)
  {    
    return phi;
   }
     
  }
  if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("phi3zNoConvergence"));
  return(-9999);
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
  return (-9999);
}

// Function to return the sign of an argument
function sign(x) { if (x < 0.0) return(-1); else return(1);}

// Function to adjust longitude to -180 to 180; input in radians
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}



/*******************************************************************************
NAME                            EQUIDISTANT CONIC 

PURPOSE:	Transforms input longitude and latitude to Easting and Northing
		for the Equidistant Conic projection.  The longitude and
		latitude must be in radians.  The Easting and Northing values
		will be returned in meters.

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

/* Variables common to all subroutines in this code file
  -----------------------------------------------------*/



/* Initialize the Equidistant Conic projection
  ------------------------------------------*/
function eqdcInit(def)
{

/* Place parameters in static storage for common use
  -------------------------------------------------*/

if(!def.mode) def.mode=0;//chosen default mode
def.temp = def.b / def.a;
def.es = 1.0 - Math.pow(def.temp,2);
def.e = Math.sqrt(def.es);
def.e0 = e0fn(def.es);
def.e1 = e1fn(def.es);
def.e2 = e2fn(def.es);
def.e3 = e3fn(def.es);

def.sinphi=Math.sin(def.lat1);
def.cosphi=Math.cos(def.lat1);

def.ms1 = msfnz(def.e,def.sinphi,def.cosphi);
def.ml1 = mlfn(def.e0, def.e1, def.e2,def.e3, def.lat1);

/* format B
---------*/
if (def.mode != 0)
   {
   if (Math.abs(def.lat1 + def.lat2) < EPSLN)
      {
      if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage ("eqdcInitEqualLatitudes"));
  
      //return(81);
      }
 def.sinphi=Math.sin(def.lat2);
 def.cosphi=Math.cos(def.lat2);   
   
   def.ms2 = msfnz(def.e,def.sinphi,def.cosphi);
   def.ml2 = mlfn(def.e0, def.e1, def.e2, def.e3, def.lat2);
   if (Math.abs(def.lat1 - def.lat2) >= EPSLN)
     def.ns = (def.ms1 - def.ms2) / (def.ml2 - def.ml1);
   else
      def.ns = def.sinphi;
   }
else
def.ns = def.sinphi;
def.g = def.ml1 + def.ms1/def.ns;
def.ml0 = mlfn(def.e0, def.e1,def. e2, def.e3, def.lat0);
def.rh = def.a * (def.g - def.ml0);
   

}


/* Equidistant Conic forward equations--mapping lat,long to x,y
  -----------------------------------------------------------*/
function eqdcFwd(p)
{


var lon=p.x;
var lat=p.y;

/* Forward equations



  -----------------*/
var ml = mlfn(this.e0, this.e1, this.e2, this.e3, lat);
var rh1 = this.a * (this.g - ml);
var theta = this.ns * adjust_lon(lon - this.long0);

this.t1=adjust_lon(lon-this.long0);
this.t2=theta;
var x = this.x0  + rh1 * Math.sin(theta);
var y = this.y0 + this.rh - rh1 * Math.cos(theta);


p.x=x;
p.y=y;


}


function eqdcInv(p)

{

/* Inverse equations
  -----------------*/

p.x -= this.x0;
p.y  = this.rh - p.y +this.y0;
if (this.ns >= 0)
   {
   var rh1 = Math.sqrt(p.x *p. x + p.y * p.y); 
   var con = 1.0;
   }
else
   {
   rh1 = -Math.sqrt(p.x *p. x +p. y * p.y); 
   con = -1.0;
   }
var theta = 0.0;
if (rh1  != 0.0)
   theta = Math.atan2(con *p. x, con *p. y);
var ml = this.g - rh1 /this.a;
var lat = phi3z(this.ml,this.e0,this.e1,this.e2,this.e3);
var lon = adjust_lon(this.long0 + theta / this.ns);


   
 p.x=lon;
 p.y=lat;  
   
}
