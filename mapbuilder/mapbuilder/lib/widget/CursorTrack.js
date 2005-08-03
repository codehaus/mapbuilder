/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");

/**
 * Widget to display the mouse coordinates when it is over a MapContainer widget.
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function CursorTrack(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  //by default, display coords in latlon; if false show map XY
  this.showXY = false;
  var showXYNode = widgetNode.selectSingleNode("mb:showXY");
  if (showXYNode) this.showXY = (showXYNode.firstChild.nodeValue=="false")?false:true;

  /**
   * Start cursor tracking when the mouse is over the MapContainer.
   * set an interval to output the coords so that it doesn't execute on every
   * move event.  The setInterval method in IE doesn't allow passing of an
   * argument to the function called so set a global reference to MapContainer
   * here;  mouse can only be over one MapContainer at time so this should be safe.
   * @param objRef Pointer to this CurorTrack object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseOverHandler = function(objRef, targetNode) {
    objRef.coordForm = document.getElementById(objRef.formName);
    window.cursorTrackObject = objRef;
    window.cursorTrackNode = targetNode;
    objRef.mouseOver = true;
    objRef.mouseTrackTimer = setInterval( ReportCoords, 100, objRef);
  }

  /**
   * Stop cursor tracking when the mouse leaves the MapContainer.
   * @param objRef Pointer to this CurorTrack object.
   * @param targetNode The node for the enclosing HTML tag for this widget.
   */
  this.mouseOutHandler = function(objRef, targetNode) {
    if (objRef.mouseTrackTimer) clearInterval(objRef.mouseTrackTimer);
    objRef.mouseOver = false;
    objRef.coordForm.longitude.value = "";
    objRef.coordForm.latitude.value = "";
  }

  /**
   * Add mouse event listeners to the MapContainer object sepecified by the
   * mouseHandler property in config.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.init = function(objRef) {
    //associate the cursor track with a mappane widget
    var mouseHandler = widgetNode.selectSingleNode("mb:mouseHandler");
    if (mouseHandler) {
      objRef.mouseHandler = eval("config.objects."+mouseHandler.firstChild.nodeValue);
      objRef.mouseHandler.addListener('mouseover', objRef.mouseOverHandler, objRef);
      objRef.mouseHandler.addListener('mouseout', objRef.mouseOutHandler, objRef);
    } else {
      alert('CursorTrack requires a mouseHandler property');
    }
    if (!objRef.showXY) objRef.proj = new Proj( objRef.model.getSRS() );
  }
  this.model.addListener("loadModel", this.init, this );


  //set some properties for the form output
  this.formName = "CursorTrackForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);

}

/**
 * A method which actually outputs the coordinates to the form.  This is a
 * global method because it is called by a Javascript setInterval timer.
 */
function ReportCoords() {
  var objRef = window.cursorTrackObject;
  if (objRef.mouseOver) {
    var evxy = objRef.model.extent.getXY( window.cursorTrackNode.evpl );
    if (!objRef.showXY) evxy = objRef.proj.Inverse( evxy );   //convert to lat/long
    objRef.coordForm.longitude.value = Math.round(evxy[0]*100)/100;
    objRef.coordForm.latitude.value = Math.round(evxy[1]*100)/100;
  }
}
