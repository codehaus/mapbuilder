/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a Web Map Context (WMC) document as defined by the Open GIS Consortium
 * http://opengis.org and extensions the the WMC.  A unique Id is included for
 * each layer which is used when referencing Dynamic HTML layers in MapPane.
 * Dependancies: Sarissa (XML utilities).
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
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

  // Insert unique Ids into each Layer node.
  /*
  var layerNodeList=this.context.selectNodes("/ViewContext");
  alert("Context 2 length="+layerNodeList.length);
  for (i=0;i<layerNodeList.length;i++){
    alert("Context 3");
    layerNodeList[i].setAttribute("id","wmc"+UniqueId.getId());
    alert layerNodeList[i].xml;
  }
  alert("Context 4");
  */

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
   * Change a Layer's visability.
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
  this.getBoundingBox=function(){
    // TBD: Extract BoundingBox from the context
    return new Array(-18.0,-9.0,18.0,9.0);
  }

  /**
   * Set the BoundingBox.
   * @param boundingBox array in form (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function(boundingBox){
    // TBD: Set BoundingBox in context
    alert("boundingBox="+boundingBox);
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
