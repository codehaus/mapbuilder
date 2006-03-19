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
  
  this.paint();
}

/**
  * Should not be necessary but it does not seem to inherit it for somereason!
  */
GoogleMapLayer.prototype.isWmsLayer = function() {
  return false;
}


/**
  * Make sure we have a div to insert all the elements
  */
/*
GoogleMapLayer.prototype.getDiv = function() {
  var outputNode = document.getElementById( this.mapPane.outputNodeId ).parentNode;
  
  var div = document.getElementById("vector_elements");
  if( div == null) {
    div = document.createElement("div");
    div.setAttribute("id", "vector_elements");
    //div.setAttribute("name", this.title);
    div.style.position = "absolute";
    div.style.visibility = "visible";
    div.style.zIndex = 300;
    outputNode.appendChild( div );
  }
  return div;
}
*/

GoogleMapLayer.prototype.paint = function( ) {
  // emulate call from LayerManager
  alert("GoogleMapLayer.paint 1");
  this.paint( null, null );
}

/**
  * Paints the entry on the map based on its location and SLD
  * 
  * @param objRef Pointer to widget object.
  * @param img can be ignored here (required for WMS layers)
  */
GoogleMapLayer.prototype.paint = function( objRef, img ) {

  var outputNode = document.getElementById(this.mapPane.outputNodeId);
  //look for this widgets output and replace if found, otherwise
  //append it
  if (!outputNode) {
    tempNode = document.createElement("DIV");
    tempNode.style.position="absolute";
    tempNode.style.top=0;
    tempNode.style.left=0;
    tempNode.style.width=this.mapPane.model.getWindowWidth();
    tempNode.style.height=this.mapPane.model.getWindowHeight();
    tempNode.style.zindex=300;
    tempNode.setAttribute("id", this.mapPane.outputNodeId);
    this.mapPane.node.appendChild(tempNode);
  }
  //TBD This should be moved to an initialisation function
  if(!this.mapPane.gmap){
    //this.mapPane.gmap=new GMap(tempNode);
    this.mapPane.model.setParam("gmap",new GMap(tempNode));
    //this.mapPane.model.gmap=new GMap(tempNode);
    this.mapPane.googleMapTools=new GoogleMapTools();
  }

  this.mapPane.googleMapTools.centerAndZoom(this.mapPane.model);
}

