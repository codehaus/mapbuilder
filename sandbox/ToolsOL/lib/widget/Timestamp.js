/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Timestamp.js 1671 2005-09-20 02:37:54Z madair1 $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Adds a timstamp listener to show the curretn timestamp value in a form.
 * @constructor
 * @base WidgetBaseXSL
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function Timestamp(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.updateTimestamp = function (objRef, timestamp) {
    var inputEl = document.getElementById("timestampValue");
    inputEl.value = objRef.model.timestampList.childNodes[timestamp].firstChild.nodeValue;
  }

  this.model.addListener("timestamp",this.updateTimestamp, this);
}


