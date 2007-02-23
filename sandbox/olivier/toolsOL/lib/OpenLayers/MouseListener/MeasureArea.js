/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */
OpenLayers.MouseListener.MeasureArea = OpenLayers.Class.create();
OpenLayers.MouseListener.MeasureArea.prototype =
    OpenLayers.Class.inherit(OpenLayers.MouseListener.EditingListener, {
    
	/** @type String */
	id: "measurearea",
	
	/** @type String */
    imageOn:"MeasureEnable.png",
    
    /** @type String */
    imageOff:"MeasureDisable.png",
    
    /** @type String */
    type:"RadioButton",
    
    /** @type OpenLayers.Size */
    size: new OpenLayers.Size(22,22),
    
    /** @type DOMElement */
    element: null,

    /** @type String */
    prefix: 'area: ',

    /** @type String */
    suffix: ' m&sup2;',

    /** @type int */
    numdigits: 2,

    /**
     * @constructor
    ***/
    initialize: function(options) {
        OpenLayers.MouseListener.EditingListener.prototype.initialize.apply(this, arguments);
        options = options || [];
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Turn on the current tool and catch all the concerned events.
     */
    turnOn: function() {
         this.map.addMouseListener(this);
          this.geometry = new OpenLayers.Geometry.LinearRing();
        this.tmpLineSting = new OpenLayers.Geometry.LineString();
    },

    /**
     * Turn off the current tool and catch all the concerned events.
     */
    turnOff: function() {
    	this.eraseTmpElements();
        this.geometry = null;
        this.map.removeMouseListener(this);
      
    },

    /**
     * Finalize the geometry from the current tool
     */
    finalizeGeometry: function() {
        this.oldGeometry = this.geometry;
        this.geometry = new OpenLayers.Geometry.LinearRing();
    },


    eraseTmpElements: function() {
  
            this.map.vectorLayer.renderer.eraseGeometry(this.tmpLineSting);
    
        
        this.map.vectorLayer.renderer.eraseGeometry(this.oldGeometry);
    },

    mouseDblClick: function(evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseDblClick.apply(this, arguments);

        this.mouseDown(evt);
        // this.eraseTmpElements();
        if (this.geometry.path.length > 2) {
            this.finalizeGeometry();
        }
    },

    mouseDown: function(evt) {
        // Double click manager
        if (this.lastDown && this.lastDown.x  == evt.xy.x && this.lastDown.y == evt.xy.y) {
            return;
        }
        this.lastDown = evt.xy;

        if (this.geometry.path.length == 0 && this.oldGeometry) {
            this.map.vectorLayer.renderer.eraseGeometry(this.oldGeometry);
        }

        OpenLayers.MouseListener.EditingListener.prototype.mouseDown.apply(this, arguments);

        if (evt.point == this.geometry.path[0]) {
            this.eraseTmpElements();
            this.finalizeGeometry();
        } else {
            this.geometry.addPoint(evt.point);
            this.map.vectorLayer.renderer.drawGeometry(this.geometry, this.map.vectorLayer.style);
        }

    },

    mouseMove: function(evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseMove.apply(this, arguments);

        if (this.isMouseDown) {
            this.mouseDown(evt);

        } else {
            if (this.geometry.path.length > 0) {
                this.tmpLineSting.path[0] = this.geometry.path[this.geometry.path.length-2];
                this.tmpLineSting.path[1] = evt.point;
                this.tmpLineSting.path[2] = this.geometry.path[this.geometry.path.length-1];
                this.map.vectorLayer.renderer.drawGeometry(this.tmpLineSting, this.style);

            }
        }
    },
 mouseUp: function(evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseUp.apply(this, arguments);
         this.draw();
    },
    keyDown: function(evt) {

        OpenLayers.MouseListener.EditingListener.prototype.keyDown.apply(this, arguments);

        switch (evt.keyCode){
            case OpenLayers.Event.KEY_RETURN:
                this.eraseTmpElements();
                if(this.geometry.path.length > 1){
                    this.finalizeGeometry();
                }
                OpenLayers.Util.clearArray(this.geometry.path);
                break;
            case OpenLayers.Event.KEY_BACKSPACE:
            case OpenLayers.Event.KEY_DELETE:
            case OpenLayers.Event.KEY_ESC:
                this.eraseTmpElements();
                OpenLayers.Util.clearArray(this.geometry.path);
                OpenLayers.Event.stop(evt);
                break;
        }
    },

    draw: function() {
        var digits = parseInt(this.numdigits);
        if(!this.div)
        {	this.div=document.createElement('div');
       		this.div.id="MeasureArea";}
		this.div.innerHTML="";
        //configure main div
        this.div.style.position = "relative";
        this.div.style.top = "30px";
        this.div.style.right = "0px";
        this.div.style.left = "";
        this.div.style.fontFamily = "sans-serif";
        this.div.style.fontWeight = "bold";
        this.div.style.marginTop = "3px";
        this.div.style.marginLeft = "3px";
        this.div.style.marginBottom = "3px";
        this.div.style.fontSize = "smaller";   
        this.div.style.color = "white";   
        this.div.style.backgroundColor = "blue";
        var newHtml = this.prefix +
                      this.geometry.getLength().toFixed(digits) +
                      this.suffix;
	
        if (newHtml != this.div.innerHTML) {

            this.div.innerHTML = newHtml;
        }
        document.lastChild.lastChild.appendChild(this.div);
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.MouseListener.MeasureArea"

});
