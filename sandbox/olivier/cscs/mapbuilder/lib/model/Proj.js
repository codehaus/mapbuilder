/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
              Richard Greenwood rich@greenwoodmap.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html
              Note: This program uses algorithms derived from GCTPC at
              http://edcftp.cr.usgs.gov/pub//software/gctpc/ .  As this
              code belongs to the US Government, we believe it is available
              to the public domain and hence is compabible with the LGPL.
$Id: Proj.js 2712 2007-04-12 15:12:26Z oterral $
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
 
    

function Proj(srs) {
	var tmp = srs.split(":");
	cs = tmp[0]+tmp[1];
	
	//TO BE DELETE
	//var scriptElem = document.createElement('script');
	//AjaxClassLoader.setClassFolder('../../lib/util');
	//Loads the Javascript file associated with the classPath of our main class.
	//var MyClass = AjaxClassLoader.load('cscs.lib.defs.EPSG27563');
	/*var chemin = baseDir+"/util/cscs/lib/defs/"+cs+".js";
 scriptElem.setAttribute('src',chemin);
 scriptElem.setAttribute('type','text/javascript');
 document.getElementsByTagName('head')[0].appendChild(scriptElem);*/
    //alert (csList.EPSG27563);
	//var a = csList;
	//mapbuilder.loadScript(baseDir+"/util/cscs/lib/"+eval("csList."+cs).proj+".js");
	var epsg =new CS(eval("csList."+cs));   
	epsg.srs=srs;
	epsg.units="m";
 	return epsg;
 
 
 }
