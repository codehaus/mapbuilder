/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */
OpenLayers.MouseListener.EditingListener.DrawPoint = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.DrawPoint.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener, {

    /** @type String */
    image: "stock-tool-pencil-22.gif",

    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(24,24),

    /**
     * @constructor
     */
    initialize: function() {
        OpenLayers.MouseListener.EditingListener.prototype.initialize.apply(this, arguments);
        this.geometry = new OpenLayers.Geometry.Point();
    },

    /** 
     * Function
     * 
     * Finalize the feature and add it to the vector layer.
     */
    _finalizeGeometry: function(){
        var feature = new OpenLayers.Feature();
        feature.setGeometry(this.geometry);
        this.map.vectorLayer.addFeatures(feature);
        
    },
    
    /**
     * Function
     * 
     * @param {Event} evt
     */
    mouseDown: function (evt) {
        // Double click manager
        if (this.lastDown && this.lastDown.x  == evt.xy.x && this.lastDown.y == evt.xy.y) {
            return;
        }
        
        OpenLayers.MouseListener.EditingListener.prototype.mouseDown.apply(this, arguments);
        this.geometry = new OpenLayers.Geometry.Point();
        this.geometry.x = evt.point.x;
        this.geometry.y = evt.point.y;
        this.map.vectorLayer.renderer.drawGeometry(this.geometry, this.style);
    },

    /**
     * Function
     * 
     * @param {Event} evt
     */
    mouseMove: function (evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseMove.apply(this, arguments);
        if (this.isMouseDown) {
            this.geometry.x = evt.point.x;
            this.geometry.y = evt.point.y;
            this.map.vectorLayer.renderer.drawGeometry(this.geometry, this.style);
        }
    },

    /**
     * Function
     * 
     * @param {Event} evt
     */
    mouseUp: function (evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseUp.apply(this, arguments);
        this._finalizeGeometry();
    },

    /**
     * Function
     * 
     * @param {Event} evt
     */
    keyDown: function(evt){
        OpenLayers.MouseListener.EditingListener.prototype.defaultKeyDown.apply(this, arguments);               
        switch (evt.keyCode){
            case OpenLayers.Event.KEY_RETURN:
                this.eraseTmpElements();
                if(this.geometry.path.length > 1){
                    this.finalizeGeometry();
                }           
                OpenLayers.Util.clearArray(this.geometry.path);
                break;
            case OpenLayers.Event.KEY_BACKSPACE:
            case OpenLayers.Event.KEY_DELETE:
            case OpenLayers.Event.KEY_ESC:
                this.eraseTmpElements();
                OpenLayers.Util.clearArray(this.geometry.path);
                OpenLayers.Event.stop(evt);
                break;
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener.DrawPoint"
    
});
