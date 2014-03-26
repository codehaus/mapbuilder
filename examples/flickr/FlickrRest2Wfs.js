/*
 * $Id$
 */
 
// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * ad-hoc tool to load flickr rest feed with a single xsl transformation.
 * this tool populates its model on init.
 * @constructor
 * @param toolNode config node for this tool
 * @param model model that contains this tool
 */
function FlickrRest2Wfs(toolNode, model) {
  ToolBase.apply(this, new Array(toolNode, model));
  
  this.url = this.getProperty('mb:url');
  this.stylesheet = this.getProperty('mb:stylesheet');
  
  model.addListener('init', this.safeTransform, this);
}

/**
 * XSL transformation, works also on IE with external documents and proxy.
 * @param objRef reference to this tool
 */
FlickrRest2Wfs.prototype.safeTransform = function(objRef) {
  var url = config.proxyUrl+"?url="+escape(objRef.url);
  if (MB_IS_MOZ) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send('');
    var doc = xmlHttp.responseXML;
    var stylesheet = new XslProcessor(objRef.stylesheet, objRef.model.namespace);
    stylesheet.setParameter('proxyUrl', config.proxyUrl);
    objRef.model.doc = stylesheet.transformNodeToObject(doc);
  } else {
    var progids = {domdoc: ['Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument.6.0'],
          freethreaded: ['Msxml2.FreeThreadedDOMDocument.3.0', 'Msxml2.FreeThreadedDOMDocument.6.0'],
          xsltpl: ['MSXML2.XSLTemplate.3.0', 'MSXML2.XSLTemplate.6.0'],
          xmlhttp: ['Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP.6.0']};
    var xml;
    for (var i in progids.domdoc) {
      try {
        xml = new ActiveXObject(progids.domdoc[i]);
        break;
      } catch (e) {}
    }
    var xsl = new ActiveXObject(progids.freethreaded[i]);
    var docCache = new ActiveXObject(progids.xsltpl[i]);
  
    var xmlHttp = new ActiveXObject(progids.xmlhttp[i]);
    xmlHttp.open('GET', objRef.stylesheet, false);
    xmlHttp.send(null);
    var xslText = xmlHttp.responseText;
    
    // replace url-encoded "%"s in urls to %25, so they get
    // double-escaped. Ugly hack, but IE needs that.
    var regex = new RegExp("/\?url=(.[^']*)'/g");
    var toReplace = xslText.match(/\?url=(.[^']*)'/g);
    for (var i=0; i<toReplace.length; i++) {
    	xslText = xslText.replace(toReplace[i], toReplace[i].replace(/%/g,'%25'));
    }
    
    xml.validateOnParse = false;
    xsl.validateOnParse = false;
    xsl.resolveExternals = true;
    xsl.setProperty("AllowDocumentFunction",true); 
    xsl.async = false;
    xml.async = false;
    xsl.loadXML(xslText);
    xml.load(url);
    docCache.stylesheet = xsl;
    var docProcessor = docCache.createProcessor();
    docProcessor.input = xml;
    docProcessor.addParameter('proxyUrl', config.proxyUrl, '');
    docProcessor.transform();
    objRef.model.doc = (new DOMParser()).parseFromString(docProcessor.output, "text/xml"); 
  }
  objRef.model.callListeners('refresh');
}

