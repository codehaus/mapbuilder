/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");

/**
 * When this button is selected, clicks on the MapPane trigger a zoomIn to the 
 * currently set AOI.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function ZoomIn(toolNode, parentWidget) {
  var base = new ButtonBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  }

  this.zoomBy = 4;//TBD: get this from config

  /**
   * Calls the model's ceter at method to zoom in.  If the AOI is a single point,
   * it zooms in by the zoomBy factor.
   * @param objRef      Pointer to this AoiMouseHandler object.
   * @param targetNode  The node for the enclosing HTML tag for this widget.
   */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
//alert("zoomin:" + objRef.enabled);
      var bbox = objRef.targetModel.getAoi();
      if ( objRef.targetModel.aoiValid) {
        var extent = objRef.targetModel.extent;
        var ul = extent.GetXY( bbox[0] );
        var lr = extent.GetXY( bbox[1] );
        if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
          extent.CenterAt( ul, extent.res[0]/objRef.zoomBy );
        } else {
          extent.ZoomToBox( ul, lr );
        }
      }
    }
  }
  if (this.mouseHandler) {
    this.mouseHandler.parentWidget.addListener('mouseup',this.doAction,this);
  }

  //TBD: if there is no mousehandler for this tool then the mousehandler on the 
  //mapppane has to be enabled somehow
  //config['mainMapGroup']['mainMapPaneId']['AoiMouseHandler'].enable(true);
}

