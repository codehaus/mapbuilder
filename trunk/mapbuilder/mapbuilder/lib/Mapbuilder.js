/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

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
  /** Array of scripts that are loading.  Don't continue initialisation until
   * all scripts have loaded. */
  this.loadingScripts=new Array();

  /** Timer to periodically check if scripts have loaded. */
  this.scriptsTimer=null;

  /**
   * Instantiate Config, wait for scripts to be loaded by Config, then call
   * config.init.
   */
  this.configInit=function(){
    config=new Config(mbConfigUrl);
    config.loadConfigScripts();
    this.scriptsTimer=setInterval('mapbuilder.checkScriptsLoaded("config.init()")',1000);
  }

  /**
   * Called periodically and continues initialisation once scripts have loaded.
   * This function is only required for IE.  Mozilla waits for scripts to load
   * before executing.
   * @parm fn function to call when scripts are loaded.
   */
  this.checkScriptsLoaded=function(fn) {
    // Scripts that have completed loading are removed from the array
    // Note: readyState is not defined in Mozilla.
    while(this.loadingScripts.length>0
      &&(this.loadingScripts[0].readyState=="complete"
      ||this.loadingScripts[0].readyState==null))
    {
      this.loadingScripts.shift();
    }
    // Call fn when scripts have loaded.
    if (this.loadingScripts.length==0){
      clearInterval(this.scriptsTimer);
      this.scriptsTimer=null;
      eval(fn);
    }
  }

  /**
   * Dynamically load a script file if it has not already been loaded.
   * @param url The url of the script.
   */
  this.loadScript=function(url){
    if(!document.getElementById(url)){
      var script = document.createElement('script');
      script.defer = false;   //not sure of effect of this?
      script.type = "text/javascript";
      script.src = url;
      script.id = url;
      document.getElementsByTagName('head')[0].appendChild(script);
      this.loadingScripts.push(script);
    }
  }

  //derive the baseDir value by looking for the script tag that loaded this file
  var head = document.getElementsByTagName('head')[0];
  var nodes = head.childNodes;
  for (var i=0; i<nodes.length; ++i ){
    var src = nodes.item(i).src;
    if (src) {
      var index = src.indexOf("/Mapbuilder.js");
      if (index>=0) {
        baseDir = src.substring(0, index);
      }
    }
  }

  this.loadScript(baseDir+"/util/sarissa/Sarissa.js");
  this.loadScript(baseDir+"/util/Util.js");
  this.loadScript(baseDir+"/util/Listener.js");
  this.loadScript(baseDir+"/model/ModelBase.js");
  this.loadScript(baseDir+"/model/Config.js");

  // Start a timer which periodically calls checkScriptsLoaded().
  this.scriptsTimer=setInterval('mapbuilder.checkScriptsLoaded("this.configInit()")',1000);
}
