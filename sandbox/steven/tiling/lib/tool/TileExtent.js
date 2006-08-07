/*
Author:       Steven Ottens AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: TileExtent 1941 2006-03-08 15:14:09Z steven $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/Extent.js");

/**
 * A tool designed to store the history of the extent during a session
 *
 * @constructor
 * @base ToolBase
 * @param toolNode  The node for this tool from the configuration document.
 * @param model     The model object that contains this tool
 */
function TileExtent(extent) {
  this.extent=extent;
  
  //TBD: make this configurable
  this.tileSize = 200;
  this.tileScale = this.extent.getFixedScale();
  
  this.tileMeters = this.tileSize * this.tileScale;
  
  this.tileCount = new Array();
  this.offset = new Array();
  this.tileBbox = new Array();
  
  this.calculated = false;

  this.getTileCount= function() {
   var ul = this.extent.ul;
   var lr = this.extent.lr;
   var tileSize = this.tileSize;
   var tileScale = this.extent.getFixedScale();
   var tileCount = this.tileCount;
   
   this.setTileMeters(tileSize, tileScale);
   var tileMeters = this.tileMeters;

   this.setTileBbox(ul,lr,tileMeters);
   var tileBbox = this.tileBbox;
   tileCount[0] = (tileBbox[1][0]-tileBbox[0][0])/tileMeters;
   tileCount[1] = (tileBbox[0][1]-tileBbox[1][1])/tileMeters;
   this.tileCount = tileCount;
   this.calculated = true;
   return tileCount;
  }
  
  this.setTileMeters = function(tileSize, tileScale) {
     var tileScale = this.extent.getFixedScale();
     var tileSize = this.tileSize;
     this.tileMeters= tileScale*tileSize;
  }

  this.setTileBbox = function(ul,lr, tileMeters){
    var tileBboxUl = new Array();
    var tileBboxLr = new Array();
    var tileBbox = this.tileBbox;
    var offset = this.offset;

    tileBboxUl[0] = Math.floor(ul[0]/tileMeters)*tileMeters;
    tileBboxUl[1] = Math.ceil(ul[1]/tileMeters)*tileMeters;
    tileBboxLr[0] = Math.ceil(lr[0]/tileMeters)*tileMeters;
    tileBboxLr[1] = Math.floor(lr[1]/tileMeters)*tileMeters;
    tileBbox[0] = tileBboxUl;
    tileBbox[1] = tileBboxLr;
    offset[0] = Math.round((tileBboxUl[0]-ul[0])/this.tileScale);
    offset[1] =  Math.round((ul[1]-tileBboxUl[1])/this.tileScale); 
    
    this.offset = offset;
    this.tileBbox = tileBbox;
  }
  this.getTileMeters = function() {
    if(this.calculated) {
      return this.tileMeters;
    }
    else alert("TileMeters is not calculated");
  }
  this.getTileBbox = function(){
   if(this.calculated) {
    return this.tileBbox;
    }
    else alert("TileBbox is not calculated");
  }
  this.getOffset = function(){
   if(this.calculated) {
    return this.offset;
    }
    else alert("Offset is not calculated");
  }
  this.getTileSize = function(){
   if(this.tileSize) {
    return this.tileSize;
    }
    else alert("TileSize is not set");
  }
}