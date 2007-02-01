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
  //this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("moveLayerUp",this.moveLayerUp, this);
  this.model.addListener("moveLayerDown",this.moveLayerDown, this);
  this.model.addListener( "zoomToBbox", this.zoomToBbox, this );
  this.model.addListener( "zoomOut", this.zoomOut, this );
  this.model.addListener( "zoomIn", this.zoomIn, this );
   this.model.addListener( "centerAt", this.centerAt, this );
   this.model.addListener( "pxToCoord", this.pxToCoord, this );
  //this.model.addListener("newModel",this.clearWidget2,this);
  //this.model.addListener("bbox",this.clearWidget2,this);
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapPaneOL.prototype.paint = function(objRef, refresh) {
  // Create an OpenLayers map
  if(!objRef.oLMap){
  
    if(objRef.model.doc.selectSingleNode("//wmc:OWSContext"))
        objRef.context="OWS";
    else if(objRef.model.doc.selectSingleNode("//wmc:ViewContext"))
        objRef.context="View";
    else
        alert(mbGetMessage("noContextDefined"));
        
    srs=objRef.model.getSRS();

    // OpenLayers doesn't contain information about projection, so if the
    // baseLayer projection is not standard lat/long, it needs to know
    // maxExtent and maxResolution to calculate the zoomLevels.
    maxExtent=null;
    maxResolution=null;
    if(srs!="EPSG:4326"&&srs!="epsg:4326" ){
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
   }
    objRef.oLMap = new OpenLayers.Map(objRef.node, {controls:[]});

    // Increase hight of Control layers to allow for lots of layers.
    objRef.oLMap.Z_INDEX_BASE.Control=10000;
    
  
    objRef.oLMap.addControl(new OpenLayers.Control.MousePosition());   
    // loop through all layers and create OLLayers 
    var layers = objRef.model.getAllLayers();
    objRef.oLlayers = new Array();
      
    for (var i=layers.length-1;i>=0;i--) {
      var service=layers[i].selectSingleNode("wmc:Server/@service");service=(service)?service.nodeValue:"";
       var title=layers[i].selectSingleNode("wmc:Title");title=(title)?title.firstChild.nodeValue:"";
      var name2=layers[i].selectSingleNode("wmc:Name");name2=(name2)?name2.firstChild.nodeValue:"";
       
        if (objRef.context=="OWS"){
            var href=layers[i].selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");href=(href)?href.firstChild.nodeValue:"";	
        }
        else
        {	var href=layers[i].selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
        }
        
        
       var format=layers[i].selectSingleNode("wmc:FormatList/wmc:Format");format=(format)?format.firstChild.nodeValue:"image/gif";
       var vis=layers[i].selectSingleNode("@hidden");vis=(vis)?(vis.nodeValue!="1"):true;

      // Options to pass into the OpenLayers Layer initialization
      var options = new Array();
      options.visibility=vis;
      
      // OpenLayers expects the base layer to be non-transparent (it gets
      // projection info from the baselayer).
      // See Issue http://trac.openlayers.org/ticket/390
      options.isBaseLayer=(i==layers.length-1)?true:false;
      //options.transparent=(i==layers.length-1)?"false":"true";
      options.buffer=1;
      
      if( srs!="EPSG:4326" && srs!="epsg:4326" ){
        	options.maxExtent=maxExtent;
        	options.maxResolution=maxResolution;
        	options.projection=srs;
      }
      switch(service){

        // WMS Layer
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
            objRef.oLMap.addLayers([objRef.oLlayers[name2]]);
            break;
            
        // WFS Layer
        case "wfs":
        case "OGC:WFS":
        
        style=objRef.extractStyle(objRef,layers[i]);
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
            objRef.oLMap.addLayer(objRef.oLlayers[name2]);
             break;
        // GML Layer
        case "gml":
        case "OGC:GML":
        
            style=objRef.extractStyle(objRef,layers[i]);
            if(style){
                options.style=style;
            }else{
                options.style=new OpenLayers.Style.WebSafe(2*i+1);
            }
            objRef.oLlayers[name2] = new OpenLayers.Layer.GML(title,href,options);
            objRef.oLMap.addLayer(objRef.oLlayers[name2]);
            break;
          case "Google":
           	objRef.oLlayers[name2] = new OpenLayers.Layer.Google( "Google Satellite" , {type: G_HYBRID_MAP, 'maxZoomLevel':18},options );
            objRef.oLMap.addLayers([objRef.oLlayers[name2]]);
            
            break;
        default:
            alert(mbGetMessage("layerTypeNotSupported", service));
      }
    }
   
    bbox=objRef.model.getBoundingBox();
    objRef.oLMap.zoomToExtent(new OpenLayers.Bounds(bbox[0],bbox[1],bbox[2],bbox[3]));
  }
}

/**
 * Give to OL the bbox from context doc then update bbox value recalculated by OL in context doc. 
 * found.
 * @param objRef Pointer to widget object.
 * @param bbox  bounding box array [minx,miny,maxx,maxy] .
 * 
 */
MapPaneOL.prototype.zoomToBbox = function(objRef,bbox){

	objRef.oLMap.zoomToExtent(new OpenLayers.Bounds(bbox[0],bbox[1],bbox[2],bbox[3]));
	objRef.model.setBoundingBox(objRef.oLMap.getExtent().toBBOX().split(','));
   
}
/**
 * Zoom out . 
 * 
 * @param objRef Pointer to widget object.
 * @param center  center Lon/Lat coordinates: array [x,y] .
 * 
 */
MapPaneOL.prototype.zoomOut = function(objRef,center){
    objRef.oLMap.setCenter(new OpenLayers.LonLat(center[0],center[1]),objRef.oLMap.getZoom()-1);
	objRef.model.setBoundingBox(objRef.oLMap.getExtent().toBBOX().split(','));  
}
/**
 * Zoom in . 
 * 
 * @param objRef Pointer to widget object.
 * @param center  center Lon/Lat coordinates: array [x,y] .
 * 
 */
MapPaneOL.prototype.zoomIn = function(objRef,center){

    objRef.oLMap.setCenter(new OpenLayers.LonLat(center[0],center[1]),objRef.oLMap.getZoom()+1);
	objRef.model.setBoundingBox(bbox);
}
/**
 * Drag pan . 
 * 
 * @param objRef Pointer to widget object.
 * @param center  center Lon/Lat coordinates: array [x,y] .
 * 
 */
MapPaneOL.prototype.centerAt = function(objRef,center){

    objRef.oLMap.setCenter(new OpenLayers.LonLat(center[0],center[1]),objRef.oLMap.getZoom());
	objRef.model.setBoundingBox(bbox);
}
/**
 * pxToCoord 
 * 
 * @param objRef Pointer to widget object.
 * @param .
 * 
 */
MapPaneOL.prototype.pxToCoord  = function(objRef,pixel){

	pixel = new OpenLayers.Pixel(pixel[0],pixel[1]);
	coord = objRef.oLMap.getLonLatFromPixel(pixel);
	xy = coord.toShortString().split(',');
	return xy;
}
/**
 * coordToPx 
 * 
 * @param objRef Pointer to widget object.
 * @param .
 * 
 */
MapPaneOL.prototype.coordToPx  = function(objRef,xy){

	xy = new OpenLayers.LonLat(xy[0],xy[1]);
	coord = objRef.oLMap.getPixelFromLonLat(xy);
	pixel = coord.toString().split(',');
	return pixel;
}
/**
 * Extract a style from a Layer node. Returns null if no style parameters are
 * found.
 * @param objRef Pointer to widget object.
 * @param node Node to extract style from.
 * @return OpenLayers.Style
 */
MapPaneOL.prototype.extractStyle = function(objRef, node) {
    var style1=new OpenLayers.Style({
        map:objRef.oLMap
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
    if(!styleSet)style1=null;
    return style1;
}

/**
 * Hide/unhide a layer. Called by Context when the hidden attribute changes.
 * @param objRef Pointer to widget object.
 * @param layerName Name of the layer to hide/unhide.
 */
MapPaneOL.prototype.hidden = function(objRef, layerName) {
  vis=objRef.model.getHidden(layerName)!="1";
  if(objRef.oLlayers[layerName])objRef.oLlayers[layerName].setVisibility(vis);
}

/**
  * returns layer node from LayerMgr
  * @param layerName The layer Id.
  */
MapPaneOL.prototype.getLayer = function(layerName) {
  return this.MapLayerMgr( layerName );
}

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
MapPaneOL.prototype.getLayerDivId = function(layerName) {
  return this.model.id +"_"+ this.id +"_"+ layerName; //TBD: add in timestamps
}

/**
 * Removes a layer from the output
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPaneOL.prototype.deleteLayer = function(objRef, layerName) {
  var imgDivId = objRef.getLayerDivId(layerName); 
  if( imgDivId != null ) {
    var imgDiv = document.getElementById(imgDivId);
    if( imgDiv != null ) {
      var outputNode = document.getElementById( objRef.outputNodeId );
      outputNode.removeChild(imgDiv);
    }
  }
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPaneOL.prototype.moveLayerUp = function(objRef, layerName) {
  var outputNode = document.getElementById( objRef.outputNodeId );
  var imgDivId = objRef.getLayerDivId(layerName); 
  var movedNode = document.getElementById(imgDivId);
  var sibNode = movedNode.nextSibling;
  if (!sibNode) {
    alert(mbGetMessage("cantMoveUp", layerName));
    return;
  }
  outputNode.insertBefore(sibNode,movedNode);
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS name for the layer to be removed
 */
MapPaneOL.prototype.moveLayerDown = function(objRef, layerName) {
  var outputNode = document.getElementById( objRef.outputNodeId );
  var imgDivId = objRef.getLayerDivId(layerName); 
  var movedNode = document.getElementById(imgDivId);
  var sibNode = movedNode.previousSibling;
  if (!sibNode) {
    alert(mbGetMessage("cantMoveDown", layerName));
    return;
  }
  outputNode.insertBefore(movedNode,sibNode);
}

/**
 * This function is called when a new Context is about to be loaded
 * - it deletes all the old layers so new ones can be loaded.
 * TBD: This should be renamed to clearWidget, except inheritence
 * is not working if we do that and it doesn't get called.
 * @param objRef Pointer to this object.
 */
MapPaneOL.prototype.clearWidget2 = function(objRef) {
  objRef.MapLayerMgr.deleteAllLayers();
}



