/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Records a log of events that occur over the course of mapbuilder execution
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

  this.logEvent = function(eventType, listenerId, targetId, paramValue) {
    var eventLog = this.doc.createElement("event");
    eventLog.setAttribute("time", new Date().getTime());
    eventLog.setAttribute("listener", listenerId);
    eventLog.setAttribute("target", targetId);
    if (paramValue) eventLog.setAttribute("param", paramValue);
    eventLog.appendChild(this.doc.createTextNode(eventType));
    this.doc.documentElement.appendChild(eventLog);
  }

  this.saveLog = function() {
    var tempDoc = postLoad("/mapbuilder/writeXml",logger.doc);
  }
  window.onunload = this.saveLog;
  window.logger = this;
  this.callListeners("loadModel");
}
