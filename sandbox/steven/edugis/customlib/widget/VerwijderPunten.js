/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Back.js,v 1.2 2005/10/11 13:59:27 graphrisc Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/ToggleBox.js");

/**
 * When this button is pressed the map will reload with it's original extent
 * @constructor
 * @base ButtonBase
 * @author Steven Ottens AT geodan.nl
 * @param widgetNode      The widget node from the Config XML file.
 * @param model  The model for this widget
 */
function VerwijderPunten(widgetNode, model) {
  ButtonBase.apply(this, new Array(widgetNode, model));

this.pm=widgetNode.selectSingleNode("mb:puntModel").firstChild.nodeValue;
this.featureXpath=widgetNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
  /**
   * Replaces the current extent with the previous one in history
   * @param objRef      Pointer to this object.
   */
  this.doSelect = function(selected,objRef) {
    if (selected){
			if(!objRef.puntModel){
	objRef.puntModel=window.config.objects[objRef.pm];
	}
		if(!objRef.puntModel.doc) return;
		old="";
	 sucess=objRef.puntModel.setXpathValue(
        objRef.puntModel,
        objRef.featureXpath,old);
      if(!sucess){
        alert("EditPoint: invalid featureXpath in config: "+objRef.featureXpath);
      }
		}
  }
}


