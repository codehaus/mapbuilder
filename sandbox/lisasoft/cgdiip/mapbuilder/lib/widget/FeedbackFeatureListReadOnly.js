/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureList.js 3256 2007-09-14 00:39:54Z mvivian $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Functions to render and update a FeatureList from GML.
 * @constructor
 * @base WidgetBaseXSL
 * @author Cameron Shorter
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function FeedbackFeatureListReadOnly(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));
  
  /**
   * Receives onclick event and notifies model of selectFeature and zoomToFeature
   * events.
   * @param objRef this widget
   * @param event  the OL event received after a selecting a feature on the map
   */
  this.onClick = function(objRef, event) {
    var fid = event.feature.fid;

    // notify model of selectFeature and zoomToFeature events
    objRef.model.setParam('selectFeature', fid);
    objRef.model.setParam('zoomToFeature', fid);
  }
  this.model.addListener("olFeatureSelect", this.onClick, this);

  /**
   * Shows table of feature attributes 
   * @param objRef this widget
   * @param fid    Id of selected feature
   */
  this.selectFeature = function(objRef, fid) {
    // force stylesheet to only draw this feature
    objRef.stylesheet.setParameter("fid", fid);

    // refresh attribute list
    objRef.paint(objRef);
  }
  this.model.addListener('selectFeature', this.selectFeature, this);


  /**
   * Zooms map to selected feature
   * @param objRef this widget
   * @param fid    Id of selected feature
   */
  this.zoomToFeature = function(objRef, fid) {

    // quick hack to get coordinates for this feature
    coordinates = objRef.model.doc.selectSingleNode('//*[atom:id=\'' + fid + '\']/georss:where/gml:Point/gml:pos').firstChild.nodeValue;

    // only if there are coordinates, proceed
    if (coordinates) {
      bboxArray = coordinates.split(" ");

      mapModel = config.objects.mainMap;

      // create a fake extent using the point coordinates and zoom out a bit
      mapModel.map.zoomToExtent(new OpenLayers.Bounds(bboxArray[0],bboxArray[1],bboxArray[0],bboxArray[1]));
      mapModel.map.zoomTo( mapModel.map.getNumZoomLevels() - 8);

    }
  }
  this.model.addListener('zoomToFeature', this.zoomToFeature, this);

  /**
   * Set the value of an attribute from the FeatureList.
   * @param objRef Reference to this object.
   * @param xpath Xpath reference to the attribute in the GML.
   * @param value New attribute value.
   */
  this.setNodeValue=function(objRef,xpath,value){
    objRef.model.setXpathValue(objRef.model,xpath,value,null,!IS_IE);
  }

  /**
   * Set the value of an attribute from the FeatureList.
   * @param objRef Reference to this object.
   * @param xpath Xpath reference to the attribute in the GML.
   * @param attrib Name of the attribute to update
   * @param value New attribute value.
   */
  this.setAttribValue=function(objRef,xpath,attrib,value){
    objRef.model.setXpathAttribute(objRef.model,xpath,attrib,value,null,!IS_IE);
  }
}
