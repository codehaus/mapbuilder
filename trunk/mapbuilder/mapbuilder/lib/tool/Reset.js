/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * When this button is pressed the map will reload with it's original extent
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode      The tool node from the Config XML file.
 * @param toolNode      The tool node from the Config XML file.
 * @param parentWidget  The ButtonBar widget.
 */
function Reset(toolNode, parentWidget) {
  var base = new ToolBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Calls the reset() method of the context doc to reload at with the original extent
   */
  this.selectButton = function() {
    this.parentWidget.mouseWidget.model.extent.Reset();
  }

  this.parentWidget.addListener( "paint", this.init, this );
}
