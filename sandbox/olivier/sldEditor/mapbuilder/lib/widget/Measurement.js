/*
Author: imke doerge AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependencies are loaded.
mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");


/**
 * When this button is selected, clicks on the MapPane will add a
 * new point to a line and the total distance of the line will be calculated
 * @constructor
 * @base EditButtonBase
 * @author Imke Doerge AT geodan.nl
 * @param widgetNode The widget from the Config XML file.
 * @param model  The parent model for this  widget.
 */
function Measurement(widgetNode, model) {
  EditButtonBase.apply(this, new Array(widgetNode, model));
    
  // override default cursor by user
  // cursor can be changed by specifying a new cursor in config file
  this.cursor = "crosshair";	
        
  var totalDistance=0;
  var distance = 0;
  var state = false;
  var restart = false;
  /**
  * Append a point to a line and calculate the distance between all points on the line
  * @param objRef      Pointer to this object.
  * @param targetNode  The node for the enclosing HTML tag for this widget.
  */
  this.doAction = function(objRef,targetNode) {
    if (objRef.enabled) {
		  if(objRef.restart) {
        objRef.model.setParam("clearMeasurementLine");
			  objRef.restart= false;
			}
				
      var point=objRef.mouseHandler.model.extent.getXY(targetNode.evpl);
      var old=objRef.targetModel.getXpathValue(objRef.targetModel,objRef.featureXpath);
      if(!old) old="";
        sucess=objRef.targetModel.setXpathValue(objRef.targetModel,objRef.featureXpath,old+" "+point[0]+","+point[1]);
      if(!sucess) {
        alert(mbGetMessage("invalidFeatureXpathMeasurement", objRef.featureXpath));
      }
			
      var lineCoords = objRef.targetModel.getXpathValue(objRef.targetModel, objRef.featureXpath);
      var coordArray = lineCoords.split(" ");
      if (coordArray.length >= 3) {
        var point_P = coordArray[coordArray.length-2];
        var point_Q = coordArray[coordArray.length-1];
            
        //Split point in x and y coordinate
        var P =point_P.split(",");
        var Q =point_Q.split(",");
              
        //transform coordinates from lat/lon to x/y in meter 
        objRef.srs = srs.toUpperCase();
        objRef.proj = new Proj (objRef.srs);
                
        if (objRef.proj.Forward) {
          P = objRef.proj.Forward( P );
          Q = objRef.proj.Forward( Q );
        }
        if (!P || !Q  ){
          alert(mbGetMessage("projectionNotSupported"));
        }
        else {
          //If projection is in meters use simple pythagoras
          if(objRef.proj.units == "meters") {
            Xp=parseFloat(P[0]);
            Yp=parseFloat(P[1]);
            Xq=parseFloat(Q[0]);
            Yq=parseFloat(Q[1]);
            // calculate the distance between these two points via Pythagoras' theorem  
            distance=Math.sqrt(((Xp-Xq)*(Xp-Xq))+((Yp-Yq)*(Yp-Yq)))
			      if(distance==0) {
              objRef.restart = true;
              objRef.model.setParam("clearMouseLine");objRef.targetModel.setParam("mouseRenderer", false);
		    		return;
				  	}
            totalDistance = Math.round(totalDistance + distance);
          }
          //If projection is in degrees use great circle formulae 
          //http://williams.best.vwh.net/avform.htm#GCF
          else if(objRef.proj.units == "degrees") {
            deg2rad = Math.PI / 180.0
            LonpRad=parseFloat(P[0]) * deg2rad;
            LatpRad=parseFloat(P[1]) * deg2rad;
            LonqRad=parseFloat(Q[0]) * deg2rad;
            LatqRad=parseFloat(Q[1]) * deg2rad;
            radDistance=Math.acos(Math.sin(LatpRad)*Math.sin(LatqRad)+Math.cos(LatpRad)*Math.cos(LatqRad)*Math.cos(LonpRad-LonqRad));
            radDistance=Math.acos(Math.sin(Latp)*Math.sin(Latq)+Math.cos(Latp)*Math.cos(Latq)*Math.cos(Lonp-Lonq));
            distance =radDistance * 6378137;
            if(distance==0) {
              objRef.restart = true;
              objRef.model.setParam("clearMouseLine");objRef.targetModel.setParam("mouseRenderer", false);
            return;
            }
            totalDistance = Math.round(totalDistance + distance);
          }
          else alert(mbGetMessage("cantCalculateDistance"));
        }
      }    
      objRef.targetModel.setParam("showDistance", totalDistance); // set parameter for the distance output
    }
  }
  
  
  this.clearMeasurementLine = function(objRef){
    if (totalDistance !=0) {
      totalDistance=0;
      sucess=objRef.targetModel.setXpathValue(objRef.targetModel,objRef.featureXpath,"");
      if(!sucess){
        alert(mbGetMessage("invalidFeatureXpathMeasurement", objRef.featureXpath));
      }
      objRef.targetModel.setParam("refresh");
    }
  }
  //add a Listener to the model
	this.model.addListener("clearMeasurementLine", this.clearMeasurementLine, this);
}
