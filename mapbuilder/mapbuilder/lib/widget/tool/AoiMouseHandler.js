/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tool to draw a region of interest box on a view.  The box can be drawn with
 * the drawBox() method and can be tied to mouse drag with the dragBox() method.
 * This object works entirely in pixel/line coordinate space and knows nothing
 * about geography.
 *
 * @constructor
 *
 * @param viewNode    the view object node to attach the RoiBox to.
 */

function AoiMouseHandler(toolNode, parentWidget) {
  this.model = parentWidget.model;

  this.mouseUpHandler = function( targetNode, objRef ) {
    if (objRef.started) objRef.started = false;
  }

  this.mouseDownHandler = function( objRef,targetNode ) {
    objRef.start(targetNode.evpl);
  }

  this.mouseMoveHandler = function( targetNode, objRef ) {
    if (objRef.started) objRef.dragBox(targetNode.evpl);
  }

/** called for starting a drag operation
  * @param evpl    the coordinates to start the box at
  * @return        none
  */
  this.start = function(evpl) {
    this.anchorPoint = evpl;
    this.dragBox( evpl );
    this.started = true;
  }

/** Change the coordinate of one corner of the box.  The initial upper left 
  * corner point stays fixed. 
  * @param evpl    new corner coordinate
  * @return        none
  */
  this.dragBox = function( evpl ) {	
    var ul = new Array();
    var lr = new Array();
    if (this.anchorPoint[0] > evpl[0]) {
      ul[0] = evpl[0];
      lr[0] = this.anchorPoint[0];
    } else {
      ul[0] = this.anchorPoint[0];
      lr[0] = evpl[0];
    }
    if (this.anchorPoint[1] > evpl[1]) {
      ul[1] = evpl[1];
      lr[1] = this.anchorPoint[1];
    } else {
      ul[1] = this.anchorPoint[1];
      lr[1] = evpl[1];
    }

    //set new AOI in context
    this.model.setAoi( ul, lr );
  }

  parentWidget.addListener('mousedown',this.mouseDownHandler,this);
  parentWidget.addMouseListener('mouseMove', this.mouseMoveHandler, this );
  parentWidget.addMouseListener('mouseUp', this.mouseUpHandler, this );
}


