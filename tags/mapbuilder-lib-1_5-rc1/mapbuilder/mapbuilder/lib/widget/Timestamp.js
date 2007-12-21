/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
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

  //set some properties for the form output
  this.formName = "TimestampForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);

  this.updateTimestamp = function (objRef, timestamp) {
    var form = document[objRef.formName];
    if (form) {
      form.timestampValue.value = objRef.model.timestampList.childNodes[timestamp].firstChild.nodeValue;
    }
  }

  this.model.addListener("timestamp",this.updateTimestamp, this);
}


