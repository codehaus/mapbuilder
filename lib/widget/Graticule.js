/*
Author:       Olivier Terral olivier.terralATgeomatys.fr
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: graticule.js 2200 2006-11-28 13:28:58Z oterral $
*/
// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");


function Graticule(widgetNode, model) {

	ButtonBase.apply(this, new Array(widgetNode, model));

	this.mapContainerId=widgetNode.selectSingleNode("mb:mapContainerId").firstChild.nodeValue;
	this.display=false;
	this.color=widgetNode.selectSingleNode("mb:color").firstChild.nodeValue;
	
	
	/**
   * Remove divs
   * @param objRef Pointer to this object.
   */
	this.remove = function(objRef) {
	
	  try{
			  var i = 0;
			  var div = objRef.map;
		
		  	for(i=0; i< objRef.divs.length; i++)
		  	{
				div.removeChild(objRef.divs[i]);
			}
	  }
	  catch(e){
	  }
	
	}

	/**
   * Get bbox of MapPane with the right projection
   * Return an object
   * @param objRef Pointer to this object.
   */
	this.getBbox= function(objRef) {
	
			var bbox=new Object();
			bbox.ll=new Object();
			bbox.ur=new Object();
			ll=objRef.proj.Inverse(new Array(objRef.bbox[0],objRef.bbox[1]));
			ur=objRef.proj.Inverse(new Array(objRef.bbox[2],objRef.bbox[3]));
		
			
			bbox.ll.lon=ll[0];		//minx
			bbox.ll.lat=ll[1];		//miny
			bbox.ur.lon=ur[0];		//maxx
			bbox.ur.lat=ur[1];		//maxy
		
			return bbox;
		
	}

	/**
   * Calculate rounded graticule interval for supplied lat/lon span
   * 
   * @param dDeg difference in degrees.
   */
	//
	//return is in minutes
	this.gridIntervalMins = function(dDeg) {  
	
	  var dDeg = dDeg/10;				//want around 10 lines in the graticule
	  dDeg *= 6000;						//to minutes*100
	  dDeg = Math.ceil(dDeg)/100;		//minutes and hundredths of mins
	
	  if(dDeg <= 0.06)
		dDeg = 0.06;//0.001 degrees
	  else if(dDeg <= 0.12)
		dDeg = 0.12;//0.002 degrees
	  else if(dDeg <= 0.3)
		dDeg = 0.3;//0.005 degrees
	  else if(dDeg <= 0.6)
		dDeg = 0.6;//0.01 degrees
	  else if (dDeg <=  1.2)
		dDeg = 1.2;//0.02 degrees
	  else if(dDeg <= 3)
		dDeg = 3;//0.05 degrees
	  else if(dDeg <= 6)
		dDeg = 6;//0.1 degrees
	  else if (dDeg <=  12)
		dDeg = 12;//0.2 degrees
	  else if (dDeg <=  30)
		dDeg = 30;//0.5
	  else if (dDeg <=  60)
		dDeg = 30;//1
	  else if (dDeg <=  (60*2))
		dDeg = 60*2;
	  else if (dDeg <=  (60*5))
		dDeg = 60*5;
	  else if (dDeg <=  (60*10))
		dDeg = 60*10;
	  else if (dDeg <=  (60*20))
		dDeg = 60*20;
	  else if (dDeg <=  (60*30))
		dDeg = 60*30;
	  else
		dDeg = 60*45;
	  
		
	  return dDeg;
	
}


	
	/* Calculate grid label precision from grid interval in degrees
	*
	*@param dDeg difference in degrees.
	*/
	this.gridPrecision = function(dDeg) {
		if(dDeg < 0.01)
			return 3;
		else if(dDeg < 0.1)
			return 2;
		else if(dDeg < 1)
			return 1;
		else return 0;
	}

	/* Draw graticules
	*
	*@param objRef pointer to this object.
	*/
	this.draw= function(objRef){

		//Delete old graticule
		objRef.remove(objRef);
		
		var bbox=objRef.getBbox(objRef);
		
		var l=bbox.ll.lon; //////ll:lower left coordinates 
		var b=bbox.ll.lat;		//ll:lower left ,ll.long : latitude(y) de coin en bas a gauche
		var r=bbox.ur.lon;			//ur:upper right ,ur.long : longitude de coin en haut a droite
		var t=bbox.ur.lat;		
		
		 //test if coords are valid
		  if (b < -90.0)
			b = -90.0;
		  if(t > 90.0)
			t = 90.0;
		  if(l < -180.0)
		    l = -180.0;  
		  if(r > 180.0)
		    r = 180.0;
		    
		  if(l == r){
			l = -180.0;
			r = 180.0;
		  }
		
		  if(t == b){
			b = -90.0;
			t = 90.0;
		  }
		 
		  
		  
		  //grid interval in minutes    
		  var dLat = objRef.gridIntervalMins(t-b);
		  var dLng; 
		  if(r>l)
			dLng = objRef.gridIntervalMins(r-l);
		  else
		    dLng = objRef.gridIntervalMins((180-l)+(r+180));
		
		  //round iteration limits to the computed grid interval
		  l = Math.floor(l*60/dLng)*dLng/60;
		  b = Math.floor(b*60/dLat)*dLat/60;
		  t = Math.ceil(t*60/dLat)*dLat/60;
		  r = Math.ceil(r*60/dLng)*dLng/60;
		  
		
		
		  //Tes if coords are valid
		  if (b <= -90.0)
			b = -90;
		  if(t >= 90.0)
			t = 90;
		  if(l < -180.0)
		    l = -180.0;  
		  if(r > 180.0)
		    r = 180.0;
		    
		  //to whole degrees
		  dLat /= 60;
		  dLng /= 60;

		  objRef.dLat=dLat;
		  objRef.dLon=dLng;
		  
		  //# digits after DP for labels
		  var latDecs = objRef.gridPrecision(dLat);
		  var lonDecs = objRef.gridPrecision(dLng);
		 
		  //array for divs used for lines and labels
		  objRef.divs = new Array();
		  var i=0;//count inserted divs
		
		  //min and max x and y pixel values for graticule lines
		  var pbl = objRef.fromLatLngToDivPixel(objRef,b,l);
		  var ptr = objRef.fromLatLngToDivPixel(objRef,t,r);
		
		  
		  objRef.maxX = ptr.x;
		  objRef.maxY = pbl.y;
		  objRef.minX = pbl.x;
		  objRef.minY = ptr.y;
		  var x;//coord for label
		  
		  //labels on second column to avoid peripheral controls
		  var y = objRef.fromLatLngToDivPixel(objRef,b+dLat+dLat,l).y + 2;//coord for label
		  
		  //pane/layer to write on
		  var mapDiv = objRef.map;//objRef.map_.getPane(G_MAP_MARKER_SHADOW_PANE);
		  
		  var lo = l;
		  
		  if(r<lo)
		      r += 360.0;
		
		  //vertical lines
		  while(lo<=r){
				
				 var p = objRef.fromLatLngToDivPixel(objRef,b,lo);
				 //line
				 objRef.divs[i] = objRef.createVLine(objRef,p.x);
				 mapDiv.insertBefore(objRef.divs[i],null);
				 i++;
				  	
				 //label	 
				 var d = document.createElement("DIV");
				 x = p.x + 3;
				 
				 d.style.position = "absolute";
		         d.style.left = x.toString() + "px";
		         d.style.top = y.toString() + "px";
				 d.style.color = objRef.color;
				 d.style.fontFamily='Arial';
				 d.style.fontSize='x-small';
		         
		         if (lo==0)
		         {
		         	d.innerHTML = (Math.abs(lo)).toFixed(lonDecs);
		         }
			     else if(lo<0)
				{	d.title = "West (WGS84)";
					d.innerHTML = (Math.abs(lo)).toFixed(lonDecs)+" E";
				 }
				 else 
				{	d.title = "East (WGS84)";
					d.innerHTML = (Math.abs(lo)).toFixed(lonDecs)+" W";
				 }
				 mapDiv.insertBefore(d,null);
				 objRef.divs[i] = d;
			
				 i++;
				 lo += dLng;	
				 if (lo > 180.0){
					r -= 360.0;
					lo -= 360.0;
					}		 		
  	}
  


	var j = 0;
	      
	  //labels on second row to avoid controls
	  x = objRef.fromLatLngToDivPixel(objRef,b,l+dLng+dLng).x + 3;
	  
	  //horizontal lines
	  while(b<=t){

			 var p = objRef.fromLatLngToDivPixel(objRef,b,l);
			 
			 //line
			 if(r < l){ //draw lines across the dateline
				objRef.divs[i] = objRef.createHLine3(objRef,b);
				mapDiv.insertBefore(objRef.divs[i],null);
				i++;
			 }
			 else if (r == l){ //draw lines for world scale zooms
			
				objRef.divs[i] = objRef.createHLine3(objRef,b);
				mapDiv.insertBefore(objRef.divs[i],null);
				i++;
			 }
			 else{
			 	
				objRef.divs[i] = objRef.createHLine(objRef,p.y);
				mapDiv.insertBefore(objRef.divs[i],null);
				i++;
			 }
			 
			 
			 
			 
			 //label
			 var d = document.createElement("DIV");
			 y = p.y + 2;
			 d.style.position = "absolute";
			 d.style.left =x.toString() + "px";
			 d.style.top = y.toString()+ "px";
			 d.style.color = objRef.color;
			 d.style.fontFamily='Arial';
			 d.style.fontSize='x-small';
			 
			 if (b==0)
	         {
	         	d.innerHTML = (Math.abs(b)).toFixed(lonDecs);
	         }
			 else if(b<0)
			{	d.title = "South (WGS84)";
				d.innerHTML = (Math.abs(b)).toFixed(latDecs)+" S";
			}
			 else 
			{	d.title = "North (WGS84)";
				d.innerHTML = (Math.abs(b)).toFixed(latDecs)+" N";
			}
			 if(j != 2)//dont put two labels in the same place
			 {
				 mapDiv.insertBefore(d,null);
				 objRef.divs[i] = d;
				 i++;
			 }
			 j++;
			 b += dLat;
	  }
	 

	}
	
	/*Transform lat/lon coordinates in pixels coordinates
	* Returns an object container pixel coordinates
	*@param objRef pointer to this object.
	*@param lat lon  coordiantes in degrees 
	*/
	this.fromLatLngToDivPixel = function(objRef,lat,lon){
	
		var xy=objRef.proj.Forward(new Array(lon,lat));
		var platlon=new Object();
		
		platlon.x=objRef.targetModel.extent.getPL(xy)[0];
		platlon.y=objRef.targetModel.extent.getPL(xy)[1];
		return platlon;
	}
	
	/*Create a vertical line
	* Returns a div that is a vertical single pixel line
	*@param objRef pointer to this object.
	*@param x left style property for div element 
	*/
	
	this.createVLine = function (objRef,x) {

		var div = document.createElement("DIV");
		div.style.position = "absolute";
		div.style.overflow = "hidden";
		div.style.backgroundColor = objRef.color;
		div.style.left = x + "px";
		div.style.top = objRef.minY + "px";
		div.style.width = "1px";
		div.style.height = (objRef.maxY-objRef.minY) +"px";				
	    return div;
	
	}
 
	/*Create a horizontal line
	* Returns a div that is a horizontal single pixel line
	*@param objRef pointer to this object.
	*@param y top style property for div element 
	*/  	  
	this.createHLine = function(objRef,y) {

		var div = document.createElement("DIV");
		div.style.position = "absolute";
		div.style.overflow = "hidden";
		div.style.backgroundColor = objRef.color;
		div.style.left = objRef.minX + "px";
		div.style.top = y + "px";
		div.style.width = (objRef.maxX-objRef.minX) + "px";
		div.style.height = "1px";
	    return div;
	
	}
	/*Create a horizontal line
	* Returns a div that is a horizontal single pixel line, across the dateline  
	* we find the start and width of a 180 degree line and draw the same amount
	* to its left and right	
	*@param objRef pointer to this object.
	*@param lat latitude of  div element.
	*/  
		this.createHLine3 = function(objRef,lat) {
		
			var f = objRef.fromLatLngToDivPixel(objRef,lat,0);
			var t = objRef.fromLatLngToDivPixel(objRef,lat,180);		
		
			var div = document.createElement("DIV");
			div.style.position = "absolute";
			div.style.overflow = "hidden";
			div.style.backgroundColor = objRef.color;
			
			var x1 = f.x;
			var x2 = t.x;
			
			if(x2 < x1)
			{
				x2 = f.x;
				x1 = t.x;
			}
			div.style.left = (x1-(x2-x1)) + "px";
			div.style.top = f.y + "px";
			div.style.width = ((x2-x1)*2) + "px";
			div.style.height = "1px";
		    return div;
			
}  

		/*Initialize Graticule's property 
		* 
		*@param objRef pointer to this object.
		*/ 
		this.init= function (objRef){
			objRef.width=parseInt(objRef.targetModel.getWindowWidth());
			objRef.height=parseInt(objRef.targetModel.getWindowHeight());
			
			objRef.bbox=objRef.targetModel.getBoundingBox();
			objRef.proj=new Proj( objRef.targetModel.getSRS());
		
			if (objRef.bbox[1]<0)
				if(objRef.bbox[3]<0)
					objRef.diffLat=objRef.bbox[1]-objRef.bbox[3];
				else
					objRef.diffLat=objRef.bbox[3]-objRef.bbox[1];
			else
				objRef.diffLat=objRef.bbox[3]+objRef.bbox[1];
				
			if (objRef.bbox[0]<0)
				if(objRef.bbox[2]<0)		
					objRef.diffLon=objRef.bbox[0]-objRef.bbox[2];
				else
					objRef.diffLon=objRef.bbox[2]-objRef.bbox[0];
			else
				objRef.diffLon=objRef.bbox[2]+objRef.bbox[0];
		
			
		  	objRef.draw(objRef);

}

		/*Display graticule when click on button
		* 
		*@param objRef pointer to this object.
		*@param selected boolean true if button has been clicked , false if no
		*/ 
		this.doSelect = function(selected,objRef) {
		
		 
		  
		if(selected && objRef.display==false)
		 { 	
		 	this.targetModel.addListener("bbox", this.init, this );
		 	objRef.display=true;
		 	objRef.map = document.getElementById(objRef.mapContainerId);
			objRef.init(objRef);
		}
		else if (objRef.display==true)
		{	this.targetModel.removeListener("bbox", this.init, this );
			objRef.display=false;
			objRef.remove(objRef);
		}      
	}
}
