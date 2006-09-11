/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
Author:  Pat Cappelaere patATcappelaere.com

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
  * Button widget to be installed in the menubar
  * It calls a user defined javascript function when a user clicks on the map
  * An icon appears for a few seconds to give visual feedback
  * 
  * Here is an example of the configuration file entry:
  *
     <ClickPass id="clickPass">
      <buttonBar>mainButtonBar</buttonBar>
      <targetModel>mainMap</targetModel>
      <mouseHandler>mainAoi</mouseHandler>
      <class>RadioButton</class>
      <enabledSrc>/images/HelpEnable.png</enabledSrc>
      <disabledSrc>/images/HelpDisable.png</disabledSrc>
      <ClickPassId>1</ClickPassId>
      <icon>../../lib/skin/default/images/dot.gif</icon>
      <topOffset>11</topOffset>
      <leftOffset>-7</leftOffset>
    </ClickPass>
  */
function ClickPass(widgetNode, model) {
  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));
  
  var clickPassId = widgetNode.selectSingleNode("mb:ClickPassId");
  if( clickPassId != null ) {
    this.clickPassId = clickPassId.firstChild.nodeValue;
  } else {
    alert( "unspecified clickPassId" );
  }
  
  // get icon from the config file and create the dynamic div
  var icon = widgetNode.selectSingleNode("mb:icon");
  if( icon != null ) {
    this.icon = icon.firstChild.nodeValue;
    
    var iconDiv = document.createElement("div");
    iconDiv.setAttribute("id","clickPass"+this.clickPassId);
    iconDiv.style.position = "relative";
    iconDiv.style.visibility = "hidden";
    iconDiv.style.height = "20px";
    iconDiv.style.width = "20px";
    iconDiv.style.top = "120px";
    iconDiv.style.left = "120px";
  
    iconDiv.style.zIndex = 300;
    iconDiv.title = "clickPass"+this.clickPassId;
  
    var newImage = document.createElement("img");
    newImage.src = this.icon;
 
    this.iconDiv = iconDiv;
    iconDiv.appendChild(newImage);
    
    var mainMapPane = document.getElementById("mainMapPane");
    mainMapPane.appendChild( iconDiv );
    
  } else {
    alert( "unspecified icon" );
  }
 
  // unfortunately, exact positioning of an image is hard
  // depending on icon, you may have to specify some offsets
  var topOffset = widgetNode.selectSingleNode("mb:topOffset");
  if( topOffset != null ) {
    this.topOffset = parseInt(topOffset.firstChild.nodeValue);
  } else {
    alert( "unspecified topOffset" );
  }
  
  var leftOffset = widgetNode.selectSingleNode("mb:leftOffset");
  if( leftOffset != null ) {
    this.leftOffset = parseInt(leftOffset.firstChild.nodeValue);
  } else {
    alert( "unspecified topOffset" );
  } 
  
  /**
    * User click action in the map
    */
  this.doAction = function(objRef,targetNode) {
	  if (objRef.enabled) {
	      point=objRef.mouseHandler.model.extent.getXY(targetNode.evpl);
        var x = point[0];
        var y = point[1];
        
        objRef.iconDiv.style.top = targetNode.evpl[1] + objRef.topOffset + "px";
        objRef.iconDiv.style.left = targetNode.evpl[0] + objRef.leftOffset + "px";
        objRef.iconDiv.style.visibility = "visible";

        //alert( "Action:"+objRef.clickPassId + " " + x + " " + y );
        clickIt( x, y )
        
        // hide icon in 5 seconds
        if( document.all ) { // ie guy
          window.setTimeout( "hideClickPass(" +objRef.clickPassId+" )", 5000);
        } else { 
          setTimeout( "hideClickPass(" +objRef.clickPassId+" )", 5000);
        }
	  }
  }
  
  
  this.hideClickPass = function() {
    var div = document.getElementById( "clickPass"+this.clickPassId );
    if( div != null ) {
      //alert( "hide icon" );
      div.style.visibility = "hidden";
    } else {
      alert( "div clickPass"+this.clickPassId+" not found" );
    }
  }
  
   /**
   * Register for mouseUp events.
   * @param objRef  Pointer to this object.
   */
  this.setMouseListener = function(objRef) {
    if (objRef.mouseHandler) {
      objRef.mouseHandler.model.addListener('mouseup',objRef.doAction,objRef);
    }
  }
  this.model.addListener( "loadModel", this.setMouseListener, this );
}

// For IE Only
function hideClickPass( id ) {
  var div = document.getElementById( "clickPass"+id );
  if( div != null ) {
      //alert( "hide icon" );
    div.style.visibility = "hidden";
  } else {
    alert( "div clickPass"+id+" not found" );
  }
}
 