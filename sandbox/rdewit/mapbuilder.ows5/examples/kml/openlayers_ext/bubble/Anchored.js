/* Copyright (c) 2006-2007 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @requires OpenLayers/Popup.js
 * 
 * Class: OpenLayers.Popup.Anchored
 * 
 * NOTE: The anchored popup abstraction is obsolete. That is, a "non-anchored" 
 * popup was really just an anchored popup implicitly anchored with its top-left 
 * position at its lon lat. I've moved the anchored code into the general popup 
 * class, but left this class here for backward compatibility.
 * 
 * This code does still try to position the element relative to its anchor,
 * though there seems to be very little need (the calculations aren't hard),
 * and there doesn't seem to be a well defined interface between anchors
 * stating what attributes they should have in order to position correctly.
 * Yes, the previous code before needed "size" and "offset" attributes,
 * but using only the popup.html example, it seems offset is not needed,
 * and only one value from the size is used to position the popup correctly.
 * 
 * Inherits from:
 *  - <OpenLayers.Popup>
 */

OpenLayers.Popup.Anchored.Google = 
  OpenLayers.Class(OpenLayers.Popup, {

    /**
     * Parameter: anchor
     * {Object} Object to which we'll anchor the popup. Must expose a 
     *     'size' (<OpenLayers.Size>) and 'offset' (<OpenLayers.Pixel>).
     */
    anchor: null,
    
    /** 
    * Constructor: OpenLayers.Popup.Anchored
    * 
    * Parameters:
    * id - {String}
    * lonlat - {<OpenLayers.LonLat>}
    * size - {<OpenLayers.Size>}
    * contentHTML - {String}
    * anchor - {Object} Object which must expose a 'size' <OpenLayers.Size> 
    *     and 'offset' <OpenLayers.Pixel> (generally an <OpenLayers.Icon>).
    * closeButton - {Boolean}
    */
    initialize:function(id, lonlat, size, contentHTML, anchor, closeButton) {
        this.anchor = (anchor != null) ? anchor :
            {size: new OpenLayers.Size(0,0), offset: new OpenLayers.Pixel(0,0)};

        OpenLayers.Popup.prototype.initialize.apply(this,
            [id, lonlat, size, contentHTML, closeButton]);
    },
    
    /**
     * Not sure if this is the code that should be here, but is here for backward
     * compatibility. See above.
     * @param {Object} px
     * @param {Object} size
     */
    calculateRelativePosition: function(px, size) {
        
        if (this.anchor) {
            px.y -= this.anchor.size.h / 2;
        }
        
        return OpenLayers.Popup.prototype.calculateRelativePosition.apply(this,
            [px, size]);
    },

    CLASS_NAME: "OpenLayers.Popup.Anchored"
});
