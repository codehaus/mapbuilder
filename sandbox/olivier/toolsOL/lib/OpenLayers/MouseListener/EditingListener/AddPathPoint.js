/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */

OpenLayers.MouseListener.EditingListener.AddPathPoint = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.AddPathPoint.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener, {

	/** @type String */
	id: "addpathpoint",
	
	/** @type String */
    imageOn:"AddPointEnable.png",
    
    /** @type String */
    imageOff:"AddPointDisable.png",
    
    /** @type String */
    type:"RadioButton",

    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(24,24),
    
    /**
     * @constructor
     */
    initialize: function(options) {
        OpenLayers.MouseListener.EditingListener.prototype.initialize.apply(this, arguments); 
        options = options || [];
        OpenLayers.Util.extend(this, options);
        this.geometry = null;
        this.editingModes = [];
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
        OpenLayers.MouseListener.EditingListener.prototype.mouseDown.apply(this, arguments);

        // reset position to resolve the snapping position conflict
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
        
        // add a new path point
        if (this.editingSelection) {
            
            var snappingData = OpenLayers.Util.getSegmentSnappingPoint(evt.point, this.editingSelection);
            
            console.log(this.map.snappingTolerance);
            
            if (snappingData && snappingData.distance < this.map.snappingTolerance * this.map.getResolution()) {
                snappingData.geometry.addPoint(snappingData.point, snappingData.index);
                this.map.vectorLayer.renderer.drawGeometry(this.editingSelection, this.map.vectorLayer.style);
                this._drawVertices(this.editingSelection);
                OpenLayers.MouseListener.EditingListener.MovePathPoint.prototype.mouseOver.apply(this, arguments);
            }
        }
    },

    /**
     * @param {Event} evt
     */     
    mouseUp: function (evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseUp.apply(this, arguments);
        
        if (this.editingSelection.feature) {
            this.map.vectorLayer.updateFeatures([this.editingSelection.feature]);
        }
    },

    /**
     * @param {Event} evt
     */     
    mouseOver: function(evt) {
        OpenLayers.MouseListener.EditingListener.MovePathPoint.prototype.mouseOver.apply(this, arguments);
    },

    /**
     * @param {OpenLayers.Geometry} geometry
     */     
    _drawVertices: function(geometry) {
        OpenLayers.MouseListener.EditingListener.MovePathPoint.prototype._drawVertices.apply(this, arguments);
    },

    /**
     * @param {OpenLayers.Geometry} geometry
     */     
    _eraseVertices: function(geometry) {
        OpenLayers.MouseListener.EditingListener.MovePathPoint.prototype._eraseVertices.apply(this, arguments);
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener.AddPathPoint"
    
});
