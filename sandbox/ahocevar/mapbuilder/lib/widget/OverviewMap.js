/*
Author:       Gertjan van Oosten gertjan at west dot nl
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to add an OL OverviewMap to a main map.
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function OverviewMap(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  var fixedWidthNode = widgetNode.selectSingleNode("mb:fixedWidth");
  if (fixedWidthNode) {
    this.fixedWidth = new Number(fixedWidthNode.firstChild.nodeValue);
  }

  this.model.addListener("refresh", this.addOverviewMap, this);
}

/**
 * Add an overview map (with just the base layer from the main map)
 * to the map in this widget's model.
 * @param objRef Pointer to widget object.
 */
OverviewMap.prototype.addOverviewMap = function(objRef) {
  if (objRef.model && objRef.model.map) {
    var map = objRef.model.map;

    // Specify div for overview map.
    var options = {
      div: document.getElementById(objRef.htmlTagId)
    };

    // Determine size taking aspect ratio of main map into account.
    // Note that without fixedWidth in config.xml, OL defaults to (180,90).
    if (objRef.fixedWidth) {
      var extent = map.getExtent();
      var size = new OpenLayers.Size(objRef.fixedWidth,
        objRef.fixedWidth * extent.getHeight() / extent.getWidth());
      options.size = size;
    }

    // Add the overview to the main map
    var overview = new OpenLayers.Control.OverviewMap(options);
    map.addControl(overview);
  }
}
