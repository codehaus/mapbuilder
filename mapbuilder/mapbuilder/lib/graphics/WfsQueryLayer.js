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

function WfsQueryLayer(model, mapPane, layerName, layerNode, queryable, visible) {
    MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));

  // marker for events
  this.id = "WfsQueryLayer";
  this.model = model;
  
  // unique layer id
  this.uuid = layerNode.getAttribute("id");
  this.featureCount = 0;
  
/**
  * Parses the entry and extracts the coordinates out of the GML location
  * So we know geometry type and coordinates
  */
  this.parse = function() {
    var namespace = "xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:sld='http://www.opengis.net/sld' xmlns:xlink='http://www.w3.org/1999/xlink'";
    var doc = this.layerNode.ownerDocument;
    Sarissa.setXpathNamespaces(doc, namespace);
    //alert( "wfsparse:"+Sarissa.serialize(this.layerNode))
    var styleNode  = this.layerNode.selectSingleNode("wmc:StyleList" );
    if( styleNode == null ) alert( "cannot find style node")
    
    var hiliteStyleNode =  styleNode.selectSingleNode("wmc:Style[wmc:Name='Highlite']");
    var normalStyleNode =  styleNode.selectSingleNode("wmc:Style[wmc:Name='Normal']");
  
    this.normalSld    = new StyleLayerDescriptor( normalStyleNode );
    this.hiliteSld    = new StyleLayerDescriptor( hiliteStyleNode );
  
    this.title = this.layerNode.selectSingleNode("wmc:Title" ).firstChild.nodeValue;
   
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
        var containerProj = new Proj(this.model.containerModel.getSRS());
        //alert("RssLayer.paintPoint SRS="+this.model.getSRS());
        var re=RegExp('[, \n\t]+','g');
        var point = this.coords.split(re);
        point = containerProj.Forward(point);
        //alert( this.coords + " forward:" + point[0] + " " + point[1] );
        
        var pointLine = this.model.containerModel.extent.getPL(point);
    
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
        var containerProj = new Proj(this.model.containerModel.getSRS());
        var re=RegExp('[, \n\t]+','g');
        var pointPairs = this.coords.split(re);
                
        var newPointArr = new Array( pointPairs.length/2 );
        var point = new Array(2);
        var screenCoords;
                
        var jj=0;
                
        for( var i=0; i<pointPairs.length; i++ ) {
                  
          point[0] = pointPairs[i];
          point[1] = pointPairs[i+1];
                  
          screenCoords = containerProj.Forward(point);
            //alert( " poly forward:" + point[0] + " " + point[1] + " x:"+ screenCoords[0] + " y:"+screenCoords[1] );
          screenCoords = this.model.containerModel.extent.getPL(screenCoords);
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
      var containerProj = new Proj(this.model.containerModel.getSRS());
      var re=RegExp('[, \n\t]+','g');
      var pointPairs    = this.coords.split(re);
                
      var newPointArr = new Array( pointPairs.length/2 );
      var point = new Array(2);
      var screenCoords;
                
      var jj=0;
                
      for( var i=0; i<pointPairs.length; i++ ) {          
        point[0] = pointPairs[i];
        point[1] = pointPairs[i+1];
                  
        screenCoords = containerProj.Forward(point);
        screenCoords = this.model.extent.containerModel.getPL(screenCoords);
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
 
    this.deletePreviousFeatures();
 
    var nodeList = this.model.getFeatureNodes();
    
    for( var i=0; i<nodeList.length; i++) {
      featureNode = nodeList[i]
      type = this.model.getFeatureGeometry( featureNode )
         
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
	    }
	    
	    this.id = "wfs_"+this.uuid+"_"+i 
      
      //this.deleteShape();
      this.paintShape(this.normalSld, false );
    }
    this.featureCount = nodeList.length;
  }

/**
  * We want to delete it before rendering it if it already exists
  * or when we want to remove that layer
  */
  this.deleteShape= function() {
    var id = this.id +"_vector";
    var node = document.getElementById( id );
    while( node != null ) {
      var parentNode = node.parentNode;
      //alert( "bfore:"+Sarissa.serialize(parentNode))
      parentNode.removeChild( node );
      node = document.getElementById( id );
    }
 }
 
 /**
  * When we redo a search, we need to erase old entries
  */
  this.deletePreviousFeatures = function() {
    for( var i=0; i< this.featureCount; i++) {
 	    this.id = "wfs_"+this.uuid+"_"+i 
      this.deleteShape()
    }
  }

/**
  * Called by layer manager to clean the mayer
  */
  this.unpaint = function() {
    var nodeList = this.model.getFeatureNodes(); 
    for( var i=0; i<nodeList.length; i++) {
  	  this.id = "wfs_"+ this.uuid + "_" + i 
  	  this.deleteShape();
    }
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
    shape.onmouseup   = this.mouseClickHandler;
    shape.model = this.model.id; 
   }

/** 
  * Handler is attached to the shape itself
  * puts event in the queue to be picked later
  * @param ev
  */
  this.mouseOverHandler= function(ev) {
    var idAttr = this.getAttribute("id").split("_")
    var id = idAttr[2]
 
    var containerNode  = document.getElementById("mainMapContainer")
    if( containerNode) {
      containerNode.oldEventHandler = containerNode.onmouseup;
      containerNode.onmouseup = null; 
      containerNode.onmousedown = null; 
    }
    
    this.style.cursor = "help";
    
    //config.objects[this.model].setParam('highlightFeature',id);
    return true;
  }

/** 
  * Handler is attached to the shape itself
  * puts event in the queue to be picked later
  * @param ev
  */
  this.mouseOutHandler= function(ev) {  
    this.style.cursor = "default";
    var idAttr = this.getAttribute("id").split("_")
    var id = idAttr[2]

    var containerNode = document.getElementById("mainMapContainer")
    if( containerNode) {
      containerNode.onmouseup = containerNode.oldEventHandler;
      containerNode.onmousedown = containerNode.oldEventHandler;
    }
 
    this.style.cursor = "default";
    //config.objects[this.model].setParam('dehighlightFeature',id);
    return true;
  }
  
  /**
   * Handle single click
   */
  this.mouseClickHandler= function(ev) { 
    var idAttr = this.getAttribute("id").split("_")
    var id = idAttr[2]

    config.objects[this.model].setParam('clickFeature',id);
    return true;
  }

  /**
   * Actual Click handler
   */
  this.clickIt= function(objRef, featureId) {
     
    var nodeList = objRef.model.getFeatureNodes();
    var node = nodeList[featureId];
    
	toolTipObjs[objRef.tooltip].paintXSL( node );
  }
  

/** 
  * Highlights the selected feature by switching to the highlight image
  * @param objRef a pointer to this widget object
  * @param featureId
  */
  this.highlight= function(objRef, featureId) {
      
    objRef.paintShape( objRef.hiliteSld, true );
    var nodeList = objRef.model.getFeatureNodes();
    var node = nodeList[featureId];
    
    toolTipObjs[objRef.tooltip].paintXSL( node );
  }
 
/** 
  * Dehighlights the selected feature by switching back to the normal image
  * @param objRef a pointer to this widget object
  * @param featureId
  */
  this.dehighlight= function(objRef, featureId) {
    objRef.paintShape( objRef.normalSld, true );
 
    // clear popup
    toolTipObjs[objRef.tooltip].clear();
  }
 
  this.parse();
  
  this.width   = null; //layerNode.attributes.getNamedItem("width").nodeValue;
  this.height  = null; //layerNode.attributes.getNamedItem("height").nodeValue;
  
  var div = this.getDiv();
  this.gr = new VectorGraphics(this.id, div, this.width, this.height );
  
  //this.paint();
  
  // model here is not geoRss but OwsContext sooooo
  config.objects[this.model.id].addListener("highlightFeature",this.highlight, this);
  config.objects[this.model.id].addListener("dehighlightFeature",this.dehighlight, this);
  config.objects[this.model.id].addListener("clickFeature",this.clickIt, this);
  this.tooltip = config.objects[this.model.id].tipWidgetId;
}

