/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Control/EditingMode.js
 */
OpenLayers.Control.EditingMode.PointSnapping = OpenLayers.Class.create();
OpenLayers.Control.EditingMode.PointSnapping.prototype =
    OpenLayers.Class.inherit(OpenLayers.Control.EditingMode, {
    
    /**
     * @constructor
     */
    initialize: function() {
        this.style = OpenLayers.Style.PointSnappingStyle;
        this.tmpPoint = new OpenLayers.Geometry.Point();
        this.tmpPoint.id = "tmpPoint";
        this.tmpPoint.isSnappingElement = true;
    },

    /**
     * Calculate the position of the point to snap to
     * modify the first argument parameters value
     *
     * @param {OpenLayers.Geometry.Point} position
     * @param {OpenLayers.Geometry} geometry
     */
    calculatePoint: function(position, geometry) {
        var snappingPoint = false;

        if (geometry) {
            var snappingData = OpenLayers.Util.getVertexSnappingPoint(position, geometry);
        }

        if (snappingData && snappingData.point && snappingData.distance < this.map.snappingTolerance * this.map.getResolution()) {
            this.tmpPoint.setX(snappingData.point.x);
            this.tmpPoint.setY(snappingData.point.y);
            position.setX(snappingData.point.x);
            position.setY(snappingData.point.y);
            this.map.vectorLayer.renderer.drawGeometry(this.tmpPoint, this.style);

            return position;
        } else {
            this.map.vectorLayer.renderer.eraseGeometry(this.tmpPoint);
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.EditingMode.PointSnapping"
});
