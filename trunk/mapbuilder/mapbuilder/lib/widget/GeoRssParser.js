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
    //this.stylesheet = new XslProcessor(xslt, model.namespace);
    this.stylesheet = new XSLTProcessor();
    var xslDoc = Sarissa.getDomDocument(); 
    xslDoc.async=false;
    xslDoc.load( xslt );
    this.stylesheet.importStylesheet( xslDoc );
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
 
    //var resultNode = objRef.stylesheet.transformNodeToObject( entry );
    var resultNode = objRef.stylesheet.transformToDocument( entry );
    Sarissa.setXpathNamespaces(resultNode, "xmlns:wmc='http://www.opengis.net/context'");
 
    /*
    var result = Sarissa.serialize(resultNode.documentElement);
    
    alert("transforming:"+result);
    service=resultNode.selectSingleNode("//wmc:Server/@service");
    
    if(service) {
      service=service.nodeValue;
      alert( "found georss service:"+service );
    } else {
      alert ("georss service not found");
    }
    */
    
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
   
    //alert( "features:"+len );
    if( len == 0 )
      alert( "No features detected" );
      
    for (var index=0; index< len; index++) {
      var feature = features[index];
 
      var id = feature.getAttribute("id" );
      if( id != null ) // save it as a fid
        feature.setAttribute( "pid", id );
        
      feature.setAttribute("id", "RSS_Item_"+mbIds.getId());
      feature.setAttribute("width", width);
      feature.setAttribute("height", height);
 
      //alert( "rssLayer:"+Sarissa.serialize(feature) );

      var layer   = objRef.transformEntry( objRef, feature );     
      
      objRef.targetModel.setParam('addLayer', layer.childNodes[0]);
  //    objRef.targetModel.setParam('addLayer', layer);
 
    }
  }
}
  
GeoRssParser.prototype.paint = function( objRef ) {
}

