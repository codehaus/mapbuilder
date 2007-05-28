/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id: PostalCodeForm.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/FormBase.js");

/**
 * Widget to display the AOI box coordinates
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function PostalCodeForm(widgetNode, model) {
  FormBase.apply(this,new Array(widgetNode, model));

}

/**
 * Handles submission of the form (via javascript in an <a> tag)
 */
PostalCodeForm.prototype.submitForm = function() {
  var thisWidget = this.parentWidget;

  //create the http GET URL
  var webServiceUrl = thisWidget.webServiceUrl + "?";
  webServiceUrl += (webServiceUrl.indexOf('?')<0)?"?":"&";
  for (var i=0; i<this.elements.length; ++i) {
    var element = this.elements[i];
    webServiceUrl += element.name + "=" + escape(element.value) + "&";
  }
  mbDebugMessage(thisWidget, webServiceUrl);
  config.loadModel( thisWidget.targetModel.id, webServiceUrl);
  return false;
}
