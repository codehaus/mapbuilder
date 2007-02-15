/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Create a vector layer by parsing a GML file. The GML file is
 * passed in as a parameter.
 * @class
 *
 * @requires OpenLayers/Layer/Vector.js
 */
OpenLayers.Layer.GML = OpenLayers.Class.create();
OpenLayers.Layer.GML.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Vector, {

    /**
     * @constructor
     * 
     * @param {String} name
     * @param {String} href URL of a GML file.
     * @param {Object} options Hashtable of extra options to tag onto the layer.
     * Options renderer {Object}: Typically SvgRenderer or VmlRenderer.
     */
     initialize: function(name, href, options) {
        var newArguments=new Array()
        newArguments.push(name, options);
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, newArguments);
        this.href=href;
        this.gmlLoad=false;
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
        if(this.visibility && !this.gmlLoad){
            this.gmlLoad=true;
            // Load the GML
            var results = OpenLayers.loadURL(this.href, null, this, this.requestSuccess, this.requestFailure);
        }
        var newArguments=new Array()
        newArguments.push(visibility,noEvent);
        OpenLayers.Layer.Vector.prototype.setVisibility.apply(this, newArguments);
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
        if(this.visibility && !this.gmlLoad){
            this.gmlLoad=true;
            // Load the GML
            var results = OpenLayers.loadURL(this.href, null, this, this.requestSuccess, this.requestFailure);
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
            doc = OpenLayers.parseXMLString(request.responseText);
        }

        var gml = new OpenLayers.Parser.GML();
        gml.load(doc);
        var featureCollection = gml.featureCollection;
        
        this.addFeatures(featureCollection);
    },
    
    /**
     * Process a failed loading of GML.
     * Called by initialise() and loadUrl() if there was a problem loading GML.
     * @private
     * @param {String} request
     */
    requestFailure: function(request) {
        alert("Error in loading GML file "+this.href);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.GML"
    });
