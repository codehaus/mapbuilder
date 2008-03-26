/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id: LayerControl.js 3607 2007-11-16 05:06:51Z rdewit $
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
   * @param layerId  the name of the layer to highlight
   */
  this.highlightLayer = function(layerId) {
    var layer = this.model.map.mbMapPane.oLlayers[layerId].div;
    var previewImage = document.getElementById("previewImage");
    try {
      if (previewImage && layer) previewImage.src = layer.firstChild.firstChild.src;
    } catch(e) {}
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
    var e =document.getElementById(id);
    if(thisGroupsFoldedState == "1") {
		thisGroupsNode.setAttribute("folded", "0");
		e.value="-";
		
	} else {
		thisGroupsNode.setAttribute("folded", "1");
		e.value="+";
	}
	
  }

  /**
   * not working yet
   * @param layerId  the name of the layer to highlight
   */
  this.showLayerMetadata = function(layerId) {
    var metadataWidget = config.objects.layerMetadata;
    if (metadataWidget) {
      metadataWidget.stylesheet.setParameter("featureName",layerId);
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

/**
   * Display or fold  the layer's legend
   * @param id  id of legend div
   */
	this.switchVisibilityById = function (id) {
	e =document.getElementById(id);
	
		if (e.style.display=="none") {
			e.style.display = "block";
		} else {
			e.style.display = "none";
		}
		
	
     }
  this.model.addListener("deleteLayer",this.refresh, this);
  this.model.addListener("moveLayerUp",this.refresh, this);
  this.model.addListener("moveLayerDown",this.refresh, this);
  if (this.autoRefresh) this.model.addListener("addLayer",this.refresh, this);
}

