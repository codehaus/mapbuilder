/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Stores a Web Map Context (WMC) Collection document as defined by the Open 
 * GIS Consortium http://opengis.org and extensions the the WMC.  
 * @constructor
 * @author Mike Adair
 * @requires Sarissa
 * @param url Url of context collection document
 * @param name Variable name referencing this context collection object
 * @param baseDir Relative path to base directory of Mapbuilder files
 * @param skin Name of skin to use for look and feel
 */
function Collection(url, name, baseDir, skin) {

  /**
   * The Web Map Context Collection Document.
   */
  this.doc = Sarissa.getDomDocument();
  this.doc.async = false;
  // the following two lines are needed for IE
  this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  this.doc.setProperty("SelectionLanguage", "XPath");
  this.doc.load(url);
  this.name=name;
  this.baseDir=baseDir;
  if (skin) {
    this.skin = skin;
  } else {
    this.skin="default";
  }
  /**
   * The name of the skin to use, defaults to skin/default .*/
  this.skin=baseDir+"/skin/"+this.skin+"/";

  // ===============================
  // Arrays of Listeners
  // ===============================

  /** Functions to call when the list of contexts is modified
   */
  this.collectionListeners = new Array();
  /** Functions to call when the order of contexts changes. */
  this.coontextOrderListeners = new Array();
  /** Functions to call when a context is selected. */
  this.selectContextListeners = new Array();

  // ===============================
  // Add Listener Functions
  // ===============================
  /**
   * Add a Collection listener.  This listener is called if the Collection is replaced,
   * or one of the rarely used parameters which has no listener is updated.
   * The listener function should be of the form collectionListener().
   * @param listener The fuction to call when Collection changes.
   */
  this.addCollectionListener=function(listener) {
    this.collectionListeners[this.collectionListeners.length]=listener;
  }

  /**
   * Add a ContextOrder listener.  This listener is called if the order of layers
   * changes.
   * The listener function should be of the form layerOrderListener().
   * @param listener The fuction to call when layerOrder changes.
   */
  this.addOrderListener=function(listener) {
    this.contextOrderListeners[this.contextOrderListeners.length]=listener;
  }

  /**
   * Add a SelectLayer listener.  This listener is called if a layer is selected.
   * The listener function should be of the form selectLayerListener(layerId).
   * @param listener The fuction to call when a layer is selected.
   */
  this.addSelectListener=function(listener) {
    this.selectContextListeners[this.selectContextListeners.length]=listener;
  }

  // ===============================
  // Update Collection Parameters
  // ===============================

  /**
   * Get the BoundingBox.
   * @return BoundingBox array in form (xmin,ymin,xmax,ymax).
   */
  this.getContextUrl = function( contextId ) {
    bbox=this.context.documentElement.getElementsByTagName("BoundingBox").item(0);
    srs=bbox.getAttribute("SRS");
    return bbox;
  }

  /** Insert a new context.
    * @param context An XML node which describes the context.
    * @param zindex The position to insert this context in the contextList, if set
    * to null this context will be inserted at the end.
    * @return The identifier string used to reference this context.
    */
  this.insertcontext=function(context,zindex){
    //TBD Fill this in.
  }

  /** Delete this context.
   * @param id The context identifier.
   */
  this.deletecontext=function(id){
    //TBD Fill this in.
  }

  /** Move this context to a new position in the contextList.
    * @param context The context id to move.
    * @param zindex The position to move this context to in the contextList, if set
    * to null this context will be inserted at the end.
    */
  this.reordercontext=function(context,zindex){
    //TBD Fill this in.
  }

  /** Select this context for further operations (like a query).
    * @param context The context id to select.
    * @param selected Set to true/false.
    */
  this.selectcontext=function(context,selected){
    //TBD Fill this in.
  }

}
