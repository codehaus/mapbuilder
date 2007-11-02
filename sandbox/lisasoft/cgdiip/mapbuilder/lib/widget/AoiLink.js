/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ModelTransformer.js 3150 2007-08-20 22:50:33Z mvivian $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Provide a href link to another mapbuilder page, using the same
 * Area Of Interest as the current mapbuilder page.
 */
function AoiLink(widgetNode, model) {
  // Extend WidgetBase
  WidgetBase.apply(this, new Array(widgetNode, model));
  
  this.href = widgetNode.selectSingleNode("mb:href").firstChild.nodeValue;
  this.linkLabel = widgetNode.selectSingleNode("mb:linkLabel").firstChild.nodeValue;
  this.bbox = "";
  
  /**
   * Draw the href link.
   */
  this.drawLink = function(objRef)
  {
  	if(objRef.htmlTagId){
  	  var href = objRef.href
  	  if(href.contains('?'))
  	  	href = href+'&bbox=';
  	  else
  	    href = href+'?bbox=';
  	    
  	  var html = "<a href=\"" + href + objRef.bbox + "\">" + objRef.linkLabel + "</a>";
  	  document.getElementById(objRef.htmlTagId).innerHTML = html;
  	}
  	
  }
  
  /**
   * Set the bounding box to be used when creating a link.
   */
  this.init = function(objRef) {
  	extent = objRef.model.getBoundingBox();
  	objRef.bbox = extent[0] + "," + extent[1] + "," + extent[2] + "," + extent[3];
  	objRef.drawLink(objRef);
    objRef.model.map.events.register('moveend', objRef, objRef.bboxHandler);
  }
  
  this.model.addListener("loadModel", this.init, this );

  this.bboxHandler = function(objRef) {
    var extent=objRef.object.getExtent();

    this.bbox = extent.left + "," + extent.bottom + "," + extent.right + "," + extent.top;
    this.drawLink(this);
  }
}
