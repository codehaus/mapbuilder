/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
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
 * This tool also fires "mouseoverFeature" and "mouseoutFeature"
 * events, setting the fid of the feature below the mouse cursor
 * as param of the model.
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param toolNode The tool node from the config XML file.
 * @param model The model containing this tool.
 */
function FeatureSelectHandler(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));
   
  /**
   * Map for this FeatureSelectHandler. We keep a reference
   * to the map we created the control for, to prevent ourselves
   * from removing the control from a map that does not exist
   * anymore.
   */
  this.map = null;
  
  /**
   * Turns on feature select when the gmlRendererLayer is fired.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.init = function(objRef) {
    if (objRef.targetModel.map) {
      var layer = objRef.model.getParam('gmlRendererLayer');
      if (objRef.map == objRef.targetModel.map &&
          objRef.control && !layer) {
        objRef.control.deactivate();
        objRef.control.destroy();
        objRef.control = null;
      } else if (layer) {
        objRef.control = new OpenLayers.Control.SelectFeature(layer, {
          hover: true,
          onSelect: objRef.onSelect,
          onUnselect: objRef.onUnselect,
          mbFeatureSelectHandler: objRef,
          select: function(feature) {
            if (feature.mbSelectStyle) {
              this.selectStyle = feature.mbSelectStyle;
            }
            OpenLayers.Control.SelectFeature.prototype.select.apply(this, arguments);
          }
        });
        objRef.map = objRef.targetModel.map;
        objRef.map.addControl(objRef.control);
        objRef.control.activate();
      }
    }
  }
  
  /**
   * This is called when the config finished loading, so we know
   * our context (targetModel).
   * @param objRef This object
   */
  this.configInit = function(objRef) {
    objRef.targetModel.addListener('loadModel', objRef.contextInit, objRef);
  }
  this.model.addListener('init', this.configInit, this)
  
  /**
   * This is called when the context model finished loading, so we
   * know that we have a map available.
   * @param objRef This object
   */
  this.contextInit = function(objRef) {
    objRef.targetModel.removeListener('loadModel', objRef.contextInit, objRef);
    objRef.model.addListener('gmlRendererLayer', objRef.init, objRef);
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
    var objRef = this.mbFeatureSelectHandler;
    objRef.model.setParam("mouseoverFeature", feature.fid);
    feature.mbFeatureSelectHandler = objRef;
    if (feature.layer.events) {
      feature.layer.events.registerPriority('mousedown', feature, objRef.onClick);
    }
  }
  
  /**
   * This method is triggered when the mouse is moving out
   * of a vector feature. It removes the event handler we
   * registered in this widget's onSelect method.
   * @param feature OpenLayers feature
   */
  this.onUnselect = function(feature) {
    var objRef = this.mbFeatureSelectHandler;
    objRef.model.setParam("mouseoutFeature", feature.fid);
    if (feature.layer.events) {
      feature.layer.events.unregister('mousedown', feature, objRef.onClick);
    }
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
    var objRef = this.mbFeatureSelectHandler;
    objRef.model.setParam("olFeatureSelect", evt);
    OpenLayers.Event.stop(evt);
  }

  /**
   * Highlights the specified feature. This method is usually
   * triggered by setting the 'highlightFeature' param to the
   * fid of a feature to be highlighted.
   * @param objRef reference to this tool object
   * @param fid GML feature id of the feature to highlight. If
   * not specified, this is taken from the highlightFeature
   * model param.
   */
  this.highlight = function(objRef, fid) {
    if (!fid) {
      fid = objRef.model.getParam('highlightFeature');
    }
    var feature = objRef.model.getParam('gmlRendererLayer').getFeatureByFid(fid);
    if (feature && !feature.mbHidden) {
      objRef.control.select(feature);
    }
  }
  this.model.addListener('highlightFeature', this.highlight, this);
  
  /**
   * Dehighlights the specified feature. This method is usually
   * triggered by setting the 'dehighlightFeature' param to the
   * fid of a feature to be highlighted.
   * @param objRef reference to this tool object
   * @param fid GML feature id of the feature to highlight. If
   * not specified, this is taken from the dehighlightFeature
   * model param.
   */
  this.dehighlight = function(objRef, fid) {
    if (!fid) {
      fid = objRef.model.getParam('dehighlightFeature');
    }
    var feature = objRef.model.getParam('gmlRendererLayer').getFeatureByFid(fid);
    if (feature && !feature.mbHidden) {
      objRef.control.unselect(feature);
    }
  }
  this.model.addListener('dehighlightFeature', this.dehighlight, this);
  
}
