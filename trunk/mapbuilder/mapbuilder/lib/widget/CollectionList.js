/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Tools to build a CollectionList from a Web Map Context.
 * This widget extends WidgetBase.
 * @constructor
 * @param widgetNode The Widget's XML object node from the configuration
 *   document.
 * @param group The ModelGroup XML object from the configuration
 *   document that this widget will update.
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

  /**
   * Initialise the widget after the widget tags have been created by the first paint().
   */
  this.postPaintInit = function() {
    this.model.addListener("select", this.paint);
  }
}
