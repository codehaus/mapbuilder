/* Copyright (c) 2006 MetaCarta, Inc., published under the BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/release-license.txt 
 * for the full text of the license. */

/**
 * Create a vector layer by parsing a GML file. The GML file is
 * passed in as a parameter.
 * @class
 *
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/Ajax.js
 */

//OpenLayers.Layer.GeoRSSvector = OpenLayers.Class.create();
//OpenLayers.Layer.GeoRSSvector.prototype = 
//  OpenLayers.Class.inherit( OpenLayers.Layer.Vector, {
  
OpenLayers.Layer.GeoRSSvector = OpenLayers.Class(OpenLayers.Layer.Vector, {
  
    /**
      * Flag for whether the GeoRSS data has been loaded yet.
      * @type Boolean
      */
    loaded: false,

    format: null,
	
	/** store url of text file
    * @type str */
    url:null,


    /**
     * @constructor
     * 
     * @param {String} name
     * @param {String} url URL of a GeoRSS file.
     * @param {Object} options Hashtable of extra options to tag onto the layer.
     * Options renderer {Object}: Typically SvgRenderer or VmlRenderer.
     */
     initialize: function(name, url) {
	 
        var newArguments = new Array()
        newArguments.push(name);
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, newArguments);
        this.url = url;
		
	
		//OpenLayers.loadURL(url, null, this, this.parseData);
	
    },
	
    /**
     * Set the visibility flag for the layer and hide/show&redraw accordingly. 
     * Fire event unless otherwise specified
     * GML will be loaded if the layer is being made visible for the first
     * time.
     *  
     * @param {Boolean} visible Whether or not to display the layer 
     *                          (if in range)
     * @param {Boolean} noEvent
     */
    setVisibility: function(visibility, noEvent) {
        OpenLayers.Layer.Vector.prototype.setVisibility.apply(this, arguments);
        if(this.visibility && !this.loaded){
            // Load the GML
            this.loadGML();
        }
    },

    /**
     * If layer is visible and GML has not been loaded, load GML, then load GML
     * and call OpenLayers.Layer.Vector.moveTo() to redraw at the new location.
     * @param {Object} bounds
     * @param {Object} zoomChanged
     * @param {Object} minor
     */
    moveTo:function(bounds, zoomChanged, minor) {
        OpenLayers.Layer.Vector.prototype.moveTo.apply(this, arguments);
        // Wait until initialisation is complete before loading GML
        // otherwise we can get a race condition where the root HTML DOM is
        // loaded after the GML is paited.
        // See http://trac.openlayers.org/ticket/404
        if(this.visibility && !this.loaded){
            this.loadGML();
        }
    },

    loadGML: function() {
        if (!this.loaded) {
            var results = OpenLayers.loadURL(this.url, null, this, this.requestSuccess, this.requestFailure);
            this.loaded = true;
        }    
    },    
        
    
    /**
     * Process GML after it has been loaded.
     * Called by initialise() and loadUrl() after the GML has been loaded.
     * @private
     * @param {String} request
     */
    requestSuccess:function(request) {
    	
        var doc = request.responseXML;

        if (!doc || request.fileType!="XML") {
            doc = request.responseText;
        }

        var geoRSSgml = this.format ? new this.format() : new OpenLayers.Format.GeoRSSmb();
		
		var geoRSSfeatures = geoRSSgml.read(doc);
		
        this.addFeatures(geoRSSfeatures);
    },
    
    /**
     * Process a failed loading of GML.
     * Called by initialise() and loadUrl() if there was a problem loading GML.
     * @private
     * @param {String} request
     */
    requestFailure: function(request) {
        alert("Error in loading GML file "+this.url);
    },
    
	getFeatureByFid: function(fid) {
		var layer = this;
		if (!layer) {
			return null;
		}
		var features = layer.features;
		if (!features) {
			return null;
		}
		for (var i = 0; i < features.length; ++i) {
			if (features[i].fid == fid) {
				return features[i];
			}
		}
	},
	

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.GeoRSSvector"
    });
