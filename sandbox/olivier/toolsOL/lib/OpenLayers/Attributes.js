/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Stores an array of (name,value) attributes. This is kept as a seperate
 * class so that attributes from formats like GML don't need to be parsed
 * until they are rendered.
 * @class
 * 
 */
OpenLayers.Attributes = OpenLayers.Class.create();
OpenLayers.Attributes.prototype= {

    /** @type array */
    attributes: null,

    /** 
     * @constructor
     * 
     * @param attributes (optional) Attributes to add, can be an array.
     */
    initialize: function(attributes) {
		this.addAttributes(attributes);
    },

    /**
     * Destroy this object.
     */
    destroy: function() {
        this.attributes=null;
    },

    /**
     * Adds attributes to the feature
     * (should not be in geometry but in feature class)
     *
     * @param {?} attributes to add, can be an array.
     */
    addAttributes: function(attributes) {
        if (!(attributes instanceof Array)){
            attributes = [attributes];
        }

        if (this.attributes) {
            this.attributes = this.attributes.concat(attributes);
        } else {
            this.attributes = [].concat(attributes);
        }
    },

//    /**
//     * Removes attributes from the feature
//     * (should not be in geometry but in feature class)
//     *
//     * @param {?} attributes to remove, can be an array
//     */
//    removeAttributes: function(attributes) {
//        if (!(attributes instanceof Array)) {
//            attributes = [attributes];
//        }
//        
//        // TBD do something to remove attributes
//        // not implemented yet
//    },

	/**
	 * Get an array of attributes as (name,value) pairs.
	 * Returns an empty array if none exist.
	 * @return {Array} An array of attributes.
	 */
	getAttributes: function(){
		if(this.attributes){
			return this.attributes;
		}else{
			return new Array();
		}
	},

    CLASS_NAME: "OpenLayers.Attributes"
};
