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

  this.targetContext = widgetNode.selectSingleNode("mb:targetContext").firstChild.nodeValue;
  this.wrsUrl        = widgetNode.selectSingleNode("mb:wrsUrl").firstChild.nodeValue;
  this.wrsServiceAssociation = "OperatesOn";

  this.httpPayload = new Object();
  this.httpPayload.url = this.wrsUrl;
  this.httpPayload.method = "post";

  /**
   * Build and send a catalog query. The results will be inserted into the
   * targetModel which will trigger an event to handleResponse().
   * 
   * @param formId       Id of Form 
   * @return none 
   */

  CatalogSearchForm.prototype.doSelect = function(formId) {
    // Register for an event sent after the catalog query has finished
    if(!this.initialized){
      this.targetModel.addListener("loadModel",this.handleResponse,this);
      this.ebrim2Context=new XslProcessor(baseDir+"/tool/xsl/ebrim2Context.xsl");
      this.initialized=1;
    }
    
    // call buildQuery method to read form values, put them into the model
    // and perform an XSL translation to get the WRS Query
    wrsQueryXML = this.buildQuery(formId);

    // POST the query to the WRS Service configured in config.xml (wrsUrl)
    this.httpPayload.postData= wrsQueryXML;
    this.targetModel.transactionType="insert";
    this.targetModel.newRequest(this.targetModel,this.httpPayload);

    // Load the new model
    this.targetModel.callListeners("loadModel");
  }

  /**
   * Builds WRS Catalog query 
   * returns: WRS Query XML (string)
   * 
   * @param formId       Id of Form 
   * @return wrsQueryXML A textual representation of the WRS Query XML
   */
  CatalogSearchForm.prototype.buildQuery = function(formId) {
    
    // Get the reference to the form
    this.searchForm = document.getElementById(formId);
         
    // Fill the model with the values needed for building the query
    // TBD: This is not a correct way to address the model, since the form values will disappear when
    //      the model changes. View needs to correspond to the model.
    this.model.setXpathValue(this.model, "/filter/keywords", this.searchForm.keywords.value, false);
    this.model.setXpathValue(this.model, "/filter/servicetype", this.searchForm.serviceType.value, false);
    this.model.setXpathValue(this.model, "/filter/serviceassociation", this.wrsServiceAssociation, false);

    // Load the XSL to generate the WRS Query
    this.wrsQuery=new XslProcessor(baseDir+"/tool/xsl/wrs_Query.xsl");
    
    // Add filter to XSL as a parameter
    this.wrsQuery.setParameter("filter", this.model.doc);

    // Do the actual XSL translation to generate the WRS Query
    var wrsQueryXML = this.wrsQuery.transformNodeToString(this.model.doc);

    return wrsQueryXML;

  }

  /**
   * For Debugging purposes only
   * Responds to 'Show Query' button and will generate WRS Query and show it on
   * the screen, without submitting it
   * 
   * @param formId       Id of Form 
   * @return none
   */
  CatalogSearchForm.prototype.debugQuery = function(formId){
    s = this.buildQuery(formId);
    s=
      "<html><title>"
      +"WRS Query"
      +"</title><body>"
      +Sarissa.escape(s)
      +"</body></html>"
    // Insert break after each tag
    s=s.replace(/&gt;/g, "&gt;<br/>")
    //var popup=window.open("test");
    //popup.document.write(s);
    debugwindow = document.getElementById('debugwindow');
    debugwindow.innerHTML= s;

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

    window.config.objects[objRef.targetContext].setModel(
      window.config.objects[objRef.targetContext],
      newContext);
  }
}


