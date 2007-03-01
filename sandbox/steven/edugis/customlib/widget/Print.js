/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Back.js,v 1.2 2005/10/11 13:59:27 graphrisc Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed the map will reload with it's original extent
 * @constructor
 * @base ButtonBase
 * @author Steven Ottens AT geodan.nl
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function Print(widgetNode, model) {
  ButtonBase.apply(this, new Array(widgetNode, model));
	this.psu=widgetNode.selectSingleNode("mb:printServerUrl").firstChild.nodeValue;
 
  /**
   * Replaces the current extent with the previous one in history
   * @param objRef      Pointer to this object.
   */
  this.doSelect = function(selected,objRef) {
	 
    if (selected){
			var layers = objRef.targetModel.getAllLayers();
			var queryLayers = "";
			var layerName = "";
			for (var i=0;i<layers.length;i++){
				 var layerHidden = (layers[i].getAttribute("hidden")==1)?true:false;
					if(!layerHidden) queryLayers = queryLayers+","+layers[i].selectSingleNode("wmc:Name").firstChild.nodeValue;  
			} 
			queryLayers=queryLayers.slice(1);
			var srs =objRef.targetModel.getSRS();
			var bbox =objRef.targetModel.getBoundingBox().join(",");
			var width = objRef.targetModel.getWindowWidth();
			var height = objRef.targetModel.getWindowHeight();
			var format ="image/png";
			src=objRef.psu+"&VERSION=1.1.0&REQUEST=GetMap&SERVICE=WMS&SRS="+srs+"&BBOX="+bbox+"&WIDTH="+width+"&HEIGHT="+height+"&LAYERS="+queryLayers+"&FORMAT="+format;
			
			window.open(src,"printview","width=800, height=550");
    }
  }
}


