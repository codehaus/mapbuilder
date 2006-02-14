/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/StyledLayerDescriptor.js");
mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");
mapbuilder.loadScript(baseDir+"/widget/TipObject.js");

function RssLayer(model, mapPane, layerName, layerNode, queryable, visible) {
  MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));
  this.parse();
 
  var div = this.getDiv(); 
  
  this.width   = layerNode.attributes.getNamedItem("width").nodeValue;
  this.height  = layerNode.attributes.getNamedItem("height").nodeValue;
  
  this.gr = new VectorGraphics(this.id, div, this.width, this.height );
 
  this.paint();
  
  // model here is not geoRss but OwsContext sooooo
  config.objects.geoRSS.addListener("highlightFeature",this.highlight, this);
  config.objects.geoRSS.addListener("dehighlightFeature",this.dehighlight, this);
   
  this.tooltip = config.objects.geoRSS.tipWidgetId;
  
  
}

/**
  * Should not be necessary but it does not seem to inherit it for somereason!
  */
RssLayer.prototype.isWmsLayer = function() {
  return false;
}

/**
  * Parses the entry and extracts the coordinates out of the GML location
  * So we know geometry type and coordinates
  */
RssLayer.prototype.parse = function() {
  var namespace = "xmlns:wmc='http://www.opengis.net/context' xmlns:sld='http://www.opengis.net/sld' xmlns:xlink='http://www.w3.org/1999/xlink'";
  var doc = this.layerNode.ownerDocument;
  Sarissa.setXpathNamespaces(doc, namespace);

  this.id     = this.layerNode.attributes.getNamedItem("id").nodeValue;
  this.layerName = this.id;
  
  var styleNode  = this.layerNode.selectSingleNode("//wmc:StyleList" );
  var hiliteStyleNode =  styleNode.selectSingleNode("//wmc:Style[wmc:Name='Highlite']");
  var normalStyleNode =  styleNode.selectSingleNode("//wmc:Style[wmc:Name='Normal']");
  
  this.normalSld    = new StyleLayerDescriptor( normalStyleNode );
  this.hiliteSld    = new StyleLayerDescriptor( hiliteStyleNode );
  
  this.title = this.layerNode.selectSingleNode("//wmc:Title" ).firstChild.nodeValue;
  var node = this.layerNode.selectSingleNode("//wmc:Abstract" );
  var children = node.childNodes;
  this.abstract = "" ;
  for( var j=0; j<children.length; j++) { 
    this.abstract += Sarissa.serialize( children[j] );
  }
  
  node = this.layerNode.selectSingleNode("//wmc:Where" );
  var type = node.firstChild;
  if( type != undefined ) {
	this.gmlType = type.nodeName;
	      
	if( this.gmlType == "gml:Point" ) {
	  var pos = type.firstChild;
	  this.coords = pos.firstChild.nodeValue;
	} else if( this.gmlType == "gml:LineString" ) {
	  var posList = type.firstChild;
	  var children = posList.childNodes;       
	  var count = children.length;
	  this.coords="";     
	  for( var j=0; j<count; j++ ) {
	    this.coords += children[j].nodeValue;
	  }
	} else if( this.gmlType == "gml:Polygon" ) {
	  var ext = type.firstChild;
	  var linearRing = ext.firstChild;
	  this.coords = linearRing.firstChild.nodeValue;
	} else {
	  alert ("Unsupported GML Geometry:"+ this.gmlType )
	}
  } else {
    this.coords = null;
    // well, it is probably a flick entry.
    // we need to go back to flickr and get the tags
    var pid= this.layerNode.attributes.getNamedItem("pid").nodeValue;
    var url = "http://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=afbacfb4d14cd681c04a06d69b24d847&photo_id="+pid;
    var sUri = getProxyPlusUrl(url);
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", sUri, false);
    xmlHttp.send(null);
    // process the tags
    var latitude = 0;
    var longitude = 0;
    
    // Get the picture description
    // Commented out because of text wrapping issue within popup to clean up TBD...
    // var descr = xmlHttp.responseXML.selectSingleNode("//description").firstChild.nodeValue;
    // this.abstract += descr;
    
    // Check the Tags to get lat/long and role
    var tags =  xmlHttp.responseXML.selectNodes("//tag");
    if( tags.length == 0 ) { // what happened
      alert(Sarissa.serialize(xmlHttp.responseXML));
    }
    
    this.abstract += "<br/>"
    
    for (var i=0; i<tags.length; ++i) {
      var raw= tags[i].attributes.getNamedItem("raw").nodeValue;
      //alert( raw );
      if( raw.indexOf( "geo:lat=") >= 0 ) {
        latitude = raw.substr(8);
        this.abstract += "lat:"+latitude+"<br/>";
      } else if( raw.indexOf( "geo:long=") >= 0 ) {
        longitude = raw.substr(9);
        this.abstract += "long:"+longitude+"<br/>";
      }
    }
    
    this.gmlType = "gml:Point";
    this.coords = longitude + "," + latitude;
  }
}

/**
  * Renders the GML point
  *
  * @param objRef
  * @param sld SLD
  * @param hiliteOnly true to avoid full redraw
  */
RssLayer.prototype.paintPoint = function( sld, hiliteOnly) {
   
  if( hiliteOnly ) {
    sld.hilitePoint( this.gr, this.shape );
  } else {
    if( this.coords != null ) {
      var containerProj = new Proj(this.model.getSRS());
      var point = this.coords.split(/[ ,\n]+/);
      point = containerProj.Forward(point);
      point = this.model.extent.getPL(point);
      //alert( this.coords + " " + point[0] + " " + point[1] );
      this.shape = sld.paintPoint( this.gr, point );
      this.shape.id = this.id+"_vector";
      this.gr.paint();
     
      this.install( this.shape );
    }
  }      
}

/**
  * Renders the GML Polygon
  *
  * @param style SLD
  * @param hiliteOnly true to avoid full redraw
  */
RssLayer.prototype.paintPolygon = function( sld, hiliteOnly) {
 
  if( hiliteOnly ) {
    sld.hilitePolygon(this.gr, this.shape);
  } else {
    var containerProj = new Proj(this.model.getSRS());
    var pointPairs = this.coords.split(/[ ,\n]+/);
            
    var newPointArr = new Array( pointPairs.length/2 );
    var point = new Array(2);
    var screenCoords;
            
    var jj=0;
            
    for( var i=0; i<pointPairs.length; i++ ) {
              
      point[0] = pointPairs[i];
      point[1] = pointPairs[i+1];
              
      screenCoords = containerProj.Forward(point);
      screenCoords = this.model.extent.getPL(screenCoords);
      newPointArr[jj] = screenCoords;  
               
      jj++     
      i++;
    }   
  
    this.shape    = sld.paintPolygon( this.gr, newPointArr );
    this.shape.id = this.id+"_vector";
    this.gr.paint();
  
    this.install( this.shape );
  }
}

/**
  * Renderd the GML LineString
  *
  * @param objRef
  * @param sld SLD Object
  * @param hiliteOnly true to avoid full redraw
  */
RssLayer.prototype.paintLine = function( sld, hiliteOnly) {
  
  if( hiliteOnly ) {
    sld.hiliteLine( this.gr, this.shape );
  } else {
    var containerProj = new Proj(this.model.getSRS());
    var pointPairs    = this.coords.split(/[ ,\n]+/);
            
    var newPointArr = new Array( pointPairs.length/2 );
    var point = new Array(2);
    var screenCoords;
            
    var jj=0;
            
    for( var i=0; i<pointPairs.length; i++ ) {          
      point[0] = pointPairs[i];
      point[1] = pointPairs[i+1];
              
      screenCoords = containerProj.Forward(point);
      screenCoords = this.model.extent.getPL(screenCoords);
      newPointArr[jj] = screenCoords;  
               
      jj++     
      i++;
    }   
 
 
    this.shape = sld.paintLine( this.gr, newPointArr );
    
    this.shape.id = this.id +"_vector";
    this.gr.paint();
  
    this.install( this.shape );
  }   
}

/**
  * Creates the wrapping div
  *
  * @param objRef
  * @param style SLD
  * @param hiliteOnly true to avoid full redraw
  */
/*
RssLayer.prototype.createDiv = function() {
  // Check if it does not exist yet, if so delete old one
  var outputNode = document.getElementById( this.mapPane.outputNodeId ).parentNode;
  var div = document.getElementById(this.id);
  if( div != null) {
   //outputNode.removeChild( div );
    div.parentNode.removeChild( div );
  }
   
  div = document.createElement("div");
  div.setAttribute("id", this.id);
  div.setAttribute("name", this.title);
  div.style.position = "absolute";
  div.style.visibility = "visible";
  div.style.zIndex = 300;
  
  this.div = div;
  outputNode.appendChild( div );

  return div;
}
*/

RssLayer.prototype.getDiv = function() {
  // Check if it does not exist yet, if so delete old one
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

/*
RssLayer.prototype.deleteDiv = function() {
 // delete previous div if found
 var outputNode = document.getElementById( this.mapPane.outputNodeId ).parentNode; 
 var div = document.getElementById(this.id);
 if( div != null ) {
   //alert( "removed "+this.id +' from ' + this.mapPane.outputNodeId );
   outputNode.removeChild( div );
   //document.removeChild( div );
 } else {
   //alert( "div:"+this.id+" not found" );
 }
}
*/

/**
  * Paints the entry on the map based on its location and SLD
  * 
  * @param objRef Pointer to widget object.
  * @param img can be ignored here (required for WMS layers)
  */
RssLayer.prototype.paint = function( objRef, img ) {
  var id = this.id + "_vector";
  var vector = document.getElementById(id);
  if( vector != null )
    vector.parentNode.removeChild( vector );
    
  //var style =  this.style.selectSingleNode("//wmc:Style[wmc:Name='Normal']");
  this.paintShape(this.normalSld, false );
}

/**
  * Paints the right GML shape
  *
  * @param style SLD
  * @param hiliteOnly true if hilite (room for future optimization)
  */
RssLayer.prototype.paintShape = function( sld, hiliteOnly ) {
  
  if( this.gmlType == "gml:Point" ) {
    this.paintPoint( sld, hiliteOnly);
  } else if( this.gmlType == "gml:LineString" ) {
    this.paintLine( sld, hiliteOnly);
  } else if( this.gmlType == "gml:Polygon" ) {
    this.paintPolygon( sld, hiliteOnly);
  }   
}

/**
  * installs the mouseover/mouseout handlers
  */
RssLayer.prototype.install = function( shape ) {
  shape.onmouseover = this.mouseOverHandler; 
  shape.onmouseout  = this.mouseOutHandler;
}

/** 
  * handler is attached to the shape itself
  * puts event inthe queue to be picked later
  */
RssLayer.prototype.mouseOverHandler = function(ev) {
  config.objects.geoRSS.setParam('highlightFeature',this.id);
  
  return true;
}

RssLayer.prototype.mouseOutHandler = function(ev) {  
  config.objects.geoRSS.setParam('dehighlightFeature',this.id);
  return true;
}
  
/** 
  * Highlights the selected feature by switching to the highlight image
  * @param objRef a pointer to this widget object
  */
RssLayer.prototype.highlight = function(objRef, featureId) {
  // we get the id_vector
  if( featureId.indexOf( objRef.id ) >= 0 ) {
    objRef.paintShape( objRef.hiliteSld, true );
    //var objRef = window.cursorTrackObject;
    
    var evPL =  window.cursorTrackNode.evpl;
    if( evPL != null ) {
      var X = evPL[0];
      var Y = evPL[1];
  
      // set the popup text with stylesheet output
      var popupStr = objRef.abstract;
      if( popupStr == undefined ) {
        popupStr = "Feature under construction.  Stay tuned!";
      }
    
      if( X>0 && X < objRef.width && Y>0 && Y<objRef.height ) {
        // make sure we are in the map
        toolTipObjs[objRef.tooltip].paint( new Array(X, Y, 200, objRef.title, popupStr ));
      }
    }
  }
}

/** Dehighlights the selected feature by switching to the highlight image
  * @param objRef a pointer to this widget object
  */
RssLayer.prototype.dehighlight = function(objRef, featureId) {
  if( featureId.indexOf(objRef.id)>= 0 ) {
    objRef.paintShape( objRef.normalSld, true );
    // clear popup
    toolTipObjs[objRef.tooltip].clear();
  }
}
