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
    alert(mbGetMessage("referenceNodeIdNotFound", this.referenceNodeId));
  }
  
  this.fireResize = function() {
    config.objects[window.resizeToolId].model.setParam("autoResize");
  }
  window.onresize = this.fireResize;
  window.resizeToolId = this.id;    //event handler is called in the context of the window object, store a pointer to this object
                                    //note: this will break if there is more than one auto-resize tools in a config

  /*
   * this function will adjust the bbox so that
   * 1) it has the same aspect ratio as the pixel width/heigth
   * 2) the resulting bbox contains the original bbox (so it will only
   *    enlarge the original bbox, never shrink it)
   * maybe we should make the behaviour of 2) configurable? Like 3 options:
   * 1: enlarge, 2: shrink, 3: average?
   *
   * author: schut@sarvision.nl
  */
  this.enlargeBboxIfNecessary = function() {
    var bbox = this.model.getBoundingBox();
    var worldWidth = bbox[2] - bbox[0];
    var worldHeight = bbox[3] - bbox[1];
    var xRes = worldWidth / this.model.getWindowWidth();
    var yRes = worldHeight / this.model.getWindowHeight();
    if (xRes != yRes) {
      if (xRes > yRes) {
        // need to enlarge y extent
        var newWorldHeight = worldHeight * (xRes / yRes);
        bbox[3] = bbox[3] + 0.5 * (newWorldHeight - worldHeight);
        bbox[1] = bbox[1] - 0.5 * (newWorldHeight - worldHeight);
      } else if (yRes > xRes) {
        // need to enlarge x extent
        var newWorldWidth = worldWidth * (yRes / xRes);
        bbox[0] = bbox[0] - 0.5 * (newWorldWidth - worldWidth);
        bbox[2] = bbox[2] + 0.5 * (newWorldWidth - worldWidth);
      }
      this.model.setBoundingBox( bbox );
    }
  } 
  
	this.resizeHandler = function(objRef) {
    objRef.enlargeBboxIfNecessary();
    // get padding of referenceNode
    var paddingTop = parseInt(getStyle(referenceNode, "padding-top"));
    var paddingBottom = parseInt(getStyle(referenceNode, "padding-bottom"));
    var paddingLeft = parseInt(getStyle(referenceNode, "padding-left"));
    var paddingRight = parseInt(getStyle(referenceNode, "padding-right"));

    newWidth = referenceNode.offsetWidth - (paddingLeft + paddingRight);
    newHeight = referenceNode.offsetHeight - (paddingTop + paddingBottom);
    objRef.model.setWindowSize(new Array(newWidth, newHeight));
	}

  // add autoResize event listener:
  this.model.addFirstListener("autoResize", this.resizeHandler, this);
  // add loadModel event listener to take care of resizing at initial page load
  this.model.addFirstListener("loadModel", this.resizeHandler, this);
  
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
