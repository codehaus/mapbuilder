/*
Author:       Cameron Shorter cameronATshorter.net
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Render GML into HTML.  this.targetModel references the context model with
 * width/height attributes.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GmlRenderer(widgetNode, model) {
  // Inherit the WidgetBase functions and parameters
  var base = new WidgetBase(widgetNode, model,"absolute");
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Render the widget.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function() {
    this.stylesheet.setParameter("width", this.targetModel.getWindowWidth() );
    this.stylesheet.setParameter("height", this.targetModel.getWindowHeight() );
    bBox=this.targetModel.getBoundingBox();
    this.stylesheet.setParameter("bBoxMinX", bBox[0] );
    this.stylesheet.setParameter("bBoxMinY", bBox[1] );
    this.stylesheet.setParameter("bBoxMaxX", bBox[2] );
    this.stylesheet.setParameter("bBoxMaxY", bBox[3] );
  }

  // Call paint() when the context changes
  this.targetModel.addListener("modelChange",this.paint, this);
  this.targetModel.addListener("boundingBox",this.paint, this);
}
