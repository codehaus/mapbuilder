/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: DragPanHandler.js 2546M 2007-01-26 15:57:27Z (local) $
*/
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
/**
 * Tool to click and drag a map pane to achieve a recentering of the map.
 * This tool processes screen coordinates and stores AOI in the current map
 * projection coordinates.
 *
 * @constructor
 * @base ToolBase
 * @param toolNode The tool node from the Config XML file.
 * @param model  The model object that contains this tool.
 */

function DragPanHandler(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));

  /**
   * Process the mouseup action.  This will reset the AOI on the model by 
   * shifting the AOI by the maount that the mouse was dragged.
   * @param objRef Pointer to this DragPanHandler object.
   * @param targetNode  The HTML node that the event occured on
   */
  this.mouseUpHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.dragging) {
        objRef.dragging = false;

        //set new AOI in context, only if it's been moved
        if ((objRef.deltaP==0) && (objRef.deltaL==0)) return;
        var width = objRef.model.getWindowWidth();
        var height = objRef.model.getWindowHeight();
        var ul = objRef.model.extent.getXY( new Array( -objRef.deltaP, -objRef.deltaL) );  //(0,0) was the original ul AOI 
        var lr = objRef.model.extent.getXY( new Array( width-objRef.deltaP, height-objRef.deltaL) );  //(w,h) was the original lr AOI 
        objRef.model.setParam("aoi",new Array(ul,lr));
        
      }
    }
  }

  /**
   * Process a mouse down action by starting the drag pan action.
   * @param objRef Pointer to this DragPanHandler object.
   * @param targetNode  The HTML node that the event occured on
   */
  this.mouseDownHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      //objRef.containerNode = document.getElementById( objRef.parentWidget.containerId );
      objRef.dragging = true;
      objRef.anchorPoint = targetNode.evpl;
      objRef.deltaP = 0;
      objRef.deltaL = 0;
//Michael Jenik added this
      //objRef.oldPos stores the old positions of targetNode.childNodes divs
      //var img=targetNode.lastChild.firstChild;
      img=targetNode.lastChild;
      objRef.oldPos = new Array(1);
      /*for(var i=0; i<images.length; i++) {*/
        //var img=images.item(i);
        var P = img.style.left;
        var L = img.style.top;
        if(P && L)
          objRef.oldPos[0] = new Array(parseInt(P),parseInt(L));
        else
          objRef.oldPos[0] = new Array(0,0);
      //}

    }
  }

  /**
   * Process a mousemove action.  This method uses DHTML to move the map layers
   * and sets deltaP and deltaL properties on this tool to be used in mouse up.
   * @param objRef Pointer to this DragPanHandler object.
   * @param targetNode  The HTML node that the event occured on
   */
  this.mouseMoveHandler = function(objRef,targetNode) {
    if (objRef.enabled) {
      if (objRef.dragging) {
        objRef.deltaP = targetNode.evpl[0] - objRef.anchorPoint[0];
        objRef.deltaL = targetNode.evpl[1] - objRef.anchorPoint[1];

        //use this form if dragging the container node children
        //var images=targetNode.getElementsByTagName("div");
        var img=targetNode.lastChild;
        //for(var i=0; i<images.length; i++) {
          //var img=images.item(i);
//Michael Jenik added the plus ...
          img.style.left=objRef.deltaP + objRef.oldPos[0][0]+'px';
          img.style.top=objRef.deltaL + objRef.oldPos[0][1]+'px';
        //}
        //center=new Array(600/2-objRef.deltaP,150-objRef.deltaL);
        //objRef.targetModel.extent.centerAt(center,null);
        //use this form if dragging the container node
        /*var containerNode = document.getElementById('mainMapContainer');
        containerNode.style.left = objRef.deltaP;
        containerNode.style.top = objRef.deltaL;*/

      }
    }
  }

  //register the listeners on the model
  this.model.addListener('mousedown',this.mouseDownHandler,this);
  this.model.addListener('mousemove',this.mouseMoveHandler,this);
  this.model.addListener('mouseup',this.mouseUpHandler,this);
}


