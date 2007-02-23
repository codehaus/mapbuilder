/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */


/**
 * @class
 *
 * @requires OpenLayers/MouseListener.js
 */
OpenLayers.MouseListener.DragPan = OpenLayers.Class.create();
OpenLayers.MouseListener.DragPan.prototype =
OpenLayers.Class.inherit( OpenLayers.MouseListener, {

    /** @type String */
	id: "dragpan",
	
	/** @type String */
    imageOn:"PanEnable.png",
    
    /** @type String */
    imageOff:"PanDisable.png",
    
    /** @type String */
    type:"RadioButton",
    
    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(22,22),
    
	map:null,
    /*
     * 
     */
    initialize: function( options ) {
        OpenLayers.MouseListener.prototype.initialize.apply(this, arguments);
        options = options || [];
        OpenLayers.Util.extend(this, options);
        
    },
    
    /**
     * Register for mousedown events
     */
    turnOn: function() {
		
        //this.mouseDown = this.mouseDown.bindAsEventListener(this);
        this.map.events.register( "mousedown", this, this.mouseDown);
        this.map.events.register( "mousemove", this, this.mouseMove);
         this.map.events.register( "mouseup", this, this.mouseUp);
    },

    /**
     *
     */
    turnOff: function() {

        this.map.events.unregister( "mousedown", this, this.mouseDown);
         this.map.events.unregister( "mousemove", this, this.mouseMove);
         this.map.events.unregister( "mouseup", this, this.mouseUp);
         
    },

    /**
    * @param {Event} evt
    */
    mouseDown: function(evt) {
    	this.map.div.style.cursor = "move";
        if (!OpenLayers.Event.isLeftClick(evt))
            return;

        this.mouseDragStart = evt.xy.clone();
        this.performedDrag  = false;
        document.onselectstart = function() { return false; }
        OpenLayers.Event.stop(evt);
    },

    /**
    * @param {Event} evt
    */
    mouseMove: function(evt) {
        // record the mouse position, used in onWheelEvent
        this.mousePosition = evt.xy.clone();
        //this.map.div.style.cursor = "move";
        if (this.mouseDragStart != null) {
           
                var deltaX = this.mouseDragStart.x - evt.xy.x;
                var deltaY = this.mouseDragStart.y - evt.xy.y;
                var size = this.map.getSize();
                var newXY = new OpenLayers.Pixel(size.w / 2 + deltaX,
                                                 size.h / 2 + deltaY);
                var newCenter = this.map.getLonLatFromViewPortPx(newXY);
                this.map.setCenter(newCenter, null, true);
                this.mouseDragStart = evt.xy.clone();
                
            }
            this.performedDrag = true;
        
    },

    /**
    * @param {Event} evt
    */
    mouseUp: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) 
            return;

            if (this.performedDrag) {
                this.map.setCenter(this.map.center);
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

   

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.DragPan"
});
