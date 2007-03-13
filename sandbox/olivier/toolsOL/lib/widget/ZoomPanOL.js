/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * This widget is used to insert the OpenLayers default PanZoom
 * control and the OpenLayers MouseDefaults event listeners
 * into MapPaneOL. If added as widget to the Context model,
 * it is an alternative to Mapbuilder zoom and pan tools.
 * WARNING: Using this widget in conjunction with Mapbuilder
 * DragPan, ZoomIn and ZoomOut widgets will break map navigation.
 * @constructor
 * @base WidgetBase
 * @author Andreas Hocevar
 * @param widgetNode The widget's XML object node from the configuration document.
 * @param model The model object that this widget belongs to.
 */
function ZoomPanOL(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  /**
   * Remove the contents of the HTML tag for this widget.
   * @param objRef Reference to this object.
   */
  this.paint= function(objRef) {
  	OpenLayers.ImgPath = config.skinDir + '/images/';
   	// add native OL navigation controls
	objRef.model.map.addMouseListener(new OpenLayers.MouseListener.MouseDefaults()); //control for shift/drag and dbl clicke
	objRef.model.map.addControl(new OpenLayers.Control.PanZoom()); //up/down/left/right on click
  }
  this.model.addListener("refresh", this.paint, this);
}