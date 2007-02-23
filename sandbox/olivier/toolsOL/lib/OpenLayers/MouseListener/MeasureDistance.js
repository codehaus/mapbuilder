/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/MouseListener/EditingListener.js
 */
OpenLayers.MouseListener.MeasureDistance = OpenLayers.Class.create();
OpenLayers.MouseListener.MeasureDistance.prototype =
    OpenLayers.Class.inherit(OpenLayers.MouseListener.EditingListener, {

	/** @type String */
	id: "measuredistance",
	
	/** @type String */
    imageOn:"MeasureEnable.png",
    
    /** @type String */
    imageOff:"MeasureDisable.png",
    
    /** @type String */
    type:"RadioButton",
    
    /** @type DOMElement */
    div: null,

    /** @type String */
    prefix: 'dist: ',

    /** @type String */
    suffix: null,

    /** @type int */
    numdigits: 2,

	map:null,
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
       // OpenLayers.MouseListener.EditingListener.prototype.turnOn.apply(this, arguments);
       this.map.addMouseListener(this);
       this.suffix=this.map.units;
        this.geometry = new OpenLayers.Geometry.LineString();
        this.tmpSegment = new OpenLayers.Geometry.LineString();
    },

    /**
     * Turn off the current tool and catch all the concerned events.
     */
    turnOff: function() {
    this.eraseTmpElements();
        this.geometry = null;
     this.map.removeMouseListener(this);
        //OpenLayers.MouseListener.EditingListener.prototype.turnOff.apply(this, arguments);
        
    },

    /**
     * Finalize the geometry from the current tool
     */
    finalizeGeometry: function() {
    
        this.oldGeometry = this.geometry;
        this.geometry = new OpenLayers.Geometry.LineString();
    },


    eraseTmpElements: function() {
        /*for(var i = 0; i < this.oldGeometry.path.length; i++) {
            this.map.vectorLayer.renderer.eraseGeometry(this.geometry.path[i]);
           
        }*/
         this.map.vectorLayer.renderer.eraseGeometry(this.tmpSegment);
    
       // this.map.vectorLayer.renderer.eraseGeometry(this.oldGeometry);
        this.map.vectorLayer.renderer.eraseGeometry(this.oldGeometry);
        
    },

    mouseDblClick: function(evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseDblClick.apply(this, arguments);

        this.mouseDown(evt);
       // this.eraseTmpElements();
        if(this.geometry.path.length > 2){
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

        this.geometry.addPoint(evt.point);
        this.map.vectorLayer.renderer.drawGeometry(this.geometry, this.map.vectorLayer.style);
    },

    mouseMove: function(evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseMove.apply(this, arguments);

        if (this.isMouseDown) {
            this.mouseDown(evt);

        } else {
            if (this.geometry.path.length > 0) {//alert(this.tmpSegment.path[1]);
               this.tmpSegment.path[1] = this.geometry.path[this.geometry.path.length-1];
                this.tmpSegment.path[0] = evt.point;
                //this.tmpLineSting.path[2] = this.geometry.path[this.geometry.path.length-1];
                this.map.vectorLayer.renderer.drawGeometry(this.tmpSegment, this.style);


             
            }
        }
    },
 mouseUp: function(evt) {
        OpenLayers.MouseListener.EditingListener.prototype.mouseUp.apply(this, arguments);
         this.draw();
    },
    keyDown: function(evt) {

        OpenLayers.MouseListener.EditingListener.prototype.keyDown.apply(this, arguments);

        switch (evt.keyCode) {
            case OpenLayers.Event.KEY_RETURN:
                this.eraseTmpElements();
                if (this.geometry.path.length > 1) {
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
       		this.div.id="MeasureDistance";
       	}
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
    CLASS_NAME: "OpenLayers.MouseListener.MeasureDistance"
});
