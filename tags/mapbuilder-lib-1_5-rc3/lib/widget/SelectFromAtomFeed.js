/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: SelectFromAtomFeed.js 3888 2008-02-27 18:25:45Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * A widget which displays a list of atom elements to select from. The
 * selected element's URL is loaded as a model, usually a context model.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */

function SelectFromAtomFeed(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Switch to another model (usually a map context).
   * This function is called from SelectFromAtomFeed.xsl
   * @param objRef this widget
   * @modelUrl the URL of the XML we want to switch to.
   */
  SelectFromAtomFeed.prototype.switchModel=function(objRef, modelUrl) {
    config.loadModel( this.targetModel.id, modelUrl );
  }
}
