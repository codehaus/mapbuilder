/*
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html
Dependancies: Sarissa

$Id$
*/

/**
Transform an XML document using the provided XSL and use the results to build
a web page.
@constructor
@param xslUrl The URL of an XSL stylesheet.
@author Cameron Shorter - Cameron AT Shorter.net
*/
function XslProcessor(xslUrl) {
  // get the stylesheet document
  this.xslDom = Sarissa.getDomDocument();
  this.xslDom.async = false;
  this.xslDom.load(xslUrl);

  /**
   * Transforms XML in the provided xml node according to this XSL.
   * @param xmlNode The XML node to be transformed.
   * @return The transformed String.
   */
  this.transformNode=function(xmlNode) {
    // transform and build a web page with result
    s=new String(xmlNode.transformNode(this.xslDom));
    // Some browsers XSLT engines don't transform &lt; &gt; to < >, so do it here.
    a=s.split("&lt;");
    s=a.join("<");
    a=s.split("&gt;");
    s=a.join(">");
    return s;
  }
  this.transformNodeToObject=function(xmlNode) {
    // transform and build a web page with result
    var result = Sarissa.getDomDocument();
    xmlNode.transformNodeToObject(this.xslDom,result);
    return result;
  }
  this.setParameter=function(paramName, paramValue) {
    Sarissa.setXslParameter( this.xslDom, paramName, "'"+paramValue+"'");
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
 * Dynamically load a script file if it has not already been loaded.
 * @param url The url of the script.
 */
/* Moved into Mapbuilder.js

function loadScript (url) {
  if(!document.getElementById(url)){
    var script = document.createElement('script');
    script.defer = false;   //not sure of effect of this?
    script.type = "text/javascript";
    script.src = url;
    script.id = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
*/

if (_SARISSA_IS_MOZ ) {
  /** 
   * Extends the node class to provide simple node value lookup
   * @argument nodeXpath  xpath of the node 
   */
  Node.prototype.simpleValue = function(nodeXpath)
  {
    try
    {
      var node = this.selectSingleNode(nodeXpath)
      return node.firstChild.nodeValue;
    }
    catch(e)
    {
      alert("simpleValue exception:" + e);
      throw e;
    }
  };
}

function fred(a) {
  alert(a);
}
