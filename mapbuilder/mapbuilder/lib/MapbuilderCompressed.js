var MapBuilder_Release=true;

var mbTimerStart=new Date();
var config;
if(typeof baseDir=="undefined"){
var baseDir;
}
var mbServerConfig="mapbuilderConfig.xml";
var mbNsUrl="http://mapbuilder.sourceforge.net/mapbuilder";
var MB_UNLOADED=0;
var MB_LOAD_CORE=1;
var MB_LOAD_CONFIG=2;
var MB_LOADED=3;
function Mapbuilder(){
this.loadState=MB_UNLOADED;
this.loadingScripts=new Array();
this.scriptsTimer=null;
this.checkScriptsLoaded=function(){
if(typeof MapBuilder_Release=="boolean"){
this.setLoadState(MB_LOAD_CONFIG);
return;
}
if(document.readyState!=null){
while(this.loadingScripts.length>0&&(this.loadingScripts[0].readyState=="loaded"||this.loadingScripts[0].readyState=="complete"||this.loadingScripts[0].readyState==null)){
this.loadingScripts.shift();
}
if(this.loadingScripts.length==0){
this.setLoadState(this.loadState+1);
}
}else{
if(this.loadState==MB_LOAD_CORE&&config!=null){
this.setLoadState(MB_LOAD_CONFIG);
}
}
};
this.setLoadState=function(_1){
this.loadState=_1;
switch(_1){
case MB_LOAD_CORE:
this.loadScript(baseDir+"/util/sarissa/Sarissa.js");
this.loadScript(baseDir+"/util/sarissa/sarissa_ieemu_xpath.js");
this.loadScript(baseDir+"/util/Util.js");
this.loadScript(baseDir+"/util/Listener.js");
this.loadScript(baseDir+"/model/ModelBase.js");
this.loadScript(baseDir+"/model/Config.js");
break;
case MB_LOAD_CONFIG:
if(document.readyState){
config=new Config(mbConfigUrl);
config.loadConfigScripts();
if(typeof MapBuilder_Release=="boolean"){
this.setLoadState(MB_LOADED);
return;
}
}else{
this.setLoadState(MB_LOADED);
}
break;
case MB_LOADED:
clearInterval(this.scriptsTimer);
break;
}
};
this.loadScript=function(_2){
if(typeof MapBuilder_Release=="boolean"){
return;
}
if(!document.getElementById(_2)){
var _3=document.createElement("script");
_3.defer=false;
_3.type="text/javascript";
_3.src=_2;
_3.id=_2;
document.getElementsByTagName("head")[0].appendChild(_3);
this.loadingScripts.push(_3);
}
};
this.loadScriptsFromXpath=function(_4,_5){
for(var i=0;i<_4.length;i++){
if(_4[i].selectSingleNode("mb:scriptFile")==null){
scriptFile=baseDir+"/"+_5+_4[i].nodeName+".js";
this.loadScript(scriptFile);
}
}
};
var _7=document.getElementsByTagName("head")[0];
var _8=_7.childNodes;
for(var i=0;i<_8.length;++i){
var _a=_8.item(i).src;
if(_a){
var _b=_a.indexOf("/Mapbuilder.js");
if(_b>=0){
baseDir=_a.substring(0,_b);
}else{
_b=_a.indexOf("/MapbuilderCompressed.js");
if(_b>=0){
baseDir=_a.substring(0,_b);
}
}
}
}
this.setLoadState(MB_LOAD_CORE);
this.scriptsTimer=setInterval("mapbuilder.checkScriptsLoaded()",100);
}
function checkIESecurity(){
var _c=["Msxml2.DOMDocument.5.0","Msxml2.DOMDocument.4.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"];
var _d=false;
for(var i=0;i<_c.length&&!_d;i++){
try{
var _f=new ActiveXObject(_c[i]);
_d=true;
}
catch(e){
}
}
if(!_d){
window.open("/mapbuilder/docs/help/IESetup.html");
}
}
if(navigator.userAgent.toLowerCase().indexOf("msie")>-1){
checkIESecurity();
}
var mapbuilder=new Mapbuilder();
function mapbuilderInit(){
if(mapbuilder&&mapbuilder.loadState==MB_LOADED){
clearInterval(mbTimerId);
config.parseConfig(config);
config.callListeners("init");
var _10=new Date();
if(window.mbInit){
window.mbInit();
}
config.callListeners("loadModel");
}
}
var mbTimerId;
function mbDoLoad(_11){
mbTimerId=setInterval("mapbuilderInit()",100);
if(_11){
window.mbInit=_11;
}
}

function Sarissa(){
}
Sarissa.PARSED_OK="Document contains no parsing errors";
Sarissa.IS_ENABLED_TRANSFORM_NODE=false;
Sarissa.IS_ENABLED_XMLHTTP=false;
Sarissa.IS_ENABLED_SELECT_NODES=false;
var _sarissa_iNsCounter=0;
var _SARISSA_IEPREFIX4XSLPARAM="";
var _SARISSA_HAS_DOM_IMPLEMENTATION=document.implementation&&true;
var _SARISSA_HAS_DOM_CREATE_DOCUMENT=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.createDocument;
var _SARISSA_HAS_DOM_FEATURE=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.hasFeature;
var _SARISSA_IS_MOZ=_SARISSA_HAS_DOM_CREATE_DOCUMENT&&_SARISSA_HAS_DOM_FEATURE;
var _SARISSA_IS_SAFARI=(navigator.userAgent&&navigator.vendor&&(navigator.userAgent.toLowerCase().indexOf("applewebkit")!=-1||navigator.vendor.indexOf("Apple")!=-1));
var _SARISSA_IS_IE=document.all&&window.ActiveXObject&&navigator.userAgent.toLowerCase().indexOf("msie")>-1&&navigator.userAgent.toLowerCase().indexOf("opera")==-1;
if(!window.Node||!window.Node.ELEMENT_NODE){
var Node={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};
}
if(_SARISSA_IS_IE){
_SARISSA_IEPREFIX4XSLPARAM="xsl:";
var _SARISSA_DOM_PROGID="";
var _SARISSA_XMLHTTP_PROGID="";
pickRecentProgID=function(_1,_2){
var _3=false;
for(var i=0;i<_1.length&&!_3;i++){
try{
var _5=new ActiveXObject(_1[i]);
o2Store=_1[i];
_3=true;
for(var j=0;j<_2.length;j++){
if(i<=_2[j][1]){
Sarissa["IS_ENABLED_"+_2[j][0]]=true;
}
}
}
catch(objException){
}
}
if(!_3){
throw "Could not retreive a valid progID of Class: "+_1[_1.length-1]+". (original exception: "+e+")";
}
_1=null;
return o2Store;
};
_SARISSA_DOM_PROGID=pickRecentProgID(["Msxml2.DOMDocument.5.0","Msxml2.DOMDocument.4.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"],[["SELECT_NODES",2],["TRANSFORM_NODE",2]]);
_SARISSA_XMLHTTP_PROGID=pickRecentProgID(["Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],[["XMLHTTP",4]]);
_SARISSA_THREADEDDOM_PROGID=pickRecentProgID(["Msxml2.FreeThreadedDOMDocument.5.0","MSXML2.FreeThreadedDOMDocument.4.0","MSXML2.FreeThreadedDOMDocument.3.0"]);
_SARISSA_XSLTEMPLATE_PROGID=pickRecentProgID(["Msxml2.XSLTemplate.5.0","Msxml2.XSLTemplate.4.0","MSXML2.XSLTemplate.3.0"],[["XSLTPROC",2]]);
pickRecentProgID=null;
Sarissa.getDomDocument=function(_7,_8){
var _9=new ActiveXObject(_SARISSA_DOM_PROGID);
if(_8){
if(_7){
_9.loadXML("<a"+_sarissa_iNsCounter+":"+_8+" xmlns:a"+_sarissa_iNsCounter+"=\""+_7+"\" />");
++_sarissa_iNsCounter;
}else{
_9.loadXML("<"+_8+"/>");
}
}
return _9;
};
Sarissa.getParseErrorText=function(_a){
var _b=Sarissa.PARSED_OK;
if(_a.parseError!=0){
_b="XML Parsing Error: "+_a.parseError.reason+"\nLocation: "+_a.parseError.url+"\nLine Number "+_a.parseError.line+", Column "+_a.parseError.linepos+":\n"+_a.parseError.srcText+"\n";
for(var i=0;i<_a.parseError.linepos;i++){
_b+="-";
}
_b+="^\n";
}
return _b;
};
Sarissa.setXpathNamespaces=function(_d,_e){
_d.setProperty("SelectionLanguage","XPath");
_d.setProperty("SelectionNamespaces",_e);
};
XSLTProcessor=function(){
this.template=new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
this.processor=null;
};
XSLTProcessor.prototype.importStylesheet=function(_f){
var _10=new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
_10.loadXML(_f.xml);
this.template.stylesheet=_10;
this.processor=this.template.createProcessor();
this.paramsSet=new Array();
};
XSLTProcessor.prototype.transformToDocument=function(_11){
this.processor.input=_11;
var _12=new ActiveXObject(_SARISSA_DOM_PROGID);
this.processor.output=_12;
this.processor.transform();
return _12;
};
XSLTProcessor.prototype.setParameter=function(_13,_14,_15){
if(_13){
this.processor.addParameter(_14,_15,_13);
}else{
this.processor.addParameter(_14,_15);
}
if(!this.paramsSet[""+_13]){
this.paramsSet[""+_13]=new Array();
}
this.paramsSet[""+_13][_14]=_15;
};
XSLTProcessor.prototype.getParameter=function(_16,_17){
_16=_16||"";
if(_16 in this.paramsSet&&_17 in this.paramsSet[_16]){
return this.paramsSet[_16][_17];
}else{
return null;
}
};
}else{
if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(_18){
if(!_18.documentElement||_18.documentElement.tagName=="parsererror"){
_18.parseError=-1;
}
Sarissa.__setReadyState__(_18,4);
};
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(_19,_1a){
_19.readyState=_1a;
if(_19.onreadystatechange!=null&&typeof _19.onreadystatechange=="function"){
_19.onreadystatechange();
}
};
Sarissa.getDomDocument=function(_1b,_1c){
var _1d=document.implementation.createDocument(_1b?_1b:"",_1c?_1c:"",null);
_1d.addEventListener("load",_sarissa_XMLDocument_onload,false);
return _1d;
};
if(window.XMLDocument){
XMLDocument.prototype.onreadystatechange=null;
XMLDocument.prototype.readyState=0;
XMLDocument.prototype.parseError=0;
var _SARISSA_SYNC_NON_IMPLEMENTED=false;
XMLDocument.prototype._sarissa_load=XMLDocument.prototype.load;
XMLDocument.prototype.load=function(_1e){
var _1f=document.implementation.createDocument("","",null);
Sarissa.copyChildNodes(this,_1f);
this.parseError=0;
Sarissa.__setReadyState__(this,1);
try{
if(this.async==false&&_SARISSA_SYNC_NON_IMPLEMENTED){
var tmp=new XMLHttpRequest();
tmp.open("GET",_1e,false);
tmp.send(null);
Sarissa.__setReadyState__(this,2);
Sarissa.copyChildNodes(tmp.responseXML,this);
Sarissa.__setReadyState__(this,3);
}else{
this._sarissa_load(_1e);
}
}
catch(objException){
this.parseError=-1;
}
finally{
if(this.async==false){
Sarissa.__handleLoad__(this);
}
}
return _1f;
};
}else{
if(document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("LS","3.0")){
Document.prototype.async=true;
Document.prototype.onreadystatechange=null;
Document.prototype.parseError=0;
Document.prototype.load=function(_21){
var _22=document.implementation.createLSParser(this.async?document.implementation.MODE_ASYNCHRONOUS:document.implementation.MODE_SYNCHRONOUS,null);
if(this.async){
var _23=this;
_22.addEventListener("load",function(e){
_23.readyState=4;
Sarissa.copyChildNodes(e.newDocument,_23.documentElement,false);
_23.onreadystatechange.call();
},false);
}
try{
var _25=_22.parseURI(_21);
}
catch(e){
this.parseError=-1;
}
if(!this.async){
Sarissa.copyChildNodes(_25,this.documentElement,false);
}
return _25;
};
Sarissa.getDomDocument=function(_26,_27){
return document.implementation.createDocument(_26?_26:"",_27?_27:"",null);
};
}
}
}
}
if(!window.DOMParser){
DOMParser=function(){
};
if(_SARISSA_IS_SAFARI){
DOMParser.prototype.parseFromString=function(_28,_29){
if(_29.toLowerCase()!="application/xml"){
throw "Cannot handle content type: \""+_29+"\"";
}
var _2a=new XMLHttpRequest();
_2a.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(str),false);
_2a.send(null);
return _2a.responseXML;
};
}else{
if(Sarissa.getDomDocument&&Sarissa.getDomDocument()&&"loadXML" in Sarissa.getDomDocument()){
DOMParser.prototype.parseFromString=function(_2b,_2c){
var doc=Sarissa.getDomDocument();
doc.loadXML(_2b);
return doc;
};
}
}
}
if(window.XMLHttpRequest){
Sarissa.IS_ENABLED_XMLHTTP=true;
}else{
if(_SARISSA_IS_IE){
XMLHttpRequest=function(){
return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
};
Sarissa.IS_ENABLED_XMLHTTP=true;
}
}
if(!window.document.importNode&&_SARISSA_IS_IE){
try{
window.document.importNode=function(_2e,_2f){
var _30=document.createElement("div");
if(_2f){
_30.innerHTML=Sarissa.serialize(_2e);
}else{
_30.innerHTML=Sarissa.serialize(_2e.cloneNode(false));
}
return _30.firstChild;
};
}
catch(e){
}
}
if(!Sarissa.getParseErrorText){
Sarissa.getParseErrorText=function(_31){
var _32=Sarissa.PARSED_OK;
if(_31&&_31.parseError&&_31.parseError!=0){
if(_31.documentElement.tagName=="parsererror"){
_32=_31.documentElement.firstChild.data;
_32+="\n"+_31.documentElement.firstChild.nextSibling.firstChild.data;
}else{
_32=Sarissa.getText(_31.documentElement);
}
}
return _32;
};
}
Sarissa.getText=function(_33,_34){
var s="";
var _36=_33.childNodes;
for(var i=0;i<_36.length;i++){
var _38=_36[i];
var _39=_38.nodeType;
if(_39==Node.TEXT_NODE||_39==Node.CDATA_SECTION_NODE){
s+=_38.data;
}else{
if(_34==true&&(_39==Node.ELEMENT_NODE||_39==Node.DOCUMENT_NODE||_39==Node.DOCUMENT_FRAGMENT_NODE)){
s+=Sarissa.getText(_38,true);
}
}
}
return s;
};
if(window.XMLSerializer){
Sarissa.serialize=function(_3a){
var s=null;
if(_3a){
s=_3a.innerHTML?_3a.innerHTML:(new XMLSerializer()).serializeToString(_3a);
}
return s;
};
}else{
if(Sarissa.getDomDocument&&(Sarissa.getDomDocument("","foo",null)).xml){
Sarissa.serialize=function(_3c){
var s=null;
if(_3c){
s=_3c.innerHTML?_3c.innerHTML:_3c.xml;
}
return s;
};
XMLSerializer=function(){
};
XMLSerializer.prototype.serializeToString=function(_3e){
return _3e.xml;
};
}
}
Sarissa.stripTags=function(s){
return s.replace(/<[^>]+>/g,"");
};
Sarissa.clearChildNodes=function(_40){
while(_40.firstChild){
_40.removeChild(_40.firstChild);
}
};
Sarissa.copyChildNodes=function(_41,_42,_43){
if((!_41)||(!_42)){
throw "Both source and destination nodes must be provided";
}
if(!_43){
Sarissa.clearChildNodes(_42);
}
var _44=_42.nodeType==Node.DOCUMENT_NODE?_42:_42.ownerDocument;
var _45=_41.childNodes;
if(_44.importNode&&(!_SARISSA_IS_IE)){
for(var i=0;i<_45.length;i++){
_42.appendChild(_44.importNode(_45[i],true));
}
}else{
for(var i=0;i<_45.length;i++){
_42.appendChild(_45[i].cloneNode(true));
}
}
};
Sarissa.moveChildNodes=function(_47,_48,_49){
if((!_47)||(!_48)){
throw "Both source and destination nodes must be provided";
}
if(!_49){
Sarissa.clearChildNodes(_48);
}
var _4a=_47.childNodes;
if(_47.ownerDocument==_48.ownerDocument){
while(_47.firstChild){
_48.appendChild(_47.firstChild);
}
}else{
var _4b=_48.nodeType==Node.DOCUMENT_NODE?_48:_48.ownerDocument;
if(_4b.importNode&&(!_SARISSA_IS_IE)){
for(var i=0;i<_4a.length;i++){
_48.appendChild(_4b.importNode(_4a[i],true));
}
}else{
for(var i=0;i<_4a.length;i++){
_48.appendChild(_4a[i].cloneNode(true));
}
}
Sarissa.clearChildNodes(_47);
}
};
Sarissa.xmlize=function(_4d,_4e,_4f){
_4f=_4f?_4f:"";
var s=_4f+"<"+_4e+">";
var _51=false;
if(!(_4d instanceof Object)||_4d instanceof Number||_4d instanceof String||_4d instanceof Boolean||_4d instanceof Date){
s+=Sarissa.escape(""+_4d);
_51=true;
}else{
s+="\n";
var _52="";
var _53=_4d instanceof Array;
for(var _54 in _4d){
s+=Sarissa.xmlize(_4d[_54],(_53?"array-item key=\""+_54+"\"":_54),_4f+"   ");
}
s+=_4f;
}
return s+=(_4e.indexOf(" ")!=-1?"</array-item>\n":"</"+_4e+">\n");
};
Sarissa.escape=function(_55){
return _55.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
};
Sarissa.unescape=function(_56){
return _56.replace(/&apos;/g,"'").replace(/&quot;/g,"\"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
};

var _SARISSA_HAS_DOM_IMPLEMENTATION=document.implementation&&true;
var _SARISSA_HAS_DOM_FEATURE=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.hasFeature;
if(_SARISSA_HAS_DOM_FEATURE&&document.implementation.hasFeature("XPath","3.0")){
function SarissaNodeList(i){
this.length=i;
}
SarissaNodeList.prototype=new Array(0);
SarissaNodeList.prototype.constructor=Array;
SarissaNodeList.prototype.item=function(i){
return (i<0||i>=this.length)?null:this[i];
};
SarissaNodeList.prototype.expr="";
XMLDocument.prototype.setProperty=function(x,y){
};
Sarissa.setXpathNamespaces=function(_5,_6){
_5._sarissa_useCustomResolver=true;
var _7=_6.indexOf(" ")>-1?_6.split(" "):new Array(_6);
_5._sarissa_xpathNamespaces=new Array(_7.length);
for(var i=0;i<_7.length;i++){
var ns=_7[i];
var _a=ns.indexOf(":");
var _b=ns.indexOf("=");
if(_a==5&&_b>_a+2){
var _c=ns.substring(_a+1,_b);
var _d=ns.substring(_b+2,ns.length-1);
_5._sarissa_xpathNamespaces[_c]=_d;
}else{
throw "Bad format on namespace declaration(s) given";
}
}
};
XMLDocument.prototype._sarissa_useCustomResolver=false;
XMLDocument.prototype._sarissa_xpathNamespaces=new Array();
XMLDocument.prototype.selectNodes=function(_e,_f){
var _10=this;
var _11=this._sarissa_useCustomResolver?function(_12){
var s=_10._sarissa_xpathNamespaces[_12];
if(s){
return s;
}else{
throw "No namespace URI found for prefix: '"+_12+"'";
}
}:this.createNSResolver(this.documentElement);
var _14=this.evaluate(_e,(_f?_f:this),_11,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var _15=new SarissaNodeList(_14.snapshotLength);
_15.expr=_e;
for(var i=0;i<_15.length;i++){
_15[i]=_14.snapshotItem(i);
}
return _15;
};
Element.prototype.selectNodes=function(_17){
var doc=this.ownerDocument;
if(doc.selectNodes){
return doc.selectNodes(_17,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
XMLDocument.prototype.selectSingleNode=function(_19,_1a){
var ctx=_1a?_1a:null;
_19="("+_19+")[1]";
var _1c=this.selectNodes(_19,ctx);
if(_1c.length>0){
return _1c.item(0);
}else{
return null;
}
};
Element.prototype.selectSingleNode=function(_1d){
var doc=this.ownerDocument;
if(doc.selectSingleNode){
return doc.selectSingleNode(_1d,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
Sarissa.IS_ENABLED_SELECT_NODES=true;
}

var MB_IS_MOZ=(document.implementation&&document.implementation.createDocument)?true:false;
function XslProcessor(_1,_2){
this.xslUrl=_1;
this.xslDom=Sarissa.getDomDocument();
this.xslDom.async=false;
this.xslDom.validateOnParse=false;
this.xslDom.load(_1);
if(this.xslDom.parseError<0){
alert("error loading XSL stylesheet: "+_1);
}
this.processor=new XSLTProcessor();
this.processor.importStylesheet(this.xslDom);
this.docNSUri=_2;
this.transformNodeToString=function(_3){
try{
var _4=this.transformNodeToObject(_3);
var s=Sarissa.serialize(_4);
return Sarissa.unescape(s);
}
catch(e){
alert("Exception transforming doc with XSL: "+this.xslUrl);
alert("XSL="+Sarissa.serialize(this.xslDom));
alert("XML="+Sarissa.serialize(_3));
}
};
this.transformNodeToObject=function(_6){
var _7=this.processor.transformToDocument(_6);
return _7;
};
this.setParameter=function(_8,_9,_a){
if(!_9){
return;
}
this.processor.setParameter(null,_8,_9);
};
}
function postLoad(_b,_c,_d){
var _e=new XMLHttpRequest();
if(_b.indexOf("http://")==0){
_e.open("POST",config.proxyUrl,false);
_e.setRequestHeader("serverUrl",_b);
}else{
_e.open("POST",_b,false);
}
_e.setRequestHeader("content-type","text/xml");
if(_d){
_e.setRequestHeader("content-type",_d);
}
_e.send(_c);
if(_e.status>=400){
alert("error loading document: "+_b+" - "+_e.statusText+"-"+_e.responseText);
var _f=Sarissa.getDomDocument();
_f.parseError=-1;
return _f;
}else{
if(null==_e.responseXML){
alert("null XML response:"+_e.responseText);
}
return _e.responseXML;
}
}
function getProxyPlusUrl(url){
if(url.indexOf("http://")==0){
if(config.proxyUrl){
url=config.proxyUrl+"?url="+escape(url).replace(/\+/g,"%2C").replace(/\"/g,"%22").replace(/\'/g,"%27");
}else{
alert("unable to load external document:"+url+"  Set the proxyUrl property in config.");
url=null;
}
}
return url;
}
function createElementWithNS(doc,_12,_13){
if(_SARISSA_IS_IE){
var _14=doc.createElement(_12);
return _14;
}else{
return doc.createElementNS(_13,_12);
}
}
function UniqueId(){
this.lastId=0;
this.getId=function(){
this.lastId++;
return this.lastId;
};
}
var mbIds=new UniqueId();
function setISODate(_15){
var _16=_15.match(/(\d{4})-?(\d{2})?-?(\d{2})?T?(\d{2})?:?(\d{2})?:?(\d{2})?\.?(\d{0,3})?(Z)?/);
var res=null;
for(var i=1;i<_16.length;++i){
if(!_16[i]){
_16[i]=(i==3)?1:0;
if(!res){
res=i;
}
}
}
var _19=new Date();
_19.setFullYear(parseInt(_16[1],10));
_19.setMonth(parseInt(_16[2]-1,10));
_19.setDate(parseInt(_16[3],10));
_19.setHours(parseInt(_16[4],10));
_19.setMinutes(parseInt(_16[5],10));
_19.setSeconds(parseFloat(_16[6],10));
if(!res){
res=6;
}
_19.res=res;
return _19;
}
function getISODate(_1a){
var res=_1a.res?_1a.res:6;
var _1c="";
_1c+=res>1?_1a.getFullYear():"";
_1c+=res>2?"-"+leadingZeros(_1a.getMonth()+1,2):"";
_1c+=res>3?"-"+leadingZeros(_1a.getDate(),2):"";
_1c+=res>4?"T"+leadingZeros(_1a.getHours(),2):"";
_1c+=res>5?":"+leadingZeros(_1a.getMinutes(),2):"";
_1c+=res>6?":"+leadingZeros(_1a.getSeconds(),2):"";
return _1c;
}
function leadingZeros(num,_1e){
var _1f=parseInt(num,10);
var _20=Math.pow(10,_1e);
if(_1f<_20){
_1f+=_20;
}
return _1f.toString().substr(1);
}
function fixPNG(_21,_22){
if(_SARISSA_IS_IE){
var _23="id='"+_22+"' ";
var _24=(_21.className)?"class='"+_21.className+"' ":"";
var _25=(_21.title)?"title='"+_21.title+"' ":"title='"+_21.alt+"' ";
var _26="display:inline-block;"+_21.style.cssText;
var _27="<span "+_23+_24+_25;
_27+=" style=\""+"width:"+_21.width+"px; height:"+_21.height+"px;"+_26+";";
var src=_21.src;
src=src.replace(/\(/g,"%28");
src=src.replace(/\)/g,"%29");
src=src.replace(/'/g,"%27");
src=src.replace(/%23/g,"%2523");
_27+="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader";
_27+="(src='"+src+"', sizingMethod='scale'); \"></span>";
return _27;
}
}
function getAbsX(elt){
return (elt.x)?elt.x:getAbsPos(elt,"Left")+2;
}
function getAbsY(elt){
return (elt.y)?elt.y:getAbsPos(elt,"Top")+2;
}
function getAbsPos(elt,_2c){
iPos=0;
while(elt!=null){
iPos+=elt["offset"+_2c];
elt=elt.offsetParent;
}
return iPos;
}
function getPageX(e){
var _2e=0;
if(!e){
var e=window.event;
}
if(e.pageX){
_2e=e.pageX;
}else{
if(e.clientX){
_2e=e.clientX;
}
}
if(document.body&&document.body.scrollLeft){
_2e+=document.body.scrollLeft;
}else{
if(document.documentElement&&document.documentElement.scrollLeft){
_2e+=document.documentElement.scrollLeft;
}
}
return _2e;
}
function getPageY(e){
var _30=0;
if(!e){
var e=window.event;
}
if(e.pageY){
_30=e.pageY;
}else{
if(e.clientY){
_30=e.clientY;
}
}
if(document.body&&document.body.scrollTop){
_30+=document.body.scrollTop;
}else{
if(document.documentElement&&document.documentElement.scrollTop){
_30+=document.documentElement.scrollTop;
}
}
return _30;
}
function getArgs(){
var _31=new Object();
var _32=location.search.substring(1);
var _33=_32.split("&");
for(var i=0;i<_33.length;i++){
var pos=_33[i].indexOf("=");
if(pos==-1){
continue;
}
var _36=_33[i].substring(0,pos);
var _37=_33[i].substring(pos+1);
_31[_36]=unescape(_37.replace(/\+/g," "));
}
return _31;
}
window.cgiArgs=getArgs();
function getScreenX(_38,_39){
bbox=_38.getBoundingBox();
width=_38.getWindowWidth();
bbox[0]=parseFloat(bbox[0]);
bbox[2]=parseFloat(bbox[2]);
var _3a=(width/(bbox[2]-bbox[0]));
x=_3a*(_39-bbox[0]);
return x;
}
function getScreenY(_3b,_3c){
var _3d=_3b.getBoundingBox();
var _3e=_3b.getWindowHeight();
_3d[1]=parseFloat(_3d[1]);
_3d[3]=parseFloat(_3d[3]);
var _3f=(heighteight/(_3d[3]-_3d[1]));
var y=_3e-(_3f*(pt.y-_3d[1]));
return y;
}
function getGeoCoordX(_41,_42){
var _43=_41.getBoundingBox();
var _44=_41.getWindowWidth();
_43[0]=parseFloat(_43[0]);
_43[2]=parseFloat(_43[2]);
var _45=((_43[2]-_43[0])/_44);
var x=_43[0]+_45*(xCoord);
return x;
}
function getGeoCoordY(_47){
var _48=context.getBoundingBox();
var _49=context.getWindowHeight();
_48[1]=parseFloat(_48[1]);
_48[3]=parseFloat(_48[3]);
var _4a=((_48[3]-_48[1])/_49);
var y=_48[1]+_4a*(_49-_47);
return y;
}
function makeElt(_4c){
var _4d=document.createElement(_4c);
document.getElementsByTagName("body").item(0).appendChild(_4d);
return _4d;
}
var newWindow="";
function openPopup(url,_4f,_50){
if(_4f==null){
_4f=300;
}
if(_50==null){
_50=200;
}
if(!newWindow.closed&&newWindow.location){
newWindow.location.href=url;
}else{
newWindow=window.open(url,"name","height="+_50+",width="+_4f);
if(!newWindow.opener){
newwindow.opener=self;
}
}
if(window.focus){
newWindow.focus();
}
return false;
}
function debug(_51){
tarea=makeElt("textarea");
tarea.setAttribute("rows","3");
tarea.setAttribute("cols","40");
tnode=document.createTextNode(_51);
tarea.appendChild(tnode);
}
function returnTarget(evt){
evt=(evt)?evt:((window.event)?window.event:"");
var elt=null;
if(evt.target){
elt=evt.target;
}else{
if(evt.srcElement){
elt=evt.srcElement;
}
}
return elt;
}
function addEvent(_54,_55,_56){
if(document.addEventListener){
_54.addEventListener(_55,_56,false);
}else{
if(document.attachEvent){
_54.attachEvent("on"+_55,_56);
}
}
}
function handleEventWithObject(evt){
var elt=returnTarget(evt);
var obj=elt.ownerObj;
if(obj!=null){
obj.handleEvent(evt);
}
}

function Listener(){
this.listeners=new Array();
this.values=new Array();
this.addListener=function(_1,_2,_3){
if(window.logger){
logger.logEvent("addListener: "+_1,this.id,_3.id);
}
if(!this.listeners[_1]){
this.listeners[_1]=new Array();
}
this.removeListener(_1,_2,_3);
this.listeners[_1].push(new Array(_2,_3));
};
this.addFirstListener=function(_4,_5,_6){
if(window.logger){
logger.logEvent("addFirstListener: "+_4,this.id,_6.id);
}
if(!this.listeners[_4]){
this.listeners[_4]=new Array();
}
this.removeListener(_4,_5,_6);
this.listeners[_4].unshift(new Array(_5,_6));
};
this.removeListener=function(_7,_8,_9){
if(this.listeners[_7]){
for(var i=0;i<this.listeners[_7].length;i++){
if(this.listeners[_7][i][0]==_8&&this.listeners[_7][i][1]==_9){
for(var j=i;j<this.listeners[_7].length-1;j++){
this.listeners[_7][j]=this.listeners[_7][j+1];
}
this.listeners[_7].pop();
return;
}
}
}
};
this.callListeners=function(_c,_d){
if(this.listeners[_c]){
var _e=this.listeners[_c].length;
for(var i=0;i<_e;i++){
if(window.logger){
logger.logEvent(_c,this.id,this.listeners[_c][i][1].id,_d);
}
if(this.listeners[_c][i][0]){
this.listeners[_c][i][0](this.listeners[_c][i][1],_d);
}else{
alert("Listener error: param="+_c+", target="+this.listeners[_c][i][1].id+", callBackFunction="+this.listeners[_c][i][0]);
}
}
}
};
this.setParam=function(_10,_11){
this.values[_10]=_11;
this.callListeners(_10,_11);
};
this.getParam=function(_12){
return this.values[_12];
};
}

function ModelBase(_1,_2){
Listener.apply(this);
this.async=true;
this.contentType="text/xml";
this.modelNode=_1;
var _3=_1.attributes.getNamedItem("id");
if(_3){
this.id=_3.nodeValue;
}else{
this.id="MbModel_"+mbIds.getId();
}
var _4=_1.selectSingleNode("mb:title");
if(_4){
this.title=_4.firstChild.nodeValue;
}else{
this.title=this.id;
}
if(_1.selectSingleNode("mb:debug")){
this.debug="true";
}
if(window.cgiArgs[this.id]){
this.url=window.cgiArgs[this.id];
}else{
if(window[this.id]){
this.url=window[this.id];
}else{
if(_1.url){
this.url=_1.url;
}else{
var _5=_1.selectSingleNode("mb:defaultModelUrl");
if(_5){
this.url=_5.firstChild.nodeValue;
}
}
}
}
var _6=_1.selectSingleNode("mb:method");
if(_6){
this.method=_6.firstChild.nodeValue;
}else{
this.method="get";
}
var _7=_1.selectSingleNode("mb:namespace");
if(_7){
this.namespace=_7.firstChild.nodeValue;
}
var _8=_1.attributes.getNamedItem("template");
if(_8){
this.template=(_8.nodeValue=="true")?true:false;
this.modelNode.removeAttribute("template");
}
var _9=_1.selectSingleNode("mb:nodeSelectXpath");
if(_9){
this.nodeSelectXpath=_9.firstChild.nodeValue;
}
this.getXpathValue=function(_a,_b){
if(!_a.doc){
return null;
}
node=_a.doc.selectSingleNode(_b);
if(node&&node.firstChild){
return node.firstChild.nodeValue;
}else{
return null;
}
};
this.setXpathValue=function(_c,_d,_e,_f){
if(_f==null){
_f=true;
}
var _10=_c.doc.selectSingleNode(_d);
if(_10){
if(_10.firstChild){
_10.firstChild.nodeValue=_e;
}else{
dom=Sarissa.getDomDocument();
v=dom.createTextNode(_e);
_10.appendChild(v);
}
if(_f){
_c.setParam("refresh");
}
return true;
}else{
return false;
}
};
this.loadModelDoc=function(_11){
if(_11.url){
_11.callListeners("newModel");
_11.setParam("modelStatus","loading");
if(_11.contentType=="image"){
_11.doc=new Image();
_11.doc.src=_11.url;
}else{
var _12=new XMLHttpRequest();
var _13=_11.url;
if(_13.indexOf("http://")==0){
if(_11.method=="get"){
_13=getProxyPlusUrl(_13);
}else{
_13=config.proxyUrl;
}
}
_12.open(_11.method,_13,_11.async);
if(_11.method=="post"){
_12.setRequestHeader("content-type",_11.contentType);
_12.setRequestHeader("serverUrl",_11.url);
}
_12.onreadystatechange=function(){
_11.setParam("modelStatus",httpStatusMsg[_12.readyState]);
if(_12.readyState==4){
if(_12.status>=400){
var _14="error loading document: "+_13+" - "+_12.statusText+"-"+_12.responseText;
alert(_14);
_11.setParam("modelStatus",_14);
return;
}else{
if(null==_12.responseXML){
alert("null XML response:"+_12.responseText);
}else{
if((_12.responseXML!=null)&&(_12.responseXML.root!=null)&&(_12.responseXML.root.children.length>0)){
_11.doc=_12.responseXML;
if(_11.doc.parseError==0){
_11.finishLoading();
}else{
alert("Parsing Error:"+_11.doc.parseError+" "+Sarissa.getParseErrorText(_11.doc));
}
}else{
_11.doc=Sarissa.getDomDocument();
_11.doc.async=false;
_11.doc=(new DOMParser()).parseFromString(_12.responseText,"text/xml");
if(_11.doc==null){
alert("Document parseError:"+Sarissa.getParseErrorText(_11.doc));
}else{
if(_11.doc.parseError==0){
_11.finishLoading();
}else{
alert("Parsing Error:"+_11.doc.parseError+" "+Sarissa.getParseErrorText(_11.doc));
}
}
}
}
}
}
};
_12.send(_11.postData);
if(!_11.async){
if(_12.status>=400){
var _15="error loading document: "+_13+" - "+_12.statusText+"-"+_12.responseText;
alert(_15);
this.objRef.setParam("modelStatus",_15);
return;
}else{
if(null==_12.responseXML){
alert("null XML response:"+_12.responseText);
}
_11.doc=_12.responseXML;
_11.finishLoading();
}
}
}
}
};
this.addListener("reloadModel",this.loadModelDoc,this);
this.setModel=function(_16,_17){
_16.callListeners("newModel");
_16.doc=_17;
if((_17==null)&&_16.url){
_16.url=null;
}
_16.finishLoading();
};
this.finishLoading=function(){
if(this.doc){
this.doc.setProperty("SelectionLanguage","XPath");
if(this.namespace){
Sarissa.setXpathNamespaces(this.doc,this.namespace);
}
if(this.debug){
alert("Loading Model:"+this.id+" "+Sarissa.serialize(this.doc));
}
this.callListeners("loadModel");
}
};
this.newRequest=function(_18,_19){
var _1a=_18;
if(_18.template){
var _1b=_18.modelNode.parentNode;
var _1c=_1b.appendChild(_18.modelNode.ownerDocument.importNode(_18.modelNode,true));
_1c.removeAttribute("id");
_1a=_18.createObject(_1c);
_1a.callListeners("init");
if(!_18.templates){
_18.templates=new Array();
}
_18.templates.push(_1a);
}
_1a.url=_19.url;
if(!_1a.url){
_1a.doc=null;
}
_1a.method=_19.method;
_1a.postData=_19.postData;
_1a.loadModelDoc(_1a);
};
this.deleteTemplates=function(){
if(this.templates){
while(model=this.templates.pop()){
model.setParam("newModel");
var _1d=this.modelNode.parentNode;
_1d.removeChild(model.modelNode);
}
}
};
this.saveModel=function(_1e){
if(config.serializeUrl){
var _1f=postLoad(config.serializeUrl,_1e.doc);
_1f.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_1f,"xmlns:xlink='http://www.w3.org/1999/xlink'");
var _20=_1f.selectSingleNode("//OnlineResource");
var _21=_20.attributes.getNamedItem("xlink:href").nodeValue;
_1e.setParam("modelSaved",_21);
}else{
alert("serializeUrl must be specified in config to save a model");
}
};
this.createObject=function(_22){
var _23=_22.nodeName;
var _24=new window[_23](_22,this);
if(_24){
config.objects[_24.id]=_24;
return _24;
}else{
alert("error creating object:"+_23);
}
};
this.loadObjects=function(_25){
var _26=this.modelNode.selectNodes(_25);
for(var i=0;i<_26.length;i++){
this.createObject(_26[i]);
}
};
this.parseConfig=function(_28){
_28.loadObjects("mb:widgets/*");
_28.loadObjects("mb:tools/*");
_28.loadObjects("mb:models/*");
};
this.refresh=function(_29){
_29.setParam("refresh");
};
this.addListener("loadModel",this.refresh,this);
this.init=function(_2a){
_2a.callListeners("init");
};
this.clearModel=function(_2b){
_2b.doc=null;
};
if(_2){
this.parentModel=_2;
this.parentModel.addListener("init",this.init,this);
this.parentModel.addListener("loadModel",this.loadModelDoc,this);
this.parentModel.addListener("newModel",this.clearModel,this);
this.parseConfig(this);
}
}
var httpStatusMsg=["uninitialized","loading","loaded","interactive","completed"];

function Config(_1){
this.doc=Sarissa.getDomDocument();
this.doc.async=false;
this.doc.validateOnParse=false;
this.doc.load(_1);
if(this.doc.parseError<0){
alert("error loading config document: "+_1);
}
this.url=_1;
this.namespace="xmlns:mb='"+mbNsUrl+"'";
this.doc.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(this.doc,this.namespace);
var _2=Sarissa.getDomDocument();
_2.async=false;
_2.validateOnParse=false;
_2.load(baseDir+"/"+mbServerConfig);
if(_2.parseError<0){
}else{
_2.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_2,this.namespace);
var _3=_2.selectSingleNode("/mb:MapbuilderConfig/mb:proxyUrl");
if(_3){
this.proxyUrl=_3.firstChild.nodeValue;
}
_3=_2.selectSingleNode("/mb:MapbuilderConfig/mb:serializeUrl");
if(_3){
this.serializeUrl=_3.firstChild.nodeValue;
}
}
_2=null;
this.loadConfigScripts=function(){
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:models/*"),"model/");
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:widgets/*"),"widget/");
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:tools/*"),"tool/");
var _4=this.doc.selectNodes("//mb:scriptFile");
for(var i=0;i<_4.length;i++){
scriptFile=_4[i].firstChild.nodeValue;
mapbuilder.loadScript(scriptFile);
}
};
this.lang="en";
if(window.cgiArgs["language"]){
this.lang=window.cgiArgs["language"];
}else{
if(window.language){
this.lang=window.language;
}
}
var _6=this.doc.documentElement;
this.skinDir=_6.selectSingleNode("mb:skinDir").firstChild.nodeValue;
var _7=_6.selectSingleNode("mb:proxyUrl");
if(_7){
this.proxyUrl=_7.firstChild.nodeValue;
}
var _8=_6.selectSingleNode("mb:serializeUrl");
if(_8){
this.serializeUrl=_8.firstChild.nodeValue;
}
var _9=_6.selectSingleNode("mb:widgetTextUrl");
if(_9){
var _a=this.skinDir+"/"+this.lang+"/"+_9.firstChild.nodeValue;
this.widgetText=Sarissa.getDomDocument();
this.widgetText.async=false;
this.widgetText.validateOnParse=false;
this.widgetText.load(_a);
if(this.widgetText.parseError<0){
alert("error loading widgetText document: "+_a);
}
this.widgetText.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(this.widgetText,this.namespace);
}
this.objects=new Object();
ModelBase.apply(this,new Array(_6));
this.loadModel=function(_b,_c){
var _d=this.objects[_b];
if(_d&&_c){
var _e=new Object();
_e.method=_d.method;
_e.url=_c;
_d.newRequest(_d,_e);
}else{
alert("config loadModel error:"+_b+":"+_c);
}
};
this.paintWidget=function(_f){
if(_f){
_f.paint(_f,_f.id);
}else{
alert("config paintWidget error: widget does not exist");
}
};
}
if(document.readyState==null){
mapbuilder.setLoadState(MB_LOAD_CONFIG);
config=new Config(mbConfigUrl);
config[config.id]=config;
config.loadConfigScripts();
}

function OwsContext(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink'";
this.setHidden=function(_3,_4){
var _5="0";
if(_4){
_5="1";
}
var _6=this.getFeatureNode(_3);
_6.setAttribute("hidden",_5);
this.callListeners("hidden",_3);
};
this.getHidden=function(_7){
var _8=1;
var _9=this.getFeatureNode(_7);
return _9.getAttribute("hidden");
};
this.getBoundingBox=function(){
var _a=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
var _b=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
var _c=new String(_a.firstChild.nodeValue+" "+_b.firstChild.nodeValue).split(" ");
var _d=new Array();
for(i=0;i<_c.length;++i){
_d[i]=parseFloat(_c[i]);
}
return _d;
};
this.setBoundingBox=function(_e){
var _f=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
_f.firstChild.nodeValue=_e[0]+" "+_e[1];
var _10=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
_10.firstChild.nodeValue=_e[2]+" "+_e[3];
this.callListeners("bbox",_e);
};
this.initBbox=function(_11){
if(window.cgiArgs["bbox"]){
var _12=window.cgiArgs["bbox"].split(",");
_11.setBoundingBox(_12);
}
};
this.addListener("loadModel",this.initBbox,this);
this.initAoi=function(_13){
if(window.cgiArgs["aoi"]){
var aoi=window.cgiArgs["aoi"].split(",");
_13.setParam("aoi",new Array(new Array(aoi[0],aoi[3]),new Array(aoi[2],aoi[1])));
}
};
this.addListener("loadModel",this.initAoi,this);
this.setSRS=function(srs){
var _16=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
_16.setAttribute("crs",srs);
this.callListeners("srs");
};
this.getSRS=function(){
if(this.doc){
var _17=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
srs=_17.getAttribute("crs");
return srs;
}
};
this.getWindowWidth=function(){
if(this.doc){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
width=win.getAttribute("width");
return width;
}
};
this.setWindowWidth=function(_19){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
win.setAttribute("width",_19);
this.callListeners("resize");
};
this.getWindowHeight=function(){
if(this.doc){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
height=win.getAttribute("height");
return height;
}
};
this.setWindowHeight=function(_1c){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
win.setAttribute("height",_1c);
this.callListeners("resize");
};
this.getServerUrl=function(_1e,_1f,_20){
return _20.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
};
this.getVersion=function(_21){
return _21.selectSingleNode("wmc:Server").getAttribute("version");
};
this.getMethod=function(_22){
return _22.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
};
this.getFeatureNode=function(_23){
if(this.doc){
var _24=this.doc.selectSingleNode("//wmc:ResourceList/*[wmc:Name='"+_23+"']");
if(_24==null){
alert("feature not found");
}
return _24;
}
};
this.loadFeatures=function(_25){
var _26=_25.nodeSelectXpath+"/wmc:FeatureType[wmc:Server/@service='OGC:WFS']/wmc:Name";
var _27=_25.doc.selectNodes(_26);
for(var i=0;i<_27.length;i++){
var _29=_27[i].firstChild.nodeValue;
_25.setParam("wfs_GetFeature",_29);
}
};
this.addListener("loadModel",this.loadFeatures,this);
this.setRequestParameters=function(_2a,_2b){
var _2c=this.getFeatureNode(_2a);
if(_2c.selectSingleNode("ogc:Filter")){
_2b.setParameter("filter",escape(Sarissa.serialize(_2c.selectSingleNode("ogc:Filter"))));
}
};
this.getQueryableLayers=function(){
var _2d=this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[attribute::queryable='1']/wmc:Name");
return _2d;
};
this.getAllLayers=function(){
var _2e=this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer");
return _2e;
};
this.getLayer=function(_2f){
var _30=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_2f+"']");
if(_30==null){
_30=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:RssLayer[@id='"+_2f+"']");
}
return _30;
};
this.addLayer=function(_31,_32){
if(_31.doc!=null){
var _33=_31.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList");
_33.appendChild(_32.cloneNode(true));
_31.modified=true;
}else{
alert("null OWSContext doc");
}
};
this.addFirstListener("addLayer",this.addLayer,this);
this.deleteLayer=function(_34,_35){
var _36=_34.getLayer(_35);
if(!_36){
alert("node note found; unable to delete node:"+_35);
return;
}
_36.parentNode.removeChild(_36);
_34.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_37,_38){
var _39=_37.getLayer(_38);
var _3a=_39.selectSingleNode("following-sibling::*");
if(!_3a){
alert("can't move node past beginning of list:"+_38);
return;
}
_39.parentNode.insertBefore(_3a,_39);
_37.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_3b,_3c){
var _3d=_3b.getLayer(_3c);
var _3e=_3d.selectNodes("preceding-sibling::*");
var _3f=_3e[_3e.length-1];
if(!_3f){
alert("can't move node past beginning of list:"+_3c);
return;
}
_3d.parentNode.insertBefore(_3d,_3f);
_3b.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.setExtension=function(_40){
var _41=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
if(!_41){
var _42=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General");
var _43=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_41=_42.appendChild(_43);
}
return _41.appendChild(_40);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
};
this.initTimeExtent=function(_44){
var _45=_44.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_45.length;++i){
var _47=_45[i];
_44.timestampList=createElementWithNS(_44.doc,"TimestampList",mbNsUrl);
var _48=_47.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
_44.timestampList.setAttribute("layerName",_48);
var _49=_47.firstChild.nodeValue.split(",");
for(var j=0;j<_49.length;++j){
var _4b=_49[j].split("/");
if(_4b.length==3){
var _4c=setISODate(_4b[0]);
var _4d=setISODate(_4b[1]);
var _4e=_4b[2];
var _4f=_4e.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_4f.length;++i){
if(!_4f[i]){
_4f[i]=0;
}
}
do{
var _50=createElementWithNS(_44.doc,"Timestamp",mbNsUrl);
_50.appendChild(_44.doc.createTextNode(getISODate(_4c)));
_44.timestampList.appendChild(_50);
_4c.setFullYear(_4c.getFullYear()+parseInt(_4f[2],10));
_4c.setMonth(_4c.getMonth()+parseInt(_4f[4],10));
_4c.setDate(_4c.getDate()+parseInt(_4f[6],10));
_4c.setHours(_4c.getHours()+parseInt(_4f[8],10));
_4c.setMinutes(_4c.getMinutes()+parseInt(_4f[10],10));
_4c.setSeconds(_4c.getSeconds()+parseFloat(_4f[12]));
}while(_4c.getTime()<=_4d.getTime());
}else{
var _50=createElementWithNS(_44.doc,"Timestamp",mbNsUrl);
_50.appendChild(_44.doc.createTextNode(_49[j]));
_44.timestampList.appendChild(_50);
}
}
_44.setExtension(_44.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.getCurrentTimestamp=function(_51){
var _52=this.getParam("timestamp");
return this.timestampList.childNodes[_52].firstChild.nodeValue;
};
}

function ContextCollection(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.insertContext=function(_3,_4){
};
this.deleteContext=function(id){
};
this.reorderContext=function(_6,_7){
};
this.selectContext=function(_8,_9){
for(var i=0;i<this.listeners["select"].length;i++){
this.listeners["select"][i][0](_8,this.listeners["select"][i][1]);
}
};
}

mapbuilder.loadScript(baseDir+"/graphics/RssLayer.js");
function GeoRSS(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.initItems=function(_3){
var _4=_3.doc.selectNodes("rdf:RDF/rss:item");
if(_4.length==0){
_4=_3.doc.selectNodes("atom:feed/atom:entry");
}
for(var i=0;i<_4.length;++i){
var _6=_4[i];
_6.setAttribute("divid","RSS_Item_"+mbIds.getId());
}
};
this.getFeatureNodes=function(){
return this.doc.selectNodes(this.nodeSelectXpath);
};
this.getFeatureName=function(_7){
var _8=_7.selectSingleNode("rss:title");
if(_8==null){
_8=_7.selectSingleNode("atom:title");
}
return _8?_8.firstChild.nodeValue:"No RSS title";
};
this.getFeatureId=function(_9){
var id=_9.getAttribute("divid");
if(id){
return id;
}
return "no_id";
};
this.getFeaturePoint=function(_b){
if(_b.selectSingleNode("geo:long")){
var _c=_b.selectSingleNode("geo:long").firstChild.nodeValue;
var _d=_b.selectSingleNode("geo:lat").firstChild.nodeValue;
return new Array(_c,_d);
}else{
var _e=_b.selectSingleNode("georss:where/gml:Point/gml:pos");
if(_e!=null){
var _f=_e.firstChild.nodeValue;
var _10=_f.split(" ");
var _c=_10[0];
var _d=_10[1];
return new Array(_c,_d);
}else{
return new Array(0,0);
}
}
};
this.getFeatureGeometry=function(_11){
if(_11.selectSingleNode("geo:long")){
var _12=_11.selectSingleNode("geo:long").firstChild.nodeValue;
var _13=_11.selectSingleNode("geo:lat").firstChild.nodeValue;
return "POINT "+_12+","+_13;
}
var pos=_11.selectSingleNode("georss:where/gml:Point/gml:pos");
if(pos!=null){
var _15=pos.firstChild.nodeValue;
return "POINT "+_15;
}
var _16=_11.selectSingleNode("georss:where/gml:LineString/gml:posList");
if(_16!=null){
var _17=_16.childNodes;
var _18=_17.length;
var _19="";
for(var i=0;i<_18;i++){
_19+=_17[i].nodeValue;
}
return "LINESTRING "+_19;
}
var _16=_11.selectSingleNode("georss:where/gml:Polygon/gml:exterior/gml:LinearRing");
if(_16!=null){
var _15=_16.firstChild.nodeValue;
return "POLYGON "+_15;
}
alert("Invalid GML Geometry");
return null;
};
this.getFeatureGml=function(_1b){
var _1c=_1b.selectSingleNode("georss:where");
if(_1c!=null){
var gml=_1c.firstChild;
return gml;
}else{
return null;
}
};
this.getFeatureIcon=function(_1e){
if(_1e==null){
return null;
}
var _1f=_1e.selectSingleNode("atom:icon");
if(_1f!=undefined){
return _1f.firstChild.nodeValue;
}else{
return null;
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/graphics/MapLayerMgr.js");
function MapPane2(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
if(!this.stylesheet){
var _3=_1.selectSingleNode("mb:stylesheet");
if(_3){
this.stylesheet=new XslProcessor(_3.firstChild.nodeValue,_2.namespace);
}else{
this.stylesheet=new XslProcessor(baseDir+"/widget/"+_1.nodeName+".xsl",_2.namespace);
}
}
var _4=_1.selectSingleNode("mb:loadingSrc");
if(_4){
this.loadingSrc=config.skinDir+_4.firstChild.nodeValue;
}else{
this.loadingSrc=config.skinDir+"/images/Loading.gif";
}
for(var j=0;j<_1.childNodes.length;j++){
if(_1.childNodes[j].firstChild&&_1.childNodes[j].firstChild.nodeValue){
this.stylesheet.setParameter(_1.childNodes[j].nodeName,_1.childNodes[j].firstChild.nodeValue);
}
}
this.stylesheet.setParameter("modelId",this.model.id);
this.stylesheet.setParameter("modelTitle",this.model.title);
this.stylesheet.setParameter("widgetId",this.id);
this.stylesheet.setParameter("skinDir",config.skinDir);
this.stylesheet.setParameter("lang",config.lang);
this.MapLayerMgr=new MapLayerMgr(this,_2);
this.model.addListener("refresh",this.paint,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("moveLayerUp",this.moveLayerUp,this);
this.model.addListener("moveLayerDown",this.moveLayerDown,this);
}
MapPane2.prototype.paint=function(_6,_7){
if(_6.model.doc&&_6.node&&(_6.autoRefresh||_7)){
_6.stylesheet.setParameter("width",_6.model.getWindowWidth());
_6.stylesheet.setParameter("height",_6.model.getWindowHeight());
_6.stylesheet.setParameter("bbox",_6.model.getBoundingBox().join(","));
_6.stylesheet.setParameter("srs",_6.model.getSRS());
if(_6.debug){
alert("painting:"+Sarissa.serialize(_6.model.doc));
}
if(_6.debug){
alert("stylesheet:"+Sarissa.serialize(_6.stylesheet.xslDom));
}
var _8=_6.stylesheet.transformNodeToObject(_6.model.doc);
if(_8.parseError!=0){
alert("parse error:"+Sarissa.getParseErrorText(_8));
}
var _9=_8.selectNodes("//img");
if(_6.debug){
alert("painting:"+_6.id+":"+s);
if(config.serializeUrl){
postLoad(config.serializeUrl,s);
}
}
_6.MapLayerMgr.deleteAllLayers();
var _a=document.getElementById(_6.outputNodeId);
if(!_a){
_a=document.createElement("div");
_a.setAttribute("id",_6.outputNodeId);
_a.style.position="absolute";
_6.node.appendChild(_a);
_a.style.left="0px";
_a.style.top="0px";
}
var _b=_6.model.getAllLayers();
_6.firstImageLoaded=false;
_6.layerCount=_b.length;
for(var i=0;i<_b.length;i++){
var _d=_6.MapLayerMgr.addLayer(_6.MapLayerMgr,_b[i]);
var _e=_9[i].getAttribute("src");
_d.setSrc(_e);
}
var _f="loading "+_6.layerCount+" map layers";
_6.model.setParam("modelStatus",_f);
_6.MapLayerMgr.paintWmsLayers(_6.MapLayerMgr);
}
};
MapPane2.prototype.getLayer=function(_10){
return this.MapLayerMgr(_10);
};
MapPane2.prototype.getLayerDivId=function(_11){
return this.model.id+"_"+this.id+"_"+_11;
};
MapPane2.prototype.deleteLayer=function(_12,_13){
var _14=_12.getLayerDivId(_13);
if(_14!=null){
var _15=document.getElementById(_14);
if(_15!=null){
var _16=document.getElementById(_12.outputNodeId);
_16.removeChild(_15);
}
}
};
MapPane2.prototype.moveLayerUp=function(_17,_18){
var _19=document.getElementById(_17.outputNodeId);
var _1a=_17.getLayerDivId(_18);
var _1b=document.getElementById(_1a);
var _1c=_1b.nextSibling;
if(!_1c){
alert("can't move node past beginning of list:"+_18);
return;
}
_19.insertBefore(_1c,_1b);
};
MapPane2.prototype.moveLayerDown=function(_1d,_1e){
var _1f=document.getElementById(_1d.outputNodeId);
var _20=_1d.getLayerDivId(_1e);
var _21=document.getElementById(_20);
var _22=_21.previousSibling;
if(!_22){
alert("can't move node past end of list:"+_1e);
return;
}
_1f.insertBefore(_21,_22);
};
MapPane2.prototype.clearWidget2=function(_23){
_23.MapLayerMgr.deleteAllLayers();
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function Loading2(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:imageSrc");
if(_3){
this.imageSrc=config.skinDir+_3.firstChild.nodeValue;
}else{
this.imageSrc=config.skinDir+"/images/Loading.gif";
}
var _4=_1.selectSingleNode("mb:textMessage");
if(_4){
this.textMessage=_4.firstChild.nodeValue;
}else{
this.textMessage="Document loading, please wait...";
}
this.updateMessage=this.textMessage;
var _5=_1.selectSingleNode("mb:mapContainerId");
if(_5){
this.containerNodeId=_5.firstChild.nodeValue;
this.node=document.getElementById(this.containerNodeId);
}
this.model.addListener("newModel",this.paint,this);
this.model.addListener("loadModel",this.clear,this);
this.model.addListener("bbox",this.paint,this);
this.model.addListener("refresh",this.paint,this);
this.model.addListener("modelStatus",this.update,this);
}
Loading2.prototype.paint=function(_6){
if(_6.node){
var _7=document.getElementById(_6.outputNodeId+"_loading");
if(!_7){
_7=document.createElement("div");
_7.setAttribute("id",_6.outputNodeId+"_loading");
_6.node.appendChild(_7);
}
_7.className="loadingIndicator";
_7.style.zIndex=1000;
_7.style.position="absolute";
_7.style.left="0px";
_7.style.top="0px";
if(_6.imageSrc){
var _8=document.getElementById(_6.outputNodeId+"_imageNode");
if(!_8){
_8=document.createElement("img");
_8.setAttribute("id",_6.outputNodeId+"_imageNode");
_7.appendChild(_8);
_8.style.zIndex=1000;
}
_8.src=_6.imageSrc;
}
if(_6.updateMessage){
var _9=document.getElementById(_6.outputNodeId+"_messageNode");
if(!_9){
_9=document.createElement("p");
_9.setAttribute("id",_6.outputNodeId+"_messageNode");
_7.appendChild(_9);
}
_9.innerHTML=_6.updateMessage;
}
}
};
Loading2.prototype.clear=function(_a){
var _b=document.getElementById(_a.outputNodeId+"_loading");
if(_b){
_a.node.removeChild(_b);
}
};
Loading2.prototype.update=function(_c,_d){
if(_d){
_c.updateMessage=_d;
_c.paint(_c);
}else{
_c.clear(_c);
}
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function AoiBoxDHTML(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.lineWidth=_1.selectSingleNode("mb:lineWidth").firstChild.nodeValue;
this.lineColor=_1.selectSingleNode("mb:lineColor").firstChild.nodeValue;
this.crossSize=parseInt(_1.selectSingleNode("mb:crossSize").firstChild.nodeValue);
this.paint=function(_3){
var _4=_3.model.getParam("aoi");
if(_4){
var ul=_3.model.extent.getPL(_4[0]);
var lr=_3.model.extent.getPL(_4[1]);
if((Math.abs(ul[0]-lr[0])<_3.crossSize)&&(Math.abs(ul[1]-lr[1])<_3.crossSize)){
_3.drawCross(new Array((ul[0]+lr[0])/2,(ul[1]+lr[1])/2));
}else{
_3.drawBox(ul,lr);
}
}
};
_2.addListener("aoi",this.paint,this);
MapContainerBase.apply(this,new Array(_1,_2));
this.setVis=function(_7){
var _8="hidden";
if(_7){
_8="visible";
}
this.Top.style.visibility=_8;
this.Left.style.visibility=_8;
this.Right.style.visibility=_8;
this.Bottom.style.visibility=_8;
};
this.clear=function(_9){
_9.setVis(false);
};
this.containerModel.addListener("bbox",this.clear,this);
this.drawBox=function(ul,lr){
this.Top.style.left=ul[0]+"px";
this.Top.style.top=ul[1]+"px";
this.Top.style.width=lr[0]-ul[0]+"px";
this.Top.style.height=this.lineWidth+"px";
this.Left.style.left=ul[0]+"px";
this.Left.style.top=ul[1]+"px";
this.Left.style.width=this.lineWidth+"px";
this.Left.style.height=lr[1]-ul[1]+"px";
this.Right.style.left=lr[0]-this.lineWidth+"px";
this.Right.style.top=ul[1]+"px";
this.Right.style.width=this.lineWidth+"px";
this.Right.style.height=lr[1]-ul[1]+"px";
this.Bottom.style.left=ul[0]+"px";
this.Bottom.style.top=lr[1]-this.lineWidth+"px";
this.Bottom.style.width=lr[0]-ul[0]+"px";
this.Bottom.style.height=this.lineWidth+"px";
this.setVis(true);
};
this.drawCross=function(_c){
this.Top.style.left=Math.floor(_c[0]-this.crossSize/2)+"px";
this.Top.style.top=Math.floor(_c[1]-this.lineWidth/2)+"px";
this.Top.style.width=this.crossSize+"px";
this.Top.style.height=this.lineWidth+"px";
this.Top.style.visibility="visible";
this.Left.style.left=Math.floor(_c[0]-this.lineWidth/2)+"px";
this.Left.style.top=Math.floor(_c[1]-this.crossSize/2)+"px";
this.Left.style.width=this.lineWidth+"px";
this.Left.style.height=this.crossSize+"px";
this.Left.style.visibility="visible";
this.Right.style.visibility="hidden";
this.Bottom.style.visibility="hidden";
};
this.getImageDiv=function(){
var _d=document.createElement("div");
_d.innerHTML="<img src='"+config.skinDir+"/images/Spacer.gif' width='1px' height='1px'/>";
_d.style.position="absolute";
_d.style.backgroundColor=this.lineColor;
_d.style.visibility="hidden";
_d.style.zIndex=900;
this.node.appendChild(_d);
return _d;
};
this.loadAoiBox=function(_e){
_e.Top=_e.getImageDiv();
_e.Bottom=_e.getImageDiv();
_e.Left=_e.getImageDiv();
_e.Right=_e.getImageDiv();
_e.paint(_e);
};
this.loadAoiBox(this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function CursorTrack(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.showPx=false;
this.showXY=false;
this.showLatLong=true;
this.showDMS=false;
this.showMGRS=false;
this.precision=2;
var _3=_1.selectSingleNode("mb:showXY");
if(_3){
this.showXY=(_3.firstChild.nodeValue=="false")?false:true;
}
var _4=_1.selectSingleNode("mb:showPx");
if(_4){
this.showPx=(_4.firstChild.nodeValue=="false")?false:true;
}
var _5=_1.selectSingleNode("mb:showLatLong");
if(_5){
this.showLatLong=(_5.firstChild.nodeValue=="false")?false:true;
}
var _6=_1.selectSingleNode("mb:showDMS");
if(_6){
this.showDMS=(_6.firstChild.nodeValue=="false")?false:true;
}
var _7=_1.selectSingleNode("mb:showMGRS");
if(_7){
this.showMGRS=(_7.firstChild.nodeValue=="false")?false:true;
mapbuilder.loadScript(baseDir+"/util/MGRS.js");
}
var _8=_1.selectSingleNode("mb:precision");
if(_8){
this.precision=_8.firstChild.nodeValue;
}
this.mouseOverHandler=function(_9,_a){
_9.coordForm=document.getElementById(_9.formName);
window.cursorTrackObject=_9;
window.cursorTrackNode=_a;
_9.mouseOver=true;
_9.mouseTrackTimer=setInterval(ReportCoords,100,_9);
};
this.mouseOutHandler=function(_b,_c){
if(_b.mouseTrackTimer){
clearInterval(_b.mouseTrackTimer);
}
_b.mouseOver=false;
if(_b.showLatLong){
if(_b.coordForm.longitude){
_b.coordForm.longitude.value="";
}
if(_b.coordForm.latitude){
_b.coordForm.latitude.value="";
}
}
if(_b.showDMS){
if(_b.coordForm.longdeg){
_b.coordForm.longdeg.value="";
}
if(_b.coordForm.longmin){
_b.coordForm.longmin.value="";
}
if(_b.coordForm.longsec){
_b.coordForm.longsec.value="";
}
if(_b.coordForm.latdeg){
_b.coordForm.latdeg.value="";
}
if(_b.coordForm.latmin){
_b.coordForm.latmin.value="";
}
if(_b.coordForm.latsec){
_b.coordForm.latsec.value="";
}
}
if(_b.showXY){
if(_b.coordForm.x){
_b.coordForm.x.value="";
}
if(_b.coordForm.y){
_b.coordForm.y.value="";
}
}
if(_b.showPx){
if(_b.coordForm.px){
_b.coordForm.px.value="";
}
if(_b.coordForm.py){
_b.coordForm.py.value="";
}
}
if(_b.showMGRS){
if(_b.coordForm.mgrs){
_b.coordForm.mgrs.value="";
}
}
};
this.init=function(_d){
var _e=_1.selectSingleNode("mb:mouseHandler");
if(_e){
_d.mouseHandler=eval("config.objects."+_e.firstChild.nodeValue);
_d.mouseHandler.addListener("mouseover",_d.mouseOverHandler,_d);
_d.mouseHandler.addListener("mouseout",_d.mouseOutHandler,_d);
}else{
alert("CursorTrack requires a mouseHandler property");
}
if(_d.showLatLong||_d.showDMS||_d.showMGRS){
_d.proj=new Proj(_d.model.getSRS());
}
if(this.showMGRS){
this.MGRS=new MGRS();
}
};
this.model.addListener("loadModel",this.init,this);
this.formName="CursorTrackForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}
function convertDMS(_f,_10){
_f=Math.floor(_f*100);
_f=_f/100;
abscoordinate=Math.abs(_f);
coordinatedegrees=Math.floor(abscoordinate);
coordinateminutes=(abscoordinate-coordinatedegrees)/(1/60);
tempcoordinateminutes=coordinateminutes;
coordinateminutes=Math.floor(coordinateminutes);
coordinateseconds=(tempcoordinateminutes-coordinateminutes)/(1/60);
coordinateseconds=Math.floor(coordinateseconds);
if(_10=="LAT"){
if(_f>=0){
coordinatehemi="N";
}else{
coordinatehemi="S";
}
}else{
if(_10=="LON"){
if(_f>=0){
coordinatehemi="E";
}else{
coordinatehemi="W";
}
}
}
if(coordinatedegrees<10){
coordinatedegrees="0"+coordinatedegrees;
}
if(coordinateminutes<10){
coordinateminutes="0"+coordinateminutes;
}
if(coordinateseconds<10){
coordinateseconds="0"+coordinateseconds;
}
_f=coordinatedegrees+" "+coordinateminutes+" "+coordinateseconds+" "+coordinatehemi;
return _f;
}
function ReportCoords(){
var _11=window.cursorTrackObject;
if(_11.mouseOver){
var _12=window.cursorTrackNode.evpl;
if(_11.showPx){
if(_11.coordForm.px){
_11.coordForm.px.value=_12[0];
}
if(_11.coordForm.py){
_11.coordForm.py.value=_12[1];
}
}
var _13=_11.model.extent.getXY(_12);
if(_11.showXY){
if(_11.coordForm.x){
_11.coordForm.x.value=_13[0].toFixed(_11.precision);
}
if(_11.coordForm.y){
_11.coordForm.y.value=_13[1].toFixed(_11.precision);
}
}
if(_11.showLatLong||_11.showDMS||_11.showMGRS){
var _14=_11.proj.Inverse(_13);
if(_11.showLatLong){
if(_11.coordForm.longitude){
_11.coordForm.longitude.value=_14[0].toFixed(_11.precision);
}
if(_11.coordForm.latitude){
_11.coordForm.latitude.value=_14[1].toFixed(_11.precision);
}
}
if(_11.showDMS){
var _15=convertDMS(_14[0],"LON").split(" ");
if(_11.coordForm.longdeg){
_11.coordForm.longdeg.value=_15[0];
}
if(_11.coordForm.longmin){
_11.coordForm.longmin.value=_15[1];
}
if(_11.coordForm.longsec){
_11.coordForm.longsec.value=_15[2];
}
if(_11.coordForm.longH){
_11.coordForm.longH.value=_15[3];
}
var _16=convertDMS(_14[1],"LAT").split(" ");
if(_11.coordForm.latdeg){
_11.coordForm.latdeg.value=_16[0];
}
if(_11.coordForm.latmin){
_11.coordForm.latmin.value=_16[1];
}
if(_11.coordForm.latsec){
_11.coordForm.latsec.value=_16[2];
}
if(_11.coordForm.latH){
_11.coordForm.latH.value=_16[3];
}
}
if(_11.showMGRS){
if(!_11.MGRS){
_11.MGRS=new MGRS();
}
_11.coordForm.mgrs.value=_11.MGRS.convert(_14[1],_14[0]);
}
}
}
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function MapScaleText(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.submitForm=function(){
var _3=this.mapScaleTextForm.mapScale.value;
this.model.extent.setScale(_3.split(",").join(""));
return false;
};
this.handleKeyPress=function(_4){
var _5;
var _6;
if(_4){
_5=_4.which;
_6=_4.currentTarget;
}else{
_5=window.event.keyCode;
_6=window.event.srcElement.form;
}
if(_5==13){
_6.parentWidget.submitForm();
return false;
}
};
this.showScale=function(_7){
if(_7.mapScaleTextForm){
var _8=Math.round(_7.model.extent.getScale());
var _9=new Array();
while(_8>=1000){
var _a=_8/1000;
_8=Math.floor(_a);
var _b=leadingZeros(Math.round((_a-_8)*1000).toString(),3);
_9.unshift(_b);
}
_9.unshift(_8);
_7.mapScaleTextForm.mapScale.value=_9.join(",");
}
};
this.model.addListener("bbox",this.showScale,this);
this.model.addListener("refresh",this.showScale,this);
this.prePaint=function(_c){
var _d=_c.model.extent.getScale();
this.stylesheet.setParameter("mapScale",_d);
};
this.postPaint=function(_e){
_e.mapScaleTextForm=document.getElementById(_e.formName);
_e.mapScaleTextForm.parentWidget=_e;
_e.mapScaleTextForm.onkeypress=_e.handleKeyPress;
_e.showScale(_e);
};
this.formName="MapScaleText_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function AoiForm(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.displayAoiCoords=function(_3,_4){
_3.aoiForm=document.getElementById(_3.formName);
var _5=_3.model.getParam("aoi");
if(_5&&_3.aoiForm){
_3.aoiForm.westCoord.value=_5[0][0];
_3.aoiForm.northCoord.value=_5[0][1];
_3.aoiForm.eastCoord.value=_5[1][0];
_3.aoiForm.southCoord.value=_5[1][1];
}
};
this.model.addListener("aoi",this.displayAoiCoords,this);
this.setAoi=function(){
var _6=this.model.getParam("aoi");
if(_6){
var ul=_6[0];
var lr=_6[1];
switch(this.name){
case "westCoord":
ul[0]=this.value;
break;
case "northCoord":
ul[1]=this.value;
break;
case "eastCoord":
lr[0]=this.value;
break;
case "southCoord":
lr[1]=this.value;
break;
}
this.model.setParam("aoi",new Array(ul,lr));
}
};
this.postPaint=function(_9){
_9.aoiForm=document.getElementById(_9.formName);
_9.aoiForm.westCoord.onblur=_9.setAoi;
_9.aoiForm.northCoord.onblur=_9.setAoi;
_9.aoiForm.eastCoord.onblur=_9.setAoi;
_9.aoiForm.southCoord.onblur=_9.setAoi;
_9.aoiForm.westCoord.model=_9.model;
_9.aoiForm.northCoord.model=_9.model;
_9.aoiForm.eastCoord.model=_9.model;
_9.aoiForm.southCoord.model=_9.model;
};
var _a=_1.selectSingleNode("mb:formName");
if(_a){
this.formName=_a.firstChild.nodeValue;
}else{
this.formName="AoiForm_"+mbIds.getId();
}
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Legend(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.prePaint=function(_3){
if(_3.model.featureName){
_3.stylesheet.setParameter("featureName",_3.model.featureName);
_3.stylesheet.setParameter("hidden",_3.model.getHidden(_3.model.featureName).toString());
}
};
this.refresh=function(_4,_5){
_4.paint(_4,_4.id);
};
this.selectLayer=function(_6,_7){
_6.model.setParam("selectedLayer",_7);
};
this.model.addListener("deleteLayer",this.refresh,this);
this.model.addListener("moveLayerUp",this.refresh,this);
this.model.addListener("moveLayerDown",this.refresh,this);
if(this.autoRefresh){
this.model.addListener("addLayer",this.refresh,this);
}
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function CollectionList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Widget(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
var toolTipObject;
var toolTipObjs=new Array();
function TipWidget(_1,_2){
this.tipIdName=_1.attributes.getNamedItem("id").nodeValue;
var _3=_1.selectSingleNode("mb:leftOffset");
if(_3!=undefined){
this.leftOffset=parseInt(_3.firstChild.nodeValue);
}
var _4=_1.selectSingleNode("mb:topOffset");
if(_4!=undefined){
this.topOffset=parseInt(_4.firstChild.nodeValue);
}
var _5=_1.selectSingleNode("mb:command");
if(_5!=undefined){
this.overLibCmd=_5.firstChild.nodeValue;
}
this.createDiv=function(){
var _6="overDiv";
var _7=document.getElementById(_6);
if(_7==undefined){
var _8=document.getElementById(this.tipIdName);
if(_8!=undefined){
_7=document.createElement("div");
_7.setAttribute("id",_6);
_7.setAttribute("style","");
_7.style.zIndex="10000";
_7.style.visibility="hidden";
var _9=_8.parentNode;
_9.removeChild(_8);
_9.appendChild(_7);
this.tipDiv=_7;
}else{
alert("Could not find div:"+this.tipIdName);
}
}else{
alert("div:"+_6+" already exists");
}
};
this.paint=function(_a){
var _b=parseInt(this.leftOffset);
var _c=parseInt(this.topOffset);
var x=parseInt(_a[0]);
if(x>_b){
x+=_b;
}
var y=parseInt(_a[1]);
if(y>_c){
y+=_c;
}
var id=_a[2];
var _10=_a[3];
var _11=this.dehtmlize(_a[4]);
var _12="<b>"+_10+"</b><hr/><br/>"+_11;
overlib(_12,CAPTION,"Caption",STICKY,WIDTH,"225",HEIGHT,"250",REFC,"UR",REFP,"LL",RELX,x,RELY,y);
};
this.dehtmlize=function(str){
str=str.replace(/&amp;/g,"&");
str=str.replace(/&lt;/g,"<");
str=str.replace(/&gt;/g,">");
str=str.replace(/&quot;/g,"'");
return str;
};
this.clear=function(){
nd();
};
toolTipObjs[this.tipIdName]=this;
}

function GeoRssParser(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:stylesheet");
if(_3){
var _4=_3.firstChild.nodeValue;
this.stylesheet=new XSLTProcessor();
var _5=Sarissa.getDomDocument();
_5.async=false;
_5.load(_4);
this.stylesheet.importStylesheet(_5);
}else{
alert("Parsing stylesheet not found");
}
var _6=_1.selectSingleNode("mb:tipWidget");
if(_6){
this.model.tipWidgetId=_6.firstChild.nodeValue;
}
this.model.addListener("refresh",this.paint,this);
this.model.addListener("init",this.geoRssParserInit,this);
}
GeoRssParser.prototype.geoRssParserInit=function(_7){
_7.targetModel.addListener("loadModel",_7.loadEntries,_7);
_7.targetModel.addListener("bbox",_7.loadEntries,_7);
_7.model.addListener("loadModel",_7.loadAndPaintEntries,_7);
};
GeoRssParser.prototype.transformEntry=function(_8,_9){
if(_8.stylesheet!=undefined){
var _a=_8.stylesheet.transformToDocument(_9);
Sarissa.setXpathNamespaces(_a,"xmlns:wmc='http://www.opengis.net/context'");
return _a;
}
};
GeoRssParser.prototype.loadAndPaintEntries=function(_b){
_b.loadEntries(_b);
_b.targetModel.callListeners("refreshOtherLayers");
};
GeoRssParser.prototype.loadEntries=function(_c){
if((_c.model.doc!=null)&&(_c.targetModel.doc!=null)){
var _d=_c.model.getFeatureNodes();
var _e=_d.length;
var _f=_c.containerModel.getWindowWidth();
var _10=_c.containerModel.getWindowHeight();
var _11=_c.targetModel.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:RssLayer");
if(_11.length>0){
for(var i=0;i<_11.length;i++){
var _13=_11[i];
var _14=_13.getAttribute("id");
if(_14!=null){
_c.targetModel.setParam("deleteLayer",_14);
}else{
alert("error deleting:"+Sarissa.serialize(_13));
}
}
}
if(_e==0){
return;
}
for(var _15=0;_15<_e;_15++){
var _16=_d[_15];
var id=_16.getAttribute("id");
if(id!=null){
_16.setAttribute("pid",id);
}
_16.setAttribute("id","RSS_Item_"+mbIds.getId());
_16.setAttribute("width",_f);
_16.setAttribute("height",_10);
var _13=_c.transformEntry(_c,_16);
_c.targetModel.setParam("addLayer",_13.childNodes[0]);
}
}
};
GeoRssParser.prototype.paint=function(_18){
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function SearchWidget(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.host=_1.selectSingleNode("mb:host").firstChild.nodeValue;
this.submitQuery=function(_3){
this.urlInputForm.defaultUrl.value=_3;
var _4=new Object();
_4.url=this.host+"?query="+_3;
_4.method=this.targetModel.method;
var _5=this.urlInputForm.defaultUrl.value;
if(_5.indexOf("?")>0){
this.stylesheet.setParameter("defaultUrl",this.urlInputForm.defaultUrl.value);
}
this.targetModel.newRequest(this.targetModel,_4);
};
this.submitForm=function(){
if(this.aoiFormId==undefined){
var _6=document.getElementsByTagName("form");
var _7=_6.length;
for(var i=_7-1;i>=0;i--){
var _9=new String(_6[i].getAttribute("id"));
if(_9.indexOf("AoiForm_")>=0){
this.aoiFormId=_9;
}
}
}
if(this.aoiFormId==undefined){
alert("Could not find aoiForm for geoSearch");
}
var _a="";
var _b=document.getElementById(this.aoiFormId);
if((_b!=null)&&(_b.westCoord.value!="")){
var _c=parseFloat(_b.westCoord.value);
var _d=parseFloat(_b.northCoord.value);
var _e=parseFloat(_b.eastCoord.value);
var _f=parseFloat(_b.southCoord.value);
_a="&ULLon="+_c.toPrecision(3)+"&ULLat="+_d.toPrecision(3)+"&LRLon="+_e.toPrecision(3)+"&LRLat="+_f.toPrecision(3);
}
var _10=new Object();
var _11=this.urlInputForm.defaultUrl.value;
_10.url=this.host+"?query="+escape(_11)+_a;
_10.method=this.targetModel.method;
this.stylesheet.setParameter("defaultUrl",_11);
this.targetModel.newRequest(this.targetModel,_10);
};
this.handleKeyPress=function(_12){
var _13;
var _14;
if(_12){
_13=_12.which;
_14=_12.currentTarget;
}else{
_13=window.event.keyCode;
_14=window.event.srcElement.form;
}
if(_13==13){
_14.parentWidget.submitForm();
return false;
}
};
this.prePaint=function(_15){
_15.stylesheet.setParameter("modelTitle",_15.targetModel.title);
};
this.postPaint=function(_16){
_16.urlInputForm=document.getElementById(_16.formName);
_16.urlInputForm.parentWidget=_16;
_16.urlInputForm.onkeypress=_16.handleKeyPress;
};
this.formName="urlInputForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Back(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doSelect=function(_3,_4){
if(_3){
this.targetModel.setParam("historyBack");
var _5=_4.targetModel.previousExtent;
if(_5){
this.targetModel.setParam("historyStop");
_4.targetModel.extent.zoomToBox(_5[0],_5[1]);
this.targetModel.setParam("historyStart");
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Forward(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doSelect=function(_3,_4){
if(_3){
this.targetModel.setParam("historyForward");
var _5=_4.targetModel.nextExtent;
if(_5){
this.targetModel.setParam("historyStop");
_4.targetModel.extent.zoomToBox(_5[0],_5[1]);
this.targetModel.setParam("historyStart");
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function ZoomIn(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.zoomBy=4;
this.doAction=function(_3,_4){
if(_3.enabled){
var _5=_3.targetModel.getParam("aoi");
if(_5!=null){
var _6=_3.targetModel.extent;
var ul=_5[0];
var lr=_5[1];
if((ul[0]==lr[0])&&(ul[1]==lr[1])){
_6.centerAt(ul,_6.res[0]/_3.zoomBy);
}else{
_6.zoomToBox(ul,lr);
}
}
}
};
this.setMouseListener=function(_9){
if(_9.mouseHandler){
_9.mouseHandler.model.addListener("mouseup",_9.doAction,_9);
}
};
this.model.addListener("loadModel",this.setMouseListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function ZoomOut(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.zoomBy=4;
this.doAction=function(_3,_4){
if(!_3.enabled){
return;
}
var _5=_3.targetModel.getParam("aoi");
var _6=_3.targetModel.extent;
var _7=_6.res[0]*_3.zoomBy;
_6.centerAt(_5[0],_7);
};
this.setMouseListener=function(_8){
if(_8.mouseHandler){
_8.mouseHandler.model.addListener("mouseup",_8.doAction,_8);
}
};
this.model.addListener("loadModel",this.setMouseListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function DragPan(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="move";
this.doAction=function(_3,_4){
if(_3.enabled){
var _5=_3.targetModel.getParam("aoi");
if(_3.targetModel.getParam("aoi")!=null){
var _6=_3.targetModel.extent;
var ul=_5[0];
var lr=_5[1];
if((ul[0]==lr[0])&&(ul[1]==lr[1])){
_6.centerAt(ul,_6.res[0]/_3.zoomBy);
}else{
_6.zoomToBox(ul,lr);
}
}
}
};
this.setMouseListener=function(_9){
if(_9.mouseHandler){
_9.mouseHandler.model.addListener("mouseup",_9.doAction,_9);
}
};
this.model.addListener("refresh",this.setMouseListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function SetAoi(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
this.doAction=function(_3,_4){
};
if(this.mouseHandler){
this.mouseHandler.model.addListener("mouseup",this.doAction,this);
}
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Reset(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="default";
this.initExtent=function(_3){
_3.originalExtent=new Extent(_3.targetModel);
_3.originalExtent.init(_3.originalExtent);
_3.originalExtent.setResolution(new Array(_3.targetModel.getWindowWidth(),_3.targetModel.getWindowHeight()));
};
this.initReset=function(_4){
_4.targetModel.addListener("loadModel",_4.initExtent,_4);
};
this.model.addListener("init",this.initReset,this);
this.doSelect=function(_5,_6){
if(_5){
var _7=_6.originalExtent;
_6.targetModel.extent.centerAt(_7.getCenter(),_7.res[0]);
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function ModelSwitcher(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.switchMap=function(_3,_4){
this.bbox=config.objects.mainMap.getBoundingBox();
this.targetModel.addListener("loadModel",this.setExtent,this);
window.cgiArgs["bbox"]=""+this.bbox[0]+","+this.bbox[1]+","+this.bbox[2]+","+this.bbox[3];
config.loadModel(_3,_4);
};
this.setExtent=function(_5){
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function GetMarkerInfo(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doAction=function(_3,_4){
};
if(this.mouseHandler){
this.mouseHandler.model.addListener("mouseup",this.doAction,this);
}
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function AoiMouseHandler(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.mouseUpHandler=function(_3,_4){
if(_3.enabled){
if(_3.started){
_3.started=false;
}
}
};
this.mouseDownHandler=function(_5,_6){
if(_5.enabled){
_5.started=true;
_5.anchorPoint=_6.evpl;
_5.dragBox(_6.evpl);
}
};
this.mouseMoveHandler=function(_7,_8){
if(_7.enabled){
if(_7.started){
_7.dragBox(_8.evpl);
}
}
};
this.mouseOutHandler=function(_9,_a){
if(_9.enabled){
if(_9.started){
_9.started=false;
}
}
};
this.mouseOverHandler=function(_b,_c){
if(_b.enabled){
}
};
this.dragBox=function(_d){
var ul=new Array();
var lr=new Array();
if(this.anchorPoint[0]>_d[0]){
ul[0]=_d[0];
lr[0]=this.anchorPoint[0];
}else{
ul[0]=this.anchorPoint[0];
lr[0]=_d[0];
}
if(this.anchorPoint[1]>_d[1]){
ul[1]=_d[1];
lr[1]=this.anchorPoint[1];
}else{
ul[1]=this.anchorPoint[1];
lr[1]=_d[1];
}
ul=this.model.extent.getXY(ul);
lr=this.model.extent.getXY(lr);
this.model.setParam("aoi",new Array(ul,lr));
};
this.model.addListener("mousedown",this.mouseDownHandler,this);
this.model.addListener("mousemove",this.mouseMoveHandler,this);
this.model.addListener("mouseup",this.mouseUpHandler,this);
}

function DragPanHandler(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.mouseUpHandler=function(_3,_4){
if(_3.enabled){
if(_3.dragging){
_3.dragging=false;
if((_3.deltaP==0)&&(_3.deltaL==0)){
return;
}
var _5=_3.model.getWindowWidth();
var _6=_3.model.getWindowHeight();
var ul=_3.model.extent.getXY(new Array(-_3.deltaP,-_3.deltaL));
var lr=_3.model.extent.getXY(new Array(_5-_3.deltaP,_6-_3.deltaL));
_3.model.setParam("aoi",new Array(ul,lr));
}
}
};
this.mouseDownHandler=function(_9,_a){
if(_9.enabled){
_9.dragging=true;
_9.anchorPoint=_a.evpl;
_9.deltaP=0;
_9.deltaL=0;
var _b=_a.childNodes;
_9.oldPos=new Array(_b.length);
for(var i=0;i<_b.length;i++){
var _d=_b.item(i);
var P=_d.style.left;
var L=_d.style.top;
if(P&&L){
_9.oldPos[i]=new Array(parseInt(P),parseInt(L));
}else{
_9.oldPos[i]=new Array(0,0);
}
}
}
};
this.mouseMoveHandler=function(_10,_11){
if(_10.enabled){
if(_10.dragging){
_10.deltaP=_11.evpl[0]-_10.anchorPoint[0];
_10.deltaL=_11.evpl[1]-_10.anchorPoint[1];
var _12=_11.childNodes;
for(var i=0;i<_12.length;i++){
var img=_12.item(i);
img.style.left=_10.deltaP+_10.oldPos[i][0]+"px";
img.style.top=_10.deltaL+_10.oldPos[i][1]+"px";
}
}
}
};
this.model.addListener("mousedown",this.mouseDownHandler,this);
this.model.addListener("mousemove",this.mouseMoveHandler,this);
this.model.addListener("mouseup",this.mouseUpHandler,this);
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function MouseClickHandler(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.clickHandler=function(_3,_4){
_3.model.setParam("clickPoint",_4.evpl);
};
_2.addListener("mouseup",this.clickHandler,this);
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function History(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
var _3=new Boolean();
this.init=function(_4){
place=-1;
list=new Array();
var _5=_4.targetModel.getBoundingBox();
newExtent=new Array();
newExtent[0]=new Array(_5[0],_5[3]);
newExtent[1]=new Array(_5[2],_5[1]);
list.push(newExtent);
place=place+1;
_4.model.active=place;
_4.model.historyList=list;
};
this.add=function(_6){
if(_6.model.active!=null){
var _7=_6.model.active;
var _8=_6.model.historyList;
newExtent=new Array();
newExtent[0]=_6.model.extent.ul;
newExtent[1]=_6.model.extent.lr;
if(_7==(_8.length-1)){
_8.push(newExtent);
_7=_7+1;
}else{
_7=_7+1;
_8=_8.slice(0,_7);
_8.push(newExtent);
}
_6.model.active=_7;
_6.model.historyList=_8;
}
};
this.back=function(_9){
place=_9.model.active;
if(place<1){
_9.model.previousExtent=null;
alert("You can't go further back");
}else{
place=place-1;
_9.model.active=place;
_9.model.previousExtent=_9.model.historyList[place];
}
};
this.forward=function(_a){
place=_a.model.active;
if(place<(_a.model.historyList.length-1)){
place=place+1;
_a.model.active=place;
_a.model.nextExtent=_a.model.historyList[place];
}else{
_a.model.nextExtent=null;
alert("You can't go further forward");
}
};
this.stop=function(_b){
_b.model.removeListener("bbox",_b.add,_b);
};
this.start=function(_c){
_c.model.addListener("bbox",_c.add,_c);
};
this.initReset=function(_d){
_d.targetModel.addListener("bbox",_d.add,_d);
_d.targetModel.addListener("loadModel",_d.init,_d);
};
this.model.addListener("historyBack",this.back,this);
this.model.addListener("historyForward",this.forward,this);
this.model.addListener("historyStart",this.start,this);
this.model.addListener("historyStop",this.stop,this);
this.model.addListener("init",this.initReset,this);
}

mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/StyledLayerDescriptor.js");
mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");
mapbuilder.loadScript(baseDir+"/widget/TipWidget.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function RssLayer(_1,_2,_3,_4,_5,_6){
MapLayer.apply(this,new Array(_1,_2,_3,_4,_5,_6));
this.parse=function(){
var _7="xmlns:wmc='http://www.opengis.net/context' xmlns:sld='http://www.opengis.net/sld' xmlns:xlink='http://www.w3.org/1999/xlink'";
var _8=this.layerNode.ownerDocument;
Sarissa.setXpathNamespaces(_8,_7);
this.id=this.layerNode.attributes.getNamedItem("id").nodeValue;
this.layerName=this.id;
var _9=this.layerNode.selectSingleNode("//wmc:StyleList");
var _a=_9.selectSingleNode("//wmc:Style[wmc:Name='Highlite']");
var _b=_9.selectSingleNode("//wmc:Style[wmc:Name='Normal']");
this.normalSld=new StyleLayerDescriptor(_b);
this.hiliteSld=new StyleLayerDescriptor(_a);
this.title=this.layerNode.selectSingleNode("//wmc:Title").firstChild.nodeValue;
var _c=this.layerNode.selectSingleNode("//wmc:Abstract");
var _d=_c.childNodes;
this.myabstract="";
for(var j=0;j<_d.length;j++){
this.myabstract+=Sarissa.serialize(_d[j]);
}
_c=this.layerNode.selectSingleNode("//wmc:Where");
var _f=_c.firstChild;
if(_f!=undefined){
this.gmlType=_f.nodeName;
if(this.gmlType=="gml:Point"){
var pos=_f.firstChild;
this.coords=pos.firstChild.nodeValue;
}else{
if(this.gmlType=="gml:LineString"){
var _11=_f.firstChild;
var _d=_11.childNodes;
var _12=_d.length;
this.coords="";
for(var j=0;j<_12;j++){
this.coords+=_d[j].nodeValue;
}
}else{
if(this.gmlType=="gml:Polygon"){
this.coords=null;
var ext=_f.firstChild;
var _14=ext.firstChild;
if(_14.firstChild){
this.posList=_14.firstChild;
this.coords=this.posList.firstChild.nodeValue;
}
}else{
if(this.gmlType=="gml:Box"||this.gmlType=="gml:Envelope"){
var _11=_f.firstChild;
var _d=_11.childNodes;
var _12=_d.length;
this.coords="";
var c=new Array();
c=_d[0].nodeValue.split(" ");
this.coords+=c[0]+" "+c[1]+",\n"+c[2]+" "+c[1]+",\n"+c[2]+" "+c[3]+",\n"+c[0]+" "+c[3]+",\n"+c[0]+" "+c[1];
}else{
alert("Unsupported GML Geometry:"+this.gmlType);
}
}
}
}
}else{
this.coords=null;
var _16=this.layerNode.attributes.getNamedItem("pid");
if(_16!=null){
var pid=_16.nodeValue;
var url="http://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=afbacfb4d14cd681c04a06d69b24d847&photo_id="+pid;
var _19=getProxyPlusUrl(url);
var _1a=new XMLHttpRequest();
_1a.open("GET",_19,false);
_1a.send(null);
var _1b=0;
var _1c=0;
var _1d=_1a.responseXML.selectNodes("//tag");
if(_1d.length==0){
alert(Sarissa.serialize(_1a.responseXML));
}
this.myabstract+="<br/>";
for(var i=0;i<_1d.length;++i){
var raw=_1d[i].attributes.getNamedItem("raw").nodeValue;
if(raw.indexOf("geo:lat=")>=0){
_1b=raw.substr(8);
this.myabstract+="lat:"+_1b+"<br/>";
}else{
if(raw.indexOf("geo:long=")>=0){
_1c=raw.substr(9);
this.myabstract+="long:"+_1c+"<br/>";
}
}
}
this.gmlType="gml:Point";
this.coords=_1c+","+_1b;
}
}
};
this.isWmsLayer=function(){
return false;
};
this.paintPoint=function(sld,_21){
if(_21){
sld.hilitePoint(this.gr,this.shape);
}else{
if(this.coords!=null){
var _22=new Proj(this.model.getSRS());
var _23=this.coords.split(/[ ,\n]+/);
_23=_22.Forward(_23);
var _24=this.model.extent.getPL(_23);
this.shape=sld.paintPoint(this.gr,_24);
if(this.shape!=null){
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
}
}
};
this.paintPolygon=function(sld,_26){
if(_26){
sld.hilitePolygon(this.gr,this.shape);
}else{
if(this.coords!=null){
var _27=new Proj(this.model.getSRS());
var _28=this.coords.split(/[ ,\n]+/);
var _29=new Array(_28.length/2);
var _2a=new Array(2);
var _2b;
var jj=0;
for(var i=0;i<_28.length;i++){
_2a[0]=_28[i];
_2a[1]=_28[i+1];
_2b=_27.Forward(_2a);
_2b=this.model.extent.getPL(_2b);
_29[jj]=_2b;
jj++;
i++;
}
this.shape=sld.paintPolygon(this.gr,_29);
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
}
};
this.paintLine=function(sld,_2f){
if(_2f){
sld.hiliteLine(this.gr,this.shape);
}else{
var _30=new Proj(this.model.getSRS());
var _31=this.coords.split(/[ ,\n]+/);
var _32=new Array(_31.length/2);
var _33=new Array(2);
var _34;
var jj=0;
for(var i=0;i<_31.length;i++){
_33[0]=_31[i];
_33[1]=_31[i+1];
_34=_30.Forward(_33);
_34=this.model.extent.getPL(_34);
_32[jj]=_34;
jj++;
i++;
}
this.shape=sld.paintLine(this.gr,_32);
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
};
this.getDiv=function(_37){
var _38=document.getElementById(this.mapPane.outputNodeId).parentNode;
var div=document.getElementById("vector_elements");
if(div==null){
div=document.createElement("div");
div.setAttribute("id","vector_elements");
div.style.position="absolute";
div.style.visibility="visible";
div.style.zIndex=600;
_38.appendChild(div);
}
div.style.top=0;
div.style.left=0;
return div;
};
this.paint=function(){
this.paint(null,null);
};
this.paint=function(_3a,img){
this.deleteShape();
this.paintShape(this.normalSld,false);
};
this.deleteShape=function(){
var id=this.id+"_vector";
var _3d=document.getElementById(id);
if(_3d!=null){
_3d.parentNode.removeChild(_3d);
_3d=document.getElementById(id);
if(_3d!=null){
alert("failed to remove:"+id);
}
}
};
this.unpaint=function(){
this.deleteShape();
};
this.paintShape=function(sld,_3f){
if(this.gmlType=="gml:Point"){
this.paintPoint(sld,_3f);
}else{
if(this.gmlType=="gml:LineString"){
this.paintLine(sld,_3f);
}else{
if(this.gmlType=="gml:Polygon"||this.gmlType=="gml:Envelope"||this.gmlType=="gml:Box"){
this.paintPolygon(sld,_3f);
}
}
}
};
this.install=function(_40){
_40.onmouseover=this.mouseOverHandler;
_40.onmouseout=this.mouseOutHandler;
_40.onclick=this.mouseClickHandler;
};
this.mouseOverHandler=function(ev){
this.style.cursor="help";
return true;
};
this.mouseOutHandler=function(ev){
this.style.cursor="default";
return true;
};
this.mouseClickHandler=function(ev){
config.objects.geoRSS.setParam("clickFeature",this.id);
return true;
};
this.clickIt=function(_44,_45){
if(_45.indexOf(_44.id)>=0){
var _46=0;
var _47=0;
var cn=window.cursorTrackNode;
if(cn){
var _49=cn.evpl;
if(_49!=null){
_46=_49[0];
_47=_49[1];
var _4a=_44.myabstract;
if(_4a==undefined){
_4a="Feature under construction.  Stay tuned!";
}
}
}
if(_46>0&&_46<_44.width&&_47>0&&_47<_44.height){
toolTipObjs[_44.tooltip].paint(new Array(_46,_47,_45,_44.title,_4a));
}
}
};
this.highlight=function(_4b,_4c){
if(_4c.indexOf(_4b.id)>=0){
_4b.paintShape(_4b.hiliteSld,true);
var _4d=0;
var _4e=0;
var cn=window.cursorTrackNode;
if(cn){
var _50=cn.evpl;
if(_50!=null){
_4d=_50[0];
_4e=_50[1];
var _51=_4b.myabstract;
if(_51==undefined){
_51="Feature under construction.  Stay tuned!";
}
}
}
if(_4d>0&&_4d<_4b.width&&_4e>0&&_4e<_4b.height){
toolTipObjs[_4b.tooltip].paint(new Array(_4d,_4e,_4c,_4b.title,_51));
}
}
};
this.dehighlight=function(_52,_53){
if(_53.indexOf(_52.id)>=0){
_52.paintShape(_52.normalSld,true);
toolTipObjs[_52.tooltip].clear();
}
};
this.parse();
this.width=_4.attributes.getNamedItem("width").nodeValue;
this.height=_4.attributes.getNamedItem("height").nodeValue;
var div=this.getDiv();
this.gr=new VectorGraphics(this.id,div,this.width,this.height);
config.objects.geoRSS.addListener("highlightFeature",this.highlight,this);
config.objects.geoRSS.addListener("dehighlightFeature",this.dehighlight,this);
config.objects.geoRSS.addListener("clickFeature",this.clickIt,this);
this.tooltip=config.objects.geoRSS.tipWidgetId;
}

function WidgetBase(_1,_2){
this.model=_2;
this.widgetNode=_1;
if(_1.attributes.getNamedItem("id")){
this.id=_1.attributes.getNamedItem("id").nodeValue;
}else{
alert("id required for object:"+_1.nodeName);
}
var _3=_1.selectSingleNode("mb:outputNodeId");
if(_3){
this.outputNodeId=_3.firstChild.nodeValue;
}else{
this.outputNodeId="MbWidget_"+mbIds.getId();
}
if(!this.htmlTagId){
var _4=_1.selectSingleNode("mb:htmlTagId");
if(_4){
this.htmlTagId=_4.firstChild.nodeValue;
}else{
this.htmlTagId=this.id;
}
}
this.node=document.getElementById(this.htmlTagId);
if(!this.node){
}
this.autoRefresh=true;
var _5=_1.selectSingleNode("mb:autoRefresh");
if(_5&&_5.firstChild.nodeValue=="false"){
this.autoRefresh=false;
}
if(_1.selectSingleNode("mb:debug")){
this.debug=true;
}
this.initTargetModel=function(_6){
var _7=_6.widgetNode.selectSingleNode("mb:targetModel");
if(_7){
_6.targetModel=eval("config.objects."+_7.firstChild.nodeValue);
if(!_6.targetModel){
alert("error finding targetModel:"+_7.firstChild.nodeValue+" for:"+_6.id);
}
}else{
_6.targetModel=_6.model;
}
};
this.model.addListener("init",this.initTargetModel,this);
this.prePaint=function(_8){
};
this.postPaint=function(_9){
};
this.clearWidget=function(_a){
var _b=document.getElementById(_a.outputNodeId);
if(_b){
_a.node.removeChild(_b);
}
};
this.model.addListener("newModel",this.clearWidget,this);
}

mapbuilder.loadScript(baseDir+"/tool/Extent.js");
function MapContainerBase(_1,_2){
var _3=_1.selectSingleNode("mb:mapContainerId");
if(_3){
this.containerNodeId=_3.firstChild.nodeValue;
}else{
alert("MapContainerBase: required property mapContainerId missing in config:"+this.id);
}
var _4=document.getElementById(this.containerNodeId);
if(_4){
this.containerModel=_4.containerModel;
_2.containerModel=_4.containerModel;
this.setContainerWidth=function(_5){
_5.node.style.width=_5.containerModel.getWindowWidth()+"px";
_5.node.style.height=_5.containerModel.getWindowHeight()+"px";
if(this.stylesheet){
this.stylesheet.setParameter("width",_5.containerModel.getWindowWidth());
this.stylesheet.setParameter("height",_5.containerModel.getWindowHeight());
}
};
}else{
_4=document.createElement("div");
_4.setAttribute("id",this.containerNodeId);
_4.id=this.containerNodeId;
_4.style.position="relative";
_4.style.overflow="hidden";
_4.style.zIndex="500";
_4.containerModel=this.model;
this.containerModel=this.model;
_2.containerModel=_4.containerModel;
this.setContainerWidth=function(_6){
var _7=_1.selectSingleNode("mb:fixedWidth");
if(_7){
_7=_7.firstChild.nodeValue;
var _8=_6.containerModel.getWindowHeight()/_6.containerModel.getWindowWidth();
var _9=Math.round(_8*_7);
_6.containerModel.setWindowWidth(_7);
_6.containerModel.setWindowHeight(_9);
}
_6.node.style.width=_6.containerModel.getWindowWidth()+"px";
_6.node.style.height=_6.containerModel.getWindowHeight()+"px";
if(this.stylesheet){
this.stylesheet.setParameter("width",_6.containerModel.getWindowWidth());
this.stylesheet.setParameter("height",_6.containerModel.getWindowHeight());
}
};
this.containerModel.extent=new Extent(this.containerModel);
this.containerModel.addFirstListener("loadModel",this.containerModel.extent.firstInit,this.containerModel.extent);
this.containerModel.addListener("bbox",this.containerModel.extent.init,this.containerModel.extent);
this.containerModel.addListener("resize",this.containerModel.extent.init,this.containerModel.extent);
this.setTooltip=function(_a,_b){
};
this.containerModel.addListener("tooltip",this.setTooltip,this);
this.eventHandler=function(ev){
if(window.event){
var p=window.event.clientX-this.offsetLeft+document.documentElement.scrollLeft+document.body.scrollLeft;
var l=window.event.clientY-this.offsetTop+document.documentElement.scrollTop+document.body.scrollTop;
this.evpl=new Array(p,l);
this.eventTarget=window.event.srcElement;
this.altKey=window.event.altKey;
this.ctrlKey=window.event.ctrlKey;
this.shiftKey=window.event.shiftKey;
this.eventType=window.event.type;
window.event.returnValue=false;
window.event.cancelBubble=true;
}else{
var p=ev.clientX+window.scrollX-this.offsetLeft;
var l=ev.clientY+window.scrollY-this.offsetTop;
this.evpl=new Array(p,l);
this.eventTarget=ev.target;
this.eventType=ev.type;
this.altKey=ev.altKey;
this.ctrlKey=ev.ctrlKey;
this.shiftKey=ev.shiftKey;
ev.stopPropagation();
}
this.containerModel.setParam(this.eventType,this);
return false;
};
this.eventHandler=this.eventHandler;
_4.onmousemove=this.eventHandler;
_4.onmouseout=this.eventHandler;
_4.onmouseover=this.eventHandler;
_4.onmousedown=this.eventHandler;
_4.onmouseup=this.eventHandler;
this.node.appendChild(_4);
}
this.node=document.getElementById(this.containerNodeId);
this.setContainerWidth=this.setContainerWidth;
this.containerModel.addFirstListener("loadModel",this.setContainerWidth,this);
this.containerModel.addListener("bbox",this.paint,this);
}

mapbuilder.loadScript(baseDir+"/graphics/WmsLayer.js");
function MapLayerMgr(_1,_2){
this.layers=new Array();
this.mapPane=_1;
this.model=_2;
this.namespace="xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";
this.model.addListener("addLayer",this.addLayer,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("hidden",this.hiddenListener,this);
this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);
this.model.addListener("refreshOtherLayers",this.paintOtherLayers,this);
this.model.addListener("timestamp",this.timestampListener,this);
}
MapLayerMgr.prototype.refreshWmsLayers=function(_3){
_3.d=new Date();
_3.stylesheet.setParameter("uniqueId",_3.d.getTime());
_3.paintWmsLayers(_3);
};
MapLayerMgr.prototype.timestampListener=function(_4,_5){
var _6=_4.model.timestampList.getAttribute("layerName");
var _7=_4.model.timestampList.childNodes[_5];
var _8=(_7.getAttribute("current")=="1")?"visible":"hidden";
var _9=_4.model.id+"_"+_4.id+"_"+_6+"_"+_7.firstChild.nodeValue;
var _a=document.getElementById(_9);
if(_a){
_a.style.visibility=_8;
}else{
alert("error finding layerId:"+_9);
}
};
MapLayerMgr.prototype.hiddenListener=function(_b,_c){
var _d="visible";
if(_b.model.getHidden(_c)=="1"){
_d="hidden";
}
var _e=_b.model.id+"_"+_b.mapPane.id+"_"+_c;
var _f=document.getElementById(_e);
if(_f){
_f.style.visibility=_d;
imgId="real"+_f.imgId;
img=document.getElementById(imgId);
if(img){
img.style.visibility=_d;
}
}else{
_f=_b.model.getFeatureNode(_c);
var id=_f.selectSingleNode("@id").nodeValue+"_vector";
_f=document.getElementById(id);
if(_f){
_f.setAttribute("visibility",_d);
_f.style.visibility=_d;
}
}
};
MapLayerMgr.prototype.setLayersFromContext=function(_11){
var _12=_11.model.getAllLayers();
for(var i=0;i<_12.length;i++){
var _14=_12[i];
_11.addLayer(_11,_14);
}
};
MapLayerMgr.prototype.addLayer=function(_15,_16){
var _17=null;
service=_16.selectSingleNode("wmc:Server/@service");
if(service){
service=service.nodeValue;
}
var _18=_16.nodeName;
if(service=="GoogleMap"){
_17=new GoogleMapLayer(_15.model,_15.mapPane,"GoogleMapLayer",_16,false,true);
_15.layers.push(_17);
}else{
if((service=="wms")||(service=="OGC:WMS")){
_17=_15.addWmsLayer(_15.model,_15.mapPane,_16);
}else{
if(_18.indexOf("RssLayer")>=0){
var _19=_16.getAttribute("id");
_17=new RssLayer(_15.model,_15.mapPane,_19,_16,false,true);
_15.layers.push(_17);
}else{
alert("Failed adding Layer:"+_18+" service:"+service);
}
}
}
return _17;
};
MapLayerMgr.prototype.addWmsLayer=function(_1a,_1b,_1c){
var _1d=_1c.selectSingleNode("wmc:Name");
if(_1d){
layerName=_1d.firstChild.nodeValue;
}else{
layerName="UNKNOWN";
}
var _1e=_1c.getAttribute("queryable");
var _1f=_1c.getAttribute("hidden");
var _20=new WmsLayer(_1a,_1b,layerName,_1c,_1e,_1f);
_1b.MapLayerMgr.layers.push(_20);
return _20;
};
MapLayerMgr.prototype.paintWmsLayers=function(_21){
for(var i=0;i<_21.layers.length;i++){
var _23=_21.layers[i];
if(_23.isWmsLayer()){
_23.paint(_21,null,i);
}
}
};
MapLayerMgr.prototype.paintOtherLayers=function(_24){
var _25=0;
for(var i=0;i<_24.layers.length;i++){
var _27=_24.layers[i];
if(!_27.isWmsLayer()){
_27.paint(_24,null,i);
_25++;
}
}
};
MapLayerMgr.prototype.getAllLayers=function(){
return layers;
};
MapLayerMgr.prototype.getLayer=function(_28){
for(var i=0;i<layers.length;i++){
if(layer[i].layerName.equalsIgnoreCase(_28)){
return layer;
}
}
return null;
};
MapLayerMgr.prototype.deleteAllLayers=function(){
if(this.layers){
for(var i=0;i<this.layers.length;i++){
var _2b=this.layers[i];
_2b.unpaint();
}
}
this.layers=null;
this.layers=new Array();
};
MapLayerMgr.prototype.deleteLayer=function(_2c,_2d){
for(var i=0;i<_2c.layers.length;i++){
var _2f=_2c.layers[i];
if(_2f.layerName==_2d){
_2f.unpaint();
layers=_2c.layers.splice(i,1);
}
}
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function WidgetBaseXSL(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
if(!this.stylesheet){
var _3=_1.selectSingleNode("mb:stylesheet");
if(_3){
this.stylesheet=new XslProcessor(_3.firstChild.nodeValue,_2.namespace);
}else{
this.stylesheet=new XslProcessor(baseDir+"/widget/"+_1.nodeName+".xsl",_2.namespace);
}
}
if(config.widgetText){
var _4="/mb:WidgetText/mb:widgets/mb:"+_1.nodeName;
var _5=config.widgetText.selectNodes(_4+"/*");
for(var j=0;j<_5.length;j++){
this.stylesheet.setParameter(_5[j].nodeName,_5[j].firstChild.nodeValue);
}
}
for(var j=0;j<_1.childNodes.length;j++){
if(_1.childNodes[j].firstChild&&_1.childNodes[j].firstChild.nodeValue){
this.stylesheet.setParameter(_1.childNodes[j].nodeName,_1.childNodes[j].firstChild.nodeValue);
}
}
this.stylesheet.setParameter("modelId",this.model.id);
this.stylesheet.setParameter("modelTitle",this.model.title);
this.stylesheet.setParameter("widgetId",this.id);
this.stylesheet.setParameter("skinDir",config.skinDir);
this.stylesheet.setParameter("lang",config.lang);
this.paint=function(_7,_8){
if(_8&&(_8!=_7.id)){
return;
}
if(_7.model.doc&&_7.node){
_7.stylesheet.setParameter("modelUrl",_7.model.url);
_7.stylesheet.setParameter("targetModelId",_7.targetModel.id);
_7.resultDoc=_7.model.doc;
_7.prePaint(_7);
if(_7.debug){
alert("prepaint:"+Sarissa.serialize(_7.resultDoc));
}
if(_7.debug){
alert("stylesheet:"+Sarissa.serialize(_7.stylesheet.xslDom));
}
var _9=document.getElementById(_7.outputNodeId);
var _a=document.createElement("DIV");
var s=_7.stylesheet.transformNodeToString(_7.resultDoc);
if(config.serializeUrl&&_7.debug){
postLoad(config.serializeUrl,s);
}
if(_7.debug){
alert("painting:"+_7.id+":"+s);
}
_a.innerHTML=s;
if(_a.firstChild!=null){
_a.firstChild.setAttribute("id",_7.outputNodeId);
if(_9){
_7.node.replaceChild(_a.firstChild,_9);
}else{
_7.node.appendChild(_a.firstChild);
}
}
_7.postPaint(_7);
}
};
this.model.addListener("refresh",this.paint,this);
this.clearWidget=function(_c){
var _d=document.getElementById(_c.outputNodeId);
if(_d){
_c.node.removeChild(_d);
}
};
this.model.addListener("newModel",this.clearWidget,this);
}

function Proj(_1){
this.srs=_1.toUpperCase();
switch(this.srs){
case "EPSG:GMAPS":
this.Forward=identity;
this.Inverse=identity;
this.units="degrees";
this.title="Google Maps";
break;
case "EPSG:4326":
case "EPSG:4269":
case "CRS:84":
case "EPSG:4965":
case new String("http://www.opengis.net/gml/srs/epsg.xml#4326").toUpperCase():
this.Forward=identity;
this.Inverse=identity;
this.units="degrees";
this.title="Lat/Long";
break;
case "EPSG:42101":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378137,6356752.314245,49,77,-95,0,0,-8000000));
this.units="meters";
this.title="Lambert Conformal Conic";
break;
case "EPSG:42304":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378137,6356752.314,49,77,-95,49,0,0));
this.units="meters";
this.title="Lambert Conformal Conic";
break;
case "EPSG:26986":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378137,6356752.314,42.68333333333333,41.71666666666667,-71.5,41,200000,750000));
this.units="meters";
this.title="Massachusetts Mainland (LCC)";
break;
case "EPSG:32761":
case "EPSG:32661":
this.Init=psinit;
this.Forward=ll2ps;
this.Inverse=ps2ll;
this.Init(new Array(6378137,6356752.314245,0,-90,2000000,2000000));
this.units="meters";
this.title="Polar Stereographic";
break;
case "EPSG:27561":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378249.2,6356515,49.5,49.5,2.33722916655,49.5,600000,200000));
this.units="meters";
this.title="Lambert Conformal Conic";
break;
case "EPSG:27562":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378249.2,6356515,46.8,46.8,2.33722916655,46.8,600000,200000));
this.units="meters";
this.title="Lambert Conformal Conic";
break;
case "EPSG:27572":
case "EPSG:27582":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378249.2,6356515,46.8,46.8,2.33722916655,46.8,600000,2200000));
this.units="meters";
this.title="Lambert Conformal Conic";
break;
case "EPSG:27563":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378249.2,6356515,44.1,44.1,2.33722916655,44.1,600000,200000));
this.units="meters";
this.title="Lambert Conformal Conic";
break;
case "EPSG:27564":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378249.2,6356515,42.17,42.17,2.33722916655,42.17,234.358,185861.369));
this.units="meters";
this.title="Lambert Conformal Conic";
break;
case "EPSG:2154":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6378137,6356752.3141,44,49,3.00000000001,46.5,700000,6600000));
this.units="meters";
this.title="Lambert Conformal Conic";
break;
case "EPSG:4326":
case "EPSG:4269":
case "CRS:84":
case "EPSG:4965":
case new String("http://www.opengis.net/gml/srs/epsg.xml#4326").toUpperCase():
this.Forward=identity;
this.Inverse=identity;
this.units="degrees";
this.title="Lat/Long";
break;
case "EPSG:102758":
this.title="NAD 1983 StatePlane Wyoming West FIPS 4904 US Survey Feet";
this.Init=tminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(grs80[0],grs80[1],0.9999375,-110.0833333333333,40.5,800000,100000));
this.units="usfeet";
break;
case "EPSG:32158":
this.title="NAD 1983 StatePlane Wyoming West meters";
this.Init=tminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(grs80[0],grs80[1],0.9999375,-110.0833333333333,40.5,800000,100000));
this.units="meters";
break;
case "EPSG:26903":
case "EPSG:26904":
case "EPSG:26905":
case "EPSG:26906":
case "EPSG:26907":
case "EPSG:26908":
case "EPSG:26909":
case "EPSG:26910":
case "EPSG:26911":
case "EPSG:26912":
case "EPSG:26913":
case "EPSG:26914":
case "EPSG:26915":
case "EPSG:26916":
case "EPSG:26917":
case "EPSG:26918":
case "EPSG:26919":
case "EPSG:26920":
case "EPSG:26921":
case "EPSG:26922":
case "EPSG:26923":
this.title="NAD83 / UTM zone "+_1.substr(8,2)+"N";
this.Init=utminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(grs80[0],grs80[1],0.9996,_1.substr(8,2)));
this.units="meters";
break;
case "EPSG:32601":
case "EPSG:32602":
case "EPSG:32603":
case "EPSG:32604":
case "EPSG:32605":
case "EPSG:32606":
case "EPSG:32607":
case "EPSG:32608":
case "EPSG:32609":
case "EPSG:32610":
case "EPSG:32611":
case "EPSG:32612":
case "EPSG:32613":
case "EPSG:32614":
case "EPSG:32615":
case "EPSG:32616":
case "EPSG:32617":
case "EPSG:32618":
case "EPSG:32619":
case "EPSG:32620":
case "EPSG:32621":
case "EPSG:32622":
case "EPSG:32623":
case "EPSG:32624":
case "EPSG:32625":
case "EPSG:32626":
case "EPSG:32627":
case "EPSG:32628":
case "EPSG:32629":
case "EPSG:32630":
case "EPSG:32631":
case "EPSG:32632":
case "EPSG:32633":
case "EPSG:32634":
case "EPSG:32635":
case "EPSG:32636":
case "EPSG:32637":
case "EPSG:32638":
case "EPSG:32639":
case "EPSG:32640":
case "EPSG:32641":
case "EPSG:32642":
case "EPSG:32643":
case "EPSG:32644":
case "EPSG:32645":
case "EPSG:32646":
case "EPSG:32647":
case "EPSG:32648":
case "EPSG:32649":
case "EPSG:32650":
case "EPSG:32651":
case "EPSG:32652":
case "EPSG:32653":
case "EPSG:32654":
case "EPSG:32655":
case "EPSG:32656":
case "EPSG:32657":
case "EPSG:32658":
case "EPSG:32659":
case "EPSG:32660":
this.title="WGS84 / UTM zone "+_1.substr(8,2)+"N";
this.Init=utminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(wgs84[0],wgs84[1],0.9996,_1.substr(8,2)));
this.units="meters";
break;
case "EPSG:32701":
case "EPSG:32702":
case "EPSG:32703":
case "EPSG:32704":
case "EPSG:32705":
case "EPSG:32706":
case "EPSG:32707":
case "EPSG:32708":
case "EPSG:32709":
case "EPSG:32710":
case "EPSG:32711":
case "EPSG:32712":
case "EPSG:32713":
case "EPSG:32714":
case "EPSG:32715":
case "EPSG:32716":
case "EPSG:32717":
case "EPSG:32718":
case "EPSG:32719":
case "EPSG:32720":
case "EPSG:32721":
case "EPSG:32722":
case "EPSG:32723":
case "EPSG:32724":
case "EPSG:32725":
case "EPSG:32726":
case "EPSG:32727":
case "EPSG:32728":
case "EPSG:32729":
case "EPSG:32730":
case "EPSG:32731":
case "EPSG:32732":
case "EPSG:32733":
case "EPSG:32734":
case "EPSG:32735":
case "EPSG:32736":
case "EPSG:32737":
case "EPSG:32738":
case "EPSG:32739":
case "EPSG:32740":
case "EPSG:32741":
case "EPSG:32742":
case "EPSG:32743":
case "EPSG:32744":
case "EPSG:32745":
case "EPSG:32746":
case "EPSG:32747":
case "EPSG:32748":
case "EPSG:32749":
case "EPSG:32750":
case "EPSG:32751":
case "EPSG:32752":
case "EPSG:32753":
case "EPSG:32754":
case "EPSG:32755":
case "EPSG:32756":
case "EPSG:32757":
case "EPSG:32758":
case "EPSG:32759":
case "EPSG:32760":
this.title="WGS84 / UTM zone "+_1.substr(8,2)+"S";
this.Init=utminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(wgs84[0],wgs84[1],0.9996,"-"+_1.substr(8,2)));
this.units="meters";
break;
case "EPSG:26591":
this.title="Monte Mario (Rome) / Italy zone 1";
this.Init=tminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(6378388,6356911.94612795,0.9996,9,0,1500000,0));
this.units="meters";
break;
case "SCENE":
this.Init=sceneInit;
this.Forward=ll2scene;
this.Inverse=scene2ll;
this.GetXYCoords=identity;
this.GetPLCoords=identity;
break;
case "PIXEL":
this.Forward=ll2pixel;
this.Inverse=pixel2ll;
this.units="pixels";
this.GetXYCoords=identity;
this.GetPLCoords=identity;
break;
default:
alert("unsupported map projection: "+this.srs);
}
this.matchSrs=function(_2){
if(this.srs==_2.toUpperCase()){
return true;
}
return false;
};
}
function gmap_forward(_3){
return config.objects.googleMapTools.getPixelsFromLatLong(_3);
}
function gmap_inverse(_4){
return config.objects.googleMapTools.getLatLongFromPixels(_4);
}
function identity(_5){
return _5;
}
function ll2scene(_6){
alert("ll2scene not defined");
return null;
}
function scene2ll(_7){
var _8=(_7[0]-this.ul[0])/(this.lr[0]-this.ul[0]);
var _9=(_7[1]-this.ul[1])/(this.lr[1]-this.ul[1]);
var _a=bilinterp(_8,_9,this.cul[0],this.cur[0],this.cll[0],this.clr[0]);
var _b=bilinterp(_8,_9,this.cul[1],this.cur[1],this.cll[1],this.clr[1]);
return new Array(_a,_b);
}
function sceneInit(_c){
this.cul=_c[0];
this.cur=_c[1];
this.cll=_c[2];
this.clr=_c[3];
}
function bilinterp(x,y,a,b,c,d){
var top=x*(b-a)+a;
var bot=x*(d-c)+c;
return y*(bot-top)+top;
}
function ll2pixel(_15){
alert("ll2pixel not defined");
return null;
}
function pixel2ll(_16){
alert("pixel2ll not defined");
return null;
}
var PI=Math.PI;
var HALF_PI=PI*0.5;
var TWO_PI=PI*2;
var EPSLN=1e-10;
var R2D=57.2957795131;
var D2R=0.0174532925199;
var R=6370997;
function lccinit(_17){
this.r_major=_17[0];
this.r_minor=_17[1];
var _18=_17[2]*D2R;
var _19=_17[3]*D2R;
this.center_lon=_17[4]*D2R;
this.center_lat=_17[5]*D2R;
this.false_easting=_17[6];
this.false_northing=_17[7];
if(Math.abs(_18+_19)<EPSLN){
alert("Equal Latitiudes for St. Parallels on opposite sides of equator - lccinit");
return;
}
var _1a=this.r_minor/this.r_major;
this.e=Math.sqrt(1-_1a*_1a);
var _1b=Math.sin(_18);
var _1c=Math.cos(_18);
var ms1=msfnz(this.e,_1b,_1c);
var ts1=tsfnz(this.e,_18,_1b);
var _1f=Math.sin(_19);
var _20=Math.cos(_19);
var ms2=msfnz(this.e,_1f,_20);
var ts2=tsfnz(this.e,_19,_1f);
var ts0=tsfnz(this.e,this.center_lat,Math.sin(this.center_lat));
if(Math.abs(_18-_19)>EPSLN){
this.ns=Math.log(ms1/ms2)/Math.log(ts1/ts2);
}else{
this.ns=_1b;
}
this.f0=ms1/(this.ns*Math.pow(ts1,this.ns));
this.rh=this.r_major*this.f0*Math.pow(ts0,this.ns);
}
function ll2lcc(_24){
var lon=_24[0];
var lat=_24[1];
if(lat<=90&&lat>=-90&&lon<=180&&lon>=-180){
lat*=D2R;
lon*=D2R;
}else{
alert("*** Input out of range ***: lon: "+lon+" - lat: "+lat);
return null;
}
var con=Math.abs(Math.abs(lat)-HALF_PI);
var ts;
if(con>EPSLN){
ts=tsfnz(this.e,lat,Math.sin(lat));
rh1=this.r_major*this.f0*Math.pow(ts,this.ns);
}else{
con=lat*this.ns;
if(con<=0){
alert("Point can not be projected - ll2lcc");
return null;
}
rh1=0;
}
var _29=this.ns*adjust_lon(lon-this.center_lon);
var x=rh1*Math.sin(_29)+this.false_easting;
var y=this.rh-rh1*Math.cos(_29)+this.false_northing;
return new Array(x,y);
}
function lcc2ll(_2c){
var rh1,con,ts;
var lat,lon;
x=_2c[0]-this.false_easting;
y=this.rh-_2c[1]+this.false_northing;
if(this.ns>0){
rh1=Math.sqrt(x*x+y*y);
con=1;
}else{
rh1=-Math.sqrt(x*x+y*y);
con=-1;
}
var _2f=0;
if(rh1!=0){
_2f=Math.atan2((con*x),(con*y));
}
if((rh1!=0)||(this.ns>0)){
con=1/this.ns;
ts=Math.pow((rh1/(this.r_major*this.f0)),con);
lat=phi2z(this.e,ts);
if(lat==-9999){
return null;
}
}else{
lat=-HALF_PI;
}
lon=adjust_lon(_2f/this.ns+this.center_lon);
return new Array(R2D*lon,R2D*lat);
}
function psinit(_30){
this.r_major=_30[0];
this.r_minor=_30[1];
this.center_lon=_30[2]*D2R;
this.center_lat=_30[3]*D2R;
this.false_easting=_30[4];
this.false_northing=_30[5];
var _31=this.r_minor/this.r_major;
this.e=1-_31*_31;
this.e=Math.sqrt(this.e);
var con=1+this.e;
var com=1-this.e;
this.e4=Math.sqrt(Math.pow(con,con)*Math.pow(com,com));
this.fac=(this.center_lat<0)?-1:1;
this.ind=0;
if(Math.abs(Math.abs(this.center_lat)-HALF_PI)>EPSLN){
this.ind=1;
var _34=this.fac*this.center_lat;
var _35=Math.sin(_34);
this.mcs=msfnz(this.e,_35,Math.cos(_34));
this.tcs=tsfnz(this.e,_34,_35);
}
}
function ll2ps(_36){
var lon=_36[0];
var lat=_36[1];
var _39=this.fac*adjust_lon(lon-this.center_lon);
var _3a=this.fac*lat;
var _3b=Math.sin(_3a);
var ts=tsfnz(this.e,_3a,_3b);
if(this.ind!=0){
rh=this.r_major*this.mcs*ts/this.tcs;
}else{
rh=2*this.r_major*ts/this.e4;
}
var x=this.fac*rh*Math.sin(_39)+this.false_easting;
var y=-this.fac*rh*Math.cos(_39)+this.false_northing;
return new Array(x,y);
}
function ps2ll(_3f){
x=(_3f[0]-this.false_easting)*this.fac;
y=(_3f[1]-this.false_northing)*this.fac;
var rh=Math.sqrt(x*x+y*y);
if(this.ind!=0){
ts=rh*this.tcs/(this.r_major*this.mcs);
}else{
ts=rh*this.e4/(this.r_major*2);
}
var lat=this.fac*phi2z(this.e,ts);
if(lat==-9999){
return null;
}
var lon=0;
if(rh==0){
lon=this.fac*this.center_lon;
}else{
lon=adjust_lon(this.fac*Math.atan2(x,-y)+this.center_lon);
}
return new Array(R2D*lon,R2D*lat);
}
function semi_minor(a,f){
return a-(a*(1/f));
}
var grs80=new Array(6378137,6356752.31414036);
var wgs84=new Array(6378137,6356752.31424518);
var wgs72=new Array(6378135,6356750.52001609);
var intl=new Array(6378388,6356911.94612795);
var usfeet=1200/3937;
var feet=0.3048;
function e0fn(x){
return (1-0.25*x*(1+x/16*(3+1.25*x)));
}
function e1fn(x){
return (0.375*x*(1+0.25*x*(1+0.46875*x)));
}
function e2fn(x){
return (0.05859375*x*x*(1+0.75*x));
}
function e3fn(x){
return (x*x*x*(35/3072));
}
function mlfn(e0,e1,e2,e3,phi){
return (e0*phi-e1*Math.sin(2*phi)+e2*Math.sin(4*phi)-e3*Math.sin(6*phi));
}
function tminit(_4e){
this.r_maj=_4e[0];
this.r_min=_4e[1];
this.scale_fact=_4e[2];
this.lon_center=_4e[3]*D2R;
this.lat_origin=_4e[4]*D2R;
this.false_easting=_4e[5];
this.false_northing=_4e[6];
var _4f=this.r_min/this.r_maj;
this.es=1-Math.pow(_4f,2);
this.e0=e0fn(this.es);
this.e1=e1fn(this.es);
this.e2=e2fn(this.es);
this.e3=e3fn(this.es);
this.ml0=this.r_maj*mlfn(this.e0,this.e1,this.e2,this.e3,this.lat_origin);
this.esp=this.es/(1-this.es);
this.ind=(this.es<0.00001)?1:0;
}
function utminit(_50){
this.r_maj=_50[0];
this.r_min=_50[1];
this.scale_fact=_50[2];
var _51=_50[3];
this.lat_origin=0;
this.lon_center=((6*Math.abs(_51))-183)*D2R;
this.false_easting=500000;
this.false_northing=(_51<0)?10000000:0;
var _52=this.r_min/this.r_maj;
this.es=1-Math.pow(_52,2);
this.e0=e0fn(this.es);
this.e1=e1fn(this.es);
this.e2=e2fn(this.es);
this.e3=e3fn(this.es);
this.ml0=this.r_maj*mlfn(this.e0,this.e1,this.e2,this.e3,this.lat_origin);
this.esp=this.es/(1-this.es);
this.ind=(this.es<0.00001)?1:0;
}
function ll2tm(_53){
var lon=_53[0]*D2R;
var lat=_53[1]*D2R;
var _56=adjust_lon(lon-this.lon_center);
var con;
var x,y;
var _59=Math.sin(lat);
var _5a=Math.cos(lat);
if(this.ind!=0){
var b=_5a*Math.sin(_56);
if((Math.abs(Math.abs(b)-1))<1e-10){
alert("Error in ll2tm(): Point projects into infinity");
return (93);
}else{
x=0.5*this.r_maj*this.scale_fact*Math.log((1+b)/(1-b));
con=Math.acos(_5a*Math.cos(_56)/Math.sqrt(1-b*b));
if(lat<0){
con=-con;
}
y=this.r_maj*this.scale_fact*(con-this.lat_origin);
}
}else{
var al=_5a*_56;
var als=Math.pow(al,2);
var c=this.esp*Math.pow(_5a,2);
var tq=Math.tan(lat);
var t=Math.pow(tq,2);
con=1-this.es*Math.pow(_59,2);
var n=this.r_maj/Math.sqrt(con);
var ml=this.r_maj*mlfn(this.e0,this.e1,this.e2,this.e3,lat);
x=this.scale_fact*n*al*(1+als/6*(1-t+c+als/20*(5-18*t+Math.pow(t,2)+72*c-58*this.esp)))+this.false_easting;
y=this.scale_fact*(ml-this.ml0+n*tq*(als*(0.5+als/24*(5-t+9*c+4*Math.pow(c,2)+als/30*(61-58*t+Math.pow(t,2)+600*c-330*this.esp)))))+this.false_northing;
switch(this.units){
case "usfeet":
x/=usfeet;
y/=usfeet;
break;
case "feet":
x=x/feet;
y=y/feet;
break;
}
}
return new Array(x,y);
}
function tm2ll(_63){
var x=_63[0];
var y=_63[1];
var con,phi;
var _67;
var i;
var _69=6;
var lat,lon;
if(this.ind!=0){
var f=exp(x/(this.r_maj*this.scale_fact));
var g=0.5*(f-1/f);
var _6d=this.lat_origin+y/(this.r_maj*this.scale_fact);
var h=cos(_6d);
con=sqrt((1-h*h)/(1+g*g));
lat=asinz(con);
if(_6d<0){
lat=-lat;
}
if((g==0)&&(h==0)){
lon=this.lon_center;
}else{
lon=adjust_lon(atan2(g,h)+this.lon_center);
}
}else{
x=x-this.false_easting;
y=y-this.false_northing;
con=(this.ml0+y/this.scale_fact)/this.r_maj;
phi=con;
for(i=0;;i++){
_67=((con+this.e1*Math.sin(2*phi)-this.e2*Math.sin(4*phi)+this.e3*Math.sin(6*phi))/this.e0)-phi;
phi+=_67;
if(Math.abs(_67)<=EPSLN){
break;
}
if(i>=_69){
alert("Error in tm2ll(): Latitude failed to converge");
return (95);
}
}
if(Math.abs(phi)<HALF_PI){
var _6f=Math.sin(phi);
var _70=Math.cos(phi);
var _71=Math.tan(phi);
var c=this.esp*Math.pow(_70,2);
var cs=Math.pow(c,2);
var t=Math.pow(_71,2);
var ts=Math.pow(t,2);
con=1-this.es*Math.pow(_6f,2);
var n=this.r_maj/Math.sqrt(con);
var r=n*(1-this.es)/con;
var d=x/(n*this.scale_fact);
var ds=Math.pow(d,2);
lat=phi-(n*_71*ds/r)*(0.5-ds/24*(5+3*t+10*c-4*cs-9*this.esp-ds/30*(61+90*t+298*c+45*ts-252*this.esp-3*cs)));
lon=adjust_lon(this.lon_center+(d*(1-ds/6*(1+2*t+c-ds/20*(5-2*c+28*t-3*cs+8*this.esp+24*ts)))/_70));
}else{
lat=HALF_PI*sign(y);
lon=this.lon_center;
}
}
return new Array(lon*R2D,lat*R2D);
}
function msfnz(_7a,_7b,_7c){
var con=_7a*_7b;
return _7c/(Math.sqrt(1-con*con));
}
function tsfnz(_7e,phi,_80){
var con=_7e*_80;
var com=0.5*_7e;
con=Math.pow(((1-con)/(1+con)),com);
return (Math.tan(0.5*(HALF_PI-phi))/con);
}
function phi2z(_83,ts){
var _85=0.5*_83;
var con,dphi;
var phi=HALF_PI-2*Math.atan(ts);
for(i=0;i<=15;i++){
con=_83*Math.sin(phi);
dphi=HALF_PI-2*Math.atan(ts*(Math.pow(((1-con)/(1+con)),_85)))-phi;
phi+=dphi;
if(Math.abs(dphi)<=1e-10){
return phi;
}
}
alert("Convergence error - phi2z");
return -9999;
}
function sign(x){
if(x<0){
return (-1);
}else{
return (1);
}
}
function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function ButtonBase(_1,_2){
this.stylesheet=new XslProcessor(baseDir+"/widget/Button.xsl",_2.namespace);
var _3=_1.selectSingleNode("mb:buttonBar");
if(_3){
this.htmlTagId=_3.firstChild.nodeValue;
}else{
alert("buttonBar property required for object:"+_1.nodeName);
}
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.buttonType=_1.selectSingleNode("mb:class").firstChild.nodeValue;
if(this.buttonType=="RadioButton"){
this.enabled=false;
}
var _4=_1.selectSingleNode("mb:disabledSrc");
if(_4){
this.disabledImage=document.createElement("IMG");
this.disabledImage.src=config.skinDir+_4.firstChild.nodeValue;
}
var _5=_1.selectSingleNode("mb:enabledSrc");
if(_5){
this.enabledImage=document.createElement("IMG");
this.enabledImage.src=config.skinDir+_5.firstChild.nodeValue;
}
var _6=this.widgetNode.selectSingleNode("mb:cursor");
if(_6!=null){
var _7=_6.firstChild.nodeValue;
this.cursor=_7;
}else{
this.cursor="default";
}
this.prePaint=function(_8){
_8.resultDoc=_8.widgetNode;
};
this.doAction=function(){
};
this.select=function(){
var a=document.getElementById("mainMapContainer");
if(a!=null){
a.style.cursor=this.cursor;
}
if(this.buttonType=="RadioButton"){
if(this.node.selectedRadioButton){
with(this.node.selectedRadioButton){
if(_4){
image.src=_4.src;
}
enabled=false;
if(mouseHandler){
mouseHandler.enabled=false;
}
link.className="mbButton";
doSelect(false,this);
}
}
this.node.selectedRadioButton=this;
if(this.enabledImage){
this.image.src=this.enabledImage.src;
}
this.link.className="mbButtonSelected";
}
this.enabled=true;
if(this.mouseHandler){
this.mouseHandler.enabled=true;
}
this.doSelect(true,this);
};
this.doSelect=function(_a,_b){
};
var _c=_1.selectSingleNode("mb:selected");
if(_c&&_c.firstChild.nodeValue){
this.selected=true;
}
this.initMouseHandler=function(_d){
var _e=_d.widgetNode.selectSingleNode("mb:mouseHandler");
if(_e){
_d.mouseHandler=eval("config.objects."+_e.firstChild.nodeValue);
if(!_d.mouseHandler){
alert("error finding mouseHandler:"+_e.firstChild.nodeValue+" for button:"+_d.id);
}
}else{
_d.mouseHandler=null;
}
};
this.buttonInit=function(_f){
_f.image=document.getElementById(_f.id+"_image");
_f.link=document.getElementById(_f.outputNodeId);
if(_f.selected){
_f.select();
}
};
this.model.addListener("refresh",this.buttonInit,this);
this.model.addListener("init",this.initMouseHandler,this);
}

function ToolBase(_1,_2){
this.model=_2;
this.toolNode=_1;
var id=_1.selectSingleNode("@id");
if(id){
this.id=id.firstChild.nodeValue;
}else{
this.id="MbTool_"+mbIds.getId();
}
this.initTargetModel=function(_4){
var _5=_4.toolNode.selectSingleNode("mb:targetModel");
if(_5){
var _6=_5.firstChild.nodeValue;
_4.targetModel=window.config.objects[_6];
if(!_4.targetModel){
alert("error finding targetModel:"+_6+" for tool:"+_4.id);
}
}else{
_4.targetModel=_4.model;
}
};
this.model.addListener("init",this.initTargetModel,this);
this.initMouseHandler=function(_7){
var _8=_7.toolNode.selectSingleNode("mb:mouseHandler");
if(_8){
_7.mouseHandler=eval("config.objects."+_8.firstChild.nodeValue);
if(!_7.mouseHandler){
alert("error finding mouseHandler:"+_8.firstChild.nodeValue+" for tool:"+_7.id);
}
}
};
this.model.addListener("init",this.initMouseHandler,this);
this.enabled=true;
var _9=_1.selectSingleNode("mb:enabled");
if(_9){
this.enabled=eval(_9.firstChild.nodeValue);
}
}

MapLayer=function(_1,_2,_3,_4,_5,_6){
this.model=_1;
this.mapPane=_2;
this.layerName=_3;
this.layerNode=_4;
this.queryable=_5;
this.visible=_6;
this.zIndexFactor=500;
this.paint=function(_7,_8){
};
this.unpaint=function(){
};
this.isWmsLayer=function(){
return false;
};
};

function StyleLayerDescriptor(_1){
this.style=_1;
}
StyleLayerDescriptor.prototype.hiliteShape=function(gr,_3){
var _4=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic");
if(_4!=null){
var _5=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic/sld:OnlineResource");
gr.swapImage(_3,_5.attributes.getNamedItem("xlink:href").nodeValue);
}
if(this.strokeColor!=null){
gr.setShapeStrokeColor(_3,this.strokeColor);
}else{
}
if(this.strokeWidth!=null){
gr.setShapeStrokeWidth(_3,this.strokeWidth);
}
if(this.fillColor!=undefined){
gr.setShapeFillColor(_3,this.fillColor);
}else{
}
};
StyleLayerDescriptor.prototype.hilitePoint=function(gr,_7){
this.getStyleAttributes("sld:PointSymbolizer");
this.hiliteShape(gr,_7);
};
StyleLayerDescriptor.prototype.paintPoint=function(gr,_9){
var _a=null;
var X=_9[0];
var Y=_9[1];
var _d=0;
var dx=0;
var dy=0;
var _10=0;
var _11=0;
var _12=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Size");
if(_12!=null){
_d=_12.firstChild.nodeValue;
_11=_d;
_10=_d;
}else{
widthNode=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Width");
if(widthNode!=null){
_11=widthNode.firstChild.nodeValue;
}
heightNode=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Height");
if(heightNode!=null){
_10=heightNode.firstChild.nodeValue;
}
}
var _13=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement");
if(_13!=null){
dx=parseInt(this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement/sld:DisplacementX").firstChild.nodeValue);
dy=parseInt(this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement/sld:DisplacementY").firstChild.nodeValue);
}
var _14=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic");
if(_14!=null){
var _15=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic/sld:OnlineResource");
_a=gr.drawImage(_15.attributes.getNamedItem("xlink:href").nodeValue,X,Y,_11,_10,dx,dy);
}else{
var _16=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Mark/sld:WellKnownName");
if(_16!=null){
pointType=_16.firstChild.nodeValue;
this.getStyleAttributes("sld:PointSymbolizer/sld:Graphic/sld:Mark");
if(this.strokeColor!=null){
gr.setStrokeColor(this.strokeColor);
}
if(this.strokeWidth!=null){
gr.setStrokeWidth(this.strokeWidth);
}
if(this.fillColor!=null){
gr.setFillColor(this.fillColor);
}
if(pointType=="circle"){
_a=gr.fillCircle(X,Y,_d);
}else{
if(pointType=="square"){
}else{
if(pointType=="triangle"){
}else{
if(pointType=="cross"){
}else{
if(pointType=="star"){
}
}
}
}
}
}
}
return _a;
};
StyleLayerDescriptor.prototype.hiliteLine=function(gr,_18){
this.getStyleAttributes("sld:LineSymbolizer");
this.hiliteShape(gr,_18);
};
StyleLayerDescriptor.prototype.paintLine=function(gr,_1a){
var _1b=new Array(_1a.length);
var _1c=new Array(_1a.length);
for(var i=0;i<_1a.length;i++){
point=_1a[i];
_1b[i]=parseInt(point[0]);
_1c[i]=parseInt(point[1]);
}
this.getStyleAttributes("sld:LineSymbolizer");
if(this.strokeColor!=null){
gr.setStrokeColor(this.strokeColor);
}
if(this.strokeWidth!=null){
gr.setStrokeWidth(this.strokeWidth);
}
var _1e=gr.drawPolyline(_1b,_1c);
return _1e;
};
StyleLayerDescriptor.prototype.hilitePolygon=function(gr,_20){
this.getStyleAttributes("sld:PolygonSymbolizer");
this.hiliteShape(gr,_20);
};
StyleLayerDescriptor.prototype.paintPolygon=function(gr,_22){
var _23=new Array(_22.length+1);
var _24=new Array(_22.length+1);
for(var i=0;i<_22.length;i++){
point=_22[i];
_23[i]=parseInt(point[0]);
_24[i]=parseInt(point[1]);
}
_23[i]=_23[0];
_24[i]=_24[0];
this.getStyleAttributes("sld:PolygonSymbolizer");
if(this.strokeColor!=null){
gr.setStrokeColor(this.strokeColor);
}
if(this.strokeWidth!=null){
gr.setStrokeWidth(this.strokeWidth);
}
if(this.fillColor!=null){
gr.setFillColor(this.fillColor);
}
var _26=gr.drawPolygon(_23,_24);
return _26;
};
StyleLayerDescriptor.prototype.getStyleAttributes=function(_27){
var _28=this.style.selectSingleNode(_27+"/sld:Stroke/sld:CssParameter[@name='stroke']");
if(_28!=undefined){
this.strokeColor=_28.firstChild.nodeValue;
}else{
this.strokeColor=null;
}
_28=this.style.selectSingleNode(_27+"/sld:Stroke/sld:CssParameter[@name='stroke-width']");
if(_28!=undefined){
this.strokeWidth=_28.firstChild.nodeValue;
}else{
this.strokeWidth=null;
}
_28=this.style.selectSingleNode(_27+"/sld:Fill/sld:CssParameter[@name='fill']");
if(_28!=undefined){
this.fillColor=_28.firstChild.nodeValue;
}else{
this.fillColor=null;
}
};

var mac,win;
var opera,khtml,safari,mozilla,ie,ie50,ie55,ie60;
var canvasEnabled=false;
mapbuilder.loadScript(baseDir+"/util/Sarissa.js");
function chkCapabilities(){
var UA=navigator.userAgent;
var AV=navigator.appVersion;
ver=parseFloat(AV);
mac=AV.indexOf("Macintosh")==-1?false:true;
win=AV.indexOf("Windows")==-1?false:true;
opera=UA.indexOf("Opera")==-1?false:true;
khtml=((AV.indexOf("Konqueror")>=0)||(AV.indexOf("Safari")>=0))?true:false;
safari=(AV.indexOf("Safari")>=0)?true:false;
mozilla=moz=((UA.indexOf("Gecko")>=0)&&(!khtml))?true:false;
ie=((document.all)&&(!opera))?true:false;
ie50=ie&&AV.indexOf("MSIE 5.0")>=0;
ie55=ie&&AV.indexOf("MSIE 5.5")>=0;
ie60=ie&&AV.indexOf("MSIE 6.0")>=0;
if(ie){
mapbuilder.loadScript(baseDir+"/graphics/VMLGraphics.js");
}else{
if(document.implementation.hasFeature("org.w3c.dom.svg","1.0")){
mapbuilder.loadScript(baseDir+"/graphics/SVGGraphics.js");
}else{
alert("no support for SVG nor VML");
}
}
}
function VectorGraphics(id,_4,_5,_6){
if(ie){
return new VMLGraphics(id,_4,_5,_6);
}
if(safari||mozilla){
return new SVGGraphics(id,_4,_5,_6);
}
var gr=new jsGraphics(id);
return gr;
}
chkCapabilities();

var Rearth=6378137;
var degToMeter=Rearth*2*Math.PI/360;
var mbScaleFactor=3571.428;
var minScale=1000;
var maxScale=200000;
function Extent(_1,_2){
this.model=_1;
this.size=new Array();
this.res=new Array();
this.zoomBy=4;
this.id=_1.id+"_MbExtent"+mbIds.getId();
this.getCenter=function(){
return new Array((this.ul[0]+this.lr[0])/2,(this.ul[1]+this.lr[1])/2);
};
this.getXY=function(pl){
latlng=new Array(this.ul[0]+pl[0]*this.res[0],this.ul[1]-pl[1]*this.res[1]);
return latlng;
};
this.getPL=function(xy){
var p=Math.floor((xy[0]-this.ul[0])/this.res[0]);
var l=Math.floor((this.ul[1]-xy[1])/this.res[1]);
return new Array(p,l);
};
this.centerAt=function(_7,_8,_9){
var _a=new Array(this.size[0]/2,this.size[1]/2);
this.lr=new Array(_7[0]+_a[0]*_8,_7[1]-_a[1]*_8);
this.ul=new Array(_7[0]-_a[0]*_8,_7[1]+_a[1]*_8);
if(_9){
var _b=0;
if(this.lr[0]>ContextExtent.lr[0]){
_b=ContextExtent.lr[0]-this.lr[0];
}
if(this.ul[0]<ContextExtent.ul[0]){
_b=ContextExtent.ul[0]-this.ul[0];
}
this.lr[0]+=_b;
this.ul[0]+=_b;
var _c=0;
if(this.lr[1]<ContextExtent.lr[1]){
_c=ContextExtent.lr[1]-this.lr[1];
}
if(this.ul[1]>ContextExtent.ul[1]){
_c=ContextExtent.ul[1]-this.ul[1];
}
this.lr[1]+=_c;
this.ul[1]+=_c;
}
this.model.setBoundingBox(new Array(this.ul[0],this.lr[1],this.lr[0],this.ul[1]));
this.setSize(_8);
};
this.zoomToBox=function(ul,lr){
var _f=new Array((ul[0]+lr[0])/2,(ul[1]+lr[1])/2);
newres=Math.max((lr[0]-ul[0])/this.size[0],(ul[1]-lr[1])/this.size[1]);
this.centerAt(_f,newres);
};
this.setSize=function(res){
this.res[0]=this.res[1]=res;
this.size[0]=(this.lr[0]-this.ul[0])/this.res[0];
this.size[1]=(this.ul[1]-this.lr[1])/this.res[1];
this.width=Math.ceil(this.size[0]);
this.height=Math.ceil(this.size[1]);
};
this.setResolution=function(_11){
this.size[0]=_11[0];
this.size[1]=_11[1];
this.res[0]=(this.lr[0]-this.ul[0])/this.size[0];
this.res[1]=(this.ul[1]-this.lr[1])/this.size[1];
this.width=Math.ceil(this.size[0]);
this.height=Math.ceil(this.size[1]);
};
this.getScale=function(){
var _12=null;
switch(this.model.getSRS()){
case "EPSG:GMAPS":
break;
case "EPSG:4326":
case "EPSG:4269":
_12=this.res[0]*degToMeter;
break;
default:
_12=this.res[0];
break;
}
return mbScaleFactor*_12;
};
this.setScale=function(_13){
var _14=null;
switch(this.model.getSRS()){
case "EPSG:4326":
case "EPSG:4269":
_14=_13/(mbScaleFactor*degToMeter);
break;
default:
_14=_13/mbScaleFactor;
break;
}
this.centerAt(this.getCenter(),_14);
};
this.init=function(_15,_16){
var _17=_15.model.getBoundingBox();
_15.ul=new Array(_17[0],_17[3]);
_15.lr=new Array(_17[2],_17[1]);
_15.setResolution(new Array(_15.model.getWindowWidth(),_15.model.getWindowHeight()));
};
if(_2){
this.init(this,_2);
}
this.firstInit=function(_18,_19){
_18.init(_18,_19);
};
}

mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
WmsLayer=function(_1,_2,_3,_4,_5,_6){
MapLayer.apply(this,new Array(_1,_2,_3,_4,_5,_6));
this.d=new Date();
this.img=new Image();
this.img.objRef=_2;
this.mapPane=_2;
this.setSrc=function(_7){
this.src=_7;
};
this.paint=function(_8,_9,_a){
this.loadImgDiv(_8,this.layerNode,this.src,this.img,_a);
return _9;
};
this.isWmsLayer=function(){
return true;
};
this.getLayerDivId=function(){
var _b=this.model.id+"_"+this.mapPane.id+"_"+this.layerName;
return _b;
if(this.model.timestampList&&this.model.timestampList.getAttribute("layerName")==_3){
var _c=this.model.getParam("timestamp");
var _d=this.model.timestampList.childNodes[_c];
layerId+="_"+_d.firstChild.nodeValue;
}
};
this.loadImgDiv=function(_e,_f,_10,_11,_12){
var _13=document.getElementById(_e.mapPane.outputNodeId);
var _14=(_f.getAttribute("hidden")==1)?true:false;
var _15="image/gif";
var _16=_f.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");
if(_16){
_15=_16.firstChild.nodeValue;
}
var _17=this.getLayerDivId();
var _18=document.getElementById(_17);
if(!_18){
_18=document.createElement("div");
_18.setAttribute("id",_17);
_18.style.position="absolute";
_18.style.visibility=(_14)?"hidden":"visible";
_18.style.top="0px";
_18.style.left="0px";
_18.imgId=this.d.getTime();
_18.style.zIndex=this.zIndexFactor+_12;
var _19=document.createElement("img");
_19.id="real"+_18.imgId;
_19.setAttribute("src","../../lib/skin/default/images/Loading.gif");
_19.layerHidden=_14;
_18.appendChild(_19);
_13.appendChild(_18);
}
_11.id=_18.imgId;
_11.hidden=_14;
if(_SARISSA_IS_IE&&_15=="image/png"){
_11.fixPng=true;
}
_11.onload=MapImgLoadHandler;
_11.setAttribute("src",_10);
};
};
function MapImgLoadHandler(){
var _1a=document.getElementById("real"+this.id);
if(!this.objRef.firstImageLoaded){
this.objRef.firstImageLoaded=true;
var _1b=document.getElementById(this.objRef.outputNodeId);
var _1c=_1b.childNodes;
for(var i=0;i<_1c.length;++i){
var _1e=_1c[i].firstChild;
_1e.parentNode.style.visibility="hidden";
_1e.style.visibility="hidden";
if(_SARISSA_IS_IE){
_1e.src=config.skinDir+"/images/Spacer.gif";
}
}
if(_SARISSA_IS_IE){
_1c[0].firstChild.parentNode.parentNode.style.visibility="hidden";
}
_1b.style.left="0px";
_1b.style.top="0px";
}
--this.objRef.layerCount;
if(this.objRef.layerCount>0){
var _1f="loading "+this.objRef.layerCount+" map layers";
this.objRef.model.setParam("modelStatus",_1f);
}else{
this.objRef.model.setParam("modelStatus");
this.objRef.model.callListeners("refreshOtherLayers");
}
if(_SARISSA_IS_IE){
_1a.parentNode.parentNode.style.visibility="visible";
}
if(this.fixPng){
var vis=_1a.layerHidden?"hidden":"visible";
_1a.outerHTML=fixPNG(this,"real"+this.id);
if(!this.hidden){
fixImg=document.getElementById("real"+this.id);
fixImg.style.visibility="visible";
}
}else{
_1a.setAttribute("src",this.src);
_1a.width=this.objRef.model.getWindowWidth();
_1a.height=this.objRef.model.getWindowHeight();
if(!this.hidden){
_1a.parentNode.style.visibility="visible";
_1a.style.visibility="visible";
}
}
}

function VMLGraphics(id,_2,_3,_4){
this.div=_2;
this.width=_3;
this.height=height;
return this;
}
VMLGraphics.prototype.setStrokeColor=function(x){
this.strokeStyle=x;
};
VMLGraphics.prototype.setStrokeWidth=function(x){
this.strokeWeight=x;
};
VMLGraphics.prototype.setFillColor=function(x){
this.fillStyle=x;
};
VMLGraphics.prototype.setShapeStrokeColor=function(_8,x){
_8.setAttribute("strokeStyle",x);
};
VMLGraphics.prototype.setShapeStrokeWidth=function(_a,x){
_a.setAttribute("strokeWeight",x);
};
VMLGraphics.prototype.setShapeFillColor=function(_c,x){
_c.setAttribute("fillStyle",x);
};
VMLGraphics.prototype.drawPolyline=function(_e,_f){
var _10=_e.length;
var _11=_e[0]+","+_f[0];
for(var i=1;i<_10;i++){
_11+=","+_e[i]+","+_f[i];
}
var _13=document.createElement("vml:polyline");
_13.style.position="absolute";
_13.style.width=""+this.width;
_13.style.height=""+this.height;
_13.filled="false";
_13.strokecolor=this.strokeStyle;
_13.strokeweight=this.strokeWeight;
_13.points=_11;
this.div.appendChild(_13);
return _13;
};
VMLGraphics.prototype.drawPolygon=function(_14,_15){
return this.drawPolyline(_14,_15);
};
VMLGraphics.prototype.fillPolygon=function(_16,_17){
var _18=this.drawPolygon(_16,_17);
_18.filled="true";
return _18;
};
VMLGraphics.prototype.drawCircle=function(X,Y,_1b){
var _1c=_1b*2;
var _1d=document.createElement("vml:oval");
var _1e=X-_1b;
var _1f=Y-_1b;
_1d.style.position="relative";
_1d.style.left=_1e;
_1d.style.top=_1f;
_1d.style.width="6";
_1d.style.height="6";
_1d.strokecolor=this.strokeStyle;
_1d.strokeweigth="1pt";
this.div.appendChild(_1d);
return _1d;
};
VMLGraphics.prototype.fillCircle=function(X,Y,_22){
var _23=_22*2;
var _24=document.createElement("vml:oval");
var _25=X-_22;
var _26=Y-_22;
_24.style.position="relative";
_24.style.left=_25;
_24.style.top=_26;
_24.style.width=_23;
_24.style.height=_23;
_24.fillcolor=this.fillStyle;
_24.strokecolor=this.strokeStyle;
_24.strokeweigth="1pt";
this.div.appendChild(_24);
return _24;
};
VMLGraphics.prototype.drawImage=function(src,X,Y,_2a,_2b,dx,dy){
var _2e=X-dx;
var _2f=Y-dy;
var _30=document.createElement("vml:rect");
_30.style.position="absolute";
_30.style.left=_2e;
_30.style.top=_2f;
if(_2a!=null){
_30.style.width=_2a;
}
if(_2b!=null){
_30.style.height=_2b;
}
_30.filled="false";
_30.stroked="false";
var _31=document.createElement("vml:imagedata");
_31.src=src;
_30.appendChild(_31);
this.div.appendChild(_30);
return _30;
};
VMLGraphics.prototype.swapImage=function(_32,src){
var _34=_32.firstChild;
imagedate.src=src;
};
VMLGraphics.prototype.paint=function(){
};

mapbuilder.loadScript(baseDir+"/util/Util.js");
function SVGGraphics(id,_2,_3,_4){
var _5=document.getElementById("svg_element");
if(_5==null){
_5=document.createElementNS("http://www.w3.org/2000/svg","svg");
_5.setAttribute("id","svg_element");
_5.setAttribute("width",_3);
_5.setAttribute("height",_4);
if(_2!=null){
_2.appendChild(_5);
}
}
this.svg=_5;
return this;
}
SVGGraphics.prototype.setStrokeColor=function(x){
this.strokeStyle=x;
};
SVGGraphics.prototype.setStrokeWidth=function(x){
this.strokeWeight=x;
};
SVGGraphics.prototype.setFillColor=function(x){
this.fillStyle=x;
};
SVGGraphics.prototype.setShapeStrokeColor=function(_9,x){
_9.setAttribute("stroke",x);
};
SVGGraphics.prototype.setShapeStrokeWidth=function(_b,x){
_b.setAttribute("stroke-width",x);
};
SVGGraphics.prototype.setShapeFillColor=function(_d,x){
_d.fill=x;
};
SVGGraphics.prototype.drawPolyline=function(_f,_10){
var _11=_f.length;
var pts=_f[0]+","+_10[0];
for(var i=1;i<_11;i++){
pts+=","+_f[i]+","+_10[i];
}
var _14=document.createElementNS("http://www.w3.org/2000/svg","polyline");
_14.setAttribute("points",pts);
_14.setAttribute("stroke",this.strokeStyle);
_14.setAttribute("fill","none");
this.svg.appendChild(_14);
return _14;
};
SVGGraphics.prototype.drawPolygon=function(_15,_16){
var _17=this.drawPolyline(_15,_16);
return _17;
};
SVGGraphics.prototype.fillPolygon=function(_18,_19){
this.drawPolygon(_18,_19);
this.fill();
};
SVGGraphics.prototype.drawCircle=function(X,Y,_1c){
};
SVGGraphics.prototype.fillCircle=function(X,Y,_1f){
var _20=document.createElementNS("http://www.w3.org/2000/svg","circle");
_20.setAttribute("cx",X);
_20.setAttribute("cy",Y);
_20.setAttribute("r",_1f);
_20.setAttribute("stroke",this.strokeStyle);
_20.setAttribute("fill",this.fillStyle);
this.svg.appendChild(_20);
return _20;
};
SVGGraphics.prototype.drawImage=function(src,X,Y,_24,_25,dx,dy){
var _28=document.createElementNS("http://www.w3.org/2000/svg","image");
_28.setAttributeNS("http://www.w3.org/1999/xlink","href",src);
var _29=X-dx;
var _2a=Y-dy;
_28.setAttribute("x",_29);
_28.setAttribute("y",_2a);
if(_24!=0){
_28.setAttribute("width",_24);
}
if(_25!=0){
_28.setAttribute("height",_25);
}
this.svg.appendChild(_28);
return _28;
};
SVGGraphics.prototype.swapImage=function(_2b,src){
_2b.setAttributeNS("http://www.w3.org/1999/xlink","href",src);
};
SVGGraphics.prototype.paint=function(){
};

function MGRS(){
var _1=6;
var _2=new Array("A","J","S","A","J","S");
var _3=new Array("A","F","A","F","A","F");
var _4=new Array("A","J","S","A","J","S");
var _5=new Array("L","R","L","R","L","R");
var _6=20000000;
var _7=5;
var _8=4;
var _9=3;
var _a=2;
var _b=1;
var _c=_2;
var _d=_3;
var A=65;
var I=73;
var O=79;
var V=86;
var Z=90;
var _13=false;
var _14;
var _15;
var _16;
var _17;
var _18;
var _19;
var _1a;
var _1b;
var _1c;
this.convert=function(_1d,_1e){
_15=parseFloat(_1d);
_16=parseFloat(_1e);
_17=degToRad(_15);
_18=degToRad(_16);
LLtoUTM();
return formatMGRS();
};
function degToRad(deg){
return (deg*(Math.PI/180));
}
function LLtoUTM(){
var Lat=_15;
var _21=_16;
var a=6378137;
var _23=0.00669438;
var k0=0.9996;
var _25;
var _26;
var N,T,C,A,M;
var _28=_17;
var _29=_18;
var _2a;
var _2b;
_2b=Math.floor((_21+180)/6)+1;
if(_21==180){
_2b=60;
}
if(Lat>=56&&Lat<64&&_21>=3&&_21<12){
_2b=32;
}
if(Lat>=72&&Lat<84){
if(_21>=0&&_21<9){
_2b=31;
}else{
if(_21>=9&&_21<21){
_2b=33;
}else{
if(_21>=21&&_21<33){
_2b=35;
}else{
if(_21>=33&&_21<42){
_2b=37;
}
}
}
}
}
_25=(_2b-1)*6-180+3;
_2a=degToRad(_25);
_26=(_23)/(1-_23);
N=a/Math.sqrt(1-_23*Math.sin(_28)*Math.sin(_28));
T=Math.tan(_28)*Math.tan(_28);
C=_26*Math.cos(_28)*Math.cos(_28);
A=Math.cos(_28)*(_29-_2a);
M=a*((1-_23/4-3*_23*_23/64-5*_23*_23*_23/256)*_28-(3*_23/8+3*_23*_23/32+45*_23*_23*_23/1024)*Math.sin(2*_28)+(15*_23*_23/256+45*_23*_23*_23/1024)*Math.sin(4*_28)-(35*_23*_23*_23/3072)*Math.sin(6*_28));
var _2c=(k0*N*(A+(1-T+C)*A*A*A/6+(5-18*T+T*T+72*C-58*_26)*A*A*A*A*A/120)+500000);
var _2d=(k0*(M+N*Math.tan(_28)*(A*A/2+(5-T+9*C+4*C*C)*A*A*A*A/24+(61-58*T+T*T+600*C-330*_26)*A*A*A*A*A*A/720)));
if(Lat<0){
_2d+=10000000;
}
_19=Math.round(_2d);
_1a=Math.round(_2c);
_1b=_2b;
_1c=getLetterDesignator(Lat);
}
function getLetterDesignator(lat){
var _2f="Z";
if((84>=lat)&&(lat>=72)){
_2f="X";
}else{
if((72>lat)&&(lat>=64)){
_2f="W";
}else{
if((64>lat)&&(lat>=56)){
_2f="V";
}else{
if((56>lat)&&(lat>=48)){
_2f="U";
}else{
if((48>lat)&&(lat>=40)){
_2f="T";
}else{
if((40>lat)&&(lat>=32)){
_2f="S";
}else{
if((32>lat)&&(lat>=24)){
_2f="R";
}else{
if((24>lat)&&(lat>=16)){
_2f="Q";
}else{
if((16>lat)&&(lat>=8)){
_2f="P";
}else{
if((8>lat)&&(lat>=0)){
_2f="N";
}else{
if((0>lat)&&(lat>=-8)){
_2f="M";
}else{
if((-8>lat)&&(lat>=-16)){
_2f="L";
}else{
if((-16>lat)&&(lat>=-24)){
_2f="K";
}else{
if((-24>lat)&&(lat>=-32)){
_2f="J";
}else{
if((-32>lat)&&(lat>=-40)){
_2f="H";
}else{
if((-40>lat)&&(lat>=-48)){
_2f="G";
}else{
if((-48>lat)&&(lat>=-56)){
_2f="F";
}else{
if((-56>lat)&&(lat>=-64)){
_2f="E";
}else{
if((-64>lat)&&(lat>=-72)){
_2f="D";
}else{
if((-72>lat)&&(lat>=-80)){
_2f="C";
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
return _2f;
}
function formatMGRS(){
var _30=""+_1a;
var _31=""+_19;
while(_31.length>6){
_31=_31.substr(1,_31.length-1);
}
var str=_1b+""+_1c+get100kID(_1a,_19,_1b)+_30.substr(1,4)+_31.substr(1,4);
return str;
}
function get100kID(_33,_34,_35){
var _36=get100kSetForZone(_35);
var _37=Math.floor(_33/100000);
var _38=Math.floor(_34/100000)%20;
return getLetter100kID(_37,_38,_36);
}
function get100kSetForZone(i){
var _3a=i%_1;
if(_3a==0){
_3a=_1;
}
return _3a;
}
function getLetter100kID(_3b,row,_3d){
var _3e=_3d-1;
var _3f=AsciiToNum(_2[_3e]);
var _40=AsciiToNum(_3[_3e]);
var _41=_3f+_3b-1;
var _42=_40+row;
var _43=false;
if(_41>Z){
_41=_41-Z+A-1;
_43=true;
}
if(_41==I||(_3f<I&&_41>I)||((_41>I||_3f<I)&&_43)){
_41++;
}
if(_41==O||(_3f<O&&_41>O)||((_41>O||_3f<O)&&_43)){
_41++;
if(_41==I){
_41++;
}
}
if(_41>Z){
_41=_41-Z+A-1;
}
if(_42>V){
_42=_42-V+A-1;
_43=true;
}else{
_43=false;
}
if(((_42==I)||((_40<I)&&(_42>I)))||(((_42>I)||(_40<I))&&_43)){
_42++;
}
if(((_42==O)||((_40<O)&&(_42>O)))||(((_42>O)||(_40<O))&&_43)){
_42++;
if(_42==I){
_42++;
}
}
if(_42>V){
_42=_42-V+A-1;
}
var _44=NumToAscii(_41)+""+NumToAscii(_42);
return _44;
}
function AsciiToNum(_45){
switch(_45){
case "A":
return 65;
case "B":
return 66;
case "C":
return 67;
case "D":
return 68;
case "E":
return 69;
case "F":
return 70;
case "G":
return 71;
case "H":
return 72;
case "I":
return 73;
case "J":
return 74;
case "K":
return 75;
case "L":
return 76;
case "M":
return 77;
case "N":
return 78;
case "O":
return 79;
case "P":
return 80;
case "Q":
return 81;
case "R":
return 82;
case "S":
return 83;
case "T":
return 84;
case "U":
return 85;
case "V":
return 86;
case "W":
return 87;
case "X":
return 88;
case "Y":
return 89;
case "Z":
return 90;
}
}
function NumToAscii(num){
switch(num){
case 65:
return "A";
case 66:
return "B";
case 67:
return "C";
case 68:
return "D";
case 69:
return "E";
case 70:
return "F";
case 71:
return "G";
case 72:
return "H";
case 73:
return "I";
case 74:
return "J";
case 75:
return "K";
case 76:
return "L";
case 77:
return "M";
case 78:
return "N";
case 79:
return "O";
case 80:
return "P";
case 81:
return "Q";
case 82:
return "R";
case 83:
return "S";
case 84:
return "T";
case 85:
return "U";
case 86:
return "V";
case 87:
return "W";
case 88:
return "X";
case 89:
return "Y";
case 90:
return "Z";
}
}
}

