/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Store Style parameters for rendering vector layers.
 */
OpenLayers.Style = OpenLayers.Class.create();

/**
 * Default Style parameters.
 */
OpenLayers.Style.prototype = {

    fillColor: "orange",
    fillOpacity: 0.4, 
    hoverFillColor: "white",
    hoverFillOpacity: 0.8,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeWidth: 1,
    hoverStrokeColor: "red",
    hoverStrokeOpacity: 1,
    hoverStrokeWidth: 0.2,
    pointRadius: 6,
    hoverPointRadius: 1,
    hoverPointUnit: "%",
    pointerEvents: "visiblePainted",
    
    /** Pointer to the map object, used to calculate point width, height. */
    map: null,

    /** 
     * @constructor
     * @param {Object} object Optional parameters to pass into the object.
     * Parameters include: fillColor, fillOpacity, strokeColor, strokeOpacity,
     * strokeWidth, pointRadius. Also {OpenLayers.Map} map, which is a pointer
     * to the Map object - required to determine point width/height.
     */
    initialize: function(object) {
        OpenLayers.Util.extend(this, object);
// TBD: For some reason, the following code is not working for me.
// Needs further debugging.
//		// Convert pixels to percent otherwise the points will increase
//		// in size as you zoom in.
//		if(this.map){
//			if(this.strokeUnit!="%"){
//				this.strokeWidth=this.strokeWidth/this.map.getSize().w*100;
//				this.strokeUnit="%";
//			}
//			if(this.pointUnit!="%"){
//				this.pointRadius=this.pointRadius/this.map.getSize().w*100;
//				this.pointUnit="%";
//			}
//		}
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Style"
}

/*
 * Global styles
 */

OpenLayers.Style.DefaultRendererStyle = new OpenLayers.Style();
OpenLayers.Style.DefaultRendererSelectionStyle = new OpenLayers.Style({
    strokeWidth: 4,
    fillColor: "green",
    strokeColor: "green"
});
OpenLayers.Style.PointSnappingStyle = new OpenLayers.Style({
    fillColor: "blue",
    fillOpacity: 1,
    strokeColor: "blue",    
    strokeOpacity: 1,   
    strokeWidth: 1,                 
    pointRadius: 6,
    pointerEvents: "none"
});
OpenLayers.Style.SegmentSnappingStyle = new OpenLayers.Style({
    fillColor: "green",
    fillOpacity: 1,
    strokeColor: "green",
    strokeOpacity: 1,
    strokeWidth: 1,                       
    pointRadius: 6,
    pointerEvents: "none"
});
OpenLayers.Style.DefaultRendererTemporaryElementStyle = new OpenLayers.Style({
    fillOpacity: 0,
    strokeColor: "yellow",
    strokeOpacity: 1,
    strokeWidth: 1,   
    strokeUnit: "%",                    
    pointRadius: 6,
    pointUnit: "%",
    pointerEvents: "none"
});