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
   * Transforms XML in the provided URL according to this XSL.
   * @param xmlUrl The URL of XML to be transformed.
   * @return The transformed String.
   */
  this.transformUrl=function(xmlUrl) {
    // get xml source document
    var xmlDom = Sarissa.getDomDocument();
    xmlDom.async = false;
    xmlDom.load(xmlUrl);

    return this.transformNode(xmlDom);
  }

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
