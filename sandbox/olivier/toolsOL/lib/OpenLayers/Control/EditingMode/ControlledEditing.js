/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Control/EditingMode.js
 */
OpenLayers.Control.EditingMode.ControlledEditing = OpenLayers.Class.create();
OpenLayers.Control.EditingMode.ControlledEditing.prototype =
    OpenLayers.Class.inherit(OpenLayers.Control.EditingMode, {

    initialize: function() {},

    calculatePoint: function( mouseCoordinates, evtGeometry, currentGeometry, layer){
        var snappingPoint = false;

        // not stable
        if (this.geometry && this.geometry.path.length > 0) {
            var lastPoint = this.geometry.path[this.geometry.path.length-1];


            var width = tmpPoint.x-lastPoint.x;
            var height = tmpPoint.y-lastPoint.y;
            var hyp = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            var alpha = Math.acos(width/(hyp)) * 180.0/Math.PI;

            var step = 22.5;

            for (var degree = 0; degree <= 180; degree += step){
                if ((alpha > (degree-step/2)) && (alpha < (degree+step/2))){
                    var y = (height<0)?-Math.sin(degree/180*Math.PI)*hyp+lastPoint.y:Math.sin(degree/180*Math.PI)*hyp+lastPoint.y;
                    var x = Math.cos(degree/180*Math.PI)*hyp+lastPoint.x;
                    evt.point = new OpenLayers.Geometry.Point(x, y);
                }
            }
        }

        return snappingPoint;
    },

    CLASS_NAME: "OpenLayers.Control.EditingMode.ControlledEditing"
});
