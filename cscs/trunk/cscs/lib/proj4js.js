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
 * For the forward() method pass in lat/lon and it returns map XY.
 * For the inverse() method pass in map XY and it returns lat/long.
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
   * A proxy script to execute AJAX requests in other domains
   */
  proxyScript: '/mapbuilder/proxy?url=',  //TBD: customize this for spatialreference.org output

  /**
   * Property: defsLookupService
   * AJAX service to retreive projection definition parameters from
   */
  defsLookupService: 'http://spatialreference.org/ref/',

  /**
   * Property: libPath
   * internal: http server path to library code.
   * TBD figure this out automatically
   */
  libPath: '/cscs/lib/',                   //

  /**
   * Property: useMapsDB
   * Set to true if the map example should be loaded when the Proj is created.
   * A map example will be loaded only if one is available.
   */
  useMapsDB: true,

  /**
   * Function: reportError
   * An internal method to report errors back to user
   */
  reportError: function(msg) {
    console.log(msg);
    //TODO: customize this more
  }

};

/**
 * Class: Proj4js.Proj
 * Projection objects provide coordinate transformation methods for point coordinates
 * once they have been initialized with a projection code.
 */
Proj4js.Proj = Class.create();
Proj4js.Proj.prototype = {

  /**
   * Property: readyToUse
   * Flag to indicate if initialization is complete for this Proj object
   */
  readyToUse : false,   

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
      this.srsCode = this.srsCode.split(":").join("");
      this.srsAuth = 'epsg';
      this.srsProjNumber = this.srsCode.substring(4);
    } else {
      this.srsAuth = '';
      this.srsProjNumber = this.srsCode;
    }

    this.datum = new Proj4js.datum(Proj4js.defaultDatum);

    var defs = this._loadProjDefinition(this.srsCode);
    if (defs) {
      this._parseDefs(defs);
      this._loadProjCode(this.projName);
      if (Proj4js.useMapsDB) this._loadMapExample(this.srsCode);
    }

  },

  /** 
  * Method: forward(lonLat)
  * Transform a latitude longitude point to this map projection's XY coords.
  *
  * Parameters:
  * lonLat - {Proj4js.Point} point to transform in geodetic (long, lat)
  */

  /** 
  * Method: lonLatToMapXY(lonLat)
  * Transform a latitude longitude point to this map projection's XY coords.
  * this is an alias because I can never remember forward/inverse.
  *
  * Parameters:
  * lonLat - {Proj4js.Point} point to transform in geodetic (long, lat)
  */

  /** 
  * Method: inverse(lonLat)
  * Transform a map projection's XY coords to geodetic latitude longitude.
  *
  * Parameters:
  * lonLat - {Proj4js.Point} point to transform in geodetic (long, lat)
  */

  /** 
  * Method: lonLatToMapXY(lonLat)
  * Transform a map projection's XY coords to geodetic latitude longitude.
  * this is an alias because I can never remember forward/inverse.
  *
  * Parameters:
  * lonLat - {Proj4js.Point} point to transform in geodetic (long, lat)
  */

  /** 
  * Method: transform(point, dest)
  * Transform a point coordinate from one map projection to another.
  *
  * Parameters:
  * inPoint - {Proj4js.Point} point to transform, may be geodetic (long, lat)
  * or projected Cartesian (x,y)
  * dest - {Proj4js.Proj} destination map projection for the transformation
  */
  transform : function(inPoint, dest) {
    if (!this.readyToUse) {
      alert("Proj4js initialization for "+this.srsCode+" not yet complete");
      return;
    }

    var point = inPoint;
    // Transform source points to long/lat, if they aren't already.
    if ( this.projName=="longlat") {
      point.x *= Proj4js.const.D2R;  // convert degrees to radians
      point.y *= Proj4js.const.D2R;
    } else {
      if (this.to_meter) {
        point.x *= this.to_meter;
        point.y *= this.to_meter;
      }
      this.inverse(point); // Convert Cartesian to longlat
    }

    // Adjust for the prime meridian if necessary
    if ( this.from_greenwich) { point.x += this.from_greenwich; }

    // Convert datums if needed, and if possible.
    //point = this.datum.transform( point, dest);

    // Adjust for the prime meridian if necessary
    if ( dest.from_greenwich ) { point.x -= dest.from_greenwich; }

    if ( dest.projName == "longlat" ) {            
      point.x *= Proj4js.const.R2D;     // convert radians to decimal degrees
      point.y *= Proj4js.const.R2D;
    } else  {               // else project
      dest.forward(point);
      if (dest.to_meter) {
        point.x /= dest.to_meter;
        point.y /= dest.to_meter;
      }
    }
    return point;
  }, // transform()

  _callInit : function(projName) {
    console.log('projection script loaded for:' + projName);
    Object.extend(this, Proj4js.Proj[this.projName]);
    this.mapXYToLonLat = this.inverse;
    this.lonLatToMapXY = this.forward;
    this.init();
    this.readyToUse = true;
  },

  _loadProjDefinition : function(srsCode) {

    //check in memory
    if (Proj4js.defs[srsCode]) return Proj4js.defs[srsCode];

    //set AJAX options
    var options = {
      method: 'get',
      asynchronous: false,          //need to wait until defs are loaded before proceeding
      onSuccess: this._defsLoaded.bind(this)
    }
    
    //else check for def on the server
    var url = Proj4js.libPath + 'defs/' + this.srsAuth.toUpperCase() + this.srsProjNumber + '.js';
    new Ajax.Request(url, options);
    if ( Proj4js.defs[srsCode] ) return Proj4js.defs[srsCode];

    //else load from web service via AJAX request
    var url = Proj4js.proxyScript + Proj4js.defsLookupService + this.srsAuth +'/'+ this.srsProjNumber + '/proj4';
    options.onFailure = this._defsFailed.bind(this);
    new Ajax.Request(url, options);

    return Proj4js.defs[srsCode];
  },

  _defsFailed: function() {
      alert('failed to load projection definition for: ' + this.srsCode);
  },

  _defsLoaded: function(transport) {
    Proj4js.defs[this.srsCode] = transport.responseText;
  },

  _parseDefs : function(proj4opts) {
    var def = { data: proj4opts };
    var paramName, paramVal;
    var paramArray=def.data.split("+");

    for (var prop=0; prop<paramArray.length; prop++) {
      var property = paramArray[prop].split("=");
      paramName = property[0].toLowerCase();
      paramVal = property[1];

      switch (paramName.replace(/\s/gi,"")) {  // trim out spaces
        case "": break;   // throw away nameless parameter

  /**
   * Property: title
   * The title to describe the projection
   */
        case "title":  this.title = paramVal; break;
  /**
   * Property: projName
   * The projection class for this projection, e.g. lcc (lambert conformal conic,
   * or merc for mercator.  These are exactly equicvalent to their Proj4 
   * counterparts.
   */
        case "proj":   this.projName =  paramVal.replace(/\s/gi,""); break;
  /**
   * Property: units
   * The units of the projection.  Values include 'm' and 'degrees'
   */
        case "units":  this.units = paramVal.replace(/\s/gi,""); break;
  /**
   * Property: datum
   * The datum specified for the projection
   */
        case "datum":  this.datum = new Proj4js.datum(paramVal.replace(/\s/gi,"")); break;

  /** 
   * The rest of these are for internal use only
   */
        case "ellps":  this.ellps = paramVal.replace(/\s/gi,""); break;
        case "a":      this.a =  parseFloat(paramVal); break;  // semi-major radius
        case "b":      this.b =  parseFloat(paramVal); break;  // semi-minor radius
        case "lat_1":  this.lat1 = paramVal*Proj4js.const.D2R; break;        //standard parallel 1
        case "lat_2":  this.lat2 = paramVal*Proj4js.const.D2R; break;        //standard parallel 2
        case "lon_0":  this.long0 = paramVal*Proj4js.const.D2R; break;       // lam0, central longitude
        case "lat_0":  this.lat0 = paramVal*Proj4js.const.D2R; break;        // phi0, central latitude
        case "x_0":    this.x0 = parseFloat(paramVal); break;  // false easting
        case "y_0":    this.y0 = parseFloat(paramVal); break;  // false northing
        case "k":      this.k0 = parseFloat(paramVal); break;  // projection scale factor
        case "R_A":    this.R = parseFloat(paramVal); break;   //Spheroid radius 
        case "zone":   this.zone = parseInt(paramVal); break;  // UTM Zone
        case "towgs84":this.datum_params = paramVal.split(","); break;
        case "to_meter": this.to_meter = parseFloat(paramVal); break; // cartesian scaling
        case "from_greenwich": this.from_greenwich = paramVal*Proj4js.const.D2R; break;
        default: console.log("Unrecognized parameter: " + paramName);
      } // switch()
    } // for paramArray
    this._deriveConstants();
  },

  _deriveConstants : function() {
    if (!this.a) {    // do we have an ellipsoid?
      switch(this.ellps) {
        case "GRS80": this.a=6378137.0; this.b=6356752.31414036; break;
        case "WGS84": this.a=6378137.0; this.b=6356752.31424518; break;
        case "WGS72": this.a=6378135.0; this.b=6356750.52001609; break;
        case "intl":  this.a=6378388.0; this.b=6356911.94612795; break;
        default:      this.a=6378137.0; this.b=6356752.31424518; console.log("Ellipsoid parameters not provided, assuming WGS84");
      }
    }
    this.a2 = this.a * this.a;          // used in geocentric
    this.b2 = this.b * this.b;          // used in geocentric
    this.es = (this.a2-this.b2)/this.a2;  // e ^ 2
    //this.es=1-(Math.pow(this.b,2)/Math.pow(this.a,2));
    this.e = Math.sqrt(this.es);        // eccentricity
    this.ep2=(this.a2-this.b2)/this.b2; // used in geocentric
  },

  _loadProjCode : function(projName) {
    if (Proj4js.Proj[projName]) {
      this._callInit(projName)
      return;
    } else {
      //Proj4js.Proj[projName] = Class.create();
    }

    //set AJAX options
    var options = {
      method: 'get',
      asynchronous: false,          //need to wait until defs are loaded before proceeding
      onSuccess: this._loadProjCodeSuccess.bind(this),
      onFailure: this._loadProjCodeFailure.bind(this)
    }
    
    //load the projection class 
    var url = Proj4js.libPath + 'projCode/' + projName + '.js';
    new Ajax.Request(url, options);
  },

  _loadProjCodeSuccess : function(transport) {
    var tmp = eval(transport.responseText);
    this._callInit(this.projName);
  },

  _loadProjCodeFailure : function(projName) {
    console.log("failed to find projection file for: " + projName);
    //TBD initialize with identity transforms so proj will still work
  },

  _loadMapExample : function(srsCode) {
    if (Proj4js.maps[srsCode]) return;

    //load the map example definition
    //set AJAX options
    var options = { method: 'get', asynchronous: false, onSuccess: this._loadMapExampleSuccess.bind(this) }
    var url = Proj4js.libPath + 'maps/' + this.srsAuth.toUpperCase() + this.srsProjNumber + '.js';
    new Ajax.Request(url, options);
  },

  _loadMapExampleSuccess : function(transport) {
    var tmp = eval(transport.responseText);
  }
};

Proj4js.Proj.longlat = Class.create();
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
  csList is a collection of coordiante system objects
  generally a CS is added by means of a separate .js file for example:

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
  WGS84 : "+title=long / lat WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84",
  EPSG4326 : "+title=long / lat WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84",
  EPSG4269 : "+title=long / lat NAD83 +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83" 
};

Proj4js.maps = {
  WGS84: {
    mapOptions: {
      maxResolution: 360/512
    },
    layerName: 'metacarta default',
    layerUrl: 'http://labs.metacarta.com/wms-c/Basic.py',
    layerParams: {'layers':'basic'},
    layerOptions: null
  },
  EPSG4326: {
    mapOptions: {
      maxResolution: 360/512
    },
    layerName: 'metacarta default',
    layerUrl: 'http://labs.metacarta.com/wms-c/Basic.py',
    layerParams: {'layers':'basic'},
    layerOptions: null
  }

};



//Proj4js.const = Class.create();
Proj4js.const = {
  PI : Math.PI,
  HALF_PI : Math.PI*0.5,
  TWO_PI : Math.PI*2,
  R2D : 57.2957795131,
  D2R : 0.0174532925199,
  SEC_TO_RAD : 4.84813681109535993589914102357e-6, /* SEC_TO_RAD = Pi/180/3600 */
  EPSLN : 1.0e-10,

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

// following functions from gctpc cproj.c for transverse mercator projections
  e0fn : function(x) {return(1.0-0.25*x*(1.0+x/16.0*(3.0+1.25*x)));},
  e1fn : function(x) {return(0.375*x*(1.0+0.25*x*(1.0+0.46875*x)));},
  e2fn : function(x) {return(0.05859375*x*x*(1.0+0.75*x));},
  e3fn : function(x) {return(x*x*x*(35.0/3072.0));},
  mlfn : function(e0,e1,e2,e3,phi) {return(e0*phi-e1*Math.sin(2.0*phi)+e2*Math.sin(4.0*phi)-e3*Math.sin(6.0*phi));},

// Function to return the sign of an argument
  sign : function(x) { if (x < 0.0) return(-1); else return(1);},

// Function to adjust longitude to -180 to 180; input in radians
  adjust_lon : function(x) {x=(Math.abs(x)<this.PI)?x:(x-(this.sign(x)*this.TWO_PI));return(x);}

};

/** datum object
*/
Proj4js.datum = Class.create();
Proj4js.datum.prototype = {

  /* datum_type values */
  PJD_UNKNOWN  : 0,
  PJD_3PARAM   : 1,
  PJD_7PARAM   : 2,
  PJD_GRIDSHIFT: 3,
  PJD_WGS84    : 4,   // WGS84 or equivelent
  SRS_WGS84_SEMIMAJOR : 6378137.0,  // only used in grid shift transforms

  initialize : function(datum, params) {
    if (this.params) {
      for (var i=0; i<this.params.length; i++) {
        this.params[i]=parseFloat(this.params[i]);
      }
      if (this.datum_params[0] != 0 || this.datum_params[1] != 0 || this.datum_params[2] != 0 ) {
        this.datum_type = Proj4js.const.PJD_3PARAM;
      }
      if (this.datum_params.length > 3) {
        if (this.datum_params[3] != 0 || this.datum_params[4] != 0 ||
            this.datum_params[5] != 0 || this.datum_params[6] != 0 ) {
          this.datum_type = Proj4js.const.PJD_7PARAM;
          this.datum_params[3] *= SEC_TO_RAD;
          this.datum_params[4] *= SEC_TO_RAD;
          this.datum_params[5] *= SEC_TO_RAD;
          this.datum_params[6] = (this.datum_params[6]/1000000.0) + 1.0;
        }
      }
    }
    if (!this.datum_type) this.datum_type = Proj4js.const.PJD_WGS84;
  },

  /** transform()
    source coordinate system definition,
    destination coordinate system definition,
    point to transform in geodetic coordinates (long, lat, height)
  */
  transform : function( point, dest ) {

    // Short cut if the datums are identical.
    if( this.compare_datums( dest ) )
        return 0; // in this case, zero is sucess,
                  // whereas cs_compare_datums returns 1 to indicate TRUE
                  // confusing, should fix this

  // #define CHECK_RETURN {if( pj_errno != 0 ) { if( z_is_temp ) pj_dalloc(z); return pj_errno; }}

      // If this datum requires grid shifts, then apply it to geodetic coordinates.
      if( this.datum_type == this.const.PJD_GRIDSHIFT )
      {
        alert("ERROR: Grid shift transformations are not implemented yet.");
        /*
          pj_apply_gridshift( pj_param(this.params,"snadgrids").s, 0,
                              point_count, point_offset, x, y, z );
          CHECK_RETURN;

          src_a = SRS_WGS84_SEMIMAJOR;
          src_es = 0.006694379990;
        */
      }

      if( dest.datum_type == PJD_GRIDSHIFT )
      {
        alert("ERROR: Grid shift transformations are not implemented yet.");
        /*
          dst_a = ;
          dst_es = 0.006694379990;
        */
      }

        // Do we need to go through geocentric coordinates?
  //  if( this.es != dest.es || this.a != dest.a || // RWG - removed ellipse comparison so
      if( this.datum_type == PJD_3PARAM                      // that longlat CSs do not have to have
          || this.datum_type == PJD_7PARAM                   // an ellipsoid, also should put it a
          || dest.datum_type == PJD_3PARAM                   // tolerance for es if used.
          || dest.datum_type == PJD_7PARAM)
      {

        // Convert to geocentric coordinates.
        cs_geodetic_to_geocentric( this, point );
        // CHECK_RETURN;

        // Convert between datums
        if( this.datum_type == PJD_3PARAM || this.datum_type == PJD_7PARAM )
        {
          cs_geocentric_to_wgs84( this, point);
          // CHECK_RETURN;
        }

        if( dest.datum_type == PJD_3PARAM || dest.datum_type == PJD_7PARAM )
        {
          cs_geocentric_from_wgs84( dest, point);
          // CHECK_RETURN;
        }

        // Convert back to geodetic coordinates
        cs_geocentric_to_geodetic( dest, point );
          // CHECK_RETURN;
      }


    // Apply grid shift to destination if required
    if( dest.datum_type == PJD_GRIDSHIFT )
    {
      alert("ERROR: Grid shift transformations are not implemented yet.");
      // pj_apply_gridshift( pj_param(dest.params,"snadgrids").s, 1, point);
      // CHECK_RETURN;
    }
    return 0;
  }, // cs_datum_transform


  /****************************************************************/
  // cs_compare_datums()
  //   Returns 1 (TRUE) if the two datums match, otherwise 0 (FALSE).
  compare_datums : function( dest ) {
    if( this.datum_type != dest.datum_type ) {
      return 0; // false, datums are not equal
    }
    /*  RWG - took this out so that ellipse is not required for longlat CSs
    else if( this.a != dest.a
             || Math.abs(this.es - dest.es) > 0.000000000050 )
    {
      // the tolerence for es is to ensure that GRS80 and WGS84
      // are considered identical
      return 0;
    }
    */
    else if( this.datum_type == PJD_3PARAM )
    {
      return (this.datum_params[0] == dest.datum_params[0]
              && this.datum_params[1] == dest.datum_params[1]
              && this.datum_params[2] == dest.datum_params[2]);
    }
    else if( this.datum_type == PJD_7PARAM )
    {
      return (this.datum_params[0] == dest.datum_params[0]
              && this.datum_params[1] == dest.datum_params[1]
              && this.datum_params[2] == dest.datum_params[2]
              && this.datum_params[3] == dest.datum_params[3]
              && this.datum_params[4] == dest.datum_params[4]
              && this.datum_params[5] == dest.datum_params[5]
              && this.datum_params[6] == dest.datum_params[6]);
    }
    else if( this.datum_type == PJD_GRIDSHIFT )
    {
      return strcmp( pj_param(this.params,"snadgrids").s,
                     pj_param(dest.params,"snadgrids").s ) == 0;
    }
    else
      return 1; // true, datums are equal
  } // cs_compare_datums()
};

/** point object, nothing fancy, just allows values to be
    passed back and forth by reference rather than by value.
*/
Proj4js.Point = Class.create();
Proj4js.Point.prototype = {
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
     * {String} String representation of OpenLayers.LonLat object. 
     *           (ex. <i>"lon=5,lat=42"</i>)
     */
    toString:function() {
        return ("lon=" + this.x + ",lat=" + this.y);
    },

    /** 
     * APIMethod: toShortString
     * 
     * Return:
     * {String} Shortened String representation of OpenLayers.LonLat object. 
     *         (ex. <i>"5, 42"</i>)
     */
    toShortString:function() {
        return (this.x + ", " + this.y);
    }

};

