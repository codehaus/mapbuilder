/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
Dependancies: Context
$Id$
*/


/**
 * Zooms the target model to the AOI of this widget.  The target model can be 
 * this modelGroup's model or anothers
 * @constructor
 * @author Adair
 * @constructor
 * @param toolNode      The tool node from the config document for this tool
 * @param parentWidget  Reference to the widget object that creates this tool
 */
function ZoomToAoi(toolNode, parentWidget) {
  this.parentWidget = parentWidget;
  this.model = parentWidget.model;

  var targetModelGroup = toolNode.selectSingleNode("targetModelGroup");
  if ( targetModelGroup ) {
    this.targetModelGroup = targetModelGroup.firstChild.nodeValue;
    this.init = function( tool ) {
      tool.targetModel = config[tool.targetModelGroup];
      tool.targetModel.proj = new Proj( tool.targetModel.getSRS() );
    }
    this.init(this);
    this.model.addListener( "loadModel", this.init, this );
  } else {
    this.targetModel = tool.model;
  }

  this.mouseup = function( targetNode, tool ) {
    var bbox = tool.model.getAoi();
    var ul = tool.model.extent.GetXY( bbox[0] );
    var lr = tool.model.extent.GetXY( bbox[1] );
    if ( tool.model.getSRS() != tool.targetModel.getSRS() ) {
      //ul = tool.model.proj.inverse( ul );     //to LL
      ul = tool.targetModel.proj.Forward( ul ); //to target XY
      //lr = tool.model.proj.inverse( lr ); 
      lr = tool.targetModel.proj.Forward( lr );
    }
    if ( ( ul[0]==lr[0] ) && ( ul[1]==lr[1] ) ) {
      tool.targetModel.extent.CenterAt( ul, tool.targetModel.extent.res[0] );
    } else {
      tool.targetModel.extent.ZoomToBox( ul, lr );
    }
  }

  this.parentWidget.addMouseListener('mouseUp', this.mouseup, this);
}
