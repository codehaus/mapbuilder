/*

Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca

License:      GPL as per: http://www.gnu.org/copyleft/gpl.html



$Id$

*/



// Ensure this object's dependancies are loaded.

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");



/**

 * Widget to display the AOI box coordinates

 *

 * @constructor

 * @base WidgetBase

 * @param widgetNode This widget's object node from the configuration document.

 * @param model The model that this widget is a view of.

 */



function SaveModel(widgetNode, model) {

  var base = new WidgetBase(this, widgetNode, model);



  this.stylesheet.setParameter("modelUrl", this.model.url);

  var serializeUrl = widgetNode.selectSingleNode("mb:serializeUrl");

  if (serializeUrl) {

    this.serializeUrl = serializeUrl.firstChild.nodeValue;

    this.stylesheet.setParameter("serializeUrl", this.serializeUrl);

  }



  /**

   * Refreshes the form onblur handlers when this widget is painted.

   * @param objRef Pointer to this SaveModel object.

   */

  this.saveModel = function() {

    var response = postLoad(this.serializeUrl, this.model.doc);

    response.setProperty("SelectionLanguage", "XPath");

    Sarissa.setXpathNamespaces(response, "xmlns:xlink='http://www.w3.org/1999/xlink'");

    var onlineResource = response.selectSingleNode("//OnlineResource");

    var fileUrl = onlineResource.attributes.getNamedItem("xlink:href").nodeValue;



    var modelAnchor = document.getElementById(this.model.id+"."+this.id+".modelUrl");

    modelAnchor.href = fileUrl;

  }

}



