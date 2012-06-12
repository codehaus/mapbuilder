/*
Author:       Mike Adair  mike.adairATccrs.nrcan.gc.ca
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * A controller issuing OGC web service requests.  The request is generated
 * by applying a stylesheet to a Layer/FeatureType/Coverage node from a 
 * capabilities document as a listener function.  The listener event name is 
 * a combination of the service type and the request name (e.g. wfs_GetFeature)
 * and the parameter passed to the listener is the featureName (Layer/FeatureType/Coverage).
 * The response from the request is stored in the targetModel.  If the 
 * targetModel is a template model (attribute template="true") the a new model 
 * is created and appended to the parentModel's <models> list.
 * @constructor
 * @base ToolBase
 * @param toolNode The tools's XML object node from the configuration document.
 * @param model    The model that this tool belongs to
 */
function WebServiceRequest(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));

  //this.debug=true;
  
  //get the request name to add listener to
  this.requestName = this.getProperty("mb:requestName");

  //get the request filter to add to the request
  this.requestFilter = this.getProperty("mb:requestFilter");

  var styleUrl = toolNode.selectSingleNode("mb:stylesheet");
  styleUrl = styleUrl ? getNodeValue(styleUrl) :
          baseDir+"/tool/xsl/"+this.requestName.replace(/:/,"_")+".xsl";
  this.requestStylesheet = new XslProcessor(styleUrl);

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<toolNode.childNodes.length;j++) {
    if (getNodeValue(toolNode.childNodes[j])) {
      var nodeType = toolNode.childNodes[j].nodeName;
      if (nodeType !== "#text" && nodeType !== "#comment") {
        this.requestStylesheet.setParameter(nodeType,getNodeValue(toolNode.childNodes[j]));
      }
    }
  }

  this.model.addListener("init", this.init, this);
  this.model.addListener(this.requestName.replace(/:/,"_"), this.doRequest, this);
}

/**
 * Function which create the HTTP payload for a request
 * @param feature the feature object
 */
WebServiceRequest.prototype.createHttpPayload = function(feature) {
  //confirm inputs
  if (this.debug) mbDebugMessage(this, "source:"+(new XMLSerializer()).serializeToString(feature));
  //if (this.debug) mbDebugMessage(this, "stylesheet:"+(new XMLSerializer()).serializeToString(this.requestStylesheet.xslDom));


  //prepare the stylesheet
  var httpPayload = new Object();
  httpPayload.method = this.targetModel.method;
  this.requestStylesheet.setParameter("httpMethod", httpPayload.method );
  this.requestStylesheet.setParameter("version", this.model.getVersion(feature) );
  if (this.requestFilter) {
    var filter = config.objects[this.requestFilter];
    this.requestStylesheet.setParameter("filter", escape((new XMLSerializer()).serializeToString(filter.doc).replace(/[\n\f\r\t]/g,'') ));
    if (this.debug) mbDebugMessage(this, (new XMLSerializer()).serializeToString(filter.doc));
  }

  //process the doc with the stylesheet
  httpPayload.postData = this.requestStylesheet.transformNodeToObject(feature);
  if (this.debug) {
    mbDebugMessage(this, "request data:"+(new XMLSerializer()).serializeToString(httpPayload.postData));
    if (config.serializeUrl) var response = postLoad(config.serializeUrl, httpPayload.postData);
  }

  httpPayload.url = this.model.getServerUrl(this.requestName, httpPayload.method, feature);

  //extract the URL from the transformation result for GET method
  if (httpPayload.method.toLowerCase() == "get") {
    if (typeof(httpPayload.postData.setProperty) == "function") {
      httpPayload.postData.setProperty("SelectionLanguage", "XPath");
    }
    Sarissa.setXpathNamespaces(httpPayload.postData, "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'");
    var queryString = httpPayload.postData.selectSingleNode("//mb:QueryString");
    if (httpPayload.url.indexOf("?") < 0) {
      httpPayload.url += "?";
    } else {
      httpPayload.url += "&";
    }
    httpPayload.url += getNodeValue(queryString);
    httpPayload.postData = null;
  }
  mbDebugMessage(this, "URL:"+httpPayload.url);
  return httpPayload;
}


/**
 * Listener function which will actually issue the request.  This method
 * will prepare the HTTP payload for a particular featureName.
 * @param requestName the name of the web service operation to execute
 * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
 */
WebServiceRequest.prototype.doRequest = function(objRef, featureName) {
  objRef.targetModel.featureName = featureName;

  var feature = objRef.model.getFeatureNode(featureName);
  if (!feature) {
    alert(mbGetMessage("featureNotFoundWebServiceRequest", featureName));
    return;
  }
  if (objRef.model.setRequestParameters) objRef.model.setRequestParameters(featureName, objRef.requestStylesheet);
  var httpPayload = objRef.createHttpPayload(feature);
  objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
}

WebServiceRequest.prototype.setAoiParameters = function(objRef) {
  //TBD: this depends on the targetModel having a containerModel to extract the AOI from.
  //we probably need a config property to point to the AOI model to handle this properly.
  if (objRef.containerModel) {
    var featureSRS = null;
    var containerSRS = "EPSG:4326";
    var bbox = objRef.containerModel.getBoundingBox();
/*
TBD: figure out when to use AOI or BBOX
    var aoi = objRef.containerModel.getParam("aoi");
    if (aoi) {
      bbox[0] = aoi[0][0];
      bbox[1] = aoi[1][1];
      bbox[2] = aoi[1][0];
      bbox[3] = aoi[0][1];
    }
*/
    var containerSRS = objRef.containerModel.getSRS();
/*
    //convert the BBOX to the feature SRS for the request
    if (featureSRS) {
      var sourceProj = new Proj4js.Proj(getNodeValue(featureSRS));
      if ( !sourceProj.matchSrs( containerSRS )) {  
        var containerProj = new Proj4js.Proj(objRef.containerModel.getSRS());
        var llTemp = containerProj.Inverse(new Array(bbox[0],bbox[1]));
        var xy = sourceProj.Forward(llTemp);
        bbox[0] = xy[0]; bbox[1] = xy[1];
        llTemp = containerProj.Inverse(new Array(bbox[2],bbox[3]));
        xy = sourceProj.Forward(llTemp);
        bbox[2] = xy[0]; bbox[3] = xy[1];
      }
    }
*/
    objRef.requestStylesheet.setParameter("bBoxMinX", bbox[0]);
    objRef.requestStylesheet.setParameter("bBoxMinY", bbox[1]);
    objRef.requestStylesheet.setParameter("bBoxMaxX", bbox[2]);
    objRef.requestStylesheet.setParameter("bBoxMaxY", bbox[3]);
    objRef.requestStylesheet.setParameter("srs", containerSRS );
    objRef.requestStylesheet.setParameter("width", objRef.containerModel.getWindowWidth() );
    objRef.requestStylesheet.setParameter("height", objRef.containerModel.getWindowHeight() );
  }
}

WebServiceRequest.prototype.init = function(objRef) {
  if (objRef.targetModel.containerModel) {
    objRef.containerModel = objRef.targetModel.containerModel;
  } else if (objRef.model.containerModel) {
    objRef.containerModel = objRef.model.containerModel;
  }
  if (objRef.containerModel) {
    objRef.containerModel.addListener("aoi", objRef.setAoiParameters, objRef);
    objRef.containerModel.addListener("bbox", objRef.setAoiParameters, objRef);
    objRef.containerModel.addListener("selectedLayer", objRef.selectFeature, objRef);
    objRef.containerModel.addListener("loadModel", objRef.mapInit, objRef);
    objRef.containerModel.addListener("newModel", objRef.clear, objRef);
  }
}

/**
 * set map events needed for this tool
 * @param objRef reference to this tool
 */
WebServiceRequest.prototype.mapInit = function(objRef) {
  // register OpenLayers event to do updates onmouseup
  objRef.containerModel.map.events.registerPriority('mouseup', objRef, objRef.setClickPosition);  
}

/**
 * remove map events for this tool
 * @param objRef reference to this tool
 */
WebServiceRequest.prototype.clear = function(objRef) {
  if (objRef.containerModel.map && objRef.containerModel.map.events) {
    objRef.containerModel.map.events.unregister('mouseup', objRef, objRef.setClickPosition);  
  }
}

/**
 * Listener function that will clear the templates and set the mouse
 * positions when the user clicks on the map.
 * @param e OpenLayers event
 */
WebServiceRequest.prototype.setClickPosition = function(e) {
  this.targetModel.deleteTemplates();
  this.requestStylesheet.setParameter("xCoord", e.xy.x);
  this.requestStylesheet.setParameter("yCoord", e.xy.y);
}

/**
 * Listener function which will actually issue the request.  This method
 * will prepare the HTTP payload for a particular featureName.
 * @param requestName the name of the web service operation to execute
 * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
 */
WebServiceRequest.prototype.selectFeature = function(objRef, featureName) {
  objRef.requestStylesheet.setParameter("queryLayer", featureName);
}

