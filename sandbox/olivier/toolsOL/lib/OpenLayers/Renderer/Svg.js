/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Renderer.js
 */
OpenLayers.Renderer.Svg = OpenLayers.Class.create();
OpenLayers.Renderer.Svg.prototype = OpenLayers.Class.inherit(OpenLayers.Renderer, {

    /**
     * SVG xmlns
     */    
    svgns: "http://www.w3.org/2000/svg",
    
    /**
     * constructor
     */
    initialize: function(element) {
        this.container = $(element);
        
        this.root = this._nodeFactory("g", this.container.id + "_root");
        this.root.setAttributeNS(null, "transform", "scale(1, -1)");
        
        this.svgRoot = this._nodeFactory("svg", this.container.id + "_svgRoot");
        this.svgRoot.appendChild(this.root);
        
        this.container.appendChild(this.svgRoot);
    },
    
    /**
     * function
     *
     * Remove all the elements of the root
     *
     */    
    clearRoot: function() {
        while (this.root.childNodes.length > 0) {
            this.root.removeChild(this.root.firstChild);
        }
    },

    /**
     * function
     *
     * Set the visible part of the layer.
     *
     * @param x {}
     * @param y {}
     * @param width {}
     * @param height {}
     */
    setExtent: function(x, y, width, height) {
        var lastResolution = this.extWidth / this.width;
        this.resolution = width / this.width;

        this.extWidth = width;
        this.extHeight = height;

        this.svgRoot.setAttributeNS(null, "viewBox",  x + " " + -y + " " + width + " " + height);
   
        if (this.resolution != lastResolution) {
            // reset stroke and point width for each svg node
            var childNodes = this.root.childNodes;
            var childNodesLength = childNodes.length;
            
            for (var i = 0; i < childNodesLength; i++) {
                var node = this.root.childNodes[i];
                var strokeWidth = this._getLenthFromResolutions(node.getAttributeNS(null, "stroke-width"), 
                                                                lastResolution, this.resolution);
                node.setAttributeNS(null, "stroke-width", strokeWidth);
                if (node.geometry && node.geometry.x != null && node.geometry.y != null) {
                    var radius = this._getLenthFromResolutions(node.getAttributeNS(null, "r"), 
                                                               lastResolution, this.resolution);
                    node.setAttributeNS(null, "r", radius);
                }
            }
        }
    },
    
    /**
     * function
     *
     * sets the size of the drawing surface
     *
     * @param size {OpenLayers.Size} the size of the drawing surface
     */
    setSize: function(size) {
        this.width = size.w;
        this.height = size.h;

        this.svgRoot.setAttributeNS(null, "width", this.width);
        this.svgRoot.setAttributeNS(null, "height", this.height);
    },
    
    /**
     * function
     * 
     * returns a geometry from an event.
     *
     * @param evt {Object} an OpenLayers.Event object
     *
     * @return {Geometry} the geometry associated with the event, or null
     */
    getGeometryFromEvent: function(evt) {
        var node = evt.target || evt.srcElement;
        return node.geometry ? node.geometry : null
    },
    
    /** 
     * draw a geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     */
    drawGeometry: function(geometry, style) {
        OpenLayers.Renderer.prototype.drawGeometry.apply(this, arguments);
    },
    
    /**
     * function
     *
     * erases a geometry
     * @param layer {Object} the layer to draw on
     * @param geometry {Geometry} a geometry to draw
     */
    eraseGeometry: function(geometry) {
        element = $(geometry.id);
        if (element && element.parentNode) {
        
            // destroy the geometry reference to resolve memory leaks problem.
            if (element.geometry) {
                element.geometry = null;
            }
            
            element.parentNode.removeChild(element);
        }
        return geometry;
    },
      
    /** 
     * function
     *
     * draw a point geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawPoint: function(geometry, style) {
        var node = this._nodeFactory("circle", geometry.id);
        node.geometry = geometry;
        node.setAttributeNS(null, "cx", geometry.x);
        node.setAttributeNS(null, "cy", geometry.y);

        node.setAttributeNS(null, "r", this._getLenthFromResolutions(style.pointRadius, 
                                                                     1, this.resolution));
        
        this._setStyle(node, style, true, true);
        this.root.appendChild(node);

        return node;
    },
    
    /** 
     * function
     *
     * draw a line geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawLineString: function(geometry, style) {
        var node = this._nodeFactory("polyline", geometry.id);
        this._setStyle(node, style, false, true);
        node.geometry = geometry;
        node.setAttributeNS(null, "points", geometry.path);  
        this.root.appendChild(node);
    },
    
    /** 
     * function
     *
     * draw a linear ring geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawLinearRing: function(geometry, style) {
        var node = this._nodeFactory("polygon", geometry.id);
        node.geometry = geometry;
        node.setAttributeNS(null, "points", geometry.path);
        this._setStyle(node, style, true, true);
        this.root.appendChild(node);
    },
    
    /** 
     * function
     *
     * draw a polygon geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawPolygon: function(geometry, style) {
        var node = this._nodeFactory("path", geometry.id);
        node.geometry = geometry;

        var d = "";
        for (var j = 0; j < geometry.components.length; j++) {
        	var linearRing = geometry.components[j];
        	d += " M";
        	for (var i = 0; i < linearRing.path.length; i++) {
                d += " " + linearRing.path[i];
	        }
        }
        d += " z";
        
        node.setAttributeNS(null, "d", d);
        node.setAttributeNS(null, "fill-rule", "evenodd");
        
        this._setStyle(node, style, true, true); 
        this.root.appendChild(node);
    },
    
    /** 
     * function
     *
     * draw a rectangular geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawRectangle: function(geometry, style) {
        var node = this._nodeFactory("rect", geometry.id);
        node.geometry = geometry;
        node.setAttributeNS(null, "x", geometry.x);
        node.setAttributeNS(null, "y", geometry.y);
        node.setAttributeNS(null, "width", geometry.width);
        node.setAttributeNS(null, "height", geometry.height);
        this._setStyle(node, style, true, true);
        this.root.appendChild(node);
    },
    
    /** 
     * function
     *
     * draw a cirle geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawCircle: function(geometry, style) {
        var node = this._nodeFactory("circle", geometry.id);
        node.geometry = geometry;
        node.setAttributeNS(null, "cx", geometry.cx);
        node.setAttributeNS(null, "cy", geometry.cy);
        node.setAttributeNS(null, "r", geometry.r);
        this._setStyle(node, style, true, true);
        this.root.appendChild(node);
    },
    
    /** 
     * function
     *
     * draw a Curve geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawCurve: function(geometry, style) {
        var node = this._nodeFactory("path", geometry.id);
        node.geometry = geometry;
        var d = null;
        for (var i = 0; i < geometry.path.length; i++) {
            if ((i%3) == 0 && (i/3) == 0) {
                d ="M " +geometry.path[i];
            } else if ((i%3) == 1) {
                d = d+ " C " +geometry.path[i];
            } else {
                d = d+ " " +geometry.path[i];
            }
        }
        node.setAttributeNS(null, "d", d);
        this._setStyle(node, style, false, true);
        this.root.appendChild(node);
    },
    
    /** 
     * function
     *
     * draw a surface geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawSurface: function(geometry, style) {
        var node = this._nodeFactory("path", geometry.id);
        node.geometry = geometry;

        // create the svg path string representation
        var d = null;
        for (var i = 0; i < geometry.path.length; i++) {
            if ((i%3) == 0 && (i/3) == 0) {
                d ="M " +geometry.path[i];
            } else if ((i%3) == 1) {
                d = d+ " C " +geometry.path[i];
            } else {
                d = d+ " " +geometry.path[i];
            }
        }
        d = d+ " Z";
        node.setAttributeNS(null, "d", d);
        this._setStyle(node, geometry.style, true, true);
        this.root.appendChild(node);
    },

    /** 
     * function
     *
     * Use to set all the style attributes to a SVG node.
     *
     * @param node {SvgDomElement} an SVG element to decorate
     * @param style {Style} a style to apply
     * @param isFilled {boolean} 
     * @param isStroked {boolean} 
     */
    _setStyle: function(node, style, isFilled, isStroked) {
 
        if (!node.renderStyle) {
            node.renderStyle = style;
        }
              
        if (isFilled) {
            node.setAttributeNS(null, "fill", style.fillColor);
            node.setAttributeNS(null, "fill-opacity", style.fillOpacity);
        } else {
            node.setAttributeNS(null, "fill", "none");
        }

        if (isStroked) {
            node.setAttributeNS(null, "stroke", style.strokeColor);
            node.setAttributeNS(null, "stroke-opacity", style.strokeOpacity);
            node.setAttributeNS(null, "stroke-width", this._getLenthFromResolutions(style.strokeWidth, 1, this.resolution));
        } else {
            node.setAttributeNS(null, "stroke", "none");
        }
        
        if (style.pointerEvents) {
            node.setAttributeNS(null, "pointer-events", style.pointerEvents);
        }

        if (!parent) {
            this.root.appendChild(node);
        }
        
        return node;
    },
        
    _getLenthFromResolutions: function(length, currentResolution, newResolution) {
        return newResolution * (length / currentResolution);
    },
   
    /** 
     * function
     *
     * Manage SVG node.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    _nodeFactory: function(type, id) {
        if ($(id)) {
            var node = $(id);
            if (type != node.nodeName) {
                node.parentNode.removeChild(node);
                node = this._nodeFactory(type, id);
            }
        } else {
            var node = document.createElementNS(this.svgns, type);
            if (id) {
                node.setAttributeNS(null, "id", id);
            }
        }
        
        return node;
    },
   
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Renderer.Svg"
});
