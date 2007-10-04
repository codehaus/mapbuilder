
Proj4js.Proj.gauss = {

  init : function() {
    sphi = Math.sin(this.lat0);
    cphi = Math.cos(this.lat0);  
    cphi *= cphi;
    this.rc = Math.sqrt(1.0 - this.es) / (1.0 - this.es * sphi * sphi);
    this.C = Math.sqrt(1.0 + this.es * cphi * cphi / (1.0 - this.es));
    this.phic0 = Math.asin(sphi / this.C);
    this.ratexp = 0.5 * this.C * this.e;
    this.K = Math.tan(0.5 * this.phic0 + Proj4js.const.FORTPI) / (Math.pow(Math.tan(0.5*this.lat0 + Proj4js.const.FORTPI), this.C) * Proj4js.const.srat(this.e*sphi, this.ratexp));
  },

  forward : function(p) {
    var lon = p.x;
    var lat = p.y;
    // convert to radians
    lon = lon * Proj4js.const.D2R;
    lat = lat * Proj4js.const.D2R;

    lon = Proj4js.const.adjust_lon(lon-this.long0); /* adjust del longitude */
    p.y = 2.0 * Math.atan( this.K * Math.pow(Math.tan(0.5 * lat + Proj4js.const.FORTPI), this.C) * Proj4js.const.srat(this.e * Math.sin(lat), this.ratexp) ) - Proj4js.const.HALF_PI;
    p.x = this.C * lon;
    //p.x = this.a * p.x + this.x0;
    //p.y = this.a * p.y + this.y0;
    return p;
  },

  inverse : function(p) {
    //p.x = (p.x - this.x0) * this.a; /* descale and de-offset */
    //p.y = (p.y - this.y0) * this.a;

    var DEL_TOL = 1e-14;
    p.x = p.x / this.C;
    var lat = p.y;
    num = Math.pow(Math.tan(0.5 * p.y + Proj4js.const.FORTPI)/this.K, 1./this.C);
    for (var i = Proj4js.const.MAX_ITER; i>0; --i) {
      lat = 2.0 * Math.atan(num * Proj4js.const.srat(this.e * Math.sin(p.y), -0.5 * this.e)) - Proj4js.const.HALF_PI;
      if (Math.abs(lat - p.y) < DEL_TOL) break;
      p.y = lat;
    }	
    /* convergence failed */
    if (!i) {
      Proj4js._reportError("gauss:inverse:convergence failed");
      return null;
    }

    p.x = Proj4js.const.adjust_lon(p.x + this.long0); /* adjust longitude to CM */

    p.x = p.x*Proj4js.const.R2D;
    p.y = lat*Proj4js.const.R2D;
    return p;
  }
};

