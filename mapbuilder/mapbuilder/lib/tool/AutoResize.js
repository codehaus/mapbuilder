/*
Author:       Vincent Schut schut@sarvision.nl
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: AutoResize.js 2006-11-16
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Tool which implements autoresize behaviour for the map.
 * the tool listens to a special 'autoResize' event. When triggered
 * it will resize the map to the exact size of a specified html node
 * which can be configured in config.xml, typically a parent div container
 * or table cell containing the main map pane.
 * Currently it does *not* subtract any padding, border or margin that
 * might be declared on the contained map pane, so if you want your map
 * to exactly fit in the referenced container node, set these style
 * items to 0px.
 
 * @constructor
 * @base ToolBase
 * @param toolNode The node for this tool from the configuration document.
 * @param model  The model object that contains this tool
 */

function AutoResize(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));

  // get htmlElement from which we should get the size
	var referenceNodeId = toolNode.selectSingleNode("mb:referenceNodeId");
  if (referenceNodeId) {
    this.referenceNodeId = referenceNodeId.firstChild.nodeValue;
    var referenceNode = document.getElementById(this.referenceNodeId);
  } else {
    var referenceNode = document.getElementById('autoResize');
  }
  if (referenceNode == null) {
    alert("AutoResize tool cannot find the reference node '" + this.referenceNodeId + "' in the DOM.\nPlease specify a valid referenceNodeId in the config file\nor use an id 'autoResize' for one of your documents nodes.");
  }
  

  
	this.resizeHandler = function(objRef) {
    // get padding of referenceNode
    var paddingTop = parseInt(getStyle(referenceNode, "padding-top"));
    var paddingBottom = parseInt(getStyle(referenceNode, "padding-bottom"));
    var paddingLeft = parseInt(getStyle(referenceNode, "padding-left"));
    var paddingRight = parseInt(getStyle(referenceNode, "padding-right"));

    newWidth = referenceNode.offsetWidth - (paddingLeft + paddingRight);
    newHeight = referenceNode.offsetHeight - (paddingTop + paddingBottom);
    model.extent.setWindowSize(new Array(newWidth, newHeight));
    objRef.targetModel.callListeners("refresh");
    objRef.targetModel.callListeners("bbox");
	}

  // add autoResize event listener:
  this.model.addListener("autoResize", this.resizeHandler, this);
  // add loadModel event listener to take care of resizing at initial page load
  this.model.addListener("loadModel", this.resizeHandler, this);
  
  /* function to get css properties for an element, works also with styles from separate css files
   * from: http://www.robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element/
   * should probably go into util.js?
   */
  function getStyle(oElm, strCssRule) {
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle) {
      strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle) {
      strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
        return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  }

}
