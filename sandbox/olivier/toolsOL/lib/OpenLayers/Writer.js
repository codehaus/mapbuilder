/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 */
OpenLayers.Writer = OpenLayers.Class.create();
OpenLayers.Writer.prototype = {
    
    /** 
    * @constructor
    */
    initialize: function() {},
    
    destroy: function() {},
    

    commit: function(uri, features, onSuccess, onFailure) {
        
    },
    
    _insert: function(feature) {},
    _update: function(feature) {},
    _delete: function(feature) {},
   
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Writer"
};
