/*
Author:       Olivier Terral olivier.terralATgeomatys.fr
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: Graticule.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");


function Graticule(widgetNode, model) {

	ButtonBase.apply(this, new Array(widgetNode, model));

	this.mapContainerId=widgetNode.selectSingleNode("mb:mapContainerId").firstChild.nodeValue;
	this.display=false;
	this.color=widgetNode.selectSingleNode("mb:color").firstChild.nodeValue;
	
	/**
   * Interactive ZoomOut control.
   * @param objRef reference to this object.
   * @return {OpenLayers.Control} class of the OL control.
   */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit( OpenLayers.Control, {
      CLASS_NAME: 'mbControl.Graticule',
      type: OpenLayers.Control.TYPE_BUTTON,
	objRef:objRef,
////////////////////////////ancien/////////////////////	
/**
   * Remove divs
   * @param objRef Pointer to this object.
   */
	remove : function() {
	
	  try{
			  var i = 0;
			  var div = this.mapContainer;
		
		  	for(i=0; i< this.divs.length; i++)
		  	{
				div.removeChild(this.divs[i]);
			}
	  }
	  catch(e){
	  }
	
	},

	/**
   * Get bbox of MapPane with the right projection
   * Return an object
   * @param this Pointer to this object.
   */
	getBbox : function() {
	
			var bbox=new Object();
			bbox.ll=new Object();
			bbox.ur=new Object();
			///CSCS
    		var ll=new PT(this.bbox[0], this.bbox[1]);
    		var ur=new PT(this.bbox[2], this.bbox[3]);
    		
    		cs_transform(this.proj,new CS(csList.EPSG4326),ll);
    		cs_transform(this.proj,new CS(csList.EPSG4326),ur);
		
			
			bbox.ll.lon=ll.x;		//minx
			bbox.ll.lat=ll.y;		//miny
			bbox.ur.lon=ur.x;		//maxx
			bbox.ur.lat=ur.y;		//maxy
		
			return bbox;
		
	},

	/**
   * Calculate rounded graticule interval for supplied lat/lon span
   * 
   * @param dDeg difference in degrees.
   */
	//
	//return is in minutes
	gridIntervalMins : function(dDeg) {  
	
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
	
},


	
	/* Calculate grid label precision from grid interval in degrees
	*
	*@param dDeg difference in degrees.
	*/
	gridPrecision : function(dDeg) {
		if(dDeg < 0.01)
			return 3;
		else if(dDeg < 0.1)
			return 2;
		else if(dDeg < 1)
			return 1;
		else return 0;
	},

	/* Draw graticules
	*
	*@param this pointer to this object.
	*/
	drawtmp : function(){

		//Delete old graticule
		this.remove();
		
		var bbox=this.getBbox();
		
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
		  var dLat = this.gridIntervalMins(t-b);
		  var dLng; 
		  if(r>l)
			dLng = this.gridIntervalMins(r-l);
		  else
		    dLng = this.gridIntervalMins((180-l)+(r+180));
		
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

		  this.dLat=dLat;
		  this.dLon=dLng;
		  
		  //# digits after DP for labels
		  var latDecs = this.gridPrecision(dLat);
		  var lonDecs = this.gridPrecision(dLng);
		 
		  //array for divs used for lines and labels
		  this.divs = new Array();
		  var i=0;//count inserted divs
		
		  //min and max x and y pixel values for graticule lines
		  var pbl = this.fromLatLngToDivPixel(b,l);
		  var ptr = this.fromLatLngToDivPixel(t,r);
		
		  
		  this.maxX = ptr.x;
		  this.maxY = pbl.y;
		  this.minX = pbl.x;
		  this.minY = ptr.y;
		  var x;//coord for label
		  
		  //labels on second column to avoid peripheral controls
		  var y = this.fromLatLngToDivPixel(b+dLat+dLat,l).y + 2;//coord for label
		  
		  //pane/layer to write on
		  var mapDiv = this.mapContainer;//this.map_.getPane(G_MAP_MARKER_SHADOW_PANE);
		  
		  var lo = l;
		  
		  if(r<lo)
		      r += 360.0;
		
		  //vertical lines
		  while(lo<=r){
				
				 var p = this.fromLatLngToDivPixel(b,lo);
				 //line
				 this.divs[i] = this.createVLine(p.x);
				 mapDiv.insertBefore(this.divs[i],null);
				 i++;
				  	
				 //label	 
				 var d = document.createElement("DIV");
				 x = p.x + 3;
				 
				 d.style.position = "absolute";
		         d.style.left = x.toString() + "px";
		         d.style.top = y.toString() + "px";
				 d.style.color = this.color;
				 d.style.fontFamily='Arial';
				 d.style.fontSize='x-small';
		         
		         if (lo==0)
		         {
		         	d.innerHTML = (Math.abs(lo)).toFixed(lonDecs);
		         }
			     else if(lo<0)
				{	d.title = mbGetMessage("westWgs84");
					d.innerHTML = (Math.abs(lo)).toFixed(lonDecs)+" E";
				 }
				 else 
				{	d.title = mbGetMessage("eastWgs84");
					d.innerHTML = (Math.abs(lo)).toFixed(lonDecs)+" W";
				 }
				 mapDiv.insertBefore(d,null);
				 this.divs[i] = d;
			
				 i++;
				 lo += dLng;	
				 if (lo > 180.0){
					r -= 360.0;
					lo -= 360.0;
					}		 		
  	}
  


	var j = 0;
	      
	  //labels on second row to avoid controls
	  x = this.fromLatLngToDivPixel(b,l+dLng+dLng).x + 3;
	  
	  //horizontal lines
	  while(b<=t){

			 var p = this.fromLatLngToDivPixel(b,l);
			 
			 //line
			 if(r < l){ //draw lines across the dateline
				this.divs[i] = this.createHLine3(b);
				mapDiv.insertBefore(this.divs[i],null);
				i++;
			 }
			 else if (r == l){ //draw lines for world scale zooms
			
				this.divs[i] = this.createHLine3(b);
				mapDiv.insertBefore(this.divs[i],null);
				i++;
			 }
			 else{
			 	
				this.divs[i] = this.createHLine(p.y);
				mapDiv.insertBefore(this.divs[i],null);
				i++;
			 }
			 
			 
			 
			 
			 //label
			 var d = document.createElement("DIV");
			 y = p.y + 2;
			 d.style.position = "absolute";
			 d.style.left =x.toString() + "px";
			 d.style.top = y.toString()+ "px";
			 d.style.color = this.color;
			 d.style.fontFamily='Arial';
			 d.style.fontSize='x-small';
			 
			 if (b==0)
	         {
	         	d.innerHTML = (Math.abs(b)).toFixed(lonDecs);
	         }
			 else if(b<0)
			{	d.title = mbGetMessage("southWgs84");
				d.innerHTML = (Math.abs(b)).toFixed(latDecs)+" S";
			}
			 else 
			{	d.title = mbGetMessage("northWgs84");
				d.innerHTML = (Math.abs(b)).toFixed(latDecs)+" N";
			}
			 if(j != 2)//dont put two labels in the same place
			 {
				 mapDiv.insertBefore(d,null);
				 this.divs[i] = d;
				 i++;
			 }
			 j++;
			 b += dLat;
	  }
	 

	},
	
	/*Transform lat/lon coordinates in pixels coordinates
	* Returns an object container pixel coordinates
	*@param this pointer to this object.
	*@param lat lon  coordiantes in degrees 
	*/
	fromLatLngToDivPixel : function(lat,lon){
	
		
		///CSCS
    		var pt=new PT(lon, lat);
    		cs_transform(new CS(csList.EPSG4326),this.proj,pt);
		
		var platlon=new Object();
		
		platlon.x=this.objRef.targetModel.extent.getPL(new Array(pt.x,pt.y))[0];
		platlon.y=this.objRef.targetModel.extent.getPL(new Array(pt.x,pt.y))[1];
		return platlon;
	},
	
	/*Create a vertical line
	* Returns a div that is a vertical single pixel line
	*@param this pointer to this object.
	*@param x left style property for div element 
	*/
	
	createVLine : function (x) {

		var div = document.createElement("DIV");
		div.style.position = "absolute";
		div.style.overflow = "hidden";
		div.style.backgroundColor = this.color;
		div.style.left = x + "px";
		div.style.top = this.minY + "px";
		div.style.width = "1px";
		div.style.height = (this.maxY-this.minY) +"px";				
	    return div;
	
	},
 
	/*Create a horizontal line
	* Returns a div that is a horizontal single pixel line
	*@param this pointer to this object.
	*@param y top style property for div element 
	*/  	  
	createHLine : function(y) {

		var div = document.createElement("DIV");
		div.style.position = "absolute";
		div.style.overflow = "hidden";
		div.style.backgroundColor = this.color;
		div.style.left = this.minX + "px";
		div.style.top = y + "px";
		div.style.width = (this.maxX-this.minX) + "px";
		div.style.height = "1px";
	    return div;
	
	},
	/*Create a horizontal line
	* Returns a div that is a horizontal single pixel line, across the dateline  
	* we find the start and width of a 180 degree line and draw the same amount
	* to its left and right	
	*@param this pointer to this object.
	*@param lat latitude of  div element.
	*/  
		createHLine3 : function(lat) {
		
			var f = this.fromLatLngToDivPixel(this,lat,0);
			var t = this.fromLatLngToDivPixel(this,lat,180);		
		
			var div = document.createElement("DIV");
			div.style.position = "absolute";
			div.style.overflow = "hidden";
			div.style.backgroundColor = this.color;
			
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
			
}  ,

		/*Initialize Graticule's property 
		* 
		*@param this pointer to this object.
		*/ 
		init : function (){
		
		alert(this.map.div.style.width+" "+this.map.div.style.height);
		alert(this.map.div.width+" "+this.map.div.height);
			this.width=parseInt(this.objRef.targetModel.getWindowWidth());
			this.height=parseInt(this.objRef.targetModel.getWindowHeight());
			
			this.bbox=this.objRef.targetModel.getBoundingBox();
			this.proj=new Proj( this.objRef.targetModel.getSRS());
		
			if (this.bbox[1]<0)
				if(this.bbox[3]<0)
					this.diffLat=this.bbox[1]-this.bbox[3];
				else
					this.diffLat=this.bbox[3]-this.bbox[1];
			else
				this.diffLat=this.bbox[3]+this.bbox[1];
				
			if (this.bbox[0]<0)
				if(this.bbox[2]<0)		
					this.diffLon=this.bbox[0]-this.bbox[2];
				else
					this.diffLon=this.bbox[2]-this.bbox[0];
			else
				this.diffLon=this.bbox[2]+this.bbox[0];
		
			
		  	this.drawtmp();

},

		/*Display graticule when click on button
		* 
		*@param this pointer to this object.
		*@param selected boolean true if button has been clicked , false if no
		*/ 
		trigger: function() {
		
			if(this.objRef.display==false)
			 { 	
			 	this.objRef.targetModel.addListener("bbox", this.init, this );
			 	this.objRef.display=true;
			 	this.mapContainer = this.map.div;
			 	this.color="black";
				this.init();
			}
			else if (this.objRef.display==true)
			{	this.targetModel.removeListener("bbox", this.init, this );
				this.objRef.display=false;
				this.remove();
			}      
	}
/////////////////////////////////////////////////////////////







   });

    return Control;
  }
}

