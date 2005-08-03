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
  var base = new ToolBase(this, toolNode, model);
  
  //get the request name to add listener to
  var requestName = toolNode.selectSingleNode("mb:requestName");
  if (requestName) {
    this.requestName = requestName.firstChild.nodeValue;
  }

  var styleUrl = baseDir+"/tool/xsl/"+this.requestName.replace(/:/,"_")+".xsl";
  this.stylesheet = new XslProcessor(styleUrl);

  // Set stylesheet parameters for all the child nodes from the config file
  for (var j=0;j<toolNode.childNodes.length;j++) {
    if (toolNode.childNodes[j].firstChild && toolNode.childNodes[j].firstChild.nodeValue) {
      this.stylesheet.setParameter(toolNode.childNodes[j].nodeName,toolNode.childNodes[j].firstChild.nodeValue);
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
    //if (this.debug) alert("stylesheet:"+Sarissa.serialize(this.stylesheet.xslDom));

    var featureSRS = null;
    //TBD: this is for ows wmc; other document types may need to set other params
    //var namespacePrefixes = feature.ownerDocument._sarissa_xpathNamespaces;
    //if (namespacePrefixes["wmc"]) {
    if (feature.namespaceURI=="http://www.opengis.net/context") {
      featureSRS = feature.selectSingleNode("wmc:SRS");  
      if (feature.selectSingleNode("ogc:Filter")) {
        this.stylesheet.setParameter("filter", escape(Sarissa.serialize(feature.selectSingleNode("ogc:Filter"))) );
      }
    } else if (feature.namespaceURI=="http://www.opengis.net/wfs") {
      featureSRS = feature.selectSingleNode("wfs:SRS"); 
    }

    if (this.targetModel.containerModel) {

      //this block is to get by a Mapserver WFS bug where the tuple separator 
      //is set to a comma instead of space; and post method doesn't work
      var ts = " ";
/*
      var comment = this.model.doc.documentElement.childNodes[1];
      if (comment && comment.nodeType==comment.COMMENT_NODE) {
        //alert(comment.nodeValue);
        if (comment.nodeValue.substring("MapServer version 4.4.")) {
          ts = ",";
          this.targetModel.method="get";
        }
      }
*/

      var bbox = this.targetModel.containerModel.getBoundingBox();

      //convert the BBOX to the feature SRS for the request
      var containerSRS = this.targetModel.containerModel.getSRS();
      if (featureSRS) {
        var sourceProj = new Proj(featureSRS.firstChild.nodeValue);
        if ( !sourceProj.matchSrs( containerSRS )) {  
          var containerProj = new Proj(this.targetModel.containerModel.getSRS());
          var llTemp = containerProj.Inverse(new Array(bbox[0],bbox[1]));
          var xy = sourceProj.Forward(llTemp);
          bbox[0] = xy[0]; bbox[1] = xy[1];
          llTemp = containerProj.Inverse(new Array(bbox[2],bbox[3]));
          xy = sourceProj.Forward(llTemp);
          bbox[2] = xy[0]; bbox[3] = xy[1];
        }
      }
      this.stylesheet.setParameter("bBoxMinX", bbox[0] );
      this.stylesheet.setParameter("bBoxMinY", bbox[1] );
      this.stylesheet.setParameter("bBoxMaxX", bbox[2] );
      this.stylesheet.setParameter("bBoxMaxY", bbox[3] );
      this.stylesheet.setParameter("srs", containerSRS );
      this.stylesheet.setParameter("width", this.targetModel.containerModel.getWindowWidth() );
      this.stylesheet.setParameter("height", this.targetModel.containerModel.getWindowHeight() );
    }
    this.stylesheet.setParameter("version", this.model.getVersion(feature) );

    //process the doc with the stylesheet
    var httpPayload = new Object();
    httpPayload.method = this.targetModel.method;
    this.stylesheet.setParameter("httpMethod", httpPayload.method );
    httpPayload.postData = this.stylesheet.transformNodeToObject(feature);
    //alert("request data:"+Sarissa.serialize(httpPayload.postData));
    var response = postLoad(config.serializeUrl, httpPayload.postData);

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
   * Listener function which will actually issue the request.
   * @param requestName the name of the web service operation to execute
   * @param featureNodeId the id of the node in the doc to be processed by the stylesheet
   */
  this.doRequest = function(objRef, featureName) {
    // if the targetModel is a template model, then create new model object and
    // assign it an id
    if (objRef.targetModel.template) {
      objRef.targetModel.modelNode.removeAttribute("id");
      objRef.targetModel = objRef.model.createObject(objRef.targetModel.modelNode);
    }
    objRef.targetModel.featureName = featureName;

    var feature = objRef.model.getFeatureNode(featureName);
    var httpPayload = objRef.createHttpPayload(feature);
    objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
  }
  this.model.addListener(this.requestName.replace(/:/,"_"), this.doRequest, this);
}
