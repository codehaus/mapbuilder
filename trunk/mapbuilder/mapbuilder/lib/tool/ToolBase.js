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

  //set the target model
  var targetModel = toolNode.selectSingleNode("mb:targetModel");
  if (targetModel) {
    tool.targetModel = eval("config."+targetModel.firstChild.nodeValue);
    if ( !tool.targetModel ) {
      alert("error finding targetModel:" + targetModel.firstChild.nodeValue + " for:" + tool.id);
    } 
  } else {
    tool.targetModel = tool.model;
  }

  /** Mouse handler which this tool will register listeners with. */
  var mouseHandler = tool.toolNode.selectSingleNode("mb:mouseHandler");
  if (mouseHandler) {
    tool.mouseHandler = eval("config." + mouseHandler.firstChild.nodeValue);
    if ( !tool.mouseHandler ) {
      alert("error finding mouseHandler:" + mouseHandler.firstChild.nodeValue + " for:" + tool.id);
    }
  }

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
      toolRef.targetModel = toolRef.model;
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
  //tool.targetModel.addListener( "loadModel", tool.initModels, tool );

  //tools enabled by default; can set to false in config for initial loading
  tool.enabled = true;    
  var enabled = toolNode.selectSingleNode("mb:enabled");
  if (enabled) tool.enabled = eval(enabled.firstChild.nodeValue);

}
