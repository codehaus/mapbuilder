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
 * Context extends ModelBase, which extends Listener.
 *
 * Listener Parameters used:
 * "aoi" - ((upperLeftX,upperLeftY),(lowerRigthX,lowerRigthY)),
 *
 * @constructor
 * @author Cameron Shorter
 * @requires Sarissa
 * @param url Url of context document
 * @param id ID referencing this context object
 * @param queryLayer Index of layer in Context document that should be used as
 *   query layer for GetFeatureInfo requests
 * @see ModelBase
 * @see Listener
 */
function Context(modelNode) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(modelNode);
  for (sProperty in modelBase) { 
    this[sProperty] = modelBase[sProperty]; 
  }

  this.namespace = "xmlns:cml='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";

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
    var layers=this.doc.selectNodes("/cml:ViewContext/cml:LayerList/cml:Layer");
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
    var layers=this.doc.selectNodes("/cml:ViewContext/cml:LayerList/cml:Layer");
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
    var boundingBox=this.doc.selectSingleNode("/cml:ViewContext/cml:General/cml:BoundingBox");
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
    var bbox=this.doc.selectSingleNode("/cml:ViewContext/cml:General/cml:BoundingBox");
    bbox.setAttribute("minx", boundingBox[0]);
    bbox.setAttribute("miny", boundingBox[1]);
    bbox.setAttribute("maxx", boundingBox[2]);
    bbox.setAttribute("maxy", boundingBox[3]);
    // Call the listeners
    this.callListeners("boundingBox");
  }

  /**
   * TBD: Deprecated - use getContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @param srs The Spatial Reference System.
   */
  this.setSRS=function(srs) {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var bbox=this.doc.selectSingleNode("/cml:ViewContext/cml:General/cml:BoundingBox");
    bbox.setAttribute("SRS",srs);
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    //bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    var bbox=this.doc.selectSingleNode("/cml:ViewContext/cml:General/cml:BoundingBox");
    srs=bbox.getAttribute("SRS");
    return srs;
  }

  /**
   * Get the Window width.
   * @return width The width of map window (therefore of map layer images).
   */
  this.getWindowWidth=function() {
    //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/cml:ViewContext/cml:General/cml:Window");
    width=win.getAttribute("width");
    return width;
  }

  /**
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/cml:ViewContext/cml:General/cml:Window");
    win.setAttribute("width", width);
  }

  /**
   * Get the Window height.
   * @return height The height of map window (therefore of map layer images).
   */
  this.getWindowHeight=function() {
    //var win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/cml:ViewContext/cml:General/cml:Window");
    height=win.getAttribute("height");
    return height;
  }

  /**
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    //win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    var win=this.doc.selectSingleNode("/cml:ViewContext/cml:General/cml:Window");
    win.setAttribute("height", height);
  }

  this.prepareFeatures = function(objRef) {
    var featureList = objRef.doc.selectNodes("/cml:ViewContext/cml:ResourceList/cml:FeatureType[cml:Server/@service='OGC:WFS']");
    for (var i=0; i<featureList.length; i++) {
      var feature = featureList[i];
      var serverUrl = feature.selectSingleNode("cml:Server/cml:OnlineResource").getAttribute("xlink:href");
      var version = feature.selectSingleNode("cml:Server").getAttribute("version");
      var firstJoin = serverUrl.indexOf("?")<0 ? "?" : "&";
      var featureType = feature.selectSingleNode("Name");
      var describeFeatureUrl = serverUrl + firstJoin + version + "&REQUEST=DESCRIBEFEATURETYPE" + "&SERVICE=WFS" + "&TYPENAME=" + featureType;

      var configModelNode = config.doc.selectSingleNode("//models/DescribeFeatureType");
      var model = new DescribeFeatureType(configModelNode);
      var modelId = "1234"
      if ( model ) {
        alert("model created");
        config[modelId] = model;
        config.loadModel( modelId, describeFeatureUrl );
        alert("retrieved:"+config[modelId].doc.xml);
      } else { 
        alert("error creating DescribeFeatureType model object");
      }
    }
  }
  //this.addListener("loadModel",this.prepareFeatures, this);
  

}

