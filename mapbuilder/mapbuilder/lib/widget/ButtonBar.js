/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * A widget which contains a collection of buttons.  Supports radio buttons,
 * select buttons and simple push buttons.  A radio button can
 * be selected (Eg a ZoomInButton) and will determine how mouse clicks on a
 * MapPane are processed.
 * ButtonBar tools process mouseClicks on behalf of the mouseWidget. The
 * mouseWidget is usually a MapPane.  If the mouseWidget property is not set in 
 * config, then the mouseUp action only happens when the button is click
 * This widget extends WidgetBase.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function ButtonBar(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * calls the select() method for any selected buttons in this widget.
   * This over-rides the default paint() method to transform the config doc 
   * instead of the model.
   */
  this.init = function(objRef) {
    for (var sProperty in objRef) { 
      if ( objRef[sProperty].selected ) objRef[sProperty].select();
    } 
  }
  this.model.addListener('loadWidget',this.init,this);
}

