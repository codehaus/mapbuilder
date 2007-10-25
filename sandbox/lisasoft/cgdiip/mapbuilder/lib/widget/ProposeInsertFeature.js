/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ProposeInsertFeature.js 3172 2007-08-28 06:33:50Z mvivian $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");

/**
 * When this button is pressed a WFS-T InsertFeature transaction will be started.
 * @constructor
 * @base ButtonBase
 * @author Cameron Shorter
 * @param widgetNode The widget node from the Config XML file.
 * @param model The model for this widget
 */
function ProposeInsertFeature(widgetNode, model) {

  // override default cursor by user
  // cursor can be changed by spefying a new cursor in config file
  this.cursor = "default"; 

  // Extend ButtonBase
  ButtonBase.apply(this, new Array(widgetNode, model));

  this.trm=widgetNode.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
  this.tm=widgetNode.selectSingleNode("mb:targetModel").firstChild.nodeValue;
  this.tc=widgetNode.selectSingleNode("mb:targetContext").firstChild.nodeValue;

  this.httpPayload=new Object();
  this.httpPayload.url=widgetNode.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
  this.httpPayload.method="post";

  /** Xsl to convert Feature into a WFS Transaction Insert. */
  this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert_atom.xsl");
  
  this.cdataElementXsl=new XslProcessor(baseDir+"/tool/xsl/cdata_element.xsl");

  /** creates the OL control for this button */
  this.createControl = function(objRef) {
    var Control = OpenLayers.Class(OpenLayers.Control, {
      CLASS_NAME: 'mbInsertFeature',
      type: OpenLayers.Control.TYPE_BUTTON
    });
    return Control;
  }

  /**
   * Start a WFS-T InsertFeature transaction.
   * @param objRef Pointer to this object.
   */
  this.doSelect = function(objRef, selected) {
    if (selected){
      // Model that will be populated with the WFS response.
      if (!objRef.transactionResponseModel){
        objRef.transactionResponseModel=window.config.objects[objRef.trm];
        objRef.transactionResponseModel.addListener("loadModel",objRef.handleResponse, objRef);
      }
      if (!objRef.targetModel){
        objRef.targetModel=window.config.objects[objRef.tm];
      }
      if (!objRef.targetContext){
        objRef.targetContext=window.config.objects[objRef.tc];
      }
      fid=objRef.targetModel.getXpathValue(objRef.targetModel,"//@fid",!IS_IE);
      if (objRef.targetModel.doc){

        //if fid exists, then we are modifying an existing feature,
        // otherwise we are adding a new feature
        
        if(fid){
          objRef.targetModel.setXpathAttribute(objRef.targetModel,"//category[@scheme='http://www.geobase.ca/scheme/action']","term","Update",null,!IS_IE);
        }else{
          objRef.targetModel.setXpathAttribute(objRef.targetModel,"//category[@scheme='http://www.geobase.ca/scheme/action']","term","Insert",null,!IS_IE);
        }
        
        var date = new Date();
        var id = window.location.hostname + date.getTime();
        objRef.targetModel.setXpathValue(objRef.targetModel,"//entry/id",id,null,!IS_IE);
        
        
        point = objRef.getFirstPoint(objRef.targetModel);
        objRef.targetModel.setXpathValue(objRef.targetModel,"//georss:where/gml:Point/gml:pos",point,null,!IS_IE);
        
        objRef.targetModel.setXpathValue(objRef.targetModel,"//entry/updated",objRef.getISO8601Time(),null,!IS_IE);
        content = objRef.targetModel.getXpathValue(objRef.targetModel,"//entry/def:content",!IS_IE);
        if(!content)
        {
        	objRef.targetModel.setXpathValue(objRef.targetModel,"//entry/content","n/a",null,!IS_IE);
        }
	    
	    s = objRef.targetModel.doc;
        //s=objRef.cdataElementXsl.transformNodeToObject(s);
        
        //mvivian: Will always be inserting proposed changes
        s=objRef.insertXsl.transformNodeToObject(s);
        
        //uncomment to see the XML
        //prompt("Heres the XML for the transaction",(new XMLSerializer()).serializeToString(s));  //This is For testing
        
        objRef.httpPayload.postData=s;
        objRef.transactionResponseModel.transactionType="insert";
        objRef.transactionResponseModel.newRequest(objRef.transactionResponseModel,objRef.httpPayload);
      }else alert(mbGetMessage("noFeatureToInsert"));
    }
  }
  
  this.getBounds = function(targetModel)
  {
    var nodes = targetModel.doc.selectNodes("//georss:featureOfInterest//gml:coordinates");
    var maxX;
    var maxY;
    var minX;
    var minY;
    
    invalidCoord=false;
    for(var n=0;n<nodes.length;n++)
    {
      coords = nodes[n].firstChild.nodeValue.trim().split(" ");
      for (var c=0;c<coords.length;c++)
      {
        if(coords[c]!= "") 
          coord = coords[c].split(",");
        if(coord.length == 2)
        {
          maxX = maxX ? Math.max(maxX, parseFloat(coord[0])) : parseFloat(coord[0]);
          maxY = maxY ? Math.max(maxY, parseFloat(coord[1])) : parseFloat(coord[1]);
          minX = minX ? Math.min(minX, parseFloat(coord[0])) : parseFloat(coord[0]);
          minY = minY ? Math.min(minY, parseFloat(coord[1])) : parseFloat(coord[1]);
        }
        else
        {
          invalidCoord = true;
        }
      }
    }
    
    if(invalidCoord)
    {
      alert("invalid coordinate found, but transaction will procceed")
    }
        
    return (minX + "," + minY + " " + minX + "," + maxY + " " + maxX + "," + maxY + " " + maxX + "," + minY + " " + minX + "," + minY);
  }
  
  this.getFirstPoint = function(targetModel)
  {
    var nodes = targetModel.doc.selectNodes("//georss:featureOfInterest//gml:coordinates");
    
    invalidCoord=false;
    for(var n=0;n<nodes.length;n++)
    {
      coords = nodes[n].firstChild.nodeValue.trim().split(" ");
      if(coords.length >= 0 && coords[0]!= "")
      {
        result = coords[0].replace(",", " ");
      }
      else
      {
        invalidCoord = true;
      }
    }
    
    if(invalidCoord)
    {
      alert("invalid coordinate found, but transaction will procceed")
    }
        
    return (result);
  }

  /**
   * If transaction was sucessful, refresh the map and remove contents of
   * FeatureList.  This function is called after the TransactionResponseModel
   * has been updated.
   * @param objRef Pointer to this object.
   */
  this.handleResponse=function(objRef){
    if (objRef.transactionResponseModel.transactionType=="insert") {
      success=objRef.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
      if (success){
        // Remove FeatureList
        objRef.targetModel.setModel(objRef.targetModel,null);

        // Repaint GmlRenderers
        objRef.targetModel.callListeners("refreshGmlRenderers");

        // Repaint the WMS layers
        objRef.targetContext.callListeners("refreshWmsLayers");
      }
    }
  }
  
  this.getISO8601Time=function() {
	var today = new Date();
	var year = today.getYear();
	if (year < 2000) // Y2K Fix, Isaac Powell
	year = year + 1900; // http://onyx.idbsu.edu/~ipowell
	var month = today.getMonth() + 1;
	var day = today.getDate();
	var hour = today.getHours();
	var hourUTC = today.getUTCHours();
	var diff = hour - hourUTC;
	var hourdifference = Math.abs(diff);
	var minute = today.getMinutes();
	var minuteUTC = today.getUTCMinutes();
	var minutedifference;
	var second = today.getSeconds();
	var timezone;
	if (minute != minuteUTC && minuteUTC < 30 && diff < 0) { hourdifference--; }
	if (minute != minuteUTC && minuteUTC > 30 && diff > 0) { hourdifference--; }
	if (minute != minuteUTC) {
		minutedifference = ":30";
	}
	else {
		minutedifference = ":00";
	}
	if (hourdifference < 10) {
		timezone = "0" + hourdifference + minutedifference;
	}
	else {
		timezone = "" + hourdifference + minutedifference;
	}
	if (diff < 0) {
		timezone = "-" + timezone;
	}
	else {
		timezone = "+" + timezone;
	}
	if (month <= 9) month = "0" + month;
	if (day <= 9) day = "0" + day;
	if (hour <= 9) hour = "0" + hour;
	if (minute <= 9) minute = "0" + minute;
	if (second <= 9) second = "0" + second; 
	time = year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + timezone;
	return time;
  }
}
