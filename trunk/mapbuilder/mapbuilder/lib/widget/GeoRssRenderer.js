/*
Author:       Cameron Shorter cameronATshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: GeoRssRenderer.js,v 1.3 2005/08/05 18:47:11 madair1 Exp $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/widget/TipObject.js");
mapbuilder.loadScript(baseDir+"/graphics/FeatureFactory.js");

// Resource: http://www.bazon.net/mishoo/articles.epl?art_id=824

/**
 * Render GeoRSS feeds into HTML.  This is a MapContainer widget.
 * 
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
//var geoRssTipObject;

function GeoRssRenderer(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
  MapContainerBase.apply(this,new Array(widgetNode, model));

  this.model.addListener("refresh",this.paint, this); 

  var tipWidget =  widgetNode.selectSingleNode("mb:tipWidget");
  if( tipWidget ) {
    this.tipWidgetId = tipWidget.firstChild.nodeValue;
  }
  
  // added stylesheet to apply to rss features and display results in popup
  var styleNode = widgetNode.selectSingleNode("mb:popupStylesheet");
  if (styleNode ) {
      var xslt = styleNode.firstChild.nodeValue;
      this.popupStyleSheet = new XslProcessor(xslt, model.namespace);
  } 
  
  /*
  var modelUrl = widgetNode.selectSingleNode("mb:defaultModelUrl");
  if( modelUrl == null ) {
    modelUrl = document.getElementById("defaultModelUrl").firstChild.nodeValue;
    if( modelUrl != null ) {
      //alert(modelUrl);
      //model.url=modelUrl;
      //config.loadModel(model.id, modelUrl );
      var httpPayload = new Object();
      httpPayload.method = model.method;
      httpPayload.url = modelUrl;
      model.newRequest(model,httpPayload);
    }
  }
  */
  
  this.featureFactory = new FeatureFactory(widgetNode, model, this.tipWidgetId);
  
  /** draw the points by putting the image at the point
    * @param objRef a pointer to this widget object
    */

    
  //this.stylesheet = new XslProcessor(baseDir+"/widget/Null.xsl");
 
  /** highlights the selected feature by switching to the highlight image
    * @param objRef a pointer to this widget object
    */
  this.highlight = function(objRef, featureId) {
    var normalImageDiv = document.getElementById(featureId+"_normal");
    if( normalImageDiv != undefined ) {
      normalImageDiv.style.visibility = "hidden";
      var highlightImageDiv = document.getElementById(featureId+"_highlight");
      highlightImageDiv.style.visibility = "visible";
    }
  }
  this.model.addListener("highlightFeature",this.highlight, this);

  /** highlights the selected feature by switching to the highlight image
    * @param objRef a pointer to this widget object
    */
  this.dehighlight = function(objRef, featureId) {
    var normalImageDiv = document.getElementById(featureId+"_normal");
    if( normalImageDiv != undefined ) {
      normalImageDiv.style.visibility = "visible";
      var highlightImageDiv = document.getElementById(featureId+"_highlight");
      highlightImageDiv.style.visibility = "hidden";
    }
  }
  this.model.addListener("dehighlightFeature",this.dehighlight, this);

  /**
    * apply stylsheet to entry for popup
    * @param objRef pointer to this widget
    * @entry entry to transform
    */
  this.transformEntry = function( objRef, entry ) {
    if( objRef.popupStyleSheet != undefined ) {
      var resultNode = objRef.popupStyleSheet.transformNodeToObject( entry );
      var result = Sarissa.serialize(resultNode.documentElement);
      //alert("transforming:"+result);
      return result;
    }
  }
}

GeoRssRenderer.prototype.paint = function(objRef) {
    // cleanup first
    objRef.featureFactory.clearFeatures(objRef);

    if (objRef.model.doc && objRef.containerModel.doc && objRef.node) {
      var containerProj = new Proj(objRef.containerModel.getSRS());
      var features = objRef.model.getFeatureNodes();
      
      var len = features.length;
      
      for (var index=0; index< len; index++) {
        var feature = features[index];
        var title = objRef.model.getFeatureName(feature);
        var itemId = objRef.model.getFeatureId(feature);   //or feature id's for feature collections?
        var icon = objRef.model.getFeatureIcon(feature);   // icon to display on the map
        
        var geom  = objRef.model.getFeatureGeometry(feature);
        if( geom != undefined ) {
          // get the popup info from stylesheet
          var popupStr = objRef.transformEntry( objRef, feature );
        
          // what geom is it?
          // special extension to define a full geometry
          if( geom.match('POINT') ) {
            var pointStr = geom.substring(6, geom.length);
            //alert( "popup:"+popupStr);
            var point = pointStr.split(" ");
            point = containerProj.Forward(point);
            point = objRef.containerModel.extent.getPL(point);
            //alert( pointStr + " " + point[0] + " " + point[1] + " " + popupStr);
            objRef.featureFactory.createFeature( objRef, 'POINT', point, itemId, title, popupStr, icon );
          } else if( geom.match('LINESTRING') ) {
            var linestr = geom.substring(11, geom.length);
            var re=RegExp('[, \n\t]+','g');
            var pointPairs = linestr.split(re);
            
            var newPointArr = new Array( pointPairs.length/2 );
            var point = new Array(2);
            var screenCoords;
            
            var jj=0;
            
            for( var i=0; i<pointPairs.length; i++ ) {
              
              point[0] = pointPairs[i];
              point[1] = pointPairs[i+1];
              
              screenCoords = containerProj.Forward(point);
              screenCoords = objRef.containerModel.extent.getPL(screenCoords);
              newPointArr[jj] = screenCoords;  
               
              jj++     
              i++;
            }
            
            objRef.featureFactory.createFeature( objRef, 'LINESTRING', newPointArr, itemId, title, popupStr, icon );
            //pointPairs = null;
          } else if( geom.match('POLYGON') ) {
            //alert("POLY NOT YET IMPLEMENTED");
          } else if( geom.match('CURVE') ) {
            //alert( "CURVE NOT YET IMPLEMENTED");
          } else {
            //alert( "UNDEFINED GEOMETRY" );
          }
        } else {
          // old geo:lat geo:long
        var point = objRef.model.getFeaturePoint(feature);
          
        if( (point != null) && (point[0] != 0) && (point[1] != 0 )) {
          point = containerProj.Forward(point);
          point = objRef.containerModel.extent.getPL(point);
  
          // get the popup info from stylesheet
          var popupStr = objRef.transformEntry( objRef, feature );
          
          // create a point feature
          objRef.featureFactory.createFeature( objRef, 'POINT', point, itemId, title, popupStr, icon );
        }
      }
    }
  }
}
