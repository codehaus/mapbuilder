/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");

/**
 * Widget to display the mouse coordinates when it is over a sibling mappane
 * widget.
 *
 * @constructor
 *
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function CursorTrack(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Start cursor tracking when the mouse is over the mappane.
   * set an interval to output the coords so that it doesn't execute on every
   * move event.  The setInterval method in IE doesn't allow passing of an
   * argument to the function called so set a global reference to glass pane
   * here;  mouse can only be over one glass pane at time so this should be safe.
   * @param objRef Pointer to this CurorTrack object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseOverHandler = function(objRef, targetNode) {
    objRef.coordForm = document.getElementById(objRef.formName);
    window.cursorTrackObject = objRef;
    window.cursorTrackNode = targetNode;
    objRef.mouseTrackTimer = setInterval( ReportCoords, 100, objRef);
  }

  /**
   * Stop cursor tracking when the mouse is over the mappane.
   * @param objRef Pointer to this CurorTrack object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseOutHandler = function(objRef, targetNode) {
    if (objRef.mouseTrackTimer) clearInterval(objRef.mouseTrackTimer);
  }

  //associate the cursor track with a mappane widget
  var mouseWidget = widgetNode.selectSingleNode("mouseWidget");
  if (mouseWidget) {
    this.mouseWidget = eval(mouseWidget.firstChild.nodeValue);
    this.mouseWidget.addListener('mouseover', this.mouseOverHandler, this);
    this.mouseWidget.addListener('mouseout', this.mouseOutHandler, this);
  } else {
    alert('CursorTrack requires a mouseWidget property');
  }
  
  //set some properties for the form output
  this.proj = new Proj( model.getSRS() );
  this.formName = "CursorTrackForm_" + UniqueId();
  this.stylesheet.setParameter("formName", this.formName);

}

/** Update the lat/long coordinates in coordForm. */
function ReportCoords() {
    objRef = window.cursorTrackObject;
    var evll = objRef.proj.Inverse( window.cursorTrackNode.evxy );
    objRef.coordForm.longitude.value = Math.round(evll[0]*100)/100;
    objRef.coordForm.latitude.value = Math.round(evll[1]*100)/100;
}