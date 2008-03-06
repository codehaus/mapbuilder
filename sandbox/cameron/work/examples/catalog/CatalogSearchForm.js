/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: $
*/

// Ensure this object's dependencies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

// For customised searching/loading indication
httpStatusMsg = ['uninitialized','searching','loaded','building results list','completed'];

/**
 * Display a Catalog Search form.
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function CatalogSearchForm(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.targetContext         = widgetNode.selectSingleNode("mb:targetContext").firstChild.nodeValue;
  this.wrsUrl                = widgetNode.selectSingleNode("mb:wrsUrl").firstChild.nodeValue;
  this.wrsServiceAssociation = widgetNode.selectSingleNode("mb:wrsServiceAssociation").firstChild.nodeValue;

  this.httpPayload = new Object();
  this.httpPayload.url = this.wrsUrl;
  this.httpPayload.method = "post";
  
  //get bbox inforamtion from a map model
  var mapModel = widgetNode.selectSingleNode("mb:mapModel");
  if ( mapModel ) {
    this.mapModel = mapModel.firstChild.nodeValue;
  } else {
    this.mapModel = model.id;
  }


  /**
   * Refreshes the form onblur handlers when this widget is painted.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.postPaint = function() {
    config.objects[this.mapModel].addListener('aoi', this.displayAoiCoords, this);

    this.searchForm = document.getElementById(this.formName);
    this.searchForm.parentWidget = this;
/*

    this.searchForm.westCoord.onblur = function() {alert(config.objects[this.model])};
    this.searchForm.northCoord.onblur = this.setAoi;
    this.searchForm.eastCoord.onblur = this.setAoi;
    this.searchForm.southCoord.onblur = this.setAoi;
*/
    this.searchForm.westCoord.model = this.model;
    this.searchForm.northCoord.model = this.model;
    this.searchForm.eastCoord.model = this.model;
    this.searchForm.southCoord.model = this.model;
    this.searchForm.onkeypress = this.handleKeyPress;
    //this.searchForm.onsubmit = this.submitForm;
    //this.searchForm.mapsheet.onblur = this.setMapsheet;

  }

  /**
   * Output the AOI coordinates to the associated form input elements.  This
   * method is registered as an AOI listener on the context doc.
   * @param objRef Pointer to this searchForm object.
   */
    CatalogSearchForm.prototype.displayAoiCoords = function(objRef) {
    //objRef.searchForm = document.getElementById(this.formName);
    var aoi = config.objects[objRef.mapModel].getParam("aoi");
    objRef.searchForm.westCoord.value = aoi[0][0];
    objRef.searchForm.northCoord.value = aoi[0][1];
    objRef.searchForm.eastCoord.value = aoi[1][0];
    objRef.searchForm.southCoord.value = aoi[1][1];

  }

  /**
   * Handles user input from the form element.  This is an onblur handler for 
   * the input elements.
   */
  CatalogSearchForm.prototype.setAoi = function() {
    var aoi = config.objects[this.mapModel].getParam("aoi");
    if (aoi) {
      var ul = aoi[0];
      var lr = aoi[1];
      switch(this.name) {
        case 'westCoord':
          ul[0] = this.value;
          break;
        case 'northCoord':
          ul[1] = this.value;
          break;
        case 'eastCoord':
          lr[0] = this.value;
          break;
        case 'southCoord':
          lr[1] = this.value;
          break;
      }
      config.objects[this.mapModel].setParam("aoi",new Array(ul,lr) );
    }
  }

/**
 * Change the AOI coordinates from select box choice of prefined locations
 * @param bbox the bbox value of the location keyword chosen
 */
  CatalogSearchForm.prototype.setLocation = function(bbox) {
    var bboxArray = new Array();
    bboxArray     = bbox.split(",");
    var ul = new Array(parseFloat(bboxArray[0]),parseFloat(bboxArray[2]));
    var lr = new Array(parseFloat(bboxArray[1]),parseFloat(bboxArray[3]));
    config.objects[this.mapModel].setParam("aoi",new Array(ul,lr));

    //convert this.model XY to latlong
    //convert latlong to targetmodel XY
    //extent.setAoi takes XY as input
    //this.targetModel.setParam("aoi", new Array(ul,lr));
    //this.targetModel.setParam("mouseup",this);
  }


  /**
   * Build and send a catalog query. The results will be inserted into the
   * targetModel which will trigger an event to handleResponse().
   * 
   * @return none 
   */

  CatalogSearchForm.prototype.doSelect = function() {
    // Register for an event sent after the catalog query has finished

    if(!this.initialized){
      this.targetModel.addListener("loadModel",this.handleResponse,this);
      //this.ebrim2Context=new XslProcessor(baseDir+"/tool/xsl/ebrim2Context.xsl");
      this.ebrim2Context=new XslProcessor("ebrim2Context.xsl");
      this.initialized=1;
    }
    
    // call buildQuery method to read form values, put them into the model
    // and perform an XSL translation to get the WRS Query
    wrsQueryXML = this.buildQuery();
    
    // POST the query to the WRS Service configured in config.xml (wrsUrl)
    this.httpPayload.postData= wrsQueryXML;
    this.targetModel.transactionType="insert";
    this.targetModel.newRequest(this.targetModel,this.httpPayload);
    
    // Load the new model
    // Disabled, otherwise the loading indicator doesn't work
    //this.targetModel.callListeners("loadModel");
    
    // Activate the loading indicator
    this.targetModel.callListeners("refresh");

  }

  /**
   * Builds WRS Catalog query 
   * returns: WRS Query XML (string)
   * 
   * @return wrsQueryXML A textual representation of the WRS Query XML
   */
  CatalogSearchForm.prototype.buildQuery = function() {
    // Get the reference to the form
    this.searchForm = document.getElementById(this.formName);
         
    // Fill the model with the values needed for building the query
    // TBD: This is not a correct way to address the model, since the form values will disappear when
    //      the model changes. View needs to correspond to the model.

    // added empty string '' to prevent IE from crashing on empty/null values
    this.model.setXpathValue(this.model, "/filter/keywords", this.searchForm.keywords.value + '', false);
    this.model.setXpathValue(this.model, "/filter/servicetype", this.searchForm.serviceType.value + '', false);
    this.model.setXpathValue(this.model, "/filter/serviceassociation", this.wrsServiceAssociation + '', false);

	  // determine the BBox
    var aoi = config.objects[this.mapModel].getParam("aoi");
    var bboxStr = "";
    if (aoi) {
      // a bbox was set in the map pane
      bboxStr = aoi[0][0]+","+aoi[1][1]+" "+aoi[1][0]+","+aoi[0][1];
    } else {
      // no bbox was set, use the bbox of the map model
      var bbox = config.objects[this.mapModel].getBoundingBox();
      bboxStr = bbox[0]+","+bbox[1]+" "+bbox[2]+","+bbox[3];
    }

    // Add location based filter (BBOX)
    // TBD: uncomment this line below when WRS filtering works OK
    //this.model.setXpathValue(this.model, "/filter/location", bboxStr, false);

    // Load the XSL to generate the WRS Query
    //this.wrsQuery=new XslProcessor(baseDir+"/tool/xsl/wrs_Query.xsl");
    this.wrsQuery=new XslProcessor("wrs_Query.xsl");
    
    // Add filter to XSL as a parameter
    this.wrsQuery.setParameter("filter", this.model.doc);

    // Do the actual XSL translation to generate the WRS Query
    var wrsQueryXML = this.wrsQuery.transformNodeToString(this.model.doc);
    return wrsQueryXML;

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

  //set some properties for the form output
  this.formName = "WebServiceForm_" + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);
}
