/* Copyright (c) 2006-2007 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Constructor: OpenLayers.Class
 * Base class used to construct all other classes. Includes support for 
 *     multiple inheritance. 
 *     
 * This constructor is new in OpenLayers 2.5.  At OpenLayers 3.0, the old 
 *     syntax for creating classes and dealing with inheritance 
 *     will be removed.
 * 
 * To create a new OpenLayers-style class, use the following syntax:
 * > var MyClass = OpenLayers.Class(prototype);
 *
 * To create a new OpenLayers-style class with multiple inheritance, use the
 *     following syntax:
 * > var MyClass = OpenLayers.Class(Class1, Class2, prototype);
 *
 */
OpenLayers.Class = function() {
    var Class = function() {
        /**
         * This following condition can be removed at 3.0 - this is only for
         * backwards compatibility while the Class.inherit method is still
         * in use.  So at 3.0, the following three lines would be replaced with
         * simply:
         * this.initialize.apply(this, arguments);
         */
        if (arguments && arguments[0] != OpenLayers.Class.isPrototype) {
            this.initialize.apply(this, arguments);
        }
    }
    var extended = {};
    var parent;
    for(var i=0; i<arguments.length; ++i) {
        if(typeof arguments[i] == "function") {
            // get the prototype of the superclass
            parent = arguments[i].prototype;
        } else {
            // in this case we're extending with the prototype
            parent = arguments[i];
        }
        OpenLayers.Util.extend(extended, parent);
    }
    Class.prototype = extended;
    return Class;
};

