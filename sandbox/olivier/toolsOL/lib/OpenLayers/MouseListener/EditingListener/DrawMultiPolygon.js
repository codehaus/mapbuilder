/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */
OpenLayers.MouseListener.EditingListener.DrawMultiPolygon = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.DrawMultiPolygon.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener.DrawLinearRing, {
   
    /** 
     * Finalize the geometry from the current tool
     */
    _finalizeGeometry: function(){
        var feature = new OpenLayers.Feature();
        var multiPolygon = new OpenLayers.Geometry.MultiPolygon();
        var polygon = new OpenLayers.Geometry.Polygon();
        polygon.addComponents([this.geometry]);
        multiPolygon.addComponents([polygon]);
        feature.setGeometry(multiPolygon);        
        this.geometry = new OpenLayers.Geometry.LinearRing();
        this.map.vectorLayer.addFeatures(feature);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener.DrawMultiPolygon"
    
});