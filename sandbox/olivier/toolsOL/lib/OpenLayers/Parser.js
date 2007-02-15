/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 */
OpenLayers.Parser = OpenLayers.Class.create();
OpenLayers.Parser.prototype = {
    
    /** 
    * @constructor
    */
    initialize: function() {},

    /**
     *
     */
    load: function(uri, bbox, onComplete, onFailure) {

    },
    
    destroy: function() {
        this.map = null;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Parser"
};
