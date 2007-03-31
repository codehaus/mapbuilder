/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/
mapbuilder.loadScript(baseDir+"/model/Proj.js");
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

  // ===============================
  // Update of Context Parameters
  // ===============================

  /**
   * Change a Layer's visibility.
   * @param layerName  The name of the layer that is to be changed
   * @param hidden     String with the value to be set; 1=hidden, 0=visible.
   */
  this.setHidden=function(layerName, hidden){
    // Set the hidden attribute in the Context
    var hiddenValue = "0";
    if (hidden) hiddenValue = "1";
      
    var layer=this.getFeatureNode(layerName);
    layer.setAttribute("hidden", hiddenValue);
    // Call the listeners
    this.callListeners("hidden", layerName);
  }

  /**
   * Get the layer's visiblity attribute value.
   * @param layerName  The name of the layer that is to be changed
   * @return hidden  String with the value; 1=hidden, 0=visible.
   */
  this.getHidden=function(layerName){
    var hidden=1;
    var layer=this.getFeatureNode(layerName)
    return layer.getAttribute("hidden");
  }

  /**
   * Get the BoundingBox.
   * @return BoundingBox array in form (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function() {
    // Extract BoundingBox from the context
    //boundingBox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var lowerLeft=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
    var upperRight=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
    var strBbox = new String(lowerLeft.firstChild.nodeValue + " " + upperRight.firstChild.nodeValue).split(" ");
    var bbox = new Array();
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
    //PGC this.callListeners("bbox");
    this.callListeners("bbox", boundingBox); // from Context.js
    
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

  /*PGC Added from Context.js */
  /**
   * Set the BoundingBox element and call the refresh listeners
   * @param boundingBox array in the sequence (xmin, ymin, xmax, ymax).
   */
  this.initBbox=function(objRef) {
    // Set BoundingBox in context from URL CGI params
    if (window.cgiArgs["bbox"]) {   //set as minx,miny,maxx,maxy
      var bbox = window.cgiArgs["bbox"].split(',');
    /////TBD i'm not sure it was necessary 
    objRef.setBoundingBox(bbox);
    ///end TBD
    //OL
      objRef.map.zoomToExtent(new OpenLayers.Bounds(bbox[0],bbox[1],bbox[2],bbox[3]));
	  objRef.setBoundingBox(objRef.map.getExtent().toBBOX().split(','));
    //OL  
    }
  }
  this.addFirstListener( "loadModel", this.initBbox, this );  // removed the comment
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
  /*End of addition */
  
  /**
   * Set the Spacial Reference System for layer display and layer requests.
   * @param srs The Spatial Reference System.
   */
  this.setSRS=function(srs) {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var bbox=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
    bbox.setAttribute("crs",srs);
    this.callListeners("srs");
  }

  /**
   * Set the Spacial Reference System for layer display and layer requests.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    if( this.doc ) {
      var bbox=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
      srs=bbox.getAttribute("crs");
      return srs;
    } 
  }
/**
   * Get the Projection object from the context document.
   * @return Proj Object of  The Spatial Reference System.
   */
  this.initProj=function(objRef) {
    objRef.proj=new Proj(objRef.getSRS());
    
  }
   this.addFirstListener( "loadModel", this.initProj, this );
  /**
   * Get the Window width.
   * @return width The width of map window from the context document
   */
  this.getWindowWidth=function() {
    if( this.doc ) {
      //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
      var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
      width=win.getAttribute("width");
      return width;
    }
  }

  /**
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    win.setAttribute("width", width);
    this.callListeners("resize");
  }

  /**
   * Get the Window height.
   * @return height The height of map window from the context document.
   */
  this.getWindowHeight=function() {
    //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    if( this.doc ) {
      var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
      height=win.getAttribute("height");
      return height;
    }
  }

  /**
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
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
   * Returns the serverUrl for the layer passed in as the feature argument.
   * @param requestName ignored for context docs (only GetMap supported)
   * @param method ignored for context docs (only GET supported)
   * @param feature the node for the feature from the context doc
   * @return height String URL for the GetMap request
   */
  this.getServerUrl = function(requestName, method, feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
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
   * returns a node that has the specified feature name in the context doc
   * @param featureName Name element value to return
   * @return the node from the context doc with the specified feature name
   */
  this.getFeatureNode = function(featureName) {
    if( this.doc ) {
      var feature = this.doc.selectSingleNode("//wmc:ResourceList/*[wmc:Name='"+featureName+"']");
      
      if(feature == null ) {
        alert(mbGetMessage("featureNotFoundOwsContext"));
      } 
      
      return feature;
    }
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
      requestStylesheet.setParameter("filter", escape(Sarissa.serialize(feature.selectSingleNode("ogc:Filter"))) );
    }
  }
  //this.addFirstListener("wfs_GetFeature", this.setRequestParameters, this);

  /**
   * Method to get a list of queryable layers
   * @return the list with queryable layers
   */
  this.getQueryableLayers = function() {
    var listNodeArray = this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[attribute::queryable='1']/wmc:Name");
    return listNodeArray;
  }

  /**
   * Method to get a list of all layers in the context doc
   * TBD: merge this with above, passing queryable as an optional boolean param?
   * @TODO Add the other layers
   * @return the list with all layers
   */
  this.getAllLayers = function() {
    listNodeArray = this.doc.selectNodes("//wmc:Layer|//wmc:FeatureType");
    return listNodeArray;
  }

  /**
   * Method to get a layer with the specified name in the context doc
   * @param layerName the layer to be returned
   * @return the list with all layers
   * @TODO check other layers
   */
  this.getLayer = function(layerName) {
    var layer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+layerName+"']");
    if( layer == null ) {
      layer = this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:RssLayer[@id='"+layerName+"']");
    }
    //TBD: add in time stamp
    return layer;
  }

  /**
   * Method to add a Layer to the LayerList
   * @param layerNode the Layer node from another context doc or capabiltiies doc
   */
  this.addLayer = function(objRef, layerNode) { 
    if( objRef.doc != null ) {
      var parentNode = objRef.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList");
   
      // check if that node does not alreayd exist, replace it (query may have changed)
      var id = layerNode.getAttribute("id");
      var str = "/wmc:OWSContext/wmc:ResourceList/"+layerNode.nodeName+"[@id='"+id+"']";
      var node = objRef.doc.selectSingleNode(str);
      if( node != null ) {
        parentNode.removeChild(node)
      }
 
      parentNode.appendChild(layerNode.cloneNode(true));
      objRef.modified = true;
      //alert( "Adding layer:"+Sarissa.serialize( layerNode ) );
    } else {
      alert(mbGetMessage("nullOwsContext"));
    }
    //objRef.callListeners("refresh");
  }
  this.addFirstListener( "addLayer", this.addLayer, this );

  /**
   * Method to remove a Layer from the LayerList
   * @param layerName the Layer to be deleted
   */
  this.deleteLayer = function(objRef, layerName) {
    var deletedNode = objRef.getLayer(layerName);
    if (!deletedNode) {
      alert(mbGetMessage("nodeNotFound", layerName));
      return;
    }
    deletedNode.parentNode.removeChild(deletedNode);
    objRef.modified = true;
  }
  this.addFirstListener( "deleteLayer", this.deleteLayer, this );

  /**
   * Method to move a Layer in the LayerList up
   * @param layerName the layer to be moved
   */
  this.moveLayerUp = function(objRef, layerName) {
    var movedNode = objRef.getLayer(layerName);
    var sibNode = movedNode.selectSingleNode("following-sibling::*");
    if (!sibNode) {
      alert(mbGetMessage("cantMoveUp", layerName));
      return;
    }
    movedNode.parentNode.insertBefore(sibNode,movedNode);
    objRef.modified = true;
  }
  this.addFirstListener( "moveLayerUp", this.moveLayerUp, this );

  /**
   * Method to move a Layer in the LayerList down
   * @param layerName the layer to be moved
   */
  this.moveLayerDown = function(objRef, layerName) {
    var movedNode = objRef.getLayer(layerName);
    var listNodeArray = movedNode.selectNodes("preceding-sibling::*");  //preceding-sibling axis contains all previous siblings
    var sibNode = listNodeArray[listNodeArray.length-1];
    if (!sibNode) {
      alert(mbGetMessage("cantMoveDown", layerName));
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
      var layerName = extentNode.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
      objRef.timestampList.setAttribute("layerName", layerName);
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
   * Returns the current timestamp value.
   * @param layerName the name of the Layer from which the timestamp list was generated
   * @return the current timestamp value.
   */
  this.getCurrentTimestamp = function( layerName ) {
    var index = this.getParam("timestamp");
    return this.timestampList.childNodes[index].firstChild.nodeValue;
  }
}