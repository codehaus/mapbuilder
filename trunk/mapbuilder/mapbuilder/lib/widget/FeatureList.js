/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Functions to render and update a FeatureList from GML.
 * This widget extends WidgetBase.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function FeatureList(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Render this widget.
   * @param widget This widget object.
   */
  this.loadModelListener=function(widget){
    widget.paint(widget);
  }

  this.model.addListener("loadModel",this.loadModelListener,this);
}
