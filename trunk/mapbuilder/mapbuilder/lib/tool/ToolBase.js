/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Tool object that all Tools extend.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param tool     Pointer to the tool instance being created
 * @param toolNode The tool node from the Config XML file.
 * @param model    The widget object which created this tool.
 */
function ToolBase(tool, toolNode, model) {
  tool.model = model;
  tool.toolNode = toolNode;

  var id = toolNode.selectSingleNode("@id");
  if (id) {
    tool.id = id.firstChild.nodeValue;
  } else {
    tool.id = "MbTool_" + mbIds.getId();
  }
  //config.tools[tool.id] = tool;

  /**
   * Initialize dynamic properties.
   * @param toolRef Pointer to this object.
   */
  this.initTargetModel = function(toolRef) {
    /** The model this tool will update. */
    var targetModel = toolRef.toolNode.selectSingleNode("mb:targetModel");
    if (targetModel) {
      var targetModelName = targetModel.firstChild.nodeValue;
      toolRef.targetModel = eval("config."+targetModelName);
      if (!toolRef.targetModel) alert("error finding targetModel:"+targetModelName+" for tool:"+toolRef.id);
    } else {
      toolRef.targetModel = toolRef.model;
    }
  }
  tool.initTargetModel = this.initTargetModel;
  config.addListener( "loadModel", tool.initTargetModel, tool );

  this.initMouseHandler = function(toolRef) {
    /** Mouse handler which this tool will register listeners with. */
    var mouseHandler = toolRef.toolNode.selectSingleNode("mb:mouseHandler");
    if (mouseHandler) {
      toolRef.mouseHandler = eval("config." + mouseHandler.firstChild.nodeValue);
      if (!toolRef.mouseHandler) {
        alert("error finding mouseHandler:"+mouseHandler.firstChild.nodeValue+" for tool:"+toolRef.id);
      }
    }
  }
  tool.initMouseHandler = this.initMouseHandler;
  config.addListener( "loadModel", tool.initMouseHandler, tool );

  //tools enabled by default; can set to false in config for initial loading
  tool.enabled = true;
  var enabled = toolNode.selectSingleNode("mb:enabled");
  if (enabled) tool.enabled = eval(enabled.firstChild.nodeValue);

}
