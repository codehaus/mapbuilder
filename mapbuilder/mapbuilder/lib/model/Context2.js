/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a Web Map Context (WMC) document as defined by the Open GIS Consortium
 * http://opengis.org and extensions the the WMC.  A unique Id is included for
 * each layer which is used when referencing Dynamic HTML layers in MapPane.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @requires Sarissa
 * @param url Url of context document
 * @param id ID referencing this context object
 * @param queryLayer Index of layer in Context document that should be used as query layer for GetFeatureInfo requests
 */
function Context(url) {

  /**
   * The Web Map Context Document.
   */
  this.doc = Sarissa.getDomDocument();
  this.doc.async = false;
  // the following two lines are needed for IE
  this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  this.doc.setProperty("SelectionLanguage", "XPath");
  this.doc.load(url);
  if ( this.doc.parseError < 0 ) alert("error loading document: " + url);
  
  this.id = this.doc.documentElement.attributes.getNamedItem("id").nodeValue;

  // ===============================
  // Arrays of Listeners
  // ===============================

  /** Functions to call when the boundingBox changes. */
  this.boundingBoxChangeListeners=new Array();
  /** Functions to call when the layer's Hidden attribute changes. */
  this.hiddenListeners=new Array();
  /** Functions to call when one of the Context attributes has changed and
   no other listener has been called to notify the change. */
  this.contextListeners=new Array();
  /** Functions to call when the order of layers changes. */
  this.layerOrderListeners=new Array();
  /** Functions to call when a layer is added. */
  this.addLayerListeners=new Array();
  /** Functions to call when a layer is deleted. */
  this.deleteLayerListeners=new Array();
  /** Functions to call when a layer is selected. */
  this.selectLayerListeners=new Array();

  // ===============================
  // Add Listener Functions
  // ===============================
  /**
   * Add a Listener for boundingBox change.
   * @param listener The function to call when the boundingBox changes.
   * @param target The object which owns the listener function.
   */
  this.addBoundingBoxChangeListener=function(listener,target) {
    this.boundingBoxChangeListeners[this.boundingBoxChangeListeners.length]=
      new Array(listener,target);
  }

  /**
   * Add a Listener for Hidden attribute.
   * @param listener The fuction to call when a hidden attribute changes.
   * The listener function should be of the form hiddenListener(layerId).
   */
  this.addHiddenListener=function(listener) {
    this.hiddenListeners[this.hiddenListeners.length]=listener;
  }

  /**
   * Add a Context listener.  This listener is called if the context is replaced,
   * or one of the rarely used parameters which has no listener is updated.
   * The listener function should be of the form contextListener().
   * @param listener The fuction to call when context changes.
   */
  this.addContextListener=function(listener) {
    this.contextListeners[this.contextListeners.length]=listener;
  }

  /**
   * Add a LayerOrder listener.  This listener is called if the order of layers
   * changes.
   * The listener function should be of the form layerOrderListener().
   * @param listener The fuction to call when layerOrder changes.
   */
  this.addLayerOrderListener=function(listener) {
    this.layerOrderListeners[this.layerOrderListeners.length]=listener;
  }

  /**
   * Add a AddLayer listener.  This listener is called if a layer is added.
   * The listener function should be of the form addLayerListener(layerId).
   * @param listener The fuction to call when a layer is added.
   */
  this.addAddLayerListener=function(listener) {
    this.addLayerListeners[this.addLayerListeners.length]=listener;
  }

  /**
   * Add a DeleteLayer listener.  This listener is called if a layer is deleted.
   * The listener function should be of the form deleteLayerListener(layerId).
   * @param listener The fuction to call when a layer is deleted.
   */
  this.addDeleteLayerListener=function(listener) {
    this.deleteLayerListeners[this.deleteLayerListeners.length]=listener;
  }

  /**
   * Add a SelectLayer listener.  This listener is called if a layer is selected.
   * The listener function should be of the form selectLayerListener(layerId).
   * @param listener The fuction to call when a layer is selected.
   */
  this.addSelectLayerListener=function(listener) {
    this.selectLayerListeners[this.selectLayerListeners.length]=listener;
  }

  // ===============================
  // Update Context Parameters
  // ===============================

  /**
   * Change a Layer's visibility.
   * @param layerIndex The index of the LayerList/Layer from the Context which
   * has changed.
   * @param hidden, 1=hidden, 0=not hidden.
   */
  this.setHidden=function(layerIndex, hidden){
    // Set the hidden attribute in the Context
    if(hidden) {
      hiddenValue = "1";
    }
    else {
      hiddenValue = "0";
    }
      
    layers=this.doc.documentElement.getElementsByTagName("Layer");
    for(var i=0;i<layers.length;i++) {
      if(layers[i].getElementsByTagName("Name").item(0).firstChild.nodeValue == layerIndex) {
        layers[i].setAttribute("hidden", hiddenValue);
        break;
      }
    }
    // Call the listeners
    for(var i=0;i<this.hiddenListeners.length;i++) {
      this.hiddenListeners[i](layerIndex,hidden);
    }
  }

  /**
   * Get the BoundingBox.
   * @return BoundingBox array in form (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function() {
    // Extract BoundingBox from the context
    boundingBox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
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
    bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    bbox.setAttribute("minx", boundingBox[0]);
    bbox.setAttribute("miny", boundingBox[1]);
    bbox.setAttribute("maxx", boundingBox[2]);
    bbox.setAttribute("maxy", boundingBox[3]);
    // Call the listeners
    for (var i=0; i<this.boundingBoxChangeListeners.length; i++) {
      this.boundingBoxChangeListeners[i][0](
        this.boundingBoxChangeListeners[i][1]);
    }
  }

  /**
   * TBD: Deprecated - use getContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @param srs The Spatial Reference System.
   */
  this.setSRS=function(srs) {
    bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    bbox.setAttribute("SRS",srs);
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    bbox=this.doc.documentElement.getElementsByTagName("BoundingBox").item(0);
    srs=bbox.getAttribute("SRS");
    return srs;
  }

  /**
   * TBD: Deprecated - use getContext() instead.
   * Get the Window width.
   * @return width The width of map window (therefore of map layer images).
   */
  this.getWindowWidth=function() {
    win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    width=win.getAttribute("width");
    return width;
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    win.setAttribute("width", width);
  }

  /**
   * TBD: Deprecated - use getContext() instead.
   * Get the Window height.
   * @return height The height of map window (therefore of map layer images).
   */
  this.getWindowHeight=function() {
    win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    height=win.getAttribute("height");
    return height;
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    win=this.doc.documentElement.getElementsByTagName("Window").item(0);
    win.setAttribute("height", height);
  }

  /** Insert a new layer.
    * @param layer An XML node which describes the layer.
    * @param zindex The position to insert this layer in the layerList, if set
    * to null this layer will be inserted at the end.
    * @return The identifier string used to reference this layer.
    */
  this.insertLayer=function(layer,zindex){
    //TBD Fill this in.
  }

  /** Delete this layer.
   * @param id The layer identifier.
   */
  this.deleteLayer=function(id){
    //TBD Fill this in.
  }

  /** Move this layer to a new position in the LayerList.
    * @param layer The layer id to move.
    * @param zindex The position to move this layer to in the layerList, if set
    * to null this layer will be inserted at the end.
    */
  this.reorderLayer=function(layer,zindex){
    //TBD Fill this in.
  }

  /** Select this layer for further operations (like a query).
    * @param layer The layer id to select.
    * @param selected Set to true/false.
    */
  this.selectLayer=function(layer,selected){
    //TBD Fill this in.
  }

  /** Set a new Context and notify interested widgets.
    * @param context The new context loaded as an XML node.
    */
  this.setContext=function(context){
    //TBD Fill this in.
  }

  /** Get the context.
    * @return The new context loaded as an XML node.
    */
  this.getContext=function(){
    return this.doc;
  }

//add the extent property
  this.extent = new Extent( this );

//make a copy in the constructor for reset function
  this.originalExtent = new Extent( this );   
  this.reset = function() {
    //TBD: do something with size?
    this.extent.CenterAt( this.originalExtent.GetCenter(), this.originalExtent.res[0] );
  }

  /** Functions to call when the Area Of Interest changes. */
  this.aoiListeners=new Array();

  // ===============================
  // Add Listener Functions
  // ===============================
  /**
   * Add a Listener for AoiBox change.
   * @param listener The function to call when the Area Of Interest changes.
   * @param target The object which owns the listener function.
   */
  this.addAoiListener=function(listener,target) {
    this.aoiListeners[this.aoiListeners.length]=
      new Array(listener,target);
  }

  /**
   * Set the end point for an Area Of Interest Box and call aoiListeners,
   * note that the end point will be called numerous times as a mouse is dragged.
   * @param anchorPoint The toPoint of an Aoi as an (x,y) array.
   */
  this.setAoi=function(ul, lr) {
    this.ulAoi = ul;
    this.lrAoi = lr;
    this.aoiValid=true;
    for (var i=0; i<this.aoiListeners.length; i++) {
      this.aoiListeners[i][0](
        this.aoiListeners[i][1]);
    }
  }

/** Returns an array of the corner coordinates as [ul, lr]
  * @return        array of point arrays; ul=0, lr=1
  */
  this.getAoi = function() {
    return new Array(this.ulAoi, this.lrAoi);
  }


}
