/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id: Timer.js 2546 2007-01-23 12:07:39Z gjvoosten $
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

  //set the interval
  var seconds = toolNode.selectSingleNode("mb:every");
  if (seconds) {
    this.delay = 1000*seconds.firstChild.nodeValue;
  } else {
    this.delay = 1000*30; //milliseconds - defaults to every half hour
  }	
  
  //set the event to be fired
  var eventName = toolNode.selectSingleNode("mb:eventName");
  if (eventName) {
    this.eventName = eventName.firstChild.nodeValue;
  } else {
    this.eventName = "reloadModel"; //default event is to reload the model
  }	
  
  //set the value to be passed with the event
  var eventValue = toolNode.selectSingleNode("mb:eventValue");
  if (eventValue) {
    this.eventValue = eventValue.firstChild.nodeValue;
  } else {
    this.eventValue = null; //default eventValue is null
  }	
  
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
  this.autoStart = true;
  var autoStart = toolNode.selectSingleNode("mb:autoStart");
  if (autoStart && autoStart.firstChild.nodeValue=="false") this.autoStart = false;
  this.startOnLoad = function(objRef) {
    if (objRef.autoStart) objRef.play();
  }
  this.model.addListener("init",this.startOnLoad, this);
  
}



