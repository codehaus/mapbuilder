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
  this.toolNode = toolNode;

  var id = toolNode.selectSingleNode("@id");
  if (id) this.id = id.firstChild.nodeValue;

  //initialize dynamic properties
  this.initModels = function(toolRef) {
    /** The model this tool will update. */
    var targetModel = toolRef.toolNode.selectSingleNode("mb:targetModel");
    if (targetModel) {
      var targetModelName = targetModel.firstChild.nodeValue;
      toolRef.targetModel = eval("config."+targetModelName);
    } else {
      toolRef.targetModel = toolRef.parentWidget.targetModel;
    }

    /** Mouse handler which this tool will register listeners with. */
    var mouseHandler = toolRef.toolNode.selectSingleNode("mb:mouseHandler");
    if (mouseHandler) {
      var evalObj = eval( "config." + mouseHandler.firstChild.nodeValue );
      if (evalObj) {
        toolRef.mouseHandler = evalObj;
      } else {
        alert( "invalid object reference in config:" + mouseHandler.firstChild.nodeValue );
      }
    }
  }
  this.initModels(this);
  this.targetModel.addListener( "loadModel", this.initModels, this );

  //dependant tools that must be enabled/disabled when this tool is enabled
  this.dependancies = toolNode.getElementsByTagName("dependsOn");

  //tools enabled by default; can set to false in config for initial loading
  this.enabled = true;    
  var enabled = toolNode.selectSingleNode("mb:enabled");
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
