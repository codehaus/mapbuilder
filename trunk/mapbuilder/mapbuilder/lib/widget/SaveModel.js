/*

Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca

License:      GPL as per: http://www.gnu.org/copyleft/gpl.html



$Id$

*/



// Ensure this object's dependancies are loaded.

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");



/**

 * Save a model to a URL.

 *

 * @constructor

 * @base WidgetBase

 * @param widgetNode This widget's object node from the configuration document.

 * @param model The model that this widget is a view of.

 */



function SaveModel(widgetNode, model) {

  var base = new WidgetBase(this, widgetNode, model);



  /**

   * Initialise params.

   * @param objRef Pointer to this SaveModel object.

   */

  this.init = function(objRef) {

    objRef.stylesheet.setParameter("modelUrl", objRef.model.url);

  }

  this.model.addListener("loadModel", this.init, this);



  /**

   * Refreshes the form onblur handlers when this widget is painted.

   * @param objRef Pointer to this SaveModel object.

   */

  this.saveLink = function(objRef, fileUrl) {

    var modelAnchor = document.getElementById(objRef.model.id+"."+objRef.id+".modelUrl");

    modelAnchor.href = fileUrl;

  }

  //this.model.addListener("modelSaved", this.saveLink, this);



  /**

   * opens a saved model in a new window

   * @param objRef Pointer to this SaveModel object.

   */

  this.savedModelPopup = function(objRef, fileUrl) {

    window.open(fileUrl, "modelXML");

  }

  this.model.addListener("modelSaved", this.savedModelPopup, this);

}



