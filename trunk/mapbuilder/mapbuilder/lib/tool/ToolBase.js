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

  //mouse handler which this tool will register listeners with
  var mouseHandler = toolNode.selectSingleNode("mouseHandler");
  if (mouseHandler) this.mouseHandler = eval(mouseHandler.firstChild.nodeValue);

  //dependant tools that must be enabled/disabled when this tool is enabled
  this.dependancies = toolNode.getElementsByTagName("dependsOn");

  //tools enabled by default; can set to false in config for initial loading
  this.enabled = true;    
  var enabled = toolNode.selectSingleNode("enabled");
  if (enabled) this.enabled = eval(enabled.firstChild.nodeValue);

  /**
   * enable or disable this tool and any dependant tools 
   * @param enabled   set to true or false to enable or disable
   */
  this.enable = function(enabled) {
    this.enabled = enabled;
    for (var i=0; i<this.dependancies.length; ++i) {
      var otherTool = eval(this.dependancies[i].firstChild.nodeValue);
      otherTool.enable(enabled);
    }
  }
}
