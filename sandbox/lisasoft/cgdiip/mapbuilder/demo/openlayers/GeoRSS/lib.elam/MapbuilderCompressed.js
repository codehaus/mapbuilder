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
while(this.loadingScripts.length>0&&(this.loadingScripts[0].readyState=="loaded"||this.loadingScripts[0].readyState=="uninitialized"||this.loadingScripts[0].readyState=="complete"||this.loadingScripts[0].readyState==null)){
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
_3.readyState=="complete";
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

var MapBuilder_Release=true;

mapbuilder.loadScript(baseDir+"/util/Util.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function ButtonBase(_1,_2){
var _3=_1.selectSingleNode("mb:buttonBar");
if(_3){
this.htmlTagId=_3.firstChild.nodeValue;
this.buttonBarGroup=this.htmlTagId;
}
var _4=_1.selectSingleNode("mb:htmlTagId");
if(_4){
this.htmlTagId=_4.firstChild.nodeValue;
}
if((!_3)&&(!_4)){
alert(mbGetMessage("buttonBarRequired",_1.nodeName));
}
if(config.widgetText){
var disabledImage="/mb:WidgetText/mb:widgets/mb:"+_1.nodeName;
var _6=config.widgetText.selectNodes(disabledImage+"/*");
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
this.disabledImage=document.createElement("IMG");
this.disabledImage.src=config.skinDir+_c.firstChild.nodeValue;
}
var _d=_1.selectSingleNode("mb:enabledSrc");
if(_d){
this.enabledImage=document.createElement("IMG");
this.enabledImage.src=config.skinDir+_d.firstChild.nodeValue;
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
_16.mapPaneDiv=document.getElementById(_16.targetContext.map.div.id);
var _18=_16.createControl(_16);
var _19=OpenLayers.Class(_18,{superclass:_18.prototype,trigger:function(){
if(this.superclass.trigger){
this.superclass.trigger.call(this);
}
_16.doSelect(_16,true);
},activate:function(){
if(this.superclass.activate.call(this)){
this.panel_div.style.backgroundImage="url(\""+_16.enabledImage.src+"\")";
this.map.div.style.cursor=_16.cursor;
this.map.mbCursor=_16.cursor;
_16.enabled=true;
this.active=true;
_16.doSelect(_16,true);
}
},deactivate:function(){
if(this.superclass.deactivate.call(this)){
this.panel_div.style.backgroundImage="url(\""+_16.disabledImage.src+"\")";
_16.enabled=false;
this.active=false;
_16.doSelect(_16,false);
}
}});
_16.control=_16.instantiateControl?_16.instantiateControl(_16,_19):new _19();
var map=_16.targetContext.map;
_16.panel=_16.targetContext.buttonBars[_16.htmlTagId];
if(!_16.panel||_16.panel.map==null){
_16.panel=new OpenLayers.Control.Panel({div:document.getElementById(_16.panelHtmlTagId),defaultControl:null});
_16.targetContext.buttonBars[_16.htmlTagId]=_16.panel;
map.addControl(_16.panel);
}
_16.panel.addControls(_16.control);
if(_16.tooltip){
_16.control.panel_div.title=_16.tooltip;
}
_16.control.panel_div.style.backgroundImage="url(\""+_16.disabledImage.src+"\")";
if(_16.selected==true){
_16.control.activate();
}
};
this.buttonInit=function(_1b){
var _1c=_1b.widgetNode.selectSingleNode("mb:targetContext");
if(_1c){
_1b.targetContext=window.config.objects[_1c.firstChild.nodeValue];
if(!_1b.targetModel){
alert(mbGetMessage("noTargetContext",_1c.firstChild.nodeValue,_1b.id));
}
}else{
_1b.targetContext=_1b.targetModel;
}
if(!_1b.targetContext.buttonBars){
_1b.targetContext.buttonBars=new Array();
}
_1b.targetContext.addListener("refresh",_1b.attachToOL,_1b);
};
this.model.addListener("init",this.buttonInit,this);
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditLine(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control.DrawFeature,{CLASS_NAME:"mbEditLine"});
return _4;
};
this.instantiateControl=function(_5,_6){
return new _6(_5.featureLayer,OpenLayers.Handler.Path);
};
this.setFeature=function(_7,_8){
if(_7.enabled){
var _9=_8.geometry.components;
var _a="";
for(var i in _9){
_a+=" "+_9[i].x+","+_9[i].y;
}
sucess=_7.targetModel.setXpathValue(_7.targetModel,_7.featureXpath,_a);
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathEditLine",_7.featureXpath));
}
}
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
var _12=_10.model.map.getScale();
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
if(typeof (_27.rules)=="undefined"){
if(typeof (_27.rules)=="undefined"){
return 0;
}else{
_28=_27.rules;
}
}else{
_28=_27.rules;
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
_10.container.title=mbGetMessage("scale",formatNumber(_10.scaleDenominator));
var _30=new Object();
_30.english={units:[mbGetMessage("unitMiles"),mbGetMessage("unitFeet"),mbGetMessage("unitInches")],abbr:[mbGetMessage("unitMilesAbbr"),mbGetMessage("unitFeetAbbr"),mbGetMessage("unitInchesAbbr")],inches:[63360,12,1]};
_30.nautical={units:[mbGetMessage("unitNauticalMiles"),mbGetMessage("unitFeet"),mbGetMessage("unitInches")],abbr:[mbGetMessage("unitNauticalMilesAbbr"),mbGetMessage("unitFeetAbbr"),mbGetMessage("unitInchesAbbr")],inches:[72913.386,12,1]};
_30.metric={units:[mbGetMessage("unitKilometers"),mbGetMessage("unitMeters"),mbGetMessage("unitCentimeters")],abbr:[mbGetMessage("unitKilometersAbbr"),mbGetMessage("unitMetersAbbr"),mbGetMessage("unitCentimetersAbbr")],inches:[39370.07874,39.370079,0.393701]};
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
function Version(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FilterAttributes(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function ModelTransformer(_1,_2){
this.cursor="default";
this.handleRequest=true;
WidgetBase.apply(this,new Array(_1,_2));
this.transform=new XslProcessor(_1.selectSingleNode("mb:transform").firstChild.nodeValue);
this.handleLoad=function(_3){
if(_3.handleRequest==true){
_3.targetModel.doc=_3.transform.transformNodeToObject(_3.targetModel.doc);
_3.handleRequest=false;
_3.targetModel.callListeners("loadModel");
}else{
_3.handleRequest=true;
}
};
this.init=function(_4){
if(_4.targetModel){
_4.targetModel.addListener("loadModel",_4.handleLoad,_4);
}
};
this.model.addListener("init",this.init,this);
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function Measurement(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control.DrawFeature,{CLASS_NAME:"mbMeasurement"});
return _4;
};
this.instantiateControl=function(_5,_6){
var _7=new _6(_5.featureLayer,OpenLayers.Handler.Path,{callbacks:{point:_5.doAction}});
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
this.doAction=function(_c){
var _d=this.objRef;
if(_d.enabled){
if(_d.restart){
_d.model.setParam("clearMeasurementLine");
_d.restart=false;
}
var _e=[_c.x,_c.y];
var _f=_d.targetModel.getXpathValue(_d.targetModel,_d.featureXpath);
if(!_f){
_f="";
}
sucess=_d.targetModel.setXpathValue(_d.targetModel,_d.featureXpath,_f+" "+_e[0]+","+_e[1]);
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathMeasurement",_d.featureXpath));
}
var _10=_d.targetModel.getXpathValue(_d.targetModel,_d.featureXpath);
var _11=_10.split(" ");
if(_11.length>=3){
var _12=_11[_11.length-2];
var _13=_11[_11.length-1];
var P=_12.split(",");
var Q=_13.split(",");
_d.srs=srs.toUpperCase();
_d.proj=new Proj(_d.srs);
if(!P||!Q){
alert(mbGetMessage("projectionNotSupported"));
}else{
if(_d.proj.units=="meters"||_d.proj.units=="m"){
Xp=parseFloat(P[0]);
Yp=parseFloat(P[1]);
Xq=parseFloat(Q[0]);
Yq=parseFloat(Q[1]);
_9=Math.sqrt(((Xp-Xq)*(Xp-Xq))+((Yp-Yq)*(Yp-Yq)));
if(_9==0){
_d.restart=true;
_d.model.setParam("clearMouseLine");
_d.targetModel.setParam("mouseRenderer",false);
return;
}
_8=Math.round(_8+_9);
}else{
if(_d.proj.units=="degrees"||_d.proj.units==null){
var _16=Math.PI/180;
var _17=new Array(0,0);
LonpRad=parseFloat(P[0])*_16;
LatpRad=parseFloat(P[1])*_16;
LonqRad=parseFloat(Q[0])*_16;
LatqRad=parseFloat(Q[1])*_16;
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
_d.restart=true;
_d.model.setParam("clearMouseLine");
_d.targetModel.setParam("mouseRenderer",false);
return;
}
_8=Math.round(_8+_9);
}else{
alert(mbGetMessage("cantCalculateDistance"));
}
}
}
}
_d.targetModel.setParam("showDistance",_8);
}
};
this.setFeature=function(_18,_19){
_18.restart=true;
};
this.clearMeasurementLine=function(_1a){
if(_8!=0){
_8=0;
sucess=_1a.targetModel.setXpathValue(_1a.targetModel,_1a.featureXpath,"");
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathMeasurement",_1a.featureXpath));
}
_1a.targetModel.setParam("refresh");
}
};
this.model.addListener("clearMeasurementLine",this.clearMeasurementLine,this);
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function Reset(_1,_2){
this.createControl=function(){
return OpenLayers.Control.ZoomToMaxExtent;
};
ButtonBase.apply(this,new Array(_1,_2));
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
alert(mbGetMessage("noCountryCode"));
return;
}
if(!municipality&&!city&&!number&&!street&&!pc){
alert(mbGetMessage("atLeastOneValue"));
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

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Graticule(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.display=false;
this.color=_1.selectSingleNode("mb:color").firstChild.nodeValue;
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl.Graticule",type:OpenLayers.Control.TYPE_TOGGLE,objRef:_3,removeGraticules:function(){
try{
var i=0;
var _6=this.mapContainer;
for(i=0;i<this.divs.length;i++){
_6.removeChild(this.divs[i]);
}
}
catch(e){
}
},getBbox:function(){
var _7=new Object();
_7.ll=new Object();
_7.ur=new Object();
var ll=new PT(this.bbox[0],this.bbox[1]);
var ur=new PT(this.bbox[2],this.bbox[3]);
cs_transform(this.proj,new CS(csList.EPSG4326),ll);
cs_transform(this.proj,new CS(csList.EPSG4326),ur);
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
var pt=new PT(lon,lat);
cs_transform(new CS(csList.EPSG4326),this.proj,pt);
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
this.proj=new Proj(this.objRef.targetModel.getSRS());
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
this.panel_div.style.backgroundImage="url(\""+_3.enabledImage.src+"\")";
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
this.panel_div.style.backgroundImage="url(\""+_3.disabledImage.src+"\")";
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

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function GetFeatureInfo(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.xsl=new XslProcessor(baseDir+"/tool/GetFeatureInfo.xsl");
var _3=_1.selectSingleNode("mb:infoFormat");
this.infoFormat=_3?_3.firstChild.nodeValue:"application/vnd.ogc.gml";
this.featureCount=1;
var _4=_1.selectSingleNode("mb:featureCount");
if(_4){
this.featureCount=_4.firstChild.nodeValue;
}
this.cursor="pointer";
this.createControl=function(_5){
var _6=OpenLayers.Class(OpenLayers.Control,{CLASS_NAME:"mbControl.GetFeatureInfo",type:OpenLayers.Control.TYPE_TOOL,objRef:_5,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask});
},zoomBox:function(_7){
var _8=this.objRef;
if(_8.enabled){
var x,y;
if(_7 instanceof OpenLayers.Bounds){
x=_7.left+(_7.right-_7.left)/2;
y=_7.top+(_7.bottom-_7.top)/2;
}else{
x=_7.x;
y=_7.y;
}
_8.targetModel.deleteTemplates();
var _a=_8.targetContext.getParam("selectedLayer");
if(_a==null){
var _b=_8.targetContext.getQueryableLayers();
if(_b.length==0){
alert(mbGetMessage("noQueryableLayers"));
return;
}else{
for(var i=0;i<_b.length;++i){
var _d=_b[i];
var _e=_d.firstChild.data;
var _f=_8.targetContext.getHidden(_e);
if(_f==0){
_8.xsl.setParameter("queryLayer",_e);
_8.xsl.setParameter("layer",_e);
_8.xsl.setParameter("xCoord",x);
_8.xsl.setParameter("yCoord",y);
_8.xsl.setParameter("infoFormat",_8.infoFormat);
_8.xsl.setParameter("featureCount",_8.featureCount);
urlNode=_8.xsl.transformNodeToObject(_8.targetContext.doc);
url=urlNode.documentElement.firstChild.nodeValue;
httpPayload=new Object();
httpPayload.url=url;
httpPayload.method="get";
httpPayload.postData=null;
_8.targetModel.newRequest(_8.targetModel,httpPayload);
}
}
}
}else{
_8.xsl.setParameter("queryLayer",_a);
_8.xsl.setParameter("layer",_e);
_8.xsl.setParameter("xCoord",targetNode.x);
_8.xsl.setParameter("yCoord",targetNode.y);
_8.xsl.setParameter("infoFormat",_8.infoFormat);
_8.xsl.setParameter("featureCount","1");
var _10=_8.xsl.transformNodeToObject(_8.targetContext.doc);
var url=_10.documentElement.firstChild.nodeValue;
if(_8.infoFormat=="text/html"){
window.open(url,"queryWin","height=200,width=300,scrollbars=yes");
}else{
var _12=new Object();
_12.url=url;
_12.method="get";
_12.postData=null;
_8.targetModel.newRequest(_8.targetModel,_12);
}
}
}
}});
return _6;
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
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
alert(mbGetMessage("aoiFormNotFound"));
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
this.node=document.getElementById(this.htmlTagId);
if(this.buttonBarGroup){
this.groupnode=document.getElementById(this.buttonBarGroup);
}
if(!this.groupnode){
this.groupnode=this.node;
}
if(!this.node){
}
this.autoRefresh=true;
var _6=_1.selectSingleNode("mb:autoRefresh");
if(_6&&_6.firstChild.nodeValue=="false"){
this.autoRefresh=false;
}
if(_1.selectSingleNode("mb:debug")){
this.debug=true;
}
this.initTargetModel=function(_7){
var _8=_7.widgetNode.selectSingleNode("mb:targetModel");
if(_8){
_7.targetModel=window.config.objects[_8.firstChild.nodeValue];
if(!_7.targetModel){
alert(mbGetMessage("noTargetModelWidget",_8.firstChild.nodeValue,_7.id));
}
}else{
_7.targetModel=_7.model;
}
};
this.model.addListener("init",this.initTargetModel,this);
this.prePaint=function(_9){
};
this.postPaint=function(_a){
};
this.clearWidget=function(_b){
var _c=document.getElementById(_b.outputNodeId);
if(_c){
_b.node.removeChild(_c);
}
};
this.model.addListener("newModel",this.clearWidget,this);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FeatureInfo(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5);
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function GmlRendererBase(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:hoverCursor");
this.hoverCursor=_3?_3.firstChild.nodeValue:"pointer";
this.sldModelNode=_1.selectSingleNode("mb:sldModel");
var _4=_1.selectSingleNode("mb:defaultStyleName");
this.defaultStyleName=_4?_4.firstChild.nodeValue:"default";
var _5=_1.selectSingleNode("mb:selectStyleName");
this.selectStyleName=_5?_5.firstChild.nodeValue:"selected";
this.config=new Object({model:_2,hoverCursor:this.hoverCursor,sldModelNode:this.sldModelNode,defaultStyleName:this.defaultStyleName,selectStyleName:this.selectStyleName});
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
if(this.node.style.position!="absolute"&&this.node.style.position!="relative"){
this.node.style.position="absolute";
}
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
this.coordForm=document.getElementById(this.formName);
if(!_b){
return;
}
var _c=this.model.map.getLonLatFromPixel(_b.xy);
var pt=new PT(_c.lon,_c.lat);
cs_transform(this.proj,this.epsg4326,pt);
var _e=new OpenLayers.LonLat(pt.x,pt.y);
if(this.showPx){
if(this.coordForm.px){
this.coordForm.px.value=_b.xy.x;
}
if(this.coordForm.py){
this.coordForm.py.value=_b.xy.y;
}
}
if(this.showXY){
if(this.coordForm.x){
this.coordForm.x.value=_c.lon.toFixed(this.precision);
}
if(this.coordForm.y){
this.coordForm.y.value=_c.lat.toFixed(this.precision);
}
}
if(this.showLatLong){
if(this.coordForm.longitude){
this.coordForm.longitude.value=_e.lon.toFixed(this.precision);
}
if(this.coordForm.latitude){
this.coordForm.latitude.value=_e.lat.toFixed(this.precision);
}
}
if(this.showDMS){
var _f=this.convertDMS(_e.lon,"LON");
if(this.coordForm.longdeg){
this.coordForm.longdeg.value=_f[0];
}
if(this.coordForm.longmin){
this.coordForm.longmin.value=_f[1];
}
if(this.coordForm.longsec){
this.coordForm.longsec.value=_f[2];
}
if(this.coordForm.longH){
this.coordForm.longH.value=_f[3];
}
var _10=this.convertDMS(_e.lat,"LAT");
if(this.coordForm.latdeg){
this.coordForm.latdeg.value=_10[0];
}
if(this.coordForm.latmin){
this.coordForm.latmin.value=_10[1];
}
if(this.coordForm.latsec){
this.coordForm.latsec.value=_10[2];
}
if(this.coordForm.latH){
this.coordForm.latH.value=_10[3];
}
}
if(this.showDM){
var _f=this.convertDM(_e.lon,"LON");
if(this.coordForm.longDMdeg){
this.coordForm.longDMdeg.value=_f[0];
}
if(this.coordForm.longDMmin){
this.coordForm.longDMmin.value=_f[1];
}
if(this.coordForm.longDMH){
this.coordForm.longDMH.value=_f[2];
}
var _10=this.convertDM(_e.lat,"LAT");
if(this.coordForm.latDMdeg){
this.coordForm.latDMdeg.value=_10[0];
}
if(this.coordForm.latDMmin){
this.coordForm.latDMmin.value=_10[1];
}
if(this.coordForm.latDMH){
this.coordForm.latDMH.value=_10[2];
}
}
if(this.showMGRS){
if(!this.MGRS){
this.MGRS=new MGRS();
}
this.coordForm.mgrs.value=this.MGRS.convert(_e.lat,_e.lon);
}
};
this.mouseoutHandler=function(evt){
this.coordForm=document.getElementById(this.formName);
if(this.showPx){
if(this.coordForm.px){
this.coordForm.px.value="";
}
if(this.coordForm.py){
this.coordForm.py.value="";
}
}
if(this.showXY){
if(this.coordForm.x){
this.coordForm.x.value="";
}
if(this.coordForm.y){
this.coordForm.y.value="";
}
}
if(this.showLatLong){
if(this.coordForm.longitude){
this.coordForm.longitude.value="";
}
if(this.coordForm.latitude){
this.coordForm.latitude.value="";
}
}
if(this.showDMS){
if(this.coordForm.longdeg){
this.coordForm.longdeg.value="";
}
if(this.coordForm.longmin){
this.coordForm.longmin.value="";
}
if(this.coordForm.longsec){
this.coordForm.longsec.value="";
}
if(this.coordForm.longH){
this.coordForm.longH.value="";
}
if(this.coordForm.latdeg){
this.coordForm.latdeg.value="";
}
if(this.coordForm.latmin){
this.coordForm.latmin.value="";
}
if(this.coordForm.latsec){
this.coordForm.latsec.value="";
}
if(this.coordForm.latH){
this.coordForm.latH.value="";
}
}
if(this.showDM){
if(this.coordForm.longDMdeg){
this.coordForm.longDMdeg.value="";
}
if(this.coordForm.longDMmin){
this.coordForm.longDMmin.value="";
}
if(this.coordForm.longDMH){
this.coordForm.longDMH.value="";
}
if(this.coordForm.latDMdeg){
this.coordForm.latDMdeg.value="";
}
if(this.coordForm.latDMmin){
this.coordForm.latDMmin.value="";
}
if(this.coordForm.latDMH){
this.coordForm.latDMH.value="";
}
}
if(this.showMGRS){
if(this.coordForm.mgrs){
this.coordForm.mgrs.value="";
}
}
};
this.convertDMS=function(_12,_13){
var _14=new Array();
abscoordinate=Math.abs(_12);
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
_14[0]=coordinatedegrees;
_14[1]=coordinateminutes;
_14[2]=coordinateseconds;
_14[3]=this.getHemi(_12,_13);
return _14;
};
this.convertDM=function(_15,_16){
var _17=new Array();
abscoordinate=Math.abs(_15);
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
_17[0]=coordinatedegrees;
_17[1]=coordinateminutes;
_17[2]=this.getHemi(_15,_16);
return _17;
};
this.getHemi=function(_18,_19){
var _1a="";
if(_19=="LAT"){
if(_18>=0){
_1a="N";
}else{
_1a="S";
}
}else{
if(_19=="LON"){
if(_18>=0){
_1a="E";
}else{
_1a="W";
}
}
}
return _1a;
};
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
this.node=document.getElementById(this.containerNodeId);
}
this.model.addListener("newModel",this.paint,this);
this.model.addListener("loadModel",this.clear,this);
this.model.addListener("bbox",this.paint,this);
this.model.addListener("refresh",this.paint,this);
this.model.addListener("modelStatus",this.update,this);
}
Loading2.prototype.paint=function(_5){
_5.node=document.getElementById(_5.htmlTagId);
if(_5.node){
if(_5.model.template){
return;
}
if(!_5.model.url){
return;
}
var _6=document.getElementById(_5.outputNodeId+"_loading");
if(!_6){
_6=document.createElement("div");
_6.setAttribute("id",_5.outputNodeId+"_loading");
_5.node.appendChild(_6);
}
_6.className="loadingIndicator";
_6.style.zIndex=1000;
if(_5.mapContainerNode){
_6.style.position="absolute";
_6.style.left="0px";
_6.style.top="0px";
}
if(_5.imageSrc){
var _7=document.getElementById(_5.outputNodeId+"_imageNode");
if(!_7){
_7=document.createElement("img");
_7.setAttribute("id",_5.outputNodeId+"_imageNode");
_6.appendChild(_7);
_7.style.zIndex=1000;
}
_7.src=_5.imageSrc;
}
if(_5.updateMessage){
var _8=document.getElementById(_5.outputNodeId+"_messageNode");
if(!_8){
_8=document.createElement("p");
_8.setAttribute("id",_5.outputNodeId+"_messageNode");
_6.appendChild(_8);
}
_8.innerHTML=_5.updateMessage;
}
}
};
Loading2.prototype.clear=function(_9){
_9.updateMessage=null;
var _a=document.getElementById(_9.outputNodeId+"_loading");
if(_a){
_9.node.removeChild(_a);
}
_9.node=null;
};
Loading2.prototype.update=function(_b,_c){
if(_c){
_b.updateMessage=_c;
_b.paint(_b);
}else{
_b.clear(_b);
}
};

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function ProposeDeleteFeature(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="default";
this.trm=_1.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
this.tm=_1.selectSingleNode("mb:targetModel").firstChild.nodeValue;
this.tc=_1.selectSingleNode("mb:targetContext").firstChild.nodeValue;
this.httpPayload=new Object();
this.httpPayload.url=_1.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
this.httpPayload.method="post";
this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert_atom.xsl");
this.cdataElementXsl=new XslProcessor(baseDir+"/tool/xsl/cdata_element.xsl");
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
point=_5.getFirstPoint(_5.targetModel);
_5.targetModel.setXpathValue(_5.targetModel,"//georss:where/gml:Point/gml:pos",point);
_5.targetModel.setXpathAttribute(_5.targetModel,"//def:category[@scheme='http://www.geobase.ca/scheme/action']","term","Delete");
_5.targetModel.setXpathValue(_5.targetModel,"//def:entry/def:updated",_5.getISO8601Time());
s=_5.targetModel.doc;
s=_5.insertXsl.transformNodeToObject(s);
_5.httpPayload.postData=s;
_5.transactionResponseModel.transactionType="delete";
_5.transactionResponseModel.newRequest(_5.transactionResponseModel,_5.httpPayload);
}else{
alert(mbGetMessage("noFeatureToDelete"));
}
}
};
this.getBounds=function(_7){
var _8=_7.doc.selectNodes("//psma:feature_collection//gml:coordinates");
var _9;
var _a;
var _b;
var _c;
invalidCoord=false;
for(var n=0;n<_8.length;n++){
coords=_8[n].firstChild.nodeValue.trim().split(" ");
for(var c=0;c<coords.length;c++){
if(coords[c]!=""){
coord=coords[c].split(",");
}
if(coord.length==2){
_9=_9?Math.max(_9,parseFloat(coord[0])):parseFloat(coord[0]);
_a=_a?Math.max(_a,parseFloat(coord[1])):parseFloat(coord[1]);
_b=_b?Math.min(_b,parseFloat(coord[0])):parseFloat(coord[0]);
_c=_c?Math.min(_c,parseFloat(coord[1])):parseFloat(coord[1]);
}else{
invalidCoord=true;
}
}
}
if(invalidCoord){
alert("invalid coordinate found, but transaction will procceed");
}
return (_b+","+_c+" "+_b+","+_a+" "+_9+","+_a+" "+_9+","+_c+" "+_b+","+_c);
};
this.getFirstPoint=function(_f){
var _10=_f.doc.selectNodes("//georss:featureOfInterest//gml:coordinates");
invalidCoord=false;
for(var n=0;n<_10.length;n++){
coords=_10[n].firstChild.nodeValue.trim().split(" ");
if(coords.length>=0&&coords[0]!=""){
result=coords[0].replace(","," ");
}else{
invalidCoord=true;
}
}
if(invalidCoord){
alert("invalid coordinate found, but transaction will procceed");
}
return (result);
};
this.handleResponse=function(_12){
if(_12.transactionResponseModel.transactionType=="delete"){
success=_12.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
if(success){
_12.targetModel.setModel(_12.targetModel,null);
_12.targetModel.callListeners("refreshGmlRenderers");
_12.targetContext.callListeners("refreshWmsLayers");
}
}
};
this.getISO8601Time=function(){
var _13=new Date();
var _14=_13.getYear();
if(_14<2000){
_14=_14+1900;
}
var _15=_13.getMonth()+1;
var day=_13.getDate();
var _17=_13.getHours();
var _18=_13.getUTCHours();
var _19=_17-_18;
var _1a=Math.abs(_19);
var _1b=_13.getMinutes();
var _1c=_13.getUTCMinutes();
var _1d;
var _1e=_13.getSeconds();
var _1f;
if(_1b!=_1c&&_1c<30&&_19<0){
_1a--;
}
if(_1b!=_1c&&_1c>30&&_19>0){
_1a--;
}
if(_1b!=_1c){
_1d=":30";
}else{
_1d=":00";
}
if(_1a<10){
_1f="0"+_1a+_1d;
}else{
_1f=""+_1a+_1d;
}
if(_19<0){
_1f="-"+_1f;
}else{
_1f="+"+_1f;
}
if(_15<=9){
_15="0"+_15;
}
if(day<=9){
day="0"+day;
}
if(_17<=9){
_17="0"+_17;
}
if(_1b<=9){
_1b="0"+_1b;
}
if(_1e<=9){
_1e="0"+_1e;
}
time=_14+"-"+_15+"-"+day+"T"+_17+":"+_1b+":"+_1e+_1f;
return time;
};
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
function Widget(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function MapScaleText(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.submitForm=function(){
var _3=this.mapScaleTextForm.mapScale.value;
this.model.map.zoomToScale(_3.split(",").join(""));
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
var _8=Math.round(_7.model.map.getScale());
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

mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");
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
var _d=_c.firstChild.data;
var _e=_4.targetModel.getHidden(_d);
if(_e==0){
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
function EventLog(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
_7.targetModel.setModel(_7.targetModel,null);
_7.targetModel.callListeners("refreshGmlRenderers");
_7.targetContext.callListeners("refreshWmsLayers");
}
}
};
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
alert(mbGetMessage("unknownRucType"));
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FormBase(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:webServiceUrl");
if(_3){
this.webServiceUrl=_3.firstChild.nodeValue;
}
this.postPaint=function(_4){
_4.searchForm=document.getElementById(_4.formName);
_4.searchForm.parentWidget=_4;
_4.searchForm.onkeypress=_4.handleKeyPress;
_4.searchForm.onsubmit=_4.submitForm;
};
this.formName="WebServiceForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
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
return true;
}
};
this.setValue=function(_8,_9){
this.model.setXpathValue(this.model,_8,_9,false);
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectFeatureType(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
this.node=document.getElementById(this.containerNodeId);
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
this.model.addListener("refreshLayer",this.refreshLayer,this);
this.model.addListener("hidden",this.hidden,this);
this.model.addListener("addLayer",this.addLayer,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("moveLayerUp",this.moveLayerUp,this);
this.model.addListener("moveLayerDown",this.moveLayerDown,this);
this.model.addListener("opacity",this.setOpacity,this);
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
var _18=null;
_18=_d.widgetNode.selectSingleNode("mb:fixedSize");
_18=(_18)?_18.firstChild.nodeValue:null;
if(_18=="true"){
_d.node.style.width=_d.model.getWindowWidth()+"px";
_d.node.style.height=_d.model.getWindowHeight()+"px";
}
var _19={controls:[],projection:_10.srs,units:_13,maxExtent:_11,maxResolution:_12,resolutions:_14,theme:null};
_d.model.map=new OpenLayers.Map(_d.node,_19);
if(config.proxyUrl){
OpenLayers.ProxyHost=config.proxyUrl+"?url=";
}
_d.model.map.Z_INDEX_BASE.Control=10000;
var _1a=_d.model.getAllLayers();
if(!_d.oLlayers){
_d.oLlayers=new Array();
}
for(var i=0;i<=_1a.length-1;i++){
_d.addLayer(_d,_1a[i]);
}
var _1b=_d.model.getBoundingBox();
_d.model.map.mbMapPane=_d;
_d.model.map.events.register("moveend",_d.model.map,_d.updateContext);
_d.model.map.events.register("mouseup",_d.model.map,_d.updateMouse);
_d.model.map.zoomToExtent(new OpenLayers.Bounds(_1b[0],_1b[1],_1b[2],_1b[3]));
}
};
MapPaneOL.prototype.updateContext=function(e){
var _1d=e.object.mbMapPane;
var _1e=_1d.model.map.getExtent().toBBOX().split(",");
var ul=new Array(_1e[0],_1e[3]);
var lr=new Array(_1e[2],_1e[1]);
if(_1d.model.getWindowWidth()!=e.element.offsetWidth){
_1d.model.setWindowWidth(e.element.offsetWidth);
}
if(_1d.model.getWindowHeight()!=e.element.offsetHeight){
_1d.model.setWindowHeight(e.element.offsetHeight);
}
var _21=_1d.model.getParam("aoi");
var _22=new Array(ul,lr);
if(!_21||_21.toString!=_22.toString()){
_1d.model.setBoundingBox(new Array(ul[0],lr[1],lr[0],ul[1]));
_1d.model.extent.setSize(_1d.model.map.getResolution());
_1d.model.setParam("aoi",_22);
}
};
MapPaneOL.prototype.updateMouse=function(e){
var _24=e.object.mbMapPane;
if(_24.model.map.mbCursor){
_24.model.map.div.style.cursor=_24.model.map.mbCursor;
}
};
MapPaneOL.prototype.hidden=function(_25,_26){
var vis=_25.model.getHidden(_26);
if(vis=="1"){
var _28=false;
}else{
var _28=true;
}
var _29=_25.getLayer(_25,_26);
if(_29){
_29.setVisibility(_28);
}
};
MapPaneOL.prototype.getLayer=function(_2a,_2b){
if(_2a.oLlayers[_2b]&&_2a.oLlayers[_2b].id){
return _2a.model.map.getLayer(_2a.oLlayers[_2b].id);
}else{
return false;
}
};
MapPaneOL.prototype.deleteLayer=function(_2c,_2d){
if(_2c.oLlayers[_2d]){
_2c.model.map.removeLayer(_2c.oLlayers[_2d]);
}
};
MapPaneOL.prototype.deleteAllLayers=function(_2e){
_2e.model.map.destroy();
};
MapPaneOL.prototype.moveLayerUp=function(_2f,_30){
var map=_2f.model.map;
map.raiseLayer(map.getLayer(_2f.oLlayers[_30].id),1);
};
MapPaneOL.prototype.moveLayerDown=function(_32,_33){
_32.model.map.raiseLayer(_32.getLayer(_32,_33),-1);
};
MapPaneOL.prototype.setOpacity=function(_34,_35){
var _36="1";
_36=_34.model.getOpacity(_35);
_34.getLayer(_34,_35).setOpacity(_36);
};
MapPaneOL.prototype.addLayer=function(_37,_38){
var _39=_38;
var _3a=_39.selectSingleNode("wmc:Server/@service");
_3a=(_3a)?_3a.nodeValue:"";
var _3b=_39.selectSingleNode("wmc:Title");
_3b=(_3b)?_3b.firstChild.nodeValue:"";
var _3c=_39.selectSingleNode("wmc:Name");
_3c=(_3c)?_3c.firstChild.nodeValue:"";
if(_37.context=="OWS"){
var _3d=_39.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");
_3d=(_3d)?getNodeValue(_3d):"";
}else{
if(_SARISSA_IS_SAFARI){
var _3e=_39.selectSingleNode("wmc:Server/wmc:OnlineResource");
var _3d=_3e.attributes[1].nodeValue;
}else{
if(_SARISSA_IS_OPERA){
var _3d=_39.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttributeNS("http://www.w3.org/1999/xlink","href");
}else{
var _3d=_39.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
}
}
}
var _3f=_39.selectSingleNode("wmc:FormatList/wmc:Format");
_3f=(_3f)?_3f.firstChild.nodeValue:"image/gif";
var vis=_39.selectSingleNode("@hidden");
if(vis){
if(vis.nodeValue=="1"){
vis=false;
}else{
vis=true;
}
}
var _41=_39.selectSingleNode("@queryable");
if(_41){
if(_41.nodeValue=="1"){
_41=true;
}else{
_41=false;
}
}
var _42=_39.selectSingleNode("@opacity");
if(_42){
_42=_42.nodeValue;
}else{
_42=false;
}
var _43=_39.selectSingleNode("@maxFeatures");
if(_43){
_43=_43.nodeValue;
}else{
_43=false;
}
var _44=_39.selectSingleNode("wmc:StyleList/wmc:Style[@current=1]");
var _45={visibility:vis,projection:_37.model.map.projection,queryable:_41,maxExtent:_37.model.map.maxExtent,maxResolution:_37.model.map.maxResolution,alpha:false,isBaseLayer:false,displayOutsideMaxExtent:_37.displayOutsideMaxExtent};
switch(_3a){
case "OGC":
case "WMS":
case "wms":
case "OGC:WMS":
if(!_37.model.map.baseLayer){
_45.isBaseLayer=true;
}else{
_45.reproject=_37.imageReproject;
_45.isBaseLayer=false;
}
_45.ratio=_37.imageBuffer;
_45.singleTile=true;
var _46=new Array();
_46=sld2UrlParam(_44);
if(_37.model.timestampList&&_37.model.timestampList.getAttribute("layerName")==_3c){
var _47=_37.model.timestampList.childNodes[0];
_37.oLlayers[_3c]=new OpenLayers.Layer.WMS(_3b,_3d,{layers:_3c,transparent:_45.isBaseLayer?"FALSE":"TRUE","TIME":_47.firstChild.nodeValue,format:_3f,sld:_46.sld,sld_body:_46.sld_body,styles:_46.styles},_45);
this.model.addListener("timestamp",this.timestampListener,this);
}else{
_37.oLlayers[_3c]=new OpenLayers.Layer.WMS(_3b,_3d,{layers:_3c,transparent:_45.isBaseLayer?"FALSE":"TRUE",format:_3f,sld:_46.sld,sld_body:_46.sld_body,styles:_46.styles},_45);
}
break;
case "WMS-C":
case "OGC:WMS-C":
if(!_37.model.map.baseLayer){
_45.isBaseLayer=true;
}else{
_45.reproject=_37.imageReproject;
_45.isBaseLayer=false;
}
_45.gutter=_37.tileGutter;
_45.buffer=_37.tileBuffer;
_45.tileSize=new OpenLayers.Size(_37.tileSize,_37.tileSize);
var _46=new Array();
_46=sld2UrlParam(_44);
_37.oLlayers[_3c]=new OpenLayers.Layer.WMS(_3b,_3d,{layers:_3c,transparent:_45.isBaseLayer?"FALSE":"TRUE",format:_3f,sld:_46.sld,sld_body:_46.sld_body,styles:_46.styles},_45);
break;
case "WFS":
case "wfs":
case "OGC:WFS":
style=sld2OlStyle(_44);
if(style){
_45.style=style;
}else{
_45.style=_37.getWebSafeStyle(_37,2*i+1);
}
_37.oLlayers[_3c]=new OpenLayers.Layer.WFS(_3b,_3d,{TYPENAME:_3c,});
_37.oLlayers[_3c].setVisibility(vis);
if(_43){
_37.oLlayers[_3c].mergeNewParams({MAXFEATURES:_43});
}
break;
case "gml":
case "OGC:GML":
style=sld2OlStyle(_44);
if(style){
_45.style=style;
}else{
_45.style=_37.getWebSafeStyle(_37,2*i+1);
}
_37.oLlayers[_3c]=new OpenLayers.Layer.GML(_3b,_3d,_45);
break;
case "GMAP":
case "Google":
_45.projection="EPSG:41001";
_45.units="degrees";
_37.model.map.units="degrees";
_45.maxExtent=new OpenLayers.Bounds("-180","-90","180","90");
_45.isBaseLayer=true;
_37.oLlayers[_3c]=new OpenLayers.Layer.Google("Google Satellite",{type:G_HYBRID_MAP,maxZoomLevel:18},_45);
break;
case "YMAP":
case "Yahoo":
_45.isBaseLayer=true;
_37.oLlayers[_3c]=new OpenLayers.Layer.Yahoo("Yahoo");
break;
case "VE":
case "Microsoft":
_45.isBaseLayer=true;
_37.oLlayers[_3c]=new OpenLayers.Layer.VirtualEarth("VE",{minZoomLevel:0,maxZoomLevel:18,type:VEMapStyle.Hybrid});
break;
case "MultiMap":
_45.isBaseLayer=true;
_37.oLlayers[_3c]=new OpenLayers.Layer.MultiMap("MultiMap");
break;
default:
alert(mbGetMessage("layerTypeNotSupported",_3a));
}
if(_42&&_37.oLlayers[_3c]){
_37.oLlayers[_3c].setOpacity(_42);
}
_37.model.setParam(_37.oLlayers[_3c].id,_3c);
_37.oLlayers[_3c].events.register("loadstart",_37,_37.model.loadLayerStart);
_37.oLlayers[_3c].events.register("loadend",_37,_37.model.loadLayerEnd);
_37.model.map.addLayer(_37.oLlayers[_3c]);
};
MapPaneOL.prototype.getWebSafeStyle=function(_48,_49){
colors=new Array("00","33","66","99","CC","FF");
_49=(_49)?_49:0;
_49=(_49<0)?0:_49;
_49=(_49>215)?215:_49;
i=parseInt(_49/36);
j=parseInt((_49-i*36)/6);
k=parseInt((_49-i*36-j*6));
var _4a="#"+colors[i]+colors[j]+colors[k];
var _4b=new Object();
_4b.fillColor=_4a;
_4b.strokeColor=_4a;
_4b.map=_48.model.map;
return _4b;
};
MapPaneOL.prototype.refreshLayer=function(_4c,_4d,_4e){
_4e["random"]=Math.random();
if(_4c.getLayer(_4c,_4d)){
_4c.getLayer(_4c,_4d).mergeNewParams(_4e);
}
};
MapPaneOL.prototype.clearWidget2=function(_4f){
if(_4f.model.map){
_4f.model.map.destroy();
outputNode=document.getElementById(_4f.model.id+"Container_OpenLayers_ViewPort");
if(outputNode){
_4f.node.removeChild(outputNode);
}
_4f.model.map=null;
_4f.oLlayers=null;
}
};
MapPaneOL.prototype.timestampListener=function(_50,_51){
var _52=_50.model.timestampList.getAttribute("layerName");
var _53=_50.model.timestampList.childNodes[_51];
if((_52)&&(_53)){
var _54=_50.oLlayers[_52];
var _55=_54.grid[0][0].imgDiv.src;
var _56=_55;
_56=_56.replace(/TIME\=.*?\&/,"TIME="+_53.firstChild.nodeValue+"&");
function imageLoaded(){
window.movieLoop.frameIsLoading=false;
}
window.movieLoop.frameIsLoading=true;
var _57=_54.grid[0][0].imgDiv;
if(_57.addEventListener){
_57.addEventListener("load",imageLoaded,false);
}else{
if(_57.attachEvent){
_57.attachEvent("onload",imageLoaded);
}
}
_57.src=_56;
}
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
function SLDEditor(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.refresh=function(_3,_4){
_3.stylesheet.setParameter("layerName",_4);
_3.paint(_3,_3.id);
};
this.postPaint=function(_5){
};
this.model.addListener("SLDChange",this.refresh,this);
this.setAttr=function(_6,_7,_8,_9){
if(_9){
_7=_7+"[@name='"+_9+"']";
}
_6.model.setXpathValue(_6.model,_7,_8);
};
this.openColorWindow=function(_a){
var _b=new String("color.html?inputId="+_a);
day=new Date();
id=day.getTime();
eval("page"+id+" = window.open(URL, '"+id+"', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=260,height=285,left=800,top=600');");
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function CatalogSearchForm(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.targetContext=_1.selectSingleNode("mb:targetContext").firstChild.nodeValue;
this.wrsUrl=_1.selectSingleNode("mb:wrsUrl").firstChild.nodeValue;
this.wrsServiceAssociation="OperatesOn";
this.httpPayload=new Object();
this.httpPayload.url=this.wrsUrl;
this.httpPayload.method="post";
var _3=_1.selectSingleNode("mb:mapModel");
if(_3){
this.mapModel=_3.firstChild.nodeValue;
}else{
this.mapModel=_2.id;
}
this.postPaint=function(){
config.objects[this.mapModel].addListener("aoi",this.displayAoiCoords,this);
this.searchForm=document.getElementById(this.formName);
this.searchForm.parentWidget=this;
this.searchForm.westCoord.model=this.model;
this.searchForm.northCoord.model=this.model;
this.searchForm.eastCoord.model=this.model;
this.searchForm.southCoord.model=this.model;
this.searchForm.onkeypress=this.handleKeyPress;
};
CatalogSearchForm.prototype.displayAoiCoords=function(_4){
var _5=config.objects[_4.mapModel].getParam("aoi");
_4.searchForm.westCoord.value=_5[0][0];
_4.searchForm.northCoord.value=_5[0][1];
_4.searchForm.eastCoord.value=_5[1][0];
_4.searchForm.southCoord.value=_5[1][1];
};
CatalogSearchForm.prototype.setAoi=function(){
var _6=config.objects[this.mapModel].getParam("aoi");
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
config.objects[this.mapModel].setParam("aoi",new Array(ul,lr));
}
};
this.handleKeyPress=function(_9){
var _a;
var _b;
if(_9){
_a=_9.which;
_b=_9.currentTarget;
}else{
_a=window.event.keyCode;
_b=window.event.srcElement.form;
}
if(_a==13){
return true;
}
};
CatalogSearchForm.prototype.setLocation=function(_c){
var _d=new Array();
_d=_c.split(",");
var ul=new Array(parseFloat(_d[0]),parseFloat(_d[2]));
var lr=new Array(parseFloat(_d[1]),parseFloat(_d[3]));
config.objects[this.mapModel].setParam("aoi",new Array(ul,lr));
};
CatalogSearchForm.prototype.doSelect=function(){
if(!this.initialized){
this.targetModel.addListener("loadModel",this.handleResponse,this);
this.ebrim2Context=new XslProcessor(baseDir+"/tool/xsl/ebrim2Context.xsl");
this.initialized=1;
}
wrsQueryXML=this.buildQuery();
this.httpPayload.postData=wrsQueryXML;
this.targetModel.transactionType="insert";
this.targetModel.newRequest(this.targetModel,this.httpPayload);
this.targetModel.callListeners("refresh");
};
CatalogSearchForm.prototype.buildQuery=function(){
this.searchForm=document.getElementById(this.formName);
this.model.setXpathValue(this.model,"/filter/keywords",this.searchForm.keywords.value,false);
this.model.setXpathValue(this.model,"/filter/servicetype",this.searchForm.serviceType.value,false);
this.model.setXpathValue(this.model,"/filter/serviceassociation",this.wrsServiceAssociation,false);
var aoi=config.objects[this.mapModel].getParam("aoi");
var _11="";
if(aoi){
_11=aoi[0][0]+","+aoi[1][1]+" "+aoi[1][0]+","+aoi[0][1];
}else{
var _12=config.objects[this.mapModel].getBoundingBox();
_11=_12[0]+","+_12[1]+" "+_12[2]+","+_12[3];
}
this.wrsQuery=new XslProcessor(baseDir+"/tool/xsl/wrs_Query.xsl");
this.wrsQuery.setParameter("filter",this.model.doc);
var _13=this.wrsQuery.transformNodeToString(this.model.doc);
return _13;
};
CatalogSearchForm.prototype.debugQuery=function(){
s=this.buildQuery();
s="<html><title>"+"WRS Query"+"</title><body>"+Sarissa.escape(s)+"</body></html>";
s=s.replace(/&gt;/g,"&gt;<br/>");
debugwindow=document.getElementById("debugwindow");
debugwindow.innerHTML=s;
};
CatalogSearchForm.prototype.handleResponse=function(_14){
var _15=_14.ebrim2Context.transformNodeToObject(_14.targetModel.doc);
window.config.objects[_14.targetContext].setModel(window.config.objects[_14.targetContext],_15);
};
this.formName="WebServiceForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
}

mapbuilder.loadScript(baseDir+"/widget/GmlRendererBase.js");
function GmlRendererOL(_1,_2){
GmlRendererBase.apply(this,new Array(_1,_2));
this.olLayer=null;
this.defaultStyle=null;
this.selectStyle=null;
this.hiddenFeatures=new Array();
this.containerNodeId=this.htmlTagId;
_2.containerModel=this.targetModel;
if(!this.stylesheet){
var _3=_1.selectSingleNode("mb:stylesheet");
if(_3){
this.stylesheet=new XslProcessor(_3.firstChild.nodeValue,_2.namespace);
this.stylesheet.setParameter("proxyUrl",config.proxyUrl);
}
}
var _4=_1.selectSingleNode("mb:hoverCursor");
this.hoverCursor=_4?_4.firstChild.nodeValue:"pointer";
this.paint=function(_5){
if(_5.targetModel.map){
if(_5.olLayer){
_5.model.setParam("gmlRendererLayer",null);
if(_5.targetModel.map==_5.map){
_5.olLayer.destroy();
_5.olLayer=null;
}
}
var _6=_5.stylesheet?_5.stylesheet.transformNodeToObject(_5.model.doc):_5.model.doc;
if(!_6){
return;
}
_5.map=_5.targetModel.map;
var _7=[_5.model];
if(_5.model.mergeModels){
for(var i in _5.model.mergeModels){
_7.push(_5.model.mergeModels[i]);
}
}
for(var i=0;i<_7.length;i++){
var _9=config.objects[_7[i].id].config?config.objects[_7[i].id].config[_5.id]:null;
if(!_9){
_9=_5.config;
}
if(_9.sldModelNode){
var _a=config.objects[_9.sldModelNode.firstChild.nodeValue];
if(_a){
_a.addListener("loadModel",_5.paint,_5);
if(_a.doc){
_9.defaultStyle=new Object();
_9.selectStyle=new Object();
var _b=_a.getSldNode();
var _c="sld:UserStyle[sld:Name=";
var _d="wmc:Style[wmc:Name=";
var _e="//sld:UserStyle[sld:Name='"+_9.defaultStyleName+"']//sld:PointSymbolizer";
var _f="//sld:UserStyle[sld:Name='"+_9.defaultStyleName+"']//sld:LineSymbolizer";
var _10="//sld:UserStyle[sld:Name='"+_9.defaultStyleName+"']//sld:PolygonSymbolizer";
var _11="//sld:UserStyle[sld:Name='"+_9.selectStyleName+"']//sld:PointSymbolizer";
var _12="//sld:UserStyle[sld:Name='"+_9.selectStyleName+"']//sld:LineSymbolizer";
var _13="//sld:UserStyle[sld:Name='"+_9.selectStyleName+"']//sld:PolygonSymbolizer";
_9.defaultStyle.point=sld2OlStyle(_b.selectSingleNode(_e));
if(!_9.defaultStyle.point){
_9.defaultStyle.point=sld2OlStyle(_b.selectSingleNode(_e.replace(_c,_d)));
}
_9.defaultStyle.line=sld2OlStyle(_b.selectSingleNode(_f));
if(!_9.defaultStyle.line){
_9.defaultStyle.line=sld2OlStyle(_b.selectSingleNode(_f.replace(_c,_d)));
}
_9.defaultStyle.polygon=sld2OlStyle(_b.selectSingleNode(_10));
if(!_9.defaultStyle.polygon){
_9.defaultStyle.polygon=sld2OlStyle(_b.selectSingleNode(_10.replace(_c,_d)));
}
_9.selectStyle.point=sld2OlStyle(_b.selectSingleNode(_11));
if(!_9.selectStyle.point){
_9.selectStyle.point=sld2OlStyle(_b.selectSingleNode(_11.replace(_c,_d)));
}
_9.selectStyle.line=sld2OlStyle(_b.selectSingleNode(_12));
if(!_9.selectStyle.line){
_9.selectStyle.line=sld2OlStyle(_b.selectSingleNode(_12.replace(_c,_d)));
}
_9.selectStyle.polygon=sld2OlStyle(_b.selectSingleNode(_13));
if(!_9.selectStyle.polygon){
_9.selectStyle.polygon=sld2OlStyle(_b.selectSingleNode(_13.replace(_c,_d)));
}
if(_9.selectStyle.point){
_9.selectStyle.point.cursor=_9.hoverCursor;
}
if(_9.selectStyle.line){
_9.selectStyle.line.cursor=_9.hoverCursor;
}
if(_9.selectStyle.polygon){
_9.selectStyle.polygon.cursor=_9.hoverCursor;
}
}
}
}
}
var _14=OpenLayers.Class(OpenLayers.Layer.GML,{loadGML:function(){
if(!this.loaded){
var gml=this.format?new this.format():new OpenLayers.Format.GML();
this.addFeatures(gml.read(_6));
this.loaded=true;
}
},preFeatureInsert:function(_16){
if(_16.geometry){
var _17=_5.model.doc.selectSingleNode("//*[@fid='"+_16.fid+"']");
var _18=null;
if(_17){
_18=_17.getAttribute("sourceModel");
}
var _19=null;
if(_18&&config.objects[_18].config&&config.objects[_18].config[_5.id]){
_19=config.objects[_18].config[_5.id];
}else{
_19=_5.config;
}
if(_19.defaultStyle){
if(_16.geometry.CLASS_NAME.indexOf("Point")>-1){
_16.style=_19.defaultStyle.point;
}else{
if(_16.geometry.CLASS_NAME.indexOf("Line")>-1){
_16.style=_19.defaultStyle.line;
}else{
if(_16.geometry.CLASS_NAME.indexOf("Polygon")>-1){
_16.style=_19.defaultStyle.polygon;
}
}
}
}
if(_19.selectStyle){
if(_16.geometry.CLASS_NAME.indexOf("Point")>-1){
_16.mbSelectStyle=_19.selectStyle.point;
}else{
if(_16.geometry.CLASS_NAME.indexOf("Line")>-1){
_16.mbSelectStyle=_19.selectStyle.line;
}else{
if(_16.geometry.CLASS_NAME.indexOf("Polygon")>-1){
_16.mbSelectStyle=_19.selectStyle.polygon;
}
}
}
}
}
},getFeatureByFid:function(fid){
var _1b=_5.olLayer;
if(!_1b){
return null;
}
var _1c=_1b.features;
if(!_1c){
return null;
}
for(var i=0;i<_1c.length;++i){
if(_1c[i].fid==fid){
return _1c[i];
}
}
}});
var _1e=_1.selectSingleNode("mb:GeoRSS");
var _1f=false;
if(_1e&&_1e.firstChild){
if(_1e.firstChild.nodeValue=="true"){
_1f=true;
}
}
if(_1f){
if(config.proxyUrl){
url=config.proxyUrl+"?url="+escape(_5.model.url);
}else{
url=_5.model.url;
}
_5.olLayer=new OpenLayers.Layer.GeoRSSvector(_5.id,url);
}else{
_5.olLayer=new _14(_5.id);
}
_5.targetModel.map.addLayer(_5.olLayer);
_5.model.setParam("gmlRendererLayer",_5.olLayer);
}
_5.targetModel.addListener("refresh",_5.paint,_5);
};
this.model.addListener("refresh",this.paint,this);
this.model.addListener("refreshGmlRenderers",this.paint,this);
this.hiddenListener=function(_20,_21){
alert("hide/unhide "+_21);
};
this.model.addListener("hidden",this.hiddenListener,this);
this.hideFeature=function(_22,fid){
if(!fid){
fid=_22.model.getParam("hideFeature");
}
var _24=_22.olLayer.getFeatureByFid(fid);
if(_24){
_22.hiddenFeatures.push(fid);
_24.mbHidden=true;
_22.olLayer.renderer.eraseGeometry(_24.geometry);
}
};
this.model.addListener("hideFeature",this.hideFeature,this);
this.showFeature=function(_25,fid){
if(!fid){
fid=_25.model.getParam("showFeature");
}
var _27=_25.olLayer.getFeatureByFid(fid);
if(_27){
OpenLayers.Util.removeItem(_25.hiddenFeatures,fid);
_27.mbHidden=false;
_25.olLayer.drawFeature(_27);
}
};
this.model.addListener("showFeature",this.showFeature,this);
this.removeHiddenFeatures=function(_28){
if(_28.olLayer){
var _29=_28.hiddenFeatures.toString().split(/,/);
_28.hiddenFeatures=new Array();
for(var i in _29){
if(_29[i]){
_28.hideFeature(_28,_29[i]);
}
}
}
};
this.init=function(_2b){
var _2c=_1.selectSingleNode("mb:featureOnClick");
if(_2c){
var _2d=config.objects[_2c.firstChild.nodeValue];
_2b.model.addListener("olFeatureSelect",_2d.onClick,_2d);
}
var _2e=_1.selectSingleNode("mb:featureOnHover");
if(_2e){
var _2f=config.objects[_2e.firstChild.nodeValue];
_2b.model.addListener("olFeatureHover",_2f.onMouseover,_2f);
_2b.model.addListener("olFeatureOut",_2f.onMouseout,_2f);
}
_2b.targetModel.addListener("aoi",_2b.removeHiddenFeatures,_2b);
};
this.model.addListener("init",this.init,this);
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

mapbuilder.loadScript(baseDir+"/util/Util.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function ModelPopup(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
this.title="ModelPopup";
this.popup=null;
ModelPopup.prototype.paint=function(_3,_4){
if(_3.model.doc&&_3.node){
var _5=document.getElementById(_3.outputNodeId);
var _6=document.createElement("DIV");
_6.innerHTML="<input type=\"button\" onclick=\"javascript:config.objects."+_3.id+".popupWindow(config.objects."+_3.id+")\" value=\"View Context\">";
if(_6.firstChild!=null){
_6.firstChild.setAttribute("id",_3.outputNodeId);
}
if(_5){
_3.node.replaceChild(_6.firstChild,_5);
}else{
_3.node.appendChild(_6.firstChild);
}
}
};
this.model.addListener("refresh",this.paint,this);
ModelPopup.prototype.popupWindow=function(_7){
var s=(new XMLSerializer()).serializeToString(_7.model.doc);
s="<html><title>"+"Context"+"</title><body>"+Sarissa.escape(s)+"</body></html>";
s=s.replace(/&gt;/g,"&gt;<br/>");
var _9=window.open();
_9.document.write(s);
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectMapLayers(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function DragPan(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
return OpenLayers.Control.DragPan;
};
this.cursor="move";
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectLayerFromContext(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
SelectLayerFromContext.prototype.addLayer=function(_3){
var _4=this.getLayerNode(_3);
this.targetModel.callListeners("addLayer",_4);
};
SelectLayerFromContext.prototype.getLayerNode=function(_5){
return this.model.doc.selectSingleNode("(//wmc:Layer|//wmc:FeatureType)[wmc:Name ='"+_5+"']");
};
SelectLayerFromContext.prototype.showLayerMetadata=function(_6,_7){
var _8=this.getLayerNode(_6);
var _9=config.objects.layerMetadata;
if(!_9){
return false;
}
var _a=document.getElementById(_7);
_9.paint(_8,_a);
};
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
var _c={div:document.getElementById(_a.htmlTagId),layers:new Array()};
if(_a.minRatio){
_c.minRatio=_a.minRatio;
}
if(_a.maxRatio){
_c.maxRatio=_a.maxRatio;
}
var _d=true;
var _e=null;
if(_b.baseLayer){
_e=_a.getClonedLayer(_b.baseLayer);
_c.layers.push(_e);
}
if(_a.layerNames){
_d=false;
for(var i=0;i<_a.layerNames.length;i++){
for(var j=0;j<_b.layers.length;j++){
if(_a.layerNames[i]==_b.layers[j].params.LAYERS){
if(_b.layers[j]==_b.baseLayer){
_d=true;
}else{
_c.layers.push(_a.getClonedLayer(_b.layers[j]));
}
}
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
_a.control=new OpenLayers.Control.OverviewMap(_c);
_a.control.mapOptions={theme:null};
_b.addControl(_a.control);
for(var i in _c.layers){
_c.layers[i].setVisibility(true);
}
if(_e){
_e.setVisibility(_d);
}
}
};
OverviewMap.prototype.getClonedLayer=function(_12){
if(_12==null){
return null;
}
if(_12 instanceof OpenLayers.Layer.WMS){
var _13={units:_12.units,projection:_12.projection,maxExtent:_12.maxExtent,maxResolution:"auto",ratio:1,singleTile:true,isBaseLayer:_12.isBaseLayer};
return new OpenLayers.Layer.WMS(_12.name,_12.url,{layers:_12.params.LAYERS,format:_12.params.FORMAT,transparent:"TRUE"},_13);
}else{
var _14=_12.clone();
_14.setVisibility(true);
return _14;
}
};

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
var _7=new Proj(_5.targetModel.getSRS());
var _8=new Proj(_5.srs);
var _9=new PT(_6[0],_6[1]);
var _a=new PT(_6[2],_6[3]);
cs_transform(_8,_7,_9);
cs_transform(_8,_7,_a);
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
if(!_7.feature.layer.mbClickPopup||!_7.feature.layer.mbClickPopup.visible()){
var _8=_6.createPopup(_6,_7,true);
_7.feature.layer.mbHoverPopup=_8;
_8.events.register("mouseover",_8,_8.hide);
}
};
this.onMouseout=function(_9){
var _a=_9.model.getParam("olFeatureOut");
if(_a.layer.mbHoverPopup){
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FeedbackFeatureList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setNodeValue=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5,null,true);
};
this.setAttribValue=function(_6,_7,_8,_9){
_6.model.setXpathAttribute(_6.model,_7,_8,_9,null,true);
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function ProposeInsertFeature(_1,_2){
this.cursor="default";
ButtonBase.apply(this,new Array(_1,_2));
this.trm=_1.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
this.tm=_1.selectSingleNode("mb:targetModel").firstChild.nodeValue;
this.tc=_1.selectSingleNode("mb:targetContext").firstChild.nodeValue;
this.httpPayload=new Object();
this.httpPayload.url=_1.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
this.httpPayload.method="post";
this.insertXsl=new XslProcessor(baseDir+"/tool/xsl/wfs_Insert_atom.xsl");
this.cdataElementXsl=new XslProcessor(baseDir+"/tool/xsl/cdata_element.xsl");
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
_5.targetModel.setXpathAttribute(_5.targetModel,"//def:category[@scheme='http://www.geobase.ca/scheme/action']","term","Update");
}else{
_5.targetModel.setXpathAttribute(_5.targetModel,"//def:category[@scheme='http://www.geobase.ca/scheme/action']","term","Insert");
}
var _7=new Date();
var id=window.location.hostname+_7.getTime();
_5.targetModel.setXpathValue(_5.targetModel,"//def:entry/def:id",id);
point=_5.getFirstPoint(_5.targetModel);
_5.targetModel.setXpathValue(_5.targetModel,"//georss:where/gml:Point/gml:pos",point);
_5.targetModel.setXpathValue(_5.targetModel,"//def:entry/def:updated",_5.getISO8601Time());
s=_5.targetModel.doc;
s=_5.insertXsl.transformNodeToObject(s);
_5.httpPayload.postData=s;
_5.transactionResponseModel.transactionType="insert";
_5.transactionResponseModel.newRequest(_5.transactionResponseModel,_5.httpPayload);
}else{
alert(mbGetMessage("noFeatureToInsert"));
}
}
};
this.getBounds=function(_9){
var _a=_9.doc.selectNodes("//georss:featureOfInterest//gml:coordinates");
var _b;
var _c;
var _d;
var _e;
invalidCoord=false;
for(var n=0;n<_a.length;n++){
coords=_a[n].firstChild.nodeValue.trim().split(" ");
for(var c=0;c<coords.length;c++){
if(coords[c]!=""){
coord=coords[c].split(",");
}
if(coord.length==2){
_b=_b?Math.max(_b,parseFloat(coord[0])):parseFloat(coord[0]);
_c=_c?Math.max(_c,parseFloat(coord[1])):parseFloat(coord[1]);
_d=_d?Math.min(_d,parseFloat(coord[0])):parseFloat(coord[0]);
_e=_e?Math.min(_e,parseFloat(coord[1])):parseFloat(coord[1]);
}else{
invalidCoord=true;
}
}
}
if(invalidCoord){
alert("invalid coordinate found, but transaction will procceed");
}
return (_d+","+_e+" "+_d+","+_c+" "+_b+","+_c+" "+_b+","+_e+" "+_d+","+_e);
};
this.getFirstPoint=function(_11){
var _12=_11.doc.selectNodes("//georss:featureOfInterest//gml:coordinates");
invalidCoord=false;
for(var n=0;n<_12.length;n++){
coords=_12[n].firstChild.nodeValue.trim().split(" ");
if(coords.length>=0&&coords[0]!=""){
result=coords[0].replace(","," ");
}else{
invalidCoord=true;
}
}
if(invalidCoord){
alert("invalid coordinate found, but transaction will procceed");
}
return (result);
};
this.handleResponse=function(_14){
if(_14.transactionResponseModel.transactionType=="insert"){
success=_14.transactionResponseModel.doc.selectSingleNode("//wfs:TransactionResult/wfs:Status/wfs:SUCCESS");
if(success){
_14.targetModel.setModel(_14.targetModel,null);
_14.targetModel.callListeners("refreshGmlRenderers");
_14.targetContext.callListeners("refreshWmsLayers");
}
}
};
this.getISO8601Time=function(){
var _15=new Date();
var _16=_15.getYear();
if(_16<2000){
_16=_16+1900;
}
var _17=_15.getMonth()+1;
var day=_15.getDate();
var _19=_15.getHours();
var _1a=_15.getUTCHours();
var _1b=_19-_1a;
var _1c=Math.abs(_1b);
var _1d=_15.getMinutes();
var _1e=_15.getUTCMinutes();
var _1f;
var _20=_15.getSeconds();
var _21;
if(_1d!=_1e&&_1e<30&&_1b<0){
_1c--;
}
if(_1d!=_1e&&_1e>30&&_1b>0){
_1c--;
}
if(_1d!=_1e){
_1f=":30";
}else{
_1f=":00";
}
if(_1c<10){
_21="0"+_1c+_1f;
}else{
_21=""+_1c+_1f;
}
if(_1b<0){
_21="-"+_21;
}else{
_21="+"+_21;
}
if(_17<=9){
_17="0"+_17;
}
if(day<=9){
day="0"+day;
}
if(_19<=9){
_19="0"+_19;
}
if(_1d<=9){
_1d="0"+_1d;
}
if(_20<=9){
_20="0"+_20;
}
time=_16+"-"+_17+"-"+day+"T"+_19+":"+_1d+":"+_20+_21;
return time;
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function MapTitle(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
alert(mbGetMessage("lastFrameAfterFirst"));
}
this.model.setParam("stopLoop");
};
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Locations(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAoi=function(_3,_4,_5){
var _6=_5.split(/[:#]/);
_5="EPSG:"+_6[_6.length-1];
if(!_5){
_5="EPSG:4326";
}
var _7=new Array();
_7=_3.split(",");
var _8=new PT(parseFloat(_7[0]),parseFloat(_7[3]));
var _9=new PT(parseFloat(_7[2]),parseFloat(_7[1]));
cs_transform(new Proj(_5),this.targetModel.proj,_8);
cs_transform(new Proj(_5),this.targetModel.proj,_9);
var ul=new Array(_8.x,_8.y);
var lr=new Array(_9.x,_9.y);
this.targetModel.setParam("aoi",new Array(ul,lr));
this.targetModel.map.zoomToExtent(new OpenLayers.Bounds(ul[0],lr[1],lr[0],ul[1]));
};
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Timestamp(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.updateTimestamp=function(_3,_4){
var _5=document.getElementById("timestampValue");
_5.value=_3.model.timestampList.childNodes[_4].firstChild.nodeValue;
};
this.model.addListener("timestamp",this.updateTimestamp,this);
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function ShowDistance(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.showDistance=function(_3){
_3.distForm=document.getElementById(_3.formName);
var _4=_3.model.values.showDistance;
if(_4==null){
document.getElementById(_3.htmlTagId).style.display="none";
}else{
document.getElementById(_3.htmlTagId).style.display="";
if(_4>1000){
if(_4>1000000){
outputDistance=Math.round(_4/1000)+"  km";
}else{
outputDistance=Math.round(_4/100)/10+"  km";
}
}else{
if(_4>0){
outputDistance=Math.round(_4)+"  m";
}else{
outputDistance="";
}
}
if(_3.distForm){
_3.distForm.distance.value=outputDistance;
}
}
};
this.model.addListener("showDistance",this.showDistance,this);
this.formName="ShowDistance_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
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
alert(mbGetMessage("tabWidgetNotFound",_7));
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
alert(mbGetMessage("noDataYet"));
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
if(_f.tabAction){
eval(_f.tabAction);
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
var _16=_14.widgetNode.selectSingleNode("mb:tabAction");
if(_16){
_14.tabAction=_16.firstChild.nodeValue;
}
}
};
}

mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/tool/Extent.js");
function TimeSeriesOL(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
OpenLayers.ImgPath=config.skinDir+"/images/openlayers/";
this.containerNodeId=this.htmlTagId;
_2.containerModel=this.model;
this.node=document.getElementById(this.containerNodeId);
if(!this.model.extent){
this.model.extent=new Extent(this.model);
this.model.addFirstListener("loadModel",this.model.extent.firstInit,this.model.extent);
}
var _3=_1.selectSingleNode("mb:tileGutter");
this.tileGutter=_3?_3.firstChild.nodeValue:0;
var _4=_1.selectSingleNode("mb:tileBuffer");
this.tileBuffer=_4?_4.firstChild.nodeValue:2;
var _5=_1.selectSingleNode("mb:tileSize");
this.tileSize=_5?_5.firstChild.nodeValue:256;
var _6=_1.selectSingleNode("mb:imageReproject");
this.imageReproject=_6?_6.firstChild.nodeValue:false;
var _7=_1.selectSingleNode("mb:imageBuffer");
this.imageBuffer=_7?_7.firstChild.nodeValue:2;
var _8=_1.selectSingleNode("mb:displayOutsideMaxExtent");
this.displayOutsideMaxExtent=_8?_8.firstChild.nodeValue:"false";
if(this.displayOutsideMaxExtent.toUpperCase=="FALSE"){
this.displayOutsideMaxExtent=false;
}
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
this.model.addListener("newModel",this.clearWidget2,this);
this.model.addListener("timestamp",this.timestampListener,this);
}
TimeSeriesOL.prototype.paint=function(_d,_e){
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
_11=(_11)?_11.firstChild.nodeValue:"auto";
var _12=_f.units=="meters"?"m":_f.units;
var _13=_d.widgetNode.selectSingleNode("mb:resolutions");
_13=_13?_13.firstChild.nodeValue.split(","):null;
var _14=_d.widgetNode.selectSingleNode("mb:scales");
if(_14){
_14=_14.firstChild.nodeValue.split(",");
_13=new Array();
for(var s in _14){
_13.push(OpenLayers.Util.getResolutionFromScale(_14[s],_12));
}
}
if(_13){
_d.model.extent.setZoomLevels(true,_13);
}else{
_d.model.extent.setZoomLevels(false);
}
var _16=null;
_16=_d.widgetNode.selectSingleNode("mb:fixedSize");
_16=(_16)?_16.firstChild.nodeValue:null;
if(_16=="true"){
_d.node.style.width=_d.model.getWindowWidth()+"px";
_d.node.style.height=_d.model.getWindowHeight()+"px";
}
var _17={controls:[],projection:_f.srs,units:_12,maxExtent:_10,maxResolution:_11,resolutions:_13,theme:config.skinDir+"/openlayers/style.css"};
_d.model.map=new OpenLayers.Map(_d.node,_17);
_d.model.map.Z_INDEX_BASE.Control=10000;
var _18=_d.model.getAllLayers();
if(!_d.oLlayers){
_d.oLlayers=new Array();
}
for(var i=0;i<=_18.length-1;i++){
_d.addLayer(_d,_18[i]);
}
var _1a=_d.model.getBoundingBox();
_d.model.map.mbMapPane=_d;
_d.model.map.events.register("moveend",_d.model.map,_d.updateContext);
_d.model.map.events.register("mouseup",_d.model.map,_d.updateMouse);
_d.model.map.zoomToExtent(new OpenLayers.Bounds(_1a[0],_1a[1],_1a[2],_1a[3]));
}
};
TimeSeriesOL.prototype.updateContext=function(e){
var _1c=e.object.mbMapPane;
var _1d=_1c.model.map.getExtent().toBBOX().split(",");
var ul=new Array(_1d[0],_1d[3]);
var lr=new Array(_1d[2],_1d[1]);
if(_1c.model.getWindowWidth()!=e.element.offsetWidth){
_1c.model.setWindowWidth(e.element.offsetWidth);
}
if(_1c.model.getWindowHeight()!=e.element.offsetHeight){
_1c.model.setWindowHeight(e.element.offsetHeight);
}
var _20=_1c.model.getParam("aoi");
var _21=new Array(ul,lr);
if(!_20||_20.toString!=_21.toString()){
_1c.model.setBoundingBox(new Array(ul[0],lr[1],lr[0],ul[1]));
_1c.model.extent.setSize(_1c.model.map.getResolution());
_1c.model.setParam("aoi",_21);
}
};
TimeSeriesOL.prototype.updateMouse=function(e){
var _23=e.object.mbMapPane;
if(_23.model.map.mbCursor){
_23.model.map.div.style.cursor=_23.model.map.mbCursor;
}
_23.model.callListeners("mouseup",{evpl:[e.xy.x,e.xy.y]});
};
TimeSeriesOL.prototype.hidden=function(_24,_25){
var vis=_24.model.getHidden(_25);
if(vis=="1"){
var _27=false;
}else{
var _27=true;
}
var _28=_24.getLayer(_24,_25);
if(_28){
_28.setVisibility(_27);
}
};
TimeSeriesOL.prototype.getLayer=function(_29,_2a){
return _29.model.map.getLayer(_29.oLlayers[_2a].id);
};
TimeSeriesOL.prototype.deleteLayer=function(_2b,_2c){
if(_2b.oLlayers[_2c]){
_2b.model.map.removeLayer(_2b.oLlayers[_2c]);
}
};
TimeSeriesOL.prototype.deleteAllLayers=function(_2d){
_2d.model.map.destroy();
};
TimeSeriesOL.prototype.moveLayerUp=function(_2e,_2f){
var map=_2e.model.map;
map.raiseLayer(map.getLayer(_2e.oLlayers[_2f].id),1);
};
TimeSeriesOL.prototype.moveLayerDown=function(_31,_32){
_31.model.map.raiseLayer(_31.getLayer(_31,_32),-1);
};
TimeSeriesOL.prototype.setOpacity=function(_33,_34){
var _35="1";
_35=_33.model.getOpacity(_34);
_33.getLayer(_33,_34).setOpacity(_35);
};
TimeSeriesOL.prototype.addLayer=function(_36,_37){
var _38=_37;
var _39=_38.selectSingleNode("wmc:Server/@service");
_39=(_39)?_39.nodeValue:"";
var _3a=_38.selectSingleNode("wmc:Title");
_3a=(_3a)?_3a.firstChild.nodeValue:"";
var _3b=_38.selectSingleNode("wmc:Name");
_3b=(_3b)?_3b.firstChild.nodeValue:"";
if(_36.context=="OWS"){
var _3c=_38.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");
_3c=(_3c)?_3c.firstChild.nodeValue:"";
}else{
var _3c=_38.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
}
var _3d=_38.selectSingleNode("wmc:FormatList/wmc:Format");
_3d=(_3d)?_3d.firstChild.nodeValue:"image/gif";
var vis=_38.selectSingleNode("@hidden");
if(vis){
if(vis.nodeValue=="1"){
vis=false;
}else{
vis=true;
}
}
var _3f=_38.selectSingleNode("@queryable");
if(_3f){
if(_3f.nodeValue=="1"){
_3f=true;
}else{
_3f=false;
}
}
var _40=_38.selectSingleNode("@opacity");
if(_40){
_40=_40.nodeValue;
}else{
_40=false;
}
var _41=_38.selectSingleNode("wmc:StyleList/wmc:Style[@current=1]");
var _42;
var _43={visibility:vis,transparent:"TRUE",projection:_36.model.map.projection,queryable:_3f,maxExtent:_36.model.map.maxExtent,maxResolution:_36.model.map.maxResolution,alpha:false,isBaseLayer:false,displayOutsideMaxExtent:_36.displayOutsideMaxExtent};
switch(_39){
case "OGC":
case "WMS":
case "wms":
case "OGC:WMS":
if(!_36.model.map.baseLayer){
_43.isBaseLayer=true;
}else{
_43.reproject=_36.imageReproject;
_43.isBaseLayer=false;
}
_43.ratio=_36.imageBuffer;
var _44=new Array();
_44=sld2UrlParam(_41);
if(_36.model.timestampList&&_36.model.timestampList.getAttribute("layerName")==_3b){
var _45;
var _46=_36.model.timestampList.childNodes[0];
_45=_36.model.id+"_"+_36.id+"_"+_3b;
_45+="_"+_46.firstChild.nodeValue;
_36.oLlayers[_3b]=new OpenLayers.Layer.WMS.Untiled(_3a,_3c,{layers:_3b,"TIME":_46.firstChild.nodeValue,transparent:"TRUE",format:_3d,sld:_44.sld,sld_body:_44.sld_body,styles:_44.styles},_43);
var _47=_36.model.timestampList.childNodes.length;
this.animatedImageDivs=new Array(_47);
}else{
_36.oLlayers[_3b]=new OpenLayers.Layer.WMS.Untiled(_3a,_3c,{layers:_3b,transparent:"TRUE",format:_3d,sld:_44.sld,sld_body:_44.sld_body,styles:_44.styles},_43);
}
break;
case "WMS-C":
case "OGC:WMS-C":
if(!_36.model.map.baseLayer){
_43.isBaseLayer=true;
}else{
_43.reproject=_36.imageReproject;
_43.isBaseLayer=false;
}
_43.gutter=_36.tileGutter;
_43.buffer=_36.tileBuffer;
_43.tileSize=new OpenLayers.Size(_36.tileSize,_36.tileSize);
var _44=new Array();
_44=sld2UrlParam(_41);
_36.oLlayers[_3b]=new OpenLayers.Layer.WMS(_3a,_3c,{layers:_3b,transparent:"TRUE",format:_3d,sld:_44.sld,sld_body:_44.sld_body,styles:_44.styles},_43);
break;
case "wfs":
case "OGC:WFS":
style=sld2OlStyle(_41);
if(style){
_43.style=style;
}else{
_43.style=_36.getWebSafeStyle(_36,2*i+1);
}
_43.featureClass=OpenLayers.Feature.WFS;
_36.oLlayers[_3b]=new OpenLayers.Layer.WFS(_3a,_3c,{typename:_3b,maxfeatures:1000},_43);
break;
case "gml":
case "OGC:GML":
style=sld2OlStyle(_41);
if(style){
_43.style=style;
}else{
_43.style=_36.getWebSafeStyle(_36,2*i+1);
}
_36.oLlayers[_3b]=new OpenLayers.Layer.GML(_3a,_3c,_43);
break;
case "GMAP":
case "Google":
_43.projection="EPSG:41001";
_43.units="degrees";
_36.model.map.units="degrees";
_43.maxExtent=new OpenLayers.Bounds("-180","-90","180","90");
_43.isBaseLayer=true;
_36.oLlayers[_3b]=new OpenLayers.Layer.Google("Google Satellite",{type:G_HYBRID_MAP,maxZoomLevel:18},_43);
break;
case "YMAP":
case "Yahoo":
_43.isBaseLayer=true;
_36.oLlayers[_3b]=new OpenLayers.Layer.Yahoo("Yahoo");
break;
case "VE":
case "Microsoft":
_43.isBaseLayer=true;
_36.oLlayers[_3b]=new OpenLayers.Layer.VirtualEarth("VE",{minZoomLevel:0,maxZoomLevel:18,type:VEMapStyle.Hybrid});
break;
case "MultiMap":
_43.isBaseLayer=true;
_36.oLlayers[_3b]=new OpenLayers.Layer.MultiMap("MultiMap");
break;
default:
alert(mbGetMessage("layerTypeNotSupported",_39));
}
if(_40&&_36.oLlayers[_3b]){
_36.oLlayers[_3b].setOpacity(_40);
}
_36.model.map.addLayer(_36.oLlayers[_3b]);
};
TimeSeriesOL.prototype.getWebSafeStyle=function(_48,_49){
colors=new Array("00","33","66","99","CC","FF");
_49=(_49)?_49:0;
_49=(_49<0)?0:_49;
_49=(_49>215)?215:_49;
i=parseInt(_49/36);
j=parseInt((_49-i*36)/6);
k=parseInt((_49-i*36-j*6));
var _4a="#"+colors[i]+colors[j]+colors[k];
var _4b=new Object();
_4b.fillColor=_4a;
_4b.strokeColor=_4a;
_4b.map=_48.model.map;
return _4b;
};
TimeSeriesOL.prototype.refreshLayer=function(_4c,_4d,_4e){
_4e["version"]=Math.random();
_4c.getLayer(_4c,_4d).mergeNewParams(_4e);
};
TimeSeriesOL.prototype.clearWidget2=function(_4f){
if(_4f.model.map){
_4f.model.map.destroy();
outputNode=document.getElementById(_4f.model.id+"Container_OpenLayers_ViewPort");
if(outputNode){
_4f.node.removeChild(outputNode);
}
_4f.model.map=null;
_4f.oLlayers=null;
}
};
TimeSeriesOL.prototype.timestampListener=function(_50,_51){
var _52=_50.model.timestampList.getAttribute("layerName");
var _53=_50.model.timestampList.childNodes[_51];
if((_52)&&(_53)){
var _54=_50.oLlayers[_52];
var _55=_54.tile.imgDiv.src;
var _56=_55;
_56=_56.replace(/TIME\=.*?\&/,"TIME="+_53.firstChild.nodeValue+"&");
_54.tile.imgDiv.src=_56;
}
};

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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function LayerMaxFeatures(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
if(_1.selectSingleNode("mb:maxFeatures")){
this.model.setParam("maxFeatures",_1.selectSingleNode("mb:maxFeatures").firstChild.nodeValue);
}
this.paint=function(_3,_4){
if((_4.style.display!="none")&&(_4.innerHTML!="")){
_4.style.display="none";
return false;
}
this.stylesheet.setParameter("layerNode",_3);
var _5=this.stylesheet.transformNodeToString(this.model.doc);
_4.innerHTML=_5;
_4.style.display="block";
};
LayerMaxFeatures.prototype.initLayer=function(_6,_7){
if(!_7.hasAttribute("maxFeatures")){
_6.setLayerMaxFeatures(_7);
}
};
this.model.addFirstListener("addLayer",this.initLayer,this);
LayerMaxFeatures.prototype.setLayerMaxFeatures=function(_8,_9){
if(!_9){
_9=this.model.getParam("maxFeatures");
}
if(_8.nodeName=="FeatureType"||_8.nodeName=="wmc:FeatureType"){
_8.setAttribute("maxFeatures",_9);
layerName=_8.selectSingleNode("wmc:Name").firstChild.nodeValue;
this.model.map.mbMapPane.refreshLayer(this.model.map.mbMapPane,layerName,{MAXFEATURES:_9});
this.model.callListeners("refresh");
}
};
LayerMaxFeatures.prototype.removeLayerMaxFeatures=function(_a){
if(_a&&_a.hasAttribute("maxFeatures")){
_a.removeAttribute("maxFeatures");
layerName=_a.selectSingleNode("wmc:Name").firstChild.nodeValue;
this.model.map.mbMapPane.refreshLayer(this.model.map.mbMapPane,layerName,{MAXFEATURES:null});
this.model.callListeners("refresh");
}
};
LayerMaxFeatures.prototype.refresh=function(_b,_c){
};
this.model.addListener("refresh",this.refresh,this);
LayerMaxFeatures.prototype.toggle=function(_d){
layerNode=this.model.getLayer(_d);
if(!layerNode){
return false;
}
if(layerNode.hasAttribute("maxFeatures")){
this.removeLayerMaxFeatures(layerNode);
}else{
this.setLayerMaxFeatures(layerNode);
}
node=document.getElementById(_d+"_Loading");
};
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectAllMapLayers(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditPolygon(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control.DrawFeature,{CLASS_NAME:"mbEditPolygon"});
return _4;
};
this.instantiateControl=function(_5,_6){
return new _6(_5.featureLayer,OpenLayers.Handler.Polygon);
};
this.setFeature=function(_7,_8){
if(_7.enabled){
var _9=_8.geometry.components[0].components;
var _a="";
for(var i in _9){
_a+=" "+_9[i].x+","+_9[i].y;
}
sucess=_7.targetModel.setXpathValue(_7.targetModel,_7.featureXpath,_a);
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathEditPolygon",_7.featureXpath));
}
}
};
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
if(_3.trm&&!_3.transactionResponseModel){
_3.transactionResponseModel=window.config.objects[_3.trm];
}
if(_3.enabled&&_4&&_3.targetModel.url!=_3.defaultModelUrl){
_3.loadDefaultModel(_3);
}
if(!_4&&_3.transactionResponseModel){
_3.transactionResponseModel.setModel(_3.transactionResponseModel,null);
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
this.handleFeatureInsert=function(_7){
var _8=_7.layer.mbButton;
_8.setFeature(_8,_7);
_7.destroy();
};
this.setEditingLayer=function(_9){
if(!_9.targetContext.featureLayers[_9.id]){
_9.featureLayer=new OpenLayers.Layer.Vector(_9.id);
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
};
this.model.addListener("init",this.initButton,this);
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
function Abstract(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
function LayerMetadata(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.paint=function(_3,_4){
if((_4.style.display!="none")&&(_4.innerHTML!="")){
_4.style.display="none";
return false;
}
this.stylesheet.setParameter("layerNode",_3);
var _5=this.stylesheet.transformNodeToString(this.model.doc);
_4.innerHTML=_5;
_4.style.display="block";
};
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditPoint(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class(OpenLayers.Control.DrawFeature,{CLASS_NAME:"mbEditPoint"});
return _4;
};
this.instantiateControl=function(_5,_6){
return new _6(_5.featureLayer,OpenLayers.Handler.Point);
};
this.setFeature=function(_7,_8){
if(_7.enabled){
sucess=_7.targetModel.setXpathValue(_7.targetModel,_7.featureXpath,_8.geometry.x+","+_8.geometry.y);
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathEditPoint",_7.featureXpath));
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function TransactionResponse(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function OpenLSResponse(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function LayerControl(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.prePaint=function(_3){
if(_3.model.featureName){
_3.stylesheet.setParameter("featureName",_3.model.featureName);
_3.stylesheet.setParameter("hidden",_3.model.getHidden(_3.model.featureName).toString());
}
};
this.addWidget=function(_4,_5){
this.tabList.push(_4);
if(!_5){
_5=_4.id;
}
var _6=config.widgetText.selectSingleNode(this.textNodeXpath+"/mb:"+_4.id);
if(_6){
_5=_6.firstChild.nodeValue;
}
var _7=this.model.doc.createElementNS(mbNS,"tab");
_7.appendChild(this.model.doc.createTextNode(_4.id));
_7.setAttribute("label",_5);
this.widgetNode.appendChild(_7);
this.paint(this);
this.selectTab(_4);
};
this.highlightLayer=function(_8){
var _9=this.model.id+"_"+"mainMapWidget"+"_"+_8;
var _a=document.getElementById("previewImage");
var _b=document.getElementById(_9);
if(_a){
_a.src=_b.firstChild.src;
}
};
this.refresh=function(_c,_d){
_c.paint(_c,_c.id);
};
this.foldUnfoldGroup=function(_e,id){
var _10="//wmc:General/wmc:Extension/wmc:GroupList/wmc:Group[@name='"+_e+"']";
var _11=_2.doc.selectSingleNode(_10);
var _12=_11.getAttribute("folded");
e=document.getElementById(id);
if(_12=="1"){
_11.setAttribute("folded","0");
e.value="-";
}else{
_11.setAttribute("folded","1");
e.value="+";
}
};
this.getLayerFullRequestString=function(_13){
var _14;
_14=config.objects.mainMapWidget.oLlayers[_13].getFullRequestString();
_14+="&BBOX="+config.objects.mainMap.getBoundingBox();
return _14;
};
this.getLayerNode=function(_15){
return this.model.doc.selectSingleNode("(//wmc:Layer|//wmc:FeatureType)[wmc:Name ='"+_15+"']");
};
this.showLayerMetadata=function(_16,_17){
var _18=this.getLayerNode(_16);
var _19=config.objects.layerMetadata;
if(!_19){
return false;
}
var _1a=document.getElementById(_17);
_19.paint(_18,_1a);
};
this.ChangeImage=function(id,_1c,_1d){
var _1e=document.getElementById(id).src.indexOf(_1c);
var _1f=document.getElementById(id).src.indexOf(_1d);
if(document.getElementById(id)!=null){
if(_1e!=-1){
document.getElementById(id).src=document.getElementById(id).src.substring(0,_1e)+_1d;
}else{
document.getElementById(id).src=document.getElementById(id).src.substring(0,_1f)+_1c;
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
function FeatureList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setNodeValue=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5);
};
this.setAttribValue=function(_6,_7,_8,_9){
_6.model.setXpathAttribute(_6.model,_7,_8,_9);
};
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
var _5=this.transformNodeToObject(_4);
var s=(new XMLSerializer()).serializeToString(_5);
if(_SARISSA_IS_OPERA){
s=s.replace(/.*\?\>/,"");
}
return s;
}
catch(e){
alert(mbGetMessage("exceptionTransformingDoc",this.xslUrl));
alert(e.name+": "+e.message);
alert("XSL="+(new XMLSerializer()).serializeToString(this.xslDom));
alert("XML="+(new XMLSerializer()).serializeToString(_4));
}
};
this.transformNodeToObject=function(_7){
if(_SARISSA_IS_SAFARI){
var _8=new DOMParser().parseFromString("<xsltresult></xsltresult>","text/xml");
var _9=this.processor.transformToFragment(_7,_8);
var _a=(new XMLSerializer()).serializeToString(_9);
_a.replace(/\s/g,"");
}else{
var _9=this.processor.transformToDocument(_7);
}
return _9;
};
this.setParameter=function(_b,_c,_d){
if(!_c){
return;
}
this.processor.setParameter(null,_b,_c);
};
}
function postLoad(_e,_f,_10){
var _11=new XMLHttpRequest();
if(_e.indexOf("http://")==0){
_11.open("POST",config.proxyUrl,false);
_11.setRequestHeader("serverUrl",_e);
}else{
_11.open("POST",_e,false);
}
_11.setRequestHeader("content-type","text/xml");
if(_10){
_11.setRequestHeader("content-type",_10);
}
_11.send(_f);
if(_11.status>=400){
alert(mbGetMessage("errorLoadingDocument",_e,_11.statusText,_11.responseText));
var _12=Sarissa.getDomDocument();
_12.parseError=-1;
return _12;
}else{
if(null==_11.responseXML){
alert(mbGetMessage("nullXmlResponse",_11.responseText));
}
return _11.responseXML;
}
}
function postGetLoad(_13,_14,_15,dir,_17){
var _18=new XMLHttpRequest();
if(_13.indexOf("http://")==0){
_18.open("POST",config.proxyUrl,false);
_18.setRequestHeader("serverUrl",_13);
}else{
_13=_13+"?dir="+dir+"&fileName="+_17;
_18.open("POST",_13,false);
}
_18.setRequestHeader("content-type","text/xml");
if(_15){
_18.setRequestHeader("content-type",_15);
}
_18.send(_14);
if(_18.status>=400){
alert(mbGetMessage("errorLoadingDocument",_13,_18.statusText,_18.responseText));
var _19=Sarissa.getDomDocument();
_19.parseError=-1;
return _19;
}else{
if(null==_18.responseXML){
alert(mbGetMessage("nullXmlResponse",_18.responseText));
}
return _18.responseXML;
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
function createElementWithNS(doc,_1c,_1d){
if(_SARISSA_IS_IE){
return doc.createNode(1,_1c,_1d);
}else{
return doc.createElementNS(_1d,_1c);
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
function setISODate(_1e){
var _1f=_1e.match(/(\d{4})-?(\d{2})?-?(\d{2})?T?(\d{2})?:?(\d{2})?:?(\d{2})?\.?(\d{0,3})?(Z)?/);
var res=null;
for(var i=1;i<_1f.length;++i){
if(!_1f[i]){
_1f[i]=(i==3)?1:0;
if(!res){
res=i;
}
}
}
var _22=new Date();
_22.setFullYear(parseInt(_1f[1],10));
_22.setMonth(parseInt(_1f[2],10)-1,parseInt(_1f[3],10));
_22.setDate(parseInt(_1f[3],10));
_22.setHours(parseInt(_1f[4],10));
_22.setMinutes(parseInt(_1f[5],10));
_22.setSeconds(parseFloat(_1f[6],10));
if(!res){
res=6;
}
_22.res=res;
return _22;
}
function getISODate(_23){
var res=_23.res?_23.res:6;
var _25="";
_25+=res>=1?_23.getFullYear():"";
_25+=res>=2?"-"+leadingZeros(_23.getMonth()+1,2):"";
_25+=res>=3?"-"+leadingZeros(_23.getDate(),2):"";
_25+=res>=4?"T"+leadingZeros(_23.getHours(),2):"";
_25+=res>=5?":"+leadingZeros(_23.getMinutes(),2):"";
_25+=res>=6?":"+leadingZeros(_23.getSeconds(),2):"";
return _25;
}
function leadingZeros(num,_27){
var _28=parseInt(num,10);
var _29=Math.pow(10,_27);
if(_28<_29){
_28+=_29;
}
return _28.toString().substr(1);
}
function fixPNG(_2a,_2b,_2c){
if(_SARISSA_IS_IE){
if(_2c){
var _2d=_2c.style.filter.substring(_2c.style.filter.indexOf("opacity=",0)+8,_2c.style.filter.lastIndexOf(")",0));
if(_2c.style.filter.indexOf("opacity=",0)==-1){
_2d=null;
}
var _2e=(_2d)?_2d/100:-1;
}
var _2f="id='"+_2b+"' ";
var _30=(_2a.className)?"class='"+_2a.className+"' ":"";
var _31=(_2a.title)?"title='"+_2a.title+"' ":"title='"+_2a.alt+"' ";
var _32="display:inline-block;"+_2a.style.cssText;
var _33="<span "+_2f+_30+_31;
_33+=" style=\""+"width:"+_2a.width+"px; height:"+_2a.height+"px;"+_32+";";
if(_2e!=-1){
_33+="opacity="+_2e+";";
}
var src=_2a.src;
src=src.replace(/\(/g,"%28");
src=src.replace(/\)/g,"%29");
src=src.replace(/'/g,"%27");
src=src.replace(/%23/g,"%2523");
_33+="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader";
_33+="(src='"+src+"', sizingMethod='scale')";
if(_2c&&_2e!=-1){
_33+=" alpha(opacity="+(_2e*100)+")";
}
_33+="; \"></span>";
return _33;
}
}
function getAbsX(elt){
return (elt.x)?elt.x:getAbsPos(elt,"Left")+2;
}
function getAbsY(elt){
return (elt.y)?elt.y:getAbsPos(elt,"Top")+2;
}
function getAbsPos(elt,_38){
iPos=0;
while(elt!=null){
iPos+=elt["offset"+_38];
elt=elt.offsetParent;
}
return iPos;
}
function getPageX(e){
var _3a=0;
if(!e){
var e=window.event;
}
if(e.pageX){
_3a=e.pageX;
}else{
if(e.clientX){
_3a=e.clientX;
}
}
if(document.body&&document.body.scrollLeft){
_3a+=document.body.scrollLeft;
}else{
if(document.documentElement&&document.documentElement.scrollLeft){
_3a+=document.documentElement.scrollLeft;
}
}
return _3a;
}
function getPageY(e){
var _3c=0;
if(!e){
var e=window.event;
}
if(e.pageY){
_3c=e.pageY;
}else{
if(e.clientY){
_3c=e.clientY;
}
}
if(document.body&&document.body.scrollTop){
_3c+=document.body.scrollTop;
}else{
if(document.documentElement&&document.documentElement.scrollTop){
_3c+=document.documentElement.scrollTop;
}
}
return _3c;
}
function getArgs(){
var _3d=new Object();
var _3e=location.search.substring(1);
var _3f=_3e.split("&");
for(var i=0;i<_3f.length;i++){
var pos=_3f[i].indexOf("=");
if(pos==-1){
continue;
}
var _42=_3f[i].substring(0,pos);
var _43=_3f[i].substring(pos+1);
_3d[_42]=unescape(_43.replace(/\+/g," "));
}
return _3d;
}
window.cgiArgs=getArgs();
function getScreenX(_44,_45){
bbox=_44.getBoundingBox();
width=_44.getWindowWidth();
bbox[0]=parseFloat(bbox[0]);
bbox[2]=parseFloat(bbox[2]);
var _46=(width/(bbox[2]-bbox[0]));
x=_46*(_45-bbox[0]);
return x;
}
function getScreenY(_47,_48){
var _49=_47.getBoundingBox();
var _4a=_47.getWindowHeight();
_49[1]=parseFloat(_49[1]);
_49[3]=parseFloat(_49[3]);
var _4b=(heighteight/(_49[3]-_49[1]));
var y=_4a-(_4b*(pt.y-_49[1]));
return y;
}
function getGeoCoordX(_4d,_4e){
var _4f=_4d.getBoundingBox();
var _50=_4d.getWindowWidth();
_4f[0]=parseFloat(_4f[0]);
_4f[2]=parseFloat(_4f[2]);
var _51=((_4f[2]-_4f[0])/_50);
var x=_4f[0]+_51*(xCoord);
return x;
}
function getGeoCoordY(_53){
var _54=context.getBoundingBox();
var _55=context.getWindowHeight();
_54[1]=parseFloat(_54[1]);
_54[3]=parseFloat(_54[3]);
var _56=((_54[3]-_54[1])/_55);
var y=_54[1]+_56*(_55-_53);
return y;
}
function makeElt(_58){
var _59=document.createElement(_58);
document.getElementsByTagName("body").item(0).appendChild(_59);
return _59;
}
var newWindow="";
function openPopup(url,_5b,_5c){
if(_5b==null){
_5b=300;
}
if(_5c==null){
_5c=200;
}
if(!newWindow.closed&&newWindow.location){
newWindow.location.href=url;
}else{
newWindow=window.open(url,"name","height="+_5c+",width="+_5b);
if(!newWindow.opener){
newwindow.opener=self;
}
}
if(window.focus){
newWindow.focus();
}
return false;
}
function debug(_5d){
tarea=makeElt("textarea");
tarea.setAttribute("rows","3");
tarea.setAttribute("cols","40");
tnode=document.createTextNode(_5d);
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
function addEvent(_60,_61,_62){
if(document.addEventListener){
_60.addEventListener(_61,_62,false);
}else{
if(document.attachEvent){
_60.attachEvent("on"+_61,_62);
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
function mbDebugMessage(_66,_67){
if(_66&&_66.debug){
alert(_67);
}
}
function mbGetMessage(_68){
var _69="NoMsgsFound";
if(config.widgetText){
var _6a="/mb:WidgetText/mb:messages/mb:"+_68;
var _6b=config.widgetText.selectNodes(_6a);
if(!_6b||_6b.length==0){
_69=_68;
}else{
_69=_6b.item(_6b.length-1).firstChild.nodeValue;
if(arguments[mbGetMessage.length]){
var _6c=[].slice.call(arguments,mbGetMessage.length);
_6c.unshift(_69);
_69=mbFormatMessage.apply(this,_6c);
}
}
}
return _69;
}
function mbFormatMessage(_6d){
var _6e=_6d;
var _6f=[].slice.call(arguments,mbFormatMessage.length);
for(var i in _6f){
var _71=new RegExp("\\{"+i+"\\}","g");
_6e=_6e.replace(_71,_6f[i]);
}
return _6e;
}
function sld2UrlParam(_72){
var _73=new Array();
if(_72){
var sld=_72.selectSingleNode("wmc:SLD");
var _75=_72.selectSingleNode("wmc:Name");
if(sld){
if(sld.selectSingleNode("wmc:OnlineResource")){
_73.sld=sld.selectSingleNode("wmc:OnlineResource").getAttribute("xlink:href");
}else{
if(sld.selectSingleNode("wmc:FeatureTypeStyle")){
_73.sld=(new XMLSerializer()).serializeToString(sld.selectSingleNode("wmc:FeatureTypeStyle"));
}else{
if(sld.selectSingleNode("wmc:StyledLayerDescriptor")){
_73.sld_body=(new XMLSerializer()).serializeToString(sld.selectSingleNode("wmc:StyledLayerDescriptor"));
}
}
}
}else{
if(_75){
_73.styles=(_75.firstChild)?_75.firstChild.nodeValue:"";
}
}
}
return _73;
}
function sld2OlStyle(_76){
var _77=new Object();
var _78;
var _79=false;
if(_76){
_78=_76.selectSingleNode(".//sld:ExternalGraphic/sld:OnlineResource/@xlink:href");
if(_78){
_77.externalGraphic=_78.firstChild.nodeValue;
_79=true;
}
_78=_76.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill']");
if(_78){
_77.fillColor=_78.firstChild.nodeValue;
_79=true;
}
_78=_76.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill-opacity']");
if(_78){
_77.fillOpacity=_78.firstChild.nodeValue;
_79=true;
}else{
_78=_76.selectSingleNode(".//sld:Opacity/sld:Literal");
if(_78){
_77.fillOpacity=_78.firstChild.nodeValue;
_79=true;
}
}
_78=_76.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke']");
if(_78){
_77.strokeColor=_78.firstChild.nodeValue;
_79=true;
}
_78=_76.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-opacity']");
if(_78){
_77.strokeOpacity=_78.firstChild.nodeValue;
_79=true;
}
_78=_76.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-width']");
if(_78){
_77.strokeWidth=_78.firstChild.nodeValue;
_79=true;
}
_78=_76.selectSingleNode(".//sld:Size");
if(_78){
_77.pointRadius=_78.firstChild.nodeValue;
_79=true;
}
}
if(!_79){
_77=null;
}
return _77;
}
function loadCss(_7a){
var id=_7a.match(/[^\/]*$/).toString().replace(/./,"_");
if(!document.getElementById(id)){
var _7c=document.createElement("link");
_7c.setAttribute("id",id);
_7c.setAttribute("rel","stylesheet");
_7c.setAttribute("type","text/css");
_7c.setAttribute("href",config.skinDir+"/"+_7a);
document.getElementsByTagName("head")[0].appendChild(_7c);
}
}
function getNodeValue(_7d){
if(_7d.nodeType==1){
return _7d.firstChild?_7d.firstChild.nodeValue:"";
}
if(_7d.nodeType>1||_7d.nodeType<5){
return _7d.nodeValue;
}
return _7d;
}

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

function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
function asinz(x){
x=(Math.abs(x)>1)?1:-1;
return (x);
}
orthoInit=function(_3){
_3.sin_p14=Math.sin(_3.lat0);
_3.cos_p14=Math.cos(_3.lat0);
};
orthoFwd=function(p){
var _5,cosphi;
var _6;
var _7;
var _8;
var g;
var _a=p.x;
var _b=p.y;
_6=adjust_lon(_a-this.long0);
_5=Math.sin(_b);
cosphi=Math.cos(_b);
_7=Math.cos(_6);
g=this.sin_p14*_5+this.cos_p14*cosphi*_7;
_8=1;
if((g>0)||(Math.abs(g)<=EPSLN)){
var x=this.a*_8*cosphi*Math.sin(_6);
var y=this.y0+this.a*_8*(this.cos_p14*_5-this.sin_p14*cosphi*_7);
}else{
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("orthoFwdPointError"));
}
}
p.x=x;
p.y=y;
};
orthoInv=function(p){
var rh;
var z;
var _11,cosz;
var _12;
var con;
var lon,lat;
p.x-=this.x0;
p.y-=this.y0;
rh=Math.sqrt(p.x*p.x+p.y*p.y);
if(rh>this.a+1e-7){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("orthoInvDataError"));
}
}
z=asinz(rh/this.a);
_11=Math.sin(z);
cosi=Math.cos(z);
lon=this.long0;
if(Math.abs(rh)<=EPSLN){
lat=this.lat0;
}
lat=asinz(cosz*this.sin_p14+(y*_11*this.cos_p14)/rh);
con=Math.abs(lat0)-HALF_PI;
if(Math.abs(con)<=EPSLN){
if(this.lat0>=0){
lon=adjust_lon(this.long0+Math.atan2(p.x,-p.y));
}else{
lon=adjust_lon(this.long0-Math.atan2(-p.x,p.y));
}
}
con=cosz-this.sin_p14*Math.sin(lat);
if((Math.abs(con)>=EPSLN)||(Math.abs(x)>=EPSLN)){
lon=adjust_lon(this.long0+Math.atan2((p.x*_11*this.cos_p14),(con*rh)));
}
p.x=lon;
p.y=lat;
};

function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
equiInit=function(_2){
if(!_2.x0){
_2.x0=0;
}
if(!_2.y0){
_2.y0=0;
}
if(!_2.lat0){
_2.lat0=0;
}
if(!_2.long0){
_2.long0=0;
}
};
equiFwd=function(p){
var _4=p.x;
var _5=p.y;
var _6=adjust_lon(_4-this.long0);
var x=this.x0+this.a*_6*Math.cos(this.lat0);
var y=this.y0+this.a*_5;
this.t1=x;
this.t2=Math.cos(this.lat0);
p.x=x;
p.y=y;
};
equiInv=function(p){
p.x-=this.x0;
p.y-=this.y0;
var _a=p.y/this.a;
if(Math.abs(_a)>HALF_PI){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("equiInvDataError"));
}
}
var _b=adjust_lon(this.long0+p.x/(this.a*Math.cos(this.lat0)));
p.x=_b;
p.y=_a;
};

function msfnz(_1,_2,_3){
var _4=_1*_2;
return _3/(Math.sqrt(1-_4*_4));
}
function tsfnz(_5,_6,_7){
var _8=_5*_7;
var _9=0.5*_5;
_8=Math.pow(((1-_8)/(1+_8)),_9);
return (Math.tan(0.5*(HALF_PI-_6))/_8);
}
function phi2z(_a,ts){
var _c=0.5*_a;
var _d,dphi;
var _e=HALF_PI-2*Math.atan(ts);
for(i=0;i<=15;i++){
_d=_a*Math.sin(_e);
dphi=HALF_PI-2*Math.atan(ts*(Math.pow(((1-_d)/(1+_d)),_c)))-_e;
_e+=dphi;
if(Math.abs(dphi)<=1e-10){
return _e;
}
}
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("phi2zNoConvergence"));
}
return (-9999);
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
lccInit=function(def){
if(!def.lat2){
def.lat2=def.lat0;
}
if(Math.abs(def.lat1+def.lat2)<EPSLN){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("lccInitEqualLatitudes"));
}
return;
}
var _12=def.b/def.a;
def.e=Math.sqrt(1-_12*_12);
var _13=Math.sin(def.lat1);
var _14=Math.cos(def.lat1);
var ms1=msfnz(def.e,_13,_14);
var ts1=tsfnz(def.e,def.lat1,_13);
var _17=Math.sin(def.lat2);
var _18=Math.cos(def.lat2);
var ms2=msfnz(def.e,_17,_18);
var ts2=tsfnz(def.e,def.lat2,_17);
var ts0=tsfnz(def.e,def.lat0,Math.sin(def.lat0));
if(Math.abs(def.lat1-def.lat2)>EPSLN){
def.ns=Math.log(ms1/ms2)/Math.log(ts1/ts2);
}else{
def.ns=_13;
}
def.f0=ms1/(def.ns*Math.pow(ts1,def.ns));
def.rh=def.a*def.f0*Math.pow(ts0,def.ns);
};
lccFwd=function(p){
var lon=p.x;
var lat=p.y;
if(lat<=90&&lat>=-90&&lon<=180&&lon>=-180){
}else{
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("llInputOutOfRange",lon,lat));
}
return null;
}
var con=Math.abs(Math.abs(lat)-HALF_PI);
var ts;
if(con>EPSLN){
ts=tsfnz(this.e,lat,Math.sin(lat));
rh1=this.a*this.f0*Math.pow(ts,this.ns);
}else{
con=lat*this.ns;
if(con<=0){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("ll2lccNoProjection"));
}
return null;
}
rh1=0;
}
var _21=this.ns*adjust_lon(lon-this.long0);
var x=rh1*Math.sin(_21)+this.x0;
var y=this.rh-rh1*Math.cos(_21)+this.y0;
p.x=x;
p.y=y;
};
lccInv=function(p){
var rh1,con,ts;
var lat,lon;
x=p.x-this.x0;
y=this.rh-p.y+this.y0;
if(this.ns>0){
rh1=Math.sqrt(x*x+y*y);
con=1;
}else{
rh1=-Math.sqrt(x*x+y*y);
con=-1;
}
var _27=0;
if(rh1!=0){
_27=Math.atan2((con*x),(con*y));
}
if((rh1!=0)||(this.ns>0)){
con=1/this.ns;
ts=Math.pow((rh1/(this.a*this.f0)),con);
lat=phi2z(this.e,ts);
if(lat==-9999){
return null;
}
}else{
lat=-HALF_PI;
}
lon=adjust_lon(_27/this.ns+this.long0);
p.x=lon;
p.y=lat;
};

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
function mlfn(e0,e1,e2,e3,_9){
return (e0*_9-e1*Math.sin(2*_9)+e2*Math.sin(4*_9)-e3*Math.sin(6*_9));
}
function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
function sign(x){
if(x<0){
return (-1);
}else{
return (1);
}
}
tmercInit=function(_c){
_c.e0=e0fn(_c.es);
_c.e1=e1fn(_c.es);
_c.e2=e2fn(_c.es);
_c.e3=e3fn(_c.es);
_c.ml0=_c.a*mlfn(_c.e0,_c.e1,_c.e2,_c.e3,_c.lat0);
_c.ind=(_c.es<0.00001)?1:0;
};
utmInit=function(_d){
_d.lat0=0;
_d.long0=((6*Math.abs(_d.zone))-183)*D2R;
_d.x0=500000;
_d.y0=(_d.zone<0)?10000000:0;
if(!_d.k0){
_d.k0=0.9996;
}
tmercInit(_d);
};
utmFwd=function(p){
var _f=adjust_lon(p.x-this.long0);
var con;
var x,y;
var _12=Math.sin(p.y);
var _13=Math.cos(p.y);
if(this.ind!=0){
var b=_13*Math.sin(_f);
if((Math.abs(Math.abs(b)-1))<1e-10){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("ll2tmInfiniteProjection"));
}
return (93);
}else{
x=0.5*this.a*this.k0*Math.log((1+b)/(1-b));
con=Math.acos(_13*Math.cos(_f)/Math.sqrt(1-b*b));
if(p.y<0){
con=-con;
}
y=this.a*this.k0*(con-this.lat0);
}
}else{
var al=_13*_f;
var als=Math.pow(al,2);
var c=this.ep2*Math.pow(_13,2);
var tq=Math.tan(p.y);
var t=Math.pow(tq,2);
con=1-this.es*Math.pow(_12,2);
var n=this.a/Math.sqrt(con);
var ml=this.a*mlfn(this.e0,this.e1,this.e2,this.e3,p.y);
x=this.k0*n*al*(1+als/6*(1-t+c+als/20*(5-18*t+Math.pow(t,2)+72*c-58*this.ep2)))+this.x0;
y=this.k0*(ml-this.ml0+n*tq*(als*(0.5+als/24*(5-t+9*c+4*Math.pow(c,2)+als/30*(61-58*t+Math.pow(t,2)+600*c-330*this.ep2)))))+this.y0;
}
p.x=x;
p.y=y;
};
utmInv=function(p){
var con,phi;
var _1e;
var i;
var _20=6;
var lat,lon;
if(this.ind!=0){
var f=exp(p.x/(this.a*this.k0));
var g=0.5*(f-1/f);
var _24=this.lat0+p.y/(this.a*this.k0);
var h=cos(_24);
con=sqrt((1-h*h)/(1+g*g));
lat=asinz(con);
if(_24<0){
lat=-lat;
}
if((g==0)&&(h==0)){
lon=this.long0;
}else{
lon=adjust_lon(atan2(g,h)+this.long0);
}
}else{
p.x-=this.x0;
p.y-=this.y0;
con=(this.ml0+p.y/this.k0)/this.a;
phi=con;
for(i=0;;i++){
_1e=((con+this.e1*Math.sin(2*phi)-this.e2*Math.sin(4*phi)+this.e3*Math.sin(6*phi))/this.e0)-phi;
phi+=_1e;
if(Math.abs(_1e)<=EPSLN){
break;
}
if(i>=_20){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("tm2llNoConvergence"));
}
return (95);
}
}
if(Math.abs(phi)<HALF_PI){
var _26=Math.sin(phi);
var _27=Math.cos(phi);
var _28=Math.tan(phi);
var c=this.ep2*Math.pow(_27,2);
var cs=Math.pow(c,2);
var t=Math.pow(_28,2);
var ts=Math.pow(t,2);
con=1-this.es*Math.pow(_26,2);
var n=this.a/Math.sqrt(con);
var r=n*(1-this.es)/con;
var d=p.x/(n*this.k0);
var ds=Math.pow(d,2);
lat=phi-(n*_28*ds/r)*(0.5-ds/24*(5+3*t+10*c-4*cs-9*this.ep2-ds/30*(61+90*t+298*c+45*ts-252*this.ep2-3*cs)));
lon=adjust_lon(this.long0+(d*(1-ds/6*(1+2*t+c-ds/20*(5-2*c+28*t-3*cs+8*this.ep2+24*ts)))/_27));
}else{
lat=HALF_PI*sign(p.y);
lon=this.long0;
}
}
p.x=lon;
p.y=lat;
};

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

function msfnz(_1,_2,_3){
var _4=_1*_2;
return _3/(Math.sqrt(1-_4*_4));
}
function phi3z(ml,e0,e1,e2,e3){
var _a,dphi,i;
_a=ml;
for(i=0;i<15;i++){
dphi=(ml+e1*Math.sin(2*_a)-e2*Math.sin(4*_a)+e3*Math.sin(6*_a))/e0-_a;
_a+=dphi;
if(Math.abs(dphi)<=1e-10){
return _a;
}
}
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("phi3zNoConvergence"));
}
return (-9999);
}
function tsfnz(_b,_c,_d){
var _e=_b*_d;
var _f=0.5*_b;
_e=Math.pow(((1-_e)/(1+_e)),_f);
return (Math.tan(0.5*(HALF_PI-_c))/_e);
}
function phi2z(_10,ts){
var _12=0.5*_10;
var con,dphi;
var phi=HALF_PI-2*Math.atan(ts);
for(i=0;i<=15;i++){
con=_10*Math.sin(phi);
dphi=HALF_PI-2*Math.atan(ts*(Math.pow(((1-con)/(1+con)),_12)))-phi;
phi+=dphi;
if(Math.abs(dphi)<=1e-10){
return phi;
}
}
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("phi2zNoConvergence"));
}
return (-9999);
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
function eqdcInit(def){
if(!def.mode){
def.mode=0;
}
def.temp=def.b/def.a;
def.es=1-Math.pow(def.temp,2);
def.e=Math.sqrt(def.es);
def.e0=e0fn(def.es);
def.e1=e1fn(def.es);
def.e2=e2fn(def.es);
def.e3=e3fn(def.es);
def.sinphi=Math.sin(def.lat1);
def.cosphi=Math.cos(def.lat1);
def.ms1=msfnz(def.e,def.sinphi,def.cosphi);
def.ml1=mlfn(def.e0,def.e1,def.e2,def.e3,def.lat1);
if(def.mode!=0){
if(Math.abs(def.lat1+def.lat2)<EPSLN){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("eqdcInitEqualLatitudes"));
}
}
def.sinphi=Math.sin(def.lat2);
def.cosphi=Math.cos(def.lat2);
def.ms2=msfnz(def.e,def.sinphi,def.cosphi);
def.ml2=mlfn(def.e0,def.e1,def.e2,def.e3,def.lat2);
if(Math.abs(def.lat1-def.lat2)>=EPSLN){
def.ns=(def.ms1-def.ms2)/(def.ml2-def.ml1);
}else{
def.ns=def.sinphi;
}
}else{
def.ns=def.sinphi;
}
def.g=def.ml1+def.ms1/def.ns;
def.ml0=mlfn(def.e0,def.e1,def.e2,def.e3,def.lat0);
def.rh=def.a*(def.g-def.ml0);
}
function eqdcFwd(p){
var lon=p.x;
var lat=p.y;
var ml=mlfn(this.e0,this.e1,this.e2,this.e3,lat);
var rh1=this.a*(this.g-ml);
var _1d=this.ns*adjust_lon(lon-this.long0);
this.t1=adjust_lon(lon-this.long0);
this.t2=_1d;
var x=this.x0+rh1*Math.sin(_1d);
var y=this.y0+this.rh-rh1*Math.cos(_1d);
p.x=x;
p.y=y;
}
function eqdcInv(p){
p.x-=this.x0;
p.y=this.rh-p.y+this.y0;
if(this.ns>=0){
var rh1=Math.sqrt(p.x*p.x+p.y*p.y);
var con=1;
}else{
rh1=-Math.sqrt(p.x*p.x+p.y*p.y);
con=-1;
}
var _23=0;
if(rh1!=0){
_23=Math.atan2(con*p.x,con*p.y);
}
var ml=this.g-rh1/this.a;
var lat=phi3z(this.ml,this.e0,this.e1,this.e2,this.e3);
var lon=adjust_lon(this.long0+_23/this.ns);
p.x=lon;
p.y=lat;
}

csList.EPSG102757="  +title=NAD 1983 StatePlane Wyoming West Central FIPS 4903 Feet  +proj=tmerc   +lat_0=40.5 +lon_0=-108.75   +x_0=600000.0 +y_0=0 +k=0.999938   +a=6378137.0  +b=6356752.3141403  +to_meter=0.3048006096012192 ";

csList.EPSG41001="+title=simple mercator EPSG:41001  +proj=merc +lat_ts=0 +lon_0=0 +k=1.000000 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m";

csList.EPSG4302="+title=Trinidad 1903 EPSG:4302 (7 param datum shift)  +proj=longlat +a=6378293.63683822 +b=6356617.979337744 +towgs84=-61.702,284.488,472.052,0,0,0,0";

csList.EPSG32612="+title=WGS 84 / UTM zone 12N epsg:32612 +proj=utm +zone=12 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

csList.EPSG32614="+title=WGS 84 / UTM zone 14N epsg:32614 +proj=utm +zone=14 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

csList.EPSG27700="+title=OSGB 1936 / British National Grid / EPSG:27700+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +units=m ";

csList.EPSG54029="  +title= World  Van der Grinten I EPSG:54029  +proj=vandg   +lon_0=0 +x_0=0 +y_0=0 +R_A    +ellps=WGS84 +datum=WGS84 +units=m ";

csList.EPSG31296="+title=MGI / M34 EPSG:31296 +proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1.000000 +x_0=750000 +y_0=0 +ellps=bessel +units=m";

csList.EPSG4181="+title=Luxembourg 1930 EPSG:4181 (7 param datum shift)  +proj=longlat   +towgs84=-193,13.7,-39.3,-0.41,-2.933,2.688,0.43   +a=6378388.0, +b=6356911.94612795";

csList.EPSG102582="+title=NTF France II degrees EPSG:102582\t +proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=2.337229166666667 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356514.999904194 +units=m";

csList.EPSG31294="+title=MGI / M31 EPSG:31294 +proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1.000000 +x_0=150000 +y_0=0 +ellps=bessel +units=m";

csList.EPSG102028="  +title=Asia South Albers Equal Area Conic EPSG:102028  +proj=aea  +lat_1=7 +lat_2=-32 +lat_0=-15 +lon_0=125   +x_0=0 +y_0=0   +ellps=WGS84 +datum=WGS84  +units=m";

csList.EPSG54008="  +title= World Sinuso\ufffddal EPSG:54008  +proj=sinu   +lon_0=0 +x_0=0 +y_0=0   +ellps=WGS84 +datum=WGS84 +units=m ";

csList.EPSG28992="+title=Amersfoort / RD New EPSG:28992 +proj=stere +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m";

csList.EPSG32613="+title=WGS 84 / UTM zone 13N epsg:32613 +proj=utm +zone=13 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

csList.EPSG53021="  +title= World polyconic EPSG:54021  +proj=poly   +lon_0=0 +x_0=0 +y_0=0   +ellps=WGS84 +datum=WGS84 +units=m ";

csList.EPSG32616="+title=WGS 84 / UTM zone 16N epsg:32616 +proj=utm +zone=16 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

csList.EPSG32611="+title=WGS 84 / UTM zone 11N epsg:32611 +proj=utm +zone=11 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

csList.EPSG102005="  +title=USA Contiguous Equidistant Conic  +proj=eqdc  +lat_0=0 +lon_0=0 +lat_1=33 +lat_2=45 +x_0=0 +y_0=0     +lon_0=-90 +x_0=600000.0000000001 +y_0=0   +ellps=GRS80 +datum=NAD83 +units=m   ";

csList.EPSG26591="+title= Monte Mario (Rome) / Italy zone 1 EPSG:26591 +proj=tmerc +lat_0=0 +lon_0=12.452333333333332 +k=0.999600 +x_0=1500000 +y_0=0 +ellps=intl +pm=rome +units=m";

csList.EPSG4139="  +title=Puerto Rico EPSG:4139 (3 param datum shift)  +proj=longlat   +towgs84 = 11,72,-101,0,0,0,0   +a=6378206.4 +b=6356583.8 ";

csList.EPSG102758="  +title=NAD 1983 StatePlane Wyoming West FIPS 4904 Feet  +proj=tmerc   +lat_0=40.5  +lon_0=-110.0833333333333   +x_0=800000  +y_0=100000  +k=0.999938   +a=6378137.0 +b=6356752.3141403  +to_meter=0.3048006096012192 ";

csList.EPSG42304="+title=NAD83 LCC for Canada EPSG:42304 +proj=lcc +ellps=GRS80 +lat_0=49 +lon_0=-95 +lat_1=49 +lat_2=77 +x_0=0 +y_0=0.0 +datum=NAD83 +units=m ";

csList.EPSG42101="+title=WGS84 / LCC Canada EPSG:42101  +proj=lcc +ellps=WGS84 +lat_0=0 +lon_0=-95 +lat_1=49 +lat_2=77 +x_0=0 +y_0=-8000000.0 +datum=WGS84 +units=m ";

csList.EPSG31297="+title=MGI / Austria Lambert EPSG:31297 +proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +ellps=bessel +units=m";

csList.EPSG31295="+title=MGI / M31 EPSG:31295 +proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1.000000 +x_0=450000 +y_0=0 +ellps=bessel +units=m";

csList.EPSG32615="+title=WGS 84 / UTM zone 15N epsg:32615 +proj=utm +zone=15 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

csList.EPSG27563="+title=LAMB sud france EPSG:27563 +proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=2.33722917 +k_0=0.999877499 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m";

csList.EPSG26912="+title=NAD83 / UTM zone 12N +proj=utm +zone=12 +ellps=GRS80 +datum=NAD83 +units=m";

csList.EPSG22195="+title=Campo Inchauspe / Argentina 5 epsg:22195 +proj=tmerc +lat_0=-90 +lon_0=-60 +k=1.000000 +x_0=5500000 +y_0=0 +ellps=intl +units=m +no_defs";

function asinz(x){
x=(Math.abs(x)>1)?1:-1;
return (x);
}
function qsfnz(_2,_3,_4){
var _5;
if(_2>1e-7){
_5=_2*_3;
return ((1-_2*_2)*(_3/(1-_5*_5)-(0.5/_2)*Math.log((1-_5)/(1+_5))));
}else{
return (2*_3);
}
}
function phi1z(_6,qs){
var _8;
var _9;
var _a;
var _b;
var _c;
var _d;
var _e;
var i;
_e=asinz(0.5*qs);
if(_6<EPSLN){
return (_e);
}
_8=_6*_6;
for(i=1;i<=25;i++){
_c=Math.sin(_e);
_d=Math.cos(_e);
_a=_6*_c;
_b=1-_a*_a;
_9=0.5*_b*_b/_d*(qs/(1-_8)-_c/_b+0.5/_6*Math.log((1-_a)/(1+_a)));
_e=_e+_9;
if(Math.abs(_9)<=1e-7){
return (_e);
}
}
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("phi1zNoConvergence"));
}
return (-9999);
}
function msfnz(_10,_11,_12){
var con=_10*_11;
return _12/(Math.sqrt(1-con*con));
}
function tsfnz(_14,phi,_16){
var con=_14*_16;
var com=0.5*_14;
con=Math.pow(((1-con)/(1+con)),com);
return (Math.tan(0.5*(HALF_PI-phi))/con);
}
function phi2z(_19,ts){
var _1b=0.5*_19;
var con,dphi;
var phi=HALF_PI-2*Math.atan(ts);
for(i=0;i<=15;i++){
con=_19*Math.sin(phi);
dphi=HALF_PI-2*Math.atan(ts*(Math.pow(((1-con)/(1+con)),_1b)))-phi;
phi+=dphi;
if(Math.abs(dphi)<=1e-10){
return phi;
}
}
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("phi2zNoConvergence"));
}
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
aeaInit=function(def){
if(Math.abs(def.lat1+def.lat2)<EPSLN){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("aeaInitEqualLatitudes"));
}
return (31);
}
def.temp=def.b/def.a;
def.es=1-Math.pow(def.temp,2);
def.e3=Math.sqrt(def.es);
def.sin_po=Math.sin(def.lat1);
def.cos_po=Math.cos(def.lat1);
def.t1=def.sin_po;
def.con=def.sin_po;
def.ms1=msfnz(def.e3,def.sin_po,def.cos_po);
def.qs1=qsfnz(def.e3,def.sin_po,def.cos_po);
def.sin_po=Math.sin(def.lat2);
def.cos_po=Math.cos(def.lat2);
def.t2=def.sin_po;
def.ms2=msfnz(def.e3,def.sin_po,def.cos_po);
def.qs2=qsfnz(def.e3,def.sin_po,def.cos_po);
def.sin_po=Math.sin(def.lat0);
def.cos_po=Math.cos(def.lat0);
def.t3=def.sin_po;
def.qs0=qsfnz(def.e3,def.sin_po,def.cos_po);
if(Math.abs(def.lat1-def.lat2)>EPSLN){
def.ns0=(def.ms1*def.ms1-def.ms2*def.ms2)/(def.qs2-def.qs1);
}else{
def.ns0=def.con;
}
def.c=def.ms1*def.ms1+def.ns0*def.qs1;
def.rh=def.a*Math.sqrt(def.c-def.ns0*def.qs0)/def.ns0;
};
aeaFwd=function(p){
var lon=p.x;
var lat=p.y;
this.sin_phi=Math.sin(lat);
this.cos_phi=Math.cos(lat);
var qs=qsfnz(this.e3,this.sin_phi,this.cos_phi);
var rh1=this.a*Math.sqrt(this.c-this.ns0*qs)/this.ns0;
var _26=this.ns0*adjust_lon(lon-this.long0);
var x=rh1*Math.sin(_26)+this.y0;
var y=this.rh-rh1*Math.cos(_26)+this.x0;
p.x=x;
p.y=y;
};
aeaInv=function(p){
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
lat=phi1z(this.e3,qs);
}else{
if(qs>=0){
lat=0.5*PI;
}else{
lat=-0.5*PI;
}
}
}else{
lat=phi1z(e3,qs);
}
lon=adjust_lon(theta/this.ns0+this.long0);
p.x=lon;
p.y=lat;
};

function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
sinuInit=function(_2){
_2.R=6370997;
};
sinuFwd=function(p){
var x,y,delta_lon;
var _5=p.x;
var _6=p.y;
delta_lon=adjust_lon(_5-this.long0);
x=this.R*delta_lon*Math.cos(_6)+this.x0;
y=this.R*_6+this.y0;
p.x=x;
p.y=y;
};
sinuInv=function(p){
var _8,temp,lon;
p.x-=this.x0;
p.y-=this.y0;
_8=p.y/this.R;
if(Math.abs(_8)>HALF_PI){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("sinuInvDataError"));
}
}
temp=Math.abs(_8)-HALF_PI;
if(Math.abs(temp)>EPSLN){
temp=this.long0+p.x/(this.R*Math.cos(_8));
var _9=adjust_lon(temp);
}else{
_9=this.long0;
}
p.x=_9;
p.y=_8;
};

function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
function asinz(x){
x=(Math.abs(x)>1)?1:-1;
return (x);
}
aeqdInit=function(_3){
_3.sin_p12=Math.sin(_3.lat0);
_3.cos_p12=Math.cos(_3.lat0);
var _4;
};
aeqdFwd=function(p){
var _6=p.x;
var _7=p.y;
var _8=Math.sin(p.y);
var _9=Math.cos(p.y);
var _a=adjust_lon(_6-this.long0);
var _b=Math.cos(_a);
var g=this.sin_p12*_8+this.cos_p12*_9*_b;
if(Math.abs(Math.abs(g)-1)<EPSLN){
var _d=1;
if(g<0){
var _e=2*HALF_PI*this.a;
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("aeqdFwdPointError"));
}
}
}else{
var z=Math.acos(g);
_d=z/Math.sin(z);
}
var x=this.x0+this.a*_d*_9*Math.sin(_a);
var y=this.y0+this.a*_d*(this.cos_p12*_8-this.sin_p12*_9*_b);
p.x=x;
p.y=y;
};
aeqdInv=function(p){
p.x-=this.x0;
p.y-=this.y0;
var rh=Math.sqrt(p.x*p.x+p.y*p.y);
if(rh>(2*HALF_PI*this.a)){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("aeqdInvDataError"));
}
}
var z=rh/this.a;
var _15=Math.sin(z);
var _16=Math.cos(z);
var lon=this.long0;
if(Math.abs(rh)<=EPSLN){
var lat=this.lat0;
}
lat=asinz(_16*this.sin_p12+(p.y*_15*this.cos_p12)/rh);
this.t3=lat;
var con=Math.abs(this.lat0)-HALF_PI;
if(Math.abs(con)<=EPSLN){
if(lat0>=0){
lon=adjust_lon(this.long0+Math.atan2(p.x,-p.y));
}else{
lon=adjust_lon(this.long0-Math.atan2(-p.x,p.y));
}
}
con=_16-this.sin_p12*Math.sin(lat);
if((Math.abs(con)<EPSLN)&&(Math.abs(x)<EPSLN)){
return (19);
}
this.t1=this.cos_p12;
this.t2=con*rh;
this.temp=Math.atan2((p.x*_15*this.cos_p12),(con*rh));
lon=adjust_lon(this.long0+Math.atan2((p.x*_15*this.cos_p12),(con*rh)));
p.x=lon;
p.y=lat;
};

function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
mollInit=function(_2){
_2.R=6370997;
};
mollFwd=function(p){
var _4=p.x;
var _5=p.y;
var _6=adjust_lon(_4-this.long0);
var _7=_5;
var _8=PI*Math.sin(_5);
for(i=0;;i++){
var _9=-(_7+Math.sin(_7)-_8)/(1+Math.cos(_7));
_7+=_9;
if(Math.abs(_9)<EPSLN){
break;
}
if(i>=50){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("mollFwdIterationError"));
}
}
}
_7/=2;
if(PI/2-Math.abs(_5)<EPSLN){
_6=0;
}
var x=0.900316316158*this.R*_6*Math.cos(_7)+this.x0;
var y=1.4142135623731*this.R*Math.sin(_7)+this.y0;
p.x=x;
p.y=y;
};
mollInv=function(p){
var _d;
var _e;
p.x-=this.x0;
var _e=p.y/(1.4142135623731*this.R);
if(Math.abs(_e)>0.999999999999){
_e=0.999999999999;
}
var _d=Math.asin(_e);
var _f=adjust_lon(this.long0+(p.x/(0.900316316158*this.R*Math.cos(_d))));
if(_f<(-PI)){
_f=-PI;
}
if(_f>PI){
_f=PI;
}
_e=(2*_d+Math.sin(2*_d))/PI;
if(Math.abs(_e)>1){
_e=1;
}
var lat=Math.asin(_e);
p.x=_f;
p.y=lat;
};

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
stereInit=function(_3){
_3.sin_p10=Math.sin(_3.lat0);
_3.cos_p10=Math.cos(_3.lat0);
};
stereFwd=function(p){
var _5=p.x;
var _6=p.y;
var _7;
if(_6<=90&&_6>=-90&&_5<=180&&_5>=-180){
}else{
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("llInputOutOfRange",_5,_6));
}
return null;
}
var _8=adjust_lon(_5-this.long0);
var _9=Math.sin(_6);
var _a=Math.cos(_6);
var _b=Math.cos(_8);
var g=this.sin_p10*_9+this.cos_p10*_a*_b;
if(Math.abs(g+1)<=EPSLN){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("ll2stInfiniteProjection"));
}
return null;
}else{
_7=2/(1+g);
var x=this.x0+this.a*_7*_a*Math.sin(_8);
var y=this.y0+this.a*_7*(this.cos_p10*_9-this.sin_p10*_a*_b);
}
p.x=x;
p.y=y;
};
stereInv=function(p){
var x=(p.x-this.x0);
var y=(p.y-this.y0);
var rh=Math.sqrt(x*x+y*y);
var z=2*Math.atan(rh/(2*this.a));
var _14=Math.sin(z);
var _15=Math.cos(z);
var lat;
var lon=this.long0;
if(Math.abs(rh)<=EPSLN){
lat=this.lat0;
}else{
lat=Math.asin(_15*this.sin_p10+(y*_14*this.cos_p10)/rh);
var con=Math.abs(this.lat0)-HALF_PI;
if(Math.abs(con)<=EPSLN){
if(this.lat0>=0){
lon=adjust_lon(this.long0+Math.atan2(x,-y));
}else{
lon=adjust_lon(this.long0-Math.atan2(-x,y));
}
}else{
con=_15-this.sin_p10*Math.sin(lat);
if((Math.abs(con)<EPSLN)&&(Math.abs(x)<EPSLN)){
}else{
lon=adjust_lon(this.long0+Math.atan2((x*_14*this.cos_p10),(con*rh)));
}
}
}
p.x=lon;
p.y=lat;
};

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
function mlfn(e0,e1,e2,e3,_9){
return (e0*_9-e1*Math.sin(2*_9)+e2*Math.sin(4*_9)-e3*Math.sin(6*_9));
}
function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
function sign(x){
if(x<0){
return (-1);
}else{
return (1);
}
}
tmercInit=function(_c){
_c.e0=e0fn(_c.es);
_c.e1=e1fn(_c.es);
_c.e2=e2fn(_c.es);
_c.e3=e3fn(_c.es);
_c.ml0=_c.a*mlfn(_c.e0,_c.e1,_c.e2,_c.e3,_c.lat0);
_c.ind=(_c.es<0.00001)?1:0;
};
utmInit=function(_d){
_d.lat0=0;
_d.long0=((6*Math.abs(_d.zone))-183)*D2R;
_d.x0=500000;
_d.y0=(_d.zone<0)?10000000:0;
if(!_d.k0){
_d.k0=0.9996;
}
tmercInit(_d);
};
tmercFwd=function(p){
var _f=adjust_lon(p.x-this.long0);
var con;
var x,y;
var _12=Math.sin(p.y);
var _13=Math.cos(p.y);
if(this.ind!=0){
var b=_13*Math.sin(_f);
if((Math.abs(Math.abs(b)-1))<1e-10){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("ll2tmInfiniteProjection"));
}
return (93);
}else{
x=0.5*this.a*this.k0*Math.log((1+b)/(1-b));
con=Math.acos(_13*Math.cos(_f)/Math.sqrt(1-b*b));
if(p.y<0){
con=-con;
}
y=this.a*this.k0*(con-this.lat0);
}
}else{
var al=_13*_f;
var als=Math.pow(al,2);
var c=this.ep2*Math.pow(_13,2);
var tq=Math.tan(p.y);
var t=Math.pow(tq,2);
con=1-this.es*Math.pow(_12,2);
var n=this.a/Math.sqrt(con);
var ml=this.a*mlfn(this.e0,this.e1,this.e2,this.e3,p.y);
x=this.k0*n*al*(1+als/6*(1-t+c+als/20*(5-18*t+Math.pow(t,2)+72*c-58*this.ep2)))+this.x0;
y=this.k0*(ml-this.ml0+n*tq*(als*(0.5+als/24*(5-t+9*c+4*Math.pow(c,2)+als/30*(61-58*t+Math.pow(t,2)+600*c-330*this.ep2)))))+this.y0;
}
p.x=x;
p.y=y;
};
var utmFwd=tmercFwd;
tmercInv=function(p){
var con,phi;
var _1e;
var i;
var _20=6;
var lat,lon;
if(this.ind!=0){
var f=exp(p.x/(this.a*this.k0));
var g=0.5*(f-1/f);
var _24=this.lat0+p.y/(this.a*this.k0);
var h=cos(_24);
con=sqrt((1-h*h)/(1+g*g));
lat=asinz(con);
if(_24<0){
lat=-lat;
}
if((g==0)&&(h==0)){
lon=this.long0;
}else{
lon=adjust_lon(atan2(g,h)+this.long0);
}
}else{
p.x-=this.x0;
p.y-=this.y0;
con=(this.ml0+p.y/this.k0)/this.a;
phi=con;
for(i=0;;i++){
_1e=((con+this.e1*Math.sin(2*phi)-this.e2*Math.sin(4*phi)+this.e3*Math.sin(6*phi))/this.e0)-phi;
phi+=_1e;
if(Math.abs(_1e)<=EPSLN){
break;
}
if(i>=_20){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("tm2llNoConvergence"));
}
return (95);
}
}
if(Math.abs(phi)<HALF_PI){
var _26=Math.sin(phi);
var _27=Math.cos(phi);
var _28=Math.tan(phi);
var c=this.ep2*Math.pow(_27,2);
var cs=Math.pow(c,2);
var t=Math.pow(_28,2);
var ts=Math.pow(t,2);
con=1-this.es*Math.pow(_26,2);
var n=this.a/Math.sqrt(con);
var r=n*(1-this.es)/con;
var d=p.x/(n*this.k0);
var ds=Math.pow(d,2);
lat=phi-(n*_28*ds/r)*(0.5-ds/24*(5+3*t+10*c-4*cs-9*this.ep2-ds/30*(61+90*t+298*c+45*ts-252*this.ep2-3*cs)));
lon=adjust_lon(this.long0+(d*(1-ds/6*(1+2*t+c-ds/20*(5-2*c+28*t-3*cs+8*this.ep2+24*ts)))/_27));
}else{
lat=HALF_PI*sign(p.y);
lon=this.long0;
}
}
p.x=lon;
p.y=lat;
};
var utmInv=tmercInv;

laeaInit=function(_1){
_1.R=6370997;
_1.sin_lat_o=Math.sin(_1.lat0);
_1.cos_lat_o=Math.cos(_1.lat0);
};
laeaFwd=function(p){
var _3=p.x;
var _4=p.y;
var _5=adjust_lon(_3-this.long0);
var _6=Math.sin(_4);
var _7=Math.cos(_4);
var _8=Math.sin(_5);
var _9=Math.cos(_5);
var g=this.sin_lat_o*_6+this.cos_lat_o*_7*_9;
if(g==-1){
}
var _b=this.R*Math.sqrt(2/(1+g));
var x=_b*_7*_8+this.x0;
var y=_b*(this.cos_lat_o*_6-this.sin_lat_o*_7*_9)+this.x0;
};
laeaInv=function(p){
p.x-=this.x0;
p.y-=this.y0;
var Rh=Math.sqrt(p.x*p.x+p.y*p.y);
var _10=Rh/(2*this.R);
if(_10>1){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("laeaInvDataError"));
}
}
var z=2*asinz(_10);
var _12=Math.sin(z);
var _13=Math.cos(z);
var lon=this.long0;
if(Math.abs(Rh)>EPSLN){
var lat=asinz(this.sin_lat_o*_13+this.cos_lat_o*_12*p.y/Rh);
var _10=Math.abs(this.lat0)-HALF_PI;
if(Math.abs(_10)>EPSLN){
_10=_13-this.sin_lat_o*Math.sin(lat);
if(_10!=0){
lon=adjust_lon(this.long0+Math.atan2(p.x*_12*this.cos_lat_o,_10*Rh));
}
}else{
if(this.lat0<0){
lon=adjust_lon(this.long0-Math.atan2(-p.x,p.y));
}else{
lon=adjust_lon(this.long0+Math.atan2(p.x,-p.y));
}
}
}else{
lat=this.lat0;
}
};

function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
vandgInit=function(_2){
_2.R=6370997;
};
vandgFwd=function(p){
var _4=p.x;
var _5=p.y;
var _6=adjust_lon(_4-this.long0);
if(Math.abs(_5)<=EPSLN){
var x=this.x0+this.R*_6;
var y=this.y0;
}
var _9=asinz(2*Math.abs(_5/PI));
if((Math.abs(_6)<=EPSLN)||(Math.abs(Math.abs(_5)-HALF_PI)<=EPSLN)){
var x=this.x0;
if(_5>=0){
var y=this.y0+PI*this.R*Math.tan(0.5*_9);
}else{
y=this.y0+PI*this.R*-Math.tan(0.5*_9);
}
}
var al=0.5*Math.abs((PI/_6)-(_6/PI));
var _b=al*al;
var _c=Math.sin(_9);
var _d=Math.cos(_9);
var g=_d/(_c+_d-1);
var _f=g*g;
var m=g*(2/_c-1);
var msq=m*m;
var con=PI*this.R*(al*(g-msq)+Math.sqrt(_b*(g-msq)*(g-msq)-(msq+_b)*(_f-msq)))/(msq+_b);
if(_6<0){
con=-con;
}
x=this.x0+con;
con=Math.abs(con/(PI*this.R));
if(_5>=0){
y=this.y0+PI*this.R*Math.sqrt(1-con*con-2*al*con);
}else{
y=this.y0-PI*this.R*Math.sqrt(1-con*con-2*al*con);
}
p.x=x;
p.y=y;
};
vandgInv=function(p){
var _14;
var xx,yy,xys,c1,c2,c3;
var al,asq;
var a1;
var m1;
var con;
var th1;
var d;
p.x-=this.x0;
p.y-=this.y0;
con=PI*this.R;
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
var lat=(-m1*Math.cos(th1+PI/3)-c2/3/c3)*PI;
}else{
lat=-(-m1*Math.cos(th1+PI/3)-c2/3/c3)*PI;
}
if(Math.abs(xx)<EPSLN){
var lon=this.long0;
}
lon=adjust_lon(this.long0+PI*(xys-1+Math.sqrt(1+2*(xx*xx-yy*yy)+xys*xys))/2/xx);
p.x=lon;
p.y=lat;
};

function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
millInit=function(_2){
_2.R=6370997;
};
millFwd=function(p){
var _4=p.x;
var _5=p.y;
dlon=adjust_lon(_4-this.long0);
var x=this.x0+this.R*dlon;
var y=this.y0+this.R*Math.log(Math.tan((PI/4)+(_5/2.5)))*1.25;
p.x=x;
p.y=y;
};
millInv=function(p){
p.x-=this.x0;
p.y-=this.y0;
var _9=adjust_lon(this.long0+p.x/this.R);
var _a=2.5*(Math.atan(Math.exp(p.y/this.R/1.25))-PI/4);
p.x=_9;
p.y=_a;
};

function asinz(x){
x=(Math.abs(x)>1)?1:-1;
return (x);
}
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
function mlfn(e0,e1,e2,e3,_a){
return (e0*_a-e1*Math.sin(2*_a)+e2*Math.sin(4*_a)-e3*Math.sin(6*_a));
}
function phi2z(_b,ts){
var _d=0.5*_b;
var _e,dphi;
var _f=HALF_PI-2*Math.atan(ts);
for(i=0;i<=15;i++){
_e=_b*Math.sin(_f);
dphi=HALF_PI-2*Math.atan(ts*(Math.pow(((1-_e)/(1+_e)),_d)))-_f;
_f+=dphi;
if(Math.abs(dphi)<=1e-10){
return _f;
}
}
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("phi2zNoConvergence"));
}
return -9999;
}
omercInit=function(def){
if(!def.mode){
def.mode=0;
}
if(!def.lon1){
def.lon1=0;
def.mode=1;
}
if(!def.lon2){
def.lon2=0;
}
if(!def.lat2){
def.lat2=0;
}
var _11=def.b/def.a;
var es=1-Math.pow(_11,2);
var e=Math.sqrt(es);
def.sin_p20=Math.sin(def.lat0);
def.cos_p20=Math.cos(def.lat0);
def.con=1-def.es*def.sin_p20*def.sin_p20;
def.com=Math.sqrt(1-es);
def.bl=Math.sqrt(1+def.es*Math.pow(def.cos_p20,4)/(1-es));
def.al=def.a*def.bl*def.k0*def.com/def.con;
if(Math.abs(def.lat0)<EPSLN){
def.ts=1;
def.d=1;
def.el=1;
}else{
def.ts=tsfnz(def.e,def.lat0,def.sin_p20);
def.con=Math.sqrt(def.con);
def.d=def.bl*def.com/(def.cos_p20*def.con);
if((def.d*def.d-1)>0){
if(def.lat0>=0){
def.f=def.d+Math.sqrt(def.d*def.d-1);
}else{
def.f=def.d-Math.sqrt(def.d*def.d-1);
}
}else{
def.f=def.d;
}
def.el=def.f*Math.pow(def.ts,def.bl);
}
if(def.mode!=0){
def.g=0.5*(def.f-1/def.f);
def.gama=asinz(Math.sin(def.alpha)/def.d);
def.longc=def.longc-asinz(def.g*Math.tan(def.gama))/def.bl;
def.con=Math.abs(def.lat0);
if((def.con>EPSLN)&&(Math.abs(def.con-HALF_PI)>EPSLN)){
def.singam=Math.sin(def.gama);
def.cosgam=Math.cos(def.gama);
def.sinaz=Math.sin(def.alpha);
def.cosaz=Math.cos(def.alpha);
if(def.lat0>=0){
def.u=(def.al/def.bl)*Math.atan(Math.sqrt(def.d*def.d-1)/def.cosaz);
}else{
def.u=-(def.al/def.bl)*Math.atan(Math.sqrt(def.d*def.d-1)/def.cosaz);
}
}else{
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("omercInitDataError"));
}
}
}else{
def.sinphi=Math.sin(def.at1);
def.ts1=tsfnz(def.e,def.lat1,def.sinphi);
def.sinphi=Math.sin(def.lat2);
def.ts2=tsfnz(def.e,def.lat2,def.sinphi);
def.h=Math.pow(def.ts1,def.bl);
def.l=Math.pow(def.ts2,def.bl);
def.f=def.el/def.h;
def.g=0.5*(def.f-1/def.f);
def.j=(def.el*def.el-def.l*def.h)/(def.el*def.el+def.l*def.h);
def.p=(def.l-def.h)/(def.l+def.h);
def.dlon=def.lon1-def.lon2;
if(def.dlon<-PI){
def.lon2=def.lon2-2*PI;
}
if(def.dlon>PI){
def.lon2=def.lon2+2*PI;
}
def.dlon=def.lon1-def.lon2;
def.longc=0.5*(def.lon1+def.lon2)-Math.atan(def.j*Math.tan(0.5*def.bl*def.dlon)/def.p)/def.bl;
def.dlon=adjust_lon(def.lon1-def.longc);
def.gama=Math.atan(Math.sin(def.bl*def.dlon)/def.g);
def.alpha=asinz(def.d*Math.sin(def.gama));
if(Math.abs(def.lat1-def.lat2)<=EPSLN){
alert("omercInitDataError");
}else{
def.con=Math.abs(def.lat1);
}
if((def.con<=EPSLN)||(Math.abs(def.con-HALF_PI)<=EPSLN)){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("omercInitDataError"));
}
}else{
if(Math.abs(Math.abs(def.lat0)-HALF_PI)<=EPSLN){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("omercInitDataError"));
}
}
}
def.singam=Math.sin(def.gam);
def.cosgam=Math.cos(def.gam);
def.sinaz=Math.sin(def.alpha);
def.cosaz=Math.cos(def.alpha);
if(def.lat0>=0){
def.u=(def.al/def.bl)*Math.atan(Math.sqrt(def.d*def.d-1)/def.cosaz);
}else{
def.u=-(def.al/def.bl)*Math.atan(Math.sqrt(def.d*def.d-1)/def.cosaz);
}
}
};
omercFwd=function(p){
var _15;
var _16,cos_phi;
var b;
var c,t,tq;
var con,n,ml;
var q,us,vl;
var ul,vs;
var s;
var _1d;
var ts1;
var lon=p.x;
var lat=p.y;
_16=Math.sin(lat);
_1d=adjust_lon(lon-this.longc);
vl=Math.sin(this.bl*_1d);
if(Math.abs(Math.abs(lat)-HALF_PI)>EPSLN){
ts1=tsfnz(this.e,lat,_16);
q=this.el/(Math.pow(ts1,this.bl));
s=0.5*(q-1/q);
t=0.5*(q+1/q);
ul=(s*this.singam-vl*this.cosgam)/t;
con=Math.cos(this.bl*_1d);
if(Math.abs(con)<1e-7){
us=this.al*this.bl*_1d;
}else{
us=this.al*Math.atan((s*this.cosgam+vl*this.singam)/con)/this.bl;
if(con<0){
us=us+PI*this.al/this.bl;
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
if(Math.abs(Math.abs(ul)-1)<=EPSLN){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("omercFwdInfinity"));
}
}
vs=0.5*this.al*Math.log((1-ul)/(1+ul))/this.bl;
us=us-this.u;
var x=this.x0+vs*this.cosaz+us*this.sinaz;
var y=this.y0+us*this.cosaz-vs*this.sinaz;
p.x=x;
p.y=y;
};
omercInv=function(p){
var _24;
var _25;
var _26;
var _27,cos_phi;
var b;
var c,t,tq;
var con,n,ml;
var vs,us,q,s,ts1;
var vl,ul,bs;
var _2d;
var _2e;
p.x-=this.x0;
p.y-=this.y0;
_2e=0;
vs=p.x*this.cosaz-p.y*this.sinaz;
us=p.y*this.cosaz+p.x*this.sinaz;
us=us+this.u;
q=Math.exp(-this.bl*vs/this.al);
s=0.5*(q-1/q);
t=0.5*(q+1/q);
vl=Math.sin(this.bl*us/this.al);
ul=(vl*this.cosgam+s*this.singam)/t;
if(Math.abs(Math.abs(ul)-1)<=EPSLN){
lon=this.longc;
if(ul>=0){
lat=HALF_PI;
}else{
lat=-HALF_PI;
}
}else{
con=1/this.bl;
ts1=Math.pow((this.el/Math.sqrt((1+ul)/(1-ul))),con);
lat=phi2z(this.e,ts1);
_25=this.longc-Math.atan2((s*this.cosgam-vl*this.singam),con)/this.bl;
lon=adjust_lon(_25);
}
p.x=lon;
p.y=lat;
};

function tsfnz(_1,_2,_3){
var _4=_1*_3;
var _5=0.5*_1;
_4=Math.pow(((1-_4)/(1+_4)),_5);
return (Math.tan(0.5*(HALF_PI-_2))/_4);
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
function phi2z(_8,ts){
var _a=0.5*_8;
var _b,dphi;
var _c=HALF_PI-2*Math.atan(ts);
for(i=0;i<=15;i++){
_b=_8*Math.sin(_c);
dphi=HALF_PI-2*Math.atan(ts*(Math.pow(((1-_b)/(1+_b)),_a)))-_c;
_c+=dphi;
if(Math.abs(dphi)<=1e-10){
return _c;
}
}
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("phi2zNoConvergence"));
}
return -9999;
}
mercInit=function(_d){
_d.temp=_d.b/_d.a;
_d.es=1-(_d.temp*_d.temp);
_d.e=Math.sqrt(_d.es);
_d.m1=Math.cos(0)/(Math.sqrt(1-_d.es*Math.sin(0)*Math.sin(0)));
};
mercFwd=function(p){
lon=p.x;
lat=p.y;
if(lat*R2D>90&&lat*R2D<-90&&lon*R2D>180&&lon*R2D<-180){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("llInputOutOfRange",lon,lat));
}
return null;
}
if(Math.abs(Math.abs(lat)-HALF_PI)<=EPSLN){
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("ll2mAtPoles"));
}
return null;
}else{
var _f=Math.sin(lat);
var ts=tsfnz(this.e,lat,_f);
var x=this.x0+this.a*this.m1*adjust_lon(lon-this.long0);
var y=this.y0-this.a*this.m1*Math.log(ts);
}
p.x=x;
p.y=y;
};
mercInv=function(p){
p.x-=this.x0;
p.y-=this.y0;
var ts=Math.exp(-p.y/(this.a*this.m1));
var lat=phi2z(this.e,ts);
if(lat==-9999){
alert("lat = -9999");
return null;
}
var lon=adjust_lon(this.long0+p.x/(this.a*this.m1));
p.x=lon;
p.y=lat;
};

function msfnz(_1,_2,_3){
var _4=_1*_2;
return _3/(Math.sqrt(1-_4*_4));
}
function tsfnz(_5,_6,_7){
var _8=_5*_7;
var _9=0.5*_5;
_8=Math.pow(((1-_8)/(1+_8)),_9);
return (Math.tan(0.5*(HALF_PI-_6))/_8);
}
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
function adjust_lon(x){
x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));
return (x);
}
function asinz(x){
x=(Math.abs(x)>1)?1:-1;
return (x);
}
function phi4z(_15,e0,e1,e2,e3,a,b,c,phi){
var _1e,sin2ph,tanph,ml,mlp,con1,con2,con3,dphi,i;
phi=a;
for(i=1;i<=15;i++){
_1e=Math.sin(phi);
tanphi=Math.tan(phi);
c=tanphi*Math.sqrt(1-_15*_1e*_1e);
sin2ph=Math.sin(2*phi);
ml=e0*phi-e1*sin2ph+e2*Math.sin(4*phi)-e3*Math.sin(6*phi);
mlp=e0-2*e1*Math.cos(2*phi)+4*e2*Math.cos(4*phi)-6*e3*Math.cos(6*phi);
con1=2*ml+c*(ml*ml+b)-2*a*(c*ml+1);
con2=_15*sin2ph*(ml*ml+b-2*a*ml)/(2*c);
con3=2*(a-ml)*(c*mlp-2/sin2ph)-2*mlp;
dphi=con1/(con2+con3);
phi+=dphi;
if(Math.abs(dphi)<=1e-10){
return (phi);
}
}
if(!MB_IGNORE_CSCS_ERRORS){
alert(mbGetMessage("phi4zNoConvergence"));
}
return (4);
}
function e4fn(x){
var con,com;
con=1+x;
com=1-x;
return (Math.sqrt((Math.pow(con,con))*(Math.pow(com,com))));
}
polyInit=function(def){
var _22;
if(def.lat0=0){
def.lat0=90;
}
def.temp=def.b/def.a;
def.es=1-Math.pow(def.temp,2);
def.e=Math.sqrt(def.es);
def.e0=e0fn(def.es);
def.e1=e1fn(def.es);
def.e2=e2fn(def.es);
def.e3=e3fn(def.es);
def.ml0=mlfn(def.e0,def.e1,def.e2,def.e3,def.lat0);
};
polyFwd=function(p){
var _24,cosphi;
var al;
var c;
var con,ml;
var ms;
var lon=p.x;
var lat=p.y;
con=adjust_lon(lon-this.long0);
if(Math.abs(lat)<=1e-7){
var x=this.x0+this.a*con;
var y=this.y0-this.a*this.ml0;
}else{
_24=Math.sin(lat);
cosphi=Math.cos(lat);
ml=mlfn(this.e0,this.e1,this.e2,this.e3,lat);
ms=msfnz(this.e,_24,cosphi);
con=_24;
x=this.x0+this.a*ms*Math.sin(con)/_24;
y=this.y0+this.a*(ml-this.ml0+ms*(1-Math.cos(con))/_24);
}
p.x=x;
p.y=y;
};
polyInv=function(p){
var _2e,cos_phi;
var al;
var b;
var c;
var con,ml;
var _33;
var lon,lat;
p.x-=this.x0;
p.y-=this.y0;
al=this.ml0+p.y/this.a;
_33=0;
if(Math.abs(al)<=1e-7){
lon=p.x/this.a+this.long0;
lat=0;
}else{
b=al*al+(p.x/this.a)*(p.x/this.a);
_33=phi4z(this.es,this.e0,this.e1,this.e2,this.e3,this.al,b,c,lat);
if(_33!=1){
return (_33);
}
lon=adjust_lon((asinz(p.x*c/this.a)/Math.sin(lat))+this.long0);
}
p.x=lon;
p.y=lat;
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
var _8=new Array("md5/md5.js","OpenLayers/Util.js","OpenLayers/BaseTypes.js","OpenLayers/BaseTypes/Class.js","OpenLayers/BaseTypes/Bounds.js","OpenLayers/BaseTypes/Element.js","OpenLayers/BaseTypes/LonLat.js","OpenLayers/BaseTypes/Pixel.js","OpenLayers/BaseTypes/Size.js","OpenLayers/Console.js","Rico/Corner.js","Rico/Color.js","OpenLayers/Ajax.js","OpenLayers/Events.js","OpenLayers/Map.js","OpenLayers/Layer.js","OpenLayers/Icon.js","OpenLayers/Marker.js","OpenLayers/Marker/Box.js","OpenLayers/Popup.js","OpenLayers/Tile.js","OpenLayers/Feature.js","OpenLayers/Feature/Vector.js","OpenLayers/Feature/WFS.js","OpenLayers/Tile/Image.js","OpenLayers/Tile/WFS.js","OpenLayers/Layer/Image.js","OpenLayers/Layer/EventPane.js","OpenLayers/Layer/FixedZoomLevels.js","OpenLayers/Layer/Google.js","OpenLayers/Layer/VirtualEarth.js","OpenLayers/Layer/Yahoo.js","OpenLayers/Layer/HTTPRequest.js","OpenLayers/Layer/Grid.js","OpenLayers/Layer/MapServer.js","OpenLayers/Layer/MapServer/Untiled.js","OpenLayers/Layer/KaMap.js","OpenLayers/Layer/MultiMap.js","OpenLayers/Layer/Markers.js","OpenLayers/Layer/Text.js","OpenLayers/Layer/WorldWind.js","OpenLayers/Layer/WMS.js","OpenLayers/Layer/WMS/Untiled.js","OpenLayers/Layer/GeoRSS.js","OpenLayers/Layer/Boxes.js","OpenLayers/Layer/TMS.js","OpenLayers/Layer/TileCache.js","OpenLayers/Popup/Anchored.js","OpenLayers/Popup/AnchoredBubble.js","OpenLayers/Handler.js","OpenLayers/Handler/Point.js","OpenLayers/Handler/Path.js","OpenLayers/Handler/Polygon.js","OpenLayers/Handler/Feature.js","OpenLayers/Handler/Drag.js","OpenLayers/Handler/Box.js","OpenLayers/Handler/MouseWheel.js","OpenLayers/Handler/Keyboard.js","OpenLayers/Control.js","OpenLayers/Control/ZoomBox.js","OpenLayers/Control/ZoomToMaxExtent.js","OpenLayers/Control/DragPan.js","OpenLayers/Control/Navigation.js","OpenLayers/Control/MouseDefaults.js","OpenLayers/Control/MousePosition.js","OpenLayers/Control/OverviewMap.js","OpenLayers/Control/KeyboardDefaults.js","OpenLayers/Control/PanZoom.js","OpenLayers/Control/PanZoomBar.js","OpenLayers/Control/ArgParser.js","OpenLayers/Control/Permalink.js","OpenLayers/Control/Scale.js","OpenLayers/Control/LayerSwitcher.js","OpenLayers/Control/DrawFeature.js","OpenLayers/Control/Panel.js","OpenLayers/Control/SelectFeature.js","OpenLayers/Geometry.js","OpenLayers/Geometry/Rectangle.js","OpenLayers/Geometry/Collection.js","OpenLayers/Geometry/Point.js","OpenLayers/Geometry/MultiPoint.js","OpenLayers/Geometry/Curve.js","OpenLayers/Geometry/LineString.js","OpenLayers/Geometry/LinearRing.js","OpenLayers/Geometry/Polygon.js","OpenLayers/Geometry/MultiLineString.js","OpenLayers/Geometry/MultiPolygon.js","OpenLayers/Geometry/Surface.js","OpenLayers/Renderer.js","OpenLayers/Renderer/Elements.js","OpenLayers/Renderer/SVG.js","OpenLayers/Renderer/VML.js","OpenLayers/Layer/Vector.js","OpenLayers/Layer/GML.js","OpenLayers/Format.js","OpenLayers/Format/XML.js","OpenLayers/Format/GML.js","OpenLayers/Format/KML.js","OpenLayers/Format/GeoRSS.js","OpenLayers/Format/WFS.js","OpenLayers/Format/WKT.js","OpenLayers/Layer/WFS.js","OpenLayers/Control/MouseToolbar.js","OpenLayers/Control/NavToolbar.js","OpenLayers/Control/EditingToolbar.js","OpenLayers/Layer/GeoRSSvector.js");
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
OpenLayers.VERSION_NUMBER="$Revision: 3862 $";
String.prototype.startsWith=function(_f){
return (this.substr(0,_f.length)==_f);
};
String.prototype.contains=function(str){
return (this.indexOf(str)!=-1);
};
String.prototype.trim=function(){
var b=0;
while(this.substr(b,1)==" "){
b++;
}
var e=this.length-1;
while(this.substr(e,1)==" "){
e--;
}
return this.substring(b,e+1);
};
String.indexOf=function(_13){
var _14=-1;
for(var i=0;i<this.length;i++){
if(this[i]==_13){
_14=i;
break;
}
}
return _14;
};
String.prototype.camelize=function(){
var _16=this.split("-");
var _17=_16[0];
for(var i=1;i<_16.length;i++){
var s=_16[i];
_17+=s.charAt(0).toUpperCase()+s.substring(1);
}
return _17;
};
Number.prototype.limitSigDigs=function(sig){
var _1b=(sig>0)?this.toString():0;
if(sig<_1b.length){
var exp=_1b.length-sig;
_1b=Math.round(this/Math.pow(10,exp))*Math.pow(10,exp);
}
return parseInt(_1b);
};
Function.prototype.bind=function(){
var _1d=this;
var _1e=[];
var _1f=arguments[0];
for(var i=1;i<arguments.length;i++){
_1e.push(arguments[i]);
}
return function(_21){
for(var i=0;i<arguments.length;i++){
_1e.push(arguments[i]);
}
return _1d.apply(_1f,_1e);
};
};
Function.prototype.bindAsEventListener=function(_23){
var _24=this;
return function(_25){
return _24.call(_23,_25||window.event);
};
};
OpenLayers.Class=function(){
var _26=function(){
if(arguments&&arguments[0]!=OpenLayers.Class.isPrototype){
this.initialize.apply(this,arguments);
}
};
var _27={};
var _28;
for(var i=0;i<arguments.length;++i){
if(typeof arguments[i]=="function"){
_28=arguments[i].prototype;
}else{
_28=arguments[i];
}
OpenLayers.Util.extend(_27,_28);
}
_26.prototype=_27;
return _26;
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
var _2a=arguments[0];
var _2b=new _2a(OpenLayers.Class.isPrototype);
for(var i=1;i<arguments.length;i++){
if(typeof arguments[i]=="function"){
var _2d=arguments[i];
arguments[i]=new _2d(OpenLayers.Class.isPrototype);
}
OpenLayers.Util.extend(_2b,arguments[i]);
}
return _2b;
};
OpenLayers.Util={};
OpenLayers.Util.getElement=function(){
var _2e=[];
for(var i=0;i<arguments.length;i++){
var _30=arguments[i];
if(typeof _30=="string"){
_30=document.getElementById(_30);
}
if(arguments.length==1){
return _30;
}
_2e.push(_30);
}
return _2e;
};
if($==null){
var $=OpenLayers.Util.getElement;
}
OpenLayers.Util.extend=function(_31,_32){
if(_31&&_32){
for(var _33 in _32){
_31[_33]=_32[_33];
}
if(_32.hasOwnProperty&&_32.hasOwnProperty("toString")){
_31.toString=_32.toString;
}
}
return _31;
};
OpenLayers.Util.removeItem=function(_34,_35){
for(var i=0;i<_34.length;i++){
if(_34[i]==_35){
_34.splice(i,1);
}
}
return _34;
};
OpenLayers.Util.clearArray=function(_37){
var msg="OpenLayers.Util.clearArray() is Deprecated."+" Please use 'array.length = 0' instead.";
OpenLayers.Console.warn(msg);
_37.length=0;
};
OpenLayers.Util.indexOf=function(_39,obj){
for(var i=0;i<_39.length;i++){
if(_39[i]==obj){
return i;
}
}
return -1;
};
OpenLayers.Util.modifyDOMElement=function(_3c,id,px,sz,_40,_41,_42,_43){
if(id){
_3c.id=id;
}
if(px){
_3c.style.left=px.x+"px";
_3c.style.top=px.y+"px";
}
if(sz){
_3c.style.width=sz.w+"px";
_3c.style.height=sz.h+"px";
}
if(_40){
_3c.style.position=_40;
}
if(_41){
_3c.style.border=_41;
}
if(_42){
_3c.style.overflow=_42;
}
if(_43){
_3c.style.opacity=_43;
_3c.style.filter="alpha(opacity="+(_43*100)+")";
}
};
OpenLayers.Util.createDiv=function(id,px,sz,_47,_48,_49,_4a,_4b){
var dom=document.createElement("div");
if(_47){
dom.style.backgroundImage="url("+_47+")";
}
if(!id){
id=OpenLayers.Util.createUniqueID("OpenLayersDiv");
}
if(!_48){
_48="absolute";
}
OpenLayers.Util.modifyDOMElement(dom,id,px,sz,_48,_49,_4a,_4b);
return dom;
};
OpenLayers.Util.createImage=function(id,px,sz,_50,_51,_52,_53,_54){
var _55=document.createElement("img");
if(!id){
id=OpenLayers.Util.createUniqueID("OpenLayersDiv");
}
if(!_51){
_51="relative";
}
OpenLayers.Util.modifyDOMElement(_55,id,px,sz,_51,_52,null,_53);
if(_54){
_55.style.display="none";
OpenLayers.Event.observe(_55,"load",OpenLayers.Util.onImageLoad.bind(_55));
OpenLayers.Event.observe(_55,"error",OpenLayers.Util.onImageLoadError.bind(_55));
}
_55.style.alt=id;
_55.galleryImg="no";
if(_50){
_55.src=_50;
}
return _55;
};
OpenLayers.Util.setOpacity=function(_56,_57){
OpenLayers.Util.modifyDOMElement(_56,null,null,null,null,null,null,_57);
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
var _58=navigator.appVersion.split("MSIE");
var _59=parseFloat(_58[1]);
var _5a=false;
try{
_5a=document.body.filters;
}
catch(e){
}
return (_5a&&(_59>=5.5)&&(_59<7));
};
OpenLayers.Util.modifyAlphaImageDiv=function(div,id,px,sz,_5f,_60,_61,_62,_63){
OpenLayers.Util.modifyDOMElement(div,id,px,sz);
var img=div.childNodes[0];
if(_5f){
img.src=_5f;
}
OpenLayers.Util.modifyDOMElement(img,div.id+"_innerImage",null,sz,"relative",_61);
if(_63){
div.style.opacity=_63;
div.style.filter="alpha(opacity="+(_63*100)+")";
}
if(OpenLayers.Util.alphaHack()){
div.style.display="inline-block";
if(_62==null){
_62="scale";
}
div.style.filter="progid:DXImageTransform.Microsoft"+".AlphaImageLoader(src='"+img.src+"', "+"sizingMethod='"+_62+"')";
if(div.style.opacity){
div.style.filter+=" alpha(opacity="+div.style.opacity*100+")";
}
img.style.filter="progid:DXImageTransform.Microsoft"+".Alpha(opacity=0)";
}
};
OpenLayers.Util.createAlphaImageDiv=function(id,px,sz,_68,_69,_6a,_6b,_6c,_6d){
var div=OpenLayers.Util.createDiv();
var img=OpenLayers.Util.createImage(null,null,null,null,null,null,null,false);
div.appendChild(img);
if(_6d){
img.style.display="none";
OpenLayers.Event.observe(img,"load",OpenLayers.Util.onImageLoad.bind(div));
OpenLayers.Event.observe(img,"error",OpenLayers.Util.onImageLoadError.bind(div));
}
OpenLayers.Util.modifyAlphaImageDiv(div,id,px,sz,_68,_69,_6a,_6b,_6c);
return div;
};
OpenLayers.Util.upperCaseObject=function(_70){
var _71={};
for(var key in _70){
_71[key.toUpperCase()]=_70[key];
}
return _71;
};
OpenLayers.Util.applyDefaults=function(to,_74){
for(var key in _74){
if(to[key]==null){
to[key]=_74[key];
}
}
};
OpenLayers.Util.getParameterString=function(_76){
paramsArray=[];
for(var key in _76){
var _78=_76[key];
if((_78!=null)&&(typeof _78!="function")){
var _79;
if(typeof _78=="object"&&_78.constructor==Array){
var _7a=[];
for(var _7b=0;_7b<_78.length;_7b++){
_7a.push(encodeURIComponent(_78[_7b]));
}
_79=_7a.join(",");
}else{
_79=encodeURIComponent(_78);
}
paramsArray.push(encodeURIComponent(key)+"="+_79);
}
}
return paramsArray.join("&");
};
OpenLayers.ImgPath="";
OpenLayers.Util.getImagesLocation=function(){
return OpenLayers.ImgPath||(OpenLayers._getScriptLocation()+"img/");
};
OpenLayers.Util.Try=function(){
var _7c=null;
for(var i=0;i<arguments.length;i++){
var _7e=arguments[i];
try{
_7c=_7e();
break;
}
catch(e){
}
}
return _7c;
};
OpenLayers.Util.getNodes=function(p,_80){
var _81=OpenLayers.Util.Try(function(){
return OpenLayers.Util._getNodes(p.documentElement.childNodes,_80);
},function(){
return OpenLayers.Util._getNodes(p.childNodes,_80);
});
return _81;
};
OpenLayers.Util._getNodes=function(_82,_83){
var _84=[];
for(var i=0;i<_82.length;i++){
if(_82[i].nodeName==_83){
_84.push(_82[i]);
}
}
return _84;
};
OpenLayers.Util.getTagText=function(_86,_87,_88){
var _89=OpenLayers.Util.getNodes(_86,_87);
if(_89&&(_89.length>0)){
if(!_88){
_88=0;
}
if(_89[_88].childNodes.length>1){
return _89.childNodes[1].nodeValue;
}else{
if(_89[_88].childNodes.length==1){
return _89[_88].firstChild.nodeValue;
}
}
}else{
return "";
}
};
OpenLayers.Util.getXmlNodeValue=function(_8a){
var val=null;
OpenLayers.Util.Try(function(){
val=_8a.text;
if(!val){
val=_8a.textContent;
}
if(!val){
val=_8a.firstChild.nodeValue;
}
},function(){
val=_8a.textContent;
});
return val;
};
OpenLayers.Util.mouseLeft=function(evt,div){
var _8e=(evt.relatedTarget)?evt.relatedTarget:evt.toElement;
while(_8e!=div&&_8e!=null){
_8e=_8e.parentNode;
}
return (_8e!=div);
};
OpenLayers.Util.rad=function(x){
return x*Math.PI/180;
};
OpenLayers.Util.distVincenty=function(p1,p2){
var a=6378137,b=6356752.3142,f=1/298.257223563;
var L=OpenLayers.Util.rad(p2.lon-p1.lon);
var U1=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p1.lat)));
var U2=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p2.lat)));
var _96=Math.sin(U1),cosU1=Math.cos(U1);
var _97=Math.sin(U2),cosU2=Math.cos(U2);
var _98=L,lambdaP=2*Math.PI;
var _99=20;
while(Math.abs(_98-lambdaP)>1e-12&&--_99>0){
var _9a=Math.sin(_98),cosLambda=Math.cos(_98);
var _9b=Math.sqrt((cosU2*_9a)*(cosU2*_9a)+(cosU1*_97-_96*cosU2*cosLambda)*(cosU1*_97-_96*cosU2*cosLambda));
if(_9b==0){
return 0;
}
var _9c=_96*_97+cosU1*cosU2*cosLambda;
var _9d=Math.atan2(_9b,_9c);
var _9e=Math.asin(cosU1*cosU2*_9a/_9b);
var _9f=Math.cos(_9e)*Math.cos(_9e);
var _a0=_9c-2*_96*_97/_9f;
var C=f/16*_9f*(4+f*(4-3*_9f));
lambdaP=_98;
_98=L+(1-C)*f*Math.sin(_9e)*(_9d+C*_9b*(_a0+C*_9c*(-1+2*_a0*_a0)));
}
if(_99==0){
return NaN;
}
var uSq=_9f*(a*a-b*b)/(b*b);
var A=1+uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
var B=uSq/1024*(256+uSq*(-128+uSq*(74-47*uSq)));
var _a5=B*_9b*(_a0+B/4*(_9c*(-1+2*_a0*_a0)-B/6*_a0*(-3+4*_9b*_9b)*(-3+4*_a0*_a0)));
var s=b*A*(_9d-_a5);
var d=s.toFixed(3)/1000;
return d;
};
OpenLayers.Util.getArgs=function(url){
if(url==null){
url=window.location.href;
}
var _a9=url.indexOf("?");
var _aa=url.indexOf("#");
if(_a9!=-1){
if(_aa!=-1){
var _ab=url.substring(_a9+1,_aa);
}else{
var _ab=url.substring(_a9+1);
}
}else{
return {};
}
var _ac={};
pairs=_ab.split(/[&;]/);
for(var i=0;i<pairs.length;++i){
keyValue=pairs[i].split("=");
if(keyValue[0]){
if(keyValue[1]){
_ac[decodeURIComponent(keyValue[0])]=decodeURIComponent(keyValue[1]);
}else{
_ac[decodeURIComponent(keyValue[0])]="";
}
}
}
return _ac;
};
OpenLayers.Util.lastSeqID=0;
OpenLayers.Util.createUniqueID=function(_ae){
if(_ae==null){
_ae="id_";
}
OpenLayers.Util.lastSeqID+=1;
return _ae+OpenLayers.Util.lastSeqID;
};
OpenLayers.INCHES_PER_UNIT={"inches":1,"ft":12,"mi":63360,"m":39.3701,"km":39370.1,"dd":4374754};
OpenLayers.INCHES_PER_UNIT["in"]=OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"]=OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.DOTS_PER_INCH=72;
OpenLayers.Util.normalizeScale=function(_af){
var _b0=(_af>1)?(1/_af):_af;
return _b0;
};
OpenLayers.Util.getResolutionFromScale=function(_b1,_b2){
if(_b2==null){
_b2="degrees";
}
var _b3=OpenLayers.Util.normalizeScale(_b1);
var _b4=1/(_b3*OpenLayers.INCHES_PER_UNIT[_b2]*OpenLayers.DOTS_PER_INCH);
return _b4;
};
OpenLayers.Util.getScaleFromResolution=function(_b5,_b6){
if(_b6==null){
_b6="degrees";
}
var _b7=_b5*OpenLayers.INCHES_PER_UNIT[_b6]*OpenLayers.DOTS_PER_INCH;
return _b7;
};
OpenLayers.Util.safeStopPropagation=function(evt){
OpenLayers.Event.stop(evt,true);
};
OpenLayers.Util.pagePosition=function(_b9){
var _ba=0,valueL=0;
var _bb=_b9;
do{
_ba+=_bb.offsetTop||0;
valueL+=_bb.offsetLeft||0;
if(_bb.offsetParent==document.body){
if(OpenLayers.Element.getStyle(_bb,"position")=="absolute"){
break;
}
}
}while(_bb=_bb.offsetParent);
_bb=_b9;
do{
_ba-=_bb.scrollTop||0;
valueL-=_bb.scrollLeft||0;
}while(_bb=_bb.parentNode);
return [valueL,_ba];
};
OpenLayers.Util.isEquivalentUrl=function(_bc,_bd,_be){
_be=_be||{};
OpenLayers.Util.applyDefaults(_be,{ignoreCase:true,ignorePort80:true,ignoreHash:true});
urlObj1=OpenLayers.Util.createUrlObject(_bc,_be);
urlObj2=OpenLayers.Util.createUrlObject(_bd,_be);
for(var key in urlObj1){
if(_be.test){
alert(key+"\n1:"+urlObj1[key]+"\n2:"+urlObj2[key]);
}
var _c0=urlObj1[key];
var _c1=urlObj2[key];
switch(key){
case "args":
break;
case "host":
case "port":
case "protocol":
if((_c0=="")||(_c1=="")){
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
OpenLayers.Util.createUrlObject=function(url,_c3){
_c3=_c3||{};
var _c4={};
if(_c3.ignoreCase){
url=url.toLowerCase();
}
var a=document.createElement("a");
a.href=url;
_c4.host=a.host;
var _c6=a.port;
if(_c6.length<=0){
var _c7=_c4.host.length-(_c6.length);
_c4.host=_c4.host.substring(0,_c7);
}
_c4.protocol=a.protocol;
_c4.port=((_c6=="80")&&(_c3.ignorePort80))?"":_c6;
_c4.hash=(_c3.ignoreHash)?"":a.hash;
var _c8=a.search;
if(!_c8){
var _c9=url.indexOf("?");
_c8=(_c9!=-1)?url.substr(_c9):"";
}
_c4.args=OpenLayers.Util.getArgs(_c8);
if(((_c4.protocol=="file:")&&(url.indexOf("file:")!=-1))||((_c4.protocol!="file:")&&(_c4.host!=""))){
_c4.pathname=a.pathname;
var _ca=_c4.pathname.indexOf("?");
if(_ca!=-1){
_c4.pathname=_c4.pathname.substring(0,_ca);
}
}else{
var _cb=OpenLayers.Util.removeTail(url);
var _cc=0;
do{
var _cd=_cb.indexOf("../");
if(_cd==0){
_cc++;
_cb=_cb.substr(3);
}else{
if(_cd>=0){
var _ce=_cb.substr(0,_cd-1);
var _cf=_ce.indexOf("/");
_ce=(_cf!=-1)?_ce.substr(0,_cf+1):"";
var _d0=_cb.substr(_cd+3);
_cb=_ce+_d0;
}
}
}while(_cd!=-1);
var _d1=document.createElement("a");
var _d2=window.location.href;
if(_c3.ignoreCase){
_d2=_d2.toLowerCase();
}
_d1.href=_d2;
_c4.protocol=_d1.protocol;
var _d3=(_d1.pathname.indexOf("/")!=-1)?"/":"\\";
var _d4=_d1.pathname.split(_d3);
_d4.pop();
while((_cc>0)&&(_d4.length>0)){
_d4.pop();
_cc--;
}
_cb=_d4.join("/")+"/"+_cb;
_c4.pathname=_cb;
}
if((_c4.protocol=="file:")||(_c4.protocol=="")){
_c4.host="localhost";
}
return _c4;
};
OpenLayers.Util.removeTail=function(url){
var _d6=null;
var _d7=url.indexOf("?");
var _d8=url.indexOf("#");
if(_d7==-1){
_d6=(_d8!=-1)?url.substr(0,_d8):url;
}else{
_d6=(_d8!=-1)?url.substr(0,Math.min(_d7,_d8)):url.substr(0,_d7);
}
return _d6;
};
OpenLayers.Util.getBrowserName=function(){
var _d9="";
var ua=navigator.userAgent.toLowerCase();
if(ua.indexOf("opera")!=-1){
_d9="opera";
}else{
if(ua.indexOf("msie")!=-1){
_d9="msie";
}else{
if(ua.indexOf("safari")!=-1){
_d9="safari";
}else{
if(ua.indexOf("mozilla")!=-1){
if(ua.indexOf("firefox")!=-1){
_d9="firefox";
}else{
_d9="mozilla";
}
}
}
}
}
return _d9;
};
OpenLayers.Rico=new Object();
OpenLayers.Rico.Corner={round:function(e,_dc){
e=OpenLayers.Util.getElement(e);
this._setOptions(_dc);
var _dd=this.options.color;
if(this.options.color=="fromElement"){
_dd=this._background(e);
}
var _de=this.options.bgColor;
if(this.options.bgColor=="fromParent"){
_de=this._background(e.offsetParent);
}
this._roundCornersImpl(e,_dd,_de);
},changeColor:function(_df,_e0){
_df.style.backgroundColor=_e0;
var _e1=_df.parentNode.getElementsByTagName("span");
for(var _e2=0;_e2<_e1.length;_e2++){
_e1[_e2].style.backgroundColor=_e0;
}
},changeOpacity:function(_e3,_e4){
var _e5=_e4;
var _e6="alpha(opacity="+_e4*100+")";
_e3.style.opacity=_e5;
_e3.style.filter=_e6;
var _e7=_e3.parentNode.getElementsByTagName("span");
for(var _e8=0;_e8<_e7.length;_e8++){
_e7[_e8].style.opacity=_e5;
_e7[_e8].style.filter=_e6;
}
},reRound:function(_e9,_ea){
var _eb=_e9.parentNode.childNodes[0];
var _ec=_e9.parentNode.childNodes[2];
_e9.parentNode.removeChild(_eb);
_e9.parentNode.removeChild(_ec);
this.round(_e9.parentNode,_ea);
},_roundCornersImpl:function(e,_ee,_ef){
if(this.options.border){
this._renderBorder(e,_ef);
}
if(this._isTopRounded()){
this._roundTopCorners(e,_ee,_ef);
}
if(this._isBottomRounded()){
this._roundBottomCorners(e,_ee,_ef);
}
},_renderBorder:function(el,_f1){
var _f2="1px solid "+this._borderColor(_f1);
var _f3="border-left: "+_f2;
var _f4="border-right: "+_f2;
var _f5="style='"+_f3+";"+_f4+"'";
el.innerHTML="<div "+_f5+">"+el.innerHTML+"</div>";
},_roundTopCorners:function(el,_f7,_f8){
var _f9=this._createCorner(_f8);
for(var i=0;i<this.options.numSlices;i++){
_f9.appendChild(this._createCornerSlice(_f7,_f8,i,"top"));
}
el.style.paddingTop=0;
el.insertBefore(_f9,el.firstChild);
},_roundBottomCorners:function(el,_fc,_fd){
var _fe=this._createCorner(_fd);
for(var i=(this.options.numSlices-1);i>=0;i--){
_fe.appendChild(this._createCornerSlice(_fc,_fd,i,"bottom"));
}
el.style.paddingBottom=0;
el.appendChild(_fe);
},_createCorner:function(_100){
var _101=document.createElement("div");
_101.style.backgroundColor=(this._isTransparent()?"transparent":_100);
return _101;
},_createCornerSlice:function(_102,_103,n,_105){
var _106=document.createElement("span");
var _107=_106.style;
_107.backgroundColor=_102;
_107.display="block";
_107.height="1px";
_107.overflow="hidden";
_107.fontSize="1px";
var _108=this._borderColor(_102,_103);
if(this.options.border&&n==0){
_107.borderTopStyle="solid";
_107.borderTopWidth="1px";
_107.borderLeftWidth="0px";
_107.borderRightWidth="0px";
_107.borderBottomWidth="0px";
_107.height="0px";
_107.borderColor=_108;
}else{
if(_108){
_107.borderColor=_108;
_107.borderStyle="solid";
_107.borderWidth="0px 1px";
}
}
if(!this.options.compact&&(n==(this.options.numSlices-1))){
_107.height="2px";
}
this._setMargin(_106,n,_105);
this._setBorder(_106,n,_105);
return _106;
},_setOptions:function(_109){
this.options={corners:"all",color:"fromElement",bgColor:"fromParent",blend:true,border:false,compact:false};
OpenLayers.Util.extend(this.options,_109||{});
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
},_borderColor:function(_10a,_10b){
if(_10a=="transparent"){
return _10b;
}else{
if(this.options.border){
return this.options.border;
}else{
if(this.options.blend){
return this._blend(_10b,_10a);
}else{
return "";
}
}
}
},_setMargin:function(el,n,_10e){
var _10f=this._marginSize(n);
var _110=_10e=="top"?this._whichSideTop():this._whichSideBottom();
if(_110=="left"){
el.style.marginLeft=_10f+"px";
el.style.marginRight="0px";
}else{
if(_110=="right"){
el.style.marginRight=_10f+"px";
el.style.marginLeft="0px";
}else{
el.style.marginLeft=_10f+"px";
el.style.marginRight=_10f+"px";
}
}
},_setBorder:function(el,n,_113){
var _114=this._borderSize(n);
var _115=_113=="top"?this._whichSideTop():this._whichSideBottom();
if(_115=="left"){
el.style.borderLeftWidth=_114+"px";
el.style.borderRightWidth="0px";
}else{
if(_115=="right"){
el.style.borderRightWidth=_114+"px";
el.style.borderLeftWidth="0px";
}else{
el.style.borderLeftWidth=_114+"px";
el.style.borderRightWidth=_114+"px";
}
}
if(this.options.border!=false){
el.style.borderLeftWidth=_114+"px";
}
el.style.borderRightWidth=_114+"px";
},_marginSize:function(n){
if(this._isTransparent()){
return 0;
}
var _117=[5,3,2,1];
var _118=[3,2,1,0];
var _119=[2,1];
var _11a=[1,0];
if(this.options.compact&&this.options.blend){
return _11a[n];
}else{
if(this.options.compact){
return _119[n];
}else{
if(this.options.blend){
return _118[n];
}else{
return _117[n];
}
}
}
},_borderSize:function(n){
var _11c=[5,3,2,1];
var _11d=[2,1,1,1];
var _11e=[1,0];
var _11f=[0,2,0,0];
if(this.options.compact&&(this.options.blend||this._isTransparent())){
return 1;
}else{
if(this.options.compact){
return _11e[n];
}else{
if(this.options.blend){
return _11d[n];
}else{
if(this.options.border){
return _11f[n];
}else{
if(this._isTransparent()){
return _11c[n];
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
OpenLayers.nullHandler=function(_127){
alert("Unhandled request return "+_127.statusText);
};
OpenLayers.loadURL=function(uri,_129,_12a,_12b,_12c){
if(OpenLayers.ProxyHost&&uri.startsWith("http")){
uri=OpenLayers.ProxyHost+escape(uri);
}
var _12d=(_12b)?_12b.bind(_12a):OpenLayers.nullHandler;
var _12e=(_12c)?_12c.bind(_12a):OpenLayers.nullHandler;
new OpenLayers.Ajax.Request(uri,{method:"get",parameters:_129,onComplete:_12d,onFailure:_12e});
};
OpenLayers.parseXMLString=function(text){
var _130=text.indexOf("<");
if(_130>0){
text=text.substring(_130);
}
var _131=OpenLayers.Util.Try(function(){
var _132=new ActiveXObject("Microsoft.XMLDOM");
_132.loadXML(text);
return _132;
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
return _131;
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
OpenLayers.Ajax.Responders={responders:[],register:function(_134){
for(var i=0;i<this.responders.length;i++){
if(_134==this.responders[i]){
return;
}
}
this.responders.push(_134);
},dispatch:function(_136,_137,_138,json){
var _13a;
for(var i=0;i<this.responders.length;i++){
_13a=this.responders[i];
if(_13a[_136]&&typeof _13a[_136]=="function"){
try{
_13a[_136].apply(_13a,[_137,_138,json]);
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
OpenLayers.Ajax.Base.prototype={setOptions:function(_13c){
this.options={"method":"post","asynchronous":true,"parameters":""};
OpenLayers.Util.extend(this.options,_13c||{});
},responseIsSuccess:function(){
return this.transport.status==undefined||this.transport.status==0||(this.transport.status>=200&&this.transport.status<300);
},responseIsFailure:function(){
return !this.responseIsSuccess();
}};
OpenLayers.Ajax.Request=OpenLayers.Class(OpenLayers.Ajax.Base,{initialize:function(url,_13e){
this.transport=OpenLayers.Ajax.getTransport();
this.setOptions(_13e);
this.request(url);
},request:function(url){
var _140=this.options.parameters||"";
if(_140.length>0){
_140+="&_=";
}
try{
this.url=url;
if(this.options.method=="get"&&_140.length>0){
this.url+=(this.url.match(/\?/)?"&":"?")+_140;
}
OpenLayers.Ajax.Responders.dispatch("onCreate",this,this.transport);
this.transport.open(this.options.method,this.url,this.options.asynchronous);
if(this.options.asynchronous){
this.transport.onreadystatechange=this.onStateChange.bind(this);
setTimeout((function(){
this.respondToReadyState(1);
}).bind(this),10);
}
this.setRequestHeaders();
var body=this.options.postBody?this.options.postBody:_140;
this.transport.send(this.options.method=="post"?body:null);
if(!this.options.asynchronous&&this.transport.overrideMimeType){
this.onStateChange();
}
}
catch(e){
this.dispatchException(e);
}
},setRequestHeaders:function(){
var _142=["X-Requested-With","XMLHttpRequest","X-Prototype-Version","OpenLayers"];
if(this.options.method=="post"&&!this.options.postBody){
_142.push("Content-type","application/x-www-form-urlencoded");
if(this.transport.overrideMimeType){
_142.push("Connection","close");
}
}
if(this.options.requestHeaders){
_142.push.apply(_142,this.options.requestHeaders);
}
for(var i=0;i<_142.length;i+=2){
this.transport.setRequestHeader(_142[i],_142[i+1]);
}
},onStateChange:function(){
var _144=this.transport.readyState;
if(_144!=1){
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
},respondToReadyState:function(_146){
var _147=OpenLayers.Ajax.Request.Events[_146];
var _148=this.transport,json=this.evalJSON();
if(_147=="Complete"){
try{
var _149=this.responseIsSuccess()?"Success":"Failure";
(this.options["on"+this.transport.status]||this.options["on"+_149]||OpenLayers.Ajax.emptyFunction)(_148,json);
}
catch(e){
this.dispatchException(e);
}
var _14a=this.header("Content-type")||"";
if(_14a.match(/^text\/javascript/i)){
this.evalResponse();
}
}
try{
(this.options["on"+_147]||OpenLayers.Ajax.emptyFunction)(_148,json);
OpenLayers.Ajax.Responders.dispatch("on"+_147,this,_148,json);
}
catch(e){
this.dispatchException(e);
}
if(_147=="Complete"){
this.transport.onreadystatechange=OpenLayers.Ajax.emptyFunction;
}
},dispatchException:function(_14b){
if(this.options.onException){
this.options.onException(this,_14b);
}else{
throw _14b;
}
OpenLayers.Ajax.Responders.dispatch("onException",this,_14b);
}});
OpenLayers.Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
OpenLayers.Ajax.getElementsByTagNameNS=function(_14c,_14d,_14e,_14f){
var elem=null;
if(_14c.getElementsByTagNameNS){
elem=_14c.getElementsByTagNameNS(_14d,_14f);
}else{
elem=_14c.getElementsByTagName(_14e+":"+_14f);
}
return elem;
};
OpenLayers.Ajax.serializeXMLToString=function(_151){
var _152=new XMLSerializer();
data=_152.serializeToString(_151);
return data;
};
OpenLayers.Bounds=OpenLayers.Class({left:0,bottom:0,right:0,top:0,initialize:function(left,_154,_155,top){
this.left=parseFloat(left);
this.bottom=parseFloat(_154);
this.right=parseFloat(_155);
this.top=parseFloat(top);
},clone:function(){
return new OpenLayers.Bounds(this.left,this.bottom,this.right,this.top);
},equals:function(_157){
var _158=false;
if(_157!=null){
_158=((this.left==_157.left)&&(this.right==_157.right)&&(this.top==_157.top)&&(this.bottom==_157.bottom));
}
return _158;
},toString:function(){
return ("left-bottom=("+this.left+","+this.bottom+")"+" right-top=("+this.right+","+this.top+")");
},toBBOX:function(_159){
if(_159==null){
_159=6;
}
var mult=Math.pow(10,_159);
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
},extend:function(_15f){
var _160=null;
if(_15f){
switch(_15f.CLASS_NAME){
case "OpenLayers.LonLat":
_160=new OpenLayers.Bounds(_15f.lon,_15f.lat,_15f.lon,_15f.lat);
break;
case "OpenLayers.Geometry.Point":
_160=new OpenLayers.Bounds(_15f.x,_15f.y,_15f.x,_15f.y);
break;
case "OpenLayers.Bounds":
_160=_15f;
break;
}
if(_160){
this.left=(_160.left<this.left)?_160.left:this.left;
this.bottom=(_160.bottom<this.bottom)?_160.bottom:this.bottom;
this.right=(_160.right>this.right)?_160.right:this.right;
this.top=(_160.top>this.top)?_160.top:this.top;
}
}
},containsLonLat:function(ll,_162){
return this.contains(ll.lon,ll.lat,_162);
},containsPixel:function(px,_164){
return this.contains(px.x,px.y,_164);
},contains:function(x,y,_167){
if(_167==null){
_167=true;
}
var _168=false;
if(_167){
_168=((x>=this.left)&&(x<=this.right)&&(y>=this.bottom)&&(y<=this.top));
}else{
_168=((x>this.left)&&(x<this.right)&&(y>this.bottom)&&(y<this.top));
}
return _168;
},intersectsBounds:function(_169,_16a){
if(_16a==null){
_16a=true;
}
var _16b=(_169.bottom==this.bottom&&_169.top==this.top)?true:(((_169.bottom>this.bottom)&&(_169.bottom<this.top))||((this.bottom>_169.bottom)&&(this.bottom<_169.top)));
var _16c=(_169.bottom==this.bottom&&_169.top==this.top)?true:(((_169.top>this.bottom)&&(_169.top<this.top))||((this.top>_169.bottom)&&(this.top<_169.top)));
var _16d=(_169.right==this.right&&_169.left==this.left)?true:(((_169.right>this.left)&&(_169.right<this.right))||((this.right>_169.left)&&(this.right<_169.right)));
var _16e=(_169.right==this.right&&_169.left==this.left)?true:(((_169.left>this.left)&&(_169.left<this.right))||((this.left>_169.left)&&(this.left<_169.right)));
return (this.containsBounds(_169,true,_16a)||_169.containsBounds(this,true,_16a)||((_16c||_16b)&&(_16e||_16d)));
},containsBounds:function(_16f,_170,_171){
if(_170==null){
_170=false;
}
if(_171==null){
_171=true;
}
var _172;
var _173;
var _174;
var _175;
if(_171){
_172=(_16f.left>=this.left)&&(_16f.left<=this.right);
_173=(_16f.top>=this.bottom)&&(_16f.top<=this.top);
_174=(_16f.right>=this.left)&&(_16f.right<=this.right);
_175=(_16f.bottom>=this.bottom)&&(_16f.bottom<=this.top);
}else{
_172=(_16f.left>this.left)&&(_16f.left<this.right);
_173=(_16f.top>this.bottom)&&(_16f.top<this.top);
_174=(_16f.right>this.left)&&(_16f.right<this.right);
_175=(_16f.bottom>this.bottom)&&(_16f.bottom<this.top);
}
return (_170)?(_173||_175)&&(_172||_174):(_173&&_172&&_175&&_174);
},determineQuadrant:function(_176){
var _177="";
var _178=this.getCenterLonLat();
_177+=(_176.lat<_178.lat)?"b":"t";
_177+=(_176.lon<_178.lon)?"l":"r";
return _177;
},wrapDateLine:function(_179,_17a){
_17a=_17a||{};
var _17b=_17a.leftTolerance||0;
var _17c=_17a.rightTolerance||0;
var _17d=this.clone();
if(_179){
while(_17d.left<_179.left&&(_17d.right-_17c)<=_179.left){
_17d=_17d.add(_179.getWidth(),0);
}
while((_17d.left+_17b)>=_179.right&&_17d.right>_179.right){
_17d=_17d.add(-_179.getWidth(),0);
}
}
return _17d;
},CLASS_NAME:"OpenLayers.Bounds"});
OpenLayers.Bounds.fromString=function(str){
var _17f=str.split(",");
return OpenLayers.Bounds.fromArray(_17f);
};
OpenLayers.Bounds.fromArray=function(bbox){
return new OpenLayers.Bounds(parseFloat(bbox[0]),parseFloat(bbox[1]),parseFloat(bbox[2]),parseFloat(bbox[3]));
};
OpenLayers.Bounds.fromSize=function(size){
return new OpenLayers.Bounds(0,size.h,size.w,0);
};
OpenLayers.Bounds.oppositeQuadrant=function(_182){
var opp="";
opp+=(_182.charAt(0)=="t")?"b":"t";
opp+=(_182.charAt(1)=="l")?"r":"l";
return opp;
};
OpenLayers.Element={visible:function(_184){
return OpenLayers.Util.getElement(_184).style.display!="none";
},toggle:function(){
for(var i=0;i<arguments.length;i++){
var _186=OpenLayers.Util.getElement(arguments[i]);
var _187=OpenLayers.Element.visible(_186)?"hide":"show";
OpenLayers.Element[_187](_186);
}
},hide:function(){
for(var i=0;i<arguments.length;i++){
var _189=OpenLayers.Util.getElement(arguments[i]);
_189.style.display="none";
}
},show:function(){
for(var i=0;i<arguments.length;i++){
var _18b=OpenLayers.Util.getElement(arguments[i]);
_18b.style.display="";
}
},remove:function(_18c){
_18c=OpenLayers.Util.getElement(_18c);
_18c.parentNode.removeChild(_18c);
},getHeight:function(_18d){
_18d=OpenLayers.Util.getElement(_18d);
return _18d.offsetHeight;
},getDimensions:function(_18e){
_18e=OpenLayers.Util.getElement(_18e);
if(OpenLayers.Element.getStyle(_18e,"display")!="none"){
return {width:_18e.offsetWidth,height:_18e.offsetHeight};
}
var els=_18e.style;
var _190=els.visibility;
var _191=els.position;
els.visibility="hidden";
els.position="absolute";
els.display="";
var _192=_18e.clientWidth;
var _193=_18e.clientHeight;
els.display="none";
els.position=_191;
els.visibility=_190;
return {width:_192,height:_193};
},getStyle:function(_194,_195){
_194=OpenLayers.Util.getElement(_194);
var _196=_194.style[_195.camelize()];
if(!_196){
if(document.defaultView&&document.defaultView.getComputedStyle){
var css=document.defaultView.getComputedStyle(_194,null);
_196=css?css.getPropertyValue(_195):null;
}else{
if(_194.currentStyle){
_196=_194.currentStyle[_195.camelize()];
}
}
}
var _198=["left","top","right","bottom"];
if(window.opera&&(OpenLayers.Util.indexOf(_198,_195)!=-1)&&(OpenLayers.Element.getStyle(_194,"position")=="static")){
_196="auto";
}
return _196=="auto"?null:_196;
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
var _19f=false;
if(ll!=null){
_19f=((this.lon==ll.lon&&this.lat==ll.lat)||(isNaN(this.lon)&&isNaN(this.lat)&&isNaN(ll.lon)&&isNaN(ll.lat)));
}
return _19f;
},wrapDateLine:function(_1a0){
var _1a1=this.clone();
if(_1a0){
while(_1a1.lon<_1a0.left){
_1a1.lon+=_1a0.getWidth();
}
while(_1a1.lon>_1a0.right){
_1a1.lon-=_1a0.getWidth();
}
}
return _1a1;
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
var _1a7=false;
if(px!=null){
_1a7=((this.x==px.x&&this.y==px.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(px.x)&&isNaN(px.y)));
}
return _1a7;
},add:function(x,y){
if((x==null)||(y==null)){
var msg="You must pass both x and y values to the add function.";
OpenLayers.Console.error(msg);
return null;
}
return new OpenLayers.Pixel(this.x+x,this.y+y);
},offset:function(px){
var _1ac=this.clone();
if(px){
_1ac=this.add(px.x,px.y);
}
return _1ac;
},CLASS_NAME:"OpenLayers.Pixel"});
OpenLayers.Size=OpenLayers.Class({w:0,h:0,initialize:function(w,h){
this.w=parseFloat(w);
this.h=parseFloat(h);
},toString:function(){
return ("w="+this.w+",h="+this.h);
},clone:function(){
return new OpenLayers.Size(this.w,this.h);
},equals:function(sz){
var _1b0=false;
if(sz!=null){
_1b0=((this.w==sz.w&&this.h==sz.h)||(isNaN(this.w)&&isNaN(this.h)&&isNaN(sz.w)&&isNaN(sz.h)));
}
return _1b0;
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
var _1b1=document.getElementsByTagName("script");
for(var i=0;i<_1b1.length;++i){
if(_1b1[i].src.indexOf("firebug.js")!=-1){
OpenLayers.Util.extend(OpenLayers.Console,console);
break;
}
}
}
})();
OpenLayers.Control=OpenLayers.Class({id:null,map:null,div:null,type:null,displayClass:"",active:null,handler:null,initialize:function(_1b3){
this.displayClass=this.CLASS_NAME.replace("OpenLayers.","ol").replace(/\./g,"");
OpenLayers.Util.extend(this,_1b3);
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
OpenLayers.Icon=OpenLayers.Class({url:null,size:null,offset:null,calculateOffset:null,imageDiv:null,px:null,initialize:function(url,size,_1b9,_1ba){
this.url=url;
this.size=(size)?size:new OpenLayers.Size(20,20);
this.offset=_1b9?_1b9:new OpenLayers.Pixel(-(this.size.w/2),-(this.size.h/2));
this.calculateOffset=_1ba;
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
},setOpacity:function(_1be){
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,null,null,null,null,null,_1be);
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
var _1c0=this.px.offset(this.offset);
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,_1c0);
}
}
},display:function(_1c1){
this.imageDiv.style.display=(_1c1)?"":"none";
},CLASS_NAME:"OpenLayers.Icon"});
OpenLayers.Popup=OpenLayers.Class({events:null,id:"",lonlat:null,div:null,size:null,contentHTML:"",backgroundColor:"",opacity:"",border:"",contentDiv:null,groupDiv:null,padding:5,map:null,initialize:function(id,_1c3,size,_1c5,_1c6){
if(id==null){
id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
}
this.id=id;
this.lonlat=_1c3;
this.size=(size!=null)?size:new OpenLayers.Size(OpenLayers.Popup.WIDTH,OpenLayers.Popup.HEIGHT);
if(_1c5!=null){
this.contentHTML=_1c5;
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
if(_1c6==true){
var _1c7=new OpenLayers.Size(17,17);
var img=OpenLayers.Util.getImagesLocation()+"close.gif";
var _1c9=OpenLayers.Util.createAlphaImageDiv(this.id+"_close",null,_1c7,img);
_1c9.style.right=this.padding+"px";
_1c9.style.top=this.padding+"px";
this.groupDiv.appendChild(_1c9);
var _1ca=function(e){
this.hide();
OpenLayers.Event.stop(e);
};
OpenLayers.Event.observe(_1c9,"click",_1ca.bindAsEventListener(this));
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
this.moveTo(px);
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
},setBackgroundColor:function(_1d0){
if(_1d0!=undefined){
this.backgroundColor=_1d0;
}
if(this.div!=null){
this.div.style.backgroundColor=this.backgroundColor;
}
},setOpacity:function(_1d1){
if(_1d1!=undefined){
this.opacity=_1d1;
}
if(this.div!=null){
this.div.style.opacity=this.opacity;
this.div.style.filter="alpha(opacity="+this.opacity*100+")";
}
},setBorder:function(_1d2){
if(_1d2!=undefined){
this.border=_1d2;
}
if(this.div!=null){
this.div.style.border=this.border;
}
},setContentHTML:function(_1d3){
if(_1d3!=null){
this.contentHTML=_1d3;
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
OpenLayers.Renderer=OpenLayers.Class({container:null,extent:null,size:null,resolution:null,map:null,initialize:function(_1da){
this.container=OpenLayers.Util.getElement(_1da);
},destroy:function(){
this.container=null;
this.extent=null;
this.size=null;
this.resolution=null;
this.map=null;
},supported:function(){
return false;
},setExtent:function(_1db){
this.extent=_1db.clone();
this.resolution=null;
},setSize:function(size){
this.size=size.clone();
this.resolution=null;
},getResolution:function(){
this.resolution=this.resolution||this.map.getResolution();
return this.resolution;
},drawFeature:function(_1dd,_1de){
if(_1de==null){
_1de=_1dd.style;
}
this.drawGeometry(_1dd.geometry,_1de,_1dd.id);
},drawGeometry:function(_1df,_1e0,_1e1){
},clear:function(){
},getFeatureIdFromEvent:function(evt){
},eraseFeatures:function(_1e3){
if(!(_1e3 instanceof Array)){
_1e3=[_1e3];
}
for(var i=0;i<_1e3.length;++i){
this.eraseGeometry(_1e3[i].geometry);
}
},eraseGeometry:function(_1e5){
},CLASS_NAME:"OpenLayers.Renderer"});
OpenLayers.Rico.Color=OpenLayers.Class({initialize:function(red,_1e7,blue){
this.rgb={r:red,g:_1e7,b:blue};
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
},darken:function(_1f2){
var hsb=this.asHSB();
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,Math.max(hsb.b-_1f2,0));
},brighten:function(_1f4){
var hsb=this.asHSB();
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,Math.min(hsb.b+_1f4,1));
},blend:function(_1f6){
this.rgb.r=Math.floor((this.rgb.r+_1f6.rgb.r)/2);
this.rgb.g=Math.floor((this.rgb.g+_1f6.rgb.g)/2);
this.rgb.b=Math.floor((this.rgb.b+_1f6.rgb.b)/2);
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
OpenLayers.Rico.Color.createFromHex=function(_1f8){
if(_1f8.length==4){
var _1f9=_1f8;
var _1f8="#";
for(var i=1;i<4;i++){
_1f8+=(_1f9.charAt(i)+_1f9.charAt(i));
}
}
if(_1f8.indexOf("#")==0){
_1f8=_1f8.substring(1);
}
var red=_1f8.substring(0,2);
var _1fc=_1f8.substring(2,4);
var blue=_1f8.substring(4,6);
return new OpenLayers.Rico.Color(parseInt(red,16),parseInt(_1fc,16),parseInt(blue,16));
};
OpenLayers.Rico.Color.createColorFromBackground=function(elem){
var _1ff=RicoUtil.getElementsComputedStyle(OpenLayers.Util.getElement(elem),"backgroundColor","background-color");
if(_1ff=="transparent"&&elem.parentNode){
return OpenLayers.Rico.Color.createColorFromBackground(elem.parentNode);
}
if(_1ff==null){
return new OpenLayers.Rico.Color(255,255,255);
}
if(_1ff.indexOf("rgb(")==0){
var _200=_1ff.substring(4,_1ff.length-1);
var _201=_200.split(",");
return new OpenLayers.Rico.Color(parseInt(_201[0]),parseInt(_201[1]),parseInt(_201[2]));
}else{
if(_1ff.indexOf("#")==0){
return OpenLayers.Rico.Color.createFromHex(_1ff);
}else{
return new OpenLayers.Rico.Color(255,255,255);
}
}
};
OpenLayers.Rico.Color.HSBtoRGB=function(hue,_203,_204){
var red=0;
var _206=0;
var blue=0;
if(_203==0){
red=parseInt(_204*255+0.5);
_206=red;
blue=red;
}else{
var h=(hue-Math.floor(hue))*6;
var f=h-Math.floor(h);
var p=_204*(1-_203);
var q=_204*(1-_203*f);
var t=_204*(1-(_203*(1-f)));
switch(parseInt(h)){
case 0:
red=(_204*255+0.5);
_206=(t*255+0.5);
blue=(p*255+0.5);
break;
case 1:
red=(q*255+0.5);
_206=(_204*255+0.5);
blue=(p*255+0.5);
break;
case 2:
red=(p*255+0.5);
_206=(_204*255+0.5);
blue=(t*255+0.5);
break;
case 3:
red=(p*255+0.5);
_206=(q*255+0.5);
blue=(_204*255+0.5);
break;
case 4:
red=(t*255+0.5);
_206=(p*255+0.5);
blue=(_204*255+0.5);
break;
case 5:
red=(_204*255+0.5);
_206=(p*255+0.5);
blue=(q*255+0.5);
break;
}
}
return {r:parseInt(red),g:parseInt(_206),b:parseInt(blue)};
};
OpenLayers.Rico.Color.RGBtoHSB=function(r,g,b){
var hue;
var _211;
var _212;
var cmax=(r>g)?r:g;
if(b>cmax){
cmax=b;
}
var cmin=(r<g)?r:g;
if(b<cmin){
cmin=b;
}
_212=cmax/255;
if(cmax!=0){
_211=(cmax-cmin)/cmax;
}else{
_211=0;
}
if(_211==0){
hue=0;
}else{
var redc=(cmax-r)/(cmax-cmin);
var _216=(cmax-g)/(cmax-cmin);
var _217=(cmax-b)/(cmax-cmin);
if(r==cmax){
hue=_217-_216;
}else{
if(g==cmax){
hue=2+redc-_217;
}else{
hue=4+_216-redc;
}
}
hue=hue/6;
if(hue<0){
hue=hue+1;
}
}
return {h:hue,s:_211,b:_212};
};
var hexcase=0;
var b64pad="";
var chrsz=8;
function hex_md5(s){
return binl2hex(core_md5(str2binl(s),s.length*chrsz));
}
function b64_md5(s){
return binl2b64(core_md5(str2binl(s),s.length*chrsz));
}
function str_md5(s){
return binl2str(core_md5(str2binl(s),s.length*chrsz));
}
function hex_hmac_md5(key,data){
return binl2hex(core_hmac_md5(key,data));
}
function b64_hmac_md5(key,data){
return binl2b64(core_hmac_md5(key,data));
}
function str_hmac_md5(key,data){
return binl2str(core_hmac_md5(key,data));
}
function md5_vm_test(){
return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72";
}
function core_md5(x,len){
x[len>>5]|=128<<((len)%32);
x[(((len+64)>>>9)<<4)+14]=len;
var a=1732584193;
var b=-271733879;
var c=-1732584194;
var d=271733878;
for(var i=0;i<x.length;i+=16){
var olda=a;
var oldb=b;
var oldc=c;
var oldd=d;
a=md5_ff(a,b,c,d,x[i+0],7,-680876936);
d=md5_ff(d,a,b,c,x[i+1],12,-389564586);
c=md5_ff(c,d,a,b,x[i+2],17,606105819);
b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);
a=md5_ff(a,b,c,d,x[i+4],7,-176418897);
d=md5_ff(d,a,b,c,x[i+5],12,1200080426);
c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);
b=md5_ff(b,c,d,a,x[i+7],22,-45705983);
a=md5_ff(a,b,c,d,x[i+8],7,1770035416);
d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);
c=md5_ff(c,d,a,b,x[i+10],17,-42063);
b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);
a=md5_ff(a,b,c,d,x[i+12],7,1804603682);
d=md5_ff(d,a,b,c,x[i+13],12,-40341101);
c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);
b=md5_ff(b,c,d,a,x[i+15],22,1236535329);
a=md5_gg(a,b,c,d,x[i+1],5,-165796510);
d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);
c=md5_gg(c,d,a,b,x[i+11],14,643717713);
b=md5_gg(b,c,d,a,x[i+0],20,-373897302);
a=md5_gg(a,b,c,d,x[i+5],5,-701558691);
d=md5_gg(d,a,b,c,x[i+10],9,38016083);
c=md5_gg(c,d,a,b,x[i+15],14,-660478335);
b=md5_gg(b,c,d,a,x[i+4],20,-405537848);
a=md5_gg(a,b,c,d,x[i+9],5,568446438);
d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);
c=md5_gg(c,d,a,b,x[i+3],14,-187363961);
b=md5_gg(b,c,d,a,x[i+8],20,1163531501);
a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);
d=md5_gg(d,a,b,c,x[i+2],9,-51403784);
c=md5_gg(c,d,a,b,x[i+7],14,1735328473);
b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);
a=md5_hh(a,b,c,d,x[i+5],4,-378558);
d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);
c=md5_hh(c,d,a,b,x[i+11],16,1839030562);
b=md5_hh(b,c,d,a,x[i+14],23,-35309556);
a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);
d=md5_hh(d,a,b,c,x[i+4],11,1272893353);
c=md5_hh(c,d,a,b,x[i+7],16,-155497632);
b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);
a=md5_hh(a,b,c,d,x[i+13],4,681279174);
d=md5_hh(d,a,b,c,x[i+0],11,-358537222);
c=md5_hh(c,d,a,b,x[i+3],16,-722521979);
b=md5_hh(b,c,d,a,x[i+6],23,76029189);
a=md5_hh(a,b,c,d,x[i+9],4,-640364487);
d=md5_hh(d,a,b,c,x[i+12],11,-421815835);
c=md5_hh(c,d,a,b,x[i+15],16,530742520);
b=md5_hh(b,c,d,a,x[i+2],23,-995338651);
a=md5_ii(a,b,c,d,x[i+0],6,-198630844);
d=md5_ii(d,a,b,c,x[i+7],10,1126891415);
c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);
b=md5_ii(b,c,d,a,x[i+5],21,-57434055);
a=md5_ii(a,b,c,d,x[i+12],6,1700485571);
d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);
c=md5_ii(c,d,a,b,x[i+10],15,-1051523);
b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);
a=md5_ii(a,b,c,d,x[i+8],6,1873313359);
d=md5_ii(d,a,b,c,x[i+15],10,-30611744);
c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);
b=md5_ii(b,c,d,a,x[i+13],21,1309151649);
a=md5_ii(a,b,c,d,x[i+4],6,-145523070);
d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);
c=md5_ii(c,d,a,b,x[i+2],15,718787259);
b=md5_ii(b,c,d,a,x[i+9],21,-343485551);
a=safe_add(a,olda);
b=safe_add(b,oldb);
c=safe_add(c,oldc);
d=safe_add(d,oldd);
}
return Array(a,b,c,d);
}
function md5_cmn(q,a,b,x,s,t){
return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);
}
function md5_ff(a,b,c,d,x,s,t){
return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);
}
function md5_gg(a,b,c,d,x,s,t){
return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);
}
function md5_hh(a,b,c,d,x,s,t){
return md5_cmn(b^c^d,a,b,x,s,t);
}
function md5_ii(a,b,c,d,x,s,t){
return md5_cmn(c^(b|(~d)),a,b,x,s,t);
}
function core_hmac_md5(key,data){
var bkey=str2binl(key);
if(bkey.length>16){
bkey=core_md5(bkey,key.length*chrsz);
}
var ipad=Array(16),opad=Array(16);
for(var i=0;i<16;i++){
ipad[i]=bkey[i]^909522486;
opad[i]=bkey[i]^1549556828;
}
var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);
return core_md5(opad.concat(hash),512+128);
}
function safe_add(x,y){
var lsw=(x&65535)+(y&65535);
var msw=(x>>16)+(y>>16)+(lsw>>16);
return (msw<<16)|(lsw&65535);
}
function bit_rol(num,cnt){
return (num<<cnt)|(num>>>(32-cnt));
}
function str2binl(str){
var bin=Array();
var mask=(1<<chrsz)-1;
for(var i=0;i<str.length*chrsz;i+=chrsz){
bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32);
}
return bin;
}
function binl2str(bin){
var str="";
var mask=(1<<chrsz)-1;
for(var i=0;i<bin.length*32;i+=chrsz){
str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask);
}
return str;
}
function binl2hex(_262){
var _263=hexcase?"0123456789ABCDEF":"0123456789abcdef";
var str="";
for(var i=0;i<_262.length*4;i++){
str+=_263.charAt((_262[i>>2]>>((i%4)*8+4))&15)+_263.charAt((_262[i>>2]>>((i%4)*8))&15);
}
return str;
}
function binl2b64(_266){
var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var str="";
for(var i=0;i<_266.length*4;i+=3){
var _26a=(((_266[i>>2]>>8*(i%4))&255)<<16)|(((_266[i+1>>2]>>8*((i+1)%4))&255)<<8)|((_266[i+2>>2]>>8*((i+2)%4))&255);
for(var j=0;j<4;j++){
if(i*8+j*6>_266.length*32){
str+=b64pad;
}else{
str+=tab.charAt((_26a>>6*(3-j))&63);
}
}
}
return str;
}
OpenLayers.Control.ArgParser=OpenLayers.Class(OpenLayers.Control,{center:null,zoom:null,layers:null,initialize:function(_26c){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},setMap:function(map){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
for(var i=0;i<this.map.controls.length;i++){
var _26f=this.map.controls[i];
if((_26f!=this)&&(_26f.CLASS_NAME=="OpenLayers.Control.ArgParser")){
break;
}
}
if(i==this.map.controls.length){
var args=OpenLayers.Util.getArgs();
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
var _272=this.map.layers[i];
var c=this.layers.charAt(i);
if(c=="B"){
this.map.setBaseLayer(_272);
}else{
if((c=="T")||(c=="F")){
_272.setVisibility(c=="T");
}
}
}
}
},CLASS_NAME:"OpenLayers.Control.ArgParser"});
OpenLayers.Control.LayerSwitcher=OpenLayers.Class(OpenLayers.Control,{activeColor:"darkblue",layersDiv:null,baseLayersDiv:null,baseLayers:null,dataLbl:null,dataLayersDiv:null,dataLayers:null,minimizeDiv:null,maximizeDiv:null,ascending:true,initialize:function(_274){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
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
},clearLayersArray:function(_276){
var _277=this[_276+"Layers"];
if(_277){
for(var i=0;i<_277.length;i++){
var _279=_277[i];
OpenLayers.Event.stopObservingElement(_279.inputElem);
OpenLayers.Event.stopObservingElement(_279.labelSpan);
}
}
this[_276+"LayersDiv"].innerHTML="";
this[_276+"Layers"]=[];
},redraw:function(){
this.clearLayersArray("base");
this.clearLayersArray("data");
var _27a=false;
var _27b=false;
var _27c=this.map.layers.slice();
if(!this.ascending){
_27c.reverse();
}
for(var i=0;i<_27c.length;i++){
var _27e=_27c[i];
var _27f=_27e.isBaseLayer;
if(_27e.displayInLayerSwitcher){
if(_27f){
_27b=true;
}else{
_27a=true;
}
var _280=(_27f)?(_27e==this.map.baseLayer):_27e.getVisibility();
var _281=document.createElement("input");
_281.id="input_"+_27e.name;
_281.name=(_27f)?"baseLayers":_27e.name;
_281.type=(_27f)?"radio":"checkbox";
_281.value=_27e.name;
_281.checked=_280;
_281.defaultChecked=_280;
if(!_27f&&!_27e.inRange){
_281.disabled=true;
}
var _282={"inputElem":_281,"layer":_27e,"layerSwitcher":this};
OpenLayers.Event.observe(_281,"mouseup",this.onInputClick.bindAsEventListener(_282));
var _283=document.createElement("span");
if(!_27f&&!_27e.inRange){
_283.style.color="gray";
}
_283.innerHTML=_27e.name;
_283.style.verticalAlign=(_27f)?"bottom":"baseline";
OpenLayers.Event.observe(_283,"click",this.onInputClick.bindAsEventListener(_282));
var br=document.createElement("br");
var _285=(_27f)?this.baseLayers:this.dataLayers;
_285.push({"layer":_27e,"inputElem":_281,"labelSpan":_283});
var _286=(_27f)?this.baseLayersDiv:this.dataLayersDiv;
_286.appendChild(_281);
_286.appendChild(_283);
_286.appendChild(br);
}
}
this.dataLbl.style.display=(_27a)?"":"none";
this.baseLbl.style.display=(_27b)?"":"none";
return this.div;
},onInputClick:function(e){
if(!this.inputElem.disabled){
if(this.inputElem.type=="radio"){
this.inputElem.checked=true;
this.layer.map.setBaseLayer(this.layer,true);
this.layer.map.events.triggerEvent("changebaselayer");
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
var _28a=this.baseLayers[i];
if(_28a.inputElem.checked){
this.map.setBaseLayer(_28a.layer,false);
}
}
for(var i=0;i<this.dataLayers.length;i++){
var _28a=this.dataLayers[i];
_28a.layer.setVisibility(_28a.inputElem.checked,true);
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
},showControls:function(_28d){
this.maximizeDiv.style.display=_28d?"":"none";
this.minimizeDiv.style.display=_28d?"none":"";
this.layersDiv.style.display=_28d?"none":"";
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
OpenLayers.Event.observe(this.div,"mouseup",this.mouseUp.bindAsEventListener(this));
OpenLayers.Event.observe(this.div,"click",this.ignoreEvent);
OpenLayers.Event.observe(this.div,"mousedown",this.mouseDown.bindAsEventListener(this));
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
var _28e=OpenLayers.Util.getImagesLocation();
var sz=new OpenLayers.Size(18,18);
var img=_28e+"layer-switcher-maximize.png";
this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MaximizeDiv",null,sz,img,"absolute");
this.maximizeDiv.style.top="5px";
this.maximizeDiv.style.right="0px";
this.maximizeDiv.style.left="";
this.maximizeDiv.style.display="none";
OpenLayers.Event.observe(this.maximizeDiv,"click",this.maximizeControl.bindAsEventListener(this));
this.div.appendChild(this.maximizeDiv);
var img=_28e+"layer-switcher-minimize.png";
var sz=new OpenLayers.Size(18,18);
this.minimizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MinimizeDiv",null,sz,img,"absolute");
this.minimizeDiv.style.top="5px";
this.minimizeDiv.style.right="0px";
this.minimizeDiv.style.left="";
this.minimizeDiv.style.display="none";
OpenLayers.Event.observe(this.minimizeDiv,"click",this.minimizeControl.bindAsEventListener(this));
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
this.wheelObserver=this.onWheelEvent.bindAsEventListener(this);
OpenLayers.Event.observe(window,"DOMMouseScroll",this.wheelObserver);
OpenLayers.Event.observe(window,"mousewheel",this.wheelObserver);
OpenLayers.Event.observe(document,"mousewheel",this.wheelObserver);
},defaultClick:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
var _295=!this.performedDrag;
this.performedDrag=false;
return _295;
},defaultDblClick:function(evt){
var _297=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_297,this.map.zoom+1);
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
var _29a=Math.abs(this.mouseDragStart.x-evt.xy.x);
var _29b=Math.abs(this.mouseDragStart.y-evt.xy.y);
this.zoomBox.style.width=Math.max(1,_29a)+"px";
this.zoomBox.style.height=Math.max(1,_29b)+"px";
if(evt.xy.x<this.mouseDragStart.x){
this.zoomBox.style.left=evt.xy.x+"px";
}
if(evt.xy.y<this.mouseDragStart.y){
this.zoomBox.style.top=evt.xy.y+"px";
}
}else{
var _29a=this.mouseDragStart.x-evt.xy.x;
var _29b=this.mouseDragStart.y-evt.xy.y;
var size=this.map.getSize();
var _29d=new OpenLayers.Pixel(size.w/2+_29a,size.h/2+_29b);
var _29e=this.map.getLonLatFromViewPortPx(_29d);
this.map.setCenter(_29e,null,true);
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
var _2a4=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
var end=this.map.getLonLatFromViewPortPx(evt.xy);
var top=Math.max(_2a4.lat,end.lat);
var _2a7=Math.min(_2a4.lat,end.lat);
var left=Math.min(_2a4.lon,end.lon);
var _2a9=Math.max(_2a4.lon,end.lon);
var _2aa=new OpenLayers.Bounds(left,_2a7,_2a9,top);
this.map.zoomToExtent(_2aa);
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
var _2ac=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_2ac=true;
break;
}
elem=elem.parentNode;
}
if(_2ac){
var _2ae=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_2ae=e.wheelDelta/120;
if(window.opera){
_2ae=-_2ae;
}
}else{
if(e.detail){
_2ae=-e.detail/3;
}
}
if(_2ae){
e.xy=this.mousePosition;
if(_2ae<0){
this.defaultWheelDown(e);
}else{
this.defaultWheelUp(e);
}
}
OpenLayers.Event.stop(e);
}
},CLASS_NAME:"OpenLayers.Control.MouseDefaults"});
OpenLayers.Control.MousePosition=OpenLayers.Class(OpenLayers.Control,{element:null,prefix:"",separator:", ",suffix:"",numdigits:5,granularity:10,lastXy:null,initialize:function(_2af){
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
var _2b1;
if(evt==null){
_2b1=new OpenLayers.LonLat(0,0);
}else{
if(this.lastXy==null||Math.abs(evt.xy.x-this.lastXy.x)>this.granularity||Math.abs(evt.xy.y-this.lastXy.y)>this.granularity){
this.lastXy=evt.xy;
return;
}
_2b1=this.map.getLonLatFromPixel(evt.xy);
this.lastXy=evt.xy;
}
var _2b2=parseInt(this.numdigits);
var _2b3=this.prefix+_2b1.lon.toFixed(_2b2)+this.separator+_2b1.lat.toFixed(_2b2)+this.suffix;
if(_2b3!=this.element.innerHTML){
this.element.innerHTML=_2b3;
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
var _2b7=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
this._addButton("panup","north-mini.png",_2b7,sz);
px.y=_2b7.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
this._addButton("panright","east-mini.png",px.add(sz.w,0),sz);
this._addButton("pandown","south-mini.png",_2b7.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_2b7.add(0,sz.h*3+5),sz);
this._addButton("zoomworld","zoom-world-mini.png",_2b7.add(0,sz.h*4+5),sz);
this._addButton("zoomout","zoom-minus-mini.png",_2b7.add(0,sz.h*5+5),sz);
return this.div;
},_addButton:function(id,img,xy,sz){
var _2bc=OpenLayers.Util.getImagesLocation()+img;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_PanZoom_"+id,xy,sz,_2bc,"absolute");
this.div.appendChild(btn);
OpenLayers.Event.observe(btn,"mousedown",this.buttonDown.bindAsEventListener(btn));
OpenLayers.Event.observe(btn,"dblclick",this.doubleClick.bindAsEventListener(btn));
OpenLayers.Event.observe(btn,"click",this.doubleClick.bindAsEventListener(btn));
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
OpenLayers.Control.Panel=OpenLayers.Class(OpenLayers.Control,{controls:null,defaultControl:null,initialize:function(_2c0){
OpenLayers.Control.prototype.initialize.apply(this,[_2c0]);
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
var _2c6=this.controls[i].panel_div;
if(this.controls[i].active){
_2c6.className=this.controls[i].displayClass+"ItemActive";
}else{
_2c6.className=this.controls[i].displayClass+"ItemInactive";
}
this.div.appendChild(_2c6);
}
}
},activateControl:function(_2c7){
if(!this.active){
return false;
}
if(_2c7.type==OpenLayers.Control.TYPE_BUTTON){
_2c7.trigger();
return;
}
if(_2c7.type==OpenLayers.Control.TYPE_TOGGLE){
if(_2c7.active){
_2c7.deactivate();
}else{
_2c7.activate();
}
return;
}
for(var i=0;i<this.controls.length;i++){
if(this.controls[i]==_2c7){
_2c7.activate();
}else{
if(this.controls[i].type!=OpenLayers.Control.TYPE_TOGGLE){
this.controls[i].deactivate();
}
}
}
this.redraw();
},addControls:function(_2c9){
if(!(_2c9 instanceof Array)){
_2c9=[_2c9];
}
this.controls=this.controls.concat(_2c9);
for(var i=0;i<_2c9.length;i++){
var _2cb=document.createElement("div");
var _2cc=document.createTextNode(" ");
_2c9[i].panel_div=_2cb;
OpenLayers.Event.observe(_2c9[i].panel_div,"click",this.onClick.bind(this,_2c9[i]));
OpenLayers.Event.observe(_2c9[i].panel_div,"mousedown",OpenLayers.Event.stop.bindAsEventListener());
}
if(this.map){
for(var i=0;i<_2c9.length;i++){
this.map.addControl(_2c9[i]);
_2c9[i].deactivate();
}
this.redraw();
}
},onClick:function(ctrl,evt){
OpenLayers.Event.stop(evt?evt:window.event);
this.activateControl(ctrl);
},CLASS_NAME:"OpenLayers.Control.Panel"});
OpenLayers.Control.Permalink=OpenLayers.Class(OpenLayers.Control,{element:null,base:"",initialize:function(_2cf,base){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.element=OpenLayers.Util.getElement(_2cf);
if(base){
this.base=base;
}
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
var _2d3=this.map.controls[i];
if(_2d3.CLASS_NAME=="OpenLayers.Control.ArgParser"){
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
return this.div;
},updateLink:function(){
var _2d4=this.map.getCenter();
var zoom="zoom="+this.map.getZoom();
var lat="lat="+Math.round(_2d4.lat*100000)/100000;
var lon="lon="+Math.round(_2d4.lon*100000)/100000;
var _2d8="layers=";
for(var i=0;i<this.map.layers.length;i++){
var _2da=this.map.layers[i];
if(_2da.isBaseLayer){
_2d8+=(_2da==this.map.baseLayer)?"B":"0";
}else{
_2d8+=(_2da.getVisibility())?"T":"F";
}
}
var href=this.base+"?"+lat+"&"+lon+"&"+zoom+"&"+_2d8;
this.element.href=href;
},CLASS_NAME:"OpenLayers.Control.Permalink"});
OpenLayers.Control.Scale=OpenLayers.Class(OpenLayers.Control,{element:null,initialize:function(_2dc){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.element=OpenLayers.Util.getElement(_2dc);
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
var _2dd=this.map.getScale();
if(!_2dd){
return;
}
if(_2dd>=9500&&_2dd<=950000){
_2dd=Math.round(_2dd/1000)+"K";
}else{
if(_2dd>=950000){
_2dd=Math.round(_2dd/1000000)+"M";
}else{
_2dd=Math.round(_2dd);
}
}
this.element.innerHTML="Scale = 1 : "+_2dd;
},CLASS_NAME:"OpenLayers.Control.Scale"});
OpenLayers.Control.ZoomToMaxExtent=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
if(this.map){
this.map.zoomToMaxExtent();
}
},CLASS_NAME:"OpenLayers.Control.ZoomToMaxExtent"});
OpenLayers.Event={observers:false,KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,element:function(_2de){
return _2de.target||_2de.srcElement;
},isLeftClick:function(_2df){
return (((_2df.which)&&(_2df.which==1))||((_2df.button)&&(_2df.button==1)));
},stop:function(_2e0,_2e1){
if(!_2e1){
if(_2e0.preventDefault){
_2e0.preventDefault();
}else{
_2e0.returnValue=false;
}
}
if(_2e0.stopPropagation){
_2e0.stopPropagation();
}else{
_2e0.cancelBubble=true;
}
},findElement:function(_2e2,_2e3){
var _2e4=OpenLayers.Event.element(_2e2);
while(_2e4.parentNode&&(!_2e4.tagName||(_2e4.tagName.toUpperCase()!=_2e3.toUpperCase()))){
_2e4=_2e4.parentNode;
}
return _2e4;
},observe:function(_2e5,name,_2e7,_2e8){
var _2e9=OpenLayers.Util.getElement(_2e5);
_2e8=_2e8||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_2e9.attachEvent)){
name="keydown";
}
if(!this.observers){
this.observers={};
}
if(!_2e9._eventCacheID){
var _2ea="eventCacheID_";
if(_2e9.id){
_2ea=_2e9.id+"_"+_2ea;
}
_2e9._eventCacheID=OpenLayers.Util.createUniqueID(_2ea);
}
var _2eb=_2e9._eventCacheID;
if(!this.observers[_2eb]){
this.observers[_2eb]=[];
}
this.observers[_2eb].push({"element":_2e9,"name":name,"observer":_2e7,"useCapture":_2e8});
if(_2e9.addEventListener){
_2e9.addEventListener(name,_2e7,_2e8);
}else{
if(_2e9.attachEvent){
_2e9.attachEvent("on"+name,_2e7);
}
}
},stopObservingElement:function(_2ec){
var _2ed=OpenLayers.Util.getElement(_2ec);
var _2ee=_2ed._eventCacheID;
this._removeElementObservers(OpenLayers.Event.observers[_2ee]);
},_removeElementObservers:function(_2ef){
if(_2ef){
for(var i=_2ef.length-1;i>=0;i--){
var _2f1=_2ef[i];
var args=new Array(_2f1.element,_2f1.name,_2f1.observer,_2f1.useCapture);
var _2f3=OpenLayers.Event.stopObserving.apply(this,args);
}
}
},stopObserving:function(_2f4,name,_2f6,_2f7){
_2f7=_2f7||false;
var _2f8=OpenLayers.Util.getElement(_2f4);
var _2f9=_2f8._eventCacheID;
if(name=="keypress"){
if(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_2f8.detachEvent){
name="keydown";
}
}
var _2fa=false;
var _2fb=OpenLayers.Event.observers[_2f9];
if(_2fb){
var i=0;
while(!_2fa&&i<_2fb.length){
var _2fd=_2fb[i];
if((_2fd.name==name)&&(_2fd.observer==_2f6)&&(_2fd.useCapture==_2f7)){
_2fb.splice(i,1);
if(_2fb.length==0){
delete OpenLayers.Event.observers[_2f9];
}
_2fa=true;
break;
}
i++;
}
}
if(_2f8.removeEventListener){
_2f8.removeEventListener(name,_2f6,_2f7);
}else{
if(_2f8&&_2f8.detachEvent){
_2f8.detachEvent("on"+name,_2f6);
}
}
return _2fa;
},unloadCache:function(){
if(OpenLayers.Event.observers){
for(var _2fe in OpenLayers.Event.observers){
var _2ff=OpenLayers.Event.observers[_2fe];
OpenLayers.Event._removeElementObservers.apply(this,[_2ff]);
}
OpenLayers.Event.observers=false;
}
},CLASS_NAME:"OpenLayers.Event"};
OpenLayers.Event.observe(window,"unload",OpenLayers.Event.unloadCache,false);
if(window.Event){
OpenLayers.Util.extend(window.Event,OpenLayers.Event);
}else{
var Event=OpenLayers.Event;
}
OpenLayers.Events=OpenLayers.Class({BROWSER_EVENTS:["mouseover","mouseout","mousedown","mouseup","mousemove","click","dblclick","resize","focus","blur"],listeners:null,object:null,element:null,eventTypes:null,eventHandler:null,fallThrough:null,initialize:function(_300,_301,_302,_303){
this.object=_300;
this.element=_301;
this.eventTypes=_302;
this.fallThrough=_303;
this.listeners={};
this.eventHandler=this.handleBrowserEvent.bindAsEventListener(this);
if(this.eventTypes!=null){
for(var i=0;i<this.eventTypes.length;i++){
this.addEventType(this.eventTypes[i]);
}
}
if(this.element!=null){
this.attachToElement(_301);
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
},addEventType:function(_305){
if(!this.listeners[_305]){
this.listeners[_305]=[];
}
},attachToElement:function(_306){
for(var i=0;i<this.BROWSER_EVENTS.length;i++){
var _308=this.BROWSER_EVENTS[i];
this.addEventType(_308);
OpenLayers.Event.observe(_306,_308,this.eventHandler);
}
OpenLayers.Event.observe(_306,"dragstart",OpenLayers.Event.stop);
},register:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _30c=this.listeners[type];
if(_30c!=null){
_30c.push({obj:obj,func:func});
}
}
},registerPriority:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _310=this.listeners[type];
if(_310!=null){
_310.unshift({obj:obj,func:func});
}
}
},unregister:function(type,obj,func){
if(obj==null){
obj=this.object;
}
var _314=this.listeners[type];
if(_314!=null){
for(var i=0;i<_314.length;i++){
if(_314[i].obj==obj&&_314[i].func==func){
_314.splice(i,1);
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
var _319=(this.listeners[type])?this.listeners[type].slice():null;
if((_319!=null)&&(_319.length>0)){
for(var i=0;i<_319.length;i++){
var _31b=_319[i];
var _31c;
if(_31b.obj!=null){
_31c=_31b.func.call(_31b.obj,evt);
}else{
_31c=_31b.func(evt);
}
if((_31c!=null)&&(_31c==false)){
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
return new OpenLayers.Pixel((evt.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft))-this.element.offsets[0],(evt.clientY+(document.documentElement.scrollTop||document.body.scrollTop))-this.element.offsets[1]);
},CLASS_NAME:"OpenLayers.Events"});
OpenLayers.Format=OpenLayers.Class({initialize:function(_31f){
OpenLayers.Util.extend(this,_31f);
},read:function(data){
alert("Read not implemented.");
},write:function(_321){
alert("Write not implemented.");
},CLASS_NAME:"OpenLayers.Format"});
OpenLayers.Popup.Anchored=OpenLayers.Class(OpenLayers.Popup,{relativePosition:null,anchor:null,initialize:function(id,_323,size,_325,_326,_327){
var _328=new Array(id,_323,size,_325,_327);
OpenLayers.Popup.prototype.initialize.apply(this,_328);
this.anchor=(_326!=null)?_326:{size:new OpenLayers.Size(0,0),offset:new OpenLayers.Pixel(0,0)};
},draw:function(px){
if(px==null){
if((this.lonlat!=null)&&(this.map!=null)){
px=this.map.getLayerPxFromLonLat(this.lonlat);
}
}
this.relativePosition=this.calculateRelativePosition(px);
return OpenLayers.Popup.prototype.draw.apply(this,arguments);
},calculateRelativePosition:function(px){
var _32b=this.map.getLonLatFromLayerPx(px);
var _32c=this.map.getExtent();
var _32d=_32c.determineQuadrant(_32b);
return OpenLayers.Bounds.oppositeQuadrant(_32d);
},moveTo:function(px){
var _32f=this.calculateNewPx(px);
var _330=new Array(_32f);
OpenLayers.Popup.prototype.moveTo.apply(this,_330);
},setSize:function(size){
OpenLayers.Popup.prototype.setSize.apply(this,arguments);
if((this.lonlat)&&(this.map)){
var px=this.map.getLayerPxFromLonLat(this.lonlat);
this.moveTo(px);
}
},calculateNewPx:function(px){
var _334=px.offset(this.anchor.offset);
var top=(this.relativePosition.charAt(0)=="t");
_334.y+=(top)?-this.size.h:this.anchor.size.h;
var left=(this.relativePosition.charAt(1)=="l");
_334.x+=(left)?-this.size.w:this.anchor.size.w;
return _334;
},CLASS_NAME:"OpenLayers.Popup.Anchored"});
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
},getNodeType:function(_338){
},drawGeometry:function(_339,_33a,_33b){
if((_339.CLASS_NAME=="OpenLayers.Geometry.MultiPoint")||(_339.CLASS_NAME=="OpenLayers.Geometry.MultiLineString")||(_339.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_339.components.length;i++){
this.drawGeometry(_339.components[i],_33a,_33b);
}
return;
}
var _33d=this.getNodeType(_339);
var node=this.nodeFactory(_339.id,_33d,_339);
node._featureId=_33b;
node._geometryClass=_339.CLASS_NAME;
node._style=_33a;
this.root.appendChild(node);
this.drawGeometryNode(node,_339);
},drawGeometryNode:function(node,_340,_341){
_341=_341||node._style;
var _342={"isFilled":true,"isStroked":true};
switch(_340.CLASS_NAME){
case "OpenLayers.Geometry.Point":
this.drawPoint(node,_340);
break;
case "OpenLayers.Geometry.LineString":
_342.isFilled=false;
this.drawLineString(node,_340);
break;
case "OpenLayers.Geometry.LinearRing":
this.drawLinearRing(node,_340);
break;
case "OpenLayers.Geometry.Polygon":
this.drawPolygon(node,_340);
break;
case "OpenLayers.Geometry.Surface":
this.drawSurface(node,_340);
break;
case "OpenLayers.Geometry.Rectangle":
this.drawRectangle(node,_340);
break;
default:
break;
}
node._style=_341;
node._options=_342;
this.setStyle(node,_341,_342,_340);
},drawPoint:function(node,_344){
},drawLineString:function(node,_346){
},drawLinearRing:function(node,_348){
},drawPolygon:function(node,_34a){
},drawRectangle:function(node,_34c){
},drawCircle:function(node,_34e){
},drawCurve:function(node,_350){
},drawSurface:function(node,_352){
},getFeatureIdFromEvent:function(evt){
var node=evt.target||evt.srcElement;
return node._featureId;
},eraseGeometry:function(_355){
if((_355.CLASS_NAME=="OpenLayers.Geometry.MultiPoint")||(_355.CLASS_NAME=="OpenLayers.Geometry.MultiLineString")||(_355.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_355.components.length;i++){
this.eraseGeometry(_355.components[i]);
}
}else{
var _357=OpenLayers.Util.getElement(_355.id);
if(_357&&_357.parentNode){
if(_357.geometry){
_357.geometry.destroy();
_357.geometry=null;
}
_357.parentNode.removeChild(_357);
}
}
},nodeFactory:function(id,type,_35a){
var node=OpenLayers.Util.getElement(id);
if(node){
if(!this.nodeTypeCompare(node,type)){
node.parentNode.removeChild(node);
node=this.nodeFactory(id,type,_35a);
}
}else{
node=this.createNode(type,id);
}
return node;
},CLASS_NAME:"OpenLayers.Renderer.Elements"});
OpenLayers.Tile=OpenLayers.Class({EVENT_TYPES:["loadstart","loadend","reload"],events:null,id:null,layer:null,url:null,bounds:null,size:null,position:null,drawn:false,isLoading:false,initialize:function(_35c,_35d,_35e,url,size){
this.layer=_35c;
this.position=_35d;
this.bounds=_35e;
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
var _361=this.layer.maxExtent;
var _362=(_361&&this.bounds.intersectsBounds(_361,false));
var _363=this.layer.map.getExtent();
var _364=(_363&&this.bounds.intersectsBounds(_363,false));
return ((_362||this.layer.displayOutsideMaxExtent)&&(_364||(this.layer.buffer!=0)));
},moveTo:function(_365,_366,_367){
if(_367==null){
_367=true;
}
this.clear();
this.bounds=_365.clone();
this.position=_366.clone();
if(_367){
this.draw();
}
},clear:function(){
this.drawn=false;
},getBoundsFromBaseLayer:function(_368){
var _369=this.layer.map.getLonLatFromLayerPx(_368);
var _36a=_368.clone();
_36a.x+=this.size.w;
_36a.y+=this.size.h;
var _36b=this.layer.map.getLonLatFromLayerPx(_36a);
if(_369.lon>_36b.lon){
if(_369.lon<0){
_369.lon=-180-(_369.lon+180);
}else{
_36b.lon=180+_36b.lon+180;
}
}
bounds=new OpenLayers.Bounds(_369.lon,_36b.lat,_36b.lon,_369.lat);
return bounds;
},CLASS_NAME:"OpenLayers.Tile"});
OpenLayers.Control.MouseToolbar=OpenLayers.Class(OpenLayers.Control.MouseDefaults,{mode:null,buttons:null,direction:"vertical",buttonClicked:null,initialize:function(_36c,_36d){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.position=new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,OpenLayers.Control.MouseToolbar.Y);
if(_36c){
this.position=_36c;
}
if(_36d){
this.direction=_36d;
}
this.measureDivs=[];
},destroy:function(){
for(var _36e in this.buttons){
var btn=this.buttons[_36e];
btn.map=null;
btn.events.destroy();
}
OpenLayers.Control.MouseDefaults.prototype.destroy.apply(this,arguments);
},draw:function(){
OpenLayers.Control.prototype.draw.apply(this,arguments);
OpenLayers.Control.MouseDefaults.prototype.draw.apply(this,arguments);
this.buttons={};
var sz=new OpenLayers.Size(28,28);
var _371=new OpenLayers.Pixel(OpenLayers.Control.MouseToolbar.X,0);
this._addButton("zoombox","drag-rectangle-off.png","drag-rectangle-on.png",_371,sz,"Shift->Drag to zoom to area");
_371=_371.add((this.direction=="vertical"?0:sz.w),(this.direction=="vertical"?sz.h:0));
this._addButton("pan","panning-hand-off.png","panning-hand-on.png",_371,sz,"Drag the map to pan.");
_371=_371.add((this.direction=="vertical"?0:sz.w),(this.direction=="vertical"?sz.h:0));
this.switchModeTo("pan");
return this.div;
},_addButton:function(id,img,_374,xy,sz,_377){
var _378=OpenLayers.Util.getImagesLocation()+img;
var _379=OpenLayers.Util.getImagesLocation()+_374;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MouseToolbar_"+id,xy,sz,_378,"absolute");
this.div.appendChild(btn);
btn.imgLocation=_378;
btn.activeImgLocation=_379;
btn.events=new OpenLayers.Events(this,btn,null,true);
btn.events.register("mousedown",this,this.buttonDown);
btn.events.register("mouseup",this,this.buttonUp);
btn.events.register("dblclick",this,OpenLayers.Event.stop);
btn.action=id;
btn.title=_377;
btn.alt=_377;
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
var _37e=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_37e,this.map.zoom+1);
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
var _380="";
if(this.measureStart){
measureEnd=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
_380=OpenLayers.Util.distVincenty(this.measureStart,measureEnd);
_380=Math.round(_380*100)/100;
_380=_380+"km";
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
if(_380){
this.measureBoxDistance=OpenLayers.Util.createDiv(null,this.mouseDragStart.add(-2-parseInt(this.map.layerContainerDiv.style.left),2-parseInt(this.map.layerContainerDiv.style.top)),null,null,"absolute");
this.measureBoxDistance.innerHTML=_380;
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
}});
OpenLayers.Control.MouseToolbar.X=6;
OpenLayers.Control.MouseToolbar.Y=300;
OpenLayers.Control.OverviewMap=OpenLayers.Class(OpenLayers.Control,{id:"OverviewMap",element:null,ovmap:null,size:new OpenLayers.Size(180,90),layers:null,minRatio:8,maxRatio:32,mapOptions:null,initialize:function(_38c){
this.layers=[];
OpenLayers.Control.prototype.initialize.apply(this,[_38c]);
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
var _392=OpenLayers.Util.getImagesLocation();
var img=_392+"layer-switcher-maximize.png";
this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv(this.displayClass+"MaximizeButton",null,new OpenLayers.Size(18,18),img,"absolute");
this.maximizeDiv.style.display="none";
this.maximizeDiv.className=this.displayClass+"MaximizeButton";
OpenLayers.Event.observe(this.maximizeDiv,"click",this.maximizeControl.bindAsEventListener(this));
OpenLayers.Event.observe(this.maximizeDiv,"dblclick",function(e){
OpenLayers.Event.stop(e);
});
this.div.appendChild(this.maximizeDiv);
var img=_392+"layer-switcher-minimize.png";
this.minimizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_minimizeDiv",null,new OpenLayers.Size(18,18),img,"absolute");
this.minimizeDiv.style.display="none";
this.minimizeDiv.className=this.displayClass+"MinimizeButton";
OpenLayers.Event.observe(this.minimizeDiv,"click",this.minimizeControl.bindAsEventListener(this));
OpenLayers.Event.observe(this.minimizeDiv,"dblclick",function(e){
OpenLayers.Event.stop(e);
});
this.div.appendChild(this.minimizeDiv);
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
var _397=this.getRectPxBounds();
if((_397.top<=0)||(_397.left<=0)||(_397.bottom>=this.size.h-this.hComp)||(_397.right>=this.size.w-this.wComp)){
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
var _39a=this.rectDragStart.x-evt.xy.x;
var _39b=this.rectDragStart.y-evt.xy.y;
var _39c=this.getRectPxBounds();
var _39d=_39c.top;
var _39e=_39c.left;
var _39f=Math.abs(_39c.getHeight());
var _3a0=_39c.getWidth();
var _3a1=Math.max(0,(_39d-_39b));
_3a1=Math.min(_3a1,this.ovmap.size.h-this.hComp-_39f);
var _3a2=Math.max(0,(_39e-_39a));
_3a2=Math.min(_3a2,this.ovmap.size.w-this.wComp-_3a0);
this.setRectPxBounds(new OpenLayers.Bounds(_3a2,_3a1+_39f,_3a2+_3a0,_3a1));
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
var _3a6=this.getRectPxBounds();
var _3a7=_3a6.getCenterPixel();
var _3a8=evt.xy.x-_3a7.x;
var _3a9=evt.xy.y-_3a7.y;
var top=_3a6.top;
var left=_3a6.left;
var _3ac=Math.abs(_3a6.getHeight());
var _3ad=_3a6.getWidth();
var _3ae=Math.max(0,(top+_3a9));
_3ae=Math.min(_3ae,this.ovmap.size.h-_3ac);
var _3af=Math.max(0,(left+_3a8));
_3af=Math.min(_3af,this.ovmap.size.w-_3ad);
this.setRectPxBounds(new OpenLayers.Bounds(_3af,_3ae+_3ac,_3af+_3ad,_3ae));
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
},showToggle:function(_3b2){
this.maximizeDiv.style.display=_3b2?"":"none";
this.minimizeDiv.style.display=_3b2?"none":"";
},update:function(){
if(this.ovmap==null){
this.createMap();
}
if(!this.isSuitableOverview()){
this.updateOverview();
}
this.updateRectToMap();
},isSuitableOverview:function(){
var _3b3=this.map.getExtent();
var _3b4=this.map.maxExtent;
var _3b5=new OpenLayers.Bounds(Math.max(_3b3.left,_3b4.left),Math.max(_3b3.bottom,_3b4.bottom),Math.min(_3b3.right,_3b4.right),Math.min(_3b3.top,_3b4.top));
var _3b6=this.ovmap.getResolution()/this.map.getResolution();
return ((_3b6>this.minRatio)&&(_3b6<=this.maxRatio)&&(this.ovmap.getExtent().containsBounds(_3b5)));
},updateOverview:function(){
var _3b7=this.map.getResolution();
var _3b8=this.ovmap.getResolution();
var _3b9=_3b8/_3b7;
if(_3b9>this.maxRatio){
_3b8=this.minRatio*_3b7;
}else{
if(_3b9<=this.minRatio){
_3b8=this.maxRatio*_3b7;
}
}
this.ovmap.setCenter(this.map.center,this.ovmap.getZoomForResolution(_3b8));
this.updateRectToMap();
},createMap:function(){
var _3ba=OpenLayers.Util.extend({controls:[],maxResolution:"auto"},this.mapOptions);
this.ovmap=new OpenLayers.Map(this.mapDiv.id,_3ba);
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
var _3bb=this.getRectBoundsFromMapBounds(this.map.getExtent());
if(_3bb){
this.setRectPxBounds(_3bb);
}
},updateMapToRect:function(){
var _3bc=this.getRectPxBounds();
var _3bd=this.getMapBoundsFromRectBounds(_3bc);
this.map.setCenter(_3bd.getCenterLonLat(),this.map.zoom);
},getRectPxBounds:function(){
var top=parseInt(this.extentRectangle.style.top);
var left=parseInt(this.extentRectangle.style.left);
var _3c0=parseInt(this.extentRectangle.style.height);
var _3c1=parseInt(this.extentRectangle.style.width);
return new OpenLayers.Bounds(left,top+_3c0,left+_3c1,top);
},setRectPxBounds:function(_3c2){
var top=Math.max(_3c2.top,0);
var left=Math.max(_3c2.left,0);
var _3c5=Math.min(_3c2.top+Math.abs(_3c2.getHeight()),this.ovmap.size.h-this.hComp);
var _3c6=Math.min(_3c2.left+_3c2.getWidth(),this.ovmap.size.w-this.wComp);
this.extentRectangle.style.top=parseInt(top)+"px";
this.extentRectangle.style.left=parseInt(left)+"px";
this.extentRectangle.style.height=parseInt(Math.max(_3c5-top,0))+"px";
this.extentRectangle.style.width=parseInt(Math.max(_3c6-left,0))+"px";
},getRectBoundsFromMapBounds:function(_3c7){
var _3c8=new OpenLayers.LonLat(_3c7.left,_3c7.bottom);
var _3c9=new OpenLayers.LonLat(_3c7.right,_3c7.top);
var _3ca=this.getOverviewPxFromLonLat(_3c8);
var _3cb=this.getOverviewPxFromLonLat(_3c9);
var _3cc=null;
if(_3ca&&_3cb){
_3cc=new OpenLayers.Bounds(_3ca.x,_3ca.y,_3cb.x,_3cb.y);
}
return _3cc;
},getMapBoundsFromRectBounds:function(_3cd){
var _3ce=new OpenLayers.Pixel(_3cd.left,_3cd.bottom);
var _3cf=new OpenLayers.Pixel(_3cd.right,_3cd.top);
var _3d0=this.getLonLatFromOverviewPx(_3ce);
var _3d1=this.getLonLatFromOverviewPx(_3cf);
return new OpenLayers.Bounds(_3d0.lon,_3d0.lat,_3d1.lon,_3d1.lat);
},getLonLatFromOverviewPx:function(_3d2){
var size=this.ovmap.size;
var res=this.ovmap.getResolution();
var _3d5=this.ovmap.getExtent().getCenterLonLat();
var _3d6=_3d2.x-(size.w/2);
var _3d7=_3d2.y-(size.h/2);
return new OpenLayers.LonLat(_3d5.lon+_3d6*res,_3d5.lat-_3d7*res);
},getOverviewPxFromLonLat:function(_3d8){
var res=this.ovmap.getResolution();
var _3da=this.ovmap.getExtent();
var px=null;
if(_3da){
px=new OpenLayers.Pixel(Math.round(1/res*(_3d8.lon-_3da.left)),Math.round(1/res*(_3da.top-_3d8.lat)));
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
var _3df=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
this._addButton("panup","north-mini.png",_3df,sz);
px.y=_3df.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
this._addButton("panright","east-mini.png",px.add(sz.w,0),sz);
this._addButton("pandown","south-mini.png",_3df.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_3df.add(0,sz.h*3+5),sz);
_3df=this._addZoomBar(_3df.add(0,sz.h*4+5));
this._addButton("zoomout","zoom-minus-mini.png",_3df,sz);
return this.div;
},_addZoomBar:function(_3e0){
var _3e1=OpenLayers.Util.getImagesLocation();
var id="OpenLayers_Control_PanZoomBar_Slider"+this.map.id;
var _3e3=this.map.getNumZoomLevels()-1-this.map.getZoom();
var _3e4=OpenLayers.Util.createAlphaImageDiv(id,_3e0.add(-1,_3e3*this.zoomStopHeight),new OpenLayers.Size(20,9),_3e1+"slider.png","absolute");
this.slider=_3e4;
this.sliderEvents=new OpenLayers.Events(this,_3e4,null,true);
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
div=OpenLayers.Util.createAlphaImageDiv(id,_3e0,new OpenLayers.Size(sz.w,this.zoomStopHeight),_3e1+"zoombar.png","absolute",null,"crop");
div.style.height=sz.h;
}else{
div=OpenLayers.Util.createDiv("OpenLayers_Control_PanZoomBar_Zoombar"+this.map.id,_3e0,sz,_3e1+"zoombar.png");
}
this.zoombarDiv=div;
this.divEvents=new OpenLayers.Events(this,div,null,true);
this.divEvents.register("mousedown",this,this.divClick);
this.divEvents.register("mousemove",this,this.passEventToSlider);
this.divEvents.register("dblclick",this,this.doubleClick);
this.divEvents.register("click",this,this.doubleClick);
this.div.appendChild(div);
this.startTop=parseInt(div.style.top);
this.div.appendChild(_3e4);
this.map.events.register("zoomend",this,this.moveZoomBar);
_3e0=_3e0.add(0,this.zoomStopHeight*this.map.getNumZoomLevels());
return _3e0;
},passEventToSlider:function(evt){
this.sliderEvents.handleBrowserEvent(evt);
},divClick:function(evt){
if(!OpenLayers.Event.isLeftClick(evt)){
return;
}
var y=evt.xy.y;
var top=OpenLayers.Util.pagePosition(evt.object)[1];
var _3ea=Math.floor((y-top)/this.zoomStopHeight);
this.map.zoomTo((this.map.getNumZoomLevels()-1)-_3ea);
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
var _3ed=this.mouseDragStart.y-evt.xy.y;
var _3ee=OpenLayers.Util.pagePosition(this.zoombarDiv);
if((evt.clientY-_3ee[1])>0&&(evt.clientY-_3ee[1])<parseInt(this.zoombarDiv.style.height)-2){
var _3ef=parseInt(this.slider.style.top)-_3ed;
this.slider.style.top=_3ef+"px";
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
var _3f1=this.zoomStart.y-evt.xy.y;
this.map.zoomTo(this.map.zoom+Math.round(_3f1/this.zoomStopHeight));
this.moveZoomBar();
this.mouseDragStart=null;
OpenLayers.Event.stop(evt);
}
},moveZoomBar:function(){
var _3f2=((this.map.getNumZoomLevels()-1)-this.map.getZoom())*this.zoomStopHeight+this.startTop+1;
this.slider.style.top=_3f2+"px";
},CLASS_NAME:"OpenLayers.Control.PanZoomBar"});
OpenLayers.Format.GeoRSS=OpenLayers.Class(OpenLayers.Format,{rssns:"http://backend.userland.com/rss2",featureNS:"http://mapserver.gis.umn.edu/mapserver",georssns:"http://www.opengis.net/georss",initialize:function(_3f3){
OpenLayers.Format.prototype.initialize.apply(this,[_3f3]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.parseXMLString(data);
}
var _3f5=OpenLayers.Ajax.getElementsByTagNameNS(data,this.georssns,"georss","where");
if(_3f5.length==0){
return [];
}
var dim;
var _3f7=OpenLayers.Ajax.getElementsByTagNameNS(_3f5[0],this.gmlns,"gml","coordinates");
if(_3f7.length==0){
_3f7=OpenLayers.Ajax.getElementsByTagNameNS(_3f5[0],this.gmlns,"gml","pos");
}
if(_3f7.length>0){
dim=_3f7[0].getAttribute("srsDimension");
}
this.dim=(dim=="3"||dim==3)?3:2;
var _3f8=[];
var _3f9=new OpenLayers.Format.GML();
_3f9.dim=this.dim;
for(var i=0;i<_3f5.length;i++){
var _3fb=_3f9.parseFeature(_3f5[i]);
if(_3fb){
_3f8.push(_3fb);
}
}
return _3f8;
},write:function(_3fc){
var _3fd=document.createElementNS(this.rssns,"rss");
for(var i=0;i<_3fc.length;i++){
_3fd.appendChild(this.createFeatureXML(_3fc[i]));
}
return _3fd;
},createFeatureXML:function(_3ff){
var _400=this.buildGeometryNode(_3ff.geometry);
var _401=document.createElementNS(this.rssns,"item");
var _402=document.createElementNS(this.rssns,"title");
_402.appendChild(document.createTextNode(_3ff.attributes.title?_3ff.attributes.title:""));
var _403=document.createElementNS(this.rssns,"description");
_403.appendChild(document.createTextNode(_3ff.attributes.description?_3ff.attributes.description:""));
_401.appendChild(_402);
_401.appendChild(_403);
for(var attr in _3ff.attributes){
var _405=document.createTextNode(_3ff.attributes[attr]);
var _406=attr;
if(attr.search(":")!=-1){
_406=attr.split(":")[1];
}
var _407=document.createElementNS(this.featureNS,"feature:"+_406);
_407.appendChild(_405);
_401.appendChild(_407);
}
_401.appendChild(_400);
return _401;
},buildGeometryNode:function(_408){
var gml="";
if(_408.CLASS_NAME=="OpenLayers.Geometry.Polygon"){
gml=document.createElementNS(this.georssns,"georss:polygon");
gml.appendChild(this.buildCoordinatesNode(_408.components[0]));
}else{
if(_408.CLASS_NAME=="OpenLayers.Geometry.LineString"){
gml=document.createElementNS(this.georssns,"georss:line");
gml.appendChild(this.buildCoordinatesNode(_408));
}else{
if(_408.CLASS_NAME=="OpenLayers.Geometry.Point"){
gml=document.createElementNS(this.georssns,"georss:point");
gml.appendChild(this.buildCoordinatesNode(_408));
}else{
alert("Couldn't parse "+_408.CLASS_NAME);
}
}
}
return gml;
},buildCoordinatesNode:function(_40a){
var _40b=null;
if(_40a.components){
_40b=_40a.components;
}
var path="";
if(_40b){
for(var i=0;i<_40b.length;i++){
path+=_40b[i].y+" "+_40b[i].x+" ";
}
}else{
path+=_40a.y+" "+_40a.x+" ";
}
return document.createTextNode(path);
}});
OpenLayers.Format.WKT=OpenLayers.Class(OpenLayers.Format,{initialize:function(_40e){
this.regExes={"typeStr":/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,"spaces":/\s+/,"parenComma":/\)\s*,\s*\(/,"doubleParenComma":/\)\s*\)\s*,\s*\(\s*\(/,"trimParens":/^\s*\(?(.*?)\)?\s*$/};
OpenLayers.Format.prototype.initialize.apply(this,[_40e]);
},read:function(wkt){
var _410,type,str;
var _411=this.regExes.typeStr.exec(wkt);
if(_411){
type=_411[1].toLowerCase();
str=_411[2];
if(this.parse[type]){
_410=this.parse[type].apply(this,[str]);
}
}
return _410;
},write:function(_412){
var _413,geometry,type,data,isCollection;
if(_412.constructor==Array){
_413=_412;
isCollection=true;
}else{
_413=[_412];
isCollection=false;
}
var _414=[];
if(isCollection){
_414.push("GEOMETRYCOLLECTION(");
}
for(var i=0;i<_413.length;++i){
if(isCollection&&i>0){
_414.push(",");
}
geometry=_413[i].geometry;
type=geometry.CLASS_NAME.split(".")[2].toLowerCase();
if(!this.extract[type]){
return null;
}
data=this.extract[type].apply(this,[geometry]);
_414.push(type.toUpperCase()+"("+data+")");
}
if(isCollection){
_414.push(")");
}
return _414.join("");
},extract:{"point":function(_416){
return _416.x+" "+_416.y;
},"multipoint":function(_417){
var _418=[];
for(var i=0;i<_417.components.length;++i){
_418.push(this.extract.point.apply(this,[_417.components[i]]));
}
return _418.join(",");
},"linestring":function(_41a){
var _41b=[];
for(var i=0;i<_41a.components.length;++i){
_41b.push(this.extract.point.apply(this,[_41a.components[i]]));
}
return _41b.join(",");
},"multilinestring":function(_41d){
var _41e=[];
for(var i=0;i<_41d.components.length;++i){
_41e.push("("+this.extract.linestring.apply(this,[_41d.components[i]])+")");
}
return _41e.join(",");
},"polygon":function(_420){
var _421=[];
for(var i=0;i<_420.components.length;++i){
_421.push("("+this.extract.linestring.apply(this,[_420.components[i]])+")");
}
return _421.join(",");
},"multipolygon":function(_423){
var _424=[];
for(var i=0;i<_423.components.length;++i){
_424.push("("+this.extract.polygon.apply(this,[_423.components[i]])+")");
}
return _424.join(",");
}},parse:{"point":function(str){
var _427=str.trim().split(this.regExes.spaces);
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_427[0],_427[1]));
},"multipoint":function(str){
var _429=str.trim().split(",");
var _42a=[];
for(var i=0;i<_429.length;++i){
_42a.push(this.parse.point.apply(this,[_429[i]]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPoint(_42a));
},"linestring":function(str){
var _42d=str.trim().split(",");
var _42e=[];
for(var i=0;i<_42d.length;++i){
_42e.push(this.parse.point.apply(this,[_42d[i]]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(_42e));
},"multilinestring":function(str){
var line;
var _432=str.trim().split(this.regExes.parenComma);
var _433=[];
for(var i=0;i<_432.length;++i){
line=_432[i].replace(this.regExes.trimParens,"$1");
_433.push(this.parse.linestring.apply(this,[line]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(_433));
},"polygon":function(str){
var ring,linestring,linearring;
var _437=str.trim().split(this.regExes.parenComma);
var _438=[];
for(var i=0;i<_437.length;++i){
ring=_437[i].replace(this.regExes.trimParens,"$1");
linestring=this.parse.linestring.apply(this,[ring]).geometry;
linearring=new OpenLayers.Geometry.LinearRing(linestring.components);
_438.push(linearring);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(_438));
},"multipolygon":function(str){
var _43b;
var _43c=str.trim().split(this.regExes.doubleParenComma);
var _43d=[];
for(var i=0;i<_43c.length;++i){
_43b=_43c[i].replace(this.regExes.trimParens,"$1");
_43d.push(this.parse.polygon.apply(this,[_43b]).geometry);
}
return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon(_43d));
},"geometrycollection":function(str){
str=str.replace(/,\s*([A-Za-z])/g,"|$1");
var _440=str.trim().split("|");
var _441=[];
for(var i=0;i<_440.length;++i){
_441.push(OpenLayers.Format.WKT.prototype.read.apply(this,[_440[i]]));
}
return _441;
}},CLASS_NAME:"OpenLayers.Format.WKT"});
OpenLayers.Format.XML=OpenLayers.Class.create();
OpenLayers.Format.XML.prototype=OpenLayers.Class.inherit(OpenLayers.Format,{xmldom:null,initialize:function(_443){
if(window.ActiveXObject){
this.xmldom=new ActiveXObject("Microsoft.XMLDOM");
}
OpenLayers.Format.prototype.initialize.apply(this,[_443]);
},read:function(text){
var _445=text.indexOf("<");
if(_445>0){
text=text.substring(_445);
}
var node=OpenLayers.Util.Try((function(){
var _447;
if(window.ActiveXObject&&!this.xmldom){
_447=new ActiveXObject("Microsoft.XMLDOM");
}else{
_447=this.xmldom;
}
_447.loadXML(text);
return _447;
}).bind(this),function(){
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
var _44b=new XMLSerializer();
data=_44b.serializeToString(node);
}
return data;
},createElementNS:function(uri,name){
var _44e;
if(this.xmldom){
_44e=this.xmldom.createNode(1,name,uri);
}else{
_44e=document.createElementNS(uri,name);
}
return _44e;
},createTextNode:function(text){
var node;
if(this.xmldom){
node=this.xmldom.createTextNode(text);
}else{
node=document.createTextNode(text);
}
return node;
},getElementsByTagNameNS:function(node,uri,name){
var _454=[];
if(node.getElementsByTagNameNS){
_454=node.getElementsByTagNameNS(uri,name);
}else{
var _455=node.getElementsByTagName("*");
var _456,fullName;
for(var i=0;i<_455.length;++i){
_456=_455[i];
fullName=(_456.prefix)?(_456.prefix+":"+name):name;
if((name=="*")||(fullName==_456.nodeName)){
if((uri=="*")||(uri==_456.namespaceURI)){
_454.push(_456);
}
}
}
}
return _454;
},getAttributeNodeNS:function(node,uri,name){
var _45b=null;
if(node.getAttributeNodeNS){
_45b=node.getAttributeNodeNS(uri,name);
}else{
var _45c=node.attributes;
var _45d,fullName;
for(var i=0;i<_45c.length;++i){
_45d=_45c[i];
if(_45d.namespaceURI==uri){
fullName=(_45d.prefix)?(_45d.prefix+":"+name):name;
if(fullName==_45d.nodeName){
_45b=_45d;
break;
}
}
}
}
return _45b;
},getAttributeNS:function(node,uri,name){
var _462="";
if(node.getAttributeNS){
_462=node.getAttributeNS(uri,name);
}else{
var _463=this.getAttributeNodeNS(node,uri,name);
if(_463){
_462=_463.nodeValue;
}
}
return _462;
},hasAttributeNS:function(node,uri,name){
var _467=false;
if(node.hasAttributeNS){
_467=node.hasAttributeNS(uri,name);
}else{
_467=!!this.getAttributeNodeNS(node,uri,name);
}
return _467;
},CLASS_NAME:"OpenLayers.Format.XML"});
OpenLayers.Handler=OpenLayers.Class({id:null,control:null,map:null,keyMask:null,active:false,initialize:function(_468,_469,_46a){
OpenLayers.Util.extend(this,_46a);
this.control=_468;
this.callbacks=_469;
if(_468.map){
this.setMap(_468.map);
}
OpenLayers.Util.extend(this,_46a);
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},setMap:function(map){
this.map=map;
},checkModifiers:function(evt){
if(this.keyMask==null){
return true;
}
var _46d=(evt.shiftKey?OpenLayers.Handler.MOD_SHIFT:0)|(evt.ctrlKey?OpenLayers.Handler.MOD_CTRL:0)|(evt.altKey?OpenLayers.Handler.MOD_ALT:0);
return (_46d==this.keyMask);
},activate:function(){
if(this.active){
return false;
}
var _46e=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_46e.length;i++){
if(this[_46e[i]]){
this.register(_46e[i],this[_46e[i]]);
}
}
this.active=true;
return true;
},deactivate:function(){
if(!this.active){
return false;
}
var _470=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_470.length;i++){
if(this[_470[i]]){
this.unregister(_470[i],this[_470[i]]);
}
}
this.active=false;
return true;
},callback:function(name,args){
if(this.callbacks[name]){
this.callbacks[name].apply(this.control,args);
}
},register:function(name,_475){
this.map.events.registerPriority(name,this,_475);
},unregister:function(name,_477){
this.map.events.unregister(name,this,_477);
},destroy:function(){
this.deactivate();
this.control=this.map=null;
},CLASS_NAME:"OpenLayers.Handler"});
OpenLayers.Handler.MOD_NONE=0;
OpenLayers.Handler.MOD_SHIFT=1;
OpenLayers.Handler.MOD_CTRL=2;
OpenLayers.Handler.MOD_ALT=4;
OpenLayers.Map=OpenLayers.Class({Z_INDEX_BASE:{BaseLayer:100,Overlay:325,Popup:750,Control:1000},EVENT_TYPES:["addlayer","removelayer","changelayer","movestart","move","moveend","zoomend","popupopen","popupclose","addmarker","removemarker","clearmarkers","mouseover","mouseout","mousemove","dragstart","drag","dragend","changebaselayer"],id:null,events:null,div:null,size:null,viewPortDiv:null,layerContainerOrigin:null,layerContainerDiv:null,layers:null,controls:null,popups:null,baseLayer:null,center:null,zoom:0,viewRequestID:0,tileSize:null,projection:"EPSG:4326",units:"degrees",resolutions:null,maxResolution:1.40625,minResolution:null,maxScale:null,minScale:null,maxExtent:null,minExtent:null,numZoomLevels:16,theme:null,fallThrough:false,initialize:function(div,_479){
this.setOptions(_479);
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
if(navigator.appName.contains("Microsoft")){
this.events.register("resize",this,this.updateSize);
}else{
OpenLayers.Event.observe(window,"resize",this.updateSize.bind(this));
}
if(this.theme){
var _47b=true;
var _47c=document.getElementsByTagName("link");
for(var i=0;i<_47c.length;++i){
if(OpenLayers.Util.isEquivalentUrl(_47c.item(i).href,this.theme)){
_47b=false;
break;
}
}
if(_47b){
var _47e=document.createElement("link");
_47e.setAttribute("rel","stylesheet");
_47e.setAttribute("type","text/css");
_47e.setAttribute("href",this.theme);
document.getElementsByTagName("head")[0].appendChild(_47e);
}
}
this.layers=[];
if(this.controls==null){
if(OpenLayers.Control!=null){
this.controls=[new OpenLayers.Control.Navigation(),new OpenLayers.Control.PanZoom(),new OpenLayers.Control.ArgParser()];
}else{
this.controls=[];
}
}
for(var i=0;i<this.controls.length;i++){
this.addControlToMap(this.controls[i]);
}
this.popups=[];
this.unloadDestroy=this.destroy.bind(this);
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
},setOptions:function(_480){
this.tileSize=new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,OpenLayers.Map.TILE_HEIGHT);
this.maxExtent=new OpenLayers.Bounds(-180,-90,180,90);
this.theme=OpenLayers._getScriptLocation()+"theme/default/style.css";
OpenLayers.Util.extend(this,_480);
},getTileSize:function(){
return this.tileSize;
},getLayer:function(id){
var _482=null;
for(var i=0;i<this.layers.length;i++){
var _484=this.layers[i];
if(_484.id==id){
_482=_484;
}
}
return _482;
},setLayerZIndex:function(_485,zIdx){
_485.setZIndex(this.Z_INDEX_BASE[_485.isBaseLayer?"BaseLayer":"Overlay"]+zIdx*5);
},addLayer:function(_487){
for(var i=0;i<this.layers.length;i++){
if(this.layers[i]==_487){
var msg="You tried to add the layer: "+_487.name+" to the map, but it has already been added";
OpenLayers.Console.warn(msg);
return false;
}
}
_487.div.style.overflow="";
this.setLayerZIndex(_487,this.layers.length);
if(_487.isFixed){
this.viewPortDiv.appendChild(_487.div);
}else{
this.layerContainerDiv.appendChild(_487.div);
}
this.layers.push(_487);
_487.setMap(this);
if(_487.isBaseLayer){
if(this.baseLayer==null){
this.setBaseLayer(_487);
}else{
_487.setVisibility(false);
}
}else{
_487.redraw();
}
this.events.triggerEvent("addlayer");
},addLayers:function(_48a){
for(var i=0;i<_48a.length;i++){
this.addLayer(_48a[i]);
}
},removeLayer:function(_48c,_48d){
if(_48d==null){
_48d=true;
}
if(_48c.isFixed){
this.viewPortDiv.removeChild(_48c.div);
}else{
this.layerContainerDiv.removeChild(_48c.div);
}
_48c.map=null;
OpenLayers.Util.removeItem(this.layers,_48c);
if(_48d&&(this.baseLayer==_48c)){
this.baseLayer=null;
for(i=0;i<this.layers.length;i++){
var _48e=this.layers[i];
if(_48e.isBaseLayer){
this.setBaseLayer(_48e);
break;
}
}
}
this.events.triggerEvent("removelayer");
},getNumLayers:function(){
return this.layers.length;
},getLayerIndex:function(_48f){
return OpenLayers.Util.indexOf(this.layers,_48f);
},setLayerIndex:function(_490,idx){
var base=this.getLayerIndex(_490);
if(idx<0){
idx=0;
}else{
if(idx>this.layers.length){
idx=this.layers.length;
}
}
if(base!=idx){
this.layers.splice(base,1);
this.layers.splice(idx,0,_490);
for(var i=0;i<this.layers.length;i++){
this.setLayerZIndex(this.layers[i],i);
}
this.events.triggerEvent("changelayer");
}
},raiseLayer:function(_494,_495){
var idx=this.getLayerIndex(_494)+_495;
this.setLayerIndex(_494,idx);
},setBaseLayer:function(_497,_498){
var _499=null;
if(this.baseLayer){
_499=this.baseLayer.getExtent();
}
if(_497!=this.baseLayer){
if(OpenLayers.Util.indexOf(this.layers,_497)!=-1){
if(this.baseLayer!=null){
this.baseLayer.setVisibility(false,_498);
}
this.baseLayer=_497;
this.viewRequestID++;
this.baseLayer.visibility=true;
var _49a=this.getCenter();
if(_49a!=null){
if(_499==null){
this.setCenter(_49a,this.getZoom(),false,true);
}else{
this.setCenter(_499.getCenterLonLat(),this.getZoomForExtent(_499),false,true);
}
}
if((_498==null)||(_498==false)){
this.events.triggerEvent("changebaselayer");
}
}
}
},addControl:function(_49b,px){
this.controls.push(_49b);
this.addControlToMap(_49b,px);
},addControlToMap:function(_49d,px){
_49d.outsideViewport=(_49d.div!=null);
_49d.setMap(this);
var div=_49d.draw(px);
if(div){
if(!_49d.outsideViewport){
div.style.zIndex=this.Z_INDEX_BASE["Control"]+this.controls.length;
this.viewPortDiv.appendChild(div);
}
}
},getControl:function(id){
var _4a1=null;
for(var i=0;i<this.controls.length;i++){
var _4a3=this.controls[i];
if(_4a3.id==id){
_4a1=_4a3;
break;
}
}
return _4a1;
},removeControl:function(_4a4){
if((_4a4)&&(_4a4==this.getControl(_4a4.id))){
if(!_4a4.outsideViewport){
this.viewPortDiv.removeChild(_4a4.div);
}
OpenLayers.Util.removeItem(this.controls,_4a4);
}
},addPopup:function(_4a5,_4a6){
if(_4a6){
for(var i=0;i<this.popups.length;i++){
this.removePopup(this.popups[i]);
}
}
_4a5.map=this;
this.popups.push(_4a5);
var _4a8=_4a5.draw();
if(_4a8){
_4a8.style.zIndex=this.Z_INDEX_BASE["Popup"]+this.popups.length;
this.layerContainerDiv.appendChild(_4a8);
}
},removePopup:function(_4a9){
OpenLayers.Util.removeItem(this.popups,_4a9);
if(_4a9.div){
try{
this.layerContainerDiv.removeChild(_4a9.div);
}
catch(e){
}
}
_4a9.map=null;
},getSize:function(){
var size=null;
if(this.size!=null){
size=this.size.clone();
}
return size;
},updateSize:function(){
this.events.element.offsets=null;
var _4ab=this.getCurrentSize();
var _4ac=this.getSize();
if(_4ac==null){
this.size=_4ac=_4ab;
}
if(!_4ab.equals(_4ac)){
this.size=_4ab;
for(var i=0;i<this.layers.length;i++){
this.layers[i].onMapResize();
}
if(this.baseLayer!=null){
var _4ae=new OpenLayers.Pixel(_4ab.w/2,_4ab.h/2);
var _4af=this.getLonLatFromViewPortPx(_4ae);
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
},calculateBounds:function(_4b3,_4b4){
var _4b5=null;
if(_4b3==null){
_4b3=this.getCenter();
}
if(_4b4==null){
_4b4=this.getResolution();
}
if((_4b3!=null)&&(_4b4!=null)){
var size=this.getSize();
var _4b7=size.w*_4b4;
var _4b8=size.h*_4b4;
_4b5=new OpenLayers.Bounds(_4b3.lon-_4b7/2,_4b3.lat-_4b8/2,_4b3.lon+_4b7/2,_4b3.lat+_4b8/2);
}
return _4b5;
},getCenter:function(){
return this.center;
},getZoom:function(){
return this.zoom;
},pan:function(dx,dy){
var _4bb=this.getViewPortPxFromLonLat(this.getCenter());
var _4bc=_4bb.add(dx,dy);
if(!_4bc.equals(_4bb)){
var _4bd=this.getLonLatFromViewPortPx(_4bc);
this.setCenter(_4bd);
}
},setCenter:function(_4be,zoom,_4c0,_4c1){
if(!this.center&&!this.isValidLonLat(_4be)){
_4be=this.maxExtent.getCenterLonLat();
}
var _4c2=_4c1||((this.isValidZoomLevel(zoom))&&(zoom!=this.getZoom()));
var _4c3=(this.isValidLonLat(_4be))&&(!_4be.equals(this.center));
if(_4c2||_4c3||!_4c0){
if(!_4c0){
this.events.triggerEvent("movestart");
}
if(_4c3){
if((!_4c2)&&(this.center)){
this.centerLayerContainer(_4be);
}
this.center=_4be.clone();
}
if((_4c2)||(this.layerContainerOrigin==null)){
this.layerContainerOrigin=this.center.clone();
this.layerContainerDiv.style.left="0px";
this.layerContainerDiv.style.top="0px";
}
if(_4c2){
this.zoom=zoom;
for(var i=0;i<this.popups.length;i++){
this.popups[i].updatePosition();
}
this.viewRequestID++;
}
var _4c5=this.getExtent();
this.baseLayer.moveTo(_4c5,_4c2,_4c0);
for(var i=0;i<this.layers.length;i++){
var _4c6=this.layers[i];
if(!_4c6.isBaseLayer){
var _4c7;
var _4c8=_4c6.calculateInRange();
if(_4c6.inRange!=_4c8){
_4c6.inRange=_4c8;
_4c7=true;
this.events.triggerEvent("changelayer");
}else{
_4c7=(_4c6.visibility&&_4c6.inRange);
}
if(_4c7){
_4c6.moveTo(_4c5,_4c2,_4c0);
}
}
}
this.events.triggerEvent("move");
if(_4c2){
this.events.triggerEvent("zoomend");
}
}
if(!_4c0){
this.events.triggerEvent("moveend");
}
},centerLayerContainer:function(_4c9){
var _4ca=this.getViewPortPxFromLonLat(this.layerContainerOrigin);
var _4cb=this.getViewPortPxFromLonLat(_4c9);
if((_4ca!=null)&&(_4cb!=null)){
this.layerContainerDiv.style.left=(_4ca.x-_4cb.x)+"px";
this.layerContainerDiv.style.top=(_4ca.y-_4cb.y)+"px";
}
},isValidZoomLevel:function(_4cc){
return ((_4cc!=null)&&(_4cc>=0)&&(_4cc<this.getNumZoomLevels()));
},isValidLonLat:function(_4cd){
var _4ce=false;
if(_4cd!=null){
var _4cf=this.getMaxExtent();
_4ce=_4cf.containsLonLat(_4cd);
}
return _4ce;
},getProjection:function(){
var _4d0=null;
if(this.baseLayer!=null){
_4d0=this.baseLayer.projection;
}
return _4d0;
},getMaxResolution:function(){
var _4d1=null;
if(this.baseLayer!=null){
_4d1=this.baseLayer.maxResolution;
}
return _4d1;
},getMaxExtent:function(){
var _4d2=null;
if(this.baseLayer!=null){
_4d2=this.baseLayer.maxExtent;
}
return _4d2;
},getNumZoomLevels:function(){
var _4d3=null;
if(this.baseLayer!=null){
_4d3=this.baseLayer.numZoomLevels;
}
return _4d3;
},getExtent:function(){
var _4d4=null;
if(this.baseLayer!=null){
_4d4=this.baseLayer.getExtent();
}
return _4d4;
},getResolution:function(){
var _4d5=null;
if(this.baseLayer!=null){
_4d5=this.baseLayer.getResolution();
}
return _4d5;
},getScale:function(){
var _4d6=null;
if(this.baseLayer!=null){
var res=this.getResolution();
var _4d8=this.baseLayer.units;
_4d6=OpenLayers.Util.getScaleFromResolution(res,_4d8);
}
return _4d6;
},getZoomForExtent:function(_4d9){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForExtent(_4d9);
}
return zoom;
},getZoomForResolution:function(_4db){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForResolution(_4db);
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
},zoomToExtent:function(_4de){
var _4df=_4de.getCenterLonLat();
if(this.baseLayer.wrapDateLine){
var _4e0=this.getMaxExtent();
_4de=_4de.clone();
while(_4de.right<_4de.left){
_4de.right+=_4e0.getWidth();
}
_4df=_4de.getCenterLonLat().wrapDateLine(_4e0);
}
this.setCenter(_4df,this.getZoomForExtent(_4de));
},zoomToMaxExtent:function(){
this.zoomToExtent(this.getMaxExtent());
},zoomToScale:function(_4e1){
var res=OpenLayers.Util.getResolutionFromScale(_4e1,this.baseLayer.units);
var size=this.getSize();
var _4e4=size.w*res;
var _4e5=size.h*res;
var _4e6=this.getCenter();
var _4e7=new OpenLayers.Bounds(_4e6.lon-_4e4/2,_4e6.lat-_4e5/2,_4e6.lon+_4e4/2,_4e6.lat+_4e5/2);
this.zoomToExtent(_4e7);
},getLonLatFromViewPortPx:function(_4e8){
var _4e9=null;
if(this.baseLayer!=null){
_4e9=this.baseLayer.getLonLatFromViewPortPx(_4e8);
}
return _4e9;
},getViewPortPxFromLonLat:function(_4ea){
var px=null;
if(this.baseLayer!=null){
px=this.baseLayer.getViewPortPxFromLonLat(_4ea);
}
return px;
},getLonLatFromPixel:function(px){
return this.getLonLatFromViewPortPx(px);
},getPixelFromLonLat:function(_4ed){
return this.getViewPortPxFromLonLat(_4ed);
},getViewPortPxFromLayerPx:function(_4ee){
var _4ef=null;
if(_4ee!=null){
var dX=parseInt(this.layerContainerDiv.style.left);
var dY=parseInt(this.layerContainerDiv.style.top);
_4ef=_4ee.add(dX,dY);
}
return _4ef;
},getLayerPxFromViewPortPx:function(_4f2){
var _4f3=null;
if(_4f2!=null){
var dX=-parseInt(this.layerContainerDiv.style.left);
var dY=-parseInt(this.layerContainerDiv.style.top);
_4f3=_4f2.add(dX,dY);
if(isNaN(_4f3.x)||isNaN(_4f3.y)){
_4f3=null;
}
}
return _4f3;
},getLonLatFromLayerPx:function(px){
px=this.getViewPortPxFromLayerPx(px);
return this.getLonLatFromViewPortPx(px);
},getLayerPxFromLonLat:function(_4f7){
var px=this.getViewPortPxFromLonLat(_4f7);
return this.getLayerPxFromViewPortPx(px);
},CLASS_NAME:"OpenLayers.Map"});
OpenLayers.Map.TILE_WIDTH=256;
OpenLayers.Map.TILE_HEIGHT=256;
OpenLayers.Marker=OpenLayers.Class({icon:null,lonlat:null,events:null,map:null,initialize:function(_4f9,icon){
this.lonlat=_4f9;
var _4fb=(icon)?icon:OpenLayers.Marker.defaultIcon();
if(this.icon==null){
this.icon=_4fb;
}else{
this.icon.url=_4fb.url;
this.icon.size=_4fb.size;
this.icon.offset=_4fb.offset;
this.icon.calculateOffset=_4fb.calculateOffset;
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
var _4fe=false;
if(this.map){
var _4ff=this.map.getExtent();
_4fe=_4ff.containsLonLat(this.lonlat);
}
return _4fe;
},inflate:function(_500){
if(this.icon){
var _501=new OpenLayers.Size(this.icon.size.w*_500,this.icon.size.h*_500);
this.icon.setSize(_501);
}
},setOpacity:function(_502){
this.icon.setOpacity(_502);
},display:function(_503){
this.icon.display(_503);
},CLASS_NAME:"OpenLayers.Marker"});
OpenLayers.Marker.defaultIcon=function(){
var url=OpenLayers.Util.getImagesLocation()+"marker.png";
var size=new OpenLayers.Size(21,25);
var _506=function(size){
return new OpenLayers.Pixel(-(size.w/2),-size.h);
};
return new OpenLayers.Icon(url,size,null,_506);
};
OpenLayers.Popup.AnchoredBubble=OpenLayers.Class(OpenLayers.Popup.Anchored,{rounded:false,initialize:function(id,_509,size,_50b,_50c,_50d){
OpenLayers.Popup.Anchored.prototype.initialize.apply(this,arguments);
},draw:function(px){
OpenLayers.Popup.Anchored.prototype.draw.apply(this,arguments);
this.setContentHTML();
this.setRicoCorners(!this.rounded);
this.rounded=true;
this.setBackgroundColor();
this.setOpacity();
return this.div;
},setSize:function(size){
OpenLayers.Popup.Anchored.prototype.setSize.apply(this,arguments);
if(this.contentDiv!=null){
var _510=this.size.clone();
_510.h-=(2*OpenLayers.Popup.AnchoredBubble.CORNER_SIZE);
_510.h-=(2*this.padding);
this.contentDiv.style.height=_510.h+"px";
this.contentDiv.style.width=_510.w+"px";
if(this.map){
this.setRicoCorners(!this.rounded);
this.rounded=true;
}
}
},setBackgroundColor:function(_511){
if(_511!=undefined){
this.backgroundColor=_511;
}
if(this.div!=null){
if(this.contentDiv!=null){
this.div.style.background="transparent";
OpenLayers.Rico.Corner.changeColor(this.contentDiv,this.backgroundColor);
}
}
},setOpacity:function(_512){
if(_512!=undefined){
this.opacity=_512;
}
if(this.div!=null){
if(this.contentDiv!=null){
OpenLayers.Rico.Corner.changeOpacity(this.contentDiv,this.opacity);
}
}
},setBorder:function(_513){
this.border=0;
},setRicoCorners:function(_514){
var _515=this.getCornersToRound(this.relativePosition);
var _516={corners:_515,color:this.backgroundColor,bgColor:"transparent",blend:false};
if(_514){
OpenLayers.Rico.Corner.round(this.div,_516);
}else{
OpenLayers.Rico.Corner.reRound(this.groupDiv,_516);
this.setBackgroundColor();
this.setOpacity();
}
},getCornersToRound:function(){
var _517=["tl","tr","bl","br"];
var _518=OpenLayers.Bounds.oppositeQuadrant(this.relativePosition);
OpenLayers.Util.removeItem(_517,_518);
return _517.join(" ");
},CLASS_NAME:"OpenLayers.Popup.AnchoredBubble"});
OpenLayers.Popup.AnchoredBubble.CORNER_SIZE=5;
OpenLayers.Renderer.SVG=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"http://www.w3.org/2000/svg",maxPixel:15000,localResolution:null,initialize:function(_519){
if(!this.supported()){
return;
}
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _51a="http://www.w3.org/TR/SVG11/feature#SVG";
var _51b=(document.implementation&&(document.implementation.hasFeature("org.w3c.svg","1.0")||document.implementation.hasFeature(_51a,"1.1")));
return _51b;
},setExtent:function(_51c){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _51d=this.getResolution();
if(!this.localResolution||_51d!=this.localResolution){
this.left=-_51c.left/_51d;
this.top=_51c.top/_51d;
}
var left=0;
var top=0;
if(this.localResolution&&_51d==this.localResolution){
left=(this.left)-(-_51c.left/_51d);
top=(this.top)-(_51c.top/_51d);
}
this.localResolution=_51d;
var _520=left+" "+top+" "+_51c.getWidth()/_51d+" "+_51c.getHeight()/_51d;
this.rendererRoot.setAttributeNS(null,"viewBox",_520);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.setAttributeNS(null,"width",this.size.w);
this.rendererRoot.setAttributeNS(null,"height",this.size.h);
},getNodeType:function(_522){
var _523=null;
switch(_522.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_523="circle";
break;
case "OpenLayers.Geometry.Rectangle":
_523="rect";
break;
case "OpenLayers.Geometry.LineString":
_523="polyline";
break;
case "OpenLayers.Geometry.LinearRing":
_523="polygon";
break;
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_523="path";
break;
default:
break;
}
return _523;
},setStyle:function(node,_525,_526){
_525=_525||node._style;
_526=_526||node._options;
if(node._geometryClass=="OpenLayers.Geometry.Point"){
if(_525.externalGraphic){
var id=node.getAttributeNS(null,"id");
var x=node.getAttributeNS(null,"cx");
var y=node.getAttributeNS(null,"cy");
var _52a=node._featureId;
var _52b=node._geometryClass;
var _52c=node._style;
this.root.removeChild(node);
var node=this.createNode("image",id);
node._featureId=_52a;
node._geometryClass=_52b;
node._style=_52c;
this.root.appendChild(node);
if(_525.graphicWidth&&_525.graphicHeight){
node.setAttributeNS(null,"preserveAspectRatio","none");
}
var _52d=_525.graphicWidth||_525.graphicHeight;
var _52e=_525.graphicHeight||_525.graphicWidth;
_52d=_52d?_52d:_525.pointRadius*2;
_52e=_52e?_52e:_525.pointRadius*2;
node.setAttributeNS(null,"x",x-(0.5*_52d).toFixed());
node.setAttributeNS(null,"y",-y-(0.5*_52e).toFixed());
node.setAttributeNS(null,"width",_52d);
node.setAttributeNS(null,"height",_52e);
node.setAttributeNS("http://www.w3.org/1999/xlink","href",_525.externalGraphic);
node.setAttributeNS(null,"transform","scale(1,-1)");
node.setAttributeNS(null,"style","opacity: "+_525.fillOpacity);
}else{
node.setAttributeNS(null,"r",_525.pointRadius);
}
}
if(_526.isFilled){
node.setAttributeNS(null,"fill",_525.fillColor);
node.setAttributeNS(null,"fill-opacity",_525.fillOpacity);
}else{
node.setAttributeNS(null,"fill","none");
}
if(_526.isStroked){
node.setAttributeNS(null,"stroke",_525.strokeColor);
node.setAttributeNS(null,"stroke-opacity",_525.strokeOpacity);
node.setAttributeNS(null,"stroke-width",_525.strokeWidth);
node.setAttributeNS(null,"stroke-linecap",_525.strokeLinecap);
}else{
node.setAttributeNS(null,"stroke","none");
}
if(_525.pointerEvents){
node.setAttributeNS(null,"pointer-events",_525.pointerEvents);
}
if(_525.cursor){
node.setAttributeNS(null,"cursor",_525.cursor);
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
var _535=this.nodeFactory(id,"svg");
return _535;
},createRoot:function(){
var id=this.container.id+"_root";
var root=this.nodeFactory(id,"g");
root.setAttributeNS(null,"transform","scale(1, -1)");
return root;
},drawPoint:function(node,_539){
this.drawCircle(node,_539,1);
},drawCircle:function(node,_53b,_53c){
var _53d=this.getResolution();
var x=(_53b.x/_53d+this.left);
var y=(_53b.y/_53d-this.top);
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
node.setAttributeNS(null,"r",_53c);
}else{
this.root.removeChild(node);
}
},drawLineString:function(node,_542){
node.setAttributeNS(null,"points",this.getComponentsString(_542.components));
},drawLinearRing:function(node,_544){
node.setAttributeNS(null,"points",this.getComponentsString(_544.components));
},drawPolygon:function(node,_546){
var d="";
var draw=true;
for(var j=0;j<_546.components.length;j++){
var _54a=_546.components[j];
d+=" M";
for(var i=0;i<_54a.components.length;i++){
var _54c=this.getShortString(_54a.components[i]);
if(_54c){
d+=" "+_54c;
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
},drawRectangle:function(node,_54e){
var x=(_54e.x/resolution+this.left);
var y=(_54e.y/resolution-this.top);
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
node.setAttributeNS(null,"width",_54e.width);
node.setAttributeNS(null,"height",_54e.height);
}else{
node.setAttributeNS(null,"x","");
node.setAttributeNS(null,"y","");
node.setAttributeNS(null,"width",0);
node.setAttributeNS(null,"height",0);
}
},drawCurve:function(node,_553){
var d=null;
var draw=true;
for(var i=0;i<_553.components.length;i++){
if((i%3)==0&&(i/3)==0){
var _557=this.getShortString(_553.components[i]);
if(!_557){
draw=false;
}
d="M "+_557;
}else{
if((i%3)==1){
var _557=this.getShortString(_553.components[i]);
if(!_557){
draw=false;
}
d+=" C "+_557;
}else{
var _557=this.getShortString(_553.components[i]);
if(!_557){
draw=false;
}
d+=" "+_557;
}
}
}
if(draw){
node.setAttributeNS(null,"d",d);
}else{
node.setAttributeNS(null,"d","");
}
},drawSurface:function(node,_559){
var d=null;
var draw=true;
for(var i=0;i<_559.components.length;i++){
if((i%3)==0&&(i/3)==0){
var _55d=this.getShortString(_559.components[i]);
if(!_55d){
draw=false;
}
d="M "+_55d;
}else{
if((i%3)==1){
var _55d=this.getShortString(_559.components[i]);
if(!_55d){
draw=false;
}
d+=" C "+_55d;
}else{
var _55d=this.getShortString(_559.components[i]);
if(!_55d){
draw=false;
}
d+=" "+_55d;
}
}
}
d+=" Z";
if(draw){
node.setAttributeNS(null,"d",d);
}else{
node.setAttributeNS(null,"d","");
}
},getComponentsString:function(_55e){
var _55f=[];
for(var i=0;i<_55e.length;i++){
var _561=this.getShortString(_55e[i]);
if(_561){
_55f.push(_561);
}
}
return _55f.join(",");
},getShortString:function(_562){
var _563=this.getResolution();
var x=(_562.x/_563+this.left);
var y=(_562.y/_563-this.top);
if(x<-this.maxPixel||x>this.maxPixel){
return false;
}
if(y<-this.maxPixel||y>this.maxPixel){
return false;
}
var _566=x+","+y;
return _566;
},CLASS_NAME:"OpenLayers.Renderer.SVG"});
OpenLayers.Renderer.VML=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"urn:schemas-microsoft-com:vml",initialize:function(_567){
if(!this.supported()){
return;
}
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
var _568=document.createStyleSheet();
_568.addRule("v\\:*","behavior: url(#default#VML); "+"position: relative; display: inline-block;");
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _569=document.namespaces;
return _569;
},setExtent:function(_56a){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _56b=this.getResolution();
var org=_56a.left/_56b+" "+_56a.top/_56b;
this.root.setAttribute("coordorigin",org);
var size=_56a.getWidth()/_56b+" "+-_56a.getHeight()/_56b;
this.root.setAttribute("coordsize",size);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.style.width=this.size.w;
this.rendererRoot.style.height=this.size.h;
this.root.style.width="100%";
this.root.style.height="100%";
},getNodeType:function(_56f){
var _570=null;
switch(_56f.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_570="v:oval";
break;
case "OpenLayers.Geometry.Rectangle":
_570="v:rect";
break;
case "OpenLayers.Geometry.LineString":
case "OpenLayers.Geometry.LinearRing":
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_570="v:shape";
break;
default:
break;
}
return _570;
},setStyle:function(node,_572,_573,_574){
_572=_572||node._style;
_573=_573||node._options;
if(node._geometryClass=="OpenLayers.Geometry.Point"){
if(_572.externalGraphic){
var id=node.id;
var _576=node._featureId;
var _577=node._geometryClass;
var _578=node._style;
this.root.removeChild(node);
var node=this.createNode("v:rect",id);
var fill=this.createNode("v:fill",id+"_image");
node.appendChild(fill);
node._featureId=_576;
node._geometryClass=_577;
node._style=_578;
this.root.appendChild(node);
fill.src=_572.externalGraphic;
fill.type="frame";
node.style.flip="y";
if(!(_572.graphicWidth&&_572.graphicHeight)){
fill.aspect="atmost";
}
var _57a=_572.graphicWidth||_572.graphicHeight;
var _57b=_572.graphicHeight||_572.graphicWidth;
_57a=_57a?_57a:_572.pointRadius*2;
_57b=_57b?_57b:_572.pointRadius*2;
var _57c=this.getResolution();
node.style.left=(_574.x/_57c-0.5*_57a).toFixed();
node.style.top=(_574.y/_57c-0.5*_57b).toFixed();
node.style.width=_57a;
node.style.height=_57b;
_572.fillColor="none";
_572.strokeColor="none";
}else{
this.drawCircle(node,_574,_572.pointRadius);
}
}
var _57d=(_573.isFilled)?_572.fillColor:"none";
node.setAttribute("fillcolor",_57d);
var _57e=node.getElementsByTagName("fill");
var fill=(_57e.length==0)?null:_57e[0];
if(!_573.isFilled){
if(fill){
node.removeChild(fill);
}
}else{
if(!fill){
fill=this.createNode("v:fill",node.id+"_fill");
node.appendChild(fill);
}
if(_572.fillOpacity){
fill.setAttribute("opacity",_572.fillOpacity);
}
}
var _57f=(_573.isStroked)?_572.strokeColor:"none";
node.setAttribute("strokecolor",_57f);
node.setAttribute("strokeweight",_572.strokeWidth);
var _580=node.getElementsByTagName("stroke");
var _581=(_580.length==0)?null:_580[0];
if(!_573.isStroked){
if(_581){
node.removeChild(_581);
}
}else{
if(!_581){
_581=this.createNode("v:stroke",node.id+"_stroke");
node.appendChild(_581);
}
_581.setAttribute("opacity",_572.strokeOpacity);
_581.setAttribute("endcap",!_572.strokeLinecap||_572.strokeLinecap=="butt"?"flat":_572.strokeLinecap);
}
if(_572.cursor){
node.style.cursor=_572.cursor;
}
},setNodeDimension:function(node,_583){
var bbox=_583.getBounds();
var _585=this.getResolution();
var _586=new OpenLayers.Bounds((bbox.left/_585).toFixed(),(bbox.bottom/_585).toFixed(),(bbox.right/_585).toFixed(),(bbox.top/_585).toFixed());
node.style.left=_586.left;
node.style.top=_586.top;
node.style.width=_586.getWidth();
node.style.height=_586.getHeight();
node.coordorigin=_586.left+" "+_586.top;
node.coordsize=_586.getWidth()+" "+_586.getHeight();
},createNode:function(type,id){
var node=document.createElement(type);
if(id){
node.setAttribute("id",id);
}
return node;
},nodeTypeCompare:function(node,type){
var _58c=type;
var _58d=_58c.indexOf(":");
if(_58d!=-1){
_58c=_58c.substr(_58d+1);
}
var _58e=node.nodeName;
_58d=_58e.indexOf(":");
if(_58d!=-1){
_58e=_58e.substr(_58d+1);
}
return (_58c==_58e);
},createRenderRoot:function(){
var id=this.container.id+"_vmlRoot";
var _590=this.nodeFactory(id,"div");
return _590;
},createRoot:function(){
var id=this.container.id+"_root";
var root=this.nodeFactory(id,"v:group");
return root;
},drawPoint:function(node,_594){
this.drawCircle(node,_594,1);
},drawCircle:function(node,_596,_597){
var _598=this.getResolution();
node.style.left=(_596.x/_598).toFixed()-_597;
node.style.top=(_596.y/_598).toFixed()-_597;
var _599=_597*2;
node.style.width=_599;
node.style.height=_599;
},drawLineString:function(node,_59b){
this.drawLine(node,_59b,false);
},drawLinearRing:function(node,_59d){
this.drawLine(node,_59d,true);
},drawLine:function(node,_59f,_5a0){
this.setNodeDimension(node,_59f);
var _5a1=this.getResolution();
var path="m";
for(var i=0;i<_59f.components.length;i++){
var x=(_59f.components[i].x/_5a1);
var y=(_59f.components[i].y/_5a1);
path+=" "+x.toFixed()+","+y.toFixed()+" l ";
}
if(_5a0){
path+=" x";
}
path+=" e";
node.path=path;
},drawPolygon:function(node,_5a7){
this.setNodeDimension(node,_5a7);
var _5a8=this.getResolution();
var path="";
for(var j=0;j<_5a7.components.length;j++){
var _5ab=_5a7.components[j];
path+="m";
for(var i=0;i<_5ab.components.length;i++){
var x=_5ab.components[i].x/_5a8;
var y=_5ab.components[i].y/_5a8;
path+=" "+x.toFixed()+","+y.toFixed();
if(i==0){
path+=" l";
}
}
path+=" x ";
}
path+="e";
node.path=path;
},drawRectangle:function(node,_5b0){
var _5b1=this.getResolution();
node.style.left=_5b0.x/_5b1;
node.style.top=_5b0.y/_5b1;
node.style.width=_5b0.width/_5b1;
node.style.height=_5b0.height/_5b1;
},drawCurve:function(node,_5b3){
this.setNodeDimension(node,_5b3);
var _5b4=this.getResolution();
var path="";
for(var i=0;i<_5b3.components.length;i++){
var x=_5b3.components[i].x/_5b4;
var y=_5b3.components[i].y/_5b4;
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
},drawSurface:function(node,_5ba){
this.setNodeDimension(node,_5ba);
var _5bb=this.getResolution();
var path="";
for(var i=0;i<_5ba.components.length;i++){
var x=_5ba.components[i].x/_5bb;
var y=_5ba.components[i].y/_5bb;
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
OpenLayers.Tile.Image=OpenLayers.Class(OpenLayers.Tile,{url:null,imgDiv:null,frame:null,initialize:function(_5c0,_5c1,_5c2,url,size){
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
var _5c5=this.layer.getImageSize();
if(this.layer.alpha){
OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,null,null,_5c5,this.url);
}else{
this.imgDiv.src=this.url;
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,_5c5);
}
this.drawn=true;
return true;
},clear:function(){
OpenLayers.Tile.prototype.clear.apply(this,arguments);
if(this.imgDiv){
this.imgDiv.style.display="none";
}
},moveTo:function(_5c6,_5c7,_5c8){
if(this.layer!=this.layer.map.baseLayer&&this.layer.reproject){
_5c6=this.getBoundsFromBaseLayer(_5c7);
}
this.url=this.layer.getURL(_5c6);
OpenLayers.Tile.prototype.moveTo.apply(this,arguments);
},initImgDiv:function(){
var _5c9=this.layer.imageOffset;
var size=this.layer.getImageSize();
if(this.layer.alpha){
this.imgDiv=OpenLayers.Util.createAlphaImageDiv(null,_5c9,size,null,"relative",null,null,null,true);
}else{
this.imgDiv=OpenLayers.Util.createImage(null,_5c9,size,null,"relative",null,null,true);
}
this.imgDiv.className="olTileImage";
this.frame.appendChild(this.imgDiv);
this.layer.div.appendChild(this.frame);
if(this.layer.opacity!=null){
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,null,null,null,null,this.layer.opacity);
}
this.imgDiv.map=this.layer.map;
var _5cb=function(){
if(this.isLoading){
this.isLoading=false;
this.events.triggerEvent("loadend");
}
};
OpenLayers.Event.observe(this.imgDiv,"load",_5cb.bind(this));
},checkImgURL:function(){
if(this.layer){
var _5cc=this.layer.alpha?this.imgDiv.firstChild.src:this.imgDiv.src;
if(!OpenLayers.Util.isEquivalentUrl(_5cc,this.url)){
this.imgDiv.style.display="none";
}
}
},CLASS_NAME:"OpenLayers.Tile.Image"});
OpenLayers.Tile.WFS=OpenLayers.Class(OpenLayers.Tile,{features:null,url:null,initialize:function(_5cd,_5ce,_5cf,url,size){
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
this.loadFeaturesForRegion(this.requestSuccess);
}
},loadFeaturesForRegion:function(_5d2,_5d3){
OpenLayers.loadURL(this.url,null,this,_5d2);
},requestSuccess:function(_5d4){
var doc=_5d4.responseXML;
if(!doc||_5d4.fileType!="XML"){
doc=OpenLayers.parseXMLString(_5d4.responseText);
}
if(this.layer.vectorMode){
var gml=new OpenLayers.Format.GML({extractAttributes:this.layer.options.extractAttributes});
this.layer.addFeatures(gml.read(doc));
}else{
var _5d7=OpenLayers.Ajax.getElementsByTagNameNS(doc,"http://www.opengis.net/gml","gml","featureMember");
this.addResults(_5d7);
}
},addResults:function(_5d8){
for(var i=0;i<_5d8.length;i++){
var _5da=new this.layer.featureClass(this.layer,_5d8[i]);
this.features.push(_5da);
}
},destroyAllFeatures:function(){
while(this.features.length>0){
var _5db=this.features.shift();
_5db.destroy();
}
},CLASS_NAME:"OpenLayers.Tile.WFS"});
OpenLayers.Feature=OpenLayers.Class({events:null,layer:null,id:null,lonlat:null,data:null,marker:null,popup:null,initialize:function(_5dc,_5dd,data){
this.layer=_5dc;
this.lonlat=_5dd;
this.data=(data!=null)?data:{};
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},destroy:function(){
if((this.layer!=null)&&(this.layer.map!=null)){
if(this.popup!=null){
this.layer.map.removePopup(this.popup);
}
}
if(this.events){
this.events.destroy();
}
this.events=null;
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
var _5df=false;
if((this.layer!=null)&&(this.layer.map!=null)){
var _5e0=this.layer.map.getExtent();
_5df=_5e0.containsLonLat(this.lonlat);
}
return _5df;
},createMarker:function(){
if(this.lonlat!=null){
this.marker=new OpenLayers.Marker(this.lonlat,this.data.icon);
}
return this.marker;
},destroyMarker:function(){
this.marker.destroy();
},createPopup:function(_5e1){
if(this.lonlat!=null){
var id=this.id+"_popup";
var _5e3=(this.marker)?this.marker.icon:null;
this.popup=new OpenLayers.Popup.AnchoredBubble(id,this.lonlat,this.data.popupSize,this.data.popupContentHTML,_5e3,_5e1);
}
return this.popup;
},destroyPopup:function(){
this.popup.destroy();
},CLASS_NAME:"OpenLayers.Feature"});
OpenLayers.Handler.Drag=OpenLayers.Class(OpenLayers.Handler,{started:false,dragging:false,last:null,start:null,oldOnselectstart:null,initialize:function(_5e4,_5e5,_5e6){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},mousedown:function(evt){
if(this.checkModifiers(evt)&&OpenLayers.Event.isLeftClick(evt)){
this.started=true;
this.dragging=false;
this.start=evt.xy;
this.last=evt.xy;
this.map.div.style.cursor="move";
this.callback("down",[evt.xy]);
OpenLayers.Event.stop(evt);
return false;
}
return true;
},mousemove:function(evt){
if(this.started){
if(evt.xy.x!=this.last.x||evt.xy.y!=this.last.y){
this.dragging=true;
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
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
this.dragging=false;
return true;
}else{
return false;
}
},deactivate:function(){
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
this.dragging=false;
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.Drag"});
OpenLayers.Handler.Feature=OpenLayers.Class(OpenLayers.Handler,{layerIndex:null,feature:null,initialize:function(_5ec,_5ed,_5ee,_5ef){
OpenLayers.Handler.prototype.initialize.apply(this,[_5ec,_5ee,_5ef]);
this.layer=_5ed;
},mousedown:function(evt){
var _5f1=this.select("down",evt);
return !_5f1;
},mousemove:function(evt){
this.select("move",evt);
return true;
},mouseup:function(evt){
var _5f4=this.select("up",evt);
return !_5f4;
},dblclick:function(evt){
var _5f6=this.select("dblclick",evt);
return !_5f6;
},select:function(type,evt){
var _5f9=this.layer.getFeatureFromEvent(evt);
if(_5f9){
if(!this.feature){
this.callback("over",[_5f9]);
}else{
if(this.feature!=_5f9){
this.callback("out",[this.feature]);
this.callback("over",[_5f9]);
}
}
this.feature=_5f9;
this.callback(type,[_5f9]);
return true;
}else{
if(this.feature){
this.callback("out",[this.feature]);
this.feature=null;
}
return false;
}
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
this.layer.div.style.zIndex=this.layerIndex;
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.Feature"});
OpenLayers.Handler.Keyboard=OpenLayers.Class(OpenLayers.Handler,{KEY_EVENTS:["keydown","keypress","keyup"],eventListener:null,initialize:function(){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
this.eventListener=this.handleKeyEvent.bindAsEventListener(this);
},destroy:function(){
this.deactivate();
this.eventListener=null;
OpenLayers.Control.prototype.destroy.apply(this,arguments);
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
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
for(var i=0;i<this.KEY_EVENTS.length;i++){
OpenLayers.Event.stopObserving(document,this.KEY_EVENTS[i],this.eventListener);
}
return true;
}else{
return false;
}
},handleKeyEvent:function(evt){
if(this.checkModifiers(evt)){
this.callback(evt.type,[evt.charCode||evt.keyCode]);
}
},CLASS_NAME:"OpenLayers.Handler.Keyboard"});
OpenLayers.Handler.MouseWheel=OpenLayers.Class(OpenLayers.Handler,{wheelListener:null,mousePosition:null,initialize:function(_5fd,_5fe,_5ff){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
this.wheelListener=this.onWheelEvent.bindAsEventListener(this);
},destroy:function(){
this.deactivate();
this.wheelListener=null;
OpenLayers.Handler.prototype.destroy.apply(this,arguments);
},onWheelEvent:function(e){
if(!this.checkModifiers(e)){
return;
}
var _601=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_601=true;
break;
}
elem=elem.parentNode;
}
if(_601){
var _603=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_603=e.wheelDelta/120;
if(window.opera){
_603=-_603;
}
}else{
if(e.detail){
_603=-e.detail/3;
}
}
if(_603){
e.xy=this.mousePosition;
if(_603<0){
this.callback("down",[e,_603]);
}else{
this.callback("up",[e,_603]);
}
}
OpenLayers.Event.stop(e);
}
},mousemove:function(evt){
this.mousePosition=evt.xy;
},activate:function(evt){
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
var _606=this.wheelListener;
OpenLayers.Event.observe(window,"DOMMouseScroll",_606);
OpenLayers.Event.observe(window,"mousewheel",_606);
OpenLayers.Event.observe(document,"mousewheel",_606);
return true;
}else{
return false;
}
},deactivate:function(evt){
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
var _608=this.wheelListener;
OpenLayers.Event.stopObserving(window,"DOMMouseScroll",_608);
OpenLayers.Event.stopObserving(window,"mousewheel",_608);
OpenLayers.Event.stopObserving(document,"mousewheel",_608);
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.MouseWheel"});
OpenLayers.Layer=OpenLayers.Class({id:null,name:null,div:null,EVENT_TYPES:["loadstart","loadend","loadcancel"],events:null,map:null,isBaseLayer:false,alpha:false,displayInLayerSwitcher:true,visibility:true,inRange:false,imageSize:null,imageOffset:null,options:null,gutter:0,projection:null,units:null,scales:null,resolutions:null,maxExtent:null,minExtent:null,maxResolution:null,minResolution:null,numZoomLevels:null,minScale:null,maxScale:null,displayOutsideMaxExtent:false,wrapDateLine:false,initialize:function(name,_60a){
this.addOptions(_60a);
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
},destroy:function(_60b){
if(_60b==null){
_60b=true;
}
if(this.map!=null){
this.map.removeLayer(this,_60b);
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
},setName:function(_60d){
if(_60d!=this.name){
this.name=_60d;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
}
},addOptions:function(_60e){
if(this.options==null){
this.options={};
}
OpenLayers.Util.extend(this.options,_60e);
OpenLayers.Util.extend(this,_60e);
},onMapResize:function(){
},redraw:function(){
var _60f=false;
if(this.map){
this.inRange=this.calculateInRange();
var _610=this.getExtent();
if(_610&&this.inRange&&this.visibility){
this.moveTo(_610,true,false);
_60f=true;
}
}
return _60f;
},moveTo:function(_611,_612,_613){
var _614=this.visibility;
if(!this.isBaseLayer){
_614=_614&&this.inRange;
}
this.display(_614);
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
},getImageSize:function(){
return (this.imageSize||this.tileSize);
},setTileSize:function(size){
var _618=(size)?size:((this.tileSize)?this.tileSize:this.map.getTileSize());
this.tileSize=_618;
if(this.gutter){
this.imageOffset=new OpenLayers.Pixel(-this.gutter,-this.gutter);
this.imageSize=new OpenLayers.Size(_618.w+(2*this.gutter),_618.h+(2*this.gutter));
}
},getVisibility:function(){
return this.visibility;
},setVisibility:function(_619,_61a){
if(_619!=this.visibility){
this.visibility=_619;
this.display(_619);
this.redraw();
if((this.map!=null)&&((_61a==null)||(_61a==false))){
this.map.events.triggerEvent("changelayer");
}
}
},display:function(_61b){
if(_61b!=(this.div.style.display!="none")){
this.div.style.display=(_61b)?"block":"none";
}
},calculateInRange:function(){
var _61c=false;
if(this.map){
var _61d=this.map.getResolution();
_61c=((_61d>=this.minResolution)&&(_61d<=this.maxResolution));
}
return _61c;
},setIsBaseLayer:function(_61e){
if(_61e!=this.isBaseLayer){
this.isBaseLayer=_61e;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
}
},initResolutions:function(){
var _61f=new Array("projection","units","scales","resolutions","maxScale","minScale","maxResolution","minResolution","minExtent","maxExtent","numZoomLevels","maxZoomLevel");
var _620={};
for(var i=0;i<_61f.length;i++){
var _622=_61f[i];
_620[_622]=this.options[_622]||this.map[_622];
}
if((!_620.numZoomLevels)&&(_620.maxZoomLevel)){
_620.numZoomLevels=_620.maxZoomLevel+1;
}
if((_620.scales!=null)||(_620.resolutions!=null)){
if(_620.scales!=null){
_620.resolutions=[];
for(var i=0;i<_620.scales.length;i++){
var _623=_620.scales[i];
_620.resolutions[i]=OpenLayers.Util.getResolutionFromScale(_623,_620.units);
}
}
_620.numZoomLevels=_620.resolutions.length;
}else{
_620.resolutions=[];
if(_620.minScale){
_620.maxResolution=OpenLayers.Util.getResolutionFromScale(_620.minScale,_620.units);
}else{
if(_620.maxResolution=="auto"){
var _624=this.map.getSize();
var wRes=_620.maxExtent.getWidth()/_624.w;
var hRes=_620.maxExtent.getHeight()/_624.h;
_620.maxResolution=Math.max(wRes,hRes);
}
}
if(_620.maxScale!=null){
_620.minResolution=OpenLayers.Util.getResolutionFromScale(_620.maxScale);
}else{
if((_620.minResolution=="auto")&&(_620.minExtent!=null)){
var _624=this.map.getSize();
var wRes=_620.minExtent.getWidth()/_624.w;
var hRes=_620.minExtent.getHeight()/_624.h;
_620.minResolution=Math.max(wRes,hRes);
}
}
if(_620.minResolution!=null){
var _627=_620.maxResolution/_620.minResolution;
_620.numZoomLevels=Math.floor(Math.log(_627)/Math.log(2))+1;
}
for(var i=0;i<_620.numZoomLevels;i++){
var res=_620.maxResolution/Math.pow(2,i);
_620.resolutions.push(res);
}
}
_620.resolutions.sort(function(a,b){
return (b-a);
});
this.resolutions=_620.resolutions;
this.maxResolution=_620.resolutions[0];
var _62b=_620.resolutions.length-1;
this.minResolution=_620.resolutions[_62b];
this.scales=[];
for(var i=0;i<_620.resolutions.length;i++){
this.scales[i]=OpenLayers.Util.getScaleFromResolution(_620.resolutions[i],_620.units);
}
this.minScale=this.scales[0];
this.maxScale=this.scales[this.scales.length-1];
this.numZoomLevels=_620.numZoomLevels;
},getResolution:function(){
var zoom=this.map.getZoom();
return this.resolutions[zoom];
},getExtent:function(){
return this.map.calculateBounds();
},getZoomForExtent:function(_62d){
var _62e=this.map.getSize();
var _62f=Math.max(_62d.getWidth()/_62e.w,_62d.getHeight()/_62e.h);
return this.getZoomForResolution(_62f);
},getZoomForResolution:function(_630){
for(var i=1;i<this.resolutions.length;i++){
if(this.resolutions[i]<_630){
break;
}
}
return (i-1);
},getLonLatFromViewPortPx:function(_632){
var _633=null;
if(_632!=null){
var size=this.map.getSize();
var _635=this.map.getCenter();
if(_635){
var res=this.map.getResolution();
var _637=_632.x-(size.w/2);
var _638=_632.y-(size.h/2);
_633=new OpenLayers.LonLat(_635.lon+_637*res,_635.lat-_638*res);
if(this.wrapDateLine){
_633=_633.wrapDateLine(this.maxExtent);
}
}
}
return _633;
},getViewPortPxFromLonLat:function(_639){
var px=null;
if(_639!=null){
var _63b=this.map.getResolution();
var _63c=this.map.getExtent();
px=new OpenLayers.Pixel(Math.round(1/_63b*(_639.lon-_63c.left)),Math.round(1/_63b*(_63c.top-_639.lat)));
}
return px;
},setOpacity:function(_63d){
if(_63d!=this.opacity){
this.opacity=_63d;
for(var i=0;i<this.div.childNodes.length;++i){
var _63f=this.div.childNodes[i].firstChild;
OpenLayers.Util.modifyDOMElement(_63f,null,null,null,null,null,null,_63d);
}
}
},setZIndex:function(_640){
this.div.style.zIndex=_640;
},adjustBounds:function(_641){
if(this.gutter){
var _642=this.gutter*this.map.getResolution();
_641=new OpenLayers.Bounds(_641.left-_642,_641.bottom-_642,_641.right+_642,_641.top+_642);
}
if(this.wrapDateLine){
var _643={"rightTolerance":this.getResolution()};
_641=_641.wrapDateLine(this.maxExtent,_643);
}
return _641;
},CLASS_NAME:"OpenLayers.Layer"});
OpenLayers.Marker.Box=OpenLayers.Class(OpenLayers.Marker,{bounds:null,div:null,initialize:function(_644,_645,_646){
this.bounds=_644;
this.div=OpenLayers.Util.createDiv();
this.div.style.overflow="hidden";
this.events=new OpenLayers.Events(this,this.div,null);
this.setBorder(_645,_646);
},destroy:function(){
this.bounds=null;
this.div=null;
OpenLayers.Marker.prototype.destroy.apply(this,arguments);
},setBorder:function(_647,_648){
if(!_647){
_647="red";
}
if(!_648){
_648=2;
}
this.div.style.border=_648+"px solid "+_647;
},draw:function(px,sz){
OpenLayers.Util.modifyDOMElement(this.div,null,px,sz);
return this.div;
},onScreen:function(){
var _64b=false;
if(this.map){
var _64c=this.map.getExtent();
_64b=_64c.containsBounds(this.bounds,true,true);
}
return _64b;
},display:function(_64d){
this.div.style.display=(_64d)?"":"none";
},CLASS_NAME:"OpenLayers.Marker.Box"});
OpenLayers.Control.DragPan=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,panned:false,draw:function(){
this.handler=new OpenLayers.Handler.Drag(this,{"move":this.panMap,"done":this.panMapDone});
},panMap:function(xy){
this.panned=true;
var _64f=this.handler.last.x-xy.x;
var _650=this.handler.last.y-xy.y;
var size=this.map.getSize();
var _652=new OpenLayers.Pixel(size.w/2+_64f,size.h/2+_650);
var _653=this.map.getLonLatFromViewPortPx(_652);
this.map.setCenter(_653,null,this.handler.dragging);
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
OpenLayers.Feature.Vector=OpenLayers.Class(OpenLayers.Feature,{fid:null,geometry:null,attributes:null,state:null,style:null,initialize:function(_657,_658,_659){
OpenLayers.Feature.prototype.initialize.apply(this,[null,null,_658]);
this.lonlat=null;
this.geometry=_657;
this.state=null;
this.attributes={};
if(_658){
this.attributes=OpenLayers.Util.extend(this.attributes,_658);
}
this.style=_659?_659:null;
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
},atPoint:function(_65a,_65b,_65c){
var _65d=false;
if(this.geometry){
_65d=this.geometry.atPoint(_65a,_65b,_65c);
}
return _65d;
},destroyPopup:function(){
},toState:function(_65e){
if(_65e==OpenLayers.State.UPDATE){
switch(this.state){
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.DELETE:
this.state=_65e;
break;
case OpenLayers.State.UPDATE:
case OpenLayers.State.INSERT:
break;
}
}else{
if(_65e==OpenLayers.State.INSERT){
switch(this.state){
case OpenLayers.State.UNKNOWN:
break;
default:
this.state=_65e;
break;
}
}else{
if(_65e==OpenLayers.State.DELETE){
switch(this.state){
case OpenLayers.State.INSERT:
break;
case OpenLayers.State.DELETE:
break;
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.UPDATE:
this.state=_65e;
break;
}
}else{
if(_65e==OpenLayers.State.UNKNOWN){
this.state=_65e;
}
}
}
}
},CLASS_NAME:"OpenLayers.Feature.Vector"});
OpenLayers.Feature.Vector.style={"default":{fillColor:"#ee9900",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"#ee9900",strokeOpacity:1,strokeWidth:1,strokeLinecap:"round",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"},"select":{fillColor:"blue",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"blue",strokeOpacity:1,strokeWidth:2,strokeLinecap:"round",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted",cursor:"pointer"},"temporary":{fillColor:"yellow",fillOpacity:0.2,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"yellow",strokeOpacity:1,strokeLinecap:"round",strokeWidth:4,hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"}};
OpenLayers.Feature.WFS=OpenLayers.Class(OpenLayers.Feature,{initialize:function(_65f,_660){
var _661=arguments;
var data=this.processXMLNode(_660);
_661=new Array(_65f,data.lonlat,data);
OpenLayers.Feature.prototype.initialize.apply(this,_661);
this.createMarker();
this.layer.addMarker(this.marker);
},destroy:function(){
if(this.marker!=null){
this.layer.removeMarker(this.marker);
}
OpenLayers.Feature.prototype.destroy.apply(this,arguments);
},processXMLNode:function(_663){
var _664=OpenLayers.Ajax.getElementsByTagNameNS(_663,"http://www.opengis.net/gml","gml","Point");
var text=OpenLayers.Util.getXmlNodeValue(OpenLayers.Ajax.getElementsByTagNameNS(_664[0],"http://www.opengis.net/gml","gml","coordinates")[0]);
var _666=text.split(",");
return {lonlat:new OpenLayers.LonLat(parseFloat(_666[0]),parseFloat(_666[1])),id:null};
},CLASS_NAME:"OpenLayers.Feature.WFS"});
OpenLayers.Handler.Box=OpenLayers.Class(OpenLayers.Handler,{dragHandler:null,initialize:function(_667,_668,_669){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
var _668={"down":this.startBox,"move":this.moveBox,"out":this.removeBox,"up":this.endBox};
this.dragHandler=new OpenLayers.Handler.Drag(this,_668,{keyMask:this.keyMask});
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
var _66d=Math.abs(this.dragHandler.start.x-xy.x);
var _66e=Math.abs(this.dragHandler.start.y-xy.y);
this.zoomBox.style.width=Math.max(1,_66d)+"px";
this.zoomBox.style.height=Math.max(1,_66e)+"px";
if(xy.x<this.dragHandler.start.x){
this.zoomBox.style.left=xy.x+"px";
}
if(xy.y<this.dragHandler.start.y){
this.zoomBox.style.top=xy.y+"px";
}
},endBox:function(end){
var _670;
if(Math.abs(this.dragHandler.start.x-end.x)>5||Math.abs(this.dragHandler.start.y-end.y)>5){
var _671=this.dragHandler.start;
var top=Math.min(_671.y,end.y);
var _673=Math.max(_671.y,end.y);
var left=Math.min(_671.x,end.x);
var _675=Math.max(_671.x,end.x);
_670=new OpenLayers.Bounds(left,_673,_675,top);
}else{
_670=this.dragHandler.start.clone();
}
this.removeBox();
this.map.div.style.cursor="";
this.callback("done",[_670]);
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
OpenLayers.Layer.EventPane=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:true,isFixed:true,pane:null,mapObject:null,initialize:function(name,_677){
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
},loadWarningMessage:function(){
this.div.style.backgroundColor="darkblue";
var _679=this.map.getSize();
msgW=Math.min(_679.w,300);
msgH=Math.min(_679.h,200);
var size=new OpenLayers.Size(msgW,msgH);
var _67b=new OpenLayers.Pixel(_679.w/2,_679.h/2);
var _67c=_67b.add(-size.w/2,-size.h/2);
var div=OpenLayers.Util.createDiv(this.name+"_warning",_67c,size,null,null,null,"auto");
div.style.padding="7px";
div.style.backgroundColor="yellow";
div.innerHTML=this.getWarningHTML();
this.div.appendChild(div);
},getWarningHTML:function(){
return "";
},display:function(_67e){
OpenLayers.Layer.prototype.display.apply(this,arguments);
this.pane.style.display=this.div.style.display;
},setZIndex:function(_67f){
OpenLayers.Layer.prototype.setZIndex.apply(this,arguments);
this.pane.style.zIndex=parseInt(this.div.style.zIndex)+1;
},moveTo:function(_680,_681,_682){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(this.mapObject!=null){
var _683=this.map.getCenter();
var _684=this.map.getZoom();
if(_683!=null){
var _685=this.getMapObjectCenter();
var _686=this.getOLLonLatFromMapObjectLonLat(_685);
var _687=this.getMapObjectZoom();
var _688=this.getOLZoomFromMapObjectZoom(_687);
if(!(_683.equals(_686))||!(_684==_688)){
var _689=this.getMapObjectLonLatFromOLLonLat(_683);
var zoom=this.getMapObjectZoomFromOLZoom(_684);
this.setMapObjectCenter(_689,zoom);
}
}
}
},getLonLatFromViewPortPx:function(_68b){
var _68c=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _68d=this.getMapObjectPixelFromOLPixel(_68b);
var _68e=this.getMapObjectLonLatFromMapObjectPixel(_68d);
_68c=this.getOLLonLatFromMapObjectLonLat(_68e);
}
return _68c;
},getViewPortPxFromLonLat:function(_68f){
var _690=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _691=this.getMapObjectLonLatFromOLLonLat(_68f);
var _692=this.getMapObjectPixelFromMapObjectLonLat(_691);
_690=this.getOLPixelFromMapObjectPixel(_692);
}
return _690;
},getOLLonLatFromMapObjectLonLat:function(_693){
var _694=null;
if(_693!=null){
var lon=this.getLongitudeFromMapObjectLonLat(_693);
var lat=this.getLatitudeFromMapObjectLonLat(_693);
_694=new OpenLayers.LonLat(lon,lat);
}
return _694;
},getMapObjectLonLatFromOLLonLat:function(_697){
var _698=null;
if(_697!=null){
_698=this.getMapObjectLonLatFromLonLat(_697.lon,_697.lat);
}
return _698;
},getOLPixelFromMapObjectPixel:function(_699){
var _69a=null;
if(_699!=null){
var x=this.getXFromMapObjectPixel(_699);
var y=this.getYFromMapObjectPixel(_699);
_69a=new OpenLayers.Pixel(x,y);
}
return _69a;
},getMapObjectPixelFromOLPixel:function(_69d){
var _69e=null;
if(_69d!=null){
_69e=this.getMapObjectPixelFromXY(_69d.x,_69d.y);
}
return _69e;
},CLASS_NAME:"OpenLayers.Layer.EventPane"});
OpenLayers.Layer.FixedZoomLevels=OpenLayers.Class({initialize:function(){
},initResolutions:function(){
var _69f=new Array("minZoomLevel","maxZoomLevel","numZoomLevels");
for(var i=0;i<_69f.length;i++){
var _6a1=_69f[i];
this[_6a1]=(this.options[_6a1]!=null)?this.options[_6a1]:this.map[_6a1];
}
if((this.minZoomLevel==null)||(this.minZoomLevel<this.MIN_ZOOM_LEVEL)){
this.minZoomLevel=this.MIN_ZOOM_LEVEL;
}
var _6a2=this.MAX_ZOOM_LEVEL-this.minZoomLevel+1;
if(this.numZoomLevels!=null){
this.numZoomLevels=Math.min(this.numZoomLevels,_6a2);
}else{
if(this.maxZoomLevel!=null){
var _6a3=this.maxZoomLevel-this.minZoomLevel+1;
this.numZoomLevels=Math.min(_6a3,_6a2);
}else{
this.numZoomLevels=_6a2;
}
}
this.maxZoomLevel=this.minZoomLevel+this.numZoomLevels-1;
if(this.RESOLUTIONS!=null){
var _6a4=0;
this.resolutions=[];
for(var i=this.minZoomLevel;i<this.numZoomLevels;i++){
this.resolutions[_6a4++]=this.RESOLUTIONS[i];
}
}
},getResolution:function(){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getResolution.apply(this,arguments);
}else{
var _6a5=null;
var _6a6=this.map.getSize();
var _6a7=this.getExtent();
if((_6a6!=null)&&(_6a7!=null)){
_6a5=Math.max(_6a7.getWidth()/_6a6.w,_6a7.getHeight()/_6a6.h);
}
return _6a5;
}
},getExtent:function(){
var _6a8=null;
var size=this.map.getSize();
var tlPx=new OpenLayers.Pixel(0,0);
var tlLL=this.getLonLatFromViewPortPx(tlPx);
var brPx=new OpenLayers.Pixel(size.w,size.h);
var brLL=this.getLonLatFromViewPortPx(brPx);
if((tlLL!=null)&&(brLL!=null)){
_6a8=new OpenLayers.Bounds(tlLL.lon,brLL.lat,brLL.lon,tlLL.lat);
}
return _6a8;
},getZoomForResolution:function(_6ae){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getZoomForResolution.apply(this,arguments);
}else{
var _6af=OpenLayers.Layer.prototype.getExtent.apply(this,[_6ae]);
return this.getZoomForExtent(_6af);
}
},getOLZoomFromMapObjectZoom:function(_6b0){
var zoom=null;
if(_6b0!=null){
zoom=_6b0-this.minZoomLevel;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_6b2){
var zoom=null;
if(_6b2!=null){
zoom=_6b2+this.minZoomLevel;
}
return zoom;
},CLASS_NAME:"FixedZoomLevels.js"});
OpenLayers.Layer.HTTPRequest=OpenLayers.Class(OpenLayers.Layer,{URL_HASH_FACTOR:(Math.sqrt(5)-1)/2,url:null,params:null,reproject:false,initialize:function(name,url,_6b6,_6b7){
var _6b8=arguments;
_6b8=[name,_6b7];
OpenLayers.Layer.prototype.initialize.apply(this,_6b8);
this.url=url;
this.params=OpenLayers.Util.extend({},_6b6);
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
},setUrl:function(_6ba){
this.url=_6ba;
},mergeNewParams:function(_6bb){
this.params=OpenLayers.Util.extend(this.params,_6bb);
this.redraw();
},selectUrl:function(_6bc,urls){
var _6be=1;
for(var i=0;i<_6bc.length;i++){
_6be*=_6bc.charCodeAt(i)*this.URL_HASH_FACTOR;
_6be-=Math.floor(_6be);
}
return urls[Math.floor(_6be*urls.length)];
},getFullRequestString:function(_6c0,_6c1){
var url=_6c1||this.url;
var _6c3=OpenLayers.Util.extend({},this.params);
_6c3=OpenLayers.Util.extend(_6c3,_6c0);
var _6c4=OpenLayers.Util.getParameterString(_6c3);
if(url instanceof Array){
url=this.selectUrl(_6c4,url);
}
var _6c5=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getArgs(url));
for(var key in _6c3){
if(key.toUpperCase() in _6c5){
delete _6c3[key];
}
}
_6c4=OpenLayers.Util.getParameterString(_6c3);
var _6c7=url;
if(_6c4!=""){
var _6c8=url.charAt(url.length-1);
if((_6c8=="&")||(_6c8=="?")){
_6c7+=_6c4;
}else{
if(url.indexOf("?")==-1){
_6c7+="?"+_6c4;
}else{
_6c7+="&"+_6c4;
}
}
}
return _6c7;
},CLASS_NAME:"OpenLayers.Layer.HTTPRequest"});
OpenLayers.Layer.Image=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:true,url:null,extent:null,size:null,tile:null,aspectRatio:null,initialize:function(name,url,_6cb,size,_6cd){
this.url=url;
this.extent=_6cb;
this.size=size;
OpenLayers.Layer.prototype.initialize.apply(this,[name,_6cd]);
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
},moveTo:function(_6d0,_6d1,_6d2){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
var _6d3=(this.tile==null);
if(_6d1||_6d3){
this.setTileSize();
var ul=new OpenLayers.LonLat(this.extent.left,this.extent.top);
var ulPx=this.map.getLayerPxFromLonLat(ul);
if(_6d3){
this.tile=new OpenLayers.Tile.Image(this,ulPx,this.extent,null,this.tileSize);
}else{
this.tile.size=this.tileSize.clone();
this.tile.position=ulPx.clone();
}
this.tile.draw();
}
},setTileSize:function(){
var _6d6=this.extent.getWidth()/this.map.getResolution();
var _6d7=this.extent.getHeight()/this.map.getResolution();
this.tileSize=new OpenLayers.Size(_6d6,_6d7);
},setUrl:function(_6d8){
this.url=_6d8;
this.draw();
},getURL:function(_6d9){
return this.url;
},CLASS_NAME:"OpenLayers.Layer.Image"});
OpenLayers.Layer.Markers=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:false,markers:null,drawn:false,initialize:function(name,_6db){
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
this.markers=[];
},destroy:function(){
this.clearMarkers();
this.markers=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},moveTo:function(_6dc,_6dd,_6de){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(_6dd||!this.drawn){
for(i=0;i<this.markers.length;i++){
this.drawMarker(this.markers[i]);
}
this.drawn=true;
}
},addMarker:function(_6df){
this.markers.push(_6df);
if(this.map&&this.map.getExtent()){
_6df.map=this.map;
this.drawMarker(_6df);
}
},removeMarker:function(_6e0){
OpenLayers.Util.removeItem(this.markers,_6e0);
if((_6e0.icon!=null)&&(_6e0.icon.imageDiv!=null)&&(_6e0.icon.imageDiv.parentNode==this.div)){
this.div.removeChild(_6e0.icon.imageDiv);
_6e0.drawn=false;
}
},clearMarkers:function(){
if(this.markers!=null){
while(this.markers.length>0){
this.removeMarker(this.markers[0]);
}
}
},drawMarker:function(_6e1){
var px=this.map.getLayerPxFromLonLat(_6e1.lonlat);
if(px==null){
_6e1.display(false);
}else{
var _6e3=_6e1.draw(px);
if(!_6e1.drawn){
this.div.appendChild(_6e3);
_6e1.drawn=true;
}
}
},CLASS_NAME:"OpenLayers.Layer.Markers"});
OpenLayers.Control.DrawFeature=OpenLayers.Class(OpenLayers.Control,{layer:null,callbacks:null,featureAdded:function(){
},handlerOptions:null,initialize:function(_6e4,_6e5,_6e6){
OpenLayers.Control.prototype.initialize.apply(this,[_6e6]);
this.callbacks=OpenLayers.Util.extend({done:this.drawFeature},this.callbacks);
this.layer=_6e4;
this.handler=new _6e5(this,this.callbacks,this.handlerOptions);
},drawFeature:function(_6e7){
var _6e8=new OpenLayers.Feature.Vector(_6e7);
this.layer.addFeatures([_6e8]);
this.featureAdded(_6e8);
},CLASS_NAME:"OpenLayers.Control.DrawFeature"});
OpenLayers.Control.SelectFeature=OpenLayers.Class(OpenLayers.Control,{multiple:false,hover:false,onSelect:function(){
},onUnselect:function(){
},layer:null,callbacks:null,selectStyle:OpenLayers.Feature.Vector.style["select"],handler:null,initialize:function(_6e9,_6ea){
OpenLayers.Control.prototype.initialize.apply(this,[_6ea]);
this.callbacks=OpenLayers.Util.extend({down:this.downFeature,over:this.overFeature,out:this.outFeature},this.callbacks);
this.layer=_6e9;
this.handler=new OpenLayers.Handler.Feature(this,_6e9,this.callbacks);
},downFeature:function(_6eb){
if(this.hover){
return;
}
if(this.multiple){
if(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_6eb)>-1){
this.unselect(_6eb);
}else{
this.select(_6eb);
}
}else{
if(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_6eb)>-1){
this.unselect(_6eb);
}else{
if(this.layer.selectedFeatures){
for(var i=0;i<this.layer.selectedFeatures.length;i++){
this.unselect(this.layer.selectedFeatures[i]);
}
}
this.select(_6eb);
}
}
},overFeature:function(_6ed){
if(!this.hover){
return;
}
if(!(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_6ed)>-1)){
this.select(_6ed);
}
},outFeature:function(_6ee){
if(!this.hover){
return;
}
this.unselect(_6ee);
},select:function(_6ef){
if(_6ef.originalStyle==null){
_6ef.originalStyle=_6ef.style;
}
this.layer.selectedFeatures.push(_6ef);
this.layer.drawFeature(_6ef,this.selectStyle);
this.onSelect(_6ef);
},unselect:function(_6f0){
if(_6f0.originalStyle==null){
_6f0.originalStyle=_6f0.style;
}
this.layer.drawFeature(_6f0,_6f0.originalStyle);
OpenLayers.Util.removeItem(this.layer.selectedFeatures,_6f0);
this.onUnselect(_6f0);
},setMap:function(map){
this.handler.setMap(map);
OpenLayers.Control.prototype.setMap.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Control.SelectFeature"});
OpenLayers.Control.ZoomBox=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask});
},zoomBox:function(_6f2){
if(_6f2 instanceof OpenLayers.Bounds){
var _6f3=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_6f2.left,_6f2.bottom));
var _6f4=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_6f2.right,_6f2.top));
var _6f5=new OpenLayers.Bounds(_6f3.lon,_6f3.lat,_6f4.lon,_6f4.lat);
this.map.zoomToExtent(_6f5);
}else{
this.map.setCenter(this.map.getLonLatFromPixel(_6f2),this.map.getZoom()+1);
}
},CLASS_NAME:"OpenLayers.Control.ZoomBox"});
OpenLayers.Format.KML=OpenLayers.Class(OpenLayers.Format,{kmlns:"http://earth.google.com/kml/2.0",initialize:function(_6f6){
OpenLayers.Format.prototype.initialize.apply(this,[_6f6]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.parseXMLString(data);
}
var _6f8=OpenLayers.Ajax.getElementsByTagNameNS(data,this.kmlns,"","Placemark");
var _6f9=[];
for(var i=0;i<_6f8.length;i++){
var _6fb=this.parseFeature(_6f8[i]);
if(_6fb){
_6f9.push(_6fb);
}
}
return _6f9;
},parseFeature:function(_6fc){
var geom;
var p;
var _6ff=new OpenLayers.Feature.Vector();
if(OpenLayers.Ajax.getElementsByTagNameNS(_6fc,this.kmlns,"","Point").length!=0){
var _700=OpenLayers.Ajax.getElementsByTagNameNS(_6fc,this.kmlns,"","Point")[0];
p=this.parseCoords(_700);
if(p.points){
geom=p.points[0];
geom.extendBounds(p.bounds);
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_6fc,this.kmlns,"","LineString").length!=0){
var _701=OpenLayers.Ajax.getElementsByTagNameNS(_6fc,this.kmlns,"","LineString")[0];
p=this.parseCoords(_701);
if(p.points){
geom=new OpenLayers.Geometry.LineString(p.points);
geom.extendBounds(p.bounds);
}
}
}
_6ff.geometry=geom;
_6ff.attributes=this.parseAttributes(_6fc);
return _6ff;
},parseAttributes:function(_702){
var _703=_702.childNodes;
var _704={};
for(var i=0;i<_703.length;i++){
var name=_703[i].nodeName;
var _707=OpenLayers.Util.getXmlNodeValue(_703[i]);
if((name.search(":pos")!=-1)||(name.search(":posList")!=-1)||(name.search(":coordinates")!=-1)){
continue;
}
if((_703[i].childNodes.length==1&&_703[i].childNodes[0].nodeName=="#text")||(_703[i].childNodes.length==0&&_703[i].nodeName!="#text")){
_704[name]=_707;
}
OpenLayers.Util.extend(_704,this.parseAttributes(_703[i]));
}
return _704;
},parseCoords:function(_708){
var p=[];
p.points=[];
var _70a=OpenLayers.Ajax.getElementsByTagNameNS(_708,this.kmlns,"","coordinates")[0];
var _70b=OpenLayers.Util.getXmlNodeValue(_70a);
var _70c=_70b.split(" ");
while(_70c[0]==""){
_70c.shift();
}
var dim=_70c[0].split(",").length;
var nums=(_70b)?_70b.split(/[, \n\t]+/):[];
while(nums[0]==""){
nums.shift();
}
while(nums[nums.length-1]==""){
nums.pop();
}
for(i=0;i<nums.length;i=i+dim){
x=parseFloat(nums[i]);
y=parseFloat(nums[i+1]);
p.points.push(new OpenLayers.Geometry.Point(x,y));
if(!p.bounds){
p.bounds=new OpenLayers.Bounds(x,y,x,y);
}else{
p.bounds.extend(x,y);
}
}
return p;
},CLASS_NAME:"OpenLayers.Format.KML"});
OpenLayers.Geometry=OpenLayers.Class({id:null,parent:null,bounds:null,initialize:function(){
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},destroy:function(){
this.id=null;
this.bounds=null;
},clone:function(){
return new OpenLayers.Geometry();
},setBounds:function(_70f){
if(_70f){
this.bounds=_70f.clone();
}
},clearBounds:function(){
this.bounds=null;
if(this.parent){
this.parent.clearBounds();
}
},extendBounds:function(_710){
var _711=this.getBounds();
if(!_711){
this.setBounds(_710);
}else{
this.bounds.extend(_710);
}
},getBounds:function(){
if(this.bounds==null){
this.calculateBounds();
}
return this.bounds;
},calculateBounds:function(){
},atPoint:function(_712,_713,_714){
var _715=false;
var _716=this.getBounds();
if((_716!=null)&&(_712!=null)){
var dX=(_713!=null)?_713:0;
var dY=(_714!=null)?_714:0;
var _719=new OpenLayers.Bounds(this.bounds.left-dX,this.bounds.bottom-dY,this.bounds.right+dX,this.bounds.top+dY);
_715=_719.containsLonLat(_712);
}
return _715;
},getLength:function(){
return 0;
},getArea:function(){
return 0;
},toString:function(){
return OpenLayers.Format.WKT.prototype.write(new OpenLayers.Feature.Vector(this));
},CLASS_NAME:"OpenLayers.Geometry"});
OpenLayers.Layer.Boxes=OpenLayers.Class(OpenLayers.Layer.Markers,{initialize:function(name,_71b){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
},drawMarker:function(_71c){
var _71d=_71c.bounds;
var _71e=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_71d.left,_71d.top));
var _71f=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_71d.right,_71d.bottom));
if(_71f==null||_71e==null){
_71c.display(false);
}else{
var sz=new OpenLayers.Size(Math.max(1,_71f.x-_71e.x),Math.max(1,_71f.y-_71e.y));
var _721=_71c.draw(_71e,sz);
if(!_71c.drawn){
this.div.appendChild(_721);
_71c.drawn=true;
}
}
},removeMarker:function(_722){
OpenLayers.Util.removeItem(this.markers,_722);
if((_722.div!=null)&&(_722.div.parentNode==this.div)){
this.div.removeChild(_722.div);
}
},CLASS_NAME:"OpenLayers.Layer.Boxes"});
OpenLayers.Layer.GeoRSS=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,icon:null,initialize:function(name,_724,_725){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,[name,_725]);
this.location=_724;
this.features=[];
OpenLayers.loadURL(_724,null,this,this.parseData);
},destroy:function(){
this.clearFeatures();
this.features=null;
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
},parseData:function(_726){
var doc=_726.responseXML;
if(!doc||_726.fileType!="XML"){
doc=OpenLayers.parseXMLString(_726.responseText);
}
this.name=null;
try{
this.name=doc.getElementsByTagNameNS("*","title")[0].firstChild.nodeValue;
}
catch(e){
this.name=doc.getElementsByTagName("title")[0].firstChild.nodeValue;
}
var _728=null;
try{
_728=doc.getElementsByTagNameNS("*","item");
}
catch(e){
_728=doc.getElementsByTagName("item");
}
if(_728.length==0){
try{
_728=doc.getElementsByTagNameNS("*","entry");
}
catch(e){
_728=doc.getElementsByTagName("entry");
}
}
for(var i=0;i<_728.length;i++){
var data={};
var _72b=OpenLayers.Util.getNodes(_728[i],"georss:point");
var lat=OpenLayers.Util.getNodes(_728[i],"geo:lat");
var lon=OpenLayers.Util.getNodes(_728[i],"geo:long");
if(_72b.length>0){
var _72e=_72b[0].firstChild.nodeValue.split(" ");
if(_72e.length!=2){
var _72e=_72b[0].firstChild.nodeValue.split(",");
}
}else{
if(lat.length>0&&lon.length>0){
var _72e=[parseFloat(lat[0].firstChild.nodeValue),parseFloat(lon[0].firstChild.nodeValue)];
}else{
continue;
}
}
_72e=new OpenLayers.LonLat(parseFloat(_72e[1]),parseFloat(_72e[0]));
var _72f="Untitled";
try{
_72f=OpenLayers.Util.getNodes(_728[i],"title")[0].firstChild.nodeValue;
}
catch(e){
_72f="Untitled";
}
var _730=null;
try{
_730=_728[i].getElementsByTagNameNS("*","description");
}
catch(e){
_730=_728[i].getElementsByTagName("description");
}
if(_730.length==0){
try{
_730=_728[i].getElementsByTagNameNS("*","summary");
}
catch(e){
_730=_728[i].getElementsByTagName("summary");
}
}
var _731="No description.";
try{
_731=_730[0].firstChild.nodeValue;
}
catch(e){
_731="No description.";
}
try{
var link=OpenLayers.Util.getNodes(_728[i],"link")[0].firstChild.nodeValue;
}
catch(e){
try{
var link=OpenLayers.Util.getNodes(_728[i],"link")[0].getAttribute("href");
}
catch(e){
}
}
data.icon=this.icon==null?OpenLayers.Marker.defaultIcon():this.icon.clone();
data.popupSize=new OpenLayers.Size(250,120);
if((_72f!=null)&&(_731!=null)){
contentHTML="<div class=\"olLayerGeoRSSClose\">[x]</div>";
contentHTML+="<div class=\"olLayerGeoRSSTitle\">";
if(link){
contentHTML+="<a class=\"link\" href=\""+link+"\" target=\"_blank\">";
}
contentHTML+=_72f;
if(link){
contentHTML+="</a>";
}
contentHTML+="</div>";
contentHTML+="<div style=\"\" class=\"olLayerGeoRSSDescription\">";
contentHTML+=_731;
contentHTML+="</div>";
data["popupContentHTML"]=contentHTML;
}
var _733=new OpenLayers.Feature(this,_72e,data);
this.features.push(_733);
var _734=_733.createMarker();
_734.events.register("click",_733,this.markerClick);
this.addMarker(_734);
}
},markerClick:function(evt){
sameMarkerClicked=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!sameMarkerClicked)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!sameMarkerClicked){
var _737=this.createPopup();
OpenLayers.Event.observe(_737.div,"click",function(){
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
}.bind(this));
this.layer.map.addPopup(_737);
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _739=this.features[0];
OpenLayers.Util.removeItem(this.features,_739);
_739.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.GeoRSS"});
OpenLayers.Layer.Google=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:19,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125,0.00002145767211914062,0.00001072883605957031,0.00000536441802978515,0.00000268220901489257],type:null,initialize:function(name,_73b){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
this.addContainerPxFunction();
},loadMapObject:function(){
try{
this.mapObject=new GMap2(this.div);
var _73c=this.div.lastChild;
this.div.removeChild(_73c);
this.pane.appendChild(_73c);
_73c.className="olLayerGooglePoweredBy gmnoprint";
_73c.style.left="";
_73c.style.bottom="";
var _73d=this.div.lastChild;
this.div.removeChild(_73d);
this.pane.appendChild(_73d);
_73d.className="olLayerGoogleCopyright";
_73d.style.right="";
_73d.style.bottom="";
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
},getOLBoundsFromMapObjectBounds:function(_73f){
var _740=null;
if(_73f!=null){
var sw=_73f.getSouthWest();
var ne=_73f.getNorthEast();
_740=new OpenLayers.Bounds(sw.lng(),sw.lat(),ne.lng(),ne.lat());
}
return _740;
},getMapObjectBoundsFromOLBounds:function(_743){
var _744=null;
if(_743!=null){
var sw=new GLatLng(_743.bottom,_743.left);
var ne=new GLatLng(_743.top,_743.right);
_744=new GLatLngBounds(sw,ne);
}
return _744;
},addContainerPxFunction:function(){
if(typeof GMap2!="undefined"&&!GMap2.fromLatLngToContainerPixel){
GMap2.prototype.fromLatLngToContainerPixel=function(_747){
var _748=this.fromLatLngToDivPixel(_747);
var div=this.b.firstChild.firstChild;
_748.x+=div.offsetLeft;
_748.y+=div.offsetTop;
return _748;
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
},setMapObjectCenter:function(_74b,zoom){
this.mapObject.setCenter(_74b,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenter();
},getMapObjectZoom:function(){
return this.mapObject.getZoom();
},getMapObjectLonLatFromMapObjectPixel:function(_74d){
return this.mapObject.fromContainerPixelToLatLng(_74d);
},getMapObjectPixelFromMapObjectLonLat:function(_74e){
return this.mapObject.fromLatLngToContainerPixel(_74e);
},getMapObjectZoomFromMapObjectBounds:function(_74f){
return this.mapObject.getBoundsZoomLevel(_74f);
},getLongitudeFromMapObjectLonLat:function(_750){
return _750.lng();
},getLatitudeFromMapObjectLonLat:function(_751){
return _751.lat();
},getMapObjectLonLatFromLonLat:function(lon,lat){
return new GLatLng(lat,lon);
},getXFromMapObjectPixel:function(_754){
return _754.x;
},getYFromMapObjectPixel:function(_755){
return _755.y;
},getMapObjectPixelFromXY:function(x,y){
return new GPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.Google"});
OpenLayers.Layer.Grid=OpenLayers.Class(OpenLayers.Layer.HTTPRequest,{tileSize:null,grid:null,singleTile:false,ratio:1.5,buffer:2,numLoadingTiles:0,initialize:function(name,url,_75a,_75b){
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
},moveTo:function(_761,_762,_763){
OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
_761=_761||this.map.getExtent();
if(_761!=null){
var _764=!this.grid.length||_762;
var _765=this.getTilesBounds();
if(this.singleTile){
if(_764||(!_763&&!_765.containsBounds(_761))){
this.initSingleTile(_761);
}
}else{
if(_764||!_765.containsBounds(_761,true)){
this.initGriddedTiles(_761);
}else{
this.moveGriddedTiles(_761);
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
var _768=null;
if(this.grid.length){
var _769=this.grid.length-1;
var _76a=this.grid[_769][0];
var _76b=this.grid[0].length-1;
var _76c=this.grid[0][_76b];
_768=new OpenLayers.Bounds(_76a.bounds.left,_76a.bounds.bottom,_76c.bounds.right,_76c.bounds.top);
}
return _768;
},initSingleTile:function(_76d){
var _76e=_76d.getCenterLonLat();
var _76f=_76d.getWidth()*this.ratio;
var _770=_76d.getHeight()*this.ratio;
var _771=new OpenLayers.Bounds(_76e.lon-(_76f/2),_76e.lat-(_770/2),_76e.lon+(_76f/2),_76e.lat+(_770/2));
var ul=new OpenLayers.LonLat(_771.left,_771.top);
var px=this.map.getLayerPxFromLonLat(ul);
if(!this.grid.length){
this.grid[0]=[];
}
var tile=this.grid[0][0];
if(!tile){
tile=this.addTile(_771,px);
this.addTileMonitoringHooks(tile);
tile.draw();
this.grid[0][0]=tile;
}else{
tile.moveTo(_771,px);
}
this.removeExcessTiles(1,1);
},initGriddedTiles:function(_775){
var _776=this.map.getSize();
var _777=Math.ceil(_776.h/this.tileSize.h)+1;
var _778=Math.ceil(_776.w/this.tileSize.w)+1;
var _779=this.map.getMaxExtent();
var _77a=this.map.getResolution();
var _77b=_77a*this.tileSize.w;
var _77c=_77a*this.tileSize.h;
var _77d=_775.left-_779.left;
var _77e=Math.floor(_77d/_77b)-this.buffer;
var _77f=_77d/_77b-_77e;
var _780=-_77f*this.tileSize.w;
var _781=_779.left+_77e*_77b;
var _782=_775.top-(_779.bottom+_77c);
var _783=Math.ceil(_782/_77c)+this.buffer;
var _784=_783-_782/_77c;
var _785=-_784*this.tileSize.h;
var _786=_779.bottom+_783*_77c;
_780=Math.round(_780);
_785=Math.round(_785);
this.origin=new OpenLayers.Pixel(_780,_785);
var _787=_780;
var _788=_781;
var _789=0;
do{
var row=this.grid[_789++];
if(!row){
row=[];
this.grid.push(row);
}
_781=_788;
_780=_787;
var _78b=0;
do{
var _78c=new OpenLayers.Bounds(_781,_786,_781+_77b,_786+_77c);
var x=_780;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_785;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile=row[_78b++];
if(!tile){
tile=this.addTile(_78c,px);
this.addTileMonitoringHooks(tile);
row.push(tile);
}else{
tile.moveTo(_78c,px,false);
}
_781+=_77b;
_780+=this.tileSize.w;
}while((_781<=_775.right+_77b*this.buffer)||_78b<_778);
_786-=_77c;
_785+=this.tileSize.h;
}while((_786>=_775.bottom-_77c*this.buffer)||_789<_777);
this.removeExcessTiles(_789,_78b);
this.spiralTileLoad();
},spiralTileLoad:function(){
var _791=[];
var _792=["right","down","left","up"];
var iRow=0;
var _794=-1;
var _795=OpenLayers.Util.indexOf(_792,"right");
var _796=0;
while(_796<_792.length){
var _797=iRow;
var _798=_794;
switch(_792[_795]){
case "right":
_798++;
break;
case "down":
_797++;
break;
case "left":
_798--;
break;
case "up":
_797--;
break;
}
var tile=null;
if((_797<this.grid.length)&&(_797>=0)&&(_798<this.grid[0].length)&&(_798>=0)){
tile=this.grid[_797][_798];
}
if((tile!=null)&&(!tile.queued)){
_791.unshift(tile);
tile.queued=true;
_796=0;
iRow=_797;
_794=_798;
}else{
_795=(_795+1)%4;
_796++;
}
}
for(var i=0;i<_791.length;i++){
var tile=_791[i];
tile.draw();
tile.queued=false;
}
},addTile:function(_79b,_79c){
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
},moveGriddedTiles:function(_79f){
var _7a0=(this.buffer)?this.buffer*1.5:1;
while(true){
var _7a1=this.grid[0][0].position;
var _7a2=this.map.getViewPortPxFromLayerPx(_7a1);
if(_7a2.x>-this.tileSize.w*(_7a0-1)){
this.shiftColumn(true);
}else{
if(_7a2.x<-this.tileSize.w*_7a0){
this.shiftColumn(false);
}else{
if(_7a2.y>-this.tileSize.h*(_7a0-1)){
this.shiftRow(true);
}else{
if(_7a2.y<-this.tileSize.h*_7a0){
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
if(!tile.drawn&&tile.bounds.intersectsBounds(_79f,false)){
tile.draw();
}
}
}
}
},shiftRow:function(_7a7){
var _7a8=(_7a7)?0:(this.grid.length-1);
var _7a9=this.grid[_7a8];
var _7aa=this.map.getResolution();
var _7ab=(_7a7)?-this.tileSize.h:this.tileSize.h;
var _7ac=_7aa*-_7ab;
var row=(_7a7)?this.grid.pop():this.grid.shift();
for(var i=0;i<_7a9.length;i++){
var _7af=_7a9[i];
var _7b0=_7af.bounds.clone();
var _7b1=_7af.position.clone();
_7b0.bottom=_7b0.bottom+_7ac;
_7b0.top=_7b0.top+_7ac;
_7b1.y=_7b1.y+_7ab;
row[i].moveTo(_7b0,_7b1);
}
if(_7a7){
this.grid.unshift(row);
}else{
this.grid.push(row);
}
},shiftColumn:function(_7b2){
var _7b3=(_7b2)?-this.tileSize.w:this.tileSize.w;
var _7b4=this.map.getResolution();
var _7b5=_7b4*_7b3;
for(var i=0;i<this.grid.length;i++){
var row=this.grid[i];
var _7b8=(_7b2)?0:(row.length-1);
var _7b9=row[_7b8];
var _7ba=_7b9.bounds.clone();
var _7bb=_7b9.position.clone();
_7ba.left=_7ba.left+_7b5;
_7ba.right=_7ba.right+_7b5;
_7bb.x=_7bb.x+_7b3;
var tile=_7b2?this.grid[i].pop():this.grid[i].shift();
tile.moveTo(_7ba,_7bb);
if(_7b2){
this.grid[i].unshift(tile);
}else{
this.grid[i].push(tile);
}
}
},removeExcessTiles:function(rows,_7be){
while(this.grid.length>rows){
var row=this.grid.pop();
for(var i=0,l=row.length;i<l;i++){
var tile=row[i];
this.removeTileMonitoringHooks(tile);
tile.destroy();
}
}
while(this.grid[0].length>_7be){
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
},CLASS_NAME:"OpenLayers.Layer.Grid"});
OpenLayers.Layer.MultiMap=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[9,1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_7c3){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
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
},setMapObjectCenter:function(_7c5,zoom){
this.mapObject.goToPosition(_7c5,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCurrentPosition();
},getMapObjectZoom:function(){
return this.mapObject.getZoomFactor();
},getMapObjectLonLatFromMapObjectPixel:function(_7c7){
_7c7.x=_7c7.x-(this.map.getSize().w/2);
_7c7.y=_7c7.y-(this.map.getSize().h/2);
return this.mapObject.getMapPositionAt(_7c7);
},getMapObjectPixelFromMapObjectLonLat:function(_7c8){
return this.mapObject.geoPosToContainerPixels(_7c8);
},getLongitudeFromMapObjectLonLat:function(_7c9){
return _7c9.lon;
},getLatitudeFromMapObjectLonLat:function(_7ca){
return _7ca.lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
return new MMLatLon(lat,lon);
},getXFromMapObjectPixel:function(_7cd){
return _7cd.x;
},getYFromMapObjectPixel:function(_7ce){
return _7ce.y;
},getMapObjectPixelFromXY:function(x,y){
return new MMPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.MultiMap"});
OpenLayers.Layer.Text=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,initialize:function(name,_7d2){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
this.features=new Array();
if(this.location!=null){
OpenLayers.loadURL(this.location,null,this,this.parseData);
}
},destroy:function(){
this.clearFeatures();
this.features=null;
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
},parseData:function(_7d3){
var text=_7d3.responseText;
var _7d5=text.split("\n");
var _7d6;
for(var lcv=0;lcv<(_7d5.length-1);lcv++){
var _7d8=_7d5[lcv].replace(/^\s*/,"").replace(/\s*$/,"");
if(_7d8.charAt(0)!="#"){
if(!_7d6){
_7d6=_7d8.split("\t");
}else{
var vals=_7d8.split("\t");
var _7da=new OpenLayers.LonLat(0,0);
var _7db;
var url;
var icon,iconSize,iconOffset;
var set=false;
for(var _7df=0;_7df<vals.length;_7df++){
if(vals[_7df]){
if(_7d6[_7df]=="point"){
var _7e0=vals[_7df].split(",");
_7da.lat=parseFloat(_7e0[0]);
_7da.lon=parseFloat(_7e0[1]);
set=true;
}else{
if(_7d6[_7df]=="lat"){
_7da.lat=parseFloat(vals[_7df]);
set=true;
}else{
if(_7d6[_7df]=="lon"){
_7da.lon=parseFloat(vals[_7df]);
set=true;
}else{
if(_7d6[_7df]=="title"){
_7db=vals[_7df];
}else{
if(_7d6[_7df]=="image"||_7d6[_7df]=="icon"){
url=vals[_7df];
}else{
if(_7d6[_7df]=="iconSize"){
var size=vals[_7df].split(",");
iconSize=new OpenLayers.Size(parseFloat(size[0]),parseFloat(size[1]));
}else{
if(_7d6[_7df]=="iconOffset"){
var _7e2=vals[_7df].split(",");
iconOffset=new OpenLayers.Pixel(parseFloat(_7e2[0]),parseFloat(_7e2[1]));
}else{
if(_7d6[_7df]=="title"){
_7db=vals[_7df];
}else{
if(_7d6[_7df]=="description"){
description=vals[_7df];
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
if((_7db!=null)&&(description!=null)){
data["popupContentHTML"]="<h2>"+_7db+"</h2><p>"+description+"</p>";
}
var _7e4=new OpenLayers.Feature(this,_7da,data);
this.features.push(_7e4);
var _7e5=_7e4.createMarker();
if((_7db!=null)&&(description!=null)){
_7e5.events.register("click",_7e4,this.markerClick);
}
this.addMarker(_7e5);
}
}
}
}
},markerClick:function(evt){
var _7e7=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!_7e7)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!_7e7){
this.layer.map.addPopup(this.createPopup());
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _7e9=this.features[0];
OpenLayers.Util.removeItem(this.features,_7e9);
_7e9.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.Text"});
OpenLayers.Layer.Vector=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:false,isFixed:false,isVector:true,features:null,selectedFeatures:null,reportError:true,style:null,renderers:["SVG","VML"],renderer:null,geometryType:null,drawn:false,initialize:function(name,_7eb){
var _7ec=OpenLayers.Feature.Vector.style["default"];
this.style=OpenLayers.Util.extend({},_7ec);
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
var _7ee=OpenLayers.Renderer[this.renderers[i]];
if(_7ee&&_7ee.prototype.supported()){
this.renderer=new _7ee(this.div);
break;
}
}
},displayError:function(){
if(this.reportError){
var _7ef="Your browser does not support vector rendering. "+"Currently supported renderers are:\n";
_7ef+=this.renderers.join("\n");
alert(_7ef);
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
},moveTo:function(_7f1,_7f2,_7f3){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(!_7f3){
this.div.style.left=-parseInt(this.map.layerContainerDiv.style.left)+"px";
this.div.style.top=-parseInt(this.map.layerContainerDiv.style.top)+"px";
var _7f4=this.map.getExtent();
this.renderer.setExtent(_7f4);
}
if(!this.drawn||_7f2){
this.drawn=true;
for(var i=0;i<this.features.length;i++){
var _7f6=this.features[i];
this.drawFeature(_7f6);
}
}
},addFeatures:function(_7f7){
if(!(_7f7 instanceof Array)){
_7f7=[_7f7];
}
for(var i=0;i<_7f7.length;i++){
var _7f9=_7f7[i];
if(this.geometryType&&!(_7f9.geometry instanceof this.geometryType)){
var _7fa="addFeatures : component should be an "+this.geometryType.prototype.CLASS_NAME;
throw _7fa;
}
this.features.push(_7f9);
_7f9.layer=this;
if(!_7f9.style){
_7f9.style=OpenLayers.Util.extend({},this.style);
}
this.preFeatureInsert(_7f9);
if(this.drawn){
this.drawFeature(_7f9);
}
this.onFeatureInsert(_7f9);
}
},removeFeatures:function(_7fb){
if(!(_7fb instanceof Array)){
_7fb=[_7fb];
}
for(var i=_7fb.length-1;i>=0;i--){
var _7fd=_7fb[i];
this.features=OpenLayers.Util.removeItem(this.features,_7fd);
if(_7fd.geometry){
this.renderer.eraseGeometry(_7fd.geometry);
}
if(OpenLayers.Util.indexOf(this.selectedFeatures,_7fd)!=-1){
OpenLayers.Util.removeItem(this.selectedFeatures,_7fd);
}
}
},destroyFeatures:function(){
this.selectedFeatures=[];
for(var i=this.features.length-1;i>=0;i--){
this.features[i].destroy();
}
},drawFeature:function(_7ff,_800){
if(_800==null){
if(_7ff.style){
_800=_7ff.style;
}else{
_800=this.style;
}
}
this.renderer.drawFeature(_7ff,_800);
},eraseFeatures:function(_801){
this.renderer.eraseFeatures(_801);
},getFeatureFromEvent:function(evt){
var _803=this.renderer.getFeatureIdFromEvent(evt);
return this.getFeatureById(_803);
},getFeatureById:function(_804){
var _805=null;
for(var i=0;i<this.features.length;++i){
if(this.features[i].id==_804){
_805=this.features[i];
break;
}
}
return _805;
},onFeatureInsert:function(_807){
},preFeatureInsert:function(_808){
},CLASS_NAME:"OpenLayers.Layer.Vector"});
OpenLayers.Layer.VirtualEarth=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_80a){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
},loadMapObject:function(){
var _80b=OpenLayers.Util.createDiv(this.name);
var sz=this.map.getSize();
_80b.style.width=sz.w;
_80b.style.height=sz.h;
this.div.appendChild(_80b);
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
},setMapObjectCenter:function(_80e,zoom){
this.mapObject.SetCenterAndZoom(_80e,zoom);
},getMapObjectCenter:function(){
return this.mapObject.GetCenter();
},getMapObjectZoom:function(){
return this.mapObject.GetZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_810){
return this.mapObject.PixelToLatLong(_810.x,_810.y);
},getMapObjectPixelFromMapObjectLonLat:function(_811){
return this.mapObject.LatLongToPixel(_811);
},getLongitudeFromMapObjectLonLat:function(_812){
return _812.Longitude;
},getLatitudeFromMapObjectLonLat:function(_813){
return _813.Latitude;
},getMapObjectLonLatFromLonLat:function(lon,lat){
return new VELatLong(lat,lon);
},getXFromMapObjectPixel:function(_816){
return _816.x;
},getYFromMapObjectPixel:function(_817){
return _817.y;
},getMapObjectPixelFromXY:function(x,y){
return new Msn.VE.Pixel(x,y);
},CLASS_NAME:"OpenLayers.Layer.VirtualEarth"});
OpenLayers.Layer.Yahoo=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:15,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_81b){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
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
var _81f=OpenLayers.Util.getElement("ygddfdiv");
if(_81f!=null){
if(_81f.parentNode!=null){
_81f.parentNode.removeChild(_81f);
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
},getOLZoomFromMapObjectZoom:function(_821){
var zoom=null;
if(_821!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getOLZoomFromMapObjectZoom.apply(this,[_821]);
zoom=18-zoom;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_823){
var zoom=null;
if(_823!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getMapObjectZoomFromOLZoom.apply(this,[_823]);
zoom=18-zoom;
}
return zoom;
},setMapObjectCenter:function(_825,zoom){
this.mapObject.drawZoomAndCenter(_825,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenterLatLon();
},getMapObjectZoom:function(){
return this.mapObject.getZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_827){
return this.mapObject.convertXYLatLon(_827);
},getMapObjectPixelFromMapObjectLonLat:function(_828){
return this.mapObject.convertLatLonXY(_828);
},getLongitudeFromMapObjectLonLat:function(_829){
return _829.Lon;
},getLatitudeFromMapObjectLonLat:function(_82a){
return _82a.Lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
return new YGeoPoint(lat,lon);
},getXFromMapObjectPixel:function(_82d){
return _82d.x;
},getYFromMapObjectPixel:function(_82e){
return _82e.y;
},getMapObjectPixelFromXY:function(x,y){
return new YCoordPoint(x,y);
},getMapObjectSizeFromOLSize:function(_831){
return new YSize(_831.w,_831.h);
},CLASS_NAME:"OpenLayers.Layer.Yahoo"});
OpenLayers.Control.Navigation=OpenLayers.Class(OpenLayers.Control,{dragPan:null,zoomBox:null,wheelHandler:null,initialize:function(_832){
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
var _834=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_834,this.map.zoom+1);
OpenLayers.Event.stop(evt);
return false;
},wheelChange:function(evt,_836){
var _837=this.map.getZoom()+_836;
if(!this.map.isValidZoomLevel(_837)){
return;
}
var size=this.map.getSize();
var _839=size.w/2-evt.xy.x;
var _83a=evt.xy.y-size.h/2;
var _83b=this.map.baseLayer.resolutions[_837];
var _83c=this.map.getLonLatFromPixel(evt.xy);
var _83d=new OpenLayers.LonLat(_83c.lon+_839*_83b,_83c.lat+_83a*_83b);
this.map.setCenter(_83d,_837);
},wheelUp:function(evt){
this.wheelChange(evt,1);
},wheelDown:function(evt){
this.wheelChange(evt,-1);
},CLASS_NAME:"OpenLayers.Control.Navigation"});
OpenLayers.Format.GML=OpenLayers.Class(OpenLayers.Format,{featureNS:"http://mapserver.gis.umn.edu/mapserver",featureName:"featureMember",layerName:"features",geometryName:"geometry",collectionName:"FeatureCollection",gmlns:"http://www.opengis.net/gml",extractAttributes:true,initialize:function(_840){
OpenLayers.Format.prototype.initialize.apply(this,[_840]);
},read:function(data){
if(typeof data=="string"){
data=OpenLayers.parseXMLString(data);
}
var _842=OpenLayers.Ajax.getElementsByTagNameNS(data,this.gmlns,"gml",this.featureName);
if(_842.length==0){
return [];
}
var dim;
var _844=OpenLayers.Ajax.getElementsByTagNameNS(_842[0],this.gmlns,"gml","posList");
if(_844.length==0){
_844=OpenLayers.Ajax.getElementsByTagNameNS(_842[0],this.gmlns,"gml","pos");
}
if(_844.length>0){
dim=_844[0].getAttribute("srsDimension");
}
this.dim=(dim=="3"||dim==3)?3:2;
var _845=[];
for(var i=0;i<_842.length;i++){
var _847=this.parseFeature(_842[i]);
if(_847){
_845.push(_847);
}
}
return _845;
},parseFeature:function(_848){
var geom;
var p;
var _84b=new OpenLayers.Feature.Vector();
if(OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","MultiPolygon").length!=0){
var _84c=OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","MultiPolygon")[0];
_84b.fid=this.getFidRSS(_84c);
geom=new OpenLayers.Geometry.MultiPolygon();
var _84d=OpenLayers.Ajax.getElementsByTagNameNS(_84c,this.gmlns,"gml","Polygon");
for(var i=0;i<_84d.length;i++){
polygon=this.parsePolygonNode(_84d[i],geom);
geom.addComponents(polygon);
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","MultiLineString").length!=0){
var _84f=OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","MultiLineString")[0];
_84b.fid=this.getFidRSS(_84f);
geom=new OpenLayers.Geometry.MultiLineString();
var _850=OpenLayers.Ajax.getElementsByTagNameNS(_84f,this.gmlns,"gml","LineString");
for(var i=0;i<_850.length;i++){
p=this.parseCoords(_850[i]);
if(p.points){
var _851=new OpenLayers.Geometry.LineString(p.points);
geom.addComponents(_851);
}
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","MultiPoint").length!=0){
var _852=OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","MultiPoint")[0];
_84b.fid=this.getFidRSS(_852);
geom=new OpenLayers.Geometry.MultiPoint();
var _853=OpenLayers.Ajax.getElementsByTagNameNS(_852,this.gmlns,"gml","Point");
for(var i=0;i<_853.length;i++){
p=this.parseCoords(_853[i]);
geom.addComponents(p.points[0]);
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","Polygon").length!=0){
var _854=OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","Polygon")[0];
_84b.fid=this.getFidRSS(_854);
geom=this.parsePolygonNode(_854);
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","LineString").length!=0){
var _851=OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","LineString")[0];
_84b.fid=this.getFidRSS(_851);
p=this.parseCoords(_851);
if(p.points){
geom=new OpenLayers.Geometry.LineString(p.points);
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","Point").length!=0){
var _855=OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","Point")[0];
_84b.fid=this.getFidRSS(_855);
p=this.parseCoords(_855);
if(p.points){
geom=p.points[0];
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","Envelope").length!=0){
var _856=OpenLayers.Ajax.getElementsByTagNameNS(_848,this.gmlns,"gml","Envelope")[0];
_84b.fid=this.getFidRSS(_856);
geom=this.parseEnvelope(_856);
}
}
}
}
}
}
}
_84b.geometry=geom;
if(this.extractAttributes){
_84b.attributes=this.parseAttributes(_848);
}
return _84b;
},getFidRSS:function(_857){
var _858=_857.parentNode.parentNode.childNodes;
for(var i=0;i<_858.length;i++){
if(_858[i].nodeName=="id"){
var _85a=OpenLayers.Util.getXmlNodeValue(_858[i]);
break;
}
}
fid=_85a;
return fid;
},parseAttributes:function(_85b){
var _85c=_85b.childNodes;
var _85d={};
for(var i=0;i<_85c.length;i++){
var name=_85c[i].nodeName;
var _860=OpenLayers.Util.getXmlNodeValue(_85c[i]);
if((name.search(":pos")!=-1)||(name.search(":posList")!=-1)||(name.search(":coordinates")!=-1)){
continue;
}
if((_85c[i].childNodes.length==1&&_85c[i].childNodes[0].nodeName=="#text")||(_85c[i].childNodes.length==0&&_85c[i].nodeName!="#text")){
_85d[name]=_860;
}
OpenLayers.Util.extend(_85d,this.parseAttributes(_85c[i]));
}
return _85d;
},parseEnvelope:function(_861){
var _862;
if(_861){
lower=OpenLayers.Ajax.getElementsByTagNameNS(_861,this.gmlns,"gml","lowerCorner");
upper=OpenLayers.Ajax.getElementsByTagNameNS(_861,this.gmlns,"gml","upperCorner");
var _863=this.getPoint(lower);
var _864=this.getPoint(upper);
var _865=[];
_865.push(new OpenLayers.Geometry.Point(_863.points[0].x,_863.points[0].y));
_865.push(new OpenLayers.Geometry.Point(_864.points[0].x,_863.points[0].y));
_865.push(new OpenLayers.Geometry.Point(_864.points[0].x,_864.points[0].y));
_865.push(new OpenLayers.Geometry.Point(_863.points[0].x,_864.points[0].y));
_865.push(new OpenLayers.Geometry.Point(_863.points[0].x,_863.points[0].y));
var ring=new OpenLayers.Geometry.LinearRing(_865);
_862=new OpenLayers.Geometry.Polygon([ring]);
}
return _862;
},getPoint:function(_867){
var p=[];
p.points=[];
var _869=OpenLayers.Util.getXmlNodeValue(_867[0]);
var nums=(_869)?_869.split(/[, \n\t]+/):[];
while(nums[0]==""){
nums.shift();
}
while(nums[nums.length-1]==""){
nums.pop();
}
for(i=0;i<nums.length;i=i+this.dim){
x=parseFloat(nums[i]);
y=parseFloat(nums[i+1]);
p.points.push(new OpenLayers.Geometry.Point(x,y));
}
return p;
},parsePolygonNode:function(_86b){
var _86c=OpenLayers.Ajax.getElementsByTagNameNS(_86b,this.gmlns,"gml","LinearRing");
var _86d=[];
var p;
var _86f;
for(var i=0;i<_86c.length;i++){
p=this.parseCoords(_86c[i]);
ring1=new OpenLayers.Geometry.LinearRing(p.points);
_86d.push(ring1);
}
var poly=new OpenLayers.Geometry.Polygon(_86d);
return poly;
},parseCoords:function(_872){
var x,y,left,bottom,right,top,bounds;
var p=[];
if(_872){
p.points=[];
var _875=OpenLayers.Ajax.getElementsByTagNameNS(_872,this.gmlns,"gml","posList");
if(_875.length==0){
_875=OpenLayers.Ajax.getElementsByTagNameNS(_872,this.gmlns,"gml","pos");
}
if(_875.length==0){
_875=OpenLayers.Ajax.getElementsByTagNameNS(_872,this.gmlns,"gml","coordinates");
}
var _876=OpenLayers.Util.getXmlNodeValue(_875[0]);
var nums=(_876)?_876.split(/[, \n\t]+/):[];
while(nums[0]==""){
nums.shift();
}
while(nums[nums.length-1]==""){
nums.pop();
}
for(var i=0;i<nums.length;i=i+this.dim){
x=parseFloat(nums[i]);
y=parseFloat(nums[i+1]);
p.points.push(new OpenLayers.Geometry.Point(x,y));
}
}
return p;
},write:function(_879){
var _87a=document.createElementNS("http://www.opengis.net/wfs","wfs:"+this.collectionName);
for(var i=0;i<_879.length;i++){
_87a.appendChild(this.createFeatureXML(_879[i]));
}
return _87a;
},createFeatureXML:function(_87c){
var _87d=this.buildGeometryNode(_87c.geometry);
var _87e=document.createElementNS(this.featureNS,"feature:"+this.geometryName);
_87e.appendChild(_87d);
var _87f=document.createElementNS(this.gmlns,"gml:"+this.featureName);
var _880=document.createElementNS(this.featureNS,"feature:"+this.layerName);
_880.appendChild(_87e);
for(var attr in _87c.attributes){
var _882=document.createTextNode(_87c.attributes[attr]);
var _883=attr;
if(attr.search(":")!=-1){
_883=attr.split(":")[1];
}
var _884=document.createElementNS(this.featureNS,"feature:"+_883);
_884.appendChild(_882);
_880.appendChild(_884);
}
_87f.appendChild(_880);
return _87f;
},buildGeometryNode:function(_885){
var gml="";
if(_885.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon"||_885.CLASS_NAME=="OpenLayers.Geometry.Polygon"){
gml=document.createElementNS(this.gmlns,"gml:MultiPolygon");
var _887=document.createElementNS(this.gmlns,"gml:polygonMember");
var _888=document.createElementNS(this.gmlns,"gml:Polygon");
var _889=document.createElementNS(this.gmlns,"gml:outerBoundaryIs");
var _88a=document.createElementNS(this.gmlns,"gml:LinearRing");
_88a.appendChild(this.buildCoordinatesNode(_885.components[0]));
_889.appendChild(_88a);
_888.appendChild(_889);
_887.appendChild(_888);
gml.appendChild(_887);
}else{
if(_885.CLASS_NAME=="OpenLayers.Geometry.MultiLineString"||_885.CLASS_NAME=="OpenLayers.Geometry.LineString"){
gml=document.createElementNS(this.gmlns,"gml:MultiLineString");
var _88b=document.createElementNS(this.gmlns,"gml:lineStringMember");
var _88c=document.createElementNS(this.gmlns,"gml:LineString");
_88c.appendChild(this.buildCoordinatesNode(_885));
_88b.appendChild(_88c);
gml.appendChild(_88b);
}else{
if(_885.CLASS_NAME=="OpenLayers.Geometry.Point"||_885.CLASS_NAME=="OpenLayers.Geometry.MultiPoint"){
gml=document.createElementNS(this.gmlns,"gml:MultiPoint");
var _88d="";
if(_885.CLASS_NAME=="OpenLayers.Geometry.MultiPoint"){
_88d=_885.components;
}else{
_88d=[_885];
}
for(var i=0;i<_88d.length;i++){
var _88f=document.createElementNS(this.gmlns,"gml:pointMember");
var _890=document.createElementNS(this.gmlns,"gml:Point");
_890.appendChild(this.buildCoordinatesNode(_88d[i]));
_88f.appendChild(_890);
gml.appendChild(_88f);
}
}
}
}
return gml;
},buildCoordinatesNode:function(_891){
var _892=document.createElementNS(this.gmlns,"gml:coordinates");
_892.setAttribute("decimal",".");
_892.setAttribute("cs",",");
_892.setAttribute("ts"," ");
var _893=null;
if(_891.components){
_893=_891.components;
}
var path="";
if(_893){
for(var i=0;i<_893.length;i++){
path+=_893[i].x+","+_893[i].y+" ";
}
}else{
path+=_891.x+","+_891.y+" ";
}
var _896=document.createTextNode(path);
_892.appendChild(_896);
return _892;
},CLASS_NAME:"OpenLayers.Format.GML"});
OpenLayers.Geometry.Collection=OpenLayers.Class(OpenLayers.Geometry,{components:null,componentTypes:null,initialize:function(_897){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.components=[];
if(_897!=null){
this.addComponents(_897);
}
},destroy:function(){
this.components.length=0;
this.components=null;
},clone:function(){
var _898=eval("new "+this.CLASS_NAME+"()");
for(var i=0;i<this.components.length;i++){
_898.addComponent(this.components[i].clone());
}
OpenLayers.Util.applyDefaults(_898,this);
return _898;
},getComponentsString:function(){
var _89a=[];
for(var i=0;i<this.components.length;i++){
_89a.push(this.components[i].toShortString());
}
return _89a.join(",");
},calculateBounds:function(){
this.bounds=null;
if(this.components&&this.components.length>0){
this.setBounds(this.components[0].getBounds());
for(var i=1;i<this.components.length;i++){
this.extendBounds(this.components[i].getBounds());
}
}
},addComponents:function(_89d){
if(!(_89d instanceof Array)){
_89d=[_89d];
}
for(var i=0;i<_89d.length;i++){
this.addComponent(_89d[i]);
}
},addComponent:function(_89f,_8a0){
var _8a1=false;
if(_89f){
if(this.componentTypes==null||(OpenLayers.Util.indexOf(this.componentTypes,_89f.CLASS_NAME)>-1)){
if(_8a0!=null&&(_8a0<this.components.length)){
var _8a2=this.components.slice(0,_8a0);
var _8a3=this.components.slice(_8a0,this.components.length);
_8a2.push(_89f);
this.components=_8a2.concat(_8a3);
}else{
this.components.push(_89f);
}
_89f.parent=this;
this.clearBounds();
_8a1=true;
}
}
return _8a1;
},removeComponents:function(_8a4){
if(!(_8a4 instanceof Array)){
_8a4=[_8a4];
}
for(var i=0;i<_8a4.length;i++){
this.removeComponent(_8a4[i]);
}
},removeComponent:function(_8a6){
OpenLayers.Util.removeItem(this.components,_8a6);
this.clearBounds();
},getLength:function(){
var _8a7=0;
for(var i=0;i<this.components.length;i++){
_8a7+=this.components[i].getLength();
}
return _8a7;
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
},rotate:function(_8ae,_8af){
for(var i=0;i<this.components.length;++i){
this.components[i].rotate(_8ae,_8af);
}
},resize:function(_8b1,_8b2){
for(var i=0;i<this.components.length;++i){
this.components[i].resize(_8b1,_8b2);
}
},equals:function(_8b4){
var _8b5=true;
if(!_8b4.CLASS_NAME||(this.CLASS_NAME!=_8b4.CLASS_NAME)){
_8b5=false;
}else{
if(!(_8b4.components instanceof Array)||(_8b4.components.length!=this.components.length)){
_8b5=false;
}else{
for(var i=0;i<this.components.length;++i){
if(!this.components[i].equals(_8b4.components[i])){
_8b5=false;
break;
}
}
}
}
return _8b5;
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
},distanceTo:function(_8ba){
var _8bb=0;
if((this.x!=null)&&(this.y!=null)&&(_8ba!=null)&&(_8ba.x!=null)&&(_8ba.y!=null)){
var dx2=Math.pow(this.x-_8ba.x,2);
var dy2=Math.pow(this.y-_8ba.y,2);
_8bb=Math.sqrt(dx2+dy2);
}
return _8bb;
},equals:function(geom){
var _8bf=false;
if(geom!=null){
_8bf=((this.x==geom.x&&this.y==geom.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(geom.x)&&isNaN(geom.y)));
}
return _8bf;
},toShortString:function(){
return (this.x+", "+this.y);
},move:function(x,y){
this.x=this.x+x;
this.y=this.y+y;
},rotate:function(_8c2,_8c3){
var _8c4=this.distanceTo(_8c3);
var _8c5=_8c2+Math.atan2(this.y-_8c3.y,this.x-_8c3.x);
this.x=_8c3.x+(_8c4*Math.cos(_8c5));
this.y=_8c3.y+(_8c4*Math.sin(_8c5));
},resize:function(_8c6,_8c7){
this.x=_8c7.x+(_8c6*(this.x-_8c7.x));
this.y=_8c7.y+(_8c6*(this.y-_8c7.y));
},CLASS_NAME:"OpenLayers.Geometry.Point"});
OpenLayers.Geometry.Rectangle=OpenLayers.Class(OpenLayers.Geometry,{x:null,y:null,width:null,height:null,initialize:function(x,y,_8ca,_8cb){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.x=x;
this.y=y;
this.width=_8ca;
this.height=_8cb;
},calculateBounds:function(){
this.bounds=new OpenLayers.Bounds(this.x,this.y,this.x+this.width,this.y+this.height);
},getLength:function(){
var _8cc=(2*this.width)+(2*this.height);
return _8cc;
},getArea:function(){
var area=this.width*this.height;
return area;
},CLASS_NAME:"OpenLayers.Geometry.Rectangle"});
OpenLayers.Geometry.Surface=OpenLayers.Class(OpenLayers.Geometry,{initialize:function(){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.Surface"});
OpenLayers.Layer.GML=OpenLayers.Class(OpenLayers.Layer.Vector,{loaded:false,format:null,initialize:function(name,url,_8d0){
var _8d1=[];
_8d1.push(name,_8d0);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_8d1);
this.url=url;
},setVisibility:function(_8d2,_8d3){
OpenLayers.Layer.Vector.prototype.setVisibility.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},moveTo:function(_8d4,_8d5,_8d6){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},loadGML:function(){
if(!this.loaded){
var _8d7=OpenLayers.loadURL(this.url,null,this,this.requestSuccess,this.requestFailure);
this.loaded=true;
}
},requestSuccess:function(_8d8){
var doc=_8d8.responseXML;
if(!doc||_8d8.fileType!="XML"){
doc=_8d8.responseText;
}
var gml=this.format?new this.format():new OpenLayers.Format.GML();
this.addFeatures(gml.read(doc));
},requestFailure:function(_8db){
alert("Error in loading GML file "+this.url);
},CLASS_NAME:"OpenLayers.Layer.GML"});
OpenLayers.Layer.GeoRSSvector=OpenLayers.Class(OpenLayers.Layer.Vector,{loaded:false,format:null,url:null,initialize:function(name,url){
var _8de=new Array();
_8de.push(name);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_8de);
this.url=url;
},setVisibility:function(_8df,_8e0){
OpenLayers.Layer.Vector.prototype.setVisibility.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},moveTo:function(_8e1,_8e2,_8e3){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},loadGML:function(){
if(!this.loaded){
var _8e4=OpenLayers.loadURL(this.url,null,this,this.requestSuccess,this.requestFailure);
this.loaded=true;
}
},requestSuccess:function(_8e5){
var doc=_8e5.responseXML;
if(!doc||_8e5.fileType!="XML"){
doc=_8e5.responseText;
}
var _8e7=this.format?new this.format():new OpenLayers.Format.GeoRSS();
var _8e8=_8e7.read(doc);
this.addFeatures(_8e8);
},requestFailure:function(_8e9){
alert("Error in loading GML file "+this.url);
},getFeatureByFid:function(fid){
var _8eb=this;
if(!_8eb){
return null;
}
var _8ec=_8eb.features;
if(!_8ec){
return null;
}
for(var i=0;i<_8ec.length;++i){
if(_8ec[i].fid==fid){
return _8ec[i];
}
}
},CLASS_NAME:"OpenLayers.Layer.GeoRSSvector"});
OpenLayers.Layer.KaMap=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:true,units:null,resolution:OpenLayers.DOTS_PER_INCH,DEFAULT_PARAMS:{i:"jpeg",map:""},initialize:function(name,url,_8f0,_8f1){
var _8f2=[];
_8f2.push(name,url,_8f0,_8f1);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_8f2);
this.params=(_8f0?_8f0:{});
if(_8f0){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},getURL:function(_8f3){
_8f3=this.adjustBounds(_8f3);
var _8f4=this.map.getResolution();
var _8f5=Math.round((this.map.getScale()*10000))/10000;
var pX=Math.round(_8f3.left/_8f4);
var pY=-Math.round(_8f3.top/_8f4);
return this.getFullRequestString({t:pY,l:pX,s:_8f5});
},addTile:function(_8f8,_8f9){
var url=this.getURL(_8f8);
return new OpenLayers.Tile.Image(this,_8f9,_8f8,url,this.tileSize);
},initGriddedTiles:function(){
var _8fb=this.map.getSize();
var _8fc=this.map.getExtent();
var _8fd=this.map.getMaxExtent();
var _8fe=this.map.getResolution();
var _8ff=_8fe*this.tileSize.w;
var _900=_8fe*this.tileSize.h;
var _901=_8fc.left;
var _902=Math.floor(_901/_8ff);
var _903=_901/_8ff-_902;
var _904=-_903*this.tileSize.w;
var _905=_902*_8ff;
var _906=_8fc.top;
var _907=Math.ceil(_906/_900);
var _908=_907-_906/_900;
var _909=-(_908+1)*this.tileSize.h;
var _90a=_907*_900;
_904=Math.round(_904);
_909=Math.round(_909);
this.origin=new OpenLayers.Pixel(_904,_909);
var _90b=_904;
var _90c=_905;
var _90d=0;
do{
var row;
row=this.grid[_90d++];
if(!row){
row=[];
this.grid.push(row);
}
_905=_90c;
_904=_90b;
var _90f=0;
do{
var _910=new OpenLayers.Bounds(_905,_90a,_905+_8ff,_90a+_900);
var x=_904;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_909;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile;
tile=row[_90f++];
if(!tile){
tile=this.addTile(_910,px);
row.push(tile);
}else{
tile.moveTo(_910,px,false);
}
_905+=_8ff;
_904+=this.tileSize.w;
}while(_905<=_8fc.right+_8ff*this.buffer);
_90a-=_900;
_909+=this.tileSize.h;
}while(_90a>=_8fc.bottom-_900*this.buffer);
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
},CLASS_NAME:"OpenLayers.Layer.KaMap"});
OpenLayers.Layer.MapServer=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{mode:"map",map_imagetype:"png"},initialize:function(name,url,_918,_919){
var _91a=[];
_91a.push(name,url,_918,_919);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_91a);
if(arguments.length>0){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
if(_919==null||_919.isBaseLayer==null){
this.isBaseLayer=((this.params.transparent!="true")&&(this.params.transparent!=true));
}
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.MapServer(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},addTile:function(_91c,_91d){
return new OpenLayers.Tile.Image(this,_91d,_91c,null,this.tileSize);
},getURL:function(_91e){
_91e=this.adjustBounds(_91e);
var _91f=[_91e.left,_91e.bottom,_91e.right,_91e.top];
var _920=this.getImageSize();
var url=this.getFullRequestString({mapext:_91f,imgext:_91f,map_size:[_920.w,_920.h],imgx:_920.w/2,imgy:_920.h/2,imgxy:[_920.w,_920.h]});
return url;
},getFullRequestString:function(_922,_923){
var url=(_923==null)?this.url:_923;
if(typeof url=="object"){
url=url[Math.floor(Math.random()*url.length)];
}
var _925=url;
var _926=OpenLayers.Util.extend({},this.params);
_926=OpenLayers.Util.extend(_926,_922);
var _927=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getArgs(url));
for(var key in _926){
if(key.toUpperCase() in _927){
delete _926[key];
}
}
var _929=OpenLayers.Util.getParameterString(_926);
_929=_929.replace(/,/g,"+");
if(_929!=""){
var _92a=url.charAt(url.length-1);
if((_92a=="&")||(_92a=="?")){
_925+=_929;
}else{
if(url.indexOf("?")==-1){
_925+="?"+_929;
}else{
_925+="&"+_929;
}
}
}
return _925;
},CLASS_NAME:"OpenLayers.Layer.MapServer"});
OpenLayers.Layer.TMS=OpenLayers.Class(OpenLayers.Layer.Grid,{reproject:false,isBaseLayer:true,tileOrigin:null,initialize:function(name,url,_92d){
var _92e=[];
_92e.push(name,url,{},_92d);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_92e);
},destroy:function(){
OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TMS(this.name,this.url,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_930){
_930=this.adjustBounds(_930);
var res=this.map.getResolution();
var x=(_930.left-this.tileOrigin.lon)/(res*this.tileSize.w);
var y=(_930.bottom-this.tileOrigin.lat)/(res*this.tileSize.h);
var z=this.map.getZoom();
var path="1.0.0"+"/"+this.layername+"/"+z+"/"+x+"/"+y+"."+this.type;
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
return url+path;
},addTile:function(_937,_938){
return new OpenLayers.Tile.Image(this,_938,_937,null,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TMS"});
OpenLayers.Layer.TileCache=OpenLayers.Class(OpenLayers.Layer.Grid,{reproject:false,isBaseLayer:true,tileOrigin:null,format:"image/png",initialize:function(name,url,_93c,_93d){
_93d=OpenLayers.Util.extend({maxResolution:180/256},_93d);
this.layername=_93c;
OpenLayers.Layer.Grid.prototype.initialize.apply(this,[name,url,{},_93d]);
this.extension=this.format.split("/")[1].toLowerCase();
this.extension=(this.extension=="jpeg")?"jpg":this.extension;
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TileCache(this.name,this.url,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_93f){
var res=this.map.getResolution();
var bbox=this.maxExtent;
var size=this.tileSize;
var _943=Math.floor((_93f.left-bbox.left)/(res*size.w));
var _944=Math.floor((_93f.bottom-bbox.bottom)/(res*size.h));
var _945=this.map.zoom;
function zeroPad(_946,_947){
_946=String(_946);
var _948=[];
for(var i=0;i<_947;++i){
_948.push("0");
}
return _948.join("").substring(0,_947-_946.length)+_946;
}
var _94a=[this.layername,zeroPad(_945,2),zeroPad(parseInt(_943/1000000),3),zeroPad((parseInt(_943/1000)%1000),3),zeroPad((parseInt(_943)%1000),3),zeroPad(parseInt(_944/1000000),3),zeroPad((parseInt(_944/1000)%1000),3),zeroPad((parseInt(_944)%1000),3)+"."+this.extension];
var path=_94a.join("/");
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
url=(url.charAt(url.length-1)=="/")?url:url+"/";
return url+path;
},addTile:function(_94d,_94e){
var url=this.getURL(_94d);
return new OpenLayers.Tile.Image(this,_94e,_94d,url,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TileCache"});
OpenLayers.Layer.WFS=OpenLayers.Class(OpenLayers.Layer.Vector,OpenLayers.Layer.Markers,{isBaseLayer:false,ratio:2,DEFAULT_PARAMS:{service:"WFS",version:"1.0.0",request:"GetFeature"},featureClass:null,vectorMode:true,initialize:function(name,url,_953,_954){
if(_954==undefined){
_954={};
}
if(_954.featureClass||!OpenLayers.Layer.Vector||!OpenLayers.Feature.Vector){
this.vectorMode=false;
}
OpenLayers.Util.extend(_954,{"reportError":false});
var _955=[];
_955.push(name,_954);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_955);
if(!this.renderer||!this.vectorMode){
this.vectorMode=false;
if(!_954.featureClass){
_954.featureClass=OpenLayers.Feature.WFS;
}
OpenLayers.Layer.Markers.prototype.initialize.apply(this,_955);
}
if(this.params&&this.params.typename&&!this.options.typename){
this.options.typename=this.params.typename;
}
if(!this.options.geometry_column){
this.options.geometry_column="the_geom";
}
this.params=_953;
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
},moveTo:function(_957,_958,_959){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.moveTo.apply(this,arguments);
}
if(_959){
return false;
}
if(_958){
if(this.vectorMode){
this.renderer.clear();
}
}
if(this.options.minZoomLevel&&(this.map.getZoom()<this.options.minZoomLevel)){
return null;
}
if(_957==null){
_957=this.map.getExtent();
}
var _95a=(this.tile==null);
var _95b=(!_95a&&!this.tile.bounds.containsBounds(_957));
if(_958||_95a||(!_959&&_95b)){
var _95c=_957.getCenterLonLat();
var _95d=_957.getWidth()*this.ratio;
var _95e=_957.getHeight()*this.ratio;
var _95f=new OpenLayers.Bounds(_95c.lon-(_95d/2),_95c.lat-(_95e/2),_95c.lon+(_95d/2),_95c.lat+(_95e/2));
var _960=this.map.getSize();
_960.w=_960.w*this.ratio;
_960.h=_960.h*this.ratio;
var ul=new OpenLayers.LonLat(_95f.left,_95f.top);
var pos=this.map.getLayerPxFromLonLat(ul);
var url=this.getFullRequestString();
var _964={BBOX:_95f.toBBOX()};
url+="&"+OpenLayers.Util.getParameterString(_964);
if(!this.tile){
this.tile=new OpenLayers.Tile.WFS(this,pos,_95f,url,_960);
this.tile.draw();
}else{
if(this.vectorMode){
this.destroyFeatures();
this.renderer.clear();
}else{
this.clearMarkers();
}
this.tile.destroy();
this.tile=null;
this.tile=new OpenLayers.Tile.WFS(this,pos,_95f,url,_960);
this.tile.draw();
}
}
},onMapResize:function(){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.onMapResize.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.onMapResize.apply(this,arguments);
}
},mergeNewParams:function(_965){
var _966=OpenLayers.Util.upperCaseObject(_965);
var _967=[_966];
OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this,_967);
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
},getFullRequestString:function(_969){
var _96a=this.map.getProjection();
this.params.SRS=(_96a=="none")?null:_96a;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},commit:function(){
if(!this.writer){
this.writer=new OpenLayers.Format.WFS({},this);
}
var data=this.writer.write(this.features);
var url=this.url;
if(OpenLayers.ProxyHost&&this.url.startsWith("http")){
url=OpenLayers.ProxyHost+escape(this.url);
}
var _96d=this.commitSuccess.bind(this);
var _96e=this.commitFailure.bind(this);
data=OpenLayers.Ajax.serializeXMLToString(data);
new OpenLayers.Ajax.Request(url,{method:"post",postBody:data,onComplete:_96d,onFailure:_96e});
},commitSuccess:function(_96f){
var _970=_96f.responseText;
if(_970.indexOf("SUCCESS")!=-1){
this.commitReport("WFS Transaction: SUCCESS",_970);
for(var i=0;i<this.features.length;i++){
this.features[i].state=null;
}
}else{
if(_970.indexOf("FAILED")!=-1||_970.indexOf("Exception")!=-1){
this.commitReport("WFS Transaction: FAILED",_970);
}
}
},commitFailure:function(_972){
},commitReport:function(_973,_974){
alert(_973);
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
OpenLayers.Layer.WMS=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{service:"WMS",version:"1.1.1",request:"GetMap",styles:"",exceptions:"application/vnd.ogc.se_inimage",format:"image/jpeg"},reproject:true,isBaseLayer:true,initialize:function(name,url,_977,_978){
var _979=[];
_977=OpenLayers.Util.upperCaseObject(_977);
_979.push(name,url,_977,_978);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_979);
OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
if(this.params.TRANSPARENT&&this.params.TRANSPARENT.toString().toLowerCase()=="true"){
if((_978==null)||(!_978.isBaseLayer)){
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
},getURL:function(_97b){
_97b=this.adjustBounds(_97b);
var _97c=this.getImageSize();
return this.getFullRequestString({BBOX:_97b.toBBOX(),WIDTH:_97c.w,HEIGHT:_97c.h});
},addTile:function(_97d,_97e){
return new OpenLayers.Tile.Image(this,_97e,_97d,null,this.tileSize);
},mergeNewParams:function(_97f){
var _980=OpenLayers.Util.upperCaseObject(_97f);
var _981=[_980];
OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,_981);
},getFullRequestString:function(_982){
var _983=this.map.getProjection();
this.params.SRS=(_983=="none")?null:_983;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Layer.WMS"});
OpenLayers.Layer.WorldWind=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{},isBaseLayer:true,lzd:null,zoomLevels:null,initialize:function(name,url,lzd,_987,_988,_989){
this.lzd=lzd;
this.zoomLevels=_987;
var _98a=[];
_98a.push(name,url,_988,_989);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_98a);
this.params=(_988?_988:{});
if(_988){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},addTile:function(_98b,_98c){
return new OpenLayers.Tile.Image(this,_98c,_98b,null,this.tileSize);
},getZoom:function(){
var zoom=this.map.getZoom();
var _98e=this.map.getMaxExtent();
zoom=zoom-Math.log(this.maxResolution/(this.lzd/512))/Math.log(2);
return zoom;
},getURL:function(_98f){
_98f=this.adjustBounds(_98f);
var zoom=this.getZoom();
var _991=this.map.getMaxExtent();
var deg=this.lzd/Math.pow(2,this.getZoom());
var x=Math.floor((_98f.left-_991.left)/deg);
var y=Math.floor((_98f.bottom-_991.bottom)/deg);
if(this.map.getResolution()<=(this.lzd/512)&&this.getZoom()<=this.zoomLevels){
return this.getFullRequestString({L:zoom,X:x,Y:y});
}else{
return OpenLayers.Util.getImagesLocation()+"blank.gif";
}
},CLASS_NAME:"OpenLayers.Layer.WorldWind"});
OpenLayers.Control.NavToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(_995){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_995]);
this.addControls([new OpenLayers.Control.Navigation(),new OpenLayers.Control.ZoomBox()]);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.NavToolbar"});
OpenLayers.Format.WFS=OpenLayers.Class(OpenLayers.Format.GML,{layer:null,wfsns:"http://www.opengis.net/wfs",initialize:function(_997,_998){
OpenLayers.Format.GML.prototype.initialize.apply(this,[_997]);
this.layer=_998;
if(this.layer.featureNS){
this.featureNS=this.layer.featureNS;
}
if(this.layer.options.geometry_column){
this.geometryName=this.layer.options.geometry_column;
}
if(this.layer.options.typename){
this.featureName=this.layer.options.typename;
}
},write:function(_999){
var _99a=document.createElementNS("http://www.opengis.net/wfs","wfs:Transaction");
_99a.setAttribute("version","1.0.0");
_99a.setAttribute("service","WFS");
for(var i=0;i<_999.length;i++){
switch(_999[i].state){
case OpenLayers.State.INSERT:
_99a.appendChild(this.insert(_999[i]));
break;
case OpenLayers.State.UPDATE:
_99a.appendChild(this.update(_999[i]));
break;
case OpenLayers.State.DELETE:
_99a.appendChild(this.remove(_999[i]));
break;
}
}
return _99a;
},createFeatureXML:function(_99c){
var _99d=this.buildGeometryNode(_99c.geometry);
var _99e=document.createElementNS(this.featureNS,"feature:"+this.geometryName);
_99e.appendChild(_99d);
var _99f=document.createElementNS(this.featureNS,"feature:"+this.featureName);
_99f.appendChild(_99e);
for(var attr in _99c.attributes){
var _9a1=document.createTextNode(_99c.attributes[attr]);
var _9a2=attr;
if(attr.search(":")!=-1){
_9a2=attr.split(":")[1];
}
var _9a3=document.createElementNS(this.featureNS,"feature:"+_9a2);
_9a3.appendChild(_9a1);
_99f.appendChild(_9a3);
}
return _99f;
},insert:function(_9a4){
var _9a5=document.createElementNS(this.wfsns,"wfs:Insert");
_9a5.appendChild(this.createFeatureXML(_9a4));
return _9a5;
},update:function(_9a6){
if(!_9a6.fid){
alert("Can't update a feature for which there is no FID.");
}
var _9a7=document.createElementNS(this.wfsns,"wfs:Update");
_9a7.setAttribute("typeName",this.layerName);
var _9a8=document.createElementNS(this.wfsns,"wfs:Property");
var _9a9=document.createElementNS("http://www.opengis.net/wfs","wfs:Name");
var _9aa=document.createTextNode(this.geometryName);
_9a9.appendChild(_9aa);
_9a8.appendChild(_9a9);
var _9ab=document.createElementNS("http://www.opengis.net/wfs","wfs:Value");
_9ab.appendChild(this.buildGeometryNode(_9a6.geometry));
_9a8.appendChild(_9ab);
_9a7.appendChild(_9a8);
var _9ac=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _9ad=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_9ad.setAttribute("fid",_9a6.fid);
_9ac.appendChild(_9ad);
_9a7.appendChild(_9ac);
return _9a7;
},remove:function(_9ae){
if(!_9ae.attributes.fid){
alert("Can't update a feature for which there is no FID.");
return false;
}
var _9af=document.createElementNS(this.featureNS,"wfs:Delete");
_9af.setAttribute("typeName",this.layerName);
var _9b0=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _9b1=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_9b1.setAttribute("fid",_9ae.attributes.fid);
_9b0.appendChild(_9b1);
_9af.appendChild(_9b0);
return _9af;
},destroy:function(){
this.layer=null;
},CLASS_NAME:"OpenLayers.Format.WFS"});
OpenLayers.Geometry.MultiLineString=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LineString"],initialize:function(_9b2){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiLineString"});
OpenLayers.Geometry.MultiPoint=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_9b3){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},addPoint:function(_9b4,_9b5){
this.addComponent(_9b4,_9b5);
},removePoint:function(_9b6){
this.removeComponent(_9b6);
},CLASS_NAME:"OpenLayers.Geometry.MultiPoint"});
OpenLayers.Geometry.MultiPolygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Polygon"],initialize:function(_9b7){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiPolygon"});
OpenLayers.Geometry.Polygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LinearRing"],initialize:function(_9b8){
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
OpenLayers.Handler.Point=OpenLayers.Class(OpenLayers.Handler,{point:null,layer:null,drawing:false,mouseDown:false,lastDown:null,lastUp:null,initialize:function(_9bb,_9bc,_9bd){
this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},activate:function(){
if(!OpenLayers.Handler.prototype.activate.apply(this,arguments)){
return false;
}
var _9be={displayInLayerSwitcher:false};
this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,_9be);
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
return true;
},destroyFeature:function(){
this.point.destroy();
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
var _9c1=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_9c1.lon;
this.point.geometry.y=_9c1.lat;
this.drawFeature();
return false;
},mousemove:function(evt){
if(this.drawing){
var _9c3=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_9c3.lon;
this.point.geometry.y=_9c3.lat;
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
OpenLayers.Layer.MapServer.Untiled=OpenLayers.Class(OpenLayers.Layer.HTTPRequest,{default_params:{mode:"map",map_imagetype:"png"},reproject:true,ratio:1,tile:null,doneLoading:false,initialize:function(name,url,_9c7,_9c8){
var _9c9=[];
_9c9.push(name,url,_9c7,_9c8);
OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this,_9c9);
OpenLayers.Util.applyDefaults(this.params,this.default_params);
if((_9c8==null)||(_9c8.isBaseLayer==null)){
this.isBaseLayer=((this.params.transparent!="true")&&(this.params.transparent!=true));
}
},destroy:function(){
if(this.tile){
this.tile.destroy();
this.tile=null;
}
OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.MapServer.Untiled(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this,[obj]);
return obj;
},setMap:function(map){
OpenLayers.Layer.HTTPRequest.prototype.setMap.apply(this,arguments);
},setTileSize:function(){
var _9cc=this.map.getSize();
_9cc.w=_9cc.w*this.ratio;
_9cc.h=_9cc.h*this.ratio;
this.tileSize=_9cc;
},moveTo:function(_9cd,_9ce,_9cf){
if(!this.doneLoading){
this.events.triggerEvent("loadcancel");
this.doneLoading=true;
}
OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
if(_9cd==null){
_9cd=this.map.getExtent();
}
var _9d0=(this.tile==null);
var _9d1=(!_9d0&&!this.tile.bounds.containsBounds(_9cd));
if(_9ce||_9d0||(!_9cf&&_9d1)){
if(this.tile){
this.tile.clear();
}
var _9d2=_9cd.getCenterLonLat();
var _9d3=_9cd.getWidth()*this.ratio;
var _9d4=_9cd.getHeight()*this.ratio;
var _9d5=new OpenLayers.Bounds(_9d2.lon-(_9d3/2),_9d2.lat-(_9d4/2),_9d2.lon+(_9d3/2),_9d2.lat+(_9d4/2));
this.setTileSize();
var ul=new OpenLayers.LonLat(_9d5.left,_9d5.top);
var pos=this.map.getLayerPxFromLonLat(ul);
if(this.tile&&!this.tile.size.equals(this.tileSize)){
this.tile.destroy();
this.tile=null;
}
this.events.triggerEvent("loadstart");
this.doneLoading=false;
if(!this.tile){
this.tile=new OpenLayers.Tile.Image(this,pos,_9d5,null,this.tileSize);
this.tile.draw();
var _9d8=function(){
this.doneLoading=true;
this.events.triggerEvent("loadend");
};
OpenLayers.Event.observe(this.tile.imgDiv,"load",_9d8.bind(this));
}else{
this.tile.moveTo(_9d5,pos);
}
}
},getURL:function(_9d9){
var url=this.getFullRequestString({mapext:_9d9.toBBOX().replace(/,/g," "),imgext:_9d9.toBBOX().replace(/,/g," "),map_size:this.tileSize.w+" "+this.tileSize.h,imgx:this.tileSize.w/2,imgy:this.tileSize.h/2,imgxy:this.tileSize.w+" "+this.tileSize.h});
return url;
},setUrl:function(_9db){
OpenLayers.Layer.HTTPRequest.prototype.setUrl.apply(this,arguments);
this.redraw();
},getFullRequestString:function(_9dc){
var _9dd=this.map.getProjection();
this.params.srs=(_9dd=="none")?null:_9dd;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Layer.MapServer.Untiled"});
OpenLayers.Layer.WMS.Untiled=OpenLayers.Class(OpenLayers.Layer.WMS,{singleTile:true,initialize:function(name,url,_9e0,_9e1){
OpenLayers.Layer.WMS.prototype.initialize.apply(this,arguments);
var msg="The OpenLayers.Layer.WMS.Untiled class is deprecated and "+"will be removed in 3.0. Instead, you should use the "+"normal OpenLayers.Layer.WMS class, passing it the option "+"'singleTile' as true.";
OpenLayers.Console.warn(msg);
},CLASS_NAME:"OpenLayers.Layer.WMS.Untiled"});
OpenLayers.Geometry.Curve=OpenLayers.Class(OpenLayers.Geometry.MultiPoint,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_9e3){
OpenLayers.Geometry.MultiPoint.prototype.initialize.apply(this,arguments);
},getLength:function(){
var _9e4=0;
if(this.components&&(this.components.length>1)){
for(var i=1;i<this.components.length;i++){
_9e4+=this.components[i-1].distanceTo(this.components[i]);
}
}
return _9e4;
},CLASS_NAME:"OpenLayers.Geometry.Curve"});
OpenLayers.Geometry.LineString=OpenLayers.Class(OpenLayers.Geometry.Curve,{initialize:function(_9e6){
OpenLayers.Geometry.Curve.prototype.initialize.apply(this,arguments);
},removeComponent:function(_9e7){
if(this.components&&(this.components.length>2)){
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
}
},CLASS_NAME:"OpenLayers.Geometry.LineString"});
OpenLayers.Geometry.LinearRing=OpenLayers.Class(OpenLayers.Geometry.LineString,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_9e8){
OpenLayers.Geometry.LineString.prototype.initialize.apply(this,arguments);
},addComponent:function(_9e9,_9ea){
var _9eb=false;
var _9ec=this.components[this.components.length-1];
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,[_9ec]);
if(_9ea!=null||!_9e9.equals(_9ec)){
_9eb=OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,arguments);
}
var _9ed=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_9ed.clone()]);
return _9eb;
},removeComponent:function(_9ee){
if(this.components.length>4){
var _9ef=this.components[this.components.length-1];
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,[_9ef]);
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
var _9f0=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_9f0.clone()]);
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
OpenLayers.Handler.Path=OpenLayers.Class(OpenLayers.Handler.Point,{line:null,freehand:false,freehandToggle:"shiftKey",initialize:function(_9f6,_9f7,_9f8){
OpenLayers.Handler.Point.prototype.initialize.apply(this,arguments);
},createFeature:function(){
this.line=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString());
this.point=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point());
},destroyFeature:function(){
this.line.destroy();
this.point.destroy();
},addPoint:function(){
this.line.geometry.addComponent(this.point.geometry.clone(),this.line.geometry.components.length);
this.callback("point",[this.point.geometry]);
},freehandMode:function(evt){
return (this.freehandToggle&&evt[this.freehandToggle])?!this.freehand:this.freehand;
},modifyFeature:function(){
var _9fa=this.line.geometry.components.length-1;
this.line.geometry.components[_9fa].x=this.point.geometry.x;
this.line.geometry.components[_9fa].y=this.point.geometry.y;
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
var _9fc=this.control.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_9fc.lon;
this.point.geometry.y=_9fc.lat;
if((this.lastUp==null)||!this.lastUp.equals(evt.xy)){
this.addPoint();
}
this.drawFeature();
this.drawing=true;
return false;
},mousemove:function(evt){
if(this.drawing){
var _9fe=this.map.getLonLatFromPixel(evt.xy);
this.point.geometry.x=_9fe.lon;
this.point.geometry.y=_9fe.lat;
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
var _a01=this.line.geometry.components.length-1;
this.line.geometry.removeComponent(this.line.geometry.components[_a01]);
this.finalize();
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Path"});
OpenLayers.Handler.Polygon=OpenLayers.Class(OpenLayers.Handler.Path,{polygon:null,initialize:function(_a02,_a03,_a04){
OpenLayers.Handler.Path.prototype.initialize.apply(this,arguments);
},createFeature:function(){
this.polygon=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon());
this.line=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LinearRing());
this.polygon.geometry.addComponent(this.line.geometry);
this.point=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point());
},destroyFeature:function(){
this.polygon.destroy();
this.point.destroy();
},modifyFeature:function(){
var _a05=this.line.geometry.components.length-2;
this.line.geometry.components[_a05].x=this.point.geometry.x;
this.line.geometry.components[_a05].y=this.point.geometry.y;
},drawFeature:function(){
this.layer.drawFeature(this.polygon,this.style);
this.layer.drawFeature(this.point,this.style);
},geometryClone:function(){
return this.polygon.geometry.clone();
},dblclick:function(evt){
if(!this.freehandMode(evt)){
var _a07=this.line.geometry.components.length-2;
this.line.geometry.removeComponent(this.line.geometry.components[_a07]);
this.finalize();
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Polygon"});
OpenLayers.Control.EditingToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(_a08,_a09){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_a09]);
this.addControls([new OpenLayers.Control.Navigation()]);
var _a0a=[new OpenLayers.Control.DrawFeature(_a08,OpenLayers.Handler.Point,{"displayClass":"olControlDrawFeaturePoint"}),new OpenLayers.Control.DrawFeature(_a08,OpenLayers.Handler.Path,{"displayClass":"olControlDrawFeaturePath"}),new OpenLayers.Control.DrawFeature(_a08,OpenLayers.Handler.Polygon,{"displayClass":"olControlDrawFeaturePolygon"})];
for(var i=0;i<_a0a.length;i++){
_a0a[i].featureAdded=function(_a0c){
_a0c.state=OpenLayers.State.INSERT;
};
}
this.addControls(_a0a);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.EditingToolbar"});

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

if(!Sarissa.IS_ENABLED_TRANSFORM_NODE&&window.XSLTProcessor){
XMLElement.prototype.transformNodeToObject=function(_1,_2){
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
XMLElement.prototype.transformNode=function(_8){
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

if(!_SARISSA_IS_IE){
if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
Sarissa.__handleLoad__=function(_1){
Sarissa.__setReadyState__(_1,4);
};
function SarissaParseError(){
this.errorCode=0;
}
_sarissa_XMLDocument_onload=function(){
Sarissa.__handleLoad__(this);
};
Sarissa.__setReadyState__=function(_2,_3){
_2.readyState=_3;
_2.readystate=_3;
if(_2.onreadystatechange!=null&&typeof _2.onreadystatechange=="function"){
_2.onreadystatechange();
}
};
Sarissa.getDomDocument=function(_4,_5){
var _6=document.implementation.createDocument(_4?_4:null,_5?_5:null,null);
if(!_6.onreadystatechange){
_6.onreadystatechange=null;
}
if(!_6.readyState){
_6.readyState=0;
}
if(!_6.parseError){
_6.parseError=new SarissaParseError();
}
_6.addEventListener("load",_sarissa_XMLDocument_onload,false);
return _6;
};
if(window.XMLDocument){
XMLDocument.prototype._sarissa_load=XMLDocument.prototype.load;
XMLDocument.prototype.load=function(_7){
var _8=Sarissa.getDomDocument();
Sarissa.copyChildNodes(this,_8);
this.parseError.errorCode=0;
Sarissa.__setReadyState__(this,1);
try{
if(this.async==false&&_SARISSA_SYNC_NON_IMPLEMENTED){
var _9=new XMLHttpRequest();
_9.open("GET",_7,false);
_9.send(null);
Sarissa.__setReadyState__(this,2);
Sarissa.copyChildNodes(_9.responseXML,this);
Sarissa.__setReadyState__(this,3);
}else{
this._sarissa_load(_7);
}
}
catch(objException){
_8.parseError.errorCode=-1;
}
finally{
if(!_8.documentElement||_8.documentElement.tagName=="parsererror"){
_8.parseError.errorCode=-1;
}
if(this.async==false){
Sarissa.__handleLoad__(this);
}
}
return _8;
};
}else{
if(document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("LS","3.0")){
Document.prototype.async=true;
Document.prototype.onreadystatechange=null;
Document.prototype.load=function(_a){
var _b=Sarissa.getDomDocument();
Sarissa.copyChildNodes(this,_b,false);
var _c=document.implementation.createLSParser(this.async?document.implementation.MODE_ASYNCHRONOUS:document.implementation.MODE_SYNCHRONOUS,null);
if(this.async){
var _d=this;
_c.addEventListener("load",function(e){
_d.readyState=4;
Sarissa.copyChildNodes(e.newDocument,_d,false);
_d.onreadystatechange.call();
},false);
}
try{
var _f=_c.parseURI(_a);
if(!this.async){
Sarissa.copyChildNodes(_f,this,false);
}
}
catch(e){
this.parseError.errorCode=-1;
}
return _b;
};
Sarissa.getDomDocument=function(_10,_11){
var _12=document.implementation.createDocument(_10?_10:null,_11?_11:null,null);
if(!_12.parseError){
_12.parseError={errorCode:0};
}
return _12;
};
}else{
Sarissa.getDomDocument=function(_13,_14){
var _15=document.implementation.createDocument(_13?_13:null,_14?_14:null,null);
if(_15&&(_13||_14)&&!_15.documentElement){
_15.appendChild(_15.createElementNS(_13,_14));
}
if(!_15.load){
_15.load=function(_16){
var _17=document.implementation.createDocument();
Sarissa.copyChildNodes(this,_17);
this.parseError={errorCode:0};
Sarissa.__setReadyState__(this,1);
if(this.async==false){
var tmp=new XMLHttpRequest();
tmp.open("GET",_16,false);
tmp.send(null);
Sarissa.__setReadyState__(this,2);
Sarissa.copyChildNodes(tmp.responseXML,_15);
if(!_15.documentElement||_15.getElementsByTagName("parsererror").length>0){
_15.parseError.errorCode=-1;
}
Sarissa.__setReadyState__(this,3);
Sarissa.__setReadyState__(this,4);
}else{
var _19=new XMLHttpRequest();
_19.open("GET",_16,true);
_19.onreadystatechange=function(){
if(_19.readyState==4){
Sarissa.copyChildNodes(_19.responseXML,_15);
if(!_15.documentElement||_15.getElementsByTagName("parsererror").length>0){
_15.parseError.errorCode=-1;
}
}
Sarissa.__setReadyState__(_15,_19.readyState);
};
_19.send(null);
}
return _17;
};
}
return _15;
};
}
}
}
}

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
return _d.firstChild.nodeValue;
}
};
this.getServiceName=function(){
var _e="/WMT_MS_Capabilities/Service/Name";
var _f=this.doc.selectSingleNode(_e);
return _f.firstChild.nodeValue;
};
this.getFeatureNode=function(_10){
return this.doc.selectSingleNode("//Layer[Name='"+_10+"']");
};
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
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
function FeatureTypeSchema(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
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

mapbuilder.loadScript(baseDir+"/model/FeatureCollection.js");
function OwsCatResources(_1,_2){
FeatureCollection.apply(this,new Array(_1,_2));
this.namespace="xmlns:owscat='http://www.ec.gc.ca/owscat' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
}
OwsCatResources.prototype.getFeatureNode=function(_3){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[owscat:name='"+_3+"']");
};

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
_d.load(_e);
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

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Model(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
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
this.getXpathValue=function(_a,_b,_c){
if(_c==null){
_c=false;
}
if(!_a.doc){
return null;
}
var _d;
if(_c){
_d=_a.doc.selectSingleNode(_a.hackSarissaDefaultNSXPathIssue(_b));
}else{
_d=_a.doc.selectSingleNode(_b);
}
if(_d&&_d.firstChild){
return _d.firstChild.nodeValue;
}else{
return null;
}
};
this.setXpathAttribute=function(_e,_f,_10,_11,_12,_13){
if(_12==null){
_12=true;
}
if(_13==null){
_13=false;
}
var _14;
if(_13){
_14=_e.doc.selectSingleNode(_e.hackSarissaDefaultNSXPathIssue(_f));
}else{
_14=_e.doc.selectSingleNode(_f);
}
if(_14){
_14.setAttribute(_10,_11);
if(_12){
_e.setParam("refresh");
}
return true;
}else{
return false;
}
};
this.setXpathValue=function(_15,_16,_17,_18,_19){
if(_18==null){
_18=true;
}
if(_19==null){
_19=false;
}
var _1a;
if(_19){
_1a=_15.doc.selectSingleNode(_15.hackSarissaDefaultNSXPathIssue(_16));
}else{
_1a=_15.doc.selectSingleNode(_16);
}
if(_1a){
if(_1a.firstChild){
_1a.firstChild.nodeValue=_17;
}else{
dom=Sarissa.getDomDocument();
v=dom.createTextNode(_17);
_1a.appendChild(v);
}
if(_18){
_15.setParam("refresh");
}
return true;
}else{
return false;
}
};
this.hackSarissaDefaultNSXPathIssue=function(_1b){
var _1c="";
var _1d="";
var _1e="";
var _1f=false;
var _20="__ILIKEMYOLDDELIMITERBETTERTHANMYNEWDELIMITER__";
var _21="";
for(var n=0;n<_1b.length;n++){
if(_1b.charAt(n)=="["){
_1f=true;
_21+=_1b.charAt(n);
}else{
if(_1b.charAt(n)=="]"){
_1f=false;
_21+=_1b.charAt(n);
if(!_1d==""){
_1d+=_20;
}
_1d+=_1e;
_1e="";
}else{
if(_1f){
_1e+=_1b.charAt(n);
}else{
_21+=_1b.charAt(n);
}
}
}
}
var _23=_21.split("/");
for(var n=0;n<_23.length;n++){
var _24=_23[n];
if(_24.length>0&&!_24.startsWith("@")){
hasNamespaceReg=new RegExp("^\\w*\\:");
var _25=hasNamespaceReg.exec(_24);
if(_25==null){
_24="def:"+_24;
}
}
if(n!=0){
_1c+="/";
}
_1c+=_24;
}
var _26=_1d.split(_20);
var _27=_1c.split("[]");
_1c="";
if(_26.length==1&&_26[0]==""){
_1c=_27[0];
}else{
if(_26.length==_27.length-1){
for(var n=0;n<_26.length;n++){
_1c+=_27[n]+"["+_26[n]+"]";
}
_1c+=_27[_27.length-1];
}else{
_1c=_1b;
alert("Couldn't handle this XPath: "+_1b);
}
}
return _1c;
};
this.loadModelDoc=function(_28){
if(_28.url){
_28.callListeners("newModel");
_28.setParam("modelStatus","loading");
if(_28.contentType=="image"){
_28.doc=new Image();
_28.doc.src=_28.url;
}else{
var _29=new XMLHttpRequest();
var _2a=_28.url;
if(_2a.indexOf("http://")==0){
if(_28.method.toLowerCase()=="get"){
_2a=getProxyPlusUrl(_2a);
}else{
_2a=config.proxyUrl;
}
}
_29.open(_28.method,_2a,_28.async);
if(_28.method.toLowerCase()=="post"){
_29.setRequestHeader("content-type",_28.contentType);
_29.setRequestHeader("serverUrl",_28.url);
}
_29.onreadystatechange=function(){
_28.setParam("modelStatus",httpStatusMsg[_29.readyState]);
if(_29.readyState==4){
if(_29.status>=400){
var _2b=mbGetMessage("errorLoadingDocument",_2a,_29.statusText,_29.responseText);
alert(_2b);
_28.setParam("modelStatus",_2b);
return;
}else{
if((_29.responseXML!=null)&&(_29.responseXML.root!=null)&&(_29.responseXML.root.children.length>0)){
_28.doc=_29.responseXML;
if(Sarissa.getParseErrorText(_28.doc)==Sarissa.PARSED_OK){
_28.finishLoading();
}else{
alert(mbGetMessage("parseError",Sarissa.getParseErrorText(_28.doc)));
}
return;
}
if(_29.responseText!=null){
_28.doc=Sarissa.getDomDocument();
_28.doc.async=false;
_28.doc=(new DOMParser()).parseFromString(_29.responseText.replace(/>\s+</g,"><"),"text/xml");
if(_28.doc==null){
alert(mbGetMessage("documentParseError",Sarissa.getParseErrorText(_28.doc)));
}else{
if(Sarissa.getParseErrorText(_28.doc)==Sarissa.PARSED_OK){
_28.finishLoading();
}else{
alert(mbGetMessage("parseError",Sarissa.getParseErrorText(_28.doc)));
}
}
return;
}
}
}
};
_29.send(_28.postData);
if(!_28.async){
if(_29.status>=400){
var _2c=mbGetMessage("errorLoadingDocument",_2a,_29.statusText,_29.responseText);
alert(_2c);
this.objRef.setParam("modelStatus",_2c);
return;
}else{
if(null==_29.responseXML){
alert(mbGetMessage("nullXmlResponse",_29.responseText));
}
_28.doc=_29.responseXML;
_28.finishLoading();
}
}
}
}
};
this.addListener("reloadModel",this.loadModelDoc,this);
this.setModel=function(_2d,_2e){
_2d.callListeners("newModel");
_2d.doc=_2e;
if((_2e==null)&&_2d.url){
_2d.url=null;
}
_2d.finishLoading();
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
this.newRequest=function(_2f,_30){
var _31=_2f;
if(_2f.template){
var _32=_2f.modelNode.parentNode;
if(_SARISSA_IS_IE){
var _33=_32.appendChild(_1.cloneNode(true));
}else{
var _33=_32.appendChild(_2f.modelNode.ownerDocument.importNode(_2f.modelNode,true));
}
_33.removeAttribute("id");
_33.setAttribute("createByTemplate","true");
_31=_2f.createObject(_33);
_31.callListeners("init");
if(!_2f.templates){
_2f.templates=new Array();
}
_2f.templates.push(_31);
}
_31.url=_30.url;
if(!_31.url){
_31.doc=null;
}
_31.method=_30.method;
_31.postData=_30.postData;
_31.loadModelDoc(_31);
};
this.deleteTemplates=function(){
if(this.templates){
while(model=this.templates.pop()){
model.setParam("newModel");
var _34=this.modelNode.parentNode;
_34.removeChild(model.modelNode);
}
}
};
this.saveModel=function(_35){
if(config.serializeUrl){
var _36=postGetLoad(config.serializeUrl,_35.doc,"text/xml","/temp","sld.xml");
if(!_SARISSA_IS_SAFARI){
_36.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_36,"xmlns:xlink='http://www.w3.org/1999/xlink'");
}
var _37=_36.selectSingleNode("//OnlineResource");
var _38=_37.attributes.getNamedItem("xlink:href").nodeValue;
_35.setParam("modelSaved",_38);
}else{
alert(mbGetMessage("noSerializeUrl"));
}
};
this.createObject=function(_39){
var _3a=_39.nodeName;
var _3b=new window[_3a](_39,this);
if(_3b){
config.objects[_3b.id]=_3b;
return _3b;
}else{
alert(mbGetMessage("errorCreatingObject",_3a));
}
};
this.loadObjects=function(_3c){
var _3d=this.modelNode.selectNodes(_3c);
for(var i=0;i<_3d.length;i++){
if(_3d[i].nodeName!="#text"&&_3d[i].nodeName!="#comment"){
this.createObject(_3d[i]);
}
}
};
this.parseConfig=function(_3f){
_3f.loadObjects("mb:widgets/*");
_3f.loadObjects("mb:tools/*");
_3f.loadObjects("mb:models/*");
};
this.refresh=function(_40){
_40.setParam("refresh");
};
this.addListener("loadModel",this.refresh,this);
this.init=function(_41){
_41.callListeners("init");
};
this.clearModel=function(_42){
_42.doc=null;
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
return _8?_8.firstChild.nodeValue:mbGetMessage("noRssTitle");
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
alert(mbGetMessage("invalidGmlGeom"));
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

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
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
alert(mbGetMessage("eventLogSaved",_a));
}else{
alert(mbGetMessage("unableToSaveLog"));
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
_7.setParam("modelStatus",mbGetMessage("convertingCoords"));
var _b=new Proj(_7.containerModel.getSRS());
for(var i=0;i<_8.length;++i){
var _d=_8[i].firstChild.nodeValue;
var _e=_d.split(" ");
var _f="";
for(var j=0;j<_e.length;++j){
var xy=_e[j].split(",");
if(xy.length==2){
var pt=new PT(xy[0],xy[1]);
cs_transform(_a,_b,pt);
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
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function OwsContext(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace=this.namespace?this.namespace.replace(/\"/g,"'")+" ":"";
this.namespace=this.namespace+"xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs' xmlns:sld='http://www.opengis.net/sld'";
this.setHidden=function(_3,_4){
var _5="0";
if(_4){
_5="1";
}
var _6=this.getFeatureNode(_3);
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
_11.map.zoomToExtent(new OpenLayers.Bounds(_12[0],_12[1],_12[2],_12[3]));
_11.setBoundingBox(_11.map.getExtent().toBBOX().split(","));
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
_18.proj=new Proj(_18.getSRS());
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
var _25=this.doc.selectSingleNode("//wmc:ResourceList/*[wmc:Name='"+_24+"']");
if(_25==null){
alert(mbGetMessage("featureNotFoundOwsContext"));
}
return _25;
}
};
this.getServerUrl=function(_26,_27,_28){
return _28.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
};
this.getVersion=function(_29){
return _29.selectSingleNode("wmc:Server").getAttribute("version");
};
this.getMethod=function(_2a){
return _2a.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("wmc:method");
};
this.getBaseLayerService=function(){
x=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[last()]/wmc:Server");
s=x.getAttribute("service");
return s;
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
_31.setParameter("filter",escape((new XMLSerializer()).serializeToString(_32.selectSingleNode("ogc:Filter"))));
}
};
this.getQueryableLayers=function(){
var _33=this.doc.selectNodes("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[attribute::queryable='1']/wmc:Name");
return _33;
};
this.getAllLayers=function(){
var _34=this.doc.selectNodes("//wmc:Layer|//wmc:FeatureType");
return _34;
};
this.getLayer=function(_35){
var _36=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType[@id='"+_35+"']");
if(_36==null){
_36=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[@id='"+_35+"']");
}
if(_36==null){
_36=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_35+"']");
}
if(_36==null){
_36=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:FeatureType[wmc:Name='"+_35+"']");
}
if(_36==null){
_36=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:RssLayer[@id='"+_35+"']");
}
return _36;
};
this.addLayer=function(_37,_38){
if(_37.doc!=null){
var _39=_37.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList");
var id=_38.getAttribute("id");
var str="/wmc:OWSContext/wmc:ResourceList/"+_38.nodeName+"[@id='"+id+"']";
var _3c=_37.doc.selectSingleNode(str);
if(_3c!=null){
_39.removeChild(_3c);
}
_39.appendChild(_38);
_37.modified=true;
if(this.debug){
mbDebugMessage("Adding layer:"+(new XMLSerializer()).serializeToString(_38));
}
}else{
alert(mbGetMessage("nullOwsContext"));
}
_37.callListeners("refresh");
};
this.addFirstListener("addLayer",this.addLayer,this);
this.addSLD=function(_3d,_3e){
var _3f=_3e.selectSingleNode("//Name").firstChild.nodeValue;
var _40=_3d.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_3f+"']");
_40.appendChild(_3e.cloneNode(true));
_3d.modified=true;
var _41=[];
_41["sld_body"]=(new XMLSerializer()).serializeToString(_3d.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_3f+"']/wmc:StyleList/wmc:Style/wmc:SLD/wmc:StyledLayerDescriptor"));
_3d.map.mbMapPane.refreshLayer(_3d.map.mbMapPane,_3f,_41);
};
this.addFirstListener("addSLD",this.addSLD,this);
this.deleteLayer=function(_42,_43){
var _44=_42.getLayer(_43);
if(!_44){
alert(mbGetMessage("nodeNotFound",_43));
return;
}
_44.parentNode.removeChild(_44);
_42.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_45,_46){
var _47=_45.getLayer(_46);
var _48=_47.selectSingleNode("following-sibling::*");
if(!_48){
alert(mbGetMessage("cantMoveUp",_46));
return;
}
_47.parentNode.insertBefore(_48,_47);
_45.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_49,_4a){
var _4b=_49.getLayer(_4a);
var _4c=_4b.selectNodes("preceding-sibling::*");
var _4d=_4c[_4c.length-1];
if(!_4d){
alert(mbGetMessage("cantMoveDown",_4a));
return;
}
_4b.parentNode.insertBefore(_4b,_4d);
_49.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.loadLayerStart=function(_4e){
layerName=this.model.getParam(_4e.object.id);
this.model.callListeners("loadLayerStart",layerName);
};
this.loadLayerEnd=function(_4f){
layerName=config.objects.mainMap.getParam(_4f.object.id);
this.model.callListeners("loadLayerEnd",layerName);
};
this.setExtension=function(_50){
var _51=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
if(!_51){
var _52=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General");
var _53=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_51=_52.appendChild(_53);
}
return _51.appendChild(_50);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
};
this.setOpacity=function(_54,_55){
var _56=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_54+"']");
if(_56){
_56.setAttribute("opacity",_55);
}
this.callListeners("opacity",_54);
};
this.getOpacity=function(_57){
var _58=1;
var _59=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_57+"']");
if(_59){
_58=_59.getAttribute("opacity");
}
return _58;
};
this.initTimeExtent=function(_5a){
var _5b=_5a.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_5b.length;++i){
var _5d=_5b[i];
_5a.timestampList=createElementWithNS(_5a.doc,"TimestampList",mbNsUrl);
var _5e=_5d.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
_5a.timestampList.setAttribute("layerName",_5e);
var _5f=_5d.firstChild.nodeValue.split(",");
for(var j=0;j<_5f.length;++j){
var _61=_5f[j].split("/");
if(_61.length==3){
var _62=setISODate(_61[0]);
var _63=setISODate(_61[1]);
var _64=_61[2];
var _65=_64.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_65.length;++i){
if(!_65[i]){
_65[i]=0;
}
}
do{
var _66=createElementWithNS(_5a.doc,"Timestamp",mbNsUrl);
_66.appendChild(_5a.doc.createTextNode(getISODate(_62)));
_5a.timestampList.appendChild(_66);
_62.setFullYear(_62.getFullYear()+parseInt(_65[2],10));
_62.setMonth(_62.getMonth()+parseInt(_65[4],10));
_62.setDate(_62.getDate()+parseInt(_65[6],10));
_62.setHours(_62.getHours()+parseInt(_65[8],10));
_62.setMinutes(_62.getMinutes()+parseInt(_65[10],10));
_62.setSeconds(_62.getSeconds()+parseFloat(_65[12]));
}while(_62.getTime()<=_63.getTime());
}else{
var _66=createElementWithNS(_5a.doc,"Timestamp",mbNsUrl);
_66.appendChild(_5a.doc.createTextNode(_5f[j]));
_5a.timestampList.appendChild(_66);
}
}
_5a.setExtension(_5a.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.getCurrentTimestamp=function(_67){
var _68=this.getParam("timestamp");
return this.timestampList.childNodes[_68].firstChild.nodeValue;
};
this.setOpacity=function(_69,_6a){
var _6b=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_69+"']");
if(_6b){
_6b.setAttribute("opacity",_6a);
}
this.callListeners("opacity",_69);
};
this.getOpacity=function(_6c){
var _6d=1;
var _6e=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_6c+"']");
if(_6e){
_6d=_6e.getAttribute("opacity");
}
return _6d;
};
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Transaction(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
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
_e.map.zoomToExtent(new OpenLayers.Bounds(_f[0],_f[1],_f[2],_f[3]));
_e.setBoundingBox(_e.map.getExtent().toBBOX().split(","));
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
function EditSLD(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
var _3=baseDir+"/tool/xsl/wmc_AddSld.xsl";
this.stylesheet=new XslProcessor(_3);
this.checkThis=function(){
if(document.getElementById("textStyle").checked==true){
this.addNodeToSLD("TextSymbolizer");
document.getElementById("textStyle").checked=true;
manageDiv("propertyText",1);
}else{
if(this.model.doc.selectSingleNode("//TextSymbolizer")!=null){
xpath="//FeatureTypeStyle";
node=this.model.doc.selectSingleNode(xpath);
node.removeChild(this.model.doc.selectSingleNode("//TextSymbolizer").parentNode);
this.addNodeToSLD(document.getElementById("choixFeatureType").value+"Symbolizer");
manageDiv("propertyText",0);
}
}
};
this.upadteNode2=function(_4,_5,_6){
var _7="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title='"+_4+"']";
var _8=this.model.doc.selectSingleNode(_7);
var _8=_8.firstChild;
var _9="";
while(_8!=null){
var _a=_8.nodeName;
_8=_8.nextSibling;
switch(_a){
case "LineSymbolizer":
_9=_a;
break;
case "PolygonSymbolizer":
_9=_a;
break;
case "PointSymbolizer":
_9=_a;
break;
case "TextSymbolizer":
_9=_a;
break;
default:
break;
}
}
_7=_7+"/"+_9+"/"+_5;
this.model.setXpathValue(this.model,_7,_6,false);
};
this.updateField=function(_b){
document.getElementById("couleurchoix").value=this.getValuePath(_b,"/Stroke/CssParameter[@name='stroke']");
document.getElementById("couleurchoix2").value=this.getValuePath(_b,"/Fill/CssParameter[@name='fill']");
};
this.LegendTypepics2=function(_c){
switch(_c){
case "80":
document.getElementById("uniqueSymbole").style.display="block";
return;
case "60":
javascript:
config.paintWidget(config.objects.addRule);
return;
default:
document.getElementById("uniqueSymbole").style.display="none";
return;
}
};
this.getValuePath=function(_d,_e){
return this.model.getXpathValue(this.model,_d+_e);
};
this.styleOfStroke=function(_f,_10){
var _11="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title='"+_f+"']";
var _12=this.model.doc.selectSingleNode(_11);
var _12=_12.firstChild;
var _13="";
while(_12!=null){
var _14=_12.nodeName;
_12=_12.nextSibling;
switch(_14){
case "LineSymbolizer":
_13=_14;
break;
case "PolygonSymbolizer":
_13=_14;
break;
case "PointSymbolizer":
_13=_14;
break;
case "TextSymbolizer":
_13=_14;
break;
default:
break;
}
}
_11=_11+"/"+_13+"/Stroke";
if(this.model.doc.selectSingleNode(_11+"/CssParameter[@name='stroke-linejoin']")==null){
this.addNodeWithParam(_11,"CssParameter","stroke-linejoin");
}
switch(_10){
case "mitre":
this.model.setXpathValue(this.model,_11+"/CssParameter[@name='stroke-linejoin']","mitre",false);
return;
case "Stroke":
this.model.setXpathValue(this.model,_11+"/CssParameter[@name='stroke-linejoin']","Stroke",false);
return;
case "bevel":
this.model.setXpathValue(this.model,_11+"/CssParameter[@name='stroke-linejoin']","bevel",false);
return;
default:
return;
}
};
this.mode=function(_15,_16,_17,_18,_19,_1a,_1b,_1c){
var _1d="PolygonSymbolizer";
switch(_1a){
case "1":
this.createNbRule(_15,_16,_17,_18,_19);
break;
case "2":
this.createRule(_18,_1d,_1b);
this.addFilter(_15,_16,_17,_18+i);
break;
case "3":
this.createNbRuleWithColor(_15,_16,_17,_18,_19,_1b,_1c);
break;
default:
break;
}
};
this.DecToHex=function(dec){
return ((hex=dec.toString(16).toUpperCase()).length<2)?"0"+hex:hex;
};
this.HexToDec=function(hex){
return parseInt(hex,16);
};
this.SetColHex=function(_20){
red=this.HexToDec(_20.substr(1,2));
green=this.HexToDec(_20.substr(3,2));
blue=this.HexToDec(_20.substr(5,2));
};
this.calculA=function(_21,_22,_23,_24){
return (_21-_22)/(_23-_24);
};
this.interpolation=function(_25,_26,_27,_28,I){
Rmax=this.HexToDec(_27.substr(1,2));
Rmin=this.HexToDec(_28.substr(1,2));
Gmax=this.HexToDec(_27.substr(3,2));
Gmin=this.HexToDec(_28.substr(3,2));
Bmax=this.HexToDec(_27.substr(5,2));
Bmin=this.HexToDec(_28.substr(5,2));
var a=this.calculA(Rmax,Rmin,_26,_25);
var b=Rmax-(_26*a);
var R=(a*I)+b;
a=this.calculA(Gmax,Gmin,_26,_25);
b=Gmax-(_26*a);
var G=(a*I)+b;
a=this.calculA(Bmax,Bmin,_26,_25);
b=Bmax-(_26*a);
var B=(a*I)+b;
return color="#"+this.DecToHex(parseInt(R,10))+this.DecToHex(parseInt(G,10))+this.DecToHex(parseInt(B,10));
};
this.createNbRuleWithColor=function(_2f,_30,_31,_32,_33,_34,_35){
var _36=(_30-_31)/_33;
var _37="PolygonSymbolizer";
var _38=parseFloat(_31);
for(var i=_31;i<_33;i++){
_38+=_36;
var _3a=this.interpolation(_31,_30,_35,_34,_38);
this.createRule(_32+i,_37,_3a);
this.addFilter(_2f,_38,_31,_32+i);
_31=_38;
}
};
this.createNbRule=function(_3b,_3c,_3d,_3e,_3f){
var _40=(_3c-_3d)/_3f;
var _41="PolygonSymbolizer";
var _42=parseFloat(_3d);
for(var i=_3d;i<_3f;i++){
_42+=_40;
this.createRule(_3e+i,_41,"#CCFF00");
this.addFilter(_3b,_42,_3d,_3e+i);
_3d=_42;
}
};
this.TextSymbolizer=function(_44,_45,_46,_47,_48){
var _49="/TextSymbolizer";
var _4a="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle";
var _4b=this.targetModel.doc.createElement("Rule");
var _4c=this.targetModel.doc.createElement("Title");
if(_4c.firstChild){
_4c.firstChild.nodeValue=titlerule;
}else{
dom=Sarissa.getDomDocument();
v=dom.createTextNode(titlerule);
_4c.appendChild(v);
}
_4b.appendChild(_4c);
var _4d=this.model.doc.selectSingleNode(_4a);
_4d.appendChild(_4b);
var _4e=_4a+"/Rule[Title='"+titlerule+"']";
this.addNode(_4e,_49);
_4e=_4e+"/"+_49;
this.addNode(_4e,"Geometry");
this.addNodeWithDS(_4e+"Geometry","PropertyName");
this.model.setXpathValue(this.model,_4e+"/Geometry/ogc:PropertyName",_47,false);
this.addNode(_4e,"Label");
this.addNodeWithDS(_4e+"Label","PropertyName");
this.model.setXpathValue(this.model,_4e+"/Geometry/ogc:PropertyName",_48,false);
this.addNode(_4e,"Font");
this.addNodeWithParam(_4e+"/Font","CssParameter","font-family");
this.model.setXpathValue(this.model,_4e+"/Fill/CssParameter[@name='font-family']","arial",false);
this.addNodeWithParam(_4e+"/Font","CssParameter","font-family");
this.model.setXpathValue(this.model,_4e+"/Fill/CssParameter[@name='font-family']","Sans-Serif",false);
this.addNodeWithParam(_4e+"/Font","CssParameter","font-style");
this.model.setXpathValue(this.model,_4e+"/Fill/CssParameter[@name='font-style']","arial",false);
this.addNodeWithParam(_4e+"/Font","CssParameter","font-size");
this.model.setXpathValue(this.model,_4e+"/Fill/CssParameter[@name='font-size']","arial",false);
this.addNode(_4e,"Fill");
this.addNodeWithParam(_4e+"/Fill","CssParameter","fill");
this.model.setXpathValue(this.model,_4e+"/Fill/CssParameter[@name='fill']",_45,false);
};
this.graphicSymbol=function(_4f,_50,_51,_52){
var _53="/PointSymbolizer";
var _54="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle";
var _55=this.targetModel.doc.createElement("Rule");
var _56=this.targetModel.doc.createElement("Title");
if(_56.firstChild){
_56.firstChild.nodeValue=titlerule;
}else{
dom=Sarissa.getDomDocument();
v=dom.createTextNode(titlerule);
_56.appendChild(v);
}
_55.appendChild(_56);
var _57=this.model.doc.selectSingleNode(_54);
_57.appendChild(_55);
var _58=_54+"/Rule[Title='"+titlerule+"']";
this.addNode(_58,_53);
_58=_58+"/"+_53;
this.addNode(_58,"Geometry");
this.addNodeWithDS(_58+"Geometry","PropertyName");
this.model.setXpathValue(this.model,_58+"/Geometry/ogc:PropertyName",_52,false);
this.addNode(_58,"Graphic");
this.addNode(_58+"/Graphic","Mark");
this.addNode(_58+"/Graphic","Size");
this.model.setXpathValue(this.model,_58+"/Graphic/Size",_4f,false);
_58=_58+"/Graphic/Mark";
this.addNode(_58,"WellKnownName");
this.model.setXpathValue(this.model,_58+"WellKnownName",_51,false);
this.addNode(_58,"Fill");
this.addNodeWithParam(_58+"/Fill","CssParameter","fill");
this.model.setXpathValue(this.model,_58+"/Fill/CssParameter[@name='fill']",_50,false);
};
this.addNode=function(_59,_5a){
var _5b=this.model.doc.selectSingleNode(_59);
var _5c=this.targetModel.doc.createElement(_5a);
return _5b.appendChild(_5c);
};
this.addNodeWithDS=function(_5d,_5e){
var _5f=this.model.doc.selectSingleNode(_5d);
var _60=createElementWithNS(this.targetModel.doc,_5e,"http://www.opengis.net/ogc");
return _5f.appendChild(_60);
};
this.addNodeWithParam=function(_61,_62,_63){
var _64=this.model.doc.selectSingleNode(_61);
var _65=this.targetModel.doc.createElement(_62);
_65.setAttribute("name",_63);
return _64.appendChild(_65);
};
this.createRule=function(_66,_67,_68){
var _69="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle";
var _6a=this.targetModel.doc.createElement("Rule");
var _6b=this.targetModel.doc.createElement("Title");
if(_6b.firstChild){
_6b.firstChild.nodeValue=_66;
}else{
dom=Sarissa.getDomDocument();
v=dom.createTextNode(_66);
_6b.appendChild(v);
}
_6a.appendChild(_6b);
var _6c=this.model.doc.selectSingleNode(_69);
_6c.appendChild(_6a);
var _6d=_69+"/Rule[Title='"+_66+"']";
this.addNode(_6d,_67);
_6d=_6d+"/"+_67;
if(_67=="PolygonSymbolizer"){
this.addNode(_6d,"Fill");
this.addNodeWithParam(_6d+"/Fill","CssParameter","fill");
this.model.setXpathValue(this.model,_6d+"/Fill/CssParameter",_68,false);
}
this.addNode(_6d,"Stroke");
this.addNodeWithParam(_6d+"/Stroke","CssParameter","stroke-width");
this.addNodeWithParam(_6d+"/Stroke","CssParameter","stroke");
this.model.setXpathValue(this.model,_6d+"/Stroke/CssParameter[@name='stroke-width']","1",false);
this.model.setXpathValue(this.model,_6d+"/Stroke/CssParameter[@name='stroke']",_68,false);
};
this.deleteAllRules=function(){
var _6e="/StyledLayerDescriptor/NamedLayer/UserStyle";
if(this.model.doc.selectSingleNode(_6e+"/FeatureTypeStyle")!=null){
var _6f=this.model.doc.selectSingleNode(_6e);
var _70=this.model.doc.selectSingleNode(_6e+"/FeatureTypeStyle");
_6f.removeChild(_70);
this.addNode(_6e,"FeatureTypeStyle");
}
};
this.deleteOneRule=function(_71){
var _72="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/";
var _73="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title='"+_71+"']";
if(this.model.doc.selectSingleNode(_73)!=null){
var _74=this.model.doc.selectSingleNode(_72);
var _75=this.model.doc.selectSingleNode(_73);
_74.removeChild(_75);
}
};
this.addFilter=function(_76,up,low,_79){
var _7a="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title='"+_79+"']";
this.addNodeWithDS(_7a,"Filter");
var _7b=_7a+"/ogc:Filter";
this.addNodeWithDS(_7b,"PropertyIsBetween");
this.addNodeWithDS(_7a+"/ogc:Filter/ogc:PropertyIsBetween","PropertyName");
this.model.setXpathValue(this.model,_7a+"/ogc:Filter/ogc:PropertyIsBetween/ogc:PropertyName",_76,false);
this.addNodeWithDS(_7a+"/ogc:Filter/ogc:PropertyIsBetween","LowerBoundary");
this.addNodeWithDS(_7a+"/ogc:Filter/ogc:PropertyIsBetween/ogc:LowerBoundary","Literal");
this.addNodeWithDS(_7a+"/ogc:Filter/ogc:PropertyIsBetween","UpperBoundary");
this.addNodeWithDS(_7a+"/ogc:Filter/ogc:PropertyIsBetween/ogc:UpperBoundary","Literal");
this.model.setXpathValue(this.model,_7a+"/ogc:Filter/ogc:PropertyIsBetween/ogc:LowerBoundary/ogc:Literal",low,false);
this.model.setXpathValue(this.model,_7a+"/ogc:Filter/ogc:PropertyIsBetween/ogc:UpperBoundary/ogc:Literal",up,false);
};
this.updateNode=function(_7c,_7d){
if(_7c=="//MinScaleDenominator2"){
node=this.model.doc.selectNodes("//MinScaleDenominator");
node[1].firstChild.nodeValue=_7d;
}else{
if(_7c=="//MaxScaleDenominator2"){
node2=this.model.doc.selectNodes("//MaxScaleDenominator");
node2[1].firstChild.nodeValue=_7d;
}else{
if((this.model.doc.selectSingleNode(_7c)!=null)&&(_7d)){
this.model.setXpathValue(this.model,_7c,_7d,false);
}
}
}
};
this.insertSldToWmc=function(_7e){
if(_7e){
var _7f=this.model.getSldNode();
var _80=this.stylesheet.transformNodeToObject(_7f);
Sarissa.setXpathNamespaces(_80,this.targetModel.namespace);
mbDebugMessage(this,_80.xml);
legendURLNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_7e+"']/wmc:StyleList/wmc:Style/wmc:LegendURL");
layerNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_7e+"']");
styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_7e+"']/wmc:StyleList");
if(styleNode){
layerNode.removeChild(styleNode);
}
this.targetModel.setParam("addSLD",_80.documentElement);
if(legendURLNode){
styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_7e+"']/wmc:StyleList/wmc:Style");
styleNode.appendChild(legendURLNode);
}
}else{
alert(mbGetMessage("selectLayer"));
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
this.model.addListener("bbox",this.reset,this);
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
this.stopListener=function(_12){
_12.stop();
};
this.model.addListener("stopLoop",this.stopListener,this);
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
var _9=new PT(ul[0],ul[1]);
var _a=new PT(lr[0],lr[1]);
cs_transform(_5.targetModel.proj,_5.model.proj,_9);
cs_transform(_5.targetModel.proj,_5.model.proj,_a);
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
}
ZoomToAoi.prototype.mouseUpHandler=function(e){
var _d=this.model.getParam("aoi");
var ul=_d[0];
var lr=_d[1];
if(this.model.getSRS()!=this.targetModel.getSRS()){
var _10=new PT(ul[0],ul[1]);
var _11=new PT(lr[0],lr[1]);
cs_transform(this.model.proj,this.targetModel.proj,_10);
cs_transform(this.model.proj,this.targetModel.proj,_11);
ul=new Array(_10.x,_10.y);
lr=new Array(_11.x,_11.y);
}
if((ul[0]==lr[0])&&(ul[1]==lr[1])){
this.targetModel.map.setCenter(new OpenLayers.LonLat(ul[0],ul[1]));
}else{
this.targetModel.map.zoomToExtent(new OpenLayers.Bounds(ul[0],lr[1],lr[0],ul[1]));
}
};

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
}
};
WebServiceRequest.prototype.mapInit=function(_15){
_15.containerModel.map.events.registerPriority("mouseup",_15,_15.setClickPosition);
};
WebServiceRequest.prototype.setClickPosition=function(e){
this.requestStylesheet.setParameter("xCoord",e.xy.x);
this.requestStylesheet.setParameter("yCoord",e.xy.y);
};
WebServiceRequest.prototype.selectFeature=function(_17,_18){
_17.requestStylesheet.setParameter("queryLayer",_18);
};

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
this.contextInit=function(_4){
_4.model.addListener("gmlRendererLayer",_4.init,_4);
if(_4.targetModel.map&&_4.model.getParam("gmlRendererLayer")&&!_4.control){
_4.init(_4);
}
};
this.init=function(_5){
var _6;
if(_5.model.mergeModels){
_5.sourceModels=_5.model.mergeModels;
}else{
_5.sourceModels.push(_5.model);
}
for(var i in _5.sourceModels){
_5.sourceModels[i].addListener("highlightFeature",_5.highlight,_5);
_5.sourceModels[i].addListener("dehighlightFeature",_5.dehighlight,_5);
}
var _8=_5.model.getParam("gmlRendererLayer");
if(_5.map==_5.targetModel.map&&_5.control&&!_8){
_5.control.deactivate();
_5.control.destroy();
_5.control=null;
}else{
if(_8){
_5.control=new OpenLayers.Control.SelectFeature(_8,{hover:true,onSelect:_5.onSelect,onUnselect:_5.onUnselect,mbFeatureSelectHandler:_5,select:function(_9){
if(_9.mbSelectStyle){
this.selectStyle=_9.mbSelectStyle;
}
OpenLayers.Control.SelectFeature.prototype.select.apply(this,arguments);
}});
_5.map=_5.targetModel.map;
_5.map.addControl(_5.control);
_5.control.activate();
}
}
};
this.onSelect=function(_a){
if(!_a){
return;
}
var _b=this.mbFeatureSelectHandler;
for(var i in _b.sourceModels){
_b.sourceModels[i].setParam("mouseoverFeature",_a.fid);
}
_a.mbFeatureSelectHandler=_b;
if(_a.layer.events&&!_a.mbNoMouseEvent){
_a.layer.events.registerPriority("mousedown",_a,_b.onClick);
_a.layer.events.registerPriority("mousemove",_a,_b.onHover);
}else{
_a.mbNoMouseEvent=null;
}
};
this.onUnselect=function(_d){
if(!_d){
return;
}
var _e=this.mbFeatureSelectHandler;
for(var i in _e.sourceModels){
_e.sourceModels[i].setParam("mouseoutFeature",_d.fid);
}
_e.model.setParam("olFeatureOut",_d);
if(_d.layer.events){
_d.layer.events.unregister("mousedown",_d,_e.onClick);
}
mydiv=document.getElementById(_d.fid);
mydiv.style.backgroundColor="";
};
this.onClick=function(evt){
evt.feature=this;
var _11=this.mbFeatureSelectHandler;
_11.model.setParam("olFeatureSelect",evt);
OpenLayers.Event.stop(evt);
};
this.onHover=function(evt){
evt.feature=this;
var _13=this.mbFeatureSelectHandler;
if(evt.feature.layer.events){
evt.feature.layer.events.unregister("mousemove",evt.feature,_13.onHover);
}
_13.model.setParam("olFeatureHover",evt);
mydiv=document.getElementById(evt.feature.fid);
mydiv.style.backgroundColor="orange";
};
this.highlight=function(_14,fid){
var _16,feature;
var _17=_14.model.getParam("gmlRendererLayer");
for(var i in _14.sourceModels){
_16=_14.sourceModels[i];
if(!_17){
return;
}
if(!fid){
fid=_16.getParam("highlightFeature");
}
feature=_17.getFeatureByFid(fid);
if(feature&&!feature.mbHidden){
feature.mbNoMouseEvent=true;
_14.control.select(feature);
}
}
};
this.dehighlight=function(_19,fid){
var _1b,feature;
var _1c=_19.model.getParam("gmlRendererLayer");
for(var i in _19.sourceModels){
_1b=_19.sourceModels[i];
if(!_1c){
return;
}
if(!fid){
fid=_19.model.getParam("dehighlightFeature");
}
feature=_1c.getFeatureByFid(fid);
if(feature&&!feature.mbHidden){
_19.control.unselect(feature);
}
}
};
}

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

