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
function CollectionList(collection, name, node) {
  this.collection=collection;
  this.name=name;
  if(node==null){
    node=makeElt("DIV");
    node.style.position="absolute";
  }
  this.node=node;
  this.stylesheet = new XslProcessor(this.collection.baseDir+"/widget/collectionList/Collection2List.xsl");
  Sarissa.setXslParameter( this.stylesheet.xslDom, "baseDir", "'"+this.collection.baseDir+"'");
  Sarissa.setXslParameter( this.stylesheet.xslDom, "collection", "'"+this.collection.name+"'");

  /**
   * Create all the layers by rendering them into the current window.
   * This function should be called at startup.
   */
  this.paint=function() {
    // Set the coordinates of the mapImage for the xsl
// These calls disabled here since shouldn't offset
// from absolutely positioned containing div
//    Sarissa.setXslParameter(
//      this.wmcLayer2DhtmlLayer.xslDom,
//      "left",
//      String(getAbsX(this.node)-1));
//    Sarissa.setXslParameter(
//     this.wmcLayer2DhtmlLayer.xslDom,
//      "top",
//      String(getAbsY(this.node)-1));

    // This method not yet functional--likely because XSL is returning incorrect object.

    // result=this.wmcLayer2DhtmlLayer.transformNodeToObject(this.context.context);
    // this.node.appendChild(result.documentElement);

    //  So, in meantime, return string instead...
    var s = this.stylesheet.transformNode(this.collection.doc);
    this.node.innerHTML=s;
   }

}
