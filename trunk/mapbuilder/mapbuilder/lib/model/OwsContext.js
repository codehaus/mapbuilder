/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/Extent.js");

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
 * @requires Sarissa
 * 
 */
function OwsContext(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);

  this.namespace = "xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";

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
    var layers=this.doc.selectNodes("/wmc:OWSContext/wmc:LayerList/wmc:Layer");
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
    var layers=this.doc.selectNodes("/wmc:OWSContext/wmc:LayerList/wmc:Layer");
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
   * Set the BoundingBox and notify intererested widgets that BoundingBox has changed.
   * @param boundingBox array in form (xmin, ymin, xmax, ymax).
   */
  this.setBoundingBox=function(boundingBox) {
    // Set BoundingBox in context
    var lowerLeft=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
    lowerLeft.firstChild.nodeValue = boundingBox[0] + " " + boundingBox[1];
    var upperRight=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
    upperRight.firstChild.nodeValue = boundingBox[2] + " " + boundingBox[3];
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
    var bbox=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
    bbox.setAttribute("crs",srs);
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var bbox=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
    srs=bbox.getAttribute("crs");
    return srs;
  }

  /**
   * Get the Window width.
   * @return width The width of map window (therefore of map layer images).
   */
  this.getWindowWidth=function() {
    //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    width=win.getAttribute("width");
    return width;
  }

  /**
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    win.setAttribute("width", width);
  }

  /**
   * Get the Window height.
   * @return height The height of map window (therefore of map layer images).
   */
  this.getWindowHeight=function() {
    //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    height=win.getAttribute("height");
    return height;
  }

  /**
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
    win.setAttribute("height", height);
  }

  this.getServerUrl = function(feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
  }

  this.getMethod = function(feature) {
    return feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
  }

  /**
   * get the list of source nodes from the parent document
   * @param objRef Pointer to this object.
   */
  this.initDynModelList = function(objRef) {
    var featureList = objRef.mainMapWidget.WebServiceRequest.getFeatureList();
    for (var i=0; i<featureList.length; i++) {
      var feature = featureList[i];
      var featureId = feature.attributes.getNamedItem("id").nodeValue;
      var serverUrl = feature.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
      objRef.mainMapWidget.WebServiceRequest.doRequest('wfs:GetFeature',featureId, serverUrl);
    }
  }
  this.addListener("loadModel", this.initDynModelList, this);

}

