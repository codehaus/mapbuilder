/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/model/ModelBase.js");

/**
 * Records a log of events that occur over the course of mapbuilder execution
 * @constructor
 * @base ModelBase
 * @author Mike Adair
 * @param modelNode Pointer to the xml node for this model from the config file.
 * @param parent    The parent model for the object.
 */
function Logger(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  ModelBase.apply(this, new Array(modelNode, parent));
  this.namespace = "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'";

  //create a new document
  this.doc = Sarissa.getDomDocument("http://mapbuilder.sourceforge.net/mapbuilder","mb:Logger");//!no prefix on the URL
  Sarissa.setXpathNamespaces(this.doc, this.namespace);
  this.doc.async = false;
  this.doc.validateOnParse=false;  //IE6 SP2 parsing bug

  /**
   * appends a new entry in the log file
   * @param evenType    the name of the event that occured
   * @param listenerId  the ID of the listener object
   * @param targetId    the ID of the object passed to the listener function
   * @param paramValue  any parameter info supplied to the listener function
   */
  this.logEvent = function(eventType, listenerId, targetId, paramValue) {
    var eventLog = this.doc.createElement("event");
    eventLog.setAttribute("time", new Date().getTime());
    eventLog.setAttribute("listener", listenerId);
    eventLog.setAttribute("target", targetId);
    if (paramValue) eventLog.setAttribute("param", paramValue);
    eventLog.appendChild(this.doc.createTextNode(eventType));
    this.doc.documentElement.appendChild(eventLog);
  }

  /**
   * clears all entries in the log file
   */
  this.clearLog = function() {
    while (this.doc.documentElement.hasChildNodes() ) {
      this.doc.documentElement.removeChild(this.doc.documentElement.firstChild);
    }
    this.callListeners("refresh");
  }

  /**
   * save the log by http post to the serializeUrl URL provided
   */
  this.saveLog = function() {
    if (config.serializeUrl) {
      var tempDoc = postLoad(config.serializeUrl,logger.doc);
      if (!Sarissa._SARISSA_IS_SAFARI) {
        tempDoc.setProperty("SelectionLanguage", "XPath");
        Sarissa.setXpathNamespaces(tempDoc, "xmlns:xlink='http://www.w3.org/1999/xlink'");
      }
      var onlineResource = tempDoc.selectSingleNode("//OnlineResource");
      var fileUrl;
      if (_SARISSA_IS_OPERA) {
        fileUrl = onlineResource.getAttributeNS("http://www.w3.org/1999/xlink","href");
      } else {
        fileUrl = onlineResource.getAttribute("xlink:href");
      }
      alert(mbGetMessage("eventLogSaved", fileUrl));
    } else {
      alert(mbGetMessage("unableToSaveLog"));
    }
  }

  /**
   * save the log by http post to the serializeUrl URL provided
   */
  this.refreshLog = function(objRef) {
    objRef.callListeners("refresh");
  }

  if (parent) parent.addListener("refresh",this.refreshLog, this);
  window.onunload = this.saveLog;   //automatically save the log when the page unloads
  window.logger = this;             //global reference to the logger model
}
