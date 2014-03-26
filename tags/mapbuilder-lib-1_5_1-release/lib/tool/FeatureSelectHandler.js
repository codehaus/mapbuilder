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
 * @constructor
 * @base ToolBase
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
  
  this.clear = function(objRef) {
    if (objRef.control) {
      objRef.map = null;
      objRef.control.destroy();
      objRef.control = null;
    }
    for (var i=0; i<objRef.sourceModels.length; i++) {
      objRef.sourceModels[i].removeListener('highlightFeature', objRef.highlight, objRef);
      objRef.sourceModels[i].removeListener('dehighlightFeature', objRef.dehighlight, objRef);
    }
    objRef.sourceModels = [];
  }
  this.model.addListener("newModel", this.clear, this);

  /**
   * Tool Initialisation - Step 2 of 3.
   * This is called when the context model finished loading, so we
   * know that we have a map available.
   * @param objRef This object
   */
  this.contextInit = function(objRef) {
    objRef.targetModel.addListener("newModel", objRef.clear, objRef);
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
    // clean up from previous runs
    for (var i=objRef.sourceModels.length-1; i>=0; i--) {
      objRef.sourceModels[i].removeListener('highlightFeature', objRef.highlight, objRef);
      objRef.sourceModels[i].removeListener('dehighlightFeature', objRef.dehighlight, objRef);
      objRef.sourceModels.splice(i);
    }
    // if we have mergeModels, take sourceModels from there
    if (objRef.model.mergeModels) {
      objRef.sourceModels = objRef.model.mergeModels;
    } else {
      // if we hava a plain model, just use it
      objRef.sourceModels.push(objRef.model);
    } 
    for (var i=0; i<objRef.sourceModels.length; i++) {
      objRef.sourceModels[i].addListener('highlightFeature', objRef.highlight, objRef);
      objRef.sourceModels[i].addListener('dehighlightFeature', objRef.dehighlight, objRef);
    }
    
    // init the control
    var layer = objRef.model.getParam('gmlRendererLayer');
    if (objRef.map == objRef.targetModel.map &&
        objRef.control && !layer) {
      //objRef.control.deactivate();
      objRef.map.removeControl(objRef.control);
      objRef.control.destroy();
      objRef.control = null;
    } else if (layer) {
      if (!objRef.control) {
        var selectControl = objRef.control = new OpenLayers.Control.SelectFeature(layer, {
          hover: true,
          onSelect: objRef.onSelect,
          onUnselect: objRef.onUnselect,
          mbFeatureSelectHandler: objRef,
          select: function(feature) {
            feature.mbFeatureSelectHandler = this.mbFeatureSelectHandler;
            if (feature.mbSelectStyle) {
              this.selectStyle = feature.mbSelectStyle.createSymbolizer ?
                  feature.mbSelectStyle.createSymbolizer(feature) :
                  feature.mbSelectStyle;
            }
            OpenLayers.Control.SelectFeature.prototype.select.apply(this, arguments);
          }
        });
        objRef.map = objRef.targetModel.map;
        objRef.map.addControl(objRef.control);
        objRef.handlers = {
          // By registering our click handler and using stopSingle, we make sure
          // that our event is handled and no other event handlers are triggered
          click: new OpenLayers.Handler.Click( selectControl, { click: objRef.onClick }, { stopSingle: true } )
         ,hover: new OpenLayers.Handler.Hover( selectControl, { move: objRef.onHover } )
        };
      }
      objRef.control.activate();
    }
  }
  
  /**
   * extension for the OpenLayers.Feature.Vector.destroy method.
   * Will be applied to features touched by this tool.
   */
  var destroyFeature = function() {
    var featureSelectHandler = this.mbFeatureSelectHandler;
    if ( featureSelectHandler ) {
      featureSelectHandler.feature = null;
      featureSelectHandler.handlers.click.deactivate();
      featureSelectHandler.handlers.hover.deactivate();
    }
    this.mbFeatureSelectHandler = null;
    OpenLayers.Feature.Vector.prototype.destroy.apply(this, arguments);
  }

  /**
   * This method is triggered when the mouse is over a vector
   * feature. It activates the click and hover handlers defined
   * in init(), which will call this widget's onClick/onHover
   * method in the context of a feature.
   * @param feature OpenLayers feature
   */
  this.onSelect = function(feature) {
    if (!feature) return;
    var objRef = this.mbFeatureSelectHandler;
    objRef.feature = feature; // set reference to the feature for click and hover
    for (var i=0; i<objRef.sourceModels.length; i++) {
      objRef.sourceModels[i].setParam("mouseoverFeature", feature.fid);
    }
    // check if onSelect was triggered by a mouse event. If not, do not register for
    // mousedown and mousemove events. This is the case when selection was externally
    // triggered by the highlightFeature event
    if (feature.layer.events && !feature.mbNoMouseEvent) {
      feature.destroy = destroyFeature;
      objRef.handlers.click.activate();
      objRef.handlers.hover.activate();
    } else {
      feature.mbNoMouseEvent = null;
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
    var objRef = this.mbFeatureSelectHandler || feature.mbFeatureSelectHandler;
    objRef.feature = null; // set not reference to a feature, thus click and hover handler do nothing
    for (var i=0; i<objRef.sourceModels.length; i++) {
      objRef.sourceModels[i].setParam("mouseoutFeature", feature.fid);
    }
    objRef.model.setParam("olFeatureOut", feature);
    if (feature.layer.events) {
      objRef.handlers.click.deactivate();
      objRef.handlers.hover.deactivate();
    }
  }
  
  /**
   * This method is triggered when a user clicks on a feature.
   * It is called by OpenLayers Click Handler event handling in the context
   * of the control. This means that 'this' in this method refers
   * to an {OpenLayers.Control}. Widgets listening to the
   * olFeatureSelect have access to the event, because setParam
   * is used to set the reference to the event.
   * @param evt OpenLayers event
   */
  this.onClick = function(evt) {
    // pass the feature to the event object
    var selectControl = this;
    var objRef = selectControl.mbFeatureSelectHandler;
    evt.feature = objRef.feature;
    objRef.model.setParam("olFeatureSelect", evt);
  }
  
  /**
   * This method is triggered when the mouse is over a feature.
   * It is called by OpenLayers Hover Handler event handling in the context
   * of the control. This means that 'this' in this method refers
   * to an {OpenLayers.Control}. Widgets listening to the
   * olFeatureHover have access to the event, because setParam
   * is used to set the reference to the event.
   * @param evt OpenLayers event
   */
  this.onHover = function(evt) {
    var selectControl = this;
    var objRef = selectControl.mbFeatureSelectHandler;
    var feature = evt.feature = objRef.feature;
    objRef.model.setParam("olFeatureHover", evt);
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
    for (var i=0; i<objRef.sourceModels.length; i++) {
      model = objRef.sourceModels[i]
      if (!layer) return;
      if (!fid) {
        fid = model.getParam('highlightFeature');
      }
      feature = layer.getFeatureByFid(fid);
      if (feature && !feature.mbHidden) {
        // add a tag to the feature to indicate that it was not selected by mouse action
        feature.mbNoMouseEvent = true;
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
    for (var i=0; i<objRef.sourceModels.length; i++) {
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
