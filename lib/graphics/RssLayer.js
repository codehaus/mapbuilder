/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/StyledLayerDescriptor.js");
mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");
mapbuilder.loadScript(baseDir+"/widget/TipWidget.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");

function RssLayer(model, mapPane, layerName, layerNode, queryable, visible) {
    MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));

/**
  * Parses the entry and extracts the coordinates out of the GML location
  * So we know geometry type and coordinates
  */
    this.parse = function() {
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
    this.myabstract = "" ;
    for( var j=0; j<children.length; j++) { 
      this.myabstract += Sarissa.serialize( children[j] );
    }
  
    node = this.layerNode.selectSingleNode("//wmc:Where" );
    //alert( "RSSLayer node:"+Sarissa.serialize( node ));
    var type = node.firstChild;
    //alert( "RSSLayer type:"+Sarissa.serialize( type ));
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
	      this.coords = null;
	      var ext = type.firstChild;
	      var linearRing = ext.firstChild;
	      if(linearRing.firstChild) {
          this.posList = linearRing.firstChild;
          this.coords = this.posList.firstChild.nodeValue;
        }
	    } else if( this.gmlType == "gml:Box" || this.gmlType == "gml:Envelope" ) {
        var posList = type.firstChild;
        var children = posList.childNodes ;       
        var count = children.length;
        this.coords="";   
        var c= new Array();  
        //alert("about to split "+children[0].nodeValue);
        c = children[0].nodeValue.split(" "); 
        this.coords += c[0]+" "+c[1]+",\n"
                       +c[2]+" "+c[1]+",\n"
                       +c[2]+" "+c[3]+",\n"
                       +c[0]+" "+c[3]+",\n" 
                       +c[0]+" "+c[1];
      
        //alert("coords: "+this.coords);
       } else {
	       alert ("Unsupported GML Geometry:"+ this.gmlType )
	     }
    } else {
      this.coords = null;
      // well, it is probably a flick entry.
      // we need to go back to flickr and get the tags
      var pidNode = this.layerNode.attributes.getNamedItem("pid");
      if( pidNode != null ) {
        var pid = pidNode.nodeValue;
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
	      // this.myabstract += descr;
	    
	      // Check the Tags to get lat/long and role
	      var tags =  xmlHttp.responseXML.selectNodes("//tag");
	      if( tags.length == 0 ) { // what happened
	        alert(Sarissa.serialize(xmlHttp.responseXML));
	      }
	    
	      this.myabstract += "<br/>"
	    
	      for (var i=0; i<tags.length; ++i) {
	        var raw= tags[i].attributes.getNamedItem("raw").nodeValue;
	        //alert( raw );
	        if( raw.indexOf( "geo:lat=") >= 0 ) {
	          latitude = raw.substr(8);
	          this.myabstract += "lat:"+latitude+"<br/>";
	        } else if( raw.indexOf( "geo:long=") >= 0 ) {
	          longitude = raw.substr(9);
	          this.myabstract += "long:"+longitude+"<br/>";
	        }
	      }
	    
	      this.gmlType = "gml:Point";
	      this.coords = longitude + "," + latitude;
	    }
    }
  }

  this.isWmsLayer= function() {
    return false;
  }
  
/**
  * Renders the GML point
  *
  * @param sld SLD
  * @param hiliteOnly true to avoid full redraw
  */
  this.paintPoint = function( sld, hiliteOnly) {
   
    if( hiliteOnly ) {
      sld.hilitePoint( this.gr, this.shape );
    } else {
      if( this.coords != null ) {
        var containerProj = new Proj(this.model.getSRS());
        //alert("RssLayer.paintPoint SRS="+this.model.getSRS());
        var point = this.coords.split(/[ ,\n]+/);
        point = containerProj.Forward(point);
        //alert( this.coords + " forward:" + point[0] + " " + point[1] );
        
        var pointLine = this.model.extent.getPL(point);
    
        this.shape = sld.paintPoint( this.gr, pointLine );
        if( this.shape != null ) {
          this.shape.id = this.id+"_vector";
          this.gr.paint(); 
          this.install( this.shape );
        }
      }
    }      
  }

/**
  * Renders the GML Polygon
  *
  * @param style SLD
  * @param hiliteOnly true to avoid full redraw
  */
  this.paintPolygon = function( sld, hiliteOnly) {
 
    if( hiliteOnly ) {
      sld.hilitePolygon(this.gr, this.shape);
    } else {
      if( this.coords != null ) {
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
	        //alert( " poly forward:" + point[0] + " " + point[1] + " x:"+ screenCoords[0] + " y:"+screenCoords[1] );
	        screenCoords = this.model.extent.getPL(screenCoords);
	        //alert( " poly getPL:" + point[0] + " " + point[1] + " x:"+ screenCoords[0] + " y:"+screenCoords[1] );
	        newPointArr[jj] = screenCoords;  
	               
	        jj++;     
	        i++;
	      }   
	  
	    this.shape    = sld.paintPolygon( this.gr, newPointArr );
	    this.shape.id = this.id+"_vector";
	    this.gr.paint();
	  
	    this.install( this.shape );
    }
  }
  }

/**
  * Renderd the GML LineString
  *
  * @param objRef
  * @param sld SLD Object
  * @param hiliteOnly true to avoid full redraw
  */
  this.paintLine= function( sld, hiliteOnly) {
  
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
  * Make sure we have a div to insert all the elements
  * @param layerNum The position of this layer in the LayerList.
  */
  this.getDiv= function(layerNum) {
  var outputNode = document.getElementById( this.mapPane.outputNodeId ).parentNode;
  
  var div = document.getElementById("vector_elements");
  if( div == null) {
    div = document.createElement("div");
    div.setAttribute("id", "vector_elements");
    //div.setAttribute("name", this.title);
    div.style.position = "absolute";
    div.style.visibility = "visible";

    //div.style.zIndex = layerNum*this.zIndexFactor;
    div.style.zIndex = 600;

    outputNode.appendChild( div );
  }
  div.style.top=0;
  div.style.left=0;
  return div;
  }

/**
  * Internal paint method
  */
  this.paint= function( ) {
  // emulate call from LayerManager
  this.paint( null, null );
  }

/**
  * Paints the entry on the map based on its location and SLD
  * 
  * @param objRef Pointer to widget object.
  * @param img can be ignored here (required for WMS layers)
  */
  this.paint= function( objRef, img ) {
    this.deleteShape();
 
    //var style =  this.style.selectSingleNode("//wmc:Style[wmc:Name='Normal']");
    this.paintShape(this.normalSld, false );
  }

/**
  * We want to delete it before rendering it if it already exists
  * or when we want to remove that layer
  */
  this.deleteShape= function() {
  var id = this.id +"_vector";
  var node = document.getElementById( id );
  if( node != null ) {
    node.parentNode.removeChild( node );
    node = document.getElementById( id );
    if( node != null ) {
      // WHY WOULD THIS FAIL???????
      alert( "failed to remove:"+id );
    }
  }
 }

/**
  * Called by layer manager to clean the mayer
  */
  this.unpaint = function() {
	  this.deleteShape();
  }

/**
  * Paints the right GML shape
  *
  * @param style SLD
  * @param hiliteOnly true if hilite (room for future optimization)
  */
  this.paintShape= function( sld, hiliteOnly ) {
  
  if( this.gmlType == "gml:Point" ) {
     this.paintPoint( sld, hiliteOnly);
  } else if( this.gmlType == "gml:LineString" ) {
    this.paintLine( sld, hiliteOnly);
  } else if( this.gmlType == "gml:Polygon" || 
      this.gmlType == "gml:Envelope" ||
      this.gmlType == "gml:Box")  {
    this.paintPolygon( sld, hiliteOnly);
  }   
}

/**
  * Installs the mouseover/mouseout handlers
  * @param shape
  */
  this.install= function( shape ) {
    shape.onmouseover = this.mouseOverHandler; 
    shape.onmouseout  = this.mouseOutHandler;
    shape.onclick  = this.mouseClickHandler;
    //shape.setAttribute("onClick", " config.objects.geoRSS.setParam('highlightFeature',\'"+this.id+"\')" );
   }

/** 
  * Handler is attached to the shape itself
  * puts event in the queue to be picked later
  * @param ev
  */
  this.mouseOverHandler= function(ev) {
    var containerNode  = document.getElementById("mainMapContainer")
    if( containerNode) {
      containerNode.oldEventHandler = containerNode.onmouseup;
      containerNode.onmouseup = null; 
      containerNode.onmousedown = null; 
    }
    
    this.style.cursor = "help";
    //config.objects.geoRSS.setParam('highlightFeature',this.id);
    return true;
  }

/** 
  * Handler is attached to the shape itself
  * puts event in the queue to be picked later
  * @param ev
  */
  this.mouseOutHandler= function(ev) {  
    this.style.cursor = "default";
    var containerNode = document.getElementById("mainMapContainer")
    if( containerNode) {
      containerNode.onmouseup = containerNode.oldEventHandler;
      containerNode.onmousedown = containerNode.oldEventHandler;
    }
    //config.objects.geoRSS.setParam('dehighlightFeature',this.id);
    return true;
  }
  
  this.mouseClickHandler= function(ev) {  
 	  ev.cancelBubble = true;
	  if (ev.stopPropagation) ev.stopPropagation();
 
    config.objects.geoRSS.setParam('clickFeature',this.id);
        
    return true;
  }

  this.clickIt= function(objRef, featureId) {
  // we get the id_vector
  if( featureId.indexOf( objRef.id ) >= 0 ) {   
	  var posx = 0;
	  var posy = 0;
  
    var cn = window.cursorTrackNode;
    if( cn ) {    
	    var evPL =  cn.evpl;
	    if( evPL != null ) {
	      posx = evPL[0];
	      posy = evPL[1];
	  
	      // set the popup text with stylesheet output
	      var popupStr = objRef.myabstract;
	      if( popupStr == undefined ) {
	        popupStr = "Feature under construction.  Stay tuned!";
	      }
	    }
    }
  
	  if( posx>0 && posx < objRef.width && posy>0 && posy<objRef.height ) {
	    // make sure we are in the map
	    toolTipObjs[objRef.tooltip].paint( new Array(posx, posy, featureId, objRef.title, popupStr ));
	  }
  }
}

/** 
  * Highlights the selected feature by switching to the highlight image
  * @param objRef a pointer to this widget object
  * @param featureId
  */
  this.highlight= function(objRef, featureId) {
  // we get the id_vector
  if( featureId.indexOf( objRef.id ) >= 0 ) {
  
    objRef.paintShape( objRef.hiliteSld, true );
    
	  var posx = 0;
	  var posy = 0;
  
    var cn = window.cursorTrackNode;
    if( cn ) {    
	    var evPL =  cn.evpl;
	    if( evPL != null ) {
	      posx = evPL[0];
	      posy = evPL[1];
	  
	      // set the popup text with stylesheet output
	      var popupStr = objRef.myabstract;
	      if( popupStr == undefined ) {
	        popupStr = "Feature under construction.  Stay tuned!";
	      }
	    }
    }
  
	  if( posx>0 && posx < objRef.width && posy>0 && posy<objRef.height ) {
	    // make sure we are in the map
	    toolTipObjs[objRef.tooltip].paint( new Array(posx, posy, featureId, objRef.title, popupStr ));
	  }
  }
}
 
/** 
  * Dehighlights the selected feature by switching back to the normal image
  * @param objRef a pointer to this widget object
  * @param featureId
  */
  this.dehighlight= function(objRef, featureId) {
    if( featureId.indexOf(objRef.id)>= 0 ) {
    
      objRef.paintShape( objRef.normalSld, true );
 
      // clear popup
      toolTipObjs[objRef.tooltip].clear();
    }
  }
 
  this.parse();
  
  this.width   = layerNode.attributes.getNamedItem("width").nodeValue;
  this.height  = layerNode.attributes.getNamedItem("height").nodeValue;
  
  var div = this.getDiv();
  this.gr = new VectorGraphics(this.id, div, this.width, this.height );
  
  //this.paint();
  
  // model here is not geoRss but OwsContext sooooo
  config.objects.geoRSS.addListener("highlightFeature",this.highlight, this);
  config.objects.geoRSS.addListener("dehighlightFeature",this.dehighlight, this);
  config.objects.geoRSS.addListener("clickFeature",this.clickIt, this);
   
  this.tooltip = config.objects.geoRSS.tipWidgetId;
}

