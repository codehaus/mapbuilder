/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Reset.js 1778 2005-11-01 13:08:44Z cappelaere $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed the map will reload with it's original extent
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function Reset(widgetNode, model) {

   this.options=new Object();

  ButtonBase.apply(this, new Array(widgetNode, model));
  
  this.options.id=this.id;
  this.options.size=new OpenLayers.Size(24,24);
  this.objectOL=new OpenLayers.Button.Reset(this.options);
  
  
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


