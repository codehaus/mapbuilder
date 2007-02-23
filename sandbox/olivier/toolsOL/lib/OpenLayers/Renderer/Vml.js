/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Renderer.js
 */
OpenLayers.Renderer.Vml = OpenLayers.Class.create();
OpenLayers.Renderer.Vml.prototype = OpenLayers.Class.inherit(OpenLayers.Renderer, {

    /**
     * VML xmlns
     */
    vmlns: "urn:schemas-microsoft-com:vml",

    /**
     * constructor
     */
    initialize: function(element) {
        document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
        var style = document.createStyleSheet();
        style.addRule('v\\:*', "behavior: url(#default#VML);");

        this.container = $(element);
        this.vmlRoot = this._nodeFactory("div", this.container.id + "_vmlRoot");
        this.root = this._nodeFactory("v:group", this.container.id + "_root");
        this.vmlRoot.appendChild(this.root);

        this.container.appendChild(this.vmlRoot);
    },

    /**
     * function
     *
     * Remove all the elements of the root
     *
     */
    clear: function() {
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

        this.root.setAttribute("coordorigin", this._vmlParseFloat(x) + " " + this._vmlParseFloat(y));
        this.root.setAttribute("coordsize", this._vmlParseFloat(width) + " " + this._vmlParseFloat(-height));

        if (this.resolution != lastResolution) {
            // reset stroke and point width for each svg node
            var childNodes = this.root.childNodes;
            var childNodesLength = childNodes.length;

        	for (var i = 0; i < childNodesLength; i++) {
                var node = this.root.childNodes[i];
                if (node.geometry && node.geometry.x != null && node.geometry.y != null) {
                	var radius = this._getLenthFromResolutions((parseInt(node.style.width) / 2), 
                                                               lastResolution, this.resolution);
                    node.style.width = radius * 2;
        			node.style.height = radius * 2;
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

        this.vmlRoot.style.width = size.w;
        this.vmlRoot.style.height = size.h;

        this.root.style.width = size.w;
        this.root.style.height = size.h
    },

    /**
     * function
     *
     * returns a geometry from an event that happened on a layer.  How this
     * happens is specific to the renderer.
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
    eraseGeometry: function(geometry, style) {
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
     * draw a point geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawPoint: function(geometry, style) {
        var node = this._nodeFactory("v:shape", geometry.id);
		// Draw a circle by using an arc.
		// An arc is used instead of an oval so that we can use the
		// draw the circle around a center point instead of using
		// the top left.

        var radius = this._getLenthFromResolutions(style.pointRadius, 1, this.resolution);

        var path = this._nodeFactory("v:path", geometry.id+"_path");
        node.setAttribute("coordsize", "10 10");
		path.setAttribute("v","m 0,-5 at-5,-5,5,5,0,-5,0,-5 x e");
		node.appendChild(path);

        if(style.pointerEvents == "visiblePainted"){node.geometry = geometry;}
        node.style.left = this._vmlParseFloat(geometry.x);
        node.style.top = this._vmlParseFloat(geometry.y);
        node.style.width = radius * 2;
        node.style.height = radius * 2;

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

        var bbox = this._getVmlBoundingBox(geometry.path);

        var node = this._nodeFactory("v:shape", geometry.id);
        if(style.pointerEvents == "visiblePainted"){node.geometry = geometry;}
        // Set the internal coordinate system to draw the path
        node.style.left = bbox.x;
        node.style.top = bbox.y;
        node.style.width = bbox.width;
        node.style.height = bbox.height;

        node.coordorigin = "0 0";
        node.coordsize = this._vmlParseFloat(bbox.width)+ " " +this._vmlParseFloat(bbox.height);

        var path = "";
        for (var i = 0; i < geometry.path.length; i++) {
            if (i == 0) {
                path += "m " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y)+ " l";
            } else {
                path += " " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y)+ " l ";
            }
        }

        path += " e";

        node.path = path;

        this._setStyle(node, style, false, true);

        this.root.appendChild(node);

        return node;
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
        var bbox = this._getVmlBoundingBox(geometry.path);

        var node = this._nodeFactory("v:shape", geometry.id);
        if(style.pointerEvents == "visiblePainted"){node.geometry = geometry;}
        // Set the internal coordinate system to draw the path
        node.style.left = this._vmlParseFloat(bbox.x);
        node.style.top = this._vmlParseFloat(bbox.y);
        node.style.width = this._vmlParseFloat(bbox.width);
        node.style.height = this._vmlParseFloat(bbox.height);

        node.coordorigin = "0 0";
        node.coordsize = this._vmlParseFloat(bbox.width)+ " " +this._vmlParseFloat(bbox.height);

        var path = "";
        for (var i = 0; i < geometry.path.length; i++) {
            if (i == 0) {
                path += "m " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y)+ " l";
            } else{
                path += " " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y)+ " l ";
            }
        }
        path += " x e";

        node.path = path;

        this._setStyle(node, style, true, true);

        this.root.appendChild(node);

        return node;
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
        var bbox = this._getVmlBoundingBox(geometry.components[0].path);

        var node = this._nodeFactory("v:shape", geometry.id);
        if(style.pointerEvents == "visiblePainted"){node.geometry = geometry;}

        node.style.left = this._vmlParseFloat(bbox.x);
        node.style.top = this._vmlParseFloat(bbox.y);
        node.style.width = this._vmlParseFloat(bbox.width);
        node.style.height = this._vmlParseFloat(bbox.height);

        node.coordorigin = this._vmlParseFloat(bbox.x) + " " + this._vmlParseFloat(bbox.y);
        node.coordsize = this._vmlParseFloat(bbox.width)+ " " +this._vmlParseFloat(bbox.height);

        var path = "";
        for (var j = 0; j < geometry.components.length; j++) {
            var linearRing = geometry.components[j];
            if (j != 0) {
                path += " x ";
            }

            for (var i = 0; i < linearRing.path.length; i++) {
                if (i == 0) {
                    path += "m " +this._vmlParseFloat(linearRing.path[i].getX())+ "," +this._vmlParseFloat(linearRing.path[i].getY())+ " l";
                } else{
                    path += " " +this._vmlParseFloat(linearRing.path[i].getX())+ "," +this._vmlParseFloat(linearRing.path[i].getY());
                }

            }
        }
        path += " x e";

        node.path = path;

        this._setStyle(node, style, true, true);

        this.root.appendChild(node);


        return node;
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

        var node = this._nodeFactory("v:rect", geometry.id);
        if(style.pointerEvents == "visiblePainted"){node.geometry = geometry;}
        node.style.left = this._vmlParseFloat(geometry.x);
        node.style.top = this._vmlParseFloat(geometry.y);
        node.style.width = this._vmlParseFloat(geometry.width);
        node.style.height = this._vmlParseFloat(geometry.height);

        this._setStyle(node, style, true, true);

        this.root.appendChild(node);

        return node;
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

        var node = this._nodeFactory("v:oval", geometry.id);
        if(style.pointerEvents == "visiblePainted"){node.geometry = geometry;}
        node.style.left = this._vmlParseFloat(geometry.cx-geometry.rx);
        node.style.top = this._vmlParseFloat(geometry.cy-geometry.ry);
        node.style.width = this._vmlParseFloat(geometry.rx*2);
        node.style.height = this._vmlParseFloat(geometry.ry*2);

        node.appendChild(this._getFillElement());
        node.appendChild(this._getStrokeElement());

        if (!parent)
        this.root.appendChild(node);

        return node;
    },

    /**
     * function
     *
     * draw a ellipse geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawEllipse: function(geometry, style) {

        var node = this._nodeFactory("v:oval", geometry.id);
        if(style.pointerEvents == "visiblePainted"){node.geometry = geometry;}
        node.style.left = this._vmlParseFloat(geometry.cx-geometry.rx);
        node.style.top = this._vmlParseFloat(geometry.cy-geometry.ry);
        node.style.width = this._vmlParseFloat(geometry.rx*2);
        node.style.height = this._vmlParseFloat(geometry.ry*2);

        node.appendChild(this._getFillElement());
        node.appendChild(this._getStrokeElement());

        if (!parent)
        this.root.appendChild(node);

        return node;
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
        var bbox = this._getVmlBoundingBox(geometry.path);

        var node = this._nodeFactory("v:shape", geometry.id);
        if(style.pointerEvents == "visiblePainted"){node.geometry = geometry;}
        node.style.left = this._vmlParseFloat(bbox.x);
        node.style.top = this._vmlParseFloat(bbox.y);
        node.style.width = this._vmlParseFloat(bbox.width);
        node.style.height = this._vmlParseFloat(bbox.height);

        node.coordorigin = "0 0";
        node.coordsize = this._vmlParseFloat(bbox.width)+ " " +this._vmlParseFloat(bbox.height);

        var path = "";
        for (var i = 0; i < geometry.path.length; i++) {
            if ((i%3)==0 && (i/3)==0) {
                path += "m " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y);
        } else if ((i%3)==1) {
                path += " c " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y);
            } else{
                path += " " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y);
            }
        }
        path += " x e";

        node.path = path;

        this._setStyle(node, style, false, true);

        this.root.appendChild(node);

        return node;
    },

    /**
     * function
     *
     * draw a Curve geometry.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawSurface: function(geometry, style) {
        var bbox = this._getVmlBoundingBox(geometry.paht);
        var node = this._nodeFactory("v:shape", geometry.id);

        node.style.left = this._vmlParseFloat(bbox.x);
        node.style.top = this._vmlParseFloat(bbox.y);
        node.style.width = this._vmlParseFloat(bbox.width);
        node.style.height = this._vmlParseFloat(bbox.height);

        node.coordorigin = "0 0";
        node.coordsize = this._vmlParseFloat(bbox.width)+ " " +this._vmlParseFloat(bbox.height);

        var path = "";
        for (var i = 0; i < geometry.path.length; i++) {
            if ((i%3)==0 && (i/3)==0) {
                path += "m " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y);
        } else if ((i%3)==1) {
                path += " c " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y);
            } else{
                path += " " +this._vmlParseFloat(geometry.path[i].getX()-bbox.x)+ "," +this._vmlParseFloat(geometry.path[i].getY()-bbox.y);
            }
        }
        path += " x e";

        node.path = path;

        this._setStyle(node, style, true, true)

        this.root.appendChild(node);

        return node;
    },

    /**
     * function
     *
     * Use to set all the style attributes to a VML node.
     *
     * @param node {SvgDomElement} an SVG element to decorate
     * @param style {Style} a style to apply
     * @param isFilled {boolean}
     * @param isStroked {boolean}
     */
    _setStyle: function(node, style, isFilled, isStroked) {

        // add fill node
        var fill = this._nodeFactory('v:fill');
        fill.setAttribute("on", isFilled);
        fill.setAttribute("color", style.fillColor);
        fill.setAttribute("opacity", style.fillOpacity);
        node.appendChild(fill);

        // add stroke node
        var stroke = this._nodeFactory('v:stroke');
        stroke.setAttribute("on", isStroked);
        stroke.setAttribute("color", style.strokeColor);
        stroke.setAttribute("weight", style.strokeWidth);
        stroke.setAttribute("opacity", style.strokeOpacity);
        node.appendChild(stroke);

    },

    /**
     * function
     *
     * get a BBox from an array of points.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    _getVmlBoundingBox:function(points) {
        var rectangle = null;

        if (points) {
            var xMin = points[0].getX();
            var yMin = points[0].getY();
            var xMax = points[0].getX();
            var yMax = points[0].getY();

            for (var i = 0; i < points.length; i++) {
                xMin = (points[i].getX() < xMin)?points[i].getX():xMin;
                yMin = (points[i].getY() < yMin)?points[i].getY():yMin;
                xMax = (points[i].getX() > xMax)?points[i].getX():xMax;
                yMax = (points[i].getY() > yMax)?points[i].getY():yMax;
            }

            rectangle = {x:xMin, y:yMin, width: xMax-xMin, height: yMax-yMin};
        }

        return rectangle;
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
    _nodeFactory: function(type, id, className) {
        if ($(id)) {
            var node = $(id);

            subType = type.split(":");
            subType = (subType.length == 2) ? subType[1] : subType;
            var nn = node.nodeName.split(":");
            nn = (nn.length == 2) ? nn[1] : node.nodeName;

            if (subType != nn) {
                node.parentNode.removeChild(node);
                node = this._nodeFactory(type, id);
            }
        } else {
            var node = document.createElement(type);
            if (id) {
                node.setAttribute('id', id);
            }
        }

        if (className) {
            node.className = className;
        }

        return node;
    },

    /**
     * function
     *
     * Use to parse a float value to an integer. All the coordinates are
     * parsed because it seems that VML don't support float values.
     *
     * @param float
     */
    _vmlParseFloat: function(floatValue) {
        return floatValue.toFixed();
    },

    CLASS_NAME: "OpenLayers.Renderer.Vml"
});