/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: OwsContext.js 3864 2008-02-21 06:01:53Z rdewit $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

/**
 * Stores an OWS Context document as defined by the OGC interoperability
 * experiment. This model should be eventually merged with the standard OGC
 * context doc.
 * Listeners supported by this model:
 * "refresh" called when window parameters (width/height, bbox) are changed
 * "hidden" called when visibilty of a layer is changed
 * "wfs_getFeature" called when feature resources are loaded
 *
 * @constructor
 * @base ModelBase
 * @author Mike Adair
 * @requires Sarissa
 *
 */
function OwsContext(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));

  // MAP-186
  this.namespace = this.namespace ? this.namespace.replace(/\"/g, "'")+" " : '';
  this.namespace = this.namespace + "xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs' xmlns:sld='http://www.opengis.net/sld'";

  /**
   * Change a Layer's visibility.
   * @param layerId  The name of the layer that is to be changed
   * @param hidden     String with the value to be set; 1=hidden, 0=visible.
   */
  this.setHidden=function(layerId, hidden){
    // Set the hidden attribute in the Context
    var hiddenValue = "0";
    if (hidden) hiddenValue = "1";

    var layer=this.getLayer(layerId);
    if (layer) layer.setAttribute("hidden", hiddenValue);
    // Call the listeners
    this.callListeners("hidden", layerId);
  }

  /**
   * Get the layer's visiblity attribute value.
   * @param layerId  The name of the layer that is to be changed
   * @return hidden  String with the value; 1=hidden, 0=visible.
   */
  this.getHidden=function(layerId){
    var hidden=1;
    var layer=this.getFeatureNode(layerId)
    if (layer) hidden = layer.getAttribute("hidden");
    return hidden;
  }

  /**
   * Get the BoundingBox value from the Context document.
   * @return BoundingBox array with the sequence (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function() {
    var bbox = new Array();
    // Extract BoundingBox from the context
    var lowerLeft=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
    var upperRight=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
    var strBbox = new String(lowerLeft.firstChild.nodeValue + " " + upperRight.firstChild.nodeValue).split(" ");
    for (i=0; i<strBbox.length; ++i) {
      bbox[i] = parseFloat(strBbox[i]);
    }
    return bbox;
  }

  /**
   * Set the BoundingBox element and call the refresh listeners
   * @param boundingBox array in the sequence (xmin, ymin, xmax, ymax).
   */
  this.setBoundingBox=function(boundingBox) {
    // Set BoundingBox in context
    var lowerLeft=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
    lowerLeft.firstChild.nodeValue = boundingBox[0] + " " + boundingBox[1];
    var upperRight=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
    upperRight.firstChild.nodeValue = boundingBox[2] + " " + boundingBox[3];
    // Call the listeners
    this.callListeners("bbox", boundingBox);
  }

  /**
   * Set the BoundingBox element and call the refresh listeners
   * @param boundingBox array in the sequence (xmin, ymin, xmax, ymax).
   */
  this.initBbox=function(objRef) {
    // Set BoundingBox in context from URL CGI params
    if (window.cgiArgs["bbox"]) {   //set as minx,miny,maxx,maxy
      var bbox = window.cgiArgs["bbox"].split(',');
      objRef.setBoundingBox(bbox);
    }
  }
  this.addListener( "loadModel", this.initBbox, this );
  //this.addListener( "contextLoaded", this.initBbox, this );

  /**
   * Set the aoi param and call the refresh listeners
   * @param boundingBox array in the sequence (xmin, ymin, xmax, ymax).
   */
  this.initAoi=function(objRef) {
    // Set AOI of context from URL CGI params
    if (window.cgiArgs["aoi"]) {      //set as ul,lr point arrays
      var aoi = window.cgiArgs["aoi"].split(',');
      objRef.setParam("aoi",new Array(new Array(aoi[0],aoi[3]),new Array(aoi[2],aoi[1])));
    }
  }
  this.addListener( "loadModel", this.initAoi, this );
  //MA this.addListener( "contextLoaded", this.initAoi, this );

  /**
   * Set the Spatial Reference System for the context document.
   * @param srs The Spatial Reference System.
   */
  this.setSRS=function(srs) {
    var bbox=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
    bbox.setAttribute("crs",srs);
    this.callListeners("srs");
  }

  /**
   * Get the Spatial Reference System from the context document.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    var bbox=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
    srs=bbox.getAttribute("crs");
    srs = srs ? srs : 'EPSG:4326';
    return srs;
  }

  /**
   * Get the Projection object from the context document.
   * @return Proj Object of  The Spatial Reference System.
   */
  this.initProj=function(objRef) {
    objRef.proj=new OpenLayers.Projection(objRef.getSRS());
  }
  this.addFirstListener( "loadModel", this.initProj, this );

  /**
   * Get the Window width.
   * @return width The width of map window from the context document
   */
  this.getWindowWidth=function() {
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    return win.getAttribute("width");
  }

  /**
   * Set the Window width.
   * @param width The width of map window to set in the context document
   */
  this.setWindowWidth=function(width) {
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    win.setAttribute("width", width);
    this.callListeners("resize");
  }

  /**
   * Get the Window height.
   * @return height The height of map window from the context document.
   */
  this.getWindowHeight=function() {
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    return win.getAttribute("height");
  }

  /**
   * Set the Window height.
   * @param height The height of map window to set in the context document
   */
  this.setWindowHeight=function(height) {
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    win.setAttribute("height", height);
    this.callListeners("resize");
  }

  /**
   * Returns the width/height of the map window as an array
   * Added by Andreas Hocevar for compatibility with Context.js
   */
  this.getWindowSize=function() {
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    return new Array(win.getAttribute("width"), win.getAttribute("height"));
  }

  /**
   * Set the Window width and height in one function call to avoid a resize event in between
   * setting width and height, because that causes checkBbox to be triggered, which adjusts the
   * bbox then when it should not yet be adjusted.
   * Based on setWindowSize by VTS in Context.js
   * Added by Andreas Hocevar for compatibility with Context.js
   * @param size Size of the map window as (width, height) array
   */
  this.setWindowSize=function(size) {
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    var width = size[0];
    var height = size[1];
    win.setAttribute("width", width);
    win.setAttribute("height", height);
    this.callListeners("resize");
  }

  /**
   * returns a node that has the specified feature name in the context doc
   * @param featureName Name element value to return
   * @return the node from the context doc with the specified feature name
   */
  this.getFeatureNode = function(layerId) {
    if( this.doc ) {

      // Find feature by id
      var feature = this.doc.selectSingleNode("//wmc:ResourceList/*[@id='"+layerId+"']");

      // Fallback: find feature by name
      if (feature == null) {
        feature = this.doc.selectSingleNode("//wmc:ResourceList/*[wmc:Name='"+layerId+"']");
      }

      if(feature == null ) {
        alert(mbGetMessage("featureNotFoundOwsContext"));
      }

      return feature;
    }
  }

  /**
   * Returns the serverUrl for the layer passed in as the feature argument.
   * @param requestName ignored for context docs (only GetMap supported)
   * @param method ignored for context docs (only GET supported)
   * @param feature the node for the feature from the context doc
   * @return height String URL for the GetMap request
   */
  this.getServerUrl = function(requestName, method, feature) {
    var service = requestName.split(":");
    if (service.length > 0) {
      service = service[0].toUpperCase();
    }
    var url = feature.selectSingleNode("wmc:Server[@service='OGC:"+service+"']/wmc:OnlineResource").getAttribute("xlink:href");
    if (!url) {
      // fallback to default service
      url = feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
    }
    return url;
  }

  /**
   * Returns the WMS version for the layer passed in as the feature argument
   * @param feature the node for the feature from the context doc
   * @return the WMS GetMap version for the Layer.
   */
  this.getVersion = function(feature) {
    return feature.selectSingleNode("wmc:Server").getAttribute("version");
  }

  /**
   * Get HTTP method for the specified feature
   * @param feature the Layer node from the context doc
   * @return the HTTP method to get the feature with
   */
  this.getMethod = function(feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
  }

  /**
   * Return the service type of the bottom layer in the layer list.
   * This is used to match navigation tools with the basemap.
   */
  this.getBaseLayerService=function(){
    //x=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[last()]/wmc:Server/@service");
    x=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[last()]/wmc:Server");
    s=x.getAttribute("service");
    //alert("OwsContext.getBaseLayerService: s="+s);
    return s;
  }

  /**
   * listener method which loads WFS features from the context doc, after WMS
   * layers are loaded.
   * @param objRef Pointer to this object.
   */
  this.loadFeatures = function(objRef) {
    var nodeSelectXpath = objRef.nodeSelectXpath + "/wmc:FeatureType[wmc:Server/@service='OGC:WFS']/wmc:Name";
    var featureList = objRef.doc.selectNodes(nodeSelectXpath);
    for (var i=0; i<featureList.length; i++) {
      var featureName = featureList[i].firstChild.nodeValue;
      objRef.setParam('wfs_GetFeature',featureName);
    }

    //this.callListeners("contextLoaded");  //PGC
  }
  this.addListener("loadModel", this.loadFeatures, this);

  /**
   * Listener function which sets stylesheet params for WebServiceRequests
   * @param objRef pointer to this object
   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
   */
  this.setRequestParameters = function(featureName, requestStylesheet) {
    var feature = this.getFeatureNode(featureName);
    if (feature.selectSingleNode("ogc:Filter")) {
      requestStylesheet.setParameter("filter", escape((new XMLSerializer()).serializeToString(feature.selectSingleNode("ogc:Filter"))) );
    }
  }
  //this.addFirstListener("wfs_GetFeature", this.setRequestParameters, this);

  /**
   * Method to get a list of queryable layers
   * @return the list with queryable layers
   */
  this.getQueryableLayers = function() {
    var listNodeArray = this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[@queryable='1']|/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType[@queryable='1']");
    if (listNodeArray == null) {
      listNodeArray = this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer|/wmc:OWSContext/wmc:ResourceList/wmc:Layer");
    }
    return listNodeArray;
  }

  /**
   * Method to get a list of all layers in the context doc
   * TBD: merge this with above, passing queryable as an optional boolean param?
   * @TODO Add the other layers
   * @return the list with all layers
   */
  this.getAllLayers = function() {
    var listNodeArray = this.doc.selectNodes("//wmc:Layer|//wmc:FeatureType");
    return listNodeArray;
  }

  /**
   * Method to get a layer with the specified id/name in the context doc
   * @param layerId/layerName the layer to be returned
   * @return the list with all layers
   * @TODO check other layers
   */
  this.getLayer = function(layerId) {
    var layer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType[@id='"+layerId+"']");
    if (layer == null) {
      layer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[@id='"+layerId+"']");
    }
    if (layer == null) {
      layer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+layerId+"']");
    }
    if (layer == null) {
      layer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType[wmc:Name='"+layerId+"']");
    }
    if( layer == null ) {
      layer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:RssLayer[@id='"+layerId+"']");
    }
    //TBD: add in time stamp
    return layer;
  }

  /**
   * Method to get a layer id with the specified id/name in the context doc
   * @param layerName the name of the layer of which the id is to be returned
   * @return the id of the layer || false
   */
  this.getLayerIdByName = function(layerName) {
    var layer = this.getLayer(layerName);
    var id;
    if (layer) {
      id = layer.getAttribute("id");
    }

    return id || false;
  }


  /**
   * Method to add a Layer to the LayerList
   * @param layerNode the Layer node from another context doc or capabiltiies doc
   */
  this.addLayer = function(objRef, layerNode) {
    if( objRef.doc != null ) {
      var parentNode = objRef.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList");

      // Generate layer id if layer doesn't have an id
      var randomNumber = Math.round(10000 * Math.random());
      id = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue + "_" + randomNumber; 
      layerNode.setAttribute("id", id);
      
      // check if that node does not alreayd exist, replace it (query may have changed)
      var id = layerNode.getAttribute("id");
      var str = "/wmc:OWSContext/wmc:ResourceList/"+layerNode.nodeName+"[@id='"+id+"']";
      var node = objRef.doc.selectSingleNode(str);
      if( node != null ) {
        parentNode.removeChild(node);
      }

      parentNode.appendChild(layerNode);
      objRef.modified = true;
      if (this.debug) {
         mbDebugMessage( "Adding layer:"+(new XMLSerializer()).serializeToString( layerNode ) );
      }
    } else {
      alert(mbGetMessage("nullOwsContext"));
    }
    //objRef.callListeners("refresh");
  }
  this.addFirstListener( "addLayer", this.addLayer, this );

  /**
   * Method to get the baselayer 
   * @return the baseLayer
   * @TODO check for other baselayers
   */
   this.getBaseLayer = function() {
      var baseLayer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/ows:BaseLayer");
      return baseLayer;
   }
   
 /**
   * Method to add a Sld to the StyleList
   * @param layerName the Layer name from another context doc or capabiltiies doc
   * TBD: make sure this will work again using layerId instead of layerName
   */
  this.addSLD = function(objRef,sldNode) {
    // alert("context addSLD : "+objRef.id);
    var layerName=sldNode.selectSingleNode("//Name").firstChild.nodeValue;
    var parentNode = objRef.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']");
    parentNode.appendChild(sldNode.cloneNode(true));

    objRef.modified = true;
      var attribs=[];
    attribs["sld_body"]=(new XMLSerializer()).serializeToString(objRef.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList/wmc:Style/wmc:SLD/wmc:StyledLayerDescriptor"));
    objRef.map.mbMapPane.refreshLayer(objRef.map.mbMapPane,layerName,attribs);
  }
  this.addFirstListener( "addSLD", this.addSLD, this );

  /**
   * Method to remove a Layer from the LayerList
   * @param layerId the Layer to be deleted
   */
  this.deleteLayer = function(objRef, layerId) {
    var deletedNode = objRef.getLayer(layerId);
    if (!deletedNode) {
      alert(mbGetMessage("nodeNotFound", layerId));
      return;
    }
    deletedNode.parentNode.removeChild(deletedNode);
    objRef.modified = true;
  }
  this.addFirstListener( "deleteLayer", this.deleteLayer, this );

  /**
   * Method to move a Layer in the LayerList up
   * @param layerId the layer to be moved
   */
  this.moveLayerUp = function(objRef, layerId) {
    var movedNode = objRef.getLayer(layerId);
    var sibNode = movedNode.selectSingleNode("following-sibling::*");
    if (!sibNode) {
      alert(mbGetMessage("cantMoveUp", layerId));
      return;
    }
    movedNode.parentNode.insertBefore(sibNode,movedNode);
    objRef.modified = true;
  }
  this.addFirstListener( "moveLayerUp", this.moveLayerUp, this );

  /**
   * Method to move a Layer in the LayerList down
   * @param layerId the layer to be moved
   */
  this.moveLayerDown = function(objRef, layerId) {
    var movedNode = objRef.getLayer(layerId);
    var listNodeArray = movedNode.selectNodes("preceding-sibling::*");  //preceding-sibling axis contains all previous siblings
    var sibNode = listNodeArray[listNodeArray.length-1];
    if (!sibNode) {
      alert(mbGetMessage("cantMoveDown", layerId));
      return;
    }
    movedNode.parentNode.insertBefore(movedNode,sibNode);
    objRef.modified = true;
  }
  this.addFirstListener( "moveLayerDown", this.moveLayerDown, this );

  /**
   * Adds a node to the Context document extension element.  The extension element
   * will be created if it doesn't already exist.
   * @param extensionNode the node to be appended in the extension element.
   * @return the ndoe added to the extension element
   */
  this.setExtension = function(extensionNode) {
    var extension = this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
    if (!extension) {
      var general = this.doc.selectSingleNode("/wmc:OWSContext/wmc:General");
      var newChild = createElementWithNS(this.doc,"Extension",'http://www.opengis.net/context');
      extension = general.appendChild(newChild);
    }
    return extension.appendChild(extensionNode);
  }

  /**
   * Returns the contents of the extension element
   * @return the contents of the extension element
   */
  this.getExtension = function() {
    return this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
  }

  // PL -BRGM
  /**
   * Change a Layer's opacity
   * @param layerId  The name of the layer that is to be changed
   * @param Opacity     Value of the opacity
   */
  this.setOpacity=function(layerId, Opacity){
    // Set the hidden attribute in the Context
    var layer = this.getLayer(layerId);
    if (layer) layer.setAttribute("opacity", Opacity);
    // Call the listeners
    this.callListeners("opacity", layerId);
  }

  /**
   * Get the layer's opacity attribute value.
   * @param layerId  The name of the layer that is to be changed
   * @return hidden  String with the value; 1=hidden, 0=visible.
   */
  this.getOpacity=function(layerId){
    var opacity=1;
    var layer = this.getLayer(layerId);
    if (layer) opacity = layer.getAttribute("opacity");
    return opacity;
  }
  // PL -END
  
  /**
   * Parses a Dimension element from the Context document as a loadModel listener.
   * This results in an XML structure with one element for each GetMap time value
   * parameter and added to the Context extrension element.
   * @param objRef a pointer to this object
   */
  this.initTimeExtent = function( objRef ) {
    //only the first one selected is used as the timestamp source
    //var extentNode = objRef.doc.selectSingleNode("//wmc:Layer/wmc:Dimension[@name='time']");
    //TBD: how to deal with multiple time dimensions in one context doc, or caps doc?
    var timeNodes = objRef.doc.selectNodes("//wmc:Dimension[@name='time']");
    for (var i=0; i<timeNodes.length; ++i) {
      var extentNode = timeNodes[i];
      objRef.timestampList = createElementWithNS(objRef.doc,"TimestampList",mbNsUrl);
      var layerId;
      var layerNode = extentNode.parentNode.parentNode;
      if (layerNode.selectSingleNode("@id")) {
        layerId = layerNode.selectSingleNode("@id").firstChild.nodeValue;
      } else {
        layerId = layerNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
      }
      objRef.timestampList.setAttribute("layerId", layerId);
      //alert("found time dimension, extent:"+extentNode.firstChild.nodeValue);
      var times = extentNode.firstChild.nodeValue.split(",");   //comma separated list of arguments
      for (var j=0; j<times.length; ++j) {
        var params = times[j].split("/");     // parses start/end/period
        if (params.length==3) {
          var start = setISODate(params[0]);
          var stop = setISODate(params[1]);
          var period = params[2];
          var parts = period.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
          for (var i=1; i<parts.length; ++i) {
            if (!parts[i]) parts[i]=0;
          }
          //alert("start time:"+start.toString());
          do {
            var timestamp = createElementWithNS(objRef.doc,"Timestamp",mbNsUrl);
            timestamp.appendChild(objRef.doc.createTextNode(getISODate(start)));
            objRef.timestampList.appendChild(timestamp);

            start.setFullYear(start.getFullYear()+parseInt(parts[2],10));
            start.setMonth(start.getMonth()+parseInt(parts[4],10));
            start.setDate(start.getDate()+parseInt(parts[6],10));
            start.setHours(start.getHours()+parseInt(parts[8],10));
            start.setMinutes(start.getMinutes()+parseInt(parts[10],10));
            start.setSeconds(start.getSeconds()+parseFloat(parts[12]));
            //alert("time:"+start.toString());
          } while(start.getTime() <= stop.getTime());

        } else {
          //output single date value
          var timestamp = createElementWithNS(objRef.doc,"Timestamp",mbNsUrl);
          timestamp.appendChild(objRef.doc.createTextNode(times[j]));
          objRef.timestampList.appendChild(timestamp);
        }
      }
     objRef.setExtension(objRef.timestampList);
    }
  }
  this.addFirstListener( "loadModel", this.initTimeExtent, this );

  /**
   * clear the time extent created by initTimeExtent
   * @param objRef reference to this model
   */
  this.clearTimeExtent = function( objRef ) {
    var tsList = objRef.timestampList;
    if (tsList) {
      tsList.parentNode.removeChild(tsList);
    }
  }
  this.addListener("newModel", this.clearTimeExtent, this);

  /**
   * Returns the current timestamp value.
   * @param layerName the name of the Layer from which the timestamp list was generated
   * @return the current timestamp value.
   */
  this.getCurrentTimestamp = function( layerName ) {
    var index = this.getParam("timestamp");
    return this.timestampList.childNodes[index].firstChild.nodeValue;
  }

}
