/*
Author:  Patrice G. Cappelaere patATcappelaere.com
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureLineFactory.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
mapbuilder.loadScript(baseDir+"/graphics/FeatureLine.js");

/**
  * Line Feature Factory
  * @param widgetNode  The widget's XML object node from the configuration document.
  * @param model       The model object that this widget belongs to.
  * @param tipObject   tipObject to use for popup
  */
function FeatureLineFactory(widgetNode, model, tipObjectName) {
  // initialize from model
  this.lines = new Array();
  this.tipObjectName = tipObjectName;
}

/**
  * Clear all created features
  */
FeatureLineFactory.prototype.clearFeatures = function( objRef ) {
  // we need to clear all the div's first
 
  for( id in this.lines ) {
    var line = this.lines[id];
    line.clear(objRef);
  }
   
  // create new one
  this.lines = new Array();
}

/**
  * Create Line Feature
  * 
  * @param objRef a pointer to this widget object
  * @param geometry array of necessary coordinates for that type of geometry
  * @param itemId feature Id
  * @param title title of feature
  * @param papupStr popup to display on mouseover
  */
FeatureLineFactory.prototype.createFeature = function( objRef, geometry, itemId, title, popupStr, icon ) {
  // possibility of substituting icons here
  if( icon == null ) {
    icon = this.normalImage;
  }
  
  var line = new FeatureLine(objRef, geometry, itemId, title, popupStr, this.tipObjectName, this.defaultPopupPosition );
  this.lines[itemId] = line;
} 
