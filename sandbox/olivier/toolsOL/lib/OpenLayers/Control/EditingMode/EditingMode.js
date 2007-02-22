/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
 
 /**
 * @class
 *
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.EditingMode = OpenLayers.Class.create();
OpenLayers.Control.EditingMode.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {

    /** 
     * @constructor
     */
    initialize: function() {},

    /**
     * Calculate the position of the point to snap to
     * modify the first argument parameters value
     *
     * @param {Point} position
     * @param {Geometry} geometry
     */
    calculatePoint: function(position, geometry) {},

    /**
     * Set the map property of the editingMode
     *
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        this.map = map;
    },

    CLASS_NAME: "OpenLayers.Control.EditingMode"
});
