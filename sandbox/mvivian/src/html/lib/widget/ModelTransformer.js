/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ModelTransformer.js 3150 2007-08-20 22:50:33Z mvivian $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 */
function ModelTransformer(widgetNode, model) {

  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "default"; 
  
  this.handleRequest=true;

  // Extend WidgetBase
  WidgetBase.apply(this, new Array(widgetNode, model));

   /** @author Mvivian 
   *  Xsl Document that will transform the features collection into another type  */
  this.transform=new XslProcessor(widgetNode.selectSingleNode("mb:transform").firstChild.nodeValue);

  /**
   * If the model is changed the xsl transform is applyed to the model
   * @param objRef Pointer to this object.
   */
  this.handleLoad=function(objRef){
    if(objRef.handleRequest==true)
    {
	  //if (!objRef.gmlTransform && XslProcessor) objRef.gmlTransform = new XslProcessor(objRef.gmlTransformUrl);
	  objRef.targetModel.doc = objRef.transform.transformNodeToObject(objRef.targetModel.doc);
	  
	  //next call we dont handle cause we called it
      objRef.handleRequest = false;
	  objRef.targetModel.callListeners("loadModel");
    }
    else
    {
      //next call we DO handle cause we didn't call it
      objRef.handleRequest=true;
    }
  }
 
  this.init = function(objRef) {
    if (objRef.targetModel) {
      objRef.targetModel.addListener("loadModel",objRef.handleLoad, objRef);
    }
  }
  
  this.model.addListener("init",this.init, this);
}
