/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */
OpenLayers.MouseListener.MeasureArea = OpenLayers.Class.create();
OpenLayers.MouseListener.MeasureArea.prototype =
    OpenLayers.Class.inherit(OpenLayers.MouseListener.EditingListener, {

    /** @type DOMElement */
    element: null,

    /** @type String */
    prefix: 'area: ',

    /** @type String */
    suffix: ' m&sup2;',

    /** @type int */
    numdigits: 2,

    /**
     * @constructor
    ***/
    initialize: function(options) {
        OpenLayers.MouseListener.EditingListener.prototype.initialize.apply(this, arguments);
        this.turnOn();

        options = options || [];
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Turn on the current tool and catch all the concerned events.
     */
    turnOn: function() {
        OpenLayers.MouseListener.EditingListener.prototype.turnOn.apply(this, arguments);
        this.geometry = new OpenLayers.Geometry.LinearRing();
        this.tmpLineSting = new OpenLayers.Geometry.LineString();
    },

    /**
     * Turn off the current tool and catch all the concerned events.
     */
    turnOff: function() {
        OpenLayers.MouseListener.EditingListener.prototype.turnOff.apply(this, arguments);
        this.eraseTmpElements();
        this.geometry = null;
    },

    /**
     * Finalize the geometry from the current tool
     */
    finalizeGeometry: function() {
        this.oldGeometry = this.geometry;
        this.geometry = new OpenLayers.Geometry.LinearRing();
    },


    eraseTmpElements: function() {
        for(var i = 0; i < this.geometry.path.length; i++) {
            this.map.vectorLayer.renderer.eraseGeometry(this.geometry.path[i]);
        }
        this.map.vectorLayer.renderer.eraseGeometry(this.geometry);
    },

    mouseDblClick: function(evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseDblClick.apply(this, arguments);

        this.mouseDown(evt);
        // this.eraseTmpElements();
        if (this.geometry.path.length > 2) {
            this.finalizeGeometry();
        }
    },

    mouseDown: function(evt) {
        // Double click manager
        if (this.lastDown && this.lastDown.x  == evt.xy.x && this.lastDown.y == evt.xy.y) {
            return;
        }
        this.lastDown = evt.xy;

        if (this.geometry.path.length == 0 && this.oldGeometry) {
            this.map.vectorLayer.renderer.eraseGeometry(this.oldGeometry);
        }

        OpenLayers.MouseListener.EditingListener.prototype.mouseDown.apply(this, arguments);

        if (evt.point == this.geometry.path[0]) {
            this.eraseTmpElements();
            this.finalizeGeometry();
        } else {
            this.geometry.addPoint(evt.point);
            this.map.vectorLayer.renderer.drawGeometry(this.geometry, this.map.vectorLayer.style);
        }

    },

    mouseMove: function(evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseMove.apply(this, arguments);

        if (this.isMouseDown) {
            this.mouseDown(evt);

        } else {
            if (this.geometry.path.length > 0) {
                this.tmpLineSting.path[0] = this.geometry.path[this.geometry.path.length-2];
                this.tmpLineSting.path[1] = evt.point;
                this.tmpLineSting.path[2] = this.geometry.path[this.geometry.path.length-1];
                this.map.vectorLayer.renderer.drawGeometry(this.tmpLineSting, this.style);

                if (this.element != null) {
                    this.draw();
                }
            }
        }
    },

    keyDown: function(evt) {

        OpenLayers.MouseListener.EditingListener.prototype.keyDown.apply(this, arguments);

        switch (evt.keyCode){
            case OpenLayers.Event.KEY_RETURN:
                this.eraseTmpElements();
                if(this.geometry.path.length > 1){
                    this.finalizeGeometry();
                }
                OpenLayers.Util.clearArray(this.geometry.path);
                break;
            case OpenLayers.Event.KEY_BACKSPACE:
            case OpenLayers.Event.KEY_DELETE:
            case OpenLayers.Event.KEY_ESC:
                this.eraseTmpElements();
                OpenLayers.Util.clearArray(this.geometry.path);
                OpenLayers.Event.stop(evt);
                break;
        }
    },

    draw: function() {
        var digits = parseInt(this.numdigits);

        var newHtml = this.prefix +
                      this.geometry.getLength().toFixed(digits) +
                      this.suffix;

        if (newHtml != this.element.innerHTML) {
            this.element.innerHTML = newHtml;
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.MeasureArea"

});
