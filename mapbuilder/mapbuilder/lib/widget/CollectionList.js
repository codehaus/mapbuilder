/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tools to build a CollectionList from a Web Map Context.
 * @constructor
 * @param collectionUrl The CollectionList to show.
 * @param name Variable name referencing this CollectionList object
 * @param node Node from the HTML DOM to insert list HTML into.
 * @requires Sarissa
 * @requires Util
 */
function CollectionList(collection, node) {
  this.collection = collection;
  this.collection.addSelectListener( this.paint );

  if(node == null) {
    node = makeElt("DIV");
    node.style.position = "absolute";
  }
  this.node = node;

  var listConfig = config.doc.selectSingleNode("/MapbuilderConfig/views/CollectionList");
  var stylesheetUrl = config.baseDir + listConfig.selectSingleNode("stylesheet").firstChild.nodeValue;
  this.stylesheet = new XslProcessor(stylesheetUrl);

  /**
   * Create all the layers by rendering them into the current window.
   * This function should be called at startup.
   */
  this.paint=function() {
    var s = this.stylesheet.transformNode(this.collection.doc);
    this.node.innerHTML = s;
   }

}
