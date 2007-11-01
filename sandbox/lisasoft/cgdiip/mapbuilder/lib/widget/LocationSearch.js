/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: $
*/

// Ensure this object's dependencies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

// For customised searching/loading indication
httpStatusMsg = ['uninitialized','searching','loaded','building results list','completed'];

/**
 * Display a WFS Search form.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function LocationSearch(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.wfsUrl = widgetNode.selectSingleNode("mb:wfsUrl").firstChild.nodeValue;

  this.httpPayload = new Object();
  this.httpPayload.url = this.wfsUrl;
  this.httpPayload.method = "post";
  
  //get bbox inforamtion from a map model
  var mapModel = widgetNode.selectSingleNode("mb:mapModel");
  if ( mapModel ) {
    this.mapModel = mapModel.firstChild.nodeValue;
  } else {
    this.mapModel = model.id;
  }

  /**
   * Build and send a WFS query. The results will be inserted into the
   * targetModel which will trigger an event to handleResponse().
   * 
   * @return none 
   */
  LocationSearch.prototype.search = function() {
    // Register for an event sent after the WFS query has finished

    //if(!this.initialized){
      //this.targetModel.addListener("loadModel",this.handleResponse,this);
   //   this.ebrim2Context=new XslProcessor(baseDir+"/tool/xsl/ebrim2Context.xsl");
      //this.initialized=1;
    //}
    
    // call buildQuery method to read form values, put them into the model
    // and perform an XSL translation to get the WRS Query
    wfsQueryXML = this.buildQuery();
    
    // POST the query to the WRS Service configured in config.xml (wrsUrl)
    this.httpPayload.postData= wfsQueryXML;
    this.targetModel.transactionType="insert";
    this.targetModel.newRequest(this.targetModel,this.httpPayload);
    
    // Load the new model
    // Disabled, otherwise the loading indicator doesn't work
    //this.targetModel.callListeners("loadModel");
    
    // Activate the loading indicator
    this.targetModel.callListeners("refresh");

  }

  /**
   * Builds WRS WFS query 
   * returns: WRS Query XML (string)
   * 
   * @return wrsQueryXML A textual representation of the WRS Query XML
   */
  LocationSearch.prototype.buildQuery = function() {
    // Get the reference to the form
    this.form = document.getElementById(this.formName);
         
    // Fill the model with the values needed for building the query
    // TBD: This is not a correct way to address the model, since the form values will disappear when
    //      the model changes. View needs to correspond to the model.

    // added empty string '' to prevent IE from crashing on empty/null values
    this.model.setXpathValue(this.model, "//ogc:Literal", this.form.placename.value + '', false);

    // Do the actual XSL translation to generate the WRS Query
    var wfsQueryXML = (new XMLSerializer()).serializeToString(this.model.doc);
    return wfsQueryXML;

  }

  //set some properties for the form output
  this.formName = "WebServiceForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);
}
