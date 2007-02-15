/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class Renderer is the base class for all renderers.
 *
 * This is based on a merger code written by Paul Spencer and Bertil Chapuis.
 * It is largely composed of virtual functions that are to be implemented
 * in technology-specific subclasses, but there is some generic code too.
 *
 */
OpenLayers.Renderer = OpenLayers.Class.create();
OpenLayers.Renderer.prototype = 
{
    /**
     * constructor.  Sub-classes need to set up this.eventHandler (see above)
     */
    initialize: function() {},
    
    /**
     * virtual function
     *
     * Remove all the elements of the root
     *
     */    
    clearRoot: function() {},

    /**
     * virtual function
     *
     * Set the visible part of the layer.
     *
     * @param x {}
     * @param y {}
     * @param width {}
     * @param height {}
     */
    setExtent: function(x, y, width, height) {},
    
    /**
     * virtual function
     *
     * sets the size of the drawing surface
     *
     * @param size {OpenLayers.Size} the size of the drawing surface
     */
    setSize: function(size) {},
    
    /**
     * virtual function
     * 
     * returns a geometry from an event that happened on a layer.  How this
     * happens is specific to the renderer.
     *
     * @param evt {Object} an OpenLayers.Event object
     *
     * @return {Geometry} the geometry associated with the event, or null
     */
    getGeometryFromEvent: function(evt) {},
    
    /** 
     * draw a geometry on the specified layer.
     *
     * @param layer {Object} the layer to draw on
     * @param geometry {Geometry} a geometry to draw
     */
    drawGeometry: function(geometry, style) {
        if (!style) {
            return;
        }
        
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                this.drawPoint(geometry, style);
                break;
            case "OpenLayers.Geometry.Curve":
                this.drawCurve(geometry, style);
                break;
            case "OpenLayers.Geometry.LineSegment":
            case "OpenLayers.Geometry.LineString":
                this.drawLineString(geometry, style);
                break;
            case "OpenLayers.Geometry.LinearRing":
                this.drawLinearRing(geometry, style);
                break;
            case "OpenLayers.Geometry.Polygon":
                this.drawPolygon(geometry, style);
                break;
            case "OpenLayers.Geometry.Surface":
                this.drawSurface(geometry, style);
                break;
            case "OpenLayers.Geometry.Rectangle":
                this.drawRectangle(geometry, style);
                break;
            case "OpenLayers.Geometry.MultiPoint":
            case "OpenLayers.Geometry.MultiLineString":
            case "OpenLayers.Geometry.MultiPolygon":
                // simply draws the components as primitive geometries
                // may need a reference to the composite geometry
                for (var i = 0; i < geometry.components.length; i++) {
                    this.drawGeometry(geometry.components[i], style);
                }
                break;
            default:
                break;
         }
    },
    
    /**
     * virtual function
     *
     * erases a geometry
     * @param layer {Object} the layer to draw on
     * @param geometry {Geometry} a geometry to draw
     */
    eraseGeometry: function(geometry) {},
    
    /** 
     * virtual function
     *
     * draw a point geometry on the specified layer.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawPoint: function(geometry, style) {},
    
    /** 
     * virtual function
     *
     * draw a line geometry on the specified layer.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawLineString: function(geometry, style) {},
    
    /** 
     * virtual function
     *
     * draw a linear ring geometry on the specified layer.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawLinearRing: function(geometry, style) {},
    
    /** 
     * virtual function
     *
     * draw a polygon geometry on the specified layer.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawPolygon: function(geometry, style) {},
    
    /** 
     * virtual function
     *
     * draw a rectangular geometry on the specified layer.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawRectangle: function(geometry, style) {},
    
    /** 
     * virtual function
     *
     * draw a cirle geometry on the specified layer.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawCircle: function(geometry, style) {},
    
    /** 
     * virtual function
     *
     * draw a Curve geometry on the specified layer.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawCurve: function(geometry, style) {},
    
    /** 
     * virtual function
     *
     * draw a surface geometry on the specified layer.
     *
     * @param geometry {Geometry} a geometry to draw
     * @param style {Style} a style to use when drawing
     */
    drawSurface: function(geometry, style) {},
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Renderer"
};
