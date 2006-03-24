/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: $
*/

/**
  * Abstract class to define a MapLayer
  */
function MapLayer(model, mapPane, layerName, layerNode, queryable, visible) {
  this.model     = model;
  this.mapPane   = mapPane;
  this.layerName = layerName;
  this.layerNode = layerNode;
  this.queryable = queryable;
  this.visible   = visible;

  /** Multiply this number by the Layer Number to get the zIndex for a layer */
  this.zIndexFactor=500;
}

MapLayer.prototype.paint = function( objRef, img ) {
}

MapLayer.prototype.isWmsLayer = function() {
  return false;
}

/*
MapLayer.prototype.isHidden = function() {
  return !this.visible;
}

MapLayer.prototype.isVisible = function() {
  return this.visible;
}

MapLayer.prototype.setVisible = function() {
  this.visible = true;
}

MapLayer.prototype.setHidden = function() {
  this.visible = false;
}

MapLayer.prototype.isQueryable = function() {
  return this.queryable;
}

MapLayer.prototype.setQueryable = function() {
  this.queryable = true;
}
*/
