/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Functions to render and update a FeatureList from GML.
 * @constructor
 * @base WidgetBase
 * @author Cameron Shorter cameronATshorter.net
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function FeatureList(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  /** Url of WFS */
  this.webServiceUrl=widgetNode.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;

  /** Xsl to convert Feature into a WFS Transaction Insert. */
  this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert.xsl");

  /**
   * Process a button press.
   * @param objRef Reference to this object.
   * @param button Button name.
   */
  this.processButton=function(objRef,button){
    httpPayload=new Object();
    switch(button){
      case "Reset":
        if(objRef.model.url){
          httpPayload.url=objRef.model.url;
          httpPayload.method="get";
          httpPayload.postData=null;
          objRef.model.setParam('httpPayload',httpPayload);
          break;
        }
      case "Insert Feature":
        s=objRef.insertXsl.transformNodeToObject(objRef.model.doc);
        httpPayload.postData=s;
        httpPayload.url=objRef.webServiceUrl;
        httpPayload.method="post";
        objRef.targetModel.newRequest(objRef.targetModel,httpPayload);
        sucess=objRef.targetModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
        if (sucess){
          // Roll back to default feature if Feature Entry if successful
          objRef.model.loadModelDoc(objRef.model);
        }
        break;
      case "Update Feature":
        alert("FeatureList: Update Feature not implemented");
        break;
      default:
        alert("FeatureList: Unknown button: "+button);
    }
  }
}
