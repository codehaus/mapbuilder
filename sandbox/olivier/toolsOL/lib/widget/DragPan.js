/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: DragPan.js 1671 2005-09-20 02:37:54Z madair1 $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is selected, click and drag on the MapPane to recenter the map.
 * @constructor
 * @base ButtonBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode  The widget node from the Config XML file.
 * @param model  The parent model for this widget
 */
function DragPan(widgetNode, model) {

   this.options=new Object();

  ButtonBase.apply(this, new Array(widgetNode, model));
  
  this.options.id=this.id;
  this.options.cursor = "cross";
  this.options.size=new OpenLayers.Size(24,24);
  this.objectOL=new OpenLayers.Button.DragPan(this.options);
  
  
  
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
