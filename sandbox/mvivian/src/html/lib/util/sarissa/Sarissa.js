function Sarissa(){};
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
};
if(_SARISSA_IS_IE){
_SARISSA_IEPREFIX4XSLPARAM="xsl:";
var _SARISSA_DOM_PROGID="";
var _SARISSA_XMLHTTP_PROGID="";
pickRecentProgID=function(idList,enabledList){
var bFound=false;
for(var i=0;i<idList.length&&!bFound;i++){
try{
var oDoc=new ActiveXObject(idList[i]);
o2Store=idList[i];
bFound=true;
for(var j=0;j<enabledList.length;j++)
if(i<=enabledList[j][1])
Sarissa["IS_ENABLED_"+enabledList[j][0]]=true;
}catch(objException){
};
};
if(!bFound)
throw "Could not retreive a valid progID of Class: "+idList[idList.length-1]+". (original exception: "+e+")";
idList=null;
return o2Store;
};
_SARISSA_DOM_PROGID=pickRecentProgID(["Msxml2.DOMDocument.5.0","Msxml2.DOMDocument.4.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"],[["SELECT_NODES",2],["TRANSFORM_NODE",2]]);
_SARISSA_XMLHTTP_PROGID=pickRecentProgID(["Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],[["XMLHTTP",4]]);
_SARISSA_THREADEDDOM_PROGID=pickRecentProgID(["Msxml2.FreeThreadedDOMDocument.5.0","MSXML2.FreeThreadedDOMDocument.4.0","MSXML2.FreeThreadedDOMDocument.3.0"]);
_SARISSA_XSLTEMPLATE_PROGID=pickRecentProgID(["Msxml2.XSLTemplate.5.0","Msxml2.XSLTemplate.4.0","MSXML2.XSLTemplate.3.0"],[["XSLTPROC",2]]);
pickRecentProgID=null;
Sarissa.getDomDocument=function(sUri,sName){
var oDoc=new ActiveXObject(_SARISSA_DOM_PROGID);
if(sName){
if(sUri){
oDoc.loadXML("<a"+_sarissa_iNsCounter+":"+sName+" xmlns:a"+_sarissa_iNsCounter+"=\""+sUri+"\" />");
++_sarissa_iNsCounter;
}
else
oDoc.loadXML("<"+sName+"/>");
};
return oDoc;
};
Sarissa.getParseErrorText=function(oDoc){
var parseErrorText=Sarissa.PARSED_OK;
if(oDoc.parseError!=0){
parseErrorText="XML Parsing Error: "+oDoc.parseError.reason+ 
"\nLocation: "+oDoc.parseError.url+ 
"\nLine Number "+oDoc.parseError.line+", Column "+ 
oDoc.parseError.linepos+ 
":\n"+oDoc.parseError.srcText+
"\n";
for(var i=0;i<oDoc.parseError.linepos;i++){
parseErrorText+="-";
};
parseErrorText+="^\n";
};
return parseErrorText;
};
Sarissa.setXpathNamespaces=function(oDoc,sNsSet){
oDoc.setProperty("SelectionLanguage","XPath");
oDoc.setProperty("SelectionNamespaces",sNsSet);
}; 
XSLTProcessor=function(){
this.template=new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
this.processor=null;
};
XSLTProcessor.prototype.importStylesheet=function(xslDoc){
var converted=new ActiveXObject(_SARISSA_THREADEDDOM_PROGID); 
converted.loadXML(xslDoc.xml);
this.template.stylesheet=converted;
this.processor=this.template.createProcessor();
this.paramsSet=new Array();
};
XSLTProcessor.prototype.transformToDocument=function(sourceDoc){
this.processor.input=sourceDoc;
var outDoc=new ActiveXObject(_SARISSA_DOM_PROGID);
this.processor.output=outDoc; 
this.processor.transform();
return outDoc;
};
XSLTProcessor.prototype.setParameter=function(nsURI,name,value){
if(nsURI){
this.processor.addParameter(name,value,nsURI);
}else{
this.processor.addParameter(name,value);
};
if(!this.paramsSet[""+nsURI]){
this.paramsSet[""+nsURI]=new Array();
};
this.paramsSet[""+nsURI][name]=value;
};
XSLTProcessor.prototype.getParameter=function(nsURI,name){
nsURI=nsURI||"";
if(nsURI in this.paramsSet&&name in this.paramsSet[nsURI]){
return this.paramsSet[nsURI][name];
}else{
return null;
};
};
}
else{ 
if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(oDoc){
if(!oDoc.documentElement||oDoc.documentElement.tagName=="parsererror")
oDoc.parseError=-1;
Sarissa.__setReadyState__(oDoc,4);
};
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(oDoc,iReadyState){
oDoc.readyState=iReadyState;
if(oDoc.onreadystatechange!=null&&typeof oDoc.onreadystatechange=="function")
oDoc.onreadystatechange();
};
Sarissa.getDomDocument=function(sUri,sName){
var oDoc=document.implementation.createDocument(sUri?sUri:"",sName?sName:"",null);
oDoc.addEventListener("load",_sarissa_XMLDocument_onload,false);
return oDoc;
};
if(window.XMLDocument){
XMLDocument.prototype.onreadystatechange=null;
XMLDocument.prototype.readyState=0;
XMLDocument.prototype.parseError=0;
var _SARISSA_SYNC_NON_IMPLEMENTED=false; 
XMLDocument.prototype._sarissa_load=XMLDocument.prototype.load;
XMLDocument.prototype.load=function(sURI){
var oDoc=document.implementation.createDocument("","",null);
Sarissa.copyChildNodes(this,oDoc);
this.parseError=0;
Sarissa.__setReadyState__(this,1);
try{
if(this.async==false&&_SARISSA_SYNC_NON_IMPLEMENTED){
var tmp=new XMLHttpRequest();
tmp.open("GET",sURI,false);
tmp.send(null);
Sarissa.__setReadyState__(this,2);
Sarissa.copyChildNodes(tmp.responseXML,this);
Sarissa.__setReadyState__(this,3);
}
else{
this._sarissa_load(sURI);
};
}
catch(objException){
this.parseError=-1;
}
finally{
if(this.async==false){
Sarissa.__handleLoad__(this);
};
};
return oDoc;
};
}else if(document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature('LS','3.0')){
Document.prototype.async=true;
Document.prototype.onreadystatechange=null;
Document.prototype.parseError=0;
Document.prototype.load=function(sURI){
var parser=document.implementation.createLSParser(this.async?document.implementation.MODE_ASYNCHRONOUS:document.implementation.MODE_SYNCHRONOUS,null);
if(this.async){
var self=this;
parser.addEventListener("load", 
function(e){ 
self.readyState=4;
Sarissa.copyChildNodes(e.newDocument,self.documentElement,false);
self.onreadystatechange.call(); 
}, 
false); 
};
try{
var oDoc=parser.parseURI(sURI);
}
catch(e){
this.parseError=-1;
};
if(!this.async)
Sarissa.copyChildNodes(oDoc,this.documentElement,false);
return oDoc;
};
Sarissa.getDomDocument=function(sUri,sName){
return document.implementation.createDocument(sUri?sUri:"",sName?sName:"",null);
}; 
};
};};
if(!window.DOMParser){
DOMParser=function(){
};
if(_SARISSA_IS_SAFARI){
DOMParser.prototype.parseFromString=function(sXml,contentType){
if(contentType.toLowerCase()!="application/xml"){
throw "Cannot handle content type: \""+contentType+"\"";
};
var xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(str),false);
xmlhttp.send(null);
return xmlhttp.responseXML;
};
}else if(Sarissa.getDomDocument&&Sarissa.getDomDocument()&&"loadXML" in Sarissa.getDomDocument()){
DOMParser.prototype.parseFromString=function(sXml,contentType){
var doc=Sarissa.getDomDocument();
doc.loadXML(sXml);
return doc;
};
};
};
if(window.XMLHttpRequest){
Sarissa.IS_ENABLED_XMLHTTP=true;
}
else if(_SARISSA_IS_IE){
XMLHttpRequest=function(){
return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
};
Sarissa.IS_ENABLED_XMLHTTP=true;
};
if(!window.document.importNode&&_SARISSA_IS_IE){
try{
window.document.importNode=function(oNode,bChildren){
var importNode=document.createElement("div");
if(bChildren)
importNode.innerHTML=Sarissa.serialize(oNode);
else
importNode.innerHTML=Sarissa.serialize(oNode.cloneNode(false));
return importNode.firstChild;
};
}catch(e){};
};
if(!Sarissa.getParseErrorText){
Sarissa.getParseErrorText=function(oDoc){
var parseErrorText=Sarissa.PARSED_OK;
if(oDoc&&oDoc.parseError&&oDoc.parseError!=0){
if(oDoc.documentElement.tagName=="parsererror"){
parseErrorText=oDoc.documentElement.firstChild.data;
parseErrorText+="\n"+oDoc.documentElement.firstChild.nextSibling.firstChild.data;
}
else{
parseErrorText=Sarissa.getText(oDoc.documentElement);
};
};
return parseErrorText;
};
};
Sarissa.getText=function(oNode,deep){
var s="";
var nodes=oNode.childNodes;
for(var i=0;i<nodes.length;i++){
var node=nodes[i];
var nodeType=node.nodeType;
if(nodeType==Node.TEXT_NODE||nodeType==Node.CDATA_SECTION_NODE){
s+=node.data;
}else if(deep==true
&&(nodeType==Node.ELEMENT_NODE
||nodeType==Node.DOCUMENT_NODE
||nodeType==Node.DOCUMENT_FRAGMENT_NODE)){
s+=Sarissa.getText(node,true);
};
};
return s;
};
if(window.XMLSerializer){
Sarissa.serialize=function(oDoc){
var s=null;
if(oDoc){
s=oDoc.innerHTML?oDoc.innerHTML:(new XMLSerializer()).serializeToString(oDoc);
};
return s;
};
}else{
if(Sarissa.getDomDocument&&(Sarissa.getDomDocument("","foo",null)).xml){
Sarissa.serialize=function(oDoc){
var s=null;
if(oDoc){
s=oDoc.innerHTML?oDoc.innerHTML:oDoc.xml;
};
return s;
};
XMLSerializer=function(){};
XMLSerializer.prototype.serializeToString=function(oNode){
return oNode.xml;
};
};
};
Sarissa.stripTags=function(s){
return s.replace(/<[^>]+>/g,"");
};
Sarissa.clearChildNodes=function(oNode){
while(oNode.firstChild){
oNode.removeChild(oNode.firstChild);
};
};
Sarissa.copyChildNodes=function(nodeFrom,nodeTo,bPreserveExisting){
if((!nodeFrom)||(!nodeTo)){
throw "Both source and destination nodes must be provided";
};
if(!bPreserveExisting){
Sarissa.clearChildNodes(nodeTo);
};
var ownerDoc=nodeTo.nodeType==Node.DOCUMENT_NODE?nodeTo:nodeTo.ownerDocument;
var nodes=nodeFrom.childNodes;
if(ownerDoc.importNode&&(!_SARISSA_IS_IE)){
for(var i=0;i<nodes.length;i++){
nodeTo.appendChild(ownerDoc.importNode(nodes[i],true));
};
}
else{
for(var i=0;i<nodes.length;i++){
nodeTo.appendChild(nodes[i].cloneNode(true));
};
};
};
Sarissa.moveChildNodes=function(nodeFrom,nodeTo,bPreserveExisting){
if((!nodeFrom)||(!nodeTo)){
throw "Both source and destination nodes must be provided";
};
if(!bPreserveExisting){
Sarissa.clearChildNodes(nodeTo);
};
var nodes=nodeFrom.childNodes;
if(nodeFrom.ownerDocument==nodeTo.ownerDocument){
while(nodeFrom.firstChild){
nodeTo.appendChild(nodeFrom.firstChild);
};
}else{
var ownerDoc=nodeTo.nodeType==Node.DOCUMENT_NODE?nodeTo:nodeTo.ownerDocument;
if(ownerDoc.importNode&&(!_SARISSA_IS_IE)){
for(var i=0;i<nodes.length;i++){
nodeTo.appendChild(ownerDoc.importNode(nodes[i],true));
};
}else{
for(var i=0;i<nodes.length;i++){
nodeTo.appendChild(nodes[i].cloneNode(true));
};
};
Sarissa.clearChildNodes(nodeFrom);
};
};
Sarissa.xmlize=function(anyObject,objectName,indentSpace){
indentSpace=indentSpace?indentSpace:'';
var s=indentSpace+'<'+objectName+'>';
var isLeaf=false;
if(!(anyObject instanceof Object)||anyObject instanceof Number||anyObject instanceof String 
||anyObject instanceof Boolean||anyObject instanceof Date){
s+=Sarissa.escape(""+anyObject);
isLeaf=true;
}else{
s+="\n";
var itemKey='';
var isArrayItem=anyObject instanceof Array;
for(var name in anyObject){
s+=Sarissa.xmlize(anyObject[name],(isArrayItem?"array-item key=\""+name+"\"":name),indentSpace+"   ");
};
s+=indentSpace;
};
return s+=(objectName.indexOf(' ')!=-1?"</array-item>\n":"</"+objectName+">\n");
};
Sarissa.escape=function(sXml){
return sXml.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&apos;");
};
Sarissa.unescape=function(sXml){
return sXml.replace(/&apos;/g,"'")
.replace(/&quot;/g,"\"")
.replace(/&gt;/g,">")
.replace(/&lt;/g,"<")
.replace(/&amp;/g,"&");
};
