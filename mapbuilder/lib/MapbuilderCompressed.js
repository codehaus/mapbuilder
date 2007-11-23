var MapBuilder_Release=true;

var mbTimerStart=new Date();
var config;
if(typeof baseDir=="undefined"){
var baseDir;
}
var mbServerConfig="mapbuilderConfig.jsp";
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
this.loadScript(baseDir+"/util/sarissa/javeline_xpath.js");
this.loadScript(baseDir+"/util/sarissa/javeline_xslt.js");
this.loadScript(baseDir+"/util/sarissa/sarissa_dhtml.js");
this.loadScript(baseDir+"/util/sarissa/sarissa_ieemu_xpath.js");
this.loadScript(baseDir+"/util/cscs/lib/cscs.js");
this.loadScript(baseDir+"/util/cscs/lib/geocent.js");
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

IS_SAFARI=navigator.userAgent.toLowerCase().indexOf("safari")!=-1||navigator.userAgent.toLowerCase().indexOf("konqueror")!=-1;
IS_SAFARI_OLD=IS_SAFARI&&parseInt((navigator.userAgent.match(/AppleWebKit\/(\d+)/)||{})[1])<420;
IS_GECKO=document.implementation&&document.implementation.createDocument&&true;
IS_OPERA=navigator.userAgent.toLowerCase().indexOf("opera")!=-1;
IS_IE=document.all&&!IS_OPERA;
IS_NEW_SAFARI=IS_SAFARI&&navigator.userAgent.toLowerCase().indexOf("version/3")!=-1;
if(IS_SAFARI_OLD&&!IS_NEW_SAFARI){
HTMLHtmlElement=document.createElement("html").constructor;
Node=HTMLElement={};
HTMLElement.prototype=HTMLHtmlElement.__proto__.__proto__;
HTMLDocument=Document=document.constructor;
var x=new DOMParser();
XMLDocument=x.constructor;
Element=x.parseFromString("<Single />","text/xml").documentElement.constructor;
x=null;
}
TAGNAME=IS_IE?"baseName":"localName";
var _$=function(_1,_2,_3,_4){
return (_2||document).getElementsByTagName(_1);
};
if(IS_SAFARI){
XPath={cache:{},getChildNode:function(_5,_6,_7,_8,_9,_a){
var _b=0,result=null,data=_7[_8];
if(_6!=null){
if(_6.indexOf(":")>0){
_6=_6.split(":")[1];
}
}
var _c=_5.childNodes;
if(!_c){
return;
}
for(var i=0;i<_c.length;i++){
if(_6&&(_c[i].style?_c[i].tagName.toLowerCase():_c[i].tagName)!=_6){
continue;
}
if(data){
data[0](_c[i],data[1],_7,_8+1,_b++,_a);
}else{
_a.push(_c[i]);
}
}
},doQuery:function(_e,_f,_10,_11,num,_13){
var _14=null,data=_10[_11];
var _15=_f[0];
var _16=_f[1];
try{
var _17=eval(_15);
}
catch(e){
alert("eror :"+e+" in query : "+_15);
return;
}
if(_16){
return _13.push(_17);
}
if(_17==null||_17=="undefined"||_17==""){
return;
}
if(data){
data[0](_e,data[1],_10,_11+1,0,_13);
}else{
_13.push(_e);
}
},getTextNode:function(_18,_19,_1a,_1b,num,_1d){
var _1e=null,data=_1a[_1b];
var _1f=_18.childNodes;
for(var i=0;i<_1f.length;i++){
if(_1f[i].nodeType!=3&&_1f[i].nodeType!=4){
continue;
}
if(data){
data[0](_1f[i],data[1],_1a,_1b+1,i,_1d);
}else{
_1d.push(_1f[i]);
}
}
},getAnyNode:function(_21,_22,_23,_24,num,_26){
var _27=null,data=_23[_24];
var sel=[],nodes=_21.childNodes;
for(var i=0;i<nodes.length;i++){
if(data){
data[0](nodes[i],data[1],_23,_24+1,i,_26);
}else{
_26.push(nodes[i]);
}
}
},getAttributeNode:function(_2a,_2b,_2c,_2d,num,_2f){
if(!_2a||_2a.nodeType!=1){
return;
}
var _30=null,data=_2c[_2d];
var _31=_2a.getAttributeNode(_2b);
if(data){
data[0](_31,data[1],_2c,_2d+1,0,_2f);
}else{
if(_31){
_2f.push(_31);
}
}
},getAllNodes:function(_32,x,_34,_35,num,_37){
var _38=null,data=_34[_35];
var _39=x[0];
if(_39!=null){
if(_39.indexOf(":")>0){
_39=_39.split(":")[1];
}
}
var _3a=x[1];
var _3b=x[2];
if(_3a&&(_32.tagName==_39||_39=="*")){
if(data){
data[0](_32,data[1],_34,_35+1,0,_37);
}else{
_37.push(_32);
}
}
var _3c=_$(_39,_32,_39==_3b?"":_3b);
for(var i=0;i<_3c.length;i++){
if(data){
data[0](_3c[i],data[1],_34,_35+1,i,_37);
}else{
_37.push(_3c[i]);
}
}
},getParentNode:function(_3e,_3f,_40,_41,num,_43){
var _44=null,data=_40[_41];
var _45=_3e.parentNode;
if(data){
data[0](_45,data[1],_40,_41+1,0,_43);
}else{
if(_45){
_43.push(_45);
}
}
},getPrecedingSibling:function(_46,_47,_48,_49,num,_4b){
if(_47=="*"){
_47=_46.tagName;
}
var _4c=null,data=_48[_49];
var _4d=_46.previousSibling;
while(_4d){
if(_47!="node()"&&_4d.tagName!=_47){
continue;
}
if(_4d){
_4b.push(_4d);
}
_4d=_4d.previousSibling;
}
},getFollowingSibling:function(_4e,_4f,_50,_51,num,_53){
var _54=null,data=_50[_51];
if(_4f=="*"){
_4f=_4e.tagName;
}
var _55=_4e.nextSibling;
while(_55){
if(_4f!="NODE()"&&_55.tagName!=_4f){
continue;
}
if(_55!=null){
_53.push(_55);
}
_55=_55.previousSibling;
}
},getPreceding:function(_56,_57,_58,_59,num,_5b){
if(_57=="*"){
_57=_56.tagName;
}
var _5c=null,data=_58[_59];
var _5d=_56.parentNode;
var _5e=_56.previousSibling;
while(_5e){
if(_5e.parentNode!=_5d&&_57!="NODE()"&&_5e.tagName!=_57){
_5e=_5e.previousSibling;
continue;
}
if(_5e){
_5b.push(_5e);
_5e=_5e.previousSibling;
}
}
},getFollowing:function(_5f,_60,_61,_62,num,_64){
if(_60=="*"){
_60=_5f.tagName;
}
var _65=null,data=_61[_62];
var _66=_5f.parentNode;
var _67=_5f.nextSibling;
while(_67){
if(_67.parentNode!=_66&&_60!="NODE()"&&_67.tagName!=_60){
_67=_67.nextSibling;
continue;
}
if(_67){
_64.push(_67);
_67=_67.nextSibling;
}
}
},multiXpaths:function(_68,_69,_6a,_6b,num,_6d){
for(var i=_69.length;i>0;i--){
var _6a=_69[i][0];
var _6f=(_6a[3]?_68.ownerDocument.documentElement:_68);
_6a[0](_6f,_6a[1],_69[i],1,0,_6d);
}
_6d.makeUnique();
},compile:function(_70){
_70=_70.replace(/\[(\d+)\]/g,"/##$1");
_70=_70.replace(/\|\|(\d+)\|\|\d+/g,"##$1");
_70=_70.replace(/\.\|\|\d+/g,".");
_70=_70.replace(/\[([^\]]*)\]/g,"/##$1#");
if(_70=="/"||_70=="."){
return _70;
}
_70=_70.replace(/\/\//g,"descendant::");
return this.processXpath(_70);
},processXpath:function(_71){
var _72=new Array();
_71=_71.replace(/('[^']*)\|([^']*')/g,"$1_@_$2");
_71=_71.split("|");
for(var i=0;i<_71.length;i++){
_71[i]=_71[i].replace(/('[^']*)\_\@\_([^']*')/g,"$1|$2");
}
if(_71.length==1){
_71=_71[0];
}else{
for(var i=0;i<_71.length;i++){
_71[i]=this.processXpath(_71[i]);
}
_72.push([this.multiXpaths,_71]);
return _72;
}
if(_71.match(/\(/)){
_72.push([this.doQuery,[this.compileQuery(_71),true]]);
return _72;
}
var _74=_71.match(/^\/[^\/]/);
var _75=_71.split("/");
for(var i=0;i<_75.length;i++){
if(_75[i]=="."||_75[i]==""){
continue;
}else{
if(_75[i].match(/^[\w-_\.]+(?:\:[\w-_\.]+){0,1}$/)){
_72.push([this.getChildNode,_75[i]]);
}else{
if(_75[i].match(/^\#\#(\d+)$/)){
_72.push([this.doQuery,["num+1 == "+parseInt(RegExp.$1)]]);
}else{
if(_75[i].match(/^\#\#(.*)$/)){
var _76=RegExp.$1;
var m=[_76.match(/\(/g),_76.match(/\)/g)];
if(m[0]||m[1]){
while(!m[0]&&m[1]||m[0]&&!m[1]||m[0].length!=m[1].length){
if(!_75[++i]){
break;
}
_76+=_75[i];
}
}else{
i++;
while(_75[i]){
if(!_75[i]){
break;
}
if(_75[i-1].match(/.*\#$/)){
break;
}
_76+="/"+_75[i];
i++;
}
}
_76=_76.replace(/\#/,"");
_72.push([this.doQuery,[this.compileQuery(_76)]]);
}else{
if(_75[i]=="*"){
_72.push([this.getChildNode,null]);
}else{
if(_75[i].substr(0,2)=="[]"){
_72.push([this.getAllNodes,["*",false]]);
}else{
if(_75[i].match(/::/)){
if(_75[i].match(/descendant-or-self::node\(\)$/)){
_72.push([this.getAllNodes,["*",true]]);
}else{
if(_75[i].match(/descendant-or-self::([^\:]*)(?:\:(.*)){0,1}$/)){
_72.push([this.getAllNodes,[RegExp.$2||RegExp.$1,true,RegExp.$1]]);
}else{
if(_75[i].match(/descendant::([^\:]*)(?:\:(.*)){0,1}$/)){
_72.push([this.getAllNodes,[RegExp.$2||RegExp.$1,false,RegExp.$1]]);
}else{
if(_75[i].match(/following-sibling::(.*)$/)){
_72.push([this.getFollowingSibling,RegExp.$1.toUpperCase()]);
}else{
if(_75[i].match(/preceding-sibling::(.*)$/)){
_72.push([this.getPrecedingSibling,RegExp.$1.toUpperCase()]);
}else{
if(_75[i].match(/following::(.*)$/)){
_72.push([this.getFollowing,RegExp.$1.toUpperCase()]);
}else{
if(_75[i].match(/preceding::(.*)$/)){
_72.push([this.getPreceding,RegExp.$1.toUpperCase()]);
}else{
if(_75[i].match(/self::(.*)$/)){
_72.push([this.doQuery,["XPath.doXpathFunc('local-name', htmlNode) == '"+RegExp.$1+"'"]]);
}
}
}
}
}
}
}
}
}else{
if(_75[i].match(/^\@(.*)$/)){
_72.push([this.getAttributeNode,RegExp.$1]);
}else{
if(_75[i]=="text()"){
_72.push([this.getTextNode,null]);
}else{
if(_75[i]=="node()"){
_72.push([this.getAnyNode,null]);
}else{
if(_75[i]==".."){
_72.push([this.getParentNode,null]);
}else{
var _76=_75[i];
var m=[_76.match(/\(/g),_76.match(/\)/g)];
if(m[0]||m[1]){
while(!m[0]&&m[1]||m[0]&&!m[1]||m[0].length!=m[1].length){
if(!_75[++i]){
break;
}
_76+="/"+_75[i];
m=[_76.match(/\(/g),_76.match(/\)/g)];
}
}
_72.push([this.doQuery,[this.compileQuery(_76),true]]);
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
_72[0][3]=_74;
return _72;
},compileQuery:function(_78){
var c=new CodeCompilation(_78);
var _7a=c.compile();
return _7a;
},doXpathFunc:function(_7b,_7c,_7d,_7e){
switch(_7b){
case "not":
if((_7c==null)||(_7c==true)){
return false;
}else{
return true;
}
case "position":
return parseInt(_7c);
case "position()":
return num;
case "format-number":
return new String(Math.round(parseFloat(_7c)*100)/100).replace(/(\.\d?\d?)$/,function(m1){
return m1.pad(3,"0",PAD_RIGHT);
});
case "floor":
return Math.floor(_7c);
case "ceiling":
return Math.ceil(_7c);
case "starts-with":
return _7c?_7c.substr(0,_7d.length)==_7d:false;
case "string-length":
return _7c?_7c.length:0;
case "count":
return _7c?parseInt(_7c.length):0;
case "last":
return _7c?_7c[_7c.length-1]:null;
case "local-name":
return _7c?_7c.tagName:"";
case "substring":
return _7c&&_7d?_7c.substring(_7d,_7e||0):"";
case "contains":
return _7c&&_7d?_7c.indexOf(_7d)>-1:false;
case "concat":
for(var str="",i=1;i<arguments.length;i++){
if(typeof arguments[i]=="object"){
str+=getNodeValue(arguments[i][0]);
continue;
}
str+=arguments[i];
}
return str;
}
},selectNodeExtended:function(_81,_82){
var _83=this.selectNodes(_81,_82);
if(_83.length==1){
_83=_83[0];
return getNodeValue(_83);
}
return _83;
},selectNodes:function(_84,_85){
if(!this.cache[_84]){
this.cache[_84]=this.compile(_84);
}
if(typeof this.cache[_84]=="string"){
if(this.cache[_84]=="."){
return [_85];
}
if(this.cache[_84]=="/"){
return [_85.nodeType==9?_85:_85.ownerDocument.documentElement];
}
}
var _86=this.cache[_84][0];
var _87=(_86[3]&&!_85.nodeType==9?_85.ownerDocument.documentElement:_85);
var _88=[];
var y=new XMLSerializer();
_86[0](_87,_86[1],this.cache[_84],1,0,_88);
if(_88==""){
if(_84.indexOf(/\/\//)){
while(_87.parentNode){
if(_87){
_87=_87.parentNode;
}
}
_86[0](_87,_86[1],this.cache[_84],1,0,_88);
}
}
return _88;
}};
function getNodeValue(_8a){
if(_8a.nodeType==1){
return _8a.firstChild?_8a.firstChild.nodeValue:"";
}
if(_8a.nodeType>1||_8a.nodeType<5){
return _8a.nodeValue;
}
return _8a;
}
function CodeCompilation(_8b){
this.data={F:[],S:[],I:[],X:[],P:[]};
this.compile=function(){
_8b=_8b.replace(/ or /g," || ");
_8b=_8b.replace(/ and /g," && ");
_8b=_8b.replace(/!=/g,"{}");
_8b=_8b.replace(/ mod /g,"%");
_8b=_8b.replace(/=/g,"==");
_8b=_8b.replace(/====/g,"==");
_8b=_8b.replace(/\{\}/g,"!=");
this.tokenize();
this.insert();
return _8b;
};
this.tokenize=function(){
var _8c=this.data.P;
_8b=_8b.replace(/\((.*\#\#.*[^)])/g,function(d,_8e){
return "("+(_8c.push(_8e)-1)+"P_";
});
var _8c=this.data.F;
_8b=_8b.replace(/(format-number|contains|substring|local-name|last|node|position|round|starts-with|string|string-length|sum|floor|ceiling|concat|count|not)\s*\(/g,function(d,_90){
return (_8c.push(_90)-1)+"F_";
});
var _8c=this.data.S;
_8b=_8b.replace(/'([^']*)'/g,function(d,_92){
return (_8c.push(_92)-1)+"S_";
});
_8b=_8b.replace(/"([^"]*)"/g,function(d,_94){
return (_8c.push(_94)-1)+"S_";
});
var _8c=this.data.X;
_8b=_8b.replace(/(^|\W|\_)([\@\.\/A-Za-z][\.\@\/\w:-]*(?:\(\)){0,1})/g,function(d,m1,m2){
return m1+(_8c.push(m2)-1)+"X_";
});
_8b=_8b.replace(/(\.[\.\@\/\w]*)/g,function(d,m1,m2){
return (_8c.push(m1)-1)+"X_";
});
var _8c=this.data.I;
_8b=_8b.replace(/(\d+)(\W)/g,function(d,m1,m2){
return (_8c.push(m1)-1)+"I_"+m2;
});
};
this.insert=function(){
var _9e=this.data;
var _9f=0;
_8b=_8b.replace(/(\d+)([FISXP])_/g,function(d,nr,_a2){
var _a3=_9e[_a2][nr];
if(_a2=="F"){
_9f++;
var _a4="XPath.doXpathFunc('"+_a3+"', ";
if(_a3=="position"){
_a4+="XPath.selectNodes('count(preceding::'+htmlNode.tagName+')', htmlNode)";
}
return _a4;
}else{
if(_a2=="S"){
return "'"+_a3+"'";
}else{
if(_a2=="I"){
return _a3;
}else{
if(_a2=="X"){
if(_8b.indexOf("X")>_8b.indexOf(")")){
_9f=0;
}
if(_9f>0){
return "XPath.selectNodes('"+_a3.replace(/'/g,"\\'")+"', htmlNode)";
}else{
return "XPath.selectNodeExtended('"+_a3.replace(/'/g,"\\'")+"', htmlNode)";
}
}else{
if(_a2=="P"){
return "XPath.selectNodes('"+_a3.replace(/'/g,"\\'")+" ', htmlNode)";
}
}
}
}
}
});
};
}
}
if(IS_SAFARI){
HTMLDocument.prototype.selectNodes=Element.prototype.selectNodes=XMLDocument.prototype.selectNodes=function(_a5,_a6){
return XPath.selectNodes(_a5,_a6||this);
};
HTMLDocument.prototype.selectSingleNode=Element.prototype.selectSingleNode=XMLDocument.prototype.selectSingleNode=function(_a7,_a8){
return XPath.selectNodes(_a7,_a8||this)[0];
};
}

if(!IS_IE&&!self.XSLTProcessor){
XSLTProcessor=_Javeline_XSLTProcessor;
}
function _Javeline_XSLTProcessor(){
this.templates={};
this.paramsSet={};
this.currentTemplate="global";
this.p={"value-of":function(_1,_2,_3,_4){
var _5=this.lookforVariable(_2.getAttribute("select"));
var _6=_1.selectNodes(_5)[0];
if(_6!=null){
if(_6==null){
value="";
}else{
if(_6.nodeType==1){
value=_6.firstChild?_6.firstChild.nodeValue:"";
}else{
value=typeof _6=="object"?_6.nodeValue:_6;
}
}
}else{
value=_5;
}
_4.appendChild(this.xmlDoc.createTextNode(value));
},"copy-of":function(_7,_8,_9,_a){
var _b=XPath.selectNodes(this.lookforVariable(_8.getAttribute("select")),_7)[0];
if(_b){
_a.appendChild(!IS_IE?_a.ownerDocument.importNode(_b,true):_b.cloneNode(true));
}
},"if":function(_c,_d,_e,_f){
var _10=this.lookforVariable(_d.getAttribute("test"));
if(XPath.selectNodes(_10,_c)[0]){
this.parseChildren(_c,_d,_e,_f);
}
},"for-each":function(_11,_12,_13,_14){
var _15=XPath.selectNodes(this.lookforVariable(_12.getAttribute("select")),_11);
for(var i=0;i<_15.length;i++){
this.parseChildren(_15[i],_12,_13,_14);
}
},"attribute":function(_17,_18,_19,_1a){
var _1b=this.xmlDoc.createDocumentFragment();
this.parseChildren(_17,_18,_19,_1b);
_1a.setAttribute(_18.getAttribute("name"),_1b.xml);
},"choose":function(_1c,_1d,_1e,_1f){
var _20=_1d.childNodes;
for(var i=0;i<_20.length;i++){
if(!_20[i].tagName){
continue;
}
if(_20[i][TAGNAME]=="when"){
var _22=_1c.selectNodes(this.lookforVariable(_20[i].getAttribute("test")))[0];
if(_22=="undefined"){
return;
}
}
if(_20[i][TAGNAME]=="otherwise"||(_20[i][TAGNAME]=="when"&&_22)){
return this.parseChildren(_1c,_20[i],_1e[i][2],_1f);
}
}
},"text":function(_23,_24,_25,_26){
if(xmlNode==null){
value="";
}else{
if(xmlNode.nodeType==1){
value=xmlNode.firstChild?xmlNode.firstChild.nodeValue:"";
}else{
value=typeof xmlNode=="object"?xmlNode.nodeValue:xmlNode;
}
}
value=expression;
_26.appendChild(this.xmlDoc.createTextNode(value));
},"call-template":function(_27,_28,_29,_2a){
var t=this.templates[_28.getAttribute("name")];
this.currentTemplate=t;
if(t){
this.parseChildren(_27,t[0],t[1],_2a);
this.withparams(_28);
this.currentTemplate=t;
this.paramsSet[this.currentTemplate]=new Array();
}
},"apply-templates":function(_2c,_2d,_2e,_2f){
if(!_2d){
var _30=_2c.childNodes[0];
var _31=_30.tagName;
var _32=this.lookforTemplate(_31);
if(_32==0){
_32="/";
}
t=this.templates[_32];
if(t){
this.p["apply-templates"].call(this,_2c,t[0],t[1],_2f);
}
}else{
var aux=_2d.getAttribute("match")||_2d.getAttribute("select");
aux=this.lookforVariable(aux);
var _34="";
if(this.templates[aux]){
_34=aux;
}else{
_34=this.lookforTemplate2(aux);
}
if(aux){
this.currentTemplate=_34;
var t=this.templates[_34];
if(t){
var _36=_2c.selectNodes(aux);
var _37;
this.withparams(_2d);
if(_2d.firstChild[TAGNAME]=="sort"){
this.xslSort(_2d.firstChild,_36,_37);
}
if(!_36[0]){
return;
}
for(var i=0;i<_36.length;i++){
if(_2d.firstChild[TAGNAME]=="sort"){
this.parseChildren(_36[_37[i]],t[0],t[1],_2f);
}else{
this.parseChildren(i,t[0],t[1],_2f);
}
this.currentTemplate=_34;
this.paramsSet[this.currentTemplate]=new Array();
}
}
}else{
if(_2d.getAttribute("name")){
var t=this.templates[_2d.getAttribute("name")];
this.currentTemplate=t;
if(t){
this.withparams(_2d);
this.parseChildren(_2c,t[0],t[1],_2f);
this.currentTemplate=t;
this.paramsSet[this.currentTemplate]=new Array();
}
}else{
var _39=_2c.cloneNode(true);
var _3a=this.xmlDoc.createDocumentFragment();
var _36=_39.childNodes;
if(!_36[0]){
return;
}
for(var _3b,i=_36.length-1;i>=0;i--){
if(_36[i].nodeType==3||_36[i].nodeType==4){
continue;
}
if(!_36[i].nodeType==1){
continue;
}
var n=_36[i];
for(_3b in this.templates){
if(_3b=="/"){
continue;
}
var t=this.templates[_3b];
var _3d=n.selectNodes("self::"+_3b);
for(var j=_3d.length-1;j>=0;j--){
var s=_3d[j],p=s.parentNode;
this.parseChildren(s,t[0],t[1],_3a);
this.paramsSet[this.currentTemplate]=new Array();
if(_3a.childNodes){
for(var k=_3a.childNodes.length-1;k>=0;k--){
p.insertBefore(_3a.childNodes[k],s);
}
}
p.removeChild(s);
}
}
if(n.parentNode){
var p=n.parentNode;
this.p["apply-templates"].call(this,n,_2d,_2e,_3a);
if(_3a.childNodes){
for(var k=_3a.childNodes.length-1;k>=0;k--){
p.insertBefore(_3a.childNodes[k],n);
}
}
p.removeChild(n);
}
}
for(var i=_39.childNodes.length-1;i>=0;i--){
_2f.insertBefore(_39.childNodes[i],_2f.firstChild);
}
}
}
}
},cache:{},"import":function(_42,_43,_44,_45){
var _46=_43.getAttribute("href");
if(!this.cache[_46]){
var _47=new HTTP().get(_46,false,true);
this.cache[_46]=_47;
}
},"include":function(_48,_49,_4a,_4b){
},"element":function(_4c,_4d,_4e,_4f){
var _50=this.xmlDoc.createElement(_4d.getAttribute("name"));
this.parseChildren(_4c,_4d,_4e,_50);
_4f.appendChild(_50);
},"param":function(_51,_52,_53,_54){
var _55=_52.getAttribute("name");
if(!this.paramsSet["params"][_55]&&_52.firstChild){
var aux=getNodeValue(_52);
if(aux=="undefined"){
aux=false;
}
this.paramsSet["params"][_55]=aux;
}
},"with-param":function(_57,_58,_59,_5a){
},"variable":function(_5b,_5c,_5d,_5e){
var _5f=_5c.getAttribute("name");
var _60="";
if(!this.paramsSet[this.currentTemplate]){
this.paramsSet[this.currentTemplate]=new Array();
}
if(!this.paramsSet[this.currentTemplate][_5f]){
var _61=this.xmlDoc.createDocumentFragment();
this.parseChildren(_5b,_5c,_5d,_61);
var _62=_61.childNodes;
var _63=_5c.getAttribute("select");
if(_63){
_63=this.lookforVariable(_63);
try{
var _64=_5b.selectNodes(_63)[0];
if(!_64){
_60="";
}else{
if(_64.nodeType==1){
_60=_64.firstChild?_64.firstChild.nodeValue:"";
}else{
_60=typeof _64=="object"?_64.nodeValue:_64;
}
}
if(typeof _64=="number"){
_60=""+_64;
}
}
catch(e){
}
}else{
for(var i=0;i<_62.length;i++){
var _66=getNodeValue(_62[i]);
if(_66!="undefined"){
_60+=_66;
}
}
}
_60=_60.replace(/\s/g,"");
this.paramsSet[this.currentTemplate][_5f]=_60;
}
},"when":function(){
},"otherwise":function(){
},"sort":function(){
},"copy-clone":function(_67,_68,_69,_6a){
_6a=_6a.appendChild(!IS_IE?_6a.ownerDocument.importNode(_68,false):_68.cloneNode(false));
if(_6a.nodeType==1){
for(var i=0;i<_6a.attributes.length;i++){
var _6c=_6a.attributes[i].nodeValue;
if(!IS_SAFARI&&_6a.attributes[i].nodeName.match(/^xmlns/)){
continue;
}
_6a.attributes[i].nodeValue=this.variable(_6a.attributes[i].nodeValue);
_6a.attributes[i].nodeValue=_6a.attributes[i].nodeValue.replace(/\{([^\}]+)\}/g,function(m,_6e){
var _6f=XPath.selectNodes(_6e,_67)[0];
if(!_6f){
value="";
}else{
if(_6f.nodeType==1){
value=_6f.firstChild?_6f.firstChild.nodeValue:"";
}else{
value=typeof _6f=="object"?_6f.nodeValue:_6f;
}
}
return value;
});
_6a.attributes[i].nodeValue;
}
}
this.parseChildren(_67,_68,_69,_6a);
}};
this.xslSort=function(_70,_71,_72){
var _73=_70.getAttribute("select");
var _72=new Array;
var _74=new Array;
for(var i=0;i<_71.length;i++){
var _76=_71[i].selectNodes(_73);
_72[i]=_76;
_74[_76]=i;
}
_72.sort();
var _77=new Array;
for(var i=0;i<_72.length;i++){
_77[_74[_72[i]]]=i;
}
_72=_77;
};
this.parseChildren=function(_78,_79,_7a,_7b){
if(!_7a){
alert("stack empty");
return;
}
if(_7a.length==0){
return;
}
for(var i=0;i<_7a.length;i++){
_7a[i][0].call(this,_78,_7a[i][1],_7a[i][2],_7b);
}
};
this.compile=function(_7d){
var _7e=_7d.childNodes;
for(var _7f=[],i=0;i<_7e.length;i++){
var _80=_7e[i].nodeType;
if(_7e[i][TAGNAME]=="template"){
this.templates[_7e[i].getAttribute("match")||_7e[i].getAttribute("name")]=[_7e[i],this.compile(_7e[i])];
}else{
if(_7e[i][TAGNAME]=="stylesheet"){
_7f=this.compile(_7e[i]);
}else{
if(_7e[i].prefix=="xsl"){
var _81=this.p[_7e[i][TAGNAME]];
if(!_81){
alert("xsl:"+_7e[i][TAGNAME]+" is not supported at this time on this platform");
}else{
_7f.push([_81,_7e[i],this.compile(_7e[i])]);
}
}else{
if(_80!=8){
_7f.push([this.p["copy-clone"],_7e[i],this.compile(_7e[i])]);
}
}
}
}
}
return _7f;
};
this.variable=function(_82){
if(_82.indexOf("$")!=-1){
var _83=_82.match(/\$(\w)*/g);
for(var i=0;i<_83.length;i++){
var aux=_83[i].substring(1);
for(p in this.paramsSet){
if(this.paramsSet[p][aux]){
_82=_82.replace("{"+_83[i]+"}",this.paramsSet[p][aux]);
}
}
}
}
return _82;
};
this.withparams=function(_86){
var _87=_86.childNodes;
for(var i=0;i<_87.length;i++){
if(_87[i][TAGNAME]=="with-param"){
var _89=xslNode.getAttribute("name");
var _8a=_87[i].childNodes;
var _8b=xslNode.getAttribute("select");
if(_8b){
_8b=this.lookforVariable(_8b);
try{
var _8c=context.selectNodes(_8b)[0];
if(!_8c){
tempValue="";
}else{
if(_8c.nodeType==1){
tempValue=_8c.firstChild?_8c.firstChild.nodeValue:"";
}else{
tempValue=typeof _8c=="object"?_8c.nodeValue:_8c;
}
}
if(typeof _8c=="number"){
tempValue=""+_8c;
}
}
catch(e){
}
}else{
for(var i=0;i<_87.length;i++){
var _8d=getNodeValue(_87[i]);
if(_8d!="undefined"){
tempValue+=_8d;
}
}
tempValue=tempValue.replace(/\s/g,"");
this.paramsSet[this.currentTemplate][_89]=tempValue;
}
}
}
};
this.lookforVariable=function(_8e){
if(_8e.indexOf("$")!=-1){
var _8f=0;
var _90=_8e.match(/(=)?\$(\w*)/);
while(_90){
var aux=RegExp.$2;
for(p in this.paramsSet){
if(this.paramsSet[p][aux]){
_8f=1;
if(RegExp.$1=="="){
_8e=_8e.replace("$"+aux,"'"+this.paramsSet[p][aux]+"'");
}else{
var _92=this.paramsSet;
_8e=_8e.replace(/\$(\w*)/,function(d,_94){
if(_94==aux){
return _92[p][aux];
}else{
return _94;
}
});
}
}
}
if(_8f==0){
_8e=_8e.replace("$"+aux,false);
}
_90=_8e.match(/(=)?\$(\w*)/);
}
}
return _8e;
};
this.lookforTemplate=function(_95){
var _96=":"+_95;
for(look in this.templates){
if(look.match(new RegExp(_96))){
if(RegExp.rightContext==null){
return look;
}
}
}
return 0;
};
this.lookforTemplate2=function(_97){
if(_97=="/"){
return "/";
}
var _98=_97.replace(/\[.*\]/g,"");
_98=_98.split("/");
_98=_98[_98.length-1];
for(look in this.templates){
if(look.match(new RegExp(_98))){
if(RegExp.rightContext==null){
return look;
}
}
}
return 0;
};
this.importStylesheet=function(_99){
this.xslDoc=_99.nodeType==9?_99.documentElement:_99;
this.xslStack=this.compile(_99);
this.paramsSet=new Array();
this.paramsSet["params"]=new Array();
this.xslStack.push([this.p["apply-templates"],null]);
};
this.setParameter=function(_9a,_9b,_9c){
_9c=_9c?_9c:"";
this.paramsSet["params"][_9b]=_9c;
};
this.getParameter=function(_9d,_9e){
_9d=""+_9d;
if(this.paramsSet["params"][_9e]){
return this.paramsSet[_9e];
}else{
return null;
}
};
this.clearParameters=function(){
this.paramsSet=new Array();
this.paramsSet["params"]=new Array();
};
this.transformToFragment=function(doc,_a0){
this.xmlDoc=_a0.nodeType!=9?_a0.ownerDocument:_a0;
var _a1=this.xmlDoc.createDocumentFragment();
this.paramsSet["global"]=new Array();
this.currentTemplate="global";
var _a2=this.parseChildren(doc,this.xslDoc,this.xslStack,_a1);
return _a1;
};
}

function Sarissa(){
}
Sarissa.PARSED_OK="Document contains no parsing errors";
Sarissa.PARSED_EMPTY="Document is empty";
Sarissa.PARSED_UNKNOWN_ERROR="Not well-formed or other error";
var _sarissa_iNsCounter=0;
var _SARISSA_IEPREFIX4XSLPARAM="";
var _SARISSA_HAS_DOM_IMPLEMENTATION=document.implementation&&true;
var _SARISSA_HAS_DOM_CREATE_DOCUMENT=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.createDocument;
var _SARISSA_HAS_DOM_FEATURE=_SARISSA_HAS_DOM_IMPLEMENTATION&&document.implementation.hasFeature;
var _SARISSA_IS_MOZ=_SARISSA_HAS_DOM_CREATE_DOCUMENT&&_SARISSA_HAS_DOM_FEATURE;
var _SARISSA_IS_SAFARI=(navigator.userAgent&&navigator.vendor&&(navigator.userAgent.toLowerCase().indexOf("applewebkit")!=-1||navigator.vendor.indexOf("Apple")!=-1));
var _SARISSA_IS_OPERA=navigator.userAgent.toLowerCase().indexOf("opera")!=-1;
var _SARISSA_IS_IE=document.all&&window.ActiveXObject&&navigator.userAgent.toLowerCase().indexOf("msie")>-1&&navigator.userAgent.toLowerCase().indexOf("opera")==-1;
if(!window.Node||!Node.ELEMENT_NODE){
Node={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};
}
if(typeof XMLDocument=="undefined"&&typeof Document!="undefined"){
XMLDocument=Document;
}
if(_SARISSA_IS_IE){
_SARISSA_IEPREFIX4XSLPARAM="xsl:";
var _SARISSA_DOM_PROGID="";
var _SARISSA_XMLHTTP_PROGID="";
var _SARISSA_DOM_XMLWRITER="";
Sarissa.pickRecentProgID=function(_1){
var _2=false;
for(var i=0;i<_1.length&&!_2;i++){
try{
var _4=new ActiveXObject(_1[i]);
o2Store=_1[i];
_2=true;
}
catch(objException){
}
}
if(!_2){
throw "Could not retreive a valid progID of Class: "+_1[_1.length-1]+". (original exception: "+e+")";
}
_1=null;
return o2Store;
};
_SARISSA_DOM_PROGID=null;
_SARISSA_THREADEDDOM_PROGID=null;
_SARISSA_XSLTEMPLATE_PROGID=null;
_SARISSA_XMLHTTP_PROGID=null;
if(!window.XMLHttpRequest){
XMLHttpRequest=function(){
if(!_SARISSA_XMLHTTP_PROGID){
_SARISSA_XMLHTTP_PROGID=Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"]);
}
return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
};
}
Sarissa.getDomDocument=function(_5,_6){
if(!_SARISSA_DOM_PROGID){
_SARISSA_DOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"]);
}
var _7=new ActiveXObject(_SARISSA_DOM_PROGID);
if(_6){
var _8="";
if(_5){
if(_6.indexOf(":")>1){
_8=_6.substring(0,_6.indexOf(":"));
_6=_6.substring(_6.indexOf(":")+1);
}else{
_8="a"+(_sarissa_iNsCounter++);
}
}
if(_5){
_7.loadXML("<"+_8+":"+_6+" xmlns:"+_8+"=\""+_5+"\""+" />");
}else{
_7.loadXML("<"+_6+" />");
}
}
return _7;
};
Sarissa.getParseErrorText=function(_9){
var _a=Sarissa.PARSED_OK;
if(_9.parseError.errorCode!=0){
_a="XML Parsing Error: "+_9.parseError.reason+"\nLocation: "+_9.parseError.url+"\nLine Number "+_9.parseError.line+", Column "+_9.parseError.linepos+":\n"+_9.parseError.srcText+"\n";
for(var i=0;i<_9.parseError.linepos;i++){
_a+="-";
}
_a+="^\n";
}else{
if(_9.documentElement==null){
_a=Sarissa.PARSED_EMPTY;
}
}
return _a;
};
Sarissa.setXpathNamespaces=function(_c,_d){
_c.setProperty("SelectionLanguage","XPath");
_c.setProperty("SelectionNamespaces",_d);
};
XSLTProcessor=function(){
if(!_SARISSA_XSLTEMPLATE_PROGID){
_SARISSA_XSLTEMPLATE_PROGID=Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.6.0","MSXML2.XSLTemplate.3.0"]);
}
this.template=new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
this.processor=null;
};
XSLTProcessor.prototype.importStylesheet=function(_e){
if(!_SARISSA_THREADEDDOM_PROGID){
_SARISSA_THREADEDDOM_PROGID=Sarissa.pickRecentProgID(["MSXML2.FreeThreadedDOMDocument.6.0","MSXML2.FreeThreadedDOMDocument.3.0"]);
}
_e.setProperty("SelectionLanguage","XPath");
_e.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _f=new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
if(_e.url&&_e.selectSingleNode("//xsl:*[local-name() = 'import' or local-name() = 'include']")!=null){
_f.async=false;
if(_SARISSA_THREADEDDOM_PROGID=="MSXML2.FreeThreadedDOMDocument.6.0"){
_f.setProperty("AllowDocumentFunction",true);
_f.resolveExternals=true;
}
_f.load(_e.url);
}else{
_f.loadXML(_e.xml);
}
_f.setProperty("SelectionNamespaces","xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
var _10=_f.selectSingleNode("//xsl:output");
this.outputMethod=_10?_10.getAttribute("method"):"html";
this.template.stylesheet=_f;
this.processor=this.template.createProcessor();
this.paramsSet=new Array();
};
XSLTProcessor.prototype.transformToDocument=function(_11){
if(_SARISSA_THREADEDDOM_PROGID){
this.processor.input=_11;
var _12=new ActiveXObject(_SARISSA_DOM_PROGID);
this.processor.output=_12;
this.processor.transform();
return _12;
}else{
if(!_SARISSA_DOM_XMLWRITER){
_SARISSA_DOM_XMLWRITER=Sarissa.pickRecentProgID(["Msxml2.MXXMLWriter.6.0","Msxml2.MXXMLWriter.3.0","MSXML2.MXXMLWriter","MSXML.MXXMLWriter","Microsoft.XMLDOM"]);
}
this.processor.input=_11;
var _12=new ActiveXObject(_SARISSA_DOM_XMLWRITER);
this.processor.output=_12;
this.processor.transform();
var _13=new ActiveXObject(_SARISSA_DOM_PROGID);
_13.loadXML(_12.output+"");
return _13;
}
};
XSLTProcessor.prototype.transformToFragment=function(_14,_15){
this.processor.input=_14;
this.processor.transform();
var s=this.processor.output;
var f=_15.createDocumentFragment();
if(this.outputMethod=="text"){
f.appendChild(_15.createTextNode(s));
}else{
if(_15.body&&_15.body.innerHTML){
var _18=_15.createElement("div");
_18.innerHTML=s;
while(_18.hasChildNodes()){
f.appendChild(_18.firstChild);
}
}else{
var _19=new ActiveXObject(_SARISSA_DOM_PROGID);
if(s.substring(0,5)=="<?xml"){
s=s.substring(s.indexOf("?>")+2);
}
var xml="".concat("<my>",s,"</my>");
_19.loadXML(xml);
var _18=_19.documentElement;
while(_18.hasChildNodes()){
f.appendChild(_18.firstChild);
}
}
}
return f;
};
XSLTProcessor.prototype.setParameter=function(_1b,_1c,_1d){
if(_1b){
this.processor.addParameter(_1c,_1d,_1b);
}else{
this.processor.addParameter(_1c,_1d);
}
if(!this.paramsSet[""+_1b]){
this.paramsSet[""+_1b]=new Array();
}
this.paramsSet[""+_1b][_1c]=_1d;
};
XSLTProcessor.prototype.getParameter=function(_1e,_1f){
_1e=_1e||"";
if(this.paramsSet[_1e]&&this.paramsSet[_1e][_1f]){
return this.paramsSet[_1e][_1f];
}else{
return null;
}
};
XSLTProcessor.prototype.clearParameters=function(){
for(var _20 in this.paramsSet){
for(var _21 in this.paramsSet[_20]){
if(_20){
this.processor.addParameter(_21,null,_20);
}else{
this.processor.addParameter(_21,null);
}
}
}
this.paramsSet=new Array();
};
}else{
if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(_22){
Sarissa.__setReadyState__(_22,4);
};
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(_23,_24){
_23.readyState=_24;
_23.readystate=_24;
if(_23.onreadystatechange!=null&&typeof _23.onreadystatechange=="function"){
_23.onreadystatechange();
}
};
Sarissa.getDomDocument=function(_25,_26){
var _27=document.implementation.createDocument(_25?_25:null,_26?_26:null,null);
if(!_27.onreadystatechange){
_27.onreadystatechange=null;
}
if(!_27.readyState){
_27.readyState=0;
}
_27.addEventListener("load",_sarissa_XMLDocument_onload,false);
return _27;
};
if(window.XMLDocument){
}else{
if(_SARISSA_HAS_DOM_FEATURE&&window.Document&&!Document.prototype.load&&document.implementation.hasFeature("LS","3.0")){
Sarissa.getDomDocument=function(_28,_29){
var _2a=document.implementation.createDocument(_28?_28:null,_29?_29:null,null);
return _2a;
};
}else{
Sarissa.getDomDocument=function(_2b,_2c){
var _2d=document.implementation.createDocument(_2b?_2b:null,_2c?_2c:null,null);
if(_2d&&(_2b||_2c)&&!_2d.documentElement){
_2d.appendChild(_2d.createElementNS(_2b,_2c));
}
return _2d;
};
}
}
}
}
if(!window.DOMParser){
if(_SARISSA_IS_SAFARI){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_2e,_2f){
var _30=new XMLHttpRequest();
_30.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(_2e),false);
_30.send(null);
return _30.responseXML;
};
}else{
if(Sarissa.getDomDocument&&Sarissa.getDomDocument()&&Sarissa.getDomDocument(null,"bar").xml){
DOMParser=function(){
};
DOMParser.prototype.parseFromString=function(_31,_32){
var doc=Sarissa.getDomDocument();
doc.loadXML(_31);
return doc;
};
}
}
}
if((typeof (document.importNode)=="undefined")&&_SARISSA_IS_IE){
try{
document.importNode=function(_34,_35){
var tmp;
if(_34.nodeName=="tbody"||_34.nodeName=="tr"){
tmp=document.createElement("table");
}else{
if(_34.nodeName=="td"){
tmp=document.createElement("tr");
}else{
if(_34.nodeName=="option"){
tmp=document.createElement("select");
}else{
tmp=document.createElement("div");
}
}
}
if(_35){
tmp.innerHTML=_34.xml?_34.xml:_34.outerHTML;
}else{
tmp.innerHTML=_34.xml?_34.cloneNode(false).xml:_34.cloneNode(false).outerHTML;
}
return tmp.getElementsByTagName("*")[0];
};
}
catch(e){
}
}
if(!Sarissa.getParseErrorText){
Sarissa.getParseErrorText=function(_37){
var _38=Sarissa.PARSED_OK;
if(!_37.documentElement){
_38=Sarissa.PARSED_EMPTY;
}else{
if(_37.documentElement.tagName=="parsererror"){
_38=_37.documentElement.firstChild.data;
_38+="\n"+_37.documentElement.firstChild.nextSibling.firstChild.data;
}else{
if(_37.getElementsByTagName("parsererror").length>0){
var _39=_37.getElementsByTagName("parsererror")[0];
_38=Sarissa.getText(_39,true)+"\n";
}else{
if(_37.parseError&&_37.parseError.errorCode!=0){
_38=Sarissa.PARSED_UNKNOWN_ERROR;
}
}
}
}
return _38;
};
}
Sarissa.getText=function(_3a,_3b){
var s="";
var _3d=_3a.childNodes;
for(var i=0;i<_3d.length;i++){
var _3f=_3d[i];
var _40=_3f.nodeType;
if(_40==Node.TEXT_NODE||_40==Node.CDATA_SECTION_NODE){
s+=_3f.data;
}else{
if(_3b==true&&(_40==Node.ELEMENT_NODE||_40==Node.DOCUMENT_NODE||_40==Node.DOCUMENT_FRAGMENT_NODE)){
s+=Sarissa.getText(_3f,true);
}
}
}
return s;
};
if(!window.XMLSerializer&&Sarissa.getDomDocument&&Sarissa.getDomDocument("","foo",null).xml){
XMLSerializer=function(){
};
XMLSerializer.prototype.serializeToString=function(_41){
return _41.xml;
};
}
Sarissa.stripTags=function(s){
return s.replace(/<[^>]+>/g,"");
};
Sarissa.clearChildNodes=function(_43){
while(_43.firstChild){
_43.removeChild(_43.firstChild);
}
};
Sarissa.copyChildNodes=function(_44,_45,_46){
if((!_44)||(!_45)){
throw "Both source and destination nodes must be provided";
}
if(!_46){
Sarissa.clearChildNodes(_45);
}
var _47=_45.nodeType==Node.DOCUMENT_NODE?_45:_45.ownerDocument;
var _48=_44.childNodes;
if(typeof (_47.importNode)!="undefined"){
for(var i=0;i<_48.length;i++){
_45.appendChild(_47.importNode(_48[i],true));
}
}else{
for(var i=0;i<_48.length;i++){
_45.appendChild(_48[i].cloneNode(true));
}
}
};
Sarissa.moveChildNodes=function(_4a,_4b,_4c){
if((!_4a)||(!_4b)){
throw "Both source and destination nodes must be provided";
}
if(!_4c){
Sarissa.clearChildNodes(_4b);
}
var _4d=_4a.childNodes;
if(_4a.ownerDocument==_4b.ownerDocument){
while(_4a.firstChild){
_4b.appendChild(_4a.firstChild);
}
}else{
var _4e=_4b.nodeType==Node.DOCUMENT_NODE?_4b:_4b.ownerDocument;
if(typeof (_4e.importNode)!="undefined"){
for(var i=0;i<_4d.length;i++){
_4b.appendChild(_4e.importNode(_4d[i],true));
}
}else{
for(var i=0;i<_4d.length;i++){
_4b.appendChild(_4d[i].cloneNode(true));
}
}
Sarissa.clearChildNodes(_4a);
}
};
Sarissa.xmlize=function(_50,_51,_52){
_52=_52?_52:"";
var s=_52+"<"+_51+">";
var _54=false;
if(!(_50 instanceof Object)||_50 instanceof Number||_50 instanceof String||_50 instanceof Boolean||_50 instanceof Date){
s+=Sarissa.escape(""+_50);
_54=true;
}else{
s+="\n";
var _55="";
var _56=_50 instanceof Array;
for(var _57 in _50){
s+=Sarissa.xmlize(_50[_57],(_56?"array-item key=\""+_57+"\"":_57),_52+"   ");
}
s+=_52;
}
return s+=(_51.indexOf(" ")!=-1?"</array-item>\n":"</"+_51+">\n");
};
Sarissa.escape=function(_58){
return _58.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
};
Sarissa.unescape=function(_59){
return _59.replace(/&apos;/g,"'").replace(/&quot;/g,"\"").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
};

Sarissa.updateCursor=function(_1,_2){
if(_1&&_1.style&&_1.style.cursor!=undefined){
_1.style.cursor=_2;
}
};
Sarissa.updateContentFromURI=function(_3,_4,_5,_6,_7){
try{
Sarissa.updateCursor(_4,"wait");
var _8=new XMLHttpRequest();
_8.open("GET",_3);
function sarissa_dhtml_loadHandler(){
if(_8.readyState==4){
Sarissa.updateContentFromNode(_8.responseXML,_4,_5,_6);
}
}
_8.onreadystatechange=sarissa_dhtml_loadHandler;
if(_7){
var _9="Sat, 1 Jan 2000 00:00:00 GMT";
_8.setRequestHeader("If-Modified-Since",_9);
}
_8.send("");
}
catch(e){
Sarissa.updateCursor(_4,"auto");
throw e;
}
};
Sarissa.updateContentFromNode=function(_a,_b,_c,_d){
try{
Sarissa.updateCursor(_b,"wait");
Sarissa.clearChildNodes(_b);
var _e=_a.nodeType==Node.DOCUMENT_NODE?_a:_a.ownerDocument;
if(_e.parseError&&_e.parseError!=0){
var _f=document.createElement("pre");
_f.appendChild(document.createTextNode(Sarissa.getParseErrorText(_e)));
_b.appendChild(_f);
}else{
if(_c){
_a=_c.transformToDocument(_a);
}
if(_b.tagName.toLowerCase()=="textarea"||_b.tagName.toLowerCase()=="input"){
_b.value=new XMLSerializer().serializeToString(_a);
}else{
if(_a.nodeType==Node.DOCUMENT_NODE||_a.ownerDocument.documentElement==_a){
_b.innerHTML=new XMLSerializer().serializeToString(_a);
}else{
_b.appendChild(_b.ownerDocument.importNode(_a,true));
}
}
}
if(_d){
_d(_a,_b);
}
}
catch(e){
throw e;
}
finally{
Sarissa.updateCursor(_b,"auto");
}
};

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
if(window.XMLDocument&&(!XMLDocument.prototype.setProperty)){
XMLDocument.prototype.setProperty=function(x,y){
};
}
Sarissa.setXpathNamespaces=function(_5,_6){
_5._sarissa_useCustomResolver=true;
var _7=_6.indexOf(" ")>-1?_6.split(" "):new Array(_6);
_5._sarissa_xpathNamespaces=new Array(_7.length);
for(var i=0;i<_7.length;i++){
var ns=_7[i];
var _a=ns.indexOf(":");
var _b=ns.indexOf("=");
if(_a>0&&_b>_a+1){
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
XMLDocument.prototype.selectNodes=function(_e,_f,_10){
var _11=this;
var _12=this._sarissa_useCustomResolver?function(_13){
var s=_11._sarissa_xpathNamespaces[_13];
if(s){
return s;
}else{
throw "No namespace URI found for prefix: '"+_13+"'";
}
}:this.createNSResolver(this.documentElement);
var _15=null;
if(!_10){
var _16=this.evaluate(_e,(_f?_f:this),_12,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
var _17=new SarissaNodeList(_16.snapshotLength);
_17.expr=_e;
for(var i=0;i<_17.length;i++){
_17[i]=_16.snapshotItem(i);
}
_15=_17;
}else{
_15=_16=this.evaluate(_e,(_f?_f:this),_12,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
}
return _15;
};
Element.prototype.selectNodes=function(_19){
var doc=this.ownerDocument;
if(doc.selectNodes){
return doc.selectNodes(_19,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
XMLDocument.prototype.selectSingleNode=function(_1b,_1c){
var ctx=_1c?_1c:null;
return this.selectNodes(_1b,ctx,true);
};
Element.prototype.selectSingleNode=function(_1e){
var doc=this.ownerDocument;
if(doc.selectSingleNode){
return doc.selectSingleNode(_1e,this);
}else{
throw "Method selectNodes is only supported by XML Elements";
}
};
Sarissa.IS_ENABLED_SELECT_NODES=true;
}

var PI=Math.PI;
var HALF_PI=PI*0.5;
var TWO_PI=PI*2;
var R2D=57.2957795131;
var D2R=0.0174532925199;
var SEC_TO_RAD=0.00000484813681109536;
var EPSLN=1e-100;
var SRS_WGS84_SEMIMAJOR=6378137;
var PJD_UNKNOWN=0;
var PJD_3PARAM=1;
var PJD_7PARAM=2;
var PJD_GRIDSHIFT=3;
var PJD_WGS84=4;
var csErrorMessage="";
function PT(x,y){
this.x=x;
this.y=y;
this.z=0;
}
var csList=new Object();
csList.EPSG4326="+title=long / lat WGS84 +proj=longlat";
csList.EPSG4269="+title=long / lat NAD83 +proj=longlat";
function CS(_3){
if(!_3){
var _3=csList.EPSG4326;
csErrorMessage+="No coordinate system definition provided, assuming longlat WGS83";
}
var _4,paramVal;
var _5=_3.split("+");
for(var _6=0;_6<_5.length;_6++){
property=_5[_6].split("=");
_4=property[0].toLowerCase();
paramVal=property[1];
switch(_4.replace(/\s/gi,"")){
case "":
break;
case "title":
this.title=paramVal;
break;
case "proj":
this.proj=paramVal.replace(/\s/gi,"");
break;
case "ellps":
this.ellps=paramVal.replace(/\s/gi,"");
break;
case "datum":
this.datum=paramVal.replace(/\s/gi,"");
break;
case "a":
this.a=parseFloat(paramVal);
break;
case "b":
this.b=parseFloat(paramVal);
break;
case "lat_1":
this.lat1=paramVal*D2R;
break;
case "lat_2":
this.lat2=paramVal*D2R;
break;
case "alpha":
this.alpha=paramVal*D2R;
break;
case "lonc":
this.longc=paramVal*D2R;
break;
case "lon_0":
this.long0=paramVal*D2R;
break;
case "lat_0":
this.lat0=paramVal*D2R;
break;
case "x_0":
this.x0=parseFloat(paramVal);
break;
case "y_0":
this.y0=parseFloat(paramVal);
break;
case "k":
this.k0=parseFloat(paramVal);
break;
case "R_A":
this.R=parseFloat(paramVal);
break;
case "to_meter":
this.to_meter=parseFloat(paramVal);
break;
case "to_meter":
this.to_meter=eval(paramVal);
break;
case "zone":
this.zone=parseInt(paramVal);
break;
case "towgs84":
this.datum_params=paramVal.split(",");
break;
case "units":
this.units=paramVal.replace(/\s/gi,"");
break;
case "from_greenwich":
this.from_greenwich=paramVal*D2R;
break;
default:
csErrorMessage+="\nUnrecognized parameter: "+_4;
}
}
if(this.datum_params){
for(var i=0;i<this.datum_params.length;i++){
this.datum_params[i]=parseFloat(this.datum_params[i]);
}
if(this.datum_params[0]!=0||this.datum_params[1]!=0||this.datum_params[2]!=0){
this.datum_type=PJD_3PARAM;
}
if(this.datum_params.length>3){
if(this.datum_params[3]!=0||this.datum_params[4]!=0||this.datum_params[5]!=0||this.datum_params[6]!=0){
this.datum_type=PJD_7PARAM;
this.datum_params[3]*=SEC_TO_RAD;
this.datum_params[4]*=SEC_TO_RAD;
this.datum_params[5]*=SEC_TO_RAD;
this.datum_params[6]=(this.datum_params[6]/1000000)+1;
}
}
}
if(!this.datum_type){
this.datum_type=PJD_WGS84;
}
if(this.ellps=="GRS80"){
this.a=6378137;
this.b=6356752.31414036;
}
if(this.ellps=="WGS84"){
this.a=6378137;
this.b=6356752.31424518;
}
if(this.ellps=="WGS72"){
this.a=6378135;
this.b=6356750.52001609;
}
if(this.ellps=="intl"){
this.a=6378388;
this.b=6356911.94612795;
}
if(this.ellps=="clrk66"){
this.a=6378206.4;
this.b=6356583.8;
}
if(this.ellps=="airy"){
this.a=6377563.396;
this.b=6356256.91;
}
if(this.ellps=="mod_airy"){
this.a=6377340.189;
this.b=6356034.446;
}
if(this.ellps=="new_intl"){
this.a=6378157.5;
this.b=6356772.2;
}
if(this.ellps=="plessis"){
this.a=6376523;
this.b=6355863;
}
if(this.ellps=="SEasia"){
this.a=6378155;
this.b=6356773.3205;
}
if(this.ellps=="walbeck"){
this.a=6376896;
this.b=6355834.8467;
}
if(this.ellps=="sphere"){
this.a=6370997;
this.b=6370997;
}
if(this.ellps=="MERIT"){
this.a=6378137;
this.b=6356752.298215968;
}
if(this.ellps=="SGS85"){
this.a=6378136;
this.b=6356751.30156878;
}
if(this.ellps=="IAU76"){
this.a=6378137;
this.b=6356752.314140356;
}
if(this.ellps=="APL4.9"){
this.a=6378137;
this.b=6356751.7963118;
}
if(this.ellps=="NW9LD"){
this.a=6378145;
this.b=6356759.76948868;
}
if(this.ellps=="andrae"){
this.a=6377104.43;
this.b=6355847.415233334;
}
if(this.ellps=="aust_SA"){
this.a=6378160;
this.b=356774.7191953;
}
if(this.ellps=="GRS67"){
this.a=6378160;
this.b=6356774.5160907;
}
if(this.ellps=="bessel"){
this.a=6377397.155;
this.b=6356078.96281818;
}
if(this.ellps=="bess_nam"){
this.a=6377483.865;
this.b=6356165.3829663;
}
if(this.ellps=="CPM"){
this.a=6375738.7;
this.b=6356666.22191211;
}
if(this.ellps=="clrk80"){
this.a=6378249.145;
this.b=6356514.965828;
}
if(this.ellps=="delmbr"){
this.a=6376428;
this.b=6355957.926163724;
}
if(this.ellps=="engelis"){
this.a=6378136.05;
this.b=6356751.32272;
}
if(this.ellps=="evrst30"){
this.a=6377276.345;
this.b=6356075.41314024;
}
if(this.ellps=="evrst48"){
this.a=6377304.063;
this.b=6356103.038993;
}
if(this.ellps=="evrst56"){
this.a=6377301.243;
this.b=6356100.228368102;
}
if(this.ellps=="evrst69"){
this.a=6377295.664;
this.b=6356094.6679152;
}
if(this.ellps=="evrstSS"){
this.a=6377298.556;
this.b=6356097.550300896;
}
if(this.ellps=="fschr60"){
this.a=6378166;
this.b=6356784.283607;
}
if(this.ellps=="fschr60m"){
this.a=6378155;
this.b=6356773.3204827;
}
if(this.ellps=="fschr68"){
this.a=6378150;
this.b=6356768.337244;
}
if(this.ellps=="helmert "){
this.a=6378200;
this.b=6356818.16962789;
}
if(this.ellps=="hough"){
this.a=6378270;
this.b=6356794.343434343;
}
if(this.ellps=="krass"){
this.a=6378245;
this.b=63568630.18773;
}
if(this.ellps=="kaula"){
this.a=6378163;
this.b=6356776.9920869;
}
if(this.ellps=="lerch"){
this.a=6378139;
this.b=6356754.29151034;
}
if(this.ellps=="mprts"){
this.a=6397300;
this.b=6363806.282722513;
}
if(this.ellps=="WGS60"){
this.a=6378165;
this.b=6356783.2869594;
}
if(this.ellps=="WGS66"){
this.a=6378145;
this.b=6356759.76948868;
}
if(!this.a){
this.a=6378137;
this.b=6356752.31424518;
csErrorMessage+="\nEllipsoid parameters not provided, assuming WGS84";
}
this.a2=this.a*this.a;
this.b2=this.b*this.b;
this.es=(this.a2-this.b2)/this.a2;
this.e=Math.sqrt(this.es);
this.ep2=(this.a2-this.b2)/this.b2;
if(this.proj!="longlat"){
this.Forward=eval(this.proj+"Fwd");
this.Inverse=eval(this.proj+"Inv");
this.Init=eval(this.proj+"Init");
this.Init(this);
}
}
function cs_transform(_8,_9,_a){
pj_errno=0;
if(_8.proj=="longlat"){
_a.x*=D2R;
_a.y*=D2R;
}else{
if(_8.to_meter){
_a.x*=_8.to_meter;
_a.y*=_8.to_meter;
}
_8.Inverse(_a);
}
if(_8.from_greenwich){
_a.x+=_8.from_greenwich;
}
if(cs_datum_transform(_8,_9,_a)!=0){
return pj_errno;
}
if(_9.from_greenwich){
_a.x-=_9.from_greenwich;
}
if(_9.proj=="longlat"){
_a.x*=R2D;
_a.y*=R2D;
}else{
_9.Forward(_a);
if(_9.to_meter){
_a.x/=_9.to_meter;
_a.y/=_9.to_meter;
}
}
}
function cs_datum_transform(_b,_c,_d){
if(cs_compare_datums(_b,_c)){
return 0;
}
if(_b.datum_type==PJD_GRIDSHIFT){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("gridShiftError"));
}
}
if(_c.datum_type==PJD_GRIDSHIFT){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("gridShiftError"));
}
}
if(_b.datum_type==PJD_3PARAM||_b.datum_type==PJD_7PARAM||_c.datum_type==PJD_3PARAM||_c.datum_type==PJD_7PARAM){
cs_geodetic_to_geocentric(_b,_d);
if(_b.datum_type==PJD_3PARAM||_b.datum_type==PJD_7PARAM){
cs_geocentric_to_wgs84(_b,_d);
}
if(_c.datum_type==PJD_3PARAM||_c.datum_type==PJD_7PARAM){
cs_geocentric_from_wgs84(_c,_d);
}
cs_geocentric_to_geodetic(_c,_d);
}
if(_c.datum_type==PJD_GRIDSHIFT){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("gridShiftError"));
}
}
return 0;
}
function cs_compare_datums(_e,_f){
if(_e.datum_type!=_f.datum_type){
return 0;
}else{
if(_e.datum_type==PJD_3PARAM){
return (_e.datum_params[0]==_f.datum_params[0]&&_e.datum_params[1]==_f.datum_params[1]&&_e.datum_params[2]==_f.datum_params[2]);
}else{
if(_e.datum_type==PJD_7PARAM){
return (_e.datum_params[0]==_f.datum_params[0]&&_e.datum_params[1]==_f.datum_params[1]&&_e.datum_params[2]==_f.datum_params[2]&&_e.datum_params[3]==_f.datum_params[3]&&_e.datum_params[4]==_f.datum_params[4]&&_e.datum_params[5]==_f.datum_params[5]&&_e.datum_params[6]==_f.datum_params[6]);
}else{
if(_e.datum_type==PJD_GRIDSHIFT){
return strcmp(pj_param(_e.params,"snadgrids").s,pj_param(_f.params,"snadgrids").s)==0;
}else{
return 1;
}
}
}
}
}

var GEOCENT_LAT_ERROR=1;
var COS_67P5=0.3826834323650898;
var AD_C=1.0026;
function cs_geodetic_to_geocentric(cs,p){
var _3=p.x;
var _4=p.y;
var _5=p.z;
var X;
var Y;
var Z;
var _9=0;
var Rn;
var _b;
var _c;
var _d;
if(_4<-HALF_PI&&_4>-1.001*HALF_PI){
_4=-HALF_PI;
}else{
if(_4>HALF_PI&&_4<1.001*HALF_PI){
_4=HALF_PI;
}else{
if((_4<-HALF_PI)||(_4>HALF_PI)){
_9|=GEOCENT_LAT_ERROR;
}
}
}
if(!_9){
if(_3>PI){
_3-=(2*PI);
}
_b=Math.sin(_4);
_d=Math.cos(_4);
_c=_b*_b;
Rn=cs.a/(Math.sqrt(1-cs.es*_c));
X=(Rn+_5)*_d*Math.cos(_3);
Y=(Rn+_5)*_d*Math.sin(_3);
Z=((Rn*(1-cs.es))+_5)*_b;
}
p.x=X;
p.y=Y;
p.z=Z;
return _9;
}
function cs_geocentric_to_geodetic(cs,p){
var X=p.x;
var Y=p.y;
var Z=p.z;
var _13;
var _14;
var _15;
var W;
var W2;
var T0;
var T1;
var S0;
var S1;
var _1c;
var _1d;
var _1e;
var _1f;
var _20;
var Rn;
var Sum;
var _23;
X=parseFloat(X);
Y=parseFloat(Y);
Z=parseFloat(Z);
_23=false;
if(X!=0){
_13=Math.atan2(Y,X);
}else{
if(Y>0){
_13=HALF_PI;
}else{
if(Y<0){
_13=-HALF_PI;
}else{
_23=true;
_13=0;
if(Z>0){
_14=HALF_PI;
}else{
if(Z<0){
_14=-HALF_PI;
}else{
_14=HALF_PI;
_15=-cs.b;
return;
}
}
}
}
}
W2=X*X+Y*Y;
W=Math.sqrt(W2);
T0=Z*AD_C;
S0=Math.sqrt(T0*T0+W2);
_1c=T0/S0;
_1e=W/S0;
_1d=_1c*_1c*_1c;
T1=Z+cs.b*cs.ep2*_1d;
Sum=W-cs.a*cs.es*_1e*_1e*_1e;
S1=Math.sqrt(T1*T1+Sum*Sum);
_1f=T1/S1;
_20=Sum/S1;
Rn=cs.a/Math.sqrt(1-cs.es*_1f*_1f);
if(_20>=COS_67P5){
_15=W/_20-Rn;
}else{
if(_20<=-COS_67P5){
_15=W/-_20-Rn;
}else{
_15=Z/_1f+Rn*(cs.es-1);
}
}
if(_23==false){
_14=Math.atan(_1f/_20);
}
p.x=_13;
p.y=_14;
p.z=_15;
return 0;
}
function cs_geocentric_to_wgs84(_24,p){
if(_24.datum_type==PJD_3PARAM){
p.x+=_24.datum_params[0];
p.y+=_24.datum_params[1];
p.z+=_24.datum_params[2];
}else{
var _26=_24.datum_params[0];
var _27=_24.datum_params[1];
var _28=_24.datum_params[2];
var _29=_24.datum_params[3];
var _2a=_24.datum_params[4];
var _2b=_24.datum_params[5];
var _2c=_24.datum_params[6];
var _2d=_2c*(p.x-_2b*p.y+_2a*p.z)+_26;
var _2e=_2c*(_2b*p.x+p.y-_29*p.z)+_27;
var _2f=_2c*(-_2a*p.x+_29*p.y+p.z)+_28;
p.x=_2d;
p.y=_2e;
p.z=_2f;
}
}
function cs_geocentric_from_wgs84(_30,p){
if(_30.datum_type==PJD_3PARAM){
p.x-=_30.datum_params[0];
p.y-=_30.datum_params[1];
p.z-=_30.datum_params[2];
}else{
var _32=_30.datum_params[0];
var _33=_30.datum_params[1];
var _34=_30.datum_params[2];
var _35=_30.datum_params[3];
var _36=_30.datum_params[4];
var _37=_30.datum_params[5];
var _38=_30.datum_params[6];
var _39=(p.x-_32)/_38;
var _3a=(p.y-_33)/_38;
var _3b=(p.z-_34)/_38;
p.x=_39+_37*_3a-_36*_3b;
p.y=-_37*_39+_3a+_35*_3b;
p.z=_36*_39-_35*_3a+_3b;
}
}

var MB_IS_MOZ=(document.implementation&&document.implementation.createDocument)?true:false;
function XslProcessor(_1,_2){
if(!MB_IS_MOZ){
_SARISSA_DOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.DOMDocument.3.0","Msxml2.DOMDocument.6.0"],[["SELECT_NODES",2],["TRANSFORM_NODE",2]]);
_SARISSA_XMLHTTP_PROGID=Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.3.0","MSXML2.XMLHTTP.6.0"],[["XMLHTTP",4]]);
_SARISSA_THREADEDDOM_PROGID=Sarissa.pickRecentProgID(["Msxml2.FreeThreadedDOMDocument.3.0","MSXML2.FreeThreadedDOMDocument.6.0"]);
_SARISSA_XSLTEMPLATE_PROGID=Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.3.0","MSXML2.XSLTemplate.6.0"],[["XSLTPROC",2]]);
}
this.xslUrl=_1;
this.xslDom=Sarissa.getDomDocument();
this.xslDom.async=false;
if(!MB_IS_MOZ){
try{
this.xslDom.validateOnParse=false;
this.xslDom.setProperty("AllowDocumentFunction",true);
this.xslDom.resolveExternals=true;
}
catch(e){
}
}
if(typeof (inlineXSL)!="undefined"){
xmlString=inlineXSL[_1];
xmlString=xmlString.replace(/DOUBLE_QUOTE/g,"\"");
this.xslDom=(new DOMParser()).parseFromString(xmlString,"text/xml");
}else{
if(_SARISSA_IS_SAFARI){
var _3=new XMLHttpRequest();
_3.open("GET",_1,false);
_3.send(null);
this.xslDom=_3.responseXML;
}else{
this.xslDom.load(_1);
}
}
if(Sarissa.getParseErrorText(this.xslDom)!=Sarissa.PARSED_OK){
alert(mbGetMessage("errorLoadingStylesheet",_1));
}
this.processor=new XSLTProcessor();
this.processor.importStylesheet(this.xslDom);
this.docNSUri=_2;
this.transformNodeToString=function(_4){
try{
if(_SARISSA_IS_IE){
var _5=(new XMLSerializer()).serializeToString(_4);
var _4=(new DOMParser()).parseFromString(_5,"text/xml");
}
var _6=this.transformNodeToObject(_4);
var s=(new XMLSerializer()).serializeToString(_6);
if(_SARISSA_IS_OPERA){
s=s.replace(/.*\?\>/,"");
}
return s;
}
catch(e){
alert(mbGetMessage("exceptionTransformingDoc",this.xslUrl));
alert("XSL="+(new XMLSerializer()).serializeToString(this.xslDom));
alert("XML="+(new XMLSerializer()).serializeToString(_4));
}
};
this.transformNodeToObject=function(_8){
if(_SARISSA_IS_SAFARI){
var _9=new DOMParser().parseFromString("<xsltresult></xsltresult>","text/xml");
var _a=this.processor.transformToFragment(_8,_9);
var _b=(new XMLSerializer()).serializeToString(_a);
_b.replace(/\s/g,"");
}else{
var _a=this.processor.transformToDocument(_8);
}
return _a;
};
this.setParameter=function(_c,_d,_e){
if(!_d){
return;
}
this.processor.setParameter(null,_c,_d);
};
}
function postLoad(_f,_10,_11){
var _12=new XMLHttpRequest();
if(_f.indexOf("http://")==0){
_12.open("POST",config.proxyUrl,false);
_12.setRequestHeader("serverUrl",_f);
}else{
_12.open("POST",_f,false);
}
_12.setRequestHeader("content-type","text/xml");
if(_11){
_12.setRequestHeader("content-type",_11);
}
_12.send(_10);
if(_12.status>=400){
alert(mbGetMessage("errorLoadingDocument",_f,_12.statusText,_12.responseText));
var _13=Sarissa.getDomDocument();
_13.parseError=-1;
return _13;
}else{
if(null==_12.responseXML){
alert(mbGetMessage("nullXmlResponse",_12.responseText));
}
return _12.responseXML;
}
}
function postGetLoad(_14,_15,_16,dir,_18){
var _19=new XMLHttpRequest();
if(_14.indexOf("http://")==0){
_19.open("POST",config.proxyUrl,false);
_19.setRequestHeader("serverUrl",_14);
}else{
_14=_14+"?dir="+dir+"&fileName="+_18;
_19.open("POST",_14,false);
}
_19.setRequestHeader("content-type","text/xml");
if(_16){
_19.setRequestHeader("content-type",_16);
}
_19.send(_15);
if(_19.status>=400){
alert(mbGetMessage("errorLoadingDocument",_14,_19.statusText,_19.responseText));
var _1a=Sarissa.getDomDocument();
_1a.parseError=-1;
return _1a;
}else{
if(null==_19.responseXML){
alert(mbGetMessage("nullXmlResponse",_19.responseText));
}
return _19.responseXML;
}
}
function getProxyPlusUrl(url){
if(url.indexOf("http://")==0){
if(config.proxyUrl){
url=config.proxyUrl+"?url="+escape(url).replace(/\+/g,"%2C").replace(/\"/g,"%22").replace(/\'/g,"%27");
}else{
alert(mbGetMessage("unableToLoadDoc",url));
url=null;
}
}
return url;
}
function createElementWithNS(doc,_1d,_1e){
if(_SARISSA_IS_IE){
return doc.createNode(1,_1d,_1e);
}else{
return doc.createElementNS(_1e,_1d);
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
function setISODate(_1f){
var _20=_1f.match(/(\d{4})-?(\d{2})?-?(\d{2})?T?(\d{2})?:?(\d{2})?:?(\d{2})?\.?(\d{0,3})?(Z)?/);
var res=null;
for(var i=1;i<_20.length;++i){
if(!_20[i]){
_20[i]=(i==3)?1:0;
if(!res){
res=i;
}
}
}
var _23=new Date();
_23.setFullYear(parseInt(_20[1],10));
_23.setMonth(parseInt(_20[2],10)-1,parseInt(_20[3],10));
_23.setDate(parseInt(_20[3],10));
_23.setHours(parseInt(_20[4],10));
_23.setMinutes(parseInt(_20[5],10));
_23.setSeconds(parseFloat(_20[6],10));
if(!res){
res=6;
}
_23.res=res;
return _23;
}
function getISODate(_24){
var res=_24.res?_24.res:6;
var _26="";
_26+=res>=1?_24.getFullYear():"";
_26+=res>=2?"-"+leadingZeros(_24.getMonth()+1,2):"";
_26+=res>=3?"-"+leadingZeros(_24.getDate(),2):"";
_26+=res>=4?"T"+leadingZeros(_24.getHours(),2):"";
_26+=res>=5?":"+leadingZeros(_24.getMinutes(),2):"";
_26+=res>=6?":"+leadingZeros(_24.getSeconds(),2):"";
return _26;
}
function leadingZeros(num,_28){
var _29=parseInt(num,10);
var _2a=Math.pow(10,_28);
if(_29<_2a){
_29+=_2a;
}
return _29.toString().substr(1);
}
function fixPNG(_2b,_2c,_2d){
if(_SARISSA_IS_IE){
if(_2d){
var _2e=_2d.style.filter.substring(_2d.style.filter.indexOf("opacity=",0)+8,_2d.style.filter.lastIndexOf(")",0));
if(_2d.style.filter.indexOf("opacity=",0)==-1){
_2e=null;
}
var _2f=(_2e)?_2e/100:-1;
}
var _30="id='"+_2c+"' ";
var _31=(_2b.className)?"class='"+_2b.className+"' ":"";
var _32=(_2b.title)?"title='"+_2b.title+"' ":"title='"+_2b.alt+"' ";
var _33="display:inline-block;"+_2b.style.cssText;
var _34="<span "+_30+_31+_32;
_34+=" style=\""+"width:"+_2b.width+"px; height:"+_2b.height+"px;"+_33+";";
if(_2f!=-1){
_34+="opacity="+_2f+";";
}
var src=_2b.src;
src=src.replace(/\(/g,"%28");
src=src.replace(/\)/g,"%29");
src=src.replace(/'/g,"%27");
src=src.replace(/%23/g,"%2523");
_34+="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader";
_34+="(src='"+src+"', sizingMethod='scale')";
if(_2d&&_2f!=-1){
_34+=" alpha(opacity="+(_2f*100)+")";
}
_34+="; \"></span>";
return _34;
}
}
function getAbsX(elt){
return (elt.x)?elt.x:getAbsPos(elt,"Left")+2;
}
function getAbsY(elt){
return (elt.y)?elt.y:getAbsPos(elt,"Top")+2;
}
function getAbsPos(elt,_39){
iPos=0;
while(elt!=null){
iPos+=elt["offset"+_39];
elt=elt.offsetParent;
}
return iPos;
}
function getPageX(e){
var _3b=0;
if(!e){
var e=window.event;
}
if(e.pageX){
_3b=e.pageX;
}else{
if(e.clientX){
_3b=e.clientX;
}
}
if(document.body&&document.body.scrollLeft){
_3b+=document.body.scrollLeft;
}else{
if(document.documentElement&&document.documentElement.scrollLeft){
_3b+=document.documentElement.scrollLeft;
}
}
return _3b;
}
function getPageY(e){
var _3d=0;
if(!e){
var e=window.event;
}
if(e.pageY){
_3d=e.pageY;
}else{
if(e.clientY){
_3d=e.clientY;
}
}
if(document.body&&document.body.scrollTop){
_3d+=document.body.scrollTop;
}else{
if(document.documentElement&&document.documentElement.scrollTop){
_3d+=document.documentElement.scrollTop;
}
}
return _3d;
}
function getArgs(){
var _3e=new Object();
var _3f=location.search.substring(1);
var _40=_3f.split("&");
for(var i=0;i<_40.length;i++){
var pos=_40[i].indexOf("=");
if(pos==-1){
continue;
}
var _43=_40[i].substring(0,pos);
var _44=_40[i].substring(pos+1);
_3e[_43]=unescape(_44.replace(/\+/g," "));
}
return _3e;
}
window.cgiArgs=getArgs();
function getScreenX(_45,_46){
bbox=_45.getBoundingBox();
width=_45.getWindowWidth();
bbox[0]=parseFloat(bbox[0]);
bbox[2]=parseFloat(bbox[2]);
var _47=(width/(bbox[2]-bbox[0]));
x=_47*(_46-bbox[0]);
return x;
}
function getScreenY(_48,_49){
var _4a=_48.getBoundingBox();
var _4b=_48.getWindowHeight();
_4a[1]=parseFloat(_4a[1]);
_4a[3]=parseFloat(_4a[3]);
var _4c=(heighteight/(_4a[3]-_4a[1]));
var y=_4b-(_4c*(pt.y-_4a[1]));
return y;
}
function getGeoCoordX(_4e,_4f){
var _50=_4e.getBoundingBox();
var _51=_4e.getWindowWidth();
_50[0]=parseFloat(_50[0]);
_50[2]=parseFloat(_50[2]);
var _52=((_50[2]-_50[0])/_51);
var x=_50[0]+_52*(xCoord);
return x;
}
function getGeoCoordY(_54){
var _55=context.getBoundingBox();
var _56=context.getWindowHeight();
_55[1]=parseFloat(_55[1]);
_55[3]=parseFloat(_55[3]);
var _57=((_55[3]-_55[1])/_56);
var y=_55[1]+_57*(_56-_54);
return y;
}
function makeElt(_59){
var _5a=document.createElement(_59);
document.getElementsByTagName("body").item(0).appendChild(_5a);
return _5a;
}
var newWindow="";
function openPopup(url,_5c,_5d){
if(_5c==null){
_5c=300;
}
if(_5d==null){
_5d=200;
}
if(!newWindow.closed&&newWindow.location){
newWindow.location.href=url;
}else{
newWindow=window.open(url,"name","height="+_5d+",width="+_5c);
if(!newWindow.opener){
newwindow.opener=self;
}
}
if(window.focus){
newWindow.focus();
}
return false;
}
function debug(_5e){
tarea=makeElt("textarea");
tarea.setAttribute("rows","3");
tarea.setAttribute("cols","40");
tnode=document.createTextNode(_5e);
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
function addEvent(_61,_62,_63){
if(document.addEventListener){
_61.addEventListener(_62,_63,false);
}else{
if(document.attachEvent){
_61.attachEvent("on"+_62,_63);
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
function mbDebugMessage(_67,_68){
if(_67&&_67.debug){
alert(_68);
}
}
function mbGetMessage(_69){
var _6a="NoMsgsFound";
if(config.widgetText){
var _6b="/mb:WidgetText/mb:messages/mb:"+_69;
var _6c=config.widgetText.selectNodes(_6b);
if(!_6c||_6c.length==0){
_6a=_69;
}else{
_6a=_6c.item(_6c.length-1).firstChild.nodeValue;
if(arguments[mbGetMessage.length]){
var _6d=[].slice.call(arguments,mbGetMessage.length);
_6d.unshift(_6a);
_6a=mbFormatMessage.apply(this,_6d);
}
}
}
return _6a;
}
function mbFormatMessage(_6e){
var _6f=_6e;
var _70=[].slice.call(arguments,mbFormatMessage.length);
for(var i in _70){
var _72=new RegExp("\\{"+i+"\\}","g");
_6f=_6f.replace(_72,_70[i]);
}
return _6f;
}
function sld2UrlParam(_73){
var _74=new Array();
if(_73){
var sld=_73.selectSingleNode("wmc:SLD");
var _76=_73.selectSingleNode("wmc:Name");
if(sld){
if(sld.selectSingleNode("wmc:OnlineResource")){
_74.sld=sld.selectSingleNode("wmc:OnlineResource").getAttribute("xlink:href");
}else{
if(sld.selectSingleNode("wmc:FeatureTypeStyle")){
_74.sld=(new XMLSerializer()).serializeToString(sld.selectSingleNode("wmc:FeatureTypeStyle"));
}else{
if(sld.selectSingleNode("wmc:StyledLayerDescriptor")){
_74.sld_body=(new XMLSerializer()).serializeToString(sld.selectSingleNode("wmc:StyledLayerDescriptor"));
}
}
}
}else{
if(_76){
_74.styles=(_76.firstChild)?_76.firstChild.nodeValue:"";
}
}
}
return _74;
}
function sld2OlStyle(_77){
var _78=new Object();
var _79;
var _7a=false;
if(_77){
_79=_77.selectSingleNode(".//sld:ExternalGraphic/sld:OnlineResource/@xlink:href");
if(_79){
_78.externalGraphic=_79.firstChild.nodeValue;
_7a=true;
}
_79=_77.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill']");
if(_79){
_78.fillColor=_79.firstChild.nodeValue;
_7a=true;
}
_79=_77.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill-opacity']");
if(_79){
_78.fillOpacity=_79.firstChild.nodeValue;
_7a=true;
}else{
_79=_77.selectSingleNode(".//sld:Opacity/sld:Literal");
if(_79){
_78.fillOpacity=_79.firstChild.nodeValue;
_7a=true;
}
}
_79=_77.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke']");
if(_79){
_78.strokeColor=_79.firstChild.nodeValue;
_7a=true;
}
_79=_77.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-opacity']");
if(_79){
_78.strokeOpacity=_79.firstChild.nodeValue;
_7a=true;
}
_79=_77.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-width']");
if(_79){
_78.strokeWidth=_79.firstChild.nodeValue;
_7a=true;
}
_79=_77.selectSingleNode(".//sld:Size");
if(_79){
_78.pointRadius=_79.firstChild.nodeValue;
_7a=true;
}
}
if(!_7a){
_78=null;
}
return _78;
}
function loadCss(_7b){
var id=_7b.match(/[^\/]*$/).toString().replace(/./,"_");
if(!document.getElementById(id)){
var _7d=document.createElement("link");
_7d.setAttribute("id",id);
_7d.setAttribute("rel","stylesheet");
_7d.setAttribute("type","text/css");
_7d.setAttribute("href",config.skinDir+"/"+_7b);
document.getElementsByTagName("head")[0].appendChild(_7d);
}
}
function getNodeValue(_7e){
if(_7e.nodeType==1){
return _7e.firstChild?_7e.firstChild.nodeValue:"";
}
if(_7e.nodeType>1||_7e.nodeType<5){
return _7e.nodeValue;
}
return _7e;
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
alert(mbGetMessage("undefinedListener",_3));
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
alert(mbGetMessage("undefinedListener",_6));
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
alert(mbGetMessage("listenerError",_c,this.listeners[_c][i][1].id,this.listeners[_c][i][0]));
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

mapbuilder.loadScript(baseDir+"/util/Listener.js");
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
this.config=new Array();
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
if(_11.method.toLowerCase()=="get"){
_13=getProxyPlusUrl(_13);
}else{
_13=config.proxyUrl;
}
}
_12.open(_11.method,_13,_11.async);
if(_11.method.toLowerCase()=="post"){
_12.setRequestHeader("content-type",_11.contentType);
_12.setRequestHeader("serverUrl",_11.url);
}
_12.onreadystatechange=function(){
_11.setParam("modelStatus",httpStatusMsg[_12.readyState]);
if(_12.readyState==4){
if(_12.status>=400){
var _14=mbGetMessage("errorLoadingDocument",_13,_12.statusText,_12.responseText);
alert(_14);
_11.setParam("modelStatus",_14);
return;
}else{
if((_12.responseXML!=null)&&(_12.responseXML.root!=null)&&(_12.responseXML.root.children.length>0)){
_11.doc=_12.responseXML;
if(Sarissa.getParseErrorText(_11.doc)==Sarissa.PARSED_OK){
_11.finishLoading();
}else{
alert(mbGetMessage("parseError",Sarissa.getParseErrorText(_11.doc)));
}
return;
}
if(_12.responseText!=null){
_11.doc=Sarissa.getDomDocument();
_11.doc.async=false;
_11.doc=(new DOMParser()).parseFromString(_12.responseText.replace(/>\s+</g,"><"),"text/xml");
if(_11.doc==null){
alert(mbGetMessage("documentParseError",Sarissa.getParseErrorText(_11.doc)));
}else{
if(Sarissa.getParseErrorText(_11.doc)==Sarissa.PARSED_OK){
_11.finishLoading();
}else{
alert(mbGetMessage("parseError",Sarissa.getParseErrorText(_11.doc)));
}
}
return;
}
}
}
};
_12.send(_11.postData);
if(!_11.async){
if(_12.status>=400){
var _15=mbGetMessage("errorLoadingDocument",_13,_12.statusText,_12.responseText);
alert(_15);
this.objRef.setParam("modelStatus",_15);
return;
}else{
if(null==_12.responseXML){
alert(mbGetMessage("nullXmlResponse",_12.responseText));
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
if(!_SARISSA_IS_SAFARI){
this.doc.setProperty("SelectionLanguage","XPath");
if(this.namespace){
Sarissa.setXpathNamespaces(this.doc,this.namespace);
}
}
if(this.debug){
mbDebugMessage(this,"Loading Model:"+this.id+" "+(new XMLSerializer()).serializeToString(this.doc));
}
this.callListeners("loadModel");
}
};
this.newRequest=function(_18,_19){
var _1a=_18;
if(_18.template){
var _1b=_18.modelNode.parentNode;
if(_SARISSA_IS_IE){
var _1c=_1b.appendChild(_1.cloneNode(true));
}else{
var _1c=_1b.appendChild(_18.modelNode.ownerDocument.importNode(_18.modelNode,true));
}
_1c.removeAttribute("id");
_1c.setAttribute("createByTemplate","true");
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
var _1f=postGetLoad(config.serializeUrl,_1e.doc,"text/xml","/temp","sld.xml");
if(!_SARISSA_IS_SAFARI){
_1f.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_1f,"xmlns:xlink='http://www.w3.org/1999/xlink'");
}
var _20=_1f.selectSingleNode("//OnlineResource");
var _21=_20.attributes.getNamedItem("xlink:href").nodeValue;
_1e.setParam("modelSaved",_21);
}else{
alert(mbGetMessage("noSerializeUrl"));
}
};
this.createObject=function(_22){
var _23=_22.nodeName;
var _24;
if(window[_23]&&(_24=new window[_23](_22,this))){
config.objects[_24.id]=_24;
return _24;
}else{
alert(mbGetMessage("errorCreatingObject",_23));
}
};
this.loadObjects=function(_25){
var _26=this.modelNode.selectNodes(_25);
for(var i=0;i<_26.length;i++){
if(_26[i].nodeName!="#text"&&_26[i].nodeName!="#comment"){
this.createObject(_26[i]);
}
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

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Config(_1){
this.doc=Sarissa.getDomDocument();
this.doc.async=false;
this.doc.validateOnParse=false;
if(_SARISSA_IS_SAFARI){
var _2=new XMLHttpRequest();
_2.open("GET",_1,false);
_2.send(null);
this.doc=_2.responseXML;
}else{
this.doc.load(_1);
}
if(Sarissa.getParseErrorText(this.doc)!=Sarissa.PARSED_OK){
alert("error loading config document: "+_1);
}
this.url=_1;
this.namespace="xmlns:mb='"+mbNsUrl+"'";
if(!_SARISSA_IS_SAFARI){
this.doc.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(this.doc,this.namespace);
}
var _3=Sarissa.getDomDocument();
_3.async=false;
_3.validateOnParse=false;
if(_SARISSA_IS_SAFARI){
var _2=new XMLHttpRequest();
_2.open("GET",baseDir+"/"+mbServerConfig,false);
_2.send(null);
_3=_2.responseXML;
}else{
_3.load(baseDir+"/"+mbServerConfig);
}
if(Sarissa.getParseErrorText(_3)!=Sarissa.PARSED_OK){
}else{
if(!_SARISSA_IS_SAFARI){
_3.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_3,this.namespace);
}
var _4=_3.selectSingleNode("/mb:MapbuilderConfig/mb:proxyUrl");
if(_4){
this.proxyUrl=getNodeValue(_4);
}
_4=_3.selectSingleNode("/mb:MapbuilderConfig/mb:serializeUrl");
if(_4){
this.serializeUrl=getNodeValue(_4);
}
}
_3=null;
this.loadConfigScripts=function(){
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:models/*"),"model/");
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:widgets/*"),"widget/");
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:tools/*"),"tool/");
var _5=this.doc.selectNodes("//mb:scriptFile");
for(var i=0;i<_5.length;i++){
scriptFile=getNodeValue(_5[i]);
mapbuilder.loadScript(scriptFile);
}
};
this.defaultLang="en";
this.lang=this.defaultLang;
if(window.cgiArgs["language"]){
this.lang=window.cgiArgs["language"];
}else{
if(window.language){
this.lang=window.language;
}
}
var _7=this.doc.documentElement;
this.skinDir=_7.selectSingleNode("mb:skinDir").firstChild.nodeValue;
var _8=_7.selectSingleNode("mb:proxyUrl");
if(_8){
this.proxyUrl=getNodeValue(_8);
}
var _9=_7.selectSingleNode("mb:serializeUrl");
if(_9){
this.serializeUrl=getNodeValue(_9);
}
function loadWidgetText(_a,_b){
var _c="/widgetText.xml";
var _d;
var _e=_b+"/"+_a.lang+_c;
_d=Sarissa.getDomDocument();
_d.async=false;
_d.validateOnParse=false;
if(typeof (inlineXSL)!="undefined"){
var _f=inlineXSL[_e];
_f=_f.replace(/DOUBLE_QUOTE/g,"\"");
_d=(new DOMParser()).parseFromString(_f,"text/xml");
}else{
if(_SARISSA_IS_SAFARI){
var _10=new XMLHttpRequest();
_10.open("GET",_e,false);
_10.send(null);
_d=_10.responseXML;
}else{
try{
_d.load(_e);
}
catch(ignoredErr){
}
}
}
if(Sarissa.getParseErrorText(_d)!=Sarissa.PARSED_OK){
var _11="Error loading widgetText document: "+_e;
if(_a.lang==_a.defaultLang){
alert(_11);
}else{
alert(_11+"\nFalling back on default language=\""+_a.defaultLang+"\"");
_a.lang=_a.defaultLang;
_e=_b+"/"+_a.lang+_c;
if(_SARISSA_IS_SAFARI){
var _10=new XMLHttpRequest();
_10.open("GET",_e,false);
_10.send(null);
_d=_10.responseXML;
}else{
_d.load(_e);
}
if(Sarissa.getParseErrorText(_d)!=Sarissa.PARSED_OK){
alert("Falling back on default language failed!");
}
}
}
if(!_SARISSA_IS_SAFARI){
_d.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_d,_a.namespace);
}
return _d;
}
this.widgetText=loadWidgetText(this,baseDir+"/text");
userWidgetTextDir=_7.selectSingleNode("mb:userWidgetTextDir");
if(userWidgetTextDir){
var _12=loadWidgetText(this,getNodeValue(userWidgetTextDir));
if(_12){
var _13=_12.selectSingleNode("/mb:WidgetText/mb:widgets");
var _14=this.widgetText.selectSingleNode("/mb:WidgetText/mb:widgets");
if(_13&&_14){
Sarissa.copyChildNodes(_13,_14,true);
}
var _15=_12.selectSingleNode("/mb:WidgetText/mb:messages");
var _16=this.widgetText.selectSingleNode("/mb:WidgetText/mb:messages");
if(_15&&_16){
Sarissa.copyChildNodes(_15,_16,true);
}
}
}
this.objects=new Object();
ModelBase.apply(this,new Array(_7));
this.loadModel=function(_17,_18){
var _19=this.objects[_17];
if(_19&&_18){
var _1a=new Object();
_1a.method=_19.method;
_1a.url=_18;
_19.newRequest(_19,_1a);
}else{
alert(mbGetMessage("errorLoadingModel",_17,_18));
}
};
this.paintWidget=function(_1b){
if(_1b){
_1b.paint(_1b,_1b.id);
}else{
alert(mbGetMessage("errorPaintingWidget"));
}
};
}
if(document.readyState==null){
mapbuilder.setLoadState(MB_LOAD_CONFIG);
config=new Config(mbConfigUrl);
config[config.id]=config;
config.loadConfigScripts();
}

mapbuilder.loadScript(baseDir+"/util/Util.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function ButtonBase(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:buttonBar");
if(_3){
this.htmlTagId=_3.firstChild.nodeValue;
}
var _4=_1.selectSingleNode("mb:htmlTagId");
if(_4){
this.htmlTagId=_4.firstChild.nodeValue;
}
if((!_3)&&(!_4)){
alert(mbGetMessage("buttonBarRequired",_1.nodeName));
}
if(config.widgetText){
var _5="/mb:WidgetText/mb:widgets/mb:"+_1.nodeName;
var _6=config.widgetText.selectNodes(_5+"/*");
for(var j=0;j<_6.length;j++){
this[_6[j].nodeName]=_6[j].firstChild.nodeValue;
}
}
this.panelHtmlTagId=this.htmlTagId+"_panel";
loadCss("controlPanel.css");
this.buttonType=_1.selectSingleNode("mb:class").firstChild.nodeValue;
if(this.buttonType=="RadioButton"){
this.enabled=false;
}
var _8=_1.selectSingleNode("mb:action");
if(_8){
this.action=_8.firstChild.nodeValue;
}
var _9=_1.selectSingleNode("mb:tooltip");
if(_9){
this.tooltip=_9.firstChild.nodeValue;
}
var _a=_1.selectSingleNode("mb:disabledSrc");
if(_a){
this.disabledImage=config.skinDir+_a.firstChild.nodeValue;
}
var _b=_1.selectSingleNode("mb:enabledSrc");
if(_b){
this.enabledImage=config.skinDir+_b.firstChild.nodeValue;
}
this.cursor="default";
var _c=this.widgetNode.selectSingleNode("mb:cursor");
if(_c!=null){
var _d=_c.firstChild.nodeValue;
this.cursor=_d;
}
var _e=_1.selectSingleNode("mb:selected");
if(_e&&_e.firstChild.nodeValue){
this.selected=true;
}
this.getButtonClass=function(_f,_10){
var _11;
if(_f.control.displayClass){
_11=_f.control.displayClass;
}else{
_11=_f.control.CLASS_NAME;
_11=_11.replace(/OpenLayers/,"ol").replace(/\./g,"");
}
_11+="Item";
return "."+_11+_10;
};
this.control=null;
this.doAction=function(){
};
this.select=function(){
if(this.control.type==OpenLayers.Control.TYPE_BUTTON){
this.control.trigger();
}else{
this.panel.activateControl(this.control);
}
};
this.doSelect=function(_12,_13){
};
this.attachToOL=function(_14,_15){
if(_14.control){
return;
}
if(_15&&(_15!=_14.id)){
return;
}
if(!_14.createControl){
return;
}
var _16=_14.createControl(_14);
var _17=OpenLayers.Class(_16,{objRef:_14,superclass:_16.prototype,trigger:function(){
if(this.superclass.trigger){
this.superclass.trigger.call(this);
}
_14.doSelect(_14,true);
},activate:function(){
if(this.superclass.activate.call(this)){
this.panel_div.style.backgroundImage="url(\""+_14.enabledImage+"\")";
this.map.div.style.cursor=_14.cursor;
this.map.mbCursor=_14.cursor;
_14.enabled=true;
this.active=true;
_14.doSelect(_14,true);
}
},deactivate:function(){
if(this.superclass.deactivate.call(this)){
this.panel_div.style.backgroundImage="url(\""+_14.disabledImage+"\")";
_14.enabled=false;
this.active=false;
_14.doSelect(_14,false);
}
},destroy:function(){
try{
this.superclass.destroy.apply(this,arguments);
}
catch(e){
OpenLayers.Control.prototype.destroy.apply(this,arguments);
}
this.superclass=null;
OpenLayers.Event.stopObservingElement(this.panel_div);
this.objRef.panel.div.removeChild(this.panel_div);
this.objRef.control=null;
this.objRef=null;
this.panel_div=null;
this.div=null;
}});
if(!_14.control){
_14.control=_14.instantiateControl?_14.instantiateControl(_14,_17):new _17();
}
var map=_14.targetContext.map;
_14.panel=_14.targetContext.buttonBars[_14.htmlTagId];
if(!_14.panel||_14.panel.map==null){
if(!document.getElementById(_14.panelHtmlTagId)){
var _19=document.createElement("div");
_19.setAttribute("id",_14.panelHtmlTagId);
_19.setAttribute("class","olControlPanel");
var _1a=_14.getNode();
_1a.appendChild(_19);
_1a.innerHTML+=" ";
}
var _1b=OpenLayers.Class(OpenLayers.Control.Panel,{div:document.getElementById(_14.panelHtmlTagId),defaultControl:null,destroy:function(){
_1a.removeChild(this.div);
OpenLayers.Control.prototype.destroy.apply(this,arguments);
this.div=null;
_14.panel=null;
}});
_14.panel=new _1b();
_14.targetContext.buttonBars[_14.htmlTagId]=_14.panel;
map.addControl(_14.panel);
}
if(OpenLayers.Util.indexOf(_14.control,_14.panel.controls)==-1){
_14.panel.addControls(_14.control);
}
if(_14.tooltip){
_14.control.panel_div.title=_14.tooltip;
}
_14.control.panel_div.style.backgroundImage="url(\""+_14.disabledImage+"\")";
if(_14.selected==true){
_14.control.activate();
}
};
this.buttonInit=function(_1c){
var _1d=_1c.widgetNode.selectSingleNode("mb:targetContext");
if(_1d){
_1c.targetContext=window.config.objects[_1d.firstChild.nodeValue];
if(!_1c.targetModel){
alert(mbGetMessage("noTargetContext",_1d.firstChild.nodeValue,_1c.id));
}
}else{
_1c.targetContext=_1c.targetModel;
}
if(!_1c.targetContext.buttonBars){
_1c.targetContext.buttonBars=new Array();
}
_1c.targetContext.addListener("refresh",_1c.attachToOL,_1c);
};
this.model.addListener("init",this.buttonInit,this);
this.model.removeListener("newNodel",this.clearWidget,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Back(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
var _5=this.objRef;
_5.targetModel.setParam("historyBack");
var _6=_5.targetModel.previousExtent;
if(_6){
_5.targetModel.setParam("historyStop");
this.map.setCenter(_6.center);
this.map.zoomToScale(_6.scale);
_5.targetModel.setParam("historyStart");
}
},CLASS_NAME:"mbControl.Back"});
return _4;
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Forward(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
var _5=this.objRef;
_5.targetModel.setParam("historyForward");
var _6=_5.targetModel.nextExtent;
if(_6){
_5.targetModel.setParam("historyStop");
this.map.setCenter(_6.center);
this.map.zoomToScale(_6.scale);
_5.targetModel.setParam("historyStart");
}
},CLASS_NAME:"mbControl.Forward"});
return _4;
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function ZoomIn(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
this.createControl=function(){
return OpenLayers.Control.ZoomBox;
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function ZoomOut(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl.ZoomOut",type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask});
},zoomBox:function(_5){
if(_5 instanceof OpenLayers.Bounds){
var _6=new OpenLayers.Pixel(_5.left,_5.bottom);
var _7=new OpenLayers.Pixel(_5.right,_5.top);
var _8=new OpenLayers.Bounds(_6.x,_6.y,_7.x,_7.y);
var _9=(this.map.getSize().w+this.map.getSize().h)/2;
var _a=(Math.abs(_8.getWidth())+Math.abs(_8.getHeight()))/2;
var _b=this.map.getScale()*(_9/_a);
this.map.setCenter(_8.getCenterLonLat());
this.map.zoomToScale(_b);
}else{
this.map.setCenter(this.map.getLonLatFromPixel(_5),this.map.getZoom()-1);
}
}});
return _4;
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function DragPan(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
return OpenLayers.Control.DragPan;
};
this.cursor="move";
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function Reset(_1,_2){
this.createControl=function(){
return OpenLayers.Control.ZoomToMaxExtent;
};
ButtonBase.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/util/Util.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/tool/Extent.js");
function MapPaneOL(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
loadCss("openlayers/style.css");
OpenLayers.ImgPath=config.skinDir+"/images/openlayers/";
OpenLayers.ProxyHost=config.proxyUrl+"/?url=";
this.containerNodeId=this.htmlTagId;
_2.containerModel=this.model;
if(!this.model.extent){
this.model.extent=new Extent(this.model);
this.model.addFirstListener("loadModel",this.model.extent.firstInit,this.model.extent);
}
var _3=_1.selectSingleNode("mb:tileGutter");
this.tileGutter=_3?parseInt(_3.firstChild.nodeValue):0;
var _4=_1.selectSingleNode("mb:tileBuffer");
this.tileBuffer=_4?parseInt(_4.firstChild.nodeValue):2;
var _5=_1.selectSingleNode("mb:tileSize");
this.tileSize=_5?parseInt(_5.firstChild.nodeValue):256;
var _6=_1.selectSingleNode("mb:imageReproject");
this.imageReproject=_6?_6.firstChild.nodeValue:"false";
if(this.imageReproject.match(/true/i)){
this.imageReproject=true;
}else{
this.imageReproject=false;
}
var _7=_1.selectSingleNode("mb:imageBuffer");
this.imageBuffer=_7?parseInt(_7.firstChild.nodeValue):2;
var _8=_1.selectSingleNode("mb:displayOutsideMaxExtent");
this.displayOutsideMaxExtent=_8?_8.firstChild.nodeValue:"false";
if(this.displayOutsideMaxExtent.match(/true/i)){
this.displayOutsideMaxExtent=true;
}else{
this.displayOutsideMaxExtent=false;
}
this.loadingLayers=0;
this.refreshWmsLayers=function(_9){
var _a=(new Date()).getTime();
var _b=_9.model.map.layers;
for(var i in _b){
if(_b[i].CLASS_NAME.indexOf("OpenLayers.Layer.WMS")==0){
_b[i].mergeNewParams({uniqueId:_a});
}
}
};
this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);
this.model.addListener("refresh",this.paint,this);
this.model.addFirstListener("newModel",this.clear,this);
this.model.addListener("hidden",this.hidden,this);
this.model.addListener("addLayer",this.addLayer,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("moveLayerUp",this.moveLayerUp,this);
this.model.addListener("moveLayerDown",this.moveLayerDown,this);
this.model.addListener("opacity",this.setOpacity,this);
this.model.addListener("bbox",this.zoomToBbox,this);
}
MapPaneOL.prototype.paint=function(_d,_e){
if(_d.model.doc.selectSingleNode("//wmc:OWSContext")){
_d.context="OWS";
}else{
if(_d.model.doc.selectSingleNode("//wmc:ViewContext")){
_d.context="View";
}else{
alert(mbGetMessage("noContextDefined"));
}
}
var _f=_d.model.proj;
var _10=null;
_10=_d.widgetNode.selectSingleNode("mb:maxExtent");
_10=(_10)?_10.firstChild.nodeValue.split(" "):null;
if(!_10){
_10=_d.model.getBoundingBox();
}
_10=(_10)?new OpenLayers.Bounds(_10[0],_10[1],_10[2],_10[3]):null;
if(_10==null){
alert(mbGetMessage("noBboxInContext"));
}
var _11=null;
_11=_d.widgetNode.selectSingleNode("mb:maxResolution");
_11=(_11)?parseFloat(_11.firstChild.nodeValue):"auto";
var _12=_f.units=="meters"?"m":_f.units;
var _13=_d.widgetNode.selectSingleNode("mb:resolutions");
_13=_13?_13.firstChild.nodeValue.split(","):null;
for(var r in _13){
_13[r]=parseFloat(_13[r]);
}
var _15=_d.widgetNode.selectSingleNode("mb:scales");
if(_15){
_15=_15.firstChild.nodeValue.split(",");
_13=new Array();
for(var s in _15){
_13.push(OpenLayers.Util.getResolutionFromScale(_15[s],_12));
}
}
if(_13){
_d.model.extent.setZoomLevels(true,_13);
}else{
_d.model.extent.setZoomLevels(false);
}
var _17=document.getElementById(_d.containerNodeId);
var _18=null;
_18=_d.widgetNode.selectSingleNode("mb:fixedSize");
_18=(_18)?_18.firstChild.nodeValue:null;
if(_18=="true"){
_17.style.width=_d.model.getWindowWidth()+"px";
_17.style.height=_d.model.getWindowHeight()+"px";
}
var _19={controls:[],projection:_f.srs,units:_12,maxExtent:_10,maxResolution:_11,resolutions:_13,theme:null,destroy:function(_1a){
if(_1a!=true){
this.mbMapPane.model.setParam("newModel",true);
}else{
this.mbMapPane=null;
this.mbCursor=null;
OpenLayers.Map.prototype.destroy.apply(this,arguments);
this.layerContainerDiv=null;
this.baseLayer=null;
}
}};
if(!_d.model.map){
_d.model.map=new OpenLayers.Map(_17,_19);
_d.model.map.Z_INDEX_BASE.Control=10000;
var _1b={units:_12,projection:_f.srs,maxExtent:_10,maxResolution:_11,resolutions:_13,alpha:false,isBaseLayer:true,displayOutsideMaxExtent:_d.displayOutsideMaxExtent,ratio:1,singleTile:true,visibility:false};
var _1c=new OpenLayers.Layer.WMS("baselayer",config.skinDir+"/images/openlayers/blank.gif",null,_1b);
_d.model.map.addLayer(_1c);
}else{
_d.deleteAllLayers(_d);
}
var _1d=_d.model.getAllLayers();
if(!_d.oLlayers){
_d.oLlayers={};
}
for(var i=0;i<=_1d.length-1;i++){
_d.addLayer(_d,_1d[i]);
}
var _1f=_d.model.getBoundingBox();
_d.model.map.mbMapPane=_d;
_d.model.map.events.register("moveend",_d.model.map,_d.updateContext);
_d.model.map.events.register("mouseup",_d.model.map,_d.updateMouse);
_d.model.callListeners("bbox");
};
MapPaneOL.prototype.clear=function(_20){
if(_20.model.map){
_20.model.map.destroy(true);
_20.model.map=null;
_20.oLlayers={};
}
};
MapPaneOL.prototype.increaseLoadingLayers=function(e){
++this.loadingLayers;
var _22=mbGetMessage((this.loadingLayers>1)?"loadingLayers":"loadingLayer",this.loadingLayers);
this.model.setParam("modelStatus",_22);
};
MapPaneOL.prototype.decreaseLoadingLayers=function(e){
--this.loadingLayers;
var _24=this.loadingLayers>0?mbGetMessage((this.loadingLayers>1)?"loadingLayers":"loadingLayer",this.loadingLayers):null;
this.model.setParam("modelStatus",_24);
};
MapPaneOL.prototype.updateContext=function(e){
var _26=e.object.mbMapPane;
var _27=_26.model.map.getExtent().toBBOX().split(",");
var ul=new Array(_27[0],_27[3]);
var lr=new Array(_27[2],_27[1]);
if(_26.model.getWindowWidth()!=e.element.offsetWidth){
_26.model.setWindowWidth(e.element.offsetWidth);
}
if(_26.model.getWindowHeight()!=e.element.offsetHeight){
_26.model.setWindowHeight(e.element.offsetHeight);
}
var _2a=_26.model.getParam("aoi");
var _2b=new Array(ul,lr);
if(!_2a||_2a.toString()!=_2b.toString()){
_26.model.setBoundingBox(new Array(ul[0],lr[1],lr[0],ul[1]));
_26.model.extent.setSize(_26.model.map.getResolution());
_26.model.setParam("aoi",_2b);
}
};
MapPaneOL.prototype.updateMouse=function(e){
var _2d=e.object.mbMapPane;
if(_2d.model.map.mbCursor){
_2d.model.map.div.style.cursor=_2d.model.map.mbCursor;
}
};
MapPaneOL.prototype.zoomToBbox=function(_2e){
if(_2e.model.map){
var _2f=_2e.model.getBoundingBox();
var _30=[];
var _31=_2e.model.map.getExtent();
if(_31){
_30=_31.toBBOX();
}
if(_2f.toString()!=_30.toString()){
_2e.model.map.zoomToExtent(new OpenLayers.Bounds(_2f[0],_2f[1],_2f[2],_2f[3]));
}
}
};
MapPaneOL.prototype.hidden=function(_32,_33){
var vis=_32.model.getHidden(_33);
if(vis=="1"){
var _35=false;
}else{
var _35=true;
}
var _36=_32.getLayer(_32,_33);
if(_36){
_36.setVisibility(_35);
}
};
MapPaneOL.prototype.getLayer=function(_37,_38){
return _37.model.map.getLayer(_37.oLlayers[_38].id);
};
MapPaneOL.prototype.deleteLayer=function(_39,_3a){
if(_39.oLlayers[_3a]){
_39.model.map.removeLayer(_39.oLlayers[_3a]);
}
};
MapPaneOL.prototype.deleteAllLayers=function(_3b){
for(var i in _3b.oLlayers){
var _3d=_3b.oLlayers[i];
_3d.destroy();
}
_3b.oLlayers={};
};
MapPaneOL.prototype.moveLayerUp=function(_3e,_3f){
var map=_3e.model.map;
map.raiseLayer(_3e.oLlayers[_3f],1);
};
MapPaneOL.prototype.moveLayerDown=function(_41,_42){
_41.model.map.raiseLayer(_41.oLlayers[_42],-1);
};
MapPaneOL.prototype.setOpacity=function(_43,_44){
var _45="1";
_45=_43.model.getOpacity(_44);
_43.getLayer(_43,_44).setOpacity(_45);
};
MapPaneOL.prototype.addLayer=function(_46,_47){
var _48=_47;
var _49=_48.selectSingleNode("wmc:Server/@service");
_49=(_49)?_49.nodeValue:"";
var _4a=_48.selectSingleNode("wmc:Title");
_4a=(_4a)?_4a.firstChild.nodeValue:"";
var _4b=_48.selectSingleNode("wmc:Name");
_4b=(_4b)?_4b.firstChild.nodeValue:"";
if(_46.context=="OWS"){
var _4c=_48.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");
_4c=(_4c)?getNodeValue(_4c):"";
}else{
if(_SARISSA_IS_SAFARI){
var _4d=_48.selectSingleNode("wmc:Server/wmc:OnlineResource");
var _4c=_4d.attributes[1].nodeValue;
}else{
if(_SARISSA_IS_OPERA){
var _4c=_48.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttributeNS("http://www.w3.org/1999/xlink","href");
}else{
var _4c=_48.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
}
}
}
var _4e=_48.selectSingleNode("wmc:FormatList/wmc:Format");
_4e=(_4e)?_4e.firstChild.nodeValue:"image/gif";
var vis=_48.selectSingleNode("@hidden");
if(vis){
if(vis.nodeValue=="1"){
vis=false;
}else{
vis=true;
}
}
var _50=_48.selectSingleNode("@queryable");
if(_50){
if(_50.nodeValue=="1"){
_50=true;
}else{
_50=false;
}
}
var _51=_48.selectSingleNode("@opacity");
if(_51){
_51=_51.nodeValue;
}else{
_51=false;
}
var _52=_48.selectSingleNode("wmc:StyleList/wmc:Style[@current=1]");
var _53={visibility:vis,projection:_46.model.map.baseLayer.projection,queryable:_50,maxExtent:_46.model.map.baseLayer.maxExtent,maxResolution:_46.model.map.baseLayer.maxResolution,alpha:false,isBaseLayer:false,displayOutsideMaxExtent:_46.displayOutsideMaxExtent};
switch(_49){
case "OGC":
case "WMS":
case "wms":
case "OGC:WMS":
if(!_46.model.map.baseLayer){
_53.isBaseLayer=true;
}else{
_53.reproject=_46.imageReproject;
_53.isBaseLayer=false;
}
_53.ratio=_46.imageBuffer;
_53.singleTile=true;
var _54=new Array();
_54=sld2UrlParam(_52);
if(_46.model.timestampList&&_46.model.timestampList.getAttribute("layerName")==_4b){
var _55=_46.model.timestampList.childNodes[0];
_46.oLlayers[_4b]=new OpenLayers.Layer.WMS(_4a,_4c,{layers:_4b,transparent:_53.isBaseLayer?"FALSE":"TRUE","TIME":_55.firstChild.nodeValue,format:_4e,sld:_54.sld,sld_body:_54.sld_body,styles:_54.styles},_53);
this.model.addListener("timestamp",this.timestampListener,this);
}else{
_46.oLlayers[_4b]=new OpenLayers.Layer.WMS(_4a,_4c,{layers:_4b,transparent:_53.isBaseLayer?"FALSE":"TRUE",format:_4e,sld:_54.sld,sld_body:_54.sld_body,styles:_54.styles},_53);
}
break;
case "WMS-C":
case "OGC:WMS-C":
if(!_46.model.map.baseLayer){
_53.isBaseLayer=true;
}else{
_53.reproject=_46.imageReproject;
_53.isBaseLayer=false;
}
_53.gutter=_46.tileGutter;
_53.buffer=_46.tileBuffer;
_53.tileSize=new OpenLayers.Size(_46.tileSize,_46.tileSize);
var _54=new Array();
_54=sld2UrlParam(_52);
_46.oLlayers[_4b]=new OpenLayers.Layer.WMS(_4a,_4c,{layers:_4b,transparent:_53.isBaseLayer?"FALSE":"TRUE",format:_4e,sld:_54.sld,sld_body:_54.sld_body,styles:_54.styles},_53);
break;
case "wfs":
case "OGC:WFS":
style=sld2OlStyle(_52);
if(style){
_53.style=style;
}else{
_53.style=_46.getWebSafeStyle(_46,2*i+1);
}
_53.featureClass=OpenLayers.Feature.WFS;
_46.oLlayers[_4b]=new OpenLayers.Layer.WFS(_4a,_4c,{typename:_4b,maxfeatures:1000},_53);
break;
case "gml":
case "OGC:GML":
style=sld2OlStyle(_52);
if(style){
_53.style=style;
}else{
_53.style=_46.getWebSafeStyle(_46,2*i+1);
}
_46.oLlayers[_4b]=new OpenLayers.Layer.GML(_4a,_4c,_53);
break;
case "GMAP":
case "Google":
_46.model.map.baseLayer.destroy();
_53.maxExtent=new OpenLayers.Bounds("-20037508","-20037508","20037508","20037508.34");
_46.oLlayers[_4b]=new OpenLayers.Layer.Google("Google Satellite",{type:G_HYBRID_MAP,maxZoomLevel:18,sphericalMercator:true},_53);
break;
case "YMAP":
case "Yahoo":
_53.isBaseLayer=true;
_46.oLlayers[_4b]=new OpenLayers.Layer.Yahoo("Yahoo");
break;
case "VE":
case "Microsoft":
_53.isBaseLayer=true;
_46.oLlayers[_4b]=new OpenLayers.Layer.VirtualEarth("VE",{minZoomLevel:0,maxZoomLevel:18,type:VEMapStyle.Hybrid});
break;
case "MultiMap":
_53.isBaseLayer=true;
_46.oLlayers[_4b]=new OpenLayers.Layer.MultiMap("MultiMap");
break;
default:
alert(mbGetMessage("layerTypeNotSupported",_49));
}
if(_51&&_46.oLlayers[_4b]){
_46.oLlayers[_4b].setOpacity(_51);
}
_46.oLlayers[_4b].events.register("loadstart",_46,_46.increaseLoadingLayers);
_46.oLlayers[_4b].events.register("loadend",_46,_46.decreaseLoadingLayers);
_46.oLlayers[_4b].setVisibility(vis);
_46.model.map.addLayer(_46.oLlayers[_4b]);
};
MapPaneOL.prototype.getWebSafeStyle=function(_56,_57){
colors=new Array("00","33","66","99","CC","FF");
_57=(_57)?_57:0;
_57=(_57<0)?0:_57;
_57=(_57>215)?215:_57;
i=parseInt(_57/36);
j=parseInt((_57-i*36)/6);
k=parseInt((_57-i*36-j*6));
var _58="#"+colors[i]+colors[j]+colors[k];
var _59=new Object();
_59.fillColor=_58;
_59.strokeColor=_58;
_59.map=_56.model.map;
return _59;
};
MapPaneOL.prototype.refreshLayer=function(_5a,_5b,_5c){
_5c["version"]=Math.random();
_5a.getLayer(_5a,_5b).mergeNewParams(_5c);
};
MapPaneOL.prototype.timestampListener=function(_5d,_5e){
var _5f=_5d.model.timestampList.getAttribute("layerName");
var _60=_5d.model.timestampList.childNodes[_5e];
if((_5f)&&(_60)){
var _61=_5d.oLlayers[_5f];
var _62=_61.grid[0][0].imgDiv.src;
var _63=_62;
_63=_63.replace(/TIME\=.*?\&/,"TIME="+_60.firstChild.nodeValue+"&");
function imageLoaded(){
window.movieLoop.frameIsLoading=false;
}
window.movieLoop.frameIsLoading=true;
var _64=_61.grid[0][0].imgDiv;
if(_64.addEventListener){
_64.addEventListener("load",imageLoaded,false);
}else{
if(_64.attachEvent){
_64.attachEvent("onload",imageLoaded);
}
}
_64.src=_63;
}
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function CursorTrack(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.showPx=false;
this.showXY=false;
this.showLatLong=true;
this.showDMS=false;
this.showDM=false;
this.showMGRS=false;
this.precision=2;
var _3=_1.selectSingleNode("mb:showPx");
if(_3){
this.showPx=(_3.firstChild.nodeValue=="false")?false:true;
}
var _4=_1.selectSingleNode("mb:showXY");
if(_4){
this.showXY=(_4.firstChild.nodeValue=="false")?false:true;
}
var _5=_1.selectSingleNode("mb:showLatLong");
if(_5){
this.showLatLong=(_5.firstChild.nodeValue=="false")?false:true;
}
var _6=_1.selectSingleNode("mb:showDMS");
if(_6){
this.showDMS=(_6.firstChild.nodeValue=="false")?false:true;
}
var _7=_1.selectSingleNode("mb:showDM");
if(_7){
this.showDM=(_7.firstChild.nodeValue=="false")?false:true;
}
var _8=_1.selectSingleNode("mb:showMGRS");
if(_8){
this.showMGRS=(_8.firstChild.nodeValue=="false")?false:true;
mapbuilder.loadScript(baseDir+"/util/MGRS.js");
}
var _9=_1.selectSingleNode("mb:precision");
if(_9){
this.precision=_9.firstChild.nodeValue;
}
this.formName="CursorTrackForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
this.init=function(_a){
_a.proj=new Proj(_a.model.getSRS());
_a.epsg4326=new CS(csList.EPSG4326);
_a.model.map.events.register("mousemove",_a,_a.mousemoveHandler);
_a.model.map.events.register("mouseout",_a,_a.mouseoutHandler);
if(this.showMGRS){
this.MGRS=new MGRS();
}
};
this.model.addListener("loadModel",this.init,this);
this.clear=function(_b){
if(_b.model.map&&_b.model.map.events){
_b.model.map.events.unregister("mousemove",_b,_b.mousemoveHandler);
_b.model.map.events.unregister("mouseout",_b,_b.mouseoutHandler);
}
};
this.model.addListener("newModel",this.clear,this);
this.mousemoveHandler=function(_c){
var _d=document.getElementById(this.formName);
if(!_c){
return;
}
var _e=this.model.map.getLonLatFromPixel(_c.xy);
var pt=new PT(_e.lon,_e.lat);
cs_transform(this.proj,this.epsg4326,pt);
var _10=new OpenLayers.LonLat(pt.x,pt.y);
if(this.showPx){
if(_d.px){
_d.px.value=_c.xy.x;
}
if(_d.py){
_d.py.value=_c.xy.y;
}
}
if(this.showXY){
if(_d.x){
_d.x.value=_e.lon.toFixed(this.precision);
}
if(_d.y){
_d.y.value=_e.lat.toFixed(this.precision);
}
}
if(this.showLatLong){
if(_d.longitude){
_d.longitude.value=_10.lon.toFixed(this.precision);
}
if(_d.latitude){
_d.latitude.value=_10.lat.toFixed(this.precision);
}
}
if(this.showDMS){
var _11=this.convertDMS(_10.lon,"LON");
if(_d.longdeg){
_d.longdeg.value=_11[0];
}
if(_d.longmin){
_d.longmin.value=_11[1];
}
if(_d.longsec){
_d.longsec.value=_11[2];
}
if(_d.longH){
_d.longH.value=_11[3];
}
var _12=this.convertDMS(_10.lat,"LAT");
if(_d.latdeg){
_d.latdeg.value=_12[0];
}
if(_d.latmin){
_d.latmin.value=_12[1];
}
if(_d.latsec){
_d.latsec.value=_12[2];
}
if(_d.latH){
_d.latH.value=_12[3];
}
}
if(this.showDM){
var _11=this.convertDM(_10.lon,"LON");
if(_d.longDMdeg){
_d.longDMdeg.value=_11[0];
}
if(_d.longDMmin){
_d.longDMmin.value=_11[1];
}
if(_d.longDMH){
_d.longDMH.value=_11[2];
}
var _12=this.convertDM(_10.lat,"LAT");
if(_d.latDMdeg){
_d.latDMdeg.value=_12[0];
}
if(_d.latDMmin){
_d.latDMmin.value=_12[1];
}
if(_d.latDMH){
_d.latDMH.value=_12[2];
}
}
if(this.showMGRS){
if(!this.MGRS){
this.MGRS=new MGRS();
}
_d.mgrs.value=this.MGRS.convert(_10.lat,_10.lon);
}
};
this.mouseoutHandler=function(evt){
var _14=document.getElementById(this.formName);
if(this.showPx){
if(_14.px){
_14.px.value="";
}
if(_14.py){
_14.py.value="";
}
}
if(this.showXY){
if(_14.x){
_14.x.value="";
}
if(_14.y){
_14.y.value="";
}
}
if(this.showLatLong){
if(_14.longitude){
_14.longitude.value="";
}
if(_14.latitude){
_14.latitude.value="";
}
}
if(this.showDMS){
if(_14.longdeg){
_14.longdeg.value="";
}
if(_14.longmin){
_14.longmin.value="";
}
if(_14.longsec){
_14.longsec.value="";
}
if(_14.longH){
_14.longH.value="";
}
if(_14.latdeg){
_14.latdeg.value="";
}
if(_14.latmin){
_14.latmin.value="";
}
if(_14.latsec){
_14.latsec.value="";
}
if(_14.latH){
_14.latH.value="";
}
}
if(this.showDM){
if(_14.longDMdeg){
_14.longDMdeg.value="";
}
if(_14.longDMmin){
_14.longDMmin.value="";
}
if(_14.longDMH){
_14.longDMH.value="";
}
if(_14.latDMdeg){
_14.latDMdeg.value="";
}
if(_14.latDMmin){
_14.latDMmin.value="";
}
if(_14.latDMH){
_14.latDMH.value="";
}
}
if(this.showMGRS){
if(_14.mgrs){
_14.mgrs.value="";
}
}
};
this.convertDMS=function(_15,_16){
var _17=new Array();
abscoordinate=Math.abs(_15);
coordinatedegrees=Math.floor(abscoordinate);
coordinateminutes=(abscoordinate-coordinatedegrees)/(1/60);
tempcoordinateminutes=coordinateminutes;
coordinateminutes=Math.floor(coordinateminutes);
coordinateseconds=(tempcoordinateminutes-coordinateminutes)/(1/60);
coordinateseconds=Math.round(coordinateseconds*10);
coordinateseconds/=10;
if(coordinatedegrees<10){
coordinatedegrees="0"+coordinatedegrees;
}
if(coordinateminutes<10){
coordinateminutes="0"+coordinateminutes;
}
if(coordinateseconds<10){
coordinateseconds="0"+coordinateseconds;
}
_17[0]=coordinatedegrees;
_17[1]=coordinateminutes;
_17[2]=coordinateseconds;
_17[3]=this.getHemi(_15,_16);
return _17;
};
this.convertDM=function(_18,_19){
var _1a=new Array();
abscoordinate=Math.abs(_18);
coordinatedegrees=Math.floor(abscoordinate);
coordinateminutes=(abscoordinate-coordinatedegrees)*60;
coordinateminutes=Math.round(coordinateminutes*1000);
coordinateminutes/=1000;
if(coordinatedegrees<10){
coordinatedegrees="0"+coordinatedegrees;
}
if(coordinateminutes<10){
coordinateminutes="0"+coordinateminutes;
}
_1a[0]=coordinatedegrees;
_1a[1]=coordinateminutes;
_1a[2]=this.getHemi(_18,_19);
return _1a;
};
this.getHemi=function(_1b,_1c){
var _1d="";
if(_1c=="LAT"){
if(_1b>=0){
_1d="N";
}else{
_1d="S";
}
}else{
if(_1c=="LON"){
if(_1b>=0){
_1d="E";
}else{
_1d="W";
}
}
}
return _1d;
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function MapScaleText(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.submitForm=function(){
var _3=document.getElementById(this.formName);
var _4=_3.mapScale.value;
this.model.map.zoomToScale(_4.split(",").join(""));
return false;
};
this.handleKeyPress=function(_5){
var _6;
var _7;
if(_5){
_6=_5.which;
_7=_5.currentTarget;
}else{
_6=window.event.keyCode;
_7=window.event.srcElement.form;
}
if(_6==13){
_7.parentWidget.submitForm();
return false;
}
};
this.showScale=function(_8){
var _9=document.getElementById(_8.formName);
if(_9){
var _a=Math.round(_8.model.map.getScale());
var _b=new Array();
while(_a>=1000){
var _c=_a/1000;
_a=Math.floor(_c);
var _d=leadingZeros(Math.round((_c-_a)*1000).toString(),3);
_b.unshift(_d);
}
_b.unshift(_a);
_9.mapScale.value=_b.join(",");
}
};
this.model.addListener("bbox",this.showScale,this);
this.model.addListener("refresh",this.showScale,this);
this.prePaint=function(_e){
var _f=_e.model.extent.getScale();
this.stylesheet.setParameter("mapScale",_f);
};
this.postPaint=function(_10){
var _11=document.getElementById(_10.formName);
_11.parentWidget=_10;
_11.onkeypress=_10.handleKeyPress;
_10.showScale(_10);
};
this.formName="MapScaleText_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}

var cscsPath=baseDir+"/util/cscs/lib/";
function Proj(_1){
var _2=_1.split(":");
cs=_2[0]+_2[1];
cscsRequestCSDefinition(cs);
var _3=new CS(eval("csList."+cs));
_3.srs=_1;
return _3;
}
function cscsRequestCSDefinition(_4){
var _5=null;
var _6=null;
var _7;
var _8;
for(i in csList){
if(_4==i){
_8=true;
break;
}
}
if(!_8){
_7=get_content(cscsPath+"defs/"+_4+".js");
if(_7){
var _9;
eval("chk="+_7);
var _a;
var _b=_9.split("+");
for(var i=0;i<_b.length;i++){
_a=_b[i].split("=");
if(_a[0].toLowerCase()=="proj"){
_6=_a[1].replace(/\s/gi,"");
}else{
if(_a[0].toLowerCase()=="title"){
_5=_a[1];
}
}
}
if(_6){
if(!_5){
_5=_6;
}
var _d;
for(i in csList){
if((csList[i].indexOf(_6)!=-1)&&i!=_4){
_d=true;
break;
}
}
if(!_d){
eval(get_content(cscsPath+_6+".js"));
}
}
}
}
}
function get_content(_e){
var _f;
if(document.all){
var xml=new ActiveXObject("Microsoft.XMLHTTP");
xml.Open("GET",_e,false);
xml.Send();
_f=xml.responseText;
}else{
var xml=new XMLHttpRequest();
xml.open("GET",_e,false);
xml.send(null);
_f=xml.responseText;
}
if(xml.status==200){
return (_f);
}else{
alert("Error, status = "+xml.status);
return null;
}
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Model(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function Context(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";
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
var _a=new Array();
var _b=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
_a[0]=parseFloat(_b.getAttribute("minx"));
_a[1]=parseFloat(_b.getAttribute("miny"));
_a[2]=parseFloat(_b.getAttribute("maxx"));
_a[3]=parseFloat(_b.getAttribute("maxy"));
return _a;
};
this.setBoundingBox=function(_c){
var _d=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
_d.setAttribute("minx",_c[0]);
_d.setAttribute("miny",_c[1]);
_d.setAttribute("maxx",_c[2]);
_d.setAttribute("maxy",_c[3]);
this.callListeners("bbox",_c);
};
this.initBbox=function(_e){
if(window.cgiArgs["bbox"]){
var _f=window.cgiArgs["bbox"].split(",");
_e.setBoundingBox(_f);
}
};
this.addListener("loadModel",this.initBbox,this);
this.initAoi=function(_10){
if(window.cgiArgs["aoi"]){
var aoi=window.cgiArgs["aoi"].split(",");
_10.setParam("aoi",new Array(new Array(aoi[0],aoi[3]),new Array(aoi[2],aoi[1])));
}
};
this.addListener("loadModel",this.initAoi,this);
this.setSRS=function(srs){
var _13=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
_13.setAttribute("SRS",srs);
this.callListeners("srs");
};
this.getSRS=function(){
var _14=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
srs=_14.getAttribute("SRS");
srs=srs?srs:"EPSG:4326";
return srs;
};
this.initProj=function(_15){
_15.proj=new Proj(_15.getSRS());
};
this.addFirstListener("loadModel",this.initProj,this);
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
this.getWindowSize=function(){
var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
return new Array(win.getAttribute("width"),win.getAttribute("height"));
};
this.setWindowSize=function(_1d){
var _1e=_1d[0];
var _1f=_1d[1];
var win=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Window");
win.setAttribute("width",_1e);
win.setAttribute("height",_1f);
this.callListeners("resize");
};
this.getFeatureNode=function(_21){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[wmc:Name='"+_21+"']");
};
this.getServerUrl=function(_22,_23,_24){
return _24.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
};
this.getVersion=function(_25){
return _25.selectSingleNode("wmc:Server").getAttribute("version");
};
this.getMethod=function(_26){
return _26.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
};
this.getQueryableLayers=function(){
var _27=this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer[attribute::queryable='1']/wmc:Name");
return _27;
};
this.getAllLayers=function(){
var _28=this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer");
return _28;
};
this.getLayer=function(_29){
var _2a=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_29+"']");
return _2a;
};
this.addLayer=function(_2b,_2c){
var _2d=_2b.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList");
_2d.appendChild(_2c.cloneNode(true));
_2b.modified=true;
};
this.addFirstListener("addLayer",this.addLayer,this);
this.addSLD=function(_2e,_2f){
var _30=_2f.selectSingleNode("//Name").firstChild.nodeValue;
var _31=_2e.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_30+"']");
_31.appendChild(_2f.cloneNode(true));
_2e.modified=true;
var _32=[];
_32["sld_body"]=(new XMLSerializer()).serializeToString(_2e.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_30+"']/wmc:StyleList/wmc:Style/wmc:SLD/wmc:StyledLayerDescriptor"));
_2e.map.mbMapPane.refreshLayer(_2e.map.mbMapPane,_30,_32);
};
this.addFirstListener("addSLD",this.addSLD,this);
this.deleteLayer=function(_33,_34){
var _35=_33.getLayer(_34);
if(!_35){
alert(mbGetMessage("nodeNotFound",_34));
return;
}
_35.parentNode.removeChild(_35);
_33.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_36,_37){
var _38=_36.getLayer(_37);
var _39=_38.selectSingleNode("following-sibling::*");
if(!_39){
alert(mbGetMessage("cantMoveUp",_37));
return;
}
_38.parentNode.insertBefore(_39,_38);
_36.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_3a,_3b){
var _3c=_3a.getLayer(_3b);
var _3d=_3c.selectNodes("preceding-sibling::*");
var _3e=_3d[_3d.length-1];
if(!_3e){
alert(mbGetMessage("cantMoveDown",_3b));
return;
}
_3c.parentNode.insertBefore(_3c,_3e);
_3a.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.setExtension=function(_3f){
var _40=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
if(!_40){
var _41=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General");
var _42=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_40=_41.appendChild(_42);
}
return _40.appendChild(_3f);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
};
this.initTimeExtent=function(_43){
var _44=_43.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_44.length;++i){
var _46=_44[i];
_43.timestampList=createElementWithNS(_43.doc,"TimestampList",mbNsUrl);
var _47=_46.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
_43.timestampList.setAttribute("layerName",_47);
var _48=_46.firstChild.nodeValue.split(",");
for(var j=0;j<_48.length;++j){
var _4a=_48[j].split("/");
if(_4a.length==3){
var _4b=setISODate(_4a[0]);
var _4c=setISODate(_4a[1]);
var _4d=_4a[2];
var _4e=_4d.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_4e.length;++i){
if(!_4e[i]){
_4e[i]=0;
}
}
do{
var _4f=createElementWithNS(_43.doc,"Timestamp",mbNsUrl);
_4f.appendChild(_43.doc.createTextNode(getISODate(_4b)));
_43.timestampList.appendChild(_4f);
_4b.setFullYear(_4b.getFullYear()+parseInt(_4e[2],10));
_4b.setMonth(_4b.getMonth()+parseInt(_4e[4],10));
_4b.setDate(_4b.getDate()+parseInt(_4e[6],10));
_4b.setHours(_4b.getHours()+parseInt(_4e[8],10));
_4b.setMinutes(_4b.getMinutes()+parseInt(_4e[10],10));
_4b.setSeconds(_4b.getSeconds()+parseFloat(_4e[12]));
}while(_4b.getTime()<=_4c.getTime());
}else{
var _4f=createElementWithNS(_43.doc,"Timestamp",mbNsUrl);
_4f.appendChild(_43.doc.createTextNode(_48[j]));
_43.timestampList.appendChild(_4f);
}
}
_43.setExtension(_43.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.clearTimeExtent=function(_50){
var _51=_50.timestampList;
if(_51){
_51.parentNode.removeChild(_51);
}
};
this.addListener("newModel",this.clearTimeExtent,this);
this.getCurrentTimestamp=function(_52){
var _53=this.getParam("timestamp");
return this.timestampList.childNodes[_53].firstChild.nodeValue;
};
this.setOpacity=function(_54,_55){
var _56=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_54+"']");
if(_56){
_56.setAttribute("opacity",_55);
}
this.callListeners("opacity",_54);
};
this.getOpacity=function(_57){
var _58=1;
var _59=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_57+"']");
if(_59){
_58=_59.getAttribute("opacity");
}
return _58;
};
}

OpenLayers={singleFile:true};
(function(){
var _1=(typeof OpenLayers=="object"&&OpenLayers.singleFile);
OpenLayers={_scriptName:(!_1)?"lib/OpenLayers.js":"OpenLayers.js",_getScriptLocation:function(){
var _2="";
var _3=OpenLayers._scriptName;
var _4=document.getElementsByTagName("script");
for(var i=0;i<_4.length;i++){
var _6=_4[i].getAttribute("src");
if(_6){
var _7=_6.lastIndexOf(_3);
if((_7>-1)&&(_7+_3.length==_6.length)){
_2=_6.slice(0,-_3.length);
break;
}
}
}
return _2;
}};
if(!_1){
var _8=new Array("OpenLayers/Util.js","OpenLayers/BaseTypes.js","OpenLayers/BaseTypes/Class.js","OpenLayers/BaseTypes/Bounds.js","OpenLayers/BaseTypes/Element.js","OpenLayers/BaseTypes/LonLat.js","OpenLayers/BaseTypes/Pixel.js","OpenLayers/BaseTypes/Size.js","OpenLayers/Console.js","Rico/Corner.js","Rico/Color.js","OpenLayers/Ajax.js","OpenLayers/Events.js","OpenLayers/Map.js","OpenLayers/Layer.js","OpenLayers/Icon.js","OpenLayers/Marker.js","OpenLayers/Marker/Box.js","OpenLayers/Popup.js","OpenLayers/Tile.js","OpenLayers/Tile/Image.js","OpenLayers/Tile/WFS.js","OpenLayers/Layer/Image.js","OpenLayers/Layer/SphericalMercator.js","OpenLayers/Layer/EventPane.js","OpenLayers/Layer/FixedZoomLevels.js","OpenLayers/Layer/Google.js","OpenLayers/Layer/VirtualEarth.js","OpenLayers/Layer/Yahoo.js","OpenLayers/Layer/HTTPRequest.js","OpenLayers/Layer/Grid.js","OpenLayers/Layer/MapServer.js","OpenLayers/Layer/MapServer/Untiled.js","OpenLayers/Layer/KaMap.js","OpenLayers/Layer/MultiMap.js","OpenLayers/Layer/Markers.js","OpenLayers/Layer/Text.js","OpenLayers/Layer/WorldWind.js","OpenLayers/Layer/WMS.js","OpenLayers/Layer/WMS/Untiled.js","OpenLayers/Layer/GeoRSS.js","OpenLayers/Layer/Boxes.js","OpenLayers/Layer/TMS.js","OpenLayers/Layer/TileCache.js","OpenLayers/Popup/Anchored.js","OpenLayers/Popup/AnchoredBubble.js","OpenLayers/Feature.js","OpenLayers/Feature/Vector.js","OpenLayers/Feature/WFS.js","OpenLayers/Handler.js","OpenLayers/Handler/Point.js","OpenLayers/Handler/Path.js","OpenLayers/Handler/Polygon.js","OpenLayers/Handler/Feature.js","OpenLayers/Handler/Drag.js","OpenLayers/Handler/RegularPolygon.js","OpenLayers/Handler/Box.js","OpenLayers/Handler/MouseWheel.js","OpenLayers/Handler/Keyboard.js","OpenLayers/Control.js","OpenLayers/Control/Attribution.js","OpenLayers/Control/ZoomBox.js","OpenLayers/Control/ZoomToMaxExtent.js","OpenLayers/Control/DragPan.js","OpenLayers/Control/Navigation.js","OpenLayers/Control/MouseDefaults.js","OpenLayers/Control/MousePosition.js","OpenLayers/Control/OverviewMap.js","OpenLayers/Control/KeyboardDefaults.js","OpenLayers/Control/PanZoom.js","OpenLayers/Control/PanZoomBar.js","OpenLayers/Control/ArgParser.js","OpenLayers/Control/Permalink.js","OpenLayers/Control/Scale.js","OpenLayers/Control/LayerSwitcher.js","OpenLayers/Control/DrawFeature.js","OpenLayers/Control/DragFeature.js","OpenLayers/Control/ModifyFeature.js","OpenLayers/Control/Panel.js","OpenLayers/Control/SelectFeature.js","OpenLayers/Geometry.js","OpenLayers/Geometry/Rectangle.js","OpenLayers/Geometry/Collection.js","OpenLayers/Geometry/Point.js","OpenLayers/Geometry/MultiPoint.js","OpenLayers/Geometry/Curve.js","OpenLayers/Geometry/LineString.js","OpenLayers/Geometry/LinearRing.js","OpenLayers/Geometry/Polygon.js","OpenLayers/Geometry/MultiLineString.js","OpenLayers/Geometry/MultiPolygon.js","OpenLayers/Geometry/Surface.js","OpenLayers/Renderer.js","OpenLayers/Renderer/Elements.js","OpenLayers/Renderer/SVG.js","OpenLayers/Renderer/VML.js","OpenLayers/Layer/Vector.js","OpenLayers/Layer/GML.js","OpenLayers/Format.js","OpenLayers/Format/XML.js","OpenLayers/Format/GML.js","OpenLayers/Format/KML.js","OpenLayers/Format/GeoRSS.js","OpenLayers/Format/WFS.js","OpenLayers/Format/WKT.js","OpenLayers/Format/JSON.js","OpenLayers/Format/GeoJSON.js","OpenLayers/Layer/WFS.js","OpenLayers/Control/MouseToolbar.js","OpenLayers/Control/NavToolbar.js","OpenLayers/Control/EditingToolbar.js");
var _9="";
var _a=OpenLayers._getScriptLocation()+"lib/";
for(var i=0;i<_8.length;i++){
if(/MSIE/.test(navigator.userAgent)||/Safari/.test(navigator.userAgent)){
var _c="<script src='"+_a+_8[i]+"'></script>";
_9+=_c;
}else{
var s=document.createElement("script");
s.src=_a+_8[i];
var h=document.getElementsByTagName("head").length?document.getElementsByTagName("head")[0]:document.body;
h.appendChild(s);
}
}
if(_9){
document.write(_9);
}
}
})();
OpenLayers.VERSION_NUMBER="$Revision$";
OpenLayers.String={startsWith:function(_f,sub){
return (_f.indexOf(sub)==0);
},contains:function(str,sub){
return (str.indexOf(sub)!=-1);
},trim:function(str){
return str.replace(/^\s*(.*?)\s*$/,"$1");
},camelize:function(str){
var _15=str.split("-");
var _16=_15[0];
for(var i=1;i<_15.length;i++){
var s=_15[i];
_16+=s.charAt(0).toUpperCase()+s.substring(1);
}
return _16;
}};
if(!String.prototype.startsWith){
String.prototype.startsWith=function(_19){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.String.startsWith instead");
return OpenLayers.String.startsWith(this,_19);
};
}
if(!String.prototype.contains){
String.prototype.contains=function(str){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.String.contains instead");
return OpenLayers.String.contains(this,str);
};
}
if(!String.prototype.trim){
String.prototype.trim=function(){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.String.trim instead");
return OpenLayers.String.trim(this);
};
}
if(!String.prototype.camelize){
String.prototype.camelize=function(){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.String.camelize instead");
return OpenLayers.String.camelize(this);
};
}
OpenLayers.Number={limitSigDigs:function(num,sig){
var fig;
if(sig>0){
fig=parseFloat(num.toPrecision(sig));
}else{
fig=0;
}
return fig;
}};
if(!Number.prototype.limitSigDigs){
Number.prototype.limitSigDigs=function(sig){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.Number.limitSigDigs instead");
return OpenLayers.Number.limitSigDigs(this,sig);
};
}
OpenLayers.Function={bind:function(_1f,_20){
var _21=Array.prototype.slice.apply(arguments,[2]);
return function(){
var _22=_21.concat(Array.prototype.slice.apply(arguments,[0]));
return _1f.apply(_20,_22);
};
},bindAsEventListener:function(_23,_24){
return function(_25){
return _23.call(_24,_25||window.event);
};
}};
if(!Function.prototype.bind){
Function.prototype.bind=function(){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.Function.bind instead");
Array.prototype.unshift.apply(arguments,[this]);
return OpenLayers.Function.bind.apply(null,arguments);
};
}
if(!Function.prototype.bindAsEventListener){
Function.prototype.bindAsEventListener=function(_26){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.Function.bindAsEventListener instead");
return OpenLayers.Function.bindAsEventListener(this,_26);
};
}
OpenLayers.Class=function(){
var _27=function(){
if(arguments&&arguments[0]!=OpenLayers.Class.isPrototype){
this.initialize.apply(this,arguments);
}
};
var _28={};
var _29;
for(var i=0;i<arguments.length;++i){
if(typeof arguments[i]=="function"){
_29=arguments[i].prototype;
}else{
_29=arguments[i];
}
OpenLayers.Util.extend(_28,_29);
}
_27.prototype=_28;
return _27;
};
OpenLayers.Class.isPrototype=function(){
};
OpenLayers.Class.create=function(){
return function(){
if(arguments&&arguments[0]!=OpenLayers.Class.isPrototype){
this.initialize.apply(this,arguments);
}
};
};
OpenLayers.Class.inherit=function(){
var _2b=arguments[0];
var _2c=new _2b(OpenLayers.Class.isPrototype);
for(var i=1;i<arguments.length;i++){
if(typeof arguments[i]=="function"){
var _2e=arguments[i];
arguments[i]=new _2e(OpenLayers.Class.isPrototype);
}
OpenLayers.Util.extend(_2c,arguments[i]);
}
return _2c;
};
OpenLayers.Util={};
OpenLayers.Util.getElement=function(){
var _2f=[];
for(var i=0;i<arguments.length;i++){
var _31=arguments[i];
if(typeof _31=="string"){
_31=document.getElementById(_31);
}
if(arguments.length==1){
return _31;
}
_2f.push(_31);
}
return _2f;
};
if($==null){
var $=OpenLayers.Util.getElement;
}
OpenLayers.Util.extend=function(_32,_33){
if(_32&&_33){
for(var _34 in _33){
_32[_34]=_33[_34];
}
if(_33.hasOwnProperty&&_33.hasOwnProperty("toString")){
_32.toString=_33.toString;
}
}
return _32;
};
OpenLayers.Util.removeItem=function(_35,_36){
for(var i=0;i<_35.length;i++){
if(_35[i]==_36){
_35.splice(i,1);
}
}
return _35;
};
OpenLayers.Util.clearArray=function(_38){
var msg="OpenLayers.Util.clearArray() is Deprecated."+" Please use 'array.length = 0' instead.";
OpenLayers.Console.warn(msg);
_38.length=0;
};
OpenLayers.Util.indexOf=function(_3a,obj){
for(var i=0;i<_3a.length;i++){
if(_3a[i]==obj){
return i;
}
}
return -1;
};
OpenLayers.Util.modifyDOMElement=function(_3d,id,px,sz,_41,_42,_43,_44){
if(id){
_3d.id=id;
}
if(px){
_3d.style.left=px.x+"px";
_3d.style.top=px.y+"px";
}
if(sz){
_3d.style.width=sz.w+"px";
_3d.style.height=sz.h+"px";
}
if(_41){
_3d.style.position=_41;
}
if(_42){
_3d.style.border=_42;
}
if(_43){
_3d.style.overflow=_43;
}
if(_44){
_3d.style.opacity=_44;
_3d.style.filter="alpha(opacity="+(_44*100)+")";
}
};
OpenLayers.Util.createDiv=function(id,px,sz,_48,_49,_4a,_4b,_4c){
var dom=document.createElement("div");
if(_48){
dom.style.backgroundImage="url("+_48+")";
}
if(!id){
id=OpenLayers.Util.createUniqueID("OpenLayersDiv");
}
if(!_49){
_49="absolute";
}
OpenLayers.Util.modifyDOMElement(dom,id,px,sz,_49,_4a,_4b,_4c);
return dom;
};
OpenLayers.Util.createImage=function(id,px,sz,_51,_52,_53,_54,_55){
var _56=document.createElement("img");
if(!id){
id=OpenLayers.Util.createUniqueID("OpenLayersDiv");
}
if(!_52){
_52="relative";
}
OpenLayers.Util.modifyDOMElement(_56,id,px,sz,_52,_53,null,_54);
if(_55){
_56.style.display="none";
OpenLayers.Event.observe(_56,"load",OpenLayers.Function.bind(OpenLayers.Util.onImageLoad,_56));
OpenLayers.Event.observe(_56,"error",OpenLayers.Function.bind(OpenLayers.Util.onImageLoadError,_56));
}
_56.style.alt=id;
_56.galleryImg="no";
if(_51){
_56.src=_51;
}
return _56;
};
OpenLayers.Util.setOpacity=function(_57,_58){
OpenLayers.Util.modifyDOMElement(_57,null,null,null,null,null,null,_58);
};
OpenLayers.Util.onImageLoad=function(){
if(!this.viewRequestID||(this.map&&this.viewRequestID==this.map.viewRequestID)){
this.style.backgroundColor=null;
this.style.display="";
}
};
OpenLayers.Util.onImageLoadErrorColor="pink";
OpenLayers.IMAGE_RELOAD_ATTEMPTS=0;
OpenLayers.Util.onImageLoadError=function(){
this._attempts=(this._attempts)?(this._attempts+1):1;
if(this._attempts<=OpenLayers.IMAGE_RELOAD_ATTEMPTS){
this.src=this.src;
}else{
this.style.backgroundColor=OpenLayers.Util.onImageLoadErrorColor;
}
this.style.display="";
};
OpenLayers.Util.alphaHack=function(){
var _59=navigator.appVersion.split("MSIE");
var _5a=parseFloat(_59[1]);
var _5b=false;
try{
_5b=document.body.filters;
}
catch(e){
}
return (_5b&&(_5a>=5.5)&&(_5a<7));
};
OpenLayers.Util.modifyAlphaImageDiv=function(div,id,px,sz,_60,_61,_62,_63,_64){
OpenLayers.Util.modifyDOMElement(div,id,px,sz);
var img=div.childNodes[0];
if(_60){
img.src=_60;
}
OpenLayers.Util.modifyDOMElement(img,div.id+"_innerImage",null,sz,"relative",_62);
if(_64){
div.style.opacity=_64;
div.style.filter="alpha(opacity="+(_64*100)+")";
}
if(OpenLayers.Util.alphaHack()){
div.style.display="inline-block";
if(_63==null){
_63="scale";
}
div.style.filter="progid:DXImageTransform.Microsoft"+".AlphaImageLoader(src='"+img.src+"', "+"sizingMethod='"+_63+"')";
if(div.style.opacity){
div.style.filter+=" alpha(opacity="+div.style.opacity*100+")";
}
img.style.filter="progid:DXImageTransform.Microsoft"+".Alpha(opacity=0)";
}
};
OpenLayers.Util.createAlphaImageDiv=function(id,px,sz,_69,_6a,_6b,_6c,_6d,_6e){
var div=OpenLayers.Util.createDiv();
var img=OpenLayers.Util.createImage(null,null,null,null,null,null,null,false);
div.appendChild(img);
if(_6e){
img.style.display="none";
OpenLayers.Event.observe(img,"load",OpenLayers.Function.bind(OpenLayers.Util.onImageLoad,div));
OpenLayers.Event.observe(img,"error",OpenLayers.Function.bind(OpenLayers.Util.onImageLoadError,div));
}
OpenLayers.Util.modifyAlphaImageDiv(div,id,px,sz,_69,_6a,_6b,_6c,_6d);
return div;
};
OpenLayers.Util.upperCaseObject=function(_71){
var _72={};
for(var key in _71){
_72[key.toUpperCase()]=_71[key];
}
return _72;
};
OpenLayers.Util.applyDefaults=function(to,_75){
for(var key in _75){
if(to[key]==null){
to[key]=_75[key];
}
}
};
OpenLayers.Util.getParameterString=function(_77){
paramsArray=[];
for(var key in _77){
var _79=_77[key];
if((_79!=null)&&(typeof _79!="function")){
var _7a;
if(typeof _79=="object"&&_79.constructor==Array){
var _7b=[];
for(var _7c=0;_7c<_79.length;_7c++){
_7b.push(encodeURIComponent(_79[_7c]));
}
_7a=_7b.join(",");
}else{
_7a=encodeURIComponent(_79);
}
paramsArray.push(encodeURIComponent(key)+"="+_7a);
}
}
return paramsArray.join("&");
};
OpenLayers.ImgPath="";
OpenLayers.Util.getImagesLocation=function(){
return OpenLayers.ImgPath||(OpenLayers._getScriptLocation()+"img/");
};
OpenLayers.Util.Try=function(){
var _7d=null;
for(var i=0;i<arguments.length;i++){
var _7f=arguments[i];
try{
_7d=_7f();
break;
}
catch(e){
}
}
return _7d;
};
OpenLayers.Util.getNodes=function(p,_81){
var _82=OpenLayers.Util.Try(function(){
return OpenLayers.Util._getNodes(p.documentElement.childNodes,_81);
},function(){
return OpenLayers.Util._getNodes(p.childNodes,_81);
});
return _82;
};
OpenLayers.Util._getNodes=function(_83,_84){
var _85=[];
for(var i=0;i<_83.length;i++){
if(_83[i].nodeName==_84){
_85.push(_83[i]);
}
}
return _85;
};
OpenLayers.Util.getTagText=function(_87,_88,_89){
var _8a=OpenLayers.Util.getNodes(_87,_88);
if(_8a&&(_8a.length>0)){
if(!_89){
_89=0;
}
if(_8a[_89].childNodes.length>1){
return _8a.childNodes[1].nodeValue;
}else{
if(_8a[_89].childNodes.length==1){
return _8a[_89].firstChild.nodeValue;
}
}
}else{
return "";
}
};
OpenLayers.Util.getXmlNodeValue=function(_8b){
var val=null;
OpenLayers.Util.Try(function(){
val=_8b.text;
if(!val){
val=_8b.textContent;
}
if(!val){
val=_8b.firstChild.nodeValue;
}
},function(){
val=_8b.textContent;
});
return val;
};
OpenLayers.Util.mouseLeft=function(evt,div){
var _8f=(evt.relatedTarget)?evt.relatedTarget:evt.toElement;
while(_8f!=div&&_8f!=null){
_8f=_8f.parentNode;
}
return (_8f!=div);
};
OpenLayers.Util.rad=function(x){
return x*Math.PI/180;
};
OpenLayers.Util.distVincenty=function(p1,p2){
var a=6378137,b=6356752.3142,f=1/298.257223563;
var L=OpenLayers.Util.rad(p2.lon-p1.lon);
var U1=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p1.lat)));
var U2=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p2.lat)));
var _97=Math.sin(U1),cosU1=Math.cos(U1);
var _98=Math.sin(U2),cosU2=Math.cos(U2);
var _99=L,lambdaP=2*Math.PI;
var _9a=20;
while(Math.abs(_99-lambdaP)>1e-12&&--_9a>0){
var _9b=Math.sin(_99),cosLambda=Math.cos(_99);
var _9c=Math.sqrt((cosU2*_9b)*(cosU2*_9b)+(cosU1*_98-_97*cosU2*cosLambda)*(cosU1*_98-_97*cosU2*cosLambda));
if(_9c==0){
return 0;
}
var _9d=_97*_98+cosU1*cosU2*cosLambda;
var _9e=Math.atan2(_9c,_9d);
var _9f=Math.asin(cosU1*cosU2*_9b/_9c);
var _a0=Math.cos(_9f)*Math.cos(_9f);
var _a1=_9d-2*_97*_98/_a0;
var C=f/16*_a0*(4+f*(4-3*_a0));
lambdaP=_99;
_99=L+(1-C)*f*Math.sin(_9f)*(_9e+C*_9c*(_a1+C*_9d*(-1+2*_a1*_a1)));
}
if(_9a==0){
return NaN;
}
var uSq=_a0*(a*a-b*b)/(b*b);
var A=1+uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
var B=uSq/1024*(256+uSq*(-128+uSq*(74-47*uSq)));
var _a6=B*_9c*(_a1+B/4*(_9d*(-1+2*_a1*_a1)-B/6*_a1*(-3+4*_9c*_9c)*(-3+4*_a1*_a1)));
var s=b*A*(_9e-_a6);
var d=s.toFixed(3)/1000;
return d;
};
OpenLayers.Util.getParameters=function(url){
url=url||window.location.href;
if(url==null){
url=window.location.href;
}
var _aa="";
if(OpenLayers.String.contains(url,"?")){
var _ab=url.indexOf("?")+1;
var end=OpenLayers.String.contains(url,"#")?url.indexOf("#"):url.length;
_aa=url.substring(_ab,end);
}
var _ad={};
var _ae=_aa.split(/[&;]/);
for(var i=0;i<_ae.length;++i){
var _b0=_ae[i].split("=");
if(_b0[0]){
var key=decodeURIComponent(_b0[0]);
var _b2=_b0[1]||"";
_b2=_b2.split(",");
for(var j=0;j<_b2.length;j++){
_b2[j]=decodeURIComponent(_b2[j]);
}
if(_b2.length==1){
_b2=_b2[0];
}
_ad[key]=_b2;
}
}
return _ad;
};
OpenLayers.Util.getArgs=function(url){
var err="The getArgs() function is deprecated and will be removed "+"with the 3.0 version of OpenLayers. Please instead use "+"OpenLayers.Util.getParameters().";
OpenLayers.Console.warn(err);
return OpenLayers.Util.getParameters(url);
};
OpenLayers.Util.lastSeqID=0;
OpenLayers.Util.createUniqueID=function(_b6){
if(_b6==null){
_b6="id_";
}
OpenLayers.Util.lastSeqID+=1;
return _b6+OpenLayers.Util.lastSeqID;
};
OpenLayers.INCHES_PER_UNIT={"inches":1,"ft":12,"mi":63360,"m":39.3701,"km":39370.1,"dd":4374754};
OpenLayers.INCHES_PER_UNIT["in"]=OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"]=OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.DOTS_PER_INCH=72;
OpenLayers.Util.normalizeScale=function(_b7){
var _b8=(_b7>1)?(1/_b7):_b7;
return _b8;
};
OpenLayers.Util.getResolutionFromScale=function(_b9,_ba){
if(_ba==null){
_ba="degrees";
}
var _bb=OpenLayers.Util.normalizeScale(_b9);
var _bc=1/(_bb*OpenLayers.INCHES_PER_UNIT[_ba]*OpenLayers.DOTS_PER_INCH);
return _bc;
};
OpenLayers.Util.getScaleFromResolution=function(_bd,_be){
if(_be==null){
_be="degrees";
}
var _bf=_bd*OpenLayers.INCHES_PER_UNIT[_be]*OpenLayers.DOTS_PER_INCH;
return _bf;
};
OpenLayers.Util.safeStopPropagation=function(evt){
OpenLayers.Event.stop(evt,true);
};
OpenLayers.Util.pagePosition=function(_c1){
var _c2=0,valueL=0;
var _c3=_c1;
var _c4=_c1;
while(_c3){
if(_c3==document.body){
if(_c4&&_c4.style&&OpenLayers.Element.getStyle(_c4,"position")=="absolute"){
break;
}
}
_c2+=_c3.offsetTop||0;
valueL+=_c3.offsetLeft||0;
_c4=_c3;
try{
_c3=_c3.offsetParent;
}
catch(e){
OpenLayers.Console.error("OpenLayers.Util.pagePosition failed: element with id "+_c3.id+" may be misplaced.");
break;
}
}
_c3=_c1;
while(_c3){
_c2-=_c3.scrollTop||0;
valueL-=_c3.scrollLeft||0;
_c3=_c3.parentNode;
}
return [valueL,_c2];
};
OpenLayers.Util.isEquivalentUrl=function(_c5,_c6,_c7){
_c7=_c7||{};
OpenLayers.Util.applyDefaults(_c7,{ignoreCase:true,ignorePort80:true,ignoreHash:true});
urlObj1=OpenLayers.Util.createUrlObject(_c5,_c7);
urlObj2=OpenLayers.Util.createUrlObject(_c6,_c7);
for(var key in urlObj1){
if(_c7.test){
alert(key+"\n1:"+urlObj1[key]+"\n2:"+urlObj2[key]);
}
var _c9=urlObj1[key];
var _ca=urlObj2[key];
switch(key){
case "args":
break;
case "host":
case "port":
case "protocol":
if((_c9=="")||(_ca=="")){
break;
}
default:
if((key!="args")&&(urlObj1[key]!=urlObj2[key])){
return false;
}
break;
}
}
for(var key in urlObj1.args){
if(urlObj1.args[key]!=urlObj2.args[key]){
return false;
}
delete urlObj2.args[key];
}
for(var key in urlObj2.args){
return false;
}
return true;
};
OpenLayers.Util.createUrlObject=function(url,_cc){
_cc=_cc||{};
var _cd={};
if(_cc.ignoreCase){
url=url.toLowerCase();
}
var a=document.createElement("a");
a.href=url;
_cd.host=a.host;
var _cf=a.port;
if(_cf.length<=0){
var _d0=_cd.host.length-(_cf.length);
_cd.host=_cd.host.substring(0,_d0);
}
_cd.protocol=a.protocol;
_cd.port=((_cf=="80")&&(_cc.ignorePort80))?"":_cf;
_cd.hash=(_cc.ignoreHash)?"":a.hash;
var _d1=a.search;
if(!_d1){
var _d2=url.indexOf("?");
_d1=(_d2!=-1)?url.substr(_d2):"";
}
_cd.args=OpenLayers.Util.getParameters(_d1);
if(((_cd.protocol=="file:")&&(url.indexOf("file:")!=-1))||((_cd.protocol!="file:")&&(_cd.host!=""))){
_cd.pathname=a.pathname;
var _d3=_cd.pathname.indexOf("?");
if(_d3!=-1){
_cd.pathname=_cd.pathname.substring(0,_d3);
}
}else{
var _d4=OpenLayers.Util.removeTail(url);
var _d5=0;
do{
var _d6=_d4.indexOf("../");
if(_d6==0){
_d5++;
_d4=_d4.substr(3);
}else{
if(_d6>=0){
var _d7=_d4.substr(0,_d6-1);
var _d8=_d7.indexOf("/");
_d7=(_d8!=-1)?_d7.substr(0,_d8+1):"";
var _d9=_d4.substr(_d6+3);
_d4=_d7+_d9;
}
}
}while(_d6!=-1);
var _da=document.createElement("a");
var _db=window.location.href;
if(_cc.ignoreCase){
_db=_db.toLowerCase();
}
_da.href=_db;
_cd.protocol=_da.protocol;
var _dc=(_da.pathname.indexOf("/")!=-1)?"/":"\\";
var _dd=_da.pathname.split(_dc);
_dd.pop();
while((_d5>0)&&(_dd.length>0)){
_dd.pop();
_d5--;
}
_d4=_dd.join("/")+"/"+_d4;
_cd.pathname=_d4;
}
if((_cd.protocol=="file:")||(_cd.protocol=="")){
_cd.host="localhost";
}
return _cd;
};
OpenLayers.Util.removeTail=function(url){
var _df=null;
var _e0=url.indexOf("?");
var _e1=url.indexOf("#");
if(_e0==-1){
_df=(_e1!=-1)?url.substr(0,_e1):url;
}else{
_df=(_e1!=-1)?url.substr(0,Math.min(_e0,_e1)):url.substr(0,_e0);
}
return _df;
};
OpenLayers.Util.getBrowserName=function(){
var _e2="";
var ua=navigator.userAgent.toLowerCase();
if(ua.indexOf("opera")!=-1){
_e2="opera";
}else{
if(ua.indexOf("msie")!=-1){
_e2="msie";
}else{
if(ua.indexOf("safari")!=-1){
_e2="safari";
}else{
if(ua.indexOf("mozilla")!=-1){
if(ua.indexOf("firefox")!=-1){
_e2="firefox";
}else{
_e2="mozilla";
}
}
}
}
}
return _e2;
};
OpenLayers.Rico=new Object();
OpenLayers.Rico.Corner={round:function(e,_e5){
e=OpenLayers.Util.getElement(e);
this._setOptions(_e5);
var _e6=this.options.color;
if(this.options.color=="fromElement"){
_e6=this._background(e);
}
var _e7=this.options.bgColor;
if(this.options.bgColor=="fromParent"){
_e7=this._background(e.offsetParent);
}
this._roundCornersImpl(e,_e6,_e7);
},changeColor:function(_e8,_e9){
_e8.style.backgroundColor=_e9;
var _ea=_e8.parentNode.getElementsByTagName("span");
for(var _eb=0;_eb<_ea.length;_eb++){
_ea[_eb].style.backgroundColor=_e9;
}
},changeOpacity:function(_ec,_ed){
var _ee=_ed;
var _ef="alpha(opacity="+_ed*100+")";
_ec.style.opacity=_ee;
_ec.style.filter=_ef;
var _f0=_ec.parentNode.getElementsByTagName("span");
for(var _f1=0;_f1<_f0.length;_f1++){
_f0[_f1].style.opacity=_ee;
_f0[_f1].style.filter=_ef;
}
},reRound:function(_f2,_f3){
var _f4=_f2.parentNode.childNodes[0];
var _f5=_f2.parentNode.childNodes[2];
_f2.parentNode.removeChild(_f4);
_f2.parentNode.removeChild(_f5);
this.round(_f2.parentNode,_f3);
},_roundCornersImpl:function(e,_f7,_f8){
if(this.options.border){
this._renderBorder(e,_f8);
}
if(this._isTopRounded()){
this._roundTopCorners(e,_f7,_f8);
}
if(this._isBottomRounded()){
this._roundBottomCorners(e,_f7,_f8);
}
},_renderBorder:function(el,_fa){
var _fb="1px solid "+this._borderColor(_fa);
var _fc="border-left: "+_fb;
var _fd="border-right: "+_fb;
var _fe="style='"+_fc+";"+_fd+"'";
el.innerHTML="<div "+_fe+">"+el.innerHTML+"</div>";
},_roundTopCorners:function(el,_100,_101){
var _102=this._createCorner(_101);
for(var i=0;i<this.options.numSlices;i++){
_102.appendChild(this._createCornerSlice(_100,_101,i,"top"));
}
el.style.paddingTop=0;
el.insertBefore(_102,el.firstChild);
},_roundBottomCorners:function(el,_105,_106){
var _107=this._createCorner(_106);
for(var i=(this.options.numSlices-1);i>=0;i--){
_107.appendChild(this._createCornerSlice(_105,_106,i,"bottom"));
}
el.style.paddingBottom=0;
el.appendChild(_107);
},_createCorner:function(_109){
var _10a=document.createElement("div");
_10a.style.backgroundColor=(this._isTransparent()?"transparent":_109);
return _10a;
},_createCornerSlice:function(_10b,_10c,n,_10e){
var _10f=document.createElement("span");
var _110=_10f.style;
_110.backgroundColor=_10b;
_110.display="block";
_110.height="1px";
_110.overflow="hidden";
_110.fontSize="1px";
var _111=this._borderColor(_10b,_10c);
if(this.options.border&&n==0){
_110.borderTopStyle="solid";
_110.borderTopWidth="1px";
_110.borderLeftWidth="0px";
_110.borderRightWidth="0px";
_110.borderBottomWidth="0px";
_110.height="0px";
_110.borderColor=_111;
}else{
if(_111){
_110.borderColor=_111;
_110.borderStyle="solid";
_110.borderWidth="0px 1px";
}
}
if(!this.options.compact&&(n==(this.options.numSlices-1))){
_110.height="2px";
}
this._setMargin(_10f,n,_10e);
this._setBorder(_10f,n,_10e);
return _10f;
},_setOptions:function(_112){
this.options={corners:"all",color:"fromElement",bgColor:"fromParent",blend:true,border:false,compact:false};
OpenLayers.Util.extend(this.options,_112||{});
this.options.numSlices=this.options.compact?2:4;
if(this._isTransparent()){
this.options.blend=false;
}
},_whichSideTop:function(){
if(this._hasString(this.options.corners,"all","top")){
return "";
}
if(this.options.corners.indexOf("tl")>=0&&this.options.corners.indexOf("tr")>=0){
return "";
}
if(this.options.corners.indexOf("tl")>=0){
return "left";
}else{
if(this.options.corners.indexOf("tr")>=0){
return "right";
}
}
return "";
},_whichSideBottom:function(){
if(this._hasString(this.options.corners,"all","bottom")){
return "";
}
if(this.options.corners.indexOf("bl")>=0&&this.options.corners.indexOf("br")>=0){
return "";
}
if(this.options.corners.indexOf("bl")>=0){
return "left";
}else{
if(this.options.corners.indexOf("br")>=0){
return "right";
}
}
return "";
},_borderColor:function(_113,_114){
if(_113=="transparent"){
return _114;
}else{
if(this.options.border){
return this.options.border;
}else{
if(this.options.blend){
return this._blend(_114,_113);
}else{
return "";
}
}
}
},_setMargin:function(el,n,_117){
var _118=this._marginSize(n);
var _119=_117=="top"?this._whichSideTop():this._whichSideBottom();
if(_119=="left"){
el.style.marginLeft=_118+"px";
el.style.marginRight="0px";
}else{
if(_119=="right"){
el.style.marginRight=_118+"px";
el.style.marginLeft="0px";
}else{
el.style.marginLeft=_118+"px";
el.style.marginRight=_118+"px";
}
}
},_setBorder:function(el,n,_11c){
var _11d=this._borderSize(n);
var _11e=_11c=="top"?this._whichSideTop():this._whichSideBottom();
if(_11e=="left"){
el.style.borderLeftWidth=_11d+"px";
el.style.borderRightWidth="0px";
}else{
if(_11e=="right"){
el.style.borderRightWidth=_11d+"px";
el.style.borderLeftWidth="0px";
}else{
el.style.borderLeftWidth=_11d+"px";
el.style.borderRightWidth=_11d+"px";
}
}
if(this.options.border!=false){
el.style.borderLeftWidth=_11d+"px";
}
el.style.borderRightWidth=_11d+"px";
},_marginSize:function(n){
if(this._isTransparent()){
return 0;
}
var _120=[5,3,2,1];
var _121=[3,2,1,0];
var _122=[2,1];
var _123=[1,0];
if(this.options.compact&&this.options.blend){
return _123[n];
}else{
if(this.options.compact){
return _122[n];
}else{
if(this.options.blend){
return _121[n];
}else{
return _120[n];
}
}
}
},_borderSize:function(n){
var _125=[5,3,2,1];
var _126=[2,1,1,1];
var _127=[1,0];
var _128=[0,2,0,0];
if(this.options.compact&&(this.options.blend||this._isTransparent())){
return 1;
}else{
if(this.options.compact){
return _127[n];
}else{
if(this.options.blend){
return _126[n];
}else{
if(this.options.border){
return _128[n];
}else{
if(this._isTransparent()){
return _125[n];
}
}
}
}
}
return 0;
},_hasString:function(str){
for(var i=1;i<arguments.length;i++){
if(str.indexOf(arguments[i])>=0){
return true;
}
}
return false;
},_blend:function(c1,c2){
var cc1=OpenLayers.Rico.Color.createFromHex(c1);
cc1.blend(OpenLayers.Rico.Color.createFromHex(c2));
return cc1;
},_background:function(el){
try{
return OpenLayers.Rico.Color.createColorFromBackground(el).asHex();
}
catch(err){
return "#ffffff";
}
},_isTransparent:function(){
return this.options.color=="transparent";
},_isTopRounded:function(){
return this._hasString(this.options.corners,"all","top","tl","tr");
},_isBottomRounded:function(){
return this._hasString(this.options.corners,"all","bottom","bl","br");
},_hasSingleTextChild:function(el){
return el.childNodes.length==1&&el.childNodes[0].nodeType==3;
}};
OpenLayers.ProxyHost="";
OpenLayers.nullHandler=function(_130){
alert("Unhandled request return "+_130.statusText);
};
OpenLayers.loadURL=function(uri,_132,_133,_134,_135){
if(OpenLayers.ProxyHost&&OpenLayers.String.startsWith(uri,"http")){
uri=OpenLayers.ProxyHost+escape(uri);
}
var _136=(_134)?OpenLayers.Function.bind(_134,_133):OpenLayers.nullHandler;
var _137=(_135)?OpenLayers.Function.bind(_135,_133):OpenLayers.nullHandler;
new OpenLayers.Ajax.Request(uri,{method:"get",parameters:_132,onComplete:_136,onFailure:_137});
};
OpenLayers.parseXMLString=function(text){
var _139=text.indexOf("<");
if(_139>0){
text=text.substring(_139);
}
var _13a=OpenLayers.Util.Try(function(){
var _13b=new ActiveXObject("Microsoft.XMLDOM");
_13b.loadXML(text);
return _13b;
},function(){
return new DOMParser().parseFromString(text,"text/xml");
},function(){
var req=new XMLHttpRequest();
req.open("GET","data:"+"text/xml"+";charset=utf-8,"+encodeURIComponent(text),false);
if(req.overrideMimeType){
req.overrideMimeType("text/xml");
}
req.send(null);
return req.responseXML;
});
return _13a;
};
OpenLayers.Ajax={emptyFunction:function(){
},getTransport:function(){
return OpenLayers.Util.Try(function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
},function(){
return new XMLHttpRequest();
})||false;
},activeRequestCount:0};
OpenLayers.Ajax.Responders={responders:[],register:function(_13d){
for(var i=0;i<this.responders.length;i++){
if(_13d==this.responders[i]){
return;
}
}
this.responders.push(_13d);
},dispatch:function(_13f,_140,_141,json){
var _143;
for(var i=0;i<this.responders.length;i++){
_143=this.responders[i];
if(_143[_13f]&&typeof _143[_13f]=="function"){
try{
_143[_13f].apply(_143,[_140,_141,json]);
}
catch(e){
}
}
}
}};
OpenLayers.Ajax.Responders.register({onCreate:function(){
OpenLayers.Ajax.activeRequestCount++;
},onComplete:function(){
OpenLayers.Ajax.activeRequestCount--;
}});
OpenLayers.Ajax.Base=function(){
};
OpenLayers.Ajax.Base.prototype={setOptions:function(_145){
this.options={"method":"post","asynchronous":true,"parameters":""};
OpenLayers.Util.extend(this.options,_145||{});
},responseIsSuccess:function(){
return this.transport.status==undefined||this.transport.status==0||(this.transport.status>=200&&this.transport.status<300);
},responseIsFailure:function(){
return !this.responseIsSuccess();
}};
OpenLayers.Ajax.Request=OpenLayers.Class(OpenLayers.Ajax.Base,{initialize:function(url,_147){
this.transport=OpenLayers.Ajax.getTransport();
this.setOptions(_147);
this.request(url);
},request:function(url){
var _149=this.options.parameters||"";
if(_149.length>0){
_149+="&_=";
}
try{
this.url=url;
if(this.options.method=="get"&&_149.length>0){
this.url+=(this.url.match(/\?/)?"&":"?")+_149;
}
OpenLayers.Ajax.Responders.dispatch("onCreate",this,this.transport);
this.transport.open(this.options.method,this.url,this.options.asynchronous);
if(this.options.asynchronous){
this.transport.onreadystatechange=OpenLayers.Function.bind(this.onStateChange,this);
setTimeout(OpenLayers.Function.bind((function(){
this.respondToReadyState(1);
}),this),10);
}
this.setRequestHeaders();
var body=this.options.postBody?this.options.postBody:_149;
this.transport.send(this.options.method=="post"?body:null);
if(!this.options.asynchronous&&this.transport.overrideMimeType){
this.onStateChange();
}
}
catch(e){
this.dispatchException(e);
}
},setRequestHeaders:function(){
var _14b=["X-Requested-With","XMLHttpRequest","X-Prototype-Version","OpenLayers"];
if(this.options.method=="post"&&!this.options.postBody){
_14b.push("Content-type","application/x-www-form-urlencoded");
if(this.transport.overrideMimeType){
_14b.push("Connection","close");
}
}
if(this.options.requestHeaders){
_14b.push.apply(_14b,this.options.requestHeaders);
}
for(var i=0;i<_14b.length;i+=2){
this.transport.setRequestHeader(_14b[i],_14b[i+1]);
}
},onStateChange:function(){
var _14d=this.transport.readyState;
if(_14d!=1){
this.respondToReadyState(this.transport.readyState);
}
},header:function(name){
try{
return this.transport.getResponseHeader(name);
}
catch(e){
}
},evalJSON:function(){
try{
return eval(this.header("X-JSON"));
}
catch(e){
}
},evalResponse:function(){
try{
return eval(this.transport.responseText);
}
catch(e){
this.dispatchException(e);
}
},respondToReadyState:function(_14f){
var _150=OpenLayers.Ajax.Request.Events[_14f];
var _151=this.transport,json=this.evalJSON();
if(_150=="Complete"){
try{
var _152=this.responseIsSuccess()?"Success":"Failure";
(this.options["on"+this.transport.status]||this.options["on"+_152]||OpenLayers.Ajax.emptyFunction)(_151,json);
}
catch(e){
this.dispatchException(e);
}
var _153=this.header("Content-type")||"";
if(_153.match(/^text\/javascript/i)){
this.evalResponse();
}
}
try{
(this.options["on"+_150]||OpenLayers.Ajax.emptyFunction)(_151,json);
OpenLayers.Ajax.Responders.dispatch("on"+_150,this,_151,json);
}
catch(e){
this.dispatchException(e);
}
if(_150=="Complete"){
this.transport.onreadystatechange=OpenLayers.Ajax.emptyFunction;
}
},dispatchException:function(_154){
if(this.options.onException){
this.options.onException(this,_154);
}else{
throw _154;
}
OpenLayers.Ajax.Responders.dispatch("onException",this,_154);
}});
OpenLayers.Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
OpenLayers.Ajax.getElementsByTagNameNS=function(_155,_156,_157,_158){
var elem=null;
if(_155.getElementsByTagNameNS){
elem=_155.getElementsByTagNameNS(_156,_158);
}else{
elem=_155.getElementsByTagName(_157+":"+_158);
}
return elem;
};
OpenLayers.Ajax.serializeXMLToString=function(_15a){
var _15b=new XMLSerializer();
data=_15b.serializeToString(_15a);
return data;
};
OpenLayers.Bounds=OpenLayers.Class({left:null,bottom:null,right:null,top:null,initialize:function(left,_15d,_15e,top){
if(left!=null){
this.left=parseFloat(left);
}
if(_15d!=null){
this.bottom=parseFloat(_15d);
}
if(_15e!=null){
this.right=parseFloat(_15e);
}
if(top!=null){
this.top=parseFloat(top);
}
},clone:function(){
return new OpenLayers.Bounds(this.left,this.bottom,this.right,this.top);
},equals:function(_160){
var _161=false;
if(_160!=null){
_161=((this.left==_160.left)&&(this.right==_160.right)&&(this.top==_160.top)&&(this.bottom==_160.bottom));
}
return _161;
},toString:function(){
return ("left-bottom=("+this.left+","+this.bottom+")"+" right-top=("+this.right+","+this.top+")");
},toArray:function(){
return [this.left,this.bottom,this.right,this.top];
},toBBOX:function(_162){
if(_162==null){
_162=6;
}
var mult=Math.pow(10,_162);
var bbox=Math.round(this.left*mult)/mult+","+Math.round(this.bottom*mult)/mult+","+Math.round(this.right*mult)/mult+","+Math.round(this.top*mult)/mult;
return bbox;
},getWidth:function(){
return (this.right-this.left);
},getHeight:function(){
return (this.top-this.bottom);
},getSize:function(){
return new OpenLayers.Size(this.getWidth(),this.getHeight());
},getCenterPixel:function(){
return new OpenLayers.Pixel((this.left+this.right)/2,(this.bottom+this.top)/2);
},getCenterLonLat:function(){
return new OpenLayers.LonLat((this.left+this.right)/2,(this.bottom+this.top)/2);
},add:function(x,y){
if((x==null)||(y==null)){
var msg="You must pass both x and y values to the add function.";
OpenLayers.Console.error(msg);
return null;
}
return new OpenLayers.Bounds(this.left+x,this.bottom+y,this.right+x,this.top+y);
},extend:function(_168){
var _169=null;
if(_168){
switch(_168.CLASS_NAME){
case "OpenLayers.LonLat":
_169=new OpenLayers.Bounds(_168.lon,_168.lat,_168.lon,_168.lat);
break;
case "OpenLayers.Geometry.Point":
_169=new OpenLayers.Bounds(_168.x,_168.y,_168.x,_168.y);
break;
case "OpenLayers.Bounds":
_169=_168;
break;
}
if(_169){
if((this.left==null)||(_169.left<this.left)){
this.left=_169.left;
}
if((this.bottom==null)||(_169.bottom<this.bottom)){
this.bottom=_169.bottom;
}
if((this.right==null)||(_169.right>this.right)){
this.right=_169.right;
}
if((this.top==null)||(_169.top>this.top)){
this.top=_169.top;
}
}
}
},containsLonLat:function(ll,_16b){
return this.contains(ll.lon,ll.lat,_16b);
},containsPixel:function(px,_16d){
return this.contains(px.x,px.y,_16d);
},contains:function(x,y,_170){
if(_170==null){
_170=true;
}
var _171=false;
if(_170){
_171=((x>=this.left)&&(x<=this.right)&&(y>=this.bottom)&&(y<=this.top));
}else{
_171=((x>this.left)&&(x<this.right)&&(y>this.bottom)&&(y<this.top));
}
return _171;
},intersectsBounds:function(_172,_173){
if(_173==null){
_173=true;
}
var _174=(_172.bottom==this.bottom&&_172.top==this.top)?true:(((_172.bottom>this.bottom)&&(_172.bottom<this.top))||((this.bottom>_172.bottom)&&(this.bottom<_172.top)));
var _175=(_172.bottom==this.bottom&&_172.top==this.top)?true:(((_172.top>this.bottom)&&(_172.top<this.top))||((this.top>_172.bottom)&&(this.top<_172.top)));
var _176=(_172.right==this.right&&_172.left==this.left)?true:(((_172.right>this.left)&&(_172.right<this.right))||((this.right>_172.left)&&(this.right<_172.right)));
var _177=(_172.right==this.right&&_172.left==this.left)?true:(((_172.left>this.left)&&(_172.left<this.right))||((this.left>_172.left)&&(this.left<_172.right)));
return (this.containsBounds(_172,true,_173)||_172.containsBounds(this,true,_173)||((_175||_174)&&(_177||_176)));
},containsBounds:function(_178,_179,_17a){
if(_179==null){
_179=false;
}
if(_17a==null){
_17a=true;
}
var _17b;
var _17c;
var _17d;
var _17e;
if(_17a){
_17b=(_178.left>=this.left)&&(_178.left<=this.right);
_17c=(_178.top>=this.bottom)&&(_178.top<=this.top);
_17d=(_178.right>=this.left)&&(_178.right<=this.right);
_17e=(_178.bottom>=this.bottom)&&(_178.bottom<=this.top);
}else{
_17b=(_178.left>this.left)&&(_178.left<this.right);
_17c=(_178.top>this.bottom)&&(_178.top<this.top);
_17d=(_178.right>this.left)&&(_178.right<this.right);
_17e=(_178.bottom>this.bottom)&&(_178.bottom<this.top);
}
return (_179)?(_17c||_17e)&&(_17b||_17d):(_17c&&_17b&&_17e&&_17d);
},determineQuadrant:function(_17f){
var _180="";
var _181=this.getCenterLonLat();
_180+=(_17f.lat<_181.lat)?"b":"t";
_180+=(_17f.lon<_181.lon)?"l":"r";
return _180;
},wrapDateLine:function(_182,_183){
_183=_183||{};
var _184=_183.leftTolerance||0;
var _185=_183.rightTolerance||0;
var _186=this.clone();
if(_182){
while(_186.left<_182.left&&(_186.right-_185)<=_182.left){
_186=_186.add(_182.getWidth(),0);
}
while((_186.left+_184)>=_182.right&&_186.right>_182.right){
_186=_186.add(-_182.getWidth(),0);
}
}
return _186;
},CLASS_NAME:"OpenLayers.Bounds"});
OpenLayers.Bounds.fromString=function(str){
var _188=str.split(",");
return OpenLayers.Bounds.fromArray(_188);
};
OpenLayers.Bounds.fromArray=function(bbox){
return new OpenLayers.Bounds(parseFloat(bbox[0]),parseFloat(bbox[1]),parseFloat(bbox[2]),parseFloat(bbox[3]));
};
OpenLayers.Bounds.fromSize=function(size){
return new OpenLayers.Bounds(0,size.h,size.w,0);
};
OpenLayers.Bounds.oppositeQuadrant=function(_18b){
var opp="";
opp+=(_18b.charAt(0)=="t")?"b":"t";
opp+=(_18b.charAt(1)=="l")?"r":"l";
return opp;
};
OpenLayers.Element={visible:function(_18d){
return OpenLayers.Util.getElement(_18d).style.display!="none";
},toggle:function(){
for(var i=0;i<arguments.length;i++){
var _18f=OpenLayers.Util.getElement(arguments[i]);
var _190=OpenLayers.Element.visible(_18f)?"hide":"show";
OpenLayers.Element[_190](_18f);
}
},hide:function(){
for(var i=0;i<arguments.length;i++){
var _192=OpenLayers.Util.getElement(arguments[i]);
_192.style.display="none";
}
},show:function(){
for(var i=0;i<arguments.length;i++){
var _194=OpenLayers.Util.getElement(arguments[i]);
_194.style.display="";
}
},remove:function(_195){
_195=OpenLayers.Util.getElement(_195);
_195.parentNode.removeChild(_195);
},getHeight:function(_196){
_196=OpenLayers.Util.getElement(_196);
return _196.offsetHeight;
},getDimensions:function(_197){
_197=OpenLayers.Util.getElement(_197);
if(OpenLayers.Element.getStyle(_197,"display")!="none"){
return {width:_197.offsetWidth,height:_197.offsetHeight};
}
var els=_197.style;
var _199=els.visibility;
var _19a=els.position;
els.visibility="hidden";
els.position="absolute";
els.display="";
var _19b=_197.clientWidth;
var _19c=_197.clientHeight;
els.display="none";
els.position=_19a;
els.visibility=_199;
return {width:_19b,height:_19c};
},getStyle:function(_19d,_19e){
_19d=OpenLayers.Util.getElement(_19d);
var _19f=_19d.style[OpenLayers.String.camelize(_19e)];
if(!_19f){
if(document.defaultView&&document.defaultView.getComputedStyle){
var css=document.defaultView.getComputedStyle(_19d,null);
_19f=css?css.getPropertyValue(_19e):null;
}else{
if(_19d.currentStyle){
_19f=_19d.currentStyle[OpenLayers.String.camelize(_19e)];
}
}
}
var _1a1=["left","top","right","bottom"];
if(window.opera&&(OpenLayers.Util.indexOf(_1a1,_19e)!=-1)&&(OpenLayers.Element.getStyle(_19d,"position")=="static")){
_19f="auto";
}
return _19f=="auto"?null:_19f;
}};
OpenLayers.LonLat=OpenLayers.Class({lon:0,lat:0,initialize:function(lon,lat){
this.lon=parseFloat(lon);
this.lat=parseFloat(lat);
},toString:function(){
return ("lon="+this.lon+",lat="+this.lat);
},toShortString:function(){
return (this.lon+", "+this.lat);
},clone:function(){
return new OpenLayers.LonLat(this.lon,this.lat);
},add:function(lon,lat){
if((lon==null)||(lat==null)){
var msg="You must pass both lon and lat values "+"to the add function.";
OpenLayers.Console.error(msg);
return null;
}
return new OpenLayers.LonLat(this.lon+lon,this.lat+lat);
},equals:function(ll){
var _1a8=false;
if(ll!=null){
_1a8=((this.lon==ll.lon&&this.lat==ll.lat)||(isNaN(this.lon)&&isNaN(this.lat)&&isNaN(ll.lon)&&isNaN(ll.lat)));
}
return _1a8;
},wrapDateLine:function(_1a9){
var _1aa=this.clone();
if(_1a9){
while(_1aa.lon<_1a9.left){
_1aa.lon+=_1a9.getWidth();
}
while(_1aa.lon>_1a9.right){
_1aa.lon-=_1a9.getWidth();
}
}
return _1aa;
},CLASS_NAME:"OpenLayers.LonLat"});
OpenLayers.LonLat.fromString=function(str){
var pair=str.split(",");
return new OpenLayers.LonLat(parseFloat(pair[0]),parseFloat(pair[1]));
};
OpenLayers.Pixel=OpenLayers.Class({x:0,y:0,initialize:function(x,y){
this.x=parseFloat(x);
this.y=parseFloat(y);
},toString:function(){
return ("x="+this.x+",y="+this.y);
},clone:function(){
return new OpenLayers.Pixel(this.x,this.y);
},equals:function(px){
var _1b0=false;
if(px!=null){
_1b0=((this.x==px.x&&this.y==px.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(px.x)&&isNaN(px.y)));
}
return _1b0;
},add:function(x,y){
if((x==null)||(y==null)){
var msg="You must pass both x and y values to the add function.";
OpenLayers.Console.error(msg);
return null;
}
return new OpenLayers.Pixel(this.x+x,this.y+y);
},offset:function(px){
var _1b5=this.clone();
if(px){
_1b5=this.add(px.x,px.y);
}
return _1b5;
},CLASS_NAME:"OpenLayers.Pixel"});
OpenLayers.Size=OpenLayers.Class({w:0,h:0,initialize:function(w,h){
this.w=parseFloat(w);
this.h=parseFloat(h);
},toString:function(){
return ("w="+this.w+",h="+this.h);
},clone:function(){
return new OpenLayers.Size(this.w,this.h);
},equals:function(sz){
var _1b9=false;
if(sz!=null){
_1b9=((this.w==sz.w&&this.h==sz.h)||(isNaN(this.w)&&isNaN(this.h)&&isNaN(sz.w)&&isNaN(sz.h)));
}
return _1b9;
},CLASS_NAME:"OpenLayers.Size"});
OpenLayers.Console={log:function(){
},debug:function(){
},info:function(){
},warn:function(){
},error:function(){
},assert:function(){
},dir:function(){
},dirxml:function(){
},trace:function(){
},group:function(){
},groupEnd:function(){
},time:function(){
},timeEnd:function(){
},profile:function(){
},profileEnd:function(){
},count:function(){
},CLASS_NAME:"OpenLayers.Console"};
(function(){
if(window.console){
var _1ba=document.getElementsByTagName("script");
for(var i=0;i<_1ba.length;++i){
if(_1ba[i].src.indexOf("firebug.js")!=-1){
OpenLayers.Util.extend(OpenLayers.Console,console);
break;
}
}
}
})();
OpenLayers.Control=OpenLayers.Class({id:null,map:null,div:null,type:null,displayClass:"",active:null,handler:null,initialize:function(_1bc){
this.displayClass=this.CLASS_NAME.replace("OpenLayers.","ol").replace(/\./g,"");
OpenLayers.Util.extend(this,_1bc);
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},destroy:function(){
if(this.handler){
this.handler.destroy();
}
this.map=null;
},setMap:function(map){
this.map=map;
if(this.handler){
this.handler.setMap(map);
}
},draw:function(px){
if(this.div==null){
this.div=OpenLayers.Util.createDiv();
this.div.id=this.id;
this.div.className=this.displayClass;
}
if(px!=null){
this.position=px.clone();
}
this.moveTo(this.position);
return this.div;
},moveTo:function(px){
if((px!=null)&&(this.div!=null)){
this.div.style.left=px.x+"px";
this.div.style.top=px.y+"px";
}
},activate:function(){
if(this.active){
return false;
}
if(this.handler){
this.handler.activate();
}
this.active=true;
return true;
},deactivate:function(){
if(this.active){
if(this.handler){
this.handler.deactivate();
}
this.active=false;
return true;
}
return false;
},CLASS_NAME:"OpenLayers.Control"});
OpenLayers.Control.TYPE_BUTTON=1;
OpenLayers.Control.TYPE_TOGGLE=2;
OpenLayers.Control.TYPE_TOOL=3;
OpenLayers.Icon=OpenLayers.Class({url:null,size:null,offset:null,calculateOffset:null,imageDiv:null,px:null,initialize:function(url,size,_1c2,_1c3){
this.url=url;
this.size=(size)?size:new OpenLayers.Size(20,20);
this.offset=_1c2?_1c2:new OpenLayers.Pixel(-(this.size.w/2),-(this.size.h/2));
this.calculateOffset=_1c3;
var id=OpenLayers.Util.createUniqueID("OL_Icon_");
this.imageDiv=OpenLayers.Util.createAlphaImageDiv(id);
},destroy:function(){
OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
this.imageDiv.innerHTML="";
this.imageDiv=null;
},clone:function(){
return new OpenLayers.Icon(this.url,this.size,this.offset,this.calculateOffset);
},setSize:function(size){
if(size!=null){
this.size=size;
}
this.draw();
},draw:function(px){
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,this.size,this.url,"absolute");
this.moveTo(px);
return this.imageDiv;
},setOpacity:function(_1c7){
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,null,null,null,null,null,_1c7);
},moveTo:function(px){
if(px!=null){
this.px=px;
}
if(this.imageDiv!=null){
if(this.px==null){
this.display(false);
}else{
if(this.calculateOffset){
this.offset=this.calculateOffset(this.size);
}
var _1c9=this.px.offset(this.offset);
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,_1c9);
}
}
},display:function(_1ca){
this.imageDiv.style.display=(_1ca)?"":"none";
},CLASS_NAME:"OpenLayers.Icon"});
OpenLayers.Popup=OpenLayers.Class({events:null,id:"",lonlat:null,div:null,size:null,contentHTML:"",backgroundColor:"",opacity:"",border:"",contentDiv:null,groupDiv:null,padding:5,map:null,initialize:function(id,_1cc,size,_1ce,_1cf){
if(id==null){
id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
}
this.id=id;
this.lonlat=_1cc;
this.size=(size!=null)?size:new OpenLayers.Size(OpenLayers.Popup.WIDTH,OpenLayers.Popup.HEIGHT);
if(_1ce!=null){
this.contentHTML=_1ce;
}
this.backgroundColor=OpenLayers.Popup.COLOR;
this.opacity=OpenLayers.Popup.OPACITY;
this.border=OpenLayers.Popup.BORDER;
this.div=OpenLayers.Util.createDiv(this.id,null,null,null,null,null,"hidden");
this.div.className="olPopup";
this.groupDiv=OpenLayers.Util.createDiv(null,null,null,null,"relative",null,"hidden");
var id=this.div.id+"_contentDiv";
this.contentDiv=OpenLayers.Util.createDiv(id,null,this.size.clone(),null,"relative",null,"hidden");
this.contentDiv.className="olPopupContent";
this.groupDiv.appendChild(this.contentDiv);
this.div.appendChild(this.groupDiv);
if(_1cf){
var _1d0=new OpenLayers.Size(17,17);
var img=OpenLayers.Util.getImagesLocation()+"close.gif";
var _1d2=OpenLayers.Util.createAlphaImageDiv(this.id+"_close",null,_1d0,img);
_1d2.style.right=this.padding+"px";
_1d2.style.top=this.padding+"px";
this.groupDiv.appendChild(_1d2);
var _1d3=function(e){
this.hide();
OpenLayers.Event.stop(e);
};
OpenLayers.Event.observe(_1d2,"click",OpenLayers.Function.bindAsEventListener(_1d3,this));
}
this.registerEvents();
},destroy:function(){
if(this.map!=null){
this.map.removePopup(this);
this.map=null;
}
this.events.destroy();
this.events=null;
this.div=null;
},draw:function(px){
if(px==null){
if((this.lonlat!=null)&&(this.map!=null)){
px=this.map.getLayerPxFromLonLat(this.lonlat);
}
}
this.setSize();
this.setBackgroundColor();
this.setOpacity();
this.setBorder();
this.setContentHTML();
this.moveTo(px);
return this.div;
},updatePosition:function(){
if((this.lonlat)&&(this.map)){
var px=this.map.getLayerPxFromLonLat(this.lonlat);
if(px){
this.moveTo(px);
}
}
},moveTo:function(px){
if((px!=null)&&(this.div!=null)){
this.div.style.left=px.x+"px";
this.div.style.top=px.y+"px";
}
},visible:function(){
return OpenLayers.Element.visible(this.div);
},toggle:function(){
OpenLayers.Element.toggle(this.div);
},show:function(){
OpenLayers.Element.show(this.div);
},hide:function(){
OpenLayers.Element.hide(this.div);
},setSize:function(size){
if(size!=undefined){
this.size=size;
}
if(this.div!=null){
this.div.style.width=this.size.w+"px";
this.div.style.height=this.size.h+"px";
}
if(this.contentDiv!=null){
this.contentDiv.style.width=this.size.w+"px";
this.contentDiv.style.height=this.size.h+"px";
}
},setBackgroundColor:function(_1d9){
if(_1d9!=undefined){
this.backgroundColor=_1d9;
}
if(this.div!=null){
this.div.style.backgroundColor=this.backgroundColor;
}
},setOpacity:function(_1da){
if(_1da!=undefined){
this.opacity=_1da;
}
if(this.div!=null){
this.div.style.opacity=this.opacity;
this.div.style.filter="alpha(opacity="+this.opacity*100+")";
}
},setBorder:function(_1db){
if(_1db!=undefined){
this.border=_1db;
}
if(this.div!=null){
this.div.style.border=this.border;
}
},setContentHTML:function(_1dc){
if(_1dc!=null){
this.contentHTML=_1dc;
}
if(this.contentDiv!=null){
this.contentDiv.innerHTML=this.contentHTML;
}
},registerEvents:function(){
this.events=new OpenLayers.Events(this,this.div,null,true);
this.events.register("mousedown",this,this.onmousedown);
this.events.register("mousemove",this,this.onmousemove);
this.events.register("mouseup",this,this.onmouseup);
this.events.register("click",this,this.onclick);
this.events.register("mouseout",this,this.onmouseout);
this.events.register("dblclick",this,this.ondblclick);
},onmousedown:function(evt){
this.mousedown=true;
OpenLayers.Event.stop(evt,true);
},onmousemove:function(evt){
if(this.mousedown){
OpenLayers.Event.stop(evt,true);
}
},onmouseup:function(evt){
if(this.mousedown){
this.mousedown=false;
OpenLayers.Event.stop(evt,true);
}
},onclick:function(evt){
OpenLayers.Event.stop(evt,true);
},onmouseout:function(evt){
this.mousedown=false;
},ondblclick:function(evt){
OpenLayers.Event.stop(evt,true);
},CLASS_NAME:"OpenLayers.Popup"});
OpenLayers.Popup.WIDTH=200;
OpenLayers.Popup.HEIGHT=200;
OpenLayers.Popup.COLOR="white";
OpenLayers.Popup.OPACITY=1;
OpenLayers.Popup.BORDER="0px";
OpenLayers.Renderer=OpenLayers.Class({container:null,extent:null,size:null,resolution:null,map:null,initialize:function(_1e3){
this.container=OpenLayers.Util.getElement(_1e3);
},destroy:function(){
this.container=null;
this.extent=null;
this.size=null;
this.resolution=null;
this.map=null;
},supported:function(){
return false;
},setExtent:function(_1e4){
this.extent=_1e4.clone();
this.resolution=null;
},setSize:function(size){
this.size=size.clone();
this.resolution=null;
},getResolution:function(){
this.resolution=this.resolution||this.map.getResolution();
return this.resolution;
},drawFeature:function(_1e6,_1e7){
if(_1e7==null){
_1e7=_1e6.style;
}
this.drawGeometry(_1e6.geometry,_1e7,_1e6.id);
},drawGeometry:function(_1e8,_1e9,_1ea){
},clear:function(){
},getFeatureIdFromEvent:function(evt){
},eraseFeatures:function(_1ec){
if(!(_1ec instanceof Array)){
_1ec=[_1ec];
}
for(var i=0;i<_1ec.length;++i){
this.eraseGeometry(_1ec[i].geometry);
}
},eraseGeometry:function(_1ee){
},CLASS_NAME:"OpenLayers.Renderer"});
OpenLayers.Rico.Color=OpenLayers.Class({initialize:function(red,_1f0,blue){
this.rgb={r:red,g:_1f0,b:blue};
},setRed:function(r){
this.rgb.r=r;
},setGreen:function(g){
this.rgb.g=g;
},setBlue:function(b){
this.rgb.b=b;
},setHue:function(h){
var hsb=this.asHSB();
hsb.h=h;
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,hsb.b);
},setSaturation:function(s){
var hsb=this.asHSB();
hsb.s=s;
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,hsb.b);
},setBrightness:function(b){
var hsb=this.asHSB();
hsb.b=b;
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,hsb.b);
},darken:function(_1fb){
var hsb=this.asHSB();
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,Math.max(hsb.b-_1fb,0));
},brighten:function(_1fd){
var hsb=this.asHSB();
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,Math.min(hsb.b+_1fd,1));
},blend:function(_1ff){
this.rgb.r=Math.floor((this.rgb.r+_1ff.rgb.r)/2);
this.rgb.g=Math.floor((this.rgb.g+_1ff.rgb.g)/2);
this.rgb.b=Math.floor((this.rgb.b+_1ff.rgb.b)/2);
},isBright:function(){
var hsb=this.asHSB();
return this.asHSB().b>0.5;
},isDark:function(){
return !this.isBright();
},asRGB:function(){
return "rgb("+this.rgb.r+","+this.rgb.g+","+this.rgb.b+")";
},asHex:function(){
return "#"+this.rgb.r.toColorPart()+this.rgb.g.toColorPart()+this.rgb.b.toColorPart();
},asHSB:function(){
return OpenLayers.Rico.Color.RGBtoHSB(this.rgb.r,this.rgb.g,this.rgb.b);
},toString:function(){
return this.asHex();
}});
OpenLayers.Rico.Color.createFromHex=function(_201){
if(_201.length==4){
var _202=_201;
var _201="#";
for(var i=1;i<4;i++){
_201+=(_202.charAt(i)+_202.charAt(i));
}
}
if(_201.indexOf("#")==0){
_201=_201.substring(1);
}
var red=_201.substring(0,2);
var _205=_201.substring(2,4);
var blue=_201.substring(4,6);
return new OpenLayers.Rico.Color(parseInt(red,16),parseInt(_205,16),parseInt(blue,16));
};
OpenLayers.Rico.Color.createColorFromBackground=function(elem){
var _208=RicoUtil.getElementsComputedStyle(OpenLayers.Util.getElement(elem),"backgroundColor","background-color");
if(_208=="transparent"&&elem.parentNode){
return OpenLayers.Rico.Color.createColorFromBackground(elem.parentNode);
}
if(_208==null){
return new OpenLayers.Rico.Color(255,255,255);
}
if(_208.indexOf("rgb(")==0){
var _209=_208.substring(4,_208.length-1);
var _20a=_209.split(",");
return new OpenLayers.Rico.Color(parseInt(_20a[0]),parseInt(_20a[1]),parseInt(_20a[2]));
}else{
if(_208.indexOf("#")==0){
return OpenLayers.Rico.Color.createFromHex(_208);
}else{
return new OpenLayers.Rico.Color(255,255,255);
}
}
};
OpenLayers.Rico.Color.HSBtoRGB=function(hue,_20c,_20d){
var red=0;
var _20f=0;
var blue=0;
if(_20c==0){
red=parseInt(_20d*255+0.5);
_20f=red;
blue=red;
}else{
var h=(hue-Math.floor(hue))*6;
var f=h-Math.floor(h);
var p=_20d*(1-_20c);
var q=_20d*(1-_20c*f);
var t=_20d*(1-(_20c*(1-f)));
switch(parseInt(h)){
case 0:
red=(_20d*255+0.5);
_20f=(t*255+0.5);
blue=(p*255+0.5);
break;
case 1:
red=(q*255+0.5);
_20f=(_20d*255+0.5);
blue=(p*255+0.5);
break;
case 2:
red=(p*255+0.5);
_20f=(_20d*255+0.5);
blue=(t*255+0.5);
break;
case 3:
red=(p*255+0.5);
_20f=(q*255+0.5);
blue=(_20d*255+0.5);
break;
case 4:
red=(t*255+0.5);
_20f=(p*255+0.5);
blue=(_20d*255+0.5);
break;
case 5:
red=(_20d*255+0.5);
_20f=(p*255+0.5);
blue=(q*255+0.5);
break;
}
}
return {r:parseInt(red),g:parseInt(_20f),b:parseInt(blue)};
};
OpenLayers.Rico.Color.RGBtoHSB=function(r,g,b){
var hue;
var _21a;
var _21b;
var cmax=(r>g)?r:g;
if(b>cmax){
cmax=b;
}
var cmin=(r<g)?r:g;
if(b<cmin){
cmin=b;
}
_21b=cmax/255;
if(cmax!=0){
_21a=(cmax-cmin)/cmax;
}else{
_21a=0;
}
if(_21a==0){
hue=0;
}else{
var redc=(cmax-r)/(cmax-cmin);
var _21f=(cmax-g)/(cmax-cmin);
var _220=(cmax-b)/(cmax-cmin);
if(r==cmax){
hue=_220-_21f;
}else{
if(g==cmax){
hue=2+redc-_220;
}else{
hue=4+_21f-redc;
}
}
hue=hue/6;
if(hue<0){
hue=hue+1;
}
}
return {h:hue,s:_21a,b:_21b};
};
OpenLayers.Control.ArgParser=OpenLayers.Class(OpenLayers.Control,{center:null,zoom:null,layers:null,initialize:function(_221){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},setMap:function(map){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
for(var i=0;i<this.map.controls.length;i++){
var _224=this.map.controls[i];
if((_224!=this)&&(_224.CLASS_NAME=="OpenLayers.Control.ArgParser")){
break;
}
}
if(i==this.map.controls.length){
var args=OpenLayers.Util.getParameters();
if(args.lat&&args.lon){
this.center=new OpenLayers.LonLat(parseFloat(args.lon),parseFloat(args.lat));
if(args.zoom){
this.zoom=parseInt(args.zoom);
}
this.map.events.register("changebaselayer",this,this.setCenter);
this.setCenter();
}
if(args.layers){
this.layers=args.layers;
this.map.events.register("addlayer",this,this.configureLayers);
this.configureLayers();
}
}
},setCenter:function(){
if(this.map.baseLayer){
this.map.events.unregister("changebaselayer",this,this.setCenter);
this.map.setCenter(this.center,this.zoom);
}
},configureLayers:function(){
if(this.layers.length==this.map.layers.length){
this.map.events.unregister("addlayer",this,this.configureLayers);
for(var i=0;i<this.layers.length;i++){
var _227=this.map.layers[i];
var c=this.layers.charAt(i);
if(c=="B"){
this.map.setBaseLayer(_227);
}else{
if((c=="T")||(c=="F")){
_227.setVisibility(c=="T");
}
}
}
}
},CLASS_NAME:"OpenLayers.Control.ArgParser"});
OpenLayers.Control.Attribution=OpenLayers.Class(OpenLayers.Control,{separator:", ",initialize:function(_229){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},destroy:function(){
this.map.events.unregister("removelayer",this,this.updateAttribution);
this.map.events.unregister("addlayer",this,this.updateAttribution);
this.map.events.unregister("changelayer",this,this.updateAttribution);
this.map.events.unregister("changebaselayer",this,this.updateAttribution);
OpenLayers.Control.prototype.destroy.apply(this,arguments);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
this.map.events.register("changebaselayer",this,this.updateAttribution);
this.map.events.register("changelayer",this,this.updateAttribution);
this.map.events.register("addlayer",this,this.updateAttribution);
this.map.events.register("removelayer",this,this.updateAttribution);
this.updateAttribution();
return this.div;
},updateAttribution:function(){
var _22a=[];
if(this.map&&this.map.layers){
for(var i=0;i<this.map.layers.length;i++){
var _22c=this.map.layers[i];
if(_22c.attribution&&_22c.getVisibility()){
_22a.push(_22c.attribution);
}
}
this.div.innerHTML=_22a.join(this.separator);
}
},CLASS_NAME:"OpenLayers.Control.Attribution"});
OpenLayers.Control.LayerSwitcher=OpenLayers.Class(OpenLayers.Control,{activeColor:"darkblue",layerStates:null,layersDiv:null,baseLayersDiv:null,baseLayers:null,dataLbl:null,dataLayersDiv:null,dataLayers:null,minimizeDiv:null,maximizeDiv:null,ascending:true,initialize:function(_22d){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.layerStates=[];
},destroy:function(){
OpenLayers.Event.stopObservingElement(this.div);
OpenLayers.Event.stopObservingElement(this.minimizeDiv);
OpenLayers.Event.stopObservingElement(this.maximizeDiv);
this.clearLayersArray("base");
this.clearLayersArray("data");
this.map.events.unregister("addlayer",this,this.redraw);
this.map.events.unregister("changelayer",this,this.redraw);
this.map.events.unregister("removelayer",this,this.redraw);
this.map.events.unregister("changebaselayer",this,this.redraw);
OpenLayers.Control.prototype.destroy.apply(this,arguments);
},setMap:function(map){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
this.map.events.register("addlayer",this,this.redraw);
this.map.events.register("changelayer",this,this.redraw);
this.map.events.register("removelayer",this,this.redraw);
this.map.events.register("changebaselayer",this,this.redraw);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this);
this.loadContents();
if(!this.outsideViewport){
this.minimizeControl();
}
this.redraw();
return this.div;
},clearLayersArray:function(_22f){
var _230=this[_22f+"Layers"];
if(_230){
for(var i=0;i<_230.length;i++){
var _232=_230[i];
OpenLayers.Event.stopObservingElement(_232.inputElem);
OpenLayers.Event.stopObservingElement(_232.labelSpan);
}
}
this[_22f+"LayersDiv"].innerHTML="";
this[_22f+"Layers"]=[];
},checkRedraw:function(){
var _233=false;
if(!this.layerStates.length||(this.map.layers.length!=this.layerStates.length)){
_233=true;
}else{
for(var i=0;i<this.layerStates.length;i++){
var _235=this.layerStates[i];
var _236=this.map.layers[i];
if((_235.name!=_236.name)||(_235.inRange!=_236.inRange)||(_235.id!=_236.id)||(_235.visibility!=_236.visibility)){
_233=true;
break;
}
}
}
return _233;
},redraw:function(){
if(!this.checkRedraw()){
return this.div;
}
this.clearLayersArray("base");
this.clearLayersArray("data");
var _237=false;
var _238=false;
this.layerStates=new Array(this.map.layers.length);
for(var i=0;i<this.map.layers.length;i++){
var _23a=this.map.layers[i];
this.layerStates[i]={"name":_23a.name,"visibility":_23a.visibility,"inRange":_23a.inRange,"id":_23a.id};
}
var _23b=this.map.layers.slice();
if(!this.ascending){
_23b.reverse();
}
for(var i=0;i<_23b.length;i++){
var _23a=_23b[i];
var _23c=_23a.isBaseLayer;
if(_23a.displayInLayerSwitcher){
if(_23c){
_238=true;
}else{
_237=true;
}
var _23d=(_23c)?(_23a==this.map.baseLayer):_23a.getVisibility();
var _23e=document.createElement("input");
_23e.id="input_"+_23a.name;
_23e.name=(_23c)?"baseLayers":_23a.name;
_23e.type=(_23c)?"radio":"checkbox";
_23e.value=_23a.name;
_23e.checked=_23d;
_23e.defaultChecked=_23d;
if(!_23c&&!_23a.inRange){
_23e.disabled=true;
}
var _23f={"inputElem":_23e,"layer":_23a,"layerSwitcher":this};
OpenLayers.Event.observe(_23e,"mouseup",OpenLayers.Function.bindAsEventListener(this.onInputClick,_23f));
var _240=document.createElement("span");
if(!_23c&&!_23a.inRange){
_240.style.color="gray";
}
_240.innerHTML=_23a.name;
_240.style.verticalAlign=(_23c)?"bottom":"baseline";
OpenLayers.Event.observe(_240,"click",OpenLayers.Function.bindAsEventListener(this.onInputClick,_23f));
var br=document.createElement("br");
var _242=(_23c)?this.baseLayers:this.dataLayers;
_242.push({"layer":_23a,"inputElem":_23e,"labelSpan":_240});
var _243=(_23c)?this.baseLayersDiv:this.dataLayersDiv;
_243.appendChild(_23e);
_243.appendChild(_240);
_243.appendChild(br);
}
}
this.dataLbl.style.display=(_237)?"":"none";
this.baseLbl.style.display=(_238)?"":"none";
return this.div;
},onInputClick:function(e){
if(!this.inputElem.disabled){
if(this.inputElem.type=="radio"){
this.inputElem.checked=true;
this.layer.map.setBaseLayer(this.layer);
}else{
this.inputElem.checked=!this.inputElem.checked;
this.layerSwitcher.updateMap();
}
}
OpenLayers.Event.stop(e);
},onLayerClick:function(e){
this.updateMap();
},updateMap:function(){
for(var i=0;i<this.baseLayers.length;i++){
var _247=this.baseLayers[i];
if(_247.inputElem.checked){
this.map.setBaseLayer(_247.layer,false);
}
}
for(var i=0;i<this.dataLayers.length;i++){
var _247=this.dataLayers[i];
_247.layer.setVisibility(_247.inputElem.checked);
}
},maximizeControl:function(e){
this.div.style.width="20em";
this.div.style.height="";
this.showControls(false);
if(e!=null){
OpenLayers.Event.stop(e);
}
},minimizeControl:function(e){
this.div.style.width="0px";
this.div.style.height="0px";
this.showControls(true);
if(e!=null){
OpenLayers.Event.stop(e);
}
},showControls:function(_24a){
this.maximizeDiv.style.display=_24a?"":"none";
this.minimizeDiv.style.display=_24a?"none":"";
this.layersDiv.style.display=_24a?"none":"";
},loadContents:function(){
this.div.style.position="absolute";
this.div.style.top="25px";
this.div.style.right="0px";
this.div.style.left="";
this.div.style.fontFamily="sans-serif";
this.div.style.fontWeight="bold";
this.div.style.marginTop="3px";
this.div.style.marginLeft="3px";
this.div.style.marginBottom="3px";
this.div.style.fontSize="smaller";
this.div.style.color="white";
this.div.style.backgroundColor="transparent";
OpenLayers.Event.observe(this.div,"mouseup",OpenLayers.Function.bindAsEventListener(this.mouseUp,this));
OpenLayers.Event.observe(this.div,"click",this.ignoreEvent);
OpenLayers.Event.observe(this.div,"mousedown",OpenLayers.Function.bindAsEventListener(this.mouseDown,this));
OpenLayers.Event.observe(this.div,"dblclick",this.ignoreEvent);
this.layersDiv=document.createElement("div");
this.layersDiv.id="layersDiv";
this.layersDiv.style.paddingTop="5px";
this.layersDiv.style.paddingLeft="10px";
this.layersDiv.style.paddingBottom="5px";
this.layersDiv.style.paddingRight="75px";
this.layersDiv.style.backgroundColor=this.activeColor;
this.layersDiv.style.width="100%";
this.layersDiv.style.height="100%";
this.baseLbl=document.createElement("div");
this.baseLbl.innerHTML="<u>Base Layer</u>";
this.baseLbl.style.marginTop="3px";
this.baseLbl.style.marginLeft="3px";
this.baseLbl.style.marginBottom="3px";
this.baseLayersDiv=document.createElement("div");
this.baseLayersDiv.style.paddingLeft="10px";
this.dataLbl=document.createElement("div");
this.dataLbl.innerHTML="<u>Overlays</u>";
this.dataLbl.style.marginTop="3px";
this.dataLbl.style.marginLeft="3px";
this.dataLbl.style.marginBottom="3px";
this.dataLayersDiv=document.createElement("div");
this.dataLayersDiv.style.paddingLeft="10px";
if(this.ascending){
this.layersDiv.appendChild(this.baseLbl);
this.layersDiv.appendChild(this.baseLayersDiv);
this.layersDiv.appendChild(this.dataLbl);
this.layersDiv.appendChild(this.dataLayersDiv);
}else{
this.layersDiv.appendChild(this.dataLbl);
this.layersDiv.appendChild(this.dataLayersDiv);
this.layersDiv.appendChild(this.baseLbl);
this.layersDiv.appendChild(this.baseLayersDiv);
}
this.div.appendChild(this.layersDiv);
OpenLayers.Rico.Corner.round(this.div,{corners:"tl bl",bgColor:"transparent",color:this.activeColor,blend:false});
OpenLayers.Rico.Corner.changeOpacity(this.layersDiv,0.75);
var _24b=OpenLayers.Util.getImagesLocation();
var sz=new OpenLayers.Size(18,18);
var img=_24b+"layer-switcher-maximize.png";
this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MaximizeDiv",null,sz,img,"absolute");
this.maximizeDiv.style.top="5px";
this.maximizeDiv.style.right="0px";
this.maximizeDiv.style.left="";
this.maximizeDiv.style.display="none";
OpenLayers.Event.observe(this.maximizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.maximizeControl,this));
this.div.appendChild(this.maximizeDiv);
var img=_24b+"layer-switcher-minimize.png";
var sz=new OpenLayers.Size(18,18);
this.minimizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MinimizeDiv",null,sz,img,"absolute");
this.minimizeDiv.style.top="5px";
this.minimizeDiv.style.right="0px";
this.minimizeDiv.style.left="";
this.minimizeDiv.style.display="none";
OpenLayers.Event.observe(this.minimizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.minimizeControl,this));
this.div.appendChild(this.minimizeDiv);
},ignoreEvent:function(evt){
OpenLayers.Event.stop(evt);
},mouseDown:function(evt){
this.isMouseDown=true;
this.ignoreEvent(evt);
},mouseUp:function(evt){
if(this.isMouseDown){
this.isMouseDown=false;
this.ignoreEvent(evt);
}
},CLASS_NAME:"OpenLayers.Control.LayerSwitcher"});
OpenLayers.Control.MouseDefaults=OpenLayers.Class(OpenLayers.Control,{performedDrag:false,wheelObserver:null,initialize:function(){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},destroy:function(){
if(this.handler){
this.handler.destroy();
}
this.handler=null;
this.map.events.unregister("click",this,this.defaultClick);
this.map.events.unregister("dblclick",this,this.defaultDblClick);
this.map.events.unregister("mousedown",this,this.defaultMouseDown);
this.map.events.unregister("mouseup",this,this.defaultMouseUp);
this.map.events.unregister("mousemove",this,this.defaultMouseMove);
this.map.events.unregister("mouseout",this,this.defaultMouseOut);
OpenLayers.Event.stopObserving(window,"DOMMouseScroll",this.wheelObserver);
OpenLayers.Event.stopObserving(window,"mousewheel",this.wheelObserver);
OpenLayers.Event.stopObserving(document,"mousewheel",this.wheelObserver);
this.wheelObserver=null;
OpenLayers.Control.prototype.destroy.apply(this,arguments);
},draw:function(){
this.map.events.register("click",this,this.defaultClick);
this.map.events.register("dblclick",this,this.defaultDblClick);
this.map.events.register("mousedown",this,this.defaultMouseDown);
this.map.events.register("mouseup",this,this.defaultMouseUp);
this.map.events.register("mousemove",this,this.defaultMouseMove);
this.map.events.register("mouseout",this,this.defaultMouseOut);
this.registerWheelEvents();
},registerWheelEvents:function(){
this.wheelObserver=OpenLayers.Function.bindAsEventListener(this.onWheelEvent,this);
OpenLayers.Event.observe(window,"DOMMouseScroll",this.wheelObserver);
OpenLayers.Event.observe(window,"mousewheel",this.wheelObserver);
OpenLayers.Event.observe(document,"mousewheel",this.wheelObserver);
},defaultClick:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
var _252=!this.performedDrag;
this.performedDrag=false;
return _252;
},defaultDblClick:function(evt){
var _254=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_254,this.map.zoom+1);
OpenLayers.Event.stop(evt);
return false;
},defaultMouseDown:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
this.mouseDragStart=evt.xy.clone();
this.performedDrag=false;
if(evt.shiftKey){
this.map.div.style.cursor="crosshair";
this.zoomBox=OpenLayers.Util.createDiv("zoomBox",this.mouseDragStart,null,null,"absolute","2px solid red");
this.zoomBox.style.backgroundColor="white";
this.zoomBox.style.filter="alpha(opacity=50)";
this.zoomBox.style.opacity="0.50";
this.zoomBox.style.fontSize="1px";
this.zoomBox.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
this.map.viewPortDiv.appendChild(this.zoomBox);
}
document.onselectstart=function(){
return false;
};
OpenLayers.Event.stop(evt);
},defaultMouseMove:function(evt){
this.mousePosition=evt.xy.clone();
if(this.mouseDragStart!=null){
if(this.zoomBox){
var _257=Math.abs(this.mouseDragStart.x-evt.xy.x);
var _258=Math.abs(this.mouseDragStart.y-evt.xy.y);
this.zoomBox.style.width=Math.max(1,_257)+"px";
this.zoomBox.style.height=Math.max(1,_258)+"px";
if(evt.xy.x<this.mouseDragStart.x){
this.zoomBox.style.left=evt.xy.x+"px";
}
if(evt.xy.y<this.mouseDragStart.y){
this.zoomBox.style.top=evt.xy.y+"px";
}
}else{
var _257=this.mouseDragStart.x-evt.xy.x;
var _258=this.mouseDragStart.y-evt.xy.y;
var size=this.map.getSize();
var _25a=new OpenLayers.Pixel(size.w/2+_257,size.h/2+_258);
var _25b=this.map.getLonLatFromViewPortPx(_25a);
this.map.setCenter(_25b,null,true);
this.mouseDragStart=evt.xy.clone();
this.map.div.style.cursor="move";
}
this.performedDrag=true;
}
},defaultMouseUp:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
if(this.zoomBox){
this.zoomBoxEnd(evt);
}else{
if(this.performedDrag){
this.map.setCenter(this.map.center);
}
}
document.onselectstart=null;
this.mouseDragStart=null;
this.map.div.style.cursor="";
},defaultMouseOut:function(evt){
if(this.mouseDragStart!=null&&OpenLayers.Util.mouseLeft(evt,this.map.div)){
if(this.zoomBox){
this.removeZoomBox();
}
this.mouseDragStart=null;
}
},defaultWheelUp:function(evt){
if(this.map.getZoom()<=this.map.getNumZoomLevels()){
this.map.setCenter(this.map.getLonLatFromPixel(evt.xy),this.map.getZoom()+1);
}
},defaultWheelDown:function(evt){
if(this.map.getZoom()>0){
this.map.setCenter(this.map.getLonLatFromPixel(evt.xy),this.map.getZoom()-1);
}
},zoomBoxEnd:function(evt){
if(this.mouseDragStart!=null){
if(Math.abs(this.mouseDragStart.x-evt.xy.x)>5||Math.abs(this.mouseDragStart.y-evt.xy.y)>5){
var _261=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
var end=this.map.getLonLatFromViewPortPx(evt.xy);
var top=Math.max(_261.lat,end.lat);
var _264=Math.min(_261.lat,end.lat);
var left=Math.min(_261.lon,end.lon);
var _266=Math.max(_261.lon,end.lon);
var _267=new OpenLayers.Bounds(left,_264,_266,top);
this.map.zoomToExtent(_267);
}else{
var end=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(new OpenLayers.LonLat((end.lon),(end.lat)),this.map.getZoom()+1);
}
this.removeZoomBox();
}
},removeZoomBox:function(){
this.map.viewPortDiv.removeChild(this.zoomBox);
this.zoomBox=null;
},onWheelEvent:function(e){
var _269=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_269=true;
break;
}
elem=elem.parentNode;
}
if(_269){
var _26b=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_26b=e.wheelDelta/120;
if(window.opera){
_26b=-_26b;
}
}else{
if(e.detail){
_26b=-e.detail/3;
}
}
if(_26b){
e.xy=this.mousePosition;
if(_26b<0){
this.defaultWheelDown(e);
}else{
this.defaultWheelUp(e);
}
}
OpenLayers.Event.stop(e);
}
},CLASS_NAME:"OpenLayers.Control.MouseDefaults"});
OpenLayers.Control.MousePosition=OpenLayers.Class(OpenLayers.Control,{element:null,prefix:"",separator:", ",suffix:"",numdigits:5,granularity:10,lastXy:null,initialize:function(_26c){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},destroy:function(){
if(this.map){
this.map.events.unregister("mousemove",this,this.redraw);
}
OpenLayers.Control.prototype.destroy.apply(this,arguments);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
if(!this.element){
this.div.left="";
this.div.top="";
this.div.className=this.displayClass;
this.element=this.div;
}
this.redraw();
return this.div;
},redraw:function(evt){
var _26e;
if(evt==null){
_26e=new OpenLayers.LonLat(0,0);
}else{
if(this.lastXy==null||Math.abs(evt.xy.x-this.lastXy.x)>this.granularity||Math.abs(evt.xy.y-this.lastXy.y)>this.granularity){
this.lastXy=evt.xy;
return;
}
_26e=this.map.getLonLatFromPixel(evt.xy);
this.lastXy=evt.xy;
}
var _26f=parseInt(this.numdigits);
var _270=this.prefix+_26e.lon.toFixed(_26f)+this.separator+_26e.lat.toFixed(_26f)+this.suffix;
if(_270!=this.element.innerHTML){
this.element.innerHTML=_270;
}
},setMap:function(){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
this.map.events.register("mousemove",this,this.redraw);
},CLASS_NAME:"OpenLayers.Control.MousePosition"});
OpenLayers.Control.PanZoom=OpenLayers.Class(OpenLayers.Control,{slideFactor:50,buttons:null,position:null,initialize:function(_271){
this.position=new OpenLayers.Pixel(OpenLayers.Control.PanZoom.X,OpenLayers.Control.PanZoom.Y);
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Control.prototype.destroy.apply(this,arguments);
while(this.buttons.length){
var btn=this.buttons.shift();
btn.map=null;
OpenLayers.Event.stopObservingElement(btn);
}
this.buttons=null;
this.position=null;
},draw:function(px){
OpenLayers.Control.prototype.draw.apply(this,arguments);
px=this.position;
this.buttons=[];
var sz=new OpenLayers.Size(18,18);
var _275=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
this._addButton("panup","north-mini.png",_275,sz);
px.y=_275.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
this._addButton("panright","east-mini.png",px.add(sz.w,0),sz);
this._addButton("pandown","south-mini.png",_275.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_275.add(0,sz.h*3+5),sz);
this._addButton("zoomworld","zoom-world-mini.png",_275.add(0,sz.h*4+5),sz);
this._addButton("zoomout","zoom-minus-mini.png",_275.add(0,sz.h*5+5),sz);
return this.div;
},_addButton:function(id,img,xy,sz){
var _27a=OpenLayers.Util.getImagesLocation()+img;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_PanZoom_"+id,xy,sz,_27a,"absolute");
this.div.appendChild(btn);
OpenLayers.Event.observe(btn,"mousedown",OpenLayers.Function.bindAsEventListener(this.buttonDown,btn));
OpenLayers.Event.observe(btn,"dblclick",OpenLayers.Function.bindAsEventListener(this.doubleClick,btn));
OpenLayers.Event.observe(btn,"click",OpenLayers.Function.bindAsEventListener(this.doubleClick,btn));
btn.action=id;
btn.map=this.map;
btn.slideFactor=this.slideFactor;
this.buttons.push(btn);
return btn;
},doubleClick:function(evt){
OpenLayers.Event.stop(evt);
return false;
},buttonDown:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
switch(this.action){
case "panup":
this.map.pan(0,-50);
break;
case "pandown":
this.map.pan(0,50);
break;
case "panleft":
this.map.pan(-50,0);
break;
case "panright":
this.map.pan(50,0);
break;
case "zoomin":
this.map.zoomIn();
break;
case "zoomout":
this.map.zoomOut();
break;
case "zoomworld":
this.map.zoomToMaxExtent();
break;
}
OpenLayers.Event.stop(evt);
},CLASS_NAME:"OpenLayers.Control.PanZoom"});
OpenLayers.Control.PanZoom.X=4;
OpenLayers.Control.PanZoom.Y=4;
OpenLayers.Control.Panel=OpenLayers.Class(OpenLayers.Control,{controls:null,defaultControl:null,initialize:function(_27e){
OpenLayers.Control.prototype.initialize.apply(this,[_27e]);
this.controls=[];
},destroy:function(){
OpenLayers.Control.prototype.destroy.apply(this,arguments);
for(var i=this.controls.length-1;i>=0;i--){
OpenLayers.Event.stopObservingElement(this.controls[i].panel_div);
this.controls[i].panel_div=null;
}
},activate:function(){
if(OpenLayers.Control.prototype.activate.apply(this,arguments)){
for(var i=0;i<this.controls.length;i++){
if(this.controls[i]==this.defaultControl){
this.controls[i].activate();
}
}
this.redraw();
return true;
}else{
return false;
}
},deactivate:function(){
if(OpenLayers.Control.prototype.deactivate.apply(this,arguments)){
for(var i=0;i<this.controls.length;i++){
this.controls[i].deactivate();
}
this.redraw();
return true;
}else{
return false;
}
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
for(var i=0;i<this.controls.length;i++){
this.map.addControl(this.controls[i]);
this.controls[i].deactivate();
}
this.activate();
return this.div;
},redraw:function(){
this.div.innerHTML="";
if(this.active){
for(var i=0;i<this.controls.length;i++){
var _284=this.controls[i].panel_div;
if(this.controls[i].active){
_284.className=this.controls[i].displayClass+"ItemActive";
}else{
_284.className=this.controls[i].displayClass+"ItemInactive";
}
this.div.appendChild(_284);
}
}
},activateControl:function(_285){
if(!this.active){
return false;
}
if(_285.type==OpenLayers.Control.TYPE_BUTTON){
_285.trigger();
return;
}
if(_285.type==OpenLayers.Control.TYPE_TOGGLE){
if(_285.active){
_285.deactivate();
}else{
_285.activate();
}
return;
}
for(var i=0;i<this.controls.length;i++){
if(this.controls[i]==_285){
_285.activate();
}else{
if(this.controls[i].type!=OpenLayers.Control.TYPE_TOGGLE){
this.controls[i].deactivate();
}
}
}
this.redraw();
},addControls:function(_287){
if(!(_287 instanceof Array)){
_287=[_287];
}
this.controls=this.controls.concat(_287);
for(var i=0;i<_287.length;i++){
var _289=document.createElement("div");
var _28a=document.createTextNode(" ");
_287[i].panel_div=_289;
OpenLayers.Event.observe(_287[i].panel_div,"click",OpenLayers.Function.bind(this.onClick,this,_287[i]));
OpenLayers.Event.observe(_287[i].panel_div,"mousedown",OpenLayers.Function.bindAsEventListener(OpenLayers.Event.stop));
}
if(this.map){
for(var i=0;i<_287.length;i++){
this.map.addControl(_287[i]);
_287[i].deactivate();
}
this.redraw();
}
},onClick:function(ctrl,evt){
OpenLayers.Event.stop(evt?evt:window.event);
this.activateControl(ctrl);
},CLASS_NAME:"OpenLayers.Control.Panel"});
OpenLayers.Control.Permalink=OpenLayers.Class(OpenLayers.Control,{element:null,base:"",initialize:function(_28d,base,_28f){
OpenLayers.Control.prototype.initialize.apply(this,[_28f]);
this.element=OpenLayers.Util.getElement(_28d);
this.base=base||document.location.href;
},destroy:function(){
if(this.element.parentNode==this.div){
this.div.removeChild(this.element);
}
this.element=null;
this.map.events.unregister("moveend",this,this.updateLink);
OpenLayers.Control.prototype.destroy.apply(this,arguments);
},setMap:function(map){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
for(var i=0;i<this.map.controls.length;i++){
var _292=this.map.controls[i];
if(_292.CLASS_NAME=="OpenLayers.Control.ArgParser"){
break;
}
}
if(i==this.map.controls.length){
this.map.addControl(new OpenLayers.Control.ArgParser());
}
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
if(!this.element){
this.div.className=this.displayClass;
this.element=document.createElement("a");
this.element.style.fontSize="smaller";
this.element.innerHTML="Permalink";
this.element.href="";
this.div.appendChild(this.element);
}
this.map.events.register("moveend",this,this.updateLink);
this.map.events.register("changelayer",this,this.updateLink);
this.map.events.register("changebaselayer",this,this.updateLink);
return this.div;
},updateLink:function(){
var _293=this.map.getCenter();
if(!_293){
return;
}
var _294=OpenLayers.Util.getParameters(this.base);
_294.zoom=this.map.getZoom();
_294.lat=Math.round(_293.lat*100000)/100000;
_294.lon=Math.round(_293.lon*100000)/100000;
_294.layers="";
for(var i=0;i<this.map.layers.length;i++){
var _296=this.map.layers[i];
if(_296.isBaseLayer){
_294.layers+=(_296==this.map.baseLayer)?"B":"0";
}else{
_294.layers+=(_296.getVisibility())?"T":"F";
}
}
var href=this.base;
if(href.indexOf("?")!=-1){
href=href.substring(0,href.indexOf("?"));
}
href+="?"+OpenLayers.Util.getParameterString(_294);
this.element.href=href;
},CLASS_NAME:"OpenLayers.Control.Permalink"});
OpenLayers.Control.Scale=OpenLayers.Class(OpenLayers.Control,{element:null,initialize:function(_298,_299){
OpenLayers.Control.prototype.initialize.apply(this,[_299]);
this.element=OpenLayers.Util.getElement(_298);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
if(!this.element){
this.element=document.createElement("div");
this.div.className=this.displayClass;
this.element.style.fontSize="smaller";
this.div.appendChild(this.element);
}
this.map.events.register("moveend",this,this.updateScale);
this.updateScale();
return this.div;
},updateScale:function(){
var _29a=this.map.getScale();
if(!_29a){
return;
}
if(_29a>=9500&&_29a<=950000){
_29a=Math.round(_29a/1000)+"K";
}else{
if(_29a>=950000){
_29a=Math.round(_29a/1000000)+"M";
}else{
_29a=Math.round(_29a);
}
}
this.element.innerHTML="Scale = 1 : "+_29a;
},CLASS_NAME:"OpenLayers.Control.Scale"});
OpenLayers.Control.ZoomToMaxExtent=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
if(this.map){
this.map.zoomToMaxExtent();
}
},CLASS_NAME:"OpenLayers.Control.ZoomToMaxExtent"});
OpenLayers.Event={observers:false,KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,element:function(_29b){
return _29b.target||_29b.srcElement;
},isLeftClick:function(_29c){
return (((_29c.which)&&(_29c.which==1))||((_29c.button)&&(_29c.button==1)));
},stop:function(_29d,_29e){
if(!_29e){
if(_29d.preventDefault){
_29d.preventDefault();
}else{
_29d.returnValue=false;
}
}
if(_29d.stopPropagation){
_29d.stopPropagation();
}else{
_29d.cancelBubble=true;
}
},findElement:function(_29f,_2a0){
var _2a1=OpenLayers.Event.element(_29f);
while(_2a1.parentNode&&(!_2a1.tagName||(_2a1.tagName.toUpperCase()!=_2a0.toUpperCase()))){
_2a1=_2a1.parentNode;
}
return _2a1;
},observe:function(_2a2,name,_2a4,_2a5){
var _2a6=OpenLayers.Util.getElement(_2a2);
_2a5=_2a5||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_2a6.attachEvent)){
name="keydown";
}
if(!this.observers){
this.observers={};
}
if(!_2a6._eventCacheID){
var _2a7="eventCacheID_";
if(_2a6.id){
_2a7=_2a6.id+"_"+_2a7;
}
_2a6._eventCacheID=OpenLayers.Util.createUniqueID(_2a7);
}
var _2a8=_2a6._eventCacheID;
if(!this.observers[_2a8]){
this.observers[_2a8]=[];
}
this.observers[_2a8].push({"element":_2a6,"name":name,"observer":_2a4,"useCapture":_2a5});
if(_2a6.addEventListener){
_2a6.addEventListener(name,_2a4,_2a5);
}else{
if(_2a6.attachEvent){
_2a6.attachEvent("on"+name,_2a4);
}
}
},stopObservingElement:function(_2a9){
var _2aa=OpenLayers.Util.getElement(_2a9);
var _2ab=_2aa._eventCacheID;
this._removeElementObservers(OpenLayers.Event.observers[_2ab]);
},_removeElementObservers:function(_2ac){
if(_2ac){
for(var i=_2ac.length-1;i>=0;i--){
var _2ae=_2ac[i];
var args=new Array(_2ae.element,_2ae.name,_2ae.observer,_2ae.useCapture);
var _2b0=OpenLayers.Event.stopObserving.apply(this,args);
}
}
},stopObserving:function(_2b1,name,_2b3,_2b4){
_2b4=_2b4||false;
var _2b5=OpenLayers.Util.getElement(_2b1);
var _2b6=_2b5._eventCacheID;
if(name=="keypress"){
if(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_2b5.detachEvent){
name="keydown";
}
}
var _2b7=false;
var _2b8=OpenLayers.Event.observers[_2b6];
if(_2b8){
var i=0;
while(!_2b7&&i<_2b8.length){
var _2ba=_2b8[i];
if((_2ba.name==name)&&(_2ba.observer==_2b3)&&(_2ba.useCapture==_2b4)){
_2b8.splice(i,1);
if(_2b8.length==0){
delete OpenLayers.Event.observers[_2b6];
}
_2b7=true;
break;
}
i++;
}
}
if(_2b5.removeEventListener){
_2b5.removeEventListener(name,_2b3,_2b4);
}else{
if(_2b5&&_2b5.detachEvent){
_2b5.detachEvent("on"+name,_2b3);
}
}
return _2b7;
},unloadCache:function(){
if(OpenLayers.Event.observers){
for(var _2bb in OpenLayers.Event.observers){
var _2bc=OpenLayers.Event.observers[_2bb];
OpenLayers.Event._removeElementObservers.apply(this,[_2bc]);
}
OpenLayers.Event.observers=false;
}
},CLASS_NAME:"OpenLayers.Event"};
OpenLayers.Event.observe(window,"unload",OpenLayers.Event.unloadCache,false);
if(window.Event){
OpenLayers.Util.applyDefaults(window.Event,OpenLayers.Event);
}else{
var Event=OpenLayers.Event;
}
OpenLayers.Events=OpenLayers.Class({BROWSER_EVENTS:["mouseover","mouseout","mousedown","mouseup","mousemove","click","dblclick","resize","focus","blur"],listeners:null,object:null,element:null,eventTypes:null,eventHandler:null,fallThrough:null,initialize:function(_2bd,_2be,_2bf,_2c0){
this.object=_2bd;
this.element=_2be;
this.eventTypes=_2bf;
this.fallThrough=_2c0;
this.listeners={};
this.eventHandler=OpenLayers.Function.bindAsEventListener(this.handleBrowserEvent,this);
if(this.eventTypes!=null){
for(var i=0;i<this.eventTypes.length;i++){
this.addEventType(this.eventTypes[i]);
}
}
if(this.element!=null){
this.attachToElement(_2be);
}
},destroy:function(){
if(this.element){
OpenLayers.Event.stopObservingElement(this.element);
}
this.element=null;
this.listeners=null;
this.object=null;
this.eventTypes=null;
this.fallThrough=null;
this.eventHandler=null;
},addEventType:function(_2c2){
if(!this.listeners[_2c2]){
this.listeners[_2c2]=[];
}
},attachToElement:function(_2c3){
for(var i=0;i<this.BROWSER_EVENTS.length;i++){
var _2c5=this.BROWSER_EVENTS[i];
this.addEventType(_2c5);
OpenLayers.Event.observe(_2c3,_2c5,this.eventHandler);
}
OpenLayers.Event.observe(_2c3,"dragstart",OpenLayers.Event.stop);
},register:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _2c9=this.listeners[type];
if(_2c9!=null){
_2c9.push({obj:obj,func:func});
}
}
},registerPriority:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _2cd=this.listeners[type];
if(_2cd!=null){
_2cd.unshift({obj:obj,func:func});
}
}
},unregister:function(type,obj,func){
if(obj==null){
obj=this.object;
}
var _2d1=this.listeners[type];
if(_2d1!=null){
for(var i=0;i<_2d1.length;i++){
if(_2d1[i].obj==obj&&_2d1[i].func==func){
_2d1.splice(i,1);
break;
}
}
}
},remove:function(type){
if(this.listeners[type]!=null){
this.listeners[type]=[];
}
},triggerEvent:function(type,evt){
if(evt==null){
evt={};
}
evt.object=this.object;
evt.element=this.element;
var _2d6=(this.listeners[type])?this.listeners[type].slice():null;
if((_2d6!=null)&&(_2d6.length>0)){
for(var i=0;i<_2d6.length;i++){
var _2d8=_2d6[i];
var _2d9;
if(_2d8.obj!=null){
_2d9=_2d8.func.call(_2d8.obj,evt);
}else{
_2d9=_2d8.func(evt);
}
if((_2d9!=null)&&(_2d9==false)){
break;
}
}
if(!this.fallThrough){
OpenLayers.Event.stop(evt,true);
}
}
},handleBrowserEvent:function(evt){
evt.xy=this.getMousePosition(evt);
this.triggerEvent(evt.type,evt);
},getMousePosition:function(evt){
if(!this.element.offsets){
this.element.offsets=OpenLayers.Util.pagePosition(this.element);
this.element.offsets[0]+=(document.documentElement.scrollLeft||document.body.scrollLeft);
this.element.offsets[1]+=(document.documentElement.scrollTop||document.body.scrollTop);
}
return new OpenLayers.Pixel((evt.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft))-this.element.offsets[0]-(document.documentElement.clientLeft||0),(evt.clientY+(document.documentElement.scrollTop||document.body.scrollTop))-this.element.offsets[1]-(document.documentElement.clientTop||0));
},CLASS_NAME:"OpenLayers.Events"});
OpenLayers.Format=OpenLayers.Class({initialize:function(_2dc){
OpenLayers.Util.extend(this,_2dc);
},read:function(data){
alert("Read not implemented.");
},write:function(_2de){
alert("Write not implemented.");
},CLASS_NAME:"OpenLayers.Format"});
OpenLayers.Popup.Anchored=OpenLayers.Class(OpenLayers.Popup,{relativePosition:null,anchor:null,initialize:function(id,_2e0,size,_2e2,_2e3,_2e4){
var _2e5=new Array(id,_2e0,size,_2e2,_2e4);
OpenLayers.Popup.prototype.initialize.apply(this,_2e5);
this.anchor=(_2e3!=null)?_2e3:{size:new OpenLayers.Size(0,0),offset:new OpenLayers.Pixel(0,0)};
},draw:function(px){
if(px==null){
if((this.lonlat!=null)&&(this.map!=null)){
px=this.map.getLayerPxFromLonLat(this.lonlat);
}
}
this.relativePosition=this.calculateRelativePosition(px);
return OpenLayers.Popup.prototype.draw.apply(this,arguments);
},calculateRelativePosition:function(px){
var _2e8=this.map.getLonLatFromLayerPx(px);
var _2e9=this.map.getExtent();
var _2ea=_2e9.determineQuadrant(_2e8);
return OpenLayers.Bounds.oppositeQuadrant(_2ea);
},moveTo:function(px){
this.relativePosition=this.calculateRelativePosition(px);
var _2ec=this.calculateNewPx(px);
var _2ed=new Array(_2ec);
OpenLayers.Popup.prototype.moveTo.apply(this,_2ed);
},setSize:function(size){
OpenLayers.Popup.prototype.setSize.apply(this,arguments);
if((this.lonlat)&&(this.map)){
var px=this.map.getLayerPxFromLonLat(this.lonlat);
this.moveTo(px);
}
},calculateNewPx:function(px){
var _2f1=px.offset(this.anchor.offset);
var top=(this.relativePosition.charAt(0)=="t");
_2f1.y+=(top)?-this.size.h:this.anchor.size.h;
var left=(this.relativePosition.charAt(1)=="l");
_2f1.x+=(left)?-this.size.w:this.anchor.size.w;
return _2f1;
},CLASS_NAME:"OpenLayers.Popup.Anchored"});
OpenLayers.Renderer.Elements=OpenLayers.Class(OpenLayers.Renderer,{rendererRoot:null,root:null,xmlns:null,initialize:function(_2f4){
OpenLayers.Renderer.prototype.initialize.apply(this,arguments);
this.rendererRoot=this.createRenderRoot();
this.root=this.createRoot();
this.rendererRoot.appendChild(this.root);
this.container.appendChild(this.rendererRoot);
},destroy:function(){
this.clear();
this.rendererRoot=null;
this.root=null;
this.xmlns=null;
OpenLayers.Renderer.prototype.destroy.apply(this,arguments);
},clear:function(){
if(this.root){
while(this.root.childNodes.length>0){
this.root.removeChild(this.root.firstChild);
}
}
},getNodeType:function(_2f5){
},drawGeometry:function(_2f6,_2f7,_2f8){
var _2f9=_2f6.CLASS_NAME;
if((_2f9=="OpenLayers.Geometry.Collection")||(_2f9=="OpenLayers.Geometry.MultiPoint")||(_2f9=="OpenLayers.Geometry.MultiLineString")||(_2f9=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_2f6.components.length;i++){
this.drawGeometry(_2f6.components[i],_2f7,_2f8);
}
return;
}
var _2fb=this.getNodeType(_2f6);
var node=this.nodeFactory(_2f6.id,_2fb,_2f6);
node._featureId=_2f8;
node._geometryClass=_2f6.CLASS_NAME;
node._style=_2f7;
this.root.appendChild(node);
this.drawGeometryNode(node,_2f6);
},drawGeometryNode:function(node,_2fe,_2ff){
_2ff=_2ff||node._style;
var _300={"isFilled":true,"isStroked":true};
switch(_2fe.CLASS_NAME){
case "OpenLayers.Geometry.Point":
this.drawPoint(node,_2fe);
break;
case "OpenLayers.Geometry.LineString":
_300.isFilled=false;
this.drawLineString(node,_2fe);
break;
case "OpenLayers.Geometry.LinearRing":
this.drawLinearRing(node,_2fe);
break;
case "OpenLayers.Geometry.Polygon":
this.drawPolygon(node,_2fe);
break;
case "OpenLayers.Geometry.Surface":
this.drawSurface(node,_2fe);
break;
case "OpenLayers.Geometry.Rectangle":
this.drawRectangle(node,_2fe);
break;
default:
break;
}
node._style=_2ff;
node._options=_300;
this.setStyle(node,_2ff,_300,_2fe);
},drawPoint:function(node,_302){
},drawLineString:function(node,_304){
},drawLinearRing:function(node,_306){
},drawPolygon:function(node,_308){
},drawRectangle:function(node,_30a){
},drawCircle:function(node,_30c){
},drawCurve:function(node,_30e){
},drawSurface:function(node,_310){
},getFeatureIdFromEvent:function(evt){
var node=evt.target||evt.srcElement;
return node._featureId;
},eraseGeometry:function(_313){
if((_313.CLASS_NAME=="OpenLayers.Geometry.MultiPoint")||(_313.CLASS_NAME=="OpenLayers.Geometry.MultiLineString")||(_313.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_313.components.length;i++){
this.eraseGeometry(_313.components[i]);
}
}else{
var _315=OpenLayers.Util.getElement(_313.id);
if(_315&&_315.parentNode){
if(_315.geometry){
_315.geometry.destroy();
_315.geometry=null;
}
_315.parentNode.removeChild(_315);
}
}
},nodeFactory:function(id,type,_318){
var node=OpenLayers.Util.getElement(id);
if(node){
if(!this.nodeTypeCompare(node,type)){
node.parentNode.removeChild(node);
node=this.nodeFactory(id,type,_318);
}
}else{
node=this.createNode(type,id);
}
return node;
},CLASS_NAME:"OpenLayers.Renderer.Elements"});
OpenLayers.Tile=OpenLayers.Class({EVENT_TYPES:["loadstart","loadend","reload"],events:null,id:null,layer:null,url:null,bounds:null,size:null,position:null,drawn:false,isLoading:false,initialize:function(_31a,_31b,_31c,url,size){
this.layer=_31a;
this.position=_31b;
this.bounds=_31c;
this.url=url;
this.size=size;
this.id=OpenLayers.Util.createUniqueID("Tile_");
this.events=new OpenLayers.Events(this,null,this.EVENT_TYPES);
},destroy:function(){
this.layer=null;
this.bounds=null;
this.size=null;
this.position=null;
this.events.destroy();
this.events=null;
},draw:function(){
this.clear();
var _31f=this.layer.maxExtent;
var _320=(_31f&&this.bounds.intersectsBounds(_31f,false));
var _321=this.layer.map.getExtent();
var _322=(_321&&this.bounds.intersectsBounds(_321,false));
return ((_320||this.layer.displayOutsideMaxExtent)&&(_322||(this.layer.buffer!=0)));
},moveTo:function(_323,_324,_325){
if(_325==null){
_325=true;
}
this.clear();
this.bounds=_323.clone();
this.position=_324.clone();
if(_325){
this.draw();
}
},clear:function(){
this.drawn=false;
},getBoundsFromBaseLayer:function(_326){
OpenLayers.Console.warn("You are using the 'reproject' option "+"on the "+this.layer.name+" layer. This option is deprecated: "+"its use was designed to support displaying data over commercial "+"basemaps, but that functionality should now be achieved by using "+"Spherical Mercator support. More information is available from "+"http://trac.openlayers.org/wiki/SphericalMercator.");
var _327=this.layer.map.getLonLatFromLayerPx(_326);
var _328=_326.clone();
_328.x+=this.size.w;
_328.y+=this.size.h;
var _329=this.layer.map.getLonLatFromLayerPx(_328);
if(_327.lon>_329.lon){
if(_327.lon<0){
_327.lon=-180-(_327.lon+180);
}else{
_329.lon=180+_329.lon+180;
}
}
bounds=new OpenLayers.Bounds(_327.lon,_329.lat,_329.lon,_327.lat);
return bounds;
},CLASS_NAME:"OpenLayers.Tile"});
OpenLayers.Control.MouseToolbar=OpenLayers.Class(OpenLayers.Control.MouseDefaults,{mode:null,buttons:null,direction:"vertical",buttonClicked:null,initialize:function(_32a,_32b){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.position=new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,OpenLayers.Control.MouseToolbar.Y);
if(_32a){
this.position=_32a;
}
if(_32b){
this.direction=_32b;
}
this.measureDivs=[];
},destroy:function(){
for(var _32c in this.buttons){
var btn=this.buttons[_32c];
btn.map=null;
btn.events.destroy();
}
OpenLayers.Control.MouseDefaults.prototype.destroy.apply(this,arguments);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
OpenLayers.Control.MouseDefaults.prototype.draw.apply(this,arguments);
this.buttons={};
var sz=new OpenLayers.Size(28,28);
var _32f=new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,0);
this._addButton("zoombox","drag-rectangle-off.png","drag-rectangle-on.png",_32f,sz,"Shift->Drag to zoom to area");
_32f=_32f.add((this.direction=="vertical"?0:sz.w),(this.direction=="vertical"?sz.h:0));
this._addButton("pan","panning-hand-off.png","panning-hand-on.png",_32f,sz,"Drag the map to pan.");
_32f=_32f.add((this.direction=="vertical"?0:sz.w),(this.direction=="vertical"?sz.h:0));
this.switchModeTo("pan");
return this.div;
},_addButton:function(id,img,_332,xy,sz,_335){
var _336=OpenLayers.Util.getImagesLocation()+img;
var _337=OpenLayers.Util.getImagesLocation()+_332;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MouseToolbar_"+id,xy,sz,_336,"absolute");
this.div.appendChild(btn);
btn.imgLocation=_336;
btn.activeImgLocation=_337;
btn.events=new OpenLayers.Events(this,btn,null,true);
btn.events.register("mousedown",this,this.buttonDown);
btn.events.register("mouseup",this,this.buttonUp);
btn.events.register("dblclick",this,OpenLayers.Event.stop);
btn.action=id;
btn.title=_335;
btn.alt=_335;
btn.map=this.map;
this.buttons[id]=btn;
return btn;
},buttonDown:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
this.buttonClicked=evt.element.action;
OpenLayers.Event.stop(evt);
},buttonUp:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
if(this.buttonClicked!=null){
if(this.buttonClicked==evt.element.action){
this.switchModeTo(evt.element.action);
}
OpenLayers.Event.stop(evt);
this.buttonClicked=null;
}
},defaultDblClick:function(evt){
this.switchModeTo("pan");
this.performedDrag=false;
var _33c=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_33c,this.map.zoom+1);
OpenLayers.Event.stop(evt);
return false;
},defaultMouseDown:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
this.mouseDragStart=evt.xy.clone();
this.performedDrag=false;
this.startViaKeyboard=false;
if(evt.shiftKey&&this.mode!="zoombox"){
this.switchModeTo("zoombox");
this.startViaKeyboard=true;
}else{
if(evt.altKey&&this.mode!="measure"){
this.switchModeTo("measure");
}else{
if(!this.mode){
this.switchModeTo("pan");
}
}
}
switch(this.mode){
case "zoombox":
this.map.div.style.cursor="crosshair";
this.zoomBox=OpenLayers.Util.createDiv("zoomBox",this.mouseDragStart,null,null,"absolute","2px solid red");
this.zoomBox.style.backgroundColor="white";
this.zoomBox.style.filter="alpha(opacity=50)";
this.zoomBox.style.opacity="0.50";
this.zoomBox.style.fontSize="1px";
this.zoomBox.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
this.map.viewPortDiv.appendChild(this.zoomBox);
this.performedDrag=true;
break;
case "measure":
var _33e="";
if(this.measureStart){
measureEnd=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
_33e=OpenLayers.Util.distVincenty(this.measureStart,measureEnd);
_33e=Math.round(_33e*100)/100;
_33e=_33e+"km";
this.measureStartBox=this.measureBox;
}
this.measureStart=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
this.measureBox=OpenLayers.Util.createDiv(null,this.mouseDragStart.add(-2-parseInt(this.map.layerContainerDiv.style.left),-2-parseInt(this.map.layerContainerDiv.style.top)),null,null,"absolute");
this.measureBox.style.width="4px";
this.measureBox.style.height="4px";
this.measureBox.style.fontSize="1px";
this.measureBox.style.backgroundColor="red";
this.measureBox.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
this.map.layerContainerDiv.appendChild(this.measureBox);
if(_33e){
this.measureBoxDistance=OpenLayers.Util.createDiv(null,this.mouseDragStart.add(-2-parseInt(this.map.layerContainerDiv.style.left),2-parseInt(this.map.layerContainerDiv.style.top)),null,null,"absolute");
this.measureBoxDistance.innerHTML=_33e;
this.measureBoxDistance.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
this.map.layerContainerDiv.appendChild(this.measureBoxDistance);
this.measureDivs.push(this.measureBoxDistance);
}
this.measureBox.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
this.map.layerContainerDiv.appendChild(this.measureBox);
this.measureDivs.push(this.measureBox);
break;
default:
this.map.div.style.cursor="move";
break;
}
document.onselectstart=function(){
return false;
};
OpenLayers.Event.stop(evt);
},switchModeTo:function(mode){
if(mode!=this.mode){
if(this.mode&&this.buttons[this.mode]){
OpenLayers.Util.modifyAlphaImageDiv(this.buttons[this.mode],null,null,null,this.buttons[this.mode].imgLocation);
}
if(this.mode=="measure"&&mode!="measure"){
for(var i=0;i<this.measureDivs.length;i++){
if(this.measureDivs[i]){
this.map.layerContainerDiv.removeChild(this.measureDivs[i]);
}
}
this.measureDivs=[];
this.measureStart=null;
}
this.mode=mode;
if(this.buttons[mode]){
OpenLayers.Util.modifyAlphaImageDiv(this.buttons[mode],null,null,null,this.buttons[mode].activeImgLocation);
}
switch(this.mode){
case "zoombox":
this.map.div.style.cursor="crosshair";
break;
default:
this.map.div.style.cursor="";
break;
}
}
},leaveMode:function(){
this.switchModeTo("pan");
},defaultMouseMove:function(evt){
if(this.mouseDragStart!=null){
switch(this.mode){
case "zoombox":
var _342=Math.abs(this.mouseDragStart.x-evt.xy.x);
var _343=Math.abs(this.mouseDragStart.y-evt.xy.y);
this.zoomBox.style.width=Math.max(1,_342)+"px";
this.zoomBox.style.height=Math.max(1,_343)+"px";
if(evt.xy.x<this.mouseDragStart.x){
this.zoomBox.style.left=evt.xy.x+"px";
}
if(evt.xy.y<this.mouseDragStart.y){
this.zoomBox.style.top=evt.xy.y+"px";
}
break;
default:
var _342=this.mouseDragStart.x-evt.xy.x;
var _343=this.mouseDragStart.y-evt.xy.y;
var size=this.map.getSize();
var _345=new OpenLayers.Pixel(size.w/2+_342,size.h/2+_343);
var _346=this.map.getLonLatFromViewPortPx(_345);
this.map.setCenter(_346,null,true);
this.mouseDragStart=evt.xy.clone();
}
this.performedDrag=true;
}
},defaultMouseUp:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
switch(this.mode){
case "zoombox":
this.zoomBoxEnd(evt);
if(this.startViaKeyboard){
this.leaveMode();
}
break;
case "pan":
if(this.performedDrag){
this.map.setCenter(this.map.center);
}
}
document.onselectstart=null;
this.mouseDragStart=null;
this.map.div.style.cursor="default";
},defaultMouseOut:function(evt){
if(this.mouseDragStart!=null&&OpenLayers.Util.mouseLeft(evt,this.map.div)){
if(this.zoomBox){
this.removeZoomBox();
if(this.startViaKeyboard){
this.leaveMode();
}
}
this.mouseDragStart=null;
this.map.div.style.cursor="default";
}
},defaultClick:function(evt){
if(this.performedDrag){
this.performedDrag=false;
return false;
}
}});
OpenLayers.Control.MouseToolbar.X=6;
OpenLayers.Control.MouseToolbar.Y=300;
OpenLayers.Control.OverviewMap=OpenLayers.Class(OpenLayers.Control,{id:"OverviewMap",element:null,ovmap:null,size:new OpenLayers.Size(180,90),layers:null,minRatio:8,maxRatio:32,mapOptions:null,initialize:function(_34a){
this.layers=[];
OpenLayers.Control.prototype.initialize.apply(this,[_34a]);
},destroy:function(){
if(!this.mapDiv){
return;
}
this.mapDiv.removeChild(this.extentRectangle);
this.extentRectangle=null;
this.rectEvents.destroy();
this.rectEvents=null;
this.ovmap.destroy();
this.ovmap=null;
this.element.removeChild(this.mapDiv);
this.mapDiv=null;
this.mapDivEvents.destroy();
this.mapDivEvents=null;
this.div.removeChild(this.element);
this.element=null;
this.elementEvents.destroy();
this.elementEvents=null;
if(this.maximizeDiv){
OpenLayers.Event.stopObservingElement(this.maximizeDiv);
this.div.removeChild(this.maximizeDiv);
this.maximizeDiv=null;
}
if(this.minimizeDiv){
OpenLayers.Event.stopObservingElement(this.minimizeDiv);
this.div.removeChild(this.minimizeDiv);
this.minimizeDiv=null;
}
this.map.events.unregister("moveend",this,this.update);
this.map.events.unregister("changebaselayer",this,this.baseLayerDraw);
OpenLayers.Control.prototype.destroy.apply(this,arguments);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
if(!(this.layers.length>0)){
if(this.map.baseLayer){
var _34b=this.map.baseLayer.clone();
this.layers=[_34b];
}else{
this.map.events.register("changebaselayer",this,this.baseLayerDraw);
return this.div;
}
}
this.element=document.createElement("div");
this.element.className=this.displayClass+"Element";
this.element.style.display="none";
this.mapDiv=document.createElement("div");
this.mapDiv.style.width=this.size.w+"px";
this.mapDiv.style.height=this.size.h+"px";
this.mapDiv.style.position="relative";
this.mapDiv.style.overflow="hidden";
this.mapDiv.id=OpenLayers.Util.createUniqueID("overviewMap");
this.extentRectangle=document.createElement("div");
this.extentRectangle.style.position="absolute";
this.extentRectangle.style.zIndex=1000;
this.extentRectangle.style.overflow="hidden";
this.extentRectangle.style.backgroundImage="url("+OpenLayers.Util.getImagesLocation()+"blank.gif)";
this.extentRectangle.className=this.displayClass+"ExtentRectangle";
this.mapDiv.appendChild(this.extentRectangle);
this.element.appendChild(this.mapDiv);
this.div.appendChild(this.element);
this.map.events.register("moveend",this,this.update);
this.elementEvents=new OpenLayers.Events(this,this.element);
this.elementEvents.register("mousedown",this,function(e){
OpenLayers.Event.stop(e);
});
this.elementEvents.register("click",this,function(e){
OpenLayers.Event.stop(e);
});
this.elementEvents.register("dblclick",this,function(e){
OpenLayers.Event.stop(e);
});
this.rectEvents=new OpenLayers.Events(this,this.extentRectangle,null,true);
this.rectEvents.register("mouseout",this,this.rectMouseOut);
this.rectEvents.register("mousedown",this,this.rectMouseDown);
this.rectEvents.register("mousemove",this,this.rectMouseMove);
this.rectEvents.register("mouseup",this,this.rectMouseUp);
this.rectEvents.register("click",this,function(e){
OpenLayers.Event.stop(e);
});
this.rectEvents.register("dblclick",this,this.rectDblClick);
this.mapDivEvents=new OpenLayers.Events(this,this.mapDiv);
this.mapDivEvents.register("click",this,this.mapDivClick);
if(!this.outsideViewport){
this.div.className=this.displayClass+"Container";
var _350=OpenLayers.Util.getImagesLocation();
var img=_350+"layer-switcher-maximize.png";
this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv(this.displayClass+"MaximizeButton",null,new OpenLayers.Size(18,18),img,"absolute");
this.maximizeDiv.style.display="none";
this.maximizeDiv.className=this.displayClass+"MaximizeButton";
OpenLayers.Event.observe(this.maximizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.maximizeControl,this));
this.div.appendChild(this.maximizeDiv);
var img=_350+"layer-switcher-minimize.png";
this.minimizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_minimizeDiv",null,new OpenLayers.Size(18,18),img,"absolute");
this.minimizeDiv.style.display="none";
this.minimizeDiv.className=this.displayClass+"MinimizeButton";
OpenLayers.Event.observe(this.minimizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.minimizeControl,this));
this.div.appendChild(this.minimizeDiv);
var _352=["dblclick","mousedown"];
for(var i=0;i<_352.length;i++){
OpenLayers.Event.observe(this.maximizeDiv,_352[i],OpenLayers.Event.stop);
OpenLayers.Event.observe(this.minimizeDiv,_352[i],OpenLayers.Event.stop);
}
this.minimizeControl();
}else{
this.element.style.display="";
}
if(this.map.getExtent()){
this.update();
}
return this.div;
},baseLayerDraw:function(){
this.draw();
this.map.events.unregister("changebaselayer",this,this.baseLayerDraw);
},rectMouseOut:function(evt){
if(this.rectDragStart!=null){
if(this.performedRectDrag){
this.rectMouseMove(evt);
var _355=this.getRectPxBounds();
if((_355.top<=0)||(_355.left<=0)||(_355.bottom>=this.size.h-this.hComp)||(_355.right>=this.size.w-this.wComp)){
this.updateMapToRect();
}else{
return;
}
}
document.onselectstart=null;
this.rectDragStart=null;
}
},rectMouseDown:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
this.rectDragStart=evt.xy.clone();
this.performedRectDrag=false;
OpenLayers.Event.stop(evt);
},rectMouseMove:function(evt){
if(this.rectDragStart!=null){
var _358=this.rectDragStart.x-evt.xy.x;
var _359=this.rectDragStart.y-evt.xy.y;
var _35a=this.getRectPxBounds();
var _35b=_35a.top;
var _35c=_35a.left;
var _35d=Math.abs(_35a.getHeight());
var _35e=_35a.getWidth();
var _35f=Math.max(0,(_35b-_359));
_35f=Math.min(_35f,this.ovmap.size.h-this.hComp-_35d);
var _360=Math.max(0,(_35c-_358));
_360=Math.min(_360,this.ovmap.size.w-this.wComp-_35e);
this.setRectPxBounds(new OpenLayers.Bounds(_360,_35f+_35d,_360+_35e,_35f));
this.rectDragStart=evt.xy.clone();
this.performedRectDrag=true;
OpenLayers.Event.stop(evt);
}
},rectMouseUp:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
if(this.performedRectDrag){
this.updateMapToRect();
OpenLayers.Event.stop(evt);
}
document.onselectstart=null;
this.rectDragStart=null;
},rectDblClick:function(evt){
this.performedRectDrag=false;
OpenLayers.Event.stop(evt);
this.updateOverview();
},mapDivClick:function(evt){
var _364=this.getRectPxBounds();
var _365=_364.getCenterPixel();
var _366=evt.xy.x-_365.x;
var _367=evt.xy.y-_365.y;
var top=_364.top;
var left=_364.left;
var _36a=Math.abs(_364.getHeight());
var _36b=_364.getWidth();
var _36c=Math.max(0,(top+_367));
_36c=Math.min(_36c,this.ovmap.size.h-_36a);
var _36d=Math.max(0,(left+_366));
_36d=Math.min(_36d,this.ovmap.size.w-_36b);
this.setRectPxBounds(new OpenLayers.Bounds(_36d,_36c+_36a,_36d+_36b,_36c));
this.updateMapToRect();
OpenLayers.Event.stop(evt);
},maximizeControl:function(e){
this.element.style.display="";
this.showToggle(false);
if(e!=null){
OpenLayers.Event.stop(e);
}
},minimizeControl:function(e){
this.element.style.display="none";
this.showToggle(true);
if(e!=null){
OpenLayers.Event.stop(e);
}
},showToggle:function(_370){
this.maximizeDiv.style.display=_370?"":"none";
this.minimizeDiv.style.display=_370?"none":"";
},update:function(){
if(this.ovmap==null){
this.createMap();
}
if(!this.isSuitableOverview()){
this.updateOverview();
}
this.updateRectToMap();
},isSuitableOverview:function(){
var _371=this.map.getExtent();
var _372=this.map.maxExtent;
var _373=new OpenLayers.Bounds(Math.max(_371.left,_372.left),Math.max(_371.bottom,_372.bottom),Math.min(_371.right,_372.right),Math.min(_371.top,_372.top));
var _374=this.ovmap.getResolution()/this.map.getResolution();
return ((_374>this.minRatio)&&(_374<=this.maxRatio)&&(this.ovmap.getExtent().containsBounds(_373)));
},updateOverview:function(){
var _375=this.map.getResolution();
var _376=this.ovmap.getResolution();
var _377=_376/_375;
if(_377>this.maxRatio){
_376=this.minRatio*_375;
}else{
if(_377<=this.minRatio){
_376=this.maxRatio*_375;
}
}
this.ovmap.setCenter(this.map.center,this.ovmap.getZoomForResolution(_376));
this.updateRectToMap();
},createMap:function(){
var _378=OpenLayers.Util.extend({controls:[],maxResolution:"auto"},this.mapOptions);
this.ovmap=new OpenLayers.Map(this.mapDiv,_378);
this.ovmap.addLayers(this.layers);
this.ovmap.zoomToMaxExtent();
this.wComp=parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-left-width"))+parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-right-width"));
this.wComp=(this.wComp)?this.wComp:2;
this.hComp=parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-top-width"))+parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-bottom-width"));
this.hComp=(this.hComp)?this.hComp:2;
},updateRectToMap:function(){
if(this.map.units!="degrees"){
if(this.ovmap.getProjection()&&(this.map.getProjection()!=this.ovmap.getProjection())){
alert("The overview map only works when it is in the same projection as the main map");
}
}
var _379=this.getRectBoundsFromMapBounds(this.map.getExtent());
if(_379){
this.setRectPxBounds(_379);
}
},updateMapToRect:function(){
var _37a=this.getRectPxBounds();
var _37b=this.getMapBoundsFromRectBounds(_37a);
this.map.setCenter(_37b.getCenterLonLat(),this.map.zoom);
},getRectPxBounds:function(){
var top=parseInt(this.extentRectangle.style.top);
var left=parseInt(this.extentRectangle.style.left);
var _37e=parseInt(this.extentRectangle.style.height);
var _37f=parseInt(this.extentRectangle.style.width);
return new OpenLayers.Bounds(left,top+_37e,left+_37f,top);
},setRectPxBounds:function(_380){
var top=Math.max(_380.top,0);
var left=Math.max(_380.left,0);
var _383=Math.min(_380.top+Math.abs(_380.getHeight()),this.ovmap.size.h-this.hComp);
var _384=Math.min(_380.left+_380.getWidth(),this.ovmap.size.w-this.wComp);
this.extentRectangle.style.top=parseInt(top)+"px";
this.extentRectangle.style.left=parseInt(left)+"px";
this.extentRectangle.style.height=parseInt(Math.max(_383-top,0))+"px";
this.extentRectangle.style.width=parseInt(Math.max(_384-left,0))+"px";
},getRectBoundsFromMapBounds:function(_385){
var _386=new OpenLayers.LonLat(_385.left,_385.bottom);
var _387=new OpenLayers.LonLat(_385.right,_385.top);
var _388=this.getOverviewPxFromLonLat(_386);
var _389=this.getOverviewPxFromLonLat(_387);
var _38a=null;
if(_388&&_389){
_38a=new OpenLayers.Bounds(_388.x,_388.y,_389.x,_389.y);
}
return _38a;
},getMapBoundsFromRectBounds:function(_38b){
var _38c=new OpenLayers.Pixel(_38b.left,_38b.bottom);
var _38d=new OpenLayers.Pixel(_38b.right,_38b.top);
var _38e=this.getLonLatFromOverviewPx(_38c);
var _38f=this.getLonLatFromOverviewPx(_38d);
return new OpenLayers.Bounds(_38e.lon,_38e.lat,_38f.lon,_38f.lat);
},getLonLatFromOverviewPx:function(_390){
var size=this.ovmap.size;
var res=this.ovmap.getResolution();
var _393=this.ovmap.getExtent().getCenterLonLat();
var _394=_390.x-(size.w/2);
var _395=_390.y-(size.h/2);
return new OpenLayers.LonLat(_393.lon+_394*res,_393.lat-_395*res);
},getOverviewPxFromLonLat:function(_396){
var res=this.ovmap.getResolution();
var _398=this.ovmap.getExtent();
var px=null;
if(_398){
px=new OpenLayers.Pixel(Math.round(1/res*(_396.lon-_398.left)),Math.round(1/res*(_398.top-_396.lat)));
}
return px;
},CLASS_NAME:"OpenLayers.Control.OverviewMap"});
OpenLayers.Control.PanZoomBar=OpenLayers.Class(OpenLayers.Control.PanZoom,{zoomStopWidth:18,zoomStopHeight:11,slider:null,sliderEvents:null,zoomBarDiv:null,divEvents:null,initialize:function(){
OpenLayers.Control.PanZoom.prototype.initialize.apply(this,arguments);
},destroy:function(){
this.div.removeChild(this.slider);
this.slider=null;
this.sliderEvents.destroy();
this.sliderEvents=null;
this.div.removeChild(this.zoombarDiv);
this.zoomBarDiv=null;
this.divEvents.destroy();
this.divEvents=null;
this.map.events.unregister("zoomend",this,this.moveZoomBar);
this.map.events.unregister("changebaselayer",this,this.redraw);
OpenLayers.Control.PanZoom.prototype.destroy.apply(this,arguments);
},setMap:function(map){
OpenLayers.Control.PanZoom.prototype.setMap.apply(this,arguments);
this.map.events.register("changebaselayer",this,this.redraw);
},redraw:function(){
if(this.div!=null){
this.div.innerHTML="";
}
this.draw();
},draw:function(px){
OpenLayers.Control.prototype.draw.apply(this,arguments);
px=this.position.clone();
this.buttons=[];
var sz=new OpenLayers.Size(18,18);
var _39d=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
this._addButton("panup","north-mini.png",_39d,sz);
px.y=_39d.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
this._addButton("panright","east-mini.png",px.add(sz.w,0),sz);
this._addButton("pandown","south-mini.png",_39d.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_39d.add(0,sz.h*3+5),sz);
_39d=this._addZoomBar(_39d.add(0,sz.h*4+5));
this._addButton("zoomout","zoom-minus-mini.png",_39d,sz);
return this.div;
},_addZoomBar:function(_39e){
var _39f=OpenLayers.Util.getImagesLocation();
var id="OpenLayers_Control_PanZoomBar_Slider"+this.map.id;
var _3a1=this.map.getNumZoomLevels()-1-this.map.getZoom();
var _3a2=OpenLayers.Util.createAlphaImageDiv(id,_39e.add(-1,_3a1*this.zoomStopHeight),new OpenLayers.Size(20,9),_39f+"slider.png","absolute");
this.slider=_3a2;
this.sliderEvents=new OpenLayers.Events(this,_3a2,null,true);
this.sliderEvents.register("mousedown",this,this.zoomBarDown);
this.sliderEvents.register("mousemove",this,this.zoomBarDrag);
this.sliderEvents.register("mouseup",this,this.zoomBarUp);
this.sliderEvents.register("dblclick",this,this.doubleClick);
this.sliderEvents.register("click",this,this.doubleClick);
sz=new OpenLayers.Size();
sz.h=this.zoomStopHeight*this.map.getNumZoomLevels();
sz.w=this.zoomStopWidth;
var div=null;
if(OpenLayers.Util.alphaHack()){
var id="OpenLayers_Control_PanZoomBar"+this.map.id;
div=OpenLayers.Util.createAlphaImageDiv(id,_39e,new OpenLayers.Size(sz.w,this.zoomStopHeight),_39f+"zoombar.png","absolute",null,"crop");
div.style.height=sz.h;
}else{
div=OpenLayers.Util.createDiv("OpenLayers_Control_PanZoomBar_Zoombar"+this.map.id,_39e,sz,_39f+"zoombar.png");
}
this.zoombarDiv=div;
this.divEvents=new OpenLayers.Events(this,div,null,true);
this.divEvents.register("mousedown",this,this.divClick);
this.divEvents.register("mousemove",this,this.passEventToSlider);
this.divEvents.register("dblclick",this,this.doubleClick);
this.divEvents.register("click",this,this.doubleClick);
this.div.appendChild(div);
this.startTop=parseInt(div.style.top);
this.div.appendChild(_3a2);
this.map.events.register("zoomend",this,this.moveZoomBar);
_39e=_39e.add(0,this.zoomStopHeight*this.map.getNumZoomLevels());
return _39e;
},passEventToSlider:function(evt){
this.sliderEvents.handleBrowserEvent(evt);
},divClick:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
var y=evt.xy.y;
var top=OpenLayers.Util.pagePosition(evt.object)[1];
var _3a8=Math.floor((y-top)/this.zoomStopHeight);
this.map.zoomTo((this.map.getNumZoomLevels()-1)-_3a8);
OpenLayers.Event.stop(evt);
},zoomBarDown:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
this.map.events.register("mousemove",this,this.passEventToSlider);
this.map.events.register("mouseup",this,this.passEventToSlider);
this.mouseDragStart=evt.xy.clone();
this.zoomStart=evt.xy.clone();
this.div.style.cursor="move";
this.zoombarDiv.offsets=null;
OpenLayers.Event.stop(evt);
},zoomBarDrag:function(evt){
if(this.mouseDragStart!=null){
var _3ab=this.mouseDragStart.y-evt.xy.y;
var _3ac=OpenLayers.Util.pagePosition(this.zoombarDiv);
if((evt.clientY-_3ac[1])>0&&(evt.clientY-_3ac[1])<parseInt(this.zoombarDiv.style.height)-2){
var _3ad=parseInt(this.slider.style.top)-_3ab;
this.slider.style.top=_3ad+"px";
}
this.mouseDragStart=evt.xy.clone();
OpenLayers.Event.stop(evt);
}
},zoomBarUp:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
if(this.zoomStart){
this.div.style.cursor="";
this.map.events.unregister("mouseup",this,this.passEventToSlider);
this.map.events.unregister("mousemove",this,this.passEventToSlider);
var _3af=this.zoomStart.y-evt.xy.y;
this.map.zoomTo(this.map.zoom+Math.round(_3af/this.zoomStopHeight));
this.moveZoomBar();
this.mouseDragStart=null;
OpenLayers.Event.stop(evt);
}
},moveZoomBar:function(){
var _3b0=((this.map.getNumZoomLevels()-1)-this.map.getZoom())*this.zoomStopHeight+this.startTop+1;
this.slider.style.top=_3b0+"px";
},CLASS_NAME:"OpenLayers.Control.PanZoomBar"});
OpenLayers.Format.JSON=OpenLayers.Class(OpenLayers.Format,{indent:"    ",space:" ",newline:"\n",level:0,pretty:false,initialize:function(_3b1){
OpenLayers.Format.prototype.initialize.apply(this,[_3b1]);
},read:function(json,_3b3){
try{
if(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(json)){
var _3b4=eval("("+json+")");
if(typeof _3b3==="function"){
function walk(k,v){
if(v&&typeof v==="object"){
for(var i in v){
if(v.hasOwnProperty(i)){
v[i]=walk(i,v[i]);
}
}
}
return _3b3(k,v);
}
_3b4=walk("",_3b4);
}
return _3b4;
}
}
catch(e){
}
return null;
},write:function(_3b8,_3b9){
this.pretty=!!_3b9;
var json=null;
var type=typeof _3b8;
if(this.serialize[type]){
json=this.serialize[type].apply(this,[_3b8]);
}
return json;
},writeIndent:function(){
var _3bc=[];
if(this.pretty){
for(var i=0;i<this.level;++i){
_3bc.push(this.indent);
}
}
return _3bc.join("");
},writeNewline:function(){
return (this.pretty)?this.newline:"";
},writeSpace:function(){
return (this.pretty)?this.space:"";
},serialize:{"object":function(_3be){
if(_3be==null){
return "null";
}
if(_3be.constructor==Date){
return this.serialize.date.apply(this,[_3be]);
}
if(_3be.constructor==Array){
return this.serialize.array.apply(this,[_3be]);
}
var _3bf=["{"];
this.level+=1;
var key,keyJSON,valueJSON;
var _3c1=false;
for(key in _3be){
if(_3be.hasOwnProperty(key)){
keyJSON=OpenLayers.Format.JSON.prototype.write.apply(this,[key,this.pretty]);
valueJSON=OpenLayers.Format.JSON.prototype.write.apply(this,[_3be[key],this.pretty]);
if(keyJSON!=null&&valueJSON!=null){
if(_3c1){
_3bf.push(",");
}
_3bf.push(this.writeNewline(),this.writeIndent(),keyJSON,":",this.writeSpace(),valueJSON);
_3c1=true;
}
}
}
this.level-=1;
_3bf.push(this.writeNewline(),this.writeIndent(),"}");
return _3bf.join("");
},"array":function(_3c2){
var json;
var _3c4=["["];
this.level+=1;
for(var i=0;i<_3c2.length;++i){
json=OpenLayers.Format.JSON.prototype.write.apply(this,[_3c2[i],this.pretty]);
if(json!=null){
if(i>0){
_3c4.push(",");
}
_3c4.push(this.writeNewline(),this.writeIndent(),json);
}
}
this.level-=1;
_3c4.push(this.writeNewline(),this.writeIndent(),"]");
return _3c4.join("");
},"string":function(_3c6){
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
if(/["\\\x00-\x1f]/.test(_3c6)){
return "\""+_3c6.replace(/([\x00-\x1f\\"])/g,function(a,b){
var c=m[b];
if(c){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
})+"\"";
}
return "\""+_3c6+"\"";
},"number":function(_3cb){
return isFinite(_3cb)?String(_3cb):"null";
},"boolean":function(bool){
return String(bool);
},"date":function(date){
function format(_3ce){
return (_3ce<10)?"0"+_3ce:_3ce;
}
return "\""+date.getFullYear()+"-"+format(date.getMonth()+1)+"-"+format(date.getDate())+"T"+format(date.getHours())+":"+format(date.getMinutes())+":"+format(date.getSeconds())+"\"";
}},CLASS_NAME:"OpenLayers.Format.JSON"});
OpenLayers.Format.XML=OpenLayers.Class(OpenLayers.Format,{xmldom:null,initialize:function(_3cf){
if(window.ActiveXObject){
this.xmldom=new ActiveXObject("Microsoft.XMLDOM");
}
OpenLayers.Format.prototype.initialize.apply(this,[_3cf]);
},read:function(text){
var _3d1=text.indexOf("<");
if(_3d1>0){
text=text.substring(_3d1);
}
var node=OpenLayers.Util.Try(OpenLayers.Function.bind((function(){
var _3d3;
if(window.ActiveXObject&&!this.xmldom){
_3d3=new ActiveXObject("Microsoft.XMLDOM");
}else{
_3d3=this.xmldom;
}
_3d3.loadXML(text);
return _3d3;
}),this),function(){
return new DOMParser().parseFromString(text,"text/xml");
},function(){
var req=new XMLHttpRequest();
req.open("GET","data:"+"text/xml"+";charset=utf-8,"+encodeURIComponent(text),false);
if(req.overrideMimeType){
req.overrideMimeType("text/xml");
}
req.send(null);
return req.responseXML;
});
return node;
},write:function(node){
var data;
if(this.xmldom){
data=node.xml;
}else{
var _3d7=new XMLSerializer();
data=_3d7.serializeToString(node);
}
return data;
},createElementNS:function(uri,name){
var _3da;
if(this.xmldom){
_3da=this.xmldom.createNode(1,name,uri);
}else{
_3da=document.createElementNS(uri,name);
}
return _3da;
},createTextNode:function(text){
var node;
if(this.xmldom){
node=this.xmldom.createTextNode(text);
}else{
node=document.createTextNode(text);
}
return node;
},getElementsByTagNameNS:function(node,uri,name){
var _3e0=[];
if(node.getElementsByTagNameNS){
_3e0=node.getElementsByTagNameNS(uri,name);
}else{
var _3e1=node.getElementsByTagName("*");
var _3e2,fullName;
for(var i=0;i<_3e1.length;++i){
_3e2=_3e1[i];
fullName=(_3e2.prefix)?(_3e2.prefix+":"+name):name;
if((name=="*")||(fullName==_3e2.nodeName)){
if((uri=="*")||(uri==_3e2.namespaceURI)){
_3e0.push(_3e2);
}
}
}
}
return _3e0;
},getAttributeNodeNS:function(node,uri,name){
var _3e7=null;
if(node.getAttributeNodeNS){
_3e7=node.getAttributeNodeNS(uri,name);
}else{
var _3e8=node.attributes;
var _3e9,fullName;
for(var i=0;i<_3e8.length;++i){
_3e9=_3e8[i];
if(_3e9.namespaceURI==uri){
fullName=(_3e9.prefix)?(_3e9.prefix+":"+name):name;
if(fullName==_3e9.nodeName){
_3e7=_3e9;
break;
}
}
}
}
return _3e7;
},getAttributeNS:function(node,uri,name){
var _3ee="";
if(node.getAttributeNS){
_3ee=node.getAttributeNS(uri,name);
}else{
var _3ef=this.getAttributeNodeNS(node,uri,name);
if(_3ef){
_3ee=_3ef.nodeValue;
}
}
return _3ee;
},getChildValue:function(node,def){
var _3f2;
try{
_3f2=node.firstChild.nodeValue;
}
catch(e){
_3f2=(def!=undefined)?def:"";
}
return _3f2;
},concatChildValues:function(node,def){
var _3f5="";
var _3f6=node.firstChild;
var _3f7;
while(_3f6){
_3f7=_3f6.nodeValue;
if(_3f7){
_3f5+=_3f7;
}
_3f6=_3f6.nextSibling;
}
if(_3f5==""&&def!=undefined){
_3f5=def;
}
return _3f5;
},hasAttributeNS:function(node,uri,name){
var _3fb=false;
if(node.hasAttributeNS){
_3fb=node.hasAttributeNS(uri,name);
}else{
_3fb=!!this.getAttributeNodeNS(node,uri,name);
}
return _3fb;
},CLASS_NAME:"OpenLayers.Format.XML"});
OpenLayers.Handler=OpenLayers.Class({id:null,control:null,map:null,keyMask:null,active:false,evt:null,initialize:function(_3fc,_3fd,_3fe){
OpenLayers.Util.extend(this,_3fe);
this.control=_3fc;
this.callbacks=_3fd;
if(_3fc.map){
this.setMap(_3fc.map);
}
OpenLayers.Util.extend(this,_3fe);
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},setMap:function(map){
this.map=map;
},checkModifiers:function(evt){
if(this.keyMask==null){
return true;
}
var _401=(evt.shiftKey?OpenLayers.Handler.MOD_SHIFT:0)|(evt.ctrlKey?OpenLayers.Handler.MOD_CTRL:0)|(evt.altKey?OpenLayers.Handler.MOD_ALT:0);
return (_401==this.keyMask);
},activate:function(){
if(this.active){
return false;
}
var _402=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_402.length;i++){
if(this[_402[i]]){
this.register(_402[i],this[_402[i]]);
}
}
this.active=true;
return true;
},deactivate:function(){
if(!this.active){
return false;
}
var _404=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_404.length;i++){
if(this[_404[i]]){
this.unregister(_404[i],this[_404[i]]);
}
}
this.active=false;
return true;
},callback:function(name,args){
if(this.callbacks[name]){
this.callbacks[name].apply(this.control,args);
}
},register:function(name,_409){
this.map.events.registerPriority(name,this,_409);
this.map.events.registerPriority(name,this,this.setEvent);
},unregister:function(name,_40b){
this.map.events.unregister(name,this,_40b);
this.map.events.unregister(name,this,this.setEvent);
},setEvent:function(evt){
this.evt=evt;
return true;
},destroy:function(){
this.deactivate();
this.control=this.map=null;
},CLASS_NAME:"OpenLayers.Handler"});
OpenLayers.Handler.MOD_NONE=0;
OpenLayers.Handler.MOD_SHIFT=1;
OpenLayers.Handler.MOD_CTRL=2;
OpenLayers.Handler.MOD_ALT=4;
OpenLayers.Map=OpenLayers.Class({Z_INDEX_BASE:{BaseLayer:100,Overlay:325,Popup:750,Control:1000},EVENT_TYPES:["addlayer","removelayer","changelayer","movestart","move","moveend","zoomend","popupopen","popupclose","addmarker","removemarker","clearmarkers","mouseover","mouseout","mousemove","dragstart","drag","dragend","changebaselayer"],id:null,events:null,div:null,size:null,viewPortDiv:null,layerContainerOrigin:null,layerContainerDiv:null,layers:null,controls:null,popups:null,baseLayer:null,center:null,zoom:0,viewRequestID:0,tileSize:null,projection:"EPSG:4326",units:"degrees",resolutions:null,maxResolution:1.40625,minResolution:null,maxScale:null,minScale:null,maxExtent:null,minExtent:null,restrictedExtent:null,numZoomLevels:16,theme:null,fallThrough:false,initialize:function(div,_40e){
this.setOptions(_40e);
this.id=OpenLayers.Util.createUniqueID("OpenLayers.Map_");
this.div=OpenLayers.Util.getElement(div);
var id=this.div.id+"_OpenLayers_ViewPort";
this.viewPortDiv=OpenLayers.Util.createDiv(id,null,null,null,"relative",null,"hidden");
this.viewPortDiv.style.width="100%";
this.viewPortDiv.style.height="100%";
this.viewPortDiv.className="olMapViewport";
this.div.appendChild(this.viewPortDiv);
id=this.div.id+"_OpenLayers_Container";
this.layerContainerDiv=OpenLayers.Util.createDiv(id);
this.layerContainerDiv.style.zIndex=this.Z_INDEX_BASE["Popup"]-1;
this.viewPortDiv.appendChild(this.layerContainerDiv);
this.events=new OpenLayers.Events(this,this.div,this.EVENT_TYPES,this.fallThrough);
this.updateSize();
this.events.register("movestart",this,this.updateSize);
if(OpenLayers.String.contains(navigator.appName,"Microsoft")){
this.events.register("resize",this,this.updateSize);
}else{
OpenLayers.Event.observe(window,"resize",OpenLayers.Function.bind(this.updateSize,this));
}
if(this.theme){
var _410=true;
var _411=document.getElementsByTagName("link");
for(var i=0;i<_411.length;++i){
if(OpenLayers.Util.isEquivalentUrl(_411.item(i).href,this.theme)){
_410=false;
break;
}
}
if(_410){
var _413=document.createElement("link");
_413.setAttribute("rel","stylesheet");
_413.setAttribute("type","text/css");
_413.setAttribute("href",this.theme);
document.getElementsByTagName("head")[0].appendChild(_413);
}
}
this.layers=[];
if(this.controls==null){
if(OpenLayers.Control!=null){
this.controls=[new OpenLayers.Control.Navigation(),new OpenLayers.Control.PanZoom(),new OpenLayers.Control.ArgParser(),new OpenLayers.Control.Attribution()];
}else{
this.controls=[];
}
}
for(var i=0;i<this.controls.length;i++){
this.addControlToMap(this.controls[i]);
}
this.popups=[];
this.unloadDestroy=OpenLayers.Function.bind(this.destroy,this);
OpenLayers.Event.observe(window,"unload",this.unloadDestroy);
},unloadDestroy:null,destroy:function(){
if(!this.unloadDestroy){
return false;
}
OpenLayers.Event.stopObserving(window,"unload",this.unloadDestroy);
this.unloadDestroy=null;
if(this.layers!=null){
for(var i=this.layers.length-1;i>=0;--i){
this.layers[i].destroy(false);
}
this.layers=null;
}
if(this.controls!=null){
for(var i=this.controls.length-1;i>=0;--i){
this.controls[i].destroy();
}
this.controls=null;
}
if(this.viewPortDiv){
this.div.removeChild(this.viewPortDiv);
}
this.viewPortDiv=null;
this.events.destroy();
this.events=null;
},setOptions:function(_415){
this.tileSize=new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,OpenLayers.Map.TILE_HEIGHT);
this.maxExtent=new OpenLayers.Bounds(-180,-90,180,90);
this.theme=OpenLayers._getScriptLocation()+"theme/default/style.css";
OpenLayers.Util.extend(this,_415);
},getTileSize:function(){
return this.tileSize;
},getLayer:function(id){
var _417=null;
for(var i=0;i<this.layers.length;i++){
var _419=this.layers[i];
if(_419.id==id){
_417=_419;
}
}
return _417;
},setLayerZIndex:function(_41a,zIdx){
_41a.setZIndex(this.Z_INDEX_BASE[_41a.isBaseLayer?"BaseLayer":"Overlay"]+zIdx*5);
},addLayer:function(_41c){
for(var i=0;i<this.layers.length;i++){
if(this.layers[i]==_41c){
var msg="You tried to add the layer: "+_41c.name+" to the map, but it has already been added";
OpenLayers.Console.warn(msg);
return false;
}
}
_41c.div.style.overflow="";
this.setLayerZIndex(_41c,this.layers.length);
if(_41c.isFixed){
this.viewPortDiv.appendChild(_41c.div);
}else{
this.layerContainerDiv.appendChild(_41c.div);
}
this.layers.push(_41c);
_41c.setMap(this);
if(_41c.isBaseLayer){
if(this.baseLayer==null){
this.setBaseLayer(_41c);
}else{
_41c.setVisibility(false);
}
}else{
_41c.redraw();
}
this.events.triggerEvent("addlayer");
},addLayers:function(_41f){
for(var i=0;i<_41f.length;i++){
this.addLayer(_41f[i]);
}
},removeLayer:function(_421,_422){
if(_422==null){
_422=true;
}
if(_421.isFixed){
this.viewPortDiv.removeChild(_421.div);
}else{
this.layerContainerDiv.removeChild(_421.div);
}
OpenLayers.Util.removeItem(this.layers,_421);
_421.removeMap(this);
_421.map=null;
if(_422&&(this.baseLayer==_421)){
this.baseLayer=null;
for(i=0;i<this.layers.length;i++){
var _423=this.layers[i];
if(_423.isBaseLayer){
this.setBaseLayer(_423);
break;
}
}
}
this.events.triggerEvent("removelayer");
},getNumLayers:function(){
return this.layers.length;
},getLayerIndex:function(_424){
return OpenLayers.Util.indexOf(this.layers,_424);
},setLayerIndex:function(_425,idx){
var base=this.getLayerIndex(_425);
if(idx<0){
idx=0;
}else{
if(idx>this.layers.length){
idx=this.layers.length;
}
}
if(base!=idx){
this.layers.splice(base,1);
this.layers.splice(idx,0,_425);
for(var i=0;i<this.layers.length;i++){
this.setLayerZIndex(this.layers[i],i);
}
this.events.triggerEvent("changelayer");
}
},raiseLayer:function(_429,_42a){
var idx=this.getLayerIndex(_429)+_42a;
this.setLayerIndex(_429,idx);
},setBaseLayer:function(_42c){
var _42d=null;
if(this.baseLayer){
_42d=this.baseLayer.getExtent();
}
if(_42c!=this.baseLayer){
if(OpenLayers.Util.indexOf(this.layers,_42c)!=-1){
if(this.baseLayer!=null){
this.baseLayer.setVisibility(false);
}
this.baseLayer=_42c;
this.viewRequestID++;
this.baseLayer.visibility=true;
var _42e=this.getCenter();
if(_42e!=null){
if(_42d==null){
this.setCenter(_42e,this.getZoom(),false,true);
}else{
this.setCenter(_42d.getCenterLonLat(),this.getZoomForExtent(_42d,true),false,true);
}
}
this.events.triggerEvent("changebaselayer");
}
}
},addControl:function(_42f,px){
this.controls.push(_42f);
this.addControlToMap(_42f,px);
},addControlToMap:function(_431,px){
_431.outsideViewport=(_431.div!=null);
_431.setMap(this);
var div=_431.draw(px);
if(div){
if(!_431.outsideViewport){
div.style.zIndex=this.Z_INDEX_BASE["Control"]+this.controls.length;
this.viewPortDiv.appendChild(div);
}
}
},getControl:function(id){
var _435=null;
for(var i=0;i<this.controls.length;i++){
var _437=this.controls[i];
if(_437.id==id){
_435=_437;
break;
}
}
return _435;
},removeControl:function(_438){
if((_438)&&(_438==this.getControl(_438.id))){
if(!_438.outsideViewport){
this.viewPortDiv.removeChild(_438.div);
}
OpenLayers.Util.removeItem(this.controls,_438);
}
},addPopup:function(_439,_43a){
if(_43a){
for(var i=0;i<this.popups.length;i++){
this.removePopup(this.popups[i]);
}
}
_439.map=this;
this.popups.push(_439);
var _43c=_439.draw();
if(_43c){
_43c.style.zIndex=this.Z_INDEX_BASE["Popup"]+this.popups.length;
this.layerContainerDiv.appendChild(_43c);
}
},removePopup:function(_43d){
OpenLayers.Util.removeItem(this.popups,_43d);
if(_43d.div){
try{
this.layerContainerDiv.removeChild(_43d.div);
}
catch(e){
}
}
_43d.map=null;
},getSize:function(){
var size=null;
if(this.size!=null){
size=this.size.clone();
}
return size;
},updateSize:function(){
this.events.element.offsets=null;
var _43f=this.getCurrentSize();
var _440=this.getSize();
if(_440==null){
this.size=_440=_43f;
}
if(!_43f.equals(_440)){
this.size=_43f;
for(var i=0;i<this.layers.length;i++){
this.layers[i].onMapResize();
}
if(this.baseLayer!=null){
var _442=new OpenLayers.Pixel(_43f.w/2,_43f.h/2);
var _443=this.getLonLatFromViewPortPx(_442);
var zoom=this.getZoom();
this.zoom=null;
this.setCenter(this.getCenter(),zoom);
}
}
},getCurrentSize:function(){
var size=new OpenLayers.Size(this.div.clientWidth,this.div.clientHeight);
if(size.w==0&&size.h==0||isNaN(size.w)&&isNaN(size.h)){
var dim=OpenLayers.Element.getDimensions(this.div);
size.w=dim.width;
size.h=dim.height;
}
if(size.w==0&&size.h==0||isNaN(size.w)&&isNaN(size.h)){
size.w=parseInt(this.div.style.width);
size.h=parseInt(this.div.style.height);
}
return size;
},calculateBounds:function(_447,_448){
var _449=null;
if(_447==null){
_447=this.getCenter();
}
if(_448==null){
_448=this.getResolution();
}
if((_447!=null)&&(_448!=null)){
var size=this.getSize();
var _44b=size.w*_448;
var _44c=size.h*_448;
_449=new OpenLayers.Bounds(_447.lon-_44b/2,_447.lat-_44c/2,_447.lon+_44b/2,_447.lat+_44c/2);
}
return _449;
},getCenter:function(){
return this.center;
},getZoom:function(){
return this.zoom;
},pan:function(dx,dy){
var _44f=this.getViewPortPxFromLonLat(this.getCenter());
var _450=_44f.add(dx,dy);
if(!_450.equals(_44f)){
var _451=this.getLonLatFromViewPortPx(_450);
this.setCenter(_451);
}
},setCenter:function(_452,zoom,_454,_455){
if(!this.center&&!this.isValidLonLat(_452)){
_452=this.maxExtent.getCenterLonLat();
}
if(this.restrictedExtent!=null){
if(_452==null){
_452=this.getCenter();
}
if(zoom==null){
zoom=this.getZoom();
}
var _456=null;
if(this.baseLayer!=null){
_456=this.baseLayer.resolutions[zoom];
}
var _457=this.calculateBounds(_452,_456);
if(!this.restrictedExtent.containsBounds(_457)){
var _458=this.restrictedExtent.getCenterLonLat();
if(_457.getWidth()>this.restrictedExtent.getWidth()){
_452=new OpenLayers.LonLat(_458.lon,_452.lat);
}else{
if(_457.left<this.restrictedExtent.left){
_452=_452.add(this.restrictedExtent.left-_457.left,0);
}else{
if(_457.right>this.restrictedExtent.right){
_452=_452.add(this.restrictedExtent.right-_457.right,0);
}
}
}
if(_457.getHeight()>this.restrictedExtent.getHeight()){
_452=new OpenLayers.LonLat(_452.lon,_458.lat);
}else{
if(_457.bottom<this.restrictedExtent.bottom){
_452=_452.add(0,this.restrictedExtent.bottom-_457.bottom);
}else{
if(_457.top>this.restrictedExtent.top){
_452=_452.add(0,this.restrictedExtent.top-_457.top);
}
}
}
}
}
var _459=_455||((this.isValidZoomLevel(zoom))&&(zoom!=this.getZoom()));
var _45a=(this.isValidLonLat(_452))&&(!_452.equals(this.center));
if(_459||_45a||!_454){
if(!_454){
this.events.triggerEvent("movestart");
}
if(_45a){
if((!_459)&&(this.center)){
this.centerLayerContainer(_452);
}
this.center=_452.clone();
}
if((_459)||(this.layerContainerOrigin==null)){
this.layerContainerOrigin=this.center.clone();
this.layerContainerDiv.style.left="0px";
this.layerContainerDiv.style.top="0px";
}
if(_459){
this.zoom=zoom;
this.viewRequestID++;
}
var _45b=this.getExtent();
this.baseLayer.moveTo(_45b,_459,_454);
_45b=this.baseLayer.getExtent();
for(var i=0;i<this.layers.length;i++){
var _45d=this.layers[i];
if(!_45d.isBaseLayer){
var _45e;
var _45f=_45d.calculateInRange();
if(_45d.inRange!=_45f){
_45d.inRange=_45f;
_45e=true;
this.events.triggerEvent("changelayer");
}else{
_45e=(_45d.visibility&&_45d.inRange);
}
if(_45e){
_45d.moveTo(_45b,_459,_454);
}
}
}
if(_459){
for(var i=0;i<this.popups.length;i++){
this.popups[i].updatePosition();
}
}
this.events.triggerEvent("move");
if(_459){
this.events.triggerEvent("zoomend");
}
}
if(!_454){
this.events.triggerEvent("moveend");
}
},centerLayerContainer:function(_460){
var _461=this.getViewPortPxFromLonLat(this.layerContainerOrigin);
var _462=this.getViewPortPxFromLonLat(_460);
if((_461!=null)&&(_462!=null)){
this.layerContainerDiv.style.left=(_461.x-_462.x)+"px";
this.layerContainerDiv.style.top=(_461.y-_462.y)+"px";
}
},isValidZoomLevel:function(_463){
return ((_463!=null)&&(_463>=0)&&(_463<this.getNumZoomLevels()));
},isValidLonLat:function(_464){
var _465=false;
if(_464!=null){
var _466=this.getMaxExtent();
_465=_466.containsLonLat(_464);
}
return _465;
},getProjection:function(){
var _467=null;
if(this.baseLayer!=null){
_467=this.baseLayer.projection;
}
return _467;
},getMaxResolution:function(){
var _468=null;
if(this.baseLayer!=null){
_468=this.baseLayer.maxResolution;
}
return _468;
},getMaxExtent:function(){
var _469=null;
if(this.baseLayer!=null){
_469=this.baseLayer.maxExtent;
}
return _469;
},getNumZoomLevels:function(){
var _46a=null;
if(this.baseLayer!=null){
_46a=this.baseLayer.numZoomLevels;
}
return _46a;
},getExtent:function(){
var _46b=null;
if(this.baseLayer!=null){
_46b=this.baseLayer.getExtent();
}
return _46b;
},getResolution:function(){
var _46c=null;
if(this.baseLayer!=null){
_46c=this.baseLayer.getResolution();
}
return _46c;
},getScale:function(){
var _46d=null;
if(this.baseLayer!=null){
var res=this.getResolution();
var _46f=this.baseLayer.units;
_46d=OpenLayers.Util.getScaleFromResolution(res,_46f);
}
return _46d;
},getZoomForExtent:function(_470,_471){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForExtent(_470,_471);
}
return zoom;
},getZoomForResolution:function(_473,_474){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForResolution(_473,_474);
}
return zoom;
},zoomTo:function(zoom){
if(this.isValidZoomLevel(zoom)){
this.setCenter(null,zoom);
}
},zoomIn:function(){
this.zoomTo(this.getZoom()+1);
},zoomOut:function(){
this.zoomTo(this.getZoom()-1);
},zoomToExtent:function(_477){
var _478=_477.getCenterLonLat();
if(this.baseLayer.wrapDateLine){
var _479=this.getMaxExtent();
_477=_477.clone();
while(_477.right<_477.left){
_477.right+=_479.getWidth();
}
_478=_477.getCenterLonLat().wrapDateLine(_479);
}
this.setCenter(_478,this.getZoomForExtent(_477));
},zoomToMaxExtent:function(){
this.zoomToExtent(this.getMaxExtent());
},zoomToScale:function(_47a){
var res=OpenLayers.Util.getResolutionFromScale(_47a,this.baseLayer.units);
var size=this.getSize();
var _47d=size.w*res;
var _47e=size.h*res;
var _47f=this.getCenter();
var _480=new OpenLayers.Bounds(_47f.lon-_47d/2,_47f.lat-_47e/2,_47f.lon+_47d/2,_47f.lat+_47e/2);
this.zoomToExtent(_480);
},getLonLatFromViewPortPx:function(_481){
var _482=null;
if(this.baseLayer!=null){
_482=this.baseLayer.getLonLatFromViewPortPx(_481);
}
return _482;
},getViewPortPxFromLonLat:function(_483){
var px=null;
if(this.baseLayer!=null){
px=this.baseLayer.getViewPortPxFromLonLat(_483);
}
return px;
},getLonLatFromPixel:function(px){
return this.getLonLatFromViewPortPx(px);
},getPixelFromLonLat:function(_486){
return this.getViewPortPxFromLonLat(_486);
},getViewPortPxFromLayerPx:function(_487){
var _488=null;
if(_487!=null){
var dX=parseInt(this.layerContainerDiv.style.left);
var dY=parseInt(this.layerContainerDiv.style.top);
_488=_487.add(dX,dY);
}
return _488;
},getLayerPxFromViewPortPx:function(_48b){
var _48c=null;
if(_48b!=null){
var dX=-parseInt(this.layerContainerDiv.style.left);
var dY=-parseInt(this.layerContainerDiv.style.top);
_48c=_48b.add(dX,dY);
if(isNaN(_48c.x)||isNaN(_48c.y)){
_48c=null;
}
}
return _48c;
},getLonLatFromLayerPx:function(px){
px=this.getViewPortPxFromLayerPx(px);
return this.getLonLatFromViewPortPx(px);
},getLayerPxFromLonLat:function(_490){
var px=this.getViewPortPxFromLonLat(_490);
return this.getLayerPxFromViewPortPx(px);
},CLASS_NAME:"OpenLayers.Map"});
OpenLayers.Map.TILE_WIDTH=256;
OpenLayers.Map.TILE_HEIGHT=256;
OpenLayers.Marker=OpenLayers.Class({icon:null,lonlat:null,events:null,map:null,initialize:function(_492,icon){
this.lonlat=_492;
var _494=(icon)?icon:OpenLayers.Marker.defaultIcon();
if(this.icon==null){
this.icon=_494;
}else{
this.icon.url=_494.url;
this.icon.size=_494.size;
this.icon.offset=_494.offset;
this.icon.calculateOffset=_494.calculateOffset;
}
this.events=new OpenLayers.Events(this,this.icon.imageDiv,null);
},destroy:function(){
this.map=null;
this.events.destroy();
this.events=null;
if(this.icon!=null){
this.icon.destroy();
this.icon=null;
}
},draw:function(px){
return this.icon.draw(px);
},moveTo:function(px){
if((px!=null)&&(this.icon!=null)){
this.icon.moveTo(px);
}
this.lonlat=this.map.getLonLatFromLayerPx(px);
},onScreen:function(){
var _497=false;
if(this.map){
var _498=this.map.getExtent();
_497=_498.containsLonLat(this.lonlat);
}
return _497;
},inflate:function(_499){
if(this.icon){
var _49a=new OpenLayers.Size(this.icon.size.w*_499,this.icon.size.h*_499);
this.icon.setSize(_49a);
}
},setOpacity:function(_49b){
this.icon.setOpacity(_49b);
},display:function(_49c){
this.icon.display(_49c);
},CLASS_NAME:"OpenLayers.Marker"});
OpenLayers.Marker.defaultIcon=function(){
var url=OpenLayers.Util.getImagesLocation()+"marker.png";
var size=new OpenLayers.Size(21,25);
var _49f=function(size){
return new OpenLayers.Pixel(-(size.w/2),-size.h);
};
return new OpenLayers.Icon(url,size,null,_49f);
};
OpenLayers.Popup.AnchoredBubble=OpenLayers.Class(OpenLayers.Popup.Anchored,{rounded:false,initialize:function(id,_4a2,size,_4a4,_4a5,_4a6){
OpenLayers.Popup.Anchored.prototype.initialize.apply(this,arguments);
},draw:function(px){
OpenLayers.Popup.Anchored.prototype.draw.apply(this,arguments);
this.setContentHTML();
this.setBackgroundColor();
this.setOpacity();
return this.div;
},moveTo:function(px){
OpenLayers.Popup.Anchored.prototype.moveTo.apply(this,arguments);
this.setRicoCorners(!this.rounded);
this.rounded=true;
},setSize:function(size){
OpenLayers.Popup.Anchored.prototype.setSize.apply(this,arguments);
if(this.contentDiv!=null){
var _4aa=this.size.clone();
_4aa.h-=(2*OpenLayers.Popup.AnchoredBubble.CORNER_SIZE);
_4aa.h-=(2*this.padding);
this.contentDiv.style.height=_4aa.h+"px";
this.contentDiv.style.width=_4aa.w+"px";
if(this.map){
this.setRicoCorners(!this.rounded);
this.rounded=true;
}
}
},setBackgroundColor:function(_4ab){
if(_4ab!=undefined){
this.backgroundColor=_4ab;
}
if(this.div!=null){
if(this.contentDiv!=null){
this.div.style.background="transparent";
OpenLayers.Rico.Corner.changeColor(this.contentDiv,this.backgroundColor);
}
}
},setOpacity:function(_4ac){
if(_4ac!=undefined){
this.opacity=_4ac;
}
if(this.div!=null){
if(this.contentDiv!=null){
OpenLayers.Rico.Corner.changeOpacity(this.contentDiv,this.opacity);
}
}
},setBorder:function(_4ad){
this.border=0;
},setRicoCorners:function(_4ae){
var _4af=this.getCornersToRound(this.relativePosition);
var _4b0={corners:_4af,color:this.backgroundColor,bgColor:"transparent",blend:false};
if(_4ae){
OpenLayers.Rico.Corner.round(this.div,_4b0);
}else{
OpenLayers.Rico.Corner.reRound(this.groupDiv,_4b0);
this.setBackgroundColor();
this.setOpacity();
}
},getCornersToRound:function(){
var _4b1=["tl","tr","bl","br"];
var _4b2=OpenLayers.Bounds.oppositeQuadrant(this.relativePosition);
OpenLayers.Util.removeItem(_4b1,_4b2);
return _4b1.join(" ");
},CLASS_NAME:"OpenLayers.Popup.AnchoredBubble"});
OpenLayers.Popup.AnchoredBubble.CORNER_SIZE=5;
OpenLayers.Renderer.SVG=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"http://www.w3.org/2000/svg",maxPixel:15000,localResolution:null,initialize:function(_4b3){
if(!this.supported()){
return;
}
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _4b4="http://www.w3.org/TR/SVG11/feature#SVG";
var _4b5=(document.implementation&&(document.implementation.hasFeature("org.w3c.svg","1.0")||document.implementation.hasFeature(_4b4,"1.1")));
return _4b5;
},setExtent:function(_4b6){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _4b7=this.getResolution();
if(!this.localResolution||_4b7!=this.localResolution){
this.left=-_4b6.left/_4b7;
this.top=_4b6.top/_4b7;
}
var left=0;
var top=0;
if(this.localResolution&&_4b7==this.localResolution){
left=(this.left)-(-_4b6.left/_4b7);
top=(this.top)-(_4b6.top/_4b7);
}
this.localResolution=_4b7;
var _4ba=left+" "+top+" "+_4b6.getWidth()/_4b7+" "+_4b6.getHeight()/_4b7;
this.rendererRoot.setAttributeNS(null,"viewBox",_4ba);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.setAttributeNS(null,"width",this.size.w);
this.rendererRoot.setAttributeNS(null,"height",this.size.h);
},getNodeType:function(_4bc){
var _4bd=null;
switch(_4bc.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_4bd="circle";
break;
case "OpenLayers.Geometry.Rectangle":
_4bd="rect";
break;
case "OpenLayers.Geometry.LineString":
_4bd="polyline";
break;
case "OpenLayers.Geometry.LinearRing":
_4bd="polygon";
break;
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_4bd="path";
break;
default:
break;
}
return _4bd;
},setStyle:function(node,_4bf,_4c0){
_4bf=_4bf||node._style;
_4c0=_4c0||node._options;
if(node._geometryClass=="OpenLayers.Geometry.Point"){
if(_4bf.externalGraphic){
var id=node.getAttributeNS(null,"id");
var x=parseFloat(node.getAttributeNS(null,"cx"));
var y=parseFloat(node.getAttributeNS(null,"cy"));
var _4c4=node._featureId;
var _4c5=node._geometryClass;
var _4c6=node._style;
this.root.removeChild(node);
var node=this.createNode("image",id);
node._featureId=_4c4;
node._geometryClass=_4c5;
node._style=_4c6;
this.root.appendChild(node);
if(_4bf.graphicWidth&&_4bf.graphicHeight){
node.setAttributeNS(null,"preserveAspectRatio","none");
}
var _4c7=_4bf.graphicWidth||_4bf.graphicHeight;
var _4c8=_4bf.graphicHeight||_4bf.graphicWidth;
_4c7=_4c7?_4c7:_4bf.pointRadius*2;
_4c8=_4c8?_4c8:_4bf.pointRadius*2;
var _4c9=(_4bf.graphicXOffset!=undefined)?_4bf.graphicXOffset:-(0.5*_4c7);
var _4ca=(_4bf.graphicYOffset!=undefined)?_4bf.graphicYOffset:-(0.5*_4c8);
var _4cb=_4bf.graphicOpacity||_4bf.fillOpacity;
node.setAttributeNS(null,"x",(x+_4c9).toFixed());
node.setAttributeNS(null,"y",(-y+_4ca).toFixed());
node.setAttributeNS(null,"width",_4c7);
node.setAttributeNS(null,"height",_4c8);
node.setAttributeNS("http://www.w3.org/1999/xlink","href",_4bf.externalGraphic);
node.setAttributeNS(null,"transform","scale(1,-1)");
node.setAttributeNS(null,"style","opacity: "+_4cb);
}else{
node.setAttributeNS(null,"r",_4bf.pointRadius);
}
}
if(_4c0.isFilled){
node.setAttributeNS(null,"fill",_4bf.fillColor);
node.setAttributeNS(null,"fill-opacity",_4bf.fillOpacity);
}else{
node.setAttributeNS(null,"fill","none");
}
if(_4c0.isStroked){
node.setAttributeNS(null,"stroke",_4bf.strokeColor);
node.setAttributeNS(null,"stroke-opacity",_4bf.strokeOpacity);
node.setAttributeNS(null,"stroke-width",_4bf.strokeWidth);
node.setAttributeNS(null,"stroke-linecap",_4bf.strokeLinecap);
}else{
node.setAttributeNS(null,"stroke","none");
}
if(_4bf.pointerEvents){
node.setAttributeNS(null,"pointer-events",_4bf.pointerEvents);
}
if(_4bf.cursor){
node.setAttributeNS(null,"cursor",_4bf.cursor);
}
},createNode:function(type,id){
var node=document.createElementNS(this.xmlns,type);
if(id){
node.setAttributeNS(null,"id",id);
}
return node;
},nodeTypeCompare:function(node,type){
return (type==node.nodeName);
},createRenderRoot:function(){
var id=this.container.id+"_svgRoot";
var _4d2=this.nodeFactory(id,"svg");
return _4d2;
},createRoot:function(){
var id=this.container.id+"_root";
var root=this.nodeFactory(id,"g");
root.setAttributeNS(null,"transform","scale(1, -1)");
return root;
},drawPoint:function(node,_4d6){
this.drawCircle(node,_4d6,1);
},drawCircle:function(node,_4d8,_4d9){
var _4da=this.getResolution();
var x=(_4d8.x/_4da+this.left);
var y=(_4d8.y/_4da-this.top);
var draw=true;
if(x<-this.maxPixel||x>this.maxPixel){
draw=false;
}
if(y<-this.maxPixel||y>this.maxPixel){
draw=false;
}
if(draw){
node.setAttributeNS(null,"cx",x);
node.setAttributeNS(null,"cy",y);
node.setAttributeNS(null,"r",_4d9);
}else{
this.root.removeChild(node);
}
},drawLineString:function(node,_4df){
node.setAttributeNS(null,"points",this.getComponentsString(_4df.components));
},drawLinearRing:function(node,_4e1){
node.setAttributeNS(null,"points",this.getComponentsString(_4e1.components));
},drawPolygon:function(node,_4e3){
var d="";
var draw=true;
for(var j=0;j<_4e3.components.length;j++){
var _4e7=_4e3.components[j];
d+=" M";
for(var i=0;i<_4e7.components.length;i++){
var _4e9=this.getShortString(_4e7.components[i]);
if(_4e9){
d+=" "+_4e9;
}else{
draw=false;
}
}
}
d+=" z";
if(draw){
node.setAttributeNS(null,"d",d);
node.setAttributeNS(null,"fill-rule","evenodd");
}else{
node.setAttributeNS(null,"d","");
}
},drawRectangle:function(node,_4eb){
var x=(_4eb.x/resolution+this.left);
var y=(_4eb.y/resolution-this.top);
var draw=true;
if(x<-this.maxPixel||x>this.maxPixel){
draw=false;
}
if(y<-this.maxPixel||y>this.maxPixel){
draw=false;
}
if(draw){
node.setAttributeNS(null,"x",x);
node.setAttributeNS(null,"y",y);
node.setAttributeNS(null,"width",_4eb.width);
node.setAttributeNS(null,"height",_4eb.height);
}else{
node.setAttributeNS(null,"x","");
node.setAttributeNS(null,"y","");
node.setAttributeNS(null,"width",0);
node.setAttributeNS(null,"height",0);
}
},drawCurve:function(node,_4f0){
var d=null;
var draw=true;
for(var i=0;i<_4f0.components.length;i++){
if((i%3)==0&&(i/3)==0){
var _4f4=this.getShortString(_4f0.components[i]);
if(!_4f4){
draw=false;
}
d="M "+_4f4;
}else{
if((i%3)==1){
var _4f4=this.getShortString(_4f0.components[i]);
if(!_4f4){
draw=false;
}
d+=" C "+_4f4;
}else{
var _4f4=this.getShortString(_4f0.components[i]);
if(!_4f4){
draw=false;
}
d+=" "+_4f4;
}
}
}
if(draw){
node.setAttributeNS(null,"d",d);
}else{
node.setAttributeNS(null,"d","");
}
},drawSurface:function(node,_4f6){
var d=null;
var draw=true;
for(var i=0;i<_4f6.components.length;i++){
if((i%3)==0&&(i/3)==0){
var _4fa=this.getShortString(_4f6.components[i]);
if(!_4fa){
draw=false;
}
d="M "+_4fa;
}else{
if((i%3)==1){
var _4fa=this.getShortString(_4f6.components[i]);
if(!_4fa){
draw=false;
}
d+=" C "+_4fa;
}else{
var _4fa=this.getShortString(_4f6.components[i]);
if(!_4fa){
draw=false;
}
d+=" "+_4fa;
}
}
}
d+=" Z";
if(draw){
node.setAttributeNS(null,"d",d);
}else{
node.setAttributeNS(null,"d","");
}
},getComponentsString:function(_4fb){
var _4fc=[];
for(var i=0;i<_4fb.length;i++){
var _4fe=this.getShortString(_4fb[i]);
if(_4fe){
_4fc.push(_4fe);
}
}
return _4fc.join(",");
},getShortString:function(_4ff){
var _500=this.getResolution();
var x=(_4ff.x/_500+this.left);
var y=(_4ff.y/_500-this.top);
if(x<-this.maxPixel||x>this.maxPixel){
return false;
}
if(y<-this.maxPixel||y>this.maxPixel){
return false;
}
var _503=x+","+y;
return _503;
},CLASS_NAME:"OpenLayers.Renderer.SVG"});
OpenLayers.Renderer.VML=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"urn:schemas-microsoft-com:vml",initialize:function(_504){
if(!this.supported()){
return;
}
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
var _505=document.createStyleSheet();
_505.addRule("v\\:*","behavior: url(#default#VML); "+"position: relative; display: inline-block;");
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _506=document.namespaces;
return _506;
},setExtent:function(_507){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _508=this.getResolution();
var org=_507.left/_508+" "+_507.top/_508;
this.root.setAttribute("coordorigin",org);
var size=_507.getWidth()/_508+" "+-_507.getHeight()/_508;
this.root.setAttribute("coordsize",size);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.style.width=this.size.w;
this.rendererRoot.style.height=this.size.h;
this.root.style.width="100%";
this.root.style.height="100%";
},getNodeType:function(_50c){
var _50d=null;
switch(_50c.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_50d="v:oval";
break;
case "OpenLayers.Geometry.Rectangle":
_50d="v:rect";
break;
case "OpenLayers.Geometry.LineString":
case "OpenLayers.Geometry.LinearRing":
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_50d="v:shape";
break;
default:
break;
}
return _50d;
},setStyle:function(node,_50f,_510,_511){
_50f=_50f||node._style;
_510=_510||node._options;
if(node._geometryClass=="OpenLayers.Geometry.Point"){
if(_50f.externalGraphic){
var id=node.id;
var _513=node._featureId;
var _514=node._geometryClass;
var _515=node._style;
this.root.removeChild(node);
var node=this.createNode("v:rect",id);
var fill=this.createNode("v:fill",id+"_image");
node.appendChild(fill);
node._featureId=_513;
node._geometryClass=_514;
node._style=_515;
this.root.appendChild(node);
fill.src=_50f.externalGraphic;
fill.type="frame";
node.style.flip="y";
if(!(_50f.graphicWidth&&_50f.graphicHeight)){
fill.aspect="atmost";
}
var _517=_50f.graphicWidth||_50f.graphicHeight;
var _518=_50f.graphicHeight||_50f.graphicWidth;
_517=_517?_517:_50f.pointRadius*2;
_518=_518?_518:_50f.pointRadius*2;
var _519=this.getResolution();
var _51a=(_50f.graphicXOffset!=undefined)?_50f.graphicXOffset:-(0.5*_517);
var _51b=(_50f.graphicYOffset!=undefined)?_50f.graphicYOffset:-(0.5*_518);
node.style.left=((_511.x/_519)+_51a).toFixed();
node.style.top=((_511.y/_519)-(_51b+_518)).toFixed();
node.style.width=_517;
node.style.height=_518;
_50f.fillColor="none";
_50f.strokeColor="none";
}else{
this.drawCircle(node,_511,_50f.pointRadius);
}
}
var _51c=(_510.isFilled)?_50f.fillColor:"none";
node.setAttribute("fillcolor",_51c);
var _51d=node.getElementsByTagName("fill");
var fill=(_51d.length==0)?null:_51d[0];
if(!_510.isFilled){
if(fill){
node.removeChild(fill);
}
}else{
if(!fill){
fill=this.createNode("v:fill",node.id+"_fill");
node.appendChild(fill);
}
if(node._geometryClass=="OpenLayers.Geometry.Point"&&_50f.externalGraphic&&_50f.graphicOpacity){
fill.setAttribute("opacity",_50f.graphicOpacity);
}else{
if(_50f.fillOpacity){
fill.setAttribute("opacity",_50f.fillOpacity);
}
}
}
var _51e=(_510.isStroked)?_50f.strokeColor:"none";
node.setAttribute("strokecolor",_51e);
node.setAttribute("strokeweight",_50f.strokeWidth);
var _51f=node.getElementsByTagName("stroke");
var _520=(_51f.length==0)?null:_51f[0];
if(!_510.isStroked){
if(_520){
node.removeChild(_520);
}
}else{
if(!_520){
_520=this.createNode("v:stroke",node.id+"_stroke");
node.appendChild(_520);
}
_520.setAttribute("opacity",_50f.strokeOpacity);
_520.setAttribute("endcap",!_50f.strokeLinecap||_50f.strokeLinecap=="butt"?"flat":_50f.strokeLinecap);
}
if(_50f.cursor){
node.style.cursor=_50f.cursor;
}
},setNodeDimension:function(node,_522){
var bbox=_522.getBounds();
if(bbox){
var _524=this.getResolution();
var _525=new OpenLayers.Bounds((bbox.left/_524).toFixed(),(bbox.bottom/_524).toFixed(),(bbox.right/_524).toFixed(),(bbox.top/_524).toFixed());
node.style.left=_525.left;
node.style.top=_525.top;
node.style.width=_525.getWidth();
node.style.height=_525.getHeight();
node.coordorigin=_525.left+" "+_525.top;
node.coordsize=_525.getWidth()+" "+_525.getHeight();
}
},createNode:function(type,id){
var node=document.createElement(type);
if(id){
node.setAttribute("id",id);
}
return node;
},nodeTypeCompare:function(node,type){
var _52b=type;
var _52c=_52b.indexOf(":");
if(_52c!=-1){
_52b=_52b.substr(_52c+1);
}
var _52d=node.nodeName;
_52c=_52d.indexOf(":");
if(_52c!=-1){
_52d=_52d.substr(_52c+1);
}
return (_52b==_52d);
},createRenderRoot:function(){
var id=this.container.id+"_vmlRoot";
var _52f=this.nodeFactory(id,"div");
return _52f;
},createRoot:function(){
var id=this.container.id+"_root";
var root=this.nodeFactory(id,"v:group");
return root;
},drawPoint:function(node,_533){
this.drawCircle(node,_533,1);
},drawCircle:function(node,_535,_536){
if(!isNaN(_535.x)&&!isNaN(_535.y)){
var _537=this.getResolution();
node.style.left=(_535.x/_537).toFixed()-_536;
node.style.top=(_535.y/_537).toFixed()-_536;
var _538=_536*2;
node.style.width=_538;
node.style.height=_538;
}
},drawLineString:function(node,_53a){
this.drawLine(node,_53a,false);
},drawLinearRing:function(node,_53c){
this.drawLine(node,_53c,true);
},drawLine:function(node,_53e,_53f){
this.setNodeDimension(node,_53e);
var _540=this.getResolution();
var path="m";
for(var i=0;i<_53e.components.length;i++){
var x=(_53e.components[i].x/_540);
var y=(_53e.components[i].y/_540);
path+=" "+x.toFixed()+","+y.toFixed()+" l ";
}
if(_53f){
path+=" x";
}
path+=" e";
node.path=path;
},drawPolygon:function(node,_546){
this.setNodeDimension(node,_546);
var _547=this.getResolution();
var path="";
for(var j=0;j<_546.components.length;j++){
var _54a=_546.components[j];
path+="m";
for(var i=0;i<_54a.components.length;i++){
var x=_54a.components[i].x/_547;
var y=_54a.components[i].y/_547;
path+=" "+x.toFixed()+","+y.toFixed();
if(i==0){
path+=" l";
}
}
path+=" x ";
}
path+="e";
node.path=path;
},drawRectangle:function(node,_54f){
var _550=this.getResolution();
node.style.left=_54f.x/_550;
node.style.top=_54f.y/_550;
node.style.width=_54f.width/_550;
node.style.height=_54f.height/_550;
},drawCurve:function(node,_552){
this.setNodeDimension(node,_552);
var _553=this.getResolution();
var path="";
for(var i=0;i<_552.components.length;i++){
var x=_552.components[i].x/_553;
var y=_552.components[i].y/_553;
if((i%3)==0&&(i/3)==0){
path+="m";
}else{
if((i%3)==1){
path+=" c";
}
}
path+=" "+x+","+y;
}
path+=" x e";
node.path=path;
},drawSurface:function(node,_559){
this.setNodeDimension(node,_559);
var _55a=this.getResolution();
var path="";
for(var i=0;i<_559.components.length;i++){
var x=_559.components[i].x/_55a;
var y=_559.components[i].y/_55a;
if((i%3)==0&&(i/3)==0){
path+="m";
}else{
if((i%3)==1){
path+=" c";
}
}
path+=" "+x+","+y;
}
path+=" x e";
node.path=path;
},CLASS_NAME:"OpenLayers.Renderer.VML"});
OpenLayers.Tile.Image=OpenLayers.Class(OpenLayers.Tile,{url:null,imgDiv:null,frame:null,initialize:function(_55f,_560,_561,url,size){
OpenLayers.Tile.prototype.initialize.apply(this,arguments);
this.url=url;
this.frame=document.createElement("div");
this.frame.style.overflow="hidden";
this.frame.style.position="absolute";
},destroy:function(){
if(this.imgDiv!=null){
OpenLayers.Event.stopObservingElement(this.imgDiv.id);
if(this.imgDiv.parentNode==this.frame){
this.frame.removeChild(this.imgDiv);
this.imgDiv.map=null;
}
}
this.imgDiv=null;
if((this.frame!=null)&&(this.frame.parentNode==this.layer.div)){
this.layer.div.removeChild(this.frame);
}
this.frame=null;
OpenLayers.Tile.prototype.destroy.apply(this,arguments);
},draw:function(){
if(this.layer!=this.layer.map.baseLayer&&this.layer.reproject){
this.bounds=this.getBoundsFromBaseLayer(this.position);
}
if(!OpenLayers.Tile.prototype.draw.apply(this,arguments)){
return false;
}
if(this.isLoading){
this.events.triggerEvent("reload");
}else{
this.isLoading=true;
this.events.triggerEvent("loadstart");
}
if(this.imgDiv==null){
this.initImgDiv();
}
this.imgDiv.viewRequestID=this.layer.map.viewRequestID;
this.url=this.layer.getURL(this.bounds);
OpenLayers.Util.modifyDOMElement(this.frame,null,this.position,this.size);
var _564=this.layer.getImageSize();
if(this.layer.alpha){
OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,null,null,_564,this.url);
}else{
this.imgDiv.src=this.url;
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,_564);
}
this.drawn=true;
return true;
},clear:function(){
OpenLayers.Tile.prototype.clear.apply(this,arguments);
if(this.imgDiv){
this.imgDiv.style.display="none";
}
},initImgDiv:function(){
var _565=this.layer.imageOffset;
var size=this.layer.getImageSize();
if(this.layer.alpha){
this.imgDiv=OpenLayers.Util.createAlphaImageDiv(null,_565,size,null,"relative",null,null,null,true);
}else{
this.imgDiv=OpenLayers.Util.createImage(null,_565,size,null,"relative",null,null,true);
}
this.imgDiv.className="olTileImage";
this.frame.appendChild(this.imgDiv);
this.layer.div.appendChild(this.frame);
if(this.layer.opacity!=null){
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,null,null,null,null,this.layer.opacity);
}
this.imgDiv.map=this.layer.map;
var _567=function(){
if(this.isLoading){
this.isLoading=false;
this.events.triggerEvent("loadend");
}
};
OpenLayers.Event.observe(this.imgDiv,"load",OpenLayers.Function.bind(_567,this));
},checkImgURL:function(){
if(this.layer){
var _568=this.layer.alpha?this.imgDiv.firstChild.src:this.imgDiv.src;
if(!OpenLayers.Util.isEquivalentUrl(_568,this.url)){
this.imgDiv.style.display="none";
}
}
},CLASS_NAME:"OpenLayers.Tile.Image"});
OpenLayers.Tile.WFS=OpenLayers.Class(OpenLayers.Tile,{features:null,url:null,initialize:function(_569,_56a,_56b,url,size){
OpenLayers.Tile.prototype.initialize.apply(this,arguments);
this.url=url;
this.features=[];
},destroy:function(){
OpenLayers.Tile.prototype.destroy.apply(this,arguments);
this.destroyAllFeatures();
this.features=null;
this.url=null;
},clear:function(){
OpenLayers.Tile.prototype.clear.apply(this,arguments);
this.destroyAllFeatures();
},draw:function(){
if(OpenLayers.Tile.prototype.draw.apply(this,arguments)){
if(this.isLoading){
this.events.triggerEvent("reload");
}else{
this.isLoading=true;
this.events.triggerEvent("loadstart");
}
this.loadFeaturesForRegion(this.requestSuccess);
}
},loadFeaturesForRegion:function(_56e,_56f){
OpenLayers.loadURL(this.url,null,this,_56e);
},requestSuccess:function(_570){
if(this.features){
var doc=_570.responseXML;
if(!doc||_570.fileType!="XML"){
doc=OpenLayers.parseXMLString(_570.responseText);
}
if(this.layer.vectorMode){
var gml=new OpenLayers.Format.GML({"extractAttributes":this.layer.options.extractAttributes});
this.layer.addFeatures(gml.read(doc));
}else{
var _573=OpenLayers.Ajax.getElementsByTagNameNS(doc,"http://www.opengis.net/gml","gml","featureMember");
this.addResults(_573);
}
}
if(this.events){
this.events.triggerEvent("loadend");
}
},addResults:function(_574){
for(var i=0;i<_574.length;i++){
var _576=new this.layer.featureClass(this.layer,_574[i]);
this.features.push(_576);
}
},destroyAllFeatures:function(){
while(this.features.length>0){
var _577=this.features.shift();
_577.destroy();
}
},CLASS_NAME:"OpenLayers.Tile.WFS"});
OpenLayers.Feature=OpenLayers.Class({layer:null,id:null,lonlat:null,data:null,marker:null,popupClass:OpenLayers.Popup.AnchoredBubble,popup:null,initialize:function(_578,_579,data){
this.layer=_578;
this.lonlat=_579;
this.data=(data!=null)?data:{};
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},destroy:function(){
if((this.layer!=null)&&(this.layer.map!=null)){
if(this.popup!=null){
this.layer.map.removePopup(this.popup);
}
}
this.layer=null;
this.id=null;
this.lonlat=null;
this.data=null;
if(this.marker!=null){
this.destroyMarker(this.marker);
this.marker=null;
}
if(this.popup!=null){
this.destroyPopup(this.popup);
this.popup=null;
}
},onScreen:function(){
var _57b=false;
if((this.layer!=null)&&(this.layer.map!=null)){
var _57c=this.layer.map.getExtent();
_57b=_57c.containsLonLat(this.lonlat);
}
return _57b;
},createMarker:function(){
if(this.lonlat!=null){
this.marker=new OpenLayers.Marker(this.lonlat,this.data.icon);
}
return this.marker;
},destroyMarker:function(){
this.marker.destroy();
},createPopup:function(_57d){
if(this.lonlat!=null){
var id=this.id+"_popup";
var _57f=(this.marker)?this.marker.icon:null;
this.popup=new this.popupClass(id,this.lonlat,this.data.popupSize,this.data.popupContentHTML,_57f,_57d);
if(this.data.overflow!=null){
this.popup.contentDiv.style.overflow=this.data.overflow;
}
this.popup.feature=this;
}
return this.popup;
},destroyPopup:function(){
this.popup.feature=null;
this.popup.destroy();
},CLASS_NAME:"OpenLayers.Feature"});
OpenLayers.Handler.Drag=OpenLayers.Class(OpenLayers.Handler,{started:false,dragging:false,last:null,start:null,oldOnselectstart:null,initialize:function(_580,_581,_582){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},down:function(evt){
},move:function(evt){
},up:function(evt){
},out:function(evt){
},mousedown:function(evt){
var _588=true;
this.dragging=false;
if(this.checkModifiers(evt)&&OpenLayers.Event.isLeftClick(evt)){
this.started=true;
this.start=evt.xy;
this.last=evt.xy;
this.map.div.style.cursor="move";
this.down(evt);
this.callback("down",[evt.xy]);
OpenLayers.Event.stop(evt);
if(!this.oldOnselectstart){
this.oldOnselectstart=document.onselectstart;
document.onselectstart=function(){
return false;
};
}
_588=false;
}else{
this.started=false;
this.start=null;
this.last=null;
}
return _588;
},mousemove:function(evt){
if(this.started){
if(evt.xy.x!=this.last.x||evt.xy.y!=this.last.y){
this.dragging=true;
this.move(evt);
this.callback("move",[evt.xy]);
if(!this.oldOnselectstart){
this.oldOnselectstart=document.onselectstart;
document.onselectstart=function(){
return false;
};
}
this.last=evt.xy;
}
}
return true;
},mouseup:function(evt){
if(this.started){
this.started=false;
this.dragging=false;
this.map.div.style.cursor="";
this.up(evt);
this.callback("up",[evt.xy]);
this.callback("done",[evt.xy]);
document.onselectstart=this.oldOnselectstart;
}
return true;
},mouseout:function(evt){
if(this.started&&OpenLayers.Util.mouseLeft(evt,this.map.div)){
this.started=false;
this.dragging=false;
this.map.div.style.cursor="";
this.out(evt);
this.callback("out",[]);
if(document.onselectstart){
document.onselectstart=this.oldOnselectstart;
}
this.callback("done",[evt.xy]);
}
return true;
},click:function(evt){
return (this.start==this.last);
},activate:function(){
var _58d=false;
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
this.dragging=false;
_58d=true;
}
return _58d;
},deactivate:function(){
var _58e=false;
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
this.started=false;
this.dragging=false;
this.start=null;
this.last=null;
_58e=true;
}
return _58e;
},CLASS_NAME:"OpenLayers.Handler.Drag"});
OpenLayers.Handler.Feature=OpenLayers.Class(OpenLayers.Handler,{geometryTypes:null,layerIndex:null,feature:null,initialize:function(_58f,_590,_591,_592){
OpenLayers.Handler.prototype.initialize.apply(this,[_58f,_591,_592]);
this.layer=_590;
},click:function(evt){
var _594=this.select("click",evt);
return !_594;
},mousedown:function(evt){
var _596=this.select("down",evt);
return !_596;
},mousemove:function(evt){
this.select("move",evt);
return true;
},mouseup:function(evt){
var _599=this.select("up",evt);
return !_599;
},dblclick:function(evt){
var _59b=this.select("dblclick",evt);
return !_59b;
},select:function(type,evt){
var _59e=this.layer.getFeatureFromEvent(evt);
var _59f=false;
if(_59e){
if(this.geometryTypes==null||(OpenLayers.Util.indexOf(this.geometryTypes,_59e.geometry.CLASS_NAME)>-1)){
if(!this.feature){
this.callback("over",[_59e]);
}else{
if(this.feature!=_59e){
this.callback("out",[this.feature]);
this.callback("over",[_59e]);
}
}
this.feature=_59e;
this.callback(type,[_59e]);
_59f=true;
}else{
if(this.feature&&(this.feature!=_59e)){
this.callback("out",[this.feature]);
this.feature=null;
}
_59f=false;
}
}else{
if(this.feature){
this.callback("out",[this.feature]);
this.feature=null;
}
_59f=false;
}
return _59f;
},activate:function(){
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
this.layerIndex=this.layer.div.style.zIndex;
this.layer.div.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
return true;
}else{
return false;
}
},deactivate:function(){
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
if(this.layer&&this.layer.div){
this.layer.div.style.zIndex=this.layerIndex;
}
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.Feature"});
OpenLayers.Handler.Keyboard=OpenLayers.Class(OpenLayers.Handler,{KEY_EVENTS:["keydown","keypress","keyup"],eventListener:null,initialize:function(_5a0,_5a1,_5a2){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
this.eventListener=OpenLayers.Function.bindAsEventListener(this.handleKeyEvent,this);
},destroy:function(){
this.deactivate();
this.eventListener=null;
OpenLayers.Handler.prototype.destroy.apply(this,arguments);
},activate:function(){
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
for(var i=0;i<this.KEY_EVENTS.length;i++){
OpenLayers.Event.observe(window,this.KEY_EVENTS[i],this.eventListener);
}
return true;
}else{
return false;
}
},deactivate:function(){
var _5a4=false;
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
for(var i=0;i<this.KEY_EVENTS.length;i++){
OpenLayers.Event.stopObserving(window,this.KEY_EVENTS[i],this.eventListener);
}
_5a4=true;
}
return _5a4;
},handleKeyEvent:function(evt){
if(this.checkModifiers(evt)){
this.callback(evt.type,[evt.charCode||evt.keyCode]);
}
},CLASS_NAME:"OpenLayers.Handler.Keyboard"});
OpenLayers.Handler.MouseWheel=OpenLayers.Class(OpenLayers.Handler,{wheelListener:null,mousePosition:null,initialize:function(_5a7,_5a8,_5a9){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
this.wheelListener=OpenLayers.Function.bindAsEventListener(this.onWheelEvent,this);
},destroy:function(){
OpenLayers.Handler.prototype.destroy.apply(this,arguments);
this.wheelListener=null;
},onWheelEvent:function(e){
if(!this.checkModifiers(e)){
return;
}
var _5ab=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_5ab=true;
break;
}
elem=elem.parentNode;
}
if(_5ab){
var _5ad=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_5ad=e.wheelDelta/120;
if(window.opera){
_5ad=-_5ad;
}
}else{
if(e.detail){
_5ad=-e.detail/3;
}
}
if(_5ad){
if(this.mousePosition){
e.xy=this.mousePosition;
}
if(!e.xy){
e.xy=this.map.getPixelFromLonLat(this.map.getCenter());
}
if(_5ad<0){
this.callback("down",[e,_5ad]);
}else{
this.callback("up",[e,_5ad]);
}
}
OpenLayers.Event.stop(e);
}
},mousemove:function(evt){
this.mousePosition=evt.xy;
},activate:function(evt){
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
var _5b0=this.wheelListener;
OpenLayers.Event.observe(window,"DOMMouseScroll",_5b0);
OpenLayers.Event.observe(window,"mousewheel",_5b0);
OpenLayers.Event.observe(document,"mousewheel",_5b0);
return true;
}else{
return false;
}
},deactivate:function(evt){
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
var _5b2=this.wheelListener;
OpenLayers.Event.stopObserving(window,"DOMMouseScroll",_5b2);
OpenLayers.Event.stopObserving(window,"mousewheel",_5b2);
OpenLayers.Event.stopObserving(document,"mousewheel",_5b2);
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.MouseWheel"});
OpenLayers.Layer=OpenLayers.Class({id:null,name:null,div:null,EVENT_TYPES:["loadstart","loadend","loadcancel","visibilitychanged"],events:null,map:null,isBaseLayer:false,alpha:false,displayInLayerSwitcher:true,visibility:true,attribution:null,inRange:false,imageSize:null,imageOffset:null,options:null,gutter:0,projection:null,units:null,scales:null,resolutions:null,maxExtent:null,minExtent:null,maxResolution:null,minResolution:null,numZoomLevels:null,minScale:null,maxScale:null,displayOutsideMaxExtent:false,wrapDateLine:false,initialize:function(name,_5b4){
this.addOptions(_5b4);
this.name=name;
if(this.id==null){
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
this.div=OpenLayers.Util.createDiv();
this.div.style.width="100%";
this.div.style.height="100%";
this.div.id=this.id;
this.events=new OpenLayers.Events(this,this.div,this.EVENT_TYPES);
}
if(this.wrapDateLine){
this.displayOutsideMaxExtent=true;
}
},destroy:function(_5b5){
if(_5b5==null){
_5b5=true;
}
if(this.map!=null){
this.map.removeLayer(this,_5b5);
}
this.map=null;
this.name=null;
this.div=null;
this.options=null;
if(this.events){
this.events.destroy();
}
this.events=null;
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer(this.name,this.options);
}
OpenLayers.Util.applyDefaults(obj,this);
obj.map=null;
return obj;
},setName:function(_5b7){
if(_5b7!=this.name){
this.name=_5b7;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
}
},addOptions:function(_5b8){
if(this.options==null){
this.options={};
}
OpenLayers.Util.extend(this.options,_5b8);
OpenLayers.Util.extend(this,_5b8);
},onMapResize:function(){
},redraw:function(){
var _5b9=false;
if(this.map){
this.inRange=this.calculateInRange();
var _5ba=this.getExtent();
if(_5ba&&this.inRange&&this.visibility){
this.moveTo(_5ba,true,false);
_5b9=true;
}
}
return _5b9;
},moveTo:function(_5bb,_5bc,_5bd){
var _5be=this.visibility;
if(!this.isBaseLayer){
_5be=_5be&&this.inRange;
}
this.display(_5be);
},setMap:function(map){
if(this.map==null){
this.map=map;
this.maxExtent=this.maxExtent||this.map.maxExtent;
this.projection=this.projection||this.map.projection;
this.units=this.units||this.map.units;
this.initResolutions();
if(!this.isBaseLayer){
this.inRange=this.calculateInRange();
var show=((this.visibility)&&(this.inRange));
this.div.style.display=show?"":"none";
}
this.setTileSize();
}
},removeMap:function(map){
},getImageSize:function(){
return (this.imageSize||this.tileSize);
},setTileSize:function(size){
var _5c3=(size)?size:((this.tileSize)?this.tileSize:this.map.getTileSize());
this.tileSize=_5c3;
if(this.gutter){
this.imageOffset=new OpenLayers.Pixel(-this.gutter,-this.gutter);
this.imageSize=new OpenLayers.Size(_5c3.w+(2*this.gutter),_5c3.h+(2*this.gutter));
}
},getVisibility:function(){
return this.visibility;
},setVisibility:function(_5c4){
if(_5c4!=this.visibility){
this.visibility=_5c4;
this.display(_5c4);
this.redraw();
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
this.events.triggerEvent("visibilitychanged");
}
},display:function(_5c5){
if(_5c5!=(this.div.style.display!="none")){
this.div.style.display=(_5c5)?"block":"none";
}
},calculateInRange:function(){
var _5c6=false;
if(this.map){
var _5c7=this.map.getResolution();
_5c6=((_5c7>=this.minResolution)&&(_5c7<=this.maxResolution));
}
return _5c6;
},setIsBaseLayer:function(_5c8){
if(_5c8!=this.isBaseLayer){
this.isBaseLayer=_5c8;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
}
},initResolutions:function(){
var _5c9=new Array("projection","units","scales","resolutions","maxScale","minScale","maxResolution","minResolution","minExtent","maxExtent","numZoomLevels","maxZoomLevel");
var _5ca={};
for(var i=0;i<_5c9.length;i++){
var _5cc=_5c9[i];
_5ca[_5cc]=this.options[_5cc]||this.map[_5cc];
}
if((!_5ca.numZoomLevels)&&(_5ca.maxZoomLevel)){
_5ca.numZoomLevels=_5ca.maxZoomLevel+1;
}
if((_5ca.scales!=null)||(_5ca.resolutions!=null)){
if(_5ca.scales!=null){
_5ca.resolutions=[];
for(var i=0;i<_5ca.scales.length;i++){
var _5cd=_5ca.scales[i];
_5ca.resolutions[i]=OpenLayers.Util.getResolutionFromScale(_5cd,_5ca.units);
}
}
_5ca.numZoomLevels=_5ca.resolutions.length;
}else{
_5ca.resolutions=[];
if(_5ca.minScale){
_5ca.maxResolution=OpenLayers.Util.getResolutionFromScale(_5ca.minScale,_5ca.units);
}else{
if(_5ca.maxResolution=="auto"){
var _5ce=this.map.getSize();
var wRes=_5ca.maxExtent.getWidth()/_5ce.w;
var hRes=_5ca.maxExtent.getHeight()/_5ce.h;
_5ca.maxResolution=Math.max(wRes,hRes);
}
}
if(_5ca.maxScale!=null){
_5ca.minResolution=OpenLayers.Util.getResolutionFromScale(_5ca.maxScale);
}else{
if((_5ca.minResolution=="auto")&&(_5ca.minExtent!=null)){
var _5ce=this.map.getSize();
var wRes=_5ca.minExtent.getWidth()/_5ce.w;
var hRes=_5ca.minExtent.getHeight()/_5ce.h;
_5ca.minResolution=Math.max(wRes,hRes);
}
}
if(_5ca.minResolution!=null){
var _5d1=_5ca.maxResolution/_5ca.minResolution;
_5ca.numZoomLevels=Math.floor(Math.log(_5d1)/Math.log(2))+1;
}
for(var i=0;i<_5ca.numZoomLevels;i++){
var res=_5ca.maxResolution/Math.pow(2,i);
_5ca.resolutions.push(res);
}
}
_5ca.resolutions.sort(function(a,b){
return (b-a);
});
this.resolutions=_5ca.resolutions;
this.maxResolution=_5ca.resolutions[0];
var _5d5=_5ca.resolutions.length-1;
this.minResolution=_5ca.resolutions[_5d5];
this.scales=[];
for(var i=0;i<_5ca.resolutions.length;i++){
this.scales[i]=OpenLayers.Util.getScaleFromResolution(_5ca.resolutions[i],_5ca.units);
}
this.minScale=this.scales[0];
this.maxScale=this.scales[this.scales.length-1];
this.numZoomLevels=_5ca.numZoomLevels;
},getResolution:function(){
var zoom=this.map.getZoom();
return this.resolutions[zoom];
},getExtent:function(){
return this.map.calculateBounds();
},getZoomForExtent:function(_5d7,_5d8){
var _5d9=this.map.getSize();
var _5da=Math.max(_5d7.getWidth()/_5d9.w,_5d7.getHeight()/_5d9.h);
return this.getZoomForResolution(_5da,_5d8);
},getDataExtent:function(){
},getZoomForResolution:function(_5db,_5dc){
var diff;
var _5de=Number.POSITIVE_INFINITY;
for(var i=0;i<this.resolutions.length;i++){
if(_5dc){
diff=Math.abs(this.resolutions[i]-_5db);
if(diff>_5de){
break;
}
_5de=diff;
}else{
if(this.resolutions[i]<_5db){
break;
}
}
}
return Math.max(0,i-1);
},getLonLatFromViewPortPx:function(_5e0){
var _5e1=null;
if(_5e0!=null){
var size=this.map.getSize();
var _5e3=this.map.getCenter();
if(_5e3){
var res=this.map.getResolution();
var _5e5=_5e0.x-(size.w/2);
var _5e6=_5e0.y-(size.h/2);
_5e1=new OpenLayers.LonLat(_5e3.lon+_5e5*res,_5e3.lat-_5e6*res);
if(this.wrapDateLine){
_5e1=_5e1.wrapDateLine(this.maxExtent);
}
}
}
return _5e1;
},getViewPortPxFromLonLat:function(_5e7){
var px=null;
if(_5e7!=null){
var _5e9=this.map.getResolution();
var _5ea=this.map.getExtent();
px=new OpenLayers.Pixel(Math.round(1/_5e9*(_5e7.lon-_5ea.left)),Math.round(1/_5e9*(_5ea.top-_5e7.lat)));
}
return px;
},setOpacity:function(_5eb){
if(_5eb!=this.opacity){
this.opacity=_5eb;
for(var i=0;i<this.div.childNodes.length;++i){
var _5ed=this.div.childNodes[i].firstChild;
OpenLayers.Util.modifyDOMElement(_5ed,null,null,null,null,null,null,_5eb);
}
}
},setZIndex:function(_5ee){
this.div.style.zIndex=_5ee;
},adjustBounds:function(_5ef){
if(this.gutter){
var _5f0=this.gutter*this.map.getResolution();
_5ef=new OpenLayers.Bounds(_5ef.left-_5f0,_5ef.bottom-_5f0,_5ef.right+_5f0,_5ef.top+_5f0);
}
if(this.wrapDateLine){
var _5f1={"rightTolerance":this.getResolution()};
_5ef=_5ef.wrapDateLine(this.maxExtent,_5f1);
}
return _5ef;
},CLASS_NAME:"OpenLayers.Layer"});
OpenLayers.Marker.Box=OpenLayers.Class(OpenLayers.Marker,{bounds:null,div:null,initialize:function(_5f2,_5f3,_5f4){
this.bounds=_5f2;
this.div=OpenLayers.Util.createDiv();
this.div.style.overflow="hidden";
this.events=new OpenLayers.Events(this,this.div,null);
this.setBorder(_5f3,_5f4);
},destroy:function(){
this.bounds=null;
this.div=null;
OpenLayers.Marker.prototype.destroy.apply(this,arguments);
},setBorder:function(_5f5,_5f6){
if(!_5f5){
_5f5="red";
}
if(!_5f6){
_5f6=2;
}
this.div.style.border=_5f6+"px solid "+_5f5;
},draw:function(px,sz){
OpenLayers.Util.modifyDOMElement(this.div,null,px,sz);
return this.div;
},onScreen:function(){
var _5f9=false;
if(this.map){
var _5fa=this.map.getExtent();
_5f9=_5fa.containsBounds(this.bounds,true,true);
}
return _5f9;
},display:function(_5fb){
this.div.style.display=(_5fb)?"":"none";
},CLASS_NAME:"OpenLayers.Marker.Box"});
OpenLayers.Control.DragFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,onStart:function(_5fc,_5fd){
},onDrag:function(_5fe,_5ff){
},onComplete:function(_600,_601){
},layer:null,feature:null,dragHandler:null,dragCallbacks:{},featureHandler:null,featureCallbacks:{},lastPixel:null,initialize:function(_602,_603){
OpenLayers.Control.prototype.initialize.apply(this,[_603]);
this.layer=_602;
this.dragCallbacks=OpenLayers.Util.extend({down:this.downFeature,move:this.moveFeature,up:this.upFeature,out:this.cancel,done:this.doneDragging},this.dragCallbacks);
this.dragHandler=new OpenLayers.Handler.Drag(this,this.dragCallbacks);
this.featureCallbacks=OpenLayers.Util.extend({over:this.overFeature,out:this.outFeature},this.featureCallbacks);
var _604={geometryTypes:this.geometryTypes};
this.featureHandler=new OpenLayers.Handler.Feature(this,this.layer,this.featureCallbacks,_604);
},destroy:function(){
this.layer=null;
this.dragHandler.destroy();
this.featureHandler.destroy();
OpenLayers.Control.prototype.destroy.apply(this,[]);
},activate:function(){
return (this.featureHandler.activate()&&OpenLayers.Control.prototype.activate.apply(this,arguments));
},deactivate:function(){
this.dragHandler.deactivate();
this.featureHandler.deactivate();
this.feature=null;
this.dragging=false;
this.lastPixel=null;
return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
},overFeature:function(_605){
if(!this.dragHandler.dragging){
this.feature=_605;
this.dragHandler.activate();
this.over=true;
this.map.div.style.cursor="move";
}else{
if(this.feature.id==_605.id){
this.over=true;
}else{
this.over=false;
}
}
},downFeature:function(_606){
this.lastPixel=_606;
this.onStart(this.feature,_606);
},moveFeature:function(_607){
var res=this.map.getResolution();
this.feature.geometry.move(res*(_607.x-this.lastPixel.x),res*(this.lastPixel.y-_607.y));
this.layer.drawFeature(this.feature);
this.lastPixel=_607;
this.onDrag(this.feature,_607);
},upFeature:function(_609){
if(!this.over){
this.dragHandler.deactivate();
this.feature=null;
this.map.div.style.cursor="default";
}
},doneDragging:function(_60a){
this.onComplete(this.feature,_60a);
},outFeature:function(_60b){
if(!this.dragHandler.dragging){
this.over=false;
this.dragHandler.deactivate();
this.map.div.style.cursor="default";
this.feature=null;
}else{
if(this.feature.id==_60b.id){
this.over=false;
}
}
},cancel:function(){
this.dragHandler.deactivate();
this.over=false;
},setMap:function(map){
this.dragHandler.setMap(map);
this.featureHandler.setMap(map);
OpenLayers.Control.prototype.setMap.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Control.DragFeature"});
OpenLayers.Control.DragPan=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,panned:false,draw:function(){
this.handler=new OpenLayers.Handler.Drag(this,{"move":this.panMap,"done":this.panMapDone});
},panMap:function(xy){
this.panned=true;
var _60e=this.handler.last.x-xy.x;
var _60f=this.handler.last.y-xy.y;
var size=this.map.getSize();
var _611=new OpenLayers.Pixel(size.w/2+_60e,size.h/2+_60f);
var _612=this.map.getLonLatFromViewPortPx(_611);
this.map.setCenter(_612,null,this.handler.dragging);
},panMapDone:function(xy){
if(this.panned){
this.panMap(xy);
this.panned=false;
}
},CLASS_NAME:"OpenLayers.Control.DragPan"});
OpenLayers.Control.KeyboardDefaults=OpenLayers.Class(OpenLayers.Control,{slideFactor:75,initialize:function(){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},destroy:function(){
if(this.handler){
this.handler.destroy();
}
this.handler=null;
OpenLayers.Control.prototype.destroy.apply(this,arguments);
},draw:function(){
this.handler=new OpenLayers.Handler.Keyboard(this,{"keypress":this.defaultKeyPress});
this.activate();
},defaultKeyPress:function(code){
switch(code){
case OpenLayers.Event.KEY_LEFT:
this.map.pan(-this.slideFactor,0);
break;
case OpenLayers.Event.KEY_RIGHT:
this.map.pan(this.slideFactor,0);
break;
case OpenLayers.Event.KEY_UP:
this.map.pan(0,-this.slideFactor);
break;
case OpenLayers.Event.KEY_DOWN:
this.map.pan(0,this.slideFactor);
break;
case 33:
var size=this.map.getSize();
this.map.pan(0,-0.75*size.h);
break;
case 34:
var size=this.map.getSize();
this.map.pan(0,0.75*size.h);
break;
case 35:
var size=this.map.getSize();
this.map.pan(0.75*size.w,0);
break;
case 36:
var size=this.map.getSize();
this.map.pan(-0.75*size.w,0);
break;
case 43:
this.map.zoomIn();
break;
case 45:
this.map.zoomOut();
break;
case 107:
this.map.zoomIn();
break;
case 109:
this.map.zoomOut();
break;
}
},CLASS_NAME:"OpenLayers.Control.KeyboardDefaults"});
OpenLayers.State={UNKNOWN:"Unknown",INSERT:"Insert",UPDATE:"Update",DELETE:"Delete"};
OpenLayers.Feature.Vector=OpenLayers.Class(OpenLayers.Feature,{fid:null,geometry:null,attributes:null,state:null,style:null,initialize:function(_616,_617,_618){
OpenLayers.Feature.prototype.initialize.apply(this,[null,null,_617]);
this.lonlat=null;
this.geometry=_616;
this.state=null;
this.attributes={};
if(_617){
this.attributes=OpenLayers.Util.extend(this.attributes,_617);
}
this.style=_618?_618:null;
},destroy:function(){
if(this.layer){
this.layer.removeFeatures(this);
this.layer=null;
}
this.geometry=null;
OpenLayers.Feature.prototype.destroy.apply(this,arguments);
},clone:function(){
return new OpenLayers.Feature.Vector(this.geometry.clone(),this.attributes,this.style);
},onScreen:function(){
return null;
},createMarker:function(){
return null;
},destroyMarker:function(){
},createPopup:function(){
return null;
},atPoint:function(_619,_61a,_61b){
var _61c=false;
if(this.geometry){
_61c=this.geometry.atPoint(_619,_61a,_61b);
}
return _61c;
},destroyPopup:function(){
},toState:function(_61d){
if(_61d==OpenLayers.State.UPDATE){
switch(this.state){
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.DELETE:
this.state=_61d;
break;
case OpenLayers.State.UPDATE:
case OpenLayers.State.INSERT:
break;
}
}else{
if(_61d==OpenLayers.State.INSERT){
switch(this.state){
case OpenLayers.State.UNKNOWN:
break;
default:
this.state=_61d;
break;
}
}else{
if(_61d==OpenLayers.State.DELETE){
switch(this.state){
case OpenLayers.State.INSERT:
break;
case OpenLayers.State.DELETE:
break;
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.UPDATE:
this.state=_61d;
break;
}
}else{
if(_61d==OpenLayers.State.UNKNOWN){
this.state=_61d;
}
}
}
}
},CLASS_NAME:"OpenLayers.Feature.Vector"});
OpenLayers.Feature.Vector.style={"default":{fillColor:"#ee9900",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"#ee9900",strokeOpacity:1,strokeWidth:1,strokeLinecap:"round",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"},"select":{fillColor:"blue",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"blue",strokeOpacity:1,strokeWidth:2,strokeLinecap:"round",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted",cursor:"pointer"},"temporary":{fillColor:"yellow",fillOpacity:0.2,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"yellow",strokeOpacity:1,strokeLinecap:"round",strokeWidth:4,hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"}};
OpenLayers.Feature.WFS=OpenLayers.Class(OpenLayers.Feature,{initialize:function(_61e,_61f){
var _620=arguments;
var data=this.processXMLNode(_61f);
_620=new Array(_61e,data.lonlat,data);
OpenLayers.Feature.prototype.initialize.apply(this,_620);
this.createMarker();
this.layer.addMarker(this.marker);
},destroy:function(){
if(this.marker!=null){
this.layer.removeMarker(this.marker);
}
OpenLayers.Feature.prototype.destroy.apply(this,arguments);
},processXMLNode:function(_622){
var _623=OpenLayers.Ajax.getElementsByTagNameNS(_622,"http://www.opengis.net/gml","gml","Point");
var text=OpenLayers.Util.getXmlNodeValue(OpenLayers.Ajax.getElementsByTagNameNS(_623[0],"http://www.opengis.net/gml","gml","coordinates")[0]);
var _625=text.split(",");
return {lonlat:new OpenLayers.LonLat(parseFloat(_625[0]),parseFloat(_625[1])),id:null};
},CLASS_NAME:"OpenLayers.Feature.WFS"});
OpenLayers.Handler.Box=OpenLayers.Class(OpenLayers.Handler,{dragHandler:null,initialize:function(_626,_627,_628){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
var _627={"down":this.startBox,"move":this.moveBox,"out":this.removeBox,"up":this.endBox};
this.dragHandler=new OpenLayers.Handler.Drag(this,_627,{keyMask:this.keyMask});
},setMap:function(map){
OpenLayers.Handler.prototype.setMap.apply(this,arguments);
if(this.dragHandler){
this.dragHandler.setMap(map);
}
},startBox:function(xy){
this.zoomBox=OpenLayers.Util.createDiv("zoomBox",this.dragHandler.start,null,null,"absolute","2px solid red");
this.zoomBox.style.backgroundColor="white";
this.zoomBox.style.filter="alpha(opacity=50)";
this.zoomBox.style.opacity="0.50";
this.zoomBox.style.fontSize="1px";
this.zoomBox.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
this.map.viewPortDiv.appendChild(this.zoomBox);
this.map.div.style.cursor="crosshair";
},moveBox:function(xy){
var _62c=Math.abs(this.dragHandler.start.x-xy.x);
var _62d=Math.abs(this.dragHandler.start.y-xy.y);
this.zoomBox.style.width=Math.max(1,_62c)+"px";
this.zoomBox.style.height=Math.max(1,_62d)+"px";
if(xy.x<this.dragHandler.start.x){
this.zoomBox.style.left=xy.x+"px";
}
if(xy.y<this.dragHandler.start.y){
this.zoomBox.style.top=xy.y+"px";
}
},endBox:function(end){
var _62f;
if(Math.abs(this.dragHandler.start.x-end.x)>5||Math.abs(this.dragHandler.start.y-end.y)>5){
var _630=this.dragHandler.start;
var top=Math.min(_630.y,end.y);
var _632=Math.max(_630.y,end.y);
var left=Math.min(_630.x,end.x);
var _634=Math.max(_630.x,end.x);
_62f=new OpenLayers.Bounds(left,_632,_634,top);
}else{
_62f=this.dragHandler.start.clone();
}
this.removeBox();
this.map.div.style.cursor="";
this.callback("done",[_62f]);
},removeBox:function(){
this.map.viewPortDiv.removeChild(this.zoomBox);
this.zoomBox=null;
},activate:function(){
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
this.dragHandler.activate();
return true;
}else{
return false;
}
},deactivate:function(){
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
this.dragHandler.deactivate();
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.Box"});
OpenLayers.Handler.RegularPolygon=OpenLayers.Class(OpenLayers.Handler.Drag,{sides:4,radius:null,snapAngle:null,snapToggle:"shiftKey",persist:false,angle:null,fixedRadius:false,feature:null,layer:null,origin:null,initialize:function(_635,_636,_637){
this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});
OpenLayers.Handler.prototype.initialize.apply(this,[_635,_636,_637]);
this.options=(_637)?_637:new Object();
},setOptions:function(_638){
OpenLayers.Util.extend(this.options,_638);
OpenLayers.Util.extend(this,_638);
},activate:function(){
var _639=false;
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
var _63a={displayInLayerSwitcher:false};
this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,_63a);
this.map.addLayer(this.layer);
_639=true;
}
return _639;
},deactivate:function(){
var _63b=false;
if(OpenLayers.Handler.Drag.prototype.deactivate.apply(this,arguments)){
if(this.dragging){
this.cancel();
}
this.map.removeLayer(this.layer,false);
this.layer.destroy();
if(this.feature){
this.feature.destroy();
}
_63b=true;
}
return _63b;
},down:function(evt){
this.fixedRadius=!!(this.radius);
var _63d=this.map.getLonLatFromPixel(evt.xy);
this.origin=new OpenLayers.Geometry.Point(_63d.lon,_63d.lat);
if(!this.fixedRadius){
this.radius=this.map.getResolution();
}
if(this.persist){
this.clear();
}
this.feature=new OpenLayers.Feature.Vector();
this.createGeometry();
this.layer.addFeatures([this.feature]);
this.layer.drawFeature(this.feature,this.style);
},move:function(evt){
var _63f=this.map.getLonLatFromPixel(evt.xy);
var _640=new OpenLayers.Geometry.Point(_63f.lon,_63f.lat);
if(this.fixedRadius){
this.origin=_640;
}else{
this.calculateAngle(_640,evt);
this.radius=Math.max(this.map.getResolution()/2,_640.distanceTo(this.origin));
}
this.modifyGeometry();
this.layer.drawFeature(this.feature,this.style);
},up:function(evt){
this.finalize();
},out:function(evt){
this.finalize();
},createGeometry:function(){
this.angle=Math.PI*((1/this.sides)-(1/2));
if(this.snapAngle){
this.angle+=this.snapAngle*(Math.PI/180);
}
this.feature.geometry=OpenLayers.Geometry.Polygon.createRegularPolygon(this.origin,this.radius,this.sides,this.snapAngle);
},modifyGeometry:function(){
var _643,dx,dy,point;
var ring=this.feature.geometry.components[0];
if(ring.components.length!=(this.sides+1)){
this.createGeometry();
}
for(var i=0;i<this.sides;++i){
point=ring.components[i];
_643=this.angle+(i*2*Math.PI/this.sides);
point.x=this.origin.x+(this.radius*Math.cos(_643));
point.y=this.origin.y+(this.radius*Math.sin(_643));
point.clearBounds();
}
},calculateAngle:function(_646,evt){
var _648=Math.atan2(_646.y-this.origin.y,_646.x-this.origin.x);
if(this.snapAngle&&(this.snapToggle&&!evt[this.snapToggle])){
var _649=(Math.PI/180)*this.snapAngle;
this.angle=Math.round(_648/_649)*_649;
}else{
this.angle=_648;
}
},cancel:function(){
this.callback("cancel",null);
this.finalize();
},finalize:function(){
this.origin=null;
this.radius=this.options.radius;
},clear:function(){
this.layer.renderer.clear();
this.layer.destroyFeatures();
},callback:function(name,args){
if(this.callbacks[name]){
this.callbacks[name].apply(this.control,[this.feature.geometry.clone()]);
}
if(!this.persist&&(name=="done"||name=="cancel")){
this.clear();
}
},CLASS_NAME:"OpenLayers.Handler.RegularPolygon"});
OpenLayers.Layer.EventPane=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:true,isFixed:true,pane:null,mapObject:null,initialize:function(name,_64d){
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
if(this.pane==null){
this.pane=OpenLayers.Util.createDiv(this.div.id+"_EventPane");
}
},destroy:function(){
this.mapObject=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},setMap:function(map){
OpenLayers.Layer.prototype.setMap.apply(this,arguments);
this.pane.style.zIndex=parseInt(this.div.style.zIndex)+1;
this.pane.style.display=this.div.style.display;
this.pane.style.width="100%";
this.pane.style.height="100%";
if(OpenLayers.Util.getBrowserName()=="msie"){
this.pane.style.background="url("+OpenLayers.Util.getImagesLocation()+"blank.gif)";
}
if(this.isFixed){
this.map.viewPortDiv.appendChild(this.pane);
}else{
this.map.layerContainerDiv.appendChild(this.pane);
}
this.loadMapObject();
if(this.mapObject==null){
this.loadWarningMessage();
}
},removeMap:function(map){
if(this.pane&&this.pane.parentNode){
this.pane.parentNode.removeChild(this.pane);
this.pane=null;
}
OpenLayers.Layer.prototype.removeMap.apply(this,arguments);
},loadWarningMessage:function(){
this.div.style.backgroundColor="darkblue";
var _650=this.map.getSize();
msgW=Math.min(_650.w,300);
msgH=Math.min(_650.h,200);
var size=new OpenLayers.Size(msgW,msgH);
var _652=new OpenLayers.Pixel(_650.w/2,_650.h/2);
var _653=_652.add(-size.w/2,-size.h/2);
var div=OpenLayers.Util.createDiv(this.name+"_warning",_653,size,null,null,null,"auto");
div.style.padding="7px";
div.style.backgroundColor="yellow";
div.innerHTML=this.getWarningHTML();
this.div.appendChild(div);
},getWarningHTML:function(){
return "";
},display:function(_655){
OpenLayers.Layer.prototype.display.apply(this,arguments);
this.pane.style.display=this.div.style.display;
},setZIndex:function(_656){
OpenLayers.Layer.prototype.setZIndex.apply(this,arguments);
this.pane.style.zIndex=parseInt(this.div.style.zIndex)+1;
},moveTo:function(_657,_658,_659){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(this.mapObject!=null){
var _65a=this.map.getCenter();
var _65b=this.map.getZoom();
if(_65a!=null){
var _65c=this.getMapObjectCenter();
var _65d=this.getOLLonLatFromMapObjectLonLat(_65c);
var _65e=this.getMapObjectZoom();
var _65f=this.getOLZoomFromMapObjectZoom(_65e);
if(!(_65a.equals(_65d))||!(_65b==_65f)){
var _660=this.getMapObjectLonLatFromOLLonLat(_65a);
var zoom=this.getMapObjectZoomFromOLZoom(_65b);
this.setMapObjectCenter(_660,zoom);
}
}
}
},getLonLatFromViewPortPx:function(_662){
var _663=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _664=this.getMapObjectPixelFromOLPixel(_662);
var _665=this.getMapObjectLonLatFromMapObjectPixel(_664);
_663=this.getOLLonLatFromMapObjectLonLat(_665);
}
return _663;
},getViewPortPxFromLonLat:function(_666){
var _667=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _668=this.getMapObjectLonLatFromOLLonLat(_666);
var _669=this.getMapObjectPixelFromMapObjectLonLat(_668);
_667=this.getOLPixelFromMapObjectPixel(_669);
}
return _667;
},getOLLonLatFromMapObjectLonLat:function(_66a){
var _66b=null;
if(_66a!=null){
var lon=this.getLongitudeFromMapObjectLonLat(_66a);
var lat=this.getLatitudeFromMapObjectLonLat(_66a);
_66b=new OpenLayers.LonLat(lon,lat);
}
return _66b;
},getMapObjectLonLatFromOLLonLat:function(_66e){
var _66f=null;
if(_66e!=null){
_66f=this.getMapObjectLonLatFromLonLat(_66e.lon,_66e.lat);
}
return _66f;
},getOLPixelFromMapObjectPixel:function(_670){
var _671=null;
if(_670!=null){
var x=this.getXFromMapObjectPixel(_670);
var y=this.getYFromMapObjectPixel(_670);
_671=new OpenLayers.Pixel(x,y);
}
return _671;
},getMapObjectPixelFromOLPixel:function(_674){
var _675=null;
if(_674!=null){
_675=this.getMapObjectPixelFromXY(_674.x,_674.y);
}
return _675;
},CLASS_NAME:"OpenLayers.Layer.EventPane"});
OpenLayers.Layer.FixedZoomLevels=OpenLayers.Class({initialize:function(){
},initResolutions:function(){
var _676=new Array("minZoomLevel","maxZoomLevel","numZoomLevels");
for(var i=0;i<_676.length;i++){
var _678=_676[i];
this[_678]=(this.options[_678]!=null)?this.options[_678]:this.map[_678];
}
if((this.minZoomLevel==null)||(this.minZoomLevel<this.MIN_ZOOM_LEVEL)){
this.minZoomLevel=this.MIN_ZOOM_LEVEL;
}
var _679=this.MAX_ZOOM_LEVEL-this.minZoomLevel+1;
if(this.numZoomLevels!=null){
this.numZoomLevels=Math.min(this.numZoomLevels,_679);
}else{
if(this.maxZoomLevel!=null){
var _67a=this.maxZoomLevel-this.minZoomLevel+1;
this.numZoomLevels=Math.min(_67a,_679);
}else{
this.numZoomLevels=_679;
}
}
this.maxZoomLevel=this.minZoomLevel+this.numZoomLevels-1;
if(this.RESOLUTIONS!=null){
var _67b=0;
this.resolutions=[];
for(var i=this.minZoomLevel;i<this.numZoomLevels;i++){
this.resolutions[_67b++]=this.RESOLUTIONS[i];
}
}
},getResolution:function(){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getResolution.apply(this,arguments);
}else{
var _67c=null;
var _67d=this.map.getSize();
var _67e=this.getExtent();
if((_67d!=null)&&(_67e!=null)){
_67c=Math.max(_67e.getWidth()/_67d.w,_67e.getHeight()/_67d.h);
}
return _67c;
}
},getExtent:function(){
var _67f=null;
var size=this.map.getSize();
var tlPx=new OpenLayers.Pixel(0,0);
var tlLL=this.getLonLatFromViewPortPx(tlPx);
var brPx=new OpenLayers.Pixel(size.w,size.h);
var brLL=this.getLonLatFromViewPortPx(brPx);
if((tlLL!=null)&&(brLL!=null)){
_67f=new OpenLayers.Bounds(tlLL.lon,brLL.lat,brLL.lon,tlLL.lat);
}
return _67f;
},getZoomForResolution:function(_685){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getZoomForResolution.apply(this,arguments);
}else{
var _686=OpenLayers.Layer.prototype.getExtent.apply(this,[_685]);
return this.getZoomForExtent(_686);
}
},getOLZoomFromMapObjectZoom:function(_687){
var zoom=null;
if(_687!=null){
zoom=_687-this.minZoomLevel;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_689){
var zoom=null;
if(_689!=null){
zoom=_689+this.minZoomLevel;
}
return zoom;
},CLASS_NAME:"FixedZoomLevels.js"});
OpenLayers.Layer.HTTPRequest=OpenLayers.Class(OpenLayers.Layer,{URL_HASH_FACTOR:(Math.sqrt(5)-1)/2,url:null,params:null,reproject:false,initialize:function(name,url,_68d,_68e){
var _68f=arguments;
_68f=[name,_68e];
OpenLayers.Layer.prototype.initialize.apply(this,_68f);
this.url=url;
this.params=OpenLayers.Util.extend({},_68d);
},destroy:function(){
this.url=null;
this.params=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.HTTPRequest(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.prototype.clone.apply(this,[obj]);
return obj;
},setUrl:function(_691){
this.url=_691;
},mergeNewParams:function(_692){
this.params=OpenLayers.Util.extend(this.params,_692);
this.redraw();
},selectUrl:function(_693,urls){
var _695=1;
for(var i=0;i<_693.length;i++){
_695*=_693.charCodeAt(i)*this.URL_HASH_FACTOR;
_695-=Math.floor(_695);
}
return urls[Math.floor(_695*urls.length)];
},getFullRequestString:function(_697,_698){
var url=_698||this.url;
var _69a=OpenLayers.Util.extend({},this.params);
_69a=OpenLayers.Util.extend(_69a,_697);
var _69b=OpenLayers.Util.getParameterString(_69a);
if(url instanceof Array){
url=this.selectUrl(_69b,url);
}
var _69c=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
for(var key in _69a){
if(key.toUpperCase() in _69c){
delete _69a[key];
}
}
_69b=OpenLayers.Util.getParameterString(_69a);
var _69e=url;
if(_69b!=""){
var _69f=url.charAt(url.length-1);
if((_69f=="&")||(_69f=="?")){
_69e+=_69b;
}else{
if(url.indexOf("?")==-1){
_69e+="?"+_69b;
}else{
_69e+="&"+_69b;
}
}
}
return _69e;
},CLASS_NAME:"OpenLayers.Layer.HTTPRequest"});
OpenLayers.Layer.Image=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:true,url:null,extent:null,size:null,tile:null,aspectRatio:null,initialize:function(name,url,_6a2,size,_6a4){
this.url=url;
this.extent=_6a2;
this.size=size;
OpenLayers.Layer.prototype.initialize.apply(this,[name,_6a4]);
this.aspectRatio=(this.extent.getHeight()/this.size.h)/(this.extent.getWidth()/this.size.w);
},destroy:function(){
if(this.tile){
this.tile.destroy();
this.tile=null;
}
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.Image(this.name,this.url,this.extent,this.size,this.options);
}
obj=OpenLayers.Layer.prototype.clone.apply(this,[obj]);
return obj;
},setMap:function(map){
if(this.options.maxResolution==null){
this.options.maxResolution=this.aspectRatio*this.extent.getWidth()/this.size.w;
}
OpenLayers.Layer.prototype.setMap.apply(this,arguments);
},moveTo:function(_6a7,_6a8,_6a9){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
var _6aa=(this.tile==null);
if(_6a8||_6aa){
this.setTileSize();
var ul=new OpenLayers.LonLat(this.extent.left,this.extent.top);
var ulPx=this.map.getLayerPxFromLonLat(ul);
if(_6aa){
this.tile=new OpenLayers.Tile.Image(this,ulPx,this.extent,null,this.tileSize);
}else{
this.tile.size=this.tileSize.clone();
this.tile.position=ulPx.clone();
}
this.tile.draw();
}
},setTileSize:function(){
var _6ad=this.extent.getWidth()/this.map.getResolution();
var _6ae=this.extent.getHeight()/this.map.getResolution();
this.tileSize=new OpenLayers.Size(_6ad,_6ae);
},setUrl:function(_6af){
this.url=_6af;
this.tile.draw();
},getURL:function(_6b0){
return this.url;
},CLASS_NAME:"OpenLayers.Layer.Image"});
OpenLayers.Layer.Markers=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:false,markers:null,drawn:false,initialize:function(name,_6b2){
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
this.markers=[];
},destroy:function(){
this.clearMarkers();
this.markers=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},moveTo:function(_6b3,_6b4,_6b5){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(_6b4||!this.drawn){
for(i=0;i<this.markers.length;i++){
this.drawMarker(this.markers[i]);
}
this.drawn=true;
}
},addMarker:function(_6b6){
this.markers.push(_6b6);
if(this.map&&this.map.getExtent()){
_6b6.map=this.map;
this.drawMarker(_6b6);
}
},removeMarker:function(_6b7){
OpenLayers.Util.removeItem(this.markers,_6b7);
if((_6b7.icon!=null)&&(_6b7.icon.imageDiv!=null)&&(_6b7.icon.imageDiv.parentNode==this.div)){
this.div.removeChild(_6b7.icon.imageDiv);
_6b7.drawn=false;
}
},clearMarkers:function(){
if(this.markers!=null){
while(this.markers.length>0){
this.removeMarker(this.markers[0]);
}
}
},drawMarker:function(_6b8){
var px=this.map.getLayerPxFromLonLat(_6b8.lonlat);
if(px==null){
_6b8.display(false);
}else{
var _6ba=_6b8.draw(px);
if(!_6b8.drawn){
this.div.appendChild(_6ba);
_6b8.drawn=true;
}
}
},getDataExtent:function(){
var _6bb=null;
if(this.markers&&(this.markers.length>0)){
var _6bb=new OpenLayers.Bounds();
for(var i=0;i<this.markers.length;i++){
var _6bd=this.markers[i];
_6bb.extend(_6bd.lonlat);
}
}
return _6bb;
},CLASS_NAME:"OpenLayers.Layer.Markers"});
OpenLayers.Layer.SphericalMercator={getExtent:function(){
var _6be=null;
if(this.sphericalMercator){
_6be=this.map.calculateBounds();
}else{
_6be=OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this);
}
return _6be;
},initMercatorParameters:function(){
this.RESOLUTIONS=[];
var _6bf=156543.0339;
for(var zoom=0;zoom<=this.MAX_ZOOM_LEVEL;++zoom){
this.RESOLUTIONS[zoom]=_6bf/Math.pow(2,zoom);
}
this.units="m";
this.projection="EPSG:900913";
},forwardMercator:function(lon,lat){
var x=lon*20037508.34/180;
var y=Math.log(Math.tan((90+lat)*Math.PI/360))/(Math.PI/180);
y=y*20037508.34/180;
return new OpenLayers.LonLat(x,y);
},inverseMercator:function(x,y){
var lon=(x/20037508.34)*180;
var lat=(y/20037508.34)*180;
lat=180/Math.PI*(2*Math.atan(Math.exp(lat*Math.PI/180))-Math.PI/2);
return new OpenLayers.LonLat(lon,lat);
}};
OpenLayers.Control.DrawFeature=OpenLayers.Class(OpenLayers.Control,{layer:null,callbacks:null,featureAdded:function(){
},handlerOptions:null,initialize:function(_6c9,_6ca,_6cb){
OpenLayers.Control.prototype.initialize.apply(this,[_6cb]);
this.callbacks=OpenLayers.Util.extend({done:this.drawFeature},this.callbacks);
this.layer=_6c9;
this.handler=new _6ca(this,this.callbacks,this.handlerOptions);
},drawFeature:function(_6cc){
var _6cd=new OpenLayers.Feature.Vector(_6cc);
this.layer.addFeatures([_6cd]);
this.featureAdded(_6cd);
},CLASS_NAME:"OpenLayers.Control.DrawFeature"});
OpenLayers.Control.SelectFeature=OpenLayers.Class(OpenLayers.Control,{multiple:false,hover:false,onSelect:function(){
},onUnselect:function(){
},geometryTypes:null,layer:null,callbacks:null,selectStyle:OpenLayers.Feature.Vector.style["select"],handler:null,initialize:function(_6ce,_6cf){
OpenLayers.Control.prototype.initialize.apply(this,[_6cf]);
this.layer=_6ce;
this.callbacks=OpenLayers.Util.extend({click:this.clickFeature,over:this.overFeature,out:this.outFeature},this.callbacks);
var _6d0={geometryTypes:this.geometryTypes};
this.handler=new OpenLayers.Handler.Feature(this,_6ce,this.callbacks,_6d0);
},clickFeature:function(_6d1){
if(this.hover){
return;
}
if(this.multiple){
if(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_6d1)>-1){
this.unselect(_6d1);
}else{
this.select(_6d1);
}
}else{
if(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_6d1)>-1){
this.unselect(_6d1);
}else{
if(this.layer.selectedFeatures){
for(var i=0;i<this.layer.selectedFeatures.length;i++){
this.unselect(this.layer.selectedFeatures[i]);
}
}
this.select(_6d1);
}
}
},overFeature:function(_6d3){
if(!this.hover){
return;
}
if(!(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_6d3)>-1)){
this.select(_6d3);
}
},outFeature:function(_6d4){
if(!this.hover){
return;
}
this.unselect(_6d4);
},select:function(_6d5){
if(_6d5.originalStyle==null){
_6d5.originalStyle=_6d5.style;
}
this.layer.selectedFeatures.push(_6d5);
_6d5.style=this.selectStyle;
this.layer.drawFeature(_6d5);
this.onSelect(_6d5);
},unselect:function(_6d6){
if(_6d6.originalStyle!=null){
_6d6.style=_6d6.originalStyle;
}
this.layer.drawFeature(_6d6);
OpenLayers.Util.removeItem(this.layer.selectedFeatures,_6d6);
this.onUnselect(_6d6);
},setMap:function(map){
this.handler.setMap(map);
OpenLayers.Control.prototype.setMap.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Control.SelectFeature"});
OpenLayers.Control.ZoomBox=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask});
},zoomBox:function(_6d8){
if(_6d8 instanceof OpenLayers.Bounds){
var _6d9=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_6d8.left,_6d8.bottom));
var _6da=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_6d8.right,_6d8.top));
var _6db=new OpenLayers.Bounds(_6d9.lon,_6d9.lat,_6da.lon,_6da.lat);
this.map.zoomToExtent(_6db);
}else{
this.map.setCenter(this.map.getLonLatFromPixel(_6d8),this.map.getZoom()+1);
}
},CLASS_NAME:"OpenLayers.Control.ZoomBox"});
OpenLayers.Format.WKT=OpenLayers.Class(OpenLayers.Format,{initialize:function(_6dc){
this.regExes={"typeStr":/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,"spaces":/\s+/,"parenComma":/\)\s*,\s*\(/,"doubleParenComma":/\)\s*\)\s*,\s*\(\s*\(/,"trimParens":/^\s*\(?(.*?)\)?\s*$/};
OpenLayers.Format.prototype.initialize.apply(this,[_6dc]);
},read:function(wkt){
var _6de,type,str;
var _6df=this.regExes.typeStr.exec(wkt);
if(_6df){
type=_6df[1].toLowerCase();
str=_6df[2];
if(this.parse[type]){
_6de=this.parse[type].apply(this,[str]);
}
}
return _6de;
},write:function(_6e0){
var _6e1,geometry,type,data,isCollection;
if(_6e0.constructor==Array){
_6e1=_6e0;
isCollection=true;
}else{
_6e1=[_6e0];
isCollection=false;
}
var _6e2=[];
if(isCollection){
_6e2.push("GEOMETRYCOLLECTION(");
}
for(var i=0;i<_6e1.length;++i){
if(isCollection&&i>0){
_6e2.push(",");
}
geometry=_6e1[i].geometry;
type=geometry.CLASS_NAME.split(".")[2].toLowerCase();
if(!this.extract[type]){
return null;
}
data=this.extract[type].apply(this,[geometry]);
_6e2.push(type.toUpperCase()+"("+data+")");
}
if(isCollection){
_6e2.push(")");
}
return _6e2.join("");
},extract:{"point":function(_6e4){
return _6e4.x+" "+_6e4.y;
},"multipoint":function(_6e5){
var _6e6=[];
for(var i=0;i<_6e5.components.length;++i){
_6e6.push(this.extract.point.apply(this,[_6e5.components[i]]));
}
return _6e6.join(",");
},"linestring":function(_6e8){
var _6e9=[];
for(var i=0;i<_6e8.components.length;++i){
_6e9.push(this.extract.point.apply(this,[_6e8.components[i]]));
}
return _6e9.join(",");
},"multilinestring":function(_6eb){
var _6ec=[];
for(var i=0;i<_6eb.components.length;++i){
_6ec.push("("+this.extract.linestring.apply(this,[_6eb.components[i]])+")");
}
return _6ec.join(",");
},"polygon":function(_6ee){
var _6ef=[];
for(var i=0;i<_6ee.components.length;++i){
_6ef.push("("+this.extract.linestring.apply(this,[_6ee.components[i]])+")");
}
return _6ef.join(",");
},"multipolygon":function(_6f1){
var _6f2=[];
for(var i=0;i<_6f1.components.length;++i){
_6f2.push("("+this.extract.polygon.apply(this,[_6f1.components[i]])+")");
}
return _6f2.join(",");
}},parse:{"point":function(str){
var _6f5=OpenLayers.String.trim(str).split(this.regExes.spaces);
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_6f5[0],_6f5[1]));
},"multipoint":function(str){
var _6f7=OpenLayers.String.trim(str).split(",");
var _6f8=[];
for(var i=0;i<_6f7.length;++i){
_6f8.push(this.parse.point.apply(this,[_6f7[i]]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPoint(_6f8));
},"linestring":function(str){
var _6fb=OpenLayers.String.trim(str).split(",");
var _6fc=[];
for(var i=0;i<_6fb.length;++i){
_6fc.push(this.parse.point.apply(this,[_6fb[i]]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(_6fc));
},"multilinestring":function(str){
var line;
var _700=OpenLayers.String.trim(str).split(this.regExes.parenComma);
var _701=[];
for(var i=0;i<_700.length;++i){
line=_700[i].replace(this.regExes.trimParens,"$1");
_701.push(this.parse.linestring.apply(this,[line]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(_701));
},"polygon":function(str){
var ring,linestring,linearring;
var _705=OpenLayers.String.trim(str).split(this.regExes.parenComma);
var _706=[];
for(var i=0;i<_705.length;++i){
ring=_705[i].replace(this.regExes.trimParens,"$1");
linestring=this.parse.linestring.apply(this,[ring]).geometry;
linearring=new OpenLayers.Geometry.LinearRing(linestring.components);
_706.push(linearring);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(_706));
},"multipolygon":function(str){
var _709;
var _70a=OpenLayers.String.trim(str).split(this.regExes.doubleParenComma);
var _70b=[];
for(var i=0;i<_70a.length;++i){
_709=_70a[i].replace(this.regExes.trimParens,"$1");
_70b.push(this.parse.polygon.apply(this,[_709]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon(_70b));
},"geometrycollection":function(str){
str=str.replace(/,\s*([A-Za-z])/g,"|$1");
var _70e=OpenLayers.String.trim(str).split("|");
var _70f=[];
for(var i=0;i<_70e.length;++i){
_70f.push(OpenLayers.Format.WKT.prototype.read.apply(this,[_70e[i]]));
}
return _70f;
}},CLASS_NAME:"OpenLayers.Format.WKT"});
OpenLayers.Layer.Boxes=OpenLayers.Class(OpenLayers.Layer.Markers,{initialize:function(name,_712){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
},drawMarker:function(_713){
var _714=_713.bounds;
var _715=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_714.left,_714.top));
var _716=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_714.right,_714.bottom));
if(_716==null||_715==null){
_713.display(false);
}else{
var sz=new OpenLayers.Size(Math.max(1,_716.x-_715.x),Math.max(1,_716.y-_715.y));
var _718=_713.draw(_715,sz);
if(!_713.drawn){
this.div.appendChild(_718);
_713.drawn=true;
}
}
},removeMarker:function(_719){
OpenLayers.Util.removeItem(this.markers,_719);
if((_719.div!=null)&&(_719.div.parentNode==this.div)){
this.div.removeChild(_719.div);
}
},CLASS_NAME:"OpenLayers.Layer.Boxes"});
OpenLayers.Layer.GeoRSS=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,icon:null,popupSize:null,useFeedTitle:true,initialize:function(name,_71b,_71c){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,[name,_71c]);
this.location=_71b;
this.features=[];
this.events.triggerEvent("loadstart");
OpenLayers.loadURL(_71b,null,this,this.parseData);
},destroy:function(){
this.clearFeatures();
this.features=null;
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
},parseData:function(_71d){
var doc=_71d.responseXML;
if(!doc||_71d.fileType!="XML"){
doc=OpenLayers.parseXMLString(_71d.responseText);
}
if(this.useFeedTitle){
var name=null;
try{
name=doc.getElementsByTagNameNS("*","title")[0].firstChild.nodeValue;
}
catch(e){
name=doc.getElementsByTagName("title")[0].firstChild.nodeValue;
}
if(name){
this.setName(name);
}
}
var _720=null;
try{
_720=doc.getElementsByTagNameNS("*","item");
}
catch(e){
_720=doc.getElementsByTagName("item");
}
if(_720.length==0){
try{
_720=doc.getElementsByTagNameNS("*","entry");
}
catch(e){
_720=doc.getElementsByTagName("entry");
}
}
for(var i=0;i<_720.length;i++){
var data={};
var _723=OpenLayers.Util.getNodes(_720[i],"georss:point");
var lat=OpenLayers.Util.getNodes(_720[i],"geo:lat");
var lon=OpenLayers.Util.getNodes(_720[i],"geo:long");
if(_723.length>0){
var _726=_723[0].firstChild.nodeValue.split(" ");
if(_726.length!=2){
var _726=_723[0].firstChild.nodeValue.split(",");
}
}else{
if(lat.length>0&&lon.length>0){
var _726=[parseFloat(lat[0].firstChild.nodeValue),parseFloat(lon[0].firstChild.nodeValue)];
}else{
continue;
}
}
_726=new OpenLayers.LonLat(parseFloat(_726[1]),parseFloat(_726[0]));
var _727="Untitled";
try{
_727=OpenLayers.Util.getNodes(_720[i],"title")[0].firstChild.nodeValue;
}
catch(e){
_727="Untitled";
}
var _728=null;
try{
_728=_720[i].getElementsByTagNameNS("*","description");
}
catch(e){
_728=_720[i].getElementsByTagName("description");
}
if(_728.length==0){
try{
_728=_720[i].getElementsByTagNameNS("*","summary");
}
catch(e){
_728=_720[i].getElementsByTagName("summary");
}
}
var _729="No description.";
try{
_729=_728[0].firstChild.nodeValue;
}
catch(e){
_729="No description.";
}
try{
var link=OpenLayers.Util.getNodes(_720[i],"link")[0].firstChild.nodeValue;
}
catch(e){
try{
var link=OpenLayers.Util.getNodes(_720[i],"link")[0].getAttribute("href");
}
catch(e){
}
}
data.icon=this.icon==null?OpenLayers.Marker.defaultIcon():this.icon.clone();
data.popupSize=this.popupSize?this.popupSize.clone():new OpenLayers.Size(250,120);
if((_727!=null)&&(_729!=null)){
contentHTML="<div class=\"olLayerGeoRSSClose\">[x]</div>";
contentHTML+="<div class=\"olLayerGeoRSSTitle\">";
if(link){
contentHTML+="<a class=\"link\" href=\""+link+"\" target=\"_blank\">";
}
contentHTML+=_727;
if(link){
contentHTML+="</a>";
}
contentHTML+="</div>";
contentHTML+="<div style=\"\" class=\"olLayerGeoRSSDescription\">";
contentHTML+=_729;
contentHTML+="</div>";
data["popupContentHTML"]=contentHTML;
}
var _72b=new OpenLayers.Feature(this,_726,data);
this.features.push(_72b);
var _72c=_72b.createMarker();
_72c.events.register("click",_72b,this.markerClick);
this.addMarker(_72c);
}
this.events.triggerEvent("loadend");
},markerClick:function(evt){
sameMarkerClicked=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!sameMarkerClicked)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!sameMarkerClicked){
var _72f=this.createPopup();
OpenLayers.Event.observe(_72f.div,"click",OpenLayers.Function.bind(function(){
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
},this));
this.layer.map.addPopup(_72f);
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _731=this.features[0];
OpenLayers.Util.removeItem(this.features,_731);
_731.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.GeoRSS"});
OpenLayers.Layer.Google=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:19,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125,0.00002145767211914062,0.00001072883605957031,0.00000536441802978515,0.00000268220901489257],type:null,sphericalMercator:false,initialize:function(name,_733){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
this.addContainerPxFunction();
if(this.sphericalMercator){
OpenLayers.Util.extend(this,OpenLayers.Layer.SphericalMercator);
this.initMercatorParameters();
}
},loadMapObject:function(){
try{
this.mapObject=new GMap2(this.div);
var _734=this.div.lastChild;
this.div.removeChild(_734);
this.pane.appendChild(_734);
_734.className="olLayerGooglePoweredBy gmnoprint";
_734.style.left="";
_734.style.bottom="";
var _735=this.div.lastChild;
this.div.removeChild(_735);
this.pane.appendChild(_735);
_735.className="olLayerGoogleCopyright";
_735.style.right="";
_735.style.bottom="";
}
catch(e){
}
},setMap:function(map){
OpenLayers.Layer.EventPane.prototype.setMap.apply(this,arguments);
if(this.type!=null){
this.map.events.register("moveend",this,this.setMapType);
}
},setMapType:function(){
if(this.mapObject.getCenter()!=null){
this.mapObject.setMapType(this.type);
this.map.events.unregister("moveend",this,this.setMapType);
}
},onMapResize:function(){
this.mapObject.checkResize();
},getOLBoundsFromMapObjectBounds:function(_737){
var _738=null;
if(_737!=null){
var sw=_737.getSouthWest();
var ne=_737.getNorthEast();
if(this.sphericalMercator){
sw=this.forwardMercator(sw.lng(),sw.lat());
ne=this.forwardMercator(ne.lng(),ne.lat());
}else{
sw=new OpenLayers.LonLat(sw.lng(),sw.lat());
ne=new OpenLayers.LonLat(ne.lng(),ne.lat());
}
_738=new OpenLayers.Bounds(sw.lon,sw.lat,ne.lon,ne.lat);
}
return _738;
},getMapObjectBoundsFromOLBounds:function(_73b){
var _73c=null;
if(_73b!=null){
var sw=this.sphericalMercator?this.inverseMercator(_73b.bottom,_73b.left):new OpenLayers.LonLat(_73b.bottom,_73b.left);
var ne=this.sphericalMercator?this.inverseMercator(_73b.top,_73b.right):new OpenLayers.LonLat(_73b.top,_73b.right);
_73c=new GLatLngBounds(new GLatLng(sw.lat,sw.lon),new GLatLng(ne.lat,ne.lon));
}
return _73c;
},addContainerPxFunction:function(){
if((typeof GMap2!="undefined")&&!GMap2.prototype.fromLatLngToContainerPixel){
GMap2.prototype.fromLatLngToContainerPixel=function(_73f){
var _740=this.fromLatLngToDivPixel(_73f);
var div=this.getContainer().firstChild.firstChild;
_740.x+=div.offsetLeft;
_740.y+=div.offsetTop;
return _740;
};
}
},getWarningHTML:function(){
var html="";
html+="The Google Layer was unable to load correctly.<br>";
html+="<br>";
html+="To get rid of this message, select a new BaseLayer ";
html+="in the layer switcher in the upper-right corner.<br>";
html+="<br>";
html+="Most likely, this is because the Google Maps library";
html+=" script was either not included, or does not contain the";
html+=" correct API key for your site.<br>";
html+="<br>";
html+="Developers: For help getting this working correctly, ";
html+="<a href='http://trac.openlayers.org/wiki/Google' ";
html+="target='_blank'>";
html+="click here";
html+="</a>";
return html;
},setMapObjectCenter:function(_743,zoom){
this.mapObject.setCenter(_743,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenter();
},getMapObjectZoom:function(){
return this.mapObject.getZoom();
},getMapObjectLonLatFromMapObjectPixel:function(_745){
return this.mapObject.fromContainerPixelToLatLng(_745);
},getMapObjectPixelFromMapObjectLonLat:function(_746){
return this.mapObject.fromLatLngToContainerPixel(_746);
},getMapObjectZoomFromMapObjectBounds:function(_747){
return this.mapObject.getBoundsZoomLevel(_747);
},getLongitudeFromMapObjectLonLat:function(_748){
return this.sphericalMercator?this.forwardMercator(_748.lng(),_748.lat()).lon:_748.lng();
},getLatitudeFromMapObjectLonLat:function(_749){
var lat=this.sphericalMercator?this.forwardMercator(_749.lng(),_749.lat()).lat:_749.lat();
return lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _74d;
if(this.sphericalMercator){
var _74e=this.inverseMercator(lon,lat);
_74d=new GLatLng(_74e.lat,_74e.lon);
}else{
_74d=new GLatLng(lat,lon);
}
return _74d;
},getXFromMapObjectPixel:function(_74f){
return _74f.x;
},getYFromMapObjectPixel:function(_750){
return _750.y;
},getMapObjectPixelFromXY:function(x,y){
return new GPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.Google"});
OpenLayers.Layer.Grid=OpenLayers.Class(OpenLayers.Layer.HTTPRequest,{tileSize:null,grid:null,singleTile:false,ratio:1.5,buffer:2,numLoadingTiles:0,initialize:function(name,url,_755,_756){
OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this,arguments);
this.events.addEventType("tileloaded");
this.grid=[];
},destroy:function(){
this.clearGrid();
this.grid=null;
this.tileSize=null;
OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this,arguments);
},clearGrid:function(){
if(this.grid){
for(var iRow=0;iRow<this.grid.length;iRow++){
var row=this.grid[iRow];
for(var iCol=0;iCol<row.length;iCol++){
var tile=row[iCol];
this.removeTileMonitoringHooks(tile);
tile.destroy();
}
}
this.grid=[];
}
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.Grid(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this,[obj]);
if(this.tileSize!=null){
obj.tileSize=this.tileSize.clone();
}
obj.grid=[];
return obj;
},moveTo:function(_75c,_75d,_75e){
OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
_75c=_75c||this.map.getExtent();
if(_75c!=null){
var _75f=!this.grid.length||_75d;
var _760=this.getTilesBounds();
if(this.singleTile){
if(_75f||(!_75e&&!_760.containsBounds(_75c))){
this.initSingleTile(_75c);
}
}else{
if(_75f||!_760.containsBounds(_75c,true)){
this.initGriddedTiles(_75c);
}else{
this.moveGriddedTiles(_75c);
}
}
}
},setTileSize:function(size){
if(this.singleTile){
var size=this.map.getSize().clone();
size.h=parseInt(size.h*this.ratio);
size.w=parseInt(size.w*this.ratio);
}
OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this,[size]);
},getGridBounds:function(){
var msg="The getGridBounds() function is deprecated. It will be "+"removed in 3.0. Please use getTilesBounds() instead.";
OpenLayers.Console.warn(msg);
return this.getTilesBounds();
},getTilesBounds:function(){
var _763=null;
if(this.grid.length){
var _764=this.grid.length-1;
var _765=this.grid[_764][0];
var _766=this.grid[0].length-1;
var _767=this.grid[0][_766];
_763=new OpenLayers.Bounds(_765.bounds.left,_765.bounds.bottom,_767.bounds.right,_767.bounds.top);
}
return _763;
},initSingleTile:function(_768){
var _769=_768.getCenterLonLat();
var _76a=_768.getWidth()*this.ratio;
var _76b=_768.getHeight()*this.ratio;
var _76c=new OpenLayers.Bounds(_769.lon-(_76a/2),_769.lat-(_76b/2),_769.lon+(_76a/2),_769.lat+(_76b/2));
var ul=new OpenLayers.LonLat(_76c.left,_76c.top);
var px=this.map.getLayerPxFromLonLat(ul);
if(!this.grid.length){
this.grid[0]=[];
}
var tile=this.grid[0][0];
if(!tile){
tile=this.addTile(_76c,px);
this.addTileMonitoringHooks(tile);
tile.draw();
this.grid[0][0]=tile;
}else{
tile.moveTo(_76c,px);
}
this.removeExcessTiles(1,1);
},initGriddedTiles:function(_770){
var _771=this.map.getSize();
var _772=Math.ceil(_771.h/this.tileSize.h)+Math.max(1,2*this.buffer);
var _773=Math.ceil(_771.w/this.tileSize.w)+Math.max(1,2*this.buffer);
var _774=this.map.getMaxExtent();
var _775=this.map.getResolution();
var _776=_775*this.tileSize.w;
var _777=_775*this.tileSize.h;
var _778=_770.left-_774.left;
var _779=Math.floor(_778/_776)-this.buffer;
var _77a=_778/_776-_779;
var _77b=-_77a*this.tileSize.w;
var _77c=_774.left+_779*_776;
var _77d=_770.top-(_774.bottom+_777);
var _77e=Math.ceil(_77d/_777)+this.buffer;
var _77f=_77e-_77d/_777;
var _780=-_77f*this.tileSize.h;
var _781=_774.bottom+_77e*_777;
_77b=Math.round(_77b);
_780=Math.round(_780);
this.origin=new OpenLayers.Pixel(_77b,_780);
var _782=_77b;
var _783=_77c;
var _784=0;
do{
var row=this.grid[_784++];
if(!row){
row=[];
this.grid.push(row);
}
_77c=_783;
_77b=_782;
var _786=0;
do{
var _787=new OpenLayers.Bounds(_77c,_781,_77c+_776,_781+_777);
var x=_77b;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_780;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile=row[_786++];
if(!tile){
tile=this.addTile(_787,px);
this.addTileMonitoringHooks(tile);
row.push(tile);
}else{
tile.moveTo(_787,px,false);
}
_77c+=_776;
_77b+=this.tileSize.w;
}while((_77c<=_770.right+_776*this.buffer)||_786<_773);
_781-=_777;
_780+=this.tileSize.h;
}while((_781>=_770.bottom-_777*this.buffer)||_784<_772);
this.removeExcessTiles(_784,_786);
this.spiralTileLoad();
},spiralTileLoad:function(){
var _78c=[];
var _78d=["right","down","left","up"];
var iRow=0;
var _78f=-1;
var _790=OpenLayers.Util.indexOf(_78d,"right");
var _791=0;
while(_791<_78d.length){
var _792=iRow;
var _793=_78f;
switch(_78d[_790]){
case "right":
_793++;
break;
case "down":
_792++;
break;
case "left":
_793--;
break;
case "up":
_792--;
break;
}
var tile=null;
if((_792<this.grid.length)&&(_792>=0)&&(_793<this.grid[0].length)&&(_793>=0)){
tile=this.grid[_792][_793];
}
if((tile!=null)&&(!tile.queued)){
_78c.unshift(tile);
tile.queued=true;
_791=0;
iRow=_792;
_78f=_793;
}else{
_790=(_790+1)%4;
_791++;
}
}
for(var i=0;i<_78c.length;i++){
var tile=_78c[i];
tile.draw();
tile.queued=false;
}
},addTile:function(_796,_797){
},addTileMonitoringHooks:function(tile){
tile.onLoadStart=function(){
if(this.numLoadingTiles==0){
this.events.triggerEvent("loadstart");
}
this.numLoadingTiles++;
};
tile.events.register("loadstart",this,tile.onLoadStart);
tile.onLoadEnd=function(){
this.numLoadingTiles--;
this.events.triggerEvent("tileloaded");
if(this.numLoadingTiles==0){
this.events.triggerEvent("loadend");
}
};
tile.events.register("loadend",this,tile.onLoadEnd);
},removeTileMonitoringHooks:function(tile){
tile.events.unregister("loadstart",this,tile.onLoadStart);
tile.events.unregister("loadend",this,tile.onLoadEnd);
},moveGriddedTiles:function(_79a){
var _79b=this.buffer||1;
while(true){
var _79c=this.grid[0][0].position;
var _79d=this.map.getViewPortPxFromLayerPx(_79c);
if(_79d.x>-this.tileSize.w*(_79b-1)){
this.shiftColumn(true);
}else{
if(_79d.x<-this.tileSize.w*_79b){
this.shiftColumn(false);
}else{
if(_79d.y>-this.tileSize.h*(_79b-1)){
this.shiftRow(true);
}else{
if(_79d.y<-this.tileSize.h*_79b){
this.shiftRow(false);
}else{
break;
}
}
}
}
}
if(this.buffer==0){
for(var r=0,rl=this.grid.length;r<rl;r++){
var row=this.grid[r];
for(var c=0,cl=row.length;c<cl;c++){
var tile=row[c];
if(!tile.drawn&&tile.bounds.intersectsBounds(_79a,false)){
tile.draw();
}
}
}
}
},shiftRow:function(_7a2){
var _7a3=(_7a2)?0:(this.grid.length-1);
var _7a4=this.grid[_7a3];
var _7a5=this.map.getResolution();
var _7a6=(_7a2)?-this.tileSize.h:this.tileSize.h;
var _7a7=_7a5*-_7a6;
var row=(_7a2)?this.grid.pop():this.grid.shift();
for(var i=0;i<_7a4.length;i++){
var _7aa=_7a4[i];
var _7ab=_7aa.bounds.clone();
var _7ac=_7aa.position.clone();
_7ab.bottom=_7ab.bottom+_7a7;
_7ab.top=_7ab.top+_7a7;
_7ac.y=_7ac.y+_7a6;
row[i].moveTo(_7ab,_7ac);
}
if(_7a2){
this.grid.unshift(row);
}else{
this.grid.push(row);
}
},shiftColumn:function(_7ad){
var _7ae=(_7ad)?-this.tileSize.w:this.tileSize.w;
var _7af=this.map.getResolution();
var _7b0=_7af*_7ae;
for(var i=0;i<this.grid.length;i++){
var row=this.grid[i];
var _7b3=(_7ad)?0:(row.length-1);
var _7b4=row[_7b3];
var _7b5=_7b4.bounds.clone();
var _7b6=_7b4.position.clone();
_7b5.left=_7b5.left+_7b0;
_7b5.right=_7b5.right+_7b0;
_7b6.x=_7b6.x+_7ae;
var tile=_7ad?this.grid[i].pop():this.grid[i].shift();
tile.moveTo(_7b5,_7b6);
if(_7ad){
this.grid[i].unshift(tile);
}else{
this.grid[i].push(tile);
}
}
},removeExcessTiles:function(rows,_7b9){
while(this.grid.length>rows){
var row=this.grid.pop();
for(var i=0,l=row.length;i<l;i++){
var tile=row[i];
this.removeTileMonitoringHooks(tile);
tile.destroy();
}
}
while(this.grid[0].length>_7b9){
for(var i=0,l=this.grid.length;i<l;i++){
var row=this.grid[i];
var tile=row.pop();
this.removeTileMonitoringHooks(tile);
tile.destroy();
}
}
},onMapResize:function(){
if(this.singleTile){
this.clearGrid();
this.setTileSize();
this.initSingleTile(this.map.getExtent());
}
},getTileBounds:function(_7bd){
var _7be=this.map.getMaxExtent();
var _7bf=this.getResolution();
var _7c0=_7bf*this.tileSize.w;
var _7c1=_7bf*this.tileSize.h;
var _7c2=this.getLonLatFromViewPortPx(_7bd);
var _7c3=_7be.left+(_7c0*Math.floor((_7c2.lon-_7be.left)/_7c0));
var _7c4=_7be.bottom+(_7c1*Math.floor((_7c2.lat-_7be.bottom)/_7c1));
return new OpenLayers.Bounds(_7c3,_7c4,_7c3+_7c0,_7c4+_7c1);
},CLASS_NAME:"OpenLayers.Layer.Grid"});
OpenLayers.Layer.MultiMap=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[9,1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_7c6){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
if(this.sphericalMercator){
OpenLayers.Util.extend(this,OpenLayers.Layer.SphericalMercator);
this.initMercatorParameters();
this.RESOLUTIONS.unshift(10);
}
},loadMapObject:function(){
try{
this.mapObject=new MultimapViewer(this.div);
}
catch(e){
}
},getWarningHTML:function(){
var html="";
html+="The MM Layer was unable to load correctly.<br>";
html+="<br>";
html+="To get rid of this message, select a new BaseLayer ";
html+="in the layer switcher in the upper-right corner.<br>";
html+="<br>";
html+="Most likely, this is because the MM library";
html+=" script was either not correctly included.<br>";
html+="<br>";
html+="Demmlopers: For help getting this working correctly, ";
html+="<a href='http://trac.openlayers.org/wiki/MultiMap' ";
html+="target='_blank'>";
html+="click here";
html+="</a>";
return html;
},setMapObjectCenter:function(_7c8,zoom){
this.mapObject.goToPosition(_7c8,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCurrentPosition();
},getMapObjectZoom:function(){
return this.mapObject.getZoomFactor();
},getMapObjectLonLatFromMapObjectPixel:function(_7ca){
_7ca.x=_7ca.x-(this.map.getSize().w/2);
_7ca.y=_7ca.y-(this.map.getSize().h/2);
return this.mapObject.getMapPositionAt(_7ca);
},getMapObjectPixelFromMapObjectLonLat:function(_7cb){
return this.mapObject.geoPosToContainerPixels(_7cb);
},getLongitudeFromMapObjectLonLat:function(_7cc){
return this.sphericalMercator?this.forwardMercator(_7cc.lon,_7cc.lat).lon:_7cc.lon;
},getLatitudeFromMapObjectLonLat:function(_7cd){
return this.sphericalMercator?this.forwardMercator(_7cd.lon,_7cd.lat).lat:_7cd.lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _7d0;
if(this.sphericalMercator){
var _7d1=this.inverseMercator(lon,lat);
_7d0=new MMLatLon(_7d1.lat,_7d1.lon);
}else{
_7d0=new MMLatLon(lat,lon);
}
return _7d0;
},getXFromMapObjectPixel:function(_7d2){
return _7d2.x;
},getYFromMapObjectPixel:function(_7d3){
return _7d3.y;
},getMapObjectPixelFromXY:function(x,y){
return new MMPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.MultiMap"});
OpenLayers.Layer.Text=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,initialize:function(name,_7d7){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
this.features=new Array();
if(this.location!=null){
var _7d8=function(e){
this.events.triggerEvent("loadend");
};
this.events.triggerEvent("loadstart");
OpenLayers.loadURL(this.location,null,this,this.parseData,_7d8);
}
},destroy:function(){
this.clearFeatures();
this.features=null;
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
},parseData:function(_7da){
var text=_7da.responseText;
var _7dc=text.split("\n");
var _7dd;
for(var lcv=0;lcv<(_7dc.length-1);lcv++){
var _7df=_7dc[lcv].replace(/^\s*/,"").replace(/\s*$/,"");
if(_7df.charAt(0)!="#"){
if(!_7dd){
_7dd=_7df.split("\t");
}else{
var vals=_7df.split("\t");
var _7e1=new OpenLayers.LonLat(0,0);
var _7e2;
var url;
var icon,iconSize,iconOffset,overflow;
var set=false;
for(var _7e6=0;_7e6<vals.length;_7e6++){
if(vals[_7e6]){
if(_7dd[_7e6]=="point"){
var _7e7=vals[_7e6].split(",");
_7e1.lat=parseFloat(_7e7[0]);
_7e1.lon=parseFloat(_7e7[1]);
set=true;
}else{
if(_7dd[_7e6]=="lat"){
_7e1.lat=parseFloat(vals[_7e6]);
set=true;
}else{
if(_7dd[_7e6]=="lon"){
_7e1.lon=parseFloat(vals[_7e6]);
set=true;
}else{
if(_7dd[_7e6]=="title"){
_7e2=vals[_7e6];
}else{
if(_7dd[_7e6]=="image"||_7dd[_7e6]=="icon"){
url=vals[_7e6];
}else{
if(_7dd[_7e6]=="iconSize"){
var size=vals[_7e6].split(",");
iconSize=new OpenLayers.Size(parseFloat(size[0]),parseFloat(size[1]));
}else{
if(_7dd[_7e6]=="iconOffset"){
var _7e9=vals[_7e6].split(",");
iconOffset=new OpenLayers.Pixel(parseFloat(_7e9[0]),parseFloat(_7e9[1]));
}else{
if(_7dd[_7e6]=="title"){
_7e2=vals[_7e6];
}else{
if(_7dd[_7e6]=="description"){
description=vals[_7e6];
}else{
if(_7dd[_7e6]=="overflow"){
overflow=vals[_7e6];
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
if(set){
var data={};
if(url!=null){
data.icon=new OpenLayers.Icon(url,iconSize,iconOffset);
}else{
data.icon=OpenLayers.Marker.defaultIcon();
if(iconSize!=null){
data.icon.setSize(iconSize);
}
}
if((_7e2!=null)&&(description!=null)){
data["popupContentHTML"]="<h2>"+_7e2+"</h2><p>"+description+"</p>";
}
data["overflow"]=overflow||"auto";
var _7eb=new OpenLayers.Feature(this,_7e1,data);
this.features.push(_7eb);
var _7ec=_7eb.createMarker();
if((_7e2!=null)&&(description!=null)){
_7ec.events.register("click",_7eb,this.markerClick);
}
this.addMarker(_7ec);
}
}
}
}
this.events.triggerEvent("loadend");
},markerClick:function(evt){
var _7ee=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!_7ee)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!_7ee){
this.layer.map.addPopup(this.createPopup());
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _7f0=this.features[0];
OpenLayers.Util.removeItem(this.features,_7f0);
_7f0.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.Text"});
OpenLayers.Layer.Vector=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:false,isFixed:false,isVector:true,features:null,selectedFeatures:null,reportError:true,style:null,renderers:["SVG","VML"],renderer:null,geometryType:null,drawn:false,initialize:function(name,_7f2){
var _7f3=OpenLayers.Feature.Vector.style["default"];
this.style=OpenLayers.Util.extend({},_7f3);
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
if(!this.renderer||!this.renderer.supported()){
this.assignRenderer();
}
if(!this.renderer||!this.renderer.supported()){
this.renderer=null;
this.displayError();
}
this.features=[];
this.selectedFeatures=[];
},destroy:function(){
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
this.destroyFeatures();
this.features=null;
this.selectedFeatures=null;
if(this.renderer){
this.renderer.destroy();
}
this.renderer=null;
this.geometryType=null;
this.drawn=null;
},assignRenderer:function(){
for(var i=0;i<this.renderers.length;i++){
var _7f5=OpenLayers.Renderer[this.renderers[i]];
if(_7f5&&_7f5.prototype.supported()){
this.renderer=new _7f5(this.div);
break;
}
}
},displayError:function(){
if(this.reportError){
var _7f6="Your browser does not support vector rendering. "+"Currently supported renderers are:\n";
_7f6+=this.renderers.join("\n");
alert(_7f6);
}
},setMap:function(map){
OpenLayers.Layer.prototype.setMap.apply(this,arguments);
if(!this.renderer){
this.map.removeLayer(this);
}else{
this.renderer.map=this.map;
this.renderer.setSize(this.map.getSize());
}
},onMapResize:function(){
OpenLayers.Layer.prototype.onMapResize.apply(this,arguments);
this.renderer.setSize(this.map.getSize());
},moveTo:function(_7f8,_7f9,_7fa){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(!_7fa){
this.div.style.left=-parseInt(this.map.layerContainerDiv.style.left)+"px";
this.div.style.top=-parseInt(this.map.layerContainerDiv.style.top)+"px";
var _7fb=this.map.getExtent();
this.renderer.setExtent(_7fb);
}
if(!this.drawn||_7f9){
this.drawn=true;
for(var i=0;i<this.features.length;i++){
var _7fd=this.features[i];
this.drawFeature(_7fd);
}
}
},addFeatures:function(_7fe){
if(!(_7fe instanceof Array)){
_7fe=[_7fe];
}
for(var i=0;i<_7fe.length;i++){
var _800=_7fe[i];
if(this.geometryType&&!(_800.geometry instanceof this.geometryType)){
var _801="addFeatures : component should be an "+this.geometryType.prototype.CLASS_NAME;
throw _801;
}
this.features.push(_800);
_800.layer=this;
if(!_800.style){
_800.style=OpenLayers.Util.extend({},this.style);
}
this.preFeatureInsert(_800);
if(this.drawn){
this.drawFeature(_800);
}
this.onFeatureInsert(_800);
}
},removeFeatures:function(_802){
if(!(_802 instanceof Array)){
_802=[_802];
}
for(var i=_802.length-1;i>=0;i--){
var _804=_802[i];
this.features=OpenLayers.Util.removeItem(this.features,_804);
if(_804.geometry){
this.renderer.eraseGeometry(_804.geometry);
}
if(OpenLayers.Util.indexOf(this.selectedFeatures,_804)!=-1){
OpenLayers.Util.removeItem(this.selectedFeatures,_804);
}
}
},destroyFeatures:function(){
this.selectedFeatures=[];
for(var i=this.features.length-1;i>=0;i--){
this.features[i].destroy();
}
},drawFeature:function(_806,_807){
if(_807==null){
if(_806.style){
_807=_806.style;
}else{
_807=this.style;
}
}
this.renderer.drawFeature(_806,_807);
},eraseFeatures:function(_808){
this.renderer.eraseFeatures(_808);
},getFeatureFromEvent:function(evt){
if(!this.renderer){
OpenLayers.Console.error("getFeatureFromEvent called on layer with no renderer. This usually means you destroyed a layer, but not some handler which is associated with it.");
return null;
}
var _80a=this.renderer.getFeatureIdFromEvent(evt);
return this.getFeatureById(_80a);
},getFeatureById:function(_80b){
var _80c=null;
for(var i=0;i<this.features.length;++i){
if(this.features[i].id==_80b){
_80c=this.features[i];
break;
}
}
return _80c;
},onFeatureInsert:function(_80e){
},preFeatureInsert:function(_80f){
},CLASS_NAME:"OpenLayers.Layer.Vector"});
OpenLayers.Layer.VirtualEarth=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,sphericalMercator:false,initialize:function(name,_811){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
if(this.sphericalMercator){
OpenLayers.Util.extend(this,OpenLayers.Layer.SphericalMercator);
this.initMercatorParameters();
}
},loadMapObject:function(){
var _812=OpenLayers.Util.createDiv(this.name);
var sz=this.map.getSize();
_812.style.width=sz.w;
_812.style.height=sz.h;
this.div.appendChild(_812);
try{
this.mapObject=new VEMap(this.name);
}
catch(e){
}
if(this.mapObject!=null){
try{
this.mapObject.LoadMap(null,null,this.type);
}
catch(e){
}
this.mapObject.HideDashboard();
}
},getWarningHTML:function(){
var html="";
html+="The VE Layer was unable to load correctly.<br>";
html+="<br>";
html+="To get rid of this message, select a new BaseLayer ";
html+="in the layer switcher in the upper-right corner.<br>";
html+="<br>";
html+="Most likely, this is because the VE library";
html+=" script was either not correctly included.<br>";
html+="<br>";
html+="Developers: For help getting this working correctly, ";
html+="<a href='http://trac.openlayers.org/wiki/VirtualEarth' ";
html+="target='_blank'>";
html+="click here";
html+="</a>";
return html;
},setMapObjectCenter:function(_815,zoom){
this.mapObject.SetCenterAndZoom(_815,zoom);
},getMapObjectCenter:function(){
return this.mapObject.GetCenter();
},getMapObjectZoom:function(){
return this.mapObject.GetZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_817){
return this.mapObject.PixelToLatLong(_817.x,_817.y);
},getMapObjectPixelFromMapObjectLonLat:function(_818){
return this.mapObject.LatLongToPixel(_818);
},getLongitudeFromMapObjectLonLat:function(_819){
return this.sphericalMercator?this.forwardMercator(_819.Longitude,_819.Latitude).lon:_819.Longitude;
},getLatitudeFromMapObjectLonLat:function(_81a){
return this.sphericalMercator?this.forwardMercator(_81a.Longitude,_81a.Latitude).lat:_81a.Latitude;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _81d;
if(this.sphericalMercator){
var _81e=this.inverseMercator(lon,lat);
_81d=new VELatLong(_81e.lat,_81e.lon);
}else{
_81d=new VELatLong(lat,lon);
}
return _81d;
},getXFromMapObjectPixel:function(_81f){
return _81f.x;
},getYFromMapObjectPixel:function(_820){
return _820.y;
},getMapObjectPixelFromXY:function(x,y){
return new Msn.VE.Pixel(x,y);
},CLASS_NAME:"OpenLayers.Layer.VirtualEarth"});
OpenLayers.Layer.Yahoo=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:15,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,sphericalMercator:false,initialize:function(name,_824){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
if(this.sphericalMercator){
OpenLayers.Util.extend(this,OpenLayers.Layer.SphericalMercator);
this.initMercatorParameters();
}
},loadMapObject:function(){
try{
var size=this.getMapObjectSizeFromOLSize(this.map.getSize());
this.mapObject=new YMap(this.div,this.type,size);
this.mapObject.disableKeyControls();
this.mapObject.disableDragMap();
}
catch(e){
}
},onMapResize:function(){
try{
var size=this.getMapObjectSizeFromOLSize(this.map.getSize());
this.mapObject.resizeTo(size);
}
catch(e){
}
},setMap:function(map){
OpenLayers.Layer.EventPane.prototype.setMap.apply(this,arguments);
this.map.events.register("moveend",this,this.fixYahooEventPane);
},fixYahooEventPane:function(){
var _828=OpenLayers.Util.getElement("ygddfdiv");
if(_828!=null){
if(_828.parentNode!=null){
_828.parentNode.removeChild(_828);
}
this.map.events.unregister("moveend",this,this.fixYahooEventPane);
}
},getWarningHTML:function(){
var html="";
html+="The Yahoo Layer was unable to load correctly.<br>";
html+="<br>";
html+="To get rid of this message, select a new BaseLayer ";
html+="in the layer switcher in the upper-right corner.<br>";
html+="<br>";
html+="Most likely, this is because the Yahoo library";
html+=" script was either not correctly included.<br>";
html+="<br>";
html+="Developers: For help getting this working correctly, ";
html+="<a href='http://trac.openlayers.org/wiki/Yahoo' ";
html+="target='_blank'>";
html+="click here";
html+="</a>";
return html;
},getOLZoomFromMapObjectZoom:function(_82a){
var zoom=null;
if(_82a!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getOLZoomFromMapObjectZoom.apply(this,[_82a]);
zoom=18-zoom;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_82c){
var zoom=null;
if(_82c!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getMapObjectZoomFromOLZoom.apply(this,[_82c]);
zoom=18-zoom;
}
return zoom;
},setMapObjectCenter:function(_82e,zoom){
this.mapObject.drawZoomAndCenter(_82e,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenterLatLon();
},getMapObjectZoom:function(){
return this.mapObject.getZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_830){
return this.mapObject.convertXYLatLon(_830);
},getMapObjectPixelFromMapObjectLonLat:function(_831){
return this.mapObject.convertLatLonXY(_831);
},getLongitudeFromMapObjectLonLat:function(_832){
return this.sphericalMercator?this.forwardMercator(_832.Lon,_832.Lat).lon:_832.Lon;
},getLatitudeFromMapObjectLonLat:function(_833){
return this.sphericalMercator?this.forwardMercator(_833.Lon,_833.Lat).lat:_833.Lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _836;
if(this.sphericalMercator){
var _837=this.inverseMercator(lon,lat);
_836=new YGeoPoint(_837.lat,_837.lon);
}else{
_836=new YGeoPoint(lat,lon);
}
return _836;
},getXFromMapObjectPixel:function(_838){
return _838.x;
},getYFromMapObjectPixel:function(_839){
return _839.y;
},getMapObjectPixelFromXY:function(x,y){
return new YCoordPoint(x,y);
},getMapObjectSizeFromOLSize:function(_83c){
return new YSize(_83c.w,_83c.h);
},CLASS_NAME:"OpenLayers.Layer.Yahoo"});
OpenLayers.Control.ModifyFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,layer:null,feature:null,vertices:null,virtualVertices:null,selectControl:null,dragControl:null,keyboardHandler:null,deleteCodes:null,virtualStyle:null,onModificationStart:function(){
},onModification:function(){
},onModificationEnd:function(){
},initialize:function(_83d,_83e){
this.layer=_83d;
this.vertices=[];
this.virtualVertices=[];
this.styleVirtual=OpenLayers.Util.extend({},this.layer.style);
this.styleVirtual.fillOpacity=0.3;
this.styleVirtual.strokeOpacity=0.3;
this.deleteCodes=[46,100];
OpenLayers.Control.prototype.initialize.apply(this,[_83e]);
if(!(this.deleteCodes instanceof Array)){
this.deleteCodes=[this.deleteCodes];
}
var _83f=this;
var _840={geometryTypes:this.geometryTypes,onSelect:function(_841){
_83f.selectFeature.apply(_83f,[_841]);
},onUnselect:function(_842){
_83f.unselectFeature.apply(_83f,[_842]);
}};
this.selectControl=new OpenLayers.Control.SelectFeature(_83d,_840);
var _843={geometryTypes:["OpenLayers.Geometry.Point"],snappingOptions:this.snappingOptions,onStart:function(_844,_845){
_83f.dragStart.apply(_83f,[_844,_845]);
},onDrag:function(_846){
_83f.dragVertex.apply(_83f,[_846]);
},onComplete:function(_847){
_83f.dragComplete.apply(_83f,[_847]);
}};
this.dragControl=new OpenLayers.Control.DragFeature(_83d,_843);
var _848={keypress:this.handleKeypress};
this.keyboardHandler=new OpenLayers.Handler.Keyboard(this,_848);
},destroy:function(){
this.layer=null;
this.selectControl.destroy();
this.dragControl.destroy();
this.keyboardHandler.destroy();
OpenLayers.Control.prototype.destroy.apply(this,[]);
},activate:function(){
return (this.selectControl.activate()&&this.keyboardHandler.activate()&&OpenLayers.Control.prototype.activate.apply(this,arguments));
},deactivate:function(){
var _849=false;
if(OpenLayers.Control.prototype.deactivate.apply(this,arguments)){
this.layer.removeFeatures(this.vertices);
this.layer.removeFeatures(this.virtualVertices);
this.vertices=[];
this.dragControl.deactivate();
if(this.feature){
this.selectControl.unselect.apply(this.selectControl,[this.feature]);
}
this.selectControl.deactivate();
this.keyboardHandler.deactivate();
_849=true;
}
return _849;
},selectFeature:function(_84a){
this.feature=_84a;
this.resetVertices();
this.dragControl.activate();
this.onModificationStart(this.feature);
},unselectFeature:function(_84b){
this.layer.removeFeatures(this.vertices);
this.layer.removeFeatures(this.virtualVertices);
this.vertices=[];
this.virtualVertices=[];
this.feature=null;
this.dragControl.deactivate();
this.onModificationEnd(_84b);
},dragStart:function(_84c,_84d){
if(_84c!=this.feature&&OpenLayers.Util.indexOf(this.vertices,_84c)==-1&&OpenLayers.Util.indexOf(this.virtualVertices,_84c)==-1){
if(this.feature){
this.selectControl.clickFeature.apply(this.selectControl,[this.feature]);
}
if(this.geometryTypes==null||OpenLayers.Util.indexOf(this.geometryTypes,_84c.geometry.CLASS_NAME)!=-1){
this.selectControl.clickFeature.apply(this.selectControl,[_84c]);
this.dragControl.overFeature.apply(this.dragControl,[_84c]);
this.dragControl.lastPixel=_84d;
this.dragControl.dragHandler.started=true;
this.dragControl.dragHandler.start=_84d;
this.dragControl.dragHandler.last=_84d;
}
}
},dragVertex:function(_84e){
if(this.feature.geometry.CLASS_NAME=="OpenLayers.Geometry.Point"){
if(this.feature!=_84e){
this.feature=_84e;
}
}else{
if(OpenLayers.Util.indexOf(this.virtualVertices,_84e)!=-1){
_84e.geometry.parent.addComponent(_84e.geometry,_84e._index);
delete _84e._index;
OpenLayers.Util.removeItem(this.virtualVertices,_84e);
this.layer.removeFeatures(_84e);
}
}
this.layer.drawFeature(this.feature,this.selectControl.selectStyle);
this.layer.removeFeatures(this.virtualVertices);
this.layer.drawFeature(_84e);
},dragComplete:function(_84f){
this.resetVertices();
this.onModification(this.feature);
},resetVertices:function(){
if(this.vertices.length>0){
this.layer.removeFeatures(this.vertices);
this.vertices=[];
}
if(this.virtualVertices.length>0){
this.layer.removeFeatures(this.virtualVertices);
this.virtualVertices=[];
}
if(this.feature&&this.feature.geometry.CLASS_NAME!="OpenLayers.Geometry.Point"){
this.collectVertices(this.feature.geometry);
this.layer.addFeatures(this.vertices);
this.layer.addFeatures(this.virtualVertices);
}
},handleKeypress:function(code){
if(this.feature&&OpenLayers.Util.indexOf(this.deleteCodes,code)!=-1){
var _851=this.dragControl.feature;
if(_851&&OpenLayers.Util.indexOf(this.vertices,_851)!=-1){
_851.geometry.parent.removeComponent(_851.geometry);
this.layer.drawFeature(this.feature,this.selectControl.selectStyle);
this.resetVertices();
this.onModification(this.feature);
}
}
},collectVertices:function(){
this.vertices=[];
this.virtualVirtices=[];
var _852=this;
function collectComponentVertices(_853){
var i,vertex,component;
if(_853.CLASS_NAME=="OpenLayers.Geometry.Point"){
vertex=new OpenLayers.Feature.Vector(_853);
_852.vertices.push(vertex);
}else{
for(i=0;i<_853.components.length;++i){
component=_853.components[i];
if(component.CLASS_NAME=="OpenLayers.Geometry.Point"){
vertex=new OpenLayers.Feature.Vector(component);
_852.vertices.push(vertex);
}else{
collectComponentVertices(component);
}
}
if(_853.CLASS_NAME!="OpenLayers.Geometry.MultiPoint"){
for(i=0;i<_853.components.length-1;++i){
var _855=_853.components[i];
var _856=_853.components[i+1];
if(_855.CLASS_NAME=="OpenLayers.Geometry.Point"&&_856.CLASS_NAME=="OpenLayers.Geometry.Point"){
var x=(_855.x+_856.x)/2;
var y=(_855.y+_856.y)/2;
var _859=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(x,y),null,_852.styleVirtual);
_859.geometry.parent=_853;
_859._index=i+1;
_852.virtualVertices.push(_859);
}
}
}
}
}
collectComponentVertices(this.feature.geometry);
},setMap:function(map){
this.selectControl.setMap(map);
this.dragControl.setMap(map);
OpenLayers.Control.prototype.setMap.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Control.ModifyFeature"});
OpenLayers.Control.Navigation=OpenLayers.Class(OpenLayers.Control,{dragPan:null,zoomBox:null,wheelHandler:null,initialize:function(_85b){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},activate:function(){
this.dragPan.activate();
this.wheelHandler.activate();
this.zoomBox.activate();
return OpenLayers.Control.prototype.activate.apply(this,arguments);
},deactivate:function(){
this.zoomBox.deactivate();
this.dragPan.deactivate();
this.wheelHandler.deactivate();
return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
},draw:function(){
this.map.events.register("dblclick",this,this.defaultDblClick);
this.dragPan=new OpenLayers.Control.DragPan({map:this.map});
this.zoomBox=new OpenLayers.Control.ZoomBox({map:this.map,keyMask:OpenLayers.Handler.MOD_SHIFT});
this.dragPan.draw();
this.zoomBox.draw();
this.wheelHandler=new OpenLayers.Handler.MouseWheel(this,{"up":this.wheelUp,"down":this.wheelDown});
this.activate();
},defaultDblClick:function(evt){
var _85d=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_85d,this.map.zoom+1);
OpenLayers.Event.stop(evt);
return false;
},wheelChange:function(evt,_85f){
var _860=this.map.getZoom()+_85f;
if(!this.map.isValidZoomLevel(_860)){
return;
}
var size=this.map.getSize();
var _862=size.w/2-evt.xy.x;
var _863=evt.xy.y-size.h/2;
var _864=this.map.baseLayer.resolutions[_860];
var _865=this.map.getLonLatFromPixel(evt.xy);
var _866=new OpenLayers.LonLat(_865.lon+_862*_864,_865.lat+_863*_864);
this.map.setCenter(_866,_860);
},wheelUp:function(evt){
this.wheelChange(evt,1);
},wheelDown:function(evt){
this.wheelChange(evt,-1);
},CLASS_NAME:"OpenLayers.Control.Navigation"});
OpenLayers.Geometry=OpenLayers.Class({id:null,parent:null,bounds:null,initialize:function(){
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},destroy:function(){
this.id=null;
this.bounds=null;
},clone:function(){
return new OpenLayers.Geometry();
},setBounds:function(_869){
if(_869){
this.bounds=_869.clone();
}
},clearBounds:function(){
this.bounds=null;
if(this.parent){
this.parent.clearBounds();
}
},extendBounds:function(_86a){
var _86b=this.getBounds();
if(!_86b){
this.setBounds(_86a);
}else{
this.bounds.extend(_86a);
}
},getBounds:function(){
if(this.bounds==null){
this.calculateBounds();
}
return this.bounds;
},calculateBounds:function(){
},atPoint:function(_86c,_86d,_86e){
var _86f=false;
var _870=this.getBounds();
if((_870!=null)&&(_86c!=null)){
var dX=(_86d!=null)?_86d:0;
var dY=(_86e!=null)?_86e:0;
var _873=new OpenLayers.Bounds(this.bounds.left-dX,this.bounds.bottom-dY,this.bounds.right+dX,this.bounds.top+dY);
_86f=_873.containsLonLat(_86c);
}
return _86f;
},getLength:function(){
return 0;
},getArea:function(){
return 0;
},toString:function(){
return OpenLayers.Format.WKT.prototype.write(new OpenLayers.Feature.Vector(this));
},CLASS_NAME:"OpenLayers.Geometry"});
OpenLayers.Layer.GML=OpenLayers.Class(OpenLayers.Layer.Vector,{loaded:false,format:null,initialize:function(name,url,_876){
var _877=[];
_877.push(name,_876);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_877);
this.url=url;
},setVisibility:function(_878,_879){
OpenLayers.Layer.Vector.prototype.setVisibility.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},moveTo:function(_87a,_87b,_87c){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.events.triggerEvent("loadstart");
this.loadGML();
}
},loadGML:function(){
if(!this.loaded){
var _87d=OpenLayers.loadURL(this.url,null,this,this.requestSuccess,this.requestFailure);
this.loaded=true;
}
},requestSuccess:function(_87e){
var doc=_87e.responseXML;
if(!doc||_87e.fileType!="XML"){
doc=_87e.responseText;
}
var gml=this.format?new this.format():new OpenLayers.Format.GML();
this.addFeatures(gml.read(doc));
this.events.triggerEvent("loadend");
},requestFailure:function(_881){
alert("Error in loading GML file "+this.url);
this.events.triggerEvent("loadend");
},CLASS_NAME:"OpenLayers.Layer.GML"});
OpenLayers.Layer.KaMap=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:true,units:null,resolution:OpenLayers.DOTS_PER_INCH,DEFAULT_PARAMS:{i:"jpeg",map:""},initialize:function(name,url,_884,_885){
var _886=[];
_886.push(name,url,_884,_885);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_886);
this.params=(_884?_884:{});
if(_884){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},getURL:function(_887){
_887=this.adjustBounds(_887);
var _888=this.map.getResolution();
var _889=Math.round((this.map.getScale()*10000))/10000;
var pX=Math.round(_887.left/_888);
var pY=-Math.round(_887.top/_888);
return this.getFullRequestString({t:pY,l:pX,s:_889});
},addTile:function(_88c,_88d){
var url=this.getURL(_88c);
return new OpenLayers.Tile.Image(this,_88d,_88c,url,this.tileSize);
},initGriddedTiles:function(_88f){
var _890=this.map.getSize();
var _891=Math.ceil(_890.h/this.tileSize.h)+Math.max(1,2*this.buffer);
var _892=Math.ceil(_890.w/this.tileSize.w)+Math.max(1,2*this.buffer);
var _893=this.map.getMaxExtent();
var _894=this.map.getResolution();
var _895=_894*this.tileSize.w;
var _896=_894*this.tileSize.h;
var _897=_88f.left;
var _898=Math.floor(_897/_895)-this.buffer;
var _899=_897/_895-_898;
var _89a=-_899*this.tileSize.w;
var _89b=_898*_895;
var _89c=_88f.top;
var _89d=Math.ceil(_89c/_896)+this.buffer;
var _89e=_89d-_89c/_896;
var _89f=-(_89e+1)*this.tileSize.h;
var _8a0=_89d*_896;
_89a=Math.round(_89a);
_89f=Math.round(_89f);
this.origin=new OpenLayers.Pixel(_89a,_89f);
var _8a1=_89a;
var _8a2=_89b;
var _8a3=0;
do{
var row=this.grid[_8a3++];
if(!row){
row=[];
this.grid.push(row);
}
_89b=_8a2;
_89a=_8a1;
var _8a5=0;
do{
var _8a6=new OpenLayers.Bounds(_89b,_8a0,_89b+_895,_8a0+_896);
var x=_89a;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_89f;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile=row[_8a5++];
if(!tile){
tile=this.addTile(_8a6,px);
this.addTileMonitoringHooks(tile);
row.push(tile);
}else{
tile.moveTo(_8a6,px,false);
}
_89b+=_895;
_89a+=this.tileSize.w;
}while(_89b<=_88f.right+_895*this.buffer||_8a5<_892);
_8a0-=_896;
_89f+=this.tileSize.h;
}while(_8a0>=_88f.bottom-_896*this.buffer||_8a3<_891);
this.removeExcessTiles(_8a3,_8a5);
this.spiralTileLoad();
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.KaMap(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
if(this.tileSize!=null){
obj.tileSize=this.tileSize.clone();
}
obj.grid=[];
return obj;
},getTileBounds:function(_8ac){
var _8ad=this.getResolution();
var _8ae=_8ad*this.tileSize.w;
var _8af=_8ad*this.tileSize.h;
var _8b0=this.getLonLatFromViewPortPx(_8ac);
var _8b1=_8ae*Math.floor(_8b0.lon/_8ae);
var _8b2=_8af*Math.floor(_8b0.lat/_8af);
return new OpenLayers.Bounds(_8b1,_8b2,_8b1+_8ae,_8b2+_8af);
},CLASS_NAME:"OpenLayers.Layer.KaMap"});
OpenLayers.Layer.MapServer=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{mode:"map",map_imagetype:"png"},initialize:function(name,url,_8b5,_8b6){
var _8b7=[];
_8b7.push(name,url,_8b5,_8b6);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_8b7);
if(arguments.length>0){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
if(_8b6==null||_8b6.isBaseLayer==null){
this.isBaseLayer=((this.params.transparent!="true")&&(this.params.transparent!=true));
}
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.MapServer(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},addTile:function(_8b9,_8ba){
return new OpenLayers.Tile.Image(this,_8ba,_8b9,null,this.tileSize);
},getURL:function(_8bb){
_8bb=this.adjustBounds(_8bb);
var _8bc=[_8bb.left,_8bb.bottom,_8bb.right,_8bb.top];
var _8bd=this.getImageSize();
var url=this.getFullRequestString({mapext:_8bc,imgext:_8bc,map_size:[_8bd.w,_8bd.h],imgx:_8bd.w/2,imgy:_8bd.h/2,imgxy:[_8bd.w,_8bd.h]});
return url;
},getFullRequestString:function(_8bf,_8c0){
var url=(_8c0==null)?this.url:_8c0;
if(typeof url=="object"){
url=url[Math.floor(Math.random()*url.length)];
}
var _8c2=url;
var _8c3=OpenLayers.Util.extend({},this.params);
_8c3=OpenLayers.Util.extend(_8c3,_8bf);
var _8c4=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
for(var key in _8c3){
if(key.toUpperCase() in _8c4){
delete _8c3[key];
}
}
var _8c6=OpenLayers.Util.getParameterString(_8c3);
_8c6=_8c6.replace(/,/g,"+");
if(_8c6!=""){
var _8c7=url.charAt(url.length-1);
if((_8c7=="&")||(_8c7=="?")){
_8c2+=_8c6;
}else{
if(url.indexOf("?")==-1){
_8c2+="?"+_8c6;
}else{
_8c2+="&"+_8c6;
}
}
}
return _8c2;
},CLASS_NAME:"OpenLayers.Layer.MapServer"});
OpenLayers.Layer.TMS=OpenLayers.Class(OpenLayers.Layer.Grid,{serviceVersion:"1.0.0",isBaseLayer:true,tileOrigin:null,initialize:function(name,url,_8ca){
var _8cb=[];
_8cb.push(name,url,{},_8ca);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_8cb);
},destroy:function(){
OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TMS(this.name,this.url,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_8cd){
_8cd=this.adjustBounds(_8cd);
var res=this.map.getResolution();
var x=Math.round((_8cd.left-this.tileOrigin.lon)/(res*this.tileSize.w));
var y=Math.round((_8cd.bottom-this.tileOrigin.lat)/(res*this.tileSize.h));
var z=this.map.getZoom();
var path=this.serviceVersion+"/"+this.layername+"/"+z+"/"+x+"/"+y+"."+this.type;
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
return url+path;
},addTile:function(_8d4,_8d5){
return new OpenLayers.Tile.Image(this,_8d5,_8d4,null,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TMS"});
OpenLayers.Layer.TileCache=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:true,tileOrigin:null,format:"image/png",initialize:function(name,url,_8d9,_8da){
_8da=OpenLayers.Util.extend({maxResolution:180/256},_8da);
this.layername=_8d9;
OpenLayers.Layer.Grid.prototype.initialize.apply(this,[name,url,{},_8da]);
this.extension=this.format.split("/")[1].toLowerCase();
this.extension=(this.extension=="jpeg")?"jpg":this.extension;
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TileCache(this.name,this.url,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_8dc){
var res=this.map.getResolution();
var bbox=this.maxExtent;
var size=this.tileSize;
var _8e0=Math.floor((_8dc.left-bbox.left)/(res*size.w));
var _8e1=Math.floor((_8dc.bottom-bbox.bottom)/(res*size.h));
var _8e2=this.map.zoom;
function zeroPad(_8e3,_8e4){
_8e3=String(_8e3);
var _8e5=[];
for(var i=0;i<_8e4;++i){
_8e5.push("0");
}
return _8e5.join("").substring(0,_8e4-_8e3.length)+_8e3;
}
var _8e7=[this.layername,zeroPad(_8e2,2),zeroPad(parseInt(_8e0/1000000),3),zeroPad((parseInt(_8e0/1000)%1000),3),zeroPad((parseInt(_8e0)%1000),3),zeroPad(parseInt(_8e1/1000000),3),zeroPad((parseInt(_8e1/1000)%1000),3),zeroPad((parseInt(_8e1)%1000),3)+"."+this.extension];
var path=_8e7.join("/");
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
url=(url.charAt(url.length-1)=="/")?url:url+"/";
return url+path;
},addTile:function(_8ea,_8eb){
var url=this.getURL(_8ea);
return new OpenLayers.Tile.Image(this,_8eb,_8ea,url,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TileCache"});
OpenLayers.Layer.WFS=OpenLayers.Class(OpenLayers.Layer.Vector,OpenLayers.Layer.Markers,{isBaseLayer:false,tile:null,ratio:2,DEFAULT_PARAMS:{service:"WFS",version:"1.0.0",request:"GetFeature"},featureClass:null,vectorMode:true,encodeBBOX:false,extractAttributes:false,initialize:function(name,url,_8f0,_8f1){
if(_8f1==undefined){
_8f1={};
}
if(_8f1.featureClass||!OpenLayers.Layer.Vector||!OpenLayers.Feature.Vector){
this.vectorMode=false;
}
OpenLayers.Util.extend(_8f1,{"reportError":false});
var _8f2=[];
_8f2.push(name,_8f1);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_8f2);
if(!this.renderer||!this.vectorMode){
this.vectorMode=false;
if(!_8f1.featureClass){
_8f1.featureClass=OpenLayers.Feature.WFS;
}
OpenLayers.Layer.Markers.prototype.initialize.apply(this,_8f2);
}
if(this.params&&this.params.typename&&!this.options.typename){
this.options.typename=this.params.typename;
}
if(!this.options.geometry_column){
this.options.geometry_column="the_geom";
}
this.params=_8f0;
OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
this.url=url;
},destroy:function(){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.destroy.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
}
},setMap:function(map){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.setMap.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.setMap.apply(this,arguments);
}
},moveTo:function(_8f4,_8f5,_8f6){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.moveTo.apply(this,arguments);
}
if(_8f6){
return false;
}
if(_8f5){
if(this.vectorMode){
this.renderer.clear();
}
}
if(this.options.minZoomLevel){
var err="The minZoomLevel property is only intended for use "+"with the FixedZoomLevels-descendent layers. That this "+"wfs layer checks for minZoomLevel is a relic of the"+"past. We cannot, however, remove it without possibly "+"breaking OL based applications that may depend on it."+" Therefore we are deprecating it -- the minZoomLevel "+"check below will be removed at 3.0. Please instead "+"use min/max resolution setting as described here: "+"http://trac.openlayers.org/wiki/SettingZoomLevels";
OpenLayers.Console.warn(err);
if(this.map.getZoom()<this.options.minZoomLevel){
return null;
}
}
if(_8f4==null){
_8f4=this.map.getExtent();
}
var _8f8=(this.tile==null);
var _8f9=(!_8f8&&!this.tile.bounds.containsBounds(_8f4));
if((_8f5||_8f8||(!_8f6&&_8f9))&&this.inRange){
var _8fa=_8f4.getCenterLonLat();
var _8fb=_8f4.getWidth()*this.ratio;
var _8fc=_8f4.getHeight()*this.ratio;
var _8fd=new OpenLayers.Bounds(_8fa.lon-(_8fb/2),_8fa.lat-(_8fc/2),_8fa.lon+(_8fb/2),_8fa.lat+(_8fc/2));
var _8fe=this.map.getSize();
_8fe.w=_8fe.w*this.ratio;
_8fe.h=_8fe.h*this.ratio;
var ul=new OpenLayers.LonLat(_8fd.left,_8fd.top);
var pos=this.map.getLayerPxFromLonLat(ul);
var url=this.getFullRequestString();
var _902={BBOX:this.encodeBBOX?_8fd.toBBOX():_8fd.toArray()};
url+="&"+OpenLayers.Util.getParameterString(_902);
if(!this.tile){
this.tile=new OpenLayers.Tile.WFS(this,pos,_8fd,url,_8fe);
this.addTileMonitoringHooks(this.tile);
this.tile.draw();
}else{
if(this.vectorMode){
this.destroyFeatures();
this.renderer.clear();
}else{
this.clearMarkers();
}
this.removeTileMonitoringHooks(this.tile);
this.tile.destroy();
this.tile=null;
this.tile=new OpenLayers.Tile.WFS(this,pos,_8fd,url,_8fe);
this.addTileMonitoringHooks(this.tile);
this.tile.draw();
}
}
},addTileMonitoringHooks:function(tile){
tile.onLoadStart=function(){
if(this==this.layer.tile){
this.layer.events.triggerEvent("loadstart");
}
};
tile.events.register("loadstart",tile,tile.onLoadStart);
tile.onLoadEnd=function(){
if(this==this.layer.tile){
this.layer.events.triggerEvent("tileloaded");
this.layer.events.triggerEvent("loadend");
}
};
tile.events.register("loadend",tile,tile.onLoadEnd);
},removeTileMonitoringHooks:function(tile){
tile.events.unregister("loadstart",tile,tile.onLoadStart);
tile.events.unregister("loadend",tile,tile.onLoadEnd);
},onMapResize:function(){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.onMapResize.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.onMapResize.apply(this,arguments);
}
},mergeNewParams:function(_905){
var _906=OpenLayers.Util.upperCaseObject(_905);
var _907=[_906];
OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this,_907);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.WFS(this.name,this.url,this.params,this.options);
}
if(this.vectorMode){
obj=OpenLayers.Layer.Vector.prototype.clone.apply(this,[obj]);
}else{
obj=OpenLayers.Layer.Markers.prototype.clone.apply(this,[obj]);
}
return obj;
},getFullRequestString:function(_909){
var _90a=this.map.getProjection();
this.params.SRS=(_90a=="none")?null:_90a;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},commit:function(){
if(!this.writer){
this.writer=new OpenLayers.Format.WFS({},this);
}
var data=this.writer.write(this.features);
var url=this.url;
if(OpenLayers.ProxyHost&&OpenLayers.String.startsWith(this.url,"http")){
url=OpenLayers.ProxyHost+escape(this.url);
}
var _90d=OpenLayers.Function.bind(this.commitSuccess,this);
var _90e=OpenLayers.Function.bind(this.commitFailure,this);
data=OpenLayers.Ajax.serializeXMLToString(data);
new OpenLayers.Ajax.Request(url,{method:"post",postBody:data,onComplete:_90d,onFailure:_90e});
},commitSuccess:function(_90f){
var _910=_90f.responseText;
if(_910.indexOf("SUCCESS")!=-1){
this.commitReport("WFS Transaction: SUCCESS",_910);
for(var i=0;i<this.features.length;i++){
this.features[i].state=null;
}
}else{
if(_910.indexOf("FAILED")!=-1||_910.indexOf("Exception")!=-1){
this.commitReport("WFS Transaction: FAILED",_910);
}
}
},commitFailure:function(_912){
},commitReport:function(_913,_914){
alert(_913);
},refresh:function(){
if(this.tile){
if(this.vectorMode){
this.renderer.clear();
this.features.length=0;
}else{
this.clearMarkers();
this.markers.length=0;
}
this.tile.draw();
}
},CLASS_NAME:"OpenLayers.Layer.WFS"});
OpenLayers.Layer.WMS=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{service:"WMS",version:"1.1.1",request:"GetMap",styles:"",exceptions:"application/vnd.ogc.se_inimage",format:"image/jpeg"},reproject:false,isBaseLayer:true,encodeBBOX:false,initialize:function(name,url,_917,_918){
var _919=[];
_917=OpenLayers.Util.upperCaseObject(_917);
_919.push(name,url,_917,_918);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_919);
OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
if(this.params.TRANSPARENT&&this.params.TRANSPARENT.toString().toLowerCase()=="true"){
if((_918==null)||(!_918.isBaseLayer)){
this.isBaseLayer=false;
}
if(this.params.FORMAT=="image/jpeg"){
this.params.FORMAT=OpenLayers.Util.alphaHack()?"image/gif":"image/png";
}
}
},destroy:function(){
OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.WMS(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_91b){
_91b=this.adjustBounds(_91b);
var _91c=this.getImageSize();
return this.getFullRequestString({BBOX:this.encodeBBOX?_91b.toBBOX():_91b.toArray(),WIDTH:_91c.w,HEIGHT:_91c.h});
},addTile:function(_91d,_91e){
return new OpenLayers.Tile.Image(this,_91e,_91d,null,this.tileSize);
},mergeNewParams:function(_91f){
var _920=OpenLayers.Util.upperCaseObject(_91f);
var _921=[_920];
OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,_921);
},getFullRequestString:function(_922){
var _923=this.map.getProjection();
this.params.SRS=(_923=="none")?null:_923;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Layer.WMS"});
OpenLayers.Layer.WorldWind=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{},isBaseLayer:true,lzd:null,zoomLevels:null,initialize:function(name,url,lzd,_927,_928,_929){
this.lzd=lzd;
this.zoomLevels=_927;
var _92a=[];
_92a.push(name,url,_928,_929);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_92a);
this.params=(_928?_928:{});
if(_928){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},addTile:function(_92b,_92c){
return new OpenLayers.Tile.Image(this,_92c,_92b,null,this.tileSize);
},getZoom:function(){
var zoom=this.map.getZoom();
var _92e=this.map.getMaxExtent();
zoom=zoom-Math.log(this.maxResolution/(this.lzd/512))/Math.log(2);
return zoom;
},getURL:function(_92f){
_92f=this.adjustBounds(_92f);
var zoom=this.getZoom();
var _931=this.map.getMaxExtent();
var deg=this.lzd/Math.pow(2,this.getZoom());
var x=Math.floor((_92f.left-_931.left)/deg);
var y=Math.floor((_92f.bottom-_931.bottom)/deg);
if(this.map.getResolution()<=(this.lzd/512)&&this.getZoom()<=this.zoomLevels){
return this.getFullRequestString({L:zoom,X:x,Y:y});
}else{
return OpenLayers.Util.getImagesLocation()+"blank.gif";
}
},CLASS_NAME:"OpenLayers.Layer.WorldWind"});
OpenLayers.Control.NavToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(_935){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_935]);
this.addControls([new OpenLayers.Control.Navigation(),new OpenLayers.Control.ZoomBox()]);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.NavToolbar"});
OpenLayers.Geometry.Collection=OpenLayers.Class(OpenLayers.Geometry,{components:null,componentTypes:null,initialize:function(_937){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.components=[];
if(_937!=null){
this.addComponents(_937);
}
},destroy:function(){
this.components.length=0;
this.components=null;
},clone:function(){
var _938=eval("new "+this.CLASS_NAME+"()");
for(var i=0;i<this.components.length;i++){
_938.addComponent(this.components[i].clone());
}
OpenLayers.Util.applyDefaults(_938,this);
return _938;
},getComponentsString:function(){
var _93a=[];
for(var i=0;i<this.components.length;i++){
_93a.push(this.components[i].toShortString());
}
return _93a.join(",");
},calculateBounds:function(){
this.bounds=null;
if(this.components&&this.components.length>0){
this.setBounds(this.components[0].getBounds());
for(var i=1;i<this.components.length;i++){
this.extendBounds(this.components[i].getBounds());
}
}
},addComponents:function(_93d){
if(!(_93d instanceof Array)){
_93d=[_93d];
}
for(var i=0;i<_93d.length;i++){
this.addComponent(_93d[i]);
}
},addComponent:function(_93f,_940){
var _941=false;
if(_93f){
if(this.componentTypes==null||(OpenLayers.Util.indexOf(this.componentTypes,_93f.CLASS_NAME)>-1)){
if(_940!=null&&(_940<this.components.length)){
var _942=this.components.slice(0,_940);
var _943=this.components.slice(_940,this.components.length);
_942.push(_93f);
this.components=_942.concat(_943);
}else{
this.components.push(_93f);
}
_93f.parent=this;
this.clearBounds();
_941=true;
}
}
return _941;
},removeComponents:function(_944){
if(!(_944 instanceof Array)){
_944=[_944];
}
for(var i=0;i<_944.length;i++){
this.removeComponent(_944[i]);
}
},removeComponent:function(_946){
OpenLayers.Util.removeItem(this.components,_946);
this.clearBounds();
},getLength:function(){
var _947=0;
for(var i=0;i<this.components.length;i++){
_947+=this.components[i].getLength();
}
return _947;
},getArea:function(){
var area=0;
for(var i=0;i<this.components.length;i++){
area+=this.components[i].getArea();
}
return area;
},move:function(x,y){
for(var i=0;i<this.components.length;i++){
this.components[i].move(x,y);
}
},rotate:function(_94e,_94f){
for(var i=0;i<this.components.length;++i){
this.components[i].rotate(_94e,_94f);
}
},resize:function(_951,_952){
for(var i=0;i<this.components.length;++i){
this.components[i].resize(_951,_952);
}
},equals:function(_954){
var _955=true;
if(!_954.CLASS_NAME||(this.CLASS_NAME!=_954.CLASS_NAME)){
_955=false;
}else{
if(!(_954.components instanceof Array)||(_954.components.length!=this.components.length)){
_955=false;
}else{
for(var i=0;i<this.components.length;++i){
if(!this.components[i].equals(_954.components[i])){
_955=false;
break;
}
}
}
}
return _955;
},CLASS_NAME:"OpenLayers.Geometry.Collection"});
OpenLayers.Geometry.Point=OpenLayers.Class(OpenLayers.Geometry,{x:null,y:null,initialize:function(x,y){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.x=parseFloat(x);
this.y=parseFloat(y);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Geometry.Point(this.x,this.y);
}
OpenLayers.Util.applyDefaults(obj,this);
return obj;
},calculateBounds:function(){
this.bounds=new OpenLayers.Bounds(this.x,this.y,this.x,this.y);
},distanceTo:function(_95a){
var _95b=0;
if((this.x!=null)&&(this.y!=null)&&(_95a!=null)&&(_95a.x!=null)&&(_95a.y!=null)){
var dx2=Math.pow(this.x-_95a.x,2);
var dy2=Math.pow(this.y-_95a.y,2);
_95b=Math.sqrt(dx2+dy2);
}
return _95b;
},equals:function(geom){
var _95f=false;
if(geom!=null){
_95f=((this.x==geom.x&&this.y==geom.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(geom.x)&&isNaN(geom.y)));
}
return _95f;
},toShortString:function(){
return (this.x+", "+this.y);
},move:function(x,y){
this.x=this.x+x;
this.y=this.y+y;
this.clearBounds();
},rotate:function(_962,_963){
_962*=Math.PI/180;
var _964=this.distanceTo(_963);
var _965=_962+Math.atan2(this.y-_963.y,this.x-_963.x);
this.x=_963.x+(_964*Math.cos(_965));
this.y=_963.y+(_964*Math.sin(_965));
this.clearBounds();
},resize:function(_966,_967){
this.x=_967.x+(_966*(this.x-_967.x));
this.y=_967.y+(_966*(this.y-_967.y));
this.clearBounds();
},CLASS_NAME:"OpenLayers.Geometry.Point"});
OpenLayers.Geometry.Rectangle=OpenLayers.Class(OpenLayers.Geometry,{x:null,y:null,width:null,height:null,initialize:function(x,y,_96a,_96b){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.x=x;
this.y=y;
this.width=_96a;
this.height=_96b;
},calculateBounds:function(){
this.bounds=new OpenLayers.Bounds(this.x,this.y,this.x+this.width,this.y+this.height);
},getLength:function(){
var _96c=(2*this.width)+(2*this.height);
return _96c;
},getArea:function(){
var area=this.width*this.height;
return area;
},CLASS_NAME:"OpenLayers.Geometry.Rectangle"});
OpenLayers.Geometry.Surface=OpenLayers.Class(OpenLayers.Geometry,{initialize:function(){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.Surface"});
OpenLayers.Layer.MapServer.Untiled=OpenLayers.Class(OpenLayers.Layer.MapServer,{singleTile:true,initialize:function(name,url,_970,_971){
OpenLayers.Layer.MapServer.prototype.initialize.apply(this,arguments);
var msg="The OpenLayers.Layer.MapServer.Untiled class is deprecated and "+"will be removed in 3.0. Instead, you should use the "+"normal OpenLayers.Layer.MapServer class, passing it the option "+"'singleTile' as true.";
OpenLayers.Console.warn(msg);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.MapServer.Untiled(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.MapServer.prototype.clone.apply(this,[obj]);
return obj;
},CLASS_NAME:"OpenLayers.Layer.MapServer.Untiled"});
OpenLayers.Layer.WMS.Untiled=OpenLayers.Class(OpenLayers.Layer.WMS,{singleTile:true,initialize:function(name,url,_976,_977){
OpenLayers.Layer.WMS.prototype.initialize.apply(this,arguments);
var msg="The OpenLayers.Layer.WMS.Untiled class is deprecated and "+"will be removed in 3.0. Instead, you should use the "+"normal OpenLayers.Layer.WMS class, passing it the option "+"'singleTile' as true.";
OpenLayers.Console.warn(msg);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.WMS.Untiled(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.WMS.prototype.clone.apply(this,[obj]);
return obj;
},CLASS_NAME:"OpenLayers.Layer.WMS.Untiled"});
OpenLayers.Geometry.MultiLineString=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LineString"],initialize:function(_97a){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiLineString"});
OpenLayers.Geometry.MultiPoint=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_97b){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},addPoint:function(_97c,_97d){
this.addComponent(_97c,_97d);
},removePoint:function(_97e){
this.removeComponent(_97e);
},CLASS_NAME:"OpenLayers.Geometry.MultiPoint"});
OpenLayers.Geometry.MultiPolygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Polygon"],initialize:function(_97f){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiPolygon"});
OpenLayers.Geometry.Polygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LinearRing"],initialize:function(_980){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},getArea:function(){
var area=0;
if(this.components&&(this.components.length>0)){
area+=Math.abs(this.components[0].getArea());
for(var i=1;i<this.components.length;i++){
area-=Math.abs(this.components[i].getArea());
}
}
return area;
},CLASS_NAME:"OpenLayers.Geometry.Polygon"});
OpenLayers.Geometry.Polygon.createRegularPolygon=function(_983,_984,_985,_986){
var _987=Math.PI*((1/_985)-(1/2));
if(_986){
_987+=(_986/180)*Math.PI;
}
var _988,x,y;
var _989=[];
for(var i=0;i<_985;++i){
rotatedAngle=_987+(i*2*Math.PI/_985);
x=_983.x+(_984*Math.cos(rotatedAngle));
y=_983.y+(_984*Math.sin(rotatedAngle));
_989.push(new OpenLayers.Geometry.Point(x,y));
}
var ring=new OpenLayers.Geometry.LinearRing(_989);
return new OpenLayers.Geometry.Polygon([ring]);
};
OpenLayers.Handler.Point=OpenLayers.Class(OpenLayers.Handler,{point:null,layer:null,drawing:false,mouseDown:false,lastDown:null,lastUp:null,initialize:function(_98c,_98d,_98e){
this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},activate:function(){
if(!OpenLayers.Handler.prototype.activate.apply(this,arguments)){
return false;
}
var _98f={displayInLayerSwitcher:false};
this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,_98f);
this.map.addLayer(this.layer);
return true;
},createFeature:function(){
this.point=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point());
},deactivate:function(){
if(!OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
return false;
}
if(this.drawing){
this.cancel();
}
this.map.removeLayer(this.layer,false);
this.layer.destroy();
this.layer=null;
return true;
},destroyFeature:function(){
this.point.destroy();
this.point=null;
},finalize:function(){
this.layer.renderer.clear();
this.callback("done",[this.geometryClone()]);
this.destroyFeature();
this.drawing=false;
this.mouseDown=false;
this.lastDown=null;
this.lastUp=null;
},cancel:function(){
this.layer.renderer.clear();
this.callback("cancel",[this.geometryClone()]);
this.destroyFeature();
this.drawing=false;
this.mouseDown=false;
this.lastDown=null;
this.lastUp=null;
},dblclick:function(evt){
OpenLayers.Event.stop(evt);
return false;
},drawFeature:function(){
this.layer.drawFeature(this.point,this.style);
},geometryClone:function(){
return this.point.geometry.clone();
},mousedown:function(evt){
if(!this.checkModifiers(evt)){
return true;
}
if(this.lastDown&&this.lastDown.equals(evt.xy)){
return true;
}
if(this.lastDown==null){
this.createFeature();
}
this.lastDown=evt.xy;
this.drawing=true;
var _992=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_992.lon;
this.point.geometry.y=_992.lat;
this.drawFeature();
return false;
},mousemove:function(evt){
if(this.drawing){
var _994=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_994.lon;
this.point.geometry.y=_994.lat;
this.point.geometry.clearBounds();
this.drawFeature();
}
return true;
},mouseup:function(evt){
if(this.drawing){
this.finalize();
return false;
}else{
return true;
}
},CLASS_NAME:"OpenLayers.Handler.Point"});
OpenLayers.Geometry.Curve=OpenLayers.Class(OpenLayers.Geometry.MultiPoint,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_996){
OpenLayers.Geometry.MultiPoint.prototype.initialize.apply(this,arguments);
},getLength:function(){
var _997=0;
if(this.components&&(this.components.length>1)){
for(var i=1;i<this.components.length;i++){
_997+=this.components[i-1].distanceTo(this.components[i]);
}
}
return _997;
},CLASS_NAME:"OpenLayers.Geometry.Curve"});
OpenLayers.Geometry.LineString=OpenLayers.Class(OpenLayers.Geometry.Curve,{initialize:function(_999){
OpenLayers.Geometry.Curve.prototype.initialize.apply(this,arguments);
},removeComponent:function(_99a){
if(this.components&&(this.components.length>2)){
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
}
},CLASS_NAME:"OpenLayers.Geometry.LineString"});
OpenLayers.Format.GML=OpenLayers.Class(OpenLayers.Format.XML,{featureNS:"http://mapserver.gis.umn.edu/mapserver",featurePrefix:"feature",featureName:"featureMember",layerName:"features",geometryName:"geometry",collectionName:"FeatureCollection",gmlns:"http://www.opengis.net/gml",extractAttributes:true,initialize:function(_99b){
this.regExes={trimSpace:(/^\s*|\s*$/g),removeSpace:(/\s*/g),splitSpace:(/\s+/),trimComma:(/\s*,\s*/g)};
OpenLayers.Format.XML.prototype.initialize.apply(this,[_99b]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);
}
var _99d=this.getElementsByTagNameNS(data.documentElement,this.gmlns,this.featureName);
var _99e=[];
for(var i=0;i<_99d.length;i++){
var _9a0=this.parseFeature(_99d[i]);
if(_9a0){
_99e.push(_9a0);
}
}
return _99e;
},parseFeature:function(node){
var _9a2=["MultiPolygon","Polygon","MultiLineString","LineString","MultiPoint","Point"];
var type,nodeList,geometry,parser;
for(var i=0;i<_9a2.length;++i){
type=_9a2[i];
nodeList=this.getElementsByTagNameNS(node,this.gmlns,type);
if(nodeList.length>0){
var _9a5=this.parseGeometry[type.toLowerCase()];
if(_9a5){
geometry=_9a5.apply(this,[nodeList[0]]);
}else{
OpenLayers.Console.error("Unsupported geometry type: "+type);
}
break;
}
}
var _9a6;
if(this.extractAttributes){
_9a6=this.parseAttributes(node);
}
var _9a7=new OpenLayers.Feature.Vector(geometry,_9a6);
var _9a8=node.firstChild;
var fid;
while(_9a8){
if(_9a8.nodeType==1){
fid=_9a8.getAttribute("fid")||_9a8.getAttribute("id");
if(fid){
break;
}
}
_9a8=_9a8.nextSibling;
}
_9a7.fid=fid;
return _9a7;
},parseGeometry:{point:function(node){
var _9ab;
var _9ac=[];
var _9ab=this.getElementsByTagNameNS(node,this.gmlns,"pos");
if(_9ab.length>0){
coordString=_9ab[0].firstChild.nodeValue;
coordString=coordString.replace(this.regExes.trimSpace,"");
_9ac=coordString.split(this.regExes.splitSpace);
}
if(_9ac.length==0){
_9ab=this.getElementsByTagNameNS(node,this.gmlns,"coordinates");
if(_9ab.length>0){
coordString=_9ab[0].firstChild.nodeValue;
coordString=coordString.replace(this.regExes.removeSpace,"");
_9ac=coordString.split(",");
}
}
if(_9ac.length==0){
_9ab=this.getElementsByTagNameNS(node,this.gmlns,"coord");
if(_9ab.length>0){
var _9ad=this.getElementsByTagNameNS(_9ab[0],this.gmlns,"X");
var _9ae=this.getElementsByTagNameNS(_9ab[0],this.gmlns,"Y");
if(_9ad.length>0&&_9ae.length>0){
_9ac=[_9ad[0].firstChild.nodeValue,_9ae[0].firstChild.nodeValue];
}
}
}
if(_9ac.length==2){
_9ac[2]=null;
}
return new OpenLayers.Geometry.Point(_9ac[0],_9ac[1],_9ac[2]);
},multipoint:function(node){
var _9b0=this.getElementsByTagNameNS(node,this.gmlns,"Point");
var _9b1=[];
if(_9b0.length>0){
var _9b2;
for(var i=0;i<_9b0.length;++i){
_9b2=this.parseGeometry.point.apply(this,[_9b0[i]]);
if(_9b2){
_9b1.push(_9b2);
}
}
}
return new OpenLayers.Geometry.MultiPoint(_9b1);
},linestring:function(node,ring){
var _9b6,coordString;
var _9b7=[];
var _9b8=[];
_9b6=this.getElementsByTagNameNS(node,this.gmlns,"posList");
if(_9b6.length>0){
coordString=this.concatChildValues(_9b6[0]);
coordString=coordString.replace(this.regExes.trimSpace,"");
_9b7=coordString.split(this.regExes.splitSpace);
var dim=parseInt(_9b6[0].getAttribute("dimension"));
var j,x,y,z;
for(var i=0;i<_9b7.length/dim;++i){
j=i*dim;
x=_9b7[j];
y=_9b7[j+1];
z=(dim==2)?null:_9b7[j+2];
_9b8.push(new OpenLayers.Geometry.Point(x,y,z));
}
}
if(_9b7.length==0){
_9b6=this.getElementsByTagNameNS(node,this.gmlns,"coordinates");
if(_9b6.length>0){
coordString=this.concatChildValues(_9b6[0]);
coordString=coordString.replace(this.regExes.trimSpace,"");
coordString=coordString.replace(this.regExes.trimComma,",");
var _9bc=coordString.split(this.regExes.splitSpace);
for(var i=0;i<_9bc.length;++i){
_9b7=_9bc[i].split(",");
if(_9b7.length==2){
_9b7[2]=null;
}
_9b8.push(new OpenLayers.Geometry.Point(_9b7[0],_9b7[1],_9b7[2]));
}
}
}
var line=null;
if(_9b8.length!=0){
if(ring){
line=new OpenLayers.Geometry.LinearRing(_9b8);
}else{
line=new OpenLayers.Geometry.LineString(_9b8);
}
}
return line;
},multilinestring:function(node){
var _9bf=this.getElementsByTagNameNS(node,this.gmlns,"LineString");
var _9c0=[];
if(_9bf.length>0){
var line;
for(var i=0;i<_9bf.length;++i){
line=this.parseGeometry.linestring.apply(this,[_9bf[i]]);
if(line){
_9c0.push(line);
}
}
}
return new OpenLayers.Geometry.MultiLineString(_9c0);
},polygon:function(node){
var _9c4=this.getElementsByTagNameNS(node,this.gmlns,"LinearRing");
var _9c5=[];
if(_9c4.length>0){
var ring;
for(var i=0;i<_9c4.length;++i){
ring=this.parseGeometry.linestring.apply(this,[_9c4[i],true]);
if(ring){
_9c5.push(ring);
}
}
}
return new OpenLayers.Geometry.Polygon(_9c5);
},multipolygon:function(node){
var _9c9=this.getElementsByTagNameNS(node,this.gmlns,"Polygon");
var _9ca=[];
if(_9c9.length>0){
var _9cb;
for(var i=0;i<_9c9.length;++i){
_9cb=this.parseGeometry.polygon.apply(this,[_9c9[i]]);
if(_9cb){
_9ca.push(_9cb);
}
}
}
return new OpenLayers.Geometry.MultiPolygon(_9ca);
}},parseAttributes:function(node){
var _9ce={};
var _9cf=node.firstChild;
var _9d0,i,child,grandchildren,grandchild,name,value;
while(_9cf){
if(_9cf.nodeType==1){
_9d0=_9cf.childNodes;
for(i=0;i<_9d0.length;++i){
child=_9d0[i];
if(child.nodeType==1){
grandchildren=child.childNodes;
if(grandchildren.length==1){
grandchild=grandchildren[0];
if(grandchild.nodeType==3||grandchild.nodeType==4){
name=(child.prefix)?child.nodeName.split(":")[1]:child.nodeName;
value=grandchild.nodeValue.replace(this.regExes.trimSpace,"");
_9ce[name]=value;
}
}
}
}
break;
}
_9cf=_9cf.nextSibling;
}
return _9ce;
},write:function(_9d1){
if(!(_9d1 instanceof Array)){
_9d1=[_9d1];
}
var gml=this.createElementNS("http://www.opengis.net/wfs","wfs:"+this.collectionName);
for(var i=0;i<_9d1.length;i++){
gml.appendChild(this.createFeatureXML(_9d1[i]));
}
return OpenLayers.Format.XML.prototype.write.apply(this,[gml]);
},createFeatureXML:function(_9d4){
var _9d5=_9d4.geometry;
var _9d6=this.buildGeometryNode(_9d5);
var _9d7=this.createElementNS(this.featureNS,this.featurePrefix+":"+this.geometryName);
_9d7.appendChild(_9d6);
var _9d8=this.createElementNS(this.gmlns,"gml:"+this.featureName);
var _9d9=this.createElementNS(this.featureNS,this.featurePrefix+":"+this.layerName);
var fid=_9d4.fid||_9d4.id;
_9d9.setAttribute("fid",fid);
_9d9.appendChild(_9d7);
for(var attr in _9d4.attributes){
var _9dc=this.createTextNode(_9d4.attributes[attr]);
var _9dd=attr.substring(attr.lastIndexOf(":")+1);
var _9de=this.createElementNS(this.featureNS,this.featurePrefix+":"+_9dd);
_9de.appendChild(_9dc);
_9d9.appendChild(_9de);
}
_9d8.appendChild(_9d9);
return _9d8;
},buildGeometryNode:function(_9df){
var _9e0=_9df.CLASS_NAME;
var type=_9e0.substring(_9e0.lastIndexOf(".")+1);
var _9e2=this.buildGeometry[type.toLowerCase()];
return _9e2.apply(this,[_9df]);
},buildGeometry:{point:function(_9e3){
var gml=this.createElementNS(this.gmlns,"gml:Point");
gml.appendChild(this.buildCoordinatesNode(_9e3));
return gml;
},multipoint:function(_9e5){
var gml=this.createElementNS(this.gmlns,"gml:MultiPoint");
var _9e7=_9e5.components;
var _9e8,pointGeom;
for(var i=0;i<_9e7.length;i++){
_9e8=this.createElementNS(this.gmlns,"gml:pointMember");
pointGeom=this.buildGeometry.point.apply(this,[_9e7[i]]);
_9e8.appendChild(pointGeom);
gml.appendChild(_9e8);
}
return gml;
},linestring:function(_9ea){
var gml=this.createElementNS(this.gmlns,"gml:LineString");
gml.appendChild(this.buildCoordinatesNode(_9ea));
return gml;
},multilinestring:function(_9ec){
var gml=this.createElementNS(this.gmlns,"gml:MultiLineString");
var _9ee=_9ec.components;
var _9ef,lineGeom;
for(var i=0;i<_9ee.length;++i){
_9ef=this.createElementNS(this.gmlns,"gml:lineStringMember");
lineGeom=this.buildGeometry.linestring.apply(this,[_9ee[i]]);
_9ef.appendChild(lineGeom);
gml.appendChild(_9ef);
}
return gml;
},linearring:function(_9f1){
var gml=this.createElementNS(this.gmlns,"gml:LinearRing");
gml.appendChild(this.buildCoordinatesNode(_9f1));
return gml;
},polygon:function(_9f3){
var gml=this.createElementNS(this.gmlns,"gml:Polygon");
var _9f5=_9f3.components;
var _9f6,ringGeom,type;
for(var i=0;i<_9f5.length;++i){
type=(i==0)?"outerBoundaryIs":"innerBoundaryIs";
_9f6=this.createElementNS(this.gmlns,"gml:"+type);
ringGeom=this.buildGeometry.linearring.apply(this,[_9f5[i]]);
_9f6.appendChild(ringGeom);
gml.appendChild(_9f6);
}
return gml;
},multipolygon:function(_9f8){
var gml=this.createElementNS(this.gmlns,"gml:MultiPolygon");
var _9fa=_9f8.components;
var _9fb,polyGeom;
for(var i=0;i<_9fa.length;++i){
_9fb=this.createElementNS(this.gmlns,"gml:polygonMember");
polyGeom=this.buildGeometry.polygon.apply(this,[_9fa[i]]);
_9fb.appendChild(polyGeom);
gml.appendChild(_9fb);
}
return gml;
}},buildCoordinatesNode:function(_9fd){
var _9fe=this.createElementNS(this.gmlns,"gml:coordinates");
_9fe.setAttribute("decimal",".");
_9fe.setAttribute("cs",",");
_9fe.setAttribute("ts"," ");
var _9ff=(_9fd.components)?_9fd.components:[_9fd];
var _a00=[];
for(var i=0;i<_9ff.length;i++){
_a00.push(_9ff[i].x+","+_9ff[i].y);
}
var _a02=this.createTextNode(_a00.join(" "));
_9fe.appendChild(_a02);
return _9fe;
},CLASS_NAME:"OpenLayers.Format.GML"});
OpenLayers.Format.GeoJSON=OpenLayers.Class(OpenLayers.Format.JSON,{initialize:function(_a03){
OpenLayers.Format.JSON.prototype.initialize.apply(this,[_a03]);
},read:function(json,type,_a06){
type=(type)?type:"FeatureCollection";
var _a07=null;
var obj=null;
if(typeof json=="string"){
obj=OpenLayers.Format.JSON.prototype.read.apply(this,[json,_a06]);
}else{
obj=json;
}
if(!obj){
OpenLayers.Console.error("Bad JSON: "+json);
}else{
if(typeof (obj.type)!="string"){
OpenLayers.Console.error("Bad GeoJSON - no type: "+json);
}else{
if(this.isValidType(obj,type)){
switch(type){
case "Geometry":
try{
_a07=this.parseGeometry(obj);
}
catch(err){
OpenLayers.Console.error(err);
}
break;
case "Feature":
try{
_a07=this.parseFeature(obj);
_a07.type="Feature";
}
catch(err){
OpenLayers.Console.error(err);
}
break;
case "GeometryCollection":
_a07=[];
for(var i=0;i<obj.geometries.length;++i){
try{
_a07.push(this.parseGeometry(obj.geometries[i]));
}
catch(err){
_a07=null;
OpenLayers.Console.error(err);
}
}
break;
case "FeatureCollection":
_a07=[];
switch(obj.type){
case "Feature":
try{
_a07.push(this.parseFeature(obj));
}
catch(err){
_a07=null;
OpenLayers.Console.error(err);
}
break;
case "FeatureCollection":
for(var i=0;i<obj.features.length;++i){
try{
_a07.push(this.parseFeature(obj.features[i]));
}
catch(err){
_a07=null;
OpenLayers.Console.error(err);
}
}
break;
case "GeometryCollection":
for(var i=0;i<obj.geometries.length;++i){
try{
var geom=this.parseGeometry(obj.geometries[i]);
_a07.push(new OpenLayers.Feature.Vector(geom));
}
catch(err){
_a07=null;
OpenLayers.Console.error(err);
}
}
break;
default:
try{
var geom=this.parseGeometry(obj);
_a07.push(new OpenLayers.Feature.Vector(geom));
}
catch(err){
_a07=null;
OpenLayers.Console.error(err);
}
}
break;
}
}
}
}
return _a07;
},isValidType:function(obj,type){
var _a0d=false;
switch(type){
case "Geometry":
if(OpenLayers.Util.indexOf(["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon","Box"],obj.type)==-1){
OpenLayers.Console.error("Unsupported geometry type: "+obj.type);
}else{
_a0d=true;
}
break;
case "FeatureCollection":
_a0d=true;
break;
default:
if(obj.type==type){
_a0d=true;
}else{
OpenLayers.Console.error("Cannot convert types from "+obj.type+" to "+type);
}
}
return _a0d;
},parseFeature:function(obj){
var _a0f,geometry,attributes;
attributes=(obj.properties)?obj.properties:{};
try{
geometry=this.parseGeometry(obj.geometry);
}
catch(err){
throw err;
}
_a0f=new OpenLayers.Feature.Vector(geometry,attributes);
if(obj.id){
_a0f.fid=obj.id;
}
return _a0f;
},parseGeometry:function(obj){
var _a11;
if(!(obj.coordinates instanceof Array)){
throw "Geometry must have coordinates array: "+obj;
}
if(!this.parseCoords[obj.type.toLowerCase()]){
throw "Unsupported geometry type: "+obj.type;
}
try{
_a11=this.parseCoords[obj.type.toLowerCase()].apply(this,[obj.coordinates]);
}
catch(err){
throw err;
}
return _a11;
},parseCoords:{"point":function(_a12){
if(_a12.length!=2){
throw "Only 2D points are supported: "+_a12;
}
return new OpenLayers.Geometry.Point(_a12[0],_a12[1]);
},"multipoint":function(_a13){
var _a14=[];
var p=null;
for(var i=0;i<_a13.length;++i){
try{
p=this.parseCoords["point"].apply(this,[_a13[i]]);
}
catch(err){
throw err;
}
_a14.push(p);
}
return new OpenLayers.Geometry.MultiPoint(_a14);
},"linestring":function(_a17){
var _a18=[];
var p=null;
for(var i=0;i<_a17.length;++i){
try{
p=this.parseCoords["point"].apply(this,[_a17[i]]);
}
catch(err){
throw err;
}
_a18.push(p);
}
return new OpenLayers.Geometry.LineString(_a18);
},"multilinestring":function(_a1b){
var _a1c=[];
var l=null;
for(var i=0;i<_a1b.length;++i){
try{
l=this.parseCoords["linestring"].apply(this,[_a1b[i]]);
}
catch(err){
throw err;
}
_a1c.push(l);
}
return new OpenLayers.Geometry.MultiLineString(_a1c);
},"polygon":function(_a1f){
var _a20=[];
var r,l;
for(var i=0;i<_a1f.length;++i){
try{
l=this.parseCoords["linestring"].apply(this,[_a1f[i]]);
}
catch(err){
throw err;
}
r=new OpenLayers.Geometry.LinearRing(l.components);
_a20.push(r);
}
return new OpenLayers.Geometry.Polygon(_a20);
},"multipolygon":function(_a23){
var _a24=[];
var p=null;
for(var i=0;i<_a23.length;++i){
try{
p=this.parseCoords["polygon"].apply(this,[_a23[i]]);
}
catch(err){
throw err;
}
_a24.push(p);
}
return new OpenLayers.Geometry.MultiPolygon(_a24);
},"box":function(_a27){
if(_a27.length!=2){
throw "GeoJSON box coordinates must have 2 elements";
}
return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(_a27[0][0],_a27[0][1]),new OpenLayers.Geometry.Point(_a27[1][0],_a27[0][1]),new OpenLayers.Geometry.Point(_a27[1][0],_a27[1][1]),new OpenLayers.Geometry.Point(_a27[0][0],_a27[1][1]),new OpenLayers.Geometry.Point(_a27[0][0],_a27[0][1])])]);
}},write:function(obj,_a29){
var _a2a={"type":null};
if(obj instanceof Array){
if(obj[0] instanceof OpenLayers.Feature.Vector){
_a2a.features=[];
}else{
if(obj[0].CLASS_NAME.search("OpenLayers.Geometry")==0){
_a2a.geometries=[];
}
}
for(var i=0;i<obj.length;++i){
var _a2c=obj[i];
if(_a2c instanceof OpenLayers.Feature.Vector){
if(_a2a.type==null){
_a2a.type="FeatureCollection";
if(_a2c.layer&&_a2c.layer.projection){
_a2a.crs=this.createCRSObject(_a2c);
}
}else{
if(_a2a.type!="FeatureCollection"){
OpenLayers.Console.error("FeatureCollection only supports collections of features: "+_a2c);
break;
}
}
_a2a.features.push(this.extract.feature.apply(this,[_a2c]));
}else{
if(_a2c.CLASS_NAME.search("OpenLayers.Geometry")==0){
if(_a2a.type==null){
_a2a.type="GeometryCollection";
}else{
if(_a2a.type!="GeometryCollection"){
OpenLayers.Console.error("GeometryCollection only supports collections of geometries: "+_a2c);
break;
}
}
_a2a.geometries.push(this.extract.geometry.apply(this,[_a2c]));
}
}
}
}else{
if(obj.CLASS_NAME.search("OpenLayers.Geometry")==0){
_a2a=this.extract.geometry.apply(this,[obj]);
}else{
if(obj instanceof OpenLayers.Feature.Vector){
_a2a=this.extract.feature.apply(this,[obj]);
if(obj.layer&&obj.layer.projection){
_a2a.crs=this.createCRSObject(obj);
}
}
}
}
return OpenLayers.Format.JSON.prototype.write.apply(this,[_a2a,_a29]);
},createCRSObject:function(_a2d){
var proj=_a2d.layer.projection;
var crs={};
if(proj.match(/epsg:/i)){
var code=parseInt(proj.substring(proj.indexOf(":")+1));
if(code==4326){
crs={"type":"OGC","properties":{"urn":"urn:ogc:def:crs:OGC:1.3:CRS84"}};
}else{
crs={"type":"EPSG","properties":{"code":code}};
}
}
return crs;
},extract:{"feature":function(_a31){
var geom=this.extract.geometry.apply(this,[_a31.geometry]);
return {"type":"Feature","id":_a31.fid==null?_a31.id:_a31.fid,"properties":_a31.attributes,"geometry":geom};
},"geometry":function(_a33){
var _a34=_a33.CLASS_NAME.split(".")[2];
var data=this.extract[_a34.toLowerCase()].apply(this,[_a33]);
return {"type":_a34,"coordinates":data};
},"point":function(_a36){
return [_a36.x,_a36.y];
},"multipoint":function(_a37){
var _a38=[];
for(var i=0;i<_a37.components.length;++i){
_a38.push(this.extract.point.apply(this,[_a37.components[i]]));
}
return _a38;
},"linestring":function(_a3a){
var _a3b=[];
for(var i=0;i<_a3a.components.length;++i){
_a3b.push(this.extract.point.apply(this,[_a3a.components[i]]));
}
return _a3b;
},"multilinestring":function(_a3d){
var _a3e=[];
for(var i=0;i<_a3d.components.length;++i){
_a3e.push(this.extract.linestring.apply(this,[_a3d.components[i]]));
}
return _a3e;
},"polygon":function(_a40){
var _a41=[];
for(var i=0;i<_a40.components.length;++i){
_a41.push(this.extract.linestring.apply(this,[_a40.components[i]]));
}
return _a41;
},"multipolygon":function(_a43){
var _a44=[];
for(var i=0;i<_a43.components.length;++i){
_a44.push(this.extract.polygon.apply(this,[_a43.components[i]]));
}
return _a44;
}},CLASS_NAME:"OpenLayers.Format.GeoJSON"});
OpenLayers.Format.GeoRSS=OpenLayers.Class(OpenLayers.Format.XML,{rssns:"http://backend.userland.com/rss2",featureNS:"http://mapserver.gis.umn.edu/mapserver",georssns:"http://www.georss.org/georss",geons:"http://www.w3.org/2003/01/geo/wgs84_pos#",featureTitle:"Untitled",featureDescription:"No Description",initialize:function(_a46){
OpenLayers.Format.XML.prototype.initialize.apply(this,[_a46]);
},createGeometryFromItem:function(item){
var _a48=this.getElementsByTagNameNS(item,this.georssns,"point");
var lat=this.getElementsByTagNameNS(item,this.geons,"lat");
var lon=this.getElementsByTagNameNS(item,this.geons,"long");
var line=this.getElementsByTagNameNS(item,this.georssns,"line");
var _a4c=this.getElementsByTagNameNS(item,this.georssns,"polygon");
if(_a48.length>0||(lat.length>0&&lon.length>0)){
if(_a48.length>0){
var _a4d=OpenLayers.String.trim(_a48[0].firstChild.nodeValue).split(/\s+/);
if(_a4d.length!=2){
var _a4d=OpenLayers.String.trim(_a48[0].firstChild.nodeValue).split(/\s*,\s*/);
}
}else{
var _a4d=[parseFloat(lat[0].firstChild.nodeValue),parseFloat(lon[0].firstChild.nodeValue)];
}
var _a4e=new OpenLayers.Geometry.Point(parseFloat(_a4d[1]),parseFloat(_a4d[0]));
}else{
if(line.length>0){
var _a4f=OpenLayers.String.trim(line[0].firstChild.nodeValue).split(/\s+/);
var _a50=[];
for(var i=0;i<_a4f.length;i+=2){
var _a48=new OpenLayers.Geometry.Point(parseFloat(_a4f[i+1]),parseFloat(_a4f[i]));
_a50.push(_a48);
}
_a4e=new OpenLayers.Geometry.LineString(_a50);
}else{
if(_a4c.length>0){
var _a4f=OpenLayers.String.trim(_a4c[0].firstChild.nodeValue).split(/\s+/);
var _a50=[];
for(var i=0;i<_a4f.length;i+=2){
var _a48=new OpenLayers.Geometry.Point(parseFloat(_a4f[i+1]),parseFloat(_a4f[i]));
_a50.push(_a48);
}
_a4e=new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(_a50)]);
}
}
}
return _a4e;
},createFeatureFromItem:function(item){
var _a53=this.createGeometryFromItem(item);
var _a54=this.getChildValue(item,"*","title",this.featureTitle);
var _a55=this.getChildValue(item,"*","description",this.getChildValue(item,"*","content",this.featureDescription));
var link=this.getChildValue(item,"*","link");
if(!link){
try{
link=this.getElementsByTagNameNS(item,"*","link")[0].getAttribute("href");
}
catch(e){
link=null;
}
}
var id=this.getChildValue(item,"*","id",null);
var data={"title":_a54,"description":_a55,"link":link};
var _a59=new OpenLayers.Feature.Vector(_a53,data);
_a59.fid=id;
return _a59;
},getChildValue:function(node,_a5b,name,def){
var _a5e;
try{
_a5e=this.getElementsByTagNameNS(node,_a5b,name)[0].firstChild.nodeValue;
}
catch(e){
_a5e=(def==undefined)?"":def;
}
return _a5e;
},read:function(doc){
if(typeof doc=="string"){
doc=OpenLayers.Format.XML.prototype.read.apply(this,[doc]);
}
var _a60=null;
_a60=this.getElementsByTagNameNS(doc,"*","item");
if(_a60.length==0){
_a60=this.getElementsByTagNameNS(doc,"*","entry");
}
var _a61=_a60.length;
var _a62=new Array(_a61);
for(var i=0;i<_a61;i++){
_a62[i]=this.createFeatureFromItem(_a60[i]);
}
return _a62;
},write:function(_a64){
var _a65;
if(_a64 instanceof Array){
_a65=this.createElementNS(this.rssns,"rss");
for(var i=0;i<_a64.length;i++){
_a65.appendChild(this.createFeatureXML(_a64[i]));
}
}else{
_a65=this.createFeatureXML(_a64);
}
return OpenLayers.Format.XML.prototype.write.apply(this,[_a65]);
},createFeatureXML:function(_a67){
var _a68=this.buildGeometryNode(_a67.geometry);
var _a69=this.createElementNS(this.rssns,"item");
var _a6a=this.createElementNS(this.rssns,"title");
_a6a.appendChild(this.createTextNode(_a67.attributes.title?_a67.attributes.title:""));
var _a6b=this.createElementNS(this.rssns,"description");
_a6b.appendChild(this.createTextNode(_a67.attributes.description?_a67.attributes.description:""));
_a69.appendChild(_a6a);
_a69.appendChild(_a6b);
if(_a67.attributes.link){
var _a6c=this.createElementNS(this.rssns,"link");
_a6c.appendChild(this.createTextNode(_a67.attributes.link));
_a69.appendChild(_a6c);
}
for(var attr in _a67.attributes){
if(attr=="link"||attr=="title"||attr=="description"){
continue;
}
var _a6e=this.createTextNode(_a67.attributes[attr]);
var _a6f=attr;
if(attr.search(":")!=-1){
_a6f=attr.split(":")[1];
}
var _a70=this.createElementNS(this.featureNS,"feature:"+_a6f);
_a70.appendChild(_a6e);
_a69.appendChild(_a70);
}
_a69.appendChild(_a68);
return _a69;
},buildGeometryNode:function(_a71){
var node;
if(_a71.CLASS_NAME=="OpenLayers.Geometry.Polygon"){
node=this.createElementNS(this.georssns,"georss:polygon");
node.appendChild(this.buildCoordinatesNode(_a71.components[0]));
}else{
if(_a71.CLASS_NAME=="OpenLayers.Geometry.LineString"){
node=this.createElementNS(this.georssns,"georss:line");
node.appendChild(this.buildCoordinatesNode(_a71));
}else{
if(_a71.CLASS_NAME=="OpenLayers.Geometry.Point"){
node=this.createElementNS(this.georssns,"georss:point");
node.appendChild(this.buildCoordinatesNode(_a71));
}else{
throw "Couldn't parse "+_a71.CLASS_NAME;
}
}
}
return node;
},buildCoordinatesNode:function(_a73){
var _a74=null;
if(_a73.components){
_a74=_a73.components;
}
var path;
if(_a74){
var _a76=_a74.length;
var _a77=new Array(_a76);
for(var i=0;i<_a76;i++){
_a77[i]=_a74[i].y+" "+_a74[i].x;
}
path=_a77.join(" ");
}else{
path=_a73.y+" "+_a73.x;
}
return this.createTextNode(path);
},CLASS_NAME:"OpenLayers.Format.GeoRSS"});
OpenLayers.Format.KML=OpenLayers.Class(OpenLayers.Format.XML,{kmlns:"http://earth.google.com/kml/2.0",placemarksDesc:"No description available",foldersName:"OpenLayers export",foldersDesc:"Exported on "+new Date(),extractAttributes:true,internalns:null,initialize:function(_a79){
this.regExes={trimSpace:(/^\s*|\s*$/g),removeSpace:(/\s*/g),splitSpace:(/\s+/),trimComma:(/\s*,\s*/g)};
OpenLayers.Format.XML.prototype.initialize.apply(this,[_a79]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);
}
var _a7b=this.getElementsByTagNameNS(data,"*","Placemark");
var _a7c=_a7b.length;
var _a7d=new Array(_a7c);
for(var i=0;i<_a7c;i++){
var _a7f=this.parseFeature(_a7b[i]);
if(_a7f){
_a7d[i]=_a7f;
}else{
throw "Bad Placemark: "+i;
}
}
return _a7d;
},parseFeature:function(node){
var _a81=["MultiGeometry","Polygon","LineString","Point"];
var type,nodeList,geometry,parser;
for(var i=0;i<_a81.length;++i){
type=_a81[i];
this.internalns=node.namespaceURI?node.namespaceURI:this.kmlns;
nodeList=this.getElementsByTagNameNS(node,this.internalns,type);
if(nodeList.length>0){
var _a84=this.parseGeometry[type.toLowerCase()];
if(_a84){
geometry=_a84.apply(this,[nodeList[0]]);
}else{
OpenLayers.Console.error("Unsupported geometry type: "+type);
}
break;
}
}
var _a85;
if(this.extractAttributes){
_a85=this.parseAttributes(node);
}
var _a86=new OpenLayers.Feature.Vector(geometry,_a85);
var fid=node.getAttribute("id");
if(fid!=null){
_a86.fid=fid;
}
return _a86;
},parseGeometry:{point:function(node){
var _a89=this.getElementsByTagNameNS(node,this.internalns,"coordinates");
var _a8a=[];
if(_a89.length>0){
var _a8b=_a89[0].firstChild.nodeValue;
_a8b=_a8b.replace(this.regExes.removeSpace,"");
_a8a=_a8b.split(",");
}
var _a8c=null;
if(_a8a.length>1){
if(_a8a.length==2){
_a8a[2]=null;
}
_a8c=new OpenLayers.Geometry.Point(_a8a[0],_a8a[1],_a8a[2]);
}else{
throw "Bad coordinate string: "+_a8b;
}
return _a8c;
},linestring:function(node,ring){
var _a8f=this.getElementsByTagNameNS(node,this.internalns,"coordinates");
var line=null;
if(_a8f.length>0){
var _a91=_a8f[0].firstChild.nodeValue;
_a91=_a91.replace(this.regExes.trimSpace,"");
_a91=_a91.replace(this.regExes.trimComma,",");
var _a92=_a91.split(this.regExes.splitSpace);
var _a93=_a92.length;
var _a94=new Array(_a93);
var _a95,numCoords;
for(var i=0;i<_a93;++i){
_a95=_a92[i].split(",");
numCoords=_a95.length;
if(numCoords>1){
if(_a95.length==2){
_a95[2]=null;
}
_a94[i]=new OpenLayers.Geometry.Point(_a95[0],_a95[1],_a95[2]);
}else{
throw "Bad LineString point coordinates: "+_a92[i];
}
}
if(_a93){
if(ring){
line=new OpenLayers.Geometry.LinearRing(_a94);
}else{
line=new OpenLayers.Geometry.LineString(_a94);
}
}else{
throw "Bad LineString coordinates: "+_a91;
}
}
return line;
},polygon:function(node){
var _a98=this.getElementsByTagNameNS(node,this.internalns,"LinearRing");
var _a99=_a98.length;
var _a9a=new Array(_a99);
if(_a99>0){
var ring;
for(var i=0;i<_a98.length;++i){
ring=this.parseGeometry.linestring.apply(this,[_a98[i],true]);
if(ring){
_a9a[i]=ring;
}else{
throw "Bad LinearRing geometry: "+i;
}
}
}
return new OpenLayers.Geometry.Polygon(_a9a);
},multigeometry:function(node){
var _a9e,parser;
var _a9f=[];
var _aa0=node.childNodes;
for(var i=0;i<_aa0.length;++i){
_a9e=_aa0[i];
if(_a9e.nodeType==1){
type=(_a9e.prefix)?_a9e.nodeName.split(":")[1]:_a9e.nodeName;
var _aa2=this.parseGeometry[type.toLowerCase()];
if(_aa2){
_a9f.push(_aa2.apply(this,[_a9e]));
}
}
}
return new OpenLayers.Geometry.Collection(_a9f);
}},parseAttributes:function(node){
var _aa4={};
var _aa5,grandchildren,grandchild;
var _aa6=node.childNodes;
for(var i=0;i<_aa6.length;++i){
_aa5=_aa6[i];
if(_aa5.nodeType==1){
grandchildren=_aa5.childNodes;
if(grandchildren.length==1){
grandchild=grandchildren[0];
if(grandchild.nodeType==3||grandchild.nodeType==4){
name=(_aa5.prefix)?_aa5.nodeName.split(":")[1]:_aa5.nodeName;
value=grandchild.nodeValue.replace(this.regExes.trimSpace,"");
_aa4[name]=value;
}
}
}
}
return _aa4;
},write:function(_aa8){
if(!(_aa8 instanceof Array)){
_aa8=[_aa8];
}
var kml=this.createElementNS(this.kmlns,"kml");
var _aaa=this.createFolderXML();
for(var i=0;i<_aa8.length;++i){
_aaa.appendChild(this.createPlacemarkXML(_aa8[i]));
}
kml.appendChild(_aaa);
return OpenLayers.Format.XML.prototype.write.apply(this,[kml]);
},createFolderXML:function(){
var _aac=this.createElementNS(this.kmlns,"name");
var _aad=this.createTextNode(this.foldersName);
_aac.appendChild(_aad);
var _aae=this.createElementNS(this.kmlns,"description");
var _aaf=this.createTextNode(this.foldersDesc);
_aae.appendChild(_aaf);
var _ab0=this.createElementNS(this.kmlns,"Folder");
_ab0.appendChild(_aac);
_ab0.appendChild(_aae);
return _ab0;
},createPlacemarkXML:function(_ab1){
var _ab2=this.createElementNS(this.kmlns,"name");
var name=(_ab1.attributes.name)?_ab1.attributes.name:_ab1.id;
_ab2.appendChild(this.createTextNode(name));
var _ab4=this.createElementNS(this.kmlns,"description");
var desc=(_ab1.attributes.description)?_ab1.attributes.description:this.placemarksDesc;
_ab4.appendChild(this.createTextNode(desc));
var _ab6=this.createElementNS(this.kmlns,"Placemark");
if(_ab1.fid!=null){
_ab6.setAttribute("id",_ab1.fid);
}
_ab6.appendChild(_ab2);
_ab6.appendChild(_ab4);
var _ab7=this.buildGeometryNode(_ab1.geometry);
_ab6.appendChild(_ab7);
return _ab6;
},buildGeometryNode:function(_ab8){
var _ab9=_ab8.CLASS_NAME;
var type=_ab9.substring(_ab9.lastIndexOf(".")+1);
var _abb=this.buildGeometry[type.toLowerCase()];
var node=null;
if(_abb){
node=_abb.apply(this,[_ab8]);
}
return node;
},buildGeometry:{point:function(_abd){
var kml=this.createElementNS(this.kmlns,"Point");
kml.appendChild(this.buildCoordinatesNode(_abd));
return kml;
},multipoint:function(_abf){
return this.buildGeometry.collection(_abf);
},linestring:function(_ac0){
var kml=this.createElementNS(this.kmlns,"LineString");
kml.appendChild(this.buildCoordinatesNode(_ac0));
return kml;
},multilinestring:function(_ac2){
return this.buildGeometry.collection(_ac2);
},linearring:function(_ac3){
var kml=this.createElementNS(this.kmlns,"LinearRing");
kml.appendChild(this.buildCoordinatesNode(_ac3));
return kml;
},polygon:function(_ac5){
var kml=this.createElementNS(this.kmlns,"Polygon");
var _ac7=_ac5.components;
var _ac8,ringGeom,type;
for(var i=0;i<_ac7.length;++i){
type=(i==0)?"outerBoundaryIs":"innerBoundaryIs";
_ac8=this.createElementNS(this.kmlns,type);
ringGeom=this.buildGeometry.linearring.apply(this,[_ac7[i]]);
_ac8.appendChild(ringGeom);
kml.appendChild(_ac8);
}
return kml;
},multipolygon:function(_aca){
return this.buildGeometry.collection(_aca);
},collection:function(_acb){
var kml=this.createElementNS(this.kmlns,"MultiGeometry");
var _acd;
for(var i=0;i<_acb.components.length;++i){
_acd=this.buildGeometryNode.apply(this,[_acb.components[i]]);
if(_acd){
kml.appendChild(_acd);
}
}
return kml;
}},buildCoordinatesNode:function(_acf){
var _ad0=this.createElementNS(this.kmlns,"coordinates");
var path;
var _ad2=_acf.components;
if(_ad2){
var _ad3;
var _ad4=_ad2.length;
var _ad5=new Array(_ad4);
for(var i=0;i<_ad4;++i){
_ad3=_ad2[i];
_ad5[i]=_ad3.x+","+_ad3.y;
}
path=_ad5.join(" ");
}else{
path=_acf.x+","+_acf.y;
}
var _ad7=this.createTextNode(path);
_ad0.appendChild(_ad7);
return _ad0;
},CLASS_NAME:"OpenLayers.Format.KML"});
OpenLayers.Geometry.LinearRing=OpenLayers.Class(OpenLayers.Geometry.LineString,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_ad8){
OpenLayers.Geometry.LineString.prototype.initialize.apply(this,arguments);
},addComponent:function(_ad9,_ada){
var _adb=false;
var _adc=this.components.pop();
if(_ada!=null||!_ad9.equals(_adc)){
_adb=OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,arguments);
}
var _add=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_add]);
return _adb;
},removeComponent:function(_ade){
if(this.components.length>4){
this.components.pop();
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
var _adf=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_adf]);
}
},move:function(x,y){
for(var i=0;i<this.components.length-1;i++){
this.components[i].move(x,y);
}
},rotate:function(_ae3,_ae4){
for(var i=0;i<this.components.length-1;++i){
this.components[i].rotate(_ae3,_ae4);
}
},resize:function(_ae6,_ae7){
for(var i=0;i<this.components.length-1;++i){
this.components[i].resize(_ae6,_ae7);
}
},getArea:function(){
var area=0;
if(this.components&&(this.components.length>2)){
var sum=0;
for(var i=0;i<this.components.length-1;i++){
var b=this.components[i];
var c=this.components[i+1];
sum+=(b.x+c.x)*(c.y-b.y);
}
area=-sum/2;
}
return area;
},CLASS_NAME:"OpenLayers.Geometry.LinearRing"});
OpenLayers.Handler.Path=OpenLayers.Class(OpenLayers.Handler.Point,{line:null,freehand:false,freehandToggle:"shiftKey",initialize:function(_aee,_aef,_af0){
OpenLayers.Handler.Point.prototype.initialize.apply(this,arguments);
},createFeature:function(){
this.line=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString());
this.point=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point());
},destroyFeature:function(){
OpenLayers.Handler.Point.prototype.destroyFeature.apply(this);
this.line.destroy();
this.line=null;
},addPoint:function(){
this.line.geometry.addComponent(this.point.geometry.clone(),this.line.geometry.components.length);
this.callback("point",[this.point.geometry]);
},freehandMode:function(evt){
return (this.freehandToggle&&evt[this.freehandToggle])?!this.freehand:this.freehand;
},modifyFeature:function(){
var _af2=this.line.geometry.components.length-1;
this.line.geometry.components[_af2].x=this.point.geometry.x;
this.line.geometry.components[_af2].y=this.point.geometry.y;
this.line.geometry.components[_af2].clearBounds();
},drawFeature:function(){
this.layer.drawFeature(this.line,this.style);
this.layer.drawFeature(this.point,this.style);
},geometryClone:function(){
return this.line.geometry.clone();
},mousedown:function(evt){
if(this.lastDown&&this.lastDown.equals(evt.xy)){
return false;
}
if(this.lastDown==null){
this.createFeature();
}
this.mouseDown=true;
this.lastDown=evt.xy;
var _af4=this.control.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_af4.lon;
this.point.geometry.y=_af4.lat;
if((this.lastUp==null)||!this.lastUp.equals(evt.xy)){
this.addPoint();
}
this.drawFeature();
this.drawing=true;
return false;
},mousemove:function(evt){
if(this.drawing){
var _af6=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_af6.lon;
this.point.geometry.y=_af6.lat;
if(this.mouseDown&&this.freehandMode(evt)){
this.addPoint();
}else{
this.modifyFeature();
}
this.drawFeature();
}
return true;
},mouseup:function(evt){
this.mouseDown=false;
if(this.drawing){
if(this.freehandMode(evt)){
this.finalize();
}else{
if(this.lastUp==null){
this.addPoint();
}
this.lastUp=evt.xy;
}
return false;
}
return true;
},dblclick:function(evt){
if(!this.freehandMode(evt)){
var _af9=this.line.geometry.components.length-1;
this.line.geometry.removeComponent(this.line.geometry.components[_af9]);
this.finalize();
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Path"});
OpenLayers.Format.WFS=OpenLayers.Class(OpenLayers.Format.GML,{layer:null,wfsns:"http://www.opengis.net/wfs",initialize:function(_afa,_afb){
OpenLayers.Format.GML.prototype.initialize.apply(this,[_afa]);
this.layer=_afb;
if(this.layer.featureNS){
this.featureNS=this.layer.featureNS;
}
if(this.layer.options.geometry_column){
this.geometryName=this.layer.options.geometry_column;
}
if(this.layer.options.typename){
this.featureName=this.layer.options.typename;
}
},write:function(_afc){
var _afd=document.createElementNS("http://www.opengis.net/wfs","wfs:Transaction");
_afd.setAttribute("version","1.0.0");
_afd.setAttribute("service","WFS");
for(var i=0;i<_afc.length;i++){
switch(_afc[i].state){
case OpenLayers.State.INSERT:
_afd.appendChild(this.insert(_afc[i]));
break;
case OpenLayers.State.UPDATE:
_afd.appendChild(this.update(_afc[i]));
break;
case OpenLayers.State.DELETE:
_afd.appendChild(this.remove(_afc[i]));
break;
}
}
return _afd;
},createFeatureXML:function(_aff){
var _b00=this.buildGeometryNode(_aff.geometry);
var _b01=document.createElementNS(this.featureNS,"feature:"+this.geometryName);
_b01.appendChild(_b00);
var _b02=document.createElementNS(this.featureNS,"feature:"+this.featureName);
_b02.appendChild(_b01);
for(var attr in _aff.attributes){
var _b04=document.createTextNode(_aff.attributes[attr]);
var _b05=attr;
if(attr.search(":")!=-1){
_b05=attr.split(":")[1];
}
var _b06=document.createElementNS(this.featureNS,"feature:"+_b05);
_b06.appendChild(_b04);
_b02.appendChild(_b06);
}
return _b02;
},insert:function(_b07){
var _b08=document.createElementNS(this.wfsns,"wfs:Insert");
_b08.appendChild(this.createFeatureXML(_b07));
return _b08;
},update:function(_b09){
if(!_b09.fid){
alert("Can't update a feature for which there is no FID.");
}
var _b0a=document.createElementNS(this.wfsns,"wfs:Update");
_b0a.setAttribute("typeName",this.layerName);
var _b0b=document.createElementNS(this.wfsns,"wfs:Property");
var _b0c=document.createElementNS("http://www.opengis.net/wfs","wfs:Name");
var _b0d=document.createTextNode(this.geometryName);
_b0c.appendChild(_b0d);
_b0b.appendChild(_b0c);
var _b0e=document.createElementNS("http://www.opengis.net/wfs","wfs:Value");
_b0e.appendChild(this.buildGeometryNode(_b09.geometry));
_b0b.appendChild(_b0e);
_b0a.appendChild(_b0b);
var _b0f=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _b10=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_b10.setAttribute("fid",_b09.fid);
_b0f.appendChild(_b10);
_b0a.appendChild(_b0f);
return _b0a;
},remove:function(_b11){
if(!_b11.attributes.fid){
alert("Can't update a feature for which there is no FID.");
return false;
}
var _b12=document.createElementNS(this.featureNS,"wfs:Delete");
_b12.setAttribute("typeName",this.layerName);
var _b13=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _b14=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_b14.setAttribute("fid",_b11.attributes.fid);
_b13.appendChild(_b14);
_b12.appendChild(_b13);
return _b12;
},destroy:function(){
this.layer=null;
},CLASS_NAME:"OpenLayers.Format.WFS"});
OpenLayers.Handler.Polygon=OpenLayers.Class(OpenLayers.Handler.Path,{polygon:null,initialize:function(_b15,_b16,_b17){
OpenLayers.Handler.Path.prototype.initialize.apply(this,arguments);
},createFeature:function(){
this.polygon=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon());
this.line=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LinearRing());
this.polygon.geometry.addComponent(this.line.geometry);
this.point=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point());
},destroyFeature:function(){
OpenLayers.Handler.Path.prototype.destroyFeature.apply(this);
this.polygon.destroy();
this.polygon=null;
},modifyFeature:function(){
var _b18=this.line.geometry.components.length-2;
this.line.geometry.components[_b18].x=this.point.geometry.x;
this.line.geometry.components[_b18].y=this.point.geometry.y;
this.line.geometry.components[_b18].clearBounds();
},drawFeature:function(){
this.layer.drawFeature(this.polygon,this.style);
this.layer.drawFeature(this.point,this.style);
},geometryClone:function(){
return this.polygon.geometry.clone();
},dblclick:function(evt){
if(!this.freehandMode(evt)){
var _b1a=this.line.geometry.components.length-2;
this.line.geometry.removeComponent(this.line.geometry.components[_b1a]);
this.finalize();
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Polygon"});
OpenLayers.Control.EditingToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(_b1b,_b1c){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_b1c]);
this.addControls([new OpenLayers.Control.Navigation()]);
var _b1d=[new OpenLayers.Control.DrawFeature(_b1b,OpenLayers.Handler.Point,{"displayClass":"olControlDrawFeaturePoint"}),new OpenLayers.Control.DrawFeature(_b1b,OpenLayers.Handler.Path,{"displayClass":"olControlDrawFeaturePath"}),new OpenLayers.Control.DrawFeature(_b1b,OpenLayers.Handler.Polygon,{"displayClass":"olControlDrawFeaturePolygon"})];
for(var i=0;i<_b1d.length;i++){
_b1d[i].featureAdded=function(_b1f){
_b1f.state=OpenLayers.State.INSERT;
};
}
this.addControls(_b1d);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.EditingToolbar"});

function WidgetBase(_1,_2){
this.model=_2;
this.widgetNode=_1;
var _3=false;
if(_2.modelNode.attributes.getNamedItem("createByTemplate")&&_2.modelNode.attributes.getNamedItem("createByTemplate").nodeValue=="true"){
_1.setAttribute("id","MbWidget_"+mbIds.getId());
_3=true;
}
if(_1.attributes.getNamedItem("id")){
this.id=_1.attributes.getNamedItem("id").nodeValue;
}else{
alert(mbGetMessage("idRequired",_1.nodeName));
}
var _4=_1.selectSingleNode("mb:outputNodeId");
if(_3){
this.outputNodeId=this.id;
}else{
if(_4){
this.outputNodeId=_4.firstChild.nodeValue;
}else{
this.outputNodeId="MbWidget_"+mbIds.getId();
}
}
if(!this.htmlTagId){
var _5=_1.selectSingleNode("mb:htmlTagId");
if(_5){
this.htmlTagId=_5.firstChild.nodeValue;
}else{
this.htmlTagId=this.id;
}
}
this.getNode=function(){
var _6=document.getElementById(this.htmlTagId);
if(!_6){
}
return _6;
};
this.autoRefresh=true;
var _7=_1.selectSingleNode("mb:autoRefresh");
if(_7&&_7.firstChild.nodeValue=="false"){
this.autoRefresh=false;
}
if(_1.selectSingleNode("mb:debug")){
this.debug=true;
}
this.initTargetModel=function(_8){
var _9=_8.widgetNode.selectSingleNode("mb:targetModel");
if(_9){
_8.targetModel=window.config.objects[_9.firstChild.nodeValue];
if(!_8.targetModel){
alert(mbGetMessage("noTargetModelWidget",_9.firstChild.nodeValue,_8.id));
}
}else{
_8.targetModel=_8.model;
}
};
this.model.addListener("init",this.initTargetModel,this);
this.prePaint=function(_a){
};
this.postPaint=function(_b){
};
this.clearWidget=function(_c){
var _d=document.getElementById(_c.outputNodeId);
var _e=_c.getNode();
if(_e&&_d){
_e.removeChild(_d);
}
};
this.model.addListener("newModel",this.clearWidget,this);
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
if(_7.model.doc&&_7.getNode()){
_7.stylesheet.setParameter("modelUrl",_7.model.url);
_7.stylesheet.setParameter("targetModelId",_7.targetModel.id);
_7.resultDoc=_7.model.doc;
_7.prePaint(_7);
if(_7.debug){
mbDebugMessage(_7,"prepaint:"+(new XMLSerializer()).serializeToString(_7.resultDoc));
}
if(_7.debug){
mbDebugMessage(_7,"stylesheet:"+(new XMLSerializer()).serializeToString(_7.stylesheet.xslDom));
}
var _9=document.getElementById(_7.outputNodeId);
var _a=document.createElement("DIV");
var s=_7.stylesheet.transformNodeToString(_7.resultDoc);
if(config.serializeUrl&&_7.debug){
postLoad(config.serializeUrl,s);
}
if(_7.debug){
mbDebugMessage(_7,"painting:"+_7.id+":"+s);
}
_a.innerHTML=s;
if(_a.firstChild!=null){
_a.firstChild.setAttribute("id",_7.outputNodeId);
if(_9){
_7.getNode().replaceChild(_a.firstChild,_9);
}else{
_7.getNode().appendChild(_a.firstChild);
}
}
_7.postPaint(_7);
}
};
this.model.addListener("refresh",this.paint,this);
}

function ToolBase(_1,_2){
this.model=_2;
this.toolNode=_1;
var id=_1.selectSingleNode("@id");
if(id){
this.id=getNodeValue(id);
}else{
this.id="MbTool_"+mbIds.getId();
}
this.initTargetModel=function(_4){
var _5=_4.toolNode.selectSingleNode("mb:targetModel");
if(_5){
var _6=_5.firstChild.nodeValue;
_4.targetModel=window.config.objects[_6];
if(!_4.targetModel){
alert(mbGetMessage("noTargetModelTool",_6,_4.id));
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
alert(mbGetMessage("noMouseHandlerTool",_8.firstChild.nodeValue,_7.id));
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

var Rearth=6378137;
var degToMeter=Rearth*2*Math.PI/360;
var mbScaleFactor=3571.428;
var minScale=1000;
var maxScale=200000;
function Extent(_1,_2){
this.model=_1;
this.id=_1.id+"_MbExtent"+mbIds.getId();
this.size=new Array();
this.res=new Array();
this.zoomBy=4;
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
var _7="function sort(a,b){return b-a}";
var _8=eval(_7);
var _9=this.zoomLevels.sort(_8);
var i=0;
while(_9[i]>=_6){
i++;
}
if(i==0){
i=1;
}
this.fixedScale=_9[i-1];
}else{
this.fixedScale=Math.max(this.res[0],this.res[1]);
}
return this.fixedScale;
};
this.setZoomLevels=function(_b,_c){
if(_b){
this.zoomLevels=_c;
}else{
this.zoomLevels=null;
}
};
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

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function History(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.init=function(_3){
_3.model.active=-1;
_3.model.historyList=new Array();
_3.add(_3);
};
this.add=function(_4){
if(_4.model.active!=null){
var _5=_4.model.active;
var _6=_4.model.historyList;
var _7=_4.targetModel.map.getExtent().getCenterLonLat();
var _8=_4.targetModel.map.getScale()-1;
if(_5>-1){
if(_7.toString()==_6[_5].center.toString()&&_8==_6[_5].scale){
return;
}
}
var _9=new Object({center:_7,scale:_8});
if(_5==(_6.length-1)){
_6.push(_9);
_5=_5+1;
}else{
_5=_5+1;
_6=_6.slice(0,_5);
_6.push(_9);
}
_4.model.active=_5;
_4.model.historyList=_6;
}
};
this.back=function(_a){
var _b=_a.model.active;
if(_b<1){
_a.model.previousExtent=null;
alert(mbGetMessage("cantGoBack"));
}else{
_b=_b-1;
_a.model.active=_b;
_a.model.previousExtent=_a.model.historyList[_b];
}
};
this.forward=function(_c){
var _d=_c.model.active;
if(_d<(_c.model.historyList.length-1)){
_d=_d+1;
_c.model.active=_d;
_c.model.nextExtent=_c.model.historyList[_d];
}else{
_c.model.nextExtent=null;
alert(mbGetMessage("cantGoForward"));
}
};
this.stop=function(_e){
_e.model.removeListener("bbox",_e.add,_e);
};
this.start=function(_f){
_f.model.addListener("bbox",_f.add,_f);
};
this.initReset=function(_10){
_10.targetModel.addListener("bbox",_10.add,_10);
_10.targetModel.addListener("loadModel",_10.init,_10);
};
this.model.addListener("historyBack",this.back,this);
this.model.addListener("historyForward",this.forward,this);
this.model.addListener("historyStart",this.start,this);
this.model.addListener("historyStop",this.stop,this);
this.model.addListener("init",this.initReset,this);
}

