// the AVHRR composite in Goode-Homolosine projection
//var MaxRes = 64000;  // for the Goode-homolosine projection
//var MinRes =  1000;
//	var width = 626;
//	var height = 272;
//	MapProj = new Projection("GIH", new Array(-20015000, 8673000));
//	BaseLayer = new GeoImage("world", "test/worldby64.jpg", width, height, MapProj.BaseUL, MaxRes, MapProj);



//  GIHLL2LS transforms latitude, longitude coordinates to line, sample 
//    coordinates for an image in the Goode's Interrupted Homolosine 
//    projection.  

var PI = Math.PI;
var HALF_PI = PI*0.5;
var TWO_PI = PI*2.0;
var EPSLN = 1.0e-10;
var R2D = 57.2957795131;
var D2R =0.0174532925199;
var R = 6370997.0;				// Radius of the earth (sphere)
var lon_center = new Array(-1.74532925199,	// -100.0 degrees */
						 -1.74532925199,	// -100.0 degrees
						  0.523598775598,	//   30.0 degrees
						  0.523598775598,	//   30.0 degrees */
						 -2.79252680319,	// -160.0 degrees */
						 -1.0471975512,		//  -60.0 degrees */
						 -2.79252680319,	// -160.0 degrees */
						 -1.0471975512,		//  -60.0 degrees */
						  0.349065850399,	//   20.0 degrees */
						  2.44346095279,	//  140.0 degrees */
						  0.349065850399,	//   20.0 degrees */
						  2.44346095279);	//  140.0 degrees */
var ul_x = -20015000.0;
var ul_y =   8673000.0;

// Goode`s Homolosine forward equations--mapping lat,long to x,y
function ll2gih(coords) {
	var delta_lon;	// Delta longitude (Given longitude - center */
	var theta;
	var delta_theta;
	var constant;
	var region;
	var retval = new Array(2);
	var lon = coords[0];
	var lat = coords[1];

// convert to radians
	if ( lat <= 90.0 && lat >= -90.0 && lon <= 180.0 && lon >= -180.0) {
		lat *= D2R;
		lon *= D2R;
	} else {
		alert("*** Input out of range ***");
		return null
	}

// Forward equations
if (lat >= 0.710987989993)	             // if on or above 40 44' 11.8" */
   {
   if (lon <= -0.698131700798) region = 0;   // If to the left of -40 */
   else region = 2;
   }
else if (lat >= 0.0)			     // Between 0.0 and 40 44' 11.8" */
   {
   if (lon <= -0.698131700798) region = 1;   // If to the left of -40 */
   else region = 3;
   }
else if (lat >= -0.710987989993)   	     // Between 0.0 & -40 44' 11.8" */
   {
   if (lon <= -1.74532925199) region = 4;  	// If between -180 and -100 */
   else if (lon <= -0.349065850399) region = 5;	// If between -100 and -20 */
   else if (lon <= 1.3962634016) region = 8;	// If between -20 and 80 */
   else region = 9;				// If between 80 and 180 */
   }
else						// Below -40 44' */
   {
   if (lon <= -1.74532925199) region = 6;       // If between -180 and -100 */
   else if (lon <= -0.349065850399) region = 7;     // If between -100 and -20 */
   else if (lon <= 1.3962634016) region = 10;   // If between -20 and 80 */
   else region = 11;                            // If between 80 and 180 */
   }

if (region==1||region==3||region==4||region==5||region==8||region==9)
   {
   delta_lon = adjust_lon(lon - lon_center[region]);
   retval[0] = R * (lon_center[region] + delta_lon * Math.cos(lat));
   retval[1] = R * lat;
   }
else
   {
   delta_lon = adjust_lon(lon - lon_center[region]);
   theta = lat;
   constant = PI * Math.sin(lat);

// Iterate using the Newton-Raphson method to find theta
   for (var i=0; true; i++) {
      delta_theta = -(theta + Math.sin(theta) - constant) / (1.0 + Math.cos(theta));
      theta += delta_theta;
      if (Math.abs(delta_theta) < EPSLN) break;
      if (i >= 30) {
      	alert("Iteration failed to converge","Goode-forward");
      	return null;
      }
   }
   theta /= 2.0;
   retval[0] = R * (lon_center[region] + 0.900316316158 * delta_lon * Math.cos(theta));
   retval[1] = R * (1.4142135623731 * Math.sin(theta) - 0.0528035274542 * sign(lat));
   }

return retval;
}

// Goode`s Homolosine inverse equations--mapping x,y to lat,long 
function gih2ll(coords) {
var arg;
var theta;
var temp;
var region;
var retval = new Array(2);
var x = coords[0];
var y = coords[1];

// Inverse equations
if (y >= R * 0.710987989993)                 // if on or above 40 44' 11.8" */
   {
   if (x <= R * -0.698131700798) region = 0; // If to the left of -40 */
   else region = 2;
   }
else if (y >= 0.0)                           // Between 0.0 and 40 44' 11.8" */
   {
   if (x <= R * -0.698131700798) region = 1; // If to the left of -40 */
   else region = 3;
   }
else if (y >= R * -0.710987989993)           // Between 0.0 & -40 44' 11.8" */
   {
   if (x <= R * -1.74532925199) region = 4;     // If between -180 and -100 */
   else if (x <= R * -0.349065850399) region = 5; // If between -100 and -20 */
   else if (x <= R * 1.3962634016) region = 8;  // If between -20 and 80 */
   else region = 9;                             // If between 80 and 180 */
   }
else                                            // Below -40 44' 11.8" */
   {
   if (x <= R * -1.74532925199) region = 6;     // If between -180 and -100 */
   else if (x <= R * -0.349065850399) region = 7; // If between -100 and -20 */
   else if (x <= R * 1.3962634016) region = 10; // If between -20 and 80 */
   else region = 11;                            // If between 80 and 180 */
   }
x = x - R*lon_center[region];

	if (region==1||region==3||region==4||region==5||region==8||region==9) {
		lat = y / R;
		if (Math.abs(lat) > HALF_PI) {
			alert("Input data error","Goode-inverse");
			return null;
		}
		temp = Math.abs(lat) - HALF_PI;
		if (Math.abs(temp) > EPSLN) {
			temp = lon_center[region] + x / (R * Math.cos(lat));
			lon = adjust_lon(temp);
		} else {
			lon = lon_center[region];
		}
	} else{
		arg = (y + 0.0528035274542 * R * sign(y)) /  (1.4142135623731 * R);
		if (Math.abs(arg) > 1.0) return new Array(-999,-999);
		theta = Math.sin(arg);
		lon = lon_center[region]+(x/(0.900316316158 * R * Math.cos(theta)));
		if(lon < (-PI)) return new Array(-999,-999);
		arg = (2.0 * theta + Math.sin(2.0 * theta)) / PI;
		if (Math.abs(arg) > 1.0) return new Array(-999,-999);
		lat = Math.asin(arg);
	}

// Are we in a interrupted area?  If so, return status code of IN_BREAK.
if (region == 0 && (lon < -PI || lon > -0.698131700798))   return new Array(-999,-999);
if (region == 1 && (lon < -PI || lon > -0.698131700798))   return new Array(-999,-999);
if (region == 2 && (lon < -0.698131700798 || lon > PI))    return new Array(-999,-999);
if (region == 3 && (lon < -0.698131700798 || lon > PI))    return new Array(-999,-999);
if (region == 4 && (lon < -PI || lon > -1.74532925199))    return new Array(-999,-999);
if (region == 5&&(lon<-1.74532925199||lon>-0.349065850399))return new Array(-999,-999);
if (region == 6 && (lon < -PI || lon > -1.74532925199))    return new Array(-999,-999);
if (region == 7&&(lon<-1.74532925199||lon>-0.349065850399))return new Array(-999,-999);
if (region == 8 && (lon<-0.349065850399||lon>1.3962634016))return new Array(-999,-999);
if (region == 9 && (lon < 1.3962634016|| lon > PI))        return new Array(-999,-999);
if (region ==10 && (lon<-0.349065850399||lon>1.3962634016))return new Array(-999,-999);
if (region ==11 && (lon < 1.3962634016|| lon > PI))        return new Array(-999,-999);

return new Array(R2D*lon, R2D*lat);
}


// Function to return the sign of an argument
function sign(x) { if (x < 0.0) return(-1); else return(1);}

// Function to adjust longitude to -180 to 180
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}

//-->
