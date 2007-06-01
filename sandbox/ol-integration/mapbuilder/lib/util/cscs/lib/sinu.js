function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}


/*******************************************************************************
NAME                  		SINUSOIDAL

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Sinusoidal projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

PROGRAMMER              DATE            
----------              ----           
D. Steinwand, EROS      May, 1991     

This function was adapted from the Sinusoidal projection code (FORTRAN) in the 
General Cartographic Transformation Package software which is available from 
the U.S. Geological Survey National Mapping Division.
 
ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  "Software Documentation for GCTP General Cartographic Transformation
    Package", U.S. Geological Survey National Mapping Division, May 1982.
*******************************************************************************/


/* Initialize the Sinusoidal projection
  ------------------------------------*/
sinuInit=function(def){
/* Place parameters in static storage for common use
  -------------------------------------------------*/
def.R = 6370997.0; //Radius of earth



/* Report parameters to the user
  -----------------------------*/
}

/* Sinusoidal forward equations--mapping lat,long to x,y
  -----------------------------------------------------*/
 sinuFwd=function(p){
var x,y,delta_lon;	
var lon=p.x;
var lat=p.y;	
/* Forward equations
  -----------------*/
 delta_lon = adjust_lon(lon - this.long0);
 x = this.R * delta_lon * Math.cos(lat) + this.x0;
 y = this.R * lat + this.y0;

p.x=x;
p.y=y;	
	
}


 sinuInv=function(p){
var lat,temp,lon;	

/* Inverse equations
  -----------------*/
p.x -= this.x0;
p.y -= this.y0;
 lat = p.y / this.R;
if (Math.abs(lat) > HALF_PI) 
   {
   alert("Input data error","sinusoidal-inverse");
   //return(164);
   }
 temp = Math.abs(lat) - HALF_PI;
if (Math.abs(temp) > EPSLN)
   {
   temp = this.long0+ p.x / (this.R *Math.cos(lat));
   var lon = adjust_lon(temp);
   }
else lon = this.long0;


  
 p.x=lon;
 p.y=lat;
}


