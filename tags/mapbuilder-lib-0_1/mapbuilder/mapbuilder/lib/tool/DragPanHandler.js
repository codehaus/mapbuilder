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
   * Process the mouseup action.  This will reset the AOI on the model
   * @param objRef Pointer to this DragPanHandler object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseUpHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.dragging) {
        objRef.dragging = false;

        //set new AOI in context
        var width = objRef.model.getWindowWidth();
        var height = objRef.model.getWindowHeight();
        var ul = new Array( -objRef.deltaP, -objRef.deltaL);  //(0,0) was the original ul AOI 
        var lr = new Array( width-objRef.deltaP, height-objRef.deltaL);  //(w,h) was the original lr AOI 
        objRef.model.setAoi( ul, lr );
      }
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
   * Process a mousemove action.  This method uses DHTML to move the map layers
   * and sets deltaP and deltaL properties on this tool to be used in mouse up.
   * @param objRef Pointer to this DragPanHandler object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseMoveHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.dragging) {
        objRef.deltaP = targetNode.evpl[0] - objRef.anchorPoint[0];
        objRef.deltaL = targetNode.evpl[1] - objRef.anchorPoint[1];

        //use this form if dragging the container node children
        var images=targetNode.getElementsByTagName("div");
        for(var i=0; i<images.length; i++) {
          var img=images.item(i);
          img.style.left=objRef.deltaP;
          img.style.top=objRef.deltaL;
        }
        
        //use this form if dragging the container node
        //objRef.containerNode.style.left = objRef.deltaP;
        //objRef.containerNode.style.top = objRef.deltaL;

      }
    }
  }

  parentWidget.addListener('mousedown',this.mouseDownHandler,this);
  parentWidget.addListener('mousemove',this.mouseMoveHandler,this);
  parentWidget.addListener('mouseup',this.mouseUpHandler,this);
}


