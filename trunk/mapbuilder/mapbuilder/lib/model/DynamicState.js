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
   * The Area Of Interest being selected by mouseDrag in geographic coordinates.
   */
  this.aoiBoxStartX=0;
  this.aoiBoxStartY=0;
  this.aoiBoxEndX=0;
  this.aoiBoxEndY=0;
  this.aoiBoxValid=false;

  /** The mousePosition in geographic coordinates (x,y). **/
  this.mousePosition=new Array(0,0);
  this.mousePositionValid=false;

  // ===============================
  // Arrays of Listeners
  // ===============================

  /** Functions to call when the Area Of Interest changes. */
  this.aoiBoxListeners=new Array();

  /** Functions to call when the mousePosition changes. */
  this.mousePositionListeners=new Array();

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

  /**
   * Add a Listener for MousePosition change.
   * @param listener The function to call when the Area Of Interest changes.
   * @param target The object which owns the listener function.
   */
  this.addMousePositionListener=function(listener,target) {
    this.mousePositionListeners[this.mousePositionListeners.length]=
      new Array(listener,target);
  }


  // ===============================
  // Update Parameters
  // ===============================

  /**
   * Get the Area Of Interest being dragged by a mouse.
   * @return AoiBox array in form (xmin,ymin,xmax,ymax), or null if AoiBox is not
   * being selected.
   * TBD.  This function could be simplified with max() and min() functions.
   */
  this.getAoiBox=function() {
    // Extract AoiBox from the context
    if (this.aoiBoxValid){
      var aoiBox=new Array();
      if (this.aoiBoxStartX<this.aoiBoxEndX){
        aoiBox[0]=aoiBoxStartX;
        aoiBox[3]=aoiBoxEndX;
      }else{
        aoiBox[0]=aoiBoxEndX;
        aoiBox[3]=aoiBoxStartX;
      }
      if (this.aoiBoxStartY<this.aoiBoxEndY){
        aoiBox[2]=aoiBoxStartY;
        aoiBox[4]=aoiBoxEndY;
      }else{
        aoiBox[2]=aoiBoxEndY;
        aoiBox[4]=aoiBoxStartY;
      }
      return aoiBox;
    } else {
      return null;
    }
  }

  /**
   * Start building an Area Of Interest, initially just a point, an event is
   * not sent until the EndPoint has been set.
   * @param x The starting point of an AoiBox.
   * @param y The starting point of an AoiBox.
   */
  this.setStartAoiBox=function(x,y) {
    this.aoiBoxStartX=x;
    this.aoiBoxStartY=y;
    this.aoiBoxValid=false;
  }

  /**
   * Set the end point for an Area Of Interest Box and call AoiBoxListeners,
   * note that the end point will be called numerous times as a mouse is dragged.
   * @param x The end point of an AoiBox.
   * @param y The end point of an AoiBox.
   */
  this.setEndAoiBox=function(x,y) {
    this.aoiBoxEndX=x;
    this.aoiBoxEndY=y;
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

  /**
   * Get the MousePosition being dragged by a mouse.
   * @return MousePosition array in form (x,y), or null if
   * MousePosition is not being selected.
   */
  this.getMousePosition=function() {
    // Extract MousePosition from the context
    if (this.mousePositionValid){
      return this.mousePosition;
    } else {
      return null;
    }
  }

  /**
   * Set the MousePosition and notify intererested widgets that
   * mousePosition has changed.
   * @param mousePosition array in form (x,y).
   */
  this.setMousePosition=function(mousePosition) {
    this.mousePosition=mousePosition;
    this.mousePositionValid=true;
    for (var i=0; i<this.mousePositionListeners.length; i++) {
      this.mousePositionListeners[i][0](
        this.mousePositionListeners[i][1]);
    }
  }

  /**
   * Set the Area Of Interest to invalid - this should be called after the mouse
   * has finished dragging.
   */
  this.setMousePositionInvalid=function() {
    this.mousePositionValid=false;
    for (var i=0; i<this.mousePositionListeners.length; i++) {
      this.mousePositionListeners[i][0](
        this.mousePositionListeners[i][1]);
    }
  }
}
