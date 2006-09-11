/*
Author:       Pat Cappelaere patATcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Render GML into Vector Graphic (SVG or VML depending on browser).  this.targetModel references the context model with
 * width/height attributes.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererVG(widgetNode, model) {
   WidgetBase.apply(this,new Array(widgetNode, model));
   MapContainerBase.apply(this,new Array(widgetNode, model));

  var tipWidget =  widgetNode.selectSingleNode("mb:tipWidget");
  if( tipWidget ) {
    this.model.tipWidgetId = tipWidget.firstChild.nodeValue;
  }
  
  /**
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
  }
  
  /**
   * Wfs response has been received by FeatureCollection
   * We can create the layer
   */
  this.loadEntries = function( objRef ) {
    // both docs have to be loaded
    if( (objRef.model.doc != null) && (objRef.targetModel.doc != null)) {
      //var features = objRef.model.getFeatureNodes();
      //var len = features.length;
      objRef.containerModel.model = objRef.model;
      objRef.containerModel.setParam('addLayer', objRef.model.wfsFeature); 
     
    }
  }
  
  /**
   * Called when FeatureCollection is reloaded somehow
   * This would happen from a WebServiceForm (rather than loadmodel)
   */
  this.loadAndPaintEntries = function( objRef ) {
    if( (objRef.model.doc != null) && (objRef.targetModel.doc != null)) {
      objRef.loadEntries( objRef );
      objRef.targetModel.callListeners("refreshOtherLayers");
    }
  }
  
  this.model.addListener("init",this.gmlRendererVGInit, this);
}

GmlRendererVG.prototype.paint = function(objRef) {
}

GmlRendererVG.prototype.gmlRendererVGInit = function( objRef ) {
  objRef.targetModel.addListener("loadModel", objRef.loadEntries, objRef);
  objRef.targetModel.addListener("bbox", objRef.loadEntries, objRef);
  objRef.model.addListener("loadModel", objRef.loadAndPaintEntries, objRef);
}

