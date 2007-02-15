/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * Create a Style which uses WebSafe Colors, (there are 216 of them).
 * @class
 *
 * @requires OpenLayers/Style.js
 */
OpenLayers.Style.WebSafe = OpenLayers.Class.create();
OpenLayers.Style.WebSafe.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Style, {

    /**
     * @constructor
     * 
     * @param {String} name
     * @param {Int} colorNumber A number between 0..215. Large numbers will be
     * rounded down to 215.
     */
     initialize: function(name) {
        var newArguments=new Array(name);
        OpenLayers.Style.prototype.initialize.apply(this, newArguments);
        this.color=this.getWebSafeColor(arguments[0]);
        this.fillColor= this.color;
        this.hoverFillColor= this.color;
        this.strokeColor= this.color;
    },

	/**
	 * Get a webSafe color as a hex string.
	 * @param colorNumber A number from 0..215
	 * @return A hex color string like "#0033FF"
	 */
	getWebSafeColor:function(colorNumber){
		colors=new Array("00","33","66","99","CC","FF");
		colorNumber=(colorNumber)?colorNumber:0;
		colorNumber=(colorNumber<0)?0:colorNumber;
		colorNumber=(colorNumber>215)?215:colorNumber;
		i=parseInt(colorNumber/36);
		j=parseInt((colorNumber-i*36)/6);
		k=parseInt((colorNumber-i*36-j*6));
		var color="#"+colors[i]+colors[j]+colors[k];
		return color;
	},
	
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Style.WebSafe"
    });
