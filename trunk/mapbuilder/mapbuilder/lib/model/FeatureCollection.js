/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/
mapbuilder.loadScript(baseDir+"/graphics/WfsQueryLayer.js");

/**
 * Stores a GML Feature or FeatureCollection as defined by the
 * Open GIS Conortium http://opengis.org.
 *
 * @constructor
 * @base ModelBase
 * @author Cameron Shorter
 * @requires Sarissa
 * @param modelNode The model's XML object node from the configuration document.
 * @param parent    The parent model for the object.
  */
function FeatureCollection(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));

  var featureTagName = modelNode.selectSingleNode("mb:featureTagName");
  if (featureTagName ) {
    this.featureTagName = featureTagName.firstChild.nodeValue;
  } else {
    this.featureTagName = "topp:CITY_NAME";
  }
 
  var coordsTagName = modelNode.selectSingleNode("mb:coordsTagName");
  if (coordsTagName ) {
    this.coordsTagName = coordsTagName.firstChild.nodeValue;
  } else {
    this.coordsTagName = "//gml:coordinates";
  }
 
  var nodeSelectXpath = modelNode.selectSingleNode("mb:nodeSelectXpath");
  if( nodeSelectXpath ) {
    this.nodeSelectXpath = nodeSelectXpath.firstChild.nodeValue;
  }
  
  var coordSelectXpath = modelNode.selectSingleNode("mb:coordSelectXpath");
  if( coordSelectXpath ) {
    this.coordSelectXpath = coordSelectXpath.firstChild.nodeValue;
  } else {
  	this.coordSelectXpath = "topp:the_geom/gml:MultiPoint/gml:pointMember/gml:Point/gml:coordinates";
  }
  

  
  // Namespace to use when doing Xpath queries, usually set in config file.
  //if (!this.namespace){
  //  this.namespace = "xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
  //}

  /**
   * convert coordinates in the GML document to the SRS of the map container, 
   * if required.  The coordinate values are replaced in the GML document.
   * @param objRef Pointer to this object.
   */
  this.convertCoords = function(objRef) {
  
    if( objRef.doc && objRef.containerModel && objRef.containerModel.doc ) {
		  var coordNodes = objRef.doc.selectNodes( objRef.coordsTagName );
		  if (coordNodes.length>0 && objRef.containerModel) {
		    var srsNode = coordNodes[0].selectSingleNode("ancestor-or-self::*/@srsName");
		    if( srsNode && (srsNode.nodeValue.toUpperCase() != objRef.containerModel.getSRS().toUpperCase()) ) {
		      var sourceProj = new Proj(srsNode.nodeValue);
		      objRef.setParam("modelStatus",objRef.getMessage("convertingCoords"));
		      var containerProj = new Proj(objRef.containerModel.getSRS());
		      for (var i=0; i<coordNodes.length; ++i) {
		        var coords = coordNodes[i].firstChild.nodeValue;
		        var coordsArray = coords.split(' ');
		        var newCoords = '';
		        for (var j=0; j<coordsArray.length; ++j) {
		          var xy = coordsArray[j].split(',');
		          if (xy.length==2) {
		            var llTemp = sourceProj.Inverse(xy);
		            xy = containerProj.Forward(llTemp);
		            newCoords += xy.join(',') + ' ';
		          }
		        }
		        coordNodes[i].firstChild.nodeValue=newCoords;
		      }
		    }
      }
    }
  }
  
  /**
    * Called when the OWSContext gets loaded
    */
  this.loadWfsRequests = function(objRef) {
    //alert( "FeatureCollection loadModel:"+Sarissa.serialize(objRef.containerModel.doc))
    // we need to retrieve all the features
    if( objRef.containerModel.doc != null) {
      //alert( "FeatureCollection loadModel:"+Sarissa.serialize(objRef.containerModel.doc))
      var featureTypes = objRef.containerModel.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType");
      if( featureTypes.length > 0 ) {
        for( var i=0; i<featureTypes.length; i++) {
          var httpPayload = new Object();        
        
          var wfsFeature = featureTypes[i]
          //alert( "feature:"+ Sarissa.serialize(wfsFeature) )
          
          var server = wfsFeature.selectSingleNode("wmc:Server")
          //alert( "server:"+ Sarissa.serialize(server) )
          var onlineResource = server.selectSingleNode("wmc:OnlineResource")
          //alert( "onlineResource:"+ Sarissa.serialize(onlineResource) )
          httpPayload.method = onlineResource.getAttribute("method")
          httpPayload.url = onlineResource.getAttribute("xlink:href")
          //alert( "server:"+ httpPayload.method + " " + httpPayload.url )
          
          var query = wfsFeature.selectSingleNode("wfs:GetFeature")
          //alert( "query2:"+ Sarissa.serialize( query ))
          httpPayload.postData = Sarissa.serialize( query )
          
          // This does not work on IE for some reaso
          // wfsFeature.model = objRef;
          objRef.wfsFeature = wfsFeature
          objRef.newRequest(objRef,httpPayload);

          //objRef.containerModel.setParam('addLayer', wfsFeature);
          //var sld = wfsFeature.selectSingleNode("wmc:StyleList")
        }
      }
    }
  }
  
  this.addFirstListener("loadModel",this.convertCoords,this);
  
  if( this.containerModel ) this.containerModel.addListener("loadModel",this.loadWfsRequests,this);

  /**
   * Change a feature's visibility.
   * @param featureName The name of the feature to set the hidden value for
   * @param hidden, 1=hidden, 0=not hidden.
   */
  this.setHidden=function(featureName, hidden){
    this.hidden = hidden;
    this.callListeners("hidden", featureName);
  }

  /**
   * Geta feature's visibility.
   * @param featureName The name of the feature to set the hidden value for
   * @return hidden value, true=hidden, false=not hidden.
   */
  this.getHidden=function(layerName){
    return this.hidden;
  }
  this.hidden = false;

  /**
   * Returns the list of nodes selected by the nodeSelectpath.  These nodes
   * will be the individual feature memebers from the collection.
   * @return list of nodes selected 
   */
  this.getFeatureNodes = function() {
    //alert( Sarissa.serialize(this.doc))
    var featureMember =  this.doc.selectSingleNode(this.nodeSelectXpath);
    if( featureMember != null )
      return featureMember.childNodes
    else
      return null;
  }

  /**
   * Returns a label for a node in the feature list
   * @param featureNode the feature node to selectfrom
   * @return a label for this feature
   */
  this.getFeatureName = function(featureNode) {
    var labelNode = featureNode.selectSingleNode(this.featureTagName);   //TBD: set this dynamically
    return labelNode?labelNode.firstChild.nodeValue:this.getMessage("noRssTitle");
  }

  /**
   * Returns an ID value for a node in the feature list
   * @param featureNode the feature node to selectfrom
   * @return ID for this feature
   */
  this.getFeatureId = function(featureNode) {
    return featureNode.getAttribute("fid")?featureNode.getAttribute("fid"):"no_id";
  }

  /**
   * Returns a point geometry for the feature
   * @param featureNode the feature node to select from
   * @return the geometric point for the node
   */
  this.getFeaturePoint = function(featureNode) {
    var coords = featureNode.selectSingleNode(this.coordSelectXpath);
    var coords = featureNode.selectSingleNode(coordSelectXpath);
    if (coords) {
      var point = coords.firstChild.nodeValue.split(',');
      return point
    } else {
      return new Array(0,0);  //or some other error to return?
    }
  }
  
 /**
   * Returns a GML geometry for the feature
   * @param featureNode the feature node to select from
   * @return the GML for the node
   */
  this.getFeatureGeometry = function(featureNode) {
    var geometryTag = featureNode.selectSingleNode(this.coordsTagName);
    if( geometryTag != null )
      return geometryTag.firstChild;
    else {
      alert(this.getMessage("invalidGeom", Sarissa.serialize(featureNode)));
    }
  }


}

