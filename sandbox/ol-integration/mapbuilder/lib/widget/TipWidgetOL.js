/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Manages MapTips on the map. This widget works with models that
 * are linked to a OL vector layer. Models have to fire the
 * 'gmlRendererLayer' event.
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
  this.height = height ? height.firstChild.nodeValue : 200;
  var opacity = widgetNode.selectSingleNode('mb:opacity');
  this.opacity = opacity ? opacity.firstChild.nodeValue : 0.8;
  var backgroundColor = widgetNode.selectSingleNode('mb:backgroundColor');
  this.backgroundColor = backgroundColor ? backgroundColor.firstChild.nodeValue : 'yellow';

  this.control = null;
  
  /**
   * Turns on the maptips when the gmlRendererLayer is fired.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.paint = function(objRef) {
    var layer = objRef.model.getParam('gmlRendererLayer');
    if (objRef.control && !layer) {
      objRef.control.deactivate();
      objRef.control.destroy();
      objRef.control = null;
    } else if (layer ) {
      objRef.control = new OpenLayers.Control.SelectFeature(layer, {
        hover: true,
        onSelect: objRef.onSelect,
        onUnselect: objRef.onUnselect,
        mbTipWidget: objRef
      });
      objRef.targetContext.map.addControl(objRef.control);
      objRef.control.activate();
    }
  }
  this.model.addListener('gmlRendererLayer', this.paint, this);
  
  /**
   * This method is triggered when a user clicks on a feature.
   * It called by OpenLayers event handling in the context
   * of a feature. This means that 'this' in this method refers
   * to an {OpenLayers.Feature}
   * @param evt OpenLayers event
   */
  this.onClick = function(evt) {
    var feature = this;
    var objRef = feature.mbTipWidget;
    objRef.stylesheet.setParameter('fid', feature.fid);
    var lonlat = feature.layer.map.getLonLatFromPixel(evt.xy);
    var popup = new OpenLayers.Popup.AnchoredBubble(
        null, lonlat, new OpenLayers.Size(objRef.width, objRef.height),
        new XMLSerializer().serializeToString(objRef.stylesheet.transformNodeToObject(objRef.model.doc)));
    popup.setOpacity(objRef.opacity);
    popup.setBackgroundColor(objRef.backgroundColor);
    // destroy the bubble onmouseout
    popup.events.register('mouseout', popup, popup.destroy);
    feature.layer.map.addPopup(popup, true);
    // stop the event so other tools will not be triggered
    // when the user clicked on a feature.
    OpenLayers.Event.stop(evt);
  }
  
  /**
   * This method is triggered when the mouse is over a vector
   * feature. It registers a priority event onmousedown, which
   * will call this widget's onClick method in the context
   * of a feature. This way we address two problems with
   * the OpenLayers SelectFeature control:<pre>
   *      - for the info popup, we need the screen coordinates
   *        which we do not get from the handler directly.
   *      - when the active tool changes, something in the
   *        priority of OL event handlers changes, so the
   *        click event on the feature gets lost. By registering
   *        our priority handler and calling Event.stop() in
   *        the target method, we make sure that our event is
   *        handled and no other event handlers are triggered.
   * </pre>
   * @param feature OpenLayers feature
   */
  this.onSelect = function(feature) {
    var objRef = this.mbTipWidget;
    feature.mbTipWidget = objRef;
    feature.layer.events.registerPriority('mousedown', feature, objRef.onClick);
  }
  
  /**
   * This method is triggered when the mouse is moving out
   * of a vector feature. It removes the event handler we
   * registered in this widget's onSelect method.
   * @param feature OpenLayers feature
   */
  this.onUnselect = function(feature) {
    var objRef = this.mbTipWidget;
    feature.layer.events.unregister('mousedown', feature, objRef.onClick);
  }
}
