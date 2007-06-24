/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * A widget to display a list of context docs to pick from.  This is a view of 
 * a Context Collection as specified in the OGC Context specification.
 * The default xsl stylesheet for this widget also uses the switchMap
 * function, which allows to switch to a different map context.
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */

function CollectionList(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Switch to another map context, keeping the current extent.
   * @param objRef this widget
   * @modelUrl the URL of the context we want to switch to.
   */
  this.switchMap = function(objRef, modelUrl) {
    // save the current extent
    objRef.extent = objRef.targetModel.map.getExtent();
   
    objRef.targetModel.addListener( "loadModel", objRef.setExtent, objRef );
    config.loadModel( objRef.targetModel.id, modelUrl );
  }
  
  /**
   * Sets the extent of the map that we just switched to.
   * Called when the map is reloaded with the new context.
   * @param objRef this widget
   */
  this.setExtent = function (objRef) {
    objRef.targetModel.removeListener( "loadModel", objRef.setExtent, objRef );
    objRef.targetModel.map.zoomToExtent(objRef.extent);
  }
}
