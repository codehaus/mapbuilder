/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Functions to render and update a Legend from a Web Map Context.
 * @constructor
 * @base WidgetBaseXSL
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function Legend(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Override of widget prepaint to set some stylesheet parameters including 
   * featureName (for OWS Context) and hidden attribute.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    if (objRef.model.featureName) {
      objRef.stylesheet.setParameter("featureName", objRef.model.featureName );
      objRef.stylesheet.setParameter("hidden", objRef.model.getHidden(objRef.model.featureName).toString() );
    }
  }

  /**
   * @param objRef Pointer to this object.
   * @param layer The selected layer.
   */
  this.selectLayer = function(objRef,layer) {
    objRef.model.setParam('selectedLayer',layer);
  }

  this.model.addListener("deleteLayer",this.paint, this);
  this.model.addListener("moveLayerUp",this.paint, this);
  this.model.addListener("moveLayerDown",this.paint, this);
  this.model.addListener("addLayer",this.paint, this);
}
