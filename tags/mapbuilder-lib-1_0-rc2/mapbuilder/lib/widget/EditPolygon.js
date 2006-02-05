/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a polygon.
 * @constructor
 * @base EditButtonBase
 * @author Simon Flannery simonDOTflanneryATbigpondDOTcom
 * @sponser VPAC
 * @param widgetNode The node from the Config XML file.
 * @param model The ButtonBar widget.
 */
function EditPolygon(widgetNode, model) {
  // Extend EditButtonBase
  EditButtonBase.apply(this, new Array(widgetNode, model));

  /**
   * If the number of exsisting points is less than 2, append the new point to the polygon.
   * If the number of exsisting points is equal to 2, append the new point AND the first point again.
   * If the number of exsisting points is greater than 2, remove the last point (the first point), and append the new point AND the first point again.
   * @param objRef      Pointer to this object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef, targetNode) {
    if (objRef.enabled) {
      var point = objRef.mouseHandler.model.extent.getXY(targetNode.evpl);
      var old   = objRef.targetModel.getXpathValue(objRef.targetModel, objRef.featureXpath);
      var thePolygon = "";

      if (!old) {
         thePolygon = point[0] + "," + point[1];
      }
      else {
         var collect = old.split(" "); /* The string is already delimited by white space. */

         if (collect.length < 2) { /* Enforce the polygon rules. */
            thePolygon = old + " " + point[0] + "," + point[1];
         }
         else if (collect.length == 2) {
            thePolygon = old + " " + point[0] + "," + point[1] + " " + collect[0];
         }
         else if (collect.length > 2) {
            for (var i = 0; i < collect.length - 1; ++i) {

               thePolygon = thePolygon + collect[i] + " ";
            }

            thePolygon = thePolygon + point[0] + "," + point[1] + " " + collect[0];
         }
      }

      sucess = objRef.targetModel.setXpathValue(objRef.targetModel, objRef.featureXpath, thePolygon);

      if (!sucess) {
        alert("EditPolygon: invalid featureXpath in config: " + objRef.featureXpath);
      }
    }
  }
}

