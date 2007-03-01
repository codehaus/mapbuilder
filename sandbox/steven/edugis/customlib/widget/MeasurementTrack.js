

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/../customlib/util/wz_jsgraphics/wz_jsgraphics.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");


/**
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function MeasurementTrack(widgetNode, model) {
    WidgetBaseXSL.apply(this,new Array(widgetNode, model));
 
    state = false;
    
    /** 
    *  get the coordinates from the last clicked point  (= start point of the line)
    */
    this.mouseUpHandler = function(objRef,targetNode) {
        PointStart = objRef.targetModel.extent.getXY( targetNode.evpl );
        PointStart = objRef.targetModel.extent.getPL( PointStart);
    }
 
 
    /**
    *   get the mouse location and if measurement state is true 
    *   set the XpathValue to draw the line and 
    *   calculate the distance between the last clicked point and the Mouse
    */
    this.mouseMoveHandler = function(objRef, targetNode){
        var PointEnd = objRef.targetModel.extent.getXY( targetNode.evpl );
        PointEnd =  objRef.targetModel.extent.getPL(PointEnd);
        if (state) {
            objRef.model.setXpathValueML(objRef.model,objRef.featureXpath,
                                        PointStart[0] + "," + PointStart[1] + " " + PointEnd[0] + "," + PointEnd[1]);
            objRef.calcDistance(objRef, PointStart, PointEnd);                            
        }
       objRef.reportCursorCoords();
       
   }
 
 
  /**
   * Add mouse event listeners to the MapContainer object sepecified by the
   * mouseHandler property in config.
   * @param objRef Pointer to this MeasurementTrack object.
   */
    this.init = function(objRef) {
        /** Empty XML to load when this tool is selected. */
        objRef.defaultModelUrl=widgetNode.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
        /** Reference to XML node to update when a feature is added. */
        objRef.featureXpath=widgetNode.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
        measurementWidgetID = widgetNode.selectSingleNode("mb:measurementWidgetID").firstChild.nodeValue;
        
        var mouseHandler = widgetNode.selectSingleNode("mb:mouseHandler");
        if (!mouseHandler){
            alert('MeasurementTrack requires a mouseHandler property');
        } else {
            objRef.mouseHandler = window.config.objects[mouseHandler.firstChild.nodeValue];
            objRef.mouseHandler.addListener('mousemove', objRef.mouseMoveHandler, objRef);
            objRef.mouseHandler.addListener('mouseup', objRef.mouseUpHandler, objRef);
            PointStart = null;
            state = false;
            distance = null;
        }
        
    }
    this.model.addListener("loadModel", this.init, this );


    /**
    *   calculate the distance between PointStart (=last cliecked point) and PointEnd (=mouse loccation)
    */
    this.calcDistance = function(objRef, PointStart, PointEnd){
                     
        // get some values to transform the pixel to real world coordinates 
        width = objRef.model.containerModel.getWindowWidth();
        height = objRef.model.containerModel.getWindowHeight();
        bBox=objRef.model.containerModel.getBoundingBox();
        bBoxMinX = bBox[0];
        bBoxMinY = bBox[1];
        bBoxMaxX = bBox[2];
        bBoxMaxY = bBox[3];
        xRatio = width / ( bBoxMaxX - bBoxMinX )
        yRatio =  height / ( bBoxMaxY - bBoxMinY )
        
        Xs = parseFloat(((PointStart[0]) /  xRatio ) + bBoxMinX);
        Ys = parseFloat(((height - (PointStart[1])) / yRatio) + bBoxMinY);
        Xe = parseFloat(((PointEnd[0]) / xRatio) + bBoxMinX);
        Ye = parseFloat(((height - (PointEnd[1])) / yRatio) + bBoxMinY);
        
        // calculate the distance between these two points via Pythagoras' theorem  
        distanceNew=Math.sqrt(((Xs-Xe)*(Xs-Xe))+((Ys-Ye)*(Ys-Ye)));
        totalDist = Math.round(distance + distanceNew);
        objRef.model.setParam("showDistance", totalDist);
    }
    
    
    /**
    *   get the status of measurement (enabled = true, disabled/paused = false)
    */   
    this.measurementState = function(objRef){
        state = objRef.model.values.mouseRenderer;
    }
    this.model.addListener("mouseRenderer", this.measurementState, this); 
    
    
    /**
    *   get the total distance of the measurement line
    */    
    this.distanceValue = function(objRef){
       distance = objRef.model.values.totalDistance;
    }
    this.model.addListener("totalDistance", this.distanceValue, this); 
        
    
    /**
    *   clear the mouse line
    */    
    this.clearMouseLine = function(objRef){
        distance = objRef.model.values.totalDistance;
        state=false;
        objRef.model.setXpathValueML(objRef.model,objRef.featureXpath,"");
        objRef.model.setParam("showDistance", distance);
    }
    this.model.parentModel.addListener("clearMouseLine",this.clearMouseLine, this);
        
    
    /**
    *   continue drawing the mouse line when the measurement tool was paused
    *   get the coordinates from the last point of the measurement line as PointStart
    *   and transform it to pixel, set state = true    
    */    
    this.endPause = function(objRef){
        // get the last point of the measurement line
        measurementXpath = window.config.objects[measurementWidgetID].featureXpath;
        coordsLine = objRef.model.getXpathValue(objRef.model, measurementXpath);
        CoordArray = coordsLine.split(" ");
        point_S = CoordArray[CoordArray.length-1];
        var Sxy = point_S.split(",");
            
        // get some values to transform the real world coordinates into pixel
        width = objRef.model.containerModel.getWindowWidth();
        height = objRef.model.containerModel.getWindowHeight();
        bBox=objRef.model.containerModel.getBoundingBox();
        bBoxMinX = bBox[0];
        bBoxMinY = bBox[1];
        bBoxMaxX = bBox[2];
        bBoxMaxY = bBox[3];
        xRatio = width / ( bBoxMaxX - bBoxMinX )
        yRatio =  height / ( bBoxMaxY - bBoxMinY )
         
        PointStart[0] = parseFloat((Sxy[0]) - bBoxMinX) * xRatio;
        PointStart[1] = parseFloat(height - ((Sxy[1]) - bBoxMinY) * yRatio);
          
        state = true; 
    }   
    this.model.parentModel.addListener("endPause",this.endPause, this);
    
    
    /**
    *   report the current mouse location to the cursorTrack widget
    */
    this.reportCursorCoords = function() {
      var cursorTrackObject = window.cursorTrackObject;
      if (state) {
        var evXY = cursorTrackObject.model.extent.getXY( window.cursorTrackNode.evpl );
        if( cursorTrackObject.showXY ) {
      if( cursorTrackObject.coordForm.x )
        cursorTrackObject.coordForm.x.value = evXY[0].toFixed(0);;
      if( cursorTrackObject.coordForm.y )
        cursorTrackObject.coordForm.y.value = evXY[1].toFixed(0);;
    }
      }
    }   
}


    