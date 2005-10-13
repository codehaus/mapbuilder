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
  
  //get the request name to add listener to
  var requestName = toolNode.selectSingleNode("mb:requestName");
  if (requestName) {
    this.requestName = requestName.firstChild.nodeValue;
  }

  //get the request filter to add to the request
  var requestFilter = toolNode.selectSingleNode("mb:requestFilter");
  if (requestFilter) {
    this.requestFilter = requestFilter.firstChild.nodeValue;
  }

  var styleUrl = baseDir+"/tool/xsl/"+this.requestName.replace(/:/,"_")+".xsl";
  this.requestStylesheet = new XslProcessor(styleUrl);

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<toolNode.childNodes.length;j++) {
    if (toolNode.childNodes[j].firstChild && toolNode.childNodes[j].firstChild.nodeValue) {
      this.requestStylesheet.setParameter(toolNode.childNodes[j].nodeName,toolNode.childNodes[j].firstChild.nodeValue);
    }
  }

  /**
   * Function which create the HTTP payload for a request
   * @param requestName the name of the web service operation to execute
   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
   */
  this.createHttpPayload = function(feature) {
    //confirm inputs
    if (this.debug) alert("source:"+Sarissa.serialize(feature));
    //if (this.debug) alert("stylesheet:"+Sarissa.serialize(this.requestStylesheet.xslDom));


    //prepare the stylesheet
    var httpPayload = new Object();
    httpPayload.method = this.targetModel.method;
    this.requestStylesheet.setParameter("httpMethod", httpPayload.method );
    this.requestStylesheet.setParameter("version", this.model.getVersion(feature) );
    if (this.requestFilter) {
      var filter = config.objects[this.requestFilter];
      this.requestStylesheet.setParameter("filter", escape(Sarissa.serialize(filter.doc)) );
      alert(Sarissa.serialize(filter.doc));
    }

    //process the doc with the stylesheet
    httpPayload.postData = this.requestStylesheet.transformNodeToObject(feature);
    if (this.debug) {
      alert("request data:"+Sarissa.serialize(httpPayload.postData));
      if (config.serializeUrl) var response = postLoad(config.serializeUrl, httpPayload.postData);
    }

    //allow the tool to have a serverUrl property which overrides the model server URL
    //TBD: this still used?
    if (this.serverUrl) {
      httpPayload.url = this.serverUrl;
    } else {
      httpPayload.url = this.model.getServerUrl(this.requestName, httpPayload.method, feature);
    }

    //extract the URL from the transformation result for GET method
    if (httpPayload.method.toLowerCase() == "get") {
      httpPayload.postData.setProperty("SelectionLanguage", "XPath");
      Sarissa.setXpathNamespaces(httpPayload.postData, "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'");
      var queryString = httpPayload.postData.selectSingleNode("//mb:QueryString");
      if (httpPayload.url.indexOf("?") < 0) httpPayload.url += "?";
      httpPayload.url += queryString.firstChild.nodeValue;
      httpPayload.postData = null;
    }
    return httpPayload;
  }


  /**
   * Listener function which will actually issue the request.  This method
   * will prepare the HTTP payload for a particular featureName.
   * @param requestName the name of the web service operation to execute
   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
   */
  this.doRequest = function(objRef, featureName) {
    objRef.targetModel.featureName = featureName;

    var feature = objRef.model.getFeatureNode(featureName);
    if (objRef.model.setRequestParameters) objRef.model.setRequestParameters(featureName, objRef.requestStylesheet);
    var httpPayload = objRef.createHttpPayload(feature);
    objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
  }
  this.model.addListener(this.requestName.replace(/:/,"_"), this.doRequest, this);

  this.setAoiParameters = function(objRef,bbox) {
    //TBD: this depends on the targetModel having a containerModel to extract the AOI from.
    //we probably need a config property to point to the AOI model to handle this properly.
    if (objRef.targetModel.containerModel) {
      var featureSRS = null;
      var containerSRS = "EPSG:4326";
      //var bbox = objRef.targetModel.containerModel.getBoundingBox();
  /*
      //convert the BBOX to the feature SRS for the request
      var containerSRS = objRef.targetModel.containerModel.getSRS();
      if (featureSRS) {
        var sourceProj = new Proj(featureSRS.firstChild.nodeValue);
        if ( !sourceProj.matchSrs( containerSRS )) {  
          var containerProj = new Proj(objRef.targetModel.containerModel.getSRS());
          var llTemp = containerProj.Inverse(new Array(bbox[0],bbox[1]));
          var xy = sourceProj.Forward(llTemp);
          bbox[0] = xy[0]; bbox[1] = xy[1];
          llTemp = containerProj.Inverse(new Array(bbox[2],bbox[3]));
          xy = sourceProj.Forward(llTemp);
          bbox[2] = xy[0]; bbox[3] = xy[1];
        }
      }
  */
      objRef.requestStylesheet.setParameter("bBoxMinX", bbox[0][0] );
      objRef.requestStylesheet.setParameter("bBoxMinY", bbox[1][1] );
      objRef.requestStylesheet.setParameter("bBoxMaxX", bbox[1][0] );
      objRef.requestStylesheet.setParameter("bBoxMaxY", bbox[0][1] );
      objRef.requestStylesheet.setParameter("srs", containerSRS );
      objRef.requestStylesheet.setParameter("width", objRef.targetModel.containerModel.getWindowWidth() );
      objRef.requestStylesheet.setParameter("height", objRef.targetModel.containerModel.getWindowHeight() );
    }
  }

  this.init = function(objRef) {
    if (objRef.targetModel.containerModel) {
      objRef.targetModel.containerModel.addListener("aoi", objRef.setAoiParameters, objRef);
      //TBD: another one for bbox
    }
  }
  this.model.addListener("init", this.init, this);

}
