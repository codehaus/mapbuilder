/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ZoomOut.js 2133M 2007-01-26 15:13:07Z (local) $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, click on the map to zoom out centered at the click.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function ZoomOut(widgetNode, model) {

  this.options=new Object();

  ButtonBase.apply(this, new Array(widgetNode, model));
  
  this.options.id=this.id;
  this.options.cursor = "crosshair";
  this.options.size=new OpenLayers.Size(24,24);
  this.objectOL=new OpenLayers.Button.ZoomOut(this.options);
  
  
  
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
