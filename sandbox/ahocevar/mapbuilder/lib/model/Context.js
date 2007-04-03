/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Stores a Web Map Context (WMC) document as defined by the Open GIS Consortium
 * http://opengis.org and extensions the the WMC.  
 *
 * Listeners supported by this model:
 * "refresh" called when window parameters (width/height, bbox) are changed
 * "hidden" called when visibilty of a layer is changed
 *
 * @constructor
 * @base ModelBase
 * @author Cameron Shorter
 * @param modelNode Pointer to the xml node for this model from the config file.
 * @param parent    The parent model for the object.
  * 
 */
function Context(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));

  this.namespace = "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";

  /**
   * Change a Layer's visibility.
   * @param layerName  The name of the layer that is to be changed
   * @param hidden     String with the value to be set; 1=hidden, 0=visible.
   */
  this.setHidden=function(layerName, hidden){
    // Set the hidden attribute in the Context
    var hiddenValue = "0";
    if (hidden) hiddenValue = "1";
      
    var layer=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+layerName+"']");
    if (layer) layer.setAttribute("hidden", hiddenValue);
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
    var layer=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+layerName+"']");
    if (layer) hidden = layer.getAttribute("hidden");
    return hidden;
  }

  /**
   * Get the BoundingBox value from the Context document.
   * @return BoundingBox array with the sequence (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function() {
    var boundingBox=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
    bbox = new Array();
    bbox[0]=parseFloat(boundingBox.getAttribute("minx"));
    bbox[1]=parseFloat(boundingBox.getAttribute("miny"));
    bbox[2]=parseFloat(boundingBox.getAttribute("maxx"));
    bbox[3]=parseFloat(boundingBox.getAttribute("maxy"));
    return bbox;
  }

  /**
   * Set the BoundingBox element and call the refresh listeners
   * @param boundingBox array in the sequence (xmin, ymin, xmax, ymax).
   */
  this.setBoundingBox=function(boundingBox) {
    // Set BoundingBox in context
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var bbox=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
    bbox.setAttribute("minx", boundingBox[0]);
    bbox.setAttribute("miny", boundingBox[1]);
    bbox.setAttribute("maxx", boundingBox[2]);
    bbox.setAttribute("maxy", boundingBox[3]);
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
    /////TBD i'm not sure it was necessary 
    objRef.setBoundingBox(bbox);
    ///end TBD
    //OL
      objRef.map.zoomToExtent(new OpenLayers.Bounds(bbox[0],bbox[1],bbox[2],bbox[3]));
	  objRef.setBoundingBox(objRef.map.getExtent().toBBOX().split(','));
    //OL  
    }
  }
  this.addFirstListener( "loadModel", this.initBbox, this );
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
   * Set the Spacial Reference System for the context document.
   * @param srs The Spatial Reference System.
   */
  this.setSRS=function(srs) {
    var bbox=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
    bbox.setAttribute("SRS",srs);
    this.callListeners("srs");
  }

  /**
   * Get the Spacial Reference System from the context document.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    var bbox=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
    srs=bbox.getAttribute("SRS");
    srs = srs ? srs : 'EPSG:4326';
    return srs;
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
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    return win.getAttribute("width");
  }

  /**
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    win.setAttribute("width", width);
    this.callListeners("resize");
  }

  /**
   * Get the Window height.
   * @return height The height of map window from the context document.
   */
  this.getWindowHeight=function() {
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    return win.getAttribute("height");
  }

  /**
   * Set the Window height.
   * @param height The height of map window to set in the context document
   */
  this.setWindowHeight=function(height) {
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    win.setAttribute("height", height);
    this.callListeners("resize");
  }

  /**
   * Returns the width/height of the map window as an array
   */
  this.getWindowSize=function() {
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    return new Array(win.getAttribute("width"), win.getAttribute("height"));
  }

  /**
   * Set the Window width and height in one function call to avoid a resize event in between
   * setting width and height, because that causes checkBbox to be triggered, which adjusts the
   * bbox then when it should not yet be adjusted.
   * Added by VTS for dynamic map window resizing (AutoResize tool)
   * @param size Size of the map window as (width, height) array
   */
  this.setWindowSize=function(size) {
    var width = size[0];
    var height = size[1];
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    win.setAttribute("width", width);
    win.setAttribute("height", height);
    this.callListeners("resize");
  }

  /**
   * Returns the Layer node with the specified name from the list of nodes
   * selected by the nodeSelectXpath from the capabilities doc.
   * @param featureName name of the featureType to look up
   * @return the Layer node with the specified name.
   */
  this.getFeatureNode = function(featureName) {
    return this.doc.selectSingleNode(this.nodeSelectXpath+"[wmc:Name='"+featureName+"']");
  }

  /**
   * Returns the serverUrl for the layer passed in as the feature argument.
   * @param requestName ignored for context docs (only GetMap supported)
   * @param method ignored for context docs (only GET supported)
   * @param feature the Layer node from the context doc
   * @return URL for the GetMap request 
   */
  this.getServerUrl = function(requestName, method, feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
  }

  /**
   * Returns the WMS version for the layer passed in as the feature argument
   * @param feature the Layer node from the context doc
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
   * Method to get a list of queryable layers
   * @return the list with queryable layers
   */
  this.getQueryableLayers = function() {
    var listNodeArray = this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer[attribute::queryable='1']/wmc:Name");
    return listNodeArray;
  }

  /**
   * Method to get a list of all layers in the context doc
   * TBD: merge this with above, passing queryable as an optional boolean param?
   * @return the list with all layers
   */
  this.getAllLayers = function() {
    var listNodeArray = this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer");
    return listNodeArray;
  }

  /**
   * Method to get a layer with the specified name in the context doc
   * @param layerName the layer to be returned
   * @return the list with all layers
   */
  this.getLayer = function(layerName) {
    var layer = this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+layerName+"']");
    //TBD: add in time stamp
    return layer;
  }

  /**
   * Method to add a Layer to the LayerList
   * @param layerNode the Layer node from another context doc or capabiltiies doc
   */
  this.addLayer = function(objRef, layerNode) {
    var parentNode = objRef.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList");
    parentNode.appendChild(layerNode.cloneNode(true));
    objRef.modified = true;
    //objRef.callListeners("refresh");
  }
  this.addFirstListener( "addLayer", this.addLayer, this );


 /**
   * Method to add a Sld to the StyleList
   * @param layerName the Layer name from another context doc or capabiltiies doc
   */
  this.addSLD = function(objRef,sldNode) {
	//  	alert("context addSLD : "+objRef.id);
  	var layerName=sldNode.selectSingleNode("//Name").firstChild.nodeValue; 
   	var parentNode = objRef.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']");
    parentNode.appendChild(sldNode.cloneNode(true));
 
    objRef.modified = true;
  }
  this.addFirstListener( "addSLD", this.addSLD, this );


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
    var extension = this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
    if (!extension) {
      var general = this.doc.selectSingleNode("/wmc:ViewContext/wmc:General");
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
    return this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
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

  // PL -BRGM	  
  /**
   * Change a Layer's opacity
   * @param layerName  The name of the layer that is to be changed
   * @param Opacity     Value of the opacity
   */
  this.setOpacity=function(layerName, Opacity){
    // Set the hidden attribute in the Context
          
    var layer=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+layerName+"']");
    if (layer) layer.setAttribute("opacity", Opacity);
    // Call the listeners
    this.callListeners("opacity", layerName);
  }
  
  /**
   * Get the layer's opacity attribute value.
   * @param layerName  The name of the layer that is to be changed
   * @return hidden  String with the value; 1=hidden, 0=visible.
   */
  this.getOpacity=function(layerName){
    var opacity=1;
    var layer=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+layerName+"']");
    if (layer) opacity = layer.getAttribute("opacity");
    return opacity;
  }
  // PL -END
}

