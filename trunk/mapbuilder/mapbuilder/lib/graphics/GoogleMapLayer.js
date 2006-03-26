/*
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
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
}

/**
  * Should not be necessary but it does not seem to inherit it for somereason!
  */
GoogleMapLayer.prototype.isWmsLayer = function() {
  return false;
}


/**
  * Make sure we have a div to insert all the elements
  * @param layerNum The position of this layer in the LayerList.
  */
GoogleMapLayer.prototype.getDiv = function(layerNum) {
  var outputNode = document.getElementById( this.mapPane.outputNodeId ).parentNode;
  
  var div = document.getElementById("googleMap");
  if( div == null) {
    div = document.createElement("div");
    div.setAttribute("id", "googleMap");
    //alert("GoogleMapLayer id="+this.mapPane.outputNodeId+" name="+this.title);
    //div.setAttribute("id", this.mapPane.outputNodeId);
    //div.setAttribute("name", this.title);
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
GoogleMapLayer.prototype.paint = function( objRef,img,layerNum) {
  //TBD This should be moved to an initialisation function
  div=this.getDiv(layerNum);
  div.style.top=0;
  div.style.left=0;
  if(!this.mapPane.gmap){
    this.mapPane.model.setParam("gmap",new GMap(div));
    this.mapPane.googleMapTools=new GoogleMapTools();
  }

  this.mapPane.googleMapTools.centerAndZoom(this.mapPane.model);
}

