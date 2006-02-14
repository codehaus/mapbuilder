/*
Author:       Patrice G Cappelaere patATcappelaere.com
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
// http://www.macridesweb.com/oltest/
// References: http://overlib.boughner.us/


mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
  
var toolTipObject;
var toolTipObjs = new Array();
 
/**
 * Popup uses OverLib
 * @constructor
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function TipWidget( widgetNode, model) {

  // get parameters from configuration file
  // get widget id
  this.tipIdName = widgetNode.attributes.getNamedItem("id").nodeValue;
  
  // get configuration options   
  var leftOffset = widgetNode.selectSingleNode("mb:leftOffset");
  if( leftOffset != undefined ) {
    this.leftOffset = parseInt(leftOffset.firstChild.nodeValue);
  }
  
  var topOffset = widgetNode.selectSingleNode("mb:topOffset");
  if( topOffset != undefined ) {
    this.topOffset = parseInt(topOffset.firstChild.nodeValue);
  }
  
  var overLibCmd = widgetNode.selectSingleNode("mb:command");
  if( overLibCmd != undefined ) {
    this.overLibCmd = overLibCmd.firstChild.nodeValue;
  }
  
  /**
    * Create the div for the tip 
    */
    
  this.createDiv = function() {
    // we look for an overDiv just in case.
    // If we do no find one, we look for a div with the same name as specified in the widget config 
    
    var divName = "overDiv"; 
    
    var tipDiv = document.getElementById( divName );
    if( tipDiv == undefined ) {
	  var userDiv = document.getElementById(this.tipIdName);
	  if( userDiv != undefined ) { 
	    tipDiv = document.createElement("div");
	    tipDiv.setAttribute("id", divName);
      
        // this does not work with IE
	    //tipDiv.setAttribute("style", "position: absolute; z-index: 10000; visibility: hidden; left: 0px; top: 0px; width: 10px");
        tipDiv.setAttribute("style", "");
	    tipDiv.style.position = "absolute";
        tipDiv.style.zIndex = "10000";
        tipDiv.style.visibility = "hidden";
        tipDiv.style.left = "0px";
        tipDiv.style.top = "0px";
        tipDiv.style.width = "10px";
        
	    //userDiv.appendChild( tipDiv );
        var parentNode = userDiv.parentNode;
        parentNode.removeChild( userDiv );
        parentNode.appendChild( tipDiv );
        this.tipDiv = tipDiv;
        //alert( "Created div:"+divName );
      } else {
        alert("Could not find div:"+this.tipIdName );
      }
    } else {
      alert("div:"+divName+" already exists" );
    }
  }
  
  /**
    * paints popup on the screen
    * @param arr Array of tips
    */
  this.paint = function( arr ) {

    // For some reason, absolute positionning over the map does not work right
    // So I use an arbitrary negative offset set in config file    
    var x = parseInt(arr[0]);
    if( x > this.leftOffset )
      x += this.leftOffset;
      
    var y = parseInt(arr[1]);
    if( y > this.topOffset )
      y += this.topOffset;
    
    var width = arr[2];
    var title = arr[3];
    var contents = this.dehtmlize( arr[4] );
    //alert( contents );
    var text  = title + "<br/>"+ contents;
    
    //overlib(text, STICKY, BUBBLE, BUBBLETYPE,'square', RELX, x, RELY, y);
    eval( this.overLibCmd );
  }
  
  this.dehtmlize = function(str) {
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&quot;/g, "'");
    return str;
  }
  /**
    * clear popup from the scree
    */
  this.clear = function() {
    // Not used for STICKY 
    nd();
  }
  
 
  this.createDiv();
  
  // This is used to eventually support many tooltips with different configuration
  toolTipObjs[ this.tipIdName ] = this;
   
}