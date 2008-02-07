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
this.orderedScripts=new Array();
this.scriptLoader=null;
this.scriptsTimer=null;
this.checkScriptsLoaded=function(){
if(document.readyState!=null){
while(this.loadingScripts.length>0&&(this.loadingScripts[0].readyState=="loaded"||this.loadingScripts[0].readyState=="complete"||this.loadingScripts[0].readyState==null)){
this.loadingScripts.shift();
}
if(this.loadingScripts.length==0&&this.orderedScripts.length==0){
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
this.loadOrdered=true;
this.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
this.loadScript(baseDir+"/util/sarissa/Sarissa.js");
this.loadScript(baseDir+"/util/sarissa/javeline_xpath.js");
this.loadScript(baseDir+"/util/sarissa/javeline_xslt.js");
this.loadScript(baseDir+"/util/sarissa/sarissa_dhtml.js");
this.loadScript(baseDir+"/util/sarissa/sarissa_ieemu_xpath.js");
this.loadScript(baseDir+"/util/proj4js/proj4js-compressed.js");
this.loadScript(baseDir+"/util/Util.js");
this.loadScript(baseDir+"/util/Listener.js");
this.loadScript(baseDir+"/model/ModelBase.js");
this.loadScript(baseDir+"/model/Config.js");
this.loadOrdered=false;
break;
case MB_LOAD_CONFIG:
if(document.readyState){
config=new Config(mbConfigUrl);
config.loadConfigScripts();
}else{
this.setLoadState(MB_LOADED);
}
break;
case MB_LOADED:
window.clearInterval(this.scriptsTimer);
break;
}
};
this.loadScript=function(_2){
if(typeof MapBuilder_Release=="boolean"){
if(_2.indexOf(baseDir+"/util/")!=-1){
return;
}
var _3=_2.split("/");
var _4=_3[_3.length-1].replace(/.js$/,"");
if(typeof window[_4]=="function"){
return;
}
}
if(!document.getElementById(_2)){
var _5=document.createElement("script");
_5.src=_2;
_5.id=_2;
_5.defer=false;
_5.type="text/javascript";
if(document.readyState&&this.loadOrdered==true){
this.orderedScripts.push(_5);
if(!this.scriptLoader){
this.scriptLoader=window.setInterval("mapbuilder.loadNextScript()",50);
}
}else{
document.getElementsByTagName("head")[0].appendChild(_5);
}
this.loadingScripts.push(_5);
}
};
this.loadNextScript=function(){
if(this.orderedScripts.length==0){
window.clearInterval(this.scriptLoader);
this.scriptLoader=null;
}else{
var _6=this.orderedScripts[0];
if(!_6.loading){
_6.loading=true;
this.doLoadScript(_6);
}
}
};
this.doLoadScript=function(_7){
var _8=this;
_7.onreadystatechange=function(){
_8.checkScriptState(this);
};
document.getElementsByTagName("head")[0].appendChild(_7);
};
this.checkScriptState=function(_9){
if(_9.readyState=="loaded"||_9.readyState=="complete"){
for(var i=0;i<this.orderedScripts.length;i++){
if(_9==this.orderedScripts[i]){
this.orderedScripts.splice(i,1);
break;
}
}
}
};
this.loadScriptsFromXpath=function(_b,_c){
for(var i=0;i<_b.length;i++){
if(_b[i].selectSingleNode("mb:scriptFile")==null){
scriptFile=baseDir+"/"+_c+_b[i].nodeName+".js";
this.loadScript(scriptFile);
}
}
};
var _e=document.getElementsByTagName("head")[0];
var _f=_e.childNodes;
for(var i=0;i<_f.length;++i){
var src=_f.item(i).src;
if(src){
var _12=src.indexOf("/Mapbuilder.js");
if(_12>=0){
baseDir=src.substring(0,_12);
}else{
_12=src.indexOf("/MapbuilderCompressed.js");
if(_12>=0){
baseDir=src.substring(0,_12);
}
}
}
}
this.setLoadState(MB_LOAD_CORE);
this.scriptsTimer=window.setInterval("mapbuilder.checkScriptsLoaded()",100);
}
function checkIESecurity(){
var _13=["Msxml2.DOMDocument.5.0","Msxml2.DOMDocument.4.0","Msxml2.DOMDocument.3.0","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"];
var _14=false;
for(var i=0;i<_13.length&&!_14;i++){
try{
var _16=new ActiveXObject(_13[i]);
_14=true;
}
catch(e){
}
}
if(!_14){
window.open("/mapbuilder/docs/help/IESetup.html");
}
}
if(navigator.userAgent.toLowerCase().indexOf("msie")>-1){
checkIESecurity();
}
var mapbuilder=new Mapbuilder();
function mapbuilderInit(){
if(mapbuilder&&mapbuilder.loadState==MB_LOADED){
window.clearInterval(mbTimerId);
config.parseConfig(config);
if(Proj4js){
Proj4js.libPath=baseDir+"/util/proj4js/";
Proj4js.proxyScript=config.proxyUrl+"?url=";
}
config.callListeners("init");
var _17=new Date();
if(window.mbInit){
window.mbInit();
}
config.callListeners("loadModel");
}
}
var mbTimerId;
function mbDoLoad(_18){
mbTimerId=window.setInterval("mapbuilderInit()",100);
if(_18){
window.mbInit=_18;
}
}

var OpenLayers={singleFile:true};
(function(){
var _1=(typeof OpenLayers=="object"&&OpenLayers.singleFile);
window.OpenLayers={_scriptName:(!_1)?"lib/OpenLayers.js":"OpenLayers.js",_getScriptLocation:function(){
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
var _8=new Array("OpenLayers/Util.js","OpenLayers/BaseTypes.js","OpenLayers/BaseTypes/Class.js","OpenLayers/BaseTypes/Bounds.js","OpenLayers/BaseTypes/Element.js","OpenLayers/BaseTypes/LonLat.js","OpenLayers/BaseTypes/Pixel.js","OpenLayers/BaseTypes/Size.js","OpenLayers/Console.js","Rico/Corner.js","Rico/Color.js","OpenLayers/Ajax.js","OpenLayers/Events.js","OpenLayers/Projection.js","OpenLayers/Map.js","OpenLayers/Layer.js","OpenLayers/Icon.js","OpenLayers/Marker.js","OpenLayers/Marker/Box.js","OpenLayers/Popup.js","OpenLayers/Tile.js","OpenLayers/Tile/Image.js","OpenLayers/Tile/WFS.js","OpenLayers/Layer/Image.js","OpenLayers/Layer/SphericalMercator.js","OpenLayers/Layer/EventPane.js","OpenLayers/Layer/FixedZoomLevels.js","OpenLayers/Layer/Google.js","OpenLayers/Layer/VirtualEarth.js","OpenLayers/Layer/Yahoo.js","OpenLayers/Layer/HTTPRequest.js","OpenLayers/Layer/Grid.js","OpenLayers/Layer/MapServer.js","OpenLayers/Layer/MapServer/Untiled.js","OpenLayers/Layer/KaMap.js","OpenLayers/Layer/MultiMap.js","OpenLayers/Layer/Markers.js","OpenLayers/Layer/Text.js","OpenLayers/Layer/WorldWind.js","OpenLayers/Layer/WMS.js","OpenLayers/Layer/WMS/Untiled.js","OpenLayers/Layer/GeoRSS.js","OpenLayers/Layer/Boxes.js","OpenLayers/Layer/TMS.js","OpenLayers/Layer/TileCache.js","OpenLayers/Popup/Anchored.js","OpenLayers/Popup/AnchoredBubble.js","OpenLayers/Feature.js","OpenLayers/Feature/Vector.js","OpenLayers/Feature/WFS.js","OpenLayers/Handler.js","OpenLayers/Handler/Click.js","OpenLayers/Handler/Point.js","OpenLayers/Handler/Path.js","OpenLayers/Handler/Polygon.js","OpenLayers/Handler/Feature.js","OpenLayers/Handler/Drag.js","OpenLayers/Handler/RegularPolygon.js","OpenLayers/Handler/Box.js","OpenLayers/Handler/MouseWheel.js","OpenLayers/Handler/Keyboard.js","OpenLayers/Control.js","OpenLayers/Control/Attribution.js","OpenLayers/Control/ZoomBox.js","OpenLayers/Control/ZoomToMaxExtent.js","OpenLayers/Control/DragPan.js","OpenLayers/Control/Navigation.js","OpenLayers/Control/MouseDefaults.js","OpenLayers/Control/MousePosition.js","OpenLayers/Control/OverviewMap.js","OpenLayers/Control/KeyboardDefaults.js","OpenLayers/Control/PanZoom.js","OpenLayers/Control/PanZoomBar.js","OpenLayers/Control/ArgParser.js","OpenLayers/Control/Permalink.js","OpenLayers/Control/Scale.js","OpenLayers/Control/LayerSwitcher.js","OpenLayers/Control/DrawFeature.js","OpenLayers/Control/DragFeature.js","OpenLayers/Control/ModifyFeature.js","OpenLayers/Control/Panel.js","OpenLayers/Control/SelectFeature.js","OpenLayers/Geometry.js","OpenLayers/Geometry/Rectangle.js","OpenLayers/Geometry/Collection.js","OpenLayers/Geometry/Point.js","OpenLayers/Geometry/MultiPoint.js","OpenLayers/Geometry/Curve.js","OpenLayers/Geometry/LineString.js","OpenLayers/Geometry/LinearRing.js","OpenLayers/Geometry/Polygon.js","OpenLayers/Geometry/MultiLineString.js","OpenLayers/Geometry/MultiPolygon.js","OpenLayers/Geometry/Surface.js","OpenLayers/Renderer.js","OpenLayers/Renderer/Elements.js","OpenLayers/Renderer/SVG.js","OpenLayers/Renderer/VML.js","OpenLayers/Layer/Vector.js","OpenLayers/Layer/GML.js","OpenLayers/Style.js","OpenLayers/Rule.js","OpenLayers/Rule/FeatureId.js","OpenLayers/Rule/Logical.js","OpenLayers/Rule/Comparison.js","OpenLayers/Format.js","OpenLayers/Format/XML.js","OpenLayers/Format/GML.js","OpenLayers/Format/KML.js","OpenLayers/Format/GeoRSS.js","OpenLayers/Format/WFS.js","OpenLayers/Format/WKT.js","OpenLayers/Format/SLD.js","OpenLayers/Format/Text.js","OpenLayers/Format/JSON.js","OpenLayers/Format/GeoJSON.js","OpenLayers/Layer/WFS.js","OpenLayers/Control/MouseToolbar.js","OpenLayers/Control/NavToolbar.js","OpenLayers/Control/EditingToolbar.js");
var _9=navigator.userAgent;
var _a=(_9.match("MSIE")||_9.match("Safari"));
if(_a){
var _b=new Array(_8.length);
}
var _c=OpenLayers._getScriptLocation()+"lib/";
for(var i=0;i<_8.length;i++){
if(_a){
_b[i]="<script src='"+_c+_8[i]+"'></script>";
}else{
var s=document.createElement("script");
s.src=_c+_8[i];
var h=document.getElementsByTagName("head").length?document.getElementsByTagName("head")[0]:document.body;
h.appendChild(s);
}
}
if(_a){
document.write(_b.join(""));
}
}
})();
OpenLayers.VERSION_NUMBER="$Revision$";
OpenLayers.String={startsWith:function(str,sub){
return (str.indexOf(sub)==0);
},contains:function(str,sub){
return (str.indexOf(sub)!=-1);
},trim:function(str){
return str.replace(/^\s*(.*?)\s*$/,"$1");
},camelize:function(str){
var _16=str.split("-");
var _17=_16[0];
for(var i=1;i<_16.length;i++){
var s=_16[i];
_17+=s.charAt(0).toUpperCase()+s.substring(1);
}
return _17;
},format:function(_1a,_1b){
if(!_1b){
_1b=window;
}
var _1c=_1a.split("${");
var _1d,last;
for(var i=1;i<_1c.length;i++){
_1d=_1c[i];
last=_1d.indexOf("}");
if(last>0){
_1c[i]=_1b[_1d.substring(0,last)]+_1d.substring(++last);
}else{
_1c[i]="${"+_1d;
}
}
return _1c.join("");
}};
if(!String.prototype.startsWith){
String.prototype.startsWith=function(_1f){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.String.startsWith instead");
return OpenLayers.String.startsWith(this,_1f);
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
OpenLayers.Number={decimalSeparator:".",thousandsSeparator:",",limitSigDigs:function(num,sig){
var fig=0;
if(sig>0){
fig=parseFloat(num.toPrecision(sig));
}
return fig;
},format:function(num,dec,_26,_27){
dec=(typeof dec!="undefined")?dec:0;
_26=(typeof _26!="undefined")?_26:OpenLayers.Number.thousandsSeparator;
_27=(typeof _27!="undefined")?_27:OpenLayers.Number.decimalSeparator;
if(dec!=null){
num=parseFloat(num.toFixed(dec));
}
var _28=num.toString().split(".");
if(_28.length==1&&dec==null){
dec=0;
}
var _29=_28[0];
if(_26){
var _2a=/(-?[0-9]+)([0-9]{3})/;
while(_2a.test(_29)){
_29=_29.replace(_2a,"$1"+_26+"$2");
}
}
var str;
if(dec==0){
str=_29;
}else{
var rem=_28.length>1?_28[1]:"0";
if(dec!=null){
rem=rem+new Array(dec-rem.length+1).join("0");
}
str=_29+_27+rem;
}
return str;
}};
if(!Number.prototype.limitSigDigs){
Number.prototype.limitSigDigs=function(sig){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.Number.limitSigDigs instead");
return OpenLayers.Number.limitSigDigs(this,sig);
};
}
OpenLayers.Function={bind:function(_2e,_2f){
var _30=Array.prototype.slice.apply(arguments,[2]);
return function(){
var _31=_30.concat(Array.prototype.slice.apply(arguments,[0]));
return _2e.apply(_2f,_31);
};
},bindAsEventListener:function(_32,_33){
return function(_34){
return _32.call(_33,_34||window.event);
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
Function.prototype.bindAsEventListener=function(_35){
OpenLayers.Console.warn("This method has been deprecated and will be removed in 3.0. "+"Please use OpenLayers.Function.bindAsEventListener instead");
return OpenLayers.Function.bindAsEventListener(this,_35);
};
}
OpenLayers.Array={filter:function(_36,_37,_38){
var _39=[];
if(Array.prototype.filter){
_39=_36.filter(_37,_38);
}else{
var len=_36.length;
if(typeof _37!="function"){
throw new TypeError();
}
for(var i=0;i<len;i++){
if(i in _36){
var val=_36[i];
if(_37.call(_38,val,i,_36)){
_39.push(val);
}
}
}
}
return _39;
}};
OpenLayers.Class=function(){
var _3d=function(){
if(arguments&&arguments[0]!=OpenLayers.Class.isPrototype){
this.initialize.apply(this,arguments);
}
};
var _3e={};
var _3f;
for(var i=0;i<arguments.length;++i){
if(typeof arguments[i]=="function"){
_3f=arguments[i].prototype;
}else{
_3f=arguments[i];
}
OpenLayers.Util.extend(_3e,_3f);
}
_3d.prototype=_3e;
return _3d;
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
var _41=arguments[0];
var _42=new _41(OpenLayers.Class.isPrototype);
for(var i=1;i<arguments.length;i++){
if(typeof arguments[i]=="function"){
var _44=arguments[i];
arguments[i]=new _44(OpenLayers.Class.isPrototype);
}
OpenLayers.Util.extend(_42,arguments[i]);
}
return _42;
};
OpenLayers.Util={};
OpenLayers.Util.getElement=function(){
var _45=[];
for(var i=0;i<arguments.length;i++){
var _47=arguments[i];
if(typeof _47=="string"){
_47=document.getElementById(_47);
}
if(arguments.length==1){
return _47;
}
_45.push(_47);
}
return _45;
};
if($==null){
var $=OpenLayers.Util.getElement;
}
OpenLayers.Util.extend=function(_48,_49){
if(_48&&_49){
for(var _4a in _49){
var _4b=_49[_4a];
if(_4b!==undefined){
_48[_4a]=_4b;
}
}
if(_49.hasOwnProperty&&_49.hasOwnProperty("toString")){
_48.toString=_49.toString;
}
}
return _48;
};
OpenLayers.Util.removeItem=function(_4c,_4d){
for(var i=_4c.length-1;i>=0;i--){
if(_4c[i]==_4d){
_4c.splice(i,1);
}
}
return _4c;
};
OpenLayers.Util.clearArray=function(_4f){
var msg="OpenLayers.Util.clearArray() is Deprecated."+" Please use 'array.length = 0' instead.";
OpenLayers.Console.warn(msg);
_4f.length=0;
};
OpenLayers.Util.indexOf=function(_51,obj){
for(var i=0;i<_51.length;i++){
if(_51[i]==obj){
return i;
}
}
return -1;
};
OpenLayers.Util.modifyDOMElement=function(_54,id,px,sz,_58,_59,_5a,_5b){
if(id){
_54.id=id;
}
if(px){
_54.style.left=px.x+"px";
_54.style.top=px.y+"px";
}
if(sz){
_54.style.width=sz.w+"px";
_54.style.height=sz.h+"px";
}
if(_58){
_54.style.position=_58;
}
if(_59){
_54.style.border=_59;
}
if(_5a){
_54.style.overflow=_5a;
}
if(parseFloat(_5b)>=0&&parseFloat(_5b)<1){
_54.style.filter="alpha(opacity="+(_5b*100)+")";
_54.style.opacity=_5b;
}else{
if(parseFloat(_5b)==1){
_54.style.filter="";
_54.style.opacity="";
}
}
};
OpenLayers.Util.createDiv=function(id,px,sz,_5f,_60,_61,_62,_63){
var dom=document.createElement("div");
if(_5f){
dom.style.backgroundImage="url("+_5f+")";
}
if(!id){
id=OpenLayers.Util.createUniqueID("OpenLayersDiv");
}
if(!_60){
_60="absolute";
}
OpenLayers.Util.modifyDOMElement(dom,id,px,sz,_60,_61,_62,_63);
return dom;
};
OpenLayers.Util.createImage=function(id,px,sz,_68,_69,_6a,_6b,_6c){
var _6d=document.createElement("img");
if(!id){
id=OpenLayers.Util.createUniqueID("OpenLayersDiv");
}
if(!_69){
_69="relative";
}
OpenLayers.Util.modifyDOMElement(_6d,id,px,sz,_69,_6a,null,_6b);
if(_6c){
_6d.style.display="none";
OpenLayers.Event.observe(_6d,"load",OpenLayers.Function.bind(OpenLayers.Util.onImageLoad,_6d));
OpenLayers.Event.observe(_6d,"error",OpenLayers.Function.bind(OpenLayers.Util.onImageLoadError,_6d));
}
_6d.style.alt=id;
_6d.galleryImg="no";
if(_68){
_6d.src=_68;
}
return _6d;
};
OpenLayers.Util.setOpacity=function(_6e,_6f){
OpenLayers.Util.modifyDOMElement(_6e,null,null,null,null,null,null,_6f);
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
var _70=navigator.appVersion.split("MSIE");
var _71=parseFloat(_70[1]);
var _72=false;
try{
_72=!!(document.body.filters);
}
catch(e){
}
return (_72&&(_71>=5.5)&&(_71<7));
};
OpenLayers.Util.modifyAlphaImageDiv=function(div,id,px,sz,_77,_78,_79,_7a,_7b){
OpenLayers.Util.modifyDOMElement(div,id,px,sz,null,null,null,_7b);
var img=div.childNodes[0];
if(_77){
img.src=_77;
}
OpenLayers.Util.modifyDOMElement(img,div.id+"_innerImage",null,sz,"relative",_79);
if(OpenLayers.Util.alphaHack()){
div.style.display="inline-block";
if(_7a==null){
_7a="scale";
}
div.style.filter="progid:DXImageTransform.Microsoft"+".AlphaImageLoader(src='"+img.src+"', "+"sizingMethod='"+_7a+"')";
if(parseFloat(div.style.opacity)>=0&&parseFloat(div.style.opacity)<1){
div.style.filter+=" alpha(opacity="+div.style.opacity*100+")";
}
img.style.filter="alpha(opacity=0)";
}
};
OpenLayers.Util.createAlphaImageDiv=function(id,px,sz,_80,_81,_82,_83,_84,_85){
var div=OpenLayers.Util.createDiv();
var img=OpenLayers.Util.createImage(null,null,null,null,null,null,null,false);
div.appendChild(img);
if(_85){
img.style.display="none";
OpenLayers.Event.observe(img,"load",OpenLayers.Function.bind(OpenLayers.Util.onImageLoad,div));
OpenLayers.Event.observe(img,"error",OpenLayers.Function.bind(OpenLayers.Util.onImageLoadError,div));
}
OpenLayers.Util.modifyAlphaImageDiv(div,id,px,sz,_80,_81,_82,_83,_84);
return div;
};
OpenLayers.Util.upperCaseObject=function(_88){
var _89={};
for(var key in _88){
_89[key.toUpperCase()]=_88[key];
}
return _89;
};
OpenLayers.Util.applyDefaults=function(to,_8c){
for(var key in _8c){
if(to[key]===undefined||(_8c.hasOwnProperty&&_8c.hasOwnProperty(key)&&!to.hasOwnProperty(key))){
to[key]=_8c[key];
}
}
if(_8c.hasOwnProperty&&_8c.hasOwnProperty("toString")&&!to.hasOwnProperty("toString")){
to.toString=_8c.toString;
}
return to;
};
OpenLayers.Util.getParameterString=function(_8e){
var _8f=[];
for(var key in _8e){
var _91=_8e[key];
if((_91!=null)&&(typeof _91!="function")){
var _92;
if(typeof _91=="object"&&_91.constructor==Array){
var _93=[];
for(var _94=0;_94<_91.length;_94++){
_93.push(encodeURIComponent(_91[_94]));
}
_92=_93.join(",");
}else{
_92=encodeURIComponent(_91);
}
_8f.push(encodeURIComponent(key)+"="+_92);
}
}
return _8f.join("&");
};
OpenLayers.ImgPath="";
OpenLayers.Util.getImagesLocation=function(){
return OpenLayers.ImgPath||(OpenLayers._getScriptLocation()+"img/");
};
OpenLayers.Util.Try=function(){
var _95=null;
for(var i=0;i<arguments.length;i++){
var _97=arguments[i];
try{
_95=_97();
break;
}
catch(e){
}
}
return _95;
};
OpenLayers.Util.getNodes=function(p,_99){
var _9a=OpenLayers.Util.Try(function(){
return OpenLayers.Util._getNodes(p.documentElement.childNodes,_99);
},function(){
return OpenLayers.Util._getNodes(p.childNodes,_99);
});
return _9a;
};
OpenLayers.Util._getNodes=function(_9b,_9c){
var _9d=[];
for(var i=0;i<_9b.length;i++){
if(_9b[i].nodeName==_9c){
_9d.push(_9b[i]);
}
}
return _9d;
};
OpenLayers.Util.getTagText=function(_9f,_a0,_a1){
var _a2=OpenLayers.Util.getNodes(_9f,_a0);
if(_a2&&(_a2.length>0)){
if(!_a1){
_a1=0;
}
if(_a2[_a1].childNodes.length>1){
return _a2.childNodes[1].nodeValue;
}else{
if(_a2[_a1].childNodes.length==1){
return _a2[_a1].firstChild.nodeValue;
}
}
}else{
return "";
}
};
OpenLayers.Util.getXmlNodeValue=function(_a3){
var val=null;
OpenLayers.Util.Try(function(){
val=_a3.text;
if(!val){
val=_a3.textContent;
}
if(!val){
val=_a3.firstChild.nodeValue;
}
},function(){
val=_a3.textContent;
});
return val;
};
OpenLayers.Util.mouseLeft=function(evt,div){
var _a7=(evt.relatedTarget)?evt.relatedTarget:evt.toElement;
while(_a7!=div&&_a7!=null){
_a7=_a7.parentNode;
}
return (_a7!=div);
};
OpenLayers.Util.rad=function(x){
return x*Math.PI/180;
};
OpenLayers.Util.distVincenty=function(p1,p2){
var a=6378137,b=6356752.3142,f=1/298.257223563;
var L=OpenLayers.Util.rad(p2.lon-p1.lon);
var U1=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p1.lat)));
var U2=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p2.lat)));
var _af=Math.sin(U1),cosU1=Math.cos(U1);
var _b0=Math.sin(U2),cosU2=Math.cos(U2);
var _b1=L,lambdaP=2*Math.PI;
var _b2=20;
while(Math.abs(_b1-lambdaP)>1e-12&&--_b2>0){
var _b3=Math.sin(_b1),cosLambda=Math.cos(_b1);
var _b4=Math.sqrt((cosU2*_b3)*(cosU2*_b3)+(cosU1*_b0-_af*cosU2*cosLambda)*(cosU1*_b0-_af*cosU2*cosLambda));
if(_b4==0){
return 0;
}
var _b5=_af*_b0+cosU1*cosU2*cosLambda;
var _b6=Math.atan2(_b4,_b5);
var _b7=Math.asin(cosU1*cosU2*_b3/_b4);
var _b8=Math.cos(_b7)*Math.cos(_b7);
var _b9=_b5-2*_af*_b0/_b8;
var C=f/16*_b8*(4+f*(4-3*_b8));
lambdaP=_b1;
_b1=L+(1-C)*f*Math.sin(_b7)*(_b6+C*_b4*(_b9+C*_b5*(-1+2*_b9*_b9)));
}
if(_b2==0){
return NaN;
}
var uSq=_b8*(a*a-b*b)/(b*b);
var A=1+uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
var B=uSq/1024*(256+uSq*(-128+uSq*(74-47*uSq)));
var _be=B*_b4*(_b9+B/4*(_b5*(-1+2*_b9*_b9)-B/6*_b9*(-3+4*_b4*_b4)*(-3+4*_b9*_b9)));
var s=b*A*(_b6-_be);
var d=s.toFixed(3)/1000;
return d;
};
OpenLayers.Util.getParameters=function(url){
url=url||window.location.href;
if(url==null){
url=window.location.href;
}
var _c2="";
if(OpenLayers.String.contains(url,"?")){
var _c3=url.indexOf("?")+1;
var end=OpenLayers.String.contains(url,"#")?url.indexOf("#"):url.length;
_c2=url.substring(_c3,end);
}
var _c5={};
var _c6=_c2.split(/[&;]/);
for(var i=0;i<_c6.length;++i){
var _c8=_c6[i].split("=");
if(_c8[0]){
var key=decodeURIComponent(_c8[0]);
var _ca=_c8[1]||"";
_ca=_ca.split(",");
for(var j=0;j<_ca.length;j++){
_ca[j]=decodeURIComponent(_ca[j]);
}
if(_ca.length==1){
_ca=_ca[0];
}
_c5[key]=_ca;
}
}
return _c5;
};
OpenLayers.Util.getArgs=function(url){
var err="The getArgs() function is deprecated and will be removed "+"with the 3.0 version of OpenLayers. Please instead use "+"OpenLayers.Util.getParameters().";
OpenLayers.Console.warn(err);
return OpenLayers.Util.getParameters(url);
};
OpenLayers.Util.lastSeqID=0;
OpenLayers.Util.createUniqueID=function(_ce){
if(_ce==null){
_ce="id_";
}
OpenLayers.Util.lastSeqID+=1;
return _ce+OpenLayers.Util.lastSeqID;
};
OpenLayers.INCHES_PER_UNIT={"inches":1,"ft":12,"mi":63360,"m":39.3701,"km":39370.1,"dd":4374754,"yd":36};
OpenLayers.INCHES_PER_UNIT["in"]=OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"]=OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.INCHES_PER_UNIT["nmi"]=1852*OpenLayers.INCHES_PER_UNIT.m;
OpenLayers.DOTS_PER_INCH=72;
OpenLayers.Util.normalizeScale=function(_cf){
var _d0=(_cf>1)?(1/_cf):_cf;
return _d0;
};
OpenLayers.Util.getResolutionFromScale=function(_d1,_d2){
if(_d2==null){
_d2="degrees";
}
var _d3=OpenLayers.Util.normalizeScale(_d1);
var _d4=1/(_d3*OpenLayers.INCHES_PER_UNIT[_d2]*OpenLayers.DOTS_PER_INCH);
return _d4;
};
OpenLayers.Util.getScaleFromResolution=function(_d5,_d6){
if(_d6==null){
_d6="degrees";
}
var _d7=_d5*OpenLayers.INCHES_PER_UNIT[_d6]*OpenLayers.DOTS_PER_INCH;
return _d7;
};
OpenLayers.Util.safeStopPropagation=function(evt){
OpenLayers.Event.stop(evt,true);
};
OpenLayers.Util.pagePosition=function(_d9){
var _da=0,valueL=0;
var _db=_d9;
var _dc=_d9;
while(_db){
if(_db==document.body){
if(_dc&&_dc.style&&OpenLayers.Element.getStyle(_dc,"position")=="absolute"){
break;
}
}
_da+=_db.offsetTop||0;
valueL+=_db.offsetLeft||0;
_dc=_db;
try{
_db=_db.offsetParent;
}
catch(e){
OpenLayers.Console.error("OpenLayers.Util.pagePosition failed: element with id "+_db.id+" may be misplaced.");
break;
}
}
_db=_d9;
while(_db){
_da-=_db.scrollTop||0;
valueL-=_db.scrollLeft||0;
_db=_db.parentNode;
}
return [valueL,_da];
};
OpenLayers.Util.isEquivalentUrl=function(_dd,_de,_df){
_df=_df||{};
OpenLayers.Util.applyDefaults(_df,{ignoreCase:true,ignorePort80:true,ignoreHash:true});
var _e0=OpenLayers.Util.createUrlObject(_dd,_df);
var _e1=OpenLayers.Util.createUrlObject(_de,_df);
for(var key in _e0){
if(_df.test){
alert(key+"\n1:"+_e0[key]+"\n2:"+_e1[key]);
}
var _e3=_e0[key];
var _e4=_e1[key];
switch(key){
case "args":
break;
case "host":
case "port":
case "protocol":
if((_e3=="")||(_e4=="")){
break;
}
default:
if((key!="args")&&(_e0[key]!=_e1[key])){
return false;
}
break;
}
}
for(var key in _e0.args){
if(_e0.args[key]!=_e1.args[key]){
return false;
}
delete _e1.args[key];
}
for(var key in _e1.args){
return false;
}
return true;
};
OpenLayers.Util.createUrlObject=function(url,_e6){
_e6=_e6||{};
var _e7={};
if(_e6.ignoreCase){
url=url.toLowerCase();
}
var a=document.createElement("a");
a.href=url;
_e7.host=a.host;
var _e9=a.port;
if(_e9.length<=0){
var _ea=_e7.host.length-(_e9.length);
_e7.host=_e7.host.substring(0,_ea);
}
_e7.protocol=a.protocol;
_e7.port=((_e9=="80")&&(_e6.ignorePort80))?"":_e9;
_e7.hash=(_e6.ignoreHash)?"":a.hash;
var _eb=a.search;
if(!_eb){
var _ec=url.indexOf("?");
_eb=(_ec!=-1)?url.substr(_ec):"";
}
_e7.args=OpenLayers.Util.getParameters(_eb);
if(((_e7.protocol=="file:")&&(url.indexOf("file:")!=-1))||((_e7.protocol!="file:")&&(_e7.host!=""))){
_e7.pathname=a.pathname;
var _ed=_e7.pathname.indexOf("?");
if(_ed!=-1){
_e7.pathname=_e7.pathname.substring(0,_ed);
}
}else{
var _ee=OpenLayers.Util.removeTail(url);
var _ef=0;
do{
var _f0=_ee.indexOf("../");
if(_f0==0){
_ef++;
_ee=_ee.substr(3);
}else{
if(_f0>=0){
var _f1=_ee.substr(0,_f0-1);
var _f2=_f1.indexOf("/");
_f1=(_f2!=-1)?_f1.substr(0,_f2+1):"";
var _f3=_ee.substr(_f0+3);
_ee=_f1+_f3;
}
}
}while(_f0!=-1);
var _f4=document.createElement("a");
var _f5=window.location.href;
if(_e6.ignoreCase){
_f5=_f5.toLowerCase();
}
_f4.href=_f5;
_e7.protocol=_f4.protocol;
var _f6=(_f4.pathname.indexOf("/")!=-1)?"/":"\\";
var _f7=_f4.pathname.split(_f6);
_f7.pop();
while((_ef>0)&&(_f7.length>0)){
_f7.pop();
_ef--;
}
_ee=_f7.join("/")+"/"+_ee;
_e7.pathname=_ee;
}
if((_e7.protocol=="file:")||(_e7.protocol=="")){
_e7.host="localhost";
}
return _e7;
};
OpenLayers.Util.removeTail=function(url){
var _f9=null;
var _fa=url.indexOf("?");
var _fb=url.indexOf("#");
if(_fa==-1){
_f9=(_fb!=-1)?url.substr(0,_fb):url;
}else{
_f9=(_fb!=-1)?url.substr(0,Math.min(_fa,_fb)):url.substr(0,_fa);
}
return _f9;
};
OpenLayers.Util.getBrowserName=function(){
var _fc="";
var ua=navigator.userAgent.toLowerCase();
if(ua.indexOf("opera")!=-1){
_fc="opera";
}else{
if(ua.indexOf("msie")!=-1){
_fc="msie";
}else{
if(ua.indexOf("safari")!=-1){
_fc="safari";
}else{
if(ua.indexOf("mozilla")!=-1){
if(ua.indexOf("firefox")!=-1){
_fc="firefox";
}else{
_fc="mozilla";
}
}
}
}
}
return _fc;
};
OpenLayers.Rico=new Object();
OpenLayers.Rico.Corner={round:function(e,_ff){
e=OpenLayers.Util.getElement(e);
this._setOptions(_ff);
var _100=this.options.color;
if(this.options.color=="fromElement"){
_100=this._background(e);
}
var _101=this.options.bgColor;
if(this.options.bgColor=="fromParent"){
_101=this._background(e.offsetParent);
}
this._roundCornersImpl(e,_100,_101);
},changeColor:function(_102,_103){
_102.style.backgroundColor=_103;
var _104=_102.parentNode.getElementsByTagName("span");
for(var _105=0;_105<_104.length;_105++){
_104[_105].style.backgroundColor=_103;
}
},changeOpacity:function(_106,_107){
var _108=_107;
var _109="alpha(opacity="+_107*100+")";
_106.style.opacity=_108;
_106.style.filter=_109;
var _10a=_106.parentNode.getElementsByTagName("span");
for(var _10b=0;_10b<_10a.length;_10b++){
_10a[_10b].style.opacity=_108;
_10a[_10b].style.filter=_109;
}
},reRound:function(_10c,_10d){
var _10e=_10c.parentNode.childNodes[0];
var _10f=_10c.parentNode.childNodes[2];
_10c.parentNode.removeChild(_10e);
_10c.parentNode.removeChild(_10f);
this.round(_10c.parentNode,_10d);
},_roundCornersImpl:function(e,_111,_112){
if(this.options.border){
this._renderBorder(e,_112);
}
if(this._isTopRounded()){
this._roundTopCorners(e,_111,_112);
}
if(this._isBottomRounded()){
this._roundBottomCorners(e,_111,_112);
}
},_renderBorder:function(el,_114){
var _115="1px solid "+this._borderColor(_114);
var _116="border-left: "+_115;
var _117="border-right: "+_115;
var _118="style='"+_116+";"+_117+"'";
el.innerHTML="<div "+_118+">"+el.innerHTML+"</div>";
},_roundTopCorners:function(el,_11a,_11b){
var _11c=this._createCorner(_11b);
for(var i=0;i<this.options.numSlices;i++){
_11c.appendChild(this._createCornerSlice(_11a,_11b,i,"top"));
}
el.style.paddingTop=0;
el.insertBefore(_11c,el.firstChild);
},_roundBottomCorners:function(el,_11f,_120){
var _121=this._createCorner(_120);
for(var i=(this.options.numSlices-1);i>=0;i--){
_121.appendChild(this._createCornerSlice(_11f,_120,i,"bottom"));
}
el.style.paddingBottom=0;
el.appendChild(_121);
},_createCorner:function(_123){
var _124=document.createElement("div");
_124.style.backgroundColor=(this._isTransparent()?"transparent":_123);
return _124;
},_createCornerSlice:function(_125,_126,n,_128){
var _129=document.createElement("span");
var _12a=_129.style;
_12a.backgroundColor=_125;
_12a.display="block";
_12a.height="1px";
_12a.overflow="hidden";
_12a.fontSize="1px";
var _12b=this._borderColor(_125,_126);
if(this.options.border&&n==0){
_12a.borderTopStyle="solid";
_12a.borderTopWidth="1px";
_12a.borderLeftWidth="0px";
_12a.borderRightWidth="0px";
_12a.borderBottomWidth="0px";
_12a.height="0px";
_12a.borderColor=_12b;
}else{
if(_12b){
_12a.borderColor=_12b;
_12a.borderStyle="solid";
_12a.borderWidth="0px 1px";
}
}
if(!this.options.compact&&(n==(this.options.numSlices-1))){
_12a.height="2px";
}
this._setMargin(_129,n,_128);
this._setBorder(_129,n,_128);
return _129;
},_setOptions:function(_12c){
this.options={corners:"all",color:"fromElement",bgColor:"fromParent",blend:true,border:false,compact:false};
OpenLayers.Util.extend(this.options,_12c||{});
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
},_borderColor:function(_12d,_12e){
if(_12d=="transparent"){
return _12e;
}else{
if(this.options.border){
return this.options.border;
}else{
if(this.options.blend){
return this._blend(_12e,_12d);
}else{
return "";
}
}
}
},_setMargin:function(el,n,_131){
var _132=this._marginSize(n);
var _133=_131=="top"?this._whichSideTop():this._whichSideBottom();
if(_133=="left"){
el.style.marginLeft=_132+"px";
el.style.marginRight="0px";
}else{
if(_133=="right"){
el.style.marginRight=_132+"px";
el.style.marginLeft="0px";
}else{
el.style.marginLeft=_132+"px";
el.style.marginRight=_132+"px";
}
}
},_setBorder:function(el,n,_136){
var _137=this._borderSize(n);
var _138=_136=="top"?this._whichSideTop():this._whichSideBottom();
if(_138=="left"){
el.style.borderLeftWidth=_137+"px";
el.style.borderRightWidth="0px";
}else{
if(_138=="right"){
el.style.borderRightWidth=_137+"px";
el.style.borderLeftWidth="0px";
}else{
el.style.borderLeftWidth=_137+"px";
el.style.borderRightWidth=_137+"px";
}
}
if(this.options.border!=false){
el.style.borderLeftWidth=_137+"px";
el.style.borderRightWidth=_137+"px";
}
},_marginSize:function(n){
if(this._isTransparent()){
return 0;
}
var _13a=[5,3,2,1];
var _13b=[3,2,1,0];
var _13c=[2,1];
var _13d=[1,0];
if(this.options.compact&&this.options.blend){
return _13d[n];
}else{
if(this.options.compact){
return _13c[n];
}else{
if(this.options.blend){
return _13b[n];
}else{
return _13a[n];
}
}
}
},_borderSize:function(n){
var _13f=[5,3,2,1];
var _140=[2,1,1,1];
var _141=[1,0];
var _142=[0,2,0,0];
if(this.options.compact&&(this.options.blend||this._isTransparent())){
return 1;
}else{
if(this.options.compact){
return _141[n];
}else{
if(this.options.blend){
return _140[n];
}else{
if(this.options.border){
return _142[n];
}else{
if(this._isTransparent()){
return _13f[n];
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
OpenLayers.nullHandler=function(_14a){
alert("Unhandled request return "+_14a.statusText);
};
OpenLayers.loadURL=function(uri,_14c,_14d,_14e,_14f){
if(OpenLayers.ProxyHost&&OpenLayers.String.startsWith(uri,"http")){
uri=OpenLayers.ProxyHost+escape(uri);
}
var _150=(_14e)?OpenLayers.Function.bind(_14e,_14d):OpenLayers.nullHandler;
var _151=(_14f)?OpenLayers.Function.bind(_14f,_14d):OpenLayers.nullHandler;
return new OpenLayers.Ajax.Request(uri,{method:"get",parameters:_14c,onComplete:_150,onFailure:_151});
};
OpenLayers.parseXMLString=function(text){
var _153=text.indexOf("<");
if(_153>0){
text=text.substring(_153);
}
var _154=OpenLayers.Util.Try(function(){
var _155=new ActiveXObject("Microsoft.XMLDOM");
_155.loadXML(text);
return _155;
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
return _154;
};
OpenLayers.Ajax={emptyFunction:function(){
},getTransport:function(){
return OpenLayers.Util.Try(function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
})||false;
},activeRequestCount:0};
OpenLayers.Ajax.Responders={responders:[],register:function(_157){
for(var i=0;i<this.responders.length;i++){
if(_157==this.responders[i]){
return;
}
}
this.responders.push(_157);
},unregister:function(_159){
OpenLayers.Util.removeItem(this.reponders,_159);
},dispatch:function(_15a,_15b,_15c){
var _15d;
for(var i=0;i<this.responders.length;i++){
_15d=this.responders[i];
if(_15d[_15a]&&typeof _15d[_15a]=="function"){
try{
_15d[_15a].apply(_15d,[_15b,_15c]);
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
OpenLayers.Ajax.Base=OpenLayers.Class({initialize:function(_15f){
this.options={method:"post",asynchronous:true,contentType:"application/xml",parameters:""};
OpenLayers.Util.extend(this.options,_15f||{});
this.options.method=this.options.method.toLowerCase();
if(typeof this.options.parameters=="string"){
this.options.parameters=OpenLayers.Util.getParameters(this.options.parameters);
}
}});
OpenLayers.Ajax.Request=OpenLayers.Class(OpenLayers.Ajax.Base,{_complete:false,initialize:function(url,_161){
OpenLayers.Ajax.Base.prototype.initialize.apply(this,[_161]);
this.transport=OpenLayers.Ajax.getTransport();
this.request(url);
},request:function(url){
this.url=url;
this.method=this.options.method;
var _163=OpenLayers.Util.extend({},this.options.parameters);
if(this.method!="get"&&this.method!="post"){
_163["_method"]=this.method;
this.method="post";
}
this.parameters=_163;
if(_163=OpenLayers.Util.getParameterString(_163)){
if(this.method=="get"){
this.url+=((this.url.indexOf("?")>-1)?"&":"?")+_163;
}else{
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
_163+="&_=";
}
}
}
try{
var _164=new OpenLayers.Ajax.Response(this);
if(this.options.onCreate){
this.options.onCreate(_164);
}
OpenLayers.Ajax.Responders.dispatch("onCreate",this,_164);
this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);
if(this.options.asynchronous){
window.setTimeout(OpenLayers.Function.bind(this.respondToReadyState,this,1),10);
}
this.transport.onreadystatechange=OpenLayers.Function.bind(this.onStateChange,this);
this.setRequestHeaders();
this.body=this.method=="post"?(this.options.postBody||_163):null;
this.transport.send(this.body);
if(!this.options.asynchronous&&this.transport.overrideMimeType){
this.onStateChange();
}
}
catch(e){
this.dispatchException(e);
}
},onStateChange:function(){
var _165=this.transport.readyState;
if(_165>1&&!((_165==4)&&this._complete)){
this.respondToReadyState(this.transport.readyState);
}
},setRequestHeaders:function(){
var _166={"X-Requested-With":"XMLHttpRequest","Accept":"text/javascript, text/html, application/xml, text/xml, */*","OpenLayers":true};
if(this.method=="post"){
_166["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+this.options.encoding:"");
if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005){
_166["Connection"]="close";
}
}
if(typeof this.options.requestHeaders=="object"){
var _167=this.options.requestHeaders;
if(typeof _167.push=="function"){
for(var i=0,length=_167.length;i<length;i+=2){
_166[_167[i]]=_167[i+1];
}
}else{
for(var i in _167){
_166[i]=pair[i];
}
}
}
for(var name in _166){
this.transport.setRequestHeader(name,_166[name]);
}
},success:function(){
var _16a=this.getStatus();
return !_16a||(_16a>=200&&_16a<300);
},getStatus:function(){
try{
return this.transport.status||0;
}
catch(e){
return 0;
}
},respondToReadyState:function(_16b){
var _16c=OpenLayers.Ajax.Request.Events[_16b];
var _16d=new OpenLayers.Ajax.Response(this);
if(_16c=="Complete"){
try{
this._complete=true;
(this.options["on"+_16d.status]||this.options["on"+(this.success()?"Success":"Failure")]||OpenLayers.Ajax.emptyFunction)(_16d);
}
catch(e){
this.dispatchException(e);
}
var _16e=_16d.getHeader("Content-type");
}
try{
(this.options["on"+_16c]||OpenLayers.Ajax.emptyFunction)(_16d);
OpenLayers.Ajax.Responders.dispatch("on"+_16c,this,_16d);
}
catch(e){
this.dispatchException(e);
}
if(_16c=="Complete"){
this.transport.onreadystatechange=OpenLayers.Ajax.emptyFunction;
}
},getHeader:function(name){
try{
return this.transport.getResponseHeader(name);
}
catch(e){
return null;
}
},dispatchException:function(_170){
var _171=this.options.onException;
if(_171){
_171(this,_170);
OpenLayers.Ajax.Responders.dispatch("onException",this,_170);
}else{
var _172=false;
var _173=OpenLayers.Ajax.Responders.responders;
for(var i=0;i<_173.length;i++){
if(_173[i].onException){
_172=true;
break;
}
}
if(_172){
OpenLayers.Ajax.Responders.dispatch("onException",this,_170);
}else{
throw _170;
}
}
}});
OpenLayers.Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
OpenLayers.Ajax.Response=OpenLayers.Class({status:0,statusText:"",initialize:function(_175){
this.request=_175;
var _176=this.transport=_175.transport,readyState=this.readyState=_176.readyState;
if((readyState>2&&!(!!(window.attachEvent&&!window.opera)))||readyState==4){
this.status=this.getStatus();
this.statusText=this.getStatusText();
this.responseText=_176.responseText==null?"":String(_176.responseText);
}
if(readyState==4){
var xml=_176.responseXML;
this.responseXML=xml===undefined?null:xml;
}
},getStatus:OpenLayers.Ajax.Request.prototype.getStatus,getStatusText:function(){
try{
return this.transport.statusText||"";
}
catch(e){
return "";
}
},getHeader:OpenLayers.Ajax.Request.prototype.getHeader,getResponseHeader:function(name){
return this.transport.getResponseHeader(name);
}});
OpenLayers.Ajax.getElementsByTagNameNS=function(_179,_17a,_17b,_17c){
var elem=null;
if(_179.getElementsByTagNameNS){
elem=_179.getElementsByTagNameNS(_17a,_17c);
}else{
elem=_179.getElementsByTagName(_17b+":"+_17c);
}
return elem;
};
OpenLayers.Ajax.serializeXMLToString=function(_17e){
var _17f=new XMLSerializer();
var data=_17f.serializeToString(_17e);
return data;
};
OpenLayers.Bounds=OpenLayers.Class({left:null,bottom:null,right:null,top:null,initialize:function(left,_182,_183,top){
if(left!=null){
this.left=parseFloat(left);
}
if(_182!=null){
this.bottom=parseFloat(_182);
}
if(_183!=null){
this.right=parseFloat(_183);
}
if(top!=null){
this.top=parseFloat(top);
}
},clone:function(){
return new OpenLayers.Bounds(this.left,this.bottom,this.right,this.top);
},equals:function(_185){
var _186=false;
if(_185!=null){
_186=((this.left==_185.left)&&(this.right==_185.right)&&(this.top==_185.top)&&(this.bottom==_185.bottom));
}
return _186;
},toString:function(){
return ("left-bottom=("+this.left+","+this.bottom+")"+" right-top=("+this.right+","+this.top+")");
},toArray:function(){
return [this.left,this.bottom,this.right,this.top];
},toBBOX:function(_187){
if(_187==null){
_187=6;
}
var mult=Math.pow(10,_187);
var bbox=Math.round(this.left*mult)/mult+","+Math.round(this.bottom*mult)/mult+","+Math.round(this.right*mult)/mult+","+Math.round(this.top*mult)/mult;
return bbox;
},toGeometry:function(){
return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(this.left,this.bottom),new OpenLayers.Geometry.Point(this.right,this.bottom),new OpenLayers.Geometry.Point(this.right,this.top),new OpenLayers.Geometry.Point(this.left,this.top)])]);
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
},extend:function(_18d){
var _18e=null;
if(_18d){
switch(_18d.CLASS_NAME){
case "OpenLayers.LonLat":
_18e=new OpenLayers.Bounds(_18d.lon,_18d.lat,_18d.lon,_18d.lat);
break;
case "OpenLayers.Geometry.Point":
_18e=new OpenLayers.Bounds(_18d.x,_18d.y,_18d.x,_18d.y);
break;
case "OpenLayers.Bounds":
_18e=_18d;
break;
}
if(_18e){
if((this.left==null)||(_18e.left<this.left)){
this.left=_18e.left;
}
if((this.bottom==null)||(_18e.bottom<this.bottom)){
this.bottom=_18e.bottom;
}
if((this.right==null)||(_18e.right>this.right)){
this.right=_18e.right;
}
if((this.top==null)||(_18e.top>this.top)){
this.top=_18e.top;
}
}
}
},containsLonLat:function(ll,_190){
return this.contains(ll.lon,ll.lat,_190);
},containsPixel:function(px,_192){
return this.contains(px.x,px.y,_192);
},contains:function(x,y,_195){
if(_195==null){
_195=true;
}
var _196=false;
if(_195){
_196=((x>=this.left)&&(x<=this.right)&&(y>=this.bottom)&&(y<=this.top));
}else{
_196=((x>this.left)&&(x<this.right)&&(y>this.bottom)&&(y<this.top));
}
return _196;
},intersectsBounds:function(_197,_198){
if(_198==null){
_198=true;
}
var _199=(_197.bottom==this.bottom&&_197.top==this.top)?true:(((_197.bottom>this.bottom)&&(_197.bottom<this.top))||((this.bottom>_197.bottom)&&(this.bottom<_197.top)));
var _19a=(_197.bottom==this.bottom&&_197.top==this.top)?true:(((_197.top>this.bottom)&&(_197.top<this.top))||((this.top>_197.bottom)&&(this.top<_197.top)));
var _19b=(_197.right==this.right&&_197.left==this.left)?true:(((_197.right>this.left)&&(_197.right<this.right))||((this.right>_197.left)&&(this.right<_197.right)));
var _19c=(_197.right==this.right&&_197.left==this.left)?true:(((_197.left>this.left)&&(_197.left<this.right))||((this.left>_197.left)&&(this.left<_197.right)));
return (this.containsBounds(_197,true,_198)||_197.containsBounds(this,true,_198)||((_19a||_199)&&(_19c||_19b)));
},containsBounds:function(_19d,_19e,_19f){
if(_19e==null){
_19e=false;
}
if(_19f==null){
_19f=true;
}
var _1a0;
var _1a1;
var _1a2;
var _1a3;
if(_19f){
_1a0=(_19d.left>=this.left)&&(_19d.left<=this.right);
_1a1=(_19d.top>=this.bottom)&&(_19d.top<=this.top);
_1a2=(_19d.right>=this.left)&&(_19d.right<=this.right);
_1a3=(_19d.bottom>=this.bottom)&&(_19d.bottom<=this.top);
}else{
_1a0=(_19d.left>this.left)&&(_19d.left<this.right);
_1a1=(_19d.top>this.bottom)&&(_19d.top<this.top);
_1a2=(_19d.right>this.left)&&(_19d.right<this.right);
_1a3=(_19d.bottom>this.bottom)&&(_19d.bottom<this.top);
}
return (_19e)?(_1a1||_1a3)&&(_1a0||_1a2):(_1a1&&_1a0&&_1a3&&_1a2);
},determineQuadrant:function(_1a4){
var _1a5="";
var _1a6=this.getCenterLonLat();
_1a5+=(_1a4.lat<_1a6.lat)?"b":"t";
_1a5+=(_1a4.lon<_1a6.lon)?"l":"r";
return _1a5;
},transform:function(_1a7,dest){
var ll=OpenLayers.Projection.transform({"x":this.left,"y":this.bottom},_1a7,dest);
var ur=OpenLayers.Projection.transform({"x":this.right,"y":this.top},_1a7,dest);
this.left=ll.x;
this.bottom=ll.y;
this.right=ur.x;
this.top=ur.y;
return this;
},wrapDateLine:function(_1ab,_1ac){
_1ac=_1ac||{};
var _1ad=_1ac.leftTolerance||0;
var _1ae=_1ac.rightTolerance||0;
var _1af=this.clone();
if(_1ab){
while(_1af.left<_1ab.left&&(_1af.right-_1ae)<=_1ab.left){
_1af=_1af.add(_1ab.getWidth(),0);
}
while((_1af.left+_1ad)>=_1ab.right&&_1af.right>_1ab.right){
_1af=_1af.add(-_1ab.getWidth(),0);
}
}
return _1af;
},CLASS_NAME:"OpenLayers.Bounds"});
OpenLayers.Bounds.fromString=function(str){
var _1b1=str.split(",");
return OpenLayers.Bounds.fromArray(_1b1);
};
OpenLayers.Bounds.fromArray=function(bbox){
return new OpenLayers.Bounds(parseFloat(bbox[0]),parseFloat(bbox[1]),parseFloat(bbox[2]),parseFloat(bbox[3]));
};
OpenLayers.Bounds.fromSize=function(size){
return new OpenLayers.Bounds(0,size.h,size.w,0);
};
OpenLayers.Bounds.oppositeQuadrant=function(_1b4){
var opp="";
opp+=(_1b4.charAt(0)=="t")?"b":"t";
opp+=(_1b4.charAt(1)=="l")?"r":"l";
return opp;
};
OpenLayers.Element={visible:function(_1b6){
return OpenLayers.Util.getElement(_1b6).style.display!="none";
},toggle:function(){
for(var i=0;i<arguments.length;i++){
var _1b8=OpenLayers.Util.getElement(arguments[i]);
var _1b9=OpenLayers.Element.visible(_1b8)?"hide":"show";
OpenLayers.Element[_1b9](_1b8);
}
},hide:function(){
for(var i=0;i<arguments.length;i++){
var _1bb=OpenLayers.Util.getElement(arguments[i]);
_1bb.style.display="none";
}
},show:function(){
for(var i=0;i<arguments.length;i++){
var _1bd=OpenLayers.Util.getElement(arguments[i]);
_1bd.style.display="";
}
},remove:function(_1be){
_1be=OpenLayers.Util.getElement(_1be);
_1be.parentNode.removeChild(_1be);
},getHeight:function(_1bf){
_1bf=OpenLayers.Util.getElement(_1bf);
return _1bf.offsetHeight;
},getDimensions:function(_1c0){
_1c0=OpenLayers.Util.getElement(_1c0);
if(OpenLayers.Element.getStyle(_1c0,"display")!="none"){
return {width:_1c0.offsetWidth,height:_1c0.offsetHeight};
}
var els=_1c0.style;
var _1c2=els.visibility;
var _1c3=els.position;
els.visibility="hidden";
els.position="absolute";
els.display="";
var _1c4=_1c0.clientWidth;
var _1c5=_1c0.clientHeight;
els.display="none";
els.position=_1c3;
els.visibility=_1c2;
return {width:_1c4,height:_1c5};
},getStyle:function(_1c6,_1c7){
_1c6=OpenLayers.Util.getElement(_1c6);
var _1c8=_1c6.style[OpenLayers.String.camelize(_1c7)];
if(!_1c8){
if(document.defaultView&&document.defaultView.getComputedStyle){
var css=document.defaultView.getComputedStyle(_1c6,null);
_1c8=css?css.getPropertyValue(_1c7):null;
}else{
if(_1c6.currentStyle){
_1c8=_1c6.currentStyle[OpenLayers.String.camelize(_1c7)];
}
}
}
var _1ca=["left","top","right","bottom"];
if(window.opera&&(OpenLayers.Util.indexOf(_1ca,_1c7)!=-1)&&(OpenLayers.Element.getStyle(_1c6,"position")=="static")){
_1c8="auto";
}
return _1c8=="auto"?null:_1c8;
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
var _1d1=false;
if(ll!=null){
_1d1=((this.lon==ll.lon&&this.lat==ll.lat)||(isNaN(this.lon)&&isNaN(this.lat)&&isNaN(ll.lon)&&isNaN(ll.lat)));
}
return _1d1;
},transform:function(_1d2,dest){
var _1d4=OpenLayers.Projection.transform({"x":this.lon,"y":this.lat},_1d2,dest);
this.lon=_1d4.x;
this.lat=_1d4.y;
return this;
},wrapDateLine:function(_1d5){
var _1d6=this.clone();
if(_1d5){
while(_1d6.lon<_1d5.left){
_1d6.lon+=_1d5.getWidth();
}
while(_1d6.lon>_1d5.right){
_1d6.lon-=_1d5.getWidth();
}
}
return _1d6;
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
var _1dc=false;
if(px!=null){
_1dc=((this.x==px.x&&this.y==px.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(px.x)&&isNaN(px.y)));
}
return _1dc;
},add:function(x,y){
if((x==null)||(y==null)){
var msg="You must pass both x and y values to the add function.";
OpenLayers.Console.error(msg);
return null;
}
return new OpenLayers.Pixel(this.x+x,this.y+y);
},offset:function(px){
var _1e1=this.clone();
if(px){
_1e1=this.add(px.x,px.y);
}
return _1e1;
},CLASS_NAME:"OpenLayers.Pixel"});
OpenLayers.Size=OpenLayers.Class({w:0,h:0,initialize:function(w,h){
this.w=parseFloat(w);
this.h=parseFloat(h);
},toString:function(){
return ("w="+this.w+",h="+this.h);
},clone:function(){
return new OpenLayers.Size(this.w,this.h);
},equals:function(sz){
var _1e5=false;
if(sz!=null){
_1e5=((this.w==sz.w&&this.h==sz.h)||(isNaN(this.w)&&isNaN(this.h)&&isNaN(sz.w)&&isNaN(sz.h)));
}
return _1e5;
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
var _1e6=document.getElementsByTagName("script");
for(var i=0;i<_1e6.length;++i){
if(_1e6[i].src.indexOf("firebug.js")!=-1){
OpenLayers.Util.extend(OpenLayers.Console,console);
break;
}
}
}
})();
OpenLayers.Control=OpenLayers.Class({id:null,map:null,div:null,type:null,displayClass:"",active:null,handler:null,initialize:function(_1e8){
this.displayClass=this.CLASS_NAME.replace("OpenLayers.","ol").replace(/\./g,"");
OpenLayers.Util.extend(this,_1e8);
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},destroy:function(){
if(this.handler){
this.handler.destroy();
this.handler=null;
}
if(this.map){
this.map.removeControl(this);
this.map=null;
}
},setMap:function(map){
this.map=map;
if(this.handler){
this.handler.setMap(map);
}
},draw:function(px){
if(this.div==null){
this.div=OpenLayers.Util.createDiv(this.id);
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
OpenLayers.Icon=OpenLayers.Class({url:null,size:null,offset:null,calculateOffset:null,imageDiv:null,px:null,initialize:function(url,size,_1ee,_1ef){
this.url=url;
this.size=(size)?size:new OpenLayers.Size(20,20);
this.offset=_1ee?_1ee:new OpenLayers.Pixel(-(this.size.w/2),-(this.size.h/2));
this.calculateOffset=_1ef;
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
},setUrl:function(url){
if(url!=null){
this.url=url;
}
this.draw();
},draw:function(px){
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,this.size,this.url,"absolute");
this.moveTo(px);
return this.imageDiv;
},setOpacity:function(_1f4){
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,null,null,null,null,null,_1f4);
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
var _1f6=this.px.offset(this.offset);
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,_1f6);
}
}
},display:function(_1f7){
this.imageDiv.style.display=(_1f7)?"":"none";
},CLASS_NAME:"OpenLayers.Icon"});
OpenLayers.Popup=OpenLayers.Class({events:null,id:"",lonlat:null,div:null,size:null,contentHTML:"",backgroundColor:"",opacity:"",border:"",contentDiv:null,groupDiv:null,padding:5,map:null,initialize:function(id,_1f9,size,_1fb,_1fc,_1fd){
if(id==null){
id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
}
this.id=id;
this.lonlat=_1f9;
this.size=(size!=null)?size:new OpenLayers.Size(OpenLayers.Popup.WIDTH,OpenLayers.Popup.HEIGHT);
if(_1fb!=null){
this.contentHTML=_1fb;
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
if(_1fc){
var _1fe=new OpenLayers.Size(17,17);
var img=OpenLayers.Util.getImagesLocation()+"close.gif";
var _200=OpenLayers.Util.createAlphaImageDiv(this.id+"_close",null,_1fe,img);
_200.style.right=this.padding+"px";
_200.style.top=this.padding+"px";
this.groupDiv.appendChild(_200);
var _201=_1fd||function(e){
this.hide();
OpenLayers.Event.stop(e);
};
OpenLayers.Event.observe(_200,"click",OpenLayers.Function.bindAsEventListener(_201,this));
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
},setBackgroundColor:function(_207){
if(_207!=undefined){
this.backgroundColor=_207;
}
if(this.div!=null){
this.div.style.backgroundColor=this.backgroundColor;
}
},setOpacity:function(_208){
if(_208!=undefined){
this.opacity=_208;
}
if(this.div!=null){
this.div.style.opacity=this.opacity;
this.div.style.filter="alpha(opacity="+this.opacity*100+")";
}
},setBorder:function(_209){
if(_209!=undefined){
this.border=_209;
}
if(this.div!=null){
this.div.style.border=this.border;
}
},setContentHTML:function(_20a){
if(_20a!=null){
this.contentHTML=_20a;
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
OpenLayers.Renderer=OpenLayers.Class({container:null,extent:null,size:null,resolution:null,map:null,initialize:function(_211){
this.container=OpenLayers.Util.getElement(_211);
},destroy:function(){
this.container=null;
this.extent=null;
this.size=null;
this.resolution=null;
this.map=null;
},supported:function(){
return false;
},setExtent:function(_212){
this.extent=_212.clone();
this.resolution=null;
},setSize:function(size){
this.size=size.clone();
this.resolution=null;
},getResolution:function(){
this.resolution=this.resolution||this.map.getResolution();
return this.resolution;
},drawFeature:function(_214,_215){
if(_215==null){
_215=_214.style;
}
this.drawGeometry(_214.geometry,_215,_214.id);
},drawGeometry:function(_216,_217,_218){
},clear:function(){
},getFeatureIdFromEvent:function(evt){
},eraseFeatures:function(_21a){
if(!(_21a instanceof Array)){
_21a=[_21a];
}
for(var i=0;i<_21a.length;++i){
this.eraseGeometry(_21a[i].geometry);
}
},eraseGeometry:function(_21c){
},CLASS_NAME:"OpenLayers.Renderer"});
OpenLayers.Rico.Color=OpenLayers.Class({initialize:function(red,_21e,blue){
this.rgb={r:red,g:_21e,b:blue};
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
},darken:function(_229){
var hsb=this.asHSB();
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,Math.max(hsb.b-_229,0));
},brighten:function(_22b){
var hsb=this.asHSB();
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,Math.min(hsb.b+_22b,1));
},blend:function(_22d){
this.rgb.r=Math.floor((this.rgb.r+_22d.rgb.r)/2);
this.rgb.g=Math.floor((this.rgb.g+_22d.rgb.g)/2);
this.rgb.b=Math.floor((this.rgb.b+_22d.rgb.b)/2);
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
OpenLayers.Rico.Color.createFromHex=function(_22f){
if(_22f.length==4){
var _230=_22f;
var _22f="#";
for(var i=1;i<4;i++){
_22f+=(_230.charAt(i)+_230.charAt(i));
}
}
if(_22f.indexOf("#")==0){
_22f=_22f.substring(1);
}
var red=_22f.substring(0,2);
var _233=_22f.substring(2,4);
var blue=_22f.substring(4,6);
return new OpenLayers.Rico.Color(parseInt(red,16),parseInt(_233,16),parseInt(blue,16));
};
OpenLayers.Rico.Color.createColorFromBackground=function(elem){
var _236=RicoUtil.getElementsComputedStyle(OpenLayers.Util.getElement(elem),"backgroundColor","background-color");
if(_236=="transparent"&&elem.parentNode){
return OpenLayers.Rico.Color.createColorFromBackground(elem.parentNode);
}
if(_236==null){
return new OpenLayers.Rico.Color(255,255,255);
}
if(_236.indexOf("rgb(")==0){
var _237=_236.substring(4,_236.length-1);
var _238=_237.split(",");
return new OpenLayers.Rico.Color(parseInt(_238[0]),parseInt(_238[1]),parseInt(_238[2]));
}else{
if(_236.indexOf("#")==0){
return OpenLayers.Rico.Color.createFromHex(_236);
}else{
return new OpenLayers.Rico.Color(255,255,255);
}
}
};
OpenLayers.Rico.Color.HSBtoRGB=function(hue,_23a,_23b){
var red=0;
var _23d=0;
var blue=0;
if(_23a==0){
red=parseInt(_23b*255+0.5);
_23d=red;
blue=red;
}else{
var h=(hue-Math.floor(hue))*6;
var f=h-Math.floor(h);
var p=_23b*(1-_23a);
var q=_23b*(1-_23a*f);
var t=_23b*(1-(_23a*(1-f)));
switch(parseInt(h)){
case 0:
red=(_23b*255+0.5);
_23d=(t*255+0.5);
blue=(p*255+0.5);
break;
case 1:
red=(q*255+0.5);
_23d=(_23b*255+0.5);
blue=(p*255+0.5);
break;
case 2:
red=(p*255+0.5);
_23d=(_23b*255+0.5);
blue=(t*255+0.5);
break;
case 3:
red=(p*255+0.5);
_23d=(q*255+0.5);
blue=(_23b*255+0.5);
break;
case 4:
red=(t*255+0.5);
_23d=(p*255+0.5);
blue=(_23b*255+0.5);
break;
case 5:
red=(_23b*255+0.5);
_23d=(p*255+0.5);
blue=(q*255+0.5);
break;
}
}
return {r:parseInt(red),g:parseInt(_23d),b:parseInt(blue)};
};
OpenLayers.Rico.Color.RGBtoHSB=function(r,g,b){
var hue;
var _248;
var _249;
var cmax=(r>g)?r:g;
if(b>cmax){
cmax=b;
}
var cmin=(r<g)?r:g;
if(b<cmin){
cmin=b;
}
_249=cmax/255;
if(cmax!=0){
_248=(cmax-cmin)/cmax;
}else{
_248=0;
}
if(_248==0){
hue=0;
}else{
var redc=(cmax-r)/(cmax-cmin);
var _24d=(cmax-g)/(cmax-cmin);
var _24e=(cmax-b)/(cmax-cmin);
if(r==cmax){
hue=_24e-_24d;
}else{
if(g==cmax){
hue=2+redc-_24e;
}else{
hue=4+_24d-redc;
}
}
hue=hue/6;
if(hue<0){
hue=hue+1;
}
}
return {h:hue,s:_248,b:_249};
};
OpenLayers.Control.ArgParser=OpenLayers.Class(OpenLayers.Control,{center:null,zoom:null,layers:null,displayProjection:null,initialize:function(_24f){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},setMap:function(map){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
for(var i=0;i<this.map.controls.length;i++){
var _252=this.map.controls[i];
if((_252!=this)&&(_252.CLASS_NAME=="OpenLayers.Control.ArgParser")){
if(_252.displayProjection!=this.displayProjection){
this.displayProjection=_252.displayProjection;
}
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
if(this.displayProjection){
this.center.transform(this.displayProjection,this.map.getProjectionObject());
}
this.map.setCenter(this.center,this.zoom);
}
},configureLayers:function(){
if(this.layers.length==this.map.layers.length){
this.map.events.unregister("addlayer",this,this.configureLayers);
for(var i=0;i<this.layers.length;i++){
var _255=this.map.layers[i];
var c=this.layers.charAt(i);
if(c=="B"){
this.map.setBaseLayer(_255);
}else{
if((c=="T")||(c=="F")){
_255.setVisibility(c=="T");
}
}
}
}
},CLASS_NAME:"OpenLayers.Control.ArgParser"});
OpenLayers.Control.Attribution=OpenLayers.Class(OpenLayers.Control,{separator:", ",initialize:function(_257){
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
var _258=[];
if(this.map&&this.map.layers){
for(var i=0;i<this.map.layers.length;i++){
var _25a=this.map.layers[i];
if(_25a.attribution&&_25a.getVisibility()){
_258.push(_25a.attribution);
}
}
this.div.innerHTML=_258.join(this.separator);
}
},CLASS_NAME:"OpenLayers.Control.Attribution"});
OpenLayers.Control.LayerSwitcher=OpenLayers.Class(OpenLayers.Control,{activeColor:"darkblue",layerStates:null,layersDiv:null,baseLayersDiv:null,baseLayers:null,dataLbl:null,dataLayersDiv:null,dataLayers:null,minimizeDiv:null,maximizeDiv:null,ascending:true,initialize:function(_25b){
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
},clearLayersArray:function(_25d){
var _25e=this[_25d+"Layers"];
if(_25e){
for(var i=0;i<_25e.length;i++){
var _260=_25e[i];
OpenLayers.Event.stopObservingElement(_260.inputElem);
OpenLayers.Event.stopObservingElement(_260.labelSpan);
}
}
this[_25d+"LayersDiv"].innerHTML="";
this[_25d+"Layers"]=[];
},checkRedraw:function(){
var _261=false;
if(!this.layerStates.length||(this.map.layers.length!=this.layerStates.length)){
_261=true;
}else{
for(var i=0;i<this.layerStates.length;i++){
var _263=this.layerStates[i];
var _264=this.map.layers[i];
if((_263.name!=_264.name)||(_263.inRange!=_264.inRange)||(_263.id!=_264.id)||(_263.visibility!=_264.visibility)){
_261=true;
break;
}
}
}
return _261;
},redraw:function(){
if(!this.checkRedraw()){
return this.div;
}
this.clearLayersArray("base");
this.clearLayersArray("data");
var _265=false;
var _266=false;
this.layerStates=new Array(this.map.layers.length);
for(var i=0;i<this.map.layers.length;i++){
var _268=this.map.layers[i];
this.layerStates[i]={"name":_268.name,"visibility":_268.visibility,"inRange":_268.inRange,"id":_268.id};
}
var _269=this.map.layers.slice();
if(!this.ascending){
_269.reverse();
}
for(var i=0;i<_269.length;i++){
var _268=_269[i];
var _26a=_268.isBaseLayer;
if(_268.displayInLayerSwitcher){
if(_26a){
_266=true;
}else{
_265=true;
}
var _26b=(_26a)?(_268==this.map.baseLayer):_268.getVisibility();
var _26c=document.createElement("input");
_26c.id="input_"+_268.name;
_26c.name=(_26a)?"baseLayers":_268.name;
_26c.type=(_26a)?"radio":"checkbox";
_26c.value=_268.name;
_26c.checked=_26b;
_26c.defaultChecked=_26b;
if(!_26a&&!_268.inRange){
_26c.disabled=true;
}
var _26d={"inputElem":_26c,"layer":_268,"layerSwitcher":this};
OpenLayers.Event.observe(_26c,"mouseup",OpenLayers.Function.bindAsEventListener(this.onInputClick,_26d));
var _26e=document.createElement("span");
if(!_26a&&!_268.inRange){
_26e.style.color="gray";
}
_26e.innerHTML=_268.name;
_26e.style.verticalAlign=(_26a)?"bottom":"baseline";
OpenLayers.Event.observe(_26e,"click",OpenLayers.Function.bindAsEventListener(this.onInputClick,_26d));
var br=document.createElement("br");
var _270=(_26a)?this.baseLayers:this.dataLayers;
_270.push({"layer":_268,"inputElem":_26c,"labelSpan":_26e});
var _271=(_26a)?this.baseLayersDiv:this.dataLayersDiv;
_271.appendChild(_26c);
_271.appendChild(_26e);
_271.appendChild(br);
}
}
this.dataLbl.style.display=(_265)?"":"none";
this.baseLbl.style.display=(_266)?"":"none";
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
var _275=this.baseLayers[i];
if(_275.inputElem.checked){
this.map.setBaseLayer(_275.layer,false);
}
}
for(var i=0;i<this.dataLayers.length;i++){
var _275=this.dataLayers[i];
_275.layer.setVisibility(_275.inputElem.checked);
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
},showControls:function(_278){
this.maximizeDiv.style.display=_278?"":"none";
this.minimizeDiv.style.display=_278?"none":"";
this.layersDiv.style.display=_278?"none":"";
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
var _279=OpenLayers.Util.getImagesLocation();
var sz=new OpenLayers.Size(18,18);
var img=_279+"layer-switcher-maximize.png";
this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MaximizeDiv",null,sz,img,"absolute");
this.maximizeDiv.style.top="5px";
this.maximizeDiv.style.right="0px";
this.maximizeDiv.style.left="";
this.maximizeDiv.style.display="none";
OpenLayers.Event.observe(this.maximizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.maximizeControl,this));
this.div.appendChild(this.maximizeDiv);
var img=_279+"layer-switcher-minimize.png";
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
var _280=!this.performedDrag;
this.performedDrag=false;
return _280;
},defaultDblClick:function(evt){
var _282=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_282,this.map.zoom+1);
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
var _285=Math.abs(this.mouseDragStart.x-evt.xy.x);
var _286=Math.abs(this.mouseDragStart.y-evt.xy.y);
this.zoomBox.style.width=Math.max(1,_285)+"px";
this.zoomBox.style.height=Math.max(1,_286)+"px";
if(evt.xy.x<this.mouseDragStart.x){
this.zoomBox.style.left=evt.xy.x+"px";
}
if(evt.xy.y<this.mouseDragStart.y){
this.zoomBox.style.top=evt.xy.y+"px";
}
}else{
var _285=this.mouseDragStart.x-evt.xy.x;
var _286=this.mouseDragStart.y-evt.xy.y;
var size=this.map.getSize();
var _288=new OpenLayers.Pixel(size.w/2+_285,size.h/2+_286);
var _289=this.map.getLonLatFromViewPortPx(_288);
this.map.setCenter(_289,null,true);
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
var _28f=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
var end=this.map.getLonLatFromViewPortPx(evt.xy);
var top=Math.max(_28f.lat,end.lat);
var _292=Math.min(_28f.lat,end.lat);
var left=Math.min(_28f.lon,end.lon);
var _294=Math.max(_28f.lon,end.lon);
var _295=new OpenLayers.Bounds(left,_292,_294,top);
this.map.zoomToExtent(_295);
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
var _297=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_297=true;
break;
}
elem=elem.parentNode;
}
if(_297){
var _299=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_299=e.wheelDelta/120;
if(window.opera){
_299=-_299;
}
}else{
if(e.detail){
_299=-e.detail/3;
}
}
if(_299){
e.xy=this.mousePosition;
if(_299<0){
this.defaultWheelDown(e);
}else{
this.defaultWheelUp(e);
}
}
OpenLayers.Event.stop(e);
}
},CLASS_NAME:"OpenLayers.Control.MouseDefaults"});
OpenLayers.Control.MousePosition=OpenLayers.Class(OpenLayers.Control,{element:null,prefix:"",separator:", ",suffix:"",numdigits:5,granularity:10,lastXy:null,displayProjection:null,initialize:function(_29a){
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
var _29c;
if(evt==null){
_29c=new OpenLayers.LonLat(0,0);
}else{
if(this.lastXy==null||Math.abs(evt.xy.x-this.lastXy.x)>this.granularity||Math.abs(evt.xy.y-this.lastXy.y)>this.granularity){
this.lastXy=evt.xy;
return;
}
_29c=this.map.getLonLatFromPixel(evt.xy);
if(!_29c){
return;
}
if(this.displayProjection){
_29c.transform(this.map.getProjectionObject(),this.displayProjection);
}
this.lastXy=evt.xy;
}
var _29d=parseInt(this.numdigits);
var _29e=this.prefix+_29c.lon.toFixed(_29d)+this.separator+_29c.lat.toFixed(_29d)+this.suffix;
if(_29e!=this.element.innerHTML){
this.element.innerHTML=_29e;
}
},setMap:function(){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
this.map.events.register("mousemove",this,this.redraw);
},CLASS_NAME:"OpenLayers.Control.MousePosition"});
OpenLayers.Control.PanZoom=OpenLayers.Class(OpenLayers.Control,{slideFactor:50,buttons:null,position:null,initialize:function(_29f){
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
var _2a3=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
this._addButton("panup","north-mini.png",_2a3,sz);
px.y=_2a3.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
this._addButton("panright","east-mini.png",px.add(sz.w,0),sz);
this._addButton("pandown","south-mini.png",_2a3.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_2a3.add(0,sz.h*3+5),sz);
this._addButton("zoomworld","zoom-world-mini.png",_2a3.add(0,sz.h*4+5),sz);
this._addButton("zoomout","zoom-minus-mini.png",_2a3.add(0,sz.h*5+5),sz);
return this.div;
},_addButton:function(id,img,xy,sz){
var _2a8=OpenLayers.Util.getImagesLocation()+img;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_PanZoom_"+id,xy,sz,_2a8,"absolute");
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
this.map.pan(0,-this.slideFactor);
break;
case "pandown":
this.map.pan(0,this.slideFactor);
break;
case "panleft":
this.map.pan(-this.slideFactor,0);
break;
case "panright":
this.map.pan(this.slideFactor,0);
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
OpenLayers.Control.Panel=OpenLayers.Class(OpenLayers.Control,{controls:null,defaultControl:null,initialize:function(_2ac){
OpenLayers.Control.prototype.initialize.apply(this,[_2ac]);
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
var _2b2=this.controls[i].panel_div;
if(this.controls[i].active){
_2b2.className=this.controls[i].displayClass+"ItemActive";
}else{
_2b2.className=this.controls[i].displayClass+"ItemInactive";
}
this.div.appendChild(_2b2);
}
}
},activateControl:function(_2b3){
if(!this.active){
return false;
}
if(_2b3.type==OpenLayers.Control.TYPE_BUTTON){
_2b3.trigger();
return;
}
if(_2b3.type==OpenLayers.Control.TYPE_TOGGLE){
if(_2b3.active){
_2b3.deactivate();
}else{
_2b3.activate();
}
return;
}
for(var i=0;i<this.controls.length;i++){
if(this.controls[i]==_2b3){
_2b3.activate();
}else{
if(this.controls[i].type!=OpenLayers.Control.TYPE_TOGGLE){
this.controls[i].deactivate();
}
}
}
this.redraw();
},addControls:function(_2b5){
if(!(_2b5 instanceof Array)){
_2b5=[_2b5];
}
this.controls=this.controls.concat(_2b5);
for(var i=0;i<_2b5.length;i++){
var _2b7=document.createElement("div");
var _2b8=document.createTextNode(" ");
_2b5[i].panel_div=_2b7;
OpenLayers.Event.observe(_2b5[i].panel_div,"click",OpenLayers.Function.bind(this.onClick,this,_2b5[i]));
OpenLayers.Event.observe(_2b5[i].panel_div,"mousedown",OpenLayers.Function.bindAsEventListener(OpenLayers.Event.stop));
}
if(this.map){
for(var i=0;i<_2b5.length;i++){
this.map.addControl(_2b5[i]);
_2b5[i].deactivate();
}
this.redraw();
}
},onClick:function(ctrl,evt){
OpenLayers.Event.stop(evt?evt:window.event);
this.activateControl(ctrl);
},getControlsBy:function(_2bb,_2bc){
var test=(typeof _2bc.test=="function");
var _2be=OpenLayers.Array.filter(this.controls,function(item){
return item[_2bb]==_2bc||(test&&_2bc.test(item[_2bb]));
});
return _2be;
},getControlsByName:function(_2c0){
return this.getControlsBy("name",_2c0);
},getControlsByClass:function(_2c1){
return this.getControlsBy("CLASS_NAME",_2c1);
},CLASS_NAME:"OpenLayers.Control.Panel"});
OpenLayers.Control.Permalink=OpenLayers.Class(OpenLayers.Control,{element:null,base:"",displayProjection:null,initialize:function(_2c2,base,_2c4){
OpenLayers.Control.prototype.initialize.apply(this,[_2c4]);
this.element=OpenLayers.Util.getElement(_2c2);
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
var _2c7=this.map.controls[i];
if(_2c7.CLASS_NAME=="OpenLayers.Control.ArgParser"){
if(_2c7.displayProjection!=this.displayProjection){
this.displayProjection=_2c7.displayProjection;
}
break;
}
}
if(i==this.map.controls.length){
this.map.addControl(new OpenLayers.Control.ArgParser({"displayProjection":this.displayProjection}));
}
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
if(!this.element){
this.div.className=this.displayClass;
this.element=document.createElement("a");
this.element.innerHTML="Permalink";
this.element.href="";
this.div.appendChild(this.element);
}
this.map.events.register("moveend",this,this.updateLink);
this.map.events.register("changelayer",this,this.updateLink);
this.map.events.register("changebaselayer",this,this.updateLink);
return this.div;
},updateLink:function(){
var _2c8=this.map.getCenter();
if(!_2c8){
return;
}
var _2c9=OpenLayers.Util.getParameters(this.base);
_2c9.zoom=this.map.getZoom();
var lat=_2c8.lat;
var lon=_2c8.lon;
if(this.displayProjection){
var _2cc=OpenLayers.Projection.transform({x:lon,y:lat},this.map.getProjectionObject(),this.displayProjection);
lon=_2cc.x;
lat=_2cc.y;
}
_2c9.lat=Math.round(lat*100000)/100000;
_2c9.lon=Math.round(lon*100000)/100000;
_2c9.layers="";
for(var i=0;i<this.map.layers.length;i++){
var _2ce=this.map.layers[i];
if(_2ce.isBaseLayer){
_2c9.layers+=(_2ce==this.map.baseLayer)?"B":"0";
}else{
_2c9.layers+=(_2ce.getVisibility())?"T":"F";
}
}
var href=this.base;
if(href.indexOf("?")!=-1){
href=href.substring(0,href.indexOf("?"));
}
href+="?"+OpenLayers.Util.getParameterString(_2c9);
this.element.href=href;
},CLASS_NAME:"OpenLayers.Control.Permalink"});
OpenLayers.Control.Scale=OpenLayers.Class(OpenLayers.Control,{element:null,initialize:function(_2d0,_2d1){
OpenLayers.Control.prototype.initialize.apply(this,[_2d1]);
this.element=OpenLayers.Util.getElement(_2d0);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
if(!this.element){
this.element=document.createElement("div");
this.div.className=this.displayClass;
this.div.appendChild(this.element);
}
this.map.events.register("moveend",this,this.updateScale);
this.updateScale();
return this.div;
},updateScale:function(){
var _2d2=this.map.getScale();
if(!_2d2){
return;
}
if(_2d2>=9500&&_2d2<=950000){
_2d2=Math.round(_2d2/1000)+"K";
}else{
if(_2d2>=950000){
_2d2=Math.round(_2d2/1000000)+"M";
}else{
_2d2=Math.round(_2d2);
}
}
this.element.innerHTML="Scale = 1 : "+_2d2;
},CLASS_NAME:"OpenLayers.Control.Scale"});
OpenLayers.Control.ZoomToMaxExtent=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
if(this.map){
this.map.zoomToMaxExtent();
}
},CLASS_NAME:"OpenLayers.Control.ZoomToMaxExtent"});
OpenLayers.Event={observers:false,KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,element:function(_2d3){
return _2d3.target||_2d3.srcElement;
},isLeftClick:function(_2d4){
return (((_2d4.which)&&(_2d4.which==1))||((_2d4.button)&&(_2d4.button==1)));
},stop:function(_2d5,_2d6){
if(!_2d6){
if(_2d5.preventDefault){
_2d5.preventDefault();
}else{
_2d5.returnValue=false;
}
}
if(_2d5.stopPropagation){
_2d5.stopPropagation();
}else{
_2d5.cancelBubble=true;
}
},findElement:function(_2d7,_2d8){
var _2d9=OpenLayers.Event.element(_2d7);
while(_2d9.parentNode&&(!_2d9.tagName||(_2d9.tagName.toUpperCase()!=_2d8.toUpperCase()))){
_2d9=_2d9.parentNode;
}
return _2d9;
},observe:function(_2da,name,_2dc,_2dd){
var _2de=OpenLayers.Util.getElement(_2da);
_2dd=_2dd||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_2de.attachEvent)){
name="keydown";
}
if(!this.observers){
this.observers={};
}
if(!_2de._eventCacheID){
var _2df="eventCacheID_";
if(_2de.id){
_2df=_2de.id+"_"+_2df;
}
_2de._eventCacheID=OpenLayers.Util.createUniqueID(_2df);
}
var _2e0=_2de._eventCacheID;
if(!this.observers[_2e0]){
this.observers[_2e0]=[];
}
this.observers[_2e0].push({"element":_2de,"name":name,"observer":_2dc,"useCapture":_2dd});
if(_2de.addEventListener){
_2de.addEventListener(name,_2dc,_2dd);
}else{
if(_2de.attachEvent){
_2de.attachEvent("on"+name,_2dc);
}
}
},stopObservingElement:function(_2e1){
var _2e2=OpenLayers.Util.getElement(_2e1);
var _2e3=_2e2._eventCacheID;
this._removeElementObservers(OpenLayers.Event.observers[_2e3]);
},_removeElementObservers:function(_2e4){
if(_2e4){
for(var i=_2e4.length-1;i>=0;i--){
var _2e6=_2e4[i];
var args=new Array(_2e6.element,_2e6.name,_2e6.observer,_2e6.useCapture);
var _2e8=OpenLayers.Event.stopObserving.apply(this,args);
}
}
},stopObserving:function(_2e9,name,_2eb,_2ec){
_2ec=_2ec||false;
var _2ed=OpenLayers.Util.getElement(_2e9);
var _2ee=_2ed._eventCacheID;
if(name=="keypress"){
if(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_2ed.detachEvent){
name="keydown";
}
}
var _2ef=false;
var _2f0=OpenLayers.Event.observers[_2ee];
if(_2f0){
var i=0;
while(!_2ef&&i<_2f0.length){
var _2f2=_2f0[i];
if((_2f2.name==name)&&(_2f2.observer==_2eb)&&(_2f2.useCapture==_2ec)){
_2f0.splice(i,1);
if(_2f0.length==0){
delete OpenLayers.Event.observers[_2ee];
}
_2ef=true;
break;
}
i++;
}
}
if(_2ef){
if(_2ed.removeEventListener){
_2ed.removeEventListener(name,_2eb,_2ec);
}else{
if(_2ed&&_2ed.detachEvent){
_2ed.detachEvent("on"+name,_2eb);
}
}
}
return _2ef;
},unloadCache:function(){
if(OpenLayers.Event.observers){
for(var _2f3 in OpenLayers.Event.observers){
var _2f4=OpenLayers.Event.observers[_2f3];
OpenLayers.Event._removeElementObservers.apply(this,[_2f4]);
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
OpenLayers.Events=OpenLayers.Class({BROWSER_EVENTS:["mouseover","mouseout","mousedown","mouseup","mousemove","click","dblclick","resize","focus","blur"],listeners:null,object:null,element:null,eventTypes:null,eventHandler:null,fallThrough:null,initialize:function(_2f5,_2f6,_2f7,_2f8){
this.object=_2f5;
this.element=_2f6;
this.eventTypes=_2f7;
this.fallThrough=_2f8;
this.listeners={};
this.eventHandler=OpenLayers.Function.bindAsEventListener(this.handleBrowserEvent,this);
if(this.eventTypes!=null){
for(var i=0;i<this.eventTypes.length;i++){
this.addEventType(this.eventTypes[i]);
}
}
if(this.element!=null){
this.attachToElement(_2f6);
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
},addEventType:function(_2fa){
if(!this.listeners[_2fa]){
this.listeners[_2fa]=[];
}
},attachToElement:function(_2fb){
for(var i=0;i<this.BROWSER_EVENTS.length;i++){
var _2fd=this.BROWSER_EVENTS[i];
this.addEventType(_2fd);
OpenLayers.Event.observe(_2fb,_2fd,this.eventHandler);
}
OpenLayers.Event.observe(_2fb,"dragstart",OpenLayers.Event.stop);
},register:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _301=this.listeners[type];
if(_301!=null){
_301.push({obj:obj,func:func});
}
}
},registerPriority:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _305=this.listeners[type];
if(_305!=null){
_305.unshift({obj:obj,func:func});
}
}
},unregister:function(type,obj,func){
if(obj==null){
obj=this.object;
}
var _309=this.listeners[type];
if(_309!=null){
for(var i=0;i<_309.length;i++){
if(_309[i].obj==obj&&_309[i].func==func){
_309.splice(i,1);
break;
}
}
}
},remove:function(type){
if(this.listeners[type]!=null){
this.listeners[type]=[];
}
},triggerEvent:function(type,evt,args){
if(evt==null){
evt={};
}
evt.object=this.object;
evt.element=this.element;
if(!args){
args=[evt];
}else{
args.unshift(evt);
}
var _30f=(this.listeners[type])?this.listeners[type].slice():null;
if((_30f!=null)&&(_30f.length>0)){
var _310;
for(var i=0;i<_30f.length;i++){
var _312=_30f[i];
_310=_312.func.apply(_312.obj,args);
if((_310!=undefined)&&(_310==false)){
break;
}
}
if(!this.fallThrough){
OpenLayers.Event.stop(evt,true);
}
}
return _310;
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
OpenLayers.Format=OpenLayers.Class({externalProjection:null,internalProjection:null,initialize:function(_315){
OpenLayers.Util.extend(this,_315);
},read:function(data){
alert("Read not implemented.");
},write:function(_317){
alert("Write not implemented.");
},CLASS_NAME:"OpenLayers.Format"});
OpenLayers.Popup.Anchored=OpenLayers.Class(OpenLayers.Popup,{relativePosition:null,anchor:null,initialize:function(id,_319,size,_31b,_31c,_31d,_31e){
var _31f=new Array(id,_319,size,_31b,_31d,_31e);
OpenLayers.Popup.prototype.initialize.apply(this,_31f);
this.anchor=(_31c!=null)?_31c:{size:new OpenLayers.Size(0,0),offset:new OpenLayers.Pixel(0,0)};
},draw:function(px){
if(px==null){
if((this.lonlat!=null)&&(this.map!=null)){
px=this.map.getLayerPxFromLonLat(this.lonlat);
}
}
this.relativePosition=this.calculateRelativePosition(px);
return OpenLayers.Popup.prototype.draw.apply(this,arguments);
},calculateRelativePosition:function(px){
var _322=this.map.getLonLatFromLayerPx(px);
var _323=this.map.getExtent();
var _324=_323.determineQuadrant(_322);
return OpenLayers.Bounds.oppositeQuadrant(_324);
},moveTo:function(px){
this.relativePosition=this.calculateRelativePosition(px);
var _326=this.calculateNewPx(px);
var _327=new Array(_326);
OpenLayers.Popup.prototype.moveTo.apply(this,_327);
},setSize:function(size){
OpenLayers.Popup.prototype.setSize.apply(this,arguments);
if((this.lonlat)&&(this.map)){
var px=this.map.getLayerPxFromLonLat(this.lonlat);
this.moveTo(px);
}
},calculateNewPx:function(px){
var _32b=px.offset(this.anchor.offset);
var top=(this.relativePosition.charAt(0)=="t");
_32b.y+=(top)?-this.size.h:this.anchor.size.h;
var left=(this.relativePosition.charAt(1)=="l");
_32b.x+=(left)?-this.size.w:this.anchor.size.w;
return _32b;
},CLASS_NAME:"OpenLayers.Popup.Anchored"});
OpenLayers.Projection=OpenLayers.Class({proj:null,projCode:null,initialize:function(_32e,_32f){
OpenLayers.Util.extend(this,_32f);
this.projCode=_32e;
if(window.Proj4js){
this.proj=new Proj4js.Proj(_32e);
}
},getCode:function(){
return this.proj?this.proj.srsCode:this.projCode;
},getUnits:function(){
return this.proj?this.proj.units:null;
},toString:function(){
return this.getCode();
},equals:function(_330){
return this.getCode()==_330.getCode();
},destroy:function(){
delete this.proj;
delete this.projCode;
},CLASS_NAME:"OpenLayers.Projection"});
OpenLayers.Projection.transforms={};
OpenLayers.Projection.addTransform=function(from,to,_333){
if(!OpenLayers.Projection.transforms[from]){
OpenLayers.Projection.transforms[from]={};
}
OpenLayers.Projection.transforms[from][to]=_333;
};
OpenLayers.Projection.transform=function(_334,_335,dest){
if(_335.proj&&dest.proj){
_334=Proj4js.transform(_335.proj,dest.proj,_334);
}else{
if(_335&&dest&&OpenLayers.Projection.transforms[_335.getCode()]&&OpenLayers.Projection.transforms[_335.getCode()][dest.getCode()]){
OpenLayers.Projection.transforms[_335.getCode()][dest.getCode()](_334);
}
}
return _334;
};
OpenLayers.Renderer.Elements=OpenLayers.Class(OpenLayers.Renderer,{rendererRoot:null,root:null,xmlns:null,initialize:function(_337){
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
},getNodeType:function(_338,_339){
},drawGeometry:function(_33a,_33b,_33c){
if(typeof _33a=="undefined"){
return false;
}
var _33d=_33a.CLASS_NAME;
if((_33d=="OpenLayers.Geometry.Collection")||(_33d=="OpenLayers.Geometry.MultiPoint")||(_33d=="OpenLayers.Geometry.MultiLineString")||(_33d=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_33a.components.length;i++){
this.drawGeometry(_33a.components[i],_33b,_33c);
}
return;
}
if(_33b.display!="none"){
var _33f=this.getNodeType(_33a,_33b);
var node=this.nodeFactory(_33a.id,_33f);
node._featureId=_33c;
node._geometryClass=_33a.CLASS_NAME;
node._style=_33b;
node=this.drawGeometryNode(node,_33a);
this.root.appendChild(node);
this.postDraw(node);
}else{
node=OpenLayers.Util.getElement(_33a.id);
if(node){
node.parentNode.removeChild(node);
}
}
},drawGeometryNode:function(node,_342,_343){
_343=_343||node._style;
var _344={"isFilled":true,"isStroked":true};
switch(_342.CLASS_NAME){
case "OpenLayers.Geometry.Point":
this.drawPoint(node,_342);
break;
case "OpenLayers.Geometry.LineString":
_344.isFilled=false;
this.drawLineString(node,_342);
break;
case "OpenLayers.Geometry.LinearRing":
this.drawLinearRing(node,_342);
break;
case "OpenLayers.Geometry.Polygon":
this.drawPolygon(node,_342);
break;
case "OpenLayers.Geometry.Surface":
this.drawSurface(node,_342);
break;
case "OpenLayers.Geometry.Rectangle":
this.drawRectangle(node,_342);
break;
default:
break;
}
node._style=_343;
node._options=_344;
return this.setStyle(node,_343,_344,_342);
},postDraw:function(node){
},drawPoint:function(node,_347){
},drawLineString:function(node,_349){
},drawLinearRing:function(node,_34b){
},drawPolygon:function(node,_34d){
},drawRectangle:function(node,_34f){
},drawCircle:function(node,_351){
},drawSurface:function(node,_353){
},getFeatureIdFromEvent:function(evt){
var node=evt.target||evt.srcElement;
return node._featureId;
},eraseGeometry:function(_356){
if((_356.CLASS_NAME=="OpenLayers.Geometry.MultiPoint")||(_356.CLASS_NAME=="OpenLayers.Geometry.MultiLineString")||(_356.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_356.components.length;i++){
this.eraseGeometry(_356.components[i]);
}
}else{
var _358=OpenLayers.Util.getElement(_356.id);
if(_358&&_358.parentNode){
_358.parentNode.removeChild(_358);
}
}
},nodeFactory:function(id,type){
var node=OpenLayers.Util.getElement(id);
if(node){
if(!this.nodeTypeCompare(node,type)){
node.parentNode.removeChild(node);
node=this.nodeFactory(id,type);
}
}else{
node=this.createNode(type,id);
}
return node;
},CLASS_NAME:"OpenLayers.Renderer.Elements"});
OpenLayers.Tile=OpenLayers.Class({EVENT_TYPES:["loadstart","loadend","reload"],events:null,id:null,layer:null,url:null,bounds:null,size:null,position:null,isLoading:false,initialize:function(_35c,_35d,_35e,url,size){
this.layer=_35c;
this.position=_35d.clone();
this.bounds=_35e.clone();
this.url=url;
this.size=size.clone();
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
var _361=this.layer.maxExtent;
var _362=(_361&&this.bounds.intersectsBounds(_361,false));
return (_362||this.layer.displayOutsideMaxExtent);
},moveTo:function(_363,_364,_365){
if(_365==null){
_365=true;
}
this.bounds=_363.clone();
this.position=_364.clone();
if(_365){
this.draw();
}
},clear:function(){
},getBoundsFromBaseLayer:function(_366){
OpenLayers.Console.warn("You are using the 'reproject' option "+"on the "+this.layer.name+" layer. This option is deprecated: "+"its use was designed to support displaying data over commercial "+"basemaps, but that functionality should now be achieved by using "+"Spherical Mercator support. More information is available from "+"http://trac.openlayers.org/wiki/SphericalMercator.");
var _367=this.layer.map.getLonLatFromLayerPx(_366);
var _368=_366.clone();
_368.x+=this.size.w;
_368.y+=this.size.h;
var _369=this.layer.map.getLonLatFromLayerPx(_368);
if(_367.lon>_369.lon){
if(_367.lon<0){
_367.lon=-180-(_367.lon+180);
}else{
_369.lon=180+_369.lon+180;
}
}
var _36a=new OpenLayers.Bounds(_367.lon,_369.lat,_369.lon,_367.lat);
return _36a;
},CLASS_NAME:"OpenLayers.Tile"});
OpenLayers.Control.MouseToolbar=OpenLayers.Class(OpenLayers.Control.MouseDefaults,{mode:null,buttons:null,direction:"vertical",buttonClicked:null,initialize:function(_36b,_36c){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.position=new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,OpenLayers.Control.MouseToolbar.Y);
if(_36b){
this.position=_36b;
}
if(_36c){
this.direction=_36c;
}
this.measureDivs=[];
},destroy:function(){
for(var _36d in this.buttons){
var btn=this.buttons[_36d];
btn.map=null;
btn.events.destroy();
}
OpenLayers.Control.MouseDefaults.prototype.destroy.apply(this,arguments);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
OpenLayers.Control.MouseDefaults.prototype.draw.apply(this,arguments);
this.buttons={};
var sz=new OpenLayers.Size(28,28);
var _370=new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,0);
this._addButton("zoombox","drag-rectangle-off.png","drag-rectangle-on.png",_370,sz,"Shift->Drag to zoom to area");
_370=_370.add((this.direction=="vertical"?0:sz.w),(this.direction=="vertical"?sz.h:0));
this._addButton("pan","panning-hand-off.png","panning-hand-on.png",_370,sz,"Drag the map to pan.");
_370=_370.add((this.direction=="vertical"?0:sz.w),(this.direction=="vertical"?sz.h:0));
this.switchModeTo("pan");
return this.div;
},_addButton:function(id,img,_373,xy,sz,_376){
var _377=OpenLayers.Util.getImagesLocation()+img;
var _378=OpenLayers.Util.getImagesLocation()+_373;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MouseToolbar_"+id,xy,sz,_377,"absolute");
this.div.appendChild(btn);
btn.imgLocation=_377;
btn.activeImgLocation=_378;
btn.events=new OpenLayers.Events(this,btn,null,true);
btn.events.register("mousedown",this,this.buttonDown);
btn.events.register("mouseup",this,this.buttonUp);
btn.events.register("dblclick",this,OpenLayers.Event.stop);
btn.action=id;
btn.title=_376;
btn.alt=_376;
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
var _37d=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_37d,this.map.zoom+1);
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
var _37f="";
if(this.measureStart){
var _380=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
_37f=OpenLayers.Util.distVincenty(this.measureStart,_380);
_37f=Math.round(_37f*100)/100;
_37f=_37f+"km";
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
if(_37f){
this.measureBoxDistance=OpenLayers.Util.createDiv(null,this.mouseDragStart.add(-2-parseInt(this.map.layerContainerDiv.style.left),2-parseInt(this.map.layerContainerDiv.style.top)),null,null,"absolute");
this.measureBoxDistance.innerHTML=_37f;
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
var _384=Math.abs(this.mouseDragStart.x-evt.xy.x);
var _385=Math.abs(this.mouseDragStart.y-evt.xy.y);
this.zoomBox.style.width=Math.max(1,_384)+"px";
this.zoomBox.style.height=Math.max(1,_385)+"px";
if(evt.xy.x<this.mouseDragStart.x){
this.zoomBox.style.left=evt.xy.x+"px";
}
if(evt.xy.y<this.mouseDragStart.y){
this.zoomBox.style.top=evt.xy.y+"px";
}
break;
default:
var _384=this.mouseDragStart.x-evt.xy.x;
var _385=this.mouseDragStart.y-evt.xy.y;
var size=this.map.getSize();
var _387=new OpenLayers.Pixel(size.w/2+_384,size.h/2+_385);
var _388=this.map.getLonLatFromViewPortPx(_387);
this.map.setCenter(_388,null,true);
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
},CLASS_NAME:"OpenLayers.Control.MouseToolbar"});
OpenLayers.Control.MouseToolbar.X=6;
OpenLayers.Control.MouseToolbar.Y=300;
OpenLayers.Control.OverviewMap=OpenLayers.Class(OpenLayers.Control,{element:null,ovmap:null,size:new OpenLayers.Size(180,90),layers:null,minRectSize:15,minRectDisplayClass:"RectReplacement",minRatio:8,maxRatio:32,mapOptions:null,dragHandler:null,initialize:function(_38c){
this.layers=[];
OpenLayers.Control.prototype.initialize.apply(this,[_38c]);
},destroy:function(){
if(!this.mapDiv){
return;
}
this.dragHandler.destroy();
this.clickHandler.destroy();
this.mapDiv.removeChild(this.extentRectangle);
this.extentRectangle=null;
this.rectEvents.destroy();
this.rectEvents=null;
this.ovmap.destroy();
this.ovmap=null;
this.element.removeChild(this.mapDiv);
this.mapDiv=null;
this.div.removeChild(this.element);
this.element=null;
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
var _38d=this.map.baseLayer.clone();
this.layers=[_38d];
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
this.extentRectangle.className=this.displayClass+"ExtentRectangle";
this.mapDiv.appendChild(this.extentRectangle);
this.element.appendChild(this.mapDiv);
this.div.appendChild(this.element);
this.map.events.register("moveend",this,this.update);
if(!this.outsideViewport){
this.div.className=this.displayClass+"Container";
var _38e=OpenLayers.Util.getImagesLocation();
var img=_38e+"layer-switcher-maximize.png";
this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv(this.displayClass+"MaximizeButton",null,new OpenLayers.Size(18,18),img,"absolute");
this.maximizeDiv.style.display="none";
this.maximizeDiv.className=this.displayClass+"MaximizeButton";
OpenLayers.Event.observe(this.maximizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.maximizeControl,this));
this.div.appendChild(this.maximizeDiv);
var img=_38e+"layer-switcher-minimize.png";
this.minimizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_minimizeDiv",null,new OpenLayers.Size(18,18),img,"absolute");
this.minimizeDiv.style.display="none";
this.minimizeDiv.className=this.displayClass+"MinimizeButton";
OpenLayers.Event.observe(this.minimizeDiv,"click",OpenLayers.Function.bindAsEventListener(this.minimizeControl,this));
this.div.appendChild(this.minimizeDiv);
var _390=["dblclick","mousedown"];
for(var i=0;i<_390.length;i++){
OpenLayers.Event.observe(this.maximizeDiv,_390[i],OpenLayers.Event.stop);
OpenLayers.Event.observe(this.minimizeDiv,_390[i],OpenLayers.Event.stop);
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
},rectDrag:function(px){
var _393=this.dragHandler.last.x-px.x;
var _394=this.dragHandler.last.y-px.y;
if(_393!=0||_394!=0){
var _395=this.rectPxBounds.top;
var _396=this.rectPxBounds.left;
var _397=Math.abs(this.rectPxBounds.getHeight());
var _398=this.rectPxBounds.getWidth();
var _399=Math.max(0,(_395-_394));
_399=Math.min(_399,this.ovmap.size.h-this.hComp-_397);
var _39a=Math.max(0,(_396-_393));
_39a=Math.min(_39a,this.ovmap.size.w-this.wComp-_398);
this.setRectPxBounds(new OpenLayers.Bounds(_39a,_399+_397,_39a+_398,_399));
}
},mapDivClick:function(evt){
var _39c=this.rectPxBounds.getCenterPixel();
var _39d=evt.xy.x-_39c.x;
var _39e=evt.xy.y-_39c.y;
var top=this.rectPxBounds.top;
var left=this.rectPxBounds.left;
var _3a1=Math.abs(this.rectPxBounds.getHeight());
var _3a2=this.rectPxBounds.getWidth();
var _3a3=Math.max(0,(top+_39e));
_3a3=Math.min(_3a3,this.ovmap.size.h-_3a1);
var _3a4=Math.max(0,(left+_39d));
_3a4=Math.min(_3a4,this.ovmap.size.w-_3a2);
this.setRectPxBounds(new OpenLayers.Bounds(_3a4,_3a3+_3a1,_3a4+_3a2,_3a3));
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
},showToggle:function(_3a7){
this.maximizeDiv.style.display=_3a7?"":"none";
this.minimizeDiv.style.display=_3a7?"none":"";
},update:function(){
if(this.ovmap==null){
this.createMap();
}
if(!this.isSuitableOverview()){
this.updateOverview();
}
this.updateRectToMap();
},isSuitableOverview:function(){
var _3a8=this.map.getExtent();
var _3a9=this.map.maxExtent;
var _3aa=new OpenLayers.Bounds(Math.max(_3a8.left,_3a9.left),Math.max(_3a8.bottom,_3a9.bottom),Math.min(_3a8.right,_3a9.right),Math.min(_3a8.top,_3a9.top));
var _3ab=this.ovmap.getResolution()/this.map.getResolution();
return ((_3ab>this.minRatio)&&(_3ab<=this.maxRatio)&&(this.ovmap.getExtent().containsBounds(_3aa)));
},updateOverview:function(){
var _3ac=this.map.getResolution();
var _3ad=this.ovmap.getResolution();
var _3ae=_3ad/_3ac;
if(_3ae>this.maxRatio){
_3ad=this.minRatio*_3ac;
}else{
if(_3ae<=this.minRatio){
_3ad=this.maxRatio*_3ac;
}
}
this.ovmap.setCenter(this.map.center,this.ovmap.getZoomForResolution(_3ad));
this.updateRectToMap();
},createMap:function(){
var _3af=OpenLayers.Util.extend({controls:[],maxResolution:"auto"},this.mapOptions);
this.ovmap=new OpenLayers.Map(this.mapDiv,_3af);
this.ovmap.addLayers(this.layers);
this.ovmap.zoomToMaxExtent();
this.wComp=parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-left-width"))+parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-right-width"));
this.wComp=(this.wComp)?this.wComp:2;
this.hComp=parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-top-width"))+parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-bottom-width"));
this.hComp=(this.hComp)?this.hComp:2;
this.dragHandler=new OpenLayers.Handler.Drag(this,{move:this.rectDrag,done:this.updateMapToRect},{map:this.ovmap});
this.clickHandler=new OpenLayers.Handler.Click(this,{"click":this.mapDivClick},{"single":true,"double":false,"stopSingle":true,"stopDouble":true,"pixelTolerance":1,map:this.ovmap});
this.clickHandler.activate();
this.rectEvents=new OpenLayers.Events(this,this.extentRectangle,null,true);
this.rectEvents.register("mouseover",this,function(e){
if(!this.dragHandler.active&&!this.map.dragging){
this.clickHandler.deactivate();
this.dragHandler.activate();
this.clickHandler.activate();
}
});
this.rectEvents.register("mouseout",this,function(e){
if(!this.dragHandler.dragging){
this.dragHandler.deactivate();
}
});
},updateRectToMap:function(){
if(this.map.units!="degrees"){
if(this.ovmap.getProjection()&&(this.map.getProjection()!=this.ovmap.getProjection())){
alert("The overview map only works when it is in the same projection as the main map");
}
}
var _3b2=this.getRectBoundsFromMapBounds(this.map.getExtent());
if(_3b2){
this.setRectPxBounds(_3b2);
}
},updateMapToRect:function(){
var _3b3=this.getMapBoundsFromRectBounds(this.rectPxBounds);
this.map.setCenter(_3b3.getCenterLonLat(),this.map.zoom);
},setRectPxBounds:function(_3b4){
var top=Math.max(_3b4.top,0);
var left=Math.max(_3b4.left,0);
var _3b7=Math.min(_3b4.top+Math.abs(_3b4.getHeight()),this.ovmap.size.h-this.hComp);
var _3b8=Math.min(_3b4.left+_3b4.getWidth(),this.ovmap.size.w-this.wComp);
var _3b9=Math.max(_3b8-left,0);
var _3ba=Math.max(_3b7-top,0);
if(_3b9<this.minRectSize||_3ba<this.minRectSize){
this.extentRectangle.className=this.displayClass+this.minRectDisplayClass;
var _3bb=left+(_3b9/2)-(this.minRectSize/2);
var rTop=top+(_3ba/2)-(this.minRectSize/2);
this.extentRectangle.style.top=Math.round(rTop)+"px";
this.extentRectangle.style.left=Math.round(_3bb)+"px";
this.extentRectangle.style.height=this.minRectSize+"px";
this.extentRectangle.style.width=this.minRectSize+"px";
}else{
this.extentRectangle.className=this.displayClass+"ExtentRectangle";
this.extentRectangle.style.top=Math.round(top)+"px";
this.extentRectangle.style.left=Math.round(left)+"px";
this.extentRectangle.style.height=Math.round(_3ba)+"px";
this.extentRectangle.style.width=Math.round(_3b9)+"px";
}
this.rectPxBounds=new OpenLayers.Bounds(Math.round(left),Math.round(_3b7),Math.round(_3b8),Math.round(top));
},getRectBoundsFromMapBounds:function(_3bd){
var _3be=new OpenLayers.LonLat(_3bd.left,_3bd.bottom);
var _3bf=new OpenLayers.LonLat(_3bd.right,_3bd.top);
var _3c0=this.getOverviewPxFromLonLat(_3be);
var _3c1=this.getOverviewPxFromLonLat(_3bf);
var _3c2=null;
if(_3c0&&_3c1){
_3c2=new OpenLayers.Bounds(_3c0.x,_3c0.y,_3c1.x,_3c1.y);
}
return _3c2;
},getMapBoundsFromRectBounds:function(_3c3){
var _3c4=new OpenLayers.Pixel(_3c3.left,_3c3.bottom);
var _3c5=new OpenLayers.Pixel(_3c3.right,_3c3.top);
var _3c6=this.getLonLatFromOverviewPx(_3c4);
var _3c7=this.getLonLatFromOverviewPx(_3c5);
return new OpenLayers.Bounds(_3c6.lon,_3c6.lat,_3c7.lon,_3c7.lat);
},getLonLatFromOverviewPx:function(_3c8){
var size=this.ovmap.size;
var res=this.ovmap.getResolution();
var _3cb=this.ovmap.getExtent().getCenterLonLat();
var _3cc=_3c8.x-(size.w/2);
var _3cd=_3c8.y-(size.h/2);
return new OpenLayers.LonLat(_3cb.lon+_3cc*res,_3cb.lat-_3cd*res);
},getOverviewPxFromLonLat:function(_3ce){
var res=this.ovmap.getResolution();
var _3d0=this.ovmap.getExtent();
var px=null;
if(_3d0){
px=new OpenLayers.Pixel(Math.round(1/res*(_3ce.lon-_3d0.left)),Math.round(1/res*(_3d0.top-_3ce.lat)));
}
return px;
},CLASS_NAME:"OpenLayers.Control.OverviewMap"});
OpenLayers.Control.PanZoomBar=OpenLayers.Class(OpenLayers.Control.PanZoom,{zoomStopWidth:18,zoomStopHeight:11,slider:null,sliderEvents:null,zoomBarDiv:null,divEvents:null,zoomWorldIcon:false,initialize:function(){
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
var _3d5=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
var _3d6=sz.w;
if(this.zoomWorldIcon){
_3d5=new OpenLayers.Pixel(px.x+sz.w,px.y);
}
this._addButton("panup","north-mini.png",_3d5,sz);
px.y=_3d5.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
if(this.zoomWorldIcon){
this._addButton("zoomworld","zoom-world-mini.png",px.add(sz.w,0),sz);
_3d6*=2;
}
this._addButton("panright","east-mini.png",px.add(_3d6,0),sz);
this._addButton("pandown","south-mini.png",_3d5.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_3d5.add(0,sz.h*3+5),sz);
_3d5=this._addZoomBar(_3d5.add(0,sz.h*4+5));
this._addButton("zoomout","zoom-minus-mini.png",_3d5,sz);
return this.div;
},_addZoomBar:function(_3d7){
var _3d8=OpenLayers.Util.getImagesLocation();
var id="OpenLayers_Control_PanZoomBar_Slider"+this.map.id;
var _3da=this.map.getNumZoomLevels()-1-this.map.getZoom();
var _3db=OpenLayers.Util.createAlphaImageDiv(id,_3d7.add(-1,_3da*this.zoomStopHeight),new OpenLayers.Size(20,9),_3d8+"slider.png","absolute");
this.slider=_3db;
this.sliderEvents=new OpenLayers.Events(this,_3db,null,true);
this.sliderEvents.register("mousedown",this,this.zoomBarDown);
this.sliderEvents.register("mousemove",this,this.zoomBarDrag);
this.sliderEvents.register("mouseup",this,this.zoomBarUp);
this.sliderEvents.register("dblclick",this,this.doubleClick);
this.sliderEvents.register("click",this,this.doubleClick);
var sz=new OpenLayers.Size();
sz.h=this.zoomStopHeight*this.map.getNumZoomLevels();
sz.w=this.zoomStopWidth;
var div=null;
if(OpenLayers.Util.alphaHack()){
var id="OpenLayers_Control_PanZoomBar"+this.map.id;
div=OpenLayers.Util.createAlphaImageDiv(id,_3d7,new OpenLayers.Size(sz.w,this.zoomStopHeight),_3d8+"zoombar.png","absolute",null,"crop");
div.style.height=sz.h;
}else{
div=OpenLayers.Util.createDiv("OpenLayers_Control_PanZoomBar_Zoombar"+this.map.id,_3d7,sz,_3d8+"zoombar.png");
}
this.zoombarDiv=div;
this.divEvents=new OpenLayers.Events(this,div,null,true);
this.divEvents.register("mousedown",this,this.divClick);
this.divEvents.register("mousemove",this,this.passEventToSlider);
this.divEvents.register("dblclick",this,this.doubleClick);
this.divEvents.register("click",this,this.doubleClick);
this.div.appendChild(div);
this.startTop=parseInt(div.style.top);
this.div.appendChild(_3db);
this.map.events.register("zoomend",this,this.moveZoomBar);
_3d7=_3d7.add(0,this.zoomStopHeight*this.map.getNumZoomLevels());
return _3d7;
},passEventToSlider:function(evt){
this.sliderEvents.handleBrowserEvent(evt);
},divClick:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
var y=evt.xy.y;
var top=OpenLayers.Util.pagePosition(evt.object)[1];
var _3e2=Math.floor((y-top)/this.zoomStopHeight);
this.map.zoomTo((this.map.getNumZoomLevels()-1)-_3e2);
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
var _3e5=this.mouseDragStart.y-evt.xy.y;
var _3e6=OpenLayers.Util.pagePosition(this.zoombarDiv);
if((evt.clientY-_3e6[1])>0&&(evt.clientY-_3e6[1])<parseInt(this.zoombarDiv.style.height)-2){
var _3e7=parseInt(this.slider.style.top)-_3e5;
this.slider.style.top=_3e7+"px";
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
var _3e9=this.zoomStart.y-evt.xy.y;
this.map.zoomTo(this.map.zoom+Math.round(_3e9/this.zoomStopHeight));
this.moveZoomBar();
this.mouseDragStart=null;
OpenLayers.Event.stop(evt);
}
},moveZoomBar:function(){
var _3ea=((this.map.getNumZoomLevels()-1)-this.map.getZoom())*this.zoomStopHeight+this.startTop+1;
this.slider.style.top=_3ea+"px";
},CLASS_NAME:"OpenLayers.Control.PanZoomBar"});
OpenLayers.Format.JSON=OpenLayers.Class(OpenLayers.Format,{indent:"    ",space:" ",newline:"\n",level:0,pretty:false,initialize:function(_3eb){
OpenLayers.Format.prototype.initialize.apply(this,[_3eb]);
},read:function(json,_3ed){
try{
if(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(json)){
var _3ee=eval("("+json+")");
if(typeof _3ed==="function"){
function walk(k,v){
if(v&&typeof v==="object"){
for(var i in v){
if(v.hasOwnProperty(i)){
v[i]=walk(i,v[i]);
}
}
}
return _3ed(k,v);
}
_3ee=walk("",_3ee);
}
return _3ee;
}
}
catch(e){
}
return null;
},write:function(_3f2,_3f3){
this.pretty=!!_3f3;
var json=null;
var type=typeof _3f2;
if(this.serialize[type]){
json=this.serialize[type].apply(this,[_3f2]);
}
return json;
},writeIndent:function(){
var _3f6=[];
if(this.pretty){
for(var i=0;i<this.level;++i){
_3f6.push(this.indent);
}
}
return _3f6.join("");
},writeNewline:function(){
return (this.pretty)?this.newline:"";
},writeSpace:function(){
return (this.pretty)?this.space:"";
},serialize:{"object":function(_3f8){
if(_3f8==null){
return "null";
}
if(_3f8.constructor==Date){
return this.serialize.date.apply(this,[_3f8]);
}
if(_3f8.constructor==Array){
return this.serialize.array.apply(this,[_3f8]);
}
var _3f9=["{"];
this.level+=1;
var key,keyJSON,valueJSON;
var _3fb=false;
for(key in _3f8){
if(_3f8.hasOwnProperty(key)){
keyJSON=OpenLayers.Format.JSON.prototype.write.apply(this,[key,this.pretty]);
valueJSON=OpenLayers.Format.JSON.prototype.write.apply(this,[_3f8[key],this.pretty]);
if(keyJSON!=null&&valueJSON!=null){
if(_3fb){
_3f9.push(",");
}
_3f9.push(this.writeNewline(),this.writeIndent(),keyJSON,":",this.writeSpace(),valueJSON);
_3fb=true;
}
}
}
this.level-=1;
_3f9.push(this.writeNewline(),this.writeIndent(),"}");
return _3f9.join("");
},"array":function(_3fc){
var json;
var _3fe=["["];
this.level+=1;
for(var i=0;i<_3fc.length;++i){
json=OpenLayers.Format.JSON.prototype.write.apply(this,[_3fc[i],this.pretty]);
if(json!=null){
if(i>0){
_3fe.push(",");
}
_3fe.push(this.writeNewline(),this.writeIndent(),json);
}
}
this.level-=1;
_3fe.push(this.writeNewline(),this.writeIndent(),"]");
return _3fe.join("");
},"string":function(_400){
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
if(/["\\\x00-\x1f]/.test(_400)){
return "\""+_400.replace(/([\x00-\x1f\\"])/g,function(a,b){
var c=m[b];
if(c){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
})+"\"";
}
return "\""+_400+"\"";
},"number":function(_405){
return isFinite(_405)?String(_405):"null";
},"boolean":function(bool){
return String(bool);
},"date":function(date){
function format(_408){
return (_408<10)?"0"+_408:_408;
}
return "\""+date.getFullYear()+"-"+format(date.getMonth()+1)+"-"+format(date.getDate())+"T"+format(date.getHours())+":"+format(date.getMinutes())+":"+format(date.getSeconds())+"\"";
}},CLASS_NAME:"OpenLayers.Format.JSON"});
OpenLayers.Format.XML=OpenLayers.Class(OpenLayers.Format,{xmldom:null,initialize:function(_409){
if(window.ActiveXObject){
this.xmldom=new ActiveXObject("Microsoft.XMLDOM");
}
OpenLayers.Format.prototype.initialize.apply(this,[_409]);
},read:function(text){
var _40b=text.indexOf("<");
if(_40b>0){
text=text.substring(_40b);
}
var node=OpenLayers.Util.Try(OpenLayers.Function.bind((function(){
var _40d;
if(window.ActiveXObject&&!this.xmldom){
_40d=new ActiveXObject("Microsoft.XMLDOM");
}else{
_40d=this.xmldom;
}
_40d.loadXML(text);
return _40d;
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
var _411=new XMLSerializer();
if(node.nodeType==1){
var doc=document.implementation.createDocument("","",null);
if(doc.importNode){
node=doc.importNode(node,true);
}
doc.appendChild(node);
data=_411.serializeToString(doc);
}else{
data=_411.serializeToString(node);
}
}
return data;
},createElementNS:function(uri,name){
var _415;
if(this.xmldom){
_415=this.xmldom.createNode(1,name,uri);
}else{
_415=document.createElementNS(uri,name);
}
return _415;
},createTextNode:function(text){
var node;
if(this.xmldom){
node=this.xmldom.createTextNode(text);
}else{
node=document.createTextNode(text);
}
return node;
},getElementsByTagNameNS:function(node,uri,name){
var _41b=[];
if(node.getElementsByTagNameNS){
_41b=node.getElementsByTagNameNS(uri,name);
}else{
var _41c=node.getElementsByTagName("*");
var _41d,fullName;
for(var i=0;i<_41c.length;++i){
_41d=_41c[i];
fullName=(_41d.prefix)?(_41d.prefix+":"+name):name;
if((name=="*")||(fullName==_41d.nodeName)){
if((uri=="*")||(uri==_41d.namespaceURI)){
_41b.push(_41d);
}
}
}
}
return _41b;
},getAttributeNodeNS:function(node,uri,name){
var _422=null;
if(node.getAttributeNodeNS){
_422=node.getAttributeNodeNS(uri,name);
}else{
var _423=node.attributes;
var _424,fullName;
for(var i=0;i<_423.length;++i){
_424=_423[i];
if(_424.namespaceURI==uri){
fullName=(_424.prefix)?(_424.prefix+":"+name):name;
if(fullName==_424.nodeName){
_422=_424;
break;
}
}
}
}
return _422;
},getAttributeNS:function(node,uri,name){
var _429="";
if(node.getAttributeNS){
_429=node.getAttributeNS(uri,name)||"";
}else{
var _42a=this.getAttributeNodeNS(node,uri,name);
if(_42a){
_429=_42a.nodeValue;
}
}
return _429;
},getChildValue:function(node,def){
var _42d;
try{
_42d=node.firstChild.nodeValue;
}
catch(e){
_42d=(def!=undefined)?def:"";
}
return _42d;
},concatChildValues:function(node,def){
var _430="";
var _431=node.firstChild;
var _432;
while(_431){
_432=_431.nodeValue;
if(_432){
_430+=_432;
}
_431=_431.nextSibling;
}
if(_430==""&&def!=undefined){
_430=def;
}
return _430;
},hasAttributeNS:function(node,uri,name){
var _436=false;
if(node.hasAttributeNS){
_436=node.hasAttributeNS(uri,name);
}else{
_436=!!this.getAttributeNodeNS(node,uri,name);
}
return _436;
},CLASS_NAME:"OpenLayers.Format.XML"});
OpenLayers.Handler=OpenLayers.Class({id:null,control:null,map:null,keyMask:null,active:false,evt:null,initialize:function(_437,_438,_439){
OpenLayers.Util.extend(this,_439);
this.control=_437;
this.callbacks=_438;
if(_437.map){
this.setMap(_437.map);
}
OpenLayers.Util.extend(this,_439);
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},setMap:function(map){
this.map=map;
},checkModifiers:function(evt){
if(this.keyMask==null){
return true;
}
var _43c=(evt.shiftKey?OpenLayers.Handler.MOD_SHIFT:0)|(evt.ctrlKey?OpenLayers.Handler.MOD_CTRL:0)|(evt.altKey?OpenLayers.Handler.MOD_ALT:0);
return (_43c==this.keyMask);
},activate:function(){
if(this.active){
return false;
}
var _43d=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_43d.length;i++){
if(this[_43d[i]]){
this.register(_43d[i],this[_43d[i]]);
}
}
this.active=true;
return true;
},deactivate:function(){
if(!this.active){
return false;
}
var _43f=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_43f.length;i++){
if(this[_43f[i]]){
this.unregister(_43f[i],this[_43f[i]]);
}
}
this.active=false;
return true;
},callback:function(name,args){
if(name&&this.callbacks[name]){
this.callbacks[name].apply(this.control,args);
}
},register:function(name,_444){
this.map.events.registerPriority(name,this,_444);
this.map.events.registerPriority(name,this,this.setEvent);
},unregister:function(name,_446){
this.map.events.unregister(name,this,_446);
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
OpenLayers.Map=OpenLayers.Class({Z_INDEX_BASE:{BaseLayer:100,Overlay:325,Popup:750,Control:1000},EVENT_TYPES:["addlayer","removelayer","changelayer","movestart","move","moveend","zoomend","popupopen","popupclose","addmarker","removemarker","clearmarkers","mouseover","mouseout","mousemove","dragstart","drag","dragend","changebaselayer"],id:null,events:null,div:null,dragging:false,size:null,viewPortDiv:null,layerContainerOrigin:null,layerContainerDiv:null,layers:null,controls:null,popups:null,baseLayer:null,center:null,resolution:null,zoom:0,viewRequestID:0,tileSize:null,projection:"EPSG:4326",units:"degrees",resolutions:null,maxResolution:1.40625,minResolution:null,maxScale:null,minScale:null,maxExtent:null,minExtent:null,restrictedExtent:null,numZoomLevels:16,theme:null,displayProjection:null,fallThrough:false,initialize:function(div,_449){
this.tileSize=new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,OpenLayers.Map.TILE_HEIGHT);
this.maxExtent=new OpenLayers.Bounds(-180,-90,180,90);
this.theme=OpenLayers._getScriptLocation()+"theme/default/style.css";
OpenLayers.Util.extend(this,_449);
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
var _44b=true;
var _44c=document.getElementsByTagName("link");
for(var i=0;i<_44c.length;++i){
if(OpenLayers.Util.isEquivalentUrl(_44c.item(i).href,this.theme)){
_44b=false;
break;
}
}
if(_44b){
var _44e=document.createElement("link");
_44e.setAttribute("rel","stylesheet");
_44e.setAttribute("type","text/css");
_44e.setAttribute("href",this.theme);
document.getElementsByTagName("head")[0].appendChild(_44e);
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
},setOptions:function(_450){
OpenLayers.Util.extend(this,_450);
},getTileSize:function(){
return this.tileSize;
},getBy:function(_451,_452,_453){
var test=(typeof _453.test=="function");
var _455=OpenLayers.Array.filter(this[_451],function(item){
return item[_452]==_453||(test&&_453.test(item[_452]));
});
return _455;
},getLayersBy:function(_457,_458){
return this.getBy("layers",_457,_458);
},getLayersByName:function(_459){
return this.getLayersBy("name",_459);
},getLayersByClass:function(_45a){
return this.getLayersBy("CLASS_NAME",_45a);
},getControlsBy:function(_45b,_45c){
return this.getBy("controls",_45b,_45c);
},getControlsByClass:function(_45d){
return this.getControlsBy("CLASS_NAME",_45d);
},getLayer:function(id){
var _45f=null;
for(var i=0;i<this.layers.length;i++){
var _461=this.layers[i];
if(_461.id==id){
_45f=_461;
break;
}
}
return _45f;
},setLayerZIndex:function(_462,zIdx){
_462.setZIndex(this.Z_INDEX_BASE[_462.isBaseLayer?"BaseLayer":"Overlay"]+zIdx*5);
},resetLayersZIndex:function(){
for(var i=0;i<this.layers.length;i++){
var _465=this.layers[i];
this.setLayerZIndex(_465,i);
}
},addLayer:function(_466){
for(var i=0;i<this.layers.length;i++){
if(this.layers[i]==_466){
var msg="You tried to add the layer: "+_466.name+" to the map, but it has already been added";
OpenLayers.Console.warn(msg);
return false;
}
}
_466.div.style.overflow="";
this.setLayerZIndex(_466,this.layers.length);
if(_466.isFixed){
this.viewPortDiv.appendChild(_466.div);
}else{
this.layerContainerDiv.appendChild(_466.div);
}
this.layers.push(_466);
_466.setMap(this);
if(_466.isBaseLayer){
if(this.baseLayer==null){
this.setBaseLayer(_466);
}else{
_466.setVisibility(false);
}
}else{
_466.redraw();
}
this.events.triggerEvent("addlayer");
},addLayers:function(_469){
for(var i=0;i<_469.length;i++){
this.addLayer(_469[i]);
}
},removeLayer:function(_46b,_46c){
if(_46c==null){
_46c=true;
}
if(_46b.isFixed){
this.viewPortDiv.removeChild(_46b.div);
}else{
this.layerContainerDiv.removeChild(_46b.div);
}
OpenLayers.Util.removeItem(this.layers,_46b);
_46b.removeMap(this);
_46b.map=null;
if(this.baseLayer==_46b){
this.baseLayer=null;
if(_46c){
for(var i=0;i<this.layers.length;i++){
var _46e=this.layers[i];
if(_46e.isBaseLayer){
this.setBaseLayer(_46e);
break;
}
}
}
}
this.resetLayersZIndex();
this.events.triggerEvent("removelayer");
},getNumLayers:function(){
return this.layers.length;
},getLayerIndex:function(_46f){
return OpenLayers.Util.indexOf(this.layers,_46f);
},setLayerIndex:function(_470,idx){
var base=this.getLayerIndex(_470);
if(idx<0){
idx=0;
}else{
if(idx>this.layers.length){
idx=this.layers.length;
}
}
if(base!=idx){
this.layers.splice(base,1);
this.layers.splice(idx,0,_470);
for(var i=0;i<this.layers.length;i++){
this.setLayerZIndex(this.layers[i],i);
}
this.events.triggerEvent("changelayer");
}
},raiseLayer:function(_474,_475){
var idx=this.getLayerIndex(_474)+_475;
this.setLayerIndex(_474,idx);
},setBaseLayer:function(_477){
var _478=null;
if(this.baseLayer){
_478=this.baseLayer.getExtent();
}
if(_477!=this.baseLayer){
if(OpenLayers.Util.indexOf(this.layers,_477)!=-1){
if(this.baseLayer!=null){
this.baseLayer.setVisibility(false);
}
this.baseLayer=_477;
this.viewRequestID++;
this.baseLayer.visibility=true;
var _479=this.getCenter();
if(_479!=null){
var _47a=(_478)?_478.getCenterLonLat():_479;
var _47b=(_478)?this.getZoomForExtent(_478,true):this.getZoomForResolution(this.resolution,true);
this.setCenter(_47a,_47b,false,true);
}
this.events.triggerEvent("changebaselayer");
}
}
},addControl:function(_47c,px){
this.controls.push(_47c);
this.addControlToMap(_47c,px);
},addControlToMap:function(_47e,px){
_47e.outsideViewport=(_47e.div!=null);
if(this.displayProjection&&!_47e.displayProjection){
_47e.displayProjection=this.displayProjection;
}
_47e.setMap(this);
var div=_47e.draw(px);
if(div){
if(!_47e.outsideViewport){
div.style.zIndex=this.Z_INDEX_BASE["Control"]+this.controls.length;
this.viewPortDiv.appendChild(div);
}
}
},getControl:function(id){
var _482=null;
for(var i=0;i<this.controls.length;i++){
var _484=this.controls[i];
if(_484.id==id){
_482=_484;
break;
}
}
return _482;
},removeControl:function(_485){
if((_485)&&(_485==this.getControl(_485.id))){
if(!_485.outsideViewport&&_485.div){
this.viewPortDiv.removeChild(_485.div);
}
OpenLayers.Util.removeItem(this.controls,_485);
}
},addPopup:function(_486,_487){
if(_487){
for(var i=this.popups.length-1;i>=0;--i){
this.removePopup(this.popups[i]);
}
}
_486.map=this;
this.popups.push(_486);
var _489=_486.draw();
if(_489){
_489.style.zIndex=this.Z_INDEX_BASE["Popup"]+this.popups.length;
this.layerContainerDiv.appendChild(_489);
}
},removePopup:function(_48a){
OpenLayers.Util.removeItem(this.popups,_48a);
if(_48a.div){
try{
this.layerContainerDiv.removeChild(_48a.div);
}
catch(e){
}
}
_48a.map=null;
},getSize:function(){
var size=null;
if(this.size!=null){
size=this.size.clone();
}
return size;
},updateSize:function(){
this.events.element.offsets=null;
var _48c=this.getCurrentSize();
var _48d=this.getSize();
if(_48d==null){
this.size=_48d=_48c;
}
if(!_48c.equals(_48d)){
this.size=_48c;
for(var i=0;i<this.layers.length;i++){
this.layers[i].onMapResize();
}
if(this.baseLayer!=null){
var _48f=new OpenLayers.Pixel(_48c.w/2,_48c.h/2);
var _490=this.getLonLatFromViewPortPx(_48f);
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
},calculateBounds:function(_494,_495){
var _496=null;
if(_494==null){
_494=this.getCenter();
}
if(_495==null){
_495=this.getResolution();
}
if((_494!=null)&&(_495!=null)){
var size=this.getSize();
var _498=size.w*_495;
var _499=size.h*_495;
_496=new OpenLayers.Bounds(_494.lon-_498/2,_494.lat-_499/2,_494.lon+_498/2,_494.lat+_499/2);
}
return _496;
},getCenter:function(){
return this.center;
},getZoom:function(){
return this.zoom;
},pan:function(dx,dy){
var _49c=this.getViewPortPxFromLonLat(this.getCenter());
var _49d=_49c.add(dx,dy);
if(!_49d.equals(_49c)){
var _49e=this.getLonLatFromViewPortPx(_49d);
this.setCenter(_49e);
}
},setCenter:function(_49f,zoom,_4a1,_4a2){
this.dragging=!!_4a1;
if(!this.center&&!this.isValidLonLat(_49f)){
_49f=this.maxExtent.getCenterLonLat();
}
if(this.restrictedExtent!=null){
if(_49f==null){
_49f=this.getCenter();
}
if(zoom==null){
zoom=this.getZoom();
}
var _4a3=null;
if(this.baseLayer!=null){
_4a3=this.baseLayer.resolutions[zoom];
}
var _4a4=this.calculateBounds(_49f,_4a3);
if(!this.restrictedExtent.containsBounds(_4a4)){
var _4a5=this.restrictedExtent.getCenterLonLat();
if(_4a4.getWidth()>this.restrictedExtent.getWidth()){
_49f=new OpenLayers.LonLat(_4a5.lon,_49f.lat);
}else{
if(_4a4.left<this.restrictedExtent.left){
_49f=_49f.add(this.restrictedExtent.left-_4a4.left,0);
}else{
if(_4a4.right>this.restrictedExtent.right){
_49f=_49f.add(this.restrictedExtent.right-_4a4.right,0);
}
}
}
if(_4a4.getHeight()>this.restrictedExtent.getHeight()){
_49f=new OpenLayers.LonLat(_49f.lon,_4a5.lat);
}else{
if(_4a4.bottom<this.restrictedExtent.bottom){
_49f=_49f.add(0,this.restrictedExtent.bottom-_4a4.bottom);
}else{
if(_4a4.top>this.restrictedExtent.top){
_49f=_49f.add(0,this.restrictedExtent.top-_4a4.top);
}
}
}
}
}
var _4a6=_4a2||((this.isValidZoomLevel(zoom))&&(zoom!=this.getZoom()));
var _4a7=(this.isValidLonLat(_49f))&&(!_49f.equals(this.center));
if(_4a6||_4a7||!_4a1){
if(!_4a1){
this.events.triggerEvent("movestart");
}
if(_4a7){
if((!_4a6)&&(this.center)){
this.centerLayerContainer(_49f);
}
this.center=_49f.clone();
}
if((_4a6)||(this.layerContainerOrigin==null)){
this.layerContainerOrigin=this.center.clone();
this.layerContainerDiv.style.left="0px";
this.layerContainerDiv.style.top="0px";
}
if(_4a6){
this.zoom=zoom;
this.resolution=this.baseLayer.getResolution();
this.viewRequestID++;
}
var _4a8=this.getExtent();
this.baseLayer.moveTo(_4a8,_4a6,_4a1);
_4a8=this.baseLayer.getExtent();
for(var i=0;i<this.layers.length;i++){
var _4aa=this.layers[i];
if(!_4aa.isBaseLayer){
var _4ab;
var _4ac=_4aa.calculateInRange();
if(_4aa.inRange!=_4ac){
_4aa.inRange=_4ac;
_4ab=true;
this.events.triggerEvent("changelayer");
}else{
_4ab=(_4aa.visibility&&_4aa.inRange);
}
if(_4ab){
_4aa.moveTo(_4a8,_4a6,_4a1);
}
}
}
if(_4a6){
for(var i=0;i<this.popups.length;i++){
this.popups[i].updatePosition();
}
}
this.events.triggerEvent("move");
if(_4a6){
this.events.triggerEvent("zoomend");
}
}
if(!_4a1){
this.events.triggerEvent("moveend");
}
},centerLayerContainer:function(_4ad){
var _4ae=this.getViewPortPxFromLonLat(this.layerContainerOrigin);
var _4af=this.getViewPortPxFromLonLat(_4ad);
if((_4ae!=null)&&(_4af!=null)){
this.layerContainerDiv.style.left=(_4ae.x-_4af.x)+"px";
this.layerContainerDiv.style.top=(_4ae.y-_4af.y)+"px";
}
},isValidZoomLevel:function(_4b0){
return ((_4b0!=null)&&(_4b0>=0)&&(_4b0<this.getNumZoomLevels()));
},isValidLonLat:function(_4b1){
var _4b2=false;
if(_4b1!=null){
var _4b3=this.getMaxExtent();
_4b2=_4b3.containsLonLat(_4b1);
}
return _4b2;
},getProjection:function(){
var _4b4=this.getProjectionObject();
return _4b4?_4b4.getCode():null;
},getProjectionObject:function(){
var _4b5=null;
if(this.baseLayer!=null){
_4b5=this.baseLayer.projection;
}
return _4b5;
},getMaxResolution:function(){
var _4b6=null;
if(this.baseLayer!=null){
_4b6=this.baseLayer.maxResolution;
}
return _4b6;
},getMaxExtent:function(){
var _4b7=null;
if(this.baseLayer!=null){
_4b7=this.baseLayer.maxExtent;
}
return _4b7;
},getNumZoomLevels:function(){
var _4b8=null;
if(this.baseLayer!=null){
_4b8=this.baseLayer.numZoomLevels;
}
return _4b8;
},getExtent:function(){
var _4b9=null;
if(this.baseLayer!=null){
_4b9=this.baseLayer.getExtent();
}
return _4b9;
},getResolution:function(){
var _4ba=null;
if(this.baseLayer!=null){
_4ba=this.baseLayer.getResolution();
}
return _4ba;
},getScale:function(){
var _4bb=null;
if(this.baseLayer!=null){
var res=this.getResolution();
var _4bd=this.baseLayer.units;
_4bb=OpenLayers.Util.getScaleFromResolution(res,_4bd);
}
return _4bb;
},getZoomForExtent:function(_4be,_4bf){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForExtent(_4be,_4bf);
}
return zoom;
},getZoomForResolution:function(_4c1,_4c2){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForResolution(_4c1,_4c2);
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
},zoomToExtent:function(_4c5){
var _4c6=_4c5.getCenterLonLat();
if(this.baseLayer.wrapDateLine){
var _4c7=this.getMaxExtent();
_4c5=_4c5.clone();
while(_4c5.right<_4c5.left){
_4c5.right+=_4c7.getWidth();
}
_4c6=_4c5.getCenterLonLat().wrapDateLine(_4c7);
}
this.setCenter(_4c6,this.getZoomForExtent(_4c5));
},zoomToMaxExtent:function(){
this.zoomToExtent(this.getMaxExtent());
},zoomToScale:function(_4c8){
var res=OpenLayers.Util.getResolutionFromScale(_4c8,this.baseLayer.units);
var size=this.getSize();
var _4cb=size.w*res;
var _4cc=size.h*res;
var _4cd=this.getCenter();
var _4ce=new OpenLayers.Bounds(_4cd.lon-_4cb/2,_4cd.lat-_4cc/2,_4cd.lon+_4cb/2,_4cd.lat+_4cc/2);
this.zoomToExtent(_4ce);
},getLonLatFromViewPortPx:function(_4cf){
var _4d0=null;
if(this.baseLayer!=null){
_4d0=this.baseLayer.getLonLatFromViewPortPx(_4cf);
}
return _4d0;
},getViewPortPxFromLonLat:function(_4d1){
var px=null;
if(this.baseLayer!=null){
px=this.baseLayer.getViewPortPxFromLonLat(_4d1);
}
return px;
},getLonLatFromPixel:function(px){
return this.getLonLatFromViewPortPx(px);
},getPixelFromLonLat:function(_4d4){
return this.getViewPortPxFromLonLat(_4d4);
},getViewPortPxFromLayerPx:function(_4d5){
var _4d6=null;
if(_4d5!=null){
var dX=parseInt(this.layerContainerDiv.style.left);
var dY=parseInt(this.layerContainerDiv.style.top);
_4d6=_4d5.add(dX,dY);
}
return _4d6;
},getLayerPxFromViewPortPx:function(_4d9){
var _4da=null;
if(_4d9!=null){
var dX=-parseInt(this.layerContainerDiv.style.left);
var dY=-parseInt(this.layerContainerDiv.style.top);
_4da=_4d9.add(dX,dY);
if(isNaN(_4da.x)||isNaN(_4da.y)){
_4da=null;
}
}
return _4da;
},getLonLatFromLayerPx:function(px){
px=this.getViewPortPxFromLayerPx(px);
return this.getLonLatFromViewPortPx(px);
},getLayerPxFromLonLat:function(_4de){
var px=this.getViewPortPxFromLonLat(_4de);
return this.getLayerPxFromViewPortPx(px);
},CLASS_NAME:"OpenLayers.Map"});
OpenLayers.Map.TILE_WIDTH=256;
OpenLayers.Map.TILE_HEIGHT=256;
OpenLayers.Marker=OpenLayers.Class({icon:null,lonlat:null,events:null,map:null,initialize:function(_4e0,icon){
this.lonlat=_4e0;
var _4e2=(icon)?icon:OpenLayers.Marker.defaultIcon();
if(this.icon==null){
this.icon=_4e2;
}else{
this.icon.url=_4e2.url;
this.icon.size=_4e2.size;
this.icon.offset=_4e2.offset;
this.icon.calculateOffset=_4e2.calculateOffset;
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
var _4e5=false;
if(this.map){
var _4e6=this.map.getExtent();
_4e5=_4e6.containsLonLat(this.lonlat);
}
return _4e5;
},inflate:function(_4e7){
if(this.icon){
var _4e8=new OpenLayers.Size(this.icon.size.w*_4e7,this.icon.size.h*_4e7);
this.icon.setSize(_4e8);
}
},setOpacity:function(_4e9){
this.icon.setOpacity(_4e9);
},setUrl:function(url){
this.icon.setUrl(url);
},display:function(_4eb){
this.icon.display(_4eb);
},CLASS_NAME:"OpenLayers.Marker"});
OpenLayers.Marker.defaultIcon=function(){
var url=OpenLayers.Util.getImagesLocation()+"marker.png";
var size=new OpenLayers.Size(21,25);
var _4ee=function(size){
return new OpenLayers.Pixel(-(size.w/2),-size.h);
};
return new OpenLayers.Icon(url,size,null,_4ee);
};
OpenLayers.Popup.AnchoredBubble=OpenLayers.Class(OpenLayers.Popup.Anchored,{rounded:false,initialize:function(id,_4f1,size,_4f3,_4f4,_4f5,_4f6){
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
var _4fa=this.size.clone();
_4fa.h-=(2*OpenLayers.Popup.AnchoredBubble.CORNER_SIZE);
_4fa.h-=(2*this.padding);
this.contentDiv.style.height=_4fa.h+"px";
this.contentDiv.style.width=_4fa.w+"px";
if(this.map){
this.setRicoCorners(!this.rounded);
this.rounded=true;
}
}
},setBackgroundColor:function(_4fb){
if(_4fb!=undefined){
this.backgroundColor=_4fb;
}
if(this.div!=null){
if(this.contentDiv!=null){
this.div.style.background="transparent";
OpenLayers.Rico.Corner.changeColor(this.contentDiv,this.backgroundColor);
}
}
},setOpacity:function(_4fc){
OpenLayers.Popup.Anchored.prototype.setOpacity.call(this,_4fc);
if(this.div!=null){
if(this.groupDiv!=null){
OpenLayers.Rico.Corner.changeOpacity(this.groupDiv,this.opacity);
}
}
},setBorder:function(_4fd){
this.border=0;
},setRicoCorners:function(_4fe){
var _4ff=this.getCornersToRound(this.relativePosition);
var _500={corners:_4ff,color:this.backgroundColor,bgColor:"transparent",blend:false};
if(_4fe){
OpenLayers.Rico.Corner.round(this.div,_500);
}else{
OpenLayers.Rico.Corner.reRound(this.groupDiv,_500);
this.setBackgroundColor();
this.setOpacity();
}
},getCornersToRound:function(){
var _501=["tl","tr","bl","br"];
var _502=OpenLayers.Bounds.oppositeQuadrant(this.relativePosition);
OpenLayers.Util.removeItem(_501,_502);
return _501.join(" ");
},CLASS_NAME:"OpenLayers.Popup.AnchoredBubble"});
OpenLayers.Popup.AnchoredBubble.CORNER_SIZE=5;
OpenLayers.Renderer.SVG=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"http://www.w3.org/2000/svg",MAX_PIXEL:15000,localResolution:null,initialize:function(_503){
if(!this.supported()){
return;
}
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _504="http://www.w3.org/TR/SVG11/feature#SVG";
return (document.implementation&&(document.implementation.hasFeature("org.w3c.svg","1.0")||document.implementation.hasFeature(_504,"1.1")));
},inValidRange:function(x,y){
return (x>=-this.MAX_PIXEL&&x<=this.MAX_PIXEL&&y>=-this.MAX_PIXEL&&y<=this.MAX_PIXEL);
},setExtent:function(_507){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _508=this.getResolution();
if(!this.localResolution||_508!=this.localResolution){
this.left=-_507.left/_508;
this.top=_507.top/_508;
}
var left=0;
var top=0;
if(this.localResolution&&_508==this.localResolution){
left=(this.left)-(-_507.left/_508);
top=(this.top)-(_507.top/_508);
}
this.localResolution=_508;
var _50b=left+" "+top+" "+_507.getWidth()/_508+" "+_507.getHeight()/_508;
this.rendererRoot.setAttributeNS(null,"viewBox",_50b);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.setAttributeNS(null,"width",this.size.w);
this.rendererRoot.setAttributeNS(null,"height",this.size.h);
},getNodeType:function(_50d,_50e){
var _50f=null;
switch(_50d.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_50f=_50e.externalGraphic?"image":"circle";
break;
case "OpenLayers.Geometry.Rectangle":
_50f="rect";
break;
case "OpenLayers.Geometry.LineString":
_50f="polyline";
break;
case "OpenLayers.Geometry.LinearRing":
_50f="polygon";
break;
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_50f="path";
break;
default:
break;
}
return _50f;
},setStyle:function(node,_511,_512){
_511=_511||node._style;
_512=_512||node._options;
if(node._geometryClass=="OpenLayers.Geometry.Point"){
if(_511.externalGraphic){
var x=parseFloat(node.getAttributeNS(null,"cx"));
var y=parseFloat(node.getAttributeNS(null,"cy"));
if(_511.graphicWidth&&_511.graphicHeight){
node.setAttributeNS(null,"preserveAspectRatio","none");
}
var _515=_511.graphicWidth||_511.graphicHeight;
var _516=_511.graphicHeight||_511.graphicWidth;
_515=_515?_515:_511.pointRadius*2;
_516=_516?_516:_511.pointRadius*2;
var _517=(_511.graphicXOffset!=undefined)?_511.graphicXOffset:-(0.5*_515);
var _518=(_511.graphicYOffset!=undefined)?_511.graphicYOffset:-(0.5*_516);
var _519=_511.graphicOpacity||_511.fillOpacity;
node.setAttributeNS(null,"x",(x+_517).toFixed());
node.setAttributeNS(null,"y",(y+_518).toFixed());
node.setAttributeNS(null,"width",_515);
node.setAttributeNS(null,"height",_516);
node.setAttributeNS("http://www.w3.org/1999/xlink","href",_511.externalGraphic);
node.setAttributeNS(null,"style","opacity: "+_519);
}else{
node.setAttributeNS(null,"r",_511.pointRadius);
}
}
if(_512.isFilled){
node.setAttributeNS(null,"fill",_511.fillColor);
node.setAttributeNS(null,"fill-opacity",_511.fillOpacity);
}else{
node.setAttributeNS(null,"fill","none");
}
if(_512.isStroked){
node.setAttributeNS(null,"stroke",_511.strokeColor);
node.setAttributeNS(null,"stroke-opacity",_511.strokeOpacity);
node.setAttributeNS(null,"stroke-width",_511.strokeWidth);
node.setAttributeNS(null,"stroke-linecap",_511.strokeLinecap);
}else{
node.setAttributeNS(null,"stroke","none");
}
if(_511.pointerEvents){
node.setAttributeNS(null,"pointer-events",_511.pointerEvents);
}
if(_511.cursor){
node.setAttributeNS(null,"cursor",_511.cursor);
}
return node;
},createNode:function(type,id){
var node=document.createElementNS(this.xmlns,type);
if(id){
node.setAttributeNS(null,"id",id);
}
return node;
},nodeTypeCompare:function(node,type){
return (type==node.nodeName);
},createRenderRoot:function(){
return this.nodeFactory(this.container.id+"_svgRoot","svg");
},createRoot:function(){
return this.nodeFactory(this.container.id+"_root","g");
},drawPoint:function(node,_520){
this.drawCircle(node,_520,1);
},drawCircle:function(node,_522,_523){
var _524=this.getResolution();
var x=(_522.x/_524+this.left);
var y=(this.top-_522.y/_524);
if(this.inValidRange(x,y)){
node.setAttributeNS(null,"cx",x);
node.setAttributeNS(null,"cy",y);
node.setAttributeNS(null,"r",_523);
}else{
this.root.removeChild(node);
}
},drawLineString:function(node,_528){
node.setAttributeNS(null,"points",this.getComponentsString(_528.components));
},drawLinearRing:function(node,_52a){
node.setAttributeNS(null,"points",this.getComponentsString(_52a.components));
},drawPolygon:function(node,_52c){
var d="";
var draw=true;
for(var j=0;j<_52c.components.length;j++){
var _530=_52c.components[j];
d+=" M";
for(var i=0;i<_530.components.length;i++){
var _532=this.getShortString(_530.components[i]);
if(_532){
d+=" "+_532;
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
},drawRectangle:function(node,_534){
var _535=this.getResolution();
var x=(_534.x/_535+this.left);
var y=(this.top-_534.y/_535);
if(this.inValidRange(x,y)){
node.setAttributeNS(null,"x",x);
node.setAttributeNS(null,"y",y);
node.setAttributeNS(null,"width",_534.width/_535);
node.setAttributeNS(null,"height",_534.height/_535);
}else{
node.setAttributeNS(null,"x","");
node.setAttributeNS(null,"y","");
node.setAttributeNS(null,"width",0);
node.setAttributeNS(null,"height",0);
}
},drawSurface:function(node,_539){
var d=null;
var draw=true;
for(var i=0;i<_539.components.length;i++){
if((i%3)==0&&(i/3)==0){
var _53d=this.getShortString(_539.components[i]);
if(!_53d){
draw=false;
}
d="M "+_53d;
}else{
if((i%3)==1){
var _53d=this.getShortString(_539.components[i]);
if(!_53d){
draw=false;
}
d+=" C "+_53d;
}else{
var _53d=this.getShortString(_539.components[i]);
if(!_53d){
draw=false;
}
d+=" "+_53d;
}
}
}
d+=" Z";
if(draw){
node.setAttributeNS(null,"d",d);
}else{
node.setAttributeNS(null,"d","");
}
},getComponentsString:function(_53e){
var _53f=[];
for(var i=0;i<_53e.length;i++){
var _541=this.getShortString(_53e[i]);
if(_541){
_53f.push(_541);
}
}
return _53f.join(",");
},getShortString:function(_542){
var _543=this.getResolution();
var x=(_542.x/_543+this.left);
var y=(this.top-_542.y/_543);
if(this.inValidRange(x,y)){
return x+","+y;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Renderer.SVG"});
OpenLayers.Renderer.VML=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"urn:schemas-microsoft-com:vml",initialize:function(_546){
if(!this.supported()){
return;
}
if(!document.namespaces.v){
document.namespaces.add("v",this.xmlns);
var _547=document.createStyleSheet();
_547.addRule("v\\:*","behavior: url(#default#VML); "+"position: absolute; display: inline-block;");
}
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
return !!(document.namespaces);
},setExtent:function(_548){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _549=this.getResolution();
var org=_548.left/_549+" "+_548.top/_549;
this.root.setAttribute("coordorigin",org);
var size=_548.getWidth()/_549+" "+-_548.getHeight()/_549;
this.root.setAttribute("coordsize",size);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.style.width=this.size.w;
this.rendererRoot.style.height=this.size.h;
this.root.style.width=this.size.w;
this.root.style.height=this.size.h;
},getNodeType:function(_54d,_54e){
var _54f=null;
switch(_54d.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_54f=_54e.externalGraphic?"v:rect":"v:oval";
break;
case "OpenLayers.Geometry.Rectangle":
_54f="v:rect";
break;
case "OpenLayers.Geometry.LineString":
case "OpenLayers.Geometry.LinearRing":
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_54f="v:shape";
break;
default:
break;
}
return _54f;
},setStyle:function(node,_551,_552,_553){
_551=_551||node._style;
_552=_552||node._options;
if(node._geometryClass=="OpenLayers.Geometry.Point"){
if(_551.externalGraphic){
var _554=_551.graphicWidth||_551.graphicHeight;
var _555=_551.graphicHeight||_551.graphicWidth;
_554=_554?_554:_551.pointRadius*2;
_555=_555?_555:_551.pointRadius*2;
var _556=this.getResolution();
var _557=(_551.graphicXOffset!=undefined)?_551.graphicXOffset:-(0.5*_554);
var _558=(_551.graphicYOffset!=undefined)?_551.graphicYOffset:-(0.5*_555);
node.style.left=((_553.x/_556)+_557).toFixed();
node.style.top=((_553.y/_556)-(_558+_555)).toFixed();
node.style.width=_554;
node.style.height=_555;
_551.fillColor="none";
_552.isStroked=false;
}else{
this.drawCircle(node,_553,_551.pointRadius);
}
}
if(_552.isFilled){
node.setAttribute("fillcolor",_551.fillColor);
}else{
node.setAttribute("filled","false");
}
var _559=node.getElementsByTagName("fill");
var fill=(_559.length==0)?null:_559[0];
if(!_552.isFilled){
if(fill){
node.removeChild(fill);
}
}else{
if(!fill){
fill=this.createNode("v:fill",node.id+"_fill");
if(_551.fillOpacity){
fill.setAttribute("opacity",_551.fillOpacity);
}
if(node._geometryClass=="OpenLayers.Geometry.Point"&&_551.externalGraphic){
if(_551.graphicOpacity){
fill.setAttribute("opacity",_551.graphicOpacity);
}
fill.setAttribute("src",_551.externalGraphic);
fill.setAttribute("type","frame");
node.style.flip="y";
if(!(_551.graphicWidth&&_551.graphicHeight)){
fill.aspect="atmost";
}
}
node.appendChild(fill);
}
}
if(_552.isStroked){
node.setAttribute("strokecolor",_551.strokeColor);
node.setAttribute("strokeweight",_551.strokeWidth);
}else{
node.setAttribute("stroked","false");
}
var _55b=node.getElementsByTagName("stroke");
var _55c=(_55b.length==0)?null:_55b[0];
if(!_552.isStroked){
if(_55c){
node.removeChild(_55c);
}
}else{
if(!_55c){
_55c=this.createNode("v:stroke",node.id+"_stroke");
node.appendChild(_55c);
}
_55c.setAttribute("opacity",_551.strokeOpacity);
_55c.setAttribute("endcap",!_551.strokeLinecap||_551.strokeLinecap=="butt"?"flat":_551.strokeLinecap);
}
if(_551.cursor){
node.style.cursor=_551.cursor;
}
return node;
},postDraw:function(node){
var _55e=node._style.fillColor;
var _55f=node._style.strokeColor;
if(_55e=="none"&&node.getAttribute("fillcolor")!=_55e){
node.setAttribute("fillcolor",_55e);
}
if(_55f=="none"&&node.getAttribute("strokecolor")!=_55f){
node.setAttribute("strokecolor",_55f);
}
},setNodeDimension:function(node,_561){
var bbox=_561.getBounds();
if(bbox){
var _563=this.getResolution();
var _564=new OpenLayers.Bounds((bbox.left/_563).toFixed(),(bbox.bottom/_563).toFixed(),(bbox.right/_563).toFixed(),(bbox.top/_563).toFixed());
node.style.left=_564.left;
node.style.top=_564.top;
node.style.width=_564.getWidth();
node.style.height=_564.getHeight();
node.coordorigin=_564.left+" "+_564.top;
node.coordsize=_564.getWidth()+" "+_564.getHeight();
}
},createNode:function(type,id){
var node=document.createElement(type);
if(id){
node.setAttribute("id",id);
}
return node;
},nodeTypeCompare:function(node,type){
var _56a=type;
var _56b=_56a.indexOf(":");
if(_56b!=-1){
_56a=_56a.substr(_56b+1);
}
var _56c=node.nodeName;
_56b=_56c.indexOf(":");
if(_56b!=-1){
_56c=_56c.substr(_56b+1);
}
return (_56a==_56c);
},createRenderRoot:function(){
return this.nodeFactory(this.container.id+"_vmlRoot","div");
},createRoot:function(){
return this.nodeFactory(this.container.id+"_root","v:group");
},drawPoint:function(node,_56e){
this.drawCircle(node,_56e,1);
},drawCircle:function(node,_570,_571){
if(!isNaN(_570.x)&&!isNaN(_570.y)){
var _572=this.getResolution();
node.style.left=(_570.x/_572).toFixed()-_571;
node.style.top=(_570.y/_572).toFixed()-_571;
var _573=_571*2;
node.style.width=_573;
node.style.height=_573;
}
},drawLineString:function(node,_575){
this.drawLine(node,_575,false);
},drawLinearRing:function(node,_577){
this.drawLine(node,_577,true);
},drawLine:function(node,_579,_57a){
this.setNodeDimension(node,_579);
var _57b=this.getResolution();
var _57c=_579.components.length;
var _57d=new Array(_57c);
var comp,x,y;
for(var i=0;i<_57c;i++){
comp=_579.components[i];
x=(comp.x/_57b);
y=(comp.y/_57b);
_57d[i]=" "+x.toFixed()+","+y.toFixed()+" l ";
}
var end=(_57a)?" x e":" e";
node.path="m"+_57d.join("")+end;
},drawPolygon:function(node,_582){
this.setNodeDimension(node,_582);
var _583=this.getResolution();
var path=[];
var _585,i,comp,x,y;
for(var j=0;j<_582.components.length;j++){
_585=_582.components[j];
path.push("m");
for(i=0;i<_585.components.length;i++){
comp=_585.components[i];
x=comp.x/_583;
y=comp.y/_583;
path.push(" "+x.toFixed()+","+y.toFixed());
if(i==0){
path.push(" l");
}
}
path.push(" x ");
}
path.push("e");
node.path=path.join("");
},drawRectangle:function(node,_588){
var _589=this.getResolution();
node.style.left=_588.x/_589;
node.style.top=_588.y/_589;
node.style.width=_588.width/_589;
node.style.height=_588.height/_589;
},drawSurface:function(node,_58b){
this.setNodeDimension(node,_58b);
var _58c=this.getResolution();
var path=[];
var comp,x,y;
for(var i=0;i<_58b.components.length;i++){
comp=_58b.components[i];
x=comp.x/_58c;
y=comp.y/_58c;
if((i%3)==0&&(i/3)==0){
path.push("m");
}else{
if((i%3)==1){
path.push(" c");
}
}
path.push(" "+x+","+y);
}
path.push(" x e");
node.path=path.join("");
},CLASS_NAME:"OpenLayers.Renderer.VML"});
OpenLayers.Tile.Image=OpenLayers.Class(OpenLayers.Tile,{url:null,imgDiv:null,frame:null,layerAlphaHack:null,initialize:function(_590,_591,_592,url,size){
OpenLayers.Tile.prototype.initialize.apply(this,arguments);
this.url=url;
this.frame=document.createElement("div");
this.frame.style.overflow="hidden";
this.frame.style.position="absolute";
this.layerAlphaHack=this.layer.alpha&&OpenLayers.Util.alphaHack();
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
var _595=this.layer.getImageSize();
if(this.layerAlphaHack){
OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,null,null,_595,this.url);
}else{
this.imgDiv.src=this.url;
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,_595);
}
return true;
},clear:function(){
if(this.imgDiv){
this.imgDiv.style.display="none";
if(OpenLayers.Tile.Image.useBlankTile){
this.imgDiv.src=OpenLayers.Util.getImagesLocation()+"blank.gif";
}
}
},initImgDiv:function(){
var _596=this.layer.imageOffset;
var size=this.layer.getImageSize();
if(this.layerAlphaHack){
this.imgDiv=OpenLayers.Util.createAlphaImageDiv(null,_596,size,null,"relative",null,null,null,true);
}else{
this.imgDiv=OpenLayers.Util.createImage(null,_596,size,null,"relative",null,null,true);
}
this.imgDiv.className="olTileImage";
this.frame.appendChild(this.imgDiv);
this.layer.div.appendChild(this.frame);
if(this.layer.opacity!=null){
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,null,null,null,null,this.layer.opacity);
}
this.imgDiv.map=this.layer.map;
var _598=function(){
if(this.isLoading){
this.isLoading=false;
this.events.triggerEvent("loadend");
}
};
OpenLayers.Event.observe(this.imgDiv,"load",OpenLayers.Function.bind(_598,this));
var _599=function(){
if(this.imgDiv._attempts>OpenLayers.IMAGE_RELOAD_ATTEMPTS){
_598.call(this);
}
};
OpenLayers.Event.observe(this.imgDiv,"error",OpenLayers.Function.bind(_599,this));
},checkImgURL:function(){
if(this.layer){
var _59a=this.layerAlphaHack?this.imgDiv.firstChild.src:this.imgDiv.src;
if(!OpenLayers.Util.isEquivalentUrl(_59a,this.url)){
this.imgDiv.style.display="none";
}
}
},CLASS_NAME:"OpenLayers.Tile.Image"});
OpenLayers.Tile.Image.useBlankTile=(OpenLayers.Util.getBrowserName()=="safari"||OpenLayers.Util.getBrowserName()=="opera");
OpenLayers.Tile.WFS=OpenLayers.Class(OpenLayers.Tile,{features:null,url:null,request:null,initialize:function(_59b,_59c,_59d,url,size){
OpenLayers.Tile.prototype.initialize.apply(this,arguments);
this.url=url;
this.features=[];
},destroy:function(){
OpenLayers.Tile.prototype.destroy.apply(this,arguments);
this.destroyAllFeatures();
this.features=null;
this.url=null;
if(this.request){
this.request.transport.abort();
}
},clear:function(){
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
},loadFeaturesForRegion:function(_5a0,_5a1){
this.request=OpenLayers.loadURL(this.url,null,this,_5a0);
},requestSuccess:function(_5a2){
if(this.features){
var doc=_5a2.responseXML;
if(!doc||_5a2.fileType!="XML"){
doc=OpenLayers.parseXMLString(_5a2.responseText);
}
if(this.layer.vectorMode){
if(!this.layer.parser){
var _5a4=this.layer.format?this.layer.format:OpenLayers.Format.GML;
this.layer.parser=new _5a4({"extractAttributes":this.layer.options.extractAttributes});
}
this.layer.addFeatures(this.layer.parser.read(doc));
}else{
var _5a5=OpenLayers.Ajax.getElementsByTagNameNS(doc,"http://www.opengis.net/gml","gml","featureMember");
this.addResults(_5a5);
}
}
if(this.events){
this.events.triggerEvent("loadend");
}
},addResults:function(_5a6){
for(var i=0;i<_5a6.length;i++){
var _5a8=new this.layer.featureClass(this.layer,_5a6[i]);
this.features.push(_5a8);
}
},destroyAllFeatures:function(){
while(this.features.length>0){
var _5a9=this.features.shift();
_5a9.destroy();
}
},CLASS_NAME:"OpenLayers.Tile.WFS"});
OpenLayers.Feature=OpenLayers.Class({layer:null,id:null,lonlat:null,data:null,marker:null,popupClass:OpenLayers.Popup.AnchoredBubble,popup:null,initialize:function(_5aa,_5ab,data){
this.layer=_5aa;
this.lonlat=_5ab;
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
var _5ad=false;
if((this.layer!=null)&&(this.layer.map!=null)){
var _5ae=this.layer.map.getExtent();
_5ad=_5ae.containsLonLat(this.lonlat);
}
return _5ad;
},createMarker:function(){
if(this.lonlat!=null){
this.marker=new OpenLayers.Marker(this.lonlat,this.data.icon);
}
return this.marker;
},destroyMarker:function(){
this.marker.destroy();
},createPopup:function(_5af){
if(this.lonlat!=null){
var id=this.id+"_popup";
var _5b1=(this.marker)?this.marker.icon:null;
if(!this.popup){
this.popup=new this.popupClass(id,this.lonlat,this.data.popupSize,this.data.popupContentHTML,_5b1,_5af);
}
if(this.data.overflow!=null){
this.popup.contentDiv.style.overflow=this.data.overflow;
}
this.popup.feature=this;
}
return this.popup;
},destroyPopup:function(){
if(this.popup){
this.popup.feature=null;
this.popup.destroy();
this.popup=null;
}
},CLASS_NAME:"OpenLayers.Feature"});
OpenLayers.Handler.Click=OpenLayers.Class(OpenLayers.Handler,{delay:300,single:true,"double":false,pixelTolerance:null,stopSingle:false,stopDouble:false,timerId:null,down:null,initialize:function(_5b2,_5b3,_5b4){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
if(this.pixelTolerance!=null){
this.mousedown=function(evt){
this.down=evt.xy;
return true;
};
}
},mousedown:null,dblclick:function(evt){
if(this.passesTolerance(evt)){
if(this["double"]){
this.callback("dblclick",[evt]);
}
this.clearTimer();
}
return !this.stopDouble;
},click:function(evt){
if(this.passesTolerance(evt)){
if(this.timerId!=null){
this.clearTimer();
}else{
var _5b8=this.single?evt:null;
this.timerId=window.setTimeout(OpenLayers.Function.bind(this.delayedCall,this,_5b8),this.delay);
}
}
return !this.stopSingle;
},passesTolerance:function(evt){
var _5ba=true;
if(this.pixelTolerance&&this.down){
var dpx=Math.sqrt(Math.pow(this.down.x-evt.xy.x,2)+Math.pow(this.down.y-evt.xy.y,2));
if(dpx>this.pixelTolerance){
_5ba=false;
}
}
return _5ba;
},clearTimer:function(){
if(this.timerId!=null){
window.clearTimeout(this.timerId);
this.timerId=null;
}
},delayedCall:function(evt){
this.timerId=null;
if(evt){
this.callback("click",[evt]);
}
},deactivate:function(){
var _5bd=false;
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
this.clearTimer();
this.down=null;
_5bd=true;
}
return _5bd;
},CLASS_NAME:"OpenLayers.Handler.Click"});
OpenLayers.Handler.Drag=OpenLayers.Class(OpenLayers.Handler,{started:false,stopDown:true,dragging:false,last:null,start:null,oldOnselectstart:null,initialize:function(_5be,_5bf,_5c0){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},down:function(evt){
},move:function(evt){
},up:function(evt){
},out:function(evt){
},mousedown:function(evt){
var _5c6=true;
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
_5c6=!this.stopDown;
}else{
this.started=false;
this.start=null;
this.last=null;
}
return _5c6;
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
var _5c9=(this.start!=this.last);
this.started=false;
this.dragging=false;
this.map.div.style.cursor="";
this.up(evt);
this.callback("up",[evt.xy]);
if(_5c9){
this.callback("done",[evt.xy]);
}
document.onselectstart=this.oldOnselectstart;
}
return true;
},mouseout:function(evt){
if(this.started&&OpenLayers.Util.mouseLeft(evt,this.map.div)){
var _5cb=(this.start!=this.last);
this.started=false;
this.dragging=false;
this.map.div.style.cursor="";
this.out(evt);
this.callback("out",[]);
if(_5cb){
this.callback("done",[evt.xy]);
}
if(document.onselectstart){
document.onselectstart=this.oldOnselectstart;
}
}
return true;
},click:function(evt){
return (this.start==this.last);
},activate:function(){
var _5cd=false;
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
this.dragging=false;
_5cd=true;
}
return _5cd;
},deactivate:function(){
var _5ce=false;
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
this.started=false;
this.dragging=false;
this.start=null;
this.last=null;
_5ce=true;
}
return _5ce;
},CLASS_NAME:"OpenLayers.Handler.Drag"});
OpenLayers.Handler.Feature=OpenLayers.Class(OpenLayers.Handler,{EVENTMAP:{"click":{"in":"click","out":"clickout"},"mousemove":{"in":"over","out":"out"},"dblclick":{"in":"dblclick","out":null},"mousedown":{"in":null,"out":null},"mouseup":{"in":null,"out":null}},feature:null,lastFeature:null,down:null,up:null,clickoutTolerance:4,geometryTypes:null,layerIndex:null,initialize:function(_5cf,_5d0,_5d1,_5d2){
OpenLayers.Handler.prototype.initialize.apply(this,[_5cf,_5d1,_5d2]);
this.layer=_5d0;
},mousedown:function(evt){
this.down=evt.xy;
return !this.handle(evt);
},mouseup:function(evt){
this.up=evt.xy;
return !this.handle(evt);
},click:function(evt){
return !this.handle(evt);
},mousemove:function(evt){
this.handle(evt);
return true;
},dblclick:function(evt){
return !this.handle(evt);
},geometryTypeMatches:function(_5d8){
return this.geometryTypes==null||OpenLayers.Util.indexOf(this.geometryTypes,_5d8.geometry.CLASS_NAME)>-1;
},handle:function(evt){
var type=evt.type;
var _5db=false;
var _5dc=!!(this.feature);
var _5dd=(type=="click"||type=="dblclick");
this.feature=this.layer.getFeatureFromEvent(evt);
if(this.feature){
var _5de=(this.feature!=this.lastFeature);
if(this.geometryTypeMatches(this.feature)){
if(_5dc&&_5de){
this.triggerCallback(type,"out",[this.lastFeature]);
this.triggerCallback(type,"in",[this.feature]);
}else{
if(!_5dc||_5dd){
this.triggerCallback(type,"in",[this.feature]);
}
}
_5db=true;
}else{
if(_5dc&&_5de||(_5dd&&this.lastFeature)){
this.triggerCallback(type,"out",[this.lastFeature]);
}
}
this.lastFeature=this.feature;
}else{
if(_5dc||(_5dd&&this.lastFeature)){
this.triggerCallback(type,"out",[this.lastFeature]);
}
}
return _5db;
},triggerCallback:function(type,mode,args){
var key=this.EVENTMAP[type][mode];
if(key){
if(type=="click"&&mode=="out"&&this.up&&this.down){
var dpx=Math.sqrt(Math.pow(this.up.x-this.down.x,2)+Math.pow(this.up.y-this.down.y,2));
if(dpx<=this.clickoutTolerance){
this.callback(key,args);
}
}else{
this.callback(key,args);
}
}
},activate:function(){
var _5e4=false;
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
this.layerIndex=this.layer.div.style.zIndex;
this.layer.div.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
_5e4=true;
}
return _5e4;
},deactivate:function(){
var _5e5=false;
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
if(this.layer&&this.layer.div){
this.layer.div.style.zIndex=this.layerIndex;
}
this.feature=null;
this.lastFeature=null;
this.down=null;
this.up=null;
_5e5=true;
}
return _5e5;
},CLASS_NAME:"OpenLayers.Handler.Feature"});
OpenLayers.Handler.Keyboard=OpenLayers.Class(OpenLayers.Handler,{KEY_EVENTS:["keydown","keypress","keyup"],eventListener:null,initialize:function(_5e6,_5e7,_5e8){
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
var _5ea=false;
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
for(var i=0;i<this.KEY_EVENTS.length;i++){
OpenLayers.Event.stopObserving(window,this.KEY_EVENTS[i],this.eventListener);
}
_5ea=true;
}
return _5ea;
},handleKeyEvent:function(evt){
if(this.checkModifiers(evt)){
this.callback(evt.type,[evt.charCode||evt.keyCode]);
}
},CLASS_NAME:"OpenLayers.Handler.Keyboard"});
OpenLayers.Handler.MouseWheel=OpenLayers.Class(OpenLayers.Handler,{wheelListener:null,mousePosition:null,initialize:function(_5ed,_5ee,_5ef){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
this.wheelListener=OpenLayers.Function.bindAsEventListener(this.onWheelEvent,this);
},destroy:function(){
OpenLayers.Handler.prototype.destroy.apply(this,arguments);
this.wheelListener=null;
},onWheelEvent:function(e){
if(!this.checkModifiers(e)){
return;
}
var _5f1=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_5f1=true;
break;
}
elem=elem.parentNode;
}
if(_5f1){
var _5f3=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_5f3=e.wheelDelta/120;
if(window.opera){
_5f3=-_5f3;
}
}else{
if(e.detail){
_5f3=-e.detail/3;
}
}
if(_5f3){
if(this.mousePosition){
e.xy=this.mousePosition;
}
if(!e.xy){
e.xy=this.map.getPixelFromLonLat(this.map.getCenter());
}
if(_5f3<0){
this.callback("down",[e,_5f3]);
}else{
this.callback("up",[e,_5f3]);
}
}
OpenLayers.Event.stop(e);
}
},mousemove:function(evt){
this.mousePosition=evt.xy;
},activate:function(evt){
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
var _5f6=this.wheelListener;
OpenLayers.Event.observe(window,"DOMMouseScroll",_5f6);
OpenLayers.Event.observe(window,"mousewheel",_5f6);
OpenLayers.Event.observe(document,"mousewheel",_5f6);
return true;
}else{
return false;
}
},deactivate:function(evt){
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
var _5f8=this.wheelListener;
OpenLayers.Event.stopObserving(window,"DOMMouseScroll",_5f8);
OpenLayers.Event.stopObserving(window,"mousewheel",_5f8);
OpenLayers.Event.stopObserving(document,"mousewheel",_5f8);
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.MouseWheel"});
OpenLayers.Layer=OpenLayers.Class({id:null,name:null,div:null,opacity:null,EVENT_TYPES:["loadstart","loadend","loadcancel","visibilitychanged"],events:null,map:null,isBaseLayer:false,alpha:false,displayInLayerSwitcher:true,visibility:true,attribution:null,inRange:false,imageSize:null,imageOffset:null,options:null,gutter:0,projection:null,units:null,scales:null,resolutions:null,maxExtent:null,minExtent:null,maxResolution:null,minResolution:null,numZoomLevels:null,minScale:null,maxScale:null,displayOutsideMaxExtent:false,wrapDateLine:false,initialize:function(name,_5fa){
this.addOptions(_5fa);
this.name=name;
if(this.id==null){
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
this.div=OpenLayers.Util.createDiv(this.id);
this.div.style.width="100%";
this.div.style.height="100%";
this.events=new OpenLayers.Events(this,this.div,this.EVENT_TYPES);
}
if(this.wrapDateLine){
this.displayOutsideMaxExtent=true;
}
},destroy:function(_5fb){
if(_5fb==null){
_5fb=true;
}
if(this.map!=null){
this.map.removeLayer(this,_5fb);
}
this.projection=null;
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
},setName:function(_5fd){
if(_5fd!=this.name){
this.name=_5fd;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
}
},addOptions:function(_5fe){
if(this.options==null){
this.options={};
}
OpenLayers.Util.extend(this.options,_5fe);
OpenLayers.Util.extend(this,_5fe);
},onMapResize:function(){
},redraw:function(){
var _5ff=false;
if(this.map){
this.inRange=this.calculateInRange();
var _600=this.getExtent();
if(_600&&this.inRange&&this.visibility){
this.moveTo(_600,true,false);
_5ff=true;
}
}
return _5ff;
},moveTo:function(_601,_602,_603){
var _604=this.visibility;
if(!this.isBaseLayer){
_604=_604&&this.inRange;
}
this.display(_604);
},setMap:function(map){
if(this.map==null){
this.map=map;
this.maxExtent=this.maxExtent||this.map.maxExtent;
this.projection=this.projection||this.map.projection;
if(this.projection&&typeof this.projection=="string"){
this.projection=new OpenLayers.Projection(this.projection);
}
this.units=this.projection.getUnits()||this.units||this.map.units;
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
var _609=(size)?size:((this.tileSize)?this.tileSize:this.map.getTileSize());
this.tileSize=_609;
if(this.gutter){
this.imageOffset=new OpenLayers.Pixel(-this.gutter,-this.gutter);
this.imageSize=new OpenLayers.Size(_609.w+(2*this.gutter),_609.h+(2*this.gutter));
}
},getVisibility:function(){
return this.visibility;
},setVisibility:function(_60a){
if(_60a!=this.visibility){
this.visibility=_60a;
this.display(_60a);
this.redraw();
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
this.events.triggerEvent("visibilitychanged");
}
},display:function(_60b){
if(_60b!=(this.div.style.display!="none")){
this.div.style.display=(_60b)?"block":"none";
}
},calculateInRange:function(){
var _60c=false;
if(this.map){
var _60d=this.map.getResolution();
_60c=((_60d>=this.minResolution)&&(_60d<=this.maxResolution));
}
return _60c;
},setIsBaseLayer:function(_60e){
if(_60e!=this.isBaseLayer){
this.isBaseLayer=_60e;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
}
},initResolutions:function(){
var _60f=new Array("projection","units","scales","resolutions","maxScale","minScale","maxResolution","minResolution","minExtent","maxExtent","numZoomLevels","maxZoomLevel");
var _610={};
for(var i=0;i<_60f.length;i++){
var _612=_60f[i];
_610[_612]=this.options[_612]||this.map[_612];
}
if((!_610.numZoomLevels)&&(_610.maxZoomLevel)){
_610.numZoomLevels=_610.maxZoomLevel+1;
}
if((_610.scales!=null)||(_610.resolutions!=null)){
if(_610.scales!=null){
_610.resolutions=[];
for(var i=0;i<_610.scales.length;i++){
var _613=_610.scales[i];
_610.resolutions[i]=OpenLayers.Util.getResolutionFromScale(_613,_610.units);
}
}
_610.numZoomLevels=_610.resolutions.length;
}else{
_610.resolutions=[];
if(_610.minScale){
_610.maxResolution=OpenLayers.Util.getResolutionFromScale(_610.minScale,_610.units);
}else{
if(_610.maxResolution=="auto"){
var _614=this.map.getSize();
var wRes=_610.maxExtent.getWidth()/_614.w;
var hRes=_610.maxExtent.getHeight()/_614.h;
_610.maxResolution=Math.max(wRes,hRes);
}
}
if(_610.maxScale!=null){
_610.minResolution=OpenLayers.Util.getResolutionFromScale(_610.maxScale,_610.units);
}else{
if((_610.minResolution=="auto")&&(_610.minExtent!=null)){
var _614=this.map.getSize();
var wRes=_610.minExtent.getWidth()/_614.w;
var hRes=_610.minExtent.getHeight()/_614.h;
_610.minResolution=Math.max(wRes,hRes);
}
}
if(_610.minResolution!=null){
var _617=_610.maxResolution/_610.minResolution;
_610.numZoomLevels=Math.floor(Math.log(_617)/Math.log(2))+1;
}
for(var i=0;i<_610.numZoomLevels;i++){
var res=_610.maxResolution/Math.pow(2,i);
_610.resolutions.push(res);
}
}
_610.resolutions.sort(function(a,b){
return (b-a);
});
this.resolutions=_610.resolutions;
this.maxResolution=_610.resolutions[0];
var _61b=_610.resolutions.length-1;
this.minResolution=_610.resolutions[_61b];
this.scales=[];
for(var i=0;i<_610.resolutions.length;i++){
this.scales[i]=OpenLayers.Util.getScaleFromResolution(_610.resolutions[i],_610.units);
}
this.minScale=this.scales[0];
this.maxScale=this.scales[this.scales.length-1];
this.numZoomLevels=_610.numZoomLevels;
},getResolution:function(){
var zoom=this.map.getZoom();
return this.resolutions[zoom];
},getExtent:function(){
return this.map.calculateBounds();
},getZoomForExtent:function(_61d,_61e){
var _61f=this.map.getSize();
var _620=Math.max(_61d.getWidth()/_61f.w,_61d.getHeight()/_61f.h);
return this.getZoomForResolution(_620,_61e);
},getDataExtent:function(){
},getZoomForResolution:function(_621,_622){
var diff;
var _624=Number.POSITIVE_INFINITY;
for(var i=0;i<this.resolutions.length;i++){
if(_622){
diff=Math.abs(this.resolutions[i]-_621);
if(diff>_624){
break;
}
_624=diff;
}else{
if(this.resolutions[i]<_621){
break;
}
}
}
return Math.max(0,i-1);
},getLonLatFromViewPortPx:function(_626){
var _627=null;
if(_626!=null){
var size=this.map.getSize();
var _629=this.map.getCenter();
if(_629){
var res=this.map.getResolution();
var _62b=_626.x-(size.w/2);
var _62c=_626.y-(size.h/2);
_627=new OpenLayers.LonLat(_629.lon+_62b*res,_629.lat-_62c*res);
if(this.wrapDateLine){
_627=_627.wrapDateLine(this.maxExtent);
}
}
}
return _627;
},getViewPortPxFromLonLat:function(_62d){
var px=null;
if(_62d!=null){
var _62f=this.map.getResolution();
var _630=this.map.getExtent();
px=new OpenLayers.Pixel(Math.round(1/_62f*(_62d.lon-_630.left)),Math.round(1/_62f*(_630.top-_62d.lat)));
}
return px;
},setOpacity:function(_631){
if(_631!=this.opacity){
this.opacity=_631;
for(var i=0;i<this.div.childNodes.length;++i){
var _633=this.div.childNodes[i].firstChild;
OpenLayers.Util.modifyDOMElement(_633,null,null,null,null,null,null,_631);
}
}
},setZIndex:function(_634){
this.div.style.zIndex=_634;
},adjustBounds:function(_635){
if(this.gutter){
var _636=this.gutter*this.map.getResolution();
_635=new OpenLayers.Bounds(_635.left-_636,_635.bottom-_636,_635.right+_636,_635.top+_636);
}
if(this.wrapDateLine){
var _637={"rightTolerance":this.getResolution()};
_635=_635.wrapDateLine(this.maxExtent,_637);
}
return _635;
},CLASS_NAME:"OpenLayers.Layer"});
OpenLayers.Marker.Box=OpenLayers.Class(OpenLayers.Marker,{bounds:null,div:null,initialize:function(_638,_639,_63a){
this.bounds=_638;
this.div=OpenLayers.Util.createDiv();
this.div.style.overflow="hidden";
this.events=new OpenLayers.Events(this,this.div,null);
this.setBorder(_639,_63a);
},destroy:function(){
this.bounds=null;
this.div=null;
OpenLayers.Marker.prototype.destroy.apply(this,arguments);
},setBorder:function(_63b,_63c){
if(!_63b){
_63b="red";
}
if(!_63c){
_63c=2;
}
this.div.style.border=_63c+"px solid "+_63b;
},draw:function(px,sz){
OpenLayers.Util.modifyDOMElement(this.div,null,px,sz);
return this.div;
},onScreen:function(){
var _63f=false;
if(this.map){
var _640=this.map.getExtent();
_63f=_640.containsBounds(this.bounds,true,true);
}
return _63f;
},display:function(_641){
this.div.style.display=(_641)?"":"none";
},CLASS_NAME:"OpenLayers.Marker.Box"});
OpenLayers.Control.DragFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,onStart:function(_642,_643){
},onDrag:function(_644,_645){
},onComplete:function(_646,_647){
},layer:null,feature:null,dragHandler:null,dragCallbacks:{},featureHandler:null,featureCallbacks:{},lastPixel:null,initialize:function(_648,_649){
OpenLayers.Control.prototype.initialize.apply(this,[_649]);
this.layer=_648;
this.dragCallbacks=OpenLayers.Util.extend({down:this.downFeature,move:this.moveFeature,up:this.upFeature,out:this.cancel,done:this.doneDragging},this.dragCallbacks);
this.dragHandler=new OpenLayers.Handler.Drag(this,this.dragCallbacks);
this.featureCallbacks=OpenLayers.Util.extend({over:this.overFeature,out:this.outFeature},this.featureCallbacks);
var _64a={geometryTypes:this.geometryTypes};
this.featureHandler=new OpenLayers.Handler.Feature(this,this.layer,this.featureCallbacks,_64a);
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
},overFeature:function(_64b){
if(!this.dragHandler.dragging){
this.feature=_64b;
this.dragHandler.activate();
this.over=true;
this.map.div.style.cursor="move";
}else{
if(this.feature.id==_64b.id){
this.over=true;
}else{
this.over=false;
}
}
},downFeature:function(_64c){
this.lastPixel=_64c;
this.onStart(this.feature,_64c);
},moveFeature:function(_64d){
var res=this.map.getResolution();
this.feature.geometry.move(res*(_64d.x-this.lastPixel.x),res*(this.lastPixel.y-_64d.y));
this.layer.drawFeature(this.feature);
this.lastPixel=_64d;
this.onDrag(this.feature,_64d);
},upFeature:function(_64f){
if(!this.over){
this.dragHandler.deactivate();
this.feature=null;
this.map.div.style.cursor="default";
}
},doneDragging:function(_650){
this.onComplete(this.feature,_650);
},outFeature:function(_651){
if(!this.dragHandler.dragging){
this.over=false;
this.dragHandler.deactivate();
this.map.div.style.cursor="default";
this.feature=null;
}else{
if(this.feature.id==_651.id){
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
var _654=this.handler.last.x-xy.x;
var _655=this.handler.last.y-xy.y;
var size=this.map.getSize();
var _657=new OpenLayers.Pixel(size.w/2+_654,size.h/2+_655);
var _658=this.map.getLonLatFromViewPortPx(_657);
this.map.setCenter(_658,null,this.handler.dragging);
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
OpenLayers.Feature.Vector=OpenLayers.Class(OpenLayers.Feature,{fid:null,geometry:null,attributes:null,state:null,style:null,initialize:function(_65c,_65d,_65e){
OpenLayers.Feature.prototype.initialize.apply(this,[null,null,_65d]);
this.lonlat=null;
this.geometry=_65c;
this.state=null;
this.attributes={};
if(_65d){
this.attributes=OpenLayers.Util.extend(this.attributes,_65d);
}
this.style=_65e?_65e:null;
},destroy:function(){
if(this.layer){
this.layer.removeFeatures(this);
this.layer=null;
}
this.geometry=null;
OpenLayers.Feature.prototype.destroy.apply(this,arguments);
},clone:function(){
return new OpenLayers.Feature.Vector(this.geometry.clone(),this.attributes,this.style);
},onScreen:function(_65f){
var _660=false;
if(this.layer&&this.layer.map){
var _661=this.layer.map.getExtent();
if(_65f){
var _662=this.geometry.getBounds();
_660=_661.intersectsBounds(_662);
}else{
var _663=_661.toGeometry();
_660=_663.intersects(this.geometry);
}
}
return _660;
},createMarker:function(){
return null;
},destroyMarker:function(){
},createPopup:function(){
return null;
},atPoint:function(_664,_665,_666){
var _667=false;
if(this.geometry){
_667=this.geometry.atPoint(_664,_665,_666);
}
return _667;
},destroyPopup:function(){
},toState:function(_668){
if(_668==OpenLayers.State.UPDATE){
switch(this.state){
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.DELETE:
this.state=_668;
break;
case OpenLayers.State.UPDATE:
case OpenLayers.State.INSERT:
break;
}
}else{
if(_668==OpenLayers.State.INSERT){
switch(this.state){
case OpenLayers.State.UNKNOWN:
break;
default:
this.state=_668;
break;
}
}else{
if(_668==OpenLayers.State.DELETE){
switch(this.state){
case OpenLayers.State.INSERT:
break;
case OpenLayers.State.DELETE:
break;
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.UPDATE:
this.state=_668;
break;
}
}else{
if(_668==OpenLayers.State.UNKNOWN){
this.state=_668;
}
}
}
}
},CLASS_NAME:"OpenLayers.Feature.Vector"});
OpenLayers.Feature.Vector.style={"default":{fillColor:"#ee9900",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"#ee9900",strokeOpacity:1,strokeWidth:1,strokeLinecap:"round",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"},"select":{fillColor:"blue",strokeColor:"blue",cursor:"pointer"},"temporary":{fillColor:"yellow",fillOpacity:0.2,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"yellow",strokeOpacity:1,strokeLinecap:"round",strokeWidth:4,hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"}};
OpenLayers.Feature.WFS=OpenLayers.Class(OpenLayers.Feature,{initialize:function(_669,_66a){
var _66b=arguments;
var data=this.processXMLNode(_66a);
_66b=new Array(_669,data.lonlat,data);
OpenLayers.Feature.prototype.initialize.apply(this,_66b);
this.createMarker();
this.layer.addMarker(this.marker);
},destroy:function(){
if(this.marker!=null){
this.layer.removeMarker(this.marker);
}
OpenLayers.Feature.prototype.destroy.apply(this,arguments);
},processXMLNode:function(_66d){
var _66e=OpenLayers.Ajax.getElementsByTagNameNS(_66d,"http://www.opengis.net/gml","gml","Point");
var text=OpenLayers.Util.getXmlNodeValue(OpenLayers.Ajax.getElementsByTagNameNS(_66e[0],"http://www.opengis.net/gml","gml","coordinates")[0]);
var _670=text.split(",");
return {lonlat:new OpenLayers.LonLat(parseFloat(_670[0]),parseFloat(_670[1])),id:null};
},CLASS_NAME:"OpenLayers.Feature.WFS"});
OpenLayers.Handler.Box=OpenLayers.Class(OpenLayers.Handler,{dragHandler:null,boxDivClassName:"olHandlerBoxZoomBox",initialize:function(_671,_672,_673){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
var _672={"down":this.startBox,"move":this.moveBox,"out":this.removeBox,"up":this.endBox};
this.dragHandler=new OpenLayers.Handler.Drag(this,_672,{keyMask:this.keyMask});
},setMap:function(map){
OpenLayers.Handler.prototype.setMap.apply(this,arguments);
if(this.dragHandler){
this.dragHandler.setMap(map);
}
},startBox:function(xy){
this.zoomBox=OpenLayers.Util.createDiv("zoomBox",this.dragHandler.start);
this.zoomBox.className=this.boxDivClassName;
this.zoomBox.style.zIndex=this.map.Z_INDEX_BASE["Popup"]-1;
this.map.viewPortDiv.appendChild(this.zoomBox);
this.map.div.style.cursor="crosshair";
},moveBox:function(xy){
var _677=Math.abs(this.dragHandler.start.x-xy.x);
var _678=Math.abs(this.dragHandler.start.y-xy.y);
this.zoomBox.style.width=Math.max(1,_677)+"px";
this.zoomBox.style.height=Math.max(1,_678)+"px";
if(xy.x<this.dragHandler.start.x){
this.zoomBox.style.left=xy.x+"px";
}
if(xy.y<this.dragHandler.start.y){
this.zoomBox.style.top=xy.y+"px";
}
},endBox:function(end){
var _67a;
if(Math.abs(this.dragHandler.start.x-end.x)>5||Math.abs(this.dragHandler.start.y-end.y)>5){
var _67b=this.dragHandler.start;
var top=Math.min(_67b.y,end.y);
var _67d=Math.max(_67b.y,end.y);
var left=Math.min(_67b.x,end.x);
var _67f=Math.max(_67b.x,end.x);
_67a=new OpenLayers.Bounds(left,_67d,_67f,top);
}else{
_67a=this.dragHandler.start.clone();
}
this.removeBox();
this.map.div.style.cursor="";
this.callback("done",[_67a]);
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
OpenLayers.Handler.RegularPolygon=OpenLayers.Class(OpenLayers.Handler.Drag,{sides:4,radius:null,snapAngle:null,snapToggle:"shiftKey",persist:false,irregular:false,angle:null,fixedRadius:false,feature:null,layer:null,origin:null,initialize:function(_680,_681,_682){
this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});
OpenLayers.Handler.prototype.initialize.apply(this,[_680,_681,_682]);
this.options=(_682)?_682:new Object();
},setOptions:function(_683){
OpenLayers.Util.extend(this.options,_683);
OpenLayers.Util.extend(this,_683);
},activate:function(){
var _684=false;
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
var _685={displayInLayerSwitcher:false};
this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,_685);
this.map.addLayer(this.layer);
_684=true;
}
return _684;
},deactivate:function(){
var _686=false;
if(OpenLayers.Handler.Drag.prototype.deactivate.apply(this,arguments)){
if(this.dragging){
this.cancel();
}
if(this.layer.map!=null){
this.layer.destroy(false);
if(this.feature){
this.feature.destroy();
}
}
this.layer=null;
this.feature=null;
_686=true;
}
return _686;
},down:function(evt){
this.fixedRadius=!!(this.radius);
var _688=this.map.getLonLatFromPixel(evt.xy);
this.origin=new OpenLayers.Geometry.Point(_688.lon,_688.lat);
if(!this.fixedRadius||this.irregular){
this.radius=this.map.getResolution();
}
if(this.persist){
this.clear();
}
this.feature=new OpenLayers.Feature.Vector();
this.createGeometry();
this.layer.addFeatures([this.feature],{silent:true});
this.layer.drawFeature(this.feature,this.style);
},move:function(evt){
var _68a=this.map.getLonLatFromPixel(evt.xy);
var _68b=new OpenLayers.Geometry.Point(_68a.lon,_68a.lat);
if(this.irregular){
var ry=Math.sqrt(2)*Math.abs(_68b.y-this.origin.y)/2;
this.radius=Math.max(this.map.getResolution()/2,ry);
}else{
if(this.fixedRadius){
this.origin=_68b;
}else{
this.calculateAngle(_68b,evt);
this.radius=Math.max(this.map.getResolution()/2,_68b.distanceTo(this.origin));
}
}
this.modifyGeometry();
if(this.irregular){
var dx=_68b.x-this.origin.x;
var dy=_68b.y-this.origin.y;
var _68f;
if(dy==0){
_68f=dx/(this.radius*Math.sqrt(2));
}else{
_68f=dx/dy;
}
this.feature.geometry.resize(1,this.origin,_68f);
this.feature.geometry.move(dx/2,dy/2);
}
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
var _692,dx,dy,point;
var ring=this.feature.geometry.components[0];
if(ring.components.length!=(this.sides+1)){
this.createGeometry();
ring=this.feature.geometry.components[0];
}
for(var i=0;i<this.sides;++i){
point=ring.components[i];
_692=this.angle+(i*2*Math.PI/this.sides);
point.x=this.origin.x+(this.radius*Math.cos(_692));
point.y=this.origin.y+(this.radius*Math.sin(_692));
point.clearBounds();
}
},calculateAngle:function(_695,evt){
var _697=Math.atan2(_695.y-this.origin.y,_695.x-this.origin.x);
if(this.snapAngle&&(this.snapToggle&&!evt[this.snapToggle])){
var _698=(Math.PI/180)*this.snapAngle;
this.angle=Math.round(_697/_698)*_698;
}else{
this.angle=_697;
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
OpenLayers.Layer.EventPane=OpenLayers.Class(OpenLayers.Layer,{smoothDragPan:true,isBaseLayer:true,isFixed:true,pane:null,mapObject:null,initialize:function(name,_69c){
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
var _69f=this.map.getSize();
var msgW=Math.min(_69f.w,300);
var msgH=Math.min(_69f.h,200);
var size=new OpenLayers.Size(msgW,msgH);
var _6a3=new OpenLayers.Pixel(_69f.w/2,_69f.h/2);
var _6a4=_6a3.add(-size.w/2,-size.h/2);
var div=OpenLayers.Util.createDiv(this.name+"_warning",_6a4,size,null,null,null,"auto");
div.style.padding="7px";
div.style.backgroundColor="yellow";
div.innerHTML=this.getWarningHTML();
this.div.appendChild(div);
},getWarningHTML:function(){
return "";
},display:function(_6a6){
OpenLayers.Layer.prototype.display.apply(this,arguments);
this.pane.style.display=this.div.style.display;
},setZIndex:function(_6a7){
OpenLayers.Layer.prototype.setZIndex.apply(this,arguments);
this.pane.style.zIndex=parseInt(this.div.style.zIndex)+1;
},moveTo:function(_6a8,_6a9,_6aa){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(this.mapObject!=null){
var _6ab=this.map.getCenter();
var _6ac=this.map.getZoom();
if(_6ab!=null){
var _6ad=this.getMapObjectCenter();
var _6ae=this.getOLLonLatFromMapObjectLonLat(_6ad);
var _6af=this.getMapObjectZoom();
var _6b0=this.getOLZoomFromMapObjectZoom(_6af);
if(!(_6ab.equals(_6ae))||!(_6ac==_6b0)){
if(_6aa&&this.dragPanMapObject&&this.smoothDragPan){
var _6b1=this.map.getResolution();
var dX=(_6ab.lon-_6ae.lon)/_6b1;
var dY=(_6ab.lat-_6ae.lat)/_6b1;
this.dragPanMapObject(dX,dY);
}else{
var _6b4=this.getMapObjectLonLatFromOLLonLat(_6ab);
var zoom=this.getMapObjectZoomFromOLZoom(_6ac);
this.setMapObjectCenter(_6b4,zoom,_6aa);
}
}
}
}
},getLonLatFromViewPortPx:function(_6b6){
var _6b7=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _6b8=this.getMapObjectPixelFromOLPixel(_6b6);
var _6b9=this.getMapObjectLonLatFromMapObjectPixel(_6b8);
_6b7=this.getOLLonLatFromMapObjectLonLat(_6b9);
var xrem=this.map.size.w%2;
var yrem=this.map.size.h%2;
if(xrem!=0||yrem!=0){
var olPx=_6b6.add(xrem,yrem);
var moPx=this.getMapObjectPixelFromOLPixel(olPx);
var _6be=this.getMapObjectLonLatFromMapObjectPixel(moPx);
var _6bf=this.getOLLonLatFromMapObjectLonLat(_6be);
_6b7.lon+=(_6bf.lon-_6b7.lon)/2;
_6b7.lat+=(_6bf.lat-_6b7.lat)/2;
}
}
return _6b7;
},getViewPortPxFromLonLat:function(_6c0){
var _6c1=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _6c2=this.getMapObjectLonLatFromOLLonLat(_6c0);
var _6c3=this.getMapObjectPixelFromMapObjectLonLat(_6c2);
_6c1=this.getOLPixelFromMapObjectPixel(_6c3);
}
return _6c1;
},getOLLonLatFromMapObjectLonLat:function(_6c4){
var _6c5=null;
if(_6c4!=null){
var lon=this.getLongitudeFromMapObjectLonLat(_6c4);
var lat=this.getLatitudeFromMapObjectLonLat(_6c4);
_6c5=new OpenLayers.LonLat(lon,lat);
}
return _6c5;
},getMapObjectLonLatFromOLLonLat:function(_6c8){
var _6c9=null;
if(_6c8!=null){
_6c9=this.getMapObjectLonLatFromLonLat(_6c8.lon,_6c8.lat);
}
return _6c9;
},getOLPixelFromMapObjectPixel:function(_6ca){
var _6cb=null;
if(_6ca!=null){
var x=this.getXFromMapObjectPixel(_6ca);
var y=this.getYFromMapObjectPixel(_6ca);
_6cb=new OpenLayers.Pixel(x,y);
}
return _6cb;
},getMapObjectPixelFromOLPixel:function(_6ce){
var _6cf=null;
if(_6ce!=null){
_6cf=this.getMapObjectPixelFromXY(_6ce.x,_6ce.y);
}
return _6cf;
},CLASS_NAME:"OpenLayers.Layer.EventPane"});
OpenLayers.Layer.FixedZoomLevels=OpenLayers.Class({initialize:function(){
},initResolutions:function(){
var _6d0=new Array("minZoomLevel","maxZoomLevel","numZoomLevels");
for(var i=0;i<_6d0.length;i++){
var _6d2=_6d0[i];
this[_6d2]=(this.options[_6d2]!=null)?this.options[_6d2]:this.map[_6d2];
}
if((this.minZoomLevel==null)||(this.minZoomLevel<this.MIN_ZOOM_LEVEL)){
this.minZoomLevel=this.MIN_ZOOM_LEVEL;
}
var _6d3=this.MAX_ZOOM_LEVEL-this.minZoomLevel+1;
if(this.numZoomLevels!=null){
this.numZoomLevels=Math.min(this.numZoomLevels,_6d3);
}else{
if(this.maxZoomLevel!=null){
var _6d4=this.maxZoomLevel-this.minZoomLevel+1;
this.numZoomLevels=Math.min(_6d4,_6d3);
}else{
this.numZoomLevels=_6d3;
}
}
this.maxZoomLevel=this.minZoomLevel+this.numZoomLevels-1;
if(this.RESOLUTIONS!=null){
var _6d5=0;
this.resolutions=[];
for(var i=this.minZoomLevel;i<=this.maxZoomLevel;i++){
this.resolutions[_6d5++]=this.RESOLUTIONS[i];
}
}
},getResolution:function(){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getResolution.apply(this,arguments);
}else{
var _6d6=null;
var _6d7=this.map.getSize();
var _6d8=this.getExtent();
if((_6d7!=null)&&(_6d8!=null)){
_6d6=Math.max(_6d8.getWidth()/_6d7.w,_6d8.getHeight()/_6d7.h);
}
return _6d6;
}
},getExtent:function(){
var _6d9=null;
var size=this.map.getSize();
var tlPx=new OpenLayers.Pixel(0,0);
var tlLL=this.getLonLatFromViewPortPx(tlPx);
var brPx=new OpenLayers.Pixel(size.w,size.h);
var brLL=this.getLonLatFromViewPortPx(brPx);
if((tlLL!=null)&&(brLL!=null)){
_6d9=new OpenLayers.Bounds(tlLL.lon,brLL.lat,brLL.lon,tlLL.lat);
}
return _6d9;
},getZoomForResolution:function(_6df){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getZoomForResolution.apply(this,arguments);
}else{
var _6e0=OpenLayers.Layer.prototype.getExtent.apply(this,[]);
return this.getZoomForExtent(_6e0);
}
},getOLZoomFromMapObjectZoom:function(_6e1){
var zoom=null;
if(_6e1!=null){
zoom=_6e1-this.minZoomLevel;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_6e3){
var zoom=null;
if(_6e3!=null){
zoom=_6e3+this.minZoomLevel;
}
return zoom;
},CLASS_NAME:"FixedZoomLevels.js"});
OpenLayers.Layer.HTTPRequest=OpenLayers.Class(OpenLayers.Layer,{URL_HASH_FACTOR:(Math.sqrt(5)-1)/2,url:null,params:null,reproject:false,initialize:function(name,url,_6e7,_6e8){
var _6e9=arguments;
_6e9=[name,_6e8];
OpenLayers.Layer.prototype.initialize.apply(this,_6e9);
this.url=url;
this.params=OpenLayers.Util.extend({},_6e7);
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
},setUrl:function(_6eb){
this.url=_6eb;
},mergeNewParams:function(_6ec){
this.params=OpenLayers.Util.extend(this.params,_6ec);
this.redraw();
},selectUrl:function(_6ed,urls){
var _6ef=1;
for(var i=0;i<_6ed.length;i++){
_6ef*=_6ed.charCodeAt(i)*this.URL_HASH_FACTOR;
_6ef-=Math.floor(_6ef);
}
return urls[Math.floor(_6ef*urls.length)];
},getFullRequestString:function(_6f1,_6f2){
var url=_6f2||this.url;
var _6f4=OpenLayers.Util.extend({},this.params);
_6f4=OpenLayers.Util.extend(_6f4,_6f1);
var _6f5=OpenLayers.Util.getParameterString(_6f4);
if(url instanceof Array){
url=this.selectUrl(_6f5,url);
}
var _6f6=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
for(var key in _6f4){
if(key.toUpperCase() in _6f6){
delete _6f4[key];
}
}
_6f5=OpenLayers.Util.getParameterString(_6f4);
var _6f8=url;
if(_6f5!=""){
var _6f9=url.charAt(url.length-1);
if((_6f9=="&")||(_6f9=="?")){
_6f8+=_6f5;
}else{
if(url.indexOf("?")==-1){
_6f8+="?"+_6f5;
}else{
_6f8+="&"+_6f5;
}
}
}
return _6f8;
},CLASS_NAME:"OpenLayers.Layer.HTTPRequest"});
OpenLayers.Layer.Image=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:true,url:null,extent:null,size:null,tile:null,aspectRatio:null,initialize:function(name,url,_6fc,size,_6fe){
this.url=url;
this.extent=_6fc;
this.size=size;
OpenLayers.Layer.prototype.initialize.apply(this,[name,_6fe]);
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
},moveTo:function(_701,_702,_703){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
var _704=(this.tile==null);
if(_702||_704){
this.setTileSize();
var ul=new OpenLayers.LonLat(this.extent.left,this.extent.top);
var ulPx=this.map.getLayerPxFromLonLat(ul);
if(_704){
this.tile=new OpenLayers.Tile.Image(this,ulPx,this.extent,null,this.tileSize);
}else{
this.tile.size=this.tileSize.clone();
this.tile.position=ulPx.clone();
}
this.tile.draw();
}
},setTileSize:function(){
var _707=this.extent.getWidth()/this.map.getResolution();
var _708=this.extent.getHeight()/this.map.getResolution();
this.tileSize=new OpenLayers.Size(_707,_708);
},setUrl:function(_709){
this.url=_709;
this.tile.draw();
},getURL:function(_70a){
return this.url;
},CLASS_NAME:"OpenLayers.Layer.Image"});
OpenLayers.Layer.Markers=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:false,markers:null,drawn:false,initialize:function(name,_70c){
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
this.markers=[];
},destroy:function(){
this.clearMarkers();
this.markers=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},setOpacity:function(_70d){
if(_70d!=this.opacity){
this.opacity=_70d;
for(var i=0;i<this.markers.length;i++){
this.markers[i].setOpacity(this.opacity);
}
}
},moveTo:function(_70f,_710,_711){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(_710||!this.drawn){
for(var i=0;i<this.markers.length;i++){
this.drawMarker(this.markers[i]);
}
this.drawn=true;
}
},addMarker:function(_713){
this.markers.push(_713);
if(this.opacity!=null){
_713.setOpacity(this.opacity);
}
if(this.map&&this.map.getExtent()){
_713.map=this.map;
this.drawMarker(_713);
}
},removeMarker:function(_714){
OpenLayers.Util.removeItem(this.markers,_714);
if((_714.icon!=null)&&(_714.icon.imageDiv!=null)&&(_714.icon.imageDiv.parentNode==this.div)){
this.div.removeChild(_714.icon.imageDiv);
_714.drawn=false;
}
},clearMarkers:function(){
if(this.markers!=null){
while(this.markers.length>0){
this.removeMarker(this.markers[0]);
}
}
},drawMarker:function(_715){
var px=this.map.getLayerPxFromLonLat(_715.lonlat);
if(px==null){
_715.display(false);
}else{
var _717=_715.draw(px);
if(!_715.drawn){
this.div.appendChild(_717);
_715.drawn=true;
}
}
},getDataExtent:function(){
var _718=null;
if(this.markers&&(this.markers.length>0)){
var _718=new OpenLayers.Bounds();
for(var i=0;i<this.markers.length;i++){
var _71a=this.markers[i];
_718.extend(_71a.lonlat);
}
}
return _718;
},CLASS_NAME:"OpenLayers.Layer.Markers"});
OpenLayers.Layer.SphericalMercator={getExtent:function(){
var _71b=null;
if(this.sphericalMercator){
_71b=this.map.calculateBounds();
}else{
_71b=OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this);
}
return _71b;
},initMercatorParameters:function(){
this.RESOLUTIONS=[];
var _71c=156543.0339;
for(var zoom=0;zoom<=this.MAX_ZOOM_LEVEL;++zoom){
this.RESOLUTIONS[zoom]=_71c/Math.pow(2,zoom);
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
},projectForward:function(_726){
var _727=OpenLayers.Layer.SphericalMercator.forwardMercator(_726.x,_726.y);
_726.x=_727.lon;
_726.y=_727.lat;
return _726;
},projectInverse:function(_728){
var _729=OpenLayers.Layer.SphericalMercator.inverseMercator(_728.x,_728.y);
_728.x=_729.lon;
_728.y=_729.lat;
return _728;
}};
OpenLayers.Projection.addTransform("EPSG:4326","EPSG:900913",OpenLayers.Layer.SphericalMercator.projectForward);
OpenLayers.Projection.addTransform("EPSG:900913","EPSG:4326",OpenLayers.Layer.SphericalMercator.projectInverse);
OpenLayers.Control.DrawFeature=OpenLayers.Class(OpenLayers.Control,{layer:null,callbacks:null,featureAdded:function(){
},handlerOptions:null,initialize:function(_72a,_72b,_72c){
OpenLayers.Control.prototype.initialize.apply(this,[_72c]);
this.callbacks=OpenLayers.Util.extend({done:this.drawFeature},this.callbacks);
this.layer=_72a;
this.handler=new _72b(this,this.callbacks,this.handlerOptions);
},drawFeature:function(_72d){
var _72e=new OpenLayers.Feature.Vector(_72d);
this.layer.addFeatures([_72e]);
this.featureAdded(_72e);
},CLASS_NAME:"OpenLayers.Control.DrawFeature"});
OpenLayers.Control.SelectFeature=OpenLayers.Class(OpenLayers.Control,{multipleKey:null,toggleKey:null,multiple:false,clickout:true,toggle:false,hover:false,onSelect:function(){
},onUnselect:function(){
},geometryTypes:null,layer:null,callbacks:null,selectStyle:OpenLayers.Feature.Vector.style["select"],handler:null,initialize:function(_72f,_730){
OpenLayers.Control.prototype.initialize.apply(this,[_730]);
this.layer=_72f;
this.callbacks=OpenLayers.Util.extend({click:this.clickFeature,clickout:this.clickoutFeature,over:this.overFeature,out:this.outFeature},this.callbacks);
var _731={geometryTypes:this.geometryTypes};
this.handler=new OpenLayers.Handler.Feature(this,_72f,this.callbacks,_731);
},unselectAll:function(){
while(this.layer.selectedFeatures.length>0){
this.unselect(this.layer.selectedFeatures[0]);
}
},clickFeature:function(_732){
if(this.hover){
return;
}
var _733=(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_732)>-1);
if(!this.multiple&&!this.handler.evt[this.multipleKey]){
this.unselectAll();
}
if(_733){
if(this.toggle||this.handler.evt[this.toggleKey]){
this.unselect(_732);
}else{
this.select(_732);
}
}else{
this.select(_732);
}
},clickoutFeature:function(_734){
if(!this.hover&&this.clickout){
this.unselectAll();
}
},overFeature:function(_735){
if(this.hover&&(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_735)==-1)){
this.select(_735);
}
},outFeature:function(_736){
if(this.hover){
this.unselect(_736);
}
},select:function(_737){
if(_737.originalStyle==null){
_737.originalStyle=OpenLayers.Util.extend({},_737.style);
}
this.layer.selectedFeatures.push(_737);
_737.style=OpenLayers.Util.extend(_737.style,this.selectStyle);
this.layer.drawFeature(_737);
this.onSelect(_737);
},unselect:function(_738){
if(_738.originalStyle!=null){
_738.style=OpenLayers.Util.extend({},_738.originalStyle);
}
this.layer.drawFeature(_738);
OpenLayers.Util.removeItem(this.layer.selectedFeatures,_738);
this.onUnselect(_738);
},setMap:function(map){
this.handler.setMap(map);
OpenLayers.Control.prototype.setMap.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Control.SelectFeature"});
OpenLayers.Control.ZoomBox=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask});
},zoomBox:function(_73a){
if(_73a instanceof OpenLayers.Bounds){
var _73b=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_73a.left,_73a.bottom));
var _73c=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_73a.right,_73a.top));
var _73d=new OpenLayers.Bounds(_73b.lon,_73b.lat,_73c.lon,_73c.lat);
this.map.zoomToExtent(_73d);
}else{
this.map.setCenter(this.map.getLonLatFromPixel(_73a),this.map.getZoom()+1);
}
},CLASS_NAME:"OpenLayers.Control.ZoomBox"});
OpenLayers.Format.WKT=OpenLayers.Class(OpenLayers.Format,{initialize:function(_73e){
this.regExes={"typeStr":/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,"spaces":/\s+/,"parenComma":/\)\s*,\s*\(/,"doubleParenComma":/\)\s*\)\s*,\s*\(\s*\(/,"trimParens":/^\s*\(?(.*?)\)?\s*$/};
OpenLayers.Format.prototype.initialize.apply(this,[_73e]);
},read:function(wkt){
var _740,type,str;
var _741=this.regExes.typeStr.exec(wkt);
if(_741){
type=_741[1].toLowerCase();
str=_741[2];
if(this.parse[type]){
_740=this.parse[type].apply(this,[str]);
}
if(this.internalProjection&&this.externalProjection){
if(_740&&_740.CLASS_NAME=="OpenLayers.Feature.Vector"){
_740.geometry.transform(this.externalProjection,this.internalProjection);
}else{
if(_740&&typeof _740=="object"){
for(var i=0;i<_740.length;i++){
var _743=_740[i];
_743.geometry.transform(this.externalProjection,this.internalProjection);
}
}
}
}
}
return _740;
},write:function(_744){
var _745,geometry,type,data,isCollection;
if(_744.constructor==Array){
_745=_744;
isCollection=true;
}else{
_745=[_744];
isCollection=false;
}
var _746=[];
if(isCollection){
_746.push("GEOMETRYCOLLECTION(");
}
for(var i=0;i<_745.length;++i){
if(isCollection&&i>0){
_746.push(",");
}
geometry=_745[i].geometry;
type=geometry.CLASS_NAME.split(".")[2].toLowerCase();
if(!this.extract[type]){
return null;
}
if(this.internalProjection&&this.externalProjection){
geometry=geometry.clone();
geometry.transform(this.internalProjection,this.externalProjection);
}
data=this.extract[type].apply(this,[geometry]);
_746.push(type.toUpperCase()+"("+data+")");
}
if(isCollection){
_746.push(")");
}
return _746.join("");
},extract:{"point":function(_748){
return _748.x+" "+_748.y;
},"multipoint":function(_749){
var _74a=[];
for(var i=0;i<_749.components.length;++i){
_74a.push(this.extract.point.apply(this,[_749.components[i]]));
}
return _74a.join(",");
},"linestring":function(_74c){
var _74d=[];
for(var i=0;i<_74c.components.length;++i){
_74d.push(this.extract.point.apply(this,[_74c.components[i]]));
}
return _74d.join(",");
},"multilinestring":function(_74f){
var _750=[];
for(var i=0;i<_74f.components.length;++i){
_750.push("("+this.extract.linestring.apply(this,[_74f.components[i]])+")");
}
return _750.join(",");
},"polygon":function(_752){
var _753=[];
for(var i=0;i<_752.components.length;++i){
_753.push("("+this.extract.linestring.apply(this,[_752.components[i]])+")");
}
return _753.join(",");
},"multipolygon":function(_755){
var _756=[];
for(var i=0;i<_755.components.length;++i){
_756.push("("+this.extract.polygon.apply(this,[_755.components[i]])+")");
}
return _756.join(",");
}},parse:{"point":function(str){
var _759=OpenLayers.String.trim(str).split(this.regExes.spaces);
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_759[0],_759[1]));
},"multipoint":function(str){
var _75b=OpenLayers.String.trim(str).split(",");
var _75c=[];
for(var i=0;i<_75b.length;++i){
_75c.push(this.parse.point.apply(this,[_75b[i]]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPoint(_75c));
},"linestring":function(str){
var _75f=OpenLayers.String.trim(str).split(",");
var _760=[];
for(var i=0;i<_75f.length;++i){
_760.push(this.parse.point.apply(this,[_75f[i]]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(_760));
},"multilinestring":function(str){
var line;
var _764=OpenLayers.String.trim(str).split(this.regExes.parenComma);
var _765=[];
for(var i=0;i<_764.length;++i){
line=_764[i].replace(this.regExes.trimParens,"$1");
_765.push(this.parse.linestring.apply(this,[line]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(_765));
},"polygon":function(str){
var ring,linestring,linearring;
var _769=OpenLayers.String.trim(str).split(this.regExes.parenComma);
var _76a=[];
for(var i=0;i<_769.length;++i){
ring=_769[i].replace(this.regExes.trimParens,"$1");
linestring=this.parse.linestring.apply(this,[ring]).geometry;
linearring=new OpenLayers.Geometry.LinearRing(linestring.components);
_76a.push(linearring);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(_76a));
},"multipolygon":function(str){
var _76d;
var _76e=OpenLayers.String.trim(str).split(this.regExes.doubleParenComma);
var _76f=[];
for(var i=0;i<_76e.length;++i){
_76d=_76e[i].replace(this.regExes.trimParens,"$1");
_76f.push(this.parse.polygon.apply(this,[_76d]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon(_76f));
},"geometrycollection":function(str){
str=str.replace(/,\s*([A-Za-z])/g,"|$1");
var _772=OpenLayers.String.trim(str).split("|");
var _773=[];
for(var i=0;i<_772.length;++i){
_773.push(OpenLayers.Format.WKT.prototype.read.apply(this,[_772[i]]));
}
return _773;
}},CLASS_NAME:"OpenLayers.Format.WKT"});
OpenLayers.Layer.Boxes=OpenLayers.Class(OpenLayers.Layer.Markers,{initialize:function(name,_776){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
},drawMarker:function(_777){
var _778=_777.bounds;
var _779=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_778.left,_778.top));
var _77a=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_778.right,_778.bottom));
if(_77a==null||_779==null){
_777.display(false);
}else{
var sz=new OpenLayers.Size(Math.max(1,_77a.x-_779.x),Math.max(1,_77a.y-_779.y));
var _77c=_777.draw(_779,sz);
if(!_777.drawn){
this.div.appendChild(_77c);
_777.drawn=true;
}
}
},removeMarker:function(_77d){
OpenLayers.Util.removeItem(this.markers,_77d);
if((_77d.div!=null)&&(_77d.div.parentNode==this.div)){
this.div.removeChild(_77d.div);
}
},CLASS_NAME:"OpenLayers.Layer.Boxes"});
OpenLayers.Layer.GeoRSS=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,icon:null,popupSize:null,useFeedTitle:true,initialize:function(name,_77f,_780){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,[name,_780]);
this.location=_77f;
this.features=[];
this.events.triggerEvent("loadstart");
OpenLayers.loadURL(_77f,null,this,this.parseData);
},destroy:function(){
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
this.clearFeatures();
this.features=null;
},parseData:function(_781){
var doc=_781.responseXML;
if(!doc||_781.fileType!="XML"){
doc=OpenLayers.parseXMLString(_781.responseText);
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
var _784=new OpenLayers.Format.GeoRSS();
var _785=_784.read(doc);
for(var i=0;i<_785.length;i++){
var data={};
var _788=_785[i];
var _789=_788.attributes.title?_788.attributes.title:"Untitled";
var _78a=_788.attributes.description?_788.attributes.description:"No description.";
var link=_788.attributes.link?_788.attributes.link:"";
var _78c=_788.geometry.getBounds().getCenterLonLat();
data.icon=this.icon==null?OpenLayers.Marker.defaultIcon():this.icon.clone();
data.popupSize=this.popupSize?this.popupSize.clone():new OpenLayers.Size(250,120);
if(_789||_78a){
var _78d="<div class=\"olLayerGeoRSSClose\">[x]</div>";
_78d+="<div class=\"olLayerGeoRSSTitle\">";
if(link){
_78d+="<a class=\"link\" href=\""+link+"\" target=\"_blank\">";
}
_78d+=_789;
if(link){
_78d+="</a>";
}
_78d+="</div>";
_78d+="<div style=\"\" class=\"olLayerGeoRSSDescription\">";
_78d+=_78a;
_78d+="</div>";
data["popupContentHTML"]=_78d;
}
var _788=new OpenLayers.Feature(this,_78c,data);
this.features.push(_788);
var _78e=_788.createMarker();
_78e.events.register("click",_788,this.markerClick);
this.addMarker(_78e);
}
this.events.triggerEvent("loadend");
},markerClick:function(evt){
var _790=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!_790)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!_790){
var _792=this.createPopup();
OpenLayers.Event.observe(_792.div,"click",OpenLayers.Function.bind(function(){
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
},this));
this.layer.map.addPopup(_792);
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _794=this.features[0];
OpenLayers.Util.removeItem(this.features,_794);
_794.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.GeoRSS"});
OpenLayers.Layer.Google=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:19,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125,0.00002145767211914062,0.00001072883605957031,0.00000536441802978515,0.00000268220901489257],type:null,sphericalMercator:false,initialize:function(name,_796){
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
var _797=this.div.lastChild;
this.div.removeChild(_797);
this.pane.appendChild(_797);
_797.className="olLayerGooglePoweredBy gmnoprint";
_797.style.left="";
_797.style.bottom="";
var _798=this.div.lastChild;
this.div.removeChild(_798);
this.pane.appendChild(_798);
_798.className="olLayerGoogleCopyright";
_798.style.right="";
_798.style.bottom="";
if(!this.mapObject.G||!this.mapObject.G.qb||(typeof this.mapObject.G.qb!="function")){
this.dragPanMapObject=null;
}
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
if(OpenLayers.Util.indexOf(this.mapObject.getMapTypes(),this.type)==-1){
this.mapObject.addMapType(this.type);
}
this.mapObject.setMapType(this.type);
this.map.events.unregister("moveend",this,this.setMapType);
}
},onMapResize:function(){
this.mapObject.checkResize();
},getOLBoundsFromMapObjectBounds:function(_79a){
var _79b=null;
if(_79a!=null){
var sw=_79a.getSouthWest();
var ne=_79a.getNorthEast();
if(this.sphericalMercator){
sw=this.forwardMercator(sw.lng(),sw.lat());
ne=this.forwardMercator(ne.lng(),ne.lat());
}else{
sw=new OpenLayers.LonLat(sw.lng(),sw.lat());
ne=new OpenLayers.LonLat(ne.lng(),ne.lat());
}
_79b=new OpenLayers.Bounds(sw.lon,sw.lat,ne.lon,ne.lat);
}
return _79b;
},getMapObjectBoundsFromOLBounds:function(_79e){
var _79f=null;
if(_79e!=null){
var sw=this.sphericalMercator?this.inverseMercator(_79e.bottom,_79e.left):new OpenLayers.LonLat(_79e.bottom,_79e.left);
var ne=this.sphericalMercator?this.inverseMercator(_79e.top,_79e.right):new OpenLayers.LonLat(_79e.top,_79e.right);
_79f=new GLatLngBounds(new GLatLng(sw.lat,sw.lon),new GLatLng(ne.lat,ne.lon));
}
return _79f;
},addContainerPxFunction:function(){
if((typeof GMap2!="undefined")&&!GMap2.prototype.fromLatLngToContainerPixel){
GMap2.prototype.fromLatLngToContainerPixel=function(_7a2){
var _7a3=this.fromLatLngToDivPixel(_7a2);
var div=this.getContainer().firstChild.firstChild;
_7a3.x+=div.offsetLeft;
_7a3.y+=div.offsetTop;
return _7a3;
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
},setMapObjectCenter:function(_7a6,zoom){
this.mapObject.setCenter(_7a6,zoom);
},dragPanMapObject:function(dX,dY){
var newX=this.mapObject.G.left-dX;
var newY=this.mapObject.G.top+dY;
this.mapObject.G.qb(newX,newY);
},getMapObjectCenter:function(){
return this.mapObject.getCenter();
},getMapObjectZoom:function(){
return this.mapObject.getZoom();
},getMapObjectLonLatFromMapObjectPixel:function(_7ac){
return this.mapObject.fromContainerPixelToLatLng(_7ac);
},getMapObjectPixelFromMapObjectLonLat:function(_7ad){
return this.mapObject.fromLatLngToContainerPixel(_7ad);
},getMapObjectZoomFromMapObjectBounds:function(_7ae){
return this.mapObject.getBoundsZoomLevel(_7ae);
},getLongitudeFromMapObjectLonLat:function(_7af){
return this.sphericalMercator?this.forwardMercator(_7af.lng(),_7af.lat()).lon:_7af.lng();
},getLatitudeFromMapObjectLonLat:function(_7b0){
var lat=this.sphericalMercator?this.forwardMercator(_7b0.lng(),_7b0.lat()).lat:_7b0.lat();
return lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _7b4;
if(this.sphericalMercator){
var _7b5=this.inverseMercator(lon,lat);
_7b4=new GLatLng(_7b5.lat,_7b5.lon);
}else{
_7b4=new GLatLng(lat,lon);
}
return _7b4;
},getXFromMapObjectPixel:function(_7b6){
return _7b6.x;
},getYFromMapObjectPixel:function(_7b7){
return _7b7.y;
},getMapObjectPixelFromXY:function(x,y){
return new GPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.Google"});
OpenLayers.Layer.Grid=OpenLayers.Class(OpenLayers.Layer.HTTPRequest,{tileSize:null,grid:null,singleTile:false,ratio:1.5,buffer:2,numLoadingTiles:0,initialize:function(name,url,_7bc,_7bd){
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
},moveTo:function(_7c3,_7c4,_7c5){
OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
_7c3=_7c3||this.map.getExtent();
if(_7c3!=null){
var _7c6=!this.grid.length||_7c4;
var _7c7=this.getTilesBounds();
if(this.singleTile){
if(_7c6||(!_7c5&&!_7c7.containsBounds(_7c3))){
this.initSingleTile(_7c3);
}
}else{
if(_7c6||!_7c7.containsBounds(_7c3,true)){
this.initGriddedTiles(_7c3);
}else{
this.moveGriddedTiles(_7c3);
}
}
}
},setTileSize:function(size){
if(this.singleTile){
size=this.map.getSize().clone();
size.h=parseInt(size.h*this.ratio);
size.w=parseInt(size.w*this.ratio);
}
OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this,[size]);
},getGridBounds:function(){
var msg="The getGridBounds() function is deprecated. It will be "+"removed in 3.0. Please use getTilesBounds() instead.";
OpenLayers.Console.warn(msg);
return this.getTilesBounds();
},getTilesBounds:function(){
var _7ca=null;
if(this.grid.length){
var _7cb=this.grid.length-1;
var _7cc=this.grid[_7cb][0];
var _7cd=this.grid[0].length-1;
var _7ce=this.grid[0][_7cd];
_7ca=new OpenLayers.Bounds(_7cc.bounds.left,_7cc.bounds.bottom,_7ce.bounds.right,_7ce.bounds.top);
}
return _7ca;
},initSingleTile:function(_7cf){
var _7d0=_7cf.getCenterLonLat();
var _7d1=_7cf.getWidth()*this.ratio;
var _7d2=_7cf.getHeight()*this.ratio;
var _7d3=new OpenLayers.Bounds(_7d0.lon-(_7d1/2),_7d0.lat-(_7d2/2),_7d0.lon+(_7d1/2),_7d0.lat+(_7d2/2));
var ul=new OpenLayers.LonLat(_7d3.left,_7d3.top);
var px=this.map.getLayerPxFromLonLat(ul);
if(!this.grid.length){
this.grid[0]=[];
}
var tile=this.grid[0][0];
if(!tile){
tile=this.addTile(_7d3,px);
this.addTileMonitoringHooks(tile);
tile.draw();
this.grid[0][0]=tile;
}else{
tile.moveTo(_7d3,px);
}
this.removeExcessTiles(1,1);
},initGriddedTiles:function(_7d7){
var _7d8=this.map.getSize();
var _7d9=Math.ceil(_7d8.h/this.tileSize.h)+Math.max(1,2*this.buffer);
var _7da=Math.ceil(_7d8.w/this.tileSize.w)+Math.max(1,2*this.buffer);
var _7db=this.map.getMaxExtent();
var _7dc=this.map.getResolution();
var _7dd=_7dc*this.tileSize.w;
var _7de=_7dc*this.tileSize.h;
var _7df=_7d7.left-_7db.left;
var _7e0=Math.floor(_7df/_7dd)-this.buffer;
var _7e1=_7df/_7dd-_7e0;
var _7e2=-_7e1*this.tileSize.w;
var _7e3=_7db.left+_7e0*_7dd;
var _7e4=_7d7.top-(_7db.bottom+_7de);
var _7e5=Math.ceil(_7e4/_7de)+this.buffer;
var _7e6=_7e5-_7e4/_7de;
var _7e7=-_7e6*this.tileSize.h;
var _7e8=_7db.bottom+_7e5*_7de;
_7e2=Math.round(_7e2);
_7e7=Math.round(_7e7);
this.origin=new OpenLayers.Pixel(_7e2,_7e7);
var _7e9=_7e2;
var _7ea=_7e3;
var _7eb=0;
var _7ec=parseInt(this.map.layerContainerDiv.style.left);
var _7ed=parseInt(this.map.layerContainerDiv.style.top);
do{
var row=this.grid[_7eb++];
if(!row){
row=[];
this.grid.push(row);
}
_7e3=_7ea;
_7e2=_7e9;
var _7ef=0;
do{
var _7f0=new OpenLayers.Bounds(_7e3,_7e8,_7e3+_7dd,_7e8+_7de);
var x=_7e2;
x-=_7ec;
var y=_7e7;
y-=_7ed;
var px=new OpenLayers.Pixel(x,y);
var tile=row[_7ef++];
if(!tile){
tile=this.addTile(_7f0,px);
this.addTileMonitoringHooks(tile);
row.push(tile);
}else{
tile.moveTo(_7f0,px,false);
}
_7e3+=_7dd;
_7e2+=this.tileSize.w;
}while((_7e3<=_7d7.right+_7dd*this.buffer)||_7ef<_7da);
_7e8-=_7de;
_7e7+=this.tileSize.h;
}while((_7e8>=_7d7.bottom-_7de*this.buffer)||_7eb<_7d9);
this.removeExcessTiles(_7eb,_7ef);
this.spiralTileLoad();
},spiralTileLoad:function(){
var _7f5=[];
var _7f6=["right","down","left","up"];
var iRow=0;
var _7f8=-1;
var _7f9=OpenLayers.Util.indexOf(_7f6,"right");
var _7fa=0;
while(_7fa<_7f6.length){
var _7fb=iRow;
var _7fc=_7f8;
switch(_7f6[_7f9]){
case "right":
_7fc++;
break;
case "down":
_7fb++;
break;
case "left":
_7fc--;
break;
case "up":
_7fb--;
break;
}
var tile=null;
if((_7fb<this.grid.length)&&(_7fb>=0)&&(_7fc<this.grid[0].length)&&(_7fc>=0)){
tile=this.grid[_7fb][_7fc];
}
if((tile!=null)&&(!tile.queued)){
_7f5.unshift(tile);
tile.queued=true;
_7fa=0;
iRow=_7fb;
_7f8=_7fc;
}else{
_7f9=(_7f9+1)%4;
_7fa++;
}
}
for(var i=0;i<_7f5.length;i++){
var tile=_7f5[i];
tile.draw();
tile.queued=false;
}
},addTile:function(_7ff,_800){
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
},moveGriddedTiles:function(_803){
var _804=this.buffer||1;
while(true){
var _805=this.grid[0][0].position;
var _806=this.map.getViewPortPxFromLayerPx(_805);
if(_806.x>-this.tileSize.w*(_804-1)){
this.shiftColumn(true);
}else{
if(_806.x<-this.tileSize.w*_804){
this.shiftColumn(false);
}else{
if(_806.y>-this.tileSize.h*(_804-1)){
this.shiftRow(true);
}else{
if(_806.y<-this.tileSize.h*_804){
this.shiftRow(false);
}else{
break;
}
}
}
}
}
},shiftRow:function(_807){
var _808=(_807)?0:(this.grid.length-1);
var grid=this.grid;
var _80a=grid[_808];
var _80b=this.map.getResolution();
var _80c=(_807)?-this.tileSize.h:this.tileSize.h;
var _80d=_80b*-_80c;
var row=(_807)?grid.pop():grid.shift();
for(var i=0;i<_80a.length;i++){
var _810=_80a[i];
var _811=_810.bounds.clone();
var _812=_810.position.clone();
_811.bottom=_811.bottom+_80d;
_811.top=_811.top+_80d;
_812.y=_812.y+_80c;
row[i].moveTo(_811,_812);
}
if(_807){
grid.unshift(row);
}else{
grid.push(row);
}
},shiftColumn:function(_813){
var _814=(_813)?-this.tileSize.w:this.tileSize.w;
var _815=this.map.getResolution();
var _816=_815*_814;
for(var i=0;i<this.grid.length;i++){
var row=this.grid[i];
var _819=(_813)?0:(row.length-1);
var _81a=row[_819];
var _81b=_81a.bounds.clone();
var _81c=_81a.position.clone();
_81b.left=_81b.left+_816;
_81b.right=_81b.right+_816;
_81c.x=_81c.x+_814;
var tile=_813?this.grid[i].pop():this.grid[i].shift();
tile.moveTo(_81b,_81c);
if(_813){
row.unshift(tile);
}else{
row.push(tile);
}
}
},removeExcessTiles:function(rows,_81f){
while(this.grid.length>rows){
var row=this.grid.pop();
for(var i=0,l=row.length;i<l;i++){
var tile=row[i];
this.removeTileMonitoringHooks(tile);
tile.destroy();
}
}
while(this.grid[0].length>_81f){
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
},getTileBounds:function(_823){
var _824=this.map.getMaxExtent();
var _825=this.getResolution();
var _826=_825*this.tileSize.w;
var _827=_825*this.tileSize.h;
var _828=this.getLonLatFromViewPortPx(_823);
var _829=_824.left+(_826*Math.floor((_828.lon-_824.left)/_826));
var _82a=_824.bottom+(_827*Math.floor((_828.lat-_824.bottom)/_827));
return new OpenLayers.Bounds(_829,_82a,_829+_826,_82a+_827);
},CLASS_NAME:"OpenLayers.Layer.Grid"});
OpenLayers.Layer.MultiMap=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[9,1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_82c){
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
},setMapObjectCenter:function(_82e,zoom){
this.mapObject.goToPosition(_82e,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCurrentPosition();
},getMapObjectZoom:function(){
return this.mapObject.getZoomFactor();
},getMapObjectLonLatFromMapObjectPixel:function(_830){
_830.x=_830.x-(this.map.getSize().w/2);
_830.y=_830.y-(this.map.getSize().h/2);
return this.mapObject.getMapPositionAt(_830);
},getMapObjectPixelFromMapObjectLonLat:function(_831){
return this.mapObject.geoPosToContainerPixels(_831);
},getLongitudeFromMapObjectLonLat:function(_832){
return this.sphericalMercator?this.forwardMercator(_832.lon,_832.lat).lon:_832.lon;
},getLatitudeFromMapObjectLonLat:function(_833){
return this.sphericalMercator?this.forwardMercator(_833.lon,_833.lat).lat:_833.lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _836;
if(this.sphericalMercator){
var _837=this.inverseMercator(lon,lat);
_836=new MMLatLon(_837.lat,_837.lon);
}else{
_836=new MMLatLon(lat,lon);
}
return _836;
},getXFromMapObjectPixel:function(_838){
return _838.x;
},getYFromMapObjectPixel:function(_839){
return _839.y;
},getMapObjectPixelFromXY:function(x,y){
return new MMPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.MultiMap"});
OpenLayers.Layer.Text=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,initialize:function(name,_83d){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
this.features=new Array();
if(this.location!=null){
var _83e=function(e){
this.events.triggerEvent("loadend");
};
this.events.triggerEvent("loadstart");
OpenLayers.loadURL(this.location,null,this,this.parseData,_83e);
}
},destroy:function(){
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
this.clearFeatures();
this.features=null;
},parseData:function(_840){
var text=_840.responseText;
var _842=new OpenLayers.Format.Text();
features=_842.read(text);
for(var i=0;i<features.length;i++){
var data={};
var _845=features[i];
var _846;
var _847,iconOffset;
_846=new OpenLayers.LonLat(_845.geometry.x,_845.geometry.y);
if(_845.style.graphicWidth&&_845.style.graphicHeight){
_847=new OpenLayers.Size(_845.style.graphicWidth,_845.style.graphicHeight);
}
if(_845.style.graphicXOffset&&_845.style.graphicYOffset){
iconOffset=new OpenLayers.Size(_845.style.graphicXOffset,_845.style.graphicYOffset);
}
if(_845.style.externalGraphic!=null){
data.icon=new OpenLayers.Icon(_845.style.externalGraphic,_847,iconOffset);
}else{
data.icon=OpenLayers.Marker.defaultIcon();
if(_847!=null){
data.icon.setSize(_847);
}
}
if((_845.attributes.title!=null)&&(_845.attributes.description!=null)){
data["popupContentHTML"]="<h2>"+_845.attributes.title+"</h2>"+"<p>"+_845.attributes.description+"</p>";
}
data["overflow"]=_845.attributes.overflow||"auto";
var _848=new OpenLayers.Feature(this,_846,data);
this.features.push(_848);
var _849=_848.createMarker();
if((_845.attributes.title!=null)&&(_845.attributes.description!=null)){
_849.events.register("click",_848,this.markerClick);
}
this.addMarker(_849);
}
this.events.triggerEvent("loadend");
},markerClick:function(evt){
var _84b=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!_84b)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!_84b){
this.layer.map.addPopup(this.createPopup());
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _84d=this.features[0];
OpenLayers.Util.removeItem(this.features,_84d);
_84d.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.Text"});
OpenLayers.Layer.Vector=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:false,isFixed:false,isVector:true,features:null,selectedFeatures:null,reportError:true,style:null,renderers:["SVG","VML"],renderer:null,geometryType:null,drawn:false,initialize:function(name,_84f){
var _850=OpenLayers.Feature.Vector.style["default"];
this.style=OpenLayers.Util.extend({},_850);
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
var _852=OpenLayers.Renderer[this.renderers[i]];
if(_852&&_852.prototype.supported()){
this.renderer=new _852(this.div);
break;
}
}
},displayError:function(){
if(this.reportError){
var _853="Your browser does not support vector rendering. "+"Currently supported renderers are:\n";
_853+=this.renderers.join("\n");
alert(_853);
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
},moveTo:function(_855,_856,_857){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(!_857){
this.div.style.left=-parseInt(this.map.layerContainerDiv.style.left)+"px";
this.div.style.top=-parseInt(this.map.layerContainerDiv.style.top)+"px";
var _858=this.map.getExtent();
this.renderer.setExtent(_858);
}
if(!this.drawn||_856){
this.drawn=true;
for(var i=0;i<this.features.length;i++){
var _85a=this.features[i];
this.drawFeature(_85a);
}
}
},addFeatures:function(_85b,_85c){
if(!(_85b instanceof Array)){
_85b=[_85b];
}
var _85d=!_85c||!_85c.silent;
for(var i=0;i<_85b.length;i++){
var _85f=_85b[i];
if(this.geometryType&&!(_85f.geometry instanceof this.geometryType)){
var _860="addFeatures : component should be an "+this.geometryType.prototype.CLASS_NAME;
throw _860;
}
this.features.push(_85f);
_85f.layer=this;
if(!_85f.style){
_85f.style=OpenLayers.Util.extend({},this.style);
}
if(_85d){
this.preFeatureInsert(_85f);
}
if(this.drawn){
this.drawFeature(_85f);
}
if(_85d){
this.onFeatureInsert(_85f);
}
}
},removeFeatures:function(_861){
if(!(_861 instanceof Array)){
_861=[_861];
}
for(var i=_861.length-1;i>=0;i--){
var _863=_861[i];
this.features=OpenLayers.Util.removeItem(this.features,_863);
if(_863.geometry){
this.renderer.eraseGeometry(_863.geometry);
}
if(OpenLayers.Util.indexOf(this.selectedFeatures,_863)!=-1){
OpenLayers.Util.removeItem(this.selectedFeatures,_863);
}
}
},destroyFeatures:function(_864){
var all=(_864==undefined);
if(all){
_864=this.features;
this.selectedFeatures=[];
}
this.eraseFeatures(_864);
var _866;
for(var i=_864.length-1;i>=0;i--){
_866=_864[i];
if(!all){
OpenLayers.Util.removeItem(this.selectedFeatures,_866);
}
_866.destroy();
}
},drawFeature:function(_868,_869){
if(_869==null){
if(_868.style){
_869=_868.style;
}else{
_869=this.style;
}
}
if(_869&&_869.CLASS_NAME&&_869.CLASS_NAME=="OpenLayers.Style"){
_869=_869.createStyle(_868);
}
this.renderer.drawFeature(_868,_869);
},eraseFeatures:function(_86a){
this.renderer.eraseFeatures(_86a);
},getFeatureFromEvent:function(evt){
if(!this.renderer){
OpenLayers.Console.error("getFeatureFromEvent called on layer with no renderer. This usually means you destroyed a layer, but not some handler which is associated with it.");
return null;
}
var _86c=this.renderer.getFeatureIdFromEvent(evt);
return this.getFeatureById(_86c);
},getFeatureById:function(_86d){
var _86e=null;
for(var i=0;i<this.features.length;++i){
if(this.features[i].id==_86d){
_86e=this.features[i];
break;
}
}
return _86e;
},onFeatureInsert:function(_870){
},preFeatureInsert:function(_871){
},CLASS_NAME:"OpenLayers.Layer.Vector"});
OpenLayers.Layer.VirtualEarth=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,sphericalMercator:false,initialize:function(name,_873){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
if(this.sphericalMercator){
OpenLayers.Util.extend(this,OpenLayers.Layer.SphericalMercator);
this.initMercatorParameters();
}
},loadMapObject:function(){
var _874=OpenLayers.Util.createDiv(this.name);
var sz=this.map.getSize();
_874.style.width=sz.w;
_874.style.height=sz.h;
this.div.appendChild(_874);
try{
this.mapObject=new VEMap(this.name);
}
catch(e){
}
if(this.mapObject!=null){
try{
this.mapObject.LoadMap(null,null,this.type,true);
this.mapObject.AttachEvent("onmousedown",function(){
return true;
});
}
catch(e){
}
this.mapObject.HideDashboard();
}
if(!this.mapObject||!this.mapObject.vemapcontrol||!this.mapObject.vemapcontrol.PanMap||(typeof this.mapObject.vemapcontrol.PanMap!="function")){
this.dragPanMapObject=null;
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
},setMapObjectCenter:function(_877,zoom){
this.mapObject.SetCenterAndZoom(_877,zoom);
},getMapObjectCenter:function(){
return this.mapObject.GetCenter();
},dragPanMapObject:function(dX,dY){
this.mapObject.vemapcontrol.PanMap(dX,-dY);
},getMapObjectZoom:function(){
return this.mapObject.GetZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_87b){
return this.mapObject.PixelToLatLong(_87b.x,_87b.y);
},getMapObjectPixelFromMapObjectLonLat:function(_87c){
return this.mapObject.LatLongToPixel(_87c);
},getLongitudeFromMapObjectLonLat:function(_87d){
return this.sphericalMercator?this.forwardMercator(_87d.Longitude,_87d.Latitude).lon:_87d.Longitude;
},getLatitudeFromMapObjectLonLat:function(_87e){
return this.sphericalMercator?this.forwardMercator(_87e.Longitude,_87e.Latitude).lat:_87e.Latitude;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _881;
if(this.sphericalMercator){
var _882=this.inverseMercator(lon,lat);
_881=new VELatLong(_882.lat,_882.lon);
}else{
_881=new VELatLong(lat,lon);
}
return _881;
},getXFromMapObjectPixel:function(_883){
return _883.x;
},getYFromMapObjectPixel:function(_884){
return _884.y;
},getMapObjectPixelFromXY:function(x,y){
return new Msn.VE.Pixel(x,y);
},CLASS_NAME:"OpenLayers.Layer.VirtualEarth"});
OpenLayers.Layer.Yahoo=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:15,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,sphericalMercator:false,initialize:function(name,_888){
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
if(!this.mapObject.moveByXY||(typeof this.mapObject.moveByXY!="function")){
this.dragPanMapObject=null;
}
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
var _88c=OpenLayers.Util.getElement("ygddfdiv");
if(_88c!=null){
if(_88c.parentNode!=null){
_88c.parentNode.removeChild(_88c);
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
},getOLZoomFromMapObjectZoom:function(_88e){
var zoom=null;
if(_88e!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getOLZoomFromMapObjectZoom.apply(this,[_88e]);
zoom=18-zoom;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_890){
var zoom=null;
if(_890!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getMapObjectZoomFromOLZoom.apply(this,[_890]);
zoom=18-zoom;
}
return zoom;
},setMapObjectCenter:function(_892,zoom){
this.mapObject.drawZoomAndCenter(_892,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenterLatLon();
},dragPanMapObject:function(dX,dY){
this.mapObject.moveByXY({"x":-dX,"y":dY});
},getMapObjectZoom:function(){
return this.mapObject.getZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_896){
return this.mapObject.convertXYLatLon(_896);
},getMapObjectPixelFromMapObjectLonLat:function(_897){
return this.mapObject.convertLatLonXY(_897);
},getLongitudeFromMapObjectLonLat:function(_898){
return this.sphericalMercator?this.forwardMercator(_898.Lon,_898.Lat).lon:_898.Lon;
},getLatitudeFromMapObjectLonLat:function(_899){
return this.sphericalMercator?this.forwardMercator(_899.Lon,_899.Lat).lat:_899.Lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
var _89c;
if(this.sphericalMercator){
var _89d=this.inverseMercator(lon,lat);
_89c=new YGeoPoint(_89d.lat,_89d.lon);
}else{
_89c=new YGeoPoint(lat,lon);
}
return _89c;
},getXFromMapObjectPixel:function(_89e){
return _89e.x;
},getYFromMapObjectPixel:function(_89f){
return _89f.y;
},getMapObjectPixelFromXY:function(x,y){
return new YCoordPoint(x,y);
},getMapObjectSizeFromOLSize:function(_8a2){
return new YSize(_8a2.w,_8a2.h);
},CLASS_NAME:"OpenLayers.Layer.Yahoo"});
OpenLayers.Style=OpenLayers.Class({name:null,layerName:null,isDefault:false,rules:null,defaultStyle:null,propertyStyles:null,initialize:function(_8a3,_8a4){
this.rules=[];
this.setDefaultStyle(_8a3||OpenLayers.Feature.Vector.style["default"]);
OpenLayers.Util.extend(this,_8a4);
},destroy:function(){
for(var i=0;i<this.rules.length;i++){
this.rules[i].destroy();
this.rules[i]=null;
}
this.rules=null;
this.defaultStyle=null;
},createStyle:function(_8a6,_8a7){
if(!_8a7){
_8a7=this.defaultStyle;
}
var _8a8=OpenLayers.Util.extend({},_8a7);
var draw=true;
for(var i=0;i<this.rules.length;i++){
var _8ab=this.rules[i].evaluate(_8a6);
if(_8ab){
var _8ac=_8a6.layer.map.getScale();
if(this.rules[i].minScale){
draw=_8ac>OpenLayers.Style.createLiteral(this.rules[i].minScale,_8a6);
}
if(draw&&this.rules[i].maxScale){
draw=_8ac<OpenLayers.Style.createLiteral(this.rules[i].maxScale,_8a6);
}
var _8ad=_8a6.geometry?this.getSymbolizerPrefix(_8a6.geometry):OpenLayers.Style.SYMBOLIZER_PREFIXES[0];
var _8ae=this.rules[i].symbolizer[_8ad];
OpenLayers.Util.extend(_8a8,_8ae);
}
}
_8a8.display=draw?"":"none";
for(var i in this.propertyStyles){
_8a8[i]=OpenLayers.Style.createLiteral(_8a8[i],_8a6);
}
return _8a8;
},findPropertyStyles:function(){
var _8af={};
var _8b0=this.defaultStyle;
for(var i in _8b0){
if(typeof _8b0[i]=="string"&&_8b0[i].match(/\$\{\w+\}/)){
_8af[i]=true;
}
}
var _8b2=this.rules;
var _8b3=OpenLayers.Style.SYMBOLIZER_PREFIXES;
for(var i in _8b2){
for(var s=0;s<_8b3.length;s++){
_8b0=_8b2[i].symbolizer[_8b3[s]];
for(var j in _8b0){
if(typeof _8b0[j]=="string"&&_8b0[j].match(/\$\{\w+\}/)){
_8af[j]=true;
}
}
}
}
return _8af;
},addRules:function(_8b6){
this.rules=this.rules.concat(_8b6);
this.propertyStyles=this.findPropertyStyles();
},setDefaultStyle:function(_8b7){
this.defaultStyle=_8b7;
this.propertyStyles=this.findPropertyStyles();
},getSymbolizerPrefix:function(_8b8){
var _8b9=OpenLayers.Style.SYMBOLIZER_PREFIXES;
for(var i=0;i<_8b9.length;i++){
if(_8b8.CLASS_NAME.indexOf(_8b9[i])!=-1){
return _8b9[i];
}
}
},CLASS_NAME:"OpenLayers.Style"});
OpenLayers.Style.createLiteral=function(_8bb,_8bc){
if(typeof _8bb=="string"&&_8bb.indexOf("${")!=-1){
var _8bd=_8bc.attributes||_8bc.data;
_8bb=OpenLayers.String.format(_8bb,_8bd);
_8bb=isNaN(_8bb)?_8bb:parseFloat(_8bb);
}
return _8bb;
};
OpenLayers.Style.SYMBOLIZER_PREFIXES=["Point","Line","Polygon"];
OpenLayers.Control.ModifyFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,clickout:true,toggle:true,layer:null,feature:null,vertices:null,virtualVertices:null,selectControl:null,dragControl:null,keyboardHandler:null,deleteCodes:null,virtualStyle:null,mode:null,radiusHandle:null,dragHandle:null,onModificationStart:function(){
},onModification:function(){
},onModificationEnd:function(){
},initialize:function(_8be,_8bf){
this.layer=_8be;
this.vertices=[];
this.virtualVertices=[];
this.styleVirtual=OpenLayers.Util.extend({},this.layer.style);
this.styleVirtual.fillOpacity=0.3;
this.styleVirtual.strokeOpacity=0.3;
this.deleteCodes=[46,100];
this.mode=OpenLayers.Control.ModifyFeature.RESHAPE;
OpenLayers.Control.prototype.initialize.apply(this,[_8bf]);
if(!(this.deleteCodes instanceof Array)){
this.deleteCodes=[this.deleteCodes];
}
var _8c0=this;
var _8c1={geometryTypes:this.geometryTypes,clickout:this.clickout,toggle:this.toggle,onSelect:function(_8c2){
_8c0.selectFeature.apply(_8c0,[_8c2]);
},onUnselect:function(_8c3){
_8c0.unselectFeature.apply(_8c0,[_8c3]);
}};
this.selectControl=new OpenLayers.Control.SelectFeature(_8be,_8c1);
var _8c4={geometryTypes:["OpenLayers.Geometry.Point"],snappingOptions:this.snappingOptions,onStart:function(_8c5,_8c6){
_8c0.dragStart.apply(_8c0,[_8c5,_8c6]);
},onDrag:function(_8c7){
_8c0.dragVertex.apply(_8c0,[_8c7]);
},onComplete:function(_8c8){
_8c0.dragComplete.apply(_8c0,[_8c8]);
}};
this.dragControl=new OpenLayers.Control.DragFeature(_8be,_8c4);
var _8c9={keypress:this.handleKeypress};
this.keyboardHandler=new OpenLayers.Handler.Keyboard(this,_8c9);
},destroy:function(){
this.layer=null;
this.selectControl.destroy();
this.dragControl.destroy();
this.keyboardHandler.destroy();
OpenLayers.Control.prototype.destroy.apply(this,[]);
},activate:function(){
return (this.selectControl.activate()&&this.keyboardHandler.activate()&&OpenLayers.Control.prototype.activate.apply(this,arguments));
},deactivate:function(){
var _8ca=false;
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
_8ca=true;
}
return _8ca;
},selectFeature:function(_8cb){
this.feature=_8cb;
this.resetVertices();
this.dragControl.activate();
this.onModificationStart(this.feature);
},unselectFeature:function(_8cc){
this.layer.removeFeatures(this.vertices);
this.vertices=[];
this.layer.destroyFeatures(this.virtualVertices);
this.virtualVertices=[];
if(this.dragHandle){
this.layer.destroyFeatures([this.dragHandle]);
delete this.dragHandle;
}
if(this.radiusHandle){
this.layer.destroyFeatures([this.radiusHandle]);
delete this.radiusHandle;
}
this.feature=null;
this.dragControl.deactivate();
this.onModificationEnd(_8cc);
},dragStart:function(_8cd,_8ce){
if(_8cd!=this.feature&&!_8cd.geometry.parent&&_8cd!=this.dragHandle&&_8cd!=this.radiusHandle){
if(this.feature){
this.selectControl.clickFeature.apply(this.selectControl,[this.feature]);
}
if(this.geometryTypes==null||OpenLayers.Util.indexOf(this.geometryTypes,_8cd.geometry.CLASS_NAME)!=-1){
this.selectControl.clickFeature.apply(this.selectControl,[_8cd]);
this.dragControl.overFeature.apply(this.dragControl,[_8cd]);
this.dragControl.lastPixel=_8ce;
this.dragControl.dragHandler.started=true;
this.dragControl.dragHandler.start=_8ce;
this.dragControl.dragHandler.last=_8ce;
}
}
},dragVertex:function(_8cf){
if(this.feature.geometry.CLASS_NAME=="OpenLayers.Geometry.Point"){
if(this.feature!=_8cf){
this.feature=_8cf;
}
}else{
if(_8cf._index){
_8cf.geometry.parent.addComponent(_8cf.geometry,_8cf._index);
delete _8cf._index;
OpenLayers.Util.removeItem(this.virtualVertices,_8cf);
this.vertices.push(_8cf);
}else{
if(_8cf==this.dragHandle){
this.layer.removeFeatures(this.vertices);
this.vertices=[];
if(this.radiusHandle){
this.layer.destroyFeatures([this.radiusHandle]);
this.radiusHandle=null;
}
}
}
if(this.virtualVertices.length>0){
this.layer.destroyFeatures(this.virtualVertices);
this.virtualVertices=[];
}
this.layer.drawFeature(this.feature,this.selectControl.selectStyle);
}
this.layer.drawFeature(_8cf);
},dragComplete:function(_8d0){
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
if(this.dragHandle){
this.layer.destroyFeatures([this.dragHandle]);
this.dragHandle=null;
}
if(this.radiusHandle){
this.layer.destroyFeatures([this.radiusHandle]);
this.radiusHandle=null;
}
if(this.feature&&this.feature.geometry.CLASS_NAME!="OpenLayers.Geometry.Point"){
if((this.mode&OpenLayers.Control.ModifyFeature.DRAG)){
this.collectDragHandle();
}
if((this.mode&(OpenLayers.Control.ModifyFeature.ROTATE|OpenLayers.Control.ModifyFeature.RESIZE))){
this.collectRadiusHandle();
}
if((this.mode&OpenLayers.Control.ModifyFeature.RESHAPE)){
this.collectVertices();
}
}
},handleKeypress:function(code){
if(this.feature&&OpenLayers.Util.indexOf(this.deleteCodes,code)!=-1){
var _8d2=this.dragControl.feature;
if(_8d2&&OpenLayers.Util.indexOf(this.vertices,_8d2)!=-1&&!this.dragControl.dragHandler.dragging&&_8d2.geometry.parent){
_8d2.geometry.parent.removeComponent(_8d2.geometry);
this.layer.drawFeature(this.feature,this.selectControl.selectStyle);
this.resetVertices();
this.onModification(this.feature);
}
}
},collectVertices:function(){
this.vertices=[];
this.virtualVirtices=[];
var _8d3=this;
function collectComponentVertices(_8d4){
var i,vertex,component;
if(_8d4.CLASS_NAME=="OpenLayers.Geometry.Point"){
vertex=new OpenLayers.Feature.Vector(_8d4);
_8d3.vertices.push(vertex);
}else{
var _8d6=_8d4.components.length;
if(_8d4.CLASS_NAME=="OpenLayers.Geometry.LinearRing"){
_8d6-=1;
}
for(i=0;i<_8d6;++i){
component=_8d4.components[i];
if(component.CLASS_NAME=="OpenLayers.Geometry.Point"){
vertex=new OpenLayers.Feature.Vector(component);
_8d3.vertices.push(vertex);
}else{
collectComponentVertices(component);
}
}
if(_8d4.CLASS_NAME!="OpenLayers.Geometry.MultiPoint"){
for(i=0;i<_8d4.components.length-1;++i){
var _8d7=_8d4.components[i];
var _8d8=_8d4.components[i+1];
if(_8d7.CLASS_NAME=="OpenLayers.Geometry.Point"&&_8d8.CLASS_NAME=="OpenLayers.Geometry.Point"){
var x=(_8d7.x+_8d8.x)/2;
var y=(_8d7.y+_8d8.y)/2;
var _8db=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(x,y),null,_8d3.styleVirtual);
_8db.geometry.parent=_8d4;
_8db._index=i+1;
_8d3.virtualVertices.push(_8db);
}
}
}
}
}
collectComponentVertices.call(this,this.feature.geometry);
this.layer.addFeatures(this.vertices,{silent:true});
this.layer.addFeatures(this.virtualVertices,{silent:true});
},collectDragHandle:function(){
var _8dc=this.feature.geometry;
var _8dd=_8dc.getBounds().getCenterLonLat();
var _8de=new OpenLayers.Geometry.Point(_8dd.lon,_8dd.lat);
var _8df=new OpenLayers.Feature.Vector(_8de);
_8de.move=function(x,y){
OpenLayers.Geometry.Point.prototype.move.call(this,x,y);
_8dc.move(x,y);
};
this.dragHandle=_8df;
this.layer.addFeatures([this.dragHandle],{silent:true});
},collectRadiusHandle:function(){
var _8e2=this.feature.geometry;
var _8e3=_8e2.getBounds();
var _8e4=_8e3.getCenterLonLat();
var _8e5=new OpenLayers.Geometry.Point(_8e4.lon,_8e4.lat);
var _8e6=new OpenLayers.Geometry.Point(_8e3.right,_8e3.bottom);
var _8e7=new OpenLayers.Feature.Vector(_8e6);
var _8e8=(this.mode&OpenLayers.Control.ModifyFeature.RESIZE);
var _8e9=(this.mode&OpenLayers.Control.ModifyFeature.ROTATE);
_8e6.move=function(x,y){
OpenLayers.Geometry.Point.prototype.move.call(this,x,y);
var dx1=this.x-_8e5.x;
var dy1=this.y-_8e5.y;
var dx0=dx1-x;
var dy0=dy1-y;
if(_8e9){
var a0=Math.atan2(dy0,dx0);
var a1=Math.atan2(dy1,dx1);
var _8f2=a1-a0;
_8f2*=180/Math.PI;
_8e2.rotate(_8f2,_8e5);
}
if(_8e8){
var l0=Math.sqrt((dx0*dx0)+(dy0*dy0));
var l1=Math.sqrt((dx1*dx1)+(dy1*dy1));
_8e2.resize(l1/l0,_8e5);
}
};
this.radiusHandle=_8e7;
this.layer.addFeatures([this.radiusHandle],{silent:true});
},setMap:function(map){
this.selectControl.setMap(map);
this.dragControl.setMap(map);
OpenLayers.Control.prototype.setMap.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Control.ModifyFeature"});
OpenLayers.Control.ModifyFeature.RESHAPE=1;
OpenLayers.Control.ModifyFeature.RESIZE=2;
OpenLayers.Control.ModifyFeature.ROTATE=4;
OpenLayers.Control.ModifyFeature.DRAG=8;
OpenLayers.Control.Navigation=OpenLayers.Class(OpenLayers.Control,{dragPan:null,zoomBox:null,wheelHandler:null,initialize:function(_8f6){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},activate:function(){
this.dragPan.activate();
this.wheelHandler.activate();
this.clickHandler.activate();
this.zoomBox.activate();
return OpenLayers.Control.prototype.activate.apply(this,arguments);
},deactivate:function(){
this.zoomBox.deactivate();
this.dragPan.deactivate();
this.clickHandler.deactivate();
this.wheelHandler.deactivate();
return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
},draw:function(){
this.clickHandler=new OpenLayers.Handler.Click(this,{"dblclick":this.defaultDblClick},{"double":true,"stopDouble":true});
this.dragPan=new OpenLayers.Control.DragPan({map:this.map});
this.zoomBox=new OpenLayers.Control.ZoomBox({map:this.map,keyMask:OpenLayers.Handler.MOD_SHIFT});
this.dragPan.draw();
this.zoomBox.draw();
this.wheelHandler=new OpenLayers.Handler.MouseWheel(this,{"up":this.wheelUp,"down":this.wheelDown});
this.activate();
},defaultDblClick:function(evt){
var _8f8=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_8f8,this.map.zoom+1);
},wheelChange:function(evt,_8fa){
var _8fb=this.map.getZoom()+_8fa;
if(!this.map.isValidZoomLevel(_8fb)){
return;
}
var size=this.map.getSize();
var _8fd=size.w/2-evt.xy.x;
var _8fe=evt.xy.y-size.h/2;
var _8ff=this.map.baseLayer.resolutions[_8fb];
var _900=this.map.getLonLatFromPixel(evt.xy);
var _901=new OpenLayers.LonLat(_900.lon+_8fd*_8ff,_900.lat+_8fe*_8ff);
this.map.setCenter(_901,_8fb);
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
},setBounds:function(_904){
if(_904){
this.bounds=_904.clone();
}
},clearBounds:function(){
this.bounds=null;
if(this.parent){
this.parent.clearBounds();
}
},extendBounds:function(_905){
var _906=this.getBounds();
if(!_906){
this.setBounds(_905);
}else{
this.bounds.extend(_905);
}
},getBounds:function(){
if(this.bounds==null){
this.calculateBounds();
}
return this.bounds;
},calculateBounds:function(){
},atPoint:function(_907,_908,_909){
var _90a=false;
var _90b=this.getBounds();
if((_90b!=null)&&(_907!=null)){
var dX=(_908!=null)?_908:0;
var dY=(_909!=null)?_909:0;
var _90e=new OpenLayers.Bounds(this.bounds.left-dX,this.bounds.bottom-dY,this.bounds.right+dX,this.bounds.top+dY);
_90a=_90e.containsLonLat(_907);
}
return _90a;
},getLength:function(){
return 0;
},getArea:function(){
return 0;
},toString:function(){
return OpenLayers.Format.WKT.prototype.write(new OpenLayers.Feature.Vector(this));
},CLASS_NAME:"OpenLayers.Geometry"});
OpenLayers.Geometry.segmentsIntersect=function(seg1,seg2,_911){
var _912=false;
var _913=seg1.x1-seg2.x1;
var _914=seg1.y1-seg2.y1;
var _915=seg1.x2-seg1.x1;
var _916=seg1.y2-seg1.y1;
var _917=seg2.y2-seg2.y1;
var _918=seg2.x2-seg2.x1;
var d=(_917*_915)-(_918*_916);
var n1=(_918*_914)-(_917*_913);
var n2=(_915*_914)-(_916*_913);
if(d==0){
if(n1==0&&n2==0){
_912=true;
}
}else{
var _91c=n1/d;
var _91d=n2/d;
if(_91c>=0&&_91c<=1&&_91d>=0&&_91d<=1){
if(!_911){
_912=true;
}else{
var x=seg1.x1+(_91c*_915);
var y=seg1.y1+(_91c*_916);
_912=new OpenLayers.Geometry.Point(x,y);
}
}
}
return _912;
};
OpenLayers.Layer.GML=OpenLayers.Class(OpenLayers.Layer.Vector,{loaded:false,format:null,initialize:function(name,url,_922){
var _923=[];
_923.push(name,_922);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_923);
this.url=url;
},setVisibility:function(_924,_925){
OpenLayers.Layer.Vector.prototype.setVisibility.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},moveTo:function(_926,_927,_928){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.events.triggerEvent("loadstart");
this.loadGML();
}
},loadGML:function(){
if(!this.loaded){
var _929=OpenLayers.loadURL(this.url,null,this,this.requestSuccess,this.requestFailure);
this.loaded=true;
}
},requestSuccess:function(_92a){
var doc=_92a.responseXML;
if(!doc||_92a.fileType!="XML"){
doc=_92a.responseText;
}
var gml=this.format?new this.format():new OpenLayers.Format.GML();
this.addFeatures(gml.read(doc));
this.events.triggerEvent("loadend");
},requestFailure:function(_92d){
alert("Error in loading GML file "+this.url);
this.events.triggerEvent("loadend");
},CLASS_NAME:"OpenLayers.Layer.GML"});
OpenLayers.Layer.KaMap=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:true,units:null,resolution:OpenLayers.DOTS_PER_INCH,DEFAULT_PARAMS:{i:"jpeg",map:""},initialize:function(name,url,_930,_931){
var _932=[];
_932.push(name,url,_930,_931);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_932);
this.params=(_930?_930:{});
if(_930){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},getURL:function(_933){
_933=this.adjustBounds(_933);
var _934=this.map.getResolution();
var _935=Math.round((this.map.getScale()*10000))/10000;
var pX=Math.round(_933.left/_934);
var pY=-Math.round(_933.top/_934);
return this.getFullRequestString({t:pY,l:pX,s:_935});
},addTile:function(_938,_939){
var url=this.getURL(_938);
return new OpenLayers.Tile.Image(this,_939,_938,url,this.tileSize);
},initGriddedTiles:function(_93b){
var _93c=this.map.getSize();
var _93d=Math.ceil(_93c.h/this.tileSize.h)+Math.max(1,2*this.buffer);
var _93e=Math.ceil(_93c.w/this.tileSize.w)+Math.max(1,2*this.buffer);
var _93f=this.map.getMaxExtent();
var _940=this.map.getResolution();
var _941=_940*this.tileSize.w;
var _942=_940*this.tileSize.h;
var _943=_93b.left;
var _944=Math.floor(_943/_941)-this.buffer;
var _945=_943/_941-_944;
var _946=-_945*this.tileSize.w;
var _947=_944*_941;
var _948=_93b.top;
var _949=Math.ceil(_948/_942)+this.buffer;
var _94a=_949-_948/_942;
var _94b=-(_94a+1)*this.tileSize.h;
var _94c=_949*_942;
_946=Math.round(_946);
_94b=Math.round(_94b);
this.origin=new OpenLayers.Pixel(_946,_94b);
var _94d=_946;
var _94e=_947;
var _94f=0;
do{
var row=this.grid[_94f++];
if(!row){
row=[];
this.grid.push(row);
}
_947=_94e;
_946=_94d;
var _951=0;
do{
var _952=new OpenLayers.Bounds(_947,_94c,_947+_941,_94c+_942);
var x=_946;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_94b;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile=row[_951++];
if(!tile){
tile=this.addTile(_952,px);
this.addTileMonitoringHooks(tile);
row.push(tile);
}else{
tile.moveTo(_952,px,false);
}
_947+=_941;
_946+=this.tileSize.w;
}while(_947<=_93b.right+_941*this.buffer||_951<_93e);
_94c-=_942;
_94b+=this.tileSize.h;
}while(_94c>=_93b.bottom-_942*this.buffer||_94f<_93d);
this.removeExcessTiles(_94f,_951);
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
},getTileBounds:function(_958){
var _959=this.getResolution();
var _95a=_959*this.tileSize.w;
var _95b=_959*this.tileSize.h;
var _95c=this.getLonLatFromViewPortPx(_958);
var _95d=_95a*Math.floor(_95c.lon/_95a);
var _95e=_95b*Math.floor(_95c.lat/_95b);
return new OpenLayers.Bounds(_95d,_95e,_95d+_95a,_95e+_95b);
},CLASS_NAME:"OpenLayers.Layer.KaMap"});
OpenLayers.Layer.MapServer=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{mode:"map",map_imagetype:"png"},initialize:function(name,url,_961,_962){
var _963=[];
_963.push(name,url,_961,_962);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_963);
if(arguments.length>0){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
if(_962==null||_962.isBaseLayer==null){
this.isBaseLayer=((this.params.transparent!="true")&&(this.params.transparent!=true));
}
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.MapServer(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},addTile:function(_965,_966){
return new OpenLayers.Tile.Image(this,_966,_965,null,this.tileSize);
},getURL:function(_967){
_967=this.adjustBounds(_967);
var _968=[_967.left,_967.bottom,_967.right,_967.top];
var _969=this.getImageSize();
var url=this.getFullRequestString({mapext:_968,imgext:_968,map_size:[_969.w,_969.h],imgx:_969.w/2,imgy:_969.h/2,imgxy:[_969.w,_969.h]});
return url;
},getFullRequestString:function(_96b,_96c){
var url=(_96c==null)?this.url:_96c;
var _96e=OpenLayers.Util.extend({},this.params);
_96e=OpenLayers.Util.extend(_96e,_96b);
var _96f=OpenLayers.Util.getParameterString(_96e);
if(url instanceof Array){
url=this.selectUrl(_96f,url);
}
var _970=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
for(var key in _96e){
if(key.toUpperCase() in _970){
delete _96e[key];
}
}
_96f=OpenLayers.Util.getParameterString(_96e);
var _972=url;
_96f=_96f.replace(/,/g,"+");
if(_96f!=""){
var _973=url.charAt(url.length-1);
if((_973=="&")||(_973=="?")){
_972+=_96f;
}else{
if(url.indexOf("?")==-1){
_972+="?"+_96f;
}else{
_972+="&"+_96f;
}
}
}
return _972;
},CLASS_NAME:"OpenLayers.Layer.MapServer"});
OpenLayers.Layer.TMS=OpenLayers.Class(OpenLayers.Layer.Grid,{serviceVersion:"1.0.0",isBaseLayer:true,tileOrigin:null,initialize:function(name,url,_976){
var _977=[];
_977.push(name,url,{},_976);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_977);
},destroy:function(){
OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TMS(this.name,this.url,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_979){
_979=this.adjustBounds(_979);
var res=this.map.getResolution();
var x=Math.round((_979.left-this.tileOrigin.lon)/(res*this.tileSize.w));
var y=Math.round((_979.bottom-this.tileOrigin.lat)/(res*this.tileSize.h));
var z=this.map.getZoom();
var path=this.serviceVersion+"/"+this.layername+"/"+z+"/"+x+"/"+y+"."+this.type;
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
return url+path;
},addTile:function(_980,_981){
return new OpenLayers.Tile.Image(this,_981,_980,null,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TMS"});
OpenLayers.Layer.TileCache=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:true,tileOrigin:null,format:"image/png",initialize:function(name,url,_985,_986){
this.layername=_985;
OpenLayers.Layer.Grid.prototype.initialize.apply(this,[name,url,{},_986]);
this.extension=this.format.split("/")[1].toLowerCase();
this.extension=(this.extension=="jpg")?"jpeg":this.extension;
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TileCache(this.name,this.url,this.layername,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_988){
var res=this.map.getResolution();
var bbox=this.maxExtent;
var size=this.tileSize;
var _98c=Math.floor((_988.left-bbox.left)/(res*size.w));
var _98d=Math.floor((_988.bottom-bbox.bottom)/(res*size.h));
var _98e=this.map.zoom;
function zeroPad(_98f,_990){
_98f=String(_98f);
var _991=[];
for(var i=0;i<_990;++i){
_991.push("0");
}
return _991.join("").substring(0,_990-_98f.length)+_98f;
}
var _993=[this.layername,zeroPad(_98e,2),zeroPad(parseInt(_98c/1000000),3),zeroPad((parseInt(_98c/1000)%1000),3),zeroPad((parseInt(_98c)%1000),3),zeroPad(parseInt(_98d/1000000),3),zeroPad((parseInt(_98d/1000)%1000),3),zeroPad((parseInt(_98d)%1000),3)+"."+this.extension];
var path=_993.join("/");
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
url=(url.charAt(url.length-1)=="/")?url:url+"/";
return url+path;
},addTile:function(_996,_997){
var url=this.getURL(_996);
return new OpenLayers.Tile.Image(this,_997,_996,url,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TileCache"});
OpenLayers.Layer.WFS=OpenLayers.Class(OpenLayers.Layer.Vector,OpenLayers.Layer.Markers,{isBaseLayer:false,tile:null,ratio:2,DEFAULT_PARAMS:{service:"WFS",version:"1.0.0",request:"GetFeature"},featureClass:null,vectorMode:true,encodeBBOX:false,extractAttributes:false,format:null,parser:null,initialize:function(name,url,_99c,_99d){
if(_99d==undefined){
_99d={};
}
if(_99d.featureClass||!OpenLayers.Layer.Vector||!OpenLayers.Feature.Vector){
this.vectorMode=false;
}
OpenLayers.Util.extend(_99d,{"reportError":false});
var _99e=[];
_99e.push(name,_99d);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_99e);
if(!this.renderer||!this.vectorMode){
this.vectorMode=false;
if(!_99d.featureClass){
_99d.featureClass=OpenLayers.Feature.WFS;
}
OpenLayers.Layer.Markers.prototype.initialize.apply(this,_99e);
}
if(this.params&&this.params.typename&&!this.options.typename){
this.options.typename=this.params.typename;
}
if(!this.options.geometry_column){
this.options.geometry_column="the_geom";
}
this.params=_99c;
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
},moveTo:function(_9a0,_9a1,_9a2){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.moveTo.apply(this,arguments);
}
if(_9a2){
return false;
}
if(_9a1){
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
if(_9a0==null){
_9a0=this.map.getExtent();
}
var _9a4=(this.tile==null);
var _9a5=(!_9a4&&!this.tile.bounds.containsBounds(_9a0));
if((_9a1||_9a4||(!_9a2&&_9a5))&&this.inRange){
var _9a6=_9a0.getCenterLonLat();
var _9a7=_9a0.getWidth()*this.ratio;
var _9a8=_9a0.getHeight()*this.ratio;
var _9a9=new OpenLayers.Bounds(_9a6.lon-(_9a7/2),_9a6.lat-(_9a8/2),_9a6.lon+(_9a7/2),_9a6.lat+(_9a8/2));
var _9aa=this.map.getSize();
_9aa.w=_9aa.w*this.ratio;
_9aa.h=_9aa.h*this.ratio;
var ul=new OpenLayers.LonLat(_9a9.left,_9a9.top);
var pos=this.map.getLayerPxFromLonLat(ul);
var url=this.getFullRequestString();
var _9ae={BBOX:this.encodeBBOX?_9a9.toBBOX():_9a9.toArray()};
url+="&"+OpenLayers.Util.getParameterString(_9ae);
if(!this.tile){
this.tile=new OpenLayers.Tile.WFS(this,pos,_9a9,url,_9aa);
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
this.tile=new OpenLayers.Tile.WFS(this,pos,_9a9,url,_9aa);
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
},mergeNewParams:function(_9b1){
var _9b2=OpenLayers.Util.upperCaseObject(_9b1);
var _9b3=[_9b2];
OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this,_9b3);
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
},getFullRequestString:function(_9b5,_9b6){
var _9b7=this.map.getProjection();
this.params.SRS=(_9b7=="none")?null:_9b7;
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
var _9ba=OpenLayers.Function.bind(this.commitSuccess,this);
var _9bb=OpenLayers.Function.bind(this.commitFailure,this);
data=OpenLayers.Ajax.serializeXMLToString(data);
new OpenLayers.Ajax.Request(url,{method:"post",postBody:data,onComplete:_9ba,onFailure:_9bb});
},commitSuccess:function(_9bc){
var _9bd=_9bc.responseText;
if(_9bd.indexOf("SUCCESS")!=-1){
this.commitReport("WFS Transaction: SUCCESS",_9bd);
for(var i=0;i<this.features.length;i++){
this.features[i].state=null;
}
}else{
if(_9bd.indexOf("FAILED")!=-1||_9bd.indexOf("Exception")!=-1){
this.commitReport("WFS Transaction: FAILED",_9bd);
}
}
},commitFailure:function(_9bf){
},commitReport:function(_9c0,_9c1){
alert(_9c0);
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
OpenLayers.Layer.WMS=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{service:"WMS",version:"1.1.1",request:"GetMap",styles:"",exceptions:"application/vnd.ogc.se_inimage",format:"image/jpeg"},reproject:false,isBaseLayer:true,encodeBBOX:false,initialize:function(name,url,_9c4,_9c5){
var _9c6=[];
_9c4=OpenLayers.Util.upperCaseObject(_9c4);
_9c6.push(name,url,_9c4,_9c5);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_9c6);
OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
if(this.params.TRANSPARENT&&this.params.TRANSPARENT.toString().toLowerCase()=="true"){
if((_9c5==null)||(!_9c5.isBaseLayer)){
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
},getURL:function(_9c8){
_9c8=this.adjustBounds(_9c8);
var _9c9=this.getImageSize();
var _9ca={"BBOX":this.encodeBBOX?_9c8.toBBOX():_9c8.toArray(),"WIDTH":_9c9.w,"HEIGHT":_9c9.h};
var _9cb=this.getFullRequestString(_9ca);
return _9cb;
},addTile:function(_9cc,_9cd){
return new OpenLayers.Tile.Image(this,_9cd,_9cc,null,this.tileSize);
},mergeNewParams:function(_9ce){
var _9cf=OpenLayers.Util.upperCaseObject(_9ce);
var _9d0=[_9cf];
OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,_9d0);
},getFullRequestString:function(_9d1,_9d2){
var _9d3=this.map.getProjection();
this.params.SRS=(_9d3=="none")?null:_9d3;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Layer.WMS"});
OpenLayers.Layer.WorldWind=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{},isBaseLayer:true,lzd:null,zoomLevels:null,initialize:function(name,url,lzd,_9d7,_9d8,_9d9){
this.lzd=lzd;
this.zoomLevels=_9d7;
var _9da=[];
_9da.push(name,url,_9d8,_9d9);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_9da);
this.params=(_9d8?_9d8:{});
if(_9d8){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},addTile:function(_9db,_9dc){
return new OpenLayers.Tile.Image(this,_9dc,_9db,null,this.tileSize);
},getZoom:function(){
var zoom=this.map.getZoom();
var _9de=this.map.getMaxExtent();
zoom=zoom-Math.log(this.maxResolution/(this.lzd/512))/Math.log(2);
return zoom;
},getURL:function(_9df){
_9df=this.adjustBounds(_9df);
var zoom=this.getZoom();
var _9e1=this.map.getMaxExtent();
var deg=this.lzd/Math.pow(2,this.getZoom());
var x=Math.floor((_9df.left-_9e1.left)/deg);
var y=Math.floor((_9df.bottom-_9e1.bottom)/deg);
if(this.map.getResolution()<=(this.lzd/512)&&this.getZoom()<=this.zoomLevels){
return this.getFullRequestString({L:zoom,X:x,Y:y});
}else{
return OpenLayers.Util.getImagesLocation()+"blank.gif";
}
},CLASS_NAME:"OpenLayers.Layer.WorldWind"});
OpenLayers.Rule=OpenLayers.Class({name:"default",symbolizer:null,minScale:null,maxScale:null,initialize:function(_9e5){
this.symbolizer={};
OpenLayers.Util.extend(this,_9e5);
},destroy:function(){
for(var i in this.symbolizer){
this.symbolizer[i]=null;
}
this.symbolizer=null;
},evaluate:function(_9e7){
return true;
},CLASS_NAME:"OpenLayers.Rule"});
OpenLayers.Control.NavToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(_9e8){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_9e8]);
this.addControls([new OpenLayers.Control.Navigation(),new OpenLayers.Control.ZoomBox()]);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.NavToolbar"});
OpenLayers.Geometry.Collection=OpenLayers.Class(OpenLayers.Geometry,{components:null,componentTypes:null,initialize:function(_9ea){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.components=[];
if(_9ea!=null){
this.addComponents(_9ea);
}
},destroy:function(){
this.components.length=0;
this.components=null;
},clone:function(){
var _9eb=eval("new "+this.CLASS_NAME+"()");
for(var i=0;i<this.components.length;i++){
_9eb.addComponent(this.components[i].clone());
}
OpenLayers.Util.applyDefaults(_9eb,this);
return _9eb;
},getComponentsString:function(){
var _9ed=[];
for(var i=0;i<this.components.length;i++){
_9ed.push(this.components[i].toShortString());
}
return _9ed.join(",");
},calculateBounds:function(){
this.bounds=null;
if(this.components&&this.components.length>0){
this.setBounds(this.components[0].getBounds());
for(var i=1;i<this.components.length;i++){
this.extendBounds(this.components[i].getBounds());
}
}
},addComponents:function(_9f0){
if(!(_9f0 instanceof Array)){
_9f0=[_9f0];
}
for(var i=0;i<_9f0.length;i++){
this.addComponent(_9f0[i]);
}
},addComponent:function(_9f2,_9f3){
var _9f4=false;
if(_9f2){
if(this.componentTypes==null||(OpenLayers.Util.indexOf(this.componentTypes,_9f2.CLASS_NAME)>-1)){
if(_9f3!=null&&(_9f3<this.components.length)){
var _9f5=this.components.slice(0,_9f3);
var _9f6=this.components.slice(_9f3,this.components.length);
_9f5.push(_9f2);
this.components=_9f5.concat(_9f6);
}else{
this.components.push(_9f2);
}
_9f2.parent=this;
this.clearBounds();
_9f4=true;
}
}
return _9f4;
},removeComponents:function(_9f7){
if(!(_9f7 instanceof Array)){
_9f7=[_9f7];
}
for(var i=_9f7.length-1;i>=0;--i){
this.removeComponent(_9f7[i]);
}
},removeComponent:function(_9f9){
OpenLayers.Util.removeItem(this.components,_9f9);
this.clearBounds();
},getLength:function(){
var _9fa=0;
for(var i=0;i<this.components.length;i++){
_9fa+=this.components[i].getLength();
}
return _9fa;
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
},rotate:function(_a01,_a02){
for(var i=0;i<this.components.length;++i){
this.components[i].rotate(_a01,_a02);
}
},resize:function(_a04,_a05,_a06){
for(var i=0;i<this.components.length;++i){
this.components[i].resize(_a04,_a05,_a06);
}
},equals:function(_a08){
var _a09=true;
if(!_a08||!_a08.CLASS_NAME||(this.CLASS_NAME!=_a08.CLASS_NAME)){
_a09=false;
}else{
if(!(_a08.components instanceof Array)||(_a08.components.length!=this.components.length)){
_a09=false;
}else{
for(var i=0;i<this.components.length;++i){
if(!this.components[i].equals(_a08.components[i])){
_a09=false;
break;
}
}
}
}
return _a09;
},transform:function(_a0b,dest){
if(_a0b&&dest){
for(var i=0;i<this.components.length;i++){
var _a0e=this.components[i];
_a0e.transform(_a0b,dest);
}
}
return this;
},intersects:function(_a0f){
var _a10=false;
for(var i=0;i<this.components.length;++i){
_a10=_a0f.intersects(this.components[i]);
if(_a10){
break;
}
}
return _a10;
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
},distanceTo:function(_a15){
var _a16=0;
if((this.x!=null)&&(this.y!=null)&&(_a15!=null)&&(_a15.x!=null)&&(_a15.y!=null)){
var dx2=Math.pow(this.x-_a15.x,2);
var dy2=Math.pow(this.y-_a15.y,2);
_a16=Math.sqrt(dx2+dy2);
}
return _a16;
},equals:function(geom){
var _a1a=false;
if(geom!=null){
_a1a=((this.x==geom.x&&this.y==geom.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(geom.x)&&isNaN(geom.y)));
}
return _a1a;
},toShortString:function(){
return (this.x+", "+this.y);
},move:function(x,y){
this.x=this.x+x;
this.y=this.y+y;
this.clearBounds();
},rotate:function(_a1d,_a1e){
_a1d*=Math.PI/180;
var _a1f=this.distanceTo(_a1e);
var _a20=_a1d+Math.atan2(this.y-_a1e.y,this.x-_a1e.x);
this.x=_a1e.x+(_a1f*Math.cos(_a20));
this.y=_a1e.y+(_a1f*Math.sin(_a20));
this.clearBounds();
},resize:function(_a21,_a22,_a23){
_a23=(_a23==undefined)?1:_a23;
this.x=_a22.x+(_a21*_a23*(this.x-_a22.x));
this.y=_a22.y+(_a21*(this.y-_a22.y));
this.clearBounds();
},intersects:function(_a24){
var _a25=false;
if(_a24.CLASS_NAME=="OpenLayers.Geometry.Point"){
_a25=this.equals(_a24);
}else{
_a25=_a24.intersects(this);
}
return _a25;
},transform:function(_a26,dest){
if((_a26&&dest)){
OpenLayers.Projection.transform(this,_a26,dest);
}
return this;
},CLASS_NAME:"OpenLayers.Geometry.Point"});
OpenLayers.Geometry.Rectangle=OpenLayers.Class(OpenLayers.Geometry,{x:null,y:null,width:null,height:null,initialize:function(x,y,_a2a,_a2b){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.x=x;
this.y=y;
this.width=_a2a;
this.height=_a2b;
},calculateBounds:function(){
this.bounds=new OpenLayers.Bounds(this.x,this.y,this.x+this.width,this.y+this.height);
},getLength:function(){
var _a2c=(2*this.width)+(2*this.height);
return _a2c;
},getArea:function(){
var area=this.width*this.height;
return area;
},CLASS_NAME:"OpenLayers.Geometry.Rectangle"});
OpenLayers.Geometry.Surface=OpenLayers.Class(OpenLayers.Geometry,{initialize:function(){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.Surface"});
OpenLayers.Layer.MapServer.Untiled=OpenLayers.Class(OpenLayers.Layer.MapServer,{singleTile:true,initialize:function(name,url,_a30,_a31){
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
OpenLayers.Layer.WMS.Untiled=OpenLayers.Class(OpenLayers.Layer.WMS,{singleTile:true,initialize:function(name,url,_a36,_a37){
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
OpenLayers.Rule.Comparison=OpenLayers.Class(OpenLayers.Rule,{type:null,property:null,value:null,lowerBoundary:null,upperBoundary:null,initialize:function(_a3a){
OpenLayers.Rule.prototype.initialize.apply(this,[_a3a]);
},evaluate:function(_a3b){
var _a3c=_a3b.attributes||_a3b.data;
switch(this.type){
case OpenLayers.Rule.Comparison.EQUAL_TO:
case OpenLayers.Rule.Comparison.LESS_THAN:
case OpenLayers.Rule.Comparison.GREATER_THAN:
case OpenLayers.Rule.Comparison.LESS_THAN_OR_EQUAL_TO:
case OpenLayers.Rule.Comparison.GREATER_THAN_OR_EQUAL_TO:
return this.binaryCompare(_a3b,this.property,this.value);
case OpenLayers.Rule.Comparison.BETWEEN:
var _a3d=_a3c[this.property]>this.lowerBoundary;
_a3d=_a3d&&_a3c[this.property]<this.upperBoundary;
return _a3d;
case OpenLayers.Rule.Comparison.LIKE:
var _a3e=new RegExp(this.value,"gi");
return _a3e.test(_a3c[this.property]);
}
},value2regex:function(_a3f,_a40,_a41){
if(_a3f=="."){
var msg="'.' is an unsupported wildCard character for "+"OpenLayers.Rule.Comparison";
OpenLayers.Console.error(msg);
return null;
}
_a3f=_a3f?_a3f:"*";
_a40=_a40?_a40:".";
_a41=_a41?_a41:"!";
this.value=this.value.replace(new RegExp("\\"+_a41,"g"),"\\");
this.value=this.value.replace(new RegExp("\\"+_a40,"g"),".");
this.value=this.value.replace(new RegExp("\\"+_a3f,"g"),".*");
this.value=this.value.replace(new RegExp("\\\\.\\*","g"),"\\"+_a3f);
this.value=this.value.replace(new RegExp("\\\\\\.","g"),"\\"+_a40);
return this.value;
},binaryCompare:function(_a43,_a44,_a45){
var _a46=_a43.attributes||_a43.data;
switch(this.type){
case OpenLayers.Rule.Comparison.EQUAL_TO:
return _a46[_a44]==_a45;
case OpenLayers.Rule.Comparison.NOT_EQUAL_TO:
return _a46[_a44]!=_a45;
case OpenLayers.Rule.Comparison.LESS_THAN:
return _a46[_a44]<_a45;
case OpenLayers.Rule.Comparison.GREATER_THAN:
return _a46[_a44]>_a45;
case OpenLayers.Rule.Comparison.LESS_THAN_OR_EQUAL_TO:
return _a46[_a44]<=_a45;
case OpenLayers.Rule.Comparison.GREATER_THAN_OR_EQUAL_TO:
return _a46[_a44]>=_a45;
}
},CLASS_NAME:"OpenLayers.Rule.Comparison"});
OpenLayers.Rule.Comparison.EQUAL_TO="==";
OpenLayers.Rule.Comparison.NOT_EQUAL_TO="!=";
OpenLayers.Rule.Comparison.LESS_THAN="<";
OpenLayers.Rule.Comparison.GREATER_THAN=">";
OpenLayers.Rule.Comparison.LESS_THAN_OR_EQUAL_TO="<=";
OpenLayers.Rule.Comparison.GREATER_THAN_OR_EQUAL_TO=">=";
OpenLayers.Rule.Comparison.BETWEEN="..";
OpenLayers.Rule.Comparison.LIKE="~";
OpenLayers.Rule.FeatureId=OpenLayers.Class(OpenLayers.Rule,{fids:null,initialize:function(_a47){
this.fids=[];
OpenLayers.Rule.prototype.initialize.apply(this,[_a47]);
},evaluate:function(_a48){
for(var i=0;i<this.fids.length;i++){
var fid=_a48.fid||_a48.id;
if(fid==this.fids[i]){
return true;
}
}
return false;
},CLASS_NAME:"OpenLayers.Rule.FeatureId"});
OpenLayers.Rule.Logical=OpenLayers.Class(OpenLayers.Rule,{children:null,type:null,initialize:function(_a4b){
this.children=[];
OpenLayers.Rule.prototype.initialize.apply(this,[_a4b]);
},destroy:function(){
for(var i=0;i<this.children.length;i++){
this.children[i].destroy();
}
this.children=null;
OpenLayers.Rule.prototype.destroy.apply(this,arguments);
},evaluate:function(_a4d){
switch(this.type){
case OpenLayers.Rule.Logical.AND:
for(var i=0;i<this.children.length;i++){
if(this.children[i].evaluate(_a4d)==false){
return false;
}
}
return true;
case OpenLayers.Rule.Logical.OR:
for(var i=0;i<this.children.length;i++){
if(this.children[i].evaluate(_a4d)==true){
return true;
}
}
return false;
case OpenLayers.Rule.Logical.NOT:
return (!this.children[0].evaluate(_a4d));
}
},CLASS_NAME:"OpenLayers.Rule.Logical"});
OpenLayers.Rule.Logical.AND="&&";
OpenLayers.Rule.Logical.OR="||";
OpenLayers.Rule.Logical.NOT="!";
OpenLayers.Format.SLD=OpenLayers.Class(OpenLayers.Format.XML,{sldns:"http://www.opengis.net/sld",ogcns:"http://www.opengis.net/ogc",gmlns:"http://www.opengis.net/gml",defaultStyle:{fillColor:"#808080",fillOpacity:1,strokeColor:"#000000",strokeOpacity:1,strokeWidth:1,pointRadius:6},withNamedLayer:false,overrideDefaultStyleKey:true,initialize:function(_a4f){
OpenLayers.Format.XML.prototype.initialize.apply(this,[_a4f]);
},read:function(data,_a51){
if(typeof data=="string"){
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);
}
OpenLayers.Util.applyDefaults(_a51,{withNamedLayer:false,overrideDefaultStyleKey:true});
var _a52=this.getElementsByTagNameNS(data,this.sldns,"UserStyle");
var _a53={};
if(_a52.length>0){
var _a54={};
var _a55=new Array(_a52.length);
var _a56,userStyle,style;
for(var i=0;i<_a52.length;i++){
userStyle=_a52[i];
_a56=this.parseProperty(userStyle,this.sldns,"Name");
style=this.parseUserStyle(userStyle,_a56);
if(_a51.overrideDefaultStyleKey&&style.isDefault==true){
_a56="default";
}
if(!_a54[style.layerName]){
_a54[style.layerName]={};
}
_a54[style.layerName][_a56]=style;
_a55[i]=style;
}
_a53=_a51.withNamedLayer?[_a55,_a54]:_a55;
}
console.debug(_a53);
return _a53;
},parseUserStyle:function(_a58,name){
var _a5a=new OpenLayers.Style(this.defaultStyle,{name:name});
_a5a.isDefault=(this.parseProperty(_a58,this.sldns,"IsDefault")==1);
var _a5b=_a58.parentNode;
var _a5c=this.getElementsByTagNameNS(_a5b,this.sldns,"Name");
if(_a5b.nodeName.indexOf("NamedLayer")!=-1&&_a5c&&_a5c.length>0&&_a5c[0].parentNode==_a5b){
_a5a.layerName=this.getChildValue(_a5c[0]);
}
var _a5d=this.getElementsByTagNameNS(_a58,this.sldns,"Rule");
if(_a5d.length>0){
var _a5e=_a5a.rules;
var _a5f;
for(var i=0;i<_a5d.length;i++){
_a5f=this.parseProperty(_a5d[i],this.sldns,"Name");
_a5e.push(this.parseRule(_a5d[i],_a5f));
}
}
return _a5a;
},parseRule:function(_a61,name){
var _a63=this.getElementsByTagNameNS(_a61,this.ogcns,"Filter");
if(_a63&&_a63.length>0){
var rule=this.parseFilter(_a63[0]);
}else{
var rule=new OpenLayers.Rule();
}
rule.name=name;
var _a65=this.getElementsByTagNameNS(_a61,this.sldns,"MinScaleDenominator");
if(_a65&&_a65.length>0){
rule.minScale=parseFloat(this.getChildValue(_a65[0]));
}
var _a66=this.getElementsByTagNameNS(_a61,this.sldns,"MaxScaleDenominator");
if(_a66&&_a66.length>0){
rule.maxScale=parseFloat(this.getChildValue(_a66[0]));
}
var _a67=OpenLayers.Style.SYMBOLIZER_PREFIXES;
for(var s=0;s<_a67.length;s++){
var _a69=this.getElementsByTagNameNS(_a61,this.sldns,_a67[s]+"Symbolizer");
if(_a69&&_a69.length>0){
var _a6a={};
var _a6b=this.getElementsByTagNameNS(_a69[0],this.sldns,"Graphic");
if(_a6b&&_a6b.length>0){
_a6a.externalGraphic=this.parseProperty(_a6b[0],this.sldns,"OnlineResource","xlink:href");
_a6a.pointRadius=this.parseProperty(_a6b[0],this.sldns,"Size");
_a6a.graphicOpacity=this.parseProperty(_a6b[0],this.sldns,"Opacity");
}
var fill=this.getElementsByTagNameNS(_a69[0],this.sldns,"Fill");
if(fill&&fill.length>0){
_a6a.fillColor=this.parseProperty(fill[0],this.sldns,"CssParameter","name","fill");
_a6a.fillOpacity=this.parseProperty(fill[0],this.sldns,"CssParameter","name","fill-opacity")||1;
}
var _a6d=this.getElementsByTagNameNS(_a69[0],this.sldns,"Stroke");
if(_a6d&&_a6d.length>0){
_a6a.strokeColor=this.parseProperty(_a6d[0],this.sldns,"CssParameter","name","stroke");
_a6a.strokeOpacity=this.parseProperty(_a6d[0],this.sldns,"CssParameter","name","stroke-opacity")||1;
_a6a.strokeWidth=this.parseProperty(_a6d[0],this.sldns,"CssParameter","name","stroke-width");
_a6a.strokeLinecap=this.parseProperty(_a6d[0],this.sldns,"CssParameter","name","stroke-linecap");
}
rule.symbolizer[_a67[s]]=_a6a;
}
}
return rule;
},parseFilter:function(_a6e){
var _a6f=this.getNodeOrChildrenByTagName(_a6e,"FeatureId");
if(_a6f){
var rule=new OpenLayers.Rule.FeatureId();
for(var i=0;i<_a6f.length;i++){
rule.fids.push(_a6f[i].getAttribute("fid"));
}
return rule;
}
_a6f=this.getNodeOrChildrenByTagName(_a6e,"And");
if(_a6f){
var rule=new OpenLayers.Rule.Logical({type:OpenLayers.Rule.Logical.AND});
var _a72=_a6f[0].childNodes;
for(var i=0;i<_a72.length;i++){
if(_a72[i].nodeType==1){
rule.children.push(this.parseFilter(_a72[i]));
}
}
return rule;
}
_a6f=this.getNodeOrChildrenByTagName(_a6e,"Or");
if(_a6f){
var rule=new OpenLayers.Rule.Logical({type:OpenLayers.Rule.Logical.OR});
var _a72=_a6f[0].childNodes;
for(var i=0;i<_a72.length;i++){
if(_a72[i].nodeType==1){
rule.children.push(this.parseFilter(_a72[i]));
}
}
return rule;
}
_a6f=this.getNodeOrChildrenByTagName(_a6e,"Not");
if(_a6f){
var rule=new OpenLayers.Rule.Logical({type:OpenLayers.Rule.Logical.NOT});
rule.children.push(this.parseFilter(_a6f[0]));
return rule;
}
for(var type in this.TYPES){
var _a6f=this.getNodeOrChildrenByTagName(_a6e,type);
if(_a6f){
_a6f=_a6f[0];
var rule=new OpenLayers.Rule.Comparison({type:OpenLayers.Rule.Comparison[this.TYPES[type]],property:this.parseProperty(_a6f,this.ogcns,"PropertyName")});
if(this.TYPES[type]=="BETWEEN"){
rule.lowerBoundary=this.parseProperty(_a6f,this.ogcns,"LowerBoundary");
rule.upperBoudary=this.parseProperty(_a6f,this.ogcns,"UpperBoundary");
}else{
rule.value=this.parseProperty(_a6f,this.ogcns,"Literal");
if(this.TYPES[type]=="LIKE"){
var _a74=_a6f.getAttribute("wildCard");
var _a75=_a6f.getAttribute("singleChar");
var _a76=_a6f.getAttribute("escape");
rule.value2regex(_a74,_a75,_a76);
}
}
return rule;
}
}
return new OpenLayers.Rule();
},getNodeOrChildrenByTagName:function(_a77,_a78){
var _a79=(_a77.prefix)?_a77.nodeName.split(":")[1]:_a77.nodeName;
if(_a79==_a78){
return [_a77];
}else{
var _a7a=this.getElementsByTagNameNS(_a77,this.ogcns,_a78);
}
if(_a7a.length>0){
var node;
var list=[];
for(var i=0;i<_a7a.length;i++){
node=_a7a[i];
if(node.parentNode==_a77){
list.push(node);
}
}
return list.length>0?list:null;
}
return null;
},parseProperty:function(_a7e,_a7f,_a80,_a81,_a82){
var _a83=null;
var _a84=this.getElementsByTagNameNS(_a7e,_a7f,_a80);
if(_a84&&_a84.length>0){
var _a85=_a81?this.getNodeWithAttribute(_a84,_a81):_a84[0];
if(window.opera&&_a81){
var _a86=_a81.indexOf(":");
if(_a86!=-1){
_a81=_a81.substring(++_a86);
}
}
if(_a81&&_a82){
_a85=this.getNodeWithAttribute(_a84,_a81,_a82);
_a83=this.parseParameter(_a85);
}
if(_a81&&!_a82){
var _a85=this.getNodeWithAttribute(_a84,_a81);
_a83=_a85.getAttribute(_a81);
}
if(!_a81){
var _a83=this.parseParameter(_a85);
}
}
if(_a83){
_a83=OpenLayers.String.trim(_a83);
if(!isNaN(_a83)){
_a83=parseFloat(_a83);
}
}
return _a83;
},parseParameter:function(_a87){
if(!_a87){
return null;
}
var _a88=_a87.childNodes;
if(!_a88){
return null;
}
var _a89=new Array(_a88.length);
for(var i=0;i<_a88.length;i++){
if(_a88[i].nodeName.indexOf("Literal")!=-1){
_a89[i]=this.getChildValue(_a88[i]);
}else{
if(_a88[i].nodeName.indexOf("propertyName")!=-1){
_a89[i]="${"+this.getChildValue(_a88[i])+"}";
}else{
if(_a88[i].nodeType==3){
_a89[i]=_a88[i].text||_a88[i].textContent;
}
}
}
}
return _a89.join("");
},getNodeWithAttribute:function(_a8b,_a8c,_a8d){
for(var i=0;i<_a8b.length;i++){
var _a8f=_a8b[i].getAttribute(_a8c);
if(_a8f){
if(!_a8d){
return _a8b[i];
}else{
if(_a8f==_a8d){
return _a8b[i];
}
}
}
}
},TYPES:{"PropertyIsEqualTo":"EQUAL_TO","PropertyIsNotEqualTo":"NOT_EQUAL_TO","PropertyIsLessThan":"LESS_THAN","PropertyIsGreaterThan":"GREATER_THAN","PropertyIsLessThanOrEqualTo":"LESS_THAN_OR_EQUAL_TO","PropertyIsGreaterThanOrEqualTo":"GREATER_THAN_OR_EQUAL_TO","PropertyIsBetween":"BETWEEN","PropertyIsLike":"LIKE"},CLASS_NAME:"OpenLayers.Format.SLD"});
OpenLayers.Format.Text=OpenLayers.Class(OpenLayers.Format,{initialize:function(_a90){
OpenLayers.Format.prototype.initialize.apply(this,[_a90]);
},read:function(text){
var _a92=text.split("\n");
var _a93;
var _a94=[];
for(var lcv=0;lcv<(_a92.length-1);lcv++){
var _a96=_a92[lcv].replace(/^\s*/,"").replace(/\s*$/,"");
if(_a96.charAt(0)!="#"){
if(!_a93){
_a93=_a96.split("\t");
}else{
var vals=_a96.split("\t");
var _a98=new OpenLayers.Geometry.Point(0,0);
var _a99={};
var _a9a={};
var icon,iconSize,iconOffset,overflow;
var set=false;
for(var _a9d=0;_a9d<vals.length;_a9d++){
if(vals[_a9d]){
if(_a93[_a9d]=="point"){
var _a9e=vals[_a9d].split(",");
_a98.y=parseFloat(_a9e[0]);
_a98.x=parseFloat(_a9e[1]);
set=true;
}else{
if(_a93[_a9d]=="lat"){
_a98.y=parseFloat(vals[_a9d]);
set=true;
}else{
if(_a93[_a9d]=="lon"){
_a98.x=parseFloat(vals[_a9d]);
set=true;
}else{
if(_a93[_a9d]=="title"){
_a99["title"]=vals[_a9d];
}else{
if(_a93[_a9d]=="image"||_a93[_a9d]=="icon"){
_a9a["externalGraphic"]=vals[_a9d];
}else{
if(_a93[_a9d]=="iconSize"){
var size=vals[_a9d].split(",");
_a9a["graphicWidth"]=parseFloat(size[0]);
_a9a["graphicHeight"]=parseFloat(size[1]);
}else{
if(_a93[_a9d]=="iconOffset"){
var _aa0=vals[_a9d].split(",");
_a9a["graphicXOffset"]=parseFloat(_aa0[0]);
_a9a["graphicYOffset"]=parseFloat(_aa0[1]);
}else{
if(_a93[_a9d]=="description"){
_a99["description"]=vals[_a9d];
}else{
if(_a93[_a9d]=="overflow"){
_a99["overflow"]=vals[_a9d];
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
if(this.internalProjection&&this.externalProjection){
_a98.transform(this.externalProjection,this.internalProjection);
}
var _aa1=new OpenLayers.Feature.Vector(_a98,_a99,_a9a);
_a94.push(_aa1);
}
}
}
}
return _a94;
},CLASS_NAME:"OpenLayers.Format.Text"});
OpenLayers.Geometry.MultiLineString=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LineString"],initialize:function(_aa2){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiLineString"});
OpenLayers.Geometry.MultiPoint=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_aa3){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},addPoint:function(_aa4,_aa5){
this.addComponent(_aa4,_aa5);
},removePoint:function(_aa6){
this.removeComponent(_aa6);
},CLASS_NAME:"OpenLayers.Geometry.MultiPoint"});
OpenLayers.Geometry.MultiPolygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Polygon"],initialize:function(_aa7){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiPolygon"});
OpenLayers.Geometry.Polygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LinearRing"],initialize:function(_aa8){
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
},containsPoint:function(_aab){
var _aac=this.components.length;
var _aad=false;
if(_aac>0){
_aad=this.components[0].containsPoint(_aab);
if(_aad!==1){
if(_aad&&_aac>1){
var hole;
for(var i=1;i<_aac;++i){
hole=this.components[i].containsPoint(_aab);
if(hole){
if(hole===1){
_aad=1;
}else{
_aad=false;
}
break;
}
}
}
}
}
return _aad;
},intersects:function(_ab0){
var _ab1=false;
var i;
if(_ab0.CLASS_NAME=="OpenLayers.Geometry.Point"){
_ab1=this.containsPoint(_ab0);
}else{
if(_ab0.CLASS_NAME=="OpenLayers.Geometry.LineString"||_ab0.CLASS_NAME=="OpenLayers.Geometry.LinearRing"){
for(i=0;i<this.components.length;++i){
_ab1=_ab0.intersects(this.components[i]);
if(_ab1){
break;
}
}
if(!_ab1){
for(i=0;i<_ab0.components.length;++i){
_ab1=this.containsPoint(_ab0.components[i]);
if(_ab1){
break;
}
}
}
}else{
for(i=0;i<_ab0.components.length;++i){
_ab1=this.intersects(_ab0.components[i]);
if(_ab1){
break;
}
}
}
}
if(!_ab1&&_ab0.CLASS_NAME=="OpenLayers.Geometry.Polygon"){
var ring=this.components[0];
for(i=0;i<ring.components.length;++i){
_ab1=_ab0.containsPoint(ring.components[i]);
if(_ab1){
break;
}
}
}
return _ab1;
},CLASS_NAME:"OpenLayers.Geometry.Polygon"});
OpenLayers.Geometry.Polygon.createRegularPolygon=function(_ab4,_ab5,_ab6,_ab7){
var _ab8=Math.PI*((1/_ab6)-(1/2));
if(_ab7){
_ab8+=(_ab7/180)*Math.PI;
}
var _ab9,x,y;
var _aba=[];
for(var i=0;i<_ab6;++i){
_ab9=_ab8+(i*2*Math.PI/_ab6);
x=_ab4.x+(_ab5*Math.cos(_ab9));
y=_ab4.y+(_ab5*Math.sin(_ab9));
_aba.push(new OpenLayers.Geometry.Point(x,y));
}
var ring=new OpenLayers.Geometry.LinearRing(_aba);
return new OpenLayers.Geometry.Polygon([ring]);
};
OpenLayers.Handler.Point=OpenLayers.Class(OpenLayers.Handler,{point:null,layer:null,drawing:false,mouseDown:false,lastDown:null,lastUp:null,initialize:function(_abd,_abe,_abf){
this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},activate:function(){
if(!OpenLayers.Handler.prototype.activate.apply(this,arguments)){
return false;
}
var _ac0={displayInLayerSwitcher:false,calculateInRange:function(){
return true;
}};
this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,_ac0);
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
if(this.layer.map!=null){
this.layer.destroy(false);
}
this.layer=null;
return true;
},destroyFeature:function(){
if(this.point){
this.point.destroy();
}
this.point=null;
},finalize:function(){
this.layer.renderer.clear();
this.drawing=false;
this.mouseDown=false;
this.lastDown=null;
this.lastUp=null;
this.callback("done",[this.geometryClone()]);
this.destroyFeature();
},cancel:function(){
this.layer.renderer.clear();
this.drawing=false;
this.mouseDown=false;
this.lastDown=null;
this.lastUp=null;
this.callback("cancel",[this.geometryClone()]);
this.destroyFeature();
},click:function(evt){
OpenLayers.Event.stop(evt);
return false;
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
var _ac4=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_ac4.lon;
this.point.geometry.y=_ac4.lat;
this.drawFeature();
return false;
},mousemove:function(evt){
if(this.drawing){
var _ac6=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_ac6.lon;
this.point.geometry.y=_ac6.lat;
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
OpenLayers.Geometry.Curve=OpenLayers.Class(OpenLayers.Geometry.MultiPoint,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_ac8){
OpenLayers.Geometry.MultiPoint.prototype.initialize.apply(this,arguments);
},getLength:function(){
var _ac9=0;
if(this.components&&(this.components.length>1)){
for(var i=1;i<this.components.length;i++){
_ac9+=this.components[i-1].distanceTo(this.components[i]);
}
}
return _ac9;
},CLASS_NAME:"OpenLayers.Geometry.Curve"});
OpenLayers.Geometry.LineString=OpenLayers.Class(OpenLayers.Geometry.Curve,{initialize:function(_acb){
OpenLayers.Geometry.Curve.prototype.initialize.apply(this,arguments);
},removeComponent:function(_acc){
if(this.components&&(this.components.length>2)){
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
}
},intersects:function(_acd){
var _ace=false;
var type=_acd.CLASS_NAME;
if(type=="OpenLayers.Geometry.LineString"||type=="OpenLayers.Geometry.LinearRing"||type=="OpenLayers.Geometry.Point"){
var _ad0=this.getSortedSegments();
var _ad1;
if(type=="OpenLayers.Geometry.Point"){
_ad1=[{x1:_acd.x,y1:_acd.y,x2:_acd.x,y2:_acd.y}];
}else{
_ad1=_acd.getSortedSegments();
}
var seg1,seg1x1,seg1x2,seg1y1,seg1y2,seg2,seg2y1,seg2y2;
outer:
for(var i=0;i<_ad0.length;++i){
seg1=_ad0[i];
seg1x1=seg1.x1;
seg1x2=seg1.x2;
seg1y1=seg1.y1;
seg1y2=seg1.y2;
inner:
for(var j=0;j<_ad1.length;++j){
seg2=_ad1[j];
if(seg2.x1>seg1x2){
break;
}
if(seg2.x2<seg1x1){
continue;
}
seg2y1=seg2.y1;
seg2y2=seg2.y2;
if(Math.min(seg2y1,seg2y2)>Math.max(seg1y1,seg1y2)){
continue;
}
if(Math.max(seg2y1,seg2y2)<Math.min(seg1y1,seg1y2)){
continue;
}
if(OpenLayers.Geometry.segmentsIntersect(seg1,seg2)){
_ace=true;
break outer;
}
}
}
}else{
_ace=_acd.intersects(this);
}
return _ace;
},getSortedSegments:function(){
var _ad5=this.components.length-1;
var _ad6=new Array(_ad5);
for(var i=0;i<_ad5;++i){
point1=this.components[i];
point2=this.components[i+1];
if(point1.x<point2.x){
_ad6[i]={x1:point1.x,y1:point1.y,x2:point2.x,y2:point2.y};
}else{
_ad6[i]={x1:point2.x,y1:point2.y,x2:point1.x,y2:point1.y};
}
}
function byX1(seg1,seg2){
return seg1.x1-seg2.x1;
}
return _ad6.sort(byX1);
},CLASS_NAME:"OpenLayers.Geometry.LineString"});
OpenLayers.Format.GML=OpenLayers.Class(OpenLayers.Format.XML,{featureNS:"http://mapserver.gis.umn.edu/mapserver",featurePrefix:"feature",featureName:"featureMember",layerName:"features",geometryName:"geometry",collectionName:"FeatureCollection",gmlns:"http://www.opengis.net/gml",extractAttributes:true,xy:true,initialize:function(_ada){
this.regExes={trimSpace:(/^\s*|\s*$/g),removeSpace:(/\s*/g),splitSpace:(/\s+/),trimComma:(/\s*,\s*/g)};
OpenLayers.Format.XML.prototype.initialize.apply(this,[_ada]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);
}
var _adc=this.getElementsByTagNameNS(data.documentElement,this.gmlns,this.featureName);
var _add=[];
for(var i=0;i<_adc.length;i++){
var _adf=this.parseFeature(_adc[i]);
if(_adf){
_add.push(_adf);
}
}
return _add;
},parseFeature:function(node){
var _ae1=["MultiGeometry","MultiPolygon","Polygon","MultiLineString","LineString","MultiPoint","Point","Envelope"];
var type,nodeList,geometry,parser;
for(var i=0;i<_ae1.length;++i){
type=_ae1[i];
nodeList=this.getElementsByTagNameNS(node,this.gmlns,type);
if(nodeList.length>0){
var _ae4=this.parseGeometry[type.toLowerCase()];
if(_ae4){
geometry=_ae4.apply(this,[nodeList[0]]);
if(this.internalProjection&&this.externalProjection){
geometry.transform(this.externalProjection,this.internalProjection);
}
}else{
OpenLayers.Console.error("Unsupported geometry type: "+type);
}
break;
}
}
var _ae5;
if(this.extractAttributes){
_ae5=this.parseAttributes(node);
}
var _ae6=new OpenLayers.Feature.Vector(geometry,_ae5);
var _ae7=node.firstChild;
var fid;
while(_ae7){
if(_ae7.nodeType==1){
fid=_ae7.getAttribute("fid")||_ae7.getAttribute("id");
if(fid){
break;
}
}
_ae7=_ae7.nextSibling;
}
_ae6.fid=fid;
return _ae6;
},parseGeometry:{point:function(node){
var _aea,coordString;
var _aeb=[];
var _aea=this.getElementsByTagNameNS(node,this.gmlns,"pos");
if(_aea.length>0){
coordString=_aea[0].firstChild.nodeValue;
coordString=coordString.replace(this.regExes.trimSpace,"");
_aeb=coordString.split(this.regExes.splitSpace);
}
if(_aeb.length==0){
_aea=this.getElementsByTagNameNS(node,this.gmlns,"coordinates");
if(_aea.length>0){
coordString=_aea[0].firstChild.nodeValue;
coordString=coordString.replace(this.regExes.removeSpace,"");
_aeb=coordString.split(",");
}
}
if(_aeb.length==0){
_aea=this.getElementsByTagNameNS(node,this.gmlns,"coord");
if(_aea.length>0){
var _aec=this.getElementsByTagNameNS(_aea[0],this.gmlns,"X");
var _aed=this.getElementsByTagNameNS(_aea[0],this.gmlns,"Y");
if(_aec.length>0&&_aed.length>0){
_aeb=[_aec[0].firstChild.nodeValue,_aed[0].firstChild.nodeValue];
}
}
}
if(_aeb.length==2){
_aeb[2]=null;
}
if(this.xy){
return new OpenLayers.Geometry.Point(_aeb[0],_aeb[1],_aeb[2]);
}else{
return new OpenLayers.Geometry.Point(_aeb[1],_aeb[0],_aeb[2]);
}
},multipoint:function(node){
var _aef=this.getElementsByTagNameNS(node,this.gmlns,"Point");
var _af0=[];
if(_aef.length>0){
var _af1;
for(var i=0;i<_aef.length;++i){
_af1=this.parseGeometry.point.apply(this,[_aef[i]]);
if(_af1){
_af0.push(_af1);
}
}
}
return new OpenLayers.Geometry.MultiPoint(_af0);
},linestring:function(node,ring){
var _af5,coordString;
var _af6=[];
var _af7=[];
_af5=this.getElementsByTagNameNS(node,this.gmlns,"posList");
if(_af5.length>0){
coordString=this.concatChildValues(_af5[0]);
coordString=coordString.replace(this.regExes.trimSpace,"");
_af6=coordString.split(this.regExes.splitSpace);
var dim=parseInt(_af5[0].getAttribute("dimension"))||2;
var j,x,y,z;
for(var i=0;i<_af6.length/dim;++i){
j=i*dim;
x=_af6[j];
y=_af6[j+1];
z=(dim==2)?null:_af6[j+2];
if(this.xy){
_af7.push(new OpenLayers.Geometry.Point(x,y,z));
}else{
_af7.push(new OpenLayers.Geometry.Point(y,x,z));
}
}
}
if(_af6.length==0){
_af5=this.getElementsByTagNameNS(node,this.gmlns,"coordinates");
if(_af5.length>0){
coordString=this.concatChildValues(_af5[0]);
coordString=coordString.replace(this.regExes.trimSpace,"");
coordString=coordString.replace(this.regExes.trimComma,",");
var _afb=coordString.split(this.regExes.splitSpace);
for(var i=0;i<_afb.length;++i){
_af6=_afb[i].split(",");
if(_af6.length==2){
_af6[2]=null;
}
if(this.xy){
_af7.push(new OpenLayers.Geometry.Point(_af6[0],_af6[1],_af6[2]));
}else{
_af7.push(new OpenLayers.Geometry.Point(_af6[1],_af6[0],_af6[2]));
}
}
}
}
var line=null;
if(_af7.length!=0){
if(ring){
line=new OpenLayers.Geometry.LinearRing(_af7);
}else{
line=new OpenLayers.Geometry.LineString(_af7);
}
}
return line;
},multilinestring:function(node){
var _afe=this.getElementsByTagNameNS(node,this.gmlns,"LineString");
var _aff=[];
if(_afe.length>0){
var line;
for(var i=0;i<_afe.length;++i){
line=this.parseGeometry.linestring.apply(this,[_afe[i]]);
if(line){
_aff.push(line);
}
}
}
return new OpenLayers.Geometry.MultiLineString(_aff);
},polygon:function(node){
var _b03=this.getElementsByTagNameNS(node,this.gmlns,"LinearRing");
var _b04=[];
if(_b03.length>0){
var ring;
for(var i=0;i<_b03.length;++i){
ring=this.parseGeometry.linestring.apply(this,[_b03[i],true]);
if(ring){
_b04.push(ring);
}
}
}
return new OpenLayers.Geometry.Polygon(_b04);
},multipolygon:function(node){
var _b08=this.getElementsByTagNameNS(node,this.gmlns,"Polygon");
var _b09=[];
if(_b08.length>0){
var _b0a;
for(var i=0;i<_b08.length;++i){
_b0a=this.parseGeometry.polygon.apply(this,[_b08[i]]);
if(_b0a){
_b09.push(_b0a);
}
}
}
return new OpenLayers.Geometry.MultiPolygon(_b09);
},envelope:function(node){
var _b0d=[];
var _b0e;
var _b0f;
var _b10=this.getElementsByTagNameNS(node,this.gmlns,"lowerCorner");
if(_b10.length>0){
var _b11=[];
if(_b10.length>0){
_b0e=_b10[0].firstChild.nodeValue;
_b0e=_b0e.replace(this.regExes.trimSpace,"");
_b11=_b0e.split(this.regExes.splitSpace);
}
if(_b11.length==2){
_b11[2]=null;
}
if(this.xy){
var _b12=new OpenLayers.Geometry.Point(_b11[0],_b11[1],_b11[2]);
}else{
var _b12=new OpenLayers.Geometry.Point(_b11[1],_b11[0],_b11[2]);
}
}
var _b13=this.getElementsByTagNameNS(node,this.gmlns,"upperCorner");
if(_b13.length>0){
var _b11=[];
if(_b13.length>0){
_b0e=_b13[0].firstChild.nodeValue;
_b0e=_b0e.replace(this.regExes.trimSpace,"");
_b11=_b0e.split(this.regExes.splitSpace);
}
if(_b11.length==2){
_b11[2]=null;
}
if(this.xy){
var _b14=new OpenLayers.Geometry.Point(_b11[0],_b11[1],_b11[2]);
}else{
var _b14=new OpenLayers.Geometry.Point(_b11[1],_b11[0],_b11[2]);
}
}
if(_b12&&_b14){
_b0d.push(new OpenLayers.Geometry.Point(_b12.x,_b12.y));
_b0d.push(new OpenLayers.Geometry.Point(_b14.x,_b12.y));
_b0d.push(new OpenLayers.Geometry.Point(_b14.x,_b14.y));
_b0d.push(new OpenLayers.Geometry.Point(_b12.x,_b14.y));
_b0d.push(new OpenLayers.Geometry.Point(_b12.x,_b12.y));
var ring=new OpenLayers.Geometry.LinearRing(_b0d);
_b0f=new OpenLayers.Geometry.Polygon([ring]);
}
return _b0f;
},multigeometry:function(node){
var _b17,parser;
var _b18=[];
var _b19=node.childNodes;
for(var i=0;i<_b19.length;++i){
_b17=_b19[i];
if(_b17.nodeType==1){
var type=(_b17.prefix)?_b17.nodeName.split(":")[1]:_b17.nodeName;
var _b1c=this.parseGeometry[type.toLowerCase()];
if(_b1c){
_b18.push(_b1c.apply(this,[_b17]));
}
}
}
if((this.reverseFeatures!=undefined)&&this.reverseFeatures){
_b18=_b18.reverse();
}
return new OpenLayers.Geometry.Collection(_b18);
}},parseAttributes:function(node){
var _b1e={};
var _b1f=node.firstChild;
var _b20,i,child,grandchildren,grandchild,name,value;
while(_b1f){
if(_b1f.nodeType==1){
_b20=_b1f.childNodes;
for(i=0;i<_b20.length;++i){
child=_b20[i];
if(child.nodeType==1){
grandchildren=child.childNodes;
if(grandchildren.length==1){
grandchild=grandchildren[0];
if(grandchild.nodeType==3||grandchild.nodeType==4){
name=(child.prefix)?child.nodeName.split(":")[1]:child.nodeName;
value=grandchild.nodeValue.replace(this.regExes.trimSpace,"");
_b1e[name]=value;
}
}
}
}
break;
}
_b1f=_b1f.nextSibling;
}
return _b1e;
},write:function(_b21){
if(!(_b21 instanceof Array)){
_b21=[_b21];
}
var gml=this.createElementNS("http://www.opengis.net/wfs","wfs:"+this.collectionName);
for(var i=0;i<_b21.length;i++){
gml.appendChild(this.createFeatureXML(_b21[i]));
}
return OpenLayers.Format.XML.prototype.write.apply(this,[gml]);
},createFeatureXML:function(_b24){
var _b25=_b24.geometry;
var _b26=this.buildGeometryNode(_b25);
var _b27=this.createElementNS(this.featureNS,this.featurePrefix+":"+this.geometryName);
_b27.appendChild(_b26);
var _b28=this.createElementNS(this.gmlns,"gml:"+this.featureName);
var _b29=this.createElementNS(this.featureNS,this.featurePrefix+":"+this.layerName);
var fid=_b24.fid||_b24.id;
_b29.setAttribute("fid",fid);
_b29.appendChild(_b27);
for(var attr in _b24.attributes){
var _b2c=this.createTextNode(_b24.attributes[attr]);
var _b2d=attr.substring(attr.lastIndexOf(":")+1);
var _b2e=this.createElementNS(this.featureNS,this.featurePrefix+":"+_b2d);
_b2e.appendChild(_b2c);
_b29.appendChild(_b2e);
}
_b28.appendChild(_b29);
return _b28;
},buildGeometryNode:function(_b2f){
if(this.externalProjection&&this.internalProjection){
_b2f=_b2f.clone();
_b2f.transform(this.internalProjection,this.externalProjection);
}
var _b30=_b2f.CLASS_NAME;
var type=_b30.substring(_b30.lastIndexOf(".")+1);
var _b32=this.buildGeometry[type.toLowerCase()];
return _b32.apply(this,[_b2f]);
},buildGeometry:{point:function(_b33){
var gml=this.createElementNS(this.gmlns,"gml:Point");
gml.appendChild(this.buildCoordinatesNode(_b33));
return gml;
},multipoint:function(_b35){
var gml=this.createElementNS(this.gmlns,"gml:MultiPoint");
var _b37=_b35.components;
var _b38,pointGeom;
for(var i=0;i<_b37.length;i++){
_b38=this.createElementNS(this.gmlns,"gml:pointMember");
pointGeom=this.buildGeometry.point.apply(this,[_b37[i]]);
_b38.appendChild(pointGeom);
gml.appendChild(_b38);
}
return gml;
},linestring:function(_b3a){
var gml=this.createElementNS(this.gmlns,"gml:LineString");
gml.appendChild(this.buildCoordinatesNode(_b3a));
return gml;
},multilinestring:function(_b3c){
var gml=this.createElementNS(this.gmlns,"gml:MultiLineString");
var _b3e=_b3c.components;
var _b3f,lineGeom;
for(var i=0;i<_b3e.length;++i){
_b3f=this.createElementNS(this.gmlns,"gml:lineStringMember");
lineGeom=this.buildGeometry.linestring.apply(this,[_b3e[i]]);
_b3f.appendChild(lineGeom);
gml.appendChild(_b3f);
}
return gml;
},linearring:function(_b41){
var gml=this.createElementNS(this.gmlns,"gml:LinearRing");
gml.appendChild(this.buildCoordinatesNode(_b41));
return gml;
},polygon:function(_b43){
var gml=this.createElementNS(this.gmlns,"gml:Polygon");
var _b45=_b43.components;
var _b46,ringGeom,type;
for(var i=0;i<_b45.length;++i){
type=(i==0)?"outerBoundaryIs":"innerBoundaryIs";
_b46=this.createElementNS(this.gmlns,"gml:"+type);
ringGeom=this.buildGeometry.linearring.apply(this,[_b45[i]]);
_b46.appendChild(ringGeom);
gml.appendChild(_b46);
}
return gml;
},multipolygon:function(_b48){
var gml=this.createElementNS(this.gmlns,"gml:MultiPolygon");
var _b4a=_b48.components;
var _b4b,polyGeom;
for(var i=0;i<_b4a.length;++i){
_b4b=this.createElementNS(this.gmlns,"gml:polygonMember");
polyGeom=this.buildGeometry.polygon.apply(this,[_b4a[i]]);
_b4b.appendChild(polyGeom);
gml.appendChild(_b4b);
}
return gml;
}},buildCoordinatesNode:function(_b4d){
var _b4e=this.createElementNS(this.gmlns,"gml:coordinates");
_b4e.setAttribute("decimal",".");
_b4e.setAttribute("cs",",");
_b4e.setAttribute("ts"," ");
var _b4f=(_b4d.components)?_b4d.components:[_b4d];
var _b50=[];
for(var i=0;i<_b4f.length;i++){
_b50.push(_b4f[i].x+","+_b4f[i].y);
}
var _b52=this.createTextNode(_b50.join(" "));
_b4e.appendChild(_b52);
return _b4e;
},CLASS_NAME:"OpenLayers.Format.GML"});
OpenLayers.Format.GeoJSON=OpenLayers.Class(OpenLayers.Format.JSON,{initialize:function(_b53){
OpenLayers.Format.JSON.prototype.initialize.apply(this,[_b53]);
},read:function(json,type,_b56){
type=(type)?type:"FeatureCollection";
var _b57=null;
var obj=null;
if(typeof json=="string"){
obj=OpenLayers.Format.JSON.prototype.read.apply(this,[json,_b56]);
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
_b57=this.parseGeometry(obj);
}
catch(err){
OpenLayers.Console.error(err);
}
break;
case "Feature":
try{
_b57=this.parseFeature(obj);
_b57.type="Feature";
}
catch(err){
OpenLayers.Console.error(err);
}
break;
case "FeatureCollection":
_b57=[];
switch(obj.type){
case "Feature":
try{
_b57.push(this.parseFeature(obj));
}
catch(err){
_b57=null;
OpenLayers.Console.error(err);
}
break;
case "FeatureCollection":
for(var i=0;i<obj.features.length;++i){
try{
_b57.push(this.parseFeature(obj.features[i]));
}
catch(err){
_b57=null;
OpenLayers.Console.error(err);
}
}
break;
default:
try{
var geom=this.parseGeometry(obj);
_b57.push(new OpenLayers.Feature.Vector(geom));
}
catch(err){
_b57=null;
OpenLayers.Console.error(err);
}
}
break;
}
}
}
}
return _b57;
},isValidType:function(obj,type){
var _b5d=false;
switch(type){
case "Geometry":
if(OpenLayers.Util.indexOf(["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon","Box","GeometryCollection"],obj.type)==-1){
OpenLayers.Console.error("Unsupported geometry type: "+obj.type);
}else{
_b5d=true;
}
break;
case "FeatureCollection":
_b5d=true;
break;
default:
if(obj.type==type){
_b5d=true;
}else{
OpenLayers.Console.error("Cannot convert types from "+obj.type+" to "+type);
}
}
return _b5d;
},parseFeature:function(obj){
var _b5f,geometry,attributes;
attributes=(obj.properties)?obj.properties:{};
try{
geometry=this.parseGeometry(obj.geometry);
}
catch(err){
throw err;
}
_b5f=new OpenLayers.Feature.Vector(geometry,attributes);
if(obj.id){
_b5f.fid=obj.id;
}
return _b5f;
},parseGeometry:function(obj){
var _b61;
if(obj.type=="GeometryCollection"){
if(!(obj.geometries instanceof Array)){
throw "GeometryCollection must have geometries array: "+obj;
}
var _b62=obj.geometries.length;
var _b63=new Array(_b62);
for(var i=0;i<_b62;++i){
_b63[i]=this.parseGeometry.apply(this,[obj.geometries[i]]);
}
_b61=new OpenLayers.Geometry.Collection(_b63);
}else{
if(!(obj.coordinates instanceof Array)){
throw "Geometry must have coordinates array: "+obj;
}
if(!this.parseCoords[obj.type.toLowerCase()]){
throw "Unsupported geometry type: "+obj.type;
}
try{
_b61=this.parseCoords[obj.type.toLowerCase()].apply(this,[obj.coordinates]);
}
catch(err){
throw err;
}
}
if(this.internalProjection&&this.externalProjection){
_b61.transform(this.externalProjection,this.internalProjection);
}
return _b61;
},parseCoords:{"point":function(_b65){
if(_b65.length!=2){
throw "Only 2D points are supported: "+_b65;
}
return new OpenLayers.Geometry.Point(_b65[0],_b65[1]);
},"multipoint":function(_b66){
var _b67=[];
var p=null;
for(var i=0;i<_b66.length;++i){
try{
p=this.parseCoords["point"].apply(this,[_b66[i]]);
}
catch(err){
throw err;
}
_b67.push(p);
}
return new OpenLayers.Geometry.MultiPoint(_b67);
},"linestring":function(_b6a){
var _b6b=[];
var p=null;
for(var i=0;i<_b6a.length;++i){
try{
p=this.parseCoords["point"].apply(this,[_b6a[i]]);
}
catch(err){
throw err;
}
_b6b.push(p);
}
return new OpenLayers.Geometry.LineString(_b6b);
},"multilinestring":function(_b6e){
var _b6f=[];
var l=null;
for(var i=0;i<_b6e.length;++i){
try{
l=this.parseCoords["linestring"].apply(this,[_b6e[i]]);
}
catch(err){
throw err;
}
_b6f.push(l);
}
return new OpenLayers.Geometry.MultiLineString(_b6f);
},"polygon":function(_b72){
var _b73=[];
var r,l;
for(var i=0;i<_b72.length;++i){
try{
l=this.parseCoords["linestring"].apply(this,[_b72[i]]);
}
catch(err){
throw err;
}
r=new OpenLayers.Geometry.LinearRing(l.components);
_b73.push(r);
}
return new OpenLayers.Geometry.Polygon(_b73);
},"multipolygon":function(_b76){
var _b77=[];
var p=null;
for(var i=0;i<_b76.length;++i){
try{
p=this.parseCoords["polygon"].apply(this,[_b76[i]]);
}
catch(err){
throw err;
}
_b77.push(p);
}
return new OpenLayers.Geometry.MultiPolygon(_b77);
},"box":function(_b7a){
if(_b7a.length!=2){
throw "GeoJSON box coordinates must have 2 elements";
}
return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(_b7a[0][0],_b7a[0][1]),new OpenLayers.Geometry.Point(_b7a[1][0],_b7a[0][1]),new OpenLayers.Geometry.Point(_b7a[1][0],_b7a[1][1]),new OpenLayers.Geometry.Point(_b7a[0][0],_b7a[1][1]),new OpenLayers.Geometry.Point(_b7a[0][0],_b7a[0][1])])]);
}},write:function(obj,_b7c){
var _b7d={"type":null};
if(obj instanceof Array){
_b7d.type="FeatureCollection";
var _b7e=obj.length;
_b7d.features=new Array(_b7e);
for(var i=0;i<_b7e;++i){
var _b80=obj[i];
if(!_b80 instanceof OpenLayers.Feature.Vector){
var msg="FeatureCollection only supports collections "+"of features: "+_b80;
throw msg;
}
_b7d.features[i]=this.extract.feature.apply(this,[_b80]);
}
}else{
if(obj.CLASS_NAME.indexOf("OpenLayers.Geometry")==0){
_b7d=this.extract.geometry.apply(this,[obj]);
}else{
if(obj instanceof OpenLayers.Feature.Vector){
_b7d=this.extract.feature.apply(this,[obj]);
if(obj.layer&&obj.layer.projection){
_b7d.crs=this.createCRSObject(obj);
}
}
}
}
return OpenLayers.Format.JSON.prototype.write.apply(this,[_b7d,_b7c]);
},createCRSObject:function(_b82){
var proj=_b82.layer.projection.toString();
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
},extract:{"feature":function(_b86){
var geom=this.extract.geometry.apply(this,[_b86.geometry]);
return {"type":"Feature","id":_b86.fid==null?_b86.id:_b86.fid,"properties":_b86.attributes,"geometry":geom};
},"geometry":function(_b88){
if(this.internalProjection&&this.externalProjection){
_b88=_b88.clone();
_b88.transform(this.internalProjection,this.externalProjection);
}
var _b89=_b88.CLASS_NAME.split(".")[2];
var data=this.extract[_b89.toLowerCase()].apply(this,[_b88]);
var json;
if(_b89=="Collection"){
json={"type":"GeometryCollection","geometries":data};
}else{
json={"type":_b89,"coordinates":data};
}
return json;
},"point":function(_b8c){
return [_b8c.x,_b8c.y];
},"multipoint":function(_b8d){
var _b8e=[];
for(var i=0;i<_b8d.components.length;++i){
_b8e.push(this.extract.point.apply(this,[_b8d.components[i]]));
}
return _b8e;
},"linestring":function(_b90){
var _b91=[];
for(var i=0;i<_b90.components.length;++i){
_b91.push(this.extract.point.apply(this,[_b90.components[i]]));
}
return _b91;
},"multilinestring":function(_b93){
var _b94=[];
for(var i=0;i<_b93.components.length;++i){
_b94.push(this.extract.linestring.apply(this,[_b93.components[i]]));
}
return _b94;
},"polygon":function(_b96){
var _b97=[];
for(var i=0;i<_b96.components.length;++i){
_b97.push(this.extract.linestring.apply(this,[_b96.components[i]]));
}
return _b97;
},"multipolygon":function(_b99){
var _b9a=[];
for(var i=0;i<_b99.components.length;++i){
_b9a.push(this.extract.polygon.apply(this,[_b99.components[i]]));
}
return _b9a;
},"collection":function(_b9c){
var len=_b9c.components.length;
var _b9e=new Array(len);
for(var i=0;i<len;++i){
_b9e[i]=this.extract.geometry.apply(this,[_b9c.components[i]]);
}
return _b9e;
}},CLASS_NAME:"OpenLayers.Format.GeoJSON"});
OpenLayers.Format.GeoRSS=OpenLayers.Class(OpenLayers.Format.XML,{rssns:"http://backend.userland.com/rss2",featureNS:"http://mapserver.gis.umn.edu/mapserver",georssns:"http://www.georss.org/georss",geons:"http://www.w3.org/2003/01/geo/wgs84_pos#",featureTitle:"Untitled",featureDescription:"No Description",gmlParser:null,xy:false,initialize:function(_ba0){
OpenLayers.Format.XML.prototype.initialize.apply(this,[_ba0]);
},createGeometryFromItem:function(item){
var _ba2=this.getElementsByTagNameNS(item,this.georssns,"point");
var lat=this.getElementsByTagNameNS(item,this.geons,"lat");
var lon=this.getElementsByTagNameNS(item,this.geons,"long");
var line=this.getElementsByTagNameNS(item,this.georssns,"line");
var _ba6=this.getElementsByTagNameNS(item,this.georssns,"polygon");
var _ba7=this.getElementsByTagNameNS(item,this.georssns,"where");
if(_ba2.length>0||(lat.length>0&&lon.length>0)){
var _ba8;
if(_ba2.length>0){
_ba8=OpenLayers.String.trim(_ba2[0].firstChild.nodeValue).split(/\s+/);
if(_ba8.length!=2){
_ba8=OpenLayers.String.trim(_ba2[0].firstChild.nodeValue).split(/\s*,\s*/);
}
}else{
_ba8=[parseFloat(lat[0].firstChild.nodeValue),parseFloat(lon[0].firstChild.nodeValue)];
}
var _ba9=new OpenLayers.Geometry.Point(parseFloat(_ba8[1]),parseFloat(_ba8[0]));
}else{
if(line.length>0){
var _baa=OpenLayers.String.trim(line[0].firstChild.nodeValue).split(/\s+/);
var _bab=[];
var _ba2;
for(var i=0;i<_baa.length;i+=2){
_ba2=new OpenLayers.Geometry.Point(parseFloat(_baa[i+1]),parseFloat(_baa[i]));
_bab.push(_ba2);
}
_ba9=new OpenLayers.Geometry.LineString(_bab);
}else{
if(_ba6.length>0){
var _baa=OpenLayers.String.trim(_ba6[0].firstChild.nodeValue).split(/\s+/);
var _bab=[];
var _ba2;
for(var i=0;i<_baa.length;i+=2){
_ba2=new OpenLayers.Geometry.Point(parseFloat(_baa[i+1]),parseFloat(_baa[i]));
_bab.push(_ba2);
}
_ba9=new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(_bab)]);
}else{
if(_ba7.length>0){
if(!this.gmlParser){
this.gmlParser=new OpenLayers.Format.GML({"xy":this.xy});
}
var _bad=this.gmlParser.parseFeature(_ba7[0]);
_ba9=_bad.geometry;
}
}
}
}
if(this.internalProjection&&this.externalProjection){
_ba9.transform(this.externalProjection,this.internalProjection);
}
return _ba9;
},createFeatureFromItem:function(item){
var _baf=this.createGeometryFromItem(item);
var _bb0=this.getChildValue(item,"*","title",this.featureTitle);
var _bb1=this.getChildValue(item,"*","description",this.getChildValue(item,"*","content",this.featureDescription));
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
var data={"title":_bb0,"description":_bb1,"link":link};
var _bb5=new OpenLayers.Feature.Vector(_baf,data);
_bb5.fid=id;
return _bb5;
},getChildValue:function(node,_bb7,name,def){
var _bba;
try{
_bba=this.getElementsByTagNameNS(node,_bb7,name)[0].firstChild.nodeValue;
}
catch(e){
_bba=(def==undefined)?"":def;
}
return _bba;
},read:function(doc){
if(typeof doc=="string"){
doc=OpenLayers.Format.XML.prototype.read.apply(this,[doc]);
}
var _bbc=null;
_bbc=this.getElementsByTagNameNS(doc,"*","item");
if(_bbc.length==0){
_bbc=this.getElementsByTagNameNS(doc,"*","entry");
}
var _bbd=_bbc.length;
var _bbe=new Array(_bbd);
for(var i=0;i<_bbd;i++){
_bbe[i]=this.createFeatureFromItem(_bbc[i]);
}
return _bbe;
},write:function(_bc0){
var _bc1;
if(_bc0 instanceof Array){
_bc1=this.createElementNS(this.rssns,"rss");
for(var i=0;i<_bc0.length;i++){
_bc1.appendChild(this.createFeatureXML(_bc0[i]));
}
}else{
_bc1=this.createFeatureXML(_bc0);
}
return OpenLayers.Format.XML.prototype.write.apply(this,[_bc1]);
},createFeatureXML:function(_bc3){
var _bc4=this.buildGeometryNode(_bc3.geometry);
var _bc5=this.createElementNS(this.rssns,"item");
var _bc6=this.createElementNS(this.rssns,"title");
_bc6.appendChild(this.createTextNode(_bc3.attributes.title?_bc3.attributes.title:""));
var _bc7=this.createElementNS(this.rssns,"description");
_bc7.appendChild(this.createTextNode(_bc3.attributes.description?_bc3.attributes.description:""));
_bc5.appendChild(_bc6);
_bc5.appendChild(_bc7);
if(_bc3.attributes.link){
var _bc8=this.createElementNS(this.rssns,"link");
_bc8.appendChild(this.createTextNode(_bc3.attributes.link));
_bc5.appendChild(_bc8);
}
for(var attr in _bc3.attributes){
if(attr=="link"||attr=="title"||attr=="description"){
continue;
}
var _bca=this.createTextNode(_bc3.attributes[attr]);
var _bcb=attr;
if(attr.search(":")!=-1){
_bcb=attr.split(":")[1];
}
var _bcc=this.createElementNS(this.featureNS,"feature:"+_bcb);
_bcc.appendChild(_bca);
_bc5.appendChild(_bcc);
}
_bc5.appendChild(_bc4);
return _bc5;
},buildGeometryNode:function(_bcd){
if(this.internalProjection&&this.externalProjection){
_bcd=_bcd.clone();
_bcd.transform(this.internalProjection,this.externalProjection);
}
var node;
if(_bcd.CLASS_NAME=="OpenLayers.Geometry.Polygon"){
node=this.createElementNS(this.georssns,"georss:polygon");
node.appendChild(this.buildCoordinatesNode(_bcd.components[0]));
}else{
if(_bcd.CLASS_NAME=="OpenLayers.Geometry.LineString"){
node=this.createElementNS(this.georssns,"georss:line");
node.appendChild(this.buildCoordinatesNode(_bcd));
}else{
if(_bcd.CLASS_NAME=="OpenLayers.Geometry.Point"){
node=this.createElementNS(this.georssns,"georss:point");
node.appendChild(this.buildCoordinatesNode(_bcd));
}else{
throw "Couldn't parse "+_bcd.CLASS_NAME;
}
}
}
return node;
},buildCoordinatesNode:function(_bcf){
var _bd0=null;
if(_bcf.components){
_bd0=_bcf.components;
}
var path;
if(_bd0){
var _bd2=_bd0.length;
var _bd3=new Array(_bd2);
for(var i=0;i<_bd2;i++){
_bd3[i]=_bd0[i].y+" "+_bd0[i].x;
}
path=_bd3.join(" ");
}else{
path=_bcf.y+" "+_bcf.x;
}
return this.createTextNode(path);
},CLASS_NAME:"OpenLayers.Format.GeoRSS"});
OpenLayers.Format.KML=OpenLayers.Class(OpenLayers.Format.GML,{kmlns:"http://earth.google.com/kml/2.2",placemarksDesc:"No description available",foldersName:"OpenLayers export",foldersDesc:"Exported on "+new Date(),extractAttributes:true,reverseFeatures:true,internalns:"*",gmlns:"*",features:[],styles:{},loadedKML:{},initialize:function(_bd5){
this.regExes={trimSpace:(/^\s*|\s*$/g),removeSpace:(/\s*/g),splitSpace:(/\s+/),trimComma:(/\s*,\s*/g)};
OpenLayers.Format.GML.prototype.initialize.apply(this,[_bd5]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);
}
var _bd7=this.getElementsByTagNameNS(data,"*","ServiceException")[0];
if(_bd7){
var code=_bd7.getAttribute("code");
var _bd9="";
if(code){
_bd9+=code+"\n";
}
_bd9+=OpenLayers.Util.getXmlNodeValue(_bd7).replace(this.regExes.trimSpace,"");
alert(_bd9);
return false;
}
var _bda=this.getElementsByTagNameNS(data,"*","Url");
var _bdb=_bda.length;
var urls=new Array(_bdb);
for(var i=0;i<_bdb;i++){
var _bde=this.getElementsByTagNameNS(_bda[i],"*","href")[0];
if(_bde){
var href=OpenLayers.Util.getXmlNodeValue(_bde);
if(this.loadedKML[href]){
continue;
}
if(OpenLayers.ProxyHost&&OpenLayers.String.startsWith(href,"http")){
href=OpenLayers.ProxyHost+escape(href);
}
var _be0=new OpenLayers.Ajax.Request(href,{method:"get",asynchronous:false});
this.loadedKML[href]=true;
if(_be0&&_be0.transport){
this.read(_be0.transport.responseText);
}
}
}
var _be1=this.getElementsByTagNameNS(data,"*","Link");
var _be2=_be1.length;
var _be3=new Array(_be2);
for(var i=0;i<_be2;i++){
var _bde=this.getElementsByTagNameNS(_be1[i],"*","href")[0];
if(_bde){
var href=OpenLayers.Util.getXmlNodeValue(_bde);
if(this.loadedKML[href]){
continue;
}
if(OpenLayers.ProxyHost&&OpenLayers.String.startsWith(href,"http")){
href=OpenLayers.ProxyHost+escape(href);
}
var _be0=new OpenLayers.Ajax.Request(href,{method:"get",asynchronous:false});
this.loadedKML[href]=true;
if(_be0&&_be0.transport){
this.read(_be0.transport.responseText);
}
}
}
this.readStyles(data);
var _be4=this.getElementsByTagNameNS(data,this.internalns,"Placemark");
var _be5=_be4.length;
var _be6=new Array(_be5);
for(var i=0;i<_be5;i++){
var _be7=_be4[i];
var _be8=OpenLayers.Format.GML.prototype.parseFeature.apply(this,[_be7]);
if(_be8){
_be8.style=OpenLayers.Util.extend({},OpenLayers.Feature.Vector.style["default"]);
if(_be8.attributes.styleUrl){
var _be9=this.getStyle(_be8.attributes.styleUrl);
if(_be9){
_be8.style=OpenLayers.Util.extend(_be8.style,_be9);
}
}
var _bea=this.getElementsByTagNameNS(_be7,"*","Style")[0];
if(_bea){
var _beb=this.parseStyle(_bea);
if(_beb){
_be8.style=OpenLayers.Util.extend(_be8.style,_beb);
}
}
_be6[i]=_be8;
}else{
throw "Bad Placemark: "+i;
}
}
this.features=this.features.concat(_be6);
if(this.reverseFeatures){
this.features.reverse();
}
return this.features;
},getStyle:function(_bec){
var _bed=OpenLayers.Util.removeTail(_bec);
if(!this.styles[_bec]&&!OpenLayers.String.startsWith(_bec,"#")&&!this.loadedKML[_bed]){
var href=_bed;
if(OpenLayers.String.startsWith(_bec,"http")){
href=OpenLayers.ProxyHost+escape(_bed);
}
var _bef=new OpenLayers.Ajax.Request(href,{method:"get",asynchronous:false});
if(_bef&&_bef.transport){
this.loadedKML[_bed]=true;
var data=_bef.transport.responseText;
if(typeof data=="string"){
data=OpenLayers.Format.XML.prototype.read.apply(this,[data]);
}
if(data){
this.readStyles(data,_bed);
}
}
}
var _bf1=this.styles[_bec];
return _bf1;
},readStyles:function(data,_bf3){
if(!data){
return null;
}
if(this.counter>20){
return null;
}
var _bf4=this.getElementsByTagNameNS(data,"*","Style");
var _bf5=_bf4.length;
var _bf6={};
for(var i=0;i<_bf5;i++){
var _bf8=this.parseStyle(_bf4[i]);
if(_bf8){
styleName=(_bf3||"")+"#"+_bf8.name;
_bf6[styleName]=_bf8;
}else{
throw "Bad Placemark: "+i;
}
}
var _bf9=this.getElementsByTagNameNS(data,"*","StyleMap");
var _bf5=_bf9.length;
for(var i=0;i<_bf5;i++){
var node=_bf9[i];
var _bfb=this.getElementsByTagNameNS(node,"*","Pair");
var id=node.getAttribute("id");
for(var j=0;j<_bfb.length;j++){
pair=_bfb[j];
key=OpenLayers.Format.SLD.prototype.parseProperty(pair,"*","key");
styleUrl=OpenLayers.Format.SLD.prototype.parseProperty(pair,"*","styleUrl");
if(key=="normal"){
_bf6[(_bf3||"")+"#"+id]=_bf6[(_bf3||"")+styleUrl];
}
if(key=="highlight"){
}
}
}
OpenLayers.Util.extend(this.styles,_bf6);
},parseStyle:function(node){
var _bff={};
var _c00={};
var _c01=["LineStyle","PolyStyle","IconStyle","BalloonStyle"];
var type,nodeList,geometry,parser;
for(var i=0;i<_c01.length;++i){
type=_c01[i];
styleTypeNode=this.getElementsByTagNameNS(node,this.internalns,type)[0];
if(styleTypeNode){
switch(type.toLowerCase()){
case "linestyle":
colorNode=this.getElementsByTagNameNS(styleTypeNode,"*","color")[0];
if(colorNode){
var _c04=(OpenLayers.Util.getXmlNodeValue(colorNode)).substring(0,2);
_c00["strokeOpacity"]=parseInt(_c04,16)/255;
var b=(OpenLayers.Util.getXmlNodeValue(colorNode)).substring(2,4);
var g=(OpenLayers.Util.getXmlNodeValue(colorNode)).substring(4,6);
var r=(OpenLayers.Util.getXmlNodeValue(colorNode)).substring(6,8);
_c00["strokeColor"]="#"+r+g+b;
}
widthNode=this.getElementsByTagNameNS(styleTypeNode,"*","width")[0];
if(widthNode){
_c00["strokeWidth"]=OpenLayers.Util.getXmlNodeValue(widthNode);
}
case "polystyle":
colorNode=this.getElementsByTagNameNS(styleTypeNode,"*","color")[0];
if(colorNode){
var _c04=(OpenLayers.Util.getXmlNodeValue(colorNode)).substring(0,2);
_c00["fillOpacity"]=parseInt(_c04,16)/255;
var b=(OpenLayers.Util.getXmlNodeValue(colorNode)).substring(2,4);
var g=(OpenLayers.Util.getXmlNodeValue(colorNode)).substring(4,6);
var r=(OpenLayers.Util.getXmlNodeValue(colorNode)).substring(6,8);
_c00["fillColor"]="#"+r+g+b;
}
break;
case "iconstyle":
iconNode=this.getElementsByTagNameNS(styleTypeNode,"*","Icon")[0];
_c00["graphicWidth"]=32;
_c00["graphicHeight"]=32;
if(iconNode){
hrefNode=this.getElementsByTagNameNS(iconNode,"*","href")[0];
if(hrefNode){
href=OpenLayers.Util.getXmlNodeValue(hrefNode);
matches=href.match(/root:\/\/icons\/palette-(\d+)(\.\w+)/);
if(matches){
var _c08=matches[1];
var _c09=matches[2];
var _c0a=this.getElementsByTagNameNS(iconNode,"*","x")[0];
var x=OpenLayers.Util.getXmlNodeValue(_c0a);
var _c0c=this.getElementsByTagNameNS(iconNode,"*","y")[0];
var y=OpenLayers.Util.getXmlNodeValue(_c0c);
var posX=x?x/32:0;
var posY=y?(7-y/32):7;
var pos=posY*8+posX;
href="http://maps.google.com/mapfiles/kml/pal"+_c08+"/icon"+pos+_c09;
}
var _c11=this.getElementsByTagNameNS(iconNode,"*","w")[0];
w=OpenLayers.Util.getXmlNodeValue(_c11);
var _c12=this.getElementsByTagNameNS(iconNode,"*","h")[0];
h=OpenLayers.Util.getXmlNodeValue(_c12);
if(w){
_c00["graphicWidth"]=parseInt(w);
}
if(h){
_c00["graphicHeight"]=parseInt(h);
}
_c00["graphicOpacity"]=1;
_c00["externalGraphic"]=href;
}
}
hotSpotNode=this.getElementsByTagNameNS(styleTypeNode,"*","hotSpot")[0];
if(false&&hotSpotNode){
var x=hotSpotNode.getAttribute("x");
var y=hotSpotNode.getAttribute("y");
var _c13=hotSpotNode.getAttribute("xunits");
if(_c13=="pixels"){
_c00["graphicXOffset"]=parseInt(x);
}else{
if(_c13=="insetPixels"){
_c00["graphicXOffset"]=_c00["graphicWidth"]-parseInt(x);
}else{
if(_c13=="fraction"){
_c00["graphicXOffset"]=_c00["graphicWidth"]*parseFloat(x);
}
}
}
var _c14=hotSpotNode.getAttribute("yunits");
if(_c14=="pixels"){
_c00["graphicYOffset"]=parseInt(y);
}else{
if(_c14=="insetPixels"){
_c00["graphicYOffset"]=_c00["graphicHeight"]-parseInt(y);
}else{
if(_c14=="fraction"){
_c00["graphicYOffset"]=_c00["graphicHeight"]*parseFloat(y);
}
}
}
}
break;
case "balloonstyle":
balloonStyle=OpenLayers.Util.getXmlNodeValue(styleTypeNode);
if(balloonStyle){
balloonStyle=balloonStyle.replace(/\$\[(.*?)\]/g,"${$1}");
_c00["balloonStyle"]=balloonStyle;
}
break;
default:
}
}
}
if(!_c00["strokeColor"]){
_c00["strokeColor"]=_c00["fillColor"];
}
var id=node.getAttribute("id");
if(!id){
id="generated_"+Math.floor(Math.random()*100000);
}
_c00["name"]=id;
return _c00;
},parseAttributes:function(node){
var _c17={};
var _c18,grandchildren,grandchild;
var _c19=node.childNodes;
for(var i=0;i<_c19.length;++i){
_c18=_c19[i];
if(_c18.nodeType==1){
grandchildren=_c18.childNodes;
if(grandchildren.length==1||grandchildren.length==3){
var _c1b;
switch(grandchildren.length){
case 1:
_c1b=grandchildren[0];
break;
case 3:
default:
_c1b=grandchildren[1];
break;
}
if(_c1b.nodeType==3||_c1b.nodeType==4){
var name=(_c18.prefix)?_c18.nodeName.split(":")[1]:_c18.nodeName;
if(_c1b.textContent){
var _c1d=_c1b.textContent.replace(this.regExes.trimSpace,"");
_c17[name]=_c1d;
}
}
}
}
}
return _c17;
},write:function(_c1e){
if(!(_c1e instanceof Array)){
_c1e=[_c1e];
}
var kml=this.createElementNS(this.kmlns,"kml");
var _c20=this.createFolderXML();
for(var i=0;i<_c1e.length;++i){
_c20.appendChild(this.createPlacemarkXML(_c1e[i]));
}
kml.appendChild(_c20);
return OpenLayers.Format.XML.prototype.write.apply(this,[kml]);
},createFolderXML:function(){
var _c22=this.createElementNS(this.kmlns,"name");
var _c23=this.createTextNode(this.foldersName);
_c22.appendChild(_c23);
var _c24=this.createElementNS(this.kmlns,"description");
var _c25=this.createTextNode(this.foldersDesc);
_c24.appendChild(_c25);
var _c26=this.createElementNS(this.kmlns,"Folder");
_c26.appendChild(_c22);
_c26.appendChild(_c24);
return _c26;
},createPlacemarkXML:function(_c27){
var _c28=this.createElementNS(this.kmlns,"name");
var name=(_c27.attributes.name)?_c27.attributes.name:_c27.id;
_c28.appendChild(this.createTextNode(name));
var _c2a=this.createElementNS(this.kmlns,"description");
var desc=(_c27.attributes.description)?_c27.attributes.description:this.placemarksDesc;
_c2a.appendChild(this.createTextNode(desc));
var _c2c=this.createElementNS(this.kmlns,"Placemark");
if(_c27.fid!=null){
_c2c.setAttribute("id",_c27.fid);
}
_c2c.appendChild(_c28);
_c2c.appendChild(_c2a);
var _c2d=this.buildGeometryNode(_c27.geometry);
_c2c.appendChild(_c2d);
return _c2c;
},CLASS_NAME:"OpenLayers.Format.KML"});
OpenLayers.Geometry.LinearRing=OpenLayers.Class(OpenLayers.Geometry.LineString,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_c2e){
OpenLayers.Geometry.LineString.prototype.initialize.apply(this,arguments);
},addComponent:function(_c2f,_c30){
var _c31=false;
var _c32=this.components.pop();
if(_c30!=null||!_c2f.equals(_c32)){
_c31=OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,arguments);
}
var _c33=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_c33]);
return _c31;
},removeComponent:function(_c34){
if(this.components.length>4){
this.components.pop();
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
var _c35=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_c35]);
}
},move:function(x,y){
for(var i=0;i<this.components.length-1;i++){
this.components[i].move(x,y);
}
},rotate:function(_c39,_c3a){
for(var i=0;i<this.components.length-1;++i){
this.components[i].rotate(_c39,_c3a);
}
},resize:function(_c3c,_c3d,_c3e){
for(var i=0;i<this.components.length-1;++i){
this.components[i].resize(_c3c,_c3d,_c3e);
}
},transform:function(_c40,dest){
if(_c40&&dest){
for(var i=0;i<this.components.length-1;i++){
var _c43=this.components[i];
_c43.transform(_c40,dest);
}
}
return this;
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
},containsPoint:function(_c49){
var _c4a=OpenLayers.Number.limitSigDigs;
var digs=14;
var px=_c4a(_c49.x,digs);
var py=_c4a(_c49.y,digs);
function getX(y,x1,y1,x2,y2){
return (((x1-x2)*y)+((x2*y1)-(x1*y2)))/(y1-y2);
}
var _c53=this.components.length-1;
var _c54,end,x1,y1,x2,y2,cx,cy;
var _c55=0;
for(var i=0;i<_c53;++i){
_c54=this.components[i];
x1=_c4a(_c54.x,digs);
y1=_c4a(_c54.y,digs);
end=this.components[i+1];
x2=_c4a(end.x,digs);
y2=_c4a(end.y,digs);
if(y1==y2){
if(py==y1){
if(x1<=x2&&(px>=x1&&px<=x2)||x1>=x2&&(px<=x1&&px>=x2)){
_c55=-1;
break;
}
}
continue;
}
cx=_c4a(getX(py,x1,y1,x2,y2),digs);
if(cx==px){
if(y1<y2&&(py>=y1&&py<=y2)||y1>y2&&(py<=y1&&py>=y2)){
_c55=-1;
break;
}
}
if(cx<=px){
continue;
}
if(x1!=x2&&(cx<Math.min(x1,x2)||cx>Math.max(x1,x2))){
continue;
}
if(y1<y2&&(py>=y1&&py<y2)||y1>y2&&(py<y1&&py>=y2)){
++_c55;
}
}
var _c57=(_c55==-1)?1:!!(_c55&1);
return _c57;
},intersects:function(_c58){
var _c59=false;
if(_c58.CLASS_NAME=="OpenLayers.Geometry.Point"){
_c59=this.containsPoint(_c58);
}else{
if(_c58.CLASS_NAME=="OpenLayers.Geometry.LineString"){
_c59=_c58.intersects(this);
}else{
if(_c58.CLASS_NAME=="OpenLayers.Geometry.LinearRing"){
_c59=OpenLayers.Geometry.LineString.prototype.intersects.apply(this,[_c58]);
}else{
for(var i=0;i<_c58.components.length;++i){
_c59=_c58.components[i].intersects(this);
if(_c59){
break;
}
}
}
}
}
return _c59;
},CLASS_NAME:"OpenLayers.Geometry.LinearRing"});
OpenLayers.Handler.Path=OpenLayers.Class(OpenLayers.Handler.Point,{line:null,freehand:false,freehandToggle:"shiftKey",initialize:function(_c5b,_c5c,_c5d){
OpenLayers.Handler.Point.prototype.initialize.apply(this,arguments);
},createFeature:function(){
this.line=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString());
this.point=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point());
},destroyFeature:function(){
OpenLayers.Handler.Point.prototype.destroyFeature.apply(this);
if(this.line){
this.line.destroy();
}
this.line=null;
},addPoint:function(){
this.line.geometry.addComponent(this.point.geometry.clone(),this.line.geometry.components.length);
this.callback("point",[this.point.geometry]);
},freehandMode:function(evt){
return (this.freehandToggle&&evt[this.freehandToggle])?!this.freehand:this.freehand;
},modifyFeature:function(){
var _c5f=this.line.geometry.components.length-1;
this.line.geometry.components[_c5f].x=this.point.geometry.x;
this.line.geometry.components[_c5f].y=this.point.geometry.y;
this.line.geometry.components[_c5f].clearBounds();
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
var _c61=this.control.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_c61.lon;
this.point.geometry.y=_c61.lat;
if((this.lastUp==null)||!this.lastUp.equals(evt.xy)){
this.addPoint();
}
this.drawFeature();
this.drawing=true;
return false;
},mousemove:function(evt){
if(this.drawing){
var _c63=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_c63.lon;
this.point.geometry.y=_c63.lat;
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
var _c66=this.line.geometry.components.length-1;
this.line.geometry.removeComponent(this.line.geometry.components[_c66]);
this.finalize();
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Path"});
OpenLayers.Format.WFS=OpenLayers.Class(OpenLayers.Format.GML,{layer:null,wfsns:"http://www.opengis.net/wfs",initialize:function(_c67,_c68){
OpenLayers.Format.GML.prototype.initialize.apply(this,[_c67]);
this.layer=_c68;
if(this.layer.featureNS){
this.featureNS=this.layer.featureNS;
}
if(this.layer.options.geometry_column){
this.geometryName=this.layer.options.geometry_column;
}
if(this.layer.options.typename){
this.featureName=this.layer.options.typename;
}
},write:function(_c69){
var _c6a=document.createElementNS("http://www.opengis.net/wfs","wfs:Transaction");
_c6a.setAttribute("version","1.0.0");
_c6a.setAttribute("service","WFS");
for(var i=0;i<_c69.length;i++){
switch(_c69[i].state){
case OpenLayers.State.INSERT:
_c6a.appendChild(this.insert(_c69[i]));
break;
case OpenLayers.State.UPDATE:
_c6a.appendChild(this.update(_c69[i]));
break;
case OpenLayers.State.DELETE:
_c6a.appendChild(this.remove(_c69[i]));
break;
}
}
return _c6a;
},createFeatureXML:function(_c6c){
var _c6d=this.buildGeometryNode(_c6c.geometry);
var _c6e=document.createElementNS(this.featureNS,"feature:"+this.geometryName);
_c6e.appendChild(_c6d);
var _c6f=document.createElementNS(this.featureNS,"feature:"+this.featureName);
_c6f.appendChild(_c6e);
for(var attr in _c6c.attributes){
var _c71=document.createTextNode(_c6c.attributes[attr]);
var _c72=attr;
if(attr.search(":")!=-1){
_c72=attr.split(":")[1];
}
var _c73=document.createElementNS(this.featureNS,"feature:"+_c72);
_c73.appendChild(_c71);
_c6f.appendChild(_c73);
}
return _c6f;
},insert:function(_c74){
var _c75=document.createElementNS(this.wfsns,"wfs:Insert");
_c75.appendChild(this.createFeatureXML(_c74));
return _c75;
},update:function(_c76){
if(!_c76.fid){
alert("Can't update a feature for which there is no FID.");
}
var _c77=document.createElementNS(this.wfsns,"wfs:Update");
_c77.setAttribute("typeName",this.layerName);
var _c78=document.createElementNS(this.wfsns,"wfs:Property");
var _c79=document.createElementNS("http://www.opengis.net/wfs","wfs:Name");
var _c7a=document.createTextNode(this.geometryName);
_c79.appendChild(_c7a);
_c78.appendChild(_c79);
var _c7b=document.createElementNS("http://www.opengis.net/wfs","wfs:Value");
_c7b.appendChild(this.buildGeometryNode(_c76.geometry));
_c78.appendChild(_c7b);
_c77.appendChild(_c78);
var _c7c=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _c7d=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_c7d.setAttribute("fid",_c76.fid);
_c7c.appendChild(_c7d);
_c77.appendChild(_c7c);
return _c77;
},remove:function(_c7e){
if(!_c7e.fid){
alert("Can't delete a feature for which there is no FID.");
return false;
}
var _c7f=document.createElementNS(this.featureNS,"wfs:Delete");
_c7f.setAttribute("typeName",this.layerName);
var _c80=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _c81=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_c81.setAttribute("fid",_c7e.fid);
_c80.appendChild(_c81);
_c7f.appendChild(_c80);
return _c7f;
},destroy:function(){
this.layer=null;
},CLASS_NAME:"OpenLayers.Format.WFS"});
OpenLayers.Handler.Polygon=OpenLayers.Class(OpenLayers.Handler.Path,{polygon:null,initialize:function(_c82,_c83,_c84){
OpenLayers.Handler.Path.prototype.initialize.apply(this,arguments);
},createFeature:function(){
this.polygon=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon());
this.line=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LinearRing());
this.polygon.geometry.addComponent(this.line.geometry);
this.point=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point());
},destroyFeature:function(){
OpenLayers.Handler.Path.prototype.destroyFeature.apply(this);
if(this.polygon){
this.polygon.destroy();
}
this.polygon=null;
},modifyFeature:function(){
var _c85=this.line.geometry.components.length-2;
this.line.geometry.components[_c85].x=this.point.geometry.x;
this.line.geometry.components[_c85].y=this.point.geometry.y;
this.line.geometry.components[_c85].clearBounds();
},drawFeature:function(){
this.layer.drawFeature(this.polygon,this.style);
this.layer.drawFeature(this.point,this.style);
},geometryClone:function(){
return this.polygon.geometry.clone();
},dblclick:function(evt){
if(!this.freehandMode(evt)){
var _c87=this.line.geometry.components.length-2;
this.line.geometry.removeComponent(this.line.geometry.components[_c87]);
this.finalize();
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Polygon"});
OpenLayers.Control.EditingToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(_c88,_c89){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_c89]);
this.addControls([new OpenLayers.Control.Navigation()]);
var _c8a=[new OpenLayers.Control.DrawFeature(_c88,OpenLayers.Handler.Point,{"displayClass":"olControlDrawFeaturePoint"}),new OpenLayers.Control.DrawFeature(_c88,OpenLayers.Handler.Path,{"displayClass":"olControlDrawFeaturePath"}),new OpenLayers.Control.DrawFeature(_c88,OpenLayers.Handler.Polygon,{"displayClass":"olControlDrawFeaturePolygon"})];
for(var i=0;i<_c8a.length;i++){
_c8a[i].featureAdded=function(_c8c){
_c8c.state=OpenLayers.State.INSERT;
};
}
this.addControls(_c8a);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.EditingToolbar"});

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

Proj4js={defaultDatum:"WGS84",proxyScript:null,defsLookupService:"http://spatialreference.org/ref",libPath:"../lib/",transform:function(_1,_2,_3){
if(!_1.readyToUse||!_2.readyToUse){
this.reportError("Proj4js initialization for "+_1.srsCode+" not yet complete");
return;
}
if(_3.transformed){
this.log("point already transformed");
return;
}
if(_1.projName=="longlat"){
_3.x*=Proj4js.common.D2R;
_3.y*=Proj4js.common.D2R;
}else{
if(_1.to_meter){
_3.x*=_1.to_meter;
_3.y*=_1.to_meter;
}
_1.inverse(_3);
}
if(_1.from_greenwich){
_3.x+=_1.from_greenwich;
}
_3=this.datum_transform(_1.datum,_2.datum,_3);
if(_2.from_greenwich){
_3.x-=_2.from_greenwich;
}
if(_2.projName=="longlat"){
_3.x*=Proj4js.common.R2D;
_3.y*=Proj4js.common.R2D;
}else{
_2.forward(_3);
if(_2.to_meter){
_3.x/=_2.to_meter;
_3.y/=_2.to_meter;
}
}
_3.transformed=true;
return _3;
},datum_transform:function(_4,_5,_6){
if(_4.compare_datums(_5)){
return _6;
}
if(_4.datum_type==Proj4js.common.PJD_GRIDSHIFT){
alert("ERROR: Grid shift transformations are not implemented yet.");
}
if(_5.datum_type==Proj4js.common.PJD_GRIDSHIFT){
alert("ERROR: Grid shift transformations are not implemented yet.");
}
if(_4.datum_type==Proj4js.common.PJD_3PARAM||_4.datum_type==Proj4js.common.PJD_7PARAM||_5.datum_type==Proj4js.common.PJD_3PARAM||_5.datum_type==Proj4js.common.PJD_7PARAM){
_4.geodetic_to_geocentric(_6);
if(_4.datum_type==Proj4js.common.PJD_3PARAM||_4.datum_type==Proj4js.common.PJD_7PARAM){
_4.geocentric_to_wgs84(_6);
}
if(_5.datum_type==Proj4js.common.PJD_3PARAM||_5.datum_type==Proj4js.common.PJD_7PARAM){
_5.geocentric_from_wgs84(_6);
}
_5.geocentric_to_geodetic(_6);
}
if(_5.datum_type==Proj4js.common.PJD_GRIDSHIFT){
alert("ERROR: Grid shift transformations are not implemented yet.");
}
return _6;
},reportError:function(_7){
},log:function(_8){
},loadProjDefinition:function(_9){
if(this.defs[_9.srsCode]){
return this.defs[_9.srsCode];
}
var _a={method:"get",asynchronous:false,onSuccess:this.defsLoadedFromDisk.bind(this,_9.srsCode)};
var _b=this.libPath+"defs/"+_9.srsAuth.toUpperCase()+_9.srsProjNumber+".js";
new OpenLayers.Ajax.Request(_b,_a);
if(this.defs[_9.srsCode]){
return this.defs[_9.srsCode];
}
var _b=this.proxyScript+this.defsLookupService+"/"+_9.srsAuth+"/"+_9.srsProjNumber+"/proj4";
_a.onSuccess=this.defsLoadedFromService.bind(this,_9.srsCode);
_a.onFailure=this.defsFailed.bind(this,_9.srsCode);
new OpenLayers.Ajax.Request(_b,_a);
if(this.defs[_9.srsCode]){
return this.defs[_9.srsCode];
}
return null;
},defsLoadedFromDisk:function(_c,_d){
eval(_d.responseText);
},defsLoadedFromService:function(_e,_f){
this.defs[_e]=_f.responseText;
},defsFailed:function(_10){
this.reportError("failed to load projection definition for: "+_10);
OpenLayers.Util.extend(this.defs[_10],this.defs["WGS84"]);
},loadProjCode:function(_11){
if(this.Proj[_11]){
return;
}
var _12={method:"get",asynchronous:false,onSuccess:this.loadProjCodeSuccess.bind(this,_11),onFailure:this.loadProjCodeFailure.bind(this,_11)};
var url=this.libPath+"projCode/"+_11+".js";
new OpenLayers.Ajax.Request(url,_12);
},loadProjCodeSuccess:function(_14,_15){
eval(_15.responseText);
if(this.Proj[_14].dependsOn){
this.loadProjCode(this.Proj[_14].dependsOn);
}
},loadProjCodeFailure:function(_16){
Proj4js.reportError("failed to find projection file for: "+_16);
}};
Proj4js.Proj=OpenLayers.Class({readyToUse:false,title:null,projName:null,units:null,datum:null,initialize:function(_17){
this.srsCode=_17.toUpperCase();
if(this.srsCode.indexOf("EPSG")==0){
this.srsCode=this.srsCode;
this.srsAuth="epsg";
this.srsProjNumber=this.srsCode.substring(5);
}else{
this.srsAuth="";
this.srsProjNumber=this.srsCode;
}
this.datum=new Proj4js.datum();
var _18=Proj4js.loadProjDefinition(this);
if(_18){
this.parseDefs(_18);
Proj4js.loadProjCode(this.projName);
this.callInit();
}
},callInit:function(){
Proj4js.log("projection script loaded for:"+this.projName);
OpenLayers.Util.extend(this,Proj4js.Proj[this.projName]);
this.init();
this.mapXYToLonLat=this.inverse;
this.lonLatToMapXY=this.forward;
this.readyToUse=true;
},parseDefs:function(_19){
var def={data:_19};
var _1b,paramVal;
var _1c=def.data.split("+");
for(var _1d=0;_1d<_1c.length;_1d++){
var _1e=_1c[_1d].split("=");
_1b=_1e[0].toLowerCase();
paramVal=_1e[1];
switch(_1b.replace(/\s/gi,"")){
case "":
break;
case "title":
this.title=paramVal;
break;
case "proj":
this.projName=paramVal.replace(/\s/gi,"");
break;
case "units":
this.units=paramVal.replace(/\s/gi,"");
break;
case "datum":
this.datumName=paramVal.replace(/\s/gi,"");
break;
case "ellps":
this.ellps=paramVal.replace(/\s/gi,"");
break;
case "a":
this.a=parseFloat(paramVal);
break;
case "b":
this.b=parseFloat(paramVal);
break;
case "lat_0":
this.lat0=paramVal*Proj4js.common.D2R;
break;
case "lat_1":
this.lat1=paramVal*Proj4js.common.D2R;
break;
case "lat_2":
this.lat2=paramVal*Proj4js.common.D2R;
break;
case "lon_0":
this.long0=paramVal*Proj4js.common.D2R;
break;
case "x_0":
this.x0=parseFloat(paramVal);
break;
case "y_0":
this.y0=parseFloat(paramVal);
break;
case "k_0":
this.k0=parseFloat(paramVal);
break;
case "k":
this.k0=parseFloat(paramVal);
break;
case "R_A":
this.R=parseFloat(paramVal);
break;
case "zone":
this.zone=parseInt(paramVal);
break;
case "south":
this.utmSouth=true;
break;
case "towgs84":
this.datum_params=paramVal.split(",");
break;
case "to_meter":
this.to_meter=parseFloat(paramVal);
break;
case "from_greenwich":
this.from_greenwich=paramVal*Proj4js.common.D2R;
break;
case "pm":
paramVal=paramVal.replace(/\s/gi,"");
this.from_greenwich=Proj4js.PrimeMeridian[paramVal]?Proj4js.PrimeMeridian[paramVal]*Proj4js.common.D2R:0;
break;
case "no_defs":
break;
default:
Proj4js.log("Unrecognized parameter: "+_1b);
}
}
this.deriveConstants();
},deriveConstants:function(){
if(!this.a){
var _1f=Proj4js.Ellipsoid[this.ellps]?Proj4js.Ellipsoid[this.ellps]:Proj4js.Ellipsoid["WGS84"];
OpenLayers.Util.extend(this,_1f);
}
if(this.rf&&!this.b){
this.b=(1-1/this.rf)*this.a;
}
this.a2=this.a*this.a;
this.b2=this.b*this.b;
this.es=(this.a2-this.b2)/this.a2;
this.e=Math.sqrt(this.es);
this.ep2=(this.a2-this.b2)/this.b2;
this.datum=new Proj4js.datum(this);
}});
Proj4js.Proj.longlat={init:function(){
},forward:function(pt){
return pt;
},inverse:function(pt){
return pt;
}};
Proj4js.defs={"WGS84":"+title=long/lat:WGS84 +proj=longlat +ellps=WGS84 +datum=WGS84","EPSG:4326":"+title=long/lat:WGS84 +proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84","EPSG:4269":"+title=long/lat:NAD83 +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83"};
Proj4js.common={PI:Math.PI,HALF_PI:Math.PI*0.5,TWO_PI:Math.PI*2,FORTPI:0.7853981633974483,R2D:57.2957795131,D2R:0.0174532925199,SEC_TO_RAD:0.00000484813681109536,EPSLN:1e-10,MAX_ITER:20,COS_67P5:0.3826834323650898,AD_C:1.0026,PJD_UNKNOWN:0,PJD_3PARAM:1,PJD_7PARAM:2,PJD_GRIDSHIFT:3,PJD_WGS84:4,SRS_WGS84_SEMIMAJOR:6378137,msfnz:function(_22,_23,_24){
var con=_22*_23;
return _24/(Math.sqrt(1-con*con));
},tsfnz:function(_26,phi,_28){
var con=_26*_28;
var com=0.5*_26;
con=Math.pow(((1-con)/(1+con)),com);
return (Math.tan(0.5*(this.HALF_PI-phi))/con);
},phi2z:function(_2b,ts){
var _2d=0.5*_2b;
var con,dphi;
var phi=this.HALF_PI-2*Math.atan(ts);
for(i=0;i<=15;i++){
con=_2b*Math.sin(phi);
dphi=this.HALF_PI-2*Math.atan(ts*(Math.pow(((1-con)/(1+con)),_2d)))-phi;
phi+=dphi;
if(Math.abs(dphi)<=1e-10){
return phi;
}
}
alert("phi2z has NoConvergence");
return (-9999);
},qsfnz:function(_30,_31,_32){
var con;
if(_30>1e-7){
con=_30*_31;
return ((1-_30*_30)*(_31/(1-con*con)-(0.5/_30)*Math.log((1-con)/(1+con))));
}else{
return (2*_31);
}
},asinz:function(x){
x=(Math.abs(x)>1)?1:-1;
return (x);
},e0fn:function(x){
return (1-0.25*x*(1+x/16*(3+1.25*x)));
},e1fn:function(x){
return (0.375*x*(1+0.25*x*(1+0.46875*x)));
},e2fn:function(x){
return (0.05859375*x*x*(1+0.75*x));
},e3fn:function(x){
return (x*x*x*(35/3072));
},mlfn:function(e0,e1,e2,e3,phi){
return (e0*phi-e1*Math.sin(2*phi)+e2*Math.sin(4*phi)-e3*Math.sin(6*phi));
},srat:function(_3e,exp){
return (Math.pow((1-_3e)/(1+_3e),exp));
},sign:function(x){
if(x<0){
return (-1);
}else{
return (1);
}
},adjust_lon:function(x){
x=(Math.abs(x)<this.PI)?x:(x-(this.sign(x)*this.TWO_PI));
return x;
}};
Proj4js.datum=OpenLayers.Class({initialize:function(_42){
if(_42&&_42.datum_params){
for(var i=0;i<_42.datum_params.length;i++){
_42.datum_params[i]=parseFloat(_42.datum_params[i]);
}
if(_42.datum_params[0]!=0||_42.datum_params[1]!=0||_42.datum_params[2]!=0){
this.datum_type=Proj4js.common.PJD_3PARAM;
}
if(_42.datum_params.length>3){
if(_42.datum_params[3]!=0||_42.datum_params[4]!=0||_42.datum_params[5]!=0||_42.datum_params[6]!=0){
this.datum_type=Proj4js.common.PJD_7PARAM;
_42.datum_params[3]*=Proj4js.common.SEC_TO_RAD;
_42.datum_params[4]*=Proj4js.common.SEC_TO_RAD;
_42.datum_params[5]*=Proj4js.common.SEC_TO_RAD;
_42.datum_params[6]=(_42.datum_params[6]/1000000)+1;
}
}
}
if(!this.datum_type){
this.datum_type=Proj4js.common.PJD_WGS84;
}
if(_42){
this.a=_42.a;
this.b=_42.b;
this.es=_42.es;
this.ep2=_42.ep2;
this.datum_params=_42.datum_params;
}
},compare_datums:function(_44){
if(this.datum_type!=_44.datum_type){
return false;
}else{
if(this.datum_type==Proj4js.common.PJD_3PARAM){
return (this.datum_params[0]==_44.datum_params[0]&&this.datum_params[1]==_44.datum_params[1]&&this.datum_params[2]==_44.datum_params[2]);
}else{
if(this.datum_type==Proj4js.common.PJD_7PARAM){
return (this.datum_params[0]==_44.datum_params[0]&&this.datum_params[1]==_44.datum_params[1]&&this.datum_params[2]==_44.datum_params[2]&&this.datum_params[3]==_44.datum_params[3]&&this.datum_params[4]==_44.datum_params[4]&&this.datum_params[5]==_44.datum_params[5]&&this.datum_params[6]==_44.datum_params[6]);
}else{
if(this.datum_type==Proj4js.common.PJD_GRIDSHIFT){
return strcmp(pj_param(this.params,"snadgrids").s,pj_param(_44.params,"snadgrids").s)==0;
}else{
return true;
}
}
}
}
},geodetic_to_geocentric:function(p){
var _46=p.x;
var _47=p.y;
var _48=p.z?p.z:0;
var X;
var Y;
var Z;
var _4c=0;
var Rn;
var _4e;
var _4f;
var _50;
if(_47<-Proj4js.common.HALF_PI&&_47>-1.001*Proj4js.common.HALF_PI){
_47=-Proj4js.common.HALF_PI;
}else{
if(_47>Proj4js.common.HALF_PI&&_47<1.001*Proj4js.common.HALF_PI){
_47=Proj4js.common.HALF_PI;
}else{
if((_47<-Proj4js.common.HALF_PI)||(_47>Proj4js.common.HALF_PI)){
_4c|=GEOCENT_LAT_ERROR;
}
}
}
if(!_4c){
if(_46>Proj4js.common.PI){
_46-=(2*Proj4js.common.PI);
}
_4e=Math.sin(_47);
_50=Math.cos(_47);
_4f=_4e*_4e;
Rn=this.a/(Math.sqrt(1-this.es*_4f));
X=(Rn+_48)*_50*Math.cos(_46);
Y=(Rn+_48)*_50*Math.sin(_46);
Z=((Rn*(1-this.es))+_48)*_4e;
}
p.x=X;
p.y=Y;
p.z=Z;
return _4c;
},geocentric_to_geodetic:function(p){
var X=p.x;
var Y=p.y;
var Z=p.z;
var Z=p.z?p.z:0;
var _55;
var _56;
var _57;
var W;
var W2;
var T0;
var T1;
var S0;
var S1;
var _5e;
var _5f;
var _60;
var _61;
var _62;
var Rn;
var Sum;
var _65;
X=parseFloat(X);
Y=parseFloat(Y);
Z=parseFloat(Z);
_65=false;
if(X!=0){
_55=Math.atan2(Y,X);
}else{
if(Y>0){
_55=Proj4js.common.HALF_PI;
}else{
if(Y<0){
_55=-Proj4js.common.HALF_PI;
}else{
_65=true;
_55=0;
if(Z>0){
_56=Proj4js.common.HALF_PI;
}else{
if(Z<0){
_56=-Proj4js.common.HALF_PI;
}else{
_56=Proj4js.common.HALF_PI;
_57=-this.b;
return;
}
}
}
}
}
W2=X*X+Y*Y;
W=Math.sqrt(W2);
T0=Z*Proj4js.common.AD_C;
S0=Math.sqrt(T0*T0+W2);
_5e=T0/S0;
_60=W/S0;
_5f=_5e*_5e*_5e;
T1=Z+this.b*this.ep2*_5f;
Sum=W-this.a*this.es*_60*_60*_60;
S1=Math.sqrt(T1*T1+Sum*Sum);
_61=T1/S1;
_62=Sum/S1;
Rn=this.a/Math.sqrt(1-this.es*_61*_61);
if(_62>=Proj4js.common.COS_67P5){
_57=W/_62-Rn;
}else{
if(_62<=-Proj4js.common.COS_67P5){
_57=W/-_62-Rn;
}else{
_57=Z/_61+Rn*(this.es-1);
}
}
if(_65==false){
_56=Math.atan(_61/_62);
}
p.x=_55;
p.y=_56;
p.z=_57;
return p;
},geocentric_to_wgs84:function(p){
if(this.datum_type==Proj4js.common.PJD_3PARAM){
p.x+=this.datum_params[0];
p.y+=this.datum_params[1];
p.z+=this.datum_params[2];
}else{
var _67=this.datum_params[0];
var _68=this.datum_params[1];
var _69=this.datum_params[2];
var _6a=this.datum_params[3];
var _6b=this.datum_params[4];
var _6c=this.datum_params[5];
var _6d=this.datum_params[6];
var _6e=_6d*(p.x-_6c*p.y+_6b*p.z)+_67;
var _6f=_6d*(_6c*p.x+p.y-_6a*p.z)+_68;
var _70=_6d*(-_6b*p.x+_6a*p.y+p.z)+_69;
p.x=_6e;
p.y=_6f;
p.z=_70;
}
},geocentric_from_wgs84:function(p){
if(this.datum_type==Proj4js.common.PJD_3PARAM){
p.x-=this.datum_params[0];
p.y-=this.datum_params[1];
p.z-=this.datum_params[2];
}else{
var _72=this.datum_params[0];
var _73=this.datum_params[1];
var _74=this.datum_params[2];
var _75=this.datum_params[3];
var _76=this.datum_params[4];
var _77=this.datum_params[5];
var _78=this.datum_params[6];
var _79=(p.x-_72)/_78;
var _7a=(p.y-_73)/_78;
var _7b=(p.z-_74)/_78;
p.x=_79+_77*_7a-_76*_7b;
p.y=-_77*_79+_7a+_75*_7b;
p.z=_76*_79-_75*_7a+_7b;
}
}});
Proj4js.Point=OpenLayers.Class({initialize:function(x,y,z){
this.x=x;
this.y=y;
this.z=z||0;
},toString:function(){
return ("x="+this.x+",y="+this.y);
},toShortString:function(){
return (this.x+", "+this.y);
}});
Proj4js.PrimeMeridian={"greenwich":0,"lisbon":-9.131906111111,"paris":2.337229166667,"bogota":-74.080916666667,"madrid":-3.687938888889,"rome":12.452333333333,"bern":7.439583333333,"jakarta":106.807719444444,"ferro":-17.666666666667,"brussels":4.367975,"stockholm":18.058277777778,"athens":23.7163375,"oslo":10.722916666667};
Proj4js.Ellipsoid={"MERIT":{a:6378137,rf:298.257,ellipseName:"MERIT 1983"},"SGS85":{a:6378136,rf:298.257,ellipseName:"Soviet Geodetic System 85"},"GRS80":{a:6378137,rf:298.257222101,ellipseName:"GRS 1980(IUGG, 1980)"},"IAU76":{a:6378140,rf:298.257,ellipseName:"IAU 1976"},"airy":{a:6377563.396,b:6356256.91,ellipseName:"Airy 1830"},"APL4.":{a:6378137,rf:298.25,ellipseName:"Appl. Physics. 1965"},"NWL9D":{a:6378145,rf:298.25,ellipseName:"Naval Weapons Lab., 1965"},"mod_airy":{a:6377340.189,b:6356034.446,ellipseName:"Modified Airy"},"andrae":{a:6377104.43,rf:300,ellipseName:"Andrae 1876 (Den., Iclnd.)"},"aust_SA":{a:6378160,rf:298.25,ellipseName:"Australian Natl & S. Amer. 1969"},"GRS67":{a:6378160,rf:298.247167427,ellipseName:"GRS 67(IUGG 1967)"},"bessel":{a:6377397.155,rf:299.1528128,ellipseName:"Bessel 1841"},"bess_nam":{a:6377483.865,rf:299.1528128,ellipseName:"Bessel 1841 (Namibia)"},"clrk66":{a:6378206.4,b:6356583.8,ellipseName:"Clarke 1866"},"clrk80":{a:6378249.145,rf:293.4663,ellipseName:"Clarke 1880 mod."},"CPM":{a:6375738.7,rf:334.29,ellipseName:"Comm. des Poids et Mesures 1799"},"delmbr":{a:6376428,rf:311.5,ellipseName:"Delambre 1810 (Belgium)"},"engelis":{a:6378136.05,rf:298.2566,ellipseName:"Engelis 1985"},"evrst30":{a:6377276.345,rf:300.8017,ellipseName:"Everest 1830"},"evrst48":{a:6377304.063,rf:300.8017,ellipseName:"Everest 1948"},"evrst56":{a:6377301.243,rf:300.8017,ellipseName:"Everest 1956"},"evrst69":{a:6377295.664,rf:300.8017,ellipseName:"Everest 1969"},"evrstSS":{a:6377298.556,rf:300.8017,ellipseName:"Everest (Sabah & Sarawak)"},"fschr60":{a:6378166,rf:298.3,ellipseName:"Fischer (Mercury Datum) 1960"},"fschr60m":{a:6378155,rf:298.3,ellipseName:"Fischer 1960"},"fschr68":{a:6378150,rf:298.3,ellipseName:"Fischer 1968"},"helmert":{a:6378200,rf:298.3,ellipseName:"Helmert 1906"},"hough":{a:6378270,rf:297,ellipseName:"Hough"},"intl":{a:6378388,rf:297,ellipseName:"International 1909 (Hayford)"},"kaula":{a:6378163,rf:298.24,ellipseName:"Kaula 1961"},"lerch":{a:6378139,rf:298.257,ellipseName:"Lerch 1979"},"mprts":{a:6397300,rf:191,ellipseName:"Maupertius 1738"},"new_intl":{a:6378157.5,b:6356772.2,ellipseName:"New International 1967"},"plessis":{a:6376523,rf:6355863,ellipseName:"Plessis 1817 (France)"},"krass":{a:6378245,rf:298.3,ellipseName:"Krassovsky, 1942"},"SEasia":{a:6378155,b:6356773.3205,ellipseName:"Southeast Asia"},"walbeck":{a:6376896,b:6355834.8467,ellipseName:"Walbeck"},"WGS60":{a:6378165,rf:298.3,ellipseName:"WGS 60"},"WGS66":{a:6378145,rf:298.25,ellipseName:"WGS 66"},"WGS72":{a:6378135,rf:298.26,ellipseName:"WGS 72"},"WGS84":{a:6378137,rf:298.257223563,ellipseName:"WGS 84"},"sphere":{a:6370997,b:6370997,ellipseName:"Normal Sphere (r=6370997)"}};
Proj4js.Datum={"WGS84":{towgs84:"0,0,0",ellipse:"WGS84",datumName:""},"GGRS87":{towgs84:"-199.87,74.79,246.62",ellipse:"GRS80",datumName:"Greek_Geodetic_Reference_System_1987"},"NAD83":{towgs84:"0,0,0",ellipse:"GRS80",datumName:"North_American_Datum_1983"},"NAD27":{nadgrids:"@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",ellipse:"clrk66",datumName:"North_American_Datum_1927"},"potsdam":{towgs84:"606.0,23.0,413.0",ellipse:"bessel",datumName:"Potsdam Rauenberg 1950 DHDN"},"carthage":{towgs84:"-263.0,6.0,431.0",ellipse:"clark80",datumName:"Carthage 1934 Tunisia"},"hermannskogel":{towgs84:"653.0,-212.0,449.0",ellipse:"bessel",datumName:"Hermannskogel"},"ire65":{towgs84:"482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",ellipse:"mod_airy",datumName:"Ireland 1965"},"nzgd49":{towgs84:"59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",ellipse:"intl",datumName:"New Zealand Geodetic Datum 1949"},"OSGB36":{towgs84:"446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",ellipse:"airy",datumName:"Airy 1830"}};
Proj4js.WGS84=new Proj4js.Proj("WGS84");
Proj4js.Proj.sterea={dependsOn:"gauss",init:function(){
Proj4js.Proj["gauss"].init.apply(this);
if(!this.rc){
Proj4js.reportError("sterea:init:E_ERROR_0");
return;
}
this.sinc0=Math.sin(this.phic0);
this.cosc0=Math.cos(this.phic0);
this.R2=2*this.rc;
if(!this.title){
this.title="Oblique Stereographic Alternative";
}
},forward:function(p){
Proj4js.Proj["gauss"].forward.apply(this,[p]);
sinc=Math.sin(p.y);
cosc=Math.cos(p.y);
cosl=Math.cos(p.x);
k=this.k0*this.R2/(1+this.sinc0*sinc+this.cosc0*cosc*cosl);
p.x=k*cosc*Math.sin(p.x);
p.y=k*(this.cosc0*sinc-this.sinc0*cosc*cosl);
p.x=this.a*p.x+this.x0;
p.y=this.a*p.y+this.y0;
return p;
},inverse:function(p){
p.x=(p.x-this.x0)*this.a;
p.y=(p.y-this.y0)*this.a;
p.x/=this.k0;
p.y/=this.k0;
if((rho=Math.sqrt(p.x*p.x+p.y*p.y))){
c=2*Math.atan2(rho,this.R2);
sinc=Math.sin(c);
cosc=Math.cos(c);
p.y=Math.asin(cosc*this.sinc0+p.y*sinc*this.cosc0/rho);
p.x=Math.atan2(p.x*sinc,rho*this.cosc0*cosc-p.y*this.sinc0*sinc);
}else{
p.y=this.phic0;
p.x=0;
}
Proj4js.Proj["gauss"].inverse.apply(this,[p]);
return p;
}};
Proj4js.Proj.aea={init:function(){
if(Math.abs(this.lat1+this.lat2)<Proj4js.common.EPSLN){
Proj4js.reportError("aeaInitEqualLatitudes");
return;
}
this.temp=this.b/this.a;
this.es=1-Math.pow(this.temp,2);
this.e3=Math.sqrt(this.es);
this.sin_po=Math.sin(this.lat1);
this.cos_po=Math.cos(this.lat1);
this.t1=this.sin_po;
this.con=this.sin_po;
this.ms1=Proj4js.common.msfnz(this.e3,this.sin_po,this.cos_po);
this.qs1=Proj4js.common.qsfnz(this.e3,this.sin_po,this.cos_po);
this.sin_po=Math.sin(this.lat2);
this.cos_po=Math.cos(this.lat2);
this.t2=this.sin_po;
this.ms2=Proj4js.common.msfnz(this.e3,this.sin_po,this.cos_po);
this.qs2=Proj4js.common.qsfnz(this.e3,this.sin_po,this.cos_po);
this.sin_po=Math.sin(this.lat0);
this.cos_po=Math.cos(this.lat0);
this.t3=this.sin_po;
this.qs0=Proj4js.common.qsfnz(this.e3,this.sin_po,this.cos_po);
if(Math.abs(this.lat1-this.lat2)>Proj4js.common.EPSLN){
this.ns0=(this.ms1*this.ms1-this.ms2*this.ms2)/(this.qs2-this.qs1);
}else{
this.ns0=this.con;
}
this.c=this.ms1*this.ms1+this.ns0*this.qs1;
this.rh=this.a*Math.sqrt(this.c-this.ns0*this.qs0)/this.ns0;
},forward:function(p){
var lon=p.x;
var lat=p.y;
this.sin_phi=Math.sin(lat);
this.cos_phi=Math.cos(lat);
var qs=Proj4js.common.qsfnz(this.e3,this.sin_phi,this.cos_phi);
var rh1=this.a*Math.sqrt(this.c-this.ns0*qs)/this.ns0;
var _86=this.ns0*Proj4js.common.adjust_lon(lon-this.long0);
var x=rh1*Math.sin(_86)+this.y0;
var y=this.rh-rh1*Math.cos(_86)+this.x0;
p.x=x;
p.y=y;
return p;
},inverse:function(p){
var rh1,qs,con,theta,lon,lat;
p.x-=this.x0;
p.y=this.rh-p.y+this.y0;
if(this.ns0>=0){
rh1=Math.sqrt(p.x*p.x+p.y*p.y);
con=1;
}else{
rh1=-Math.sqrt(p.x*p.x+p.y*p.y);
con=-1;
}
theta=0;
if(rh1!=0){
theta=Math.atan2(con*p.x,con*p.y);
}
con=rh1*this.ns0/this.a;
qs=(this.c-con*con)/this.ns0;
if(this.e3>=1e-10){
con=1-0.5*(1-this.es)*Math.log((1-this.e3)/(1+this.e3))/this.e3;
if(Math.abs(Math.abs(con)-Math.abs(qs))>1e-10){
lat=Proj4js.common.phi1z(this.e3,qs);
}else{
if(qs>=0){
lat=0.5*PI;
}else{
lat=-0.5*PI;
}
}
}else{
lat=Proj4js.common.phi1z(e3,qs);
}
lon=Proj4js.common.adjust_lon(theta/this.ns0+this.long0);
p.x=lon*Proj4js.common.R2D;
p.y=lat*Proj4js.common.R2D;
return p;
}};
function phi4z(_8b,e0,e1,e2,e3,a,b,c,phi){
var _94,sin2ph,tanph,ml,mlp,con1,con2,con3,dphi,i;
phi=a;
for(i=1;i<=15;i++){
_94=Math.sin(phi);
tanphi=Math.tan(phi);
c=tanphi*Math.sqrt(1-_8b*_94*_94);
sin2ph=Math.sin(2*phi);
ml=e0*phi-e1*sin2ph+e2*Math.sin(4*phi)-e3*Math.sin(6*phi);
mlp=e0-2*e1*Math.cos(2*phi)+4*e2*Math.cos(4*phi)-6*e3*Math.cos(6*phi);
con1=2*ml+c*(ml*ml+b)-2*a*(c*ml+1);
con2=_8b*sin2ph*(ml*ml+b-2*a*ml)/(2*c);
con3=2*(a-ml)*(c*mlp-2/sin2ph)-2*mlp;
dphi=con1/(con2+con3);
phi+=dphi;
if(Math.abs(dphi)<=1e-10){
return (phi);
}
}
Proj4js.reportError("phi4z: No convergence");
return null;
}
function e4fn(x){
var con,com;
con=1+x;
com=1-x;
return (Math.sqrt((Math.pow(con,con))*(Math.pow(com,com))));
}
Proj4js.Proj.poly={init:function(){
var _97;
if(this.lat0=0){
this.lat0=90;
}
this.temp=this.b/this.a;
this.es=1-Math.pow(this.temp,2);
this.e=Math.sqrt(this.es);
this.e0=Proj4js.common.e0fn(this.es);
this.e1=Proj4js.common.e1fn(this.es);
this.e2=Proj4js.common.e2fn(this.es);
this.e3=Proj4js.common.e3fn(this.es);
this.ml0=Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,this.lat0);
},forward:function(p){
var _99,cosphi;
var al;
var c;
var con,ml;
var ms;
var x,y;
var lon=p.x;
var lat=p.y;
con=Proj4js.common.adjust_lon(lon-this.long0);
if(Math.abs(lat)<=1e-7){
x=this.x0+this.a*con;
y=this.y0-this.a*this.ml0;
}else{
_99=Math.sin(lat);
cosphi=Math.cos(lat);
ml=Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,lat);
ms=Proj4js.common.msfnz(this.e,_99,cosphi);
con=_99;
x=this.x0+this.a*ms*Math.sin(con)/_99;
y=this.y0+this.a*(ml-this.ml0+ms*(1-Math.cos(con))/_99);
}
p.x=x;
p.y=y;
return p;
},inverse:function(p){
var _a2,cos_phi;
var al;
var b;
var c;
var con,ml;
var _a7;
var lon,lat;
p.x-=this.x0;
p.y-=this.y0;
al=this.ml0+p.y/this.a;
_a7=0;
if(Math.abs(al)<=1e-7){
lon=p.x/this.a+this.long0;
lat=0;
}else{
b=al*al+(p.x/this.a)*(p.x/this.a);
_a7=phi4z(this.es,this.e0,this.e1,this.e2,this.e3,this.al,b,c,lat);
if(_a7!=1){
return (_a7);
}
lon=Proj4js.common.adjust_lon((asinz(p.x*c/this.a)/Math.sin(lat))+this.long0);
}
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.equi={init:function(){
if(!this.x0){
this.x0=0;
}
if(!this.y0){
this.y0=0;
}
if(!this.lat0){
this.lat0=0;
}
if(!this.long0){
this.long0=0;
}
},forward:function(p){
var lon=p.x;
var lat=p.y;
var _ac=Proj4js.common.adjust_lon(lon-this.long0);
var x=this.x0+this.a*_ac*Math.cos(this.lat0);
var y=this.y0+this.a*lat;
this.t1=x;
this.t2=Math.cos(this.lat0);
p.x=x;
p.y=y;
return p;
},inverse:function(p){
p.x-=this.x0;
p.y-=this.y0;
var lat=p.y/this.a;
if(Math.abs(lat)>Proj4js.common.HALF_PI){
Proj4js.reportError("equi:Inv:DataError");
}
var lon=Proj4js.common.adjust_lon(this.long0+p.x/(this.a*Math.cos(this.lat0)));
p.x=lon;
p.y=lat;
}};
Proj4js.defs["EPSG:900913"]="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
Proj4js.Proj.utm={dependsOn:"tmerc",init:function(){
if(!this.zone){
Proj4js.reportError("utm:init: zone must be specified for UTM");
return;
}
this.lat0=0;
this.long0=((6*Math.abs(this.zone))-183)*Proj4js.common.D2R;
this.x0=500000;
this.y0=this.utmSouth?10000000:0;
if(!this.k0){
this.k0=0.9996;
}
Proj4js.Proj["tmerc"].init.apply(this);
this.forward=Proj4js.Proj["tmerc"].forward;
this.inverse=Proj4js.Proj["tmerc"].inverse;
}};
Proj4js.Proj.eqdc={init:function(){
if(!this.mode){
this.mode=0;
}
this.temp=this.b/this.a;
this.es=1-Math.pow(this.temp,2);
this.e=Math.sqrt(this.es);
this.e0=Proj4js.common.e0fn(this.es);
this.e1=Proj4js.common.e1fn(this.es);
this.e2=Proj4js.common.e2fn(this.es);
this.e3=Proj4js.common.e3fn(this.es);
this.sinphi=Math.sin(this.lat1);
this.cosphi=Math.cos(this.lat1);
this.ms1=Proj4js.common.msfnz(this.e,this.sinphi,this.cosphi);
this.ml1=Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,this.lat1);
if(this.mode!=0){
if(Math.abs(this.lat1+this.lat2)<Proj4js.common.EPSLN){
Proj4js.reportError("eqdc:Init:EqualLatitudes");
}
this.sinphi=Math.sin(this.lat2);
this.cosphi=Math.cos(this.lat2);
this.ms2=Proj4js.common.msfnz(this.e,this.sinphi,this.cosphi);
this.ml2=Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,this.lat2);
if(Math.abs(this.lat1-this.lat2)>=Proj4js.common.EPSLN){
this.ns=(this.ms1-this.ms2)/(this.ml2-this.ml1);
}else{
this.ns=this.sinphi;
}
}else{
this.ns=this.sinphi;
}
this.g=this.ml1+this.ms1/this.ns;
this.ml0=Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,this.lat0);
this.rh=this.a*(this.g-this.ml0);
},forward:function(p){
var lon=p.x;
var lat=p.y;
var ml=Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,lat);
var rh1=this.a*(this.g-ml);
var _b7=this.ns*Proj4js.common.adjust_lon(lon-this.long0);
this.t1=Proj4js.common.adjust_lon(lon-this.long0);
this.t2=_b7;
var x=this.x0+rh1*Math.sin(_b7);
var y=this.y0+this.rh-rh1*Math.cos(_b7);
p.x=x;
p.y=y;
return p;
},inverse:function(p){
p.x-=this.x0;
p.y=this.rh-p.y+this.y0;
if(this.ns>=0){
var rh1=Math.sqrt(p.x*p.x+p.y*p.y);
var con=1;
}else{
rh1=-Math.sqrt(p.x*p.x+p.y*p.y);
con=-1;
}
var _bd=0;
if(rh1!=0){
_bd=Math.atan2(con*p.x,con*p.y);
}
var ml=this.g-rh1/this.a;
var lat=Proj4js.common.phi3z(this.ml,this.e0,this.e1,this.e2,this.e3);
var lon=Proj4js.common.adjust_lon(this.long0+_bd/this.ns);
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.tmerc={init:function(){
this.e0=Proj4js.common.e0fn(this.es);
this.e1=Proj4js.common.e1fn(this.es);
this.e2=Proj4js.common.e2fn(this.es);
this.e3=Proj4js.common.e3fn(this.es);
this.ml0=this.a*Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,this.lat0);
this.ind=(this.es<0.00001)?1:0;
},forward:function(p){
var lon=p.x;
var lat=p.y;
if(lat<=90&&lat>=-90&&lon<=180&&lon>=-180){
}else{
Proj4js.reportError("lcc:forward: llInputOutOfRange: "+lon+" : "+lat);
return null;
}
var _c4=Proj4js.common.adjust_lon(lon-this.long0);
var con;
var x,y;
var _c7=Math.sin(lat);
var _c8=Math.cos(lat);
if(this.ind!=0){
var b=_c8*Math.sin(_c4);
if((Math.abs(Math.abs(b)-1))<1e-10){
Proj4js.reportError("tmerc:forward: Point projects into infinity");
return (93);
}else{
x=0.5*this.a*this.k0*Math.log((1+b)/(1-b));
con=Math.acos(_c8*Math.cos(_c4)/Math.sqrt(1-b*b));
if(lat<0){
con=-con;
}
y=this.a*this.k0*(con-this.lat0);
}
}else{
var al=_c8*_c4;
var als=Math.pow(al,2);
var c=this.ep2*Math.pow(_c8,2);
var tq=Math.tan(lat);
var t=Math.pow(tq,2);
con=1-this.es*Math.pow(_c7,2);
var n=this.a/Math.sqrt(con);
var ml=this.a*Proj4js.common.mlfn(this.e0,this.e1,this.e2,this.e3,lat);
x=this.k0*n*al*(1+als/6*(1-t+c+als/20*(5-18*t+Math.pow(t,2)+72*c-58*this.ep2)))+this.x0;
y=this.k0*(ml-this.ml0+n*tq*(als*(0.5+als/24*(5-t+9*c+4*Math.pow(c,2)+als/30*(61-58*t+Math.pow(t,2)+600*c-330*this.ep2)))))+this.y0;
}
p.x=x;
p.y=y;
return p;
},inverse:function(p){
var con,phi;
var _d3;
var i;
var _d5=6;
var lat,lon;
if(this.ind!=0){
var f=Math.exp(p.x/(this.a*this.k0));
var g=0.5*(f-1/f);
var _d9=this.lat0+p.y/(this.a*this.k0);
var h=Math.cos(_d9);
con=Math.sqrt((1-h*h)/(1+g*g));
lat=Math.asinz(con);
if(_d9<0){
lat=-lat;
}
if((g==0)&&(h==0)){
lon=this.long0;
}else{
lon=Proj4js.common.adjust_lon(Math.atan2(g,h)+this.long0);
}
}else{
var x=p.x-this.x0;
var y=p.y-this.y0;
con=(this.ml0+y/this.k0)/this.a;
phi=con;
for(i=0;;i++){
_d3=((con+this.e1*Math.sin(2*phi)-this.e2*Math.sin(4*phi)+this.e3*Math.sin(6*phi))/this.e0)-phi;
phi+=_d3;
if(Math.abs(_d3)<=Proj4js.common.EPSLN){
break;
}
if(i>=_d5){
Proj4js.reportError("tmerc:inverse: Latitude failed to converge");
return (95);
}
}
if(Math.abs(phi)<Proj4js.common.HALF_PI){
var _dd=Math.sin(phi);
var _de=Math.cos(phi);
var _df=Math.tan(phi);
var c=this.ep2*Math.pow(_de,2);
var cs=Math.pow(c,2);
var t=Math.pow(_df,2);
var ts=Math.pow(t,2);
con=1-this.es*Math.pow(_dd,2);
var n=this.a/Math.sqrt(con);
var r=n*(1-this.es)/con;
var d=x/(n*this.k0);
var ds=Math.pow(d,2);
lat=phi-(n*_df*ds/r)*(0.5-ds/24*(5+3*t+10*c-4*cs-9*this.ep2-ds/30*(61+90*t+298*c+45*ts-252*this.ep2-3*cs)));
lon=Proj4js.common.adjust_lon(this.long0+(d*(1-ds/6*(1+2*t+c-ds/20*(5-2*c+28*t-3*cs+8*this.ep2+24*ts)))/_de));
}else{
lat=Proj4js.common.HALF_PI*Proj4js.common.sign(y);
lon=this.long0;
}
}
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.ortho={init:function(def){
this.sin_p14=Math.sin(this.lat0);
this.cos_p14=Math.cos(this.lat0);
},forward:function(p){
var _ea,cosphi;
var _eb;
var _ec;
var ksp;
var g;
var lon=p.x;
var lat=p.y;
_eb=Proj4js.common.adjust_lon(lon-this.long0);
_ea=Math.sin(lat);
cosphi=Math.cos(lat);
_ec=Math.cos(_eb);
g=this.sin_p14*_ea+this.cos_p14*cosphi*_ec;
ksp=1;
if((g>0)||(Math.abs(g)<=Proj4js.common.EPSLN)){
var x=this.a*ksp*cosphi*Math.sin(_eb);
var y=this.y0+this.a*ksp*(this.cos_p14*_ea-this.sin_p14*cosphi*_ec);
}else{
Proj4js.reportError("orthoFwdPointError");
}
p.x=x;
p.y=y;
return p;
},inverse:function(p){
var rh;
var z;
var _f6,cosz;
var _f7;
var con;
var lon,lat;
p.x-=this.x0;
p.y-=this.y0;
rh=Math.sqrt(p.x*p.x+p.y*p.y);
if(rh>this.a+1e-7){
Proj4js.reportError("orthoInvDataError");
}
z=Proj4js.common.asinz(rh/this.a);
_f6=Math.sin(z);
cosi=Math.cos(z);
lon=this.long0;
if(Math.abs(rh)<=Proj4js.common.EPSLN){
lat=this.lat0;
}
lat=Proj4js.common.asinz(cosz*this.sin_p14+(y*_f6*this.cos_p14)/rh);
con=Math.abs(lat0)-Proj4js.common.HALF_PI;
if(Math.abs(con)<=Proj4js.common.EPSLN){
if(this.lat0>=0){
lon=Proj4js.common.adjust_lon(this.long0+Math.atan2(p.x,-p.y));
}else{
lon=Proj4js.common.adjust_lon(this.long0-Math.atan2(-p.x,p.y));
}
}
con=cosz-this.sin_p14*Math.sin(lat);
if((Math.abs(con)>=Proj4js.common.EPSLN)||(Math.abs(x)>=Proj4js.common.EPSLN)){
lon=Proj4js.common.adjust_lon(this.long0+Math.atan2((p.x*_f6*this.cos_p14),(con*rh)));
}
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.merc={init:function(){
this.temp=this.b/this.a;
this.es=1-Math.sqrt(this.temp);
this.e=Math.sqrt(this.es);
this.m1=Math.cos(0)/(Math.sqrt(1-this.es*Math.sin(0)*Math.sin(0)));
},forward:function(p){
lon=p.x;
lat=p.y;
if(lat*Proj4js.common.R2D>90&&lat*Proj4js.common.R2D<-90&&lon*Proj4js.common.R2D>180&&lon*Proj4js.common.R2D<-180){
Proj4js.reportError("merc:forward: llInputOutOfRange: "+lon+" : "+lat);
return null;
}else{
}
if(Math.abs(Math.abs(lat)-Proj4js.common.HALF_PI)<=Proj4js.common.EPSLN){
alert(mbGetMessage("ll2mAtPoles"));
Proj4js.reportError("merc:forward: ll2mAtPoles");
return null;
}else{
var _fb=Math.sin(lat);
var ts=Proj4js.common.tsfnz(this.e,lat,_fb);
var x=this.x0+this.a*this.m1*Proj4js.common.adjust_lon(lon-this.long0);
var y=this.y0-this.a*this.m1*Math.log(ts);
p.x=x;
p.y=y;
return p;
}
},inverse:function(p){
var x=p.x-this.x0;
var y=p.y-this.y0;
var ts=Math.exp(-y/(this.a*this.m1));
var lat=Proj4js.common.phi2z(this.e,ts);
if(lat==-9999){
Proj4js.reportError("merc:inverse: lat = -9999");
return null;
}
var lon=Proj4js.common.adjust_lon(this.long0+x/(this.a*this.m1));
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.stere={init:function(){
this.sin_p10=Math.sin(this.lat0);
this.cos_p10=Math.cos(this.lat0);
},forward:function(p){
var lon=p.x;
var lat=p.y;
var ksp;
if(lat<=90&&lat>=-90&&lon<=180&&lon>=-180){
}else{
Proj4js.reportError("stere:forward:llInputOutOfRange",lon,lat);
return null;
}
var dlon=Proj4js.common.adjust_lon(lon-this.long0);
var _10a=Math.sin(lat);
var _10b=Math.cos(lat);
var _10c=Math.cos(dlon);
var g=this.sin_p10*_10a+this.cos_p10*_10b*_10c;
if(Math.abs(g+1)<=Proj4js.common.EPSLN){
Proj4js.reportError("stere:forward:ll2stInfiniteProjection");
return null;
}else{
ksp=2/(1+g);
var x=this.x0+this.a*ksp*_10b*Math.sin(dlon);
var y=this.y0+this.a*ksp*(this.cos_p10*_10a-this.sin_p10*_10b*_10c);
}
return new Proj4js.Point(x,y);
},inverse:function(p){
var x=(p.x-this.x0);
var y=(p.y-this.y0);
var rh=Math.sqrt(x*x+y*y);
var z=2*Math.atan(rh/(2*this.a));
var sinz=Math.sin(z);
var cosz=Math.cos(z);
var lat;
var lon=this.long0;
if(Math.abs(rh)<=Proj4js.common.EPSLN){
lat=this.lat0;
}else{
lat=Math.asin(cosz*this.sin_p10+(y*sinz*this.cos_p10)/rh);
var con=Math.abs(this.lat0)-Proj4js.common.HALF_PI;
if(Math.abs(con)<=Proj4js.common.EPSLN){
if(this.lat0>=0){
lon=Proj4js.common.adjust_lon(this.long0+Math.atan2(x,-y));
}else{
lon=adjust_lon(this.long0-Math.atan2(-x,y));
}
}else{
con=cosz-this.sin_p10*Math.sin(lat);
if((Math.abs(con)<Proj4js.common.EPSLN)&&(Math.abs(x)<Proj4js.common.EPSLN)){
}else{
lon=Proj4js.common.adjust_lon(this.long0+Math.atan2((x*sinz*this.cos_p10),(con*rh)));
}
}
}
return new Proj4js.Point(lon,lat);
}};
Proj4js.Proj.mill={init:function(){
},forward:function(p){
var lon=p.x;
var lat=p.y;
dlon=Proj4js.common.adjust_lon(lon-this.long0);
var x=this.x0+this.R*dlon;
var y=this.y0+this.R*Math.log(Math.tan((Proj4js.common.PI/4)+(lat/2.5)))*1.25;
p.x=x;
p.y=y;
return p;
},inverse:function(p){
p.x-=this.x0;
p.y-=this.y0;
var lon=Proj4js.common.adjust_lon(this.long0+p.x/this.R);
var lat=2.5*(Math.atan(Math.exp(p.y/this.R/1.25))-Proj4js.common.PI/4);
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.sinu={init:function(){
this.R=6370997;
},forward:function(p){
var x,y,delta_lon;
var lon=p.x;
var lat=p.y;
delta_lon=Proj4js.common.adjust_lon(lon-this.long0);
x=this.R*delta_lon*Math.cos(lat)+this.x0;
y=this.R*lat+this.y0;
p.x=x;
p.y=y;
return p;
},inverse:function(p){
var lat,temp,lon;
p.x-=this.x0;
p.y-=this.y0;
lat=p.y/this.R;
if(Math.abs(lat)>Proj4js.common.HALF_PI){
Proj4js.reportError("sinu:Inv:DataError");
}
temp=Math.abs(lat)-Proj4js.common.HALF_PI;
if(Math.abs(temp)>Proj4js.common.EPSLN){
temp=this.long0+p.x/(this.R*Math.cos(lat));
lon=Proj4js.common.adjust_lon(temp);
}else{
lon=this.long0;
}
p.x=lon;
p.y=lat;
return p;
}};
var GEOCENT_LAT_ERROR=1;
var COS_67P5=0.3826834323650898;
var AD_C=1.0026;
function cs_geodetic_to_geocentric(cs,p){
var _12a=p.x;
var _12b=p.y;
var _12c=p.z;
var X;
var Y;
var Z;
var _130=0;
var Rn;
var _132;
var _133;
var _134;
if(_12b<-HALF_PI&&_12b>-1.001*HALF_PI){
_12b=-HALF_PI;
}else{
if(_12b>HALF_PI&&_12b<1.001*HALF_PI){
_12b=HALF_PI;
}else{
if((_12b<-HALF_PI)||(_12b>HALF_PI)){
_130|=GEOCENT_LAT_ERROR;
}
}
}
if(!_130){
if(_12a>PI){
_12a-=(2*PI);
}
_132=Math.sin(_12b);
_134=Math.cos(_12b);
_133=_132*_132;
Rn=cs.a/(Math.sqrt(1-cs.es*_133));
X=(Rn+_12c)*_134*Math.cos(_12a);
Y=(Rn+_12c)*_134*Math.sin(_12a);
Z=((Rn*(1-cs.es))+_12c)*_132;
}
p.x=X;
p.y=Y;
p.z=Z;
return _130;
}
function cs_geocentric_to_geodetic(cs,p){
var X=p.x;
var Y=p.y;
var Z=p.z;
var _13a;
var _13b;
var _13c;
var W;
var W2;
var T0;
var T1;
var S0;
var S1;
var _143;
var _144;
var _145;
var _146;
var _147;
var Rn;
var Sum;
var _14a;
X=parseFloat(X);
Y=parseFloat(Y);
Z=parseFloat(Z);
_14a=false;
if(X!=0){
_13a=Math.atan2(Y,X);
}else{
if(Y>0){
_13a=HALF_PI;
}else{
if(Y<0){
_13a=-HALF_PI;
}else{
_14a=true;
_13a=0;
if(Z>0){
_13b=HALF_PI;
}else{
if(Z<0){
_13b=-HALF_PI;
}else{
_13b=HALF_PI;
_13c=-cs.b;
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
_143=T0/S0;
_145=W/S0;
_144=_143*_143*_143;
T1=Z+cs.b*cs.ep2*_144;
Sum=W-cs.a*cs.es*_145*_145*_145;
S1=Math.sqrt(T1*T1+Sum*Sum);
_146=T1/S1;
_147=Sum/S1;
Rn=cs.a/Math.sqrt(1-cs.es*_146*_146);
if(_147>=COS_67P5){
_13c=W/_147-Rn;
}else{
if(_147<=-COS_67P5){
_13c=W/-_147-Rn;
}else{
_13c=Z/_146+Rn*(cs.es-1);
}
}
if(_14a==false){
_13b=Math.atan(_146/_147);
}
p.x=_13a;
p.y=_13b;
p.z=_13c;
return 0;
}
function cs_geocentric_to_wgs84(defn,p){
if(defn.datum_type==PJD_3PARAM){
p.x+=defn.datum_params[0];
p.y+=defn.datum_params[1];
p.z+=defn.datum_params[2];
}else{
var _14d=defn.datum_params[0];
var _14e=defn.datum_params[1];
var _14f=defn.datum_params[2];
var _150=defn.datum_params[3];
var _151=defn.datum_params[4];
var _152=defn.datum_params[5];
var M_BF=defn.datum_params[6];
var _154=M_BF*(p.x-_152*p.y+_151*p.z)+_14d;
var _155=M_BF*(_152*p.x+p.y-_150*p.z)+_14e;
var _156=M_BF*(-_151*p.x+_150*p.y+p.z)+_14f;
p.x=_154;
p.y=_155;
p.z=_156;
}
}
function cs_geocentric_from_wgs84(defn,p){
if(defn.datum_type==PJD_3PARAM){
p.x-=defn.datum_params[0];
p.y-=defn.datum_params[1];
p.z-=defn.datum_params[2];
}else{
var _159=defn.datum_params[0];
var _15a=defn.datum_params[1];
var _15b=defn.datum_params[2];
var _15c=defn.datum_params[3];
var _15d=defn.datum_params[4];
var _15e=defn.datum_params[5];
var M_BF=defn.datum_params[6];
var _160=(p.x-_159)/M_BF;
var _161=(p.y-_15a)/M_BF;
var _162=(p.z-_15b)/M_BF;
p.x=_160+_15e*_161-_15d*_162;
p.y=-_15e*_160+_161+_15c*_162;
p.z=_15d*_160-_15c*_161+_162;
}
}
Proj4js.Proj.vandg={init:function(){
this.R=6370997;
},forward:function(p){
var lon=p.x;
var lat=p.y;
var dlon=Proj4js.common.adjust_lon(lon-this.long0);
var x,y;
if(Math.abs(lat)<=Proj4js.common.EPSLN){
x=this.x0+this.R*dlon;
y=this.y0;
}
var _168=Proj4js.common.asinz(2*Math.abs(lat/Proj4js.common.PI));
if((Math.abs(dlon)<=Proj4js.common.EPSLN)||(Math.abs(Math.abs(lat)-Proj4js.common.HALF_PI)<=Proj4js.common.EPSLN)){
x=this.x0;
if(lat>=0){
y=this.y0+Proj4js.common.PI*this.R*Math.tan(0.5*_168);
}else{
y=this.y0+Proj4js.common.PI*this.R*-Math.tan(0.5*_168);
}
}
var al=0.5*Math.abs((Proj4js.common.PI/dlon)-(dlon/Proj4js.common.PI));
var asq=al*al;
var _16b=Math.sin(_168);
var _16c=Math.cos(_168);
var g=_16c/(_16b+_16c-1);
var gsq=g*g;
var m=g*(2/_16b-1);
var msq=m*m;
var con=Proj4js.common.PI*this.R*(al*(g-msq)+Math.sqrt(asq*(g-msq)*(g-msq)-(msq+asq)*(gsq-msq)))/(msq+asq);
if(dlon<0){
con=-con;
}
x=this.x0+con;
con=Math.abs(con/(Proj4js.common.PI*this.R));
if(lat>=0){
y=this.y0+Proj4js.common.PI*this.R*Math.sqrt(1-con*con-2*al*con);
}else{
y=this.y0-Proj4js.common.PI*this.R*Math.sqrt(1-con*con-2*al*con);
}
p.x=x;
p.y=y;
return p;
},forward:function(p){
var dlon;
var xx,yy,xys,c1,c2,c3;
var al,asq;
var a1;
var m1;
var con;
var th1;
var d;
p.x-=this.x0;
p.y-=this.y0;
con=Proj4js.common.PI*this.R;
xx=p.x/con;
yy=p.y/con;
xys=xx*xx+yy*yy;
c1=-Math.abs(yy)*(1+xys);
c2=c1-2*yy*yy+xx*xx;
c3=-2*c1+1+2*yy*yy+xys*xys;
d=yy*yy/c3+(2*c2*c2*c2/c3/c3/c3-9*c1*c2/c3/c3)/27;
a1=(c1-c2*c2/3/c3)/c3;
m1=2*Math.sqrt(-a1/3);
con=((3*d)/a1)/m1;
if(Math.abs(con)>1){
if(con>=0){
con=1;
}else{
con=-1;
}
}
th1=Math.acos(con)/3;
if(p.y>=0){
lat=(-m1*Math.cos(th1+Proj4js.common.PI/3)-c2/3/c3)*Proj4js.common.PI;
}else{
lat=-(-m1*Math.cos(th1+PI/3)-c2/3/c3)*Proj4js.common.PI;
}
if(Math.abs(xx)<Proj4js.common.EPSLN){
lon=this.long0;
}
lon=Proj4js.common.adjust_lon(this.long0+Proj4js.common.PI*(xys-1+Math.sqrt(1+2*(xx*xx-yy*yy)+xys*xys))/2/xx);
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.gauss={init:function(){
sphi=Math.sin(this.lat0);
cphi=Math.cos(this.lat0);
cphi*=cphi;
this.rc=Math.sqrt(1-this.es)/(1-this.es*sphi*sphi);
this.C=Math.sqrt(1+this.es*cphi*cphi/(1-this.es));
this.phic0=Math.asin(sphi/this.C);
this.ratexp=0.5*this.C*this.e;
this.K=Math.tan(0.5*this.phic0+Proj4js.common.FORTPI)/(Math.pow(Math.tan(0.5*this.lat0+Proj4js.common.FORTPI),this.C)*Proj4js.common.srat(this.e*sphi,this.ratexp));
},forward:function(p){
var lon=p.x;
var lat=p.y;
lon=lon*Proj4js.common.D2R;
lat=lat*Proj4js.common.D2R;
lon=Proj4js.common.adjust_lon(lon-this.long0);
p.y=2*Math.atan(this.K*Math.pow(Math.tan(0.5*lat+Proj4js.common.FORTPI),this.C)*Proj4js.common.srat(this.e*Math.sin(lat),this.ratexp))-Proj4js.common.HALF_PI;
p.x=this.C*lon;
return p;
},inverse:function(p){
var _17f=1e-14;
p.x=p.x/this.C;
var lat=p.y;
num=Math.pow(Math.tan(0.5*p.y+Proj4js.common.FORTPI)/this.K,1/this.C);
for(var i=Proj4js.common.MAX_ITER;i>0;--i){
lat=2*Math.atan(num*Proj4js.common.srat(this.e*Math.sin(p.y),-0.5*this.e))-Proj4js.common.HALF_PI;
if(Math.abs(lat-p.y)<_17f){
break;
}
p.y=lat;
}
if(!i){
Proj4js.reportError("gauss:inverse:convergence failed");
return null;
}
p.x=Proj4js.common.adjust_lon(p.x+this.long0);
p.x=p.x*Proj4js.common.R2D;
p.y=lat*Proj4js.common.R2D;
return p;
}};
Proj4js.Proj.omerc={init:function(){
if(!this.mode){
this.mode=0;
}
if(!this.lon1){
this.lon1=0;
this.mode=1;
}
if(!this.lon2){
this.lon2=0;
}
if(!this.lat2){
this.lat2=0;
}
var temp=this.b/this.a;
var es=1-Math.pow(temp,2);
var e=Math.sqrt(es);
this.sin_p20=Math.sin(this.lat0);
this.cos_p20=Math.cos(this.lat0);
this.con=1-this.es*this.sin_p20*this.sin_p20;
this.com=Math.sqrt(1-es);
this.bl=Math.sqrt(1+this.es*Math.pow(this.cos_p20,4)/(1-es));
this.al=this.a*this.bl*this.k0*this.com/this.con;
if(Math.abs(this.lat0)<Proj4js.common.EPSLN){
this.ts=1;
this.d=1;
this.el=1;
}else{
this.ts=Proj4js.common.tsfnz(this.e,this.lat0,this.sin_p20);
this.con=Math.sqrt(this.con);
this.d=this.bl*this.com/(this.cos_p20*this.con);
if((this.d*this.d-1)>0){
if(this.lat0>=0){
this.f=this.d+Math.sqrt(this.d*this.d-1);
}else{
this.f=this.d-Math.sqrt(this.d*this.d-1);
}
}else{
this.f=this.d;
}
this.el=this.f*Math.pow(this.ts,this.bl);
}
if(this.mode!=0){
this.g=0.5*(this.f-1/this.f);
this.gama=Proj4js.common.asinz(Math.sin(this.alpha)/this.d);
this.longc=this.longc-Proj4js.common.asinz(this.g*Math.tan(this.gama))/this.bl;
this.con=Math.abs(this.lat0);
if((this.con>Proj4js.common.EPSLN)&&(Math.abs(this.con-Proj4js.common.HALF_PI)>Proj4js.common.EPSLN)){
this.singam=Math.sin(this.gama);
this.cosgam=Math.cos(this.gama);
this.sinaz=Math.sin(this.alpha);
this.cosaz=Math.cos(this.alpha);
if(this.lat0>=0){
this.u=(this.al/this.bl)*Math.atan(Math.sqrt(this.d*this.d-1)/this.cosaz);
}else{
this.u=-(this.al/this.bl)*Math.atan(Math.sqrt(this.d*this.d-1)/this.cosaz);
}
}else{
Proj4js.reportError("omerc:Init:DataError");
}
}else{
this.sinphi=Math.sin(this.at1);
this.ts1=Proj4js.common.tsfnz(this.e,this.lat1,this.sinphi);
this.sinphi=Math.sin(this.lat2);
this.ts2=Proj4js.common.tsfnz(this.e,this.lat2,this.sinphi);
this.h=Math.pow(this.ts1,this.bl);
this.l=Math.pow(this.ts2,this.bl);
this.f=this.el/this.h;
this.g=0.5*(this.f-1/this.f);
this.j=(this.el*this.el-this.l*this.h)/(this.el*this.el+this.l*this.h);
this.p=(this.l-this.h)/(this.l+this.h);
this.dlon=this.lon1-this.lon2;
if(this.dlon<-Proj4js.common.PI){
this.lon2=this.lon2-2*Proj4js.common.PI;
}
if(this.dlon>Proj4js.common.PI){
this.lon2=this.lon2+2*Proj4js.common.PI;
}
this.dlon=this.lon1-this.lon2;
this.longc=0.5*(this.lon1+this.lon2)-Math.atan(this.j*Math.tan(0.5*this.bl*this.dlon)/this.p)/this.bl;
this.dlon=Proj4js.common.adjust_lon(this.lon1-this.longc);
this.gama=Math.atan(Math.sin(this.bl*this.dlon)/this.g);
this.alpha=Proj4js.common.asinz(this.d*Math.sin(this.gama));
if(Math.abs(this.lat1-this.lat2)<=Proj4js.common.EPSLN){
Proj4js.reportError("omercInitDataError");
}else{
this.con=Math.abs(this.lat1);
}
if((this.con<=Proj4js.common.EPSLN)||(Math.abs(this.con-HALF_PI)<=Proj4js.common.EPSLN)){
Proj4js.reportError("omercInitDataError");
}else{
if(Math.abs(Math.abs(this.lat0)-Proj4js.common.HALF_PI)<=Proj4js.common.EPSLN){
Proj4js.reportError("omercInitDataError");
}
}
this.singam=Math.sin(this.gam);
this.cosgam=Math.cos(this.gam);
this.sinaz=Math.sin(this.alpha);
this.cosaz=Math.cos(this.alpha);
if(this.lat0>=0){
this.u=(this.al/this.bl)*Math.atan(Math.sqrt(this.d*this.d-1)/this.cosaz);
}else{
this.u=-(this.al/this.bl)*Math.atan(Math.sqrt(this.d*this.d-1)/this.cosaz);
}
}
},forward:function(p){
var _186;
var _187,cos_phi;
var b;
var c,t,tq;
var con,n,ml;
var q,us,vl;
var ul,vs;
var s;
var dlon;
var ts1;
var lon=p.x;
var lat=p.y;
_187=Math.sin(lat);
dlon=Proj4js.common.adjust_lon(lon-this.longc);
vl=Math.sin(this.bl*dlon);
if(Math.abs(Math.abs(lat)-Proj4js.common.HALF_PI)>Proj4js.common.EPSLN){
ts1=Proj4js.common.tsfnz(this.e,lat,_187);
q=this.el/(Math.pow(ts1,this.bl));
s=0.5*(q-1/q);
t=0.5*(q+1/q);
ul=(s*this.singam-vl*this.cosgam)/t;
con=Math.cos(this.bl*dlon);
if(Math.abs(con)<1e-7){
us=this.al*this.bl*dlon;
}else{
us=this.al*Math.atan((s*this.cosgam+vl*this.singam)/con)/this.bl;
if(con<0){
us=us+Proj4js.common.PI*this.al/this.bl;
}
}
}else{
if(lat>=0){
ul=this.singam;
}else{
ul=-this.singam;
}
us=this.al*lat/this.bl;
}
if(Math.abs(Math.abs(ul)-1)<=Proj4js.common.EPSLN){
Proj4js.reportError("omercFwdInfinity");
}
vs=0.5*this.al*Math.log((1-ul)/(1+ul))/this.bl;
us=us-this.u;
var x=this.x0+vs*this.cosaz+us*this.sinaz;
var y=this.y0+us*this.cosaz-vs*this.sinaz;
p.x=x;
p.y=y;
return p;
},inverse:function(p){
var _195;
var _196;
var _197;
var _198,cos_phi;
var b;
var c,t,tq;
var con,n,ml;
var vs,us,q,s,ts1;
var vl,ul,bs;
var dlon;
var flag;
p.x-=this.x0;
p.y-=this.y0;
flag=0;
vs=p.x*this.cosaz-p.y*this.sinaz;
us=p.y*this.cosaz+p.x*this.sinaz;
us=us+this.u;
q=Math.exp(-this.bl*vs/this.al);
s=0.5*(q-1/q);
t=0.5*(q+1/q);
vl=Math.sin(this.bl*us/this.al);
ul=(vl*this.cosgam+s*this.singam)/t;
if(Math.abs(Math.abs(ul)-1)<=Proj4js.common.EPSLN){
lon=this.longc;
if(ul>=0){
lat=Proj4js.common.HALF_PI;
}else{
lat=-Proj4js.common.HALF_PI;
}
}else{
con=1/this.bl;
ts1=Math.pow((this.el/Math.sqrt((1+ul)/(1-ul))),con);
lat=Proj4js.common.phi2z(this.e,ts1);
_196=this.longc-Math.atan2((s*this.cosgam-vl*this.singam),con)/this.bl;
lon=Proj4js.common.adjust_lon(_196);
}
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.lcc={init:function(){
if(!this.lat2){
this.lat2=this.lat0;
}
if(!this.k0){
this.k0=1;
}
if(Math.abs(this.lat1+this.lat2)<Proj4js.common.EPSLN){
Proj4js.reportError("lcc:init: Equal Latitudes");
return;
}
var temp=this.b/this.a;
this.e=Math.sqrt(1-temp*temp);
var sin1=Math.sin(this.lat1);
var cos1=Math.cos(this.lat1);
var ms1=Proj4js.common.msfnz(this.e,sin1,cos1);
var ts1=Proj4js.common.tsfnz(this.e,this.lat1,sin1);
var sin2=Math.sin(this.lat2);
var cos2=Math.cos(this.lat2);
var ms2=Proj4js.common.msfnz(this.e,sin2,cos2);
var ts2=Proj4js.common.tsfnz(this.e,this.lat2,sin2);
var ts0=Proj4js.common.tsfnz(this.e,this.lat0,Math.sin(this.lat0));
if(Math.abs(this.lat1-this.lat2)>Proj4js.common.EPSLN){
this.ns=Math.log(ms1/ms2)/Math.log(ts1/ts2);
}else{
this.ns=sin1;
}
this.f0=ms1/(this.ns*Math.pow(ts1,this.ns));
this.rh=this.a*this.f0*Math.pow(ts0,this.ns);
if(!this.title){
this.title="Lambert Conformal Conic";
}
},forward:function(p){
var lon=p.x;
var lat=p.y;
if(lat<=90&&lat>=-90&&lon<=180&&lon>=-180){
}else{
Proj4js.reportError("lcc:forward: llInputOutOfRange: "+lon+" : "+lat);
return null;
}
var con=Math.abs(Math.abs(lat)-Proj4js.common.HALF_PI);
var ts;
if(con>Proj4js.common.EPSLN){
ts=Proj4js.common.tsfnz(this.e,lat,Math.sin(lat));
rh1=this.a*this.f0*Math.pow(ts,this.ns);
}else{
con=lat*this.ns;
if(con<=0){
Proj4js.reportError("lcc:forward: No Projection");
return null;
}
rh1=0;
}
var _1af=this.ns*Proj4js.common.adjust_lon(lon-this.long0);
p.x=this.k0*(rh1*Math.sin(_1af))+this.x0;
p.y=this.k0*(this.rh-rh1*Math.cos(_1af))+this.y0;
return p;
},inverse:function(p){
var rh1,con,ts;
var lat,lon;
x=(p.x-this.x0)/this.k0;
y=(this.rh-(p.y-this.y0)/this.k0);
if(this.ns>0){
rh1=Math.sqrt(x*x+y*y);
con=1;
}else{
rh1=-Math.sqrt(x*x+y*y);
con=-1;
}
var _1b3=0;
if(rh1!=0){
_1b3=Math.atan2((con*x),(con*y));
}
if((rh1!=0)||(this.ns>0)){
con=1/this.ns;
ts=Math.pow((rh1/(this.a*this.f0)),con);
lat=Proj4js.common.phi2z(this.e,ts);
if(lat==-9999){
return null;
}
}else{
lat=-Proj4js.common.HALF_PI;
}
lon=Proj4js.common.adjust_lon(_1b3/this.ns+this.long0);
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.laea={init:function(){
this.sin_lat_o=Math.sin(this.lat0);
this.cos_lat_o=Math.cos(this.lat0);
},forward:function(p){
var lon=p.x;
var lat=p.y;
var _1b7=Proj4js.common.adjust_lon(lon-this.long0);
var _1b8=Math.sin(lat);
var _1b9=Math.cos(lat);
var _1ba=Math.sin(_1b7);
var _1bb=Math.cos(_1b7);
var g=this.sin_lat_o*_1b8+this.cos_lat_o*_1b9*_1bb;
if(g==-1){
}
var ksp=this.R*Math.sqrt(2/(1+g));
var x=ksp*_1b9*_1ba+this.x0;
var y=ksp*(this.cos_lat_o*_1b8-this.sin_lat_o*_1b9*_1bb)+this.x0;
p.x=x;
p.y=y;
return p;
},inverse:function(p){
p.x-=this.x0;
p.y-=this.y0;
var Rh=Math.sqrt(p.x*p.x+p.y*p.y);
var temp=Rh/(2*this.R);
if(temp>1){
Proj4js.reportError("laea:Inv:DataError");
}
var z=2*Proj4js.common.asinz(temp);
var _1c4=Math.sin(z);
var _1c5=Math.cos(z);
var lon=this.long0;
if(Math.abs(Rh)>Proj4js.common.EPSLN){
var lat=Proj4js.common.asinz(this.sin_lat_o*_1c5+this.cos_lat_o*_1c4*p.y/Rh);
var temp=Math.abs(this.lat0)-Proj4js.common.HALF_PI;
if(Math.abs(temp)>Proj4js.common.EPSLN){
temp=_1c5-this.sin_lat_o*Math.sin(lat);
if(temp!=0){
lon=Proj4js.common.adjust_lon(this.long0+Math.atan2(p.x*_1c4*this.cos_lat_o,temp*Rh));
}
}else{
if(this.lat0<0){
lon=Proj4js.common.adjust_lon(this.long0-Math.atan2(-p.x,p.y));
}else{
lon=Proj4js.common.adjust_lon(this.long0+Math.atan2(p.x,-p.y));
}
}
}else{
lat=this.lat0;
}
p.x=lon;
p.y=lat;
return p;
}};
Proj4js.Proj.aeqd={init:function(){
this.sin_p12=Math.sin(this.lat0);
this.cos_p12=Math.cos(this.lat0);
},forward:function(p){
var lon=p.x;
var lat=p.y;
var _1cb=Math.sin(p.y);
var _1cc=Math.cos(p.y);
var dlon=Proj4js.common.adjust_lon(lon-this.long0);
var _1ce=Math.cos(dlon);
var g=this.sin_p12*_1cb+this.cos_p12*_1cc*_1ce;
if(Math.abs(Math.abs(g)-1)<Proj4js.common.EPSLN){
var ksp=1;
if(g<0){
Proj4js.reportError("aeqdFwdPointError");
}
}else{
var z=Math.acos(g);
ksp=z/Math.sin(z);
}
var x=this.x0+this.a*ksp*_1cc*Math.sin(dlon);
var y=this.y0+this.a*ksp*(this.cos_p12*_1cb-this.sin_p12*_1cc*_1ce);
return new Proj4js.Point(x,y);
},inverse:function(p){
p.x-=this.x0;
p.y-=this.y0;
var rh=Math.sqrt(p.x*p.x+p.y*p.y);
if(rh>(2*Proj4js.common.HALF_PI*this.a)){
Proj4js.reportError("aeqdInvDataError");
}
var z=rh/this.a;
var sinz=Math.sin(z);
var cosz=Math.cos(z);
var lon=this.long0;
if(Math.abs(rh)<=EPSLN){
var lat=this.lat0;
}
lat=asinz(cosz*this.sin_p12+(p.y*sinz*this.cos_p12)/rh);
this.t3=lat;
var con=Math.abs(this.lat0)-Proj4js.common.HALF_PI;
if(Math.abs(con)<=Proj4js.common.EPSLN){
if(lat0>=0){
lon=adjust_lon(this.long0+Math.atan2(p.x,-p.y));
}else{
lon=adjust_lon(this.long0-Math.atan2(-p.x,p.y));
}
}
con=cosz-this.sin_p12*Math.sin(lat);
if((Math.abs(con)<Proj4js.common.EPSLN)&&(Math.abs(x)<Proj4js.common.EPSLN)){
return null;
}
this.t1=this.cos_p12;
this.t2=con*rh;
this.temp=Math.atan2((p.x*sinz*this.cos_p12),(con*rh));
lon=Proj4js.common.adjust_lon(this.long0+Math.atan2((p.x*sinz*this.cos_p12),(con*rh)));
return new Proj4js.Point(lon,lat);
}};
Proj4js.Proj.moll={init:function(){
},forward:function(p){
var lon=p.x;
var lat=p.y;
var _1df=Proj4js.common.adjust_lon(lon-this.long0);
var _1e0=lat;
var con=Proj4js.common.PI*Math.sin(lat);
for(var i=0;;i++){
var _1e3=-(_1e0+Math.sin(_1e0)-con)/(1+Math.cos(_1e0));
_1e0+=_1e3;
if(Math.abs(_1e3)<Proj4js.common.EPSLN){
break;
}
if(i>=50){
Proj4js.reportError("moll:Fwd:IterationError");
}
}
_1e0/=2;
if(Proj4js.common.PI/2-Math.abs(lat)<Proj4js.common.EPSLN){
_1df=0;
}
var x=0.900316316158*this.R*_1df*Math.cos(_1e0)+this.x0;
var y=1.4142135623731*this.R*Math.sin(_1e0)+this.y0;
p.x=x;
p.y=y;
return p;
},inverse:function(p){
var _1e7;
var arg;
p.x-=this.x0;
var arg=p.y/(1.4142135623731*this.R);
if(Math.abs(arg)>0.999999999999){
arg=0.999999999999;
}
var _1e7=Math.asin(arg);
var lon=Proj4js.common.adjust_lon(this.long0+(p.x/(0.900316316158*this.R*Math.cos(_1e7))));
if(lon<(-Proj4js.common.PI)){
lon=-Proj4js.common.PI;
}
if(lon>Proj4js.common.PI){
lon=Proj4js.common.PI;
}
arg=(2*_1e7+Math.sin(2*_1e7))/Proj4js.common.PI;
if(Math.abs(arg)>1){
arg=1;
}
var lat=Math.asin(arg);
p.x=lon;
p.y=lat;
return p;
}};

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
if(_f.indexOf("http://")==0||_f.indexOf("https://")==0){
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
if(_14.indexOf("http://")==0||_14.indexOf("https://")==0){
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
if(url.indexOf("http://")==0||url.indexOf("https://")==0){
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
var _78={fillColor:"#808080",fillOpacity:1,strokeColor:"#000000",strokeOpacity:1,strokeWidth:1,pointRadius:6};
var _79=OpenLayers.Util.extend(_78,OpenLayers.Feature.Vector.style["default"]);
var _7a;
var _7b=false;
if(_77){
_7a=_77.selectSingleNode(".//sld:ExternalGraphic/sld:OnlineResource/@xlink:href");
if(_7a){
_79.externalGraphic=_7a.firstChild.nodeValue;
_7b=true;
}
_7a=_77.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill']");
if(_7a){
_79.fillColor=_7a.firstChild.nodeValue;
_7b=true;
}
_7a=_77.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill-opacity']");
if(_7a){
_79.fillOpacity=_7a.firstChild.nodeValue;
_7b=true;
}else{
_7a=_77.selectSingleNode(".//sld:Opacity/sld:Literal");
if(_7a){
_79.fillOpacity=_7a.firstChild.nodeValue;
_7b=true;
}
}
_7a=_77.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke']");
if(_7a){
_79.strokeColor=_7a.firstChild.nodeValue;
_7b=true;
}
_7a=_77.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-opacity']");
if(_7a){
_79.strokeOpacity=_7a.firstChild.nodeValue;
_7b=true;
}
_7a=_77.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-width']");
if(_7a){
_79.strokeWidth=_7a.firstChild.nodeValue;
_7b=true;
}
_7a=_77.selectSingleNode(".//sld:Size");
if(_7a){
_79.pointRadius=_7a.firstChild.nodeValue;
_7b=true;
}
}
if(!_7b){
_79=null;
}
return _79;
}
function loadCss(_7c){
if(typeof config=="undefined"||typeof config.skinDir!="string"){
if(!mapbuilder.cssToLoad){
mapbuilder.cssToLoad=[];
}
mapbuilder.cssToLoad.push(_7c);
return;
}
var id=_7c.match(/[^\/]*$/).toString().replace(/./,"_");
if(!document.getElementById(id)){
var _7e=document.createElement("link");
_7e.setAttribute("id",id);
_7e.setAttribute("rel","stylesheet");
_7e.setAttribute("type","text/css");
_7e.setAttribute("href",config.skinDir+"/"+_7c);
document.getElementsByTagName("head")[0].appendChild(_7e);
}
}
function getNodeValue(_7f){
if(!_7f){
return null;
}
if(_7f.nodeType==1){
return _7f.firstChild?_7f.firstChild.nodeValue:"";
}
if(_7f.nodeType<5){
return _7f.nodeValue;
}
return _7f;
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
if(window[this.id]&&typeof window[this.id]=="string"){
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
if(_13.indexOf("http://")==0||_13.indexOf("https://")==0){
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
var _15=_11.postData||"";
if(typeof _15=="object"){
_15=new XMLSerializer().serializeToString(_15);
}
_12.send(_15);
if(!_11.async){
if(_12.status>=400){
var _16=mbGetMessage("errorLoadingDocument",_13,_12.statusText,_12.responseText);
alert(_16);
this.objRef.setParam("modelStatus",_16);
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
this.setModel=function(_17,_18){
_17.callListeners("newModel");
_17.doc=_18;
if((_18==null)&&_17.url){
_17.url=null;
}
_17.finishLoading();
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
this.newRequest=function(_19,_1a){
var _1b=_19;
if(_19.template){
var _1c=_19.modelNode.parentNode;
if(_SARISSA_IS_IE){
var _1d=_1c.appendChild(_1.cloneNode(true));
}else{
var _1d=_1c.appendChild(_19.modelNode.ownerDocument.importNode(_19.modelNode,true));
}
_1d.removeAttribute("id");
_1d.setAttribute("createByTemplate","true");
_1b=_19.createObject(_1d);
_1b.callListeners("init");
if(!_19.templates){
_19.templates=new Array();
}
_19.templates.push(_1b);
}
_1b.url=_1a.url;
if(!_1b.url){
_1b.doc=null;
}
_1b.method=_1a.method;
_1b.postData=_1a.postData;
_1b.loadModelDoc(_1b);
};
this.deleteTemplates=function(){
if(this.templates){
var _1e;
while(_1e=this.templates.pop()){
_1e.setParam("newModel");
var _1f=this.modelNode.parentNode;
_1f.removeChild(_1e.modelNode);
}
}
};
this.saveModel=function(_20){
if(config.serializeUrl){
var _21=postGetLoad(config.serializeUrl,_20.doc,"text/xml","/temp","sld.xml");
if(!_SARISSA_IS_SAFARI){
_21.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_21,"xmlns:xlink='http://www.w3.org/1999/xlink'");
}
var _22=_21.selectSingleNode("//OnlineResource");
var _23=_22.attributes.getNamedItem("xlink:href").nodeValue;
_20.setParam("modelSaved",_23);
}else{
alert(mbGetMessage("noSerializeUrl"));
}
};
this.createObject=function(_24){
var _25=_24.nodeName;
if(!window[_25]){
alert(mbGetMessage("errorCreatingObject",_25));
return false;
}
var _26=new window[_25](_24,this);
if(_26){
config.objects[_26.id]=_26;
return _26;
}else{
alert(mbGetMessage("errorCreatingObject",_25));
}
};
this.loadObjects=function(_27){
var _28=this.modelNode.selectNodes(_27);
for(var i=0;i<_28.length;i++){
if(_28[i].nodeName!="#text"&&_28[i].nodeName!="#comment"){
this.createObject(_28[i]);
}
}
};
this.parseConfig=function(_2a){
_2a.loadObjects("mb:widgets/*");
_2a.loadObjects("mb:tools/*");
_2a.loadObjects("mb:models/*");
};
this.refresh=function(_2b){
_2b.setParam("refresh");
};
this.addListener("loadModel",this.refresh,this);
this.init=function(_2c){
_2c.callListeners("init");
};
this.clearModel=function(_2d){
_2d.doc=null;
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
if(mapbuilder.cssToLoad){
for(var i=0;i<mapbuilder.cssToLoad.length;i++){
loadCss(mapbuilder.cssToLoad[i]);
}
mapbuilder.cssToLoad=null;
}
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:models/*"),"model/");
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:widgets/*"),"widget/");
mapbuilder.loadScriptsFromXpath(this.doc.selectNodes("//mb:tools/*"),"tool/");
var _6=this.doc.selectNodes("//mb:scriptFile");
for(var i=0;i<_6.length;i++){
scriptFile=getNodeValue(_6[i]);
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
var _8=_1.selectSingleNode("mb:class");
this.buttonType=_8?getNodeValue(_8).toUpperCase():null;
if(this.buttonType=="RADIOBUTTON"){
this.enabled=false;
}
this.olButtonType={"RADIOBUTTON":OpenLayers.Control.TYPE_TOOL,"TOOL":OpenLayers.Control.TYPE_TOOL,"BUTTON":OpenLayers.Control.TYPE_BUTTON,"TOGGLE":OpenLayers.Control.TYPE_TOGGLE};
var _9=_1.selectSingleNode("mb:action");
if(_9){
this.action=_9.firstChild.nodeValue;
}
var _a=_1.selectSingleNode("mb:tooltip");
if(_a){
this.tooltip=_a.firstChild.nodeValue;
}
var _b=_1.selectSingleNode("mb:disabledSrc");
if(_b){
this.disabledImage=config.skinDir+_b.firstChild.nodeValue;
}
var _c=_1.selectSingleNode("mb:enabledSrc");
if(_c){
this.enabledImage=config.skinDir+_c.firstChild.nodeValue;
}
this.cursor="default";
var _d=this.widgetNode.selectSingleNode("mb:cursor");
if(_d!=null){
var _e=_d.firstChild.nodeValue;
this.cursor=_e;
}
var _f=_1.selectSingleNode("mb:selected");
if(_f&&_f.firstChild.nodeValue){
this.selected=true;
}
this.getButtonClass=function(_10,_11){
var _12;
if(_10.control.displayClass){
_12=_10.control.displayClass;
}else{
_12=_10.control.CLASS_NAME;
_12=_12.replace(/OpenLayers/,"ol").replace(/\./g,"");
}
_12+="Item";
return "."+_12+_11;
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
this.doSelect=function(_13,_14){
};
this.attachToOL=function(_15,_16){
if(_15.control){
return;
}
if(_16&&(_16!=_15.id)){
return;
}
if(!_15.createControl){
return;
}
var _17=_15.createControl(_15);
var _18=_15.olButtonType[_15.buttonType]||_17.prototype.type;
var _19=OpenLayers.Class(_17,{objRef:_15,type:_18,superclass:_17.prototype,trigger:function(){
if(this.superclass.trigger){
this.superclass.trigger.call(this);
}
_15.doSelect(_15,true);
},activate:function(){
if(this.superclass.activate.call(this)){
this.panel_div.style.backgroundImage="url(\""+_15.enabledImage+"\")";
this.map.div.style.cursor=_15.cursor;
this.map.mbCursor=_15.cursor;
_15.enabled=true;
this.active=true;
_15.doSelect(_15,true);
}
},deactivate:function(){
if(this.superclass.deactivate.call(this)){
this.panel_div.style.backgroundImage="url(\""+_15.disabledImage+"\")";
this.map.div.style.cursor="";
this.map.mbCursor="";
_15.enabled=false;
this.active=false;
_15.doSelect(_15,false);
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
if(!_15.control){
_15.control=_15.instantiateControl?_15.instantiateControl(_15,_19):new _19();
}
var map=_15.targetContext.map;
_15.panel=_15.targetContext.buttonBars[_15.htmlTagId];
if(!_15.panel||_15.panel.map==null){
if(!document.getElementById(_15.panelHtmlTagId)){
var _1b=document.createElement("div");
_1b.setAttribute("id",_15.panelHtmlTagId);
_1b.setAttribute("class","olControlPanel");
var _1c=_15.getNode();
_1c.appendChild(_1b);
_1c.innerHTML+=" ";
}
var _1d=OpenLayers.Class(OpenLayers.Control.Panel,{div:document.getElementById(_15.panelHtmlTagId),defaultControl:null,destroy:function(){
_1c.removeChild(this.div);
OpenLayers.Control.prototype.destroy.apply(this,arguments);
this.div=null;
_15.panel=null;
}});
_15.panel=new _1d();
_15.targetContext.buttonBars[_15.htmlTagId]=_15.panel;
map.addControl(_15.panel);
}
if(OpenLayers.Util.indexOf(_15.control,_15.panel.controls)==-1){
_15.panel.addControls(_15.control);
}
if(_15.tooltip){
_15.control.panel_div.title=_15.tooltip;
}
_15.control.panel_div.style.backgroundImage="url(\""+_15.disabledImage+"\")";
if(_15.selected==true){
_15.control.activate();
}
};
this.buttonInit=function(_1e){
var _1f=_1e.widgetNode.selectSingleNode("mb:targetContext");
if(_1f){
_1e.targetContext=window.config.objects[_1f.firstChild.nodeValue];
if(!_1e.targetModel){
alert(mbGetMessage("noTargetContext",_1f.firstChild.nodeValue,_1e.id));
}
}else{
_1e.targetContext=_1e.targetModel;
}
if(!_1e.targetContext.buttonBars){
_1e.targetContext.buttonBars=new Array();
}
_1e.targetContext.addListener("refresh",_1e.attachToOL,_1e);
};
this.model.addListener("init",this.buttonInit,this);
this.model.removeListener("newNodel",this.clearWidget,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Button(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="default";
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl."+_3.id,type:(_3.buttonType=="RadioButton")?OpenLayers.Control.TYPE_TOOL:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
eval("config.objects."+_3.action);
},activate:function(){
eval("config.objects."+_3.action);
this.active=true;
return true;
}});
return _4;
};
this.instantiateControl=function(_5,_6){
return new _6();
};
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

loadCss("openlayers/style.css");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/util/Util.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/tool/Extent.js");
function MapPaneOL(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
OpenLayers.ImgPath=config.skinDir+"/images/openlayers/";
OpenLayers.ProxyHost=config.proxyUrl+"?url=";
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
var _12=null;
_12=_d.widgetNode.selectSingleNode("mb:minResolution");
_12=(_12)?parseFloat(_12.firstChild.nodeValue):undefined;
var _13=_f.units=="meters"?"m":_f.units;
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
var _1a={controls:[],projection:_f.srsCode,units:_13,maxExtent:_10,maxResolution:_11,minResolution:_12,resolutions:_14,theme:null,destroy:function(_1b){
if(_1b!=true){
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
_d.model.map=new OpenLayers.Map(_18,_1a);
_d.model.map.Z_INDEX_BASE.Control=10000;
var _1c=null;
if(_d.context=="OWS"&&_d.model.getBaseLayer()){
var _1d=_d.model.getBaseLayer();
var _1e=_1d.selectSingleNode("ows:TileSet/ows:SRS");
if(_1e){
_d.model.setSRS(_1e.firstChild.nodeValue);
}
_13=_f.units=="meters"?"m":_f.units;
var _1f=_1d.selectSingleNode("ows:TileSet/ows:BoundingBox");
if(_1f){
_10=new OpenLayers.Bounds(_1f.selectSingleNode("@minx").nodeValue,_1f.selectSingleNode("@miny").nodeValue,_1f.selectSingleNode("@maxx").nodeValue,_1f.selectSingleNode("@maxy").nodeValue);
}
var _14=_1d.selectSingleNode("ows:TileSet/ows:Resolutions");
_14=_14?_14.firstChild.nodeValue.split(","):null;
for(var r in _14){
_14[r]=parseFloat(_14[r]);
}
var _20=_1d.selectSingleNode("ows:TileSet/ows:Width");
if(_20){
_d.tileSize=parseInt(_20.nodeValue);
}
var _21=_1d.selectSingleNode("ows:TileSet/ows:Format");
if(_21){
_21=_21.nodeValue;
}
var _22=_1d.selectSingleNode("wmc:Server/@service");
_22=(_22)?_22.nodeValue:"";
var _23=_1d.selectSingleNode("wmc:Title");
_23=(_23)?_23.firstChild.nodeValue:"";
var _24=_1d.selectSingleNode("wmc:Name");
_24=(_24)?_24.firstChild.nodeValue:"";
var _25=_1d.selectSingleNode("ows:TileSet/ows:Layers");
_25=(_25)?_25.firstChild.nodeValue:"hybrid";
var _26=_1d.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");
_26=(_26)?getNodeValue(_26):"";
var _27={units:_13,projection:_f.srsCode,maxExtent:_10,alpha:false,isBaseLayer:true,displayOutsideMaxExtent:_d.displayOutsideMaxExtent,ratio:1};
switch(_22){
case "OGC":
case "WMS":
case "wms":
case "OGC:WMS":
_27.ratio=_d.imageBuffer;
var _28=new Array();
_1c=new OpenLayers.Layer.WMS(_23,_26,{layers:_24,format:_21},_27);
break;
case "WMS-C":
case "OGC:WMS-C":
_27.gutter=_d.tileGutter;
_27.buffer=_d.tileBuffer;
_27.tileSize=new OpenLayers.Size(_d.tileSize,_d.tileSize);
_1c=new OpenLayers.Layer.WMS(_23,_26,{layers:_24,format:_21},_27);
break;
case "GMAP":
case "Google":
if(_10){
_27.maxExtent=_10;
}
var _29=(_d.model.getSRS()=="EPSG:900913")?true:false;
switch(_25){
case "aerial":
case "satellite":
_25=G_SATELLITE_MAP;
break;
case "road":
case "normal":
_25=G_NORMAL_MAP;
break;
default:
_25=G_HYBRID_MAP;
}
_1c=new OpenLayers.Layer.Google(_24,{type:_25,minZoomLevel:0,maxZoomLevel:19,sphericalMercator:_29},_27);
break;
case "YMAP":
case "Yahoo":
if(_10){
_27.maxExtent=_10;
}
var _29=(_d.model.getSRS()=="EPSG:900913")?true:false;
_1c=new OpenLayers.Layer.Yahoo(_24,{maxZoomLevel:21,sphericalMercator:_29},_27);
break;
case "VE":
case "Microsoft":
if(_10){
_27.maxExtent=_10;
}
var _29=(_d.model.getSRS()=="EPSG:900913")?true:false;
switch(_25){
case "aerial":
case "satellite":
_25=VEMapStyle.Aerial;
break;
case "road":
case "normal":
_25=VEMapStyle.Road;
break;
default:
_25=VEMapStyle.Hybrid;
}
_1c=new OpenLayers.Layer.VirtualEarth(_24,{minZoomLevel:0,maxZoomLevel:21,type:_25});
break;
case "MultiMap":
if(_10){
_27.maxExtent=_10;
}
var _29=(_d.model.getSRS()=="EPSG:900913")?true:false;
_1c=new OpenLayers.Layer.MultiMap(_24,{maxZoomLevel:21,sphericalMercator:_29},_27);
break;
default:
alert(mbGetMessage("layerTypeNotSupported",_22));
}
}else{
var _27={units:_13,projection:_f.srsCode,maxExtent:_10,maxResolution:_11,minResolution:_12,resolutions:_14,alpha:false,isBaseLayer:true,displayOutsideMaxExtent:_d.displayOutsideMaxExtent,ratio:1,singleTile:true,visibility:false};
_1c=new OpenLayers.Layer.WMS("baselayer",config.skinDir+"/images/openlayers/blank.gif",null,_27);
}
_d.model.map.addLayer(_1c);
}else{
_d.deleteAllLayers(_d);
}
var _2a=_d.model.getAllLayers();
if(!_d.oLlayers){
_d.oLlayers={};
}
for(var i=0;i<=_2a.length-1;i++){
_d.addLayer(_d,_2a[i]);
}
var _2c=_d.model.getBoundingBox();
_d.model.map.mbMapPane=_d;
_d.model.map.events.register("moveend",_d.model.map,_d.updateContext);
_d.model.map.events.register("mouseup",_d.model.map,_d.updateMouse);
_d.model.callListeners("bbox");
};
MapPaneOL.prototype.clear=function(_2d){
if(_2d.model.map){
OpenLayers.Event.stopObservingElement(window);
_2d.model.map.destroy(true);
_2d.model.map=null;
_2d.oLlayers={};
}
};
MapPaneOL.prototype.increaseLoadingLayers=function(e){
++this.loadingLayers;
var _2f=mbGetMessage((this.loadingLayers>1)?"loadingLayers":"loadingLayer",this.loadingLayers);
this.model.setParam("modelStatus",_2f);
};
MapPaneOL.prototype.decreaseLoadingLayers=function(e){
--this.loadingLayers;
var _31=this.loadingLayers>0?mbGetMessage((this.loadingLayers>1)?"loadingLayers":"loadingLayer",this.loadingLayers):null;
this.model.setParam("modelStatus",_31);
};
MapPaneOL.prototype.updateContext=function(e){
var _33=e.object.mbMapPane;
var _34=_33.model.map.getExtent().toBBOX().split(",");
var ul=new Array(_34[0],_34[3]);
var lr=new Array(_34[2],_34[1]);
if(_33.model.getWindowWidth()!=e.element.offsetWidth){
_33.model.setWindowWidth(e.element.offsetWidth);
}
if(_33.model.getWindowHeight()!=e.element.offsetHeight){
_33.model.setWindowHeight(e.element.offsetHeight);
}
var _37=_33.model.getParam("aoi");
var _38=new Array(ul,lr);
if(!_37||_37.toString()!=_38.toString()){
_33.model.setBoundingBox(new Array(ul[0],lr[1],lr[0],ul[1]));
_33.model.extent.setSize(_33.model.map.getResolution());
_33.model.setParam("aoi",_38);
}
};
MapPaneOL.prototype.updateMouse=function(e){
var _3a=e.object.mbMapPane;
if(_3a.model.map.mbCursor){
_3a.model.map.div.style.cursor=_3a.model.map.mbCursor;
}
};
MapPaneOL.prototype.zoomToBbox=function(_3b){
if(_3b.model.map){
var _3c=_3b.model.getBoundingBox();
var _3d=[];
var _3e=_3b.model.map.getExtent();
if(_3e){
_3d=_3e.toBBOX();
}
if(_3c.toString()!=_3d.toString()){
_3b.model.map.zoomToExtent(new OpenLayers.Bounds(_3c[0],_3c[1],_3c[2],_3c[3]));
}
}
};
MapPaneOL.prototype.hidden=function(_3f,_40){
var vis=_3f.model.getHidden(_40);
if(vis=="1"){
var _42=false;
}else{
var _42=true;
}
var _43=_3f.getLayer(_3f,_40);
if(_43){
_43.setVisibility(_42);
}
};
MapPaneOL.prototype.getLayer=function(_44,_45){
if(!_44.oLlayers[_45]){
_45=_44.model.getLayerIdByName(_45)||_45;
}
if(_44.oLlayers[_45]&&_44.oLlayers[_45].id){
return _44.model.map.getLayer(_44.oLlayers[_45].id);
}else{
return false;
}
};
MapPaneOL.prototype.deleteLayer=function(_46,_47){
if(_46.oLlayers[_47]){
_46.model.map.removeLayer(_46.oLlayers[_47]);
}
};
MapPaneOL.prototype.deleteAllLayers=function(_48){
for(var i in _48.oLlayers){
var _4a=_48.oLlayers[i];
_4a.destroy();
}
_48.oLlayers={};
};
MapPaneOL.prototype.moveLayerUp=function(_4b,_4c){
var map=_4b.model.map;
map.raiseLayer(map.getLayer(_4b.oLlayers[_4c].id),1);
};
MapPaneOL.prototype.moveLayerDown=function(_4e,_4f){
_4e.model.map.raiseLayer(_4e.getLayer(_4e,_4f),-1);
};
MapPaneOL.prototype.setOpacity=function(_50,_51){
var _52="1";
_52=_50.model.getOpacity(_51);
_50.getLayer(_50,_51).setOpacity(_52);
};
MapPaneOL.prototype.addLayer=function(_53,_54){
var _55=_54;
var _56=_55.selectSingleNode("wmc:Server/@service");
_56=(_56)?_56.nodeValue:"";
var _57=_55.selectSingleNode("wmc:Title");
_57=(_57)?_57.firstChild.nodeValue:"";
layerName=_55.selectSingleNode("wmc:Name");
layerName=(layerName)?layerName.firstChild.nodeValue:"";
var _58;
if(_55.selectSingleNode("@id")&&_55.selectSingleNode("@id").nodeValue){
_58=_55.selectSingleNode("@id").nodeValue;
}else{
_58=layerName;
}
if(_53.context=="OWS"){
var _59=_55.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");
_59=(_59)?getNodeValue(_59):"";
}else{
if(_SARISSA_IS_SAFARI){
var _5a=_55.selectSingleNode("wmc:Server/wmc:OnlineResource");
var _59=_5a.attributes[1].nodeValue;
}else{
if(_SARISSA_IS_OPERA){
var _59=_55.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttributeNS("http://www.w3.org/1999/xlink","href");
}else{
var _59=_55.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
}
}
}
var _5b=_55.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");
if(!_5b){
_5b=_55.selectSingleNode("wmc:FormatList/wmc:Format");
}
_5b=_5b?getNodeValue(_5b):"image/gif";
var vis=_55.selectSingleNode("@hidden");
if(vis){
if(vis.nodeValue=="1"){
vis=false;
}else{
vis=true;
}
}
var _5d=_55.selectSingleNode("@queryable");
if(_5d){
if(_5d.nodeValue=="1"){
_5d=true;
}else{
_5d=false;
}
}
var _5e=_55.selectSingleNode("@opacity");
if(_5e){
_5e=_5e.nodeValue;
}else{
_5e=false;
}
var _5f=_55.selectSingleNode("wmc:StyleList/wmc:Style[@current=1]");
_53.IE6=false;
var _60={visibility:vis,projection:_53.model.map.baseLayer.projection,queryable:_5d,maxExtent:_53.model.map.baseLayer.maxExtent,maxResolution:_53.model.map.baseLayer.maxResolution,minResolution:_53.model.map.baseLayer.minResolution,alpha:_5b.indexOf("png")!=-1?_53.IE6:false,isBaseLayer:false,displayOutsideMaxExtent:_53.displayOutsideMaxExtent};
switch(_56){
case "Component WMS":
var _61=getNodeValue(_55.selectSingleNode("wmc:Server/@remote_ows_url"));
var _62=getNodeValue(_55.selectSingleNode("wmc:Server/@remote_ows_type"))||"WFS";
var sld=getNodeValue(_55.selectSingleNode("wmc:Server/@sld"))||"";
var _5b=getNodeValue(_55.selectSingleNode("wmc:Server/@format"))||_5b;
var _64=getNodeValue(_55.selectSingleNode("wmc:Server/@version"))||"1.3";
var _65=getNodeValue(_55.selectSingleNode("wmc:Server/@exceptions"))||"application/vnd.ogc.se_inimage";
var _66={service:"WMS",version:_64,request:"GetMap",sld:sld,exceptions:_65,format:_5b,remote_ows_type:_62,remote_ows_url:_61};
switch(_66.format){
case "kml":
case "application/kml+xml":
case "application/vnd.google-earth.kml+xml":
case "application/vnd.google-earth.kmz":
_60.format=OpenLayers.Format.KML;
_60.extractAttributes=true;
newParams={width:this.model.getWindowWidth(),height:this.model.getWindowHeight()};
OpenLayers.Util.extend(_66,newParams);
_53.oLlayers[_58]=new OpenLayers.Layer.WFS(_57,_59,OpenLayers.Util.upperCaseObject(_66),_60);
break;
case "image/png":
case "image/jpeg":
case "image/jpg":
case "image/gif":
OpenLayers.Util.extend(_66,{transparent:true});
_53.oLlayers[_58]=new OpenLayers.Layer.WMS(_57,_59,_66,_60);
break;
default:
alert("Component WMS: sorry, format '"+_66.format+"' is unknown to me ("+_58+")");
return false;
}
break;
case "OGC":
case "WMS":
case "wms":
case "OGC:WMS":
if(!_53.model.map.baseLayer){
_60.isBaseLayer=true;
}else{
_60.reproject=_53.imageReproject;
_60.isBaseLayer=false;
}
_60.ratio=_53.imageBuffer;
_60.singleTile=true;
var _67=new Array();
_67=sld2UrlParam(_5f);
if(_53.model.timestampList&&_53.model.timestampList.getAttribute("layerId")==_58){
var ts=_53.model.timestampList.childNodes[0];
_53.oLlayers[_58]=new OpenLayers.Layer.WMS(_57,_59,{layers:layerName,transparent:_60.isBaseLayer?"FALSE":"TRUE","TIME":ts.firstChild.nodeValue,format:_5b,sld:_67.sld,sld_body:_67.sld_body,styles:_67.styles},_60);
this.model.addListener("timestamp",this.timestampListener,this);
}else{
_53.oLlayers[_58]=new OpenLayers.Layer.WMS(_57,_59,{layers:layerName,transparent:_60.isBaseLayer?"FALSE":"TRUE",format:_5b,sld:_67.sld,sld_body:_67.sld_body,styles:_67.styles},_60);
}
break;
case "WMS-C":
case "OGC:WMS-C":
if(!_53.model.map.baseLayer){
_60.isBaseLayer=true;
}else{
_60.reproject=_53.imageReproject;
_60.isBaseLayer=false;
}
_60.gutter=_53.tileGutter;
_60.buffer=_53.tileBuffer;
_60.tileSize=new OpenLayers.Size(_53.tileSize,_53.tileSize);
var _67=new Array();
_67=sld2UrlParam(_5f);
_53.oLlayers[_58]=new OpenLayers.Layer.WMS(_57,_59,{layers:layerName,transparent:_60.isBaseLayer?"FALSE":"TRUE",format:_5b,sld:_67.sld,sld_body:_67.sld_body,styles:_67.styles},_60);
break;
case "WFS":
case "wfs":
case "OGC:WFS":
style=sld2OlStyle(_5f);
if(style){
_60.style=style;
}else{
_60.style=_53.getWebSafeStyle(_53,2*i+1);
}
_60.featureClass=OpenLayers.Feature.WFS;
_53.oLlayers[_58]=new OpenLayers.Layer.WFS(_57,_59,{typename:_58,maxfeatures:1000},_60);
break;
case "gml":
case "OGC:GML":
style=sld2OlStyle(_5f);
if(style){
_60.style=style;
}else{
_60.style=_53.getWebSafeStyle(_53,2*i+1);
}
_53.oLlayers[_58]=new OpenLayers.Layer.GML(_57,_59,_60);
break;
case "KML":
case "kml":
_53.oLlayers[_58]=new OpenLayers.Layer.GML(_57,_59,{format:OpenLayers.Format.KML});
break;
default:
alert(mbGetMessage("layerTypeNotSupported",_56));
}
if(_5e&&_53.oLlayers[_58]){
_53.oLlayers[_58].setOpacity(_5e);
}
_53.oLlayers[_58].events.register("loadstart",_53,_53.increaseLoadingLayers);
_53.oLlayers[_58].events.register("loadend",_53,_53.decreaseLoadingLayers);
_53.model.map.addLayer(_53.oLlayers[_58]);
};
MapPaneOL.prototype.getWebSafeStyle=function(_69,_6a){
colors=new Array("00","33","66","99","CC","FF");
_6a=(_6a)?_6a:0;
_6a=(_6a<0)?0:_6a;
_6a=(_6a>215)?215:_6a;
i=parseInt(_6a/36);
j=parseInt((_6a-i*36)/6);
k=parseInt((_6a-i*36-j*6));
var _6b="#"+colors[i]+colors[j]+colors[k];
var _6c={fillColor:"#808080",fillOpacity:1,strokeColor:"#000000",strokeOpacity:1,strokeWidth:1,pointRadius:6};
var _6d=OpenLayers.Util.extend(_6c,OpenLayers.Feature.Vector.style["default"]);
_6d.fillColor=_6b;
_6d.strokeColor=_6b;
_6d.map=_69.model.map;
return _6d;
};
MapPaneOL.prototype.refreshLayer=function(_6e,_6f,_70){
_70["version"]=Math.random();
_6e.getLayer(_6e,_6f).mergeNewParams(_70);
};
MapPaneOL.prototype.timestampListener=function(_71,_72){
if(window.movieLoop.frameIsLoading==true){
return;
}
var _73=_71.model.timestampList.getAttribute("layerId");
var ts=_71.model.timestampList.childNodes[_72];
if(_73&&ts){
var _75=_71.oLlayers[_73];
if(!_75.grid){
return;
}
div=_75.grid[0][0].imgDiv;
var _76=div.src||div.firstChild.src;
var _77=_76.replace(/TIME\=.*?\&/,"TIME="+ts.firstChild.nodeValue+"&");
if(_76==_77){
return;
}
function imageLoaded(){
window.movieLoop.frameIsLoading=false;
if(element.removeEventListener){
element.removeEventListener("load",imageLoaded,false);
}else{
if(element.detachEvent){
element.detachEvent("onload",imageLoaded);
}
}
}
window.movieLoop.frameIsLoading=true;
var _78=div.nodeName.toUpperCase()=="IMG"?div:div.firstChild;
if(_78.addEventListener){
_78.addEventListener("load",imageLoaded,false);
}else{
if(_78.attachEvent){
_78.attachEvent("onload",imageLoaded);
}
}
if(_71.IE6){
OpenLayers.Util.modifyAlphaImageDiv(div,null,null,null,_77);
}else{
_78.src=_77;
}
}
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
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
_a.proj=new Proj4js.Proj(_a.model.getSRS());
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
var pt=new Proj4js.Point(_e.lon,_e.lat);
Proj4js.transform(this.proj,Proj4js.WGS84,pt);
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
this.textMessage=mbGetMessage("docLoading");
}
this.updateMessage=this.textMessage;
this.mapContainerNode=_1.selectSingleNode("mb:mapContainerId");
if(this.mapContainerNode){
this.containerNodeId=this.mapContainerNode.firstChild.nodeValue;
this.htmlTagId=this.containerNodeId;
}
this.model.addListener("newModel",this.paint,this);
this.model.addListener("loadModel",this.clear,this);
this.model.addListener("refresh",this.paint,this);
this.model.addListener("modelStatus",this.update,this);
}
Loading2.prototype.paint=function(_5){
var _6=_5.getNode();
if(_6){
if(_5.model.template){
return;
}
if(!_5.model.url&&!_5.mapContainerNode){
return;
}
var _7=document.getElementById(_5.outputNodeId+"_loading");
if(!_7){
_7=document.createElement("div");
_7.setAttribute("id",_5.outputNodeId+"_loading");
_6.appendChild(_7);
}
_7.className="loadingIndicator";
_7.style.zIndex=10001;
if(_5.mapContainerNode){
_7.style.position="absolute";
_7.style.left="0px";
_7.style.top="0px";
}
if(_5.imageSrc){
var _8=document.getElementById(_5.outputNodeId+"_imageNode");
if(!_8){
_8=document.createElement("img");
_8.setAttribute("id",_5.outputNodeId+"_imageNode");
_7.appendChild(_8);
_8.style.zIndex=10001;
}
_8.src=_5.imageSrc;
}
if(_5.updateMessage){
var _9=document.getElementById(_5.outputNodeId+"_messageNode");
if(!_9){
_9=document.createElement("p");
_9.setAttribute("id",_5.outputNodeId+"_messageNode");
_7.appendChild(_9);
}
_9.innerHTML=_5.updateMessage;
}
}
};
Loading2.prototype.clear=function(_a,_b){
var _c=document.getElementById(_a.outputNodeId+"_loading");
var _d=_a.getNode();
if(_d&&_c){
_d.removeChild(_c);
}
};
Loading2.prototype.update=function(_e,_f){
_e.updateMessage=_f||null;
if(_f){
_e.paint(_e);
}else{
_e.clear(_e);
}
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function PanZoomBar(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
this.init=function(_3){
_3.model.map.addControl(new OpenLayers.Control.PanZoomBar());
_3.model.map.addControl(new OpenLayers.Control.Navigation());
_3.model.map.addControl(new OpenLayers.Control.KeyboardDefaults());
};
this.model.addListener("refresh",this.init,this);
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
if(_3.control.active){
if(_3.trm&&!_3.transactionResponseModel){
_3.transactionResponseModel=window.config.objects[_3.trm];
}
if(!_4&&_3.transactionResponseModel){
_3.transactionResponseModel.setModel(_3.transactionResponseModel,null);
}
config.loadModel(_3.targetModel.id,_3.defaultModelUrl);
}
};
this.newSession=function(_5){
_5.modified=false;
};
this.handleFeatureInsert=function(_6){
var _7=_6.layer.mbButton;
_7.geometry=OpenLayers.Util.extend({},_6.geometry);
var _8=_7.targetModel.doc.selectSingleNode("/*/*").cloneNode(true);
if(_7.modified){
_7.targetModel.doc.selectSingleNode("/*").appendChild(_8);
}
_7.setFeature(_7);
_7.modified=true;
_6.mbSelectStyle=null;
_6.destroy();
};
this.setEditingLayer=function(_9){
if(!_9.targetContext.featureLayers[_9.id]){
_9.featureLayer=new OpenLayers.Layer.Vector(_9.id);
_9.featureLayer.calculateInRange=function(){
return true;
};
_9.featureLayer.mbButton=_9;
_9.targetContext.featureLayers[_9.id]=_9.featureLayer;
_9.featureLayer.onFeatureInsert=_9.handleFeatureInsert;
}
};
this.initButton=function(_a){
if(!_a.targetContext.featureLayers){
_a.targetContext.featureLayers=new Array();
}
_a.targetContext.addFirstListener("refresh",_a.setEditingLayer,_a);
_a.targetModel.addListener("loadModel",_a.newSession,_a);
};
this.model.addListener("init",this.initButton,this);
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditLine(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control.DrawFeature,{type:OpenLayers.Control.TYPE_TOOL,CLASS_NAME:"mbEditLine"});
return _4;
};
this.instantiateControl=function(_5,_6){
return new _6(_5.featureLayer,OpenLayers.Handler.Path);
};
this.setFeature=function(_7){
if(_7.enabled&&_7.geometry){
var _8=_7.geometry.components;
var _9="";
for(var i in _8){
_9+=" "+_8[i].x+","+_8[i].y;
}
sucess=_7.targetModel.setXpathValue(_7.targetModel,_7.featureXpath,_9);
_7.geometry=null;
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathEditLine",_7.featureXpath));
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditPoint(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control.DrawFeature,{type:OpenLayers.Control.TYPE_TOOL,CLASS_NAME:"mbEditPoint"});
return _4;
};
this.instantiateControl=function(_5,_6){
return new _6(_5.featureLayer,OpenLayers.Handler.Point);
};
this.setFeature=function(_7){
if(_7.enabled&&_7.geometry){
sucess=_7.targetModel.setXpathValue(_7.targetModel,_7.featureXpath,_7.geometry.x+","+_7.geometry.y);
_7.geometry=null;
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathEditPoint",_7.featureXpath));
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditPolygon(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control.DrawFeature,{type:OpenLayers.Control.TYPE_TOOL,CLASS_NAME:"mbEditPolygon"});
return _4;
};
this.instantiateControl=function(_5,_6){
return new _6(_5.featureLayer,OpenLayers.Handler.Polygon);
};
this.setFeature=function(_7){
if(_7.enabled&&_7.geometry){
var _8=_7.geometry.components[0].components;
var _9="";
for(var i in _8){
_9+=" "+_8[i].x+","+_8[i].y;
}
sucess=_7.targetModel.setXpathValue(_7.targetModel,_7.featureXpath,_9);
_7.geometry=null;
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathEditPolygon",_7.featureXpath));
}
}
};
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
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbInsertFeature",type:OpenLayers.Control.TYPE_BUTTON});
return _4;
};
this.doSelect=function(_5,_6){
if(_6){
if(!_5.transactionResponseModel){
_5.transactionResponseModel=window.config.objects[_5.trm];
_5.transactionResponseModel.addListener("loadModel",_5.handleResponse,_5);
}
if(!_5.targetModel){
_5.targetModel=window.config.objects[_5.tm];
}
if(!_5.targetContext){
_5.targetContext=window.config.objects[_5.tc];
}
fid=_5.targetModel.getXpathValue(_5.targetModel,"//@fid");
if(_5.targetModel.doc){
if(fid){
s=_5.updateXsl.transformNodeToObject(_5.targetModel.doc);
}else{
s=_5.insertXsl.transformNodeToObject(_5.targetModel.doc);
}
_5.httpPayload.postData=s;
_5.transactionResponseModel.transactionType="insert";
_5.transactionResponseModel.newRequest(_5.transactionResponseModel,_5.httpPayload);
}else{
alert(mbGetMessage("noFeatureToInsert"));
}
}
};
this.handleResponse=function(_7){
if(_7.transactionResponseModel.transactionType=="insert"){
success=_7.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
if(success){
config.loadModel(_7.targetModel.id,_7.targetModel.url);
_7.targetContext.callListeners("refreshWmsLayers");
}
}
};
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
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbDeleteFeature",type:OpenLayers.Control.TYPE_BUTTON});
return _4;
};
this.doSelect=function(_5,_6){
if(_6){
if(!_5.transactionResponseModel){
_5.transactionResponseModel=window.config.objects[_5.trm];
_5.transactionResponseModel.addListener("loadModel",_5.handleResponse,_5);
}
if(!_5.targetModel){
_5.targetModel=window.config.objects[_5.tm];
}
if(!_5.targetContext){
_5.targetContext=window.config.objects[_5.tc];
}
fid=_5.targetModel.getXpathValue(_5.targetModel,"//@fid");
if(_5.targetModel.doc&&fid){
s=_5.deleteXsl.transformNodeToObject(_5.targetModel.doc);
_5.httpPayload.postData=s;
_5.transactionResponseModel.transactionType="delete";
_5.transactionResponseModel.newRequest(_5.transactionResponseModel,_5.httpPayload);
}else{
alert(mbGetMessage("noFeatureToDelete"));
}
}
};
this.handleResponse=function(_7){
if(_7.transactionResponseModel.transactionType=="delete"){
success=_7.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
if(success){
_7.targetModel.setModel(_7.targetModel,null);
_7.targetModel.callListeners("refreshGmlRenderers");
_7.targetContext.callListeners("refreshWmsLayers");
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function WfsGetFeature(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.widgetNode=_1;
this.trm=_1.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
this.httpPayload=new Object({method:"get",postData:null});
var _3=_1.selectSingleNode("mb:typeName");
if(_3!=null){
this.typeName=_3.firstChild.nodeValue;
}
this.maxFeatures=_1.selectSingleNode("mb:maxFeatures");
this.maxFeatures=this.maxFeatures?this.maxFeatures.firstChild.nodeValue:1;
this.webServiceUrl=_1.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
this.webServiceUrl+=this.webServiceUrl.indexOf("?")>-1?"&":"?";
this.cursor="pointer";
this.createControl=function(_4){
var _5=config.objects[_4.trm];
var _6=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl.WfsGetFeature",type:OpenLayers.Control.TYPE_TOOL,tolerance:new Number(_4.widgetNode.selectSingleNode("mb:tolerance").firstChild.nodeValue),httpPayload:_4.httpPayload,maxFeatures:_4.maxFeatures,webServiceUrl:_4.webServiceUrl,transactionResponseModel:_5,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.selectBox},{keyMask:this.keyMask});
},selectBox:function(_7){
var _8,minXY,maxXY;
if(_7 instanceof OpenLayers.Bounds){
minXY=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_7.left,_7.bottom));
maxXY=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_7.right,_7.top));
}else{
minXY=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_7.x-this.tolerance,_7.y+this.tolerance));
maxXY=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_7.x+this.tolerance,_7.y-this.tolerance));
}
_8=new OpenLayers.Bounds(minXY.lon,minXY.lat,maxXY.lon,maxXY.lat);
var _9=_4.typeName;
if(!_9){
var _a=_4.targetModel.getQueryableLayers();
if(_a.length==0){
alert(mbGetMessage("noQueryableLayers"));
return;
}else{
_9="";
for(var i=0;i<_a.length;++i){
var _c=_a[i];
var _d=_c.selectSingleNode("wmc:Name");
_d=(_d)?_d.firstChild.nodeValue:"";
var _e=_c.getAttribute("id")||_d;
var _f=_4.targetModel.getHidden(_e);
if(_f==0){
if(_9!=""){
_9+=",";
}
_9+=_d;
}
}
}
}
if(_9==""){
alert(mbGetMessage("noQueryableLayersVisible"));
return;
}
this.httpPayload.url=this.webServiceUrl+OpenLayers.Util.getParameterString({SERVICE:"WFS",VERSION:"1.0.0",REQUEST:"GetFeature",TYPENAME:_9,MAXFEATURES:this.maxFeatures,BBOX:_8.toBBOX()});
this.transactionResponseModel.newRequest(this.transactionResponseModel,this.httpPayload);
}});
return _6;
};
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
function Version(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function OverviewMap(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:width");
if(_3){
this.width=new Number(_3.firstChild.nodeValue);
}
var _4=_1.selectSingleNode("mb:height");
if(_4){
this.height=new Number(_4.firstChild.nodeValue);
}
var _5=_1.selectSingleNode("mb:minRatio");
if(_5){
this.minRatio=new Number(_5.firstChild.nodeValue);
}
var _6=_1.selectSingleNode("mb:maxRatio");
if(_6){
this.maxRatio=new Number(_6.firstChild.nodeValue);
}
var _7=_1.selectSingleNode("mb:layers");
if(_7){
this.layerNames=new Array();
var _8=_7.childNodes;
for(var i=0;i<_8.length;i++){
if(_8[i].firstChild){
this.layerNames.push(_8[i].firstChild.nodeValue);
}
}
}
this.model.addListener("refresh",this.addOverviewMap,this);
}
OverviewMap.prototype.addOverviewMap=function(_a){
if(_a.model&&_a.model.map){
var _b=_a.model.map;
this.control=null;
var _c={div:_a.getNode(),objRef:this,destroy:function(){
OpenLayers.Control.OverviewMap.prototype.destroy.apply(this,arguments);
this.div=null;
_a.control=null;
_a=null;
},layers:new Array()};
if(_a.minRatio){
_c.minRatio=_a.minRatio;
}
if(_a.maxRatio){
_c.maxRatio=_a.maxRatio;
}
if(!_a.layerNames){
for(var i in _b.mbMapPane.oLlayers){
var _e=_b.mbMapPane.oLlayers[i];
if(_e){
var _f=_a.getClonedLayer(_e,true);
_c.layers.push(_f);
break;
}
}
}
var _10=true;
if(_a.layerNames){
for(var i=0;i<_a.layerNames.length;i++){
var _e=_b.mbMapPane.getLayer(_b.mbMapPane,_a.layerNames[i]);
if(_e){
_c.layers.push(_a.getClonedLayer(_e,_10));
_10=false;
}
}
}
var _11=_b.getExtent();
if(_a.width&&_a.height){
_c.size=new OpenLayers.Size(_a.width,_a.height);
}else{
if(_a.width){
_c.size=new OpenLayers.Size(_a.width,_a.width*_11.getHeight()/_11.getWidth());
}else{
if(_a.height){
_c.size=new OpenLayers.Size(_a.height*_11.getWidth()/_11.getHeight(),_a.height);
}
}
}
if(!_a.control){
_a.control=new OpenLayers.Control.OverviewMap(_c);
_a.control.mapOptions={theme:null};
_b.addControl(_a.control);
}
for(var i in _c.layers){
_c.layers[i].setVisibility(true);
}
}
};
OverviewMap.prototype.getClonedLayer=function(_12,_13){
if(_12==null){
return null;
}
_13=_13?true:false;
if(_12 instanceof OpenLayers.Layer.WMS){
var _14={units:_12.units,projection:_12.projection,maxExtent:_12.maxExtent,maxResolution:"auto",ratio:1,singleTile:true,isBaseLayer:_13};
return new OpenLayers.Layer.WMS(_12.name,_12.url,{layers:_12.params.LAYERS,format:_12.params.FORMAT,transparent:_12.params.TRANSPARENT,sld:_12.params.SLD,sld_body:_12.params.SLD_BODY,styles:_12.params.STYLES},_14);
}else{
var _15=_12.clone();
_15.setVisibility(true);
return _15;
}
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function TransactionResponse(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Model(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Context(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";
this.setHidden=function(_3,_4){
var _5="0";
if(_4){
_5="1";
}
var _6=this.getLayer(_3);
if(_6){
_6.setAttribute("hidden",_5);
}
this.callListeners("hidden",_3);
};
this.getHidden=function(_7){
var _8=1;
var _9=this.getLayer(_7);
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
_15.proj=new Proj4js.Proj(_15.getSRS());
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
var _27=this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer[attribute::queryable='1']");
return _27;
};
this.getAllLayers=function(){
var _28=this.doc.selectNodes("/wmc:ViewContext/wmc:LayerList/wmc:Layer");
return _28;
};
this.getLayer=function(_29){
var _2a=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[@id='"+_29+"']");
if(_2a==null){
_2a=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_29+"']");
}
return _2a;
};
this.getLayerIdByName=function(_2b){
var _2c=this.getLayer(_2b);
var id;
if(_2c){
id=_2c.getAttribute("id");
}
return id||false;
};
this.addLayer=function(_2e,_2f){
var _30=_2e.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList");
_30.appendChild(_2f);
if(!_2f.getAttribute("id")){
var _31=Math.round(10000*Math.random());
id=_2f.selectSingleNode("wmc:Name").firstChild.nodeValue+"_"+_31;
_2f.setAttribute("id",id);
}
_2e.modified=true;
};
this.addFirstListener("addLayer",this.addLayer,this);
this.addSLD=function(_32,_33){
var _34=_33.selectSingleNode("//Name").firstChild.nodeValue;
var _35=_32.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_34+"']");
_35.appendChild(_33.cloneNode(true));
_32.modified=true;
var _36=[];
_36["sld_body"]=(new XMLSerializer()).serializeToString(_32.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_34+"']/wmc:StyleList/wmc:Style/wmc:SLD/wmc:StyledLayerDescriptor"));
_32.map.mbMapPane.refreshLayer(_32.map.mbMapPane,_34,_36);
};
this.addFirstListener("addSLD",this.addSLD,this);
this.deleteLayer=function(_37,_38){
var _39=_37.getLayer(_38);
if(!_39){
alert(mbGetMessage("nodeNotFound",_38));
return;
}
_39.parentNode.removeChild(_39);
_37.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_3a,_3b){
var _3c=_3a.getLayer(_3b);
var _3d=_3c.selectSingleNode("following-sibling::*");
if(!_3d){
alert(mbGetMessage("cantMoveUp",_3b));
return;
}
_3c.parentNode.insertBefore(_3d,_3c);
_3a.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_3e,_3f){
var _40=_3e.getLayer(_3f);
var _41=_40.selectNodes("preceding-sibling::*");
var _42=_41[_41.length-1];
if(!_42){
alert(mbGetMessage("cantMoveDown",_3f));
return;
}
_40.parentNode.insertBefore(_40,_42);
_3e.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.setExtension=function(_43){
var _44=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
if(!_44){
var _45=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General");
var _46=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_44=_45.appendChild(_46);
}
return _44.appendChild(_43);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
};
this.initTimeExtent=function(_47){
var _48=_47.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_48.length;++i){
var _4a=_48[i];
_47.timestampList=createElementWithNS(_47.doc,"TimestampList",mbNsUrl);
var _4b;
var _4c=_4a.parentNode.parentNode;
if(_4c.selectSingleNode("@id")){
_4b=_4c.selectSingleNode("@id").firstChild.nodeValue;
}else{
_4b=_4c.selectSingleNode("wmc:Name").firstChild.nodeValue;
}
_47.timestampList.setAttribute("layerId",_4b);
var _4d=_4a.firstChild.nodeValue.split(",");
for(var j=0;j<_4d.length;++j){
var _4f=_4d[j].split("/");
if(_4f.length==3){
var _50=setISODate(_4f[0]);
var _51=setISODate(_4f[1]);
var _52=_4f[2];
var _53=_52.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_53.length;++i){
if(!_53[i]){
_53[i]=0;
}
}
do{
var _54=createElementWithNS(_47.doc,"Timestamp",mbNsUrl);
_54.appendChild(_47.doc.createTextNode(getISODate(_50)));
_47.timestampList.appendChild(_54);
_50.setFullYear(_50.getFullYear()+parseInt(_53[2],10));
_50.setMonth(_50.getMonth()+parseInt(_53[4],10));
_50.setDate(_50.getDate()+parseInt(_53[6],10));
_50.setHours(_50.getHours()+parseInt(_53[8],10));
_50.setMinutes(_50.getMinutes()+parseInt(_53[10],10));
_50.setSeconds(_50.getSeconds()+parseFloat(_53[12]));
}while(_50.getTime()<=_51.getTime());
}else{
var _54=createElementWithNS(_47.doc,"Timestamp",mbNsUrl);
_54.appendChild(_47.doc.createTextNode(_4d[j]));
_47.timestampList.appendChild(_54);
}
}
_47.setExtension(_47.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.clearTimeExtent=function(_55){
var _56=_55.timestampList;
if(_56){
_56.parentNode.removeChild(_56);
}
};
this.addListener("newModel",this.clearTimeExtent,this);
this.getCurrentTimestamp=function(_57){
var _58=this.getParam("timestamp");
return this.timestampList.childNodes[_58].firstChild.nodeValue;
};
this.setOpacity=function(_59,_5a){
var _5b=this.getLayer(_59);
if(_5b){
_5b.setAttribute("opacity",_5a);
}
this.callListeners("opacity",_59);
};
this.getOpacity=function(_5c){
var _5d=1;
var _5e=this.getLayer(_5c);
if(_5e){
_5d=_5e.getAttribute("opacity");
}
return _5d;
};
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function OwsContext(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace=this.namespace?this.namespace.replace(/\"/g,"'")+" ":"";
this.namespace=this.namespace+"xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs' xmlns:sld='http://www.opengis.net/sld'";
this.setHidden=function(_3,_4){
var _5="0";
if(_4){
_5="1";
}
var _6=this.getLayer(_3);
if(_6){
_6.setAttribute("hidden",_5);
}
this.callListeners("hidden",_3);
};
this.getHidden=function(_7){
var _8=1;
var _9=this.getFeatureNode(_7);
if(_9){
_8=_9.getAttribute("hidden");
}
return _8;
};
this.getBoundingBox=function(){
var _a=new Array();
var _b=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:LowerCorner");
var _c=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox/ows:UpperCorner");
var _d=new String(_b.firstChild.nodeValue+" "+_c.firstChild.nodeValue).split(" ");
for(i=0;i<_d.length;++i){
_a[i]=parseFloat(_d[i]);
}
return _a;
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
var _17=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/ows:BoundingBox");
srs=_17.getAttribute("crs");
srs=srs?srs:"EPSG:4326";
return srs;
};
this.initProj=function(_18){
_18.proj=new Proj4js.Proj(_18.getSRS());
};
this.addFirstListener("loadModel",this.initProj,this);
this.getWindowWidth=function(){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
return win.getAttribute("width");
};
this.setWindowWidth=function(_1a){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
win.setAttribute("width",_1a);
this.callListeners("resize");
};
this.getWindowHeight=function(){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
return win.getAttribute("height");
};
this.setWindowHeight=function(_1d){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
win.setAttribute("height",_1d);
this.callListeners("resize");
};
this.getWindowSize=function(){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
return new Array(win.getAttribute("width"),win.getAttribute("height"));
};
this.setWindowSize=function(_20){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
var _22=_20[0];
var _23=_20[1];
win.setAttribute("width",_22);
win.setAttribute("height",_23);
this.callListeners("resize");
};
this.getFeatureNode=function(_24){
if(this.doc){
var _25=this.doc.selectSingleNode("//wmc:ResourceList/*[@id='"+_24+"']");
if(_25==null){
_25=this.doc.selectSingleNode("//wmc:ResourceList/*[wmc:Name='"+_24+"']");
}
if(_25==null){
alert(mbGetMessage("featureNotFoundOwsContext"));
}
return _25;
}
};
this.getServerUrl=function(_26,_27,_28){
var _29=_26.split(":");
if(_29.length>0){
_29=_29[0].toUpperCase();
}
var url=_28.selectSingleNode("wmc:Server[@service='OGC:"+_29+"']/wmc:OnlineResource").getAttribute("xlink:href");
if(!url){
url=_28.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
}
return url;
};
this.getVersion=function(_2b){
return _2b.selectSingleNode("wmc:Server").getAttribute("version");
};
this.getMethod=function(_2c){
return _2c.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
};
this.getBaseLayerService=function(){
x=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[last()]/wmc:Server");
s=x.getAttribute("service");
return s;
};
this.loadFeatures=function(_2d){
var _2e=_2d.nodeSelectXpath+"/wmc:FeatureType[wmc:Server/@service='OGC:WFS']/wmc:Name";
var _2f=_2d.doc.selectNodes(_2e);
for(var i=0;i<_2f.length;i++){
var _31=_2f[i].firstChild.nodeValue;
_2d.setParam("wfs_GetFeature",_31);
}
};
this.addListener("loadModel",this.loadFeatures,this);
this.setRequestParameters=function(_32,_33){
var _34=this.getFeatureNode(_32);
if(_34.selectSingleNode("ogc:Filter")){
_33.setParameter("filter",escape((new XMLSerializer()).serializeToString(_34.selectSingleNode("ogc:Filter"))));
}
};
this.getQueryableLayers=function(){
var _35=this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[@queryable='1']|/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType[@queryable='1']");
if(_35==null){
_35=this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer|/wmc:OWSContext/wmc:ResourceList/wmc:Layer");
}
return _35;
};
this.getAllLayers=function(){
var _36=this.doc.selectNodes("//wmc:Layer|//wmc:FeatureType");
return _36;
};
this.getLayer=function(_37){
var _38=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType[@id='"+_37+"']");
if(_38==null){
_38=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[@id='"+_37+"']");
}
if(_38==null){
_38=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_37+"']");
}
if(_38==null){
_38=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType[wmc:Name='"+_37+"']");
}
if(_38==null){
_38=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:RssLayer[@id='"+_37+"']");
}
return _38;
};
this.getLayerIdByName=function(_39){
var _3a=this.getLayer(_39);
var id;
if(_3a){
id=_3a.getAttribute("id");
}
return id||false;
};
this.addLayer=function(_3c,_3d){
if(_3c.doc!=null){
var _3e=_3c.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList");
_3e.appendChild(_3d);
var _3f=Math.round(10000*Math.random());
id=_3d.selectSingleNode("wmc:Name").firstChild.nodeValue+"_"+_3f;
_3d.setAttribute("id",id);
var id=_3d.getAttribute("id");
var str="/wmc:OWSContext/wmc:ResourceList/"+_3d.nodeName+"[@id='"+id+"']";
var _42=_3c.doc.selectSingleNode(str);
if(_42!=null){
_3e.removeChild(_42);
}
_3c.modified=true;
if(this.debug){
mbDebugMessage("Adding layer:"+(new XMLSerializer()).serializeToString(_3d));
}
}else{
alert(mbGetMessage("nullOwsContext"));
}
};
this.addFirstListener("addLayer",this.addLayer,this);
this.getBaseLayer=function(){
var _43=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/ows:BaseLayer");
return _43;
};
this.addSLD=function(_44,_45){
var _46=_45.selectSingleNode("//Name").firstChild.nodeValue;
var _47=_44.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_46+"']");
_47.appendChild(_45.cloneNode(true));
_44.modified=true;
var _48=[];
_48["sld_body"]=(new XMLSerializer()).serializeToString(_44.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_46+"']/wmc:StyleList/wmc:Style/wmc:SLD/wmc:StyledLayerDescriptor"));
_44.map.mbMapPane.refreshLayer(_44.map.mbMapPane,_46,_48);
};
this.addFirstListener("addSLD",this.addSLD,this);
this.deleteLayer=function(_49,_4a){
var _4b=_49.getLayer(_4a);
if(!_4b){
alert(mbGetMessage("nodeNotFound",_4a));
return;
}
_4b.parentNode.removeChild(_4b);
_49.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_4c,_4d){
var _4e=_4c.getLayer(_4d);
var _4f=_4e.selectSingleNode("following-sibling::*");
if(!_4f){
alert(mbGetMessage("cantMoveUp",_4d));
return;
}
_4e.parentNode.insertBefore(_4f,_4e);
_4c.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_50,_51){
var _52=_50.getLayer(_51);
var _53=_52.selectNodes("preceding-sibling::*");
var _54=_53[_53.length-1];
if(!_54){
alert(mbGetMessage("cantMoveDown",_51));
return;
}
_52.parentNode.insertBefore(_52,_54);
_50.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.setExtension=function(_55){
var _56=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
if(!_56){
var _57=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General");
var _58=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_56=_57.appendChild(_58);
}
return _56.appendChild(_55);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
};
this.setOpacity=function(_59,_5a){
var _5b=this.getLayer(_59);
if(_5b){
_5b.setAttribute("opacity",_5a);
}
this.callListeners("opacity",_59);
};
this.getOpacity=function(_5c){
var _5d=1;
var _5e=this.getLayer(_5c);
if(_5e){
_5d=_5e.getAttribute("opacity");
}
return _5d;
};
this.initTimeExtent=function(_5f){
var _60=_5f.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_60.length;++i){
var _62=_60[i];
_5f.timestampList=createElementWithNS(_5f.doc,"TimestampList",mbNsUrl);
var _63;
var _64=_62.parentNode.parentNode;
if(_64.selectSingleNode("@id")){
_63=_64.selectSingleNode("@id").firstChild.nodeValue;
}else{
_63=_64.selectSingleNode("wmc:Name").firstChild.nodeValue;
}
_5f.timestampList.setAttribute("layerId",_63);
var _65=_62.firstChild.nodeValue.split(",");
for(var j=0;j<_65.length;++j){
var _67=_65[j].split("/");
if(_67.length==3){
var _68=setISODate(_67[0]);
var _69=setISODate(_67[1]);
var _6a=_67[2];
var _6b=_6a.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_6b.length;++i){
if(!_6b[i]){
_6b[i]=0;
}
}
do{
var _6c=createElementWithNS(_5f.doc,"Timestamp",mbNsUrl);
_6c.appendChild(_5f.doc.createTextNode(getISODate(_68)));
_5f.timestampList.appendChild(_6c);
_68.setFullYear(_68.getFullYear()+parseInt(_6b[2],10));
_68.setMonth(_68.getMonth()+parseInt(_6b[4],10));
_68.setDate(_68.getDate()+parseInt(_6b[6],10));
_68.setHours(_68.getHours()+parseInt(_6b[8],10));
_68.setMinutes(_68.getMinutes()+parseInt(_6b[10],10));
_68.setSeconds(_68.getSeconds()+parseFloat(_6b[12]));
}while(_68.getTime()<=_69.getTime());
}else{
var _6c=createElementWithNS(_5f.doc,"Timestamp",mbNsUrl);
_6c.appendChild(_5f.doc.createTextNode(_65[j]));
_5f.timestampList.appendChild(_6c);
}
}
_5f.setExtension(_5f.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.clearTimeExtent=function(_6d){
var _6e=_6d.timestampList;
if(_6e){
_6e.parentNode.removeChild(_6e);
}
};
this.addListener("newModel",this.clearTimeExtent,this);
this.getCurrentTimestamp=function(_6f){
var _70=this.getParam("timestamp");
return this.timestampList.childNodes[_70].firstChild.nodeValue;
};
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Transaction(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
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
var _a=new Proj4js.Proj(_9.nodeValue);
_7.setParam("modelStatus",mbGetMessage("convertingCoords"));
var _b=new Proj4js.Proj(_7.containerModel.getSRS());
for(var i=0;i<_8.length;++i){
var _d=_8[i].firstChild.nodeValue;
var _e=_d.split(" ");
var _f="";
for(var j=0;j<_e.length;++j){
var xy=_e[j].split(",");
if(xy.length==2){
var pt=new Proj4js.Point(xy[0],xy[1]);
Proj4js.transform(_a,_b,pt);
_f+=pt.join(",")+" ";
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
_16.postData=(new XMLSerializer()).serializeToString(_1a);
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
return this.doc.selectNodes(this.nodeSelectXpath);
};
this.getFeatureName=function(_1e){
var _1f=_1e.selectSingleNode(this.featureTagName);
return _1f?_1f.firstChild.nodeValue:mbGetMessage("noRssTitle");
};
this.getFeatureId=function(_20){
return _20.getAttribute("fid")?_20.getAttribute("fid"):"no_id";
};
this.getFeaturePoint=function(_21){
var _22=_21.selectSingleNode(this.coordSelectXpath);
if(_22){
var _23=_22.firstChild.nodeValue.split(",");
return _23;
}else{
return new Array(0,0);
}
};
this.getFeatureGeometry=function(_24){
var _25=_24.selectSingleNode(this.coordsTagName);
if(_25!=null){
return _25.firstChild;
}else{
alert(mbGetMessage("invalidGeom",(new XMLSerializer()).serializeToString(_24)));
}
};
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function StyledLayerDescriptor(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:sld='http://www.opengis.net/sld' xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:wms='http://www.opengis.net/wms' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:wfs='http://www.opengis.net/wfs'";
var _3=_1.selectSingleNode("mb:sldXPath");
this.sldXPath=_3?_3.firstChild.nodeValue:"/sld:StyledLayerDescriptor";
this.getSldNode=function(){
return this.doc.selectSingleNode(this.sldXPath);
};
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
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

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
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
return this.doc.selectSingleNode(_7).getAttribute("xlink:href");
}
};
this.getVersion=function(){
var _8="/WMT_MS_Capabilities";
return this.doc.selectSingleNode(_8).getAttribute("version");
};
this.getServerTitle=function(){
var _9="/WMT_MS_Capabilities/Service/Title";
var _a=this.doc.selectSingleNode(_9);
return (_a&&_a.firstChild)?_a.firstChild.nodeValue:"no title";
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
return _d.firstChild.nodeValue;
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function Loading(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.paint=function(_3){
var _4=document.getElementById(_3.htmlTagId);
if(_4){
while(_4.childNodes.length>0){
_4.removeChild(_4.childNodes[0]);
}
}
};
this.model.addListener("refresh",this.paint,this);
}

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
var _4=_1.selectSingleNode("mb:parseHTMLNodes");
this.parseHTMLNodes=_4?getNodeValue(_4):false;
this.parseHTMLNodes=(this.parseHTMLNodes&&this.parseHTMLNodes.toLowerCase()=="true")?true:false;
if(config.widgetText){
var _5="/mb:WidgetText/mb:widgets/mb:"+_1.nodeName;
var _6=config.widgetText.selectNodes(_5+"/*");
for(var j=0;j<_6.length;j++){
this.stylesheet.setParameter(_6[j].nodeName,_6[j].firstChild.nodeValue);
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
this.paint=function(_8,_9){
if(_9&&(_9!=_8.id)){
return;
}
if(_8.model.doc&&_8.getNode()){
_8.stylesheet.setParameter("modelUrl",_8.model.url);
_8.stylesheet.setParameter("targetModelId",_8.targetModel.id);
_8.resultDoc=_8.model.doc;
_8.prePaint(_8);
if(_8.debug){
mbDebugMessage(_8,"prepaint:"+(new XMLSerializer()).serializeToString(_8.resultDoc));
}
if(_8.debug){
mbDebugMessage(_8,"stylesheet:"+(new XMLSerializer()).serializeToString(_8.stylesheet.xslDom));
}
var _a=document.getElementById(_8.outputNodeId);
var _b=document.createElement("DIV");
var s=_8.stylesheet.transformNodeToString(_8.resultDoc);
if(config.serializeUrl&&_8.debug){
postLoad(config.serializeUrl,s);
}
if(_8.debug){
mbDebugMessage(_8,"painting:"+_8.id+":"+s);
}
_b.innerHTML=_8.parseHTMLNodes?Sarissa.unescape(s):s;
if(_b.firstChild!=null){
_b.firstChild.setAttribute("id",_8.outputNodeId);
if(_a){
_8.getNode().replaceChild(_b.firstChild,_a);
}else{
_8.getNode().appendChild(_b.firstChild);
}
}
_8.postPaint(_8);
}
};
this.model.addListener("refresh",this.paint,this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function TipWidgetBase(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:width");
this.width=_3?_3.firstChild.nodeValue:200;
var _4=_1.selectSingleNode("mb:height");
this.height=_4?_4.firstChild.nodeValue:150;
var _5=_1.selectSingleNode("mb:opacity");
this.opacity=_5?_5.firstChild.nodeValue:1;
var _6=_1.selectSingleNode("mb:backgroundColor");
this.backgroundColor=_6?_6.firstChild.nodeValue:"D0D0D0";
var _7=_1.selectSingleNode("mb:border");
this.border=_7?_7.firstChild.nodeValue:"0px";
this.config=new Object({model:_2,stylesheet:this.stylesheet,width:this.width,height:this.height,opacity:this.opacity,backgroundColor:this.backgroundColor,border:this.border});
}

mapbuilder.loadScript(baseDir+"/widget/TipWidgetBase.js");
function TipWidgetConfig(_1,_2){
TipWidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:targetWidget");
_3=_3?_3.firstChild.nodeValue:null;
this.init=function(_4){
if(_3){
if(!_2.config){
_2.config=new Array();
}
_2.config[_3]=_4.config;
}
};
_2.addListener("init",this.init,this);
}

mapbuilder.loadScript(baseDir+"/widget/TipWidgetBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function TipWidgetOL(_1,_2){
TipWidgetBase.apply(this,new Array(_1,_2));
this.onClick=function(_3){
var _4=_3.model.getParam("olFeatureSelect");
var _5=_3.createPopup(_3,_4,false);
_4.feature.layer.mbClickPopup=_5;
};
this.onMouseover=function(_6){
var _7=_6.model.getParam("olFeatureHover");
if(_7.feature&&!_7.feature.layer.mbClickPopup||!_7.feature.layer.mbClickPopup.visible()){
var _8=_6.createPopup(_6,_7,true);
_7.feature.layer.mbHoverPopup=_8;
_8.events.register("mouseover",_8,_8.hide);
}
};
this.onMouseout=function(_9){
var _a=_9.model.getParam("olFeatureOut");
if(_a&&_a.layer&&_a.layer.mbHoverPopup){
_a.layer.mbHoverPopup.destroy();
_a.layer.mbHoverPopup=null;
}
};
this.createPopup=function(_b,_c,_d){
var _e=_c.feature;
var _f=_b.model.doc.selectSingleNode("//*[@fid='"+_e.fid+"']");
var _10=null;
if(_f){
_10=_f.getAttribute("sourceModel");
}
var _11=null;
if(_10&&config.objects[_10].config&&config.objects[_10].config[_b.id]){
_11=config.objects[_10].config[_b.id];
}else{
_11=_b.config;
}
_11.stylesheet.setParameter("fid",_e.fid);
var _12=_e.layer.map.getLonLatFromPixel(_c.xy);
var _13=new OpenLayers.Popup.Anchored();
_13.padding=0;
_13.initialize(null,_12,new OpenLayers.Size(_11.width,_11.height),new XMLSerializer().serializeToString(_11.stylesheet.transformNodeToObject(_11.model.doc)).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&"),null,_d==false);
_13.setOpacity(_11.opacity);
_13.setBackgroundColor(_11.backgroundColor);
_13.setBorder(_11.border);
var _14=_e.layer.map.getExtent().determineQuadrant(_12);
var _15=_14.charAt(1)=="r"?-5:5;
var _16=_14.charAt(0)=="t"?5:-5;
_13.anchor={size:new OpenLayers.Size(0,0),offset:new OpenLayers.Pixel(_15,_16)};
_e.layer.map.addPopup(_13,true);
return _13;
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function GmlRendererBase(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:featureSRS");
this.featureSRS=_3?getNodeValue(_3):null;
var _4=_1.selectSingleNode("mb:hoverCursor");
this.hoverCursor=_4?_4.firstChild.nodeValue:"pointer";
this.sldModelNode=_1.selectSingleNode("mb:sldModel");
var _5=_1.selectSingleNode("mb:defaultStyleName");
this.defaultStyleName=_5?_5.firstChild.nodeValue:"default";
var _6=_1.selectSingleNode("mb:selectStyleName");
this.selectStyleName=_6?_6.firstChild.nodeValue:"selected";
this.config=new Object({model:_2,hoverCursor:this.hoverCursor,sldModelNode:this.sldModelNode,defaultStyleName:this.defaultStyleName,selectStyleName:this.selectStyleName,featureSRS:this.featureSRS});
}

mapbuilder.loadScript(baseDir+"/widget/GmlRendererBase.js");
function GmlRendererConfig(_1,_2){
GmlRendererBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:targetWidget");
_3=_3?_3.firstChild.nodeValue:null;
this.init=function(_4){
if(_3){
if(!_2.config){
_2.config=new Array();
}
_2.config[_3]=_4.config;
}
};
_2.addListener("init",this.init,this);
}

mapbuilder.loadScript(baseDir+"/widget/GmlRendererBase.js");
function GmlRendererOL(_1,_2){
GmlRendererBase.apply(this,new Array(_1,_2));
var _3=OpenLayers.Class(OpenLayers.Layer.GML,{loadGML:function(){
if(!this.loaded){
var _4=new OpenLayers.Format.GML();
try{
this.proj=new Proj4js.Proj(this.projection);
this.addFeatures(_4.read(this.mbWidget.renderDoc));
this.loaded=true;
}
catch(e){
}
}
},calculateInRange:function(){
return true;
},preFeatureInsert:function(_5){
if(_5.geometry){
var _6=this.mbWidget.model.doc.selectSingleNode("//*[@fid='"+_5.fid+"']");
var _7=null;
if(_6){
_7=_6.getAttribute("sourceModel");
}
var _8=null;
if(_7&&config.objects[_7].config&&config.objects[_7].config[this.mbWidget.id]){
_8=config.objects[_7].config[this.mbWidget.id];
}else{
_8=this.mbWidget.config;
}
if(!_8.sourceSRS){
if(_8.featureSRS){
_8.sourceSRS=new Proj4js.Proj(_8.featureSRS);
}else{
_8.sourceSRS=null;
}
}
if(_8.defaultStyle){
if(_5.geometry.CLASS_NAME.indexOf("Point")>-1){
_5.style=_8.defaultStyle.point;
}else{
if(_5.geometry.CLASS_NAME.indexOf("Line")>-1){
_5.style=_8.defaultStyle.line;
}else{
if(_5.geometry.CLASS_NAME.indexOf("Polygon")>-1){
_5.style=_8.defaultStyle.polygon;
}
}
}
}
if(_8.selectStyle){
if(_5.geometry.CLASS_NAME.indexOf("Point")>-1){
_5.mbSelectStyle=_8.selectStyle.point;
}else{
if(_5.geometry.CLASS_NAME.indexOf("Line")>-1){
_5.mbSelectStyle=_8.selectStyle.line;
}else{
if(_5.geometry.CLASS_NAME.indexOf("Polygon")>-1){
_5.mbSelectStyle=_8.selectStyle.polygon;
}
}
}
}
if(_8.sourceSRS){
this.convertPoints(_5.geometry,_8.sourceSRS);
}
}
},convertPoints:function(_9,_a){
if(_9.CLASS_NAME=="OpenLayers.Geometry.Point"){
_9=Proj4js.transform(_a,this.proj,_9);
}else{
for(var i=0;i<_9.components.length;++i){
this.convertPoints(_9.components[i],_a);
}
}
},getFeatureByFid:function(_c){
if(!this.features){
return null;
}
for(var i=0;i<this.features.length;++i){
if(this.features[i].fid==_c){
return this.features[i];
}
}
},destroyFeatures:function(){
if(!this.features){
return;
}
var _e=this.features;
for(var i=_e.length-1;i>=0;i--){
var _10=_e[i];
if(_10.geometry){
this.renderer.eraseGeometry(_10.geometry);
}
_10.mbSelectStyle=null;
_10.destroy();
}
},destroy:function(){
this.mbWidget=null;
OpenLayers.Layer.Vector.prototype.destroy.apply(this,arguments);
}});
this.olLayer=null;
this.defaultStyle=null;
this.selectStyle=null;
this.hiddenFeatures=new Array();
this.containerNodeId=this.htmlTagId;
_2.containerModel=this.targetModel;
if(!this.stylesheet){
var _11=_1.selectSingleNode("mb:stylesheet");
if(_11){
this.stylesheet=new XslProcessor(_11.firstChild.nodeValue,_2.namespace);
this.stylesheet.setParameter("proxyUrl",config.proxyUrl);
}
}
var _12=_1.selectSingleNode("mb:hoverCursor");
this.hoverCursor=_12?_12.firstChild.nodeValue:"pointer";
this.paint=function(_13){
if(_13.targetModel.map){
if(_13.olLayer){
_13.model.setParam("gmlRendererLayer",null);
}
_13.renderDoc=_13.stylesheet?_13.stylesheet.transformNodeToObject(_13.model.doc):_13.model.doc;
if(!_13.renderDoc){
return;
}
_13.map=_13.targetModel.map;
var _14=[_13.model];
if(_13.model.mergeModels){
for(var i in _13.model.mergeModels){
_14.push(_13.model.mergeModels[i]);
}
}
for(var i=0;i<_14.length;i++){
var _16=config.objects[_14[i].id].config?config.objects[_14[i].id].config[_13.id]:null;
if(!_16){
_16=_13.config;
}
if(_16.sldModelNode){
var _17=config.objects[_16.sldModelNode.firstChild.nodeValue];
if(_17){
_17.addListener("loadModel",_13.paint,_13);
if(_17.doc){
_16.defaultStyle=new Object();
_16.selectStyle=new Object();
var _18=_17.getSldNode();
var _19="sld:UserStyle[sld:Name=";
var _1a="wmc:Style[wmc:Name=";
var _1b="//sld:UserStyle[sld:Name='"+_16.defaultStyleName+"']//sld:PointSymbolizer";
var _1c="//sld:UserStyle[sld:Name='"+_16.defaultStyleName+"']//sld:LineSymbolizer";
var _1d="//sld:UserStyle[sld:Name='"+_16.defaultStyleName+"']//sld:PolygonSymbolizer";
var _1e="//sld:UserStyle[sld:Name='"+_16.selectStyleName+"']//sld:PointSymbolizer";
var _1f="//sld:UserStyle[sld:Name='"+_16.selectStyleName+"']//sld:LineSymbolizer";
var _20="//sld:UserStyle[sld:Name='"+_16.selectStyleName+"']//sld:PolygonSymbolizer";
_16.defaultStyle.point=sld2OlStyle(_18.selectSingleNode(_1b));
if(!_16.defaultStyle.point){
_16.defaultStyle.point=sld2OlStyle(_18.selectSingleNode(_1b.replace(_19,_1a)));
}
_16.defaultStyle.line=sld2OlStyle(_18.selectSingleNode(_1c));
if(!_16.defaultStyle.line){
_16.defaultStyle.line=sld2OlStyle(_18.selectSingleNode(_1c.replace(_19,_1a)));
}
_16.defaultStyle.polygon=sld2OlStyle(_18.selectSingleNode(_1d));
if(!_16.defaultStyle.polygon){
_16.defaultStyle.polygon=sld2OlStyle(_18.selectSingleNode(_1d.replace(_19,_1a)));
}
_16.selectStyle.point=sld2OlStyle(_18.selectSingleNode(_1e));
if(!_16.selectStyle.point){
_16.selectStyle.point=sld2OlStyle(_18.selectSingleNode(_1e.replace(_19,_1a)));
}
_16.selectStyle.line=sld2OlStyle(_18.selectSingleNode(_1f));
if(!_16.selectStyle.line){
_16.selectStyle.line=sld2OlStyle(_18.selectSingleNode(_1f.replace(_19,_1a)));
}
_16.selectStyle.polygon=sld2OlStyle(_18.selectSingleNode(_20));
if(!_16.selectStyle.polygon){
_16.selectStyle.polygon=sld2OlStyle(_18.selectSingleNode(_20.replace(_19,_1a)));
}
if(_16.selectStyle.point){
_16.selectStyle.point.cursor=_16.hoverCursor;
}
if(_16.selectStyle.line){
_16.selectStyle.line.cursor=_16.hoverCursor;
}
if(_16.selectStyle.polygon){
_16.selectStyle.polygon.cursor=_16.hoverCursor;
}
}
}
}
}
if(!_13.olLayer||!_13.olLayer.mbWidget){
_13.olLayer=new _3(_13.id,null,{mbWidget:_13});
_13.targetModel.map.addLayer(_13.olLayer);
}else{
_13.olLayer.loaded=false;
_13.olLayer.destroyFeatures();
_13.olLayer.loadGML();
}
_13.removeHiddenFeatures(_13);
_13.model.setParam("gmlRendererLayer",_13.olLayer);
}
_13.targetModel.addListener("refresh",_13.paint,_13);
};
this.model.addListener("refresh",this.paint,this);
this.hiddenListener=function(_21,_22){
};
this.model.addListener("hidden",this.hiddenListener,this);
this.hideFeature=function(_23,fid){
if(!fid){
fid=_23.model.getParam("hideFeature");
}
var _25=_23.olLayer.getFeatureByFid(fid);
if(_25){
_23.hiddenFeatures.push(fid);
_25.mbHidden=true;
_23.olLayer.renderer.eraseGeometry(_25.geometry);
}
};
this.model.addListener("hideFeature",this.hideFeature,this);
this.showFeature=function(_26,fid){
if(!fid){
fid=_26.model.getParam("showFeature");
}
var _28=_26.olLayer.getFeatureByFid(fid);
if(_28){
OpenLayers.Util.removeItem(_26.hiddenFeatures,fid);
_28.mbHidden=false;
_26.olLayer.drawFeature(_28);
}
};
this.model.addListener("showFeature",this.showFeature,this);
this.removeHiddenFeatures=function(_29){
if(_29.olLayer){
var _2a=_29.hiddenFeatures.toString().split(/,/);
_29.hiddenFeatures=new Array();
for(var i in _2a){
if(_2a[i]){
_29.hideFeature(_29,_2a[i]);
}
}
}
};
this.init=function(_2c){
var _2d=_1.selectSingleNode("mb:featureOnClick");
if(_2d){
var _2e=config.objects[_2d.firstChild.nodeValue];
_2c.model.addListener("olFeatureSelect",_2e.onClick,_2e);
}
var _2f=_1.selectSingleNode("mb:featureOnHover");
if(_2f){
var _30=config.objects[_2f.firstChild.nodeValue];
_2c.model.addListener("olFeatureHover",_30.onMouseover,_30);
_2c.model.addListener("olFeatureOut",_30.onMouseout,_30);
}
_2c.targetModel.addListener("aoi",_2c.removeHiddenFeatures,_2c);
};
this.model.addListener("init",this.init,this);
this.model.removeListener("newModel",this.clearWidget,this);
this.clearWidget=function(_31){
if(_31.olLayer){
if(_31.olLayer.loaded==true){
_31.olLayer.loaded=false;
if(_31.olLayer.features&&_31.olLayer.features.length>0){
_31.olLayer.destroyFeatures();
}
}
_31.olLayer.destroy();
_31.olLayer=null;
}
};
this.model.addListener("newModel",this.clearWidget,this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FeatureList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5);
};
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function AoiMouseHandler(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.mouseOutHandler=function(_3,_4){
if(_3.enabled){
if(_3.started){
_3.started=false;
}
}
};
this.mouseOverHandler=function(_5,_6){
if(_5.enabled){
}
};
this.dragBox=function(_7){
var ul=new Array();
var lr=new Array();
if(this.anchorPoint[0]>_7[0]){
ul[0]=_7[0];
lr[0]=this.anchorPoint[0];
}else{
ul[0]=this.anchorPoint[0];
lr[0]=_7[0];
}
if(this.anchorPoint[1]>_7[1]){
ul[1]=_7[1];
lr[1]=this.anchorPoint[1];
}else{
ul[1]=this.anchorPoint[1];
lr[1]=_7[1];
}
ul=this.model.extent.getXY(ul);
lr=this.model.extent.getXY(lr);
this.model.setParam("aoi",new Array(ul,lr));
};
this.mapInit=function(_a){
_a.model.map.events.register("mousedown",_a,_a.mouseDownHandler);
_a.model.map.events.register("mousemove",_a,_a.mouseMoveHandler);
_a.model.map.events.register("mouseup",_a,_a.mouseUpHandler);
};
this.model.addListener("loadModel",this.mapInit,this);
this.clear=function(_b){
if(_b.model.map&&_b.model.map.events){
_b.model.map.events.unregister("mousedown",_b,_b.mouseDownHandler);
_b.model.map.events.unregister("mousemove",_b,_b.mouseMoveHandler);
_b.model.map.events.unregister("mouseup",_b,_b.mouseUpHandler);
}
};
this.model.addListener("newModel",this.clear,this);
}
AoiMouseHandler.prototype.mouseUpHandler=function(e){
if(this.enabled){
if(this.started){
this.started=false;
}
OpenLayers.Event.stop(e);
}
};
AoiMouseHandler.prototype.mouseDownHandler=function(e){
if(this.enabled&&!this.started){
this.started=true;
this.anchorPoint=[e.xy.x,e.xy.y];
this.dragBox([e.xy.x,e.xy.y]);
OpenLayers.Event.stop(e);
}
};
AoiMouseHandler.prototype.mouseMoveHandler=function(e){
if(this.enabled){
if(this.started){
this.dragBox([e.xy.x,e.xy.y]);
}
OpenLayers.Event.stop(e);
}
};

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
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
var _6=this.model.getFeatureNode(_5);
this.stylesheet.setParameter("version",this.model.getVersion());
this.stylesheet.setParameter("serverUrl",this.model.getServerUrl("GetMap","get"));
this.stylesheet.setParameter("serverTitle",this.model.getServerTitle());
this.stylesheet.setParameter("serviceName","wms");
this.stylesheet.setParameter("format",this.model.getImageFormat());
var _7=this.stylesheet.transformNodeToObject(_6);
Sarissa.setXpathNamespaces(_7,this.targetModel.namespace);
mbDebugMessage(this,_7.xml);
this.targetModel.setParam("addLayer",_7.documentElement);
};
this.addLayerFromCat=function(_8){
var _9=this.model.getFeatureNode(_8);
var _a=this.stylesheet.transformNodeToObject(_9);
Sarissa.setXpathNamespaces(_a,this.targetModel.namespace);
mbDebugMessage(this,_a.xml);
this.targetModel.setParam("addLayer",_a.documentElement);
};
this.moveNode=function(_b,_c){
};
this.model.addListener("MoveNode",this.addNodeToModel,this);
this.deleteNode=function(_d,_e){
};
this.model.addListener("DeleteNode",this.addNodeToModel,this);
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

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function FeatureSelectHandler(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.map=null;
this.sourceModels=new Array();
this.configInit=function(_3){
_3.targetModel.addListener("loadModel",_3.contextInit,_3);
};
this.model.addListener("init",this.configInit,this);
this.clear=function(_4){
if(_4.control){
_4.map=null;
_4.control.destroy();
_4.control=null;
}
};
this.model.addListener("newModel",this.clear,this);
this.contextInit=function(_5){
_5.targetModel.addListener("newModel",_5.clear,_5);
_5.model.addListener("gmlRendererLayer",_5.init,_5);
if(_5.targetModel.map&&_5.model.getParam("gmlRendererLayer")&&!_5.control){
_5.init(_5);
}
};
this.init=function(_6){
var _7;
if(_6.model.mergeModels){
_6.sourceModels=_6.model.mergeModels;
}else{
_6.sourceModels.push(_6.model);
}
for(var i in _6.sourceModels){
_6.sourceModels[i].addListener("highlightFeature",_6.highlight,_6);
_6.sourceModels[i].addListener("dehighlightFeature",_6.dehighlight,_6);
}
var _9=_6.model.getParam("gmlRendererLayer");
if(_6.map==_6.targetModel.map&&_6.control&&!_9){
_6.map.removeControl(_6.control);
_6.control.destroy();
_6.control=null;
}else{
if(_9){
if(!_6.control){
_6.control=new OpenLayers.Control.SelectFeature(_9,{hover:true,onSelect:_6.onSelect,onUnselect:_6.onUnselect,mbFeatureSelectHandler:_6,select:function(_a){
_a.mbFeatureSelectHandler=this.mbFeatureSelectHandler;
if(_a.mbSelectStyle){
this.selectStyle=_a.mbSelectStyle;
}
OpenLayers.Control.SelectFeature.prototype.select.apply(this,arguments);
}});
_6.map=_6.targetModel.map;
_6.map.addControl(_6.control);
}
_6.control.activate();
}
}
};
var _b=function(){
var _c=this.mbFeatureSelectHandler;
if(this.layer.events&&_c){
this.layer.events.unregister("mousedown",this,_c.onClick);
this.layer.events.unregister("mousemove",this,_c.onHover);
}
this.mbFeatureSelectHandler=null;
OpenLayers.Feature.Vector.prototype.destroy.apply(this,arguments);
};
this.onSelect=function(_d){
if(!_d){
return;
}
var _e=this.mbFeatureSelectHandler;
for(var i in _e.sourceModels){
_e.sourceModels[i].setParam("mouseoverFeature",_d.fid);
}
if(_d.layer.events&&!_d.mbNoMouseEvent){
_d.destroy=_b;
_d.layer.events.registerPriority("mousedown",_d,_e.onClick);
_d.layer.events.registerPriority("mousemove",_d,_e.onHover);
}else{
_d.mbNoMouseEvent=null;
}
};
this.onUnselect=function(_10){
if(!_10){
return;
}
var _11=this.mbFeatureSelectHandler||_10.mbFeatureSelectHandler;
for(var i in _11.sourceModels){
_11.sourceModels[i].setParam("mouseoutFeature",_10.fid);
}
_11.model.setParam("olFeatureOut",_10);
if(_10.layer.events){
_10.layer.events.unregister("mousedown",_10,_11.onClick);
}
};
this.onClick=function(evt){
evt.feature=this;
var _14=this.mbFeatureSelectHandler;
_14.model.setParam("olFeatureSelect",evt);
OpenLayers.Event.stop(evt);
};
this.onHover=function(evt){
var _16=this.mbFeatureSelectHandler;
if(this.layer&&this.layer.events){
this.layer.events.unregister("mousemove",this,_16.onHover);
}
evt.feature=this;
_16.model.setParam("olFeatureHover",evt);
};
this.highlight=function(_17,fid){
var _19,feature;
var _1a=_17.model.getParam("gmlRendererLayer");
for(var i in _17.sourceModels){
_19=_17.sourceModels[i];
if(!_1a){
return;
}
if(!fid){
fid=_19.getParam("highlightFeature");
}
feature=_1a.getFeatureByFid(fid);
if(feature&&!feature.mbHidden){
feature.mbNoMouseEvent=true;
_17.control.select(feature);
}
}
};
this.dehighlight=function(_1c,fid){
var _1e,feature;
var _1f=_1c.model.getParam("gmlRendererLayer");
for(var i in _1c.sourceModels){
_1e=_1c.sourceModels[i];
if(!_1f){
return;
}
if(!fid){
fid=_1c.model.getParam("dehighlightFeature");
}
feature=_1f.getFeatureByFid(fid);
if(feature&&!feature.mbHidden){
_1c.control.unselect(feature);
}
}
};
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function MergeModels(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.template=null;
this.init=function(_3){
_3.model.mergeModels=new Array();
var _4=_1.selectSingleNode("mb:merges");
if(_4){
var _5=_4.childNodes;
for(var i=0;i<_5.length;i++){
if(_5[i].firstChild){
_3.addModel(_3,config.objects[_5[i].firstChild.nodeValue]);
}
}
}
};
_2.addListener("init",this.init,this);
this.getTemplate=function(_7){
_7.template=_7.model.doc?_7.model.doc.cloneNode(true):null;
if(_7.template){
_7.model.removeListener("loadModel",_7.getTemplate,_7);
_7.buildModel(_7);
}
};
_2.addListener("loadModel",this.getTemplate,this);
this.addModel=function(_8,_9){
_8.model.mergeModels.push(_9);
if(_9.doc){
_8.mergeModel(_8,_9.doc);
}
_9.addListener("refresh",_8.buildModel,_8);
};
this.mergeModel=function(_a,_b){
var _c=_b.doc?_b.doc.cloneNode(true):null;
var _d=_c?_c.selectNodes("//*[@fid]"):null;
if(!_d){
return;
}
var _e;
for(var i=0;i<_d.length;i++){
_e=_d[i];
if(_e.nodeName){
_e.setAttribute("sourceModel",_b.id);
}
}
Sarissa.copyChildNodes(_c.documentElement,_a.model.doc.documentElement,true);
};
this.buildModel=function(_10){
if(!_10.template){
return;
}
_10.model.callListeners("newModel");
_10.model.doc=_10.template.cloneNode(true);
for(var i in _10.model.mergeModels){
_10.mergeModel(_10,_10.model.mergeModels[i]);
}
_10.model.callListeners("loadModel");
};
}

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function MovieLoop(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.frameIncrement=1;
this.model.setParam("firstFrame",0);
this.timestampIndex=0;
window.movieLoop=this;
this.isRunning=false;
this.frameIsLoading=false;
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
var ts;
if(this.timestampIndex!=null){
var ts=_6.childNodes[this.timestampIndex];
if(ts){
ts.setAttribute("current","0");
this.model.setParam("timestamp",this.timestampIndex);
}
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
ts=_6.childNodes[this.timestampIndex];
ts.setAttribute("current","1");
this.model.setParam("timestamp",this.timestampIndex);
};
this.nextFrame=function(_a){
var _b=window.movieLoop;
var _c=_b.frameIncrement;
if(_a){
_c=_a;
}
if(!this.frameIsLoading){
_b.setFrame(_b.timestampIndex+_c);
}
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
this.init=function(_12){
if(!_12.initialized){
_12.initialized=true;
_12.reset(_12);
}
};
this.model.addListener("bbox",this.init,this);
this.uninit=function(_13){
_13.initialized=false;
};
this.model.addListener("newModel",this.uninit,this);
this.play=function(){
if(!this.isRunning){
this.movieTimer=setInterval("window.movieLoop.nextFrame()",this.delay);
this.isRunning=true;
}
};
this.pause=function(){
this.isRunning=false;
clearInterval(this.movieTimer);
};
this.stop=function(){
this.pause();
this.reset(this);
};
this.stopListener=function(_14){
_14.stop();
};
this.model.addListener("stopLoop",this.stopListener,this);
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
var _5=_1.selectSingleNode("mb:stylesheet");
_5=_5?getNodeValue(_5):baseDir+"/tool/xsl/"+this.requestName.replace(/:/,"_")+".xsl";
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
mbDebugMessage(this,"source:"+(new XMLSerializer()).serializeToString(_7));
}
var _8=new Object();
_8.method=this.targetModel.method;
this.requestStylesheet.setParameter("httpMethod",_8.method);
this.requestStylesheet.setParameter("version",this.model.getVersion(_7));
if(this.requestFilter){
var _9=config.objects[this.requestFilter];
this.requestStylesheet.setParameter("filter",escape((new XMLSerializer()).serializeToString(_9.doc).replace(/[\n\f\r\t]/g,"")));
if(this.debug){
mbDebugMessage(this,(new XMLSerializer()).serializeToString(_9.doc));
}
}
_8.postData=this.requestStylesheet.transformNodeToObject(_7);
if(this.debug){
mbDebugMessage(this,"request data:"+(new XMLSerializer()).serializeToString(_8.postData));
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
mbDebugMessage(this,"URL:"+_8.url);
return _8;
};
WebServiceRequest.prototype.doRequest=function(_c,_d){
_c.targetModel.featureName=_d;
var _e=_c.model.getFeatureNode(_d);
if(!_e){
alert(mbGetMessage("featureNotFoundWebServiceRequest",_d));
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
_14.containerModel.addListener("selectedLayer",_14.selectFeature,_14);
_14.containerModel.addListener("loadModel",_14.mapInit,_14);
_14.containerModel.addListener("newModel",_14.clear,_14);
}
};
WebServiceRequest.prototype.mapInit=function(_15){
_15.containerModel.map.events.registerPriority("mouseup",_15,_15.setClickPosition);
};
WebServiceRequest.prototype.clear=function(_16){
if(_16.containerModel.map&&_16.containerModel.map.events){
_16.containerModel.map.events.unregister("mouseup",_16,_16.setClickPosition);
}
};
WebServiceRequest.prototype.setClickPosition=function(e){
this.targetModel.deleteTemplates();
this.requestStylesheet.setParameter("xCoord",e.xy.x);
this.requestStylesheet.setParameter("yCoord",e.xy.y);
};
WebServiceRequest.prototype.selectFeature=function(_18,_19){
_18.requestStylesheet.setParameter("queryLayer",_19);
};

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function ZoomToAoi(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.initProj=function(_3){
if(_3.model.doc&&_3.targetModel.doc){
if(_3.model.getSRS()!=_3.targetModel.getSRS()){
_3.model.proj=new Proj4js.Proj(_3.model.getSRS());
_3.targetModel.proj=new Proj4js.Proj(_3.targetModel.getSRS());
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
var _9=new Proj4js.Point(ul[0],ul[1]);
var _a=new Proj4js.Point(lr[0],lr[1]);
Proj4js.transform(_5.targetModel.proj,_5.model.proj,_9);
Proj4js.transform(_5.targetModel.proj,_5.model.proj,_a);
ul=new Array(_9.x,_9.y);
lr=new Array(_a.x,_a.y);
}
_5.model.setParam("aoi",new Array(ul,lr));
}
};
this.firstInit=function(_b){
_b.model.map.events.register("mouseup",_b,_b.mouseUpHandler);
_b.targetModel.addListener("loadModel",_b.showTargetAoi,_b);
_b.targetModel.addListener("bbox",_b.showTargetAoi,_b);
_b.showTargetAoi(_b);
};
this.model.addListener("loadModel",this.firstInit,this);
this.clear=function(_c){
if(_c.model.map&&_c.model.map.events){
_c.model.map.events.unregister("mouseup",_c,_c.mouseUpHandler);
}
};
this.model.addListener("clearModel",this.clear,this);
}
ZoomToAoi.prototype.mouseUpHandler=function(e){
var _e=this.model.getParam("aoi");
var ul=_e[0];
var lr=_e[1];
if(this.model.getSRS()!=this.targetModel.getSRS()){
var _11=new Proj4js.Point(ul[0],ul[1]);
var _12=new Proj4js.Point(lr[0],lr[1]);
Proj4js.transform(this.model.proj,this.targetModel.proj,_11);
Proj4js.transform(this.model.proj,this.targetModel.proj,_12);
ul=new Array(_11.x,_11.y);
lr=new Array(_12.x,_12.y);
}
if((ul[0]==lr[0])&&(ul[1]==lr[1])){
this.targetModel.map.setCenter(new OpenLayers.LonLat(ul[0],ul[1]));
}else{
this.targetModel.map.zoomToExtent(new OpenLayers.Bounds(ul[0],lr[1],lr[0],ul[1]));
}
};

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function GetFeatureInfoWSR(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:controller");
this.controller=_3?_3.firstChild.nodeValue:null;
var _4=_1.selectSingleNode("mb:tolerance");
this.tolerance=_4?parseFloat(getNodeValue(_4)):3;
this.createControl=function(_5){
var _6=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl.GetFeatureInfoWSR",type:OpenLayers.Control.TYPE_TOOL});
return _6;
};
this.doSelect=function(_7,_8){
if(_8){
_7.targetModel.map.events.register("mouseup",_7,_7.doOnMouseup);
}else{
_7.targetModel.map.events.unregister("mouseup",_7,_7.doOnMouseup);
}
};
this.doOnMouseup=function(e){
objRef=this;
if(!objRef.enabled){
return;
}
var _a=config.objects[objRef.controller];
var _b=new Array();
var _c=objRef.targetModel.getParam("selectedLayer");
var _d;
if(!_c){
_d=objRef.targetModel.getQueryableLayers();
if(_d.length==0){
alert(mbGetMessage("noQueryableLayers"));
return;
}
}else{
_d=[objRef.targetModel.getLayer(_c)];
}
var _e=e.xy.add(-objRef.tolerance,objRef.tolerance);
var _f=e.xy.add(objRef.tolerance,-objRef.tolerance);
var ll=objRef.targetModel.map.getLonLatFromPixel(_e);
var ur=objRef.targetModel.map.getLonLatFromPixel(_f);
for(var i=0;i<_d.length;++i){
var _13=_d[i];
var _14=_13.selectSingleNode("wmc:Name");
_14=(_14)?_14.firstChild.nodeValue:"";
var _15=objRef.targetModel.getHidden(_14);
if(_15==0){
_a.requestStylesheet.setParameter("bBoxMinX",ll.lon);
_a.requestStylesheet.setParameter("bBoxMinY",ll.lat);
_a.requestStylesheet.setParameter("bBoxMaxX",ur.lon);
_a.requestStylesheet.setParameter("bBoxMaxY",ur.lat);
_a.requestStylesheet.setParameter("queryLayer",_14);
objRef.targetModel.setParam(_a.requestName.replace(/:/,"_"),_14);
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Graticule(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.display=false;
this.color=_1.selectSingleNode("mb:color").firstChild.nodeValue;
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl.Graticule",type:OpenLayers.Control.TYPE_TOGGLE,destroy:function(){
OpenLayers.Control.prototype.destroy.apply(this,arguments);
if(this.divs){
for(i=this.divs.length;i>0;--i){
this.divs[i]=null;
}
}
this.div=null;
this.mapContainer=null;
},removeGraticules:function(){
try{
var i=0;
var _6=this.mapContainer;
if(this.divs){
for(i=0;i<this.divs.length;i++){
_6.removeChild(this.divs[i]);
}
}
}
catch(e){
}
},getBbox:function(){
var _7=new Object();
_7.ll=new Object();
_7.ur=new Object();
var ll=new Proj4js.Point(this.bbox[0],this.bbox[1]);
var ur=new Proj4js.Point(this.bbox[2],this.bbox[3]);
Proj4js.transform(this.proj,Proj4js.WGS84,ll);
Proj4js.transform(this.proj,Proj4js.WGS84,ur);
_7.ll.lon=ll.x;
_7.ll.lat=ll.y;
_7.ur.lon=ur.x;
_7.ur.lat=ur.y;
return _7;
},gridIntervalMins:function(_a){
var _a=_a/10;
_a*=6000;
_a=Math.ceil(_a)/100;
if(_a<=0.06){
_a=0.06;
}else{
if(_a<=0.12){
_a=0.12;
}else{
if(_a<=0.3){
_a=0.3;
}else{
if(_a<=0.6){
_a=0.6;
}else{
if(_a<=1.2){
_a=1.2;
}else{
if(_a<=3){
_a=3;
}else{
if(_a<=6){
_a=6;
}else{
if(_a<=12){
_a=12;
}else{
if(_a<=30){
_a=30;
}else{
if(_a<=60){
_a=30;
}else{
if(_a<=(60*2)){
_a=60*2;
}else{
if(_a<=(60*5)){
_a=60*5;
}else{
if(_a<=(60*10)){
_a=60*10;
}else{
if(_a<=(60*20)){
_a=60*20;
}else{
if(_a<=(60*30)){
_a=60*30;
}else{
_a=60*45;
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
return _a;
},gridPrecision:function(_b){
if(_b<0.01){
return 3;
}else{
if(_b<0.1){
return 2;
}else{
if(_b<1){
return 1;
}else{
return 0;
}
}
}
},addGraticules:function(){
this.removeGraticules();
var _c=this.getBbox();
var l=_c.ll.lon;
var b=_c.ll.lat;
var r=_c.ur.lon;
var t=_c.ur.lat;
if(b<-90){
b=-90;
}
if(t>90){
t=90;
}
if(l<-180){
l=-180;
}
if(r>180){
r=180;
}
if(l==r){
l=-180;
r=180;
}
if(t==b){
b=-90;
t=90;
}
var _11=this.gridIntervalMins(t-b);
var _12;
if(r>l){
_12=this.gridIntervalMins(r-l);
}else{
_12=this.gridIntervalMins((180-l)+(r+180));
}
l=Math.floor(l*60/_12)*_12/60;
b=Math.floor(b*60/_11)*_11/60;
t=Math.ceil(t*60/_11)*_11/60;
r=Math.ceil(r*60/_12)*_12/60;
if(b<=-90){
b=-90;
}
if(t>=90){
t=90;
}
if(l<-180){
l=-180;
}
if(r>180){
r=180;
}
_11/=60;
_12/=60;
this.dLat=_11;
this.dLon=_12;
var _13=this.gridPrecision(_11);
var _14=this.gridPrecision(_12);
this.divs=new Array();
var i=0;
var pbl=this.fromLatLngToDivPixel(b,l);
var ptr=this.fromLatLngToDivPixel(t,r);
this.maxX=ptr.x;
this.maxY=pbl.y;
this.minX=pbl.x;
this.minY=ptr.y;
var x;
var y=this.fromLatLngToDivPixel(b+_11+_11,l).y+2;
var _1a=this.mapContainer;
var lo=l;
if(r<lo){
r+=360;
}
while(lo<=r){
var p=this.fromLatLngToDivPixel(b,lo);
this.divs[i]=this.createVLine(p.x);
this.divs[i].style.zIndex=this.div.style.zIndex;
_1a.insertBefore(this.divs[i],null);
i++;
var d=document.createElement("DIV");
x=p.x+3;
d.style.position="absolute";
d.style.left=x.toString()+"px";
d.style.top=y.toString()+"px";
d.style.color=this.color;
d.style.fontFamily="Arial";
d.style.fontSize="x-small";
if(lo==0){
d.innerHTML=(Math.abs(lo)).toFixed(_14);
}else{
if(lo<0){
d.title=mbGetMessage("westWgs84");
d.innerHTML=(Math.abs(lo)).toFixed(_14)+" E";
}else{
d.title=mbGetMessage("eastWgs84");
d.innerHTML=(Math.abs(lo)).toFixed(_14)+" W";
}
}
d.style.zIndex=this.div.style.zIndex;
_1a.insertBefore(d,null);
this.divs[i]=d;
i++;
lo+=_12;
if(lo>180){
r-=360;
lo-=360;
}
}
var j=0;
x=this.fromLatLngToDivPixel(b,l+_12+_12).x+3;
while(b<=t){
var p=this.fromLatLngToDivPixel(b,l);
if(r<l){
this.divs[i]=this.createHLine3(b);
this.divs[i].style.zIndex=this.div.style.zIndex;
_1a.insertBefore(this.divs[i],null);
i++;
}else{
if(r==l){
this.divs[i]=this.createHLine3(b);
this.divs[i].style.zIndex=this.div.style.zIndex;
_1a.insertBefore(this.divs[i],null);
i++;
}else{
this.divs[i]=this.createHLine(p.y);
this.divs[i].style.zIndex=this.div.style.zIndex;
_1a.insertBefore(this.divs[i],null);
i++;
}
}
var d=document.createElement("DIV");
y=p.y+2;
d.style.position="absolute";
d.style.left=x.toString()+"px";
d.style.top=y.toString()+"px";
d.style.color=this.color;
d.style.fontFamily="Arial";
d.style.fontSize="x-small";
if(b==0){
d.innerHTML=(Math.abs(b)).toFixed(_14);
}else{
if(b<0){
d.title=mbGetMessage("southWgs84");
d.innerHTML=(Math.abs(b)).toFixed(_13)+" S";
}else{
d.title=mbGetMessage("northWgs84");
d.innerHTML=(Math.abs(b)).toFixed(_13)+" N";
}
}
if(j!=2){
d.style.zIndex=this.div.style.zIndex;
_1a.insertBefore(d,null);
this.divs[i]=d;
i++;
}
j++;
b+=_11;
}
},fromLatLngToDivPixel:function(lat,lon){
var pt=new Proj4js.Point(lon,lat);
Proj4js.transform(Proj4js.WGS84,this.proj,pt);
var _22=this.map.getPixelFromLonLat(new OpenLayers.LonLat(pt.x,pt.y));
return _22;
},createVLine:function(x){
var div=document.createElement("DIV");
div.style.position="absolute";
div.style.overflow="hidden";
div.style.backgroundColor=this.color;
div.style.left=x+"px";
div.style.top=this.minY+"px";
div.style.width="1px";
div.style.height=(this.maxY-this.minY)+"px";
return div;
},createHLine:function(y){
var div=document.createElement("DIV");
div.style.position="absolute";
div.style.overflow="hidden";
div.style.backgroundColor=this.color;
div.style.left=this.minX+"px";
div.style.top=y+"px";
div.style.width=(this.maxX-this.minX)+"px";
div.style.height="1px";
return div;
},createHLine3:function(lat){
var f=this.fromLatLngToDivPixel(lat,0);
var t=this.fromLatLngToDivPixel(lat,180);
var div=document.createElement("DIV");
div.style.position="absolute";
div.style.overflow="hidden";
div.style.backgroundColor=this.color;
var x1=f.x;
var x2=t.x;
if(x2<x1){
x2=f.x;
x1=t.x;
}
div.style.left=(x1-(x2-x1))+"px";
div.style.top=f.y+"px";
div.style.width=((x2-x1)*2)+"px";
div.style.height="1px";
return div;
},update:function(){
this.width=parseInt(this.objRef.targetModel.getWindowWidth());
this.height=parseInt(this.objRef.targetModel.getWindowHeight());
this.bbox=this.objRef.targetModel.getBoundingBox();
this.proj=new Proj4js.Proj(this.objRef.targetModel.getSRS());
if(this.bbox[1]<0){
if(this.bbox[3]<0){
this.diffLat=this.bbox[1]-this.bbox[3];
}else{
this.diffLat=this.bbox[3]-this.bbox[1];
}
}else{
this.diffLat=this.bbox[3]+this.bbox[1];
}
if(this.bbox[0]<0){
if(this.bbox[2]<0){
this.diffLon=this.bbox[0]-this.bbox[2];
}else{
this.diffLon=this.bbox[2]-this.bbox[0];
}
}else{
this.diffLon=this.bbox[2]+this.bbox[0];
}
this.addGraticules();
},activate:function(){
if(OpenLayers.Control.prototype.activate.apply(this,arguments)){
this.panel_div.style.backgroundImage="url(\""+_3.enabledImage+"\")";
this.map.events.register("moveend",this,this.update);
this.objRef.display=true;
this.mapContainer=this.div;
this.color="black";
this.update();
return true;
}else{
return false;
}
},deactivate:function(){
if(OpenLayers.Control.prototype.deactivate.apply(this,arguments)){
this.panel_div.style.backgroundImage="url(\""+_3.disabledImage+"\")";
this.map.events.unregister("moveend",this,this.update);
this.objRef.display=false;
this.removeGraticules();
_3.enabled=false;
_3.doSelect(_3,false);
this.active=false;
return true;
}else{
return false;
}
}});
return _4;
};
}

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
this.containerId=this.outputNodeId;
this.labelContainerId=this.containerId+"Label";
this.graphicsContainerId=this.containerId+"Graphics";
this.numbersContainerId=this.containerId+"Numbers";
this.model.addListener("bbox",this.update,this);
this.model.addListener("refresh",this.update,this);
}
MapScaleBar.prototype.getContainerNode=function(){
var _c=document.getElementById(this.containerId);
if(!_c){
var _c=document.createElement("div");
_c.className="sbWrapper";
_c.style.position="relative";
_c.setAttribute("id",this.containerId);
}
return _c;
};
MapScaleBar.prototype.getGraphicsContainerNode=function(){
var _d=document.getElementById(this.graphicsContainerId);
if(!_d){
var _d=document.createElement("div");
_d.style.position="absolute";
_d.className="sbGraphicsContainer";
_d.setAttribute("id",this.graphicsContainerId);
var _e=document.createElement("div");
_e.className="sbMarkerMajor";
_d.appendChild(_e);
var _f=document.createElement("div");
_f.className="sbMarkerMinor";
_d.appendChild(_f);
var _10=document.createElement("div");
_10.className="sbBar";
_d.appendChild(_10);
var _11=document.createElement("div");
_11.className="sbBarAlt";
_d.appendChild(_11);
}
return _d;
};
MapScaleBar.prototype.getLabelContainerNode=function(){
var _12=document.getElementById(this.labelContainerId);
if(!_12){
var _12=document.createElement("div");
_12.className="sbUnitsContainer";
_12.style.position="absolute";
_12.setAttribute("id",this.labelContainerId);
}
return _12;
};
MapScaleBar.prototype.getNumbersContainerNode=function(){
var _13=document.getElementById(this.numbersContainerId);
if(!_13){
var _13=document.createElement("div");
_13.style.position="absolute";
_13.className="sbNumbersContainer";
_13.setAttribute("id",this.numbersContainerId);
}
return _13;
};
MapScaleBar.prototype.update=function(_14){
var _15=document.getElementById(_14.outputNodeId);
if(!_15){
_14.getNode().appendChild(_14.getContainerNode());
}
var _16=_14.model.map.getScale();
if(_16!=null){
_14.scaleDenominator=_16;
}
function HandsomeNumber(_17,_18,_19){
var _19=(_19==null)?10:_19;
var _1a=Number.POSITIVE_INFINITY;
var _1b=Number.POSITIVE_INFINITY;
var _1c=_17;
var _1d=3;
for(var _1e=0;_1e<3;++_1e){
var _1f=Math.pow(2,(-1*_1e));
var _20=Math.floor(Math.log(_18/_1f)/Math.LN10);
for(var _21=_20;_21>(_20-_19+1);--_21){
var _22=Math.max(_1e-_21,0);
var _23=_1f*Math.pow(10,_21);
if((_23*Math.floor(_18/_23))>=_17){
if(_17%_23==0){
var _24=_17/_23;
}else{
var _24=Math.floor(_17/_23)+1;
}
var _25=_24+(2*_1e);
var _26=(_21<0)?(Math.abs(_21)+1):_21;
if((_25<_1a)||((_25==_1a)&&(_26<_1b))){
_1a=_25;
_1b=_26;
_1c=(_23*_24).toFixed(_22);
_1d=_22;
}
}
}
}
this.value=_1c;
this.score=_1a;
this.tieBreaker=_1b;
this.numDec=_1d;
}
HandsomeNumber.prototype.toString=function(){
return this.value.toString();
};
HandsomeNumber.prototype.valueOf=function(){
return this.value;
};
function styleValue(_27,_28){
var _29=0;
if(document.styleSheets){
for(var _2a=document.styleSheets.length-1;_2a>=0;--_2a){
var _2b=document.styleSheets[_2a];
if(!_2b.disabled){
var _2c;
if(typeof (_2b.rules)=="undefined"){
if(typeof (_2b.rules)=="undefined"){
return 0;
}else{
_2c=_2b.rules;
}
}else{
_2c=_2b.rules;
}
for(var _2d=0;_2d<_2c.length;++_2d){
var _2e=_2c[_2d];
if(_2e.selectorText&&(_2e.selectorText.toLowerCase()==_27.toLowerCase())){
if(_2e.style[_28]!=""){
_29=parseInt(_2e.style[_28]);
}
}
}
}
}
}
return _29?_29:0;
}
function formatNumber(_2f,_30){
_30=(_30)?_30:0;
var _31=""+Math.round(_2f);
var _32=/(-?[0-9]+)([0-9]{3})/;
while(_32.test(_31)){
_31=_31.replace(_32,"$1,$2");
}
if(_30>0){
var _33=Math.floor(Math.pow(10,_30)*(_2f-Math.round(_2f)));
if(_33==0){
return _31;
}else{
return _31+"."+_33;
}
}else{
return _31;
}
}
var _34=_14.getContainerNode();
var _35=_14.getGraphicsContainerNode();
var _36=_14.getLabelContainerNode();
var _37=_14.getNumbersContainerNode();
_34.title=mbGetMessage("scale",formatNumber(_14.scaleDenominator));
var _38=new Object();
_38.english={units:[mbGetMessage("unitMiles"),mbGetMessage("unitFeet"),mbGetMessage("unitInches")],abbr:[mbGetMessage("unitMilesAbbr"),mbGetMessage("unitFeetAbbr"),mbGetMessage("unitInchesAbbr")],inches:[63360,12,1]};
_38.nautical={units:[mbGetMessage("unitNauticalMiles"),mbGetMessage("unitFeet"),mbGetMessage("unitInches")],abbr:[mbGetMessage("unitNauticalMilesAbbr"),mbGetMessage("unitFeetAbbr"),mbGetMessage("unitInchesAbbr")],inches:[72913.386,12,1]};
_38.metric={units:[mbGetMessage("unitKilometers"),mbGetMessage("unitMeters"),mbGetMessage("unitCentimeters")],abbr:[mbGetMessage("unitKilometersAbbr"),mbGetMessage("unitMetersAbbr"),mbGetMessage("unitCentimetersAbbr")],inches:[39370.07874,39.370079,0.393701]};
var _39=new Array();
for(var _3a=0;_3a<_38[_14.displaySystem].units.length;++_3a){
_39[_3a]=new Object();
var _3b=_14.resolution*_38[_14.displaySystem].inches[_3a]/_14.scaleDenominator;
var _3c=(_14.minWidth/_3b)/(_14.divisions*_14.subdivisions);
var _3d=(_14.maxWidth/_3b)/(_14.divisions*_14.subdivisions);
for(var _3e=0;_3e<(_14.divisions*_14.subdivisions);++_3e){
var _3f=_3c*(_3e+1);
var _40=_3d*(_3e+1);
var _41=new HandsomeNumber(_3f,_40);
_39[_3a][_3e]={value:(_41.value/(_3e+1)),score:0,tieBreaker:0,numDec:0,displayed:0};
for(var _42=0;_42<(_14.divisions*_14.subdivisions);++_42){
displayedValuePosition=_41.value*(_42+1)/(_3e+1);
niceNumber2=new HandsomeNumber(displayedValuePosition,displayedValuePosition);
var _43=((_42+1)%_14.subdivisions==0);
var _44=((_42+1)==(_14.divisions*_14.subdivisions));
if((_14.singleLine&&_44)||(!_14.singleLine&&(_43||_14.showMinorMeasures))){
_39[_3a][_3e].score+=niceNumber2.score;
_39[_3a][_3e].tieBreaker+=niceNumber2.tieBreaker;
_39[_3a][_3e].numDec=Math.max(_39[_3a][_3e].numDec,niceNumber2.numDec);
_39[_3a][_3e].displayed+=1;
}else{
_39[_3a][_3e].score+=niceNumber2.score/_14.subdivisions;
_39[_3a][_3e].tieBreaker+=niceNumber2.tieBreaker/_14.subdivisions;
}
}
var _45=(_3a+1)*_39[_3a][_3e].tieBreaker/_39[_3a][_3e].displayed;
_39[_3a][_3e].score*=_45;
}
}
var _46=null;
var _47=null;
var _48=null;
var _49=null;
var _4a=Number.POSITIVE_INFINITY;
var _4b=Number.POSITIVE_INFINITY;
var _4c=0;
for(var _3a=0;_3a<_39.length;++_3a){
for(_3e in _39[_3a]){
if((_39[_3a][_3e].score<_4a)||((_39[_3a][_3e].score==_4a)&&(_39[_3a][_3e].tieBreaker<_4b))){
_4a=_39[_3a][_3e].score;
_4b=_39[_3a][_3e].tieBreaker;
_46=_39[_3a][_3e].value;
_4c=_39[_3a][_3e].numDec;
_47=_38[_14.displaySystem].units[_3a];
_48=_38[_14.displaySystem].abbr[_3a];
_3b=_14.resolution*_38[_14.displaySystem].inches[_3a]/_14.scaleDenominator;
_49=_3b*_46;
}
}
}
var _4d=(styleValue(".sbMarkerMajor","borderLeftWidth")+styleValue(".sbMarkerMajor","width")+styleValue(".sbMarkerMajor","borderRightWidth"))/2;
var _4e=(styleValue(".sbMarkerMinor","borderLeftWidth")+styleValue(".sbMarkerMinor","width")+styleValue(".sbMarkerMinor","borderRightWidth"))/2;
var _4f=(styleValue(".sbBar","borderLeftWidth")+styleValue(".sbBar","border-right-width"))/2;
var _50=(styleValue(".sbBarAlt","borderLeftWidth")+styleValue(".sbBarAlt","borderRightWidth"))/2;
if(!document.styleSheets){
_4d=0.5;
_4e=0.5;
}
while(_36.hasChildNodes()){
_36.removeChild(_36.firstChild);
}
while(_35.hasChildNodes()){
_35.removeChild(_35.firstChild);
}
while(_37.hasChildNodes()){
_37.removeChild(_37.firstChild);
}
var _51,aBarPiece,numbersBox,xOffset;
var _52={left:0,center:(-1*_14.divisions*_14.subdivisions*_49/2),right:(-1*_14.divisions*_14.subdivisions*_49)};
var _53=0+_52[_14.align];
var _54=0;
for(var _55=0;_55<_14.divisions;++_55){
_53=_55*_14.subdivisions*_49;
_53+=_52[_14.align];
_54=(_55==0)?0:((_55*_14.subdivisions)*_46).toFixed(_4c);
_51=document.createElement("div");
_51.className="sbMarkerMajor";
_51.style.position="absolute";
_51.style.overflow="hidden";
_51.style.left=Math.round(_53-_4d)+"px";
_51.appendChild(document.createTextNode(" "));
_35.appendChild(_51);
if(!_14.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
if(_14.showMinorMeasures){
numbersBox.style.width=Math.round(_49*2)+"px";
numbersBox.style.left=Math.round(_53-_49)+"px";
}else{
numbersBox.style.width=Math.round(_14.subdivisions*_49*2)+"px";
numbersBox.style.left=Math.round(_53-(_14.subdivisions*_49))+"px";
}
numbersBox.appendChild(document.createTextNode(_54));
_37.appendChild(numbersBox);
}
for(var _56=0;_56<_14.subdivisions;++_56){
aBarPiece=document.createElement("div");
aBarPiece.style.position="absolute";
aBarPiece.style.overflow="hidden";
aBarPiece.style.width=Math.round(_49)+"px";
if((_56%2)==0){
aBarPiece.className="sbBar";
aBarPiece.style.left=Math.round(_53-_4f)+"px";
}else{
aBarPiece.className="sbBarAlt";
aBarPiece.style.left=Math.round(_53-_50)+"px";
}
aBarPiece.appendChild(document.createTextNode(" "));
_35.appendChild(aBarPiece);
if(_56<(_14.subdivisions-1)){
_53=((_55*_14.subdivisions)+(_56+1))*_49;
_53+=_52[_14.align];
_54=(_55*_14.subdivisions+_56+1)*_46;
_51=document.createElement("div");
_51.className="sbMarkerMinor";
_51.style.position="absolute";
_51.style.overflow="hidden";
_51.style.left=Math.round(_53-_4e)+"px";
_51.appendChild(document.createTextNode(" "));
_35.appendChild(_51);
if(_14.showMinorMeasures&&!_14.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
numbersBox.style.width=Math.round(_49*2)+"px";
numbersBox.style.left=Math.round(_53-_49)+"px";
numbersBox.appendChild(document.createTextNode(_54));
_37.appendChild(numbersBox);
}
}
}
}
_53=(_14.divisions*_14.subdivisions)*_49;
_53+=_52[_14.align];
_54=((_14.divisions*_14.subdivisions)*_46).toFixed(_4c);
_51=document.createElement("div");
_51.className="sbMarkerMajor";
_51.style.position="absolute";
_51.style.overflow="hidden";
_51.style.left=Math.round(_53-_4d)+"px";
_51.appendChild(document.createTextNode(" "));
_35.appendChild(_51);
if(!_14.singleLine){
numbersBox=document.createElement("div");
numbersBox.className="sbNumbersBox";
numbersBox.style.position="absolute";
numbersBox.style.overflow="hidden";
numbersBox.style.textAlign="center";
if(_14.showMinorMeasures){
numbersBox.style.width=Math.round(_49*2)+"px";
numbersBox.style.left=Math.round(_53-_49)+"px";
}else{
numbersBox.style.width=Math.round(_14.subdivisions*_49*2)+"px";
numbersBox.style.left=Math.round(_53-(_14.subdivisions*_49))+"px";
}
numbersBox.appendChild(document.createTextNode(_54));
_37.appendChild(numbersBox);
}
var _57=document.createElement("div");
_57.style.position="absolute";
var _58;
if(_14.singleLine){
_58=_54;
_57.className="sbLabelBoxSingleLine";
_57.style.top="-0.6em";
_57.style.left=(_53+10)+"px";
}else{
_58="";
_57.className="sbLabelBox";
_57.style.textAlign="center";
_57.style.width=Math.round(_14.divisions*_14.subdivisions*_49)+"px";
_57.style.left=Math.round(_52[_14.align])+"px";
_57.style.overflow="hidden";
}
if(_14.abbreviateLabel){
_58+=" "+_48;
}else{
_58+=" "+_47;
}
_57.appendChild(document.createTextNode(_58));
_36.appendChild(_57);
if(!document.styleSheets){
var _59=document.createElement("style");
_59.type="text/css";
var _5a=".sbBar {top: 0px; background: #666666; height: 1px; border: 0;}";
_5a+=".sbBarAlt {top: 0px; background: #666666; height: 1px; border: 0;}";
_5a+=".sbMarkerMajor {height: 7px; width: 1px; background: #666666; border: 0;}";
_5a+=".sbMarkerMinor {height: 5px; width: 1px; background: #666666; border: 0;}";
_5a+=".sbLabelBox {top: -16px;}";
_5a+=".sbNumbersBox {top: 7px;}";
_59.appendChild(document.createTextNode(_5a));
document.getElementsByTagName("head").item(0).appendChild(_59);
}
_34.appendChild(_35);
_34.appendChild(_36);
_34.appendChild(_37);
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function LegendGraphic(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.model.addListener("hidden",this.refresh,this);
}
LegendGraphic.prototype.refresh=function(_3,_4){
_3.paint(_3,_3.id);
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Abstract(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FeatureInfo(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5);
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function MapTitle(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function SetAoi(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl.SetAoi",type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.aoiBox},{keyMask:this.keyMask});
},aoiBox:function(_5){
if(_5 instanceof OpenLayers.Bounds){
var _6=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_5.left,_5.bottom));
var _7=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_5.right,_5.top));
var _8=new OpenLayers.Bounds(_6.lon,_6.lat,_7.lon,_7.lat);
var _9=_8.toBBOX().split(",");
var ul=new Array(_9[0],_9[3]);
var lr=new Array(_9[2],_9[1]);
_3.targetContext.setParam("aoi",new Array(ul,lr));
_3.drawAoiBox(_3);
}
}});
this.targetContext.addListener("aoi",this.clearAoiBox,this);
return _4;
};
this.drawAoiBox=function(_c){
var _d=_c.targetContext.getParam("aoi");
var _e=new OpenLayers.Bounds(_d[0][0],_d[1][1],_d[1][0],_d[0][1]);
_c.targetContext.aoiBoxLayer=new OpenLayers.Layer.Boxes("Boxes");
_c.targetContext.map.addLayer(_c.targetContext.aoiBoxLayer);
var _f=new OpenLayers.Marker.Box(_e);
_c.targetContext.aoiBoxLayer.addMarker(_f);
};
this.clearAoiBox=function(_10){
if(_10.targetContext.aoiBoxLayer){
_10.targetContext.aoiBoxLayer.destroy();
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function ModelUrlInput(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:defaultUrl");
if(_3){
this.defaultUrl=_3.firstChild.nodeValue;
}
this.submitForm=function(){
var _4=new Object();
_4.url=this.urlInputForm.defaultUrl.value;
_4.method=this.targetModel.method;
this.targetModel.newRequest(this.targetModel,_4);
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
this.prePaint=function(_8){
_8.stylesheet.setParameter("modelTitle",_8.targetModel.title);
if(!_8.defaultUrl){
_8.defaultUrl=_8.targetModel.url;
}
_8.stylesheet.setParameter("defaultUrl",_8.defaultUrl);
};
this.postPaint=function(_9){
_9.urlInputForm=document.getElementById(_9.formName);
_9.urlInputForm.parentWidget=_9;
_9.urlInputForm.onkeypress=_9.handleKeyPress;
};
this.formName="urlInputForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function CollectionList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.switchMap=function(_3,_4){
_3.extent=_3.targetModel.map.getExtent();
_3.srs=_3.targetModel.getSRS();
_3.scale=_3.targetModel.map.getScale();
_3.targetModel.addListener("loadModel",_3.setExtent,_3);
config.loadModel(_3.targetModel.id,_4);
};
this.setExtent=function(_5){
_5.targetModel.removeListener("loadModel",_5.setExtent,_5);
var _6=_5.extent.toBBOX().split(/,/);
if(_5.targetModel.getSRS().toUpperCase()!=_5.srs.toUpperCase()){
var _7=new Proj4js.Proj(_5.targetModel.getSRS());
var _8=new Proj4js.Proj(_5.srs);
var _9=new Proj4js.Point(_6[0],_6[1]);
var _a=new Proj4js.Point(_6[2],_6[3]);
Proj4js.transform(_8,_7,_9);
Proj4js.transform(_8,_7,_a);
_5.extent=new OpenLayers.Bounds(_9.x,_9.y,_a.x,_a.y);
}
if(_5.targetModel.map.getExtent().containsBounds(_5.extent,false,false)){
_5.targetModel.map.zoomToExtent(_5.extent);
if(_5.targetModel.map.getScale()>_5.scale){
_5.targetModel.map.zoomIn();
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectMapLayers(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Timestamp(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.formName="TimestampForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
this.updateTimestamp=function(_3,_4){
var _5=document[_3.formName];
if(_5){
_5.timestampValue.value=_3.model.timestampList.childNodes[_4].firstChild.nodeValue;
}
};
this.model.addListener("timestamp",this.updateTimestamp,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Save(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
this.map.mbMapPane.targetModel.saveModel(this.map.mbMapPane.targetModel);
},CLASS_NAME:"mbControl.Save"});
return _4;
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
var _5=this.model.map.mbMapPane.oLlayers[_4].div;
var _6=document.getElementById("previewImage");
try{
if(_6&&_5){
_6.src=_5.firstChild.firstChild.src;
}
}
catch(e){
}
};
this.refresh=function(_7,_8){
_7.paint(_7,_7.id);
};
this.foldUnfoldGroup=function(_9,id){
var _b="//wmc:General/wmc:Extension/wmc:GroupList/wmc:Group[@name='"+_9+"']";
var _c=_2.doc.selectSingleNode(_b);
var _d=_c.getAttribute("folded");
var e=document.getElementById(id);
if(_d=="1"){
_c.setAttribute("folded","0");
e.value="-";
}else{
_c.setAttribute("folded","1");
e.value="+";
}
};
this.showLayerMetadata=function(_f){
var _10=config.objects.layerMetadata;
if(_10){
_10.stylesheet.setParameter("featureName",_f);
_10.node=document.getElementById(_10.htmlTagId);
_10.paint(_10);
}
};
this.ChangeImage=function(id,_12,_13){
var _14=document.getElementById(id).src.indexOf(_12);
var _15=document.getElementById(id).src.indexOf(_13);
if(document.getElementById(id)!=null){
if(_14!=-1){
document.getElementById(id).src=document.getElementById(id).src.substring(0,_14)+_13;
}else{
document.getElementById(id).src=document.getElementById(id).src.substring(0,_15)+_12;
}
}
return;
};
this.switchVisibilityById=function(id){
e=document.getElementById(id);
if(e.style.display=="none"){
e.style.display="block";
}else{
e.style.display="none";
}
};
this.model.addListener("deleteLayer",this.refresh,this);
this.model.addListener("moveLayerUp",this.refresh,this);
this.model.addListener("moveLayerDown",this.refresh,this);
if(this.autoRefresh){
this.model.addListener("addLayer",this.refresh,this);
}
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
this.model.addListener("bbox",this.clear,this);
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
var _e=this.getNode();
if(_e.style.position!="absolute"&&_e.style.position!="relative"){
_e.style.position="absolute";
}
_e.appendChild(_d);
return _d;
};
this.loadAoiBox=function(_f){
_f.Top=_f.getImageDiv();
_f.Bottom=_f.getImageDiv();
_f.Left=_f.getImageDiv();
_f.Right=_f.getImageDiv();
_f.paint(_f);
};
this.loadAoiBox(this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FilterAttributes(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectFeatureType(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function AoiForm(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.displayAoiCoords=function(_3,_4){
var _5=document.getElementById(_3.formName);
var _6=_3.model.getParam("aoi");
if(_6&&_5){
_5.westCoord.value=_6[0][0];
_5.northCoord.value=_6[0][1];
_5.eastCoord.value=_6[1][0];
_5.southCoord.value=_6[1][1];
}
};
this.model.addListener("aoi",this.displayAoiCoords,this);
this.setAoi=function(){
var _7=this.model.getParam("aoi");
if(_7){
var ul=_7[0];
var lr=_7[1];
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
this.postPaint=function(_a){
var _b=document.getElementById(_a.formName);
_b.westCoord.onblur=_a.setAoi;
_b.northCoord.onblur=_a.setAoi;
_b.eastCoord.onblur=_a.setAoi;
_b.southCoord.onblur=_a.setAoi;
_b.westCoord.model=_a.model;
_b.northCoord.model=_a.model;
_b.eastCoord.model=_a.model;
_b.southCoord.model=_a.model;
};
var _c=_1.selectSingleNode("mb:formName");
if(_c){
this.formName=_c.firstChild.nodeValue;
}else{
this.formName="AoiForm_"+mbIds.getId();
}
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Widget(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
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
mbDebugMessage(this,_5.url);
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
if(this.debug){
mbDebugMessage(this,"Transformed: "+(new XMLSerializer()).serializeToString(_8));
}
this.namespace="xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
Sarissa.setXpathNamespaces(_8,this.namespace);
var _9=_8.selectSingleNode("//wfs:GetFeature");
_5.postData=(new XMLSerializer()).serializeToString(_9);
mbDebugMessage(this,"httpPayload.postData:"+_5.postData);
this.targetModel.wfsFeature=_8.childNodes[0];
if(this.debug){
mbDebugMessage(this,"wfsFeature = "+(new XMLSerializer()).serializeToString(this.targetModel.wfsFeature));
}
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
if(_10.model){
var _12=null;
var _13=_10.model.getSRS();
_10.requestStylesheet.setParameter("bBoxMinX",_11[0][0]);
_10.requestStylesheet.setParameter("bBoxMinY",_11[1][1]);
_10.requestStylesheet.setParameter("bBoxMaxX",_11[1][0]);
_10.requestStylesheet.setParameter("bBoxMaxY",_11[0][1]);
_10.requestStylesheet.setParameter("srs",_13);
_10.requestStylesheet.setParameter("width",_10.model.getWindowWidth());
_10.requestStylesheet.setParameter("height",_10.model.getWindowHeight());
}
};
this.init=function(_14){
if(_14.model){
_14.model.addListener("aoi",_14.setAoiParameters,_14);
}
};
this.model.addListener("init",this.init,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function GetFeatureInfo(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:stylesheet");
_3=_3?getNodeValue(_3):baseDir+"/tool/GetFeatureInfo.xsl";
this.xsl=new XslProcessor(_3);
var _4=_1.selectSingleNode("mb:infoFormat");
this.infoFormat=_4?_4.firstChild.nodeValue:"application/vnd.ogc.gml";
this.featureCount=1;
var _5=_1.selectSingleNode("mb:featureCount");
if(_5){
this.featureCount=_5.firstChild.nodeValue;
}
this.cursor="pointer";
this.createControl=function(_6){
var _7=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl.GetFeatureInfo",type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask});
},zoomBox:function(_8){
var _9=this.objRef;
if(_9.enabled){
var x,y;
if(_8 instanceof OpenLayers.Bounds){
x=_8.left+(_8.right-_8.left)/2;
y=_8.top+(_8.bottom-_8.top)/2;
}else{
x=_8.x;
y=_8.y;
}
_9.targetModel.deleteTemplates();
var _b=_9.targetContext.getParam("selectedLayer");
if(_b==null){
var _c=_9.targetContext.getQueryableLayers();
if(_c.length==0){
alert(mbGetMessage("noQueryableLayers"));
return;
}else{
for(var i=0;i<_c.length;++i){
var _e=_c[i];
var _f=_e.selectSingleNode("wmc:Name");
_f=(_f)?_f.firstChild.nodeValue:"";
var _10=_e.getAttribute("id")||_f;
var _11=_9.targetContext.getHidden(_10);
if(_11==0){
_9.xsl.setParameter("queryLayer",_f);
_9.xsl.setParameter("layer",_f);
_9.xsl.setParameter("xCoord",x);
_9.xsl.setParameter("yCoord",y);
_9.xsl.setParameter("infoFormat",_9.infoFormat);
_9.xsl.setParameter("featureCount",_9.featureCount);
urlNode=_9.xsl.transformNodeToObject(_9.targetContext.doc);
url=urlNode.documentElement.firstChild.nodeValue;
httpPayload=new Object();
httpPayload.url=url;
httpPayload.method="get";
httpPayload.postData=null;
_9.targetModel.newRequest(_9.targetModel,httpPayload);
}
}
}
}else{
_9.xsl.setParameter("queryLayer",_b);
_9.xsl.setParameter("layer",_f);
_9.xsl.setParameter("xCoord",x);
_9.xsl.setParameter("yCoord",y);
_9.xsl.setParameter("infoFormat",_9.infoFormat);
_9.xsl.setParameter("featureCount",_9.featureCount);
var _12=_9.xsl.transformNodeToObject(_9.targetContext.doc);
var url=_12.documentElement.firstChild.nodeValue;
if(_9.infoFormat=="text/html"){
window.open(url,"queryWin","height=200,width=300,scrollbars=yes");
}else{
var _14=new Object();
_14.url=url;
_14.method="get";
_14.postData=null;
_9.targetModel.newRequest(_9.targetModel,_14);
}
}
}
}});
return _7;
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Locations(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAoi=function(_3,_4,_5){
var _6=_5.split(/[:#]/);
_5="EPSG:"+_6[_6.length-1];
if(!_5){
_5="EPSG:4326";
}
var _7=new Proj4js.Proj(_5);
var _8=new Array();
_8=_3.split(",");
var _9=new Proj4js.Point(parseFloat(_8[0]),parseFloat(_8[3]));
var _a=new Proj4js.Point(parseFloat(_8[2]),parseFloat(_8[1]));
Proj4js.transform(_7,this.targetModel.proj,_9);
Proj4js.transform(_7,this.targetModel.proj,_a);
var ul=new Array(_9.x,_9.y);
var lr=new Array(_a.x,_a.y);
this.targetModel.setParam("aoi",new Array(ul,lr));
this.targetModel.map.zoomToExtent(new OpenLayers.Bounds(ul[0],lr[1],lr[0],ul[1]));
};
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function Measurement(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control.DrawFeature,{CLASS_NAME:"mbMeasurement"});
return _4;
};
this.instantiateControl=function(_5,_6){
var _7=new _6(_5.featureLayer,OpenLayers.Handler.Path,{callbacks:{point:_5.startAction}});
_7.objRef=_5;
_7.activate=function(){
_6.prototype.activate.apply(this,arguments);
_5.targetModel.setParam("showDistance",0);
};
_7.deactivate=function(){
_6.prototype.deactivate.apply(this,arguments);
_5.targetModel.setParam("showDistance",null);
};
return _7;
};
this.cursor="crosshair";
var _8=0;
var _9=0;
var _a=false;
var _b=false;
this.startAction=function(_c){
var _d=this.objRef;
_d.pointGeometry=_c;
if(!_d.targetModel.doc){
_d.targetModel.addListener("loadModel",_d.doAction,_d);
config.loadModel(_d.targetModel.id,_d.defaultModelUrl);
}else{
_d.doAction(_d);
}
};
this.doAction=function(_e){
pointGeometry=_e.pointGeometry;
_e.targetModel.removeListener("loadModel",_e.doAction,_e);
if(_e.enabled){
if(_e.restart){
_e.model.setParam("clearMeasurementLine");
_e.restart=false;
}
var _f=[pointGeometry.x,pointGeometry.y];
var old=_e.targetModel.getXpathValue(_e.targetModel,_e.featureXpath);
if(!old){
old="";
}
sucess=_e.targetModel.setXpathValue(_e.targetModel,_e.featureXpath,old+" "+_f[0]+","+_f[1]);
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathMeasurement",_e.featureXpath));
}
var _11=_e.targetModel.getXpathValue(_e.targetModel,_e.featureXpath);
var _12=_11.split(" ");
if(_12.length>=3){
var _13=_12[_12.length-2];
var _14=_12[_12.length-1];
var P=_13.split(",");
var Q=_14.split(",");
_e.srs=srs.toUpperCase();
_e.proj=new Proj4js.Proj(_e.srs);
if(!P||!Q){
alert(mbGetMessage("projectionNotSupported"));
}else{
if(_e.proj.units=="meters"||_e.proj.units=="m"){
Xp=parseFloat(P[0]);
Yp=parseFloat(P[1]);
Xq=parseFloat(Q[0]);
Yq=parseFloat(Q[1]);
_9=Math.sqrt(((Xp-Xq)*(Xp-Xq))+((Yp-Yq)*(Yp-Yq)));
if(_9==0){
_e.restart=true;
_e.model.setParam("clearMouseLine");
_e.targetModel.setParam("mouseRenderer",false);
return;
}
_8=Math.round(_8+_9);
}else{
if(_e.proj.units=="degrees"||_e.proj.units==null){
var _17=Math.PI/180;
var _18=new Array(0,0);
LonpRad=parseFloat(P[0])*_17;
LatpRad=parseFloat(P[1])*_17;
LonqRad=parseFloat(Q[0])*_17;
LatqRad=parseFloat(Q[1])*_17;
if((LonpRad>0&&LonqRad<0)||(LonpRad<0&&LonqRad>0)){
if(LonpRad<0){
radDistance=Math.acos(Math.sin(LatpRad)*Math.sin(LatqRad)+Math.cos(LatpRad)*Math.cos(LatqRad)*Math.cos(LonpRad));
radDistance+=Math.acos(Math.sin(LatpRad)*Math.sin(LatqRad)+Math.cos(LatpRad)*Math.cos(LatqRad)*Math.cos(LonqRad));
}
if(LonqRad<0){
radDistance=Math.acos(Math.sin(LatpRad)*Math.sin(LatqRad)+Math.cos(LatpRad)*Math.cos(LatqRad)*Math.cos(LonqRad));
radDistance+=Math.acos(Math.sin(LatpRad)*Math.sin(LatqRad)+Math.cos(LatpRad)*Math.cos(LatqRad)*Math.cos(LonpRad));
}
}else{
radDistance=Math.acos(Math.sin(LatpRad)*Math.sin(LatqRad)+Math.cos(LatpRad)*Math.cos(LatqRad)*Math.cos(LonpRad-LonqRad));
}
_9=radDistance*6378137;
if(_9==0){
_e.restart=true;
_e.model.setParam("clearMouseLine");
_e.targetModel.setParam("mouseRenderer",false);
return;
}
_8=Math.round(_8+_9);
}else{
alert(mbGetMessage("cantCalculateDistance"));
}
}
}
}
_e.targetModel.setParam("showDistance",_8);
}
};
this.setFeature=function(_19,_1a){
_19.restart=true;
};
this.clearMeasurementLine=function(_1b){
if(_8!=0){
_8=0;
sucess=_1b.targetModel.setXpathValue(_1b.targetModel,_1b.featureXpath,"");
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathMeasurement",_1b.featureXpath));
}
_1b.targetModel.setParam("refresh");
}
};
this.model.addListener("clearMeasurementLine",this.clearMeasurementLine,this);
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
function SaveModel(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.saveLink=function(_3,_4){
var _5=document.getElementById(_3.model.id+"."+_3.id+".modelUrl");
_5.href=_4;
};
this.model.addListener("modelSaved",this.saveLink,this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function ShowDistance(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.showDistance=function(_3){
var _4=document.getElementById(_3.formName);
var _5=_3.model.values.showDistance;
if(_5==null){
_3.getNode().style.display="none";
}else{
_3.getNode().style.display="";
if(_5>1000){
if(_5>1000000){
outputDistance=Math.round(_5/1000)+"  km";
}else{
outputDistance=Math.round(_5/100)/10+"  km";
}
}else{
if(_5>0){
outputDistance=Math.round(_5)+"  m";
}else{
outputDistance="";
}
}
if(_4){
_4.distance.value=outputDistance;
}
}
};
this.model.addListener("showDistance",this.showDistance,this);
this.formName="ShowDistance_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectAllMapLayers(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

