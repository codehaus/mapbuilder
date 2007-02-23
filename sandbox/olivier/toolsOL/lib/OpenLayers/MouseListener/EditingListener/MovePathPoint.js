/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */

OpenLayers.MouseListener.EditingListener.MovePathPoint = OpenLayers.Class.create();
OpenLayers.MouseListener.EditingListener.MovePathPoint.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener, {

	/** @type String */
	id: "movepathpoint",
	
	/** @type String */
    imageOn:"GetFeatureEnable.png",
    
    /** @type String */
    imageOff:"GetFeatureDisable.png",
    
    /** @type String */
    type:"RadioButton",

    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(24,24),
    
    /**
    * @constructor
    *
    * @param {array} points
    */
    initialize: function(options) {
        OpenLayers.MouseListener.EditingListener.prototype.initialize.apply(this, arguments);
        options = options || [];
        OpenLayers.Util.extend(this, options);
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

    mouseOver: function(evt) {
    	OpenLayers.MouseListener.EditingListener.prototype.mouseOver.apply(this, arguments);
		
		// display verctice
		if (!this.isMouseDown){
			if (evt.targetGeometry) {
			  	if(evt.targetGeometry.path || evt.targetGeometry.components) {
			  		this._eraseVertices(this.editingSelection);
					this.editingSelection = evt.targetGeometry;
	    			this._drawVertices(this.editingSelection);
	   			}
	    	} else {
	    		this._eraseVertices(this.editingSelection);
	    	}
    	}
    },
    
    mouseMove: function(evt) {
		OpenLayers.MouseListener.EditingListener.prototype.mouseMove.apply(this, arguments);
		if (this.isMouseDown) {
			if (this.vertexSelection) {
				this.vertexSelection.setX(this.vertexSelection.x + (evt.point.x - this.reference.x));
				this.vertexSelection.setY(this.vertexSelection.y + (evt.point.y - this.reference.y));
				this.reference = evt.point;
				this.map.vectorLayer.renderer.drawGeometry(this.vertexSelection, this.style);
				this.map.vectorLayer.renderer.drawGeometry(this.editingSelection, this.map.vectorLayer.style);
			}
		}
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
        
        if (evt.targetGeometry && evt.targetGeometry.isVertex) {
        	this.vertexSelection = evt.targetGeometry;
        	this.reference = evt.point;
        } else {
        	this.vertexSelection = null;
        }
    },

    /**
     * @param {Event} evt
     */
    mouseUp: function (evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseUp.apply(this, arguments);
        
        this.map.vectorLayer.renderer.drawGeometry(this.vertexSelection, this.map.vectorLayer.style);
        
        if (this.editingSelection.feature) {
            this.map.vectorLayer.updateFeatures([this.editingSelection.feature]);
        }
    },

    _drawVertices: function(geometry) {
    	if (geometry) {
	    	if (geometry.path) {
            
                var pathLength = geometry.path.length;
                
                // the last point of a linearRing is not draw
                if ( geometry.path[0].x == geometry.path[pathLength-1].x 
                  && geometry.path[0].y == geometry.path[pathLength-1].y ) {
                    pathLength = pathLength - 1;
                }
                
	    		for(var i = 0; i < pathLength; i++) {
	    			this.map.vectorLayer.renderer.drawGeometry(geometry.path[i], this.map.vectorLayer.style);
	   			}
                
	    	} else if (geometry.components) {
                
	    		for(var i = 0; i < geometry.components.length; i++) {
	    			this._drawVertices(geometry.components[i]);
	   			}
	    	}
    	}
    },
    
    _eraseVertices: function(geometry) {
    	if (geometry) {
	    	if (geometry.path) {
	    		for(var i = 0; i < geometry.path.length; i++) {
	    			this.map.vectorLayer.renderer.eraseGeometry(geometry.path[i]);
	   			}
	    	} else if (geometry.components) {
	    		for(var i = 0; i < geometry.components.length; i++) {
	    			this._eraseVertices(geometry.components[i]);
	   			}
	    	}
    	}
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.EditingListener.MovePathPoint"
});

