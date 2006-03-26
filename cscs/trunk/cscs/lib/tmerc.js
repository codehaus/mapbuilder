
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
function utmInit(def) {
  def.lat0 = 0.0;
  def.long0 = ((6 * Math.abs(def.zone)) - 183) * D2R;
  def.x0 = 500000.0;
  def.y0 = (def.zone < 0) ? 10000000.0 : 0.0;
  if (!def.k0)
    def.k0 = 0.9996;
  tmercInit(def);
} // utminit()


/**
  Transverse Mercator Forward  - long/lat to x/y
  long/lat in radians
*/
function tmercFwd(p) {
//this.k0
  var delta_lon = adjust_lon(p.x - this.long0); // Delta longitude
  var con;    // cone constant
  var x, y;
  var sin_phi=Math.sin(p.y);
  var cos_phi=Math.cos(p.y);

  if (this.ind != 0) {  /* spherical form */
    var b = cos_phi * Math.sin(delta_lon);
    if ((Math.abs(Math.abs(b) - 1.0)) < .0000000001)  {
      alert("Error in ll2tm(): Point projects into infinity");
      return(93);
    } else {
      x = .5 * this.a * this.k0 * Math.log((1.0 + b)/(1.0 - b));
      con = Math.acos(cos_phi * Math.cos(delta_lon)/Math.sqrt(1.0 - b*b));
      if (p.y < 0)
        con = - con;
      y = this.a * this.k0 * (con - this.lat0);
    }
  } else {
    var al  = cos_phi * delta_lon;
    var als = Math.pow(al,2);
    var c   = this.ep2 * Math.pow(cos_phi,2);
    var tq  = Math.tan(p.y);
    var t   = Math.pow(tq,2);
    con = 1.0 - this.es * Math.pow(sin_phi,2);
    var n   = this.a / Math.sqrt(con);
    var ml  = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, p.y);

    x = this.k0 * n * al * (1.0 + als / 6.0 * (1.0 - t + c + als / 20.0 * (5.0 - 18.0 * t + Math.pow(t,2) + 72.0 * c - 58.0 * this.ep2))) + this.x0;
    y = this.k0 * (ml - this.ml0 + n * tq * (als * (0.5 + als / 24.0 * (5.0 - t + 9.0 * c + 4.0 * Math.pow(c,2) + als / 30.0 * (61.0 - 58.0 * t + Math.pow(t,2) + 600.0 * c - 330.0 * this.ep2))))) + this.y0;

  }
  p.x=x;
  p.y=y;
} // tmercFwd()

var utmFwd = tmercFwd;

/**
  Transverse Mercator Inverse  -  x/y to long/lat
*/
function tmercInv(p) {
  var con, phi;  /* temporary angles       */
  var delta_phi; /* difference between longitudes    */
  var i;
  var max_iter = 6;      /* maximun number of iterations */
  var lat, lon;

  if (this.ind != 0) {   /* spherical form */
    var f = exp(p.x/(this.a * this.k0));
    var g = .5 * (f - 1/f);
    var temp = this.lat0 + p.y/(this.a * this.k0);
    var h = cos(temp);
    con = sqrt((1.0 - h * h)/(1.0 + g * g));
    lat = asinz(con);
    if (temp < 0)
      lat = -lat;
    if ((g == 0) && (h == 0)) {
      lon = this.long0;
    } else {
      lon = adjust_lon(atan2(g,h) + this.long0);
    }
  } else {    // ellipsoidal form
    p.x -= this.x0;
    p.y -= this.y0;

    con = (this.ml0 + p.y / this.k0) / this.a;
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
      var n = this.a / Math.sqrt(con);
      var r = n * (1.0 - this.es) / con;
      var d = p.x / (n * this.k0);
      var ds = Math.pow(d,2);
      lat = phi - (n * tan_phi * ds / r) * (0.5 - ds / 24.0 * (5.0 + 3.0 * t + 10.0 * c - 4.0 * cs - 9.0 * this.ep2 - ds / 30.0 * (61.0 + 90.0 * t + 298.0 * c + 45.0 * ts - 252.0 * this.ep2 - 3.0 * cs)));
      lon = adjust_lon(this.long0 + (d * (1.0 - ds / 6.0 * (1.0 + 2.0 * t + c - ds / 20.0 * (5.0 - 2.0 * c + 28.0 * t - 3.0 * cs + 8.0 * this.ep2 + 24.0 * ts))) / cos_phi));
    } else {
      lat = HALF_PI * sign(p.y);
      lon = this.long0;
    }
  }
  p.x=lon;
  p.y=lat;
} // tmercInv()

var utmInv = tmercInv;