/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: TimeSeriesOL.js 2971 2007-07-12 09:19:39Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/tool/Extent.js");
/**
 * Widget to render a map from an OGC context document.  The layers are
 * rendered using http://openlayers.org .
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function TimeSeriesOL(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  OpenLayers.ImgPath = config.skinDir + '/images/openlayers/';

  // replacement for deprecated MapContainerBase
  this.containerNodeId = this.htmlTagId;
  model.containerModel = this.model;

  //set the output DIV
  this.node = document.getElementById(this.containerNodeId);

  //Make sure the Extent is attached to the context and initialized
  if(!this.model.extent){
    this.model.extent = new Extent (this.model);
    this.model.addFirstListener( "loadModel", this.model.extent.firstInit, this.model.extent );
  }

  var tileGutter = widgetNode.selectSingleNode("mb:tileGutter");
  /**
   * For tiled wms layers: Overlap of map tiles in pixels. Useful for
   * preventing rendering artefacts at tile edges. Recommended values:
   * 0-15, default is 0 (no gutter at all).
   */
  this.tileGutter = tileGutter ? tileGutter.firstChild.nodeValue : 0;
  
  var tileBuffer = widgetNode.selectSingleNode("mb:tileBuffer");
  /**
   * For tiled wms layers: how many rows of tiles should be preloaded
   * outside the visible map? Large values mean slow loading, small
   * ones mean longer delays when panning. Recommended values: 1-3,
   * default is 2.
   */
  this.tileBuffer = tileBuffer ? tileBuffer.firstChild.nodeValue : 2;
  
  var tileSize = widgetNode.selectSingleNode("mb:tileSize");
  /**
   * For tiled wms layers: how many pixels should the size of one tile
   * be? Default is 256.
   */
  this.tileSize = tileSize ? tileSize.firstChild.nodeValue : 256;

  var imageReproject = widgetNode.selectSingleNode("mb:imageReproject");
  /**
   * For WMS on top of Google Maps you need to reproject the WMS image. This will stretch
   * the WMS images to fit the odd sized google tiles. Default is false
   */
  this.imageReproject = imageReproject ? imageReproject.firstChild.nodeValue : false;
  
  var imageBuffer = widgetNode.selectSingleNode("mb:imageBuffer");
  /**
   * for untiled wms layers: how many times should the map image be
   * larger than the visible map. Large values mean slow loading, small
   * ones mean many reloads when panning. Recommended values: 1-3,
   * default is 2.
   */
  this.imageBuffer = imageBuffer ? imageBuffer.firstChild.nodeValue : 2;
  
  var displayOutsideMaxExtent = widgetNode.selectSingleNode("mb:displayOutsideMaxExtent");
  /**
   * Should layers also be rendered outside the map extent? Default is false.
   */
  this.displayOutsideMaxExtent = displayOutsideMaxExtent ? displayOutsideMaxExtent.firstChild.nodeValue : 'false';
  if (this.displayOutsideMaxExtent.toUpperCase == 'FALSE') {
    this.displayOutsideMaxExtent = false;
  }

  /**
   * Called after a feature has been added to a WFS.  This function triggers
   * the WMS basemaps to be redrawn.  A timestamp param is added to the URL
   * to ensure the basemap image is not cached.
   */
  this.refreshWmsLayers = function(objRef) {
    // TBD IMO it is crazy to reload all layers, just because
    // one layer that holds WFS data changed. We should switch
    // all of feature editing to OL WFS layers ASAP, then we
    // can compare with typeName and only reload the correct
    // layer
    var uniqueId = (new Date()).getTime();
    var layers = objRef.model.map.layers;
    for (var i in layers) {
      if (layers[i].CLASS_NAME.indexOf('OpenLayers.Layer.WMS') == 0) {
        layers[i].mergeNewParams({uniqueId: uniqueId});
      }
    }
  }
  this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);

  this.model.addListener("refresh",this.paint, this);
  this.model.addListener("hidden",this.hidden, this);
  this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("moveLayerUp",this.moveLayerUp, this);
  this.model.addListener("moveLayerDown",this.moveLayerDown, this);
  this.model.addListener("opacity",this.setOpacity,this);
  //this.model.addListener( "zoomToBbox", this.zoomToBbox, this );
  //this.model.addListener( "zoomOut", this.zoomOut, this );
  //this.model.addListener( "zoomIn", this.zoomIn, this );
  // this.model.addListener( "zoomToMaxExtent", this.zoomToMaxExtent, this );
 //this.model.addFirstListener("loadModel",this.paint,this);
  this.model.addListener("newModel",this.clearWidget2,this);
  this.model.addListener("timestamp",this.timestampListener,this);
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
TimeSeriesOL.prototype.paint = function(objRef, refresh) {
  // Create an OpenLayers map

  if(!objRef.model.map || refresh=="sld"){

    if(refresh=="sld") {
      objRef.clearWidget2(objRef);
    }


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
    maxResolution=(maxResolution)?maxResolution.firstChild.nodeValue:"auto";

    //units
    var units = proj.units == 'meters' ? 'm' : proj.units;
    
    //resolutions
    var resolutions=objRef.widgetNode.selectSingleNode("mb:resolutions");
    resolutions = resolutions ? resolutions.firstChild.nodeValue.split(",") : null;
    //fixed scales - overrides resolutions
    var scales = objRef.widgetNode.selectSingleNode("mb:scales");
    if(scales){
      scales = scales.firstChild.nodeValue.split(",");
      resolutions = new Array();
      for (var s in scales) {
        resolutions.push(OpenLayers.Util.getResolutionFromScale(scales[s], units));
      }
    }
    if(resolutions){
      objRef.model.extent.setZoomLevels(true,resolutions);
    }
    else objRef.model.extent.setZoomLevels(false);

    //get the output DIV and set it to context-size
    var fixedSize=null;
    fixedSize=objRef.widgetNode.selectSingleNode("mb:fixedSize");
    fixedSize=(fixedSize)?fixedSize.firstChild.nodeValue:null;
    if(fixedSize=="true"){
      objRef.node.style.width = objRef.model.getWindowWidth()+"px";
      objRef.node.style.height = objRef.model.getWindowHeight()+"px";
    }
    
    //default map options
    var mapOptions = {
          controls:[],
          projection: proj.srs,
          units: units,
          maxExtent: maxExtent,
          maxResolution: maxResolution,
          resolutions: resolutions,
          theme: config.skinDir+'/openlayers/style.css'
        };

    objRef.model.map = new OpenLayers.Map(objRef.node, mapOptions);

    // Increase hight of Control layers to allow for lots of layers.
    objRef.model.map.Z_INDEX_BASE.Control=10000;

    var layers = objRef.model.getAllLayers();
    if (!objRef.oLlayers){
      objRef.oLlayers = new Array();
    }
    for (var i=0;i<=layers.length-1;i++){
      objRef.addLayer(objRef,layers[i]);
    }
    var bbox=objRef.model.getBoundingBox();

    // set objRef as attribute of the OL map, so we have a reference
    // to TimeSeriesOL available when handling OpenLayers events.
    objRef.model.map.mbMapPane = objRef;
  
    // register OpenLayers event to keep the context updated
    objRef.model.map.events.register('moveend', objRef.model.map, objRef.updateContext);
    // register OpenLayers event to do updates onmouseup
    objRef.model.map.events.register('mouseup', objRef.model.map, objRef.updateMouse);
    
    objRef.model.map.zoomToExtent(new OpenLayers.Bounds(bbox[0],bbox[1],bbox[2],bbox[3]));

   

  }
  
}

/**
 * Event handler to keep the Mapbuilder context updated. It also
 * sets the map cursor to the previously stored value.
 * This is called by OpenLayers.
 * @param e OpenLayers event
 */
TimeSeriesOL.prototype.updateContext = function(e) {
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
  if (!currentAoi || currentAoi.toString != newAoi.toString()) {
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
TimeSeriesOL.prototype.updateMouse = function(e) {
  // get objRef from the event originator object (e.object),
  // where it was stored as mbPane property by paint().
  var objRef = e.object.mbMapPane;

  // update map pane cursor
  if (objRef.model.map.mbCursor) {
    objRef.model.map.div.style.cursor = objRef.model.map.mbCursor;
  }
  
  // fire Mapbuilder mouseup event
  objRef.model.callListeners('mouseup', {evpl: [e.xy.x, e.xy.y]});
}

/**
 * Hide/unhide a layer. Called by Context when the hidden attribute changes.
 * @param objRef Pointer to widget object.
 * @param layerName Name of the layer to hide/unhide.
 */
TimeSeriesOL.prototype.hidden = function(objRef, layerName) {
  var vis=objRef.model.getHidden(layerName);
  if(vis=="1"){ var hidden=false; }
  else {var hidden=true; }
  var  tmpLayer=objRef.getLayer(objRef,layerName)
  if(tmpLayer)tmpLayer.setVisibility(hidden);
}
//###################################################TDO
/**
  * returns layer node from LayerMgr
  * @param layerName The layer Id.
  */
TimeSeriesOL.prototype.getLayer = function(objRef,layerName) {
  return objRef.model.map.getLayer(objRef.oLlayers[layerName].id);
}


//####################################################
/**
 * Removes a layer from the output
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
TimeSeriesOL.prototype.deleteLayer = function(objRef, layerName) {
  if(objRef.oLlayers[layerName])objRef.model.map.removeLayer(objRef.oLlayers[layerName]);
}
/**
 * Removes all layers from the output
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
TimeSeriesOL.prototype.deleteAllLayers = function(objRef) {
  objRef.model.map.destroy();
}
//#############################################TDO
/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
TimeSeriesOL.prototype.moveLayerUp = function(objRef, layerName) {
  var map=objRef.model.map;
  map.raiseLayer(map.getLayer(objRef.oLlayers[layerName].id), 1);
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS name for the layer to be removed
 */
TimeSeriesOL.prototype.moveLayerDown = function(objRef, layerName) {
  objRef.model.map.raiseLayer(objRef.getLayer(objRef,layerName), -1);
}
//###############################################
/**
   * Called when the context's opacity attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
TimeSeriesOL.prototype.setOpacity=function(objRef, layerName){
  var _opacity="1";
  _opacity=objRef.model.getOpacity(layerName);
  objRef.getLayer(objRef,layerName).setOpacity(_opacity);
}
/**
 * Adds a layer into the output
 * @param layerName the WMS name for the layer to be added
 */
TimeSeriesOL.prototype.addLayer = function(objRef, layerNode) {
  // OpenLayers doesn't contain information about projection, so if the
  // baseLayer projection is not standard lat/long, it needs to know
  // maxExtent and maxResolution to calculate the zoomLevels.
  var layer = layerNode;

  
  // Test service of the layer
  var service=layer.selectSingleNode("wmc:Server/@service");service=(service)?service.nodeValue:"";

  // Test title of the layer
  var title=layer.selectSingleNode("wmc:Title");title=(title)?title.firstChild.nodeValue:"";

  // Test name of the layer
  var name2=layer.selectSingleNode("wmc:Name");name2=(name2)?name2.firstChild.nodeValue:"";
  if (objRef.context=="OWS"){
    var href=layer.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");href=(href)?href.firstChild.nodeValue:"";
  }
  else {
    var href=layer.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
  }

  // Test format of the layer
  var format=layer.selectSingleNode("wmc:FormatList/wmc:Format");format=(format)?format.firstChild.nodeValue:"image/gif";

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

  // To cache image divs for animation  
  var animatedImageDivs;
  
  //default option value for a layer
  var layerOptions = {
          visibility: vis,
          transparent: "TRUE",
          projection: objRef.model.map.projection,
          queryable: query,
          maxExtent: objRef.model.map.maxExtent,
          maxResolution: objRef.model.map.maxResolution,  //"auto" if not defined in the context
          alpha: false,            //option for png transparency with ie6
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

      var params = new Array();
      params = sld2UrlParam(currentStyle);
      
            if (objRef.model.timestampList && objRef.model.timestampList.getAttribute("layerName") == name2) { 
	
			var layerId;

 	     	var timestamp = objRef.model.timestampList.childNodes[0];
 	      	
 	      	layerId = objRef.model.id + "_" + objRef.id + "_" + name2;
	      	layerId += "_" + timestamp.firstChild.nodeValue;
	      	
		      objRef.oLlayers[name2]= new OpenLayers.Layer.WMS.Untiled(title,href,{
		          layers: name2,
		          // "TRUE" in upper case else the context doc boston.xml
		          // (i.c. the IONIC WMS/WFS) doesn't work.
		          // Note that this is in line with the WMS standard (OGC 01-068r2),
		          // section 6.4.1 Parameter Ordering and Case:
		          // "Parameter names shall not be case sensitive,
		          //  but parameter values shall be case sensitive."			          
				  "TIME":timestamp.firstChild.nodeValue,
		          transparent:"TRUE",
		          format: format,
		          sld:params.sld,
		          sld_body:params.sld_body,
		          styles:params.styles
		        },
		        layerOptions
		      );
		      
		  var numNodes = objRef.model.timestampList.childNodes.length;
		  this.animatedImageDivs  = new Array(numNodes);
	}
	else {
	      objRef.oLlayers[name2]= new OpenLayers.Layer.WMS.Untiled(title,href,{
		  layers: name2,
		  // "TRUE" in upper case else the context doc boston.xml
		  // (i.c. the IONIC WMS/WFS) doesn't work.
		  // Note that this is in line with the WMS standard (OGC 01-068r2),
		  // section 6.4.1 Parameter Ordering and Case:
		  // "Parameter names shall not be case sensitive,
		  //  but parameter values shall be case sensitive."
		  transparent:"TRUE",
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
      objRef.oLlayers[name2]= new OpenLayers.Layer.WMS(title,href,{
          layers: name2,
          transparent:"TRUE",
          format: format,
          sld:params.sld,
          sld_body:params.sld_body,
          styles:params.styles
        },
        layerOptions
      );
    break;

    // WFS Layer
    case "wfs":
    case "OGC:WFS":
      style = sld2OlStyle(currentStyle);
      if(style){
        layerOptions.style=style;
      }
      else{
        layerOptions.style=objRef.getWebSafeStyle(objRef, 2*i+1);
      }
      layerOptions.featureClass=OpenLayers.Feature.WFS;

      objRef.oLlayers[name2]= new OpenLayers.Layer.WFS(
        title,
        href,{
          typename: name2,
          maxfeatures: 1000},
          layerOptions
        );
    break;

    // GML Layer
    case "gml":
    case "OGC:GML":
      style = sld2OlStyle(currentStyle);
      if(style){
        layerOptions.style=style;
      }
      else{
        layerOptions.style=objRef.getWebSafeStyle(objRef, 2*i+1);
      }
      objRef.oLlayers[name2] = new OpenLayers.Layer.GML(title,href,layerOptions);

     break;

    case "GMAP":
    case "Google":
      //<script src='http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAA8qdfnOIRy3a9gh214V5jKRTwM0brOpm-All5BF6PoaKBxRWWERQ7UHfSE2CGKw9qNg0C1vUmYLatLQ'></script>
      layerOptions.projection="EPSG:41001";
      layerOptions.units="degrees";
      objRef.model.map.units="degrees";
      layerOptions.maxExtent=new OpenLayers.Bounds("-180","-90","180","90");
      layerOptions.isBaseLayer=true;
      objRef.oLlayers[name2] = new OpenLayers.Layer.Google( "Google Satellite" , {type: G_HYBRID_MAP, maxZoomLevel:18},layerOptions );
    break;

    case "YMAP":
    case "Yahoo":
      // <script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script>
      layerOptions.isBaseLayer=true;
      objRef.oLlayers[name2] = new OpenLayers.Layer.Yahoo( "Yahoo");
    break;

    case "VE":
    case "Microsoft":
      //<script src='http://dev.virtualearth.net/mapcontrol/v3/mapcontrol.js'></script>
      layerOptions.isBaseLayer=true;
      objRef.oLlayers[name2] = new OpenLayers.Layer.VirtualEarth( "VE",{minZoomLevel: 0, maxZoomLevel: 18,type: VEMapStyle.Hybrid});
    break;

    case "MultiMap":
      //<script type="text/javascript" src="http://clients.multimap.com/API/maps/1.1/metacarta_04"></script>
      layerOptions.isBaseLayer=true;
      objRef.oLlayers[name2] = new OpenLayers.Layer.MultiMap( "MultiMap");
    break;
    default:
      alert(mbGetMessage("layerTypeNotSupported", service));
  }
  if(opacity && objRef.oLlayers[name2]){
    objRef.oLlayers[name2].setOpacity(opacity);
  }
  objRef.model.map.addLayer(objRef.oLlayers[name2]);
}

/**
 * gets an OpenLayers vector style with web safe colors.
 * @param objRef reference to this object
 * @param colorNumber number of a color from which to generate websafe color
 * @return {OpenLayers.Style} style for OpenLayers vector rendering
 */
TimeSeriesOL.prototype.getWebSafeStyle = function(objRef, colorNumber) {
  colors=new Array("00","33","66","99","CC","FF");
  colorNumber=(colorNumber)?colorNumber:0;
  colorNumber=(colorNumber<0)?0:colorNumber;
  colorNumber=(colorNumber>215)?215:colorNumber;
  i=parseInt(colorNumber/36);
  j=parseInt((colorNumber-i*36)/6);
  k=parseInt((colorNumber-i*36-j*6));
  var color="#"+colors[i]+colors[j]+colors[k];
  var style = new Object();
  style.fillColor = color;
  style.strokeColor = color;
  style.map = objRef.model.map;
  return style;
}

/**
   * Called for refreshing one layer.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
TimeSeriesOL.prototype.refreshLayer = function(objRef, layerName , newParams){
  newParams['version'] = Math.random(); //necessary for see change in certain case
  objRef.getLayer(objRef,layerName).mergeNewParams(newParams);
}
  
/**
 * This function is called when a new Context is about to be loaded
 * - it deletes all the old layers so new ones can be loaded.
 * TBD: This should be renamed to clearWidget, except inheritence
 * is not working if we do that and it doesn't get called.
 * @param objRef Pointer to this object.
 */
TimeSeriesOL.prototype.clearWidget2 = function(objRef) {
  if(objRef.model.map){
    objRef.model.map.destroy();
    outputNode =  document.getElementById( objRef.model.id+"Container_OpenLayers_ViewPort" );
    if(outputNode){
      objRef.node.removeChild(outputNode);
    }
    objRef.model.map=null;
    objRef.oLlayers = null;
  }
}
		
		
  /**
   * Called when the map timestamp is changed so set the layer visiblity.
   * @param objRef This object.
   * @param timestampIndex  The array index for the layer to be displayed. 
   */
  TimeSeriesOL.prototype.timestampListener=function(objRef, timestampIndex){
	var layerName = objRef.model.timestampList.getAttribute("layerName");
    var timestamp = objRef.model.timestampList.childNodes[timestampIndex];


	if ((layerName) && (timestamp)) {		
		var curLayer = objRef.oLlayers[layerName];
		// Perform URL substitution via regexps
		var oldImageUrl = curLayer.tile.imgDiv.src;
		var newImageUrl = oldImageUrl;		
		newImageUrl = newImageUrl.replace(/TIME\=.*?\&/,'TIME=' + timestamp.firstChild.nodeValue + '&');
		curLayer.tile.imgDiv.src = newImageUrl;
	}
			
  }
  
  
