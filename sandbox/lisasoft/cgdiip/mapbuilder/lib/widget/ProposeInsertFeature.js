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
  this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert.xsl");
  
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
      fid=objRef.targetModel.getXpathValue(objRef.targetModel,"//@fid");
      if (objRef.targetModel.doc){

        //if fid exists, then we are modifying an existing feature,
        // otherwise we are adding a new feature
        if(fid){
          //objRef.targetModel.setXpathValue(objRef.targetModel,"//category[@scheme='http://www.geobase.ca/scheme/action']@term","Update");
        }else{
          //objRef.targetModel.setXpathValue(objRef.targetModel,"//category[@scheme='http://www.geobase.ca/scheme/action']@term","Insert");
        }
        
       
        point = objRef.getFirstPoint(objRef.targetModel);
        objRef.targetModel.setXpathValue(objRef.targetModel,"//georss:where/gml:Point/gml:pos",point);
	    
	    s = objRef.targetModel.doc;
        //s=objRef.cdataElementXsl.transformNodeToObject(s);
        
        //mvivian: Will always be inserting proposed changes
        s=objRef.insertXsl.transformNodeToObject(s);
        
        
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
        result = coords[0];
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
}
