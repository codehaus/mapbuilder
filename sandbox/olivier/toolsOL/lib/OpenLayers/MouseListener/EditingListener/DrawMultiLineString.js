/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */
OpenLayers.MouseListener.EditingListener.DrawMultiLineString = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.DrawMultiLineString.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener.DrawLineString, {
   
    /** 
     * Finalize the geometry from the current tool
     */
    _finalizeGeometry: function(){
        var feature = new OpenLayers.Feature();
        var multiLineString = new OpenLayers.Geometry.MultiLineString();
        multiLineString.addComponents([this.geometry]);
        feature.setGeometry(multiLineString);
        this.geometry = new OpenLayers.Geometry.LineString();
        this.map.vectorLayer.addFeatures(feature);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener.DrawMultiLineString"
    
});