/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed the targetModel is posted to the serializeUrl.
 * Also defines a listener function for the "modelSaved" event which opens 
 * the serialized document in a new browser window but only
 * if the a popupWindowName property is defined for the button in config.
 *
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode  The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function Save(widgetNode, model) {
  var base = new ButtonBase(this, widgetNode, model);

  /**
   * Calls the targetModel's saveModel() method to serialize the model document.
   * @param objRef      Pointer to this AoiMouseHandler object.
   */
  this.doSelect = function(selected,objRef) {
    if (selected) {
      objRef.targetModel.saveModel(objRef.targetModel);
    }
  }

  /**
   * opens a saved model in a popup window
   * @param objRef Pointer to this SaveModel object.
   */
  this.savedModelPopup = function(objRef, fileUrl) {
    window.open(fileUrl, this.popupWindowName);
  }

  /**
   * set a "modelSaved" listener to call the opoup window opener
   * @param objRef Pointer to this SaveModel object.
   */
  this.initReset = function(objRef) {
    objRef.targetModel.addListener("modelSaved",objRef.savedModelPopup, objRef);
  }

  //if popupWindowName is specified in config, then add a modelSaved listener 
  var popupWindowName = widgetNode.selectSingleNode("mb:popupWindowName");
  if (popupWindowName) {
    this.popupWindowName = popupWindowName.firstChild.nodeValue;
    this.model.addListener("init",this.initReset, this);
  }

}


