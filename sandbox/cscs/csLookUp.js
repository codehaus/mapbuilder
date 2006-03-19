// ultimately this should be a web service or something

/*
  In most map projection formulas, some form of the eccentricity e is used,
  rather than the flattening f. The relationship is as follows:

  e² = 2f - f²
     or
  f = 1 - (1 - e²)½
*/

/*
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


var usfeet = 1200/3937;  // US Survey foot
var feet = 0.3048;  // International foot



function lookUp(srs) {
  srs = srs.toUpperCase();
  // alert (srs);
  cs = new Object();

  switch(srs) {
    // case new String("http://www.opengis.net/gml/srs/epsg.xml#4326").toUpperCase():

    case "EPSG:4326":
      //cs.title = "Long/Lat WGS84";
    case "EPSG:4269":
      //cs.title = "Long/Lat NAD83";
    case "CRS:84":
      //cs.title = "Long/Lat CRS:84";
    case "EPSG:4965":
      //cs.title = "Long/Lat RGF93G IGN-F FD 2005";
      cs.title = "Long / Lat";
      cs.init = "";
      cs.fwd = ll2ll;
      cs.inv = ll2ll;
      cs.units = "degrees";
      cs.latlongflag = true;
      //cs.datum_type = PJD_WGS84;
      cs.a=ellps_grs80.a;
      cs.b=ellps_grs80.b;
      // var f=1/ellps_grs80.rf;      // line 44 pj_ell_set.c
      // cs.e=f*2-f;
      cs.es = 1-(cs.b*cs.b)/(cs.a*cs.a);  // line 56 pj_ell_set.c
      break;

    case "EPSG:4139":
      cs.title = "Puerto Rico";
      cs.init = "";
      cs.fwd = ll2ll;
      cs.inv = ll2ll;
      cs.units = "degrees";
      cs.latlongflag = true;
      //cs.datum_type = PJD_3PARAM;
      cs.a=ellps_clrk66.a;
      cs.b=ellps_clrk66.b;
      cs.es = 1-(cs.b*cs.b)/(cs.a*cs.a);
      cs.to_wgs84 = "11,72,-101,0,0,0,0";
      // +proj=longlat +ellps=clrk66 +towgs84=11,72,-101,0,0,0,0 +no_defs  <>
      break;

/***************************************************************/

   case "EPSG:102758":
     // # NAD 1983 StatePlane Wyoming West FIPS 4904 Feet
     // <102758> +proj=tmerc +lat_0=40.5 +lon_0=-110.0833333333333 +k=0.999938 +x_0=799999.9999999999 +y_0=100000 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192  no_defs <>

      cs.title="NAD 1983 StatePlane Wyoming West FIPS 4904 US Survey Feet";
      cs.init=tminit;
      cs.fwd=ll2tm
      cs.inv=tm2ll;
      cs.a=ellps_grs80.a;
      cs.b=ellps_grs80.b;
      //cs.init(new Array(grs80[0], grs80[1], 0.9999375, -110.0833333333333, 40.5, 800000, 100000));
      cs.long0=-110.0833333333333;  /* central longitude */
      cs.lat0=40.5;                 /* central latitude */
      cs.falseEast=800000;          /* easting and northing */
      cs.falseNorth=100000;
      cs.k0=0.9999375;
      //cs.datum_type=PJD_WGS84;
      cs.units="usfeet";
      cs.es = 1-(Math.pow(cs.b,2)/Math.pow(cs.a,2));
      //cs.pp = new tminit(cs.es, cs.a, cs.lat0);
      break;
    case "EPSG:32158":cs.title="NAD 1983 StatePlane Wyoming West meters";
      cs.init=tminit;
      cs.fwd=ll2tm
      cs.inv=tm2ll;
      cs.a=ellps_grs80.a;
      cs.b=ellps_grs80.b;
      // cs.init(new Array(grs80[0], grs80[1], 0.9999375, -110.0833333333333, 40.5, 800000, 100000));
      cs.units="meters";
      break;
    // UTM NAD83 Zones 3 thru 23
    case"EPSG:26903":case"EPSG:26904":case"EPSG:26905":case"EPSG:26906":case"EPSG:26907":case"EPSG:26908":case"EPSG:26909":
    case"EPSG:26910":case"EPSG:26911":case"EPSG:26912":case"EPSG:26913":case"EPSG:26914":case"EPSG:26915":case"EPSG:26916":
    case"EPSG:26917":case"EPSG:26918":case"EPSG:26919":case"EPSG:26920":case"EPSG:26921":case"EPSG:26922":case"EPSG:26923":
      cs.title="NAD83 / UTM zone "+ srs.substr(8,2)+"N";
      cs.init=utminit;
      cs.fwd=ll2tm;
      cs.inv=tm2ll;
      cs.a=ellps_grs80.a;
      cs.b=ellps_grs80.b;
      //cs.init(new Array(grs80[0], grs80[1], 0.9996, srs.substr(8,2)));
      cs.units="meters";
    break;
    // UTM WGS84 Zones 1 thru 60 North
    case"EPSG:32601":case"EPSG:32602":
    case"EPSG:32603":case"EPSG:32604":case"EPSG:32605":case"EPSG:32606":case"EPSG:32607":case"EPSG:32608":case"EPSG:32609":
    case"EPSG:32610":case"EPSG:32611":case"EPSG:32612":case"EPSG:32613":case"EPSG:32614":case"EPSG:32615":case"EPSG:32616":
    case"EPSG:32617":case"EPSG:32618":case"EPSG:32619":case"EPSG:32620":case"EPSG:32621":case"EPSG:32622":case"EPSG:32623":
    case"EPSG:32624":case"EPSG:32625":case"EPSG:32626":case"EPSG:32627":case"EPSG:32628":case"EPSG:32629":
    case"EPSG:32630":case"EPSG:32631":case"EPSG:32632":case"EPSG:32633":case"EPSG:32634":case"EPSG:32635":case"EPSG:32636":
    case"EPSG:32637":case"EPSG:32638":case"EPSG:32639":case"EPSG:32640":case"EPSG:32641":case"EPSG:32642":
    case"EPSG:32643":case"EPSG:32644":case"EPSG:32645":case"EPSG:32646":case"EPSG:32647":case"EPSG:32648":case"EPSG:32649":
    case"EPSG:32650":case"EPSG:32651":case"EPSG:32652":case"EPSG:32653":case"EPSG:32654":case"EPSG:32655":case"EPSG:32656":
    case"EPSG:32657":case"EPSG:32658":case"EPSG:32659":case"EPSG:32660":
      cs.title="WGS84 / UTM zone " + srs.substr(8,2) + "N";
      cs.init=utminit;
      cs.fwd=ll2tm;
      cs.inv=tm2ll;
      cs.a=ellps_wgs84.a;
      cs.b=ellps_wgs84.b;
      //cs.init(new Array(wgs84[0], wgs84[1], 0.9996, srs.substr(8,2)));
      cs.units="meters";
    break;
    // UTM WGS84 Zones 1 thru 60 South
    case"EPSG:32701":case"EPSG:32702":
    case"EPSG:32703":case"EPSG:32704":case"EPSG:32705":case"EPSG:32706":case"EPSG:32707":case"EPSG:32708":case"EPSG:32709":
    case"EPSG:32710":case"EPSG:32711":case"EPSG:32712":case"EPSG:32713":case"EPSG:32714":case"EPSG:32715":case"EPSG:32716":
    case"EPSG:32717":case"EPSG:32718":case"EPSG:32719":case"EPSG:32720":case"EPSG:32721":case"EPSG:32722":case"EPSG:32723":
    case"EPSG:32724":case"EPSG:32725":case"EPSG:32726":case"EPSG:32727":case"EPSG:32728":case"EPSG:32729":
    case"EPSG:32730":case"EPSG:32731":case"EPSG:32732":case"EPSG:32733":case"EPSG:32734":case"EPSG:32735":case"EPSG:32736":
    case"EPSG:32737":case"EPSG:32738":case"EPSG:32739":case"EPSG:32740":case"EPSG:32741":case"EPSG:32742":
    case"EPSG:32743":case"EPSG:32744":case"EPSG:32745":case"EPSG:32746":case"EPSG:32747":case"EPSG:32748":case"EPSG:32749":
    case"EPSG:32750":case"EPSG:32751":case"EPSG:32752":case"EPSG:32753":case"EPSG:32754":case"EPSG:32755":case"EPSG:32756":
    case"EPSG:32757":case"EPSG:32758":case"EPSG:32759":case"EPSG:32760":
      cs.title="WGS84 / UTM zone " + srs.substr(8,2) + "S";
      cs.init=utminit;
      cs.fwd=ll2tm;
      cs.inv=tm2ll;
      cs.a=ellps_wgs84.a;
      cs.b=ellps_wgs84.b;
      //cs.init(new Array(wgs84[0], wgs84[1], 0.9996, "-"+srs.substr(8,2)));
      cs.units="meters";
    break;

    case "EPSG:26591":cs.title="Monte Mario (Rome) / Italy zone 1";
      cs.init=tminit;
      cs.fwd=ll2tm
      cs.inv=tm2ll;
      cs.init(new Array(6378388.0, 6356911.94612795,0.9996, 9, 0.0, 1500000.0, 0.0));
      cs.units="meters";
      break;

/***************************************************************/

    default:
      alert("unsupported map projection: "+this.srs);
  }

  return cs;
                                                            }