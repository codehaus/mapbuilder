/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Functions to render and update a Legend from a Web Map Context.
 * This widget extends WidgetBase.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @constructor
 * @requires Context
 * @requires Sarissa
 * @requires Util
 * @requires WidgetBase
 * @param widgetNode The Widget's XML object node from the configuration
 *   document.
 * @param model The ModelGroup XML object from the configuration
 *   document that this widget will update.
 */
function Legend(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  this.stylesheet.setParameter("modelId", model.id );

  /**
   * Called when the context's hidden attribute changes.
   * @param layerIndex The index of the LayerList/Layer from the Context which
   * has changed.
   * @param target This object.
   */
   this.hiddenListener=function(layerIndex,target){
    // TBD check/uncheck Layer's selected box
  }
 
  /**
   * Initialise the widget after the widget tags have been created by the first paint().
   */
  this.postPaintInit = function() {
    this.model.addListener("hidden",this.hiddenListener,this);
  }
}
