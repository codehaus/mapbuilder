/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Button object that all Buttons extend.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function ToolBase(toolNode, parentWidget) {
  this.model = parentWidget.model;
  this.parentWidget = parentWidget;
  this.targetModel = parentWidget.model;

  var id = toolNode.selectSingleNode("@id");
  if (id) this.id = id.firstChild.nodeValue;

  var mouseHandler = toolNode.selectSingleNode("mouseHandler");
  if (mouseHandler) this.mouseHandler = eval(mouseHandler.firstChild.nodeValue);

  this.enabled = true;    //tools enabled by default; can turn off in config for initial loading
  var enabled = toolNode.selectSingleNode("enabled");
  if (enabled) this.enabled = eval(enabled.firstChild.nodeValue);

  /**
   * enable or disable this tool from procesing mouse events.
   * @param enabled   set to true or false to enable or disable
   */
  this.enable = function(enabled) {
    this.enabled = enabled;
  }
}
