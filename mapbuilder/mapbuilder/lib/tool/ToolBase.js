/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Button object that all Buttons extend.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function ToolBase(toolNode, parentWidget) {
  this.parentWidget = parentWidget;

  this.title = toolNode.selectSingleNode("tooltip").firstChild.nodeValue;
  this.id = toolNode.selectSingleNode("@id").firstChild.nodeValue;

  //pre-load the button bar images; add them to the config
  this.disabledImage = document.createElement("IMG");
  this.disabledImage.src = config.skinDir + toolNode.selectSingleNode("disabledSrc").firstChild.nodeValue;
  this.disabledImage.title = this.title;         //img.title is for tool tips, alt for images disabled browsers

  var modalImage = toolNode.selectSingleNode("enabledSrc");
  if (modalImage) {
    this.enabledImage = document.createElement("IMG");
    this.enabledImage.src = config.skinDir + modalImage.firstChild.nodeValue;
    this.enabledImage.title = this.title;         //img.title is for tool tips, alt for images disabled browsers
  }

  /**
   * TBD Document me.
   * @param objRef TBD Document me.
   */
  this.init = function(objRef) {
    objRef.image = document.getElementById( objRef.id );
    if ( objRef.parentWidget.mouseWidget==null ) {
      objRef.image.model = objRef.model;
      objRef.image.onmouseup = objRef.mouseUpHandler;
    }
    objRef.image.title = objRef.title; //img.title is for tool tips, alt for images disabled browsers
  }
}
