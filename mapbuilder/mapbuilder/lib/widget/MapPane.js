/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Widget to render a map from an OGC context document.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapPane(widgetNode, model) {
  var base = new MapContainerBase(this,widgetNode,model);

  /**
   * Called when the context's hidden attribute changes.
   * @param layerName The Name of the LayerList/Layer from the Context which
   * has changed.
   * @param thisWidget This object.
   * @param layerName  The name of the layer that was toggled.
   */
  this.hiddenListener=function(thisWidget, layerName){
    var vis="visible";
    if(thisWidget.model.getHidden(layerName)=="1"){
      vis="hidden";
    }
    var layerId = thisWidget.model.id + "_" + thisWidget.id + "_" + layerName;
    document.getElementById(layerId).style.visibility=vis;
  }
  this.model.addListener("hidden",this.hiddenListener,this);

}
