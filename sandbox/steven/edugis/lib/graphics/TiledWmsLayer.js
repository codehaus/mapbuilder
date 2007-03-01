/*
Author:       Patrice G. Cappelaere patAtcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/tool/TileExtent.js");

TiledWmsLayer = function(model, mapPane, layerName, layerNode, queryable, visible) {
    MapLayer.apply(this, new Array(model, mapPane, layerName, layerNode, queryable, visible));

    /** Date object used to create a unique id. */
    this.d=new Date();
    this.img = new Image();
    this.img.objRef = mapPane;
    this.mapPane = mapPane;
  /**
    * Sets the source
    */
  this.setSrc= function( src ) {
    this.src = src;
  }

/**
  * Paint the layer.
  * @param objRef Pointer to widget object.
  * @param img 
  * @param layerNum The position of this layer in the LayerList.
  */
  this.paint= function(objRef, layerNum ) { 
    this.tileExtent=new TileExtent(this.model.extent);
    this.tileCount = this.tileExtent.getTileCount();
    this.grid = this.getGridSrc(objRef, this.tileExtent,this.tileCount);

    this.loadImgDiv(objRef, this.layerNode,this.grid,layerNum,this.tileExtent);   
    //SMO: ik moet kijken naar de layermgr die doet volgens mij nu overbodig werk, ivm isWmsLayer()
  }
  
  this.isWmsLayer= function() {
    return true;
  }
  this.getGridSrc = function (objRef, tileExtent,tileCount){
    var tileSize = tileExtent.getTileSize();
    var tileMeters = tileExtent.getTileMeters();
    var tileBbox = tileExtent.getTileBbox();
    
    if(!this.stylesheet) {
      this.stylesheet = new XslProcessor(baseDir+"/tool/xsl/wmsc_GetMap.xsl",model.namespace);
    }  
    this.stylesheet.setParameter("width", tileSize);
    this.stylesheet.setParameter("height", tileSize);
    this.stylesheet.setParameter("srs", this.model.getSRS());
    
    var bboxList = new Array();
    var tempDom = new Array();
    var tileGrid = new Array();
    for(var i=0; i<tileCount[0]; i++){
      bboxList[i] = new Array();
      tempDom[i] = new Array();
      tileGrid[i] = new Array();
      for(var j=0;j<tileCount[1]; j++){
        bboxList[i][j] = new Array();
        tempDom[i][j] = new Array();
        tileGrid[i][j] = new Array();
        bboxList[i][j][0] = tileBbox[0][0]+tileMeters*i;
        bboxList[i][j][1] = tileBbox[0][1]-tileMeters*(j+1);
        bboxList[i][j][2] = tileBbox[0][0]+tileMeters*(i+1);
        bboxList[i][j][3] = tileBbox[0][1]-tileMeters*j;
        this.stylesheet.setParameter("bbox", bboxList[i][j].join(","));
        tempDom[i][j] = this.stylesheet.transformNodeToObject(this.model.doc);
        tileGrid[i][j] = tempDom[i][j].selectNodes("//img");
      }
    }
    return tileGrid;
  }

/**
 * Returns an ID for the image DIV given a layer name
 * @param layerName the name of the WMS layer
 */
  this.getLayerDivId= function() {
    var divId = this.model.id +"_"+ this.mapPane.id +"_"+ this.layerName; //TBD: add in timestamps
    return divId;
    
    //add timestamp to layerID if layer have a timestampList
    if (this.model.timestampList && this.model.timestampList.getAttribute("layerName") == layerName) {  
      var timestampIndex = this.model.getParam("timestamp");
      var timestamp = this.model.timestampList.childNodes[timestampIndex];
      layerId += "_" + timestamp.firstChild.nodeValue;
    }
  }
  
/**
 * sets up the image div to be loaded.  Images are preloaded in the imageStack
 * array and replaced in the document DOM in the onload handler
 * @param layerNode the context layer to be loaded
 * @param newSrc the new URL to be used for the image
 * @param newImg an HTML IMG object to pre-load the image in
 * @param layerNum The position of this layer in the LayerList.
 */  
  this.loadImgDiv= function(objRef, layerNode,grid,layerNum,tileExtent) {
  
  //SMO: misschien al geladen tiles niet nog een keer laden?
    var offset = tileExtent.getOffset();
    var tileSize = tileExtent.getTileSize();
    var scaleLevel = tileExtent.extent.getFixedScale();
    var outputNode = document.getElementById( objRef.mapPane.outputNodeId );
    outputNode.style.left='0px';
    outputNode.style.top='0px';
    
    var layerHidden = (layerNode.getAttribute("hidden")==1)?true:false; 
   
    if(!layerNode.getAttribute("transparancy")) var transparancy = 100;
    else var transparancy = layerNode.getAttribute("transparancy");
    
    var imageFormat = "image/gif";
    var imageFormatNode = layerNode.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");  
    if (imageFormatNode) imageFormat = imageFormatNode.firstChild.nodeValue;  
  
    var imgDivId = this.getLayerDivId(); 
    var oldDiv = document.getElementById(imgDivId);

    //SMO: dit moet misschien anders als ik weer de imgloader wil gebruiken.
    if(oldDiv){
      outputNode.removeChild(oldDiv);
    }
//  if (!imgDiv) {



    imgDiv = document.createElement("div");
    imgDiv.setAttribute("id", imgDivId);
    imgDiv.style.position = "absolute"; 
    imgDiv.style.display = (layerHidden)?"none":"inline";
    
   
      if(!_SARISSA_IS_IE) {
       var fftr = transparancy / 100;
       imgDiv.style.opacity=fftr;
    }
    
    imgDiv.style.top = offset[1] +'px'; 
    imgDiv.style.left = offset[0]+'px';
    imgDiv.imgId = scaleLevel+"-"+this.layerName; 

    for(var i=0;i<grid.length;i++){
        for(var j=0;j<grid[i].length;j++){
        var domImg = document.createElement("img");
        domImg.id = "real"+imgDiv.imgId+"-"+i+"-"+j;
       
        newSrc = grid[i][j][layerNum].getAttribute('src');
        
        if(_SARISSA_IS_IE){
              var ietr = "alpha(opacity=" + transparancy + ")";
domImg.style.filter=ietr;
}
        domImg.width = tileSize;
                domImg.height = tileSize;
        domImg.style.top = j*tileSize+'px';
        domImg.style.left = i*tileSize+'px';
        domImg.style.position = 'absolute';
        domImg.layerHidden = layerHidden;
        domImg.style.visibility = 'hidden';
        domImg.setAttribute("src",newSrc)
        domImg.fixPng = false;
        if (_SARISSA_IS_IE && imageFormat=="image/png") domImg.fixPng = true;
    
      imgDiv.appendChild(domImg);
      }
    }
    
    outputNode.appendChild(imgDiv);
    
     var siblingImageDivs = outputNode.childNodes;
     var i = siblingImageDivs.length -1;
      for (var j=0; j<siblingImageDivs[i].childNodes.length;++j) {
      var sibImg = siblingImageDivs[i].childNodes[j];
     
      
       if(sibImg.fixPng) sibImg.outerHTML = fixPNG(sibImg,sibImg.id);
      if (!sibImg.hidden) {
      fixImg = document.getElementById(sibImg.id); // The result of fixPng is a span, so we need to set that particular element visible
     fixImg.style.visibility = 'visible'

      }
       
    }
  
  }
}

