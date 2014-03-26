/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Timer to fire an event at the specified interval.  Any MapBuilder event name may be used,
 * and the eventValue may be a funtion call which returns the expected value for setParam().
 * @constructor
 * @base ToolBase
 * @author Adair
 * @author Ian Turton
 * @param toolNode The tool node from the config document for this tool
 * @param model  the model object that contains this tool
 */
function Timer(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));

  //delay in milliseconds - defaults to every half hour
  this.delay = 1000*this.getProperty("mb:every", 30);
  
  //set the event to be fired, default event is to reload the model
  this.eventName = this.getProperty("mb:eventName", "reloadModel");
  
  //set the value to be passed with the event, default eventValue is null
  this.eventValue = this.getProperty("mb:eventValue");
  
  /**
   * Starts the timer playing by using a JavaScript timer.
   */
  this.play = function() {
    clearInterval(this.interval);
    var workString = "config.objects."+this.targetModel.id+".setParam('"+this.eventName+"'";
    if (this.eventValue) workString += ","+this.eventValue;
    workString += ")";
  	//alert("about to set timer for "+this.delay+" millisecs: "+workString); 
    this.interval = setInterval(workString,this.delay);
  }

  /**
   * Stops the JavaScript timer.
   */
  this.stop = function() {
    clearInterval(this.interval);
  }

  //the timer can start automatically or not, in which case there should be a call to timer.start() somewhere
  this.autoStart = Mapbuilder.parseBoolean(this.getProperty("mb:autoStart", true));
  this.startOnLoad = function(objRef) {
    if (objRef.autoStart) objRef.play();
  }
  this.model.addListener("init",this.startOnLoad, this);
  
}



