/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * This widget can be used to insert a message while the Mapbuilder
 * javascript is loading.  The message is removed once Mapbuilder
 * javascript is loaded.  In the main HTML file, insert something like:<br/>
 * &lt;div id="loading"&gt;&lt;p&gt;Loading Program&lt;/p&gt;&lt;/div&gt;.
 * @constructor
 * @base WidgetBase
 * @author Cameron Shorter
 * @param widgetNode The widget's XML object node from the configuration document.
 * @param model The model object that this widget belongs to.
 */
function Loading2(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));

  //loading img to be displayed  while models load
  var imageSrc = widgetNode.selectSingleNode("mb:imageSrc");
  if (imageSrc) {
    this.imageSrc = config.skinDir + imageSrc.firstChild.nodeValue;
  } else {
    this.imageSrc = config.skinDir + "/images/Loading.gif";
  }

  //a text message to be displayed while models load
  var textMessage = widgetNode.selectSingleNode("mb:textMessage");
  if (textMessage) {
    this.textMessage = textMessage.firstChild.nodeValue;
  } else {
    this.textMessage = "Document loading, please wait...";
  }

  //paint it on the "newModel" event, clear it on "loadModel" event
  this.model.addListener("newModel",this.paint, this);
  this.model.addListener("loadModel",this.clear, this);
}

/**
 * Render the widget.
 * @param objRef Pointer to widget object.
 */
Loading2.prototype.paint = function(objRef) {
  if (objRef.node) {
    //create the output node the first time this is called
    var outputNode = document.getElementById( objRef.outputNodeId+"_loading" );
    if (!outputNode) {
      outputNode = document.createElement("div");
      outputNode.setAttribute("id",objRef.outputNodeId+"_loading");
      if (objRef.imageSrc) {
        var loadingImg = document.createElement("img");
        loadingImg.src = objRef.imageSrc;
        outputNode.appendChild(loadingImg);
      }
      if (objRef.textMessage) {
        var loadingMsg = document.createElement("p");
        loadingMsg.innerHTML = objRef.textMessage;
        outputNode.appendChild(loadingMsg);
      }
      objRef.node.appendChild(outputNode);
    }
  }
}

/**
 * Remove the contents of the HTML tag for this widget.
 * @param objRef Reference to this object.
 */
Loading2.prototype.clear= function(objRef) {
  var outputNode = document.getElementById( objRef.outputNodeId+"_loading" );
  if (outputNode) objRef.node.removeChild(outputNode);
}

