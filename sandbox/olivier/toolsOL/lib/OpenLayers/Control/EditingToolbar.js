/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @class
 *
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.EditingToolbar = OpenLayers.Class.create();
OpenLayers.Control.EditingToolbar.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {

    map: null,
    
    activeTool: null,
    
    tools: null,
    
    initialize: function(options){},

    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.position = new OpenLayers.Pixel(16, 140);
    },
    
    setTool: function(tool){
        if(this.activeTool){
            this.activeTool.turnOff();
        }
        this.activeTool = tool;
        this.activeTool.turnOn();
    },
    
    addTools: function(tools) {
        if(!(tools instanceof Array)) {
            tools = [tools];
        }
    
        if(this.tools) {
            this.tools = this.tools.concat(tools);
        } else {
    	   this.tools = [].concat(tools);
        }
    },
    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        
        for(var i = 0; i < this.tools.length; i++) {
    	   this.tools[i].map = this.map;
        }

        /*
        OpenLayers.Control.prototype.draw.apply(this);
        this.div.style.position = "absolute";
        this.div.style.top = 140;
        this.div.style.left = 16;
        */
        
        for(var i = 0; i < this.tools.length; i++) {
    	   this._drawTool(this.tools[i]);
        }
        
        if(!this.activeTool) {
    	   //this.setTool(this.tools[0]);
        }
        
        return this.div;
    },
    
    _drawTool: function(tool){
        var imgLocation = OpenLayers.Util.getImagesLocation()+tool.image
        var toolDiv = OpenLayers.Util.createDiv(tool.id, null, tool.size, imgLocation, "relative");
        toolDiv.model = tool;
    
        OpenLayers.Event.observe(toolDiv, "click", this._toolClick.bindAsEventListener(this));
    
        this.div.appendChild(toolDiv);
    
        return tool;
    },
    
    _toolClick: function(evt){
        this.setTool(OpenLayers.Event.element(evt).model);
        OpenLayers.Event.stop(evt);
    },
    
    _toolMouseDown: function(evt){
    
        OpenLayers.Event.stop(evt);
    
    },
    
    CLASS_NAME: "OpenLayer.Control.EditingToolbar"
    
    });
