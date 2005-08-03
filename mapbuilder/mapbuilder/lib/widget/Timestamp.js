/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Adds a timstamp listener to show the curretn timestamp value in a form.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function Timestamp(toolNode, model) {
  var base = new WidgetBase(this, toolNode, model);

  this.updateTimestamp = function (objRef, timestamp) {
    var inputEl = document.getElementById("timestampValue");
    inputEl.value = objRef.model.timestampList.childNodes[timestamp].firstChild.nodeValue;
  }

  this.model.addListener("timestamp",this.updateTimestamp, this);
}


