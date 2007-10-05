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
   * Adds a widget to the list of tabs (TBD: not yet working/tested)
   * @param widget the widget to be added to the list of tabs
   * @param order  the order within the tabs
   */
  this.addWidget = function(tabWidget,tabLabel) {
    this.tabList.push(tabWidget);

    if (!tabLabel) tabLabel = tabWidget.id;
    var textNode = config.widgetText.selectSingleNode(this.textNodeXpath+"/mb:"+tabWidget.id);
    if (textNode) tabLabel = textNode.firstChild.nodeValue;

    var tabNode = this.model.doc.createElementNS(mbNS,"tab");
    tabNode.appendChild(this.model.doc.createTextNode(tabWidget.id));
    tabNode.setAttribute("label",tabLabel);
    this.widgetNode.appendChild(tabNode);

    this.paint(this);
    this.selectTab(tabWidget);
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
    //config.objects.layerLoading.paint(config.objects.layerLoading); // to activate the loading bar
    //console.debug(objRef);
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
   * Fetches the full request string for a (WFS) layer
   * @param layerName The name of the layer selected.
   * @return string|boolean
   */
  this.getLayerFullRequestString = function(layerName) {
      var fullRequestString;

      // Quick hack to get the full Request string for a layer
      // TBD: don't access mainMapWidget and mainMap directly
      fullRequestString  = config.objects.mainMapWidget.oLlayers[layerName].getFullRequestString();
      fullRequestString += "&BBOX=" + config.objects.mainMap.getBoundingBox();

      return fullRequestString;
  }

  /**
   * Fetches the layerNode from the model
   * @param layerName The name of the layer selected.
   * @return domElement
   */
  this.getLayerNode = function(layerName) {
    return this.model.doc.selectSingleNode("(//wmc:Layer|//wmc:FeatureType)[wmc:Name ='"+layerName+"']");
  }

  /**
   * Show the layer's metadata.
   * @param layerName The name of the layer selected.
   * @param metadataDomElementId Dom element where metadata should be stored
   */
  this.showLayerMetadata = function(layerName, metadataDomElementId) {

    // Fetch layer node from model
    var layerNode=this.getLayerNode(layerName);

    // Exit if metadata widget could not be found (failsafe) 
    var metadataWidget = config.objects.layerMetadata;
    if (!metadataWidget) {
      return false;
    }

    // Find DOM element for metadata
    var metadataDomElement = document.getElementById(metadataDomElementId); 

    // Call the metadata widget with the layer node and the metadata Dom Element
    metadataWidget.paint(layerNode, metadataDomElement);

    // Loading Spinner. TBD: doesn't work yet
    //var loadingWidget = config.objects.layerLoading;
    //loadingWidget.paint(loadingWidget);
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

