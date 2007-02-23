/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
 
 /**
 * @class
 *
 * @requires OpenLayers/Control/Reset.js
 */
OpenLayers.MouseListener.Reset = OpenLayers.Class.create();
OpenLayers.MouseListener.Reset.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener, {
//this._addButton("zoombox", "drag-rectangle-off.png", "drag-rectangle-on.png", centered, sz, "Shift->Drag to zoom to area");
       
   /** @type String */
	id: "zoomworld",
	
	/** @type String */
    imageOff:"ResetExtentDisable.png",

    /** @type String */
    type:"Button",
    
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
     * Register for mousedown events
     */
    doSelect: function() {
	
		this.map.zoomToMaxExtent(); 

    },
  


   


    CLASS_NAME: "OpenLayers.MouseListener.Reset"
    
});
