/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/** get a time stamp at start of the page load */
var mbTimerStart = new Date();

/** the global config object */
var config;

if( typeof baseDir == "undefined") {
/** URL of Mapbuilder's lib/ directory. */
var baseDir;
}

/** mapbuilder environement settings, defaults to a .xml extension but is 
  auto-configured by the ant build script to .jsp for tomcat environment 
  the URL to this file will be pre-pended with the baseDir value.
*/
var mbServerConfig = "mapbuilderConfig.xml";
var mbNsUrl = "http://mapbuilder.sourceforge.net/mapbuilder";

// LoadState Constants
var MB_UNLOADED=0;    // Scripts not loaded yet
var MB_LOAD_CORE=1;   // Loading scripts loaded defined in Mapbuilder
var MB_LOAD_CONFIG=2; // Loading scripts loaded defined in Config
var MB_LOADED=3;      // All scripts loaded

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

  /**
   * Determines which Mapbuilder scripts are loading.
   * TBD: Is it possible to use enumerated types in JS?
   */
  this.loadState=MB_UNLOADED;

  /** Array of objects that are loading.  Don't continue initialisation until
   * all objects have loaded. */
  this.loadingScripts=new Array();
  
  /** Array of scripts that have to be loaded ordered */
  this.orderedScripts = new Array();
  
  /** Timer to load ordered scripts */
  this.scriptLoader = null;

  /** Timer to periodically check if scripts have loaded. */
  this.scriptsTimer=null;

  /**
   * Called periodically and moves onto the next loadState when this round of
   * scripts have loaded.
   * For IE clients, object.readyState is used to check if scripts are loaded.
   * For other clients, script.onLoad is used to check if scripts are loaded.
   * Mozilla browsers older than FF4.0 and Opera work fine without this function
   * - I think it is single threaded.
   */
  this.checkScriptsLoaded=function() {
    if (document.readyState) {
      if (navigator.userAgent.toLowerCase().indexOf("ie") > -1) {
        // IE client
  
        // Scripts are removed from array when they have loaded
        while(this.loadingScripts.length>0
          &&(this.loadingScripts[0].readyState=="loaded"
            ||this.loadingScripts[0].readyState=="complete"
            ||this.loadingScripts[0].readyState==null))
        {
          this.loadingScripts.shift();
        }
      }
      // Scripts are removed from array when they have loaded via callback (see loadScript)
      if (this.loadingScripts.length==0 && this.orderedScripts.length == 0){
        this.setLoadState(this.loadState+1);
      }
    }
    else{
      // Mozilla browsers older than FF3.6
      if(this.loadState==MB_LOAD_CORE && config!=null){
        // Config has finished loading
        this.setLoadState(MB_LOAD_CONFIG);
      }
    }
  }

  /**
   * Move onto loading the next set of scripts.
   * @param newState The new loading state.
   */
  this.setLoadState=function(newState){
    this.loadState=newState;
    switch (newState){
      case MB_LOAD_CORE:
        // core scripts have to be loaded in the correct order (needed for IE)
        this.loadOrdered = true;
        this.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
        this.loadScript(baseDir+"/util/sarissa/Sarissa.js");
        this.loadScript(baseDir+"/util/sarissa/javeline_xpath.js");
        this.loadScript(baseDir+"/util/sarissa/javeline_xslt.js");
        this.loadScript(baseDir+"/util/sarissa/sarissa_dhtml.js");
        this.loadScript(baseDir+"/util/sarissa/sarissa_ieemu_xpath.js");
        //this.loadScript(baseDir+"/util/sarissa/sarissa_ieemu_xslt.js");//all deprecated
        this.loadScript(baseDir+"/util/proj4js/proj4js-compressed.js");
        this.loadScript(baseDir+"/util/Util.js");
        this.loadScript(baseDir+"/util/Listener.js");
        this.loadScript(baseDir+"/model/ModelBase.js");
        this.loadScript(baseDir+"/model/Config.js");
        // only for Mozilla browsers older than FF3.6 and IE:
        if (document.readyState==null || navigator.userAgent.toLowerCase().indexOf("ie") > -1) {
          // from now on, scripts can be loaded in any order
          this.loadOrdered = false;
        }
        break;
      case MB_LOAD_CONFIG:
        if (document.readyState) {
          config=new Config(mbConfigUrl);
          config.loadConfigScripts();
        }else{
          // Mozilla browsers older than FF3.6
          this.setLoadState(MB_LOADED);
        }
        break;
      case MB_LOADED:
        window.clearInterval(this.scriptsTimer);
        break;
    }
  }

  /**
   * Dynamically load a script file if it has not already been loaded.
   * @param url The url of the script.
   * that loadScript was called
   */
  this.loadScript=function(url){
    // if we are working with a compressed build, load only scripts that
    // are not part of the compressed build. This check is done by looking
    // into the global namespace for a function that has the same name as
    // the script file (without path and without .js). Because script files
    // in the util dir do not follow that pattern, exclude them from the
    // check separately.
    if(typeof MapBuilder_Release == "boolean") {
      if (url.indexOf(baseDir+"/util/") != -1) {
        return;
      }
      var urlElements = url.split("/");
      var scriptClass = urlElements[urlElements.length-1].replace(/.js$/, "");
      if(typeof window[scriptClass] == "function") {
        return;
      }
    }

    if(!document.getElementById(url)){
      var script = document.createElement('script');
      script.src = url;
      script.id = url;
      script.defer = false;   //not sure of effect of this?
      script.type = "text/javascript";
      if (document.readyState && this.loadOrdered == true) {
        // mark the script as ordered
        // check if the script is already loading and load it almost immediately
        if (!this.checkScriptLoading(script, this.orderedScripts)) {
          this.orderedScripts.push(script);
        }
        if (!this.scriptLoader) {
          this.scriptLoader = window.setInterval('mapbuilder.loadNextScript()', 5);
        }
      } else {
        // add to dom tree, except if we want to load ordered
        document.getElementsByTagName('head')[0].appendChild(script);
        if (document.readyState) {
          // this is only needed for actual browsers
          if (this.checkScriptLoading(script, this.loadingScripts) === false) {
            this.loadingScripts.push(script);
          }
          // this is not needed for IE
          if (navigator.userAgent.toLowerCase().indexOf("ie") == -1) {
            // add the onLoad handler
            var objRef = this;
            script.onload = function(){
              for (var i=0; i<objRef.loadingScripts.length; i++) {
                if (script == objRef.loadingScripts[i]) {
                  objRef.loadingScripts.splice(i, 1);
                  break;
                }
              }
            };
          }
        }
      }
    }
  }

  /**
   * check if a script is being loaded. This function checks via the id of the
   * script if a script is already in the loadingScripts (orderedScripts or
   * loadingScripts) array.
   * @param script The script to check.
   * @param loadingScripts The array the script may be in.
   */
  this.checkScriptLoading = function(script, loadingScripts) {
    var scriptLoading = false;
    for (var i=0; i<loadingScripts.length; i++) {
      if (script.id == loadingScripts[i].id) {
        scriptLoading = true;
        break;
      }
    }
    return scriptLoading;
  }

  /**
   * loads one script after another. This function is run in a
   * 50ms interval and clears its interval if there are no more
   * scripts to load. It actually loads the first script from the
   * orderedScripts array.
   */
  this.loadNextScript = function() {
    if (this.orderedScripts.length == 0) {
      window.clearInterval(this.scriptLoader);
      this.scriptLoader = null;
    } else {
      var script = this.orderedScripts[0];
      if (!script.loading) {
        script.loading = true;
        this.doLoadScript(script);
      }
    }
  }
  
  /**
   * starts script loading by adding the script node to the dom tree.
   * This function adds a readyState or onLoad handler to the script node.
   */
  this.doLoadScript = function(script) {
    var objRef = this;
    if (navigator.userAgent.toLowerCase().indexOf("ie") > -1) {
      // IE
      script.onreadystatechange = function(){objRef.checkScriptState(this)};
    } else {
      script.onload = function(){objRef.checkScriptState(this)};
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  
  /**
   * readyState / onLoad handler for scripts. This will remove the script from
   * the array of scripts that have still to be loaded.
   */
  this.checkScriptState = function(script) {
    var scriptLoaded = false;
    if (document.readyState && navigator.userAgent.toLowerCase().indexOf("ie") > -1) {
      // IE
      if (script.readyState == "loaded" || script.readyState == "complete") {
        scriptLoaded = true;
      }
    } else if (document.readyState) {
      scriptLoaded = true;
    }
    if (scriptLoaded === true) {
      for (var i=0; i<this.orderedScripts.length; i++) {
        if (script == this.orderedScripts[i]) {
          this.orderedScripts.splice(i, 1);
          break;
        }
      }
    }
  }

  /**
   * Internal function to load scripts for components that don't have <scriptfile>
   * specified in the config file.
   * @param xPath Xpath match of components from the Config file.
   * @param dir The directory the script is located in.
   */
  this.loadScriptsFromXpath=function(nodes,dir) {
    //var nodes = this.doc.selectNodes(xPath);
    for (var i=0; i<nodes.length; i++) {
      if (nodes[i].selectSingleNode("mb:scriptFile")==null){
        scriptFile = baseDir+"/"+dir+nodes[i].nodeName+".js";
        this.loadScript(scriptFile);
      }
    }
  }

  //derive the baseDir value by looking for the script tag that loaded this file
  if (!baseDir) {
    var head = document.getElementsByTagName('head')[0];
    var nodes = head.childNodes;
    for (var i=0; i<nodes.length; ++i ){
      var src = nodes.item(i).src;
      if (src) {
        //var index = src.indexOf("/Mapbuilder.js");
        // Modified so it will work with original or compressed file
        var index = src.indexOf("/Mapbuilder.js");
        if (index>=0) {
          baseDir = src.substring(0, index);
        } else {
          index = src.indexOf("/MapbuilderCompressed.js");
          if (index>=0) {
            baseDir = src.substring(0, index);
          }
        }
      }
    }
  }

  // Start loading core scripts.
  this.setLoadState(MB_LOAD_CORE);

  // Start a timer which periodically calls checkScriptsLoaded().
  this.scriptsTimer=window.setInterval('mapbuilder.checkScriptsLoaded()',10);
}

/**
 * copied from sarissa, a function to check browser security setting in IE, 
 * opens a help page if ActiveX objects are disabled.
 */
function checkIESecurity()
{
  var testPrefixes = ["Msxml2.DOMDocument.5.0", "Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XMLDOM"];
  // found progID flag
  var bFound = false;
  for(var i=0; i < testPrefixes.length && !bFound; i++) {
    try {
      var oDoc = new ActiveXObject(testPrefixes[i]);
      bFound = true;
    }
    catch (e) {
      //trap; try next progID
    }
  }
  if (!bFound) window.open("/mapbuilder/docs/help/IESetup.html");  //TBD: set this URL in config
}

if (navigator.userAgent.toLowerCase().indexOf("msie") > -1) checkIESecurity();
var mapbuilder=new Mapbuilder();

/**
 * Initialise Mapbuilder if script has been loaded, else wait to be called
 * again.
 */
function mapbuilderInit(){
  if(mapbuilder && mapbuilder.loadState==MB_LOADED){
    window.clearInterval(mbTimerId);
    
    // OpenLayers global defaults
    OpenLayers.Events.prototype.includeXY = true;
    
    config.parseConfig(config);
    if (Proj4js) {
      Proj4js.libPath = baseDir+"/util/proj4js/";
      Proj4js.proxyScript = config.proxyUrl+'?url=';
    }
    config.callListeners("init");
    var mbTimerStop = new Date();
    //alert("load time:"+(mbTimerStop.getTime()-mbTimerStart.getTime()) );
    if (window.mbInit) window.mbInit();
    config.callListeners("loadModel");
  }
}

/** Timer used when checking if scripts have loaded. */
var mbTimerId;

/**
 * Mapbuilder's main initialisation script.
 * This should be called from the main html file using:
 *   <body onload="mbDoLoad()">
 * @param initFunction Optional - A function reference that will be called after 
 * config.init() has been called.  This is to give application code a chance to
 * do initialization and be guaranteed that all objects exist (inlcuding config).
 */
function mbDoLoad(initFunction) {
  // See if scripts have been loaded every 100msecs, then call config.init().
  mbTimerId=window.setInterval('mapbuilderInit()',100);
  if (initFunction) window.mbInit = initFunction;
}
