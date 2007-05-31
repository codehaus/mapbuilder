/*******************************************************************************
NAME                  LAMBERT AZIMUTHAL EQUAL-AREA
 
PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Lambert Azimuthal Equal-Area projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

This function was adapted from the Lambert Azimuthal Equal Area projection
code (FORTRAN) in the General Cartographic Transformation Package software
which is available from the U.S. Geological Survey National Mapping Division.
 
ALGORITHM REFERENCES

1.  "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.

2.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

3.  "Software Documentation for GCTP General Cartographic Transformation
    Package", U.S. Geological Survey National Mapping Division, May 1982.
*******************************************************************************



/* Initialize the Lambert Azimuthal Equal Area projection
  ------------------------------------------------------*/
function laeaInit(def) 
{

def.R = 6370997.0; //Radius of earth
def.sin_lat_o=Math.sin(def.lat0);
def.cos_lat_o=Math.cos(def.lat0);

}

/* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
  -----------------------------------------------------------------------*/
function laeaFwd(p)
{


/* Forward equations
  -----------------*/
  var lon=p.x;
  var lat=p.y;
  
  
var delta_lon = adjust_lon(lon - this.long0);

//v 1.0
var sin_lat=Math.sin(lat);
var cos_lat=Math.cos(lat);

var sin_delta_lon=Math.sin(delta_lon);
var cos_delta_lon=Math.cos(delta_lon);


var g =this. sin_lat_o * sin_lat +this. cos_lat_o * cos_lat * cos_delta_lon;
if (g == -1.0) 
   {
   //Alert( "Point projects to a circle of radius = %lf\n", 2.0 * R);
   //p_error(mess, "lamaz-forward");
  // return(113);
   }
var ksp = this.R * Math.sqrt(2.0 / (1.0 + g));
var x = ksp * cos_lat * sin_delta_lon + this.x0;
var y = ksp * (this.cos_lat_o * sin_lat - this.sin_lat_o * cos_lat * cos_delta_lon) + 
	this.x0;
//return(OK);
}//lamazFwd()



 function laeaInv(p)

{


/* Inverse equations
  -----------------*/
p.x -= this.x0;
p.y -= this.y0;

var Rh = Math.sqrt(p.x *p. x +p. y * p.y);
var temp = Rh / (2.0 * this.R);

if (temp > 1) 
   {
  Alert("Input data error", "lamaz-inverse");
   //return(115);
   }
   
var z = 2.0 * asinz(temp);
var sin_z=Math.sin(z);
var cos_z=Math.cos(z);


var lon =this.long0;
if (Math.abs(Rh) > EPSLN)
   {
   var lat = asinz(this.sin_lat_o * cos_z +this. cos_lat_o * sin_z *p. y / Rh);
   var temp =Math.abs(this.lat0) - HALF_PI;
   if (Math.abs(temp) > EPSLN)
      {
      temp = cos_z -this. sin_lat_o * Math.sin(lat);
      if(temp!=0.0) lon=adjust_lon(this.long0+Math.atan2(p.x*sin_z*this.cos_lat_o,temp*Rh));
      }
   else if (this.lat0 < 0.0) lon = adjust_lon(this.long0 - Math.atan2(-p.x,p. y));
   else lon = adjust_lon(this.long0 + Math.atan2(p.x, -p.y));
   }
else lat = this.lat0;
//return(OK);
}//lamazInv()



