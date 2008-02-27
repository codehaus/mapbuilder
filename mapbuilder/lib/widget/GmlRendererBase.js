/*
Author:       Andreas Hocevar andreas.hocevarATgmail.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Render GML into HTML.
 * this.targetModel references the context model for the map
 * where the content of this widget should be rendered to.
 * If the model doc is not wfs compliant, a stylesheet
 * property has to be set for this widget. The xsl file
 * referenced in this property transforms the model doc to
 * a wfs FeatureCollection.
 * @constructor
 * @base WidgetBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererBase(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
  
  // set the feature srs.
  /** SRS of the features that this widget will render */
  this.featureSRS = this.getProperty('mb:featureSRS');
  
  // set the hover cursor.
  /** css cursor when hovering over features */
  this.hoverCursorNode = this.getProperty('mb:hoverCursor', 'pointer');

  /** model holding the sld for feature styles of this widget */
  this.sldModelNode = widgetNode.selectSingleNode('mb:sldModel');

  // set the default style.
  /** sld node within the sld model that is used for default styling */
  this.defaultStyle = this.getProperty('mb:defaultStyleName', 'default');
  
  // set the select style
  /** sld node within the sld model that is used when a feature is hovered */
  this.selectStyle = this.getProperty('mb:selectStyleName', 'selected');

  /**
   * config object holding all configurations that might be different
   * among source models (if a MergeModel with multiple GmlRendererConfig
   * widgets is used).
   */
  this.config = new Object({
        model: model,
        hoverCursor: this.hoverCursor,
        sldModelNode: this.sldModelNode,
        defaultStyleName: this.defaultStyleName,
        selectStyleName: this.selectStyleName,
        featureSRS: this.featureSRS
  });
}
