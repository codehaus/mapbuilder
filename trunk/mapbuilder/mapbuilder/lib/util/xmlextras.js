//<script>
//////////////////
// Helper Stuff //
//////////////////

// used to find the Automation server name
function getDomDocumentPrefix() {
	if (getDomDocumentPrefix.prefix)
		return getDomDocumentPrefix.prefix;
	
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			o = new ActiveXObject(prefixes[i] + ".DomDocument");
			return getDomDocumentPrefix.prefix = prefixes[i];
		}
		catch (ex) {};
	}
	
	throw new Error("Could not find an installed XML parser");
}

function getXmlHttpPrefix() {
	if (getXmlHttpPrefix.prefix)
		return getXmlHttpPrefix.prefix;
	
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			o = new ActiveXObject(prefixes[i] + ".XmlHttp");
			return getXmlHttpPrefix.prefix = prefixes[i];
		}
		catch (ex) {};
	}
	
	throw new Error("Could not find an installed XML parser");
}

//////////////////////////
// Start the Real stuff //
//////////////////////////



// XmlHttp factory
function XmlHttp() {}

XmlHttp.create = function () {
	try {
		if (window.XMLHttpRequest) {
			var req = new XMLHttpRequest();
			
			// some versions of Moz do not support the readyState property
			// and the onreadystate event so we patch it!
			if (req.readyState == null) {
				req.readyState = 1;
				req.addEventListener("load", function () {
					req.readyState = 4;
					if (typeof req.onreadystatechange == "function")
						req.onreadystatechange();
				}, false);
			}
			
			return req;
		}
		if (window.ActiveXObject) {
			return new ActiveXObject(getXmlHttpPrefix() + ".XmlHttp");
		}
	}
	catch (ex) {}
	// fell through
	throw new Error("Your browser does not support XmlHttp objects");
};

// XmlDocument factory
function XmlDocument() {}

XmlDocument.create = function () {
	try {
		// DOM2
		if (document.implementation && document.implementation.createDocument) {
			var doc = document.implementation.createDocument("", "", null);
			
			// some versions of Moz do not support the readyState property
			// and the onreadystate event so we patch it!
			if (doc.readyState == null) {
				doc.readyState = 1;
				doc.addEventListener("load", function () {
					doc.readyState = 4;
					if (typeof doc.onreadystatechange == "function")
						doc.onreadystatechange();
				}, false);
			}
			
			return doc;
		}
		if (window.ActiveXObject)
			return new ActiveXObject(getDomDocumentPrefix() + ".DomDocument");
	}
	catch (ex) {}
	throw new Error("Your browser does not support XmlDocument objects");
};

// Create the loadXML method and xml getter for Mozilla
if (window.DOMParser &&
	window.XMLSerializer &&
	window.Node && Node.prototype && Node.prototype.__defineGetter__) {

	// XMLDocument did not extend the Document interface in some versions
	// of Mozilla. Extend both!
	//XMLDocument.prototype.loadXML = 
	Document.prototype.loadXML = function (s) {
		
		// parse the string to a new doc	
		var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
		
		// remove all initial children
		while (this.hasChildNodes())
			this.removeChild(this.lastChild);
			
		// insert and import nodes
		for (var i = 0; i < doc2.childNodes.length; i++) {
			this.appendChild(this.importNode(doc2.childNodes[i], true));
		}
	};
	
	
	/*
	 * xml getter
	 *
	 * This serializes the DOM tree to an XML String
	 *
	 * Usage: var sXml = oNode.xml
	 *
	 */
	// XMLDocument did not extend the Document interface in some versions
	// of Mozilla. Extend both!
	/*
	XMLDocument.prototype.__defineGetter__("xml", function () {
		return (new XMLSerializer()).serializeToString(this);
	});
	*/
	Document.prototype.__defineGetter__("xml", function () {
		return (new XMLSerializer()).serializeToString(this);
	});
}


	/*
	 * cross browser method to load xml document
	 *
	 * Usage: var xmlDoc = loadXmlDoc( sUri, bAsync, asyncCallback)
   *      sUri - URI to load
   *      asyncCallback - callback function to call when loading asynchronously
	 *
	 */
var redirect = "http://localhost:8080/ql2/mapServlet/redirect.jsp?url=";

function loadAsync( sUri, asyncCallback, method, docToSend ) {
  //use a redirect for loading documents from other 
   if ( sUri.indexOf("://") > 0 ) sUri = redirect+sUri;
   alert("asynchronous loading:"+sUri);

   if ( !method ) method = "GET";   //default

   var xmlHttp = XmlHttp.create();
   xmlHttp.open(method, sUri, true);
   xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4) {
         alert("async loaded");
         asyncCallback( xmlHttp ); // responseXML : XmlDocument
      }
   }
   xmlHttp.send( docToSend );
}

function loadSync(sUri, method, docToSend ) {
   //if ( sUri.indexOf("://") > 0 ) sUri = redirect+sUri;
   //alert("synchronous loading:"+sUri);

   if ( !method ) method = "GET";   //default

   var xmlHttp = XmlHttp.create();
   xmlHttp.open(method, sUri, false);
   xmlHttp.send( docToSend );
  //alert(xmlHttp.getResponseHeader("Content-Type"));
   if ( null==xmlHttp.responseXML ) alert( "null response" );
   return xmlHttp.responseXML;
}


// XslProcessor object
function XslProcessor(xslUri) {
    var page = loadSync( xslUri );
    if (window.ActiveXObject) {
alert("prefix:" + getDomDocumentPrefix());
        this.xslt = new ActiveXObject(getDomDocumentPrefix() + ".XSLTemplate");
        var xslDoc = new ActiveXObject(getDomDocumentPrefix() + ".FreeThreadedDOMDocument");
        xslDoc.async = false;
        xslDoc.resolveExternals = false;
        xslDoc.load( xslUri );
        this.xslt.stylesheet = xslDoc;
        this.processor = this.xsltCreateProcessor();
    } else {
        this.processor = new XSLTProcessor(); //browser check here
        this.processor.importStylesheet( page ); //browser check here
    }
    this.toFragment = processToFragment;
    this.toDocument = processToDocument;
    this.setParam = setStylesheetParam;
}

function setStylesheetParam( name, value ) {
//browser check here
//alert("stylesheet param:" + name + "=" + value);
    this.processor.setParameter(null, name, value);
}

function processToFragment( xmlRef ) {
//browser check here
/*
	var x = xmlRef.getElementsByTagName('Layer');
        var output = "";
	for (i=0;i<x.length;i++)
	{
                var layer = x[i];
		for (j=0;j<layer.childNodes.length;j++)
		{
                        var dataNode = layer.childNodes[j];
			if (dataNode.nodeType != 1) continue;
			if (!dataNode.firstChild) continue;
			var theData = dataNode.firstChild.nodeValue;
                        output = output + ":" + theData
		}
	}
*/
//alert("processing:" + output);

    if (window.ActiveXObject) {
/*
      var result = new ActiveXObject(getDomDocumentPrefix() + ".DOMDocument");
      result.async = false;
      result.validateOnParse = true;
      xmlRef.transformNodeToObject( this.stylesheet, result );
      return result;
*/
      //return xmlRef.transformNode( this.stylesheet );
        this.processor.input = xmlRef;
        this.processor.transform();
        return this.processor.output;
    } else {
       return this.processor.transformToFragment( xmlRef, document );
    }
}

function processToDocument( xmlRef ) {
//browser check here
    return this.processor.transformToDocument( xmlRef );
}


