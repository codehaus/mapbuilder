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
  return posx;
}

function getPageY(e){
  var posy = 0;
  if (!e) var e = window.event;
  if (e.pageY) {
    posy = e.pageY;
  }
  else if (e.clientY) {
    posy = e.clientY;
  }
  return posy;
}

/*
 * parse comma-separated name=value argument pairs from
 * the query string of the URL; the function stores name=value
 * pairs in properties of an object and returns that object. 
*/
function getArgs(){
  var args = new Object();
  var query = location.search.substring(1);   // Get query string.
  var pairs = query.split("&");               // Break at ampersand.
  for(var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');          // Look for "name=value".
    if (pos == -1) continue;                  // If not found, skip.
    var argname = pairs[i].substring(0,pos);  // Extract the name.
    var value = pairs[i].substring(pos+1);    // Extract the value.
    args[argname] = decode(value);            // Store as a property.
  }
  return args;                                // Return the object.
}

// these two not yet usable, require mapWidth/mapHeight...
function getScreenX(bbox,xCoord){
  bbox[0]=parseFloat(bbox[0]);
  bbox[2]=parseFloat(bbox[2]);
  var xfac = (mapWidth/(bbox[2]-bbox[0]));
  x=xfac*(xCoord-bbox[0]);
  return x;
}

function getScreenY(yCoord){
  bbox[1]=parseFloat(bbox[1]);
  bbox[3]=parseFloat(bbox[3]);
  var yfac = (mapHeight/(bbox[3]-bbox[1]));
  pt.y=mapHeight-(yfac*(pt.y-bbox[1]));
  return pt;
}
