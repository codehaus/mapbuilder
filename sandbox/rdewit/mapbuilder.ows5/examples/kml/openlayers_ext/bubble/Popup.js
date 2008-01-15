/* Copyright (c) 2006-2007 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Class: OpenLayers.Popup
 *
 * A popup is a small div that can opened and closed on the map.
 * Typically opened in response to clicking on a marker.  
 * See <OpenLayers.Marker>.  Popup's don't require their own
 * layer and are added the the map using the <OpenLayers.Map.addPopup>
 * method.
 *
 * Example:
 * (code)
 * popup = new OpenLayers.Popup("chicken", 
 *                    new OpenLayers.LonLat(5,40),
 *                    new OpenLayers.Size(200,200),
 *                    "example popup",
 *                    true);
 *       
 * map.addPopup(popup);
 * (end)
 */

OpenLayers.Position = {
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_RIGHT: "bottom-right"   
};

OpenLayers.Popup.Google = OpenLayers.Class({

    /**
     * Constant: SHIFT_ANIMATION_TIME
     * {Integer} The number of milliseconds a resize animation should take.
     */
    RESIZE_ANIMATION_TIME: 2000,
    
    /**
     * Constant: SHIFT_INTERVAL
     * {Integer} The interval (in milliseconds) at which the popup should resize
     * during a resize animation.
     */
    RESIZE_INTERVAL: 10,
    
    resizeTimeoutId: null,

    /** 
     * Property: events  
     * {<OpenLayers.Events>} custom event manager 
     */
    events: null,
    
    /** Property: id
     * {String} the unique identifier assigned to this popup.
     */
    id: "",

    /** 
     * Property: lonlat 
     * {<OpenLayers.LonLat>} the position of this popup on the map
     */
    lonlat: null,

    /** 
     * Property: div 
     * {DOMElement} the div that contains this popup.
     */
    div: null,

    /** 
     * Property: size 
     * {<OpenLayers.Size>} the width and height of the popup.
     */
    size: null,    

    /** 
     * Property: contentHTML 
     * {String} The HTML that this popup displays.
     */
    contentHTML: "",
    
    /** 
     * Property: opacity 
     * {float} the opacity of this popup (between 0.0 and 1.0)
     */
    opacity: "",

    /** 
     * Property: map 
     * {<OpenLayers.Map>} Reference to the map.
     */
    map: null,
    
    /**
     * Property: closeButton
     * {Boolean} true if a closeButton should be put in this popup. 
     * Defaults to true.
     */
    closeButton : true,
    
    /** 
     * Property: relativePosition
     * {<OpenLayers.Position>} Relative position of the popup in relation
     * to its lonlat value. Defaults to TOP_LEFT.
     */
    relativePosition: OpenLayers.Position.TOP_LEFT,
    
    /**
     * APIMethod: onLoad
     * {Function} Optional function to be called when the popup is fully drawn.
     */
    onLoad : function() {},
    
    /**
     * APIMethod: onClose
     * {Function} Optional function to be called when close button is clicked.
     */
    onClose : function() {},
    
    /**
     * Property: sizeTween
     * 
     * {<OpenLayers.Tween>} - animation tween
     */
    sizeTween: new OpenLayers.Tween(OpenLayers.Easing.Expo.easeOut),
    
    /** 
     * Constructor: OpenLayers.Popup
     * Create a popup.
     * 
     * Parameters: 
     * id - {String} a unqiue identifier for this popup.  If null is passed
     *     an identifier will be automatically generated. 
     * lonlat - {<OpenLayers.LonLat>} The position on the map the popup will
     *     be shown.
     * size - {<OpenLayers.Size>} The size of the popup. If null, the popup will
     *     try to determine the correct size on its own.
     * content - {String or DOM element} The HTML content to display inside
     *     the popup.  Or a DOM element.
     * closeButton - {Boolean} Whether to display a close button inside the popup. 
     *     Defaults to true.
     */
    initialize:function(id, lonlat, size, content, closeButton) {
        if (id == null) {
            id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
        }

        this.id = id;
        this.lonlat = lonlat;
        
        if (closeButton != null) {
            this.closeButton = closeButton;
        }
        
        // Create main division. For now (until the popup receives the draw
        // command), position the div offscreen, absolutely, so it can be
        // rendered without being seen by the user.
        this.div = OpenLayers.Util.createDiv(id, null, this.size, null,
            "absolute", null);
        this.div.className = 'olPopup';
        this.div.style.overflow = "auto";
        /*
        TODO is this needed ?
        seems to cause display bugs
        this.div.style.left="-9999999999px";
        this.div.style.top="0px";
        */
        
        // If we were passed HTML, use that. Otherwise, treat the content as a DOM element.
        if(typeof content == "string") {
            this.div.innerHTML = content;
        } else {
            this.div.appendChild(content)
        }
        
        if (size != null) {
			this.size = size.clone();
        }
        
        this.registerEvents();
        
        this.sizeTween = new OpenLayers.Tween(OpenLayers.Easing.Expo.easeOut);
        
        // Not sure if this should be here or elsewhere...
        
        // Although in some windowing systems there is a chance that the scroll
        // bar may change widths while our application is running, lets assume it
        // won't only calculate it once.
        if (!OpenLayers.Popup.SCROLL_BAR_WIDTH) {
            // We have to set this at a time after the document has loaded...
            OpenLayers.Popup.SCROLL_BAR_WIDTH = OpenLayers.Util.getScrollBarWidth();
        }
    },
    
    /**
     * TODO add doc
     */
    getPackedSize: function() {
        return OpenLayers.Util.getDOMElementPackedSize(this.div);
    },
    
    /**
     * Resize the popup to the size given. If no size is passed,
     * the popup will size to the width/height of its content.
     * 
     * Note: The size passed to this function refers to the size of
     * the content, not the size of the containing div. The size of
     * the containing div is always reactive to the size of the content.
     */ 
    resize: function(newSize) {
        
        var from = {
            w: this.size.w,
            h: this.size.h
        };
        var to = {
            w: newSize.w,
            h: newSize.h
        };
        
        var step = function(object) {
            var size = new OpenLayers.Size(object.w, object.h);
            this.setSize(size, true);
        };
        
        this.sizeTween.start(from, to, 50, 
            {
                eachStep: OpenLayers.Function.bind(step, this),
                done: OpenLayers.Function.bind(this.shiftMapIfNotViewable, this)
            }
        );
    },
        
    /**
     * TODO: is this used ? in inherited classes ?
     */
    pack: function() {
        this.resize(this.getPackedSize());
    },
    
    /**
     * TODO: add doc
     */
    shiftMapIfNotViewable : function(alternateSize) {
        var sizeToUse = (alternateSize != null) ? alternateSize : this.size;
        
        var mapSize = this.map ? this.map.getSize() : null;
        var popupPosition = this.calculateRelativePosition(this.map.getViewPortPxFromLonLat(this.lonlat), sizeToUse);
    
        // Get the current center before any shift.
        var center = this.map.getViewPortPxFromLonLat(this.map.getCenter());
        var newCenter = center.clone();
        
        var top = popupPosition.y;
        var right = popupPosition.x + sizeToUse.w;
        var bottom = popupPosition.y + sizeToUse.h;
        var left = popupPosition.x;
        
        // TODO: check race condition
        // what if left is not visible and right is not visible ?
        
        // If left is not visible...
        if (left < OpenLayers.Popup.POPUP_MARGIN.left) {
            newCenter.x += left - OpenLayers.Popup.POPUP_MARGIN.left;
        }
         
        // If right is not visible...
        if (right > mapSize.w - OpenLayers.Popup.POPUP_MARGIN.right) {
            newCenter.x += parseInt(right - mapSize.w + OpenLayers.Popup.POPUP_MARGIN.right);
        }
        
        // If top is not visible...
        if (top < OpenLayers.Popup.POPUP_MARGIN.top) {
            newCenter.y += top - OpenLayers.Popup.POPUP_MARGIN.top;
        }
        
        // If bottom is not visible...
        if (bottom > mapSize.h - OpenLayers.Popup.POPUP_MARGIN.bottom) {
            newCenter.y += parseInt(bottom - mapSize.h + OpenLayers.Popup.POPUP_MARGIN.bottom);
        }
        
//        this.map.shiftToViewPortPx(newCenter);
        var dx = newCenter.x - center.x;
        var dy = newCenter.y - center.y;
        this.map.pan(dx, dy);
    },
    
    /** 
     * APIMethod: Set the size of the popup. This function makes
     * sure the popup does not get sized larger than the viewport.
     * 
     * TODO: complete doc, is this really an APIMethod ?
     */
    setSize: function(size, ignoreMapBounds) {
        if (!ignoreMapBounds) {
            size = this.constrainSizeToView(size);
        }
        
        this.size = size;
        
        this.div.style.width = this.size.w + "px";
        this.div.style.height = this.size.h + "px";
           
        this.updatePosition();
    },
    
    /*
     * TODO: complete doc
     */
    constrainSizeToView: function(size) {
        size = size.clone();
        
        // Restrict the size if it's greater than the map's viewport.
        var mapSize = this.map.size;
        
        // Calculate the difference between the container and the content
        // and scale the content accordingly.
        var heightDifference = size.h - 
            (mapSize.h - 
             OpenLayers.Popup.POPUP_MARGIN.top - 
             OpenLayers.Popup.POPUP_MARGIN.bottom);
        
        if (heightDifference > 0) {
            size.h -= heightDifference;
        }
        
        var widthDifference = size.w - 
            (mapSize.w - 
             OpenLayers.Popup.POPUP_MARGIN.left - 
             OpenLayers.Popup.POPUP_MARGIN.right +
             OpenLayers.Popup.SCROLL_BAR_WIDTH);
        
        if (widthDifference > 0) {
            size.w -= widthDifference;
        } else if (size.w + OpenLayers.Popup.SCROLL_BAR_WIDTH < mapSize.w){
            size.w += OpenLayers.Popup.SCROLL_BAR_WIDTH;
        }
        
        return size;
    },
    
    /**
     * TODO: doc
     */
    createCloseButton: function() {
        var oBtnClose = document.createElement("A");
        oBtnClose.id="olPopupCloseButton";
        oBtnClose.className="close";
        oBtnClose.style.position="absolute";
        oBtnClose.title="close popup";
        oBtnClose.href="#";
        this.div.appendChild(oBtnClose);
        
        // Register close button event.
        var closeEvents = new OpenLayers.Events(this, oBtnClose);
        closeEvents.register("mousedown", this, this.hide);
    },

    /** 
     * APIMethod: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function() {
        if (this.map != null) {
            this.map.removePopup(this);
        }
        this.div = null;
        this.map = null;
    },

    /** 
    * APIMethod: draw
    * Constructs the elements that make up the popup.
    *
    * Parameters:
    * px - {<OpenLayers.Pixel>} The top and left position of
    * the popup in pixels. 
    * 
    * Returns:
    * {DOMElement} Reference to a div that contains the drawn popup
    */
    draw: function(px) {
        // Only append the div to the body if it's not already appended somewhere.
        // This allows for "pre-rendering" offscreen where the user doesn't see it.
        if (!this.div.parentNode) {
            document.body.appendChild(this.div);
        }
        
        if (this.size == null) {
            this.setSize(this.getPackedSize());
        } else {
            this.setSize(this.size);
        }
        
        // Add a close button if needed.
        if (this.closeButton) {
            this.createCloseButton();
        }  
        
        this.onLoad();
        
        this.updatePosition();
        
        /*
         * by Pierre GIRAUD: I would prefer something like if (!viewable) { .. doSomething .. }
         */
        this.shiftMapIfNotViewable();
          
        return this.div;
    },
    
    /** 
     * Method: updatePosition
     * if the popup has a lonlat and its map members set, 
     * then have it move itself to its proper position
     * 
     * TODO: doc
     */
    updatePosition: function(px) {
        if (px == null && this.map) {
            px = this.map.getLayerPxFromLonLat(this.lonlat);
        }
        this.moveTo(px);           
    },
    
    /**
     * Method: calculateRelativePosition
     * 
     * Calculate the position of the popup (or what the popup should be)
     * given a starting pixel position and a size value.
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>} The top and left position of the popup div.
     * size - {<OpenLayers.Size>} The size of the popup div(or the size that 
     * it should be).
     * 
     * Returns: 
     * {<OpenLayers.Pixel>} The new top and left position of the popup div.
     */
    calculateRelativePosition: function(px, size) {
        
        px = px.clone();
        
        if (this.relativePosition == OpenLayers.Position.TOP_RIGHT ||
            this.relativePosition == OpenLayers.Position.BOTTOM_RIGHT) {
            px.x -= size.w;
        }
        
        if (this.relativePosition == OpenLayers.Position.BOTTOM_LEFT ||
            this.relativePosition == OpenLayers.Position.BOTTOM_RIGHT) {
            px.y -= size.h;
        }
        
        return px; 
    },

    /**
     * Method: moveTo
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>} the top and left position of the popup div. 
     */
    moveTo: function(px) {
        px = this.calculateRelativePosition(px, this.size);
        
        this.div.style.left = px.x + "px";
        this.div.style.top = px.y + "px";
    },

    /**
     * Method: visible
     *
     * Returns:      
     * {Boolean} Boolean indicating whether or not the popup is visible
     */
    visible: function() {
        return OpenLayers.Element.visible(this.div);
    },

    /**
     * Method: toggle
     * Toggles visibility of the popup.
     */
    toggle: function() {
        OpenLayers.Element.toggle(this.div);
    },

    /**
     * Method: show
     * Makes the popup visible.
     */
    show: function() {
        OpenLayers.Element.show(this.div);
    },

    /**
     * Method: hide
     * Makes the popup invisible.
     */
    hide: function() {
        if (this.map) {
			this.map.removePopup(this);
		}
        OpenLayers.Element.hide(this.div);
        this.onClose();
    },
    
    /**
     * Method: setOpacity
     * Sets the opacity of the popup.
     * 
     * Parameters:
     * opacity - {float} A value between 0.0 (transparent) and 1.0 (solid).   
     */
    setOpacity:function(opacity) { 
        if (opacity != undefined) {
            this.opacity = opacity; 
        }
        
        if (this.div != null) {
            // for Mozilla and Safari
            this.div.style.opacity = this.opacity;

            // for IE
            this.div.style.filter = 'alpha(opacity=' + this.opacity*100 + ')';
        }
    },  

    /** 
     * Method: registerEvents
     * Registers events on the popup.
     *
     * Do this in a separate function so that subclasses can 
     *   choose to override it if they wish to deal differently
     *   with mouse events
     * 
     *   Note in the following handler functions that some special
     *    care is needed to deal correctly with mousing and popups. 
     *   
     *   Because the user might select the zoom-rectangle option and
     *    then drag it over a popup, we need a safe way to allow the
     *    mousemove and mouseup events to pass through the popup when
     *    they are initiated from outside.
     * 
     *   Otherwise, we want to essentially kill the event propagation
     *    for all other events, though we have to do so carefully, 
     *    without disabling basic html functionality, like clicking on 
     *    hyperlinks or drag-selecting text.
     */
    registerEvents:function() {
        this.events = new OpenLayers.Events(this, this.div, null, true);
        this.events.register("mousedown", this, this.onmousedown);
        this.events.register("mousemove", this, this.onmousemove);
        this.events.register("mouseup", this, this.onmouseup);
        this.events.register("click", this, this.onclick);
        this.events.register("mouseout", this, this.onmouseout);
        this.events.register("dblclick", this, this.ondblclick);
        this.events.register("mouseover", this, this.onmouseover);
    },

    /** 
     * Method: onmousedown 
     * When mouse goes down within the popup, make a note of
     *   it locally, and then do not propagate the mousedown 
     *   (but do so safely so that user can select text inside)
     * 
     * Parameters:
     * evt - {Event} 
     */
    onmousedown: function (evt) {
        this.mousedown = true;
        OpenLayers.Event.stop(evt, true);
    },

    /** 
     * Method: onmousemove
     * If the drag was started within the popup, then 
     *   do not propagate the mousemove (but do so safely
     *   so that user can select text inside)
     * 
     * Parameters:
     * evt - {Event} 
     */
    onmousemove: function (evt) {
        if (this.mousedown) {
            OpenLayers.Event.stop(evt, true);
        }
    },
    
    // Do nothing. It's here for child classes.
    onmouseover: function(evt) {},

    /** 
     * Method: onmouseup
     * When mouse comes up within the popup, after going down 
     *   in it, reset the flag, and then (once again) do not 
     *   propagate the event, but do so safely so that user can 
     *   select text inside
     * 
     * Parameters:
     * evt - {Event} 
     */
    onmouseup: function (evt) {
        if (this.mousedown) {
            this.mousedown = false;
            OpenLayers.Event.stop(evt, true);
        }
    },

    /**
     * Method: onclick
     * Ignore clicks, but allowing default browser handling
     * 
     * Parameters:
     * evt - {Event} 
     */
    onclick: function (evt) {
        OpenLayers.Event.stop(evt, true);
    },

    /** 
     * Method: onmouseout
     * When mouse goes out of the popup set the flag to false so that
     *   if they let go and then drag back in, we won't be confused.
     * 
     * Parameters:
     * evt - {Event} 
     */
    onmouseout: function (evt) {
        this.mousedown = false;
    },
    
    /** 
     * Method: ondblclick
     * Ignore double-clicks, but allowing default browser handling
     * 
     * Parameters:
     * evt - {Event} 
     */
    ondblclick: function (evt) {
        OpenLayers.Event.stop(evt, true);
    },

    CLASS_NAME: "OpenLayers.Popup"
});

/**
 * APIProperty: margin
 * {<OpenLayers.Bounds>} Left, bottom, right, and top margins constraining
 * both a popup's size as well as where the map is shifted when shown.
 * The data container use is an OpenLayers.Bounds instance, it is not meant
 * to be used like a traditional OpenLayers.Bounds. For instance, to specify
 * a margin with only a right value, one would do the following, stating
 * that a popup should be contstrained 15 pixels left of the map's right
 * side:
 * 
 * new OpenLayers.Bounds(0, 0, 15, 0);
 */
OpenLayers.Popup.POPUP_MARGIN = new OpenLayers.Bounds(0, 0, 0, 0);

