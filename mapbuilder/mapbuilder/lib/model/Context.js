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
 * @param name Variable name referencing this context object
 * @param baseDir Relative path to base directory of Mapbuilder files
 * @param skin Name of skin to use for look and feel
 * @param queryLayer Index of layer in Context document that should be used as query layer for GetFeatureInfo requests
 */
function Context(url, name, baseDir, skin, queryLayer) {

  /**
   * The Web Map Context Document.
   */
  this.context = Sarissa.getDomDocument();
  this.context.async = false;
  // the following two lines are needed for IE
  this.context.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  this.context.setProperty("SelectionLanguage", "XPath");
  this.context.load(url);
  this.name=name;
  this.baseDir=baseDir;
  if(skin==null){
    this.skin="default";
  }
  /**
   * The name of the skin to use, defaults to skin/default .*/
  this.skin=baseDir+"/skin/"+skin+"/";
  this.queryLayer=queryLayer;
  /*
  // Insert unique Ids into each Layer node.
  var layerNodeList=this.context.selectNodes("/ViewContext");
  for (i=0;i<layerNodeList.length;i++){
    layerNodeList[i].setAttribute("id","wmc"+UniqueId.getId());
    alert layerNodeList[i].xml;
  }
  */

  // ===============================
  // Arrays of Listeners
  // ===============================

  /** Functions to call when the boundingBox has changed,
   */
  this.boundingBoxChangeListeners=new Array();
  /** TBD: I think this should be deprecated? Isn't it the same as
    * boundingBoxChangeListeners? Cameron.
    * @deprecated */
  this.bboxChangeListenerTargets=new Array();
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
   */
  this.addBoundingBoxChangeListener=function(listener,target) {
    this.boundingBoxChangeListeners[this.boundingBoxChangeListeners.length]=listener;
    this.bboxChangeListenerTargets[this.bboxChangeListenerTargets.length]=target;
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
      
    layers=this.context.documentElement.getElementsByTagName("Layer");
    for(i=0;i<layers.length;i++) {
      if(layers[i].getElementsByTagName("Name").item(0).firstChild.nodeValue == layerIndex) {
        layers[i].setAttribute("hidden", hiddenValue);
        break;
      }
    }
    // Call the listeners
    for(i=0;i<this.hiddenListeners.length;i++) {
      this.hiddenListeners[i](layerIndex,hidden);
    }
  }

  /**
   * Get the BoundingBox.
   * @return BoundingBox array in form (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function() {
    // Extract BoundingBox from the context
    boundingBox=this.context.documentElement.getElementsByTagName("BoundingBox").item(0);
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
    boundingBox=this.adjustExtent(boundingBox);
    // Set BoundingBox in context
    bbox=this.context.documentElement.getElementsByTagName("BoundingBox").item(0);
    bbox.setAttribute("minx", boundingBox[0]);
    bbox.setAttribute("miny", boundingBox[1]);
    bbox.setAttribute("maxx", boundingBox[2]);
    bbox.setAttribute("maxy", boundingBox[3]);
    // Call the listeners
    for(i=0;i<this.boundingBoxChangeListeners.length;i++) {
      this.boundingBoxChangeListeners[i](this.bboxChangeListenerTargets[i]);
    }
  }

  /**
   * TBD: Deprecated - use getContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @param srs The Spatial Reference System.
   */
  this.setSRS=function(srs) {
    bbox=this.context.documentElement.getElementsByTagName("BoundingBox").item(0);
    bbox.setAttribute("SRS",srs);
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Spacial Reference System for layer display and layer requests.
   * @return srs The Spatial Reference System.
   */
  this.getSRS=function() {
    bbox=this.context.documentElement.getElementsByTagName("BoundingBox").item(0);
    srs=bbox.getAttribute("SRS");
    return srs;
  }

  /**
   * TBD: Deprecated - use getContext() instead.
   * Get the Window width.
   * @return width The width of map window (therefore of map layer images).
   */
  this.getWindowWidth=function() {
    win=this.context.documentElement.getElementsByTagName("Window").item(0);
    width=win.getAttribute("width");
    return width;
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    win=this.context.documentElement.getElementsByTagName("Window").item(0);
    win.setAttribute("width", width);
  }

  /**
   * TBD: Deprecated - use getContext() instead.
   * Get the Window height.
   * @return height The height of map window (therefore of map layer images).
   */
  this.getWindowHeight=function() {
    win=this.context.documentElement.getElementsByTagName("Window").item(0);
    height=win.getAttribute("height");
    return height;
  }

  /**
   * TBD: Deprecated - use setContext() instead.
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    win=this.context.documentElement.getElementsByTagName("Window").item(0);
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
    return this.context;
  }

  // ===============================
  // Move the following
  // ===============================
  /**
   * TBD: Deprecated, This function needs to move into the tools directory, or
   * possibly the util directory. - Cameron.
   * Resize a spatial extent to have the same aspect ratio as a Window.
   * @param ext The fuction to call when the bbox changes.
   * @return ext The adjusted spatial extent, having the same aspect ratio as the Window.
   * @deprecated.
   */
  this.adjustExtent=function(ext) {
    windowWidth=this.getWindowWidth();
    windowHeight=this.getWindowHeight();
    geoWidth = ext[2] - ext[0];
    geoHeight = ext[3] - ext[1];
    if(geoWidth/windowWidth>geoHeight/windowHeight){
      ext[1]=ext[1]-(((geoWidth/windowWidth*windowHeight)-geoHeight)/2);
      ext[3]=ext[3]+(((geoWidth/windowWidth*windowHeight)-geoHeight)/2);
    }
    else{
      ext[0]=ext[0]-(((geoHeight/windowHeight*windowWidth)-geoWidth)/2);
      ext[2]=ext[2]+(((geoHeight/windowHeight*windowWidth)-geoWidth)/2);
    }
    return ext;
  }
}
