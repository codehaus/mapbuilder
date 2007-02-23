/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */
 
 /**
 * @class
 *
 * @requires OpenLayers/Control/EditingTool.js
 */
OpenLayers.Control.EditingAttributes = OpenLayers.Class.create();
OpenLayers.Control.EditingAttributes.prototype = OpenLayers.Class.inherit( OpenLayers.MouseListener.EditingListener, {

    /** @type String */
activeColor:"blue",
    
     /** @type String */
	id: "editingattributes",
	
	/** @type String */
    imageOn:"QueryEnable.png",
    
    /** @type String */
    imageOff:"QueryDisable.png",
    
    /** @type String */
    type:"RadioButton",
	
	 /** @type OpenLayers.Size */
    size: new OpenLayers.Size(24,24),
//"editingattributes","QueryEnable.png", "QueryDisable.png","RadioButton",optionsTools
    /*
     * 
     */
    initialize: function(options) {
   		OpenLayers.Control.prototype.initialize.apply(this,arguments);
        options = options || [];
        OpenLayers.Util.extend(this, options);
        this.position = new OpenLayers.Pixel(100, 200);
             
    },
     draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments); 
        return this.div;
    },
       moveTo: function (px) {
        OpenLayers.Control.prototype.moveTo.apply(this, arguments);
    },
    /**
     * Register for mousedown events
     */
    turnOn: function() {

       // this.setLayer();
        
        this.mouseDown = this.mouseDown.bindAsEventListener(this);
        this.map.events.register( "mousedown", this, this.mouseDown);
    },

    /**
     *
     */
    turnOff: function() {
        this.map.events.unregister( "mousedown", this, this.mouseDown);
    },
    
    /**
     * Render an array of attributes into a popup.
     * @param attributes Attributes array to render
     */
    setContent: function(attributes) {
        // Clear previous popup
       
        this.div.innerHTML="";
        
        //configure main div
        this.div.style.position = "absolute";
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
        this.div.style.backgroundColor = "transparent";

        this.innerDiv = document.createElement("div");
        this.innerDiv.innerHTML="<b>Attribute List</b><br/>"
        this.innerDiv.id = "layersDiv";
        this.innerDiv.style.paddingTop = "2px";
        this.innerDiv.style.paddingLeft = "2px";
        this.innerDiv.style.paddingBottom = "2px";
        this.innerDiv.style.paddingRight = "2px";
        this.innerDiv.style.backgroundColor = this.activeColor;
		this.innerDiv.style.height = "450";
		this.innerDiv.style.overflow = "auto";
        this.div.appendChild(this.innerDiv);    

        OpenLayers.Rico.Corner.round(this.div, {corners: "tl bl",
                                      bgColor: "transparent",
                                      color: this.activeColor,
                                      blend: false});

        OpenLayers.Rico.Corner.changeOpacity(this.innerDiv, 0.75);
        
        attribs=attributes.getAttributes();
        for (var i = 0; i < attribs.length; i++) {
            var attributeDiv = document.createElement("div");
            var attributeValue = document.createElement("div");
            
            var attributeLabel = document.createElement("label");
            attributeLabel.setAttribute("for", attribs[i].label);
            attributeLabel.appendChild(document.createTextNode(attribs[i].label));
          
            var attributeValue = document.createElement("input");
            attributeValue.setAttribute("type", "text");
            attributeValue.setAttribute("id", attribs[i].label);
            attributeValue.setAttribute("value", attribs[i].value);
            
            attributeDiv.appendChild(attributeLabel);
            attributeDiv.appendChild(attributeValue);

            this.innerDiv.appendChild(attributeDiv);
        }
        
        // minimize button div
        var imgLocation = OpenLayers.Util.getImagesLocation();
        var img = imgLocation + 'layer-switcher-minimize.png';
        var sz = new OpenLayers.Size(18,18);        
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MinimizeDiv", 
                                    null, 
                                    sz, 
                                    img, 
                                    "absolute");
        this.minimizeDiv.style.top = "5px";
        this.minimizeDiv.style.right = "0px";
        this.minimizeDiv.style.left = "";
        this.minimizeDiv.style.display = "";
        OpenLayers.Event.observe(this.minimizeDiv, 
                      "click", 
                      this.minimizeControl.bindAsEventListener(this));
        this.div.appendChild(this.minimizeDiv);

        // Stop MouseEvents from propogating through this popup
        OpenLayers.Event.observe(this.div, "mouseup", this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "mousedown", this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "click", this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "dblclick", this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "mousemove", this.ignoreEvent);
    },
    
    mouseDown: function(evt) {
        
        
        // Double click manager
        if (this.lastDown && this.lastDown.x  == evt.xy.x && this.lastDown.y == evt.xy.y) {
            return;
        }
        this.lastDown = evt.xy;
        
        OpenLayers.MouseListener.EditingListener.prototype.mouseDown.apply(this, arguments);
        
        // Display Feature attributes
        if(evt.targetGeometry && evt.targetGeometry.feature && evt.targetGeometry.feature.attributes) {
            this.setContent(evt.targetGeometry.feature.attributes);
        }
    },

    /**
     * Add the Geometry that has been selected to the Event.
     * The top geometry layer is selected first, this is done using
     * SVG/VML feature selection and is accurate. If a feature is not
     * found, features in layers below are progressively queried using
     * the BoundingBox of the feature. (Ie, it is not very accurate).
     * See http://trac.openlayers.org/ticket/434 for more info.
     *
     * @param {Event} evt
     */
    _setEventContext: function(evt) {
        // calculate the mouse position
        var lonlat = this.map.getLonLatFromLayerPx(evt.xy);
        evt.point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

		// Set tolerance for point layers
		// Currently tolerence is hard coded to +/- 2
		// TBD, use the radius from Style for tollerance instead
		var size=this.map.getSize();
		var extent=this.map.getExtent();
		var tolerance=2; // +/- 2 pixels
		var toleranceLon=(extent.right-extent.left)*tolerance/size.w;
		var toleranceLat=(extent.top-extent.bottom)*tolerance/size.h;
		var toleranceLon1,toleranceLat1;

        // For the top layer, query the SVG/VML feature
        if(this.map.layers.length>0){
            evt.targetGeometry = this.map.layers[this.map.layers.length-1].renderer.getGeometryFromEvent(evt);
        }
        // For remaining layers, query features based on feature bounds.
        // Exit loop when a feature is found.
        for(var i=this.map.layers.length-1;(!evt.targetGeometry&&(i>=0));i--){
            if(this.map.layers[i].getVisibility()&&this.map.layers[i].isVector){
// TBD: CLASS_TYPE is set to "Feature" instead of "Point". This doesn't seem right.
//				if((this.map.layers[i].features.length>0)&&(this.map.layers[i].features[0].CLASS_NAME=="OpenLayers.Geometry.Point")){
					toleranceLon1=toleranceLon;
					toleranceLat1=toleranceLat;
//				}
//				else{
//					toleranceLon1=0;
//					toleranceLat1=0;
//				}
                for(var f=0;!evt.targetGeometry&&(f<this.map.layers[i].features.length);f++){
                    if(this.map.layers[i].features[f].atPoint(lonlat,toleranceLon1,toleranceLat1)){
                        evt.targetGeometry=this.map.layers[i].features[f].geometry;
                    }
                    
                }
            }
        }
        
        // reset evt.point if modes are activated.
        if (this.editingModes) {
            for (var i = 0; i < this.editingModes.length; i++) {
                var snappingCoordinates = 
                    this.editingModes[i].calculatePoint(evt.point, evt.targetGeometry, this.geometry, this.layer);

                if (snappingCoordinates) {
                    evt.point = snappingCoordinates;                    
                    break;
                }
            }
        }
    },

    /** Hide all the contents of the control, shrink the size, 
     *   add the maximize icon
     * 
     * @param {Event} e
     */
    minimizeControl: function(e) {

        this.div.innerHTML = "";
    },

    /** 
     * @private
     *
     * @param {Event} evt
     */
    ignoreEvent: function(evt) {
        OpenLayers.Event.stop(evt);
    },

    CLASS_NAME: "OpenLayers.Control.EditingAttributes"
    
});
