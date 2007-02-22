/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.EditingTool = OpenLayers.Class.create();
OpenLayers.Control.EditingTool.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type Boolean */
    performedDrag: false,

    /** @type OpenLayers.Layer.Vector */
    layer: null,

    /** @type Array(OpenLayers.Control.EditingMode) */
    editingModes: [],

    /** @type OpenLayers.Pixel */
    snappingTolerance: 5,

    /** @type OpenLayers.Pixel */
    autoPanTolerance: 10,

    /** @type OpenLayers.Pixel */
    autoPanStep: 2,

    /** Time in milliseconds between map pan
     * @type int
     */
    autoPanInterval: 10,
    
    /** @type OpenLayers.Style */
    tmpStyle: null,
    
    /**
     * @constructor
     *
     * @param {String} name
     * @param {Object} options Hashtable of extra options to tag onto the layer
     */
    initialize: function() {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.editingModes = [];
        this.editingModes.push(new OpenLayers.Control.EditingMode.PointSnapping());
//        this.editingModes.push(new OpenLayers.Control.EditingMode.SegmentSnapping());
        this.style = OpenLayers.Style.DefaultRendererTemporaryElementStyle;
    },
    
    /**
     *
     */
    turnOn: function() {

        this.defaultClick = this.defaultClick.bindAsEventListener(this);
        this.defaultDblClick = this.defaultDblClick.bindAsEventListener(this);
        this.defaultMouseDown = this.defaultMouseDown.bindAsEventListener(this);
        this.defaultMouseUp = this.defaultMouseUp.bindAsEventListener(this);
        this.defaultMouseMove = this.defaultMouseMove.bindAsEventListener(this);
        this.defaultMouseOut = this.defaultMouseOut.bindAsEventListener(this);
        this.defaultWheelEvent = this.defaultWheelEvent.bindAsEventListener(this);

        this.map.events.register( "click", this, this.defaultClick);
        this.map.events.register( "dblclick", this, this.defaultDblClick);
        this.map.events.register( "mousedown", this, this.defaultMouseDown);
        this.map.events.register( "mouseup", this, this.defaultMouseUp);
        this.map.events.register( "mousemove", this, this.defaultMouseMove);
        this.map.events.register( "mouseout", this, this.defaultMouseOut);
        
        // Observe the 
        OpenLayers.Event.observe(window, "DOMMouseScroll",this.defaultWheelEvent , false);
        OpenLayers.Event.observe(window, "mousewheel",this.defaultWheelEvent , false);
        OpenLayers.Event.observe(document, "mousewheel",this.defaultWheelEvent , false);

        // Observe the Keyboard up and down events
        this.defaultKeyDown = this.defaultKeyDown.bindAsEventListener(this);
        this.defaultKeyUp = this.defaultKeyUp.bindAsEventListener(this);
        OpenLayers.Event.observe(document, "keydown", this.defaultKeyDown);
        OpenLayers.Event.observe(document, "keyup", this.defaultKeyUp);
    },

    /**
     *
     */
    turnOff: function() {
        this.map.events.unregister( "click", this, this.defaultClick);
        this.map.events.unregister( "dblclick", this, this.defaultDblClick);
        this.map.events.unregister( "mousedown", this, this.defaultMouseDown);
        this.map.events.unregister( "mouseup", this, this.defaultMouseUp);
        this.map.events.unregister( "mousemove", this, this.defaultMouseMove);
        this.map.events.unregister( "mouseout", this, this.defaultMouseOut);

        OpenLayers.Event.stopObserving(document, "keydown", this.defaultKeyDown);
        OpenLayers.Event.stopObserving(document, "keyup", this.defaultKeyUp);
        OpenLayers.Event.stopObserving(window, "DOMMouseScroll",this.defaultWheelEvent , false);
        OpenLayers.Event.stopObserving(window, "mousewheel",this.defaultWheelEvent , false);
        OpenLayers.Event.stopObserving(document, "mousewheel",this.defaultWheelEvent , false);

        this.map.events.unregister("Editing", map, this.defaultEditing);
    },

    /** 
     * Finalize the geometry from the current tool
     */
     // TBD use this generic method in all draw tools
     /*
    finalizeGeometry: function() {
    },
    */

    /**
     * @param {Event} evt
     * 
     * add rich properties to an evt object for the edition
     */
    setEventContext: function(evt) {
        // calculate the mouse position
        var lonlat = this.map.getLonLatFromLayerPx(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

        // the target Geometry is the shape under the mouse
        evt.targetGeometry = this.map.vectorLayer.renderer.getGeometryFromEvent(evt);
        
        // reset evt.point if modes are activated.
        if (this.editingModes) {
            for (var i = 0; i < this.editingModes.length; i++) {
                var snappingCoordinates = 
                    this.editingModes[i].calculatePoint(evt.point, evt.targetGeometry, this.geometry, this.map.vectorLayer);

                if (snappingCoordinates) {
                    evt.point = snappingCoordinates;                    
                    break;
                }
            }
        }
    },

    /**
     * @param {Event} evt
     */
    defaultClick: function (evt) {
        this.setEventContext(evt);
    },

    /**
     * @param {Event} evt
     */
    defaultDblClick: function (evt) {
        this.setEventContext(evt);
    },

    /**
     * @param {Event} evt
     */
    defaultMouseDown: function(evt) {
        this.setEventContext(evt);
        this.mouseDown = true;
    },

    /**
     * @param {Event} evt
     */
    defaultMouseMove: function (evt) {
        this.setEventContext(evt);
        
        // auto pan functionality: in editiong mode, pan when the
        // mouse is near the border of the map
        var size = this.map.getSize();
        var posX = size.w - evt.xy.x;
        var posY = size.h - evt.xy.y;
        
        if (posX <= this.autoPanTolerance) {
            // cursor is too much in the east
            if (!this.autoPanXTimeoutId) {
                  this.autoPanXTimeoutId = window.setInterval(function() { this.map.pan(this.autoPanStep, 0);}.bind(this),
                                                              this.autoPanInterval);
            }
        } else if (posX >= (size.w - this.autoPanTolerance)) {
            // cursor is too much in the west
            if (!this.autoPanXTimeoutId) {
                this.autoPanXTimeoutId = window.setInterval(function() { this.map.pan(-this.autoPanStep, 0);}.bind(this),
                                                            this.autoPanInterval);
            }
        } else {
            if (this.autoPanXTimeoutId) {
                // cursor is in the middle of the map: stop the X timer
                window.clearInterval(this.autoPanXTimeoutId);
                this.autoPanXTimeoutId = null;
            }
        }

        if (posY <= this.autoPanTolerance) {
            // cursor is too much in the south
            if (!this.autoPanYTimeoutId) {
                this.autoPanYTimeoutId = window.setInterval(function() { this.map.pan(0, this.autoPanStep);}.bind(this),
                                                            this.autoPanInterval);
            }
        } else if (posY >= (size.h - this.autoPanTolerance)) {
            // cursor is too much in the north
            if (!this.autoPanYTimeoutId) {
                this.autoPanYTimeoutId = window.setInterval(function() { this.map.pan(0, -this.autoPanStep);}.bind(this),
                                                            this.autoPanInterval);
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
    defaultMouseUp: function (evt) {
        this.setEventContext(evt);
        this.mouseDown = false;
    },

    /**
     * @param {Event} evt
     */
    defaultMouseOut: function (evt) {
        this.setEventContext(evt);
        
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

    /**
     * @param {Event} evt
     */
    defaultWheelEvent: function(evt) {
        OpenLayers.MouseListener.MouseDefaults.prototype.mouseWheel.apply(this, arguments);
    },

    /**
     * @param {Event} evt
     */
    defaultKeyDown: function(evt) {
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
            case OpenLayers.Event.KEY_CAPSLOCK:
            this.capsLock = !this.capsLock;
            this.snappingMode = !this.snappingMode;
            break;
        }
    },

    /**
     * @param {Event} evt
     */
    defaultKeyUp: function(evt){
        switch (evt.keyCode){
            case OpenLayers.Event.KEY_SHIFT:
            this.shiftDown = false;
            this.controlledMode = false;
            break;
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.EditingTool"
});
