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
 */
function Context(url) {

  /**
   * The Web Map Context Document.
   */
  this.context = Sarissa.getDomDocument();
  this.context.async = false;
  // the following two lines are needed for IE
  this.context.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  this.context.setProperty("SelectionLanguage", "XPath");
  this.context.load(url);

  /*
  // Insert unique Ids into each Layer node.
  var layerNodeList=this.context.selectNodes("/ViewContext");
  for (i=0;i<layerNodeList.length;i++){
    layerNodeList[i].setAttribute("id","wmc"+UniqueId.getId());
    alert layerNodeList[i].xml;
  }
  */

  /** Functions to call when the boundingBox has changed. */
  this.bboxChangeListeners=new Array();
  this.bboxChangeListenerTargets=new Array();

  /**
   * Add a Listener for bbox change.
   * @param listener The fuction to call when the bbox changes.
   */
  this.addBboxChangeListener=function(listener,target) {
    this.bboxChangeListeners[this.bboxChangeListeners.length]=listener;
    this.bboxChangeListenerTargets[this.bboxChangeListenerTargets.length]=target;
  }

  /** Functions to call when the layer's Hidden attribute changes. */
  this.hiddenListeners=new Array();

  /**
   * Add a Listener for Hidden attribute.
   * @param listener The fuction to call when a hidden attribute changes.
   */
  this.addHiddenListener=function(listener) {
    this.hiddenListeners[this.hiddenListeners.length]=listener;
  }

  /**
   * Change a Layer's visibility.
   * @param layerId The LayerList/Layer/Name from the Context which has changed.
   * @param hidden, 1=hidden, 0=not hidden.
   */
  this.setHidden=function(layerId,hidden){
    // TBD: Set the hidden attribute in the Context

    // Call the listeners
    hiddenEvent=new HiddenEvent(layerId,hidden);
    for(i=0;i<this.hiddenListeners.length;i++) {
      this.hiddenListeners[i](hiddenEvent);
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
   * Set the BoundingBox.
   * @param boundingBox array in form (xmin, ymin, xmax, ymax).
   */
  this.setBoundingBox=function(boundingBox) {
    // Set BoundingBox in context
    bbox=this.context.documentElement.getElementsByTagName("BoundingBox").item(0);
    bbox.setAttribute("minx", boundingBox[0]);
    bbox.setAttribute("miny", boundingBox[1]);
    bbox.setAttribute("maxx", boundingBox[2]);
    bbox.setAttribute("maxy", boundingBox[3]);
    // Call the listeners
    for(i=0;i<this.bboxChangeListeners.length;i++) {
      this.bboxChangeListeners[i](this.bboxChangeListenerTargets[i]);
    }
  }

  /**
   * Get the Window SRS.
   * @return srs The Spatial Reference System of the map window.
   */
  this.getSRS=function() {
    bbox=this.context.documentElement.getElementsByTagName("BoundingBox").item(0);
    srs=bbox.getAttribute("SRS");
    return srs;
  }

  /**
   * Get the Window width.
   * @return width The width of map window (therefore of map layer images).
   */
  this.getWindowWidth=function() {
    win=this.context.documentElement.getElementsByTagName("Window").item(0);
    width=win.getAttribute("width");
    return width;
  }

  /**
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    win=this.context.documentElement.getElementsByTagName("Window").item(0);
    win.setAttribute("width", width);
  }

  /**
   * Get the Window height.
   * @return height The height of map window (therefore of map layer images).
   */
  this.getWindowHeight=function() {
    win=this.context.documentElement.getElementsByTagName("Window").item(0);
    height=win.getAttribute("height");
    return height;
  }

  /**
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    win=this.context.documentElement.getElementsByTagName("Window").item(0);
    win.setAttribute("height", height);
  }
  /**
   * Zoom (reset the BoundingBox).
   * @param action What action to take ("in" or "out").
   */
  this.zoom=function(action) {
    percent=10/100;
    var srs = this.getSRS();
    var bbox=this.getBoundingBox();
    geoWidth=parseFloat(bbox[2]-bbox[0]);
    geoHeight=parseFloat(bbox[1]-bbox[3]);
    switch(action){
      case "in":
        bbox[0]=bbox[0]+(geoWidth*percent);
        bbox[2]=bbox[2]-(geoWidth*percent);
        bbox[1]=bbox[1]-(geoHeight*percent);
        bbox[3]=bbox[3]+(geoHeight*percent);
        break;
    }
    this.setBoundingBox(bbox);
//    mapPane.paint();
  }
  /**
   * Pan (reset the BoundingBox) in a specified direction.
   * @param dir The direction to pan in.
   * @param percent Percentage to pan (of Window width).
   */
  this.panDir=function(dir, percent) {
    if(percent == null){
      percent=10;
    }
    percent=percent/100;
    var srs = this.getSRS();
    var bbox=this.getBoundingBox();
    geoWidth=parseFloat(bbox[2]-bbox[0]);
    geoHeight=parseFloat(bbox[1]-bbox[3]);
    switch(dir){
      case "w":
        bbox[0]=(bbox[0])-(geoWidth*percent);
        bbox[2]=(bbox[2])-(geoWidth*percent);
        break;
      default:
        break;
    }
    if(srs == "EPSG:4326") {
      if(bbox[0]<-180) {
        bbox[2]=bbox[2]-(bbox[0]+180);
        bbox[0]=-180;
      }
    }
    this.setBoundingBox(bbox);
//    mapPane.paint();
  }
}

/**
 * The event sent when a Hidden attribute changes.
 * @constructor
 * @param layerId The LayerList/Layer/Name from the Context which has changed.
 * @param hidden, 1=hidden, 0=not hidden.
 */
function HiddenEvent(layerId,hidden){
 /** layer The Layer/Name from the Context which has changed. */
 this.layerId=layerId;
 /** 1=layer hidden, 0=layer not hidden. */
 this.hidden=hidden;
}

/**
 * The event sent when BoundingBox changes.
 * @constructor
 * @param boundingBox The new BoundingBox array in the form (xmin,ymin,xmax,ymax).
 */
function BoundingBoxEvent(boundingBox){
 this.boundingBox=boundingBox;
}
