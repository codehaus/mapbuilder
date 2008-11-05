/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: MapPaneOL.js 3870 2008-02-26 12:55:14Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
loadCss("openlayers/style.css");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/util/Util.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/tool/Extent.js");
/**
 * Widget to render a map from an OGC context document.  The layers are
 * rendered using http://openlayers.org .
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapPaneOL(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  OpenLayers.ImgPath = config.skinDir + '/images/openlayers/';
  OpenLayers.ProxyHost = config.proxyUrl+"/?url=";
  

  // replacement for deprecated MapContainerBase
  this.containerNodeId = this.htmlTagId;
  model.containerModel = this.model;

  //Make sure the Extent is attached to the context and initialized
  if(!this.model.extent){
    this.model.extent = new Extent (this.model);
    this.model.addFirstListener( "loadModel", this.model.extent.firstInit, this.model.extent );
  }

  /**
   * For tiled wms layers: Overlap of map tiles in pixels. Useful for
   * preventing rendering artefacts at tile edges. Recommended values:
   * 0-15, default is 0 (no gutter at all).
   */
  this.tileGutter = this.getProperty("mb:tileGutter", 0);
  
  /**
   * For tiled wms layers: how many rows of tiles should be preloaded
   * outside the visible map? Large values mean slow loading, small
   * ones mean longer delays when panning. Recommended values: 1-3,
   * default is 2.
   */
  this.tileBuffer = parseInt(this.getProperty("mb:tileBuffer", 2));
  
  /**
   * For tiled wms layers: how many pixels should the size of one tile
   * be? Default is 256.
   */
  this.tileSize = parseInt(this.getProperty("mb:tileSize", 256));
  
  /**
   * For WMS on top of Google Maps you need to reproject the WMS image. This will stretch
   * the WMS images to fit the odd sized google tiles. Default is false
   */
  this.imageReproject = Mapbuilder.parseBoolean(
      this.getProperty("mb:imageReproject", false));
  
  /**
   * for untiled wms layers: how many times should the map image be
   * larger than the visible map. Large values mean slow loading, small
   * ones mean many reloads when panning. Recommended values: 1-3,
   * default is 2.
   */
  this.imageBuffer = parseInt(this.getProperty("mb:imageBuffer", 2));
  
  /**
   * Should layers also be rendered outside the map extent? Default is false.
   */
  this.displayOutsideMaxExtent = Mapbuilder.parseBoolean(
      this.getProperty("mb:displayOutsideMaxExtent", false));
  
  /**
   * Number of layers that are currently being loaded
   */
  this.loadingLayers = 0;

  /**
   * Called after a feature has been added to a WFS.  This function triggers
   * the WMS basemaps to be redrawn.  A timestamp param is added to the URL
   * to ensure the basemap image is not cached.
   * This function is triggered by the refreshWmsLayers event. If this event
   * is fired with a <layerId> as param, only that layer will be refreshed.
   * @param objRef reference to this widget
   */
  this.refreshWmsLayers = function(objRef) {
    var layerId = objRef.model.getParam("refreshWmsLayers");
    var uniqueId = (new Date()).getTime();
    var layers = layerId ?
        [objRef.getLayer(objRef, layerId)] :
        objRef.model.map.layers;
    for (var i in layers) {
      if (layers[i].CLASS_NAME.indexOf('OpenLayers.Layer.WMS') == 0) {
        layers[i].mergeNewParams({uniqueId: uniqueId});
      }
    }
  }
  this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);

  this.model.addListener("refresh",this.paint, this);
  this.model.addFirstListener("newModel", this.clear, this);
  this.model.addListener("hidden",this.hidden, this);
  this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("moveLayerUp",this.moveLayerUp, this);
  this.model.addListener("moveLayerDown",this.moveLayerDown, this);
  this.model.addListener("opacity",this.setOpacity,this);
  this.model.addListener("bbox", this.zoomToBbox, this);
  //this.model.addListener( "zoomOut", this.zoomOut, this );
  //this.model.addListener( "zoomIn", this.zoomIn, this );
  // this.model.addListener( "zoomToMaxExtent", this.zoomToMaxExtent, this );
 //this.model.addFirstListener("loadModel",this.paint,this);

}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapPaneOL.prototype.paint = function(objRef, refresh) {
  
  // Create an OpenLayers map

  //Test if context exist
  if(objRef.model.doc.selectSingleNode("//wmc:OWSContext"))
    objRef.context="OWS";
  else if(objRef.model.doc.selectSingleNode("//wmc:ViewContext"))
    objRef.context="View";
  else
    alert(mbGetMessage("noContextDefined"));

  var proj=objRef.model.proj;

  //maxExtent
  var maxExtent=null;
  maxExtent=objRef.widgetNode.selectSingleNode("mb:maxExtent");
  maxExtent=(maxExtent)?maxExtent.firstChild.nodeValue.split(" "):null;
  // If the maxExtentis not specified in the config
  // calculate it from the BBox  in the Context.
  if(!maxExtent){
    maxExtent=objRef.model.getBoundingBox();
  }
  maxExtent=(maxExtent)?new OpenLayers.Bounds(maxExtent[0],maxExtent[1],maxExtent[2],maxExtent[3]):null;
  if(maxExtent==null)alert(mbGetMessage("noBboxInContext"));

  //maxResolution
  var maxResolution=null;
  maxResolution=objRef.widgetNode.selectSingleNode("mb:maxResolution");
  maxResolution=(maxResolution) ? parseFloat(maxResolution.firstChild.nodeValue) : "auto";

  //minResolution
  var minResolution=null;
  minResolution=objRef.widgetNode.selectSingleNode("mb:minResolution");
  minResolution=(minResolution) ? parseFloat(minResolution.firstChild.nodeValue) : undefined;
  
  //units
  var units = proj.getUnits() == 'meters' ? 'm' : proj.getUnits();
  
  //resolutions
  //TBD: if resolutions is both set here and for the baselayer and they are different weird things may happen
  //     this needs to be solved
  var resolutions=objRef.widgetNode.selectSingleNode("mb:resolutions");
  resolutions = resolutions ? resolutions.firstChild.nodeValue.split(",") : null;
  if (resolutions) {
    for (var r=0; r<resolutions.length; r++) {
      resolutions[r] = parseFloat(resolutions[r]);
    }
  }

  //fixed scales - overrides resolutions
  var scales = objRef.widgetNode.selectSingleNode("mb:scales");
  if(scales){
    scales = scales.firstChild.nodeValue.split(",");
    resolutions = new Array();
    for (var s=0; s<scales.length; s++) {
      resolutions.push(OpenLayers.Util.getResolutionFromScale(scales[s], units));
    }
  }
  if(resolutions){
    objRef.model.extent.setZoomLevels(true,resolutions);
  }
  else objRef.model.extent.setZoomLevels(false);

  //get the output DIV and set it to context-size
  var node = document.getElementById(objRef.containerNodeId);
  var fixedSize=null;
  fixedSize=objRef.widgetNode.selectSingleNode("mb:fixedSize");
  fixedSize=(fixedSize)?fixedSize.firstChild.nodeValue:null;
  if(fixedSize=="true"){
    node.style.width = objRef.model.getWindowWidth()+"px";
    node.style.height = objRef.model.getWindowHeight()+"px";
  }
  
  //default map options
  var mapOptions = {
        controls:[],
        projection: proj,
        units: units,
        fractionalZoom: true,
        maxExtent: maxExtent,
        maxResolution: maxResolution,
        minResolution: minResolution,
        resolutions: resolutions,
        theme: null, // we have the theme loaded by Mapbuilder
        destroy: function(destroy){
                   if (destroy != true) {
                     this.mbMapPane.model.setParam("newModel", true);
                   } else {
                     this.mbMapPane = null;
                     this.mbCursor = null;
                     OpenLayers.Map.prototype.destroy.apply(this, arguments);
                     this.layerContainerDiv = null;
                     this.baseLayer = null;
                   }}
      };

  if (!objRef.model.map) {
    objRef.model.map = new OpenLayers.Map(node, mapOptions);

    // Increase hight of Control layers to allow for lots of layers.
    objRef.model.map.Z_INDEX_BASE.Control=10000;
    var baseLayer = null;
    
    //If we have an OWSContext and we have a BaseLayer we need to use this layer
    //for more information have a look at http://docs.codehaus.org/display/MAP/Using+Google-layers
    if(objRef.context=="OWS"&&objRef.model.getBaseLayer()){
      var baseLayerNode = objRef.model.getBaseLayer();
     
      //overrule the SRS in the Context with the one from the BaseLayer
      var baseSrs = baseLayerNode.selectSingleNode("ows:TileSet/ows:SRS");
      if(baseSrs) objRef.model.setSRS(baseSrs.firstChild.nodeValue);
      //overrule the units in the Context with the updated SRS units
      units = proj.getUnits() == 'meters' ? 'm' : proj.getUnits();
      //overrule the boundingbox in the Context with the maxExtent from the BaseLayer
      var maxExtentNode = baseLayerNode.selectSingleNode("ows:TileSet/ows:BoundingBox");
      if(maxExtentNode) maxExtent = new OpenLayers.Bounds(maxExtentNode.selectSingleNode('@minx').nodeValue,maxExtentNode.selectSingleNode('@miny').nodeValue,maxExtentNode.selectSingleNode('@maxx').nodeValue,maxExtentNode.selectSingleNode('@maxy').nodeValue);
      //overrule resolutions in the Context with the one from BaseLayer
      //@TODO: check if the firstChild is really needed
      var resolutions =baseLayerNode.selectSingleNode("ows:TileSet/ows:Resolutions");
      resolutions = resolutions ? resolutions.firstChild.nodeValue.split(",") : null;
      if (resolutions) {
        for (var r=0; r<resolutions.length; r++) {
           resolutions[r] = parseFloat(resolutions[r]);
        }
      }
      //overrule tileSize in the Context with the one from the BaseLayer
      //right now we only support square tiles which are defined by their width:		  
      var tileSize =baseLayerNode.selectSingleNode("ows:TileSet/ows:Width");
      if(tileSize) objRef.tileSize = parseInt(tileSize.nodeValue);
      //check if there's a format defined for the BaseLayer
      var format = baseLayerNode.selectSingleNode("ows:TileSet/ows:Format");
      if(format) format = format.nodeValue;
      
      //Initialising the baseLayer
      // Test service of the baseLayer
      var service=baseLayerNode.selectSingleNode("wmc:Server/@service");
      service=(service)?service.nodeValue:"";
      // Test title of the baseLayer
      var title=baseLayerNode.selectSingleNode("wmc:Title");
      title=(title)?title.firstChild.nodeValue:"";
      // Get the name of the baseLayer
      var baseLayerName = baseLayerNode.selectSingleNode("wmc:Name");
      baseLayerName=(baseLayerName)?baseLayerName.firstChild.nodeValue:"";
      // get the layer-type of the BaseLayer (this allows specifying if is is a arial,road or hybrid map)
      var baseLayerType = baseLayerNode.selectSingleNode("ows:TileSet/ows:Layers");
      baseLayerType=(baseLayerType)?baseLayerType.firstChild.nodeValue:"hybrid";
      // it might be that the baseLayer is a WMS so we need to fetch the url
      var href=baseLayerNode.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");href=(href)?getNodeValue(href):"";
      
      var baseLayerOptions = {
              units: units,
              projection: proj,
              maxExtent: maxExtent,
             
              alpha: false,            //option for png transparency with ie6
              isBaseLayer: true,
              displayOutsideMaxExtent: objRef.displayOutsideMaxExtent,
              ratio: 1
              
         };
         
      switch(service){
        // WMS Layer (Untiled)
        case "OGC":
        case "WMS":
        case "wms":
        case "OGC:WMS":
          
          baseLayerOptions.ratio = objRef.imageBuffer;
    
          var params = new Array();

         
         baseLayer= new OpenLayers.Layer.WMS(title,href,{
              layers: baseLayerName,
              format: format
              },
            baseLayerOptions
          );
        break;
    
        // WMS-C Layer (Tiled)
        case "WMS-C":
        case "OGC:WMS-C":
          baseLayerOptions.gutter = objRef.tileGutter;
          baseLayerOptions.buffer = objRef.tileBuffer;
          baseLayerOptions.tileSize = new OpenLayers.Size(objRef.tileSize, objRef.tileSize);
          
          baseLayer= new OpenLayers.Layer.WMS(title,href,{
              layers: baseLayerName,
              format: format
            },
            baseLayerOptions
          );
          objRef.model.map.fractionalZoom = false;
        break;
    
        case "GMAP":
        case "Google":       
          if(maxExtent) baseLayerOptions.maxExtent=maxExtent;
          //check if we have spherical projection
          var sphericalMercator = (objRef.model.getSRS()=='EPSG:900913')?true:false;
          //check if we have a layertype
          switch(baseLayerType){
            case "aerial":
            case "satellite":            
              baseLayerType=G_SATELLITE_MAP;
            break;
            case "road":
            case "normal":            
              baseLayerType=G_NORMAL_MAP;
            break;
            default:
              baseLayerType=G_HYBRID_MAP;
          }
          baseLayer = new OpenLayers.Layer.Google( baseLayerName , {type: baseLayerType, minZoomLevel: 0, maxZoomLevel:19, sphericalMercator: sphericalMercator, maxResolution: 156543.0339 }, baseLayerOptions );
          objRef.model.map.numZoomLevels = 20;
          objRef.model.map.fractionalZoom = false;
        break;
    
        case "YMAP":
        case "Yahoo":
          //Yahoo-layer doesn't support layerTypes
          if(maxExtent) baseLayerOptions.maxExtent=maxExtent;
          //check if we have spherical projection
          var sphericalMercator = (objRef.model.getSRS()=='EPSG:900913')?true:false;          
          baseLayer = new OpenLayers.Layer.Yahoo(  baseLayerName , { maxZoomLevel:21, sphericalMercator: sphericalMercator }, baseLayerOptions );
          objRef.model.map.fractionalZoom = false;
        break;
    
        case "VE":
        case "Microsoft":
          if(maxExtent) baseLayerOptions.maxExtent=maxExtent;
          //check if we have spherical projection
          var sphericalMercator = (objRef.model.getSRS()=='EPSG:900913')?true:false;
          //check if we have a layertype
          switch(baseLayerType){
            case "aerial":
            case "satellite":
              baseLayerType=VEMapStyle.Aerial;
            break;
            case "road":
            case "normal":
              baseLayerType=VEMapStyle.Road;
            break;
            default:
              baseLayerType=VEMapStyle.Hybrid;
          }
          baseLayer = new OpenLayers.Layer.VirtualEarth( baseLayerName,{minZoomLevel: 0, maxZoomLevel: 21,type: baseLayerType});
          objRef.model.map.fractionalZoom = false;
        break;
    
        case "MultiMap":
           if(maxExtent) baseLayerOptions.maxExtent=maxExtent;
           //check if we have spherical projection
          var sphericalMercator = (objRef.model.getSRS()=='EPSG:900913')?true:false;          
          baseLayer = new OpenLayers.Layer.MultiMap( baseLayerName , { maxZoomLevel:21, sphericalMercator: sphericalMercator }, baseLayerOptions );
          objRef.model.map.fractionalZoom = false;
        break;
        default:
          alert(mbGetMessage("layerTypeNotSupported", service));
        }
    }
    //Otherwise we will just use an empty WMS layer as BaseLayer
    else {
      var baseLayerOptions = {
              units: units,
              projection: proj.srsCode,
              maxExtent: maxExtent,
              maxResolution: maxResolution,  //"auto" if not defined in the context
              minResolution: minResolution,
              resolutions: resolutions,
              alpha: false,            //option for png transparency with ie6
              isBaseLayer: true,
              displayOutsideMaxExtent: objRef.displayOutsideMaxExtent,
              ratio: 1,
              singleTile: true,
              visibility: false
         };
      baseLayer = new OpenLayers.Layer.WMS("baselayer",
              config.skinDir+"/images/openlayers/blank.gif", null, baseLayerOptions);
      
    }
    objRef.model.map.addLayer(baseLayer); 
  }
  else {
    objRef.deleteAllLayers(objRef);
  }
    
  var layers = objRef.model.getAllLayers();
  if (!objRef.oLlayers){
    objRef.oLlayers = {};
  }

  for (var i=0;i<=layers.length-1;i++){
    objRef.addLayer(objRef,layers[i]);
  }
  var bbox=objRef.model.getBoundingBox();

  // set objRef as attribute of the OL map, so we have a reference
  // to MapPaneOL available when handling OpenLayers events.
  objRef.model.map.mbMapPane = objRef;

  // register OpenLayers event to keep the context updated
  objRef.model.map.events.register('moveend', objRef.model.map, objRef.updateContext);
  // register OpenLayers event to do updates onmouseup
  objRef.model.map.events.register('mouseup', objRef.model.map, objRef.updateMouse);
  
  objRef.model.callListeners("bbox");
  
}

/**
 * remove OpenLayers events and layers
 * @param objRef reference to this widget
 */
MapPaneOL.prototype.clear = function(objRef) {
  if (objRef.model.map) {
    OpenLayers.Event.stopObservingElement(window);
    objRef.model.map.destroy(true);
    objRef.model.map = null;
    objRef.oLlayers = {};
  }
}

/**
 * Receives a 'loadstart' event from OL layer and notifies the listeners
 * @param e OpenLayers event
 * @return none
 */
MapPaneOL.prototype.loadLayerStart = function(e) {
  // Fetch layerId from model using the ID of the OL Layer
  // Necessary to provide a connection between the OL Layer
  var layerId = this.getLayerIdByOlLayer(this, e.object);
  //layerId = this.model.getParam(event.object.id);

  this.model.setParam("loadLayerStart", layerId);
  //this.model.callListeners("loadLayerStart", layerId);

  // keep the modelStatus updated when an OpenLayers layer starts loading.
  ++this.loadingLayers;
  var message = mbGetMessage((this.loadingLayers>1) ? "loadingLayers" : "loadingLayer",
    this.loadingLayers);
  this.model.setParam("modelStatus", message);
}

/**
 * Receives a 'loadend' event from OL layer and notifies the listeners
 * @param e OpenLayers event
 * @return none
 */
MapPaneOL.prototype.loadLayerEnd = function(e) {
  // Fetch layerId from model using the ID of the OL Layer
  var layerId = this.getLayerIdByOlLayer(this, e.object);

  // Tell the listeners that the layer has finished loading
  this.model.setParam("loadLayerEnd", layerId);
  //this.model.callListeners("loadLayerEnd", layerId);

  // keep the modelStatus updated when an OpenLayers layer starts loading.
   --this.loadingLayers;
  var message = this.loadingLayers > 0 ?
          mbGetMessage((this.loadingLayers>1) ? "loadingLayers" : "loadingLayer",
                  this.loadingLayers) :
          null;
  this.model.setParam("modelStatus", message);
}

/**
 * Finds MapBuilder layerId based on OL layer
 * @param {object} OL layer
 * @return {string} layerId
 */
MapPaneOL.prototype.getLayerIdByOlLayer = function(objRef, olLayer) {
  for (var i in objRef.oLlayers) {
    if (objRef.oLlayers[i] == olLayer) {
      return i;
    }
  }
  return null;
}

/**
 * Event handler to keep the Mapbuilder context updated. It also
 * sets the map cursor to the previously stored value.
 * This is called by OpenLayers.
 * @param e OpenLayers event
 */
MapPaneOL.prototype.updateContext = function(e) {
  // get objRef from the event originator object (e.object),
  // where it was stored as mbPane property by paint().
  var objRef = e.object.mbMapPane;

  var bboxOL = objRef.model.map.getExtent().toBBOX().split(',');
  var ul = new Array(bboxOL[0],bboxOL[3]);
  var lr = new Array(bboxOL[2],bboxOL[1]);

  if(objRef.model.getWindowWidth()!=e.element.offsetWidth)
    objRef.model.setWindowWidth(e.element.offsetWidth);
  if(objRef.model.getWindowHeight()!=e.element.offsetHeight)
    objRef.model.setWindowHeight(e.element.offsetHeight);	

  var currentAoi = objRef.model.getParam('aoi');
  var newAoi = new Array(ul, lr);
  if (!currentAoi || currentAoi.toString() != newAoi.toString()) {
    objRef.model.setBoundingBox( new Array(ul[0], lr[1], lr[0], ul[1]) );
    objRef.model.extent.setSize(objRef.model.map.getResolution());
    objRef.model.setParam("aoi", newAoi);
  }
}

/**
 * Restore the map cursor stored by buttons. This has to be done
 * in an OpenLayers mouseup event, because the mouseup event
 * in OpenLayers resets the cursor to default.
 * @param e OpenLayers event
 */
MapPaneOL.prototype.updateMouse = function(e) {
  // get objRef from the event originator object (e.object),
  // where it was stored as mbPane property by paint().
  var objRef = e.object.mbMapPane;

  // update map pane cursor
  if (objRef.model.map.mbCursor) {
    objRef.model.map.div.style.cursor = objRef.model.map.mbCursor;
  }
}

/**
 * Zoom to the current Bounding Box.
 * @param objRef reference to this widget
 */
MapPaneOL.prototype.zoomToBbox = function(objRef) {
  if (objRef.model.map) {
    var bbox = objRef.model.getBoundingBox();
    var displayBbox = [];
    var extent = objRef.model.map.getExtent();
    if (extent) {
      displayBbox = extent.toBBOX();
    }
    // only perform zoom operation if not already at bbox
    if (bbox.toString() != displayBbox.toString()) {
      objRef.model.map.zoomToExtent(new OpenLayers.Bounds(bbox[0],bbox[1],bbox[2],bbox[3]));
    }
  }
}

/**
 * Hide/unhide a layer. Called by Context when the hidden attribute changes.
 * @param objRef Pointer to widget object.
 * @param layerId Id of the layer to hide/unhide.
 */
MapPaneOL.prototype.hidden = function(objRef, layerId) {
  var vis=objRef.model.getHidden(layerId);
  if(vis=="1"){ var hidden=false; }
  else {var hidden=true; }
  var  tmpLayer=objRef.getLayer(objRef,layerId)
  if(tmpLayer)tmpLayer.setVisibility(hidden);
}

/**
  * Returns OL layer node from LayerMgr
  * @param layerId The layer Id (or layerName)
  */
MapPaneOL.prototype.getLayer = function(objRef,layerId) {

  // If layer cannot be found then layerId might actually be layerName
  // We then try to fetch the @id of the layer from the model
  if (!objRef.oLlayers[layerId]) {
    layerId = objRef.model.getLayerIdByName(layerId) || layerId;
  }

  if(objRef.oLlayers[layerId] && objRef.oLlayers[layerId].id) {
    return objRef.model.map.getLayer(objRef.oLlayers[layerId].id);
  } else {
    return false;
  }
}


//####################################################
/**
 * Removes a layer from the output
/**
 * Removes a layer from the output
 * @param objRef Pointer to this object.
 * @param layerId the WMS name for the layer to be removed
 */
MapPaneOL.prototype.deleteLayer = function(objRef, layerId) {
  if(objRef.oLlayers[layerId])objRef.model.map.removeLayer(objRef.oLlayers[layerId]);
}
/**
 * Removes all layers from the output
 * @param objRef Pointer to this object.
 * @param objRef Pointer to this object.
 */
MapPaneOL.prototype.deleteAllLayers = function(objRef) {
  for (var i in objRef.oLlayers) {
    var layer = objRef.oLlayers[i];
    layer.destroy();
  }
  objRef.oLlayers = {};
}

//#############################################TDO
/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerId the WMS name for the layer to be removed
 */
MapPaneOL.prototype.moveLayerUp = function(objRef, layerId) {
  var map=objRef.model.map;
  map.raiseLayer(map.getLayer(objRef.oLlayers[layerId].id), 1);
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerId the WMS name for the layer to be removed
 */
MapPaneOL.prototype.moveLayerDown = function(objRef, layerId) {
  objRef.model.map.raiseLayer(objRef.getLayer(objRef,layerId), -1);
}
//###############################################
/**
   * Called when the context's opacity attribute changes.
/**
   * Called when the context's opacity attribute changes.
   * @param objRef This object.
   * @param layerId  The id of the layer that was toggled.
   */
MapPaneOL.prototype.setOpacity=function(objRef, layerId){
  var _opacity="1";
  _opacity=objRef.model.getOpacity(layerId);
  objRef.getLayer(objRef,layerId).setOpacity(_opacity);
}
/**
 * Adds a layer into the output
   * @param objRef This object.
   * @param layerNode  The node of the layer
 */
MapPaneOL.prototype.addLayer = function(objRef, layerNode) {
  // OpenLayers doesn't contain information about projection, so if the
  // baseLayer projection is not standard lat/long, it needs to know
  // maxExtent and maxResolution to calculate the zoomLevels.
  var layer = layerNode;

  // Test service of the layer
  var service=layer.selectSingleNode("wmc:Server/@service");service=(service)?service.nodeValue:"";

  // Test title of the layer
  var title=layer.selectSingleNode("wmc:Title");title=(title)?title.firstChild.nodeValue:"";

  // Get the name of the layer
  layerName = layer.selectSingleNode("wmc:Name");layerName=(layerName)?layerName.firstChild.nodeValue:"";

  // Get the layerId. Fallback to layerName if non-existent
  var layerId;
  if (layer.selectSingleNode("@id") && layer.selectSingleNode("@id").nodeValue) {
    layerId = layer.selectSingleNode("@id").nodeValue;
  } else {
    layerId = layerName;
  }

  if (objRef.context=="OWS"){
    var href=layer.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");href=(href)?getNodeValue(href):"";
  }
  else {
     if(_SARISSA_IS_SAFARI){
     var nodehref=layer.selectSingleNode("wmc:Server/wmc:OnlineResource");
     var href=nodehref.attributes[1].nodeValue;
     }
   else{
     if(_SARISSA_IS_OPERA){
       var href=layer.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttributeNS ("http://www.w3.org/1999/xlink","href");// for opera
     }else{
       var href=layer.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
     }
    }
  }

  // Test format of the layer
  var format=layer.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");
  if (!format) {
    format = layer.selectSingleNode("wmc:FormatList/wmc:Format");
  }
  format = format ? getNodeValue(format) : "image/gif";

  // Test visibility of the layer
  var vis=layer.selectSingleNode("@hidden");
  if (vis) {
    if(vis.nodeValue=="1")
      vis=false;
    else
      vis=true;
  }
  // Test if layer is queryable
  var query=layer.selectSingleNode("@queryable");
  if (query){
    if(query.nodeValue=="1")
      query=true;
    else
      query=false;
  }

  // Test if opacity is specified
  var opacity=layer.selectSingleNode("@opacity");
  if (opacity)
    opacity=opacity.nodeValue;
  else
    opacity=false;
  
  // Get current style node of the layer
  var currentStyle = layer.selectSingleNode('wmc:StyleList/wmc:Style[@current=1]');

  // will be true for IE6, false for later versions of IE
  objRef.IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
  
  //default option value for a layer
  var layerOptions = {
          visibility: vis,
          projection: objRef.model.map.baseLayer.projection,
          queryable: query,
          maxExtent: objRef.model.map.baseLayer.maxExtent,
          maxResolution: objRef.model.map.baseLayer.maxResolution,  //"auto" if not defined in the context
          minResolution: objRef.model.map.baseLayer.minResolution,  //"auto" if not defined in the context
          alpha: format.indexOf("png") != -1 ? objRef.IE6 : false,         //option for png transparency with ie6
          isBaseLayer: false,
          displayOutsideMaxExtent: objRef.displayOutsideMaxExtent
     };
     
  switch(service){
    // WMS Layer (Untiled)
    case "OGC":
    case "WMS":
    case "wms":
    case "OGC:WMS":
      if(!objRef.model.map.baseLayer){
        layerOptions.isBaseLayer=true;
      }
      else {
        //TBD what if we have layers with different projections in the context?
        layerOptions.reproject=objRef.imageReproject;
        layerOptions.isBaseLayer=false;
      }

      layerOptions.ratio = objRef.imageBuffer;
      layerOptions.singleTile = true;

      var params = new Array();
      params = sld2UrlParam(currentStyle);
      if (objRef.model.timestampList && objRef.model.timestampList.getAttribute("layerId") == layerId) { 
        var ts = objRef.model.timestampList.childNodes[0];

        objRef.oLlayers[layerId]= new OpenLayers.Layer.WMS(title,href,{
            layers: layerName,
            // "TRUE" in upper case else the context doc boston.xml
            // (i.c. the IONIC WMS/WFS) doesn't work.
            // Note that this is in line with the WMS standard (OGC 01-068r2),
            // section 6.4.1 Parameter Ordering and Case:
            // "Parameter names shall not be case sensitive,
            //  but parameter values shall be case sensitive."
            transparent: layerOptions.isBaseLayer ? "FALSE" : "TRUE",
              "TIME":ts.firstChild.nodeValue,	          
            format: format,
            sld:params.sld,
            sld_body:params.sld_body,
            styles:params.styles
          },
          layerOptions
        );      
        // Turn on timestamp listenet
          this.model.addListener("timestamp",this.timestampListener,this);	      
      }
      else {
        objRef.oLlayers[layerId]= new OpenLayers.Layer.WMS(title,href,{
            layers: layerName,
            // "TRUE" in upper case else the context doc boston.xml
            // (i.c. the IONIC WMS/WFS) doesn't work.
            // Note that this is in line with the WMS standard (OGC 01-068r2),
            // section 6.4.1 Parameter Ordering and Case:
            // "Parameter names shall not be case sensitive,
            //  but parameter values shall be case sensitive."
            transparent: layerOptions.isBaseLayer ? "FALSE" : "TRUE",
            format: format,
            sld:params.sld,
            sld_body:params.sld_body,
            styles:params.styles
          },
          layerOptions
        );
      }
    break;

    // WMS-C Layer (Tiled)
    case "WMS-C":
    case "OGC:WMS-C":
      if(!objRef.model.map.baseLayer){
        layerOptions.isBaseLayer=true;
      }
      else {
        //TBD what if we have layers with different projections in the context?
        layerOptions.reproject=objRef.imageReproject;
        layerOptions.isBaseLayer=false;
      }

      layerOptions.gutter = objRef.tileGutter;
      layerOptions.buffer = objRef.tileBuffer;
      layerOptions.tileSize = new OpenLayers.Size(objRef.tileSize, objRef.tileSize);
      
      var params = new Array();
      params = sld2UrlParam(currentStyle);
      objRef.oLlayers[layerId]= new OpenLayers.Layer.WMS(title,href,{
          layers: layerName,
          transparent: layerOptions.isBaseLayer ? "FALSE" : "TRUE",
          format: format,
          sld:params.sld,
          sld_body:params.sld_body,
          styles:params.styles
        },
        layerOptions
      );
      objRef.model.map.fractionalZoom = false;
    break;

    // WFS Layer
    case "WFS":
    case "wfs":
    case "OGC:WFS":
      style = sld2OlStyle(currentStyle);
      if(style){
        layerOptions.styleMap=new OpenLayers.StyleMap(style);
      }
      else{
        layerOptions.style=objRef.getWebSafeStyle(objRef, 2*i+1);
      }
      layerOptions.featureClass=OpenLayers.Feature.WFS;

      objRef.oLlayers[layerId]= new OpenLayers.Layer.WFS(
        title,
        href,{
          typename: layerId,
          maxfeatures: 1000},
          layerOptions
        );
    break;

    // GML Layer
    case "gml":
    case "OGC:GML":
      style = sld2OlStyle(currentStyle);
      if(style){
        layerOptions.styleMap=new OpenLayers.StyleMap(style);
      }
      else{
        layerOptions.style=objRef.getWebSafeStyle(objRef, 2*i+1);
      }
      objRef.oLlayers[layerId] = new OpenLayers.Layer.GML(title,href,layerOptions);

    break;

     // KML Layer
    case "KML":
    case "kml":
      objRef.oLlayers[layerId]= new OpenLayers.Layer.GML(
        title,
        href,{
          format: OpenLayers.Format.KML
          }
        );
    break;
    
  // Currently the following layertypes are only supported in a OwsContext doc as a BaseLayer
  // for more information see http://docs.codehaus.org/display/MAP/Using+Google-layers
   /* case "GMAP":
    case "Google":
      //the empty baseLayer has to be destroyed when you want to use google
      objRef.model.map.baseLayer.destroy();
      layerOptions.maxExtent=new OpenLayers.Bounds("-20037508", "-20037508", "20037508", "20037508.34");
       objRef.oLlayers[layerId] = new OpenLayers.Layer.Google( "Google Satellite" , {type: G_HYBRID_MAP, maxZoomLevel:18, sphericalMercator: true }, layerOptions );
    break;

    case "YMAP":
    case "Yahoo":
      // <script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script>
      layerOptions.isBaseLayer=true;
      objRef.oLlayers[layerId] = new OpenLayers.Layer.Yahoo( "Yahoo");
    break;

    case "VE":
    case "Microsoft":
      //<script src='http://dev.virtualearth.net/mapcontrol/v3/mapcontrol.js'></script>
      layerOptions.isBaseLayer=true;
      objRef.oLlayers[layerId] = new OpenLayers.Layer.VirtualEarth( "VE",{minZoomLevel: 0, maxZoomLevel: 18,type: VEMapStyle.Hybrid});
    break;

    case "MultiMap":
      //<script type="text/javascript" src="http://clients.multimap.com/API/maps/1.1/metacarta_04"></script>
      layerOptions.isBaseLayer=true;
      objRef.oLlayers[layerId] = new OpenLayers.Layer.MultiMap( "MultiMap");
    break;*/
    default:
      alert(mbGetMessage("layerTypeNotSupported", service));
  }
  if(opacity && objRef.oLlayers[layerId]){
    objRef.oLlayers[layerId].setOpacity(opacity);
  }
  
  //objRef.oLlayers[layerId].events.register('loadstart', objRef, objRef.increaseLoadingLayers);
  //objRef.oLlayers[layerId].events.register('loadend', objRef, objRef.decreaseLoadingLayers);

  objRef.oLlayers[layerId].events.register('loadstart', objRef, objRef.loadLayerStart);
  objRef.oLlayers[layerId].events.register('loadend', objRef, objRef.loadLayerEnd);
  
  // Here the OL layer gets added to the OL map
  objRef.model.map.addLayer(objRef.oLlayers[layerId]);
}

/**
 * gets an OpenLayers vector style with web safe colors.
 * @param objRef reference to this object
 * @param colorNumber number of a color from which to generate websafe color
 * @return {OpenLayers.Style} style for OpenLayers vector rendering
 */
MapPaneOL.prototype.getWebSafeStyle = function(objRef, colorNumber) {
  colors=new Array("00","33","66","99","CC","FF");
  colorNumber=(colorNumber)?colorNumber:0;
  colorNumber=(colorNumber<0)?0:colorNumber;
  colorNumber=(colorNumber>215)?215:colorNumber;
  i=parseInt(colorNumber/36);
  j=parseInt((colorNumber-i*36)/6);
  k=parseInt((colorNumber-i*36-j*6));
  var color="#"+colors[i]+colors[j]+colors[k];
  var defaultStyle = {
            fillColor: "#808080",
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeOpacity: 1,
            strokeWidth: 1,
            pointRadius: 6};
  var style=OpenLayers.Util.extend(defaultStyle,OpenLayers.Feature.Vector.style["default"]);
  style.fillColor = color;
  style.strokeColor = color;
  style.map = objRef.model.map;
  return style;
}

/**
   * Called for refreshing one layer.
   * @param objRef This object.
   * @param layerId  The id of the layer that was toggled.
   */
MapPaneOL.prototype.refreshLayer = function(objRef, layerId , newParams){
  newParams['version'] = Math.random(); //necessary for see change in certain case
  objRef.getLayer(objRef,layerId).mergeNewParams(newParams);
}
  
  /**
   * Called when the map timestamp is changed so set the layer visiblity.
   * @param objRef This object.
   * @param timestampIndex  The array index for the layer to be displayed. 
   */
MapPaneOL.prototype.timestampListener=function(objRef, timestampIndex){
  if (window.movieLoop.frameIsLoading == true) {
    return;
  }
  var layerId = objRef.model.timestampList.getAttribute("layerId");
  var ts = objRef.model.timestampList.childNodes[timestampIndex];

  if (layerId && ts) {				
    var curLayer = objRef.oLlayers[layerId]; //TBD: please check if this still works now we've moved to layerId
    if (!curLayer.grid) {
      return;
    }
    div = curLayer.grid[0][0].imgDiv;
    // Perform URL substitution via regexps
    var oldImageUrl = div.src || div.firstChild.src;
    var newImageUrl = oldImageUrl.replace(/TIME\=.*?\&/,'TIME=' + ts.firstChild.nodeValue + '&');
    if (oldImageUrl == newImageUrl) {
      return;
    }

    function imageLoaded() {
      window.movieLoop.frameIsLoading = false;
      if(element.removeEventListener) { // Standard
        element.removeEventListener("load", imageLoaded, false);
      } else if(element.detachEvent) { // IE
        element.detachEvent('onload', imageLoaded);
      }
    }

    window.movieLoop.frameIsLoading = true;
    var element = div.nodeName.toUpperCase() == "IMG" ? div : div.firstChild;
    if(element.addEventListener) { // Standard
      element.addEventListener("load", imageLoaded, false);
    } else if(element.attachEvent) { // IE
      element.attachEvent('onload', imageLoaded);
    }
    if (objRef.IE6) {
      OpenLayers.Util.modifyAlphaImageDiv(div,
            null, null, null, newImageUrl);
    } else {
      element.src = newImageUrl;
    }
  }
      
}
