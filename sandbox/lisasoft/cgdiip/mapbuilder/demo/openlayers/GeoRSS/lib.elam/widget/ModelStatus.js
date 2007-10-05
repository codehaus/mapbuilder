/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: ModelStatus.js 1671 2005-09-20 02:37:54Z madair1 $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display the status of a model, repainted whenever the model status
 * param is set.
 * TBD: not yet completed
 *
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  This widget's object node from the configuration document.
 * @param model       The model that this widget is a view of.
 */

function ModelStatus(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * initializes stylesheet parameters for the widget
   * @param objRef Pointer to this widget object.
   */
  this.prePaint = function(objRef) {
    objRef.stylesheet.setParameter("statusMessage", objRef.targetModel.getParam("modelStatus"));
  }
  this.model.addListener("modelStatus",this.paint,this);
}

