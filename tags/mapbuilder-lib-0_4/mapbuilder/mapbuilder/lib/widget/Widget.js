/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Generic Widget object for widgets where no specialization is required.  
 * This is just an instance of a abstract WidgetBase object.
 * This widget requires a <stylesheet> property in the config file.
 * @constructor
 * @base WidgetBase
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function Widget(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

}
