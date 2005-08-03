/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

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
  var modelBase = new ModelBase(this, modelNode, parent);

  // Namespace to use when doing Xpath queries, usually set in config file.
  if (!this.namespace){
    this.namespace = "xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
  }

  /**
   * convert coordinates in the GML document to the SRS of the map container, 
   * if required.  The coordinate values are replaced in the GML document.
   * @param objRef Pointer to this object.
   */
  this.convertCoords = function(objRef) {
    var coordNodes = objRef.doc.selectNodes("//gml:coordinates");
    if (coordNodes.length>0) {
      //var srsName = coordNodes[0].parentNode.getAttribute("srsName");
      var srsNode = coordNodes[0].selectSingleNode("ancestor-or-self::*/@srsName");
      var sourceProj = new Proj(srsNode.nodeValue);
      if ( !sourceProj.matchSrs( objRef.containerModel.getSRS() )) {  
        objRef.setParam("modelStatus","converting coordinates");
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
  this.addFirstListener("loadModel",this.convertCoords,this);

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
    return this.doc.selectNodes(this.nodeSelectXpath);
  }

  /**
   * Returns a label for a node in the feature list
   * @param featureNode the feature node to selectfrom
   * @return a label for this feature
   */
  this.getFeatureName = function(featureNode) {
    var labelNode = featureNode.selectSingleNode("topp:CITY_NAME");   //TBD: set this dynamically
    return labelNode?labelNode.firstChild.nodeValue:"No RSS title";
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
	 var coordSelectXpath = "topp:the_geom/gml:MultiPoint/gml:pointMember/gml:Point/gml:coordinates";//TBD: set this dynamically
    var coords = featureNode.selectSingleNode(coordSelectXpath);
    if (coords) {
      var point = coords.firstChild.nodeValue.split(',');
      return point
    } else {
      return new Array(0,0);  //or some other error to return?
    }
  }


}

