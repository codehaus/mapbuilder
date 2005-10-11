/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
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

	

	
  this.model.historyList = new Array();
  this.active = -1; //This is to make sure the historyList[0] is also accessible
  
  /**
   * This adds the current extent to the historyList
   * @param objRef  pointer to this object.
   */
  this.add = function(objRef) {
    place = objRef.active;
    list = objRef.model.historyList;
    newExtent = new Array();
    newExtent[0] = objRef.model.extent.ul;
    newExtent[1] = objRef.model.extent.lr;

    if(place==(list.length-1)) { //If we are already at the end of the list add a new item
      list.push(newExtent); 
      place = place+1; 
    }
    else { //If we are somewhere in the middle of the list clear the rest of the list and add a new item
      place = place+1;
      list = list.slice(0,place);
      list.push(newExtent);
    }
    objRef.active = place;
    objRef.model.historyList = list;
  }

  /**
   * This returns the previous extent in the list
   * @param objRef  pointer to this object.
   */

  this.back = function(objRef){
    place = objRef.active;
    if(place<1) {
      alert("You can't go further back");
    }
    else {
      place = place -1;
      objRef.active = place;
      objRef.model.previousExtent = objRef.model.historyList[place];
    }

  }
  /**
   * This returns the next extent in the list
   * @param objRef  pointer to this object.
   */
  this.forward = function(objRef) {
    place = objRef.active;
    if(place<(objRef.model.historyList.length-1)) {
      place = place +1;
      objRef.active = place;
      objRef.model.nextExtent = objRef.model.historyList[place];
    }
    else {
      alert("You can't go further forward");
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

	

	this.model.addListener("bbox", this.add, this);

	this.model.addListener("historyBack", this.back, this);

	this.model.addListener("historyForward", this.forward, this);

	this.model.addListener("historyStart", this.start, this);

	this.model.addListener("historyStop", this.stop, this);
}

  
  
