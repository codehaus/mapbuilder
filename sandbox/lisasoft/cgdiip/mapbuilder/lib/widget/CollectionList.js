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
 * @base WidgetBaseXSL
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
    objRef.srs = objRef.targetModel.getSRS();
    objRef.scale = objRef.targetModel.map.getScale();
   
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

    var bbox = objRef.extent.toBBOX().split(/,/);  
    if (objRef.targetModel.getSRS().toUpperCase() != objRef.srs.toUpperCase()) {
      var targetProj = new Proj(objRef.targetModel.getSRS());
      var srcProj = new Proj(objRef.srs);
    	var ptLL=new PT(bbox[0],bbox[1]);
    	var ptUR=new PT(bbox[2],bbox[3]);
  		cs_transform(srcProj, targetProj, ptLL);
	    cs_transform(srcProj, targetProj, ptUR);
      objRef.extent = new OpenLayers.Bounds(ptLL.x, ptLL.y, ptUR.x, ptUR.y);
    }
    if (objRef.targetModel.map.getExtent().containsBounds(objRef.extent, false, false)) {
      objRef.targetModel.map.zoomToExtent(objRef.extent);
      if (objRef.targetModel.map.getScale() > objRef.scale) {
        objRef.targetModel.map.zoomIn();
      }
    }
  }
}
