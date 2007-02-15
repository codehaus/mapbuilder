/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */

OpenLayers.MouseListener.EditingListener.Selection = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.Selection.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener, {

    /** @type OpenLayers.Control.EditingAttributes */
    attributesControl: null,

    /**
    * @constructor
    *
    * @param {array} points
    */
    initialize: function() {
        OpenLayers.MouseListener.EditingListener.prototype.initialize.apply(this, arguments);
        this.style = OpenLayers.Style.DefaultRendererSelectionStyle;
        this.editingModes = [];
    },

    /**
     * @param {Event} evt
     */
    mouseDown: function(evt) {
        // Double click manager
        if (this.lastDown && this.lastDown.x  == evt.xy.x && this.lastDown.y == evt.xy.y) {
            return;
        }
        this.lastDown = evt.xy;
        
        OpenLayers.MouseListener.EditingListener.prototype.mouseDown.apply(this, arguments);
            
        // Display Feature attributes
        if(this.attributesControl && evt.targetGeometry && evt.targetGeometry.feature && evt.targetGeometry.feature.attributes) {
            this.attributesControl.setContent(evt.targetGeometry.feature.attributes);
        }
        
        // Geometry Selection
        if (evt.targetGeometry && evt.targetGeometry.feature && !evt.targetGeometry.isSnappingSegment){
            
            // Multiple geometry Selection
            if (this.shiftDown){
                
                // Verify if the geometry is selected
                if (OpenLayers.Util.indexOf(this.map.featureSelection, evt.targetGeometry.feature) < 0){
                    this.map.featureSelection.push(evt.targetGeometry.feature);
                    this.map.vectorLayer.renderer.drawGeometry(evt.targetGeometry, this.style);
                
                // UnSelect the geometry
                } else {
                    this.map.featureSelection = OpenLayers.Util.removeItem(this.map.featureSelection, evt.targetGeometry.feature);
                    this.map.vectorLayer.renderer.drawGeometry(evt.targetGeometry, this.map.vectorLayer.style);
                }
                
            // Reset the geometry selection
            } else {
                for(var i=0; i<this.map.featureSelection.length; i++) {
                	this.map.vectorLayer.renderer.drawGeometry(this.map.featureSelection[i].geometry, this.map.vectorLayer.style);
                }
                this.map.featureSelection = [];
                this.map.featureSelection = [evt.targetGeometry.feature];
                this.map.vectorLayer.renderer.drawGeometry(evt.targetGeometry.feature.geometry, this.style);
            }
        } else {
            for(var i=0; i<this.map.featureSelection.length; i++) {
            	this.map.vectorLayer.renderer.drawGeometry(this.map.featureSelection[i].geometry, this.map.vectorLayer.style);
            }
            this.map.featureSelection = [];
        }
        
        // initialize lastPositionReference wich is use to translate an an array of points
        var lonlat = this.map.getLonLatFromLayerPx(evt.xy);
        this.lastPositionReference =  new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
    },

    /**
     * @param {Event} evt
     */
    mouseMove: function (evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseMove.apply(this, arguments);
        
        if (this.isMouseDown){
            this.selectionChange = true;
            
            // new coordinates values
            var xTranslation = evt.point.x - this.lastPositionReference.x;
            var yTranslation = evt.point.y - this.lastPositionReference.y;
            
            var lonlat = this.map.getLonLatFromLayerPx(evt.xy);
            this.lastPositionReference =  new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
            
            // translate and draw the points
            for(var i=0; i<this.map.featureSelection.length; i++) {
                // Point Geometry
            	if (this.map.featureSelection[i].geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            	    this.map.featureSelection[i].geometry.setX( this.map.featureSelection[i].geometry.x + xTranslation);
                    this.map.featureSelection[i].geometry.setY( this.map.featureSelection[i].geometry.y + yTranslation);
            	            	    
            	// Path Geometry
            	} else if (this.map.featureSelection[i].geometry.path) {
            	    var path = this.map.featureSelection[i].geometry.path;
                    for(var iPath = 0; iPath < path.length; iPath++) {
                        if (this.map.featureSelection[i].geometry.CLASS_NAME != "OpenLayers.Geometry.LinearRing" || iPath != path.length-1) {
                            path[iPath].setX(path[iPath].x + xTranslation);
                            path[iPath].setY(path[iPath].y + yTranslation);
                        }
                    }
                    this.map.featureSelection[i].geometry.path = path;       	    
            	
            	// Aggregate Geometry
            	} else {
            	    
            	}
            	
            	this.map.vectorLayer.renderer.drawGeometry(this.map.featureSelection[i].geometry, this.style);
            }
        }
    },

    /**
     * @param {Event} evt
     */
    mouseUp: function (evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseUp.apply(this, arguments);
        
        // TBD check if this is working
        if (this.map.featureSelection.length > 0){
            this.map.vectorLayer.updateFeatures(this.map.featureSelection);
        }
    },
    
    /**
     * Copy the current featureSelection to the clipBoard
     */
    copyToClipBoard: function() {
        this.map.clipBoard = [];
        for (var i = 0; i < this.map.featureSelection.length; i++) {
            this.map.clipBoard.push(this.map.featureSelection[i].clone());
        }
    },
    
    /**
     * Paste features from the clipBoard
     */
    pasteFromClipBoard: function() {
        // TBD check if features geometry match the needed type
        for (var i = 0; i < this.map.clipBoard.length; i++) {
            if (this.map.clipBoard[i] instanceof OpenLayers.Feature) {
                this.map.vectorLayer.addFeatures(this.map.clipBoard[i]);
            }
        }
        console.log(this.map.vectorLayer.features);
    },

    /**
     * @param {Event} evt
     */
    keyDown: function(evt){
        OpenLayers.MouseListener.EditingListener.prototype.keyDown.apply(this, arguments);
        
        switch (evt.keyCode){
        case OpenLayers.Event.KEY_BACKSPACE:
        case OpenLayers.Event.KEY_DELETE:
            this.map.vectorLayer.removeFeatures(this.map.featureSelection);
            this.map.featureSelection = []
            OpenLayers.Event.stop(evt);
            break;
        case OpenLayers.Event.KEY_C:
            if (evt.ctrlKey) {
                this.copyToClipBoard();
            }
            break;
        case OpenLayers.Event.KEY_V:
            if (evt.ctrlKey) {
                this.pasteFromClipBoard();
            }
            break;
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener.Selection"
});

