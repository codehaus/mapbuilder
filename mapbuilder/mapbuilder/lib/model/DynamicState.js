/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores variables that change dynamically, like the mouse position on a map, and
 * notifies listeners when it changes.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @requires Sarissa
 */
function DynamicState() {

  // ===============================
  // Dynamic Parameters
  // ===============================
  /**
   * The Area Of Interest being selected by mouseDrag in geographic coordinates
   * (xmin,ymin,xmax,ymax).
   */
  this.aoiBox = new Array(0,0,0,0);
  this.aoiBoxValid=false;

  /** The mousePosition in geographic coordinates (x,y). **/
  this.mousePosition=new Array(0,0);
  this.mousePositionValid=false;

  // ===============================
  // Arrays of Listeners
  // ===============================

  /** Functions to call when the Area Of Interest changes. */
  this.aoiBoxListeners=new Array();

  // ===============================
  // Add Listener Functions
  // ===============================
  /**
   * Add a Listener for AoiBox change.
   * @param listener The function to call when the Area Of Interest changes.
   * @param target The object which owns the listener function.
   */
  this.addAoiBoxListener=function(listener,target) {
    this.aoiBoxListeners[this.aoiBoxListeners.length]=
      new Array(listener,target);
  }


  // ===============================
  // Update Parameters
  // ===============================

  /**
   * Get the Area Of Interest being dragged by a mouse.
   * @return AoiBox array in form (xmin,ymin,xmax,ymax), or null if AoiBox is not
   * being selected.
   */
  this.getAoiBox=function() {
    // Extract AoiBox from the context
    if (this.aoiBoxValid){
      return this.aoiBox;
    } else {
      return null;
    }
  }

  /**
   * Set the Area Of Interest and notify intererested widgets that AoiBox has
   * changed.
   * @param aoiBox array in form (xmin, ymin, xmax, ymax).
   */
  this.setAoiBox=function(aoiBox) {
    this.aoiBox=aoiBox;
    this.aoiBoxValid=true;
    for (var i=0; i<this.aoiBoxListeners.length; i++) {
      this.aoiBoxListeners[i][0](
        this.aoiBoxListeners[i][1]);
    }
  }

  /**
   * Set the Area Of Interest to invalid - this should be called after the mouse
   * has finished dragging.
   */
  this.setAoiBoxInvalid=function() {
    this.aoiBoxValid=false;
    for (var i=0; i<this.aoiBoxListeners.length; i++) {
      this.aoiBoxListeners[i][0](
        this.aoiBoxListeners[i][1]);
    }
  }
}
