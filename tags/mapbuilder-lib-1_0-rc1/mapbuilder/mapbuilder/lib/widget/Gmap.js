/*
Author:       Cameron Shorter cameronATshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: GmlRendererWZ.js 1671 2005-09-20 02:37:54Z madair1 $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Create a map Layer using Google Maps.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function Gmap(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  /** Instance of the Google Maps Object */
  this.gmap=null;

  this.paint = function(objRef) {
    if (objRef.model.doc && objRef.node) {

      var outputNode = document.getElementById( objRef.outputNodeId );
      var tempNode = document.createElement("DIV");

      tempNode.style.position="absolute";
      tempNode.style.top=0;
      tempNode.style.left=0;
      tempNode.style.width=objRef.model.getWindowWidth();
      tempNode.style.height=objRef.model.getWindowHeight();
      tempNode.style.zindex=300;
      tempNode.setAttribute("id", objRef.outputNodeId);
      //look for this widgets output and replace if found, otherwise append it
      if (outputNode) {
        objRef.node.replaceChild(tempNode,outputNode);
      } else {
        objRef.node.appendChild(tempNode);
      }
    }

    //TBD This should be moved to an initialisation function
    if(!objRef.gmap){
      objRef.gmap=new GMap(tempNode);
    }

    //TBD Needs to be replaced with real coordinates and zoom level
    objRef.gmap.centerAndZoom(new GPoint(-122.1419, 37.4419),4);

  }
  this.model.addListener("refresh",this.paint, this);

  MapContainerBase.apply(this,new Array(widgetNode, model));

}
