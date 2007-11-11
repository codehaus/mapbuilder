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
var _24=new window[_23](_22,this);
if(_24){
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
if(!document.getElementById(this.panelHtmlTagId)){
var _8=document.getElementById(this.htmlTagId);
var _9=document.createElement("div");
_9.setAttribute("id",this.panelHtmlTagId);
_9.setAttribute("class","olControlPanel");
_8.appendChild(_9);
_8.innerHTML+=" ";
}
loadCss("controlPanel.css");
WidgetBase.apply(this,new Array(_1,_2));
this.buttonType=_1.selectSingleNode("mb:class").firstChild.nodeValue;
if(this.buttonType=="RadioButton"){
this.enabled=false;
}
var _a=_1.selectSingleNode("mb:action");
if(_a){
this.action=_a.firstChild.nodeValue;
}
var _b=_1.selectSingleNode("mb:tooltip");
if(_b){
this.tooltip=_b.firstChild.nodeValue;
}
var _c=_1.selectSingleNode("mb:disabledSrc");
if(_c){
this.disabledImage=config.skinDir+_c.firstChild.nodeValue;
}
var _d=_1.selectSingleNode("mb:enabledSrc");
if(_d){
this.enabledImage=config.skinDir+_d.firstChild.nodeValue;
}
this.cursor="default";
var _e=this.widgetNode.selectSingleNode("mb:cursor");
if(_e!=null){
var _f=_e.firstChild.nodeValue;
this.cursor=_f;
}
var _10=_1.selectSingleNode("mb:selected");
if(_10&&_10.firstChild.nodeValue){
this.selected=true;
}
this.getButtonClass=function(_11,_12){
var _13;
if(_11.control.displayClass){
_13=_11.control.displayClass;
}else{
_13=_11.control.CLASS_NAME;
_13=_13.replace(/OpenLayers/,"ol").replace(/\./g,"");
}
_13+="Item";
return "."+_13+_12;
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
this.doSelect=function(_14,_15){
};
this.attachToOL=function(_16,_17){
if(_17&&(_17!=_16.id)){
return;
}
if(!_16.createControl){
return;
}
var _18=_16.createControl(_16);
var _19=OpenLayers.Class(_18,{superclass:_18.prototype,trigger:function(){
if(this.superclass.trigger){
this.superclass.trigger.call(this);
}
_16.doSelect(_16,true);
},activate:function(){
if(this.superclass.activate.call(this)){
this.panel_div.style.backgroundImage="url(\""+_16.enabledImage+"\")";
this.map.div.style.cursor=_16.cursor;
this.map.mbCursor=_16.cursor;
_16.enabled=true;
this.active=true;
_16.doSelect(_16,true);
}
},deactivate:function(){
if(this.superclass.deactivate.call(this)){
this.panel_div.style.backgroundImage="url(\""+_16.disabledImage+"\")";
_16.enabled=false;
this.active=false;
_16.doSelect(_16,false);
}
},destroy:function(){
this.superclass.destroy.apply(this,arguments);
this.div=null;
}});
_16.control=_16.instantiateControl?_16.instantiateControl(_16,_19):new _19();
var map=_16.targetContext.map;
_16.panel=_16.targetContext.buttonBars[_16.htmlTagId];
if(!_16.panel||_16.panel.map==null){
var _1b=OpenLayers.Class(OpenLayers.Control.Panel,{div:document.getElementById(_16.panelHtmlTagId),defaultControl:null,destroy:function(){
OpenLayers.Control.Panel.prototype.destroy.apply(this,arguments);
this.div=null;
}});
_16.panel=new _1b();
_16.targetContext.buttonBars[_16.htmlTagId]=_16.panel;
map.addControl(_16.panel);
}
_16.panel.addControls(_16.control);
if(_16.tooltip){
_16.control.panel_div.title=_16.tooltip;
}
_16.control.panel_div.style.backgroundImage="url(\""+_16.disabledImage+"\")";
if(_16.selected==true){
_16.control.activate();
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
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Back(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{objRef:_3,type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
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
var _4=OpenLayers.Class(OpenLayers.Control,{objRef:_3,type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
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
this.model.addListener("hidden",this.hidden,this);
this.model.addListener("addLayer",this.addLayer,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("moveLayerUp",this.moveLayerUp,this);
this.model.addListener("moveLayerDown",this.moveLayerDown,this);
this.model.addListener("opacity",this.setOpacity,this);
this.model.addListener("bbox",this.zoomToBbox,this);
this.model.addListener("newModel",this.clearWidget2,this);
}
MapPaneOL.prototype.paint=function(_d,_e){
if(_d.model.buttonBars&&_d.model.map){
for(var i in _d.model.buttonBars){
_d.model.map.removeControl(_d.model.buttonBars[i]);
}
_d.model.buttonBars=new Array();
}
if(!_d.model.map||_e=="sld"){
if(_e=="sld"){
_d.clearWidget2(_d);
}
if(_d.model.doc.selectSingleNode("//wmc:OWSContext")){
_d.context="OWS";
}else{
if(_d.model.doc.selectSingleNode("//wmc:ViewContext")){
_d.context="View";
}else{
alert(mbGetMessage("noContextDefined"));
}
}
var _10=_d.model.proj;
var _11=null;
_11=_d.widgetNode.selectSingleNode("mb:maxExtent");
_11=(_11)?_11.firstChild.nodeValue.split(" "):null;
if(!_11){
_11=_d.model.getBoundingBox();
}
_11=(_11)?new OpenLayers.Bounds(_11[0],_11[1],_11[2],_11[3]):null;
if(_11==null){
alert(mbGetMessage("noBboxInContext"));
}
var _12=null;
_12=_d.widgetNode.selectSingleNode("mb:maxResolution");
_12=(_12)?parseFloat(_12.firstChild.nodeValue):"auto";
var _13=_10.units=="meters"?"m":_10.units;
var _14=_d.widgetNode.selectSingleNode("mb:resolutions");
_14=_14?_14.firstChild.nodeValue.split(","):null;
for(var r in _14){
_14[r]=parseFloat(_14[r]);
}
var _16=_d.widgetNode.selectSingleNode("mb:scales");
if(_16){
_16=_16.firstChild.nodeValue.split(",");
_14=new Array();
for(var s in _16){
_14.push(OpenLayers.Util.getResolutionFromScale(_16[s],_13));
}
}
if(_14){
_d.model.extent.setZoomLevels(true,_14);
}else{
_d.model.extent.setZoomLevels(false);
}
var _18=document.getElementById(_d.containerNodeId);
var _19=null;
_19=_d.widgetNode.selectSingleNode("mb:fixedSize");
_19=(_19)?_19.firstChild.nodeValue:null;
if(_19=="true"){
_18.style.width=_d.model.getWindowWidth()+"px";
_18.style.height=_d.model.getWindowHeight()+"px";
}
var _1a={controls:[],projection:_10.srs,units:_13,maxExtent:_11,maxResolution:_12,resolutions:_14,theme:null};
_d.model.map=new OpenLayers.Map(_18,_1a);
_d.model.map.Z_INDEX_BASE.Control=10000;
var _1b=_d.model.getAllLayers();
if(!_d.oLlayers){
_d.oLlayers=new Array();
}
for(var i=0;i<=_1b.length-1;i++){
_d.addLayer(_d,_1b[i]);
}
var _1c=_d.model.getBoundingBox();
_d.model.map.mbMapPane=_d;
_d.model.map.events.register("moveend",_d.model.map,_d.updateContext);
_d.model.map.events.register("mouseup",_d.model.map,_d.updateMouse);
_d.model.callListeners("bbox");
}
};
MapPaneOL.prototype.increaseLoadingLayers=function(e){
++this.loadingLayers;
var _1e=mbGetMessage((this.loadingLayers>1)?"loadingLayers":"loadingLayer",this.loadingLayers);
this.model.setParam("modelStatus",_1e);
};
MapPaneOL.prototype.decreaseLoadingLayers=function(e){
--this.loadingLayers;
var _20=this.loadingLayers>0?mbGetMessage((this.loadingLayers>1)?"loadingLayers":"loadingLayer",this.loadingLayers):null;
this.model.setParam("modelStatus",_20);
};
MapPaneOL.prototype.updateContext=function(e){
var _22=e.object.mbMapPane;
var _23=_22.model.map.getExtent().toBBOX().split(",");
var ul=new Array(_23[0],_23[3]);
var lr=new Array(_23[2],_23[1]);
if(_22.model.getWindowWidth()!=e.element.offsetWidth){
_22.model.setWindowWidth(e.element.offsetWidth);
}
if(_22.model.getWindowHeight()!=e.element.offsetHeight){
_22.model.setWindowHeight(e.element.offsetHeight);
}
var _26=_22.model.getParam("aoi");
var _27=new Array(ul,lr);
if(!_26||_26.toString()!=_27.toString()){
_22.model.setBoundingBox(new Array(ul[0],lr[1],lr[0],ul[1]));
_22.model.extent.setSize(_22.model.map.getResolution());
_22.model.setParam("aoi",_27);
}
};
MapPaneOL.prototype.updateMouse=function(e){
var _29=e.object.mbMapPane;
if(_29.model.map.mbCursor){
_29.model.map.div.style.cursor=_29.model.map.mbCursor;
}
};
MapPaneOL.prototype.zoomToBbox=function(_2a){
if(_2a.model.map){
var _2b=_2a.model.getBoundingBox();
var _2c=[];
var _2d=_2a.model.map.getExtent();
if(_2d){
_2c=_2d.toBBOX();
}
if(_2b.toString()!=_2c.toString()){
_2a.model.map.zoomToExtent(new OpenLayers.Bounds(_2b[0],_2b[1],_2b[2],_2b[3]));
}
}
};
MapPaneOL.prototype.hidden=function(_2e,_2f){
var vis=_2e.model.getHidden(_2f);
if(vis=="1"){
var _31=false;
}else{
var _31=true;
}
var _32=_2e.getLayer(_2e,_2f);
if(_32){
_32.setVisibility(_31);
}
};
MapPaneOL.prototype.getLayer=function(_33,_34){
return _33.model.map.getLayer(_33.oLlayers[_34].id);
};
MapPaneOL.prototype.deleteLayer=function(_35,_36){
if(_35.oLlayers[_36]){
_35.model.map.removeLayer(_35.oLlayers[_36]);
}
};
MapPaneOL.prototype.deleteAllLayers=function(_37){
_37.model.map.destroy();
};
MapPaneOL.prototype.moveLayerUp=function(_38,_39){
var map=_38.model.map;
map.raiseLayer(map.getLayer(_38.oLlayers[_39].id),1);
};
MapPaneOL.prototype.moveLayerDown=function(_3b,_3c){
_3b.model.map.raiseLayer(_3b.getLayer(_3b,_3c),-1);
};
MapPaneOL.prototype.setOpacity=function(_3d,_3e){
var _3f="1";
_3f=_3d.model.getOpacity(_3e);
_3d.getLayer(_3d,_3e).setOpacity(_3f);
};
MapPaneOL.prototype.addLayer=function(_40,_41){
var _42=_41;
var _43=_42.selectSingleNode("wmc:Server/@service");
_43=(_43)?_43.nodeValue:"";
var _44=_42.selectSingleNode("wmc:Title");
_44=(_44)?_44.firstChild.nodeValue:"";
var _45=_42.selectSingleNode("wmc:Name");
_45=(_45)?_45.firstChild.nodeValue:"";
if(_40.context=="OWS"){
var _46=_42.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");
_46=(_46)?getNodeValue(_46):"";
}else{
if(_SARISSA_IS_SAFARI){
var _47=_42.selectSingleNode("wmc:Server/wmc:OnlineResource");
var _46=_47.attributes[1].nodeValue;
}else{
if(_SARISSA_IS_OPERA){
var _46=_42.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttributeNS("http://www.w3.org/1999/xlink","href");
}else{
var _46=_42.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
}
}
}
var _48=_42.selectSingleNode("wmc:FormatList/wmc:Format");
_48=(_48)?_48.firstChild.nodeValue:"image/gif";
var vis=_42.selectSingleNode("@hidden");
if(vis){
if(vis.nodeValue=="1"){
vis=false;
}else{
vis=true;
}
}
var _4a=_42.selectSingleNode("@queryable");
if(_4a){
if(_4a.nodeValue=="1"){
_4a=true;
}else{
_4a=false;
}
}
var _4b=_42.selectSingleNode("@opacity");
if(_4b){
_4b=_4b.nodeValue;
}else{
_4b=false;
}
var _4c=_42.selectSingleNode("wmc:StyleList/wmc:Style[@current=1]");
var _4d={visibility:vis,projection:_40.model.map.projection,queryable:_4a,maxExtent:_40.model.map.maxExtent,maxResolution:_40.model.map.maxResolution,alpha:false,isBaseLayer:false,displayOutsideMaxExtent:_40.displayOutsideMaxExtent};
switch(_43){
case "OGC":
case "WMS":
case "wms":
case "OGC:WMS":
if(!_40.model.map.baseLayer){
_4d.isBaseLayer=true;
}else{
_4d.reproject=_40.imageReproject;
_4d.isBaseLayer=false;
}
_4d.ratio=_40.imageBuffer;
_4d.singleTile=true;
var _4e=new Array();
_4e=sld2UrlParam(_4c);
if(_40.model.timestampList&&_40.model.timestampList.getAttribute("layerName")==_45){
var _4f=_40.model.timestampList.childNodes[0];
_40.oLlayers[_45]=new OpenLayers.Layer.WMS(_44,_46,{layers:_45,transparent:_4d.isBaseLayer?"FALSE":"TRUE","TIME":_4f.firstChild.nodeValue,format:_48,sld:_4e.sld,sld_body:_4e.sld_body,styles:_4e.styles},_4d);
this.model.addListener("timestamp",this.timestampListener,this);
}else{
_40.oLlayers[_45]=new OpenLayers.Layer.WMS(_44,_46,{layers:_45,transparent:_4d.isBaseLayer?"FALSE":"TRUE",format:_48,sld:_4e.sld,sld_body:_4e.sld_body,styles:_4e.styles},_4d);
}
break;
case "WMS-C":
case "OGC:WMS-C":
if(!_40.model.map.baseLayer){
_4d.isBaseLayer=true;
}else{
_4d.reproject=_40.imageReproject;
_4d.isBaseLayer=false;
}
_4d.gutter=_40.tileGutter;
_4d.buffer=_40.tileBuffer;
_4d.tileSize=new OpenLayers.Size(_40.tileSize,_40.tileSize);
var _4e=new Array();
_4e=sld2UrlParam(_4c);
_40.oLlayers[_45]=new OpenLayers.Layer.WMS(_44,_46,{layers:_45,transparent:_4d.isBaseLayer?"FALSE":"TRUE",format:_48,sld:_4e.sld,sld_body:_4e.sld_body,styles:_4e.styles},_4d);
break;
case "wfs":
case "OGC:WFS":
style=sld2OlStyle(_4c);
if(style){
_4d.style=style;
}else{
_4d.style=_40.getWebSafeStyle(_40,2*i+1);
}
_4d.featureClass=OpenLayers.Feature.WFS;
_40.oLlayers[_45]=new OpenLayers.Layer.WFS(_44,_46,{typename:_45,maxfeatures:1000},_4d);
break;
case "gml":
case "OGC:GML":
style=sld2OlStyle(_4c);
if(style){
_4d.style=style;
}else{
_4d.style=_40.getWebSafeStyle(_40,2*i+1);
}
_40.oLlayers[_45]=new OpenLayers.Layer.GML(_44,_46,_4d);
break;
case "GMAP":
case "Google":
_4d.projection="EPSG:41001";
_4d.units="degrees";
_40.model.map.units="degrees";
_4d.maxExtent=new OpenLayers.Bounds("-180","-90","180","90");
_4d.isBaseLayer=true;
_40.oLlayers[_45]=new OpenLayers.Layer.Google("Google Satellite",{type:G_HYBRID_MAP,maxZoomLevel:18},_4d);
break;
case "YMAP":
case "Yahoo":
_4d.isBaseLayer=true;
_40.oLlayers[_45]=new OpenLayers.Layer.Yahoo("Yahoo");
break;
case "VE":
case "Microsoft":
_4d.isBaseLayer=true;
_40.oLlayers[_45]=new OpenLayers.Layer.VirtualEarth("VE",{minZoomLevel:0,maxZoomLevel:18,type:VEMapStyle.Hybrid});
break;
case "MultiMap":
_4d.isBaseLayer=true;
_40.oLlayers[_45]=new OpenLayers.Layer.MultiMap("MultiMap");
break;
default:
alert(mbGetMessage("layerTypeNotSupported",_43));
}
if(_4b&&_40.oLlayers[_45]){
_40.oLlayers[_45].setOpacity(_4b);
}
_40.oLlayers[_45].events.register("loadstart",_40,_40.increaseLoadingLayers);
_40.oLlayers[_45].events.register("loadend",_40,_40.decreaseLoadingLayers);
_40.oLlayers[_45].events.register("loadcancel",_40,function(){
alert("error");
});
_40.model.map.addLayer(_40.oLlayers[_45]);
};
MapPaneOL.prototype.getWebSafeStyle=function(_50,_51){
colors=new Array("00","33","66","99","CC","FF");
_51=(_51)?_51:0;
_51=(_51<0)?0:_51;
_51=(_51>215)?215:_51;
i=parseInt(_51/36);
j=parseInt((_51-i*36)/6);
k=parseInt((_51-i*36-j*6));
var _52="#"+colors[i]+colors[j]+colors[k];
var _53=new Object();
_53.fillColor=_52;
_53.strokeColor=_52;
_53.map=_50.model.map;
return _53;
};
MapPaneOL.prototype.refreshLayer=function(_54,_55,_56){
_56["version"]=Math.random();
_54.getLayer(_54,_55).mergeNewParams(_56);
};
MapPaneOL.prototype.clearWidget2=function(_57){
if(_57.model.map){
_57.model.map.destroy();
var _58=document.getElementById(_57.containerNodeId);
var _59=document.getElementById(_57.model.id+"Container_OpenLayers_ViewPort");
if(_58&&_59){
_58.removeChild(_59);
}
_57.model.map=null;
_57.oLlayers=null;
}
};
MapPaneOL.prototype.timestampListener=function(_5a,_5b){
var _5c=_5a.model.timestampList.getAttribute("layerName");
var _5d=_5a.model.timestampList.childNodes[_5b];
if((_5c)&&(_5d)){
var _5e=_5a.oLlayers[_5c];
var _5f=_5e.grid[0][0].imgDiv.src;
var _60=_5f;
_60=_60.replace(/TIME\=.*?\&/,"TIME="+_5d.firstChild.nodeValue+"&");
function imageLoaded(){
window.movieLoop.frameIsLoading=false;
}
window.movieLoop.frameIsLoading=true;
var _61=_5e.grid[0][0].imgDiv;
if(_61.addEventListener){
_61.addEventListener("load",imageLoaded,false);
}else{
if(_61.attachEvent){
_61.attachEvent("onload",imageLoaded);
}
}
_61.src=_60;
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
this.mousemoveHandler=function(_b){
var _c=document.getElementById(this.formName);
if(!_b){
return;
}
var _d=this.model.map.getLonLatFromPixel(_b.xy);
var pt=new PT(_d.lon,_d.lat);
cs_transform(this.proj,this.epsg4326,pt);
var _f=new OpenLayers.LonLat(pt.x,pt.y);
if(this.showPx){
if(_c.px){
_c.px.value=_b.xy.x;
}
if(_c.py){
_c.py.value=_b.xy.y;
}
}
if(this.showXY){
if(_c.x){
_c.x.value=_d.lon.toFixed(this.precision);
}
if(_c.y){
_c.y.value=_d.lat.toFixed(this.precision);
}
}
if(this.showLatLong){
if(_c.longitude){
_c.longitude.value=_f.lon.toFixed(this.precision);
}
if(_c.latitude){
_c.latitude.value=_f.lat.toFixed(this.precision);
}
}
if(this.showDMS){
var _10=this.convertDMS(_f.lon,"LON");
if(_c.longdeg){
_c.longdeg.value=_10[0];
}
if(_c.longmin){
_c.longmin.value=_10[1];
}
if(_c.longsec){
_c.longsec.value=_10[2];
}
if(_c.longH){
_c.longH.value=_10[3];
}
var _11=this.convertDMS(_f.lat,"LAT");
if(_c.latdeg){
_c.latdeg.value=_11[0];
}
if(_c.latmin){
_c.latmin.value=_11[1];
}
if(_c.latsec){
_c.latsec.value=_11[2];
}
if(_c.latH){
_c.latH.value=_11[3];
}
}
if(this.showDM){
var _10=this.convertDM(_f.lon,"LON");
if(_c.longDMdeg){
_c.longDMdeg.value=_10[0];
}
if(_c.longDMmin){
_c.longDMmin.value=_10[1];
}
if(_c.longDMH){
_c.longDMH.value=_10[2];
}
var _11=this.convertDM(_f.lat,"LAT");
if(_c.latDMdeg){
_c.latDMdeg.value=_11[0];
}
if(_c.latDMmin){
_c.latDMmin.value=_11[1];
}
if(_c.latDMH){
_c.latDMH.value=_11[2];
}
}
if(this.showMGRS){
if(!this.MGRS){
this.MGRS=new MGRS();
}
_c.mgrs.value=this.MGRS.convert(_f.lat,_f.lon);
}
};
this.mouseoutHandler=function(evt){
var _13=document.getElementById(this.formName);
if(this.showPx){
if(_13.px){
_13.px.value="";
}
if(_13.py){
_13.py.value="";
}
}
if(this.showXY){
if(_13.x){
_13.x.value="";
}
if(_13.y){
_13.y.value="";
}
}
if(this.showLatLong){
if(_13.longitude){
_13.longitude.value="";
}
if(_13.latitude){
_13.latitude.value="";
}
}
if(this.showDMS){
if(_13.longdeg){
_13.longdeg.value="";
}
if(_13.longmin){
_13.longmin.value="";
}
if(_13.longsec){
_13.longsec.value="";
}
if(_13.longH){
_13.longH.value="";
}
if(_13.latdeg){
_13.latdeg.value="";
}
if(_13.latmin){
_13.latmin.value="";
}
if(_13.latsec){
_13.latsec.value="";
}
if(_13.latH){
_13.latH.value="";
}
}
if(this.showDM){
if(_13.longDMdeg){
_13.longDMdeg.value="";
}
if(_13.longDMmin){
_13.longDMmin.value="";
}
if(_13.longDMH){
_13.longDMH.value="";
}
if(_13.latDMdeg){
_13.latDMdeg.value="";
}
if(_13.latDMmin){
_13.latDMmin.value="";
}
if(_13.latDMH){
_13.latDMH.value="";
}
}
if(this.showMGRS){
if(_13.mgrs){
_13.mgrs.value="";
}
}
};
this.convertDMS=function(_14,_15){
var _16=new Array();
abscoordinate=Math.abs(_14);
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
_16[0]=coordinatedegrees;
_16[1]=coordinateminutes;
_16[2]=coordinateseconds;
_16[3]=this.getHemi(_14,_15);
return _16;
};
this.convertDM=function(_17,_18){
var _19=new Array();
abscoordinate=Math.abs(_17);
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
_19[0]=coordinatedegrees;
_19[1]=coordinateminutes;
_19[2]=this.getHemi(_17,_18);
return _19;
};
this.getHemi=function(_1a,_1b){
var _1c="";
if(_1b=="LAT"){
if(_1a>=0){
_1c="N";
}else{
_1c="S";
}
}else{
if(_1b=="LON"){
if(_1a>=0){
_1c="E";
}else{
_1c="W";
}
}
}
return _1c;
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
this.getCurrentTimestamp=function(_50){
var _51=this.getParam("timestamp");
return this.timestampList.childNodes[_51].firstChild.nodeValue;
};
this.setOpacity=function(_52,_53){
var _54=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_52+"']");
if(_54){
_54.setAttribute("opacity",_53);
}
this.callListeners("opacity",_52);
};
this.getOpacity=function(_55){
var _56=1;
var _57=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_55+"']");
if(_57){
_56=_57.getAttribute("opacity");
}
return _56;
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
if(OpenLayers.Element.getStyle(_c4,"position")=="absolute"){
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
OpenLayers.Control.PanZoom=OpenLayers.Class(OpenLayers.Control,{slideFactor:50,buttons:null,position:null,initialize:function(){
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
var _274=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
this._addButton("panup","north-mini.png",_274,sz);
px.y=_274.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
this._addButton("panright","east-mini.png",px.add(sz.w,0),sz);
this._addButton("pandown","south-mini.png",_274.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_274.add(0,sz.h*3+5),sz);
this._addButton("zoomworld","zoom-world-mini.png",_274.add(0,sz.h*4+5),sz);
this._addButton("zoomout","zoom-minus-mini.png",_274.add(0,sz.h*5+5),sz);
return this.div;
},_addButton:function(id,img,xy,sz){
var _279=OpenLayers.Util.getImagesLocation()+img;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_PanZoom_"+id,xy,sz,_279,"absolute");
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
OpenLayers.Control.Panel=OpenLayers.Class(OpenLayers.Control,{controls:null,defaultControl:null,initialize:function(_27d){
OpenLayers.Control.prototype.initialize.apply(this,[_27d]);
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
var _283=this.controls[i].panel_div;
if(this.controls[i].active){
_283.className=this.controls[i].displayClass+"ItemActive";
}else{
_283.className=this.controls[i].displayClass+"ItemInactive";
}
this.div.appendChild(_283);
}
}
},activateControl:function(_284){
if(!this.active){
return false;
}
if(_284.type==OpenLayers.Control.TYPE_BUTTON){
_284.trigger();
return;
}
if(_284.type==OpenLayers.Control.TYPE_TOGGLE){
if(_284.active){
_284.deactivate();
}else{
_284.activate();
}
return;
}
for(var i=0;i<this.controls.length;i++){
if(this.controls[i]==_284){
_284.activate();
}else{
if(this.controls[i].type!=OpenLayers.Control.TYPE_TOGGLE){
this.controls[i].deactivate();
}
}
}
this.redraw();
},addControls:function(_286){
if(!(_286 instanceof Array)){
_286=[_286];
}
this.controls=this.controls.concat(_286);
for(var i=0;i<_286.length;i++){
var _288=document.createElement("div");
var _289=document.createTextNode(" ");
_286[i].panel_div=_288;
OpenLayers.Event.observe(_286[i].panel_div,"click",OpenLayers.Function.bind(this.onClick,this,_286[i]));
OpenLayers.Event.observe(_286[i].panel_div,"mousedown",OpenLayers.Function.bindAsEventListener(OpenLayers.Event.stop));
}
if(this.map){
for(var i=0;i<_286.length;i++){
this.map.addControl(_286[i]);
_286[i].deactivate();
}
this.redraw();
}
},onClick:function(ctrl,evt){
OpenLayers.Event.stop(evt?evt:window.event);
this.activateControl(ctrl);
},CLASS_NAME:"OpenLayers.Control.Panel"});
OpenLayers.Control.Permalink=OpenLayers.Class(OpenLayers.Control,{element:null,base:"",initialize:function(_28c,base,_28e){
OpenLayers.Control.prototype.initialize.apply(this,[_28e]);
this.element=OpenLayers.Util.getElement(_28c);
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
var _291=this.map.controls[i];
if(_291.CLASS_NAME=="OpenLayers.Control.ArgParser"){
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
var _292=this.map.getCenter();
if(!_292){
return;
}
var _293=OpenLayers.Util.getParameters(this.base);
_293.zoom=this.map.getZoom();
_293.lat=Math.round(_292.lat*100000)/100000;
_293.lon=Math.round(_292.lon*100000)/100000;
_293.layers="";
for(var i=0;i<this.map.layers.length;i++){
var _295=this.map.layers[i];
if(_295.isBaseLayer){
_293.layers+=(_295==this.map.baseLayer)?"B":"0";
}else{
_293.layers+=(_295.getVisibility())?"T":"F";
}
}
var href=this.base;
if(href.indexOf("?")!=-1){
href=href.substring(0,href.indexOf("?"));
}
href+="?"+OpenLayers.Util.getParameterString(_293);
this.element.href=href;
},CLASS_NAME:"OpenLayers.Control.Permalink"});
OpenLayers.Control.Scale=OpenLayers.Class(OpenLayers.Control,{element:null,initialize:function(_297,_298){
OpenLayers.Control.prototype.initialize.apply(this,[_298]);
this.element=OpenLayers.Util.getElement(_297);
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
var _299=this.map.getScale();
if(!_299){
return;
}
if(_299>=9500&&_299<=950000){
_299=Math.round(_299/1000)+"K";
}else{
if(_299>=950000){
_299=Math.round(_299/1000000)+"M";
}else{
_299=Math.round(_299);
}
}
this.element.innerHTML="Scale = 1 : "+_299;
},CLASS_NAME:"OpenLayers.Control.Scale"});
OpenLayers.Control.ZoomToMaxExtent=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
if(this.map){
this.map.zoomToMaxExtent();
}
},CLASS_NAME:"OpenLayers.Control.ZoomToMaxExtent"});
OpenLayers.Event={observers:false,KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,element:function(_29a){
return _29a.target||_29a.srcElement;
},isLeftClick:function(_29b){
return (((_29b.which)&&(_29b.which==1))||((_29b.button)&&(_29b.button==1)));
},stop:function(_29c,_29d){
if(!_29d){
if(_29c.preventDefault){
_29c.preventDefault();
}else{
_29c.returnValue=false;
}
}
if(_29c.stopPropagation){
_29c.stopPropagation();
}else{
_29c.cancelBubble=true;
}
},findElement:function(_29e,_29f){
var _2a0=OpenLayers.Event.element(_29e);
while(_2a0.parentNode&&(!_2a0.tagName||(_2a0.tagName.toUpperCase()!=_29f.toUpperCase()))){
_2a0=_2a0.parentNode;
}
return _2a0;
},observe:function(_2a1,name,_2a3,_2a4){
var _2a5=OpenLayers.Util.getElement(_2a1);
_2a4=_2a4||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_2a5.attachEvent)){
name="keydown";
}
if(!this.observers){
this.observers={};
}
if(!_2a5._eventCacheID){
var _2a6="eventCacheID_";
if(_2a5.id){
_2a6=_2a5.id+"_"+_2a6;
}
_2a5._eventCacheID=OpenLayers.Util.createUniqueID(_2a6);
}
var _2a7=_2a5._eventCacheID;
if(!this.observers[_2a7]){
this.observers[_2a7]=[];
}
this.observers[_2a7].push({"element":_2a5,"name":name,"observer":_2a3,"useCapture":_2a4});
if(_2a5.addEventListener){
_2a5.addEventListener(name,_2a3,_2a4);
}else{
if(_2a5.attachEvent){
_2a5.attachEvent("on"+name,_2a3);
}
}
},stopObservingElement:function(_2a8){
var _2a9=OpenLayers.Util.getElement(_2a8);
var _2aa=_2a9._eventCacheID;
this._removeElementObservers(OpenLayers.Event.observers[_2aa]);
},_removeElementObservers:function(_2ab){
if(_2ab){
for(var i=_2ab.length-1;i>=0;i--){
var _2ad=_2ab[i];
var args=new Array(_2ad.element,_2ad.name,_2ad.observer,_2ad.useCapture);
var _2af=OpenLayers.Event.stopObserving.apply(this,args);
}
}
},stopObserving:function(_2b0,name,_2b2,_2b3){
_2b3=_2b3||false;
var _2b4=OpenLayers.Util.getElement(_2b0);
var _2b5=_2b4._eventCacheID;
if(name=="keypress"){
if(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_2b4.detachEvent){
name="keydown";
}
}
var _2b6=false;
var _2b7=OpenLayers.Event.observers[_2b5];
if(_2b7){
var i=0;
while(!_2b6&&i<_2b7.length){
var _2b9=_2b7[i];
if((_2b9.name==name)&&(_2b9.observer==_2b2)&&(_2b9.useCapture==_2b3)){
_2b7.splice(i,1);
if(_2b7.length==0){
delete OpenLayers.Event.observers[_2b5];
}
_2b6=true;
break;
}
i++;
}
}
if(_2b4.removeEventListener){
_2b4.removeEventListener(name,_2b2,_2b3);
}else{
if(_2b4&&_2b4.detachEvent){
_2b4.detachEvent("on"+name,_2b2);
}
}
return _2b6;
},unloadCache:function(){
if(OpenLayers.Event.observers){
for(var _2ba in OpenLayers.Event.observers){
var _2bb=OpenLayers.Event.observers[_2ba];
OpenLayers.Event._removeElementObservers.apply(this,[_2bb]);
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
OpenLayers.Events=OpenLayers.Class({BROWSER_EVENTS:["mouseover","mouseout","mousedown","mouseup","mousemove","click","dblclick","resize","focus","blur"],listeners:null,object:null,element:null,eventTypes:null,eventHandler:null,fallThrough:null,initialize:function(_2bc,_2bd,_2be,_2bf){
this.object=_2bc;
this.element=_2bd;
this.eventTypes=_2be;
this.fallThrough=_2bf;
this.listeners={};
this.eventHandler=OpenLayers.Function.bindAsEventListener(this.handleBrowserEvent,this);
if(this.eventTypes!=null){
for(var i=0;i<this.eventTypes.length;i++){
this.addEventType(this.eventTypes[i]);
}
}
if(this.element!=null){
this.attachToElement(_2bd);
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
},addEventType:function(_2c1){
if(!this.listeners[_2c1]){
this.listeners[_2c1]=[];
}
},attachToElement:function(_2c2){
for(var i=0;i<this.BROWSER_EVENTS.length;i++){
var _2c4=this.BROWSER_EVENTS[i];
this.addEventType(_2c4);
OpenLayers.Event.observe(_2c2,_2c4,this.eventHandler);
}
OpenLayers.Event.observe(_2c2,"dragstart",OpenLayers.Event.stop);
},register:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _2c8=this.listeners[type];
if(_2c8!=null){
_2c8.push({obj:obj,func:func});
}
}
},registerPriority:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _2cc=this.listeners[type];
if(_2cc!=null){
_2cc.unshift({obj:obj,func:func});
}
}
},unregister:function(type,obj,func){
if(obj==null){
obj=this.object;
}
var _2d0=this.listeners[type];
if(_2d0!=null){
for(var i=0;i<_2d0.length;i++){
if(_2d0[i].obj==obj&&_2d0[i].func==func){
_2d0.splice(i,1);
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
var _2d5=(this.listeners[type])?this.listeners[type].slice():null;
if((_2d5!=null)&&(_2d5.length>0)){
for(var i=0;i<_2d5.length;i++){
var _2d7=_2d5[i];
var _2d8;
if(_2d7.obj!=null){
_2d8=_2d7.func.call(_2d7.obj,evt);
}else{
_2d8=_2d7.func(evt);
}
if((_2d8!=null)&&(_2d8==false)){
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
OpenLayers.Format=OpenLayers.Class({initialize:function(_2db){
OpenLayers.Util.extend(this,_2db);
},read:function(data){
alert("Read not implemented.");
},write:function(_2dd){
alert("Write not implemented.");
},CLASS_NAME:"OpenLayers.Format"});
OpenLayers.Popup.Anchored=OpenLayers.Class(OpenLayers.Popup,{relativePosition:null,anchor:null,initialize:function(id,_2df,size,_2e1,_2e2,_2e3){
var _2e4=new Array(id,_2df,size,_2e1,_2e3);
OpenLayers.Popup.prototype.initialize.apply(this,_2e4);
this.anchor=(_2e2!=null)?_2e2:{size:new OpenLayers.Size(0,0),offset:new OpenLayers.Pixel(0,0)};
},draw:function(px){
if(px==null){
if((this.lonlat!=null)&&(this.map!=null)){
px=this.map.getLayerPxFromLonLat(this.lonlat);
}
}
this.relativePosition=this.calculateRelativePosition(px);
return OpenLayers.Popup.prototype.draw.apply(this,arguments);
},calculateRelativePosition:function(px){
var _2e7=this.map.getLonLatFromLayerPx(px);
var _2e8=this.map.getExtent();
var _2e9=_2e8.determineQuadrant(_2e7);
return OpenLayers.Bounds.oppositeQuadrant(_2e9);
},moveTo:function(px){
this.relativePosition=this.calculateRelativePosition(px);
var _2eb=this.calculateNewPx(px);
var _2ec=new Array(_2eb);
OpenLayers.Popup.prototype.moveTo.apply(this,_2ec);
},setSize:function(size){
OpenLayers.Popup.prototype.setSize.apply(this,arguments);
if((this.lonlat)&&(this.map)){
var px=this.map.getLayerPxFromLonLat(this.lonlat);
this.moveTo(px);
}
},calculateNewPx:function(px){
var _2f0=px.offset(this.anchor.offset);
var top=(this.relativePosition.charAt(0)=="t");
_2f0.y+=(top)?-this.size.h:this.anchor.size.h;
var left=(this.relativePosition.charAt(1)=="l");
_2f0.x+=(left)?-this.size.w:this.anchor.size.w;
return _2f0;
},CLASS_NAME:"OpenLayers.Popup.Anchored"});
OpenLayers.Renderer.Elements=OpenLayers.Class(OpenLayers.Renderer,{rendererRoot:null,root:null,xmlns:null,initialize:function(_2f3){
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
},getNodeType:function(_2f4){
},drawGeometry:function(_2f5,_2f6,_2f7){
var _2f8=_2f5.CLASS_NAME;
if((_2f8=="OpenLayers.Geometry.Collection")||(_2f8=="OpenLayers.Geometry.MultiPoint")||(_2f8=="OpenLayers.Geometry.MultiLineString")||(_2f8=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_2f5.components.length;i++){
this.drawGeometry(_2f5.components[i],_2f6,_2f7);
}
return;
}
var _2fa=this.getNodeType(_2f5);
var node=this.nodeFactory(_2f5.id,_2fa,_2f5);
node._featureId=_2f7;
node._geometryClass=_2f5.CLASS_NAME;
node._style=_2f6;
this.root.appendChild(node);
this.drawGeometryNode(node,_2f5);
},drawGeometryNode:function(node,_2fd,_2fe){
_2fe=_2fe||node._style;
var _2ff={"isFilled":true,"isStroked":true};
switch(_2fd.CLASS_NAME){
case "OpenLayers.Geometry.Point":
this.drawPoint(node,_2fd);
break;
case "OpenLayers.Geometry.LineString":
_2ff.isFilled=false;
this.drawLineString(node,_2fd);
break;
case "OpenLayers.Geometry.LinearRing":
this.drawLinearRing(node,_2fd);
break;
case "OpenLayers.Geometry.Polygon":
this.drawPolygon(node,_2fd);
break;
case "OpenLayers.Geometry.Surface":
this.drawSurface(node,_2fd);
break;
case "OpenLayers.Geometry.Rectangle":
this.drawRectangle(node,_2fd);
break;
default:
break;
}
node._style=_2fe;
node._options=_2ff;
this.setStyle(node,_2fe,_2ff,_2fd);
},drawPoint:function(node,_301){
},drawLineString:function(node,_303){
},drawLinearRing:function(node,_305){
},drawPolygon:function(node,_307){
},drawRectangle:function(node,_309){
},drawCircle:function(node,_30b){
},drawCurve:function(node,_30d){
},drawSurface:function(node,_30f){
},getFeatureIdFromEvent:function(evt){
var node=evt.target||evt.srcElement;
return node._featureId;
},eraseGeometry:function(_312){
if((_312.CLASS_NAME=="OpenLayers.Geometry.MultiPoint")||(_312.CLASS_NAME=="OpenLayers.Geometry.MultiLineString")||(_312.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_312.components.length;i++){
this.eraseGeometry(_312.components[i]);
}
}else{
var _314=OpenLayers.Util.getElement(_312.id);
if(_314&&_314.parentNode){
if(_314.geometry){
_314.geometry.destroy();
_314.geometry=null;
}
_314.parentNode.removeChild(_314);
}
}
},nodeFactory:function(id,type,_317){
var node=OpenLayers.Util.getElement(id);
if(node){
if(!this.nodeTypeCompare(node,type)){
node.parentNode.removeChild(node);
node=this.nodeFactory(id,type,_317);
}
}else{
node=this.createNode(type,id);
}
return node;
},CLASS_NAME:"OpenLayers.Renderer.Elements"});
OpenLayers.Tile=OpenLayers.Class({EVENT_TYPES:["loadstart","loadend","reload"],events:null,id:null,layer:null,url:null,bounds:null,size:null,position:null,drawn:false,isLoading:false,initialize:function(_319,_31a,_31b,url,size){
this.layer=_319;
this.position=_31a;
this.bounds=_31b;
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
var _31e=this.layer.maxExtent;
var _31f=(_31e&&this.bounds.intersectsBounds(_31e,false));
var _320=this.layer.map.getExtent();
var _321=(_320&&this.bounds.intersectsBounds(_320,false));
return ((_31f||this.layer.displayOutsideMaxExtent)&&(_321||(this.layer.buffer!=0)));
},moveTo:function(_322,_323,_324){
if(_324==null){
_324=true;
}
this.clear();
this.bounds=_322.clone();
this.position=_323.clone();
if(_324){
this.draw();
}
},clear:function(){
this.drawn=false;
},getBoundsFromBaseLayer:function(_325){
OpenLayers.Console.warn("You are using the 'reproject' option "+"on the "+this.layer.name+" layer. This option is deprecated: "+"its use was designed to support displaying data over commercial "+"basemaps, but that functionality should now be achieved by using "+"Spherical Mercator support. More information is available from "+"http://trac.openlayers.org/wiki/SphericalMercator.");
var _326=this.layer.map.getLonLatFromLayerPx(_325);
var _327=_325.clone();
_327.x+=this.size.w;
_327.y+=this.size.h;
var _328=this.layer.map.getLonLatFromLayerPx(_327);
if(_326.lon>_328.lon){
if(_326.lon<0){
_326.lon=-180-(_326.lon+180);
}else{
_328.lon=180+_328.lon+180;
}
}
bounds=new OpenLayers.Bounds(_326.lon,_328.lat,_328.lon,_326.lat);
return bounds;
},CLASS_NAME:"OpenLayers.Tile"});
OpenLayers.Control.MouseToolbar=OpenLayers.Class(OpenLayers.Control.MouseDefaults,{mode:null,buttons:null,direction:"vertical",buttonClicked:null,initialize:function(_329,_32a){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.position=new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,OpenLayers.Control.MouseToolbar.Y);
if(_329){
this.position=_329;
}
if(_32a){
this.direction=_32a;
}
this.measureDivs=[];
},destroy:function(){
for(var _32b in this.buttons){
var btn=this.buttons[_32b];
btn.map=null;
btn.events.destroy();
}
OpenLayers.Control.MouseDefaults.prototype.destroy.apply(this,arguments);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
OpenLayers.Control.MouseDefaults.prototype.draw.apply(this,arguments);
this.buttons={};
var sz=new OpenLayers.Size(28,28);
var _32e=new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,0);
this._addButton("zoombox","drag-rectangle-off.png","drag-rectangle-on.png",_32e,sz,"Shift->Drag to zoom to area");
_32e=_32e.add((this.direction=="vertical"?0:sz.w),(this.direction=="vertical"?sz.h:0));
this._addButton("pan","panning-hand-off.png","panning-hand-on.png",_32e,sz,"Drag the map to pan.");
_32e=_32e.add((this.direction=="vertical"?0:sz.w),(this.direction=="vertical"?sz.h:0));
this.switchModeTo("pan");
return this.div;
},_addButton:function(id,img,_331,xy,sz,_334){
var _335=OpenLayers.Util.getImagesLocation()+img;
var _336=OpenLayers.Util.getImagesLocation()+_331;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MouseToolbar_"+id,xy,sz,_335,"absolute");
this.div.appendChild(btn);
btn.imgLocation=_335;
btn.activeImgLocation=_336;
btn.events=new OpenLayers.Events(this,btn,null,true);
btn.events.register("mousedown",this,this.buttonDown);
btn.events.register("mouseup",this,this.buttonUp);
btn.events.register("dblclick",this,OpenLayers.Event.stop);
btn.action=id;
btn.title=_334;
btn.alt=_334;
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
var _33b=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_33b,this.map.zoom+1);
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
var _33d="";
if(this.measureStart){
measureEnd=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
_33d=OpenLayers.Util.distVincenty(this.measureStart,measureEnd);
_33d=Math.round(_33d*100)/100;
_33d=_33d+"km";
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
if(_33d){
this.measureBoxDistance=OpenLayers.Util.createDiv(null,this.mouseDragStart.add(-2-parseInt(this.map.layerContainerDiv.style.left),2-parseInt(this.map.layerContainerDiv.style.top)),null,null,"absolute");
this.measureBoxDistance.innerHTML=_33d;
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
var _341=Math.abs(this.mouseDragStart.x-evt.xy.x);
var _342=Math.abs(this.mouseDragStart.y-evt.xy.y);
this.zoomBox.style.width=Math.max(1,_341)+"px";
this.zoomBox.style.height=Math.max(1,_342)+"px";
if(evt.xy.x<this.mouseDragStart.x){
this.zoomBox.style.left=evt.xy.x+"px";
}
if(evt.xy.y<this.mouseDragStart.y){
this.zoomBox.style.top=evt.xy.y+"px";
}
break;
default:
var _341=this.mouseDragStart.x-evt.xy.x;
var _342=this.mouseDragStart.y-evt.xy.y;
var size=this.map.getSize();
var _344=new OpenLayers.Pixel(size.w/2+_341,size.h/2+_342);
var _345=this.map.getLonLatFromViewPortPx(_344);
this.map.setCenter(_345,null,true);
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
OpenLayers.Control.OverviewMap=OpenLayers.Class(OpenLayers.Control,{id:"OverviewMap",element:null,ovmap:null,size:new OpenLayers.Size(180,90),layers:null,minRatio:8,maxRatio:32,mapOptions:null,initialize:function(_349){
this.layers=[];
OpenLayers.Control.prototype.initialize.apply(this,[_349]);
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
var _34a=this.map.baseLayer.clone();
this.layers=[_34a];
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
var _34f=OpenLayers.Util.getImagesLocation();
var img=_34f+"layer-switcher-maximize.png";
this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv(this.displayClass+"MaximizeButton",null,new OpenLayers.Size(18,18),img,"absolute");
this.maximizeDiv.style.display="none";
this.maximizeDiv.className=this.displayClass+"MaximizeButton";
OpenLayers.Event.observe(this.maximizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.maximizeControl,this));
this.div.appendChild(this.maximizeDiv);
var img=_34f+"layer-switcher-minimize.png";
this.minimizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_minimizeDiv",null,new OpenLayers.Size(18,18),img,"absolute");
this.minimizeDiv.style.display="none";
this.minimizeDiv.className=this.displayClass+"MinimizeButton";
OpenLayers.Event.observe(this.minimizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.minimizeControl,this));
this.div.appendChild(this.minimizeDiv);
var _351=["dblclick","mousedown"];
for(var i=0;i<_351.length;i++){
OpenLayers.Event.observe(this.maximizeDiv,_351[i],OpenLayers.Event.stop);
OpenLayers.Event.observe(this.minimizeDiv,_351[i],OpenLayers.Event.stop);
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
var _354=this.getRectPxBounds();
if((_354.top<=0)||(_354.left<=0)||(_354.bottom>=this.size.h-this.hComp)||(_354.right>=this.size.w-this.wComp)){
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
var _357=this.rectDragStart.x-evt.xy.x;
var _358=this.rectDragStart.y-evt.xy.y;
var _359=this.getRectPxBounds();
var _35a=_359.top;
var _35b=_359.left;
var _35c=Math.abs(_359.getHeight());
var _35d=_359.getWidth();
var _35e=Math.max(0,(_35a-_358));
_35e=Math.min(_35e,this.ovmap.size.h-this.hComp-_35c);
var _35f=Math.max(0,(_35b-_357));
_35f=Math.min(_35f,this.ovmap.size.w-this.wComp-_35d);
this.setRectPxBounds(new OpenLayers.Bounds(_35f,_35e+_35c,_35f+_35d,_35e));
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
var _363=this.getRectPxBounds();
var _364=_363.getCenterPixel();
var _365=evt.xy.x-_364.x;
var _366=evt.xy.y-_364.y;
var top=_363.top;
var left=_363.left;
var _369=Math.abs(_363.getHeight());
var _36a=_363.getWidth();
var _36b=Math.max(0,(top+_366));
_36b=Math.min(_36b,this.ovmap.size.h-_369);
var _36c=Math.max(0,(left+_365));
_36c=Math.min(_36c,this.ovmap.size.w-_36a);
this.setRectPxBounds(new OpenLayers.Bounds(_36c,_36b+_369,_36c+_36a,_36b));
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
},showToggle:function(_36f){
this.maximizeDiv.style.display=_36f?"":"none";
this.minimizeDiv.style.display=_36f?"none":"";
},update:function(){
if(this.ovmap==null){
this.createMap();
}
if(!this.isSuitableOverview()){
this.updateOverview();
}
this.updateRectToMap();
},isSuitableOverview:function(){
var _370=this.map.getExtent();
var _371=this.map.maxExtent;
var _372=new OpenLayers.Bounds(Math.max(_370.left,_371.left),Math.max(_370.bottom,_371.bottom),Math.min(_370.right,_371.right),Math.min(_370.top,_371.top));
var _373=this.ovmap.getResolution()/this.map.getResolution();
return ((_373>this.minRatio)&&(_373<=this.maxRatio)&&(this.ovmap.getExtent().containsBounds(_372)));
},updateOverview:function(){
var _374=this.map.getResolution();
var _375=this.ovmap.getResolution();
var _376=_375/_374;
if(_376>this.maxRatio){
_375=this.minRatio*_374;
}else{
if(_376<=this.minRatio){
_375=this.maxRatio*_374;
}
}
this.ovmap.setCenter(this.map.center,this.ovmap.getZoomForResolution(_375));
this.updateRectToMap();
},createMap:function(){
var _377=OpenLayers.Util.extend({controls:[],maxResolution:"auto"},this.mapOptions);
this.ovmap=new OpenLayers.Map(this.mapDiv,_377);
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
var _378=this.getRectBoundsFromMapBounds(this.map.getExtent());
if(_378){
this.setRectPxBounds(_378);
}
},updateMapToRect:function(){
var _379=this.getRectPxBounds();
var _37a=this.getMapBoundsFromRectBounds(_379);
this.map.setCenter(_37a.getCenterLonLat(),this.map.zoom);
},getRectPxBounds:function(){
var top=parseInt(this.extentRectangle.style.top);
var left=parseInt(this.extentRectangle.style.left);
var _37d=parseInt(this.extentRectangle.style.height);
var _37e=parseInt(this.extentRectangle.style.width);
return new OpenLayers.Bounds(left,top+_37d,left+_37e,top);
},setRectPxBounds:function(_37f){
var top=Math.max(_37f.top,0);
var left=Math.max(_37f.left,0);
var _382=Math.min(_37f.top+Math.abs(_37f.getHeight()),this.ovmap.size.h-this.hComp);
var _383=Math.min(_37f.left+_37f.getWidth(),this.ovmap.size.w-this.wComp);
this.extentRectangle.style.top=parseInt(top)+"px";
this.extentRectangle.style.left=parseInt(left)+"px";
this.extentRectangle.style.height=parseInt(Math.max(_382-top,0))+"px";
this.extentRectangle.style.width=parseInt(Math.max(_383-left,0))+"px";
},getRectBoundsFromMapBounds:function(_384){
var _385=new OpenLayers.LonLat(_384.left,_384.bottom);
var _386=new OpenLayers.LonLat(_384.right,_384.top);
var _387=this.getOverviewPxFromLonLat(_385);
var _388=this.getOverviewPxFromLonLat(_386);
var _389=null;
if(_387&&_388){
_389=new OpenLayers.Bounds(_387.x,_387.y,_388.x,_388.y);
}
return _389;
},getMapBoundsFromRectBounds:function(_38a){
var _38b=new OpenLayers.Pixel(_38a.left,_38a.bottom);
var _38c=new OpenLayers.Pixel(_38a.right,_38a.top);
var _38d=this.getLonLatFromOverviewPx(_38b);
var _38e=this.getLonLatFromOverviewPx(_38c);
return new OpenLayers.Bounds(_38d.lon,_38d.lat,_38e.lon,_38e.lat);
},getLonLatFromOverviewPx:function(_38f){
var size=this.ovmap.size;
var res=this.ovmap.getResolution();
var _392=this.ovmap.getExtent().getCenterLonLat();
var _393=_38f.x-(size.w/2);
var _394=_38f.y-(size.h/2);
return new OpenLayers.LonLat(_392.lon+_393*res,_392.lat-_394*res);
},getOverviewPxFromLonLat:function(_395){
var res=this.ovmap.getResolution();
var _397=this.ovmap.getExtent();
var px=null;
if(_397){
px=new OpenLayers.Pixel(Math.round(1/res*(_395.lon-_397.left)),Math.round(1/res*(_397.top-_395.lat)));
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
var _39c=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
this._addButton("panup","north-mini.png",_39c,sz);
px.y=_39c.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
this._addButton("panright","east-mini.png",px.add(sz.w,0),sz);
this._addButton("pandown","south-mini.png",_39c.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_39c.add(0,sz.h*3+5),sz);
_39c=this._addZoomBar(_39c.add(0,sz.h*4+5));
this._addButton("zoomout","zoom-minus-mini.png",_39c,sz);
return this.div;
},_addZoomBar:function(_39d){
var _39e=OpenLayers.Util.getImagesLocation();
var id="OpenLayers_Control_PanZoomBar_Slider"+this.map.id;
var _3a0=this.map.getNumZoomLevels()-1-this.map.getZoom();
var _3a1=OpenLayers.Util.createAlphaImageDiv(id,_39d.add(-1,_3a0*this.zoomStopHeight),new OpenLayers.Size(20,9),_39e+"slider.png","absolute");
this.slider=_3a1;
this.sliderEvents=new OpenLayers.Events(this,_3a1,null,true);
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
div=OpenLayers.Util.createAlphaImageDiv(id,_39d,new OpenLayers.Size(sz.w,this.zoomStopHeight),_39e+"zoombar.png","absolute",null,"crop");
div.style.height=sz.h;
}else{
div=OpenLayers.Util.createDiv("OpenLayers_Control_PanZoomBar_Zoombar"+this.map.id,_39d,sz,_39e+"zoombar.png");
}
this.zoombarDiv=div;
this.divEvents=new OpenLayers.Events(this,div,null,true);
this.divEvents.register("mousedown",this,this.divClick);
this.divEvents.register("mousemove",this,this.passEventToSlider);
this.divEvents.register("dblclick",this,this.doubleClick);
this.divEvents.register("click",this,this.doubleClick);
this.div.appendChild(div);
this.startTop=parseInt(div.style.top);
this.div.appendChild(_3a1);
this.map.events.register("zoomend",this,this.moveZoomBar);
_39d=_39d.add(0,this.zoomStopHeight*this.map.getNumZoomLevels());
return _39d;
},passEventToSlider:function(evt){
this.sliderEvents.handleBrowserEvent(evt);
},divClick:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
var y=evt.xy.y;
var top=OpenLayers.Util.pagePosition(evt.object)[1];
var _3a7=Math.floor((y-top)/this.zoomStopHeight);
this.map.zoomTo((this.map.getNumZoomLevels()-1)-_3a7);
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
var _3aa=this.mouseDragStart.y-evt.xy.y;
var _3ab=OpenLayers.Util.pagePosition(this.zoombarDiv);
if((evt.clientY-_3ab[1])>0&&(evt.clientY-_3ab[1])<parseInt(this.zoombarDiv.style.height)-2){
var _3ac=parseInt(this.slider.style.top)-_3aa;
this.slider.style.top=_3ac+"px";
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
var _3ae=this.zoomStart.y-evt.xy.y;
this.map.zoomTo(this.map.zoom+Math.round(_3ae/this.zoomStopHeight));
this.moveZoomBar();
this.mouseDragStart=null;
OpenLayers.Event.stop(evt);
}
},moveZoomBar:function(){
var _3af=((this.map.getNumZoomLevels()-1)-this.map.getZoom())*this.zoomStopHeight+this.startTop+1;
this.slider.style.top=_3af+"px";
},CLASS_NAME:"OpenLayers.Control.PanZoomBar"});
OpenLayers.Format.JSON=OpenLayers.Class(OpenLayers.Format,{indent:"    ",space:" ",newline:"\n",level:0,pretty:false,initialize:function(_3b0){
OpenLayers.Format.prototype.initialize.apply(this,[_3b0]);
},read:function(json,_3b2){
try{
if(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(json)){
var _3b3=eval("("+json+")");
if(typeof _3b2==="function"){
function walk(k,v){
if(v&&typeof v==="object"){
for(var i in v){
if(v.hasOwnProperty(i)){
v[i]=walk(i,v[i]);
}
}
}
return _3b2(k,v);
}
_3b3=walk("",_3b3);
}
return _3b3;
}
}
catch(e){
}
return null;
},write:function(_3b7,_3b8){
this.pretty=!!_3b8;
var json=null;
var type=typeof _3b7;
if(this.serialize[type]){
json=this.serialize[type].apply(this,[_3b7]);
}
return json;
},writeIndent:function(){
var _3bb=[];
if(this.pretty){
for(var i=0;i<this.level;++i){
_3bb.push(this.indent);
}
}
return _3bb.join("");
},writeNewline:function(){
return (this.pretty)?this.newline:"";
},writeSpace:function(){
return (this.pretty)?this.space:"";
},serialize:{"object":function(_3bd){
if(_3bd==null){
return "null";
}
if(_3bd.constructor==Date){
return this.serialize.date.apply(this,[_3bd]);
}
if(_3bd.constructor==Array){
return this.serialize.array.apply(this,[_3bd]);
}
var _3be=["{"];
this.level+=1;
var key,keyJSON,valueJSON;
var _3c0=false;
for(key in _3bd){
if(_3bd.hasOwnProperty(key)){
keyJSON=OpenLayers.Format.JSON.prototype.write.apply(this,[key,this.pretty]);
valueJSON=OpenLayers.Format.JSON.prototype.write.apply(this,[_3bd[key],this.pretty]);
if(keyJSON!=null&&valueJSON!=null){
if(_3c0){
_3be.push(",");
}
_3be.push(this.writeNewline(),this.writeIndent(),keyJSON,":",this.writeSpace(),valueJSON);
_3c0=true;
}
}
}
this.level-=1;
_3be.push(this.writeNewline(),this.writeIndent(),"}");
return _3be.join("");
},"array":function(_3c1){
var json;
var _3c3=["["];
this.level+=1;
for(var i=0;i<_3c1.length;++i){
json=OpenLayers.Format.JSON.prototype.write.apply(this,[_3c1[i],this.pretty]);
if(json!=null){
if(i>0){
_3c3.push(",");
}
_3c3.push(this.writeNewline(),this.writeIndent(),json);
}
}
this.level-=1;
_3c3.push(this.writeNewline(),this.writeIndent(),"]");
return _3c3.join("");
},"string":function(_3c5){
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
if(/["\\\x00-\x1f]/.test(_3c5)){
return "\""+_3c5.replace(/([\x00-\x1f\\"])/g,function(a,b){
var c=m[b];
if(c){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
})+"\"";
}
return "\""+_3c5+"\"";
},"number":function(_3ca){
return isFinite(_3ca)?String(_3ca):"null";
},"boolean":function(bool){
return String(bool);
},"date":function(date){
function format(_3cd){
return (_3cd<10)?"0"+_3cd:_3cd;
}
return "\""+date.getFullYear()+"-"+format(date.getMonth()+1)+"-"+format(date.getDate())+"T"+format(date.getHours())+":"+format(date.getMinutes())+":"+format(date.getSeconds())+"\"";
}},CLASS_NAME:"OpenLayers.Format.JSON"});
OpenLayers.Format.WKT=OpenLayers.Class(OpenLayers.Format,{initialize:function(_3ce){
this.regExes={"typeStr":/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,"spaces":/\s+/,"parenComma":/\)\s*,\s*\(/,"doubleParenComma":/\)\s*\)\s*,\s*\(\s*\(/,"trimParens":/^\s*\(?(.*?)\)?\s*$/};
OpenLayers.Format.prototype.initialize.apply(this,[_3ce]);
},read:function(wkt){
var _3d0,type,str;
var _3d1=this.regExes.typeStr.exec(wkt);
if(_3d1){
type=_3d1[1].toLowerCase();
str=_3d1[2];
if(this.parse[type]){
_3d0=this.parse[type].apply(this,[str]);
}
}
return _3d0;
},write:function(_3d2){
var _3d3,geometry,type,data,isCollection;
if(_3d2.constructor==Array){
_3d3=_3d2;
isCollection=true;
}else{
_3d3=[_3d2];
isCollection=false;
}
var _3d4=[];
if(isCollection){
_3d4.push("GEOMETRYCOLLECTION(");
}
for(var i=0;i<_3d3.length;++i){
if(isCollection&&i>0){
_3d4.push(",");
}
geometry=_3d3[i].geometry;
type=geometry.CLASS_NAME.split(".")[2].toLowerCase();
if(!this.extract[type]){
return null;
}
data=this.extract[type].apply(this,[geometry]);
_3d4.push(type.toUpperCase()+"("+data+")");
}
if(isCollection){
_3d4.push(")");
}
return _3d4.join("");
},extract:{"point":function(_3d6){
return _3d6.x+" "+_3d6.y;
},"multipoint":function(_3d7){
var _3d8=[];
for(var i=0;i<_3d7.components.length;++i){
_3d8.push(this.extract.point.apply(this,[_3d7.components[i]]));
}
return _3d8.join(",");
},"linestring":function(_3da){
var _3db=[];
for(var i=0;i<_3da.components.length;++i){
_3db.push(this.extract.point.apply(this,[_3da.components[i]]));
}
return _3db.join(",");
},"multilinestring":function(_3dd){
var _3de=[];
for(var i=0;i<_3dd.components.length;++i){
_3de.push("("+this.extract.linestring.apply(this,[_3dd.components[i]])+")");
}
return _3de.join(",");
},"polygon":function(_3e0){
var _3e1=[];
for(var i=0;i<_3e0.components.length;++i){
_3e1.push("("+this.extract.linestring.apply(this,[_3e0.components[i]])+")");
}
return _3e1.join(",");
},"multipolygon":function(_3e3){
var _3e4=[];
for(var i=0;i<_3e3.components.length;++i){
_3e4.push("("+this.extract.polygon.apply(this,[_3e3.components[i]])+")");
}
return _3e4.join(",");
}},parse:{"point":function(str){
var _3e7=OpenLayers.String.trim(str).split(this.regExes.spaces);
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_3e7[0],_3e7[1]));
},"multipoint":function(str){
var _3e9=OpenLayers.String.trim(str).split(",");
var _3ea=[];
for(var i=0;i<_3e9.length;++i){
_3ea.push(this.parse.point.apply(this,[_3e9[i]]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPoint(_3ea));
},"linestring":function(str){
var _3ed=OpenLayers.String.trim(str).split(",");
var _3ee=[];
for(var i=0;i<_3ed.length;++i){
_3ee.push(this.parse.point.apply(this,[_3ed[i]]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(_3ee));
},"multilinestring":function(str){
var line;
var _3f2=OpenLayers.String.trim(str).split(this.regExes.parenComma);
var _3f3=[];
for(var i=0;i<_3f2.length;++i){
line=_3f2[i].replace(this.regExes.trimParens,"$1");
_3f3.push(this.parse.linestring.apply(this,[line]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(_3f3));
},"polygon":function(str){
var ring,linestring,linearring;
var _3f7=OpenLayers.String.trim(str).split(this.regExes.parenComma);
var _3f8=[];
for(var i=0;i<_3f7.length;++i){
ring=_3f7[i].replace(this.regExes.trimParens,"$1");
linestring=this.parse.linestring.apply(this,[ring]).geometry;
linearring=new OpenLayers.Geometry.LinearRing(linestring.components);
_3f8.push(linearring);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(_3f8));
},"multipolygon":function(str){
var _3fb;
var _3fc=OpenLayers.String.trim(str).split(this.regExes.doubleParenComma);
var _3fd=[];
for(var i=0;i<_3fc.length;++i){
_3fb=_3fc[i].replace(this.regExes.trimParens,"$1");
_3fd.push(this.parse.polygon.apply(this,[_3fb]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon(_3fd));
},"geometrycollection":function(str){
str=str.replace(/,\s*([A-Za-z])/g,"|$1");
var _400=OpenLayers.String.trim(str).split("|");
var _401=[];
for(var i=0;i<_400.length;++i){
_401.push(OpenLayers.Format.WKT.prototype.read.apply(this,[_400[i]]));
}
return _401;
}},CLASS_NAME:"OpenLayers.Format.WKT"});
OpenLayers.Format.XML=OpenLayers.Class(OpenLayers.Format,{xmldom:null,initialize:function(_403){
if(window.ActiveXObject){
this.xmldom=new ActiveXObject("Microsoft.XMLDOM");
}
OpenLayers.Format.prototype.initialize.apply(this,[_403]);
},read:function(text){
var _405=text.indexOf("<");
if(_405>0){
text=text.substring(_405);
}
var node=OpenLayers.Util.Try(OpenLayers.Function.bind((function(){
var _407;
if(window.ActiveXObject&&!this.xmldom){
_407=new ActiveXObject("Microsoft.XMLDOM");
}else{
_407=this.xmldom;
}
_407.loadXML(text);
return _407;
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
var _40b=new XMLSerializer();
data=_40b.serializeToString(node);
}
return data;
},createElementNS:function(uri,name){
var _40e;
if(this.xmldom){
_40e=this.xmldom.createNode(1,name,uri);
}else{
_40e=document.createElementNS(uri,name);
}
return _40e;
},createTextNode:function(text){
var node;
if(this.xmldom){
node=this.xmldom.createTextNode(text);
}else{
node=document.createTextNode(text);
}
return node;
},getElementsByTagNameNS:function(node,uri,name){
var _414=[];
if(node.getElementsByTagNameNS){
_414=node.getElementsByTagNameNS(uri,name);
}else{
var _415=node.getElementsByTagName("*");
var _416,fullName;
for(var i=0;i<_415.length;++i){
_416=_415[i];
fullName=(_416.prefix)?(_416.prefix+":"+name):name;
if((name=="*")||(fullName==_416.nodeName)){
if((uri=="*")||(uri==_416.namespaceURI)){
_414.push(_416);
}
}
}
}
return _414;
},getAttributeNodeNS:function(node,uri,name){
var _41b=null;
if(node.getAttributeNodeNS){
_41b=node.getAttributeNodeNS(uri,name);
}else{
var _41c=node.attributes;
var _41d,fullName;
for(var i=0;i<_41c.length;++i){
_41d=_41c[i];
if(_41d.namespaceURI==uri){
fullName=(_41d.prefix)?(_41d.prefix+":"+name):name;
if(fullName==_41d.nodeName){
_41b=_41d;
break;
}
}
}
}
return _41b;
},getAttributeNS:function(node,uri,name){
var _422="";
if(node.getAttributeNS){
_422=node.getAttributeNS(uri,name);
}else{
var _423=this.getAttributeNodeNS(node,uri,name);
if(_423){
_422=_423.nodeValue;
}
}
return _422;
},hasAttributeNS:function(node,uri,name){
var _427=false;
if(node.hasAttributeNS){
_427=node.hasAttributeNS(uri,name);
}else{
_427=!!this.getAttributeNodeNS(node,uri,name);
}
return _427;
},CLASS_NAME:"OpenLayers.Format.XML"});
OpenLayers.Handler=OpenLayers.Class({id:null,control:null,map:null,keyMask:null,active:false,evt:null,initialize:function(_428,_429,_42a){
OpenLayers.Util.extend(this,_42a);
this.control=_428;
this.callbacks=_429;
if(_428.map){
this.setMap(_428.map);
}
OpenLayers.Util.extend(this,_42a);
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},setMap:function(map){
this.map=map;
},checkModifiers:function(evt){
if(this.keyMask==null){
return true;
}
var _42d=(evt.shiftKey?OpenLayers.Handler.MOD_SHIFT:0)|(evt.ctrlKey?OpenLayers.Handler.MOD_CTRL:0)|(evt.altKey?OpenLayers.Handler.MOD_ALT:0);
return (_42d==this.keyMask);
},activate:function(){
if(this.active){
return false;
}
var _42e=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_42e.length;i++){
if(this[_42e[i]]){
this.register(_42e[i],this[_42e[i]]);
}
}
this.active=true;
return true;
},deactivate:function(){
if(!this.active){
return false;
}
var _430=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_430.length;i++){
if(this[_430[i]]){
this.unregister(_430[i],this[_430[i]]);
}
}
this.active=false;
return true;
},callback:function(name,args){
if(this.callbacks[name]){
this.callbacks[name].apply(this.control,args);
}
},register:function(name,_435){
this.map.events.registerPriority(name,this,_435);
this.map.events.registerPriority(name,this,this.setEvent);
},unregister:function(name,_437){
this.map.events.unregister(name,this,_437);
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
OpenLayers.Map=OpenLayers.Class({Z_INDEX_BASE:{BaseLayer:100,Overlay:325,Popup:750,Control:1000},EVENT_TYPES:["addlayer","removelayer","changelayer","movestart","move","moveend","zoomend","popupopen","popupclose","addmarker","removemarker","clearmarkers","mouseover","mouseout","mousemove","dragstart","drag","dragend","changebaselayer"],id:null,events:null,div:null,size:null,viewPortDiv:null,layerContainerOrigin:null,layerContainerDiv:null,layers:null,controls:null,popups:null,baseLayer:null,center:null,zoom:0,viewRequestID:0,tileSize:null,projection:"EPSG:4326",units:"degrees",resolutions:null,maxResolution:1.40625,minResolution:null,maxScale:null,minScale:null,maxExtent:null,minExtent:null,restrictedExtent:null,numZoomLevels:16,theme:null,fallThrough:false,initialize:function(div,_43a){
this.setOptions(_43a);
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
var _43c=true;
var _43d=document.getElementsByTagName("link");
for(var i=0;i<_43d.length;++i){
if(OpenLayers.Util.isEquivalentUrl(_43d.item(i).href,this.theme)){
_43c=false;
break;
}
}
if(_43c){
var _43f=document.createElement("link");
_43f.setAttribute("rel","stylesheet");
_43f.setAttribute("type","text/css");
_43f.setAttribute("href",this.theme);
document.getElementsByTagName("head")[0].appendChild(_43f);
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
},setOptions:function(_441){
this.tileSize=new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,OpenLayers.Map.TILE_HEIGHT);
this.maxExtent=new OpenLayers.Bounds(-180,-90,180,90);
this.theme=OpenLayers._getScriptLocation()+"theme/default/style.css";
OpenLayers.Util.extend(this,_441);
},getTileSize:function(){
return this.tileSize;
},getLayer:function(id){
var _443=null;
for(var i=0;i<this.layers.length;i++){
var _445=this.layers[i];
if(_445.id==id){
_443=_445;
}
}
return _443;
},setLayerZIndex:function(_446,zIdx){
_446.setZIndex(this.Z_INDEX_BASE[_446.isBaseLayer?"BaseLayer":"Overlay"]+zIdx*5);
},addLayer:function(_448){
for(var i=0;i<this.layers.length;i++){
if(this.layers[i]==_448){
var msg="You tried to add the layer: "+_448.name+" to the map, but it has already been added";
OpenLayers.Console.warn(msg);
return false;
}
}
_448.div.style.overflow="";
this.setLayerZIndex(_448,this.layers.length);
if(_448.isFixed){
this.viewPortDiv.appendChild(_448.div);
}else{
this.layerContainerDiv.appendChild(_448.div);
}
this.layers.push(_448);
_448.setMap(this);
if(_448.isBaseLayer){
if(this.baseLayer==null){
this.setBaseLayer(_448);
}else{
_448.setVisibility(false);
}
}else{
_448.redraw();
}
this.events.triggerEvent("addlayer");
},addLayers:function(_44b){
for(var i=0;i<_44b.length;i++){
this.addLayer(_44b[i]);
}
},removeLayer:function(_44d,_44e){
if(_44e==null){
_44e=true;
}
if(_44d.isFixed){
this.viewPortDiv.removeChild(_44d.div);
}else{
this.layerContainerDiv.removeChild(_44d.div);
}
OpenLayers.Util.removeItem(this.layers,_44d);
_44d.removeMap(this);
_44d.map=null;
if(_44e&&(this.baseLayer==_44d)){
this.baseLayer=null;
for(i=0;i<this.layers.length;i++){
var _44f=this.layers[i];
if(_44f.isBaseLayer){
this.setBaseLayer(_44f);
break;
}
}
}
this.events.triggerEvent("removelayer");
},getNumLayers:function(){
return this.layers.length;
},getLayerIndex:function(_450){
return OpenLayers.Util.indexOf(this.layers,_450);
},setLayerIndex:function(_451,idx){
var base=this.getLayerIndex(_451);
if(idx<0){
idx=0;
}else{
if(idx>this.layers.length){
idx=this.layers.length;
}
}
if(base!=idx){
this.layers.splice(base,1);
this.layers.splice(idx,0,_451);
for(var i=0;i<this.layers.length;i++){
this.setLayerZIndex(this.layers[i],i);
}
this.events.triggerEvent("changelayer");
}
},raiseLayer:function(_455,_456){
var idx=this.getLayerIndex(_455)+_456;
this.setLayerIndex(_455,idx);
},setBaseLayer:function(_458){
var _459=null;
if(this.baseLayer){
_459=this.baseLayer.getExtent();
}
if(_458!=this.baseLayer){
if(OpenLayers.Util.indexOf(this.layers,_458)!=-1){
if(this.baseLayer!=null){
this.baseLayer.setVisibility(false);
}
this.baseLayer=_458;
this.viewRequestID++;
this.baseLayer.visibility=true;
var _45a=this.getCenter();
if(_45a!=null){
if(_459==null){
this.setCenter(_45a,this.getZoom(),false,true);
}else{
this.setCenter(_459.getCenterLonLat(),this.getZoomForExtent(_459),false,true);
}
}
this.events.triggerEvent("changebaselayer");
}
}
},addControl:function(_45b,px){
this.controls.push(_45b);
this.addControlToMap(_45b,px);
},addControlToMap:function(_45d,px){
_45d.outsideViewport=(_45d.div!=null);
_45d.setMap(this);
var div=_45d.draw(px);
if(div){
if(!_45d.outsideViewport){
div.style.zIndex=this.Z_INDEX_BASE["Control"]+this.controls.length;
this.viewPortDiv.appendChild(div);
}
}
},getControl:function(id){
var _461=null;
for(var i=0;i<this.controls.length;i++){
var _463=this.controls[i];
if(_463.id==id){
_461=_463;
break;
}
}
return _461;
},removeControl:function(_464){
if((_464)&&(_464==this.getControl(_464.id))){
if(!_464.outsideViewport){
this.viewPortDiv.removeChild(_464.div);
}
OpenLayers.Util.removeItem(this.controls,_464);
}
},addPopup:function(_465,_466){
if(_466){
for(var i=0;i<this.popups.length;i++){
this.removePopup(this.popups[i]);
}
}
_465.map=this;
this.popups.push(_465);
var _468=_465.draw();
if(_468){
_468.style.zIndex=this.Z_INDEX_BASE["Popup"]+this.popups.length;
this.layerContainerDiv.appendChild(_468);
}
},removePopup:function(_469){
OpenLayers.Util.removeItem(this.popups,_469);
if(_469.div){
try{
this.layerContainerDiv.removeChild(_469.div);
}
catch(e){
}
}
_469.map=null;
},getSize:function(){
var size=null;
if(this.size!=null){
size=this.size.clone();
}
return size;
},updateSize:function(){
this.events.element.offsets=null;
var _46b=this.getCurrentSize();
var _46c=this.getSize();
if(_46c==null){
this.size=_46c=_46b;
}
if(!_46b.equals(_46c)){
this.size=_46b;
for(var i=0;i<this.layers.length;i++){
this.layers[i].onMapResize();
}
if(this.baseLayer!=null){
var _46e=new OpenLayers.Pixel(_46b.w/2,_46b.h/2);
var _46f=this.getLonLatFromViewPortPx(_46e);
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
},calculateBounds:function(_473,_474){
var _475=null;
if(_473==null){
_473=this.getCenter();
}
if(_474==null){
_474=this.getResolution();
}
if((_473!=null)&&(_474!=null)){
var size=this.getSize();
var _477=size.w*_474;
var _478=size.h*_474;
_475=new OpenLayers.Bounds(_473.lon-_477/2,_473.lat-_478/2,_473.lon+_477/2,_473.lat+_478/2);
}
return _475;
},getCenter:function(){
return this.center;
},getZoom:function(){
return this.zoom;
},pan:function(dx,dy){
var _47b=this.getViewPortPxFromLonLat(this.getCenter());
var _47c=_47b.add(dx,dy);
if(!_47c.equals(_47b)){
var _47d=this.getLonLatFromViewPortPx(_47c);
this.setCenter(_47d);
}
},setCenter:function(_47e,zoom,_480,_481){
if(!this.center&&!this.isValidLonLat(_47e)){
_47e=this.maxExtent.getCenterLonLat();
}
if(this.restrictedExtent!=null){
if(_47e==null){
_47e=this.getCenter();
}
if(zoom==null){
zoom=this.getZoom();
}
var _482=null;
if(this.baseLayer!=null){
_482=this.baseLayer.resolutions[zoom];
}
var _483=this.calculateBounds(_47e,_482);
if(!this.restrictedExtent.containsBounds(_483)){
var _484=this.restrictedExtent.getCenterLonLat();
if(_483.getWidth()>this.restrictedExtent.getWidth()){
_47e=new OpenLayers.LonLat(_484.lon,_47e.lat);
}else{
if(_483.left<this.restrictedExtent.left){
_47e=_47e.add(this.restrictedExtent.left-_483.left,0);
}else{
if(_483.right>this.restrictedExtent.right){
_47e=_47e.add(this.restrictedExtent.right-_483.right,0);
}
}
}
if(_483.getHeight()>this.restrictedExtent.getHeight()){
_47e=new OpenLayers.LonLat(_47e.lon,_484.lat);
}else{
if(_483.bottom<this.restrictedExtent.bottom){
_47e=_47e.add(0,this.restrictedExtent.bottom-_483.bottom);
}else{
if(_483.top>this.restrictedExtent.top){
_47e=_47e.add(0,this.restrictedExtent.top-_483.top);
}
}
}
}
}
var _485=_481||((this.isValidZoomLevel(zoom))&&(zoom!=this.getZoom()));
var _486=(this.isValidLonLat(_47e))&&(!_47e.equals(this.center));
if(_485||_486||!_480){
if(!_480){
this.events.triggerEvent("movestart");
}
if(_486){
if((!_485)&&(this.center)){
this.centerLayerContainer(_47e);
}
this.center=_47e.clone();
}
if((_485)||(this.layerContainerOrigin==null)){
this.layerContainerOrigin=this.center.clone();
this.layerContainerDiv.style.left="0px";
this.layerContainerDiv.style.top="0px";
}
if(_485){
this.zoom=zoom;
this.viewRequestID++;
}
var _487=this.getExtent();
this.baseLayer.moveTo(_487,_485,_480);
_487=this.baseLayer.getExtent();
for(var i=0;i<this.layers.length;i++){
var _489=this.layers[i];
if(!_489.isBaseLayer){
var _48a;
var _48b=_489.calculateInRange();
if(_489.inRange!=_48b){
_489.inRange=_48b;
_48a=true;
this.events.triggerEvent("changelayer");
}else{
_48a=(_489.visibility&&_489.inRange);
}
if(_48a){
_489.moveTo(_487,_485,_480);
}
}
}
if(_485){
for(var i=0;i<this.popups.length;i++){
this.popups[i].updatePosition();
}
}
this.events.triggerEvent("move");
if(_485){
this.events.triggerEvent("zoomend");
}
}
if(!_480){
this.events.triggerEvent("moveend");
}
},centerLayerContainer:function(_48c){
var _48d=this.getViewPortPxFromLonLat(this.layerContainerOrigin);
var _48e=this.getViewPortPxFromLonLat(_48c);
if((_48d!=null)&&(_48e!=null)){
this.layerContainerDiv.style.left=(_48d.x-_48e.x)+"px";
this.layerContainerDiv.style.top=(_48d.y-_48e.y)+"px";
}
},isValidZoomLevel:function(_48f){
return ((_48f!=null)&&(_48f>=0)&&(_48f<this.getNumZoomLevels()));
},isValidLonLat:function(_490){
var _491=false;
if(_490!=null){
var _492=this.getMaxExtent();
_491=_492.containsLonLat(_490);
}
return _491;
},getProjection:function(){
var _493=null;
if(this.baseLayer!=null){
_493=this.baseLayer.projection;
}
return _493;
},getMaxResolution:function(){
var _494=null;
if(this.baseLayer!=null){
_494=this.baseLayer.maxResolution;
}
return _494;
},getMaxExtent:function(){
var _495=null;
if(this.baseLayer!=null){
_495=this.baseLayer.maxExtent;
}
return _495;
},getNumZoomLevels:function(){
var _496=null;
if(this.baseLayer!=null){
_496=this.baseLayer.numZoomLevels;
}
return _496;
},getExtent:function(){
var _497=null;
if(this.baseLayer!=null){
_497=this.baseLayer.getExtent();
}
return _497;
},getResolution:function(){
var _498=null;
if(this.baseLayer!=null){
_498=this.baseLayer.getResolution();
}
return _498;
},getScale:function(){
var _499=null;
if(this.baseLayer!=null){
var res=this.getResolution();
var _49b=this.baseLayer.units;
_499=OpenLayers.Util.getScaleFromResolution(res,_49b);
}
return _499;
},getZoomForExtent:function(_49c){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForExtent(_49c);
}
return zoom;
},getZoomForResolution:function(_49e){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForResolution(_49e);
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
},zoomToExtent:function(_4a1){
var _4a2=_4a1.getCenterLonLat();
if(this.baseLayer.wrapDateLine){
var _4a3=this.getMaxExtent();
_4a1=_4a1.clone();
while(_4a1.right<_4a1.left){
_4a1.right+=_4a3.getWidth();
}
_4a2=_4a1.getCenterLonLat().wrapDateLine(_4a3);
}
this.setCenter(_4a2,this.getZoomForExtent(_4a1));
},zoomToMaxExtent:function(){
this.zoomToExtent(this.getMaxExtent());
},zoomToScale:function(_4a4){
var res=OpenLayers.Util.getResolutionFromScale(_4a4,this.baseLayer.units);
var size=this.getSize();
var _4a7=size.w*res;
var _4a8=size.h*res;
var _4a9=this.getCenter();
var _4aa=new OpenLayers.Bounds(_4a9.lon-_4a7/2,_4a9.lat-_4a8/2,_4a9.lon+_4a7/2,_4a9.lat+_4a8/2);
this.zoomToExtent(_4aa);
},getLonLatFromViewPortPx:function(_4ab){
var _4ac=null;
if(this.baseLayer!=null){
_4ac=this.baseLayer.getLonLatFromViewPortPx(_4ab);
}
return _4ac;
},getViewPortPxFromLonLat:function(_4ad){
var px=null;
if(this.baseLayer!=null){
px=this.baseLayer.getViewPortPxFromLonLat(_4ad);
}
return px;
},getLonLatFromPixel:function(px){
return this.getLonLatFromViewPortPx(px);
},getPixelFromLonLat:function(_4b0){
return this.getViewPortPxFromLonLat(_4b0);
},getViewPortPxFromLayerPx:function(_4b1){
var _4b2=null;
if(_4b1!=null){
var dX=parseInt(this.layerContainerDiv.style.left);
var dY=parseInt(this.layerContainerDiv.style.top);
_4b2=_4b1.add(dX,dY);
}
return _4b2;
},getLayerPxFromViewPortPx:function(_4b5){
var _4b6=null;
if(_4b5!=null){
var dX=-parseInt(this.layerContainerDiv.style.left);
var dY=-parseInt(this.layerContainerDiv.style.top);
_4b6=_4b5.add(dX,dY);
if(isNaN(_4b6.x)||isNaN(_4b6.y)){
_4b6=null;
}
}
return _4b6;
},getLonLatFromLayerPx:function(px){
px=this.getViewPortPxFromLayerPx(px);
return this.getLonLatFromViewPortPx(px);
},getLayerPxFromLonLat:function(_4ba){
var px=this.getViewPortPxFromLonLat(_4ba);
return this.getLayerPxFromViewPortPx(px);
},CLASS_NAME:"OpenLayers.Map"});
OpenLayers.Map.TILE_WIDTH=256;
OpenLayers.Map.TILE_HEIGHT=256;
OpenLayers.Marker=OpenLayers.Class({icon:null,lonlat:null,events:null,map:null,initialize:function(_4bc,icon){
this.lonlat=_4bc;
var _4be=(icon)?icon:OpenLayers.Marker.defaultIcon();
if(this.icon==null){
this.icon=_4be;
}else{
this.icon.url=_4be.url;
this.icon.size=_4be.size;
this.icon.offset=_4be.offset;
this.icon.calculateOffset=_4be.calculateOffset;
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
var _4c1=false;
if(this.map){
var _4c2=this.map.getExtent();
_4c1=_4c2.containsLonLat(this.lonlat);
}
return _4c1;
},inflate:function(_4c3){
if(this.icon){
var _4c4=new OpenLayers.Size(this.icon.size.w*_4c3,this.icon.size.h*_4c3);
this.icon.setSize(_4c4);
}
},setOpacity:function(_4c5){
this.icon.setOpacity(_4c5);
},display:function(_4c6){
this.icon.display(_4c6);
},CLASS_NAME:"OpenLayers.Marker"});
OpenLayers.Marker.defaultIcon=function(){
var url=OpenLayers.Util.getImagesLocation()+"marker.png";
var size=new OpenLayers.Size(21,25);
var _4c9=function(size){
return new OpenLayers.Pixel(-(size.w/2),-size.h);
};
return new OpenLayers.Icon(url,size,null,_4c9);
};
OpenLayers.Popup.AnchoredBubble=OpenLayers.Class(OpenLayers.Popup.Anchored,{rounded:false,initialize:function(id,_4cc,size,_4ce,_4cf,_4d0){
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
var _4d4=this.size.clone();
_4d4.h-=(2*OpenLayers.Popup.AnchoredBubble.CORNER_SIZE);
_4d4.h-=(2*this.padding);
this.contentDiv.style.height=_4d4.h+"px";
this.contentDiv.style.width=_4d4.w+"px";
if(this.map){
this.setRicoCorners(!this.rounded);
this.rounded=true;
}
}
},setBackgroundColor:function(_4d5){
if(_4d5!=undefined){
this.backgroundColor=_4d5;
}
if(this.div!=null){
if(this.contentDiv!=null){
this.div.style.background="transparent";
OpenLayers.Rico.Corner.changeColor(this.contentDiv,this.backgroundColor);
}
}
},setOpacity:function(_4d6){
if(_4d6!=undefined){
this.opacity=_4d6;
}
if(this.div!=null){
if(this.contentDiv!=null){
OpenLayers.Rico.Corner.changeOpacity(this.contentDiv,this.opacity);
}
}
},setBorder:function(_4d7){
this.border=0;
},setRicoCorners:function(_4d8){
var _4d9=this.getCornersToRound(this.relativePosition);
var _4da={corners:_4d9,color:this.backgroundColor,bgColor:"transparent",blend:false};
if(_4d8){
OpenLayers.Rico.Corner.round(this.div,_4da);
}else{
OpenLayers.Rico.Corner.reRound(this.groupDiv,_4da);
this.setBackgroundColor();
this.setOpacity();
}
},getCornersToRound:function(){
var _4db=["tl","tr","bl","br"];
var _4dc=OpenLayers.Bounds.oppositeQuadrant(this.relativePosition);
OpenLayers.Util.removeItem(_4db,_4dc);
return _4db.join(" ");
},CLASS_NAME:"OpenLayers.Popup.AnchoredBubble"});
OpenLayers.Popup.AnchoredBubble.CORNER_SIZE=5;
OpenLayers.Renderer.SVG=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"http://www.w3.org/2000/svg",maxPixel:15000,localResolution:null,initialize:function(_4dd){
if(!this.supported()){
return;
}
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _4de="http://www.w3.org/TR/SVG11/feature#SVG";
var _4df=(document.implementation&&(document.implementation.hasFeature("org.w3c.svg","1.0")||document.implementation.hasFeature(_4de,"1.1")));
return _4df;
},setExtent:function(_4e0){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _4e1=this.getResolution();
if(!this.localResolution||_4e1!=this.localResolution){
this.left=-_4e0.left/_4e1;
this.top=_4e0.top/_4e1;
}
var left=0;
var top=0;
if(this.localResolution&&_4e1==this.localResolution){
left=(this.left)-(-_4e0.left/_4e1);
top=(this.top)-(_4e0.top/_4e1);
}
this.localResolution=_4e1;
var _4e4=left+" "+top+" "+_4e0.getWidth()/_4e1+" "+_4e0.getHeight()/_4e1;
this.rendererRoot.setAttributeNS(null,"viewBox",_4e4);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.setAttributeNS(null,"width",this.size.w);
this.rendererRoot.setAttributeNS(null,"height",this.size.h);
},getNodeType:function(_4e6){
var _4e7=null;
switch(_4e6.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_4e7="circle";
break;
case "OpenLayers.Geometry.Rectangle":
_4e7="rect";
break;
case "OpenLayers.Geometry.LineString":
_4e7="polyline";
break;
case "OpenLayers.Geometry.LinearRing":
_4e7="polygon";
break;
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_4e7="path";
break;
default:
break;
}
return _4e7;
},setStyle:function(node,_4e9,_4ea){
_4e9=_4e9||node._style;
_4ea=_4ea||node._options;
if(node._geometryClass=="OpenLayers.Geometry.Point"){
if(_4e9.externalGraphic){
var id=node.getAttributeNS(null,"id");
var x=parseFloat(node.getAttributeNS(null,"cx"));
var y=parseFloat(node.getAttributeNS(null,"cy"));
var _4ee=node._featureId;
var _4ef=node._geometryClass;
var _4f0=node._style;
this.root.removeChild(node);
var node=this.createNode("image",id);
node._featureId=_4ee;
node._geometryClass=_4ef;
node._style=_4f0;
this.root.appendChild(node);
if(_4e9.graphicWidth&&_4e9.graphicHeight){
node.setAttributeNS(null,"preserveAspectRatio","none");
}
var _4f1=_4e9.graphicWidth||_4e9.graphicHeight;
var _4f2=_4e9.graphicHeight||_4e9.graphicWidth;
_4f1=_4f1?_4f1:_4e9.pointRadius*2;
_4f2=_4f2?_4f2:_4e9.pointRadius*2;
var _4f3=(_4e9.graphicXOffset!=undefined)?_4e9.graphicXOffset:-(0.5*_4f1);
var _4f4=(_4e9.graphicYOffset!=undefined)?_4e9.graphicYOffset:-(0.5*_4f2);
var _4f5=_4e9.graphicOpacity||_4e9.fillOpacity;
node.setAttributeNS(null,"x",(x+_4f3).toFixed());
node.setAttributeNS(null,"y",(-y+_4f4).toFixed());
node.setAttributeNS(null,"width",_4f1);
node.setAttributeNS(null,"height",_4f2);
node.setAttributeNS("http://www.w3.org/1999/xlink","href",_4e9.externalGraphic);
node.setAttributeNS(null,"transform","scale(1,-1)");
node.setAttributeNS(null,"style","opacity: "+_4f5);
}else{
node.setAttributeNS(null,"r",_4e9.pointRadius);
}
}
if(_4ea.isFilled){
node.setAttributeNS(null,"fill",_4e9.fillColor);
node.setAttributeNS(null,"fill-opacity",_4e9.fillOpacity);
}else{
node.setAttributeNS(null,"fill","none");
}
if(_4ea.isStroked){
node.setAttributeNS(null,"stroke",_4e9.strokeColor);
node.setAttributeNS(null,"stroke-opacity",_4e9.strokeOpacity);
node.setAttributeNS(null,"stroke-width",_4e9.strokeWidth);
node.setAttributeNS(null,"stroke-linecap",_4e9.strokeLinecap);
}else{
node.setAttributeNS(null,"stroke","none");
}
if(_4e9.pointerEvents){
node.setAttributeNS(null,"pointer-events",_4e9.pointerEvents);
}
if(_4e9.cursor){
node.setAttributeNS(null,"cursor",_4e9.cursor);
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
var _4fc=this.nodeFactory(id,"svg");
return _4fc;
},createRoot:function(){
var id=this.container.id+"_root";
var root=this.nodeFactory(id,"g");
root.setAttributeNS(null,"transform","scale(1, -1)");
return root;
},drawPoint:function(node,_500){
this.drawCircle(node,_500,1);
},drawCircle:function(node,_502,_503){
var _504=this.getResolution();
var x=(_502.x/_504+this.left);
var y=(_502.y/_504-this.top);
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
node.setAttributeNS(null,"r",_503);
}else{
this.root.removeChild(node);
}
},drawLineString:function(node,_509){
node.setAttributeNS(null,"points",this.getComponentsString(_509.components));
},drawLinearRing:function(node,_50b){
node.setAttributeNS(null,"points",this.getComponentsString(_50b.components));
},drawPolygon:function(node,_50d){
var d="";
var draw=true;
for(var j=0;j<_50d.components.length;j++){
var _511=_50d.components[j];
d+=" M";
for(var i=0;i<_511.components.length;i++){
var _513=this.getShortString(_511.components[i]);
if(_513){
d+=" "+_513;
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
},drawRectangle:function(node,_515){
var x=(_515.x/resolution+this.left);
var y=(_515.y/resolution-this.top);
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
node.setAttributeNS(null,"width",_515.width);
node.setAttributeNS(null,"height",_515.height);
}else{
node.setAttributeNS(null,"x","");
node.setAttributeNS(null,"y","");
node.setAttributeNS(null,"width",0);
node.setAttributeNS(null,"height",0);
}
},drawCurve:function(node,_51a){
var d=null;
var draw=true;
for(var i=0;i<_51a.components.length;i++){
if((i%3)==0&&(i/3)==0){
var _51e=this.getShortString(_51a.components[i]);
if(!_51e){
draw=false;
}
d="M "+_51e;
}else{
if((i%3)==1){
var _51e=this.getShortString(_51a.components[i]);
if(!_51e){
draw=false;
}
d+=" C "+_51e;
}else{
var _51e=this.getShortString(_51a.components[i]);
if(!_51e){
draw=false;
}
d+=" "+_51e;
}
}
}
if(draw){
node.setAttributeNS(null,"d",d);
}else{
node.setAttributeNS(null,"d","");
}
},drawSurface:function(node,_520){
var d=null;
var draw=true;
for(var i=0;i<_520.components.length;i++){
if((i%3)==0&&(i/3)==0){
var _524=this.getShortString(_520.components[i]);
if(!_524){
draw=false;
}
d="M "+_524;
}else{
if((i%3)==1){
var _524=this.getShortString(_520.components[i]);
if(!_524){
draw=false;
}
d+=" C "+_524;
}else{
var _524=this.getShortString(_520.components[i]);
if(!_524){
draw=false;
}
d+=" "+_524;
}
}
}
d+=" Z";
if(draw){
node.setAttributeNS(null,"d",d);
}else{
node.setAttributeNS(null,"d","");
}
},getComponentsString:function(_525){
var _526=[];
for(var i=0;i<_525.length;i++){
var _528=this.getShortString(_525[i]);
if(_528){
_526.push(_528);
}
}
return _526.join(",");
},getShortString:function(_529){
var _52a=this.getResolution();
var x=(_529.x/_52a+this.left);
var y=(_529.y/_52a-this.top);
if(x<-this.maxPixel||x>this.maxPixel){
return false;
}
if(y<-this.maxPixel||y>this.maxPixel){
return false;
}
var _52d=x+","+y;
return _52d;
},CLASS_NAME:"OpenLayers.Renderer.SVG"});
OpenLayers.Renderer.VML=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"urn:schemas-microsoft-com:vml",initialize:function(_52e){
if(!this.supported()){
return;
}
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
var _52f=document.createStyleSheet();
_52f.addRule("v\\:*","behavior: url(#default#VML); "+"position: relative; display: inline-block;");
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _530=document.namespaces;
return _530;
},setExtent:function(_531){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _532=this.getResolution();
var org=_531.left/_532+" "+_531.top/_532;
this.root.setAttribute("coordorigin",org);
var size=_531.getWidth()/_532+" "+-_531.getHeight()/_532;
this.root.setAttribute("coordsize",size);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.style.width=this.size.w;
this.rendererRoot.style.height=this.size.h;
this.root.style.width="100%";
this.root.style.height="100%";
},getNodeType:function(_536){
var _537=null;
switch(_536.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_537="v:oval";
break;
case "OpenLayers.Geometry.Rectangle":
_537="v:rect";
break;
case "OpenLayers.Geometry.LineString":
case "OpenLayers.Geometry.LinearRing":
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_537="v:shape";
break;
default:
break;
}
return _537;
},setStyle:function(node,_539,_53a,_53b){
_539=_539||node._style;
_53a=_53a||node._options;
if(node._geometryClass=="OpenLayers.Geometry.Point"){
if(_539.externalGraphic){
var id=node.id;
var _53d=node._featureId;
var _53e=node._geometryClass;
var _53f=node._style;
this.root.removeChild(node);
var node=this.createNode("v:rect",id);
var fill=this.createNode("v:fill",id+"_image");
node.appendChild(fill);
node._featureId=_53d;
node._geometryClass=_53e;
node._style=_53f;
this.root.appendChild(node);
fill.src=_539.externalGraphic;
fill.type="frame";
node.style.flip="y";
if(!(_539.graphicWidth&&_539.graphicHeight)){
fill.aspect="atmost";
}
var _541=_539.graphicWidth||_539.graphicHeight;
var _542=_539.graphicHeight||_539.graphicWidth;
_541=_541?_541:_539.pointRadius*2;
_542=_542?_542:_539.pointRadius*2;
var _543=this.getResolution();
var _544=(_539.graphicXOffset!=undefined)?_539.graphicXOffset:-(0.5*_541);
var _545=(_539.graphicYOffset!=undefined)?_539.graphicYOffset:-(0.5*_542);
node.style.left=((_53b.x/_543)+_544).toFixed();
node.style.top=((_53b.y/_543)-(_545+_542)).toFixed();
node.style.width=_541;
node.style.height=_542;
_539.fillColor="none";
_539.strokeColor="none";
}else{
this.drawCircle(node,_53b,_539.pointRadius);
}
}
var _546=(_53a.isFilled)?_539.fillColor:"none";
node.setAttribute("fillcolor",_546);
var _547=node.getElementsByTagName("fill");
var fill=(_547.length==0)?null:_547[0];
if(!_53a.isFilled){
if(fill){
node.removeChild(fill);
}
}else{
if(!fill){
fill=this.createNode("v:fill",node.id+"_fill");
node.appendChild(fill);
}
if(node._geometryClass=="OpenLayers.Geometry.Point"&&_539.externalGraphic&&_539.graphicOpacity){
fill.setAttribute("opacity",_539.graphicOpacity);
}else{
if(_539.fillOpacity){
fill.setAttribute("opacity",_539.fillOpacity);
}
}
}
var _548=(_53a.isStroked)?_539.strokeColor:"none";
node.setAttribute("strokecolor",_548);
node.setAttribute("strokeweight",_539.strokeWidth);
var _549=node.getElementsByTagName("stroke");
var _54a=(_549.length==0)?null:_549[0];
if(!_53a.isStroked){
if(_54a){
node.removeChild(_54a);
}
}else{
if(!_54a){
_54a=this.createNode("v:stroke",node.id+"_stroke");
node.appendChild(_54a);
}
_54a.setAttribute("opacity",_539.strokeOpacity);
_54a.setAttribute("endcap",!_539.strokeLinecap||_539.strokeLinecap=="butt"?"flat":_539.strokeLinecap);
}
if(_539.cursor){
node.style.cursor=_539.cursor;
}
},setNodeDimension:function(node,_54c){
var bbox=_54c.getBounds();
if(bbox){
var _54e=this.getResolution();
var _54f=new OpenLayers.Bounds((bbox.left/_54e).toFixed(),(bbox.bottom/_54e).toFixed(),(bbox.right/_54e).toFixed(),(bbox.top/_54e).toFixed());
node.style.left=_54f.left;
node.style.top=_54f.top;
node.style.width=_54f.getWidth();
node.style.height=_54f.getHeight();
node.coordorigin=_54f.left+" "+_54f.top;
node.coordsize=_54f.getWidth()+" "+_54f.getHeight();
}
},createNode:function(type,id){
var node=document.createElement(type);
if(id){
node.setAttribute("id",id);
}
return node;
},nodeTypeCompare:function(node,type){
var _555=type;
var _556=_555.indexOf(":");
if(_556!=-1){
_555=_555.substr(_556+1);
}
var _557=node.nodeName;
_556=_557.indexOf(":");
if(_556!=-1){
_557=_557.substr(_556+1);
}
return (_555==_557);
},createRenderRoot:function(){
var id=this.container.id+"_vmlRoot";
var _559=this.nodeFactory(id,"div");
return _559;
},createRoot:function(){
var id=this.container.id+"_root";
var root=this.nodeFactory(id,"v:group");
return root;
},drawPoint:function(node,_55d){
this.drawCircle(node,_55d,1);
},drawCircle:function(node,_55f,_560){
if(!isNaN(_55f.x)&&!isNaN(_55f.y)){
var _561=this.getResolution();
node.style.left=(_55f.x/_561).toFixed()-_560;
node.style.top=(_55f.y/_561).toFixed()-_560;
var _562=_560*2;
node.style.width=_562;
node.style.height=_562;
}
},drawLineString:function(node,_564){
this.drawLine(node,_564,false);
},drawLinearRing:function(node,_566){
this.drawLine(node,_566,true);
},drawLine:function(node,_568,_569){
this.setNodeDimension(node,_568);
var _56a=this.getResolution();
var path="m";
for(var i=0;i<_568.components.length;i++){
var x=(_568.components[i].x/_56a);
var y=(_568.components[i].y/_56a);
path+=" "+x.toFixed()+","+y.toFixed()+" l ";
}
if(_569){
path+=" x";
}
path+=" e";
node.path=path;
},drawPolygon:function(node,_570){
this.setNodeDimension(node,_570);
var _571=this.getResolution();
var path="";
for(var j=0;j<_570.components.length;j++){
var _574=_570.components[j];
path+="m";
for(var i=0;i<_574.components.length;i++){
var x=_574.components[i].x/_571;
var y=_574.components[i].y/_571;
path+=" "+x.toFixed()+","+y.toFixed();
if(i==0){
path+=" l";
}
}
path+=" x ";
}
path+="e";
node.path=path;
},drawRectangle:function(node,_579){
var _57a=this.getResolution();
node.style.left=_579.x/_57a;
node.style.top=_579.y/_57a;
node.style.width=_579.width/_57a;
node.style.height=_579.height/_57a;
},drawCurve:function(node,_57c){
this.setNodeDimension(node,_57c);
var _57d=this.getResolution();
var path="";
for(var i=0;i<_57c.components.length;i++){
var x=_57c.components[i].x/_57d;
var y=_57c.components[i].y/_57d;
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
},drawSurface:function(node,_583){
this.setNodeDimension(node,_583);
var _584=this.getResolution();
var path="";
for(var i=0;i<_583.components.length;i++){
var x=_583.components[i].x/_584;
var y=_583.components[i].y/_584;
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
OpenLayers.Tile.Image=OpenLayers.Class(OpenLayers.Tile,{url:null,imgDiv:null,frame:null,initialize:function(_589,_58a,_58b,url,size){
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
var _58e=this.layer.getImageSize();
if(this.layer.alpha){
OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,null,null,_58e,this.url);
}else{
this.imgDiv.src=this.url;
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,_58e);
}
this.drawn=true;
return true;
},clear:function(){
OpenLayers.Tile.prototype.clear.apply(this,arguments);
if(this.imgDiv){
this.imgDiv.style.display="none";
}
},initImgDiv:function(){
var _58f=this.layer.imageOffset;
var size=this.layer.getImageSize();
if(this.layer.alpha){
this.imgDiv=OpenLayers.Util.createAlphaImageDiv(null,_58f,size,null,"relative",null,null,null,true);
}else{
this.imgDiv=OpenLayers.Util.createImage(null,_58f,size,null,"relative",null,null,true);
}
this.imgDiv.className="olTileImage";
this.frame.appendChild(this.imgDiv);
this.layer.div.appendChild(this.frame);
if(this.layer.opacity!=null){
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,null,null,null,null,this.layer.opacity);
}
this.imgDiv.map=this.layer.map;
var _591=function(){
if(this.isLoading){
this.isLoading=false;
this.events.triggerEvent("loadend");
}
};
OpenLayers.Event.observe(this.imgDiv,"load",OpenLayers.Function.bind(_591,this));
},checkImgURL:function(){
if(this.layer){
var _592=this.layer.alpha?this.imgDiv.firstChild.src:this.imgDiv.src;
if(!OpenLayers.Util.isEquivalentUrl(_592,this.url)){
this.imgDiv.style.display="none";
}
}
},CLASS_NAME:"OpenLayers.Tile.Image"});
OpenLayers.Tile.WFS=OpenLayers.Class(OpenLayers.Tile,{features:null,url:null,initialize:function(_593,_594,_595,url,size){
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
},loadFeaturesForRegion:function(_598,_599){
OpenLayers.loadURL(this.url,null,this,_598);
},requestSuccess:function(_59a){
if(this.features){
var doc=_59a.responseXML;
if(!doc||_59a.fileType!="XML"){
doc=OpenLayers.parseXMLString(_59a.responseText);
}
if(this.layer.vectorMode){
var gml=new OpenLayers.Format.GML({"extractAttributes":this.layer.options.extractAttributes});
this.layer.addFeatures(gml.read(doc));
}else{
var _59d=OpenLayers.Ajax.getElementsByTagNameNS(doc,"http://www.opengis.net/gml","gml","featureMember");
this.addResults(_59d);
}
}
if(this.events){
this.events.triggerEvent("loadend");
}
},addResults:function(_59e){
for(var i=0;i<_59e.length;i++){
var _5a0=new this.layer.featureClass(this.layer,_59e[i]);
this.features.push(_5a0);
}
},destroyAllFeatures:function(){
while(this.features.length>0){
var _5a1=this.features.shift();
_5a1.destroy();
}
},CLASS_NAME:"OpenLayers.Tile.WFS"});
OpenLayers.Feature=OpenLayers.Class({layer:null,id:null,lonlat:null,data:null,marker:null,popupClass:OpenLayers.Popup.AnchoredBubble,popup:null,initialize:function(_5a2,_5a3,data){
this.layer=_5a2;
this.lonlat=_5a3;
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
var _5a5=false;
if((this.layer!=null)&&(this.layer.map!=null)){
var _5a6=this.layer.map.getExtent();
_5a5=_5a6.containsLonLat(this.lonlat);
}
return _5a5;
},createMarker:function(){
if(this.lonlat!=null){
this.marker=new OpenLayers.Marker(this.lonlat,this.data.icon);
}
return this.marker;
},destroyMarker:function(){
this.marker.destroy();
},createPopup:function(_5a7){
if(this.lonlat!=null){
var id=this.id+"_popup";
var _5a9=(this.marker)?this.marker.icon:null;
this.popup=new this.popupClass(id,this.lonlat,this.data.popupSize,this.data.popupContentHTML,_5a9,_5a7);
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
OpenLayers.Format.GeoJSON=OpenLayers.Class(OpenLayers.Format.JSON,{initialize:function(_5aa){
OpenLayers.Format.JSON.prototype.initialize.apply(this,[_5aa]);
},read:function(json,type,_5ad){
type=(type)?type:"FeatureCollection";
var _5ae=null;
var obj=null;
if(typeof json=="string"){
obj=OpenLayers.Format.JSON.prototype.read.apply(this,[json,_5ad]);
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
_5ae=this.parseGeometry(obj);
}
catch(err){
OpenLayers.Console.error(err);
}
break;
case "Feature":
try{
_5ae=this.parseFeature(obj);
_5ae.type="Feature";
}
catch(err){
OpenLayers.Console.error(err);
}
break;
case "GeometryCollection":
_5ae=[];
for(var i=0;i<obj.members.length;++i){
try{
_5ae.push(this.parseGeometry(obj.members[i]));
}
catch(err){
_5ae=null;
OpenLayers.Console.error(err);
}
}
break;
case "FeatureCollection":
_5ae=[];
switch(obj.type){
case "Feature":
try{
_5ae.push(this.parseFeature(obj));
}
catch(err){
_5ae=null;
OpenLayers.Console.error(err);
}
break;
case "FeatureCollection":
for(var i=0;i<obj.members.length;++i){
try{
_5ae.push(this.parseFeature(obj.members[i]));
}
catch(err){
_5ae=null;
OpenLayers.Console.error(err);
}
}
break;
case "GeometryCollection":
for(var i=0;i<obj.members.length;++i){
try{
var geom=this.parseGeometry(obj.members[i]);
_5ae.push(new OpenLayers.Feature.Vector(geom));
}
catch(err){
_5ae=null;
OpenLayers.Console.error(err);
}
}
break;
default:
try{
var geom=this.parseGeometry(obj);
_5ae.push(new OpenLayers.Feature.Vector(geom));
}
catch(err){
_5ae=null;
OpenLayers.Console.error(err);
}
}
break;
}
}
}
}
return _5ae;
},isValidType:function(obj,type){
var _5b4=false;
switch(type){
case "Geometry":
if(OpenLayers.Util.indexOf(["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon","Box"],obj.type)==-1){
OpenLayers.Console.error("Unsupported geometry type: "+obj.type);
}else{
_5b4=true;
}
break;
case "FeatureCollection":
_5b4=true;
break;
default:
if(obj.type==type){
_5b4=true;
}else{
OpenLayers.Console.error("Cannot convert types from "+obj.type+" to "+type);
}
}
return _5b4;
},parseFeature:function(obj){
var _5b6,geometry,attributes;
attributes=(obj.properties)?obj.properties:{};
try{
geometry=this.parseGeometry(obj.geometry);
}
catch(err){
throw err;
}
_5b6=new OpenLayers.Feature.Vector(geometry,attributes);
if(obj.id){
_5b6.fid=obj.id;
}
return _5b6;
},parseGeometry:function(obj){
var _5b8;
if(!(obj.coordinates instanceof Array)){
throw "Geometry must have coordinates array: "+obj;
}
if(!this.parseCoords[obj.type.toLowerCase()]){
throw "Unsupported geometry type: "+obj.type;
}
try{
_5b8=this.parseCoords[obj.type.toLowerCase()].apply(this,[obj.coordinates]);
}
catch(err){
throw err;
}
return _5b8;
},parseCoords:{"point":function(_5b9){
if(_5b9.length!=2){
throw "Only 2D points are supported: "+_5b9;
}
return new OpenLayers.Geometry.Point(_5b9[0],_5b9[1]);
},"multipoint":function(_5ba){
var _5bb=[];
var p=null;
for(var i=0;i<_5ba.length;++i){
try{
p=this.parseCoords["point"].apply(this,[_5ba[i]]);
}
catch(err){
throw err;
}
_5bb.push(p);
}
return new OpenLayers.Geometry.MultiPoint(_5bb);
},"linestring":function(_5be){
var _5bf=[];
var p=null;
for(var i=0;i<_5be.length;++i){
try{
p=this.parseCoords["point"].apply(this,[_5be[i]]);
}
catch(err){
throw err;
}
_5bf.push(p);
}
return new OpenLayers.Geometry.LineString(_5bf);
},"multilinestring":function(_5c2){
var _5c3=[];
var l=null;
for(var i=0;i<_5c2.length;++i){
try{
l=this.parseCoords["linestring"].apply(this,[_5c2[i]]);
}
catch(err){
throw err;
}
_5c3.push(l);
}
return new OpenLayers.Geometry.MultiLineString(_5c3);
},"polygon":function(_5c6){
var _5c7=[];
var r,l;
for(var i=0;i<_5c6.length;++i){
try{
l=this.parseCoords["linestring"].apply(this,[_5c6[i]]);
}
catch(err){
throw err;
}
r=new OpenLayers.Geometry.LinearRing(l.components);
_5c7.push(r);
}
return new OpenLayers.Geometry.Polygon(_5c7);
},"multipolygon":function(_5ca){
var _5cb=[];
var p=null;
for(var i=0;i<_5ca.length;++i){
try{
p=this.parseCoords["polygon"].apply(this,[_5ca[i]]);
}
catch(err){
throw err;
}
_5cb.push(p);
}
return new OpenLayers.Geometry.MultiPolygon(_5cb);
},"box":function(_5ce){
if(_5ce.length!=2){
throw "GeoJSON box coordinates must have 2 elements";
}
return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(_5ce[0][0],_5ce[0][1]),new OpenLayers.Geometry.Point(_5ce[1][0],_5ce[0][1]),new OpenLayers.Geometry.Point(_5ce[1][0],_5ce[1][1]),new OpenLayers.Geometry.Point(_5ce[0][0],_5ce[1][1]),new OpenLayers.Geometry.Point(_5ce[0][0],_5ce[0][1])])]);
}},write:function(obj,_5d0){
var _5d1={"type":null};
if(obj instanceof Array){
_5d1.members=[];
for(var i=0;i<obj.length;++i){
var _5d3=obj[i];
if(_5d3 instanceof OpenLayers.Feature.Vector){
if(_5d1.type==null){
_5d1.type="FeatureCollection";
if(_5d3.layer&&_5d3.layer.projection){
var proj=_5d3.layer.projection;
if(proj.match(/epsg:/i)){
_5d1.crs={"type":"EPSG","properties":{"code":parseInt(proj.substring(proj.indexOf(":")+1))}};
}
}
}else{
if(_5d1.type!="FeatureCollection"){
OpenLayers.Console.error("FeatureCollection only supports collections of features: "+_5d3);
break;
}
}
_5d1.members.push(this.extract.feature.apply(this,[_5d3]));
}else{
if(_5d3.CLASS_NAME.search("OpenLayers.Geometry")==0){
if(_5d1.type==null){
_5d1.type="GeometryCollection";
}else{
if(_5d1.type!="GeometryCollection"){
OpenLayers.Console.error("GeometryCollection only supports collections of geometries: "+_5d3);
break;
}
}
_5d1.members.push(this.extract.geometry.apply(this,[_5d3]));
}
}
}
}else{
if(obj.CLASS_NAME.search("OpenLayers.Geometry")==0){
_5d1=this.extract.geometry.apply(this,[obj]);
}else{
if(obj instanceof OpenLayers.Feature.Vector){
_5d1=this.extract.feature.apply(this,[obj]);
if(obj.layer&&obj.layer.projection){
var proj=obj.layer.projection;
if(proj.match(/epsg:/i)){
_5d1.crs={"type":"EPSG","properties":{"code":parseInt(proj.substring(proj.indexOf(":")+1))}};
}
}
}
}
}
return OpenLayers.Format.JSON.prototype.write.apply(this,[_5d1,_5d0]);
},extract:{"feature":function(_5d5){
var geom=this.extract.geometry.apply(this,[_5d5.geometry]);
return {"type":"Feature","id":_5d5.fid==null?_5d5.id:_5d5.fid,"properties":_5d5.attributes,"geometry":geom};
},"geometry":function(_5d7){
var _5d8=_5d7.CLASS_NAME.split(".")[2];
var data=this.extract[_5d8.toLowerCase()].apply(this,[_5d7]);
return {"type":_5d8,"coordinates":data};
},"point":function(_5da){
return [_5da.x,_5da.y];
},"multipoint":function(_5db){
var _5dc=[];
for(var i=0;i<_5db.components.length;++i){
_5dc.push(this.extract.point.apply(this,[_5db.components[i]]));
}
return _5dc;
},"linestring":function(_5de){
var _5df=[];
for(var i=0;i<_5de.components.length;++i){
_5df.push(this.extract.point.apply(this,[_5de.components[i]]));
}
return _5df;
},"multilinestring":function(_5e1){
var _5e2=[];
for(var i=0;i<_5e1.components.length;++i){
_5e2.push(this.extract.linestring.apply(this,[_5e1.components[i]]));
}
return _5e2;
},"polygon":function(_5e4){
var _5e5=[];
for(var i=0;i<_5e4.components.length;++i){
_5e5.push(this.extract.linestring.apply(this,[_5e4.components[i]]));
}
return _5e5;
},"multipolygon":function(_5e7){
var _5e8=[];
for(var i=0;i<_5e7.components.length;++i){
_5e8.push(this.extract.polygon.apply(this,[_5e7.components[i]]));
}
return _5e8;
}},CLASS_NAME:"OpenLayers.Format.GeoJSON"});
OpenLayers.Format.GeoRSS=OpenLayers.Class(OpenLayers.Format.XML,{rssns:"http://backend.userland.com/rss2",featureNS:"http://mapserver.gis.umn.edu/mapserver",georssns:"http://www.georss.org/georss",featureTitle:"Untitled",featureDescription:"No Description",initialize:function(_5ea){
OpenLayers.Format.XML.prototype.initialize.apply(this,[_5ea]);
},createGeometryFromItem:function(item){
var _5ec=this.getElementsByTagNameNS(item,this.georssns,"point");
var lat=this.getElementsByTagNameNS(item,this.geons,"lat");
var lon=this.getElementsByTagNameNS(item,this.geons,"long");
var line=this.getElementsByTagNameNS(item,this.georssns,"line");
var _5f0=this.getElementsByTagNameNS(item,this.georssns,"polygon");
if(_5ec.length>0||(lat.length>0&&lon.length>0)){
if(_5ec.length>0){
var _5f1=OpenLayers.String.trim(_5ec[0].firstChild.nodeValue).split(/\s+/);
if(_5f1.length!=2){
var _5f1=OpenLayers.String.trim(_5ec[0].firstChild.nodeValue).split(/\s*,\s*/);
}
}else{
var _5f1=[parseFloat(lat[0].firstChild.nodeValue),parseFloat(lon[0].firstChild.nodeValue)];
}
var _5f2=new OpenLayers.Geometry.Point(parseFloat(_5f1[1]),parseFloat(_5f1[0]));
}else{
if(line.length>0){
var _5f3=OpenLayers.String.trim(line[0].firstChild.nodeValue).split(/\s+/);
var _5f4=[];
for(var i=0;i<_5f3.length;i+=2){
var _5ec=new OpenLayers.Geometry.Point(parseFloat(_5f3[i+1]),parseFloat(_5f3[i]));
_5f4.push(_5ec);
}
_5f2=new OpenLayers.Geometry.LineString(_5f4);
}else{
if(_5f0.length>0){
var _5f3=OpenLayers.String.trim(_5f0[0].firstChild.nodeValue).split(/\s+/);
var _5f4=[];
for(var i=0;i<_5f3.length;i+=2){
var _5ec=new OpenLayers.Geometry.Point(parseFloat(_5f3[i+1]),parseFloat(_5f3[i]));
_5f4.push(_5ec);
}
_5f2=new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(_5f4)]);
}
}
}
return _5f2;
},createFeatureFromItem:function(item){
var _5f7=this.createGeometryFromItem(item);
var _5f8=this.getChildValue(item,"*","title",this.featureTitle);
var _5f9=this.getChildValue(item,"*","description",this.getChildValue(item,"*","content",this.featureDescription));
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
var data={"title":_5f8,"description":_5f9,"link":link};
var _5fd=new OpenLayers.Feature.Vector(_5f7,data);
_5fd.fid=id;
return _5fd;
},getChildValue:function(node,_5ff,name,def){
var _602;
try{
_602=this.getElementsByTagNameNS(node,_5ff,name)[0].firstChild.nodeValue;
}
catch(e){
_602=(def==undefined)?"":def;
}
return _602;
},read:function(doc){
if(typeof doc=="string"){
doc=OpenLayers.Format.XML.prototype.read.apply(this,[doc]);
}
var _604=null;
_604=this.getElementsByTagNameNS(doc,"*","item");
if(_604.length==0){
_604=this.getElementsByTagNameNS(doc,"*","entry");
}
var _605=_604.length;
var _606=new Array(_605);
for(var i=0;i<_605;i++){
_606[i]=this.createFeatureFromItem(_604[i]);
}
return _606;
},write:function(_608){
var _609;
if(_608 instanceof Array){
_609=this.createElementNS(this.rssns,"rss");
for(var i=0;i<_608.length;i++){
_609.appendChild(this.createFeatureXML(_608[i]));
}
}else{
_609=this.createFeatureXML(_608);
}
return OpenLayers.Format.XML.prototype.write.apply(this,[_609]);
},createFeatureXML:function(_60b){
var _60c=this.buildGeometryNode(_60b.geometry);
var _60d=this.createElementNS(this.rssns,"item");
var _60e=this.createElementNS(this.rssns,"title");
_60e.appendChild(this.createTextNode(_60b.attributes.title?_60b.attributes.title:""));
var _60f=this.createElementNS(this.rssns,"description");
_60f.appendChild(this.createTextNode(_60b.attributes.description?_60b.attributes.description:""));
_60d.appendChild(_60e);
_60d.appendChild(_60f);
if(_60b.attributes.link){
var _610=this.createElementNS(this.rssns,"link");
_610.appendChild(this.createTextNode(_60b.attributes.link));
_60d.appendChild(_610);
}
for(var attr in _60b.attributes){
if(attr=="link"||attr=="title"||attr=="description"){
continue;
}
var _612=this.createTextNode(_60b.attributes[attr]);
var _613=attr;
if(attr.search(":")!=-1){
_613=attr.split(":")[1];
}
var _614=this.createElementNS(this.featureNS,"feature:"+_613);
_614.appendChild(_612);
_60d.appendChild(_614);
}
_60d.appendChild(_60c);
return _60d;
},buildGeometryNode:function(_615){
var node;
if(_615.CLASS_NAME=="OpenLayers.Geometry.Polygon"){
node=this.createElementNS(this.georssns,"georss:polygon");
node.appendChild(this.buildCoordinatesNode(_615.components[0]));
}else{
if(_615.CLASS_NAME=="OpenLayers.Geometry.LineString"){
node=this.createElementNS(this.georssns,"georss:line");
node.appendChild(this.buildCoordinatesNode(_615));
}else{
if(_615.CLASS_NAME=="OpenLayers.Geometry.Point"){
node=this.createElementNS(this.georssns,"georss:point");
node.appendChild(this.buildCoordinatesNode(_615));
}else{
throw "Couldn't parse "+_615.CLASS_NAME;
}
}
}
return node;
},buildCoordinatesNode:function(_617){
var _618=null;
if(_617.components){
_618=_617.components;
}
var path;
if(_618){
var _61a=_618.length;
var _61b=new Array(_61a);
for(var i=0;i<_61a;i++){
_61b[i]=_618[i].y+" "+_618[i].x;
}
path=_61b.join(" ");
}else{
path=_617.y+" "+_617.x;
}
return this.createTextNode(path);
},CLASS_NAME:"OpenLayers.Format.GeoRSS"});
OpenLayers.Handler.Drag=OpenLayers.Class(OpenLayers.Handler,{started:false,dragging:false,last:null,start:null,oldOnselectstart:null,initialize:function(_61d,_61e,_61f){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},down:function(evt){
},move:function(evt){
},up:function(evt){
},out:function(evt){
},mousedown:function(evt){
if(this.checkModifiers(evt)&&OpenLayers.Event.isLeftClick(evt)){
this.started=true;
this.dragging=false;
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
return false;
}
return true;
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
if(this.dragging){
this.dragging=false;
return false;
}
this.started=false;
return true;
},activate:function(){
var _629=false;
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
this.dragging=false;
_629=true;
}
return _629;
},deactivate:function(){
var _62a=false;
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
this.started=false;
this.dragging=false;
this.start=null;
this.last=null;
_62a=true;
}
return _62a;
},CLASS_NAME:"OpenLayers.Handler.Drag"});
OpenLayers.Handler.Feature=OpenLayers.Class(OpenLayers.Handler,{geometryTypes:null,layerIndex:null,feature:null,initialize:function(_62b,_62c,_62d,_62e){
OpenLayers.Handler.prototype.initialize.apply(this,[_62b,_62d,_62e]);
this.layer=_62c;
},click:function(evt){
var _630=this.select("click",evt);
return !_630;
},mousedown:function(evt){
var _632=this.select("down",evt);
return !_632;
},mousemove:function(evt){
this.select("move",evt);
return true;
},mouseup:function(evt){
var _635=this.select("up",evt);
return !_635;
},dblclick:function(evt){
var _637=this.select("dblclick",evt);
return !_637;
},select:function(type,evt){
var _63a=this.layer.getFeatureFromEvent(evt);
var _63b=false;
if(_63a){
if(this.geometryTypes==null||(OpenLayers.Util.indexOf(this.geometryTypes,_63a.geometry.CLASS_NAME)>-1)){
if(!this.feature){
this.callback("over",[_63a]);
}else{
if(this.feature!=_63a){
this.callback("out",[this.feature]);
this.callback("over",[_63a]);
}
}
this.feature=_63a;
this.callback(type,[_63a]);
_63b=true;
}else{
if(this.feature&&(this.feature!=_63a)){
this.callback("out",[this.feature]);
this.feature=null;
}
_63b=false;
}
}else{
if(this.feature){
this.callback("out",[this.feature]);
this.feature=null;
}
_63b=false;
}
return _63b;
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
OpenLayers.Handler.Keyboard=OpenLayers.Class(OpenLayers.Handler,{KEY_EVENTS:["keydown","keypress","keyup"],eventListener:null,initialize:function(_63c,_63d,_63e){
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
var _640=false;
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
for(var i=0;i<this.KEY_EVENTS.length;i++){
OpenLayers.Event.stopObserving(window,this.KEY_EVENTS[i],this.eventListener);
}
_640=true;
}
return _640;
},handleKeyEvent:function(evt){
if(this.checkModifiers(evt)){
this.callback(evt.type,[evt.charCode||evt.keyCode]);
}
},CLASS_NAME:"OpenLayers.Handler.Keyboard"});
OpenLayers.Handler.MouseWheel=OpenLayers.Class(OpenLayers.Handler,{wheelListener:null,mousePosition:null,initialize:function(_643,_644,_645){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
this.wheelListener=OpenLayers.Function.bindAsEventListener(this.onWheelEvent,this);
},destroy:function(){
OpenLayers.Handler.prototype.destroy.apply(this,arguments);
this.wheelListener=null;
},onWheelEvent:function(e){
if(!this.checkModifiers(e)){
return;
}
var _647=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_647=true;
break;
}
elem=elem.parentNode;
}
if(_647){
var _649=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_649=e.wheelDelta/120;
if(window.opera){
_649=-_649;
}
}else{
if(e.detail){
_649=-e.detail/3;
}
}
if(_649){
if(this.mousePosition){
e.xy=this.mousePosition;
}
if(!e.xy){
e.xy=this.map.getPixelFromLonLat(this.map.getCenter());
}
if(_649<0){
this.callback("down",[e,_649]);
}else{
this.callback("up",[e,_649]);
}
}
OpenLayers.Event.stop(e);
}
},mousemove:function(evt){
this.mousePosition=evt.xy;
},activate:function(evt){
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
var _64c=this.wheelListener;
OpenLayers.Event.observe(window,"DOMMouseScroll",_64c);
OpenLayers.Event.observe(window,"mousewheel",_64c);
OpenLayers.Event.observe(document,"mousewheel",_64c);
return true;
}else{
return false;
}
},deactivate:function(evt){
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
var _64e=this.wheelListener;
OpenLayers.Event.stopObserving(window,"DOMMouseScroll",_64e);
OpenLayers.Event.stopObserving(window,"mousewheel",_64e);
OpenLayers.Event.stopObserving(document,"mousewheel",_64e);
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.MouseWheel"});
OpenLayers.Layer=OpenLayers.Class({id:null,name:null,div:null,EVENT_TYPES:["loadstart","loadend","loadcancel","visibilitychanged"],events:null,map:null,isBaseLayer:false,alpha:false,displayInLayerSwitcher:true,visibility:true,attribution:null,inRange:false,imageSize:null,imageOffset:null,options:null,gutter:0,projection:null,units:null,scales:null,resolutions:null,maxExtent:null,minExtent:null,maxResolution:null,minResolution:null,numZoomLevels:null,minScale:null,maxScale:null,displayOutsideMaxExtent:false,wrapDateLine:false,initialize:function(name,_650){
this.addOptions(_650);
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
},destroy:function(_651){
if(_651==null){
_651=true;
}
if(this.map!=null){
this.map.removeLayer(this,_651);
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
},setName:function(_653){
if(_653!=this.name){
this.name=_653;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
}
},addOptions:function(_654){
if(this.options==null){
this.options={};
}
OpenLayers.Util.extend(this.options,_654);
OpenLayers.Util.extend(this,_654);
},onMapResize:function(){
},redraw:function(){
var _655=false;
if(this.map){
this.inRange=this.calculateInRange();
var _656=this.getExtent();
if(_656&&this.inRange&&this.visibility){
this.moveTo(_656,true,false);
_655=true;
}
}
return _655;
},moveTo:function(_657,_658,_659){
var _65a=this.visibility;
if(!this.isBaseLayer){
_65a=_65a&&this.inRange;
}
this.display(_65a);
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
var _65f=(size)?size:((this.tileSize)?this.tileSize:this.map.getTileSize());
this.tileSize=_65f;
if(this.gutter){
this.imageOffset=new OpenLayers.Pixel(-this.gutter,-this.gutter);
this.imageSize=new OpenLayers.Size(_65f.w+(2*this.gutter),_65f.h+(2*this.gutter));
}
},getVisibility:function(){
return this.visibility;
},setVisibility:function(_660){
if(_660!=this.visibility){
this.visibility=_660;
this.display(_660);
this.redraw();
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
this.events.triggerEvent("visibilitychanged");
}
},display:function(_661){
if(_661!=(this.div.style.display!="none")){
this.div.style.display=(_661)?"block":"none";
}
},calculateInRange:function(){
var _662=false;
if(this.map){
var _663=this.map.getResolution();
_662=((_663>=this.minResolution)&&(_663<=this.maxResolution));
}
return _662;
},setIsBaseLayer:function(_664){
if(_664!=this.isBaseLayer){
this.isBaseLayer=_664;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
}
},initResolutions:function(){
var _665=new Array("projection","units","scales","resolutions","maxScale","minScale","maxResolution","minResolution","minExtent","maxExtent","numZoomLevels","maxZoomLevel");
var _666={};
for(var i=0;i<_665.length;i++){
var _668=_665[i];
_666[_668]=this.options[_668]||this.map[_668];
}
if((!_666.numZoomLevels)&&(_666.maxZoomLevel)){
_666.numZoomLevels=_666.maxZoomLevel+1;
}
if((_666.scales!=null)||(_666.resolutions!=null)){
if(_666.scales!=null){
_666.resolutions=[];
for(var i=0;i<_666.scales.length;i++){
var _669=_666.scales[i];
_666.resolutions[i]=OpenLayers.Util.getResolutionFromScale(_669,_666.units);
}
}
_666.numZoomLevels=_666.resolutions.length;
}else{
_666.resolutions=[];
if(_666.minScale){
_666.maxResolution=OpenLayers.Util.getResolutionFromScale(_666.minScale,_666.units);
}else{
if(_666.maxResolution=="auto"){
var _66a=this.map.getSize();
var wRes=_666.maxExtent.getWidth()/_66a.w;
var hRes=_666.maxExtent.getHeight()/_66a.h;
_666.maxResolution=Math.max(wRes,hRes);
}
}
if(_666.maxScale!=null){
_666.minResolution=OpenLayers.Util.getResolutionFromScale(_666.maxScale);
}else{
if((_666.minResolution=="auto")&&(_666.minExtent!=null)){
var _66a=this.map.getSize();
var wRes=_666.minExtent.getWidth()/_66a.w;
var hRes=_666.minExtent.getHeight()/_66a.h;
_666.minResolution=Math.max(wRes,hRes);
}
}
if(_666.minResolution!=null){
var _66d=_666.maxResolution/_666.minResolution;
_666.numZoomLevels=Math.floor(Math.log(_66d)/Math.log(2))+1;
}
for(var i=0;i<_666.numZoomLevels;i++){
var res=_666.maxResolution/Math.pow(2,i);
_666.resolutions.push(res);
}
}
_666.resolutions.sort(function(a,b){
return (b-a);
});
this.resolutions=_666.resolutions;
this.maxResolution=_666.resolutions[0];
var _671=_666.resolutions.length-1;
this.minResolution=_666.resolutions[_671];
this.scales=[];
for(var i=0;i<_666.resolutions.length;i++){
this.scales[i]=OpenLayers.Util.getScaleFromResolution(_666.resolutions[i],_666.units);
}
this.minScale=this.scales[0];
this.maxScale=this.scales[this.scales.length-1];
this.numZoomLevels=_666.numZoomLevels;
},getResolution:function(){
var zoom=this.map.getZoom();
return this.resolutions[zoom];
},getExtent:function(){
return this.map.calculateBounds();
},getZoomForExtent:function(_673){
var _674=this.map.getSize();
var _675=Math.max(_673.getWidth()/_674.w,_673.getHeight()/_674.h);
return this.getZoomForResolution(_675);
},getDataExtent:function(){
},getZoomForResolution:function(_676){
for(var i=1;i<this.resolutions.length;i++){
if(this.resolutions[i]<_676){
break;
}
}
return (i-1);
},getLonLatFromViewPortPx:function(_678){
var _679=null;
if(_678!=null){
var size=this.map.getSize();
var _67b=this.map.getCenter();
if(_67b){
var res=this.map.getResolution();
var _67d=_678.x-(size.w/2);
var _67e=_678.y-(size.h/2);
_679=new OpenLayers.LonLat(_67b.lon+_67d*res,_67b.lat-_67e*res);
if(this.wrapDateLine){
_679=_679.wrapDateLine(this.maxExtent);
}
}
}
return _679;
},getViewPortPxFromLonLat:function(_67f){
var px=null;
if(_67f!=null){
var _681=this.map.getResolution();
var _682=this.map.getExtent();
px=new OpenLayers.Pixel(Math.round(1/_681*(_67f.lon-_682.left)),Math.round(1/_681*(_682.top-_67f.lat)));
}
return px;
},setOpacity:function(_683){
if(_683!=this.opacity){
this.opacity=_683;
for(var i=0;i<this.div.childNodes.length;++i){
var _685=this.div.childNodes[i].firstChild;
OpenLayers.Util.modifyDOMElement(_685,null,null,null,null,null,null,_683);
}
}
},setZIndex:function(_686){
this.div.style.zIndex=_686;
},adjustBounds:function(_687){
if(this.gutter){
var _688=this.gutter*this.map.getResolution();
_687=new OpenLayers.Bounds(_687.left-_688,_687.bottom-_688,_687.right+_688,_687.top+_688);
}
if(this.wrapDateLine){
var _689={"rightTolerance":this.getResolution()};
_687=_687.wrapDateLine(this.maxExtent,_689);
}
return _687;
},CLASS_NAME:"OpenLayers.Layer"});
OpenLayers.Marker.Box=OpenLayers.Class(OpenLayers.Marker,{bounds:null,div:null,initialize:function(_68a,_68b,_68c){
this.bounds=_68a;
this.div=OpenLayers.Util.createDiv();
this.div.style.overflow="hidden";
this.events=new OpenLayers.Events(this,this.div,null);
this.setBorder(_68b,_68c);
},destroy:function(){
this.bounds=null;
this.div=null;
OpenLayers.Marker.prototype.destroy.apply(this,arguments);
},setBorder:function(_68d,_68e){
if(!_68d){
_68d="red";
}
if(!_68e){
_68e=2;
}
this.div.style.border=_68e+"px solid "+_68d;
},draw:function(px,sz){
OpenLayers.Util.modifyDOMElement(this.div,null,px,sz);
return this.div;
},onScreen:function(){
var _691=false;
if(this.map){
var _692=this.map.getExtent();
_691=_692.containsBounds(this.bounds,true,true);
}
return _691;
},display:function(_693){
this.div.style.display=(_693)?"":"none";
},CLASS_NAME:"OpenLayers.Marker.Box"});
OpenLayers.Control.DragFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,onStart:function(_694,_695){
},onDrag:function(_696,_697){
},onComplete:function(_698,_699){
},layer:null,feature:null,dragHandler:null,dragCallbacks:{},featureHandler:null,featureCallbacks:{},lastPixel:null,initialize:function(_69a,_69b){
OpenLayers.Control.prototype.initialize.apply(this,[_69b]);
this.layer=_69a;
this.dragCallbacks=OpenLayers.Util.extend({down:this.downFeature,move:this.moveFeature,up:this.upFeature,out:this.cancel,done:this.doneDragging},this.dragCallbacks);
this.dragHandler=new OpenLayers.Handler.Drag(this,this.dragCallbacks);
this.featureCallbacks=OpenLayers.Util.extend({over:this.overFeature,out:this.outFeature},this.featureCallbacks);
var _69c={geometryTypes:this.geometryTypes};
this.featureHandler=new OpenLayers.Handler.Feature(this,this.layer,this.featureCallbacks,_69c);
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
},overFeature:function(_69d){
if(!this.dragHandler.dragging){
this.feature=_69d;
this.dragHandler.activate();
this.over=true;
this.map.div.style.cursor="move";
}else{
if(this.feature.id==_69d.id){
this.over=true;
}else{
this.over=false;
}
}
},downFeature:function(_69e){
this.lastPixel=_69e;
this.onStart(this.feature,_69e);
},moveFeature:function(_69f){
var res=this.map.getResolution();
this.feature.geometry.move(res*(_69f.x-this.lastPixel.x),res*(this.lastPixel.y-_69f.y));
this.layer.drawFeature(this.feature);
this.lastPixel=_69f;
this.onDrag(this.feature,_69f);
},upFeature:function(_6a1){
if(!this.over){
this.dragHandler.deactivate();
this.feature=null;
this.map.div.style.cursor="default";
}
},doneDragging:function(_6a2){
this.onComplete(this.feature,_6a2);
},outFeature:function(_6a3){
if(!this.dragHandler.dragging){
this.over=false;
this.dragHandler.deactivate();
this.map.div.style.cursor="default";
this.feature=null;
}else{
if(this.feature.id==_6a3.id){
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
var _6a6=this.handler.last.x-xy.x;
var _6a7=this.handler.last.y-xy.y;
var size=this.map.getSize();
var _6a9=new OpenLayers.Pixel(size.w/2+_6a6,size.h/2+_6a7);
var _6aa=this.map.getLonLatFromViewPortPx(_6a9);
this.map.setCenter(_6aa,null,this.handler.dragging);
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
OpenLayers.Feature.Vector=OpenLayers.Class(OpenLayers.Feature,{fid:null,geometry:null,attributes:null,state:null,style:null,initialize:function(_6ae,_6af,_6b0){
OpenLayers.Feature.prototype.initialize.apply(this,[null,null,_6af]);
this.lonlat=null;
this.geometry=_6ae;
this.state=null;
this.attributes={};
if(_6af){
this.attributes=OpenLayers.Util.extend(this.attributes,_6af);
}
this.style=_6b0?_6b0:null;
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
},atPoint:function(_6b1,_6b2,_6b3){
var _6b4=false;
if(this.geometry){
_6b4=this.geometry.atPoint(_6b1,_6b2,_6b3);
}
return _6b4;
},destroyPopup:function(){
},toState:function(_6b5){
if(_6b5==OpenLayers.State.UPDATE){
switch(this.state){
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.DELETE:
this.state=_6b5;
break;
case OpenLayers.State.UPDATE:
case OpenLayers.State.INSERT:
break;
}
}else{
if(_6b5==OpenLayers.State.INSERT){
switch(this.state){
case OpenLayers.State.UNKNOWN:
break;
default:
this.state=_6b5;
break;
}
}else{
if(_6b5==OpenLayers.State.DELETE){
switch(this.state){
case OpenLayers.State.INSERT:
break;
case OpenLayers.State.DELETE:
break;
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.UPDATE:
this.state=_6b5;
break;
}
}else{
if(_6b5==OpenLayers.State.UNKNOWN){
this.state=_6b5;
}
}
}
}
},CLASS_NAME:"OpenLayers.Feature.Vector"});
OpenLayers.Feature.Vector.style={"default":{fillColor:"#ee9900",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"#ee9900",strokeOpacity:1,strokeWidth:1,strokeLinecap:"round",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"},"select":{fillColor:"blue",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"blue",strokeOpacity:1,strokeWidth:2,strokeLinecap:"round",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted",cursor:"pointer"},"temporary":{fillColor:"yellow",fillOpacity:0.2,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"yellow",strokeOpacity:1,strokeLinecap:"round",strokeWidth:4,hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"}};
OpenLayers.Feature.WFS=OpenLayers.Class(OpenLayers.Feature,{initialize:function(_6b6,_6b7){
var _6b8=arguments;
var data=this.processXMLNode(_6b7);
_6b8=new Array(_6b6,data.lonlat,data);
OpenLayers.Feature.prototype.initialize.apply(this,_6b8);
this.createMarker();
this.layer.addMarker(this.marker);
},destroy:function(){
if(this.marker!=null){
this.layer.removeMarker(this.marker);
}
OpenLayers.Feature.prototype.destroy.apply(this,arguments);
},processXMLNode:function(_6ba){
var _6bb=OpenLayers.Ajax.getElementsByTagNameNS(_6ba,"http://www.opengis.net/gml","gml","Point");
var text=OpenLayers.Util.getXmlNodeValue(OpenLayers.Ajax.getElementsByTagNameNS(_6bb[0],"http://www.opengis.net/gml","gml","coordinates")[0]);
var _6bd=text.split(",");
return {lonlat:new OpenLayers.LonLat(parseFloat(_6bd[0]),parseFloat(_6bd[1])),id:null};
},CLASS_NAME:"OpenLayers.Feature.WFS"});
OpenLayers.Handler.Box=OpenLayers.Class(OpenLayers.Handler,{dragHandler:null,initialize:function(_6be,_6bf,_6c0){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
var _6bf={"down":this.startBox,"move":this.moveBox,"out":this.removeBox,"up":this.endBox};
this.dragHandler=new OpenLayers.Handler.Drag(this,_6bf,{keyMask:this.keyMask});
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
var _6c4=Math.abs(this.dragHandler.start.x-xy.x);
var _6c5=Math.abs(this.dragHandler.start.y-xy.y);
this.zoomBox.style.width=Math.max(1,_6c4)+"px";
this.zoomBox.style.height=Math.max(1,_6c5)+"px";
if(xy.x<this.dragHandler.start.x){
this.zoomBox.style.left=xy.x+"px";
}
if(xy.y<this.dragHandler.start.y){
this.zoomBox.style.top=xy.y+"px";
}
},endBox:function(end){
var _6c7;
if(Math.abs(this.dragHandler.start.x-end.x)>5||Math.abs(this.dragHandler.start.y-end.y)>5){
var _6c8=this.dragHandler.start;
var top=Math.min(_6c8.y,end.y);
var _6ca=Math.max(_6c8.y,end.y);
var left=Math.min(_6c8.x,end.x);
var _6cc=Math.max(_6c8.x,end.x);
_6c7=new OpenLayers.Bounds(left,_6ca,_6cc,top);
}else{
_6c7=this.dragHandler.start.clone();
}
this.removeBox();
this.map.div.style.cursor="";
this.callback("done",[_6c7]);
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
OpenLayers.Handler.RegularPolygon=OpenLayers.Class(OpenLayers.Handler.Drag,{sides:4,radius:null,snapAngle:null,snapToggle:"shiftKey",persist:false,angle:null,fixedRadius:false,feature:null,layer:null,origin:null,initialize:function(_6cd,_6ce,_6cf){
this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});
OpenLayers.Handler.prototype.initialize.apply(this,[_6cd,_6ce,_6cf]);
this.options=(_6cf)?_6cf:new Object();
},setOptions:function(_6d0){
OpenLayers.Util.extend(this.options,_6d0);
OpenLayers.Util.extend(this,_6d0);
},activate:function(){
var _6d1=false;
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
var _6d2={displayInLayerSwitcher:false};
this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,_6d2);
this.map.addLayer(this.layer);
_6d1=true;
}
return _6d1;
},deactivate:function(){
var _6d3=false;
if(OpenLayers.Handler.Drag.prototype.deactivate.apply(this,arguments)){
if(this.dragging){
this.cancel();
}
this.map.removeLayer(this.layer,false);
this.layer.destroy();
if(this.feature){
this.feature.destroy();
}
_6d3=true;
}
return _6d3;
},down:function(evt){
this.fixedRadius=!!(this.radius);
var _6d5=this.map.getLonLatFromPixel(evt.xy);
this.origin=new OpenLayers.Geometry.Point(_6d5.lon,_6d5.lat);
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
var _6d7=this.map.getLonLatFromPixel(evt.xy);
var _6d8=new OpenLayers.Geometry.Point(_6d7.lon,_6d7.lat);
if(this.fixedRadius){
this.origin=_6d8;
}else{
this.calculateAngle(_6d8,evt);
this.radius=Math.max(this.map.getResolution()/2,_6d8.distanceTo(this.origin));
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
var _6db,dx,dy,point;
var ring=this.feature.geometry.components[0];
if(ring.components.length!=(this.sides+1)){
this.createGeometry();
}
for(var i=0;i<this.sides;++i){
point=ring.components[i];
_6db=this.angle+(i*2*Math.PI/this.sides);
point.x=this.origin.x+(this.radius*Math.cos(_6db));
point.y=this.origin.y+(this.radius*Math.sin(_6db));
point.clearBounds();
}
},calculateAngle:function(_6de,evt){
var _6e0=Math.atan2(_6de.y-this.origin.y,_6de.x-this.origin.x);
if(this.snapAngle&&(this.snapToggle&&!evt[this.snapToggle])){
var _6e1=(Math.PI/180)*this.snapAngle;
this.angle=Math.round(_6e0/_6e1)*_6e1;
}else{
this.angle=_6e0;
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
OpenLayers.Layer.EventPane=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:true,isFixed:true,pane:null,mapObject:null,initialize:function(name,_6e5){
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
var _6e8=this.map.getSize();
msgW=Math.min(_6e8.w,300);
msgH=Math.min(_6e8.h,200);
var size=new OpenLayers.Size(msgW,msgH);
var _6ea=new OpenLayers.Pixel(_6e8.w/2,_6e8.h/2);
var _6eb=_6ea.add(-size.w/2,-size.h/2);
var div=OpenLayers.Util.createDiv(this.name+"_warning",_6eb,size,null,null,null,"auto");
div.style.padding="7px";
div.style.backgroundColor="yellow";
div.innerHTML=this.getWarningHTML();
this.div.appendChild(div);
},getWarningHTML:function(){
return "";
},display:function(_6ed){
OpenLayers.Layer.prototype.display.apply(this,arguments);
this.pane.style.display=this.div.style.display;
},setZIndex:function(_6ee){
OpenLayers.Layer.prototype.setZIndex.apply(this,arguments);
this.pane.style.zIndex=parseInt(this.div.style.zIndex)+1;
},moveTo:function(_6ef,_6f0,_6f1){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(this.mapObject!=null){
var _6f2=this.map.getCenter();
var _6f3=this.map.getZoom();
if(_6f2!=null){
var _6f4=this.getMapObjectCenter();
var _6f5=this.getOLLonLatFromMapObjectLonLat(_6f4);
var _6f6=this.getMapObjectZoom();
var _6f7=this.getOLZoomFromMapObjectZoom(_6f6);
if(!(_6f2.equals(_6f5))||!(_6f3==_6f7)){
var _6f8=this.getMapObjectLonLatFromOLLonLat(_6f2);
var zoom=this.getMapObjectZoomFromOLZoom(_6f3);
this.setMapObjectCenter(_6f8,zoom);
}
}
}
},getLonLatFromViewPortPx:function(_6fa){
var _6fb=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _6fc=this.getMapObjectPixelFromOLPixel(_6fa);
var _6fd=this.getMapObjectLonLatFromMapObjectPixel(_6fc);
_6fb=this.getOLLonLatFromMapObjectLonLat(_6fd);
}
return _6fb;
},getViewPortPxFromLonLat:function(_6fe){
var _6ff=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _700=this.getMapObjectLonLatFromOLLonLat(_6fe);
var _701=this.getMapObjectPixelFromMapObjectLonLat(_700);
_6ff=this.getOLPixelFromMapObjectPixel(_701);
}
return _6ff;
},getOLLonLatFromMapObjectLonLat:function(_702){
var _703=null;
if(_702!=null){
var lon=this.getLongitudeFromMapObjectLonLat(_702);
var lat=this.getLatitudeFromMapObjectLonLat(_702);
_703=new OpenLayers.LonLat(lon,lat);
}
return _703;
},getMapObjectLonLatFromOLLonLat:function(_706){
var _707=null;
if(_706!=null){
_707=this.getMapObjectLonLatFromLonLat(_706.lon,_706.lat);
}
return _707;
},getOLPixelFromMapObjectPixel:function(_708){
var _709=null;
if(_708!=null){
var x=this.getXFromMapObjectPixel(_708);
var y=this.getYFromMapObjectPixel(_708);
_709=new OpenLayers.Pixel(x,y);
}
return _709;
},getMapObjectPixelFromOLPixel:function(_70c){
var _70d=null;
if(_70c!=null){
_70d=this.getMapObjectPixelFromXY(_70c.x,_70c.y);
}
return _70d;
},CLASS_NAME:"OpenLayers.Layer.EventPane"});
OpenLayers.Layer.FixedZoomLevels=OpenLayers.Class({initialize:function(){
},initResolutions:function(){
var _70e=new Array("minZoomLevel","maxZoomLevel","numZoomLevels");
for(var i=0;i<_70e.length;i++){
var _710=_70e[i];
this[_710]=(this.options[_710]!=null)?this.options[_710]:this.map[_710];
}
if((this.minZoomLevel==null)||(this.minZoomLevel<this.MIN_ZOOM_LEVEL)){
this.minZoomLevel=this.MIN_ZOOM_LEVEL;
}
var _711=this.MAX_ZOOM_LEVEL-this.minZoomLevel+1;
if(this.numZoomLevels!=null){
this.numZoomLevels=Math.min(this.numZoomLevels,_711);
}else{
if(this.maxZoomLevel!=null){
var _712=this.maxZoomLevel-this.minZoomLevel+1;
this.numZoomLevels=Math.min(_712,_711);
}else{
this.numZoomLevels=_711;
}
}
this.maxZoomLevel=this.minZoomLevel+this.numZoomLevels-1;
if(this.RESOLUTIONS!=null){
var _713=0;
this.resolutions=[];
for(var i=this.minZoomLevel;i<this.numZoomLevels;i++){
this.resolutions[_713++]=this.RESOLUTIONS[i];
}
}
},getResolution:function(){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getResolution.apply(this,arguments);
}else{
var _714=null;
var _715=this.map.getSize();
var _716=this.getExtent();
if((_715!=null)&&(_716!=null)){
_714=Math.max(_716.getWidth()/_715.w,_716.getHeight()/_715.h);
}
return _714;
}
},getExtent:function(){
var _717=null;
var size=this.map.getSize();
var tlPx=new OpenLayers.Pixel(0,0);
var tlLL=this.getLonLatFromViewPortPx(tlPx);
var brPx=new OpenLayers.Pixel(size.w,size.h);
var brLL=this.getLonLatFromViewPortPx(brPx);
if((tlLL!=null)&&(brLL!=null)){
_717=new OpenLayers.Bounds(tlLL.lon,brLL.lat,brLL.lon,tlLL.lat);
}
return _717;
},getZoomForResolution:function(_71d){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getZoomForResolution.apply(this,arguments);
}else{
var _71e=OpenLayers.Layer.prototype.getExtent.apply(this,[_71d]);
return this.getZoomForExtent(_71e);
}
},getOLZoomFromMapObjectZoom:function(_71f){
var zoom=null;
if(_71f!=null){
zoom=_71f-this.minZoomLevel;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_721){
var zoom=null;
if(_721!=null){
zoom=_721+this.minZoomLevel;
}
return zoom;
},CLASS_NAME:"FixedZoomLevels.js"});
OpenLayers.Layer.HTTPRequest=OpenLayers.Class(OpenLayers.Layer,{URL_HASH_FACTOR:(Math.sqrt(5)-1)/2,url:null,params:null,reproject:false,initialize:function(name,url,_725,_726){
var _727=arguments;
_727=[name,_726];
OpenLayers.Layer.prototype.initialize.apply(this,_727);
this.url=url;
this.params=OpenLayers.Util.extend({},_725);
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
},setUrl:function(_729){
this.url=_729;
},mergeNewParams:function(_72a){
this.params=OpenLayers.Util.extend(this.params,_72a);
this.redraw();
},selectUrl:function(_72b,urls){
var _72d=1;
for(var i=0;i<_72b.length;i++){
_72d*=_72b.charCodeAt(i)*this.URL_HASH_FACTOR;
_72d-=Math.floor(_72d);
}
return urls[Math.floor(_72d*urls.length)];
},getFullRequestString:function(_72f,_730){
var url=_730||this.url;
var _732=OpenLayers.Util.extend({},this.params);
_732=OpenLayers.Util.extend(_732,_72f);
var _733=OpenLayers.Util.getParameterString(_732);
if(url instanceof Array){
url=this.selectUrl(_733,url);
}
var _734=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
for(var key in _732){
if(key.toUpperCase() in _734){
delete _732[key];
}
}
_733=OpenLayers.Util.getParameterString(_732);
var _736=url;
if(_733!=""){
var _737=url.charAt(url.length-1);
if((_737=="&")||(_737=="?")){
_736+=_733;
}else{
if(url.indexOf("?")==-1){
_736+="?"+_733;
}else{
_736+="&"+_733;
}
}
}
return _736;
},CLASS_NAME:"OpenLayers.Layer.HTTPRequest"});
OpenLayers.Layer.Image=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:true,url:null,extent:null,size:null,tile:null,aspectRatio:null,initialize:function(name,url,_73a,size,_73c){
this.url=url;
this.extent=_73a;
this.size=size;
OpenLayers.Layer.prototype.initialize.apply(this,[name,_73c]);
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
},moveTo:function(_73f,_740,_741){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
var _742=(this.tile==null);
if(_740||_742){
this.setTileSize();
var ul=new OpenLayers.LonLat(this.extent.left,this.extent.top);
var ulPx=this.map.getLayerPxFromLonLat(ul);
if(_742){
this.tile=new OpenLayers.Tile.Image(this,ulPx,this.extent,null,this.tileSize);
}else{
this.tile.size=this.tileSize.clone();
this.tile.position=ulPx.clone();
}
this.tile.draw();
}
},setTileSize:function(){
var _745=this.extent.getWidth()/this.map.getResolution();
var _746=this.extent.getHeight()/this.map.getResolution();
this.tileSize=new OpenLayers.Size(_745,_746);
},setUrl:function(_747){
this.url=_747;
this.draw();
},getURL:function(_748){
return this.url;
},CLASS_NAME:"OpenLayers.Layer.Image"});
OpenLayers.Layer.Markers=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:false,markers:null,drawn:false,initialize:function(name,_74a){
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
this.markers=[];
},destroy:function(){
this.clearMarkers();
this.markers=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},moveTo:function(_74b,_74c,_74d){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(_74c||!this.drawn){
for(i=0;i<this.markers.length;i++){
this.drawMarker(this.markers[i]);
}
this.drawn=true;
}
},addMarker:function(_74e){
this.markers.push(_74e);
if(this.map&&this.map.getExtent()){
_74e.map=this.map;
this.drawMarker(_74e);
}
},removeMarker:function(_74f){
OpenLayers.Util.removeItem(this.markers,_74f);
if((_74f.icon!=null)&&(_74f.icon.imageDiv!=null)&&(_74f.icon.imageDiv.parentNode==this.div)){
this.div.removeChild(_74f.icon.imageDiv);
_74f.drawn=false;
}
},clearMarkers:function(){
if(this.markers!=null){
while(this.markers.length>0){
this.removeMarker(this.markers[0]);
}
}
},drawMarker:function(_750){
var px=this.map.getLayerPxFromLonLat(_750.lonlat);
if(px==null){
_750.display(false);
}else{
var _752=_750.draw(px);
if(!_750.drawn){
this.div.appendChild(_752);
_750.drawn=true;
}
}
},getDataExtent:function(){
var _753=null;
if(this.markers&&(this.markers.length>0)){
var _753=new OpenLayers.Bounds();
for(var i=0;i<this.markers.length;i++){
var _755=this.markers[i];
_753.extend(_755.lonlat);
}
}
return _753;
},CLASS_NAME:"OpenLayers.Layer.Markers"});
OpenLayers.Layer.SphericalMercator={getExtent:function(){
var _756=null;
if(this.sphericalMercator){
_756=this.map.calculateBounds();
}else{
_756=OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this);
}
return _756;
},initMercatorParameters:function(){
this.RESOLUTIONS=[];
var _757=156543.0339;
for(var zoom=0;zoom<=this.MAX_ZOOM_LEVEL;++zoom){
this.RESOLUTIONS[zoom]=_757/Math.pow(2,zoom);
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
},handlerOptions:null,initialize:function(_761,_762,_763){
OpenLayers.Control.prototype.initialize.apply(this,[_763]);
this.callbacks=OpenLayers.Util.extend({done:this.drawFeature},this.callbacks);
this.layer=_761;
this.handler=new _762(this,this.callbacks,this.handlerOptions);
},drawFeature:function(_764){
var _765=new OpenLayers.Feature.Vector(_764);
this.layer.addFeatures([_765]);
this.featureAdded(_765);
},CLASS_NAME:"OpenLayers.Control.DrawFeature"});
OpenLayers.Control.SelectFeature=OpenLayers.Class(OpenLayers.Control,{multiple:false,hover:false,onSelect:function(){
},onUnselect:function(){
},geometryTypes:null,layer:null,callbacks:null,selectStyle:OpenLayers.Feature.Vector.style["select"],handler:null,initialize:function(_766,_767){
OpenLayers.Control.prototype.initialize.apply(this,[_767]);
this.layer=_766;
this.callbacks=OpenLayers.Util.extend({click:this.clickFeature,over:this.overFeature,out:this.outFeature},this.callbacks);
var _768={geometryTypes:this.geometryTypes};
this.handler=new OpenLayers.Handler.Feature(this,_766,this.callbacks,_768);
},clickFeature:function(_769){
if(this.hover){
return;
}
if(this.multiple){
if(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_769)>-1){
this.unselect(_769);
}else{
this.select(_769);
}
}else{
if(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_769)>-1){
this.unselect(_769);
}else{
if(this.layer.selectedFeatures){
for(var i=0;i<this.layer.selectedFeatures.length;i++){
this.unselect(this.layer.selectedFeatures[i]);
}
}
this.select(_769);
}
}
},overFeature:function(_76b){
if(!this.hover){
return;
}
if(!(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_76b)>-1)){
this.select(_76b);
}
},outFeature:function(_76c){
if(!this.hover){
return;
}
this.unselect(_76c);
},select:function(_76d){
if(_76d.originalStyle==null){
_76d.originalStyle=_76d.style;
}
this.layer.selectedFeatures.push(_76d);
_76d.style=this.selectStyle;
this.layer.drawFeature(_76d);
this.onSelect(_76d);
},unselect:function(_76e){
if(_76e.originalStyle!=null){
_76e.style=_76e.originalStyle;
}
this.layer.drawFeature(_76e);
OpenLayers.Util.removeItem(this.layer.selectedFeatures,_76e);
this.onUnselect(_76e);
},setMap:function(map){
this.handler.setMap(map);
OpenLayers.Control.prototype.setMap.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Control.SelectFeature"});
OpenLayers.Control.ZoomBox=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask});
},zoomBox:function(_770){
if(_770 instanceof OpenLayers.Bounds){
var _771=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_770.left,_770.bottom));
var _772=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_770.right,_770.top));
var _773=new OpenLayers.Bounds(_771.lon,_771.lat,_772.lon,_772.lat);
this.map.zoomToExtent(_773);
}else{
this.map.setCenter(this.map.getLonLatFromPixel(_770),this.map.getZoom()+1);
}
},CLASS_NAME:"OpenLayers.Control.ZoomBox"});
OpenLayers.Format.KML=OpenLayers.Class(OpenLayers.Format.XML,{kmlns:"http://earth.google.com/kml/2.0",placemarksDesc:"No description available",foldersName:"OpenLayers export",foldersDesc:"Exported on "+new Date(),extractAttributes:true,initialize:function(_774){
this.regExes={trimSpace:(/^\s*|\s*$/g),removeSpace:(/\s*/g),splitSpace:(/\s+/),trimComma:(/\s*,\s*/g)};
OpenLayers.Format.XML.prototype.initialize.apply(this,[_774]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);
}
var _776=this.getElementsByTagNameNS(data,this.kmlns,"Placemark");
var _777=_776.length;
var _778=new Array(_777);
for(var i=0;i<_777;i++){
var _77a=this.parseFeature(_776[i]);
if(_77a){
_778[i]=_77a;
}else{
throw "Bad Placemark: "+i;
}
}
return _778;
},parseFeature:function(node){
var _77c=["MultiGeometry","Polygon","LineString","Point"];
var type,nodeList,geometry,parser;
for(var i=0;i<_77c.length;++i){
type=_77c[i];
nodeList=this.getElementsByTagNameNS(node,this.kmlns,type);
if(nodeList.length>0){
var _77f=this.parseGeometry[type.toLowerCase()];
if(_77f){
geometry=_77f.apply(this,[nodeList[0]]);
}else{
OpenLayers.Console.error("Unsupported geometry type: "+type);
}
break;
}
}
var _780;
if(this.extractAttributes){
_780=this.parseAttributes(node);
}
var _781=new OpenLayers.Feature.Vector(geometry,_780);
var fid=node.getAttribute("id");
if(fid!=null){
_781.fid=fid;
}
return _781;
},parseGeometry:{point:function(node){
var _784=this.getElementsByTagNameNS(node,this.kmlns,"coordinates");
var _785=[];
if(_784.length>0){
var _786=_784[0].firstChild.nodeValue;
_786=_786.replace(this.regExes.removeSpace,"");
_785=_786.split(",");
}
var _787=null;
if(_785.length>1){
if(_785.length==2){
_785[2]=null;
}
_787=new OpenLayers.Geometry.Point(_785[0],_785[1],_785[2]);
}else{
throw "Bad coordinate string: "+_786;
}
return _787;
},linestring:function(node,ring){
var _78a=this.getElementsByTagNameNS(node,this.kmlns,"coordinates");
var line=null;
if(_78a.length>0){
var _78c=_78a[0].firstChild.nodeValue;
_78c=_78c.replace(this.regExes.trimSpace,"");
_78c=_78c.replace(this.regExes.trimComma,",");
var _78d=_78c.split(this.regExes.splitSpace);
var _78e=_78d.length;
var _78f=new Array(_78e);
var _790,numCoords;
for(var i=0;i<_78e;++i){
_790=_78d[i].split(",");
numCoords=_790.length;
if(numCoords>1){
if(_790.length==2){
_790[2]=null;
}
_78f[i]=new OpenLayers.Geometry.Point(_790[0],_790[1],_790[2]);
}else{
throw "Bad LineString point coordinates: "+_78d[i];
}
}
if(_78e){
if(ring){
line=new OpenLayers.Geometry.LinearRing(_78f);
}else{
line=new OpenLayers.Geometry.LineString(_78f);
}
}else{
throw "Bad LineString coordinates: "+_78c;
}
}
return line;
},polygon:function(node){
var _793=this.getElementsByTagNameNS(node,this.kmlns,"LinearRing");
var _794=_793.length;
var _795=new Array(_794);
if(_794>0){
var ring;
for(var i=0;i<_793.length;++i){
ring=this.parseGeometry.linestring.apply(this,[_793[i],true]);
if(ring){
_795[i]=ring;
}else{
throw "Bad LinearRing geometry: "+i;
}
}
}
return new OpenLayers.Geometry.Polygon(_795);
},multigeometry:function(node){
var _799,parser;
var _79a=[];
var _79b=node.childNodes;
for(var i=0;i<_79b.length;++i){
_799=_79b[i];
if(_799.nodeType==1){
type=(_799.prefix)?_799.nodeName.split(":")[1]:_799.nodeName;
var _79d=this.parseGeometry[type.toLowerCase()];
if(_79d){
_79a.push(_79d.apply(this,[_799]));
}
}
}
return new OpenLayers.Geometry.Collection(_79a);
}},parseAttributes:function(node){
var _79f={};
var _7a0,grandchildren,grandchild;
var _7a1=node.childNodes;
for(var i=0;i<_7a1.length;++i){
_7a0=_7a1[i];
if(_7a0.nodeType==1){
grandchildren=_7a0.childNodes;
if(grandchildren.length==1){
grandchild=grandchildren[0];
if(grandchild.nodeType==3){
name=(_7a0.prefix)?_7a0.nodeName.split(":")[1]:_7a0.nodeName;
value=grandchild.nodeValue.replace(this.regExes.trimSpace,"");
_79f[name]=value;
}
}
}
}
return _79f;
},write:function(_7a3){
if(!(_7a3 instanceof Array)){
_7a3=[_7a3];
}
var kml=this.createElementNS(this.kmlns,"kml");
var _7a5=this.createFolderXML();
for(var i=0;i<_7a3.length;++i){
_7a5.appendChild(this.createPlacemarkXML(_7a3[i]));
}
kml.appendChild(_7a5);
return OpenLayers.Format.XML.prototype.write.apply(this,[kml]);
},createFolderXML:function(){
var _7a7=this.createElementNS(this.kmlns,"name");
var _7a8=this.createTextNode(this.foldersName);
_7a7.appendChild(_7a8);
var _7a9=this.createElementNS(this.kmlns,"description");
var _7aa=this.createTextNode(this.foldersDesc);
_7a9.appendChild(_7aa);
var _7ab=this.createElementNS(this.kmlns,"Folder");
_7ab.appendChild(_7a7);
_7ab.appendChild(_7a9);
return _7ab;
},createPlacemarkXML:function(_7ac){
var _7ad=this.createElementNS(this.kmlns,"name");
var name=(_7ac.attributes.name)?_7ac.attributes.name:_7ac.id;
_7ad.appendChild(this.createTextNode(name));
var _7af=this.createElementNS(this.kmlns,"description");
var desc=(_7ac.attributes.description)?_7ac.attributes.description:this.placemarksDesc;
_7af.appendChild(this.createTextNode(desc));
var _7b1=this.createElementNS(this.kmlns,"Placemark");
if(_7ac.fid!=null){
_7b1.setAttribute("id",_7ac.fid);
}
_7b1.appendChild(_7ad);
_7b1.appendChild(_7af);
var _7b2=this.buildGeometryNode(_7ac.geometry);
_7b1.appendChild(_7b2);
return _7b1;
},buildGeometryNode:function(_7b3){
var _7b4=_7b3.CLASS_NAME;
var type=_7b4.substring(_7b4.lastIndexOf(".")+1);
var _7b6=this.buildGeometry[type.toLowerCase()];
var node=null;
if(_7b6){
node=_7b6.apply(this,[_7b3]);
}
return node;
},buildGeometry:{point:function(_7b8){
var kml=this.createElementNS(this.kmlns,"Point");
kml.appendChild(this.buildCoordinatesNode(_7b8));
return kml;
},multipoint:function(_7ba){
return this.buildGeometry.collection(_7ba);
},linestring:function(_7bb){
var kml=this.createElementNS(this.kmlns,"LineString");
kml.appendChild(this.buildCoordinatesNode(_7bb));
return kml;
},multilinestring:function(_7bd){
return this.buildGeometry.collection(_7bd);
},linearring:function(_7be){
var kml=this.createElementNS(this.kmlns,"LinearRing");
kml.appendChild(this.buildCoordinatesNode(_7be));
return kml;
},polygon:function(_7c0){
var kml=this.createElementNS(this.kmlns,"Polygon");
var _7c2=_7c0.components;
var _7c3,ringGeom,type;
for(var i=0;i<_7c2.length;++i){
type=(i==0)?"outerBoundaryIs":"innerBoundaryIs";
_7c3=this.createElementNS(this.kmlns,type);
ringGeom=this.buildGeometry.linearring.apply(this,[_7c2[i]]);
_7c3.appendChild(ringGeom);
kml.appendChild(_7c3);
}
return kml;
},multipolygon:function(_7c5){
return this.buildGeometry.collection(_7c5);
},collection:function(_7c6){
var kml=this.createElementNS(this.kmlns,"MultiGeometry");
var _7c8;
for(var i=0;i<_7c6.components.length;++i){
_7c8=this.buildGeometryNode.apply(this,[_7c6.components[i]]);
if(_7c8){
kml.appendChild(_7c8);
}
}
return kml;
}},buildCoordinatesNode:function(_7ca){
var _7cb=this.createElementNS(this.kmlns,"coordinates");
var path;
var _7cd=_7ca.components;
if(_7cd){
var _7ce;
var _7cf=_7cd.length;
var _7d0=new Array(_7cf);
for(var i=0;i<_7cf;++i){
_7ce=_7cd[i];
_7d0[i]=_7ce.x+","+_7ce.y;
}
path=_7d0.join(" ");
}else{
path=_7ca.x+","+_7ca.y;
}
var _7d2=this.createTextNode(path);
_7cb.appendChild(_7d2);
return _7cb;
},CLASS_NAME:"OpenLayers.Format.KML"});
OpenLayers.Geometry=OpenLayers.Class({id:null,parent:null,bounds:null,initialize:function(){
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},destroy:function(){
this.id=null;
this.bounds=null;
},clone:function(){
return new OpenLayers.Geometry();
},setBounds:function(_7d3){
if(_7d3){
this.bounds=_7d3.clone();
}
},clearBounds:function(){
this.bounds=null;
if(this.parent){
this.parent.clearBounds();
}
},extendBounds:function(_7d4){
var _7d5=this.getBounds();
if(!_7d5){
this.setBounds(_7d4);
}else{
this.bounds.extend(_7d4);
}
},getBounds:function(){
if(this.bounds==null){
this.calculateBounds();
}
return this.bounds;
},calculateBounds:function(){
},atPoint:function(_7d6,_7d7,_7d8){
var _7d9=false;
var _7da=this.getBounds();
if((_7da!=null)&&(_7d6!=null)){
var dX=(_7d7!=null)?_7d7:0;
var dY=(_7d8!=null)?_7d8:0;
var _7dd=new OpenLayers.Bounds(this.bounds.left-dX,this.bounds.bottom-dY,this.bounds.right+dX,this.bounds.top+dY);
_7d9=_7dd.containsLonLat(_7d6);
}
return _7d9;
},getLength:function(){
return 0;
},getArea:function(){
return 0;
},toString:function(){
return OpenLayers.Format.WKT.prototype.write(new OpenLayers.Feature.Vector(this));
},CLASS_NAME:"OpenLayers.Geometry"});
OpenLayers.Layer.Boxes=OpenLayers.Class(OpenLayers.Layer.Markers,{initialize:function(name,_7df){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
},drawMarker:function(_7e0){
var _7e1=_7e0.bounds;
var _7e2=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_7e1.left,_7e1.top));
var _7e3=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_7e1.right,_7e1.bottom));
if(_7e3==null||_7e2==null){
_7e0.display(false);
}else{
var sz=new OpenLayers.Size(Math.max(1,_7e3.x-_7e2.x),Math.max(1,_7e3.y-_7e2.y));
var _7e5=_7e0.draw(_7e2,sz);
if(!_7e0.drawn){
this.div.appendChild(_7e5);
_7e0.drawn=true;
}
}
},removeMarker:function(_7e6){
OpenLayers.Util.removeItem(this.markers,_7e6);
if((_7e6.div!=null)&&(_7e6.div.parentNode==this.div)){
this.div.removeChild(_7e6.div);
}
},CLASS_NAME:"OpenLayers.Layer.Boxes"});
OpenLayers.Layer.GeoRSS=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,icon:null,popupSize:null,useFeedTitle:true,initialize:function(name,_7e8,_7e9){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,[name,_7e9]);
this.location=_7e8;
this.features=[];
this.events.triggerEvent("loadstart");
OpenLayers.loadURL(_7e8,null,this,this.parseData);
},destroy:function(){
this.clearFeatures();
this.features=null;
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
},parseData:function(_7ea){
var doc=_7ea.responseXML;
if(!doc||_7ea.fileType!="XML"){
doc=OpenLayers.parseXMLString(_7ea.responseText);
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
var _7ed=null;
try{
_7ed=doc.getElementsByTagNameNS("*","item");
}
catch(e){
_7ed=doc.getElementsByTagName("item");
}
if(_7ed.length==0){
try{
_7ed=doc.getElementsByTagNameNS("*","entry");
}
catch(e){
_7ed=doc.getElementsByTagName("entry");
}
}
for(var i=0;i<_7ed.length;i++){
var data={};
var _7f0=OpenLayers.Util.getNodes(_7ed[i],"georss:point");
var lat=OpenLayers.Util.getNodes(_7ed[i],"geo:lat");
var lon=OpenLayers.Util.getNodes(_7ed[i],"geo:long");
if(_7f0.length>0){
var _7f3=_7f0[0].firstChild.nodeValue.split(" ");
if(_7f3.length!=2){
var _7f3=_7f0[0].firstChild.nodeValue.split(",");
}
}else{
if(lat.length>0&&lon.length>0){
var _7f3=[parseFloat(lat[0].firstChild.nodeValue),parseFloat(lon[0].firstChild.nodeValue)];
}else{
continue;
}
}
_7f3=new OpenLayers.LonLat(parseFloat(_7f3[1]),parseFloat(_7f3[0]));
var _7f4="Untitled";
try{
_7f4=OpenLayers.Util.getNodes(_7ed[i],"title")[0].firstChild.nodeValue;
}
catch(e){
_7f4="Untitled";
}
var _7f5=null;
try{
_7f5=_7ed[i].getElementsByTagNameNS("*","description");
}
catch(e){
_7f5=_7ed[i].getElementsByTagName("description");
}
if(_7f5.length==0){
try{
_7f5=_7ed[i].getElementsByTagNameNS("*","summary");
}
catch(e){
_7f5=_7ed[i].getElementsByTagName("summary");
}
}
var _7f6="No description.";
try{
_7f6=_7f5[0].firstChild.nodeValue;
}
catch(e){
_7f6="No description.";
}
try{
var link=OpenLayers.Util.getNodes(_7ed[i],"link")[0].firstChild.nodeValue;
}
catch(e){
try{
var link=OpenLayers.Util.getNodes(_7ed[i],"link")[0].getAttribute("href");
}
catch(e){
}
}
data.icon=this.icon==null?OpenLayers.Marker.defaultIcon():this.icon.clone();
data.popupSize=this.popupSize?this.popupSize.clone():new OpenLayers.Size(250,120);
if((_7f4!=null)&&(_7f6!=null)){
contentHTML="<div class=\"olLayerGeoRSSClose\">[x]</div>";
contentHTML+="<div class=\"olLayerGeoRSSTitle\">";
if(link){
contentHTML+="<a class=\"link\" href=\""+link+"\" target=\"_blank\">";
}
contentHTML+=_7f4;
if(link){
contentHTML+="</a>";
}
contentHTML+="</div>";
contentHTML+="<div style=\"\" class=\"olLayerGeoRSSDescription\">";
contentHTML+=_7f6;
contentHTML+="</div>";
data["popupContentHTML"]=contentHTML;
}
var _7f8=new OpenLayers.Feature(this,_7f3,data);
this.features.push(_7f8);
var _7f9=_7f8.createMarker();
_7f9.events.register("click",_7f8,this.markerClick);
this.addMarker(_7f9);
}
this.events.triggerEvent("loadend");
},markerClick:function(evt){
sameMarkerClicked=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!sameMarkerClicked)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!sameMarkerClicked){
var _7fc=this.createPopup();
OpenLayers.Event.observe(_7fc.div,"click",OpenLayers.Function.bind(function(){
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
},this));
this.layer.map.addPopup(_7fc);
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _7fe=this.features[0];
OpenLayers.Util.removeItem(this.features,_7fe);
_7fe.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.GeoRSS"});
OpenLayers.Layer.Google=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:19,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125,0.00002145767211914062,0.00001072883605957031,0.00000536441802978515,0.00000268220901489257],type:null,sphericalMercator:false,initialize:function(name,_800){
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
var _801=this.div.lastChild;
this.div.removeChild(_801);
this.pane.appendChild(_801);
_801.className="olLayerGooglePoweredBy gmnoprint";
_801.style.left="";
_801.style.bottom="";
var _802=this.div.lastChild;
this.div.removeChild(_802);
this.pane.appendChild(_802);
_802.className="olLayerGoogleCopyright";
_802.style.right="";
_802.style.bottom="";
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
},getOLBoundsFromMapObjectBounds:function(_804){
var _805=null;
if(_804!=null){
var sw=_804.getSouthWest();
var ne=_804.getNorthEast();
if(this.sphericalMercator){
sw=this.forwardMercator(sw.lng(),sw.lat());
ne=this.forwardMercator(ne.lng(),ne.lat());
}else{
sw=new OpenLayers.LonLat(sw.lng(),sw.lat());
ne=new OpenLayers.LonLat(ne.lng(),ne.lat());
}
_805=new OpenLayers.Bounds(sw.lon,sw.lat,ne.lon,ne.lat);
}
return _805;
},getMapObjectBoundsFromOLBounds:function(_808){
var _809=null;
if(_808!=null){
var sw=this.sphericalMercator?this.inverseMercator(_808.bottom,_808.left):new OpenLayers.LonLat(_808.bottom,_808.left);
var ne=this.sphericalMercator?this.inverseMercator(_808.top,_808.right):new OpenLayers.LonLat(_808.top,_808.right);
_809=new GLatLngBounds(new GLatLng(sw.lat,sw.lon),new GLatLng(ne.lat,ne.lon));
}
return _809;
},addContainerPxFunction:function(){
if(typeof GMap2!="undefined"&&!GMap2.fromLatLngToContainerPixel){
GMap2.prototype.fromLatLngToContainerPixel=function(_80c){
var _80d=this.fromLatLngToDivPixel(_80c);
var div=this.b.firstChild.firstChild;
_80d.x+=div.offsetLeft;
_80d.y+=div.offsetTop;
return _80d;
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
},setMapObjectCenter:function(_810,zoom){
this.mapObject.setCenter(_810,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenter();
},getMapObjectZoom:function(){
return this.mapObject.getZoom();
},getMapObjectLonLatFromMapObjectPixel:function(_812){
return this.mapObject.fromContainerPixelToLatLng(_812);
},getMapObjectPixelFromMapObjectLonLat:function(_813){
return this.mapObject.fromLatLngToContainerPixel(_813);
},getMapObjectZoomFromMapObjectBounds:function(_814){
return this.mapObject.getBoundsZoomLevel(_814);
},getLongitudeFromMapObjectLonLat:function(_815){
return this.sphericalMercator?this.forwardMercator(_815.lng(),_815.lat()).lon:_815.lng();
},getLatitudeFromMapObjectLonLat:function(_816){
var lat=this.sphericalMercator?this.forwardMercator(_816.lng(),_816.lat()).lat:_816.lat();
return lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _81a;
if(this.sphericalMercator){
var _81b=this.inverseMercator(lon,lat);
_81a=new GLatLng(_81b.lat,_81b.lon);
}else{
_81a=new GLatLng(lat,lon);
}
return _81a;
},getXFromMapObjectPixel:function(_81c){
return _81c.x;
},getYFromMapObjectPixel:function(_81d){
return _81d.y;
},getMapObjectPixelFromXY:function(x,y){
return new GPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.Google"});
OpenLayers.Layer.Grid=OpenLayers.Class(OpenLayers.Layer.HTTPRequest,{tileSize:null,grid:null,singleTile:false,ratio:1.5,buffer:2,numLoadingTiles:0,initialize:function(name,url,_822,_823){
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
},moveTo:function(_829,_82a,_82b){
OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
_829=_829||this.map.getExtent();
if(_829!=null){
var _82c=!this.grid.length||_82a;
var _82d=this.getTilesBounds();
if(this.singleTile){
if(_82c||(!_82b&&!_82d.containsBounds(_829))){
this.initSingleTile(_829);
}
}else{
if(_82c||!_82d.containsBounds(_829,true)){
this.initGriddedTiles(_829);
}else{
this.moveGriddedTiles(_829);
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
var _830=null;
if(this.grid.length){
var _831=this.grid.length-1;
var _832=this.grid[_831][0];
var _833=this.grid[0].length-1;
var _834=this.grid[0][_833];
_830=new OpenLayers.Bounds(_832.bounds.left,_832.bounds.bottom,_834.bounds.right,_834.bounds.top);
}
return _830;
},initSingleTile:function(_835){
var _836=_835.getCenterLonLat();
var _837=_835.getWidth()*this.ratio;
var _838=_835.getHeight()*this.ratio;
var _839=new OpenLayers.Bounds(_836.lon-(_837/2),_836.lat-(_838/2),_836.lon+(_837/2),_836.lat+(_838/2));
var ul=new OpenLayers.LonLat(_839.left,_839.top);
var px=this.map.getLayerPxFromLonLat(ul);
if(!this.grid.length){
this.grid[0]=[];
}
var tile=this.grid[0][0];
if(!tile){
tile=this.addTile(_839,px);
this.addTileMonitoringHooks(tile);
tile.draw();
this.grid[0][0]=tile;
}else{
tile.moveTo(_839,px);
}
this.removeExcessTiles(1,1);
},initGriddedTiles:function(_83d){
var _83e=this.map.getSize();
var _83f=Math.ceil(_83e.h/this.tileSize.h)+Math.max(1,2*this.buffer);
var _840=Math.ceil(_83e.w/this.tileSize.w)+Math.max(1,2*this.buffer);
var _841=this.map.getMaxExtent();
var _842=this.map.getResolution();
var _843=_842*this.tileSize.w;
var _844=_842*this.tileSize.h;
var _845=_83d.left-_841.left;
var _846=Math.floor(_845/_843)-this.buffer;
var _847=_845/_843-_846;
var _848=-_847*this.tileSize.w;
var _849=_841.left+_846*_843;
var _84a=_83d.top-(_841.bottom+_844);
var _84b=Math.ceil(_84a/_844)+this.buffer;
var _84c=_84b-_84a/_844;
var _84d=-_84c*this.tileSize.h;
var _84e=_841.bottom+_84b*_844;
_848=Math.round(_848);
_84d=Math.round(_84d);
this.origin=new OpenLayers.Pixel(_848,_84d);
var _84f=_848;
var _850=_849;
var _851=0;
do{
var row=this.grid[_851++];
if(!row){
row=[];
this.grid.push(row);
}
_849=_850;
_848=_84f;
var _853=0;
do{
var _854=new OpenLayers.Bounds(_849,_84e,_849+_843,_84e+_844);
var x=_848;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_84d;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile=row[_853++];
if(!tile){
tile=this.addTile(_854,px);
this.addTileMonitoringHooks(tile);
row.push(tile);
}else{
tile.moveTo(_854,px,false);
}
_849+=_843;
_848+=this.tileSize.w;
}while((_849<=_83d.right+_843*this.buffer)||_853<_840);
_84e-=_844;
_84d+=this.tileSize.h;
}while((_84e>=_83d.bottom-_844*this.buffer)||_851<_83f);
this.removeExcessTiles(_851,_853);
this.spiralTileLoad();
},spiralTileLoad:function(){
var _859=[];
var _85a=["right","down","left","up"];
var iRow=0;
var _85c=-1;
var _85d=OpenLayers.Util.indexOf(_85a,"right");
var _85e=0;
while(_85e<_85a.length){
var _85f=iRow;
var _860=_85c;
switch(_85a[_85d]){
case "right":
_860++;
break;
case "down":
_85f++;
break;
case "left":
_860--;
break;
case "up":
_85f--;
break;
}
var tile=null;
if((_85f<this.grid.length)&&(_85f>=0)&&(_860<this.grid[0].length)&&(_860>=0)){
tile=this.grid[_85f][_860];
}
if((tile!=null)&&(!tile.queued)){
_859.unshift(tile);
tile.queued=true;
_85e=0;
iRow=_85f;
_85c=_860;
}else{
_85d=(_85d+1)%4;
_85e++;
}
}
for(var i=0;i<_859.length;i++){
var tile=_859[i];
tile.draw();
tile.queued=false;
}
},addTile:function(_863,_864){
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
},moveGriddedTiles:function(_867){
var _868=this.buffer||1;
while(true){
var _869=this.grid[0][0].position;
var _86a=this.map.getViewPortPxFromLayerPx(_869);
if(_86a.x>-this.tileSize.w*(_868-1)){
this.shiftColumn(true);
}else{
if(_86a.x<-this.tileSize.w*_868){
this.shiftColumn(false);
}else{
if(_86a.y>-this.tileSize.h*(_868-1)){
this.shiftRow(true);
}else{
if(_86a.y<-this.tileSize.h*_868){
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
if(!tile.drawn&&tile.bounds.intersectsBounds(_867,false)){
tile.draw();
}
}
}
}
},shiftRow:function(_86f){
var _870=(_86f)?0:(this.grid.length-1);
var _871=this.grid[_870];
var _872=this.map.getResolution();
var _873=(_86f)?-this.tileSize.h:this.tileSize.h;
var _874=_872*-_873;
var row=(_86f)?this.grid.pop():this.grid.shift();
for(var i=0;i<_871.length;i++){
var _877=_871[i];
var _878=_877.bounds.clone();
var _879=_877.position.clone();
_878.bottom=_878.bottom+_874;
_878.top=_878.top+_874;
_879.y=_879.y+_873;
row[i].moveTo(_878,_879);
}
if(_86f){
this.grid.unshift(row);
}else{
this.grid.push(row);
}
},shiftColumn:function(_87a){
var _87b=(_87a)?-this.tileSize.w:this.tileSize.w;
var _87c=this.map.getResolution();
var _87d=_87c*_87b;
for(var i=0;i<this.grid.length;i++){
var row=this.grid[i];
var _880=(_87a)?0:(row.length-1);
var _881=row[_880];
var _882=_881.bounds.clone();
var _883=_881.position.clone();
_882.left=_882.left+_87d;
_882.right=_882.right+_87d;
_883.x=_883.x+_87b;
var tile=_87a?this.grid[i].pop():this.grid[i].shift();
tile.moveTo(_882,_883);
if(_87a){
this.grid[i].unshift(tile);
}else{
this.grid[i].push(tile);
}
}
},removeExcessTiles:function(rows,_886){
while(this.grid.length>rows){
var row=this.grid.pop();
for(var i=0,l=row.length;i<l;i++){
var tile=row[i];
this.removeTileMonitoringHooks(tile);
tile.destroy();
}
}
while(this.grid[0].length>_886){
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
},getTileBounds:function(_88a){
var _88b=this.map.getMaxExtent();
var _88c=this.getResolution();
var _88d=_88c*this.tileSize.w;
var _88e=_88c*this.tileSize.h;
var _88f=this.getLonLatFromViewPortPx(_88a);
var _890=_88b.left+(_88d*Math.floor((_88f.lon-_88b.left)/_88d));
var _891=_88b.bottom+(_88e*Math.floor((_88f.lat-_88b.bottom)/_88e));
return new OpenLayers.Bounds(_890,_891,_890+_88d,_891+_88e);
},CLASS_NAME:"OpenLayers.Layer.Grid"});
OpenLayers.Layer.MultiMap=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[9,1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_893){
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
},setMapObjectCenter:function(_895,zoom){
this.mapObject.goToPosition(_895,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCurrentPosition();
},getMapObjectZoom:function(){
return this.mapObject.getZoomFactor();
},getMapObjectLonLatFromMapObjectPixel:function(_897){
_897.x=_897.x-(this.map.getSize().w/2);
_897.y=_897.y-(this.map.getSize().h/2);
return this.mapObject.getMapPositionAt(_897);
},getMapObjectPixelFromMapObjectLonLat:function(_898){
return this.mapObject.geoPosToContainerPixels(_898);
},getLongitudeFromMapObjectLonLat:function(_899){
return this.sphericalMercator?this.forwardMercator(_899.lon,_899.lat).lon:_899.lon;
},getLatitudeFromMapObjectLonLat:function(_89a){
return this.sphericalMercator?this.forwardMercator(_89a.lon,_89a.lat).lat:_89a.lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _89d;
if(this.sphericalMercator){
var _89e=this.inverseMercator(lon,lat);
_89d=new MMLatLon(_89e.lat,_89e.lon);
}else{
_89d=new MMLatLon(lat,lon);
}
return _89d;
},getXFromMapObjectPixel:function(_89f){
return _89f.x;
},getYFromMapObjectPixel:function(_8a0){
return _8a0.y;
},getMapObjectPixelFromXY:function(x,y){
return new MMPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.MultiMap"});
OpenLayers.Layer.Text=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,initialize:function(name,_8a4){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
this.features=new Array();
if(this.location!=null){
var _8a5=function(e){
this.events.triggerEvent("loadend");
};
this.events.triggerEvent("loadstart");
OpenLayers.loadURL(this.location,null,this,this.parseData,_8a5);
}
},destroy:function(){
this.clearFeatures();
this.features=null;
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
},parseData:function(_8a7){
var text=_8a7.responseText;
var _8a9=text.split("\n");
var _8aa;
for(var lcv=0;lcv<(_8a9.length-1);lcv++){
var _8ac=_8a9[lcv].replace(/^\s*/,"").replace(/\s*$/,"");
if(_8ac.charAt(0)!="#"){
if(!_8aa){
_8aa=_8ac.split("\t");
}else{
var vals=_8ac.split("\t");
var _8ae=new OpenLayers.LonLat(0,0);
var _8af;
var url;
var icon,iconSize,iconOffset,overflow;
var set=false;
for(var _8b3=0;_8b3<vals.length;_8b3++){
if(vals[_8b3]){
if(_8aa[_8b3]=="point"){
var _8b4=vals[_8b3].split(",");
_8ae.lat=parseFloat(_8b4[0]);
_8ae.lon=parseFloat(_8b4[1]);
set=true;
}else{
if(_8aa[_8b3]=="lat"){
_8ae.lat=parseFloat(vals[_8b3]);
set=true;
}else{
if(_8aa[_8b3]=="lon"){
_8ae.lon=parseFloat(vals[_8b3]);
set=true;
}else{
if(_8aa[_8b3]=="title"){
_8af=vals[_8b3];
}else{
if(_8aa[_8b3]=="image"||_8aa[_8b3]=="icon"){
url=vals[_8b3];
}else{
if(_8aa[_8b3]=="iconSize"){
var size=vals[_8b3].split(",");
iconSize=new OpenLayers.Size(parseFloat(size[0]),parseFloat(size[1]));
}else{
if(_8aa[_8b3]=="iconOffset"){
var _8b6=vals[_8b3].split(",");
iconOffset=new OpenLayers.Pixel(parseFloat(_8b6[0]),parseFloat(_8b6[1]));
}else{
if(_8aa[_8b3]=="title"){
_8af=vals[_8b3];
}else{
if(_8aa[_8b3]=="description"){
description=vals[_8b3];
}else{
if(_8aa[_8b3]=="overflow"){
overflow=vals[_8b3];
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
if((_8af!=null)&&(description!=null)){
data["popupContentHTML"]="<h2>"+_8af+"</h2><p>"+description+"</p>";
}
data["overflow"]=overflow||"auto";
var _8b8=new OpenLayers.Feature(this,_8ae,data);
this.features.push(_8b8);
var _8b9=_8b8.createMarker();
if((_8af!=null)&&(description!=null)){
_8b9.events.register("click",_8b8,this.markerClick);
}
this.addMarker(_8b9);
}
}
}
}
this.events.triggerEvent("loadend");
},markerClick:function(evt){
var _8bb=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!_8bb)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!_8bb){
this.layer.map.addPopup(this.createPopup());
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _8bd=this.features[0];
OpenLayers.Util.removeItem(this.features,_8bd);
_8bd.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.Text"});
OpenLayers.Layer.Vector=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:false,isFixed:false,isVector:true,features:null,selectedFeatures:null,reportError:true,style:null,renderers:["SVG","VML"],renderer:null,geometryType:null,drawn:false,initialize:function(name,_8bf){
var _8c0=OpenLayers.Feature.Vector.style["default"];
this.style=OpenLayers.Util.extend({},_8c0);
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
var _8c2=OpenLayers.Renderer[this.renderers[i]];
if(_8c2&&_8c2.prototype.supported()){
this.renderer=new _8c2(this.div);
break;
}
}
},displayError:function(){
if(this.reportError){
var _8c3="Your browser does not support vector rendering. "+"Currently supported renderers are:\n";
_8c3+=this.renderers.join("\n");
alert(_8c3);
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
},moveTo:function(_8c5,_8c6,_8c7){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(!_8c7){
this.div.style.left=-parseInt(this.map.layerContainerDiv.style.left)+"px";
this.div.style.top=-parseInt(this.map.layerContainerDiv.style.top)+"px";
var _8c8=this.map.getExtent();
this.renderer.setExtent(_8c8);
}
if(!this.drawn||_8c6){
this.drawn=true;
for(var i=0;i<this.features.length;i++){
var _8ca=this.features[i];
this.drawFeature(_8ca);
}
}
},addFeatures:function(_8cb){
if(!(_8cb instanceof Array)){
_8cb=[_8cb];
}
for(var i=0;i<_8cb.length;i++){
var _8cd=_8cb[i];
if(this.geometryType&&!(_8cd.geometry instanceof this.geometryType)){
var _8ce="addFeatures : component should be an "+this.geometryType.prototype.CLASS_NAME;
throw _8ce;
}
this.features.push(_8cd);
_8cd.layer=this;
if(!_8cd.style){
_8cd.style=OpenLayers.Util.extend({},this.style);
}
this.preFeatureInsert(_8cd);
if(this.drawn){
this.drawFeature(_8cd);
}
this.onFeatureInsert(_8cd);
}
},removeFeatures:function(_8cf){
if(!(_8cf instanceof Array)){
_8cf=[_8cf];
}
for(var i=_8cf.length-1;i>=0;i--){
var _8d1=_8cf[i];
this.features=OpenLayers.Util.removeItem(this.features,_8d1);
if(_8d1.geometry){
this.renderer.eraseGeometry(_8d1.geometry);
}
if(OpenLayers.Util.indexOf(this.selectedFeatures,_8d1)!=-1){
OpenLayers.Util.removeItem(this.selectedFeatures,_8d1);
}
}
},destroyFeatures:function(){
this.selectedFeatures=[];
for(var i=this.features.length-1;i>=0;i--){
this.features[i].destroy();
}
},drawFeature:function(_8d3,_8d4){
if(_8d4==null){
if(_8d3.style){
_8d4=_8d3.style;
}else{
_8d4=this.style;
}
}
this.renderer.drawFeature(_8d3,_8d4);
},eraseFeatures:function(_8d5){
this.renderer.eraseFeatures(_8d5);
},getFeatureFromEvent:function(evt){
if(!this.renderer){
OpenLayers.Console.error("getFeatureFromEvent called on layer with no renderer. This usually means you destroyed a layer, but not some handler which is associated with it.");
return null;
}
var _8d7=this.renderer.getFeatureIdFromEvent(evt);
return this.getFeatureById(_8d7);
},getFeatureById:function(_8d8){
var _8d9=null;
for(var i=0;i<this.features.length;++i){
if(this.features[i].id==_8d8){
_8d9=this.features[i];
break;
}
}
return _8d9;
},onFeatureInsert:function(_8db){
},preFeatureInsert:function(_8dc){
},CLASS_NAME:"OpenLayers.Layer.Vector"});
OpenLayers.Layer.VirtualEarth=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,sphericalMercator:false,initialize:function(name,_8de){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
if(this.sphericalMercator){
OpenLayers.Util.extend(this,OpenLayers.Layer.SphericalMercator);
this.initMercatorParameters();
}
},loadMapObject:function(){
var _8df=OpenLayers.Util.createDiv(this.name);
var sz=this.map.getSize();
_8df.style.width=sz.w;
_8df.style.height=sz.h;
this.div.appendChild(_8df);
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
},setMapObjectCenter:function(_8e2,zoom){
this.mapObject.SetCenterAndZoom(_8e2,zoom);
},getMapObjectCenter:function(){
return this.mapObject.GetCenter();
},getMapObjectZoom:function(){
return this.mapObject.GetZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_8e4){
return this.mapObject.PixelToLatLong(_8e4.x,_8e4.y);
},getMapObjectPixelFromMapObjectLonLat:function(_8e5){
return this.mapObject.LatLongToPixel(_8e5);
},getLongitudeFromMapObjectLonLat:function(_8e6){
return this.sphericalMercator?this.forwardMercator(_8e6.Longitude,_8e6.Latitude).lon:_8e6.Longitude;
},getLatitudeFromMapObjectLonLat:function(_8e7){
return this.sphericalMercator?this.forwardMercator(_8e7.Longitude,_8e7.Latitude).lat:_8e7.Latitude;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _8ea;
if(this.sphericalMercator){
var _8eb=this.inverseMercator(lon,lat);
_8ea=new VELatLong(_8eb.lat,_8eb.lon);
}else{
_8ea=new VELatLong(lat,lon);
}
return _8ea;
},getXFromMapObjectPixel:function(_8ec){
return _8ec.x;
},getYFromMapObjectPixel:function(_8ed){
return _8ed.y;
},getMapObjectPixelFromXY:function(x,y){
return new Msn.VE.Pixel(x,y);
},CLASS_NAME:"OpenLayers.Layer.VirtualEarth"});
OpenLayers.Layer.Yahoo=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:15,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,sphericalMercator:false,initialize:function(name,_8f1){
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
var _8f5=OpenLayers.Util.getElement("ygddfdiv");
if(_8f5!=null){
if(_8f5.parentNode!=null){
_8f5.parentNode.removeChild(_8f5);
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
},getOLZoomFromMapObjectZoom:function(_8f7){
var zoom=null;
if(_8f7!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getOLZoomFromMapObjectZoom.apply(this,[_8f7]);
zoom=18-zoom;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_8f9){
var zoom=null;
if(_8f9!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getMapObjectZoomFromOLZoom.apply(this,[_8f9]);
zoom=18-zoom;
}
return zoom;
},setMapObjectCenter:function(_8fb,zoom){
this.mapObject.drawZoomAndCenter(_8fb,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenterLatLon();
},getMapObjectZoom:function(){
return this.mapObject.getZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_8fd){
return this.mapObject.convertXYLatLon(_8fd);
},getMapObjectPixelFromMapObjectLonLat:function(_8fe){
return this.mapObject.convertLatLonXY(_8fe);
},getLongitudeFromMapObjectLonLat:function(_8ff){
return this.sphericalMercator?this.forwardMercator(_8ff.Lon,_8ff.Lat).lon:_8ff.Lon;
},getLatitudeFromMapObjectLonLat:function(_900){
return this.sphericalMercator?this.forwardMercator(_900.Lon,_900.Lat).lat:_900.Lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _903;
if(this.sphericalMercator){
var _904=this.inverseMercator(lon,lat);
_903=new YGeoPoint(_904.lat,_904.lon);
}else{
_903=new YGeoPoint(lat,lon);
}
return _903;
},getXFromMapObjectPixel:function(_905){
return _905.x;
},getYFromMapObjectPixel:function(_906){
return _906.y;
},getMapObjectPixelFromXY:function(x,y){
return new YCoordPoint(x,y);
},getMapObjectSizeFromOLSize:function(_909){
return new YSize(_909.w,_909.h);
},CLASS_NAME:"OpenLayers.Layer.Yahoo"});
OpenLayers.Control.ModifyFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,layer:null,feature:null,vertices:null,virtualVertices:null,selectControl:null,dragControl:null,keyboardHandler:null,deleteCodes:null,virtualStyle:null,onModificationStart:function(){
},onModification:function(){
},onModificationEnd:function(){
},initialize:function(_90a,_90b){
this.layer=_90a;
this.vertices=[];
this.virtualVertices=[];
this.styleVirtual=OpenLayers.Util.extend({},this.layer.style);
this.styleVirtual.fillOpacity=0.3;
this.styleVirtual.strokeOpacity=0.3;
this.deleteCodes=[46,100];
OpenLayers.Control.prototype.initialize.apply(this,[_90b]);
if(!(this.deleteCodes instanceof Array)){
this.deleteCodes=[this.deleteCodes];
}
var _90c=this;
var _90d={geometryTypes:this.geometryTypes,onSelect:function(_90e){
_90c.selectFeature.apply(_90c,[_90e]);
},onUnselect:function(_90f){
_90c.unselectFeature.apply(_90c,[_90f]);
}};
this.selectControl=new OpenLayers.Control.SelectFeature(_90a,_90d);
var _910={geometryTypes:["OpenLayers.Geometry.Point"],snappingOptions:this.snappingOptions,onStart:function(_911,_912){
_90c.dragStart.apply(_90c,[_911,_912]);
},onDrag:function(_913){
_90c.dragVertex.apply(_90c,[_913]);
},onComplete:function(_914){
_90c.dragComplete.apply(_90c,[_914]);
}};
this.dragControl=new OpenLayers.Control.DragFeature(_90a,_910);
var _915={keypress:this.handleKeypress};
this.keyboardHandler=new OpenLayers.Handler.Keyboard(this,_915);
},destroy:function(){
this.layer=null;
this.selectControl.destroy();
this.dragControl.destroy();
this.keyboardHandler.destroy();
OpenLayers.Control.prototype.destroy.apply(this,[]);
},activate:function(){
return (this.selectControl.activate()&&this.keyboardHandler.activate()&&OpenLayers.Control.prototype.activate.apply(this,arguments));
},deactivate:function(){
var _916=false;
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
_916=true;
}
return _916;
},selectFeature:function(_917){
this.feature=_917;
this.resetVertices();
this.dragControl.activate();
this.onModificationStart(this.feature);
},unselectFeature:function(_918){
this.layer.removeFeatures(this.vertices);
this.layer.removeFeatures(this.virtualVertices);
this.vertices=[];
this.virtualVertices=[];
this.feature=null;
this.dragControl.deactivate();
this.onModificationEnd(_918);
},dragStart:function(_919,_91a){
if(_919!=this.feature&&OpenLayers.Util.indexOf(this.vertices,_919)==-1&&OpenLayers.Util.indexOf(this.virtualVertices,_919)==-1){
if(this.feature){
this.selectControl.clickFeature.apply(this.selectControl,[this.feature]);
}
if(this.geometryTypes==null||OpenLayers.Util.indexOf(this.geometryTypes,_919.geometry.CLASS_NAME)!=-1){
this.selectControl.clickFeature.apply(this.selectControl,[_919]);
this.dragControl.overFeature.apply(this.dragControl,[_919]);
this.dragControl.lastPixel=_91a;
this.dragControl.dragHandler.started=true;
this.dragControl.dragHandler.start=_91a;
this.dragControl.dragHandler.last=_91a;
}
}
},dragVertex:function(_91b){
if(this.feature.geometry.CLASS_NAME=="OpenLayers.Geometry.Point"){
if(this.feature!=_91b){
this.feature=_91b;
}
}else{
if(OpenLayers.Util.indexOf(this.virtualVertices,_91b)!=-1){
_91b.geometry.parent.addComponent(_91b.geometry,_91b._index);
delete _91b._index;
OpenLayers.Util.removeItem(this.virtualVertices,_91b);
this.layer.removeFeatures(_91b);
}
}
this.layer.drawFeature(this.feature,this.selectControl.selectStyle);
this.layer.removeFeatures(this.virtualVertices);
this.layer.drawFeature(_91b);
},dragComplete:function(_91c){
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
var _91e=this.dragControl.feature;
if(_91e&&OpenLayers.Util.indexOf(this.vertices,_91e)!=-1){
_91e.geometry.parent.removeComponent(_91e.geometry);
this.layer.drawFeature(this.feature,this.selectControl.selectStyle);
this.resetVertices();
this.onModification(this.feature);
}
}
},collectVertices:function(){
this.vertices=[];
this.virtualVirtices=[];
var _91f=this;
function collectComponentVertices(_920){
var i,vertex,component;
if(_920.CLASS_NAME=="OpenLayers.Geometry.Point"){
vertex=new OpenLayers.Feature.Vector(_920);
_91f.vertices.push(vertex);
}else{
for(i=0;i<_920.components.length;++i){
component=_920.components[i];
if(component.CLASS_NAME=="OpenLayers.Geometry.Point"){
vertex=new OpenLayers.Feature.Vector(component);
_91f.vertices.push(vertex);
}else{
collectComponentVertices(component);
}
}
if(_920.CLASS_NAME!="OpenLayers.Geometry.MultiPoint"){
for(i=0;i<_920.components.length-1;++i){
var _922=_920.components[i];
var _923=_920.components[i+1];
if(_922.CLASS_NAME=="OpenLayers.Geometry.Point"&&_923.CLASS_NAME=="OpenLayers.Geometry.Point"){
var x=(_922.x+_923.x)/2;
var y=(_922.y+_923.y)/2;
var _926=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(x,y),null,_91f.styleVirtual);
_926.geometry.parent=_920;
_926._index=i+1;
_91f.virtualVertices.push(_926);
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
OpenLayers.Control.Navigation=OpenLayers.Class(OpenLayers.Control,{dragPan:null,zoomBox:null,wheelHandler:null,initialize:function(_928){
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
var _92a=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_92a,this.map.zoom+1);
OpenLayers.Event.stop(evt);
return false;
},wheelChange:function(evt,_92c){
var _92d=this.map.getZoom()+_92c;
if(!this.map.isValidZoomLevel(_92d)){
return;
}
var size=this.map.getSize();
var _92f=size.w/2-evt.xy.x;
var _930=evt.xy.y-size.h/2;
var _931=this.map.baseLayer.resolutions[_92d];
var _932=this.map.getLonLatFromPixel(evt.xy);
var _933=new OpenLayers.LonLat(_932.lon+_92f*_931,_932.lat+_930*_931);
this.map.setCenter(_933,_92d);
},wheelUp:function(evt){
this.wheelChange(evt,1);
},wheelDown:function(evt){
this.wheelChange(evt,-1);
},CLASS_NAME:"OpenLayers.Control.Navigation"});
OpenLayers.Format.GML=OpenLayers.Class(OpenLayers.Format.XML,{featureNS:"http://mapserver.gis.umn.edu/mapserver",featurePrefix:"feature",featureName:"featureMember",layerName:"features",geometryName:"geometry",collectionName:"FeatureCollection",gmlns:"http://www.opengis.net/gml",extractAttributes:true,initialize:function(_936){
this.regExes={trimSpace:(/^\s*|\s*$/g),removeSpace:(/\s*/g),splitSpace:(/\s+/),trimComma:(/\s*,\s*/g)};
OpenLayers.Format.XML.prototype.initialize.apply(this,[_936]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);
}
var _938=this.getElementsByTagNameNS(data.documentElement,this.gmlns,this.featureName);
var _939=[];
for(var i=0;i<_938.length;i++){
var _93b=this.parseFeature(_938[i]);
if(_93b){
_939.push(_93b);
}
}
return _939;
},parseFeature:function(node){
var _93d=["MultiPolygon","Polygon","MultiLineString","LineString","MultiPoint","Point"];
var type,nodeList,geometry,parser;
for(var i=0;i<_93d.length;++i){
type=_93d[i];
nodeList=this.getElementsByTagNameNS(node,this.gmlns,type);
if(nodeList.length>0){
var _940=this.parseGeometry[type.toLowerCase()];
if(_940){
geometry=_940.apply(this,[nodeList[0]]);
}else{
OpenLayers.Console.error("Unsupported geometry type: "+type);
}
break;
}
}
var _941;
if(this.extractAttributes){
_941=this.parseAttributes(node);
}
var _942=new OpenLayers.Feature.Vector(geometry,_941);
var _943=node.firstChild;
var fid;
while(_943){
if(_943.nodeType==1){
fid=_943.getAttribute("fid")||_943.getAttribute("id");
if(fid){
break;
}
}
_943=_943.nextSibling;
}
_942.fid=fid;
return _942;
},parseGeometry:{point:function(node){
var _946;
var _947=[];
var _946=this.getElementsByTagNameNS(node,this.gmlns,"pos");
if(_946.length>0){
coordString=_946[0].firstChild.nodeValue;
coordString=coordString.replace(this.regExes.trimSpace,"");
_947=coordString.split(this.regExes.splitSpace);
}
if(_947.length==0){
_946=this.getElementsByTagNameNS(node,this.gmlns,"coordinates");
if(_946.length>0){
coordString=_946[0].firstChild.nodeValue;
coordString=coordString.replace(this.regExes.removeSpace,"");
_947=coordString.split(",");
}
}
if(_947.length==0){
_946=this.getElementsByTagNameNS(node,this.gmlns,"coord");
if(_946.length>0){
var _948=this.getElementsByTagNameNS(_946[0],this.gmlns,"X");
var _949=this.getElementsByTagNameNS(_946[0],this.gmlns,"Y");
if(_948.length>0&&_949.length>0){
_947=[_948[0].firstChild.nodeValue,_949[0].firstChild.nodeValue];
}
}
}
if(_947.length==2){
_947[2]=null;
}
return new OpenLayers.Geometry.Point(_947[0],_947[1],_947[2]);
},multipoint:function(node){
var _94b=this.getElementsByTagNameNS(node,this.gmlns,"Point");
var _94c=[];
if(_94b.length>0){
var _94d;
for(var i=0;i<_94b.length;++i){
_94d=this.parseGeometry.point.apply(this,[_94b[i]]);
if(_94d){
_94c.push(_94d);
}
}
}
return new OpenLayers.Geometry.MultiPoint(_94c);
},linestring:function(node,ring){
var _951,coordString;
var _952=[];
var _953=[];
_951=this.getElementsByTagNameNS(node,this.gmlns,"posList");
if(_951.length>0){
coordString=_951[0].firstChild.nodeValue;
coordString=coordString.replace(this.regExes.trimSpace,"");
_952=coordString.split(this.regExes.splitSpace);
var dim=parseInt(_951[0].getAttribute("dimension"));
var j,x,y,z;
for(var i=0;i<_952.length/dim;++i){
j=i*dim;
x=_952[j];
y=_952[j+1];
z=(dim==2)?null:_952[j+2];
_953.push(new OpenLayers.Geometry.Point(x,y,z));
}
}
if(_952.length==0){
_951=this.getElementsByTagNameNS(node,this.gmlns,"coordinates");
if(_951.length>0){
coordString=_951[0].firstChild.nodeValue;
coordString=coordString.replace(this.regExes.trimSpace,"");
coordString=coordString.replace(this.regExes.trimComma,",");
var _957=coordString.split(this.regExes.splitSpace);
for(var i=0;i<_957.length;++i){
_952=_957[i].split(",");
if(_952.length==2){
_952[2]=null;
}
_953.push(new OpenLayers.Geometry.Point(_952[0],_952[1],_952[2]));
}
}
}
var line=null;
if(_953.length!=0){
if(ring){
line=new OpenLayers.Geometry.LinearRing(_953);
}else{
line=new OpenLayers.Geometry.LineString(_953);
}
}
return line;
},multilinestring:function(node){
var _95a=this.getElementsByTagNameNS(node,this.gmlns,"LineString");
var _95b=[];
if(_95a.length>0){
var line;
for(var i=0;i<_95a.length;++i){
line=this.parseGeometry.linestring.apply(this,[_95a[i]]);
if(line){
_95b.push(line);
}
}
}
return new OpenLayers.Geometry.MultiLineString(_95b);
},polygon:function(node){
var _95f=this.getElementsByTagNameNS(node,this.gmlns,"LinearRing");
var _960=[];
if(_95f.length>0){
var ring;
for(var i=0;i<_95f.length;++i){
ring=this.parseGeometry.linestring.apply(this,[_95f[i],true]);
if(ring){
_960.push(ring);
}
}
}
return new OpenLayers.Geometry.Polygon(_960);
},multipolygon:function(node){
var _964=this.getElementsByTagNameNS(node,this.gmlns,"Polygon");
var _965=[];
if(_964.length>0){
var _966;
for(var i=0;i<_964.length;++i){
_966=this.parseGeometry.polygon.apply(this,[_964[i]]);
if(_966){
_965.push(_966);
}
}
}
return new OpenLayers.Geometry.MultiPolygon(_965);
}},parseAttributes:function(node){
var _969={};
var _96a=node.firstChild;
var _96b,i,child,grandchildren,grandchild,name,value;
while(_96a){
if(_96a.nodeType==1){
_96b=_96a.childNodes;
for(i=0;i<_96b.length;++i){
child=_96b[i];
if(child.nodeType==1){
grandchildren=child.childNodes;
if(grandchildren.length==1){
grandchild=grandchildren[0];
if(grandchild.nodeType==3){
name=(child.prefix)?child.nodeName.split(":")[1]:child.nodeName;
value=grandchild.nodeValue.replace(this.regExes.trimSpace,"");
_969[name]=value;
}
}
}
}
break;
}
_96a=_96a.nextSibling;
}
return _969;
},write:function(_96c){
if(!(_96c instanceof Array)){
_96c=[_96c];
}
var gml=this.createElementNS("http://www.opengis.net/wfs","wfs:"+this.collectionName);
for(var i=0;i<_96c.length;i++){
gml.appendChild(this.createFeatureXML(_96c[i]));
}
return OpenLayers.Format.XML.prototype.write.apply(this,[gml]);
},createFeatureXML:function(_96f){
var _970=_96f.geometry;
var _971=this.buildGeometryNode(_970);
var _972=this.createElementNS(this.featureNS,this.featurePrefix+":"+this.geometryName);
_972.appendChild(_971);
var _973=this.createElementNS(this.gmlns,"gml:"+this.featureName);
var _974=this.createElementNS(this.featureNS,this.featurePrefix+":"+this.layerName);
var fid=_96f.fid||_96f.id;
_974.setAttribute("fid",fid);
_974.appendChild(_972);
for(var attr in _96f.attributes){
var _977=this.createTextNode(_96f.attributes[attr]);
var _978=attr.substring(attr.lastIndexOf(":")+1);
var _979=this.createElementNS(this.featureNS,this.featurePrefix+":"+_978);
_979.appendChild(_977);
_974.appendChild(_979);
}
_973.appendChild(_974);
return _973;
},buildGeometryNode:function(_97a){
var _97b=_97a.CLASS_NAME;
var type=_97b.substring(_97b.lastIndexOf(".")+1);
var _97d=this.buildGeometry[type.toLowerCase()];
return _97d.apply(this,[_97a]);
},buildGeometry:{point:function(_97e){
var gml=this.createElementNS(this.gmlns,"gml:Point");
gml.appendChild(this.buildCoordinatesNode(_97e));
return gml;
},multipoint:function(_980){
var gml=this.createElementNS(this.gmlns,"gml:MultiPoint");
var _982=_980.components;
var _983,pointGeom;
for(var i=0;i<_982.length;i++){
_983=this.createElementNS(this.gmlns,"gml:pointMember");
pointGeom=this.buildGeometry.point.apply(this,[_982[i]]);
_983.appendChild(pointGeom);
gml.appendChild(_983);
}
return gml;
},linestring:function(_985){
var gml=this.createElementNS(this.gmlns,"gml:LineString");
gml.appendChild(this.buildCoordinatesNode(_985));
return gml;
},multilinestring:function(_987){
var gml=this.createElementNS(this.gmlns,"gml:MultiLineString");
var _989=_987.components;
var _98a,lineGeom;
for(var i=0;i<_989.length;++i){
_98a=this.createElementNS(this.gmlns,"gml:lineStringMember");
lineGeom=this.buildGeometry.linestring.apply(this,[_989[i]]);
_98a.appendChild(lineGeom);
gml.appendChild(_98a);
}
return gml;
},linearring:function(_98c){
var gml=this.createElementNS(this.gmlns,"gml:LinearRing");
gml.appendChild(this.buildCoordinatesNode(_98c));
return gml;
},polygon:function(_98e){
var gml=this.createElementNS(this.gmlns,"gml:Polygon");
var _990=_98e.components;
var _991,ringGeom,type;
for(var i=0;i<_990.length;++i){
type=(i==0)?"outerBoundaryIs":"innerBoundaryIs";
_991=this.createElementNS(this.gmlns,"gml:"+type);
ringGeom=this.buildGeometry.linearring.apply(this,[_990[i]]);
_991.appendChild(ringGeom);
gml.appendChild(_991);
}
return gml;
},multipolygon:function(_993){
var gml=this.createElementNS(this.gmlns,"gml:MultiPolygon");
var _995=_993.components;
var _996,polyGeom;
for(var i=0;i<_995.length;++i){
_996=this.createElementNS(this.gmlns,"gml:polygonMember");
polyGeom=this.buildGeometry.polygon.apply(this,[_995[i]]);
_996.appendChild(polyGeom);
gml.appendChild(_996);
}
return gml;
}},buildCoordinatesNode:function(_998){
var _999=this.createElementNS(this.gmlns,"gml:coordinates");
_999.setAttribute("decimal",".");
_999.setAttribute("cs",",");
_999.setAttribute("ts"," ");
var _99a=(_998.components)?_998.components:[_998];
var _99b=[];
for(var i=0;i<_99a.length;i++){
_99b.push(_99a[i].x+","+_99a[i].y);
}
var _99d=this.createTextNode(_99b.join(" "));
_999.appendChild(_99d);
return _999;
},CLASS_NAME:"OpenLayers.Format.GML"});
OpenLayers.Geometry.Collection=OpenLayers.Class(OpenLayers.Geometry,{components:null,componentTypes:null,initialize:function(_99e){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.components=[];
if(_99e!=null){
this.addComponents(_99e);
}
},destroy:function(){
this.components.length=0;
this.components=null;
},clone:function(){
var _99f=eval("new "+this.CLASS_NAME+"()");
for(var i=0;i<this.components.length;i++){
_99f.addComponent(this.components[i].clone());
}
OpenLayers.Util.applyDefaults(_99f,this);
return _99f;
},getComponentsString:function(){
var _9a1=[];
for(var i=0;i<this.components.length;i++){
_9a1.push(this.components[i].toShortString());
}
return _9a1.join(",");
},calculateBounds:function(){
this.bounds=null;
if(this.components&&this.components.length>0){
this.setBounds(this.components[0].getBounds());
for(var i=1;i<this.components.length;i++){
this.extendBounds(this.components[i].getBounds());
}
}
},addComponents:function(_9a4){
if(!(_9a4 instanceof Array)){
_9a4=[_9a4];
}
for(var i=0;i<_9a4.length;i++){
this.addComponent(_9a4[i]);
}
},addComponent:function(_9a6,_9a7){
var _9a8=false;
if(_9a6){
if(this.componentTypes==null||(OpenLayers.Util.indexOf(this.componentTypes,_9a6.CLASS_NAME)>-1)){
if(_9a7!=null&&(_9a7<this.components.length)){
var _9a9=this.components.slice(0,_9a7);
var _9aa=this.components.slice(_9a7,this.components.length);
_9a9.push(_9a6);
this.components=_9a9.concat(_9aa);
}else{
this.components.push(_9a6);
}
_9a6.parent=this;
this.clearBounds();
_9a8=true;
}
}
return _9a8;
},removeComponents:function(_9ab){
if(!(_9ab instanceof Array)){
_9ab=[_9ab];
}
for(var i=0;i<_9ab.length;i++){
this.removeComponent(_9ab[i]);
}
},removeComponent:function(_9ad){
OpenLayers.Util.removeItem(this.components,_9ad);
this.clearBounds();
},getLength:function(){
var _9ae=0;
for(var i=0;i<this.components.length;i++){
_9ae+=this.components[i].getLength();
}
return _9ae;
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
},rotate:function(_9b5,_9b6){
for(var i=0;i<this.components.length;++i){
this.components[i].rotate(_9b5,_9b6);
}
},resize:function(_9b8,_9b9){
for(var i=0;i<this.components.length;++i){
this.components[i].resize(_9b8,_9b9);
}
},equals:function(_9bb){
var _9bc=true;
if(!_9bb.CLASS_NAME||(this.CLASS_NAME!=_9bb.CLASS_NAME)){
_9bc=false;
}else{
if(!(_9bb.components instanceof Array)||(_9bb.components.length!=this.components.length)){
_9bc=false;
}else{
for(var i=0;i<this.components.length;++i){
if(!this.components[i].equals(_9bb.components[i])){
_9bc=false;
break;
}
}
}
}
return _9bc;
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
},distanceTo:function(_9c1){
var _9c2=0;
if((this.x!=null)&&(this.y!=null)&&(_9c1!=null)&&(_9c1.x!=null)&&(_9c1.y!=null)){
var dx2=Math.pow(this.x-_9c1.x,2);
var dy2=Math.pow(this.y-_9c1.y,2);
_9c2=Math.sqrt(dx2+dy2);
}
return _9c2;
},equals:function(geom){
var _9c6=false;
if(geom!=null){
_9c6=((this.x==geom.x&&this.y==geom.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(geom.x)&&isNaN(geom.y)));
}
return _9c6;
},toShortString:function(){
return (this.x+", "+this.y);
},move:function(x,y){
this.x=this.x+x;
this.y=this.y+y;
this.clearBounds();
},rotate:function(_9c9,_9ca){
_9c9*=Math.PI/180;
var _9cb=this.distanceTo(_9ca);
var _9cc=_9c9+Math.atan2(this.y-_9ca.y,this.x-_9ca.x);
this.x=_9ca.x+(_9cb*Math.cos(_9cc));
this.y=_9ca.y+(_9cb*Math.sin(_9cc));
this.clearBounds();
},resize:function(_9cd,_9ce){
this.x=_9ce.x+(_9cd*(this.x-_9ce.x));
this.y=_9ce.y+(_9cd*(this.y-_9ce.y));
this.clearBounds();
},CLASS_NAME:"OpenLayers.Geometry.Point"});
OpenLayers.Geometry.Rectangle=OpenLayers.Class(OpenLayers.Geometry,{x:null,y:null,width:null,height:null,initialize:function(x,y,_9d1,_9d2){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.x=x;
this.y=y;
this.width=_9d1;
this.height=_9d2;
},calculateBounds:function(){
this.bounds=new OpenLayers.Bounds(this.x,this.y,this.x+this.width,this.y+this.height);
},getLength:function(){
var _9d3=(2*this.width)+(2*this.height);
return _9d3;
},getArea:function(){
var area=this.width*this.height;
return area;
},CLASS_NAME:"OpenLayers.Geometry.Rectangle"});
OpenLayers.Geometry.Surface=OpenLayers.Class(OpenLayers.Geometry,{initialize:function(){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.Surface"});
OpenLayers.Layer.GML=OpenLayers.Class(OpenLayers.Layer.Vector,{loaded:false,format:null,initialize:function(name,url,_9d7){
var _9d8=[];
_9d8.push(name,_9d7);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_9d8);
this.url=url;
},setVisibility:function(_9d9,_9da){
OpenLayers.Layer.Vector.prototype.setVisibility.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},moveTo:function(_9db,_9dc,_9dd){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.events.triggerEvent("loadstart");
this.loadGML();
}
},loadGML:function(){
if(!this.loaded){
var _9de=OpenLayers.loadURL(this.url,null,this,this.requestSuccess,this.requestFailure);
this.loaded=true;
}
},requestSuccess:function(_9df){
var doc=_9df.responseXML;
if(!doc||_9df.fileType!="XML"){
doc=_9df.responseText;
}
var gml=this.format?new this.format():new OpenLayers.Format.GML();
this.addFeatures(gml.read(doc));
this.events.triggerEvent("loadend");
},requestFailure:function(_9e2){
alert("Error in loading GML file "+this.url);
this.events.triggerEvent("loadend");
},CLASS_NAME:"OpenLayers.Layer.GML"});
OpenLayers.Layer.KaMap=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:true,units:null,resolution:OpenLayers.DOTS_PER_INCH,DEFAULT_PARAMS:{i:"jpeg",map:""},initialize:function(name,url,_9e5,_9e6){
var _9e7=[];
_9e7.push(name,url,_9e5,_9e6);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_9e7);
this.params=(_9e5?_9e5:{});
if(_9e5){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},getURL:function(_9e8){
_9e8=this.adjustBounds(_9e8);
var _9e9=this.map.getResolution();
var _9ea=Math.round((this.map.getScale()*10000))/10000;
var pX=Math.round(_9e8.left/_9e9);
var pY=-Math.round(_9e8.top/_9e9);
return this.getFullRequestString({t:pY,l:pX,s:_9ea});
},addTile:function(_9ed,_9ee){
var url=this.getURL(_9ed);
return new OpenLayers.Tile.Image(this,_9ee,_9ed,url,this.tileSize);
},initGriddedTiles:function(_9f0){
var _9f1=this.map.getSize();
var _9f2=Math.ceil(_9f1.h/this.tileSize.h)+Math.max(1,2*this.buffer);
var _9f3=Math.ceil(_9f1.w/this.tileSize.w)+Math.max(1,2*this.buffer);
var _9f4=this.map.getMaxExtent();
var _9f5=this.map.getResolution();
var _9f6=_9f5*this.tileSize.w;
var _9f7=_9f5*this.tileSize.h;
var _9f8=_9f0.left;
var _9f9=Math.floor(_9f8/_9f6)-this.buffer;
var _9fa=_9f8/_9f6-_9f9;
var _9fb=-_9fa*this.tileSize.w;
var _9fc=_9f9*_9f6;
var _9fd=_9f0.top;
var _9fe=Math.ceil(_9fd/_9f7)+this.buffer;
var _9ff=_9fe-_9fd/_9f7;
var _a00=-(_9ff+1)*this.tileSize.h;
var _a01=_9fe*_9f7;
_9fb=Math.round(_9fb);
_a00=Math.round(_a00);
this.origin=new OpenLayers.Pixel(_9fb,_a00);
var _a02=_9fb;
var _a03=_9fc;
var _a04=0;
do{
var row=this.grid[_a04++];
if(!row){
row=[];
this.grid.push(row);
}
_9fc=_a03;
_9fb=_a02;
var _a06=0;
do{
var _a07=new OpenLayers.Bounds(_9fc,_a01,_9fc+_9f6,_a01+_9f7);
var x=_9fb;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_a00;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile=row[_a06++];
if(!tile){
tile=this.addTile(_a07,px);
this.addTileMonitoringHooks(tile);
row.push(tile);
}else{
tile.moveTo(_a07,px,false);
}
_9fc+=_9f6;
_9fb+=this.tileSize.w;
}while(_9fc<=_9f0.right+_9f6*this.buffer||_a06<_9f3);
_a01-=_9f7;
_a00+=this.tileSize.h;
}while(_a01>=_9f0.bottom-_9f7*this.buffer||_a04<_9f2);
this.removeExcessTiles(_a04,_a06);
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
},getTileBounds:function(_a0d){
var _a0e=this.getResolution();
var _a0f=_a0e*this.tileSize.w;
var _a10=_a0e*this.tileSize.h;
var _a11=this.getLonLatFromViewPortPx(_a0d);
var _a12=_a0f*Math.floor(_a11.lon/_a0f);
var _a13=_a10*Math.floor(_a11.lat/_a10);
return new OpenLayers.Bounds(_a12,_a13,_a12+_a0f,_a13+_a10);
},CLASS_NAME:"OpenLayers.Layer.KaMap"});
OpenLayers.Layer.MapServer=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{mode:"map",map_imagetype:"png"},initialize:function(name,url,_a16,_a17){
var _a18=[];
_a18.push(name,url,_a16,_a17);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_a18);
if(arguments.length>0){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
if(_a17==null||_a17.isBaseLayer==null){
this.isBaseLayer=((this.params.transparent!="true")&&(this.params.transparent!=true));
}
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.MapServer(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},addTile:function(_a1a,_a1b){
return new OpenLayers.Tile.Image(this,_a1b,_a1a,null,this.tileSize);
},getURL:function(_a1c){
_a1c=this.adjustBounds(_a1c);
var _a1d=[_a1c.left,_a1c.bottom,_a1c.right,_a1c.top];
var _a1e=this.getImageSize();
var url=this.getFullRequestString({mapext:_a1d,imgext:_a1d,map_size:[_a1e.w,_a1e.h],imgx:_a1e.w/2,imgy:_a1e.h/2,imgxy:[_a1e.w,_a1e.h]});
return url;
},getFullRequestString:function(_a20,_a21){
var url=(_a21==null)?this.url:_a21;
if(typeof url=="object"){
url=url[Math.floor(Math.random()*url.length)];
}
var _a23=url;
var _a24=OpenLayers.Util.extend({},this.params);
_a24=OpenLayers.Util.extend(_a24,_a20);
var _a25=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
for(var key in _a24){
if(key.toUpperCase() in _a25){
delete _a24[key];
}
}
var _a27=OpenLayers.Util.getParameterString(_a24);
_a27=_a27.replace(/,/g,"+");
if(_a27!=""){
var _a28=url.charAt(url.length-1);
if((_a28=="&")||(_a28=="?")){
_a23+=_a27;
}else{
if(url.indexOf("?")==-1){
_a23+="?"+_a27;
}else{
_a23+="&"+_a27;
}
}
}
return _a23;
},CLASS_NAME:"OpenLayers.Layer.MapServer"});
OpenLayers.Layer.TMS=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:true,tileOrigin:null,initialize:function(name,url,_a2b){
var _a2c=[];
_a2c.push(name,url,{},_a2b);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_a2c);
},destroy:function(){
OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TMS(this.name,this.url,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_a2e){
_a2e=this.adjustBounds(_a2e);
var res=this.map.getResolution();
var x=Math.round((_a2e.left-this.tileOrigin.lon)/(res*this.tileSize.w));
var y=Math.round((_a2e.bottom-this.tileOrigin.lat)/(res*this.tileSize.h));
var z=this.map.getZoom();
var path="1.0.0"+"/"+this.layername+"/"+z+"/"+x+"/"+y+"."+this.type;
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
return url+path;
},addTile:function(_a35,_a36){
return new OpenLayers.Tile.Image(this,_a36,_a35,null,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TMS"});
OpenLayers.Layer.TileCache=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:true,tileOrigin:null,format:"image/png",initialize:function(name,url,_a3a,_a3b){
_a3b=OpenLayers.Util.extend({maxResolution:180/256},_a3b);
this.layername=_a3a;
OpenLayers.Layer.Grid.prototype.initialize.apply(this,[name,url,{},_a3b]);
this.extension=this.format.split("/")[1].toLowerCase();
this.extension=(this.extension=="jpeg")?"jpg":this.extension;
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TileCache(this.name,this.url,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_a3d){
var res=this.map.getResolution();
var bbox=this.maxExtent;
var size=this.tileSize;
var _a41=Math.floor((_a3d.left-bbox.left)/(res*size.w));
var _a42=Math.floor((_a3d.bottom-bbox.bottom)/(res*size.h));
var _a43=this.map.zoom;
function zeroPad(_a44,_a45){
_a44=String(_a44);
var _a46=[];
for(var i=0;i<_a45;++i){
_a46.push("0");
}
return _a46.join("").substring(0,_a45-_a44.length)+_a44;
}
var _a48=[this.layername,zeroPad(_a43,2),zeroPad(parseInt(_a41/1000000),3),zeroPad((parseInt(_a41/1000)%1000),3),zeroPad((parseInt(_a41)%1000),3),zeroPad(parseInt(_a42/1000000),3),zeroPad((parseInt(_a42/1000)%1000),3),zeroPad((parseInt(_a42)%1000),3)+"."+this.extension];
var path=_a48.join("/");
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
url=(url.charAt(url.length-1)=="/")?url:url+"/";
return url+path;
},addTile:function(_a4b,_a4c){
var url=this.getURL(_a4b);
return new OpenLayers.Tile.Image(this,_a4c,_a4b,url,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TileCache"});
OpenLayers.Layer.WFS=OpenLayers.Class(OpenLayers.Layer.Vector,OpenLayers.Layer.Markers,{isBaseLayer:false,tile:null,ratio:2,DEFAULT_PARAMS:{service:"WFS",version:"1.0.0",request:"GetFeature"},featureClass:null,vectorMode:true,encodeBBOX:false,extractAttributes:false,initialize:function(name,url,_a51,_a52){
if(_a52==undefined){
_a52={};
}
if(_a52.featureClass||!OpenLayers.Layer.Vector||!OpenLayers.Feature.Vector){
this.vectorMode=false;
}
OpenLayers.Util.extend(_a52,{"reportError":false});
var _a53=[];
_a53.push(name,_a52);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_a53);
if(!this.renderer||!this.vectorMode){
this.vectorMode=false;
if(!_a52.featureClass){
_a52.featureClass=OpenLayers.Feature.WFS;
}
OpenLayers.Layer.Markers.prototype.initialize.apply(this,_a53);
}
if(this.params&&this.params.typename&&!this.options.typename){
this.options.typename=this.params.typename;
}
if(!this.options.geometry_column){
this.options.geometry_column="the_geom";
}
this.params=_a51;
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
},moveTo:function(_a55,_a56,_a57){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.moveTo.apply(this,arguments);
}
if(_a57){
return false;
}
if(_a56){
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
if(_a55==null){
_a55=this.map.getExtent();
}
var _a59=(this.tile==null);
var _a5a=(!_a59&&!this.tile.bounds.containsBounds(_a55));
if((_a56||_a59||(!_a57&&_a5a))&&this.inRange){
var _a5b=_a55.getCenterLonLat();
var _a5c=_a55.getWidth()*this.ratio;
var _a5d=_a55.getHeight()*this.ratio;
var _a5e=new OpenLayers.Bounds(_a5b.lon-(_a5c/2),_a5b.lat-(_a5d/2),_a5b.lon+(_a5c/2),_a5b.lat+(_a5d/2));
var _a5f=this.map.getSize();
_a5f.w=_a5f.w*this.ratio;
_a5f.h=_a5f.h*this.ratio;
var ul=new OpenLayers.LonLat(_a5e.left,_a5e.top);
var pos=this.map.getLayerPxFromLonLat(ul);
var url=this.getFullRequestString();
var _a63={BBOX:this.encodeBBOX?_a5e.toBBOX():_a5e.toArray()};
url+="&"+OpenLayers.Util.getParameterString(_a63);
if(!this.tile){
this.tile=new OpenLayers.Tile.WFS(this,pos,_a5e,url,_a5f);
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
this.tile=new OpenLayers.Tile.WFS(this,pos,_a5e,url,_a5f);
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
},mergeNewParams:function(_a66){
var _a67=OpenLayers.Util.upperCaseObject(_a66);
var _a68=[_a67];
OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this,_a68);
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
},getFullRequestString:function(_a6a){
var _a6b=this.map.getProjection();
this.params.SRS=(_a6b=="none")?null:_a6b;
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
var _a6e=OpenLayers.Function.bind(this.commitSuccess,this);
var _a6f=OpenLayers.Function.bind(this.commitFailure,this);
data=OpenLayers.Ajax.serializeXMLToString(data);
new OpenLayers.Ajax.Request(url,{method:"post",postBody:data,onComplete:_a6e,onFailure:_a6f});
},commitSuccess:function(_a70){
var _a71=_a70.responseText;
if(_a71.indexOf("SUCCESS")!=-1){
this.commitReport("WFS Transaction: SUCCESS",_a71);
for(var i=0;i<this.features.length;i++){
this.features[i].state=null;
}
}else{
if(_a71.indexOf("FAILED")!=-1||_a71.indexOf("Exception")!=-1){
this.commitReport("WFS Transaction: FAILED",_a71);
}
}
},commitFailure:function(_a73){
},commitReport:function(_a74,_a75){
alert(_a74);
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
OpenLayers.Layer.WMS=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{service:"WMS",version:"1.1.1",request:"GetMap",styles:"",exceptions:"application/vnd.ogc.se_inimage",format:"image/jpeg"},reproject:false,isBaseLayer:true,encodeBBOX:false,initialize:function(name,url,_a78,_a79){
var _a7a=[];
_a78=OpenLayers.Util.upperCaseObject(_a78);
_a7a.push(name,url,_a78,_a79);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_a7a);
OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
if(this.params.TRANSPARENT&&this.params.TRANSPARENT.toString().toLowerCase()=="true"){
if((_a79==null)||(!_a79.isBaseLayer)){
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
},getURL:function(_a7c){
_a7c=this.adjustBounds(_a7c);
var _a7d=this.getImageSize();
return this.getFullRequestString({BBOX:this.encodeBBOX?_a7c.toBBOX():_a7c.toArray(),WIDTH:_a7d.w,HEIGHT:_a7d.h});
},addTile:function(_a7e,_a7f){
return new OpenLayers.Tile.Image(this,_a7f,_a7e,null,this.tileSize);
},mergeNewParams:function(_a80){
var _a81=OpenLayers.Util.upperCaseObject(_a80);
var _a82=[_a81];
OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,_a82);
},getFullRequestString:function(_a83){
var _a84=this.map.getProjection();
this.params.SRS=(_a84=="none")?null:_a84;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Layer.WMS"});
OpenLayers.Layer.WorldWind=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{},isBaseLayer:true,lzd:null,zoomLevels:null,initialize:function(name,url,lzd,_a88,_a89,_a8a){
this.lzd=lzd;
this.zoomLevels=_a88;
var _a8b=[];
_a8b.push(name,url,_a89,_a8a);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_a8b);
this.params=(_a89?_a89:{});
if(_a89){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},addTile:function(_a8c,_a8d){
return new OpenLayers.Tile.Image(this,_a8d,_a8c,null,this.tileSize);
},getZoom:function(){
var zoom=this.map.getZoom();
var _a8f=this.map.getMaxExtent();
zoom=zoom-Math.log(this.maxResolution/(this.lzd/512))/Math.log(2);
return zoom;
},getURL:function(_a90){
_a90=this.adjustBounds(_a90);
var zoom=this.getZoom();
var _a92=this.map.getMaxExtent();
var deg=this.lzd/Math.pow(2,this.getZoom());
var x=Math.floor((_a90.left-_a92.left)/deg);
var y=Math.floor((_a90.bottom-_a92.bottom)/deg);
if(this.map.getResolution()<=(this.lzd/512)&&this.getZoom()<=this.zoomLevels){
return this.getFullRequestString({L:zoom,X:x,Y:y});
}else{
return OpenLayers.Util.getImagesLocation()+"blank.gif";
}
},CLASS_NAME:"OpenLayers.Layer.WorldWind"});
OpenLayers.Control.NavToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(_a96){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_a96]);
this.addControls([new OpenLayers.Control.Navigation(),new OpenLayers.Control.ZoomBox()]);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.NavToolbar"});
OpenLayers.Format.WFS=OpenLayers.Class(OpenLayers.Format.GML,{layer:null,wfsns:"http://www.opengis.net/wfs",initialize:function(_a98,_a99){
OpenLayers.Format.GML.prototype.initialize.apply(this,[_a98]);
this.layer=_a99;
if(this.layer.featureNS){
this.featureNS=this.layer.featureNS;
}
if(this.layer.options.geometry_column){
this.geometryName=this.layer.options.geometry_column;
}
if(this.layer.options.typename){
this.featureName=this.layer.options.typename;
}
},write:function(_a9a){
var _a9b=document.createElementNS("http://www.opengis.net/wfs","wfs:Transaction");
_a9b.setAttribute("version","1.0.0");
_a9b.setAttribute("service","WFS");
for(var i=0;i<_a9a.length;i++){
switch(_a9a[i].state){
case OpenLayers.State.INSERT:
_a9b.appendChild(this.insert(_a9a[i]));
break;
case OpenLayers.State.UPDATE:
_a9b.appendChild(this.update(_a9a[i]));
break;
case OpenLayers.State.DELETE:
_a9b.appendChild(this.remove(_a9a[i]));
break;
}
}
return _a9b;
},createFeatureXML:function(_a9d){
var _a9e=this.buildGeometryNode(_a9d.geometry);
var _a9f=document.createElementNS(this.featureNS,"feature:"+this.geometryName);
_a9f.appendChild(_a9e);
var _aa0=document.createElementNS(this.featureNS,"feature:"+this.featureName);
_aa0.appendChild(_a9f);
for(var attr in _a9d.attributes){
var _aa2=document.createTextNode(_a9d.attributes[attr]);
var _aa3=attr;
if(attr.search(":")!=-1){
_aa3=attr.split(":")[1];
}
var _aa4=document.createElementNS(this.featureNS,"feature:"+_aa3);
_aa4.appendChild(_aa2);
_aa0.appendChild(_aa4);
}
return _aa0;
},insert:function(_aa5){
var _aa6=document.createElementNS(this.wfsns,"wfs:Insert");
_aa6.appendChild(this.createFeatureXML(_aa5));
return _aa6;
},update:function(_aa7){
if(!_aa7.fid){
alert("Can't update a feature for which there is no FID.");
}
var _aa8=document.createElementNS(this.wfsns,"wfs:Update");
_aa8.setAttribute("typeName",this.layerName);
var _aa9=document.createElementNS(this.wfsns,"wfs:Property");
var _aaa=document.createElementNS("http://www.opengis.net/wfs","wfs:Name");
var _aab=document.createTextNode(this.geometryName);
_aaa.appendChild(_aab);
_aa9.appendChild(_aaa);
var _aac=document.createElementNS("http://www.opengis.net/wfs","wfs:Value");
_aac.appendChild(this.buildGeometryNode(_aa7.geometry));
_aa9.appendChild(_aac);
_aa8.appendChild(_aa9);
var _aad=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _aae=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_aae.setAttribute("fid",_aa7.fid);
_aad.appendChild(_aae);
_aa8.appendChild(_aad);
return _aa8;
},remove:function(_aaf){
if(!_aaf.attributes.fid){
alert("Can't update a feature for which there is no FID.");
return false;
}
var _ab0=document.createElementNS(this.featureNS,"wfs:Delete");
_ab0.setAttribute("typeName",this.layerName);
var _ab1=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _ab2=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_ab2.setAttribute("fid",_aaf.attributes.fid);
_ab1.appendChild(_ab2);
_ab0.appendChild(_ab1);
return _ab0;
},destroy:function(){
this.layer=null;
},CLASS_NAME:"OpenLayers.Format.WFS"});
OpenLayers.Geometry.MultiLineString=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LineString"],initialize:function(_ab3){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiLineString"});
OpenLayers.Geometry.MultiPoint=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_ab4){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},addPoint:function(_ab5,_ab6){
this.addComponent(_ab5,_ab6);
},removePoint:function(_ab7){
this.removeComponent(_ab7);
},CLASS_NAME:"OpenLayers.Geometry.MultiPoint"});
OpenLayers.Geometry.MultiPolygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Polygon"],initialize:function(_ab8){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiPolygon"});
OpenLayers.Geometry.Polygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LinearRing"],initialize:function(_ab9){
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
OpenLayers.Geometry.Polygon.createRegularPolygon=function(_abc,_abd,_abe,_abf){
var _ac0=Math.PI*((1/_abe)-(1/2));
if(_abf){
_ac0+=(_abf/180)*Math.PI;
}
var _ac1,x,y;
var _ac2=[];
for(var i=0;i<_abe;++i){
rotatedAngle=_ac0+(i*2*Math.PI/_abe);
x=_abc.x+(_abd*Math.cos(rotatedAngle));
y=_abc.y+(_abd*Math.sin(rotatedAngle));
_ac2.push(new OpenLayers.Geometry.Point(x,y));
}
var ring=new OpenLayers.Geometry.LinearRing(_ac2);
return new OpenLayers.Geometry.Polygon([ring]);
};
OpenLayers.Handler.Point=OpenLayers.Class(OpenLayers.Handler,{point:null,layer:null,drawing:false,mouseDown:false,lastDown:null,lastUp:null,initialize:function(_ac5,_ac6,_ac7){
this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},activate:function(){
if(!OpenLayers.Handler.prototype.activate.apply(this,arguments)){
return false;
}
var _ac8={displayInLayerSwitcher:false};
this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,_ac8);
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
var _acb=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_acb.lon;
this.point.geometry.y=_acb.lat;
this.drawFeature();
return false;
},mousemove:function(evt){
if(this.drawing){
var _acd=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_acd.lon;
this.point.geometry.y=_acd.lat;
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
OpenLayers.Layer.MapServer.Untiled=OpenLayers.Class(OpenLayers.Layer.MapServer,{singleTile:true,initialize:function(name,url,_ad1,_ad2){
OpenLayers.Layer.MapServer.prototype.initialize.apply(this,arguments);
var msg="The OpenLayers.Layer.MapServer.Untiled class is deprecated and "+"will be removed in 3.0. Instead, you should use the "+"normal OpenLayers.Layer.MapServer class, passing it the option "+"'singleTile' as true.";
OpenLayers.Console.warn(msg);
},CLASS_NAME:"OpenLayers.Layer.MapServer.Untiled"});
OpenLayers.Layer.WMS.Untiled=OpenLayers.Class(OpenLayers.Layer.WMS,{singleTile:true,initialize:function(name,url,_ad6,_ad7){
OpenLayers.Layer.WMS.prototype.initialize.apply(this,arguments);
var msg="The OpenLayers.Layer.WMS.Untiled class is deprecated and "+"will be removed in 3.0. Instead, you should use the "+"normal OpenLayers.Layer.WMS class, passing it the option "+"'singleTile' as true.";
OpenLayers.Console.warn(msg);
},CLASS_NAME:"OpenLayers.Layer.WMS.Untiled"});
OpenLayers.Geometry.Curve=OpenLayers.Class(OpenLayers.Geometry.MultiPoint,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_ad9){
OpenLayers.Geometry.MultiPoint.prototype.initialize.apply(this,arguments);
},getLength:function(){
var _ada=0;
if(this.components&&(this.components.length>1)){
for(var i=1;i<this.components.length;i++){
_ada+=this.components[i-1].distanceTo(this.components[i]);
}
}
return _ada;
},CLASS_NAME:"OpenLayers.Geometry.Curve"});
OpenLayers.Geometry.LineString=OpenLayers.Class(OpenLayers.Geometry.Curve,{initialize:function(_adc){
OpenLayers.Geometry.Curve.prototype.initialize.apply(this,arguments);
},removeComponent:function(_add){
if(this.components&&(this.components.length>2)){
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
}
},CLASS_NAME:"OpenLayers.Geometry.LineString"});
OpenLayers.Geometry.LinearRing=OpenLayers.Class(OpenLayers.Geometry.LineString,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_ade){
OpenLayers.Geometry.LineString.prototype.initialize.apply(this,arguments);
},addComponent:function(_adf,_ae0){
var _ae1=false;
var _ae2=this.components.pop();
if(_ae0!=null||!_adf.equals(_ae2)){
_ae1=OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,arguments);
}
var _ae3=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_ae3]);
return _ae1;
},removeComponent:function(_ae4){
if(this.components.length>4){
this.components.pop();
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
var _ae5=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_ae5]);
}
},move:function(x,y){
for(var i=0;i<this.components.length-1;i++){
this.components[i].move(x,y);
}
},rotate:function(_ae9,_aea){
for(var i=0;i<this.components.length-1;++i){
this.components[i].rotate(_ae9,_aea);
}
},resize:function(_aec,_aed){
for(var i=0;i<this.components.length-1;++i){
this.components[i].resize(_aec,_aed);
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
OpenLayers.Handler.Path=OpenLayers.Class(OpenLayers.Handler.Point,{line:null,freehand:false,freehandToggle:"shiftKey",initialize:function(_af4,_af5,_af6){
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
var _af8=this.line.geometry.components.length-1;
this.line.geometry.components[_af8].x=this.point.geometry.x;
this.line.geometry.components[_af8].y=this.point.geometry.y;
this.line.geometry.components[_af8].clearBounds();
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
var _afa=this.control.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_afa.lon;
this.point.geometry.y=_afa.lat;
if((this.lastUp==null)||!this.lastUp.equals(evt.xy)){
this.addPoint();
}
this.drawFeature();
this.drawing=true;
return false;
},mousemove:function(evt){
if(this.drawing){
var _afc=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_afc.lon;
this.point.geometry.y=_afc.lat;
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
var _aff=this.line.geometry.components.length-1;
this.line.geometry.removeComponent(this.line.geometry.components[_aff]);
this.finalize();
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Path"});
OpenLayers.Handler.Polygon=OpenLayers.Class(OpenLayers.Handler.Path,{polygon:null,initialize:function(_b00,_b01,_b02){
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
var _b03=this.line.geometry.components.length-2;
this.line.geometry.components[_b03].x=this.point.geometry.x;
this.line.geometry.components[_b03].y=this.point.geometry.y;
this.line.geometry.components[_b03].clearBounds();
},drawFeature:function(){
this.layer.drawFeature(this.polygon,this.style);
this.layer.drawFeature(this.point,this.style);
},geometryClone:function(){
return this.polygon.geometry.clone();
},dblclick:function(evt){
if(!this.freehandMode(evt)){
var _b05=this.line.geometry.components.length-2;
this.line.geometry.removeComponent(this.line.geometry.components[_b05]);
this.finalize();
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Polygon"});
OpenLayers.Control.EditingToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(_b06,_b07){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_b07]);
this.addControls([new OpenLayers.Control.Navigation()]);
var _b08=[new OpenLayers.Control.DrawFeature(_b06,OpenLayers.Handler.Point,{"displayClass":"olControlDrawFeaturePoint"}),new OpenLayers.Control.DrawFeature(_b06,OpenLayers.Handler.Path,{"displayClass":"olControlDrawFeaturePath"}),new OpenLayers.Control.DrawFeature(_b06,OpenLayers.Handler.Polygon,{"displayClass":"olControlDrawFeaturePolygon"})];
for(var i=0;i<_b08.length;i++){
_b08[i].featureAdded=function(_b0a){
_b0a.state=OpenLayers.State.INSERT;
};
}
this.addControls(_b08);
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
this.clearWidget=function(_c){
var _d=document.getElementById(_c.outputNodeId);
var _e=_c.getNode();
if(_e&&_d){
_e.removeChild(_d);
}
};
this.model.addListener("newModel",this.clearWidget,this);
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

