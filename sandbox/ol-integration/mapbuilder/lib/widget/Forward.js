/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed the map will reload with it's original extent
 * @constructor
 * @base ButtonBase
 * @author Steven Ottens AT Geodan.nl
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function Forward(widgetNode, model) {
  
   ButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * Interactive ZoomOut control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} instance of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {
    
      type: OpenLayers.Control.TYPE_BUTTON,

      trigger: function () { 
      
                if (this.map.nbExtent>this.map.historyExtent.length-1)
			        alert("No more extent");
		        else{
			
		            this.map.zoomToExtent(this.map.historyExtent[this.map.nbExtent]); 
		            
                 }
         
       },
       CLASS_NAME: 'mbControl.Forward'
  });
  return new Control();
  }
}


