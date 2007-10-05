/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: TipWidgetBase.js 2992 2007-07-17 23:13:11Z ahocevar $
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

  var width = widgetNode.selectSingleNode('mb:width');
  this.width = width ? width.firstChild.nodeValue : 200;
  var height = widgetNode.selectSingleNode('mb:height');
  this.height = height ? height.firstChild.nodeValue : 150;
  var opacity = widgetNode.selectSingleNode('mb:opacity');
  this.opacity = opacity ? opacity.firstChild.nodeValue : 1;
  var backgroundColor = widgetNode.selectSingleNode('mb:backgroundColor');
  this.backgroundColor = backgroundColor ? backgroundColor.firstChild.nodeValue : 'D0D0D0';
  var border = widgetNode.selectSingleNode('mb:border');
  this.border = border ? border.firstChild.nodeValue : '0px';
  
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
