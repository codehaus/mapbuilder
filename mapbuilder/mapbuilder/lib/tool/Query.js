/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is selected, call a GetFeatureInfo request for the selected
 * layer and point clicked.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function Query(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty];    
  } 

  /**
   * Call a GetFeatureInfo request for the selected layer.
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    alert("Query function not implemented yet.");
    if (!objRef.enabled) return;
    //var bbox = objRef.targetModel.getAoi();
    //var extent = objRef.targetModel.extent
    //var ul = extent.GetXY( bbox[0] );
    //var newRes = extent.res[0]*objRef.zoomBy
    //extent.CenterAt(ul, newRes);
  }
  if (this.mouseHandler) {
    this.mouseHandler.addListener('query',this.doAction,this);
  }
}
