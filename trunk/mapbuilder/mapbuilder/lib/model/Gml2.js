/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/Extent.js");

/**
 * Stores a GML document as defined by the Open GIS Consortium
 * http://opengis.org and extensions the the WMC.  A unique Id is included for
 * each layer which is used when referencing Dynamic HTML layers in MapPane.
 * Gml2 extends ModelBase, which extends Listener.
 *
 * Listener Parameters used:
 * "aoi" - ((upperLeftX,upperLeftY),(lowerRigthX,lowerRigthY)),
 *
 * @constructor
 * @author Cameron Shorter
 * @requires Sarissa
 * @param url Url of Gml2 document
 * @param id ID referencing this Gml2 object
 * @see ModelBase
 * @see Listener
 */
function Gml2(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(modelNode, parent);
  for (sProperty in modelBase) { 
    this[sProperty] = modelBase[sProperty]; 
  }

  // ===============================
  // Update of GML2 Parameters
  // ===============================

  /**
   * Get the BoundingBox.
   * @return BoundingBox array in form (xmin,ymin,xmax,ymax).
   */
  this.getBoundingBox=function() {
    // Extract BoundingBox from the document
    var boundingBox = this.doc.selectSingleNode("/ntslookup/gml:boundedBy/gml:Box/gml:coordinates");
    if ( boundingBox ) {
      var corners = boundingBox.firstChild.nodeValue.split(" ",2);
      var bbox = new Array();
      var minCorner = corners[0].split(",",2);
      var maxCorner = corners[1].split(",",2);
      bbox[0]=parseFloat(minCorner[0]);
      bbox[1]=parseFloat(minCorner[1]);
      bbox[2]=parseFloat(maxCorner[0]);
      bbox[3]=parseFloat(maxCorner[1]);
      return bbox;
    } else {
      alert("error getting GML2 bounding box");
    }
  }

  /**
   * Set the BoundingBox and notify intererested widgets that BoundingBox has changed.
   * @param boundingBox array in form (xmin, ymin, xmax, ymax).
   */
  this.setBoundingBox=function(boundingBox) {
    // Set BoundingBox in the GML
    //TBD
    // Call the listeners
    this.callListeners("boundingBox");
  }

  /**
   * Get the Window width.
   * @return width The width of map window (therefore of map layer images).
   */
  this.getWindowWidth=function() {
    return this.width;
  }

  /**
   * Set the Window width.
   * @param width The width of map window (therefore of map layer images).
   */
  this.setWindowWidth=function(width) {
    this.width = width;
  }

  /**
   * Get the Window height.
   * @return height The height of map window (therefore of map layer images).
   */
  this.getWindowHeight=function() {
    return this.height;
  }

  /**
   * Set the Window height.
   * @param height The height of map window (therefore of map layer images).
   */
  this.setWindowHeight=function(height) {
    this.height = height;
  }
}

