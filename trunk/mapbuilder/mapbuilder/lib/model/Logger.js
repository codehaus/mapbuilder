/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Records a log of events that occur over the course of mapbuilder execution
 * @constructor
 * @base ModelBase
 * @author Mike Adair
 * @param url Url of context collection document
 */
function Logger(modelNode, parent) {
  // Inherit the ModelBase functions and parameters
  var modelBase = new ModelBase(this, modelNode, parent);

  this.doc = Sarissa.getDomDocument("http://mapbuilder.sourceforge.net/mapbuilder","mb:Logger");
  Sarissa.setXpathNamespaces(this.doc, "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'");
  this.doc.async = false;
  this.doc.validateOnParse=false;  //IE6 SP2 parsing bug

  //set the URL to post this data for saving
  var serializeUrl = modelNode.selectSingleNode("mb:serializeUrl");
  if (serializeUrl) this.serializeUrl = serializeUrl.firstChild.nodeValue;

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
    if (logger.serializeUrl) {
      var tempDoc = postLoad(logger.serializeUrl,logger.doc);
      tempDoc.setProperty("SelectionLanguage", "XPath");
      Sarissa.setXpathNamespaces(tempDoc, "xmlns:xlink='http://www.w3.org/1999/xlink'");
      var onlineResource = tempDoc.selectSingleNode("//OnlineResource");
      var fileUrl = onlineResource.attributes.getNamedItem("xlink:href").nodeValue;
      alert("event log saved as:" + fileUrl);
    } else {
      alert("unable to save event log; provide a serializeUrl property on the logger model");
    }
  }

  /**
   * save the log by http post to the serializeUrl URL provided
   */
  this.refreshLog = function(objRef) {
    objRef.callListeners("refresh");
  }

  //
  if (parent) {
    this.parentModel = parent;
    parent["logger"] = this;
    parent.addListener("refresh",this.refreshLog, this);
  }

  window.onunload = this.saveLog;   //automatically save the log when the page unloads
  window.logger = this;             //global reference to the logger model
}
