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
  //this.mode = 'MODE_SET_AOI';   //temporary until mode gets implemented somewhere else?
  this.mode = 'MODE_ZOOM_IN';   //temporary until mode gets implemented somewhere else?

  this.node = document.getElementById( parentWidget.containerId );


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
    this.paint();
  }

  this.mouseUpHandler = function( targetNode, objRef ) {
    if (objRef.started) {
      objRef.started = false;
      var bbox = objRef.getBox();
      var ul = targetNode.parentWidget.model.extent.GetXY( bbox[0] );
      var lr = targetNode.parentWidget.model.extent.GetXY( bbox[1] );
      switch(objRef.mode) {
        case 'MODE_ZOOM_IN':				//zoom in
          objRef.setVis(false);
          var targetModel = targetNode.parentWidget.model;
          if ( targetNode.parentWidget.targetGroup ) {
            //add a listener to the targetGroup for updates to AOI box
            targetModel = config[targetNode.parentWidget.targetGroup].model;
          }
          targetModel.extent.ZoomToBox( ul, lr );
          break;
        case 'MODE_SET_AOI':				//setting AOI
          //call AOI changed listeners?; objRef.setFormAOI( ul, lr );
        default:
          //alert("invalid mode:" +objRef.mode);
          break;
      }
    }
  }

  this.mouseDownHandler = function( targetNode, objRef ) {
    objRef.start(targetNode.evpl);
  }
  this.mouseMoveHandler = function( targetNode, objRef ) {
    if (objRef.started) objRef.dragBox(targetNode.evpl);
  }

  this.paint = function() {
    this.Top.style.left = this.ul[0];
    this.Top.style.top = this.ul[1];
    this.Top.style.width = this.lr[0]-this.ul[0]
    this.Top.style.height = this.lineWidth;

    this.Left.style.left = this.ul[0];
    this.Left.style.top = this.ul[1];
    this.Left.style.width = this.lineWidth;
    this.Left.style.height = this.lr[1]-this.ul[1];

    this.Right.style.left = this.lr[0]-this.lineWidth;
    this.Right.style.top = this.ul[1];
    this.Right.style.width = this.lineWidth;
    this.Right.style.height = this.lr[1]-this.ul[1];

    this.Bottom.style.left = this.ul[0];
    this.Bottom.style.top = this.lr[1]-this.lineWidth;
    this.Bottom.style.width = this.lr[0]-this.ul[0];
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

    this.Top.style.left = Math.floor( (this.ul[0]+this.lr[0] - this.crossSize)/2);
    this.Top.style.top = Math.floor( (this.ul[1]+this.lr[1] + this.crossSize)/2);
    this.Top.style.width = this.crossSize;
    this.Top.style.height = this.lineWidth;
    this.Top.style.visibility = "visible";

    this.Left.style.left = Math.floor( (this.ul[0]+this.lr[0] - this.crossSize)/2);
    this.Left.style.top = Math.floor( (this.ul[1]+this.lr[1] + this.crossSize)/2);
    this.Left.style.width = this.lineWidth;
    this.Left.style.height = this.crossSize;
    this.Left.style.visibility = "visible";

    this.Right.style.visibility = "hidden";
    this.Bottom.style.visibility = "hidden";
  }
		
/** called for starting a drag operation
  * @param evpl    the coordinates to start the box at
  * @return        none
  */
  this.start = function(evpl) {
    this.anchorPoint = evpl;
    this.dragBox( evpl );
    this.started=true;
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
    var ul = new Array();
    var lr = new Array();
    if (this.anchorPoint[0] > evpl[0]) {
      ul[0] = evpl[0];
      lr[0] = this.anchorPoint[0];
    } else {
      ul[0] = this.anchorPoint[0];
      lr[0] = evpl[0];
    }
    if (this.anchorPoint[1] > evpl[1]) {
      ul[1] = evpl[1];
      lr[1] = this.anchorPoint[1];
    } else {
      ul[1] = this.anchorPoint[1];
      lr[1] = evpl[1];
    }

    this.drawBox( ul, lr );
/*
    if ( ( Math.abs(ul[0]-lr[0])<9 ) && ( Math.abs(ul[1]-lr[1])<9 ) ) {
      this.drawCross( ul, lr );
    } else {
      this.drawBox( ul, lr );
    }
*/
  }

/** Returns an array of the corner coordinates as [ul, lr]
  * @return        array of point arrays; ul=0, lr=1
  */
  this.getBox = function() {
    return new Array(this.ul, this.lr);
  }

/** Internal method to initialize the box HTML elements
  */ 
  this.mouseAddOffset = function( targetNode, objRef ) {
    targetNode.evpl[0] = targetNode.evpl[0] + targetNode.offsetLeft;
    targetNode.evpl[1] = targetNode.evpl[1] + targetNode.offsetTop;
  }

  this.getImageDiv = function( parentWidget ) {
    var newDiv = document.createElement("DIV");
    newDiv.innerHTML = "&nbsp;";
    newDiv.style.position = "absolute";
    newDiv.style.backgroundColor = this.lineColor;
    //newDiv.style.zIndex = 300;
    newDiv.style.visibility = "hidden";

/*
    parentWidget.addMouseListener('mouseDown', this.mouseAddOffset, this );
    parentWidget.addMouseListener('mouseMove', this.mouseAddOffset, this );
    parentWidget.addMouseListener('mouseUp', this.mouseAddOffset, this );
*/

    this.node.appendChild( newDiv );
    return newDiv;
  }

  //final initialization
  this.Top = this.getImageDiv( parentWidget );
  this.Bottom = this.getImageDiv( parentWidget );
  this.Left = this.getImageDiv( parentWidget );
  this.Right = this.getImageDiv( parentWidget );
  this.ul = new Array(0,0);
  this.lr = new Array(0,0);

  parentWidget.addMouseListener('mouseDown', this.mouseDownHandler, this );
  parentWidget.addMouseListener('mouseMove', this.mouseMoveHandler, this );
  parentWidget.addMouseListener('mouseUp', this.mouseUpHandler, this );

  //test case
/*
  this.drawBox( new Array(2,2), new Array(200,200) );
alert("AOIBox test");
  this.drawCross( new Array(75,75) );
alert("AOIBox test");
  this.anchorPoint = new Array(75,75);
  this.dragBox( new Array(300, 100) );
*/
}


