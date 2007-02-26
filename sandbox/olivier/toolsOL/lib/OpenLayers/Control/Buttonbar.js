/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/MouseListener/MouseDefaults.js
 */
OpenLayers.Control.Buttonbar = OpenLayers.Class.create();
OpenLayers.Control.Buttonbar.X = 0;
OpenLayers.Control.Buttonbar.Y = 0;
OpenLayers.Control.Buttonbar.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {
  
    map: null, 

	centered: null,
    direction: "vertical",
 	position:new OpenLayers.Pixel(OpenLayers.Control.Buttonbar.X,OpenLayers.Control.Buttonbar.Y),
    
    /** @type Array  */
    buttons:null,
    tools:null,
    
    activeTool: null,  
    buttonClicked: null,
    
   /* setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.position = new OpenLayers.Pixel(16, 140);
    },*/
    initialize: function(position, direction) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.position = new OpenLayers.Pixel(OpenLayers.Control.Buttonbar.X,
                                             OpenLayers.Control.Buttonbar.Y);
        if (position) {
            this.position = position;
            
        }
        if (direction) {
            this.direction = direction; 
        }
        this.centered=this.position;
        this.measureDivs = [];
    },
     addTools: function(tools) {
     
        if(!(tools instanceof Array)) {
            tools = [tools];
        }
    	if (tools.length>1)
    	{	var i=0;
    		while (i<tools.length){///alert(tools[i].id);
    			 this._addButton(tools[i],this.centered);
    			 this.centered = this.centered.add((this.direction == "vertical" ? 0 : tools[0].size.w), (this.direction == "vertical" ? tools[0].size.h : 0));
    			 i++;	
    		}
    		
    	}
    	else
    	{
    		this._addButton(tools[0],this.centered);
    		this.centered = this.centered.add((this.direction == "vertical" ? 0 : tools[0].size.w), (this.direction == "vertical" ? tools[0].size.h : 0));
     		
    	}
    	
        if(this.tools) {
        	
            this.tools = this.tools.concat(tools);
            
        } else {
    	   this.tools = [].concat(tools);
        }
        if(this.tools){
        
	        for(var i = 0; i < this.tools.length; i++) {
	    	   this.tools[i].map = this.map;
	        }
        }
       // centered = centered.add((this.direction == "vertical" ? 0 : tools.size.w), (this.direction == "vertical" ? tools.size.h : 0));
       
        //alert(tools["zoomin"].id);
       
    },
    setTool: function(tool){
	    if (tool.type=="RadioButton"){
	 
	        if(this.activeTool){
	            this.activeTool.turnOff();
	            this._swapButtonImg(this.activeTool,"off");
	        }
	        this.activeTool = tool;
	        this.activeTool.turnOn();
	        this._swapButtonImg(tool,"on");
	    }
	    else if (tool.type=="Button"){
	    	tool.doSelect();
	    }
    },
    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments); 
        this.buttons = new Object();
        return this.div;
    },
    
    _addButton:function(tool , xy) {
    	if (!tool.imgDir)tool.imgDir=OpenLayers.Util.getImagesLocation();
    	if(tool.type=="RadioButton"){
        	var imgLocation = tool.imgDir + tool.imageOff;
       		var activeImgLocation = tool.imgDir + tool.imageOn;
        		}
		else if(tool.type=="Button"){
			var imgLocation = tool.imgDir + tool.imageOff;
		
		}
		var btn = OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_Buttonbar_" + tool.id, xy, tool.size, imgLocation, "absolute");
	
        //we want to add the outer div
        this.div.appendChild(btn);
        
        btn.imgLocation = imgLocation;
        btn.activeImgLocation = activeImgLocation;
        
        btn.style.cursor="default";
        btn.events = new OpenLayers.Events(this, btn, null, true);
        btn.events.register("mousedown", this, this.buttonDown); 
        btn.events.register("mouseup", this, this.buttonUp); 
        btn.events.register("dblclick", this, OpenLayers.Event.stop);
        btn.action = tool;
        btn.title = tool.id;
        btn.alt = tool.id;
        btn.map = this.map;
		//btn.map.div.style.cursor="crosshair";
		//alert(btn);
        //we want to remember/reference the outer div
        
        this.buttons[tool.id] = btn;
        return btn;
    },

    /**
     * @param {Event} evt
     */
    buttonDown: function(evt) {

       
        if (!OpenLayers.Event.isLeftClick(evt)) return;
         this.buttonClicked = evt.element.action;
            if (this.buttonClicked == evt.element.action) {
              //alert(OpenLayers.Event.element(evt));
            	this.setTool(evt.element.action);
              
            }
            OpenLayers.Event.stop(evt);
           
            this.buttonClicked = null;
        
    },

    /**
     * @param {Event} evt
     */
    buttonUp: function(evt) {
       
    },
    
    _swapButtonImg: function(tool, active){
            if (this.buttons[tool.id]) {
            	if (active=="off")
            		this.buttons[tool.id].firstChild.src=this.buttons[tool.id].imgLocation;
            	if (active=="on")
            		this.buttons[tool.id].firstChild.src=this.buttons[tool.id].activeImgLocation
            }
           

        } 
     ,
     CLASS_NAME: "OpenLayer.Control.Buttonbar"
});

