/*
Author:       Cameron Shorter cameronATshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * This is a GML rendering widget that does all the pre-processing but doesn't
 * actually render to the page.  It is used for debugging purposes.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRendererTest(widgetNode, model) {

  /**
   * Override of the widget paint method to just pop up an alert with the 
   * transformed GML document.
   * @param objRef Pointer to this object.
   */
  this.paint = function(objRef) {
    //var response = postLoad("/mapbuilder/writeXml", objRef.model.doc);
    var features = objRef.model.doc.selectNodes("//gml:featureMember");
    alert("pretending to paint:"+features.length+" features"+Sarissa.serialize(objRef.model.doc));
  }

  var base = new MapContainerBase(this,widgetNode,model)
}
