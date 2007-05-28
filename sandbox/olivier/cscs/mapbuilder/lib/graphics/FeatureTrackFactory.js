/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureTrackFactory.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
mapbuilder.loadScript(baseDir+"/graphics/FeatureLineFactory.js");
mapbuilder.loadScript(baseDir+"/graphics/FeaturePointFactory.js");

/**
  * Track Feature Factory
  *   A track is really made of a line and the end point
  *
  * @param widgetNode  The widget's XML object node from the configuration document.
  * @param model       The model object that this widget belongs to.
  * @param tipObject   tipObject to use for popup
  */
function FeatureTrackFactory(widgetNode, model, tipObjectName) {
  // initialize from model
  this.lineFactory = new FeatureLineFactory( widgetNode, model, tipObjectName);
  this.pointFactory = new FeaturePointFactory( widgetNode, model, tipObjectName);
}

/**
  * Clear all created features
  */
FeatureTrackFactory.prototype.clearFeatures = function( objRef ) {
  this.lineFactory.clearFeatures( objRef );
  this.pointFactory.clearFeatures(objRef );
}

/**
  * Create Track Feature
  * 
  * @param objRef a pointer to this widget object
  * @param geometry array of necessary coordinates for that type of geometry
  * @param itemId feature Id
  * @param title title of feature
  * @param papupStr popup to display on mouseover
  */
FeatureTrackFactory.prototype.createFeature = function( objRef, geometry, itemId, title, popupStr, icon ) {
 
  // create the line
  this.lineFactory.createFeature(  objRef, geometry, itemId, title, popupStr, icon );
  
  // create the last point
  var lastPoint = geometry[geometry.length-1]
  //alert("Last:"+lastPoint[0] + " " +lastPoint[1] );
  this.pointFactory.createFeature( objRef, lastPoint, itemId, null, null, icon );  
} 
