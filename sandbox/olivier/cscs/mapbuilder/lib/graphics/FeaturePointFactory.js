/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeaturePointFactory.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
mapbuilder.loadScript(baseDir+"/graphics/FeaturePoint.js");
 
/**
  * Point Feature Factory
  * @param widgetNode  The widget's XML object node from the configuration document.
  * @param model       The model object that this widget belongs to.
  * @param tipObject   tipObject to use for popup
  */
function FeaturePointFactory(widgetNode, model, tipObjectName) {
  // initialize from model
  if( widgetNode.selectSingleNode("mb:normalImage") )
    this.normalImage = widgetNode.selectSingleNode("mb:normalImage").firstChild.nodeValue; 
  
  if( widgetNode.selectSingleNode("mb:highlightImage"))
    this.highlightImage = widgetNode.selectSingleNode("mb:highlightImage").firstChild.nodeValue;
  
  if( widgetNode.selectSingleNode("mb:imageOffset") ) 
    this.imgOffset = widgetNode.selectSingleNode("mb:imageOffset").firstChild.nodeValue;
  
  if( widgetNode.selectSingleNode("mb:shadowImage") )
    this.shadowImage = widgetNode.selectSingleNode("mb:shadowImage").firstChild.nodeValue;
  
  if( widgetNode.selectSingleNode("mb:shadowOffset") )
    this.shadowOffset = widgetNode.selectSingleNode("mb:shadowOffset").firstChild.nodeValue;
  
  this.points = new Array();
  this.tipObjectName = tipObjectName;
}

/**
  * Clear all created features
  */
FeaturePointFactory.prototype.clearFeatures = function( objRef ) {
  // we need to clear all the div's first
 
  for( id in this.points ) {
    var pt = this.points[id];
    pt.clear(objRef);
  }
   
  // create new one
  this.points = new Array();
}

/**
  * Create Point Feature
  * 
  * @param objRef a pointer to this widget object
  * @param geometry array of necessary coordinates for that type of geometry
  * @param itemId feature Id
  * @param title title of feature
  * @param papupStr popup to display on mouseover
  */
FeaturePointFactory.prototype.createFeature = function( objRef, geometry, itemId, title, popupStr, icon ) {
  
  // possibility of substituting icons here
  if( icon == null ) {
    icon = this.normalImage;
  }
  
  var pt = new FeaturePoint(objRef, geometry, itemId, title, popupStr, this.tipObjectName, 
    icon, this.highlightImage, this.shadowImage, this.imgOffset, this.shadowOffset);
    
  this.points[itemId] = pt;
} 
