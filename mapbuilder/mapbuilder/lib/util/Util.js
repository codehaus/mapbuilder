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
/**
 * get the absolute position of HTML element NS4, IE4/5 & NS6, even if it's in a table.
 * @param element The HTML element.
 * @return Top left Y position.
 */
}
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

