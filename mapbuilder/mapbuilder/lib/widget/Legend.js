/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Functions to render and update a Legend from a Web Map Context.
 * This widget extends WidgetBase.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @constructor
 * @requires Sarissa
 * @requires Util
 * @requires Context
 * @param context The Web Map Context which contains the state of this legend.
 * @param name Variable name referencing this Legend object
 * @param node Node from the HTML DOM to insert legend HTML into.
 * @see WidgetBase
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
 
  this.addListeners = function() {
    this.model.addListener("hidden",this.hiddenListener,this);
  }
}
