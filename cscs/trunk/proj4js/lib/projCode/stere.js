
// Initialize the Stereographic projection

Proj4js.Proj.stere = {
  init : function() {
    // sincos(center_lat,&sin_p10,&cos_p10);
    this.sin_p10=Math.sin(this.lat0);
    this.cos_p10=Math.cos(this.lat0);
  }, // stint()


// Stereographic forward equations--mapping lat,long to x,y
  forward: function(p) {
    var lon = p.x;
    var lat = p.y;
    var ksp;              /* scale factor               */

  // no need to convert to radians
    if ( lat <= 90.0 && lat >= -90.0 && lon <= 180.0 && lon >= -180.0) {

    } else {
      Proj4js.reportError("stere:forward:llInputOutOfRange", lon, lat);
      return null;
    }
    var dlon = Proj4js.common.adjust_lon(lon - this.long0);
    // sincos(lat,&sinphi,&cosphi);
    var sinphi=Math.sin(lat);
    var cosphi=Math.cos(lat);
    var coslon = Math.cos(dlon);
    var g = this.sin_p10 * sinphi + this.cos_p10 * cosphi * coslon;
    if (Math.abs(g + 1.0) <= Proj4js.common.EPSLN) {
      Proj4js.reportError("stere:forward:ll2stInfiniteProjection");
      return null;
    } else {
      ksp = 2.0 / (1.0 + g);
      p.x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon);
      p.y = this.y0 + this.a * ksp * (this.cos_p10 * sinphi - this.sin_p10 * cosphi * coslon);
      return p;
    }
  },


//* Stereographic inverse equations--mapping x,y to lat/long
  inverse: function(p) {
      var x = (p.x - this.x0);
      var y = (p.y - this.y0);
      var rh = Math.sqrt(x * x + y * y);                  /* height above ellipsoid */
      var z = 2.0 * Math.atan(rh / (2.0 * this.a)); /* angle                  */
      //sincos(z,&sinz,&cosz);
      var sinz=Math.sin(z);
      var cosz=Math.cos(z);
      var lat;
      var lon = this.long0;
      if (Math.abs(rh) <= Proj4js.common.EPSLN) {
         lat = this.lat0;
      } else {
         lat = Math.asin(cosz * this.sin_p10 + (y * sinz * this.cos_p10) / rh);
         var con = Math.abs(this.lat0) - Proj4js.common.HALF_PI;
         if (Math.abs(con) <= Proj4js.common.EPSLN) {
           if (this.lat0 >= 0.0) {
             lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2(x, -y));
             /// return(OK);
           } else {
             lon = Proj4js.common.adjust_lon(this.long0 - Math.atan2(-x, y));
             // return(OK);
           }
         } else {
           con = cosz - this.sin_p10 * Math.sin(lat);
           if ((Math.abs(con) < Proj4js.common.EPSLN) && (Math.abs(x) < Proj4js.common.EPSLN))  {
              // return(OK);
           } else {
             lon = Proj4js.common.adjust_lon(this.long0 + Math.atan2((x * sinz * this.cos_p10), (con * rh)));
           }
         }
       }
      p.x = lon;
      p.y = lat;
      return p;
  }
}; 
