// March 26, 2006
// Richard Greenwood

/**
  cscs.js is loosely based on PROJ.4 program cs2cs

*/

var PI = Math.PI;
var HALF_PI=PI*0.5;
var TWO_PI=PI*2;
var R2D=57.2957795131;
var D2R=0.0174532925199;
var SEC_TO_RAD = 4.84813681109535993589914102357e-6 /* SEC_TO_RAD = Pi/180/3600 */
var EPSLN = 1.0e-10;
var SRS_WGS84_SEMIMAJOR=6378137.0;  // only used in grid shift transforms

/* datum_type values */
var PJD_UNKNOWN  = 0;
var PJD_3PARAM   = 1;
var PJD_7PARAM   = 2;
var PJD_GRIDSHIFT= 3;
var PJD_WGS84    = 4;   // WGS84 or equivelent

var csErrorMessage = "";

/** point object, nothing fancy, just allows values to be
    passed back and forth by reference rather than by value.
*/
function PT(x,y) {
  this.x=x;
  this.y=y;
  this.z=0.0;
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
//csList.EPSG41001="+title=Mercator/WGS84+proj=mercator2";//+proj=merc +lat_ts=0 +lon_0=0 +k=1.000000 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m
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
      case "ellps": this.ellps = paramVal.replace(/\s/gi,""); break;
      case "datum": this.datum = paramVal.replace(/\s/gi,""); break;
      case "a":     this.a =  parseFloat(paramVal);  break; // semi-major radius
      case "b":     this.b =  parseFloat(paramVal);  break; // semi-minor radius
      case "lat_1":this.lat1=paramVal*D2R;break;//standard parallel 1
      case "lat_2":this.lat2=paramVal*D2R;break;//standard parallel 2
      case "alpha":this.alpha=paramVal*D2R;break;
      case "lonc": this.longc= paramVal*D2R; break; //lam0, central longitude for omerc.js
      case "lon_0": this.long0= paramVal*D2R; break;        // lam0, central longitude
      case "lat_0": this.lat0 = paramVal*D2R; break;        // phi0, central latitude
      case "x_0":   this.x0 = parseFloat(paramVal); break;  // false easting
      case "y_0":   this.y0 = parseFloat(paramVal); break;  // false northing
      case "k":     this.k0 = parseFloat(paramVal); break;  // projection scale factor
     case"R_A":this.R=parseFloat(paramVal); break;//Spheroid radius 
      case "to_meter": this.to_meter = parseFloat(paramVal); break; // cartesian scaling
      case "to_meter": this.to_meter = eval(paramVal); break; // cartesian scaling
      case "zone":     this.zone =  parseInt(paramVal); break;      // UTM Zone
      case "towgs84":  this.datum_params = paramVal.split(","); break;
      case "units": this.units = paramVal.replace(/\s/gi,""); break;
      case "from_greenwich": this.from_greenwich = paramVal*D2R; break;
      default: csErrorMessage += "\nUnrecognized parameter: " + paramName;
    } // switch()
  } // for paramArray


  if (this.datum_params)  {
    for (var i=0; i<this.datum_params.length; i++)
      this.datum_params[i]=parseFloat(this.datum_params[i]);
    if (this.datum_params[0] != 0 ||
        this.datum_params[1] != 0 ||
        this.datum_params[2] != 0 )
      this.datum_type = PJD_3PARAM;
    if (this.datum_params.length > 3) {
      if (this.datum_params[3] != 0 ||
          this.datum_params[4] != 0 ||
          this.datum_params[5] != 0 ||
          this.datum_params[6] != 0 ) {
        this.datum_type = PJD_7PARAM;
        this.datum_params[3] *= SEC_TO_RAD;
        this.datum_params[4] *= SEC_TO_RAD;
        this.datum_params[5] *= SEC_TO_RAD;
        this.datum_params[6] = (this.datum_params[6]/1000000.0) + 1.0;
      }
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
  /*
//var grs80  = new Array(6378137.0, 6356752.31414036); // r_maj, r_min
//var wgs84  = new Array(6378137.0, 6356752.31424518);
//var wgs72  = new Array(6378135.0, 6356750.52001609);
//var intl  = new Array(6378388.0, 6356911.94612795); // (f=297) from ESRI
"MERIT",    "a=6378137.0", "rf=298.257", "MERIT 1983",
"SGS85",    "a=6378136.0", "rf=298.257",  "Soviet Geodetic System 85",
"GRS80",    "a=6378137.0", "rf=298.257222101", "GRS 1980(IUGG, 1980)",
"IAU76",    "a=6378140.0", "rf=298.257", "IAU 1976",
"airy",        "a=6377563.396", "b=6356256.910", "Airy 1830",
"APL4.9",    "a=6378137.0.",  "rf=298.25", "Appl. Physics. 1965",
"NWL9D",    "a=6378145.0.",  "rf=298.25", "Naval Weapons Lab., 1965",
"mod_airy",    "a=6377340.189", "b=6356034.446", "Modified Airy",
"andrae",    "a=6377104.43",  "rf=300.0",     "Andrae 1876 (Den., Iclnd.)",
"aust_SA",    "a=6378160.0", "rf=298.25", "Australian Natl & S. Amer. 1969",
"GRS67",    "a=6378160.0", "rf=298.2471674270", "GRS 67(IUGG 1967)",
"bessel",    "a=6377397.155", "rf=299.1528128", "Bessel 1841",
"bess_nam",    "a=6377483.865", "rf=299.1528128", "Bessel 1841 (Namibia)",
"clrk66",    "a=6378206.4", "b=6356583.8", "Clarke 1866",
"clrk80",    "a=6378249.145", "rf=293.4663", "Clarke 1880 mod.",
"CPM",      "a=6375738.7", "rf=334.29", "Comm. des Poids et Mesures 1799",
"delmbr",    "a=6376428.",  "rf=311.5", "Delambre 1810 (Belgium)",
"engelis",    "a=6378136.05", "rf=298.2566", "Engelis 1985",
"evrst30",  "a=6377276.345", "rf=300.8017",  "Everest 1830",
"evrst48",  "a=6377304.063", "rf=300.8017",  "Everest 1948",
"evrst56",  "a=6377301.243", "rf=300.8017",  "Everest 1956",
"evrst69",  "a=6377295.664", "rf=300.8017",  "Everest 1969",
"evrstSS",  "a=6377298.556", "rf=300.8017",  "Everest (Sabah & Sarawak)",
"fschr60",  "a=6378166.",   "rf=298.3", "Fischer (Mercury Datum) 1960",
"fschr60m", "a=6378155.",   "rf=298.3", "Modified Fischer 1960",
"fschr68",  "a=6378150.",   "rf=298.3", "Fischer 1968",
"helmert",  "a=6378200.",   "rf=298.3", "Helmert 1906",
"hough",    "a=6378270.0", "rf=297.", "Hough",
"intl",        "a=6378388.0", "rf=297.", "International 1909 (Hayford)",
"krass",    "a=6378245.0", "rf=298.3", "Krassovsky, 1942",
"kaula",    "a=6378163.",  "rf=298.24", "Kaula 1961",
"lerch",    "a=6378139.",  "rf=298.257", "Lerch 1979",
"mprts",    "a=6397300.",  "rf=191.", "Maupertius 1738",
"new_intl",    "a=6378157.5", "b=6356772.2", "New International 1967",
"plessis",    "a=6376523.",  "b=6355863.", "Plessis 1817 (France)",
"SEasia",    "a=6378155.0", "b=6356773.3205", "Southeast Asia",
"walbeck",    "a=6376896.0", "b=6355834.8467", "Walbeck",
"WGS60",    "a=6378165.0",  "rf=298.3", "WGS 60",
"WGS66",    "a=6378145.0", "rf=298.25", "WGS 66",
"WGS72",    "a=6378135.0", "rf=298.26", "WGS 72",
"WGS84",    "a=6378137.0",  "rf=298.257223563", "WGS 84",
"sphere",   "a=6370997.0",  "b=6370997.0", "Normal Sphere (r=6370997)",
*/

if (this.ellps=="GRS80") {this.a=6378137.0 ;this.b=6356752.31414036;}
if (this.ellps=="WGS84") {this.a=6378137.0 ;this.b=6356752.31424518;}
if (this.ellps=="WGS72") {this.a=6378135.0 ;this.b=6356750.52001609;}
if (this.ellps=="intl") {this.a=6378388.0 ;this.b= 6356911.94612795 ;}
if(this.ellps=="clrk66"){this.a=6378206.4; this.b=6356583.8;}
if(this.ellps=="airy"){this.a=6377563.396; this.b=6356256.910;}
if(this.ellps=="mod_airy"){this.a=6377340.189; this.b=6356034.446;}
if(this.ellps=="new_intl"){this.a=6378157.5;this.b=6356772.2;}
if(this.ellps=="plessis"){this.a=6376523.0; this.b=6355863.0;}
if(this.ellps=="SEasia"){this.a=6378155.0; this.b=6356773.3205;}
if(this.ellps=="walbeck"){this.a=6376896.0; this.b=6355834.8467;}
if(this.ellps=="sphere"){this.a=6370997.0;this.b=6370997.0;}
if(this.ellps=="MERIT"){this.a=6378137.0 ;this.b=6356752.298215968;}
if(this.ellps=="SGS85"){this.a=6378136.0 ;this.b=6356751.30156878;}
if(this.ellps=="IAU76"){this.a=6378137.0 ;this.b=6356752.31414035585;}
if(this.ellps=="APL4.9"){this.a=6378137.0 ;this.b=6356751.7963118;}
if(this.ellps=="NW9LD"){this.a=6378145.0 ;this.b=6356759.76948868;}
if(this.ellps=="andrae"){this.a=6377104.43 ;this.b=6355847.415233333333;}
if(this.ellps=="aust_SA"){this.a=6378160.0 ;this.b=356774.7191953;}
if(this.ellps=="GRS67"){this.a=6378160.0 ;this.b=6356774.5160907;}
if(this.ellps=="bessel"){this.a=6377397.155 ;this.b=6356078.96281818;}
if(this.ellps=="bess_nam"){this.a=6377483.865 ;this.b=6356165.3829663;}
if(this.ellps=="CPM"){this.a=6375738.7 ;this.b=6356666.22191211;}
if(this.ellps=="clrk80"){this.a=6378249.145 ;this.b=6356514.965828;}
if(this.ellps=="delmbr"){this.a=6376428.0 ;this.b=6355957.9261637239;}
if(this.ellps=="engelis"){this.a= 6378136.05 ;this.b=6356751.32272;}
if(this.ellps=="evrst30"){this.a=6377276.345 ;this.b=6356075.4131402398989;}
if(this.ellps=="evrst48"){this.a=6377304.063 ;this.b=6356103.038993;}
if(this.ellps=="evrst56"){this.a=6377301.243 ;this.b=6356100.2283681013;}
if(this.ellps=="evrst69"){this.a=6377295.664 ;this.b=6356094.6679152;}
if(this.ellps=="evrstSS"){this.a=6377298.556  ;this.b= 6356097.55030089657;}
if(this.ellps=="fschr60"){this.a=6378166.0 ;this.b=  6356784.283607;}
if(this.ellps=="fschr60m"){this.a=6378155.0 ;this.b=  6356773.3204827;}
if(this.ellps=="fschr68"){this.a=6378150.0 ;this.b=  6356768.337244;}
if(this.ellps=="helmert "){this.a=6378200.0;this.b=6356818.16962789;}
if(this.ellps=="hough"){this.a=6378270.0;this.b=6356794.343434343;}
if(this.ellps=="krass"){this.a=6378245.0  ;this.b=63568630.187730;}
if(this.ellps=="kaula"){this.a=6378163.0  ;this.b=6356776.9920869;}
if(this.ellps=="lerch"){this.a=6378139.0  ;this.b=6356754.29151034;}
if(this.ellps=="mprts"){this.a=6397300.0  ;this.b=6363806.282722513;}
if(this.ellps=="WGS60"){this.a=6378165.0  ;this.b=6356783.2869594;}
if(this.ellps=="WGS66"){this.a=6378145.0  ;this.b=6356759.76948868;}



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

  if (this.proj != "longlat") {    // The Forward, Inverse, and Initilization functions are derived from the projection name.
    this.Forward = eval(this.proj+"Fwd");
    this.Inverse = eval(this.proj+"Inv"); // name of inverse function (x/y to long/lat)
    this.Init  =  eval(this.proj+"Init"); // initilization function
    this.Init(this);
  }

} // CS constructor


/************************************************************************************/

/** cs_transform()
  main entry point
  source coordinate system definition,
  destination coordinate system definition,
  point to transform, may be geodetic (long, lat)
    or projected Cartesian (x,y)
*/
function cs_transform(srcdefn, dstdefn, point) {
  pj_errno = 0;

    // Transform source points to long/lat, if they aren't already.
  if( srcdefn.proj=="longlat") {
    point.x *=D2R;  // convert degrees to radians
    point.y *=D2R;
  } else {
    if (srcdefn.to_meter) {
      point.x *= srcdefn.to_meter;
      point.y *= srcdefn.to_meter;
    }
    srcdefn.Inverse(point); // Convert Cartesian to longlat
  }

    // Adjust for the prime meridian if necessary
  if( srcdefn.from_greenwich) { point.x += srcdefn.from_greenwich; }

    // Convert datums if needed, and if possible.
  if( cs_datum_transform( srcdefn, dstdefn, point) != 0 )
    return pj_errno;

    // Adjust for the prime meridian if necessary
  if( dstdefn.from_greenwich ) { point.x -= dstdefn.from_greenwich; }

  if( dstdefn.proj=="longlat" )
  {             // convert radians to decimal degrees
    point.x *=R2D;
    point.y *=R2D;
  } else  {               // else project
    dstdefn.Forward(point);
    if (dstdefn.to_meter) {
      point.x /= dstdefn.to_meter;
      point.y /= dstdefn.to_meter;
    }
  }
} // cs_transform()



/** cs_datum_transform()
  source coordinate system definition,
  destination coordinate system definition,
  point to transform in geodetic coordinates (long, lat, height)
*/
function cs_datum_transform( srcdefn, dstdefn, point )
{

    // Short cut if the datums are identical.
  if( cs_compare_datums( srcdefn, dstdefn ) )
      return 0; // in this case, zero is sucess,
                // whereas cs_compare_datums returns 1 to indicate TRUE
                // confusing, should fix this

// #define CHECK_RETURN {if( pj_errno != 0 ) { if( z_is_temp ) pj_dalloc(z); return pj_errno; }}


    // If this datum requires grid shifts, then apply it to geodetic coordinates.
    if( srcdefn.datum_type == PJD_GRIDSHIFT )
    {
     alert(mbGetMessage("gridShiftError"));
   
      /*
        pj_apply_gridshift( pj_param(srcdefn.params,"snadgrids").s, 0,
                            point_count, point_offset, x, y, z );
        CHECK_RETURN;

        src_a = SRS_WGS84_SEMIMAJOR;
        src_es = 0.006694379990;
      */
    }

    if( dstdefn.datum_type == PJD_GRIDSHIFT )
    {
       alert(mbGetMessage("gridShiftError"));
      /*
        dst_a = ;
        dst_es = 0.006694379990;
      */
    }

      // Do we need to go through geocentric coordinates?
//  if( srcdefn.es != dstdefn.es || srcdefn.a != dstdefn.a || // RWG - removed ellipse comparison so
    if( srcdefn.datum_type == PJD_3PARAM                      // that longlat CSs do not have to have
        || srcdefn.datum_type == PJD_7PARAM                   // an ellipsoid, also should put it a
        || dstdefn.datum_type == PJD_3PARAM                   // tolerance for es if used.
        || dstdefn.datum_type == PJD_7PARAM)
    {

      // Convert to geocentric coordinates.
      cs_geodetic_to_geocentric( srcdefn, point );
      // CHECK_RETURN;

      // Convert between datums
      if( srcdefn.datum_type == PJD_3PARAM || srcdefn.datum_type == PJD_7PARAM )
      {
        cs_geocentric_to_wgs84( srcdefn, point);
        // CHECK_RETURN;
      }

      if( dstdefn.datum_type == PJD_3PARAM || dstdefn.datum_type == PJD_7PARAM )
      {
        cs_geocentric_from_wgs84( dstdefn, point);
        // CHECK_RETURN;
      }

      // Convert back to geodetic coordinates
      cs_geocentric_to_geodetic( dstdefn, point );
        // CHECK_RETURN;
    }


  // Apply grid shift to destination if required
  if( dstdefn.datum_type == PJD_GRIDSHIFT )
  {
     alert(mbGetMessage("gridShiftError"));
    // pj_apply_gridshift( pj_param(dstdefn.params,"snadgrids").s, 1, point);
    // CHECK_RETURN;
  }
  return 0;
} // cs_datum_transform


/****************************************************************/
// cs_compare_datums()
//   Returns 1 (TRUE) if the two datums match, otherwise 0 (FALSE).
function cs_compare_datums( srcdefn, dstdefn )
{
  if( srcdefn.datum_type != dstdefn.datum_type )
  {
    return 0; // false, datums are not equal
  }
  /*  RWG - took this out so that ellipse is not required for longlat CSs
  else if( srcdefn.a != dstdefn.a
           || Math.abs(srcdefn.es - dstdefn.es) > 0.000000000050 )
  {
    // the tolerence for es is to ensure that GRS80 and WGS84
    // are considered identical
    return 0;
  }
  */
  else if( srcdefn.datum_type == PJD_3PARAM )
  {
    return (srcdefn.datum_params[0] == dstdefn.datum_params[0]
            && srcdefn.datum_params[1] == dstdefn.datum_params[1]
            && srcdefn.datum_params[2] == dstdefn.datum_params[2]);
  }
  else if( srcdefn.datum_type == PJD_7PARAM )
  {
    return (srcdefn.datum_params[0] == dstdefn.datum_params[0]
            && srcdefn.datum_params[1] == dstdefn.datum_params[1]
            && srcdefn.datum_params[2] == dstdefn.datum_params[2]
            && srcdefn.datum_params[3] == dstdefn.datum_params[3]
            && srcdefn.datum_params[4] == dstdefn.datum_params[4]
            && srcdefn.datum_params[5] == dstdefn.datum_params[5]
            && srcdefn.datum_params[6] == dstdefn.datum_params[6]);
  }
  else if( srcdefn.datum_type == PJD_GRIDSHIFT )
  {
    return strcmp( pj_param(srcdefn.params,"snadgrids").s,
                   pj_param(dstdefn.params,"snadgrids").s ) == 0;
  }
  else
    return 1; // true, datums are equal
} // cs_compare_datums()

