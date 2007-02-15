/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener.js
 */
OpenLayers.MouseListener.AutoPan = OpenLayers.Class.create();
OpenLayers.MouseListener.AutoPan.autoPanTolerance = 10;
OpenLayers.MouseListener.AutoPan.autoPanStep = 10;
OpenLayers.MouseListener.AutoPan.autoPanInterval = 10;
OpenLayers.MouseListener.AutoPan.prototype = OpenLayers.Class.inherit(OpenLayers.MouseListener, {

    /**
     * @constructor
     */
    initialize: function() {
        OpenLayers.MouseListener.prototype.initialize.apply(this, arguments);
    },

    /**
     * @param {Event} evt
     */
    mouseMove: function(evt) {

        var autoPanTolerance = OpenLayers.MouseListener.AutoPan.autoPanTolerance;
        var autoPanStep = OpenLayers.MouseListener.AutoPan.autoPanStep;
        var autoPanInterval = OpenLayers.MouseListener.AutoPan.autoPanInterval;

        var size = this.map.getSize();
        var posX = size.w - evt.xy.x;
        var posY = size.h - evt.xy.y;

        if (posX <= autoPanTolerance) {

            // cursor is too much in the east
            if (!this.autoPanXTimeoutId) {
                  this.autoPanXTimeoutId = window.setInterval(function() { this.map.pan(autoPanStep, 0);}.bind(this),
                                                              autoPanInterval);
            }
        } else if (posX >= (size.w - autoPanTolerance)) {
            // cursor is too much in the west
            if (!this.autoPanXTimeoutId) {
                this.autoPanXTimeoutId = window.setInterval(function() { this.map.pan(-autoPanStep, 0);}.bind(this),
                                                            autoPanInterval);
            }
        } else {
            if (this.autoPanXTimeoutId) {
                // cursor is in the middle of the map: stop the X timer
                window.clearInterval(this.autoPanXTimeoutId);
                this.autoPanXTimeoutId = null;
            }
        }

        if (posY <= autoPanTolerance) {
            // cursor is too much in the south
            if (!this.autoPanYTimeoutId) {
                this.autoPanYTimeoutId = window.setInterval(function() { this.map.pan(0, autoPanStep);}.bind(this),
                                                            autoPanInterval);
            }
        } else if (posY >= (size.h - autoPanTolerance)) {
            // cursor is too much in the north
            if (!this.autoPanYTimeoutId) {
                this.autoPanYTimeoutId = window.setInterval(function() { this.map.pan(0, -autoPanStep);}.bind(this),
                                                            autoPanInterval);
            }
        } else {
            if (this.autoPanYTimeoutId) {
                // cursor is in the middle of the map: stop the Y timer
                window.clearInterval(this.autoPanYTimeoutId);
                this.autoPanYTimeoutId = null;
            }
        }
    },

    /**
     * @param {Event} evt
     */
    mouseOut: function(evt) {
        // stop auto pan
        if (this.autoPanXTimeoutId) {
            window.clearInterval(this.autoPanXTimeoutId);
            this.autoPanXTimeoutId = null;
        }
        if (this.autoPanYTimeoutId) {
            window.clearInterval(this.autoPanYTimeoutId);
            this.autoPanYTimeoutId = null;
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.AutoPan"
});
