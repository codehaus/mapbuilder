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
  ToolBase.apply(this, new Array(toolNode, model));

  this.frameIncrement = 1;
  this.model.setParam("firstFrame", 0);
  this.timestampIndex = 0;
  window.movieLoop = this;
  this.isRunning = false;
  this.frameIsLoading = false;

  //delay in milliseconds
  this.delay = 1000/this.getProperty("mb:framesPerSecond", 10);

  //set a limit to the number of frames to be loaded
  this.maxFrames = this.getProperty("mb:maxFrames", 30);

  /**
   * Sets the frame to the specified index in the frame array
   * @param index the 0-based frame index in the frame array
   */
  this.setFrame = function(index) {
    var timestampList = this.model.timestampList;
    var ts;
    if (this.timestampIndex!=null) {
      var ts = timestampList.childNodes[this.timestampIndex];
      if (ts) {
        ts.setAttribute("current", "0");
        this.model.setParam("timestamp", this.timestampIndex);
      }
    }
    var firstFrame = this.model.getParam("firstFrame");
    var lastFrame = this.model.getParam("lastFrame");
    if (index > lastFrame) index = firstFrame;
    if (index < firstFrame) index = lastFrame;
    this.timestampIndex = index;
    ts = timestampList.childNodes[this.timestampIndex];
    ts.setAttribute("current", "1");
    this.model.setParam("timestamp", this.timestampIndex);
  }

  /**
   * Advances the frame array by the frame increment. 
   * 
   * @param step optional parameter to override default frame increment
   */
  this.nextFrame = function(step) {
    var objRef = window.movieLoop;
    var increment = objRef.frameIncrement;
    if (step) increment = step;   //arg passed in overrides default
    if (!this.frameIsLoading) {
        // play() will continue calling nextFrame, so that 
        // nextFrame() will continually be called at a regular interval, until the current frame is loaded        
        // The 'bug' is that if the user clicks the next button rapidly, subsequent requests will be ignored
        // while the initial frame is loading. This needs to be resolved.
	    objRef.setFrame(objRef.timestampIndex + increment);
	}
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
    objRef.pause();
    objRef.setFrame(objRef.model.getParam("firstFrame"));
  }
  this.model.addListener("loadModel",this.reset,this);
  
  /**
   * initialize the movie loop. This only happens at the first bbox event,
   * which shows us that the map is loaded.
   */
  this.init = function(objRef) {
    //TBD: this is an ugly workaround because we do not have an event that
    // tells us when the OL map finished loading. 
    if (!objRef.initialized) {
      objRef.initialized = true;
      objRef.reset(objRef);
    }
  }
  this.model.addListener("bbox", this.init, this);
  
  /**
   * set the initialized state of the movie loop to false
   */
  this.uninit = function(objRef) {
    objRef.initialized = false;
  }
  this.model.addListener("newModel", this.uninit, this);

  /**
   * Starts the movie loop playing by using a JavaScript timer.
   */
  this.play = function() {
  	if (!this.isRunning) {
	    this.movieTimer = setInterval('window.movieLoop.nextFrame()',this.delay);
	    this.isRunning = true;
	}
  }
  
  /**
   * Stops the JavaScript movie loop timer.
   */
  this.pause = function() {
    this.isRunning = false;
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

