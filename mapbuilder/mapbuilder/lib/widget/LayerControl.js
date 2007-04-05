/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to allow control of layer odering, visibility, deletion
 * @constructor
 * @base WidgetBaseXSL
 * @author adair
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function LayerControl(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Override of widget prepaint to set some stylesheet parameters including 
   * featureName (for OWS Context) and hidden attribute.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    if (objRef.model.featureName) {
      objRef.stylesheet.setParameter("featureName", objRef.model.featureName );
      objRef.stylesheet.setParameter("hidden", objRef.model.getHidden(objRef.model.featureName).toString() );
    }
  }

  /**
   * Displays a layer in a preview pane when mouse is over the table row
   * @param layerName  the name of the layer to highlight
   */
  this.highlightLayer = function(layerName) {
    var layerId = this.model.id + "_" + "mainMapWidget" + "_" + layerName;
    var previewImage = document.getElementById("previewImage");
    var layer = document.getElementById(layerId);
    if (previewImage) previewImage.src = layer.firstChild.src;
  }

  /**
   * Listener method to paint this widget
   * @param layerName  the name of the layer to highlight
   */
  this.refresh = function(objRef, layerName) {
    objRef.paint(objRef, objRef.id);
  }
  
  this.foldUnfoldGroup = function(groupName,id) {
    // context config stuff to maintain group folding over refresh
    var xpathExpression = "//wmc:General/wmc:Extension/wmc:GroupList/wmc:Group[@name='" + groupName + "']";
    //var thisGroupsLayerNodes = model.doc.selectNodes(xpathExpression);
    var thisGroupsNode = model.doc.selectSingleNode(xpathExpression);
    var thisGroupsFoldedState = thisGroupsNode.getAttribute('folded');
     e =document.getElementById(id);
    if(thisGroupsFoldedState == "1") {
		thisGroupsNode.setAttribute("folded", "0");
		 e.value="-";
		
	} else {
		thisGroupsNode.setAttribute("folded", "1");
		e.value="+";
	}
	
  }
  
  /**
   * set the opacity style property to a layer 
   * @param mapId  id of the mapPane where is the layer
   * @param transparency   opacity style property value 
   */
   this.setTransparency = function (mapId,transparency){
   			
				  var map = document.getElementById(mapId);
				  var opacitypercent = transparency / 100;
				  map.style.opacity = opacitypercent;
				  var ietr = "alpha(opacity=" + transparency + ")";
				  for(var i=0;i<map.childNodes.length;i++){
							map.childNodes[i].style.filter=ietr;
				  }
  }

  /**
   * not working yet
   * @param layerName  the name of the layer to highlight
   */
  this.showLayerMetadata = function(layerName) {
    var metadataWidget = config.objects.layerMetadata;
    if (metadataWidget) {
      metadataWidget.stylesheet.setParameter("featureName",layerName);
      metadataWidget.node = document.getElementById(metadataWidget.htmlTagId);
      metadataWidget.paint(metadataWidget);
    }
  }
  
  /**
   * Change image source from imageA to imageB
   * @param id  id of image tag where we want to change the source
   * @param imageA   url of imageA
   * @param imageB   url of imageB
   */
  this.ChangeImage= function (id, imageA, imageB) {
     var indexA=document.getElementById(id).src.indexOf(imageA);
     var indexB=document.getElementById(id).src.indexOf(imageB);
     if (document.getElementById(id) != null) {
        if (indexA != -1) { /* HACK for IE. */
            document.getElementById(id).src=document.getElementById(id).src.substring(0,indexA)+imageB;
        } else {
           document.getElementById(id).src=document.getElementById(id).src.substring(0,indexB)+imageA;
        }
     }
     return;
   }

  this.model.addListener("deleteLayer",this.refresh, this);
  this.model.addListener("moveLayerUp",this.refresh, this);
  this.model.addListener("moveLayerDown",this.refresh, this);
  if (this.autoRefresh) this.model.addListener("addLayer",this.refresh, this);
}

