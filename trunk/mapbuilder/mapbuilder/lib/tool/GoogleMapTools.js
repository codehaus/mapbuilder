/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: History.js 1824 2005-11-28 11:01:10Z graphrisc $
*/

// Ensure this object's dependancies are loaded.
//mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Functions for converting Extent to Google Map Zoom Levels.
 * @constructor
 * @base ToolBase
 */
function GoogleMapTools() {

  /**
   * Derive the Google ZoomLevel from current BBox, then call GoogleMap's
   * CenterAndZoom function.
   * @param model The context which stores the bounding box and screen size.
   * @param point The point to zoom to in geographic coords.
   * @param deltaZoom Zoom in/out by this delta in ZoomLevels.
   */
  this.zoomTo=function(model,point,deltaZoom){
    gmap=model.getParam("gmap");
    gmap.centerAndZoom(
      new GPoint(point[0],point[1]),
      gmap.getZoomLevel()+deltaZoom);
    bbox=gmap.getBoundsLatLng();
    model.setBoundingBox(new Array(bbox.minX,bbox.minY,bbox.maxX,bbox.maxY));
  }

  /**
   * Derive the Google ZoomLevel from current BBox, then call GoogleMap's
   * CenterAndZoom function.
   * @param model The context which stores the bounding box and screen size.
   */
  this.centerAndZoom=function(model){
    this.centerAndZoomToBox(model,model.getBoundingBox());
  }

  /**
   * Use Google Map code to adjust the Bounding Box.
   * @param model The context which stores the bounding box.
   * @param bbox The original bbox to adjust.
   */
  this.setGmapExtent=function(model,bbox){
    this.centerAndZoomToBox(model,bbox);
    gmap=model.getParam("gmap");
    bbox=gmap.getBoundsLatLng();
    model.setBoundingBox(new Array(bbox.minX,bbox.minY,bbox.maxX,bbox.maxY));
  }

  /**
   * Derive the Google ZoomLevel then call GoogleMap's CenterAndZoom function.
   * @param model The context which stores the bounding box and screen size.
   */
  this.centerAndZoomToBox=function(model,bbox){
    pxWidth=model.getWindowWidth();
    pxHeight=model.getWindowHeight();
    degWidth=Math.abs(bbox[2]-bbox[0]);
    degHeight=Math.abs(bbox[3]-bbox[1]);
    zoomLevel=this.getZoomLevel(pxWidth,degWidth);
    gmap=model.getParam("gmap");
    // Note, this makes the incorrect assumption that the Y axis is linear,
    // but this calculation should be good enough.
    gmap.centerAndZoom(
      new GPoint(
        (bbox[2]+bbox[0])/2,
        (bbox[3]+bbox[1])/2),
      zoomLevel);
  }

  /**
   * Calculate Google Map ZoomLevel.
   * Google Map uses the Mercator projection.  Details about the projection at
   * http://mathworld.wolfram.com/MercatorProjection.html
   * Credit to Schuyler Erle for the following algorithm:<br>
   * At zoom level 17, a single pixel covers ~ 1.46025 longitudinal degrees.<br>
   * Each zoom level halves the horizontal
   * resolution (degrees/pixel). Note that we use longitudinal degrees, and
   * not latitudinal, because the latter does not have this property.
   * Therefore, the zoom level is a logarithmic measure of the form:<br>
   *   zoomLevel = 17 - log2(1.46025 / (degWidth / pxWidth))
   */
  this.getZoomLevel=function(pxWidth,degWidth){
    zoomLevel=17-Math.floor(Math.log(1.46025 * pxWidth / degWidth)/Math.log(2));
    return zoomLevel;
  }

  /**
    * Returns absolute pixels coordinates on the map from Lat/Long
    *
    */
  this.getPixelsFromLatLong = function( coords ) {
    gmap = config.objects.gmap;
    
    var west   = gmap.getBounds().getSouthWest().lng();
    var north  = gmap.getBounds().getNorthEast().lat();
    var nwpoint= gmap.getCurrentMapType().getProjection().fromLatLngToPixel(new GLatLng(north,west),gmap.getZoom()); 
    
    var gLatLng = new GLatLng(coords[1], coords[0]);      
    var pixel= gmap.getCurrentMapType().getProjection().fromLatLngToPixel( gLatLng, gmap.getZoom());
 
    var x = pixel.x - nwpoint.x;
    var y = pixel.y - nwpoint.y;
    
    return new Array(x, y) ;
  }
  
  /**
   * Find a ZoomLevel and new extent which fits the provided screen coords,
   * then update the model with the new extent and zoomLevel.  Coorinates are
   * provided in screen pixel coordinates.
   * @param model The context object to update
   * @param minX Screen coordinate in pixcels.
   * @param maxX Screen coordinate in pixcels.
   * @param minY Screen coordinate in pixcels.
   * @param maxY Screen coordinate in pixcels.
   */
   /*
  this.moveToBox=function(model,minX,minY,maxX,maxY) {
    // Calculate the zoomIn ratio making sure the hole bounding box in included
    // in the new zoomed in area.
    // Note, this algorithm is not perfect, because the Y axis is not linear.
    pxWidth=model.getWindowWidth();
    pxHeight=model.getWindowHeight();
    zoomInRatio=Math.max(
      Math.abs((maxX-minX)/pxWidth),
      Math.abs((maxY-minY)/pxHeight));

    bbox=model.getBoundingBox();
    degWidth=zoomInRatio*(bbox[2]-bbox[0]);
    degHeight=zoomInRatio*(bbox[3]-bbox[1]);

    // Calculate the new center point
    // This makes the incorrect assumption that the Y axis is linear.
    midX=bbox[0]+(minX+maxX)/2/pxWidth*(bbox[2]-bbox[0]);
    midY=bbox[1]+(minY+maxY)/2/pxHeight*(bbox[3]-bbox[1]);
    
    newBbox=new Array(
      midX-degWidth/2,
      midY-degHeight/2,
      midX+degWidth/2,
      midY+degHeight/2);

    this.centerAndZoomToBox(model,model.getBoundingBox());
  }
  */
}
