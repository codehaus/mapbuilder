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

function CursorTrack(toolNode, parentWidget) {
  this.node = document.getElementById( parentWidget.containerId );
  this.proj = new Proj( parentWidget.model.getSRS() );
  var formName = toolNode.selectSingleNode("formName").firstChild.nodeValue;
  this.coordForm = document.getElementById(formName);

  /**
   * Process a mouse action.
   * set an interval to output the coords so that it doesn't execute on every
   * move event.  The setInterval method in IE doesn't allow passing of an
   * argument to the function called so set a global reference to glass pane
   * here;  mouse can only be over one glass pane at time so this should be safe.
   * @param objRef Pointer to this CurorTrack object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
   this.mouseOverHandler = function(objRef,targetNode) {
    window.cursorTrackObject = objRef;
    window.cursorTrackNode = targetNode;
    objRef.mouseTrackTimer = setInterval( ReportCoords, 100, objRef);
  }

  this.mouseOutHandler = function( targetNode, objRef ) {
    if (objRef.mouseTrackTimer) clearInterval(objRef.mouseTrackTimer);
  }

  parentWidget.addListener('mouseover',this.mouseOverHandler,this);
  parentWidget.addMouseListener('mouseOut', this.mouseOutHandler, this );
}

function ReportCoords(objRef) {
    objRef = window.cursorTrackObject;
    var evll = objRef.proj.Inverse( window.cursorTrackNode.evxy );
    objRef.coordForm.longitude.value = Math.round(evll[0]*100)/100;
    objRef.coordForm.latitude.value = Math.round(evll[1]*100)/100;
}




