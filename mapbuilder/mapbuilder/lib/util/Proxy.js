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
 */
function Proxy() {
  /** Url of proxy, TBD: extract this from config file. */
  this.proxy="../server/proxy/proxy.php?url=";

  /**
   * @param url Url of the service to access.
   * @return Url of the proxy and service in the form http://host/proxy?url=service
   */
  this.getUrl=function(url) {
    // Convert URL to a form that can be passed as a URL parameter
    url=escape(url).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27');
    return this.proxy+url;
  }
}
