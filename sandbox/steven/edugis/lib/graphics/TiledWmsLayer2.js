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
  this.paint= function(objRef, img, layerNum ) { 
    this.tileExtent=new TileExtent(this.model.extent);
    this.tileCount = this.tileExtent.getTileCount();
    this.grid = this.getGridSrc(objRef, this.tileExtent,this.tileCount);
   
    this.loadImgDiv(objRef, this.layerNode,this.grid,layerNum,this.tileExtent);
    //SMO: ik moet kijken naar de layermgr die doet volgens mij nu overbodig werk, ivm isWmsLayer()
    return img;
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
    for(i=0; i<tileCount[0]; i++){
      bboxList[i] = new Array();
      tempDom[i] = new Array();
      tileGrid[i] = new Array();
      for(j=0;j<tileCount[1]; j++){
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
    var imageFormat = "image/gif";
    var imageFormatNode = layerNode.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");  
    if (imageFormatNode) imageFormat = imageFormatNode.firstChild.nodeValue;  
  
    var imgDivId = this.getLayerDivId(); 
    var imgDiv = document.getElementById(imgDivId);

    //SMO: dit moet misschien anders als ik weer de imgloader wil gebruiken.
    if(imgDiv){
      outputNode.removeChild(imgDiv);
    }
  //if (!imgDiv) {
    imgDiv = document.createElement("div");
    imgDiv.setAttribute("id", imgDivId);
    imgDiv.style.position = "absolute"; 
    imgDiv.style.visibility = (layerHidden)?"hidden":"visible";
    imgDiv.style.top = offset[1] +'px'; 
    imgDiv.style.left = offset[0]+'px';
    imgDiv.imgId = scaleLevel+"-"+this.layerName; 

    for(i=0;i<grid.length;i++){
        for(j=0;j<grid[i].length;j++){
        var domImg = document.createElement("img");
        domImg.id = "real"+imgDiv.imgId+"-"+i+"-"+j;
//domImg.id = imgDiv.imgId+"-"+i+"-"+j;
        domImg.setAttribute("src", "../../lib/skin/default/images/Loading.gif");
        //newSrc = grid[i][j][layerNum].getAttribute('src');
        domImg.src = config.skinDir+"/images/Spacer.gif";
        //domImg.setAttribute("src",newSrc);
        domImg.style.top = j*tileSize+'px';
        domImg.style.left = i*tileSize+'px';
        domImg.style.position = 'absolute';
        domImg.layerHidden = layerHidden;
        imgDiv.appendChild(domImg);
        }
        }
    outputNode.appendChild(imgDiv);
    //}
  //}

  // preload image
  
  imageStack = new Array();
  for(i=0;i<grid.length;i++){
    for(j=0;j<grid[i].length;j++){
      var newImg = new Image();
      newImg.hidden = layerHidden;
    
      newImg.id = imgDiv.imgId+"-"+i+"-"+j;
     
      newImg.objRef = this;
   
     
      newImg.fixPng = false;
      if (_SARISSA_IS_IE && imageFormat=="image/png") newImg.fixPng = true;
      
      newSrc = grid[i][j][layerNum].getAttribute('src');
  newImg.src = newSrc;
        newImg.onload = new MapImgLoadHandler(newImg);

  
  /*
      if (newImg.fixPng) {
      oldImg = document.getElementById("real"+imgDiv.imgId+"-"+i+"-"+j);
       newImg.src = newSrc
       newImg.style.visibility = "hidden";
       oldImg.outerHTML = fixPNG(newImg,"real2"+newImg.id);

       if (!newImg.hidden) {
       
      fixImg = document.getElementById("real2"+newImg.id); // The result of fixPng is a span, so we need to set that particular element visible
// fixImg = fixPNG(newImg,newImg.id);
alert('id '+fixImg.id);
alert(fixImg.outerHTML);
 fixImg.style.visibility = 'visible';
 alert(fixImg.outerHTML);
//      alert(fixImg.src);
   //   newImg.style.visibility = "hidden";
  //  fixImg.style.visibility = "visible";
    //}
      }
      else newImg.src = newSrc;
      imageStack.push(newImg);*/
      }
    }
  }
  
  //  newImg.onload = MapImgLoadHandler;
//  newImg.src = newSrc;
}


/**
* image onload handler function.
* Replaces the source with the new one and fixes the displacement to 
* compensate the container main div displacement to result in in a zero displacement.
* The first image to be returned will hide all other layers and re-position them
* and they are made visible when their onload event fires.
* @author Michael Jenik     
*/
function MapImgLoadHandler(objRef) {
  //SMO: hier wordt hij uiteindelijk getekend
  var oldImg = document.getElementById("real"+objRef.id );

  if (!objRef.objRef.firstImageLoaded) {
    objRef.objRef.firstImageLoaded = true;
    //SMO: output node moet wel alle tiles als directe kinderen hebben
    var outputNode = document.getElementById( objRef.objRef.mapPane.outputNodeId );
    //SMO: zouden in principe alle tiles van alle lagen moeten zijn
    var siblingImageDivs = outputNode.childNodes;
    for (var i=0; i<siblingImageDivs.length ;++i) {
      //SMO: hier moeten alle tiles worden gehaald niet alleen het eerste kindje   
      for (var j=0; j<siblingImageDivs[i].childNodes.length;++j) {
      var sibImg = siblingImageDivs[i].childNodes[j];
      sibImg.parentNode.style.visibility = "hidden";
      sibImg.style.visibility = "hidden";//Make sure for IE that the child node is hidden as well
      if (_SARISSA_IS_IE) sibImg.src = config.skinDir+"/images/Spacer.gif";
      }
    }
    //if (_SARISSA_IS_IE) siblingImageDivs[0].firstChild.parentNode.parentNode.style.visibility = "hidden";
    //SMO: offset van de grid div moet worden gezet
    outputNode.style.left='0px';
    outputNode.style.top='0px';
  }

  --objRef.objRef.layerCount;
  if (objRef.objRef.layerCount > 0) {
    var message = "loading " + objRef.objRef.layerCount + " map layers"
    objRef.objRef.model.setParam("modelStatus", message);
  } else {
    objRef.objRef.model.setParam("modelStatus");
    objRef.objRef.model.callListeners("refreshOtherLayers");
  }
  
  if (_SARISSA_IS_IE) oldImg.parentNode.parentNode.style.visibility = "visible";
  if (objRef.fixPng) {
  alert(objRef.id);
    //SMO: nog checken of fixpng het slikt
    var vis = oldImg.layerHidden?"hidden":"visible";
    objRef.style.left = oldImg.offsetLeft+'px'
    objRef.style.top = oldImg.offsetTop+'px'
    oldImg.outerHTML = fixPNG(objRef,"real"+objRef.id);
    if (!objRef.hidden) {
   
      fixImg = document.getElementById("real"+objRef.id); // The result of fixPng is a span, so we need to set that particular element visible

      fixImg.style.visibility = "visible"
    }
  } else {
 // alert('oldimg.src='+oldImg.src);
  //alert('this.src='+objRef.src);
     oldImg.src = objRef.src;
    //SMO: tile size, niet width/height
    oldImg.width = '200';
    oldImg.height = '200';
    if (!objRef.hidden) {
      oldImg.parentNode.style.visibility = "visible";
      oldImg.style.visibility = "visible"; //Make sure for IE that the child node is visible as well
    }
  }
}
