/*
Author:       Cameron Shorter cameronATshorterDOTnet
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: GmlLayer.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/SldRenderer.js");
mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");
mapbuilder.loadScript(baseDir+"/widget/TipWidget.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");

/**
 * @constructor
 * @base MapLayer
 * @param model The Context object that owns the MapPane2 for this Layer.
 * @param mapPane The mapPane's object.
 * @param layerName The name of this layer as a string.
 * @param layerNode The node object for this layer as a gml:FeatureCollection
 * @param queryable True if this layer can be queried.
 * @param visible True if this layer is visible.
 */
function GmlLayer(model, mapPane, layerName, layerNode, queryable, visible) {
    MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));

/**
  * Parses the entry and extracts the coordinates out of the GML location
  * So we know geometry type and coordinates
  */
  this.parse = function() {
    //namespace = "xmlns:wmc='http://www.opengis.net/context' xmlns:sld='http://www.opengis.net/sld' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml/3.1.1'"; 
    namespace = "xmlns:wmc='http://www.opengis.net/context' xmlns:sld='http://www.opengis.net/sld' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml'";
    Sarissa.setXpathNamespaces(this.layerNode, namespace);

    //TBD add the layer number to make sure the name is unique
    this.id=this.model.id + "_" + this.mapPane.id + "_" + this.layerName;
  
    var styleNode  = this.layerNode.selectSingleNode("//wmc:StyleList" );
    if(styleNode){
      var hiliteStyleNode =  styleNode.selectSingleNode("//wmc:Style[wmc:Name='Highlite']");
      var normalStyleNode =  styleNode.selectSingleNode("//wmc:Style[wmc:Name='Normal']");
      this.normalSld    = new SldRenderer( normalStyleNode );
      this.hiliteSld    = new SldRenderer( hiliteStyleNode );
    }else{
      this.normalSld=new SldRenderer(null);
      this.hiliteSld=new SldRenderer(null);
    }

    this.containerProj = new Proj(this.model.getSRS());
    width=this.model.getWindowWidth();
    height=this.model.getWindowHeight();

    //TBD we should be able to remove featureNodes and use this.layerNode instead
    div = this.getDiv(this.id);
	this.div=div; //tbd remove this line.
    this.gr=new VectorGraphics(this.id,div,width,height);
    featureNodes = this.layerNode.selectNodes(".//gml:featureMember");
    this.features=new Array();
    for(k=0;k<featureNodes.length;k++){
      this.features[k]=new Array();
      this.features[k].node=featureNodes[k];
      this.features[k].id=this.id+k;
      this.features[k].geoCoords=this.getGeoCoords(featureNodes[k],k+1);
      this.features[k].shapes=new Array(); // A feature can contain multiple members/shapes
      this.features[k].sld=this.normalSld;
      this.features[k].group=this.gr.getGroupTag(null,this.features[k].id+"_g");
      this.normalSld.setStyle(this.gr,this.features[k].group);
    }
  
    // Determine the feature type
    if(featureNodes.length>0){
      this.gmlType=featureNodes[0].selectSingleNode(".//gml:Point|.//gml:LineString|.//gml:Polygon|.//gml:LinearRing|.//gml:Box|.//gml:Envelope");
      if(this.gmlType){
        this.gmlType=this.gmlType.nodeName;
      }else{
        alert(mbGetMessage("unsupportedGmlGeomForLayer", this.id));
      }
    }
  }

  /**
   * Extract and return an array of shapes, which contains an array of
   * coordinates. points[numberOfShapes, numberOfCoords, dimentionsOfCoords]
   * @param node GML which contains the coordinates.
   * @return An array of coordinates.
   */
  this.getGeoCoords=function(node) {
    coordsNodes=node.selectNodes(".//gml:pos|.//gml:posList|.//gml:coordinates");
    points=new Array();
    for(h=0;h<coordsNodes.length;h++){
      points[h]=new Array();
      dim=2;
      if(coordsNodes[h]){
        d=coordsNodes[h].selectSingleNode("@srsDimension");
        if(d)dim=parseInt(d.firstChild.nodeValue);
        coords=coordsNodes[h].firstChild.nodeValue;
      }
      if(coords){
        var re=RegExp('[, \n\t]+','g');
        point=coords.split(re);
        //Remove elements caused by leading and trailing white space
        while(point[0]=="")point.shift();
        while(point[point.length-1]=="")point.pop();

        for(i=0,j=0; i<point.length;j++,i=i+dim) {
          points[h][j] = new Array(point[i],point[i+1]);
        }
      }
    }
    return points;
  }

  /*
   * returns false because this is not a WMS layer - this function should be
   * deleted.
   */
  this.isWmsLayer= function() {
    return false;
  }
  
/**
  * Make sure we have a div to insert all the elements
  * @fid feature Id.
  * @param layerNum The position of this layer in the LayerList.
  */
  this.getDiv= function(fid,layerNum) {
  var outputNode = document.getElementById( this.mapPane.outputNodeId ).parentNode;
  
  // TBD Use layerId here
  var div = document.getElementById(fid);
  if( div == null) {
    div = document.createElement("div");
    div.setAttribute("id", fid);
    //div.setAttribute("name", this.title);
    div.style.position = "absolute";
    // TBD get visibility param from WMC
    div.style.visibility = "visible";

    //TBD We need to include zIndex for layers
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
    //this.deleteShape();
 
    //var style =  this.style.selectSingleNode("//wmc:Style[wmc:Name='Normal']");
    //this.paintShape(this.normalSld, false );
    this.paintFeatures();
  }

/**
  * Called by layer manager to clean the layer
  */
  this.unpaint = function() {
    //this.deleteShape();
    //TBD This function gets called. Why?
  }

  /**
   * Paints the FeatureCollection.
   */
  this.paintFeatures=function() {
	for(k=0;k<this.features.length;k++){
      // TBD Opportunity for optimisation here
      // (resize instead of delete/repaint)
      // TBD Probably should move delete into a seperate function
	  
      // delete previously rendered shape first.
      id1=this.features[k].id+"_g";
      node = document.getElementById(id1);
      for(i=0;node.childNodes.length>0;){
        node.removeChild(node.childNodes[0]);
      }

      for(h=0;h<this.features[k].geoCoords.length;h++){
        // Convert to screen coords
        screenCoords=new Array();
        for(c=0;c<this.features[k].geoCoords[h].length;c++){
          reproj = this.containerProj.Forward(this.features[k].geoCoords[h][c]);
          screenCoords[c]=this.model.extent.getPL(reproj);
        }
        // TBD we should be calling the VectorGraphics directly rather than
        // call the SLD first.
        this.features[k].shapes[h]=this.features[k].sld.paint(this.gr,screenCoords,this.features[k].group,this.gmlType);
	  }
    }
  }

/**
  * Paints the right GML shape
  *
  * @param style SLD
  * @param hiliteOnly true if hilite (room for future optimization)
  *
  this.paintShape= function( sld, hiliteOnly ) {
  
    if( hiliteOnly ) {
      sld.hiliteLine( this.gr, this.shape );
    } else {
      containerProj = new Proj(this.model.getSRS());
      var re=RegExp('[, \n\t]+','g');
      pointPairs    = this.coords.split(re);
              
      newPointArr = new Array( pointPairs.length/2 );
      point = new Array(2);
      jj=0;
      for(i=0; i<pointPairs.length; i++) {
        point[0] = pointPairs[i];
        point[1] = pointPairs[i+1];
                
        screenCoords = containerProj.Forward(point);
        screenCoords = this.model.extent.getPL(screenCoords);
        newPointArr[jj] = screenCoords;  
                 
        jj++     
        i++;
      }   
      if( this.gmlType == "gml:Point" ) {
        this.shape = sld.paintPoint( this.gr, pointLine );
      } else if( this.gmlType == "gml:LineString" ) {
        this.shape = sld.paintLine( this.gr, newPointArr );
      } else if( this.gmlType == "gml:Polygon" || 
          this.gmlType == "gml:Envelope" ||
          this.gmlType == "gml:Box")  {
        this.shape = sld.paintPolygon( this.gr, newPointArr );
      }   
      this.shape.id = this.id +"_vector";
      this.gr.paint();
      //this.install(this.shape);
    }   
  }
  */

/** 
  * Highlights the selected feature by switching to the highlight image
  * @param objRef a pointer to this widget object
  * @param featureId
  *
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
          popupStr = mbGetMessage("featureUnderConstruction");
        }
      }
    }
  
    if( posx>0 && posx < objRef.width && posy>0 && posy<objRef.height ) {
      // make sure we are in the map
      toolTipObjs[objRef.tooltip].paint( new Array(posx, posy, featureId, objRef.title, popupStr ));
    }
  }
}
*/
 
/** 
  * Dehighlights the selected feature by switching back to the normal image
  * @param objRef a pointer to this widget object
  * @param featureId
  *
  this.dehighlight= function(objRef, featureId) {
    if( featureId.indexOf(objRef.id)>= 0 ) {
    
      objRef.paintShape( objRef.normalSld, true );
 
      // clear popup
      toolTipObjs[objRef.tooltip].clear();
    }
  }
  */
 
  this.parse();
  this.paint();
}
