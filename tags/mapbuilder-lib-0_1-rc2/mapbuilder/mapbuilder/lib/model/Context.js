/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/


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
    var hiddenValue = "0";
    if (hidden) hiddenValue = "1";
      
    var layers=this.doc.documentElement.getElementsByTagName("Layer");
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
  this.extent = new Extent( this );

  //make a copy in the constructor for reset function
  this.originalExtent = new Extent( this );   

  /**
   * Set the Area Of Interest Box and call aoiListeners,
   * note that the end point will be called numerous times as a mouse is dragged.
   * pass in 
   * @param 
   */
  this.setAoi=function(ul, lr) {
    this.ulAoi = ul;
    if (lr) {
      this.lrAoi = lr;
    } else {
      this.lrAoi = ul;    //for point AOI
    }
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


/**
 * Encapsulates all geographic and image size aspects of a context document.
 * All coordinates are handled as points which is a 2 element array, where x is 
 * the first element and y is the second. Coordinates are either pixel and lixel
 * (pl) relative to the top left of the extent or projection XY values (xy). 
 *
 * @constructor
 *
 * @param context       the context document that this extent represents
 *
 * @method GetCenter    returns the XY coordinates of the center of the extent
 * @method GetXY        pass in PL coords and returns projection XY
 * @method GetPL        pass in projection XY and returns PL coords 
 * @method FitToWindow  adjusts the resolution so that it fits 
 * @method CenterAt     reset the extent to be centered at given xy and resolution
 * @method ZoomToBox    reset the extent to given bbox
 * @method SetSize      pass in a resolution and width, height are recalculated
 * @method SetResolution pass in a width, height and res is recalculated
 */

function Extent( context ) {
  this.context = context;
  this.size = new Array();
  this.res = new Array();
  this.zoomBy = 4;

//give some methods for an extent object
	this.GetCenter = getCenter;
	this.GetXY = getXYCoords;
	this.GetPL = getPLCoords;
	this.FitToWindow = fitToWindow;
	this.Reset = reset;
	this.CenterAt = centerAt;
	this.ZoomToBox = zoomToBox;
  this.SetSize = setSize;                 //pass in a resolution and width, height are recalculated
	this.SetResolution = setResolution;     //pass in a width, height and res is recalculated

  this.setAoi = function(ul, lr) {
    if (lr) {
      this.context.setAoi(this.GetPL(ul), this.GetPL(lr));
    } else {
      this.context.setAoi(this.GetPL(ul));
    }
  }

  this.getAoi = function() {
    var plBbox = this.context.getAoi();
    return new Array( this.GetXY(plBbox[0]), this.GetXY(plBbox[1]));
  }

  this.init = function(extent) {
    var bbox = extent.context.getBoundingBox();
    extent.ul = new Array(bbox[0],bbox[3]);
    extent.lr = new Array(bbox[2],bbox[1]);
    extent.SetResolution( new Array(extent.context.getWindowWidth(), extent.context.getWindowHeight() ) );
  }
  context.addListener("loadModel", this.init, this );
}

/**
 * Adjust the width and height to that bbox is displayed at specified resolution
 * @param res   the resolution to be set
 */
//TBD not tested;  update the context doc
function setSize(res) {
	this.res[0] = this.res[1] = res;
	this.size[0] = (this.lr[0] - this.ul[0])/this.res[0];
	this.size[1] = (this.ul[1] - this.lr[1])/this.res[1];
	this.width = Math.ceil(this.size[0]);
	this.height = Math.ceil(this.size[1]);
}

/**
 * Adjust the resolution so the bbox fits in the specified width and height
 * @param size   width, height array passed in
 */
//TBD not tested;  update the context doc
function setResolution(size) {
	this.size[0] = size[0];
	this.size[1] = size[1];
	this.res[0] = (this.lr[0] - this.ul[0])/this.size[0];
	this.res[1] = (this.ul[1] - this.lr[1])/this.size[1];
	this.width = Math.ceil(this.size[0]);
	this.height = Math.ceil(this.size[1]);
}


/**
 * Returns the XY center of this extent
 * @return  array of XY for th center of the extent
 */
function getCenter() {
	return new Array((this.ul[0]+this.lr[0])/2, (this.ul[1]+this.lr[1])/2);
}

/**
 * Returns XY coordinates for given pixel line coords w.r.t. top left corner
 * @param pl   pixel line in extent to calculate
 * @return     point array of XY coordinates
 */
function getXYCoords(pl) {
	var x = this.ul[0]+pl[0]*this.res[0];
	var y = this.ul[1]- pl[1]*this.res[1];
	return new Array(x,y);
}

/**
 * Returns pixel/line coordinates for given XY projection coords
 * @param xy   projection XY coordinate to calculate
 * @return     point array of pxiel/line coordinates w.r.t. top left corner
 */
function getPLCoords(xy) {
	var p = Math.floor( (xy[0]-this.ul[0])/this.res[0] );
	var l = Math.floor( (this.ul[1]-xy[1])/this.res[1] );
	return new Array(p,l);
}

/**
 * Adjust the extent so that it is centered at given XY coordinate with given
 * resolution.  Extent width and height remain fixed.  Optionally check to 
 * ensure that it doesn't go beyond available extent.
 *
 * @param center      projection XY coordinate to center at
 * @param res         resolution to display at
 * @param limitExtent ensure that the extent doesn't go beyond available bbox (TBD: not complete/tested)
 * @return            none
 */
function centerAt(center, newres, limitExtent) {
  var half = new Array(this.size[0]/2, this.size[1]/2);
	this.lr = new Array(center[0]+half[0]*newres, center[1]-half[1]*newres);
	this.ul = new Array(center[0]-half[0]*newres, center[1]+half[1]*newres);
  
  //make sure the request doesn't extend beyond the available context
  //TBD this block not tested
  if ( limitExtent ) {
    var xShift = 0;
    if ( this.lr[0] > ContextExtent.lr[0] ) xShift = ContextExtent.lr[0] - this.lr[0];
    if ( this.ul[0] < ContextExtent.ul[0] ) xShift = ContextExtent.ul[0] - this.ul[0];
    this.lr[0] += xShift;
    this.ul[0] += xShift;

    var yShift = 0;
    if ( this.lr[1] < ContextExtent.lr[1] ) yShift = ContextExtent.lr[1] - this.lr[1];
    if ( this.ul[1] > ContextExtent.ul[1] ) yShift = ContextExtent.ul[1] - this.ul[1];
    this.lr[1] += yShift;
    this.ul[1] += yShift;
  }

  this.context.setBoundingBox( new Array(this.ul[0], this.lr[1], this.lr[0], this.ul[1]) );
	//this.SetResolution(size);
	this.SetSize(newres);
}

/**
 * Adjust the extent to the given bbox.  Resolution is recalculated. 
 * Extent width and height remain fixed.  
 *
 * @param ul      upper left coordinate of bbox in XY projection coords
 * @param lr      lower right coordinate of bbox in XY projection coords
 * @param limitExtent ensure that the extent doesn't go beyond available bbox (TBD: not complete/tested)
 * @return            none
 */
function zoomToBox(ul, lr) {    //pass in xy
  var center = new Array((ul[0]+lr[0])/2, (ul[1]+lr[1])/2);
  newres = Math.max((lr[0] - ul[0])/this.size[0], (ul[1] - lr[1])/this.size[1]);
  this.CenterAt( center, newres );
} 


/**
 * Fit the whole extent in the given sized window.  Starts at given res and zooms
 * out by 2 until it fits, or maxres is reached.
 * TBD: not  complete or tested
 *
 * @param size      size of the window to fit to
 * @param minres    resolution starting point 
 * @param maxres    resolution stopping point
 * @return            none
 */
function fitToWindow(size, minres, maxres) {
	var zoomby = 2;
	this.res[0] = this.res[1] = minres;		//assumes square pixels
	var test =  this.GetPL(this.lr);
	while	( (test[0]>size[0] || test[1]>size[1]) && (this.res[0] < maxres) ) {
		this.res[0] *= zoomby;
		this.res[1] *= zoomby;
		test =  this.GetPL(this.lr);
	}
  //call centerAt with test as res
}

  function reset() {
    //TBD: do something with size?
    var originalExtent = this.context.originalExtent;
    this.CenterAt( originalExtent.GetCenter(), originalExtent.res[0] );
  }

