/* Copyright (c) 2006-2007 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @requires OpenLayers/Popup/Anchored.js
 * 
 * Class: OpenLayers.Popup.AnchoredBubble
 * 
 * Inherits from: 
 *  - <OpenLayers.Popup.Anchored>
 */
OpenLayers.Popup.AnchoredBubble.Google = 
  OpenLayers.Class(OpenLayers.Popup.Anchored, {
    
    // This implementation of AnchoredBubble popups rely on
    // a relative position in the lower right corner.
    relativePosition: OpenLayers.Position.BOTTOM_RIGHT,
    
    // These "magic numbers" are very coupled with data set within CSS.
    CONTENT_PADDING: 15,
    PADDING_BOTTOM: 78,
    SHADOW_SIZE: 15,
    
    /**
     * Constant: MARKER_OFFSET
     * The x and y offset needed position the stem image over the marker.
     */
    MARKER_OFFSET: new OpenLayers.Pixel(55, 13),
    
    TL: null,
    TM: null, 
    TR: null,
    ML: null,
    MR: null,
    BL: null,
    BM: null,
    BR: null,
    
    frameDiv: null,
    contentDiv: null,
    
    initialize:function(id, lonlat, size, contentHTML, anchor, closeButton) {
        
        OpenLayers.Popup.Anchored.prototype.initialize.apply(this, arguments);
         
        this.frameDiv = OpenLayers.Util.createDiv(this.id + "Frame", null, this.size, null, "static", null);
        this.frameDiv.className = "olBubbleFrame";
        this.frameDiv.style.display = "block";
        this.frameDiv.style.position = "absolute";
        this.frameDiv.style.left="-9999999999px";
        this.frameDiv.style.top="0px";
        
        this.contentDiv = this.div;
        
        // Swap the current div for the main div.
        var parentNode = this.div.parentNode;
        this.frameDiv.appendChild(this.div);
        
        if (parentNode) {
            parentNode.appendChild(this.frameDiv);
        }
        
        this.div = this.frameDiv;
        
        this.createFrameDivs();
        this.appendImagesToFrame();
        
        this.contentDiv.style.left = this.CONTENT_PADDING + "px";
        this.contentDiv.style.top = this.CONTENT_PADDING + "px";
        
        // Make the contentDiv relative to prevent scrollbar flicker.
        this.contentDiv.style.position = "relative";
    },
    
    // Stylistic functions.
    
    /**
     * Create the images that will act as the frame, and put them in the
     * right position relative to their containing div.
     */
    createFrameDivs: function() {
        var imgPath = OpenLayers.ImgPath;
        this.TL = this.createFrameDiv("top-left");
        this.TM = this.createFrameDiv("top-middle");
        this.TR = this.createFrameDiv("top-right");
        this.ML = this.createFrameDiv("middle-left");
        this.MR = this.createFrameDiv("middle-right");
        this.BL = this.createFrameDiv("bottom-left");
        this.BM = this.createFrameDiv("bottom-middle");
        this.BR = this.createFrameDiv("bottom-right");
    },
    
    /**
     * Create a single image with the src, top, right, bottom and left
     * specified. Top, right, bottom and left may either be strings or 
     * integers.
     */
    createFrameDiv: function(id) {
        var div = document.createElement("DIV");
        div.id = id;
        return div;
    },
    
    /**
     * Append the images to the frame. We make sure to insert them
     * before the contentDiv so the contentDiv stays on top.
     */
    appendImagesToFrame: function() {
        this.frameDiv.insertBefore(this.TL, this.contentDiv);
        this.frameDiv.insertBefore(this.TM, this.contentDiv);
        this.frameDiv.insertBefore(this.TR, this.contentDiv);
        this.frameDiv.insertBefore(this.ML, this.contentDiv);
        this.frameDiv.insertBefore(this.MR, this.contentDiv);
        this.frameDiv.insertBefore(this.BL, this.contentDiv);
        this.frameDiv.insertBefore(this.BM, this.contentDiv);
        this.frameDiv.insertBefore(this.BR, this.contentDiv);
    },
    
    /**
     * Set (and calculate) the size of the content div. This is the div
     * that holds all the popup's content.
     */
    adjustContentSize: function() {
        this.contentDiv.style.width = (this.size.w - this.totalHorizontalPadding()) + "px";
        this.contentDiv.style.height = (this.size.h - this.totalVerticalPadding()) + "px";
    },
    
    stringify: function(value) {
        return (typeof value == "string") ? value : value + "px";
    },
    
    totalHorizontalPadding: function() {
        return (2 * this.CONTENT_PADDING) + this.SHADOW_SIZE;
    },
    
    totalVerticalPadding: function() {
        return this.PADDING_BOTTOM;
    },

    // Behavior functions.
    
    /**
     * Override the original setSize() function to update the actual content
     * size as well as the size of the frame.
     */
    setSize: function(size, ignoreMapBounds) {
        
        OpenLayers.Popup.Anchored.prototype.setSize.apply(this, arguments);
        
        this.adjustContentSize();
    },
    
    getPackedSize: function() {
        var contentSize = OpenLayers.Util.getDOMElementPackedSize(this.contentDiv);
        
        // Add the width and height of the frame to the packed
        // height of the contentDiv. This way, the popup will include the
        // frame when sizing.
        
        contentSize.w += this.totalHorizontalPadding();
        contentSize.h += this.totalVerticalPadding();
        
        return contentSize;
    }, 
    
    /**
     * Override the calculateRelativePosition() function in order to add
     * make the popup stem positioned in the center of the marker.
     */
    calculateRelativePosition: function(px, size) {
        px.x += this.MARKER_OFFSET.x;
        px.y += this.MARKER_OFFSET.y;
        return OpenLayers.Popup.Anchored.prototype.calculateRelativePosition.apply(this, arguments);
    },

    CLASS_NAME: "OpenLayers.Popup.AnchoredBubble"
});

