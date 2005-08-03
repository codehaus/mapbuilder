/*

Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca

License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html



$Id$

*/



// Ensure this object's dependancies are loaded.

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");



/**

 * Widget which will display some anchor tags for accessing model URLs.  

 * TBD: which is the prefered method to use here, 

 *

 * @constructor

 * @base WidgetBase

 * @param widgetNode This widget's object node from the configuration document.

 * @param model The model that this widget is a view of.

 */



function SaveModel(widgetNode, model) {

  var base = new WidgetBase(this, widgetNode, model);



  /**

   * a listenet to set the saved model URL as the href attribute in an anchor link 

   * @param objRef Pointer to this SaveModel object.

   */

  this.saveLink = function(objRef, fileUrl) {

    var modelAnchor = document.getElementById(objRef.model.id+"."+objRef.id+".modelUrl");

    modelAnchor.href = fileUrl;

  }

  this.model.addListener("modelSaved", this.saveLink, this);



}



