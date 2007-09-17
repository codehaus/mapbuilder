Proj4js.Proj.aeqd = Class.create();
Proj4js.Proj.aeqd.prototype = {
  init : function() {
    this.sin_p12=Math.sin(this.lat0)
    this.cos_p12=Math.cos(this.lat0)
  },

  forward: function(p) {
    var lon=p.x;
    var lat=p.y;

    var sinphi=Math.sin(p.y);
    var cosphi=Math.cos(p.y); 
    var dlon = Proj4js.const.adjust_lon(lon -this.long0);
    var coslon = Math.cos(dlon);
    var g = this.sin_p12 * sinphi + this.cos_p12 * cosphi * coslon;
    if (Math.abs(Math.abs(g) - 1.0) < Proj4js.const.EPSLN)
       {
       var ksp = 1.0;
       if (g < 0.0)
         {
       var  con = 2.0 * Proj4js.const.HALF_PI * this.a;
            if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("aeqdFwdPointError"));
            }
       }
    else
       {
       var z = Math.acos(g);
        ksp = z/ Math.sin(z);
       }
    var x = this.x0+this. a * ksp * cosphi * Math.sin(dlon);
    var y = this.y0 + this.a * ksp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * coslon);
    return new Proj4js.Point(x, y);
  }

  inverse: function(p){
    p.x -= this.x0;
    p.y -= this.y0;

    var rh = Math.sqrt(p.x * p.x + p.y *p. y);
    if (rh > (2.0 * Proj4js.const.HALF_PI * this.a))
       {
       if (!MB_IGNORE_CSCS_ERRORS) alert(mbGetMessage("aeqdInvDataError"));


       }
    var z = rh / this.a;

    var sinz=Math.sin(z)
    var cosz=Math.cos(z)

    var lon = this.long0;
    if (Math.abs(rh) <= EPSLN)
       {
       var lat = this.lat0;

       }
    lat = asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
    this.t3=lat;
    var con = Math.abs(this.lat0) - Proj4js.const.HALF_PI;
    if (Math.abs(con) <= Proj4js.const.EPSLN)
       {
       if (lat0 >= 0.0)
          {
          lon = adjust_lon(this.long0 + Math.atan2(p.x , -p.y));

          }
       else
          {
         lon = adjust_lon(this.long0 - Math.atan2(-p.x , p.y));

          }
       }

    con = cosz - this.sin_p12 * Math.sin(lat);
    if ((Math.abs(con) < Proj4js.const.EPSLN) && (Math.abs(x) < Proj4js.const.EPSLN))
       return(19);
    this.t1= this.cos_p12;
    this.t2=con * rh;
    this. temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
    lon = Proj4js.const.adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));

    return new Proj4js.Point(lon, lat);
  } 
};
