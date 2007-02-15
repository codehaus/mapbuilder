/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry.js
 */

OpenLayers.Geometry.Rectangle = OpenLayers.Class.create();
OpenLayers.Geometry.Rectangle.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Geometry, {

    /**
    * @constructor
    *
    * @param {array} points
    */
    initialize: function(x, y, width, height) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.setPath();
    },
    
    /**
     * @returns the BoundingBox
     * @type OpenLayers.Rectangle
     */
    getBoundingBox: function(){
        return this;
    },
    
    setPath: function(){
        // path declaration
        p1 = new OpenLayers.Geometry.Point;
        p1.x = this.x;
        p1.y = this.y;
        p2 = new OpenLayers.Geometry.Point;
        p2.x = this.x + this.width;
        p2.y = this.y;       
        p3 = new OpenLayers.Geometry.Point;
        p3.x = this.x + this.width;
        p3.y = this.y - this.height;
        p4 = new OpenLayers.Geometry.Point;
        p4.x = this.x;
        p4.y = this.y - this.height;
        this.path = [this.p1, this.p2, this.p3, this.p4];      
    },
    
    CLASS_NAME: "OpenLayers.Geometry.Rectangle"
});
