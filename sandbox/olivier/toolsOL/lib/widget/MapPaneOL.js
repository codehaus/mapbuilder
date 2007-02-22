/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: MapPaneOL.js 2546M 2007-01-26 16:33:49Z (local) $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Widget to render a map from an OGC context document.  The layers are
 * rendered using http://openlayers.org .
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapPaneOL(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
  
  //TBD Do we need MapContainerBase?
  MapContainerBase.apply(this,new Array(widgetNode, model));

  //loading img to be displayed while models load
  var loadingSrc = widgetNode.selectSingleNode("mb:loadingSrc");
  if (loadingSrc) {
    this.loadingSrc = config.skinDir + loadingSrc.firstChild.nodeValue;
  } else {
    this.loadingSrc = config.skinDir + "/images/Loading.gif";
  }

  this.model.addListener("refresh",this.paint, this);
  this.model.addListener("hidden",this.hidden, this);
  this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("moveLayerUp",this.moveLayerUp, this);
  this.model.addListener("moveLayerDown",this.moveLayerDown, this);
  //this.model.addListener( "zoomToBbox", this.zoomToBbox, this );
  //this.model.addListener( "zoomOut", this.zoomOut, this );
  //this.model.addListener( "zoomIn", this.zoomIn, this );
  // this.model.addListener( "zoomToMaxExtent", this.zoomToMaxExtent, this );
 //this.model.addFirstListener("loadModel",this.paint,this);
  this.model.addListener("newModel",this.clearWidget2,this);
}


/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapPaneOL.prototype.paint = function(objRef, refresh) {
  // Create an OpenLayers map
  
 /*if (objRef.oLMap){alert("newModel");
  objRef.clearWidget2(objRef);
 }*/
 //alert("paint mapaneOL "+objRef.model.map);

  if(!objRef.model.map || refresh=="sld"){
  
	if(refresh=="sld")
	{
		objRef.clearWidget2(objRef);
	}

    if(objRef.model.doc.selectSingleNode("//wmc:OWSContext"))
        objRef.context="OWS";
    else if(objRef.model.doc.selectSingleNode("//wmc:ViewContext"))
        objRef.context="View";
    else
        alert(mbGetMessage("noContextDefined"));
        
    proj=objRef.model.proj;

    // OpenLayers doesn't contain information about projection, so if the
    // baseLayer projection is not standard lat/long, it needs to know
    // maxExtent and maxResolution to calculate the zoomLevels.
    maxExtent=null;
    maxResolution=null;

      maxExtent=objRef.widgetNode.selectSingleNode("mb:maxExtent");
      maxExtent=(maxExtent)?maxExtent.firstChild.nodeValue.split(" "):null;

   
      // If the maxExtent/maxResolution is not specified in the config
      // calculate it from the BBox and Width/Height in the Context.
      if(!maxExtent){

      	maxExtent=objRef.model.getBoundingBox();
        width=objRef.model.getWindowWidth();
  
      }
      maxExtent=(maxExtent)?new OpenLayers.Bounds(maxExtent[0],maxExtent[1],maxExtent[2],maxExtent[3]):null;
  // }
  
  	var mapOptions = {
                projection: proj.srs,
                units: proj.units,
                maxExtent: maxExtent,
                maxResolution: 'auto',
            };
  
    objRef.model.map = new OpenLayers.Map(objRef.node, {controls:[]},mapOptions);
    
alert(objRef.model.map.projection+" = "+ mapOptions.projection);
    // Increase hight of Control layers to allow for lots of layers.
    objRef.model.map.Z_INDEX_BASE.Control=10000;
   //objRef.model.map.addControl(new OpenLayers.Control.MousePosition()); 
   //objRef.model.toolBar=new OpenLayers.Control.MouseToolbar();
   // objRef.model.map.addControl(objRef.model.toolBar);  
    // loop through all layers and create OLLayers 
    objRef.model.map.addMouseListener(new OpenLayers.MouseListener.MouseDefaults());
    objRef.model.map.addControl(new OpenLayers.Control.MousePosition()); 
    var layers = objRef.model.getAllLayers();
    objRef.oLlayers = new Array();
      
    for (var i=0;i<=layers.length-1;i++) {
    	   // Options to pass into the OpenLayers Layer initialization
      
      var service=layers[i].selectSingleNode("wmc:Server/@service");service=(service)?service.nodeValue:"";
       var title=layers[i].selectSingleNode("wmc:Title");title=(title)?title.firstChild.nodeValue:"";
      var name2=layers[i].selectSingleNode("wmc:Name");name2=(name2)?name2.firstChild.nodeValue:"";
       
        if (objRef.context=="OWS"){
            var href=layers[i].selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");href=(href)?href.firstChild.nodeValue:"";	  
        }
        else
        {	
        	var href=layers[i].selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
        }
        
        
       var format=layers[i].selectSingleNode("wmc:FormatList/wmc:Format");format=(format)?format.firstChild.nodeValue:"image/gif";
       var vis=layers[i].selectSingleNode("@hidden");
       if (vis)
         if(vis.nodeValue=="1")
         	vis=false;
         else
         	vis=true;
	   

      
	  var options = new Array();
      options.visibility=vis;
      options.transparent=(i==0)?"FALSE":"TRUE";
         options.projection=proj.srs;
      
      // OpenLayers expects the base layer to be non-transparent (it gets
      // projection info from the baselayer).
      // See Issue http://trac.openlayers.org/ticket/390
      
      

        	//options.displayOutsideMaxExtent= true;
      switch(service){

        // WMS Layer
        case "OGC":
        case "wms":
        case "OGC:WMS":
        	if(i==0 && !objRef.model.map.baseLayer)
       		{	options.isBaseLayer=true;
       }	
       		else
       			options.isBaseLayer=false;
       			
        	var params = new Array();
        	params=objRef.extractStyle(objRef,layers[i],"wms");
        	
            objRef.oLlayers[name2]= new OpenLayers.Layer.WMS(title,href,
                {
                    layers: name2,
                    //true in upper case else the context doc boston.xml doesn't work
                    transparent:"TRUE",
                    format: format,
                    sld:params.sld,
                    sld_body:params.sld_body,
                    styles:params.styles
                },
                options
            );
           
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            //if(objRef.oLlayers[name2].isBaseLayer)
       			//objRef.model.map.setLayerZIndex(objRef.oLlayers[name2], 20);
            break;
           
            
        // WFS Layer
        case "wfs":
        case "OGC:WFS":
        
        style=objRef.extractStyle(objRef,layers[i],"wfs");
            if(style){
                options.style=style;
            }else{
                options.style=new OpenLayers.Style.WebSafe(2*i+1);
            }
            options.featureClass=OpenLayers.Feature.WFS;
            
			objRef.oLlayers[name2]= new OpenLayers.Layer.WFS( 
				title,
                href,
                {typename: name2, 
                 maxfeatures: 1000},
                 options
             );
            objRef.model.map.addLayer(objRef.oLlayers[name2]);
             break;
             
        // GML Layer
        case "gml":
        case "OGC:GML":
        
            style=objRef.extractStyle(objRef,layers[i],"gml");
            if(style){
                options.style=style;
            }else{
                options.style=new OpenLayers.Style.WebSafe(2*i+1);
            }
            objRef.oLlayers[name2] = new OpenLayers.Layer.GML(title,href,options);
            objRef.model.map.addLayer(objRef.oLlayers[name2]);
            break;
            
        case "GMAP":  
        case "Google":
            //<script src='http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAA8qdfnOIRy3a9gh214V5jKRTwM0brOpm-All5BF6PoaKBxRWWERQ7UHfSE2CGKw9qNg0C1vUmYLatLQ'></script>
            
            options.isBaseLayer=true;
           	objRef.oLlayers[name2] = new OpenLayers.Layer.Google( "Google Satellite" , {type: G_HYBRID_MAP, maxZoomLevel:18},options );
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            break;
        case "YMAP":   
        case "Yahoo":
             // <script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script>
            options.isBaseLayer=true;
           	objRef.oLlayers[name2] = new OpenLayers.Layer.Yahoo( "Yahoo");
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            break;
            
        case "VE":
        case "Microsoft":
            //<script src='http://dev.virtualearth.net/mapcontrol/v3/mapcontrol.js'></script>
            options.isBaseLayer=true;
           	objRef.oLlayers[name2] = new OpenLayers.Layer.VirtualEarth( "VE",{minZoomLevel: 0, maxZoomLevel: 18,type: VEMapStyle.Hybrid}); 
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            break;
            
        case "MultiMap":   
        //<script type="text/javascript" src="http://clients.multimap.com/API/maps/1.1/metacarta_04"></script>
        
         	options.isBaseLayer=true;
           	objRef.oLlayers[name2] = new OpenLayers.Layer.MultiMap( "MultiMap"); 
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            break;
        default:
            alert(mbGetMessage("layerTypeNotSupported", service));
      }
    }
    //objRef.model.map.zoomTo(1);
	//objRef.model.map.zoomTo(0);
	
    bbox=objRef.model.getBoundingBox();
    objRef.model.map.zoomToMaxExtent();
    
    //objRef.model.map.zoomToExtent(new OpenLayers.Bounds(bbox[0],bbox[1],bbox[2],bbox[3]));
    
	var bboxOL=objRef.model.map.getExtent().toBBOX().split(',');
	
    ul = new Array(bboxOL[0],bboxOL[3]);
    lr = new Array(bboxOL[2],bboxOL[1]);
    objRef.model.setBoundingBox( new Array(ul[0], lr[1], lr[0], ul[1]) );
    objRef.model.extent.setSize(new Array(objRef.model.map.getResolution(),objRef.model.map.getResolution()));
objRef.model.setParam("aoi", new Array(ul, lr) );
 objRef.model.callListeners("mapLoaded");
     //objRef.clearWidget2(objRef);
  }
}

///############################################################################################END TBD
/**
 * Extract a style from a Layer node. Returns null if no style parameters are
 * found.
 * @param objRef Pointer to widget object.
 * @param node Node to extract style from.
 * @return OpenLayers.Style
 */
MapPaneOL.prototype.extractStyle = function(objRef, node, service) {

if(service=="gml" || service=="wfs")
{
    var style1=new OpenLayers.Style({
        map:objRef.model.map
        });
    var value;
    var styleSet=false;

    value=node.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill']");
    if(value){
        style1.fillColor=value.firstChild.nodeValue;
        styleSet=true;
    }
    value=node.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill-opacity']");
    if(value){
        style1.fillOpacity=value.firstChild.nodeValue;
        styleSet=true;
    }

    value=node.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke']");
    if(value){
        style1.strokeColor=value.firstChild.nodeValue;
        styleSet=true;
    }
    
    value=node.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-opacity']");
    if(value){
        style1.strokeOpacity=value.firstChild.nodeValue;
        styleSet=true;
    }
    
    if(!styleSet)style1=null;
    return style1;
}
else if (service=="wms")
{
			params=new Array();
        	var sld=node.selectSingleNode("wmc:StyleList/wmc:Style[@current='1']/wmc:SLD");
			if(sld)
			{
			   if(sld.selectSingleNode("wmc:OnlineResource"))
			   {	
			   		params.sld=sld.selectSingleNode("wmc:OnlineResource").getAttribute("xlink:href");
			  
			   }
			   else if(sld.selectSingleNode("wmc:FeatureTypeStyle"))
			   {
			   		params.sld=Sarissa.serialize(sld.selectSingleNode("wmc:FeatureTypeStyle"));
			   }
			   else if(sld.selectSingleNode("wmc:StyledLayerDescriptor"))
		    	{ 
		    		params.sld_body=Sarissa.serialize(sld.selectSingleNode("wmc:StyledLayerDescriptor"));
		    		
		    	}
		    }
		    else if(node.selectSingleNode("wmc:StyleList/wmc:Style[@current='1']/wmc:Name"))
		    {
		    	if(node.selectSingleNode("wmc:StyleList/wmc:Style[@current='1']/wmc:Name").firstChild)
		    		params.styles=node.selectSingleNode("wmc:StyleList/wmc:Style[@current='1']/wmc:Name").firstChild.nodeValue;
		    		
		    }        
		    
		    return params;

}
// OpenLayer.Style is processing style in % coords, not pixels.
// When this is fixed, the following lines can be uncommented.
//    value=node.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-width']");
//    if(value){
//        style1.strokeWidth=value.firstChild.nodeValue;
//        styleSet=true;
//    }
//  
//    value=node.selectSingleNode(".//sld:Graphic/sld:Size");
//    if(value){
//        style1.pointRadius=value.firstChild.nodeValue;
//        styleSet=true;
//    }
   
}
/**
 * Hide/unhide a layer. Called by Context when the hidden attribute changes.
 * @param objRef Pointer to widget object.
 * @param layerName Name of the layer to hide/unhide.
 */
MapPaneOL.prototype.hidden = function(objRef, layerName) {
  var vis=objRef.model.getHidden(layerName);
//alert(vis);
  if(vis=="1"){ var hidden=false; }
  else {var hidden=true; }
   
  if(objRef.getLayer(objRef,layerName))objRef.getLayer(objRef,layerName).setVisibility(hidden);
}
//###################################################TDO
/**
  * returns layer node from LayerMgr
  * @param layerName The layer Id.
  */
MapPaneOL.prototype.getLayer = function(objRef,layerName) {

  return objRef.model.map.getLayer(objRef.oLlayers[layerName].id);
}

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
MapPaneOL.prototype.getLayerDivId = function(objRef,layerName) {
  return objRef.getLayer(layerName).div; //TBD: add in timestamps
}
//####################################################
/**
 * Removes a layer from the output
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPaneOL.prototype.deleteLayer = function(objRef, layerName) {
   if(objRef.oLlayers[layerName])objRef.model.map.removeLayer(objRef.oLlayers[layerName]);
}
/**
 * Removes all layers from the output
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPaneOL.prototype.deleteAllLayers = function(objRef) {
	objRef.model.map.destroy();
}
//#############################################TDO
/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPaneOL.prototype.moveLayerUp = function(objRef, layerName) {
	var map=objRef.model.map;
	/*if(map.getLayer(objRef.oLlayers[layerName].id).isBaseLayer)
	
	else*/
   		map.raiseLayer(map.getLayer(objRef.oLlayers[layerName].id), 1); 
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS name for the layer to be removed
 */
MapPaneOL.prototype.moveLayerDown = function(objRef, layerName) {
     objRef.model.map.raiseLayer(objRef.getLayer(objRef,layerName), -1);
}
//###############################################
/**
 * Adds a layer into the output
 * @param layerName the WMS name for the layer to be added
 */
MapPaneOL.prototype.addLayer = function(objRef, layerNode) {alert(objRef.id);
	proj=objRef.model.proj;
	// OpenLayers doesn't contain information about projection, so if the
    // baseLayer projection is not standard lat/long, it needs to know
    // maxExtent and maxResolution to calculate the zoomLevels.
    maxExtent=null;
    maxResolution=null;

      maxExtent=objRef.widgetNode.selectSingleNode("mb:maxExtent");
      maxExtent=(maxExtent)?maxExtent.firstChild.nodeValue.split(" "):null;
      maxResolution=objRef.widgetNode.selectSingleNode("mb:maxResolution");
      maxResolution=(maxResolution)?maxResolution.firstChild.nodeValue:null;
   
      // If the maxExtent/maxResolution is not specified in the config
      // calculate it from the BBox and Width/Height in the Context.
      if(!maxExtent&&!maxResolution){
      	maxExtent=objRef.model.getBoundingBox();
        width=objRef.model.getWindowWidth();
        maxResolution=(maxExtent[2]-maxExtent[0])/width;     
      }
      maxExtent=(maxExtent)?new OpenLayers.Bounds(maxExtent[0],maxExtent[1],maxExtent[2],maxExtent[3]):null;


    // Increase hight of Control layers to allow for lots of layers.
    objRef.model.map.Z_INDEX_BASE.Control=10000;
   //objRef.model.map.addControl(new OpenLayers.Control.MousePosition()); 
   //objRef.model.toolBar=new OpenLayers.Control.MouseToolbar();
   // objRef.model.map.addControl(new OpenLayers.Control.MouseToolbar(objRef.model.toolBar));  
    // loop through all layers and create OLLayers 
    var layer = layerNode;

     var service=layer.selectSingleNode("wmc:Server/@service");service=(service)?service.nodeValue:"";
      var title=layer.selectSingleNode("wmc:Title");title=(title)?title.firstChild.nodeValue:"";
      var name2=layer.selectSingleNode("wmc:Name");name2=(name2)?name2.firstChild.nodeValue:"";
       
        if (objRef.context=="OWS"){
            var href=layer.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");href=(href)?href.firstChild.nodeValue:"";	
        }
        else
        {	var href=layer.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
        }
             
       var format=layer.selectSingleNode("wmc:FormatList/wmc:Format");format=(format)?"image/gif":"image/gif";
       var vis=layer.selectSingleNode("@hidden");vis=(vis)?(vis.nodeValue!="1"):true;

      // Options to pass into the OpenLayers Layer initialization
      var options = new Array();
      options.visibility=vis;
      
      // OpenLayers expects the base layer to be non-transparent (it gets
      // projection info from the baselayer).
      // See Issue http://trac.openlayers.org/ticket/390
      //options.isBaseLayer=(i==layers.length-1)?true:false;
      options.isBaseLayer=false;
      //alert(options.isBaseLayer);
      options.transparent="TRUE";
      options.buffer=1;
      options.maxExtent=maxExtent;
      options.maxResolution=maxResolution;
      options.projection=proj.srs;

      switch(service){

        // WMS Layer
        case "OGC":
        case "wms":
        case "OGC:WMS":
        
            objRef.oLlayers[name2]= new OpenLayers.Layer.WMS(
                title,
                href,
                {
                    layers: name2,
                    transparent: "true",
                    format: format
                },
                options
            );
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            break;
           
            
        // WFS Layer
        case "wfs":
        case "OGC:WFS":
        
        style=objRef.extractStyle(objRef,layer);
            if(style){
                options.style=style;
            }else{
                options.style=new OpenLayers.Style.WebSafe(2*i+1);
            }
            options.featureClass=OpenLayers.Feature.WFS;
            
			objRef.oLlayers[name2]= new OpenLayers.Layer.WFS( 
				title,
                href,
                {typename: name2, 
                 maxfeatures: 1000},
                 options
             );
            objRef.model.map.addLayer(objRef.oLlayers[name2]);
             break;
             
        // GML Layer
        case "gml":
        case "OGC:GML":
        
            style=objRef.extractStyle(objRef,layer);
            if(style){
                options.style=style;
            }else{
                options.style=new OpenLayers.Style.WebSafe(2*i+1);
            }
            objRef.oLlayers[name2] = new OpenLayers.Layer.GML(title,href,options);
            objRef.model.map.addLayer(objRef.oLlayers[name2]);
            break;
          case "GMAP":
          case "Google":
            //options.maxExtent
            //options.maxResolution=0.703125;
           	objRef.oLlayers[name2] = new OpenLayers.Layer.Google( "Google Satellite" , {type: G_HYBRID_MAP, 'maxZoomLevel':18},options );
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            break;
          case "YMAP":
          case "Yahoo":
           	/*objRef.oLlayers[name2] = new OpenLayers.Layer.Google( "Google Satellite" , {type: G_HYBRID_MAP, 'maxZoomLevel':18},options );
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            */
            break;
          case "VE":
          case "Microsoft":
           	/*objRef.oLlayers[name2] = new OpenLayers.Layer.Google( "Google Satellite" , {type: G_HYBRID_MAP, 'maxZoomLevel':18},options );
            objRef.model.map.addLayers([objRef.oLlayers[name2]]);
            */
            break;
        default:
            alert(mbGetMessage("layerTypeNotSupported", service));
      }
 }
/**
 * This function is called when a new Context is about to be loaded
 * - it deletes all the old layers so new ones can be loaded.
 * TBD: This should be renamed to clearWidget, except inheritence
 * is not working if we do that and it doesn't get called.
 * @param objRef Pointer to this object.
 */
MapPaneOL.prototype.clearWidget2 = function(objRef) {


	
    if(objRef.model.map)
    {
    	objRef.model.map.destroy();
		outputNode =  document.getElementById( objRef.model.id+"Container_OpenLayers_ViewPort" );
		if(outputNode)
		{
	    	objRef.node.removeChild(outputNode);  	
	   	}
   		
   		objRef.model.map=null;
   	}
    
}



