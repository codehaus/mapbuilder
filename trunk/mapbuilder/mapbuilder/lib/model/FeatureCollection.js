/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

/**
 * Stores a GML Feature or FeatureCollection as defined by the
 * Open GIS Conortium http://opengis.org.
 *
 * @constructor
 * @base ModelBase
 * @author Cameron Shorter
 * @requires Sarissa
 * @param modelNode The model's XML object node from the configuration document.
 * @param parent Parent model, if required.
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
   * if required
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
            var llTemp = sourceProj.Inverse(xy);
            xy = containerProj.Forward(llTemp);
            newCoords += xy.join(',') + ' ';
          }
          coordNodes[i].firstChild.nodeValue=newCoords;
        }
      }
    }
  }
  this.addFirstListener("loadModel",this.convertCoords,this);

  /**
   * Change a Layer's visibility.
   * @param layerIndex The index of the LayerList/Layer from the Context which
   * has changed.
   * @param hidden, 1=hidden, 0=not hidden.
   */
  this.setHidden=function(featureName, hidden){
    this.hidden = hidden;
    this.callListeners("hidden", featureName);
  }

  /**
   * Get the layer's visiblity.
   * @param layerIndex The index of the LayerList/Layer from the Context which
   * has changed.
   * @return hidden value, true=hidden, false=not hidden.
   */
  this.getHidden=function(layerName){
    return this.hidden;
  }
  this.hidden = false;

}

