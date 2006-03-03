/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * This widget is used to display ModelStatus messages.  This widget is used
 * like any other except that it is clreaed on the loadModel event and painted
 * on the "newModel" and "modelStatus" events.
 * Optional config parameters are an image source (usually an animated GIF) in 
 * the imageSource property, an optional static text message to be displayed as 
 * the textMessage property and if the widget is to be displayed over top of a 
 * map you can also specify the mapContainerId property.
 * Dynamic message can be displayed by listening on the "modelStatus" event which
 * sends a message as the parameter.  Send a null message param to clear the widget.
 * @constructor
 * @base WidgetBase
 * @author Mike Adair
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
  this.updateMessage = this.textMessage;

  //check to see if this is to be put over a map if there isa mapContainerID supplied
  var mapContainerNode = widgetNode.selectSingleNode("mb:mapContainerId");
  if (mapContainerNode) {
    this.containerNodeId = mapContainerNode.firstChild.nodeValue;
    this.node = document.getElementById(this.containerNodeId);
  }

  //paint it on the "newModel" event, clear it on "loadModel" event
  this.model.addListener("newModel",this.paint, this);
  this.model.addListener("contextLoaded",this.clear, this);
  this.model.addListener("bbox", this.paint, this );
  this.model.addListener("refresh",this.paint, this);
  this.model.addListener("modelStatus",this.update, this);
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
      objRef.node.appendChild(outputNode);
    }
    outputNode.className = "loadingIndicator";
    outputNode.style.zindex = 1000;
    outputNode.style.position="relative";
    if (objRef.imageSrc) {
      var imageNode = document.getElementById( objRef.outputNodeId+"_imageNode" );
      if (!imageNode) {
        imageNode = document.createElement("img");
        imageNode.setAttribute("id",objRef.outputNodeId+"_imageNode");
        outputNode.appendChild(imageNode);
        imageNode.style.zindex = 1000;
      }
      imageNode.src = objRef.imageSrc;
    }
    if (objRef.updateMessage) {
      var messageNode = document.getElementById( objRef.outputNodeId+"_messageNode" );
      if (!messageNode) {
        messageNode = document.createElement("p");
        messageNode.setAttribute("id",objRef.outputNodeId+"_messageNode");
        outputNode.appendChild(messageNode);
      }
      messageNode.innerHTML = objRef.updateMessage;
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

/**
 * Updates the loading indicator with a new message as a "updateStatus" listener.
 * Send an null message to clear the loading indicator.
 * @param objRef Reference to this object.
 */
Loading2.prototype.update= function(objRef, message) {
  if (message) {
    objRef.updateMessage = message;
    objRef.paint(objRef);
  } else {
    objRef.clear(objRef);
  }
}

