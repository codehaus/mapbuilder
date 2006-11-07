/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/
 
var mac, win;
var opera, khtml, safari, mozilla, ie, ie50, ie55, ie60;
var canvasEnabled = false;

mapbuilder.loadScript(baseDir+"/util/sarissa/Sarissa.js");

/**
  * Check if we support canvas or VML
  * if not, use WZ library
  */
function chkCapabilities() {
  // inspired from dojo code
  var UA = navigator.userAgent;
  var AV = navigator.appVersion;
 
  ver = parseFloat(AV);
  mac = AV.indexOf("Macintosh") == -1 ? false : true; 
  win = AV.indexOf("Windows") == -1 ? false : true; 

  opera = UA.indexOf("Opera") == -1 ? false : true; 
  khtml = ((AV.indexOf("Konqueror") >= 0)||(AV.indexOf("Safari") >= 0)) ? true : false; 
  safari = (AV.indexOf("Safari") >= 0) ? true : false; 
  mozilla = moz = ((UA.indexOf("Gecko") >= 0)&&(!khtml)) ? true : false; 
  ie = ((document.all)&&(!opera)) ? true : false;
  ie50 = ie && AV.indexOf("MSIE 5.0")>=0;
  ie55 = ie && AV.indexOf("MSIE 5.5")>=0;
  ie60 = ie && AV.indexOf("MSIE 6.0")>=0;
  
  if( ie ) {
    mapbuilder.loadScript(baseDir+"/graphics/VMLGraphics.js");
  } else {
    if( document.implementation.hasFeature("org.w3c.dom.svg", "1.0") ) {
      //alert( "loading SVG")
      mapbuilder.loadScript(baseDir+"/graphics/SVGGraphics.js");  
    //} else {
    //  alert( "no support for SVG nor VML")
    }
  }
  
//  if( ie ) {
    //mapbuilder.loadScript(baseDir+"/graphics/Canvas.js");
//  }
  
//  var canvas = document.createElement("canvas");
//  if( canvas.getContext != undefined ) {
//    canvasEnabled = true;
//  } else {
    //alert( "not canvas enabled");
    //mapbuilder.loadScript(baseDir+"../util/wz_jsgraphics/wz_jsgraphics.js");
//  }
}

function VectorGraphics(id, div, width, height) {
  if( ie )
    return new VMLGraphics2(id,div, width, height);
  
  if( safari || mozilla )
    return new SVGGraphics(id, div, width, height);
      
  // most cases
  var gr = new jsGraphics(id);
  return gr;
}


chkCapabilities();
