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
while(this.loadingScripts.length>0&&(this.loadingScripts[0].readyState=="uninitialized"||this.loadingScripts[0].readyState=="loaded"||this.loadingScripts[0].readyState=="uninitialized"||this.loadingScripts[0].readyState=="complete"||this.loadingScripts[0].readyState==null)){
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
var _3=document.createElement("script");_3.readyState=="complete";this.loadingScripts.push(_3);
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
var _26=(_21.style)?"display:inline-block;"+_21.style.cssText:"";
var _27="<span "+_23+_24+_25;
_27+=" style=\""+"width:"+_21.width+"px; height:"+_21.height+"px;"+_26+";";
var src=_21.src;
src=src.replace(/\(/g,"%28");
src=src.replace(/\)/g,"%29");
src=src.replace(/'/g,"%27");
src=src.replace(/%23/g,"%2523");
_27+="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader";
_27+="(src='"+src+"', sizingMethod='scale'); \"></span>";
_21.outerHTML=_27;
return _21;
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
if(!_2){
alert("undefined listener for:"+_3);
}
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
if(!_5){
alert("undefined listener for:"+_6);
}
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
this.setXpathValueML=function(_11,_12,_13){
if(_11.doc){
node=_11.doc.selectSingleNode(_12);
if(node){
if(node.firstChild){
node.firstChild.nodeValue=_13;
}else{
dom=Sarissa.getDomDocument();
v=dom.createTextNode(_13);
node.appendChild(v);
}
_11.setParam("refresh_mouse");
return true;
}else{
return false;
}
}
};
this.loadModelDoc=function(_14){
if(_14.url){
_14.callListeners("newModel");
_14.setParam("modelStatus","loading");
if(_14.contentType=="image"){
_14.doc=new Image();
_14.doc.src=_14.url;
}else{
var _15=new XMLHttpRequest();
var _16=_14.url;
if(_16.indexOf("http://")==0){
_16=getProxyPlusUrl(_16);
}
_15.open(_14.method,_16,_14.async);
if(_14.method=="post"){
_15.setRequestHeader("content-type",_14.contentType);
_15.setRequestHeader("serverUrl",_14.url);
}
_15.onreadystatechange=function(){
_14.setParam("modelStatus",httpStatusMsg[_15.readyState]);
if(_15.readyState==4){
if(_15.status>=400){
var _17="error loading document: "+_16+" - "+_15.statusText+"-"+_15.responseText;
alert(_17);
_14.setParam("modelStatus",_17);
return;
}else{
if(null==_15.responseXML){
alert("null XML response:"+_15.responseText);
}else{
if(_15.responseXML!=null){
_14.doc=_15.responseXML;
if(_14.doc.parseError==0){
_14.finishLoading();
}else{
alert("Parsing Error:"+_14.doc.parseError+" "+Sarissa.getParseErrorText(_14.doc));
}
}else{
_14.doc=Sarissa.getDomDocument();
_14.doc.async=false;
_14.doc=(new DOMParser()).parseFromString(_15.responseText,"text/xml");
if(_14.doc==null){
alert("Document parseError:"+Sarissa.getParseErrorText(_14.doc));
}else{
if(_14.doc.parseError==0){
_14.finishLoading();
}else{
alert("Parsing Error:"+_14.doc.parseError+" "+Sarissa.getParseErrorText(_14.doc));
}
}
}
}
}
}
};
_15.send(_14.postData);
if(!_14.async){
if(_15.status>=400){
var _18="error loading document: "+_16+" - "+_15.statusText+"-"+_15.responseText;
alert(_18);
this.objRef.setParam("modelStatus",_18);
return;
}else{
if(null==_15.responseXML){
alert("null XML response:"+_15.responseText);
}
_14.doc=_15.responseXML;
_14.finishLoading();
}
}
}
}
};
this.addListener("reloadModel",this.loadModelDoc,this);
this.setModel=function(_19,_1a){
_19.callListeners("newModel");
_19.doc=_1a;
if((_1a==null)&&_19.url){
_19.url=null;
}
_19.finishLoading();
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
this.newRequest=function(_1b,_1c){
var _1d=_1b;
if(_1b.template){
var _1e=_1b.modelNode.parentNode;
if(_SARISSA_IS_IE){
var _1f=_1e.appendChild(_1.cloneNode(true));
}else{
var _1f=_1e.appendChild(_1b.modelNode.ownerDocument.importNode(_1b.modelNode,true));
}
_1f.removeAttribute("id");
_1d=_1b.createObject(_1f);
_1d.callListeners("init");
if(!_1b.templates){
_1b.templates=new Array();
}
_1b.templates.push(_1d);
}
_1d.url=_1c.url;
if(!_1d.url){
_1d.doc=null;
}
_1d.method=_1c.method;
_1d.postData=_1c.postData;
_1d.loadModelDoc(_1d);
};
this.deleteTemplates=function(){
if(this.templates){
while(model=this.templates.pop()){
model.setParam("newModel");
var _20=this.modelNode.parentNode;
_20.removeChild(model.modelNode);
}
}
};
this.saveModel=function(_21){
if(config.serializeUrl){
var _22=postLoad(config.serializeUrl,_21.doc);
_22.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_22,"xmlns:xlink='http://www.w3.org/1999/xlink'");
var _23=_22.selectSingleNode("//OnlineResource");
var _24=_23.attributes.getNamedItem("xlink:href").nodeValue;
_21.setParam("modelSaved",_24);
}else{
alert("serializeUrl must be specified in config to save a model");
}
};
this.createObject=function(_25){
var _26=_25.nodeName;
var _27=new window[_26](_25,this);
if(_27){
config.objects[_27.id]=_27;
return _27;
}else{
alert("error creating object:"+_26);
}
};
this.loadObjects=function(_28){
var _29=this.modelNode.selectNodes(_28);
for(var i=0;i<_29.length;i++){
this.createObject(_29[i]);
}
};
this.parseConfig=function(_2b){
_2b.loadObjects("mb:widgets/*");
_2b.loadObjects("mb:tools/*");
_2b.loadObjects("mb:models/*");
};
this.refresh=function(_2c){
_2c.setParam("refresh");
};
this.addListener("loadModel",this.refresh,this);
this.init=function(_2d){
_2d.callListeners("init");
};
this.clearModel=function(_2e){
_2e.doc=null;
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

function CanvasGraphics(id,_2){
this.div=_2;
var _3=document.createElement("canvas");
_3.setAttribute("width","800px");
_3.setAttribute("height","400px");
_3.setAttribute("style","position: absolute; top: 0pt; left: 0pt; width: 800px; height: 400px");
_2.appendChild(_3);
var _4=_3.getContext("2d");
this.context=_4;
return this;
}
CanvasGraphics.prototype.setStroke=function(x){
this.context.strokeStyle=x;
};
CanvasGraphics.prototype.setColor=function(_6){
this.context.fillStyle=_6;
this.context.strokeStyle=_6;
};
CanvasGraphics.prototype.drawPolyline=function(_7,_8){
var _9=_7.length;
this.context.beginPath();
this.context.moveTo(_7[0],_8[0]);
for(var i=1;i<_9;i++){
this.context.lineTo(_7[i],_8[i]);
}
this.context.stroke();
};
CanvasGraphics.prototype.drawPolygon=function(_b,_c){
this.drawPolyLine(_b,_c);
this.context.closePath();
};
CanvasGraphics.prototype.fillPolygon=function(_d,_e){
this.drawPolygon(_d,_e);
this.context.fill();
};
CanvasGraphics.prototype.drawCircle=function(X,Y,_11){
this.context.beginPath();
this.context.arc(X,Y,_11,0,Math.PI*2,true);
};
CanvasGraphics.prototype.fillCircle=function(X,Y,_14){
this.drawCircle(X,Y,_14);
this.context.fill();
};
CanvasGraphics.prototype.drawImage=function(src,X,Y,_18,_19){
};
CanvasGraphics.prototype.paint=function(){
};

mapbuilder.loadScript(baseDir+"/widget/Popup.js");
mapbuilder.loadScript(baseDir+"/graphics/FeaturePointFactory.js");
mapbuilder.loadScript(baseDir+"/graphics/FeatureLineFactory.js");
mapbuilder.loadScript(baseDir+"/graphics/FeatureTrackFactory.js");
function FeatureFactory(_1,_2,_3){
this.featurePointFactory=new FeaturePointFactory(_1,_2,_3);
this.featureLineFactory=new FeatureLineFactory(_1,_2,_3);
this.featureTrackFactory=new FeatureTrackFactory(_1,_2,_3);
}
FeatureFactory.prototype.clearFeatures=function(_4){
this.featurePointFactory.clearFeatures(_4);
this.featureLineFactory.clearFeatures(_4);
this.featureTrackFactory.clearFeatures(_4);
};
FeatureFactory.prototype.createFeature=function(_5,_6,_7,_8,_9,_a,_b){
if(_6=="POINT"){
this.featurePointFactory.createFeature(_5,_7,_8,_9,_a,_b);
}else{
if(_6=="LINESTRING"){
this.featureLineFactory.createFeature(_5,_7,_8,_9,_a,_b);
}else{
if(_6=="TRACK"){
}else{
if(_6=="CURVE"){
alert("NOT IMPLEMENTED YET");
}else{
if(_6=="POLY"){
alert("NOT IMPLEMENTED YET");
}else{
if(_6=="TEST"){
var _c=document.createElement("div");
_c.setAttribute("id","test");
_c.style.position="relative";
_c.style.height="0px";
_c.style.width="0px";
_c.style.visibility="hidden";
_c.style.zIndex=301;
this.testDiv=_c;
_5.node.appendChild(_c);
testingCanvas(_5);
}else{
alert("feature:"+_6+" is not supported");
}
}
}
}
}
}
};
function testingCanvas(_d){
var _e=document.createElement("CANVAS");
_e.setAttribute("id","canvas_test2");
_e.setAttribute("width","600px");
_e.setAttribute("height","300px");
_e.setAttribute("style","position: absolute; top: 0pt; left: 0pt; width: 600px; height: 300px");
_d.node.appendChild(_e);
var _f=_e.getContext("2d");
if(_e.getContext){
var ctx=_e.getContext("2d");
ctx.fillStyle="green";
ctx.fillRect(5,5,25,25);
ctx.strokeStyle="red";
ctx.strokeRect(20,20,25,25);
ctx.beginPath();
ctx.lineWidth=1;
ctx.moveTo(1,1);
ctx.lineTo(80,80);
ctx.lineTo(100,20);
ctx.closePath();
ctx.stroke();
ctx.strokeStyle="blue";
ctx.fillStyle="black";
ctx.beginPath();
ctx.moveTo(120,50);
ctx.lineTo(150,70);
ctx.lineTo(150,50);
}else{
alert("no canvas context");
}
}

mapbuilder.loadScript(baseDir+"/graphics/Vectorgraphics.js");
function FeatureLine(_1,_2,_3,_4,_5,_6,_7){
var _8=document.createElement("div");
_8.setAttribute("id",_3+"_normal");
_8.style.position="absolute";
_8.style.visibility="visible";
_8.style.zIndex=300;
_8.tipObjectName=_6;
_8.position=_7;
this.lineNormalDiv=_8;
_1.node.appendChild(_8);
var _9=new Array(_2.length);
var _a=new Array(_2.length);
for(var i=0;i<_2.length;i++){
point=_2[i];
_9[i]=parseInt(point[0]);
_a[i]=parseInt(point[1]);
}
var gr=new VectorGraphics(_3+"_normal",_8);
gr.setColor("red");
var _d=gr.drawPolyline(_9,_a);
gr.paint();
this.install(_d,_3,_5);
return this;
}
FeatureLine.prototype.clear=function(_e){
_e.node.removeChild(this.lineNormalDiv);
};
FeatureLine.prototype.mouseOverHandler=function(ev){
this.strokecolor="yellow";
var _10=document.getElementById(this.itemId+"_normal");
var _11=window.cursorTrackObject;
var _12=window.cursorTrackNode.evpl;
var X=_12[0];
var Y=_12[1];
var _15=this.popupStr;
if(_15==undefined){
_15="Feature under construction.  Stay tuned!";
}
toolTipObjs[_10.tipObjectName].paint(new Array(""+X,""+Y,200,this.title,_15));
return true;
};
FeatureLine.prototype.mouseOutHandler=function(ev){
this.strokecolor="red";
var _17=document.getElementById(this.itemId+"_normal");
toolTipObjs[_17.tipObjectName].clear();
};
FeatureLine.prototype.install=function(_18,_19,_1a){
_18.itemId=_19;
_18.popupStr=_1a;
_18.onmouseover=this.mouseOverHandler;
_18.onmouseout=this.mouseOutHandler;
};

mapbuilder.loadScript(baseDir+"/graphics/FeatureLine.js");
function FeatureLineFactory(_1,_2,_3){
this.lines=new Array();
this.tipObjectName=_3;
}
FeatureLineFactory.prototype.clearFeatures=function(_4){
for(id in this.lines){
var _5=this.lines[id];
_5.clear(_4);
}
this.lines=new Array();
};
FeatureLineFactory.prototype.createFeature=function(_6,_7,_8,_9,_a,_b){
if(_b==null){
_b=this.normalImage;
}
var _c=new FeatureLine(_6,_7,_8,_9,_a,this.tipObjectName,this.defaultPopupPosition);
this.lines[_8]=_c;
};

mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");
function FeaturePoint(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b){
var _c=_a.split(" ");
var _d=_b.split(" ");
var _e=document.createElement("div");
if(_5!=undefined){
_e.setAttribute("id",_3+"_normal");
}else{
_e.setAttribute("id",_3+"_lastPos");
}
_e.style.position="absolute";
_e.style.visibility="visible";
_e.style.zIndex=300;
_e.tipObjectName=_6;
_e.title=_4;
var X=_2[0];
var Y=_2[1];
var gr=new VectorGraphics(_3+"_normal",_e);
gr.setColor("red");
var _12=gr.fillCircle(X,Y,3);
_12.itemId=_3;
gr.paint();
this.install(_12,_3,_5);
_1.node.appendChild(_e);
this.normalImageDiv=_e;
return this;
}
FeaturePoint.prototype.clear=function(_13){
var img=this.normalImageDiv.firstChild;
img.onmouseover=null;
img.onmouseout=null;
_13.node.removeChild(this.normalImageDiv);
if(this.highlightImageDiv!=undefined){
img=this.highlightImageDiv.firstChild;
img.onmouseover=null;
img.onmouseout=null;
_13.node.removeChild(this.highlightImageDiv);
}
};
FeaturePoint.prototype.mouseOverHandler=function(ev){
this.strokecolor="yellow";
this.fillcolor="yellow";
normalImageDiv=document.getElementById(this.itemId+"_normal");
var _16=window.cursorTrackObject;
var _17=window.cursorTrackNode.evpl;
var X=_17[0];
var Y=_17[1];
var _1a=this.popupStr;
if(_1a==undefined){
_1a="Feature under construction.  Stay tuned!";
}
toolTipObjs[normalImageDiv.tipObjectName].paint(new Array(""+X,""+Y,200,this.title,_1a));
return false;
};
FeaturePoint.prototype.mouseOutHandler=function(ev){
this.strokecolor="red";
this.fillcolor="red";
var _1c=document.getElementById(this.itemId+"_normal");
_1c.style.visibility="visible";
toolTipObjs[_1c.tipObjectName].clear();
};
FeaturePoint.prototype.install=function(_1d,_1e,_1f){
_1d.itemId=_1e;
_1d.popupStr=_1f;
_1d.onmouseover=this.mouseOverHandler;
_1d.onmouseout=this.mouseOutHandler;
};

mapbuilder.loadScript(baseDir+"/graphics/FeaturePoint.js");
function FeaturePointFactory(_1,_2,_3){
if(_1.selectSingleNode("mb:normalImage")){
this.normalImage=_1.selectSingleNode("mb:normalImage").firstChild.nodeValue;
}
if(_1.selectSingleNode("mb:highlightImage")){
this.highlightImage=_1.selectSingleNode("mb:highlightImage").firstChild.nodeValue;
}
if(_1.selectSingleNode("mb:imageOffset")){
this.imgOffset=_1.selectSingleNode("mb:imageOffset").firstChild.nodeValue;
}
if(_1.selectSingleNode("mb:shadowImage")){
this.shadowImage=_1.selectSingleNode("mb:shadowImage").firstChild.nodeValue;
}
if(_1.selectSingleNode("mb:shadowOffset")){
this.shadowOffset=_1.selectSingleNode("mb:shadowOffset").firstChild.nodeValue;
}
this.points=new Array();
this.tipObjectName=_3;
}
FeaturePointFactory.prototype.clearFeatures=function(_4){
for(id in this.points){
var pt=this.points[id];
pt.clear(_4);
}
this.points=new Array();
};
FeaturePointFactory.prototype.createFeature=function(_6,_7,_8,_9,_a,_b){
if(_b==null){
_b=this.normalImage;
}
var pt=new FeaturePoint(_6,_7,_8,_9,_a,this.tipObjectName,_b,this.highlightImage,this.shadowImage,this.imgOffset,this.shadowOffset);
this.points[_8]=pt;
};

mapbuilder.loadScript(baseDir+"/graphics/FeatureLineFactory.js");
mapbuilder.loadScript(baseDir+"/graphics/FeaturePointFactory.js");
function FeatureTrackFactory(_1,_2,_3){
this.lineFactory=new FeatureLineFactory(_1,_2,_3);
this.pointFactory=new FeaturePointFactory(_1,_2,_3);
}
FeatureTrackFactory.prototype.clearFeatures=function(_4){
this.lineFactory.clearFeatures(_4);
this.pointFactory.clearFeatures(_4);
};
FeatureTrackFactory.prototype.createFeature=function(_5,_6,_7,_8,_9,_a){
this.lineFactory.createFeature(_5,_6,_7,_8,_9,_a);
var _b=_6[_6.length-1];
this.pointFactory.createFeature(_5,_b,_7,null,null,_a);
};

mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
GmlLayer=function(_1,_2,_3,_4,_5,_6){
MapLayer.apply(this,new Array(_1,_2,_3,_4,_5,_6));
this.paint=function(_7,_8){
};
};

mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/tool/GoogleMapTools.js");
function GoogleMapLayer(_1,_2,_3,_4,_5,_6){
MapLayer.apply(this,new Array(_1,_2,_3,_4,_5,_6));
this.getDiv=function(_7){
var _8=document.getElementById(this.mapPane.outputNodeId).parentNode;
div=document.getElementById(this.layerName);
if(div==null){
div=document.createElement("div");
div.setAttribute("id",this.layerName);
div.style.position="absolute";
div.style.visibility="visible";
div.style.zIndex=_7*this.zIndexFactor;
div.style.top=0;
div.style.left=0;
div.style.width=this.mapPane.model.getWindowWidth();
div.style.height=this.mapPane.model.getWindowHeight();
_8.appendChild(div);
}
return div;
};
this.paint=function(_9,_a,_b){
div=this.getDiv(_b);
div.style.top=0;
div.style.left=0;
gmap=this.mapPane.model.getParam("gmap");
if(!gmap){
gmap=new GMap2(div);
gmap.disableDragging();
this.mapPane.model.setParam("gmap",gmap);
this.mapPane.googleMapTools=new GoogleMapTools();
this.mapPane.googleMapTools.centerAndZoom(this.mapPane.model);
this.mapPane.googleMapTools.useGoogleMapExtent(this.mapPane.model);
config.objects.gmap=gmap;
config.objects.googleMapTools=this.mapPane.googleMapTools;
}else{
this.mapPane.googleMapTools.centerAndZoom(this.mapPane.model);
}
};
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

mapbuilder.loadScript(baseDir+"/graphics/WmsLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/TiledWmsLayer.js");
function MapLayerMgr(_1,_2){
this.layers=new Array();
this.mapPane=_1;
this.model=_2;
this.id="MapLayerMgr";
this.namespace="xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";
}
MapLayerMgr.prototype.paint=function(_3,_4,_5){
var _6=null;
service=_4.selectSingleNode("wmc:Server/@service");
if(service){
service=service.nodeValue;
}
var _7=_4.nodeName;
if(service=="GoogleMap"){
_6=new GoogleMapLayer(_3.model,_3.mapPane,"GoogleMapLayer",_4,false,true);
_3.layers.push(_6);
}else{
if((service=="wms-c")||(service=="OGC:WMS-C")||(service=="wms")||(service=="OGC:WMS")){
_3.addTiledWmsLayer(_3.model,_3.mapPane,_4,_5);
}else{
if(_7.indexOf("RssLayer")>=0){
var _8=_4.getAttribute("id");
_6=new RssLayer(_3.model,_3.mapPane,_8,_4,false,true);
_3.layers.push(_6);
}else{
if(_7.indexOf("FeatureType")>=0){
var _8=_4.selectSingleNode("wmc:Name").firstChild.nodeValue;
if(_3.getLayer(_8)==null){
_6=new WfsQueryLayer(_4.model,_3.mapPane,_8,_4,false,true);
_3.layers.push(_6);
}
}else{
alert("Failed adding Layer:"+_7+" service:"+service);
}
}
}
}
};
MapLayerMgr.prototype.addWmsLayer=function(_9,_a,_b){
var _c=_b.selectSingleNode("wmc:Name");
if(_c){
layerName=_c.firstChild.nodeValue;
}else{
layerName="UNKNOWN";
}
var _d=_b.getAttribute("queryable");
var _e=_b.getAttribute("hidden");
var _f=new WmsLayer(_9,_a,layerName,_b,_d,_e);
_a.MapLayerMgr.layers.push(_f);
return _f;
};
MapLayerMgr.prototype.addTiledWmsLayer=function(_10,_11,_12,_13){
var _14=_12.selectSingleNode("wmc:Name");
if(_14){
layerName=_14.firstChild.nodeValue;
}else{
layerName="UNKNOWN";
}
var _15=_12.getAttribute("queryable");
var _16=_12.getAttribute("hidden");
var _17=new TiledWmsLayer(_10,_11,layerName,_12,_15,_16);
_17.paint(this,_13);
};

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
_40.onmouseup=this.mouseClickHandler;
};
this.mouseOverHandler=function(ev){
var _42=document.getElementById("mainMapContainer");
if(_42){
_42.oldEventHandler=_42.onmouseup;
_42.onmouseup=null;
_42.onmousedown=null;
}
this.style.cursor="help";
return true;
};
this.mouseOutHandler=function(ev){
this.style.cursor="default";
var _44=document.getElementById("mainMapContainer");
if(_44){
_44.onmouseup=_44.oldEventHandler;
_44.onmousedown=_44.oldEventHandler;
}
return true;
};
this.mouseClickHandler=function(ev){
ev.cancelBubble=true;
if(ev.stopPropagation){
ev.stopPropagation();
}
config.objects.geoRSS.setParam("clickFeature",this.id);
return true;
};
this.clickIt=function(_46,_47){
if(_47.indexOf(_46.id)>=0){
var _48=0;
var _49=0;
var cn=window.cursorTrackNode;
if(cn){
var _4b=cn.evpl;
if(_4b!=null){
_48=_4b[0];
_49=_4b[1];
var _4c=_46.myabstract;
if(_4c==undefined){
_4c="Feature under construction.  Stay tuned!";
}
}
}
if(_48>0&&_48<_46.width&&_49>0&&_49<_46.height){
toolTipObjs[_46.tooltip].paint(new Array(_48,_49,_47,_46.title,_4c));
}
}
};
this.highlight=function(_4d,_4e){
if(_4e.indexOf(_4d.id)>=0){
_4d.paintShape(_4d.hiliteSld,true);
var _4f=0;
var _50=0;
var cn=window.cursorTrackNode;
if(cn){
var _52=cn.evpl;
if(_52!=null){
_4f=_52[0];
_50=_52[1];
var _53=_4d.myabstract;
if(_53==undefined){
_53="Feature under construction.  Stay tuned!";
}
}
}
if(_4f>0&&_4f<_4d.width&&_50>0&&_50<_4d.height){
toolTipObjs[_4d.tooltip].paint(new Array(_4f,_50,_4e,_4d.title,_53));
}
}
};
this.dehighlight=function(_54,_55){
if(_55.indexOf(_54.id)>=0){
_54.paintShape(_54.normalSld,true);
toolTipObjs[_54.tooltip].clear();
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

function StyleLayerDescriptor(_1){
this.style=_1;
}
StyleLayerDescriptor.prototype.hiliteShape=function(gr,_3,_4){
this.getStyleAttributes(_4);
if(_4=="sld:PointSymbolizer"){
var _5=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic");
if(_5!=null){
var _6=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic/sld:OnlineResource");
gr.swapImage(_3,_6.attributes.getNamedItem("xlink:href").nodeValue);
return;
}
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
StyleLayerDescriptor.prototype.hilitePoint=function(gr,_8){
this.hiliteShape(gr,_8,"sld:PointSymbolizer");
};
StyleLayerDescriptor.prototype.paintPoint=function(gr,_a){
var _b=null;
var X=_a[0];
var Y=_a[1];
var _e=0;
var dx=0;
var dy=0;
var _11=0;
var _12=0;
this.getStyleAttributes("sld:PointSymbolizer");
var _13=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Size");
if(_13!=null){
_e=_13.firstChild.nodeValue;
_12=_e;
_11=_e;
}else{
widthNode=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Width");
if(widthNode!=null){
_12=widthNode.firstChild.nodeValue;
}
heightNode=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Height");
if(heightNode!=null){
_11=heightNode.firstChild.nodeValue;
}
}
var _14=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement");
if(_14!=null){
dx=parseInt(this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement/sld:DisplacementX").firstChild.nodeValue);
dy=parseInt(this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Displacement/sld:DisplacementY").firstChild.nodeValue);
}
var _15=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic");
if(_15!=null){
var _16=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:ExternalGraphic/sld:OnlineResource");
_b=gr.drawImage(_16.attributes.getNamedItem("xlink:href").nodeValue,X,Y,_12,_11,dx,dy);
}else{
var _17=this.style.selectSingleNode("sld:PointSymbolizer/sld:Graphic/sld:Mark/sld:WellKnownName");
if(_17!=null){
pointType=_17.firstChild.nodeValue;
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
_b=gr.fillCircle(X,Y,_e);
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
return _b;
};
StyleLayerDescriptor.prototype.hiliteLine=function(gr,_19){
this.hiliteShape(gr,_19,"sld:LineSymbolizer");
};
StyleLayerDescriptor.prototype.paintLine=function(gr,_1b){
var _1c=new Array(_1b.length);
var _1d=new Array(_1b.length);
for(var i=0;i<_1b.length;i++){
point=_1b[i];
_1c[i]=parseInt(point[0]);
_1d[i]=parseInt(point[1]);
}
this.getStyleAttributes("sld:LineSymbolizer");
if(this.strokeColor!=null){
gr.setStrokeColor(this.strokeColor);
}
if(this.strokeWidth!=null){
gr.setStrokeWidth(this.strokeWidth);
}
var _1f=gr.drawPolyline(_1c,_1d);
return _1f;
};
StyleLayerDescriptor.prototype.hilitePolygon=function(gr,_21){
this.hiliteShape(gr,_21,"sld:PolygonSymbolizer");
};
StyleLayerDescriptor.prototype.paintPolygon=function(gr,_23){
var _24=new Array(_23.length+1);
var _25=new Array(_23.length+1);
for(var i=0;i<_23.length;i++){
point=_23[i];
_24[i]=parseInt(point[0]);
_25[i]=parseInt(point[1]);
}
_24[i]=_24[0];
_25[i]=_25[0];
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
var _27=gr.drawPolygon(_24,_25);
return _27;
};
StyleLayerDescriptor.prototype.getStyleAttributes=function(_28){
var _29=this.style.selectSingleNode(_28+"/sld:Stroke/sld:CssParameter[@name='stroke']");
if(_29!=undefined){
this.strokeColor=_29.firstChild.nodeValue;
}else{
this.strokeColor=null;
}
_29=this.style.selectSingleNode(_28+"/sld:Stroke/sld:CssParameter[@name='stroke-width']");
if(_29!=undefined){
this.strokeWidth=_29.firstChild.nodeValue;
}else{
this.strokeWidth=null;
}
_29=this.style.selectSingleNode(_28+"/sld:Fill/sld:CssParameter[@name='fill']");
if(_29!=undefined){
this.fillColor=_29.firstChild.nodeValue;
}else{
this.fillColor=null;
}
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
if(this.strokeStyle){
_14.setAttribute("stroke",this.strokeStyle);
}
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
if(this.strokeStyle){
_20.setAttribute("stroke",this.strokeStyle);
}
if(this.fillStyle){
_20.setAttribute("fill",this.fillStyle);
}
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/tool/TileExtent.js");
TiledWmsLayer=function(_1,_2,_3,_4,_5,_6){
MapLayer.apply(this,new Array(_1,_2,_3,_4,_5,_6));
this.d=new Date();
this.img=new Image();
this.img.objRef=_2;
this.mapPane=_2;
this.setSrc=function(_7){
this.src=_7;
};
this.paint=function(_8,_9){
this.tileExtent=new TileExtent(this.model.extent);
this.tileCount=this.tileExtent.getTileCount();
this.grid=this.getGridSrc(_8,this.tileExtent,this.tileCount);
this.loadImgDiv(_8,this.layerNode,this.grid,_9,this.tileExtent);
};
this.isWmsLayer=function(){
return true;
};
this.getGridSrc=function(_a,_b,_c){
var _d=_b.getTileSize();
var _e=_b.getTileMeters();
var _f=_b.getTileBbox();
if(!this.stylesheet){
this.stylesheet=new XslProcessor(baseDir+"/tool/xsl/wmsc_GetMap.xsl",_1.namespace);
}
this.stylesheet.setParameter("width",_d);
this.stylesheet.setParameter("height",_d);
this.stylesheet.setParameter("srs",this.model.getSRS());
var _10=new Array();
var _11=new Array();
var _12=new Array();
for(var i=0;i<_c[0];i++){
_10[i]=new Array();
_11[i]=new Array();
_12[i]=new Array();
for(var j=0;j<_c[1];j++){
_10[i][j]=new Array();
_11[i][j]=new Array();
_12[i][j]=new Array();
_10[i][j][0]=_f[0][0]+_e*i;
_10[i][j][1]=_f[0][1]-_e*(j+1);
_10[i][j][2]=_f[0][0]+_e*(i+1);
_10[i][j][3]=_f[0][1]-_e*j;
this.stylesheet.setParameter("bbox",_10[i][j].join(","));
_11[i][j]=this.stylesheet.transformNodeToObject(this.model.doc);
_12[i][j]=_11[i][j].selectNodes("//img");
}
}
return _12;
};
this.getLayerDivId=function(){
var _15=this.model.id+"_"+this.mapPane.id+"_"+this.layerName;
return _15;
if(this.model.timestampList&&this.model.timestampList.getAttribute("layerName")==_3){
var _16=this.model.getParam("timestamp");
var _17=this.model.timestampList.childNodes[_16];
layerId+="_"+_17.firstChild.nodeValue;
}
};
this.loadImgDiv=function(_18,_19,_1a,_1b,_1c){
var _1d=_1c.getOffset();
var _1e=_1c.getTileSize();
var _1f=_1c.extent.getFixedScale();
var _20=document.getElementById(_18.mapPane.outputNodeId);
_20.style.left="0px";
_20.style.top="0px";
var _21=(_19.getAttribute("hidden")==1)?true:false;
if(!_19.getAttribute("transparancy")){
var _22=100;
}else{
var _22=_19.getAttribute("transparancy");
}
var _23="image/gif";
var _24=_19.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");
if(_24){
_23=_24.firstChild.nodeValue;
}
var _25=this.getLayerDivId();
var _26=document.getElementById(_25);
if(_26){
_20.removeChild(_26);
}
imgDiv=document.createElement("div");
imgDiv.setAttribute("id",_25);
imgDiv.style.position="absolute";
imgDiv.style.display=(_21)?"none":"inline";
if(!_SARISSA_IS_IE){
var _27=_22/100;
imgDiv.style.opacity=_27;
}
imgDiv.style.top=_1d[1]+"px";
imgDiv.style.left=_1d[0]+"px";
imgDiv.imgId=_1f+"-"+this.layerName;
for(var i=0;i<_1a.length;i++){
for(var j=0;j<_1a[i].length;j++){
var _2a=document.createElement("img");
_2a.id="real"+imgDiv.imgId+"-"+i+"-"+j;
newSrc=_1a[i][j][_1b].getAttribute("src");
if(_SARISSA_IS_IE){
var _2b="alpha(opacity="+_22+")";
_2a.style.filter=_2b;
}
_2a.width=_1e;
_2a.height=_1e;
_2a.style.top=j*_1e+"px";
_2a.style.left=i*_1e+"px";
_2a.style.position="absolute";
_2a.layerHidden=_21;
_2a.style.visibility="hidden";
_2a.setAttribute("src",newSrc);
_2a.fixPng=false;
if(_SARISSA_IS_IE&&_23=="image/png"){
_2a.fixPng=true;
}
imgDiv.appendChild(_2a);
}
}
_20.appendChild(imgDiv);
var _2c=_20.childNodes;
var i=_2c.length-1;
for(var j=0;j<_2c[i].childNodes.length;++j){
var _2d=_2c[i].childNodes[j];
if(_2d.fixPng){
_2d.outerHTML=fixPNG(_2d,_2d.id);
}
if(!_2d.hidden){
fixImg=document.getElementById(_2d.id);
fixImg.style.visibility="visible";
}
}
};
};

var mac,win;
var opera,khtml,safari,mozilla,ie,ie50,ie55,ie60;
var canvasEnabled=false;
mapbuilder.loadScript(baseDir+"/tool/util/sarissa/Sarissa.js");
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
_8.setAttribute("strokecolor",x);
};
VMLGraphics.prototype.setShapeStrokeWidth=function(_a,x){
_a.setAttribute("strokeweight",x);
};
VMLGraphics.prototype.setShapeFillColor=function(_c,x){
_c.setAttribute("fillcolor",x);
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
_34.src=src;
};
VMLGraphics.prototype.paint=function(){
};

mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/StyledLayerDescriptor.js");
mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");
mapbuilder.loadScript(baseDir+"/widget/TipWidget.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function WfsQueryLayer(_1,_2,_3,_4,_5,_6){
MapLayer.apply(this,new Array(_1,_2,_3,_4,_5,_6));
this.id="WfsQueryLayer";
this.uuid=_4.getAttribute("id");
this.featureCount=0;
this.parse=function(){
var _7="xmlns:eo1='eo1.geobliki.com' xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:sld='http://www.opengis.net/sld' xmlns:xlink='http://www.w3.org/1999/xlink'";
var _8=this.layerNode.ownerDocument;
Sarissa.setXpathNamespaces(_8,_7);
var _9=this.layerNode.selectSingleNode("wmc:StyleList");
if(_9==null){
alert("cannot find style node");
}
var _a=_9.selectSingleNode("wmc:Style[wmc:Name='Highlite']");
var _b=_9.selectSingleNode("wmc:Style[wmc:Name='Normal']");
this.normalSld=new StyleLayerDescriptor(_b);
this.hiliteSld=new StyleLayerDescriptor(_a);
this.title=this.layerNode.selectSingleNode("wmc:Title").firstChild.nodeValue;
};
this.paintPoint=function(_c,_d){
if(_d){
_c.hilitePoint(this.gr,this.shape);
}else{
if(this.coords!=null){
var _e=new Proj(this.model.containerModel.getSRS());
var _f=this.coords.split(/[ ,\n]+/);
_f=_e.Forward(_f);
var _10=this.model.containerModel.extent.getPL(_f);
this.shape=_c.paintPoint(this.gr,_10);
if(this.shape!=null){
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
}
}
};
this.paintPolygon=function(sld,_12){
if(_12){
sld.hilitePolygon(this.gr,this.shape);
}else{
if(this.coords!=null){
var _13=new Proj(this.model.getSRS());
var _14=this.coords.split(/[ ,\n]+/);
var _15=new Array(_14.length/2);
var _16=new Array(2);
var _17;
var jj=0;
for(var i=0;i<_14.length;i++){
_16[0]=_14[i];
_16[1]=_14[i+1];
_17=_13.Forward(_16);
_17=this.model.extent.getPL(_17);
_15[jj]=_17;
jj++;
i++;
}
this.shape=sld.paintPolygon(this.gr,_15);
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
}
};
this.paintLine=function(sld,_1b){
if(_1b){
sld.hiliteLine(this.gr,this.shape);
}else{
var _1c=new Proj(this.model.getSRS());
var _1d=this.coords.split(/[ ,\n]+/);
var _1e=new Array(_1d.length/2);
var _1f=new Array(2);
var _20;
var jj=0;
for(var i=0;i<_1d.length;i++){
_1f[0]=_1d[i];
_1f[1]=_1d[i+1];
_20=_1c.Forward(_1f);
_20=this.model.extent.getPL(_20);
_1e[jj]=_20;
jj++;
i++;
}
this.shape=sld.paintLine(this.gr,_1e);
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
};
this.getDiv=function(_23){
var _24=document.getElementById(this.mapPane.outputNodeId).parentNode;
var div=document.getElementById("vector_elements");
if(div==null){
div=document.createElement("div");
div.setAttribute("id","vector_elements");
div.style.position="absolute";
div.style.visibility="visible";
div.style.zIndex=600;
_24.appendChild(div);
}
div.style.top=0;
div.style.left=0;
return div;
};
this.paint=function(){
this.paint(null,null);
};
this.paint=function(_26,img){
this.deletePreviousFeatures();
var _28=this.model.getFeatureNodes();
for(var i=0;i<_28.length;i++){
featureNode=_28[i];
type=this.model.getFeatureGeometry(featureNode);
if(type!=undefined){
this.gmlType=type.nodeName;
if(this.gmlType=="gml:Point"){
var pos=type.firstChild;
this.coords=pos.firstChild.nodeValue;
}else{
if(this.gmlType=="gml:LineString"){
var _2b=type.firstChild;
var _2c=_2b.childNodes;
var _2d=_2c.length;
this.coords="";
for(var j=0;j<_2d;j++){
this.coords+=_2c[j].nodeValue;
}
}else{
if(this.gmlType=="gml:Polygon"){
this.coords=null;
var ext=type.firstChild;
var _30=ext.firstChild;
if(_30.firstChild){
this.posList=_30.firstChild;
this.coords=this.posList.firstChild.nodeValue;
}
}else{
if(this.gmlType=="gml:Box"||this.gmlType=="gml:Envelope"){
var _2b=type.firstChild;
var _2c=_2b.childNodes;
var _2d=_2c.length;
this.coords="";
var c=new Array();
c=_2c[0].nodeValue.split(" ");
this.coords+=c[0]+" "+c[1]+",\n"+c[2]+" "+c[1]+",\n"+c[2]+" "+c[3]+",\n"+c[0]+" "+c[3]+",\n"+c[0]+" "+c[1];
}else{
alert("Unsupported GML Geometry:"+this.gmlType);
}
}
}
}
}
this.id="wfs_"+this.uuid+"_"+i;
this.paintShape(this.normalSld,false);
}
this.featureCount=_28.length;
};
this.deleteShape=function(){
var id=this.id+"_vector";
var _33=document.getElementById(id);
while(_33!=null){
var _34=_33.parentNode;
_34.removeChild(_33);
_33=document.getElementById(id);
}
};
this.deletePreviousFeatures=function(){
for(var i=0;i<this.featureCount;i++){
this.id="wfs_"+this.uuid+"_"+i;
this.deleteShape();
}
};
this.unpaint=function(){
var _36=this.model.getFeatureNodes();
for(var i=0;i<_36.length;i++){
this.id="wfs_"+this.uuid+"_"+i;
this.deleteShape();
}
};
this.paintShape=function(sld,_39){
if(this.gmlType=="gml:Point"){
this.paintPoint(sld,_39);
}else{
if(this.gmlType=="gml:LineString"){
this.paintLine(sld,_39);
}else{
if(this.gmlType=="gml:Polygon"||this.gmlType=="gml:Envelope"||this.gmlType=="gml:Box"){
this.paintPolygon(sld,_39);
}
}
}
};
this.install=function(_3a){
_3a.onmouseover=this.mouseOverHandler;
_3a.onmouseout=this.mouseOutHandler;
_3a.onclick=this.mouseClickHandler;
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
var _3e=this.getAttribute("id").split("_");
var id=_3e[2];
config.objects.gml2FeatureTemplate.setParam("clickFeature",id);
return true;
};
this.clickIt=function(_40,_41){
var _42="";
var _43=_40.model.getFeatureNodes();
var _44=_43[_41];
for(var i=0;i<_44.childNodes.length;i++){
var elt=_44.childNodes[i];
var _47=elt.nodeName.split(":")[1];
var _48=elt.firstChild.nodeValue;
if(_48==null){
_48=elt.firstChild.firstChild.nodeValue;
if(_48==null){
_48=elt.firstChild.firstChild.firstChild.nodeValue;
}
}
_42+="<b>"+_47+":</b>"+_48+"<br/>";
}
var _49=0;
var _4a=0;
var cn=window.cursorTrackNode;
if(cn){
var _4c=cn.evpl;
if(_4c!=null){
_49=_4c[0];
_4a=_4c[1];
}
}
toolTipObjs[_40.tooltip].paint(new Array(_49,_4a,_41,_40.title,_42));
};
this.highlight=function(_4d,_4e){
if(_4e.indexOf(_4d.id)>=0){
_4d.paintShape(_4d.hiliteSld,true);
var _4f=0;
var _50=0;
var cn=window.cursorTrackNode;
if(cn){
var _52=cn.evpl;
if(_52!=null){
_4f=_52[0];
_50=_52[1];
var _53=_4d.myabstract;
if(_53==undefined){
_53="Feature under construction.  Stay tuned!";
}
}
}
if(_4f>0&&_4f<_4d.width&&_50>0&&_50<_4d.height){
toolTipObjs[_4d.tooltip].paint(new Array(_4f,_50,_4e,_4d.title,_53));
}
}
};
this.dehighlight=function(_54,_55){
if(_55.indexOf(_54.id)>=0){
_54.paintShape(_54.normalSld,true);
toolTipObjs[_54.tooltip].clear();
}
};
this.parse();
this.width=null;
this.height=null;
var div=this.getDiv();
this.gr=new VectorGraphics(this.id,div,this.width,this.height);
config.objects.gml2FeatureTemplate.addListener("clickFeature",this.clickIt,this);
this.tooltip=config.objects.gml2FeatureTemplate.tipWidgetId;
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

function Context(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:wmc='http://www.opengis.net/context' xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'";
this.setHidden=function(_3,_4){
var _5="0";
if(_4){
_5="1";
}
var _6=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_3+"']");
if(_6){
_6.setAttribute("hidden",_5);
}
this.callListeners("hidden",_3);
};
this.getHidden=function(_7){
var _8=1;
var _9=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_7+"']");
if(_9){
_8=_9.getAttribute("hidden");
}
return _8;
};
this.getBoundingBox=function(){
var _a=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
bbox=new Array();
bbox[0]=parseFloat(_a.getAttribute("minx"));
bbox[1]=parseFloat(_a.getAttribute("miny"));
bbox[2]=parseFloat(_a.getAttribute("maxx"));
bbox[3]=parseFloat(_a.getAttribute("maxy"));
return bbox;
};
this.setBoundingBox=function(_b){
var _c=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
_c.setAttribute("minx",_b[0]);
_c.setAttribute("miny",_b[1]);
_c.setAttribute("maxx",_b[2]);
_c.setAttribute("maxy",_b[3]);
this.callListeners("bbox",_b);
};
this.initBbox=function(_d){
if(window.cgiArgs["bbox"]){
var _e=window.cgiArgs["bbox"].split(",");
var ul=new Array(parseFloat(_e[0]),parseFloat(_e[3]));
var lr=new Array(parseFloat(_e[2]),parseFloat(_e[1]));
_d.extent.zoomToBox(ul,lr);
}
};
this.addListener("loadModel",this.initBbox,this);
this.initAoi=function(_11){
if(window.cgiArgs["aoi"]){
var aoi=window.cgiArgs["aoi"].split(",");
_11.setParam("aoi",new Array(new Array(aoi[0],aoi[3]),new Array(aoi[2],aoi[1])));
}
};
this.addListener("loadModel",this.initAoi,this);
this.setSRS=function(srs){
var _14=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
_14.setAttribute("SRS",srs);
this.callListeners("srs");
};
this.getSRS=function(){
var _15=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
srs=_15.getAttribute("SRS");
return srs;
};
this.getWindowWidth=function(){
var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
return win.getAttribute("width");
};
this.setWindowWidth=function(_17){
var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
win.setAttribute("width",_17);
this.callListeners("resize");
};
this.getWindowHeight=function(){
var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
return win.getAttribute("height");
};
this.setWindowHeight=function(_1a){
var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
win.setAttribute("height",_1a);
this.callListeners("resize");
};
this.getFeatureNode=function(_1c){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[wmc:Name='"+_1c+"']");
};
this.getServerUrl=function(_1d,_1e,_1f){
return _1f.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
};
this.getVersion=function(_20){
return _20.selectSingleNode("wmc:Server").getAttribute("version");
};
this.getMethod=function(_21){
return _21.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
};
this.getQueryableLayers=function(){
var _22=this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer[attribute::queryable='1']/wmc:Name");
return _22;
};
this.getAllLayers=function(){
var _23=this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer");
return _23;
};
this.getLayer=function(_24){
var _25=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_24+"']");
return _25;
};
this.addLayer=function(_26,_27){
var _28=_26.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList");
_28.appendChild(_27.cloneNode(true));
_26.modified=true;
};
this.addFirstListener("addLayer",this.addLayer,this);
this.deleteLayer=function(_29,_2a){
var _2b=_29.getLayer(_2a);
if(!_2b){
alert("node note found; unable to delete node:"+_2a);
return;
}
_2b.parentNode.removeChild(_2b);
_29.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_2c,_2d){
var _2e=_2c.getLayer(_2d);
var _2f=_2e.selectSingleNode("following-sibling::*");
if(!_2f){
alert("can't move node past beginning of list:"+_2d);
return;
}
_2e.parentNode.insertBefore(_2f,_2e);
_2c.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_30,_31){
var _32=_30.getLayer(_31);
var _33=_32.selectNodes("preceding-sibling::*");
var _34=_33[_33.length-1];
if(!_34){
alert("can't move node past beginning of list:"+_31);
return;
}
_32.parentNode.insertBefore(_32,_34);
_30.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.setExtension=function(_35){
var _36=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
if(!_36){
var _37=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General");
var _38=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_36=_37.appendChild(_38);
}
return _36.appendChild(_35);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
};
this.initTimeExtent=function(_39){
var _3a=_39.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_3a.length;++i){
var _3c=_3a[i];
_39.timestampList=createElementWithNS(_39.doc,"TimestampList",mbNsUrl);
var _3d=_3c.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
_39.timestampList.setAttribute("layerName",_3d);
var _3e=_3c.firstChild.nodeValue.split(",");
for(var j=0;j<_3e.length;++j){
var _40=_3e[j].split("/");
if(_40.length==3){
var _41=setISODate(_40[0]);
var _42=setISODate(_40[1]);
var _43=_40[2];
var _44=_43.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_44.length;++i){
if(!_44[i]){
_44[i]=0;
}
}
do{
var _45=createElementWithNS(_39.doc,"Timestamp",mbNsUrl);
_45.appendChild(_39.doc.createTextNode(getISODate(_41)));
_39.timestampList.appendChild(_45);
_41.setFullYear(_41.getFullYear()+parseInt(_44[2],10));
_41.setMonth(_41.getMonth()+parseInt(_44[4],10));
_41.setDate(_41.getDate()+parseInt(_44[6],10));
_41.setHours(_41.getHours()+parseInt(_44[8],10));
_41.setMinutes(_41.getMinutes()+parseInt(_44[10],10));
_41.setSeconds(_41.getSeconds()+parseFloat(_44[12]));
}while(_41.getTime()<=_42.getTime());
}else{
var _45=createElementWithNS(_39.doc,"Timestamp",mbNsUrl);
_45.appendChild(_39.doc.createTextNode(_3e[j]));
_39.timestampList.appendChild(_45);
}
}
_39.setExtension(_39.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.getCurrentTimestamp=function(_46){
var _47=this.getParam("timestamp");
return this.timestampList.childNodes[_47].firstChild.nodeValue;
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

mapbuilder.loadScript(baseDir+"/graphics/WfsQueryLayer.js");
function FeatureCollection(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:featureTagName");
if(_3){
this.featureTagName=_3.firstChild.nodeValue;
}else{
this.featureTagName="topp:CITY_NAME";
}
var _4=_1.selectSingleNode("mb:coordsTagName");
if(_4){
this.coordsTagName=_4.firstChild.nodeValue;
}else{
this.coordsTagName="//gml:coordinates";
}
var _5=_1.selectSingleNode("mb:nodeSelectXpath");
if(_5){
this.nodeSelectXpath=_5.firstChild.nodeValue;
}
var _6=_1.selectSingleNode("mb:coordSelectXpath");
if(_6){
this.coordSelectXpath=_6.firstChild.nodeValue;
}else{
this.coordSelectXpath="topp:the_geom/gml:MultiPoint/gml:pointMember/gml:Point/gml:coordinates";
}
this.convertCoords=function(_7){
if(_7.doc&&_7.containerModel&&_7.containerModel.doc){
var _8=_7.doc.selectNodes(_7.coordsTagName);
if(_8.length>0&&_7.containerModel){
var _9=_8[0].selectSingleNode("ancestor-or-self::*/@srsName");
if(_9&&(_9.nodeValue.toUpperCase()!=_7.containerModel.getSRS().toUpperCase())){
var _a=new Proj(_9.nodeValue);
_7.setParam("modelStatus","converting coordinates");
var _b=new Proj(_7.containerModel.getSRS());
for(var i=0;i<_8.length;++i){
var _d=_8[i].firstChild.nodeValue;
var _e=_d.split(" ");
var _f="";
for(var j=0;j<_e.length;++j){
var xy=_e[j].split(",");
if(xy.length==2){
var _12=_a.Inverse(xy);
xy=_b.Forward(_12);
_f+=xy.join(",")+" ";
}
}
_8[i].firstChild.nodeValue=_f;
}
}
}
}
};
this.loadWfsRequests=function(_13){
if(_13.containerModel.doc!=null){
var _14=_13.containerModel.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType");
if(_14.length>0){
for(var i=0;i<_14.length;i++){
var _16=new Object();
var _17=_14[i];
var _18=_17.selectSingleNode("wmc:Server");
var _19=_18.selectSingleNode("wmc:OnlineResource");
_16.method=_19.getAttribute("method");
_16.url=_19.getAttribute("xlink:href");
var _1a=_17.selectSingleNode("wfs:GetFeature");
_16.postData=Sarissa.serialize(_1a);
_17.model=_13;
_13.wfsFeature=_17;
_13.newRequest(_13,_16);
}
}
}
};
this.addFirstListener("loadModel",this.convertCoords,this);
if(this.containerModel){
this.containerModel.addListener("loadModel",this.loadWfsRequests,this);
}
this.setHidden=function(_1b,_1c){
this.hidden=_1c;
this.callListeners("hidden",_1b);
};
this.getHidden=function(_1d){
return this.hidden;
};
this.hidden=false;
this.getFeatureNodes=function(){
var _1e=this.doc.selectSingleNode(this.nodeSelectXpath);
if(_1e!=null){
return _1e.childNodes;
}else{
return null;
}
};
this.getFeatureName=function(_1f){
var _20=_1f.selectSingleNode(this.featureTagName);
return _20?_20.firstChild.nodeValue:"No RSS title";
};
this.getFeatureId=function(_21){
return _21.getAttribute("fid")?_21.getAttribute("fid"):"no_id";
};
this.getFeaturePoint=function(_22){
var _23=_22.selectSingleNode(this.coordSelectXpath);
var _23=_22.selectSingleNode(_6);
if(_23){
var _24=_23.firstChild.nodeValue.split(",");
return _24;
}else{
return new Array(0,0);
}
};
this.getFeatureGeometry=function(_25){
var _26=_25.selectSingleNode(this.coordsTagName);
if(_26!=null){
return _26.firstChild;
}else{
alert("invalid geom for:"+Sarissa.serialize(_25));
}
};
}

function FeatureTypeSchema(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
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

function GetMap(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
this.prePaint=function(_3){
_3.stylesheet.setParameter("width",_3.containerModel.getWindowWidth());
_3.stylesheet.setParameter("height",_3.containerModel.getWindowHeight());
bBox=_3.containerModel.getBoundingBox();
var _4=bBox[0]+","+bBox[1]+","+bBox[2]+","+bBox[3];
_3.stylesheet.setParameter("bbox",_4);
_3.stylesheet.setParameter("srs",_3.containerModel.getSRS());
_3.stylesheet.setParameter("version",_3.model.getVersion(_3.featureNode));
_3.stylesheet.setParameter("baseUrl",_3.model.getServerUrl("GetMap"));
_3.stylesheet.setParameter("mbId",_3.featureNode.getAttribute("id"));
_3.resultDoc=_3.featureNode;
};
this.loadLayer=function(_5,_6){
_5.featureNode=_6;
_5.paint(_5);
};
this.addListener("GetMap",this.loadLayer,this);
}

function Logger(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'";
this.doc=Sarissa.getDomDocument("http://mapbuilder.sourceforge.net/mapbuilder","mb:Logger");
Sarissa.setXpathNamespaces(this.doc,this.namespace);
this.doc.async=false;
this.doc.validateOnParse=false;
this.logEvent=function(_3,_4,_5,_6){
var _7=this.doc.createElement("event");
_7.setAttribute("time",new Date().getTime());
_7.setAttribute("listener",_4);
_7.setAttribute("target",_5);
if(_6){
_7.setAttribute("param",_6);
}
_7.appendChild(this.doc.createTextNode(_3));
this.doc.documentElement.appendChild(_7);
};
this.clearLog=function(){
while(this.doc.documentElement.hasChildNodes()){
this.doc.documentElement.removeChild(this.doc.documentElement.firstChild);
}
this.callListeners("refresh");
};
this.saveLog=function(){
if(config.serializeUrl){
var _8=postLoad(config.serializeUrl,logger.doc);
_8.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_8,"xmlns:xlink='http://www.w3.org/1999/xlink'");
var _9=_8.selectSingleNode("//OnlineResource");
var _a=_9.attributes.getNamedItem("xlink:href").nodeValue;
alert("event log saved as:"+_a);
}else{
alert("unable to save event log; provide a serializeUrl property in config");
}
};
this.refreshLog=function(_b){
_b.callListeners("refresh");
};
if(_2){
_2.addListener("refresh",this.refreshLog,this);
}
window.onunload=this.saveLog;
window.logger=this;
}

function Model(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/model/FeatureCollection.js");
function OwsCatResources(_1,_2){
FeatureCollection.apply(this,new Array(_1,_2));
this.namespace="xmlns:owscat='http://www.ec.gc.ca/owscat' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
}
OwsCatResources.prototype.getFeatureNode=function(_3){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[owscat:name='"+_3+"']");
};

function OwsContext(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
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
this.setTransparancy=function(_a,_b){
var _c=this.getFeatureNode(_a);
_c.setAttribute("transparancy",_b);
this.callListeners("transparancy",_a);
};
this.getTransparancy=function(_d){
var _e="100";
var _f=this.getFeatureNode(_d);
return _f.getAttribute("transparancy");
};
this.getBoundingBox=function(){
var _10=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
var _11=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
var _12=new String(_10.firstChild.nodeValue+" "+_11.firstChild.nodeValue).split(" ");
var _13=new Array();
for(i=0;i<_12.length;++i){
_13[i]=parseFloat(_12[i]);
}
return _13;
};
this.setBoundingBox=function(_14){
var _15=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
_15.firstChild.nodeValue=_14[0]+" "+_14[1];
var _16=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
_16.firstChild.nodeValue=_14[2]+" "+_14[3];
this.callListeners("bbox",_14);
};
this.initBbox=function(_17){
if(window.cgiArgs["bbox"]){
var _18=window.cgiArgs["bbox"].split(",");
_17.setBoundingBox(_18);
}
};
this.addListener("loadModel",this.initBbox,this);
this.initAoi=function(_19){
if(window.cgiArgs["aoi"]){
var aoi=window.cgiArgs["aoi"].split(",");
_19.setParam("aoi",new Array(new Array(aoi[0],aoi[3]),new Array(aoi[2],aoi[1])));
}
};
this.addListener("loadModel",this.initAoi,this);
this.setSRS=function(srs){
var _1c=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
_1c.setAttribute("crs",srs);
this.callListeners("srs");
};
this.getSRS=function(){
if(this.doc){
var _1d=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
srs=_1d.getAttribute("crs");
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
this.setWindowWidth=function(_1f){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
win.setAttribute("width",_1f);
this.callListeners("resize");
};
this.getWindowHeight=function(){
if(this.doc){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
height=win.getAttribute("height");
return height;
}
};
this.setWindowHeight=function(_22){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
win.setAttribute("height",_22);
this.callListeners("resize");
};
this.getServerUrl=function(_24,_25,_26){
return _26.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
};
this.getVersion=function(_27){
return _27.selectSingleNode("wmc:Server").getAttribute("version");
};
this.getMethod=function(_28){
return _28.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
};
this.getFeatureNode=function(_29){
if(this.doc){
var _2a=this.doc.selectSingleNode("//wmc:ResourceList/*[wmc:Name='"+_29+"']");
if(_2a==null){
alert("feature not found");
}
return _2a;
}
};
this.loadFeatures=function(_2b){
var _2c=_2b.nodeSelectXpath+"/wmc:FeatureType[wmc:Server/@service='OGC:WFS']/wmc:Name";
var _2d=_2b.doc.selectNodes(_2c);
for(var i=0;i<_2d.length;i++){
var _2f=_2d[i].firstChild.nodeValue;
_2b.setParam("wfs_GetFeature",_2f);
}
};
this.addListener("loadModel",this.loadFeatures,this);
this.setRequestParameters=function(_30,_31){
var _32=this.getFeatureNode(_30);
if(_32.selectSingleNode("ogc:Filter")){
_31.setParameter("filter",escape(Sarissa.serialize(_32.selectSingleNode("ogc:Filter"))));
}
};
this.getQueryableLayers=function(){
var _33=this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[attribute::queryable='1']/wmc:Name");
return _33;
};
this.getAllLayers=function(){
var _34=this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer");
return _34;
};
this.getLayer=function(_35){
var _36=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_35+"']");
if(_36==null){
_36=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:RssLayer[@id='"+_35+"']");
}
return _36;
};
this.getZoomLevels=function(_37){
var _38=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_37+"']/wms-c:ZoomLevels");
if(_38){
var _39=_38.firstChild.nodeValue.split(",");
return _39;
}
return null;
};
this.addLayer=function(_3a,_3b){
if(_3a.doc!=null){
var _3c=_3a.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList");
var id=_3b.getAttribute("id");
var str="/wmc:OWSContext/wmc:ResourceList/"+_3b.nodeName+"[@id='"+id+"']";
var _3f=_3a.doc.selectSingleNode(str);
if(_3f!=null){
_3c.removeChild(_3f);
}
_3c.appendChild(_3b.cloneNode(true));
_3a.modified=true;
}else{
alert("null OWSContext doc");
}
};
this.addFirstListener("addLayer",this.addLayer,this);
this.deleteLayer=function(_40,_41){
var _42=_40.getLayer(_41);
if(!_42){
alert("node note found; unable to delete node:"+_41);
return;
}
_42.parentNode.removeChild(_42);
_40.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_43,_44){
var _45=_43.getLayer(_44);
var _46=_45.selectSingleNode("following-sibling::*");
if(!_46){
alert("can't move node past beginning of list:"+_44);
return;
}
_45.parentNode.insertBefore(_46,_45);
_43.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_47,_48){
var _49=_47.getLayer(_48);
var _4a=_49.selectNodes("preceding-sibling::*");
var _4b=_4a[_4a.length-1];
if(!_4b){
alert("can't move node past beginning of list:"+_48);
return;
}
_49.parentNode.insertBefore(_49,_4b);
_47.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.setExtension=function(_4c){
var _4d=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
if(!_4d){
var _4e=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General");
var _4f=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_4d=_4e.appendChild(_4f);
}
return _4d.appendChild(_4c);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
};
this.initTimeExtent=function(_50){
var _51=_50.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_51.length;++i){
var _53=_51[i];
_50.timestampList=createElementWithNS(_50.doc,"TimestampList",mbNsUrl);
var _54=_53.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
_50.timestampList.setAttribute("layerName",_54);
var _55=_53.firstChild.nodeValue.split(",");
for(var j=0;j<_55.length;++j){
var _57=_55[j].split("/");
if(_57.length==3){
var _58=setISODate(_57[0]);
var _59=setISODate(_57[1]);
var _5a=_57[2];
var _5b=_5a.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_5b.length;++i){
if(!_5b[i]){
_5b[i]=0;
}
}
do{
var _5c=createElementWithNS(_50.doc,"Timestamp",mbNsUrl);
_5c.appendChild(_50.doc.createTextNode(getISODate(_58)));
_50.timestampList.appendChild(_5c);
_58.setFullYear(_58.getFullYear()+parseInt(_5b[2],10));
_58.setMonth(_58.getMonth()+parseInt(_5b[4],10));
_58.setDate(_58.getDate()+parseInt(_5b[6],10));
_58.setHours(_58.getHours()+parseInt(_5b[8],10));
_58.setMinutes(_58.getMinutes()+parseInt(_5b[10],10));
_58.setSeconds(_58.getSeconds()+parseFloat(_5b[12]));
}while(_58.getTime()<=_59.getTime());
}else{
var _5c=createElementWithNS(_50.doc,"Timestamp",mbNsUrl);
_5c.appendChild(_50.doc.createTextNode(_55[j]));
_50.timestampList.appendChild(_5c);
}
}
_50.setExtension(_50.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.getCurrentTimestamp=function(_5d){
var _5e=this.getParam("timestamp");
return this.timestampList.childNodes[_5e].firstChild.nodeValue;
};
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

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Transaction(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
}

function WfsCapabilities(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:wfs='http://www.opengis.net/wfs'";
this.getServerUrl=function(_3,_4,_5){
var _6="/wfs:WFS_Capabilities/wfs:Capability/wfs:Request/"+_3;
if(_4.toLowerCase()=="post"){
_6+="/wfs:DCPType/wfs:HTTP/wfs:Post";
}else{
_6+="/wfs:DCPType/wfs:HTTP/wfs:Get";
}
return this.doc.selectSingleNode(_6).getAttribute("onlineResource");
};
this.getVersion=function(){
var _7="/wfs:WFS_Capabilities";
return this.doc.selectSingleNode(_7).getAttribute("version");
};
this.getMethod=function(){
return this.method;
};
this.getFeatureNode=function(_8){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[wfs:Name='"+_8+"']");
};
}

function WmsCapabilities(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:wms='http://www.opengis.net/wms' xmlns:xlink='http://www.w3.org/1999/xlink'";
this.getServerUrl=function(_3,_4,_5){
var _6=this.getVersion();
if(_6=="1.0.0"){
_3=_3.substring(3);
var _7="/WMT_MS_Capabilities/Capability/Request/"+_3;
if(_4.toLowerCase()=="post"){
_7+="/DCPType/HTTP/Post";
}else{
_7+="/DCPType/HTTP/Get";
}
return this.doc.selectSingleNode(_7).getAttribute("onlineResource");
}else{
var _7="/WMT_MS_Capabilities/Capability/Request/"+_3;
if(_4.toLowerCase()=="post"){
_7+="/DCPType/HTTP/Post/OnlineResource";
}else{
_7+="/DCPType/HTTP/Get/OnlineResource";
}
return this.doc.selectSingleNode(_7).getAttribute("href");
}
};
this.getVersion=function(){
var _8="/WMT_MS_Capabilities";
return this.doc.selectSingleNode(_8).getAttribute("version");
};
this.getServerTitle=function(){
var _9="/WMT_MS_Capabilities/Service/Title";
var _a=this.doc.selectSingleNode(_9);
return _a.firstChild.nodeValue;
};
this.getImageFormat=function(){
var _b=this.getVersion();
if(_b=="1.0.0"){
var _c="/WMT_MS_Capabilities/Capability/Request/Map/Format";
var _d=this.doc.selectSingleNode(_c);
if(_SARISSA_IS_IE){
return "image/"+_d.firstChild.baseName.toLowerCase();
}else{
return "image/"+_d.firstChild.localName.toLowerCase();
}
}else{
var _c="/WMT_MS_Capabilities/Capability/Request/GetMap/Format";
var _d=this.doc.selectSingleNode(_c);
if(_SARISSA_IS_IE){
return "image/gif";
}else{
return _d.firstChild.nodeValue;
}
}
};
this.getServiceName=function(){
var _e="/WMT_MS_Capabilities/Service/Name";
var _f=this.doc.selectSingleNode(_e);
return _f.firstChild.nodeValue;
};
this.getFeatureNode=function(_10){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[Name='"+_10+"']");
};
}

function WpsCapabilities(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:wps='http://www.opengis.net/wps' xmlns:ows='http://www.opengis.net/ows' xmlns:xlink='http://www.w3.org/1999/xlink'";
this.getServerUrl=function(_3,_4,_5){
var _6=_3.split(":");
var _7="/wps:Capabilities/ows:OperationsMetadata/ows:Operation[@name='"+_6[1]+"']";
if(_4.toLowerCase()=="post"){
_7+="/ows:DCP/ows:HTTP/ows:Post";
}else{
_7+="/ows:DCP/ows:HTTP/ows:Get";
}
var _8=this.doc.selectSingleNode(_7);
if(_8){
return _8.getAttribute("xlink:href");
}else{
return null;
}
};
this.getVersion=function(){
var _9="/wps:Capabilities";
return this.doc.selectSingleNode(_9).getAttribute("version");
};
this.getMethod=function(){
return this.method;
};
this.getFeatureNode=function(_a){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[wps:Name='"+_a+"']");
};
}

function WpsDescribeProcess(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:wps='http://www.opengis.net/wps' xmlns:ows='http://www.opengis.net/ows' xmlns:xlink='http://www.w3.org/1999/xlink'";
this.getServerUrl=function(_3,_4,_5){
return this.parentModel.getServerUrl(_3,_4,_5);
};
this.getVersion=function(){
var _6="/wps:ProcessDescription";
return this.doc.selectSingleNode(_6).getAttribute("version");
};
this.getMethod=function(){
return this.method;
};
this.getFeatureNode=function(_7){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[wps:Name='"+_7+"']");
};
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

function Caps2Context(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
var _3=baseDir+"/tool/xsl/Caps2Context.xsl";
this.stylesheet=new XslProcessor(_3,_2.namespace);
for(var j=0;j<_1.childNodes.length;j++){
if(_1.childNodes[j].firstChild&&_1.childNodes[j].firstChild.nodeValue){
this.stylesheet.setParameter(_1.childNodes[j].nodeName,_1.childNodes[j].firstChild.nodeValue);
}
}
this.mapAllLayers=function(_5){
_5.stylesheet.setParameter("selectedLayer","");
var _6=_5.stylesheet.transformNodeToObject(_5.model.doc);
_5.targetModel.setParam("newModel",null);
_5.targetModel.url="";
_5.targetModel.doc=_6;
_5.targetModel.finishLoading();
};
this.model.addListener("mapAllLayers",this.mapAllLayers,this);
this.mapSingleLayer=function(_7,_8){
_7.stylesheet.setParameter("selectedLayer",_8);
var _9=_7.stylesheet.transformNodeToObject(_7.model.doc);
_7.targetModel.setParam("newModel",null);
_7.targetModel.url="";
_7.targetModel.doc=_9;
_7.targetModel.finishLoading();
};
this.model.addListener("mapLayer",this.mapSingleLayer,this);
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

var Rearth=6378137;
var degToMeter=Rearth*2*Math.PI/360;
var mbScaleFactor=3571.428;
var minScale=1000;
var maxScale=200000;
function Extent(_1,_2){
this.model=_1;
this.id=_1.id+"_MbExtent"+mbIds.getId();
this.getBbox=function(){
var _3=this.model.getBoundingBox();
return _3;
};
this.setBbox=function(_4){
size=this.getSize();
res=Math.max((_4[2]-_4[0])/size[0],(_4[3]-_4[1])/size[1]);
scale=this.getFixedScale(res);
center=new Array((_4[1]-_4[3])/2,(_4[0]-_4[2])/2);
half=new Array(size[0]/2,size[1]/2);
_4=new Array(center[0]-half[0]*scale,center[1]-half[1]*scale,center[0]+half[0]*scale,center[1]+half[1]*scale);
this.model.setBoundingBox(_4);
};
this.getSize=function(){
size=new Array();
size[0]=this.model.getWindowWidth();
size[1]=this.model.getWindowHeight();
return size;
};
this.setSize=function(_5){
this.model.setWindowWidth(_5[0]);
this.model.setWindowHeight(_5[1]);
};
this.getFixedScale=function(_6){
if(this.zoomLevels){
if(!_6){
this.setResolution(new Array(this.model.getWindowWidth(),this.model.getWindowHeight()));
_6=Math.max(this.res[0],this.res[1]);
}
var _7=this.zoomLevels.sort(function sort(a,b){
return b-a;
});
var i=0;
while(_7[i]>=_6){
i++;
}
if(i==0){
i=1;
}
if(i==this.zoomLevels.length){
}
this.fixedScale=_7[i-1];
}else{
this.fixedScale=Math.max(this.res[0],this.res[1]);
}
return this.fixedScale;
};
this.setFixedScale=function(_b,_c){
if(_b){
this.zoomLevels=_c;
}else{
this.zoomLevels=null;
}
};
this.size=new Array();
this.res=new Array();
this.zoomBy=4;
this.checkBbox=function(){
var _d=this.getCenter();
var _e=new Array(this.size[0]/2,this.size[1]/2);
var _f=this.getFixedScale();
this.lr=new Array(_d[0]+_e[0]*_f,_d[1]-_e[1]*_f);
this.ul=new Array(_d[0]-_e[0]*_f,_d[1]+_e[1]*_f);
};
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
this.centerAt=function(_14,_15,_16){
var _17=new Array(this.size[0]/2,this.size[1]/2);
if(this.zoomLevels){
_15=this.getFixedScale(_15);
}
this.lr=new Array(_14[0]+_17[0]*_15,_14[1]-_17[1]*_15);
this.ul=new Array(_14[0]-_17[0]*_15,_14[1]+_17[1]*_15);
if(_16){
var _18=0;
if(this.lr[0]>ContextExtent.lr[0]){
_18=ContextExtent.lr[0]-this.lr[0];
}
if(this.ul[0]<ContextExtent.ul[0]){
_18=ContextExtent.ul[0]-this.ul[0];
}
this.lr[0]+=_18;
this.ul[0]+=_18;
var _19=0;
if(this.lr[1]<ContextExtent.lr[1]){
_19=ContextExtent.lr[1]-this.lr[1];
}
if(this.ul[1]>ContextExtent.ul[1]){
_19=ContextExtent.ul[1]-this.ul[1];
}
this.lr[1]+=_19;
this.ul[1]+=_19;
}
this.model.setBoundingBox(new Array(this.ul[0],this.lr[1],this.lr[0],this.ul[1]));
this.setSize(_15);
};
this.zoomToBox=function(ul,lr){
var _1c=new Array((ul[0]+lr[0])/2,(ul[1]+lr[1])/2);
newres=Math.max((lr[0]-ul[0])/this.size[0],(ul[1]-lr[1])/this.size[1]);
this.centerAt(_1c,newres);
};
this.setSize=function(res){
this.res[0]=this.res[1]=res;
this.size[0]=(this.lr[0]-this.ul[0])/this.res[0];
this.size[1]=(this.ul[1]-this.lr[1])/this.res[1];
this.width=Math.ceil(this.size[0]);
this.height=Math.ceil(this.size[1]);
};
this.setResolution=function(_1e){
this.size[0]=_1e[0];
this.size[1]=_1e[1];
this.res[0]=(this.lr[0]-this.ul[0])/this.size[0];
this.res[1]=(this.ul[1]-this.lr[1])/this.size[1];
this.width=Math.ceil(this.size[0]);
this.height=Math.ceil(this.size[1]);
};
this.getScale=function(){
var _1f=null;
switch(this.model.getSRS()){
case "EPSG:GMAPS":
break;
case "EPSG:4326":
case "EPSG:4269":
_1f=this.res[0]*degToMeter;
break;
default:
_1f=this.res[0];
break;
}
return mbScaleFactor*_1f;
};
this.setScale=function(_20){
var _21=null;
switch(this.model.getSRS()){
case "EPSG:4326":
case "EPSG:4269":
_21=_20/(mbScaleFactor*degToMeter);
break;
default:
_21=_20/mbScaleFactor;
break;
}
this.centerAt(this.getCenter(),_21);
};
this.init=function(_22,_23){
var _24=_22.model.getBoundingBox();
_22.ul=new Array(_24[0],_24[3]);
_22.lr=new Array(_24[2],_24[1]);
_22.setResolution(new Array(_22.model.getWindowWidth(),_22.model.getWindowHeight()));
_22.checkBbox();
};
if(_2){
this.init(this,_2);
}
this.firstInit=function(_25,_26){
_25.init(_25,_26);
};
}

function GoogleMapTools(){
this.zoomTo=function(_1,_2,_3){
gmap=_1.getParam("gmap");
p=new GLatLng(_2[1],_2[0]);
z=gmap.getZoom();
gmap.setCenter(p,z+_3);
this.useGoogleMapExtent(_1);
};
this.useGoogleMapExtent=function(_4){
gmap=_4.getParam("gmap");
bbox=gmap.getBounds();
swLng=bbox.getSouthWest().lng();
swLat=bbox.getSouthWest().lat();
neLng=bbox.getNorthEast().lng();
neLat=bbox.getNorthEast().lat();
if(swLng>neLng){
swLng-=360;
}
if(swLat>neLat){
swLat-=180;
}
_4.setBoundingBox(new Array(swLng,swLat,neLng,neLat));
};
this.centerAndZoom=function(_5){
this.centerAndZoomToBox(_5,_5.getBoundingBox());
};
this.setGmapExtent=function(_6,_7){
this.centerAndZoomToBox(_6,_7);
this.useGoogleMapExtent(_6);
};
this.centerAndZoomToBox=function(_8,_9){
pxWidth=_8.getWindowWidth();
pxHeight=_8.getWindowHeight();
degWidth=Math.abs(_9[2]-_9[0]);
degHeight=Math.abs(_9[3]-_9[1]);
zoomLevel=this.getZoomLevel(pxWidth,degWidth);
gmap=_8.getParam("gmap");
gmap.setCenter(new GLatLng((_9[3]+_9[1])/2,(_9[2]+_9[0])/2),zoomLevel);
};
this.getZoomLevel=function(_a,_b){
zoomLevel=Math.floor(Math.log(1.46025*_a/_b)/Math.log(2));
return zoomLevel;
};
this.getPixelsFromLatLong=function(_c){
gmap=config.objects.gmap;
var _d=gmap.getBounds().getSouthWest().lng();
var _e=gmap.getBounds().getNorthEast().lat();
var _f=gmap.getCurrentMapType().getProjection().fromLatLngToPixel(new GLatLng(_e,_d),gmap.getZoom());
var _10=new GLatLng(_c[1],_c[0]);
var _11=gmap.getCurrentMapType().getProjection().fromLatLngToPixel(_10,gmap.getZoom());
var x=_11.x-_f.x;
var y=_11.y-_f.y;
return new Array(x,y);
};
this.getLatLongFromPixels=function(_14){
gmap=config.objects.gmap;
var x=_14[0];
var y=_14[1];
neLat=gmap.getBounds().getNorthEast().lat();
neLng=gmap.getBounds().getSouthWest().lng();
var _17=gmap.getCurrentMapType().getProjection().fromPixelToLatLng(new GPoint(0,0),gmap.getZoom());
var _18=new GPoint(x,y);
var _19=gmap.getCurrentMapType().getProjection().fromPixelToLatLng(_18,gmap.getZoom(),false);
var lat=_19.lat()-_17.lat()-neLat;
var lng=_19.lng()-_17.lng()-neLng;
return new Array(lng,lat);
};
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

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function MouseClickHandler(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.clickHandler=function(_3,_4){
_3.model.setParam("clickPoint",_4.evpl);
};
_2.addListener("mouseup",this.clickHandler,this);
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function MovieLoop(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.frameIncrement=1;
this.model.setParam("firstFrame",0);
this.timestampIndex=0;
window.movieLoop=this;
var _3=_1.selectSingleNode("mb:framesPerSecond");
if(_3){
this.delay=1000/_3.firstChild.nodeValue;
}else{
this.delay=1000/10;
}
this.maxFrames=30;
var _4=_1.selectSingleNode("mb:maxFrames");
if(_4){
this.maxFrames=_4.firstChild.nodeValue;
}
this.setFrame=function(_5){
var _6=this.model.timestampList;
if(this.timestampIndex!=null){
var _7=_6.childNodes[this.timestampIndex];
_7.setAttribute("current","0");
this.model.setParam("timestamp",this.timestampIndex);
}
var _8=this.model.getParam("firstFrame");
var _9=this.model.getParam("lastFrame");
if(_5>_9){
_5=_8;
}
if(_5<_8){
_5=_9;
}
this.timestampIndex=_5;
_7=_6.childNodes[this.timestampIndex];
_7.setAttribute("current","1");
this.model.setParam("timestamp",this.timestampIndex);
};
this.nextFrame=function(_a){
var _b=window.movieLoop;
var _c=_b.frameIncrement;
if(_a){
_c=_a;
}
_b.setFrame(_b.timestampIndex+_c);
};
this.setFrameLimits=function(_d){
var _e=_d.model.timestampList;
var _f=_d.model.getParam("firstFrame");
var _10=_f+_d.maxFrames;
if(_10>_e.childNodes.length){
_10=_e.childNodes.length-1;
}
_d.model.setParam("lastFrame",_10);
_e.childNodes[_f].setAttribute("current","1");
};
this.model.addFirstListener("refresh",this.setFrameLimits,this);
this.model.addListener("firstFrame",this.setFrameLimits,this);
this.reset=function(_11){
_11.pause();
_11.setFrame(_11.model.getParam("firstFrame"));
};
this.model.addListener("loadModel",this.reset,this);
this.model.addListener("bbox",this.reset,this);
this.play=function(){
this.movieTimer=setInterval("window.movieLoop.nextFrame()",this.delay);
};
this.pause=function(){
clearInterval(this.movieTimer);
};
this.stop=function(){
this.pause();
this.reset(this);
};
this.stopListener=function(_12){
_12.stop();
};
this.model.addListener("stopLoop",this.stopListener,this);
}

mapbuilder.loadScript(baseDir+"/tool/Extent.js");
function TileExtent(_1){
this.extent=_1;
this.tileSize=400;
this.tileScale=this.extent.getFixedScale();
this.tileMeters=this.tileSize*this.tileScale;
this.tileCount=new Array();
this.offset=new Array();
this.tileBbox=new Array();
this.calculated=false;
this.getTileCount=function(){
var ul=this.extent.ul;
var lr=this.extent.lr;
var _4=this.tileSize;
var _5=this.extent.getFixedScale();
var _6=this.tileCount;
this.setTileMeters(_4,_5);
var _7=this.tileMeters;
this.setTileBbox(ul,lr,_7);
var _8=this.tileBbox;
_6[0]=(_8[1][0]-_8[0][0])/_7;
_6[1]=(_8[0][1]-_8[1][1])/_7;
this.tileCount=_6;
this.calculated=true;
return _6;
};
this.setTileMeters=function(_9,_a){
var _a=this.extent.getFixedScale();
var _9=this.tileSize;
this.tileMeters=_a*_9;
};
this.setTileBbox=function(ul,lr,_d){
var _e=new Array();
var _f=new Array();
var _10=this.tileBbox;
var _11=this.offset;
_e[0]=Math.floor(ul[0]/_d)*_d;
_e[1]=Math.ceil(ul[1]/_d)*_d;
_f[0]=Math.ceil(lr[0]/_d)*_d;
_f[1]=Math.floor(lr[1]/_d)*_d;
_10[0]=_e;
_10[1]=_f;
_11[0]=Math.round((_e[0]-ul[0])/this.tileScale);
_11[1]=Math.round((ul[1]-_e[1])/this.tileScale);
this.offset=_11;
this.tileBbox=_10;
};
this.getTileMeters=function(){
if(this.calculated){
return this.tileMeters;
}else{
alert("TileMeters is not calculated");
}
};
this.getTileBbox=function(){
if(this.calculated){
return this.tileBbox;
}else{
alert("TileBbox is not calculated");
}
};
this.getOffset=function(){
if(this.calculated){
return this.offset;
}else{
alert("Offset is not calculated");
}
};
this.getTileSize=function(){
if(this.tileSize){
return this.tileSize;
}else{
alert("TileSize is not set");
}
};
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function Timer(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:every");
if(_3){
this.delay=1000*_3.firstChild.nodeValue;
}else{
this.delay=1000*30;
}
var _4=_1.selectSingleNode("mb:eventName");
if(_4){
this.eventName=_4.firstChild.nodeValue;
}else{
this.eventName="reloadModel";
}
var _5=_1.selectSingleNode("mb:eventValue");
if(_5){
this.eventValue=_5.firstChild.nodeValue;
}else{
this.eventValue=null;
}
this.play=function(){
clearInterval(this.interval);
var _6="config.objects."+this.targetModel.id+".setParam('"+this.eventName+"'";
if(this.eventValue){
_6+=","+this.eventValue;
}
_6+=")";
this.interval=setInterval(_6,this.delay);
};
this.stop=function(){
clearInterval(this.interval);
};
this.autoStart=true;
var _7=_1.selectSingleNode("mb:autoStart");
if(_7&&_7.firstChild.nodeValue=="false"){
this.autoStart=false;
}
this.startOnLoad=function(_8){
if(_8.autoStart){
_8.play();
}
};
this.model.addListener("init",this.startOnLoad,this);
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
_7.mouseHandler=window.config.objects[_8.firstChild.nodeValue];
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

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function WebServiceRequest(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:requestName");
if(_3){
this.requestName=_3.firstChild.nodeValue;
}
var _4=_1.selectSingleNode("mb:requestFilter");
if(_4){
this.requestFilter=_4.firstChild.nodeValue;
}
var _5=baseDir+"/tool/xsl/"+this.requestName.replace(/:/,"_")+".xsl";
this.requestStylesheet=new XslProcessor(_5);
for(var j=0;j<_1.childNodes.length;j++){
if(_1.childNodes[j].firstChild&&_1.childNodes[j].firstChild.nodeValue){
this.requestStylesheet.setParameter(_1.childNodes[j].nodeName,_1.childNodes[j].firstChild.nodeValue);
}
}
this.model.addListener("init",this.init,this);
this.model.addListener(this.requestName.replace(/:/,"_"),this.doRequest,this);
}
WebServiceRequest.prototype.createHttpPayload=function(_7){
if(this.debug){
alert("source:"+Sarissa.serialize(_7));
}
var _8=new Object();
_8.method=this.targetModel.method;
this.requestStylesheet.setParameter("httpMethod",_8.method);
this.requestStylesheet.setParameter("version",this.model.getVersion(_7));
if(this.requestFilter){
var _9=config.objects[this.requestFilter];
this.requestStylesheet.setParameter("filter",escape(Sarissa.serialize(_9.doc).replace(/[\n\f\r\t]/g,"")));
if(this.debug){
alert(Sarissa.serialize(_9.doc));
}
}
_8.postData=this.requestStylesheet.transformNodeToObject(_7);
if(this.debug){
alert("request data:"+Sarissa.serialize(_8.postData));
if(config.serializeUrl){
var _a=postLoad(config.serializeUrl,_8.postData);
}
}
_8.url=this.model.getServerUrl(this.requestName,_8.method,_7);
if(_8.method.toLowerCase()=="get"){
_8.postData.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_8.postData,"xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder'");
var _b=_8.postData.selectSingleNode("//mb:QueryString");
if(_8.url.indexOf("?")<0){
_8.url+="?";
}else{
_8.url+="&";
}
_8.url+=_b.firstChild.nodeValue;
_8.postData=null;
}
if(this.debug){
alert("URL:"+_8.url);
}
return _8;
};
WebServiceRequest.prototype.doRequest=function(_c,_d){
_c.targetModel.featureName=_d;
var _e=_c.model.getFeatureNode(_d);
if(!_e){
alert("WebServiceRequest: error finding feature node:"+_d);
return;
}
if(_c.model.setRequestParameters){
_c.model.setRequestParameters(_d,_c.requestStylesheet);
}
var _f=_c.createHttpPayload(_e);
_c.targetModel.newRequest(_c.targetModel,_f);
};
WebServiceRequest.prototype.setAoiParameters=function(_10){
if(_10.containerModel){
var _11=null;
var _12="EPSG:4326";
var _13=_10.containerModel.getBoundingBox();
var _12=_10.containerModel.getSRS();
_10.requestStylesheet.setParameter("bBoxMinX",_13[0]);
_10.requestStylesheet.setParameter("bBoxMinY",_13[1]);
_10.requestStylesheet.setParameter("bBoxMaxX",_13[2]);
_10.requestStylesheet.setParameter("bBoxMaxY",_13[3]);
_10.requestStylesheet.setParameter("srs",_12);
_10.requestStylesheet.setParameter("width",_10.containerModel.getWindowWidth());
_10.requestStylesheet.setParameter("height",_10.containerModel.getWindowHeight());
}
};
WebServiceRequest.prototype.init=function(_14){
if(_14.targetModel.containerModel){
_14.containerModel=_14.targetModel.containerModel;
}else{
if(_14.model.containerModel){
_14.containerModel=_14.model.containerModel;
}
}
if(_14.containerModel){
_14.containerModel.addListener("aoi",_14.setAoiParameters,_14);
_14.containerModel.addListener("bbox",_14.setAoiParameters,_14);
_14.containerModel.addListener("mouseup",_14.setClickPosition,_14);
_14.containerModel.addListener("selectedLayer",_14.selectFeature,_14);
}
};
WebServiceRequest.prototype.setClickPosition=function(_15,_16){
_15.requestStylesheet.setParameter("xCoord",_16.evpl[0]);
_15.requestStylesheet.setParameter("yCoord",_16.evpl[1]);
};
WebServiceRequest.prototype.selectFeature=function(_17,_18){
_17.requestStylesheet.setParameter("queryLayer",_18);
};

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function ZoomToAoi(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.initProj=function(_3){
if(_3.model.doc&&_3.targetModel.doc){
if(_3.model.getSRS()!=_3.targetModel.getSRS()){
_3.model.proj=new Proj(_3.model.getSRS());
_3.targetModel.proj=new Proj(_3.targetModel.getSRS());
}
}
};
this.setListeners=function(_4){
_4.model.addListener("loadModel",_4.initProj,_4);
_4.targetModel.addListener("loadModel",_4.initProj,_4);
_4.initProj(_4);
};
this.model.addListener("loadModel",this.setListeners,this);
this.showTargetAoi=function(_5){
if(_5.targetModel.doc){
var _6=_5.targetModel.getBoundingBox();
var ul=new Array(_6[0],_6[3]);
var lr=new Array(_6[2],_6[1]);
if(_5.model.getSRS()!=_5.targetModel.getSRS()){
ul=_5.targetModel.proj.Inverse(ul);
lr=_5.targetModel.proj.Inverse(lr);
if(ul[0]>lr[0]){
ul[0]=ul[0]-360;
}
ul=_5.model.proj.Forward(ul);
lr=_5.model.proj.Forward(lr);
}
_5.model.setParam("aoi",new Array(ul,lr));
}
};
this.firstInit=function(_9){
_9.targetModel.addListener("loadModel",_9.showTargetAoi,_9);
_9.targetModel.addListener("bbox",_9.showTargetAoi,_9);
_9.showTargetAoi(_9);
};
this.model.addListener("loadModel",this.firstInit,this);
this.mouseUpHandler=function(_a,_b){
var _c=_a.model.getParam("aoi");
var ul=_c[0];
var lr=_c[1];
if(_a.model.getSRS()!=_a.targetModel.getSRS()){
ul=_a.targetModel.proj.Forward(ul);
lr=_a.targetModel.proj.Forward(lr);
}
if((ul[0]==lr[0])&&(ul[1]==lr[1])){
_a.targetModel.extent.centerAt(ul,_a.targetModel.extent.res[0]);
}else{
_a.targetModel.extent.zoomToBox(ul,lr);
}
};
this.model.addListener("mouseup",this.mouseUpHandler,this);
}

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

Sarissa.updateContentFromURI=function(_1,_2,_3){
try{
_2.style.cursor="wait";
var _4=new XMLHttpRequest();
_4.open("GET",_1);
function sarissa_dhtml_loadHandler(){
if(_4.readyState==4){
_2.style.cursor="auto";
Sarissa.updateContentFromNode(_4.responseXML,_2,_3);
}
}
_4.onreadystatechange=sarissa_dhtml_loadHandler;
_4.send(null);
_2.style.cursor="auto";
}
catch(e){
_2.style.cursor="auto";
throw e;
}
};
Sarissa.updateContentFromNode=function(_5,_6,_7){
try{
_6.style.cursor="wait";
Sarissa.clearChildNodes(_6);
var _8=_5.nodeType==Node.DOCUMENT_NODE?_5:_5.ownerDocument;
if(_8.parseError&&_8.parseError!=0){
var _9=document.createElement("pre");
_9.appendChild(document.createTextNode(Sarissa.getParseErrorText(_8)));
_6.appendChild(_9);
}else{
if(_7){
_5=_7.transformToDocument(_5);
}
if(_6.tagName.toLowerCase=="textarea"||_6.tagName.toLowerCase=="input"){
_6.value=Sarissa.serialize(_5);
}else{
if(_5.nodeType==Node.DOCUMENT_NODE||_5.ownerDocument.documentElement==_5){
_6.innerHTML=Sarissa.serialize(_5);
}else{
_6.appendChild(_6.ownerDocument.importNode(_5,true));
}
}
}
}
catch(e){
throw e;
}
finally{
_6.style.cursor="auto";
}
};

if(!Sarissa.IS_ENABLED_TRANSFORM_NODE&&window.XSLTProcessor){
Element.prototype.transformNodeToObject=function(_1,_2){
var _3=document.implementation.createDocument("","",null);
Sarissa.copyChildNodes(this,_3);
_3.transformNodeToObject(_1,_2);
};
Document.prototype.transformNodeToObject=function(_4,_5){
var _6=null;
try{
_6=new XSLTProcessor();
if(_6.reset){
_6.importStylesheet(_4);
var _7=_6.transformToFragment(this,_5);
Sarissa.copyChildNodes(_7,_5);
}else{
_6.transformDocument(this,_4,_5,null);
}
}
catch(e){
if(_4&&_5){
throw "Failed to transform document. (original exception: "+e+")";
}else{
if(!_4){
throw "No Stylesheet Document was provided. (original exception: "+e+")";
}else{
if(!_5){
throw "No Result Document was provided. (original exception: "+e+")";
}else{
if(_6==null){
throw "Could not instantiate an XSLTProcessor object. (original exception: "+e+")";
}else{
throw e;
}
}
}
}
}
};
Element.prototype.transformNode=function(_8){
var _9=document.implementation.createDocument("","",null);
Sarissa.copyChildNodes(this,_9);
return _9.transformNode(_8);
};
Document.prototype.transformNode=function(_a){
var _b=document.implementation.createDocument("","",null);
this.transformNodeToObject(_a,_b);
var _c=null;
try{
var _d=new XMLSerializer();
_c=_d.serializeToString(_b);
}
catch(e){
throw "Failed to serialize result document. (original exception: "+e+")";
}
return _c;
};
Sarissa.IS_ENABLED_TRANSFORM_NODE=true;
}
Sarissa.setXslParameter=function(_e,_f,_10){
try{
var _11=_e.getElementsByTagName(_SARISSA_IEPREFIX4XSLPARAM+"param");
var _12=_11.length;
var _13=false;
var _14;
if(_10){
for(var i=0;i<_12&&!_13;i++){
if(_11[i].getAttribute("name")==_f){
_14=_11[i];
while(_14.firstChild){
_14.removeChild(_14.firstChild);
}
if(!_10||_10==null){
}else{
if(typeof _10=="string"){
_14.setAttribute("select",_10);
_13=true;
}else{
if(_10.nodeName){
_14.removeAttribute("select");
_14.appendChild(_10.cloneNode(true));
_13=true;
}else{
if(_10.item(0)&&_10.item(0).nodeType){
for(var j=0;j<_10.length;j++){
if(_10.item(j).nodeType){
_14.appendChild(_10.item(j).cloneNode(true));
}
}
_13=true;
}else{
throw "Failed to set xsl:param "+_f+" (original exception: "+e+")";
}
}
}
}
}
}
}
return _13;
}
catch(e){
throw e;
return false;
}
};

function ScaleBar(_1){
this.scaleDenominator=(_1==null)?1:_1;
this.displaySystem="metric";
this.minWidth=100;
this.maxWidth=200;
this.divisions=2;
this.subdivisions=2;
this.showMinorMeasures=false;
this.abbreviateLabel=false;
this.singleLine=false;
this.resolution=72;
this.align="center";
this.container=document.createElement("div");
this.container.className="sbWrapper";
this.labelContainer=document.createElement("div");
this.labelContainer.className="sbUnitsContainer";
this.labelContainer.style.position="absolute";
this.graphicsContainer=document.createElement("div");
this.graphicsContainer.style.position="absolute";
this.graphicsContainer.className="sbGraphicsContainer";
this.numbersContainer=document.createElement("div");
this.numbersContainer.style.position="absolute";
this.numbersContainer.className="sbNumbersContainer";
var _2=document.createElement("div");
_2.className="sbMarkerMajor";
this.graphicsContainer.appendChild(_2);
var _3=document.createElement("div");
_3.className="sbMarkerMinor";
this.graphicsContainer.appendChild(_3);
var _4=document.createElement("div");
_4.className="sbBar";
this.graphicsContainer.appendChild(_4);
var _5=document.createElement("div");
_5.className="sbBarAlt";
this.graphicsContainer.appendChild(_5);
}
ScaleBar.prototype.update=function(_6){
if(_6!=null){
this.scaleDenominator=_6;
}
function HandsomeNumber(_7,_8,_9){
var _9=(_9==null)?10:_9;
var _a=Number.POSITIVE_INFINITY;
var _b=Number.POSITIVE_INFINITY;
var _c=_7;
var _d=3;
for(var _e=0;_e<3;++_e){
var _f=Math.pow(2,(-1*_e));
var _10=Math.floor(Math.log(_8/_f)/Math.LN10);
for(var _11=_10;_11>(_10-_9+1);--_11){
var _12=Math.max(_e-_11,0);
var _13=_f*Math.pow(10,_11);
if((_13*Math.floor(_8/_13))>=_7){
if(_7%_13==0){
var _14=_7/_13;
}else{
var _14=Math.floor(_7/_13)+1;
}
var _15=_14+(2*_e);
var _16=(_11<0)?(Math.abs(_11)+1):_11;
if((_15<_a)||((_15==_a)&&(_16<_b))){
_a=_15;
_b=_16;
_c=(_13*_14).toFixed(_12);
_d=_12;
}
}
}
}
this.value=_c;
this.score=_a;
this.tieBreaker=_b;
this.numDec=_d;
}
HandsomeNumber.prototype.toString=function(){
return this.value.toString();
};
HandsomeNumber.prototype.valueOf=function(){
return this.value;
};
function styleValue(_17,_18){
var _19=0;
if(document.styleSheets){
for(var _1a=document.styleSheets.length-1;_1a>=0;--_1a){
var _1b=document.styleSheets[_1a];
if(!_1b.disabled){
var _1c;
if(typeof (_1b.cssRules)=="undefined"){
if(typeof (_1b.rules)=="undefined"){
return 0;
}else{
_1c=_1b.rules;
}
}else{
_1c=_1b.cssRules;
}
for(var _1d=0;_1d<_1c.length;++_1d){
var _1e=_1c[_1d];
if(_1e.selectorText&&(_1e.selectorText.toLowerCase()==_17.toLowerCase())){
if(_1e.style[_18]!=""){
_19=parseInt(_1e.style[_18]);
}
}
}
}
}
}
return _19?_19:0;
}
function formatNumber(_1f,_20){
_20=(_20)?_20:0;
var _21=""+Math.round(_1f);
var _22=/(-?[0-9]+)([0-9]{3})/;
while(_22.test(_21)){
_21=_21.replace(_22,"$1,$2");
}
if(_20>0){
var _23=Math.floor(Math.pow(10,_20)*(_1f-Math.round(_1f)));
if(_23==0){
return _21;
}else{
return _21+"."+_23;
}
}else{
return _21;
}
}
this.container.title="scale 1:"+formatNumber(this.scaleDenominator);
var _24=new Object();
_24.english={units:["miles","feet","inches"],abbr:["mi","ft","in"],inches:[63360,12,1]};
_24.metric={units:["kilometers","meters","centimeters"],abbr:["km","m","cm"],inches:[39370.07874,39.370079,0.393701]};
var _25=new Array();
for(var _26=0;_26<_24[this.displaySystem].units.length;++_26){
_25[_26]=new Object();
var _27=this.resolution*_24[this.displaySystem].inches[_26]/this.scaleDenominator;
var _28=(this.minWidth/_27)/(this.divisions*this.subdivisions);
var _29=(this.maxWidth/_27)/(this.divisions*this.subdivisions);
for(var _2a=0;_2a<(this.divisions*this.subdivisions);++_2a){
var _2b=_28*(_2a+1);
var _2c=_29*(_2a+1);
var _2d=new HandsomeNumber(_2b,_2c);
_25[_26][_2a]={value:(_2d.value/(_2a+1)),score:0,tieBreaker:0,numDec:0,displayed:0};
for(var _2e=0;_2e<(this.divisions*this.subdivisions);++_2e){
displayedValuePosition=_2d.value*(_2e+1)/(_2a+1);
niceNumber2=new HandsomeNumber(displayedValuePosition,displayedValuePosition);
var _2f=((_2e+1)%this.subdivisions==0);
var _30=((_2e+1)==(this.divisions*this.subdivisions));
if((this.singleLine&&_30)||(!this.singleLine&&(_2f||this.showMinorMeasures))){
_25[_26][_2a].score+=niceNumber2.score;
_25[_26][_2a].tieBreaker+=niceNumber2.tieBreaker;
_25[_26][_2a].numDec=Math.max(_25[_26][_2a].numDec,niceNumber2.numDec);
_25[_26][_2a].displayed+=1;
}else{
_25[_26][_2a].score+=niceNumber2.score/this.subdivisions;
_25[_26][_2a].tieBreaker+=niceNumber2.tieBreaker/this.subdivisions;
}
}
var _31=(_26+1)*_25[_26][_2a].tieBreaker/_25[_26][_2a].displayed;
_25[_26][_2a].score*=_31;
}
}
var _32=null;
var _33=null;
var _34=null;
var _35=null;
var _36=Number.POSITIVE_INFINITY;
var _37=Number.POSITIVE_INFINITY;
var _38=0;
for(var _26=0;_26<_25.length;++_26){
for(_2a in _25[_26]){
if((_25[_26][_2a].score<_36)||((_25[_26][_2a].score==_36)&&(_25[_26][_2a].tieBreaker<_37))){
_36=_25[_26][_2a].score;
_37=_25[_26][_2a].tieBreaker;
_32=_25[_26][_2a].value;
_38=_25[_26][_2a].numDec;
_33=_24[this.displaySystem].units[_26];
_34=_24[this.displaySystem].abbr[_26];
_27=this.resolution*_24[this.displaySystem].inches[_26]/this.scaleDenominator;
_35=_27*_32;
}
}
}
var _39=(styleValue(".sbMarkerMajor","borderLeftWidth")+styleValue(".sbMarkerMajor","width")+styleValue(".sbMarkerMajor","borderRightWidth"))/2;
var _3a=(styleValue(".sbMarkerMinor","borderLeftWidth")+styleValue(".sbMarkerMinor","width")+styleValue(".sbMarkerMinor","borderRightWidth"))/2;
var _3b=(styleValue(".sbBar","borderLeftWidth")+styleValue(".sbBar","border-right-width"))/2;
var _3c=(styleValue(".sbBarAlt","borderLeftWidth")+styleValue(".sbBarAlt","borderRightWidth"))/2;
if(!document.styleSheets){
_39=0.5;
_3a=0.5;
}
while(this.labelContainer.hasChildNodes()){
this.labelContainer.removeChild(this.labelContainer.firstChild);
}
while(this.graphicsContainer.hasChildNodes()){
this.graphicsContainer.removeChild(this.graphicsContainer.firstChild);
}
while(this.numbersContainer.hasChildNodes()){
this.numbersContainer.removeChild(this.numbersContainer.firstChild);
}
var _3d,aBarPiece,numbersBox,xOffset;
var _3e={left:0,center:(-1*this.divisions*this.subdivisions*_35/2),right:(-1*this.divisions*this.subdivisions*_35)};
var _3f=0+_3e[this.align];
var _40=0;
for(var _41=0;_41<this.divisions;++_41){
_3f=_41*this.subdivisions*_35;
_3f+=_3e[this.align];
_40=(_41==0)?0:((_41*this.subdivisions)*_32).toFixed(_38);
_3d=document.createElement("div");
_3d.className="sbMarkerMajor";
_3d.style.position="absolute";
_3d.style.overflow="hidden";
_3d.style.left=Math.round(_3f-_39)+"px";
_3d.appendChild(document.createTextNode(" "));
this.graphicsContainer.appendChild(_3d);
if(!this.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
if(this.showMinorMeasures){
numbersBox.style.width=Math.round(_35*2)+"px";
numbersBox.style.left=Math.round(_3f-_35)+"px";
}else{
numbersBox.style.width=Math.round(this.subdivisions*_35*2)+"px";
numbersBox.style.left=Math.round(_3f-(this.subdivisions*_35))+"px";
}
numbersBox.appendChild(document.createTextNode(_40));
this.numbersContainer.appendChild(numbersBox);
}
for(var _42=0;_42<this.subdivisions;++_42){
aBarPiece=document.createElement("div");
aBarPiece.style.position="absolute";
aBarPiece.style.overflow="hidden";
aBarPiece.style.width=Math.round(_35)+"px";
if((_42%2)==0){
aBarPiece.className="sbBar";
aBarPiece.style.left=Math.round(_3f-_3b)+"px";
}else{
aBarPiece.className="sbBarAlt";
aBarPiece.style.left=Math.round(_3f-_3c)+"px";
}
aBarPiece.appendChild(document.createTextNode(" "));
this.graphicsContainer.appendChild(aBarPiece);
if(_42<(this.subdivisions-1)){
_3f=((_41*this.subdivisions)+(_42+1))*_35;
_3f+=_3e[this.align];
_40=(_41*this.subdivisions+_42+1)*_32;
_3d=document.createElement("div");
_3d.className="sbMarkerMinor";
_3d.style.position="absolute";
_3d.style.overflow="hidden";
_3d.style.left=Math.round(_3f-_3a)+"px";
_3d.appendChild(document.createTextNode(" "));
this.graphicsContainer.appendChild(_3d);
if(this.showMinorMeasures&&!this.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
numbersBox.style.width=Math.round(_35*2)+"px";
numbersBox.style.left=Math.round(_3f-_35)+"px";
numbersBox.appendChild(document.createTextNode(_40));
this.numbersContainer.appendChild(numbersBox);
}
}
}
}
_3f=(this.divisions*this.subdivisions)*_35;
_3f+=_3e[this.align];
_40=((this.divisions*this.subdivisions)*_32).toFixed(_38);
_3d=document.createElement("div");
_3d.className="sbMarkerMajor";
_3d.style.position="absolute";
_3d.style.overflow="hidden";
_3d.style.left=Math.round(_3f-_39)+"px";
_3d.appendChild(document.createTextNode(" "));
this.graphicsContainer.appendChild(_3d);
if(!this.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
if(this.showMinorMeasures){
numbersBox.style.width=Math.round(_35*2)+"px";
numbersBox.style.left=Math.round(_3f-_35)+"px";
}else{
numbersBox.style.width=Math.round(this.subdivisions*_35*2)+"px";
numbersBox.style.left=Math.round(_3f-(this.subdivisions*_35))+"px";
}
numbersBox.appendChild(document.createTextNode(_40));
this.numbersContainer.appendChild(numbersBox);
}
var _43=document.createElement("div");
_43.style.position="absolute";
var _44;
if(this.singleLine){
_44=_40;
_43.className="sbLabelBoxSingleLine";
_43.style.top="-0.6em";
_43.style.left=(_3f+10)+"px";
}else{
_44="";
_43.className="sbLabelBox";
_43.style.textAlign="center";
_43.style.width=Math.round(this.divisions*this.subdivisions*_35)+"px";
_43.style.left=Math.round(_3e[this.align])+"px";
_43.style.overflow="hidden";
}
if(this.abbreviateLabel){
_44+=" "+_34;
}else{
_44+=" "+_33;
}
_43.appendChild(document.createTextNode(_44));
this.labelContainer.appendChild(_43);
if(!document.styleSheets){
var _45=document.createElement("style");
_45.type="text/css";
var _46=".sbBar {top: 0px; background: #666666; height: 1px; border: 0;}";
_46+=".sbBarAlt {top: 0px; background: #666666; height: 1px; border: 0;}";
_46+=".sbMarkerMajor {height: 7px; width: 1px; background: #666666; border: 0;}";
_46+=".sbMarkerMinor {height: 5px; width: 1px; background: #666666; border: 0;}";
_46+=".sbLabelBox {top: -16px;}";
_46+=".sbNumbersBox {top: 7px;}";
_45.appendChild(document.createTextNode(_46));
document.getElementsByTagName("head").item(0).appendChild(_45);
}
this.container.appendChild(this.graphicsContainer);
this.container.appendChild(this.labelContainer);
this.container.appendChild(this.numbersContainer);
};
ScaleBar.prototype.place=function(_47){
if(_47==null){
document.body.appendChild(this.container);
}else{
var _48=document.getElementById(_47);
if(_48!=null){
_48.appendChild(this.container);
}
}
this.update();
};

mapbuilder.loadScript(baseDir+"/widget/GmlRenderer.js");
function AoiBox2(_1,_2){
var _3=new GmlRenderer(_1,_2);
for(sProperty in _3){
this[sProperty]=_3[sProperty];
}
this.stylesheet=new XslProcessor(baseDir+"/widget/GmlRenderer.xsl");
this.prePaint=function(_4){
_4.stylesheet.setParameter("width",_4.targetModel.getWindowWidth());
_4.stylesheet.setParameter("height",_4.targetModel.getWindowHeight());
bBox=_4.targetModel.getBoundingBox();
_4.stylesheet.setParameter("bBoxMinX",bBox[0]);
_4.stylesheet.setParameter("bBoxMinY",bBox[1]);
_4.stylesheet.setParameter("bBoxMaxX",bBox[2]);
_4.stylesheet.setParameter("bBoxMaxY",bBox[3]);
_4.stylesheet.setParameter("color","#FF0000");
_4.stylesheet.setParameter("crossSize","15");
_4.stylesheet.setParameter("lineWidth","1");
aoiBox=_4.model.getParam("aoi");
gml="<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"no\"?>";
if(aoiBox){
ul=_4.model.extent.getPL(aoiBox[0]);
lr=_4.model.extent.getPL(aoiBox[1]);
gml=gml+"<Aoi version=\"1.0.0\" xmlns:gml=\"http://www.opengis.net/gml\">";
gml=gml+"<gml:Envelope>";
gml=gml+"<gml:coord>";
gml=gml+"<gml:X>"+aoiBox[0][0]+"</gml:X>";
gml=gml+"<gml:Y>"+aoiBox[0][1]+"</gml:Y>";
gml=gml+"</gml:coord>";
gml=gml+"<gml:coord>";
gml=gml+"<gml:X>"+aoiBox[1][0]+"</gml:X>";
gml=gml+"<gml:Y>"+aoiBox[1][1]+"</gml:Y>";
gml=gml+"</gml:coord>";
gml=gml+"</gml:Envelope>";
gml=gml+"</Aoi>";
}else{
gml=gml+"<null/>";
}
_4.resultDoc=Sarissa.getDomDocument();
_4.resultDoc.loadXML(gml);
};
this.aoiListener=function(_5){
_5.paint(_5);
};
_2.addListener("aoi",this.aoiListener,this);
}

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

mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/util/wz_jsgraphics/wz_jsgraphics.js");
function AoiBoxWZ(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.lineWidth=_1.selectSingleNode("mb:lineWidth").firstChild.nodeValue;
this.lineColor=_1.selectSingleNode("mb:lineColor").firstChild.nodeValue;
this.crossSize=_1.selectSingleNode("mb:crossSize").firstChild.nodeValue;
this.paint=function(_3){
var _4=document.getElementById(_3.outputNodeId);
if(!_4){
_4=document.createElement("DIV");
_4.setAttribute("id",_3.outputNodeId);
_4.style.position="relative";
_3.node.appendChild(_4);
}
_4.style.left=0+"px";
_4.style.top=0+"px";
if(!_3.jg){
_3.jg=new jsGraphics(_3.outputNodeId);
_3.jg.setColor(_3.lineColor);
_3.jg.setStroke(parseInt(_3.lineWidth));
}
var _5=_3.model.getParam("aoi");
if(_5){
var ul=_3.model.extent.getPL(_5[0]);
var lr=_3.model.extent.getPL(_5[1]);
var _8=lr[0]-ul[0];
var _9=lr[1]-ul[1];
_3.jg.clear();
if((_8<_3.crossSize)&&(_9<_3.crossSize)){
var x=(lr[0]+ul[0])/2;
var y=(lr[1]+ul[1])/2;
var c=_3.crossSize/2;
_3.jg.drawLine(x+c,y,x-c,y);
_3.jg.drawLine(x,y+c,x,y-c);
}else{
_3.jg.drawRect(ul[0],ul[1],_8,_9);
}
_3.jg.paint();
}
};
this.model.addListener("aoi",this.paint,this);
MapContainerBase.apply(this,new Array(_1,_2));
this.clearAoiBox=function(_d){
if(_d.jg){
_d.jg.clear();
}
};
this.model.addListener("bbox",this.clearAoiBox,this);
this.refresh=function(_e){
_e.clearAoiBox(_e);
_e.jg=null;
};
this.model.addListener("newModel",this.refresh,this);
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
function Button(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function OWSCatSearchForm(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.postPaint=function(_3){
_3.searchForm=document.getElementById(_3.formName);
_3.searchForm.parentWidget=_3;
_3.searchForm.westCoord.onblur=_3.setAoi;
_3.searchForm.northCoord.onblur=_3.setAoi;
_3.searchForm.eastCoord.onblur=_3.setAoi;
_3.searchForm.southCoord.onblur=_3.setAoi;
_3.searchForm.westCoord.model=_3.model;
_3.searchForm.northCoord.model=_3.model;
_3.searchForm.eastCoord.model=_3.model;
_3.searchForm.southCoord.model=_3.model;
_3.searchForm.onkeypress=_3.handleKeyPress;
_3.searchForm.onsubmit=_3.submitForm;
};
this.displayAoiCoords=function(_4){
_4.searchForm=document.getElementById(_4.formName);
var _5=_4.model.getParam("aoi");
_4.searchForm.westCoord.value=_5[0][0];
_4.searchForm.northCoord.value=_5[0][1];
_4.searchForm.eastCoord.value=_5[1][0];
_4.searchForm.southCoord.value=_5[1][1];
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
this.setLocation=function(_9){
var _a=new Array();
_a=_9.split(",");
var ul=new Array(parseFloat(_a[0]),parseFloat(_a[2]));
var lr=new Array(parseFloat(_a[1]),parseFloat(_a[3]));
this.model.setParam("aoi",new Array(ul,lr));
};
this.submitForm=function(){
thisWidget=this.parentWidget;
thisWidget.webServiceForm=document.getElementById(thisWidget.formName);
thisWidget.targetModel.setParam("wfs_GetFeature","service_resources");
return false;
};
this.handleKeyPress=function(_d){
var _e;
var _f;
if(_d){
_e=_d.which;
_f=_d.currentTarget;
}else{
_e=window.event.keyCode;
_f=window.event.srcElement.form;
}
if(_e==13){
_f.parentWidget.submitForm();
return false;
}
};
var _10=null;
this.openRucWindow=function(_11){
if(_10==null||_10.closed){
var _12;
var _13;
switch(_11){
case "placename":
baseURL="/rucs/placeName.html?language="+config.lang+"&formName="+this.formName;
_13="width=290,height=480,scrollbars=0,toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=0";
break;
case "postalCode":
baseURL="/rucs/postalCode.html?language="+config.lang+"&formName="+this.formName;
_13="width=280,height=180,scrollbars=0,toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=0";
break;
default:
alert("unkown RUC type");
break;
}
_10=open(baseURL,"RUCWindow",_13);
}
_10.focus();
return false;
};
function RUC_closeRUCWindow(){
if(_10!=null&&!_10.closed){
_10.close();
}
}
this.formName="WebServiceForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}
SetAoiCoords=function(_14){
config.objects.mainMap.setParam("aoi",_14);
};

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function ClickPass(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:ClickPassId");
if(_3!=null){
this.clickPassId=_3.firstChild.nodeValue;
}else{
alert("unspecified clickPassId");
}
var _4=_1.selectSingleNode("mb:icon");
if(_4!=null){
this.icon=_4.firstChild.nodeValue;
var _5=document.createElement("div");
_5.setAttribute("id","clickPass"+this.clickPassId);
_5.style.position="relative";
_5.style.visibility="hidden";
_5.style.height="20px";
_5.style.width="20px";
_5.style.top="120px";
_5.style.left="120px";
_5.style.zIndex=300;
_5.title="clickPass"+this.clickPassId;
var _6=document.createElement("img");
_6.src=this.icon;
this.iconDiv=_5;
_5.appendChild(_6);
var _7=document.getElementById("mainMapPane");
_7.appendChild(_5);
}else{
alert("unspecified icon");
}
var _8=_1.selectSingleNode("mb:topOffset");
if(_8!=null){
this.topOffset=parseInt(_8.firstChild.nodeValue);
}else{
alert("unspecified topOffset");
}
var _9=_1.selectSingleNode("mb:leftOffset");
if(_9!=null){
this.leftOffset=parseInt(_9.firstChild.nodeValue);
}else{
alert("unspecified topOffset");
}
this.doAction=function(_a,_b){
if(_a.enabled){
point=_a.mouseHandler.model.extent.getXY(_b.evpl);
var x=point[0];
var y=point[1];
_a.iconDiv.style.top=_b.evpl[1]+_a.topOffset+"px";
_a.iconDiv.style.left=_b.evpl[0]+_a.leftOffset+"px";
_a.iconDiv.style.visibility="visible";
alert("Action:"+_a.clickPassId+" "+x+" "+y);
if(document.all){
window.setTimeout("hideClickPass("+_a.clickPassId+" )",5000);
}else{
setTimeout("hideClickPass("+_a.clickPassId+" )",5000);
}
}
};
this.hideClickPass=function(){
var _e=document.getElementById("clickPass"+this.clickPassId);
if(_e!=null){
_e.style.visibility="hidden";
}else{
alert("div clickPass"+this.clickPassId+" not found");
}
};
this.setMouseListener=function(_f){
if(_f.mouseHandler){
_f.mouseHandler.model.addListener("mouseup",_f.doAction,_f);
}
};
this.model.addListener("loadModel",this.setMouseListener,this);
}
function hideClickPass(id){
var div=document.getElementById("clickPass"+id);
if(div!=null){
div.style.visibility="hidden";
}else{
alert("div clickPass"+id+" not found");
}
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function CollectionList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
_d.mouseHandler=window.config.objects[_e.firstChild.nodeValue];
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

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function DeleteFeature(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="default";
this.trm=_1.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
this.tm=_1.selectSingleNode("mb:targetModel").firstChild.nodeValue;
this.tc=_1.selectSingleNode("mb:targetContext").firstChild.nodeValue;
this.httpPayload=new Object();
this.httpPayload.url=_1.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
this.httpPayload.method="post";
this.deleteXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Delete.xsl");
this.doSelect=function(_3,_4){
if(_3){
if(!_4.transactionResponseModel){
_4.transactionResponseModel=window.config.objects[_4.trm];
_4.transactionResponseModel.addListener("loadModel",_4.handleResponse,_4);
}
if(!_4.targetModel){
_4.targetModel=window.config.objects[_4.tm];
}
if(!_4.targetContext){
_4.targetContext=window.config.objects[_4.tc];
}
fid=_4.targetModel.getXpathValue(_4.targetModel,"//@fid");
if(_4.targetModel.doc&&fid){
s=_4.deleteXsl.transformNodeToObject(_4.targetModel.doc);
_4.httpPayload.postData=s;
_4.transactionResponseModel.newRequest(_4.transactionResponseModel,_4.httpPayload);
}else{
alert("No feature available to delete");
}
}
};
this.handleResponse=function(_5){
sucess=_5.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
if(sucess){
httpPayload=new Object();
httpPayload.url=null;
_5.targetModel.newRequest(_5.targetModel,httpPayload);
_5.targetContext.callListeners("refreshWmsLayers");
}
};
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
function EditButtonBase(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
this.trm=_1.selectSingleNode("mb:transactionResponseModel");
if(this.trm){
this.trm=this.trm.firstChild.nodeValue;
}
this.defaultModelUrl=_1.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
this.featureXpath=_1.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
this.doSelect=function(_3,_4){
if(_4.trm&&!_4.transactionResponseModel){
_4.transactionResponseModel=window.config.objects[_4.trm];
}
if(_4.enabled&&_3&&_4.targetModel.url!=_4.defaultModelUrl){
_4.loadDefaultModel(_4);
}
if(!_3&&_4.transactionResponseModel){
_4.transactionResponseModel.setModel(_4.transactionResponseModel,null);
}
};
this.loadDefaultModel=function(_5){
_5.targetModel.url=_5.defaultModelUrl;
var _6=new Object();
_6.url=_5.defaultModelUrl;
_6.method="get";
_6.postData=null;
_5.targetModel.newRequest(_5.targetModel,_6);
};
this.setMouseListener=function(_7){
if(_7.mouseHandler){
_7.mouseHandler.model.addListener("mouseup",_7.doAction,_7);
}
};
this.initButton=function(_8){
_8.targetModel.addListener("loadModel",_8.setMouseListener,_8);
};
this.model.addListener("init",this.initButton,this);
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditLine(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.doAction=function(_3,_4){
if(_3.enabled){
point=_3.mouseHandler.model.extent.getXY(_4.evpl);
old=_3.targetModel.getXpathValue(_3.targetModel,_3.featureXpath);
if(!old){
old="";
}
sucess=_3.targetModel.setXpathValue(_3.targetModel,_3.featureXpath,old+" "+point[0]+","+point[1]);
if(!sucess){
alert("EditLine: invalid featureXpath in config: "+_3.featureXpath);
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditPoint(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.doAction=function(_3,_4){
if(_3.enabled){
point=_3.mouseHandler.model.extent.getXY(_4.evpl);
sucess=_3.targetModel.setXpathValue(_3.targetModel,_3.featureXpath,point[0]+","+point[1]);
if(!sucess){
alert("EditPoint: invalid featureXpath in config: "+_3.featureXpath);
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditPolygon(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.doAction=function(_3,_4){
if(_3.enabled){
var _5=_3.mouseHandler.model.extent.getXY(_4.evpl);
var _6=_3.targetModel.getXpathValue(_3.targetModel,_3.featureXpath);
var _7="";
if(!_6){
_7=_5[0]+","+_5[1];
}else{
var _8=_6.split(" ");
if(_8.length<2){
_7=_6+" "+_5[0]+","+_5[1];
}else{
if(_8.length==2){
_7=_6+" "+_5[0]+","+_5[1]+" "+_8[0];
}else{
if(_8.length>2){
for(var i=0;i<_8.length-1;++i){
_7=_7+_8[i]+" ";
}
_7=_7+_5[0]+","+_5[1]+" "+_8[0];
}
}
}
}
sucess=_3.targetModel.setXpathValue(_3.targetModel,_3.featureXpath,_7);
if(!sucess){
alert("EditPolygon: invalid featureXpath in config: "+_3.featureXpath);
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FeatureInfo(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5);
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function FeatureList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5);
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function FeatureList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5,_6){
_3.model.setXpathValue(_3.model,_4,_5,_6);
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function xxFilterAttributes(_1,_2){
var _3=new WidgetBase(this,_1,_2);
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
var id=_16.getAttribute("uuid");
_16.setAttribute("id",id);
_16.setAttribute("width",_f);
_16.setAttribute("height",_10);
var _13=_c.transformEntry(_c,_16);
_c.targetModel.setParam("addLayer",_13.childNodes[0]);
}
}
};
GeoRssParser.prototype.paint=function(_18){
};

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/widget/TipObject.js");
mapbuilder.loadScript(baseDir+"/graphics/FeatureFactory.js");
function GeoRssRenderer(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
this.model.addListener("refresh",this.paint,this);
var _3=_1.selectSingleNode("mb:tipWidget");
if(_3){
this.tipWidgetId=_3.firstChild.nodeValue;
}
var _4=_1.selectSingleNode("mb:popupStylesheet");
if(_4){
var _5=_4.firstChild.nodeValue;
this.popupStyleSheet=new XslProcessor(_5,_2.namespace);
}
this.featureFactory=new FeatureFactory(_1,_2,this.tipWidgetId);
this.highlight=function(_6,_7){
var _8=document.getElementById(_7+"_normal");
if(_8!=undefined){
_8.style.visibility="hidden";
var _9=document.getElementById(_7+"_highlight");
_9.style.visibility="visible";
}
};
this.model.addListener("highlightFeature",this.highlight,this);
this.dehighlight=function(_a,_b){
var _c=document.getElementById(_b+"_normal");
if(_c!=undefined){
_c.style.visibility="visible";
var _d=document.getElementById(_b+"_highlight");
_d.style.visibility="hidden";
}
};
this.model.addListener("dehighlightFeature",this.dehighlight,this);
this.transformEntry=function(_e,_f){
if(_e.popupStyleSheet!=undefined){
var _10=_e.popupStyleSheet.transformNodeToObject(_f);
var _11=Sarissa.serialize(_10.documentElement);
return _11;
}
};
}
GeoRssRenderer.prototype.paint=function(_12){
_12.featureFactory.clearFeatures(_12);
if(_12.model.doc&&_12.containerModel.doc&&_12.node){
var _13=new Proj(_12.containerModel.getSRS());
var _14=_12.model.getFeatureNodes();
var len=_14.length;
for(var _16=0;_16<len;_16++){
var _17=_14[_16];
var _18=_12.model.getFeatureName(_17);
var _19=_12.model.getFeatureId(_17);
var _1a=_12.model.getFeatureIcon(_17);
var _1b=_12.model.getFeatureGeometry(_17);
if(_1b!=undefined){
var _1c=_12.transformEntry(_12,_17);
if(_1b.match("POINT")){
var _1d=_1b.substring(6,_1b.length);
var _1e=_1d.split(" ");
_1e=_13.Forward(_1e);
_1e=_12.containerModel.extent.getPL(_1e);
_12.featureFactory.createFeature(_12,"POINT",_1e,_19,_18,_1c,_1a);
}else{
if(_1b.match("LINESTRING")){
var _1f=_1b.substring(11,_1b.length);
var _20=_1f.split(/[ ,\n]+/);
var _21=new Array(_20.length/2);
var _1e=new Array(2);
var _22;
var jj=0;
for(var i=0;i<_20.length;i++){
_1e[0]=_20[i];
_1e[1]=_20[i+1];
_22=_13.Forward(_1e);
_22=_12.containerModel.extent.getPL(_22);
_21[jj]=_22;
jj++;
i++;
}
_12.featureFactory.createFeature(_12,"LINESTRING",_21,_19,_18,_1c,_1a);
}else{
if(_1b.match("POLYGON")){
}else{
if(_1b.match("CURVE")){
}else{
}
}
}
}
}else{
var _1e=_12.model.getFeaturePoint(_17);
if((_1e!=null)&&(_1e[0]!=0)&&(_1e[1]!=0)){
_1e=_13.Forward(_1e);
_1e=_12.containerModel.extent.getPL(_1e);
var _1c=_12.transformEntry(_12,_17);
_12.featureFactory.createFeature(_12,"POINT",_1e,_19,_18,_1c,_1a);
}
}
}
}
};

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function GetMarkerInfo(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doAction=function(_3,_4){
};
if(this.mouseHandler){
this.mouseHandler.model.addListener("mouseup",this.doAction,this);
}
}

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlPointRenderer(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
this.normalImage=_1.selectSingleNode("mb:normalImage").firstChild.nodeValue;
this.highlightImage=_1.selectSingleNode("mb:highlightImage").firstChild.nodeValue;
this.model.addListener("refresh",this.paint,this);
this.highlight=function(_3,_4){
var _5=document.getElementById(_4+"_normal");
_5.style.visibility="hidden";
var _6=document.getElementById(_4+"_highlight");
_6.style.visibility="visible";
};
this.model.addListener("highlightFeature",this.highlight,this);
this.dehighlight=function(_7,_8){
var _9=document.getElementById(_8+"_normal");
_9.style.visibility="visible";
var _a=document.getElementById(_8+"_highlight");
_a.style.visibility="hidden";
};
this.clearFeatures=function(){
var _b=this.model.getFeatureNodes();
for(var i=0;i<_b.length;++i){
var _d=_b[i];
var _e=this.model.getFeatureId(_d);
var _f=document.getElementById(_e+"_normal");
var _10=document.getElementById(_e+"_highlight");
if(_f){
this.node.removeChild(_f);
}
if(_10){
this.node.removeChild(_10);
}
}
};
this.model.addListener("dehighlightFeature",this.dehighlight,this);
}
GmlPointRenderer.prototype.paint=function(_11){
if(_11.model.doc&&_11.node&&_11.containerModel.doc){
var _12=new Proj(_11.containerModel.getSRS());
_11.clearFeatures();
var _13=_11.model.getFeatureNodes();
for(var i=0;i<_13.length;++i){
var _15=_13[i];
var _16=_11.model.getFeatureName(_15);
var _17=_11.model.getFeatureId(_15);
var _18=_11.model.getFeaturePoint(_15);
_18=_12.Forward(_18);
_18=_11.containerModel.extent.getPL(_18);
var _19=document.getElementById(_17+"_normal");
var _1a=document.getElementById(_17+"_highlight");
if(!_19){
_19=document.createElement("DIV");
_19.setAttribute("id",_17+"_normal");
_19.style.position="absolute";
_19.style.visibility="visible";
_19.style.zIndex=300;
var _1b=document.createElement("IMG");
_1b.src=config.skinDir+_11.normalImage;
_1b.title=_16;
_19.appendChild(_1b);
_11.node.appendChild(_19);
_1a=document.createElement("DIV");
_1a.setAttribute("id",_17+"_highlight");
_1a.style.position="absolute";
_1a.style.visibility="hidden";
_1a.style.zIndex=301;
var _1b=document.createElement("IMG");
_1b.src=config.skinDir+_11.highlightImage;
_1b.title=_16;
_1a.appendChild(_1b);
_11.node.appendChild(_1a);
}
_19.style.left=_18[0];
_19.style.top=_18[1];
_1a.style.left=_18[0];
_1a.style.top=_18[1];
}
}
};

mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlRenderer(_1,_2){
var _3=new MapContainerBase(this,_1,_2);
this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");
this.prePaint=function(_4){
_4.stylesheet.setParameter("width",_4.containerModel.getWindowWidth());
_4.stylesheet.setParameter("height",_4.containerModel.getWindowHeight());
bBox=_4.containerModel.getBoundingBox();
_4.stylesheet.setParameter("bBoxMinX",bBox[0]);
_4.stylesheet.setParameter("bBoxMinY",bBox[1]);
_4.stylesheet.setParameter("bBoxMaxX",bBox[2]);
_4.stylesheet.setParameter("bBoxMaxY",bBox[3]);
_4.stylesheet.setParameter("color","#FF0000");
_4.resultDoc=_4.coordXsl.transformNodeToObject(_4.resultDoc);
};
}

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlRendererSVG(_1,_2){
var _3=new MapContainerBase(this,_1,_2);
this.paintMethod="xsl2html";
this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");
this.prePaint=function(_4){
_4.model.setParam("modelStatus","preparing coordinates");
_4.stylesheet.setParameter("width",_4.containerModel.getWindowWidth());
_4.stylesheet.setParameter("height",_4.containerModel.getWindowHeight());
bBox=_4.containerModel.getBoundingBox();
_4.stylesheet.setParameter("bBoxMinX",bBox[0]);
_4.stylesheet.setParameter("bBoxMinY",bBox[1]);
_4.stylesheet.setParameter("bBoxMaxX",bBox[2]);
_4.stylesheet.setParameter("bBoxMaxY",bBox[3]);
_4.stylesheet.setParameter("color","#FF0000");
_4.resultDoc=_4.coordXsl.transformNodeToObject(_4.resultDoc);
};
this.hiddenListener=function(_5,_6){
var _7="visible";
if(_5.model.getHidden(_6)){
_7="hidden";
}
var _8=document.getElementById(_5.outputNodeId);
for(var i=0;i<_8.childNodes.length;++i){
_8.childNodes[i].style.visibility=_7;
}
};
this.model.addListener("hidden",this.hiddenListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlRendererTest(_1,_2){
this.paint=function(_3){
var _4=_3.model.doc.selectNodes("//gml:featureMember");
alert("pretending to paint:"+_4.length+" features"+Sarissa.serialize(_3.model.doc));
};
var _5=new MapContainerBase(this,_1,_2);
}

mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlRendererVG(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:tipWidget");
if(_3){
this.model.tipWidgetId=_3.firstChild.nodeValue;
}
this.prePaint=function(_4){
};
this.loadEntries=function(_5){
if((_5.model.doc!=null)&&(_5.targetModel.doc!=null)){
_5.containerModel.setParam("addLayer",_5.model.wfsFeature);
}
};
this.loadAndPaintEntries=function(_6){
if((_6.model.doc!=null)&&(_6.targetModel.doc!=null)){
_6.loadEntries(_6);
_6.targetModel.callListeners("refreshOtherLayers");
}
};
this.model.addListener("init",this.gmlRendererVGInit,this);
}
GmlRendererVG.prototype.paint=function(_7){
};
GmlRendererVG.prototype.gmlRendererVGInit=function(_8){
_8.targetModel.addListener("loadModel",_8.loadEntries,_8);
_8.targetModel.addListener("bbox",_8.loadEntries,_8);
_8.model.addListener("loadModel",_8.loadAndPaintEntries,_8);
};

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlRendererWKT(_1,_2){
var _3=new MapContainerBase(this,_1,_2);
this.paintMethod="xsl2js";
this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");
this.prePaint=function(_4){
_4.model.setParam("modelStatus","preparing coordinates");
_4.stylesheet.setParameter("targetElement",_4.containerModel.getWindowWidth());
_4.resultDoc=_4.coordXsl.transformNodeToObject(_4.resultDoc);
};
this.hiddenListener=function(_5,_6){
var _7="visible";
if(_5.model.getHidden(_6)){
_7="hidden";
}
var _8=document.getElementById(_5.outputNodeId);
for(var i=0;i<_8.childNodes.length;++i){
_8.childNodes[i].style.visibility=_7;
}
};
this.model.addListener("hidden",this.hiddenListener,this);
}

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/util/wz_jsgraphics/wz_jsgraphics.js");
function GmlRendererWZ(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:stylesheet");
if(_3){
this.stylesheet=new XslProcessor(_3.firstChild.nodeValue,_2.namespace);
}else{
this.stylesheet=new XslProcessor(baseDir+"/widget/"+_1.nodeName+".xsl",_2.namespace);
}
this.paint=function(_4){
if(_4.model.doc&&_4.node&&_4.containerModel&&_4.containerModel.doc){
_4.stylesheet.setParameter("modelUrl",_4.model.url);
_4.resultDoc=_4.model.doc;
_4.prePaint(_4);
if(_4.debug){
alert("prepaint:"+Sarissa.serialize(_4.resultDoc));
}
if(_4.debug){
alert("stylesheet:"+Sarissa.serialize(_4.stylesheet.xslDom));
}
var _5=document.getElementById(_4.outputNodeId);
var _6=document.createElement("DIV");
_6.style.position="absolute";
_6.style.top=0;
_6.style.left=0;
_6.style.zindex=300;
_6.setAttribute("id",_4.outputNodeId);
if(_5){
_4.node.replaceChild(_6,_5);
}else{
_4.node.appendChild(_6);
}
_4.stylesheet.setParameter("objRef","_4");
jsNode=_4.stylesheet.transformNodeToObject(_4.resultDoc);
js=jsNode.selectSingleNode("js").firstChild.nodeValue;
if(_4.debug){
alert("javascript eval:"+js);
}
_4.model.setParam("modelStatus","rendering");
eval(js);
_4.postPaint(_4);
}
};
this.model.addListener("refresh",this.paint,this);
MapContainerBase.apply(this,new Array(_1,_2));
for(var j=0;j<_1.childNodes.length;j++){
if(_1.childNodes[j].firstChild&&_1.childNodes[j].firstChild.nodeValue){
this.stylesheet.setParameter(_1.childNodes[j].nodeName,_1.childNodes[j].firstChild.nodeValue);
}
}
if(config.widgetText){
var _8="/mb:WidgetText/mb:widgets/mb:"+_1.nodeName;
var _9=config.widgetText.selectNodes(_8+"/*");
for(var j=0;j<_9.length;j++){
this.stylesheet.setParameter(_9[j].nodeName,_9[j].firstChild.nodeValue);
}
}
this.stylesheet.setParameter("modelId",this.model.id);
this.stylesheet.setParameter("modelTitle",this.model.title);
this.stylesheet.setParameter("widgetId",this.id);
this.stylesheet.setParameter("skinDir",config.skinDir);
this.stylesheet.setParameter("lang",config.lang);
this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");
this.prePaint=function(_a){
_a.model.setParam("modelStatus","preparing coordinates");
_a.stylesheet.setParameter("width",_a.containerModel.getWindowWidth());
_a.stylesheet.setParameter("height",_a.containerModel.getWindowHeight());
bBox=_a.containerModel.getBoundingBox();
_a.stylesheet.setParameter("bBoxMinX",bBox[0]);
_a.stylesheet.setParameter("bBoxMinY",bBox[1]);
_a.stylesheet.setParameter("bBoxMaxX",bBox[2]);
_a.stylesheet.setParameter("bBoxMaxY",bBox[3]);
_a.stylesheet.setParameter("color","#FF0000");
_a.resultDoc=_a.coordXsl.transformNodeToObject(_a.resultDoc);
if(!document.getElementById(_a.outputNodeId)){
}
};
this.hiddenListener=function(_b,_c){
var _d="visible";
if(_b.model.getHidden(_c)){
_d="hidden";
}
var _e=document.getElementById(_b.outputNodeId);
for(var i=0;i<_e.childNodes.length;++i){
_e.childNodes[i].style.visibility=_d;
}
};
this.model.addListener("hidden",this.hiddenListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/tool/GoogleMapTools.js");
function GoogleMapDragPan(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="move";
this.doAction=function(_3,_4){
if(!_3.enabled){
return;
}
var _5=_3.targetModel.getParam("aoi");
mid=new Array((_5[0][0]+_5[1][0])/2,(_5[0][1]+_5[1][1])/2);
_3.googleMapTools.zoomTo(_3.targetModel,mid,0);
};
this.setMouseListener=function(_6){
if(_6.mouseHandler){
_6.mouseHandler.model.addListener("mouseup",_6.doAction,_6);
}
if(!_6.googleMapTools){
_6.googleMapTools=new GoogleMapTools();
}
};
this.model.addListener("loadModel",this.setMouseListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/tool/GoogleMapTools.js");
function GoogleMapZoomIn(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doAction=function(_3,_4){
if(_3.enabled){
var _5=_3.targetModel.getParam("aoi");
if(_5!=null){
var _6=_3.targetModel.extent;
var ul=_5[0];
var lr=_5[1];
if((ul[0]==lr[0])&&(ul[1]==lr[1])){
_3.googleMapTools.zoomTo(_3.targetModel,ul,1);
}else{
_3.googleMapTools.setGmapExtent(_3.targetModel,new Array(lr[0],ul[1],ul[0],lr[1]));
}
}
}
};
this.setMouseListener=function(_9){
if(_9.mouseHandler){
_9.mouseHandler.model.addListener("mouseup",_9.doAction,_9);
}
if(!_9.googleMapTools){
_9.googleMapTools=new GoogleMapTools();
}
};
this.model.addListener("loadModel",this.setMouseListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/tool/GoogleMapTools.js");
function GoogleMapZoomOut(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doAction=function(_3,_4){
if(_3.enabled){
bbox=_3.targetModel.getParam("aoi");
if(bbox!=null){
extent=_3.targetModel.extent;
ul=bbox[0];
lr=bbox[1];
mid=new Array((ul[0]+lr[0])/2,(ul[1]+ul[1])/2);
_3.googleMapTools.zoomTo(_3.targetModel,mid,-1);
}
}
};
this.setMouseListener=function(_5){
if(_5.mouseHandler){
_5.mouseHandler.model.addListener("mouseup",_5.doAction,_5);
}
if(!_5.googleMapTools){
_5.googleMapTools=new GoogleMapTools();
}
};
this.model.addListener("loadModel",this.setMouseListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function InsertFeature(_1,_2){
this.cursor="default";
ButtonBase.apply(this,new Array(_1,_2));
this.trm=_1.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
this.tm=_1.selectSingleNode("mb:targetModel").firstChild.nodeValue;
this.tc=_1.selectSingleNode("mb:targetContext").firstChild.nodeValue;
this.httpPayload=new Object();
this.httpPayload.url=_1.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
this.httpPayload.method="post";
this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert.xsl");
this.updateXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Update.xsl");
this.doSelect=function(_3,_4){
if(_3){
if(!_4.transactionResponseModel){
_4.transactionResponseModel=window.config.objects[_4.trm];
_4.transactionResponseModel.addListener("loadModel",_4.handleResponse,_4);
}
if(!_4.targetModel){
_4.targetModel=window.config.objects[_4.tm];
}
if(!_4.targetContext){
_4.targetContext=window.config.objects[_4.tc];
}
fid=_4.targetModel.getXpathValue(_4.targetModel,"//@fid");
if(_4.targetModel.doc){
if(fid){
s=_4.updateXsl.transformNodeToObject(_4.targetModel.doc);
}else{
s=_4.insertXsl.transformNodeToObject(_4.targetModel.doc);
}
_4.httpPayload.postData=s;
_4.transactionResponseModel.newRequest(_4.transactionResponseModel,_4.httpPayload);
}else{
alert("No feature available to insert");
}
}
};
this.handleResponse=function(_5){
sucess=_5.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
if(sucess){
_5.targetModel.setModel(_5.targetModel,null);
_5.targetContext.callListeners("refreshWmsLayers");
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function LayerControl(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.prePaint=function(_3){
if(_3.model.featureName){
_3.stylesheet.setParameter("featureName",_3.model.featureName);
_3.stylesheet.setParameter("hidden",_3.model.getHidden(_3.model.featureName).toString());
}
};
this.highlightLayer=function(_4){
var _5=this.model.id+"_"+"mainMapWidget"+"_"+_4;
var _6=document.getElementById("previewImage");
var _7=document.getElementById(_5);
if(_6){
_6.src=_7.firstChild.src;
}
};
this.refresh=function(_8,_9){
_8.paint(_8,_8.id);
};
this.showLayerMetadata=function(_a){
var _b=config.objects.layerMetadata;
if(_b){
_b.stylesheet.setParameter("featureName",_a);
_b.node=document.getElementById(_b.htmlTagId);
_b.paint(_b);
}
};
this.model.addListener("deleteLayer",this.refresh,this);
this.model.addListener("moveLayerUp",this.refresh,this);
this.model.addListener("moveLayerDown",this.refresh,this);
if(this.autoRefresh){
this.model.addListener("addLayer",this.refresh,this);
}
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Legend(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.model.addListener("deleteLayer",this.refresh,this);
this.model.addListener("moveLayerUp",this.refresh,this);
this.model.addListener("moveLayerDown",this.refresh,this);
if(this.autoRefresh){
this.model.addListener("addLayer",this.refresh,this);
}
this.prePaint=function(_3){
if(_3.model.featureName){
_3.stylesheet.setParameter("featureName",_3.model.featureName);
_3.stylesheet.setParameter("hidden",_3.model.getHidden(_3.model.featureName).toString());
}
var _4=_3.model.doc.selectSingleNode(_3.model.nodeSelectXpath+"[@hidden='0' and @opaque='1']/wmc:Name");
if(_4){
_3.visibleLayer=_4.firstChild.nodeValue;
}
};
}
Legend.prototype.refresh=function(_5,_6){
_5.paint(_5,_5.id);
};
Legend.prototype.selectLayer=function(_7,_8){
_7.model.setParam("selectedLayer",_8);
};
Legend.prototype.swapOpaqueLayer=function(_9){
this.model.setHidden(this.visibleLayer,true);
this.model.setHidden(_9,false);
this.visibleLayer=_9;
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function LegendGraphic(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.model.addListener("hidden",this.refresh,this);
}
LegendGraphic.prototype.refresh=function(_3,_4){
_3.paint(_3,_3.id);
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function Loading(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.paint=function(_3){
while(_3.node.childNodes.length>0){
_3.node.removeChild(_3.node.childNodes[0]);
}
};
this.model.addListener("refresh",this.paint,this);
}

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
if(_6.model.template){
return;
}
if(!_6.model.url){
return;
}
var _7=document.getElementById(_6.outputNodeId+"_loading");
if(!_7){
_7=document.createElement("div");
_7.setAttribute("id",_6.outputNodeId+"_loading");
_6.node.appendChild(_7);
}
_7.className="loadingIndicator";
_7.style.zindex=1000;
if(_6.mapContainerNode){
_7.style.position="absolute";
_7.style.left="0px";
_7.style.top="0px";
}
if(_6.imageSrc){
var _8=document.getElementById(_6.outputNodeId+"_imageNode");
if(!_8){
_8=document.createElement("img");
_8.setAttribute("id",_6.outputNodeId+"_imageNode");
_7.appendChild(_8);
_8.style.zindex=1000;
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
_a.updateMessage=null;
var _b=document.getElementById(_a.outputNodeId+"_loading");
if(_b){
_a.node.removeChild(_b);
}
_a.node=null;
};
Loading2.prototype.update=function(_c,_d){
if(_d){
_c.updateMessage=_d;
_c.paint(_c);
}else{
_c.clear(_c);
}
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Locations(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.model.getSRS=function(){
return "EPSG:4326";
};
this.setAoi=function(_3,_4){
var _5=new Array();
_5=_3.split(",");
var ul=new Array(parseFloat(_5[0]),parseFloat(_5[3]));
var lr=new Array(parseFloat(_5[2]),parseFloat(_5[1]));
this.model.setParam("aoi",new Array(ul,lr));
this.targetModel.extent.zoomToBox(ul,lr);
};
}

mapbuilder.loadScript(baseDir+"/tool/Extent.js");
function MapContainerBase(_1,_2){
var _3=_1.selectSingleNode("mb:mapContainerId");
if(_3){
this.containerNodeId=_3.firstChild.nodeValue;
}else{
alert("MapContainerBase: required property mapContainerId missing in config:"+this.id);
}
var _4=_1.selectSingleNode("mb:zoomLevels");
this.zoomLevels=null;
if(_4){
this.zoomLevels=_4.firstChild.nodeValue.split(",");
}
var _5=document.getElementById(this.containerNodeId);
if(_5){
this.containerModel=_5.containerModel;
_2.containerModel=_5.containerModel;
this.setContainerWidth=function(_6){
_6.node.style.width=_6.containerModel.getWindowWidth()+"px";
_6.node.style.height=_6.containerModel.getWindowHeight()+"px";
if(this.stylesheet){
this.stylesheet.setParameter("width",_6.containerModel.getWindowWidth());
this.stylesheet.setParameter("height",_6.containerModel.getWindowHeight());
}
};
}else{
_5=document.createElement("div");
_5.setAttribute("id",this.containerNodeId);
_5.id=this.containerNodeId;
_5.style.position="relative";
_5.style.overflow="hidden";
_5.style.zIndex="500";
_5.containerModel=this.model;
this.containerModel=this.model;
_2.containerModel=_5.containerModel;
this.setContainerWidth=function(_7){
var _8=_1.selectSingleNode("mb:fixedWidth");
if(_8){
_8=_8.firstChild.nodeValue;
var _9=_7.containerModel.getWindowHeight()/_7.containerModel.getWindowWidth();
var _a=Math.round(_9*_8);
_7.containerModel.setWindowWidth(_8);
_7.containerModel.setWindowHeight(_a);
}
_7.node.style.width=_7.containerModel.getWindowWidth()+"px";
_7.node.style.height=_7.containerModel.getWindowHeight()+"px";
if(this.stylesheet){
this.stylesheet.setParameter("width",_7.containerModel.getWindowWidth());
this.stylesheet.setParameter("height",_7.containerModel.getWindowHeight());
}
};
this.containerModel.extent=new Extent(this.containerModel);
if(this.zoomLevels){
this.containerModel.extent.setFixedScale(true,this.zoomLevels);
}else{
this.containerModel.extent.setFixedScale(false);
}
this.containerModel.addFirstListener("loadModel",this.containerModel.extent.firstInit,this.containerModel.extent);
this.containerModel.addListener("bbox",this.containerModel.extent.init,this.containerModel.extent);
this.containerModel.addListener("resize",this.containerModel.extent.init,this.containerModel.extent);
this.setTooltip=function(_b,_c){
};
this.containerModel.addListener("tooltip",this.setTooltip,this);
this.eventHandler=function(ev){
if(window.event){
var p=window.event.clientX-getOffsetLeft(this)+document.documentElement.scrollLeft+document.body.scrollLeft;
var l=window.event.clientY-getOffsetTop(this)+document.documentElement.scrollTop+document.body.scrollTop;
this.evpl=new Array(p,l);
this.eventTarget=window.event.srcElement;
this.altKey=window.event.altKey;
this.ctrlKey=window.event.ctrlKey;
this.shiftKey=window.event.shiftKey;
this.eventType=window.event.type;
window.event.returnValue=false;
window.event.cancelBubble=true;
}else{
var p=ev.clientX+window.scrollX-getOffsetLeft(this);
var l=ev.clientY+window.scrollY-getOffsetTop(this);
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
_5.onmousemove=this.eventHandler;
_5.onmouseout=this.eventHandler;
_5.onmouseover=this.eventHandler;
_5.onmousedown=this.eventHandler;
_5.onmouseup=this.eventHandler;
this.node.appendChild(_5);
}
this.node=document.getElementById(this.containerNodeId);
this.setContainerWidth=this.setContainerWidth;
this.containerModel.addFirstListener("loadModel",this.setContainerWidth,this);
this.containerModel.addListener("bbox",this.paint,this);
}
function getOffsetLeft(_10){
var _11=0;
if(_10==null){
return _11;
}else{
if(_10.offsetLeft){
_11=_10.offsetLeft+getOffsetLeft(_10.offsetParent);
}else{
_11=getOffsetLeft(_10.offsetParent);
}
return _11;
}
}
function getOffsetTop(_12){
var _13=0;
if(_12==null){
return _13;
}else{
if(_12.offsetTop){
_13=_12.offsetTop+getOffsetTop(_12.offsetParent);
}else{
_13=getOffsetTop(_12.offsetParent);
}
return _13;
}
}

mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function MapImage(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.paint=function(_3){
if(_3.model.doc&&_3.node){
_3.prePaint(_3);
var _4=document.getElementById(_3.outputNodeId);
var _5=document.createElement("DIV");
_5.style.position="absolute";
_5.style.top=0;
_5.style.left=0;
_5.appendChild(_3.model.doc);
_5.setAttribute("id",_3.outputNodeId);
if(_4){
_3.node.replaceChild(_5,_4);
}else{
_3.node.appendChild(_5);
}
_3.postPaint(_3);
}
};
this.model.addListener("refresh",this.paint,this);
MapContainerBase.apply(this,new Array(_1,_2));
this.prePaint=function(_6){
_6.model.doc.width=_6.containerModel.getWindowWidth();
_6.model.doc.height=_6.containerModel.getWindowHeight();
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function MapPane(_1,_2){
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
this.hiddenListener=function(_6,_7){
var _8="visible";
if(_6.model.getHidden(_7)=="1"){
_8="hidden";
}
var _9=_6.model.id+"_"+_6.id+"_"+_7;
var _a=document.getElementById(_9);
if(_a){
_a.style.visibility=_8;
imgId="real"+_a.imgId;
img=document.getElementById(imgId);
if(img){
img.style.visibility=_8;
}
}
};
this.model.addListener("hidden",this.hiddenListener,this);
this.refreshWmsLayers=function(_b){
_b.d=new Date();
_b.stylesheet.setParameter("uniqueId",_b.d.getTime());
_b.paint(_b);
};
this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);
this.model.addListener("refresh",this.paint,this);
this.model.addListener("addLayer",this.addLayer,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("moveLayerUp",this.moveLayerUp,this);
this.model.addListener("moveLayerDown",this.moveLayerDown,this);
this.model.addListener("timestamp",this.timestampListener,this);
}
MapPane.prototype.paint=function(_c){
if(_c.model.doc&&_c.node){
_c.stylesheet.setParameter("width",_c.model.getWindowWidth());
_c.stylesheet.setParameter("height",_c.model.getWindowHeight());
_c.stylesheet.setParameter("bbox",_c.model.getBoundingBox().join(","));
_c.stylesheet.setParameter("srs",_c.model.getSRS());
if(_c.debug){
alert("painting:"+Sarissa.serialize(_c.model.doc));
}
if(_c.debug){
alert("stylesheet:"+Sarissa.serialize(_c.stylesheet.xslDom));
}
var _d=_c.stylesheet.transformNodeToObject(_c.model.doc);
var _e=_d.selectNodes("//img");
if(_c.debug){
alert("painting:"+_c.id+":"+s);
if(config.serializeUrl){
postLoad(config.serializeUrl,s);
}
}
var _f=document.getElementById(_c.outputNodeId);
if(!_f){
_f=document.createElement("div");
_f.setAttribute("id",_c.outputNodeId);
_f.style.position="absolute";
_c.node.appendChild(_f);
_f.style.left="0px";
_f.style.top="0px";
}
var _10=_c.model.getAllLayers();
if(!_c.imageStack){
_c.imageStack=new Array(_10.length);
}
_c.firstImageLoaded=false;
_c.layerCount=_10.length;
for(var i=0;i<_10.length;i++){
if(!_c.imageStack[i]){
_c.imageStack[i]=new Image();
_c.imageStack[i].objRef=_c;
}
var _12=_e[i].getAttribute("src");
_c.loadImgDiv(_10[i],_12,_c.imageStack[i]);
}
var _13="loading "+_c.layerCount+" map layers";
_c.model.setParam("modelStatus",_13);
}
};
MapPane.prototype.getLayerDivId=function(_14){
return this.model.id+"_"+this.id+"_"+_14;
if(this.model.timestampList&&this.model.timestampList.getAttribute("layerName")==_14){
var _15=this.model.getParam("timestamp");
var _16=this.model.timestampList.childNodes[_15];
layerId+="_"+_16.firstChild.nodeValue;
}
};
MapPane.prototype.timestampListener=function(_17,_18){
var _19=_17.model.timestampList.getAttribute("layerName");
var _1a=_17.model.timestampList.childNodes[_18];
var vis=(_1a.getAttribute("current")=="1")?"visible":"hidden";
var _1c=_17.model.id+"_"+_17.id+"_"+_19+"_"+_1a.firstChild.nodeValue;
var _1d=document.getElementById(_1c);
if(_1d){
_1d.style.visibility=vis;
}else{
alert("error finding layerId:"+_1c);
}
};
MapPane.prototype.addLayer=function(_1e,_1f){
_1e.stylesheet.setParameter("width",_1e.model.getWindowWidth());
_1e.stylesheet.setParameter("height",_1e.model.getWindowHeight());
_1e.stylesheet.setParameter("bbox",_1e.model.getBoundingBox().join(","));
_1e.stylesheet.setParameter("srs",_1e.model.getSRS());
var s=_1e.stylesheet.transformNodeToString(_1f);
var _21=document.createElement("div");
_21.innerHTML=s;
var _22=_21.firstChild.firstChild.getAttribute("src");
_1e.imageStack.push(new Image());
_1e.imageStack[_1e.imageStack.length-1].objRef=_1e;
_1e.firstImageLoaded=true;
++_1e.layerCount;
_1e.loadImgDiv(_1f,_22,_1e.imageStack[_1e.imageStack.length-1]);
var _23="loading "+_1e.layerCount+" map layers";
_1e.model.setParam("modelStatus",_23);
};
MapPane.prototype.deleteLayer=function(_24,_25){
var _26=_24.getLayerDivId(_25);
var _27=document.getElementById(_26);
var _28=document.getElementById(_24.outputNodeId);
_28.removeChild(_27);
};
MapPane.prototype.moveLayerUp=function(_29,_2a){
var _2b=document.getElementById(_29.outputNodeId);
var _2c=_29.getLayerDivId(_2a);
var _2d=document.getElementById(_2c);
var _2e=_2d.nextSibling;
if(!_2e){
alert("can't move node past beginning of list:"+_2a);
return;
}
_2b.insertBefore(_2e,_2d);
};
MapPane.prototype.moveLayerDown=function(_2f,_30){
var _31=document.getElementById(_2f.outputNodeId);
var _32=_2f.getLayerDivId(_30);
var _33=document.getElementById(_32);
var _34=_33.previousSibling;
if(!_34){
alert("can't move node past end of list:"+_30);
return;
}
_31.insertBefore(_33,_34);
};
MapPane.prototype.loadImgDiv=function(_35,_36,_37){
var _38=document.getElementById(this.outputNodeId);
var _39=_35.selectSingleNode("wmc:Name").firstChild.nodeValue;
var _3a=(_35.getAttribute("hidden")==1)?true:false;
var _3b="image/gif";
var _3c=_35.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");
if(_3c){
_3b=_3c.firstChild.nodeValue;
}
var _3d=this.getLayerDivId(_39);
var _3e=document.getElementById(_3d);
if(!_3e){
_3e=document.createElement("div");
_3e.setAttribute("id",_3d);
_3e.style.position="absolute";
_3e.style.visibility=(_3a)?"hidden":"visible";
_3e.style.top="0px";
_3e.style.left="0px";
_3e.imgId=Math.random().toString();
var _3f=document.createElement("img");
_3f.id="real"+_3e.imgId;
_3f.src=config.skinDir+"/images/Spacer.gif";
_3f.layerHidden=_3a;
_3e.appendChild(_3f);
_38.appendChild(_3e);
}
_37.id=_3e.imgId;
_37.hidden=_3a;
_37.fixPng=false;
if(_SARISSA_IS_IE&&_3b=="image/png"){
_37.fixPng=true;
}
_37.onload=MapImgLoadHandler;
_37.src=_36;
};
function MapImgLoadHandler(){
var _40=document.getElementById("real"+this.id);
if(!this.objRef.firstImageLoaded){
this.objRef.firstImageLoaded=true;
var _41=document.getElementById(this.objRef.outputNodeId);
var _42=_41.childNodes;
for(var i=0;i<_42.length;++i){
var _44=_42[i].firstChild;
_44.parentNode.style.visibility="hidden";
_44.style.visibility="hidden";
if(_SARISSA_IS_IE){
_44.src=config.skinDir+"/images/Spacer.gif";
}
}
if(_SARISSA_IS_IE){
_42[0].firstChild.parentNode.parentNode.style.visibility="hidden";
}
_41.style.left="0px";
_41.style.top="0px";
}
--this.objRef.layerCount;
if(this.objRef.layerCount>0){
var _45="loading "+this.objRef.layerCount+" map layers";
this.objRef.model.setParam("modelStatus",_45);
}else{
this.objRef.model.setParam("modelStatus");
}
if(_SARISSA_IS_IE){
_40.parentNode.parentNode.style.visibility="visible";
}
if(this.fixPng){
var vis=_40.layerHidden?"hidden":"visible";
alert("nonfix "+_40.outerHTML);
alert("oldimg id "+_40.id);
s=fixPNG(this,"real"+this.id);
alert(s);
_40.outerHTML=s;
alert("fix "+_40.outerHTML);
if(!this.hidden){
fixImg=document.getElementById("real"+this.id);
fixImg.style.visibility="visible";
alert("fiximg "+fixImg.outerHTML);
}
}else{
_40.src=this.src;
_40.width=this.objRef.model.getWindowWidth();
_40.height=this.objRef.model.getWindowHeight();
if(!this.hidden){
_40.parentNode.style.visibility="visible";
_40.style.visibility="visible";
}
}
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/graphics/MapLayerMgr.js");
function MapPane2(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:loadingSrc");
if(_3){
this.loadingSrc=config.skinDir+_3.firstChild.nodeValue;
}else{
this.loadingSrc=config.skinDir+"/images/Loading.gif";
}
this.MapLayerMgr=new MapLayerMgr(this,_2);
this.model.addListener("refresh",this.paint,this);
this.model.addListener("addLayer",this.addLayer,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("moveLayerUp",this.moveLayerUp,this);
this.model.addListener("moveLayerDown",this.moveLayerDown,this);
this.model.addListener("hidden",this.hiddenListener,this);
this.model.addListener("transparancy",this.transparancyListener,this);
}
MapPane2.prototype.paint=function(_4,_5){
if(_4.model.doc&&_4.node&&(_4.autoRefresh||_5)){
if(_4.debug){
alert("painting:"+Sarissa.serialize(_4.model.doc));
}
if(_4.debug){
alert("stylesheet:"+Sarissa.serialize(_4.stylesheet.xslDom));
}
if(_4.debug){
alert("painting:"+_4.id+":"+s);
if(config.serializeUrl){
postLoad(config.serializeUrl,s);
}
}
var _6=document.getElementById(_4.outputNodeId);
if(!_6){
_6=document.createElement("div");
_6.setAttribute("id",_4.outputNodeId);
_6.style.position="absolute";
_4.node.appendChild(_6);
_6.style.left="0px";
_6.style.top="0px";
}
var _7=document.getElementById("loaderDiv");
if(!_7){
_7=document.createElement("div");
_7.setAttribute("id","loaderDiv");
_7.style.position="absolute";
_7.style.width=_4.model.getWindowWidth()+"px";
_7.style.height=_4.model.getWindowHeight()+"px";
_7.style.background="white";
_7.style.zIndex="2000";
_7.style.left="0px";
_7.style.top="0px";
if(!_SARISSA_IS_IE){
_7.style.opacity=".7";
}else{
_7.style.filter="alpha(opacity=0)";
}
_6.parentNode.appendChild(_7);
}
var _8=_4.model.getAllLayers();
_4.firstImageLoaded=false;
_4.layerCount=_8.length;
for(var i=0;i<_8.length;i++){
_4.MapLayerMgr.paint(_4.MapLayerMgr,_8[i],i);
}
if(_7){
if(!_SARISSA_IS_IE){
_6.parentNode.removeChild(_7);
}
}
}
};
MapPane2.prototype.getLayer=function(_a){
return this.MapLayerMgr(_a);
};
MapPane2.prototype.getLayerDivId=function(_b){
return this.model.id+"_"+this.id+"_"+_b;
};
MapPane2.prototype.addLayer=function(_c,_d){
var _e=_c.model.getAllLayers();
var _f=_e.length-1;
_c.MapLayerMgr.paint(_c.MapLayerMgr,_d,_f);
};
MapPane2.prototype.deleteLayer=function(_10,_11){
var _12=_10.getLayerDivId(_11);
if(_12!=null){
var _13=document.getElementById(_12);
if(_13!=null){
var _14=document.getElementById(_10.outputNodeId);
_14.removeChild(_13);
}
}
};
MapPane2.prototype.moveLayerUp=function(_15,_16){
var _17=document.getElementById(_15.outputNodeId);
var _18=_15.getLayerDivId(_16);
var _19=document.getElementById(_18);
var _1a=_19.nextSibling;
if(!_1a){
alert("can't move node past beginning of list:"+_16);
return;
}
_17.insertBefore(_1a,_19);
};
MapPane2.prototype.moveLayerDown=function(_1b,_1c){
var _1d=document.getElementById(_1b.outputNodeId);
var _1e=_1b.getLayerDivId(_1c);
var _1f=document.getElementById(_1e);
var _20=_1f.previousSibling;
if(!_20){
alert("can't move node past end of list:"+_1c);
return;
}
_1d.insertBefore(_1f,_20);
};
MapPane2.prototype.clearWidget2=function(_21){
_21.MapLayerMgr.deleteAllLayers();
};
MapPane2.prototype.hiddenListener=function(_22,_23){
var vis="visible";
if(_22.model.getHidden(_23)=="1"){
vis="hidden";
}
var _25=_22.model.id+"_"+_22.id+"_"+_23;
var _26=document.getElementById(_25);
if(_26){
if(vis=="visible"){
_26.style.display="inline";
}else{
_26.style.display="none";
}
_26.style.visibility=vis;
imgId="real"+_26.imgId;
img=document.getElementById(imgId);
if(img){
img.style.visibility=vis;
}
}
};
MapPane2.prototype.transparancyListener=function(_27,_28){
var _29=_27.model.getTransparancy(_28);
var _2a=_27.model.id+"_"+_27.id+"_"+_28;
var _2b=document.getElementById(_2a);
if(_2b){
if(_SARISSA_IS_IE){
var _2c="alpha(opacity="+_29+")";
for(var i=0;i<_2b.childNodes.length;i++){
_2b.childNodes[i].style.filter=_2c;
}
}else{
var _2e=_29/100;
_2b.style.opacity=_2e;
}
}
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function MapScaleBar(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.scaleDenominator=1;
this.displaySystem="metric";
var _3=_1.selectSingleNode("mb:displaySystem");
if(_3){
this.displaySystem=_3.firstChild.nodeValue;
}
this.minWidth=100;
var _4=_1.selectSingleNode("mb:minWidth");
if(_4){
this.minWidth=_4.firstChild.nodeValue;
}
this.maxWidth=200;
var _5=_1.selectSingleNode("mb:maxWidth");
if(_5){
this.maxWidth=_5.firstChild.nodeValue;
}
this.divisions=2;
var _6=_1.selectSingleNode("mb:divisions");
if(_6){
this.divisions=_6.firstChild.nodeValue;
}
this.subdivisions=2;
var _7=_1.selectSingleNode("mb:subdivisions");
if(_7){
this.subdivisions=_7.firstChild.nodeValue;
}
this.showMinorMeasures=false;
var _8=_1.selectSingleNode("mb:showMinorMeasures");
if(_8&&_8.firstChild.nodeValue=="true"){
this.showMinorMeasures=true;
}
this.abbreviateLabel=false;
var _9=_1.selectSingleNode("mb:abbreviateLabel");
if(_9&&_9.firstChild.nodeValue=="true"){
this.abbreviateLabel=true;
}
this.singleLine=false;
var _a=_1.selectSingleNode("mb:singleLine");
if(_a&&_a.firstChild.nodeValue=="true"){
this.singleLine=true;
}
this.align="center";
var _b=_1.selectSingleNode("mb:align");
if(_b){
this.align=_b.firstChild.nodeValue;
}
this.resolution=72;
this.container=document.createElement("div");
this.container.className="sbWrapper";
this.container.style.position="relative";
this.container.setAttribute("id",this.outputNodeId);
this.labelContainer=document.createElement("div");
this.labelContainer.className="sbUnitsContainer";
this.labelContainer.style.position="absolute";
this.graphicsContainer=document.createElement("div");
this.graphicsContainer.style.position="absolute";
this.graphicsContainer.className="sbGraphicsContainer";
this.numbersContainer=document.createElement("div");
this.numbersContainer.style.position="absolute";
this.numbersContainer.className="sbNumbersContainer";
var _c=document.createElement("div");
_c.className="sbMarkerMajor";
this.graphicsContainer.appendChild(_c);
var _d=document.createElement("div");
_d.className="sbMarkerMinor";
this.graphicsContainer.appendChild(_d);
var _e=document.createElement("div");
_e.className="sbBar";
this.graphicsContainer.appendChild(_e);
var _f=document.createElement("div");
_f.className="sbBarAlt";
this.graphicsContainer.appendChild(_f);
this.model.addListener("bbox",this.update,this);
this.model.addListener("refresh",this.update,this);
}
MapScaleBar.prototype.update=function(_10){
var _11=document.getElementById(_10.outputNodeId);
if(!_11){
_10.node.appendChild(_10.container);
}
var _12=_10.model.extent.getScale();
if(_12!=null){
_10.scaleDenominator=_12;
}
function HandsomeNumber(_13,_14,_15){
var _15=(_15==null)?10:_15;
var _16=Number.POSITIVE_INFINITY;
var _17=Number.POSITIVE_INFINITY;
var _18=_13;
var _19=3;
for(var _1a=0;_1a<3;++_1a){
var _1b=Math.pow(2,(-1*_1a));
var _1c=Math.floor(Math.log(_14/_1b)/Math.LN10);
for(var _1d=_1c;_1d>(_1c-_15+1);--_1d){
var _1e=Math.max(_1a-_1d,0);
var _1f=_1b*Math.pow(10,_1d);
if((_1f*Math.floor(_14/_1f))>=_13){
if(_13%_1f==0){
var _20=_13/_1f;
}else{
var _20=Math.floor(_13/_1f)+1;
}
var _21=_20+(2*_1a);
var _22=(_1d<0)?(Math.abs(_1d)+1):_1d;
if((_21<_16)||((_21==_16)&&(_22<_17))){
_16=_21;
_17=_22;
_18=(_1f*_20).toFixed(_1e);
_19=_1e;
}
}
}
}
this.value=_18;
this.score=_16;
this.tieBreaker=_17;
this.numDec=_19;
}
HandsomeNumber.prototype.toString=function(){
return this.value.toString();
};
HandsomeNumber.prototype.valueOf=function(){
return this.value;
};
function styleValue(_23,_24){
var _25=0;
if(document.styleSheets){
for(var _26=document.styleSheets.length-1;_26>=0;--_26){
var _27=document.styleSheets[_26];
if(!_27.disabled){
var _28;
if(typeof (_27.cssRules)=="undefined"){
if(typeof (_27.rules)=="undefined"){
return 0;
}else{
_28=_27.rules;
}
}else{
_28=_27.cssRules;
}
for(var _29=0;_29<_28.length;++_29){
var _2a=_28[_29];
if(_2a.selectorText&&(_2a.selectorText.toLowerCase()==_23.toLowerCase())){
if(_2a.style[_24]!=""){
_25=parseInt(_2a.style[_24]);
}
}
}
}
}
}
return _25?_25:0;
}
function formatNumber(_2b,_2c){
_2c=(_2c)?_2c:0;
var _2d=""+Math.round(_2b);
var _2e=/(-?[0-9]+)([0-9]{3})/;
while(_2e.test(_2d)){
_2d=_2d.replace(_2e,"$1,$2");
}
if(_2c>0){
var _2f=Math.floor(Math.pow(10,_2c)*(_2b-Math.round(_2b)));
if(_2f==0){
return _2d;
}else{
return _2d+"."+_2f;
}
}else{
return _2d;
}
}
_10.container.title="scale 1:"+formatNumber(_10.scaleDenominator);
var _30=new Object();
_30.english={units:["miles","feet","inches"],abbr:["mi","ft","in"],inches:[63360,12,1]};
_30.metric={units:["kilometers","meters","centimeters"],abbr:["km","m","cm"],inches:[39370.07874,39.370079,0.393701]};
var _31=new Array();
for(var _32=0;_32<_30[_10.displaySystem].units.length;++_32){
_31[_32]=new Object();
var _33=_10.resolution*_30[_10.displaySystem].inches[_32]/_10.scaleDenominator;
var _34=(_10.minWidth/_33)/(_10.divisions*_10.subdivisions);
var _35=(_10.maxWidth/_33)/(_10.divisions*_10.subdivisions);
for(var _36=0;_36<(_10.divisions*_10.subdivisions);++_36){
var _37=_34*(_36+1);
var _38=_35*(_36+1);
var _39=new HandsomeNumber(_37,_38);
_31[_32][_36]={value:(_39.value/(_36+1)),score:0,tieBreaker:0,numDec:0,displayed:0};
for(var _3a=0;_3a<(_10.divisions*_10.subdivisions);++_3a){
displayedValuePosition=_39.value*(_3a+1)/(_36+1);
niceNumber2=new HandsomeNumber(displayedValuePosition,displayedValuePosition);
var _3b=((_3a+1)%_10.subdivisions==0);
var _3c=((_3a+1)==(_10.divisions*_10.subdivisions));
if((_10.singleLine&&_3c)||(!_10.singleLine&&(_3b||_10.showMinorMeasures))){
_31[_32][_36].score+=niceNumber2.score;
_31[_32][_36].tieBreaker+=niceNumber2.tieBreaker;
_31[_32][_36].numDec=Math.max(_31[_32][_36].numDec,niceNumber2.numDec);
_31[_32][_36].displayed+=1;
}else{
_31[_32][_36].score+=niceNumber2.score/_10.subdivisions;
_31[_32][_36].tieBreaker+=niceNumber2.tieBreaker/_10.subdivisions;
}
}
var _3d=(_32+1)*_31[_32][_36].tieBreaker/_31[_32][_36].displayed;
_31[_32][_36].score*=_3d;
}
}
var _3e=null;
var _3f=null;
var _40=null;
var _41=null;
var _42=Number.POSITIVE_INFINITY;
var _43=Number.POSITIVE_INFINITY;
var _44=0;
for(var _32=0;_32<_31.length;++_32){
for(_36 in _31[_32]){
if((_31[_32][_36].score<_42)||((_31[_32][_36].score==_42)&&(_31[_32][_36].tieBreaker<_43))){
_42=_31[_32][_36].score;
_43=_31[_32][_36].tieBreaker;
_3e=_31[_32][_36].value;
_44=_31[_32][_36].numDec;
_3f=_30[_10.displaySystem].units[_32];
_40=_30[_10.displaySystem].abbr[_32];
_33=_10.resolution*_30[_10.displaySystem].inches[_32]/_10.scaleDenominator;
_41=_33*_3e;
}
}
}
var _45=(styleValue(".sbMarkerMajor","borderLeftWidth")+styleValue(".sbMarkerMajor","width")+styleValue(".sbMarkerMajor","borderRightWidth"))/2;
var _46=(styleValue(".sbMarkerMinor","borderLeftWidth")+styleValue(".sbMarkerMinor","width")+styleValue(".sbMarkerMinor","borderRightWidth"))/2;
var _47=(styleValue(".sbBar","borderLeftWidth")+styleValue(".sbBar","border-right-width"))/2;
var _48=(styleValue(".sbBarAlt","borderLeftWidth")+styleValue(".sbBarAlt","borderRightWidth"))/2;
if(!document.styleSheets){
_45=0.5;
_46=0.5;
}
while(_10.labelContainer.hasChildNodes()){
_10.labelContainer.removeChild(_10.labelContainer.firstChild);
}
while(_10.graphicsContainer.hasChildNodes()){
_10.graphicsContainer.removeChild(_10.graphicsContainer.firstChild);
}
while(_10.numbersContainer.hasChildNodes()){
_10.numbersContainer.removeChild(_10.numbersContainer.firstChild);
}
var _49,aBarPiece,numbersBox,xOffset;
var _4a={left:0,center:(-1*_10.divisions*_10.subdivisions*_41/2),right:(-1*_10.divisions*_10.subdivisions*_41)};
var _4b=0+_4a[_10.align];
var _4c=0;
for(var _4d=0;_4d<_10.divisions;++_4d){
_4b=_4d*_10.subdivisions*_41;
_4b+=_4a[_10.align];
_4c=(_4d==0)?0:((_4d*_10.subdivisions)*_3e).toFixed(_44);
_49=document.createElement("div");
_49.className="sbMarkerMajor";
_49.style.position="absolute";
_49.style.overflow="hidden";
_49.style.left=Math.round(_4b-_45)+"px";
_49.appendChild(document.createTextNode(" "));
_10.graphicsContainer.appendChild(_49);
if(!_10.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
if(_10.showMinorMeasures){
numbersBox.style.width=Math.round(_41*2)+"px";
numbersBox.style.left=Math.round(_4b-_41)+"px";
}else{
numbersBox.style.width=Math.round(_10.subdivisions*_41*2)+"px";
numbersBox.style.left=Math.round(_4b-(_10.subdivisions*_41))+"px";
}
numbersBox.appendChild(document.createTextNode(_4c));
_10.numbersContainer.appendChild(numbersBox);
}
for(var _4e=0;_4e<_10.subdivisions;++_4e){
aBarPiece=document.createElement("div");
aBarPiece.style.position="absolute";
aBarPiece.style.overflow="hidden";
aBarPiece.style.width=Math.round(_41)+"px";
if((_4e%2)==0){
aBarPiece.className="sbBar";
aBarPiece.style.left=Math.round(_4b-_47)+"px";
}else{
aBarPiece.className="sbBarAlt";
aBarPiece.style.left=Math.round(_4b-_48)+"px";
}
aBarPiece.appendChild(document.createTextNode(" "));
_10.graphicsContainer.appendChild(aBarPiece);
if(_4e<(_10.subdivisions-1)){
_4b=((_4d*_10.subdivisions)+(_4e+1))*_41;
_4b+=_4a[_10.align];
_4c=(_4d*_10.subdivisions+_4e+1)*_3e;
_49=document.createElement("div");
_49.className="sbMarkerMinor";
_49.style.position="absolute";
_49.style.overflow="hidden";
_49.style.left=Math.round(_4b-_46)+"px";
_49.appendChild(document.createTextNode(" "));
_10.graphicsContainer.appendChild(_49);
if(_10.showMinorMeasures&&!_10.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
numbersBox.style.width=Math.round(_41*2)+"px";
numbersBox.style.left=Math.round(_4b-_41)+"px";
numbersBox.appendChild(document.createTextNode(_4c));
_10.numbersContainer.appendChild(numbersBox);
}
}
}
}
_4b=(_10.divisions*_10.subdivisions)*_41;
_4b+=_4a[_10.align];
_4c=((_10.divisions*_10.subdivisions)*_3e).toFixed(_44);
_49=document.createElement("div");
_49.className="sbMarkerMajor";
_49.style.position="absolute";
_49.style.overflow="hidden";
_49.style.left=Math.round(_4b-_45)+"px";
_49.appendChild(document.createTextNode(" "));
_10.graphicsContainer.appendChild(_49);
if(!_10.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
if(_10.showMinorMeasures){
numbersBox.style.width=Math.round(_41*2)+"px";
numbersBox.style.left=Math.round(_4b-_41)+"px";
}else{
numbersBox.style.width=Math.round(_10.subdivisions*_41*2)+"px";
numbersBox.style.left=Math.round(_4b-(_10.subdivisions*_41))+"px";
}
numbersBox.appendChild(document.createTextNode(_4c));
_10.numbersContainer.appendChild(numbersBox);
}
var _4f=document.createElement("div");
_4f.style.position="absolute";
var _50;
if(_10.singleLine){
_50=_4c;
_4f.className="sbLabelBoxSingleLine";
_4f.style.top="-0.6em";
_4f.style.left=(_4b+10)+"px";
}else{
_50="";
_4f.className="sbLabelBox";
_4f.style.textAlign="center";
_4f.style.width=Math.round(_10.divisions*_10.subdivisions*_41)+"px";
_4f.style.left=Math.round(_4a[_10.align])+"px";
_4f.style.overflow="hidden";
}
if(_10.abbreviateLabel){
_50+=" "+_40;
}else{
_50+=" "+_3f;
}
_4f.appendChild(document.createTextNode(_50));
_10.labelContainer.appendChild(_4f);
if(!document.styleSheets){
var _51=document.createElement("style");
_51.type="text/css";
var _52=".sbBar {top: 0px; background: #666666; height: 1px; border: 0;}";
_52+=".sbBarAlt {top: 0px; background: #666666; height: 1px; border: 0;}";
_52+=".sbMarkerMajor {height: 7px; width: 1px; background: #666666; border: 0;}";
_52+=".sbMarkerMinor {height: 5px; width: 1px; background: #666666; border: 0;}";
_52+=".sbLabelBox {top: -16px;}";
_52+=".sbNumbersBox {top: 7px;}";
_51.appendChild(document.createTextNode(_52));
document.getElementsByTagName("head").item(0).appendChild(_51);
}
_10.container.appendChild(_10.graphicsContainer);
_10.container.appendChild(_10.labelContainer);
_10.container.appendChild(_10.numbersContainer);
};

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
function ModelStatus(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.prePaint=function(_3){
_3.stylesheet.setParameter("statusMessage",_3.targetModel.getParam("modelStatus"));
};
this.model.addListener("modelStatus",this.paint,this);
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function ModelUrlInput(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.submitForm=function(){
var _3=new Object();
_3.url=this.urlInputForm.defaultUrl.value;
_3.method=this.targetModel.method;
this.targetModel.newRequest(this.targetModel,_3);
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
this.prePaint=function(_7){
_7.stylesheet.setParameter("modelTitle",_7.targetModel.title);
};
this.postPaint=function(_8){
_8.urlInputForm=document.getElementById(_8.formName);
_8.urlInputForm.parentWidget=_8;
_8.urlInputForm.onkeypress=_8.handleKeyPress;
};
this.formName="urlInputForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function OpenLSForm(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.defaultModelUrl=_1.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
this.geocodeServerUrl=_1.selectSingleNode("mb:geocodeServerUrl").firstChild.nodeValue;
this.xsl=new XslProcessor(baseDir+"/tool/xsl/ols_GeocodeRequest.xsl");
this.submitForm=function(_3){
_3.geoForm=document.getElementById(this.formName);
pc=_3.geoForm.pcValue.value;
street=_3.geoForm.streetValue.value;
number=_3.geoForm.numberValue.value;
city=_3.geoForm.cityValue.value;
municipality=_3.geoForm.municipalityValue.value;
country=_3.geoForm.countryValue.value;
if(pc){
_3.xsl.setParameter("postalCode",pc);
}
if(street){
_3.xsl.setParameter("street",street);
}
if(number){
_3.xsl.setParameter("number",number);
}
if(city){
_3.xsl.setParameter("municipalitySubdivision",city);
}
if(municipality){
_3.xsl.setParameter("municipality",municipality);
}
if(country){
_3.xsl.setParameter("countryCode",country);
}
if(!country){
alert("You need to specify a country code");
return;
}
if(!municipality&&!city&&!number&&!street&&!pc){
alert("Please enter at least one value, before proceeding");
return;
}
_3.requestModel=_3.xsl.transformNodeToObject(this.model.doc);
_3.httpPayload=new Object();
_3.httpPayload.url=_3.geocodeServerUrl;
_3.httpPayload.method="post";
_3.httpPayload.postData=_3.requestModel;
_3.targetModel.newRequest(_3.targetModel,_3.httpPayload);
};
var _4=_1.selectSingleNode("mb:formName");
if(_4){
this.formName=_4.firstChild.nodeValue;
}else{
this.formName="OpenLSForm_"+mbIds.getId();
}
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function OpenLSResponse(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Save(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doSelect=function(_3,_4){
if(_3){
_4.targetModel.saveModel(_4.targetModel);
}
};
this.savedModelPopup=function(_5,_6){
window.open(_6,this.popupWindowName);
};
this.initReset=function(_7){
_7.targetModel.addListener("modelSaved",_7.savedModelPopup,_7);
};
var _8=_1.selectSingleNode("mb:popupWindowName");
if(_8){
this.popupWindowName=_8.firstChild.nodeValue;
this.model.addListener("init",this.initReset,this);
}
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SaveModel(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.saveLink=function(_3,_4){
var _5=document.getElementById(_3.model.id+"."+_3.id+".modelUrl");
_5.href=_4;
};
this.model.addListener("modelSaved",this.saveLink,this);
}

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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectTimeFrame(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setFirstFrame=function(_3){
this.model.setParam("stopLoop");
this.model.setParam("firstFrame",_3);
};
this.setLastFrame=function(_4){
var _5=this.model.timestampList;
if(_4>_5.firstFrame){
_5.lastFrame=_4;
}else{
alert("last frame must be after the first frame");
}
this.model.setParam("stopLoop");
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function ServiceRegistryList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.submitForm=function(){
alert("submitForm");
var _3=this.webServiceForm.action+"?";
for(var i=0;i<this.webServiceForm.elements.length;++i){
var _5=this.webServiceForm.elements[i];
_3+=_5.name+"="+_5.value+"&";
}
alert(_3);
config.loadModel(this.targetModel.id,_3);
};
this.postPaint=function(_6){
_6.webServiceForm=document.getElementById(_6.formName);
};
this.formName="WebServiceForm_";
this.stylesheet.setParameter("formName",this.formName);
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function TabbedContent(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.selectedTab=null;
this.tabList=new Array();
this.textNodeXpath="/mb:WidgetText/mb:widgets/mb:TabbedContent";
this.initTabs=function(_3){
var _4=_3.widgetNode.selectNodes("mb:tab");
for(var i=0;i<_4.length;++i){
var _6=_4[i];
var _7=_6.firstChild.nodeValue;
var _8=config.objects[_7];
if(!_8){
alert("tab widget not found:"+_7);
return;
}
_3.tabList.push(_8);
var _9=_6.getAttribute("label");
if(!_9){
_9=_7;
}
var _a=config.widgetText.selectSingleNode(_3.textNodeXpath+"/mb:"+_7);
if(_a){
_9=_a.firstChild.nodeValue;
}
_6.setAttribute("label",_9);
_8.model.addListener("refresh",_3.paint,_3);
_8.model.addListener("refresh",_3.selectTab,_8);
}
};
this.model.addListener("init",this.initTabs,this);
this.addWidget=function(_b,_c){
this.tabList.push(_b);
if(!_c){
_c=_b.id;
}
var _d=config.widgetText.selectSingleNode(this.textNodeXpath+"/mb:"+_b.id);
if(_d){
_c=_d.firstChild.nodeValue;
}
var _e=this.model.doc.createElementNS(mbNS,"tab");
_e.appendChild(this.model.doc.createTextNode(_b.id));
_e.setAttribute("label",_c);
this.widgetNode.appendChild(_e);
this.paint(this);
this.selectTab(_b);
};
this.selectTab=function(_f){
if(!_f.model.doc){
alert("no data to show yet");
return;
}
var _10=config.objects[_f.tabBarId];
if(_10.selectedTab!=null){
_10.selectedTab.className="";
}
var _11=document.getElementById(_10.id+"_"+_f.id);
if(_11){
_11.className="current";
_10.selectedTab=_11;
_f.paint(_f,_f.id);
}
};
this.prePaint=function(_12){
_12.resultDoc=_12.widgetNode;
for(var i=0;i<_12.tabList.length;++i){
var _14=_12.tabList[i];
_14.tabBarId=this.id;
var _15=_12.resultDoc.selectSingleNode("mb:tab[text()='"+_14.id+"']");
if(!_14.model.doc){
_15.setAttribute("disabled","true");
}else{
_15.removeAttribute("disabled");
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function TimeSeries(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
this.hiddenListener=function(_3,_4){
var _5="visible";
if(_3.model.getHidden(_4)=="1"){
_5="hidden";
}
var _6=_3.model.id+"_"+_3.id+"_"+_4;
if(_3.model.timestampList&&_3.model.timestampList.getAttribute("layerName")==_4){
var _7=_3.model.getParam("timestamp");
var _8=_3.model.timestampList.childNodes[_7];
_6+="_"+_8.firstChild.nodeValue;
}
var _9=document.getElementById(_6);
if(_9){
_9.style.visibility=_5;
}else{
alert("error finding layerId:"+_6);
}
};
this.model.addListener("hidden",this.hiddenListener,this);
this.timestampListener=function(_a,_b){
var _c=_a.model.timestampList.getAttribute("layerName");
var _d=_a.model.timestampList.childNodes[_b];
var _e=(_d.getAttribute("current")=="1")?"visible":"hidden";
var _f=_a.model.id+"_"+_a.id+"_"+_c+"_"+_d.firstChild.nodeValue;
var _10=document.getElementById(_f);
if(_10){
_10.style.visibility=_e;
}else{
alert("error finding layerId:"+_f);
}
};
this.model.addListener("timestamp",this.timestampListener,this);
this.prePaint=function(_11){
var _12="";
var _13=_11.model.timestampList;
if(_13){
for(var i=_11.model.getParam("firstFrame");i<=_11.model.getParam("lastFrame");++i){
_12+=_13.childNodes[i].firstChild.nodeValue+",";
}
_11.stylesheet.setParameter("timeList",_12.substring(0,_12.length-1));
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Timestamp(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.updateTimestamp=function(_3,_4){
var _5=document.getElementById("timestampValue");
_5.value=_3.model.timestampList.childNodes[_4].firstChild.nodeValue;
};
this.model.addListener("timestamp",this.updateTimestamp,this);
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
overlib(_12,CAPTION,"Caption",STICKY,WIDTH,"225",HEIGHT,"200",REFC,"UR",REFP,"LL",RELX,x,RELY,y);
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function TransactionResponse(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/util/dojo/src/uuid/TimeBasedGenerator.js");
function WebServiceForm(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.formElements=new Object();
var _3=_1.selectSingleNode("mb:requestStylesheet");
if(_3){
this.requestStylesheet=new XslProcessor(_3.firstChild.nodeValue,_2.namespace);
}
var _4=_1.selectSingleNode("mb:webServiceUrl");
if(_4){
this.webServiceUrl=_4.firstChild.nodeValue;
}
this.submitForm=function(){
this.webServiceForm=document.getElementById(this.formName);
if(this.webServiceForm==null){
this.webServiceForm=document.getElementById("webServiceForm_form");
}
if(this.webServiceForm==null){
return;
}
var _5=new Object();
_5.method=this.targetModel.method;
_5.url=this.webServiceUrl;
if(_5.method.toLowerCase()=="get"){
_5.url=this.webServiceForm.action+"?";
for(var i=0;i<this.webServiceForm.elements.length;++i){
var _7=this.webServiceForm.elements[i];
_4+=_7.name+"="+_7.value+"&";
this.formElements[_7.name]=_7.value;
}
if(this.debug){
alert(_5.url);
}
this.targetModel.newRequest(this.targetModel,_5);
}else{
for(var i=0;i<this.webServiceForm.elements.length;++i){
var _7=this.webServiceForm.elements[i];
this.formElements[_7.name]=_7.value;
}
this.requestStylesheet.setParameter("resourceName",this.formElements["feature"]);
this.requestStylesheet.setParameter("fromDateField",this.formElements["fromDateField"]);
this.requestStylesheet.setParameter("toDateField",this.formElements["toDateField"]);
var _8=this.requestStylesheet.transformNodeToObject(this.model.doc);
this.namespace="xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
Sarissa.setXpathNamespaces(_8,this.namespace);
var _9=_8.selectSingleNode("//wfs:GetFeature");
_5.postData=Sarissa.serialize(_9);
if(this.debug){
alert("httpPayload.postData:"+_5.postData);
}
this.targetModel.wfsFeature=_8.childNodes[0];
this.targetModel.newRequest(this.targetModel,_5);
}
};
this.handleKeyPress=function(_a){
var _b;
var _c;
if(_a){
_b=_a.which;
_c=_a.currentTarget;
}else{
_b=window.event.keyCode;
_c=window.event.srcElement.form;
}
if(_b==13){
_c.parentWidget.submitForm();
return false;
}
};
this.postPaint=function(_d){
_d.webServiceForm=document.getElementById(_d.formName);
if(this.webServiceForm==null){
this.webServiceForm=document.getElementById("webServiceForm_form");
}
_d.webServiceForm.parentWidget=_d;
_d.webServiceForm.onkeypress=_d.handleKeyPress;
};
this.formName="WebServiceForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
this.prePaint=function(_e){
for(var _f in _e.formElements){
_e.stylesheet.setParameter(_f,_e.formElements[_f]);
}
};
this.setAoiParameters=function(_10,_11){
if(_10.targetModel.containerModel){
var _12=null;
var _13="EPSG:4326";
_10.requestStylesheet.setParameter("bBoxMinX",_11[0][0]);
_10.requestStylesheet.setParameter("bBoxMinY",_11[1][1]);
_10.requestStylesheet.setParameter("bBoxMaxX",_11[1][0]);
_10.requestStylesheet.setParameter("bBoxMaxY",_11[0][1]);
_10.requestStylesheet.setParameter("srs",_13);
_10.requestStylesheet.setParameter("width",_10.targetModel.containerModel.getWindowWidth());
_10.requestStylesheet.setParameter("height",_10.targetModel.containerModel.getWindowHeight());
}
};
this.init=function(_14){
if(_14.targetModel.containerModel){
_14.targetModel.containerModel.addListener("aoi",_14.setAoiParameters,_14);
}
};
this.model.addListener("init",this.init,this);
}

mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");
function WfsGetFeature(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.tolerance=_1.selectSingleNode("mb:tolerance").firstChild.nodeValue;
this.typeName=_1.selectSingleNode("mb:typeName").firstChild.nodeValue;
this.webServiceUrl=_1.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
this.httpPayload=new Object();
this.httpPayload.method="get";
this.httpPayload.postData=null;
this.trm=_1.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
this.cursor="pointer";
this.doAction=function(_3,_4){
if(_3.enabled){
extent=_3.targetModel.extent;
point=extent.getXY(_4.evpl);
xPixel=extent.res[0]*_3.tolerance;
yPixel=extent.res[1]*_3.tolerance;
bbox=(point[0]-xPixel)+","+(point[1]-yPixel)+","+(point[0]+xPixel)+","+(point[1]+yPixel);
_3.httpPayload.url=_3.webServiceUrl+"?request=GetFeature&typeName="+_3.typeName+"&bbox="+bbox;
if(!_3.transactionResponseModel){
_3.transactionResponseModel=window.config.objects[_3.trm];
}
_3.transactionResponseModel.newRequest(_3.transactionResponseModel,_3.httpPayload);
}
};
this.setMouseListener=function(_5){
if(_5.mouseHandler){
_5.mouseHandler.model.addListener("mouseup",_5.doAction,_5);
}
_5.context=_5.widgetNode.selectSingleNode("mb:context");
if(_5.context){
_5.context=window.config.objects[_5.context.firstChild.nodeValue];
}
};
config.addListener("loadModel",this.setMouseListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Widget(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
_6.targetModel=window.config.objects[_7.firstChild.nodeValue];
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function WidgetBaseWZ(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
if(!widget.stylesheet){
var _3=_1.selectSingleNode("mb:stylesheet");
if(_3){
widget.stylesheet=new XslProcessor(_3.firstChild.nodeValue,_2.namespace);
}else{
widget.stylesheet=new XslProcessor(baseDir+"/widget/"+_1.nodeName+".xsl",_2.namespace);
}
}
for(var j=0;j<_1.childNodes.length;j++){
if(_1.childNodes[j].firstChild&&_1.childNodes[j].firstChild.nodeValue){
widget.stylesheet.setParameter(_1.childNodes[j].nodeName,_1.childNodes[j].firstChild.nodeValue);
}
}
if(config.widgetText){
var _5="/mb:WidgetText/mb:widgets/mb:"+_1.nodeName;
var _6=config.widgetText.selectNodes(_5+"/*");
for(var j=0;j<_6.length;j++){
widget.stylesheet.setParameter(_6[j].nodeName,_6[j].firstChild.nodeValue);
}
}
widget.stylesheet.setParameter("modelId",widget.model.id);
widget.stylesheet.setParameter("modelTitle",widget.model.title);
widget.stylesheet.setParameter("widgetId",widget.id);
widget.stylesheet.setParameter("skinDir",config.skinDir);
widget.stylesheet.setParameter("lang",config.lang);
this.paint=function(_7){
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
var _8=document.getElementById(_7.outputNodeId);
var _9=document.createElement("DIV");
var s=_7.stylesheet.transformNodeToString(_7.resultDoc);
if(config.serializeUrl&&_7.debug){
postLoad(config.serializeUrl,s);
}
if(_7.debug){
alert("painting:"+_7.id+":"+s);
}
_9.innerHTML=s;
_9.firstChild.setAttribute("id",_7.outputNodeId);
if(_8){
_7.node.replaceChild(_9.firstChild,_8);
}else{
_7.node.appendChild(_9.firstChild);
}
_7.postPaint(_7);
}
};
this.clearWidget=function(_b){
var _c=document.getElementById(_b.outputNodeId);
if(_c){
_b.node.removeChild(_c);
}
};
widget.model.addListener("refresh",widget.paint,widget);
widget.model.addListener("newModel",widget.clearWidget,widget);
}

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

function WktParser(){
this.parse=function(_1){
geomTypeExp=/(\D+)\(([^)]+)\)/;
pointExp=/(-?[0-9]+\.[0-9]+)\s+(-?[0-9]+\.[0-9]+)/;
ringExp=/\(([^)]+)\)/;
if(match=geomTypeExp.exec(_1)){
switch(match[1]){
case "POINT":
if(pt=pointExp.exec(match[2])){
out="<gml:Point><gml:coordinates decimal=\".\" cs=\",\" ts=\" \"><gml:coord>"+pt[1]+","+pt[2]+"</gml:coord></gml:coordinates></gml:Point>";
}
break;
case "LINESTRING":
out="<gml:Linestring><gml:coordinates decimal=\".\" cs=\",\" ts=\" \">";
while(pt=pointExp.exec(match[2])){
out+="<gml:coord>"+pt[1]+","+pt[2]+"</gml:coord>";
match[2]=match[2].replace(pt[0],"");
}
out+="</gml:coordinates></gml:Linestring>";
break;
}
}
return out;
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function WmsCapabilitiesImport(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.onKeyPress=function(e){
var _4;
var _5;
if(e.which){
_5=e.which;
_4=e.currentTarget.value;
}else{
_5=window.event.keyCode;
_4=window.event.srcElement.value;
}
if(_5==13){
capabilities=Sarissa.getDomDocument();
capabilities.async=false;
capabilities.load(_4);
alert("capabilities="+capabilities.xml);
xsl=Sarissa.getDomDocument();
xsl.async=false;
xsl.load(baseDir+"/widget/wms/WMSCapabilities2Context.xsl");
alert("xsl="+xsl.xml);
context=Sarissa.getDomDocument();
capabilities.transformNodeToObject(xsl,context);
alert("context="+context.xml);
this.model.loadModelNode(context);
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function ZoomOut(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.zoomFactor=4;
var _3=_1.selectSingleNode("mb:zoomFactor");
if(_3){
this.zoomFactor=_3.firstChild.nodeValue;
}
this.doAction=function(_4,_5){
if(!_4.enabled){
return;
}
var _6=_4.targetModel.getParam("aoi");
var _7=_4.targetModel.extent;
var _8=_7.res[0]*_4.zoomFactor;
_7.centerAt(_6[0],_8);
};
this.setMouseListener=function(_9){
if(_9.mouseHandler){
_9.mouseHandler.model.addListener("mouseup",_9.doAction,_9);
}
};
this.model.addListener("loadModel",this.setMouseListener,this);
}

function OlsRespons(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.point=new Boolean;
this.zoom=new Boolean;
if(!this.namespace){
this.namespace="xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemalocation='http://www.opengis.net/xls' xmlns:xls='http://www.opengis.net/xls' xmlns:gml='http://www.opengis.net/gml'";
}
this.getNumberOfResponses=function(){
var _3="/xls:GeocodeResponse/xls:GeocodeResponseList";
return this.doc.selectSingleNode(_3).getAttribute("numberOfGeocodedAddresses");
};
this.getListOfResponses=function(){
var _4="/xls:GeocodeResponse/xls:GeocodeResponseList";
return this.doc.selectNodes(_4);
};
this.getStreet=function(_5){
};
this.getCoordinates=function(_6){
var _7="gml:Point/pos";
var _8=featureNode.selectSingleNode(_7);
if(_8){
var _9=_8.firstChild.nodeValue.split(" ");
return _9;
}else{
return new Array(0,0);
}
};
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function EditContext(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
var _3=baseDir+"/tool/xsl/wmc_AddResource.xsl";
this.stylesheet=new XslProcessor(_3);
for(var j=0;j<_1.childNodes.length;j++){
if(_1.childNodes[j].firstChild&&_1.childNodes[j].firstChild.nodeValue){
this.stylesheet.setParameter(_1.childNodes[j].nodeName,_1.childNodes[j].firstChild.nodeValue);
}
}
this.addNodeToModel=function(_5){
if(this.targetModel.getLayer(_5)){
alert("U heeft deze laag al toegevoegd.");
}else{
var _6=this.model.getFeatureNode(_5);
this.stylesheet.setParameter("version",this.model.getVersion());
this.stylesheet.setParameter("serverUrl",this.model.getServerUrl("GetMap","get"));
this.stylesheet.setParameter("serverTitle",this.model.getServerTitle());
this.stylesheet.setParameter("serviceName","wms");
this.stylesheet.setParameter("format",this.model.getImageFormat());
var _7=this.stylesheet.transformNodeToObject(_6);
Sarissa.setXpathNamespaces(_7,this.targetModel.namespace);
if(this.debug){
alert(_7.xml);
}
this.targetModel.setParam("addLayer",_7.documentElement);
}
};
this.addLayerFromCat=function(_8){
var _9=this.model.getFeatureNode(_8);
var _a=this.stylesheet.transformNodeToObject(_9);
Sarissa.setXpathNamespaces(_a,this.targetModel.namespace);
if(this.debug){
alert(_a.xml);
}
this.targetModel.setParam("addLayer",_a.documentElement);
};
this.moveNode=function(_b,_c){
};
this.model.addListener("MoveNode",this.addNodeToModel,this);
this.deleteNode=function(_d,_e){
};
this.model.addListener("DeleteNode",this.addNodeToModel,this);
}

var jg_ihtm,jg_ie,jg_fast,jg_dom,jg_moz,jg_n4=(document.layers&&typeof document.classes!="undefined");
function chkDHTM(x,i){
x=document.body||null;
jg_ie=x&&typeof x.insertAdjacentHTML!="undefined";
jg_dom=(x&&!jg_ie&&typeof x.appendChild!="undefined"&&typeof document.createRange!="undefined"&&typeof (i=document.createRange()).setStartBefore!="undefined"&&typeof i.createContextualFragment!="undefined");
jg_ihtm=!jg_ie&&!jg_dom&&x&&typeof x.innerHTML!="undefined";
jg_fast=jg_ie&&document.all&&!window.opera;
jg_moz=jg_dom&&typeof x.style.MozOpacity!="undefined";
}
function pntDoc(){
this.wnd.document.write(jg_fast?this.htmRpc():this.htm);
this.htm="";
}
function pntCnvDom(){
var x=document.createRange();
x.setStartBefore(this.cnv);
x=x.createContextualFragment(jg_fast?this.htmRpc():this.htm);
this.cnv.appendChild(x);
this.htm="";
}
function pntCnvIe(){
this.cnv.insertAdjacentHTML("beforeEnd",jg_fast?this.htmRpc():this.htm);
this.htm="";
}
function pntCnvIhtm(){
this.cnv.innerHTML+=this.htm;
this.htm="";
}
function pntCnv(){
this.htm="";
}
function mkDiv(x,y,w,h){
this.htm+="<div style=\"position:absolute;"+"left:"+x+"px;"+"top:"+y+"px;"+"width:"+w+"px;"+"height:"+h+"px;"+"clip:rect(0,"+w+"px,"+h+"px,0);"+"background-color:"+this.color+(!jg_moz?";overflow:hidden":"")+";\"></div>";
}
function mkDivIe(x,y,w,h){
this.htm+="%%"+this.color+";"+x+";"+y+";"+w+";"+h+";";
}
function mkDivPrt(x,y,w,h){
this.htm+="<div style=\"position:absolute;"+"border-left:"+w+"px solid "+this.color+";"+"left:"+x+"px;"+"top:"+y+"px;"+"width:0px;"+"height:"+h+"px;"+"clip:rect(0,"+w+"px,"+h+"px,0);"+"background-color:"+this.color+(!jg_moz?";overflow:hidden":"")+";\"></div>";
}
function mkLyr(x,y,w,h){
this.htm+="<layer "+"left=\""+x+"\" "+"top=\""+y+"\" "+"width=\""+w+"\" "+"height=\""+h+"\" "+"bgcolor=\""+this.color+"\"></layer>\n";
}
var regex=/%%([^;]+);([^;]+);([^;]+);([^;]+);([^;]+);/g;
function htmRpc(){
return this.htm.replace(regex,"<div style=\"overflow:hidden;position:absolute;background-color:"+"$1;left:$2;top:$3;width:$4;height:$5\"></div>\n");
}
function htmPrtRpc(){
return this.htm.replace(regex,"<div style=\"overflow:hidden;position:absolute;background-color:"+"$1;left:$2;top:$3;width:$4;height:$5;border-left:$4px solid $1\"></div>\n");
}
function mkLin(x1,y1,x2,y2){
if(x1>x2){
var _x2=x2;
var _y2=y2;
x2=x1;
y2=y1;
x1=_x2;
y1=_y2;
}
var dx=x2-x1,dy=Math.abs(y2-y1),x=x1,y=y1,yIncr=(y1>y2)?-1:1;
if(dx>=dy){
var pr=dy<<1,pru=pr-(dx<<1),p=pr-dx,ox=x;
while((dx--)>0){
++x;
if(p>0){
this.mkDiv(ox,y,x-ox,1);
y+=yIncr;
p+=pru;
ox=x;
}else{
p+=pr;
}
}
this.mkDiv(ox,y,x2-ox+1,1);
}else{
var pr=dx<<1,pru=pr-(dy<<1),p=pr-dy,oy=y;
if(y2<=y1){
while((dy--)>0){
if(p>0){
this.mkDiv(x++,y,1,oy-y+1);
y+=yIncr;
p+=pru;
oy=y;
}else{
y+=yIncr;
p+=pr;
}
}
this.mkDiv(x2,y2,1,oy-y2+1);
}else{
while((dy--)>0){
y+=yIncr;
if(p>0){
this.mkDiv(x++,oy,1,y-oy);
p+=pru;
oy=y;
}else{
p+=pr;
}
}
this.mkDiv(x2,oy,1,y2-oy+1);
}
}
}
function mkLinDott_Img(x1,y1,x2,y2){
image="../customlib/skin/default/images/ruler_pix.gif";
var _20=6;
var _21=1;
var dx=Math.abs(x2-x1),dy=Math.abs(y2-y1);
var x=x1-(_20/2),y=y1-(_20/2);
var _24=(y1>y2)?-1:1;
var _25=(x1>x2)?-1:1;
var c=Math.sqrt((dx*dx)+(dy*dy));
var _27=(c/(_20+(_20*_21)))-1;
var _28=(c/_27);
if(dx==0&&dy==0){
}else{
if(dx!=0&&dy!=0){
var _29=Math.atan(dy/dx);
var _2a=_24*(_28*Math.sin(_29));
var _2b=_25*(_28*Math.cos(_29));
}
if(dx==0&&dy!=0){
var _2a=_24*(dy/_28);
var _2b=0;
}
if(dy==0&&dx!=0){
var _2a=0;
var _2b=_25*(dx/_28);
}
this.drawImage(image,Math.round(x),Math.round(y),_20,_20);
for(i=1;i<_27;i++){
x+=_2b;
y+=_2a;
this.drawImage(image,Math.round(x),Math.round(y),_20,_20);
}
this.drawImage(image,x2-(_20/2),y2-(_20/2),_20,_20);
}
}
function mkLinDott_Img2(x1,y1,x2,y2){
image="../customlib/skin/default/images/ruler_pix.gif";
var _30=6;
var _31=1;
var dx=Math.abs(x2-x1),dy=Math.abs(y2-y1);
var x=x1-(_30/2),y=y1-(_30/2);
var _34=(y1>y2)?-1:1;
var _35=(x1>x2)?-1:1;
var c=Math.sqrt((dx*dx)+(dy*dy));
var _37=(c/4);
if(dx==0&&dy==0){
}else{
if(dx!=0&&dy!=0){
var _38=Math.atan(dy/dx);
var _39=_34*(_37*Math.sin(_38));
var _3a=_35*(_37*Math.cos(_38));
}
if(dx==0&&dy!=0){
var _39=_34*(dy/_37);
var _3a=0;
}
if(dx!=0&&dy==0){
var _39=0;
var _3a=_35*(dx/_37);
}
this.drawImage(image,Math.round(x),Math.round(y),_30,_30);
for(i=1;i<4;i++){
x+=_3a;
y+=_39;
this.drawImage(image,Math.round(x),Math.round(y),_30,_30);
}
this.drawImage(image,x2-(_30/2),y2-(_30/2),_30,_30);
}
}
function mkLin2D(x1,y1,x2,y2){
if(x1>x2){
var _x2=x2;
var _y2=y2;
x2=x1;
y2=y1;
x1=_x2;
y1=_y2;
}
var dx=x2-x1,dy=Math.abs(y2-y1),x=x1,y=y1,yIncr=(y1>y2)?-1:1;
var s=this.stroke;
if(dx>=dy){
if(s-3>0){
var _s=(s*dx*Math.sqrt(1+dy*dy/(dx*dx))-dx-(s>>1)*dy)/dx;
_s=(!(s-4)?Math.ceil(_s):Math.round(_s))+1;
}else{
var _s=s;
}
var ad=Math.ceil(s/2);
var pr=dy<<1,pru=pr-(dx<<1),p=pr-dx,ox=x;
while((dx--)>0){
++x;
if(p>0){
this.mkDiv(ox,y,x-ox+ad,_s);
y+=yIncr;
p+=pru;
ox=x;
}else{
p+=pr;
}
}
this.mkDiv(ox,y,x2-ox+ad+1,_s);
}else{
if(s-3>0){
var _s=(s*dy*Math.sqrt(1+dx*dx/(dy*dy))-(s>>1)*dx-dy)/dy;
_s=(!(s-4)?Math.ceil(_s):Math.round(_s))+1;
}else{
var _s=s;
}
var ad=Math.round(s/2);
var pr=dx<<1,pru=pr-(dy<<1),p=pr-dy,oy=y;
if(y2<=y1){
++ad;
while((dy--)>0){
if(p>0){
this.mkDiv(x++,y,_s,oy-y+ad);
y+=yIncr;
p+=pru;
oy=y;
}else{
y+=yIncr;
p+=pr;
}
}
this.mkDiv(x2,y2,_s,oy-y2+ad);
}else{
while((dy--)>0){
y+=yIncr;
if(p>0){
this.mkDiv(x++,oy,_s,y-oy+ad);
p+=pru;
oy=y;
}else{
p+=pr;
}
}
this.mkDiv(x2,oy,_s,y2-oy+ad+1);
}
}
}
function mkLinDott(x1,y1,x2,y2){
if(x1>x2){
var _x2=x2;
var _y2=y2;
x2=x1;
y2=y1;
x1=_x2;
y1=_y2;
}
var dx=x2-x1,dy=Math.abs(y2-y1),x=x1,y=y1,yIncr=(y1>y2)?-1:1,drw=true;
if(dx>=dy){
var pr=dy<<1,pru=pr-(dx<<1),p=pr-dx;
while((dx--)>0){
if(drw){
this.mkDiv(x,y,1,1);
}
drw=!drw;
if(p>0){
y+=yIncr;
p+=pru;
}else{
p+=pr;
}
++x;
}
if(drw){
this.mkDiv(x,y,1,1);
}
}else{
var pr=dx<<1,pru=pr-(dy<<1),p=pr-dy;
while((dy--)>0){
if(drw){
this.mkDiv(x,y,1,1);
}
drw=!drw;
y+=yIncr;
if(p>0){
++x;
p+=pru;
}else{
p+=pr;
}
}
if(drw){
this.mkDiv(x,y,1,1);
}
}
}
function mkOv(_4e,top,_50,_51){
var a=_50>>1,b=_51>>1,wod=_50&1,hod=(_51&1)+1,cx=_4e+a,cy=top+b,x=0,y=b,ox=0,oy=b,aa=(a*a)<<1,bb=(b*b)<<1,st=(aa>>1)*(1-(b<<1))+bb,tt=(bb>>1)-aa*((b<<1)-1),w,h;
while(y>0){
if(st<0){
st+=bb*((x<<1)+3);
tt+=(bb<<1)*(++x);
}else{
if(tt<0){
st+=bb*((x<<1)+3)-(aa<<1)*(y-1);
tt+=(bb<<1)*(++x)-aa*(((y--)<<1)-3);
w=x-ox;
h=oy-y;
if(w&2&&h&2){
this.mkOvQds(cx,cy,-x+2,ox+wod,-oy,oy-1+hod,1,1);
this.mkOvQds(cx,cy,-x+1,x-1+wod,-y-1,y+hod,1,1);
}else{
this.mkOvQds(cx,cy,-x+1,ox+wod,-oy,oy-h+hod,w,h);
}
ox=x;
oy=y;
}else{
tt-=aa*((y<<1)-3);
st-=(aa<<1)*(--y);
}
}
}
this.mkDiv(cx-a,cy-oy,a-ox+1,(oy<<1)+hod);
this.mkDiv(cx+ox+wod,cy-oy,a-ox+1,(oy<<1)+hod);
}
function mkOv2D(_53,top,_55,_56){
var s=this.stroke;
_55+=s-1;
_56+=s-1;
var a=_55>>1,b=_56>>1,wod=_55&1,hod=(_56&1)+1,cx=_53+a,cy=top+b,x=0,y=b,aa=(a*a)<<1,bb=(b*b)<<1,st=(aa>>1)*(1-(b<<1))+bb,tt=(bb>>1)-aa*((b<<1)-1);
if(s-4<0&&(!(s-2)||_55-51>0&&_56-51>0)){
var ox=0,oy=b,w,h,pxl,pxr,pxt,pxb,pxw;
while(y>0){
if(st<0){
st+=bb*((x<<1)+3);
tt+=(bb<<1)*(++x);
}else{
if(tt<0){
st+=bb*((x<<1)+3)-(aa<<1)*(y-1);
tt+=(bb<<1)*(++x)-aa*(((y--)<<1)-3);
w=x-ox;
h=oy-y;
if(w-1){
pxw=w+1+(s&1);
h=s;
}else{
if(h-1){
pxw=s;
h+=1+(s&1);
}else{
pxw=h=s;
}
}
this.mkOvQds(cx,cy,-x+1,ox-pxw+w+wod,-oy,-h+oy+hod,pxw,h);
ox=x;
oy=y;
}else{
tt-=aa*((y<<1)-3);
st-=(aa<<1)*(--y);
}
}
}
this.mkDiv(cx-a,cy-oy,s,(oy<<1)+hod);
this.mkDiv(cx+a+wod-s+1,cy-oy,s,(oy<<1)+hod);
}else{
var _a=(_55-((s-1)<<1))>>1,_b=(_56-((s-1)<<1))>>1,_x=0,_y=_b,_aa=(_a*_a)<<1,_bb=(_b*_b)<<1,_st=(_aa>>1)*(1-(_b<<1))+_bb,_tt=(_bb>>1)-_aa*((_b<<1)-1),pxl=new Array(),pxt=new Array(),_pxb=new Array();
pxl[0]=0;
pxt[0]=b;
_pxb[0]=_b-1;
while(y>0){
if(st<0){
st+=bb*((x<<1)+3);
tt+=(bb<<1)*(++x);
pxl[pxl.length]=x;
pxt[pxt.length]=y;
}else{
if(tt<0){
st+=bb*((x<<1)+3)-(aa<<1)*(y-1);
tt+=(bb<<1)*(++x)-aa*(((y--)<<1)-3);
pxl[pxl.length]=x;
pxt[pxt.length]=y;
}else{
tt-=aa*((y<<1)-3);
st-=(aa<<1)*(--y);
}
}
if(_y>0){
if(_st<0){
_st+=_bb*((_x<<1)+3);
_tt+=(_bb<<1)*(++_x);
_pxb[_pxb.length]=_y-1;
}else{
if(_tt<0){
_st+=_bb*((_x<<1)+3)-(_aa<<1)*(_y-1);
_tt+=(_bb<<1)*(++_x)-_aa*(((_y--)<<1)-3);
_pxb[_pxb.length]=_y-1;
}else{
_tt-=_aa*((_y<<1)-3);
_st-=(_aa<<1)*(--_y);
_pxb[_pxb.length-1]--;
}
}
}
}
var ox=0,oy=b,_oy=_pxb[0],l=pxl.length,w,h;
for(var i=0;i<l;i++){
if(typeof _pxb[i]!="undefined"){
if(_pxb[i]<_oy||pxt[i]<oy){
x=pxl[i];
this.mkOvQds(cx,cy,-x+1,ox+wod,-oy,_oy+hod,x-ox,oy-_oy);
ox=x;
oy=pxt[i];
_oy=_pxb[i];
}
}else{
x=pxl[i];
this.mkDiv(cx-x+1,cy-oy,1,(oy<<1)+hod);
this.mkDiv(cx+ox+wod,cy-oy,1,(oy<<1)+hod);
ox=x;
oy=pxt[i];
}
}
this.mkDiv(cx-a,cy-oy,1,(oy<<1)+hod);
this.mkDiv(cx+ox+wod,cy-oy,1,(oy<<1)+hod);
}
}
function mkOvDott(_5c,top,_5e,_5f){
var a=_5e>>1,b=_5f>>1,wod=_5e&1,hod=_5f&1,cx=_5c+a,cy=top+b,x=0,y=b,aa2=(a*a)<<1,aa4=aa2<<1,bb=(b*b)<<1,st=(aa2>>1)*(1-(b<<1))+bb,tt=(bb>>1)-aa2*((b<<1)-1),drw=true;
while(y>0){
if(st<0){
st+=bb*((x<<1)+3);
tt+=(bb<<1)*(++x);
}else{
if(tt<0){
st+=bb*((x<<1)+3)-aa4*(y-1);
tt+=(bb<<1)*(++x)-aa2*(((y--)<<1)-3);
}else{
tt-=aa2*((y<<1)-3);
st-=aa4*(--y);
}
}
if(drw){
this.mkOvQds(cx,cy,-x,x+wod,-y,y+hod,1,1);
}
drw=!drw;
}
}
function mkRect(x,y,w,h){
var s=this.stroke;
this.mkDiv(x,y,w,s);
this.mkDiv(x+w,y,s,h);
this.mkDiv(x,y+h,w+s,s);
this.mkDiv(x,y+s,s,h-s);
}
function mkRectDott(x,y,w,h){
this.drawLine(x,y,x+w,y);
this.drawLine(x+w,y,x+w,y+h);
this.drawLine(x,y+h,x+w,y+h);
this.drawLine(x,y,x,y+h);
}
function jsgFont(){
this.PLAIN="font-weight:normal;";
this.BOLD="font-weight:bold;";
this.ITALIC="font-style:italic;";
this.ITALIC_BOLD=this.ITALIC+this.BOLD;
this.BOLD_ITALIC=this.ITALIC_BOLD;
}
var Font=new jsgFont();
function jsgStroke(){
this.DOTTED=-1;
}
var Stroke=new jsgStroke();
function jsGraphics(id,wnd){
this.setColor=new Function("arg","this.color = arg.toLowerCase();");
this.setStroke=function(x){
this.stroke=x;
if(!(x+1)){
this.drawLine=mkLinDott;
this.mkOv=mkOvDott;
this.drawRect=mkRectDott;
}else{
if(x-1>0){
this.drawLine=mkLin2D;
this.mkOv=mkOv2D;
this.drawRect=mkRect;
this.drawMouseLine=mkLinDott_Img2;
}else{
if(x-1<0){
this.drawLine=mkLinDott_Img;
this.mkOv=mkOv;
this.drawRect=mkRect;
this.drawMouseLine=mkLinDott_Img2;
}else{
this.drawLine=mkLin;
this.mkOv=mkOv;
this.drawRect=mkRect;
this.drawMouseLine=mkLinDott_Img2;
}
}
}
};
this.setPrintable=function(arg){
this.printable=arg;
if(jg_fast){
this.mkDiv=mkDivIe;
this.htmRpc=arg?htmPrtRpc:htmRpc;
}else{
this.mkDiv=jg_n4?mkLyr:arg?mkDivPrt:mkDiv;
}
};
this.setFont=function(fam,sz,sty){
this.ftFam=fam;
this.ftSz=sz;
this.ftSty=sty||Font.PLAIN;
};
this.drawPolyline=this.drawPolyLine=function(x,y,s){
for(var i=0;i<x.length-1;i++){
this.drawLine(x[i],y[i],x[i+1],y[i+1]);
}
};
this.fillRect=function(x,y,w,h){
x=x-0.5*w;
y=y-0.5*h;
this.drawImage("../customlib/skin/default/images/prikker-paars.gif",x,y,w,h);
};
this.drawPolygon=function(x,y){
this.drawPolyline(x,y);
this.drawLine(x[x.length-1],y[x.length-1],x[0],y[0]);
};
this.drawEllipse=this.drawOval=function(x,y,w,h){
this.mkOv(x,y,w,h);
};
this.fillEllipse=this.fillOval=function(_7f,top,w,h){
var a=(w-=1)>>1,b=(h-=1)>>1,wod=(w&1)+1,hod=(h&1)+1,cx=_7f+a,cy=top+b,x=0,y=b,ox=0,oy=b,aa2=(a*a)<<1,aa4=aa2<<1,bb=(b*b)<<1,st=(aa2>>1)*(1-(b<<1))+bb,tt=(bb>>1)-aa2*((b<<1)-1),pxl,dw,dh;
if(w+1){
while(y>0){
if(st<0){
st+=bb*((x<<1)+3);
tt+=(bb<<1)*(++x);
}else{
if(tt<0){
st+=bb*((x<<1)+3)-aa4*(y-1);
pxl=cx-x;
dw=(x<<1)+wod;
tt+=(bb<<1)*(++x)-aa2*(((y--)<<1)-3);
dh=oy-y;
this.mkDiv(pxl,cy-oy,dw,dh);
this.mkDiv(pxl,cy+oy-dh+hod,dw,dh);
ox=x;
oy=y;
}else{
tt-=aa2*((y<<1)-3);
st-=aa4*(--y);
}
}
}
}
this.mkDiv(cx-a,cy-oy,w+1,(oy<<1)+hod);
};
this.fillPolygon=function(_84,_85){
var i;
var y;
var _88,maxy;
var x1,y1;
var x2,y2;
var _8b,ind2;
var _8c;
var n=_84.length;
if(!n){
return;
}
_88=_85[0];
maxy=_85[0];
for(i=1;i<n;i++){
if(_85[i]<_88){
_88=_85[i];
}
if(_85[i]>maxy){
maxy=_85[i];
}
}
for(y=_88;y<=maxy;y++){
var _8e=new Array();
_8c=0;
for(i=0;i<n;i++){
if(!i){
_8b=n-1;
ind2=0;
}else{
_8b=i-1;
ind2=i;
}
y1=_85[_8b];
y2=_85[ind2];
if(y1<y2){
x1=_84[_8b];
x2=_84[ind2];
}else{
if(y1>y2){
y2=_85[_8b];
y1=_85[ind2];
x2=_84[_8b];
x1=_84[ind2];
}else{
continue;
}
}
if((y>=y1)&&(y<y2)){
_8e[_8c++]=Math.round((y-y1)*(x2-x1)/(y2-y1)+x1);
}else{
if((y==maxy)&&(y>y1)&&(y<=y2)){
_8e[_8c++]=Math.round((y-y1)*(x2-x1)/(y2-y1)+x1);
}
}
}
_8e.sort(integer_compare);
for(i=0;i<_8c;i+=2){
w=_8e[i+1]-_8e[i];
this.mkDiv(_8e[i],y,_8e[i+1]-_8e[i]+1,1);
}
}
};
this.drawString=function(txt,x,y){
this.htm+="<div style=\"position:absolute;white-space:nowrap;"+"left:"+x+"px;"+"top:"+y+"px;"+"font-family:"+this.ftFam+";"+"font-size:"+this.ftSz+";"+"color:"+this.color+";"+this.ftSty+"\">"+txt+"</div>";
};
this.drawImage=function(_92,x,y,w,h){
this.htm+="<div style=\"position:absolute;"+"left:"+x+"px;"+"top:"+y+"px;"+"width:"+w+";"+"height:"+h+";\">"+"<img src=\""+_92+"\" width=\""+w+"\" height=\""+h+"\">"+"</div>";
};
this.clear=function(){
this.htm="";
if(this.cnv){
this.cnv.innerHTML=this.defhtm;
}
};
this.mkOvQds=function(cx,cy,xl,xr,yt,yb,w,h){
this.mkDiv(xr+cx,yt+cy,w,h);
this.mkDiv(xr+cx,yb+cy,w,h);
this.mkDiv(xl+cx,yb+cy,w,h);
this.mkDiv(xl+cx,yt+cy,w,h);
};
this.setStroke(1);
this.setFont("verdana,geneva,helvetica,sans-serif",String.fromCharCode(49,50,112,120),Font.PLAIN);
this.color="#000000";
this.htm="";
this.wnd=wnd||window;
if(!(jg_ie||jg_dom||jg_ihtm)){
chkDHTM();
}
if(typeof id!="string"||!id){
this.paint=pntDoc;
}else{
this.cnv=document.all?(this.wnd.document.all[id]||null):document.getElementById?(this.wnd.document.getElementById(id)||null):null;
this.defhtm=(this.cnv&&this.cnv.innerHTML)?this.cnv.innerHTML:"";
this.paint=jg_dom?pntCnvDom:jg_ie?pntCnvIe:jg_ihtm?pntCnvIhtm:pntCnv;
}
this.setPrintable(false);
}
function integer_compare(x,y){
return (x<y)?-1:((x>y)*1);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/ToggleBox.js");
function AddLayer(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doSelect=function(_3,_4){
if(_3){
toggleBox("geocoder",0);
toggleBox("geoForm",0);
toggleBox("olsResponsView",0);
toggleBox("legend",0);
toggleBox("toevoegen",1);
toggleBox("layerLijst",1);
}
};
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
if(this.buttonType=="State3Button"){
this.state="0";
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
var _6=_1.selectSingleNode("mb:pausedSrc");
if(_6){
this.pausedImage=document.createElement("IMG");
this.pausedImage.src=config.skinDir+_6.firstChild.nodeValue;
}
var _7=this.widgetNode.selectSingleNode("mb:cursor");
if(_7!=null){
var _8=_7.firstChild.nodeValue;
this.cursor=_8;
}else{
this.cursor="default";
}
this.prePaint=function(_9){
_9.resultDoc=_9.widgetNode;
};
this.doAction=function(){
};
this.select=function(){
if(this.buttonType=="RadioButton"){
if(this.node.selectedRadioButton){
if(this.node.selectedRadioButton.buttonType=="State3Button"){
with(this.node.selectedRadioButton){
state="1";
if(_4){
image.src=_4.src;
}
enabled=false;
if(mouseHandler){
mouseHandler.enabled=false;
}
link.className="mbButton";
doSelect(false,this);
this.model.setParam("clearMouseLine");
}
this.enableButton(this);
}else{
this.disableButton(this.node.selectedRadioButton);
this.enableButton(this);
}
}else{
this.enableButton(this);
}
}
if(this.buttonType=="State3Button"){
if(this.node.selectedRadioButton){
if(this.node.selectedRadioButton.buttonType=="State3Button"){
if(this.node.selectedRadioButton.id==this.id){
this.enableButton(this.node.selectedRadioButton);
this.state="1";
this.model.setParam("clearMouseLine");
this.model.setParam("clearMeasurementLine");
}else{
var _a=this.state;
switch(_a){
case "0":
this.state="1";
this.enableButton(this);
this.model.setParam("clearMeasurementLine");
break;
default:
this.enableButton(this);
this.state="1";
this.model.setParam("clearMeasurementLine");
break;
}
}
}else{
this.disableButton(this.node.selectedRadioButton);
var _a=this.state;
switch(_a){
case "0":
this.model.setParam("clearMeasurementLine");
this.state="1";
this.enableButton(this);
break;
default:
this.model.setParam("clearMeasurementLine");
this.enableButton(this);
this.state="1";
break;
}
}
}else{
this.enableButton(this);
}
}else{
this.enabled=true;
if(this.mouseHandler){
this.mouseHandler.enabled=true;
}
this.doSelect(true,this);
}
};
this.enableButton=function(_b){
this.node.selectedRadioButton=_b;
if(_b.enabledImage){
_b.image.src=_b.enabledImage.src;
}
_b.link.className="mbButtonSelected";
_b.enabled=true;
if(_b.mouseHandler){
_b.mouseHandler.enabled=true;
}
_b.doSelect(true,_b);
};
this.disableButton=function(_c){
with(_c){
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
};
this.doSelect=function(_d,_e){
if(_d==true){
var a=document.getElementById("mainMapContainer");
if(a!=null){
a.style.cursor=this.cursor;
var _10=_e.widgetNode.selectSingleNode("mb:cursor");
if(_10!=null){
var _11=_10.firstChild.nodeValue;
a.style.cursor=_11;
}
}
}
};
var _12=_1.selectSingleNode("mb:selected");
if(_12&&_12.firstChild.nodeValue){
this.selected=true;
}
this.initMouseHandler=function(_13){
var _14=_13.widgetNode.selectSingleNode("mb:mouseHandler");
if(_14){
_13.mouseHandler=window.config.objects[_14.firstChild.nodeValue];
if(!_13.mouseHandler){
alert("error finding mouseHandler:"+_14.firstChild.nodeValue+" for button:"+_13.id);
}
}else{
_13.mouseHandler=null;
}
};
this.buttonInit=function(_15){
_15.image=document.getElementById(_15.id+"_image");
_15.link=document.getElementById(_15.outputNodeId);
if(_15.selected){
_15.select();
}
};
this.model.addListener("refresh",this.buttonInit,this);
this.model.addListener("init",this.initMouseHandler,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/ToggleBox.js");
function Geocoder(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doSelect=function(_3,_4){
if(_3){
toggleBox("geocoder",1);
toggleBox("olsResponsView",0);
toggleBox("legend",0);
toggleBox("toevoegen",0);
toggleBox("layerLijst",0);
toggleBox("geoForm",1);
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function GeocoderForm(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.pm=_1.selectSingleNode("mb:puntModel").firstChild.nodeValue;
this.defaultModelUrl=_1.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
this.xsl=new XslProcessor(baseDir+"/../customlib/tool/xsl/ols_request.xsl");
this.init=function(_3){
if(!_3.puntModel){
_3.puntModel=window.config.objects[_3.pm];
}
};
this.model.addListener("init",this.init,this);
this.submitForm=function(_4){
if(!_4.puntModel.doc){
_4.puntModel.url=_4.defaultModelUrl;
var _5=new Object();
_5.url=_4.defaultModelUrl;
_5.method="get";
_5.postData=null;
_4.puntModel.newRequest(_4.puntModel,_5);
}
_4.xsl=new XslProcessor(baseDir+"/../customlib/tool/xsl/ols_request.xsl");
_4.geoForm=document.getElementById(this.formName);
postcode=_4.geoForm.postcode.value;
straat=_4.geoForm.straat.value;
nummer=_4.geoForm.nummer.value;
plaats=_4.geoForm.plaats.value;
gemeente=_4.geoForm.gemeente.value;
if(_4.geoForm.geocoderzoom.checked){
_4.targetModel.zoom="goed";
}else{
_4.targetModel.zoom="fout";
}
if(_4.geoForm.geocodermark.checked){
_4.targetModel.point="goed";
}else{
_4.targetModel.point="fout";
}
_4.targetModel.setParam("pointZoom",_4);
if(postcode){
_4.xsl.setParameter("postalCode",postcode);
}
if(straat){
_4.xsl.setParameter("street",straat);
}
if(nummer){
_4.xsl.setParameter("number",nummer);
}
if(plaats){
_4.xsl.setParameter("municipalitySubdivision",plaats);
}
if(gemeente){
_4.xsl.setParameter("municipality",gemeente);
}
if(!gemeente&&!plaats&&!nummer&&!straat&&!postcode){
alert("Gaarne een of meerdere velden invullen alvorens op zoek te klikken");
return;
}
_4.requestModel=_4.xsl.transformNodeToObject(this.model.doc);
url="http://geoserver.nl/geocoder/NLaddress.aspx";
_4.httpPayload=new Object();
_4.httpPayload.url=url;
_4.httpPayload.method="post";
_4.httpPayload.postData=_4.requestModel;
_4.targetModel.newRequest(_4.targetModel,_4.httpPayload);
};
var _6=_1.selectSingleNode("mb:formName");
if(_6){
this.formName=_6.firstChild.nodeValue;
}else{
this.formName="GeocoderForm_"+mbIds.getId();
}
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/ToggleBox.js");
function GetFeatureInfo(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.xsl=new XslProcessor(baseDir+"/tool/GetFeatureInfo.xsl");
this.infoFormat="application/vnd.ogc.gml";
this.featureCount=1;
var _3=_1.selectSingleNode("mb:featureCount");
if(_3){
this.featureCount=_3.firstChild.nodeValue;
}
this.doAction=function(_4,_5){
if(_4.enabled){
toggleBox("layerControl",0);
toggleBox("featureInfo",1);
toggleBox("legend",1);
toggleBox("geocoder",0);
toggleBox("toevoegen",0);
_4.targetModel.deleteTemplates();
var _6=_4.context.getParam("selectedLayer");
if(_6==null){
var _7=_4.context.getQueryableLayers();
if(_7.length==0){
alert("Er zijn geen bevraagbare lagen beschikbaar, voeg aub een bevraagbare laag toe");
return;
}else{
for(var i=0;i<_7.length;++i){
var _9=_7[i];
var _a=_9.firstChild.data;
var _b=_4.context.getHidden(_a);
if(_b==0){
_4.xsl.setParameter("bbox",_4.context.getBoundingBox().toString());
_4.xsl.setParameter("width",_4.context.getWindowWidth());
_4.xsl.setParameter("height",_4.context.getWindowHeight());
_4.xsl.setParameter("srs",_4.context.getSRS());
_4.xsl.setParameter("queryLayer",_a);
_4.xsl.setParameter("xCoord",_5.evpl[0]);
_4.xsl.setParameter("yCoord",_5.evpl[1]);
_4.xsl.setParameter("infoFormat",_4.infoFormat);
_4.xsl.setParameter("featureCount",_4.featureCount);
urlNode=_4.xsl.transformNodeToObject(_4.context.doc);
url=urlNode.documentElement.firstChild.nodeValue;
httpPayload=new Object();
httpPayload.url=url;
httpPayload.method="get";
httpPayload.postData=null;
_4.targetModel.newRequest(_4.targetModel,httpPayload);
}
}
}
}else{
_4.xsl.setParameter("queryLayer",_6);
_4.xsl.setParameter("xCoord",_5.evpl[0]);
_4.xsl.setParameter("yCoord",_5.evpl[1]);
_4.xsl.setParameter("infoFormat",_4.infoFormat);
_4.xsl.setParameter("featureCount","1");
var _c=_4.xsl.transformNodeToObject(_4.context.doc);
var _d=_c.documentElement.firstChild.nodeValue;
if(_4.infoFormat=="text/html"){
window.open(_d,"queryWin","height=200,width=300,scrollbars=yes");
}else{
var _e=new Object();
_e.url=_d;
_e.method="get";
_e.postData=null;
_4.targetModel.newRequest(_4.targetModel,_e);
}
}
}
};
this.setMouseListener=function(_f){
if(_f.mouseHandler){
_f.mouseHandler.model.addListener("mouseup",_f.doAction,_f);
}
_f.context=_f.widgetNode.selectSingleNode("mb:context");
if(_f.context){
_f.context=window.config.objects[_f.context.firstChild.nodeValue];
}
};
config.addListener("loadModel",this.setMouseListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Help(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doSelect=function(_3,_4){
if(_3){
window.open("help.html");
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/ToggleBox.js");
function Legenda(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.doSelect=function(_3,_4){
if(_3){
toggleBox("geocoder",0);
toggleBox("legend",1);
toggleBox("layerControl",1);
toggleBox("featureInfo",0);
toggleBox("toevoegen",0);
}
};
}

mapbuilder.loadScript(baseDir+"/../customlib/widget/EditButtonBase.js");
mapbuilder.loadScript(baseDir+"/../customlib/widget/ShowDistance.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function Measurement(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
var _3=0;
var _4=0;
var _5=false;
var _6=false;
this.doAction=function(_7,_8){
if(_7.enabled){
if(_7.restart){
_7.targetModel.setParam("clearMeasurementLine");
_7.restart=false;
}
point=_7.mouseHandler.model.extent.getXY(_8.evpl);
old=_7.targetModel.getXpathValue(_7.targetModel,_7.featureXpath);
if(!old){
old="";
}
sucess=_7.targetModel.setXpathValue(_7.targetModel,_7.featureXpath,old+" "+point[0]+","+point[1]);
if(!sucess){
alert("Measurement: invalid featureXpath in config: "+_7.featureXpath);
}
LineCoords=_7.targetModel.getXpathValue(_7.targetModel,_7.featureXpath);
CoordArray=LineCoords.split(" ");
if(CoordArray.length>=3){
Point_P=CoordArray[CoordArray.length-2];
Point_Q=CoordArray[CoordArray.length-1];
var P=Point_P.split(",");
var Q=Point_Q.split(",");
this.srs=srs.toUpperCase();
_7.proj=new Proj(this.srs);
if(_7.proj.Forward){
P=_7.proj.Forward(P);
Q=_7.proj.Forward(Q);
}
if(!P||!Q||_7.proj.Forward==identity){
TotalDistance="Projection not supported!";
}else{
Xp=parseFloat(P[0]);
Yp=parseFloat(P[1]);
Xq=parseFloat(Q[0]);
Yq=parseFloat(Q[1]);
_4=Math.sqrt(((Xp-Xq)*(Xp-Xq))+((Yp-Yq)*(Yp-Yq)));
if(_4==0){
_7.restart=true;
_7.model.setParam("clearMouseLine");
_7.targetModel.setParam("mouseRenderer",false);
return;
}
_3=Math.round(_3+_4);
}
}
_7.targetModel.setParam("totalDistance",_3);
_7.targetModel.setParam("showDistance",_3);
_7.targetModel.setParam("mouseRenderer",true);
}else{
_7.targetModel.setParam("mouseRenderer",false);
}
};
this.clearMeasurementLine=function(_b){
if(_3!=0){
_3=0;
_b.targetModel.values.totalDistance=0;
sucess=_b.targetModel.setXpathValue(_b.targetModel,_b.featureXpath,"");
if(!sucess){
alert("Measurement: invalid featureXpath in config: "+_b.featureXpath);
}
_b.targetModel.setParam("showDistance",_3);
_b.targetModel.setParam("refresh");
}
};
this.model.addListener("clearMeasurementLine",this.clearMeasurementLine,this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/../customlib/util/wz_jsgraphics/wz_jsgraphics.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function MeasurementTrack(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
state=false;
this.mouseUpHandler=function(_3,_4){
PointStart=_3.targetModel.extent.getXY(_4.evpl);
PointStart=_3.targetModel.extent.getPL(PointStart);
};
this.mouseMoveHandler=function(_5,_6){
var _7=_5.targetModel.extent.getXY(_6.evpl);
_7=_5.targetModel.extent.getPL(_7);
if(state){
_5.model.setXpathValueML(_5.model,_5.featureXpath,PointStart[0]+","+PointStart[1]+" "+_7[0]+","+_7[1]);
_5.calcDistance(_5,PointStart,_7);
}
_5.reportCursorCoords();
};
this.init=function(_8){
_8.defaultModelUrl=_1.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
_8.featureXpath=_1.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
measurementWidgetID=_1.selectSingleNode("mb:measurementWidgetID").firstChild.nodeValue;
var _9=_1.selectSingleNode("mb:mouseHandler");
if(!_9){
alert("MeasurementTrack requires a mouseHandler property");
}else{
_8.mouseHandler=window.config.objects[_9.firstChild.nodeValue];
_8.mouseHandler.addListener("mousemove",_8.mouseMoveHandler,_8);
_8.mouseHandler.addListener("mouseup",_8.mouseUpHandler,_8);
PointStart=null;
state=false;
distance=null;
}
};
this.model.addListener("loadModel",this.init,this);
this.calcDistance=function(_a,_b,_c){
width=_a.model.containerModel.getWindowWidth();
height=_a.model.containerModel.getWindowHeight();
bBox=_a.model.containerModel.getBoundingBox();
bBoxMinX=bBox[0];
bBoxMinY=bBox[1];
bBoxMaxX=bBox[2];
bBoxMaxY=bBox[3];
xRatio=width/(bBoxMaxX-bBoxMinX);
yRatio=height/(bBoxMaxY-bBoxMinY);
Xs=parseFloat(((_b[0])/xRatio)+bBoxMinX);
Ys=parseFloat(((height-(_b[1]))/yRatio)+bBoxMinY);
Xe=parseFloat(((_c[0])/xRatio)+bBoxMinX);
Ye=parseFloat(((height-(_c[1]))/yRatio)+bBoxMinY);
distanceNew=Math.sqrt(((Xs-Xe)*(Xs-Xe))+((Ys-Ye)*(Ys-Ye)));
totalDist=Math.round(distance+distanceNew);
_a.model.setParam("showDistance",totalDist);
};
this.measurementState=function(_d){
state=_d.model.values.mouseRenderer;
};
this.model.addListener("mouseRenderer",this.measurementState,this);
this.distanceValue=function(_e){
distance=_e.model.values.totalDistance;
};
this.model.addListener("totalDistance",this.distanceValue,this);
this.clearMouseLine=function(_f){
distance=_f.model.values.totalDistance;
state=false;
_f.model.setXpathValueML(_f.model,_f.featureXpath,"");
_f.model.setParam("showDistance",distance);
};
this.model.parentModel.addListener("clearMouseLine",this.clearMouseLine,this);
this.endPause=function(_10){
measurementXpath=window.config.objects[measurementWidgetID].featureXpath;
coordsLine=_10.model.getXpathValue(_10.model,measurementXpath);
CoordArray=coordsLine.split(" ");
point_S=CoordArray[CoordArray.length-1];
var Sxy=point_S.split(",");
width=_10.model.containerModel.getWindowWidth();
height=_10.model.containerModel.getWindowHeight();
bBox=_10.model.containerModel.getBoundingBox();
bBoxMinX=bBox[0];
bBoxMinY=bBox[1];
bBoxMaxX=bBox[2];
bBoxMaxY=bBox[3];
xRatio=width/(bBoxMaxX-bBoxMinX);
yRatio=height/(bBoxMaxY-bBoxMinY);
PointStart[0]=parseFloat((Sxy[0])-bBoxMinX)*xRatio;
PointStart[1]=parseFloat(height-((Sxy[1])-bBoxMinY)*yRatio);
state=true;
};
this.model.parentModel.addListener("endPause",this.endPause,this);
this.reportCursorCoords=function(){
var _12=window.cursorTrackObject;
if(state){
var _13=_12.model.extent.getXY(window.cursorTrackNode.evpl);
if(_12.showXY){
if(_12.coordForm.x){
_12.coordForm.x.value=_13[0].toFixed(0);
}
if(_12.coordForm.y){
_12.coordForm.y.value=_13[1].toFixed(0);
}
}
}
};
}

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
mapbuilder.loadScript(baseDir+"/../customlib/util/wz_jsgraphics/wz_jsgraphics.js");
function MouseRenderer(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:stylesheet");
if(_3){
this.stylesheet=new XslProcessor(_3.firstChild.nodeValue,_2.namespace);
}else{
this.stylesheet=new XslProcessor(baseDir+"/widget/"+_1.nodeName+".xsl",_2.namespace);
}
this.paint=function(_4){
if(_4.model.doc&&_4.node){
_4.stylesheet.setParameter("modelUrl",_4.model.url);
_4.resultDoc=_4.model.doc;
_4.prePaint(_4);
if(_4.debug){
alert("prepaint:"+Sarissa.serialize(_4.resultDoc));
}
if(_4.debug){
alert("stylesheet:"+Sarissa.serialize(_4.stylesheet.xslDom));
}
var _5=document.getElementById(_4.outputNodeId);
var _6=document.createElement("DIV");
_6.style.position="absolute";
_6.style.top=0;
_6.style.left=0;
_6.style.zindex=300;
_6.setAttribute("id",_4.outputNodeId);
if(_5){
_4.node.replaceChild(_6,_5);
}else{
_4.node.appendChild(_6);
}
_4.stylesheet.setParameter("objRef","_4");
_4.stylesheet.setParameter("widgetNode","_1");
jsNode=_4.stylesheet.transformNodeToObject(_4.resultDoc);
js=jsNode.selectSingleNode("js").firstChild.nodeValue;
if(_4.debug){
alert("javascript eval:"+js);
}
_4.model.setParam("modelStatus","rendering");
eval(js);
_4.postPaint(_4);
}
};
this.model.addListener("refresh_mouse",this.paint,this);
MapContainerBase.apply(this,new Array(_1,_2));
for(var j=0;j<_1.childNodes.length;j++){
if(_1.childNodes[j].firstChild&&_1.childNodes[j].firstChild.nodeValue){
this.stylesheet.setParameter(_1.childNodes[j].nodeName,_1.childNodes[j].firstChild.nodeValue);
}
}
if(config.widgetText){
var _8="/mb:WidgetText/mb:widgets/mb:"+_1.nodeName;
var _9=config.widgetText.selectNodes(_8+"/*");
for(var j=0;j<_9.length;j++){
this.stylesheet.setParameter(_9[j].nodeName,_9[j].firstChild.nodeValue);
}
}
this.stylesheet.setParameter("modelId",this.model.id);
this.stylesheet.setParameter("modelTitle",this.model.title);
this.stylesheet.setParameter("widgetId",this.id);
this.stylesheet.setParameter("skinDir",config.skinDir);
this.stylesheet.setParameter("lang",config.lang);
this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");
this.prePaint=function(_a){
_a.resultDoc=_a.coordXsl.transformNodeToObject(_a.resultDoc);
};
this.hiddenListener=function(_b,_c){
var _d="visible";
if(_b.model.getHidden(_c)){
_d="hidden";
}
var _e=document.getElementById(_b.outputNodeId);
for(var i=0;i<_e.childNodes.length;++i){
_e.childNodes[i].style.visibility=_d;
}
};
this.model.addListener("hidden",this.hiddenListener,this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function OlsResponsView(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.pm=_1.selectSingleNode("mb:puntModel").firstChild.nodeValue;
this.stylesheet.setParameter("puntModelId",this.puntModel);
this.defaultModelUrl=_1.selectSingleNode("mb:defaultModelUrl").firstChild.nodeValue;
this.featureXpath=_1.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
this.loadParameters=function(_3){
_3.stylesheet.setParameter("zoom",_3.model.zoom);
_3.stylesheet.setParameter("mark",_3.model.point);
};
this.model.addListener("pointZoom",this.loadParameters,this);
this.setAttr=function(_4,_5,_6){
_4.model.setXpathValue(_4.model,_5,_6);
};
this.addPoint=function(_7,x,y){
if(!_7.puntModel){
_7.puntModel=window.config.objects[_7.pm];
}
old=_7.puntModel.getXpathValue(_7.puntModel,_7.featureXpath);
if(!old){
old="";
}
old=x+","+y+" "+old;
sucess=_7.puntModel.setXpathValue(_7.puntModel,_7.featureXpath,old);
if(!sucess){
alert("EditPoint: invalid featureXpath in config: "+_7.featureXpath);
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Print(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.psu=_1.selectSingleNode("mb:printServerUrl").firstChild.nodeValue;
this.doSelect=function(_3,_4){
if(_3){
var _5=_4.targetModel.getAllLayers();
var _6="";
var _7="";
for(var i=0;i<_5.length;i++){
var _9=(_5[i].getAttribute("hidden")==1)?true:false;
if(!_9){
_6=_6+","+_5[i].selectSingleNode("wmc:Name").firstChild.nodeValue;
}
}
_6=_6.slice(1);
var _a=_4.targetModel.getSRS();
var _b=_4.targetModel.getBoundingBox().join(",");
var _c=_4.targetModel.getWindowWidth();
var _d=_4.targetModel.getWindowHeight();
var _e="image/png";
src=_4.psu+"&VERSION=1.1.0&REQUEST=GetMap&SERVICE=WMS&SRS="+_a+"&BBOX="+_b+"&WIDTH="+_c+"&HEIGHT="+_d+"&LAYERS="+_6+"&FORMAT="+_e;
window.open(src,"printview","width=800, height=550");
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function ShowDistance(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.showDistance=function(_3){
_3.distForm=document.getElementById(_3.formName);
var _4=_3.model.values.showDistance;
if(_4>1000){
if(_4>1000000){
outputDistance=Math.round(_4/1000)+"  km";
}else{
outputDistance=Math.round(_4/100)/10+"  km";
}
}else{
outputDistance=Math.round(_4)+"  m";
}
_3.distForm.distance.value=outputDistance;
};
this.model.addListener("showDistance",this.showDistance,this);
this.formName="ShowDistance_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/ToggleBox.js");
function VerwijderPunten(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.pm=_1.selectSingleNode("mb:puntModel").firstChild.nodeValue;
this.featureXpath=_1.selectSingleNode("mb:featureXpath").firstChild.nodeValue;
this.doSelect=function(_3,_4){
if(_3){
if(!_4.puntModel){
_4.puntModel=window.config.objects[_4.pm];
}
if(!_4.puntModel.doc){
return;
}
old="";
sucess=_4.puntModel.setXpathValue(_4.puntModel,_4.featureXpath,old);
if(!sucess){
alert("EditPoint: invalid featureXpath in config: "+_4.featureXpath);
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function ZoomIn(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.zoomBy=2;
this.doAction=function(_3,_4){
if(_3.enabled){
var _5=_3.targetModel.getParam("aoi");
if(_5!=null){
var _6=_3.targetModel.extent;
var ul=_5[0];
var lr=_5[1];
if(_6.res[0]<1){
_3.targetModel.setParam("bbox");
alert("U kunt niet verder inzoomen");
}else{
if((ul[0]==lr[0])&&(ul[1]==lr[1])){
_6.centerAt(ul,_6.res[0]/_3.zoomBy);
}else{
if(lr[0]-ul[0]<100||ul[1]-lr[1]<100){
_3.targetModel.setParam("bbox");
alert("Het gesleepte rechthoek is te klein om op in te zoomen.");
}else{
_6.zoomToBox(ul,lr);
}
}
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


