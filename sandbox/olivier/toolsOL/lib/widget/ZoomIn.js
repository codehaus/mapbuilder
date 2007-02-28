/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomIn.js 2133M 2007-01-26 15:08:53Z (local) $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function ZoomIn(widgetNode, model) {

  /*Default options*/
  
  this.options=new Object();

  
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  this.options.id=this.id;
  this.options.cursor = "crosshair";  
  this.options.size=new OpenLayers.Size(24,24);
 
  this.objectOL=new OpenLayers.Button.ZoomIn(this.options);
  
  
  
  this.addButton = function(objRef){
  
		  objRef.targetModel.toolbar.div=document.getElementById(objRef.htmlTagId);
		  objRef.targetModel.toolbar.addTools(objRef.objectOL);
		  if(objRef.selected)
		  {	
		  		objRef.targetModel.toolbar.setTool(objRef.objectOL);
		  }
   }
 
   this.model.addListener( "mapLoaded", this.addButton, this );
}

