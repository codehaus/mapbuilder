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
   */
  CatalogSearchForm.prototype.doSelect = function(widgetId, formId) {
    // Register for an event sent after the catalog query has finished
    if(!this.initialized){
      this.targetModel.addListener("loadModel",this.handleResponse,this);
      this.ebrim2Context=new XslProcessor(
        baseDir+"/tool/xsl/ebrim2Context.xsl");
      this.initialized=1;
    }
    // TBD: trigger a Catalog Search here. Look at InsertFeature for an
    // example of what is required.
    
    wrsQueryXML = this.buildQuery(formId);

    // POST the query to the WRS Service configured in config.xml (wrsUrl)
    this.httpPayload.postData= wrsQueryXML;
    this.targetModel.transactionType="insert";
    this.targetModel.newRequest(this.targetModel,this.httpPayload);

    // Load the new model
    this.targetModel.callListeners("loadModel");
  }

  /**
   * Build Query
   *  returns: WRS Query XML (string)
   * 
   */
  CatalogSearchForm.prototype.buildQuery = function(formId) {
    // Create main filter node and add search filter nodes as children
    // Currently implemented: 
    // * Keywords
    //
    // To do:
    // * Service Type
    // * Location
    //
    var filterNode = document.createElement("filter");


   /* Create keywordsNode that looks like this, based upon keywords field in form:
    *
    * <keywords>
    *   <keyword>alpha</keyword>
    *   <keyword>beta</keyword>
    *   <keyword>gamma</keyword>
    * </keywords>
    *
    */

    var keywordsArray;
    var keywordNode;
    var keywordValue;


    // Create keywords node
    var keywordsNode = document.createElement("keywords");

    // Get the reference to the form
    this.searchForm = document.getElementById(formId);

    // Extract the field 'keywords' from the form
    this.keywords = this.searchForm.keywords.value;

    // Cleanup: trim and remove duplicate spaces
    this.keywords = this.keywords.replace(/^\s+|\s+$/g, ''); //trim
    this.keywords = this.keywords.replace(/ +/g, ' '); //remove duplicate spaces

    // Only add keywords node if there are any keywords
    // TBD: make this smarter
    if (this.keywords.length > 0) {

      // Create an array by splitting the string (separator is a space)
      keywordsArray = this.keywords.split(' ');

      // Loop through array and create and attach child nodes to keywordsNode
      for(i=0; i< keywordsArray.length; i++) {
        //alert(keywordsArray[i]);
        keywordNode = document.createElement("keyword");
        keywordValue = document.createTextNode(keywordsArray[i]);
        keywordNode.appendChild(keywordValue);
        keywordsNode.appendChild(keywordNode);
      }


      // Attach keywords to the filter
      filterNode.appendChild(keywordsNode);

    }

    // Service Associtation
    filterNode.appendChild(createSimpleNode("serviceassociation", this.wrsServiceAssociation));

    // Service Type
    serviceType = this.searchForm.serviceType.value;
    if (!serviceType == "") {
      filterNode.appendChild(createSimpleNode("serviceType", serviceType));
    }

    // Load the XSL to generate the WRS Query
    this.wrsQuery=new XslProcessor(baseDir+"/tool/xsl/wrs_Query.xsl");
    
    // Add filter to XSL as a parameter
    this.wrsQuery.setParameter("filter", filterNode);

    // Do the actual XSL translation to generate the WRS Query
    var xmlRef = document.implementation.createDocument("", "", null);
    var wrsQueryXML = this.wrsQuery.transformNodeToString(xmlRef);

    return wrsQueryXML;
  }

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

/* Creates a simple node with a text value
 */
function createSimpleNode(nodeName, nodeText) {
  var simpleNode = document.createElement(nodeName);
  simpleNode.appendChild(document.createTextNode(nodeText));
  return simpleNode;
}


