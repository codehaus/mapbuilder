/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */

OpenLayers.MouseListener.EditingListener.RemovePathPoint = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.RemovePathPoint.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener, {

    /** @type String */
    image: "remove-point.gif",

    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(24,24),

    /** @type Integer */
    tolerance: 5,
    
    /**
     * @constructor
     */
    initialize: function() {
        OpenLayers.MouseListener.EditingListener.prototype.initialize.apply(this, arguments); 
        this.geometry = null;  
    },

    mouseOver: function(evt) {
    	OpenLayers.MouseListener.EditingListener.MovePathPoint.prototype.mouseOver.apply(this, arguments);
    },

    mouseDown: function(evt) {
        // Double click manager
        if (this.lastDown && this.lastDown.x  == evt.xy.x && this.lastDown.y == evt.xy.y) {
            return;
        }
        this.lastDown = evt.xy;
        
        OpenLayers.MouseListener.EditingListener.prototype.mouseDown.apply(this, arguments);

        if (evt.targetGeometry && evt.targetGeometry.isVertex) {
            if (this.editingSelection) {
                this._eraseVertices(this.editingSelection);
                this._removePathPoint(this.editingSelection, evt.targetGeometry);
                this.map.vectorLayer.renderer.drawGeometry(this.editingSelection, this.map.vectorLayer.style);
                this._drawVertices(this.editingSelection);
            }
        }
    },
    
    _drawVertices: function(geometry) {
        OpenLayers.MouseListener.EditingListener.MovePathPoint.prototype._drawVertices.apply(this, arguments);
    },
    
    _eraseVertices: function(geometry) {
        OpenLayers.MouseListener.EditingListener.MovePathPoint.prototype._eraseVertices.apply(this, arguments);
    },
    
    _removePathPoint: function (geometry, point) {
        if (geometry.path) {
            geometry.removePoint(point);
        } else if (geometry.components) {
            for (var i = 0; i < geometry.components.length; i++) {
                this._removePathPoint(geometry.components[i], point);
            }
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener.RemovePathPoint"
    
});
