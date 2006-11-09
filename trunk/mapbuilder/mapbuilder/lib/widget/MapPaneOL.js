/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: MapPane.js 1918 2006-02-13 22:31:26 -0500 (Mon, 13 Feb 2006) cappelaere $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Widget to render a map from an OGC context document.  The layers are
 * rendered using http://openlayers.org .
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapPaneOL(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
	
	//TBD Do we need MapContainerBase?
  MapContainerBase.apply(this,new Array(widgetNode, model));

  //loading img to be displayed while models load
  var loadingSrc = widgetNode.selectSingleNode("mb:loadingSrc");
  if (loadingSrc) {
    this.loadingSrc = config.skinDir + loadingSrc.firstChild.nodeValue;
  } else {
    this.loadingSrc = config.skinDir + "/images/Loading.gif";
  }

  this.model.addListener("refresh",this.paint, this);
  this.model.addListener("hidden",this.hidden, this);
  //this.model.addListener("addLayer",this.addLayer, this);
  this.model.addListener("deleteLayer",this.deleteLayer, this);
  this.model.addListener("moveLayerUp",this.moveLayerUp, this);
  this.model.addListener("moveLayerDown",this.moveLayerDown, this);
  //this.model.addListener("newModel",this.clearWidget2,this);
  //this.model.addListener("bbox",this.clearWidget2,this);
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
MapPaneOL.prototype.paint = function(objRef, refresh) {
  // Create an OpenLayers map
  if(!objRef.oLMap){
		//objRef.oLMap = new OpenLayers.Map(objRef.node, {controls:[]});
		objRef.oLMap = new OpenLayers.Map(objRef.node);
    // loop through all layers and create OLLayers 
    var layers = objRef.model.getAllLayers();
		objRef.oLlayers = new Array();
    for (var i=0;i<layers.length;i++) {
			service=layers[i].selectSingleNode("wmc:Server/@service");service=(service)?service.nodeValue:"";
	  	title=layers[i].selectSingleNode("wmc:Title");title=(title)?title.firstChild.nodeValue:"";
			name2=layers[i].selectSingleNode("wmc:Name");name2=(name2)?name2.firstChild.nodeValue:"";
		  href=layers[i].selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");href=(href)?href.firstChild.nodeValue:"";
	  	format=layers[i].selectSingleNode("wmc:FormatList/wmc:Format");format=(format)?format.firstChild.nodeValue:"image/gif";
			switch(service){
				case "gml":
				case "OGC:GML":
				  break;
			  case "wms":
				case "OGC:WMS":
         // OpenLayers expects the base layer to be non-transparent (it gets
				 // projection info from the baselayer).
				 // See Issue http://trac.openlayers.org/ticket/390
				 baseLayer=(i==0)?true:false;
         objRef.oLlayers[name2]= new OpenLayers.Layer.WMS(
				   title,
					 href,
					 {
					   layers: name2,
					   transparent: "true",
						 format: format
					 },{
						 isBaseLayer:baseLayer,
						 buffer:1
					 }
				 );
				 objRef.oLMap.addLayers([objRef.oLlayers[name2]]);
					
				  break;
			  default:
				  alert("MapPaneOL: No support for layer type="+service);
			}
    }
		bbox=objRef.model.getBoundingBox();
		objRef.oLMap.zoomToExtent(new OpenLayers.Bounds(bbox[0],bbox[1],bbox[2],bbox[3]));
		objRef.hidden(objRef,name2);
	}
}

/**
 * Hide/unhide a layer. Called by Context when the hidden attribute changes.
 * @param objRef Pointer to widget object.
 * @param layerName Name of the layer to hide/unhide.
 */
MapPaneOL.prototype.hidden = function(objRef, layerName) {
	vis=objRef.model.getHidden(layerName)!="1";
	objRef.oLlayers[layerName].setVisibility(vis);
}

/**
  * returns layer node from LayerMgr
  * @param layerName The layer Id.
  */
MapPaneOL.prototype.getLayer = function(layerName) {
  return this.MapLayerMgr( layerName );
}

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
MapPaneOL.prototype.getLayerDivId = function(layerName) {
  return this.model.id +"_"+ this.id +"_"+ layerName; //TBD: add in timestamps
}

/**
 * Removes a layer from the output
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPaneOL.prototype.deleteLayer = function(objRef, layerName) {
  var imgDivId = objRef.getLayerDivId(layerName); 
  if( imgDivId != null ) {
    var imgDiv = document.getElementById(imgDivId);
    if( imgDiv != null ) {
      var outputNode = document.getElementById( objRef.outputNodeId );
      outputNode.removeChild(imgDiv);
    }
  }
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS anme for the layer to be removed
 */
MapPaneOL.prototype.moveLayerUp = function(objRef, layerName) {
  var outputNode = document.getElementById( objRef.outputNodeId );
  var imgDivId = objRef.getLayerDivId(layerName); 
  var movedNode = document.getElementById(imgDivId);
  var sibNode = movedNode.nextSibling;
  if (!sibNode) {
    alert("can't move node past beginning of list:"+layerName);
    return;
  }
  outputNode.insertBefore(sibNode,movedNode);
}

/**
 * Moves a layer up in the stack of map layers
 * @param objRef Pointer to this object.
 * @param layerName the WMS name for the layer to be removed
 */
MapPaneOL.prototype.moveLayerDown = function(objRef, layerName) {
  var outputNode = document.getElementById( objRef.outputNodeId );
  var imgDivId = objRef.getLayerDivId(layerName); 
  var movedNode = document.getElementById(imgDivId);
  var sibNode = movedNode.previousSibling;
  if (!sibNode) {
    alert("can't move node past end of list:"+layerName);
    return;
  }
  outputNode.insertBefore(movedNode,sibNode);
}

/**
 * This function is called when a new Context is about to be loaded
 * - it deletes all the old layers so new ones can be loaded.
 * TBD: This should be renamed to clearWidget, except inheritence
 * is not working if we do that and it doesn't get called.
 * @param objRef Pointer to this object.
 */
MapPaneOL.prototype.clearWidget2 = function(objRef) {
  objRef.MapLayerMgr.deleteAllLayers();
}



