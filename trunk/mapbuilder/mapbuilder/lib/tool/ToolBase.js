/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Tool object that all Tools extend.
 * @constructor
 * @base ToolBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param tool     Pointer to the tool instance being created
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The widget object which created this tool.
 */
function ToolBase(tool, toolNode, parentWidget) {
  tool.model = parentWidget.model;
  tool.parentWidget = parentWidget;
  tool.toolNode = toolNode;

  var id = toolNode.selectSingleNode("@id");
  if (id) {
    tool.id = id.firstChild.nodeValue;
  } else {
    tool.id = parentWidget.id + "_" + toolNode.nodeName;
  }

  /** Mouse handler which this tool will register listeners with. */
  var mouseHandler = tool.toolNode.selectSingleNode("mb:mouseHandler");
  if (mouseHandler) tool.objEvalStr = "config." + mouseHandler.firstChild.nodeValue;

  /**
   * Initialize dynamic properties.
   * @param toolRef Pointer to this object.
   */
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
    if (toolRef.objEvalStr) {
      var evalObj = eval(toolRef.objEvalStr);
      if (evalObj) {
        toolRef.mouseHandler = evalObj;
      } else {
        alert( "ToolBase.init: invalid object reference in config:" + toolRef.objEvalStr);
      }
    }
  }
  tool.initModels = this.initModels;
  tool.parentWidget.targetModel.addListener( "loadModel", tool.initModels, tool );
  tool.initModels(tool);

  //dependant tools that must be enabled/disabled when this tool is enabled
  tool.dependancies = toolNode.getElementsByTagName("dependsOn");

  //tools enabled by default; can set to false in config for initial loading
  tool.enabled = true;    
  var enabled = toolNode.selectSingleNode("mb:enabled");
  if (enabled) tool.enabled = eval(enabled.firstChild.nodeValue);

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
  tool.enable = this.enable;

}
