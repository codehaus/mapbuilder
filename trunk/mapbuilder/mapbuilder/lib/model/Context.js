/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
loadScript(baseDir+"/model/Extent.js");

/**
 * Stores a Web Map Context (WMC) document as defined by the Open GIS Consortium
 * http://opengis.org and extensions the the WMC.  A unique Id is included for
 * each layer which is used when referencing Dynamic HTML layers in MapPane.
 * Context extends ModelBase, which extends Listener.
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
function Context(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(modelNode, parent);
  for (sProperty in modelBase) { 
    this[sProperty] = modelBase[sProperty]; 
  }

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
    for(var i=0;i<this.listeners["hidden"].length;i++) {
      this.listeners["hidden"][i][0](layerIndex,this.listeners["hidden"][i][1]);
    }
  }

  /**
   * Get the layer's visiblity.
   * @param layerIndex The index of the LayerList/Layer from the Context which
   * has changed.
   * @return hidden value, 1=hidden, 0=not hidden.
   */
  this.getHidden=function(layerIndex){
    var hidden=1;
    layers=this.doc.documentElement.getElementsByTagName("Layer");
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
    this.callListeners("boundingBox");
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
  //this.extent = new Extent( this );

  //make a copy in the constructor for reset function
  //his.originalExtent = new Extent( this );   

  /**
   * Set the end point for an Area Of Interest Box and call aoiListeners,
   * note that the end point will be called numerous times as a mouse is dragged.
   * @param anchorPoint The toPoint of an Aoi as an (x,y) array.
   */
  this.setAoi=function(ul, lr) {
    this.ulAoi = ul;
    this.lrAoi = lr;
    this.aoiValid=true;
    // Call the listeners
    this.callListeners("aoi");
  }

  /** Returns an array of the corner coordinates as (ul, lr)
    * @return        array of point arrays; ul=0, lr=1
    */
  this.getAoi = function() {
    return new Array(this.ulAoi, this.lrAoi);
  }
}
