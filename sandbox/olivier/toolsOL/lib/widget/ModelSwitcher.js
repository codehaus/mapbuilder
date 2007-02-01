/*
Author:       Patrice G Cappelaere patATcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: ModelSwitcher.js 2049 2006-03-29 18:10:35Z cappelaere $
*/
// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to switch maps while preserving the current user view 
 *
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  This widget's object node from the configuration document.
 * @param model       The model that this widget is a view of.
 */
function ModelSwitcher(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
  
  
  // Switch maps.
  // Called from html buttons
  this.switchMap = function(targetModel, modelUrl) {
    // get the context and bbox
    this.bbox = config.objects.mainMap.getBoundingBox();
   
    //this.targetModel.addListener( "contextLoaded", this.setExtent, this );
    this.targetModel.addListener( "loadModel", this.setExtent, this );
    window.cgiArgs["bbox"]  = ""+this.bbox[0]+","+ this.bbox[1]+"," +this.bbox[2]+"," +this.bbox[3];
    config.loadModel( targetModel, modelUrl );
  }
  
  // called when the map is reloaded
  this.setExtent = function (objRef) {
    //var extent = config.objects.mainMap.extent;
    //alert( "Setting extent:"+objRef.bbox[0]+" "+objRef.bbox[1]+" "+objRef.bbox[2]+" "+objRef.bbox[3]);
    //extent.zoomToBox( new Array(objRef.bbox[0], objRef.bbox[1]), new Array(objRef.bbox[2], objRef.bbox[3]) );
    //objRef.targetModel.removeListener( "loadModel", objRef.setExtent, objRef );
  }
}


