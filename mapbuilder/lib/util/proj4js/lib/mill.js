// Function to adjust longitude to -180 to 180; input in radians
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}








/*******************************************************************************
NAME                    MILLER CYLINDRICAL 

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Miller Cylindrical projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE            
----------              ----           
T. Mittan		March, 1993

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
*******************************************************************************/

//surement necessaire de déclarer un R dans le switch du cscs.js



  
  



/* Initialize the Miller Cylindrical projection
  -------------------------------------------*/
 millInit=function(def){
def.R = 6370997.0; //Radius of earth
}



/* Miller Cylindrical forward equations--mapping lat,long to x,y
  ------------------------------------------------------------*/
 millFwd=function(p)
{
var lon=p.x;
var lat=p.y;
/* Forward equations
  -----------------*/
dlon = adjust_lon(lon -this.long0);
var x = this.x0 +this.R * dlon;
var y = this.y0 + this.R *Math.log(Math.tan((PI / 4.0) + (lat / 2.5))) * 1.25;

p.x=x;
p.y=y;

}//millFwd()

 millInv=function(p)
/* Miller Cylindrical inverse equations--mapping x,y to lat/long
  ------------------------------------------------------------*/
{

p. x -= this.x0;
p. y -= this.y0;

var lon = adjust_lon(this.long0 + p.x /this.R);
var lat = 2.5 * (Math.atan(Math.exp(p.y/ this.R / 1.25)) - PI / 4.0);

p.x=lon;
p.y=lat;
}//millInv()

