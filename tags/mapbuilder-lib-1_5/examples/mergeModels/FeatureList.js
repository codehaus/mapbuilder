/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Custom, read-only version of the FeatureList widget.
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @base WidgetBaseXSL
 * @param widgetNode config node for this widget
 * @param model parent model for this widget
 */
function FeatureList(widgetNode, model) {
  WidgetBaseXSL.apply(this, arguments);

  /**
   * Listener function to highlight a list item when the mouse enters a
   * feature on the map.
   * @param objRef reference to this widget
   */
  this.highlightFeature = function(objRef) {
    var fid = objRef.model.getParam("mouseoverFeature");
    var highlightNode = document.getElementById(objRef.id+'_'+fid)
    if (fid && highlightNode) {
      highlightNode.className = 'listitem_active';
    }
  }
  model.addListener("mouseoverFeature", this.highlightFeature, this);
  
  /**
   * Listener function to dehighlight a list item when the mouse leaves a
   * feature on the map.
   * @param objRef reference to this widget
   */
  this.dehighlightFeature = function(objRef) {
    var fid = objRef.model.getParam("mouseoutFeature");
    var highlightNode = document.getElementById(objRef.id+'_'+fid)
    if (fid && highlightNode) {
      document.getElementById(objRef.id+'_'+fid).className = 'listitem';
    }
  }
  model.addListener("mouseoutFeature", this.dehighlightFeature, this);
  
  /**
   * Widget function to highlight the list item and call the listener that
   * will highlight the feature in the map.
   * @param div DOM node in the widget output that displays the feature
   * @param fid feature id of the feature
   */
  this.highlight = function(div, fid) {
    div.className="listitem_active";
    model.setParam("highlightFeature", fid);
  }
  
  /**
   * Widget function to dehighlight the list item and call the listener that
   * will hdeighlight the feature in the map.
   * @param div DOM node in the widget output that displays the feature
   * @param fid feature id of the feature
   */
  this.dehighlight = function(div, fid) {
    div.className="listitem";
    model.setParam("dehighlightFeature", fid);
  }
}