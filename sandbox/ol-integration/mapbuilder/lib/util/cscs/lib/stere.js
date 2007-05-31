// Function to return the sign of an argument
function sign(x) { if (x < 0.0) return(-1); else return(1);}

// Function to adjust longitude to -180 to 180; input in radians
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}


// Initialize the Stereographic projection

stereInit = function (def) {
  //array consisting of:
  //double r_maj;         /* major axis           */
  //double center_lon;    /* center longitude     */
  //double center_lat;    /* center latitude      */
  //double false_east;    /* x offset in meters   */
  //double false_north;   /* y offset in meters   */

 
  // sincos(center_lat,&sin_p10,&cos_p10);
  def.sin_p10=Math.sin(def.lat0);
  def.cos_p10=Math.cos(def.lat0);
} // stint()


// Stereographic forward equations--mapping lat,long to x,y
stereFwd = function(p) {
  var lon = p.x;
  var lat = p.y;
  var ksp;              /* scale factor               */

// no need to convert to radians
  if ( lat <= 90.0 && lat >= -90.0 && lon <= 180.0 && lon >= -180.0) {
    
  } else {
    alert("llInput Out Of Range", lon, lat);
    return null;
  }
  var dlon = adjust_lon(lon - this.long0);
  // sincos(lat,&sinphi,&cosphi);
  var sinphi=Math.sin(lat);
  var cosphi=Math.cos(lat);
  var coslon = Math.cos(dlon);
  var g = this.sin_p10 * sinphi + this.cos_p10 * cosphi * coslon;
  if (Math.abs(g + 1.0) <= EPSLN) {
    alert("ll2st Infinite Projection");
    return null;
  } else {
    ksp = 2.0 / (1.0 + g);
    var x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon);
    var y = this.y0 + this.a * ksp * (this.cos_p10 * sinphi - this.sin_p10 * cosphi * coslon);
   // return new Array(x,y);
  }
 p.x=x;
 p.y=y;
} 


//* Stereographic inverse equations--mapping x,y to lat/long
stereInv = function (p) {
  var x = (p.x - this.x0);
  var y = (p.y - this.y0);
  var rh = Math.sqrt(x * x + y * y);                  /* height above ellipsoid */
  var z = 2.0 * Math.atan(rh / (2.0 * this.a)); /* angle                  */
  //sincos(z,&sinz,&cosz);
  var sinz=Math.sin(z);
  var cosz=Math.cos(z);
  var lat;
  var lon = this.long0;
  if (Math.abs(rh) <= EPSLN) {
     lat = this.lat0;
  } else {
     lat = Math.asin(cosz * this.sin_p10 + (y * sinz * this.cos_p10) / rh);
     var con = Math.abs(this.lat0) - HALF_PI;
     if (Math.abs(con) <= EPSLN) {
       if (this.lat0 >= 0.0) {
         lon = adjust_lon(this.long0 + Math.atan2(x, -y));
         /// return(OK);
       } else {
         lon = adjust_lon(this.long0 - Math.atan2(-x, y));
         // return(OK);
       }
     } else {
       con = cosz - this.sin_p10 * Math.sin(lat);
       if ((Math.abs(con) < EPSLN) && (Math.abs(x) < EPSLN))  {
          // return(OK);
       } else {
         lon = adjust_lon(this.long0 + Math.atan2((x * sinz * this.cos_p10), (con * rh)));
       }
     }
   }
 p.x=lon;
 p.y=lat;
} 