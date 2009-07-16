/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Base class for TipWidgetOL and similar widgets.
 * @base WidgetBaseXSL
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The FeatureCollection model.
 */
function TipWidgetBase(widgetNode, model) {
  WidgetBaseXSL.apply(this, new Array(widgetNode, model));

  this.width = this.getProperty('mb:width', 200);
  this.height = this.getProperty('mb:height', 150);
  this.opacity = this.getProperty('mb:opacity', 1);
  this.backgroundColor = this.getProperty('mb:backgroundColor', 'D0D0D0');
  this.border = this.getProperty('mb:border', '0px');
  
  // store all relevant config properties in an object for handling
  // different widget configurations in a MergeModel
  this.config = new Object({
        model: model,
        stylesheet: this.stylesheet,
        width: this.width,
        height: this.height,
        opacity: this.opacity,
        backgroundColor: this.backgroundColor,
        border: this.border
  });
}
