/*
Author:       Cameron Shorter cameronATshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/Proj.js");

/**
 * Render GML point geometry into HTML.
 * Other Geometries could be handled if there was some way to get a point 
 * out of it (e.g. polygon centroid).
 * This widget places an image at the specified point on the map.
 * It also places a highlight image at the same spot and registers a 
 * hihglightFeature event on the model, where the featureId is set as the model param.
 * Models using this widget must implement getFeatureNodes(), 
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlPointRenderer(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  this.normalImage = widgetNode.selectSingleNode("mb:normalImage").firstChild.nodeValue; 
  this.highlightImage = widgetNode.selectSingleNode("mb:highlightImage").firstChild.nodeValue; 
  var xOffsetNode = widgetNode.selectSingleNode("mb:xOffset");
  this.xOffset = xOffsetNode ? parseInt(xOffsetNode.firstChild.nodeValue) : 0;
  var yOffsetNode = widgetNode.selectSingleNode("mb:yOffset");
  this.yOffset = yOffsetNode ? parseInt(yOffsetNode.firstChild.nodeValue) : 0;

  this.model.addListener("refresh",this.paint, this); 

  /** highlights the selected feature by switching to the highlight image
    * @param objRef a pointer to this widget object
    */
  this.highlight = function(objRef, featureId) {
    var normalImageDiv = document.getElementById(featureId+"_normal");
    normalImageDiv.style.visibility = "hidden";
    var highlightImageDiv = document.getElementById(featureId+"_highlight");
    highlightImageDiv.style.visibility = "visible";
  }
  this.model.addListener("highlightFeature",this.highlight, this);

  /** highlights the selected feature by switching to the highlight image
    * @param objRef a pointer to this widget object
    */
  this.dehighlight = function(objRef, featureId) {
    var normalImageDiv = document.getElementById(featureId+"_normal");
    normalImageDiv.style.visibility = "visible";
    var highlightImageDiv = document.getElementById(featureId+"_highlight");
    highlightImageDiv.style.visibility = "hidden";
  }
  
  /** Clears all the divs
    *
    */
  this.clearFeatures = function() {
  
    var features = this.model.getFeatureNodes();
    for (var i=0; i<features.length; ++i) {
        var feature = features[i];
        var itemId = this.model.getFeatureId(feature);   //or feature id's for feature collections?
        var normalImageDiv = document.getElementById(itemId+"_normal");
        var highlightImageDiv = document.getElementById(itemId+"_highlight");
        
        if( normalImageDiv )
          this.node.firstChild.removeChild( normalImageDiv );
          
        if( highlightImageDiv)
          this.node.firstChild.removeChild( highlightImageDiv );
    }
    
  }
  
  this.model.addListener("dehighlightFeature",this.dehighlight, this);

}

 
  
  /** draw the points by putting the image at the point
    * @param objRef a pointer to this widget object
    */
  GmlPointRenderer.prototype.paint = function(objRef) {
   
    if (objRef.targetModel.doc && objRef.node && objRef.node.firstChild) {
      var proj = new Proj(objRef.targetModel.getSRS());
      
      objRef.clearFeatures();
      
      var features = objRef.model.getFeatureNodes();
      for (var i=0; i<features.length; ++i) {
        var feature = features[i];
        var title = objRef.model.getFeatureName(feature);
        var itemId = objRef.model.getFeatureId(feature);   //or feature id's for feature collections?
        var point = objRef.model.getFeaturePoint(feature);
        var pt = new PT(point[0], point[1]);
        cs_transform(new CS(csList.EPSG4326), proj, pt);
        var pixel = objRef.targetModel.map.getPixelFromLonLat(new OpenLayers.LonLat(pt.x, pt.y));

        var normalImageDiv = document.getElementById(itemId+"_normal");
        var highlightImageDiv = document.getElementById(itemId+"_highlight");
        if (!normalImageDiv) {
          //add in the normalImage
          normalImageDiv = document.createElement("DIV");
          normalImageDiv.setAttribute("id",itemId+"_normal");
          normalImageDiv.style.position = "absolute";
          normalImageDiv.style.visibility = "visible";
          normalImageDiv.style.zIndex = 30000;
          var newImage = document.createElement("IMG");
          newImage.src = config.skinDir+objRef.normalImage;
          newImage.title = title;
          normalImageDiv.appendChild(newImage);
          objRef.node.firstChild.appendChild( normalImageDiv );

          //add in the highlightImage
          highlightImageDiv = document.createElement("DIV");
          highlightImageDiv.setAttribute("id",itemId+"_highlight");
          highlightImageDiv.style.position = "absolute";
          highlightImageDiv.style.visibility = "hidden";
          highlightImageDiv.style.zIndex = 30001;   //all highlight images are on top of others
          var newImage = document.createElement("IMG");
          newImage.src = config.skinDir+objRef.highlightImage;
          newImage.title = title;
          highlightImageDiv.appendChild(newImage);
          objRef.node.firstChild.appendChild( highlightImageDiv );
        }

        pixel.x += objRef.xOffset;
        pixel.y += objRef.yOffset;
        normalImageDiv.style.left = pixel.x.toString() + "px";
        normalImageDiv.style.top = pixel.y.toString() + "px";
        highlightImageDiv.style.left = pixel.x.toString() + "px";
        highlightImageDiv.style.top = pixel.y.toString() + "px";
      }
    }
  }
