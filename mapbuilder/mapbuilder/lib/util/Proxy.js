/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

/**
 * Functions to interface with a proxy.  A proxy is required to avoid javascript
 * security problems which prevent queries being sent directly to an external host.
 * Instead queries are sent to the local server, then forwarded onto the external
 * server.
 * @constructor
 * @author Cameron Shorter
 * @param configModel XML from the Configuration file.
 */
function Proxy(configModel) {
  /** Url of proxy. */
  proxyNode=configModel.doc.getElementsByTagName("proxyUrl").item(0);
  if (proxyNode) this.proxy=proxyNode.firstChild.nodeValue;

  /**
   * Return URL of proxy?url=url or null if proxy not defined in config.
   * @param url Url of the service to access.
   * @return Url of the proxy and service in the form http://host/proxy?url=service
   */
  this.getUrl=function(url) {
    if (this.proxy) {
      url=this.proxy+escape(url).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27');
    } else {
      alert("proxyUrl not defined in the configuration file");
      url=null;
    }
    return url;
  }
}
