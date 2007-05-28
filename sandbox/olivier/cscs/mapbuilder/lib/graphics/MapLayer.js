/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: MapLayer.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/

/**
  * Abstract class to define a MapLayer
  */
MapLayer = function (model, mapPane, layerName, layerNode, queryable, visible) {
    this.model     = model;
    this.mapPane   = mapPane;
    this.layerName = layerName;
    this.layerNode = layerNode;
    this.queryable = queryable;
    this.visible   = visible;

    /** Multiply this number by the Layer Number to get the zIndex for a layer */
    this.zIndexFactor=500;
  

  this.paint= function( objRef, img ) {
  }

  this.unpaint= function( ) {
  }

  this.isWmsLayer= function() {
    return false;
  }
}
