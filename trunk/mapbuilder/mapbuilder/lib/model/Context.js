/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
Stores a Web Map Context (WMC) document as defined by the Open GIS Consortium
http://opengis.org and extensions the the WMC.  A unique Id is included for
each layer which is used when referencing Dynamic HTML layers in MapPane.
Dependancies: Sarissa (XML utilities).
@constructor
@author Cameron Shorter cameronATshorter.net
*/
function Context(url) {

  /**
   * The Web Map Context Document.  Make sure this is populated with setWmc().
   */
  this.context = Sarissa.getDomDocument();
  this.context.async = false;
  // the following two lines are needed for IE
  this.context.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  this.context.setProperty("SelectionLanguage", "XPath");
  this.context.load(url);

  /**
   * Set a Wmc document from the given URL.
   * @param url The URL of the WMC document.
   */
  this.setWmc = function(url) {
    this.context.load(url);
   }
}
