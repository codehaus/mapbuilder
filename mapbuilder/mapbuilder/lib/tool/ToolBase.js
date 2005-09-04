/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

/**
 * Base Tool object that all Tools extend.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param objRef   Pointer to the tool instance being created
 * @param toolNode The tool node from the Config XML file.
 * @param model    The widget object which created this tool.
 */
function ToolBase(objRef, toolNode, model) {
  objRef.model = model;
  objRef.toolNode = toolNode;

  //set the ID for this tool
  var id = toolNode.selectSingleNode("@id");
  if (id) {
    objRef.id = id.firstChild.nodeValue;
  } else {
    objRef.id = "MbTool_" + mbIds.getId();
  }

  /**
   * Initialize the targetModel property to point to the object.  This happens
   * as an init listener to ensure that the referenced model has been created.
   * @param toolRef Pointer to this object.
   */
  this.initTargetModel = function(toolRef) {
    /** The model this tool will update. */
    var targetModel = toolRef.toolNode.selectSingleNode("mb:targetModel");
    if (targetModel) {
      var targetModelName = targetModel.firstChild.nodeValue;
      toolRef.targetModel = eval("config.objects."+targetModelName);
      if (!toolRef.targetModel) alert("error finding targetModel:"+targetModelName+" for tool:"+toolRef.id);
    } else {
      toolRef.targetModel = toolRef.model;
    }
  }
  objRef.initTargetModel = this.initTargetModel;
  objRef.model.addListener( "init", objRef.initTargetModel, objRef );

  /**
   * Initialize the mouseHandler property to point to the object.  This happens
   * as an init listener to ensure that the referenced model has been created.
   * @param toolRef Pointer to this object.
   */
  this.initMouseHandler = function(toolRef) {
    /** Mouse handler which this tool will register listeners with. */
    var mouseHandler = toolRef.toolNode.selectSingleNode("mb:mouseHandler");
    if (mouseHandler) {
      toolRef.mouseHandler = eval("config.objects." + mouseHandler.firstChild.nodeValue);
      if (!toolRef.mouseHandler) {
        alert("error finding mouseHandler:"+mouseHandler.firstChild.nodeValue+" for tool:"+toolRef.id);
      }
    }
  }
  objRef.initMouseHandler = this.initMouseHandler;
  objRef.model.addListener( "init", objRef.initMouseHandler, objRef );

  //tools enabled by default; can set to false in config for initial loading
  objRef.enabled = true;
  var enabled = toolNode.selectSingleNode("mb:enabled");
  if (enabled) objRef.enabled = eval(enabled.firstChild.nodeValue);
}
