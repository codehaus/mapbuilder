/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: SelectTimeFrame.js 2511 2007-01-05 11:55:23Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to specify the start and stop frames for a time series context
 *
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function SelectTimeFrame(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Sets the frame index for the time series to start
   * @param index the array index for the first frame
   */
  this.setFirstFrame = function(index) {
    this.model.setParam("stopLoop");
    this.model.setParam("firstFrame",index);
  }

  /**
   * Sets the frame index for the time series end
   * @param index the array index for the first frame
   */
  this.setLastFrame = function(index) {
    var timestampList = this.model.timestampList;
    if (index > timestampList.firstFrame) {
      timestampList.lastFrame = index;
    } else {
      alert(mbGetMessage("lastFrameAfterFirst"));
    }
    this.model.setParam("stopLoop");
  }

}

