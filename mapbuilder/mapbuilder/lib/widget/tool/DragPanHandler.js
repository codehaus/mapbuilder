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

function DragPanHandler(toolNode, parentWidget) {
  this.model = parentWidget.model;

  /**
   * enable or disable this tool from procesing mouse events.
   * @param enabled   set to true or false to enable or disable
   */
  this.enable = function(enabled) {
    this.enabled = enabled;
  }

  /**
   * Process a mouse action.
   * @param objRef Pointer to this AoiMouseHandler object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseUpHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.dragging) objRef.dragging = false;
    }
  }

  /**
   * Process a mouse action.
   * @param objRef Pointer to this AoiMouseHandler object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseDownHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      objRef.dragging = true;
      objRef.anchorPoint = targetNode.evpl;
      objRef.clipStr = "rect(0px," + targetNode.style.width + "," + targetNode.style.height + ",0px)";
    }
  }

  /**
   * Process a mouse action.
   * @param objRef Pointer to this AoiMouseHandler object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseMoveHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.dragging) {
        var xOffset = targetNode.evpl[0] - objRef.anchorPoint[0];
        var yOffset = targetNode.evpl[1] - objRef.anchorPoint[1];
        //targetNode.widget.moveImages(targetNode.style.left + xOffset, targetNode.style.top + yOffset);
        targetNode.style.left = xOffset;
        targetNode.style.top = yOffset;
        //targetNode.widget.setClip( targetNode.widget );
        targetNode.style.clip = objRef.clipStr;
      }
    }
  }

  parentWidget.addListener('mousedown',this.mouseDownHandler,this);
  parentWidget.addListener('mousemove',this.mouseMoveHandler,this);
  parentWidget.addListener('mouseup',this.mouseUpHandler,this);
}


