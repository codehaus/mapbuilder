/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");

/**
 * Widget to render a map from an OGC context document.  The layers are rendered
 * as an array of DHTML layers that contain an <IMG> tag with src attribute set 
 * to the GetMap request.
 * @constructor
 * @base WidgetBaseXSL
 * @base MapContainerBase
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function MapPane(widgetNode, model) {
  WidgetBase.apply(this,new Array(widgetNode, model));
  MapContainerBase.apply(this,new Array(widgetNode, model));

  // Set this.stylesheet
  this.stylesheet = new XslProcessor(baseDir+"/widget/"+widgetNode.nodeName+".xsl",model.namespace);

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<widgetNode.childNodes.length;j++) {
    if (widgetNode.childNodes[j].firstChild
      && widgetNode.childNodes[j].firstChild.nodeValue)
    {
      this.stylesheet.setParameter(
        widgetNode.childNodes[j].nodeName,
        widgetNode.childNodes[j].firstChild.nodeValue);
    }
  }

  //all stylesheets will have these properties available
  this.stylesheet.setParameter("modelId", this.model.id );
  this.stylesheet.setParameter("widgetId", this.id );
  this.stylesheet.setParameter("outputNodeId", this.outputNodeId );
  this.stylesheet.setParameter("skinDir", config.skinDir );
  this.stylesheet.setParameter("lang", config.lang );

  /**
   * Called when the context's hidden attribute changes.
   * @param objRef This object.
   * @param layerName  The name of the layer that was toggled.
   */
  this.hiddenListener=function(objRef, layerName){
    var vis="visible";
    if(objRef.model.getHidden(layerName)=="1") {
      vis="hidden";
    }
    var layerId = objRef.model.id + "_" + objRef.id + "_" + layerName;
    var layer = document.getElementById(layerId);
    if (layer) layer.style.visibility=vis;
  }
  this.model.addListener("hidden",this.hiddenListener,this);

  /**
   * Called after a feature has been added to a WFS.  This function triggers
   * the WMS basemaps to be redrawn.  A timestamp param is added to the URL
   * to ensure the basemap image is not cached.
   */
  this.refreshWmsLayers=function(objRef){
    objRef.d=new Date();
    objRef.stylesheet.setParameter("uniqueId",objRef.d.getTime());
    objRef.paint(objRef);
  }
  this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);

  this.model.addListener("refresh",this.paint, this);
}

  /**
   * Render the widget.
   * @param objRef Pointer to widget object.
   */
  MapPane.prototype.paint = function(objRef) {

    if (objRef.model.doc && objRef.node) {
      //if (objRef.debug) alert("source:"+Sarissa.serialize(objRef.model.doc));
      objRef.resultDoc = objRef.model.doc; // resultDoc sometimes modified by prePaint()
      objRef.prePaint(objRef);

      //confirm inputs
      if (objRef.debug) alert("prepaint:"+Sarissa.serialize(objRef.resultDoc));
      if (objRef.debug) alert("stylesheet:"+Sarissa.serialize(objRef.stylesheet.xslDom));

      /* @author Michael Jenik  */

      //process the doc with the stylesheet
      var s = objRef.stylesheet.transformNodeToString(objRef.resultDoc);
      if (config.serializeUrl && objRef.debug) postLoad(config.serializeUrl, s);
      if (objRef.debug) alert("painting:"+objRef.id+":"+s);
      var tempNode = document.createElement("DIV");
      tempNode.innerHTML = s;
      tempNode.firstChild.setAttribute("id", objRef.outputNodeId);
      var outputNode = document.getElementById( objRef.outputNodeId );
      if (!outputNode) {
        objRef.node.appendChild(tempNode.firstChild);
        outputNode = document.getElementById( objRef.outputNodeId );
        outputNode.style.left=0;
        outputNode.style.top=0;
      } else {

        var realimages = outputNode.getElementsByTagName("img");//the old images
        //the following is null if the above append ocurred!!
        var images = tempNode.getElementsByTagName("img"); //the new images
        for (var i=0;i<images.length;i++){
          var real_src = images[i].getAttribute("src");
          // preload image
          realimages[i].new_img = new Image();
          realimages[i].new_img.src=real_src;
          realimages[i].new_img.id=Math.random();
          realimages[i].id = "real"+realimages[i].new_img.id;
          realimages[i].offset = new Array(outputNode.style.left,outputNode.style.top);
	/**
	 *Replaces the source with the new one and fixes the displacement to 
   *compensate the container main div displacemen to result in in a zero displacement.
	 *@author Michael Jenik     
	 */
          realimages[i].new_img.onload = function() {
            var oldImg = document.getElementById("real"+this.id );
            //Note that we are keeping the old div that contains divs that contain images in it position and adjusting the divs that contains images position to compensate the other div position. So this result in the image at position top:0 left: 0 
            oldImg.parentNode.style.left=-1*parseInt(oldImg.offset[0]);
            oldImg.parentNode.style.top=-1*parseInt(oldImg.offset[1]);
            oldImg.src = this.src;
          };
        }
      }

      objRef.postPaint(objRef);
    }
  }

