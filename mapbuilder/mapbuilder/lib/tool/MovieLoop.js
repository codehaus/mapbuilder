/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
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
 * @param toolNode      The tool node from the config document for this tool
 * @param model  Reference to the widget object that creates this tool
 */
function MovieLoop(toolNode, model) {
  var base = new ToolBase(this, toolNode, model);

  this.frameIncrement = 1;
  this.delay = 100; //milliseconds
  this.timestampIndex = 0;

  this.setFrame = function(index) {
    if (this.timestampIndex!=null) {
      var timestamp = this.model.timestampList.childNodes[this.timestampIndex];
      timestamp.setAttribute("current", "0");
      this.model.setParam("timestamp", this.timestampIndex);
    }
    if (index > this.model.timestampList.childNodes.length-1) {
      index = 0;
    }
    if (index < 0) index = this.model.timestampList.childNodes.length-1;
    this.timestampIndex = index;
    timestamp = this.model.timestampList.childNodes[this.timestampIndex];
    timestamp.setAttribute("current", "1");
    this.model.setParam("timestamp", this.timestampIndex);
  }

  this.nextFrame = function(step) {
    var objRef = window.movieLoop;
    var increment = objRef.frameIncrement;
    if (step) increment = step;   //arg passed in overrides default
    objRef.setFrame(objRef.timestampIndex + increment);
  }

  this.reset = function(objRef) {
    objRef.setFrame(0);
  }
  this.model.addListener("loadModel",this.reset,this);

  this.setIncrement = function() {
  }

  this.play = function() {
    window.movieLoop = this;
    this.movieTimer = setInterval('window.movieLoop.nextFrame()',this.delay);
  }
  
  this.pause = function() {
    clearInterval(this.movieTimer);
  }
  
  this.stop = function() {
    this.pause();
    this.reset(this);
  }

  this.rewind = function() {
    this.reset(this);
  }

}

