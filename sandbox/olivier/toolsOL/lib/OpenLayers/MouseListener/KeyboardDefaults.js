/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/MouseListener.js
 */
OpenLayers.MouseListener.KeyboardDefaults = OpenLayers.Class.create();
OpenLayers.MouseListener.KeyboardDefaults.prototype = 
  OpenLayers.Class.inherit( OpenLayers.MouseListener, {

    /** @type int */
    slideFactor: 50,

    /**
     * @constructor
     */
    initialize: function() {
        OpenLayers.MouseListener.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * 
     */
    draw: function() {
        OpenLayers.Event.observe(document, 
                      'keypress', 
                      this.keyDown.bind(this));
    },
    
    /**
    * @param {Event} evt
    */
    keyDown: function (evt) {
        switch(evt.keyCode) {
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
        }
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.KeyboardDefaults"
});
