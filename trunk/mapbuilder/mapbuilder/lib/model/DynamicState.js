/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores variables that change dynamically, like the mouse position on a map, and
 * notifies listeners when it changes.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @author Cameron Shorter cameronATshorter.net
 */
function DynamicState() {

  // ===============================
  // Dynamic Parameters
  // ===============================
  /** Start of an AOI drag box.*/
  this.aoiAnchorPoint=new Array(0,0);
  /** End of an AOI drag box.*/
  this.aoiToPoint=new Array(0,0);
  /** True if the AOI is currently being selected.*/
  this.aoiValid=false;

  /** The mousePosition in geographic coordinates (x,y). **/
  this.mousePosition=new Array(0,0);
  /** True if the mouse is over the mapImage. */
  this.mousePositionValid=false;

  // ===============================
  // Arrays of Listeners
  // ===============================

  /** Functions to call when the Area Of Interest changes. */
  this.aoiListeners=new Array();

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
  this.addAoiListener=function(listener,target) {
    this.aoiListeners[this.aoiListeners.length]=
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
   * @return Aoi array in form ((xmin,ymin),(xmax,ymax)), or null
   * if Aoi is not being selected.
   */
  this.getAoi=function() {
    if (this.aoiValid){
      var minPoint=new Array(
        Math.min(aoiAnchorPoint[0],aoiToPoint[0]),
        Math.min(aoiAnchorPoint[1],aoiToPoint[1]));
      var maxPoint=new Array(
        Math.max(aoiAnchorPoint[0],aoiToPoint[0]),
        Math.max(aoiAnchorPoint[1],aoiToPoint[1]));
      return new Array(minPoint,maxPoint);
    } else {
      return null;
    }
  }

  /**
   * Start building an Area Of Interest, initially just a point, an event is
   * not sent until the EndPoint has been set.
   * @param anchorPoint The starting point of an Aoi as an (x,y) array.
   */
  this.setAoiAnchorPoint=function(anchorPoint) {
    this.aoiAnchorPoint=anchorPoint;
    this.aoiToPoint=anchorPoint;
    this.aoiValid=false;
  }

  /**
   * Set the end point for an Area Of Interest Box and call aoiListeners,
   * note that the end point will be called numerous times as a mouse is dragged.
   * @param anchorPoint The toPoint of an Aoi as an (x,y) array.
   */
  this.setAoi=function(toPoint) {
    this.aoiToPoint=toPoint;
    this.aoiValid=true;
    for (var i=0; i<this.aoiListeners.length; i++) {
      this.aoiListeners[i][0](
        this.aoiListeners[i][1]);
    }
  }

  /**
   * Set the Area Of Interest to invalid - this should be called after the
   * mouse has finished dragging.
   */
  this.setaoiInvalid=function() {
    this.aoiValid=false;
    for (var i=0; i<this.aoiListeners.length; i++) {
      this.aoiListeners[i][0](this.aoiListeners[i][1]);
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
