/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ToolBase.js 3029 2007-07-27 14:21:59Z jseb.baklouti $
*/

/**
 * Base Tool object that all Tools extend.
 * @constructor
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode The tool node from the Config XML file.
 * @param model    The widget object which created this tool.
 */
function ToolBase(toolNode, model) {
  this.model = model;
  this.toolNode = toolNode;

  //set the ID for this tool
  var id = toolNode.selectSingleNode("@id");
  if (id) {
    this.id = getNodeValue(id);
  } else {
    this.id = "MbTool_" + mbIds.getId();
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
      //toolRef.targetModel = eval("config.objects."+targetModelName);
      toolRef.targetModel = window.config.objects[targetModelName];
      if (!toolRef.targetModel) alert(mbGetMessage("noTargetModelTool", targetModelName, toolRef.id));
    } else {
      toolRef.targetModel = toolRef.model;
    }
  }
  this.model.addListener( "init", this.initTargetModel, this );

  /**
   * Initialize the mouseHandler property to point to the object.  This happens
   * as an init listener to ensure that the referenced model has been created.
   * @param toolRef Pointer to this object.
   */
  this.initMouseHandler = function(toolRef) {
    /** Mouse handler which this tool will register listeners with. */
    var mouseHandler = toolRef.toolNode.selectSingleNode("mb:mouseHandler");
    if (mouseHandler) {
      toolRef.mouseHandler = window.config.objects[mouseHandler.firstChild.nodeValue];
      if (!toolRef.mouseHandler) {
        alert(mbGetMessage("noMouseHandlerTool", mouseHandler.firstChild.nodeValue, toolRef.id));
      }
    }
  }
  this.model.addListener( "init", this.initMouseHandler, this );

  //tools enabled by default; can set to false in config for initial loading
  this.enabled = true;
  var enabled = toolNode.selectSingleNode("mb:enabled");
  if (enabled) this.enabled = eval(enabled.firstChild.nodeValue);
}
