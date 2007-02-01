/*
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: GoogleMapLayer.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/tool/GoogleMapTools.js");

/**
 * @constructor
 * @base MapLayer
 * @param model The model object that owns this MapPane's widget.
 * @param mapPane This mapPane's object.
 * @param layerName The name of this layer as a string.
 * @param layerNode The node object for this layer - using from the Context
 * document.
 * @param queryable True if this layer can be queried.
 * @param visible True if this layer is visible.
 */
function GoogleMapLayer(model, mapPane, layerName, layerNode, queryable, visible) {
  MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));
  //this.parse();
   
  //this.width  = layerNode.attributes.getNamedItem("width").nodeValue;
  //this.height = layerNode.attributes.getNamedItem("height").nodeValue;
  
  //var div = this.getDiv();
  
  //this.paint();

/**
  * Make sure we have a div to insert all the elements
  * @param layerNum The position of this layer in the LayerList.
  */
  this.getDiv = function(layerNum) {
  var outputNode = document.getElementById( this.mapPane.outputNodeId ).parentNode;
  
  div = document.getElementById(this.layerName);
  if( div == null) {
    div = document.createElement("div");
    div.setAttribute("id", this.layerName);
    div.style.position = "absolute";
    div.style.visibility = "visible";
    div.style.zIndex = layerNum*this.zIndexFactor;
    div.style.top=0;
    div.style.left=0;
    div.style.width=this.mapPane.model.getWindowWidth();
    div.style.height=this.mapPane.model.getWindowHeight();
    outputNode.appendChild( div );
  }
  return div;
 }

/**
  * Paint the layer.
  * @param objRef Pointer to widget object.
  * @param img can be ignored here (required for WMS layers)
  * @param layerNum The position of this layer in the LayerList.
  */
  this.paint = function(objRef,img,layerNum) {
  //TBD This should be moved to an initialisation function
  div=this.getDiv(layerNum);
  div.style.top=0;
  div.style.left=0;
  gmap=this.mapPane.model.getParam("gmap");
  if(!gmap){
    gmap = new GMap2(div);
    gmap.disableDragging();
    //gmap.disableInfoWindow();
    this.mapPane.model.setParam("gmap", gmap );
    this.mapPane.googleMapTools=new GoogleMapTools();
    this.mapPane.googleMapTools.centerAndZoom(this.mapPane.model);
    // Set the AOI to that used by Google Maps
    this.mapPane.googleMapTools.useGoogleMapExtent(this.mapPane.model);

    // PatC Added to support lat/long to pixel conversion of Proj
    config.objects.gmap = gmap;
    config.objects.googleMapTools = this.mapPane.googleMapTools;
  }else{
    this.mapPane.googleMapTools.centerAndZoom(this.mapPane.model);
  }
  }
}
