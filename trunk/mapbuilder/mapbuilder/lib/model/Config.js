/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

function Config(url) {

  /**
   * Load the mapbuilder configuration file
   */
  this.doc = Sarissa.getDomDocument();
  this.doc.async = false;
  // the following two lines are needed for IE
  this.doc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
  //this.doc.setProperty("SelectionNamespaces", "xmlns:mb='http://mapbuilder.sourceforge.net/config'");
  this.doc.setProperty("SelectionLanguage", "XPath");
  this.doc.load(url);

  this.baseDir = this.doc.selectSingleNode("/MapbuilderConfig/baseDir").firstChild.nodeValue;
  var skin = this.doc.selectSingleNode("/MapbuilderConfig/skin");
  if ( skin ) {
    skin = skin.firstChild.nodeValue;   //why firstChild?
  } else {
    skin = "default";
  }
  this.skinDir = this.baseDir + "/skin/" + skin;

  var scriptIncludes = this.doc.selectNodes("//scriptFile");
  for (var i=0; i<scriptIncludes.length; i++ ) {
    var node = scriptIncludes[i];
    var scriptFile = this.baseDir + node.firstChild.nodeValue;
    alert("loading script file:" + scriptFile);
    loadScript( scriptFile );
  }
}
