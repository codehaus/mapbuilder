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
var EPSLN = 1.0e-10;

/* datum_type values */
var PJD_UNKNOWN  = 0;
var PJD_3PARAM   = 1;
var PJD_7PARAM   = 2;
var PJD_GRIDSHIFT= 3;
var PJD_WGS84    = 4;   // WGS84 or equivelent

var csErrorMessage = "";

/** point object, nothing fancy, just allows values to be
    passed back and forth by reference rather than value
*/
function PT(x,y,z) {
  this.x=x;
  this.y=y;
  this.z=z;
}

/**
  csList is a collection of coordiante system objects
  generally a CS is added by means of a separate .js file for example:

    <SCRIPT type="text/javascript" src="defs/EPSG26912.js"></SCRIPT>

*/
var csList = new Object();

// These are so widely used, we'll go ahead and throw them in
// without requiring a separate .js file
csList.EPSG4326 = "+title=long / lat WGS84 +proj=longlat";  // +a=6378137.0 +b=6356752.31424518"; //  +ellps=WGS84 +datum=WGS84";
csList.EPSG4269 = "+title=long / lat NAD83 +proj=longlat";  // +a=6378137.0 +b=6356752.31414036"; //  +ellps=GRS80 +datum=NAD83";

/**
  Coordinate System constructor
  def is a CS definition in PROJ.4 format, for example:
    +proj="tmerc"   //longlat, etc.
    +a=majorRadius
    +b=minorRadius
    +lat0=somenumber
    +long=somenumber
*/
function CS(def) {
  if(!def) {  // def is optional, if not provided, default to longlat WGS84
    var def = csList.EPSG4326;
    csErrorMessage += "No coordinate system definition provided, assuming longlat WGS83";
  }
  var paramName, paramVal;
  var paramArray=def.split("+");

  for (var prop=0; prop<paramArray.length; prop++)
  {
    property = paramArray[prop].split("=");
    paramName= property[0].toLowerCase();
    paramVal = property[1];

    switch (paramName.replace(/\s/gi,""))   // trim out spaces
    {
      case "": break;   // throw away nameless parameter
      case "title": this.title =paramVal; break;
      case "proj":  this.proj =  paramVal.replace(/\s/gi,""); break;
      // case "ellps": this.ellps = paramVal.replace(/\s/gi,""); break;
      // case "datum": this.datum = paramVal.replace(/\s/gi,""); break;
      case "a":     this.a =  parseFloat(paramVal);  break; // semi-major radius
      case "b":     this.b =  parseFloat(paramVal);  break; // semi-minor radius
      case "lon_0": this.long0= paramVal*D2R; break;        // lam0, central longitude
      case "lat_0": this.lat0 = paramVal*D2R; break;        // phi0, central latitude
      case "x_0":   this.x0 = parseFloat(paramVal); break;  // false easting
      case "y_0":   this.y0 = parseFloat(paramVal); break;  // false northing
      case "k":     this.k0 = parseFloat(paramVal); break;  // projection scale factor
      //case "to_meter": this.to_meter = parseFloat(paramVal); break; // cartesian scaling
      case "to_meter": this.to_meter = eval(paramVal); break; // cartesian scaling
      case "zone":     this.zone =  parseInt(paramVal); break;      // UTM Zone
      case "towgs84":  this.datum_params = paramVal.split(","); break;
      case "from_greenwich": this.from_greenwich = paramVal*D2R; break;
      default: csErrorMessage += "\nUnrecognized parameter: " + paramName;
    } // switch()
  } // for paramArray


  if (this.datum_params)  {
    for (var i=0; i<this.datum_params.length; i++)
      this.datum_params[i]=parseFloat(this.datum_params[i]);
    if (this.datum_params.length > 3)
    {
      if (this.datum_params[3] != 0 ||
          this.datum_params[4] != 0 ||
          this.datum_params[5] != 0 ||
          this.datum_params[6] !=0 )
        this.datum_type = PJD_7PARAM;
    }
    else
    {
      if (this.datum_params[0] != 0 ||
          this.datum_params[1] != 0 ||
          this.datum_params[2] !=0 )
        this.datum_type = PJD_3PARAM;
    }
  }

  if (!this.datum_type)
    this.datum_type = PJD_WGS84;

  /* ********************
    should look for errors here,
      required for longlat:
        proj, datum_type
      additional requirements for projected CSs:
        Forward(), Inverse(), Inint()
  ********************* */


  if (this.proj != "longlat") {    // The Forward, Inverse, and Initilization functions are derived from the projection name.
    this.Forward = eval(this.proj+"Fwd");
    this.Inverse = eval(this.proj+"Inv"); // name of inverse function (x/y to long/lat)
    this.Init  =  eval(this.proj+"Init"); // initilization function
    if (!this.a) {    // do we have an ellipsoid?
      this.a = 6378137.0;
      this.b = 6356752.31424518;
      csErrorMessage += "\nEllipsoid parameters not provided, assuming WGS84";
    }
    this.a2 = this.a * this.a;          // used in geocentric
    this.b2 = this.b * this.b;          // used in geocentric
    this.es=(this.a2-this.b2)/this.a2;  // e ^ 2
      //this.es=1-(Math.pow(this.b,2)/Math.pow(this.a,2));
    this.e = Math.sqrt(this.es);        // eccentricity
    this.ep2=(this.a2-this.b2)/this.b2; // used in geocentric
    this.Init(this);
  }

} // CS
