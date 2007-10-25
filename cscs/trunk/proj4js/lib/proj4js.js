/*
Author:       Mike Adair madairATdmsolutions.ca
              Richard Greenwood rich@greenwoodmap.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html
              Note: This program is an almost direct port of the C library Proj4.
$Id: Proj.js 2956 2007-07-09 12:17:52Z steven $
*/

/**
 * Provides methods for coordinate transformations between map projections and 
 * longitude/latitude, including datum transformations.
 * 
 * Initialization of Proj objects is with a projection code, usually EPSG codes.
 * The code passed in will be stripped of colons (':') and converted to uppercase
 * for internal use.
 * If you know what map projections your application will be dealing with, the
 * definition for the projections can be included with the script tag when the 
 * application is being coded.  Otherwise, practically any projection definition
 * can be loaded dynamically at run-time with an AJAX request to a lookup service
 * such as spatialreference.org.
 * The actual code supporting the forward and inverse tansformations for each
 * projection class is loaded dynamically at run-time.  These may also be 
 * specified when the application is coded if the projections to be used are known
 * beforehand.
 * A projection object has properties for units and title strings.
 * All coordinates are handled as points which is a 2 element array where x is
 * the first element and y is the second.
 * For the transform() method pass in mapXY and a destination projection object
 * and it returns a map XY coordinate in the other projection
 */

/**
 * Global namespace object for Proj4js library to use
 */
Proj4js = {

    /**
     * Property: defaultDatum
     * The datum to use when no others a specified
     */
    defaultDatum: 'WGS84',                  //default datum

    /**
     * Property: proxyScript
     * A proxy script to execute AJAX requests in other domains. 
     */
    proxyScript: null,  //TBD: customize this for spatialreference.org output

    /**
     * Property: defsLookupService
     * AJAX service to retreive projection definition parameters from
     */
    defsLookupService: 'http://spatialreference.org/ref',

    /**
     * Property: libPath
     * internal: http server path to library code.
     * TBD figure this out automatically
     */
    libPath: '/proj4js/lib/',                   //
    //libPath: '../lib/proj4js/',                   //

    /** 
    * Method: transform(source, dest, point)
    * Transform a point coordinate from one map projection to another.
    *
    * Parameters:
    * source - {Proj4js.Proj} source map projection for the transformation
    * dest - {Proj4js.Proj} destination map projection for the transformation
    * point - {Object} point to transform, may be geodetic (long, lat) or
    *     projected Cartesian (x,y), but should always have x,y properties.
    */
    transform : function(source, dest, point) {
        if (!source.readyToUse || !dest.readyToUse) {
            this.reportError("Proj4js initialization for "+source.srsCode+" not yet complete");
            return;
        }
        
        if (point.transformed) {
            this.log("point already transformed");
          //return;
        }

        // Transform source points to long/lat, if they aren't already.
        if ( source.projName=="longlat") {
            point.x *= Proj4js.common.D2R;  // convert degrees to radians
            point.y *= Proj4js.common.D2R;
        } else {
            if (source.to_meter) {
                point.x *= source.to_meter;
                point.y *= source.to_meter;
            }
            source.inverse(point); // Convert Cartesian to longlat
        }

        // Adjust for the prime meridian if necessary
        if (source.from_greenwich) { 
            point.x += source.from_greenwich; 
        }

        // Convert datums if needed, and if possible.
        point = this.datum_transform( source.datum, dest.datum, point );

        // Adjust for the prime meridian if necessary
        if (dest.from_greenwich) { 
            point.x -= dest.from_greenwich; 
        }

        if( dest.projName=="longlat" ) {             
            // convert radians to decimal degrees
            point.x *= Proj4js.common.R2D;
            point.y *= Proj4js.common.R2D;
        } else  {               // else project
            dest.forward(point);
            if (dest.to_meter) {
                point.x /= dest.to_meter;
                point.y /= dest.to_meter;
            }
        }
        point.transformed = true;
        return point;
    }, // transform()

    /** datum_transform()
      source coordinate system definition,
      destination coordinate system definition,
      point to transform in geodetic coordinates (long, lat, height)
    */
    datum_transform : function( source, dest, point ) {

      // Short cut if the datums are identical.
      if( source.compare_datums( dest ) )
          return point; // in this case, zero is sucess,
                    // whereas cs_compare_datums returns 1 to indicate TRUE
                    // confusing, should fix this

        // If this datum requires grid shifts, then apply it to geodetic coordinates.
        if( source.datum_type == Proj4js.common.PJD_GRIDSHIFT )
        {
          alert("ERROR: Grid shift transformations are not implemented yet.");
          /*
            pj_apply_gridshift( pj_param(source.params,"snadgrids").s, 0,
                                point_count, point_offset, x, y, z );
            CHECK_RETURN;

            src_a = SRS_WGS84_SEMIMAJOR;
            src_es = 0.006694379990;
          */
        }

        if( dest.datum_type == Proj4js.common.PJD_GRIDSHIFT )
        {
          alert("ERROR: Grid shift transformations are not implemented yet.");
          /*
            dst_a = ;
            dst_es = 0.006694379990;
          */
        }

        // Do we need to go through geocentric coordinates?
        //  if( source.es != dest.es || source.a != dest.a || // RWG - removed ellipse comparison so
        if( source.datum_type == Proj4js.common.PJD_3PARAM                      // that longlat CSs do not have to have
            || source.datum_type == Proj4js.common.PJD_7PARAM                   // an ellipsoid, also should put it a
            || dest.datum_type == Proj4js.common.PJD_3PARAM                   // tolerance for es if used.
            || dest.datum_type == Proj4js.common.PJD_7PARAM)
        {

          // Convert to geocentric coordinates.
          source.geodetic_to_geocentric( point );
          // CHECK_RETURN;

          // Convert between datums
          if( source.datum_type == Proj4js.common.PJD_3PARAM || source.datum_type == Proj4js.common.PJD_7PARAM )
          {
            source.geocentric_to_wgs84(point);
            // CHECK_RETURN;
          }

          if( dest.datum_type == Proj4js.common.PJD_3PARAM || dest.datum_type == Proj4js.common.PJD_7PARAM )
          {
            dest.geocentric_from_wgs84(point);
            // CHECK_RETURN;
          }

          // Convert back to geodetic coordinates
          dest.geocentric_to_geodetic( point );
            // CHECK_RETURN;
        }


      // Apply grid shift to destination if required
      if( dest.datum_type == Proj4js.common.PJD_GRIDSHIFT )
      {
        alert("ERROR: Grid shift transformations are not implemented yet.");
        // pj_apply_gridshift( pj_param(dest.params,"snadgrids").s, 1, point);
        // CHECK_RETURN;
      }
      return point;
    }, // cs_datum_transform

    /**
     * Function: reportError
     * An internal method to report errors back to user. Should be overridden
     * by applications to deliver error messages.
     */
    reportError: function(msg) {
    },

    /**
     * Function: log
     * An internal method to log events. 
     */
    log: function(msg) {
    },

    loadProjDefinition : function(proj) {

      //check in memory
      if (this.defs[proj.srsCode]) return this.defs[proj.srsCode];

      //set AJAX options
      var options = {
        method: 'get',
        asynchronous: false,          //need to wait until defs are loaded before proceeding
        onSuccess: this.defsLoadedFromDisk.bind(this,proj.srsCode)
      }
      
      //else check for def on the server
      var url = this.libPath + 'defs/' + proj.srsAuth.toUpperCase() + proj.srsProjNumber + '.js';
      new OpenLayers.Ajax.Request(url, options);
      if ( this.defs[proj.srsCode] ) return this.defs[proj.srsCode];

      //else load from web service via AJAX request
      var url = this.proxyScript + this.defsLookupService +'/' + proj.srsAuth +'/'+ proj.srsProjNumber + '/proj4';
      options.onSuccess = this.defsLoadedFromService.bind(this,proj.srsCode)
      options.onFailure = this.defsFailed.bind(this,proj.srsCode);
      new OpenLayers.Ajax.Request(url, options);
      if ( this.defs[proj.srsCode] ) return this.defs[proj.srsCode];

      return null;    //an error if it gets here
    },

    defsLoadedFromDisk: function(srsCode, transport) {
      eval(transport.responseText);
    },

    defsLoadedFromService: function(srsCode, transport) {
      this.defs[srsCode] = transport.responseText;
    },

    defsFailed: function(srsCode) {
      this.reportError('failed to load projection definition for: '+srsCode);
      OpenLayers.Util.extend(this.defs[srsCode], this.defs['WGS84']);  //set it to something so it can at least continue
    },

    loadProjCode : function(projName) {
      if (this.Proj[projName]) return;

      //set AJAX options
      var options = {
        method: 'get',
        asynchronous: false,          //need to wait until defs are loaded before proceeding
        onSuccess: this.loadProjCodeSuccess.bind(this, projName),
        onFailure: this.loadProjCodeFailure.bind(this, projName)
      };
      
      //load the projection class 
      var url = this.libPath + 'projCode/' + projName + '.js';
      new OpenLayers.Ajax.Request(url, options);
    },

    loadProjCodeSuccess : function(projName, transport) {
      eval(transport.responseText);
      if (this.Proj[projName].dependsOn){
        this.loadProjCode(this.Proj[projName].dependsOn);
      }
    },

    loadProjCodeFailure : function(projName) {
      Proj4js.reportError("failed to find projection file for: " + projName);
      //TBD initialize with identity transforms so proj will still work
    }

};

/**
 * Class: Proj4js.Proj
 * Projection objects provide coordinate transformation methods for point coordinates
 * once they have been initialized with a projection code.
 */
Proj4js.Proj = OpenLayers.Class({

  /**
   * Property: readyToUse
   * Flag to indicate if initialization is complete for this Proj object
   */
  readyToUse : false,   
  
  /**
   * Property: title
   * The title to describe the projection
   */
  title: null,  
  
  /**
   * Property: projName
   * The projection class for this projection, e.g. lcc (lambert conformal conic,
   * or merc for mercator.  These are exactly equicvalent to their Proj4 
   * counterparts.
   */
  projName: null,
  /**
   * Property: units
   * The units of the projection.  Values include 'm' and 'degrees'
   */
  units: null,
  /**
   * Property: datum
   * The datum specified for the projection
   */
  datum: null,

  /**
   * Constructor: initialize
   * Constructor for Proj4js.Proj objects
  *
  * Parameters:
  * srsCode - a code for map projection definition parameters.  These are usually
  * (but not always) EPSG codes.
  */
  initialize : function(srsCode) {
      this.srsCode = srsCode.toUpperCase();
      if (this.srsCode.indexOf("EPSG") == 0) {
          this.srsCode = this.srsCode;
          this.srsAuth = 'epsg';
          this.srsProjNumber = this.srsCode.substring(5);
      } else {
          this.srsAuth = '';
          this.srsProjNumber = this.srsCode;
      }

      this.datum = new Proj4js.datum();  //this will get the default datum

      var defs = Proj4js.loadProjDefinition(this);
      if (defs) {
          this.parseDefs(defs);
          Proj4js.loadProjCode(this.projName);
          this.callInit();
      }

  },

  callInit : function() {
      Proj4js.log('projection script loaded for:' + this.projName);
      OpenLayers.Util.extend(this, Proj4js.Proj[this.projName]);
      this.init();
      this.mapXYToLonLat = this.inverse;
      this.lonLatToMapXY = this.forward;
      this.readyToUse = true;
  },

  parseDefs : function(proj4opts) {
      var def = { data: proj4opts };
      var paramName, paramVal;
      var paramArray=def.data.split("+");

      for (var prop=0; prop<paramArray.length; prop++) {
          var property = paramArray[prop].split("=");
          paramName = property[0].toLowerCase();
          paramVal = property[1];

          switch (paramName.replace(/\s/gi,"")) {  // trim out spaces
              case "": break;   // throw away nameless parameter
              case "title":  this.title = paramVal; break;
              case "proj":   this.projName =  paramVal.replace(/\s/gi,""); break;
              case "units":  this.units = paramVal.replace(/\s/gi,""); break;
              case "datum":  this.datumName = paramVal.replace(/\s/gi,""); break;
              case "ellps":  this.ellps = paramVal.replace(/\s/gi,""); break;
              case "a":      this.a =  parseFloat(paramVal); break;  // semi-major radius
              case "b":      this.b =  parseFloat(paramVal); break;  // semi-minor radius
              case "lat_1":  this.lat1 = paramVal*Proj4js.common.D2R; break;        //standard parallel 1
              case "lat_2":  this.lat2 = paramVal*Proj4js.common.D2R; break;        //standard parallel 2
              case "lon_0":  this.long0 = paramVal*Proj4js.common.D2R; break;       // lam0, central longitude
              case "lat_0":  this.lat0 = paramVal*Proj4js.common.D2R; break;        // phi0, central latitude
              case "x_0":    this.x0 = parseFloat(paramVal); break;  // false easting
              case "y_0":    this.y0 = parseFloat(paramVal); break;  // false northing
              case "k":      this.k0 = parseFloat(paramVal); break;  // projection scale factor
              case "R_A":    this.R = parseFloat(paramVal); break;   //Spheroid radius 
              case "zone":   this.zone = parseInt(paramVal); break;  // UTM Zone
              case "towgs84":this.datum_params = paramVal.split(","); break;
              case "to_meter": this.to_meter = parseFloat(paramVal); break; // cartesian scaling
              case "from_greenwich": this.from_greenwich = paramVal*Proj4js.common.D2R; break;
              case "no_defs": break; 
              default: Proj4js.log("Unrecognized parameter: " + paramName);
          } // switch()
      } // for paramArray
      this.deriveConstants();
  },

  deriveConstants : function() {
      if (!this.a) {    // do we have an ellipsoid?
          switch(this.ellps) {
              //case "GRS80": this.a=6378137.0; this.b=6356752.31414036; break;
              //case "WGS84": this.a=6378137.0; this.b=6356752.31424518; break;
              //case "WGS72": this.a=6378135.0; this.b=6356750.52001609; break;
              //case "intl":  this.a=6378388.0; this.b=6356911.94612795; break;
              case "MERIT": this.a=6378137.0; this.rf=298.257; this.ellipseName="MERIT 1983"; break;
              case "SGS85": this.a=6378136.0; this.rf=298.257; this.ellipseName="Soviet Geodetic System 85"; break;
              case "GRS80": this.a=6378137.0; this.rf=298.257222101; this.ellipseName="GRS 1980(IUGG, 1980)"; break;
              case "IAU76": this.a=6378140.0; this.rf=298.257; this.ellipseName="IAU 1976"; break;
              case "airy": this.a=6377563.396; this.b=6356256.910; this.ellipseName="Airy 1830"; break;
              case "APL4.": this.a=6378137; this.rf=298.25; this.ellipseName="Appl. Physics. 1965"; break;
              case "NWL9D": this.a=6378145.0; this.rf=298.25; this.ellipseName="Naval Weapons Lab., 1965"; break;
              case "mod_airy": this.a=6377340.189; this.b=6356034.446; this.ellipseName="Modified Airy"; break;
              case "andrae": this.a=6377104.43; this.rf=300.0; this.ellipseName="Andrae 1876 (Den., Iclnd.)"; break;
              case "aust_SA": this.a=6378160.0; this.rf=298.25; this.ellipseName="Australian Natl & S. Amer. 1969"; break;
              case "GRS67": this.a=6378160.0; this.rf=298.2471674270; this.ellipseName="GRS 67(IUGG 1967)"; break;
              case "bessel": this.a=6377397.155; this.rf=299.1528128; this.ellipseName="Bessel 1841"; break;
              case "bess_nam": this.a=6377483.865; this.rf=299.1528128; this.ellipseName="Bessel 1841 (Namibia)"; break;
              case "clrk66": this.a=6378206.4; this.b=6356583.8; this.ellipseName="Clarke 1866"; break;
              case "clrk80": this.a=6378249.145; this.rf=293.4663; this.ellipseName="Clarke 1880 mod."; break;
              case "CPM": this.a=6375738.7; this.rf=334.29; this.ellipseName="Comm. des Poids et Mesures 1799"; break;
              case "delmbr": this.a=6376428.0; this.rf=311.5; this.ellipseName="Delambre 1810 (Belgium)"; break;
              case "engelis": this.a=6378136.05; this.rf=298.2566; this.ellipseName="Engelis 1985"; break;
              case "evrst30": this.a=6377276.345; this.rf=300.8017; this.ellipseName="Everest 1830"; break;
              case "evrst48": this.a=6377304.063; this.rf=300.8017; this.ellipseName="Everest 1948"; break;
              case "evrst56": this.a=6377301.243; this.rf=300.8017; this.ellipseName="Everest 1956"; break;
              case "evrst69": this.a=6377295.664; this.rf=300.8017; this.ellipseName="Everest 1969"; break;
              case "evrstSS": this.a=6377298.556; this.rf=300.8017; this.ellipseName="Everest (Sabah & Sarawak)"; break;
/* fix these from ellipse.c
              case "fschr60": this.a=6378166.; this.298.3; this.ellipseName="Fischer (Mercury Datum) 1960"; break;
              case "fschr60m": this.a=6378155.",   "; this.298.3", "; this.ellipseName=Fischer 1960"; break;
              case "fschr68": this.a=6378150.",   "; this.298.3", "; this.ellipseName=1968"; break;
              case "helmert": this.a=6378200.",   "; this.298.3", "; this.ellipseName=1906"; break;
              case "hough": this.a=6378270.0; this.rf=297.", "; this.ellipseName="; break;
              case "intl": this.a=6378388.0; this.rf=297.", "; this.ellipseName=1909 (Hayford)"; break;
              case "kaula": this.a=6378163.",  "; this.298.24", "; this.ellipseName=1961"; break;
              case "lerch": this.a=6378139.",  "; this.298.257", "; this.ellipseName=1979"; break;
              case "mprts": this.a=6397300.",  "; this.191.", "Maupertius 1738; this.ellipseName; break;
              case "new_intl": this.a=6378157.5; this.b=6356772.2; this.ellipseName="New International 1967"; break;
              case "plessis": this.a=6376523.",  "; this.6355863.", "Plessis 1817 ; this.ellipseName=France)"; break;
*/
              case "krass": this.a=6378245.0; this.rf=298.3; this.ellipseName="Krassovsky, 1942"; break;
              case "SEasia": this.a=6378155.0; this.b=6356773.3205; this.ellipseName="Southeast Asia"; break;
              case "walbeck": this.a=6376896.0; this.b=6355834.8467; this.ellipseName="Walbeck"; break;
              case "WGS60": this.a=6378165.0; this.rf=298.3; this.ellipseName="WGS 60"; break;
              case "WGS66": this.a=6378145.0; this.rf=298.25; this.ellipseName="WGS 66"; break;
              case "WGS72": this.a=6378135.0; this.rf=298.26; this.ellipseName="WGS 72"; break;
              case "WGS84": this.a=6378137.0; this.rf=298.257223563; this.ellipseName="WGS 84"; break;
              case "sphere": this.a=6370997.0; this.b=6370997.0; this.ellipseName="Normal Sphere (r=6370997)"; break;
              default:      this.a=6378137.0; this.b=6356752.31424518; Proj4js.log("Ellipsoid parameters not provided, assuming WGS84");
          }
      }
      if (this.rf && !this.b) this.b = (1.0 - 1.0/this.rf) * this.a;
      this.a2 = this.a * this.a;          // used in geocentric
      this.b2 = this.b * this.b;          // used in geocentric
      this.es = (this.a2-this.b2)/this.a2;  // e ^ 2
      //this.es=1-(Math.pow(this.b,2)/Math.pow(this.a,2));
      this.e = Math.sqrt(this.es);        // eccentricity
      this.ep2=(this.a2-this.b2)/this.b2; // used in geocentric

      this.datum = new Proj4js.datum(this);
  }
});

Proj4js.Proj.longlat = {
  init : function() {
    //no-op for longlat
  },
  forward : function(pt) {
    //identity transform
    return pt;
  },
  inverse : function(pt) {
    //identity transform
    return pt;
  }
};

/**
  Proj4js.defs is a collection of coordinate system definition objects in the 
  Proj4 command line format.
  Generally a def is added by means of a separate .js file for example:

    <SCRIPT type="text/javascript" src="defs/EPSG26912.js"></SCRIPT>

  def is a CS definition in PROJ.4 WKT format, for example:
    +proj="tmerc"   //longlat, etc.
    +a=majorRadius
    +b=minorRadius
    +lat0=somenumber
    +long=somenumber
*/
Proj4js.defs = {
  // These are so widely used, we'll go ahead and throw them in
  // without requiring a separate .js file
  'WGS84': "+title=long/lat:WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84",
  'EPSG:4326': "+title=long/lat:WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84",
  'EPSG:4269': "+title=long/lat:NAD83 +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83" 
};

Proj4js.common = {
  PI : Math.PI,
  HALF_PI : Math.PI*0.5,
  TWO_PI : Math.PI*2,
  FORTPI : 0.78539816339744833,
  R2D : 57.2957795131,
  D2R : 0.0174532925199,
  SEC_TO_RAD : 4.84813681109535993589914102357e-6, /* SEC_TO_RAD = Pi/180/3600 */
  EPSLN : 1.0e-10,
  MAX_ITER : 20,
  // following constants from geocent.c
  COS_67P5 : 0.38268343236508977,  /* cosine of 67.5 degrees */
  AD_C : 1.0026000,                /* Toms region 1 constant */

  /* datum_type values */
  PJD_UNKNOWN  : 0,
  PJD_3PARAM   : 1,
  PJD_7PARAM   : 2,
  PJD_GRIDSHIFT: 3,
  PJD_WGS84    : 4,   // WGS84 or equivalent
  SRS_WGS84_SEMIMAJOR : 6378137.0,  // only used in grid shift transforms

// Function to compute the constant small m which is the radius of
//   a parallel of latitude, phi, divided by the semimajor axis.
// -----------------------------------------------------------------
  msfnz : function(eccent, sinphi, cosphi) {
      var con = eccent * sinphi;
      return cosphi/(Math.sqrt(1.0 - con * con));
  },

// Function to compute the constant small t for use in the forward
//   computations in the Lambert Conformal Conic and the Polar
//   Stereographic projections.
// -----------------------------------------------------------------
  tsfnz : function(eccent, phi, sinphi) {
    var con = eccent * sinphi;
    var com = .5 * eccent;
    con = Math.pow(((1.0 - con) / (1.0 + con)), com);
    return (Math.tan(.5 * (this.HALF_PI - phi))/con);
  },

// Function to compute the latitude angle, phi2, for the inverse of the
//   Lambert Conformal Conic and Polar Stereographic projections.
// ----------------------------------------------------------------
  phi2z : function(eccent, ts) {
    var eccnth = .5 * eccent;
    var con, dphi;
    var phi = this.HALF_PI - 2 * Math.atan(ts);
    for (i = 0; i <= 15; i++) {
      con = eccent * Math.sin(phi);
      dphi = this.HALF_PI - 2 * Math.atan(ts *(Math.pow(((1.0 - con)/(1.0 + con)),eccnth))) - phi;
      phi += dphi;
      if (Math.abs(dphi) <= .0000000001) return phi;
    }
    alert("phi2z has NoConvergence");
    return (-9999);
  },

/* Function to compute constant small q which is the radius of a 
   parallel of latitude, phi, divided by the semimajor axis. 
------------------------------------------------------------*/
  qsfnz : function(eccent,sinphi,cosphi) {
    var con;
    if (eccent > 1.0e-7) {
      con = eccent * sinphi;
      return (( 1.0- eccent * eccent) * (sinphi /(1.0 - con * con) - (.5/eccent)*Math.log((1.0 - con)/(1.0 + con))));
    } else {
      return(2.0 * sinphi);
    }
  },

/* Function to eliminate roundoff errors in asin
----------------------------------------------*/
  asinz : function(x) {x=(Math.abs(x)>1.0)?1.0:-1.0;return(x);},

// following functions from gctpc cproj.c for transverse mercator projections
  e0fn : function(x) {return(1.0-0.25*x*(1.0+x/16.0*(3.0+1.25*x)));},
  e1fn : function(x) {return(0.375*x*(1.0+0.25*x*(1.0+0.46875*x)));},
  e2fn : function(x) {return(0.05859375*x*x*(1.0+0.75*x));},
  e3fn : function(x) {return(x*x*x*(35.0/3072.0));},
  mlfn : function(e0,e1,e2,e3,phi) {return(e0*phi-e1*Math.sin(2.0*phi)+e2*Math.sin(4.0*phi)-e3*Math.sin(6.0*phi));},

  srat : function(esinp, exp) {
    return(Math.pow((1.0-esinp)/(1.0+esinp), exp));
  },

// Function to return the sign of an argument
  sign : function(x) { if (x < 0.0) return(-1); else return(1);},

// Function to adjust longitude to -180 to 180; input in radians
  adjust_lon : function(x) {x=(Math.abs(x)<this.PI)?x:(x-(this.sign(x)*this.TWO_PI));return(x);}

};

/** datum object
*/
Proj4js.datum = OpenLayers.Class({

  initialize : function(proj) {
    if (proj && proj.datum_params) {
      for (var i=0; i<proj.datum_params.length; i++) {
        proj.datum_params[i]=parseFloat(proj.datum_params[i]);
      }
      if (proj.datum_params[0] != 0 || proj.datum_params[1] != 0 || proj.datum_params[2] != 0 ) {
        this.datum_type = Proj4js.common.PJD_3PARAM;
      }
      if (proj.datum_params.length > 3) {
        if (proj.datum_params[3] != 0 || proj.datum_params[4] != 0 ||
            proj.datum_params[5] != 0 || proj.datum_params[6] != 0 ) {
          this.datum_type = Proj4js.common.PJD_7PARAM;
          proj.datum_params[3] *= Proj4js.common.SEC_TO_RAD;
          proj.datum_params[4] *= Proj4js.common.SEC_TO_RAD;
          proj.datum_params[5] *= Proj4js.common.SEC_TO_RAD;
          proj.datum_params[6] = (proj.datum_params[6]/1000000.0) + 1.0;
        }
      }
    }
    if (!this.datum_type) this.datum_type = Proj4js.common.PJD_WGS84;
    if (proj) {
      this.a = proj.a;    //datum object also uses these values
      this.b = proj.b;
      this.es = proj.es;
      this.ep2 = proj.ep2;
      this.datum_params = proj.datum_params;
    }
  },

  /****************************************************************/
  // cs_compare_datums()
  //   Returns 1 (TRUE) if the two datums match, otherwise 0 (FALSE).
  compare_datums : function( dest ) {
    if( this.datum_type != dest.datum_type ) {
      return false; // false, datums are not equal
    }
    /*  RWG - took this out so that ellipse is not required for longlat CSs
    else if( this.a != dest.a
             || Math.abs(this.es - dest.es) > 0.000000000050 )
    {
      // the tolerence for es is to ensure that GRS80 and WGS84
      // are considered identical
      return false;
    }
    */
    else if( this.datum_type == Proj4js.common.PJD_3PARAM )
    {
      return (this.datum_params[0] == dest.datum_params[0]
              && this.datum_params[1] == dest.datum_params[1]
              && this.datum_params[2] == dest.datum_params[2]);
    }
    else if( this.datum_type == Proj4js.common.PJD_7PARAM )
    {
      return (this.datum_params[0] == dest.datum_params[0]
              && this.datum_params[1] == dest.datum_params[1]
              && this.datum_params[2] == dest.datum_params[2]
              && this.datum_params[3] == dest.datum_params[3]
              && this.datum_params[4] == dest.datum_params[4]
              && this.datum_params[5] == dest.datum_params[5]
              && this.datum_params[6] == dest.datum_params[6]);
    }
    else if( this.datum_type == Proj4js.common.PJD_GRIDSHIFT )
    {
      return strcmp( pj_param(this.params,"snadgrids").s,
                     pj_param(dest.params,"snadgrids").s ) == 0;
    }
    else
      return true; // datums are equal
  }, // cs_compare_datums()

  /*
   * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
   * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
   * according to the current ellipsoid parameters.
   *
   *    Latitude  : Geodetic latitude in radians                     (input)
   *    Longitude : Geodetic longitude in radians                    (input)
   *    Height    : Geodetic height, in meters                       (input)
   *    X         : Calculated Geocentric X coordinate, in meters    (output)
   *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
   *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
   *
   */
  geodetic_to_geocentric : function(p) {
    var Longitude = p.x;
    var Latitude = p.y;
    var Height = p.z ? p.z : 0;   //Z value not always supplied
    var X;  // output
    var Y;
    var Z;

    var Error_Code=0;  //  GEOCENT_NO_ERROR;
    var Rn;            /*  Earth radius at location  */
    var Sin_Lat;       /*  Math.sin(Latitude)  */
    var Sin2_Lat;      /*  Square of Math.sin(Latitude)  */
    var Cos_Lat;       /*  Math.cos(Latitude)  */

    /*
    ** Don't blow up if Latitude is just a little out of the value
    ** range as it may just be a rounding issue.  Also removed longitude
    ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
    */
    if( Latitude < -Proj4js.common.HALF_PI && Latitude > -1.001 * Proj4js.common.HALF_PI )
        Latitude = -Proj4js.common.HALF_PI;
    else if( Latitude > Proj4js.common.HALF_PI && Latitude < 1.001 * Proj4js.common.HALF_PI )
        Latitude = Proj4js.common.HALF_PI;
    else if ((Latitude < -Proj4js.common.HALF_PI) || (Latitude > Proj4js.common.HALF_PI))
    { /* Latitude out of range */
      Error_Code |= GEOCENT_LAT_ERROR;
    }

    if (!Error_Code)
    { /* no errors */
      if (Longitude > Proj4js.common.PI) Longitude -= (2*Proj4js.common.PI);
      Sin_Lat = Math.sin(Latitude);
      Cos_Lat = Math.cos(Latitude);
      Sin2_Lat = Sin_Lat * Sin_Lat;
      Rn = this.a / (Math.sqrt(1.0e0 - this.es * Sin2_Lat));
      X = (Rn + Height) * Cos_Lat * Math.cos(Longitude);
      Y = (Rn + Height) * Cos_Lat * Math.sin(Longitude);
      Z = ((Rn * (1 - this.es)) + Height) * Sin_Lat;
    }

    p.x = X;
    p.y = Y;
    p.z = Z;
    return Error_Code;
  }, // cs_geodetic_to_geocentric()


  /** Convert_Geocentric_To_Geodetic
   * The method used here is derived from 'An Improved Algorithm for
   * Geocentric to Geodetic Coordinate Conversion', by Ralph Toms, Feb 1996
   */
  geocentric_to_geodetic : function (p) {
    var X =p.x;
    var Y = p.y;
    var Z = p.z;
    var Z = p.z ? p.z : 0;   //Z value not always supplied
    var Longitude;
    var Latitude;
    var Height;

    var W;        /* distance from Z axis */
    var W2;       /* square of distance from Z axis */
    var T0;       /* initial estimate of vertical component */
    var T1;       /* corrected estimate of vertical component */
    var S0;       /* initial estimate of horizontal component */
    var S1;       /* corrected estimate of horizontal component */
    var Sin_B0;   /* Math.sin(B0), B0 is estimate of Bowring aux variable */
    var Sin3_B0;  /* cube of Math.sin(B0) */
    var Cos_B0;   /* Math.cos(B0) */
    var Sin_p1;   /* Math.sin(phi1), phi1 is estimated latitude */
    var Cos_p1;   /* Math.cos(phi1) */
    var Rn;       /* Earth radius at location */
    var Sum;      /* numerator of Math.cos(phi1) */
    var At_Pole;  /* indicates location is in polar region */

    X = parseFloat(X);  // cast from string to float
    Y = parseFloat(Y);
    Z = parseFloat(Z);

    At_Pole = false;
    if (X != 0.0)
    {
        Longitude = Math.atan2(Y,X);
    }
    else
    {
        if (Y > 0)
        {
            Longitude = Proj4js.common.HALF_PI;
        }
        else if (Y < 0)
        {
            Longitude = -Proj4js.common.HALF_PI;
        }
        else
        {
            At_Pole = true;
            Longitude = 0.0;
            if (Z > 0.0)
            {  /* north pole */
                Latitude = Proj4js.common.HALF_PI;
            }
            else if (Z < 0.0)
            {  /* south pole */
                Latitude = -Proj4js.common.HALF_PI;
            }
            else
            {  /* center of earth */
                Latitude = Proj4js.common.HALF_PI;
                Height = -this.b;
                return;
            }
        }
    }
    W2 = X*X + Y*Y;
    W = Math.sqrt(W2);
    T0 = Z * Proj4js.common.AD_C;
    S0 = Math.sqrt(T0 * T0 + W2);
    Sin_B0 = T0 / S0;
    Cos_B0 = W / S0;
    Sin3_B0 = Sin_B0 * Sin_B0 * Sin_B0;
    T1 = Z + this.b * this.ep2 * Sin3_B0;
    Sum = W - this.a * this.es * Cos_B0 * Cos_B0 * Cos_B0;
    S1 = Math.sqrt(T1*T1 + Sum * Sum);
    Sin_p1 = T1 / S1;
    Cos_p1 = Sum / S1;
    Rn = this.a / Math.sqrt(1.0 - this.es * Sin_p1 * Sin_p1);
    if (Cos_p1 >= Proj4js.common.COS_67P5)
    {
        Height = W / Cos_p1 - Rn;
    }
    else if (Cos_p1 <= -Proj4js.common.COS_67P5)
    {
        Height = W / -Cos_p1 - Rn;
    }
    else
    {
        Height = Z / Sin_p1 + Rn * (this.es - 1.0);
    }
    if (At_Pole == false)
    {
        Latitude = Math.atan(Sin_p1 / Cos_p1);
    }

    p.x = Longitude;
    p.y =Latitude;
    p.z = Height;
    return p;
  }, // cs_geocentric_to_geodetic()

  /****************************************************************/
  // pj_geocentic_to_wgs84( p )
  //  p = point to transform in geocentric coordinates (x,y,z)
  geocentric_to_wgs84 : function ( p ) {

    if( this.datum_type == Proj4js.common.PJD_3PARAM )
    {
      // if( x[io] == HUGE_VAL )
      //    continue;
      p.x += this.datum_params[0];
      p.y += this.datum_params[1];
      p.z += this.datum_params[2];

    }
    else  // if( this.datum_type == Proj4js.common.PJD_7PARAM )
    {
      var Dx_BF =this.datum_params[0];
      var Dy_BF =this.datum_params[1];
      var Dz_BF =this.datum_params[2];
      var Rx_BF =this.datum_params[3];
      var Ry_BF =this.datum_params[4];
      var Rz_BF =this.datum_params[5];
      var M_BF  =this.datum_params[6];
      // if( x[io] == HUGE_VAL )
      //    continue;
      var x_out = M_BF*(       p.x - Rz_BF*p.y + Ry_BF*p.z) + Dx_BF;
      var y_out = M_BF*( Rz_BF*p.x +       p.y - Rx_BF*p.z) + Dy_BF;
      var z_out = M_BF*(-Ry_BF*p.x + Rx_BF*p.y +       p.z) + Dz_BF;
      p.x = x_out;
      p.y = y_out;
      p.z = z_out;
    }
  }, // cs_geocentric_to_wgs84

  /****************************************************************/
  // pj_geocentic_from_wgs84()
  //  coordinate system definition,
  //  point to transform in geocentric coordinates (x,y,z)
  geocentric_from_wgs84 : function( p ) {

    if( this.datum_type == Proj4js.common.PJD_3PARAM )
    {
      //if( x[io] == HUGE_VAL )
      //    continue;
      p.x -= this.datum_params[0];
      p.y -= this.datum_params[1];
      p.z -= this.datum_params[2];

    }
    else // if( this.datum_type == Proj4js.common.PJD_7PARAM )
    {
      var Dx_BF =this.datum_params[0];
      var Dy_BF =this.datum_params[1];
      var Dz_BF =this.datum_params[2];
      var Rx_BF =this.datum_params[3];
      var Ry_BF =this.datum_params[4];
      var Rz_BF =this.datum_params[5];
      var M_BF  =this.datum_params[6];
      var x_tmp = (p.x - Dx_BF) / M_BF;
      var y_tmp = (p.y - Dy_BF) / M_BF;
      var z_tmp = (p.z - Dz_BF) / M_BF;
      //if( x[io] == HUGE_VAL )
      //    continue;

      p.x =        x_tmp + Rz_BF*y_tmp - Ry_BF*z_tmp;
      p.y = -Rz_BF*x_tmp +       y_tmp + Rx_BF*z_tmp;
      p.z =  Ry_BF*x_tmp - Rx_BF*y_tmp +       z_tmp;
    } //cs_geocentric_from_wgs84()
  }
});

/** point object, nothing fancy, just allows values to be
    passed back and forth by reference rather than by value.
    Other point classes may be used as long as they have
    x and y properties, which will get modified in the transform method.
*/
Proj4js.Point = OpenLayers.Class({

    initialize : function(x,y,z) {
      this.x = x;
      this.y = y;
      this.z = z || 0.0;
    },

    /**
     * Method: toString
     * Return a readable string version of the lonlat
     *
     * Return:
     * {String} String representation of Proj4js.Point object. 
     *           (ex. <i>"x=5,y=42"</i>)
     */
    toString:function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

    /** 
     * APIMethod: toShortString
     * 
     * Return:
     * {String} Shortened String representation of Proj4js.Point object. 
     *         (ex. <i>"5, 42"</i>)
     */
    toShortString:function() {
        return (this.x + ", " + this.y);
    }
});

Proj4js.WGS84 = new Proj4js.Proj('WGS84');
