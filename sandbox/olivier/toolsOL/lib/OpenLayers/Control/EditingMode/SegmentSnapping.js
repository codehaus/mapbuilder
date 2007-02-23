/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Control/EditingMode.js
 */

OpenLayers.Control.EditingMode.SegmentSnapping = OpenLayers.Class.create();
OpenLayers.Control.EditingMode.SegmentSnapping.prototype =
    OpenLayers.Class.inherit(OpenLayers.Control.EditingMode, {

    /**
     * @constructor
     */
    initialize: function() {
        // Temporary decoration for the snapping point
        this.tmpPoint = new OpenLayers.Geometry.Point();
        this.tmpPoint.id = "tmpPoint";
        this.tmpPoint.isSnappingElement = true;
        this.pointStyle = OpenLayers.Style.SegmentSnappingStyle;
    },

    /**
     * Calculate the position of the point to snap to, modify the first argument parameters value
     *
     * @param {Point} position
     * @param {Geometry} geometry
     */
    calculatePoint: function(position, geometry) {

        var snappingPoint, snappingSegment;

        //if (geometry && (geometry.path || geometry.components)) {
            var snappingData = OpenLayers.Util.getSegmentSnappingPoint(position, geometry);
        //}

        if (snappingData && snappingData.point && snappingData.distance < this.map.snappingTolerance * this.map.getResolution()) {
            this.tmpPoint.setX(snappingData.point.x);
            this.tmpPoint.setY(snappingData.point.y);
            position.setX(snappingData.point.x);
            position.setY(snappingData.point.y);
            this.map.vectorLayer.renderer.drawGeometry(this.tmpPoint, this.pointStyle);

            return position;
        } else {
            this.map.vectorLayer.renderer.eraseGeometry(this.tmpPoint);
        }

        return snappingPoint;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.EditingMode.SegmentSnapping"
});
