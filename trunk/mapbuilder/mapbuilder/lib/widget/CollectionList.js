/*
Author:       Cameron Shorter cameronAtshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Tools to build a CollectionList from a Web Map Context.
 * This widget extends WidgetBase.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */

function CollectionList(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  var paramValue = widgetNode.selectSingleNode("targetModel").firstChild.nodeValue;
  this.stylesheet.setParameter("targetModel", paramValue );
}
