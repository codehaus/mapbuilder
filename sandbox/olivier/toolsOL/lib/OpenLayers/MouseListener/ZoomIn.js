/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
 
 /**
 * @class
 *
 * @requires OpenLayers/Control/EditingTool.js
 */
OpenLayers.MouseListener.ZoomIn = OpenLayers.Class.create();
OpenLayers.MouseListener.ZoomIn.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener, {
//this._addButton("zoombox", "drag-rectangle-off.png", "drag-rectangle-on.png", centered, sz, "Shift->Drag to zoom to area");
       
    /** @type String */
	id: "zoomin",
    imageOn:"ZoomInEnable.png",
    imageOff:"ZoomInDisable.png",
    type:"RadioButton",
    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(22,22),
	map:null,
    /*
     * 
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
                this.map.setCenter(this.map.center);
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
                    var left = Math.min(start.lon, end.lon);
                    var right = Math.max(start.lon, end.lon);
                    var bounds = new OpenLayers.Bounds(left, bottom, right, top);
                    this.map.zoomToExtent(bounds);
                } else {
                    var end = this.map.getLonLatFromViewPortPx( evt.xy );
                    this.map.setCenter(new OpenLayers.LonLat((end.lon),
                                                             (end.lat)), 
                                       this.map.getZoom() + 1);
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

    CLASS_NAME: "OpenLayers.MouseListener.ZoomIn"
    
});
