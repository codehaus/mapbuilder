/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 */
OpenLayers.MouseListener = OpenLayers.Class.create();
OpenLayers.MouseListener.prototype = {

    /**
     * @constructor
     */
    initialize: function() {},

    /** Set the map property for the MouseListener.
     *
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        this.map = map;
    },

    /**
     * Destroy is a destructor: this is to alleviate cyclic references which
     * the Javascript garbage cleaner can not take care of on its own.
     */
    destroy: function() {
        if (this.map != null) {
            this.map.removeMouseListener(this);
        }
        this.map = null;
    },

    /**
     * @param {Event} evt
     */
	mouseClick: function(evt) {},

    /**
     * @param {Event} evt
     */
	mouseDblClick: function(evt) {},

    /**
     * @param {Event} evt
     */
	mouseUp: function(evt) {},

    /**
     * @param {Event} evt
     */
	mouseDown: function(evt) {},

    /**
     * @param {Event} evt
     */
	mouseOver: 	function(evt) {},

    /**
     * @param {Event} evt
     */
	mouseOut: function(evt) {},

    /**
     * @param {Event} evt
     */
	mouseMove: function(evt) {},

    /**
     * @param {Event} evt
     */
   	mouseWheel: function(evt) {},


    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener"
}