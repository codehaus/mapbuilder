/*
Author:       Mike Adair
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Widget to render a time series of maps from an OGC context document.  Each 
 * map layer is rendered one on top of the other and only the first one is visible.
 * the MovieLoop tool is used to cycle the visibility of the layers.
 * The timstamping is handled as an array, ie the array index is used to select
 * layers.
 * 
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function TimeSeries(widgetNode, model) {
  var base = new MapContainerBase(this,widgetNode,model);

  /**
   * Called when the context's hidden attribute changes.
   * @param layerName The Name of the LayerList/Layer from the Context which
   * has changed.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
  this.hiddenListener=function(objRef, layerName){
    var vis="visible";
    if(objRef.model.getHidden(layerName)=="1") {
      vis="hidden";
    }
    var layerId = objRef.model.id + "_" + objRef.id + "_" + layerName;
    var timestampIndex = objRef.model.getParam("timestamp");
    if (timestampIndex) layerId += "_" + timestampIndex;
    var layer = document.getElementById(layerId);
    if (layer) {
      layer.style.visibility=vis;
    } else {
      alert("error finding layerId:"+layerId);
    }
  }
  this.model.addListener("hidden",this.hiddenListener,this);

  /**
   * Called when the map timestamp is changed so set the layer visiblity.
   * @param objRef This object.
   * @param timestampIndex  The array index for the layer to be displayed. 
   */
  this.timestampListener=function(objRef, timestampIndex){
    var layerName = objRef.model.timestampList.getAttribute("layerName");
    var timestamp = objRef.model.timestampList.childNodes[timestampIndex];
    var vis = (timestamp.getAttribute("current")=="1") ? "visible":"hidden";
    var layerId = objRef.model.id + "_" + objRef.id + "_" + layerName + "_" + timestamp.firstChild.nodeValue;
    var layer = document.getElementById(layerId);
    if (layer) {
      layer.style.visibility=vis;
    } else {
      alert("error finding layerId:"+layerId);
    }
  }
  this.model.addListener("timestamp",this.timestampListener,this);

  /**
   * override of prePaint to set the selected timestamp values as a comma-
   * separated list stylesheet parameter.  
   * @param objRef This object.
   */
  this.prePaint=function(objRef) {
    var timelist = "";
    var timestampList = objRef.model.timestampList;
    if (timestampList) {
      for (var i=objRef.model.getParam("firstFrame"); i<=objRef.model.getParam("lastFrame"); ++i) {
        timelist += timestampList.childNodes[i].firstChild.nodeValue + ",";
      }
      objRef.stylesheet.setParameter("timeList", timelist.substring(0,timelist.length-1));  //remove trailing comma
    }
  }
}
