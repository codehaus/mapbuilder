function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}



/*******************************************************************************
NAME                    VAN DER GRINTEN 

PURPOSE:	Transforms input Easting and Northing to longitude and
		latitude for the Van der Grinten projection.  The
		Easting and Northing must be in meters.  The longitude
		and latitude values will be returned in radians.

PROGRAMMER              DATE            
----------              ----           
T. Mittan		March, 1993

This function was adapted from the Van Der Grinten projection code
(FORTRAN) in the General Cartographic Transformation Package software
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


/* Variables common to all subroutines in this code file
  -----------------------------------------------------*/

/* Initialize the Van Der Grinten projection
  ----------------------------------------*/
 vandgInit=function(def) 

	
{
def.R = 6370997.0; //Radius of earth
}

/* Report parameters to the user
  -----------------------------*/




 vandgFwd=function(p){

var lon=p.x;
var lat=p.y;	

/* Forward equations
  -----------------*/
var dlon = adjust_lon(lon - this.long0);

if (Math.abs(lat) <= EPSLN)
   {
   var x = this.x0  + this.R * dlon;
   var y = this.y0;

   }
var theta = asinz(2.0 * Math.abs(lat / PI));
if ((Math.abs(dlon) <= EPSLN) || (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN))
   {
   var x = this.x0;
   if (lat >= 0)
      var y = this.y0 + PI * this.R * Math.tan(.5 * theta);
   else
      y = this.y0 + PI *this.R * - Math.tan(.5 * theta);
 //  return(OK);
   }
var al = .5 * Math.abs((PI / dlon) - (dlon / PI));
var asq = al * al;
var sinth=Math.sin(theta);
var costh=Math.cos(theta);

var g = costh / (sinth + costh - 1.0);
var gsq = g * g;
var m = g * (2.0 / sinth - 1.0);
var msq = m * m;
var con = PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq)
      * (gsq - msq))) / (msq + asq);
if (dlon < 0)
   con = -con;
x = this.x0 + con;
con =Math.abs(con / (PI * this.R));
if (lat >= 0)
   y = this.y0 + PI * this.R * Math.sqrt(1.0 - con * con - 2.0 * al * con);
else
   y = this.y0 - PI * this.R * Math.sqrt(1.0 - con * con - 2.0 * al * con);

p.x=x;
p.y=y;

}




/* Van Der Grinten inverse equations--mapping x,y to lat/long
  ---------------------------------------------------------*/
vandgInv=function(p){
var dlon;
var xx,yy,xys,c1,c2,c3;
var al,asq;
var a1;
var m1;
var con;
var th1;
var d;

/* inverse equations
  -----------------*/
p.x -= this.x0;
p.y -= this.y0;
con = PI * this.R;
xx = p.x / con;
yy =p.y / con;
xys = xx * xx + yy * yy;
c1 = -Math.abs(yy) * (1.0 + xys);
c2 = c1 - 2.0 * yy * yy + xx * xx;
c3 = -2.0 * c1 + 1.0 + 2.0 * yy * yy + xys * xys;
d = yy * yy / c3 + (2.0 * c2 * c2 * c2 / c3 / c3 / c3 - 9.0 * c1 * c2 / c3 /c3)
    / 27.0;
a1 = (c1 - c2 * c2 / 3.0 / c3) / c3;
m1 = 2.0 * Math.sqrt( -a1 / 3.0);
con = ((3.0 * d) / a1) / m1;
if (Math.abs(con) > 1.0)
   {
   if (con >= 0.0)
      con = 1.0;
   else
      con = -1.0;
   }
th1 = Math.acos(con) / 3.0;
if (p.y >= 0)
   var lat = (-m1 *Math.cos(th1 + PI / 3.0) - c2 / 3.0 / c3) * PI;
else
   lat = -(-m1 * Math.cos(th1 + PI / 3.0) - c2 / 3.0 / c3) * PI;

if (Math.abs(xx) < EPSLN)
   {
   var lon = this.long0;
 
   }
lon = adjust_lon(this.long0 + PI * (xys - 1.0 + Math.sqrt(1.0 + 2.0 * 
		 (xx * xx - yy * yy) + xys * xys)) / 2.0 / xx);



 p.x=lon;
 p.y=lat;


}
