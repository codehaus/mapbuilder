
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
// following functions from gctpc cproj.c for transverse mercator projections
function e0fn(x){return(1.0-0.25*x*(1.0+x/16.0*(3.0+1.25*x)));}
function e1fn(x){return(0.375*x*(1.0+0.25*x*(1.0+0.46875*x)));}
function e2fn(x){return(0.05859375*x*x*(1.0+0.75*x));}
function e3fn(x){return(x*x*x*(35.0/3072.0));}
function mlfn(e0,e1,e2,e3,phi){return(e0*phi-e1*Math.sin(2.0*phi)+e2*Math.sin(4.0*phi)-e3*Math.sin(6.0*phi));}
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}

/* Function to eliminate roundoff errors in asin
----------------------------------------------*/
function asinz(x){x=(Math.abs(x)>1.0)?1.0:-1.0;return(x);}






/* Function to compute, phi4, the latitude for the inverse of the
   Polyconic projection.
------------------------------------------------------------*/
function phi4z (eccent,e0,e1,e2,e3,a,b,c,phi)
{
var sinphi, sin2ph, tanph, ml, mlp, con1, con2, con3, dphi, i;

      phi = a;
      for (i = 1; i <= 15; i++)
        {
        sinphi = Math.sin(phi);
        tanphi = Math.tan(phi);
        c = tanphi * Math.sqrt (1.0 - eccent * sinphi * sinphi);
        sin2ph = Math.sin (2.0 * phi);
/*
        ml = e0 * *phi - e1 * sin2ph + e2 * sin (4.0 *  *phi);
        mlp = e0 - 2.0 * e1 * cos (2.0 *  *phi) + 4.0 * e2 *
              cos (4.0 *  *phi);
*/
        ml = e0 * phi - e1 * sin2ph + e2 * Math.sin (4.0 *  phi) - e3 * 
 	     Math.sin (6.0 * phi);
        mlp = e0 - 2.0 * e1 * Math.cos (2.0 *  phi) + 4.0 * e2 *
              Math.cos (4.0 *  phi) - 6.0 * e3 * Math.cos (6.0 *  phi);
        con1 = 2.0 * ml + c * (ml * ml + b) - 2.0 * a *  (c * ml + 1.0);
        con2 = eccent * sin2ph * (ml * ml + b - 2.0 * a * ml) / (2.0 *c);
        con3 = 2.0 * (a - ml) * (c * mlp - 2.0 / sin2ph) - 2.0 * mlp;
        dphi = con1 / (con2 + con3);
        phi += dphi;
        if (Math.abs(dphi) <= .0000000001 ) return(phi);   
        }
	alert(mbGetMessage("phi4zNoConvergence"));
return(004);
}


/* Function to compute the constant e4 from the input of the eccentricity
   of the spheroid, x.  This constant is used in the Polar Stereographic
   projection.
--------------------------------------------------------------------*/
function e4fn(x){
 var con, com;
 con = 1.0 + x;
 com = 1.0 - x;
 return (Math.sqrt((Math.pow(con,con))*(Math.pow(com,com))));
 }





/*******************************************************************************
NAME                             POLYCONIC 

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Polyconic projection.  The
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

/* Variables common to all subroutines in this code file
  -----------------------------------------------------*/

/* Initialize the POLYCONIC projection
  ----------------------------------*/
 polyInit=function(def) 

{
var temp;			/* temporary variable		*/
if (def.lat0=0) def.lat0=90;//def.lat0 ca
/* Place parameters in static storage for common use
  -------------------------------------------------*/


def.temp = def.b / def.a;
def.es = 1.0 - Math.pow(def.temp,2);// devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles 
def.e = Math.sqrt(def.es);
def.e0 = e0fn(def.es);
def.e1 = e1fn(def.es);
def.e2 = e2fn(def.es);
def.e3 = e3fn(def.es);
def.ml0 = mlfn(def.e0, def.e1,def.e2, def.e3, def.lat0);//si que des zeros le calcul ne se fait pas
//if (!def.ml0) {def.ml0=0;}
/* Report parameters to the user
  -----------------------------*/	

}


/* Polyconic forward equations--mapping lat,long to x,y
  ---------------------------------------------------*/
 polyFwd=function(p)
{
var sinphi, cosphi;	/* sin and cos value				*/
var al;		/* temporary values				*/
var c;		/* temporary values				*/
var con, ml;		/* cone constant, small m			*/
var ms;		/* small m					*/
var lon=p.x;
var lat=p.y;	
/* Forward equations
  -----------------*/
con = adjust_lon(lon - this.long0);
if (Math.abs(lat) <= .0000001)
   {
   var x = this.x0 + this.a * con;
   var y = this.y0 - this.a * this.ml0;
   }
else
   {
   sinphi=Math.sin(lat);
   cosphi=Math.cos(lat);	   
   
	   
   ml = mlfn(this.e0, this.e1, this.e2, this.e3, lat);
   ms = msfnz(this.e,sinphi,cosphi);
   con = sinphi;
  x = this.x0 + this.a * ms * Math.sin(con)/sinphi;
  y = this.y0 + this.a * (ml - this.ml0 + ms * (1.0 - Math.cos(con))/sinphi);
   }

p.x=x;
p.y=y;   
}


 polyInv=function(p)
{
var sin_phi, cos_phi;/* sin and cos value				*/
var al;		/* temporary values				*/
var b;		/* temporary values				*/
var c;		/* temporary values				*/
var con, ml;		/* cone constant, small m			*/
var iflg;		/* error flag					*/
var lon,lat;
/* Inverse equations
  -----------------*/
p.x -= this.x0;
p.y -= this.y0;
al = this.ml0 + p.y/this.a;
iflg = 0;


if (Math.abs(al) <= .0000001)
   {
   lon = p.x/this.a + this.long0;
   lat = 0.0;
   }
else
   {
   b = al * al + (p.x/this.a) * (p.x/this.a);
   iflg = phi4z(this.es,this.e0,this.e1,this.e2,this.e3,this.al,b,c,lat);
   if (iflg != 1)
      return(iflg);
   lon = adjust_lon((asinz(p.x * c / this.a) / Math.sin(lat)) + this.long0);
   }

p.x=lon;
p.y=lat;

//return(OK);
}



