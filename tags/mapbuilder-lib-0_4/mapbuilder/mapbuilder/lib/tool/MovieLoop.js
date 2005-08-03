/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Controller for a movie loop.  Set framesPerSec to control the frame rate 
 * and frameIncrement (+n/-n) to control the steps through the loop (n is number
 * of frames to increment.
 * @constructor
 * @base ToolBase
 * @author Adair
 * @param toolNode The tool node from the config document for this tool
 * @param model  the model object that contains this tool
 */
function MovieLoop(toolNode, model) {
  var base = new ToolBase(this, toolNode, model);

  this.frameIncrement = 1;
  this.model.setParam("firstFrame", 0);
  this.timestampIndex = 0;
  window.movieLoop = this;

  //
  var framesPerSecond = toolNode.selectSingleNode("mb:framesPerSecond");
  if (framesPerSecond) {
    this.delay = 1000/framesPerSecond.firstChild.nodeValue;
  } else {
    this.delay = 1000/10; //milliseconds
  }

  //set a limit to the munber of frames to be loaded
  this.maxFrames = 30;
  var maxFrames = toolNode.selectSingleNode("mb:maxFrames");
  if (maxFrames) this.maxFrames = maxFrames.firstChild.nodeValue;

  /**
   * Sets the frame to the specified index in the frame array
   * @param index the 0-based frame index in the frame array
   */
  this.setFrame = function(index) {
    var timestampList = this.model.timestampList;
    if (this.timestampIndex!=null) {
      var timestamp = timestampList.childNodes[this.timestampIndex];
      timestamp.setAttribute("current", "0");
      this.model.setParam("timestamp", this.timestampIndex);
    }
    var firstFrame = this.model.getParam("firstFrame");
    var lastFrame = this.model.getParam("lastFrame");
    if (index > lastFrame) index = firstFrame;
    if (index < firstFrame) index = lastFrame;
    this.timestampIndex = index;
    timestamp = timestampList.childNodes[this.timestampIndex];
    timestamp.setAttribute("current", "1");
    this.model.setParam("timestamp", this.timestampIndex);
  }

  /**
   * Advances the frame array by the frame increment
   * @param step optional parameter to override default frame increment
   */
  this.nextFrame = function(step) {
    var objRef = window.movieLoop;
    var increment = objRef.frameIncrement;
    if (step) increment = step;   //arg passed in overrides default
    objRef.setFrame(objRef.timestampIndex + increment);
  }

  /**
   * Listener fucntion to set the start and end frames based on the 
   * firstFrame and maxFrames property values.
   * @param objRef pointer to this object
   */
  this.setFrameLimits = function(objRef) {
    var timestampList = objRef.model.timestampList;
    //timestampList.firstFrame = objRef.firstFrame;  //set these from a widget, or config
    var firstFrame = objRef.model.getParam("firstFrame");
    var lastFrame = firstFrame+objRef.maxFrames;
    if (lastFrame > timestampList.childNodes.length) lastFrame = timestampList.childNodes.length-1;
    objRef.model.setParam("lastFrame",lastFrame);
    timestampList.childNodes[firstFrame].setAttribute("current","1");
  }
  this.model.addFirstListener("refresh",this.setFrameLimits,this);
  this.model.addListener("firstFrame",this.setFrameLimits,this);

  /**
   * Resets the frame index to the firstFrame property
   * @param objRef pointer to this object
   */
  this.reset = function(objRef) {
    objRef.setFrame(objRef.model.getParam("firstFrame"));
  }
  this.model.addListener("refresh",this.reset,this);

  /**
   * Starts the movie loop playing by using a JavaScript timer.
   */
  this.play = function() {
    this.movieTimer = setInterval('window.movieLoop.nextFrame()',this.delay);
  }
  
  /**
   * Stops the JavaScript movie loop timer.
   */
  this.pause = function() {
    clearInterval(this.movieTimer);
  }
  
  /**
   * Stops the JavaScript movie loop timer and sets the index back to the first 
   * frame.
   */
  this.stop = function() {
    this.pause();
    this.reset(this);
  }

  /**
   * A "stopLoop" event listener to call the stop method
   * @param objRef pointer to this object
   */
  this.stopListener = function(objRef) {
    objRef.stop();
  }
  this.model.addListener("stopLoop",this.stopListener,this);


}

