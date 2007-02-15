/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener.js
 */
OpenLayers.MouseListener.EditingListener = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.prototype =
    OpenLayers.Class.inherit( OpenLayers.MouseListener, {

    /**
     * @constructor
     */
    initialize: function() {
        OpenLayers.MouseListener.prototype.initialize.apply(this, arguments);
        this.style = OpenLayers.Style.DefaultRendererTemporaryElementStyle;
        this.isMouseDown = false;
    },

    /**
     * @param {Event} evt
     */
    defaultClick: function(evt) {
        // set position
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

        this._setEventContext(evt);
    },

    /**
     * @param {Event} evt
     */
    mouseDblClick: function(evt) {
        // set position
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

        this._setEventContext(evt);
    },

    /**
     * @param {Event} evt
     */
    mouseDown: function(evt) {
        // set position
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

        this._setEventContext(evt);

        this.isMouseDown = true;
    },

    /**
     * @param {Event} evt
     */
    mouseMove: function(evt) {
        OpenLayers.MouseListener.AutoPan.prototype.mouseMove.apply(this, arguments);

        // set position
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

        this._setEventContext(evt);
    },

    /**
     * @param {Event} evt
     */
    mouseUp: function(evt) {
        // set position
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

        this._setEventContext(evt);

        this.isMouseDown = false;
    },

    /**
     * @param {Event} evt
     */
    mouseOut: function(evt) {
        OpenLayers.MouseListener.AutoPan.prototype.mouseOut.apply(this, arguments);

        // set position
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

        this._setEventContext(evt);
    },

    mouseOver: function(evt) {
        // set position
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

        this._setEventContext(evt);
    },

    /**
     * @param {Event} evt
     */
    wheelEvent: function(evt) {
        OpenLayers.MouseListener.MouseDefaults.prototype.mouseWheel.apply(this, arguments);
    },

    /**
     * @param {Event} evt
     */
    keyDown: function(evt) {
        switch (evt.keyCode) {
            case OpenLayers.Event.KEY_LEFT:
            this.map.pan(-50, 0);
            break;
            case OpenLayers.Event.KEY_RIGHT:
            this.map.pan(50, 0);
            break;
            case OpenLayers.Event.KEY_UP:
            this.map.pan(0, -50);
            break;
            case OpenLayers.Event.KEY_DOWN:
            this.map.pan(0, 50);
            break;
            case OpenLayers.Event.KEY_SHIFT:
            this.shiftDown = true;
            this.controlledMode = true;
            break;
            case OpenLayers.Event.KEY_CTRL:
            this.snappingMode = true;
            break;
        }
    },

    /**
     * @param {Event} evt
     */
    keyUp: function(evt) {
        switch (evt.keyCode) {
            case OpenLayers.Event.KEY_SHIFT:
            this.shiftDown = false;
            this.controlledMode = false;
            break;
            case OpenLayers.Event.KEY_CTRL:
            this.capsLock = false;
            this.snappingMode = false;
            break;
        }
    },

    /**
     * @param {Event} evt
     *
     * add rich properties to an evt object for the edition
     */
    _setEventContext: function(evt) {
        // the target Geometry is the shape under the mouse
        evt.targetGeometry = this.map.vectorLayer.renderer.getGeometryFromEvent(evt);

        // reset evt.point if modes are activated.
        if (this.map.editingModes) {
            for (var i = 0; i < this.map.editingModes.length; i++) {
                if (this.map.editingModes[i].isSnappingTypeMode && this.snappingMode
                    || this.map.editingModes[i].isControlledTypeMode && this.controlledMode
                    || !this.map.editingModes[i].isSnappingTypeMode && !this.map.editingModes[i].isControlledTypeMode) {
                    var snappingCoordinates =
                        this.map.editingModes[i].calculatePoint(evt.point, evt.targetGeometry);

                    if (snappingCoordinates) {
                        evt.point = snappingCoordinates;
                        break;
                    }
                }
            }
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener"
});
