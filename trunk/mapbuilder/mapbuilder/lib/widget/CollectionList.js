/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tools to build a CollectionList from a Web Map Context.
 * This widget extends WidgetBase.
 * @constructor
 * @param collectionUrl The CollectionList to show.
 * @param name Variable name referencing this CollectionList object
 * @param node Node from the HTML DOM to insert list HTML into.
 * @requires Sarissa
 * @requires Util
 * @see WidgetBase
 */

function CollectionList(widgetNode, group) {
  var base = new WidgetBase(widgetNode, group);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  var paramValue = widgetNode.selectSingleNode("targetWidgetGroup").firstChild.nodeValue;
  this.stylesheet.setParameter("targetId", paramValue );

  this.addListeners = function() {
    this.model.addSelectListener( this.paint );
  }
}

//CollectionList.prototype = new WidgetBase();
//CollectionList.prototype.constructor = CollectionList;
