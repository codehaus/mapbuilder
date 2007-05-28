/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id: GetFeatureInfo.js 2590 2007-03-13 16:27:36Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
/**
 * Implements WMS GetFeatureInfo functionality, popping up a query result
 * window when user clicks on map.
 * @constructor
 * @base ButtonBase
 * @author Nedjo
 * @constructor
 * @param toolNode The XML node in the Config file referencing this object.
 * @param model The widget object which this tool is associated with.
 */
function GetFeatureInfo(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

/**
   * Interactive ZoomOut control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.GetFeatureInfo',
      type: OpenLayers.Control.TYPE_TOOL,
 /** @type String */
    activeColor:"#444FE7",
	queryLayer:null,
	queryLayerName:null,
	infoFormat:'text/plain',
	request:new Object(),
	featureCount:100,

   draw: function() {
   
        var callbacks = {
            done: this.sendRequest
        };
      this.handler = new OpenLayers.Handler.Box( this,
          callbacks, {keyMask: this.keyMask} );
    },
    
    /**
     * Render an array of attributes into a popup.
     * @param attributes Attributes array to render
     */
    drawAfterRequest: function(response) {
   
        // Clear previous popup
        if (this.outputDiv == null) {
            this.outputDiv = OpenLayers.Util.createDiv();
            this.outputDiv.id = this.id+"Results";
            this.outputDiv.className = 'olControl';
        }
        
        this.outputDiv.innerHTML="";
        
        //configure main div
        this.outputDiv.style.position = "absolute";
        this.outputDiv.style.height = "125px";
		this.outputDiv.style.width = "140px";
        this.outputDiv.style.top = "30px";
        this.outputDiv.style.right = "0px";
        this.outputDiv.style.left = "";
        this.outputDiv.style.fontFamily = "sans-serif";
        this.outputDiv.style.fontWeight = "bold";
        this.outputDiv.style.marginTop = "3px";
        this.outputDiv.style.marginLeft = "3px";
        this.outputDiv.style.marginBottom = "3px";
        this.outputDiv.style.fontSize = "smaller";   
        this.outputDiv.style.color = "white";   
        this.outputDiv.style.backgroundColor = "transparent";

        this.innerDiv = document.createElement("div");
        this.innerDiv.innerHTML="<b>Attribute List</b><br/>"
        this.innerDiv.id = "layersDiv";
        this.innerDiv.style.paddingTop = "15px";
        this.innerDiv.style.paddingLeft = "2px";
        this.innerDiv.style.paddingBottom = "2px";
        this.innerDiv.style.paddingRight = "2px";
        this.innerDiv.style.backgroundColor = this.activeColor;
		this.innerDiv.style.height = "125px";
		this.innerDiv.style.overflow = "auto";
        this.outputDiv.appendChild(this.innerDiv);    

        OpenLayers.Rico.Corner.round(this.outputDiv, {corners: "tl bl",
                                      bgColor: "transparent",
                                      color: this.activeColor,
                                      blend: false});

        OpenLayers.Rico.Corner.changeOpacity(this.innerDiv, 0.75);
        
        var attribs=response.responseText;
        switch(this.infoFormat)
        {
        		case "text/plain":  
        							 ///////////////////////////////////MDWEB/////////////////
        							      var tmpLayer=attribs.split("Layer");
        							      //decoupe la reponse par layer
        							      var queryLayersName=this.queryLayerName.split(",");
        							      //parcours toutes les couches queryable
        							       for(var i=0;i<queryLayersName.length;i++)
										   {	
										   		//si la couche queryable est presente dans la reponse
										   		if(attribs.indexOf(queryLayersName[i])!=-1);
									      	 	{	
									      	 		//parcours de toutes les reponses par layer
									      	 		for(var j=0;j<tmpLayer.length;j++)
									      	 		{	
									      	 			//si la reponse de la couche queryable est trouvee alor ferme la boucle
									      	 			if(tmpLayer[j].indexOf(queryLayersName[i])!=-1)
														{
															attribs="Layer"+tmpLayer[j];
															var find=true;
															break;
														}
													}
												}
												if (find)
													break;
								   		
										    }    
           								 this.mdweb=new Object();
           								  find=false;
           								////////////////////affichage de la popup
           								var tmp=attribs.split("  ");
        		                   		var innerDiv="";
        		                   		//var requestWfs=new Array();
        		                   		var nbFeature=0;
        								////////////////////add wfs Layer////////////////////
        								
/*http://localhost/wfs?typename=departement&SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&SRS=EPSG%3A102582&FILTER=%3Cogc:Filter%3E%3Cogc:BBOX%3E%3Cogc:PropertyName%3Ethe_geom%3C/ogc:PropertyName%3E%3Cgml:Box%3E%3Cgml:coordinates%3E672354.210884%2C1815923.137755 672354.210884%2C1815923.137755%3C/gml:coordinates%3E%3C/gml:Box%3E%3C/ogc:BBOX%3E%3C/ogc:Filter%3E       								
//request=GetFeature&typeName="+objRef.typeName+"&bbox="+bbox*/

/*requestWfs.url=this.queryLayer.url.substring(0,this.queryLayer.url.lastIndexOf("/")+1)+"wfs";
                    					
        								this.wfs = new OpenLayers.Layer.WFS( "IRD WFS", 
                    					requestWfs.url,
                    					{ typename: requestWfs.typename,
                    					  BBOX: this.queryLayer.bbox.toBBOX()} );
            							this.map.addLayer(this.wfs);*/
        								
        								
        								////////////////////recuperation value de la popup pour le formulaire POPUP
        								var paramsPopup=new Object();
        							 //if(tmp[2].indexOf("no results")==-1){
								        for(var i=0;i<tmp.length;i++)
								        {	/*pourr wfs layer 
								        	if (tmp[i].indexOf('Layer')!=-1)
        									{	requestWfs.typename=tmp[i].substring(tmp[i].indexOf("'")+1,tmp[i].lastIndexOf("'"));
        									
        									}*/
        									
        									if (tmp[i].indexOf('Feature')!=-1)
        							     	{
        							     		nbFeature++;	
        							     		if(nbFeature==2)
        							     			break;
        							    	}
        							    	else
        							    	{
        							    		innerDiv=innerDiv+""+tmp[i]+"<br/>";
        							    	}
								        
								       }
								       this.innerDiv.innerHTML=innerDiv;
									    
        							break;
        	
        		
        	
       	        default:
                       this.innerDiv.innerHTML=attribs;
                       break;
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
        this.outputDiv.appendChild(this.minimizeDiv);

        // Stop MouseEvents from propogating through this popup
        OpenLayers.Event.observe(this.outputDiv, "mouseup", this.ignoreEvent);
        OpenLayers.Event.observe(this.outputDiv, "mousedown", this.ignoreEvent);
        OpenLayers.Event.observe(this.outputDiv, "click", this.ignoreEvent);
        OpenLayers.Event.observe(this.outputDiv, "dblclick", this.ignoreEvent);
        OpenLayers.Event.observe(this.outputDiv, "mousemove", this.ignoreEvent);
        this.outputDiv.style.zIndex = this.map.Z_INDEX_BASE['Control'] +
                                    this.map.controls.length;
        this.map.viewPortDiv.appendChild( this.outputDiv );
    },
    
    
    /**
    * @param {Event} evt
    */
    startBox: function(evt) {
    //////////////////////////////:mdweb/////////////////////////
    if (this.boxes )
    {
    	   //this.removeZoomBox();
    	    this.map.removeLayer(this.boxes); 
            this.boxes=null;
    	    this.layerBox =false;
    }
    if (this.wfs )
    {
     this.map.removeLayer(this.wfs);
    	this.wfs=null;
    }
    
    //////////////////////////////fin mdweb/////////////////////////
        if (!OpenLayers.Event.isLeftClick(evt))
            return;
		
        this.mouseDragStart = evt.xy.clone();
        this.performedDrag  = false;
        this.zoomBox = OpenLayers.Util.createDiv('zoomBox',
                                                     this.mouseDragStart,
                                                     null,
                                                     null,
                                                     "absolute",
                                                     "2px solid red");
        this.zoomBox.initialCoords = evt.xy;
        this.zoomBox.style.backgroundColor = "white";
        this.zoomBox.style.filter = "alpha(opacity=50)"; // IE
        this.zoomBox.style.opacity = "0.50";
        this.zoomBox.style.fontSize = "1px";
        this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
        this.map.viewPortDiv.appendChild(this.zoomBox);
     
        document.onselectstart = function() { return false; }
        OpenLayers.Event.stop(evt);
    },
    
   /** Zoombox function.
     *
     */
    sendRequest: function(position) {
            if (position instanceof OpenLayers.Bounds) {
                
            		this.mdweb=new Object();
							
						////////////////////////////MDWEB//////////////////////////////
							///////////////Transformation mètres en degrées
							var minXY = new OpenLayers.Pixel(position.left, position.bottom);
          					var maxXY = new OpenLayers.Pixel(position.right, position.top);
          					minXY = this.map.getLonLatFromViewPortPx(minXY);
          					maxXY = this.map.getLonLatFromViewPortPx(maxXY);
                    
          					var bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,maxXY.lon, maxXY.lat);
							
							//Transforme en LatLon pour la requete sgbd carto
							this.mdweb.os=this.map.mbMapPane.model.proj.Inverse(new Array(bounds.left,bounds.bottom));
							this.mdweb.en=this.map.mbMapPane.model.proj.Inverse(new Array(bounds.right,bounds.top));
							
         						
							////////////////////////////MDWEB//////////////////////////////      
                    
                }else {
                			
		                this.queryLayer=this.map.layers[0];
		                this.queryLayerName="";
					    for(var i=0;i<this.map.layers.length;i++)
					    {
					    	if(this.map.layers[i].params && this.map.layers[i].queryable && (this.map.layers[i].visibility==true))
					      	{	
					      	 	this.queryLayerName=this.map.layers[i].params.LAYERS+","+this.queryLayerName;
					      	 	this.featureCount++;
						    }
			   		
					    }
					
				        if(this.queryLayer){
				           		//////////////////////::MDWEB///////////////////////
				           		///////////requete a effectuer sur le wms 
				           	    
				           	   
				                //////////////Pour ajouter l'objet clicker en wfs 
				           	   /* var tolerance=3;
				           	    var minX=position.x-tolerance;
				           	    var maxX=position.x+tolerance;
				           	    var minY=position.y-tolerance;
				           	    var maxY=position.y+tolerance;
				           	    var  maxEvt=new OpenLayers.Pixel(minX,minY);
				           	    var  minEvt=new OpenLayers.Pixel(maxX,maxY);
				           	   
				           	    var start = this.map.getLonLatFromViewPortPx(maxEvt);
			                    var end = this.map.getLonLatFromViewPortPx(minEvt);
			                    var top = Math.max(start.lat, end.lat);
			                    var bottom = Math.min(start.lat, end.lat);
			                    var left = Math.min(start.lon, end.lon);
			                    var right = Math.max(start.lon, end.lon);
			                    this.queryLayer.bbox = new OpenLayers.Bounds(left, bottom, right, top);*/
				                //////////////Fin Pour ajouter l'objet clicker en wfs 
				                
				           		var url =  this.queryLayer.getFullRequestString({
				                            REQUEST: "GetFeatureInfo",
				                            EXCEPTIONS: "application/vnd.ogc.se_xml",
				                            BBOX: this.map.getExtent().toBBOX(),
				                            X: position.x,
				                            Y: position.y,
				                            INFO_FORMAT: this.infoFormat,
				                            QUERY_LAYERS: this.queryLayerName,
				                            FEATURE_COUNT:100,
				                            WIDTH:this.map.size.w,
				                            HEIGHT:this.map.size.h,
				                            SLD:""});
				                
				                OpenLayers.ProxyHost=config.proxyUrl+"?url="; 
				                OpenLayers.loadURL(url, '', this, this.drawAfterRequest);
				           }else{
				                alert("No query layer specified");
				            }
					}
					////////////////////////////MDWEB//////////////////////////////
	         		this.mdweb=null;
	         		this.paramsPopup=null;
					////////////////////////////END MDWEB////////////////////////////// 
					
					
					
					
					
               
            
        
    },
    
   
    
    /** Hide all the contents of the control, shrink the size, 
     *   add the maximize icon
     * 
     * @param {Event} evt
     */
    minimizeControl: function(evt) {
        this.outputDiv.innerHTML = "";
    },

    /** 
     * @private
     *
     * @param {Event} evt
     */
    ignoreEvent: function(evt) {
        OpenLayers.Event.stop(evt);
    }
 
});

    return Control;
  }
}
