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

function RoiBox( viewNode ) {
  this.lineWidth = 2;                 // Zoombox line width; pass in as param?
  this.lineColor = "#FF0000";         // color of zoombox lines; pass in as param?

  this.Top = GetImageDiv( viewNode, this.lineColor );
  this.Bottom = GetImageDiv( viewNode, this.lineColor );
  this.Left = GetImageDiv( viewNode, this.lineColor );
  this.Right = GetImageDiv( viewNode, this.lineColor );

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
  this.drawBox = function(ul, lr) {
    this.ul = ul;
    this.lr = lr;

    Offset = new Array(0,0);  //not really required anymore?
    this.Top.style.left = this.ul[0]+Offset[0]
    this.Top.style.top = this.ul[1]+Offset[1];
    this.Top.style.width = this.lr[0]-this.ul[0]
    this.Top.style.height = this.lineWidth;

    this.Left.style.left = this.ul[0]+Offset[0];
    this.Left.style.top = this.ul[1]+Offset[1];
    this.Left.style.width = this.lineWidth;
    this.Left.style.height = this.lr[1]-this.ul[1];

    this.Right.style.left = this.lr[0]-this.lineWidth+Offset[0]
    this.Right.style.top = this.ul[1]+Offset[1];
    this.Right.style.width = this.lineWidth;
    this.Right.style.height = this.lr[1]-this.ul[1];

    this.Bottom.style.left = this.ul[0]+Offset[0];
    this.Bottom.style.top = this.lr[1]-this.lineWidth+Offset[1];
    this.Bottom.style.width = this.lr[0]-this.ul[0];
    this.Bottom.style.height = this.lineWidth;

    this.setVis(true);
  }
		
/** called for starting a drag operation
  * @param evpl    the coordinates to start the box at
  * @return        none
  */
  this.start = function(evpl) {
    if (this.started) {
      this.stop(true);
    } else {
      var lr = new Array(evpl[0]+1, evpl[1]+1); //a bug when ul=lr?
      this.drawBox( evpl, lr );
      this.started=true;
    }
  }

/** called to start a drag operation
  * @param vis    show or hide the box
  * @return        none
  */
  this.stop = function(vis) {
    this.started=false;
    this.setVis(vis);
    //alert(GetLatLonROI());
  }

/** Change the coordinate of one corner of the box.  The initial upper left 
  * corner point stays fixed. 
  * @param evpl    new corner coordinate
  * @return        none
  */
  this.dragBox = function( evpl ) {	
    if (this.ul[0] > evpl[0]) {
      this.lr[0] = this.ul[0];
      this.ul[0] = evpl[0];
    } else {
      this.lr[0] = evpl[0];
    }
    if (this.ul[1] > evpl[1]) {
      this.lr[1] = this.ul[1];
      this.ul[1] = evpl[1];
    } else {
      this.lr[1] = evpl[1];
    }

    if ( (this.ul[0] != this.lr[0]) && (this.ul[1] != this.lr[1]) ) {
      this.drawBox( this.ul, this.lr );
    }
  }

/** Returns an array of the corner coordinates as [ul, lr]
  * @return        array of point arrays; ul=0, lr=1
  */
  this.getBox = function() {
    return new Array(this.ul, this.lr);
  }


  //test case
/*
  this.drawBox( new Array(50,50), new Array(200,200) );
  this.dragBox( new Array(300, 100) );
*/
}

/** Internal method to initialize the box HTML elements
  */
function GetImageDiv( viewNode, lineColor ) {
  var newDiv = document.createElement("DIV");
  newDiv.innerHTML = "<IMG SRC='' WIDTH='1' HEIGHT='1'/>";
  newDiv.style.position = "absolute";
  newDiv.style.backgroundColor = lineColor;
//  newDiv.style.zIndex = viewNode.style.zIndex;
  newDiv.style.zIndex = 300;
  newDiv.style.visibility = "hidden";
  newDiv.onmouseup = mouseUpHandler;
  viewNode.appendChild( newDiv );
  return newDiv;
}



