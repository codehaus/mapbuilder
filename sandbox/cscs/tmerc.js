
// following functions from gctpc cproj.c for transverse mercator projections
function e0fn(x){return(1.0-0.25*x*(1.0+x/16.0*(3.0+1.25*x)));}
function e1fn(x){return(0.375*x*(1.0+0.25*x*(1.0+0.46875*x)));}
function e2fn(x){return(0.05859375*x*x*(1.0+0.75*x));}
function e3fn(x){return(x*x*x*(35.0/3072.0));}
function mlfn(e0,e1,e2,e3,phi){return(e0*phi-e1*Math.sin(2.0*phi)+e2*Math.sin(4.0*phi)-e3*Math.sin(6.0*phi));}

// Function to adjust longitude to -180 to 180; input in radians
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}
// Function to return the sign of an argument
function sign(x) { if (x < 0.0) return(-1); else return(1);}

/**
  Initialize Transverse Mercator projection
*/


function tmercInit(def)  {
  def.e0 = e0fn(def.es);
  def.e1 = e1fn(def.es);
  def.e2 = e2fn(def.es);
  def.e3 = e3fn(def.es);
  def.ml0 = def.a * mlfn(def.e0, def.e1, def.e2, def.e3, def.lat0);
  def.ind = (def.es < .00001) ? 1 : 0; // spherical?
}


/**
  Initialize UTM projection
*/
function utminit(param) {
  this.r_maj=param[0];
  this.r_min=param[1];
  this.scale_fact=param[2];
  var zone=param[3];
  this.lat_origin = 0.0;
  this.lon_center = ((6 * Math.abs(zone)) - 183) * D2R;
  this.false_easting = 500000.0;
  this.false_northing = (zone < 0) ? 10000000.0 : 0.0;
  var temp = this.r_min / this.r_maj;
  this.es = 1.0 - Math.pow(temp,2);
//  this.e = Math.sqrt(this.es);
  this.e0 = e0fn(this.es);
  this.e1 = e1fn(this.es);
  this.e2 = e2fn(this.es);
  this.e3 = e3fn(this.es);
  this.ml0 = this.r_maj * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat_origin);
  // this.esp = this.es / (1.0 - this.es);  // this duplicates ep2 in base CS definition
  this.ind = (this.es < .00001) ? 1 : 0;
} // utminit()

/**
  Transverse Mercator Forward  - long/lat to x/y
  long/lat in radians
*/
function tmercFwd(cs, p) {
//cs.k0
  var delta_lon = adjust_lon(p.x - cs.long0); // Delta longitude
  var con;    // cone constant
  var x, y;
  var sin_phi=Math.sin(p.y);
  var cos_phi=Math.cos(p.y);

  if (cs.ind != 0) {
    var b = cos_phi * Math.sin(delta_lon);
    if ((Math.abs(Math.abs(b) - 1.0)) < .0000000001)  {
      alert("Error in ll2tm(): Point projects into infinity");
      return(93);
    } else {
      x = .5 * cs.a * cs.k0 * Math.log((1.0 + b)/(1.0 - b));
      con = Math.acos(cos_phi * Math.cos(delta_lon)/Math.sqrt(1.0 - b*b));
      if (p.y < 0)
        con = - con;
      y = cs.a * cs.k0 * (con - cs.lat0);
    }
  } else {
    var al  = cos_phi * delta_lon;
    var als = Math.pow(al,2);
    var c   = cs.ep2 * Math.pow(cos_phi,2);
    var tq  = Math.tan(p.y);
    var t   = Math.pow(tq,2);
    con = 1.0 - cs.es * Math.pow(sin_phi,2);
    var n   = cs.a / Math.sqrt(con);
    var ml  = cs.a * mlfn(cs.e0, cs.e1, cs.e2, cs.e3, p.y);

    x = cs.k0 * n * al * (1.0 + als / 6.0 * (1.0 - t + c + als / 20.0 * (5.0 - 18.0 * t + Math.pow(t,2) + 72.0 * c - 58.0 * cs.ep2))) + cs.x0;
    y = cs.k0 * (ml - cs.ml0 + n * tq * (als * (0.5 + als / 24.0 * (5.0 - t + 9.0 * c + 4.0 * Math.pow(c,2) + als / 30.0 * (61.0 - 58.0 * t + Math.pow(t,2) + 600.0 * c - 330.0 * cs.ep2))))) + cs.y0;

    if (cs.to_meter) {
      x /= cs.to_meter;
      y /= cs.to_meter
    }
  }
  p.x=x;
  p.y=y;
} // tmercFwd()

/**
  Transverse Mercator Inverse  -  x/y to long/lat
*/
function tmercInv(coords) {
  var x=coords[0];
  var y=coords[1];
  var con, phi;  /* temporary angles       */
  var delta_phi; /* difference between longitudes    */
  var i;
  var max_iter = 6;      /* maximun number of iterations */
  var lat, lon;

  if (this.ind != 0) {   /* spherical form */
    var f = exp(x/(this.r_maj * this.scale_fact));
    var g = .5 * (f - 1/f);
    var temp = this.lat_origin + y/(this.r_maj * this.scale_fact);
    var h = cos(temp);
    con = sqrt((1.0 - h * h)/(1.0 + g * g));
    lat = asinz(con);
    if (temp < 0)
      lat = -lat;
    if ((g == 0) && (h == 0)) {
      lon = this.lon_center;
    } else {
      lon = adjust_lon(atan2(g,h) + this.lon_center);
    }
  } else {    // ellipsoidal form
    x = x - this.false_easting;
    y = y - this.false_northing;

    con = (this.ml0 + y / this.scale_fact) / this.r_maj;
    phi = con;
    for (i=0;;i++) {
      delta_phi=((con + this.e1 * Math.sin(2.0*phi) - this.e2 * Math.sin(4.0*phi) + this.e3 * Math.sin(6.0*phi)) / this.e0) - phi;
      phi += delta_phi;
      if (Math.abs(delta_phi) <= EPSLN) break;
      if (i >= max_iter) {
        alert ("Error in tm2ll(): Latitude failed to converge");
        return(95);
      }
    } // for()
    if (Math.abs(phi) < HALF_PI) {
      // sincos(phi, &sin_phi, &cos_phi);
      var sin_phi=Math.sin(phi);
      var cos_phi=Math.cos(phi);
      var tan_phi = Math.tan(phi);
      var c = this.ep2 * Math.pow(cos_phi,2);
      var cs = Math.pow(c,2);
      var t = Math.pow(tan_phi,2);
      var ts = Math.pow(t,2);
      con = 1.0 - this.es * Math.pow(sin_phi,2);
      var n = this.r_maj / Math.sqrt(con);
      var r = n * (1.0 - this.es) / con;
      var d = x / (n * this.scale_fact);
      var ds = Math.pow(d,2);
      lat = phi - (n * tan_phi * ds / r) * (0.5 - ds / 24.0 * (5.0 + 3.0 * t + 10.0 * c - 4.0 * cs - 9.0 * this.ep2 - ds / 30.0 * (61.0 + 90.0 * t + 298.0 * c + 45.0 * ts - 252.0 * this.ep2 - 3.0 * cs)));
      lon = adjust_lon(this.lon_center + (d * (1.0 - ds / 6.0 * (1.0 + 2.0 * t + c - ds / 20.0 * (5.0 - 2.0 * c + 28.0 * t - 3.0 * cs + 8.0 * this.ep2 + 24.0 * ts))) / cos_phi));
    } else {
      lat = HALF_PI * sign(y);
      lon = this.lon_center;
    }
  }
  return new Array(lon*R2D, lat*R2D);
} // tmercInv()