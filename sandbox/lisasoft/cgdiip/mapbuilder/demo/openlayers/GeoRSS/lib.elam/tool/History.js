/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: History.js 2956 2007-07-09 12:17:52Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");


/**
 * A tool designed to store the history of the extent during a session
 *
 * @constructor
 * @base ToolBase
 * @param toolNode  The node for this tool from the configuration document.
 * @param model     The model object that contains this tool
 */
function History(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));

  /**
   * Inititialising the history and setting start parameters
   * @param objRef  pointer to this object.
   */

	this.init = function(objRef) {
		objRef.model.active = -1;
    objRef.model.historyList = new Array();
    objRef.add(objRef);
  }

  /**
   * This adds the current extent to the historyList
   * @param objRef  pointer to this object.
   */
  this.add = function(objRef) {
    if (objRef.model.active!=null) {
      var place = objRef.model.active;
      var list = objRef.model.historyList;
      var center = objRef.targetModel.map.getExtent().getCenterLonLat();
      // take the current scale -1, otherwise we get troubles when
      // fixed scales are defined
      var scale = objRef.targetModel.map.getScale()-1;
      if (place > -1) {
        // check if current and previous history entry would result
        // in same center point and zoom level. If this is the case,
        // we do not want a new entry in the list
        if (center.toString() == list[place].center.toString() &&
            scale == list[place].scale) {
          return;
        }
      }
      var newExtent = new Object({center:center, scale:scale});

      if( place==(list.length-1)) { //If we are already at the end of the list add a new item
        list.push(newExtent); 
        place = place+1; 
      }
      else { //If we are somewhere in the middle of the list clear the rest of the list and add a new item
        place = place+1;
        list = list.slice(0,place);
        list.push(newExtent);
      }
      objRef.model.active = place;
      objRef.model.historyList = list;
    }
  }

  /**
   * This returns the previous extent in the list
   * @param objRef  pointer to this object.
   */

  this.back = function(objRef){
    var place = objRef.model.active;
    if(place<1) {
      objRef.model.previousExtent = null;
      alert(mbGetMessage("cantGoBack"));
    }
    else {
      place = place -1;
      objRef.model.active = place;
      objRef.model.previousExtent = objRef.model.historyList[place];
    }

  }
  /**
   * This returns the next extent in the list
   * @param objRef  pointer to this object.
   */
  this.forward = function(objRef) {
    var place = objRef.model.active;
    if(place<(objRef.model.historyList.length-1)) {
      place = place +1;
      objRef.model.active = place;
      objRef.model.nextExtent = objRef.model.historyList[place];
    }
    else {
      objRef.model.nextExtent = null;
      alert(mbGetMessage("cantGoForward"));
    }
  }

  /**
   * This stops the listener, to prevent the undo/redo steps to appear in the list
   * @param objRef  pointer to this object.
   */
  this.stop = function(objRef) {
    objRef.model.removeListener("bbox",objRef.add, objRef);
  }
  
  /**
   * This restarts the listener after undo/redo is done.
   * @param objRef  pointer to this object.
   */
  this.start = function(objRef) {
    objRef.model.addListener("bbox",objRef.add, objRef);
  }
  /**
    * Set the loadModel listener in response to the init event
    * @param objRef pointer to this object.
    */
  this.initReset = function(objRef) {
    objRef.targetModel.addListener("bbox", objRef.add, objRef);
    objRef.targetModel.addListener("loadModel", objRef.init, objRef);
	}

	this.model.addListener("historyBack", this.back, this);
	this.model.addListener("historyForward", this.forward, this);
	this.model.addListener("historyStart", this.start, this);
	this.model.addListener("historyStop", this.stop, this);
	this.model.addListener("init", this.initReset, this);
}