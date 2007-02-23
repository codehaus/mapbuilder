/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */


/**
 * @class
 *
 * @requires OpenLayers/MouseListener.js
 */
OpenLayers.MouseListener.ZoomOut = OpenLayers.Class.create();
OpenLayers.MouseListener.ZoomOut.prototype =
OpenLayers.Class.inherit( OpenLayers.MouseListener, {

    /** @type Boolean */
    performedDrag: false,
    
	/** @type String */
	id: "zoomout",
	
	/** @type String */
    imageOn:"ZoomOutEnable.png",
    
    /** @type String */
    imageOff:"ZoomOutDisable.png",
    
    /** @type String */
    type:"RadioButton",
    
    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(22,22),
    
    /**
     * @constructor
     */
    initialize: function(options) {
        OpenLayers.MouseListener.prototype.initialize.apply(this, arguments);
        options = options || [];
        OpenLayers.Util.extend(this, options);
    },
  /**
     * Register for mouseListener events
     */
    turnOn: function() {
    
        this.map.addMouseListener(this);
    },

    /**
     * Unregister for mouseListener events
     */
    turnOff: function() {
        this.map.removeMouseListener(this);
    },
    /**
    * @param {Event} evt
    */
    mouseDown: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt))
            return;

        this.mouseDragStart = evt.xy.clone();
        this.performedDrag  = false;
        /*if (evt.shiftKey) {*/
            this.map.div.style.cursor = "crosshair";
            this.zoomBox = OpenLayers.Util.createDiv('zoomBox',
                                                     this.mouseDragStart,
                                                     null,
                                                     null,
                                                     "absolute",
                                                     "2px solid red");
            this.zoomBox.initialCoords = evt.xy;
            this.zoomBox.style.backgroundColor = "white";
            this.zoomBox.style.filter = "alpha(opacity=50)"; // IE
            this.zoomBox.style.opacity = "0.50";
            this.zoomBox.style.fontSize = "1px";
            this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
            this.map.viewPortDiv.appendChild(this.zoomBox);
        /*}*/
        document.onselectstart = function() { return false; }
        OpenLayers.Event.stop(evt);
    },

    /**
    * @param {Event} evt
    */
    mouseMove: function(evt) {
        // record the mouse position, used in onWheelEvent
        this.mousePosition = evt.xy.clone();

        if (this.mouseDragStart != null) {
            if (this.zoomBox) {
                var deltaX = Math.abs(this.mouseDragStart.x - evt.xy.x);
                var deltaY = Math.abs(this.mouseDragStart.y - evt.xy.y);
                this.zoomBox.style.width = Math.max(1, deltaX) + "px";
                this.zoomBox.style.height = Math.max(1, deltaY) + "px";
                if (evt.xy.x < this.mouseDragStart.x) {
                    this.zoomBox.style.left = evt.xy.x + "px";
                } else {
                    this.zoomBox.style.left = this.zoomBox.initialCoords.x + "px";
                }
                if (evt.xy.y < this.mouseDragStart.y) {
                    this.zoomBox.style.top = evt.xy.y+ "px";
                } else {
                    this.zoomBox.style.top = this.zoomBox.initialCoords.y + "px";
                }
            } else {
                var deltaX = this.mouseDragStart.x - evt.xy.x;
                var deltaY = this.mouseDragStart.y - evt.xy.y;
                var size = this.map.getSize();
                var newXY = new OpenLayers.Pixel(size.w / 2 + deltaX,
                                                 size.h / 2 + deltaY);
                var newCenter = this.map.getLonLatFromViewPortPx(newXY);
                this.map.setCenter(newCenter, null, true);
                this.mouseDragStart = evt.xy.clone();
                this.map.div.style.cursor = "move";
            }
            this.performedDrag = true;
        }
    },

    /**
    * @param {Event} evt
    */
    mouseUp: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) 
            return;
        
        if (this.zoomBox) {
            this.zoomBoxEnd(evt);
        } else {
            if (this.performedDrag) {
                this.map.setCenter(this.map.center,this.map.getZoom()-1);
            }
        }
        document.onselectstart = null;
        this.mouseDragStart = null;
        this.map.div.style.cursor = "default";
    },

    /**
    * @param {Event} evt
    */
    mouseOut: function(evt) {
        if (this.mouseDragStart != null &&
            OpenLayers.Util.mouseLeft(evt, this.map.div)) {
                if (this.zoomBox) {
                    this.removeZoomBox();
                }
                this.mouseDragStart = null;
            }
    },

	/**
	 *  Mouse ScrollWheel code thanks to http://adomas.org/javascript-mouse-wheel/
	 */

    /** Catch the wheel event and handle it xbrowserly
     *
     * @param {Event} e
     */
    mouseWheel: function(evt) {
        // first determine whether or not the wheeling was inside the map
        var inMap = false;
        var elem = OpenLayers.Event.element(evt);

        while(elem != null) {
            if (this.map && elem == this.map.div) {
                inMap = true;
                break;
            }
            elem = elem.parentNode;
        }

        if (inMap) {

            var delta = 0;
            if (!evt) {
                evt = window.event;
            }
            if (evt.wheelDelta) {
                delta = evt.wheelDelta/120;
                if (window.opera) {
                    delta = -delta;
                }
            } else if (evt.detail) {
                delta = -evt.detail / 3;
            }
            if (delta) {
                // add the mouse position to the event because mozilla has a bug
                // with clientX and clientY (see https://bugzilla.mozilla.org/show_bug.cgi?id=352179)
                // getLonLatFromViewPortPx(e) returns wrong values
                evt.xy = this.mousePosition;

                if (delta < 0) {
                    this.mouseWheelDown(evt);
                } else {
                    this.mouseWheelUp(evt);
                }
            }

            //only wheel the map, not the window
            OpenLayers.Event.stop(evt);
        }
    },

    /** User spun scroll wheel up
     *
     */
    mouseWheelUp: function(evt) {

        if (this.map.getZoom() <= this.map.getNumZoomLevels()) {
            var mouse = this.map.getLonLatFromPixel(evt.xy);
            var center = this.map.getCenter();
            var resolution = this.map.getResolution();
            var mouseToCenter = new OpenLayers.Pixel((mouse.lon - center.lon) / resolution,
                                                     (mouse.lat - center.lat) / resolution);

            var nextResolution = this.map.getResolution(this.map.getZoom() + 1);

            this.map.setCenter(new OpenLayers.LonLat(center.lon + (mouseToCenter.x * nextResolution),
                                                     center.lat + (mouseToCenter.y * nextResolution)),
                               this.map.getZoom() + 1);
        }

    },

    /** User spun scroll wheel down
     *
     */
    mouseWheelDown: function(evt) {
        if (this.map.getZoom() > 0) {
            var mouse = this.map.getLonLatFromPixel(evt.xy);
            var center = this.map.getCenter();
            var resolution = this.map.getResolution();
            var mouseToCenter = new OpenLayers.Pixel((mouse.lon - center.lon) / resolution,
                                                     (mouse.lat - center.lat) / resolution);

            var prevResolution = this.map.getResolution(this.map.getZoom() - 1);


            this.map.setCenter(new OpenLayers.LonLat(mouse.lon - (mouseToCenter.x * prevResolution),
                                                     mouse.lat - (mouseToCenter.y * prevResolution)),
                               this.map.getZoom() - 1);
        }

    },

    /** Zoombox function.
     *
     */
    zoomBoxEnd: function(evt) {
        if (this.mouseDragStart != null) {
            if (Math.abs(this.mouseDragStart.x - evt.xy.x) > 5 ||
                Math.abs(this.mouseDragStart.y - evt.xy.y) > 5) {
                    var start = this.map.getLonLatFromViewPortPx(this.mouseDragStart);
                    var end = this.map.getLonLatFromViewPortPx(evt.xy);
                    var top = Math.max(start.lat, end.lat);
                    var bottom = Math.min(start.lat, end.lat);
                    var centerLat=((top+bottom)/2);
                    var left = Math.min(start.lon, end.lon);
                    var right = Math.max(start.lon, end.lon);
                    var centerLon=((left+right)/2);
                    this.map.setCenter(new OpenLayers.LonLat((centerLon),
                                                             (centerLat)), 
                                       this.map.getZoom() - 1);
                    //var bounds = new OpenLayers.Bounds(left, bottom, right, top);
                    //this.map.zoomToExtent(bounds);
                } else {
                    var end = this.map.getLonLatFromViewPortPx( evt.xy );
                    this.map.setCenter(new OpenLayers.LonLat((end.lon),
                                                             (end.lat)), 
                                       this.map.getZoom() - 1);
                }
            this.removeZoomBox();
        }
    },

    /**
     * Remove the zoombox from the screen and nullify our reference to it.
     */
    removeZoomBox: function() {
        this.zoomBox.initialCoords = null;
        this.map.viewPortDiv.removeChild(this.zoomBox);
        this.zoomBox = null;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.ZoomOut"
});
