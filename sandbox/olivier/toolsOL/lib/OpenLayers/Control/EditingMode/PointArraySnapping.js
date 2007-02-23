/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Control/EditingMode.js
 */
OpenLayers.Control.EditingMode.PointArraySnapping = OpenLayers.Class.create();
OpenLayers.Control.EditingMode.PointArraySnapping.prototype =
    OpenLayers.Class.inherit(OpenLayers.Control.EditingMode, {

    /** {Boolean} tells if this EditingMode is of "snapping" type */
    isSnappingTypeMode: true,


    /**
     * @constructor
     */
    initialize: function() {
        this.isSnappingTypeMode = true;
        this.style = OpenLayers.Style.DefaultRendererSnappingPointStyle;
        this.tmpPoint = new OpenLayers.Geometry.Point();
        this.tmpPoint.id = "tmpPoint";
    },

    /**
     * Calculate the position of the point to snap to
     * modify the first argument parameters value
     *
     * @param {Point} position
     * @param {Geometry} geometry
     */
    calculatePoint: function(position, geometry) {
        var snappingPoint = false;

        var distance = this.map.snappingTolerance * this.map.getResolution();

        // Snap to each feature of each vector layer
        for (var i = 0; i < map.layers.length; i++) {
            if (map.layers[i].isVector) {
                var calculatedPoint = this._calculatePointForLayer(position, map.layers[i], distance);
                if (calculatedPoint &&
                    calculatedPoint.distance < distance &&
                    calculatedPoint.snappingPoint) {
                    snappingPoint = calculatedPoint.snappingPoint;
                    distance = calculatedPoint.distance;
                }
            }
        }

        if (snappingPoint) {
            // Set the snapping style an draw the geometry
            this.tmpPoint.x = snappingPoint.x;
            this.tmpPoint.y = snappingPoint.y;
//            layer.renderer.drawGeometry(this.tmpPoint, this.style);
        } else {
//            layer.renderer.eraseGeometry(this.tmpPoint);
        }

        return snappingPoint;
    },

    _calculatePointForLayer: function(mouseCoordinates, layer, distance) {
        var snappingPoint = false;
        for (var i=0; i < layer.features.length; i++) {
            var feature = layer.features[i];
            var buffer = new OpenLayers.Bounds(feature.geometry.bounds.left - distance,
                                               feature.geometry.bounds.bottom - distance,
                                               feature.geometry.bounds.right + distance,
                                               feature.geometry.bounds.top + distance);
            if (!feature.geometry.bounds || !buffer.containsLonLat(mouseCoordinates)) {
                // don't calculate closestVertex if cursor isn't in feature bounds
                continue;
            }
            var calculatedPoint = this._calculatePointForGeometry(mouseCoordinates, feature.geometry, distance);
            if (calculatedPoint &&
                calculatedPoint.distance < distance &&
                calculatedPoint.snappingPoint) {
                snappingPoint = calculatedPoint.snappingPoint;
                distance = calculatedPoint.distance;
            }
        }
        return {snappingPoint: snappingPoint, distance: distance};
    },

    _calculatePointForGeometry: function(mouseCoordinates, targetGeometry, distance) {
        var snappingPoint = false;
        // recursively find the closestVertex into the components
        if (targetGeometry.components) {
            for (var i = 0; i < targetGeometry.components.length; i++) {
                var calculatedPoint = this._calculatePointForGeometry(mouseCoordinates, targetGeometry.components[i], distance);
                if (calculatedPoint &&
                    calculatedPoint.distance < distance &&
                    calculatedPoint.snappingPoint) {

                    snappingPoint = calculatedPoint.snappingPoint;
                    distance = calculatedPoint.distance;
                }
            }
        } else {
            var calculatedPoint = this._calculatePointForPrimitive(mouseCoordinates, targetGeometry, distance);
            if (calculatedPoint &&
                calculatedPoint.distance < distance &&
                calculatedPoint.snappingPoint) {
                return calculatedPoint;
            }
        }
        return {snappingPoint: snappingPoint, distance: distance};
    },


    /**
     * Finds the closestVertex for a primitive geometry
     *
     * @param {OpenLayers.LonLat} mouseCoordinates
     * @param {OpenLayers.Geometry} targetGeometry primitive geometry
     * @param {float} distance
     * @return {Object} OpenLayers.Geometry.Point + distance
     */
    _calculatePointForPrimitive: function(mouseCoordinates, targetGeometry, distance) {

        var snappingPoint = false;
        // not stable
        var closestVertex = null;
        var buffer = new OpenLayers.Bounds(targetGeometry.bounds.left - distance,
                                               targetGeometry.bounds.bottom - distance,
                                               targetGeometry.bounds.right + distance,
                                               targetGeometry.bounds.top + distance);
        if (targetGeometry.bounds && buffer.containsLonLat(mouseCoordinates)) {
            for (var j=0; j<targetGeometry.path.length; j++) {
                var vertex = targetGeometry.path[j];
                var currentDistance = OpenLayers.Util.distance2Pts(vertex.lon, vertex.lat, mouseCoordinates.lon, mouseCoordinates.lat);
                if (currentDistance < distance) {
                    closestVertex = vertex;
                    distance = currentDistance;
                }
            }
            if (closestVertex != null) {
                snappingPoint = new OpenLayers.Geometry.Point(closestVertex.lon, closestVertex.lat);
            } else {
                snappingPoint = new OpenLayers.Geometry.Point(mouseCoordinates.lon, mouseCoordinates.lat);
            }
        }

        return {snappingPoint: snappingPoint, distance: distance};
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.EditingMode.PointArraySnapping"
});
