/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Build a WMC document from a WMS GetCapabilities response.
 * This widget extends WidgetBase.
 * @constructor
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */

function WmsCapabilitiesImport(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Load Capabilities document when ENTER is pressed.
   * param e The window event.
   */
  this.onKeyPress=function(e) {
    var url;
    var keycode;
    if (e){
      //Mozilla
      keycode=e.which;
      url=e.currentTarget.value;
    }else{
      //IE
      keycode=window.event.keyCode;
      url=window.event.srcElement.value;
    }

    if (keycode == 13) {
      alert("Url="+url);

      this.capabilities = Sarissa.getDomDocument();
      this.capabilities.async = false;
      // the following two lines are needed for IE
      this.capabilities.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
      this.capabilities.setProperty("SelectionLanguage", "XPath");

      this.capabilities.load(url);
      this.xsl=new XslProcessor(baseDir + "/widget/wms/WMSCapabilities2Context.xsl");
      alert("xsl="+this.xsl.xslDom.xml);
      context=this.xsl.transformNode(this.capabilities);
      alert(context.xml);

    }
  }
}
