/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/


/**
 * A tool designed to store the history of the extent during a session
 *
 * @constructor
 * @param model the model document that this history represent
 */
function History( model ) {
  this.model = model;
  this.id = model.id + "_MbHistory" + mbIds.getId();
  this.historyList = new Array();
  this.active = -1;
  

  /**
   * This adds the current extent to the historyList
   * @param objRef  pointer to this object.
   */
  this.add = function(objRef) {
    place = objRef.active;
    list = objRef.historyList;
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
    objRef.historyList = list;
  }

  /**
   * This returns the previous extent in the list
   * @param objRef  pointer to this object.
   */

  this.back = function(objRef){
    place = this.active;
    if(place<1) {
      alert("You can't go further back");
    }
    else {
      place = place -1;
      this.active = place;
      this.previousExtent = objRef.targetModel.history.historyList[place];
      return this.previousExtent;
    }

  }
  /**
   * This returns the next extent in the list
   * @param objRef  pointer to this object.
   */
  this.forward = function(objRef) {
    place = this.active;
    if(place<(this.historyList.length-1)) {
      place = place +1;
      this.active = place;
      nextExtent = this.historyList[place];
      return nextExtent;
    }
    else {
      alert("You can't go further forward");
    }
  }

  this.model.addListener("bbox",this.add, this);

  /**
   * This stops the listener, to prevent the undo/redo steps to appear in the list
   * @param objRef  pointer to this object.
   */
  this.stop = function(objRef) {
    this.model.removeListener("bbox",this.add, this);
  }
  
  /**
   * This restarts the listener after undo/redo is done.
   * @param objRef  pointer to this object.
   */
  this.start = function(objRef) {
    this.model.addListener("bbox",this.add, this);
  }
}

  
  
