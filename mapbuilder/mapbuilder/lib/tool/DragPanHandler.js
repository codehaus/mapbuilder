/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tool to click and drag a map pane to achieve a recentering of the map
 * This object works entirely in pixel/line coordinate space and knows nothing
 * about geography.
 *
 * @constructor
 *
 */

function DragPanHandler(toolNode, parentWidget) {
  var base = new ToolBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Process a mouse action.
   * @param objRef Pointer to this DragPanHandler object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseUpHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.dragging) objRef.dragging = false;
    }
  }

  /**
   * Process a mouse action.
   * @param objRef Pointer to this DragPanHandler object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseDownHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      objRef.containerNode = document.getElementById( objRef.parentWidget.containerId );
      objRef.dragging = true;
      objRef.anchorPoint = targetNode.evpl;
    }
  }

  /**
   * Process a mouse action.
   * @param objRef Pointer to this DragPanHandler object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseMoveHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.dragging) {
        var xOffset = targetNode.evpl[0] - objRef.anchorPoint[0];
        var yOffset = targetNode.evpl[1] - objRef.anchorPoint[1];

        var images=targetNode.getElementsByTagName("div");
        for(var i=0; i<images.length; i++) {
          var img=images.item(i);
          img.style.left=xOffset;
          img.style.top=yOffset;
        }

        //objRef.containerNode.style.left = xOffset;
        //objRef.containerNode.style.top = yOffset;

      }
    }
  }

  parentWidget.addListener('mousedown',this.mouseDownHandler,this);
  parentWidget.addListener('mousemove',this.mouseMoveHandler,this);
  parentWidget.addListener('mouseup',this.mouseUpHandler,this);
}


