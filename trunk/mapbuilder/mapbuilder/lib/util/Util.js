/*
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html
Dependancies: Sarissa

$Id$
*/

// some basic browser detection
var MB_IS_MOZ = (document.implementation && document.implementation.createDocument)?true:false;

/**
Transform an XML document using the provided XSL and use the results to build
a web page.
@constructor
@param xslUrl The URL of an XSL stylesheet.
@author Cameron Shorter - Cameron AT Shorter.net
*/
function XslProcessor(xslUrl,docNSUri) {
  // override Sarissa configurations to prefer MSXML3, because
  // MSXML6 does not work well with IE6SP2
  if (!MB_IS_MOZ) {
    _SARISSA_DOM_PROGID = Sarissa.pickRecentProgID(["Msxml2.DOMDocument.3.0", "Msxml2.DOMDocument.6.0"], [["SELECT_NODES", 2],["TRANSFORM_NODE", 2]]);
    _SARISSA_XMLHTTP_PROGID = Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.3.0", "MSXML2.XMLHTTP.6.0"], [["XMLHTTP", 4]]);
    _SARISSA_THREADEDDOM_PROGID = Sarissa.pickRecentProgID(["Msxml2.FreeThreadedDOMDocument.3.0", "MSXML2.FreeThreadedDOMDocument.6.0"]);
    _SARISSA_XSLTEMPLATE_PROGID = Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.3.0", "MSXML2.XSLTemplate.6.0"], [["XSLTPROC", 2]]);
  }
  // get the stylesheet document
  this.xslUrl=xslUrl;
  this.xslDom = Sarissa.getDomDocument();
  this.xslDom.async = false;
  // fix some issues in IE
  if (!MB_IS_MOZ) {
    try {
      // IE6 SP2 parsing bug
      this.xslDom.validateOnParse=false;
      // Prevent "Access denied" with external documents
      this.xslDom.setProperty("AllowDocumentFunction", true);
      this.xslDom.resolveExternals = true;
    }
    catch (e) {
      // do nothing here, we won't get far anyway.
    }
  }
  this.xslDom.load(xslUrl);
  if ( Sarissa.getParseErrorText(this.xslDom) != Sarissa.PARSED_OK )
    alert(mbGetMessage("errorLoadingStylesheet", xslUrl));

  this.processor = new XSLTProcessor();
  this.processor.importStylesheet(this.xslDom);
  
  this.docNSUri = docNSUri;

  /**
   * Transforms XML in the provided xml node according to this XSL.
   * @param xmlNode The XML node to be transformed.
   * @return The transformed String.
   */
  this.transformNodeToString = function(xmlNode) {
    try {
      // transform and build a web page with result
      var newDoc = this.transformNodeToObject(xmlNode);
      var s = (new XMLSerializer()).serializeToString(newDoc);
      s =  s.replace(/.*\?\>/,"");//hack for opera to delete <?xml ... ?>
      return Sarissa.unescape(s);
    } catch(e){
      alert(mbGetMessage("exceptionTransformingDoc", this.xslUrl));
      alert("XSL="+(new XMLSerializer()).serializeToString(this.xslDom));
      alert("XML="+(new XMLSerializer()).serializeToString(xmlNode));
    }
  }

  /**
   * Transforms XML in the provided xml node according to this XSL.
   * @param xmlNode The XML node to be transformed.
   * @return a DOM document object
   */
  this.transformNodeToObject=function(xmlNode) {
    var newFragment = this.processor.transformToDocument(xmlNode);
    return newFragment;
  }

  /**
   * Set XSL parameter.
   */
  this.setParameter=function(paramName, paramValue, nsUri) {
    //if ( typeof paramValue == "string" || typeof paramValue == "number") paramValue="'"+paramValue+"'";
    if (!paramValue) {
      //alert("null value for stylesheet param:"+paramName+":"+paramValue);
      return;
    }
    this.processor.setParameter( null, paramName, paramValue);
  }
}

/**
 * A more flexible interface for loading docs that allows POST and async loading
 */
function postLoad(sUri, docToSend, contentType ) {
   var xmlHttp = new XMLHttpRequest();
   if ( sUri.indexOf("http://")==0 ) {
     xmlHttp.open("POST", config.proxyUrl, false);
     xmlHttp.setRequestHeader("serverUrl",sUri);//escape(sUri).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27'));
   } else {
     xmlHttp.open("POST", sUri, false);
   }
   xmlHttp.setRequestHeader("content-type","text/xml");
   if (contentType) xmlHttp.setRequestHeader("content-type",contentType);
   //alert("sending:"+docToSend.xml);
   xmlHttp.send( docToSend );
/*
   if (_SARISSA_IS_IE) {
alert("before");
    xmlHttp.status = xmlHttp.Status;
alert("after");
    xmlHttp.statusText = xmlHttp.StatusText;
    xmlHttp.responseText = xmlHttp.ResponseText;
   }
*/
   if (xmlHttp.status >= 400) {   //http errors status start at 400
      alert(mbGetMessage("errorLoadingDocument", sUri, xmlHttp.statusText, xmlHttp.responseText));
      var outDoc = Sarissa.getDomDocument();
      outDoc.parseError = -1;
      return outDoc;
   } else {
     //alert(xmlHttp.getResponseHeader("Content-Type"));
     if ( null==xmlHttp.responseXML ) alert(mbGetMessage("nullXmlResponse", xmlHttp.responseText));
     return xmlHttp.responseXML;
   }
}


/**
 * A more flexible interface for loading docs that allows POST et GET param for save model
 */

function postGetLoad(sUri, docToSend, contentType , dir, fileName) {

   var xmlHttp = new XMLHttpRequest();
   if ( sUri.indexOf("http://")==0 )
   {
       xmlHttp.open("POST", config.proxyUrl, false);
       xmlHttp.setRequestHeader("serverUrl",sUri);


   }
   else
   {
       sUri=sUri+"?dir="+dir+"&fileName="+fileName;
       xmlHttp.open("POST", sUri, false);
   }
   xmlHttp.setRequestHeader("content-type","text/xml");
   if (contentType) xmlHttp.setRequestHeader("content-type",contentType);
   xmlHttp.send( docToSend );

   if (xmlHttp.status >= 400)
   {   //http errors status start at 400
        alert(mbGetMessage("errorLoadingDocument", sUri, xmlHttp.statusText, xmlHttp.responseText));
        var outDoc = Sarissa.getDomDocument();
        outDoc.parseError = -1;
        return outDoc;
   }
   else
   {
       if ( null==xmlHttp.responseXML ) alert(mbGetMessage("nullXmlResponse", xmlHttp.responseText));
       return xmlHttp.responseXML;
   }
}



  /**
   * If URL is local, then return URL unchanged,
   * else return URL of http://proxy?url=URL , or null if proxy not defined.
   * @param url Url of the file to access.
   * @return Url of the proxy and service in the form http://host/proxy?url=service
   */
function getProxyPlusUrl(url) {
  if ( url.indexOf("http://")==0 ) {
    if ( config.proxyUrl ) {
      url=config.proxyUrl+"?url="+escape(url).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27');
    } else {
      alert(mbGetMessage("unableToLoadDoc", url));
      url=null;
    }
  }
  return url;
}

  /**
   * Browser independant version of createElementNS()
   * @param doc the owner document for the new element
   * @param name for the new element
   * @param ns the URL for the namespace (without a prefix)
   * @return element in the document with the specified namespace
   */
function createElementWithNS(doc,name,nsUri) {
  if (_SARISSA_IS_IE) {
    return doc.createNode(1, name, nsUri);
  } else {
    return doc.createElementNS(nsUri,name);
  }
}

/**
 * Create a unique Id which can be used for classes to link themselves to HTML
 * Ids.
 * @constructor
 */
function UniqueId(){
  this.lastId=0;

  /** Return a numeric unique Id. */
  this.getId=function() {
    this.lastId++;
    return this.lastId;
  }
}
//use this global object to generate a unique ID via the getId function
var mbIds = new UniqueId();

function setISODate(isoDateStr) {
  var parts = isoDateStr.match(/(\d{4})-?(\d{2})?-?(\d{2})?T?(\d{2})?:?(\d{2})?:?(\d{2})?\.?(\d{0,3})?(Z)?/);
  var res = null;
  for (var i=1;i<parts.length;++i){
    if (!parts[i]) {
      parts[i] = (i==3)?1:0; //months start with day number 1, not 0
      if (!res) res = i;
    }
  }
  var isoDate = new Date();
  isoDate.setFullYear(parseInt(parts[1],10));
  isoDate.setMonth(parseInt(parts[2],10)-1,parseInt(parts[3],10));
  isoDate.setDate(parseInt(parts[3],10));
  isoDate.setHours(parseInt(parts[4],10));
  isoDate.setMinutes(parseInt(parts[5],10));
  isoDate.setSeconds(parseFloat(parts[6],10));
  if (!res) res = 6;
  isoDate.res = res;
  return isoDate;
}

function getISODate(isoDate) {
  var res = isoDate.res?isoDate.res:6;
  var dateStr = "";
  dateStr += res>=1?isoDate.getFullYear():"";
  dateStr += res>=2?"-"+leadingZeros(isoDate.getMonth()+1,2):"";
  dateStr += res>=3?"-"+leadingZeros(isoDate.getDate(),2):"";
  dateStr += res>=4?"T"+leadingZeros(isoDate.getHours(),2):"";
  dateStr += res>=5?":"+leadingZeros(isoDate.getMinutes(),2):"";
  dateStr += res>=6?":"+leadingZeros(isoDate.getSeconds(),2):"";
  return dateStr;
}

function leadingZeros(num,digits) {
  var intNum = parseInt(num,10);
  var base = Math.pow(10,digits);
  if (intNum<base) intNum += base;
  return intNum.toString().substr(1);
}


// Correctly handle PNG transparency in Win IE 5.5 or higher.
// this method should be set as an IMG onload handler for PNG map layers
// thanks to Caroklyn Cole for this fix.  For an explanation see:
// http://homepage.ntlworld.com/bobosola. Updated 02-March-2004
// modified to the images as visible after this has been called.
// PL-BRGM
// Add oldImage in parameter
function fixPNG(myImage,myId,oldImage) {
  if (_SARISSA_IS_IE) {
    // PL - BRGM
    //opacity of the image
    if(oldImage) {
      var valIEOpacity= oldImage.style.filter.substring(oldImage.style.filter.indexOf('opacity=',0)+8,oldImage.style.filter.lastIndexOf(')',0));
      if(oldImage.style.filter.indexOf('opacity=',0) ==-1){
        valIEOpacity = null;
      }
       var _opacity= (valIEOpacity)?valIEOpacity/100:-1;
     }
  // END
    var imgID = "id='" + myId + "' ";
    var imgClass = (myImage.className) ? "class='" + myImage.className + "' " : ""
    var imgTitle = (myImage.title) ? "title='" + myImage.title + "' " : "title='" + myImage.alt + "' "
    var imgStyle = "display:inline-block;" + myImage.style.cssText
    var strNewHTML = "<span " + imgID + imgClass + imgTitle

    strNewHTML += " style=\"" + "width:" + myImage.width + "px; height:" + myImage.height + "px;" + imgStyle + ";"
    // store the opacity in the style even not used by IE
    if (_opacity!=-1) strNewHTML += "opacity=" + _opacity + ";" ;
    // Escape some chars (don't use encode() that would escape %xx previously used in XSL)
    var src = myImage.src;
    src = src.replace(/\(/g,'%28');
    src = src.replace(/\)/g,'%29');
    src = src.replace(/'/g,'%27');
    // AlphaImageLoader converts '%23' in src to '#' and cuts URL on '#'
    src = src.replace(/%23/g,'%2523');
    strNewHTML += "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader";
    strNewHTML += "(src=\'" + src + "\', sizingMethod='scale')";

    // PL - BRGM
    // add the opacity
    if (oldImage && _opacity!=-1) strNewHTML +=  " alpha(opacity=" + (_opacity * 100) + ")";
    strNewHTML +="; \"></span>" ;
  // END PL - BRGM
    //myImage.outerHTML = strNewHTML;
    //alert(strNewHTML);
    return strNewHTML;
  }
}



/**
 * get the absolute position of HTML element NS4, IE4/5 & NS6, even if it's in a table.
 * @param element The HTML element.
 * @return Top left X position.
 */
function getAbsX(elt) {
        return (elt.x) ? elt.x : getAbsPos(elt,"Left") + 2;
}

/**
 * get the absolute position of HTML element NS4, IE4/5 & NS6, even if it's in a table.
 * @param element The HTML element.
 * @return Top left Y position.
 */
function getAbsY(elt) {
        return (elt.y) ? elt.y : getAbsPos(elt,"Top") + 2;
}

/**
 * TBD: Comment me.
 * @param elt TBD
 * @param which TBD
 */
function getAbsPos(elt,which) {
 iPos = 0;
 while (elt != null) {
        iPos += elt["offset" + which];
        elt = elt.offsetParent;
 }
 return iPos;
}

/**
 * get the absolute position of a user event (e.g., a mousedown).
 * @param e The user event.
 * @return Left or top position.
 */
function getPageX(e){
  var posx = 0;
  if (!e) var e = window.event;
  if (e.pageX) {
    posx = e.pageX;
  }
  else if (e.clientX) {
   posx = e.clientX;
  }
  if (document.body && document.body.scrollLeft){
    posx += document.body.scrollLeft;
  }
  else if (document.documentElement && document.documentElement.scrollLeft){
    posx += document.documentElement.scrollLeft;
  }
  return posx;
}

/**
 * get the absolute position of a user event (e.g., a mousedown).
 * @param e The user event.
 * @return Left or top position.
 */
function getPageY(e){
  var posy = 0;
  if (!e) var e = window.event;
  if (e.pageY) {
    posy = e.pageY;
  }
  else if (e.clientY) {
    posy = e.clientY;
  }
  if (document.body && document.body.scrollTop){
    posy += document.body.scrollTop;
  }
  else if (document.documentElement && document.documentElement.scrollTop){
    posy += document.documentElement.scrollTop;
  }
  return posy;
}

/**
 * parse comma-separated name=value argument pairs from the query string of the URL; the function stores name=value pairs in properties of an object and returns that object.
 * @return args Array of arguments passed to page, in form args[argname] = value.
 */
function getArgs(){
  var args = new Object();
  var query = location.search.substring(1);
  var pairs = query.split("&");
  for(var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos == -1) continue;
    var argname = pairs[i].substring(0,pos);
    var value = pairs[i].substring(pos+1);
    args[argname] = unescape(value.replace(/\+/g, " "));
  }
  return args;
}
//initialize the array once
window.cgiArgs = getArgs();

/**
 * convert geographic x coordinate to screen coordinate.
 * @param context The context object.
 * @param xCoord The geographic x coordinate to be converted.
 * @return x the converted x coordinate.
 */
function getScreenX(context, xCoord){
  bbox=context.getBoundingBox();
  width=context.getWindowWidth();
  bbox[0]=parseFloat(bbox[0]);
  bbox[2]=parseFloat(bbox[2]);
  var xfac = (width/(bbox[2]-bbox[0]));
  x=xfac*(xCoord-bbox[0]);
  return x;
}

/**
 * convert geographic y coordinate to screen coordinate.
 * @param context The context object.
 * @param yCoord The geographic x coordinate to be converted.
 * @return y the converted x coordinate.
 */
function getScreenY(context, yCoord){
  var bbox=context.getBoundingBox();
  var height=context.getWindowHeight();
  bbox[1]=parseFloat(bbox[1]);
  bbox[3]=parseFloat(bbox[3]);
  var yfac = (heighteight/(bbox[3]-bbox[1]));
  var y=height-(yfac*(pt.y-bbox[1]));
  return y;
}

/**
 * convert screen x coordinate to geographic coordinate.
 * @param context The context object.
 * @param xCoord The screen x coordinate to be converted.
 * @return x the converted x coordinate.
 */
function getGeoCoordX(context, xCooord) {
  var bbox=context.getBoundingBox();
  var width=context.getWindowWidth();
  bbox[0]=parseFloat(bbox[0]);
  bbox[2]=parseFloat(bbox[2]);
  var xfac = ((bbox[2]-bbox[0]) / width);
  var x=bbox[0] + xfac*(xCoord);
  return x;
}

/**
 * convert screen coordinate to screen coordinate.
 * @param context The context object.
 * @param yCoord The geographic y coordinate to be converted.
 * @return y the converted y coordinate.
 */
function getGeoCoordY(yCoord){
  var bbox=context.getBoundingBox();
  var height=context.getWindowHeight();
  bbox[1]=parseFloat(bbox[1]);
  bbox[3]=parseFloat(bbox[3]);
  var yfac = ((bbox[3]-bbox[1]) / height);
  var y=bbox[1] + yfac*(height-yCoord);
  return y;
}

/**
 * create an element and append it to the document body element.
 * @param type The type of element to be created.
 * @return node The node created and appended.
 */
function makeElt(type) {
  var node=document.createElement(type);
  document.getElementsByTagName("body").item(0).appendChild(node);
  return node;
}

// variable needed to determine if a popup window is currently open
var newWindow = '';
/**
 * open a popup window, adapted from http://www.quirksmode.org/js/croswin.html
 * @param url The url of the page to be opened.
 * @param width Width of the popup window, in pixels.
 * @param height Height of the popup window, in pixels.
 */
function openPopup(url, width, height) {
  if(width == null) {
    width = 300;
  }
  if(height == null) {
    height = 200;
  }
  if (!newWindow.closed && newWindow.location) {
    newWindow.location.href = url;
  }
  else {
    newWindow=window.open(url,'name','height=' + height + ',width=' + width);
    if (!newWindow.opener) newwindow.opener = self;
  }
  if (window.focus) {newWindow.focus()}
  return false;
}

/**
 * write debugging info to a textbox onscreen.
 * @param output String to be output.
 */
function debug(output){
  tarea=makeElt("textarea");
  tarea.setAttribute("rows","3");
  tarea.setAttribute("cols","40");
  tnode=document.createTextNode(output);
  tarea.appendChild(tnode);
}

/**
 * determine and return the target element of an event.
 * @param evt The event.
 * @return elt The element.
 */
function returnTarget(evt){
  evt = (evt) ? evt : ((window.event) ? window.event : "");
  var elt=null;
  if(evt.target){
    elt=evt.target;
  }
  else if(evt.srcElement){
    elt=evt.srcElement;
  }
  return elt;
}

/**
 * attach an event to an element.
 * @param elementObject The object.
 * @param eventName The name of the event.
 * @param functionObject The function to be called.
 */
function addEvent(elementObject, eventName, functionObject) {
  if(document.addEventListener) {
    elementObject.addEventListener(eventName, functionObject, false);
  }
  else if(document.attachEvent) {
    elementObject.attachEvent("on" + eventName, functionObject);
  }
}

/**
 * handle event attached to an object.
 * @param evt The event.
 */
function handleEventWithObject(evt){
  var elt = returnTarget(evt);
  var obj = elt.ownerObj;
  if (obj!=null) obj.handleEvent(evt);
}

/**
 * Show a message if the debug property of the object has been set.
 * @param object  the object that possibly has the debug property set
 * @param message the message to show
 */
function mbDebugMessage(object, message)
{
  if (object && object.debug) {
    alert(message);
  }
}

/**
 * Get a message from the <code>widgetText</code> file and format it if extra
 * arguments are passed.
 * @param messageKey       the message key within the message node
 * @param varArgs          optional extra parameters for formatting the message
 * @return                 <code>"NoMsgsFound"</code> if the <code>widgetText</code> file is not found,<br/>
 *                         the <code>messageKey</code> if the message key was not found within the message node,<br/>
 *                         the (formatted) message if it was found
 */
function mbGetMessage(messageKey)
{
  var message = "NoMsgsFound";
  if (config.widgetText) {
    var msgKeyXpath = "/mb:WidgetText/mb:messages/mb:" + messageKey;
    var msgKeyNodes = config.widgetText.selectNodes(msgKeyXpath);
    if (!msgKeyNodes || msgKeyNodes.length == 0) {
      // Message not found, fall back to message key
      message = messageKey;
    }
    else {
      // Message found; pick last one so user can override messages
      message = msgKeyNodes.item(msgKeyNodes.length-1).firstChild.nodeValue;
      if (arguments[mbGetMessage.length]) {
        // Extra arguments, format message
        var varArgs = [].slice.call(arguments, mbGetMessage.length);
        varArgs.unshift(message);
        message = mbFormatMessage.apply(this, varArgs);
      }
    }
  }
  return message;
}

/**
 * Format a message with the extra arguments. <br/>
 * E.g. if called as: <code>mbFormatMessage("{1} is {0} {2}, {1}", "a good", "this", "test")</code><br/>
 * the formatted message returned is: <code>"this is a good test, this"</code>
 * @param messageFormat the message format string
 * @param varArgs       optional extra parameters for formatting the message
 * @return              the formatted message
 */
function mbFormatMessage(messageFormat)
{
  var message = messageFormat;
  var varArgs = [].slice.call(arguments, mbFormatMessage.length);
  for (var i in varArgs) {
    var parm = new RegExp("\\{" + i + "\\}", "g");
    message = message.replace(parm, varArgs[i]);
  }
  return message;
}

/**
 * extract a style from a SLD node of an XML doc and return
 * it as url parameter for a WMS request
 * @param node XML node containing the styled layer descriptor
 * @return WMS-compliant SLD URL parameters as array
 */
function sld2UrlParam(node) {
  var params=new Array();
  if (node) {
    var sld = node.selectSingleNode("wmc:SLD");
    var name = node.selectSingleNode("wmc:Name");
    if(sld) {
      if(sld.selectSingleNode("wmc:OnlineResource")) {	
        params.sld=sld.selectSingleNode("wmc:OnlineResource").getAttribute("xlink:href");
      } else if(sld.selectSingleNode("wmc:FeatureTypeStyle")) {
        params.sld=(new XMLSerializer()).serializeToString(sld.selectSingleNode("wmc:FeatureTypeStyle"));
      } else if(sld.selectSingleNode("wmc:StyledLayerDescriptor")) { 
        params.sld_body=(new XMLSerializer()).serializeToString(sld.selectSingleNode("wmc:StyledLayerDescriptor"));    		
      }
    } else if(name) {
      params.styles=(name.firstChild)?name.firstChild.nodeValue:"";	
    }
  }  
  return params;
}

/**
 * extract a style from a SLD node of an XML doc and return
 * it as OpenLayers style
 * @param objRef reference to the map widget that will use the style
 * @param node XML node containing the styled layer descriptor
 * @return OpenLayers style object
 */
function sld2OlStyle(node) {
  var style1=new Object();
  var value;
  var styleSet=false;

  if (node) {
    value=node.selectSingleNode(".//sld:ExternalGraphic/sld:OnlineResource/@xlink:href");
    if(value){
      style1.externalGraphic=value.firstChild.nodeValue;
      styleSet=true;
    }
    value=node.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill']");
    if(value){
      style1.fillColor=value.firstChild.nodeValue;
      styleSet=true;
    }
    value=node.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill-opacity']");
    if(value){
      style1.fillOpacity=value.firstChild.nodeValue;
      styleSet=true;
    } else {
      // opacity eg. for externalGraphic
      value=node.selectSingleNode(".//sld:Opacity/sld:Literal");
      if (value){
        style1.fillOpacity=value.firstChild.nodeValue;
        styleSet=true;
      }
    }
  
    value=node.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke']");
    if(value){
      style1.strokeColor=value.firstChild.nodeValue;
      styleSet=true;
    }
    
    value=node.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-opacity']");
    if(value){
      style1.strokeOpacity=value.firstChild.nodeValue;
      styleSet=true;
    }
    
    value=node.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-width']");
    if(value){
      style1.strokeWidth=value.firstChild.nodeValue;
      styleSet=true;
    }
    
    value=node.selectSingleNode(".//sld:Size");
    if(value){
      style1.pointRadius=value.firstChild.nodeValue;
      styleSet=true;
    }
  }
  
  if(!styleSet)style1=null;
  return style1;
}
/**
 * getNodevalue return value of node
 * it as OpenLayers style
 * @param node 
 * @return return node's value
 */
function getNodeValue(sResult){
	if(sResult.nodeType == 1) return sResult.firstChild ? sResult.firstChild.nodeValue : "";
	if(sResult.nodeType > 1 || sResult.nodeType < 5) return sResult.nodeValue;
	return sResult;
}