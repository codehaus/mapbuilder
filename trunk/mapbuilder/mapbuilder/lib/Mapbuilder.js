/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/****************************************************************************
 * This Object bootstraps the Mapbuilder libraries by loading the core
 * script files, then calls Config which reads a Mapbuilder config file
 * and loads and initialises the remaining scripts.
 *
 * @constructor
 * @author Cameron Shorter
 * @requires Sarissa
 * @requires Util
 * @requires Config
 */
function Mapbuilder() {
  loadScript(baseDir+"/util/sarissa/Sarissa.js");
  loadScript(baseDir+"/util/Util.js");
  loadScript(baseDir+"/util/Listener.js");
  loadScript(baseDir+"/model/ModelBase.js");
  loadScript(baseDir+"/widget/WidgetBase.js");
  loadScript(baseDir+"/model/Config.js");
}

/****************************************************************************
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

