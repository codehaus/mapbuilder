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
 * @author Cameron Shorter
 * @requires Config
 * @requires Listener
 * @requires ModelBase
 * @requires Sarissa
 * @requires Util
 */
function Mapbuilder() {
  /** Array of objects that are loading.  Don't continue initialisation until
   * all objects have loaded. */
  this.loadingScripts=new Array();

  /** Timer to periodically check if scripts have loaded. */
  this.scriptsTimer=null;

  /** True when all scripts from Config file have been loaded. */
  this.allScriptsLoaded=false;

  /**
   * Called periodically and continues initialisation once scripts have loaded.
   * This function uses object.readyState which is only valid for IE.  Mozilla
   * works fine without this function.
   */
  this.checkScriptsLoaded=function() {
    // Objects that have completed loading are removed from the array
    alert("checkScriptsLoaded length="+this.loadingScripts.length
      +" readyState="+this.loadingScripts[0].readyState);
    while(this.loadingScripts.length>0
      &&(this.loadingScripts[0].readyState=="loaded"
      ||this.loadingScripts[0].readyState==null))
    {
      this.loadingScripts.shift();
      if (this.loadingScripts.length==1){
        alert("checkScriptsLoaded - loaded "+this.loadingScripts[0].id);
      }
    }
    if (this.loadingScripts.length==0){
      clearInterval(this.scriptsTimer);
      this.allScriptsLoaded=true;
    }
  }

  /**
   * Dynamically load a script file if it has not already been loaded.
   * TBD: We can remove the object param because it is not used anymore.
   * @param url The url of the script.
   * @param object Name of the object being loaded.
   */
  this.loadScript=function(url,object){
    if(!document.getElementById(url)){
      var script = document.createElement('script');
      script.defer = false;   //not sure of effect of this?
      script.type = "text/javascript";
      script.src = url;
      script.id = url;
      document.getElementsByTagName('head')[0].appendChild(script);
      if(object){
        this.loadingScripts.push(script);
      }
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

  this.loadScript(baseDir+"/util/sarissa/Sarissa.js","Sarissa");
  this.loadScript(baseDir+"/util/Util.js","Util");
  this.loadScript(baseDir+"/util/Listener.js","Listener");
  this.loadScript(baseDir+"/model/ModelBase.js","ModelBase");
  this.loadScript(baseDir+"/model/Config.js","Config");

  // Start a timer which periodically calls checkScriptsLoaded().
  this.scriptsTimer=setInterval('mapbuilder.checkScriptsLoaded()',100);

  // TBD: Remove following line - it is used for debugging.
  setTimeout('clearInterval(this.scriptsTimer)',5000);
}
mapbuilder=new Mapbuilder();
