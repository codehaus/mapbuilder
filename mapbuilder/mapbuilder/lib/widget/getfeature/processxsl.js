/******************************************************************************
Description: Javascript function to process XSL and build a web page.
Author:      Cameron Shorter cameronAtshorter.net
License: GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
******************************************************************************/

/******************************************************************************
@name        processXsl
@description Transform an XML document using the provided XSL and use the
             results to build a web page.
@param       xslUrl The URL of an XSL stylesheet.
@param       xmlUrl The URL of XML to be transformed.
******************************************************************************/
function processXsl(xslUrl, xmlUrl) {
  // get the stylesheet document
  var xslDom = Sarissa.getDomDocument();
  xslDom.async = false;
  xslDom.load(xslUrl);

  // get the source document
  var xmlDom = Sarissa.getDomDocument();
  xmlDom.async = false;
  xmlDom.load(xmlUrl);

  // transform and build a web page with result
  var sResult = xmlDom.transformNode(xslDom);
  document.write(sResult);  // Load FeatureColleciton
}
