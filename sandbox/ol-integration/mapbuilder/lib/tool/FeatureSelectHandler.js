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
  
  this.sourceModels = new Array();
  
  /**
   * Tool Initialisation - Step 1 of 3.
   * This is called when the config finished loading, so we know
   * our context (targetModel).
   * @param objRef This object
   */
  this.configInit = function(objRef) {
    objRef.targetModel.addListener('loadModel', objRef.contextInit, objRef);
  }
  this.model.addListener('init', this.configInit, this)
  
  /**
   * Tool Initialisation - Step 2 of 3.
   * This is called when the context model finished loading, so we
   * know that we have a map available.
   * @param objRef This object
   */
  this.contextInit = function(objRef) {
      objRef.model.addListener('gmlRendererLayer', objRef.init, objRef);
    // Check carefully if we have to init manually. This is the case when
    // the gmlRendererLayer is rendered, but does not know about the
    // FeatureSelectHandler yet.
    if (objRef.targetModel.map && objRef.model.getParam('gmlRendererLayer') && !objRef.control) {
      objRef.init(objRef);
    }
  }
  
  /**
   * Tool Initialisation - Step 3 of 3.
   * Turns on feature select when the gmlRendererLayer event is fired.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.init = function(objRef) {
    // get the source models
    var sourceModel;
    // if we have a mergeModel, take sourceModels from there
    if (objRef.model.CLASS_NAME == 'MergeModel') {
      objRef.sourceModels = objRef.model.models;
    } else {
      // if we hava a plain model, just use it
      objRef.sourceModels.push(objRef.model);
    } 
    for (var i in objRef.sourceModels) {
      objRef.sourceModels[i].addListener('highlightFeature', objRef.highlight, objRef);
      objRef.sourceModels[i].addListener('dehighlightFeature', objRef.dehighlight, objRef);
    }

    // init the control
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
    if (!feature) return;
    var objRef = this.mbFeatureSelectHandler;
    for (var i in objRef.sourceModels) {
      objRef.sourceModels[i].setParam("mouseoverFeature", feature.fid);
    }
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
    if (!feature) return;
    var objRef = this.mbFeatureSelectHandler;
    for (var i in objRef.sourceModels) {
      objRef.sourceModels[i].setParam("mouseoutFeature", feature.fid);
    }
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
    for (var i in objRef.sourceModels) {
      objRef.sourceModels[i].setParam("olFeatureSelect", evt);
    }
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
    var model, feature;
    var layer = objRef.model.getParam('gmlRendererLayer');
    for (var i in objRef.sourceModels) {
      model = objRef.sourceModels[i]
      if (!layer) return;
      if (!fid) {
        fid = model.getParam('highlightFeature');
      }
      feature = layer.getFeatureByFid(fid);
      if (feature && !feature.mbHidden) {
        objRef.control.select(feature);
      }
    }
  }
  
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
    var model, feature;
    var layer = objRef.model.getParam('gmlRendererLayer');
    for (var i in objRef.sourceModels) {
      model = objRef.sourceModels[i];
      if (!layer) return;
      if (!fid) {
        fid = objRef.model.getParam('dehighlightFeature');
      }
      feature = layer.getFeatureByFid(fid);
      if (feature && !feature.mbHidden) {
        objRef.control.unselect(feature);
      }
    }
  }
  
}
