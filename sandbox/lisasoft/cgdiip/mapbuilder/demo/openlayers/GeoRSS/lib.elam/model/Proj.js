/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
              Richard Greenwood rich@greenwoodmap.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html
              Note: This program uses algorithms derived from GCTPC at
              http://edcftp.cr.usgs.gov/pub//software/gctpc/ .  As this
              code belongs to the US Government, we believe it is available
              to the public domain and hence is compabible with the LGPL.
$Id: Proj.js 2956 2007-07-09 12:17:52Z steven $
*/

/**
 * Provides latitude/longitude to map projection (and vice versa) transformation methods.
 * Initialized with EPSG codes.  Has properties for units and title strings.
 * All coordinates are handled as points which is a 2 element array where x is
 * the first element and y is the second.
 * For the Forward() method pass in lat/lon and it returns map XY.
 * For the Inverse() method pass in map XY and it returns lat/long.
 *
 * TBD: retrieve initialization params (and conversion code?) from a web service
 *
 * @constructor
 *
 * @param srs         The SRS (EPSG code) of the projection
 */
 
var cscsPath = baseDir+"/util/cscs/lib/";
function Proj(srs) {
	var tmp = srs.split(":");
	cs = tmp[0]+tmp[1];
	/* begin an AJAX load cs function */
	cscsRequestCSDefinition(cs);
	var epsg = new CS(eval("csList."+cs));
	epsg.srs=srs;
 	return epsg;
 }

/**
	Attempts to retreive a Coordinate System definition, and if necessary
	associated projection functions, from server. Returns the Coordinate
	System's title on sucess, or null on failure.

	cscsPath must already be set and point to root of cscs library directory.
*/
function cscsRequestCSDefinition(csCode) {
	var title = null;
	var proj = null;
	var def; // coordinate system definition
	/* Should check here to see if it is already loaded before calling get content */
	// see if projection specific functions need to be loaded
	var defLoaded;
	for ( i in csList) {
		if (csCode == i){
			defLoaded = true;
			break;
		}
	}// for(( i in csList))
	
	if(!defLoaded){
	
		def = get_content(cscsPath + "defs/" + csCode + ".js");
	
		if (def) {
			var chk;
			eval("chk="+def); // eval-ing a def puts it into the global csList
									// but we also want to check this definition so we
									// assign it to the local var "chk"
			var propArray;
			var paramArray=chk.split("+");
			for (var i=0; i<paramArray.length; i++) {
				propArray = paramArray[i].split("=");
				if (propArray[0].toLowerCase() == "proj") {
					proj = propArray[1].replace(/\s/gi,"");
				} else if (propArray[0].toLowerCase() == "title") {
					title =  propArray[1];
				}
			}
	
			if (proj) { // see if we got a "proj" parameter, if not it is an error
				if (!title) {    // name is not required
					title = proj; // but a projection is required
				}
	
				// see if projection specific functions need to be loaded
				var projLoaded;
				for (i in csList) {
					if ((csList[i].indexOf(proj)!=-1)&& i!=csCode){
						projLoaded = true;
						break;
					}
				}	// for()
	
				if (!projLoaded) {
					eval(get_content(cscsPath + proj + ".js"));
				}
			}//end if(def)
		}
	}//end if(!defLoaded)
}	// cscsRequestCSDefinition()



/*
** Function to retrieve the value of a URL as a javascript string.
*/
function get_content(url) {
  var content;

  if(document.all) { // IE version
    // older versions (IE4 and some IE5.0) might be using MSXML2.XMLHTTP.4.0
    var xml = new ActiveXObject("Microsoft.XMLHTTP");
    xml.Open( "GET", url, false );
    xml.Send()
    content = xml.responseText;
  } else { // Mozilla/Netscrap 6+ version
    var xml = new XMLHttpRequest();
    xml.open("GET",url,false);
    xml.send(null);
    content = xml.responseText;
  }
  // RWG
  if (xml.status == 200) {
    return(content);
  } else {
    alert("Error, status = " + xml.status);
    return null;
  }
  // GWR
}


/* end AJAX load cs function */
 