// 07 March, 2006
// Richard Greenwood

/**
  cscs_h.js is very loosely based on PROJ.4 projects.h
  it's a catch-all 'header' file
  eventually it should go away - the declarations herein should
  be moved to into some globally included file when the structure
  matures more.
*/

var PI = Math.PI;
var HALF_PI=PI*0.5;
var TWO_PI=PI*2;
var R2D=57.2957795131;
var D2R=0.0174532925199;

/* datum_type values */
var PJD_UNKNOWN  = 0;
var PJD_3PARAM   = 1;
var PJD_7PARAM   = 2;
var PJD_GRIDSHIFT= 3;
var PJD_WGS84    = 4;   // WGS84 or equivelent

var pj_errno;
var PJD_ERR_GEOCENTRIC = -45;

function ll2ll(p) { }   // this doesn't belong in here


// point object, nothing fancy, just allows values
// to be passed back and forth by reference rather than value
function PT(x,y,z) {
  this.x=x;
  this.y=y;
  this.z=z;
}


// constructor function
// coordinate system definition (based on PJ typedef struct in PROJ.4)
function CS(srs) {

  var def = lookUp(srs);

  /*****  from MapBuilder Proj.js *****/
  this.title = def.title;
  this.Init = def.init;   // initilization function, I have this on the "server-side" now
  this.Forward = def.fwd;   // name of forward function (long/lat to x/y)
  this.Inverse = def.inv;   // name of inverse function (x/y to long/lat)
  this.units = def.units;

    /*****  from Proj.4 projects.h *****/
    // void (*spc)(LP, struct PJconsts *, struct FACTORS *);
    // void (*pfree)(struct PJconsts *);
    // paralist *params;    /* parameter list */
    //this.over;            /* over-range flag */
    //this.geoc;            /* geocentric latitude flag */
  this.is_latlong = (def.latlongflag) ? (def.latlongflag) : false ;  /* proj=latlong */
    //this.is_geocent = def.geocentflag;  /* proj=geocent */
  this.a = def.a;           /* major axis or radius if es==0 */
  this.b = def.b            // semi minor axis - meters
  this.a2 = this.a * this.a;          // used in geocentric
  this.b2 = this.b * this.b;          // used in geocentric
  this.es=(this.a2-this.b2)/this.a2;  // e ^ 2
    //this.es=1-(Math.pow(this.b,2)/Math.pow(this.a,2));
  this.e = Math.sqrt(this.es);      // eccentricity
  this.ep2=(this.a2-this.b2)/this.b2; // used in geocentric
    // this.esp = this.es / (1.0 - this.es);
  if (def.long0)
    this.long0 = def.long0*D2R;   /* lam0, central longitude */
  if ( def.lat0)
    this.lat0 = def.lat0*D2R;     /* phi0, central latitude */
  if (def.falseEast)
    this.x0 = def.falseEast;  /* easting and northing */
  if (def.falseNorth)
    this.y0 = def.falseNorth;
  if (def.k0)
    this.k0 = def.k0;          /* general scaling factor */
  this.to_meter,            /* cartesian scaling */
  this.fr_meter;

     // who is using these?
  //this.ra = 1.0 / def.a;          // 1/A
  //this.one_es = 1 -this.es ;      // 1 - e^2
  //this.rone_es = 1 / this.one_es; // 1/one_es


  if (def.to_wgs84) {
    this.datum_params = def.to_wgs84.split(",");
    for (var i=0; i<this.datum_params.length; i++)
      this.datum_params[i]=parseFloat(this.datum_params[i]);
    if (this.datum_params[3] != 0 ||
        this.datum_params[4] != 0 ||
        this.datum_params[5] != 0 ||
        this.datum_params[6] !=0 )
      this.datum_type = PJD_7PARAM;
    else if (this.datum_params[0] != 0 ||
        this.datum_params[1] != 0 ||
        this.datum_params[2] !=0 )
      this.datum_type = PJD_3PARAM;
    else
      this.datum_type = PJD_WGS84;
  } else {
    this.datum_type = PJD_WGS84;
  }

  if (def.from_greenwich)
    this.from_greenwich = def.from_greenwich*D2R;

  // this.proj_params = cs.pp;
  // cs.pp = new tminit(cs.es, cs.a, cs.lat0);
  if (this.Init)
    // this.proj_params = new this.Init(def);
    this.proj_params = new this.Init(this);

  delete def;

} // CS
