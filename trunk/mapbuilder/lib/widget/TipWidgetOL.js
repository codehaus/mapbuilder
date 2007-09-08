/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/TipWidgetBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Manages MapTips on the map. This widget works with models that
 * have a FeatureSelectHandler tool.
 * @base TipWidgetBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function TipWidgetOL(widgetNode, model) {
  TipWidgetBase.apply(this, new Array(widgetNode, model));

  /**
   * This method is triggered when a user clicks on a feature.
   * @param objRef reference to this widget
   */
  this.onClick = function(objRef) {
    var evt = objRef.model.getParam("olFeatureSelect");
    var popup = objRef.createPopup(objRef, evt, false);
    evt.feature.layer.mbClickPopup = popup;
  }
  
  /**
   * This method is triggered when the mouse is over a feature.
   * @param objRef reference to this widget
   */
  this.onMouseover = function(objRef) {
    var evt = objRef.model.getParam("olFeatureHover");
    // only create popup if there is no visible click popup
    if (!evt.feature.layer.mbClickPopup || !evt.feature.layer.mbClickPopup.visible()) {
      var popup = objRef.createPopup(objRef, evt, true);
      evt.feature.layer.mbHoverPopup = popup;
      // if the olFeatureOut event gets lost (eg during drag operation),
      // registering this additional event will help to get rid of the
      // popup quickly
      popup.events.register('mouseover', popup, popup.hide);
    }
  }
  
  /**
   * This method is triggered when the mouse moves out of a feature.
   * @param objRef reference to this widget
   */
  this.onMouseout = function(objRef) {
    var feature = objRef.model.getParam("olFeatureOut");
    if (feature.layer.mbHoverPopup) {
      feature.layer.mbHoverPopup.destroy();
      feature.layer.mbHoverPopup = null;
    }
  }
  
  /**
   * Creates a popup.
   * @param objRef reference to this widget
   * @param evt OpenLayers.Event that triggered the popup action
   * @param hover true if the popup should be styled as a hover popup,
   * false if it is a click popup.
   * @return reference to the created popup
   */
  this.createPopup = function(objRef, evt, hover) {
    var feature = evt.feature;
    // check if there is a source model linked with this feature
    var sourceNode = objRef.model.doc.selectSingleNode("//*[@fid='"+feature.fid+"']");
    var sourceModel = null;
    if (sourceNode) {
      sourceModel = sourceNode.getAttribute('sourceModel');
    }
    // if so, use the config from the source model
    var widgetConfig = null;
    if (sourceModel && config.objects[sourceModel].config && config.objects[sourceModel].config[objRef.id]) {
      widgetConfig = config.objects[sourceModel].config[objRef.id];
    } else {
      widgetConfig = objRef.config;
    }
    widgetConfig.stylesheet.setParameter('fid', feature.fid);
    var lonlat = feature.layer.map.getLonLatFromPixel(evt.xy);
    var popup = new OpenLayers.Popup.Anchored();
    
    popup.padding = 0;
    popup.initialize(null, lonlat, new OpenLayers.Size(widgetConfig.width, widgetConfig.height),
        new XMLSerializer().serializeToString(widgetConfig.stylesheet.transformNodeToObject(widgetConfig.model.doc)).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&"),
        null, hover == false);
    popup.setOpacity(widgetConfig.opacity);
    popup.setBackgroundColor(widgetConfig.backgroundColor);
    popup.setBorder(widgetConfig.border);
    var quadrant = feature.layer.map.getExtent().determineQuadrant(lonlat);
    var lonOffset = quadrant.charAt(1) == 'r' ? -5 : 5;
    var latOffset = quadrant.charAt(0) == 't' ? 5 : -5;
    popup.anchor = { size: new OpenLayers.Size(0,0), offset: new OpenLayers.Pixel(lonOffset, latOffset)};    
 
    feature.layer.map.addPopup(popup, true);
    return popup;
  }
  
}
