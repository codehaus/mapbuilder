/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry/Aggregate.js
 */
OpenLayers.Geometry.MultiPoint = OpenLayers.Class.create();

OpenLayers.Geometry.MultiPoint.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.Aggregate, {

    /**
    * @constructor
    *
    * @param {Array|OpenLayers.Geometry.Point}
    */
    initialize: function(components) {
    	OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
    	this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
        
        if (components != null) {
            this.addComponents(components);
        }
    },

    /**
     * adds components to the MultiPoint
     *
     * @param {Array|OpenLayers.Geometry.Point} point(s) to add
     */
    addComponents: function(components) {
    	if(!(components instanceof Array)) {
            components = [components];
        }
        
        for (var i = 0; i < components.length; i++) {
            if (!(components[i] instanceof OpenLayers.Geometry.Point)) {
                throw "component should be an OpenLayers.Geometry.Point";
            }
        }
        OpenLayers.Geometry.Aggregate.prototype.addComponents.apply(this, arguments);
    },
    
    /**
     * removes components from the MultiPoint
     *
     * @param {Array|OpenLayers.Geometry.Point} point(s) to add
     */
    removeComponents: function(components) {
        OpenLayers.Geometry.Aggregate.prototype.removeComponents.apply(this, arguments);
    },

    CLASS_NAME: "OpenLayers.Geometry.MultiPoint"
});
