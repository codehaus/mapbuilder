/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a Web Map Context (WMC) document as defined by the Open GIS Consortium
 * http://opengis.org and extensions the the WMC.  A unique Id is included for
 * each layer which is used when referencing Dynamic HTML layers in MapPane.
 *
 * Listener Parameters used:
 * "aoi" - ((upperLeftX,upperLeftY),(lowerRigthX,lowerRigthY)),
 *
 * @constructor
 * @base ModelBase
 * @author Cameron Shorter
 * @param model       Pointer to the model instance being created
 * @param modelNode   The model's XML object node from the configuration document.
  * 
 */
function Context(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);

  this.namespace = "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";

  // ===============================
  // Update of Context Parameters
  // ===============================

  /**
   * Change a Layer's visibility.
   * @param layerIndex The index of the LayerList/Layer from the Context which
   * has changed.
   * @param hidden, 1=hidden, 0=not hidden.
   */
  this.setHidden=function(layerIndex, hidden){
    // Set the hidden attribute in the Context
    var hiddenValue = "0";
    if (hidden) hiddenValue = "1";
      
    //var layers=this.doc.documentElement.getElementsByTagName("Layer");
    var layers=this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer");
    for(var i=0;i<layers.length;i++) {
      if(layers[i].getElementsByTagName("Name").item(0).firstChild.nodeValue == layerIndex) {
        layers[i].setAttribute("hidden", hiddenValue);
        break;
      }
    }
    // Call the listeners
    this.callListeners("hidden", layerIndex);
  }

  /**
   * Get the layer's visiblity.
   * @param layerIndex The index of the LayerList/Layer from the Context which
   * has changed.
   * @return hidden value, 1=hidden, 0=not hidden.
   */
  this.getHidden=function(layerIndex){
    var hidden=1;
    //layers=this.doc.documentElement.getElementsByTagName("Layer");
    var layers=this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer");
    for(var i=0;i<layers.length;i++) {
      if(layers[i].getElementsByTagName("Name").item(0).firstChild.nodeValue == layerIndex) {
        hidden=layers[i].getAttribute("hidden");
        break;
      }
    }
    return hidden;
  }

  /**
   * Get the BoundingBox.
   * @return BoundingBox array in form (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function() {
    // Extract BoundingBox from the context
    //boundingBox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var boundingBox=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
    bbox = new Array();
    bbox[0]=parseFloat(boundingBox.getAttribute("minx"));
    bbox[1]=parseFloat(boundingBox.getAttribute("miny"));
    bbox[2]=parseFloat(boundingBox.getAttribute("maxx"));
    bbox[3]=parseFloat(boundingBox.getAttribute("maxy"));
    return bbox;
  }

  /**
   * Set the BoundingBox and notify intererested widgets that BoundingBox has changed.
   * @param boundingBox array in form (xmin, ymin, xmax, ymax).
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
    this.callListeners("refresh");
  }

  /**
   * TBD: Deprecated - use getContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @param srs The Spatial Reference System.
   */
  this.setSRS=function(srs) {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var bbox=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
    bbox.setAttribute("SRS",srs);
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var bbox=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
    srs=bbox.getAttribute("SRS");
    return srs;
  }

  /**
   * Get the Window width.
   * @return width The width of map window (therefore of map layer images).
   */
  this.getWindowWidth=function() {
    //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    width=win.getAttribute("width");
    return width;
  }

  /**
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    win.setAttribute("width", width);
  }

  /**
   * Get the Window height.
   * @return height The height of map window (therefore of map layer images).
   */
  this.getWindowHeight=function() {
    //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    height=win.getAttribute("height");
    return height;
  }

  /**
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
    win.setAttribute("height", height);
  }

  this.getServerUrl = function(requestName, method, feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
  }

  //this is the GetMap request version, not context doc version.
  this.getVersion = function(feature) {  
    return feature.selectSingleNode("wmc:Server").getAttribute("version");
  }

  this.getMethod = function(feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
  }

  this.setExtension = function(extensionNode) {
    var extension = this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
    if (!extension) {
      var general = this.doc.selectSingleNode("/wmc:ViewContext/wmc:General");
      extension = general.appendChild(this.doc.createElementNS('http://www.opengis.net/context',"Extension"));
    }
    return extension.appendChild(extensionNode);
  }

  this.getExtension = function() {
    var test = this.doc.selectSingleNode("/wmc:ViewContext/wmc:General");
    return this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
  }

  /**
   * Target model loadModel change listener.  This resets the projection objects
   * if the target model changes.
   * @param tool        Pointer to this ZoomToAoi object.
   */
  this.initTimeExtent = function( objRef ) {
    var mbNS = "http://mapbuilder.sourceforge.net/mapbuilder";
    //only the first one selected is used as the timestamp source
    //var extentNode = objRef.doc.selectSingleNode("//wmc:Layer/wmc:Dimension[@name='time']");
    //TBD: how to deal with multiple time dimensions in one context doc, or caps doc?
    var timeNodes = objRef.doc.selectNodes("//wmc:Dimension[@name='time']");
    for (var i=0; i<timeNodes.length; ++i) {
      var extentNode = timeNodes[i];
      objRef.timestampList = objRef.doc.createElementNS(mbNS,"TimestampList");  //set mb as namespace instead
      var layerName = extentNode.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
      objRef.timestampList.setAttribute("layerName", layerName);
      //alert("found time dimension, extent:"+extentNode.firstChild.nodeValue);
      var times = extentNode.firstChild.nodeValue.split(",");   //comma separated arguments
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
            var timestamp = objRef.doc.createElementNS(mbNS,"Timestamp");
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
          var timestamp = objRef.doc.createElementNS(mbNS,"Timestamp");
          timestamp.appendChild(objRef.doc.createTextNode(times[j]));
          objRef.timestampList.appendChild(timestamp);
        }
      }
     objRef.setExtension(objRef.timestampList);  
    }
  }
  this.addFirstListener( "loadModel", this.initTimeExtent, this );

  this.getCurrentTimestamp = function( layerName ) {
    var extension = this.getExtension();
    var timestamp = extension.selectSingleNode("mb:TimestampList[@layerName='"+layerName+"']/mb:Timestamp[@current='1']");
    return timestamp;
  }
}

