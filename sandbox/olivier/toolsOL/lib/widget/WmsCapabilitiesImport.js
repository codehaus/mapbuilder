/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: WmsCapabilitiesImport.js 1671 2005-09-20 02:37:54Z madair1 $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Build a WMC document from a WMS GetCapabilities response.
 * @constructor
 * @base WidgetBaseXSL
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */

function WmsCapabilitiesImport(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  /**
   * Load Capabilities document when ENTER is pressed.
   * param e The window event.
   */
  this.onKeyPress=function(e) {
    var url;
    var keycode;
    if (e.which){
      //Mozilla
      keycode=e.which;
      url=e.currentTarget.value;
    }else{
      //IE
      keycode=window.event.keyCode;
      url=window.event.srcElement.value;
    }

    if (keycode == 13) {
      capabilities = Sarissa.getDomDocument();
      capabilities.async = false;
      capabilities.load(url);
      alert("capabilities="+capabilities.xml);

      xsl = Sarissa.getDomDocument();
      xsl.async = false;
      xsl.load(baseDir+"/widget/wms/WMSCapabilities2Context.xsl");
      alert("xsl="+xsl.xml);

      context=Sarissa.getDomDocument();
      capabilities.transformNodeToObject(xsl,context);
      alert("context="+context.xml);

      // Load the new Context Document
      this.model.loadModelNode(context);
    }
  }
}
