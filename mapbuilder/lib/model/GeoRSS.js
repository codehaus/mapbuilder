/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

/**
 * Stores a GML Feature or FeatureCollection as defined by the
 * Open Geospatial Consortium (http://www.opengeospatial.org/).
 *
 * WARNING: This model is only to be used if you do not want to embed the GeoRSS feed
 * in the context doc. See also MAP-271
 * @deprecated
 * @constructor
 * @base ModelBase
 * @author Cameron Shorter
 * @requires Sarissa
 * @param modelNode The model's XML object node from the configuration document.
 * @param parent    The parent model for the object.
  */
function GeoRSS(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));

  /** init
   * @param objRef Pointer to this object.
   */
  this.initItems = function(objRef) {
    var items = objRef.doc.selectNodes("rdf:RDF/rss:item");
    if( items.length == 0 ) {
      items = objRef.doc.selectNodes("atom:feed/atom:entry");
     }
   
    for (var i=0; i<items.length; ++i) {
      var item = items[i];
      item.setAttribute("divid", "RSS_Item_"+mbIds.getId());
    }
  }
  // OBE this.addFirstListener("loadModel",this.initItems,this);

  /**
   * Returns the list of nodes selected by the nodeSelectpath
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
    var labelNode = featureNode.selectSingleNode("rss:title");
    if( labelNode == null )
      labelNode = featureNode.selectSingleNode("atom:title");
    return labelNode?getNodeValue(labelNode):mbGetMessage("noRssTitle");
  }

  /**
   * Returns an ID value for a node in the feature list
   * @param featureNode the feature node to selectfrom
   * @return ID for this feature
   */
  this.getFeatureId = function(featureNode) {
    var id = featureNode.getAttribute("divid")
    if( id )
      return id;
      
    return "no_id";
  }

  /**
   * Returns a point geometry for the feature
   * @param featureNode the feature node to select from
   * @return the geometric point for the node
   */
  this.getFeaturePoint = function(featureNode) {
    if (featureNode.selectSingleNode("geo:long")) {
      var pointX = getNodeValue(featureNode.selectSingleNode("geo:long"));
      var pointY = getNodeValue(featureNode.selectSingleNode("geo:lat"));
      return new Array(pointX, pointY);
    } else {
       var pos = featureNode.selectSingleNode("georss:where/gml:Point/gml:pos")
       if( pos != null ) {
       var coordstr = getNodeValue(pos);
       //alert("coords:"+coordstr );
       var coords = coordstr.split(" ")
       var pointX = coords[0]
       var pointY = coords[1]
       return new Array(pointX, pointY);
       } else {
         return new Array(0,0);  //or some other error to return?
       }
    }
  }
 
 /**
   * Returns the geometry for the feature
   * @param featureNode the feature node to select from
   * @return the geometric point for the node
   */
  this.getFeatureGeometry = function(featureNode) {
    if (featureNode.selectSingleNode("geo:long")) {
      var pointX = getNodeValue(featureNode.selectSingleNode("geo:long"));
      var pointY = getNodeValue(featureNode.selectSingleNode("geo:lat"));
      return "POINT " + pointX + "," + pointY;
    } 
      
    var pos = featureNode.selectSingleNode("georss:where/gml:Point/gml:pos")
    if( pos != null ) {
      var coordstr = getNodeValue(pos);
      return "POINT " + coordstr;
    } 
    
    var posList = featureNode.selectSingleNode("georss:where/gml:LineString/gml:posList")
    if( posList != null ) { //WARNING: could overflow so get all nodes
      var children = posList.childNodes;       
      var count = children.length;
      var text="";     
      for( var i=0; i<count; i++ ) {
        text += children[i].nodeValue;
      }
      //alert("count:"+ count + " length:"+text.length)
      
      return "LINESTRING " + text;
    }
 
    var posList = featureNode.selectSingleNode("georss:where/gml:Polygon/gml:exterior/gml:LinearRing")
    if( posList != null ) {
      var coordstr = getNodeValue(posList);
      return "POLYGON " + coordstr;
    } 
    
    alert(mbGetMessage("invalidGmlGeom"));
    return null
  }
  
  /**
    * Get the GML Node out of the RSS feed
    */
  this.getFeatureGml = function(featureNode) {
    var where = featureNode.selectSingleNode("georss:where")
    if( where != null ) {
      var gml = where.firstChild; 
      return gml;
    } else {
      return null;
    }
  }
  
  
  /**
  * Returns a specific icon for that entry
  * @param featureNode the feature node to select from
  * @return the geometric point for the node
  */
  this.getFeatureIcon = function( featureNode ) {
    if( featureNode == null )
      return null;
      
    // look for an icon tag
    var icon = featureNode.selectSingleNode("atom:icon");
    if (icon != undefined) {
      return getNodeValue(icon);
    } else {
      return null;
    }
  }
}

