/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Manages MapTips on the map. This widget works with models that
 * have a FeatureSelectHandler tool.
 * @base ButtonBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function TipWidgetOL(widgetNode, model) {
   WidgetBaseXSL.apply(this, new Array(widgetNode, model));

  //TBD error checking, or move this to WidgetBase
  this.targetContext = config.objects[widgetNode.selectSingleNode("mb:targetContext").firstChild.nodeValue];
  
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

  /**
   * This method is triggered when a user clicks on a feature.
   * It called by OpenLayers event handling in the context
   * of a feature. This means that 'this' in this method refers
   * to an {OpenLayers.Feature}
   * @param evt OpenLayers event
   */
  this.onClick = function(objRef) {
    var evt = objRef.model.getParam("olFeatureSelect");
    var feature = evt.feature;
    objRef.stylesheet.setParameter('fid', feature.fid);
    var lonlat = feature.layer.map.getLonLatFromPixel(evt.xy);
    var popup = new OpenLayers.Popup.Anchored();
    popup.padding = 0;
    popup.initialize(null, lonlat, new OpenLayers.Size(objRef.width, objRef.height),
        new XMLSerializer().serializeToString(objRef.stylesheet.transformNodeToObject(objRef.model.doc)),
        null, true);
    popup.setOpacity(objRef.opacity);
    popup.setBackgroundColor(objRef.backgroundColor);
    popup.setBorder(objRef.border);
    feature.layer.map.addPopup(popup, true);
    // stop the event so other tools will not be triggered
    // when the user clicked on a feature.
    OpenLayers.Event.stop(evt);
  }
  this.model.addListener("olFeatureSelect", this.onClick, this);
  
}
