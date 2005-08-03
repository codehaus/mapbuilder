/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display the status of a model, repainted whenever the model status
 * param is set.
 * TBD: not yet completed
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode  This widget's object node from the configuration document.
 * @param model       The model that this widget is a view of.
 */

function ModelStatus(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  /**
   * initializes stylesheet parameters for the widget
   * @param objRef Pointer to this widget object.
   */
  this.prePaint = function(objRef) {
    objRef.stylesheet.setParameter("statusMessage", objRef.targetModel.getParam("modelStatus"));
  }
  this.model.addListener("modelStatus",this.paint,this);
}

