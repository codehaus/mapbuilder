/*
Author:       Pat G. Cappelaere patATcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

/**
 * Parses GeoRSS/Atom feeds.  This is a MapContainer widget.
 * 
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function GeoRssParser(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
  MapContainerBase.apply(this,new Array(widgetNode, model));
  
 // added stylesheet to apply to rss features and display results in popup
  var stylesheet = widgetNode.selectSingleNode("mb:stylesheet");
  if (stylesheet ) {
    var xslt = stylesheet.firstChild.nodeValue;
    this.stylesheet = new XslProcessor(xslt, model.namespace);
  } else {
    alert( "Parsing stylesheet not found");
  }
  
  var tipWidget =  widgetNode.selectSingleNode("mb:tipWidget");
  if( tipWidget ) {
    this.model.tipWidgetId = tipWidget.firstChild.nodeValue;
  }
  
  this.model.addListener("contextLoaded",this.loadEntries, this);
  this.model.addListener("refresh",this.paint, this); 
  
}

/**
  * Apply stylesheet to convert RSS/Atom feed to RssLayer object
  */
GeoRssParser.prototype.transformEntry = function( objRef, entry ) {
  if( objRef.stylesheet != undefined ) {
    var resultNode = objRef.stylesheet.transformNodeToObject( entry );
    //var result = Sarissa.serialize(resultNode.documentElement);
    //alert("transforming:"+result);
    return resultNode;
  }
}
  
/**
  * Load RSS entries in the OWS Context and MapPane layers
  */
GeoRssParser.prototype.loadEntries = function( objRef ) {
  if (objRef.model.doc ) {
    var features = objRef.model.getFeatureNodes();
    var len = features.length;
    var width = objRef.containerModel.getWindowWidth();
    var height = objRef.containerModel.getWindowHeight();
   
    for (var index=0; index< len; index++) {
      var feature = features[index];
 
      feature.setAttribute("id", "RSS_Item_"+mbIds.getId());
      feature.setAttribute("width", width);
      feature.setAttribute("height", height);
 
      //alert( "rssLayer:"+Sarissa.serialize(feature) );

      var layer   = objRef.transformEntry( objRef, feature );
   
      //alert( "rssLayer:"+Sarissa.serialize(layer) );
      objRef.targetModel.setParam('addLayer', layer.childNodes[0]);
 
    }
  }
}
  
GeoRssParser.prototype.paint = function( objref ) {
}