/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/** URL of this Mapbuilder configuration file. */
var mbConfigUrl;

/** the global config object */
var config;

/** URL of Mapbuilder's lib/ directory. */
var baseDir;

/**
 * This Object bootstraps the Mapbuilder libraries by loading the core
 * script files.
 * When Config.js is loaded, the script files for objects described in the
 * Mapbuilder config file are loaded.
 * Objects which have dependencies will trigger the dependancies to load
 * when they are loaded.
 *
 * @constructor
 * @param configUrl URL of this Mapbuilder configuration file.
 * @author Cameron Shorter
 * @requires Config
 * @requires Listener
 * @requires ModelBase
 * @requires Sarissa
 * @requires Util
 */
function Mapbuilder(configUrl) {
  // Set global variables

  //derive the baseDir value by looking for the script tag that loaded this file
  var head = document.getElementsByTagName('head')[0];
  var nodes = head.childNodes;
  for (var i=0; i<nodes.length; ++i ){
    var src = nodes.item(i).src;
    if (src) {
      var index = src.indexOf("/Mapbuilder.js");
      if (index>=0) {
        baseDir = src.substring(0, index);
        //alert("baseDir set to:" + baseDir);
      }
    }
  }

  mbConfigUrl=configUrl;

  loadScript(baseDir+"/util/sarissa/Sarissa.js");
  loadScript(baseDir+"/util/Util.js");
  loadScript(baseDir+"/util/Listener.js");
  loadScript(baseDir+"/model/ModelBase.js");
  loadScript(baseDir+"/model/Config.js");

}

/**
 * Dynamically load a script file if it has not already been loaded.
 * @param url The url of the script.
 */
function loadScript (url) {
  if(!document.getElementById(url)){
    var script = document.createElement('script');
    script.defer = false;   //not sure of effect of this?
    script.type = "text/javascript";
    script.src = url;
    script.id = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
