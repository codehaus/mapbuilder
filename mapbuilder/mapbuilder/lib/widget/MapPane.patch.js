/*
Author:       Cameron Shorter cameronAtshorter.net
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
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
  // Defaults to "widget/<widgetName>.xsl" if not defined in config file.
  if ( !this.stylesheet ) {
    var styleNode = widgetNode.selectSingleNode("mb:stylesheet");
    if (styleNode ) {
      this.stylesheet = new XslProcessor(styleNode.firstChild.nodeValue,model.namespace);
    } else {
      this.stylesheet = new XslProcessor(baseDir+"/widget/"+widgetNode.nodeName+".xsl",model.namespace);
    }
  }

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
  this.stylesheet.setParameter("modelTitle", this.model.title );
  this.stylesheet.setParameter("widgetId", this.id );
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
  MapPane.prototype.paint = function(objRef, refresh) {

    if (objRef.model.doc && objRef.node && (objRef.autoRefresh||refresh) ) {
      //if (objRef.debug) alert("source:"+Sarissa.serialize(objRef.model.doc));
      objRef.resultDoc = objRef.model.doc; // resultDoc sometimes modified by prePaint()
      objRef.prePaint(objRef);

      //confirm inputs
      if (objRef.debug) alert("prepaint:"+Sarissa.serialize(objRef.resultDoc));
      if (objRef.debug) alert("stylesheet:"+Sarissa.serialize(objRef.stylesheet.xslDom));

      /* @author Michael Jenik  */

      //process the doc with the stylesheet
      var s = objRef.stylesheet.transformNodeToString(objRef.resultDoc);
      var tempNode = document.createElement("DIV");
      tempNode.innerHTML = s;

      if (objRef.debug) alert("result:"+s);
      if (config.serializeUrl && objRef.debug) postLoad(config.serializeUrl, s);
      if (objRef.debug) alert("painting:"+objRef.id+":"+s);

      var outputNode = document.getElementById( objRef.outputNodeId );
      if (!outputNode) {
        outputNode = document.createElement("DIV");
        outputNode.setAttribute("id", objRef.outputNodeId);
        outputNode.style.left=0;
        outputNode.style.top=0;
        outputNode.style.position = "absolute"; 
        objRef.node.appendChild(outputNode);
      } 

      var layers = objRef.model.getAllLayers();
      for (var i=0;i<layers.length;i++){
        var layerName = layers[i].selectSingleNode("wmc:Name").firstChild.nodeValue;  
        var layerHidden = layers[i].getAttribute("hidden");  
        var imgDivId = objRef.model.id +"_"+ objRef.id +"_"+ layerName; //TBD: add in timestamps
        var imgDiv = document.getElementById(imgDivId);
        if (!imgDiv) {
          imgDiv = document.createElement("DIV");
          imgDiv.setAttribute("id", imgDivId);
          imgDiv.style.position = "absolute"; 
          imgDiv.style.visibility = (layerHidden==1)?"hidden":"visible";
          imgDiv.style.top = 0; 
          imgDiv.style.left = 0;
          imgDiv.imgId = Math.random().toString(); 
          var domImg = document.createElement("IMG");
          domImg.id = "real"+imgDiv.imgId;
          domImg.src = "../../lib/skin/default/images/Loading.gif";
          domImg.offset = new Array(outputNode.style.left,outputNode.style.top);
          imgDiv.appendChild(domImg);
          outputNode.appendChild(imgDiv);
        }

        // preload image
        var newDiv = tempNode.firstChild.childNodes[i]; //getElementById(imgDivId);
        var newSrc = newDiv.firstChild.getAttribute("src");
        newDiv.new_img = new Image();
        newDiv.new_img.src = newSrc;
        newDiv.new_img.id = imgDiv.imgId;

/**
 *Replaces the source with the new one and fixes the displacement to 
 *compensate the container main div displacemen to result in in a zero displacement.
 *@author Michael Jenik     
 */
        newDiv.new_img.onload = function() {
          var oldImg = document.getElementById("real"+this.id );
          //Note that we are keeping the old div that contains divs that contain images in it position and adjusting the divs that contains images position to compensate the other div position. So this result in the image at position top:0 left: 0 
          oldImg.parentNode.style.left=-1*parseInt(oldImg.offset[0]);
          oldImg.parentNode.style.top=-1*parseInt(oldImg.offset[1]);
          oldImg.src = this.src;
          oldImg.parentNode.parentNode.style.left=0;
          oldImg.parentNode.parentNode.style.top=0;
        };
      }

      objRef.postPaint(objRef);
    }
  }

