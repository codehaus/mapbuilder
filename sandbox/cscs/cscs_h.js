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

function longlatFwd(p) {}   // these don't belong in here
function longlatInv(p) {}
function longlatInit(p){}


// point object, nothing fancy, just allows values
// to be passed back and forth by reference rather than value
function PT(x,y,z) {
  this.x=x;
  this.y=y;
  this.z=z;
}


var csList = new Object();


// coordinate system definition constructor function
function CS(def) {

  // var def = lookUp(srs);  // this could be a call to an external web service or something

  /*
    I'm trying to generally follow PRGJ.4 format e.g.
      +proj="tmerc"   //longlat, etc.
      +a=majorRadius
      +b=minorRadius
      +lat0=somenumber
      +long=somenumber
    This would allow us to pass specific parameters or use the lookUp(srs) above.


          srs = srs.toUpperCase();
          if (srs.indexOf("EPSG") == 0)
            def = lookUp(srs);
          else
            def = srs.split("+");
          for (var i=0; i<def.length; i++) {
            property=def[1].split("=");
            if property[0]="proj"
              this.proj=property[1];
            if ...
          }


  */

  var paramName, paramVal;
  var paramArray=def.split("+");

  for (var prop=0; prop<paramArray.length; prop++) {
    property = paramArray[prop].split("=");
    paramName= property[0].toLowerCase();
    paramVal = property[1];

    switch (paramName.replace(/\s/gi,"")) {
      case "": break;   // throw away nameless parameter
      case "title": this.title =paramVal; break;
      case "proj":  this.proj = paramVal.replace(/\s/gi,""); break;
      case "ellps": this.ellps = paramVal.replace(/\s/gi,""); break;
      case "a":     this.a =  parseFloat(paramVal);  break; // semi-major radius
      case "b":     this.b =  parseFloat(paramVal);  break; // semi-minor radius
      case "lon_0": this.long0= paramVal*D2R; break;        // lam0, central longitude
      case "lat_0": this.lat0 = paramVal*D2R; break;        // phi0, central latitude
      case "x_0":   this.x0 = parseFloat(paramVal); break;  // false easting
      case "y_0":   this.y0 = parseFloat(paramVal); break;  // false northing
      case "k":     this.k0 = parseFloat(paramVal); break;  // projection scale factor
      case "to_meter": this.to_meter = parseFloat(paramVal); break; // cartesian scaling
      case "zone":   this.zone =  parseInt(paramVal); break;  // UTM Zone
      case "towgs84":
        this.datum_params = paramVal.split(",");
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
        break
      case "from_greenwich": this.from_greenwich = paramVal*D2R; break;
      default: // check for unrecognized parameters
        if (!this.warning)
          this.warning = new Array("unrecognized parameter: " + paramName);
        else
          this.warning[this.warning.length] = "unrecognized parameter: " + paramName;
    } // switch()
  } // for paramArray

  if (this.ellps) {
    this.a = eval("ellps_"+this.ellps.toLowerCase()+".a");
    this.b = eval("ellps_"+this.ellps.toLowerCase()+".b")
  }

  if (this.proj) {    // The Forward, Inverse, and Initilization functions are derived from the projection name.
    this.Forward = eval(this.proj+"Fwd"); // name of forward function (long/lat to x/y)
    this.Inverse = eval(this.proj+"Inv"); // name of inverse function (x/y to long/lat)
    this.Init = eval(this.proj+"Init");   // initilization function
    this.is_latlong = (this.proj.toLowerCase() == "longlat") ? true : false ;  /* proj=latlong */
  }

  this.a2 = this.a * this.a;          // used in geocentric
  this.b2 = this.b * this.b;          // used in geocentric
  this.es=(this.a2-this.b2)/this.a2;  // e ^ 2
    //this.es=1-(Math.pow(this.b,2)/Math.pow(this.a,2));
  this.e = Math.sqrt(this.es);        // eccentricity
  this.ep2=(this.a2-this.b2)/this.b2; // used in geocentric
  if (!this.datum_type)
    this.datum_type = PJD_WGS84;
  if (this.Init)
    this.Init(this);

} // CS



/*
  In most map projection formulas, some form of the eccentricity e is used,
  rather than the flattening f. The relationship is as follows:

  e² = 2f - f²  or  e² =f(2-f)
     or
  f = 1 - (1 - e²)½

    if( es == 0.0 )
        b = a;
    else
        b = a * Math.sqrt(1-es);
*/

function Ellps(id, a, b, rf, name) {
  if (!b && !f) {
    alert("Error: must supply either b (semi-minor axis), or f (flattening)");
    return;
  }
  this.id = id
  this.a = a;
  if (!b)
    this.b = semi_minor(a, rf);
  else
    this.b = b;
  this.rf = rf;
  this.name = name;
}


function semi_minor(a, f) { return a-(a*(1/f)); }

                      /*     id,     a,         b,                1/f,            verbose description (optional)  */
var ellps_grs80 = new Ellps("GRS80", 6378137.0, 6356752.31414036, 298.257222101, "GRS 1980(IUGG, 1980)");
var ellps_wgs84 = new Ellps("WGS84", 6378137.0, 6356752.31424518, 298.257223563, "WGS 84");
var ellps_wgs72 = new Ellps("WGS 72",6378135.0, 6356750.52001609, 298.26,        "WGS 72");
var ellps_intl  = new Ellps("intl",  6378388.0, 6356911.94612795, 297.0,         "International 1909 (Hayford)");
var ellps_clrk66= new Ellps("clrk66",6378206.4, 6356583.8,        294.9786982,   "Clarke 1866");

/*
"clrk80", "a=6378249.145", "rf=293.4663", "Clarke 1880 mod."
"bessel", "a=6377397.155", "rf=299.1528128", "Bessel 1841"
"bess_nam", "a=6377483.865", "rf=299.1528128", "Bessel 1841 (Namibia)"
*/


var us_ft = 1200/3937;  // US Survey foot
var ft = 0.3048;  // International foot

