/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Display a Catalog Search form.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function CatalogSearchForm(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.targetContext=widgetNode.selectSingleNode("mb:targetContext").firstChild.nodeValue;

  /**
   * Build and send a catalog query. The results will be inserted into the
   * targetModel which will trigger an event to handleResponse().
   */
  CatalogSearchForm.prototype.doSelect = function() {
    // Register for an event sent after the catalog query has finished
    if(!this.initialized){
      this.targetModel.addListener("loadModel",this.handleResponse,this);
      this.ebrim2Context=new XslProcessor(
        baseDir+"/tool/xsl/ebrim2Context.xsl");
      //this.targetContext2=window.config.objects[this.targetConext];
      this.targetContext2=window.config.objects["normalizedSearchResults"];
      this.initialized=1;
    }
    // TBD: trigger a Catalog Search here. Look at InsertFeature for an
    // example of what is required.
    this.targetModel.callListeners("loadModel");
  }

  /**
   * Convert the response of a Catalog Query into an OWSContext document
   * so that it can be processed.
   * Called after the response from a Catalog query has been received and 
   * populated in the targetModel.
   * @param objRef Pointer to widget object.
   */
  CatalogSearchForm.prototype.handleResponse = function(objRef) {
    var newContext=objRef.ebrim2Context.transformNodeToObject(objRef.targetModel.doc);
    objRef.targetContext2.doc=newContext;
    objRef.targetContext2.callListeners("loadModel");
//    window.config.objects[objRef.targetConext].doc=newContext;
//    window.config.objects[objRef.targetConext].callListeners("loadModel");

//    window.config.objects[objRef.targetConext].setModel(
//      window.config.objects[objRef.targetConext],
//      newContext);
  }
}
