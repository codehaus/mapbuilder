/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Context
$Id: GetFeatureInfo.js 2511 2007-01-05 11:55:23Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
/**
 * Implements WMS GetFeatureInfo functionality, popping up a query result
 * window when user clicks on map.
 * @constructor
 * @base ButtonBase
 * @author Nedjo
 * @constructor
 * @param toolNode The XML node in the Config file referencing this object.
 * @param model The widget object which this tool is associated with.
 */
function GetFeatureInfo(widgetNode, model) {
 /*Default options*/
  
  this.options=new Object();

  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  this.options.id=this.id;
  this.options.cursor = "default";  
  this.options.size=new OpenLayers.Size(24,24);
  this.options.queryLayerName="camgis:Continental_Area";
  this.objectOL=new OpenLayers.Button.GetFeatureInfo(this.options);
  
  
  this.addButton = function(objRef){
  
		  objRef.targetModel.toolbar.div=document.getElementById(objRef.htmlTagId);
		  objRef.targetModel.toolbar.addTools(objRef.objectOL);

   }
 
   this.model.addListener( "mapLoaded", this.addButton, this );
}
