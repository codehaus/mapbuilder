/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

/**
 * Tool to draw a region of interest box on a view.  The box can be drawn with
 * the drawBox() method and can be tied to mouse drag with the dragBox() method.
 * This object works entirely in pixel/line coordinate space and knows nothing
 * about geography.
 *
 * @constructor
 *
 * @param viewNode    the view object node to attach the RoiBox to.
 */

function AoiBox(toolNode, parentWidget) {
  this.lineWidth = 2;                 // Zoombox line width; pass in as param?
  this.lineColor = "#FF0000";         // color of zoombox lines; pass in as param?
  this.crossSize = 9;

  this.model = parentWidget.model;

  this.aoiListener = function(objRef) {
    objRef.paint();
  }

  this.model.addAoiListener(this.aoiListener, this);

/** Hide or show the box
  * @param vis    boolean true for visible; false for hidden
  * @return       none
  */
  this.setVis = function(vis) {
    var visibility = "hidden";
		if (vis) visibility = "visible";
    this.Top.style.visibility = visibility;
    this.Left.style.visibility = visibility;
    this.Right.style.visibility = visibility;
    this.Bottom.style.visibility = visibility;
  }

/** draw out the box
  * @param ul    upper left pixel/line coordinates
  * @param lr    lower right pixel/line coordinates
  * @return       none
  */
  this.paint = function() {
    var aoiBox = this.model.getAoi();
    ul = aoiBox[0];
    lr = aoiBox[1];
    //check if ul=lr, then draw cross, else drawbox
    this.drawBox(ul, lr);
  }

  this.drawBox = function(ul, lr) {
    this.Top.style.left = ul[0];
    this.Top.style.top = ul[1];
    this.Top.style.width = lr[0]-ul[0]
    this.Top.style.height = this.lineWidth;

    this.Left.style.left = ul[0];
    this.Left.style.top = ul[1];
    this.Left.style.width = this.lineWidth;
    this.Left.style.height = lr[1]-ul[1];

    this.Right.style.left = lr[0]-this.lineWidth;
    this.Right.style.top = ul[1];
    this.Right.style.width = this.lineWidth;
    this.Right.style.height = lr[1]-ul[1];

    this.Bottom.style.left = ul[0];
    this.Bottom.style.top = lr[1]-this.lineWidth;
    this.Bottom.style.width = lr[0]-ul[0];
    this.Bottom.style.height = this.lineWidth;

    this.setVis(true);
  }
		
/** draw out the box
  * @param ul    upper left pixel/line coordinates
  * @param lr    lower right pixel/line coordinates
  * @return       none
  */
  this.drawCross = function(center) {
    //this.ul = center;
    //this.lr = cen;

    this.Top.style.left = Math.floor( center[0] - (this.crossSize/2) );
    this.Top.style.top = Math.floor( center[1] + (this.crossSize/2) );
    this.Top.style.width = this.crossSize;
    this.Top.style.height = this.lineWidth;
    this.Top.style.visibility = "visible";

    this.Left.style.left = Math.floor( center[0] - (this.crossSize/2) );
    this.Left.style.top = Math.floor( center[1] + (this.crossSize/2) );
    this.Left.style.width = this.lineWidth;
    this.Left.style.height = this.crossSize;
    this.Left.style.visibility = "visible";

    this.Right.style.visibility = "hidden";
    this.Bottom.style.visibility = "hidden";
  }
		

/** Internal method to initialize the box HTML elements
  */ 
  this.mouseAddOffset = function( targetNode, objRef ) {
    targetNode.evpl[0] = targetNode.evpl[0] + targetNode.offsetLeft;
    targetNode.evpl[1] = targetNode.evpl[1] + targetNode.offsetTop;
  }

  this.getImageDiv = function( parentNode ) {
    var newDiv = document.createElement("DIV");
    newDiv.innerHTML = "&nbsp;";
    newDiv.style.position = "absolute";
    newDiv.style.backgroundColor = this.lineColor;
    //newDiv.style.zIndex = 300;
    newDiv.style.visibility = "hidden";
    parentNode.appendChild( newDiv );
    return newDiv;
  }

  //final initialization
  var containerNode = document.getElementById( parentWidget.containerId );
  this.Top = this.getImageDiv( containerNode );
  this.Bottom = this.getImageDiv( containerNode );
  this.Left = this.getImageDiv( containerNode );
  this.Right = this.getImageDiv( containerNode );
  this.ul = new Array(0,0);
  this.lr = new Array(0,0);

  //test case
  this.drawBox( new Array(2,2), new Array(200,200) );
  alert("AOIBox test");
  this.drawCross( new Array(75,75) );
  alert("AOIBox test");
}


