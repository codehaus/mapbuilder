/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/TipWidgetBase.js");

/**
 * Configuration for TipWidgetOL and similar widgets.
 * @base TipWidgetBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The FeatureCollection model.
 */
function TipWidgetConfig(widgetNode, model) {
  TipWidgetBase.apply(this, new Array(widgetNode, model));
  
  var targetWidget = this.getProperty('mb:targetWidget');
  
  this.init = function(objRef) {
    if (targetWidget) {
      if (!model.config) {
        model.config = new Array();
      }
      model.config[targetWidget] = objRef.config;
    }
  }
  model.addListener('init', this.init, this);
}
