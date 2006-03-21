/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: $
*/
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");

function GmlLayer(model, mapPane, layerName, layerNode, queryable, visible) {
  MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));

}

GmlLayer.prototype.paint = function( objRef, img ) {
}