/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to draw an Area Of Interest box of a model.  The box can be drawn with
 * the paint() method and is registered as a listener of the context AOI property.
 * This object works entirely in pixel/line coordinate space and knows nothing
 * about geography.  This widget uses DHTML methods to draw the box.
 * @constructor
 * @base MapContainerBase
 * @param widgetNode The node for this object from the Config file.
 * @param model The model that contains this object.
 */
function AoiBoxDHTML(widgetNode, model) {

  this.lineWidth = widgetNode.selectSingleNode("mb:lineWidth").firstChild.nodeValue; // Zoombox line width; pass in as param?
  this.lineColor = widgetNode.selectSingleNode("mb:lineColor").firstChild.nodeValue; // color of zoombox lines; pass in as param?
  this.crossSize = widgetNode.selectSingleNode("mb:crossSize").firstChild.nodeValue;

  /** draw out the box.
    * if the box width or height is less than the cross size property, then the
    * drawCross method is called, otherwise call drawBox.
    * @param objRef a pointer to this widget object
    */
  this.paint = function(objRef) {
    var aoiBox = objRef.model.getParam("aoi");
    if (aoiBox) {
      var ul = objRef.model.extent.getPL(aoiBox[0]);
      var lr = objRef.model.extent.getPL(aoiBox[1]);
      //check if ul=lr, then draw cross, else drawbox
      if ( (Math.abs( ul[0]-lr[0] ) < objRef.crossSize) && 
          (Math.abs( ul[1]-lr[1] ) < objRef.crossSize) ) {
        objRef.drawCross( new Array( (ul[0]+lr[0])/2, (ul[1]+lr[1])/2) );
      } else {
        objRef.drawBox(ul, lr);
      }
    }
  }
  model.addListener("aoi",this.paint, this);


  // Inherit the MapContainerBase functions and parameters, paint has to be defined 
  this.stylesheet = new XslProcessor(baseDir+"/widget/Null.xsl");
  var base = new MapContainerBase(this,widgetNode, model);

  /** Hide or show the box.
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

  /** Listener to turn the box off
    * @param objRef  reference to this object
    * @return       none
    */
  this.clear = function(objRef) {
    objRef.setVis(false);
  }
  this.containerModel.addListener("bbox",this.clear, this);


  /** Draw a box.
    * @param ul Upper Left position as an (x,y) array in screen coords.
    * @param lr Lower Right position as an (x,y) array in screen coords.
    */
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
    
  /** Draw a cross.
    * @param center The center of the cross as an (x,y) array in screen coordinates.
    */
  this.drawCross = function(center) {
    this.Top.style.left = Math.floor( center[0] - this.crossSize/2 );
    this.Top.style.top = Math.floor( center[1] - this.lineWidth/2 );
    this.Top.style.width = this.crossSize;
    this.Top.style.height = this.lineWidth;
    this.Top.style.visibility = "visible";

    this.Left.style.left = Math.floor( center[0] - this.lineWidth/2 );
    this.Left.style.top = Math.floor( center[1] - this.crossSize/2 );
    this.Left.style.width = this.lineWidth;
    this.Left.style.height = this.crossSize;
    this.Left.style.visibility = "visible";

    this.Right.style.visibility = "hidden";
    this.Bottom.style.visibility = "hidden";
  }
    
  /** Insert a <div> element into the parentNode html to hold the lines.
    * @return The new <div> node.
    */
  this.getImageDiv = function( ) {
    var newDiv = document.createElement("DIV");
    newDiv.innerHTML = "<IMG SRC='"+config.skinDir+"/images/Spacer.gif' WIDTH='1' HEIGHT='1'/>";
    newDiv.style.position = "absolute";
    newDiv.style.backgroundColor = this.lineColor;
    newDiv.style.visibility = "hidden";
    newDiv.style.zIndex = 300;
    this.node.appendChild( newDiv );
    return newDiv;
  }

  /**
   * Called when the parent widget is painted to create the aoi box 
   * @param objRef This object.
   */
  this.loadAoiBox = function(objRef) {
    objRef.Top = objRef.getImageDiv( );
    objRef.Bottom = objRef.getImageDiv( );
    objRef.Left = objRef.getImageDiv( );
    objRef.Right = objRef.getImageDiv( );
    objRef.paint(objRef);
  }
  this.loadAoiBox(this);

}
