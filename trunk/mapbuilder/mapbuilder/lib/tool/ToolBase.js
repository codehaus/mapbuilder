/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Tool object that all Tools extend.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The widget object which created this tool.
 */
function ToolBase(toolNode, parentWidget) {
  this.model = parentWidget.model;
  this.parentWidget = parentWidget;

  /** The model this tool will update. */
  var targetModel = toolNode.selectSingleNode("targetModel");
  if (targetModel) {
    this.targetModelName = targetModel.firstChild.nodeValue;
    this.targetModel = eval("config."+this.targetModelName);
  } else {
    this.targetModel = parentWidget.targetModel;
  }

  var id = toolNode.selectSingleNode("@id");
  if (id) this.id = id.firstChild.nodeValue;

  /** Mouse handler which this tool will register listeners with. */
  var mouseHandler = toolNode.selectSingleNode("mouseHandler");
  if (mouseHandler) {
    this.mouseHandlerName = mouseHandler.firstChild.nodeValue;
    var evalObj = eval( "config." + this.mouseHandlerName );
    if (evalObj) {
      this.mouseHandler = evalObj;
    } else {
      alert( "invalid object reference in config:" + mouseHandler.firstChild.nodeValue );
    }
  }

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
      var otherTool = eval("config."+this.dependancies[i].firstChild.nodeValue);
      if (otherTool) {
        otherTool.enable(enabled);
      } else {
        alert("invalid dependsOn reference in config:" + this.dependancies[i].firstChild.nodeValue);
      }
    }
  }

}
