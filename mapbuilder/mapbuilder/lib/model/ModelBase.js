/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Base Model class to be instantiated by all Model objects.
 * loads the XML document as the doc property of the model
 * event listeners.  ModelBase extends Listener.
 * @constructor
 * @author Cameron Shorter
 * @see Listener
 */
function ModelBase(url) {

  this.doc = Sarissa.getDomDocument();
  this.doc.async = false;
  // the following two lines are needed for IE
  this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  this.doc.setProperty("SelectionLanguage", "XPath");
  this.doc.load(url);
  if ( this.doc.parseError < 0 ) alert("error loading document: " + url);
  
  var id = this.doc.documentElement.attributes.getNamedItem("id");
  if (id) this.id = id.nodeValue;

  // Inherit the Listener functions and parameters
  var listener = new Listener();
  for (sProperty in listener) { 
    this[sProperty] = listener[sProperty]; 
  } 
}
