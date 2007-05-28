// Function to compute the constant small m which is the radius of
//   a parallel of latitude, phi, divided by the semimajor axis.
// -----------------------------------------------------------------
function msfnz(eccent, sinphi, cosphi) {
      var con = eccent * sinphi;
      return cosphi/(Math.sqrt(1.0 - con * con));
}

// Function to compute the constant small t for use in the forward
//   computations in the Lambert Conformal Conic and the Polar
//   Stereographic projections.
// -----------------------------------------------------------------
function tsfnz(eccent, phi, sinphi) {
  var con = eccent * sinphi;
  var com = .5 * eccent;
  con = Math.pow(((1.0 - con) / (1.0 + con)), com);
  return (Math.tan(.5 * (HALF_PI - phi))/con);
}

// Function to compute the latitude angle, phi2, for the inverse of the
//   Lambert Conformal Conic and Polar Stereographic projections.
// ----------------------------------------------------------------
function phi2z(eccent, ts) {
  var eccnth = .5 * eccent;
  var con, dphi;
  var phi = HALF_PI - 2 * Math.atan(ts);
  for (i = 0; i <= 15; i++) {
    con = eccent * Math.sin(phi);
    dphi = HALF_PI - 2 * Math.atan(ts *(Math.pow(((1.0 - con)/(1.0 + con)),eccnth))) - phi;
    phi += dphi;
    if (Math.abs(dphi) <= .0000000001) return phi;
  }
  alert("phi2z has NoConvergence");
  return (-9999);
}

// Function to return the sign of an argument
function sign(x) { if (x < 0.0) return(-1); else return(1);}

// Function to adjust longitude to -180 to 180; input in radians
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}



//Equations : faciles à rentrer


/*
case "": break;   // throw away nameless parameter
      case "title": this.title =paramVal; break;
      case "proj":  this.proj =  paramVal.replace(/\s/gi,""); break;
      // case "ellps": this.ellps = paramVal.replace(/\s/gi,""); break;
      // case "datum": this.datum = paramVal.replace(/\s/gi,""); break;
      case "a":     this.a =  parseFloat(paramVal);  break; // semi-major radius
      case "b":     this.b =  parseFloat(paramVal);  break; // semi-minor radius
      case"lat_1":this.lat1=paramVal*D2R;break;//standard parallel 1  ------RAJOUTS
      case "lat_2":this.lat2=paramVal*D2R;break;//standard parallel 2------
      case "lon_0": this.long0= paramVal*D2R; break;        // lam0, central longitude
      case "lat_0": this.lat0 = paramVal*D2R; break;        // phi0, central latitude
      case "x0":   this.x0 = parseFloat(paramVal); break;  // false easting
      case "x0":   this.y0 = parseFloat(paramVal); break;  // false northing
      case "k":     this.k0 = parseFloat(paramVal); break;  // projection scale factor
      //case "to_meter": this.to_meter = parseFloat(paramVal); break; // cartesian scaling
      case "to_meter": this.to_meter = eval(paramVal); break; // cartesian scaling
      case "zone":     this.zone =  parseInt(paramVal); break;      // UTM Zone
      case "towgs84":  this.datum_params = paramVal.split(","); break;
      case "from_greenwich": this.from_greenwich = paramVal*D2R; break;
      default: csErrorMessage += "\nUnrecognized parameter: " + paramName;

*/
//<2104> +proj=lcc +lat_1=10.16666666666667 +lat_0=10.16666666666667 +lon_0=-71.60561777777777 +k_0=1 +x0=-17044 +x0=-23139.97 +ellps=intl +units=m +no_defs  no_defs

// Initialize the Lambert Conformal conic projection
// -----------------------------------------------------------------
function lccInit(def) {
// array of:  r_maj,r_min,lat1,lat2,c_lon,c_lat,false_east,false_north
//double c_lat;                   /* center latitude                      */
//double c_lon;                   /* center longitude                     */
//double lat1;                    /* first standard parallel              */
//double lat2;                    /* second standard parallel             */
//double r_maj;                   /* major axis                           */
//double r_min;                   /* minor axis                           */
//double false_east;              /* x offset in meters                   */
//double false_north;             /* y offset in meters                   */

if (!def.lat2){def.lat2=def.lat0;}//if lat2 is not defined

// Standard Parallels cannot be equal and on opposite sides of the equator
  if (Math.abs(def.lat1+def.lat2) < EPSLN) {
    alert("lccinit Equal Latitudes");
    return;
  }

  var temp = def.b / def.a;
  def.e = Math.sqrt(1.0 - temp*temp);

  var sin1 = Math.sin(def.lat1);
  var cos1 = Math.cos(def.lat1);
  var ms1 = msfnz(def.e, sin1, cos1);
  var ts1 = tsfnz(def.e, def.lat1, sin1);
  
  

  var sin2 = Math.sin(def.lat2);
  var cos2 = Math.cos(def.lat2);
  var ms2 = msfnz(def.e, sin2, cos2);
  var ts2 = tsfnz(def.e, def.lat2, sin2);
    

  
  
  var ts0 = tsfnz(def.e, def.lat0, Math.sin(def.lat0));

  if (Math.abs(def.lat1 - def.lat2) > EPSLN) {
    def.ns = Math.log(ms1/ms2)/Math.log(ts1/ts2);
  } else {
    def.ns = sin1;
  }
  def.f0 = ms1 / (def.ns * Math.pow(ts1, def.ns));
  def.rh = def.a * def.f0 * Math.pow(ts0, def.ns);
}


// Lambert Conformal conic forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
function lccFwd(p) {

  var lon = p.x;
  var lat = p.y;

// convert to radians
  if ( lat <= 90.0 && lat >= -90.0 && lon <= 180.0 && lon >= -180.0) {
   
  
  } else {
    alert("llInput Out Of Range", lon, lat);
    return null;
  }

  var con  = Math.abs( Math.abs(lat) - HALF_PI);
  var ts;
  if (con > EPSLN) {
    ts = tsfnz(this.e, lat, Math.sin(lat) );
    rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
  } else {
    con = lat * this.ns;
    if (con <= 0) {
      alert("ll2lcc No Projection");
      return null;
    }
    rh1 = 0;
  }
  var theta = this.ns * adjust_lon(lon - this.long0);
  var x = rh1 * Math.sin(theta) + this.x0;
  var y = this.rh - rh1 * Math.cos(theta) + this.y0;

  p.x=x;
  p.y=y;
}

// Lambert Conformal Conic inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
function lccInv(p) {

  var rh1, con, ts;
  var lat, lon;
  x = p.x - this.x0;
  y = this.rh - p.y + this.y0;
  if (this.ns > 0) {
    rh1 = Math.sqrt (x * x + y * y);
    con = 1.0;
  } else {
    rh1 = -Math.sqrt (x * x + y * y);
    con = -1.0;
  }
  var theta = 0.0;
  if (rh1 != 0) {
    theta = Math.atan2((con * x),(con * y));
  }
  if ((rh1 != 0) || (this.ns > 0.0)) {
    con = 1.0/this.ns;
    ts = Math.pow((rh1/(this.a * this.f0)), con);
    lat = phi2z(this.e, ts);
    if (lat == -9999) return null;
  } else {
    lat = -HALF_PI;
  }
  lon = adjust_lon(theta/this.ns + this.long0);
  
  p.x=lon;
  p.y=lat;
}




