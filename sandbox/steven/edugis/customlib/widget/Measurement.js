/*
Author: imke doerge AT geodan.nl
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: Measurement.js,v 1.00 2005/08/03 19:07:00 mattdiez Exp $
*/

// Ensure this object's dependencies are loaded.
mapbuilder.loadScript(baseDir+"/../customlib/widget/EditButtonBase.js");
mapbuilder.loadScript(baseDir+"/../customlib/widget/ShowDistance.js");
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
    // cursor can be changed by spefying a new cursor in config file
    this.cursor = "crosshair";	
        
	var totalDistance=0;
    var distance = 0;
    var state = false;
    var restart = false;
    /**
    * Append a point to a line
    * @param objRef      Pointer to this object.
    * @param targetNode  The node for the enclosing HTML tag for this widget.
    */
    this.doAction = function(objRef,targetNode) {
        if (objRef.enabled) {
				if(objRef.restart) {
				objRef.targetModel.setParam("clearMeasurementLine");
				objRef.restart= false;
				}
				
            point=objRef.mouseHandler.model.extent.getXY(targetNode.evpl);
            old=objRef.targetModel.getXpathValue(objRef.targetModel,objRef.featureXpath);
            if(!old) old="";
                sucess=objRef.targetModel.setXpathValue(objRef.targetModel,objRef.featureXpath,old+" "+point[0]+","+point[1]);
            if(!sucess){
                alert("Measurement: invalid featureXpath in config: "+objRef.featureXpath);
            }
			
            LineCoords = objRef.targetModel.getXpathValue(objRef.targetModel, objRef.featureXpath);
            CoordArray = LineCoords.split(" ");
            if (CoordArray.length >= 3) {
                Point_P = CoordArray[CoordArray.length-2];
                Point_Q = CoordArray[CoordArray.length-1];
            
                //Split Point in x and y coordinate
                var P =Point_P.split(",");
                var Q =Point_Q.split(",");
                
                 //transform coordinates from lat/lon to x/y in meter 
                this.srs = srs.toUpperCase();
                objRef.proj = new Proj (this.srs);
                //objRef.proj = new Proj ("EPSG:42101"); //only for testing!
                
                if (objRef.proj.Forward) {
                    P = objRef.proj.Forward( P );
                    Q = objRef.proj.Forward( Q );
                }
                if (!P || !Q || objRef.proj.Forward == identity ){
                    TotalDistance="Projection not supported!";
                }
                else{
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
            }    
            objRef.targetModel.setParam("totalDistance", totalDistance); //set parameter: to this value the MeasurementTrack distance is added
            objRef.targetModel.setParam("showDistance", totalDistance); // set parameter for the distance output
            objRef.targetModel.setParam("mouseRenderer", true);
            
        }
        else 
        {
            objRef.targetModel.setParam("mouseRenderer", false);
        }
    }
    
    
    this.clearMeasurementLine = function(objRef){
        if (totalDistance !=0) {
            totalDistance=0;
            objRef.targetModel.values.totalDistance = 0;
            sucess=objRef.targetModel.setXpathValue(objRef.targetModel,objRef.featureXpath,"");
            if(!sucess){
                alert("Measurement: invalid featureXpath in config: "+objRef.featureXpath);
            }
            objRef.targetModel.setParam("showDistance", totalDistance);
            objRef.targetModel.setParam("refresh");
        }
    }
    //add a Listener to the model
	this.model.addListener("clearMeasurementLine", this.clearMeasurementLine, this);
    
    
  
    

}


