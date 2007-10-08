/*
  proj4js.js -- Javascript reprojection library. 
  
  Author:       Mike Adair madairATdmsolutions.ca
                Richard Greenwood rich@greenwoodmap.com
  License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html 
                Note: This program is an almost direct port of the C library
                Proj4.
*/
OpenLayers={};OpenLayers.Util={};OpenLayers.Util.getElement=function(){var elements=[];for(var i=0;i<arguments.length;i++){var element=arguments[i];if(typeof element=='string'){element=document.getElementById(element);}
if(arguments.length==1){return element;}
elements.push(element);}
return elements;};if($==null){var $=OpenLayers.Util.getElement;}
OpenLayers.Util.extend=function(destination,source){if(destination&&source){for(var property in source){destination[property]=source[property];}
if(source.hasOwnProperty&&source.hasOwnProperty('toString')){destination.toString=source.toString;}}
return destination;};OpenLayers.Util.removeItem=function(array,item){for(var i=0;i<array.length;i++){if(array[i]==item){array.splice(i,1);}}
return array;};OpenLayers.Util.clearArray=function(array){var msg="OpenLayers.Util.clearArray() is Deprecated."+" Please use 'array.length = 0' instead.";OpenLayers.Console.warn(msg);array.length=0;};OpenLayers.Util.indexOf=function(array,obj){for(var i=0;i<array.length;i++){if(array[i]==obj)return i;}
return-1;};OpenLayers.Util.modifyDOMElement=function(element,id,px,sz,position,border,overflow,opacity){if(id){element.id=id;}
if(px){element.style.left=px.x+"px";element.style.top=px.y+"px";}
if(sz){element.style.width=sz.w+"px";element.style.height=sz.h+"px";}
if(position){element.style.position=position;}
if(border){element.style.border=border;}
if(overflow){element.style.overflow=overflow;}
if(opacity){element.style.opacity=opacity;element.style.filter='alpha(opacity='+(opacity*100)+')';}};OpenLayers.Util.createDiv=function(id,px,sz,imgURL,position,border,overflow,opacity){var dom=document.createElement('div');if(imgURL){dom.style.backgroundImage='url('+imgURL+')';}
if(!id){id=OpenLayers.Util.createUniqueID("OpenLayersDiv");}
if(!position){position="absolute";}
OpenLayers.Util.modifyDOMElement(dom,id,px,sz,position,border,overflow,opacity);return dom;};OpenLayers.Util.createImage=function(id,px,sz,imgURL,position,border,opacity,delayDisplay){var image=document.createElement("img");if(!id){id=OpenLayers.Util.createUniqueID("OpenLayersDiv");}
if(!position){position="relative";}
OpenLayers.Util.modifyDOMElement(image,id,px,sz,position,border,null,opacity);if(delayDisplay){image.style.display="none";OpenLayers.Event.observe(image,"load",OpenLayers.Util.onImageLoad.bind(image));OpenLayers.Event.observe(image,"error",OpenLayers.Util.onImageLoadError.bind(image));}
image.style.alt=id;image.galleryImg="no";if(imgURL){image.src=imgURL;}
return image;};OpenLayers.Util.setOpacity=function(element,opacity){OpenLayers.Util.modifyDOMElement(element,null,null,null,null,null,null,opacity);}
OpenLayers.Util.onImageLoad=function(){if(!this.viewRequestID||(this.map&&this.viewRequestID==this.map.viewRequestID)){this.style.backgroundColor=null;this.style.display="";}};OpenLayers.Util.onImageLoadErrorColor="pink";OpenLayers.IMAGE_RELOAD_ATTEMPTS=0;OpenLayers.Util.onImageLoadError=function(){this._attempts=(this._attempts)?(this._attempts+1):1;if(this._attempts<=OpenLayers.IMAGE_RELOAD_ATTEMPTS){this.src=this.src;}else{this.style.backgroundColor=OpenLayers.Util.onImageLoadErrorColor;}
this.style.display="";};OpenLayers.Util.alphaHack=function(){var arVersion=navigator.appVersion.split("MSIE");var version=parseFloat(arVersion[1]);var filter=false;try{filter=document.body.filters;}catch(e){}
return(filter&&(version>=5.5)&&(version<7));}
OpenLayers.Util.modifyAlphaImageDiv=function(div,id,px,sz,imgURL,position,border,sizing,opacity){OpenLayers.Util.modifyDOMElement(div,id,px,sz);var img=div.childNodes[0];if(imgURL){img.src=imgURL;}
OpenLayers.Util.modifyDOMElement(img,div.id+"_innerImage",null,sz,"relative",border);if(opacity){div.style.opacity=opacity;div.style.filter='alpha(opacity='+(opacity*100)+')';}
if(OpenLayers.Util.alphaHack()){div.style.display="inline-block";if(sizing==null){sizing="scale";}
div.style.filter="progid:DXImageTransform.Microsoft"+".AlphaImageLoader(src='"+img.src+"', "+"sizingMethod='"+sizing+"')";if(div.style.opacity){div.style.filter+=" alpha(opacity="+div.style.opacity*100+")";}
img.style.filter="progid:DXImageTransform.Microsoft"+".Alpha(opacity=0)";}};OpenLayers.Util.createAlphaImageDiv=function(id,px,sz,imgURL,position,border,sizing,opacity,delayDisplay){var div=OpenLayers.Util.createDiv();var img=OpenLayers.Util.createImage(null,null,null,null,null,null,null,false);div.appendChild(img);if(delayDisplay){img.style.display="none";OpenLayers.Event.observe(img,"load",OpenLayers.Util.onImageLoad.bind(div));OpenLayers.Event.observe(img,"error",OpenLayers.Util.onImageLoadError.bind(div));}
OpenLayers.Util.modifyAlphaImageDiv(div,id,px,sz,imgURL,position,border,sizing,opacity);return div;};OpenLayers.Util.upperCaseObject=function(object){var uObject={};for(var key in object){uObject[key.toUpperCase()]=object[key];}
return uObject;};OpenLayers.Util.applyDefaults=function(to,from){for(var key in from){if(to[key]==null){to[key]=from[key];}}};OpenLayers.Util.getParameterString=function(params){paramsArray=[];for(var key in params){var value=params[key];if((value!=null)&&(typeof value!='function')){var encodedValue;if(typeof value=='object'&&value.constructor==Array){var encodedItemArray=[];for(var itemIndex=0;itemIndex<value.length;itemIndex++){encodedItemArray.push(encodeURIComponent(value[itemIndex]));}
encodedValue=encodedItemArray.join(",");}
else{encodedValue=encodeURIComponent(value);}
paramsArray.push(encodeURIComponent(key)+"="+encodedValue);}}
return paramsArray.join("&");};OpenLayers.ImgPath='';OpenLayers.Util.getImagesLocation=function(){return OpenLayers.ImgPath||(OpenLayers._getScriptLocation()+"img/");};OpenLayers.Util.Try=function(){var returnValue=null;for(var i=0;i<arguments.length;i++){var lambda=arguments[i];try{returnValue=lambda();break;}catch(e){}}
return returnValue;}
OpenLayers.Util.getNodes=function(p,tagName){var nodes=OpenLayers.Util.Try(function(){return OpenLayers.Util._getNodes(p.documentElement.childNodes,tagName);},function(){return OpenLayers.Util._getNodes(p.childNodes,tagName);});return nodes;};OpenLayers.Util._getNodes=function(nodes,tagName){var retArray=[];for(var i=0;i<nodes.length;i++){if(nodes[i].nodeName==tagName){retArray.push(nodes[i]);}}
return retArray;};OpenLayers.Util.getTagText=function(parent,item,index){var result=OpenLayers.Util.getNodes(parent,item);if(result&&(result.length>0))
{if(!index){index=0;}
if(result[index].childNodes.length>1){return result.childNodes[1].nodeValue;}
else if(result[index].childNodes.length==1){return result[index].firstChild.nodeValue;}}else{return"";}};OpenLayers.Util.getXmlNodeValue=function(node){var val=null;OpenLayers.Util.Try(function(){val=node.text;if(!val)
val=node.textContent;if(!val)
val=node.firstChild.nodeValue;},function(){val=node.textContent;});return val;};OpenLayers.Util.mouseLeft=function(evt,div){var target=(evt.relatedTarget)?evt.relatedTarget:evt.toElement;while(target!=div&&target!=null){target=target.parentNode;}
return(target!=div);};OpenLayers.Util.rad=function(x){return x*Math.PI/180;};OpenLayers.Util.distVincenty=function(p1,p2){var a=6378137,b=6356752.3142,f=1/298.257223563;var L=OpenLayers.Util.rad(p2.lon-p1.lon);var U1=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p1.lat)));var U2=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p2.lat)));var sinU1=Math.sin(U1),cosU1=Math.cos(U1);var sinU2=Math.sin(U2),cosU2=Math.cos(U2);var lambda=L,lambdaP=2*Math.PI;var iterLimit=20;while(Math.abs(lambda-lambdaP)>1e-12&&--iterLimit>0){var sinLambda=Math.sin(lambda),cosLambda=Math.cos(lambda);var sinSigma=Math.sqrt((cosU2*sinLambda)*(cosU2*sinLambda)+
(cosU1*sinU2-sinU1*cosU2*cosLambda)*(cosU1*sinU2-sinU1*cosU2*cosLambda));if(sinSigma==0)return 0;var cosSigma=sinU1*sinU2+cosU1*cosU2*cosLambda;var sigma=Math.atan2(sinSigma,cosSigma);var alpha=Math.asin(cosU1*cosU2*sinLambda/sinSigma);var cosSqAlpha=Math.cos(alpha)*Math.cos(alpha);var cos2SigmaM=cosSigma-2*sinU1*sinU2/cosSqAlpha;var C=f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));lambdaP=lambda;lambda=L+(1-C)*f*Math.sin(alpha)*(sigma+C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));}
if(iterLimit==0)return NaN
var uSq=cosSqAlpha*(a*a-b*b)/(b*b);var A=1+uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));var B=uSq/1024*(256+uSq*(-128+uSq*(74-47*uSq)));var deltaSigma=B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));var s=b*A*(sigma-deltaSigma);var d=s.toFixed(3)/1000;return d;};OpenLayers.Util.getParameters=function(url){url=url||window.location.href
if(url==null){url=window.location.href;}
var paramsString="";if(url.contains('?')){var start=url.indexOf('?')+1;var end=url.contains("#")?url.indexOf('#'):url.length;paramsString=url.substring(start,end);}
var parameters={};var pairs=paramsString.split(/[&;]/);for(var i=0;i<pairs.length;++i){var keyValue=pairs[i].split('=');if(keyValue[0]){var key=decodeURIComponent(keyValue[0]);var value=keyValue[1]||'';value=value.split(",");for(var j=0;j<value.length;j++){value[j]=decodeURIComponent(value[j]);}
if(value.length==1){value=value[0];}
parameters[key]=value;}}
return parameters;};OpenLayers.Util.getArgs=function(url){var err="The getArgs() function is deprecated and will be removed "+"with the 3.0 version of OpenLayers. Please instead use "+"OpenLayers.Util.getParameters().";OpenLayers.Console.warn(err);return OpenLayers.Util.getParameters(url);};OpenLayers.Util.lastSeqID=0;OpenLayers.Util.createUniqueID=function(prefix){if(prefix==null){prefix="id_";}
OpenLayers.Util.lastSeqID+=1;return prefix+OpenLayers.Util.lastSeqID;};OpenLayers.INCHES_PER_UNIT={'inches':1.0,'ft':12.0,'mi':63360.0,'m':39.3701,'km':39370.1,'dd':4374754};OpenLayers.INCHES_PER_UNIT["in"]=OpenLayers.INCHES_PER_UNIT.inches;OpenLayers.INCHES_PER_UNIT["degrees"]=OpenLayers.INCHES_PER_UNIT.dd;OpenLayers.DOTS_PER_INCH=72;OpenLayers.Util.normalizeScale=function(scale){var normScale=(scale>1.0)?(1.0/scale):scale;return normScale;};OpenLayers.Util.getResolutionFromScale=function(scale,units){if(units==null){units="degrees";}
var normScale=OpenLayers.Util.normalizeScale(scale);var resolution=1/(normScale*OpenLayers.INCHES_PER_UNIT[units]*OpenLayers.DOTS_PER_INCH);return resolution;};OpenLayers.Util.getScaleFromResolution=function(resolution,units){if(units==null){units="degrees";}
var scale=resolution*OpenLayers.INCHES_PER_UNIT[units]*OpenLayers.DOTS_PER_INCH;return scale;};OpenLayers.Util.safeStopPropagation=function(evt){OpenLayers.Event.stop(evt,true);};OpenLayers.Util.pagePosition=function(forElement){var valueT=0,valueL=0;var element=forElement;var child=forElement;while(element){if(element==document.body){if(OpenLayers.Element.getStyle(child,'position')=='absolute'){break;}}
valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;child=element;try{element=element.offsetParent;}catch(e){OpenLayers.Console.error("OpenLayers.Util.pagePosition failed: element with id "+
element.id+" may be misplaced.");break;}}
element=forElement;while(element){valueT-=element.scrollTop||0;valueL-=element.scrollLeft||0;element=element.parentNode;}
return[valueL,valueT];};OpenLayers.Util.isEquivalentUrl=function(url1,url2,options){options=options||{};OpenLayers.Util.applyDefaults(options,{ignoreCase:true,ignorePort80:true,ignoreHash:true});urlObj1=OpenLayers.Util.createUrlObject(url1,options);urlObj2=OpenLayers.Util.createUrlObject(url2,options);for(var key in urlObj1){if(options.test){alert(key+"\n1:"+urlObj1[key]+"\n2:"+urlObj2[key]);}
var val1=urlObj1[key];var val2=urlObj2[key];switch(key){case"args":break;case"host":case"port":case"protocol":if((val1=="")||(val2=="")){break;}
default:if((key!="args")&&(urlObj1[key]!=urlObj2[key])){return false;}
break;}}
for(var key in urlObj1.args){if(urlObj1.args[key]!=urlObj2.args[key]){return false;}
delete urlObj2.args[key];}
for(var key in urlObj2.args){return false;}
return true;};OpenLayers.Util.createUrlObject=function(url,options){options=options||{};var urlObject={};if(options.ignoreCase){url=url.toLowerCase();}
var a=document.createElement('a');a.href=url;urlObject.host=a.host;var port=a.port;if(port.length<=0){var newHostLength=urlObject.host.length-(port.length);urlObject.host=urlObject.host.substring(0,newHostLength);}
urlObject.protocol=a.protocol;urlObject.port=((port=="80")&&(options.ignorePort80))?"":port;urlObject.hash=(options.ignoreHash)?"":a.hash;var queryString=a.search;if(!queryString){var qMark=url.indexOf("?");queryString=(qMark!=-1)?url.substr(qMark):"";}
urlObject.args=OpenLayers.Util.getParameters(queryString);if(((urlObject.protocol=="file:")&&(url.indexOf("file:")!=-1))||((urlObject.protocol!="file:")&&(urlObject.host!=""))){urlObject.pathname=a.pathname;var qIndex=urlObject.pathname.indexOf("?");if(qIndex!=-1){urlObject.pathname=urlObject.pathname.substring(0,qIndex);}}else{var relStr=OpenLayers.Util.removeTail(url);var backs=0;do{var index=relStr.indexOf("../");if(index==0){backs++
relStr=relStr.substr(3);}else if(index>=0){var prevChunk=relStr.substr(0,index-1);var slash=prevChunk.indexOf("/");prevChunk=(slash!=-1)?prevChunk.substr(0,slash+1):"";var postChunk=relStr.substr(index+3);relStr=prevChunk+postChunk;}}while(index!=-1)
var windowAnchor=document.createElement("a");var windowUrl=window.location.href;if(options.ignoreCase){windowUrl=windowUrl.toLowerCase();}
windowAnchor.href=windowUrl;urlObject.protocol=windowAnchor.protocol;var splitter=(windowAnchor.pathname.indexOf("/")!=-1)?"/":"\\";var dirs=windowAnchor.pathname.split(splitter);dirs.pop();while((backs>0)&&(dirs.length>0)){dirs.pop();backs--;}
relStr=dirs.join("/")+"/"+relStr;urlObject.pathname=relStr;}
if((urlObject.protocol=="file:")||(urlObject.protocol=="")){urlObject.host="localhost";}
return urlObject;};OpenLayers.Util.removeTail=function(url){var head=null;var qMark=url.indexOf("?");var hashMark=url.indexOf("#");if(qMark==-1){head=(hashMark!=-1)?url.substr(0,hashMark):url;}else{head=(hashMark!=-1)?url.substr(0,Math.min(qMark,hashMark)):url.substr(0,qMark);}
return head;};OpenLayers.Util.getBrowserName=function(){var browserName="";var ua=navigator.userAgent.toLowerCase();if(ua.indexOf("opera")!=-1){browserName="opera";}else if(ua.indexOf("msie")!=-1){browserName="msie";}else if(ua.indexOf("safari")!=-1){browserName="safari";}else if(ua.indexOf("mozilla")!=-1){if(ua.indexOf("firefox")!=-1){browserName="firefox";}else{browserName="mozilla";}}
return browserName;};OpenLayers.Class=function(){var Class=function(){if(arguments&&arguments[0]!=OpenLayers.Class.isPrototype){this.initialize.apply(this,arguments);}}
var extended={};var parent;for(var i=0;i<arguments.length;++i){if(typeof arguments[i]=="function"){parent=arguments[i].prototype;}else{parent=arguments[i];}
OpenLayers.Util.extend(extended,parent);}
Class.prototype=extended;return Class;};String.prototype.startsWith=function(sStart){return(this.substr(0,sStart.length)==sStart);};String.prototype.contains=function(str){return(this.indexOf(str)!=-1);};String.prototype.trim=function(){var b=0;while(this.substr(b,1)==" "){b++;}
var e=this.length-1;while(this.substr(e,1)==" "){e--;}
return this.substring(b,e+1);};String.indexOf=function(object){var index=-1;for(var i=0;i<this.length;i++){if(this[i]==object){index=i;break;}}
return index;};String.prototype.camelize=function(){var oStringList=this.split('-');var camelizedString=oStringList[0];for(var i=1;i<oStringList.length;i++){var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);}
return camelizedString;};Number.prototype.limitSigDigs=function(sig){var numStr=(sig>0)?this.toString():"0";if(numStr.contains(".")){var msg="limitSigDig can not be called on a floating point number";OpenLayers.Console.error(msg);return null;}
if((sig>0)&&(sig<numStr.length)){var exp=numStr.length-sig;numStr=Math.round(this/Math.pow(10,exp))*Math.pow(10,exp);}
return parseInt(numStr);};Function.prototype.bind=function(){var __method=this;var args=[];var object=arguments[0];for(var i=1;i<arguments.length;i++){args.push(arguments[i]);}
return function(moreargs){var i;var newArgs=[];for(i=0;i<args.length;i++){newArgs.push(args[i]);}
for(i=0;i<arguments.length;i++){newArgs.push(arguments[i]);}
return __method.apply(object,newArgs);};};Function.prototype.bindAsEventListener=function(object){var __method=this;return function(event){return __method.call(object,event||window.event);};};OpenLayers.ProxyHost="";OpenLayers.nullHandler=function(request){alert("Unhandled request return "+request.statusText);};OpenLayers.loadURL=function(uri,params,caller,onComplete,onFailure){if(OpenLayers.ProxyHost&&uri.startsWith("http")){uri=OpenLayers.ProxyHost+escape(uri);}
var success=(onComplete)?onComplete.bind(caller):OpenLayers.nullHandler;var failure=(onFailure)?onFailure.bind(caller):OpenLayers.nullHandler;new OpenLayers.Ajax.Request(uri,{method:'get',parameters:params,onComplete:success,onFailure:failure});};OpenLayers.parseXMLString=function(text){var index=text.indexOf('<');if(index>0){text=text.substring(index);}
var ajaxResponse=OpenLayers.Util.Try(function(){var xmldom=new ActiveXObject('Microsoft.XMLDOM');xmldom.loadXML(text);return xmldom;},function(){return new DOMParser().parseFromString(text,'text/xml');},function(){var req=new XMLHttpRequest();req.open("GET","data:"+"text/xml"+";charset=utf-8,"+encodeURIComponent(text),false);if(req.overrideMimeType){req.overrideMimeType("text/xml");}
req.send(null);return req.responseXML;});return ajaxResponse;};OpenLayers.Ajax={emptyFunction:function(){},getTransport:function(){return OpenLayers.Util.Try(function(){return new ActiveXObject('Msxml2.XMLHTTP')},function(){return new ActiveXObject('Microsoft.XMLHTTP')},function(){return new XMLHttpRequest()})||false;},activeRequestCount:0};OpenLayers.Ajax.Responders={responders:[],register:function(responderToAdd){for(var i=0;i<this.responders.length;i++)
if(responderToAdd==this.responders[i])
return;this.responders.push(responderToAdd);},dispatch:function(callback,request,transport,json){var responder;for(var i=0;i<this.responders.length;i++){responder=this.responders[i];if(responder[callback]&&typeof responder[callback]=='function'){try{responder[callback].apply(responder,[request,transport,json]);}catch(e){}}}}};OpenLayers.Ajax.Responders.register({onCreate:function(){OpenLayers.Ajax.activeRequestCount++;},onComplete:function(){OpenLayers.Ajax.activeRequestCount--;}});OpenLayers.Ajax.Base=function(){};OpenLayers.Ajax.Base.prototype={setOptions:function(options){this.options={'method':'post','asynchronous':true,'parameters':''};OpenLayers.Util.extend(this.options,options||{});},responseIsSuccess:function(){return this.transport.status==undefined||this.transport.status==0||(this.transport.status>=200&&this.transport.status<300);},responseIsFailure:function(){return!this.responseIsSuccess();}};OpenLayers.Ajax.Request=OpenLayers.Class(OpenLayers.Ajax.Base,{initialize:function(url,options){this.transport=OpenLayers.Ajax.getTransport();this.setOptions(options);this.request(url);},request:function(url){var parameters=this.options.parameters||'';if(parameters.length>0)parameters+='&_=';try{this.url=url;if(this.options.method=='get'&&parameters.length>0){this.url+=(this.url.match(/\?/)?'&':'?')+parameters;}
OpenLayers.Ajax.Responders.dispatch('onCreate',this,this.transport);this.transport.open(this.options.method,this.url,this.options.asynchronous);if(this.options.asynchronous){this.transport.onreadystatechange=this.onStateChange.bind(this);setTimeout((function(){this.respondToReadyState(1)}).bind(this),10);}
this.setRequestHeaders();var body=this.options.postBody?this.options.postBody:parameters;this.transport.send(this.options.method=='post'?body:null);if(!this.options.asynchronous&&this.transport.overrideMimeType){this.onStateChange();}}catch(e){this.dispatchException(e);}},setRequestHeaders:function(){var requestHeaders=['X-Requested-With','XMLHttpRequest','X-Prototype-Version','OpenLayers'];if(this.options.method=='post'&&!this.options.postBody){requestHeaders.push('Content-type','application/x-www-form-urlencoded');if(this.transport.overrideMimeType){requestHeaders.push('Connection','close');}}
if(this.options.requestHeaders){requestHeaders.push.apply(requestHeaders,this.options.requestHeaders);}
for(var i=0;i<requestHeaders.length;i+=2){this.transport.setRequestHeader(requestHeaders[i],requestHeaders[i+1]);}},onStateChange:function(){var readyState=this.transport.readyState;if(readyState!=1){this.respondToReadyState(this.transport.readyState);}},header:function(name){try{return this.transport.getResponseHeader(name);}catch(e){}},evalJSON:function(){try{return eval(this.header('X-JSON'));}catch(e){}},evalResponse:function(){try{return eval(this.transport.responseText);}catch(e){this.dispatchException(e);}},respondToReadyState:function(readyState){var event=OpenLayers.Ajax.Request.Events[readyState];var transport=this.transport,json=this.evalJSON();if(event=='Complete'){try{var responseSuccess=this.responseIsSuccess()?'Success':'Failure';(this.options['on'+this.transport.status]||this.options['on'+responseSuccess]||OpenLayers.Ajax.emptyFunction)(transport,json);}catch(e){this.dispatchException(e);}
var contentType=this.header('Content-type')||'';if(contentType.match(/^text\/javascript/i)){this.evalResponse();}}
try{(this.options['on'+event]||OpenLayers.Ajax.emptyFunction)(transport,json);OpenLayers.Ajax.Responders.dispatch('on'+event,this,transport,json);}catch(e){this.dispatchException(e);}
if(event=='Complete'){this.transport.onreadystatechange=OpenLayers.Ajax.emptyFunction;}},dispatchException:function(exception){if(this.options.onException){this.options.onException(this,exception);}else{throw exception;}
OpenLayers.Ajax.Responders.dispatch('onException',this,exception);}});OpenLayers.Ajax.Request.Events=['Uninitialized','Loading','Loaded','Interactive','Complete'];OpenLayers.Ajax.getElementsByTagNameNS=function(parentnode,nsuri,nsprefix,tagname){var elem=null;if(parentnode.getElementsByTagNameNS){elem=parentnode.getElementsByTagNameNS(nsuri,tagname);}else{elem=parentnode.getElementsByTagName(nsprefix+':'+tagname);}
return elem;};OpenLayers.Ajax.serializeXMLToString=function(xmldom){var serializer=new XMLSerializer();data=serializer.serializeToString(xmldom);return data;}