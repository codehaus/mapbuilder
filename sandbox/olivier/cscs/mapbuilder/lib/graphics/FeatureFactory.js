/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: FeatureFactory.js 2546 2007-01-23 12:07:39Z gjvoosten $
*/
mapbuilder.loadScript(baseDir+"/widget/Popup.js");
mapbuilder.loadScript(baseDir+"/graphics/FeaturePointFactory.js");
mapbuilder.loadScript(baseDir+"/graphics/FeatureLineFactory.js");
mapbuilder.loadScript(baseDir+"/graphics/FeatureTrackFactory.js");

/**
  * Feature Facctoty constructor
  * @param widgetNode  The widget's XML object node from the configuration document.
  * @param model       The model object that this widget belongs to.
  */
function FeatureFactory(widgetNode, model, tipObjectName) {
 
  // init the derived factories
  this.featurePointFactory = new FeaturePointFactory( widgetNode, model, tipObjectName );
  this.featureLineFactory = new FeatureLineFactory( widgetNode, model, tipObjectName );
  this.featureTrackFactory = new FeatureTrackFactory( widgetNode, model, tipObjectName );
}

/**
  * clear all created features
  */
FeatureFactory.prototype.clearFeatures = function( objRef ) {
  // that's all we have  implemented so far
  this.featurePointFactory.clearFeatures( objRef );
  this.featureLineFactory.clearFeatures( objRef );
  this.featureTrackFactory.clearFeatures( objRef );
}

/**
  * Feature Factory that will create a feature of proper type
  * @param objRef a pointer to this widget object
  * @param type Feature type to render: POINT, LINE, CURVE, POLY
  * @param geometry array of necessary coordinates for that type of geometry
  * @param itemId feature Id
  * @param title title of feature
  * @param papupStr popup to display on mouseover
  */
FeatureFactory.prototype.createFeature = function( objRef, type, geometry, itemId, title, popupStr, icon ) {
  if( type == 'POINT' ) {
    this.featurePointFactory.createFeature( objRef, geometry, itemId, title, popupStr, icon );
  } else if( type == 'LINESTRING' ) {
    this.featureLineFactory.createFeature( objRef, geometry, itemId, title, popupStr, icon );
  } else if( type == 'TRACK' ) {
    //this.featureTrackFactory.createFeature( objRef, geometry, itemId, title, popupStr, icon );
  } else if( type == 'CURVE' ) {
    alert(mbGetMessage("notImplementedYet")); 
  } else if( type == 'POLY' ) {
    alert(mbGetMessage("notImplementedYet")); 
  } else if( type == 'TEST' ) {
	  var testDiv = document.createElement("div");
	  testDiv.setAttribute("id", "test");
	  testDiv.style.position = "relative";
	  testDiv.style.height = "0px";
	  testDiv.style.width = "0px";
	  testDiv.style.visibility = "hidden";
	  testDiv.style.zIndex = 301;
	 
	  this.testDiv  = testDiv;
	  objRef.node.appendChild( testDiv );
	  testingCanvas( objRef );
    
  } else {
    alert( 'feature:'+type+' is not supported');
  }
}

function testingCanvas( div ) {
  //var ctx = new VectorGraphics("test", this.testDiv);
  
  //var canvas = document.getElementById("canvas_test");
  
  var canvas = document.createElement('CANVAS');
  canvas.setAttribute("id", "canvas_test2")
  canvas.setAttribute("width", "600px")
  canvas.setAttribute("height", "300px");
  canvas.setAttribute("style", "position: absolute; top: 0pt; left: 0pt; width: 600px; height: 300px");
  
  //map = document.getElementById("mainMapContainer");
  div.node.appendChild(canvas);
  
  //canvas = document.getElementById("canvas_test2");
  
  var context = canvas.getContext('2d');
  
  if( canvas.getContext ) {
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'green';
	ctx.fillRect(5, 5, 25, 25);
	ctx.strokeStyle = 'red';
	ctx.strokeRect(20, 20, 25, 25);
	  
    ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.moveTo(1,1);
	ctx.lineTo(80,80);
	ctx.lineTo(100,20);
	ctx.closePath();
	ctx.stroke();
	  
	ctx.strokeStyle = 'blue';
	ctx.fillStyle = 'black';
	  
	ctx.beginPath();
	ctx.moveTo(120,50);
	ctx.lineTo(150,70);
	ctx.lineTo(150,50);
  } else {
    alert(mbGetMessage("noCanvasContext"));
  }
}
      

