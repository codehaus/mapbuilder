/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */
OpenLayers.MouseListener.EditingListener.DrawLinearRing = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.DrawLinearRing.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener, {
	/** @type String */
	id: "drawlinearring",
	
	/** @type String */
    imageOn:"EditPolygonEnable.png",
    
    /** @type String */
    imageOff:"EditPolygonDisable.png",
    
    /** @type String */
    type:"RadioButton",
    
    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(22,22),
    
    /**
     * @constructor
    ***/
    initialize: function(options) {
        OpenLayers.MouseListener.EditingListener.prototype.initialize.apply(this, arguments);
        options = options || [];
        OpenLayers.Util.extend(this, options);
        this.geometry = new OpenLayers.Geometry.LinearRing();
        this.tmpPoint = new OpenLayers.Geometry.Point();
        this.tmpLineString = new OpenLayers.Geometry.LineString();
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
    mouseDblClick: function (evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseDblClick.apply(this, arguments);
        
        this.mouseDown(evt);
        this._eraseTmpElements();
        if(this.geometry.path.length > 1){
            this._finalizeGeometry();
        }
    },

    /**
     * @param {Event} evt
     */    
    mouseDown: function (evt) {
        // Double click manager
        if (this.lastDown && this.lastDown.x  == evt.xy.x && this.lastDown.y == evt.xy.y) {
            return;
        }
        this.lastDown = evt.xy;
        
        OpenLayers.MouseListener.EditingListener.prototype.mouseDown.apply(this, arguments);
        
        if (evt.point == this.geometry.path[0]) {
            this._eraseTmpElements();
            this._finalizeGeometry();
        } else {
            this.geometry.addPoint(evt.point);
            this.map.vectorLayer.renderer.drawGeometry(evt.point, this.map.vectorLayer.style);
            this.map.vectorLayer.renderer.drawGeometry(this.geometry, this.map.vectorLayer.style);
        }
    },

    /**
     * @param {Event} evt
     */    
    mouseMove: function (evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseMove.apply(this, arguments);
        
        if (this.isMouseDown) {
            this.mouseDown(evt);
            
        } else {
            if (this.geometry.path.length > 0) {
                this.tmpPoint.x = evt.point.x;
                this.tmpPoint.y = evt.point.y;
                this.map.vectorLayer.renderer.drawGeometry(this.tmpPoint, this.style);
                this.tmpLineString.path[0] = this.geometry.path[this.geometry.path.length-2];
                this.tmpLineString.path[1] = evt.point;
                this.tmpLineString.path[2] = this.geometry.path[this.geometry.path.length-1];
                this.map.vectorLayer.renderer.drawGeometry(this.tmpLineString, this.style);
            }
        }
    },

    /**
     * @param {Event} evt
     */    
    keyDown: function(evt){
        OpenLayers.MouseListener.EditingListener.prototype.keyDown.apply(this, arguments);               
        switch (evt.keyCode){
            case OpenLayers.Event.KEY_RETURN:
                this._eraseTmpElements();
                if(this.geometry.path.length > 1){
                    this._finalizeGeometry();
                }           
                OpenLayers.Util.clearArray(this.geometry.path);
                break;
            case OpenLayers.Event.KEY_BACKSPACE:
            case OpenLayers.Event.KEY_DELETE:
            case OpenLayers.Event.KEY_ESC:
                this._eraseTmpElements();
                OpenLayers.Util.clearArray(this.geometry.path);
                OpenLayers.Event.stop(evt);
                break;
        }
    },
    
    /** 
     * Finalize the geometry from the current tool
     */
    _finalizeGeometry: function(){
        var feature = new OpenLayers.Feature();
        feature.setGeometry(this.geometry);
        this.geometry = new OpenLayers.Geometry.LinearRing();
        this.map.vectorLayer.addFeatures(feature);
    },


    _eraseTmpElements: function(){
        for(var i = 0; i < this.geometry.path.length; i++) {
            this.map.vectorLayer.renderer.eraseGeometry(this.geometry.path[i]);
        }
        this.map.vectorLayer.renderer.eraseGeometry(this.geometry);
        this.map.vectorLayer.renderer.eraseGeometry(this.tmpPoint);
        this.map.vectorLayer.renderer.eraseGeometry(this.tmpLineString);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener.DrawLinearRing"
    
});
