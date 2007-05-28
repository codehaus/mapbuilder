/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureSelectHandler.js 2815 2007-05-22 12:44:49Z ahocevar $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Manages mouseover and clicks on vector features in the map.
 * This tool works with models that are linked to a OL vector layer,
 * using eg. the GmlRendererOL widget. Models have to fire the
 * 'gmlRendererLayer' event, which will activate the tool for the
 * layer.
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param toolNode The tool node from the config XML file.
 * @param model The model containing this tool.
 */
function FeatureSelectHandler(toolNode, model) {
   ToolBase.apply(this, new Array(toolNode, model));

  //TBD error checking, or move this to ToolBase
  this.targetContext = config.objects[toolNode.selectSingleNode("mb:targetContext").firstChild.nodeValue];

  /**
   * Turns on the maptips when the gmlRendererLayer is fired.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.init = function(objRef) {
    var layer = objRef.model.getParam('gmlRendererLayer');
    if (objRef.control && !layer) {
      objRef.control.deactivate();
      objRef.control.destroy();
      objRef.control = null;
    } else if (layer) {
      objRef.control = new OpenLayers.Control.SelectFeature(layer, {
        hover: true,
        onSelect: objRef.onSelect,
        onUnselect: objRef.onUnselect,
        mbFeatureSelect: objRef
      });
      objRef.targetContext.map.addControl(objRef.control);
      objRef.control.activate();
    }
  }
  this.model.addListener('gmlRendererLayer', this.init, this);
  
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
    var objRef = this.mbFeatureSelect;
    feature.mbFeatureSelect = objRef;
    feature.layer.events.registerPriority('mousedown', feature, objRef.onClick);
  }
  
  /**
   * This method is triggered when the mouse is moving out
   * of a vector feature. It removes the event handler we
   * registered in this widget's onSelect method.
   * @param feature OpenLayers feature
   */
  this.onUnselect = function(feature) {
    var objRef = this.mbFeatureSelect;
    feature.layer.events.unregister('mousedown', feature, objRef.onClick);
  }
  
  /**
   * This method is triggered when a user clicks on a feature.
   * It is called by OpenLayers event handling in the context
   * of a feature. This means that 'this' in this method refers
   * to an {OpenLayers.Feature}. Widgets listening to the
   * olFeatureSelect have access to the event, because setParam
   * is used to set the reference to the event.
   * @param evt OpenLayers event
   */
  this.onClick = function(evt) {
    // pass the feature to the event object
    evt.feature = this;
    var objRef = this.mbFeatureSelect;
    objRef.model.setParam("olFeatureSelect", evt);
    OpenLayers.Event.stop(evt);
  }

  /**
   * Highlights the specified feature.
   * @param objRef reference to this tool object
   * @param fid GML feature id of the feature to highlight
   */
  this.highlight = function(objRef, fid) {
    var feature = objRef.getFeatureByFid(objRef, fid);
    objRef.control.select(feature);
  }
  
  /**
   * Dehighlights the specified feature.
   * @param objRef reference to this tool object
   * @param fid GML feature id of the feature to highlight
   */
  this.dehighlight = function(objRef, fid) {
    var feature = objRef.getFeatureByFid(objRef, fid);
    objRef.control.unselect(feature);
  }
  
  /**
   * gets a feature from the gmlRendererLayer by GML feature id.
   * @param objRef reference to this tool object
   * @param fid GML feature id of the feature
   * @return feature OpenLayers feature matching fid
   */
  this.getFeatureByFid = function(objRef, fid) {
    var layer = objRef.model.getParam('gmlRendererLayer');
    if (!layer) {
      return null;
    }
    var features = layer.features;
    for (var i = 0; i < features.length; ++i) {
      if (features[i].fid = fid) {
        return features[i];
      }
    }
  }
}
