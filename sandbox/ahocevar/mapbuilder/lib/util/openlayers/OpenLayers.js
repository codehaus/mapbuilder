/*

  OpenLayers.js -- OpenLayers Map Viewer Library

  Copyright 2005-2006 MetaCarta, Inc., released under a modified BSD license.
  Please see http://svn.openlayers.org/trunk/openlayers/repository-license.txt
  for the full text of the license.

  Includes compressed code under the following licenses:

  (For uncompressed versions of the code used please see the
  OpenLayers SVN repository: <http://openlayers.org/>)

*/

/* Contains portions of Prototype.js:
 *
 * Prototype JavaScript framework, version 1.4.0
 *  (c) 2005 Sam Stephenson <sam@conio.net>
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://prototype.conio.net/
 *
/*--------------------------------------------------------------------------*/

/**  
*  
*  Contains portions of Rico <http://openrico.org/>
* 
*  Copyright 2005 Sabre Airline Solutions  
*  
*  Licensed under the Apache License, Version 2.0 (the "License"); you
*  may not use this file except in compliance with the License. You
*  may obtain a copy of the License at
*  
*         http://www.apache.org/licenses/LICENSE-2.0  
*  
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
*  implied. See the License for the specific language governing
*  permissions and limitations under the License. 
*
**/

/* ======================================================================    OpenLayers/SingleFile.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

_OPENLAYERS_SFL_=true;

/* ======================================================================    OpenLayers.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/* @requires OpenLayers/BaseTypes.js
 */ 

////
/// This blob sucks in all the files in uncompressed form for ease of use
///

OpenLayers = new Object();

OpenLayers._scriptName = ( 
    typeof(_OPENLAYERS_SFL_) == "undefined" ? "lib/OpenLayers.js" 
                                            : "OpenLayers.js" );

OpenLayers._getScriptLocation = function () {
    var scriptLocation = "";
    var SCRIPT_NAME = OpenLayers._scriptName;
 
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src');
        if (src) {
            var index = src.lastIndexOf(SCRIPT_NAME); 
            // is it found, at the end of the URL?
            if ((index > -1) && (index + SCRIPT_NAME.length == src.length)) {  
                scriptLocation = src.slice(0, -SCRIPT_NAME.length);
                break;
            }
        }
    }
    return scriptLocation;
}

/*
  `_OPENLAYERS_SFL_` is a flag indicating this file is being included
  in a Single File Library build of the OpenLayers Library.

  When we are *not* part of a SFL build we dynamically include the
  OpenLayers library code.

  When we *are* part of a SFL build we do not dynamically include the 
  OpenLayers library code as it will be appended at the end of this file.
*/
if (typeof(_OPENLAYERS_SFL_) == "undefined") {
    /*
      The original code appeared to use a try/catch block
      to avoid polluting the global namespace,
      we now use a anonymous function to achieve the same result.
     */
    (function() {
    var jsfiles=new Array(
        "OpenLayers/BaseTypes.js",
        "OpenLayers/Util.js",
        "Rico/Corner.js",
        "Rico/Color.js",
        "OpenLayers/Ajax.js",
        "OpenLayers/Events.js",
        "OpenLayers/Map.js",
        "OpenLayers/Layer.js",
        "OpenLayers/Icon.js",
        "OpenLayers/Marker.js",
        "OpenLayers/Marker/Box.js",
        "OpenLayers/Popup.js",
        "OpenLayers/Tile.js",
        "OpenLayers/Feature.js",
        "OpenLayers/Feature/Vector.js",
        "OpenLayers/Feature/WFS.js",
        "OpenLayers/Tile/Image.js",
        "OpenLayers/Tile/WFS.js",
        "OpenLayers/Layer/Image.js",
        "OpenLayers/Layer/EventPane.js",
        "OpenLayers/Layer/FixedZoomLevels.js",
        "OpenLayers/Layer/Google.js",
        "OpenLayers/Layer/VirtualEarth.js",
        "OpenLayers/Layer/Yahoo.js",
        "OpenLayers/Layer/HTTPRequest.js",
        "OpenLayers/Layer/Grid.js",
        "OpenLayers/Layer/MapServer.js",
        "OpenLayers/Layer/MapServer/Untiled.js",
        "OpenLayers/Layer/KaMap.js",
        "OpenLayers/Layer/MultiMap.js",
        "OpenLayers/Layer/Markers.js",
        "OpenLayers/Layer/Text.js",
        "OpenLayers/Layer/WorldWind.js",
        "OpenLayers/Layer/WMS.js",
        "OpenLayers/Layer/WMS/Untiled.js",
        "OpenLayers/Layer/GeoRSS.js",
        "OpenLayers/Layer/Boxes.js",
        "OpenLayers/Layer/Canvas.js",
        "OpenLayers/Layer/TMS.js",
        "OpenLayers/Popup/Anchored.js",
        "OpenLayers/Popup/AnchoredBubble.js",
        "OpenLayers/Handler.js",
        "OpenLayers/Handler/Point.js",
        "OpenLayers/Handler/Path.js",
        "OpenLayers/Handler/Polygon.js",
        "OpenLayers/Handler/Feature.js",
        "OpenLayers/Handler/Drag.js",
        "OpenLayers/Handler/Box.js",
        "OpenLayers/Handler/MouseWheel.js",
        "OpenLayers/Handler/Keyboard.js",
        "OpenLayers/Control.js",
        "OpenLayers/Control/ZoomBox.js",
        "OpenLayers/Control/ZoomToMaxExtent.js",
        "OpenLayers/Control/DragPan.js",
        "OpenLayers/Control/Navigation.js",
        "OpenLayers/Control/MouseDefaults.js",
        "OpenLayers/Control/MousePosition.js",
        "OpenLayers/Control/OverviewMap.js",
        "OpenLayers/Control/KeyboardDefaults.js",
        "OpenLayers/Control/PanZoom.js",
        "OpenLayers/Control/PanZoomBar.js",
        "OpenLayers/Control/ArgParser.js",
        "OpenLayers/Control/Permalink.js",
        "OpenLayers/Control/Scale.js",
        "OpenLayers/Control/LayerSwitcher.js",
        "OpenLayers/Control/DrawFeature.js",
        "OpenLayers/Control/Panel.js",
        "OpenLayers/Control/SelectFeature.js",
        "OpenLayers/Geometry.js",
        "OpenLayers/Geometry/Rectangle.js",
        "OpenLayers/Geometry/Collection.js",
        "OpenLayers/Geometry/Point.js",
        "OpenLayers/Geometry/MultiPoint.js",
        "OpenLayers/Geometry/Curve.js",
        "OpenLayers/Geometry/LineString.js",
        "OpenLayers/Geometry/LinearRing.js",        
        "OpenLayers/Geometry/Polygon.js",
        "OpenLayers/Geometry/MultiLineString.js",
        "OpenLayers/Geometry/MultiPolygon.js",
        "OpenLayers/Geometry/Surface.js",
        "OpenLayers/Renderer.js",
        "OpenLayers/Renderer/Elements.js",
        "OpenLayers/Renderer/SVG.js",
        "OpenLayers/Renderer/VML.js",
        "OpenLayers/Layer/Vector.js",
        "OpenLayers/Layer/GML.js",
        "OpenLayers/Format.js",
        "OpenLayers/Format/GML.js",
        "OpenLayers/Format/KML.js",
        "OpenLayers/Format/GeoRSS.js",
        "OpenLayers/Format/WFS.js",
        "OpenLayers/Layer/WFS.js",
        "OpenLayers/Control/MouseToolbar.js",
        "OpenLayers/Control/NavToolbar.js",
        "OpenLayers/Control/EditingToolbar.js"
    ); // etc.

    var allScriptTags = "";
    var host = OpenLayers._getScriptLocation() + "lib/";

    for (var i = 0; i < jsfiles.length; i++) {
        if (/MSIE/.test(navigator.userAgent) || /Safari/.test(navigator.userAgent)) {
            var currentScriptTag = "<script src='" + host + jsfiles[i] + "'></script>"; 
            allScriptTags += currentScriptTag;
        } else {
            var s = document.createElement("script");
            s.src = host + jsfiles[i];
            var h = document.getElementsByTagName("head").length ? 
                       document.getElementsByTagName("head")[0] : 
                       document.body;
            h.appendChild(s);
        }
    }
    if (allScriptTags) document.write(allScriptTags);
    })();
}
OpenLayers.VERSION_NUMBER="$Revision$";
/* ======================================================================    OpenLayers/BaseTypes.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/* OpenLayers.Class metaclass */
OpenLayers.Class = {
    isPrototype: function () {}, // magic anonymous value

    create: function() {
        return function() {
            if (arguments && arguments[0] != OpenLayers.Class.isPrototype)
                this.initialize.apply(this, arguments);
        }
    },
 
    inherit: function () {
        var superClass = arguments[0];
        var proto = new superClass(OpenLayers.Class.isPrototype);
        for (var i = 1; i < arguments.length; i++) {
            if (typeof arguments[i] == "function") {
                var mixin = arguments[i];
                arguments[i] = new mixin(OpenLayers.Class.isPrototype);
            }
            OpenLayers.Util.extend(proto, arguments[i]);

            // This is a hack for IE see
            // http://trac.openlayers.org/attachment/ticket/552
            // 
            // The problem is that ie doesnt recognize toString as a property
            //  so the util.extend() doesnt copy it over. we do it manually.
            // 
            // to be revisited in 3.0
            // 
            if (arguments[i].hasOwnProperty('toString')) {
                proto.toString = arguments[i].toString;
            }
        }
        return proto;
    }
};

/*
    OpenLayers.Class.inherit( OpenLayers.Layer.Grid, OpenLayers.Layer.HTTPRequest, {
        some stuff
    });
*/

/*********************
 *                   *
 *      PIXEL        * 
 *                   * 
 *********************/

/**
 * @class 
 * 
 * This class represents a screen coordinate, in x and y coordinates
 */
OpenLayers.Pixel = OpenLayers.Class.create();
OpenLayers.Pixel.prototype = {
    
    /** @type float */
    x: 0.0,

    /** @type float */
    y: 0.0,
    
    /** 
    * @constructor
    *
    * @param {float} x
    * @param {float} y
    */
    initialize: function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    },
    
    /**
    * @return string representation of Pixel. ex: "x=200.4,y=242.2"
    * @type str
    */
    toString:function() {
        return ("x=" + this.x + ",y=" + this.y);
    },

    /**
     * @type OpenLayers.Pixel
     */
    clone:function() {
        return new OpenLayers.Pixel(this.x, this.y); 
    },
    
    /** 
    * @param {OpenLayers.Pixel} px
    * 
    * @return whether or not the point passed in as parameter is equal to this
    *          note that if px passed in is null, returns false
    * @type bool
    */
    equals:function(px) {
        var equals = false;
        if (px != null) {
            equals = ((this.x == px.x && this.y == px.y) ||
                      (isNaN(this.x) && isNaN(this.y) && isNaN(px.x) && isNaN(px.y)));
        }
        return equals;
    },

    /**
    * @param {int} x
    * @param {int} y
    * 
    * @return a new Pixel with this pixel's x&y augmented by the 
    *         values passed in.
    * @type OpenLayers.Pixel
    */
    add:function(x, y) {
        return new OpenLayers.Pixel(this.x + x, this.y + y);
    },

    /**
    * @param {OpenLayers.Pixel} px
    * 
    * @return a new Pixel with this pixel's x&y augmented by the 
    *         x&y values of the pixel passed in.
    * @type OpenLayers.Pixel
    */
    offset:function(px) {
        var newPx = this.clone();
        if (px) {
            newPx = this.add(px.x, px.y);
        }
        return newPx;
    },
    
    /** @final @type str */
    CLASS_NAME: "OpenLayers.Pixel"
};


/*********************
 *                   *
 *      SIZE         * 
 *                   * 
 *********************/


/**
* @class 
* 
* This class represents a width and height pair
*/
OpenLayers.Size = OpenLayers.Class.create();
OpenLayers.Size.prototype = {

    /** @type float */
    w: 0.0,
    
    /** @type float */
    h: 0.0,


    /** 
    * @constructor
    * 
    * @param {float} w 
    * @param {float} h 
    */
    initialize: function(w, h) {
        this.w = parseFloat(w);
        this.h = parseFloat(h);
    },

    /** 
    * @return String representation of OpenLayers.Size object. 
    *         (ex. <i>"w=55,h=66"</i>)
    * @type String
    */
    toString:function() {
        return ("w=" + this.w + ",h=" + this.h);
    },

    /** 
     * @return New OpenLayers.Size object with the same w and h values
     * @type OpenLayers.Size
     */
    clone:function() {
        return new OpenLayers.Size(this.w, this.h);
    },

    /** 
    * @param {OpenLayers.Size} sz
    * @returns Boolean value indicating whether the passed-in OpenLayers.Size 
    *          object has the same w and h components as this
    *          note that if sz passed in is null, returns false
    *
    * @type bool
    */
    equals:function(sz) {
        var equals = false;
        if (sz != null) {
            equals = ((this.w == sz.w && this.h == sz.h) ||
                      (isNaN(this.w) && isNaN(this.h) && isNaN(sz.w) && isNaN(sz.h)));
        }
        return equals;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Size"
};

/*********************
 *                   *
 *      LONLAT       * 
 *                   * 
 *********************/


/**
* @class 
* 
* This class represents a longitude and latitude pair
*/
OpenLayers.LonLat = OpenLayers.Class.create();
OpenLayers.LonLat.prototype = {

    /** @type float */
    lon: 0.0,
    
    /** @type float */
    lat: 0.0,

    /**
    * @constructor
    * 
    * @param {float} lon
    * @param {float} lat
    */
    initialize: function(lon, lat) {
        this.lon = parseFloat(lon);
        this.lat = parseFloat(lat);
    },
    
    /** 
    * @return String representation of OpenLayers.LonLat object. 
    *         (ex. <i>"lon=5,lat=42"</i>)
    * @type String
    */
    toString:function() {
        return ("lon=" + this.lon + ",lat=" + this.lat);
    },

    /** 
    * @return Shortened String representation of OpenLayers.LonLat object. 
    *         (ex. <i>"5, 42"</i>)
    * @type String
    */
    toShortString:function() {
        return (this.lon + ", " + this.lat);
    },

    /** 
     * @return New OpenLayers.LonLat object with the same lon and lat values
     * @type OpenLayers.LonLat
     */
    clone:function() {
        return new OpenLayers.LonLat(this.lon, this.lat);
    },

    /** 
    * @param {float} lon
    * @param {float} lat
    *
    * @return A new OpenLayers.LonLat object with the lon and lat passed-in
    *         added to this's. 
    * @type OpenLayers.LonLat
    */
    add:function(lon, lat) {
        return new OpenLayers.LonLat(this.lon + lon, this.lat + lat);
    },

    /** 
    * @param {OpenLayers.LonLat} ll
    * @returns Boolean value indicating whether the passed-in OpenLayers.LonLat
    *          object has the same lon and lat components as this
    *          note that if ll passed in is null, returns false
    *
    * @type bool
    */
    equals:function(ll) {
        var equals = false;
        if (ll != null) {
            equals = ((this.lon == ll.lon && this.lat == ll.lat) ||
                      (isNaN(this.lon) && isNaN(this.lat) && isNaN(ll.lon) && isNaN(ll.lat)));
        }
        return equals;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.LonLat"
};

/** Alternative constructor that builds a new OpenLayers.LonLat from a 
*    parameter string
* 
* @constructor
* 
* @param {String} str Comma-separated Lon,Lat coordinate string. 
*                     (ex. <i>"5,40"</i>)
*
* @returns New OpenLayers.LonLat object built from the passed-in String.
* @type OpenLayers.LonLat
*/
OpenLayers.LonLat.fromString = function(str) {
    var pair = str.split(",");
    return new OpenLayers.LonLat(parseFloat(pair[0]), 
                                 parseFloat(pair[1]));
};



/*********************
 *                   *
 *      BOUNDS       * 
 *                   * 
 *********************/




/**
* @class 
* 
* This class represents a bounding box. 
* Data stored as left, bottom, right, top floats
*/
OpenLayers.Bounds = OpenLayers.Class.create();
OpenLayers.Bounds.prototype = {

    /** @type float */
    left: 0.0,

    /** @type float */
    bottom: 0.0,

    /** @type float */
    right: 0.0,

    /** @type float */
    top: 0.0,    

    /**
    * @constructor
    *
    * @param {float} left
    * @param {float} bottom
    * @param {float} right
    * @param {float} top
    *
    */
    initialize: function(left, bottom, right, top) {
        this.left = parseFloat(left);
        this.bottom = parseFloat(bottom);
        this.right = parseFloat(right);
        this.top = parseFloat(top);
    },

    /**
     * @returns A fresh copy of the bounds
     * @type OpenLayers.Bounds
     */
    clone:function() {
        return new OpenLayers.Bounds(this.left, this.bottom, 
                                     this.right, this.top);
    },

    /** 
    * @param {OpenLayers.Bounds} bounds
    * @returns Boolean value indicating whether the passed-in OpenLayers.Bounds
    *          object has the same left, right, top, bottom components as this
    *           note that if bounds passed in is null, returns false
    *
    * @type bool
    */
    equals:function(bounds) {
        var equals = false;
        if (bounds != null) {
            equals = ((this.left == bounds.left) && 
                      (this.right == bounds.right) &&
                      (this.top == bounds.top) && 
                      (this.bottom == bounds.bottom));
        }
        return equals;
    },

    /** 
    * @return String representation of OpenLayers.Bounds object. 
    *         (ex.<i>"left-bottom=(5,42) right-top=(10,45)"</i>)
    * @type String
    */
    toString:function() {
        return ( "left-bottom=(" + this.left + "," + this.bottom + ")"
                 + " right-top=(" + this.right + "," + this.top + ")" );
    },

    /** 
     * @param {int} decimal How many significant digits in the bbox coords?
     *                      Default is 6
     * 
     * @returns Simple String representation of OpenLayers.Bounds object.
     *         (ex. <i>"5,42,10,45"</i>)
     * @type String
     */
    toBBOX:function(decimal) {
        if (decimal== null) {
            decimal = 6; 
        }
        var mult = Math.pow(10, decimal);
        var bbox = Math.round(this.left * mult) / mult + "," + 
                   Math.round(this.bottom * mult) / mult + "," + 
                   Math.round(this.right * mult) / mult + "," + 
                   Math.round(this.top * mult) / mult;

        return bbox;
    },
    
    /**
    * @returns The width of the bounds
    * @type float
    */
    getWidth:function() {
        return (this.right - this.left);
    },

    /**
    * @returns The height of the bounds
    * @type float
    */
    getHeight:function() {
        return (this.top - this.bottom);
    },

    /**
    * @returns An OpenLayers.Size which represents the size of the box
    * @type OpenLayers.Size
    */
    getSize:function() {
        return new OpenLayers.Size(this.getWidth(), this.getHeight());
    },

    /**
    * @returns An OpenLayers.Pixel which represents the center of the bounds
    * @type OpenLayers.Pixel
    */
    getCenterPixel:function() {
        return new OpenLayers.Pixel( (this.left + this.right) / 2,
                                     (this.bottom + this.top) / 2);
    },

    /**
    * @returns An OpenLayers.LonLat which represents the center of the bounds
    * @type OpenLayers.LonLat
    */
    getCenterLonLat:function() {
        return new OpenLayers.LonLat( (this.left + this.right) / 2,
                                      (this.bottom + this.top) / 2);
    },

    /**
    * @param {float} x
    * @param {float} y
    *
    * @returns A new OpenLayers.Bounds whose coordinates are the same as this, 
    *          but shifted by the passed-in x and y values
    * @type OpenLayers.Bounds
    */
    add:function(x, y) {
        return new OpenLayers.Bounds(this.left + x, this.bottom + y,
                                     this.right + x, this.top + y);
    },
    
    /**
     * Extend the bounds to include the point, lonlat, or bounds specified.
     * 
     * This function assumes that left<right and bottom<top.
     * 
     * @param {OpenLayers.Bounds|OpenLayers.LonLat|OpenLayers.Geometry.Point} object
     */
    extend:function(object) {
        var bounds = null;
        if (object) {
            switch(object.CLASS_NAME) {
                case "OpenLayers.Geometry.Point":
                case "OpenLayers.LonLat":    
                    bounds = new OpenLayers.Bounds(object.lon, object.lat,
                                                    object.lon, object.lat);
                    break;
                    
                case "OpenLayers.Bounds":    
                    bounds = object;
                    break;
            }
    
            if (bounds) {
               this.left = (bounds.left < this.left) ? bounds.left 
                                                     : this.left;
               this.bottom = (bounds.bottom < this.bottom) ? bounds.bottom 
                                                           : this.bottom;
               this.right = (bounds.right > this.right) ? bounds.right 
                                                        : this.right;
               this.top = (bounds.top > this.top) ? bounds.top 
                                                  : this.top;
            }
        }
    },

    /**
     * @param {OpenLayers.LonLat} ll
     * @param {Boolean} inclusive Whether or not to include the border. 
     *                            Default is true
     *
     * @return Whether or not the passed-in lonlat is within this bounds
     * @type Boolean
     */
    containsLonLat:function(ll, inclusive) {
        return this.contains(ll.lon, ll.lat, inclusive);
    },

    /**
     * @param {OpenLayers.Pixel} px
     * @param {Boolean} inclusive Whether or not to include the border. 
     *                            Default is true
     *
     * @return Whether or not the passed-in pixel is within this bounds
     * @type Boolean
     */
    containsPixel:function(px, inclusive) {
        return this.contains(px.x, px.y, inclusive);
    },
    
    /**
    * @param {float} x
    * @param {float} y
    * @param {Boolean} inclusive Whether or not to include the border. 
    *                            Default is true
    *
    * @return Whether or not the passed-in coordinates are within this bounds
    * @type Boolean
    */
    contains:function(x, y, inclusive) {
    
        //set default
        if (inclusive == null) {
            inclusive = true;
        }
        
        var contains = false;
        if (inclusive) {
            contains = ((x >= this.left) && (x <= this.right) && 
                        (y >= this.bottom) && (y <= this.top));
        } else {
            contains = ((x > this.left) && (x < this.right) && 
                        (y > this.bottom) && (y < this.top));
        }              
        return contains;
    },

    /**
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} inclusive Whether or not to include the border. 
     *                            Default is true
     *
     * @return Whether or not the passed-in OpenLayers.Bounds object intersects
     *         this bounds. Simple math just check if either contains the other, 
     *         allowing for partial.
     * @type Boolean
     */
    intersectsBounds:function(bounds, inclusive) {

        if (inclusive == null) {
            inclusive = true;
        }
        var inBottom = (bounds.bottom == this.bottom && bounds.top == this.top) ?
                    true : (((bounds.bottom > this.bottom) && (bounds.bottom < this.top)) || 
                           ((this.bottom > bounds.bottom) && (this.bottom < bounds.top))); 
        var inTop = (bounds.bottom == this.bottom && bounds.top == this.top) ?
                    true : (((bounds.top > this.bottom) && (bounds.top < this.top)) ||
                           ((this.top > bounds.bottom) && (this.top < bounds.top))); 
        var inRight = (bounds.right == this.right && bounds.left == this.left) ?
                    true : (((bounds.right > this.left) && (bounds.right < this.right)) ||
                           ((this.right > bounds.left) && (this.right < bounds.right))); 
        var inLeft = (bounds.right == this.right && bounds.left == this.left) ?
                    true : (((bounds.left > this.left) && (bounds.left < this.right)) || 
                           ((this.left > bounds.left) && (this.left < bounds.right))); 

        return (this.containsBounds(bounds, true, inclusive) ||
                bounds.containsBounds(this, true, inclusive) ||
                ((inTop || inBottom ) && (inLeft || inRight )));
    },
    
    /**
    * @param {OpenLayers.Bounds} bounds
    * @param {Boolean} partial If true, only part of passed-in 
    *                          OpenLayers.Bounds needs be within this bounds. 
    *                          If false, the entire passed-in bounds must be
    *                          within. Default is false
    * @param {Boolean} inclusive Whether or not to include the border. 
    *                            Default is true
    *
    * @return Whether or not the passed-in OpenLayers.Bounds object is 
    *         contained within this bounds. 
    * @type Boolean
    */
    containsBounds:function(bounds, partial, inclusive) {

        //set defaults
        if (partial == null) {
            partial = false;
        }
        if (inclusive == null) {
            inclusive = true;
        }

        var inLeft;
        var inTop;
        var inRight;
        var inBottom;
        
        if (inclusive) {
            inLeft = (bounds.left >= this.left) && (bounds.left <= this.right);
            inTop = (bounds.top >= this.bottom) && (bounds.top <= this.top);
            inRight= (bounds.right >= this.left) && (bounds.right <= this.right);
            inBottom = (bounds.bottom >= this.bottom) && (bounds.bottom <= this.top);
        } else {
            inLeft = (bounds.left > this.left) && (bounds.left < this.right);
            inTop = (bounds.top > this.bottom) && (bounds.top < this.top);
            inRight= (bounds.right > this.left) && (bounds.right < this.right);
            inBottom = (bounds.bottom > this.bottom) && (bounds.bottom < this.top);
        }
        
        return (partial) ? (inTop || inBottom ) && (inLeft || inRight ) 
                         : (inTop && inLeft && inBottom && inRight);
    },

    /** 
     * @param {OpenLayers.LonLat} lonlat
     *
     * @returns The quadrant ("br" "tr" "tl" "bl") of the bounds in which 
     *           the coordinate lies.
     * @type String
     */
    determineQuadrant: function(lonlat) {
    
        var quadrant = "";
        var center = this.getCenterLonLat();
        
        quadrant += (lonlat.lat < center.lat) ? "b" : "t";
        quadrant += (lonlat.lon < center.lon) ? "l" : "r";
    
        return quadrant; 
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Bounds"
};

/** Alternative constructor that builds a new OpenLayers.Bounds from a 
*    parameter string
* 
* @constructor
* 
* @param {String} str Comma-separated bounds string. (ex. <i>"5,42,10,45"</i>)
*
* @returns New OpenLayers.Bounds object built from the passed-in String.
* @type OpenLayers.Bounds
*/
OpenLayers.Bounds.fromString = function(str) {
    var bounds = str.split(",");
    return OpenLayers.Bounds.fromArray(bounds);
};

/** Alternative constructor that builds a new OpenLayers.Bounds
*    from an array
* 
* @constructor
* 
* @param {Array} bbox Array of bounds values (ex. <i>[5,42,10,45]</i>)
*
* @returns New OpenLayers.Bounds object built from the passed-in Array.
* @type OpenLayers.Bounds
*/
OpenLayers.Bounds.fromArray = function(bbox) {
    return new OpenLayers.Bounds(parseFloat(bbox[0]),
                                 parseFloat(bbox[1]),
                                 parseFloat(bbox[2]),
                                 parseFloat(bbox[3]));
};

/** Alternative constructor that builds a new OpenLayers.Bounds
*    from an OpenLayers.Size
* 
* @constructor
* 
* @param {OpenLayers.Size} size
*            
* @returns New OpenLayers.Bounds object built with top and left set to 0 and
*           bottom right taken from the passed-in OpenLayers.Size.
* @type OpenLayers.Bounds
*/
OpenLayers.Bounds.fromSize = function(size) {
    return new OpenLayers.Bounds(0,
                                 size.h,
                                 size.w,
                                 0);
};
/**
 * @param {String} quadrant 
 * 
 * @returns The opposing quadrant ("br" "tr" "tl" "bl"). For Example, if 
 *           you pass in "bl" it returns "tr", if you pass in "br" it 
 *           returns "tl", etc.
 * @type String
 */
OpenLayers.Bounds.oppositeQuadrant = function(quadrant) {
    var opp = "";
    
    opp += (quadrant.charAt(0) == 't') ? 'b' : 't';
    opp += (quadrant.charAt(1) == 'l') ? 'r' : 'l';
    
    return opp;
};


/*********************
 *                   *
 *      ELEMENT      * 
 *                   * 
 *********************/

OpenLayers.Element = {
  visible: function(element) {
    return OpenLayers.Util.getElement(element).style.display != 'none';
  },

  toggle: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = OpenLayers.Util.getElement(arguments[i]);
      OpenLayers.Element[OpenLayers.Element.visible(element) ? 'hide' : 'show'](element);
    }
  },

  hide: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = OpenLayers.Util.getElement(arguments[i]);
      element.style.display = 'none';
    }
  },

  show: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = OpenLayers.Util.getElement(arguments[i]);
      element.style.display = '';
    }
  },

  remove: function(element) {
    element = OpenLayers.Util.getElement(element);
    element.parentNode.removeChild(element);
  },

  getHeight: function(element) {
    element = OpenLayers.Util.getElement(element);
    return element.offsetHeight;
  },

  getDimensions: function(element) {
    element = OpenLayers.Util.getElement(element);
    if (OpenLayers.Element.getStyle(element, 'display') != 'none')
      return {width: element.offsetWidth, height: element.offsetHeight};

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = '';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = 'none';
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  getStyle: function(element, style) {
    element = OpenLayers.Util.getElement(element);
    var value = element.style[style.camelize()];
    if (!value) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        var css = document.defaultView.getComputedStyle(element, null);
        value = css ? css.getPropertyValue(style) : null;
      } else if (element.currentStyle) {
        value = element.currentStyle[style.camelize()];
      }
    }

    if (window.opera && OpenLayers.Util.indexOf(['left', 'top', 'right', 'bottom'],style) != -1)
      if (OpenLayers.Element.getStyle(element, 'position') == 'static') value = 'auto';

    return value == 'auto' ? null : value;
  }

};

/*********************
 *                   *
 *      STRING       * 
 *                   * 
 *********************/

/**
* @param {String} sStart
* 
* @returns Whether or not this string starts with the string passed in.
* @type Boolean
*/
String.prototype.startsWith = function(sStart) {
    return (this.substr(0,sStart.length) == sStart);
};

/**
* @param {String} str
* 
* @returns Whether or not this string contains with the string passed in.
* @type Boolean
*/
String.prototype.contains = function(str) {
    return (this.indexOf(str) != -1);
};

/**
* @returns A trimmed version of the string - all leading and 
*          trailing spaces removed
* @type String
*/
String.prototype.trim = function() {
    
    var b = 0;
    while(this.substr(b,1) == " ") {
        b++;
    }
    
    var e = this.length - 1;
    while(this.substr(e,1) == " ") {
        e--;
    }
    
    return this.substring(b, e+1);
};


String.indexOf = function(object) {
 for (var i = 0; i < this.length; i++)
     if (this[i] == object) return i;
 return -1;
};

String.prototype.camelize = function() {
    var oStringList = this.split('-');
    if (oStringList.length == 1) return oStringList[0];

    var camelizedString = this.indexOf('-') == 0
      ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1)
      : oStringList[0];

    for (var i = 1, len = oStringList.length; i < len; i++) {
      var s = oStringList[i];
      camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
    }

    return camelizedString;
};


/*********************
 *                   *
 *      NUMBER       * 
 *                   * 
 *********************/

/** NOTE: Works only with integer values does *not* work with floats!
 * 
 * @param {int} sig
 * 
 * @returns The number, rounded to the specified number of significant digits.
 *          If null, 0, or negaive value passed in, returns 0
 * @type int
 */
Number.prototype.limitSigDigs = function(sig) {
    var number = (sig > 0) ? this.toString() : 0;
    if (sig < number.length) {
        var exp = number.length - sig;
        number = Math.round( this / Math.pow(10, exp)) * Math.pow(10, exp);
    }
    return parseInt(number);
}


/*********************
 *                   *
 *      FUNCTION     * 
 *                   * 
 *********************/

Function.prototype.bind = function() {
  var __method = this, args = [], object = arguments[0];
  for (var i = 1; i < arguments.length; i++)
    args.push(arguments[i]);
  return function(moreargs) {
    for (var i = 0; i < arguments.length; i++)
      args.push(arguments[i]);
    return __method.apply(object, args);
  }
};

Function.prototype.bindAsEventListener = function(object) {
  var __method = this;
  return function(event) {
    return __method.call(object, event || window.event);
  }
};
/* ======================================================================    OpenLayers/Util.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 */
OpenLayers.Util = new Object();

/** 
 * This is the old $() from prototype
 */
OpenLayers.Util.getElement = function() {
    var elements = new Array();

    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        if (arguments.length == 1) {
            return element;
        }
        elements.push(element);
    }
    return elements;
};

/** 
 * Maintain $() from prototype
 */
if ($ == null) {
    var $ = OpenLayers.Util.getElement;
}

/* from Prototype.js */
OpenLayers.Util.extend = function(destination, source) {
    for (property in source) {
      destination[property] = source[property];
    }
    return destination;
};


/** Remove an object from an array. Iterates through the array
*    to find the item, then removes it.
*
* @param {Object} item
* 
* @returns A reference to the array
* @type Array
*/
OpenLayers.Util.removeItem = function(array, item) {
    for(var i=0; i < array.length; i++) {
        if(array[i] == item) {
            array.splice(i,1);
            //break;more than once??
        }
    }
    return array;
};

/**
*/
OpenLayers.Util.clearArray = function(array) {
    array.length = 0;
};

/** Seems to exist already in FF, but not in MOZ.
 * 
 * @param {Array} array
 * @param {Object} obj
 */
OpenLayers.Util.indexOf = function(array, obj) {

    for(var i=0; i < array.length; i++) {
        if (array[i] == obj) return i;
    }
    return -1;   
};



/**
 * @param {String} id
 * @param {OpenLayers.Pixel} px
 * @param {OpenLayers.Size} sz
 * @param {String} position
 * @param {String} border
 * @param {String} overflow
 * @param {float} opacity Fractional value (0.0 - 1.0)
 */
OpenLayers.Util.modifyDOMElement = function(element, id, px, sz, position, 
                                            border, overflow, opacity) {

    if (id) {
        element.id = id;
    }
    if (px) {
        element.style.left = px.x + "px";
        element.style.top = px.y + "px";
    }
    if (sz) {
        element.style.width = sz.w + "px";
        element.style.height = sz.h + "px";
    }
    if (position) {
        element.style.position = position;
    }
    if (border) {
        element.style.border = border;
    }
    if (overflow) {
        element.style.overflow = overflow;
    }
    if (opacity) {
        element.style.opacity = opacity;
        element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
    }
};

/** 
* zIndex is NOT set
*
* @param {String} id
* @param {OpenLayers.Pixel} px
* @param {OpenLayers.Size} sz
* @param {String} imgURL
* @param {String} position
* @param {String} border
* @param {String} overflow
* @param {float} opacity Fractional value (0.0 - 1.0)
*
* @returns A DOM Div created with the specified attributes.
* @type DOMElement
*/
OpenLayers.Util.createDiv = function(id, px, sz, imgURL, position, 
                                     border, overflow, opacity) {

    var dom = document.createElement('div');

    if (imgURL) {
        dom.style.backgroundImage = 'url(' + imgURL + ')';
    }

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "absolute";
    }
    OpenLayers.Util.modifyDOMElement(dom, id, px, sz, position, 
                                     border, overflow, opacity);

    return dom;
};

/** 
* @param {String} id
* @param {OpenLayers.Pixel} px
* @param {OpenLayers.Size} sz
* @param {String} imgURL
* @param {String} position
* @param {String} border
* @param {Boolean} delayDisplay
* @param {float} opacity Fractional value (0.0 - 1.0)
*
* @returns A DOM Image created with the specified attributes.
* @type DOMElement
*/
OpenLayers.Util.createImage = function(id, px, sz, imgURL, position, border,
                                       opacity, delayDisplay) {

    image = document.createElement("img");

    //set generic properties
    if (!id) {
        id = OpenLayers.Util.createUniqueID("OpenLayersDiv");
    }
    if (!position) {
        position = "relative";
    }
    OpenLayers.Util.modifyDOMElement(image, id, px, sz, position, 
                                     border, null, opacity);

    if(delayDisplay) {
        image.style.display = "none";
        OpenLayers.Event.observe(image, "load", 
                      OpenLayers.Util.onImageLoad.bindAsEventListener(image));
        OpenLayers.Event.observe(image, "error", 
                      OpenLayers.Util.onImageLoadError.bindAsEventListener(image));
        
    }
    
    //set special properties
    image.style.alt = id;
    image.galleryImg = "no";
    if (imgURL) {
        image.src = imgURL;
    }


        
    return image;
};

/**
 * @deprecated -- Use OpenLayers.Util.modifyDOMElement() or 
 *                    OpenLayers.Util.modifyAlphaImageDiv()
 * 
 * Set the opacity of a DOM Element
 * Note that for this function to work in IE, elements must "have layout"
 * according to:
 * http://msdn.microsoft.com/workshop/author/dhtml/reference/properties/haslayout.asp
 *
 * @param {DOMElement} element Set the opacity on this DOM element
 * @param {Float} opacity Opacity value (0.0 - 1.0)
 */
OpenLayers.Util.setOpacity = function(element, opacity) {
    OpenLayers.Util.modifyDOMElement(element, null, null, null,
                                     null, null, null, opacity);
}

OpenLayers.Util.onImageLoad = function() {
    // The complex check here is to solve issues described in #480.
    // Every time a map view changes, it increments the 'viewRequestID' 
    // property. As the requests for the images for the new map view are sent
    // out, they are tagged with this unique viewRequestID. 
    // 
    // If an image has no viewRequestID property set, we display it regardless, 
    // but if it does have a viewRequestID property, we check that it matches 
    // the viewRequestID set on the map.
    // 
    // If the viewRequestID on the map has changed, that means that the user
    // has changed the map view since this specific request was sent out, and
    // therefore this tile does not need to be displayed (so we do not execute
    // this code that turns its display on).
    //
    if (!this.viewRequestID ||
        (this.map && this.viewRequestID == this.map.viewRequestID)) { 
        this.style.backgroundColor = null;
        this.style.display = "";  
    }
};

OpenLayers.Util.onImageLoadErrorColor = "pink";
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 0;
OpenLayers.Util.onImageLoadError = function() {
    this._attempts = (this._attempts) ? (this._attempts + 1) : 1;
    if(this._attempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
        this.src = this.src;
    } else {
        this.style.backgroundColor = OpenLayers.Util.onImageLoadErrorColor;
    }
    this.style.display = "";
};


OpenLayers.Util.alphaHack = function() {
    var arVersion = navigator.appVersion.split("MSIE");
    var version = parseFloat(arVersion[1]);
    var filter = false;
    
    // IEs4Lin dies when trying to access document.body.filters, because 
    // the property is there, but requires a DLL that can't be provided. This
    // means that we need to wrap this in a try/catch so that this can
    // continue.
    
    try { 
        filter = document.body.filters;
    } catch (e) {
    }    
    
    return ( filter &&
                      (version >= 5.5) && (version < 7) );
}

/** 
* @param {DOMElement} div Div containing Alpha-adjusted Image
* @param {String} id
* @param {OpenLayers.Pixel} px
* @param {OpenLayers.Size} sz
* @param {String} imgURL
* @param {String} position
* @param {String} border
* @param {String} sizing 'crop', 'scale', or 'image'. Default is "scale"
* @param {float} opacity Specified as fraction (0.4, etc)
*/ 
OpenLayers.Util.modifyAlphaImageDiv = function(div, id, px, sz, imgURL, 
                                               position, border, sizing, 
                                               opacity) {

    OpenLayers.Util.modifyDOMElement(div, id, px, sz);

    var img = div.childNodes[0];

    if (imgURL) {
        img.src = imgURL;
    }
    OpenLayers.Util.modifyDOMElement(img, div.id + "_innerImage", null, sz, 
                                     "relative", border);
    if (opacity) {
        div.style.opacity = opacity;
        div.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
    }
    
    if (OpenLayers.Util.alphaHack()) {

        div.style.display = "inline-block";
        if (sizing == null) {
            sizing = "scale";
        }
        
        div.style.filter = "progid:DXImageTransform.Microsoft" +
                           ".AlphaImageLoader(src='" + img.src + "', " +
                           "sizingMethod='" + sizing + "')";
        if (div.style.opacity) {
            div.style.filter += " alpha(opacity=" + div.style.opacity * 100 + ")";
        }

        img.style.filter = "progid:DXImageTransform.Microsoft" +
                                ".Alpha(opacity=0)";
    }
};

/** 
* @param {String} id
* @param {OpenLayers.Pixel} px
* @param {OpenLayers.Size} sz
* @param {String} imgURL
* @param {String} position
* @param {String} border
* @param {String} sizing 'crop', 'scale', or 'image'. Default is "scale"
* @param {Boolean} delayDisplay
*
* @returns A DOM Div created with a DOM Image inside it. If the hack is 
*           needed for transparency in IE, it is added.
* @type DOMElement
*/ 
OpenLayers.Util.createAlphaImageDiv = function(id, px, sz, imgURL, 
                                               position, border, sizing, 
                                               opacity, delayDisplay) {
    
    var div = OpenLayers.Util.createDiv();
    var img = OpenLayers.Util.createImage(null, null, null, null, null, null, 
                                          null, false);
    div.appendChild(img);

    if (delayDisplay) {
        img.style.display = "none";
        OpenLayers.Event.observe(img, "load",
                      OpenLayers.Util.onImageLoad.bindAsEventListener(div));
        OpenLayers.Event.observe(img, "error",
                      OpenLayers.Util.onImageLoadError.bindAsEventListener(div));
    }

    OpenLayers.Util.modifyAlphaImageDiv(div, id, px, sz, imgURL, position, 
                                        border, sizing, opacity);
    
    return div;
};


/** Creates a new hashtable and copies over all the keys from the 
*    passed-in object, but storing them under an uppercased
*    version of the key at which they were stored.
* 
* @param {Object} object
*
* @returns A new Object with all the same keys but uppercased
* @type Object
*/
OpenLayers.Util.upperCaseObject = function (object) {
    var uObject = new Object();
    for (var key in object) {
        uObject[key.toUpperCase()] = object[key];
    }
    return uObject;
};

/** Takes a hashtable and copies any keys that don't exist from
*   another hashtable, by analogy with OpenLayers.Util.extend() from
*   Prototype.js.
*
* @param {Object} to
* @param {Object} from
*/
OpenLayers.Util.applyDefaults = function (to, from) {
    for (var key in from) {
        if (to[key] == null) {
            to[key] = from[key];
        }
    }
};

/**
* @param {Object} params
*
* @returns a concatenation of the properties of an object in 
*    http parameter notation. 
*    (ex. <i>"key1=value1&key2=value2&key3=value3"</i>)
*    If a parameter is actually a list, that parameter will then
*    be set to a comma-seperated list of values (foo,bar) instead
*    of being URL escaped (foo%3Abar). 
* @type String
*/
OpenLayers.Util.getParameterString = function(params) {
    paramsArray = new Array();
    
    for (var key in params) {
      var value = params[key];
      if ((value != null) && (typeof value != 'function')) {
        var encodedValue;
        if (typeof value == 'object' && value.constructor == Array) {
          /* value is an array; encode items and separate with "," */
          var encodedItemArray = new Array();
          for (var itemIndex=0; itemIndex<value.length; itemIndex++) {
            encodedItemArray.push(encodeURIComponent(value[itemIndex]));
          }
          encodedValue = encodedItemArray.join(",");
        }
        else {
          /* value is a string; simply encode */
          encodedValue = encodeURIComponent(value);
        }
        paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
      }
    }
    
    return paramsArray.join("&");
};

/** 
* @returns The fully formatted image location string
* @type String
*/

OpenLayers.ImgPath = '';
OpenLayers.Util.getImagesLocation = function() {
    return OpenLayers.ImgPath || (OpenLayers._getScriptLocation() + "img/");
};

/* Originally from Prototype */

OpenLayers.Util.Try = function() {
    var returnValue;

    for (var i = 0; i < arguments.length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
}


/** These could/should be made namespace aware?
*
* @param {} p
* @param {str} tagName
*
* @return {Array}
*/
OpenLayers.Util.getNodes=function(p, tagName) {
    var nodes = OpenLayers.Util.Try(
        function () {
            return OpenLayers.Util._getNodes(p.documentElement.childNodes,
                                            tagName);
        },
        function () {
            return OpenLayers.Util._getNodes(p.childNodes, tagName);
        }
    );
    return nodes;
};

/**
* @param {Array} nodes
* @param {str} tagName
*
* @return {Array}
*/
OpenLayers.Util._getNodes=function(nodes, tagName) {
    var retArray = new Array();
    for (var i=0;i<nodes.length;i++) {
        if (nodes[i].nodeName==tagName) {
            retArray.push(nodes[i]);
        }
    }

    return retArray;
};



/**
* @param {} parent
* @param {str} item
* @param {int} index
*
* @return {str}
*/
OpenLayers.Util.getTagText = function (parent, item, index) {
    var result = OpenLayers.Util.getNodes(parent, item);
    if (result && (result.length > 0))
    {
        if (!index) {
            index=0;
        }
        if (result[index].childNodes.length > 1) {
            return result.childNodes[1].nodeValue; 
        }
        else if (result[index].childNodes.length == 1) {
            return result[index].firstChild.nodeValue; 
        }
    } else { 
        return ""; 
    }
};

/**
 * @param {XMLNode} node
 * 
 * @returns The text value of the given node, without breaking in firefox or IE
 * @type String
 */
OpenLayers.Util.getXmlNodeValue = function(node) {
    var val = null;
    OpenLayers.Util.Try( 
        function() {
            val = node.text;
            if (!val)
                val = node.textContent;
            if (!val)
                val = node.firstChild.nodeValue;
        }, 
        function() {
            val = node.textContent;
        }); 
    return val;
};

/** 
* @param {Event} evt
* @param {HTMLDivElement} div
*
* @return {boolean}
*/
OpenLayers.Util.mouseLeft = function (evt, div) {
    // start with the element to which the mouse has moved
    var target = (evt.relatedTarget) ? evt.relatedTarget : evt.toElement;
    // walk up the DOM tree.
    while (target != div && target != null) {
        target = target.parentNode;
    }
    // if the target we stop at isn't the div, then we've left the div.
    return (target != div);
};

OpenLayers.Util.rad = function(x) {return x*Math.PI/180;};
OpenLayers.Util.distVincenty=function(p1, p2) {
    var a = 6378137, b = 6356752.3142,  f = 1/298.257223563;
    var L = OpenLayers.Util.rad(p2.lon - p1.lon);
    var U1 = Math.atan((1-f) * Math.tan(OpenLayers.Util.rad(p1.lat)));
    var U2 = Math.atan((1-f) * Math.tan(OpenLayers.Util.rad(p2.lat)));
    var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
    var lambda = L, lambdaP = 2*Math.PI;
    var iterLimit = 20;
    while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0) {
        var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) +
        (cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));
        if (sinSigma==0) return 0;  // co-incident points
        var cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
        var sigma = Math.atan2(sinSigma, cosSigma);
        var alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        var cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        var cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
        var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1-C) * f * Math.sin(alpha) *
        (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
    }
    if (iterLimit==0) return NaN  // formula failed to converge
    var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
    var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
        B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
    var s = b*A*(sigma-deltaSigma);
    var d = s.toFixed(3)/1000; // round to 1mm precision
    return d;
};

/**
 * @param {String} url Optional url used to extract the query string.
 *                     If null, query string is taken from page location.
 * 
 * @returns An object of key/value pairs from the query string.
 * @type Object
 */
OpenLayers.Util.getArgs = function(url) {
    if(url == null) {
        url = window.location.href;
    }
    var query = (url.indexOf('?') != -1) ? url.substring(url.indexOf('?') + 1) 
                                         : '';
    
    var args = new Object();
    pairs = query.split(/[&;]/);
    for(var i = 0; i < pairs.length; ++i) {
        keyValue = pairs[i].split(/=/);
        if(keyValue.length == 2) {
            args[decodeURIComponent(keyValue[0])] =
                decodeURIComponent(keyValue[1]);
        }
    }
    return args;
}

OpenLayers.Util.lastSeqID = 0;

/**
 * @param {String} prefix String to prefix random id. If null, default
 *                         is "id_"
 * 
 * @returns A unique id string, built on the passed in prefix
 * @type String
 */
OpenLayers.Util.createUniqueID = function(prefix) {
    if (prefix == null) {
        prefix = "id_";
    }
    OpenLayers.Util.lastSeqID += 1; 
    return prefix + OpenLayers.Util.lastSeqID;        
};

/** Constant inches per unit 
 *    -- borrowed from MapServer mapscale.c
 * 
 * @type Object */
OpenLayers.INCHES_PER_UNIT = { 
    'inches': 1.0,
    'ft': 12.0,
    'mi': 63360.0,
    'm': 39.3701,
    'km': 39370.1,
    'dd': 4374754
};
OpenLayers.INCHES_PER_UNIT["in"]= OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"] = OpenLayers.INCHES_PER_UNIT.dd;

/** A sensible default 
 * @type int */
OpenLayers.DOTS_PER_INCH = 72;

/**
 * @param {float} scale
 * 
 * @returns A normalized scale value, in 1 / X format. 
 *          This means that if a value less than one ( already 1/x) is passed
 *          in, it just returns scale directly. Otherwise, it returns 
 *          1 / scale
 * @type float
 */
OpenLayers.Util.normalizeScale = function (scale) {
    var normScale = (scale > 1.0) ? (1.0 / scale) 
                                  : scale;
    return normScale;
};

/**
 * @param {float} scale
 * @param {String} units Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                       Default is degrees
 * 
 * @returns The corresponding resolution given passed-in scale and unit 
 *          parameters.
 * @type float
 */
OpenLayers.Util.getResolutionFromScale = function (scale, units) {

    if (units == null) {
        units = "degrees";
    }

    var normScale = OpenLayers.Util.normalizeScale(scale);

    var resolution = 1 / (normScale * OpenLayers.INCHES_PER_UNIT[units]
                                    * OpenLayers.DOTS_PER_INCH);
    return resolution;
};

/**
 * @param {float} resolution
 * @param {String} units Index into OpenLayers.INCHES_PER_UNIT hashtable.
 *                       Default is degrees
 * 
 * @returns The corresponding scale given passed-in resolution and unit 
 *          parameters.
 * @type float
 */
OpenLayers.Util.getScaleFromResolution = function (resolution, units) {

    if (units == null) {
        units = "degrees";
    }

    var scale = resolution * OpenLayers.INCHES_PER_UNIT[units] *
                    OpenLayers.DOTS_PER_INCH;
    return scale;
};

/** Safely stop the propagation of an event *without* preventing
 *   the default browser action from occurring.
 * 
 * @param {Event} evt
 */
OpenLayers.Util.safeStopPropagation = function(evt) {
    if (evt.stopPropagation) {
        evt.stopPropagation();
    } 
    evt.cancelBubble = true;    
};

OpenLayers.Util.pagePosition = function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      // Safari fix
      if (element.offsetParent==document.body)
        if (OpenLayers.Element.getStyle(element,'position')=='absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      valueT -= element.scrollTop  || 0;
      valueL -= element.scrollLeft || 0;
    } while (element = element.parentNode);

    return [valueL, valueT];
};


/** Test two URLs for equivalence. 
 * 
 * Setting 'ignoreCase' allows for case-independent comparison.
 * 
 * Comparison is based on: 
 *  - Protocol
 *  - Host (evaluated without the port)
 *  - Port (set 'ignorePort80' to ignore "80" values)
 *  - Hash ( set 'ignoreHash' to disable)
 *  - Pathname (for relative <-> absolute comparison) 
 *  - Arguments (so they can be out of order)
 *  
 * 
 *
 * @param {String} url1
 * @param {String} url2
 * @param {Object} options allows for customization of comparison:
 *                         'ignoreCase' - Default is True
 *                         'ignorePort80' - Default is True
 *                         'ignoreHash' - Default is True
 *
 * @returns Whether or not the two URLs are equivalent
 * @type Boolean
 */
OpenLayers.Util.isEquivalentUrl = function(url1, url2, options) {
    options = options || new Object();

    OpenLayers.Util.applyDefaults(options, {
        ignoreCase: true,
        ignorePort80: true,
        ignoreHash: true
    });

    urlObj1 = OpenLayers.Util.createUrlObject(url1, options);
    urlObj2 = OpenLayers.Util.createUrlObject(url2, options);

    //compare all keys (host, port, etc)
    for(var key in urlObj1) {
        if (options.test) {
            alert(key + "\n1:" + urlObj1[key] + "\n2:" + urlObj2[key]);
        }
        var val1 = urlObj1[key];
        var val2 = urlObj2[key];
        
        switch(key) {
            case "args":
                //do nothing, they'll be treated below
                break;
            case "host":
            case "port":
            case "protocol":
                if ((val1 == "") || (val2 == "")) {
                    //these will be blank for relative urls, so no need to 
                    // compare them here -- call break. 
                    // 
                    break;
                } 
                // otherwise continue with default compare
                //
            default: 
                if ( (key != "args") && (urlObj1[key] != urlObj2[key]) ) {
                    return false;
                }
                break;
        }
        
    }

    // compare search args - irrespective of order
    for(var key in urlObj1.args) {
        if(urlObj1.args[key] != urlObj2.args[key]) {
            return false;
        }
        delete urlObj2.args[key];
    }
    // urlObj2 shouldn't have any args left
    for(var key in urlObj2.args) {
        return false;
    }
    
    return true;
};

/**
 * @private
 *
 * @param {String} url
 * @param {Object} options
 * 
 * @returns An object with separate url, a, port, host, and args parsed out 
 *            and ready for comparison
 * @type Object
 */
OpenLayers.Util.createUrlObject = function(url, options) {
    options = options || new Object();

    var urlObject = new Object();
  
    if (options.ignoreCase) {
        url = url.toLowerCase(); 
    }

    var a = document.createElement('a');
    a.href = url;
    
  //host (without port)
    urlObject.host = a.host;
    var port = a.port;
    if (port.length <= 0) {
        var newHostLength = urlObject.host.length - (port.length);
        urlObject.host = urlObject.host.substring(0, newHostLength); 
    }

  //protocol
    urlObject.protocol = a.protocol;  

  //port
    urlObject.port = ((port == "80") && (options.ignorePort80)) ? "" : port;
                                                                     
  //hash
    urlObject.hash = (options.ignoreHash) ? "" : a.hash;  
    
  //args
    var queryString = a.search;
    if (!queryString) {
        var qMark = url.indexOf("?");
        queryString = (qMark != -1) ? url.substr(qMark) : "";
    }
    urlObject.args = OpenLayers.Util.getArgs(queryString);


  //pathname (this part allows for relative <-> absolute comparison)
    if ( ((urlObject.protocol == "file:") && (url.indexOf("file:") != -1)) || 
         ((urlObject.protocol != "file:") && (urlObject.host != "")) ) {

        urlObject.pathname = a.pathname;  

        //Test to see if the pathname includes the arguments (Opera)
        var qIndex = urlObject.pathname.indexOf("?");
        if (qIndex != -1) {
            urlObject.pathname = urlObject.pathname.substring(0, qIndex);
        }

    } else {
        var relStr = OpenLayers.Util.removeTail(url);

        var backs = 0;
        do {
            var index = relStr.indexOf("../");

            if (index == 0) {
                backs++
                relStr = relStr.substr(3);
            } else if (index >= 0) {
                var prevChunk = relStr.substr(0,index - 1);
                
                var slash = prevChunk.indexOf("/");
                prevChunk = (slash != -1) ? prevChunk.substr(0, slash +1)
                                          : "";
                
                var postChunk = relStr.substr(index + 3);                
                relStr = prevChunk + postChunk;
            }
        } while(index != -1)

        var windowAnchor = document.createElement("a");
        var windowUrl = window.location.href;
        if (options.ignoreCase) {
            windowUrl = windowUrl.toLowerCase();
        }
        windowAnchor.href = windowUrl;

      //set protocol of window
        urlObject.protocol = windowAnchor.protocol;

        var splitter = (windowAnchor.pathname.indexOf("/") != -1) ? "/" : "\\";
        var dirs = windowAnchor.pathname.split(splitter);
        dirs.pop(); //remove filename
        while ((backs > 0) && (dirs.length > 0)) {
            dirs.pop();
            backs--;
        }
        relStr = dirs.join("/") + "/"+ relStr;
        urlObject.pathname = relStr;
    }
    
    if ((urlObject.protocol == "file:") || (urlObject.protocol == "")) {
        urlObject.host = "localhost";
    }

    return urlObject; 
};
 
/**
 * @param {String} url
 * 
 * @returns The string with all queryString and Hash removed
 * @type String
 */
OpenLayers.Util.removeTail = function(url) {
    var head = null;
    
    var qMark = url.indexOf("?");
    var hashMark = url.indexOf("#");

    if (qMark == -1) {
        head = (hashMark != -1) ? url.substr(0,hashMark) : url;
    } else {
        head = (hashMark != -1) ? url.substr(0,Math.min(qMark, hashMark)) 
                                  : url.substr(0, qMark);
    }
    return head;
};
/* ======================================================================    Rico/Corner.js
   ====================================================================== */

/**  
*  
*  Copyright 2005 Sabre Airline Solutions  
*  
*  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this  
*  file except in compliance with the License. You may obtain a copy of the License at  
*  
*         http://www.apache.org/licenses/LICENSE-2.0  
*  
*  Unless required by applicable law or agreed to in writing, software distributed under the  
*  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,  
*  either express or implied. See the License for the specific language governing permissions  
*  and limitations under the License.  
**/  


OpenLayers.Rico = new Object();
OpenLayers.Rico.Corner = {

   round: function(e, options) {
      e = OpenLayers.Util.getElement(e);
      this._setOptions(options);

      var color = this.options.color;
      if ( this.options.color == "fromElement" )
         color = this._background(e);

      var bgColor = this.options.bgColor;
      if ( this.options.bgColor == "fromParent" )
         bgColor = this._background(e.offsetParent);

      this._roundCornersImpl(e, color, bgColor);
   },

    /**   This is a helper function to change the background
    *     color of <div> that has had Rico rounded corners added.
    *
    *     It seems we cannot just set the background color for the
    *     outer <div> so each <span> element used to create the
    *     corners must have its background color set individually.
    *
    * @param {DOM} theDiv - A child of the outer <div> that was
    *                        supplied to the `round` method.
    *
    * @param {String} newColor - The new background color to use.
    */
    changeColor: function(theDiv, newColor) {
   
        theDiv.style.backgroundColor = newColor;

        var spanElements = theDiv.parentNode.getElementsByTagName("span");
        
        for (var currIdx = 0; currIdx < spanElements.length; currIdx++) {
            spanElements[currIdx].style.backgroundColor = newColor;
        }
    }, 


    /**   This is a helper function to change the background
    *     opacity of <div> that has had Rico rounded corners added.
    *
    *     See changeColor (above) for algorithm explanation
    *
    * @param {DOM} theDiv A child of the outer <div> that was
    *                        supplied to the `round` method.
    *
    * @param {int} newOpacity The new opacity to use (0-1).
    */
    changeOpacity: function(theDiv, newOpacity) {
   
        var mozillaOpacity = newOpacity;
        var ieOpacity = 'alpha(opacity=' + newOpacity * 100 + ')';
        
        theDiv.style.opacity = mozillaOpacity;
        theDiv.style.filter = ieOpacity;

        var spanElements = theDiv.parentNode.getElementsByTagName("span");
        
        for (var currIdx = 0; currIdx < spanElements.length; currIdx++) {
            spanElements[currIdx].style.opacity = mozillaOpacity;
            spanElements[currIdx].style.filter = ieOpacity;
        }

    },

    /** this function takes care of redoing the rico cornering
    *    
    *    you can't just call updateRicoCorners() again and pass it a 
    *    new options string. you have to first remove the divs that 
    *    rico puts on top and below the content div.
    *
    * @param {DOM} theDiv - A child of the outer <div> that was
    *                        supplied to the `round` method.
    *
    * @param {Array} options - list of options
    */
    reRound: function(theDiv, options) {

        var topRico = theDiv.parentNode.childNodes[0];
        //theDiv would be theDiv.parentNode.childNodes[1]
        var bottomRico = theDiv.parentNode.childNodes[2];
       
        theDiv.parentNode.removeChild(topRico);
        theDiv.parentNode.removeChild(bottomRico); 

        this.round(theDiv.parentNode, options);
    }, 

   _roundCornersImpl: function(e, color, bgColor) {
      if(this.options.border)
         this._renderBorder(e,bgColor);
      if(this._isTopRounded())
         this._roundTopCorners(e,color,bgColor);
      if(this._isBottomRounded())
         this._roundBottomCorners(e,color,bgColor);
   },

   _renderBorder: function(el,bgColor) {
      var borderValue = "1px solid " + this._borderColor(bgColor);
      var borderL = "border-left: "  + borderValue;
      var borderR = "border-right: " + borderValue;
      var style   = "style='" + borderL + ";" + borderR +  "'";
      el.innerHTML = "<div " + style + ">" + el.innerHTML + "</div>"
   },

   _roundTopCorners: function(el, color, bgColor) {
      var corner = this._createCorner(bgColor);
      for(var i=0 ; i < this.options.numSlices ; i++ )
         corner.appendChild(this._createCornerSlice(color,bgColor,i,"top"));
      el.style.paddingTop = 0;
      el.insertBefore(corner,el.firstChild);
   },

   _roundBottomCorners: function(el, color, bgColor) {
      var corner = this._createCorner(bgColor);
      for(var i=(this.options.numSlices-1) ; i >= 0 ; i-- )
         corner.appendChild(this._createCornerSlice(color,bgColor,i,"bottom"));
      el.style.paddingBottom = 0;
      el.appendChild(corner);
   },

   _createCorner: function(bgColor) {
      var corner = document.createElement("div");
      corner.style.backgroundColor = (this._isTransparent() ? "transparent" : bgColor);
      return corner;
   },

   _createCornerSlice: function(color,bgColor, n, position) {
      var slice = document.createElement("span");

      var inStyle = slice.style;
      inStyle.backgroundColor = color;
      inStyle.display  = "block";
      inStyle.height   = "1px";
      inStyle.overflow = "hidden";
      inStyle.fontSize = "1px";

      var borderColor = this._borderColor(color,bgColor);
      if ( this.options.border && n == 0 ) {
         inStyle.borderTopStyle    = "solid";
         inStyle.borderTopWidth    = "1px";
         inStyle.borderLeftWidth   = "0px";
         inStyle.borderRightWidth  = "0px";
         inStyle.borderBottomWidth = "0px";
         inStyle.height            = "0px"; // assumes css compliant box model
         inStyle.borderColor       = borderColor;
      }
      else if(borderColor) {
         inStyle.borderColor = borderColor;
         inStyle.borderStyle = "solid";
         inStyle.borderWidth = "0px 1px";
      }

      if ( !this.options.compact && (n == (this.options.numSlices-1)) )
         inStyle.height = "2px";

      this._setMargin(slice, n, position);
      this._setBorder(slice, n, position);
      return slice;
   },

   _setOptions: function(options) {
      this.options = {
         corners : "all",
         color   : "fromElement",
         bgColor : "fromParent",
         blend   : true,
         border  : false,
         compact : false
      }
      OpenLayers.Util.extend(this.options, options || {});

      this.options.numSlices = this.options.compact ? 2 : 4;
      if ( this._isTransparent() )
         this.options.blend = false;
   },

   _whichSideTop: function() {
      if ( this._hasString(this.options.corners, "all", "top") )
         return "";

      if ( this.options.corners.indexOf("tl") >= 0 && this.options.corners.indexOf("tr") >= 0 )
         return "";

      if (this.options.corners.indexOf("tl") >= 0)
         return "left";
      else if (this.options.corners.indexOf("tr") >= 0)
          return "right";
      return "";
   },

   _whichSideBottom: function() {
      if ( this._hasString(this.options.corners, "all", "bottom") )
         return "";

      if ( this.options.corners.indexOf("bl")>=0 && this.options.corners.indexOf("br")>=0 )
         return "";

      if(this.options.corners.indexOf("bl") >=0)
         return "left";
      else if(this.options.corners.indexOf("br")>=0)
         return "right";
      return "";
   },

   _borderColor : function(color,bgColor) {
      if ( color == "transparent" )
         return bgColor;
      else if ( this.options.border )
         return this.options.border;
      else if ( this.options.blend )
         return this._blend( bgColor, color );
      else
         return "";
   },


   _setMargin: function(el, n, corners) {
      var marginSize = this._marginSize(n);
      var whichSide = corners == "top" ? this._whichSideTop() : this._whichSideBottom();

      if ( whichSide == "left" ) {
         el.style.marginLeft = marginSize + "px"; el.style.marginRight = "0px";
      }
      else if ( whichSide == "right" ) {
         el.style.marginRight = marginSize + "px"; el.style.marginLeft  = "0px";
      }
      else {
         el.style.marginLeft = marginSize + "px"; el.style.marginRight = marginSize + "px";
      }
   },

   _setBorder: function(el,n,corners) {
      var borderSize = this._borderSize(n);
      var whichSide = corners == "top" ? this._whichSideTop() : this._whichSideBottom();
      if ( whichSide == "left" ) {
         el.style.borderLeftWidth = borderSize + "px"; el.style.borderRightWidth = "0px";
      }
      else if ( whichSide == "right" ) {
         el.style.borderRightWidth = borderSize + "px"; el.style.borderLeftWidth  = "0px";
      }
      else {
         el.style.borderLeftWidth = borderSize + "px"; el.style.borderRightWidth = borderSize + "px";
      }
      if (this.options.border != false)
        el.style.borderLeftWidth = borderSize + "px"; el.style.borderRightWidth = borderSize + "px";
   },

   _marginSize: function(n) {
      if ( this._isTransparent() )
         return 0;

      var marginSizes          = [ 5, 3, 2, 1 ];
      var blendedMarginSizes   = [ 3, 2, 1, 0 ];
      var compactMarginSizes   = [ 2, 1 ];
      var smBlendedMarginSizes = [ 1, 0 ];

      if ( this.options.compact && this.options.blend )
         return smBlendedMarginSizes[n];
      else if ( this.options.compact )
         return compactMarginSizes[n];
      else if ( this.options.blend )
         return blendedMarginSizes[n];
      else
         return marginSizes[n];
   },

   _borderSize: function(n) {
      var transparentBorderSizes = [ 5, 3, 2, 1 ];
      var blendedBorderSizes     = [ 2, 1, 1, 1 ];
      var compactBorderSizes     = [ 1, 0 ];
      var actualBorderSizes      = [ 0, 2, 0, 0 ];

      if ( this.options.compact && (this.options.blend || this._isTransparent()) )
         return 1;
      else if ( this.options.compact )
         return compactBorderSizes[n];
      else if ( this.options.blend )
         return blendedBorderSizes[n];
      else if ( this.options.border )
         return actualBorderSizes[n];
      else if ( this._isTransparent() )
         return transparentBorderSizes[n];
      return 0;
   },

   _hasString: function(str) { for(var i=1 ; i<arguments.length ; i++) if (str.indexOf(arguments[i]) >= 0) return true; return false; },
   _blend: function(c1, c2) { var cc1 = OpenLayers.Rico.Color.createFromHex(c1); cc1.blend(OpenLayers.Rico.Color.createFromHex(c2)); return cc1; },
   _background: function(el) { try { return OpenLayers.Rico.Color.createColorFromBackground(el).asHex(); } catch(err) { return "#ffffff"; } },
   _isTransparent: function() { return this.options.color == "transparent"; },
   _isTopRounded: function() { return this._hasString(this.options.corners, "all", "top", "tl", "tr"); },
   _isBottomRounded: function() { return this._hasString(this.options.corners, "all", "bottom", "bl", "br"); },
   _hasSingleTextChild: function(el) { return el.childNodes.length == 1 && el.childNodes[0].nodeType == 3; }
}
/* ======================================================================    OpenLayers/Ajax.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


OpenLayers.ProxyHost = "";
//OpenLayers.ProxyHost = "examples/proxy.cgi?url=";

/**
* Ajax reader for OpenLayers
*
*@uri url to do remote XML http get
*@param 'get' format params (x=y&a=b...)
*@who object to handle callbacks for this request
*@complete  the function to be called on success 
*@failure  the function to be called on failure
*
* example usage from a caller:
*
*   caps: function(request) {
*    -blah-  
*   },
*
*   OpenLayers.loadURL(url,params,this,caps);
*
* Notice the above example does not provide an error handler; a default empty
* handler is provided which merely logs the error if a failure handler is not 
* supplied
*
*/


/** 
* @param {} request
*/
OpenLayers.nullHandler = function(request) {
    alert("Unhandled request return " + request.statusText);
};

/** Background load a document
*
* @param {String} uri URI of source doc
* @param {String} params Params on get (doesnt seem to work)
* @param {Object} caller object which gets callbacks
* @param {Function} onComplete callback for success
* @param {Function} onFailure callback for failure
*
* Both callbacks optional (though silly)
*/
OpenLayers.loadURL = function(uri, params, caller,
                                  onComplete, onFailure) {

    if (OpenLayers.ProxyHost && uri.startsWith("http")) {
        uri = OpenLayers.ProxyHost + escape(uri);
    }

    var success = (onComplete) ? onComplete.bind(caller)
                                : OpenLayers.nullHandler;

    var failure = (onFailure) ? onFailure.bind(caller)
                           : OpenLayers.nullHandler;

    // from prototype.js
    new OpenLayers.Ajax.Request(uri, 
                     {   method: 'get', 
                         parameters: params,
                         onComplete: success, 
                         onFailure: failure
                      }
                     );
};

/** Parse XML into a doc structure
* @param {String} text
*
* @returns Parsed Ajax Response ??
* @type ?
*/
OpenLayers.parseXMLString = function(text) {

    //MS sucks, if the server is bad it dies
    var index = text.indexOf('<');
    if (index > 0) {
        text = text.substring(index);
    }

    var ajaxResponse = OpenLayers.Util.Try(
        function() {
            var xmldom = new ActiveXObject('Microsoft.XMLDOM');
            xmldom.loadXML(text);
            return xmldom;
        },
        function() {
            return new DOMParser().parseFromString(text, 'text/xml');
        },
        function() {
            var req = new XMLHttpRequest();
            req.open("GET", "data:" + "text/xml" +
                     ";charset=utf-8," + encodeURIComponent(text), false);
            if (req.overrideMimeType) {
                req.overrideMimeType("text/xml");
            }
            req.send(null);
            return req.responseXML;
        }
    );

    return ajaxResponse;
};

OpenLayers.Ajax = {
  emptyFunction: function () {},

  getTransport: function() {
    return OpenLayers.Util.Try(
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')},
      function() {return new XMLHttpRequest()}
    ) || false;
  },

  activeRequestCount: 0
};

OpenLayers.Ajax.Responders = {
  responders: [],

  register: function(responderToAdd) {
    for (var i = 0; i < this.responders.length; i++)
        if (responderToAdd == this.responders[i])
            return;
    this.responders.push(responderToAdd);
  },

  dispatch: function(callback, request, transport, json) {
    for (var i = 0; i < this.responders.length; i++) {
      responder = this.responders[i];
      if (responder[callback] && typeof responder[callback] == 'function') {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) {}
      }
    }
  }
};

OpenLayers.Ajax.Responders.register({
  onCreate: function() {
    OpenLayers.Ajax.activeRequestCount++;
  },

  onComplete: function() {
    OpenLayers.Ajax.activeRequestCount--;
  }
});

OpenLayers.Ajax.Base = function() {};
OpenLayers.Ajax.Base.prototype = {
  setOptions: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      parameters:   ''
    }
    OpenLayers.Util.extend(this.options, options || {});
  },

  responseIsSuccess: function() {
    return this.transport.status == undefined
        || this.transport.status == 0
        || (this.transport.status >= 200 && this.transport.status < 300);
  },

  responseIsFailure: function() {
    return !this.responseIsSuccess();
  }
}

OpenLayers.Ajax.Request = OpenLayers.Class.create();
OpenLayers.Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

OpenLayers.Ajax.Request.prototype = OpenLayers.Class.inherit( OpenLayers.Ajax.Base, {
  initialize: function(url, options) {
    this.transport = OpenLayers.Ajax.getTransport();
    this.setOptions(options);
    this.request(url);
  },

  request: function(url) {
    var parameters = this.options.parameters || '';
    if (parameters.length > 0) parameters += '&_=';

    try {
      this.url = url;
      if (this.options.method == 'get' && parameters.length > 0)
        this.url += (this.url.match(/\?/) ? '&' : '?') + parameters;

      OpenLayers.Ajax.Responders.dispatch('onCreate', this, this.transport);

      this.transport.open(this.options.method, this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) {
        this.transport.onreadystatechange = this.onStateChange.bind(this);
        setTimeout((function() {this.respondToReadyState(1)}).bind(this), 10);
      }

      this.setRequestHeaders();

      var body = this.options.postBody ? this.options.postBody : parameters;
      this.transport.send(this.options.method == 'post' ? body : null);

    } catch (e) {
      this.dispatchException(e);
    }
  },

  setRequestHeaders: function() {
    var requestHeaders =
      ['X-Requested-With', 'XMLHttpRequest',
       'X-Prototype-Version', 'OpenLayers'];

    if (this.options.method == 'post' && !this.options.postBody) {
      requestHeaders.push('Content-type',
        'application/x-www-form-urlencoded');

      /* Force "Connection: close" for Mozilla browsers to work around
       * a bug where XMLHttpReqeuest sends an incorrect Content-length
       * header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType)
        requestHeaders.push('Connection', 'close');
    }

    if (this.options.requestHeaders)
      requestHeaders.push.apply(requestHeaders, this.options.requestHeaders);

    for (var i = 0; i < requestHeaders.length; i += 2)
      this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i+1]);
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState != 1)
      this.respondToReadyState(this.transport.readyState);
  },

  header: function(name) {
    try {
      return this.transport.getResponseHeader(name);
    } catch (e) {}
  },

  evalJSON: function() {
    try {
      return eval(this.header('X-JSON'));
    } catch (e) {}
  },

  evalResponse: function() {
    try {
      return eval(this.transport.responseText);
    } catch (e) {
      this.dispatchException(e);
    }
  },

  respondToReadyState: function(readyState) {
    var event = OpenLayers.Ajax.Request.Events[readyState];
    var transport = this.transport, json = this.evalJSON();

    if (event == 'Complete') {
      try {
        (this.options['on' + this.transport.status]
         || this.options['on' + (this.responseIsSuccess() ? 'Success' : 'Failure')]
         || OpenLayers.Ajax.emptyFunction)(transport, json);
      } catch (e) {
        this.dispatchException(e);
      }

      if ((this.header('Content-type') || '').match(/^text\/javascript/i))
        this.evalResponse();
    }

    try {
      (this.options['on' + event] || OpenLayers.Ajax.emptyFunction)(transport, json);
      OpenLayers.Ajax.Responders.dispatch('on' + event, this, transport, json);
    } catch (e) {
      this.dispatchException(e);
    }

    /* Avoid memory leak in MSIE: clean up the oncomplete event handler */
    if (event == 'Complete')
      this.transport.onreadystatechange = OpenLayers.Ajax.emptyFunction;
  },

  dispatchException: function(exception) {
    (this.options.onException || OpenLayers.Ajax.emptyFunction)(this, exception);
    OpenLayers.Ajax.Responders.dispatch('onException', this, exception);
  }
});

OpenLayers.Ajax.getElementsByTagNameNS  = function(parentnode, nsuri, nsprefix, tagname) {
    return parentnode.getElementsByTagNameNS ?
        parentnode.getElementsByTagNameNS(nsuri, tagname)
        : parentnode.getElementsByTagName(nsprefix + ':' + tagname);
}

/**
 * Wrapper function around XMLSerializer, which doesn't exist/work in
 * IE/Safari. We need to come up with a way to serialize in those browser:
 * for now, these browsers will just fail.
 * #535, #536
 *
 * @param {XMLNode} xmldom xml dom to serialize
 */
OpenLayers.Ajax.serializeXMLToString = function(xmldom) {
    var serializer = new XMLSerializer();
    data = serializer.serializeToString(xmldom);
    return data;
}
/* ======================================================================    OpenLayers/Control.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
* @class
*/
OpenLayers.Control = OpenLayers.Class.create();

OpenLayers.Control.TYPE_BUTTON = 1;
OpenLayers.Control.TYPE_TOGGLE = 2;
OpenLayers.Control.TYPE_TOOL   = 3;

OpenLayers.Control.prototype = {

    /** @type String */
    id: null,
    
    /** this gets set in the addControl() function in OpenLayers.Map
    * @type OpenLayers.Map */
    map: null,

    /** @type DOMElement */
    div: null,

    /** 
     * Controls can have a 'type'. The type determines the type of interactions
     * which are possible with them when they are placed into a toolbar.
     * @type OpenLayers.Control.TYPES
     */
    type: null, 

    /**  This property is used for CSS related to the drawing of the Control.
     * @type string 
     */
    displayClass: "",

    /**
     * @type boolean
     */
    active: null,

    /**
     * @type OpenLayers.Handler
     */
    handler: null,

    /**
     * @constructor
     * 
     * @param {Object} options
     */
    initialize: function (options) {
        // We do this before the extend so that instances can override
        // className in options.
        this.displayClass = this.CLASS_NAME.replace("OpenLayers.", "ol").replace(".","");
        
        OpenLayers.Util.extend(this, options);
        
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },

    /**
     * 
     */
    destroy: function () {
        // eliminate circular references
        this.map = null;
    },

    /** Set the map property for the control. This is done through an accessor
     *   so that subclasses can override this and take special action once 
     *   they have their map variable set. 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        this.map = map;
        if (this.handler) {
            this.handler.setMap(map);
        }
    },
  
    /**
     * @param {OpenLayers.Pixel} px
     *
     * @returns A reference to the DIV DOMElement containing the control
     * @type DOMElement
     */
    draw: function (px) {
        if (this.div == null) {
            this.div = OpenLayers.Util.createDiv();
            this.div.id = this.id;
            this.div.className = this.displayClass;
        }
        if (px != null) {
            this.position = px.clone();
        }
        this.moveTo(this.position);        
        return this.div;
    },

    /**
     * @param {OpenLayers.Pixel} px
     */
    moveTo: function (px) {
        if ((px != null) && (this.div != null)) {
            this.div.style.left = px.x + "px";
            this.div.style.top = px.y + "px";
        }
    },

    /**
     * @type boolean
     */
    activate: function () {
        if (this.active) {
            return false;
        }
        if (this.handler) {
            this.handler.activate();
        }
        this.active = true;
        return true;
    },
    
    /**
     * @type boolean
     */
    deactivate: function () {
        if (this.active) {
            if (this.handler) {
                this.handler.deactivate();
            }
            this.active = false;
            return true;
        }
        return false;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control"
};
/* ======================================================================    OpenLayers/Geometry.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
 
/**
 * @class
 */
OpenLayers.Geometry = OpenLayers.Class.create();
OpenLayers.Geometry.prototype = {

    /** @type String */
    id: null,

    /** This is set when a Geometry is added as Component of another Geometry
     * 
     * @type OpenLayers.Geometry */
    parent: null,

    /** @type OpenLayers.Bounds */
    bounds: null,
    
    /** 
     * Cross reference back to the feature that owns this geometry so
     * that that the feature can be identified after the geometry has been
     * selected by a mouse click.
     * 
     * @type OpenLayers.Feature */
    feature: null,
    
    /** @type OpenLayers.Events */
    events:null,

    /**
     * @constructor
     */
    initialize: function() {
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME+ "_");
    },
    
    /**
     * 
     */
    destroy: function() {
        this.id = null;

        this.bounds = null;
        this.feature = null;

        if (this.events) {
            this.events.destroy();
        }
        this.events = null;        
    },
    
    /**
     * Set the bounds for this Geometry.
     * 
     * @param {OpenLayers.Bounds} object
     */
    setBounds: function(bounds) {
        if (bounds) {
            this.bounds = bounds.clone();
        }
    },
    
    /**
     * Nullify this components bounds and that of its parent as well.
     */
    clearBounds: function() {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }    
    },
    
    /**
     * Extend the existing bounds to include the new bounds. 
     * If geometry's bounds is not yet set, then set a new Bounds.
     * 
     * @param {OpenLayers.Bounds} newBounds
     */
    extendBounds: function(newBounds){
        var bounds = this.getBounds();
        if (!bounds) {
            this.setBounds(newBounds);
        } else {
            this.bounds.extend(newBounds);
        }
    },
    
    /**
     * Get the bounds for this Geometry. If bounds is not set, it 
     * is calculated again, this makes queries faster.
     * 
     * @type OpenLayers.Bounds
     */
    getBounds: function() {
        if (this.bounds == null) {
            this.calculateBounds();
        }
        return this.bounds;
    },
    
    /** Recalculate the bounds for the geometry. 
     * 
     */
    calculateBounds: function() {
        //
        // This should be overridden by subclasses.
        //
    },
    
    /**
     * Note: This is only an approximation based on the bounds of the 
     * geometry.
     * 
     * @param {OpenLayers.LonLat} lonlat
     * @param {float} toleranceLon Optional tolerance in Geometric Coords
     * @param {float} toleranceLat Optional tolerance in Geographic Coords
     * 
     * @returns Whether or not the geometry is at the specified location
     * @type Boolean
     */
    atPoint: function(lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        var bounds = this.getBounds();
        if ((bounds != null) && (lonlat != null)) {

            var dX = (toleranceLon != null) ? toleranceLon : 0;
            var dY = (toleranceLat != null) ? toleranceLat : 0;
    
            var toleranceBounds = 
                new OpenLayers.Bounds(this.bounds.left - dX,
                                      this.bounds.bottom - dY,
                                      this.bounds.right + dX,
                                      this.bounds.top + dY);

            atPoint = toleranceBounds.containsLonLat(lonlat);
        }
        return atPoint;
    },
    
    /**
     * @returns The length of the geometry
     * @type float
     */
    getLength: function() {
        //to be overridden by geometries that actually have a length
        //
        return 0.0;
    },

    /**
     * @returns The area of the geometry
     * @type float
     */
    getArea: function() {
        //to be overridden by geometries that actually have an area
        //
        return 0.0;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry"
};
/* ======================================================================    OpenLayers/Handler.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * Base class to construct a higher-level handler for event sequences.
 * Handlers are created by controls, which ultimately have the responsibility
 * of making changes to the map.
 * 
 * @class
 */
OpenLayers.Handler = OpenLayers.Class.create();

OpenLayers.Handler.MOD_NONE  = 0;
OpenLayers.Handler.MOD_SHIFT = 1;
OpenLayers.Handler.MOD_CTRL  = 2;
OpenLayers.Handler.MOD_ALT   = 4;

OpenLayers.Handler.prototype = {
    /**
     * @type String
     * @private
     */
    id: null,
        
    /**
     * The control that initialized this handler.
     * @type OpenLayers.Control
     * @private
     */
    control: null,

    /**
     * @type OpenLayers.Map
     * @private
     */
    map: null,

    /**
     * @type integer
     */
//    keyMask: OpenLayers.Handler.MOD_NONE,
    keyMask: null,

    /**
     * @type Boolean
     * @private 
     */
    active: false,

    /**
     * @constructor
     *
     * @param {OpenLayers.Control} control
     * @param {Object} callbacks A hash of callback functions
     * @param {Object} options
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Util.extend(this, options);
        this.control = control;
        this.callbacks = callbacks;
        if (control.map) {
            this.setMap(control.map); 
        }

        OpenLayers.Util.extend(this, options);
        
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    },
    
    setMap: function (map) {
        this.map = map;
    },

    checkModifiers: function (evt) {
        if(this.keyMask == null) {
            return true;
        }
        /* calculate the keyboard modifier mask for this event */
        var keyModifiers =
            (evt.shiftKey ? OpenLayers.Handler.MOD_SHIFT : 0) |
            (evt.ctrlKey  ? OpenLayers.Handler.MOD_CTRL  : 0) |
            (evt.altKey   ? OpenLayers.Handler.MOD_ALT   : 0);
    
        /* if it differs from the handler object's key mask,
           bail out of the event handler */
        return (keyModifiers == this.keyMask);
    },

    /**
     * Turn on the handler.  Returns false if the handler was already active.
     *
     * @type {Boolean}
     */
    activate: function() {
        if(this.active) {
            return false;
        }
        // register for event handlers defined on this class.
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i = 0; i < events.length; i++) {
            if (this[events[i]]) {
                this.register(events[i], this[events[i]]); 
            }
        } 
        this.active = true;
        return true;
    },
    
    /**
     * Turn off the handler.  Returns false if the handler was already inactive.
     * 
     * @type {Boolean}
     */
    deactivate: function() {
        if(!this.active) {
            return false;
        }
        // unregister event handlers defined on this class.
        var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
        for (var i = 0; i < events.length; i++) {
            if (this[events[i]]) {
                this.unregister(events[i], this[events[i]]); 
            }
        } 
        this.active = false;
        return true;
    },

    /**
    * trigger the control's named callback with the given arguments
    */
    callback: function (name, args) {
        if (this.callbacks[name]) {
            this.callbacks[name].apply(this.control, args);
        }
    },

    /**
    * register an event on the map
    */
    register: function (name, method) {
        // TODO: deal with registerPriority in 3.0
        this.map.events.registerPriority(name, this, method);   
    },

    /**
    * unregister an event from the map
    */
    unregister: function (name, method) {
        this.map.events.unregister(name, this, method);   
    },

    /**
     * 
     */
    destroy: function () {
        // eliminate circular references
        this.control = this.map = null;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Handler"
};
/* ======================================================================    OpenLayers/Icon.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 */
OpenLayers.Icon = OpenLayers.Class.create();
OpenLayers.Icon.prototype = {
    
    /** image url
    * @type String */
    url: null,
    
    /** @type OpenLayers.Size */
    size:null,

    /** distance in pixels to offset the image when being rendered
    * @type OpenLayers.Pixel */
    offset: null,    
    
    /** Function to calculate the offset (based on the size) 
     * @type OpenLayers.Pixel */
    calculateOffset: null,    
    
    /** @type DOMElement */
    imageDiv: null,

    /** @type OpenLayers.Pixel */
    px: null,
    
    /** 
    * @constructor
    *
    * @param {String} url
    * @param {OpenLayers.Size} size
    * @param {Function} calculateOffset
    */
    initialize: function(url, size, offset, calculateOffset) {
        this.url = url;
        this.size = (size) ? size : new OpenLayers.Size(20,20);
        this.offset = offset;
        this.calculateOffset = (calculateOffset) ? calculateOffset
                                 : function(size) {
                                     return new OpenLayers.Pixel(-(size.w/2), 
                                                                -(size.h/2));
                                   };

        var id = OpenLayers.Util.createUniqueID("OL_Icon_");
        this.imageDiv = OpenLayers.Util.createAlphaImageDiv(id);
    },
    
    destroy: function() {
        OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild); 
        this.imageDiv.innerHTML = "";
        this.imageDiv = null;
    },

    /** 
    * @returns A fresh copy of the icon.
    * @type OpenLayers.Icon
    */
    clone: function() {
        return new OpenLayers.Icon(this.url, 
                                   this.size, 
                                   this.offset, 
                                   this.calculateOffset);
    },
    
    /**
     * @param {OpenLayers.Size} size
     */
    setSize: function(size) {
        if (size != null) {
            this.size = size;
        }
        this.draw();
    },

    /** 
    * @param {OpenLayers.Pixel} px
    * 
    * @return A new DOM Image of this icon set at the location passed-in
    * @type DOMElement
    */
    draw: function(px) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, 
                                            null, 
                                            null, 
                                            this.size, 
                                            this.url, 
                                            "absolute");
        this.moveTo(px);
        return this.imageDiv;
    }, 

    
    /** Change the icon's opacity
     * @param {float} opacity
     */
    setOpacity: function(opacity) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, 
                                            null, null, null, null, opacity);

    },
    
    /**
    * @param {OpenLayers.Pixel} px
    */
    moveTo: function (px) {
        //if no px passed in, use stored location
        if (px != null) {
            this.px = px;
        }

        if (this.imageDiv != null) {
            if (this.px == null) {
                this.display(false);
            } else {
                if (this.calculateOffset) {
                    this.offset = this.calculateOffset(this.size);  
                }
                var offsetPx = this.px.offset(this.offset);
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, offsetPx);
            }
        }
    },
    
    /** Hide or show the icon
     * 
     * @param {Boolean} display
     */
    display: function(display) {
        this.imageDiv.style.display = (display) ? "" : "none"; 
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Icon"
};
/* ======================================================================    OpenLayers/Popup.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 */
OpenLayers.Popup = OpenLayers.Class.create();

OpenLayers.Popup.WIDTH = 200;
OpenLayers.Popup.HEIGHT = 200;
OpenLayers.Popup.COLOR = "white";
OpenLayers.Popup.OPACITY = 1;
OpenLayers.Popup.BORDER = "0px";

OpenLayers.Popup.prototype = {

    /** @type OpenLayers.Events*/
    events: null,
    
    /** @type String */
    id: "",

    /** @type OpenLayers.LonLat */
    lonlat: null,

    /** @type DOMElement */
    div: null,

    /** @type OpenLayers.Size*/
    size: null,    

    /** @type String */
    contentHTML: "",
    
    /** @type String */
    backgroundColor: "",
    
    /** @type float */
    opacity: "",

    /** @type String */
    border: "",
    
    /** @type DOMElement */
    contentDiv:null,

    /** @type int */
    padding: 5,


    /** this gets set in Map.js when the popup is added to the map
     * @type OpenLayers.Map */
    map: null,

    /** 
    * @constructor
    * 
    * @param {String} id
    * @param {OpenLayers.LonLat} lonlat
    * @param {OpenLayers.Size} size
    * @param {String} contentHTML
    * @param {Boolean} closeBox
    */
    initialize:function(id, lonlat, size, contentHTML, closeBox) {
        if (id == null) {
            id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
        }

        this.id = id;
        this.lonlat = lonlat;
        this.size = (size != null) ? size 
                                  : new OpenLayers.Size(
                                                   OpenLayers.Popup.WIDTH,
                                                   OpenLayers.Popup.HEIGHT);
        if (contentHTML != null) { 
             this.contentHTML = contentHTML;
        }
        this.backgroundColor = OpenLayers.Popup.COLOR;
        this.opacity = OpenLayers.Popup.OPACITY;
        this.border = OpenLayers.Popup.BORDER;

        this.div = OpenLayers.Util.createDiv(this.id, null, null, 
                                             null, null, null, "hidden");
        this.div.className = 'olPopup';

        var id = this.div.id + "_contentDiv";
        this.contentDiv = OpenLayers.Util.createDiv(id, null, this.size.clone(), 
                                                    null, "relative", null,
                                                    "hidden");
        this.contentDiv.className = 'olPopupContent';                                            
        this.div.appendChild(this.contentDiv);

        if (closeBox == true) {
           // close icon
            var closeSize = new OpenLayers.Size(17,17);
            var img = OpenLayers.Util.getImagesLocation() + "close.gif";
            var closeImg = OpenLayers.Util.createAlphaImageDiv(this.id + "_close", 
                                                                null, 
                                                                closeSize, 
                                                                img);
            closeImg.style.right = this.padding + "px";
            closeImg.style.top = this.padding + "px";
            this.div.appendChild(closeImg);

            var closeEvents = new OpenLayers.Events(this, closeImg);
            closeEvents.register("mousedown", this, this.hide);

        }

        this.registerEvents();
    },

    /** 
    */
    destroy: function() {
        if (this.map != null) {
            this.map.removePopup(this);
            this.map = null;
        }
        this.events.destroy();
        this.events = null;
        this.div = null;
    },

    /** 
    * @param {OpenLayers.Pixel} px
    * 
    * @returns Reference to a div that contains the drawn popup
    * @type DOMElement
    */
    draw: function(px) {
        if (px == null) {
            if ((this.lonlat != null) && (this.map != null)) {
                px = this.map.getLayerPxFromLonLat(this.lonlat);
            }
        }
        
        this.setSize();
        this.setBackgroundColor();
        this.setOpacity();
        this.setBorder();
        this.setContentHTML();
        this.moveTo(px);

        return this.div;
    },

    /** 
     * if the popup has a lonlat and its map members set, 
     *  then have it move itself to its proper position
     */
    updatePosition: function() {
        if ((this.lonlat) && (this.map)) {
                var px = this.map.getLayerPxFromLonLat(this.lonlat);
                this.moveTo(px);            
        }
    },

    /**
    * @param {OpenLayers.Pixel} px
    */
    moveTo: function(px) {
        if ((px != null) && (this.div != null)) {
            this.div.style.left = px.x + "px";
            this.div.style.top = px.y + "px";
        }
    },

    /**
     * @returns Boolean indicating whether or not the popup is visible
     * @type Boolean
     */
    visible: function() {
        return OpenLayers.Element.visible(this.div);
    },

    /**
     * 
     */
    toggle: function() {
        OpenLayers.Element.toggle(this.div);
    },

    /**
     *
     */
    show: function() {
        OpenLayers.Element.show(this.div);
    },

    /**
     *
     */
    hide: function() {
        OpenLayers.Element.hide(this.div);
    },

    /**
    * @param {OpenLayers.Size} size
    */
    setSize:function(size) { 
        if (size != undefined) {
            this.size = size; 
        }
        
        if (this.div != null) {
            this.div.style.width = this.size.w + "px";
            this.div.style.height = this.size.h + "px";
        }
        if (this.contentDiv != null){
            this.contentDiv.style.width = this.size.w + "px";
            this.contentDiv.style.height = this.size.h + "px";
        }
    },  

    /**
    * @param {String} color
    */
    setBackgroundColor:function(color) { 
        if (color != undefined) {
            this.backgroundColor = color; 
        }
        
        if (this.div != null) {
            this.div.style.backgroundColor = this.backgroundColor;
        }
    },  
    
    /**
    * @param {float} opacity
    */
    setOpacity:function(opacity) { 
        if (opacity != undefined) {
            this.opacity = opacity; 
        }
        
        if (this.div != null) {
            // for Mozilla and Safari
            this.div.style.opacity = this.opacity;

            // for IE
            this.div.style.filter = 'alpha(opacity=' + this.opacity*100 + ')';
        }
    },  
    
    /**
    * @param {int} border
    */
    setBorder:function(border) { 
        if (border != undefined) {
            this.border = border;
        }
        
        if (this.div != null) {
            this.div.style.border = this.border;
        }
    },      
    
    /**
     * @param {String} contentHTML
     */
    setContentHTML:function(contentHTML) {
        if (contentHTML != null) {
            this.contentHTML = contentHTML;
        }
        
        if (this.contentDiv != null) {
            this.contentDiv.innerHTML = this.contentHTML;
        }    
    },
    

    
    /** Do this in a separate function so that subclasses can 
     *   choose to override it if they wish to deal differently
     *   with mouse events
     * 
     *   Note in the following handler functions that some special
     *    care is needed to deal correctly with mousing and popups. 
     *   
     *   Because the user might select the zoom-rectangle option and
     *    then drag it over a popup, we need a safe way to allow the
     *    mousemove and mouseup events to pass through the popup when
     *    they are initiated from outside.
     * 
     *   Otherwise, we want to essentially kill the event propagation
     *    for all other events, though we have to do so carefully, 
     *    without disabling basic html functionality, like clicking on 
     *    hyperlinks or drag-selecting text.
     */
     registerEvents:function() {
        this.events = new OpenLayers.Events(this, this.div, null, true);

        this.events.register("mousedown", this, this.onmousedown);
        this.events.register("mousemove", this, this.onmousemove);
        this.events.register("mouseup", this, this.onmouseup);
        this.events.register("click", this, 
                             OpenLayers.Util.safeStopPropagation);
        this.events.register("mouseout", this, this.onmouseout);
        this.events.register("dblclick", this, 
                             OpenLayers.Util.safeStopPropagation);
     },

    /** When mouse goes down within the popup, make a note of
     *   it locally, and then do not propagate the mousedown 
     *   (but do so safely so that user can select text inside)
     * 
     * @param {Event} evt
     */
    onmousedown: function (evt) {
        this.mousedown = true;
        OpenLayers.Util.safeStopPropagation(evt);
    },

    /** If the drag was started within the popup, then 
     *   do not propagate the mousemove (but do so safely
     *   so that user can select text inside)
     * 
     * @param {Event} evt
     */
    onmousemove: function (evt) {
        if (this.mousedown) {
            OpenLayers.Util.safeStopPropagation(evt);
        }
    },

    /** When mouse comes up within the popup, after going down 
     *   in it, reset the flag, and then (once again) do not 
     *   propagate the event, but do so safely so that user can 
     *   select text inside
     * 
     * @param {Event} evt
     */
    onmouseup: function (evt) {
        if (this.mousedown) {
            this.mousedown = false;
            OpenLayers.Util.safeStopPropagation(evt);
        }
    },

    /** When mouse goes out of the popup set the flag to false so that
     *   if they let go and then drag back in, we won't be confused.
     * 
     * @param {Event} evt
     * 
     * @type Boolean
     */
    onmouseout: function (evt) {
        this.mousedown = false;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Popup"
};
/* ======================================================================    OpenLayers/Renderer.js
   ====================================================================== */

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
 * The functions that *are* implemented here merely deal with the maintenance
 *  of the size and extent variables, as well as the cached 'resolution' 
 *  value. 
 * 
 * A note to the user that all subclasses should use getResolution() instead
 *  of directly accessing this.resolution in order to correctly use the 
 *  cacheing system.
 *
 */
OpenLayers.Renderer = OpenLayers.Class.create();
OpenLayers.Renderer.prototype = 
{
    /** @type DOMElement */
    container: null,
    
    /** @type OpenLayers.Bounds */
    extent: null,
    
    /** @type OpenLayers.Size */
    size: null,
    
    /** cache of current map resolution
     * @type float */
    resolution: null,
    
    /** Reference to the map -- this is set in Vector's setMap()
     * @type OpenLayers.Map */
    map: null,
    
    /**
     * @constructor
     * 
     * @param {String} containerID
     */
    initialize: function(containerID) {
        this.container = $(containerID);
    },
    
    /**
     * 
     */
    destroy: function() {
        this.container = null;
        this.extent = null;
        this.size =  null;
        this.resolution = null;
        this.map = null;
    },

    /**
     * This should be overridden by specific subclasses
     * 
     * @returns Whether or not the browser supports the VML renderer
     * @type Boolean
     */
    supported: function() {
        return false;
    },    
    
    /**
     * Set the visible part of the layer.
     *
     * Resolution has probably changed, so we nullify the resolution 
     * cache (this.resolution) -- this way it will be re-computed when 
     * next it is needed.
     *
     * @param {OpenLayers.Bounds} extent
     */
    setExtent: function(extent) {
        this.extent = extent.clone();
        this.resolution = null;
    },
    
    /**
     * Sets the size of the drawing surface.
     * 
     * Resolution has probably changed, so we nullify the resolution 
     * cache (this.resolution) -- this way it will be re-computed when 
     * next it is needed.
     *
     * @param {OpenLayers.Size} size
     */
    setSize: function(size) {
        this.size = size.clone();
        this.resolution = null;
    },
    
    /** Uses cached copy of resolution if available to minimize computing
     * 
     * @returns The current map's resolution
     * @type float
     */
    getResolution: function() {
        this.resolution = this.resolution || this.map.getResolution();
        return this.resolution;
    },
    
    /** 
     * virtual function
     * 
     * Draw a geometry on the specified layer.
     *
     * @param geometry {OpenLayers.Geometry}
     * @param style {Object}
     */
    drawGeometry: function(geometry, style) {},
        
    /**
     * virtual function
     *
     * Clear all vectors from the renderer
     *
     */    
    clear: function() {},

    /**
     * virtual function
     * 
     * Returns a geometry from an event that happened on a layer.  
     * How this happens is specific to the renderer.
     * 
     * @param evt {OpenLayers.Event}
     *
     * @returns A geometry from an event that happened on a layer
     * @type OpenLayers.Geometry
     */
    getGeometryFromEvent: function(evt) {},
    
    /**
     * virtual function
     * 
     * Remove a geometry from the renderer (by id)
     * 
     * @param geometry {OpenLayers.Geometry}
     */
    eraseGeometry: function(geometry) {},
        
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Renderer"
};
/* ======================================================================    Rico/Color.js
   ====================================================================== */

OpenLayers.Rico.Color = OpenLayers.Class.create();

OpenLayers.Rico.Color.prototype = {

   initialize: function(red, green, blue) {
      this.rgb = { r: red, g : green, b : blue };
   },

   setRed: function(r) {
      this.rgb.r = r;
   },

   setGreen: function(g) {
      this.rgb.g = g;
   },

   setBlue: function(b) {
      this.rgb.b = b;
   },

   setHue: function(h) {

      // get an HSB model, and set the new hue...
      var hsb = this.asHSB();
      hsb.h = h;

      // convert back to RGB...
      this.rgb = OpenLayers.Rico.Color.HSBtoRGB(hsb.h, hsb.s, hsb.b);
   },

   setSaturation: function(s) {
      // get an HSB model, and set the new hue...
      var hsb = this.asHSB();
      hsb.s = s;

      // convert back to RGB and set values...
      this.rgb = OpenLayers.Rico.Color.HSBtoRGB(hsb.h, hsb.s, hsb.b);
   },

   setBrightness: function(b) {
      // get an HSB model, and set the new hue...
      var hsb = this.asHSB();
      hsb.b = b;

      // convert back to RGB and set values...
      this.rgb = OpenLayers.Rico.Color.HSBtoRGB( hsb.h, hsb.s, hsb.b );
   },

   darken: function(percent) {
      var hsb  = this.asHSB();
      this.rgb = OpenLayers.Rico.Color.HSBtoRGB(hsb.h, hsb.s, Math.max(hsb.b - percent,0));
   },

   brighten: function(percent) {
      var hsb  = this.asHSB();
      this.rgb = OpenLayers.Rico.Color.HSBtoRGB(hsb.h, hsb.s, Math.min(hsb.b + percent,1));
   },

   blend: function(other) {
      this.rgb.r = Math.floor((this.rgb.r + other.rgb.r)/2);
      this.rgb.g = Math.floor((this.rgb.g + other.rgb.g)/2);
      this.rgb.b = Math.floor((this.rgb.b + other.rgb.b)/2);
   },

   isBright: function() {
      var hsb = this.asHSB();
      return this.asHSB().b > 0.5;
   },

   isDark: function() {
      return ! this.isBright();
   },

   asRGB: function() {
      return "rgb(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + ")";
   },

   asHex: function() {
      return "#" + this.rgb.r.toColorPart() + this.rgb.g.toColorPart() + this.rgb.b.toColorPart();
   },

   asHSB: function() {
      return OpenLayers.Rico.Color.RGBtoHSB(this.rgb.r, this.rgb.g, this.rgb.b);
   },

   toString: function() {
      return this.asHex();
   }

};

OpenLayers.Rico.Color.createFromHex = function(hexCode) {
  if(hexCode.length==4) {
    var shortHexCode = hexCode; 
    var hexCode = '#';
    for(var i=1;i<4;i++) hexCode += (shortHexCode.charAt(i) + 
shortHexCode.charAt(i));
  }
   if ( hexCode.indexOf('#') == 0 )
      hexCode = hexCode.substring(1);
   var red   = hexCode.substring(0,2);
   var green = hexCode.substring(2,4);
   var blue  = hexCode.substring(4,6);
   return new OpenLayers.Rico.Color( parseInt(red,16), parseInt(green,16), parseInt(blue,16) );
}

/**
 * Factory method for creating a color from the background of
 * an HTML element.
 */
OpenLayers.Rico.Color.createColorFromBackground = function(elem) {

   var actualColor = 
      RicoUtil.getElementsComputedStyle(OpenLayers.Util.getElement(elem), 
                                        "backgroundColor", 
                                        "background-color");

   if ( actualColor == "transparent" && elem.parentNode )
      return OpenLayers.Rico.Color.createColorFromBackground(elem.parentNode);

   if ( actualColor == null )
      return new OpenLayers.Rico.Color(255,255,255);

   if ( actualColor.indexOf("rgb(") == 0 ) {
      var colors = actualColor.substring(4, actualColor.length - 1 );
      var colorArray = colors.split(",");
      return new OpenLayers.Rico.Color( parseInt( colorArray[0] ),
                            parseInt( colorArray[1] ),
                            parseInt( colorArray[2] )  );

   }
   else if ( actualColor.indexOf("#") == 0 ) {
      return OpenLayers.Rico.Color.createFromHex(actualColor);
   }
   else
      return new OpenLayers.Rico.Color(255,255,255);
}

OpenLayers.Rico.Color.HSBtoRGB = function(hue, saturation, brightness) {

   var red   = 0;
    var green = 0;
    var blue  = 0;

   if (saturation == 0) {
      red = parseInt(brightness * 255.0 + 0.5);
       green = red;
       blue = red;
    }
    else {
      var h = (hue - Math.floor(hue)) * 6.0;
      var f = h - Math.floor(h);
      var p = brightness * (1.0 - saturation);
      var q = brightness * (1.0 - saturation * f);
      var t = brightness * (1.0 - (saturation * (1.0 - f)));

      switch (parseInt(h)) {
         case 0:
            red   = (brightness * 255.0 + 0.5);
            green = (t * 255.0 + 0.5);
            blue  = (p * 255.0 + 0.5);
            break;
         case 1:
            red   = (q * 255.0 + 0.5);
            green = (brightness * 255.0 + 0.5);
            blue  = (p * 255.0 + 0.5);
            break;
         case 2:
            red   = (p * 255.0 + 0.5);
            green = (brightness * 255.0 + 0.5);
            blue  = (t * 255.0 + 0.5);
            break;
         case 3:
            red   = (p * 255.0 + 0.5);
            green = (q * 255.0 + 0.5);
            blue  = (brightness * 255.0 + 0.5);
            break;
         case 4:
            red   = (t * 255.0 + 0.5);
            green = (p * 255.0 + 0.5);
            blue  = (brightness * 255.0 + 0.5);
            break;
          case 5:
            red   = (brightness * 255.0 + 0.5);
            green = (p * 255.0 + 0.5);
            blue  = (q * 255.0 + 0.5);
            break;
        }
    }

   return { r : parseInt(red), g : parseInt(green) , b : parseInt(blue) };
}

OpenLayers.Rico.Color.RGBtoHSB = function(r, g, b) {

   var hue;
   var saturation;
   var brightness;

   var cmax = (r > g) ? r : g;
   if (b > cmax)
      cmax = b;

   var cmin = (r < g) ? r : g;
   if (b < cmin)
      cmin = b;

   brightness = cmax / 255.0;
   if (cmax != 0)
      saturation = (cmax - cmin)/cmax;
   else
      saturation = 0;

   if (saturation == 0)
      hue = 0;
   else {
      var redc   = (cmax - r)/(cmax - cmin);
        var greenc = (cmax - g)/(cmax - cmin);
        var bluec  = (cmax - b)/(cmax - cmin);

        if (r == cmax)
           hue = bluec - greenc;
        else if (g == cmax)
           hue = 2.0 + redc - bluec;
      else
           hue = 4.0 + greenc - redc;

        hue = hue / 6.0;
        if (hue < 0)
           hue = hue + 1.0;
   }

   return { h : hue, s : saturation, b : brightness };
}

/* ======================================================================    OpenLayers/Control/ArgParser.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.ArgParser = OpenLayers.Class.create();
OpenLayers.Control.ArgParser.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type OpenLayers.LonLat */
    center: null,
    
    /** @type int */
    zoom: null,

    /** @type Array */
    layers: null,

    /**
     * @constructor
     * 
     * @param {DOMElement} element
     * @param {String} base
     */
    initialize: function(element, base) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /** Set the map property for the control. 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        //make sure we dont already have an arg parser attached
        for(var i=0; i< this.map.controls.length; i++) {
            var control = this.map.controls[i];
            if ( (control != this) &&
                 (control.CLASS_NAME == "OpenLayers.Control.ArgParser") ) {
                break;
            }
        }
        if (i == this.map.controls.length) {

            var args = OpenLayers.Util.getArgs();
            if (args.lat && args.lon) {
                this.center = new OpenLayers.LonLat(parseFloat(args.lon),
                                                    parseFloat(args.lat));
                if (args.zoom) {
                    this.zoom = parseInt(args.zoom);
                }
    
                // when we add a new baselayer to see when we can set the center
                this.map.events.register('changebaselayer', this, 
                                         this.setCenter);
                this.setCenter();
            }
    
            if (args.layers) {
                this.layers = args.layers;
    
                // when we add a new layer, set its visibility 
                this.map.events.register('addlayer', this, 
                                         this.configureLayers);
                this.configureLayers();
            }
        }
    },
   
    /** As soon as a baseLayer has been loaded, we center and zoom
     *   ...and remove the handler.
     */
    setCenter: function() {
        
        if (this.map.baseLayer) {
            //dont need to listen for this one anymore
            this.map.events.unregister('changebaselayer', this, 
                                       this.setCenter);
                                       
            this.map.setCenter(this.center, this.zoom);
        }
    },

    /** As soon as all the layers are loaded, cycle through them and 
     *   hide or show them. 
     */
    configureLayers: function() {

        if (this.layers.length == this.map.layers.length) { 
            this.map.events.unregister('addlayer', this, this.configureLayers);

            for(var i=0; i < this.layers.length; i++) {
                
                var layer = this.map.layers[i];
                var c = this.layers.charAt(i);
                
                if (c == "B") {
                    this.map.setBaseLayer(layer);
                } else if ( (c == "T") || (c == "F") ) {
                    layer.setVisibility(c == "T");
                }
            }
        }
    },     
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.ArgParser"
});
/* ======================================================================    OpenLayers/Control/LayerSwitcher.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/** 
 * @class
 * 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.LayerSwitcher = OpenLayers.Class.create();
OpenLayers.Control.LayerSwitcher.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type String */
    activeColor: "darkblue",
    

  // DOM Elements
  
    /** @type DOMElement */
    layersDiv: null,
    
    /** @type DOMElement */
    baseLayersDiv: null,

    /** @type Array */
    baseLayers: null,
    
    
    /** @type DOMElement */
    dataLbl: null,
    
    /** @type DOMElement */
    dataLayersDiv: null,

    /** @type Array */
    dataLayers: null,


    /** @type DOMElement */
    minimizeDiv: null,

    /** @type DOMElement */
    maximizeDiv: null,
    
    /** @type Boolean */
    ascending: true,
 
    /**
    * @constructor
    */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * 
     */    
    destroy: function() {
        
        OpenLayers.Event.stopObservingElement(this.div);

        OpenLayers.Event.stopObservingElement(this.minimizeDiv);
        OpenLayers.Event.stopObservingElement(this.maximizeDiv);

        //clear out layers info and unregister their events 
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        
        this.map.events.unregister("addlayer", this, this.redraw);
        this.map.events.unregister("changelayer", this, this.redraw);
        this.map.events.unregister("removelayer", this, this.redraw);
        this.map.events.unregister("changebaselayer", this, this.redraw);
        
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /** 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        this.map.events.register("addlayer", this, this.redraw);
        this.map.events.register("changelayer", this, this.redraw);
        this.map.events.register("removelayer", this, this.redraw);
        this.map.events.register("changebaselayer", this, this.redraw);
    },

    /**
    * @returns A reference to the DIV DOMElement containing the switcher tabs
    * @type DOMElement
    */  
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this);

        // create layout divs
        this.loadContents();

        // set mode to minimize
        this.minimizeControl();
        
        // populate div with current info
        this.redraw();    

        return this.div;
    },

    /** user specifies either "base" or "data". we then clear all the 
     *    corresponding listeners, the div, and reinitialize a new array.
     * 
     * @private
     * 
     * @param {String} layersType Ei
     */
    clearLayersArray: function(layersType) {
        var layers = this[layersType + "Layers"];
        if (layers) {
            for(var i=0; i < layers.length; i++) {
                var layer = layers[i];
                OpenLayers.Event.stopObservingElement(layer.inputElem);
                OpenLayers.Event.stopObservingElement(layer.labelSpan);
            }
        }
        this[layersType + "LayersDiv"].innerHTML = "";
        this[layersType + "Layers"] = new Array();
    },


    /** Goes through and takes the current state of the Map and rebuilds the
     *   control to display that state. Groups base layers into a radio-button
     *   group and lists each data layer with a checkbox.
     * 
     * @returns A reference to the DIV DOMElement containing the control
     * @type DOMElement
     */  
    redraw: function() {

        //clear out previous layers 
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        
        var containsOverlays = false;
        
        var layers = this.map.layers.slice();
        if (!this.ascending) { layers.reverse(); }
        for( var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var baseLayer = layer.isBaseLayer;

            if (baseLayer || layer.displayInLayerSwitcher) {

                if (!baseLayer) {
                    containsOverlays = true;
                }

                // only check a baselayer if it is *the* baselayer, check data
                //  layers if they are visible
                var checked = (baseLayer) ? (layer == this.map.baseLayer)
                                          : layer.getVisibility();
    
                // create input element
                var inputElem = document.createElement("input");
                inputElem.id = "input_" + layer.name;
                inputElem.name = (baseLayer) ? "baseLayers" : layer.name;
                inputElem.type = (baseLayer) ? "radio" : "checkbox";
                inputElem.value = layer.name;
                inputElem.checked = checked;
                inputElem.defaultChecked = checked;

                if (!baseLayer && !layer.inRange) {
                    inputElem.disabled = true;
                }
                var context = {
                    'inputElem': inputElem,
                    'layer': layer,
                    'layerSwitcher': this
                }
                OpenLayers.Event.observe(inputElem, "mouseup", 
                              this.onInputClick.bindAsEventListener(context));
                
                // create span
                var labelSpan = document.createElement("span");
                if (!baseLayer && !layer.inRange) {
                    labelSpan.style.color = "gray";
                }
                labelSpan.innerHTML = layer.name;
                labelSpan.style.verticalAlign = (baseLayer) ? "bottom" 
                                                            : "baseline";
                OpenLayers.Event.observe(labelSpan, "click", 
                              this.onInputClick.bindAsEventListener(context));
                // create line break
                var br = document.createElement("br");
    
                
                var groupArray = (baseLayer) ? this.baseLayers
                                             : this.dataLayers;
                groupArray.push({
                    'layer': layer,
                    'inputElem': inputElem,
                    'labelSpan': labelSpan
                });
                                                     
    
                var groupDiv = (baseLayer) ? this.baseLayersDiv
                                           : this.dataLayersDiv;
                groupDiv.appendChild(inputElem);
                groupDiv.appendChild(labelSpan);
                groupDiv.appendChild(br);
            }
        }

        // if no overlays, dont display the overlay label
        this.dataLbl.style.display = (containsOverlays) ? "" : "none";        

        return this.div;
    },

    /** A label has been clicked, check or uncheck its corresponding input
     * 
     * @private
     * 
     * @context 
     *      {DOMElement} inputElem
     *      {OpenLayers.Control.LayerSwitcher} layerSwitcher
     *      {OpenLayers.Layer} layer
     * 
     * @param {Event} e
     */

    onInputClick: function(e) {

        if (!this.inputElem.disabled) {
            if (this.inputElem.type == "radio") {
                this.inputElem.checked = true;
                this.layer.map.setBaseLayer(this.layer, true);
                this.layer.map.events.triggerEvent("changebaselayer");
            } else {
                this.inputElem.checked = !this.inputElem.checked;
                this.layerSwitcher.updateMap();
            }
        }
        OpenLayers.Event.stop(e);
    },
    
    /** Need to update the map accordingly whenever user clicks in either of
     *   the layers.
     * 
     * @private
     * 
     * @param {Event} e
     */
    onLayerClick: function(e) {
        this.updateMap();
    },


    /** Cycles through the loaded data and base layer input arrays and makes
     *   the necessary calls to the Map object such that that the map's 
     *   visual state corresponds to what the user has selected in the control
     * 
     * @private
     */
    updateMap: function() {

        // set the newly selected base layer        
        for(var i=0; i < this.baseLayers.length; i++) {
            var layerEntry = this.baseLayers[i];
            if (layerEntry.inputElem.checked) {
                this.map.setBaseLayer(layerEntry.layer, false);
            }
        }

        // set the correct visibilities for the overlays
        for(var i=0; i < this.dataLayers.length; i++) {
            var layerEntry = this.dataLayers[i];   
            layerEntry.layer.setVisibility(layerEntry.inputElem.checked, true);
        }

    },

    /** Set up the labels and divs for the control
     * 
     * @param {Event} e
     */
    maximizeControl: function(e) {

        //HACK HACK HACK - find a way to auto-size this layerswitcher
        this.div.style.width = "20em";
        this.div.style.height = "";

        this.showControls(false);

        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },
    
    /** Hide all the contents of the control, shrink the size, 
     *   add the maximize icon
     * 
     * @param {Event} e
     */
    minimizeControl: function(e) {

        this.div.style.width = "0px";
        this.div.style.height = "0px";

        this.showControls(true);

        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },

    /** Hide/Show all LayerSwitcher controls depending on whether we are
     *   minimized or not
     * 
     * @private
     * 
     * @param {Boolean} minimize
     */
    showControls: function(minimize) {

        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";

        this.layersDiv.style.display = minimize ? "none" : "";
    },
    
    /** Set up the labels and divs for the control
     * 
     */
    loadContents: function() {

        //configure main div
        this.div.style.position = "absolute";
        this.div.style.top = "10px";
        this.div.style.right = "0px";
        this.div.style.left = "";
        this.div.style.fontFamily = "sans-serif";
        this.div.style.fontWeight = "bold";
        this.div.style.marginTop = "3px";
        this.div.style.marginLeft = "3px";
        this.div.style.marginBottom = "3px";
        this.div.style.fontSize = "smaller";   
        this.div.style.color = "white";   
        this.div.style.backgroundColor = "transparent";
    
        OpenLayers.Event.observe(this.div, "mouseup", 
                      this.mouseUp.bindAsEventListener(this));
        OpenLayers.Event.observe(this.div, "click",
                      this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "mousedown",
                      this.mouseDown.bindAsEventListener(this));
        OpenLayers.Event.observe(this.div, "dblclick", this.ignoreEvent);


        // layers list div        
        this.layersDiv = document.createElement("div");
        this.layersDiv.id = "layersDiv";
        this.layersDiv.style.paddingTop = "5px";
        this.layersDiv.style.paddingLeft = "10px";
        this.layersDiv.style.paddingBottom = "5px";
        this.layersDiv.style.paddingRight = "75px";
        this.layersDiv.style.backgroundColor = this.activeColor;        

        // had to set width/height to get transparency in IE to work.
        // thanks -- http://jszen.blogspot.com/2005/04/ie6-opacity-filter-caveat.html
        //
        this.layersDiv.style.width = "100%";
        this.layersDiv.style.height = "100%";


        var baseLbl = document.createElement("div");
        baseLbl.innerHTML = "<u>Base Layer</u>";
        baseLbl.style.marginTop = "3px";
        baseLbl.style.marginLeft = "3px";
        baseLbl.style.marginBottom = "3px";
        
        this.baseLayersDiv = document.createElement("div");
        this.baseLayersDiv.style.paddingLeft = "10px";
        /*OpenLayers.Event.observe(this.baseLayersDiv, "click", 
                      this.onLayerClick.bindAsEventListener(this));
        */
                     

        this.dataLbl = document.createElement("div");
        this.dataLbl.innerHTML = "<u>Overlays</u>";
        this.dataLbl.style.marginTop = "3px";
        this.dataLbl.style.marginLeft = "3px";
        this.dataLbl.style.marginBottom = "3px";
        
        this.dataLayersDiv = document.createElement("div");
        this.dataLayersDiv.style.paddingLeft = "10px";

        if (this.ascending) {
            this.layersDiv.appendChild(baseLbl);
            this.layersDiv.appendChild(this.baseLayersDiv);
            this.layersDiv.appendChild(this.dataLbl);
            this.layersDiv.appendChild(this.dataLayersDiv);
        } else {
            this.layersDiv.appendChild(this.dataLbl);
            this.layersDiv.appendChild(this.dataLayersDiv);
            this.layersDiv.appendChild(baseLbl);
            this.layersDiv.appendChild(this.baseLayersDiv);
        }    
 
        this.div.appendChild(this.layersDiv);

        OpenLayers.Rico.Corner.round(this.div, {corners: "tl bl",
                                        bgColor: "transparent",
                                        color: this.activeColor,
                                        blend: false});

        OpenLayers.Rico.Corner.changeOpacity(this.layersDiv, 0.75);

        var imgLocation = OpenLayers.Util.getImagesLocation();
        var sz = new OpenLayers.Size(18,18);        

        // maximize button div
        var img = imgLocation + 'layer-switcher-maximize.png';
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MaximizeDiv", 
                                    null, 
                                    sz, 
                                    img, 
                                    "absolute");
        this.maximizeDiv.style.top = "5px";
        this.maximizeDiv.style.right = "0px";
        this.maximizeDiv.style.left = "";
        this.maximizeDiv.style.display = "none";
        OpenLayers.Event.observe(this.maximizeDiv, 
                      "click", 
                      this.maximizeControl.bindAsEventListener(this));
        
        this.div.appendChild(this.maximizeDiv);

        // minimize button div
        var img = imgLocation + 'layer-switcher-minimize.png';
        var sz = new OpenLayers.Size(18,18);        
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MinimizeDiv", 
                                    null, 
                                    sz, 
                                    img, 
                                    "absolute");
        this.minimizeDiv.style.top = "5px";
        this.minimizeDiv.style.right = "0px";
        this.minimizeDiv.style.left = "";
        this.minimizeDiv.style.display = "none";
        OpenLayers.Event.observe(this.minimizeDiv, 
                      "click", 
                      this.minimizeControl.bindAsEventListener(this));

        this.div.appendChild(this.minimizeDiv);
    },
    
    /** 
     * @private
     *
     * @param {Event} evt
     */
    ignoreEvent: function(evt) {
        OpenLayers.Event.stop(evt);
    },

    /** Register a local 'mouseDown' flag so that we'll know whether or not
     *   to ignore a mouseUp event
     * 
     * @private
     *
     * @param {Event} evt
     */
    mouseDown: function(evt) {
        this.mouseDown = true;
        this.ignoreEvent(evt);
    },

    /** If the 'mouseDown' flag has been set, that means that the drag was 
     *   started from within the LayerSwitcher control, and thus we can 
     *   ignore the mouseup. Otherwise, let the Event continue.
     *  
     * @private
     *
     * @param {Event} evt
     */
    mouseUp: function(evt) {
        if (this.mouseDown) {
            this.mouseDown = false;
            this.ignoreEvent(evt);
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.LayerSwitcher"
});
/* ======================================================================    OpenLayers/Control/MouseDefaults.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.MouseDefaults = OpenLayers.Class.create();
OpenLayers.Control.MouseDefaults.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** WARNING WARNING WARNING!!!
        This class is DEPRECATED in 2.4 and will be removed by 3.0.
        If you need this functionality, use Control.Navigation instead!!! */

    /** @type Boolean */
    performedDrag: false,

    /** @type function */
    wheelObserver: null,

    /** 
     * @constructor
     */
    initialize: function() {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * 
     */    
    destroy: function() {
        
        if (this.handler) {
            this.handler.destroy();
        }
        this.handler = null;

        this.map.events.unregister( "click", this, this.defaultClick );
        this.map.events.unregister( "dblclick", this, this.defaultDblClick );
        this.map.events.unregister( "mousedown", this, this.defaultMouseDown );
        this.map.events.unregister( "mouseup", this, this.defaultMouseUp );
        this.map.events.unregister( "mousemove", this, this.defaultMouseMove );
        this.map.events.unregister( "mouseout", this, this.defaultMouseOut );

        //unregister mousewheel events specifically on the window and document
        OpenLayers.Event.stopObserving(window, "DOMMouseScroll", 
                                        this.wheelObserver);
        OpenLayers.Event.stopObserving(window, "mousewheel", 
                                        this.wheelObserver);
        OpenLayers.Event.stopObserving(document, "mousewheel", 
                                        this.wheelObserver);
        this.wheelObserver = null;
                      
        OpenLayers.Control.prototype.destroy.apply(this, arguments);        
    },

    /**
     * 
     */
    draw: function() {
        this.map.events.register( "click", this, this.defaultClick );
        this.map.events.register( "dblclick", this, this.defaultDblClick );
        this.map.events.register( "mousedown", this, this.defaultMouseDown );
        this.map.events.register( "mouseup", this, this.defaultMouseUp );
        this.map.events.register( "mousemove", this, this.defaultMouseMove );
        this.map.events.register( "mouseout", this, this.defaultMouseOut );

        this.registerWheelEvents();

    },

    /**
     * 
     */
    registerWheelEvents: function() {

        this.wheelObserver = this.onWheelEvent.bindAsEventListener(this);
        
        //register mousewheel events specifically on the window and document
        OpenLayers.Event.observe(window, "DOMMouseScroll", this.wheelObserver);
        OpenLayers.Event.observe(window, "mousewheel", this.wheelObserver);
        OpenLayers.Event.observe(document, "mousewheel", this.wheelObserver);
    },

    /**
     * @param {Event} evt
     * 
     * @type Boolean
     */
    defaultClick: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        var notAfterDrag = !this.performedDrag;
        this.performedDrag = false;
        return notAfterDrag;
    },

    /**
    * @param {Event} evt
    */
    defaultDblClick: function (evt) {
        var newCenter = this.map.getLonLatFromViewPortPx( evt.xy ); 
        this.map.setCenter(newCenter, this.map.zoom + 1);
        OpenLayers.Event.stop(evt);
        return false;
    },

    /**
    * @param {Event} evt
    */
    defaultMouseDown: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        this.mouseDragStart = evt.xy.clone();
        this.performedDrag  = false;
        if (evt.shiftKey) {
            this.map.div.style.cursor = "crosshair";
            this.zoomBox = OpenLayers.Util.createDiv('zoomBox',
                                                     this.mouseDragStart,
                                                     null,
                                                     null,
                                                     "absolute",
                                                     "2px solid red");
            this.zoomBox.style.backgroundColor = "white";
            this.zoomBox.style.filter = "alpha(opacity=50)"; // IE
            this.zoomBox.style.opacity = "0.50";
            this.zoomBox.style.fontSize = "1px";
            this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
            this.map.viewPortDiv.appendChild(this.zoomBox);
        }
        document.onselectstart=function() { return false; }
        OpenLayers.Event.stop(evt);
    },

    /**
    * @param {Event} evt
    */
    defaultMouseMove: function (evt) {
        // record the mouse position, used in onWheelEvent
        this.mousePosition = evt.xy.clone();

        if (this.mouseDragStart != null) {
            if (this.zoomBox) {
                var deltaX = Math.abs(this.mouseDragStart.x - evt.xy.x);
                var deltaY = Math.abs(this.mouseDragStart.y - evt.xy.y);
                this.zoomBox.style.width = Math.max(1, deltaX) + "px";
                this.zoomBox.style.height = Math.max(1, deltaY) + "px";
                if (evt.xy.x < this.mouseDragStart.x) {
                    this.zoomBox.style.left = evt.xy.x+"px";
                }
                if (evt.xy.y < this.mouseDragStart.y) {
                    this.zoomBox.style.top = evt.xy.y+"px";
                }
            } else {
                var deltaX = this.mouseDragStart.x - evt.xy.x;
                var deltaY = this.mouseDragStart.y - evt.xy.y;
                var size = this.map.getSize();
                var newXY = new OpenLayers.Pixel(size.w / 2 + deltaX,
                                                 size.h / 2 + deltaY);
                var newCenter = this.map.getLonLatFromViewPortPx( newXY ); 
                this.map.setCenter(newCenter, null, true);
                this.mouseDragStart = evt.xy.clone();
                this.map.div.style.cursor = "move";
            }
            this.performedDrag = true;
        }
    },

    /**
    * @param {Event} evt
    */
    defaultMouseUp: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        if (this.zoomBox) {
            this.zoomBoxEnd(evt);    
        } else {
            if (this.performedDrag) {
                this.map.setCenter(this.map.center);
            }
        }
        document.onselectstart=null;
        this.mouseDragStart = null;
        this.map.div.style.cursor = "default";
    },

    /**
    * @param {Event} evt
    */
    defaultMouseOut: function (evt) {
        if (this.mouseDragStart != null && 
            OpenLayers.Util.mouseLeft(evt, this.map.div)) {
            if (this.zoomBox) {
                this.removeZoomBox();
            }
            this.mouseDragStart = null;
        }
    },


    /** User spun scroll wheel up
     * 
     */
    defaultWheelUp: function(evt) {
        if (this.map.getZoom() <= this.map.getNumZoomLevels()) {
            this.map.setCenter(this.map.getLonLatFromPixel(evt.xy),
                               this.map.getZoom() + 1);
        }
    },

    /** User spun scroll wheel down
     * 
     */
    defaultWheelDown: function(evt) {
        if (this.map.getZoom() > 0) {
            this.map.setCenter(this.map.getLonLatFromPixel(evt.xy),
                               this.map.getZoom() - 1);
        }
    },

    /** Zoombox function. 
     *
     */
    zoomBoxEnd: function(evt) {
        if (this.mouseDragStart != null) {
            if (Math.abs(this.mouseDragStart.x - evt.xy.x) > 5 ||    
                Math.abs(this.mouseDragStart.y - evt.xy.y) > 5) {   
                var start = this.map.getLonLatFromViewPortPx( this.mouseDragStart ); 
                var end = this.map.getLonLatFromViewPortPx( evt.xy );
                var top = Math.max(start.lat, end.lat);
                var bottom = Math.min(start.lat, end.lat);
                var left = Math.min(start.lon, end.lon);
                var right = Math.max(start.lon, end.lon);
                var bounds = new OpenLayers.Bounds(left, bottom, right, top);
                this.map.zoomToExtent(bounds);
            } else {
                var end = this.map.getLonLatFromViewPortPx( evt.xy );
                this.map.setCenter(new OpenLayers.LonLat(
                  (end.lon),
                  (end.lat)
                 ), this.map.getZoom() + 1);
            }    
            this.removeZoomBox();
       }
    },

    /**
     * Remove the zoombox from the screen and nullify our reference to it.
     */
    removeZoomBox: function() {
        this.map.viewPortDiv.removeChild(this.zoomBox);
        this.zoomBox = null;
    },


/**
 *  Mouse ScrollWheel code thanks to http://adomas.org/javascript-mouse-wheel/
 */


    /** Catch the wheel event and handle it xbrowserly
     * 
     * @param {Event} e
     */
    onWheelEvent: function(e){
    
        // first determine whether or not the wheeling was inside the map
        var inMap = false;
        var elem = OpenLayers.Event.element(e);
        while(elem != null) {
            if (this.map && elem == this.map.div) {
                inMap = true;
                break;
            }
            elem = elem.parentNode;
        }
        
        if (inMap) {
            
            var delta = 0;
            if (!e) {
                e = window.event;
            }
            if (e.wheelDelta) {
                delta = e.wheelDelta/120; 
                if (window.opera) {
                    delta = -delta;
                }
            } else if (e.detail) {
                delta = -e.detail / 3;
            }
            if (delta) {
                // add the mouse position to the event because mozilla has a bug
                // with clientX and clientY (see https://bugzilla.mozilla.org/show_bug.cgi?id=352179)
                // getLonLatFromViewPortPx(e) returns wrong values
                e.xy = this.mousePosition;

                if (delta < 0) {
                   this.defaultWheelDown(e);
                } else {
                   this.defaultWheelUp(e);
                }
            }
            
            //only wheel the map, not the window
            OpenLayers.Event.stop(e);
        }
    },
    
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.MouseDefaults"
});

/* ======================================================================    OpenLayers/Control/MousePosition.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.MousePosition = OpenLayers.Class.create();
OpenLayers.Control.MousePosition.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {
    
    /** @type DOMElement */
    element: null,
    
    /** @type String */
    prefix: '',
    
    /** @type String */
    separator: ', ',
    
    /** @type String */
    suffix: '',
    
    /** @type int */
    numdigits: 5,
    
    /** @type int */
    granularity: 10,
    
    /** @type OpenLayers.LonLat */
    lastXy: null,
    
    /**
     * @constructor
     * 
     * @param {DOMElement} options Options for control.
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    /**
     * @type DOMElement
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);

        if (!this.element) {
            this.div.left = "";
            this.div.top = "";
            this.div.className = this.displayClass;
            this.element = this.div;
        }
        
        this.redraw();
        return this.div;
    },
   
    /**
     * 
     */
    redraw: function(evt) {

        var lonLat;

        if (evt == null) {
            lonLat = new OpenLayers.LonLat(0, 0);
        } else {
            if (this.lastXy == null ||
                Math.abs(evt.xy.x - this.lastXy.x) > this.granularity ||
                Math.abs(evt.xy.y - this.lastXy.y) > this.granularity)
            {
                this.lastXy = evt.xy;
                return;
            }

            lonLat = this.map.getLonLatFromPixel(evt.xy);
            this.lastXy = evt.xy;
        }
        
        var digits = parseInt(this.numdigits);
        var newHtml =
            this.prefix +
            lonLat.lon.toFixed(digits) +
            this.separator + 
            lonLat.lat.toFixed(digits) +
            this.suffix;

        if (newHtml != this.element.innerHTML) {
            this.element.innerHTML = newHtml;
        }
    },

    /** 
     *
     */
    setMap: function() {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.register( 'mousemove', this, this.redraw);
    },     
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.MousePosition"
});
/* ======================================================================    OpenLayers/Control/PanZoom.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.PanZoom = OpenLayers.Class.create();
OpenLayers.Control.PanZoom.X = 4;
OpenLayers.Control.PanZoom.Y = 4;
OpenLayers.Control.PanZoom.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type int */
    slideFactor: 50,

    /** @type Array of Button Divs */
    buttons: null,

    /** @type OpenLayers.Pixel */
    position: null,

    /**
     * @constructor
     */
    initialize: function() {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.position = new OpenLayers.Pixel(OpenLayers.Control.PanZoom.X,
                                             OpenLayers.Control.PanZoom.Y);
    },

    /**
     * 
     */
    destroy: function() {
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        while(this.buttons.length) {
            var btn = this.buttons.shift();
            btn.map = null;
            OpenLayers.Event.stopObservingElement(btn);
        }
        this.buttons = null;
        this.position = null;
    },

    /**
    * @param {OpenLayers.Pixel} px
    * 
    * @returns A reference to the container div for the PanZoom control
    * @type DOMElement
    */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position;

        // place the controls
        this.buttons = new Array();

        var sz = new OpenLayers.Size(18,18);
        var centered = new OpenLayers.Pixel(px.x+sz.w/2, px.y);

        this._addButton("panup", "north-mini.png", centered, sz);
        px.y = centered.y+sz.h;
        this._addButton("panleft", "west-mini.png", px, sz);
        this._addButton("panright", "east-mini.png", px.add(sz.w, 0), sz);
        this._addButton("pandown", "south-mini.png", 
                        centered.add(0, sz.h*2), sz);
        this._addButton("zoomin", "zoom-plus-mini.png", 
                        centered.add(0, sz.h*3+5), sz);
        this._addButton("zoomworld", "zoom-world-mini.png", 
                        centered.add(0, sz.h*4+5), sz);
        this._addButton("zoomout", "zoom-minus-mini.png", 
                        centered.add(0, sz.h*5+5), sz);
        return this.div;
    },
    
    /**
     * @param {String} id
     * @param {String} img
     * @param {OpenLayers.Pixel} xy
     * @param {OpenLayers.Size} sz
     * 
     * @returns A Div (an alphaImageDiv, to be precise) that contains the 
     *          image of the button, and has all the proper event handlers
     *          set.
     * @type DOMElement
     */
    _addButton:function(id, img, xy, sz) {
        var imgLocation = OpenLayers.Util.getImagesLocation() + img;
        var btn = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_PanZoom_" + id, 
                                    xy, sz, imgLocation, "absolute");

        //we want to add the outer div
        this.div.appendChild(btn);

        OpenLayers.Event.observe(btn, "mousedown", 
                                 this.buttonDown.bindAsEventListener(btn));
        OpenLayers.Event.observe(btn, "mouseup", 
                                 this.doubleClick.bindAsEventListener(btn));
        OpenLayers.Event.observe(btn, "dblclick", 
                                 this.doubleClick.bindAsEventListener(btn));
        btn.action = id;
        btn.map = this.map;
        btn.slideFactor = this.slideFactor;

        //we want to remember/reference the outer div
        this.buttons.push(btn);
        return btn;
    },
    
    /**
     * @param {Event} evt
     * 
     * @type Boolean
     */
    doubleClick: function (evt) {
        OpenLayers.Event.stop(evt);
        return false;
    },
    
    /**
     * @param {Event} evt
     */
    buttonDown: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;

        switch (this.action) {
            case "panup": 
                this.map.pan(0, -50);
                break;
            case "pandown": 
                this.map.pan(0, 50);
                break;
            case "panleft": 
                this.map.pan(-50, 0);
                break;
            case "panright": 
                this.map.pan(50, 0);
                break;
            case "zoomin": 
                this.map.zoomIn(); 
                break;
            case "zoomout": 
                this.map.zoomOut(); 
                break;
            case "zoomworld": 
                this.map.zoomToMaxExtent(); 
                break;
        }

        OpenLayers.Event.stop(evt);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.PanZoom"
});
/* ======================================================================    OpenLayers/Control/Panel.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.Panel = OpenLayers.Class.create();
OpenLayers.Control.Panel.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {
    /**
     * @type Array(OpenLayers.Control)
     */
    controls: null,    
    
    /** 
     * The control which is activated when the control is activated (turned 
     * on), which also happens at instantiation.
     * @type OpenLayers.Control
     */
    defaultControl: null, 

    /**
     * @constructor
     * 
     * @param {DOMElement} element
     * @param {String} base
     */
    initialize: function(element) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.controls = [];
    },

    activate: function() {
        OpenLayers.Control.prototype.activate.apply(this, arguments);
        for(var i = 0; i < this.controls.length; i++) {
            if (this.controls[i] == this.defaultControl) {
                this.controls[i].activate();
            }
        }    
        this.redraw();
    },
    deactivate: function() {
        OpenLayers.Control.prototype.deactivate.apply(this, arguments);
        for(var i = 0; i < this.controls.length; i++) {
            this.controls[i].deactivate();
        }    
        this.redraw();
    },
    
    /**
     * @type DOMElement
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        for (var i = 0; i < this.controls.length; i++) {
            this.map.addControl(this.controls[i]);
            this.controls[i].deactivate();
        }
        this.activate();
        return this.div;
    },

    /**
     * @private
     */
    redraw: function() {
        this.div.innerHTML = "";
        if (this.active) {
            for (var i = 0; i < this.controls.length; i++) {
                var element = document.createElement("div");
                var textNode = document.createTextNode(" ");
                if (this.controls[i].active) {
                    element.className = this.controls[i].displayClass + "ItemActive";
                } else {    
                    element.className = this.controls[i].displayClass + "ItemInactive";
                }    
                var onClick = function (ctrl, evt) {
                    OpenLayers.Event.stop(evt ? evt : window.event);
                    this.activateControl(ctrl);
                };
                var control = this.controls[i];
                OpenLayers.Event.observe(element, "click", 
                                         onClick.bind(this, control));
                OpenLayers.Event.observe(element, "mousedown", 
                                  OpenLayers.Event.stop.bindAsEventListener());
                OpenLayers.Event.observe(element, "mouseup", 
                                  OpenLayers.Event.stop.bindAsEventListener());
                this.div.appendChild(element);
            }
        }
    },

    activateControl: function (control) {
        if (!this.active) { return false; }
        if (control.type == OpenLayers.Control.TYPE_BUTTON) {
            control.trigger();
            return;
        }     
        for (var i = 0; i < this.controls.length; i++) {
            if (this.controls[i] == control) {
                control.activate();
            } else {
                this.controls[i].deactivate();
            }
        }
        this.redraw();
    },

    /**
     * To build a toolbar, you add a set of controls to it. addControls
     * lets you add a single control or a list of controls to the 
     * Control Panel.
     * @param OpenLayers.Control
     */    
    addControls: function(controls) {
        if (!(controls instanceof Array)) {
            controls = [controls];
        }
        this.controls = this.controls.concat(controls);
        if (this.map) { // map.addControl() has already been called on the panel
            for (var i = 0; i < controls.length; i++) {
                map.addControl(controls[i]);
                controls[i].deactivate();
            }
            this.redraw();
        }
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.Panel"
});

/* ======================================================================    OpenLayers/Control/Permalink.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.Permalink = OpenLayers.Class.create();
OpenLayers.Control.Permalink.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type DOMElement */
    element: null,
    
    /** @type String */
    base: '',

    /**
     * @constructor
     * 
     * @param {DOMElement} element
     * @param {String} base
     */
    initialize: function(element, base) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.element = OpenLayers.Util.getElement(element);        
        if (base) {
            this.base = base;
        }
    },

    /**
     * 
     */
    destroy: function()  {
        if (this.element.parentNode == this.div) {
            this.div.removeChild(this.element);
        }
        this.element = null;

        this.map.events.unregister('moveend', this, this.updateLink);

        OpenLayers.Control.prototype.destroy.apply(this, arguments); 
    },

    /** Set the map property for the control. 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        //make sure we have an arg parser attached
        for(var i=0; i< this.map.controls.length; i++) {
            var control = this.map.controls[i];
            if (control.CLASS_NAME == "OpenLayers.Control.ArgParser") {
                break;
            }
        }
        if (i == this.map.controls.length) {
            this.map.addControl(new OpenLayers.Control.ArgParser());       
        }

    },

    /**
     * @type DOMElement
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
          
        if (!this.element) {
            this.div.className = this.displayClass;
            this.element = document.createElement("a");
            this.element.style.fontSize="smaller";
            this.element.innerHTML = "Permalink";
            this.element.href="";
            this.div.appendChild(this.element);
        }
        this.map.events.register('moveend', this, this.updateLink);
        return this.div;
    },
   
    /**
     * 
     */
    updateLink: function() {
        var center = this.map.getCenter();
        var zoom = "zoom=" + this.map.getZoom(); 
        var lat = "lat=" + Math.round(center.lat*100000)/100000;
        var lon = "lon=" + Math.round(center.lon*100000)/100000;

        var layers = "layers=";
        for(var i=0; i< this.map.layers.length; i++) {
            var layer = this.map.layers[i];

            if (layer.isBaseLayer) {
                layers += (layer == this.map.baseLayer) ? "B" : "0";
            } else {
                layers += (layer.getVisibility()) ? "T" : "F";           
            }
        }
        var href = this.base + "?" + lat + "&" + lon + "&" + zoom + 
                                   "&" + layers; 
        this.element.href = href;
    }, 

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.Permalink"
});
/* ======================================================================    OpenLayers/Control/Scale.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.Scale = OpenLayers.Class.create();
OpenLayers.Control.Scale.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {
    /** @type DOMElement */
    element: null,
    
    /**
     * @constructor
     * 
     * @param {DOMElement} element
     * @param {String} base
     */
    initialize: function(element) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.element = OpenLayers.Util.getElement(element);        
    },

    /**
     * @type DOMElement
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.element) {
            this.element = document.createElement("div");
            this.div.className = this.displayClass;
            this.element.style.fontSize="smaller";
            this.div.appendChild(this.element);
        }
        this.map.events.register( 'moveend', this, this.updateScale);
        this.updateScale();
        return this.div;
    },
   
    /**
     * 
     */
    updateScale: function() {
        var scale = this.map.getScale();
        if (!scale) return;

        if (scale >= 9500 && scale <= 950000) {
            scale = Math.round(scale / 1000) + "K";
        } else if (scale >= 950000) {
            scale = Math.round(scale / 1000000) + "M";
        } else {
            scale = Math.round(scale);
        }    
        
        this.element.innerHTML = "Scale = 1 : " + scale;
    }, 
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.Scale"
});

/* ======================================================================    OpenLayers/Control/ZoomToMaxExtent.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * Imlements a very simple button control.
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.ZoomToMaxExtent = OpenLayers.Class.create();
OpenLayers.Control.ZoomToMaxExtent.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {
    /** @type OpenLayers.Control.TYPE_* */
    type: OpenLayers.Control.TYPE_BUTTON,
    
    trigger: function() {
        if (this.map) {
            this.map.zoomToMaxExtent();
        }    
    },
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.ZoomToMaxExtent"
});
/* ======================================================================    OpenLayers/Events.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/* @requires OpenLayers/Util.js
 */

OpenLayers.Event = {
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,

  element: function(event) {
    return event.target || event.srcElement;
  },

  isLeftClick: function(event) {
    return (((event.which) && (event.which == 1)) ||
            ((event.button) && (event.button == 1)));
  },

  pointerX: function(event) {
    return event.pageX || (event.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft));
  },

  pointerY: function(event) {
    return event.pageY || (event.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop));
  },

  stop: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  },

  // find the first node with the given tagName, starting from the
  // node the event was triggered on; traverses the DOM upwards
  findElement: function(event, tagName) {
    var element = OpenLayers.Event.element(event);
    while (element.parentNode && (!element.tagName ||
        (element.tagName.toUpperCase() != tagName.toUpperCase())))
      element = element.parentNode;
    return element;
  },

  /** A hashtable cach of the event observers, keyed by element.id
   * 
   * @type Object
   */
  observers: false,

  _observeAndCache: function(element, name, observer, useCapture) {
    if (!this.observers) this.observers = new Object();

    //if there is not yet a hash entry for this element, add one
    if (!this.observers[element.id]) {
        this.observers[element.id] = new Array();
    }
    //add a new observer to this element's list
    this.observers[element.id].push({
        'element': element,
        'name': name,
        'observer': observer,
        'useCapture': useCapture
    });

    //add the actual browser event listener
    if (element.addEventListener) {
      element.addEventListener(name, observer, useCapture);
    } else if (element.attachEvent) {
      element.attachEvent('on' + name, observer);
    }
  },

    /** Given the id of an element to stop observing, cycle through the 
     *   element's cached observers, calling stopObserving on each one, 
     *   skipping those entries which can no longer be removed.
     * 
     * @param {String} elementId
     */
    stopObservingElement: function(elementId) {
        var elementObservers = OpenLayers.Event.observers[elementId];
        if (elementObservers) {
            var i=0;
            while(i < elementObservers.length) {
                var entry = elementObservers[0];
                var args = new Array(entry.element,
                                     entry.name,
                                     entry.observer,
                                     entry.useCapture);
                var removed = OpenLayers.Event.stopObserving.apply(this, args);
                if (!removed) {
                    i++;
                }
            }
        }
    },

    /** Cycle through all the element entries in the events cache and call
     *   stopObservingElement on each. 
     */
    unloadCache: function() {
        if (!OpenLayers.Event.observers) return;
        for (var elementId in OpenLayers.Event.observers) {
            OpenLayers.Event.stopObservingElement.apply(this, [elementId]);
        }
        OpenLayers.Event.observers = false;
    },

  observe: function(elementParam, name, observer, useCapture) {
    var element = OpenLayers.Util.getElement(elementParam);
    useCapture = useCapture || false;

    if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
        || element.attachEvent))
      name = 'keydown';

    this._observeAndCache(element, name, observer, useCapture);
  },

    /**
     * @param {DOMElement || String} elementParam
     * @param {String} name
     * @param {function} observer
     * @param {Boolean} useCapture
     * 
     * @returns Whether or not the event observer was removed
     * @type Boolean
     */
    stopObserving: function(elementParam, name, observer, useCapture) {
        var foundEntry = false;
        var element = OpenLayers.Util.getElement(elementParam);
        if (element) {
    
            useCapture = useCapture || false;
        
            if (name == 'keypress') {
                if ( navigator.appVersion.match(/Konqueror|Safari|KHTML/) || 
                     element.detachEvent) {
                  name = 'keydown';
                }
            }
        
            // find element's entry in this.observers cache and remove it
            var elementObservers = OpenLayers.Event.observers[element.id];
            if (elementObservers) {
        
                // find the specific event type in the element's list
                var i=0;
                while(!foundEntry && i < elementObservers.length) {
                    var cacheEntry = elementObservers[i];
        
                    if ((cacheEntry.name == name) &&
                        (cacheEntry.observer == observer) &&
                        (cacheEntry.useCapture == useCapture)) {
        
                        elementObservers.splice(i, 1);
                        if (elementObservers.length == 0) {
                            delete OpenLayers.Event.observers[element.id];
                        }
                        foundEntry = true;
                        break; 
                    }
                    i++;           
                }
            }
        
            //actually remove the event listener from browser
            if (element.removeEventListener) {
                element.removeEventListener(name, observer, useCapture);
            } else if (element && element.detachEvent) {
                element.detachEvent('on' + name, observer);
            }
        }
        return foundEntry;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Event"
};

/* prevent memory leaks in IE */
OpenLayers.Event.observe(window, 'unload', OpenLayers.Event.unloadCache, false);

if (window.Event) {
  OpenLayers.Util.extend(window.Event, OpenLayers.Event);
} else {
  var Event = OpenLayers.Event;
}

/**
 * @class
 */
OpenLayers.Events = OpenLayers.Class.create();
OpenLayers.Events.prototype = {

    /** @final @type Array: supported events */
    BROWSER_EVENTS: [
        "mouseover", "mouseout",
        "mousedown", "mouseup", "mousemove", 
        "click", "dblclick",
        "resize", "focus", "blur"
    ],

    /** Hashtable of Array(Function): events listener functions 
     * @type Object */
    listeners: null,

    /** @type Object: the code object issuing application events */
    object: null,

    /** @type DOMElement: the DOM element receiving browser events */
    element: null,

    /** @type Array: list of support application events */
    eventTypes: null,

    /**
    * @type Function: bound event handler attached to elements
    * @private
    */
    eventHandler: null,

    /** @type Boolean */
    fallThrough: null,

    /**
     * @constructor 
     * 
     * @param {OpenLayers.Map} object The js object to which this Events object
     *                                is being added
     * @param {DOMElement} element A dom element to respond to browser events
     * @param {Array} eventTypes Array of custom application events
     * @param {Boolean} fallThrough Allow events to fall through after these 
     *                              have been handled?
     */
    initialize: function (object, element, eventTypes, fallThrough) {
        this.object     = object;
        this.element    = element;
        this.eventTypes = eventTypes;
        this.fallThrough = fallThrough;
        this.listeners  = new Object();

        // keep a bound copy of handleBrowserEvent() so that we can
        // pass the same function to both Event.observe() and .stopObserving()
        this.eventHandler = this.handleBrowserEvent.bindAsEventListener(this);

        // if eventTypes is specified, create a listeners list for each 
        // custom application event.
        if (this.eventTypes != null) 
            for (var i = 0; i < this.eventTypes.length; i++)
                this.listeners[ this.eventTypes[i] ] = new Array();

        // if a dom element is specified, add a listeners list 
        // for browser events on the element and register them
        if (this.element != null)
            this.attachToElement(element);
    },

    /**
     * 
     */
    destroy: function () {
        if (this.element) {
            this.detachFromElement();
        }
        this.element = null;

        this.listeners = null;
        this.object = null;
        this.eventTypes = null;
        this.fallThrough = null;
        this.eventHandler = null;
    },

    /**
    * @param {HTMLDOMElement} element a DOM element to attach browser events to
    */
    attachToElement: function (element) {
        for (var i = 0; i < this.BROWSER_EVENTS.length; i++) {
            var eventType = this.BROWSER_EVENTS[i];

            // every browser event has a corresponding application event 
            // (whether it's listened for or not).
            if (this.listeners[eventType] == null)
                this.listeners[eventType] = new Array();

            // use Prototype to register the event cross-browser
            OpenLayers.Event.observe(element, eventType, this.eventHandler);
        }
        // disable dragstart in IE so that mousedown/move/up works normally
        OpenLayers.Event.observe(element, "dragstart", OpenLayers.Event.stop);
    },
    
    /**
     * @private
     */
    detachFromElement: function () {
        for (var i = 0; i < this.BROWSER_EVENTS.length; i++) {
            var eventType = this.BROWSER_EVENTS[i];

            OpenLayers.Event.stopObserving(
                this.element, eventType, this.eventHandler);
        }

        // re-enable dragstart in IE
        OpenLayers.Event.stopObserving(
            this.element, "dragstart", OpenLayers.Event.stop);
    },

    /**
     * @param {String} type Name of the event to register
     * @param {Object} obj The object to bind the context to for the callback#.
     *                     If no object is specified, default is the Events's 
     *                     'object' property.
     * @param {Function} func The callback function. If no callback is 
     *                        specified, this function does nothing.
     * 
     * #When the event is triggered, the 'func' function will be called, in the
     *   context of 'obj'. Imagine we were to register an event, specifying an 
     *   OpenLayers.Bounds Object as 'obj'. When the event is triggered, the 
     *   context in the callback function will be our Bounds object. This means
     *   that within our callback function, we can access the properties and 
     *   methods of the Bounds object through the "this" variable. So our 
     *   callback could execute something like: 
     *   
     *     leftStr = "Left: " + this.left;
     *   
     *                   or
     *  
     *     centerStr = "Center: " + this.getCenterLonLat();
     * 
     */
    register: function (type, obj, func) {

        if (func != null) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (listeners != null) {
                listeners.push( {obj: obj, func: func} );
            }
        }
    },

    /**
     *   TODO: get rid of this in 3.0 - Decide whether listeners should be 
     *         called in the order they were registered or in reverse order.
     * 
     * @param {String} type Name of the event to register
     * @param {Object} obj The object to bind the context to for the callback#.
     *                     If no object is specified, default is the Events's 
     *                     'object' property.
     * @param {Function} func The callback function. If no callback is 
     *                        specified, this function does nothing.
     */
    registerPriority: function (type, obj, func) {

        if (func != null) {
            if (obj == null)  {
                obj = this.object;
            }
            var listeners = this.listeners[type];
            if (listeners != null) {
                listeners.unshift( {obj: obj, func: func} );
            }
        }
    },
    
    /**
     * @param {String} type
     * @param {Object} obj If none specified, defaults to this.object
     * @param {Function} func
     */
    unregister: function (type, obj, func) {
        if (obj == null)  {
            obj = this.object;
        }
        var listeners = this.listeners[type];
        if (listeners != null) {
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].obj == obj && listeners[i].func == func) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },

    /** Remove all listeners for a given event type. If type is not registered,
     *   does nothing.
     * 
     * @param {String} type
     */
    remove: function(type) {
        if (this.listeners[type] != null) {
            this.listeners[type] = new Array();
        }
    },

    /** Trigger a specified registered event
     * 
     * @param {String} type
     * @param {Event} evt
     */
    triggerEvent: function (type, evt) {

        // prep evt object with object & div references
        if (evt == null) {
            evt = new Object();
        }
        evt.object = this.object;
        evt.element = this.element;

        // execute all callbacks registered for specified type
        // get a clone of the listeners array to
        // allow for splicing during callbacks
        var listeners = (this.listeners[type]) ?
                            this.listeners[type].slice() : null;
        if ((listeners != null) && (listeners.length > 0)) {
            for (var i = 0; i < listeners.length; i++) {
                var callback = listeners[i];
                var continueChain;
                if (callback.obj != null) {
                    // use the 'call' method to bind the context to callback.obj
                    continueChain = callback.func.call(callback.obj, evt);
                } else {
                    continueChain = callback.func(evt);
                }
    
                if ((continueChain != null) && (continueChain == false)) {
                    // if callback returns false, execute no more callbacks.
                    break;
                }
            }
            // don't fall through to other DOM elements
            if (!this.fallThrough) {           
                OpenLayers.Util.safeStopPropagation(evt);
            }
        }
    },

    /** Basically just a wrapper to the triggerEvent() function, but takes 
     *   care to set a property 'xy' on the event with the current mouse 
     *   position.
     * 
     * @private
     * 
     * @param {Event} evt
     */
    handleBrowserEvent: function (evt) {
        evt.xy = this.getMousePosition(evt); 
        this.triggerEvent(evt.type, evt)
    },

    /**
     * @private 
     * 
     * @param {Event} evt
     * 
     * @returns The current xy coordinate of the mouse, adjusted for offsets
     * @type OpenLayers.Pixel
     */
    getMousePosition: function (evt) {
        if (!this.element.offsets) {
            this.element.offsets = OpenLayers.Util.pagePosition(this.element);
            this.element.offsets[0] += (document.documentElement.scrollLeft
                         || document.body.scrollLeft);
            this.element.offsets[1] += (document.documentElement.scrollTop
                         || document.body.scrollTop);
        }
        return new OpenLayers.Pixel(
            (evt.clientX + (document.documentElement.scrollLeft
                         || document.body.scrollLeft)) - this.element.offsets[0], 
            (evt.clientY + (document.documentElement.scrollTop
                         || document.body.scrollTop)) - this.element.offsets[1] 
        ); 
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Events"
};
/* ======================================================================    OpenLayers/Format.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Base class for format reading/writing. 
 * @requires OpenLayers/Util.js
 */
OpenLayers.Format = OpenLayers.Class.create();
OpenLayers.Format.prototype = {
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Read data from a string, and return a list of features. 
     * 
     * @param {string} data data to read/parse.
     */
     read: function(data) {
         alert("Read not implemented.");
     },
    
    /**
     * Accept Feature Collection, and return a string. 
     * 
     * @param {Array} List of features to serialize into a string.
     */
     write: function(features) {
         alert("Write not implemented.");
     },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Format"

};     
/* ======================================================================    OpenLayers/Geometry/Collection.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * A Collection is exactly what it sounds like: A collection of different 
 * Geometries. These are stored in the local parameter "components" (which
 * can be passed as a parameter to the constructor). 
 * 
 * As new geometries are added to the collection, they are NOT cloned. 
 * When removing geometries, they need to be specified by reference (ie you 
 * have to pass in the *exact* geometry to be removed).
 * 
 * The getArea() and getLength() functions here merely iterate through
 * the components, summing their respective areas and lengths.
 * 
 * @requires OpenLayers/Geometry.js
 */
OpenLayers.Geometry.Collection = OpenLayers.Class.create();
OpenLayers.Geometry.Collection.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Geometry, {

    /** @type Array(OpenLayers.Geometry) */
    components: null,
    
    /**
     * An array of class names representing the types of components that
     * the collection can include.  A null value means the component types
     * are not restricted.
     * @type Array(String)
     */
    componentTypes: null,

    /**
     * @constructor
     * 
     * @param {Array(OpenLayers.Geometry)} components
     */
    initialize: function (components) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.components = new Array();
        if (components != null) {
            this.addComponents(components);
        }
    },

    /**
     * 
     */
    destroy: function () {
        this.components.length = 0;
        this.components = null;
    },

    /**
     * @returns The coordinates components as a string
     * @type String
     */
    toString: function() {
        return this.components.toString();
    },
    

    /**
     * @returns An exact clone of this collection
     * @type OpenLayers.Geometry.Collection
     */
    clone: function() {
        var geometry = eval("new " + this.CLASS_NAME + "()");
        for(var i=0; i<this.components.length; i++) {
            geometry.addComponent(this.components[i].clone());
        }
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(geometry, this);
        
        return geometry;
    },

    /**
     * @returns the components of the geometry
     * @type Array(OpenLayers.Geometry)
     */
    getComponents: function(){
        return this.components;
    },
    
    /**
     * @returns the components of the geometry
     * @type Array(OpenLayers.Geometry)
     */
    getComponentsString: function(){
        var strings = [];
        for(var i = 0; i < this.components.length; i++) {
            strings.push(this.components[i].toShortString()); 
        }
        return strings.join(",");
    },

    /** Recalculate the bounds by iterating through the components and 
     *   calling calling extendBounds() on each item
     * 
     */
    calculateBounds: function() {
        this.bounds = null;
        if ( !this.components || (this.components.length > 0)) {
            this.setBounds(this.components[0].getBounds());
            for (var i = 1; i < this.components.length; i++) {
                this.extendBounds(this.components[i].getBounds());
            }
        }
    },

    /**
     * @param {Array(OpenLayers.Geometry)} components
     * 
     */
    addComponents: function(components){
        if(!(components instanceof Array)) {
            components = [components];
        }
        for(var i=0; i < components.length; i++) {
            this.addComponent(components[i]);
        }
    },

    /**
     * Add a new component (geometry) to the collection.  If this.componentTypes
     * is set, then the component class name must be in the componentTypes array.
     * 
     * The bounds cache is reset.
     * 
     * @param {OpenLayers.Geometry} component
     * @param {int} index Index into the array to insert the component
     * @type Boolean
     * @return Component was successfully added
    */    
    addComponent: function(component, index) {
        var added = false;
        if(component) {
            if(this.componentTypes == null ||
               (OpenLayers.Util.indexOf(this.componentTypes,
                                        component.CLASS_NAME) > -1)) {

                if(index != null && (index < this.components.length)) {
                    var components1 = this.components.slice(0, index);
                    var components2 = this.components.slice(index, 
                                                           this.components.length);
                    components1.push(component);
                    this.components = components1.concat(components2);
                } else {
                    this.components.push(component);
                }
                component.parent = this;
                this.clearBounds();
                added = true;
            }
        }
        return added;
    },
    
    /**
     * @param {Array(OpenLayers.Geometry)} components
     */
    removeComponents: function(components) {
        if(!(components instanceof Array)) {
            components = [components];
        }
        for (var i = 0; i < components.length; i++) {
            this.removeComponent(components[i]);
        }
    },
    
    /**
     * @param {OpenLayers.Geometry} component
     */
    removeComponent: function(component) {
        
        OpenLayers.Util.removeItem(this.components, component);
        
        // clearBounds() so that it gets recalculated on the next call
        // to this.getBounds();
        this.clearBounds();
    },

    /**
     * @returns The length of the geometry
     * @type float 
     */
    getLength: function() {
        var length = 0.0;
        for (var i = 0; i < this.components.length; i++) {
            length += this.components[i].getLength();
        }
        return length;
    },
    
    /** Note how this function is overridden in Polygon
     * 
     * @returns the area of the collection by summing its parts
     * @type float
     */
    getArea: function() {
        var area = 0.0;
        for (var i = 0; i < this.components.length; i++) {
            area += this.components[i].getArea();
        }
        return area;
    },

    /**
     * Moves a collection in place
     * @param {Float} x
     * @param {Float} y
     */
    move: function(x, y) {
        for(var i = 0; i < this.components.length; i++) {
            this.components[i].move(x, y);
        }
    },

    /**
     * Tests for equivalent geometries
     * @param {OpenLayers.Geometry}
     * @type Boolean
     * @return The coordinates are equivalent
     */
    equals: function(geometry) {
        var equivalent = true;
        if(!geometry.CLASS_NAME || (this.CLASS_NAME != geometry.CLASS_NAME)) {
            equivalent = false;
        } else if(!(geometry.components instanceof Array) ||
                  (geometry.components.length != this.components.length)) {
            equivalent = false;
        } else {
            for(var i=0; i<this.components.length; ++i) {
                if(!this.components[i].equals(geometry.components[i])) {
                    equivalent = false;
                    break;
                }
            }
        }
        return equivalent;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.Collection"
});
/* ======================================================================    OpenLayers/Geometry/Point.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * The Point class is a subclass of Geometry and also a subclass of the
 * non-vector OpenLayers.LonLat class. The basic functionality that this adds
 * is the ability to switch between lon/lat and x/y at will, as well some 
 * convenience functions to create a Bounds from a point and measure the 
 * distance between two points. 
 * 
 * getX() and setX() should be used to access the x or lon variables.
 * 
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Geometry.js
 */
OpenLayers.Geometry.Point = OpenLayers.Class.create();
OpenLayers.Geometry.Point.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry, OpenLayers.LonLat, {

    /** @type float */
    x: null,

    /** @type float */
    y: null,

    /**
     * @constructor
     *
     * @param {float} x
     * @param {float} y
     */
    initialize: function(x, y) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        OpenLayers.LonLat.prototype.initialize.apply(this, arguments);
        
        this.x = this.lon;
        this.y = this.lat;
    },

    /**
     * @returns An exact clone of this OpenLayers.Geometry.Point
     * @type OpenLayers.Geometry.Point
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Geometry.Point(this.x, this.y);
        }

        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);

        return obj;
    },

    /**
     * Sets the x coordinate
     *
     * @param {float} x
     */
    setX: function(x) {
        this.lon = x;
        this.x = x;
    },

    /**
     * Sets the y coordinate
     *
     * @param {float} y
     */
    setY: function(y) {
        this.lat = y;
        this.y = y;
    },

    /**
     * @type float
     */
    getX: function() {
       return this.lon;
    },

    /**
     * @type float
     */
    getY: function() {
       return this.lat;
    },

    /** Create a new Bounds based on the lon/lat
     * 
     */
    calculateBounds: function () {
        this.bounds = new OpenLayers.Bounds(this.lon, this.lat,
                                            this.lon, this.lat);
    },

    /**
     * @param {OpenLayers.Geometry.Point} point
     */
    distanceTo: function(point) {
        var distance = 0.0;
        if ( (this.x != null) && (this.y != null) && 
             (point != null) && (point.x != null) && (point.y != null) ) {
             
             var dx2 = Math.pow(this.x - point.x, 2);
             var dy2 = Math.pow(this.y - point.y, 2);
             distance = Math.sqrt( dx2 + dy2 );
        }
        return distance;
    },

    /**
     * @returns the coordinates as a string
     * @type String
     */
    toString: function() {
       return this.toShortString();
    },
    
    /**
     * Moves a point in place
     * @param {Float} x
     * @param {Float} y
     */
    move: function(x, y) {
        this.setX(this.x + x);
        this.setY(this.y + y);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.Point"
});
/* ======================================================================    OpenLayers/Geometry/Rectangle.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * A Rectangle is a simple geometry. It is specified by a a point (x and y) 
 * and dimensions (width and height), all of which are directly accessible as 
 * properties.
 *
 * @requires OpenLayers/Geometry.js
 */

OpenLayers.Geometry.Rectangle = OpenLayers.Class.create();
OpenLayers.Geometry.Rectangle.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Geometry, {

    /** @type float */
    x: null,

    /** @type float */
    y: null,

    /** @type float */
    width: null,

    /** @type float */
    height: null,

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
    },
    
    /**
     * 
     */
    calculateBounds: function() {
        this.bounds = new OpenLayers.Bounds(this.x, this.y,
                                            this.x + this.width, 
                                            this.y + this.height);
    },
    
    
    /**
     * @returns The length of the geometry
     * @type float
     */
    getLength: function() {
        var length = (2 * this.width) + (2 * this.height);
        return length;
    },

    /**
     * @returns The area of the geometry
     * @type float
     */
    getArea: function() {
        var area = this.width * this.height;
        return area;
    },    

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.Rectangle"
});
/* ======================================================================    OpenLayers/Geometry/Surface.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Geometry.js
 */
OpenLayers.Geometry.Surface = OpenLayers.Class.create();
OpenLayers.Geometry.Surface.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry, {

    /**
     * @constructor
     *
     */
    initialize: function() {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
    },


    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.Surface"
});
/* ======================================================================    OpenLayers/Handler/Box.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Handler for dragging a rectangle across the map.  Box is displayed 
 * on mouse down, moves on mouse move, and is finished on mouse up.
 * 
 * @class
 * @requires OpenLayers/Handler.js
 */
OpenLayers.Handler.Box = OpenLayers.Class.create();
OpenLayers.Handler.Box.prototype = OpenLayers.Class.inherit( OpenLayers.Handler, {
    /**
     * @type OpenLayers.Handler.Drag
     */
    dragHandler: null,

    /**
     * @constructor
     *
     * @param {OpenLayers.Control} control
     * @param {Object} callbacks An object containing a single function to be
     *                          called when the drag operation is finished.
     *                          The callback should expect to recieve a single
     *                          argument, the point geometry.
     * @param {Object} options
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        var callbacks = {
            "down": this.startBox, 
            "move": this.moveBox, 
            "out":  this.removeBox,
            "up":   this.endBox
        };
        this.dragHandler = new OpenLayers.Handler.Drag(
                                this, callbacks, {keyMask: this.keyMask});
    },

    setMap: function (map) {
        OpenLayers.Handler.prototype.setMap.apply(this, arguments);
        if (this.dragHandler) {
            this.dragHandler.setMap(map);
        }
    },

    /**
    * @param {Event} evt
    */
    startBox: function (xy) {
        this.zoomBox = OpenLayers.Util.createDiv('zoomBox',
                                                 this.dragHandler.start,
                                                 null,
                                                 null,
                                                 "absolute",
                                                 "2px solid red");
        this.zoomBox.style.backgroundColor = "white";
        this.zoomBox.style.filter = "alpha(opacity=50)"; // IE
        this.zoomBox.style.opacity = "0.50";
        this.zoomBox.style.fontSize = "1px";
        this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
        this.map.viewPortDiv.appendChild(this.zoomBox);

        // TBD: use CSS classes instead
        this.map.div.style.cursor = "crosshair";
    },

    /**
    */
    moveBox: function (xy) {
        var deltaX = Math.abs(this.dragHandler.start.x - xy.x);
        var deltaY = Math.abs(this.dragHandler.start.y - xy.y);
        this.zoomBox.style.width = Math.max(1, deltaX) + "px";
        this.zoomBox.style.height = Math.max(1, deltaY) + "px";
        if (xy.x < this.dragHandler.start.x) {
            this.zoomBox.style.left = xy.x+"px";
        }
        if (xy.y < this.dragHandler.start.y) {
            this.zoomBox.style.top = xy.y+"px";
        }
    },

    /**
    */
    endBox: function(end) {
        var result;
        if (Math.abs(this.dragHandler.start.x - end.x) > 5 ||    
            Math.abs(this.dragHandler.start.y - end.y) > 5) {   
            var start = this.dragHandler.start;
            var top = Math.min(start.y, end.y);
            var bottom = Math.max(start.y, end.y);
            var left = Math.min(start.x, end.x);
            var right = Math.max(start.x, end.x);
            result = new OpenLayers.Bounds(left, bottom, right, top);
        } else {
            result = this.dragHandler.start.clone(); // i.e. OL.Pixel
        } 
        this.removeBox();

        // TBD: use CSS classes instead
        this.map.div.style.cursor = "default";

        this.callback("done", [result]);
    },

    /**
     * Remove the zoombox from the screen and nullify our reference to it.
     */
    removeBox: function() {
        this.map.viewPortDiv.removeChild(this.zoomBox);
        this.zoomBox = null;
    },

    activate: function () {
        OpenLayers.Handler.prototype.activate.apply(this, arguments);
        this.dragHandler.activate();
    },

    deactivate: function () {
        OpenLayers.Handler.prototype.deactivate.apply(this, arguments);
        this.dragHandler.deactivate();
    },

    CLASS_NAME: "OpenLayers.Handler.Box"
});
/* ======================================================================    OpenLayers/Handler/Feature.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * Handler to respond to mouse events related to a drawn feature.
 * Callbacks will be called for over, move, out, up, and down (corresponding
 * to the equivalent mouse events).
 * 
 * @class
 * @requires OpenLayers/Handler.js
 */
OpenLayers.Handler.Feature = OpenLayers.Class.create();
OpenLayers.Handler.Feature.prototype =
  OpenLayers.Class.inherit(OpenLayers.Handler, {
    
    /**
     * @type {Int}
     */
    layerIndex: null,
    
    /**
     * @type {OpenLayers.Geometry}
     */
    geometry: null,
    
    /**
     * @constructor
     *
     * @param {OpenLayers.Control} control
     * @param {Array} layers List of OpenLayers.Layer.Vector
     * @param {Array} callbacks An object with a 'over' property whos value is
     *                          a function to be called when the mouse is over
     *                          a feature. The callback should expect to recieve
     *                          a single argument, the geometry.
     * @param {Object} options
     */
    initialize: function(control, layer, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, [control, callbacks, options]);
        this.layer = layer;
    },

    /**
     * Handle mouse down.  Call the "down" callback if down on a feature.
     * 
     * @param {Event} evt
     */
    mousedown: function(evt) {
        var selected = this.select('down', evt);
        return !selected;  // stop event propagation if selected
    },
    
    /**
     * Handle mouse moves.  Call the "move" callback if moving over a feature.
     * Call the "over" callback if moving over a feature for the first time.
     * Call the "out" callback if moving off of a feature.
     * 
     * @param {Event} evt
     */
    mousemove: function(evt) {
        this.select('move', evt);
        return true;
    },

    /**
     * Handle mouse moves.  Call the "up" callback if up on a feature.
     * 
     * @param {Event} evt
     */
    mouseup: function(evt) {
        var selected = this.select('up', evt);
        return !selected;  // stop event propagation if selected        
    },
    
    /**
     * Capture double-clicks.  Let the event continue propagating if the 
     * double-click doesn't hit a geometry.  Otherwise call the dblclick
     * callback.
     *
     * @param {Event} evt
     */
    dblclick: function(evt) {
        var selected = this.select('dblclick', evt);
        return !selected;  // stop event propagation if selected        
    },

    /**
     * Trigger the appropriate callback if a feature is under the mouse.
     *
     * @param {String} type Callback key
     * @type {Boolean} A feature was selected
     */
    select: function(type, evt) {    
        var geometry = this.layer.renderer.getGeometryFromEvent(evt);
        if(geometry) {
            // three cases:
            // over a new, out of the last and over a new, or still on the last
            if(!this.geometry) {
                // over a new geometry
                this.callback('over', [geometry]);
            } else if(this.geometry != geometry) {
                // out of the last and over a new
                this.callback('out', [this.geometry]);
                this.callback('over', [geometry]);
            }
            this.geometry = geometry;
            this.callback(type, [geometry]);
            return true;
        } else {
            if(this.geometry) {
                // out of the last
                this.callback('out', [this.geometry]);
                this.geometry = null;
            }
            return false;
        }
    },

    /**
     * Turn on the handler.  Returns false if the handler was already active.
     *
     * @type {Boolean}
     */
    activate: function() {
        if(OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.layerIndex = this.layer.div.style.zIndex;
            this.layer.div.style.zIndex = this.map.Z_INDEX_BASE['Popup'] - 1;
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * Turn onf the handler.  Returns false if the handler was already active.
     *
     * @type {Boolean}
     */
    deactivate: function() {
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.layer.div.style.zIndex = this.layerIndex;
            return true;
        } else {
            return false;
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Handler.Feature"
});
/* ======================================================================    OpenLayers/Handler/MouseWheel.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Handler for wheel up/down events.
 * 
 * @class
 * @requires OpenLayers/Handler.js
 */
OpenLayers.Handler.MouseWheel = OpenLayers.Class.create();
OpenLayers.Handler.MouseWheel.prototype = OpenLayers.Class.inherit( OpenLayers.Handler, {
    /** @type function **/
    wheelListener: null,

    /** @type OpenLayers.Pixel
     *  @private
     * 
     *  mousePosition is necessary because evt.clientX/Y is buggy in Moz on
     *  wheel events, so we cache and use the value from the last mousemove.
     **/
    mousePosition: null,

    /**
     * @constructor
     *
     * @param {OpenLayers.Control} control
     * @param {Object} callbacks An object containing a single function to be
     *                          called when the drag operation is finished.
     *                          The callback should expect to recieve a single
     *                          argument, the point geometry.
     * @param {Object} options
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.wheelListener = this.onWheelEvent.bindAsEventListener(this);
    },

    /**
     * 
     */    
    destroy: function() {
        this.deactivate();
        this.wheelListener = null;
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
    },

    /**
     *  Mouse ScrollWheel code thanks to http://adomas.org/javascript-mouse-wheel/
     */

    /** Catch the wheel event and handle it xbrowserly
     * 
     * @param {Event} e
     */
    onWheelEvent: function(e){
        // first check keyboard modifiers
        if (!this.checkModifiers(e)) return;

        // first determine whether or not the wheeling was inside the map
        var inMap = false;
        var elem = OpenLayers.Event.element(e);
        while(elem != null) {
            if (this.map && elem == this.map.div) {
                inMap = true;
                break;
            }
            elem = elem.parentNode;
        }
        
        if (inMap) {
            var delta = 0;
            if (!e) {
                e = window.event;
            }
            if (e.wheelDelta) {
                delta = e.wheelDelta/120; 
                if (window.opera) {
                    delta = -delta;
                }
            } else if (e.detail) {
                delta = -e.detail / 3;
            }
            if (delta) {
                // add the mouse position to the event because mozilla has a bug
                // with clientX and clientY (see https://bugzilla.mozilla.org/show_bug.cgi?id=352179)
                // getLonLatFromViewPortPx(e) returns wrong values
                e.xy = this.mousePosition;
                if (delta < 0) {
                   this.callback("down", [e, delta]);
                } else {
                   this.callback("up", [e, delta]);
                }
            }
            
            //only wheel the map, not the window
            OpenLayers.Event.stop(e);
        }
    },

    mousemove: function (evt) {
        this.mousePosition = evt.xy;
    },

    activate: function (evt) {
        OpenLayers.Handler.prototype.activate.apply(this, arguments);
        //register mousewheel events specifically on the window and document
        var wheelListener = this.wheelListener;
        OpenLayers.Event.observe(window, "DOMMouseScroll", wheelListener);
        OpenLayers.Event.observe(window, "mousewheel", wheelListener);
        OpenLayers.Event.observe(document, "mousewheel", wheelListener);
    },

    deactivate: function (evt) {
        OpenLayers.Handler.prototype.deactivate.apply(this, arguments);
        // unregister mousewheel events specifically on the window and document
        var wheelListener = this.wheelListener;
        OpenLayers.Event.stopObserving(window, "DOMMouseScroll", wheelListener);
        OpenLayers.Event.stopObserving(window, "mousewheel", wheelListener);
        OpenLayers.Event.stopObserving(document, "mousewheel", wheelListener);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Handler.MouseWheel"
});
/* ======================================================================    OpenLayers/Popup/Anchored.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Popup.js
 */
OpenLayers.Popup.Anchored = OpenLayers.Class.create();
OpenLayers.Popup.Anchored.prototype =
   OpenLayers.Class.inherit( OpenLayers.Popup, {

    /** "lr", "ll", "tr", "tl" - relative position of the popup.
     * @type String */
    relativePosition: null,

    /** Object which must have expose a 'size' (OpenLayers.Size) and 
     *                                 'offset' (OpenLayers.Pixel) 
     * @type Object */
    anchor: null,

    /** 
    * @constructor
    * 
    * @param {String} id
    * @param {OpenLayers.LonLat} lonlat
    * @param {OpenLayers.Size} size
    * @param {String} contentHTML
    * @param {Object} anchor  Object which must expose a 
    *                         - 'size' (OpenLayers.Size) and 
    *                         - 'offset' (OpenLayers.Pixel) 
    *                         (this is generally an OpenLayers.Icon)
    * @param {Boolean} closeBox
    */
    initialize:function(id, lonlat, size, contentHTML, anchor, closeBox) {
        var newArguments = new Array(id, lonlat, size, contentHTML, closeBox);
        OpenLayers.Popup.prototype.initialize.apply(this, newArguments);

        this.anchor = (anchor != null) ? anchor 
                                       : { size: new OpenLayers.Size(0,0),
                                           offset: new OpenLayers.Pixel(0,0)};
    },

    /** 
    * @param {OpenLayers.Pixel} px
    * 
    * @returns Reference to a div that contains the drawn popup
    * @type DOMElement
    */
    draw: function(px) {
        if (px == null) {
            if ((this.lonlat != null) && (this.map != null)) {
                px = this.map.getLayerPxFromLonLat(this.lonlat);
            }
        }
        
        //calculate relative position
        this.relativePosition = this.calculateRelativePosition(px);
        
        return OpenLayers.Popup.prototype.draw.apply(this, arguments);
    },
    
    /** 
     * @private
     * 
     * @param {OpenLayers.Pixel} px
     * 
     * @returns The relative position ("br" "tr" "tl "bl") at which the popup
     *           should be placed
     * @type String
     */
    calculateRelativePosition:function(px) {
        var lonlat = this.map.getLonLatFromLayerPx(px);        
        
        var extent = this.map.getExtent();
        var quadrant = extent.determineQuadrant(lonlat);
        
        return OpenLayers.Bounds.oppositeQuadrant(quadrant);
    }, 

    /**
    * @param {OpenLayers.Pixel} px
    */
    moveTo: function(px) {
        
        var newPx = this.calculateNewPx(px);
        
        var newArguments = new Array(newPx);        
        OpenLayers.Popup.prototype.moveTo.apply(this, newArguments);
    },
    
    /**
    * @param {OpenLayers.Size} size
    */
    setSize:function(size) { 
        OpenLayers.Popup.prototype.setSize.apply(this, arguments);

        if ((this.lonlat) && (this.map)) {
            var px = this.map.getLayerPxFromLonLat(this.lonlat);
            this.moveTo(px);
        }
    },  
    
    /** 
     * @private 
     * 
     * @param {OpenLayers.Pixel} px
     * 
     * @returns The the new px position of the popup on the screen
     *           relative to the passed-in px
     * @type OpenLayers.Pixel
     */
    calculateNewPx:function(px) {
        var newPx = px.offset(this.anchor.offset);

        var top = (this.relativePosition.charAt(0) == 't');
        newPx.y += (top) ? -this.size.h : this.anchor.size.h;
        
        var left = (this.relativePosition.charAt(1) == 'l');
        newPx.x += (left) ? -this.size.w : this.anchor.size.w;

        return newPx;   
    },

    CLASS_NAME: "OpenLayers.Popup.Anchored"
});
/* ======================================================================    OpenLayers/Renderer/Elements.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * This is another virtual class in that it should never be instantiated by 
 *  itself as a Renderer. It exists because there is *tons* of shared 
 *  functionality between different vector libraries which use nodes/elements
 *  as a base for rendering vectors. 
 * 
 * The highlevel bits of code that are implemented here are the adding and 
 *  removing of geometries, which is essentially the same for any 
 *  element-based renderer. The details of creating each node and drawing the
 *  paths are of course different, but the machinery is the same. 
 * 
 * @requires OpenLayers/Renderer.js
 */
OpenLayers.Renderer.Elements = OpenLayers.Class.create();
OpenLayers.Renderer.Elements.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Renderer, {

    /** @type DOMElement */
    rendererRoot: null,
    
    /** @type DOMElement */
    root: null,

    /** @type String */    
    xmlns: null,
    
    /**
     * @constructor
     * 
     * @param {String} containerID
     */
    initialize: function(containerID) {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);

        this.rendererRoot = this.createRenderRoot();
        this.root = this.createRoot();
        
        this.rendererRoot.appendChild(this.root);
        this.container.appendChild(this.rendererRoot);
    },
    
    /**
     * 
     */
    destroy: function() {

        this.clear(); 

        this.rendererRoot = null;
        this.root = null;
        this.xmlns = null;

        OpenLayers.Renderer.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Remove all the elements from the root
     *
     */    
    clear: function() {
        if (this.root) {
            while (this.root.childNodes.length > 0) {
                this.root.removeChild(this.root.firstChild);
            }
        }
    },

    /**
     * Cycle through the rendered nodes and reproject them (this should be 
     *  called when the extent or size has changed);
     *
     * @param {OpenLayers.Bounds} extent
     */
    reproject: function(extent) {

        for (var i = 0; i < this.root.childNodes.length; i++) {
            var node = this.root.childNodes[i];
            //reproject node
            //  for the moment, this only really happens so as to reset
            //  the heaviness of the line relative to the resolution and
            //  the size of the circle for the Point object
            this.reprojectNode(node);
        }
    },

    /** This function is in charge of asking the specific renderer which type
     *   of node to create for the given geometry. All geometries in an 
     *   Elements-based renderer consist of one node and some attributes. We
     *   have the nodeFactory() function which creates a node for us, but it
     *   takes a 'type' as input, and that is precisely what this function 
     *   tells us.  
     * 
     * @param geometry {OpenLayers.Geometry}
     * 
     * @returns The corresponding node type for the specified geometry
     * @type String
     */
    getNodeType: function(geometry) { },
        
    /** 
     * Draw the geometry on the specified layer, creating new nodes, 
     * setting paths, setting style.
     *
     * @param {OpenLayers.Geometry} geometry 
     * @param {Object} style 
     */
    drawGeometry: function(geometry, style) {

        if ((geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon")) {
            for (var i = 0; i < geometry.components.length; i++) {
                this.drawGeometry(geometry.components[i], style);
            }
            return;
        };

        //first we create the basic node and add it to the root
        var nodeType = this.getNodeType(geometry);
        var node = this.nodeFactory(geometry.id, nodeType, geometry);
        node.geometry = geometry;
        node.olStyle = style;
        this.root.appendChild(node);
        
        //now actually draw the node, and style it
        this.drawGeometryNode(node);
    },

    /** 
     * Given a node, draw a geometry on the specified layer.
     *
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry 
     * @param {Object} style 
     */
    drawGeometryNode: function(node, geometry, style) {
        geometry = geometry || node.geometry;
        style = style || node.olStyle;

        var options = {
            'isFilled': true,
            'isStroked': true
        };
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                this.drawPoint(node, geometry);
                break;
            case "OpenLayers.Geometry.Curve":
                options.isFilled = false;
                this.drawCurve(node, geometry);
                break;
            case "OpenLayers.Geometry.LineString":
                options.isFilled = false;
                this.drawLineString(node, geometry);
                break;
            case "OpenLayers.Geometry.LinearRing":
                this.drawLinearRing(node, geometry);
                break;
            case "OpenLayers.Geometry.Polygon":
                this.drawPolygon(node, geometry);
                break;
            case "OpenLayers.Geometry.Surface":
                this.drawSurface(node, geometry);
                break;
            case "OpenLayers.Geometry.Rectangle":
                this.drawRectangle(node, geometry);
                break;
            default:
                break;
        }

        node.olStyle = style; 
        node.olOptions = options; 

        //set style
        this.setStyle(node);
    },
    
    /** 
     * virtual functions for drawing different Geometries. 
     * These should all be implemented by subclasses.
     *
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry 
     */
    drawPoint: function(node, geometry) {},
    drawLineString: function(node, geometry) {},
    drawLinearRing: function(node, geometry) {},
    drawPolygon: function(node, geometry) {},
    drawRectangle: function(node, geometry) {},
    drawCircle: function(node, geometry) {},
    drawCurve: function(node, geometry) {},
    drawSurface: function(node, geometry) {},

    /**
     * @param evt {Object} an OpenLayers.Event object
     *
     * @returns A geometry from an event that happened on a layer
     * @type OpenLayers.Geometry
     */
    getGeometryFromEvent: function(evt) {
        var node = evt.target || evt.srcElement;
        var geometry = node.geometry ? node.geometry : null
        return geometry;
    },

    /** Erase a geometry from the renderer. In the case of a multi-geometry, 
     *   we cycle through and recurse on ourselves. Otherwise, we look for a 
     *   node with the geometry.id, destroy its geometry, and remove it from
     *   the DOM.
     * 
     * @param {OpenLayers.Geometry} geometry
     */
    eraseGeometry: function(geometry) {
        if ((geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon")) {
            for (var i = 0; i < geometry.components.length; i++) {
                this.eraseGeometry(geometry.components[i]);
            }
        } else {    
            var element = $(geometry.id);
            if (element && element.parentNode) {
                if (element.geometry) {
                    element.geometry.destroy();
                    element.geometry = null;
                }
                element.parentNode.removeChild(element);
            }
        }
    },    

    /** 
     * @private 
     *
     * Create new node of the specified type, with the (optional) specified id.
     * 
     * If node already exists with same ID and type, we remove it and then
     *  call ourselves again to recreate it.
     * 
     * @param {String} id
     * @param {String} type Kind of node to draw
     * @param {OpenLayers.Geometry} geometry
     * 
     * @returns A new node of the given type and id
     * @type DOMElement
     */
    nodeFactory: function(id, type, geometry) {
        var node = $(id);
        if (node) {
            if (!this.nodeTypeCompare(node, type)) {
                node.parentNode.removeChild(node);
                node = this.nodeFactory(id, type, geometry);
            }
        } else {
            node = this.createNode(type, id);
        }
        return node;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Renderer.Elements"
});
/* ======================================================================    OpenLayers/Tile.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/*
 * @class 
 * @requires OpenLayers/Util.js
 * 
 * This is a class designed to designate a single tile, however
 * it is explicitly designed to do relatively little. Tiles store information
 * about themselves -- such as the URL that they are related to, and their 
 * size - but do not add themselves to the layer div automatically, for 
 * example.
 */
OpenLayers.Tile = OpenLayers.Class.create();
OpenLayers.Tile.prototype = {
    
    /** @type String */
    id: null,
    
    /** @type OpenLayers.Layer */
    layer: null,
    
    /** @type String url of the request */
    url:null,

    /** @type OpenLayers.Bounds */
    bounds:null,
    
    /** @type OpenLayers.Size */
    size:null,
    
    /** Top Left pixel of the tile
    * @type OpenLayers.Pixel */
    position:null,

    /** @type Boolean */
    drawn: false,

    /**
    * @constructor
    *
    * @param {OpenLayers.Layer} layer
    * @param {OpenLayers.Pixel} position
    * @param {OpenLayers.Bounds} bounds
    * @param {String} url
    * @param {OpenLayers.Size} size
    */   
    initialize: function(layer, position, bounds, url, size) {
        this.layer = layer;
        this.position = position;
        this.bounds = bounds;
        this.url = url;
        this.size = size;

        //give the tile a unique id based on its BBOX.
        this.id = OpenLayers.Util.createUniqueID("Tile_");
    },
    
    /** nullify references to prevent circular references and memory leaks
    */
    destroy:function() {
        this.layer  = null;
        this.bounds = null;
        this.size = null;
        this.position = null;
    },

    /**
    */
    draw:function() {
        this.clear();
        return ((this.layer.displayOutsideMaxExtent
                || (this.layer.maxExtent
                    && this.bounds.intersectsBounds(this.layer.maxExtent, false)))
                && !(this.layer.buffer == 0
                     && !this.bounds.intersectsBounds(this.layer.map.getExtent(), false)));
    },
    
    /** 
     * @param {OpenLayers.Bounds}
     * @param {OpenLayers.pixel} position
     * @param {Boolean} redraw Redraw tile after moving? 
     *                         Default is true
     */
    moveTo: function (bounds, position, redraw) {
        if (redraw == null) {
            redraw = true;
        }

        this.clear();
        this.bounds = bounds.clone();
        this.position = position.clone();
        if (redraw) {
            this.draw();
        }
    },

    /** Clear the tile of any bounds/position-related data so that it can 
     *   be reused in a new location.
     */
    clear: function() {
        this.drawn = false;
    },
    
    getBoundsFromBaseLayer: function(position) {
        var topLeft = this.layer.map.getLonLatFromLayerPx(position); 
        var bottomRightPx = position.clone();
        bottomRightPx.x += this.size.w;
        bottomRightPx.y += this.size.h;
        var bottomRight = this.layer.map.getLonLatFromLayerPx(bottomRightPx); 
        // Handle the case where the base layer wraps around the date line.
        // Google does this, and it breaks WMS servers to request bounds in that fashion.  
        if (topLeft.lon > bottomRight.lon) {
            if (topLeft.lon < 0) {
                topLeft.lon = -180 - (topLeft.lon+180);
            } else {
                bottomRight.lon = 180+bottomRight.lon+180;
            }        
        }
        bounds = new OpenLayers.Bounds(topLeft.lon, bottomRight.lat, bottomRight.lon, topLeft.lat);  
        return bounds;
    },        

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Tile"
};


/* ======================================================================    OpenLayers/Control/MouseToolbar.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Control/MouseDefaults.js
 */
OpenLayers.Control.MouseToolbar = OpenLayers.Class.create();
OpenLayers.Control.MouseToolbar.X = 6;
OpenLayers.Control.MouseToolbar.Y = 300;
OpenLayers.Control.MouseToolbar.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control.MouseDefaults, {
    
    /** WARNING WARNING WARNING!!!
        This class is DEPRECATED in 2.4 and will be removed by 3.0.
        If you need this functionality, use Control.NavToolbar instead!!! */

    mode: null,

    buttons: null,

    direction: "vertical",
    
    /** @type String */
    buttonClicked: null,
    
    initialize: function(position, direction) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.position = new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,
                                             OpenLayers.Control.MouseToolbar.Y);
        if (position) {
            this.position = position;
        }
        if (direction) {
            this.direction = direction; 
        }
        this.measureDivs = [];
    },
    
    /**
     * 
     */
    destroy: function() {
        for( var btnId in this.buttons) {
            var btn = this.buttons[btnId];
            btn.map = null;
            btn.events.destroy();
        }
        OpenLayers.Control.MouseDefaults.prototype.destroy.apply(this, 
                                                                 arguments);
    },
    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments); 
        OpenLayers.Control.MouseDefaults.prototype.draw.apply(this, arguments);
        this.buttons = new Object();
        var sz = new OpenLayers.Size(28,28);
        var centered = new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,0);
        this._addButton("zoombox", "drag-rectangle-off.png", "drag-rectangle-on.png", centered, sz, "Shift->Drag to zoom to area");
        centered = centered.add((this.direction == "vertical" ? 0 : sz.w), (this.direction == "vertical" ? sz.h : 0));
        this._addButton("pan", "panning-hand-off.png", "panning-hand-on.png", centered, sz, "Drag the map to pan.");
        centered = centered.add((this.direction == "vertical" ? 0 : sz.w), (this.direction == "vertical" ? sz.h : 0));
        this.switchModeTo("pan");

        return this.div;
    },

    _addButton:function(id, img, activeImg, xy, sz, title) {
        var imgLocation = OpenLayers.Util.getImagesLocation() + img;
        var activeImgLocation = OpenLayers.Util.getImagesLocation() + activeImg;
        // var btn = new ol.AlphaImage("_"+id, imgLocation, xy, sz);
        var btn = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MouseToolbar_" + id, 
                                    xy, sz, imgLocation, "absolute");

        //we want to add the outer div
        this.div.appendChild(btn);
        btn.imgLocation = imgLocation;
        btn.activeImgLocation = activeImgLocation;
        
        btn.events = new OpenLayers.Events(this, btn, null, true);
        btn.events.register("mousedown", this, this.buttonDown); 
        btn.events.register("mouseup", this, this.buttonUp); 
        btn.events.register("dblclick", this, OpenLayers.Event.stop);
        btn.action = id;
        btn.title = title;
        btn.alt = title;
        btn.map = this.map;

        //we want to remember/reference the outer div
        this.buttons[id] = btn;
        return btn;
    },

    /**
     * @param {Event} evt
     */
    buttonDown: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        this.buttonClicked = evt.element.action;
        OpenLayers.Event.stop(evt);
    },

    /**
     * @param {Event} evt
     */
    buttonUp: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        if (this.buttonClicked != null) {
            if (this.buttonClicked == evt.element.action) {
                this.switchModeTo(evt.element.action);
            }
            OpenLayers.Event.stop(evt);
            this.buttonClicked = null;
        }
    },
    
    /**
    * @param {Event} evt
    */
    defaultDblClick: function (evt) {
        this.switchModeTo("pan");
        this.performedDrag = false;
        var newCenter = this.map.getLonLatFromViewPortPx( evt.xy ); 
        this.map.setCenter(newCenter, this.map.zoom + 1);
        OpenLayers.Event.stop(evt);
        return false;
    },

    /**
    * @param {Event} evt
    */
    defaultMouseDown: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        this.mouseDragStart = evt.xy.clone();
        this.performedDrag = false;
        this.startViaKeyboard = false;
        if (evt.shiftKey && this.mode !="zoombox") {
            this.switchModeTo("zoombox");
            this.startViaKeyboard = true;
        } else if (evt.altKey && this.mode !="measure") {
            this.switchModeTo("measure");
        } else if (!this.mode) {
            this.switchModeTo("pan");
        }
        
        switch (this.mode) {
            case "zoombox":
                this.map.div.style.cursor = "crosshair";
                this.zoomBox = OpenLayers.Util.createDiv('zoomBox',
                                                         this.mouseDragStart,
                                                         null,
                                                         null,
                                                         "absolute",
                                                         "2px solid red");
                this.zoomBox.style.backgroundColor = "white";
                this.zoomBox.style.filter = "alpha(opacity=50)"; // IE
                this.zoomBox.style.opacity = "0.50";
                this.zoomBox.style.fontSize = "1px";
                this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
                this.map.viewPortDiv.appendChild(this.zoomBox);
                this.performedDrag = true;
                break;
            case "measure":
                var distance = "";
                if (this.measureStart) {
                    measureEnd = this.map.getLonLatFromViewPortPx(this.mouseDragStart);
                    distance = OpenLayers.Util.distVincenty(this.measureStart, measureEnd);
                    distance = Math.round(distance * 100) / 100;
                    distance = distance + "km";
                    this.measureStartBox = this.measureBox;
                }    
                this.measureStart = this.map.getLonLatFromViewPortPx(this.mouseDragStart);;
                this.measureBox = OpenLayers.Util.createDiv(null,
                                                         this.mouseDragStart.add(
                                                           -2-parseInt(this.map.layerContainerDiv.style.left),
                                                           -2-parseInt(this.map.layerContainerDiv.style.top)),
                                                         null,
                                                         null,
                                                         "absolute");
                this.measureBox.style.width="4px";
                this.measureBox.style.height="4px";
                this.measureBox.style.fontSize = "1px";
                this.measureBox.style.backgroundColor="red";
                this.measureBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
                this.map.layerContainerDiv.appendChild(this.measureBox);
                if (distance) {
                    this.measureBoxDistance = OpenLayers.Util.createDiv(null,
                                                         this.mouseDragStart.add(
                                                           -2-parseInt(this.map.layerContainerDiv.style.left),
                                                           2-parseInt(this.map.layerContainerDiv.style.top)),
                                                         null,
                                                         null,
                                                         "absolute");
                    
                    this.measureBoxDistance.innerHTML = distance;
                    this.measureBoxDistance.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
                    this.map.layerContainerDiv.appendChild(this.measureBoxDistance);
                    this.measureDivs.push(this.measureBoxDistance);
                }
                this.measureBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
                this.map.layerContainerDiv.appendChild(this.measureBox);
                this.measureDivs.push(this.measureBox);
                break;
            default:
                this.map.div.style.cursor = "move";
                break;
        }
        document.onselectstart = function() { return false; } 
        OpenLayers.Event.stop(evt);
    },

    switchModeTo: function(mode) {
        if (mode != this.mode) {
            

            if (this.mode && this.buttons[this.mode]) {
                OpenLayers.Util.modifyAlphaImageDiv(this.buttons[this.mode], null, null, null, this.buttons[this.mode].imgLocation);
            }
            if (this.mode == "measure" && mode != "measure") {
                for(var i = 0; i < this.measureDivs.length; i++) {
                    if (this.measureDivs[i]) { 
                        this.map.layerContainerDiv.removeChild(this.measureDivs[i]);
                    }
                }
                this.measureDivs = [];
                this.measureStart = null;
            }
            this.mode = mode;
            if (this.buttons[mode]) {
                OpenLayers.Util.modifyAlphaImageDiv(this.buttons[mode], null, null, null, this.buttons[mode].activeImgLocation);
            }
            switch (this.mode) {
                case "zoombox":
                    this.map.div.style.cursor = "crosshair";
                    break;
                default:
                    this.map.div.style.cursor = "default";
                    break;
            }

        } 
    }, 

    leaveMode: function() {
        this.switchModeTo("pan");
    },
    
    /**
    * @param {Event} evt
    */
    defaultMouseMove: function (evt) {
        if (this.mouseDragStart != null) {
            switch (this.mode) {
                case "zoombox": 
                    var deltaX = Math.abs(this.mouseDragStart.x - evt.xy.x);
                    var deltaY = Math.abs(this.mouseDragStart.y - evt.xy.y);
                    this.zoomBox.style.width = Math.max(1, deltaX) + "px";
                    this.zoomBox.style.height = Math.max(1, deltaY) + "px";
                    if (evt.xy.x < this.mouseDragStart.x) {
                        this.zoomBox.style.left = evt.xy.x+"px";
                    }
                    if (evt.xy.y < this.mouseDragStart.y) {
                        this.zoomBox.style.top = evt.xy.y+"px";
                    }
                    break;
                default:
                    var deltaX = this.mouseDragStart.x - evt.xy.x;
                    var deltaY = this.mouseDragStart.y - evt.xy.y;
                    var size = this.map.getSize();
                    var newXY = new OpenLayers.Pixel(size.w / 2 + deltaX,
                                                     size.h / 2 + deltaY);
                    var newCenter = this.map.getLonLatFromViewPortPx( newXY ); 
                    this.map.setCenter(newCenter, null, true);
                    this.mouseDragStart = evt.xy.clone();
            }
            this.performedDrag = true;
        }
    },

    /**
    * @param {Event} evt
    */
    defaultMouseUp: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        switch (this.mode) {
            case "zoombox":
                this.zoomBoxEnd(evt);
                if (this.startViaKeyboard) this.leaveMode();
                break;
            case "pan":
                if (this.performedDrag) {
                    this.map.setCenter(this.map.center);
                }        
        }
        document.onselectstart = null;
        this.mouseDragStart = null;
        this.map.div.style.cursor = "default";
    },

    /**
    * @param {Event} evt
    */
    defaultMouseOut: function (evt) {
        if (this.mouseDragStart != null
            && OpenLayers.Util.mouseLeft(evt, this.map.div)) {
            if (this.zoomBox) {
                this.removeZoomBox();
                if (this.startViaKeyboard) this.leaveMode();
            }
            this.mouseDragStart = null;
            this.map.div.style.cursor = "default";
        }
    },

    defaultClick: function (evt) {
        if (this.performedDrag)  {
            this.performedDrag = false;
            return false;
        }
    }
});

/* ======================================================================    OpenLayers/Control/OverviewMap.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
/**
 * @fileoverview Locator Map Control
 * @author Tim Schaub
 */

/** 
 * @class
 * 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Events.js
 */
OpenLayers.Control.OverviewMap = OpenLayers.Class.create();

OpenLayers.Control.OverviewMap.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** For div.id
     * @type String */
    id:  "OverviewMap",

    /** @type DOMElement */
    element: null,
    
    /**
     * The overvew map itself.
     * @type OpenLayers.Map
     */
    ovmap: null,
        
    /**
     * The overvew map size in pixels.  Note that this is the size of the map
     * itself - the element that contains the map (default class name
     * olControlOverviewMapElement) may have padding or other style attributes
     * added via CSS.
     * @type OpenLayers.Size
     */
    size: new OpenLayers.Size(180, 90),

    /**
     * Ordered list of layers in the overview map.  If none are sent at
     * construction, then the default below is used.
     * 
     * @type Array(OpenLayers.Layer)
     */
    layers: [],

    /**
     * The ratio of the overview map resolution to the main map resolution
     * at which to zoom farther out on the overview map.
     * @type Float
     */
    minRatio: 8,

    /**
     * The ratio of the overview map resolution to the main map resolution
     * at which to zoom farther in on the overview map.
     * @type Float
     */
    maxRatio: 32,

    /**
     * An object containing any non-default properties to be sent to the
     * overview map's map constructor.  These should include any non-default
     * options that the main map was constructed with.
     * @type: Object
     */
    mapOptions: {},

    /**
     * @constructor
     * @param {Object} options Hashtable of options to set on the overview map
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    /**
     * @type DOMElement
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if(!(this.layers.length > 0)) {
            if (this.map.baseLayer) {
                var layer = this.map.baseLayer.clone();
                this.layers = [layer];
            } else {
                this.map.events.register("changebaselayer", this, this.baseLayerDraw);
                return this.div;
            }
        }

        // create overview map DOM elements
        this.element = document.createElement('div');
        this.element.className = this.displayClass + 'Element';
        this.element.style.display = 'none';

        this.mapDiv = document.createElement('div');
        this.mapDiv.style.width = this.size.w + 'px';
        this.mapDiv.style.height = this.size.h + 'px';
        this.mapDiv.style.position = 'relative';
        this.mapDiv.style.overflow = 'hidden';
        this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');
        
        this.extentRectangle = document.createElement('div');
        this.extentRectangle.style.position = 'absolute';
        this.extentRectangle.style.zIndex = 1000;  //HACK
        this.extentRectangle.style.overflow = 'hidden';
        this.extentRectangle.style.backgroundImage = 'url(' +
                                        OpenLayers.Util.getImagesLocation() +
                                        'blank.gif)';
        this.extentRectangle.className = this.displayClass+'ExtentRectangle';
        this.mapDiv.appendChild(this.extentRectangle);
                
        this.element.appendChild(this.mapDiv);  

        this.div.appendChild(this.element);

        this.map.events.register('moveend', this, this.update);
        
        // Set up events.  The image div recenters the map on click.
        // The extent rectangle can be dragged to recenter the map.
        // If the mousedown happened elsewhere, then mousemove and mouseup
        // should slip through.
        this.elementEvents = new OpenLayers.Events(this, this.element);
        this.elementEvents.register('mousedown', this, function(e) {
            OpenLayers.Event.stop(e);
        });
        this.elementEvents.register('click', this, function(e) {
            OpenLayers.Event.stop(e);
        });
        this.elementEvents.register('dblclick', this, function(e) {
            OpenLayers.Event.stop(e);
        });
        this.rectEvents = new OpenLayers.Events(this, this.extentRectangle);
        this.rectEvents.register('mouseout', this, this.rectMouseOut);
        this.rectEvents.register('mousedown', this, this.rectMouseDown);
        this.rectEvents.register('mousemove', this, this.rectMouseMove);
        this.rectEvents.register('mouseup', this, this.rectMouseUp);
        this.rectEvents.register('click', this, function(e) {
            OpenLayers.Event.stop(e);
        });
        this.rectEvents.register('dblclick', this, this.rectDblClick );
        this.mapDivEvents = new OpenLayers.Events(this, this.mapDiv);
        this.mapDivEvents.register('click', this, this.mapDivClick);

        // Optionally add min/max buttons if the control will go in the
        // map viewport.
        if(!this.outsideViewport) {
            this.div.className = this.displayClass + 'Container';
            var imgLocation = OpenLayers.Util.getImagesLocation();
            // maximize button div
            var img = imgLocation + 'layer-switcher-maximize.png';
            this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                        this.displayClass + 'MaximizeButton', 
                                        null, 
                                        new OpenLayers.Size(18,18), 
                                        img, 
                                        'absolute');
            this.maximizeDiv.style.display = 'none';
            this.maximizeDiv.className = this.displayClass + 'MaximizeButton';
            OpenLayers.Event.observe(this.maximizeDiv, 
                          'click', 
                          this.maximizeControl.bindAsEventListener(this));
            OpenLayers.Event.observe(this.maximizeDiv,
                          'dblclick',
                          function(e) {
                              OpenLayers.Event.stop(e);
                          });
            this.div.appendChild(this.maximizeDiv);
    
            // minimize button div
            var img = imgLocation + 'layer-switcher-minimize.png';
            this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                        'OpenLayers_Control_minimizeDiv', 
                                        null, 
                                        new OpenLayers.Size(18,18), 
                                        img, 
                                        'absolute');
            this.minimizeDiv.style.display = 'none';
            this.minimizeDiv.className = this.displayClass + 'MinimizeButton';
            OpenLayers.Event.observe(this.minimizeDiv, 
                          'click', 
                          this.minimizeControl.bindAsEventListener(this));
            OpenLayers.Event.observe(this.minimizeDiv,
                          'dblclick',
                          function(e) {
                              OpenLayers.Event.stop(e);
                          });
            this.div.appendChild(this.minimizeDiv);
            
            this.minimizeControl();
        } else {
            // show the overview map
            this.element.style.display = '';
        }
        if(this.map.getExtent()) {
            this.update();
        }
        return this.div;
    },
    
    baseLayerDraw: function() {
        this.draw();
        this.map.events.unregister("changebaselayer", this, this.baseLayerDraw);
    },

    /**
    * @param {OpenLayers.Event} evt
    */
    rectMouseOut: function (evt) {
        if(this.rectDragStart != null) {
            if(this.performedRectDrag) {
                this.rectMouseMove(evt);
                var rectPxBounds = this.getRectPxBounds(); 
                // if we're off of the overview map, update the main map
                // otherwise, keep moving the rect
                if((rectPxBounds.top <= 0) || (rectPxBounds.left <= 0) || 
                   (rectPxBounds.bottom >= this.size.h - this.hComp) || 
                   (rectPxBounds.right >= this.size.w - this.wComp)) {
                    this.updateMapToRect();
                } else {
                    return; 
                }
            }
            document.onselectstart = null;
            this.rectDragStart = null;
        }
    },

    /**
    * @param {OpenLayers.Event} evt
    */
    rectMouseDown: function (evt) {
        if(!OpenLayers.Event.isLeftClick(evt)) return;
        this.rectDragStart = evt.xy.clone();
        this.performedRectDrag = false;
        OpenLayers.Event.stop(evt);
    },

    /**
    * @param {OpenLayers.Event} evt
    */
    rectMouseMove: function(evt) {
        if(this.rectDragStart != null) {
            var deltaX = this.rectDragStart.x - evt.xy.x;
            var deltaY = this.rectDragStart.y - evt.xy.y;
            var rectPxBounds = this.getRectPxBounds();
            var rectTop = rectPxBounds.top;
            var rectLeft = rectPxBounds.left;
            var rectHeight = Math.abs(rectPxBounds.getHeight());
            var rectWidth = rectPxBounds.getWidth();
            // don't allow dragging off of parent element
            var newTop = Math.max(0, (rectTop - deltaY));
            newTop = Math.min(newTop,
                              this.ovmap.size.h - this.hComp - rectHeight);
            var newLeft = Math.max(0, (rectLeft - deltaX));
            newLeft = Math.min(newLeft,
                               this.ovmap.size.w - this.wComp - rectWidth);
            this.setRectPxBounds(new OpenLayers.Bounds(newLeft,
                                                       newTop + rectHeight,
                                                       newLeft + rectWidth,
                                                       newTop));
            this.rectDragStart = evt.xy.clone();
            this.performedRectDrag = true;
            OpenLayers.Event.stop(evt);
        }
    },

    /**
    * @param {OpenLayers.Event} evt
    */
    rectMouseUp: function(evt) {
        if(!OpenLayers.Event.isLeftClick(evt)) return;
        if(this.performedRectDrag) {
            this.updateMapToRect();
            OpenLayers.Event.stop(evt);
        }        
        document.onselectstart = null;
        this.rectDragStart = null;
    },
    
    /**
    * @param {OpenLayers.Event} evt
    */
    rectDblClick: function(evt) {
        this.performedRectDrag = false;
        OpenLayers.Event.stop(evt);
        this.updateOverview();
    },

    /**
    * @param {OpenLayers.Event} evt
    */
    mapDivClick: function(evt) {
        var pxBounds = this.getRectPxBounds();
        var pxCenter = pxBounds.getCenterPixel();
        var deltaX = evt.xy.x - pxCenter.x;
        var deltaY = evt.xy.y - pxCenter.y;
        var top = pxBounds.top;
        var left = pxBounds.left;
        var height = Math.abs(pxBounds.getHeight());
        var width = pxBounds.getWidth();
        var newTop = Math.max(0, (top + deltaY));
        newTop = Math.min(newTop, this.ovmap.size.h - height);
        var newLeft = Math.max(0, (left + deltaX));
        newLeft = Math.min(newLeft, this.ovmap.size.w - width);
        this.setRectPxBounds(new OpenLayers.Bounds(newLeft,
                                                   newTop + height,
                                                   newLeft + width,
                                                   newTop));
        this.updateMapToRect();
        OpenLayers.Event.stop(evt);
    },

    /** Set up the labels and divs for the control
     * 
     * @param {OpenLayers.Event} e
     */
    maximizeControl: function(e) {
        this.element.style.display = '';
        this.showToggle(false);
        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },

    /** Hide all the contents of the control, shrink the size, 
     *   add the maximize icon
     * 
     * @param {OpenLayers.Event} e
     */
    minimizeControl: function(e) {
        this.element.style.display = 'none';
        this.showToggle(true);
        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },

    /** Hide/Show all LayerSwitcher controls depending on whether we are
     *   minimized or not
     * 
     * @private
     * 
     * @param {Boolean} minimize
     */
    showToggle: function(minimize) {
        this.maximizeDiv.style.display = minimize ? '' : 'none';
        this.minimizeDiv.style.display = minimize ? 'none' : '';
    },

    /**
     * Update the overview map after layers move.
     */
    update: function() {
        if(this.ovmap == null) {
            this.createMap();
        }
        
        if(!this.isSuitableOverview()) {
            this.updateOverview();
        }
        
        // update extent rectangle
        this.updateRectToMap();
    },
    
    /**
     * Determines if the overview map is suitable given the extent and
     * resolution of the main map.
     */
    isSuitableOverview: function() {
        var mapExtent = this.map.getExtent();
        var maxExtent = this.map.maxExtent;
        var testExtent = new OpenLayers.Bounds(
                                Math.max(mapExtent.left, maxExtent.left),
                                Math.max(mapExtent.bottom, maxExtent.bottom),
                                Math.min(mapExtent.right, maxExtent.right),
                                Math.min(mapExtent.top, maxExtent.top));        
        var resRatio = this.ovmap.getResolution() / this.map.getResolution();
        return ((resRatio > this.minRatio) &&
                (resRatio <= this.maxRatio) &&
                (this.ovmap.getExtent().containsBounds(testExtent)));
    },
    
    updateOverview: function() {
        var mapRes = this.map.getResolution();
        var targetRes = this.ovmap.getResolution();
        var resRatio = targetRes / mapRes;
        if(resRatio > this.maxRatio) {
            // zoom in overview map
            targetRes = this.minRatio * mapRes;            
        } else if(resRatio <= this.minRatio) {
            // zoom out overview map
            targetRes = this.maxRatio * mapRes;
        }
        this.ovmap.setCenter(this.map.center,
                            this.ovmap.getZoomForResolution(targetRes));
        this.updateRectToMap();
    },
    
    createMap: function() {
        // create the overview map
        var options = OpenLayers.Util.extend(
                        {controls: [], maxResolution: 'auto'}, this.mapOptions);
        this.ovmap = new OpenLayers.Map(this.mapDiv.id, options);
        this.ovmap.addLayers(this.layers);
        this.ovmap.zoomToMaxExtent();
        // check extent rectangle border width
        this.wComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-left-width')) +
                     parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-right-width'));
        this.wComp = (this.wComp) ? this.wComp : 2;
        this.hComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-top-width')) +
                     parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-bottom-width'));
        this.hComp = (this.hComp) ? this.hComp : 2;
    },
        
    /**
     * Updates the extent rectangle position and size to match the map extent
     */
    updateRectToMap: function() {
        // The base layer for overview map needs to be in the same projection
        // as the base layer for the main map.  This should be made more robust.
        if(this.map.units != 'degrees') {
            if(this.ovmap.getProjection() && (this.map.getProjection() != this.ovmap.getProjection())) {
                alert('The overview map only works when it is in the same projection as the main map');
            }
        }
        var pxBounds = this.getRectBoundsFromMapBounds(this.map.getExtent());
        if (pxBounds) {
          this.setRectPxBounds(pxBounds);
        }
    },
    
    /**
     * Updates the map extent to match the extent rectangle position and size
     */
    updateMapToRect: function() {
        var pxBounds = this.getRectPxBounds();
        var lonLatBounds = this.getMapBoundsFromRectBounds(pxBounds);
        this.map.setCenter(lonLatBounds.getCenterLonLat(), this.map.zoom);
    },
    
    /**
     * Get extent rectangle pixel bounds
     * @returns An OpenLayers.Bounds wich is the extent rectangle's pixel
     *          bounds (relative to the parent element)
     */
    getRectPxBounds: function() {
        var top = parseInt(this.extentRectangle.style.top);
        var left = parseInt(this.extentRectangle.style.left);
        var height = parseInt(this.extentRectangle.style.height);
        var width = parseInt(this.extentRectangle.style.width);
        return new OpenLayers.Bounds(left, top + height, left + width, top);
    },

    /**
     * Set extent rectangle pixel bounds.  
     * @param {OpenLayers.Bounds} pxBounds
     */
    setRectPxBounds: function(pxBounds) {
        var top = Math.max(pxBounds.top, 0);
        var left = Math.max(pxBounds.left, 0);
        var bottom = Math.min(pxBounds.top + Math.abs(pxBounds.getHeight()),
                              this.ovmap.size.h - this.hComp);
        var right = Math.min(pxBounds.left + pxBounds.getWidth(),
                             this.ovmap.size.w - this.wComp);
        this.extentRectangle.style.top = parseInt(top) + 'px';
        this.extentRectangle.style.left = parseInt(left) + 'px';
        this.extentRectangle.style.height = parseInt(bottom - top)+ 'px';
        this.extentRectangle.style.width = parseInt(right - left) + 'px';
    },

    /**
    * @param {OpenLayers.Bounds} lonLatBounds
    *
    * @returns An OpenLayers.Bounds which is the passed-in map lon/lat extent
    *          translated into pixel bounds for the overview map
    * @type OpenLayers.Bounds
    */
    getRectBoundsFromMapBounds: function(lonLatBounds) {
        var leftBottomLonLat = new OpenLayers.LonLat(lonLatBounds.left,
                                                     lonLatBounds.bottom);
        var rightTopLonLat = new OpenLayers.LonLat(lonLatBounds.right,
                                                   lonLatBounds.top);
        var leftBottomPx = this.getOverviewPxFromLonLat(leftBottomLonLat);
        var rightTopPx = this.getOverviewPxFromLonLat(rightTopLonLat);
        var bounds = null;
        if (leftBottomPx && rightTopPx) {
            bounds = new OpenLayers.Bounds(leftBottomPx.x, leftBottomPx.y,
                                           rightTopPx.x, rightTopPx.y);
        }
        return bounds;
    },

    /**
    * @param {OpenLayers.Bounds} pxBounds
    *
    * @returns An OpenLayers.Bounds which is the passed-in overview rect bounds
    *          translated into lon/lat bounds for the overview map
    * @type OpenLayers.Bounds
    */
    getMapBoundsFromRectBounds: function(pxBounds) {
        var leftBottomPx = new OpenLayers.Pixel(pxBounds.left,
                                                pxBounds.bottom);
        var rightTopPx = new OpenLayers.Pixel(pxBounds.right,
                                              pxBounds.top);
        var leftBottomLonLat = this.getLonLatFromOverviewPx(leftBottomPx);
        var rightTopLonLat = this.getLonLatFromOverviewPx(rightTopPx);
        return new OpenLayers.Bounds(leftBottomLonLat.lon, leftBottomLonLat.lat,
                                     rightTopLonLat.lon, rightTopLonLat.lat);
    },

    /**
    * @param {OpenLayers.Pixel} overviewMapPx
    *
    * @returns An OpenLayers.LonLat which is the passed-in overview map
    *          OpenLayers.Pixel, translated into lon/lat by the overview map
    * @type OpenLayers.LonLat
    */
    getLonLatFromOverviewPx: function(overviewMapPx) {
        var size = this.ovmap.size;
        var res  = this.ovmap.getResolution();
        var center = this.ovmap.getExtent().getCenterLonLat();
    
        var delta_x = overviewMapPx.x - (size.w / 2);
        var delta_y = overviewMapPx.y - (size.h / 2);
        
        return new OpenLayers.LonLat(center.lon + delta_x * res ,
                                     center.lat - delta_y * res); 
    },

    /**
    * @param {OpenLayers.LonLat} lonlat
    *
    * @returns An OpenLayers.Pixel which is the passed-in OpenLayers.LonLat, 
    *          translated into overview map pixels
    * @type OpenLayers.Pixel
    */
    getOverviewPxFromLonLat: function(lonlat) {
        var res  = this.ovmap.getResolution();
        var extent = this.ovmap.getExtent();
        var px = null;
        if (extent) {
            px = new OpenLayers.Pixel(
                        Math.round(1/res * (lonlat.lon - extent.left)),
                        Math.round(1/res * (extent.top - lonlat.lat)));
        } 
        return px;
    },

    /** @final @type String */
    CLASS_NAME: 'OpenLayers.Control.OverviewMap'
    
});
/* ======================================================================    OpenLayers/Control/PanZoomBar.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class 
 * 
 * @requires OpenLayers/Control/PanZoom.js
 */
OpenLayers.Control.PanZoomBar = OpenLayers.Class.create();
OpenLayers.Control.PanZoomBar.X = 4;
OpenLayers.Control.PanZoomBar.Y = 4;
OpenLayers.Control.PanZoomBar.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control.PanZoom, {

    /** @type int */
    zoomStopWidth: 18,

    /** @type int */
    zoomStopHeight: 11,

    /** @type DOMElement */
    slider: null,

    /** @type OpenLayers.Events */
    sliderEvents: null,

    /** @type DOMElement */
    zoomBarDiv: null,

    /** @type OpenLayers.Events */
    divEvents: null,

    initialize: function() {
        OpenLayers.Control.PanZoom.prototype.initialize.apply(this, arguments);
        this.position = new OpenLayers.Pixel(OpenLayers.Control.PanZoomBar.X,
                                             OpenLayers.Control.PanZoomBar.Y);
    },

    /**
     * 
     */
    destroy: function() {

        this.div.removeChild(this.slider);
        this.slider = null;

        this.sliderEvents.destroy();
        this.sliderEvents = null;
        
        this.div.removeChild(this.zoombarDiv);
        this.zoomBarDiv = null;

        this.divEvents.destroy();
        this.divEvents = null;

        this.map.events.unregister("zoomend", this, this.moveZoomBar);
        this.map.events.unregister("changebaselayer", this, this.redraw)

        OpenLayers.Control.PanZoom.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Control.PanZoom.prototype.setMap.apply(this, arguments);
        this.map.events.register("changebaselayer", this, this.redraw);
    },

    /** clear the div and start over.
     * 
     */
    redraw: function() {
        if (this.div != null) {
            this.div.innerHTML = "";
        }  
        this.draw();
    },
    
    /**
    * @param {OpenLayers.Pixel} px
    */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();

        // place the controls
        this.buttons = new Array();

        var sz = new OpenLayers.Size(18,18);
        var centered = new OpenLayers.Pixel(px.x+sz.w/2, px.y);

        this._addButton("panup", "north-mini.png", centered, sz);
        px.y = centered.y+sz.h;
        this._addButton("panleft", "west-mini.png", px, sz);
        this._addButton("panright", "east-mini.png", px.add(sz.w, 0), sz);
        this._addButton("pandown", "south-mini.png", centered.add(0, sz.h*2), sz);
        this._addButton("zoomin", "zoom-plus-mini.png", centered.add(0, sz.h*3+5), sz);
        centered = this._addZoomBar(centered.add(0, sz.h*4 + 5));
        this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
        return this.div;
    },

    /** 
    * @param {OpenLayers.Pixel} location where zoombar drawing is to start.
    */
    _addZoomBar:function(centered) {
        var imgLocation = OpenLayers.Util.getImagesLocation();
        
        var id = "OpenLayers_Control_PanZoomBar_Slider" + this.map.id;
        var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
        var slider = OpenLayers.Util.createAlphaImageDiv(id,
                       centered.add(-1, zoomsToEnd * this.zoomStopHeight), 
                       new OpenLayers.Size(20,9), 
                       imgLocation+"slider.png",
                       "absolute");
        this.slider = slider;
        
        this.sliderEvents = new OpenLayers.Events(this, slider, null, true);
        this.sliderEvents.register("mousedown", this, this.zoomBarDown);
        this.sliderEvents.register("mousemove", this, this.zoomBarDrag);
        this.sliderEvents.register("mouseup", this, this.zoomBarUp);
        this.sliderEvents.register("dblclick", this, this.doubleClick);
        this.sliderEvents.register("click", this, this.doubleClick);
        
        sz = new OpenLayers.Size();
        sz.h = this.zoomStopHeight * this.map.getNumZoomLevels();
        sz.w = this.zoomStopWidth;
        var div = null
        
        if (OpenLayers.Util.alphaHack()) {
            var id = "OpenLayers_Control_PanZoomBar" + this.map.id;
            div = OpenLayers.Util.createAlphaImageDiv(id, centered,
                                      new OpenLayers.Size(sz.w, 
                                              this.zoomStopHeight),
                                      imgLocation + "zoombar.png", 
                                      "absolute", null, "crop");
            div.style.height = sz.h;
        } else {
            div = OpenLayers.Util.createDiv(
                        'OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id,
                        centered,
                        sz,
                        imgLocation+"zoombar.png");
        }
        
        this.zoombarDiv = div;
        
        this.divEvents = new OpenLayers.Events(this, div, null, true);
        this.divEvents.register("mousedown", this, this.divClick);
        this.divEvents.register("mousemove", this, this.passEventToSlider);
        this.divEvents.register("dblclick", this, this.doubleClick);
        this.divEvents.register("click", this, this.doubleClick);
        
        this.div.appendChild(div);

        this.startTop = parseInt(div.style.top);
        this.div.appendChild(slider);

        this.map.events.register("zoomend", this, this.moveZoomBar);

        centered = centered.add(0, 
            this.zoomStopHeight * this.map.getNumZoomLevels());
        return centered; 
    },
    /* 
     * @param evt
     * This function is used to pass events that happen on the div, or the map,
     * through to the slider, which then does its moving thing.
     */
    passEventToSlider:function(evt) {
        this.sliderEvents.handleBrowserEvent(evt);
    },
    
    /*
     * divClick: Picks up on clicks directly on the zoombar div
     *           and sets the zoom level appropriately.
     */
    divClick: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        var y = evt.xy.y;
        var top = OpenLayers.Util.pagePosition(evt.object)[1];
        var levels = Math.floor((y - top)/this.zoomStopHeight);
        this.map.zoomTo((this.map.getNumZoomLevels() -1) -  levels);
        OpenLayers.Event.stop(evt);
    },
    
    /* 
     * @param evt
     * event listener for clicks on the slider
     */
    zoomBarDown:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        this.map.events.register("mousemove", this, this.passEventToSlider);
        this.map.events.register("mouseup", this, this.passEventToSlider);
        this.mouseDragStart = evt.xy.clone();
        this.zoomStart = evt.xy.clone();
        this.div.style.cursor = "move";
        // reset the div offsets just in case the div moved
        this.zoombarDiv.offsets = null; 
        OpenLayers.Event.stop(evt);
    },
    
    /*
     * @param evt
     * This is what happens when a click has occurred, and the client is dragging.
     * Here we must ensure that the slider doesn't go beyond the bottom/top of the 
     * zoombar div, as well as moving the slider to its new visual location
     */
    zoomBarDrag:function(evt) {
        if (this.mouseDragStart != null) {
            var deltaY = this.mouseDragStart.y - evt.xy.y
            var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
            if ((evt.clientY - offsets[1]) > 0 && 
                (evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
                var newTop = parseInt(this.slider.style.top) - deltaY;
                this.slider.style.top = newTop+"px";
            }
            this.mouseDragStart = evt.xy.clone();
            OpenLayers.Event.stop(evt);
        }
    },
    
    /* 
     * @param evt
     * Perform cleanup when a mouseup event is received -- discover new zoom level
     * and switch to it.
     */
    zoomBarUp:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) return;
        if (this.zoomStart) {
            this.div.style.cursor="default";
            this.map.events.unregister("mouseup", this, this.passEventToSlider);
            this.map.events.unregister("mousemove", this, this.passEventToSlider);
            var deltaY = this.zoomStart.y - evt.xy.y
            this.map.zoomTo(this.map.zoom + Math.round(deltaY/this.zoomStopHeight));
            this.moveZoomBar();
            this.mouseDragStart = null;
            OpenLayers.Event.stop(evt);
        }
    },
    
    /* 
    * Change the location of the slider to match the current zoom level.
    */
    moveZoomBar:function() {
        var newTop = 
            ((this.map.getNumZoomLevels()-1) - this.map.getZoom()) * 
            this.zoomStopHeight + this.startTop + 1;
        this.slider.style.top = newTop + "px";
    },    
    
    CLASS_NAME: "OpenLayers.Control.PanZoomBar"
});
/* ======================================================================    OpenLayers/Control/ZoomBox.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Box.js
 */
OpenLayers.Control.ZoomBox = OpenLayers.Class.create();
OpenLayers.Control.ZoomBox.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {
    /** @type OpenLayers.Control.TYPE_* */
    type: OpenLayers.Control.TYPE_TOOL,

    /**
     * 
     */    
    draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
                            {done: this.zoomBox}, {keyMask: this.keyMask} );
    },

    zoomBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
            var minXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.left, position.bottom));
            var maxXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.right, position.top));
            var bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
            this.map.zoomToExtent(bounds);
        } else { // it's a pixel
            this.map.setCenter(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() + 1);
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.ZoomBox"
});
/* ======================================================================    OpenLayers/Format/GeoRSS.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Write-only GeoRSS. 
 * @requires OpenLayers/Format.js
 */
OpenLayers.Format.GeoRSS = OpenLayers.Class.create();
OpenLayers.Format.GeoRSS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Format, {
    
    rssns: "http://backend.userland.com/rss2",
    
    featureNS: "http://mapserver.gis.umn.edu/mapserver",
    
    georssns: "http://www.georss.org/georss",
    
    /**
     * Accept Feature Collection, and return a string. 
     * 
     * @param {Array} List of features to serialize into a string.
     */
     write: function(features) {
        var featureCollection = document.createElementNS(this.rssns, "rss");
        for (var i=0; i < features.length; i++) {
            featureCollection.appendChild(this.createFeatureXML(features[i]));
        }
        return featureCollection;
     },
    
    /** 
     * Accept an OpenLayers.Feature.Vector, and build a geometry for it.
     * 
     * @param OpenLayers.Feature.Vector feature
     * @returns DOMElement
     */
    createFeatureXML: function(feature) {
        var geometryNode = this.buildGeometryNode(feature.geometry);
        var featureNode = document.createElementNS(this.rssns, "item");
        var titleNode = document.createElementNS(this.rssns, "title");
        titleNode.appendChild(document.createTextNode(feature.attributes.title ? feature.attributes.title : ""));
        var descNode = document.createElementNS(this.rssns, "description");
        descNode.appendChild(document.createTextNode(feature.attributes.description ? feature.attributes.description : ""));
        featureNode.appendChild(titleNode);
        featureNode.appendChild(descNode);
        for(var attr in feature.attributes) {
            var attrText = document.createTextNode(feature.attributes[attr]); 
            var nodename = attr;
            if (attr.search(":") != -1) {
                nodename = attr.split(":")[1];
            }    
            var attrContainer = document.createElementNS(this.featureNS, "feature:"+nodename);
            attrContainer.appendChild(attrText);
            featureNode.appendChild(attrContainer);
        }    
        featureNode.appendChild(geometryNode);
        return featureNode;
    },    
    
    /** 
     * builds a GeoRSS node with a given geometry
     * 
     * @param {OpenLayers.Geometry} geometry
     */
    buildGeometryNode: function(geometry) {
        var gml = "";
        // match MultiPolygon or Polygon
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
                gml = document.createElementNS(this.georssns, 'georss:polygon');
                
                gml.appendChild(this.buildCoordinatesNode(geometry.components[0]));
            }
        // match MultiLineString or LineString
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                     gml = document.createElementNS(this.georssns, 'georss:line');
                     
                     gml.appendChild(this.buildCoordinatesNode(geometry));
                 }
        // match MultiPoint or Point
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                gml = document.createElementNS(this.georssns, 'georss:point');
                gml.appendChild(this.buildCoordinatesNode(geometry));
        } else {    
          alert("Couldn't parse " + geometry.CLASS_NAME);
        }  
        return gml;         
    },
     
    buildCoordinatesNode: function(geometry) {
        var points = null;
        
        if (geometry.components) {
            points = geometry.components;
        }

        var path = "";
        if (points) {
            for (var i = 0; i < points.length; i++) {
                path += points[i].lat + " " + points[i].lon + " ";
            }
        } else {
           path += geometry.lat + " " + geometry.lon + " ";
        }
        return document.createTextNode(path);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Format.GeoRSS" 

});     
/* ======================================================================    OpenLayers/Geometry/MultiLineString.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * A MultiLineString is a collection of LineStrings
 *
 * @requires OpenLayers/Geometry/Collection.js
 */
OpenLayers.Geometry.MultiLineString = OpenLayers.Class.create();
OpenLayers.Geometry.MultiLineString.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.Collection, {

    /**
     * An array of class names representing the types of components that
     * the collection can include.  A null value means the component types
     * are not restricted.
     * @type Array(String)
     */
    componentTypes: ["OpenLayers.Geometry.LineString"],

    /**
     * @constructor
     *
     * @param {Array(OpenLayers.Geometry.LineString)} components
     */
    initialize: function(components) {
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, 
                                                                  arguments);        
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.MultiLineString"
});
/* ======================================================================    OpenLayers/Geometry/MultiPoint.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * MultiPoint is a collection of Points.
 * 
 * @requires OpenLayers/Geometry/Collection.js
 */
OpenLayers.Geometry.MultiPoint = OpenLayers.Class.create();
OpenLayers.Geometry.MultiPoint.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.Collection, {

    /**
     * An array of class names representing the types of components that
     * the collection can include.  A null value means the component types
     * are not restricted.
     * @type Array(String)
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * @constructor
     *
     * @param {Array(OpenLayers.Geometry.Point)} components
     */
    initialize: function(components) {
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, 
                                                                  arguments);
    },

    /**
     * Wrapper for addComponent()
     * 
     * @param {OpenLayers.Geometry.Point} point
     * @param {int} index
     */
    addPoint: function(point, index) {
        this.addComponent(point, index);
    },
    
    /**
     * Wrapper for removeComponent()
     *
     * @param {OpenLayers.Geometry.Point} point
     */
    removePoint: function(point){
        this.removeComponent(point);
    },
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.MultiPoint"
});
/* ======================================================================    OpenLayers/Geometry/MultiPolygon.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * MultiPolygon is a collection of Polygons.
 * 
 * @requires OpenLayers/Geometry/Collection.js
 */
OpenLayers.Geometry.MultiPolygon = OpenLayers.Class.create();
OpenLayers.Geometry.MultiPolygon.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.Collection, {

    /**
     * An array of class names representing the types of components that
     * the collection can include.  A null value means the component types
     * are not restricted.
     * @type Array(String)
     */
    componentTypes: ["OpenLayers.Geometry.Polygon"],

    /**
    * @constructor
    *
    * @param {Array(OpenLayers.Geometry.Polygon)} components
    */
    initialize: function(components) {
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, 
                                                                  arguments);
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.MultiPolygon"
});
/* ======================================================================    OpenLayers/Geometry/Polygon.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * Polygon is a collection of Geometry.LinearRings. 
 * 
 * The first ring (this.component[0])is the outer bounds of the polygon and 
 * all subsequent rings (this.component[1-n]) are internal holes.
 *
 * @requires OpenLayers/Geometry/Collection.js
 */
OpenLayers.Geometry.Polygon = OpenLayers.Class.create();
OpenLayers.Geometry.Polygon.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.Collection, {

    /**
     * An array of class names representing the types of components that
     * the collection can include.  A null value means the component types
     * are not restricted.
     * @type Array(String)
     */
    componentTypes: ["OpenLayers.Geometry.LinearRing"],

    /**
     * @constructor
     *
     * @param {Array(OpenLayers.Geometry.LinearRing)}
     */
    initialize: function(components) {
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, 
                                                                  arguments);
    },
    
    /** Calculated by subtracting the areas of the internal holes from the 
     *   area of the outer hole.
     * 
     * @returns The area of the geometry
     * @type float 
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 0)) {
            area += Math.abs(this.components[0].getArea());
            for (var i = 1; i < this.components.length; i++) {
                area -= Math.abs(this.components[i].getArea());
            }
        }
        return area;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.Polygon"
});
/* ======================================================================    OpenLayers/Handler/Drag.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Handler for dragging a rectangle across the map.  Drag is displayed 
 * on mouse down, moves on mouse move, and is finished on mouse up.
 * 
 * @class
 * @requires OpenLayers/Handler.js
 * @requires OpenLayers/Events.js
 */
OpenLayers.Handler.Drag = OpenLayers.Class.create();
OpenLayers.Handler.Drag.prototype = OpenLayers.Class.inherit( OpenLayers.Handler, {
    /** 
     * When a mousedown event is received, we want to record it, but not set 
     * 'dragging' until the mouse moves after starting. 
     * 
     * @type Boolean 
     **/
    started: false,
    
    /** @type Boolean **/
    dragging: false,

    /** @type OpenLayers.Pixel **/
    start: null,

    /**
     * @type Function
     * @private
     */
    oldOnselectstart: null,

    /**
     * @constructor
     *
     * @param {OpenLayers.Control} control
     * @param {Object} callbacks An object containing a single function to be
     *                          called when the drag operation is finished.
     *                          The callback should expect to recieve a single
     *                          argument, the point geometry.
     * @param {Object} options
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * Handle mousedown events
     * @param {Event} evt
     * @type Boolean
     * @return Should the event propagate
     */
    mousedown: function (evt) {
        if (this.checkModifiers(evt) && OpenLayers.Event.isLeftClick(evt)) {
            this.started = true;
            this.dragging = false;
            this.start = evt.xy.clone();
            // TBD replace with CSS classes
            this.map.div.style.cursor = "move";
            this.callback("down", [evt.xy]);
            OpenLayers.Event.stop(evt);
            return false;
        }
        return true;
    },

    /**
     * Handle mousemove events
     * @param {Event} evt
     * @type Boolean
     * @return Should the event propagate
     */
    mousemove: function (evt) {
        if (this.started) {
            this.dragging = true;
            this.callback("move", [evt.xy]);
            if(document.onselectstart) {
                if(!this.oldOnselectstart) {
                    this.oldOnselectstart = document.onselectstart;
                    document.onselectstart = function() {return false;}
                }
            }
        }
        return true;
    },

    /**
     * Handle mouseup events
     * @param {Event} evt
     * @type Boolean
     * @return Should the event propagate
     */
    mouseup: function (evt) {
        if (this.started) {
            this.started = false;
            this.dragging = false;
            // TBD replace with CSS classes
            this.map.div.style.cursor = "default";
            this.callback("up", [evt.xy]);
            if(document.onselectstart) {
                document.onselectstart = this.oldOnselectstart;
            }
        }
        return true;
    },

    /**
     * Handle mouseout events
     * @param {Event} evt
     * @type Boolean
     * @return Should the event propagate
     */
    mouseout: function (evt) {
        if (this.started && OpenLayers.Util.mouseLeft(evt, this.map.div)) {
            this.started = false; 
            this.dragging = false;
            // TBD replace with CSS classes
            this.map.div.style.cursor = "default";
            this.callback("out", []);
            if(document.onselectstart) {
                document.onselectstart = this.oldOnselectstart;
            }
        }
        return true;
    },

    /**
     * The drag handler captures the click event.  If something else registers
     * for clicks on the same element, its listener will not be called after a
     * drag.
     * @param {Event} evt
     * @type Boolean
     * @return Should the event propagate
     */
    click: function (evt) {
        // throw away the first left click event that happens after a mouse up
        if (OpenLayers.Event.isLeftClick(evt) && this.dragging) {
            this.dragging = true;
            return false; 
        }
        this.started = false;
        return true;
    },

    /**
     * Activate the handler.
     * @type Boolean
     * @return Was activation successful.  Returns false if already active.
     */
    activate: function() {
        if(OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragging = false;
            return true;
        } else {
            return false;
        }
    },

    /**
     * Deactivate the handler.
     * @type Boolean
     * @return Was deactivation successful.  Returns false if not already active.
     */
    deactivate: function() {
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.dragging = false;
            return true;
        } else {
            return false;
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Handler.Drag"
});
/* ======================================================================    OpenLayers/Handler/Keyboard.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Handler for dragging a rectangle across the map.  Keyboard is displayed 
 * on mouse down, moves on mouse move, and is finished on mouse up.
 * 
 * @class
 * @requires OpenLayers/Handler.js
 * @requires OpenLayers/Events.js
 */
OpenLayers.Handler.Keyboard = OpenLayers.Class.create();
OpenLayers.Handler.Keyboard.prototype = OpenLayers.Class.inherit( OpenLayers.Handler, {

    /* http://www.quirksmode.org/js/keys.html explains key x-browser
        key handling quirks in pretty nice detail */

    /* supported named callbacks are: keyup, keydown, keypress */

    /** constant */
    KEY_EVENTS: ["keydown", "keypress", "keyup"],

    /** @type Function
    *   @private
    */
    eventListener: null,

    initialize: function () {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        // cache the bound event listener method so it can be unobserved later
        this.eventListener = this.handleKeyEvent.bindAsEventListener(this);
    },
    
    /**
     * 
     */
    destroy: function() {
        this.deactivate();
        this.eventListener = null;
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    activate: function() {
        OpenLayers.Handler.prototype.activate.apply(this, arguments);
        for (var i = 0; i < this.KEY_EVENTS.length; i++) {
            OpenLayers.Event.observe(
                window, this.KEY_EVENTS[i], this.eventListener);
        }
    },

    deactivate: function() {
        OpenLayers.Handler.prototype.activate.apply(this, arguments);
        for (var i = 0; i < this.KEY_EVENTS.length; i++) {
            OpenLayers.Event.stopObserving(
                document, this.KEY_EVENTS[i], this.eventListener);
        }
    },

    handleKeyEvent: function (evt) {
        if (this.checkModifiers(evt)) {
            this.callback(evt.type, [evt.charCode || evt.keyCode]);
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Handler.Keyboard"
});
/* ======================================================================    OpenLayers/Handler/Point.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * Handler to draw a point on the map.  Point is displayed on mouse down,
 * moves on mouse move, and is finished on mouse up.
 * 
 * @class
 * @requires OpenLayers/Handler.js
 * @requires OpenLayers/Geometry/Point.js
 */
OpenLayers.Handler.Point = OpenLayers.Class.create();
OpenLayers.Handler.Point.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Handler, {
    
    /**
     * @type OpenLayers.Geometry.Point
     * @private
     */
    point: null,

    /**
     * @type OpenLayers.Layer.Vector
     * @private
     */
    layer: null,
    
    /**
     * @type Boolean
     * @private
     */
    drawing: false,
    
    /**
     * @type Boolean
     * @private
     */
    mouseDown: false,

    /**
     * @type OpenLayers.Pixel
     * @private
     */
    lastDown: null,

    /**
     * @type OpenLayers.Pixel
     * @private
     */
    lastUp: null,

    /**
     * @constructor
     *
     * @param {OpenLayers.Control} control
     * @param {Array} callbacks An object with a 'done' property whos value is
     *                          a function to be called when the point drawing
     *                          is finished.  The callback should expect to
     *                          recieve a single argument, the point geometry.
     *                          If the callbacks object contains a 'cancel' property,
     *                          this function will be called when the handler is deactivated
     *                          while drawing.  The cancel should expect to receive a geometry.
     * @param {Object} options
     */
    initialize: function(control, callbacks, options) {
        // TBD: deal with style
        this.style = OpenLayers.Util.extend(OpenLayers.Feature.Vector.style['default'], {});

        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * turn on the handler
     */
    activate: function() {
        if(!OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            return false;
        }
        // create temporary vector layer for rendering geometry sketch
        // TBD: this could be moved to initialize/destroy - setting visibility here
        var options = {displayInLayerSwitcher: false};
        this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME, options);
        this.map.addLayer(this.layer);
        return true;
    },
    
    /**
     * Add temporary geometries
     */
    createGeometry: function() {
        this.point = new OpenLayers.Geometry.Point();
    },

    /**
     * turn off the handler
     */
    deactivate: function() {
        if(!OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            return false;
        }
        // call the cancel callback if mid-drawing
        if(this.drawing) {
            this.cancel();
        }
        this.map.removeLayer(this.layer, false);
        this.layer.destroy();
        return true;
    },
    
    /**
     * Destroy the temporary geometries
     */
    destroyGeometry: function() {
        this.point.destroy();
    },

    /**
     * Finish the geometry and call the "done" callback.
     */
    finalize: function() {
        this.layer.renderer.clear();
        this.callback("done", [this.geometryClone()]);
        this.destroyGeometry();
        this.drawing = false;
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
    },

    /**
     * Finish the geometry and call the "cancel" callback.
     */
    cancel: function() {
        this.layer.renderer.clear();
        this.callback("cancel", [this.geometryClone()]);
        this.destroyGeometry();
        this.drawing = false;
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
    },

    /**
     * Handle double clicks.
     */
    dblclick: function(evt) {
        OpenLayers.Event.stop(evt);
        return false;
    },
    
    /**
     * Render geometries on the temporary layer.
     */
    drawGeometry: function() {
        this.layer.renderer.drawGeometry(this.point, this.style);
    },
    
    /**
     * Return a clone of the relevant geometry.
     *
     * @type OpenLayers.Geometry.Point
     */
    geometryClone: function() {
        return this.point.clone();
    },
  
    /**
     * Handle mouse down.  Add a new point to the geometry and render it.
     * Return determines whether to propagate the event on the map.
     * 
     * @param {Event} evt
     * @type Boolean
     */
    mousedown: function(evt) {
        // check keyboard modifiers
        if(!this.checkModifiers(evt)) {
            return true;
        }
        // ignore double-clicks
        if(this.lastDown && this.lastDown.equals(evt.xy)) {
            return true;
        }
        if(this.lastDown == null) {
            this.createGeometry();
        }
        this.lastDown = evt.xy;
        this.drawing = true;
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        this.point.setX(lonlat.lon);
        this.point.setY(lonlat.lat);
        this.drawGeometry();
        return false;
    },

    /**
     * Handle mouse move.  Adjust the geometry and redraw.
     * Return determines whether to propagate the event on the map.
     * 
     * @param {Event} evt
     * @type Boolean
     */
    mousemove: function (evt) {
        if(this.drawing) {
            var lonlat = this.map.getLonLatFromPixel(evt.xy);
            this.point.setX(lonlat.lon);
            this.point.setY(lonlat.lat);
            this.drawGeometry();
        }
        return true;
    },

    /**
     * Handle mouse up.  Send the latest point in the geometry to the control.
     * Return determines whether to propagate the event on the map.
     * 
     * @param {Event} evt
     * @type Boolean
     */
    mouseup: function (evt) {
        if(this.drawing) {
            this.finalize(this.point);
            return false;
        } else {
            return true;
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Handler.Point"
});
/* ======================================================================    OpenLayers/Map.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/Events.js
 */
OpenLayers.Map = OpenLayers.Class.create();
OpenLayers.Map.TILE_WIDTH = 256;
OpenLayers.Map.TILE_HEIGHT = 256;
OpenLayers.Map.prototype = {
    
    /** base z-indexes for different classes of thing 
     * 
     * @type Object
     */
    Z_INDEX_BASE: { BaseLayer: 100, Overlay: 325, Popup: 750, Control: 1000 },

    /** supported application event types
     * 
     * @type Array */
    EVENT_TYPES: [ 
        "addlayer", "removelayer", "changelayer", "movestart", "move", 
        "moveend", "zoomend", "popupopen", "popupclose",
        "addmarker", "removemarker", "clearmarkers", "mouseover",
        "mouseout", "mousemove", "dragstart", "drag", "dragend",
        "changebaselayer"],

    /** @type String */
    id: null,
    
    /** @type OpenLayers.Events */
    events: null,

    /** function that is called to destroy the map on page unload. stored
     *   here so that if map is manually destroyed, we can unregister this.
     * 
     * @type Function */
    unloadDestroy: null,

    /** the div that our map lives in
     * 
     * @type DOMElement */
    div: null,

    /** Size of the main div (this.div)
     * 
     * @type OpenLayers.Size */
    size: null,
    
    /** @type HTMLDivElement  */
    viewPortDiv: null,

    /** The lonlat at which the later container was re-initialized (on-zoom)
     * @type OpenLayers.LonLat */
    layerContainerOrigin: null,

    /** @type HTMLDivElement */
    layerContainerDiv: null,

    /** ordered list of layers in the map
     * 
     * @type Array(OpenLayers.Layer)
     */
    layers: null,

    /** @type Array(OpenLayers.Control) */
    controls: null,

    /** @type Array(OpenLayers.Popup) */
    popups: null,

    /** The currently selected base layer - this determines min/max zoom level, 
     *  projection, etc.
     * 
     * @type OpenLayers.Layer */
    baseLayer: null,
    
    /** @type OpenLayers.LonLat */
    center: null,

    /** @type int */
    zoom: 0,    

    /** Used to store a unique identifier that changes when the map view 
     * changes. viewRequestID should be used when adding data asynchronously 
     * to the map: viewRequestID is incremented when you initiate your 
     * request (right now during changing of baselayers and changing of zooms). 
     * It is stored here in the map and also in the data that will be coming 
     * back asynchronously. Before displaying this data on request completion, 
     * we check that the viewRequestID of the data is still the same as that 
     * of the map. Fix for #480
     * 
     * @type String */
    viewRequestID: 0,

  // Options

    /** @type OpenLayers.Size */
    tileSize: null,

    /** @type String */
    projection: "EPSG:4326",    
        
    /** @type String */
    units: 'degrees',

    /** default max is 360 deg / 256 px, which corresponds to
     *    zoom level 0 on gmaps
     * 
     * @type float */
    maxResolution: 1.40625,

    /** @type float */
    minResolution: null,

    /** @type float */
    maxScale: null,

    /** @type float */
    minScale: null,

    /** @type OpenLayers.Bounds */
    maxExtent: null,
    
    /** @type OpenLayers.Bounds */
    minExtent: null,
    
    /** @type int */
    numZoomLevels: 16,

    /** @type string */
    theme: null,

    /** Should OpenLayers allow events on the map to fall through to other
     *   elements on the page, or should it swallow them? (#457)
     * 
     *  Default is to swallow them.
     * 
     * @type boolean 
     */
    fallThrough: false,

    /**
     * @constructor
     * 
     * @param {DOMElement} div
     * @param {Object} options Hashtable of extra options to tag onto the map
     */    
    initialize: function (div, options) {
        
        //set the default options
        this.setOptions(options);

        this.id = OpenLayers.Util.createUniqueID("OpenLayers.Map_");


        this.div = div = OpenLayers.Util.getElement(div);

        // the viewPortDiv is the outermost div we modify
        var id = div.id + "_OpenLayers_ViewPort";
        this.viewPortDiv = OpenLayers.Util.createDiv(id, null, null, null,
                                                     "relative", null,
                                                     "hidden");
        this.viewPortDiv.style.width = "100%";
        this.viewPortDiv.style.height = "100%";
        this.viewPortDiv.className = "olMapViewport";
        this.div.appendChild(this.viewPortDiv);

        // the layerContainerDiv is the one that holds all the layers
        id = div.id + "_OpenLayers_Container";
        this.layerContainerDiv = OpenLayers.Util.createDiv(id);
        this.layerContainerDiv.style.zIndex=this.Z_INDEX_BASE['Popup']-1;
        
        this.viewPortDiv.appendChild(this.layerContainerDiv);

        this.events = new OpenLayers.Events(this, div, this.EVENT_TYPES, this.fallThrough);
        this.updateSize();
 
        // update the map size and location before the map moves
        this.events.register("movestart", this, this.updateSize);

        // Because Mozilla does not support the "resize" event for elements other
        // than "window", we need to put a hack here. 
        if (navigator.appName.contains("Microsoft")) {
            // If IE, register the resize on the div
            this.events.register("resize", this, this.updateSize);
        } else {
            // Else updateSize on catching the window's resize
            //  Note that this is ok, as updateSize() does nothing if the 
            //  map's size has not actually changed.
            OpenLayers.Event.observe(window, 'resize', 
                          this.updateSize.bindAsEventListener(this));
        }
        
        // only append link stylesheet if the theme property is set
        if(this.theme) {
            var cssNode = document.createElement('link');
            cssNode.setAttribute('rel', 'stylesheet');
            cssNode.setAttribute('type', 'text/css');
            cssNode.setAttribute('href', this.theme);
            document.getElementsByTagName('head')[0].appendChild(cssNode);
        }

        this.layers = [];
        
        if (this.controls == null) {
            if (OpenLayers.Control != null) { // running full or lite?
                this.controls = [ new OpenLayers.Control.Navigation(),
                                  new OpenLayers.Control.PanZoom(),
                                  new OpenLayers.Control.ArgParser()
                                ];
            } else {
                this.controls = [];
            }
        }

        for(var i=0; i < this.controls.length; i++) {
            this.addControlToMap(this.controls[i]);
        }

        this.popups = new Array();

        this.unloadDestroy = this.destroy.bindAsEventListener(this);
        

        // always call map.destroy()
        OpenLayers.Event.observe(window, 'unload', this.unloadDestroy);

    },

    /**
    * @private
    */
    destroy:function() {

        // map has been destroyed. dont do it again!
        OpenLayers.Event.stopObserving(window, 'unload', this.unloadDestroy);
        this.unloadDestroy = null;

        if (this.layers != null) {
            for(var i=0; i< this.layers.length; i++) {
                //pass 'false' to destroy so that map wont try to set a new 
                // baselayer after each baselayer is removed
                this.layers[i].destroy(false);
            } 
            this.layers = null;
        }
        if (this.controls != null) {
            for(var i=0; i< this.controls.length; i++) {
                this.controls[i].destroy();
            } 
            this.controls = null;
        }
        if (this.viewPortDiv) {
            this.div.removeChild(this.viewPortDiv);
        }
        this.viewPortDiv = null;

        this.events.destroy();
        this.events = null;

    },

    /**
     * @private
     * 
     * @param {Object} options Hashtable of options to tag to the map
     */
    setOptions: function(options) {

        // Simple-type defaults are set in class definition. 
        //  Now set complex-type defaults 
        this.tileSize = new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,
                                            OpenLayers.Map.TILE_HEIGHT);
        
        this.maxExtent = new OpenLayers.Bounds(-180, -90, 180, 90);

        this.theme = OpenLayers._getScriptLocation() + 
                             'theme/default/style.css'; 

        // now add the options declared by the user
        //  (these will override defaults)
        OpenLayers.Util.extend(this, options);
    },

    /**
     * @type OpenLayers.Size
     */
     getTileSize: function() {
         return this.tileSize;
     },

  /********************************************************/
  /*                                                      */
  /*           Layers, Controls, Popup Functions          */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Layers, Controls, and Popups         */
  /*                to and from the Map                   */
  /*                                                      */
  /********************************************************/         

    /**
     * @param {String} name
     * 
     * @returns The Layer with the corresponding id from the map's 
     *           layer collection, or null if not found.
     * @type OpenLayers.Layer
     */
    getLayer: function(id) {
        var foundLayer = null;
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if (layer.id == id) {
                foundLayer = layer;
            }
        }
        return foundLayer;
    },

    /**
    * @param {OpenLayers.Layer} layer
    * @param {int} zIdx
    * @private
    */    
    setLayerZIndex: function (layer, zIdx) {
        layer.setZIndex(
            this.Z_INDEX_BASE[layer.isBaseLayer ? 'BaseLayer' : 'Overlay']
            + zIdx * 5 );
    },

    /**
    * @param {OpenLayers.Layer} layer
    */    
    addLayer: function (layer) {
        for(var i=0; i < this.layers.length; i++) {
            if (this.layers[i] == layer) {
                return false;
            }
        }    
        
        layer.div.style.overflow = "";
        this.setLayerZIndex(layer, this.layers.length);

        if (layer.isFixed) {
            this.viewPortDiv.appendChild(layer.div);
        } else {
            this.layerContainerDiv.appendChild(layer.div);
        }
        this.layers.push(layer);
        layer.setMap(this);

        if (layer.isBaseLayer)  {
            if (this.baseLayer == null) {
                // set the first baselaye we add as the baselayer
                this.setBaseLayer(layer);
            } else {
                layer.setVisibility(false);
            }
        } else {
            if (this.getCenter() != null) {
                layer.moveTo(this.getExtent(), true);   
            }
        }

        this.events.triggerEvent("addlayer");
    },

    /**
    * @param {Array(OpenLayers.Layer)} layers
    */    
    addLayers: function (layers) {
        for (var i = 0; i <  layers.length; i++) {
            this.addLayer(layers[i]);
        }
    },

    /** Removes a layer from the map by removing its visual element (the 
     *   layer.div property), then removing it from the map's internal list 
     *   of layers, setting the layer's map property to null. 
     * 
     *   a "removelayer" event is triggered.
     * 
     *   very worthy of mention is that simply removing a layer from a map
     *   will not cause the removal of any popups which may have been created
     *   by the layer. this is due to the fact that it was decided at some
     *   point that popups would not belong to layers. thus there is no way 
     *   for us to know here to which layer the popup belongs.
     *    
     *     A simple solution to this is simply to call destroy() on the layer.
     *     the default OpenLayers.Layer class's destroy() function
     *     automatically takes care to remove itself from whatever map it has
     *     been attached to. 
     * 
     *     The correct solution is for the layer itself to register an 
     *     event-handler on "removelayer" and when it is called, if it 
     *     recognizes itself as the layer being removed, then it cycles through
     *     its own personal list of popups, removing them from the map.
     * 
     * @param {OpenLayers.Layer} layer
     * @param {Boolean} setNewBaseLayer Default is true
     */
    removeLayer: function(layer, setNewBaseLayer) {
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }

        if (layer.isFixed) {
            this.viewPortDiv.removeChild(layer.div);
        } else {
            this.layerContainerDiv.removeChild(layer.div);
        }
        layer.map = null;
        OpenLayers.Util.removeItem(this.layers, layer);

        // if we removed the base layer, need to set a new one
        if (setNewBaseLayer && (this.baseLayer == layer)) {
            this.baseLayer = null;
            for(i=0; i < this.layers.length; i++) {
                var iLayer = this.layers[i];
                if (iLayer.isBaseLayer) {
                    this.setBaseLayer(iLayer);
                    break;
                }
            }
        }
        this.events.triggerEvent("removelayer");
    },

    /**
    * @returns The number of layers attached to the map.
    * @type int
    */
    getNumLayers: function () {
        return this.layers.length;
    },

    /** 
    * @returns The current (zero-based) index of the given layer in the map's
    *     layer stack. Returns -1 if the layer isn't on the map.
    *
    * @param {OpenLayers.Layer} layer
    * @type int
    */
    getLayerIndex: function (layer) {
        return OpenLayers.Util.indexOf(this.layers, layer);
    },
    
    /** Move the given layer to the specified (zero-based) index in the layer
    *     list, changing its z-index in the map display. Use
    *     map.getLayerIndex() to find out the current index of a layer. Note
    *     that this cannot (or at least should not) be effectively used to
    *     raise base layers above overlays.
    *
    * @param {OpenLayers.Layer} layer
    * @param {int} idx
    */
    setLayerIndex: function (layer, idx) {
        var base = this.getLayerIndex(layer);
        if (idx < 0) 
            idx = 0;
        else if (idx > this.layers.length)
            idx = this.layers.length;
        if (base != idx) {
            this.layers.splice(base, 1);
            this.layers.splice(idx, 0, layer);
            for (var i = 0; i < this.layers.length; i++)
                this.setLayerZIndex(this.layers[i], i);
            this.events.triggerEvent("changelayer");
        }
    },

    /** Change the index of the given layer by delta. If delta is positive, 
    *     the layer is moved up the map's layer stack; if delta is negative,
    *     the layer is moved down.  Again, note that this cannot (or at least
    *     should not) be effectively used to raise base layers above overlays.
    *
    * @param {OpenLayers.Layer} layer
    * @param {int} idx
    */
    raiseLayer: function (layer, delta) {
        var idx = this.getLayerIndex(layer) + delta;
        this.setLayerIndex(layer, idx);
    },
    
    /** Allows user to specify one of the currently-loaded layers as the Map's
     *   new base layer.
     * 
     * @param {OpenLayers.Layer} newBaseLayer
     * @param {Boolean} noEvent
     */
    setBaseLayer: function(newBaseLayer, noEvent) {
        var oldExtent = null;
        if(this.baseLayer) {
            oldExtent = this.baseLayer.getExtent();
        }

        if (newBaseLayer != this.baseLayer) {
          
            // is newBaseLayer an already loaded layer?
            if (OpenLayers.Util.indexOf(this.layers, newBaseLayer) != -1) {

                // make the old base layer invisible 
                if (this.baseLayer != null) {
                    this.baseLayer.setVisibility(false, noEvent);
                }

                // set new baselayer and make it visible
                this.baseLayer = newBaseLayer;
                
                // Increment viewRequestID since the baseLayer is 
                // changing. This is used by tiles to check if they should 
                // draw themselves.
                this.viewRequestID++;
                this.baseLayer.setVisibility(true, noEvent);

                //redraw all layers
                var center = this.getCenter();
                if (center != null) {
                    if (oldExtent == null) {
                        this.setCenter(center);            
                    } else {
                        this.zoomToExtent(oldExtent);
                    }
                }

                if ((noEvent == null) || (noEvent == false)) {
                    this.events.triggerEvent("changebaselayer");
                }
            }        
        }
    },

    /**
    * @param {OpenLayers.Control} control
    * @param {OpenLayers.Pixel} px
    */    
    addControl: function (control, px) {
        this.controls.push(control);
        this.addControlToMap(control, px);
    },

    /**
     * @private
     * 
     * @param {OpenLayers.Control} control
     * @param {OpenLayers.Pixel} px
     */    
    addControlToMap: function (control, px) {
        // If a control doesn't have a div at this point, it belongs in the
        // viewport.
        control.outsideViewport = (control.div != null);
        control.setMap(this);
        var div = control.draw(px);
        if (div) {
            if(!control.outsideViewport) {
                div.style.zIndex = this.Z_INDEX_BASE['Control'] +
                                    this.controls.length;
                this.viewPortDiv.appendChild( div );
            }
        }
    },
    
    /** 
    * @param {OpenLayers.Popup} popup
    * @param {Boolean} exclusive If true, closes all other popups first
    */
    addPopup: function(popup, exclusive) {

        if (exclusive) {
            //remove all other popups from screen
            for(var i=0; i < this.popups.length; i++) {
                this.removePopup(this.popups[i]);
            }
        }

        popup.map = this;
        this.popups.push(popup);
        var popupDiv = popup.draw();
        if (popupDiv) {
            popupDiv.style.zIndex = this.Z_INDEX_BASE['Popup'] +
                                    this.popups.length;
            this.layerContainerDiv.appendChild(popupDiv);
        }
    },
    
    /** 
    * @param {OpenLayers.Popup} popup
    */
    removePopup: function(popup) {
        OpenLayers.Util.removeItem(this.popups, popup);
        if (popup.div) {
            try { this.layerContainerDiv.removeChild(popup.div); }
            catch (e) { } // Popups sometimes apparently get disconnected
                      // from the layerContainerDiv, and cause complaints.
        }
        popup.map = null;
    },

  /********************************************************/
  /*                                                      */
  /*              Container Div Functions                 */
  /*                                                      */
  /*   The following functions deal with the access to    */
  /*    and maintenance of the size of the container div  */
  /*                                                      */
  /********************************************************/     

    /**
    * @returns An OpenLayers.Size object that represents the size, in pixels, 
    *          of the div into which OpenLayers has been loaded. 
    * 
    *          Note: A clone() of this locally cached variable is returned, so 
    *                as not to allow users to modify it.
    * 
    * @type OpenLayers.Size
    */
    getSize: function () {
        var size = null;
        if (this.size != null) {
            size = this.size.clone();
        }
        return size;
    },

    /**
    * This function should be called by any external code which dynamically
    * changes the size of the map div (because mozilla wont let us catch the
    * "onresize" for an element)
    */
    updateSize: function() {
        // the div might have moved on the page, also
        this.events.element.offsets = null;
        var newSize = this.getCurrentSize();
        var oldSize = this.getSize();
        if (oldSize == null)
            this.size = oldSize = newSize;
        if (!newSize.equals(oldSize)) {
            
            // store the new size
            this.size = newSize;

            //notify layers of mapresize
            for(var i=0; i < this.layers.length; i++) {
                this.layers[i].onMapResize();                
            }

            if (this.baseLayer != null) {
                var center = new OpenLayers.Pixel(newSize.w /2, newSize.h / 2);
                var centerLL = this.getLonLatFromViewPortPx(center);
                var zoom = this.getZoom();
                this.zoom = null;
                this.setCenter(this.getCenter(), zoom);
            }

        }
    },
    
    /**
     * @private 
     * 
     * @returns A new OpenLayers.Size object with the dimensions of the map div
     * @type OpenLayers.Size
     */
    getCurrentSize: function() {

        var size = new OpenLayers.Size(this.div.clientWidth, 
                                       this.div.clientHeight);

        // Workaround for the fact that hidden elements return 0 for size.
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            var dim = OpenLayers.Element.getDimensions(this.div);
            size.w = dim.width;
            size.h = dim.height;
        }
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = parseInt(this.div.style.width);
            size.h = parseInt(this.div.style.height);
        }
        return size;
    },

    /** 
     * @param {OpenLayers.LonLat} center Default is this.getCenter()
     * @param {float} resolution Default is this.getResolution() 
     * 
     * @returns A Bounds based on resolution, center, and current mapsize.
     * @type OpenLayers.Bounds
     */
    calculateBounds: function(center, resolution) {

        var extent = null;
        
        if (center == null) {
            center = this.getCenter();
        }                
        if (resolution == null) {
            resolution = this.getResolution();
        }
    
        if ((center != null) && (resolution != null)) {

            var size = this.getSize();
            var w_deg = size.w * resolution;
            var h_deg = size.h * resolution;
        
            extent = new OpenLayers.Bounds(center.lon - w_deg / 2,
                                           center.lat - h_deg / 2,
                                           center.lon + w_deg / 2,
                                           center.lat + h_deg / 2);
        
        }

        return extent;
    },


  /********************************************************/
  /*                                                      */
  /*            Zoom, Center, Pan Functions               */
  /*                                                      */
  /*    The following functions handle the validation,    */
  /*   getting and setting of the Zoom Level and Center   */
  /*       as well as the panning of the Map              */
  /*                                                      */
  /********************************************************/
    /**
    * @return {OpenLayers.LonLat}
    */
    getCenter: function () {
        return this.center;
    },


    /**
    * @return {int}
    */
    getZoom: function () {
        return this.zoom;
    },
    
    /** Allows user to pan by a value of screen pixels
     * 
     * @param {int} dx
     * @param {int} dy
     */
    pan: function(dx, dy) {

        // getCenter
        var centerPx = this.getViewPortPxFromLonLat(this.getCenter());

        // adjust
        var newCenterPx = centerPx.add(dx, dy);
        
        // only call setCenter if there has been a change
        if (!newCenterPx.equals(centerPx)) {
            var newCenterLonLat = this.getLonLatFromViewPortPx(newCenterPx);
            this.setCenter(newCenterLonLat);
        }

   },

    /**
    * @param {OpenLayers.LonLat} lonlat
    * @param {int} zoom
    * @param {Boolean} dragging Specifies whether or not to 
    *                           trigger movestart/end events
    */
    setCenter: function (lonlat, zoom, dragging) {
        
        if (!this.center && !this.isValidLonLat(lonlat)) {
            lonlat = this.maxExtent.getCenterLonLat();
        }
        
        var zoomChanged = (this.isValidZoomLevel(zoom)) && 
                          (zoom != this.getZoom());

        var centerChanged = (this.isValidLonLat(lonlat)) && 
                            (!lonlat.equals(this.center));


        // if neither center nor zoom will change, no need to do anything
        if (zoomChanged || centerChanged || !dragging) {

            if (!dragging) { this.events.triggerEvent("movestart"); }

            if (centerChanged) {
                if ((!zoomChanged) && (this.center)) { 
                    // if zoom hasnt changed, just slide layerContainer
                    //  (must be done before setting this.center to new value)
                    this.centerLayerContainer(lonlat);
                }
                this.center = lonlat.clone();
            }

            // (re)set the layerContainerDiv's location
            if ((zoomChanged) || (this.layerContainerOrigin == null)) {
                this.layerContainerOrigin = this.center.clone();
                this.layerContainerDiv.style.left = "0px";
                this.layerContainerDiv.style.top  = "0px";
            }

            if (zoomChanged) {
                this.zoom = zoom;
                    
                //redraw popups
                for (var i = 0; i < this.popups.length; i++) {
                    this.popups[i].updatePosition();
                }

                // zoom level has changed, increment viewRequestID.
                this.viewRequestID++;
            }    
            
            var bounds = this.getExtent();
            
            //send the move call to the baselayer and all the overlays    
            this.baseLayer.moveTo(bounds, zoomChanged, dragging);
            for (var i = 0; i < this.layers.length; i++) {
                var layer = this.layers[i];
                if (!layer.isBaseLayer) {
                    
                    var moveLayer;
                    var inRange = layer.calculateInRange();
                    if (layer.inRange != inRange) {
                        // Layer property has changed. We are going 
                        // to call moveLayer so that the layer can be turned
                        // off or on.   
                        layer.inRange = inRange;
                        moveLayer = true;
                        this.events.triggerEvent("changelayer");
                    } else {
                        // If nothing has changed, then we only move the layer
                        // if it is visible and inrange.
                        moveLayer = (layer.visibility && layer.inRange);
                    }

                    if (moveLayer) {
                        layer.moveTo(bounds, zoomChanged, dragging);
                    }
                }                
            }
            
            this.events.triggerEvent("move");
    
            if (zoomChanged) { this.events.triggerEvent("zoomend"); }
        }

        // even if nothing was done, we want to notify of this
        if (!dragging) { this.events.triggerEvent("moveend"); }
    },

    /** This function takes care to recenter the layerContainerDiv 
     * 
     * @private 
     * 
     * @param {OpenLayers.LonLat} lonlat
     */
    centerLayerContainer: function (lonlat) {

        var originPx = this.getViewPortPxFromLonLat(this.layerContainerOrigin);
        var newPx = this.getViewPortPxFromLonLat(lonlat);

        if ((originPx != null) && (newPx != null)) {
            this.layerContainerDiv.style.left = (originPx.x - newPx.x) + "px";
            this.layerContainerDiv.style.top  = (originPx.y - newPx.y) + "px";
        }
    },

    /**
     * @private 
     * 
     * @param {int} zoomLevel
     * 
     * @returns Whether or not the zoom level passed in is non-null and 
     *           within the min/max range of zoom levels.
     * @type Boolean
     */
    isValidZoomLevel: function(zoomLevel) {
       return ( (zoomLevel != null) &&
                (zoomLevel >= 0) && 
                (zoomLevel < this.getNumZoomLevels()) );
    },
    
    /**
     * @private 
     * 
     * @param {OpenLayers.LonLat} lonlat
     * 
     * @returns Whether or not the lonlat passed in is non-null and within
     *             the maxExtent bounds
     * 
     * @type Boolean
     */
    isValidLonLat: function(lonlat) {
        var valid = false;
        if (lonlat != null) {
            var maxExtent = this.getMaxExtent();
            valid = maxExtent.containsLonLat(lonlat);        
        }
        return valid;
    },

  /********************************************************/
  /*                                                      */
  /*                 Layer Options                        */
  /*                                                      */
  /*    Accessor functions to Layer Options parameters    */
  /*                                                      */
  /********************************************************/
    
    /**
     * @returns The Projection of the base layer
     * @type String
     */
    getProjection: function() {
        var projection = null;
        if (this.baseLayer != null) {
            projection = this.baseLayer.projection;
        }
        return projection;
    },
    
    /**
     * @returns The Map's Maximum Resolution
     * @type String
     */
    getMaxResolution: function() {
        var maxResolution = null;
        if (this.baseLayer != null) {
            maxResolution = this.baseLayer.maxResolution;
        }
        return maxResolution;
    },
        
    /**
    * @type OpenLayers.Bounds
    */
    getMaxExtent: function () {
        var maxExtent = null;
        if (this.baseLayer != null) {
            maxExtent = this.baseLayer.maxExtent;
        }        
        return maxExtent;
    },
    
    /**
     * @returns The total number of zoom levels that can be displayed by the 
     *           current baseLayer.
     * @type int
     */
    getNumZoomLevels: function() {
        var numZoomLevels = null;
        if (this.baseLayer != null) {
            numZoomLevels = this.baseLayer.numZoomLevels;
        }
        return numZoomLevels;
    },

  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /*    The following functions, all publicly exposed     */
  /*       in the API?, are all merely wrappers to the    */
  /*       the same calls on whatever layer is set as     */
  /*                the current base layer                */
  /*                                                      */
  /********************************************************/

    /**
     * @returns A Bounds object which represents the lon/lat bounds of the 
     *          current viewPort. 
     *          If no baselayer is set, returns null.
     * @type OpenLayers.Bounds
     */
    getExtent: function () {
        var extent = null;
        if (this.baseLayer != null) {
            extent = this.baseLayer.getExtent();
        }
        return extent;
    },

    /**
     * @returns The current resolution of the map. 
     *          If no baselayer is set, returns null.
     * @type float
     */
    getResolution: function () {
        var resolution = null;
        if (this.baseLayer != null) {
            resolution = this.baseLayer.getResolution();
        }
        return resolution;
    },

     /**
      * @returns The current scale denominator of the map. 
      *          If no baselayer is set, returns null.
      * @type float
      */
    getScale: function () {
        var scale = null;
        if (this.baseLayer != null) {
            var res = this.getResolution();
            var units = this.baseLayer.units;
            scale = OpenLayers.Util.getScaleFromResolution(res, units);
        }
        return scale;
    },


    /**
     * @param {OpenLayers.Bounds} bounds
     *
     * @returns A suitable zoom level for the specified bounds.
     *          If no baselayer is set, returns null.
     * @type int
     */
    getZoomForExtent: function (bounds) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForExtent(bounds);
        }
        return zoom;
    },

    /**
     * @param {float} resolution
     *
     * @returns A suitable zoom level for the specified resolution.
     *          If no baselayer is set, returns null.
     * @type int
     */
    getZoomForResolution: function(resolution) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForResolution(resolution);
        }
        return zoom;
    },

  /********************************************************/
  /*                                                      */
  /*                  Zooming Functions                   */
  /*                                                      */
  /*    The following functions, all publicly exposed     */
  /*       in the API, are all merely wrappers to the     */
  /*               the setCenter() function               */
  /*                                                      */
  /********************************************************/
  
    /** Zoom to a specific zoom level
     * 
     * @param {int} zoom
     */
    zoomTo: function(zoom) {
        if (this.isValidZoomLevel(zoom)) {
            this.setCenter(null, zoom);
        }
    },
    
    /**
     * @param {int} zoom
     */
    zoomIn: function() {
        this.zoomTo(this.getZoom() + 1);
    },
    
    /**
     * @param {int} zoom
     */
    zoomOut: function() {
        this.zoomTo(this.getZoom() - 1);
    },

    /** Zoom to the passed in bounds, recenter
     * 
     * @param {OpenLayers.Bounds} bounds
     */
    zoomToExtent: function(bounds) {
        this.setCenter(bounds.getCenterLonLat(), 
                       this.getZoomForExtent(bounds));
    },

    /** Zoom to the full extent and recenter.
     */
    zoomToMaxExtent: function() {
        this.zoomToExtent(this.getMaxExtent());
    },

    /** zoom to a specified scale 
     * 
     * @param {float} scale
     */
    zoomToScale: function(scale) {
        var res = OpenLayers.Util.getResolutionFromScale(scale, 
                                                         this.baseLayer.units);
        var size = this.getSize();
        var w_deg = size.w * res;
        var h_deg = size.h * res;
        var center = this.getCenter();

        var extent = new OpenLayers.Bounds(center.lon - w_deg / 2,
                                           center.lat - h_deg / 2,
                                           center.lon + w_deg / 2,
                                           center.lat + h_deg / 2);
        this.zoomToExtent(extent);
    },
    
  /********************************************************/
  /*                                                      */
  /*             Translation Functions                    */
  /*                                                      */
  /*      The following functions translate between       */
  /*           LonLat, LayerPx, and ViewPortPx            */
  /*                                                      */
  /********************************************************/
      
  //
  // TRANSLATION: LonLat <-> ViewPortPx
  //

    /**
    * @param {OpenLayers.Pixel} viewPortPx
    *
    * @returns An OpenLayers.LonLat which is the passed-in view port
    *          OpenLayers.Pixel, translated into lon/lat by the 
    *          current base layer
    * @type OpenLayers.LonLat
    * @private
    */
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null; 
        if (this.baseLayer != null) {
            lonlat = this.baseLayer.getLonLatFromViewPortPx(viewPortPx);
        }
        return lonlat;
    },

    /**
    * @param {OpenLayers.LonLat} lonlat
    *
    * @returns An OpenLayers.Pixel which is the passed-in OpenLayers.LonLat, 
    *          translated into view port pixels by the 
    *          current base layer
    * @type OpenLayers.Pixel
    * @private
    */
    getViewPortPxFromLonLat: function (lonlat) {
        var px = null; 
        if (this.baseLayer != null) {
            px = this.baseLayer.getViewPortPxFromLonLat(lonlat);
        }
        return px;
    },

    
  //
  // CONVENIENCE TRANSLATION FUNCTIONS FOR API
  //

    /**
     * @param {OpenLayers.Pixel} pixel
     *
     * @returns An OpenLayers.LonLat corresponding to the given
     *          OpenLayers.Pixel, translated into lon/lat by the 
     *          current base layer
     * @type OpenLayers.LonLat
     */
    getLonLatFromPixel: function (px) {
        return this.getLonLatFromViewPortPx(px);
    },

    /**
     * @param {OpenLayers.LonLat} lonlat
     *
     * @returns An OpenLayers.Pixel corresponding to the OpenLayers.LonLat
     *          translated into view port pixels by the 
     *          current base layer
     * @type OpenLayers.Pixel
     */
    getPixelFromLonLat: function (lonlat) {
        return this.getViewPortPxFromLonLat(lonlat);
    },



  //
  // TRANSLATION: ViewPortPx <-> LayerPx
  //

    /**
     * @private
     * 
     * @param {OpenLayers.Pixel} layerPx
     * 
     * @returns Layer Pixel translated into ViewPort Pixel coordinates
     * @type OpenLayers.Pixel
     */
    getViewPortPxFromLayerPx:function(layerPx) {
        var viewPortPx = null;
        if (layerPx != null) {
            var dX = parseInt(this.layerContainerDiv.style.left);
            var dY = parseInt(this.layerContainerDiv.style.top);
            viewPortPx = layerPx.add(dX, dY);            
        }
        return viewPortPx;
    },
    
    /**
     * @private
     * 
     * @param {OpenLayers.Pixel} viewPortPx
     * 
     * @returns ViewPort Pixel translated into Layer Pixel coordinates
     * @type OpenLayers.Pixel
     */
    getLayerPxFromViewPortPx:function(viewPortPx) {
        var layerPx = null;
        if (viewPortPx != null) {
            var dX = -parseInt(this.layerContainerDiv.style.left);
            var dY = -parseInt(this.layerContainerDiv.style.top);
            layerPx = viewPortPx.add(dX, dY);
            if (isNaN(layerPx.x) || isNaN(layerPx.y)) {
                layerPx = null;
            }
        }
        return layerPx;
    },
    
  //
  // TRANSLATION: LonLat <-> LayerPx
  //

    /**
    * @param {OpenLayers.Pixel} px
    *
    * @type OpenLayers.LonLat
    */
    getLonLatFromLayerPx: function (px) {
       //adjust for displacement of layerContainerDiv
       px = this.getViewPortPxFromLayerPx(px);
       return this.getLonLatFromViewPortPx(px);         
    },
    
    /**
    * @param {OpenLayers.LonLat} lonlat
    *
    * @returns An OpenLayers.Pixel which is the passed-in OpenLayers.LonLat, 
    *          translated into layer pixels by the current base layer
    * @type OpenLayers.Pixel
    */
    getLayerPxFromLonLat: function (lonlat) {
       //adjust for displacement of layerContainerDiv
       var px = this.getViewPortPxFromLonLat(lonlat);
       return this.getLayerPxFromViewPortPx(px);         
    },


    /** @final @type String */
    CLASS_NAME: "OpenLayers.Map"
};
/* ======================================================================    OpenLayers/Marker.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * @requires OpenLayers/Events.js
 * @requires OpenLayers/Icon.js
 */
OpenLayers.Marker = OpenLayers.Class.create();
OpenLayers.Marker.prototype = {
    
    /** @type OpenLayers.Icon */
    icon: null,

    /** location of object
    * @type OpenLayers.LonLat */
    lonlat: null,
    
    /** @type OpenLayers.Events*/
    events: null,
    
    /** @type OpenLayers.Map */
    map: null,
    
    /** 
    * @constructor
    *
    * @param {OpenLayers.Icon} icon
    * @param {OpenLayers.LonLat lonlat
    */
    initialize: function(lonlat, icon) {
        this.lonlat = lonlat;
        
        var newIcon = (icon) ? icon : OpenLayers.Marker.defaultIcon();
        if (this.icon == null) {
            this.icon = newIcon;
        } else {
            this.icon.url = newIcon.url;
            this.icon.size = newIcon.size;
            this.icon.offset = newIcon.offset;
            this.icon.calculateOffset = newIcon.calculateOffset;
        }
        this.events = new OpenLayers.Events(this, this.icon.imageDiv, null);
    },
    
    destroy: function() {
        this.map = null;

        this.events.destroy();
        this.events = null;

        if (this.icon != null) {
            this.icon.destroy();
            this.icon = null;
        }
    },
    
    /** 
    * @param {OpenLayers.Pixel} px
    * 
    * @return A new DOM Image with this marker´s icon set at the 
    *         location passed-in
    * @type DOMElement
    */
    draw: function(px) {
        return this.icon.draw(px);
    }, 

    /**
    * @param {OpenLayers.Pixel} px
    */
    moveTo: function (px) {
        if ((px != null) && (this.icon != null)) {
            this.icon.moveTo(px);
        }           
        this.lonlat = this.map.getLonLatFromLayerPx(px);
    },

    /**
     * @returns Whether or not the marker is currently visible on screen.
     * @type Boolean
     */
    onScreen:function() {
        
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }    
        return onScreen;
    },
    
    /**
     * @param {float} inflate
     */
    inflate: function(inflate) {
        if (this.icon) {
            var newSize = new OpenLayers.Size(this.icon.size.w * inflate,
                                              this.icon.size.h * inflate);
            this.icon.setSize(newSize);
        }        
    },
    
    /** Change the opacity of the marker by changin the opacity of 
     *   its icon
     * 
     * @param {float} opacity Specified as fraction (0.4, etc)
     */
    setOpacity: function(opacity) {
        this.icon.setOpacity(opacity);
    },

    /** Hide or show the icon
     * 
     * @param {Boolean} display
     */
    display: function(display) {
        this.icon.display(display);
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Marker"
};


/** 
 * @returns A default OpenLayers.Icon to use for a marker
 * @type OpenLayers.Icon
 */
OpenLayers.Marker.defaultIcon = function() {
    var url = OpenLayers.Util.getImagesLocation() + "marker.png";
    var size = new OpenLayers.Size(21, 25);
    var calculateOffset = function(size) {
                    return new OpenLayers.Pixel(-(size.w/2), -size.h);
                 };

    return new OpenLayers.Icon(url, size, null, calculateOffset);        
};
    

/* ======================================================================    OpenLayers/Popup/AnchoredBubble.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Popup/Anchored.js
 */
OpenLayers.Popup.AnchoredBubble = OpenLayers.Class.create();

//Border space for the rico corners
OpenLayers.Popup.AnchoredBubble.CORNER_SIZE = 5;

OpenLayers.Popup.AnchoredBubble.prototype =
   OpenLayers.Class.inherit( OpenLayers.Popup.Anchored, {

    rounded: false, 
    
    /** 
    * @constructor
    * 
    * @param {String} id
    * @param {OpenLayers.LonLat} lonlat
    * @param {OpenLayers.Size} size
    * @param {String} contentHTML
    * @param {Object} anchor  Object which must expose a 
    *                         - 'size' (OpenLayers.Size) and 
    *                         - 'offset' (OpenLayers.Pixel) 
    *                         (this is generally an OpenLayers.Icon)
    * @param {Boolean} closeBox
    */
    initialize:function(id, lonlat, size, contentHTML, anchor, closeBox) {
        OpenLayers.Popup.Anchored.prototype.initialize.apply(this, arguments);
    },

    /** 
    * @param {OpenLayers.Pixel} px
    * 
    * @returns Reference to a div that contains the drawn popup
    * @type DOMElement
    */
    draw: function(px) {
        
        OpenLayers.Popup.Anchored.prototype.draw.apply(this, arguments);

        this.setContentHTML();
        
        this.setRicoCorners(!this.rounded);
        this.rounded = true;
        
        //set the popup color and opacity           
        this.setBackgroundColor(); 
        this.setOpacity();

        return this.div;
    },

    /**
    * @param {OpenLayers.Size} size
    */
    setSize:function(size) { 
        OpenLayers.Popup.Anchored.prototype.setSize.apply(this, arguments);
        
        if (this.contentDiv != null) {

            var contentSize = this.size.clone();
            contentSize.h -= (2 * OpenLayers.Popup.AnchoredBubble.CORNER_SIZE);
            contentSize.h -= (2 * this.padding);
    
            this.contentDiv.style.height = contentSize.h + "px";
            this.contentDiv.style.width  = contentSize.w + "px";
            
            if (this.map) {
                //size has changed - must redo corners        
                this.setRicoCorners(!this.rounded);
                this.rounded = true;
            }    
        }
    },  

    /**
     * @param {String} color
     */
    setBackgroundColor:function(color) { 
        if (color != undefined) {
            this.backgroundColor = color; 
        }
        
        if (this.div != null) {
            if (this.contentDiv != null) {
                this.div.style.background = "transparent";
                OpenLayers.Rico.Corner.changeColor(this.contentDiv, this.backgroundColor);
            }
        }
    },  
    
    /**
     * @param {float} opacity
     */
    setOpacity:function(opacity) { 
        if (opacity != undefined) {
            this.opacity = opacity; 
        }
        
        if (this.div != null) {
            if (this.contentDiv != null) {
            OpenLayers.Rico.Corner.changeOpacity(this.contentDiv, this.opacity);
            }
        }
    },  
 
    /** Bubble Popups can not have a border
     * 
     * @param {int} border
     */
    setBorder:function(border) { 
        this.border = 0;
    },      
 
    /** 
     * @private
     * 
     * @param {Boolean} firstTime Is this the first time the corners are being
     *                             rounded?
     * 
     * update the rico corners according to the popup's
     * current relative postion 
     */
    setRicoCorners:function(firstTime) {
    
        var corners = this.getCornersToRound(this.relativePosition);
        var options = {corners: corners,
                         color: this.backgroundColor,
                       bgColor: "transparent",
                         blend: false};

        if (firstTime) {
            OpenLayers.Rico.Corner.round(this.div, options);
        } else {
            OpenLayers.Rico.Corner.reRound(this.contentDiv, options);
            //set the popup color and opacity
            this.setBackgroundColor(); 
            this.setOpacity();
        }
    },

    /** 
     * @private
     * 
     * @returns The proper corners string ("tr tl bl br") for rico
     *           to round
     * @type String
     */
    getCornersToRound:function() {

        var corners = ['tl', 'tr', 'bl', 'br'];

        //we want to round all the corners _except_ the opposite one. 
        var corner = OpenLayers.Bounds.oppositeQuadrant(this.relativePosition);
        OpenLayers.Util.removeItem(corners, corner);

        return corners.join(" ");
    },

    CLASS_NAME: "OpenLayers.Popup.AnchoredBubble"
});
/* ======================================================================    OpenLayers/Renderer/SVG.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Renderer/Elements.js
 */
OpenLayers.Renderer.SVG = OpenLayers.Class.create();
OpenLayers.Renderer.SVG.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Renderer.Elements, {

    /** @type String */
    xmlns: "http://www.w3.org/2000/svg",
    
    /**
     * @constructor
     * 
     * @param {String} containerID
     */
    initialize: function(containerID) {
        if (!this.supported()) { 
            return; 
        }
        OpenLayers.Renderer.Elements.prototype.initialize.apply(this, 
                                                                arguments);
    },

    /**
     * 
     */
    destroy: function() {
        OpenLayers.Renderer.Elements.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * @returns Whether or not the browser supports the VML renderer
     * @type Boolean
     */
    supported: function() {
        var svgFeature = "http://www.w3.org/TR/SVG11/feature#SVG";
        var supported = (document.implementation.hasFeature("org.w3c.svg", "1.0") || document.implementation.hasFeature(svgFeature, "1.1"));
        return supported;
    },    

    /**
     * @param {OpenLayers.Bounds} extent
     */
    setExtent: function(extent) {
        OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, 
                                                               arguments);
        var extentString = extent.left + " " + -extent.top + " " + 
                             extent.getWidth() + " " + extent.getHeight();
        this.rendererRoot.setAttributeNS(null, "viewBox", extentString);
    },

    /**
     * function
     *
     * sets the size of the drawing surface
     *
     * @param size {OpenLayers.Size} the size of the drawing surface
     */
    setSize: function(size) {
        OpenLayers.Renderer.prototype.setSize.apply(this, arguments);
        
        this.rendererRoot.setAttributeNS(null, "width", this.size.w);
        this.rendererRoot.setAttributeNS(null, "height", this.size.h);
    },

    


    /** 
     * @param geometry {OpenLayers.Geometry}
     * 
     * @returns The corresponding node type for the specified geometry
     * @type String
     */
    getNodeType: function(geometry) {
        var nodeType = null;
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                nodeType = "circle";
                break;
            case "OpenLayers.Geometry.Rectangle":
                nodeType = "rect";
                break;
            case "OpenLayers.Geometry.LineString":
                nodeType = "polyline";
                break;
            case "OpenLayers.Geometry.LinearRing":
                nodeType = "polygon";
                break;
            case "OpenLayers.Geometry.Polygon":
            case "OpenLayers.Geometry.Curve":
            case "OpenLayers.Geometry.Surface":
                nodeType = "path";
                break;
            default:
                break;
        }
        return nodeType;
    },
      
    /**
     * @param {DOMElement} node
     */
    reprojectNode: function(node) {
        //just reset style (stroke width and point radius), since coord 
        // system has not changed
        this.setStyle(node);  
    },
    
    /** 
     * Use to set all the style attributes to a SVG node.
     * 
     * Note: takes care to adjust stroke width and point radius
     *       to be resolution-relative
     *
     * @param node {SVGDomElement} an SVG element to decorate
     * @param {Object} style
     * @param {Object} options
     * @option isFilled {boolean} 
     * @option isStroked {boolean} 
     */
    setStyle: function(node, style, options) {
        style = style  || node.olStyle;
        options = options || node.olOptions;

        if (node.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            var newRadius = style.pointRadius * this.getResolution();
            node.setAttributeNS(null, "r", newRadius);
        }
        
        if (options.isFilled) {
            node.setAttributeNS(null, "fill", style.fillColor);
            node.setAttributeNS(null, "fill-opacity", style.fillOpacity);
        } else {
            node.setAttributeNS(null, "fill", "none");
        }

        if (options.isStroked) {
            node.setAttributeNS(null, "stroke", style.strokeColor);
            node.setAttributeNS(null, "stroke-opacity", style.strokeOpacity);
            var newStrokeWidth = style.strokeWidth * this.getResolution(); 
            node.setAttributeNS(null, "stroke-width", newStrokeWidth);
        } else {
            node.setAttributeNS(null, "stroke", "none");
        }
        
        if (style.pointerEvents) {
            node.setAttributeNS(null, "pointer-events", style.pointerEvents);
        }
    },

    /** 
     * @private 
     *
     * @param {String} type Kind of node to draw
     * @param {String} id Id for node
     * 
     * @returns A new node of the given type and id
     * @type DOMElement
     */
    createNode: function(type, id) {
        var node = document.createElementNS(this.xmlns, type);
        if (id) {
            node.setAttributeNS(null, "id", id);
        }
        return node;    
    },
    
    /** 
     * @private 
     *
     * @param {String} type Kind of node to draw
     * @param {String} id Id for node
     * 
     * @returns Whether or not the specified node is of the specified type
     * @type Boolean
     */
    nodeTypeCompare: function(node, type) {
        return (type == node.nodeName);
    },
   
    /**
     * @returns The specific render engine's root element
     * @type DOMElement
     */
    createRenderRoot: function() {
        var id = this.container.id + "_svgRoot";
        var rendererRoot = this.nodeFactory(id, "svg");
        return rendererRoot;                        
    },

    /**
     * @returns The main root element to which we'll add vectors
     * @type DOMElement
     */
    createRoot: function() {
        var id = this.container.id + "_root";

        var root = this.nodeFactory(id, "g");

        // flip the SVG display Y axis upside down so it 
        // matches the display Y axis of the map
        root.setAttributeNS(null, "transform", "scale(1, -1)");

        return root;
    },

    /**************************************
     *                                    *
     *     GEOMETRY DRAWING FUNCTIONS     *
     *                                    *
     **************************************/

    /** 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawPoint: function(node, geometry) {
        this.drawCircle(node, geometry, 1);
    },

    /** 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     * @param {float} radius
     */
    drawCircle: function(node, geometry, radius) {
        node.setAttributeNS(null, "cx", geometry.x);
        node.setAttributeNS(null, "cy", geometry.y);
        node.setAttributeNS(null, "r", radius);
    },
    
    /** 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawLineString: function(node, geometry) {
        node.setAttributeNS(null, "points", geometry.getComponentsString());  
    },
    
    /** 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawLinearRing: function(node, geometry) {
        node.setAttributeNS(null, "points", geometry.getComponentsString());
    },
    
    /** 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawPolygon: function(node, geometry) {
        var d = "";
        for (var j = 0; j < geometry.components.length; j++) {
            var linearRing = geometry.components[j];
            d += " M";
            for (var i = 0; i < linearRing.components.length; i++) {
                d += " " + linearRing.components[i].toShortString();
            }
        }
        d += " z";
        
        node.setAttributeNS(null, "d", d);
        node.setAttributeNS(null, "fill-rule", "evenodd");
    },
    
    /** 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawRectangle: function(node, geometry) {
        node.setAttributeNS(null, "x", geometry.x);
        node.setAttributeNS(null, "y", geometry.y);
        node.setAttributeNS(null, "width", geometry.width);
        node.setAttributeNS(null, "height", geometry.height);
    },
    
    
    /** 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawCurve: function(node, geometry) {
        var d = null;
        for (var i = 0; i < geometry.components.length; i++) {
            if ((i%3) == 0 && (i/3) == 0) {
                d = "M " + geometry.components[i].toShortString();
            } else if ((i%3) == 1) {
                d += " C " + geometry.components[i].toShortString();
            } else {
                d += " " + geometry.components[i].toShortString();
            }
        }
        node.setAttributeNS(null, "d", d);
    },
    
    /** 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawSurface: function(node, geometry) {

        // create the svg path string representation
        var d = null;
        for (var i = 0; i < geometry.components.length; i++) {
            if ((i%3) == 0 && (i/3) == 0) {
                d = "M " + geometry.components[i].toShortString();
            } else if ((i%3) == 1) {
                d += " C " + geometry.components[i].toShortString();
            } else {
                d += " " + geometry.components[i].toShortString();
            }
        }
        d += " Z";
        node.setAttributeNS(null, "d", d);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Renderer.SVG"
});
/* ======================================================================    OpenLayers/Renderer/VML.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 * 
 * Note that for all calculations in this class, we use toFixed() to round a 
 * float value to an integer. This is done because it seems that VML doesn't 
 * support float values.
 *
 * @requires OpenLayers/Renderer/Elements.js
 */
OpenLayers.Renderer.VML = OpenLayers.Class.create();
OpenLayers.Renderer.VML.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Renderer.Elements, {

    /** @type String */
    xmlns: "urn:schemas-microsoft-com:vml",

    /**
     * @constructor
     * 
     * @param {String} containerID
     */
    initialize: function(containerID) {
        if (!this.supported()) { 
            return; 
        } 
        document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
        var style = document.createStyleSheet();
        style.addRule('v\\:*', "behavior: url(#default#VML);");

        OpenLayers.Renderer.Elements.prototype.initialize.apply(this, 
                                                                arguments);
    },

    /**
     * 
     */
    destroy: function() {
        OpenLayers.Renderer.Elements.prototype.destroy.apply(this, arguments);
    },

    /**
     * @returns Whether or not the browser supports the VML renderer
     * @type Boolean
     */
    supported: function() {
        var supported = document.namespaces;
        return supported;
    },    

    /**
     * @param {OpenLayers.Bounds} extent
     */
    setExtent: function(extent) {
        OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, 
                                                               arguments);
        var resolution = this.getResolution();
    
        var org = extent.left/resolution + " " + 
                    extent.top/resolution;
        this.root.setAttribute("coordorigin", org);

        var size = extent.getWidth()/resolution + " " + 
                    -extent.getHeight()/resolution;
        this.root.setAttribute("coordsize", size);
    },


    /**
     * Set the size of the drawing surface
     *
     * @param size {OpenLayers.Size} the size of the drawing surface
     */
    setSize: function(size) {
        OpenLayers.Renderer.prototype.setSize.apply(this, arguments);

        this.rendererRoot.style.width = this.size.w;
        this.rendererRoot.style.height = this.size.h;

        this.root.style.width = this.size.w;
        this.root.style.height = this.size.h
    },

    /** 
     * @param geometry {OpenLayers.Geometry}
     * 
     * @returns The corresponding node type for the specified geometry
     * @type String
     */
    getNodeType: function(geometry) {
        var nodeType = null;
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                nodeType = "v:oval";
                break;
            case "OpenLayers.Geometry.Rectangle":
                nodeType = "v:rect";
                break;
            case "OpenLayers.Geometry.LineString":
            case "OpenLayers.Geometry.LinearRing":
            case "OpenLayers.Geometry.Polygon":
            case "OpenLayers.Geometry.Curve":
            case "OpenLayers.Geometry.Surface":
                nodeType = "v:shape";
                break;
            default:
                break;
        }
        return nodeType;
    },

    /**
     * @param {DOMElement} node
     */
    reprojectNode: function(node) {
        //we have to reprojectNode the entire node since the coordinates 
        // system has changed
        this.drawGeometryNode(node);  
    },


    /**
     * Use to set all the style attributes to a VML node.
     *
     * @param {DOMElement} node
     * @param {Object} style
     * @param {Object} options
     * @option isFilled {boolean} 
     * @option isStroked {boolean} 
     */
    setStyle: function(node, style, options) {
        style = style  || node.olStyle;
        options = options || node.olOptions;
        
        if (node.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
            this.drawCircle(node, node.geometry, style.pointRadius);
        }

      //fill
        var fillColor = (options.isFilled) ? style.fillColor : "none";
        node.setAttribute("fillcolor", fillColor);
        var fills = node.getElementsByTagName("fill");
        var fill = (fills.length == 0) ? null : fills[0];
        if (!options.isFilled) {
            if (fill) {
                node.removeChild(fill);
            }
        } else {
            if (!fill) {
                fill = this.createNode('v:fill', node.id + "_fill");
                node.appendChild(fill);
            }
            fill.setAttribute("opacity", style.fillOpacity);
        }


      //stroke
        var strokeColor = (options.isStroked) ? style.strokeColor : "none";
        node.setAttribute("strokecolor", strokeColor);
        node.setAttribute("strokeweight", style.strokeWidth);
        var strokes = node.getElementsByTagName("stroke");
        var stroke = (strokes.length == 0) ? null : strokes[0];
        if (!options.isStroked) {
            if (stroke) {
                node.removeChild(stroke);
            }
        } else {
            if (!stroke) {
                stroke = this.createNode('v:stroke', node.id + "_stroke");
                node.appendChild(stroke);
            }
            stroke.setAttribute("opacity", style.strokeOpacity);
        }
    },


    /** Get the geometry's bounds, convert it to our vml coordinate system, 
     *   then set the node's position, size, and local coordinate system.
     *   
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    setNodeDimension: function(node, geometry) {

        var bbox = geometry.getBounds();

        var resolution = this.getResolution();
    
        var scaledBox = 
            new OpenLayers.Bounds((bbox.left/resolution).toFixed(),
                                  (bbox.bottom/resolution).toFixed(),
                                  (bbox.right/resolution).toFixed(),
                                  (bbox.top/resolution).toFixed());
        
        // Set the internal coordinate system to draw the path
        node.style.left = scaledBox.left;
        node.style.top = scaledBox.top;
        node.style.width = scaledBox.getWidth();
        node.style.height = scaledBox.getHeight();

        node.coordorigin = scaledBox.left + " " + scaledBox.top;
        node.coordsize = scaledBox.getWidth()+ " " + scaledBox.getHeight();
    },

    /** 
     * @private 
     *
     * @param {String} type Kind of node to draw
     * @param {String} id Id for node
     * 
     * @returns A new node of the given type and id
     * @type DOMElement
     */
    createNode: function(type, id) {
        var node = document.createElement(type);
        if (id) {
            node.setAttribute('id', id);
        }
        return node;    
    },
    
    /** 
     * @private 
     *
     * @param {String} type Kind of node to draw
     * @param {String} id Id for node
     * 
     * @returns Whether or not the specified node is of the specified type
     * @type Boolean
     */
    nodeTypeCompare: function(node, type) {

        //split type
        var subType = type;
        var splitIndex = subType.indexOf(":");
        if (splitIndex != -1) {
            subType = subType.substr(splitIndex+1);
        }

        //split nodeName
        var nodeName = node.nodeName;
        splitIndex = nodeName.indexOf(":");
        if (splitIndex != -1) {
            nodeName = nodeName.substr(splitIndex+1);
        }

        return (subType == nodeName);
    },

    /**
     * @returns The specific render engine's root element
     * @type DOMElement
     */
    createRenderRoot: function() {
        var id = this.container.id + "_vmlRoot";
        var rendererRoot = this.nodeFactory(id, "div");
        return rendererRoot;                        
    },

    /**
     * @returns The main root element to which we'll add vectors
     * @type DOMElement
     */
    createRoot: function() {
        var id = this.container.id + "_root";
        var root = this.nodeFactory(id, "v:group");
        return root;
    },

    /**************************************
     *                                    *
     *     GEOMETRY DRAWING FUNCTIONS     *
     *                                    *
     **************************************/

    /**
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry 
     */
    drawPoint: function(node, geometry) {
        this.drawCircle(node, node.geometry, 1);
    },

    /** Size and Center a circle given geometry (x,y center) and radius
     * 
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     * @param {float} radius
     */
    drawCircle: function(node, geometry, radius) {

        var resolution = this.getResolution();
    
        node.style.left = (geometry.x /resolution).toFixed() - radius;
        node.style.top = (geometry.y /resolution).toFixed() - radius;

        var diameter = radius * 2;
        
        node.style.width = diameter;
        node.style.height = diameter;
    },


    /**
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawLineString: function(node, geometry) {
        this.drawLine(node, geometry, false);
    },

    /**
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawLinearRing: function(node, geometry) {
        this.drawLine(node, geometry, true);
    },

    /**
     * @param {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     * @param {Boolean} closeLine Close the line? (make it a ring?)
     */
    drawLine: function(node, geometry, closeLine) {

        this.setNodeDimension(node, geometry);

        var resolution = this.getResolution();

        var path = "m";
        for (var i = 0; i < geometry.components.length; i++) {
            var x = (geometry.components[i].getX()/resolution);
            var y = (geometry.components[i].getY()/resolution);
            path += " " + x.toFixed() + "," + y.toFixed() + " l ";
        }
        if (closeLine) {
            path += " x";
        }
        path += " e";

        node.path = path;
    },

    /**
     * @parm {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawPolygon: function(node, geometry) {
        this.setNodeDimension(node, geometry);

        var resolution = this.getResolution();
    
        var path = "";
        for (var j = 0; j < geometry.components.length; j++) {
            var linearRing = geometry.components[j];

            path += "m";
            for (var i = 0; i < linearRing.components.length; i++) {
                var x = linearRing.components[i].getX() / resolution;
                var y = linearRing.components[i].getY() / resolution;
                path += " " + x.toFixed() + "," + y.toFixed();
                if (i==0) {
                    path += " l";
                }
            }
            path += " x ";
        }
        path += "e";
        node.path = path;
    },

    /**
     * @parm {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawRectangle: function(node, geometry) {
        var resolution = this.getResolution();
    
        node.style.left = geometry.x/resolution;
        node.style.top = geometry.y/resolution;
        node.style.width = geometry.width/resolution;
        node.style.height = geometry.height/resolution;
    },



    /**
     * @parm {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawCurve: function(node, geometry) {
        this.setNodeDimension(node, geometry);

        var resolution = this.getResolution();
    
        var path = "";
        for (var i = 0; i < geometry.components.length; i++) {
            var x = geometry.components[i].getX() / resolution;
            var y = geometry.components[i].getY() / resolution;
    
            if ((i%3)==0 && (i/3)==0) {
                path += "m"
            } else if ((i%3)==1) {
                path += " c"
            }
            path += " " + x + "," + y;
        }
        path += " x e";

        node.path = path;
    },

    /**
     * @parm {DOMElement} node
     * @param {OpenLayers.Geometry} geometry
     */
    drawSurface: function(node, geometry) {

        this.setNodeDimension(node, geometry);

        var resolution = this.getResolution();
    
        var path = "";
        for (var i = 0; i < geometry.components.length; i++) {
            var x = geometry.components[i].getX() / resolution;
            var y = geometry.components[i].getY() / resolution;
            if ((i%3)==0 && (i/3)==0) {
                path += "m";
            } else if ((i%3)==1) {
                path += " c";
            }
            path += " " + x + "," + y;
        }
        path += " x e";

        node.path = path;
    },

    CLASS_NAME: "OpenLayers.Renderer.VML"
});
/* ======================================================================    OpenLayers/Tile/Image.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Tile.js
 */
OpenLayers.Tile.Image = OpenLayers.Class.create();
OpenLayers.Tile.Image.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Tile, {
    
    /** @type DOMElement img */
    imgDiv: null,

    /** 
    * @constructor
    *
    * @param {OpenLayers.Grid} layer
    * @param {OpenLayers.Pixel} position
    * @param {OpenLayers.Bounds} bounds
    * @param {String} url
    * @param {OpenLayers.Size} size
    */
    initialize: function(layer, position, bounds, url, size) {
        OpenLayers.Tile.prototype.initialize.apply(this, arguments);
    },

    /**
     * 
     */
    destroy: function() {
        if (this.imgDiv != null)  {
            OpenLayers.Event.stopObservingElement(this.imgDiv.id);
            if (this.imgDiv.parentNode == this.layer.div) {
                this.layer.div.removeChild(this.imgDiv);
                this.imgDiv.map = null;
            }
        }
        this.imgDiv = null;
        OpenLayers.Tile.prototype.destroy.apply(this, arguments);
    },

    /**
     * 
     */
    draw:function() {
        if (this.layer != this.layer.map.baseLayer && this.layer.reproject) {
            this.bounds = this.getBoundsFromBaseLayer(this.position);
        }
        if (!OpenLayers.Tile.prototype.draw.apply(this, arguments)) {
            return false;    
        }
        if (this.imgDiv == null) {
            this.initImgDiv();
        }

        this.imgDiv.viewRequestID = this.layer.map.viewRequestID;
        
        this.url = this.layer.getURL(this.bounds);
  
        if (this.layer.alpha) {
            OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,
                    null, this.position, this.size, this.url);
        } else {
            this.imgDiv.src = this.url;
            OpenLayers.Util.modifyDOMElement(this.imgDiv,
                    null, this.position, this.size) ;
        }
        this.drawn = true;
        return true;
    },

    /** Clear the tile of any bounds/position-related data so that it can 
     *   be reused in a new location.
     */
    clear: function() {
        OpenLayers.Tile.prototype.clear.apply(this, arguments);
        if(this.imgDiv) {
            this.imgDiv.style.display = "none";
        }
    },

    /** 
     * @param {OpenLayers.Bounds}
     * @param {OpenLayers.pixel} position
     * @param {Boolean} redraw
     */
    moveTo: function (bounds, position, redraw) {
        if (this.layer != this.layer.map.baseLayer && this.layer.reproject) {
            bounds = this.getBoundsFromBaseLayer(position);
        }
        this.url = this.layer.getURL(bounds);
        OpenLayers.Tile.prototype.moveTo.apply(this, arguments);
    },

    /**
     * 
     */
    initImgDiv: function() {
        if (this.layer.alpha) {
            this.imgDiv = OpenLayers.Util.createAlphaImageDiv(null,
                                                           this.position,
                                                           this.size,
                                                           null,
                                                           "absolute",
                                                           null,
                                                           null,
                                                           null,
                                                           true);
        } else {
            this.imgDiv = OpenLayers.Util.createImage(null,
                                                      this.position,
                                                      this.size,
                                                      null,
                                                      "absolute",
                                                      null,
                                                      null,
                                                      true);
        }
        
        this.imgDiv.className = 'olTileImage';

        /* checkImgURL used to be used to called as a work around, but it
           ended up hiding problems instead of solving them and broke things
           like relative URLs. See discussion on the dev list:
           http://openlayers.org/pipermail/dev/2007-January/000205.html

        OpenLayers.Event.observe( this.imgDiv, "load",
                        this.checkImgURL.bindAsEventListener(this) );
        */
        this.layer.div.appendChild(this.imgDiv);
        if(this.layer.opacity != null) {
            
            OpenLayers.Util.modifyDOMElement(this.imgDiv, null, null, null,
                                             null, null, null, 
                                             this.layer.opacity);
        }

        // we need this reference to check back the viewRequestID
        this.imgDiv.map = this.layer.map;

    },

    /**
     * Make sure that the image that just loaded is the one this tile is meant
     * to display, since panning/zooming might have changed the tile's URL in
     * the meantime. If the tile URL did change before the image loaded, set
     * the imgDiv display to 'none', as either (a) it will be reset to visible
     * when the new URL loads in the image, or (b) we don't want to display
     * this tile after all because its new bounds are outside our maxExtent.
     * 
     * This function should no longer  be neccesary with the improvements to
     * Grid.js in OpenLayers 2.3. The lack of a good isEquivilantURL function
     * caused problems in 2.2, but it's possible that with the improved 
     * isEquivilant URL function, this might be neccesary at some point.
     * 
     * See discussion in the thread at 
     * http://openlayers.org/pipermail/dev/2007-January/000205.html
     *
     * @private
     */
    checkImgURL: function () {
        // Sometimes our image will load after it has already been removed
        // from the map, in which case this check is not needed.  
        if (this.layer) {
            var loaded = this.layer.alpha ? this.imgDiv.firstChild.src : this.imgDiv.src;
            if (!OpenLayers.Util.isEquivalentUrl(loaded, this.url)) {
                this.imgDiv.style.display = "none";
            }
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Tile.Image"
  }
);
/* ======================================================================    OpenLayers/Tile/WFS.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

 
/**
 * @class
 * 
 * @requires OpenLayers/Tile.js
 */
OpenLayers.Tile.WFS = OpenLayers.Class.create();
OpenLayers.Tile.WFS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Tile, {

    /** @type Array(OpenLayers.Feature)*/ 
    features: null,

    /** @type Array(String) */
    url: null,
    
    /** 
    * @constructor
    *
    * @param {OpenLayers.Layer} layer
    * @param {OpenLayers.Pixel} position
    * @param {OpenLayers.Bounds} bounds
    * @param {Array} urls
    * @param {OpenLayers.Size} size
    */
    initialize: function(layer, position, bounds, url, size) {
        var newArguments = arguments;
        newArguments = [layer, position, bounds, null, size];
        OpenLayers.Tile.prototype.initialize.apply(this, newArguments);
        this.url = url;        
        this.features = new Array();
    },

    /**
     * 
     */
    destroy: function() {
        OpenLayers.Tile.prototype.destroy.apply(this, arguments);
        this.destroyAllFeatures();
        this.features = null;
        this.url = null;
    },

    /** Clear the tile of any bounds/position-related data so that it can 
     *   be reused in a new location.
     */
    clear: function() {
        OpenLayers.Tile.prototype.clear.apply(this, arguments);
        this.destroyAllFeatures();
    },
    
    /**
     * 
     */
    draw:function() {
        if (OpenLayers.Tile.prototype.draw.apply(this, arguments)) {
            this.loadFeaturesForRegion(this.requestSuccess);
        }
    },

    /** get the full request string from the ds and the tile params 
    *     and call the AJAX loadURL(). 
    *
    *     input are function pointers for what to do on success and failure.
    * 
    * @param {function} success
    * @param {function} failure
    */
    loadFeaturesForRegion:function(success, failure) {
        OpenLayers.loadURL(this.url, null, this, success);
    },
    
    /** Return from AJAX request
    *
    * @param {} request
    */
    requestSuccess:function(request) {
        var doc = request.responseXML;
        
        if (!doc || request.fileType!="XML") {
            doc = OpenLayers.parseXMLString(request.responseText);
        }
        if (this.layer.vectorMode) {
            var gml = new OpenLayers.Format.GML({extractAttributes: this.layer.options.extractAttributes});
            this.layer.addFeatures(gml.read(doc));
        } else {
            var resultFeatures = OpenLayers.Ajax.getElementsByTagNameNS(doc, "http://www.opengis.net/gml","gml", "featureMember");
            this.addResults(resultFeatures);
        }
    },

    /**
     * @param {Object} results
     */
    addResults: function(results) {
        for (var i=0; i < results.length; i++) {
            var feature = new this.layer.featureClass(this.layer, 
                                                      results[i]);
            this.features.push(feature);
        }
    },


    /** Iterate through and call destroy() on each feature, removing it from
     *   the local array
     * 
     * @private
     */
    destroyAllFeatures: function() {
        while(this.features.length > 0) {
            var feature = this.features.shift();
            feature.destroy();
        }
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Tile.WFS"
  }
);
/* ======================================================================    OpenLayers/Control/DragPan.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Drag.js
 */
OpenLayers.Control.DragPan = OpenLayers.Class.create();
OpenLayers.Control.DragPan.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {
    /** @type OpenLayers.Control.TYPES */
    type: OpenLayers.Control.TYPE_TOOL,
    
    /**
     * 
     */    
    draw: function() {
        this.handler = new OpenLayers.Handler.Drag( this,
                            {"move": this.panMap, "up": this.panMapDone } );
    },

    /**
    * @param {OpenLayers.Pixel} xy Pixel of the up position
    */
    panMap: function (xy) {
        var deltaX = this.handler.start.x - xy.x;
        var deltaY = this.handler.start.y - xy.y;
        var size = this.map.getSize();
        var newXY = new OpenLayers.Pixel(size.w / 2 + deltaX,
                                         size.h / 2 + deltaY);
        var newCenter = this.map.getLonLatFromViewPortPx( newXY ); 
        this.map.setCenter(newCenter, null, true);
        // this assumes xy won't be changed inside Handler.Drag
        // a safe bet for now, and saves us the extra call to clone().
        this.handler.start = xy;
    },
    
    /**
    * @param {OpenLayers.Pixel} xy Pixel of the up position
    */
    panMapDone: function (xy) {
        var deltaX = this.handler.start.x - xy.x;
        var deltaY = this.handler.start.y - xy.y;
        var size = this.map.getSize();
        var newXY = new OpenLayers.Pixel(size.w / 2 + deltaX,
                                         size.h / 2 + deltaY);
        var newCenter = this.map.getLonLatFromViewPortPx( newXY ); 
        this.map.setCenter(newCenter, null, false);
        // this assumes xy won't be changed inside Handler.Drag
        // a safe bet for now, and saves us the extra call to clone().
        this.handler.start = xy;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.DragPan"
});
/* ======================================================================    OpenLayers/Control/KeyboardDefaults.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Keyboard.js
 */
OpenLayers.Control.KeyboardDefaults = OpenLayers.Class.create();
OpenLayers.Control.KeyboardDefaults.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type int */
    slideFactor: 50,

    /**
     * @constructor
     */
    initialize: function() {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * 
     */
    destroy: function() {
        if (this.handler) {
            this.handler.destroy();
        }        
        this.handler = null;
        
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * 
     */
    draw: function() {
        this.handler = new OpenLayers.Handler.Keyboard( this, { 
                                "keypress": this.defaultKeyPress });
        this.activate();
    },
    
    /**
    * @param {Integer} code
    */
    defaultKeyPress: function (code) {
        switch(code) {
            case OpenLayers.Event.KEY_LEFT:
                this.map.pan(-50, 0);
                break;
            case OpenLayers.Event.KEY_RIGHT: 
                this.map.pan(50, 0);
                break;
            case OpenLayers.Event.KEY_UP:
                this.map.pan(0, -50);
                break;
            case OpenLayers.Event.KEY_DOWN:
                this.map.pan(0, 50);
                break;
            case 33: // Page Up 
            case 43: // +
                this.map.zoomIn();
                break;
            case 45: // -
            case 34: // Page Down 
                this.map.zoomOut();
                break;
        }        
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.KeyboardDefaults"
});
/* ======================================================================    OpenLayers/Feature.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Util.js
 * @requires OpenLayers/Marker.js
 */
OpenLayers.Feature = OpenLayers.Class.create();
OpenLayers.Feature.prototype= {

    /** @type OpenLayers.Events */
    events:null,

    /** @type OpenLayers.Layer */
    layer: null,

    /** @type String */
    id: null,
    
    /** @type OpenLayers.LonLat */
    lonlat:null,

    /** @type Object */
    data:null,

    /** @type OpenLayers.Marker */
    marker: null,

    /** @type OpenLayers.Popup */
    popup: null,

    /** 
     * @constructor
     * 
     * @param {OpenLayers.Layer} layer
     * @param {OpenLayers.LonLat} lonlat
     * @param {Object} data
     */
    initialize: function(layer, lonlat, data) {
        this.layer = layer;
        this.lonlat = lonlat;
        this.data = (data != null) ? data : new Object();
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_"); 
    },

    /**
     * 
     */
    destroy: function() {

        //remove the popup from the map
        if ((this.layer != null) && (this.layer.map != null)) {
            if (this.popup != null) {
                this.layer.map.removePopup(this.popup);
            }
        }

        if (this.events) {
            this.events.destroy();
        }
        this.events = null;
        
        this.layer = null;
        this.id = null;
        this.lonlat = null;
        this.data = null;
        if (this.marker != null) {
            this.destroyMarker(this.marker);
            this.marker = null;
        }
        if (this.popup != null) {
            this.destroyPopup(this.popup);
            this.popup = null;
        }
    },
    
    /**
     * @returns Whether or not the feature is currently visible on screen
     *           (based on its 'lonlat' property)
     * @type Boolean
     */
    onScreen:function() {
        
        var onScreen = false;
        if ((this.layer != null) && (this.layer.map != null)) {
            var screenBounds = this.layer.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }    
        return onScreen;
    },
    

    /**
     * @returns A Marker Object created from the 'lonlat' and 'icon' properties
     *          set in this.data. If no 'lonlat' is set, returns null. If no
     *          'icon' is set, OpenLayers.Marker() will load the default image.
     *          
     *          Note: this.marker is set to return value
     * 
     * @type OpenLayers.Marker
     */
    createMarker: function() {

        var marker = null;
        
        if (this.lonlat != null) {
            this.marker = new OpenLayers.Marker(this.lonlat, this.data.icon);
        }
        return this.marker;
    },

    /** If user overrides the createMarker() function, s/he should be able
     *   to also specify an alternative function for destroying it
     */
    destroyMarker: function() {
        this.marker.destroy();  
    },

    /**
     * @returns A Popup Object created from the 'lonlat', 'popupSize',
     *          and 'popupContentHTML' properties set in this.data. It uses
     *          this.marker.icon as default anchor. 
     *          
     *          If no 'lonlat' is set, returns null. 
     *          If no this.marker has been created, no anchor is sent.
     * 
     *          Note: this.popup is set to return value
     * 
     * @type OpenLayers.Popup.AnchoredBubble
     */
    createPopup: function() {

        if (this.lonlat != null) {
            
            var id = this.id + "_popup";
            var anchor = (this.marker) ? this.marker.icon : null;

            this.popup = new OpenLayers.Popup.AnchoredBubble(id, 
                                                    this.lonlat,
                                                    this.data.popupSize,
                                                    this.data.popupContentHTML,
                                                    anchor); 
        }        
        return this.popup;
    },

    
    /** As with the marker, if user overrides the createPopup() function, s/he 
     *   should also be able to override the destruction
     */
    destroyPopup: function() {
        this.popup.destroy() 
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Feature"
};
/* ======================================================================    OpenLayers/Geometry/Curve.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * A Curve is a MultiPoint, whose points are assumed to be connected. To 
 * this end, we provide a "getLength()" function, which iterates through 
 * the points, summing the distances between them. 
 *
 * @requires OpenLayers/Geometry/MultiPoint.js
 */
OpenLayers.Geometry.Curve = OpenLayers.Class.create();
OpenLayers.Geometry.Curve.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Geometry.MultiPoint, {

    /**
     * An array of class names representing the types of components that
     * the collection can include.  A null value means the component types
     * are not restricted.
     * @type Array(String)
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * @constructor
     *
     * @param {Array(OpenLayers.Geometry.Point)} points
     */
    initialize: function(points) {
        OpenLayers.Geometry.MultiPoint.prototype.initialize.apply(this, 
                                                                  arguments);
    },
    
    /**
     * @returns The length of the curve
     * @type float
     */
    getLength: function() {
        var length = 0.0;
        if ( this.components && (this.components.length > 1)) {
            for(var i=1; i < this.components.length; i++) {
                length += this.components[i-1].distanceTo(this.components[i]);
            }
        }
        return length;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.Curve"
});
/* ======================================================================    OpenLayers/Layer.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * @requires OpenLayers/Map.js
 */
OpenLayers.Layer = OpenLayers.Class.create();
OpenLayers.Layer.prototype = {

    /** @type String */
    id: null,

    /** @type String */
    name: null,

    /** @type DOMElement */
    div: null,

    /** supported application event types
     * 
     * @type Array */
    EVENT_TYPES: [ 
        "loadstart", "loadend", "loadcancel"],

    /** @type OpenLayers.Events */
    events: null,

    /** This variable is set when the layer is added to the map, via the 
     *  accessor function setMap()
     * 
     * @type OpenLayers.Map */
    map: null,
    
    /** Whether or not the layer is a base layer. This should be set 
     *   individually by all subclasses. 
     *   Default is false
     * 
     * @type Boolean
     */
    isBaseLayer: false,
 
    /** asserts whether or not the layer's images have an alpha channel 
     * 
     * @type boolean */
    alpha: false,

    /** should the layer's name appear in the layer switcher?
     * 
     * @type boolean */
    displayInLayerSwitcher: true,

    /** Whether or not the layer should be displayed in the map
     * 
     * @type Boolean
     */
    visibility: true,

    /** Whether or not the map's current resolution is within this layer's
     *   min/max range -- this is set in map's setCenter() whenever zoom
     *   changes
     * 
     * @type Boolean
     */
    inRange: false,

  // OPTIONS

    /** @type Array */
    options: null,

    /** @type String */
    projection: null,    
    
    /** @type String */
    units: null,

    /** @type Array */
    scales: null,

    /** @type Array */
    resolutions: null,
    
    /** @type OpenLayers.Bounds */
    maxExtent: null,
    
    /** @type OpenLayers.Bounds */
    minExtent: null,
    
    /** @type float */
    maxResolution: null,

    /** @type float */
    minResolution: null,

    /** @type int */
    numZoomLevels: null,
   
    /** @type float */
    minScale: null,
    
    /** @type float */
    maxScale: null,

    /** @type Boolean */
    displayOutsideMaxExtent: false,
    
    
    /**
     * @constructor
     * 
     * @param {String} name
     * @param {Object} options Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, options) {
        //store a copy of the custom options for later cloning
        this.options = OpenLayers.Util.extend(new Object(), options);
        
        //add options to layer
        OpenLayers.Util.extend(this, this.options);

        this.name = name;
        
        this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
                
        if (this.div == null) {
            this.div = OpenLayers.Util.createDiv();
            this.div.style.width = "100%";
            this.div.style.height = "100%";
            this.div.id = this.id;
        }

        this.events = new OpenLayers.Events(this, this.div, this.EVENT_TYPES);
    },
    
    /**
     * Destroy is a destructor: this is to alleviate cyclic references which
     * the Javascript garbage cleaner can not take care of on its own.
     * 
     * @param {Boolean} setNewBaseLayer Should a new baselayer be selected when
     *                                  this has been removed?
     *                                  Default is true
     */
    destroy: function(setNewBaseLayer) {
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }
        if (this.map != null) {
            this.map.removeLayer(this, setNewBaseLayer);
        }
        this.map = null;
        this.name = null;
        this.div = null;
        this.options = null;
        
        this.events.destroy();
        this.events = null;
    },
    
   /**
    * @returns An exact clone of this OpenLayers.Layer
    * @type OpenLayers.Layer
    */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer(this.name, this.options);
        } 
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);
        
        // a cloned layer should never have its map property set
        //  because it has not been added to a map yet. 
        obj.map = null;
        
        return obj;
    },
    
    /** 
     * @param {String} newName
     */
    setName: function(newName) {
        this.name = newName;
        if (this.map != null)
            this.map.events.triggerEvent("changelayer");
    },    
    
   /**
    * @param {Object} newOptions
    */
    addOptions: function (newOptions) {
        
        // update our copy for clone
        OpenLayers.Util.extend(this.options, newOptions);

        // add new options to this
        OpenLayers.Util.extend(this, newOptions);
    },
    
    /**
     * 
     */
    onMapResize: function() {
        //this function can be implemented by subclasses  
    },

    /**
     * @param {OpenLayers.Bounds} bound
     * @param {Boolean} zoomChanged tells when zoom has changed, as layers 
     *                   have to do some init work in that case.
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        var display = this.visibility;
        if (!this.isBaseLayer) {
            display = display && this.inRange;
        }
        this.display(display);
    },

    /** Set the map property for the layer. This is done through an accessor
     *   so that subclasses can override this and take special action once 
     *   they have their map variable set. 
     * 
     *  Here we take care to bring over any of the necessary default properties
     *   from the map. 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        this.map = map;
        
        // grab some essential layer data from the map if it hasn't already
        //  been set
        this.maxExtent = this.maxExtent || this.map.maxExtent;
        this.projection = this.projection || this.map.projection;
        this.units = this.units || this.map.units;
        
        this.initResolutions();
        
        if (!this.isBaseLayer) {
            this.inRange = this.calculateInRange();
        }    
    },
  
    /**
    * @returns Whether or not the layer should be displayed (if in range)
    * @type Boolean
    */
    getVisibility: function() {
        return this.visibility;
    },

    /** Set the visibility flag for the layer and hide/show&redraw accordingly. 
     *   Fire event unless otherwise specified
     * 
     * Note that visibility is no longer simply whether or not the layer's
     *  style.display is set to "block". Now we store a 'visibility' state 
     *  property on the layer class, this allows us to remember whether or not
     *  we *desire* for a layer to be visible. In the case where the map's 
     *  resolution is out of the layer's range, this desire may be subverted.
     *  
     * @param {Boolean} visible Whether or not to display the layer 
     *                          (if in range)
     * @param {Boolean} noEvent
     */
    setVisibility: function(visibility, noEvent) {
        if (visibility != this.visibility) {
            this.visibility = visibility;
            this.display(visibility);
            if (this.map != null) {
                var extent = this.map.getExtent();
                if (extent != null) {
                    this.moveTo(extent, true);
                }
            }
            if ((this.map != null) && 
                ((noEvent == null) || (noEvent == false))) {
                this.map.events.triggerEvent("changelayer");
            }
        }
    },

    /** Hide or show the Layer
     * 
     * @param {Boolean} display
     */
    display: function(display) {
        if (display != (this.div.style.display != "none")) {
            this.div.style.display = (display) ? "block" : "none";
        }
    },

    /**
     * @returns Whether or not the layer is displayable at the current map's
     *          current resolution
     * @type Boolean
     */
    calculateInRange: function() {
        var inRange = false;
        if (this.map) {
            var resolution = this.map.getResolution();
            inRange = ( (resolution >= this.minResolution) &&
                        (resolution <= this.maxResolution) );
        }
        return inRange;
    },

    /** 
     * @param {Boolean} isBaseLayer 
     */
    setIsBaseLayer: function(isBaseLayer) {
        this.isBaseLayer = isBaseLayer;
        if (this.map != null) {
            this.map.events.triggerEvent("changelayer");
        }
    },

  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /********************************************************/
  
    /** This method's responsibility is to set up the 'resolutions' array 
     *   for the layer -- this array is what the layer will use to interface
     *   between the zoom levels of the map and the resolution display of the
     *   layer.
     * 
     *  The user has several options that determine how the array is set up.
     *  
     *  For a detailed explanation, see the following wiki from the 
     *   openlayers.org homepage:
     * 
     *  http://trac.openlayers.org/wiki/SettingZoomLevels
     * 
     * @private
     */
    initResolutions: function() {

        // These are the relevant options which are used for calculating 
        //  resolutions information.
        //
        var props = new Array(
          'projection', 'units',
          'scales', 'resolutions',
          'maxScale', 'minScale', 
          'maxResolution', 'minResolution', 
          'minExtent', 'maxExtent',
          'numZoomLevels', 'maxZoomLevel'
        );

        // First we create a new object where we will store all of the 
        //  resolution-related properties that we find in either the layer's
        //  'options' array or from the map.
        //
        var confProps = new Object();        
        for(var i=0; i < props.length; i++) {
            var property = props[i];
            confProps[property] = this.options[property] || this.map[property];
        }

        // If numZoomLevels hasn't been set and the maxZoomLevel *has*, 
        //  then use maxZoomLevel to calculate numZoomLevels
        //
        if ( (!confProps.numZoomLevels) && (confProps.maxZoomLevel) ) {
            confProps.numZoomLevels = confProps.maxZoomLevel + 1;
        }

        // First off, we take whatever hodge-podge of values we have and 
        //  calculate/distill them down into a resolutions[] array
        //
        if ((confProps.scales != null) || (confProps.resolutions != null)) {
          //preset levels
            if (confProps.scales != null) {
                confProps.resolutions = new Array();
                for(var i = 0; i < confProps.scales.length; i++) {
                    var scale = confProps.scales[i];
                    confProps.resolutions[i] = 
                       OpenLayers.Util.getResolutionFromScale(scale, 
                                                              confProps.units);
                }
            }
            confProps.numZoomLevels = confProps.resolutions.length;

        } else {
          //maxResolution and numZoomLevels based calculation
            
            confProps.resolutions = new Array();
            
            // determine maxResolution
            if (confProps.minScale) {
                confProps.maxResolution = 
                    OpenLayers.Util.getResolutionFromScale(confProps.minScale, 
                                                           confProps.units);
            } else if (confProps.maxResolution == "auto") {
                var viewSize = this.map.getSize();
                var wRes = confProps.maxExtent.getWidth() / viewSize.w;
                var hRes = confProps.maxExtent.getHeight()/ viewSize.h;
                confProps.maxResolution = Math.max(wRes, hRes);
            } 

            // determine minResolution
            if (confProps.maxScale != null) {           
                confProps.minResolution = 
                    OpenLayers.Util.getResolutionFromScale(confProps.maxScale);
            } else if ( (confProps.minResolution == "auto") && 
                        (confProps.minExtent != null) ) {
                var viewSize = this.map.getSize();
                var wRes = confProps.minExtent.getWidth() / viewSize.w;
                var hRes = confProps.minExtent.getHeight()/ viewSize.h;
                confProps.minResolution = Math.max(wRes, hRes);
            } 

            // determine numZoomLevels
            if (confProps.minResolution != null) {
                var ratio = confProps.maxResolution / confProps.minResolution;
                confProps.numZoomLevels = 
                    Math.floor(Math.log(ratio) / Math.log(2)) + 1;
            }
            
            // now we have numZoomLevels and maxResolution, 
            //  we can populate the resolutions array
            for (var i=0; i < confProps.numZoomLevels; i++) {
                var res = confProps.maxResolution / Math.pow(2, i)
                confProps.resolutions.push(res);
            }    
        }
        
        //sort resolutions array ascendingly
        //
        confProps.resolutions.sort( function(a, b) { return(b-a); } );

        // now set our newly calculated values back to the layer 
        //  Note: We specifically do *not* set them to layer.options, which we 
        //        will preserve as it was when we added this layer to the map. 
        //        this way cloned layers reset themselves to new map div 
        //        dimensions)
        //

        this.resolutions = confProps.resolutions;
        this.maxResolution = confProps.resolutions[0];
        var lastIndex = confProps.resolutions.length - 1;
        this.minResolution = confProps.resolutions[lastIndex];
        
        this.scales = new Array();
        for(var i = 0; i < confProps.resolutions.length; i++) {
            this.scales[i] = 
               OpenLayers.Util.getScaleFromResolution(confProps.resolutions[i], 
                                                      confProps.units);
        }
        this.minScale = this.scales[0];
        this.maxScale = this.scales[this.scales.length - 1];
        
        this.numZoomLevels = confProps.numZoomLevels;
    },

    /**
     * @returns The currently selected resolution of the map, taken from the
     *          resolutions array, indexed by current zoom level.
     * @type float
     */
    getResolution: function() {
        var zoom = this.map.getZoom();
        return this.resolutions[zoom];
    },

    /** 
     * @returns A Bounds object which represents the lon/lat bounds of the 
     *          current viewPort.
     * @type OpenLayers.Bounds
     */
    getExtent: function() {
        // just use stock map calculateBounds function -- passing no arguments
        //  means it will user map's current center & resolution
        //
        return this.map.calculateBounds();
    },

    /**
     * @param {OpenLayers.Bounds} bounds
     *
     * @returns The index of the zoomLevel (entry in the resolutions array) 
     *           that still contains the passed-in extent. We do this by 
     *           calculating the ideal resolution for the given exteng (based
     *           on the map size) and then find the smallest resolution that 
     *           is greater than this ideal resolution.
     * @type int
     */
    getZoomForExtent: function(extent) {
        var viewSize = this.map.getSize();
        var idealResolution = Math.max( extent.getWidth()  / viewSize.w,
                                        extent.getHeight() / viewSize.h );

        return this.getZoomForResolution(idealResolution);
    },
    
    /**
     * @param {float} resolution
     *
     * @returns The index of the zoomLevel (entry in the resolutions array) 
     *           that is the smallest resolution that is greater than the 
     *           passed-in resolution.
     * @type int
     */
    getZoomForResolution: function(resolution) {
        
        for(var i=1; i < this.resolutions.length; i++) {
            if ( this.resolutions[i] < resolution) {
                break;
            }
        }
        return (i - 1);
    },
    
    /**
     * @param {OpenLayers.Pixel} viewPortPx
     *
     * @returns An OpenLayers.LonLat which is the passed-in view port
     *          OpenLayers.Pixel, translated into lon/lat by the layer
     * @type OpenLayers.LonLat
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        if (viewPortPx != null) {
            var size = this.map.getSize();
            var center = this.map.getCenter();
            var res  = this.map.getResolution();
        
            var delta_x = viewPortPx.x - (size.w / 2);
            var delta_y = viewPortPx.y - (size.h / 2);
            
            lonlat = new OpenLayers.LonLat(center.lon + delta_x * res ,
                                         center.lat - delta_y * res); 
        }
        return lonlat;
    },

    /**
     * @param {OpenLayers.LonLat} lonlat
     *
     * @returns An OpenLayers.Pixel which is the passed-in OpenLayers.LonLat, 
     *          translated into view port pixels
     * @type OpenLayers.Pixel
     */
    getViewPortPxFromLonLat: function (lonlat) {
        var px = null; 
        if (lonlat != null) {
            var resolution = this.map.getResolution();
            var extent = this.map.getExtent();
            px = new OpenLayers.Pixel(
                           Math.round(1/resolution * (lonlat.lon - extent.left)),
                           Math.round(1/resolution * (extent.top - lonlat.lat))
                           );    
        }
        return px;
    },
    
    /**
     * Sets the opacity for the entire layer (all images)
     * @param {Float} opacity
     */
    setOpacity: function(opacity) {
        this.opacity = opacity;
        for(var i=0; i<this.div.childNodes.length; ++i) {
            var element = this.div.childNodes[i];
            OpenLayers.Util.modifyDOMElement(element, null, null, null, 
                                             null, null, null, opacity);
        }
    },

    /**
    * @param {int} zIdx
    * @private
    */    
    setZIndex: function (zIdx) {
        this.div.style.zIndex = zIdx;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer"
};
/* ======================================================================    OpenLayers/Marker/Box.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Marker.js
 */
OpenLayers.Marker.Box = OpenLayers.Class.create();
OpenLayers.Marker.Box.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Marker, {

    /** @type OpenLayers.Bounds */
    bounds: null,

    /** @type DOMElement */
    div: null,
    
    /** 
     * @constructor
     *
     * @param {OpenLayers.Bounds} bounds
     * @param {String} borderColor
     * @param {int} borderWidth
     */
    initialize: function(bounds, borderColor, borderWidth) {
        this.bounds = bounds;
        this.div    = OpenLayers.Util.createDiv();
        this.div.style.overflow = 'hidden';
        this.events = new OpenLayers.Events(this, this.div, null);
        this.setBorder(borderColor, borderWidth);
    },

    /** Allow the user to change the box's color and border width
     * 
     * @param {String} color Default is "red"
     * @param {int} width Default is 2
     */
    setBorder: function (color, width) {
        if (!color) {
            color = "red";
        }
        if (!width) {
            width = 2;
        }
        this.div.style.border = width + "px solid " + color;
    },
    
    /** 
    * @param {OpenLayers.Pixel} px
    * @param {OpenLayers.Size} sz
    * 
    * @return A new DOM Image with this marker´s icon set at the 
    *         location passed-in
    * @type DOMElement
    */
    draw: function(px, sz) {
        OpenLayers.Util.modifyDOMElement(this.div, null, px, sz);
        return this.div;
    }, 

    /**
     * @returns Whether or not the marker is currently visible on screen.
     * @type Boolean
     */
    onScreen:function() {
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsBounds(this.bounds, true, true);
        }    
        return onScreen;
    },
    
    /** Hide or show the icon
     * 
     * @param {Boolean} display
     */
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Marker.Box"
});

/* ======================================================================    OpenLayers/Control/Navigation.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Control/ZoomBox.js
 * @requires OpenLayers/Control/DragPan.js
 * @requires OpenLayers/Handler/MouseWheel.js
 */
OpenLayers.Control.Navigation = OpenLayers.Class.create();
OpenLayers.Control.Navigation.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type OpenLayers.Control.ZoomBox */
    dragPan: null,

    /** @type OpenLayers.Control.ZoomBox */
    zoomBox: null,

    /** @type OpenLayers.Handler.MouseWheel */
    wheelHandler: null,

    activate: function() {
        this.dragPan.activate();
        this.wheelHandler.activate();
        this.zoomBox.activate();
        return OpenLayers.Control.prototype.activate.apply(this,arguments);
    },

    deactivate: function() {
        this.zoomBox.deactivate();
        this.dragPan.deactivate();
        this.wheelHandler.deactivate();
        return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
    },
    
    draw: function() {
        this.map.events.register( "dblclick", this, this.defaultDblClick );
        this.dragPan = new OpenLayers.Control.DragPan({map: this.map});
        this.zoomBox = new OpenLayers.Control.ZoomBox(
                    {map: this.map, keyMask: OpenLayers.Handler.MOD_SHIFT});
        this.dragPan.draw();
        this.zoomBox.draw();
        this.wheelHandler = new OpenLayers.Handler.MouseWheel(
                                    this, {"up"  : this.wheelUp,
                                           "down": this.wheelDown} );
        this.activate();
    },

    /**
    * @param {Event} evt
    */
    defaultDblClick: function (evt) {
        var newCenter = this.map.getLonLatFromViewPortPx( evt.xy ); 
        this.map.setCenter(newCenter, this.map.zoom + 1);
        OpenLayers.Event.stop(evt);
        return false;
    },

    wheelChange: function(evt, deltaZ) {
        var newZoom = this.map.getZoom() + deltaZ;
        if (!this.map.isValidZoomLevel(newZoom)) return;

        var size    = this.map.getSize();
        var deltaX  = size.w/2 - evt.xy.x;
        var deltaY  = evt.xy.y - size.h/2;
        var newRes  = this.map.baseLayer.resolutions[newZoom];
        var zoomPoint = this.map.getLonLatFromPixel(evt.xy);
        var newCenter = new OpenLayers.LonLat(
                            zoomPoint.lon + deltaX * newRes,
                            zoomPoint.lat + deltaY * newRes );
        this.map.setCenter( newCenter, newZoom );
    },

    /** User spun scroll wheel up
     * 
     */
    wheelUp: function(evt) {
        this.wheelChange(evt, 1);
    },

    /** User spun scroll wheel down
     * 
     */
    wheelDown: function(evt) {
        this.wheelChange(evt, -1);
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.Navigation"
});
/* ======================================================================    OpenLayers/Feature/Vector.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

// TRASH THIS
OpenLayers.State = {
    /** states */
    UNKNOWN: 'Unknown',
    INSERT: 'Insert',
    UPDATE: 'Update',
    DELETE: 'Delete'
}

/**
 * @class
 * 
 * @requires OpenLayers/Feature.js
 * @requires OpenLayers/Util.js
 */
OpenLayers.Feature.Vector = OpenLayers.Class.create();
OpenLayers.Feature.Vector.prototype =
  OpenLayers.Class.inherit( OpenLayers.Feature, {

    /** @type String */
    fid: null,
    
    /** @type OpenLayers.Geometry */
    geometry:null,

    /** @type array */
    attributes: {},

    /** @type strinng */
    state: null,
    
    /** @type Object */
    style: null,
    
    /** 
     * Create a vector feature. 
     * @constructor
     * 
     * @param {OpenLayers.Geometry} geometry
     * @param {Object} data
     */
    initialize: function(geometry, data, style) {
        OpenLayers.Feature.prototype.initialize.apply(this, [null, null, data]);
        this.lonlat = null;
        this.setGeometry(geometry);
        this.state = null;
        if (data) {
            OpenLayers.Util.extend(this.attributes, data);
        }    
        this.style = style ? style : OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
    },
    
        
   /**
    * @returns An exact clone of this OpenLayers.Feature
    * @type OpenLayers.Feature
    */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Feature(null, this.geometry.clone(), this.data);
        } 
        
        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(obj, this);
        
        return obj;
    },

    /**
     * 
     */
    destroy: function() {
        this.geometry = null;
        OpenLayers.Feature.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * HACK - we need to rewrite this for non-point geometry
     * @returns null - we need to rewrite this for non-point geometry
     * @type Boolean
     */
    onScreen:function() {
        return null;
    },
    
    /**
     *
     * HACK - we need to decide if all vector features should be able to
     * create markers
     * 
     * @returns null
     * 
     * @type OpenLayers.Marker
     */
    createMarker: function() {
        return null;
    },

    /**
     * HACK - we need to decide if all vector features should be able to
     * delete markers
     * 
     * If user overrides the createMarker() function, s/he should be able
     *   to also specify an alternative function for destroying it
     */
    destroyMarker: function() {
        // pass
    },

    /**
     * HACK - we need to decide if all vector features should be able to
     * create popups
     * 
     * @returns null
     */
    createPopup: function() {
        return null;
    },

    /**
     * Set a feature id to the feature
     *
     * @param {String} feature id to set
     */
    setFid: function(fid) {
        this.fid = fid;
    },

    /**
     * Set a geometry to the feature
     *
     * @param {OpenLayers.Geometry} geometry to set
     * @param {Boolean} recurse Recursively set feature (for components)
     */
    setGeometry: function(geometry, recurse) {
        if(geometry) {
            this.geometry = geometry;
            this.geometry.feature = this;
            if (recurse != false) {
                this._setGeometryFeatureReference(this.geometry, this);
            }    
        }
    },
    
    /**
     * Sets recursively the reference to the feature in the geometry
     *
     * @param {OpenLayers.Geometry}
     * @param {OpenLayers.Feature}
     */
    _setGeometryFeatureReference: function(geometry, feature) {
        geometry.feature = feature;
        if (geometry.components) {
            for (var i = 0; i < geometry.components.length; i++) {
                this._setGeometryFeatureReference(geometry.components[i], feature);
            }
        }
    },
    
    /**
     * Adds attributes an attributes object to the feature.
     * (should not be in geometry but in feature class)
     *
     * @param {Attributes} attributes
     */
    setAttributes: function(attributes) {
        this.attributes=attributes;
    },

    /**
     * @param {OpenLayers.LonLat} lonlat
     * @param {float} toleranceLon Optional tolerance in Geometric Coords
     * @param {float} toleranceLat Optional tolerance in Geographic Coords
     * 
     * @returns Whether or not the feature is at the specified location
     * @type Boolean
     */
    atPoint: function(lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        if(this.geometry) {
            atPoint = this.geometry.atPoint(lonlat, toleranceLon, 
                                                    toleranceLat);
        }
        return atPoint;
    },

    /**
     *
     * HACK - we need to decide if all vector features should be able to
     * delete popups
     */
    destroyPopup: function() {
        // pass
    },
    
    /**
     * Sets the new state
     * @param {String} state
     */
    toState: function(state) {
        if (state == OpenLayers.State.UPDATE) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.DELETE:
                    this.state = state;
                    break;
                case OpenLayers.State.UPDATE:
                case OpenLayers.State.INSERT:
                    break;
            }
        } else if (state == OpenLayers.State.INSERT) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                    break;
                default:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.DELETE) {
            switch (this.state) {
                case OpenLayers.State.INSERT:
                    // the feature should be destroyed
                    break;
                case OpenLayers.State.DELETE:
                    break;
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.UPDATE:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.UNKNOWN) {
            this.state = state;
        }
    },
    
    destroy: function() {
    
    },
    
    CLASS_NAME: "OpenLayers.Feature.Vector"
});


// styles for feature rendering 
OpenLayers.Feature.Vector.style = {
    'default': {
        fillColor: "#ee9900",
        fillOpacity: 0.4, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#ee9900",
        strokeOpacity: 1,
        strokeWidth: 1,
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted"
    },
    'select': {
        fillColor: "blue",
        fillOpacity: 0.4, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWidth: 2,
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted"
    },
    'temporary': {
        fillColor: "yellow",
        fillOpacity: 0.2, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "yellow",
        strokeOpacity: 1,
        strokeWidth: 4,
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted"
    }
};    
/* ======================================================================    OpenLayers/Feature/WFS.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Feature.js
 */
OpenLayers.Feature.WFS = OpenLayers.Class.create();
OpenLayers.Feature.WFS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Feature, {
      
    /** 
     * @constructor
     * 
     * @param {OpenLayers.Layer} layer
     * @param {XMLNode} xmlNode
     */
    initialize: function(layer, xmlNode) {
        var newArguments = arguments;
        var data = this.processXMLNode(xmlNode);
        newArguments = new Array(layer, data.lonlat, data)
        OpenLayers.Feature.prototype.initialize.apply(this, newArguments);
        this.createMarker();
        this.layer.addMarker(this.marker);
    },
    
    destroy: function() {
        if (this.marker != null) {
            this.layer.removeMarker(this.marker);  
        }
        OpenLayers.Feature.prototype.destroy.apply(this, arguments);
    },

    /**
     * @param {XMLNode} xmlNode
     * 
     * @returns Data Object with 'id', 'lonlat', and private properties set
     * @type Object
     */
    processXMLNode: function(xmlNode) {
        //this should be overridden by subclasses
        // must return an Object with 'id' and 'lonlat' values set
        var point = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, "http://www.opengis.net/gml", "gml", "Point");
        var text  = OpenLayers.Util.getXmlNodeValue(OpenLayers.Ajax.getElementsByTagNameNS(point[0], "http://www.opengis.net/gml","gml", "coordinates")[0]);
        var floats = text.split(",");
        return {lonlat: new OpenLayers.LonLat(parseFloat(floats[0]),
                                              parseFloat(floats[1])),
                id: null};

    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Feature.WFS"
});
  
  
  
  

/* ======================================================================    OpenLayers/Geometry/LineString.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * A LineString is a Curve which, once two points have been added to it, can 
 * never be less than two points long.
 *
 * @requires OpenLayers/Geometry/Curve.js
 */
OpenLayers.Geometry.LineString = OpenLayers.Class.create();
OpenLayers.Geometry.LineString.prototype =
    OpenLayers.Class.inherit(OpenLayers.Geometry.Curve, {

    /**
     * @constructor
     * 
     * @param {Array(OpenLayers.Geometry.Point)} points
     */
    initialize: function(points) {
        OpenLayers.Geometry.Curve.prototype.initialize.apply(this, arguments);        
    },

    /** Only allows removal of a point if there are three or more points in 
     *   the linestring. (otherwise the result would be just a single point)
     * 
     * @param {OpenLayers.Geometry.Point} point
     */
    removeComponent: function(point) {
        if ( this.components && (this.components.length > 2)) {
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                                  arguments);
        }
    },
       
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.LineString"
});
/* ======================================================================    OpenLayers/Layer/Canvas.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer.js
 */
OpenLayers.Layer.Canvas = OpenLayers.Class.create();
OpenLayers.Layer.Canvas.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer, {
    
    /** Canvas layer is never a base layer. 
     * 
     * @type Boolean
     */
    isBaseLayer: false,
    isFixed: true, 
    /** internal marker list
    * @type Array(OpenLayers.Marker) */
    canvas: null,

    lines: new Array(),
    
    /**
    * @constructor
    *
    * @param {String} name
    * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * 
     */
    destroy: function() {
        // xxx actually destroy the canvas to scavenge ram?
        canvas = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },

    
    /** 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);

        this.redraw();
    },

    setStrokeColor: function(color) {
        var ctx = this.canvas.getContext("2d");
        ctx.strokeStyle = color;
    },
    setStrokeWidth: function(width) {
        var ctx = this.canvas.getContext("2d");
        ctx.lineWidth = width;
    },
    setAlpha: function(alpha) {
        var ctx = this.canvas.getContext("2d");
        ctx.globalAlpha = alpha;
    },
    /**
     * 
     */
    clearCanvas: function() {
        if(this.canvas != null) {
          this.canvas.getContext("2d").clearRect(0,0,this.map.getSize().w, this.map.getSize().h);
          // xxx use real width and height
        }
    },

    drawLine: function(start, end) {
        var ctx = this.canvas.getContext("2d");
        this.addLine(start, end);
        this.lines.push(new Array(start,end, ctx.strokeStyle, ctx.lineWidth, ctx.globalAlpha));
    },
    addLine: function(start, end) {
        var ctx = this.canvas.getContext("2d");
        var startpx = this.map.getPixelFromLonLat(start);
        var endpx = this.map.getPixelFromLonLat(end);
        ctx.beginPath();
        ctx.moveTo(startpx.x, startpx.y);
        ctx.lineTo(endpx.x, endpx.y);
        ctx.closePath();
        ctx.stroke();
    },
    
    /** clear all the marker div's from the layer and then redraw all of them.
    *    Use the map to recalculate new placement of markers.
    */
    redraw: function() {
        // xxx rebuild the canvas if smaller than the view
        // xxx may wish to overside the canvas with overflow=hidden by default
        if(!this.canvas) {
          this.canvas = document.createElement("CANVAS");
          this.canvas.setAttribute("width",this.map.getSize().w);
          this.canvas.setAttribute("height",this.map.getSize().h);
          this.div.appendChild(this.canvas);
        } else {
            this.clearCanvas();
        }
        for(var i=0; i < this.lines.length; i++) {
            this.setStrokeColor(this.lines[i][2]);
            this.setStrokeWidth(this.lines[i][3]);
            this.setAlpha(this.lines[i][4]);
            this.addLine(this.lines[i][0], this.lines[i][1]);
        }    
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Canvas"
});
/* ======================================================================    OpenLayers/Layer/EventPane.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer.js
 * @requires OpenLayers/Util.js
 */
OpenLayers.Layer.EventPane = OpenLayers.Class.create();
OpenLayers.Layer.EventPane.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer, {

    /** EventPaned layers are always base layers, by necessity.
     * 
     * @type Boolean */
    isBaseLayer: true,

    /** EventPaned layers are fixed by default.
     * 
     * @type Boolean */
    isFixed: true,

    /** @type DOMElement */
    pane: null,


    /** This is the object which will be used to load the 3rd party library
     *   in the case of the google layer, this will be of type GMap, 
     *   in the case of the ve layer, this will be of type VEMap
     * 
     * @type Object */
    mapObject: null,


    /**
     * @constructor
     * 
     * @param {String} name
     * @param {Object} options Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        if (this.pane == null) {
            this.pane = OpenLayers.Util.createDiv(this.div.id + "_EventPane");
        }
    },
    
    /**
     * 
     */
    destroy: function() {
        this.mapObject = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments); 
    },

    
    /** Set the map property for the layer. This is done through an accessor
     *   so that subclasses can override this and take special action once 
     *   they have their map variable set. 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
        
        this.pane.style.zIndex = parseInt(this.div.style.zIndex) + 1;
        this.pane.style.display = this.div.style.display;
        this.pane.style.width="100%";
        this.pane.style.height="100%";
        if (/MSIE/.test(navigator.userAgent)) {
          this.pane.style.background = "url("+OpenLayers.Util.getImagesLocation()+"blank.gif)";
        }

        if (this.isFixed) {
            this.map.viewPortDiv.appendChild(this.pane);
        } else {
            this.map.layerContainerDiv.appendChild(this.pane);
        }

        // once our layer has been added to the map, we can load it
        this.loadMapObject();
    
        // if map didn't load, display warning
        if (this.mapObject == null) {
            this.loadWarningMessage();
        }
    },
  
    /** If we can't load the GMap, then display an error message to the 
     *   user and tell them where to go for help.
     * 
     * @private
     * 
     */
    loadWarningMessage:function() {

        this.div.style.backgroundColor = "darkblue";

        var viewSize = this.map.getSize();
        
        msgW = Math.min(viewSize.w, 300);
        msgH = Math.min(viewSize.h, 200);
        var size = new OpenLayers.Size(msgW, msgH);

        var centerPx = new OpenLayers.Pixel(viewSize.w/2, viewSize.h/2);

        var topLeft = centerPx.add(-size.w/2, -size.h/2);            

        var div = OpenLayers.Util.createDiv(this.name + "_warning", 
                                            topLeft, 
                                            size,
                                            null,
                                            null,
                                            null,
                                            "auto");

        div.style.padding = "7px";
        div.style.backgroundColor = "yellow";

        div.innerHTML = this.getWarningHTML();
        this.div.appendChild(div);
    },
  
  
    /** 
     * @param {Boolean} display
     */
    display: function(display) {
        OpenLayers.Layer.prototype.display.apply(this, arguments);
        this.pane.style.display = this.div.style.display;
    },
  
    /**
     * @param {int} zIndex
     */
    setZIndex: function (zIndex) {
        OpenLayers.Layer.prototype.setZIndex.apply(this, arguments);
        this.pane.style.zIndex = parseInt(this.div.style.zIndex) + 1;
    },

    /** 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);

        if (this.mapObject != null) {

            var newCenter = this.map.getCenter();
            var newZoom = this.map.getZoom();

            if (newCenter != null) {

                var moOldCenter = this.getMapObjectCenter();
                var oldCenter = this.getOLLonLatFromMapObjectLonLat(moOldCenter);

                var moOldZoom = this.getMapObjectZoom();
                var oldZoom= this.getOLZoomFromMapObjectZoom(moOldZoom);

                if ( !(newCenter.equals(oldCenter)) || 
                     !(newZoom == oldZoom) ) {

                    var center = this.getMapObjectLonLatFromOLLonLat(newCenter);
                    var zoom = this.getMapObjectZoomFromOLZoom(newZoom);
                    this.setMapObjectCenter(center, zoom);
                }
            }
        }
    },


  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /********************************************************/

    /**
     * @param {OpenLayers.Pixel} viewPortPx
     *
     * @returns An OpenLayers.LonLat which is the passed-in view port
     *          OpenLayers.Pixel, translated into lon/lat by GMAPS
     *          If gmap is not loaded or not centered, returns null
     * @type OpenLayers.LonLat
     */
    getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        if ( (this.mapObject != null) && 
             (this.getMapObjectCenter() != null) ) {
            var moPixel = this.getMapObjectPixelFromOLPixel(viewPortPx);
            var moLonLat = this.getMapObjectLonLatFromMapObjectPixel(moPixel)
            lonlat = this.getOLLonLatFromMapObjectLonLat(moLonLat);
        }
        return lonlat;
    },

 
    /**
     * @param {OpenLayers.LonLat} lonlat
     *
     * @returns An OpenLayers.Pixel which is the passed-in OpenLayers.LonLat, 
     *          translated into view port pixels BY GMAPS
     *          If gmap is not loaded or not centered, returns null
     * @type OpenLayers.Pixel
     */
    getViewPortPxFromLonLat: function (lonlat) {
        var viewPortPx = null;
        if ( (this.mapObject != null) && 
             (this.getMapObjectCenter() != null) ) {

            var moLonLat = this.getMapObjectLonLatFromOLLonLat(lonlat);
            var moPixel = this.getMapObjectPixelFromMapObjectLonLat(moLonLat)
        
            viewPortPx = this.getOLPixelFromMapObjectPixel(moPixel);
        }
        return viewPortPx;
    },

  /********************************************************/
  /*                                                      */
  /*               Translation Functions                  */
  /*                                                      */
  /*   The following functions translate Map Object and   */
  /*            OL formats for Pixel, LonLat              */
  /*                                                      */
  /********************************************************/

  //
  // TRANSLATION: MapObject LatLng <-> OpenLayers.LonLat
  //

    /**
     * @param {Object} moLonLat
     * 
     * @returns An OpenLayers.LonLat, translated from the passed in 
     *          MapObject LonLat
     *          Returns null if null value is passed in
     * @type OpenLayers.LonLat
     */
    getOLLonLatFromMapObjectLonLat: function(moLonLat) {
        var olLonLat = null;
        if (moLonLat != null) {
            var lon = this.getLongitudeFromMapObjectLonLat(moLonLat);
            var lat = this.getLatitudeFromMapObjectLonLat(moLonLat);
            olLonLat = new OpenLayers.LonLat(lon, lat);
        }
        return olLonLat;
    },

    /**
     * @param {OpenLayers.LonLat} olLonLat
     * 
     * @returns A MapObject LonLat, translated from the passed in 
     *          OpenLayers.LonLat
     *          Returns null if null value is passed in
     * @type Object
     */
    getMapObjectLonLatFromOLLonLat: function(olLonLat) {
        var moLatLng = null;
        if (olLonLat != null) {
            moLatLng = this.getMapObjectLonLatFromLonLat(olLonLat.lon,
                                                         olLonLat.lat);
        }
        return moLatLng;
    },


  //
  // TRANSLATION: MapObject Pixel <-> OpenLayers.Pixel
  //

    /**
     * @param {Object} moPixel
     * 
     * @returns An OpenLayers.Pixel, translated from the passed in 
     *          MapObject Pixel
     *          Returns null if null value is passed in
     * @type OpenLayers.Pixel
     */
    getOLPixelFromMapObjectPixel: function(moPixel) {
        var olPixel = null;
        if (moPixel != null) {
            var x = this.getXFromMapObjectPixel(moPixel);
            var y = this.getYFromMapObjectPixel(moPixel);
            olPixel = new OpenLayers.Pixel(x, y);
        }
        return olPixel;
    },

    /**
     * @param {OpenLayers.Pixel} olPixel
     * 
     * @returns A MapObject Pixel, translated from the passed in 
     *          OpenLayers.Pixel
     *          Returns null if null value is passed in
     * @type Object
     */
    getMapObjectPixelFromOLPixel: function(olPixel) {
        var moPixel = null;
        if (olPixel != null) {
            moPixel = this.getMapObjectPixelFromXY(olPixel.x, olPixel.y);
        }
        return moPixel;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.EventPane"
});
/* ======================================================================    OpenLayers/Layer/FixedZoomLevels.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */




/** 
 *   Some Layers will already have established zoom levels (like google 
 *    or ve). Instead of trying to determine them and populate a resolutions[]
 *    Array with those values, we will hijack the resolution functionality
 *    here.
 * 
 *   When you subclass FixedZoomLevels: 
 * 
 *   The initResolutions() call gets nullified, meaning no resolutions[] array 
 *    is set up. Which would be a big problem getResolution() in Layer, since 
 *    it merely takes map.zoom and indexes into resolutions[]... but....
 * 
 *   The getResolution() call is also overridden. Instead of using the 
 *    resolutions[] array, we simply calculate the current resolution based
 *    on the current extent and the current map size. But how will we be able
 *    to calculate the current extent without knowing the resolution...?
 *  
 *   The getExtent() function is also overridden. Instead of calculating extent
 *    based on the center point and the current resolution, we instead 
 *    calculate the extent by getting the lonlats at the top-left and 
 *    bottom-right by using the getLonLatFromViewPortPx() translation function,
 *    taken from the pixel locations (0,0) and the size of the map. But how 
 *    will we be able to do lonlat-px translation without resolution....?
 * 
 *   The getZoomForResolution() method is overridden. Instead of indexing into
 *    the resolutions[] array, we call OpenLayers.Layer.getExent(), passing in
 *    the desired resolution. With this extent, we then call getZoomForExtent() 
 * 
 * 
 *   Whenever you implement a layer using OpenLayers.Layer.FixedZoomLevels, 
 *    it is your responsibility to provide the following three functions:
 * 
 *   - getLonLatFromViewPortPx()
 *   - getViewPortPxFromLonLat()
 *   - getZoomForExtent()
 * 
 *  ...those three functions should generally be provided by any reasonable 
 *  API that you might be working from.
 * 
 * @requires OpenLayers/Layer.js
 * @class
 */
OpenLayers.Layer.FixedZoomLevels = OpenLayers.Class.create();
OpenLayers.Layer.FixedZoomLevels.prototype = {
      
  /********************************************************/
  /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /*    The following functions must all be implemented   */
  /*                  by all base layers                  */
  /*                                                      */
  /********************************************************/
    
    /**
     * @constructor
     */
    initialize: function() {
        //this class is only just to add the following functions... 
        // nothing to actually do here... but it is probably a good
        // idea to have layers that use these functions call this 
        // inititalize() anyways, in case at some point we decide we 
        // do want to put some functionality or state in here. 
    },
    
    /**
     * 
     */
    initResolutions: function() {

        var props = new Array('minZoomLevel', 'maxZoomLevel', 'numZoomLevels');
          
        for(var i=0; i < props.length; i++) {
            var property = props[i];
            this[property] = (this.options[property] != null)  
                                     ? this.options[property] 
                                     : this.map[property];
        }

        if ( (this.minZoomLevel == null) ||
             (this.minZoomLevel < this.MIN_ZOOM_LEVEL) ){
            this.minZoomLevel = this.MIN_ZOOM_LEVEL;
        }        

        var limitZoomLevels = this.MAX_ZOOM_LEVEL - this.minZoomLevel + 1;
        if (this.numZoomLevels != null) {
            this.numZoomLevels = Math.min(this.numZoomLevels, limitZoomLevels);
        } else {
            if (this.maxZoomLevel != null) {
                var zoomDiff = this.maxZoomLevel - this.minZoomLevel + 1;
                this.numZoomLevels = Math.min(zoomDiff, limitZoomLevels);
            } else {
                this.numZoomLevels = limitZoomLevels;
            }
        }

        this.maxZoomLevel = this.minZoomLevel + this.numZoomLevels - 1;

        if (this.RESOLUTIONS != null) {
            var resolutionsIndex = 0;
            this.resolutions = [];
            for(var i= this.minZoomLevel; i < this.numZoomLevels; i++) {
                this.resolutions[resolutionsIndex++] = this.RESOLUTIONS[i];            
            }
        }        
    },
    
    /** 
     * @returns Degrees per Pixel
     * @type float
     */
    getResolution: function() {

        if (this.resolutions != null) {
            return OpenLayers.Layer.prototype.getResolution.apply(this, arguments);
        } else {
            var resolution = null;
            
            var viewSize = this.map.getSize();
            var extent = this.getExtent();
            
            if ((viewSize != null) && (extent != null)) {
                resolution = Math.max( extent.getWidth()  / viewSize.w,
                                       extent.getHeight() / viewSize.h );
            }
            return resolution;
        }
     },

    /** Calculates using px-> lonlat translation functions on tl and br 
     *   corners of viewport
     * 
     * @returns A Bounds object which represents the lon/lat bounds of the 
     *          current viewPort.
     * @type OpenLayers.Bounds
     */
    getExtent: function () {
        var extent = null;
        
        
        var size = this.map.getSize();
        
        var tlPx = new OpenLayers.Pixel(0,0);
        var tlLL = this.getLonLatFromViewPortPx(tlPx);

        var brPx = new OpenLayers.Pixel(size.w, size.h);
        var brLL = this.getLonLatFromViewPortPx(brPx);
        
        if ((tlLL != null) && (brLL != null)) {
            extent = new OpenLayers.Bounds(tlLL.lon, 
                                       brLL.lat, 
                                       brLL.lon, 
                                       tlLL.lat);
        }

        return extent;
    },

    /**
     * @param {float} resolution
     *
     * @returns A suitable zoom level for the specified resolution.
     *          If no baselayer is set, returns null.
     * @type int
     */
    getZoomForResolution: function(resolution) {
      
        if (this.resolutions != null) {
            return OpenLayers.Layer.prototype.getZoomForResolution.apply(this, arguments);
        } else {
            var extent = OpenLayers.Layer.prototype.getExtent.apply(this, 
                                                                    [resolution]);
                                                                    
            return this.getZoomForExtent(extent);
        }
    },



    
  /********************************************************/
  /*                                                      */
  /*             Translation Functions                    */
  /*                                                      */
  /*    The following functions translate GMaps and OL    */ 
  /*     formats for Pixel, LonLat, Bounds, and Zoom      */
  /*                                                      */
  /********************************************************/


  //
  // TRANSLATION: MapObject Zoom <-> OpenLayers Zoom
  //
  
    /**
     * @param {int} gZoom
     * 
     * @returns An OpenLayers Zoom level, translated from the passed in gZoom
     *          Returns null if null value is passed in
     * @type int
     */
    getOLZoomFromMapObjectZoom: function(moZoom) {
        var zoom = null;
        if (moZoom != null) {
            zoom = moZoom - this.minZoomLevel;
        }
        return zoom;
    },
    
    /**
     * @param {int} olZoom
     * 
     * @returns A MapObject level, translated from the passed in olZoom
     *          Returns null if null value is passed in
     * @type int
     */
    getMapObjectZoomFromOLZoom: function(olZoom) {
        var zoom = null; 
        if (olZoom != null) {
            zoom = olZoom + this.minZoomLevel;
        }
        return zoom;
    },


    /** @final @type String */
    CLASS_NAME: "FixedZoomLevels.js"
};

/* ======================================================================    OpenLayers/Layer/HTTPRequest.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer.js
 */
OpenLayers.Layer.HTTPRequest = OpenLayers.Class.create();
OpenLayers.Layer.HTTPRequest.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer, {

    /** Used to hash URL param strings for multi-WMS server selection.
     * Set to the Golden Ratio per Knuth's recommendation.
     *
     * @type Numeric
     * @private
     */
    URL_HASH_FACTOR: (Math.sqrt(5) - 1) / 2,

    /** This is either an array of url strings or a single url string. 
     * 
     * @type Array(String) or String */
    url: null,

    /** Hashtable of key/value parameters
     * 
     * @type Object */
    params: null,
    
    /** Whether layer should reproject itself based on base layer locations.
     *  This allows reprojection onto commercial layers. Default is false:
     *  Most layers can't reproject, but layers which can create non-square
     *  geographic pixels can, like WMS. 
     *
     * @type Boolean 
     */
    reproject: false,

    /**
     * @constructor
     * 
     * @param {String} name
     * @param {Array(String) or String} url
     * @param {Object} params
     * @param {Object} options Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        var newArguments = arguments;
        newArguments = [name, options];
        OpenLayers.Layer.prototype.initialize.apply(this, newArguments);
        this.url = url;
        this.params = OpenLayers.Util.extend( new Object(), params);
    },

    /**
     * 
     */
    destroy: function() {
        this.url = null;
        this.params = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments); 
    },
    
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.HTTPRequest
     * @type OpenLayers.Layer.HTTPRequest
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.HTTPRequest(this.name,
                                                   this.url,
                                                   this.params,
                                                   this.options);
        }
        
        //get all additions from superclasses
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        
        return obj;
    },

    /** 
     * @param {String} newUrl
     */
    setUrl: function(newUrl) {
        this.url = newUrl;
    },

    /**
     * @param {Object} newParams
     */
    mergeNewParams:function(newParams) {
        this.params = OpenLayers.Util.extend(this.params, newParams);
    },
    
    /**
     * selectUrl() implements the standard floating-point multiplicative
     * hash function described by Knuth, and hashes the contents of the 
     * given param string into a float between 0 and 1. This float is then
     * scaled to the size of the provided urls array, and used to select
     * a URL.
     *
     * @param {String} paramString
     * @param {Array(String)} urls
     * 
     * @returns An entry from the urls array, deterministically selected based
     *           on the paramString.
     * @type String
     * 
     */
    selectUrl: function(paramString, urls) {
        var product = 1;
        for (var i = 0; i < paramString.length; i++) { 
            product *= paramString.charCodeAt(i) * this.URL_HASH_FACTOR; 
            product -= Math.floor(product); 
        }
        return urls[Math.floor(product * urls.length)];
    },

    /** combine url with layer's params and these newParams. 
     *   
     *    does checking on the serverPath variable, allowing for cases when it 
     *     is supplied with trailing ? or &, as well as cases where not. 
     *
     *    return in formatted string like this:
     *        "server?key1=value1&key2=value2&key3=value3"
     * 
     * WARNING: The altUrl parameter is deprecated and will be removed in 3.0.
     *
     * @param {Object} newParams
     * @param {String} altUrl Use this as the url instead of the layer's url
     *   
     * 
     * @type String
     */
    getFullRequestString:function(newParams, altUrl) {

        // if not altUrl passed in, use layer's url
        var url = altUrl || this.url;
        
        // create a new params hashtable with all the layer params and the 
        // new params together. then convert to string
        var allParams = OpenLayers.Util.extend(new Object(), this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        
        // if url is not a string, it should be an array of strings, 
        // in which case we will deterministically select one of them in 
        // order to evenly distribute requests to different urls.
        //
        if (url instanceof Array) {
            url = this.selectUrl(paramsString, url);
        }   
 
        // ignore parameters that are already in the url search string
        var urlParams = 
            OpenLayers.Util.upperCaseObject(OpenLayers.Util.getArgs(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        paramsString = OpenLayers.Util.getParameterString(allParams);
        
        // requestString always starts with url
        var requestString = url;        
        
        if (paramsString != "") {
            var lastServerChar = url.charAt(url.length - 1);
            if ((lastServerChar == "&") || (lastServerChar == "?")) {
                requestString += paramsString;
            } else {
                if (url.indexOf('?') == -1) {
                    //serverPath has no ? -- add one
                    requestString += '?' + paramsString;
                } else {
                    //serverPath contains ?, so must already have paramsString at the end
                    requestString += '&' + paramsString;
                }
            }
        }
        return requestString;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.HTTPRequest"
});
/* ======================================================================    OpenLayers/Layer/Image.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
 
/**
 * @fileoverview Image Layer
 * @author Tim Schaub
 */

/**
 * @class
 * 
 * @requires OpenLayers/Layer.js
 */
OpenLayers.Layer.Image = OpenLayers.Class.create();
OpenLayers.Layer.Image.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Layer, {

    /** By default, Layer.Image will be a baselayer
     * 
     * @type Boolean */
    isBaseLayer: true,
    
    /** @type String */
    url: null,

    /** @type OpenLayers.Bounds */
    extent: null,
    
    /** @type OpenLayers.Size */
    size: null,

    /** @type OpenLayers.Tile.Image */
    tile: null,

    /** The ratio of height/width represented by a single pixel in the graphic
     * 
     * @type Float */
    aspectRatio: null,

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} url Relative or absolute path to the image
    * @param {OpenLayers.Bounds} extent The extent represented by the image
    * @param {OpenLayers.Size} size The size (in pixels) of the image
    * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, url, extent, size, options) {
        this.url = url;
        this.extent = extent;
        this.size = size;
        OpenLayers.Layer.prototype.initialize.apply(this, [name, options]);

        this.aspectRatio = (this.extent.getHeight() / this.size.h) /
                           (this.extent.getWidth() / this.size.w);
    },    

    /**
     * 
     */
    destroy: function() {
        this.tile.destroy();
        this.tile = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.Image
     * @type OpenLayers.Layer.Image
     */
    clone: function(obj) {
        
        if(obj == null) {
            obj = new OpenLayers.Layer.Image(this.name,
                                               this.url,
                                               this.extent,
                                               this.size,
                                               this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    /**
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        // If nothing to do with resolutions has been set, assume a single
        //  resolution determined by extent/size
        if( this.options.maxResolution == null ) {
            this.options.maxResolution = this.extent.getWidth() / this.size.w;
        }
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
    },

    /** Create the tile for the image or resize it for the new resolution
     * 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);

        var firstRendering = (this.tile == null);

        if(zoomChanged || firstRendering) {

            //determine new tile size
            var tileWidth = this.extent.getWidth() / this.map.getResolution();
            var tileHeight = this.extent.getHeight() /
                             (this.map.getResolution() * this.aspectRatio);
            var tileSize = new OpenLayers.Size(tileWidth, tileHeight);
            
            //determine new position (upper left corner of new bounds)
            var ul = new OpenLayers.LonLat(this.extent.left, this.extent.top);
            var ulPx = this.map.getLayerPxFromLonLat(ul);

            if(firstRendering) {
                //create the new tile
                this.tile = new OpenLayers.Tile.Image(this, ulPx, this.extent, 
                                                      this.url, tileSize);
            } else {
                //just resize the tile and set it's new position
                this.tile.size = tileSize.clone();
                this.tile.position = ulPx.clone();
            }
            this.tile.draw();
        }
    }, 
    
    /**
     * @param {String} newUrl
     */
    setUrl: function(newUrl) {
        this.url = newUrl;
        this.draw();
    },

    /** The url we return is always the same (the image itself never changes)
     *   so we can ignore the bounds parameter (it will always be the same, 
     *   anyways) 
     * 
     * @param {OpenLayers.Bounds} bounds
     */
    getURL: function(bounds) {
        return this.url;
    },
        
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Image"
});
/* ======================================================================    OpenLayers/Layer/Markers.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer.js
 */
OpenLayers.Layer.Markers = OpenLayers.Class.create();
OpenLayers.Layer.Markers.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer, {
    
    /** Markers layer is never a base layer. 
     * 
     * @type Boolean
     */
    isBaseLayer: false,
    
    /** internal marker list
    * @type Array(OpenLayers.Marker) */
    markers: null,
    
    /**
    * @constructor
    *
    * @param {String} name
    * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        this.markers = new Array();
    },
    
    /**
     * 
     */
    destroy: function() {
        this.clearMarkers();
        markers = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },

    
    /** 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);

        if (zoomChanged) {
            this.redraw();
        }
    },

    /**
     * @param {OpenLayers.Marker} marker
     */
    addMarker: function(marker) {
        this.markers.push(marker);
        if (this.map && this.map.getExtent()) {
            marker.map = this.map;
            this.drawMarker(marker);
        }
    },

    /**
     * @param {OpenLayers.Marker} marker
     */
    removeMarker: function(marker) {
        OpenLayers.Util.removeItem(this.markers, marker);
        if ((marker.icon != null) && (marker.icon.imageDiv != null) &&
            (marker.icon.imageDiv.parentNode == this.div) ) {
            this.div.removeChild(marker.icon.imageDiv);    
        }
    },

    /**
     * 
     */
    clearMarkers: function() {
        if (this.markers != null) {
            while(this.markers.length > 0) {
                this.removeMarker(this.markers[0]);
            }
        }
    },

    /** clear all the marker div's from the layer and then redraw all of them.
    *    Use the map to recalculate new placement of markers.
    */
    redraw: function() {
        for(i=0; i < this.markers.length; i++) {
            this.drawMarker(this.markers[i]);
        }
    },

    /** Calculate the pixel location for the marker, create it, and 
    *    add it to the layer's div
    * 
    * @private 
    * 
    * @param {OpenLayers.Marker} marker
    */
    drawMarker: function(marker) {
        var px = this.map.getLayerPxFromLonLat(marker.lonlat);
        if (px == null) {
            marker.display(false);
        } else {
            var markerImg = marker.draw(px);
            if (!marker.drawn) {
                this.div.appendChild(markerImg);
                marker.drawn = true;
            }
        }
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Markers"
});
/* ======================================================================    OpenLayers/Layer/Vector.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Layer.js
 * @requires OpenLayers/Renderer.js
 */
OpenLayers.Layer.Vector = OpenLayers.Class.create();
OpenLayers.Layer.Vector.prototype =
  OpenLayers.Class.inherit(OpenLayers.Layer, {

    /** @type Boolean */
    isBaseLayer: false,

    /** @type Boolean */
    isFixed: false,

    /** @type Boolean */
    isVector: true,

    /** @type {Array(OpenLayer.Feature.Vector)} */
    features: null,
    
    /** @type {Array(OpenLayers.Feature.Vector)} */
    selectedFeatures: [],

    /** @type {Boolean} */
    editing: false,

    /** @type {Boolean} */
    editable: false,

    /** @type {Boolean} */
    reportError: true, 

    /**
     * List of supported Renderer classes. Add to this list to
     * add support for additional renderers. This list is ordered:
     * the first renderer which returns true for the  'supported()'
     * method will be used, if not defined in the 'renderer' option.
     * 
     * @type {Array(String)} 
     */
    renderers: ['SVG', 'VML'],
    
    /** @type OpenLayers.Renderer */
    renderer: null,
   
    /** 
     * geometryType allows you to limit the types of geometries this
     * layer supports. This should be set to something like 
     * "OpenLayers.Geometry.Point" to limit types.
     * 
     * @type string 
     */
    geometryType: null,

    /** Whether the Vector Layer features have been drawn yet.
     *
     * @type boolean 
     */
    drawn: false,

    /**
     * @constructor
     *
     * @param {String} name
     * @param {Object} options Hashtable of extra options to tag onto the layer.
     * Options renderer {Object}: Typically SVGRenderer or VMLRenderer.
     */
    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);

        // allow user-set renderer, otherwise assign one
        if (!this.renderer || !this.renderer.supported()) {  
            this.assignRenderer();
        }

        // if no valid renderer found, display error
        if (!this.renderer || !this.renderer.supported()) {
            this.renderer = null;
            this.displayError();
        } 

        this.features = new Array();
        this.selectedFeatures = new Array();
    },

    /**
     * 
     */
    destroy: function() {
        OpenLayers.Layer.prototype.destroy.apply(this, arguments);  

        // HACK HACK -- I believe we should be iterating and 
        //              calling feature[i].destroy() here. 
        this.features = null;
        this.selectedFeatures = null;
        this.editing = null;
        this.editable = null;
        if (this.renderer) {
            this.renderer.destroy();
        }
        this.renderer = null;
        this.geometryType = null;
        this.drawn = null;
    },

    /** Iterates through the available renderer implementations and selects 
     *  and assigns the first one whose "supported()" function returns true.
     * 
     * @private
     * 
     */    
    assignRenderer: function()  {
        for (var i = 0; i < this.renderers.length; i++) {
            var rendererClass = OpenLayers.Renderer[this.renderers[i]];
            if (rendererClass && rendererClass.prototype.supported()) {
               this.renderer = new rendererClass(this.div);
               break;
            }  
        }  
    },

    /** 
     * Let the user know their browser isn't supported.
     * 
     * @private
     * 
     */
    displayError: function() {
        if (this.reportError) {
            var message = "Your browser does not support vector rendering. " + 
                            "Currently supported renderers are:\n";
            message += this.renderers.join("\n");
            alert(message);
        }    
    },

    /** The layer has been added to the map. 
     * 
     *  If there is no renderer set, the layer can't be used. Remove it.
     *  Otherwise, give the renderer a reference to the map and set its size.
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {        
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);

        if (!this.renderer) {
            this.map.removeLayer(this);
        } else {
            this.renderer.map = this.map;
            this.renderer.setSize(this.map.getSize());
        }
    },
    
    /** Notify the renderer of the change in size. 
     * 
     */
    onMapResize: function() {
        OpenLayers.Layer.prototype.onMapResize.apply(this, arguments);
        this.renderer.setSize(this.map.getSize());
    },

    /** Reset the vector layer's div so that it once again is lined up with 
     *   the map. Notify the renderer of the change of extent, and in the
     *   case of a change of zoom level (resolution), have the 
     *   renderer reproject.
     * 
     *  If the layer has not yet been drawn, cycle through the layer's 
     *   features and draw each one.
     * 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo: function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        
        if (!dragging) {
            this.div.style.left = - parseInt(this.map.layerContainerDiv.style.left) + "px";
            this.div.style.top = - parseInt(this.map.layerContainerDiv.style.top) + "px";
            var extent = this.map.getExtent();
            this.renderer.setExtent(extent);
        }

        if (zoomChanged) {
            this.renderer.reproject();
        }
        
        if (!this.drawn) {
            this.drawn = true;
            for(var i = 0; i < this.features.length; i++) {
                var feature = this.features[i];
                this.renderer.drawGeometry(feature.geometry, feature.style);
            }
        }    
    },

    /**
     * @param {Array(OpenLayers.Feature.Vector} features
     */
    addFeatures: function(features) {
        if (!(features instanceof Array)) {
            features = [features];
        }

        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            
            if (this.geometryType &&
                !(feature.geometry instanceof this.geometryType)) {
                    var throwStr = "addFeatures : component should be an " + 
                                    this.geometryType.prototype.CLASS_NAME;
                    throw throwStr;
                }

            this.features.push(feature);
            
            //give feature reference to its layer
            feature.layer = this;

            if (this.drawn) {
                this.renderer.drawGeometry(feature.geometry, feature.style);
            }
            
            this.onFeatureInsert(feature);
        }
    },


    /**
     * @param {Array(OpenLayers.Feature.Vector} features
     */
    removeFeatures: function(features) {
        if (!(features instanceof Array)) {
            features = [features];
        }

        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            this.features = OpenLayers.Util.removeItem(this.features, feature);

            this.renderer.eraseGeometry(feature.geometry);
        }
    },

    /**
     * @param {String} fid
     * @param {Object} style
     */
    redrawFeature: function(fid, style) {
        for (var i = 0; i < this.features.length; i++) {
            var feature = this.features[i];
            if (feature.fid == fid) {
                this.renderer.drawGeometry(feature.geometry, style);
            }
        }
    },
    
    /**
     * Start editing the layer
     * 
     * @returns Whether or not the layer is editable
     * @type Boolean
     */
    unlock: function() {
        if(this.editable) {
            this.editing = true;
        }
        return this.editable;
    },

    /**
     * Stop editing the layer
     * 
     * @return Whether or not the layer *was* editing 
     * HACK HACK This return value seems wierd to me.
     * @type Boolean
     */
    lock: function() {
        if(this.editing) {
            this.editing = false;
        }
        return this.editing;
    },

    /**
     * Unselect the selected features
     * i.e. clears the featureSelection array
     * change the style back
    clearSelection: function() {

       var vectorLayer = this.map.vectorLayer;
        for (var i = 0; i < this.map.featureSelection.length; i++) {
            var featureSelection = this.map.featureSelection[i];
            vectorLayer.renderer.drawGeometry(featureSelection.geometry, 
                                              vectorLayer.style);
        }
        this.map.featureSelection = [];
    },
     */


    /**
     * method called when a feature is inserted.
     * Does nothing by default. Override this if you
     * need to do something on feature updates.
     * 
     * @param {OpenLayers.Feature.Vector} feature
     */
    onFeatureInsert: function(feature) {
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Vector"
});
/* ======================================================================    OpenLayers/Control/DrawFeature.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * Draws features on a vector layer when active.
 * 
 * @class
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Feature/Vector.js
 */
OpenLayers.Control.DrawFeature = OpenLayers.Class.create();
OpenLayers.Control.DrawFeature.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Control, {
    
    /**
     * @type OpenLayers.Layer.Vector
     */
    layer: null,

    /**
     * @type {Object} The functions that are sent to the handler for callback
     */
    callbacks: {},
    
    /**
     * @type {Function} Called after each feature is added
     */
    featureAdded: function() {},

    /**
     * Used to set non-default properties on the control's handler
     *
     * @type Object
     */
    handlerOptions: null,
    
    /**
     * @param {OpenLayers.Layer.Vector} layer
     * @param {OpenLayers.Handler} handler
     * @param {Object} options
     */
    initialize: function(layer, handler, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.callbacks = OpenLayers.Util.extend({done: this.drawFeature},
                                                this.callbacks);
        this.layer = layer;
        this.handler = new handler(this, this.callbacks, this.handlerOptions);
    },

    /**
     *
     */
    drawFeature: function(geometry) {
        var feature = new OpenLayers.Feature.Vector(geometry);
        this.layer.addFeatures([feature]);
        this.featureAdded(feature);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.DrawFeature"
});
/* ======================================================================    OpenLayers/Control/NavToolbar.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Control/Panel.js
 * @requires OpenLayers/Control/Navigation.js
 * @requires OpenLayers/Control/ZoomBox.js
 */
OpenLayers.Control.NavToolbar = OpenLayers.Class.create();
OpenLayers.Control.NavToolbar.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control.Panel, {

    /**
     * Add our two mousedefaults controls.
     */
    initialize: function(options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, arguments);
        this.addControls([
          new OpenLayers.Control.Navigation(),
          new OpenLayers.Control.ZoomBox()
        ]);
    },

    /**
     * calls the default draw, and then activates mouse defaults.
     */
    draw: function() {
        var div = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        this.activateControl(this.controls[0]);
        return div;
    },

    CLASS_NAME: "OpenLayers.Control.NavToolbar"
});    
/* ======================================================================    OpenLayers/Control/SelectFeature.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * Draws features on a vector layer when active.
 * 
 * @class
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Feature/Vector.js
 */
OpenLayers.Control.SelectFeature = OpenLayers.Class.create();
OpenLayers.Control.SelectFeature.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Control, {
    
    /**
     * @type {Boolean} Allow selection of multiple geometries
     */
    multiple: false, 

    /**
     * @type {Boolean} Select on mouse over and deselect on mouse out.  If
     *                 true, this ignores clicks and only listens to mouse moves.
     */
    hover: false,
    
    /**
     * @type {Function} Optional function to be called when a feature is selected.
     *                  The function should expect to be called with a geometry.
     */
    onSelect: function() {},

    /**
     * @type {Function} Optional function to be called when a feature is unselected.
     *                  The function should expect to be called with a geometry.
     */
    onUnselect: function() {},

    /**
     * @type {OpenLayers.Layer.Vector}
     */
    layer: null,
    
    /**
     * @type {Object} The functions that are sent to the handler for callback
     */
    callbacks: {},
    
    /**
     * @type {Object} Hash of styles
     */
    selectStyle: OpenLayers.Feature.Vector.style['select'],

    /**
     * @type {OpenLayers.Handler.Feature}
     * @private
     */
    handler: null,

    /**
     * @param {OpenLayers.Layer.Vector} layer
     * @param {OpenLayers.Handler} handler
     * @param {Object} options
     */
    initialize: function(layer, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.callbacks = OpenLayers.Util.extend({
                                                  down: this.downFeature,
                                                  over: this.overFeature,
                                                  out: this.outFeature
                                                }, this.callbacks);
        this.layer = layer;
        this.handler = new OpenLayers.Handler.Feature(this, layer, this.callbacks);
    },

    /**
     * Called when the feature handler detects a mouse-down on a feature
     * @param {OpenLayers.Geometry}
     */
    downFeature: function(geometry) {
        if(this.hover) {
            return;
        }
        if(geometry.parent) {
            geometry = geometry.parent;
        }
        if (this.multiple) {
            if(OpenLayers.Util.indexOf(this.layer.selectedFeatures, geometry.feature) > -1) {
                this.unselect(geometry);
            } else {
                this.select(geometry);
            }
        } else {
            if(OpenLayers.Util.indexOf(this.layer.selectedFeatures, geometry.feature) > -1) {
                this.unselect(geometry);
            } else {
                if (this.layer.selectedFeatures) {
                    for (var i = 0; i < this.layer.selectedFeatures.length; i++) {
                        this.unselect(this.layer.selectedFeatures[i].geometry);
                    }
                }
                this.select(geometry);
            }
        }
    },

    /**
     * Called when the feature handler detects a mouse-over on a feature.
     * Only responds if this.hover is true.
     * @param {OpenLayers.Geometry}
     */
    overFeature: function(geometry) {
        if(!this.hover) {
            return;
        }
        if(geometry.parent) {
            geometry = geometry.parent;
        }
        if(!(OpenLayers.Util.indexOf(this.layer.selectedFeatures, geometry.feature) > -1)) {
            this.select(geometry);
        }
    },

    /**
     * Called when the feature handler detects a mouse-out on a feature.
     * Only responds if this.hover is true.
     * @param {OpenLayers.Geometry}
     */
    outFeature: function(geometry) {
        if(!this.hover) {
            return;
        }
        if(geometry.parent) {
            geometry = geometry.parent;
        }
        this.unselect(geometry);
    },
    
    /**
     * Add feature to the layer's selectedFeature array, render the feature as
     * selected, and call the onSelect function.
     * @param {OpenLayers.Geometry} geometry
     */
    select: function(geometry) {
        // Store feature style for restoration later
        if(geometry.feature.originalStyle == null) {
            geometry.feature.originalStyle = geometry.feature.style;
        }
        this.layer.selectedFeatures.push(geometry.feature);
        this.layer.renderer.drawGeometry(geometry, this.selectStyle);
        this.onSelect(geometry);
    },

    /**
     * Remove feature from the layer's selectedFeature array, render the feature as
     * normal, and call the onUnselect function.
     * @param {OpenLayers.Geometry} geometry
     */
    unselect: function(geometry) {
        // Store feature style for restoration later
        if(geometry.feature.originalStyle == null) {
            geometry.feature.originalStyle = geometry.feature.style;
        }
        this.layer.renderer.drawGeometry(geometry, geometry.feature.originalStyle);
        OpenLayers.Util.removeItem(this.layer.selectedFeatures, geometry.feature);
        this.onUnselect(geometry);
    },

    /** Set the map property for the control. 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        this.handler.setMap(map);
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.SelectFeature"
});
/* ======================================================================    OpenLayers/Format/GML.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Read/WRite GML. 
 * @requires OpenLayers/Format.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Ajax.js
 * @requires OpenLayers/Geometry.js
 */
OpenLayers.Format.GML = OpenLayers.Class.create();
OpenLayers.Format.GML.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Format, {
    
    featureNS: "http://mapserver.gis.umn.edu/mapserver",
    
    featureName: "featureMember", 
    
    layerName: "features",
    
    geometryName: "geometry",
    
    collectionName: "FeatureCollection",
    
    gmlns: "http://www.opengis.net/gml",
    

    /** 
     * Extract attributes from GML. Most of the time,
     * this is a significant time usage, due to the need
     * to recursively descend the XML to search for attributes.
     * 
     * @type Boolean */
    extractAttributes: true,
    
    /**
     * Read data from a string, and return a list of features. 
     * 
     * @param {string|XMLNode} data data to read/parse.
     */
     read: function(data) {
        if (typeof data == "string") { 
            data = OpenLayers.parseXMLString(data);
        }    
        var featureNodes = OpenLayers.Ajax.getElementsByTagNameNS(data, this.gmlns, "gml", this.featureName);
        if (featureNodes.length == 0) { return []; }

        // Determine dimension of the FeatureCollection. Ie, dim=2 means (x,y) coords
        // dim=3 means (x,y,z) coords
        // GML3 can have 2 or 3 dimensions. GML2 only 2.
        var dim;
        var coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(featureNodes[0], this.gmlns, "gml", "posList");
        if (coordNodes.length == 0) {
            coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(featureNodes[0], this.gmlns, "gml", "pos");
        }
        if (coordNodes.length > 0) {
            dim = coordNodes[0].getAttribute("srsDimension");
        }    
        this.dim = (dim == "3" || dim == 3) ? 3 : 2;
        
        var features = [];
        
        // Process all the featureMembers
        for (var i = 0; i < featureNodes.length; i++) {
            var feature = this.parseFeature(featureNodes[i]);

            if (feature) {
                features.push(feature);
            }
        }
        return features;
     },

     /**
      * This function is the core of the GML parsing code in OpenLayers.
      * It creates the geometries that are then attached to the returned
      * feature, and calls parseAttributes() to get attribute data out.
      * @param DOMElement xmlNode
      */
     parseFeature: function(xmlNode) {
        var geom;
        var p; // [points,bounds]

        var feature = new OpenLayers.Feature.Vector();

        if (xmlNode.firstChild.attributes && xmlNode.firstChild.attributes['fid']) {
            feature.fid = xmlNode.firstChild.attributes['fid'].nodeValue;
        }
        
        // match MultiPolygon
        if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "MultiPolygon").length != 0) {
            var multipolygon = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "MultiPolygon")[0];
            geom = new OpenLayers.Geometry.MultiPolygon();
            var polygons = OpenLayers.Ajax.getElementsByTagNameNS(multipolygon,
                this.gmlns, "gml", "Polygon");
            for (var i = 0; i < polygons.length; i++) {
                polygon = this.parsePolygonNode(polygons[i],geom);
                geom.addComponents(polygon);
            }
        }
        // match MultiLineString
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "MultiLineString").length != 0) {
            var multilinestring = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "MultiLineString")[0];
            
            geom = new OpenLayers.Geometry.MultiLineString();
            var lineStrings = OpenLayers.Ajax.getElementsByTagNameNS(multilinestring, this.gmlns, "gml", "LineString");
            
            for (var i = 0; i < lineStrings.length; i++) {
                p = this.parseCoords(lineStrings[i]);
                if(p.points){
                    var lineString = new OpenLayers.Geometry.LineString(p.points);
                    geom.addComponents(lineString);
                    // TBD Bounds only set for one of multiple geometries
                }
            }
        }
        // match MultiPoint
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "MultiPoint").length != 0) {
            var multiPoint = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "MultiPoint")[0];
                
            geom = new OpenLayers.Geometry.MultiPoint();
            
            var points = OpenLayers.Ajax.getElementsByTagNameNS(multiPoint, this.gmlns, "gml", "Point");
            
            for (var i = 0; i < points.length; i++) {
                p = this.parseCoords(points[i]);
                geom.addComponents(p.points[0]);
                // TBD Bounds only set for one of multiple geometries
            }
        }
        // match Polygon
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "Polygon").length != 0) {
            var polygon = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "Polygon")[0];
            
            geom = this.parsePolygonNode(polygon);
        }
        // match LineString
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "LineString").length != 0) {
            var lineString = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "LineString")[0];
            p = this.parseCoords(lineString);
            if (p.points) {
                geom = new OpenLayers.Geometry.LineString(p.points);
                // TBD Bounds only set for one of multiple geometries
            }
        }
        // match Point
        else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.gmlns, "gml", "Point").length != 0) {
            var point = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.gmlns, "gml", "Point")[0];
            
            p = this.parseCoords(point);
            if (p.points) {
                geom = p.points[0];
                // TBD Bounds only set for one of multiple geometries
            }
        }
        
        feature.setGeometry(geom, false); 
        if (this.extractAttributes) {
            feature.attributes = this.parseAttributes(xmlNode);
        }    
        
        return feature;
    },        
    
    /**
     * recursive function parse the attributes of a GML node.
     * Searches for any child nodes which aren't geometries,
     * and gets their value.
     * @param DOMElement xmlNode
     */
    parseAttributes: function(xmlNode) {
        var nodes = xmlNode.childNodes;
        var attributes = {};
        for(var i = 0; i < nodes.length; i++) {
            var name = nodes[i].nodeName;
            var value = OpenLayers.Util.getXmlNodeValue(nodes[i]);
            // Ignore Geometry attributes
            // match ".//gml:pos|.//gml:posList|.//gml:coordinates"
            if((name.search(":pos")!=-1)
              ||(name.search(":posList")!=-1)
              ||(name.search(":coordinates")!=-1)){
               continue;    
            }
            
            // Check for a leaf node
            if((nodes[i].childNodes.length == 1 && nodes[i].childNodes[0].nodeName == "#text")
                || (nodes[i].childNodes.length == 0 && nodes[i].nodeName!="#text")) {
                attributes[name] = value;
            }
            OpenLayers.Util.extend(attributes, this.parseAttributes(nodes[i]))
        }   
        return attributes;
    },
    
    /**
     *
     * @param {XMLNode} xmlNode 
     *
     * @return {OpenLayers.Geometry.Polygon} polygon geometry
     */
    parsePolygonNode: function(polygonNode) {
        var linearRings = OpenLayers.Ajax.getElementsByTagNameNS(polygonNode,
            this.gmlns, "gml", "LinearRing");
        
        var rings = [];
        var p;
        var polyBounds;
        for (var i = 0; i < linearRings.length; i++) {
            p = this.parseCoords(linearRings[i]);
            ring1 = new OpenLayers.Geometry.LinearRing(p.points);
            rings.push(ring1);
        }
        
        var poly = new OpenLayers.Geometry.Polygon(rings);
        return poly;
    },
    
    /**
     * Extract Geographic coordinates from an XML node.
     * @private
     * @param {XMLNode} xmlNode 
     * 
     * @return an array of OpenLayers.Geometry.Point points.
     * @type Array
     */
    parseCoords: function(xmlNode) {
        var x, y, left, bottom, right, top, bounds;
        var p = []; // return value = [points,bounds]
        
        if (xmlNode) {
            p.points = [];
            
            // match ".//gml:pos|.//gml:posList|.//gml:coordinates"
            // Note: GML2 coordinates are of the form:x y,x y,x y
            // GML2 can also be of the form <coord><x>1</x><y>2</y></coord>
            //       GML3 posList is of the form:x y x y. OR x y z x y z.
            
            // GML3 Line or Polygon
            var coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "posList");
            
            // GML3 Point
            if (coordNodes.length == 0) { 
                coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "pos");
            }    

            // GML2
            if (coordNodes.length == 0) {
                coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.gmlns, "gml", "coordinates");
            }    

            // TBD: Need to handle an array of coordNodes not just coordNodes[0]
            
            var coordString = OpenLayers.Util.getXmlNodeValue(coordNodes[0]);
            
            // Extract an array of Numbers from CoordString
            var nums = (coordString) ? coordString.split(/[, \n\t]+/) : [];
            
            // Remove elements caused by leading and trailing white space
            while (nums[0] == "") 
                nums.shift();
            
            while (nums[nums.length-1] == "") 
                nums.pop();
            
            for(i = 0; i < nums.length; i = i + this.dim) {
                x = parseFloat(nums[i]);
                y = parseFloat(nums[i+1]);
                p.points.push(new OpenLayers.Geometry.Point(x, y));
            }
        }
        return p;
    },
    
    /**
     * Accept Feature Collection, and return a string. 
     * 
     * @param {Array} List of features to serialize into a string.
     */
     write: function(features) {
        var featureCollection = document.createElementNS("http://www.opengis.net/wfs", "wfs:" + this.collectionName);
        for (var i=0; i < features.length; i++) {
            featureCollection.appendChild(this.createFeatureXML(features[i]));
        }
        return featureCollection;
     },
    
    /** 
     * Accept an OpenLayers.Feature.Vector, and build a geometry for it.
     * 
     * @param OpenLayers.Feature.Vector feature
     * @returns DOMElement
     */
    createFeatureXML: function(feature) {
        var geometryNode = this.buildGeometryNode(feature.geometry);
        var geomContainer = document.createElementNS(this.featureNS, "feature:"+this.geometryName);
        geomContainer.appendChild(geometryNode);
        var featureNode = document.createElementNS(this.gmlns, "gml:" + this.featureName);
        var featureContainer = document.createElementNS(this.featureNS, "feature:"+this.layerName);
        featureContainer.appendChild(geomContainer);
        for(var attr in feature.attributes) {
            var attrText = document.createTextNode(feature.attributes[attr]); 
            var nodename = attr;
            if (attr.search(":") != -1) {
                nodename = attr.split(":")[1];
            }    
            var attrContainer = document.createElementNS(this.featureNS, "feature:"+nodename);
            attrContainer.appendChild(attrText);
            featureContainer.appendChild(attrContainer);
        }    
        featureNode.appendChild(featureContainer);
        return featureNode;
    },    
    
    /** 
     * builds a GML file with a given geometry
     * 
     * @param {OpenLayers.Geometry} geometry
     */
    buildGeometryNode: function(geometry) {
    // TBD test if geoserver can be given a Multi-geometry for a simple-geometry data store
    // ie if multipolygon can be sent for a polygon feature type
        var gml = "";
        // match MultiPolygon or Polygon
        if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon"
            || geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
                gml = document.createElementNS(this.gmlns, 'gml:MultiPolygon');
                
                // TBD retrieve the srs from layer
                // srsName is non-standard, so not including it until it's right.
                //gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                
                var polygonMember = document.createElementNS(this.gmlns, 'gml:polygonMember');
                
                var polygon = document.createElementNS(this.gmlns, 'gml:Polygon');
                var outerRing = document.createElementNS(this.gmlns, 'gml:outerBoundaryIs');
                var linearRing = document.createElementNS(this.gmlns, 'gml:LinearRing');
                
                // TBD manage polygons with holes
                linearRing.appendChild(this.buildCoordinatesNode(geometry.components[0]));
                outerRing.appendChild(linearRing);
                polygon.appendChild(outerRing);
                polygonMember.appendChild(polygon);
                
                gml.appendChild(polygonMember);
            }
        // match MultiLineString or LineString
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString"
                 || geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                     gml = document.createElementNS(this.gmlns, 'gml:MultiLineString');
                     
                     // TBD retrieve the srs from layer
                     // srsName is non-standard, so not including it until it's right.
                     //gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                     
                     var lineStringMember = document.createElementNS(this.gmlns, 'gml:lineStringMember');
                     
                     var lineString = document.createElementNS(this.gmlns, 'gml:LineString');
                     
                     lineString.appendChild(this.buildCoordinatesNode(geometry));
                     lineStringMember.appendChild(lineString);
                     
                     gml.appendChild(lineStringMember);
                 }
        // match MultiPoint or Point
        else if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point" || 
                  geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") {
                // TBD retrieve the srs from layer
                // srsName is non-standard, so not including it until it's right.
                //gml.setAttribute("srsName", "http://www.opengis.net/gml/srs/epsg.xml#4326");
                     
                gml = document.createElementNS(this.gmlns, 'gml:MultiPoint');
                var parts = "";
                if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") {
                    parts = geometry.components;
                } else {
                    parts = [geometry];
                }    
                
                for (var i = 0; i < parts.length; i++) { 
                    var pointMember = document.createElementNS(this.gmlns, 'gml:pointMember');
                    var point = document.createElementNS(this.gmlns, 'gml:Point');
                    point.appendChild(this.buildCoordinatesNode(parts[i]));
                    pointMember.appendChild(point);
                    gml.appendChild(pointMember);
               }     
        }
        return gml;         
    },
     
    /**
     * builds the coordinates XmlNode
     * <gml:coordinates decimal="." cs="," ts=" ">...</gml:coordinates>
     *
     * @param {OpenLayers.Geometry} geometry
     * @return {XmlNode} created xmlNode
     */
    buildCoordinatesNode: function(geometry) {
        var coordinatesNode = document.createElementNS(this.gmlns, "gml:coordinates");
        coordinatesNode.setAttribute("decimal", ".");
        coordinatesNode.setAttribute("cs", ",");
        coordinatesNode.setAttribute("ts", " ");
        
        var points = null;
        if (geometry.components) {
            points = geometry.components;
        }

        var path = "";
        if (points) {
            for (var i = 0; i < points.length; i++) {
                path += points[i].x + "," + points[i].y + " ";
            }
        } else {
           path += geometry.x + "," + geometry.y + " ";
        }    
        
        var txtNode = document.createTextNode(path);
        coordinatesNode.appendChild(txtNode);
        
        return coordinatesNode;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Format.GML" 

});     
/* ======================================================================    OpenLayers/Format/KML.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Read only KML. 
 * @requires OpenLayers/Format.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Ajax.js
 */
OpenLayers.Format.KML = OpenLayers.Class.create();
OpenLayers.Format.KML.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Format, {
    
    featureNS: "http://mapserver.gis.umn.edu/mapserver",
    
    collectionName: "FeatureCollection",
    
    kmlns: "http://earth.google.com/kml/2.0",
    
    /**
     * Read data from a string, and return a list of features. 
     * 
     * @param {string|XMLNode} data data to read/parse.
     */
     read: function(data) {
        if (typeof data == "string") { 
            data = OpenLayers.parseXMLString(data);
        }    
        var featureNodes = OpenLayers.Ajax.getElementsByTagNameNS(data, this.kmlns, "", "Placemark");
        
        var features = [];
        
        // Process all the featureMembers
        for (var i = 0; i < featureNodes.length; i++) {
            var feature = this.parseFeature(featureNodes[i]);

            if (feature) {
                features.push(feature);
            }
        }
        return features;
     },

     /**
      * This function is the core of the KML parsing code in OpenLayers.
      * It creates the geometries that are then attached to the returned
      * feature, and calls parseAttributes() to get attribute data out.
      * @param DOMElement xmlNode
      */
     parseFeature: function(xmlNode) {
        var geom;
        var p; // [points,bounds]

        var feature = new OpenLayers.Feature.Vector();

        // match Point
        if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.kmlns, "", "Point").length != 0) {
            var point = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.kmlns, "", "Point")[0];
            
            p = this.parseCoords(point);
            if (p.points) {
                geom = p.points[0];
                // TBD Bounds only set for one of multiple geometries
                geom.extendBounds(p.bounds);
            }
        
        // match LineString 
        } else if (OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
            this.kmlns, "", "LineString").length != 0) {
            var linestring = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode,
                this.kmlns, "", "LineString")[0];
            p = this.parseCoords(linestring);
            if (p.points) {
                geom = new OpenLayers.Geometry.LineString(p.points);
                // TBD Bounds only set for one of multiple geometries
                geom.extendBounds(p.bounds);
            }
        }
        
        feature.setGeometry(geom);
        feature.attributes = this.parseAttributes(xmlNode);
        
        return feature;
    },        
    
    /**
     * recursive function parse the attributes of a KML node.
     * Searches for any child nodes which aren't geometries,
     * and gets their value.
     * @param DOMElement xmlNode
     */
    parseAttributes: function(xmlNode) {
        var nodes = xmlNode.childNodes;
        var attributes = {};
        for(var i = 0; i < nodes.length; i++) {
            var name = nodes[i].nodeName;
            var value = OpenLayers.Util.getXmlNodeValue(nodes[i]);
            // Ignore Geometry attributes
            // match ".//gml:pos|.//gml:posList|.//gml:coordinates"
            if((name.search(":pos")!=-1)
              ||(name.search(":posList")!=-1)
              ||(name.search(":coordinates")!=-1)){
               continue;    
            }
            
            // Check for a leaf node
            if((nodes[i].childNodes.length == 1 && nodes[i].childNodes[0].nodeName == "#text")
                || (nodes[i].childNodes.length == 0 && nodes[i].nodeName!="#text")) {
                attributes[name] = value;
            }
            OpenLayers.Util.extend(attributes, this.parseAttributes(nodes[i]))
        }   
        return attributes;
    },
    
    /**
     * Extract Geographic coordinates from an XML node.
     * @private
     * @param {XMLNode} xmlNode 
     * 
     * @return an array of OpenLayers.Geometry.Point points.
     * @type Array
     */
    parseCoords: function(xmlNode) {
        var p = [];
        p.points = [];
        // TBD: Need to handle an array of coordNodes not just coordNodes[0]
        
        var coordNodes = OpenLayers.Ajax.getElementsByTagNameNS(xmlNode, this.kmlns, "", "coordinates")[0];
        var coordString = OpenLayers.Util.getXmlNodeValue(coordNodes);
        
        var firstCoord = coordString.split(" ");
        
        while (firstCoord[0] == "") 
            firstCoord.shift();
        
        var dim = firstCoord[0].split(",").length;

        // Extract an array of Numbers from CoordString
        var nums = (coordString) ? coordString.split(/[, \n\t]+/) : [];
        
        
        // Remove elements caused by leading and trailing white space
        while (nums[0] == "") 
            nums.shift();
        
        while (nums[nums.length-1] == "") 
            nums.pop();
        
        for(i = 0; i < nums.length; i = i + dim) {
            x = parseFloat(nums[i]);
            y = parseFloat(nums[i+1]);
            p.points.push(new OpenLayers.Geometry.Point(x, y));
            
            if (!p.bounds) {
                p.bounds = new OpenLayers.Bounds(x, y, x, y);
            } else {
                p.bounds.extend(x, y);
            }
        }
        return p;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Format.KML" 
    
});     
/* ======================================================================    OpenLayers/Geometry/LinearRing.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * A Linear Ring is a special LineString which is closed. It closes itself 
 * automatically on every addPoint/removePoint by adding a copy of the first
 * point as the last point. 
 * 
 * Also, as it is the first in the line family to close itself, a getArea()
 * function is defined to calculate the enclosed area of the linearRing
 * 
 * @requires OpenLayers/Geometry/LineString.js
 */
OpenLayers.Geometry.LinearRing = OpenLayers.Class.create();
OpenLayers.Geometry.LinearRing.prototype = 
    OpenLayers.Class.inherit(OpenLayers.Geometry.LineString, {

    /**
     * An array of class names representing the types of components that
     * the collection can include.  A null value means the component types
     * are not restricted.
     * @type Array(String)
     */
    componentTypes: ["OpenLayers.Geometry.Point"],

    /**
     * Linear rings are constructed with an array of points.  This array
     * can represent a closed or open ring.  If the ring is open (the last
     * point does not equal the first point), the constructor will close
     * the ring.  If the ring is already closed (the last point does equal
     * the first point), it will be left closed.
     * 
     * @constructor
     * @param {Array(OpenLayers.Geometry.Point)} points
     */
    initialize: function(points) {
        OpenLayers.Geometry.LineString.prototype.initialize.apply(this, 
                                                                  arguments);
    },

    /**
     * Adds a point to geometry components.  If the point is to be added to
     * the end of the components array and it is the same as the last point
     * already in that array, the duplicate point is not added.  This has the
     * effect of closing the ring if it is not already closed, and doing the
     * right thing if it is already closed.  This behavior can be overridden
     * by calling the method with a non-null index as the second argument.
     *
     * @param {OpenLayers.Geometry.Point} point
     * @param {int} index Index into the array to insert the component
     * @type Boolean
     * @return Point was successfully added
     */
    addComponent: function(point, index) {
        var added = false;

        //remove last point
        var lastPoint = this.components[this.components.length-1];
        OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                              [lastPoint]);

        // given an index, add the point
        // without an index only add non-duplicate points
        if(index != null || !point.equals(lastPoint)) {
            added = OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                                        arguments);
        }

        //append copy of first point
        var firstPoint = this.components[0];
        OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                         [firstPoint.clone()]);

        return added;
    },
    
    /**
     * Removes a point from geometry components
     *
     * @param {OpenLayers.Geometry.Point} point
     */
    removeComponent: function(point) {
        if (this.components.length > 4) {

            //remove last point
            var lastPoint = this.components[this.components.length-1];
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                                 [lastPoint]);
            
            //remove our point
            OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this, 
                                                                    arguments);
            //append copy of first point
            var firstPoint = this.components[0];
            OpenLayers.Geometry.Collection.prototype.addComponent.apply(this, 
                                                         [firstPoint.clone()]);
        }
    },
    
    /** Note: The area is positive if the ring is oriented CW, otherwise
     *         it will be negative.
     * 
     * @returns The signed area for a ring.
     * @type float
     */
    getArea: function() {
        var area = 0.0;
        if ( this.components && (this.components.length > 2)) {
            var sum = 0.0;
            for (var i = 0; i < this.components.length - 1; i++) {
                var b = this.components[i];
                var c = this.components[i+1];
                sum += (b.x + c.x) * (c.y - b.y);
            }
            area = - sum / 2.0;
        }
        return area;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Geometry.LinearRing"
});
/* ======================================================================    OpenLayers/Handler/Path.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * Handler to draw a path on the map.  Path is displayed on mouse down,
 * moves on mouse move, and is finished on mouse up.
 * 
 * @class
 * @requires OpenLayers/Handler/Point.js
 * @requires OpenLayers/Geometry/Point.js
 * @requires OpenLayers/Geometry/LineString.js
 */
OpenLayers.Handler.Path = OpenLayers.Class.create();
OpenLayers.Handler.Path.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Handler.Point, {
    
    /**
     * @type OpenLayers.Geometry.LineString
     * @private
     */
    line: null,
    
    /**
     * In freehand mode, the handler starts the path on mouse down, adds a point
     * for every mouse move, and finishes the path on mouse up.  Outside of
     * freehand mode, a point is added to the path on every mouse click and
     * double-click finishes the path.
     * 
     * @type Boolean
     */
    freehand: false,
    
    /**
     * If set, freehandToggle is checked on mouse events and will set the
     * freehand mode to the opposite of this.freehand.  To disallow toggling
     * between freehand and non-freehand mode, set freehandToggle to null.
     * Acceptable toggle values are 'shiftKey', 'ctrlKey', and 'altKey'.
     *
     * @type String
     */
    freehandToggle: 'shiftKey',

    /**
     * @constructor
     *
     * @param {OpenLayers.Control} control
     * @param {Array} callbacks An object with a 'done' property whos value is
     *                          a function to be called when the path drawing is
     *                          finished. The callback should expect to recieve a
     *                          single argument, the line string geometry.
     *                          If the callbacks object contains a 'point'
     *                          property, this function will be sent each point
     *                          as they are added.  If the callbacks object contains
     *                          a 'cancel' property, this function will be called when
     *                          the handler is deactivated while drawing.  The cancel
     *                          should expect to receive a geometry.
     * @param {Object} options
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.Point.prototype.initialize.apply(this, arguments);
    },
        
    /**
     * Add temporary geometries
     */
    createGeometry: function() {
        this.line = new OpenLayers.Geometry.LineString();
        this.point = new OpenLayers.Geometry.Point();
    },
        
    /**
     * Destroy temporary geometries
     */
    destroyGeometry: function() {
        this.line.destroy();
        this.point.destroy();
    },
    
    /**
     * Add point to geometry.  Send the point index to override
     * the behavior of LinearRing that disregards adding duplicate points.
     */
    addPoint: function() {
        this.line.addComponent(this.point.clone(), this.line.components.length);
    },
    
    /**
     * Determine whether to behanve in freehand mode or not.
     *
     * @type Boolean
     */
    freehandMode: function(evt) {
        return (this.freehandToggle && evt[this.freehandToggle]) ?
                    !this.freehand : this.freehand;
    },

    /**
     * Modify the existing geometry given the new point
     * 
     */
    modifyGeometry: function() {
        var index = this.line.components.length - 1;
        this.line.components[index].setX(this.point.x);
        this.line.components[index].setY(this.point.y);
    },
    
    /**
     * Render geometries on the temporary layer.
     */
    drawGeometry: function() {
        this.layer.renderer.drawGeometry(this.line, this.style);
        this.layer.renderer.drawGeometry(this.point, this.style);
    },

    /**
     * Return a clone of the relevant geometry.
     *
     * @type OpenLayers.Geometry.LineString
     */
    geometryClone: function() {
        return this.line.clone();
    },

    /**
     * Handle mouse down.  Add a new point to the geometry and render it.
     * Return determines whether to propagate the event on the map.
     * 
     * @param {Event} evt
     * @type Boolean
     */
    mousedown: function(evt) {
        // ignore double-clicks
        if (this.lastDown && this.lastDown.equals(evt.xy)) {
            return false;
        }
        if(this.lastDown == null) {
            this.createGeometry();
        }
        this.mouseDown = true;
        this.lastDown = evt.xy;
        var lonlat = this.control.map.getLonLatFromPixel(evt.xy);
        this.point.setX(lonlat.lon);
        this.point.setY(lonlat.lat);
        if((this.lastUp == null) || !this.lastUp.equals(evt.xy)) {
            this.addPoint();
        }
        this.drawGeometry();
        this.drawing = true;
        return false;
    },

    /**
     * Handle mouse move.  Adjust the geometry and redraw.
     * Return determines whether to propagate the event on the map.
     * 
     * @param {Event} evt
     * @type Boolean
     */
    mousemove: function (evt) {
        if(this.drawing) { 
            var lonlat = this.map.getLonLatFromPixel(evt.xy);
            this.point.setX(lonlat.lon);
            this.point.setY(lonlat.lat);
            if(this.mouseDown && this.freehandMode(evt)) {
                this.addPoint();
            } else {
                this.modifyGeometry();
            }
            this.drawGeometry();
        }
        return true;
    },
    
    /**
     * Handle mouse up.  Send the latest point in the geometry to the control.
     * Return determines whether to propagate the event on the map.
     * 
     * @param {Event} evt
     * @type Boolean
     */
    mouseup: function (evt) {
        this.mouseDown = false;
        if(this.drawing) {
            if(this.freehandMode(evt)) {
                this.finalize();
            } else {
                if(this.lastUp == null) {
                   this.addPoint();
                }
                this.lastUp = evt.xy;
                this.callback("point", [this.point]);
            }
            return false;
        }
        return true;
    },
  
    /**
     * Handle double-clicks.  Finish the geometry and send it back
     * to the control.
     * 
     * @param {Event} evt
     */
    dblclick: function(evt) {
        if(!this.freehandMode(evt)) {
            var index = this.line.components.length - 1;
            this.line.removeComponent(this.line.components[index]);
            this.finalize(this.line);
        }
        return false;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Handler.Path"
});
/* ======================================================================    OpenLayers/Layer/Boxes.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer.js
 * @requires OpenLayers/Layer/Markers.js
 */
OpenLayers.Layer.Boxes = OpenLayers.Class.create();
OpenLayers.Layer.Boxes.prototype = 
    OpenLayers.Class.inherit( OpenLayers.Layer.Markers, {

    /**
     * @constructor
     */
    initialize: function () {
        OpenLayers.Layer.Markers.prototype.initialize.apply(this, arguments);
    },
    
    /** Calculate the pixel location for the marker, create it, and
     *    add it to the layer's div
     *
     * @private
     *
     * @param {OpenLayers.Marker.Box} marker
     */
    drawMarker: function(marker) {
        var bounds   = marker.bounds;
        var topleft  = this.map.getLayerPxFromLonLat(
                            new OpenLayers.LonLat(bounds.left,  bounds.top));
        var botright = this.map.getLayerPxFromLonLat(
                             new OpenLayers.LonLat(bounds.right, bounds.bottom));
        if (botright == null || topleft == null) {
            marker.display(false);
        } else {
            var sz = new OpenLayers.Size(
                Math.max(1, botright.x - topleft.x),
                Math.max(1, botright.y - topleft.y));
            var markerDiv = marker.draw(topleft, sz);
            if (!marker.drawn) {
                this.div.appendChild(markerDiv);
                marker.drawn = true;
            }
        }
    },


    /** OVERRIDDEN
     * 
     * @param {OpenLayers.Marker} marker
     */
    removeMarker: function(marker) {
        OpenLayers.Util.removeItem(this.markers, marker);
        if ((marker.div != null) &&
            (marker.div.parentNode == this.div) ) {
            this.div.removeChild(marker.div);    
        }
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Boxes"
});
/* ======================================================================    OpenLayers/Layer/GML.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Create a vector layer by parsing a GML file. The GML file is
 * passed in as a parameter.
 * @class
 *
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/Ajax.js
 */
OpenLayers.Layer.GML = OpenLayers.Class.create();
OpenLayers.Layer.GML.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Vector, {
    
    /**
      * Flag for whether the GML data has been loaded yet.
      * @type Boolean
      */
    loaded: false,

    format: null,
    
    /**
     * @constructor
     * 
     * @param {String} name
     * @param {String} url URL of a GML file.
     * @param {Object} options Hashtable of extra options to tag onto the layer.
     * Options renderer {Object}: Typically SvgRenderer or VmlRenderer.
     */
     initialize: function(name, url, options) {
        var newArguments = new Array()
        newArguments.push(name, options);
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, newArguments);
        this.url = url;
    },

    /**
     * Set the visibility flag for the layer and hide/show&redraw accordingly. 
     * Fire event unless otherwise specified
     * GML will be loaded if the layer is being made visible for the first
     * time.
     *  
     * @param {Boolean} visible Whether or not to display the layer 
     *                          (if in range)
     * @param {Boolean} noEvent
     */
    setVisibility: function(visibility, noEvent) {
        OpenLayers.Layer.Vector.prototype.setVisibility.apply(this, arguments);
        if(this.visibility && !this.loaded){
            // Load the GML
            this.loadGML();
        }
    },

    /**
     * If layer is visible and GML has not been loaded, load GML, then load GML
     * and call OpenLayers.Layer.Vector.moveTo() to redraw at the new location.
     * @param {Object} bounds
     * @param {Object} zoomChanged
     * @param {Object} minor
     */
    moveTo:function(bounds, zoomChanged, minor) {
        OpenLayers.Layer.Vector.prototype.moveTo.apply(this, arguments);
        // Wait until initialisation is complete before loading GML
        // otherwise we can get a race condition where the root HTML DOM is
        // loaded after the GML is paited.
        // See http://trac.openlayers.org/ticket/404
        if(this.visibility && !this.loaded){
            this.loadGML();
        }
    },

    loadGML: function() {
        if (!this.loaded) {
            var results = OpenLayers.loadURL(this.url, null, this, this.requestSuccess, this.requestFailure);
            this.loaded = true;
        }    
    },    
        
    
    /**
     * Process GML after it has been loaded.
     * Called by initialise() and loadUrl() after the GML has been loaded.
     * @private
     * @param {String} request
     */
    requestSuccess:function(request) {
        var doc = request.responseXML;
        
        if (!doc || request.fileType!="XML") {
            doc = request.responseText;
        }

        var gml = this.format ? new this.format() : new OpenLayers.Format.GML();
        this.addFeatures(gml.read(doc));
    },
    
    /**
     * Process a failed loading of GML.
     * Called by initialise() and loadUrl() if there was a problem loading GML.
     * @private
     * @param {String} request
     */
    requestFailure: function(request) {
        alert("Error in loading GML file "+this.url);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.GML"
    });
/* ======================================================================    OpenLayers/Layer/GeoRSS.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/Markers.js
 * @requires OpenLayers/Ajax.js
 */
OpenLayers.Layer.GeoRSS = OpenLayers.Class.create();
OpenLayers.Layer.GeoRSS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Markers, {

    /** store url of text file
    * @type str */
    location:null,

    /** @type Array(OpenLayers.Feature) */
    features: null,

    /** @type OpenLayers.Feature */
    selectedFeature: null,

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} location
    */
    initialize: function(name, location) {
        OpenLayers.Layer.Markers.prototype.initialize.apply(this, [name]);
        this.location = location;
        this.features = new Array();
        OpenLayers.loadURL(location, null, this, this.parseData);
    },

    /**
     * 
     */
    destroy: function() {
        this.clearFeatures();
        this.features = null;
        OpenLayers.Layer.Markers.prototype.destroy.apply(this, arguments);
    },
        
    /**
     * @param {XMLHttpRequest} ajaxRequest
     */
    parseData: function(ajaxRequest) {
        var doc = ajaxRequest.responseXML;
        if (!doc || ajaxRequest.fileType!="XML") {
            doc = OpenLayers.parseXMLString(ajaxRequest.responseText);
        }
        
        this.name = null;
        try {
            this.name = doc.getElementsByTagNameNS('*', 'title')[0].firstChild.nodeValue;
        }
        catch (e) {
            this.name = doc.getElementsByTagName('title')[0].firstChild.nodeValue;
        }
       
        /* Try RSS items first, then Atom entries */
        var itemlist = null;
        try {
            itemlist = doc.getElementsByTagNameNS('*', 'item');
        }
        catch (e) {
            itemlist = doc.getElementsByTagName('item');
        }

        if (itemlist.length == 0) {
            try {
                itemlist = doc.getElementsByTagNameNS('*', 'entry');
            }
            catch(e) {
                itemlist = doc.getElementsByTagName('entry');
            }
        }

        for (var i = 0; i < itemlist.length; i++) {
            var data = {};
            var point = OpenLayers.Util.getNodes(itemlist[i], 'georss:point');
            var lat = OpenLayers.Util.getNodes(itemlist[i], 'geo:lat');
            var lon = OpenLayers.Util.getNodes(itemlist[i], 'geo:long');
            if (point.length > 0) {
                var location = point[0].firstChild.nodeValue.split(" ");
                
                if (location.length !=2) {
                    var location = point[0].firstChild.nodeValue.split(",");
                }
            } else if (lat.length > 0 && lon.length > 0) {
                var location = [parseFloat(lat[0].firstChild.nodeValue), parseFloat(lon[0].firstChild.nodeValue)];
            } else {
                continue;
            }
            location = new OpenLayers.LonLat(parseFloat(location[1]), parseFloat(location[0]));
            
            /* Provide defaults for title and description */
            var title = "Untitled";
            try {
              title = OpenLayers.Util.getNodes(itemlist[i], 
                        "title")[0].firstChild.nodeValue;
            }
            catch (e) { title="Untitled"; }
           
            /* First try RSS descriptions, then Atom summaries */
            var descr_nodes = null;
            try {
                descr_nodes = itemlist[i].getElementsByTagNameNS("*",
                                                "description");
            }
            catch (e) {
                descr_nodes = itemlist[i].getElementsByTagName("description");
            }
            if (descr_nodes.length == 0) {
                try {
                    descr_nodes = itemlist[i].getElementsByTagNameNS("*",
                                                "summary");
                }
                catch (e) {
                    descr_nodes = itemlist[i].getElementsByTagName("summary");
                }
            }

            var description = "No description.";
            try {
              description = descr_nodes[0].firstChild.nodeValue;
            }
            catch (e) { description="No description."; }

            /* If no link URL is found in the first child node, try the
               href attribute */
            try {
              var link = OpenLayers.Util.getNodes(itemlist[i], "link")[0].firstChild.nodeValue;
            } 
            catch (e) {
              try {
                var link = OpenLayers.Util.getNodes(itemlist[i], "link")[0].getAttribute("href");
              }
              catch (e) {}
            }

            data.icon = OpenLayers.Marker.defaultIcon();
            data.popupSize = new OpenLayers.Size(250, 120);
            if ((title != null) && (description != null)) {
                contentHTML = '<div class="olLayerGeoRSSClose">[x]</div>'; 
                contentHTML += '<div class="olLayerGeoRSSTitle">';
                if (link) contentHTML += '<a class="link" href="'+link+'" target="_blank">';
                contentHTML += title;
                if (link) contentHTML += '</a>';
                contentHTML += '</div>';
                contentHTML += '<div style="" class="olLayerGeoRSSDescription">';
                contentHTML += description;
                contentHTML += '</div>';
                data['popupContentHTML'] = contentHTML;                
            }
            var feature = new OpenLayers.Feature(this, location, data);
            this.features.push(feature);
            var marker = feature.createMarker();
            marker.events.register('click', feature, this.markerClick);
            this.addMarker(marker);
        }
    },
    
    /**
     * @param {Event} evt
     */
    markerClick: function(evt) {
        sameMarkerClicked = (this == this.layer.selectedFeature);
        this.layer.selectedFeature = (!sameMarkerClicked) ? this : null;
        for(var i=0; i < this.layer.map.popups.length; i++) {
            this.layer.map.removePopup(this.layer.map.popups[i]);
        }
        if (!sameMarkerClicked) {
            var popup = this.createPopup();
            OpenLayers.Event.observe(popup.div, "click",
            function() { 
              for(var i=0; i < this.layer.map.popups.length; i++) { 
                this.layer.map.removePopup(this.layer.map.popups[i]); 
              } 
            }.bindAsEventListener(this));
            this.layer.map.addPopup(popup); 
        }
        OpenLayers.Event.stop(evt);
    },

    /**
     * 
     */
    clearFeatures: function() {
        if (this.features != null) {
            while(this.features.length > 0) {
                var feature = this.features[0];
                OpenLayers.Util.removeItem(this.features, feature);
                feature.destroy();
            }
        }        
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.GeoRSS"
});
     
    
/* ======================================================================    OpenLayers/Layer/Google.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/EventPane.js
 * @requires OpenLayers/Layer/FixedZoomLevels.js
 */
OpenLayers.Layer.Google = OpenLayers.Class.create();
OpenLayers.Layer.Google.prototype =
  OpenLayers.Class.inherit( OpenLayers.Layer.EventPane, 
                            OpenLayers.Layer.FixedZoomLevels, {
    
    /** @final @type int */
    MIN_ZOOM_LEVEL: 0,
    
    /** @final @type int */
    MAX_ZOOM_LEVEL: 17,

    /** Hardcode these resolutions so that they are more closely
     *   tied with the standard wms projection
     * 
     * @final @type Array(float) */
    RESOLUTIONS: [1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],

    /** @type GMapType */
    type: null,

    /** 
     * @constructor
     * 
     * @param {String} name
     */
    initialize: function(name, options) {
        OpenLayers.Layer.EventPane.prototype.initialize.apply(this, arguments);
        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, 
                                                                    arguments);
        this.addContainerPxFunction();
    },
    
    /** Load the GMap and register appropriate event listeners. If we can't 
     *   load GMap2, then display a warning message.
     * 
     * @private
     */
    loadMapObject:function() {
        
        //has gmaps library has been loaded?
        try {
            // create GMap, hide nav controls
            this.mapObject = new GMap2( this.div );

            // move the ToS and branding stuff up to the pane
            // thanks a *mil* Erik for thinking of this
            var poweredBy = this.div.lastChild;
            this.div.removeChild(poweredBy);
            this.pane.appendChild(poweredBy);
            poweredBy.className = "olLayerGooglePoweredBy gmnoprint";
            poweredBy.style.left = "";
            poweredBy.style.bottom = "";

            var termsOfUse = this.div.lastChild;
            this.div.removeChild(termsOfUse);
            this.pane.appendChild(termsOfUse);
            termsOfUse.className = "olLayerGoogleCopyright";
            termsOfUse.style.right = "";
            termsOfUse.style.bottom = "";

        } catch (e) {
            // do not crash
        }
               
    },

    /** Overridden from EventPane because if a map type has been specified, 
     *   we need to attach a listener for the first moveend -- this is how 
     *   we will know that the map has been centered. Only once the map has 
     *   been centered is it safe to change the gmap object's map type. 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.EventPane.prototype.setMap.apply(this, arguments);

        if (this.type != null) {
            this.map.events.register("moveend", this, this.setMapType);
        }
    },
    
    /** The map has been centered, and a map type was specified, so we 
     *   set the map type on the gmap object, then unregister the listener
     *   so that we dont keep doing this every time the map moves.
     * 
     * @private
     */
    setMapType: function() {
        if (this.mapObject.getCenter() != null) {
            this.mapObject.setMapType(this.type);
            this.map.events.unregister("moveend", this, this.setMapType);
        }
    },

    /**
     * @param {Event} evt
     */
    onMapResize: function() {
        this.mapObject.checkResize();  
    },


    /**
     * @param {OpenLayers.Bounds} bounds
     *
     * @returns Corresponding zoom level for a specified Bounds. 
     *          If mapObject is not loaded or not centered, returns null
     * @type int
     *
    getZoomForExtent: function (bounds) {
        var zoom = null;
        if (this.mapObject != null) {
            var moBounds = this.getMapObjectBoundsFromOLBounds(bounds);
            var moZoom = this.getMapObjectZoomFromMapObjectBounds(moBounds);

            //make sure zoom is within bounds    
            var moZoom = Math.min(Math.max(moZoom, this.minZoomLevel), 
                                 this.maxZoomLevel);

            zoom = this.getOLZoomFromMapObjectZoom(moZoom);
        }
        return zoom;
    },
    
    */
    
  //
  // TRANSLATION: MapObject Bounds <-> OpenLayers.Bounds
  //

    /**
     * @param {Object} moBounds
     * 
     * @returns An OpenLayers.Bounds, translated from the passed-in
     *          MapObject Bounds
     *          Returns null if null value is passed in
     * @type OpenLayers.Bounds
     */
    getOLBoundsFromMapObjectBounds: function(moBounds) {
        var olBounds = null;
        if (moBounds != null) {
            var sw = moBounds.getSouthWest();
            var ne = moBounds.getNorthEast();
            olBounds = new OpenLayers.Bounds(sw.lng(), 
                                             sw.lat(), 
                                             ne.lng(), 
                                             ne.lat() );
        }
        return olBounds;
    },

    /**
     * @param {OpenLayers.Bounds} olBounds
     * 
     * @returns A MapObject Bounds, translated from olBounds
     *          Returns null if null value is passed in
     * @type Object
     */
    getMapObjectBoundsFromOLBounds: function(olBounds) {
        var moBounds = null;
        if (olBounds != null) {
            var sw = new GLatLng(olBounds.bottom, olBounds.left);
            var ne = new GLatLng(olBounds.top, olBounds.right);
            moBounds = new GLatLngBounds(sw, ne);
        }
        return moBounds;
    },
    




    /** Hack-on function because GMAPS does not give it to us
     * 
     * @param {GLatLng} gLatLng 
     *
     * @returns A GPoint specifying gLatLng translated into "Container" coords
     * @type GPoint
     */
    addContainerPxFunction: function() {
        if (typeof GMap2 != "undefined" && !GMap2.fromLatLngToContainerPixel) {
          
            GMap2.prototype.fromLatLngToContainerPixel = function(gLatLng) {
          
                // first we translate into "DivPixel"
                    var gPoint = this.fromLatLngToDivPixel(gLatLng);
      
                    // locate the sliding "Div" div
                //  it seems like "b" is the main div
                    var div = this.b.firstChild.firstChild;
      
                    // adjust by the offset of "Div" and voila!
                gPoint.x += div.offsetLeft;
                gPoint.y += div.offsetTop;
    
                return gPoint;
            };
        }
    },

    /** 
     * @return String with information on why layer is broken, how to get
     *          it working.
     * @type String
     */
    getWarningHTML:function() {

        var html = "";
        html += "The Google Layer was unable to load correctly.<br>";
        html += "<br>";
        html += "To get rid of this message, select a new BaseLayer "
        html += "in the layer switcher in the upper-right corner.<br>";
        html += "<br>";
        html += "Most likely, this is because the Google Maps library";
        html += " script was either not included, or does not contain the";
        html += " correct API key for your site.<br>";
        html += "<br>";
        html += "Developers: For help getting this working correctly, ";
        html += "<a href='http://trac.openlayers.org/wiki/Google' "
        html +=  "target='_blank'>";
        html +=     "click here";
        html += "</a>";
        
        return html;
    },


    /************************************
     *                                  *
     *   MapObject Interface Controls   *
     *                                  *
     ************************************/


  // Get&Set Center, Zoom

    /** Set the mapObject to the specified center and zoom
     * 
     * @param {Object} center MapObject LonLat format
     * @param {int} zoom MapObject zoom format
     */
    setMapObjectCenter: function(center, zoom) {
        this.mapObject.setCenter(center, zoom); 
    },
   
    /**
     * @returns the mapObject's current center in Map Object format
     * @type Object
     */
    getMapObjectCenter: function() {
        return this.mapObject.getCenter();
    },

    /** 
     * @returns the mapObject's current zoom, in Map Object format
     * @type int
     */
    getMapObjectZoom: function() {
        return this.mapObject.getZoom();
    },


  // LonLat - Pixel Translation
  
    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns MapObject LonLat translated from MapObject Pixel
     * @type Object
     */
    getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
        return this.mapObject.fromContainerPixelToLatLng(moPixel);
    },

    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns MapObject Pixel translated from MapObject LonLat
     * @type Object
     */
    getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
        return this.mapObject.fromLatLngToContainerPixel(moLonLat);
    },

  
  // Bounds
  
    /** 
     * @param {Object} moBounds MapObject Bounds format
     * 
     * @returns MapObject Zoom for specified MapObject Bounds
     * @type Object
     */
    getMapObjectZoomFromMapObjectBounds: function(moBounds) {
        return this.mapObject.getBoundsZoomLevel(moBounds);
    },

    /************************************
     *                                  *
     *       MapObject Primitives       *
     *                                  *
     ************************************/


  // LonLat
    
    /**
     * @param {Object} moLonLat MapObject LonLat format
     * 
     * @returns Longitude of the given MapObject LonLat
     * @type float
     */
    getLongitudeFromMapObjectLonLat: function(moLonLat) {
        return moLonLat.lng();  
    },

    /**
     * @param {Object} moLonLat MapObject LonLat format
     * 
     * @returns Latitude of the given MapObject LonLat
     * @type float
     */
    getLatitudeFromMapObjectLonLat: function(moLonLat) {
        return moLonLat.lat();  
    },
    
    /**
     * @param {int} lon float
     * @param {int} lat float
     * 
     * @returns MapObject LonLat built from lon and lat params
     * @type Object
     */
    getMapObjectLonLatFromLonLat: function(lon, lat) {
        return new GLatLng(lat, lon);
    },

  // Pixel
    
    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns X value of the MapObject Pixel
     * @type int
     */
    getXFromMapObjectPixel: function(moPixel) {
        return moPixel.x;
    },

    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns Y value of the MapObject Pixel
     * @type int
     */
    getYFromMapObjectPixel: function(moPixel) {
        return moPixel.y;
    },

    /** 
     * @param {int} x
     * @param {int} y
     * 
     * @returns MapObject Pixel from x and y parameters
     * @type Object
     */
    getMapObjectPixelFromXY: function(x, y) {
        return new GPoint(x, y);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Google"
});
/* ======================================================================    OpenLayers/Layer/Grid.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/HTTPRequest.js
 */
OpenLayers.Layer.Grid = OpenLayers.Class.create();
OpenLayers.Layer.Grid.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.HTTPRequest, {
    
    /** @type OpenLayers.Size */
    tileSize: null,
    
    /** this is an array of rows, each row is an array of tiles
     * 
     * @type Array(Array) */
    grid: null,

    /** @type Integer */
    buffer: 2,

    /**
     * @constructor
     * 
     * @param {String} name
     * @param {String} url
     * @param {Object} params
     * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, url, params, options) {
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, 
                                                                arguments);
        this.grid = new Array();
    },

    /** on destroy, clear the grid.
     *
     */
    destroy: function() {
        this.clearGrid();
        this.grid = null;
        this.tileSize = null;
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments); 
    },

    /** go through and remove all tiles from the grid, calling
     *    destroy() on each of them to kill circular references
     * 
     * @private
     */
    clearGrid:function() {
        if (this.grid) {
            for(var iRow=0; iRow < this.grid.length; iRow++) {
                var row = this.grid[iRow];
                for(var iCol=0; iCol < row.length; iCol++) {
                    row[iCol].destroy();
                }
            }
            this.grid = [];
        }
    },

    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.Grid
     * @type OpenLayers.Layer.Grid
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.Grid(this.name,
                                            this.url,
                                            this.params,
                                            this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }
        
        // we do not want to copy reference to grid, so we make a new array
        obj.grid = new Array();

        return obj;
    },    

    /** When the layer is added to a map, then we can ask the map for
     *   its default tile size
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.HTTPRequest.prototype.setMap.apply(this, arguments);
        if (this.tileSize == null) {
            this.tileSize = this.map.getTileSize();
        }
    },

    /** This function is called whenever the map is moved. All the moving
     * of actual 'tiles' is done by the map, but moveTo's role is to accept
     * a bounds and make sure the data that that bounds requires is pre-loaded.
     * 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this, arguments);
        
        if (bounds == null) {
            bounds = this.map.getExtent();
        }
        if (bounds != null) {
            if (!this.grid.length || zoomChanged 
                || !this.getGridBounds().containsBounds(bounds, true)) { 
                this._initTiles();
            } else {
                var buffer = (this.buffer) ? this.buffer*1.5 : 1;
                while (true) {
                    var tlLayer = this.grid[0][0].position;
                    var tlViewPort = 
                        this.map.getViewPortPxFromLayerPx(tlLayer);
                    if (tlViewPort.x > -this.tileSize.w * (buffer - 1)) {
                        this.shiftColumn(true);
                    } else if (tlViewPort.x < -this.tileSize.w * buffer) {
                        this.shiftColumn(false);
                    } else if (tlViewPort.y > -this.tileSize.h * (buffer - 1)) {
                        this.shiftRow(true);
                    } else if (tlViewPort.y < -this.tileSize.h * buffer) {
                        this.shiftRow(false);
                    } else {
                        break;
                    }
                };
                if (this.buffer == 0) {
                    for (var r=0, rl=this.grid.length; r<rl; r++) {
                        var row = this.grid[r];
                        for (var c=0, cl=row.length; c<cl; c++) {
                            var tile = row[c];
                            if (!tile.drawn && tile.bounds.intersectsBounds(bounds, false)) {
                                tile.draw();
                            }
                        }
                    }
                }
            }
        }
    },
    
    /**
     * @private
     * 
     * @returns A Bounds object representing the bounds of all the currently 
     *           loaded tiles (including those partially or not at all seen 
     *           onscreen)
     * @type OpenLayers.Bounds
     */
    getGridBounds:function() {
        
        var bottom = this.grid.length - 1;
        var bottomLeftTile = this.grid[bottom][0];

        var right = this.grid[0].length - 1; 
        var topRightTile = this.grid[0][right];

        return new OpenLayers.Bounds(bottomLeftTile.bounds.left, 
                                     bottomLeftTile.bounds.bottom,
                                     topRightTile.bounds.right, 
                                     topRightTile.bounds.top);
    },

    /**
     * @private
     */
    _initTiles:function() {
        
        // work out mininum number of rows and columns; this is the number of
        // tiles required to cover the viewport plus one for panning
        var viewSize = this.map.getSize();
        var minRows = Math.ceil(viewSize.h/this.tileSize.h) + 1;
        var minCols = Math.ceil(viewSize.w/this.tileSize.w) + 1;
        
        var bounds = this.map.getExtent();
        var extent = this.map.getMaxExtent();
        var resolution = this.map.getResolution();
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        
        var offsetlon = bounds.left - extent.left;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = extent.left + tilecol * tilelon;
        
        var offsetlat = bounds.top - (extent.bottom + tilelat);  
        var tilerow = Math.ceil(offsetlat/tilelat) + this.buffer;
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsety = -tilerowremain * this.tileSize.h;
        var tileoffsetlat = extent.bottom + tilerow * tilelat;
        
        tileoffsetx = Math.round(tileoffsetx); // heaven help us
        tileoffsety = Math.round(tileoffsety);

        this.origin = new OpenLayers.Pixel(tileoffsetx, tileoffsety);

        var startX = tileoffsetx; 
        var startLon = tileoffsetlon;

        var rowidx = 0;
    
        do {
            var row = this.grid[rowidx++];
            if (!row) {
                row = new Array();
                this.grid.push(row);
            }

            tileoffsetlon = startLon;
            tileoffsetx = startX;
            var colidx = 0;
 
            do {
                var tileBounds = new OpenLayers.Bounds(tileoffsetlon, 
                                                      tileoffsetlat, 
                                                      tileoffsetlon + tilelon,
                                                      tileoffsetlat + tilelat);

                var x = tileoffsetx;
                x -= parseInt(this.map.layerContainerDiv.style.left);

                var y = tileoffsety;
                y -= parseInt(this.map.layerContainerDiv.style.top);

                var px = new OpenLayers.Pixel(x, y);
                var tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }
     
                tileoffsetlon += tilelon;       
                tileoffsetx += this.tileSize.w;
            } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer)
                     || colidx < minCols)  
             
            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while((tileoffsetlat >= bounds.bottom - tilelat * this.buffer)
                || rowidx < minRows)
        
        // remove extra rows
        while (this.grid.length > rowidx) {
            var row = this.grid.pop();
            for (var i=0, l=row.length; i<l; i++) {
                row[i].destroy();
            }
        }
        
        // remove extra columns
        while (this.grid[0].length > colidx) {
            for (var i=0, l=this.grid.length; i<l; i++) {
                var row = this.grid[i];
                var tile = row.pop();
                tile.destroy();
            }
        }
        
        //now actually draw the tiles
        this.spiralTileLoad();
    },
    
    /** 
     * @private 
     * 
     *   Starts at the top right corner of the grid and proceeds in a spiral 
     *    towards the center, adding tiles one at a time to the beginning of a 
     *    queue. 
     * 
     *   Once all the grid's tiles have been added to the queue, we go back 
     *    and iterate through the queue (thus reversing the spiral order from 
     *    outside-in to inside-out), calling draw() on each tile. 
     */
    spiralTileLoad: function() {
        var tileQueue = new Array();
 
        var directions = ["right", "down", "left", "up"];

        var iRow = 0;
        var iCell = -1;
        var direction = OpenLayers.Util.indexOf(directions, "right");
        var directionsTried = 0;
        
        while( directionsTried < directions.length) {

            var testRow = iRow;
            var testCell = iCell;

            switch (directions[direction]) {
                case "right":
                    testCell++;
                    break;
                case "down":
                    testRow++;
                    break;
                case "left":
                    testCell--;
                    break;
                case "up":
                    testRow--;
                    break;
            } 
    
            // if the test grid coordinates are within the bounds of the 
            //  grid, get a reference to the tile.
            var tile = null;
            if ((testRow < this.grid.length) && (testRow >= 0) &&
                (testCell < this.grid[0].length) && (testCell >= 0)) {
                tile = this.grid[testRow][testCell];
            }
            
            if ((tile != null) && (!tile.queued)) {
                //add tile to beginning of queue, mark it as queued.
                tileQueue.unshift(tile);
                tile.queued = true;
                
                //restart the directions counter and take on the new coords
                directionsTried = 0;
                iRow = testRow;
                iCell = testCell;
            } else {
                //need to try to load a tile in a different direction
                direction = (direction + 1) % 4;
                directionsTried++;
            }
        } 
        
        // now we go through and draw the tiles in forward order
        for(var i=0; i < tileQueue.length; i++) {
            var tile = tileQueue[i]
            tile.draw();
            //mark tile as unqueued for the next time (since tiles are reused)
            tile.queued = false;       
        }
    },

    /**
     * addTile gives subclasses of Grid the opportunity to create an 
     * OpenLayer.Tile of their choosing. The implementer should initialize 
     * the new tile and take whatever steps necessary to display it.
     *
     * @param {OpenLayers.Bounds} bounds
     *
     * @returns The added OpenLayers.Tile
     * @type OpenLayers.Tile
     */
    addTile:function(bounds, position) {
        // Should be implemented by subclasses
    },

    /**
     * Once params have been changed, we will need to re-init our tiles
     *
     * @param {Object} newParams Hashtable of new params to use
     */
    mergeNewParams:function(newArguments) {
        OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this,
                                                                [newArguments]);

        if (this.map != null) {
            this._initTiles();
        }
    },

    
    /**
     * @private 
     * 
     * @param {Boolean} prepend if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftRow:function(prepend) {
        var modelRowIndex = (prepend) ? 0 : (this.grid.length - 1);
        var modelRow = this.grid[modelRowIndex];

        var resolution = this.map.getResolution();
        var deltaY = (prepend) ? -this.tileSize.h : this.tileSize.h;
        var deltaLat = resolution * -deltaY;

        var row = (prepend) ? this.grid.pop() : this.grid.shift();

        for (var i=0; i < modelRow.length; i++) {
            var modelTile = modelRow[i];
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.bottom = bounds.bottom + deltaLat;
            bounds.top = bounds.top + deltaLat;
            position.y = position.y + deltaY;
            row[i].moveTo(bounds, position);
        }

        if (prepend) {
            this.grid.unshift(row);
        } else {
            this.grid.push(row);
        }
    },

    /**
     * @private
     * 
     * @param {Boolean} prepend if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftColumn: function(prepend) {
        var deltaX = (prepend) ? -this.tileSize.w : this.tileSize.w;
        var resolution = this.map.getResolution();
        var deltaLon = resolution * deltaX;

        for (var i=0; i<this.grid.length; i++) {
            var row = this.grid[i];
            var modelTileIndex = (prepend) ? 0 : (row.length - 1);
            var modelTile = row[modelTileIndex];
            
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.left = bounds.left + deltaLon;
            bounds.right = bounds.right + deltaLon;
            position.x = position.x + deltaX;

            var tile = prepend ? this.grid[i].pop() : this.grid[i].shift()
            tile.moveTo(bounds, position);
            if (prepend) {
                this.grid[i].unshift(tile);
            } else {
                this.grid[i].push(tile);
            }
        }
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Grid"
});
/* ======================================================================    OpenLayers/Layer/MultiMap.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Layer/EventPane.js
 * @requires OpenLayers/Layer/FixedZoomLevels.js
 */
OpenLayers.Layer.MultiMap = OpenLayers.Class.create();
OpenLayers.Layer.MultiMap.prototype =
  OpenLayers.Class.inherit( OpenLayers.Layer.EventPane, 
                            OpenLayers.Layer.FixedZoomLevels, {
    
    /** @final @type int */
    MIN_ZOOM_LEVEL: 1,
    
    /** @final @type int */
    MAX_ZOOM_LEVEL: 17,

    /** Hardcode these resolutions so that they are more closely
     *   tied with the standard wms projection
     * 
     * @final @type Array(float) */
    RESOLUTIONS: [9, 1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],

    /** @type VEMapType */
    type: null,

    /** 
     * @constructor
     * 
     * @param {String} name
     */
    initialize: function(name, options) {
        OpenLayers.Layer.EventPane.prototype.initialize.apply(this, arguments);
        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, 
                                                                    arguments);
    },
    
    /**
     * 
     */
    loadMapObject:function() {
        try { //crash proofing
            this.mapObject = new MultimapViewer(this.div);
        } catch (e) { }
    },

    /** 
     * @return String with information on why layer is broken, how to get
     *          it working.
     * @type String
     */
    getWarningHTML:function() {

        var html = "";
        html += "The MM Layer was unable to load correctly.<br>";
        html += "<br>";
        html += "To get rid of this message, select a new BaseLayer "
        html += "in the layer switcher in the upper-right corner.<br>";
        html += "<br>";
        html += "Most likely, this is because the MM library";
        html += " script was either not correctly included.<br>";
        html += "<br>";
        html += "Demmlopers: For help getting this working correctly, ";
        html += "<a href='http://trac.openlayers.org/wiki/MultiMap' "
        html +=  "target='_blank'>";
        html +=     "click here";
        html += "</a>";

        return html;
    },



    /************************************
     *                                  *
     *   MapObject Interface Controls   *
     *                                  *
     ************************************/


  // Get&Set Center, Zoom

    /** Set the mapObject to the specified center and zoom
     * 
     * @param {Object} center MapObject LonLat format
     * @param {int} zoom MapObject zoom format
     */
    setMapObjectCenter: function(center, zoom) {
        this.mapObject.goToPosition(center, zoom); 
    },
   
    /**
     * @returns the mapObject's current center in Map Object format
     * @type Object
     */
    getMapObjectCenter: function() {
        return this.mapObject.getCurrentPosition();
    },

    /** 
     * @returns the mapObject's current zoom, in Map Object format
     * @type int
     */
    getMapObjectZoom: function() {
        return this.mapObject.getZoomFactor();
    },


  // LonLat - Pixel Translation
  
    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns MapObject LonLat translated from MapObject Pixel
     * @type Object
     */
    getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
        moPixel.x = moPixel.x - (this.map.getSize().w/2);
        moPixel.y = moPixel.y - (this.map.getSize().h/2);
        return this.mapObject.getMapPositionAt(moPixel);
    },

    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns MapObject Pixel translated from MapObject LonLat
     * @type Object
     */
    getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
        return this.mapObject.geoPosToContainerPixels(moLonLat);
    },


    /************************************
     *                                  *
     *       MapObject Primitives       *
     *                                  *
     ************************************/


  // LonLat
    
    /**
     * @param {Object} moLonLat MapObject LonLat format
     * 
     * @returns Longitude of the given MapObject LonLat
     * @type float
     */
    getLongitudeFromMapObjectLonLat: function(moLonLat) {
        return moLonLat.lon;
    },

    /**
     * @param {Object} moLonLat MapObject LonLat format
     * 
     * @returns Latitude of the given MapObject LonLat
     * @type float
     */
    getLatitudeFromMapObjectLonLat: function(moLonLat) {
        return moLonLat.lat;
    },

    /**
     * @param {int} lon float
     * @param {int} lat float
     * 
     * @returns MapObject LonLat built from lon and lat params
     * @type Object
     */
    getMapObjectLonLatFromLonLat: function(lon, lat) {
        return new MMLatLon(lat, lon);
    },

  // Pixel
    
    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns X value of the MapObject Pixel
     * @type int
     */
    getXFromMapObjectPixel: function(moPixel) {
        return moPixel.x;
    },

    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns Y value of the MapObject Pixel
     * @type int
     */
    getYFromMapObjectPixel: function(moPixel) {
        return moPixel.y;
    },

    /** 
     * @param {int} x
     * @param {int} y
     * 
     * @returns MapObject Pixel from x and y parameters
     * @type Object
     */
    getMapObjectPixelFromXY: function(x, y) {
        return new MMPoint(x, y);
    },


    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.MultiMap"
});
/* ======================================================================    OpenLayers/Layer/Text.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/Markers.js
 */
OpenLayers.Layer.Text = OpenLayers.Class.create();
OpenLayers.Layer.Text.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Markers, {

    /** store url of text file - this should be specified in the 
     *   "options" hashtable
    * @type str */
    location:null,

    /** @type Array(OpenLayers.Feature) */
    features: null,

    /** @type OpenLayers.Feature */
    selectedFeature: null,

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} location
    * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, options) {
        OpenLayers.Layer.Markers.prototype.initialize.apply(this, arguments);
        this.features = new Array();
        if (this.location != null) {
            OpenLayers.loadURL(this.location, null, this, this.parseData);
        }
    },

   /**
     * 
     */
    destroy: function() {
        this.clearFeatures();
        this.features = null;
        OpenLayers.Layer.Markers.prototype.destroy.apply(this, arguments);
    },
    
    
    /**
     * @param {XMLHttpRequest} ajaxRequest
     */
    parseData: function(ajaxRequest) {
        var text = ajaxRequest.responseText;
        var lines = text.split('\n');
        var columns;
        // length - 1 to allow for trailing new line
        for (var lcv = 0; lcv < (lines.length - 1); lcv++) {
            var currLine = lines[lcv].replace(/^\s*/,'').replace(/\s*$/,'');
        
            if (currLine.charAt(0) != '#') { /* not a comment */
            
                if (!columns) {
                    //First line is columns
                    columns = currLine.split('\t');
                } else {
                    var vals = currLine.split('\t');
                    var location = new OpenLayers.LonLat(0,0);
                    var title; var url;
                    var icon, iconSize, iconOffset;
                    var set = false;
                    for (var valIndex = 0; valIndex < vals.length; valIndex++) {
                        if (vals[valIndex]) {
                            if (columns[valIndex] == 'point') {
                                var coords = vals[valIndex].split(',');
                                location.lat = parseFloat(coords[0]);
                                location.lon = parseFloat(coords[1]);
                                set = true;
                            } else if (columns[valIndex] == 'lat') {
                                location.lat = parseFloat(vals[valIndex]);
                                set = true;
                            } else if (columns[valIndex] == 'lon') {
                                location.lon = parseFloat(vals[valIndex]);
                                set = true;
                            } else if (columns[valIndex] == 'title')
                                title = vals[valIndex];
                            else if (columns[valIndex] == 'image' ||
                                     columns[valIndex] == 'icon')
                                url = vals[valIndex];
                            else if (columns[valIndex] == 'iconSize') {
                                var size = vals[valIndex].split(',');
                                iconSize = new OpenLayers.Size(parseFloat(size[0]),
                                                           parseFloat(size[1]));
                            } else if (columns[valIndex] == 'iconOffset') {
                                var offset = vals[valIndex].split(',');
                                iconOffset = new OpenLayers.Pixel(parseFloat(offset[0]),
                                                           parseFloat(offset[1]));
                            } else if (columns[valIndex] == 'title') {
                                title = vals[valIndex];
                            } else if (columns[valIndex] == 'description') {
                                description = vals[valIndex];
                            }
                        }
                    }
                    if (set) {
                      var data = new Object();
                      if (url != null) {
                          data.icon = new OpenLayers.Icon(url, 
                                                          iconSize, 
                                                          iconOffset);
                      } else {
                          data.icon = OpenLayers.Marker.defaultIcon();

                          //allows for the case where the image url is not 
                          // specified but the size is. use a default icon
                          // but change the size
                          if (iconSize != null) {
                              data.icon.setSize(iconSize);
                          }
                        
                      }
                      if ((title != null) && (description != null)) {
                          data['popupContentHTML'] = '<h2>'+title+'</h2><p>'+description+'</p>';
                      }
                      var feature = new OpenLayers.Feature(this, location, data);
                      this.features.push(feature);
                      var marker = feature.createMarker();
                      if ((title != null) && (description != null)) {
                        marker.events.register('click', feature, this.markerClick);
                      }
                      this.addMarker(marker);
                    }
                }
            }
        }
    },
    
    /**
     * @param {Event} evt
     */
    markerClick: function(evt) {
        sameMarkerClicked = (this == this.layer.selectedFeature);
        this.layer.selectedFeature = (!sameMarkerClicked) ? this : null;
        for(var i=0; i < this.layer.map.popups.length; i++) {
            this.layer.map.removePopup(this.layer.map.popups[i]);
        }
        if (!sameMarkerClicked) {
            this.layer.map.addPopup(this.createPopup()); 
        }
        OpenLayers.Event.stop(evt);
    },

    /**
     * 
     */
    clearFeatures: function() {
        if (this.features != null) {
            while(this.features.length > 0) {
                var feature = this.features[0];
                OpenLayers.Util.removeItem(this.features, feature);
                feature.destroy();
            }
        }        
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Text"
});
     
    
/* ======================================================================    OpenLayers/Layer/VirtualEarth.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/EventPane.js
 * @requires OpenLayers/Layer/FixedZoomLevels.js
 */
OpenLayers.Layer.VirtualEarth = OpenLayers.Class.create();
OpenLayers.Layer.VirtualEarth.prototype =
  OpenLayers.Class.inherit( OpenLayers.Layer.EventPane, 
                            OpenLayers.Layer.FixedZoomLevels, {
    
    /** @final @type int */
    MIN_ZOOM_LEVEL: 1,
    
    /** @final @type int */
    MAX_ZOOM_LEVEL: 17,

    /** Hardcode these resolutions so that they are more closely
     *   tied with the standard wms projection
     * 
     * @final @type Array(float) */
    RESOLUTIONS: [1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],

    /** @type VEMapType */
    type: null,

    /** 
     * @constructor
     * 
     * @param {String} name
     */
    initialize: function(name, options) {
        OpenLayers.Layer.EventPane.prototype.initialize.apply(this, arguments);
        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, 
                                                                    arguments);
    },
    
    /**
     * 
     */
    loadMapObject:function() {

        // create div and set to same size as map
        var veDiv = OpenLayers.Util.createDiv(this.name);
        var sz = this.map.getSize();
        veDiv.style.width = sz.w;
        veDiv.style.height = sz.h;
        this.div.appendChild(veDiv);

        try { // crash prevention
            this.mapObject = new VEMap(this.name);
        } catch (e) { }

        if (this.mapObject != null) {
            try { // this is to catch a Mozilla bug without falling apart
                this.mapObject.LoadMap(null, null, this.type);
            } catch (e) { }
            this.mapObject.HideDashboard();
        }
    },

    /** 
     * @return String with information on why layer is broken, how to get
     *          it working.
     * @type String
     */
    getWarningHTML:function() {

        var html = "";
        html += "The VE Layer was unable to load correctly.<br>";
        html += "<br>";
        html += "To get rid of this message, select a new BaseLayer "
        html += "in the layer switcher in the upper-right corner.<br>";
        html += "<br>";
        html += "Most likely, this is because the VE library";
        html += " script was either not correctly included.<br>";
        html += "<br>";
        html += "Developers: For help getting this working correctly, ";
        html += "<a href='http://trac.openlayers.org/wiki/VirtualEarth' "
        html +=  "target='_blank'>";
        html +=     "click here";
        html += "</a>";

        return html;
    },



    /************************************
     *                                  *
     *   MapObject Interface Controls   *
     *                                  *
     ************************************/


  // Get&Set Center, Zoom

    /** Set the mapObject to the specified center and zoom
     * 
     * @param {Object} center MapObject LonLat format
     * @param {int} zoom MapObject zoom format
     */
    setMapObjectCenter: function(center, zoom) {
        this.mapObject.SetCenterAndZoom(center, zoom); 
    },
   
    /**
     * @returns the mapObject's current center in Map Object format
     * @type Object
     */
    getMapObjectCenter: function() {
        return this.mapObject.GetCenter();
    },

    /** 
     * @returns the mapObject's current zoom, in Map Object format
     * @type int
     */
    getMapObjectZoom: function() {
        return this.mapObject.GetZoomLevel();
    },


  // LonLat - Pixel Translation
  
    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns MapObject LonLat translated from MapObject Pixel
     * @type Object
     */
    getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
        return this.mapObject.PixelToLatLong(moPixel.x, moPixel.y);
    },

    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns MapObject Pixel translated from MapObject LonLat
     * @type Object
     */
    getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
        return this.mapObject.LatLongToPixel(moLonLat);
    },


    /************************************
     *                                  *
     *       MapObject Primitives       *
     *                                  *
     ************************************/


  // LonLat
    
    /**
     * @param {Object} moLonLat MapObject LonLat format
     * 
     * @returns Longitude of the given MapObject LonLat
     * @type float
     */
    getLongitudeFromMapObjectLonLat: function(moLonLat) {
        return moLonLat.Longitude;
    },

    /**
     * @param {Object} moLonLat MapObject LonLat format
     * 
     * @returns Latitude of the given MapObject LonLat
     * @type float
     */
    getLatitudeFromMapObjectLonLat: function(moLonLat) {
        return moLonLat.Latitude;
    },

    /**
     * @param {int} lon float
     * @param {int} lat float
     * 
     * @returns MapObject LonLat built from lon and lat params
     * @type Object
     */
    getMapObjectLonLatFromLonLat: function(lon, lat) {
        return new VELatLong(lat, lon);
    },

  // Pixel
    
    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns X value of the MapObject Pixel
     * @type int
     */
    getXFromMapObjectPixel: function(moPixel) {
        return moPixel.x;
    },

    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns Y value of the MapObject Pixel
     * @type int
     */
    getYFromMapObjectPixel: function(moPixel) {
        return moPixel.y;
    },

    /** 
     * @param {int} x
     * @param {int} y
     * 
     * @returns MapObject Pixel from x and y parameters
     * @type Object
     */
    getMapObjectPixelFromXY: function(x, y) {
        return new Msn.VE.Pixel(x, y);
    },


    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.VirtualEarth"
});
/* ======================================================================    OpenLayers/Layer/WFS.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/Layer/Markers.js
 */
OpenLayers.Layer.WFS = OpenLayers.Class.create();
OpenLayers.Layer.WFS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Vector, OpenLayers.Layer.Markers, {

    /** WFS layer is never a base layer. 
     * 
     * @type Boolean
     */
    isBaseLayer: false,
    
    /** the ratio of image/tile size to map size (this is the untiled buffer)
     * @type int */
    ratio: 2,

    /** Hashtable of default key/value parameters
     * @final @type Object */
    DEFAULT_PARAMS: { service: "WFS",
                      version: "1.0.0",
                      request: "GetFeature"
                    },
    
    /** 
     * If featureClass is defined, an old-style markers based
     * WFS layer is created instead of a new-style vector layer.
     * If sent, this should be a subclass of OpenLayers.Feature
     *
     * @type OpenLayers.Feature 
     */
    featureClass: null,

    /**
     * Should be calculated automatically.
     *
     * @type Boolean
     */
    vectorMode: true, 

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} url
    * @param {Object} params
    * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, url, params, options) {
        if (options == undefined) { options = {}; } 
        
        if (options.featureClass || !OpenLayers.Layer.Vector || !OpenLayers.Feature.Vector) {
            this.vectorMode = false;
        }    
        
        // Turn off error reporting, browsers like Safari may work
        // depending on the setup, and we don't want an unneccesary alert.
        OpenLayers.Util.extend(options, {'reportError': false});
        var newArguments=new Array()
        newArguments.push(name, options);
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, newArguments);
        if (!this.renderer || !this.vectorMode) {
            this.vectorMode = false; 
            if (!options.featureClass) {
                options.featureClass = OpenLayers.Feature.WFS;
            }   
            OpenLayers.Layer.Markers.prototype.initialize.apply(this, newArguments);
        }
        
        if (this.params && this.params.typename && !this.options.typename) {
            this.options.typename = this.params.typename;
        }
        
        if (!this.options.geometry_column) {
            this.options.geometry_column = "the_geom";
        }    
        
        this.params = params;
        OpenLayers.Util.applyDefaults(
                       this.params, 
                       OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );
        this.url = url;
    },    
    

    /**
     * 
     */
    destroy: function() {
        if (this.vectorMode) {
            OpenLayers.Layer.Vector.prototype.destroy.apply(this, arguments);
        } else {    
            OpenLayers.Layer.Markers.prototype.destroy.apply(this, arguments);
        }    
    },
    
    /**
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        if (this.vectorMode) {
            OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
        } else {    
            OpenLayers.Layer.Markers.prototype.setMap.apply(this, arguments);
        }    
    },
    
    /** 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        if (this.vectorMode) {
            OpenLayers.Layer.Vector.prototype.moveTo.apply(this, arguments);
        } else {
            OpenLayers.Layer.Markers.prototype.moveTo.apply(this, arguments);
        }    

        // don't load wfs features while dragging, wait for drag end
        if (dragging) {
            // TBD try to hide the vector layer while dragging
            // this.setVisibility(false);
            // this will probably help for panning performances
            return false;
        }
        
        if ( zoomChanged ) {
            if (this.vectorMode) {
                this.renderer.clear();
            }
        }
        
        // don't load data if current zoom level doesn't match
        if (this.options.minZoomLevel && this.map.getZoom() < this.options.minZoomLevel) {
            return null;
        };
        
        if (bounds == null) {
            bounds = this.map.getExtent();
        }

        var firstRendering = (this.tile == null);

        //does the new bounds to which we need to move fall outside of the 
        // current tile's bounds?
        var outOfBounds = (!firstRendering &&
                           !this.tile.bounds.containsBounds(bounds));

        if ( zoomChanged || firstRendering || (!dragging && outOfBounds) ) {
            //determine new tile bounds
            var center = bounds.getCenterLonLat();
            var tileWidth = bounds.getWidth() * this.ratio;
            var tileHeight = bounds.getHeight() * this.ratio;
            var tileBounds = 
                new OpenLayers.Bounds(center.lon - (tileWidth / 2),
                                      center.lat - (tileHeight / 2),
                                      center.lon + (tileWidth / 2),
                                      center.lat + (tileHeight / 2));

            //determine new tile size
            var tileSize = this.map.getSize();
            tileSize.w = tileSize.w * this.ratio;
            tileSize.h = tileSize.h * this.ratio;

            //determine new position (upper left corner of new bounds)
            var ul = new OpenLayers.LonLat(tileBounds.left, tileBounds.top);
            var pos = this.map.getLayerPxFromLonLat(ul);

            //formulate request url string
            var url = this.getFullRequestString();
        
            var params = { BBOX:tileBounds.toBBOX() };
            url += "&" + OpenLayers.Util.getParameterString(params);

            if (!this.tile) {
                this.tile = new OpenLayers.Tile.WFS(this, pos, tileBounds, 
                                                     url, tileSize);
                this.tile.draw();
            } else {
                if (this.vectorMode) {
                    this.renderer.clear();
                } else {
                    this.clearMarkers();
                }    
                this.tile.destroy();
                
                this.tile = null;
                this.tile = new OpenLayers.Tile.WFS(this, pos, tileBounds, 
                                                     url, tileSize);
                this.tile.draw();
            } 
        }
    },
        
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.WMS
     * @type OpenLayers.Layer.WMS
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.WFS(this.name,
                                           this.url,
                                           this.params,
                                           this.options);
        }

        //get all additions from superclasses
        if (this.vectorMode) {
            obj = OpenLayers.Layer.Vector.prototype.clone.apply(this, [obj]);
        } else {
            obj = OpenLayers.Layer.Markers.prototype.clone.apply(this, [obj]);
        }    

        // copy/set any non-init, non-simple values here

        return obj;
    },

    /** combine the layer's url with its params and these newParams. 
    *   
    *    Add the SRS parameter from 'projection' -- this is probably
    *     more eloquently done via a setProjection() method, but this 
    *     works for now and always.
    * 
    * @param {Object} newParams
    * 
    * @type String
    */
    getFullRequestString:function(newParams) {
        var projection = this.map.getProjection();
        this.params.SRS = (projection == "none") ? null : projection;

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },
    
    commit: function() {
        if (!this.writer) {
            this.writer = new OpenLayers.Format.WFS({},this);
        }

        var data = this.writer.write(this.features);
        
        var url = this.url;
        if (OpenLayers.ProxyHost && this.url.startsWith("http")) {
            url = OpenLayers.ProxyHost + escape(this.url);
        }

        var success = this.commitSuccess.bind(this);

        var failure = this.commitFailure.bind(this)
        
        data = OpenLayers.Ajax.serializeXMLToString(data);
        
        // from prototype.js
        new OpenLayers.Ajax.Request(url, 
                         {   method: 'post', 
                             postBody: data,
                             onComplete: success, 
                             onFailure: failure
                          }
                         );
    },

    /**
     * Called when the Ajax request returns a response
     *
     * @param {XmlNode} response from server
     */
    commitSuccess: function(request) {
        var response = request.responseText;
        if (response.indexOf('SUCCESS') != -1) {
            this.commitReport('WFS Transaction: SUCCESS', response);
            
            for(var i = 0; i < this.features.length; i++) {
                i.state = null;
            }    
            // TBD redraw the layer or reset the state of features
            // foreach features: set state to null
        } else if (response.indexOf('FAILED') != -1 ||
            response.indexOf('Exception') != -1) {
            this.commitReport('WFS Transaction: FAILED', response);
        }
    },
    
    /**
     * Called when the Ajax request fails
     *
     * @param {XmlNode} response from server
     */
    commitFailure: function(request) {},
    
    /**
     * Called with a 'success' message if the commit succeeded, otherwise
     * a failure message, and the full text as a second parameter.
     *
     * @param {String} string reporting string
     * @param {String} response full XML response
     */
    commitReport: function(string, response) {
        alert(string);
    },

    
    /**
     * Refreshes all the features of the layer
     */
    refresh: function() {
        if (this.tile) {
            if (this.vectorMode) {
                this.renderer.clear();
                OpenLayers.Util.clearArray(this.features);
            } else {   
                this.clearMarkers();
                OpenLayers.Util.clearArray(this.markers);
            }    
            this.tile.draw();
        }
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.WFS"
});
/* ======================================================================    OpenLayers/Layer/Yahoo.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/EventPane.js
 * @requires OpenLayers/Layer/FixedZoomLevels.js
 */
OpenLayers.Layer.Yahoo = OpenLayers.Class.create();
OpenLayers.Layer.Yahoo.prototype =
  OpenLayers.Class.inherit( OpenLayers.Layer.EventPane, 
                            OpenLayers.Layer.FixedZoomLevels, {
    
    /** @final @type int */
    MIN_ZOOM_LEVEL: 0,
    
    /** @final @type int */
    MAX_ZOOM_LEVEL: 15,

    /** Hardcode these resolutions so that they are more closely
     *   tied with the standard wms projection
     * 
     * @final @type Array(float) */
    RESOLUTIONS: [1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],

    /** @type YahooMapType */
    type: null,

    /** 
     * @constructor
     * 
     * @param {String} name
     */
    initialize: function(name, options) {
        OpenLayers.Layer.EventPane.prototype.initialize.apply(this, arguments);
        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, 
                                                                    arguments);
    },
    
    /**
     * 
     */
    loadMapObject:function() {
        try { //do not crash! 
            this.mapObject = new YMap(this.div, this.type);
        } catch(e) {}
    },
    
    
    /** Overridden from EventPane because we need to remove this yahoo event
     *   pane which prohibits our drag and drop, and we can only do this 
     *   once the map has been loaded and centered.
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.EventPane.prototype.setMap.apply(this, arguments);

        this.map.events.register("moveend", this, this.fixYahooEventPane);
    },

    /** The map has been centered, so the mysterious yahoo eventpane has been
     *   added. we remove it so that it doesnt mess with *our* event pane.
     * 
     * @private
     */
    fixYahooEventPane: function() {
        var yahooEventPane = OpenLayers.Util.getElement("ygddfdiv");
        if (yahooEventPane != null) {
            if (yahooEventPane.parentNode != null)
                yahooEventPane.parentNode.removeChild(yahooEventPane);

            this.map.events.unregister("moveend", this, 
                                       this.fixYahooEventPane);
        }
    },

    /** 
     * @return String with information on why layer is broken, how to get
     *          it working.
     * @type String
     */
    getWarningHTML:function() {

        var html = "";
        html += "The Yahoo Layer was unable to load correctly.<br>";
        html += "<br>";
        html += "To get rid of this message, select a new BaseLayer "
        html += "in the layer switcher in the upper-right corner.<br>";
        html += "<br>";
        html += "Most likely, this is because the Yahoo library";
        html += " script was either not correctly included.<br>";
        html += "<br>";
        html += "Developers: For help getting this working correctly, ";
        html += "<a href='http://trac.openlayers.org/wiki/Yahoo' "
        html +=  "target='_blank'>";
        html +=     "click here";
        html += "</a>";

        return html;
    },

  /********************************************************/
  /*                                                      */
  /*             Translation Functions                    */
  /*                                                      */
  /*    The following functions translate GMaps and OL    */ 
  /*     formats for Pixel, LonLat, Bounds, and Zoom      */
  /*                                                      */
  /********************************************************/


  //
  // TRANSLATION: MapObject Zoom <-> OpenLayers Zoom
  //
  
    /**
     * @param {int} gZoom
     * 
     * @returns An OpenLayers Zoom level, translated from the passed in gZoom
     *          Returns null if null value is passed in
     * @type int
     */
    getOLZoomFromMapObjectZoom: function(moZoom) {
        var zoom = null;
        if (moZoom != null) {
            zoom = OpenLayers.Layer.FixedZoomLevels.prototype.getOLZoomFromMapObjectZoom.apply(this, [moZoom]);
            zoom = 18 - zoom;
        }
        return zoom;
    },
    
    /**
     * @param {int} olZoom
     * 
     * @returns A MapObject level, translated from the passed in olZoom
     *          Returns null if null value is passed in
     * @type int
     */
    getMapObjectZoomFromOLZoom: function(olZoom) {
        var zoom = null; 
        if (olZoom != null) {
            zoom = OpenLayers.Layer.FixedZoomLevels.prototype.getMapObjectZoomFromOLZoom.apply(this, [olZoom]);
            zoom = 18 - zoom;
        }
        return zoom;
    },

    /************************************
     *                                  *
     *   MapObject Interface Controls   *
     *                                  *
     ************************************/


  // Get&Set Center, Zoom

    /** Set the mapObject to the specified center and zoom
     * 
     * @param {Object} center MapObject LonLat format
     * @param {int} zoom MapObject zoom format
     */
    setMapObjectCenter: function(center, zoom) {
        this.mapObject.drawZoomAndCenter(center, zoom); 
    },
   
    /**
     * @returns the mapObject's current center in Map Object format
     * @type Object
     */
    getMapObjectCenter: function() {
        return this.mapObject.getCenterLatLon();
    },

    /** 
     * @returns the mapObject's current zoom, in Map Object format
     * @type int
     */
    getMapObjectZoom: function() {
        return this.mapObject.getZoomLevel();
    },


  // LonLat - Pixel Translation
  
    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns MapObject LonLat translated from MapObject Pixel
     * @type Object
     */
    getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
        return this.mapObject.convertXYLatLon(moPixel);
    },

    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns MapObject Pixel translated from MapObject LonLat
     * @type Object
     */
    getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
        return this.mapObject.convertLatLonXY(moLonLat);
    },


    /************************************
     *                                  *
     *       MapObject Primitives       *
     *                                  *
     ************************************/


  // LonLat
    
    /**
     * @param {Object} moLonLat MapObject LonLat format
     * 
     * @returns Longitude of the given MapObject LonLat
     * @type float
     */
    getLongitudeFromMapObjectLonLat: function(moLonLat) {
        return moLonLat.Lon;
    },

    /**
     * @param {Object} moLonLat MapObject LonLat format
     * 
     * @returns Latitude of the given MapObject LonLat
     * @type float
     */
    getLatitudeFromMapObjectLonLat: function(moLonLat) {
        return moLonLat.Lat;
    },

    /**
     * @param {int} lon float
     * @param {int} lat float
     * 
     * @returns MapObject LonLat built from lon and lat params
     * @type Object
     */
    getMapObjectLonLatFromLonLat: function(lon, lat) {
        return new YGeoPoint(lat, lon);
    },

  // Pixel
    
    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns X value of the MapObject Pixel
     * @type int
     */
    getXFromMapObjectPixel: function(moPixel) {
        return moPixel.x;
    },

    /** 
     * @param {Object} moPixel MapObject Pixel format
     * 
     * @returns Y value of the MapObject Pixel
     * @type int
     */
    getYFromMapObjectPixel: function(moPixel) {
        return moPixel.y;
    },

    /** 
     * @param {int} x
     * @param {int} y
     * 
     * @returns MapObject Pixel from x and y parameters
     * @type Object
     */
    getMapObjectPixelFromXY: function(x, y) {
        return new YCoordPoint(x, y);
    },


    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.Yahoo"
});
/* ======================================================================    OpenLayers/Control/EditingToolbar.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 * 
 * @requires OpenLayers/Control/Panel.js
 * @requires OpenLayers/Control/Navigation.js
 * @requires OpenLayers/Control/DrawFeature.js
 */
OpenLayers.Control.EditingToolbar = OpenLayers.Class.create();
OpenLayers.Control.EditingToolbar.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control.Panel, {

    /**
     * Create an editing toolbar for a given layer. 
     * @param OpenLayers.Layer.Vector layer
     * @param Object options
     */
    initialize: function(layer, options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
        
        this.addControls(
          [ new OpenLayers.Control.Navigation() ]
        );  
        var controls = [
          new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Point, {'displayClass': 'olControlDrawFeaturePoint'}),
          new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Path, {'displayClass': 'olControlDrawFeaturePath'}),
          new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Polygon, {'displayClass': 'olControlDrawFeaturePolygon'})
        ];
        for (var i = 0; i < controls.length; i++) {
            controls[i].featureAdded = function(feature) { feature.state = OpenLayers.State.INSERT; }
        }
        this.addControls(controls);
    },

    /**
     * calls the default draw, and then activates mouse defaults.
     */
    draw: function() {
        var div = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        this.activateControl(this.controls[0]);
        return div;
    },

    CLASS_NAME: "OpenLayers.Control.EditingToolbar"
});    
/* ======================================================================    OpenLayers/Format/WFS.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Read/WRite WFS. 
 * @requires OpenLayers/Format/GML.js
 */
OpenLayers.Format.WFS = OpenLayers.Class.create();
OpenLayers.Format.WFS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Format.GML, {
    
    layer: null,
    
    wfsns: "http://www.opengis.net/wfs",
    
    /*
     * Create a WFS-T formatter. This requires a layer: that layer should
     * have two properties: geometry_column and typename. The parser
     * for this format is subclassed entirely from GML: There is a writer 
     * only, which uses most of the code from the GML layer, and wraps
     * it in transactional elements.
     * @param {Object} options 
     * @param OpenLayers.Layer layer
     */
    
    initialize: function(options, layer) {
        OpenLayers.Format.GML.prototype.initialize.apply(this, [options]);
        this.layer = layer;
        if (this.layer.featureNS) {
            this.featureNS = this.layer.featureNS;
        }    
        if (this.layer.options.geometry_column) {
            this.geometryName = this.layer.options.geometry_column;
        }
        if (this.layer.options.typename) {
            this.featureName = this.layer.options.typename;
        }
    },
    
    /**
     * write 
     * Takes a feature list, and generates a WFS-T Transaction 
     *
     * @param Array 
     */
    write: function(features) {
        
        var transaction = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Transaction');
        for (var i=0; i < features.length; i++) {
            switch (features[i].state) {
                case OpenLayers.State.INSERT:
                    transaction.appendChild(this.insert(features[i]));
                    break;
                case OpenLayers.State.UPDATE:
                    transaction.appendChild(this.update(features[i]));
                    break;
                case OpenLayers.State.DELETE:
                    transaction.appendChild(this.remove(features[i]));
                    break;
            }
        }
        return transaction;
    },
    
    createFeatureXML: function(feature) {
        var geometryNode = this.buildGeometryNode(feature.geometry);
        var geomContainer = document.createElementNS(this.featureNS, "feature:" + this.geometryName);
        geomContainer.appendChild(geometryNode);
        var featureContainer = document.createElementNS(this.featureNS, "feature:" + this.featureName);
        featureContainer.appendChild(geomContainer);
        for(var attr in feature.attributes) {
            var attrText = document.createTextNode(feature.attributes[attr]); 
            var nodename = attr;
            if (attr.search(":") != -1) {
                nodename = attr.split(":")[1];
            }    
            var attrContainer = document.createElementNS(this.featureNS, "feature:" + nodename);
            attrContainer.appendChild(attrText);
            featureContainer.appendChild(attrContainer);
        }    
        return featureContainer;
    },
    
    /**
     * insert 
     * Takes a feature, and generates a WFS-T Transaction "Insert" 
     *
     * @param OpenLayers.Feature.Vector
     */
    insert: function(feature) {
        var insertNode = document.createElementNS(this.wfsns, 'wfs:Insert');
        insertNode.appendChild(this.createFeatureXML(feature));
        return insertNode;
    },
    
    /**
     * update
     * Takes a feature, and generates a WFS-T Transaction "Update" 
     *
     * @param OpenLayers.Feature.Vector
     */
    update: function(feature) {
        if (!feature.fid) { alert("Can't update a feature for which there is no FID."); }
        var updateNode = document.createElementNS(this.wfsns, 'wfs:Update');
        updateNode.setAttribute("typeName", this.layerName);

        var propertyNode = document.createElementNS(this.wfsns, 'wfs:Property');
        var nameNode = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Name');
        
        var txtNode = document.createTextNode(this.geometryName);
        nameNode.appendChild(txtNode);
        propertyNode.appendChild(nameNode);
        
        var valueNode = document.createElementNS('http://www.opengis.net/wfs', 'wfs:Value');
        valueNode.appendChild(this.buildGeometryNode(feature.geometry));
        
        propertyNode.appendChild(valueNode);
        updateNode.appendChild(propertyNode);
        
        var filterNode = document.createElementNS('http://www.opengis.net/ogc', 'ogc:Filter');
        var filterIdNode = document.createElementNS('http://www.opengis.net/ogc', 'ogc:FeatureId');
        filterIdNode.setAttribute("fid", feature.fid);
        filterNode.appendChild(filterIdNode);
        updateNode.appendChild(filterNode);

        return updateNode;
    },
    
    /**
     * delete
     * Takes a feature, and generates a WFS-T Transaction "Delete" 
     *
     * @param OpenLayers.Feature.Vector
     */
    remove: function(feature) {
        if (!feature.attributes.fid) { 
            alert("Can't update a feature for which there is no FID."); 
            return false; 
        }
        var deleteNode = document.createElementNS(this.featureNS, 'wfs:Delete');
        deleteNode.setAttribute("typeName", this.layerName);

        var filterNode = document.createElementNS('http://www.opengis.net/ogc', 'ogc:Filter');
        var filterIdNode = document.createElementNS('http://www.opengis.net/ogc', 'ogc:FeatureId');
        filterIdNode.setAttribute("fid", feature.attributes.fid);
        filterNode.appendChild(filterIdNode);
        deleteNode.appendChild(filterNode);

        return deleteNode;
    },

    destroy: function() {
        this.layer = null;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Format.WFS" 

});    
/* ======================================================================    OpenLayers/Handler/Polygon.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * Handler to draw a path on the map.  Polygon is displayed on mouse down,
 * moves on mouse move, and is finished on mouse up.
 * 
 * @class
 * @requires OpenLayers/Handler/Path.js
 * @requires OpenLayers/Geometry/Polygon.js
 */
OpenLayers.Handler.Polygon = OpenLayers.Class.create();
OpenLayers.Handler.Polygon.prototype = 
  OpenLayers.Class.inherit(OpenLayers.Handler.Path, {
    
    /**
     * @type OpenLayers.Geometry.Polygon
     * @private
     */
    polygon: null,

    /**
     * @constructor
     *
     * @param {OpenLayers.Control} control
     * @param {Array} callbacks An object with a 'done' property whos value is
     *                          a function to be called when the path drawing is
     *                          finished. The callback should expect to recieve a
     *                          single argument, the polygon geometry.
     *                          If the callbacks object contains a 'point'
     *                          property, this function will be sent each point
     *                          as they are added.  If the callbacks object contains
     *                          a 'cancel' property, this function will be called when
     *                          the handler is deactivated while drawing.  The cancel
     *                          should expect to receive a geometry.
     * @param {Object} options
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.Path.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * Add temporary geometries
     */
    createGeometry: function() {
        this.polygon = new OpenLayers.Geometry.Polygon();
        this.line = new OpenLayers.Geometry.LinearRing();
        this.polygon.addComponent(this.line);
        this.point = new OpenLayers.Geometry.Point();
    },

    /**
     * Destroy temporary geometries
     */
    destroyGeometry: function() {
        this.polygon.destroy();
        this.point.destroy();
    },

    /**
     * Modify the existing geometry given the new point
     * 
     */
    modifyGeometry: function() {
        var index = this.line.components.length - 2;
        this.line.components[index].setX(this.point.x);
        this.line.components[index].setY(this.point.y);
    },

    /**
     * Render geometries on the temporary layer.
     */
    drawGeometry: function() {
        this.layer.renderer.drawGeometry(this.polygon, this.style);
        this.layer.renderer.drawGeometry(this.point, this.style);
    },

    /**
     * Return a clone of the relevant geometry.
     *
     * @type OpenLayers.Geometry.Polygon
     */
    geometryClone: function() {
        return this.polygon.clone();
    },

    /**
     * Handle double-clicks.  Finish the geometry and send it back
     * to the control.
     * 
     * @param {Event} evt
     */
    dblclick: function(evt) {
        if(!this.freehandMode(evt)) {
            // remove the penultimate point
            var index = this.line.components.length - 2;
            this.line.removeComponent(this.line.components[index]);
            this.finalize(this.line);
        }
        return false;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Handler.Polygon"
});
/* ======================================================================    OpenLayers/Layer/KaMap.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/Grid.js
 */
OpenLayers.Layer.KaMap = OpenLayers.Class.create();
OpenLayers.Layer.KaMap.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Grid, {

    /** KaMap Layer is always a base layer 
     * 
     * @type Boolean
     */    
    isBaseLayer: true,
    
    units: null,

    resolution: OpenLayers.DOTS_PER_INCH,
    
    DEFAULT_PARAMS: {
        i: 'jpeg',
        map: ''
    },
        
    initialize: function(name, url, params, options) {
        var newArguments = new Array();
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        this.params = (params ? params : {});
        if (params) {
            OpenLayers.Util.applyDefaults(
                           this.params, 
                           this.DEFAULT_PARAMS
                           );
        }
    },

    /**
     * @param {OpenLayers.Bounds} bounds
     * 
     * @returns A string with the layer's url and parameters and also the 
     *           passed-in bounds and appropriate tile size specified as 
     *           parameters
     * @type String
     */
    getURL: function (bounds) {
        var mapRes = this.map.getResolution();
        var scale = Math.round((this.map.getScale() * 10000)) / 10000;
        var pX = Math.round(bounds.left / mapRes);
        var pY = -Math.round(bounds.top / mapRes);
        return this.getFullRequestString(
                      { t: pY, 
                        l: pX,
                        s: scale
                      });
    },
    
    addTile:function(bounds,position) {
        var url = this.getURL(bounds);
        return new OpenLayers.Tile.Image(this, position, bounds, 
                                             url, this.tileSize);
    },
    
    _initTiles:function() {

        var viewSize = this.map.getSize();
        var bounds = this.map.getExtent();
        var extent = this.map.getMaxExtent();
        var resolution = this.map.getResolution();
        var tilelon = resolution*this.tileSize.w;
        var tilelat = resolution*this.tileSize.h;
        
        var offsetlon = bounds.left;
        var tilecol = Math.floor(offsetlon/tilelon);
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = tilecol * tilelon;
        
        var offsetlat = bounds.top;  
        var tilerow = Math.ceil(offsetlat/tilelat);
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsety = -(tilerowremain+1) * this.tileSize.h;
        var tileoffsetlat = tilerow * tilelat;
        
        tileoffsetx = Math.round(tileoffsetx); // heaven help us
        tileoffsety = Math.round(tileoffsety);

        this.origin = new OpenLayers.Pixel(tileoffsetx,tileoffsety);

        var startX = tileoffsetx; 
        var startLon = tileoffsetlon;
        
        var rowidx = 0;
        
        do {
            var row;
            
            row = this.grid[rowidx++];
            if (!row) {
                row = new Array();
                this.grid.push(row);
            }

            tileoffsetlon = startLon;
            tileoffsetx = startX;

            var colidx = 0;
 
            do {
                var tileBounds = new OpenLayers.Bounds(tileoffsetlon, 
                                                      tileoffsetlat, 
                                                      tileoffsetlon + tilelon,
                                                      tileoffsetlat + tilelat);

                var x = tileoffsetx;
                x -= parseInt(this.map.layerContainerDiv.style.left);

                var y = tileoffsety;
                y -= parseInt(this.map.layerContainerDiv.style.top);

                var px = new OpenLayers.Pixel(x, y);
                var tile;
                
                tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }
     
                tileoffsetlon += tilelon;       
                tileoffsetx += this.tileSize.w;
            } while (tileoffsetlon <= bounds.right + tilelon * this.buffer)  
            
            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while(tileoffsetlat >= bounds.bottom - tilelat * this.buffer)
        
        this.spiralTileLoad();

    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.KaMap"
});
/* ======================================================================    OpenLayers/Layer/MapServer.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
// @requires OpenLayers/Layer/Grid.js
/**
* @class
 * @requires OpenLayers/Layer/Grid.js
*/
OpenLayers.Layer.MapServer = OpenLayers.Class.create();
OpenLayers.Layer.MapServer.prototype =
  OpenLayers.Class.inherit( OpenLayers.Layer.Grid, {

    /** @final @type hash */
    DEFAULT_PARAMS: {
                      mode: "map",
                      map_imagetype: "png"
                     },

    /**
    * @constructor
    *
    * @param {str} name
    * @param {str} url
    * @param {hash} params
    */
    initialize: function(name, url, params, options) {
        var newArguments = new Array();
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);

        if (arguments.length > 0) {
            OpenLayers.Util.applyDefaults(
                           this.params,
                           this.DEFAULT_PARAMS
                           );
        }

        // unless explicitly set in options, if the layer is transparent, 
        // it will be an overlay
        if (options == null || options.isBaseLayer == null) {
            this.isBaseLayer = ((this.params.transparent != "true") && 
                                (this.params.transparent != true));
        }
    },

    /**
    * @param {Object} obj
    *
    * @returns A clone of this OpenLayers.Layer.MapServer
    * @type OpenLayers.Layer.MapServer
    */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.MapServer(this.name,
                                           this.url,
                                           this.params,
                                           this.options);
        }
        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },

    /**
    * addTile creates a tile, initializes it (via 'draw' in this case), and
    * adds it to the layer div.
    *
    * @param {OpenLayers.Bounds} bounds
    *
    * @returns The added OpenLayers.Tile.Image
    * @type OpenLayers.Tile.Image
    */
    addTile:function(bounds,position) {
        var url = this.getURL(bounds);
        return new OpenLayers.Tile.Image(this, position, bounds, url, this.tileSize);
    },
    
    /**
     * @param {OpenLayers.Bounds} bounds
     * 
     * @returns A string with the layer's url and parameters and also the 
     *           passed-in bounds and appropriate tile size specified as 
     *           parameters
     * @type String
     */
    getURL: function (bounds) {
        
        // Make a list, so that getFullRequestString uses literal "," 
        var extent = [bounds.left, bounds. bottom, bounds.right, bounds.top];
        
        // make lists, so that literal ','s are used 
        var url = this.getFullRequestString(
                     {mapext:   extent,
                      imgext:   extent,
                      map_size: [this.tileSize.w,this.tileSize.h],
                      imgx:     this.tileSize.w/2,
                      imgy:     this.tileSize.h/2,
                      imgxy:    [this.tileSize.w,this.tileSize.h]
                      });
        
        return url;
    },
    
    /** 
     * getFullRequestString on MapServer layers is special, because we 
     * do a regular expression replace on ',' in parameters to '+'.
     * This is why it is subclassed here.
     *
     * @param {Object} newParams Parameters to add to the default parameters
     *                           for the layer.
     * @param {String} altUrl    Alternative base URL to use.
     */
    getFullRequestString:function(newParams, altUrl) {
        
    
        // use layer's url unless altUrl passed in
        var url = (altUrl == null) ? this.url : altUrl;
        
        // if url is not a string, it should be an array of strings, 
        //  in which case we will randomly select one of them in order
        //  to evenly distribute requests to different urls.
        if (typeof url == "object") {
            url = url[Math.floor(Math.random()*url.length)];
        }   
        // requestString always starts with url
        var requestString = url;        

        // create a new params hashtable with all the layer params and the 
        // new params together. then convert to string
        var allParams = OpenLayers.Util.extend(new Object(), this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        // ignore parameters that are already in the url search string
        var urlParams = OpenLayers.Util.upperCaseObject(
                            OpenLayers.Util.getArgs(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        
        /* MapServer needs '+' seperating things like bounds/height/width.
           Since typically this is URL encoded, we use a slight hack: we
           depend on the list-like functionality of getParameterString to
           leave ',' only in the case of list items (since otherwise it is
           encoded) then do a regular expression replace on the , characters
           to '+' */
        paramsString = paramsString.replace(/,/g, "+");
        
        if (paramsString != "") {
            var lastServerChar = url.charAt(url.length - 1);
            if ((lastServerChar == "&") || (lastServerChar == "?")) {
                requestString += paramsString;
            } else {
                if (url.indexOf('?') == -1) {
                    //serverPath has no ? -- add one
                    requestString += '?' + paramsString;
                } else {
                    //serverPath contains ?, so must already have paramsString at the end
                    requestString += '&' + paramsString;
                }
            }
        }
        return requestString;
    },
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.MapServer"
});
/* ======================================================================    OpenLayers/Layer/TMS.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD licence.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/Grid.js
 */
OpenLayers.Layer.TMS = OpenLayers.Class.create();
OpenLayers.Layer.TMS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Grid, {

    
    reproject: false,
    isBaseLayer: true,
    tileOrigin: null,

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} url
    * @param {Object} params
    * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, url, options) {
        var newArguments = new Array();
        newArguments.push(name, url, {}, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
    },    

    /**
     * 
     */
    destroy: function() {
        // for now, nothing special to do here. 
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);  
    },

    
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.TMS
     * @type OpenLayers.Layer.TMS
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.TMS(this.name,
                                           this.url,
                                           this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    /**
     * @param {OpenLayers.Bounds} bounds
     * 
     * @returns A string with the layer's url and parameters and also the 
     *           passed-in bounds and appropriate tile size specified as 
     *           parameters
     * @type String
     */
    getURL: function (bounds) {
        var res = this.map.getResolution();
        var x = (bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w);
        var y = (bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h);
        var z = this.map.getZoom();
        var path = "1.0.0" + "/" + this.layername + "/" + z + "/" + x + "/" + y + "." + this.type; 
        var url = this.url;
        if (url instanceof Array) {
            url = this.selectUrl(path, url);
        }
        return url + path;
    },

    /**
    * addTile creates a tile, initializes it, and 
    * adds it to the layer div. 
    *
    * @param {OpenLayers.Bounds} bounds
    *
    * @returns The added OpenLayers.Tile.Image
    * @type OpenLayers.Tile.Image
    */
    addTile:function(bounds,position) {
        var url = this.getURL(bounds);
        return new OpenLayers.Tile.Image(this, position, bounds, 
                                             url, this.tileSize);
    },

    /** When the layer is added to a map, then we can fetch our origin 
     *  (if we don't have one.) 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) { 
            this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left,
                                                this.map.maxExtent.bottom);
        }                                       
    },

    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.TMS"
});
/* ======================================================================    OpenLayers/Layer/WMS.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Tile/Image.js
 */
OpenLayers.Layer.WMS = OpenLayers.Class.create();
OpenLayers.Layer.WMS.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Grid, {

    /** Hashtable of default parameter key/value pairs 
     * @final @type Object */
    DEFAULT_PARAMS: { service: "WMS",
                      version: "1.1.1",
                      request: "GetMap",
                      styles: "",
                      exceptions: "application/vnd.ogc.se_inimage",
                      format: "image/jpeg"
                     },
    
    reproject: true,

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} url
    * @param {Object} params
    * @param {Object} options Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, url, params, options) {
        var newArguments = new Array();
        //uppercase params
        params = OpenLayers.Util.upperCaseObject(params);
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        OpenLayers.Util.applyDefaults(
                       this.params, 
                       OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );

        // unless explicitly set in options, if the layer is transparent, 
        // it will be an overlay
        if (options == null || options.isBaseLayer == null) {
            this.isBaseLayer = ((this.params.TRANSPARENT != "true") && 
                                (this.params.TRANSPARENT != true));
        }
    },    

    /**
     * 
     */
    destroy: function() {
        // for now, nothing special to do here. 
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);  
    },

    
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.WMS
     * @type OpenLayers.Layer.WMS
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.WMS(this.name,
                                           this.url,
                                           this.params,
                                           this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    /**
     * @param {OpenLayers.Bounds} bounds
     * 
     * @returns A string with the layer's url and parameters and also the 
     *           passed-in bounds and appropriate tile size specified as 
     *           parameters
     * @type String
     */
    getURL: function (bounds) {
        return this.getFullRequestString(
                     {BBOX:bounds.toBBOX(),
                      WIDTH:this.tileSize.w,
                      HEIGHT:this.tileSize.h});
    },

    /**
    * addTile creates a tile, initializes it, and 
    * adds it to the layer div. 
    *
    * @param {OpenLayers.Bounds} bounds
    *
    * @returns The added OpenLayers.Tile.Image
    * @type OpenLayers.Tile.Image
    */
    addTile:function(bounds,position) {
        url = this.getURL(bounds);
        return new OpenLayers.Tile.Image(this, position, bounds, 
                                             url, this.tileSize);
    },

    /**
     * Catch changeParams and uppercase the new params to be merged in
     *  before calling changeParams on the super class.
     * 
     * Once params have been changed, we will need to re-init our tiles
     * 
     * @param {Object} newParams Hashtable of new params to use
     */
    mergeNewParams:function(newParams) {
        var upperParams = OpenLayers.Util.upperCaseObject(newParams);
        var newArguments = [upperParams];
        OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, 
                                                             newArguments);
    },

    /** combine the layer's url with its params and these newParams. 
    *   
    *    Add the SRS parameter from projection -- this is probably
    *     more eloquently done via a setProjection() method, but this 
    *     works for now and always.
    * 
    * @param {Object} newParams
    * 
    * @type String
    */
    getFullRequestString:function(newParams) {
        var projection = this.map.getProjection();
        this.params.SRS = (projection == "none") ? null : projection;

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.WMS"
});
/* ======================================================================    OpenLayers/Layer/WorldWind.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Layer/Grid.js
 */
OpenLayers.Layer.WorldWind = OpenLayers.Class.create();
OpenLayers.Layer.WorldWind.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.Grid, {
    
    DEFAULT_PARAMS: {
    },

    /** WorldWind layer is always a base layer
     * 
     * @type Boolean
     */
    isBaseLayer: true,    

    // LevelZeroTileSizeDegrees
    lzd: null,

    zoomLevels: null,
        
    initialize: function(name, url, lzd, zoomLevels, params, options) {
        this.lzd = lzd;
        this.zoomLevels = zoomLevels;
        var newArguments = new Array();
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        this.params = (params ? params : {});
        if (params) {
            OpenLayers.Util.applyDefaults(
                           this.params, 
                           this.DEFAULT_PARAMS
                           );
        }
    },
    addTile:function(bounds,position) {
        if (this.map.getResolution() <= (this.lzd/512)
            && this.getZoom() <= this.zoomLevels) {
            var url = this.getURL(bounds);
            return new OpenLayers.Tile.Image(this, position, bounds, 
                                             url, this.tileSize);
        } else {
            return new OpenLayers.Tile.Image(this, position, bounds, 
                       OpenLayers.Util.getImagesLocation() + "blank.gif", 
                       this.tileSize);
        }
    },

    getZoom: function () {
        var zoom = this.map.getZoom();
        var extent = this.map.getMaxExtent();
        zoom = zoom - Math.log(this.maxResolution / (this.lzd/512))/Math.log(2);
        return zoom;
    },

    /**
     * @param {OpenLayers.Bounds} bounds
     * 
     * @returns A string with the layer's url and parameters and also the 
     *           passed-in bounds and appropriate tile size specified as 
     *           parameters
     * @type String
     */
    getURL: function (bounds) {
        var zoom = this.getZoom();
        var extent = this.map.getMaxExtent();
        var deg = this.lzd/Math.pow(2,this.getZoom());
        var x = Math.floor((bounds.left - extent.left)/deg);
        var y = Math.floor((bounds.bottom - extent.bottom)/deg);
        if (this.map.getResolution() <= (this.lzd/512)
            && this.getZoom() <= this.zoomLevels) {
            return this.getFullRequestString(
              { L: zoom, 
                X: x,
                Y: y
              });
        } else {
            return OpenLayers.Util.getImagesLocation() + "blank.gif";
        }

    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.WorldWind"
});
/* ======================================================================    OpenLayers/Layer/MapServer/Untiled.js
   ====================================================================== */

/* Copyright (c) 2006-2007 MetaCarta, Inc., published under the BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/release-license.txt 
 * for the full text of the license. */
 
/* Derived from the WMS/Untiled.js script by Stephen Woodbridge, 2007 */
   
 
/**
 * @class
 * 
 * @requires OpenLayers/Layer/HTTPRequest.js
 * @requires OpenLayers/Layer/MapServer.js
 */
OpenLayers.Layer.MapServer.Untiled = OpenLayers.Class.create();
OpenLayers.Layer.MapServer.Untiled.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.HTTPRequest, {

    /** Hashtable of default parameter key/value pairs
     * @final @type Object */
    default_params: {
                      mode: "map",
                      map_imagetype: "png"
                     },
    reproject: true,

    /** the ratio of image/tile size to map size (this is the untiled buffer)
     * @type int */
    ratio: 1,

    /** @type OpenLayers.Tile.Image */
    tile: null,

    /** did the image finish loading before a new draw was initiated?
     * @type Boolean */
    doneLoading: false,

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} url
    * @param {Object} params
    */
    initialize: function(name, url, params, options) {
        var newArguments = [];
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, 
                                                                newArguments);
        OpenLayers.Util.applyDefaults(
                       this.params, 
                       this.default_params
                       );

        // unless explicitly set in options, if the layer is transparent, 
        // it will be an overlay        
        if ((options == null) || (options.isBaseLayer == null)) {
            this.isBaseLayer = ((this.params.transparent != "true") && 
                                (this.params.transparent != true));
        }
    },    

    /**
     * 
     */
    destroy: function() {
        if (this.tile) {
          this.tile.destroy();
          this.tile = null;    
        }
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.MapServer.Untiled
     * @type OpenLayers.Layer.MapServer.Untiled
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.MapServer.Untiled(this.name,
                                                         this.url,
                                                         this.params,
                                                         this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    
    /** Once HTTPRequest has set the map, we can load the image div
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.HTTPRequest.prototype.setMap.apply(this, arguments);
    },

    /** When it is not a dragging move (ie when done dragging)
     *   reload and recenter the div.
     * 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        if (!this.doneLoading) {
            this.events.triggerEvent("loadcancel"); 
            this.doneLoading = true; 
        }
        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
        
        if (bounds == null) {
            bounds = this.map.getExtent();
        }

        var firstRendering = (this.tile == null);

        //does the new bounds to which we need to move fall outside of the 
        // current tile's bounds?
        var outOfBounds = (!firstRendering &&
                           !this.tile.bounds.containsBounds(bounds));

        if ( zoomChanged || firstRendering || (!dragging && outOfBounds) ) {

            //clear out the old tile 
            if (this.tile) {
                this.tile.clear();
            }

            //determine new tile bounds
            var center = bounds.getCenterLonLat();
            var tileWidth = bounds.getWidth() * this.ratio;
            var tileHeight = bounds.getHeight() * this.ratio;
            var tileBounds = 
                new OpenLayers.Bounds(center.lon - (tileWidth / 2),
                                      center.lat - (tileHeight / 2),
                                      center.lon + (tileWidth / 2),
                                      center.lat + (tileHeight / 2));

            //determine new tile size
            var tileSize = this.map.getSize();
            tileSize.w = tileSize.w * this.ratio;
            tileSize.h = tileSize.h * this.ratio;

            //formulate request url string
            var url = this.getURL(tileBounds); 

            //determine new position (upper left corner of new bounds)
            var ul = new OpenLayers.LonLat(tileBounds.left, tileBounds.top);
            var pos = this.map.getLayerPxFromLonLat(ul);

            if ( this.tile && !this.tile.size.equals(tileSize)) {
                this.tile.destroy();
                this.tile = null;
            }

            this.events.triggerEvent("loadstart");
            this.doneLoading = false;
            if (!this.tile) {
                this.tile = new OpenLayers.Tile.Image(this, pos, tileBounds, 
                                                     url, tileSize);
                this.tile.draw();
                var onload = function() { 
                    this.doneLoading = true; 
                    this.events.triggerEvent("loadend"); 
                }
                OpenLayers.Event.observe(this.tile.imgDiv, 'load',
                                         onload.bindAsEventListener(this));
            } else {
                this.tile.moveTo(tileBounds, pos);
            } 
    
        }
    },
    
    getURL: function(bounds) {
        var tileSize = this.map.getSize();
        tileSize.w = tileSize.w * this.ratio;
        tileSize.h = tileSize.h * this.ratio;
        var url = this.getFullRequestString(
                     {mapext:bounds.toBBOX().replace(/,/g," "),
                      imgext:bounds.toBBOX().replace(/,/g," "),
                      map_size:tileSize.w+' '+tileSize.h,
                      imgx: tileSize.w/2,
                      imgy: tileSize.h/2,
                      imgxy: tileSize.w+" "+tileSize.h
                      });
        return url;
    },
 
    
    /** Once HTTPRequest has updated the url, reload the image div
     * @param {String} newUrl
     */
    setUrl: function(newUrl) {
        OpenLayers.Layer.HTTPRequest.prototype.setUrl.apply(this, arguments);
        this.moveTo();
    },

    /** Once HTTPRequest has updated new params, reload the image div
     * @param {Object} newParams
     */
    mergeNewParams:function(newParams) {
        OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this, 
                                                                 [newParams]);
        //redraw
        this.moveTo(null, true);
    },
    
    /** combine the layer's url with its params and these newParams. 
    *   
    *    Add the SRS parameter from 'projection' -- this is probably
    *     more eloquently done via a setProjection() method, but this 
    *     works for now and always.
    * 
    * @param {Object} newParams
    * 
    * @type String
    */
    getFullRequestString:function(newParams) {
        var projection = this.map.getProjection();
        this.params.srs = (projection == "none") ? null : projection;

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.MapServer.Untiled"
});
/* ======================================================================    OpenLayers/Layer/WMS/Untiled.js
   ====================================================================== */

/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

 
/**
 * @class
 * 
 * @requires OpenLayers/Layer/HTTPRequest.js
 * @requires OpenLayers/Layer/WMS.js
 */
OpenLayers.Layer.WMS.Untiled = OpenLayers.Class.create();
OpenLayers.Layer.WMS.Untiled.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Layer.HTTPRequest, {

    /** Hashtable of default parameter key/value pairs
     * @final @type Object */
    DEFAULT_PARAMS: { service: "WMS",
                      version: "1.1.1",
                      request: "GetMap",
                      styles: "",
                      exceptions: "application/vnd.ogc.se_inimage",
                      format: "image/jpeg"
                     },
    reproject: true,

    /** the ratio of image/tile size to map size (this is the untiled buffer)
     * @type int */
    ratio: 2,

    /** @type OpenLayers.Tile.Image */
    tile: null,

    /** did the image finish loading before a new draw was initiated?
     * @type Boolean */
    doneLoading: false,

    /**
    * @constructor
    *
    * @param {String} name
    * @param {String} url
    * @param {Object} params
    */
    initialize: function(name, url, params, options) {
        var newArguments = new Array();
        //uppercase params
        params = OpenLayers.Util.upperCaseObject(params);
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, 
                                                                newArguments);
        OpenLayers.Util.applyDefaults(
                       this.params, 
                       OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );

        // unless explicitly set in options, if the layer is transparent, 
        // it will be an overlay        
        if ((options == null) || (options.isBaseLayer == null)) {
            this.isBaseLayer = ((this.params.TRANSPARENT != "true") && 
                                (this.params.TRANSPARENT != true));
        }
    },    

    /**
     * 
     */
    destroy: function() {
        if (this.tile) {
          this.tile.destroy();
          this.tile = null;    
        }
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.WMS.Untiled
     * @type OpenLayers.Layer.WMS.Untiled
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.WMS.Untiled(this.name,
                                                   this.url,
                                                   this.params,
                                                   this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    
    /** Once HTTPRequest has set the map, we can load the image div
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.HTTPRequest.prototype.setMap.apply(this, arguments);
    },

    /** When it is not a dragging move (ie when done dragging)
     *   reload and recenter the div.
     * 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} dragging
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        if (!this.doneLoading) {
            this.events.triggerEvent("loadcancel"); 
            this.doneLoading = true; 
        }
        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
        
        if (bounds == null) {
            bounds = this.map.getExtent();
        }

        var firstRendering = (this.tile == null);

        //does the new bounds to which we need to move fall outside of the 
        // current tile's bounds?
        var outOfBounds = (!firstRendering &&
                           !this.tile.bounds.containsBounds(bounds));

        if ( zoomChanged || firstRendering || (!dragging && outOfBounds) ) {

            //clear out the old tile 
            if (this.tile) {
                this.tile.clear();
            }

            //determine new tile bounds
            var center = bounds.getCenterLonLat();
            var tileWidth = bounds.getWidth() * this.ratio;
            var tileHeight = bounds.getHeight() * this.ratio;
            var tileBounds = 
                new OpenLayers.Bounds(center.lon - (tileWidth / 2),
                                      center.lat - (tileHeight / 2),
                                      center.lon + (tileWidth / 2),
                                      center.lat + (tileHeight / 2));

            //determine new tile size
            var tileSize = this.map.getSize();
            tileSize.w = tileSize.w * this.ratio;
            tileSize.h = tileSize.h * this.ratio;

            //formulate request url string
            var url = this.getURL(tileBounds); 

            //determine new position (upper left corner of new bounds)
            var ul = new OpenLayers.LonLat(tileBounds.left, tileBounds.top);
            var pos = this.map.getLayerPxFromLonLat(ul);

            if ( this.tile && !this.tile.size.equals(tileSize)) {
                this.tile.destroy();
                this.tile = null;
            }

            this.events.triggerEvent("loadstart");
            this.doneLoading = false;
            if (!this.tile) {
                this.tile = new OpenLayers.Tile.Image(this, pos, tileBounds, 
                                                     url, tileSize);
                this.tile.draw();
                var onload = function() { 
                    this.doneLoading = true; 
                    this.events.triggerEvent("loadend"); 
                }
                OpenLayers.Event.observe(this.tile.imgDiv, 'load',
                                         onload.bindAsEventListener(this));
            } else {
                this.tile.moveTo(tileBounds, pos);
            } 
    
        }
    },
    
    getURL: function(bounds) {
        var tileSize = this.map.getSize();
        tileSize.w = tileSize.w * this.ratio;
        tileSize.h = tileSize.h * this.ratio;
        return this.getFullRequestString( {'BBOX': bounds.toBBOX(),
                                                  'WIDTH': tileSize.w,
                                                  'HEIGHT': tileSize.h} );
    },
 
    
    /** Once HTTPRequest has updated the url, reload the image div
     * @param {String} newUrl
     */
    setUrl: function(newUrl) {
        OpenLayers.Layer.HTTPRequest.prototype.setUrl.apply(this, arguments);
        this.moveTo();
    },

    /** Once HTTPRequest has updated new params, reload the image div
     * @param {Object} newParams
     */
    mergeNewParams:function(newParams) {
        var upperParams = OpenLayers.Util.upperCaseObject(newParams);
        var newArguments = [upperParams];
        OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this, 
                                                                 newArguments);
        //redraw
        this.moveTo(null, true);
    },
    
    /** combine the layer's url with its params and these newParams. 
    *   
    *    Add the SRS parameter from 'projection' -- this is probably
    *     more eloquently done via a setProjection() method, but this 
    *     works for now and always.
    * 
    * @param {Object} newParams
    * 
    * @type String
    */
    getFullRequestString:function(newParams) {
        var projection = this.map.getProjection();
        this.params.SRS = (projection == "none") ? null : projection;

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.WMS.Untiled"
});
