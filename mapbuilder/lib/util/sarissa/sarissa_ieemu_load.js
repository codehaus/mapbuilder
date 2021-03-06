/**
 * ====================================================================
 * About
 * ====================================================================
 * Sarissa cross browser XML library - IE .load eulation (deprecated)
 * @version 0.9.7.6
 * @author: Manos Batsis, mailto: mbatsis at users full stop sourceforge full stop net
 *
 * This script emulates Internet Explorer's .load method of DOM Document objects. 
 *
 * All functionality in this file is DEPRECATED, XMLHttpRequest objects 
 * should be used to load XML documents instead 
 *
 * @version 0.9.7.6
 * @author: Manos Batsis, mailto: mbatsis at users full stop sourceforge full stop net
 * ====================================================================
 * Licence
 * ====================================================================
 * Sarissa is free software distributed under the GNU GPL version 2 (see <a href="gpl.txt">gpl.txt</a>) or higher, 
 * GNU LGPL version 2.1 (see <a href="lgpl.txt">lgpl.txt</a>) or higher and Apache Software License 2.0 or higher 
 * (see <a href="asl.txt">asl.txt</a>). This means you can choose one of the three and use that if you like. If 
 * you make modifications under the ASL, i would appreciate it if you submitted those.
 * In case your copy of Sarissa does not include the license texts, you may find
 * them online in various formats at <a href="http://www.gnu.org">http://www.gnu.org</a> and 
 * <a href="http://www.apache.org">http://www.apache.org</a>.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY 
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 * WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE 
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
if(!_SARISSA_IS_IE){
    if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
        /**
         * <p>Ensures the document was loaded correctly, otherwise sets the
         * parseError to -1 to indicate something went wrong. Internal use</p>
         * @private
         */
        Sarissa.__handleLoad__ = function(oDoc){
            Sarissa.__setReadyState__(oDoc, 4);
        };
        function SarissaParseError() {
            this.errorCode = 0;
        };
        /**
        * <p>Attached by an event handler to the load event. Internal use.</p>
        * @private
        */
        _sarissa_XMLDocument_onload = function(){
            Sarissa.__handleLoad__(this);
        };
        /**
         * <p>Sets the readyState property of the given DOM Document object.
         * Internal use.</p>
         * @private
         * @argument oDoc the DOM Document object to fire the
         *          readystatechange event
         * @argument iReadyState the number to change the readystate property to
         */
        Sarissa.__setReadyState__ = function(oDoc, iReadyState){
            oDoc.readyState = iReadyState;
            oDoc.readystate = iReadyState;
            if (oDoc.onreadystatechange != null && typeof oDoc.onreadystatechange == "function")
                oDoc.onreadystatechange();
        };
        Sarissa.getDomDocument = function(sUri, sName){
            
            var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
            if(!oDoc.onreadystatechange){
            
                /**
                * <p>Emulate IE's onreadystatechange attribute</p>
                */
                oDoc.onreadystatechange = null;
            };
            if(!oDoc.readyState){
                /**
                * <p>Emulates IE's readyState property, which always gives an integer from 0 to 4:</p>
                * <ul><li>1 == LOADING,</li>
                * <li>2 == LOADED,</li>
                * <li>3 == INTERACTIVE,</li>
                * <li>4 == COMPLETED</li></ul>
                */
                oDoc.readyState = 0;
            };
            if(!oDoc.parseError){
                oDoc.parseError = new SarissaParseError();
            };
            oDoc.addEventListener("load", _sarissa_XMLDocument_onload, false);
            return oDoc;
        };
        if(window.XMLDocument){
            /**
            * <p>Keeps a handle to the original load() method. Internal use and only
            * if Mozilla version is lower than 1.4</p>
            * @private
            */
            XMLDocument.prototype._sarissa_load = XMLDocument.prototype.load;
            // NOTE: setting async to false will only work with documents
            // called over HTTP (meaning a server), not the local file system,
            // unless you are using Moz 1.4+.
        
            /**
            * <p>This is deprecated, use XMLHttpRequest to load remote documents instead. 
            * Overrides the original load method to provide synchronous loading for
            * Mozilla versions prior to 1.4 and fix ready state stuff.</p>
            * @deprecated 
            * @returns the DOM Object as it was before the load() call (may be  empty)
            */
            XMLDocument.prototype.load = function(sURI) {
                var oDoc = Sarissa.getDomDocument();
                Sarissa.copyChildNodes(this, oDoc);
                this.parseError.errorCode = 0;
                Sarissa.__setReadyState__(this, 1);
                try {
                    if(this.async == false && _SARISSA_SYNC_NON_IMPLEMENTED) {
                        var tmp = new XMLHttpRequest();
                        tmp.open("GET", sURI, false);
                        tmp.send(null);
                        Sarissa.__setReadyState__(this, 2);
                        Sarissa.copyChildNodes(tmp.responseXML, this);
                        Sarissa.__setReadyState__(this, 3);
                    }else{
                        this._sarissa_load(sURI);
                    };
                }
                catch (objException) {
                        oDoc.parseError.errorCode = -1;
                }
                finally {
                    if (!oDoc.documentElement || oDoc.documentElement.tagName == "parsererror"){
                        oDoc.parseError.errorCode = -1;
                    };
                    if(this.async == false){
                        Sarissa.__handleLoad__(this);
                    };
                };
                return oDoc;
            };
        //if(window.XMLDocument) , now mainly for opera  
        }// TODO: check if the new document has content before trying to copynodes, check  for error handling in DOM 3 LS
        else if(document.implementation && document.implementation.hasFeature && document.implementation.hasFeature('LS', '3.0')){
            Document.prototype.async = true;
            Document.prototype.onreadystatechange = null;
            Document.prototype.load = function(sURI) {
                var oldDoc = Sarissa.getDomDocument();
                Sarissa.copyChildNodes(this, oldDoc, false);
                var parser = document.implementation.createLSParser(this.async ? document.implementation.MODE_ASYNCHRONOUS : document.implementation.MODE_SYNCHRONOUS, null);
                if(this.async){
                    var self = this;
                    parser.addEventListener("load", 
                        function(e) { 
                              self.readyState = 4;
                              Sarissa.copyChildNodes(e.newDocument, self, false);
                              self.onreadystatechange.call(); 
                        }, 
                        false); 
                };
                try {
                    var oDoc = parser.parseURI(sURI);
                    if(!this.async) {
                        Sarissa.copyChildNodes(oDoc, this, false);
                    };
                }
                catch(e){
                    this.parseError.errorCode = -1;
                };
                return oldDoc;
            };
            /**
            * <p>Factory method to obtain a new DOM Document object</p>
            * @argument sUri the namespace of the root node (if any)
            * @argument sUri the local name of the root node (if any)
            * @returns a new DOM Document
            */
            Sarissa.getDomDocument = function(sUri, sName){
                var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
                if(!oDoc.parseError){
                    oDoc.parseError = {errorCode:0};
                };
                return oDoc;
            };
        }
        else {
            Sarissa.getDomDocument = function(sUri, sName){
                var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
                // looks like safari does not create the root element for some unknown reason
                if(oDoc && (sUri || sName) && !oDoc.documentElement){
                    oDoc.appendChild(oDoc.createElementNS(sUri, sName));
                };
                // attachb to the new object as we have no prototype to use, this is for safari
                if(!oDoc.load) {
                        oDoc.load = function(sUrl) {
                            var oldDoc = document.implementation.createDocument();
                            Sarissa.copyChildNodes(this, oldDoc);
                            this.parseError = {errorCode : 0};
                            Sarissa.__setReadyState__(this, 1);
                            if(this.async == false) {
                                var tmp = new XMLHttpRequest();
                                tmp.open("GET", sUrl, false);
                                tmp.send(null);
                                Sarissa.__setReadyState__(this, 2);
                                Sarissa.copyChildNodes(tmp.responseXML, oDoc);
                                if(!oDoc.documentElement || oDoc.getElementsByTagName("parsererror").length >0){
                                    oDoc.parseError.errorCode = -1;
                                };
                                Sarissa.__setReadyState__(this, 3);
                                Sarissa.__setReadyState__(this, 4);
                            }
                            else {
                                var xmlhttp = new XMLHttpRequest();
                                xmlhttp.open('GET', sUrl, true);
                                xmlhttp.onreadystatechange = function(){
                                    if (xmlhttp.readyState == 4) {
                                        Sarissa.copyChildNodes(xmlhttp.responseXML, oDoc);
                                        if(!oDoc.documentElement || oDoc.getElementsByTagName("parsererror").length > 0){
                                            oDoc.parseError.errorCode = -1;
                                        };      
                                    };
                                Sarissa.__setReadyState__(oDoc, xmlhttp.readyState);
                                };
                                xmlhttp.send(null);
                            };
                            return oldDoc;
                        };
                };
                return oDoc;
            };
        };
    };//if(_SARISSA_HAS_DOM_CREATE_DOCUMENT)
};
//   EOF
