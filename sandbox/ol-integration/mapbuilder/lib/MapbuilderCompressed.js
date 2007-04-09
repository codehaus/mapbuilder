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
this.loadScript(baseDir+"/util/sarissa/sarissa.js");
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
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
if(!document.getElementById("controlPanelCss")){
var _a=document.createElement("link");
_a.setAttribute("id","controlPanelCss");
_a.setAttribute("rel","stylesheet");
_a.setAttribute("type","text/css");
_a.setAttribute("href",config.skinDir+"/controlPanel.css");
document.getElementsByTagName("head")[0].appendChild(_a);
}
WidgetBase.apply(this,new Array(_1,_2));
this.buttonType=_1.selectSingleNode("mb:class").firstChild.nodeValue;
if(this.buttonType=="RadioButton"){
this.enabled=false;
}
var _b=_1.selectSingleNode("mb:disabledSrc");
if(_b){
this.disabledImage=document.createElement("IMG");
this.disabledImage.src=config.skinDir+_b.firstChild.nodeValue;
}
var _c=_1.selectSingleNode("mb:enabledSrc");
if(_c){
this.enabledImage=document.createElement("IMG");
this.enabledImage.src=config.skinDir+_c.firstChild.nodeValue;
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
this.getCursorClass=function(_13){
return "mbCursor_"+_13.cursor.replace(/[^A-Z^a-z]*/g,"");
};
this.control=null;
this.doAction=function(){
};
this.select=function(){
var a=document.getElementById("mainMapContainer");
if(a!=null){
a.style.cursor=this.cursor;
}
};
this.doSelect=function(_15,_16){
};
this.attachToOL=function(_17){
if(!_17.createControl){
return;
}
_17.control=_17.createControl(_17);
var map=_17.targetModel.map;
var _19=_17.targetModel.buttonBars[_17.htmlTagId];
if(!_19||_19.map==null){
_19=new OpenLayers.Control.Panel({div:$(_17.panelHtmlTagId),defaultControl:null});
_17.targetModel.buttonBars[_17.htmlTagId]=_19;
map.addControl(_19);
}
_19.addControls(_17.control);
_17.control.panel_div.title=_17.tooltip;
if(_17.selected==true){
_17.control.activate();
}
_17.mapPaneDiv=document.getElementById(_17.targetModel.map.div.id);
if(_17.control.type!=OpenLayers.Control.TYPE_BUTTON){
_17.control.panel_div.onclick=function(){
_17.mapPaneDiv.className=_17.mapPaneDiv.className.replace(/mbCursor_[a-zA-Z0-9]*/,_17.getCursorClass(_17));
};
}
if(_17.selected==true||_17.mapPaneDiv.className.indexOf("mbCursor")==-1){
_17.mapPaneDiv.className+=" "+_17.getCursorClass(_17);
}
if(_17.buttonType=="RadioButton"){
var _1a=addCSSRule(_17.getButtonClass(_17,"Active"));
_1a.style.backgroundImage="url(\""+_17.enabledImage.src+"\")";
}
var _1b=addCSSRule(_17.getButtonClass(_17,"Inactive"));
_1b.style.backgroundImage="url(\""+_17.disabledImage.src+"\")";
var _1c=addCSSRule("."+_17.getCursorClass(_17));
_1c.style.cursor=_17.cursor;
};
this.buttonInit=function(_1d){
if(!_1d.targetModel.buttonBars){
_1d.targetModel.buttonBars=new Array();
}
_1d.targetModel.addListener("refresh",_1d.attachToOL,_1d);
};
this.model.addListener("init",this.buttonInit,this);
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
alert(mbGetMessage("invalidFeatureXpathEditLine",_3.featureXpath));
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function ModelStatus(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.prePaint=function(_3){
_3.stylesheet.setParameter("statusMessage",_3.targetModel.getParam("modelStatus"));
};
this.model.addListener("modelStatus",this.paint,this);
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
var _6=_1.selectSingleNode("mb:stylesheet");
if(_6!=undefined){
var _7=_6.firstChild.nodeValue;
this.stylesheet=new XSLTProcessor();
var _8=Sarissa.getDomDocument();
_8.async=false;
_8.load(_7);
this.stylesheet.importStylesheet(_8);
}
this.createDiv=function(){
var _9="overDiv";
var _a=document.getElementById(_9);
if(_a==undefined){
var _b=document.getElementById(this.tipIdName);
if(_b!=undefined){
_a=document.createElement("div");
_a.setAttribute("id",_9);
_a.setAttribute("style","");
_a.style.zIndex="10000";
_a.style.visibility="hidden";
var _c=_b.parentNode;
_c.removeChild(_b);
_c.appendChild(_a);
this.tipDiv=_a;
}else{
alert(mbGetMessage("divNotFound",this.tipIdName));
}
}else{
alert(mbGetMessage("divAlreadyExists",_9));
}
};
this.paint=function(_d){
var _e=parseInt(this.leftOffset);
var _f=parseInt(this.topOffset);
var x=parseInt(_d[0]);
if(x>_e){
x+=_e;
}
var y=parseInt(_d[1]);
if(y>_f){
y+=_f;
}
var id=_d[2];
var _13=_d[3];
var _14=this.dehtmlize(_d[4]);
var _15="<b>"+_13+"</b><hr/><br/>"+_14;
overlib(_15,CAPTION,"Caption",STICKY,WIDTH,"225",HEIGHT,"200",REFC,"UR",REFP,"LL",RELX,x,RELY,y);
};
this.dehtmlize=function(str){
str=str.replace(/&amp;/g,"&");
str=str.replace(/&lt;/g,"<");
str=str.replace(/&gt;/g,">");
str=str.replace(/&quot;/g,"'");
return str;
};
this.paintXSL=function(_17){
if(this.stylesheet){
var _18=0;
var _19=0;
var cn=window.cursorTrackNode;
if(cn){
var _1b=cn.evpl;
if(_1b!=null){
_18=_1b[0];
_19=_1b[1];
}
}
var _1c=document.implementation.createDocument("","",null);
_1c.appendChild(_17.cloneNode(true));
var _1d=this.stylesheet.transformToDocument(_1c);
var _1e=Sarissa.serialize(_1d.firstChild);
overlib(_1e,CAPTION,"Caption",STICKY,WIDTH,"225",HEIGHT,"200",REFC,"UR",REFP,"LL",RELX,_18,RELY,_19);
}else{
alert(mbGetMessage("noStylesheetDefined"));
}
};
this.clear=function(){
nd();
};
toolTipObjs[this.tipIdName]=this;
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function FeatureList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5,_6){
_3.model.setXpathValue(_3.model,_4,_5,_6);
};
}

mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlRendererTest(_1,_2){
this.paint=function(_3){
var _4=_3.model.doc.selectNodes("//gml:featureMember");
alert(mbGetMessage("pretendPaint",_4.length,Sarissa.serialize(_3.model.doc)));
};
var _5=new MapContainerBase(this,_1,_2);
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Widget(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
mbDebugMessage(this,"Transformed: "+Sarissa.serialize(_8));
}
this.namespace="xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
Sarissa.setXpathNamespaces(_8,this.namespace);
var _9=_8.selectSingleNode("//wfs:GetFeature");
_5.postData=Sarissa.serialize(_9);
mbDebugMessage(this,"httpPayload.postData:"+_5.postData);
this.targetModel.wfsFeature=_8.childNodes[0];
if(this.debug){
mbDebugMessage(this,"wfsFeature = "+Sarissa.serialize(this.targetModel.wfsFeature));
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
if(_10.targetModel.containerModel){
var _12=null;
var _13=_10.model.getSRS();
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Timestamp(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.updateTimestamp=function(_3,_4){
var _5=document.getElementById("timestampValue");
_5.value=_3.model.timestampList.childNodes[_4].firstChild.nodeValue;
};
this.model.addListener("timestamp",this.updateTimestamp,this);
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
mbDebugMessage(_4,"prepaint:"+Sarissa.serialize(_4.resultDoc));
}
if(_4.debug){
mbDebugMessage(_4,"stylesheet:"+Sarissa.serialize(_4.stylesheet.xslDom));
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
_4.stylesheet.setParameter("objRef","objRef");
jsNode=_4.stylesheet.transformNodeToObject(_4.resultDoc);
js=jsNode.selectSingleNode("js").firstChild.nodeValue;
mbDebugMessage(_4,"javascript eval:"+js);
_4.model.setParam("modelStatus",mbGetMessage("rendering"));
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
_a.model.setParam("modelStatus",mbGetMessage("preparingCoords"));
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function LegendGraphic(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.model.addListener("hidden",this.refresh,this);
}
LegendGraphic.prototype.refresh=function(_3,_4){
_3.paint(_3,_3.id);
};

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function CollectionList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function LayerProperty(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function DragPan(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(){
return new OpenLayers.Control.DragPan();
};
this.cursor="move";
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectFeatureType(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
_4.style.left=0;
_4.style.top=0;
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
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function ZoomIn(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
this.createControl=function(){
return new OpenLayers.Control.ZoomBox();
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
alert(mbGetMessage("layerNotFound",_6));
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
alert(mbGetMessage("layerNotFound",_f));
}
};
this.model.addListener("timestamp",this.timestampListener,this);
this.bboxListener=function(_11,_12){
_11.paint(_11,_11.id);
};
this.model.addListener("bbox",this.bboxListener,this);
this.prePaint=function(_13){
var _14="";
var _15=_13.model.timestampList;
if(_15){
for(var i=_13.model.getParam("firstFrame");i<=_13.model.getParam("lastFrame");++i){
_14+=_15.childNodes[i].firstChild.nodeValue+",";
}
_13.stylesheet.setParameter("timeList",_14.substring(0,_14.length-1));
}
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function OpenLSResponse(_1,_2){
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function FeatureList(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5);
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectMapLayers(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
alert(mbGetMessage("noFeatureToInsert"));
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

mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
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
this.mouseOverHandler=function(_a,_b){
_a.coordForm=document.getElementById(_a.formName);
window.cursorTrackObject=_a;
window.cursorTrackNode=_b;
_a.mouseOver=true;
_a.mouseTrackTimer=setInterval(ReportCoords,100,_a);
};
this.mouseOutHandler=function(_c,_d){
if(_c.mouseTrackTimer){
clearInterval(_c.mouseTrackTimer);
}
_c.mouseOver=false;
if(_c.showLatLong){
if(_c.coordForm.longitude){
_c.coordForm.longitude.value="";
}
if(_c.coordForm.latitude){
_c.coordForm.latitude.value="";
}
}
if(_c.showDMS){
if(_c.coordForm.longdeg){
_c.coordForm.longdeg.value="";
}
if(_c.coordForm.longmin){
_c.coordForm.longmin.value="";
}
if(_c.coordForm.longsec){
_c.coordForm.longsec.value="";
}
if(_c.coordForm.longH){
_c.coordForm.longH.value="";
}
if(_c.coordForm.latdeg){
_c.coordForm.latdeg.value="";
}
if(_c.coordForm.latmin){
_c.coordForm.latmin.value="";
}
if(_c.coordForm.latsec){
_c.coordForm.latsec.value="";
}
if(_c.coordForm.latH){
_c.coordForm.latH.value="";
}
}
if(_c.showDM){
if(_c.coordForm.longDMdeg){
_c.coordForm.longDMdeg.value="";
}
if(_c.coordForm.longDMmin){
_c.coordForm.longDMmin.value="";
}
if(_c.coordForm.longDMH){
_c.coordForm.longDMH.value="";
}
if(_c.coordForm.latDMdeg){
_c.coordForm.latDMdeg.value="";
}
if(_c.coordForm.latDMmin){
_c.coordForm.latDMmin.value="";
}
if(_c.coordForm.latDMH){
_c.coordForm.latDMH.value="";
}
}
if(_c.showXY){
if(_c.coordForm.x){
_c.coordForm.x.value="";
}
if(_c.coordForm.y){
_c.coordForm.y.value="";
}
}
if(_c.showPx){
if(_c.coordForm.px){
_c.coordForm.px.value="";
}
if(_c.coordForm.py){
_c.coordForm.py.value="";
}
}
if(_c.showMGRS){
if(_c.coordForm.mgrs){
_c.coordForm.mgrs.value="";
}
}
};
this.init=function(_e){
var _f=_1.selectSingleNode("mb:mouseHandler");
if(_f){
_e.mouseHandler=window.config.objects[_f.firstChild.nodeValue];
_e.mouseHandler.addListener("mouseover",_e.mouseOverHandler,_e);
_e.mouseHandler.addListener("mouseout",_e.mouseOutHandler,_e);
_e.model.map.events.register("mousemove",_e,_e.redraw);
}else{
alert(mbGetMessage("noMouseHandlerCursorTrack"));
}
if(_e.showLatLong||_e.showDMS||_e.showDM||_e.showMGRS){
_e.proj=new Proj(_e.model.getSRS());
}
if(this.showMGRS){
this.MGRS=new MGRS();
}
};
this.model.addListener("loadModel",this.init,this);
this.formName="CursorTrackForm_"+mbIds.getId();
this.stylesheet.setParameter("formName",this.formName);
this.redraw=function(evt){
if(evt==null){
this.lastXy=new OpenLayers.Pixel(0,0);
}else{
this.lastXy=evt.xy;
}
};
}
function convertDMS(_11,_12){
var _13=new Array();
abscoordinate=Math.abs(_11);
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
_13[0]=coordinatedegrees;
_13[1]=coordinateminutes;
_13[2]=coordinateseconds;
_13[3]=getHemi(_11,_12);
return _13;
}
function convertDM(_14,_15){
var _16=new Array();
abscoordinate=Math.abs(_14);
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
_16[0]=coordinatedegrees;
_16[1]=coordinateminutes;
_16[2]=getHemi(_14,_15);
return _16;
}
function getHemi(_17,_18){
var _19="";
if(_18=="LAT"){
if(_17>=0){
_19="N";
}else{
_19="S";
}
}else{
if(_18=="LON"){
if(_17>=0){
_19="E";
}else{
_19="W";
}
}
}
return _19;
}
function ReportCoords(){
var _1a=window.cursorTrackObject;
if(_1a.mouseOver){
if(_1a.showPx){
if(_1a.coordForm.px){
_1a.coordForm.px.value=_1a.lastXy.x;
}
if(_1a.coordForm.py){
_1a.coordForm.py.value=_1a.lastXy.y;
}
}
var _1b=_1a.model.map.getLonLatFromPixel(_1a.lastXy);
var _1c=_1a.proj.Forward([_1b.lon,_1b.lat]);
if(_1a.showXY){
if(_1a.coordForm.x){
_1a.coordForm.x.value=_1c[0].toFixed(_1a.precision);
}
if(_1a.coordForm.y){
_1a.coordForm.y.value=_1c[1].toFixed(_1a.precision);
}
}
if(_1a.showLatLong||_1a.showDMS||_1a.showDM||_1a.showMGRS){
if(_1a.showLatLong){
if(_1a.coordForm.longitude){
_1a.coordForm.longitude.value=_1b.lon.toFixed(_1a.precision);
}
if(_1a.coordForm.latitude){
_1a.coordForm.latitude.value=_1b.lat.toFixed(_1a.precision);
}
}
if(_1a.showDMS){
var _1d=convertDMS(_1b.lon,"LON");
if(_1a.coordForm.longdeg){
_1a.coordForm.longdeg.value=_1d[0];
}
if(_1a.coordForm.longmin){
_1a.coordForm.longmin.value=_1d[1];
}
if(_1a.coordForm.longsec){
_1a.coordForm.longsec.value=_1d[2];
}
if(_1a.coordForm.longH){
_1a.coordForm.longH.value=_1d[3];
}
var _1e=convertDMS(_1b.lat,"LAT");
if(_1a.coordForm.latdeg){
_1a.coordForm.latdeg.value=_1e[0];
}
if(_1a.coordForm.latmin){
_1a.coordForm.latmin.value=_1e[1];
}
if(_1a.coordForm.latsec){
_1a.coordForm.latsec.value=_1e[2];
}
if(_1a.coordForm.latH){
_1a.coordForm.latH.value=_1e[3];
}
}
if(_1a.showDM){
var _1d=convertDM(_1b.lon,"LON");
if(_1a.coordForm.longDMdeg){
_1a.coordForm.longDMdeg.value=_1d[0];
}
if(_1a.coordForm.longDMmin){
_1a.coordForm.longDMmin.value=_1d[1];
}
if(_1a.coordForm.longDMH){
_1a.coordForm.longDMH.value=_1d[2];
}
var _1e=convertDM(_1b.lat,"LAT");
if(_1a.coordForm.latDMdeg){
_1a.coordForm.latDMdeg.value=_1e[0];
}
if(_1a.coordForm.latDMmin){
_1a.coordForm.latDMmin.value=_1e[1];
}
if(_1a.coordForm.latDMH){
_1a.coordForm.latDMH.value=_1e[2];
}
}
if(_1a.showMGRS){
if(!_1a.MGRS){
_1a.MGRS=new MGRS();
}
_1a.coordForm.mgrs.value=_1a.MGRS.convert(_1b.lat,_1b.lon);
}
}
}
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function MapPane(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:noPreload");
if(_3){
this.doNotPreload=_1.selectSingleNode("mb:noPreload").firstChild.nodeValue;
}else{
this.doNotPreload=false;
}
if(!this.stylesheet){
var _4=_1.selectSingleNode("mb:stylesheet");
if(_4){
this.stylesheet=new XslProcessor(_4.firstChild.nodeValue,_2.namespace);
}else{
this.stylesheet=new XslProcessor(baseDir+"/widget/"+_1.nodeName+".xsl",_2.namespace);
}
}
var _5=_1.selectSingleNode("mb:loadingSrc");
if(_5){
this.loadingSrc=config.skinDir+_5.firstChild.nodeValue;
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
this.hiddenListener=function(_7,_8){
var _9="visible";
if(_7.model.getHidden(_8)=="1"){
_9="hidden";
}
var _a=_7.model.id+"_"+_7.id+"_"+_8;
var _b=document.getElementById(_a);
if(_b){
_b.style.visibility=_9;
imgId="real"+_b.imgId;
domImg=document.getElementById(imgId);
if(domImg){
if(domImg.isLoading){
domImg.style.visibility=_9;
}else{
if(_9=="visible"){
MapImgLoad(_7,_b);
}else{
domImg.style.visibility=_9;
}
}
}
}
};
this.model.addListener("hidden",this.hiddenListener,this);
this.opacityListener=function(_c,_d){
var _e="1";
_e=_c.model.getOpacity(_d);
var _f=_c.model.id+"_"+_c.id+"_"+_d;
var _10=document.getElementById(_f);
if(_10){
if(_SARISSA_IS_IE){
var _11="alpha(opacity="+100*_e+")";
for(var i=0;i<_10.childNodes.length;i++){
var _13=_10.childNodes[i].style.filter;
if(_13.indexOf("alpha",0)!=-1){
_10.childNodes[i].style.filter=_13.substring(0,_13.indexOf("alpha",0))+_11;
}
}
}else{
_10.style.opacity=_e;
}
}
};
this.model.addListener("opacity",this.opacityListener,this);
this.refreshWmsLayers=function(_14){
_14.d=new Date();
_14.stylesheet.setParameter("uniqueId",_14.d.getTime());
_14.paint(_14);
};
this.model.addListener("refreshWmsLayers",this.refreshWmsLayers,this);
this.model.addListener("refresh",this.paint,this);
this.model.addListener("addLayer",this.addLayer,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("moveLayerUp",this.moveLayerUp,this);
this.model.addListener("moveLayerDown",this.moveLayerDown,this);
this.model.addListener("timestamp",this.timestampListener,this);
}
MapPane.prototype.paint=function(_15){
if(_15.model.doc&&_15.node){
_15.stylesheet.setParameter("width",_15.model.getWindowWidth());
_15.stylesheet.setParameter("height",_15.model.getWindowHeight());
_15.stylesheet.setParameter("bbox",_15.model.getBoundingBox().join(","));
_15.stylesheet.setParameter("srs",_15.model.getSRS());
if(_15.debug){
mbDebugMessage(_15,"painting:"+Sarissa.serialize(_15.model.doc));
}
if(_15.debug){
mbDebugMessage(_15,"stylesheet:"+Sarissa.serialize(_15.stylesheet.xslDom));
}
var _16=_15.stylesheet.transformNodeToObject(_15.model.doc);
var _17=_16.selectNodes("//img");
if(_15.debug){
var s=_15.stylesheet.transformNodeToString(_15.model.doc);
mbDebugMessage(_15,"painting:"+_15.id+":"+s);
if(config.serializeUrl){
postLoad(config.serializeUrl,s);
}
}
var _19=document.getElementById(_15.outputNodeId);
if(!_19){
_19=document.createElement("div");
_19.setAttribute("id",_15.outputNodeId);
_19.style.position="absolute";
_15.node.appendChild(_19);
_19.style.left="0px";
_19.style.top="0px";
}
var _1a=_15.model.getAllLayers();
var _1b=new Array();
var _1c=new Array();
for(var i=0;i<_1a.length;i++){
if(_1a[i].getAttribute("hidden")==1){
_1c.push(i);
}else{
_1b.push(i);
}
}
var _1e=_1b.concat(_1c);
if(!_15.imageStack){
_15.imageStack=new Array(_1a.length);
}
_15.firstImageLoaded=false;
_15.layerCount=_1a.length;
_15.loadingLayerCount=0;
for(var i=0;i<_1a.length;i++){
var j=_1e[i];
if(!_15.imageStack[j]){
_15.imageStack[j]=new Image();
_15.imageStack[j].objRef=_15;
}
var _20=_17[j].getAttribute("src");
_15.loadImgDiv(_1a[j],_20,_15.imageStack[j],i);
}
}
};
MapPane.prototype.getLayerDivId=function(_21){
return this.model.id+"_"+this.id+"_"+_21;
if(this.model.timestampList&&this.model.timestampList.getAttribute("layerName")==_21){
var _22=this.model.getParam("timestamp");
var _23=this.model.timestampList.childNodes[_22];
layerId+="_"+_23.firstChild.nodeValue;
}
};
MapPane.prototype.timestampListener=function(_24,_25){
var _26=_24.model.timestampList.getAttribute("layerName");
var _27=_24.model.timestampList.childNodes[_25];
var vis=(_27.getAttribute("current")=="1")?"visible":"hidden";
var _29=_24.model.id+"_"+_24.id+"_"+_26+"_"+_27.firstChild.nodeValue;
var _2a=document.getElementById(_29);
if(_2a){
_2a.style.visibility=vis;
}else{
alert(mbGetMessage("layerNotFound",_29));
}
};
MapPane.prototype.addLayer=function(_2b,_2c){
_2b.stylesheet.setParameter("width",_2b.model.getWindowWidth());
_2b.stylesheet.setParameter("height",_2b.model.getWindowHeight());
_2b.stylesheet.setParameter("bbox",_2b.model.getBoundingBox().join(","));
_2b.stylesheet.setParameter("srs",_2b.model.getSRS());
var s=_2b.stylesheet.transformNodeToString(_2c);
var _2e=document.createElement("div");
_2e.innerHTML=s;
var _2f=_2e.firstChild.firstChild.getAttribute("src");
_2b.imageStack.push(new Image());
_2b.imageStack[_2b.imageStack.length-1].objRef=_2b;
_2b.firstImageLoaded=true;
++_2b.layerCount;
_2b.loadImgDiv(_2c,_2f,_2b.imageStack[_2b.imageStack.length-1]);
};
MapPane.prototype.modifyLayer=function(_30,_31){
_30.stylesheet.setParameter("width",_30.model.getWindowWidth());
_30.stylesheet.setParameter("height",_30.model.getWindowHeight());
_30.stylesheet.setParameter("bbox",_30.model.getBoundingBox().join(","));
_30.stylesheet.setParameter("srs",_30.model.getSRS());
var s=_30.stylesheet.transformNodeToString(_31);
var _33=document.createElement("div");
_33.innerHTML=s;
var _34=_33.firstChild.firstChild.getAttribute("src");
_30.imageStack.push(new Image());
_30.imageStack[_30.imageStack.length-1].objRef=_30;
_30.firstImageLoaded=true;
++_30.layerCount;
_30.loadImgDiv(_31,_34,_30.imageStack[_30.imageStack.length-1]);
};
MapPane.prototype.deleteLayer=function(_35,_36){
var _37=_35.getLayerDivId(_36);
var _38=document.getElementById(_37);
var _39=document.getElementById(_35.outputNodeId);
_39.removeChild(_38);
};
MapPane.prototype.moveLayerUp=function(_3a,_3b){
var _3c=document.getElementById(_3a.outputNodeId);
var _3d=_3a.getLayerDivId(_3b);
var _3e=document.getElementById(_3d);
var _3f=_3e.nextSibling;
if(!_3f){
alert(mbGetMessage("cantMoveUp",_3b));
return;
}
_3c.insertBefore(_3f,_3e);
};
MapPane.prototype.moveLayerDown=function(_40,_41){
var _42=document.getElementById(_40.outputNodeId);
var _43=_40.getLayerDivId(_41);
var _44=document.getElementById(_43);
var _45=_44.previousSibling;
if(!_45){
alert(mbGetMessage("cantMoveDown",_41));
return;
}
_42.insertBefore(_44,_45);
};
MapPane.prototype.loadImgDiv=function(_46,_47,_48){
var _49=document.getElementById(this.outputNodeId);
var _4a=_46.selectSingleNode("wmc:Name").firstChild.nodeValue;
var _4b=(_46.getAttribute("hidden")==1)?true:false;
var _4c="image/gif";
var _4d=_46.selectSingleNode("wmc:FormatList/wmc:Format[@current='1']");
if(_4d){
_4c=_4d.firstChild.nodeValue;
}
var _4e=this.getLayerDivId(_4a);
var _4f=document.getElementById(_4e);
if(!_4f){
_4f=document.createElement("div");
_4f.setAttribute("id",_4e);
_4f.style.position="absolute";
_4f.style.visibility=(_4b)?"hidden":"visible";
_4f.style.top="0px";
_4f.style.left="0px";
_4f.imgId=Math.random().toString();
var _50=document.createElement("img");
_50.id="real"+_4f.imgId;
_50.src=config.skinDir+"/images/Spacer.gif";
if(_46.getAttribute("opacity")){
var _51=_46.getAttribute("opacity");
if(_SARISSA_IS_IE){
_50.style.filter+=" alpha(opacity="+(_51*100)+")";
}else{
_4f.style.opacity=_51;
}
}
_50.layerHidden=_4b;
_4f.appendChild(_50);
var _52=this.model.getAllLayers();
for(var i=0;i<_52.length;i++){
if(_52[i]==_46){
var _54=i;
break;
}
}
var _55=new Array();
for(var i=_54;i<_52.length;i++){
_55.push(_52[i]);
}
for(var i=_55.length-1;i>=0;i--){
var _56=_55[i].selectSingleNode("wmc:Name").firstChild.nodeValue;
var _57=document.getElementById(this.getLayerDivId(_56));
if(_57){
var _58=_57;
}
}
if(_58){
_49.insertBefore(_4f,_58);
}else{
_49.appendChild(_4f);
}
}else{
var _50=_4f.firstChild;
}
_48.id=_4f.imgId;
_48.hidden=_4b;
_48.fixPng=false;
if(_SARISSA_IS_IE&&_4c=="image/png"){
_48.fixPng=true;
}
if(this.doNotPreload&&_4b){
_48.srcToLoad=_47;
_50.isLoading=false;
}else{
++this.loadingLayerCount;
var _59=mbGetMessage((this.loadingLayerCount>1)?"loadingLayers":"loadingLayer",this.loadingLayerCount);
this.model.setParam("modelStatus",_59);
_48.onload=MapImgLoadHandler;
_48.src=_47;
_50.isLoading=true;
}
};
function MapImgLoadHandler(){
var _5a=document.getElementById("real"+this.id);
if(!this.objRef.firstImageLoaded){
this.objRef.firstImageLoaded=true;
var _5b=document.getElementById(this.objRef.outputNodeId);
var _5c=_5b.childNodes;
for(var i=0;i<_5c.length;++i){
var _5e=_5c[i].firstChild;
_5e.parentNode.style.visibility="hidden";
_5e.style.visibility="hidden";
if(_SARISSA_IS_IE){
_5e.src=config.skinDir+"/images/Spacer.gif";
}
}
if(_SARISSA_IS_IE){
_5c[0].firstChild.parentNode.parentNode.style.visibility="hidden";
}
_5b.style.left="0px";
_5b.style.top="0px";
}
--this.objRef.loadingLayerCount;
if(this.objRef.loadingLayerCount>0){
var _5f=mbGetMessage((this.objRef.loadingLayerCount>1)?"loadingLayers":"loadingLayer",this.objRef.loadingLayerCount);
this.objRef.model.setParam("modelStatus",_5f);
}else{
this.objRef.model.setParam("modelStatus");
}
if(_SARISSA_IS_IE){
_5a.parentNode.parentNode.style.visibility="visible";
}
if(this.fixPng){
var vis=_5a.layerHidden?"hidden":"visible";
var _61=_5a.isLoading;
_5a.outerHTML=fixPNG(this,"real"+this.id,_5a);
fixImg=document.getElementById("real"+this.id);
fixImg.isLoading=_61;
if(!this.hidden){
fixImg.style.visibility="visible";
}
}else{
_5a.src=this.src;
_5a.width=this.objRef.model.getWindowWidth();
_5a.height=this.objRef.model.getWindowHeight();
if(!this.hidden){
_5a.parentNode.style.visibility="visible";
_5a.style.visibility="visible";
}
}
}
function MapImgLoad(_62,_63){
var _64=_63.imgId;
for(var i=0;i<_62.imageStack.length;i++){
if(_62.imageStack[i].id==_64){
++_62.loadingLayerCount;
var _66=mbGetMessage((_62.loadingLayerCount>1)?"loadingLayers":"loadingLayer",_62.loadingLayerCount);
_62.model.setParam("modelStatus",_66);
var _67=_62.imageStack[i];
_67.onload=MapImgLoadHandler;
_67.src=_67.srcToLoad;
_67.hidden=false;
var _68=document.getElementById("real"+_64);
_68.isLoading=true;
_68.layerHidden=false;
return;
}
}
alert(mbGetMessage("imageNotFound"));
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
mbDebugMessage(_7,"prepaint:"+Sarissa.serialize(_7.resultDoc));
}
if(_7.debug){
mbDebugMessage(_7,"stylesheet:"+Sarissa.serialize(_7.stylesheet.xslDom));
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

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlRendererSVG(_1,_2){
var _3=new MapContainerBase(this,_1,_2);
this.paintMethod="xsl2html";
this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");
this.prePaint=function(_4){
_4.model.setParam("modelStatus",mbGetMessage("preparingCoords"));
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

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
function EditPoint(_1,_2){
EditButtonBase.apply(this,new Array(_1,_2));
this.doAction=function(_3,_4){
if(_3.enabled){
point=_3.mouseHandler.model.extent.getXY(_4.evpl);
sucess=_3.targetModel.setXpathValue(_3.targetModel,_3.featureXpath,point[0]+","+point[1]);
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathEditPoint",_3.featureXpath));
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

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Graticule(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.mapContainerId=_1.selectSingleNode("mb:mapContainerId").firstChild.nodeValue;
this.display=false;
this.color=_1.selectSingleNode("mb:color").firstChild.nodeValue;
this.remove=function(_3){
try{
var i=0;
var _5=_3.map;
for(i=0;i<_3.divs.length;i++){
_5.removeChild(_3.divs[i]);
}
}
catch(e){
}
};
this.getBbox=function(_6){
var _7=new Object();
_7.ll=new Object();
_7.ur=new Object();
ll=_6.proj.Inverse(new Array(_6.bbox[0],_6.bbox[1]));
ur=_6.proj.Inverse(new Array(_6.bbox[2],_6.bbox[3]));
_7.ll.lon=ll[0];
_7.ll.lat=ll[1];
_7.ur.lon=ur[0];
_7.ur.lat=ur[1];
return _7;
};
this.gridIntervalMins=function(_8){
var _8=_8/10;
_8*=6000;
_8=Math.ceil(_8)/100;
if(_8<=0.06){
_8=0.06;
}else{
if(_8<=0.12){
_8=0.12;
}else{
if(_8<=0.3){
_8=0.3;
}else{
if(_8<=0.6){
_8=0.6;
}else{
if(_8<=1.2){
_8=1.2;
}else{
if(_8<=3){
_8=3;
}else{
if(_8<=6){
_8=6;
}else{
if(_8<=12){
_8=12;
}else{
if(_8<=30){
_8=30;
}else{
if(_8<=60){
_8=30;
}else{
if(_8<=(60*2)){
_8=60*2;
}else{
if(_8<=(60*5)){
_8=60*5;
}else{
if(_8<=(60*10)){
_8=60*10;
}else{
if(_8<=(60*20)){
_8=60*20;
}else{
if(_8<=(60*30)){
_8=60*30;
}else{
_8=60*45;
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
return _8;
};
this.gridPrecision=function(_9){
if(_9<0.01){
return 3;
}else{
if(_9<0.1){
return 2;
}else{
if(_9<1){
return 1;
}else{
return 0;
}
}
}
};
this.draw=function(_a){
_a.remove(_a);
var _b=_a.getBbox(_a);
var l=_b.ll.lon;
var b=_b.ll.lat;
var r=_b.ur.lon;
var t=_b.ur.lat;
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
var _10=_a.gridIntervalMins(t-b);
var _11;
if(r>l){
_11=_a.gridIntervalMins(r-l);
}else{
_11=_a.gridIntervalMins((180-l)+(r+180));
}
l=Math.floor(l*60/_11)*_11/60;
b=Math.floor(b*60/_10)*_10/60;
t=Math.ceil(t*60/_10)*_10/60;
r=Math.ceil(r*60/_11)*_11/60;
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
_10/=60;
_11/=60;
_a.dLat=_10;
_a.dLon=_11;
var _12=_a.gridPrecision(_10);
var _13=_a.gridPrecision(_11);
_a.divs=new Array();
var i=0;
var pbl=_a.fromLatLngToDivPixel(_a,b,l);
var ptr=_a.fromLatLngToDivPixel(_a,t,r);
_a.maxX=ptr.x;
_a.maxY=pbl.y;
_a.minX=pbl.x;
_a.minY=ptr.y;
var x;
var y=_a.fromLatLngToDivPixel(_a,b+_10+_10,l).y+2;
var _19=_a.map;
var lo=l;
if(r<lo){
r+=360;
}
while(lo<=r){
var p=_a.fromLatLngToDivPixel(_a,b,lo);
_a.divs[i]=_a.createVLine(_a,p.x);
_19.insertBefore(_a.divs[i],null);
i++;
var d=document.createElement("DIV");
x=p.x+3;
d.style.position="absolute";
d.style.left=x.toString()+"px";
d.style.top=y.toString()+"px";
d.style.color=_a.color;
d.style.fontFamily="Arial";
d.style.fontSize="x-small";
if(lo==0){
d.innerHTML=(Math.abs(lo)).toFixed(_13);
}else{
if(lo<0){
d.title=mbGetMessage("westWgs84");
d.innerHTML=(Math.abs(lo)).toFixed(_13)+" E";
}else{
d.title=mbGetMessage("eastWgs84");
d.innerHTML=(Math.abs(lo)).toFixed(_13)+" W";
}
}
_19.insertBefore(d,null);
_a.divs[i]=d;
i++;
lo+=_11;
if(lo>180){
r-=360;
lo-=360;
}
}
var j=0;
x=_a.fromLatLngToDivPixel(_a,b,l+_11+_11).x+3;
while(b<=t){
var p=_a.fromLatLngToDivPixel(_a,b,l);
if(r<l){
_a.divs[i]=_a.createHLine3(_a,b);
_19.insertBefore(_a.divs[i],null);
i++;
}else{
if(r==l){
_a.divs[i]=_a.createHLine3(_a,b);
_19.insertBefore(_a.divs[i],null);
i++;
}else{
_a.divs[i]=_a.createHLine(_a,p.y);
_19.insertBefore(_a.divs[i],null);
i++;
}
}
var d=document.createElement("DIV");
y=p.y+2;
d.style.position="absolute";
d.style.left=x.toString()+"px";
d.style.top=y.toString()+"px";
d.style.color=_a.color;
d.style.fontFamily="Arial";
d.style.fontSize="x-small";
if(b==0){
d.innerHTML=(Math.abs(b)).toFixed(_13);
}else{
if(b<0){
d.title=mbGetMessage("southWgs84");
d.innerHTML=(Math.abs(b)).toFixed(_12)+" S";
}else{
d.title=mbGetMessage("northWgs84");
d.innerHTML=(Math.abs(b)).toFixed(_12)+" N";
}
}
if(j!=2){
_19.insertBefore(d,null);
_a.divs[i]=d;
i++;
}
j++;
b+=_10;
}
};
this.fromLatLngToDivPixel=function(_1e,lat,lon){
var xy=_1e.proj.Forward(new Array(lon,lat));
var _22=new Object();
_22.x=_1e.targetModel.extent.getPL(xy)[0];
_22.y=_1e.targetModel.extent.getPL(xy)[1];
return _22;
};
this.createVLine=function(_23,x){
var div=document.createElement("DIV");
div.style.position="absolute";
div.style.overflow="hidden";
div.style.backgroundColor=_23.color;
div.style.left=x+"px";
div.style.top=_23.minY+"px";
div.style.width="1px";
div.style.height=(_23.maxY-_23.minY)+"px";
return div;
};
this.createHLine=function(_26,y){
var div=document.createElement("DIV");
div.style.position="absolute";
div.style.overflow="hidden";
div.style.backgroundColor=_26.color;
div.style.left=_26.minX+"px";
div.style.top=y+"px";
div.style.width=(_26.maxX-_26.minX)+"px";
div.style.height="1px";
return div;
};
this.createHLine3=function(_29,lat){
var f=_29.fromLatLngToDivPixel(_29,lat,0);
var t=_29.fromLatLngToDivPixel(_29,lat,180);
var div=document.createElement("DIV");
div.style.position="absolute";
div.style.overflow="hidden";
div.style.backgroundColor=_29.color;
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
};
this.init=function(_30){
_30.width=parseInt(_30.targetModel.getWindowWidth());
_30.height=parseInt(_30.targetModel.getWindowHeight());
_30.bbox=_30.targetModel.getBoundingBox();
_30.proj=new Proj(_30.targetModel.getSRS());
if(_30.bbox[1]<0){
if(_30.bbox[3]<0){
_30.diffLat=_30.bbox[1]-_30.bbox[3];
}else{
_30.diffLat=_30.bbox[3]-_30.bbox[1];
}
}else{
_30.diffLat=_30.bbox[3]+_30.bbox[1];
}
if(_30.bbox[0]<0){
if(_30.bbox[2]<0){
_30.diffLon=_30.bbox[0]-_30.bbox[2];
}else{
_30.diffLon=_30.bbox[2]-_30.bbox[0];
}
}else{
_30.diffLon=_30.bbox[2]+_30.bbox[0];
}
_30.draw(_30);
};
this.doSelect=function(_31,_32){
if(_31&&_32.display==false){
this.targetModel.addListener("bbox",this.init,this);
_32.display=true;
_32.map=document.getElementById(_32.mapContainerId);
_32.init(_32);
}else{
if(_32.display==true){
this.targetModel.removeListener("bbox",this.init,this);
_32.display=false;
_32.remove(_32);
}
}
};
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
alert(mbGetMessage("noFeatureToDelete"));
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

mapbuilder.loadScript(baseDir+"/model/Proj.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function GmlRendererWKT(_1,_2){
var _3=new MapContainerBase(this,_1,_2);
this.paintMethod="xsl2js";
this.coordXsl=new XslProcessor(baseDir+"/widget/GmlCooordinates2Coord.xsl");
this.prePaint=function(_4){
_4.stylesheet.setParameter("objRef","objRef");
_4.model.setParam("modelStatus",mbGetMessage("preparingCoords"));
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

mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/widget/MapContainerBase.js");
function MapPaneOL(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
MapContainerBase.apply(this,new Array(_1,_2));
OpenLayers.ImgPath=config.skinDir+"/images/openlayers/";
this.model.addListener("refresh",this.paint,this);
this.model.addListener("hidden",this.hidden,this);
this.model.addListener("addLayer",this.addLayer,this);
this.model.addListener("deleteLayer",this.deleteLayer,this);
this.model.addListener("moveLayerUp",this.moveLayerUp,this);
this.model.addListener("moveLayerDown",this.moveLayerDown,this);
this.model.addListener("opacity",this.setOpacity,this);
this.model.addListener("newModel",this.clearWidget2,this);
}
MapPaneOL.prototype.paint=function(_3,_4){
if(!_3.model.map||_4=="sld"){
if(_4=="sld"){
_3.clearWidget2(_3);
}
if(_3.model.doc.selectSingleNode("//wmc:OWSContext")){
_3.context="OWS";
}else{
if(_3.model.doc.selectSingleNode("//wmc:ViewContext")){
_3.context="View";
}else{
alert(mbGetMessage("noContextDefined"));
}
}
var _5=_3.model.proj;
var _6=null;
_6=_3.widgetNode.selectSingleNode("mb:maxExtent");
_6=(_6)?_6.firstChild.nodeValue.split(" "):null;
if(!_6){
_6=_3.model.getBoundingBox();
width=_3.model.getWindowWidth();
}
_6=(_6)?new OpenLayers.Bounds(_6[0],_6[1],_6[2],_6[3]):null;
if(_6==null){
alert(mbGetMessage("noBboxInContext"));
}
var _7=null;
_7=_3.widgetNode.selectSingleNode("mb:maxResolution");
_7=(_7)?_7.firstChild.nodeValue:"auto";
var _8={controls:[],projection:_5.srs,units:_5.units,maxExtent:_6,maxResolution:_7,theme:config.skinDir+"/openlayers/style.css"};
_3.model.map=new OpenLayers.Map(_3.node,_8);
_3.model.map.Z_INDEX_BASE.Control=10000;
var _9=_3.model.getAllLayers();
if(!_3.oLlayers){
_3.oLlayers=new Array();
}
for(var i=0;i<=_9.length-1;i++){
_3.addLayer(_3,_9[i]);
}
var _b=_3.model.getBoundingBox();
_3.model.map.zoomToExtent(new OpenLayers.Bounds(_b[0],_b[1],_b[2],_b[3]));
var _c=_3.model.map.getExtent().toBBOX().split(",");
_3.model.map.historyExtent=new Array();
_3.model.map.historyExtent[0]=_3.model.map.getExtent();
_3.model.map.nbExtent=0;
_3.model.map.nbExtent++;
var ul=new Array(_c[0],_c[3]);
var lr=new Array(_c[2],_c[1]);
_3.model.setBoundingBox(new Array(ul[0],lr[1],lr[0],ul[1]));
_3.model.extent.setSize(new Array(_3.model.map.getResolution(),_3.model.map.getResolution()));
_3.model.setParam("aoi",new Array(ul,lr));
_3.model.callListeners("mapLoaded");
}
_3.model.map.events.register("moveend",_3.model.map,function(e){
var _10=_3.model.map.getExtent().toBBOX().split(",");
var ul=new Array(_10[0],_10[3]);
var lr=new Array(_10[2],_10[1]);
if(_3.model.getParam("aoi").toString()!=new Array(ul,lr).toString()){
_3.model.setBoundingBox(new Array(ul[0],lr[1],lr[0],ul[1]));
_3.model.extent.setSize(new Array(_3.model.map.getResolution(),_3.model.map.getResolution()));
_3.model.setParam("aoi",new Array(ul,lr));
_3.model.map.historyExtent[_3.model.map.nbExtent]=_3.model.map.getExtent();
_3.model.map.nbExtent++;
}
});
};
MapPaneOL.prototype.extractStyle=function(_13,_14,_15){
_15=_15.toLowerCase().replace(/ogc:/,"");
if(_15=="gml"||_15=="wfs"){
var _16=MapPaneOL.getDefaultStyle();
_16.map=_13.model.map;
var _17;
var _18=false;
_17=_14.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill']");
if(_17){
_16.fillColor=_17.firstChild.nodeValue;
_18=true;
}
_17=_14.selectSingleNode(".//sld:Fill/sld:CssParameter[@name='fill-opacity']");
if(_17){
_16.fillOpacity=_17.firstChild.nodeValue;
_18=true;
}
_17=_14.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke']");
if(_17){
_16.strokeColor=_17.firstChild.nodeValue;
_18=true;
}
_17=_14.selectSingleNode(".//sld:Stroke/sld:CssParameter[@name='stroke-opacity']");
if(_17){
_16.strokeOpacity=_17.firstChild.nodeValue;
_18=true;
}
if(!_18){
_16=null;
}
return _16;
}else{
if(_15=="wms"){
var _19=new Array();
var sld=_14.selectSingleNode("wmc:StyleList/wmc:Style[@current='1']/wmc:SLD");
if(sld){
if(sld.selectSingleNode("wmc:OnlineResource")){
_19.sld=sld.selectSingleNode("wmc:OnlineResource").getAttribute("xlink:href");
}else{
if(sld.selectSingleNode("wmc:FeatureTypeStyle")){
_19.sld=Sarissa.serialize(sld.selectSingleNode("wmc:FeatureTypeStyle"));
}else{
if(sld.selectSingleNode("wmc:StyledLayerDescriptor")){
_19.sld_body=Sarissa.serialize(sld.selectSingleNode("wmc:StyledLayerDescriptor"));
}
}
}
}else{
if(_14.selectSingleNode("wmc:StyleList/wmc:Style[@current='1']/wmc:Name")){
if(_14.selectSingleNode("wmc:StyleList/wmc:Style[@current='1']/wmc:Name").firstChild){
_19.styles=_14.selectSingleNode("wmc:StyleList/wmc:Style[@current='1']/wmc:Name").firstChild.nodeValue;
}
}
}
return _19;
}
}
};
MapPaneOL.prototype.hidden=function(_1b,_1c){
var vis=_1b.model.getHidden(_1c);
if(vis=="1"){
var _1e=false;
}else{
var _1e=true;
}
if(_1b.getLayer(_1b,_1c)){
_1b.getLayer(_1b,_1c).setVisibility(_1e);
}
};
MapPaneOL.prototype.getLayer=function(_1f,_20){
return _1f.model.map.getLayer(_1f.oLlayers[_20].id);
};
MapPaneOL.prototype.getLayerDivId=function(_21,_22){
return _21.getLayer(_22).div;
};
MapPaneOL.prototype.deleteLayer=function(_23,_24){
if(_23.oLlayers[_24]){
_23.model.map.removeLayer(_23.oLlayers[_24]);
}
};
MapPaneOL.prototype.deleteAllLayers=function(_25){
_25.model.map.destroy();
};
MapPaneOL.prototype.moveLayerUp=function(_26,_27){
var map=_26.model.map;
map.raiseLayer(map.getLayer(_26.oLlayers[_27].id),1);
};
MapPaneOL.prototype.moveLayerDown=function(_29,_2a){
_29.model.map.raiseLayer(_29.getLayer(_29,_2a),-1);
};
MapPaneOL.prototype.setOpacity=function(_2b,_2c){
var _2d="1";
_2d=_2b.model.getOpacity(_2c);
_2b.getLayer(_2b,_2c).setOpacity(_2d);
};
MapPaneOL.prototype.addLayer=function(_2e,_2f){
var _30=_2e.model.proj;
var _31=null;
_31=_2e.widgetNode.selectSingleNode("mb:maxExtent");
_31=(_31)?_31.firstChild.nodeValue.split(" "):null;
if(!_31){
_31=_2e.model.getBoundingBox();
}
_31=(_31)?new OpenLayers.Bounds(_31[0],_31[1],_31[2],_31[3]):null;
if(_31==null){
alert(mbGetMessage("noBboxInContext"));
}
var _32=null;
_32=_2e.widgetNode.selectSingleNode("mb:maxResolution");
_32=(_32)?_32.firstChild.nodeValue:"auto";
var _33=_2f;
var _34=_33.selectSingleNode("wmc:Server/@service");
_34=(_34)?_34.nodeValue:"";
var _35=_33.selectSingleNode("wmc:Title");
_35=(_35)?_35.firstChild.nodeValue:"";
var _36=_33.selectSingleNode("wmc:Name");
_36=(_36)?_36.firstChild.nodeValue:"";
if(_2e.context=="OWS"){
var _37=_33.selectSingleNode("wmc:Server/wmc:OnlineResource/@xlink:href");
_37=(_37)?_37.firstChild.nodeValue:"";
}else{
var _37=_33.selectSingleNode("wmc:Server/wmc:OnlineResource").getAttribute("xlink:href");
}
var _38=_33.selectSingleNode("wmc:FormatList/wmc:Format");
_38=(_38)?_38.firstChild.nodeValue:"image/gif";
var vis=_33.selectSingleNode("@hidden");
if(vis){
if(vis.nodeValue=="1"){
vis=false;
}else{
vis=true;
}
}
var _3a=_33.selectSingleNode("@queryable");
if(_3a){
if(_3a.nodeValue=="1"){
_3a=true;
}else{
_3a=false;
}
}
var _3b=_33.selectSingleNode("@opacity");
if(_3b){
_3b=_3b.nodeValue;
}else{
_3b=false;
}
var _3c={visibility:vis,transparent:"TRUE",projection:_30.srs,queryable:_3a,maxExtent:_31,maxResolution:_32,alpha:false,isBaseLayer:false,displayOutsideMaxExtent:true};
switch(_34){
case "OGC":
case "WMS":
case "wms":
case "OGC:WMS":
if(!_2e.model.map.baseLayer){
_3c.isBaseLayer=true;
}else{
_3c.reproject=false;
_3c.isBaseLayer=false;
}
var _3d=new Array();
_3d=_2e.extractStyle(_2e,_33,"wms");
_2e.oLlayers[_36]=new OpenLayers.Layer.WMS(_35,_37,{layers:_36,transparent:"TRUE",format:_38,sld:_3d.sld,sld_body:_3d.sld_body,styles:_3d.styles},_3c);
break;
case "wfs":
case "OGC:WFS":
style=_2e.extractStyle(_2e,_33,"wfs");
if(style){
_3c.style=style;
}else{
_3c.style=new OpenLayers.Style.WebSafe(2*i+1);
}
_3c.featureClass=OpenLayers.Feature.WFS;
_2e.oLlayers[_36]=new OpenLayers.Layer.WFS(_35,_37,{typename:_36,maxfeatures:1000},_3c);
break;
case "gml":
case "OGC:GML":
style=_2e.extractStyle(_2e,_33,"gml");
if(style){
_3c.style=style;
}else{
_3c.style=new OpenLayers.Style.WebSafe(2*i+1);
}
_2e.oLlayers[_36]=new OpenLayers.Layer.GML(_35,_37,_3c);
break;
case "GMAP":
case "Google":
_3c.projection="EPSG:41001";
_3c.units="degrees";
_2e.model.map.units="degrees";
_3c.maxExtent=new OpenLayers.Bounds("-180","-90","180","90");
_3c.isBaseLayer=true;
_2e.oLlayers[_36]=new OpenLayers.Layer.Google("Google Satellite",{type:G_HYBRID_MAP,maxZoomLevel:18},_3c);
break;
case "YMAP":
case "Yahoo":
_3c.isBaseLayer=true;
_2e.oLlayers[_36]=new OpenLayers.Layer.Yahoo("Yahoo");
break;
case "VE":
case "Microsoft":
_3c.isBaseLayer=true;
_2e.oLlayers[_36]=new OpenLayers.Layer.VirtualEarth("VE",{minZoomLevel:0,maxZoomLevel:18,type:VEMapStyle.Hybrid});
break;
case "MultiMap":
_3c.isBaseLayer=true;
_2e.oLlayers[_36]=new OpenLayers.Layer.MultiMap("MultiMap");
break;
default:
alert(mbGetMessage("layerTypeNotSupported",_34));
}
if(_3b&&_2e.oLlayers[_36]){
_2e.oLlayers[_36].setOpacity(_3b);
}
_2e.model.map.addLayer(_2e.oLlayers[_36]);
};
MapPaneOL.prototype.clearWidget2=function(_3e){
if(_3e.model.map){
_3e.model.map.destroy();
outputNode=document.getElementById(_3e.model.id+"Container_OpenLayers_ViewPort");
if(outputNode){
_3e.node.removeChild(outputNode);
}
_3e.model.map=null;
_3e.oLlayers=null;
}
};
MapPaneOL.prototype.getWebSafeStyle=function(_3f,_40){
colors=new Array("00","33","66","99","CC","FF");
_40=(_40)?_40:0;
_40=(_40<0)?0:_40;
_40=(_40>215)?215:_40;
i=parseInt(_40/36);
j=parseInt((_40-i*36)/6);
k=parseInt((_40-i*36-j*6));
var _41="#"+colors[i]+colors[j]+colors[k];
var _42=MapPaneOL.getDefaultStyle();
_42.fillColor=_41;
_42.strokeColor=_41;
_42.map=_3f.model.map;
return _42;
};
MapPaneOL.getDefaultStyle=function(){
return new Object({fillColor:"#ee9900",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"#ee9900",strokeOpacity:1,strokeWidth:1,hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"});
};

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function ZoomOut(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="crosshair";
this.createControl=function(_3){
var _4=OpenLayers.Class.create();
_4.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{CLASS_NAME:"mbControl.ZoomOut",type:OpenLayers.Control.TYPE_TOOL,draw:function(){
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
return new _4();
};
}

mapbuilder.loadScript(baseDir+"/tool/Extent.js");
function MapContainerBase(_1,_2){
var _3=_1.selectSingleNode("mb:mapContainerId");
if(_3){
this.containerNodeId=_3.firstChild.nodeValue;
}else{
alert(mbGetMessage("noMapContainerId",this.id));
}
var _4=_1.selectSingleNode("mb:zoomLevels");
this.zoomLevels=null;
if(_4){
this.zoomLevels=_4.firstChild.nodeValue.split(",");
}
this.setContainerWidth=function(_5){
_5.node.style.width=_5.containerModel.getWindowWidth()+"px";
_5.node.style.height=_5.containerModel.getWindowHeight()+"px";
if(this.stylesheet){
this.stylesheet.setParameter("width",_5.containerModel.getWindowWidth());
this.stylesheet.setParameter("height",_5.containerModel.getWindowHeight());
}
};
this.setFixedWidth=function(_6){
var _7=_1.selectSingleNode("mb:fixedWidth");
if(_7){
_7=_7.firstChild.nodeValue;
var _8=_6.containerModel.getWindowHeight()/_6.containerModel.getWindowWidth();
var _9=Math.round(_8*_7);
_6.containerModel.setWindowSize(new Array(_7,_9));
}
};
var _a=document.getElementById(this.containerNodeId);
if(_a){
this.containerModel=_a.containerModel;
_2.containerModel=_a.containerModel;
}else{
_a=document.createElement("div");
_a.setAttribute("id",this.containerNodeId);
_a.id=this.containerNodeId;
_a.style.position="relative";
_a.style.overflow="hidden";
_a.style.zIndex="500";
_a.containerModel=this.model;
this.containerModel=this.model;
_2.containerModel=_a.containerModel;
this.containerModel.extent=new Extent(this.containerModel);
if(this.zoomLevels){
this.containerModel.extent.setZoomLevels(true,this.zoomLevels);
}else{
this.containerModel.extent.setZoomLevels(false);
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
_a.onmousemove=this.eventHandler;
_a.onmouseout=this.eventHandler;
_a.onmouseover=this.eventHandler;
_a.onmousedown=this.eventHandler;
_a.onmouseup=this.eventHandler;
this.node.appendChild(_a);
}
this.node=document.getElementById(this.containerNodeId);
this.setContainerWidth=this.setContainerWidth;
this.containerModel.addFirstListener("loadModel",this.setContainerWidth,this);
this.containerModel.addFirstListener("loadModel",this.setFixedWidth,this);
this.containerModel.addFirstListener("resize",this.setContainerWidth,this);
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
mbDebugMessage(_6,"painting:"+Sarissa.serialize(_6.model.doc));
}
if(_6.debug){
mbDebugMessage(_6,"stylesheet:"+Sarissa.serialize(_6.stylesheet.xslDom));
}
var _8=_6.stylesheet.transformNodeToObject(_6.model.doc);
if(Sarissa.getParseErrorText(_8)!=Sarissa.PARSED_OK){
alert(mbGetMessage("parseError",Sarissa.getParseErrorText(_8)));
}
var _9=_8.selectNodes("//img");
if(_6.debug){
var s=_6.stylesheet.transformNodeToString(_6.model.doc);
mbDebugMessage(_6,"painting:"+_6.id+":"+s);
if(config.serializeUrl){
postLoad(config.serializeUrl,s);
}
}
_6.MapLayerMgr.deleteAllLayers();
var _b=document.getElementById(_6.outputNodeId);
if(!_b){
_b=document.createElement("div");
_b.setAttribute("id",_6.outputNodeId);
_b.style.position="absolute";
_6.node.appendChild(_b);
_b.style.left="0px";
_b.style.top="0px";
}
var _c=_6.model.getAllLayers();
_6.firstImageLoaded=false;
_6.layerCount=_c.length;
for(var i=0;i<_c.length;i++){
var _e=_6.MapLayerMgr.addLayer(_6.MapLayerMgr,_c[i]);
if(_9[i]){
newSrc=_9[i].getAttribute("src");
}
if(_e.setSrc){
_e.setSrc(newSrc);
}
}
var _f=mbGetMessage((_6.layerCount>1)?"loadingLayers":"loadingLayer",_6.layerCount);
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
alert(mbGetMessage("cantMoveUp",_18));
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
alert(mbGetMessage("cantMoveDown",_1e));
return;
}
_1f.insertBefore(_21,_22);
};
MapPane2.prototype.clearWidget2=function(_23){
_23.MapLayerMgr.deleteAllLayers();
};

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Forward(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class.create();
_4.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
if(this.map.nbExtent>this.map.historyExtent.length-1){
alert(mbGetMessage("cantGoForward"));
}else{
this.map.zoomToExtent(this.map.historyExtent[this.map.nbExtent]);
}
},CLASS_NAME:"mbControl.Forward"});
return new _4();
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function Back(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.createControl=function(_3){
var _4=OpenLayers.Class.create();
_4.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
if(this.map.nbExtent<=1){
alert(mbGetMessage("cantGoBack"));
}else{
this.map.nbExtent--;
this.map.nbExtent--;
this.map.zoomToExtent(this.map.historyExtent[this.map.nbExtent]);
}
},CLASS_NAME:"mbControl.Back"});
return new _4();
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
function TransactionResponse(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Version(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
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
alert(mbGetMessage("invalidFeatureXpathEditPolygon",_3.featureXpath));
}
}
};
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
function ClickPass(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:ClickPassId");
if(_3!=null){
this.clickPassId=_3.firstChild.nodeValue;
}else{
alert(mbGetMessage("unspecClickPassId"));
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
alert(mbGetMessage("unspecIcon"));
}
var _8=_1.selectSingleNode("mb:topOffset");
if(_8!=null){
this.topOffset=parseInt(_8.firstChild.nodeValue);
}else{
alert(mbGetMessage("unspecTopOffset"));
}
var _9=_1.selectSingleNode("mb:leftOffset");
if(_9!=null){
this.leftOffset=parseInt(_9.firstChild.nodeValue);
}else{
alert(mbGetMessage("unspecLeftOffset"));
}
this.doAction=function(_a,_b){
if(_a.enabled){
point=_a.mouseHandler.model.extent.getXY(_b.evpl);
var x=point[0];
var y=point[1];
_a.iconDiv.style.top=_b.evpl[1]+_a.topOffset+"px";
_a.iconDiv.style.left=_b.evpl[0]+_a.leftOffset+"px";
_a.iconDiv.style.visibility="visible";
clickIt(x,y);
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
alert(mbGetMessage("divClickPassNotFound",this.clickPassId));
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
alert(mbGetMessage("divClickPassNotFound",id));
}
}

mapbuilder.loadScript(baseDir+"/widget/ButtonBase.js");
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
_4.targetModel.deleteTemplates();
var _6=_4.context.getParam("selectedLayer");
if(_6==null){
var _7=_4.context.getQueryableLayers();
if(_7.length==0){
alert(mbGetMessage("noQueryableLayers"));
return;
}else{
for(var i=0;i<_7.length;++i){
var _9=_7[i];
var _a=_9.firstChild.data;
var _b=_4.context.getHidden(_a);
if(_b==0){
_4.xsl.setParameter("queryLayer",_a);
_4.xsl.setParameter("layer",_a);
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
_4.xsl.setParameter("layer",_a);
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
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function Reset(_1,_2){
this.createControl=function(){
return new OpenLayers.Control.ZoomToMaxExtent();
};
ButtonBase.apply(this,new Array(_1,_2));
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

mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function OverviewMap(_1,_2){
WidgetBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:fixedWidth");
if(_3){
this.fixedWidth=new Number(_3.firstChild.nodeValue);
}
this.model.addListener("refresh",this.addOverviewMap,this);
}
OverviewMap.prototype.addOverviewMap=function(_4){
if(_4.model&&_4.model.map){
var _5=_4.model.map;
var _6={div:document.getElementById(_4.htmlTagId)};
var _7=_5.baseLayer;
if(_7!=null&&_7 instanceof OpenLayers.Layer.WMS){
var _8=new OpenLayers.Layer.WMS.Untiled(_7.name,_7.url,{layers:_7.params.LAYERS});
_6.layers=[_8];
}
if(_4.fixedWidth){
var _9=_5.getExtent();
var _a=new OpenLayers.Size(_4.fixedWidth,_4.fixedWidth*_9.getHeight()/_9.getWidth());
_6.size=_a;
}
var _b=new OpenLayers.Control.OverviewMap(_6);
_5.addControl(_b);
}
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
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function Button(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.cursor="default";
this.createControl=function(_3){
};
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FilterAttributes(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function Abstract(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
function SLDEditor(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.refresh=function(_3,_4){
_3.stylesheet.setParameter("layerName",_4);
_3.paint(_3,_3.id);
};
this.model.addListener("SLDChange",this.refresh,this);
this.setAttr=function(_5,_6,_7,_8){
if(_8){
_6=_6+"[@name='"+_8+"']";
}
_5.model.setXpathValue(_5.model,_6,_7);
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
alert(mbGetMessage("stylesheetNotFound"));
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
alert(mbGetMessage("errorDeletingLayer"));
}
}
}
if(_e==0){
return;
}
for(var _15=0;_15<_e;_15++){
var _16=_d[_15];
var id=_16.getAttribute("id");
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
var re=RegExp("[, \n\t]+","g");
var _21=_1f.split(re);
var _22=new Array(_21.length/2);
var _1e=new Array(2);
var _23;
var jj=0;
for(var i=0;i<_21.length;i++){
_1e[0]=_21[i];
_1e[1]=_21[i+1];
_23=_13.Forward(_1e);
_23=_12.containerModel.extent.getPL(_23);
_22[jj]=_23;
jj++;
i++;
}
_12.featureFactory.createFeature(_12,"LINESTRING",_22,_19,_18,_1c,_1a);
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
function MapTitle(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

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
this.foldUnfoldGroup=function(_a,id){
var _c="//wmc:General/wmc:Extension/wmc:GroupList/wmc:Group[@name='"+_a+"']";
var _d=_2.doc.selectSingleNode(_c);
var _e=_d.getAttribute("folded");
e=document.getElementById(id);
if(_e=="1"){
_d.setAttribute("folded","0");
e.value="-";
}else{
_d.setAttribute("folded","1");
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

mapbuilder.loadScript(baseDir+"/tool/ButtonBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");
function WfsGetFeature(_1,_2){
ButtonBase.apply(this,new Array(_1,_2));
this.widgetNode=_1;
this.trm=_1.selectSingleNode("mb:transactionResponseModel").firstChild.nodeValue;
this.httpPayload=new Object({method:"get",postData:null});
this.maxFeatures=_1.selectSingleNode("mb:maxFeatures");
this.maxFeatures=this.maxFeatures?this.maxFeatures.firstChild.nodeValue:1;
this.webServiceUrl=_1.selectSingleNode("mb:webServiceUrl").firstChild.nodeValue;
this.webServiceUrl+=this.webServiceUrl.indexOf("?")>-1?"&":"?";
this.cursor="pointer";
this.createControl=function(_3){
var _4=config.objects[_3.trm];
var _5=OpenLayers.Class.create();
_5.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{CLASS_NAME:"mbControl.WfsGetFeature",type:OpenLayers.Control.TYPE_TOOL,tolerance:new Number(_3.widgetNode.selectSingleNode("mb:tolerance").firstChild.nodeValue),typeName:_3.widgetNode.selectSingleNode("mb:typeName").firstChild.nodeValue,httpPayload:_3.httpPayload,maxFeatures:_3.maxFeatures,webServiceUrl:_3.webServiceUrl,transactionResponseModel:_4,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.selectBox},{keyMask:this.keyMask});
},selectBox:function(_6){
var _7,minXY,maxXY;
if(_6 instanceof OpenLayers.Bounds){
minXY=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_6.left,_6.bottom));
maxXY=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_6.right,_6.top));
}else{
minXY=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_6.x-this.tolerance,_6.y+this.tolerance));
maxXY=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_6.x+this.tolerance,_6.y-this.tolerance));
}
_7=new OpenLayers.Bounds(minXY.lon,minXY.lat,maxXY.lon,maxXY.lat);
this.httpPayload.url=this.webServiceUrl+OpenLayers.Util.getParameterString({SERVICE:"WFS",VERSION:"1.0.0",REQUEST:"GetFeature",TYPENAME:this.typeName,MAXFEATURES:this.maxFeatures,BBOX:_7.toBBOX()});
this.transactionResponseModel.newRequest(this.transactionResponseModel,this.httpPayload);
}});
return new _5();
};
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function FeatureInfo(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
this.setAttr=function(_3,_4,_5){
_3.model.setXpathValue(_3.model,_4,_5);
};
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
_5.containerModel.model=_5.model;
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

mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");
function SelectAllMapLayers(_1,_2){
WidgetBaseXSL.apply(this,new Array(_1,_2));
}

mapbuilder.loadScript(baseDir+"/widget/EditButtonBase.js");
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
_7.model.setParam("clearMeasurementLine");
_7.restart=false;
}
var _9=_7.mouseHandler.model.extent.getXY(_8.evpl);
var _a=_7.targetModel.getXpathValue(_7.targetModel,_7.featureXpath);
if(!_a){
_a="";
}
sucess=_7.targetModel.setXpathValue(_7.targetModel,_7.featureXpath,_a+" "+_9[0]+","+_9[1]);
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathMeasurement",_7.featureXpath));
}
var _b=_7.targetModel.getXpathValue(_7.targetModel,_7.featureXpath);
var _c=_b.split(" ");
if(_c.length>=3){
var _d=_c[_c.length-2];
var _e=_c[_c.length-1];
var P=_d.split(",");
var Q=_e.split(",");
_7.srs=srs.toUpperCase();
_7.proj=new Proj(_7.srs);
if(_7.proj.Forward){
P=_7.proj.Forward(P);
Q=_7.proj.Forward(Q);
}
if(!P||!Q){
alert(mbGetMessage("projectionNotSupported"));
}else{
if(_7.proj.units=="meters"){
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
}else{
if(_7.proj.units=="degrees"){
deg2rad=Math.PI/180;
LonpRad=parseFloat(P[0])*deg2rad;
LatpRad=parseFloat(P[1])*deg2rad;
LonqRad=parseFloat(Q[0])*deg2rad;
LatqRad=parseFloat(Q[1])*deg2rad;
radDistance=Math.acos(Math.sin(LatpRad)*Math.sin(LatqRad)+Math.cos(LatpRad)*Math.cos(LatqRad)*Math.cos(LonpRad-LonqRad));
radDistance=Math.acos(Math.sin(Latp)*Math.sin(Latq)+Math.cos(Latp)*Math.cos(Latq)*Math.cos(Lonp-Lonq));
_4=radDistance*6378137;
if(_4==0){
_7.restart=true;
_7.model.setParam("clearMouseLine");
_7.targetModel.setParam("mouseRenderer",false);
return;
}
_3=Math.round(_3+_4);
}else{
alert(mbGetMessage("cantCalculateDistance"));
}
}
}
}
_7.targetModel.setParam("showDistance",_3);
}
};
this.clearMeasurementLine=function(_11){
if(_3!=0){
_3=0;
sucess=_11.targetModel.setXpathValue(_11.targetModel,_11.featureXpath,"");
if(!sucess){
alert(mbGetMessage("invalidFeatureXpathMeasurement",_11.featureXpath));
}
_11.targetModel.setParam("refresh");
}
};
this.model.addListener("clearMeasurementLine",this.clearMeasurementLine,this);
}

function FeatureTypeSchema(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
}

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
var _a=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:BoundingBox");
var _b=new Array();
_b[0]=parseFloat(_a.getAttribute("minx"));
_b[1]=parseFloat(_a.getAttribute("miny"));
_b[2]=parseFloat(_a.getAttribute("maxx"));
_b[3]=parseFloat(_a.getAttribute("maxy"));
return _b;
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
}
};
this.addFirstListener("mapLoaded",this.initBbox,this);
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
};
this.addFirstListener("addSLD",this.addSLD,this);
this.deleteLayer=function(_32,_33){
var _34=_32.getLayer(_33);
if(!_34){
alert(mbGetMessage("nodeNotFound",_33));
return;
}
_34.parentNode.removeChild(_34);
_32.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_35,_36){
var _37=_35.getLayer(_36);
var _38=_37.selectSingleNode("following-sibling::*");
if(!_38){
alert(mbGetMessage("cantMoveUp",_36));
return;
}
_37.parentNode.insertBefore(_38,_37);
_35.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_39,_3a){
var _3b=_39.getLayer(_3a);
var _3c=_3b.selectNodes("preceding-sibling::*");
var _3d=_3c[_3c.length-1];
if(!_3d){
alert(mbGetMessage("cantMoveDown",_3a));
return;
}
_3b.parentNode.insertBefore(_3b,_3d);
_39.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.setExtension=function(_3e){
var _3f=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
if(!_3f){
var _40=this.doc.selectSingleNode("/wmc:ViewContext/wmc:General");
var _41=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_3f=_40.appendChild(_41);
}
return _3f.appendChild(_3e);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:ViewContext/wmc:General/wmc:Extension");
};
this.initTimeExtent=function(_42){
var _43=_42.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_43.length;++i){
var _45=_43[i];
_42.timestampList=createElementWithNS(_42.doc,"TimestampList",mbNsUrl);
var _46=_45.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
_42.timestampList.setAttribute("layerName",_46);
var _47=_45.firstChild.nodeValue.split(",");
for(var j=0;j<_47.length;++j){
var _49=_47[j].split("/");
if(_49.length==3){
var _4a=setISODate(_49[0]);
var _4b=setISODate(_49[1]);
var _4c=_49[2];
var _4d=_4c.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_4d.length;++i){
if(!_4d[i]){
_4d[i]=0;
}
}
do{
var _4e=createElementWithNS(_42.doc,"Timestamp",mbNsUrl);
_4e.appendChild(_42.doc.createTextNode(getISODate(_4a)));
_42.timestampList.appendChild(_4e);
_4a.setFullYear(_4a.getFullYear()+parseInt(_4d[2],10));
_4a.setMonth(_4a.getMonth()+parseInt(_4d[4],10));
_4a.setDate(_4a.getDate()+parseInt(_4d[6],10));
_4a.setHours(_4a.getHours()+parseInt(_4d[8],10));
_4a.setMinutes(_4a.getMinutes()+parseInt(_4d[10],10));
_4a.setSeconds(_4a.getSeconds()+parseFloat(_4d[12]));
}while(_4a.getTime()<=_4b.getTime());
}else{
var _4e=createElementWithNS(_42.doc,"Timestamp",mbNsUrl);
_4e.appendChild(_42.doc.createTextNode(_47[j]));
_42.timestampList.appendChild(_4e);
}
}
_42.setExtension(_42.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.getCurrentTimestamp=function(_4f){
var _50=this.getParam("timestamp");
return this.timestampList.childNodes[_50].firstChild.nodeValue;
};
this.setOpacity=function(_51,_52){
var _53=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_51+"']");
if(_53){
_53.setAttribute("opacity",_52);
}
this.callListeners("opacity",_51);
};
this.getOpacity=function(_54){
var _55=1;
var _56=this.doc.selectSingleNode("/wmc:ViewContext/wmc:LayerList/wmc:Layer[wmc:Name='"+_54+"']");
if(_56){
_55=_56.getAttribute("opacity");
}
return _55;
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
case "EPSG:9804":
this.Init=minit;
this.Forward=ll2m;
this.Inverse=m2ll;
this.Init(new Array(wgs84[0],wgs84[1],0,0,0,0));
this.units="meters";
this.title="Mercator";
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
case "EPSG:28992":
this.title="Amersfoort / RD New";
this.Init=stint;
this.Forward=ll2st;
this.Inverse=st2ll;
this.Init(new Array(6377397.155,5.38763888888889,52.15616055555555,155000,463000));
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
case "EPSG:31294":
case "EPSG:31284":
this.Init=tminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(6377397.155,6356078.963,1,10.3333333333,0,150000,0));
this.units="meters";
this.title="MGI / M28";
break;
case "EPSG:31295":
case "EPSG:31285":
this.Init=tminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(6377397.155,6356078.963,1,13.3333333333,0,450000,0));
this.units="meters";
this.title="MGI / M31";
break;
case "EPSG:31296":
case "EPSG:31286":
this.Init=tminit;
this.Forward=ll2tm;
this.Inverse=tm2ll;
this.Init(new Array(6377397.155,6356078.963,1,16.3333333333,0,750000,0));
this.units="meters";
this.title="MGI / M34";
break;
case "EPSG:31297":
case "EPSG:31287":
this.Init=lccinit;
this.Forward=ll2lcc;
this.Inverse=lcc2ll;
this.Init(new Array(6377397.155,6356078.963,49,46,13.3333333333,47.5,400000,400000));
this.units="meters";
this.title="MGI / Austria Lambert";
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
alert(mbGetMessage("unsupportedMapProjection",this.srs));
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
alert(mbGetMessage("ll2sceneNotDefined"));
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
alert(mbGetMessage("ll2pixelNotDefined"));
return null;
}
function pixel2ll(_16){
alert(mbGetMessage("pixel2llNotDefined"));
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
alert(mbGetMessage("lccinitEqualLatitudes"));
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
alert(mbGetMessage("llInputOutOfRange",lon,lat));
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
alert(mbGetMessage("ll2lccNoProjection"));
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
alert(mbGetMessage("ll2tmInfiniteProjection"));
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
alert(mbGetMessage("tm2llNoConvergence"));
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
alert(mbGetMessage("phi2zNoConvergence"));
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
function stint(_8a){
this.r_major=_8a[0];
this.lon_center=_8a[1]*D2R;
this.lat_center=_8a[2]*D2R;
this.false_easting=_8a[3];
this.false_northing=_8a[4];
this.sin_p10=Math.sin(this.lat_center);
this.cos_p10=Math.cos(this.lat_center);
}
function ll2st(_8b){
var lon=_8b[0];
var lat=_8b[1];
var ksp;
if(lat<=90&&lat>=-90&&lon<=180&&lon>=-180){
lat*=D2R;
lon*=D2R;
}else{
alert(mbGetMessage("llInputOutOfRange",lon,lat));
return null;
}
var _8f=adjust_lon(lon-this.lon_center);
var _90=Math.sin(lat);
var _91=Math.cos(lat);
var _92=Math.cos(_8f);
var g=this.sin_p10*_90+this.cos_p10*_91*_92;
if(Math.abs(g+1)<=EPSLN){
alert(mbGetMessage("ll2stInfiniteProjection"));
return null;
}else{
ksp=2/(1+g);
var x=this.false_easting+this.r_major*ksp*_91*Math.sin(_8f);
var y=this.false_northing+this.r_major*ksp*(this.cos_p10*_90-this.sin_p10*_91*_92);
return new Array(x,y);
}
}
function st2ll(_96){
var x=(_96[0]-this.false_easting);
var y=(_96[1]-this.false_northing);
var rh=Math.sqrt(x*x+y*y);
var z=2*Math.atan(rh/(2*this.r_major));
var _9b=Math.sin(z);
var _9c=Math.cos(z);
var lat;
var lon=this.lon_center;
if(Math.abs(rh)<=EPSLN){
lat=this.lat_center;
}else{
lat=Math.asin(_9c*this.sin_p10+(y*_9b*this.cos_p10)/rh);
var con=Math.abs(this.lat_center)-HALF_PI;
if(Math.abs(con)<=EPSLN){
if(this.lat_center>=0){
lon=adjust_lon(lon_center+atan2(x,-y));
}else{
lon=adjust_lon(lon_center-atan2(-x,y));
}
}else{
con=_9c-this.sin_p10*Math.sin(lat);
if((Math.abs(con)<EPSLN)&&(Math.abs(x)<EPSLN)){
}else{
lon=adjust_lon(this.lon_center+Math.atan2((x*_9b*this.cos_p10),(con*rh)));
}
}
}
return new Array(R2D*lon,R2D*lat);
}
function minit(_a0){
this.r_major=_a0[0];
this.r_minor=_a0[1];
this.lon_center=_a0[2];
this.lat_origin=_a0[3];
this.false_northing=_a0[4];
this.false_easting=_a0[5];
this.temp=this.r_minor/this.r_major;
this.es=1-Math.sqrt(this.temp);
this.e=Math.sqrt(this.es);
this.m1=Math.cos(this.lat_origin)/(Math.sqrt(1-this.es*Math.sin(this.lat_origin)*Math.sin(this.lat_origin)));
}
function ll2m(_a1){
var lon=_a1[0];
var lat=_a1[1];
if(lat<=90&&lat>=-90&&lon<=180&&lon>=-180){
lat*=D2R;
lon*=D2R;
}else{
alert(mbGetMessage("llInputOutOfRange",lon,lat));
return null;
}
if(Math.abs(Math.abs(lat)-HALF_PI)<=EPSLN){
alert(mbGetMessage("ll2mAtPoles"));
return null;
}else{
var _a4=Math.sin(lat);
var ts=tsfnz(this.e,lat,_a4);
var x=this.false_easting+this.r_major*this.m1*adjust_lon(lon-this.lon_center);
var y=this.false_northing-this.r_major*this.m1*Math.log(ts);
}
return new Array(x,y);
}
function m2ll(_a8){
var x=_a8[0];
var y=_a8[1];
x-=this.false_easting;
y-=this.false_northing;
var ts=Math.exp(-y/(this.r_major*this.m1));
var lat=phi2z(this.e,ts);
if(lat==-9999){
alert("lat = -9999");
return null;
}
var lon=adjust_lon(this.lon_center+x/(this.r_major*this.m1));
return new Array(R2D*lon,R2D*lat);
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

function Config(_1){
this.doc=Sarissa.getDomDocument();
this.doc.async=false;
this.doc.validateOnParse=false;
this.doc.load(_1);
if(Sarissa.getParseErrorText(this.doc)!=Sarissa.PARSED_OK){
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
if(Sarissa.getParseErrorText(_2)!=Sarissa.PARSED_OK){
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
this.defaultLang="en";
this.lang=this.defaultLang;
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
function loadWidgetText(_9,_a,_b){
var _c;
if(_b){
var _d=_a+"/"+_9.lang+"/"+_b.firstChild.nodeValue;
_c=Sarissa.getDomDocument();
_c.async=false;
_c.validateOnParse=false;
_c.load(_d);
if(Sarissa.getParseErrorText(_c)!=Sarissa.PARSED_OK){
var _e="Error loading widgetText document: "+_d;
if(_9.lang==_9.defaultLang){
alert(_e);
}else{
alert(_e+"\nFalling back on default language=\""+_9.defaultLang+"\"");
_9.lang=_9.defaultLang;
_d=_a+"/"+_9.lang+"/"+_b.firstChild.nodeValue;
_c.load(_d);
if(Sarissa.getParseErrorText(_c)!=Sarissa.PARSED_OK){
alert("Falling back on default language failed!");
}
}
}
_c.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_c,_9.namespace);
}
return _c;
}
this.widgetText=loadWidgetText(this,this.skinDir,_6.selectSingleNode("mb:widgetTextUrl"));
userWidgetTextDir=_6.selectSingleNode("mb:userWidgetTextDir");
if(userWidgetTextDir){
var _f=loadWidgetText(this,userWidgetTextDir.firstChild.nodeValue,_6.selectSingleNode("mb:userWidgetTextUrl"));
if(_f){
var _10=_f.selectSingleNode("/mb:WidgetText/mb:widgets");
var _11=this.widgetText.selectSingleNode("/mb:WidgetText/mb:widgets");
if(_10&&_11){
Sarissa.copyChildNodes(_10,_11,true);
}
var _12=_f.selectSingleNode("/mb:WidgetText/mb:messages");
var _13=this.widgetText.selectSingleNode("/mb:WidgetText/mb:messages");
if(_12&&_13){
Sarissa.copyChildNodes(_12,_13,true);
}
}
}
this.objects=new Object();
ModelBase.apply(this,new Array(_6));
this.loadModel=function(_14,_15){
var _16=this.objects[_14];
if(_16&&_15){
var _17=new Object();
_17.method=_16.method;
_17.url=_15;
_16.newRequest(_16,_17);
}else{
alert(mbGetMessage("errorLoadingModel",_14,_15));
}
};
this.paintWidget=function(_18){
if(_18){
_18.paint(_18,_18.id);
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
this.getBaseLayerService=function(){
x=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[last()]/wmc:Server");
s=x.getAttribute("service");
return s;
};
this.initBbox=function(_11){
if(window.cgiArgs["bbox"]){
var _12=window.cgiArgs["bbox"].split(",");
_11.setBoundingBox(_12);
_11.map.zoomToExtent(new OpenLayers.Bounds(_12[0],_12[1],_12[2],_12[3]));
_11.setBoundingBox(_11.map.getExtent().toBBOX().split(","));
}
};
this.addFirstListener("loadModel",this.initBbox,this);
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
srs=srs?srs:"EPSG:4326";
return srs;
}
};
this.initProj=function(_18){
_18.proj=new Proj(_18.getSRS());
};
this.addFirstListener("loadModel",this.initProj,this);
this.getWindowWidth=function(){
if(this.doc){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
width=win.getAttribute("width");
return width;
}
};
this.setWindowWidth=function(_1a){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
win.setAttribute("width",_1a);
this.callListeners("resize");
};
this.getWindowHeight=function(){
if(this.doc){
var win=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Window");
height=win.getAttribute("height");
return height;
}
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
alert(mbGetMessage("featureNotFoundOwsContext"));
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
listNodeArray=this.doc.selectNodes("//wmc:Layer|//wmc:FeatureType");
return listNodeArray;
};
this.getLayer=function(_34){
var _35=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:Layer[wmc:Name='"+_34+"']");
if(_35==null){
_35=this.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList/wmc:RssLayer[@id='"+_34+"']");
}
return _35;
};
this.addLayer=function(_36,_37){
if(_36.doc!=null){
var _38=_36.doc.selectSingleNode("/wmc:OWSContext/wmc:ResourceList");
var id=_37.getAttribute("id");
var str="/wmc:OWSContext/wmc:ResourceList/"+_37.nodeName+"[@id='"+id+"']";
var _3b=_36.doc.selectSingleNode(str);
if(_3b!=null){
_38.removeChild(_3b);
}
_38.appendChild(_37.cloneNode(true));
_36.modified=true;
}else{
alert(mbGetMessage("nullOwsContext"));
}
};
this.addFirstListener("addLayer",this.addLayer,this);
this.deleteLayer=function(_3c,_3d){
var _3e=_3c.getLayer(_3d);
if(!_3e){
alert(mbGetMessage("nodeNotFound",_3d));
return;
}
_3e.parentNode.removeChild(_3e);
_3c.modified=true;
};
this.addFirstListener("deleteLayer",this.deleteLayer,this);
this.moveLayerUp=function(_3f,_40){
var _41=_3f.getLayer(_40);
var _42=_41.selectSingleNode("following-sibling::*");
if(!_42){
alert(mbGetMessage("cantMoveUp",_40));
return;
}
_41.parentNode.insertBefore(_42,_41);
_3f.modified=true;
};
this.addFirstListener("moveLayerUp",this.moveLayerUp,this);
this.moveLayerDown=function(_43,_44){
var _45=_43.getLayer(_44);
var _46=_45.selectNodes("preceding-sibling::*");
var _47=_46[_46.length-1];
if(!_47){
alert(mbGetMessage("cantMoveDown",_44));
return;
}
_45.parentNode.insertBefore(_45,_47);
_43.modified=true;
};
this.addFirstListener("moveLayerDown",this.moveLayerDown,this);
this.setExtension=function(_48){
var _49=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
if(!_49){
var _4a=this.doc.selectSingleNode("/wmc:OWSContext/wmc:General");
var _4b=createElementWithNS(this.doc,"Extension","http://www.opengis.net/context");
_49=_4a.appendChild(_4b);
}
return _49.appendChild(_48);
};
this.getExtension=function(){
return this.doc.selectSingleNode("/wmc:OWSContext/wmc:General/wmc:Extension");
};
this.initTimeExtent=function(_4c){
var _4d=_4c.doc.selectNodes("//wmc:Dimension[@name='time']");
for(var i=0;i<_4d.length;++i){
var _4f=_4d[i];
_4c.timestampList=createElementWithNS(_4c.doc,"TimestampList",mbNsUrl);
var _50=_4f.parentNode.parentNode.selectSingleNode("wmc:Name").firstChild.nodeValue;
_4c.timestampList.setAttribute("layerName",_50);
var _51=_4f.firstChild.nodeValue.split(",");
for(var j=0;j<_51.length;++j){
var _53=_51[j].split("/");
if(_53.length==3){
var _54=setISODate(_53[0]);
var _55=setISODate(_53[1]);
var _56=_53[2];
var _57=_56.match(/^P((\d*)Y)?((\d*)M)?((\d*)D)?T?((\d*)H)?((\d*)M)?((.*)S)?/);
for(var i=1;i<_57.length;++i){
if(!_57[i]){
_57[i]=0;
}
}
do{
var _58=createElementWithNS(_4c.doc,"Timestamp",mbNsUrl);
_58.appendChild(_4c.doc.createTextNode(getISODate(_54)));
_4c.timestampList.appendChild(_58);
_54.setFullYear(_54.getFullYear()+parseInt(_57[2],10));
_54.setMonth(_54.getMonth()+parseInt(_57[4],10));
_54.setDate(_54.getDate()+parseInt(_57[6],10));
_54.setHours(_54.getHours()+parseInt(_57[8],10));
_54.setMinutes(_54.getMinutes()+parseInt(_57[10],10));
_54.setSeconds(_54.getSeconds()+parseFloat(_57[12]));
}while(_54.getTime()<=_55.getTime());
}else{
var _58=createElementWithNS(_4c.doc,"Timestamp",mbNsUrl);
_58.appendChild(_4c.doc.createTextNode(_51[j]));
_4c.timestampList.appendChild(_58);
}
}
_4c.setExtension(_4c.timestampList);
}
};
this.addFirstListener("loadModel",this.initTimeExtent,this);
this.getCurrentTimestamp=function(_59){
var _5a=this.getParam("timestamp");
return this.timestampList.childNodes[_5a].firstChild.nodeValue;
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

function StyledLayerDescriptor(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:sld='http://www.opengis.net/sld' xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:wms='http://www.opengis.net/wms' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:ogc='http://www.opengis.net/ogc' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:wfs='http://www.opengis.net/wfs'";
this.getSldNode=function(){
return this.doc.selectSingleNode("/StyledLayerDescriptor");
};
}

mapbuilder.loadScript(baseDir+"/model/ModelBase.js");
function Transaction(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
this.namespace="xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
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
this.doc.setProperty("SelectionLanguage","XPath");
if(this.namespace){
Sarissa.setXpathNamespaces(this.doc,this.namespace);
}
if(this.debug){
mbDebugMessage(this,"Loading Model:"+this.id+" "+Sarissa.serialize(this.doc));
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
_1f.setProperty("SelectionLanguage","XPath");
Sarissa.setXpathNamespaces(_1f,"xmlns:xlink='http://www.w3.org/1999/xlink'");
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
return this.doc.selectSingleNode(this.nodeSelectXpath+"[Name='"+_10+"']");
};
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
return _20?_20.firstChild.nodeValue:mbGetMessage("noRssTitle");
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
alert(mbGetMessage("invalidGeom",Sarissa.serialize(_25)));
}
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

mapbuilder.loadScript(baseDir+"/model/FeatureCollection.js");
function OwsCatResources(_1,_2){
FeatureCollection.apply(this,new Array(_1,_2));
this.namespace="xmlns:owscat='http://www.ec.gc.ca/owscat' xmlns:gml='http://www.opengis.net/gml' xmlns:wfs='http://www.opengis.net/wfs'";
}
OwsCatResources.prototype.getFeatureNode=function(_3){
return this.doc.selectSingleNode(this.nodeSelectXpath+"[owscat:name='"+_3+"']");
};

function Model(_1,_2){
ModelBase.apply(this,new Array(_1,_2));
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
alert(mbGetMessage("unsupportedGmlGeom",this.gmlType));
}
}
}
}
}else{
this.coords=null;
var _16=this.layerNode.attributes.getNamedItem("id");
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
var re=RegExp("[, \n\t]+","g");
var _24=this.coords.split(re);
_24=_22.Forward(_24);
var _25=this.model.extent.getPL(_24);
this.shape=sld.paintPoint(this.gr,_25);
if(this.shape!=null){
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
}
}
};
this.paintPolygon=function(sld,_27){
if(_27){
sld.hilitePolygon(this.gr,this.shape);
}else{
if(this.coords!=null){
var _28=new Proj(this.model.getSRS());
var re=RegExp("[, \n\t]+","g");
var _2a=this.coords.split(re);
var _2b=new Array(_2a.length/2);
var _2c=new Array(2);
var _2d;
var jj=0;
for(var i=0;i<_2a.length;i++){
_2c[0]=_2a[i];
_2c[1]=_2a[i+1];
_2d=_28.Forward(_2c);
_2d=this.model.extent.getPL(_2d);
_2b[jj]=_2d;
jj++;
i++;
}
this.shape=sld.paintPolygon(this.gr,_2b);
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
}
};
this.paintLine=function(sld,_31){
if(_31){
sld.hiliteLine(this.gr,this.shape);
}else{
var _32=new Proj(this.model.getSRS());
var re=RegExp("[, \n\t]+","g");
var _34=this.coords.split(re);
var _35=new Array(_34.length/2);
var _36=new Array(2);
var _37;
var jj=0;
for(var i=0;i<_34.length;i++){
_36[0]=_34[i];
_36[1]=_34[i+1];
_37=_32.Forward(_36);
_37=this.model.extent.getPL(_37);
_35[jj]=_37;
jj++;
i++;
}
this.shape=sld.paintLine(this.gr,_35);
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
};
this.getDiv=function(_3a){
var _3b=document.getElementById(this.mapPane.outputNodeId).parentNode;
var div=document.getElementById("vector_elements");
if(div==null){
div=document.createElement("div");
div.setAttribute("id","vector_elements");
div.style.position="absolute";
div.style.visibility="visible";
div.style.zIndex=600;
_3b.appendChild(div);
}
div.style.top=0;
div.style.left=0;
return div;
};
this.paint=function(){
this.paint(null,null);
};
this.paint=function(_3d,img){
this.deleteShape();
this.paintShape(this.normalSld,false);
};
this.deleteShape=function(){
var id=this.id+"_vector";
var _40=document.getElementById(id);
if(_40!=null){
_40.parentNode.removeChild(_40);
_40=document.getElementById(id);
if(_40!=null){
alert(mbGetMessage("deleteShapeFailed",id));
}
}
};
this.unpaint=function(){
this.deleteShape();
};
this.paintShape=function(sld,_42){
if(this.gmlType=="gml:Point"){
this.paintPoint(sld,_42);
}else{
if(this.gmlType=="gml:LineString"){
this.paintLine(sld,_42);
}else{
if(this.gmlType=="gml:Polygon"||this.gmlType=="gml:Envelope"||this.gmlType=="gml:Box"){
this.paintPolygon(sld,_42);
}
}
}
};
this.install=function(_43){
_43.onmouseover=this.mouseOverHandler;
_43.onmouseout=this.mouseOutHandler;
_43.onclick=this.mouseClickHandler;
};
this.mouseOverHandler=function(ev){
var _45=document.getElementById("mainMapContainer");
if(_45){
_45.oldEventHandler=_45.onmouseup;
_45.onmouseup=null;
_45.onmousedown=null;
}
this.style.cursor="help";
return true;
};
this.mouseOutHandler=function(ev){
this.style.cursor="default";
var _47=document.getElementById("mainMapContainer");
if(_47){
_47.onmouseup=_47.oldEventHandler;
_47.onmousedown=_47.oldEventHandler;
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
this.clickIt=function(_49,_4a){
if(_4a.indexOf(_49.id)>=0){
var _4b=0;
var _4c=0;
var cn=window.cursorTrackNode;
if(cn){
var _4e=cn.evpl;
if(_4e!=null){
_4b=_4e[0];
_4c=_4e[1];
var _4f=_49.myabstract;
if(_4f==undefined){
_4f=mbGetMessage("featureUnderConstruction");
}
}
}
if(_4b>0&&_4b<_49.width&&_4c>0&&_4c<_49.height){
toolTipObjs[_49.tooltip].paint(new Array(_4b,_4c,_4a,_49.title,_4f));
}
}
};
this.highlight=function(_50,_51){
if(_51.indexOf(_50.id)>=0){
_50.paintShape(_50.hiliteSld,true);
var _52=0;
var _53=0;
var cn=window.cursorTrackNode;
if(cn){
var _55=cn.evpl;
if(_55!=null){
_52=_55[0];
_53=_55[1];
var _56=_50.myabstract;
if(_56==undefined){
_56=mbGetMessage("featureUnderConstruction");
}
}
}
if(_52>0&&_52<_50.width&&_53>0&&_53<_50.height){
toolTipObjs[_50.tooltip].paint(new Array(_52,_53,_51,_50.title,_56));
}
}
};
this.dehighlight=function(_57,_58){
if(_58.indexOf(_57.id)>=0){
_57.paintShape(_57.normalSld,true);
toolTipObjs[_57.tooltip].clear();
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

function VMLGraphics2(id,_2,_3,_4){
this.div=_2;
this.width=_3;
this.height=height;
return this;
}
VMLGraphics2.prototype.getGroupTag=function(_5,id){
tag=document.getElementById(id);
if(!tag){
tag=document.createElement("div");
tag.setAttribute("id",id);
if(!_5){
_5=this.div;
}
_5.appendChild(tag);
}
return tag;
};
VMLGraphics2.prototype.setStrokeColor=function(x){
this.strokeStyle=x;
};
VMLGraphics2.prototype.setStrokeWidth=function(x){
this.strokeWeight=x;
};
VMLGraphics2.prototype.setFillColor=function(x){
this.fillStyle=x;
this.strokeStyle=x;
};
VMLGraphics2.prototype.setShapeStrokeColor=function(_a,x){
_a.setAttribute("strokecolor",x);
};
VMLGraphics2.prototype.setShapeStrokeWidth=function(_c,x){
_c.setAttribute("strokeweight",x);
};
VMLGraphics2.prototype.setShapeFillColor=function(_e,x){
_e.setAttribute("fillcolor",x);
};
VMLGraphics2.prototype.setShapeFill=function(_10,x){
if(x=="none"){
_10.setAttribute("filled",false);
}else{
_10.setAttribute("filled",true);
}
};
VMLGraphics2.prototype.drawPolyline=function(_12,_13,_14){
var _15=_12.length;
var _16=_12[0]+","+_13[0];
for(var i=1;i<_15;i++){
_16+=","+_12[i]+","+_13[i];
}
var _18=document.createElement("vml:polyline");
_18.style.position="absolute";
_18.style.width=""+this.width;
_18.style.height=""+this.height;
_18.filled="false";
_18.strokecolor="#FF0000";
_18.strokeweight="1";
_18.points=_16;
_14.appendChild(_18);
return _18;
};
VMLGraphics2.prototype.drawPolygon=function(_19,_1a,_1b){
return this.drawPolyline(_19,_1a,_1b);
};
VMLGraphics2.prototype.fillPolygon=function(_1c,_1d){
var _1e=this.drawPolygon(_1c,_1d);
_1e.filled="true";
return _1e;
};
VMLGraphics2.prototype.drawCircle=function(X,Y,_21){
alert("VMLGraphics2.drawCircle");
var _22=_21*2;
var _23=document.createElement("vml:oval");
var _24=X-_21;
var _25=Y-_21;
_23.style.position="relative";
_23.style.left=_24;
_23.style.top=_25;
_23.style.width="6";
_23.style.height="6";
_23.strokecolor=this.strokeStyle;
_23.strokeweigth="1pt";
this.div.appendChild(_23);
return _23;
};
VMLGraphics2.prototype.fillCircle=function(X,Y,_28){
var _29=_28*2;
var _2a=document.createElement("vml:oval");
var _2b=X-_28;
var _2c=Y-_28;
_2a.style.position="relative";
_2a.style.left=_2b;
_2a.style.top=_2c;
_2a.style.width=_29;
_2a.style.height=_29;
_2a.fillcolor="#00FF00";
_2a.strokecolor="#00FF00";
this.div.appendChild(_2a);
return _2a;
};
VMLGraphics2.prototype.drawImage=function(src,X,Y,_30,_31,dx,dy){
var _34=X-dx;
var _35=Y-dy;
var _36=document.createElement("vml:rect");
_36.style.position="absolute";
_36.style.left=_34;
_36.style.top=_35;
if(_30!=null){
_36.style.width=_30;
}
if(_31!=null){
_36.style.height=_31;
}
_36.filled="false";
_36.stroked="false";
var _37=document.createElement("vml:imagedata");
_37.src=src;
_36.appendChild(_37);
this.div.appendChild(_36);
return _36;
};
VMLGraphics2.prototype.swapImage=function(_38,src){
var _3a=_38.firstChild;
_3a.src=src;
};
VMLGraphics2.prototype.paint=function(){
};

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
_19.setAttribute("src",config.skinDir+"/images/Loading.gif");
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
var _1f=mbGetMessage((this.objRef.layerCount>1)?"loadingLayers":"loadingLayer",this.objRef.layerCount);
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

mapbuilder.loadScript(baseDir+"/graphics/WmsLayer.js");
function MapLayerMgr(_1,_2){
this.layers=new Array();
this.mapPane=_1;
this.model=_2;
this.id="MapLayerMgr";
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
alert(mbGetMessage("layerNotFound",_9));
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
if(_18.indexOf("FeatureType")>=0){
var _19=_16.selectSingleNode("wmc:Name").firstChild.nodeValue;
if(_15.getLayer(_19)==null){
_17=new WfsQueryLayer(_15.model.model,_15.mapPane,_19,_16,false,true);
_15.layers.push(_17);
}
}else{
alert(mbGetMessage("errorAddingLayer",_18,service));
}
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
for(var i=0;i<this.layers.length;i++){
if(this.layers[i].layerName==_28){
return this.layers[i];
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

function SldRenderer(_1){
this.style=_1;
}
SldRenderer.prototype.paint=function(gr,_3,_4,_5){
switch(_5){
case "gml:Point":
shape=this.paintPoint(gr,_3[0],_4);
break;
case "gml:LineString":
shape=this.paintLine(gr,_3,_4);
break;
case "gml:Polygon":
case "gml:LinearRing":
case "gml:Box":
case "gml:Envelope":
shape=this.paintPolygon(gr,_3,_4);
break;
}
};
SldRenderer.prototype.paintPoint=function(gr,_7,_8){
radius=2;
shape=gr.fillCircle(_7[0],_7[1],radius,_8);
return shape;
};
SldRenderer.prototype.paintLine=function(gr,_a,_b){
var _c=new Array(_a.length);
var _d=new Array(_a.length);
for(var i=0;i<_a.length;i++){
point=_a[i];
_c[i]=parseInt(point[0]);
_d[i]=parseInt(point[1]);
}
this.getStyleAttributes("sld:LineSymbolizer");
var _f=gr.drawPolyline(_c,_d,_b);
return _f;
};
SldRenderer.prototype.paintPolygon=function(gr,_11,_12){
var _13=new Array(_11.length+1);
var _14=new Array(_11.length+1);
for(var i=0;i<_11.length;i++){
point=_11[i];
_13[i]=parseInt(point[0]);
_14[i]=parseInt(point[1]);
}
_13[i]=_13[0];
_14[i]=_14[0];
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
var _16=gr.drawPolygon(_13,_14,_12);
return _16;
};
SldRenderer.prototype.setStyle=function(gr,_18,_19){
this.getStyleAttributes("tbd");
gr.setShapeStrokeColor(_18,this.strokeColor);
gr.setShapeStrokeWidth(_18,this.strokeWidth);
gr.setShapeFillColor(_18,this.fillColor);
gr.setShapeFill(_18,this.fill);
};
SldRenderer.prototype.getStyleAttributes=function(_1a){
this.strokeColor="#ff0000";
this.strokeWidth="1";
this.fillColor="#00ff00";
this.fill="none";
if(this.style){
var _1b=this.style.selectSingleNode(_1a+"/sld:Stroke/sld:CssParameter[@name='stroke']");
if(_1b!=undefined){
this.strokeColor=_1b.firstChild.nodeValue;
}else{
this.strokeColor=null;
}
_1b=this.style.selectSingleNode(_1a+"/sld:Stroke/sld:CssParameter[@name='stroke-width']");
if(_1b!=undefined){
this.strokeWidth=_1b.firstChild.nodeValue;
}else{
this.strokeWidth=null;
}
_1b=this.style.selectSingleNode(_1a+"/sld:Fill/sld:CssParameter[@name='fill']");
if(_1b!=undefined){
this.fillColor=_1b.firstChild.nodeValue;
}else{
this.fillColor=null;
}
}
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
alert(mbGetMessage("notImplementedYet"));
}else{
if(_6=="POLY"){
alert(mbGetMessage("notImplementedYet"));
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
alert(mbGetMessage("noCanvasContext"));
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
_15=mbGetMessage("featureUnderConstruction");
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
this.strokeColor="#ff0000";
this.strokeWidth="1";
this.fillColor="#00ff00";
if(this.style){
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
}
};

mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/StyledLayerDescriptor.js");
mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");
mapbuilder.loadScript(baseDir+"/widget/TipWidget.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function WfsQueryLayer(_1,_2,_3,_4,_5,_6){
MapLayer.apply(this,new Array(_1,_2,_3,_4,_5,_6));
this.id="WfsQueryLayer";
this.model=_1;
this.uuid=_4.getAttribute("id");
this.featureCount=0;
this.parse=function(){
var _7="xmlns:wmc='http://www.opengis.net/context' xmlns:ows='http://www.opengis.net/ows' xmlns:sld='http://www.opengis.net/sld' xmlns:xlink='http://www.w3.org/1999/xlink'";
var _8=this.layerNode.ownerDocument;
Sarissa.setXpathNamespaces(_8,_7);
var _9=this.layerNode.selectSingleNode("wmc:StyleList");
if(_9==null){
alert(mbGetMessage("styleNodeNotFound"));
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
var re=RegExp("[, \n\t]+","g");
var _10=this.coords.split(re);
_10=_e.Forward(_10);
var _11=this.model.containerModel.extent.getPL(_10);
this.shape=_c.paintPoint(this.gr,_11);
if(this.shape!=null){
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
}
}
};
this.paintPolygon=function(sld,_13){
if(_13){
sld.hilitePolygon(this.gr,this.shape);
}else{
if(this.coords!=null){
var _14=new Proj(this.model.containerModel.getSRS());
var re=RegExp("[, \n\t]+","g");
var _16=this.coords.split(re);
var _17=new Array(_16.length/2);
var _18=new Array(2);
var _19;
var jj=0;
for(var i=0;i<_16.length;i++){
_18[0]=_16[i];
_18[1]=_16[i+1];
_19=_14.Forward(_18);
_19=this.model.containerModel.extent.getPL(_19);
_17[jj]=_19;
jj++;
i++;
}
this.shape=sld.paintPolygon(this.gr,_17);
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
}
};
this.paintLine=function(sld,_1d){
if(_1d){
sld.hiliteLine(this.gr,this.shape);
}else{
var _1e=new Proj(this.model.containerModel.getSRS());
var re=RegExp("[, \n\t]+","g");
var _20=this.coords.split(re);
var _21=new Array(_20.length/2);
var _22=new Array(2);
var _23;
var jj=0;
for(var i=0;i<_20.length;i++){
_22[0]=_20[i];
_22[1]=_20[i+1];
_23=_1e.Forward(_22);
_23=this.model.extent.containerModel.getPL(_23);
_21[jj]=_23;
jj++;
i++;
}
this.shape=sld.paintLine(this.gr,_21);
this.shape.id=this.id+"_vector";
this.gr.paint();
this.install(this.shape);
}
};
this.getDiv=function(_26){
var _27=document.getElementById(this.mapPane.outputNodeId).parentNode;
var div=document.getElementById("vector_elements");
if(div==null){
div=document.createElement("div");
div.setAttribute("id","vector_elements");
div.style.position="absolute";
div.style.visibility="visible";
div.style.zIndex=600;
_27.appendChild(div);
}
div.style.top=0;
div.style.left=0;
return div;
};
this.paint=function(){
this.paint(null,null);
};
this.paint=function(_29,img){
this.deletePreviousFeatures();
var _2b=this.model.getFeatureNodes();
for(var i=0;i<_2b.length;i++){
featureNode=_2b[i];
type=this.model.getFeatureGeometry(featureNode);
if(type!=undefined){
this.gmlType=type.nodeName;
if(this.gmlType=="gml:Point"){
var pos=type.firstChild;
this.coords=pos.firstChild.nodeValue;
}else{
if(this.gmlType=="gml:LineString"){
var _2e=type.firstChild;
var _2f=_2e.childNodes;
var _30=_2f.length;
this.coords="";
for(var j=0;j<_30;j++){
this.coords+=_2f[j].nodeValue;
}
}else{
if(this.gmlType=="gml:Polygon"){
this.coords=null;
var ext=type.firstChild;
var _33=ext.firstChild;
if(_33.firstChild){
this.posList=_33.firstChild;
this.coords=this.posList.firstChild.nodeValue;
}
}else{
if(this.gmlType=="gml:Box"||this.gmlType=="gml:Envelope"){
var _2e=type.firstChild;
var _2f=_2e.childNodes;
var _30=_2f.length;
this.coords="";
var c=new Array();
c=_2f[0].nodeValue.split(" ");
this.coords+=c[0]+" "+c[1]+",\n"+c[2]+" "+c[1]+",\n"+c[2]+" "+c[3]+",\n"+c[0]+" "+c[3]+",\n"+c[0]+" "+c[1];
}else{
alert(mbGetMessage("unsupportedGmlGeom",this.gmlType));
}
}
}
}
}
this.id="wfs_"+this.uuid+"_"+i;
this.paintShape(this.normalSld,false);
}
this.featureCount=_2b.length;
};
this.deleteShape=function(){
var id=this.id+"_vector";
var _36=document.getElementById(id);
while(_36!=null){
var _37=_36.parentNode;
_37.removeChild(_36);
_36=document.getElementById(id);
}
};
this.deletePreviousFeatures=function(){
for(var i=0;i<this.featureCount;i++){
this.id="wfs_"+this.uuid+"_"+i;
this.deleteShape();
}
};
this.unpaint=function(){
var _39=this.model.getFeatureNodes();
for(var i=0;i<_39.length;i++){
this.id="wfs_"+this.uuid+"_"+i;
this.deleteShape();
}
};
this.paintShape=function(sld,_3c){
if(this.gmlType=="gml:Point"){
this.paintPoint(sld,_3c);
}else{
if(this.gmlType=="gml:LineString"){
this.paintLine(sld,_3c);
}else{
if(this.gmlType=="gml:Polygon"||this.gmlType=="gml:Envelope"||this.gmlType=="gml:Box"){
this.paintPolygon(sld,_3c);
}
}
}
};
this.install=function(_3d){
_3d.onmouseover=this.mouseOverHandler;
_3d.onmouseout=this.mouseOutHandler;
_3d.onmouseup=this.mouseClickHandler;
_3d.model=this.model.id;
};
this.mouseOverHandler=function(ev){
var _3f=this.getAttribute("id").split("_");
var id=_3f[2];
var _41=document.getElementById("mainMapContainer");
if(_41){
_41.oldEventHandler=_41.onmouseup;
_41.onmouseup=null;
_41.onmousedown=null;
}
this.style.cursor="help";
return true;
};
this.mouseOutHandler=function(ev){
this.style.cursor="default";
var _43=this.getAttribute("id").split("_");
var id=_43[2];
var _45=document.getElementById("mainMapContainer");
if(_45){
_45.onmouseup=_45.oldEventHandler;
_45.onmousedown=_45.oldEventHandler;
}
this.style.cursor="default";
return true;
};
this.mouseClickHandler=function(ev){
var _47=this.getAttribute("id").split("_");
var id=_47[2];
config.objects[this.model].setParam("clickFeature",id);
return true;
};
this.clickIt=function(_49,_4a){
var _4b=_49.model.getFeatureNodes();
var _4c=_4b[_4a];
toolTipObjs[_49.tooltip].paintXSL(_4c);
};
this.highlight=function(_4d,_4e){
_4d.paintShape(_4d.hiliteSld,true);
var _4f=_4d.model.getFeatureNodes();
var _50=_4f[_4e];
toolTipObjs[_4d.tooltip].paintXSL(_50);
};
this.dehighlight=function(_51,_52){
_51.paintShape(_51.normalSld,true);
toolTipObjs[_51.tooltip].clear();
};
this.parse();
this.width=null;
this.height=null;
var div=this.getDiv();
this.gr=new VectorGraphics(this.id,div,this.width,this.height);
config.objects[this.model.id].addListener("highlightFeature",this.highlight,this);
config.objects[this.model.id].addListener("dehighlightFeature",this.dehighlight,this);
config.objects[this.model.id].addListener("clickFeature",this.clickIt,this);
this.tooltip=config.objects[this.model.id].tipWidgetId;
}

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

var mac,win;
var opera,khtml,safari,mozilla,ie,ie50,ie55,ie60;
var canvasEnabled=false;
mapbuilder.loadScript(baseDir+"/util/sarissa/Sarissa.js");
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

mapbuilder.loadScript(baseDir+"/graphics/MapLayer.js");
mapbuilder.loadScript(baseDir+"/graphics/SldRenderer.js");
mapbuilder.loadScript(baseDir+"/graphics/VectorGraphics.js");
mapbuilder.loadScript(baseDir+"/widget/TipWidget.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");
function GmlLayer(_1,_2,_3,_4,_5,_6){
MapLayer.apply(this,new Array(_1,_2,_3,_4,_5,_6));
this.parse=function(){
namespace="xmlns:wmc='http://www.opengis.net/context' xmlns:sld='http://www.opengis.net/sld' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:gml='http://www.opengis.net/gml'";
Sarissa.setXpathNamespaces(this.layerNode,namespace);
this.id=this.model.id+"_"+this.mapPane.id+"_"+this.layerName;
var _7=this.layerNode.selectSingleNode("//wmc:StyleList");
if(_7){
var _8=_7.selectSingleNode("//wmc:Style[wmc:Name='Highlite']");
var _9=_7.selectSingleNode("//wmc:Style[wmc:Name='Normal']");
this.normalSld=new SldRenderer(_9);
this.hiliteSld=new SldRenderer(_8);
}else{
this.normalSld=new SldRenderer(null);
this.hiliteSld=new SldRenderer(null);
}
this.containerProj=new Proj(this.model.getSRS());
width=this.model.getWindowWidth();
height=this.model.getWindowHeight();
div=this.getDiv(this.id);
this.div=div;
this.gr=new VectorGraphics(this.id,div,width,height);
featureNodes=this.layerNode.selectNodes(".//gml:featureMember");
this.features=new Array();
for(k=0;k<featureNodes.length;k++){
this.features[k]=new Array();
this.features[k].node=featureNodes[k];
this.features[k].id=this.id+k;
this.features[k].geoCoords=this.getGeoCoords(featureNodes[k],k+1);
this.features[k].shapes=new Array();
this.features[k].sld=this.normalSld;
this.features[k].group=this.gr.getGroupTag(null,this.features[k].id+"_g");
this.normalSld.setStyle(this.gr,this.features[k].group);
}
if(featureNodes.length>0){
this.gmlType=featureNodes[0].selectSingleNode(".//gml:Point|.//gml:LineString|.//gml:Polygon|.//gml:LinearRing|.//gml:Box|.//gml:Envelope");
if(this.gmlType){
this.gmlType=this.gmlType.nodeName;
}else{
alert(mbGetMessage("unsupportedGmlGeomForLayer",this.id));
}
}
};
this.getGeoCoords=function(_a){
coordsNodes=_a.selectNodes(".//gml:pos|.//gml:posList|.//gml:coordinates");
points=new Array();
for(h=0;h<coordsNodes.length;h++){
points[h]=new Array();
dim=2;
if(coordsNodes[h]){
d=coordsNodes[h].selectSingleNode("@srsDimension");
if(d){
dim=parseInt(d.firstChild.nodeValue);
}
coords=coordsNodes[h].firstChild.nodeValue;
}
if(coords){
var re=RegExp("[, \n\t]+","g");
point=coords.split(re);
while(point[0]==""){
point.shift();
}
while(point[point.length-1]==""){
point.pop();
}
for(i=0,j=0;i<point.length;j++,i=i+dim){
points[h][j]=new Array(point[i],point[i+1]);
}
}
}
return points;
};
this.isWmsLayer=function(){
return false;
};
this.getDiv=function(_c,_d){
var _e=document.getElementById(this.mapPane.outputNodeId).parentNode;
var _f=document.getElementById(_c);
if(_f==null){
_f=document.createElement("div");
_f.setAttribute("id",_c);
_f.style.position="absolute";
_f.style.visibility="visible";
_f.style.zIndex=600;
_e.appendChild(_f);
}
_f.style.top=0;
_f.style.left=0;
return _f;
};
this.paint=function(){
this.paint(null,null);
};
this.paint=function(_10,img){
this.paintFeatures();
};
this.unpaint=function(){
};
this.paintFeatures=function(){
for(k=0;k<this.features.length;k++){
id1=this.features[k].id+"_g";
node=document.getElementById(id1);
for(i=0;node.childNodes.length>0;){
node.removeChild(node.childNodes[0]);
}
for(h=0;h<this.features[k].geoCoords.length;h++){
screenCoords=new Array();
for(c=0;c<this.features[k].geoCoords[h].length;c++){
reproj=this.containerProj.Forward(this.features[k].geoCoords[h][c]);
screenCoords[c]=this.model.extent.getPL(reproj);
}
this.features[k].shapes[h]=this.features[k].sld.paint(this.gr,screenCoords,this.features[k].group,this.gmlType);
}
}
};
this.parse();
this.paint();
}

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
_1a=mbGetMessage("featureUnderConstruction");
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

mapbuilder.loadScript(baseDir+"/util/Util.js");
function SVGGraphics2(id,_2,_3,_4){
var _5=document.getElementById(id+"svg");
if(_5==null){
_5=document.createElementNS("http://www.w3.org/2000/svg","svg");
_5.setAttribute("id",id+"svg");
_5.setAttribute("width",_3);
_5.setAttribute("height",_4);
if(_2!=null){
_2.appendChild(_5);
}
}
this.svg=_5;
return this;
}
SVGGraphics2.prototype.getGroupTag=function(_6,id){
tag=document.getElementById(id);
if(!tag){
tag=document.createElementNS("http://www.w3.org/2000/svg","g");
tag.setAttribute("id",id);
if(!_6){
_6=this.svg;
}
_6.appendChild(tag);
}
return tag;
};
SVGGraphics2.prototype.setStrokeColor=function(x){
};
SVGGraphics2.prototype.setStrokeWidth=function(x){
};
SVGGraphics2.prototype.setFillColor=function(x){
};
SVGGraphics2.prototype.setShapeStrokeColor=function(_b,x){
_b.setAttribute("stroke",x);
};
SVGGraphics2.prototype.setShapeStrokeWidth=function(_d,x){
_d.setAttribute("stroke-width",x);
};
SVGGraphics2.prototype.setShapeFillColor=function(_f,x){
_f.setAttribute("fillColor",x);
};
SVGGraphics2.prototype.setShapeFill=function(_11,x){
_11.setAttribute("fill",x);
};
SVGGraphics2.prototype.drawPolyline=function(_13,_14,_15){
var _16=_13.length;
var pts=_13[0]+","+_14[0];
for(var i=1;i<_16;i++){
pts+=","+_13[i]+","+_14[i];
}
var _19=document.createElementNS("http://www.w3.org/2000/svg","polyline");
_19.setAttribute("points",pts);
_15.appendChild(_19);
return _19;
};
SVGGraphics2.prototype.drawPolygon=function(_1a,_1b,_1c){
var _1d=this.drawPolyline(_1a,_1b,_1c);
return _1d;
};
SVGGraphics2.prototype.fillPolygon=function(_1e,_1f){
this.drawPolygon(_1e,_1f);
this.fill();
};
SVGGraphics2.prototype.drawCircle=function(X,Y,_22){
};
SVGGraphics2.prototype.fillCircle=function(X,Y,_25,_26){
var _27=document.createElementNS("http://www.w3.org/2000/svg","circle");
_27.setAttribute("cx",X);
_27.setAttribute("cy",Y);
_27.setAttribute("r",_25);
_26.appendChild(_27);
return _27;
};
SVGGraphics2.prototype.drawImage=function(src,X,Y,_2b,_2c,dx,dy){
var _2f=document.createElementNS("http://www.w3.org/2000/svg","image");
_2f.setAttributeNS("http://www.w3.org/1999/xlink","href",src);
var _30=X-dx;
var _31=Y-dy;
_2f.setAttribute("x",_30);
_2f.setAttribute("y",_31);
if(_2b!=0){
_2f.setAttribute("width",_2b);
}
if(_2c!=0){
_2f.setAttribute("height",_2c);
}
this.svg.appendChild(_2f);
return _2f;
};
SVGGraphics2.prototype.swapImage=function(_32,src){
_32.setAttributeNS("http://www.w3.org/1999/xlink","href",src);
};
SVGGraphics2.prototype.paint=function(){
};

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
this.strokeStyle=x;
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
_24.strokecolor=this.fillStyle;
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
this.fixedScale=_7[i-1];
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
function EditSLD(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
var _3=baseDir+"/tool/xsl/wmc_AddSld.xsl";
this.stylesheet=new XslProcessor(_3);
this.checkThis=function(){
if(document.getElementById("textStyle").checked==true){
this.addNodeToSLD("TextSymbolizer");
document.getElementById("textStyle").checked=true;
manageDiv("propertyText",1);
alert("checked");
alert(Sarissa.serialize(this.model.doc));
}else{
if(this.model.doc.selectSingleNode("//TextSymbolizer")!=null){
xpath="//FeatureTypeStyle";
node=this.model.doc.selectSingleNode(xpath);
node.removeChild(this.model.doc.selectSingleNode("//TextSymbolizer").parentNode);
this.addNodeToSLD(document.getElementById("choixFeatureType").value+"Symbolizer");
manageDiv("propertyText",0);
alert(Sarissa.serialize(this.model.doc));
}
}
};
this.updateNode=function(_4,_5){
if(_4=="//MinScaleDenominator2"){
node=this.model.doc.selectNodes("//MinScaleDenominator");
node[1].firstChild.nodeValue=_5;
}else{
if(_4=="//MaxScaleDenominator2"){
node2=this.model.doc.selectNodes("//MaxScaleDenominator");
node2[1].firstChild.nodeValue=_5;
}else{
if((this.model.doc.selectSingleNode(_4)!=null)&&(_5)){
this.model.setXpathValue(this.model,_4,_5,false);
}
}
}
};
this.insertSldToWmc=function(_6){
if(_6){
var _7=this.model.getSldNode();
var _8=this.stylesheet.transformNodeToObject(_7);
Sarissa.setXpathNamespaces(_8,this.targetModel.namespace);
mbDebugMessage(this,_8.xml);
legendURLNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_6+"']/wmc:StyleList/wmc:Style/wmc:LegendURL");
layerNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_6+"']");
styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_6+"']/wmc:StyleList");
if(styleNode){
layerNode.removeChild(styleNode);
}
this.targetModel.setParam("addSLD",_8.documentElement);
if(legendURLNode){
styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_6+"']/wmc:StyleList/wmc:Style");
styleNode.appendChild(legendURLNode);
}
config.objects.mainMap.setParam("refresh");
}else{
alert(mbGetMessage("selectLayer"));
}
};
this.insertSldaToWmc=function(_9){
if(_9){
sl=this.targetModel.doc.createElement("StyleList");
st=this.targetModel.doc.createElement("Style");
st.setAttribute("current","1");
sld=this.targetModel.doc.createElement("SLD");
node=this.model.doc.selectSingleNode("//StyledLayerDescriptor").cloneNode("true");
sld.appendChild(node);
st.appendChild(sld);
sl.appendChild(st);
layerNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_9+"']");
styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+_9+"']/wmc:StyleList");
if(styleNode){
layerNode.removeChild(styleNode);
layerNode.appendChild(sl);
config.objects.mainMap.setParam("refresh");
}else{
layerNode.appendChild(sl);
config.objects.mainMap.setParam("refresh");
}
mbDebugMessage(this,"Apres : "+Sarissa.serialize(this.targetModel.doc));
}else{
alert(mbGetMessage("selectLayer"));
}
};
this.validSld=function(_a){
if(!_a){
alert(mbGetMessage("noLayerSelected"));
}else{
if(((document.getElementById("textStyle").checked==true)&&(document.getElementById("selectPropertyCanvas")))||(document.getElementById("textStyle").checked==false)){
this.updateNodeCss(document.getElementById("fill").id,"//PolygonSymbolizer/Fill/CssParameter[@name=",document.getElementById("fill").value);
this.updateNodeCss(document.getElementById("fill").id,"//PointSymbolizer/Graphic/Mark/Fill/CssParameter[@name=",document.getElementById("fill").value);
this.updateNodeCss(document.getElementById("stroke").id,"//CssParameter[@name=",document.getElementById("stroke").value);
this.updateNodeCss("fill","//TextSymbolizer/Fill/CssParameter[@name=",document.getElementById("fontColor").value);
this.insertSldToWmc(_a);
config.loadModel("mySLD",this.model.url);
}else{
if(!document.getElementById("selectPropertyCanvas")){
alert(mbGetMessage("noPropertySelected"));
}
}
}
};
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
mbDebugMessage(this,"source:"+Sarissa.serialize(_7));
}
var _8=new Object();
_8.method=this.targetModel.method;
this.requestStylesheet.setParameter("httpMethod",_8.method);
this.requestStylesheet.setParameter("version",this.model.getVersion(_7));
if(this.requestFilter){
var _9=config.objects[this.requestFilter];
this.requestStylesheet.setParameter("filter",escape(Sarissa.serialize(_9.doc).replace(/[\n\f\r\t]/g,"")));
if(this.debug){
mbDebugMessage(this,Sarissa.serialize(_9.doc));
}
}
_8.postData=this.requestStylesheet.transformNodeToObject(_7);
if(this.debug){
mbDebugMessage(this,"request data:"+Sarissa.serialize(_8.postData));
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

mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");
function AutoResize(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
var _3=_1.selectSingleNode("mb:referenceNodeId");
if(_3){
this.referenceNodeId=_3.firstChild.nodeValue;
var _4=document.getElementById(this.referenceNodeId);
}else{
var _4=document.getElementById("autoResize");
}
if(_4==null){
alert(mbGetMessage("referenceNodeIdNotFound",this.referenceNodeId));
}
this.fireResize=function(){
config.objects[window.resizeToolId].model.setParam("autoResize");
};
window.onresize=this.fireResize;
window.resizeToolId=this.id;
this.enlargeBboxIfNecessary=function(){
var _5=this.model.getBoundingBox();
var _6=_5[2]-_5[0];
var _7=_5[3]-_5[1];
var _8=_6/this.model.getWindowWidth();
var _9=_7/this.model.getWindowHeight();
if(_8!=_9){
if(_8>_9){
var _a=_7*(_8/_9);
_5[3]=_5[3]+0.5*(_a-_7);
_5[1]=_5[1]-0.5*(_a-_7);
}else{
if(_9>_8){
var _b=_6*(_9/_8);
_5[0]=_5[0]-0.5*(_b-_6);
_5[2]=_5[2]+0.5*(_b-_6);
}
}
this.model.setBoundingBox(_5);
}
};
this.resizeHandler=function(_c){
_c.enlargeBboxIfNecessary();
var _d=parseInt(getStyle(_4,"padding-top"));
var _e=parseInt(getStyle(_4,"padding-bottom"));
var _f=parseInt(getStyle(_4,"padding-left"));
var _10=parseInt(getStyle(_4,"padding-right"));
newWidth=_4.offsetWidth-(_f+_10);
newHeight=_4.offsetHeight-(_d+_e);
_c.model.setWindowSize(new Array(newWidth,newHeight));
};
this.model.addFirstListener("autoResize",this.resizeHandler,this);
this.model.addFirstListener("loadModel",this.resizeHandler,this);
function getStyle(_11,_12){
var _13="";
if(document.defaultView&&document.defaultView.getComputedStyle){
_13=document.defaultView.getComputedStyle(_11,"").getPropertyValue(_12);
}else{
if(_11.currentStyle){
_12=_12.replace(/\-(\w)/g,function(_14,p1){
return p1.toUpperCase();
});
_13=_11.currentStyle[_12];
}
}
return _13;
}
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

function DragPanHandler(_1,_2){
ToolBase.apply(this,new Array(_1,_2));
this.mouseUpHandler=function(_3,_4){
if(_3.enabled){
if(_3.dragging){
_3.dragging=false;
if((_3.deltaP==0)&&(_3.deltaL==0)){
var ul=_3.model.extent.getXY(_3.anchorPoint);
var lr=_3.model.extent.getXY(_3.anchorPoint);
_3.model.setParam("aoi",new Array(ul,lr));
return;
}
var _7=_3.model.getWindowWidth();
var _8=_3.model.getWindowHeight();
var ul=_3.model.extent.getXY(new Array(-_3.deltaP,-_3.deltaL));
var lr=_3.model.extent.getXY(new Array(_7-_3.deltaP,_8-_3.deltaL));
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
alert(mbGetMessage("cantGoBack"));
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
alert(mbGetMessage("cantGoForward"));
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
this.isRunning=false;
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

_OPENLAYERS_SFL_=true;
OpenLayers=new Object();
OpenLayers._scriptName=(typeof (_OPENLAYERS_SFL_)=="undefined"?"lib/OpenLayers.js":"OpenLayers.js");
OpenLayers._getScriptLocation=function(){
var _1="";
var _2=OpenLayers._scriptName;
var _3=document.getElementsByTagName("script");
for(var i=0;i<_3.length;i++){
var _5=_3[i].getAttribute("src");
if(_5){
var _6=_5.lastIndexOf(_2);
if((_6>-1)&&(_6+_2.length==_5.length)){
_1=_5.slice(0,-_2.length);
break;
}
}
}
return _1;
};
if(typeof (_OPENLAYERS_SFL_)=="undefined"){
(function(){
var _7=new Array("OpenLayers/BaseTypes.js","OpenLayers/Util.js","Rico/Corner.js","Rico/Color.js","OpenLayers/Ajax.js","OpenLayers/Events.js","OpenLayers/Map.js","OpenLayers/Layer.js","OpenLayers/Icon.js","OpenLayers/Marker.js","OpenLayers/Marker/Box.js","OpenLayers/Popup.js","OpenLayers/Tile.js","OpenLayers/Feature.js","OpenLayers/Feature/Vector.js","OpenLayers/Feature/WFS.js","OpenLayers/Tile/Image.js","OpenLayers/Tile/WFS.js","OpenLayers/Layer/Image.js","OpenLayers/Layer/EventPane.js","OpenLayers/Layer/FixedZoomLevels.js","OpenLayers/Layer/Google.js","OpenLayers/Layer/VirtualEarth.js","OpenLayers/Layer/Yahoo.js","OpenLayers/Layer/HTTPRequest.js","OpenLayers/Layer/Grid.js","OpenLayers/Layer/MapServer.js","OpenLayers/Layer/MapServer/Untiled.js","OpenLayers/Layer/KaMap.js","OpenLayers/Layer/MultiMap.js","OpenLayers/Layer/Markers.js","OpenLayers/Layer/Text.js","OpenLayers/Layer/WorldWind.js","OpenLayers/Layer/WMS.js","OpenLayers/Layer/WMS/Untiled.js","OpenLayers/Layer/GeoRSS.js","OpenLayers/Layer/Boxes.js","OpenLayers/Layer/Canvas.js","OpenLayers/Layer/TMS.js","OpenLayers/Popup/Anchored.js","OpenLayers/Popup/AnchoredBubble.js","OpenLayers/Handler.js","OpenLayers/Handler/Point.js","OpenLayers/Handler/Path.js","OpenLayers/Handler/Polygon.js","OpenLayers/Handler/Feature.js","OpenLayers/Handler/Drag.js","OpenLayers/Handler/Box.js","OpenLayers/Handler/MouseWheel.js","OpenLayers/Handler/Keyboard.js","OpenLayers/Control.js","OpenLayers/Control/ZoomBox.js","OpenLayers/Control/ZoomToMaxExtent.js","OpenLayers/Control/DragPan.js","OpenLayers/Control/Navigation.js","OpenLayers/Control/MouseDefaults.js","OpenLayers/Control/MousePosition.js","OpenLayers/Control/OverviewMap.js","OpenLayers/Control/KeyboardDefaults.js","OpenLayers/Control/PanZoom.js","OpenLayers/Control/PanZoomBar.js","OpenLayers/Control/ArgParser.js","OpenLayers/Control/Permalink.js","OpenLayers/Control/Scale.js","OpenLayers/Control/LayerSwitcher.js","OpenLayers/Control/DrawFeature.js","OpenLayers/Control/Panel.js","OpenLayers/Control/SelectFeature.js","OpenLayers/Geometry.js","OpenLayers/Geometry/Rectangle.js","OpenLayers/Geometry/Collection.js","OpenLayers/Geometry/Point.js","OpenLayers/Geometry/MultiPoint.js","OpenLayers/Geometry/Curve.js","OpenLayers/Geometry/LineString.js","OpenLayers/Geometry/LinearRing.js","OpenLayers/Geometry/Polygon.js","OpenLayers/Geometry/MultiLineString.js","OpenLayers/Geometry/MultiPolygon.js","OpenLayers/Geometry/Surface.js","OpenLayers/Renderer.js","OpenLayers/Renderer/Elements.js","OpenLayers/Renderer/SVG.js","OpenLayers/Renderer/VML.js","OpenLayers/Layer/Vector.js","OpenLayers/Layer/GML.js","OpenLayers/Format.js","OpenLayers/Format/GML.js","OpenLayers/Format/KML.js","OpenLayers/Format/GeoRSS.js","OpenLayers/Format/WFS.js","OpenLayers/Format/WKT.js","OpenLayers/Layer/WFS.js","OpenLayers/Control/MouseToolbar.js","OpenLayers/Control/NavToolbar.js","OpenLayers/Control/EditingToolbar.js");
var _8="";
var _9=OpenLayers._getScriptLocation()+"lib/";
for(var i=0;i<_7.length;i++){
if(/MSIE/.test(navigator.userAgent)||/Safari/.test(navigator.userAgent)){
var _b="<script src='"+_9+_7[i]+"'></script>";
_8+=_b;
}else{
var s=document.createElement("script");
s.src=_9+_7[i];
var h=document.getElementsByTagName("head").length?document.getElementsByTagName("head")[0]:document.body;
h.appendChild(s);
}
}
if(_8){
document.write(_8);
}
})();
}
OpenLayers.VERSION_NUMBER="$Revision: 2655 $";
OpenLayers.Class={isPrototype:function(){
},create:function(){
return function(){
if(arguments&&arguments[0]!=OpenLayers.Class.isPrototype){
this.initialize.apply(this,arguments);
}
};
},inherit:function(){
var _e=arguments[0];
var _f=new _e(OpenLayers.Class.isPrototype);
for(var i=1;i<arguments.length;i++){
if(typeof arguments[i]=="function"){
var _11=arguments[i];
arguments[i]=new _11(OpenLayers.Class.isPrototype);
}
OpenLayers.Util.extend(_f,arguments[i]);
if(arguments[i].hasOwnProperty("toString")){
_f.toString=arguments[i].toString;
}
}
return _f;
}};
OpenLayers.Pixel=OpenLayers.Class.create();
OpenLayers.Pixel.prototype={x:0,y:0,initialize:function(x,y){
this.x=parseFloat(x);
this.y=parseFloat(y);
},toString:function(){
return ("x="+this.x+",y="+this.y);
},clone:function(){
return new OpenLayers.Pixel(this.x,this.y);
},equals:function(px){
var _15=false;
if(px!=null){
_15=((this.x==px.x&&this.y==px.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(px.x)&&isNaN(px.y)));
}
return _15;
},add:function(x,y){
return new OpenLayers.Pixel(this.x+x,this.y+y);
},offset:function(px){
var _19=this.clone();
if(px){
_19=this.add(px.x,px.y);
}
return _19;
},CLASS_NAME:"OpenLayers.Pixel"};
OpenLayers.Size=OpenLayers.Class.create();
OpenLayers.Size.prototype={w:0,h:0,initialize:function(w,h){
this.w=parseFloat(w);
this.h=parseFloat(h);
},toString:function(){
return ("w="+this.w+",h="+this.h);
},clone:function(){
return new OpenLayers.Size(this.w,this.h);
},equals:function(sz){
var _1d=false;
if(sz!=null){
_1d=((this.w==sz.w&&this.h==sz.h)||(isNaN(this.w)&&isNaN(this.h)&&isNaN(sz.w)&&isNaN(sz.h)));
}
return _1d;
},CLASS_NAME:"OpenLayers.Size"};
OpenLayers.LonLat=OpenLayers.Class.create();
OpenLayers.LonLat.prototype={lon:0,lat:0,initialize:function(lon,lat){
this.lon=parseFloat(lon);
this.lat=parseFloat(lat);
},toString:function(){
return ("lon="+this.lon+",lat="+this.lat);
},toShortString:function(){
return (this.lon+", "+this.lat);
},clone:function(){
return new OpenLayers.LonLat(this.lon,this.lat);
},add:function(lon,lat){
return new OpenLayers.LonLat(this.lon+lon,this.lat+lat);
},equals:function(ll){
var _23=false;
if(ll!=null){
_23=((this.lon==ll.lon&&this.lat==ll.lat)||(isNaN(this.lon)&&isNaN(this.lat)&&isNaN(ll.lon)&&isNaN(ll.lat)));
}
return _23;
},CLASS_NAME:"OpenLayers.LonLat"};
OpenLayers.LonLat.fromString=function(str){
var _25=str.split(",");
return new OpenLayers.LonLat(parseFloat(_25[0]),parseFloat(_25[1]));
};
OpenLayers.Bounds=OpenLayers.Class.create();
OpenLayers.Bounds.prototype={left:0,bottom:0,right:0,top:0,initialize:function(_26,_27,_28,top){
this.left=parseFloat(_26);
this.bottom=parseFloat(_27);
this.right=parseFloat(_28);
this.top=parseFloat(top);
},clone:function(){
return new OpenLayers.Bounds(this.left,this.bottom,this.right,this.top);
},equals:function(_2a){
var _2b=false;
if(_2a!=null){
_2b=((this.left==_2a.left)&&(this.right==_2a.right)&&(this.top==_2a.top)&&(this.bottom==_2a.bottom));
}
return _2b;
},toString:function(){
return ("left-bottom=("+this.left+","+this.bottom+")"+" right-top=("+this.right+","+this.top+")");
},toBBOX:function(_2c){
if(_2c==null){
_2c=6;
}
var _2d=Math.pow(10,_2c);
var _2e=Math.round(this.left*_2d)/_2d+","+Math.round(this.bottom*_2d)/_2d+","+Math.round(this.right*_2d)/_2d+","+Math.round(this.top*_2d)/_2d;
return _2e;
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
return new OpenLayers.Bounds(this.left+x,this.bottom+y,this.right+x,this.top+y);
},extend:function(_31){
var _32=null;
if(_31){
switch(_31.CLASS_NAME){
case "OpenLayers.LonLat":
_32=new OpenLayers.Bounds(_31.lon,_31.lat,_31.lon,_31.lat);
break;
case "OpenLayers.Geometry.Point":
_32=new OpenLayers.Bounds(_31.x,_31.y,_31.x,_31.y);
break;
case "OpenLayers.Bounds":
_32=_31;
break;
}
if(_32){
this.left=(_32.left<this.left)?_32.left:this.left;
this.bottom=(_32.bottom<this.bottom)?_32.bottom:this.bottom;
this.right=(_32.right>this.right)?_32.right:this.right;
this.top=(_32.top>this.top)?_32.top:this.top;
}
}
},containsLonLat:function(ll,_34){
return this.contains(ll.lon,ll.lat,_34);
},containsPixel:function(px,_36){
return this.contains(px.x,px.y,_36);
},contains:function(x,y,_39){
if(_39==null){
_39=true;
}
var _3a=false;
if(_39){
_3a=((x>=this.left)&&(x<=this.right)&&(y>=this.bottom)&&(y<=this.top));
}else{
_3a=((x>this.left)&&(x<this.right)&&(y>this.bottom)&&(y<this.top));
}
return _3a;
},intersectsBounds:function(_3b,_3c){
if(_3c==null){
_3c=true;
}
var _3d=(_3b.bottom==this.bottom&&_3b.top==this.top)?true:(((_3b.bottom>this.bottom)&&(_3b.bottom<this.top))||((this.bottom>_3b.bottom)&&(this.bottom<_3b.top)));
var _3e=(_3b.bottom==this.bottom&&_3b.top==this.top)?true:(((_3b.top>this.bottom)&&(_3b.top<this.top))||((this.top>_3b.bottom)&&(this.top<_3b.top)));
var _3f=(_3b.right==this.right&&_3b.left==this.left)?true:(((_3b.right>this.left)&&(_3b.right<this.right))||((this.right>_3b.left)&&(this.right<_3b.right)));
var _40=(_3b.right==this.right&&_3b.left==this.left)?true:(((_3b.left>this.left)&&(_3b.left<this.right))||((this.left>_3b.left)&&(this.left<_3b.right)));
return (this.containsBounds(_3b,true,_3c)||_3b.containsBounds(this,true,_3c)||((_3e||_3d)&&(_40||_3f)));
},containsBounds:function(_41,_42,_43){
if(_42==null){
_42=false;
}
if(_43==null){
_43=true;
}
var _44;
var _45;
var _46;
var _47;
if(_43){
_44=(_41.left>=this.left)&&(_41.left<=this.right);
_45=(_41.top>=this.bottom)&&(_41.top<=this.top);
_46=(_41.right>=this.left)&&(_41.right<=this.right);
_47=(_41.bottom>=this.bottom)&&(_41.bottom<=this.top);
}else{
_44=(_41.left>this.left)&&(_41.left<this.right);
_45=(_41.top>this.bottom)&&(_41.top<this.top);
_46=(_41.right>this.left)&&(_41.right<this.right);
_47=(_41.bottom>this.bottom)&&(_41.bottom<this.top);
}
return (_42)?(_45||_47)&&(_44||_46):(_45&&_44&&_47&&_46);
},determineQuadrant:function(_48){
var _49="";
var _4a=this.getCenterLonLat();
_49+=(_48.lat<_4a.lat)?"b":"t";
_49+=(_48.lon<_4a.lon)?"l":"r";
return _49;
},CLASS_NAME:"OpenLayers.Bounds"};
OpenLayers.Bounds.fromString=function(str){
var _4c=str.split(",");
return OpenLayers.Bounds.fromArray(_4c);
};
OpenLayers.Bounds.fromArray=function(_4d){
return new OpenLayers.Bounds(parseFloat(_4d[0]),parseFloat(_4d[1]),parseFloat(_4d[2]),parseFloat(_4d[3]));
};
OpenLayers.Bounds.fromSize=function(_4e){
return new OpenLayers.Bounds(0,_4e.h,_4e.w,0);
};
OpenLayers.Bounds.oppositeQuadrant=function(_4f){
var opp="";
opp+=(_4f.charAt(0)=="t")?"b":"t";
opp+=(_4f.charAt(1)=="l")?"r":"l";
return opp;
};
OpenLayers.Element={visible:function(_51){
return OpenLayers.Util.getElement(_51).style.display!="none";
},toggle:function(){
for(var i=0;i<arguments.length;i++){
var _53=OpenLayers.Util.getElement(arguments[i]);
OpenLayers.Element[OpenLayers.Element.visible(_53)?"hide":"show"](_53);
}
},hide:function(){
for(var i=0;i<arguments.length;i++){
var _55=OpenLayers.Util.getElement(arguments[i]);
_55.style.display="none";
}
},show:function(){
for(var i=0;i<arguments.length;i++){
var _57=OpenLayers.Util.getElement(arguments[i]);
_57.style.display="";
}
},remove:function(_58){
_58=OpenLayers.Util.getElement(_58);
_58.parentNode.removeChild(_58);
},getHeight:function(_59){
_59=OpenLayers.Util.getElement(_59);
return _59.offsetHeight;
},getDimensions:function(_5a){
_5a=OpenLayers.Util.getElement(_5a);
if(OpenLayers.Element.getStyle(_5a,"display")!="none"){
return {width:_5a.offsetWidth,height:_5a.offsetHeight};
}
var els=_5a.style;
var _5c=els.visibility;
var _5d=els.position;
els.visibility="hidden";
els.position="absolute";
els.display="";
var _5e=_5a.clientWidth;
var _5f=_5a.clientHeight;
els.display="none";
els.position=_5d;
els.visibility=_5c;
return {width:_5e,height:_5f};
},getStyle:function(_60,_61){
_60=OpenLayers.Util.getElement(_60);
var _62=_60.style[_61.camelize()];
if(!_62){
if(document.defaultView&&document.defaultView.getComputedStyle){
var css=document.defaultView.getComputedStyle(_60,null);
_62=css?css.getPropertyValue(_61):null;
}else{
if(_60.currentStyle){
_62=_60.currentStyle[_61.camelize()];
}
}
}
if(window.opera&&OpenLayers.Util.indexOf(["left","top","right","bottom"],_61)!=-1){
if(OpenLayers.Element.getStyle(_60,"position")=="static"){
_62="auto";
}
}
return _62=="auto"?null:_62;
}};
String.prototype.startsWith=function(_64){
return (this.substr(0,_64.length)==_64);
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
String.indexOf=function(_68){
for(var i=0;i<this.length;i++){
if(this[i]==_68){
return i;
}
}
return -1;
};
String.prototype.camelize=function(){
var _6a=this.split("-");
if(_6a.length==1){
return _6a[0];
}
var _6b=this.indexOf("-")==0?_6a[0].charAt(0).toUpperCase()+_6a[0].substring(1):_6a[0];
for(var i=1,len=_6a.length;i<len;i++){
var s=_6a[i];
_6b+=s.charAt(0).toUpperCase()+s.substring(1);
}
return _6b;
};
Number.prototype.limitSigDigs=function(sig){
var _6f=(sig>0)?this.toString():0;
if(sig<_6f.length){
var exp=_6f.length-sig;
_6f=Math.round(this/Math.pow(10,exp))*Math.pow(10,exp);
}
return parseInt(_6f);
};
Function.prototype.bind=function(){
var _71=this,args=[],object=arguments[0];
for(var i=1;i<arguments.length;i++){
args.push(arguments[i]);
}
return function(_73){
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return _71.apply(object,args);
};
};
Function.prototype.bindAsEventListener=function(_75){
var _76=this;
return function(_77){
return _76.call(_75,_77||window.event);
};
};
OpenLayers.Util=new Object();
OpenLayers.Util.getElement=function(){
var _78=new Array();
for(var i=0;i<arguments.length;i++){
var _7a=arguments[i];
if(typeof _7a=="string"){
_7a=document.getElementById(_7a);
}
if(arguments.length==1){
return _7a;
}
_78.push(_7a);
}
return _78;
};
if($==null){
var $=OpenLayers.Util.getElement;
}
OpenLayers.Util.extend=function(_7b,_7c){
for(property in _7c){
_7b[property]=_7c[property];
}
return _7b;
};
OpenLayers.Util.removeItem=function(_7d,_7e){
for(var i=0;i<_7d.length;i++){
if(_7d[i]==_7e){
_7d.splice(i,1);
}
}
return _7d;
};
OpenLayers.Util.clearArray=function(_80){
_80.length=0;
};
OpenLayers.Util.indexOf=function(_81,obj){
for(var i=0;i<_81.length;i++){
if(_81[i]==obj){
return i;
}
}
return -1;
};
OpenLayers.Util.modifyDOMElement=function(_84,id,px,sz,_88,_89,_8a,_8b){
if(id){
_84.id=id;
}
if(px){
_84.style.left=px.x+"px";
_84.style.top=px.y+"px";
}
if(sz){
_84.style.width=sz.w+"px";
_84.style.height=sz.h+"px";
}
if(_88){
_84.style.position=_88;
}
if(_89){
_84.style.border=_89;
}
if(_8a){
_84.style.overflow=_8a;
}
if(_8b){
_84.style.opacity=_8b;
_84.style.filter="alpha(opacity="+(_8b*100)+")";
}
};
OpenLayers.Util.createDiv=function(id,px,sz,_8f,_90,_91,_92,_93){
var dom=document.createElement("div");
if(_8f){
dom.style.backgroundImage="url("+_8f+")";
}
if(!id){
id=OpenLayers.Util.createUniqueID("OpenLayersDiv");
}
if(!_90){
_90="absolute";
}
OpenLayers.Util.modifyDOMElement(dom,id,px,sz,_90,_91,_92,_93);
return dom;
};
OpenLayers.Util.createImage=function(id,px,sz,_98,_99,_9a,_9b,_9c){
image=document.createElement("img");
if(!id){
id=OpenLayers.Util.createUniqueID("OpenLayersDiv");
}
if(!_99){
_99="relative";
}
OpenLayers.Util.modifyDOMElement(image,id,px,sz,_99,_9a,null,_9b);
if(_9c){
image.style.display="none";
OpenLayers.Event.observe(image,"load",OpenLayers.Util.onImageLoad.bindAsEventListener(image));
OpenLayers.Event.observe(image,"error",OpenLayers.Util.onImageLoadError.bindAsEventListener(image));
}
image.style.alt=id;
image.galleryImg="no";
if(_98){
image.src=_98;
}
return image;
};
OpenLayers.Util.setOpacity=function(_9d,_9e){
OpenLayers.Util.modifyDOMElement(_9d,null,null,null,null,null,null,_9e);
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
var _9f=navigator.appVersion.split("MSIE");
var _a0=parseFloat(_9f[1]);
var _a1=false;
try{
_a1=document.body.filters;
}
catch(e){
}
return (_a1&&(_a0>=5.5)&&(_a0<7));
};
OpenLayers.Util.modifyAlphaImageDiv=function(div,id,px,sz,_a6,_a7,_a8,_a9,_aa){
OpenLayers.Util.modifyDOMElement(div,id,px,sz);
var img=div.childNodes[0];
if(_a6){
img.src=_a6;
}
OpenLayers.Util.modifyDOMElement(img,div.id+"_innerImage",null,sz,"relative",_a8);
if(_aa){
div.style.opacity=_aa;
div.style.filter="alpha(opacity="+(_aa*100)+")";
}
if(OpenLayers.Util.alphaHack()){
div.style.display="inline-block";
if(_a9==null){
_a9="scale";
}
div.style.filter="progid:DXImageTransform.Microsoft"+".AlphaImageLoader(src='"+img.src+"', "+"sizingMethod='"+_a9+"')";
if(div.style.opacity){
div.style.filter+=" alpha(opacity="+div.style.opacity*100+")";
}
img.style.filter="progid:DXImageTransform.Microsoft"+".Alpha(opacity=0)";
}
};
OpenLayers.Util.createAlphaImageDiv=function(id,px,sz,_af,_b0,_b1,_b2,_b3,_b4){
var div=OpenLayers.Util.createDiv();
var img=OpenLayers.Util.createImage(null,null,null,null,null,null,null,false);
div.appendChild(img);
if(_b4){
img.style.display="none";
OpenLayers.Event.observe(img,"load",OpenLayers.Util.onImageLoad.bindAsEventListener(div));
OpenLayers.Event.observe(img,"error",OpenLayers.Util.onImageLoadError.bindAsEventListener(div));
}
OpenLayers.Util.modifyAlphaImageDiv(div,id,px,sz,_af,_b0,_b1,_b2,_b3);
return div;
};
OpenLayers.Util.upperCaseObject=function(_b7){
var _b8=new Object();
for(var key in _b7){
_b8[key.toUpperCase()]=_b7[key];
}
return _b8;
};
OpenLayers.Util.applyDefaults=function(to,_bb){
for(var key in _bb){
if(to[key]==null){
to[key]=_bb[key];
}
}
};
OpenLayers.Util.getParameterString=function(_bd){
paramsArray=new Array();
for(var key in _bd){
var _bf=_bd[key];
if((_bf!=null)&&(typeof _bf!="function")){
var _c0;
if(typeof _bf=="object"&&_bf.constructor==Array){
var _c1=new Array();
for(var _c2=0;_c2<_bf.length;_c2++){
_c1.push(encodeURIComponent(_bf[_c2]));
}
_c0=_c1.join(",");
}else{
_c0=encodeURIComponent(_bf);
}
paramsArray.push(encodeURIComponent(key)+"="+_c0);
}
}
return paramsArray.join("&");
};
OpenLayers.ImgPath="";
OpenLayers.Util.getImagesLocation=function(){
return OpenLayers.ImgPath||(OpenLayers._getScriptLocation()+"img/");
};
OpenLayers.Util.Try=function(){
var _c3;
for(var i=0;i<arguments.length;i++){
var _c5=arguments[i];
try{
_c3=_c5();
break;
}
catch(e){
}
}
return _c3;
};
OpenLayers.Util.getNodes=function(p,_c7){
var _c8=OpenLayers.Util.Try(function(){
return OpenLayers.Util._getNodes(p.documentElement.childNodes,_c7);
},function(){
return OpenLayers.Util._getNodes(p.childNodes,_c7);
});
return _c8;
};
OpenLayers.Util._getNodes=function(_c9,_ca){
var _cb=new Array();
for(var i=0;i<_c9.length;i++){
if(_c9[i].nodeName==_ca){
_cb.push(_c9[i]);
}
}
return _cb;
};
OpenLayers.Util.getTagText=function(_cd,_ce,_cf){
var _d0=OpenLayers.Util.getNodes(_cd,_ce);
if(_d0&&(_d0.length>0)){
if(!_cf){
_cf=0;
}
if(_d0[_cf].childNodes.length>1){
return _d0.childNodes[1].nodeValue;
}else{
if(_d0[_cf].childNodes.length==1){
return _d0[_cf].firstChild.nodeValue;
}
}
}else{
return "";
}
};
OpenLayers.Util.getXmlNodeValue=function(_d1){
var val=null;
OpenLayers.Util.Try(function(){
val=_d1.text;
if(!val){
val=_d1.textContent;
}
if(!val){
val=_d1.firstChild.nodeValue;
}
},function(){
val=_d1.textContent;
});
return val;
};
OpenLayers.Util.mouseLeft=function(evt,div){
var _d5=(evt.relatedTarget)?evt.relatedTarget:evt.toElement;
while(_d5!=div&&_d5!=null){
_d5=_d5.parentNode;
}
return (_d5!=div);
};
OpenLayers.Util.rad=function(x){
return x*Math.PI/180;
};
OpenLayers.Util.distVincenty=function(p1,p2){
var a=6378137,b=6356752.3142,f=1/298.257223563;
var L=OpenLayers.Util.rad(p2.lon-p1.lon);
var U1=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p1.lat)));
var U2=Math.atan((1-f)*Math.tan(OpenLayers.Util.rad(p2.lat)));
var _dd=Math.sin(U1),cosU1=Math.cos(U1);
var _de=Math.sin(U2),cosU2=Math.cos(U2);
var _df=L,lambdaP=2*Math.PI;
var _e0=20;
while(Math.abs(_df-lambdaP)>1e-12&&--_e0>0){
var _e1=Math.sin(_df),cosLambda=Math.cos(_df);
var _e2=Math.sqrt((cosU2*_e1)*(cosU2*_e1)+(cosU1*_de-_dd*cosU2*cosLambda)*(cosU1*_de-_dd*cosU2*cosLambda));
if(_e2==0){
return 0;
}
var _e3=_dd*_de+cosU1*cosU2*cosLambda;
var _e4=Math.atan2(_e2,_e3);
var _e5=Math.asin(cosU1*cosU2*_e1/_e2);
var _e6=Math.cos(_e5)*Math.cos(_e5);
var _e7=_e3-2*_dd*_de/_e6;
var C=f/16*_e6*(4+f*(4-3*_e6));
lambdaP=_df;
_df=L+(1-C)*f*Math.sin(_e5)*(_e4+C*_e2*(_e7+C*_e3*(-1+2*_e7*_e7)));
}
if(_e0==0){
return NaN;
}
var uSq=_e6*(a*a-b*b)/(b*b);
var A=1+uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
var B=uSq/1024*(256+uSq*(-128+uSq*(74-47*uSq)));
var _ec=B*_e2*(_e7+B/4*(_e3*(-1+2*_e7*_e7)-B/6*_e7*(-3+4*_e2*_e2)*(-3+4*_e7*_e7)));
var s=b*A*(_e4-_ec);
var d=s.toFixed(3)/1000;
return d;
};
OpenLayers.Util.getArgs=function(url){
if(url==null){
url=window.location.href;
}
var _f0=(url.indexOf("?")!=-1)?url.substring(url.indexOf("?")+1):"";
var _f1=new Object();
pairs=_f0.split(/[&;]/);
for(var i=0;i<pairs.length;++i){
keyValue=pairs[i].split(/=/);
if(keyValue.length==2){
_f1[decodeURIComponent(keyValue[0])]=decodeURIComponent(keyValue[1]);
}
}
return _f1;
};
OpenLayers.Util.lastSeqID=0;
OpenLayers.Util.createUniqueID=function(_f3){
if(_f3==null){
_f3="id_";
}
OpenLayers.Util.lastSeqID+=1;
return _f3+OpenLayers.Util.lastSeqID;
};
OpenLayers.INCHES_PER_UNIT={"inches":1,"ft":12,"mi":63360,"m":39.3701,"km":39370.1,"dd":4374754};
OpenLayers.INCHES_PER_UNIT["in"]=OpenLayers.INCHES_PER_UNIT.inches;
OpenLayers.INCHES_PER_UNIT["degrees"]=OpenLayers.INCHES_PER_UNIT.dd;
OpenLayers.DOTS_PER_INCH=72;
OpenLayers.Util.normalizeScale=function(_f4){
var _f5=(_f4>1)?(1/_f4):_f4;
return _f5;
};
OpenLayers.Util.getResolutionFromScale=function(_f6,_f7){
if(_f7==null){
_f7="degrees";
}
var _f8=OpenLayers.Util.normalizeScale(_f6);
var _f9=1/(_f8*OpenLayers.INCHES_PER_UNIT[_f7]*OpenLayers.DOTS_PER_INCH);
return _f9;
};
OpenLayers.Util.getScaleFromResolution=function(_fa,_fb){
if(_fb==null){
_fb="degrees";
}
var _fc=_fa*OpenLayers.INCHES_PER_UNIT[_fb]*OpenLayers.DOTS_PER_INCH;
return _fc;
};
OpenLayers.Util.safeStopPropagation=function(evt){
OpenLayers.Event.stop(evt,true);
};
OpenLayers.Util.pagePosition=function(_fe){
var _ff=0,valueL=0;
var _100=_fe;
do{
_ff+=_100.offsetTop||0;
valueL+=_100.offsetLeft||0;
if(_100.offsetParent==document.body){
if(OpenLayers.Element.getStyle(_100,"position")=="absolute"){
break;
}
}
}while(_100=_100.offsetParent);
_100=_fe;
do{
_ff-=_100.scrollTop||0;
valueL-=_100.scrollLeft||0;
}while(_100=_100.parentNode);
return [valueL,_ff];
};
OpenLayers.Util.isEquivalentUrl=function(url1,url2,_103){
_103=_103||new Object();
OpenLayers.Util.applyDefaults(_103,{ignoreCase:true,ignorePort80:true,ignoreHash:true});
urlObj1=OpenLayers.Util.createUrlObject(url1,_103);
urlObj2=OpenLayers.Util.createUrlObject(url2,_103);
for(var key in urlObj1){
if(_103.test){
alert(key+"\n1:"+urlObj1[key]+"\n2:"+urlObj2[key]);
}
var val1=urlObj1[key];
var val2=urlObj2[key];
switch(key){
case "args":
break;
case "host":
case "port":
case "protocol":
if((val1=="")||(val2=="")){
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
OpenLayers.Util.createUrlObject=function(url,_108){
_108=_108||new Object();
var _109=new Object();
if(_108.ignoreCase){
url=url.toLowerCase();
}
var a=document.createElement("a");
a.href=url;
_109.host=a.host;
var port=a.port;
if(port.length<=0){
var _10c=_109.host.length-(port.length);
_109.host=_109.host.substring(0,_10c);
}
_109.protocol=a.protocol;
_109.port=((port=="80")&&(_108.ignorePort80))?"":port;
_109.hash=(_108.ignoreHash)?"":a.hash;
var _10d=a.search;
if(!_10d){
var _10e=url.indexOf("?");
_10d=(_10e!=-1)?url.substr(_10e):"";
}
_109.args=OpenLayers.Util.getArgs(_10d);
if(((_109.protocol=="file:")&&(url.indexOf("file:")!=-1))||((_109.protocol!="file:")&&(_109.host!=""))){
_109.pathname=a.pathname;
var _10f=_109.pathname.indexOf("?");
if(_10f!=-1){
_109.pathname=_109.pathname.substring(0,_10f);
}
}else{
var _110=OpenLayers.Util.removeTail(url);
var _111=0;
do{
var _112=_110.indexOf("../");
if(_112==0){
_111++;
_110=_110.substr(3);
}else{
if(_112>=0){
var _113=_110.substr(0,_112-1);
var _114=_113.indexOf("/");
_113=(_114!=-1)?_113.substr(0,_114+1):"";
var _115=_110.substr(_112+3);
_110=_113+_115;
}
}
}while(_112!=-1);
var _116=document.createElement("a");
var _117=window.location.href;
if(_108.ignoreCase){
_117=_117.toLowerCase();
}
_116.href=_117;
_109.protocol=_116.protocol;
var _118=(_116.pathname.indexOf("/")!=-1)?"/":"\\";
var dirs=_116.pathname.split(_118);
dirs.pop();
while((_111>0)&&(dirs.length>0)){
dirs.pop();
_111--;
}
_110=dirs.join("/")+"/"+_110;
_109.pathname=_110;
}
if((_109.protocol=="file:")||(_109.protocol=="")){
_109.host="localhost";
}
return _109;
};
OpenLayers.Util.removeTail=function(url){
var head=null;
var _11c=url.indexOf("?");
var _11d=url.indexOf("#");
if(_11c==-1){
head=(_11d!=-1)?url.substr(0,_11d):url;
}else{
head=(_11d!=-1)?url.substr(0,Math.min(_11c,_11d)):url.substr(0,_11c);
}
return head;
};
OpenLayers.Rico=new Object();
OpenLayers.Rico.Corner={round:function(e,_11f){
e=OpenLayers.Util.getElement(e);
this._setOptions(_11f);
var _120=this.options.color;
if(this.options.color=="fromElement"){
_120=this._background(e);
}
var _121=this.options.bgColor;
if(this.options.bgColor=="fromParent"){
_121=this._background(e.offsetParent);
}
this._roundCornersImpl(e,_120,_121);
},changeColor:function(_122,_123){
_122.style.backgroundColor=_123;
var _124=_122.parentNode.getElementsByTagName("span");
for(var _125=0;_125<_124.length;_125++){
_124[_125].style.backgroundColor=_123;
}
},changeOpacity:function(_126,_127){
var _128=_127;
var _129="alpha(opacity="+_127*100+")";
_126.style.opacity=_128;
_126.style.filter=_129;
var _12a=_126.parentNode.getElementsByTagName("span");
for(var _12b=0;_12b<_12a.length;_12b++){
_12a[_12b].style.opacity=_128;
_12a[_12b].style.filter=_129;
}
},reRound:function(_12c,_12d){
var _12e=_12c.parentNode.childNodes[0];
var _12f=_12c.parentNode.childNodes[2];
_12c.parentNode.removeChild(_12e);
_12c.parentNode.removeChild(_12f);
this.round(_12c.parentNode,_12d);
},_roundCornersImpl:function(e,_131,_132){
if(this.options.border){
this._renderBorder(e,_132);
}
if(this._isTopRounded()){
this._roundTopCorners(e,_131,_132);
}
if(this._isBottomRounded()){
this._roundBottomCorners(e,_131,_132);
}
},_renderBorder:function(el,_134){
var _135="1px solid "+this._borderColor(_134);
var _136="border-left: "+_135;
var _137="border-right: "+_135;
var _138="style='"+_136+";"+_137+"'";
el.innerHTML="<div "+_138+">"+el.innerHTML+"</div>";
},_roundTopCorners:function(el,_13a,_13b){
var _13c=this._createCorner(_13b);
for(var i=0;i<this.options.numSlices;i++){
_13c.appendChild(this._createCornerSlice(_13a,_13b,i,"top"));
}
el.style.paddingTop=0;
el.insertBefore(_13c,el.firstChild);
},_roundBottomCorners:function(el,_13f,_140){
var _141=this._createCorner(_140);
for(var i=(this.options.numSlices-1);i>=0;i--){
_141.appendChild(this._createCornerSlice(_13f,_140,i,"bottom"));
}
el.style.paddingBottom=0;
el.appendChild(_141);
},_createCorner:function(_143){
var _144=document.createElement("div");
_144.style.backgroundColor=(this._isTransparent()?"transparent":_143);
return _144;
},_createCornerSlice:function(_145,_146,n,_148){
var _149=document.createElement("span");
var _14a=_149.style;
_14a.backgroundColor=_145;
_14a.display="block";
_14a.height="1px";
_14a.overflow="hidden";
_14a.fontSize="1px";
var _14b=this._borderColor(_145,_146);
if(this.options.border&&n==0){
_14a.borderTopStyle="solid";
_14a.borderTopWidth="1px";
_14a.borderLeftWidth="0px";
_14a.borderRightWidth="0px";
_14a.borderBottomWidth="0px";
_14a.height="0px";
_14a.borderColor=_14b;
}else{
if(_14b){
_14a.borderColor=_14b;
_14a.borderStyle="solid";
_14a.borderWidth="0px 1px";
}
}
if(!this.options.compact&&(n==(this.options.numSlices-1))){
_14a.height="2px";
}
this._setMargin(_149,n,_148);
this._setBorder(_149,n,_148);
return _149;
},_setOptions:function(_14c){
this.options={corners:"all",color:"fromElement",bgColor:"fromParent",blend:true,border:false,compact:false};
OpenLayers.Util.extend(this.options,_14c||{});
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
},_borderColor:function(_14d,_14e){
if(_14d=="transparent"){
return _14e;
}else{
if(this.options.border){
return this.options.border;
}else{
if(this.options.blend){
return this._blend(_14e,_14d);
}else{
return "";
}
}
}
},_setMargin:function(el,n,_151){
var _152=this._marginSize(n);
var _153=_151=="top"?this._whichSideTop():this._whichSideBottom();
if(_153=="left"){
el.style.marginLeft=_152+"px";
el.style.marginRight="0px";
}else{
if(_153=="right"){
el.style.marginRight=_152+"px";
el.style.marginLeft="0px";
}else{
el.style.marginLeft=_152+"px";
el.style.marginRight=_152+"px";
}
}
},_setBorder:function(el,n,_156){
var _157=this._borderSize(n);
var _158=_156=="top"?this._whichSideTop():this._whichSideBottom();
if(_158=="left"){
el.style.borderLeftWidth=_157+"px";
el.style.borderRightWidth="0px";
}else{
if(_158=="right"){
el.style.borderRightWidth=_157+"px";
el.style.borderLeftWidth="0px";
}else{
el.style.borderLeftWidth=_157+"px";
el.style.borderRightWidth=_157+"px";
}
}
if(this.options.border!=false){
el.style.borderLeftWidth=_157+"px";
}
el.style.borderRightWidth=_157+"px";
},_marginSize:function(n){
if(this._isTransparent()){
return 0;
}
var _15a=[5,3,2,1];
var _15b=[3,2,1,0];
var _15c=[2,1];
var _15d=[1,0];
if(this.options.compact&&this.options.blend){
return _15d[n];
}else{
if(this.options.compact){
return _15c[n];
}else{
if(this.options.blend){
return _15b[n];
}else{
return _15a[n];
}
}
}
},_borderSize:function(n){
var _15f=[5,3,2,1];
var _160=[2,1,1,1];
var _161=[1,0];
var _162=[0,2,0,0];
if(this.options.compact&&(this.options.blend||this._isTransparent())){
return 1;
}else{
if(this.options.compact){
return _161[n];
}else{
if(this.options.blend){
return _160[n];
}else{
if(this.options.border){
return _162[n];
}else{
if(this._isTransparent()){
return _15f[n];
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
OpenLayers.nullHandler=function(_16a){
alert("Unhandled request return "+_16a.statusText);
};
OpenLayers.loadURL=function(uri,_16c,_16d,_16e,_16f){
if(OpenLayers.ProxyHost&&uri.startsWith("http")){
uri=OpenLayers.ProxyHost+escape(uri);
}
var _170=(_16e)?_16e.bind(_16d):OpenLayers.nullHandler;
var _171=(_16f)?_16f.bind(_16d):OpenLayers.nullHandler;
new OpenLayers.Ajax.Request(uri,{method:"get",parameters:_16c,onComplete:_170,onFailure:_171});
};
OpenLayers.parseXMLString=function(text){
var _173=text.indexOf("<");
if(_173>0){
text=text.substring(_173);
}
var _174=OpenLayers.Util.Try(function(){
var _175=new ActiveXObject("Microsoft.XMLDOM");
_175.loadXML(text);
return _175;
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
return _174;
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
OpenLayers.Ajax.Responders={responders:[],register:function(_177){
for(var i=0;i<this.responders.length;i++){
if(_177==this.responders[i]){
return;
}
}
this.responders.push(_177);
},dispatch:function(_179,_17a,_17b,json){
for(var i=0;i<this.responders.length;i++){
responder=this.responders[i];
if(responder[_179]&&typeof responder[_179]=="function"){
try{
responder[_179].apply(responder,[_17a,_17b,json]);
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
OpenLayers.Ajax.Base.prototype={setOptions:function(_17e){
this.options={method:"post",asynchronous:true,parameters:""};
OpenLayers.Util.extend(this.options,_17e||{});
},responseIsSuccess:function(){
return this.transport.status==undefined||this.transport.status==0||(this.transport.status>=200&&this.transport.status<300);
},responseIsFailure:function(){
return !this.responseIsSuccess();
}};
OpenLayers.Ajax.Request=OpenLayers.Class.create();
OpenLayers.Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
OpenLayers.Ajax.Request.prototype=OpenLayers.Class.inherit(OpenLayers.Ajax.Base,{initialize:function(url,_180){
this.transport=OpenLayers.Ajax.getTransport();
this.setOptions(_180);
this.request(url);
},request:function(url){
var _182=this.options.parameters||"";
if(_182.length>0){
_182+="&_=";
}
try{
this.url=url;
if(this.options.method=="get"&&_182.length>0){
this.url+=(this.url.match(/\?/)?"&":"?")+_182;
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
var body=this.options.postBody?this.options.postBody:_182;
this.transport.send(this.options.method=="post"?body:null);
}
catch(e){
this.dispatchException(e);
}
},setRequestHeaders:function(){
var _184=["X-Requested-With","XMLHttpRequest","X-Prototype-Version","OpenLayers"];
if(this.options.method=="post"&&!this.options.postBody){
_184.push("Content-type","application/x-www-form-urlencoded");
if(this.transport.overrideMimeType){
_184.push("Connection","close");
}
}
if(this.options.requestHeaders){
_184.push.apply(_184,this.options.requestHeaders);
}
for(var i=0;i<_184.length;i+=2){
this.transport.setRequestHeader(_184[i],_184[i+1]);
}
},onStateChange:function(){
var _186=this.transport.readyState;
if(_186!=1){
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
},respondToReadyState:function(_188){
var _189=OpenLayers.Ajax.Request.Events[_188];
var _18a=this.transport,json=this.evalJSON();
if(_189=="Complete"){
try{
(this.options["on"+this.transport.status]||this.options["on"+(this.responseIsSuccess()?"Success":"Failure")]||OpenLayers.Ajax.emptyFunction)(_18a,json);
}
catch(e){
this.dispatchException(e);
}
if((this.header("Content-type")||"").match(/^text\/javascript/i)){
this.evalResponse();
}
}
try{
(this.options["on"+_189]||OpenLayers.Ajax.emptyFunction)(_18a,json);
OpenLayers.Ajax.Responders.dispatch("on"+_189,this,_18a,json);
}
catch(e){
this.dispatchException(e);
}
if(_189=="Complete"){
this.transport.onreadystatechange=OpenLayers.Ajax.emptyFunction;
}
},dispatchException:function(_18b){
(this.options.onException||OpenLayers.Ajax.emptyFunction)(this,_18b);
OpenLayers.Ajax.Responders.dispatch("onException",this,_18b);
}});
OpenLayers.Ajax.getElementsByTagNameNS=function(_18c,_18d,_18e,_18f){
return _18c.getElementsByTagNameNS?_18c.getElementsByTagNameNS(_18d,_18f):_18c.getElementsByTagName(_18e+":"+_18f);
};
OpenLayers.Ajax.serializeXMLToString=function(_190){
var _191=new XMLSerializer();
data=_191.serializeToString(_190);
return data;
};
OpenLayers.Control=OpenLayers.Class.create();
OpenLayers.Control.TYPE_BUTTON=1;
OpenLayers.Control.TYPE_TOGGLE=2;
OpenLayers.Control.TYPE_TOOL=3;
OpenLayers.Control.prototype={id:null,map:null,div:null,type:null,displayClass:"",active:null,handler:null,initialize:function(_192){
this.displayClass=this.CLASS_NAME.replace("OpenLayers.","ol").replace(".","");
OpenLayers.Util.extend(this,_192);
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
},CLASS_NAME:"OpenLayers.Control"};
OpenLayers.Handler=OpenLayers.Class.create();
OpenLayers.Handler.MOD_NONE=0;
OpenLayers.Handler.MOD_SHIFT=1;
OpenLayers.Handler.MOD_CTRL=2;
OpenLayers.Handler.MOD_ALT=4;
OpenLayers.Handler.prototype={id:null,control:null,map:null,keyMask:null,active:false,initialize:function(_196,_197,_198){
OpenLayers.Util.extend(this,_198);
this.control=_196;
this.callbacks=_197;
if(_196.map){
this.setMap(_196.map);
}
OpenLayers.Util.extend(this,_198);
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},setMap:function(map){
this.map=map;
},checkModifiers:function(evt){
if(this.keyMask==null){
return true;
}
var _19b=(evt.shiftKey?OpenLayers.Handler.MOD_SHIFT:0)|(evt.ctrlKey?OpenLayers.Handler.MOD_CTRL:0)|(evt.altKey?OpenLayers.Handler.MOD_ALT:0);
return (_19b==this.keyMask);
},activate:function(){
if(this.active){
return false;
}
var _19c=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_19c.length;i++){
if(this[_19c[i]]){
this.register(_19c[i],this[_19c[i]]);
}
}
this.active=true;
return true;
},deactivate:function(){
if(!this.active){
return false;
}
var _19e=OpenLayers.Events.prototype.BROWSER_EVENTS;
for(var i=0;i<_19e.length;i++){
if(this[_19e[i]]){
this.unregister(_19e[i],this[_19e[i]]);
}
}
this.active=false;
return true;
},callback:function(name,args){
if(this.callbacks[name]){
this.callbacks[name].apply(this.control,args);
}
},register:function(name,_1a3){
this.map.events.registerPriority(name,this,_1a3);
},unregister:function(name,_1a5){
this.map.events.unregister(name,this,_1a5);
},destroy:function(){
this.control=this.map=null;
},CLASS_NAME:"OpenLayers.Handler"};
OpenLayers.Icon=OpenLayers.Class.create();
OpenLayers.Icon.prototype={url:null,size:null,offset:null,calculateOffset:null,imageDiv:null,px:null,initialize:function(url,size,_1a8,_1a9){
this.url=url;
this.size=(size)?size:new OpenLayers.Size(20,20);
this.offset=_1a8?_1a8:new OpenLayers.Pixel(-(this.size.w/2),-(this.size.h/2));
this.calculateOffset=_1a9;
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
},setOpacity:function(_1ad){
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,null,null,null,null,null,_1ad);
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
var _1af=this.px.offset(this.offset);
OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,_1af);
}
}
},display:function(_1b0){
this.imageDiv.style.display=(_1b0)?"":"none";
},CLASS_NAME:"OpenLayers.Icon"};
OpenLayers.Popup=OpenLayers.Class.create();
OpenLayers.Popup.WIDTH=200;
OpenLayers.Popup.HEIGHT=200;
OpenLayers.Popup.COLOR="white";
OpenLayers.Popup.OPACITY=1;
OpenLayers.Popup.BORDER="0px";
OpenLayers.Popup.prototype={events:null,id:"",lonlat:null,div:null,size:null,contentHTML:"",backgroundColor:"",opacity:"",border:"",contentDiv:null,padding:5,map:null,initialize:function(id,_1b2,size,_1b4,_1b5){
if(id==null){
id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
}
this.id=id;
this.lonlat=_1b2;
this.size=(size!=null)?size:new OpenLayers.Size(OpenLayers.Popup.WIDTH,OpenLayers.Popup.HEIGHT);
if(_1b4!=null){
this.contentHTML=_1b4;
}
this.backgroundColor=OpenLayers.Popup.COLOR;
this.opacity=OpenLayers.Popup.OPACITY;
this.border=OpenLayers.Popup.BORDER;
this.div=OpenLayers.Util.createDiv(this.id,null,null,null,null,null,"hidden");
this.div.className="olPopup";
var id=this.div.id+"_contentDiv";
this.contentDiv=OpenLayers.Util.createDiv(id,null,this.size.clone(),null,"relative",null,"hidden");
this.contentDiv.className="olPopupContent";
this.div.appendChild(this.contentDiv);
if(_1b5==true){
var _1b6=new OpenLayers.Size(17,17);
var img=OpenLayers.Util.getImagesLocation()+"close.gif";
var _1b8=OpenLayers.Util.createAlphaImageDiv(this.id+"_close",null,_1b6,img);
_1b8.style.right=this.padding+"px";
_1b8.style.top=this.padding+"px";
this.div.appendChild(_1b8);
var _1b9=new OpenLayers.Events(this,_1b8);
_1b9.register("mousedown",this,this.hide);
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
},setBackgroundColor:function(_1be){
if(_1be!=undefined){
this.backgroundColor=_1be;
}
if(this.div!=null){
this.div.style.backgroundColor=this.backgroundColor;
}
},setOpacity:function(_1bf){
if(_1bf!=undefined){
this.opacity=_1bf;
}
if(this.div!=null){
this.div.style.opacity=this.opacity;
this.div.style.filter="alpha(opacity="+this.opacity*100+")";
}
},setBorder:function(_1c0){
if(_1c0!=undefined){
this.border=_1c0;
}
if(this.div!=null){
this.div.style.border=this.border;
}
},setContentHTML:function(_1c1){
if(_1c1!=null){
this.contentHTML=_1c1;
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
},CLASS_NAME:"OpenLayers.Popup"};
OpenLayers.Renderer=OpenLayers.Class.create();
OpenLayers.Renderer.prototype={container:null,extent:null,size:null,resolution:null,map:null,initialize:function(_1c8){
this.container=$(_1c8);
},destroy:function(){
this.container=null;
this.extent=null;
this.size=null;
this.resolution=null;
this.map=null;
},supported:function(){
return false;
},setExtent:function(_1c9){
this.extent=_1c9.clone();
this.resolution=null;
},setSize:function(size){
this.size=size.clone();
this.resolution=null;
},getResolution:function(){
this.resolution=this.resolution||this.map.getResolution();
return this.resolution;
},drawGeometry:function(_1cb,_1cc){
},clear:function(){
},getGeometryFromEvent:function(evt){
},eraseGeometry:function(_1ce){
},CLASS_NAME:"OpenLayers.Renderer"};
OpenLayers.Rico.Color=OpenLayers.Class.create();
OpenLayers.Rico.Color.prototype={initialize:function(red,_1d0,blue){
this.rgb={r:red,g:_1d0,b:blue};
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
},darken:function(_1db){
var hsb=this.asHSB();
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,Math.max(hsb.b-_1db,0));
},brighten:function(_1dd){
var hsb=this.asHSB();
this.rgb=OpenLayers.Rico.Color.HSBtoRGB(hsb.h,hsb.s,Math.min(hsb.b+_1dd,1));
},blend:function(_1df){
this.rgb.r=Math.floor((this.rgb.r+_1df.rgb.r)/2);
this.rgb.g=Math.floor((this.rgb.g+_1df.rgb.g)/2);
this.rgb.b=Math.floor((this.rgb.b+_1df.rgb.b)/2);
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
}};
OpenLayers.Rico.Color.createFromHex=function(_1e1){
if(_1e1.length==4){
var _1e2=_1e1;
var _1e1="#";
for(var i=1;i<4;i++){
_1e1+=(_1e2.charAt(i)+_1e2.charAt(i));
}
}
if(_1e1.indexOf("#")==0){
_1e1=_1e1.substring(1);
}
var red=_1e1.substring(0,2);
var _1e5=_1e1.substring(2,4);
var blue=_1e1.substring(4,6);
return new OpenLayers.Rico.Color(parseInt(red,16),parseInt(_1e5,16),parseInt(blue,16));
};
OpenLayers.Rico.Color.createColorFromBackground=function(elem){
var _1e8=RicoUtil.getElementsComputedStyle(OpenLayers.Util.getElement(elem),"backgroundColor","background-color");
if(_1e8=="transparent"&&elem.parentNode){
return OpenLayers.Rico.Color.createColorFromBackground(elem.parentNode);
}
if(_1e8==null){
return new OpenLayers.Rico.Color(255,255,255);
}
if(_1e8.indexOf("rgb(")==0){
var _1e9=_1e8.substring(4,_1e8.length-1);
var _1ea=_1e9.split(",");
return new OpenLayers.Rico.Color(parseInt(_1ea[0]),parseInt(_1ea[1]),parseInt(_1ea[2]));
}else{
if(_1e8.indexOf("#")==0){
return OpenLayers.Rico.Color.createFromHex(_1e8);
}else{
return new OpenLayers.Rico.Color(255,255,255);
}
}
};
OpenLayers.Rico.Color.HSBtoRGB=function(hue,_1ec,_1ed){
var red=0;
var _1ef=0;
var blue=0;
if(_1ec==0){
red=parseInt(_1ed*255+0.5);
_1ef=red;
blue=red;
}else{
var h=(hue-Math.floor(hue))*6;
var f=h-Math.floor(h);
var p=_1ed*(1-_1ec);
var q=_1ed*(1-_1ec*f);
var t=_1ed*(1-(_1ec*(1-f)));
switch(parseInt(h)){
case 0:
red=(_1ed*255+0.5);
_1ef=(t*255+0.5);
blue=(p*255+0.5);
break;
case 1:
red=(q*255+0.5);
_1ef=(_1ed*255+0.5);
blue=(p*255+0.5);
break;
case 2:
red=(p*255+0.5);
_1ef=(_1ed*255+0.5);
blue=(t*255+0.5);
break;
case 3:
red=(p*255+0.5);
_1ef=(q*255+0.5);
blue=(_1ed*255+0.5);
break;
case 4:
red=(t*255+0.5);
_1ef=(p*255+0.5);
blue=(_1ed*255+0.5);
break;
case 5:
red=(_1ed*255+0.5);
_1ef=(p*255+0.5);
blue=(q*255+0.5);
break;
}
}
return {r:parseInt(red),g:parseInt(_1ef),b:parseInt(blue)};
};
OpenLayers.Rico.Color.RGBtoHSB=function(r,g,b){
var hue;
var _1fa;
var _1fb;
var cmax=(r>g)?r:g;
if(b>cmax){
cmax=b;
}
var cmin=(r<g)?r:g;
if(b<cmin){
cmin=b;
}
_1fb=cmax/255;
if(cmax!=0){
_1fa=(cmax-cmin)/cmax;
}else{
_1fa=0;
}
if(_1fa==0){
hue=0;
}else{
var redc=(cmax-r)/(cmax-cmin);
var _1ff=(cmax-g)/(cmax-cmin);
var _200=(cmax-b)/(cmax-cmin);
if(r==cmax){
hue=_200-_1ff;
}else{
if(g==cmax){
hue=2+redc-_200;
}else{
hue=4+_1ff-redc;
}
}
hue=hue/6;
if(hue<0){
hue=hue+1;
}
}
return {h:hue,s:_1fa,b:_1fb};
};
OpenLayers.Control.ArgParser=OpenLayers.Class.create();
OpenLayers.Control.ArgParser.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{center:null,zoom:null,layers:null,initialize:function(_201,base){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
},setMap:function(map){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
for(var i=0;i<this.map.controls.length;i++){
var _205=this.map.controls[i];
if((_205!=this)&&(_205.CLASS_NAME=="OpenLayers.Control.ArgParser")){
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
var _208=this.map.layers[i];
var c=this.layers.charAt(i);
if(c=="B"){
this.map.setBaseLayer(_208);
}else{
if((c=="T")||(c=="F")){
_208.setVisibility(c=="T");
}
}
}
}
},CLASS_NAME:"OpenLayers.Control.ArgParser"});
OpenLayers.Control.LayerSwitcher=OpenLayers.Class.create();
OpenLayers.Control.LayerSwitcher.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{activeColor:"darkblue",layersDiv:null,baseLayersDiv:null,baseLayers:null,dataLbl:null,dataLayersDiv:null,dataLayers:null,minimizeDiv:null,maximizeDiv:null,ascending:true,initialize:function(_20a){
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
this.minimizeControl();
this.redraw();
return this.div;
},clearLayersArray:function(_20c){
var _20d=this[_20c+"Layers"];
if(_20d){
for(var i=0;i<_20d.length;i++){
var _20f=_20d[i];
OpenLayers.Event.stopObservingElement(_20f.inputElem);
OpenLayers.Event.stopObservingElement(_20f.labelSpan);
}
}
this[_20c+"LayersDiv"].innerHTML="";
this[_20c+"Layers"]=new Array();
},redraw:function(){
this.clearLayersArray("base");
this.clearLayersArray("data");
var _210=false;
var _211=this.map.layers.slice();
if(!this.ascending){
_211.reverse();
}
for(var i=0;i<_211.length;i++){
var _213=_211[i];
var _214=_213.isBaseLayer;
if(_214||_213.displayInLayerSwitcher){
if(!_214){
_210=true;
}
var _215=(_214)?(_213==this.map.baseLayer):_213.getVisibility();
var _216=document.createElement("input");
_216.id="input_"+_213.name;
_216.name=(_214)?"baseLayers":_213.name;
_216.type=(_214)?"radio":"checkbox";
_216.value=_213.name;
_216.checked=_215;
_216.defaultChecked=_215;
if(!_214&&!_213.inRange){
_216.disabled=true;
}
var _217={"inputElem":_216,"layer":_213,"layerSwitcher":this};
OpenLayers.Event.observe(_216,"mouseup",this.onInputClick.bindAsEventListener(_217));
var _218=document.createElement("span");
if(!_214&&!_213.inRange){
_218.style.color="gray";
}
_218.innerHTML=_213.name;
_218.style.verticalAlign=(_214)?"bottom":"baseline";
OpenLayers.Event.observe(_218,"click",this.onInputClick.bindAsEventListener(_217));
var br=document.createElement("br");
var _21a=(_214)?this.baseLayers:this.dataLayers;
_21a.push({"layer":_213,"inputElem":_216,"labelSpan":_218});
var _21b=(_214)?this.baseLayersDiv:this.dataLayersDiv;
_21b.appendChild(_216);
_21b.appendChild(_218);
_21b.appendChild(br);
}
}
this.dataLbl.style.display=(_210)?"":"none";
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
var _21f=this.baseLayers[i];
if(_21f.inputElem.checked){
this.map.setBaseLayer(_21f.layer,false);
}
}
for(var i=0;i<this.dataLayers.length;i++){
var _21f=this.dataLayers[i];
_21f.layer.setVisibility(_21f.inputElem.checked,true);
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
},showControls:function(_222){
this.maximizeDiv.style.display=_222?"":"none";
this.minimizeDiv.style.display=_222?"none":"";
this.layersDiv.style.display=_222?"none":"";
},loadContents:function(){
this.div.style.position="absolute";
this.div.style.top="10px";
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
var _223=document.createElement("div");
_223.innerHTML="<u>Base Layer</u>";
_223.style.marginTop="3px";
_223.style.marginLeft="3px";
_223.style.marginBottom="3px";
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
this.layersDiv.appendChild(_223);
this.layersDiv.appendChild(this.baseLayersDiv);
this.layersDiv.appendChild(this.dataLbl);
this.layersDiv.appendChild(this.dataLayersDiv);
}else{
this.layersDiv.appendChild(this.dataLbl);
this.layersDiv.appendChild(this.dataLayersDiv);
this.layersDiv.appendChild(_223);
this.layersDiv.appendChild(this.baseLayersDiv);
}
this.div.appendChild(this.layersDiv);
OpenLayers.Rico.Corner.round(this.div,{corners:"tl bl",bgColor:"transparent",color:this.activeColor,blend:false});
OpenLayers.Rico.Corner.changeOpacity(this.layersDiv,0.75);
var _224=OpenLayers.Util.getImagesLocation();
var sz=new OpenLayers.Size(18,18);
var img=_224+"layer-switcher-maximize.png";
this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MaximizeDiv",null,sz,img,"absolute");
this.maximizeDiv.style.top="5px";
this.maximizeDiv.style.right="0px";
this.maximizeDiv.style.left="";
this.maximizeDiv.style.display="none";
OpenLayers.Event.observe(this.maximizeDiv,"click",this.maximizeControl.bindAsEventListener(this));
this.div.appendChild(this.maximizeDiv);
var img=_224+"layer-switcher-minimize.png";
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
this.mouseDown=true;
this.ignoreEvent(evt);
},mouseUp:function(evt){
if(this.mouseDown){
this.mouseDown=false;
this.ignoreEvent(evt);
}
},CLASS_NAME:"OpenLayers.Control.LayerSwitcher"});
OpenLayers.Control.MouseDefaults=OpenLayers.Class.create();
OpenLayers.Control.MouseDefaults.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{performedDrag:false,wheelObserver:null,initialize:function(){
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
var _22b=!this.performedDrag;
this.performedDrag=false;
return _22b;
},defaultDblClick:function(evt){
var _22d=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_22d,this.map.zoom+1);
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
var _230=Math.abs(this.mouseDragStart.x-evt.xy.x);
var _231=Math.abs(this.mouseDragStart.y-evt.xy.y);
this.zoomBox.style.width=Math.max(1,_230)+"px";
this.zoomBox.style.height=Math.max(1,_231)+"px";
if(evt.xy.x<this.mouseDragStart.x){
this.zoomBox.style.left=evt.xy.x+"px";
}
if(evt.xy.y<this.mouseDragStart.y){
this.zoomBox.style.top=evt.xy.y+"px";
}
}else{
var _230=this.mouseDragStart.x-evt.xy.x;
var _231=this.mouseDragStart.y-evt.xy.y;
var size=this.map.getSize();
var _233=new OpenLayers.Pixel(size.w/2+_230,size.h/2+_231);
var _234=this.map.getLonLatFromViewPortPx(_233);
this.map.setCenter(_234,null,true);
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
var _23a=this.map.getLonLatFromViewPortPx(this.mouseDragStart);
var end=this.map.getLonLatFromViewPortPx(evt.xy);
var top=Math.max(_23a.lat,end.lat);
var _23d=Math.min(_23a.lat,end.lat);
var left=Math.min(_23a.lon,end.lon);
var _23f=Math.max(_23a.lon,end.lon);
var _240=new OpenLayers.Bounds(left,_23d,_23f,top);
this.map.zoomToExtent(_240);
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
var _242=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_242=true;
break;
}
elem=elem.parentNode;
}
if(_242){
var _244=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_244=e.wheelDelta/120;
if(window.opera){
_244=-_244;
}
}else{
if(e.detail){
_244=-e.detail/3;
}
}
if(_244){
e.xy=this.mousePosition;
if(_244<0){
this.defaultWheelDown(e);
}else{
this.defaultWheelUp(e);
}
}
OpenLayers.Event.stop(e);
}
},CLASS_NAME:"OpenLayers.Control.MouseDefaults"});
OpenLayers.Control.MousePosition=OpenLayers.Class.create();
OpenLayers.Control.MousePosition.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{element:null,prefix:"",separator:", ",suffix:"",numdigits:5,granularity:10,lastXy:null,initialize:function(_245){
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
var _247;
if(evt==null){
_247=new OpenLayers.LonLat(0,0);
}else{
if(this.lastXy==null||Math.abs(evt.xy.x-this.lastXy.x)>this.granularity||Math.abs(evt.xy.y-this.lastXy.y)>this.granularity){
this.lastXy=evt.xy;
return;
}
_247=this.map.getLonLatFromPixel(evt.xy);
this.lastXy=evt.xy;
}
var _248=parseInt(this.numdigits);
var _249=this.prefix+_247.lon.toFixed(_248)+this.separator+_247.lat.toFixed(_248)+this.suffix;
if(_249!=this.element.innerHTML){
this.element.innerHTML=_249;
}
},setMap:function(){
OpenLayers.Control.prototype.setMap.apply(this,arguments);
this.map.events.register("mousemove",this,this.redraw);
},CLASS_NAME:"OpenLayers.Control.MousePosition"});
OpenLayers.Control.PanZoom=OpenLayers.Class.create();
OpenLayers.Control.PanZoom.X=4;
OpenLayers.Control.PanZoom.Y=4;
OpenLayers.Control.PanZoom.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{slideFactor:50,buttons:null,position:null,initialize:function(){
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
this.buttons=new Array();
var sz=new OpenLayers.Size(18,18);
var _24d=new OpenLayers.Pixel(px.x+sz.w/2,px.y);
this._addButton("panup","north-mini.png",_24d,sz);
px.y=_24d.y+sz.h;
this._addButton("panleft","west-mini.png",px,sz);
this._addButton("panright","east-mini.png",px.add(sz.w,0),sz);
this._addButton("pandown","south-mini.png",_24d.add(0,sz.h*2),sz);
this._addButton("zoomin","zoom-plus-mini.png",_24d.add(0,sz.h*3+5),sz);
this._addButton("zoomworld","zoom-world-mini.png",_24d.add(0,sz.h*4+5),sz);
this._addButton("zoomout","zoom-minus-mini.png",_24d.add(0,sz.h*5+5),sz);
return this.div;
},_addButton:function(id,img,xy,sz){
var _252=OpenLayers.Util.getImagesLocation()+img;
var btn=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_PanZoom_"+id,xy,sz,_252,"absolute");
this.div.appendChild(btn);
OpenLayers.Event.observe(btn,"mousedown",this.buttonDown.bindAsEventListener(btn));
OpenLayers.Event.observe(btn,"mouseup",this.doubleClick.bindAsEventListener(btn));
OpenLayers.Event.observe(btn,"dblclick",this.doubleClick.bindAsEventListener(btn));
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
OpenLayers.Control.Panel=OpenLayers.Class.create();
OpenLayers.Control.Panel.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{controls:null,defaultControl:null,initialize:function(_256){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
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
var _25c=this.controls[i].panel_div;
if(this.controls[i].active){
_25c.className=this.controls[i].displayClass+"ItemActive";
}else{
_25c.className=this.controls[i].displayClass+"ItemInactive";
}
this.div.appendChild(_25c);
}
}
},activateControl:function(_25d){
if(!this.active){
return false;
}
if(_25d.type==OpenLayers.Control.TYPE_BUTTON){
_25d.trigger();
return;
}
for(var i=0;i<this.controls.length;i++){
if(this.controls[i]==_25d){
_25d.activate();
}else{
this.controls[i].deactivate();
}
}
this.redraw();
},addControls:function(_25f){
if(!(_25f instanceof Array)){
_25f=[_25f];
}
this.controls=this.controls.concat(_25f);
for(var i=0;i<_25f.length;i++){
var _261=document.createElement("div");
var _262=document.createTextNode(" ");
_25f[i].panel_div=_261;
OpenLayers.Event.observe(_25f[i].panel_div,"click",this.onClick.bind(this,_25f[i]));
OpenLayers.Event.observe(_25f[i].panel_div,"mousedown",OpenLayers.Event.stop.bindAsEventListener());
OpenLayers.Event.observe(_25f[i].panel_div,"mouseup",OpenLayers.Event.stop.bindAsEventListener());
}
if(this.map){
for(var i=0;i<_25f.length;i++){
this.map.addControl(_25f[i]);
_25f[i].deactivate();
}
this.redraw();
}
},onClick:function(ctrl,evt){
OpenLayers.Event.stop(evt?evt:window.event);
this.activateControl(ctrl);
},CLASS_NAME:"OpenLayers.Control.Panel"});
OpenLayers.Control.Permalink=OpenLayers.Class.create();
OpenLayers.Control.Permalink.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{element:null,base:"",initialize:function(_265,base){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.element=OpenLayers.Util.getElement(_265);
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
var _269=this.map.controls[i];
if(_269.CLASS_NAME=="OpenLayers.Control.ArgParser"){
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
var _26a=this.map.getCenter();
var zoom="zoom="+this.map.getZoom();
var lat="lat="+Math.round(_26a.lat*100000)/100000;
var lon="lon="+Math.round(_26a.lon*100000)/100000;
var _26e="layers=";
for(var i=0;i<this.map.layers.length;i++){
var _270=this.map.layers[i];
if(_270.isBaseLayer){
_26e+=(_270==this.map.baseLayer)?"B":"0";
}else{
_26e+=(_270.getVisibility())?"T":"F";
}
}
var href=this.base+"?"+lat+"&"+lon+"&"+zoom+"&"+_26e;
this.element.href=href;
},CLASS_NAME:"OpenLayers.Control.Permalink"});
OpenLayers.Control.Scale=OpenLayers.Class.create();
OpenLayers.Control.Scale.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{element:null,initialize:function(_272){
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.element=OpenLayers.Util.getElement(_272);
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
var _273=this.map.getScale();
if(!_273){
return;
}
if(_273>=9500&&_273<=950000){
_273=Math.round(_273/1000)+"K";
}else{
if(_273>=950000){
_273=Math.round(_273/1000000)+"M";
}else{
_273=Math.round(_273);
}
}
this.element.innerHTML="Scale = 1 : "+_273;
},CLASS_NAME:"OpenLayers.Control.Scale"});
OpenLayers.Control.ZoomToMaxExtent=OpenLayers.Class.create();
OpenLayers.Control.ZoomToMaxExtent.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){
if(this.map){
this.map.zoomToMaxExtent();
}
},CLASS_NAME:"OpenLayers.Control.ZoomToMaxExtent"});
OpenLayers.Event={observers:false,KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,element:function(_274){
return _274.target||_274.srcElement;
},isLeftClick:function(_275){
return (((_275.which)&&(_275.which==1))||((_275.button)&&(_275.button==1)));
},stop:function(_276,_277){
if(!_277){
if(_276.preventDefault){
_276.preventDefault();
}else{
_276.returnValue=false;
}
}
if(_276.stopPropagation){
_276.stopPropagation();
}else{
_276.cancelBubble=true;
}
},findElement:function(_278,_279){
var _27a=OpenLayers.Event.element(_278);
while(_27a.parentNode&&(!_27a.tagName||(_27a.tagName.toUpperCase()!=_279.toUpperCase()))){
_27a=_27a.parentNode;
}
return _27a;
},observe:function(_27b,name,_27d,_27e){
var _27f=OpenLayers.Util.getElement(_27b);
_27e=_27e||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_27f.attachEvent)){
name="keydown";
}
if(!this.observers){
this.observers=new Object();
}
if(!_27f._eventCacheID){
var _280="eventCacheID_";
if(_27f.id){
_280=_27f.id+"_"+_280;
}
_27f._eventCacheID=OpenLayers.Util.createUniqueID(_280);
}
var _281=_27f._eventCacheID;
if(!this.observers[_281]){
this.observers[_281]=new Array();
}
this.observers[_281].push({"element":_27f,"name":name,"observer":_27d,"useCapture":_27e});
if(_27f.addEventListener){
_27f.addEventListener(name,_27d,_27e);
}else{
if(_27f.attachEvent){
_27f.attachEvent("on"+name,_27d);
}
}
},stopObservingElement:function(_282){
var _283=OpenLayers.Util.getElement(_282);
var _284=_283._eventCacheID;
this._removeElementObservers(OpenLayers.Event.observers[_284]);
},_removeElementObservers:function(_285){
if(_285){
for(var i=_285.length-1;i>=0;i--){
var _287=_285[i];
var args=new Array(_287.element,_287.name,_287.observer,_287.useCapture);
var _289=OpenLayers.Event.stopObserving.apply(this,args);
}
}
},stopObserving:function(_28a,name,_28c,_28d){
_28d=_28d||false;
var _28e=OpenLayers.Util.getElement(_28a);
var _28f=_28e._eventCacheID;
if(name=="keypress"){
if(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_28e.detachEvent){
name="keydown";
}
}
var _290=false;
var _291=OpenLayers.Event.observers[_28f];
if(_291){
var i=0;
while(!_290&&i<_291.length){
var _293=_291[i];
if((_293.name==name)&&(_293.observer==_28c)&&(_293.useCapture==_28d)){
_291.splice(i,1);
if(_291.length==0){
delete OpenLayers.Event.observers[_28f];
}
_290=true;
break;
}
i++;
}
}
if(_28e.removeEventListener){
_28e.removeEventListener(name,_28c,_28d);
}else{
if(_28e&&_28e.detachEvent){
_28e.detachEvent("on"+name,_28c);
}
}
return _290;
},unloadCache:function(){
if(OpenLayers.Event.observers){
for(var _294 in OpenLayers.Event.observers){
var _295=OpenLayers.Event.observers[_294];
OpenLayers.Event._removeElementObservers.apply(this,[_295]);
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
OpenLayers.Events=OpenLayers.Class.create();
OpenLayers.Events.prototype={BROWSER_EVENTS:["mouseover","mouseout","mousedown","mouseup","mousemove","click","dblclick","resize","focus","blur"],listeners:null,object:null,element:null,eventTypes:null,eventHandler:null,fallThrough:null,initialize:function(_296,_297,_298,_299){
this.object=_296;
this.element=_297;
this.eventTypes=_298;
this.fallThrough=_299;
this.listeners=new Object();
this.eventHandler=this.handleBrowserEvent.bindAsEventListener(this);
if(this.eventTypes!=null){
for(var i=0;i<this.eventTypes.length;i++){
this.listeners[this.eventTypes[i]]=new Array();
}
}
if(this.element!=null){
this.attachToElement(_297);
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
},attachToElement:function(_29b){
for(var i=0;i<this.BROWSER_EVENTS.length;i++){
var _29d=this.BROWSER_EVENTS[i];
if(this.listeners[_29d]==null){
this.listeners[_29d]=new Array();
}
OpenLayers.Event.observe(_29b,_29d,this.eventHandler);
}
OpenLayers.Event.observe(_29b,"dragstart",OpenLayers.Event.stop);
},register:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _2a1=this.listeners[type];
if(_2a1!=null){
_2a1.push({obj:obj,func:func});
}
}
},registerPriority:function(type,obj,func){
if(func!=null){
if(obj==null){
obj=this.object;
}
var _2a5=this.listeners[type];
if(_2a5!=null){
_2a5.unshift({obj:obj,func:func});
}
}
},unregister:function(type,obj,func){
if(obj==null){
obj=this.object;
}
var _2a9=this.listeners[type];
if(_2a9!=null){
for(var i=0;i<_2a9.length;i++){
if(_2a9[i].obj==obj&&_2a9[i].func==func){
_2a9.splice(i,1);
break;
}
}
}
},remove:function(type){
if(this.listeners[type]!=null){
this.listeners[type]=new Array();
}
},triggerEvent:function(type,evt){
if(evt==null){
evt=new Object();
}
evt.object=this.object;
evt.element=this.element;
var _2ae=(this.listeners[type])?this.listeners[type].slice():null;
if((_2ae!=null)&&(_2ae.length>0)){
for(var i=0;i<_2ae.length;i++){
var _2b0=_2ae[i];
var _2b1;
if(_2b0.obj!=null){
_2b1=_2b0.func.call(_2b0.obj,evt);
}else{
_2b1=_2b0.func(evt);
}
if((_2b1!=null)&&(_2b1==false)){
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
},CLASS_NAME:"OpenLayers.Events"};
OpenLayers.Format=OpenLayers.Class.create();
OpenLayers.Format.prototype={initialize:function(_2b4){
OpenLayers.Util.extend(this,_2b4);
},read:function(data){
alert("Read not implemented.");
},write:function(_2b6){
alert("Write not implemented.");
},CLASS_NAME:"OpenLayers.Format"};
OpenLayers.Handler.Box=OpenLayers.Class.create();
OpenLayers.Handler.Box.prototype=OpenLayers.Class.inherit(OpenLayers.Handler,{dragHandler:null,initialize:function(_2b7,_2b8,_2b9){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
var _2b8={"down":this.startBox,"move":this.moveBox,"out":this.removeBox,"up":this.endBox};
this.dragHandler=new OpenLayers.Handler.Drag(this,_2b8,{keyMask:this.keyMask});
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
var _2bd=Math.abs(this.dragHandler.start.x-xy.x);
var _2be=Math.abs(this.dragHandler.start.y-xy.y);
this.zoomBox.style.width=Math.max(1,_2bd)+"px";
this.zoomBox.style.height=Math.max(1,_2be)+"px";
if(xy.x<this.dragHandler.start.x){
this.zoomBox.style.left=xy.x+"px";
}
if(xy.y<this.dragHandler.start.y){
this.zoomBox.style.top=xy.y+"px";
}
},endBox:function(end){
var _2c0;
if(Math.abs(this.dragHandler.start.x-end.x)>5||Math.abs(this.dragHandler.start.y-end.y)>5){
var _2c1=this.dragHandler.start;
var top=Math.min(_2c1.y,end.y);
var _2c3=Math.max(_2c1.y,end.y);
var left=Math.min(_2c1.x,end.x);
var _2c5=Math.max(_2c1.x,end.x);
_2c0=new OpenLayers.Bounds(left,_2c3,_2c5,top);
}else{
_2c0=this.dragHandler.start.clone();
}
this.removeBox();
this.map.div.style.cursor="";
this.callback("done",[_2c0]);
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
OpenLayers.Handler.Feature=OpenLayers.Class.create();
OpenLayers.Handler.Feature.prototype=OpenLayers.Class.inherit(OpenLayers.Handler,{layerIndex:null,geometry:null,initialize:function(_2c6,_2c7,_2c8,_2c9){
OpenLayers.Handler.prototype.initialize.apply(this,[_2c6,_2c8,_2c9]);
this.layer=_2c7;
},mousedown:function(evt){
var _2cb=this.select("down",evt);
return !_2cb;
},mousemove:function(evt){
this.select("move",evt);
return true;
},mouseup:function(evt){
var _2ce=this.select("up",evt);
return !_2ce;
},dblclick:function(evt){
var _2d0=this.select("dblclick",evt);
return !_2d0;
},select:function(type,evt){
var _2d3=this.layer.renderer.getGeometryFromEvent(evt);
if(_2d3){
if(!this.geometry){
this.callback("over",[_2d3]);
}else{
if(this.geometry!=_2d3){
this.callback("out",[this.geometry]);
this.callback("over",[_2d3]);
}
}
this.geometry=_2d3;
this.callback(type,[_2d3]);
return true;
}else{
if(this.geometry){
this.callback("out",[this.geometry]);
this.geometry=null;
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
OpenLayers.Handler.MouseWheel=OpenLayers.Class.create();
OpenLayers.Handler.MouseWheel.prototype=OpenLayers.Class.inherit(OpenLayers.Handler,{wheelListener:null,mousePosition:null,initialize:function(_2d4,_2d5,_2d6){
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
var _2d8=false;
var elem=OpenLayers.Event.element(e);
while(elem!=null){
if(this.map&&elem==this.map.div){
_2d8=true;
break;
}
elem=elem.parentNode;
}
if(_2d8){
var _2da=0;
if(!e){
e=window.event;
}
if(e.wheelDelta){
_2da=e.wheelDelta/120;
if(window.opera){
_2da=-_2da;
}
}else{
if(e.detail){
_2da=-e.detail/3;
}
}
if(_2da){
e.xy=this.mousePosition;
if(_2da<0){
this.callback("down",[e,_2da]);
}else{
this.callback("up",[e,_2da]);
}
}
OpenLayers.Event.stop(e);
}
},mousemove:function(evt){
this.mousePosition=evt.xy;
},activate:function(evt){
if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){
var _2dd=this.wheelListener;
OpenLayers.Event.observe(window,"DOMMouseScroll",_2dd);
OpenLayers.Event.observe(window,"mousewheel",_2dd);
OpenLayers.Event.observe(document,"mousewheel",_2dd);
return true;
}else{
return false;
}
},deactivate:function(evt){
if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){
var _2df=this.wheelListener;
OpenLayers.Event.stopObserving(window,"DOMMouseScroll",_2df);
OpenLayers.Event.stopObserving(window,"mousewheel",_2df);
OpenLayers.Event.stopObserving(document,"mousewheel",_2df);
return true;
}else{
return false;
}
},CLASS_NAME:"OpenLayers.Handler.MouseWheel"});
OpenLayers.Popup.Anchored=OpenLayers.Class.create();
OpenLayers.Popup.Anchored.prototype=OpenLayers.Class.inherit(OpenLayers.Popup,{relativePosition:null,anchor:null,initialize:function(id,_2e1,size,_2e3,_2e4,_2e5){
var _2e6=new Array(id,_2e1,size,_2e3,_2e5);
OpenLayers.Popup.prototype.initialize.apply(this,_2e6);
this.anchor=(_2e4!=null)?_2e4:{size:new OpenLayers.Size(0,0),offset:new OpenLayers.Pixel(0,0)};
},draw:function(px){
if(px==null){
if((this.lonlat!=null)&&(this.map!=null)){
px=this.map.getLayerPxFromLonLat(this.lonlat);
}
}
this.relativePosition=this.calculateRelativePosition(px);
return OpenLayers.Popup.prototype.draw.apply(this,arguments);
},calculateRelativePosition:function(px){
var _2e9=this.map.getLonLatFromLayerPx(px);
var _2ea=this.map.getExtent();
var _2eb=_2ea.determineQuadrant(_2e9);
return OpenLayers.Bounds.oppositeQuadrant(_2eb);
},moveTo:function(px){
var _2ed=this.calculateNewPx(px);
var _2ee=new Array(_2ed);
OpenLayers.Popup.prototype.moveTo.apply(this,_2ee);
},setSize:function(size){
OpenLayers.Popup.prototype.setSize.apply(this,arguments);
if((this.lonlat)&&(this.map)){
var px=this.map.getLayerPxFromLonLat(this.lonlat);
this.moveTo(px);
}
},calculateNewPx:function(px){
var _2f2=px.offset(this.anchor.offset);
var top=(this.relativePosition.charAt(0)=="t");
_2f2.y+=(top)?-this.size.h:this.anchor.size.h;
var left=(this.relativePosition.charAt(1)=="l");
_2f2.x+=(left)?-this.size.w:this.anchor.size.w;
return _2f2;
},CLASS_NAME:"OpenLayers.Popup.Anchored"});
OpenLayers.Renderer.Elements=OpenLayers.Class.create();
OpenLayers.Renderer.Elements.prototype=OpenLayers.Class.inherit(OpenLayers.Renderer,{rendererRoot:null,root:null,xmlns:null,initialize:function(_2f5){
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
},reproject:function(_2f6){
for(var i=0;i<this.root.childNodes.length;i++){
var node=this.root.childNodes[i];
this.reprojectNode(node);
}
},getNodeType:function(_2f9){
},drawGeometry:function(_2fa,_2fb){
if((_2fa.CLASS_NAME=="OpenLayers.Geometry.MultiPoint")||(_2fa.CLASS_NAME=="OpenLayers.Geometry.MultiLineString")||(_2fa.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_2fa.components.length;i++){
this.drawGeometry(_2fa.components[i],_2fb);
}
return;
}
var _2fd=this.getNodeType(_2fa);
var node=this.nodeFactory(_2fa.id,_2fd,_2fa);
node.geometry=_2fa;
node.olStyle=_2fb;
this.root.appendChild(node);
this.drawGeometryNode(node);
},drawGeometryNode:function(node,_300,_301){
_300=_300||node.geometry;
_301=_301||node.olStyle;
var _302={"isFilled":true,"isStroked":true};
switch(_300.CLASS_NAME){
case "OpenLayers.Geometry.Point":
this.drawPoint(node,_300);
break;
case "OpenLayers.Geometry.LineString":
_302.isFilled=false;
this.drawLineString(node,_300);
break;
case "OpenLayers.Geometry.LinearRing":
this.drawLinearRing(node,_300);
break;
case "OpenLayers.Geometry.Polygon":
this.drawPolygon(node,_300);
break;
case "OpenLayers.Geometry.Surface":
this.drawSurface(node,_300);
break;
case "OpenLayers.Geometry.Rectangle":
this.drawRectangle(node,_300);
break;
default:
break;
}
node.olStyle=_301;
node.olOptions=_302;
this.setStyle(node);
},drawPoint:function(node,_304){
},drawLineString:function(node,_306){
},drawLinearRing:function(node,_308){
},drawPolygon:function(node,_30a){
},drawRectangle:function(node,_30c){
},drawCircle:function(node,_30e){
},drawCurve:function(node,_310){
},drawSurface:function(node,_312){
},getGeometryFromEvent:function(evt){
var node=evt.target||evt.srcElement;
var _315=node.geometry?node.geometry:null;
return _315;
},eraseGeometry:function(_316){
if((_316.CLASS_NAME=="OpenLayers.Geometry.MultiPoint")||(_316.CLASS_NAME=="OpenLayers.Geometry.MultiLineString")||(_316.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon")){
for(var i=0;i<_316.components.length;i++){
this.eraseGeometry(_316.components[i]);
}
}else{
var _318=$(_316.id);
if(_318&&_318.parentNode){
if(_318.geometry){
_318.geometry.destroy();
_318.geometry=null;
}
_318.parentNode.removeChild(_318);
}
}
},nodeFactory:function(id,type,_31b){
var node=$(id);
if(node){
if(!this.nodeTypeCompare(node,type)){
node.parentNode.removeChild(node);
node=this.nodeFactory(id,type,_31b);
}
}else{
node=this.createNode(type,id);
}
return node;
},CLASS_NAME:"OpenLayers.Renderer.Elements"});
OpenLayers.Tile=OpenLayers.Class.create();
OpenLayers.Tile.prototype={id:null,layer:null,url:null,bounds:null,size:null,position:null,drawn:false,initialize:function(_31d,_31e,_31f,url,size){
this.layer=_31d;
this.position=_31e;
this.bounds=_31f;
this.url=url;
this.size=size;
this.id=OpenLayers.Util.createUniqueID("Tile_");
},destroy:function(){
this.layer=null;
this.bounds=null;
this.size=null;
this.position=null;
},draw:function(){
this.clear();
return ((this.layer.displayOutsideMaxExtent||(this.layer.maxExtent&&this.bounds.intersectsBounds(this.layer.maxExtent,false)))&&!(this.layer.buffer==0&&!this.bounds.intersectsBounds(this.layer.map.getExtent(),false)));
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
},CLASS_NAME:"OpenLayers.Tile"};
OpenLayers.Control.MouseToolbar=OpenLayers.Class.create();
OpenLayers.Control.MouseToolbar.X=6;
OpenLayers.Control.MouseToolbar.Y=300;
OpenLayers.Control.MouseToolbar.prototype=OpenLayers.Class.inherit(OpenLayers.Control.MouseDefaults,{mode:null,buttons:null,direction:"vertical",buttonClicked:null,initialize:function(_329,_32a){
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
this.buttons=new Object();
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
OpenLayers.Control.OverviewMap=OpenLayers.Class.create();
OpenLayers.Control.OverviewMap.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{id:"OverviewMap",element:null,ovmap:null,size:new OpenLayers.Size(180,90),layers:[],minRatio:8,maxRatio:32,mapOptions:{},initialize:function(_349){
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
this.rectEvents=new OpenLayers.Events(this,this.extentRectangle);
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
OpenLayers.Event.observe(this.maximizeDiv,"click",this.maximizeControl.bindAsEventListener(this));
OpenLayers.Event.observe(this.maximizeDiv,"dblclick",function(e){
OpenLayers.Event.stop(e);
});
this.div.appendChild(this.maximizeDiv);
var img=_34f+"layer-switcher-minimize.png";
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
this.ovmap=new OpenLayers.Map(this.mapDiv.id,_377);
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
this.extentRectangle.style.height=parseInt(_382-top)+"px";
this.extentRectangle.style.width=parseInt(_383-left)+"px";
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
OpenLayers.Control.PanZoomBar=OpenLayers.Class.create();
OpenLayers.Control.PanZoomBar.prototype=OpenLayers.Class.inherit(OpenLayers.Control.PanZoom,{zoomStopWidth:18,zoomStopHeight:11,slider:null,sliderEvents:null,zoomBarDiv:null,divEvents:null,initialize:function(){
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
this.buttons=new Array();
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
OpenLayers.Control.ZoomBox=OpenLayers.Class.create();
OpenLayers.Control.ZoomBox.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask});
},zoomBox:function(_3b0){
if(_3b0 instanceof OpenLayers.Bounds){
var _3b1=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_3b0.left,_3b0.bottom));
var _3b2=this.map.getLonLatFromPixel(new OpenLayers.Pixel(_3b0.right,_3b0.top));
var _3b3=new OpenLayers.Bounds(_3b1.lon,_3b1.lat,_3b2.lon,_3b2.lat);
this.map.zoomToExtent(_3b3);
}else{
this.map.setCenter(this.map.getLonLatFromPixel(_3b0),this.map.getZoom()+1);
}
},CLASS_NAME:"OpenLayers.Control.ZoomBox"});
OpenLayers.Format.GeoRSS=OpenLayers.Class.create();
OpenLayers.Format.GeoRSS.prototype=OpenLayers.Class.inherit(OpenLayers.Format,{rssns:"http://backend.userland.com/rss2",featureNS:"http://mapserver.gis.umn.edu/mapserver",georssns:"http://www.georss.org/georss",write:function(_3b4){
var _3b5=document.createElementNS(this.rssns,"rss");
for(var i=0;i<_3b4.length;i++){
_3b5.appendChild(this.createFeatureXML(_3b4[i]));
}
return _3b5;
},createFeatureXML:function(_3b7){
var _3b8=this.buildGeometryNode(_3b7.geometry);
var _3b9=document.createElementNS(this.rssns,"item");
var _3ba=document.createElementNS(this.rssns,"title");
_3ba.appendChild(document.createTextNode(_3b7.attributes.title?_3b7.attributes.title:""));
var _3bb=document.createElementNS(this.rssns,"description");
_3bb.appendChild(document.createTextNode(_3b7.attributes.description?_3b7.attributes.description:""));
_3b9.appendChild(_3ba);
_3b9.appendChild(_3bb);
for(var attr in _3b7.attributes){
var _3bd=document.createTextNode(_3b7.attributes[attr]);
var _3be=attr;
if(attr.search(":")!=-1){
_3be=attr.split(":")[1];
}
var _3bf=document.createElementNS(this.featureNS,"feature:"+_3be);
_3bf.appendChild(_3bd);
_3b9.appendChild(_3bf);
}
_3b9.appendChild(_3b8);
return _3b9;
},buildGeometryNode:function(_3c0){
var gml="";
if(_3c0.CLASS_NAME=="OpenLayers.Geometry.Polygon"){
gml=document.createElementNS(this.georssns,"georss:polygon");
gml.appendChild(this.buildCoordinatesNode(_3c0.components[0]));
}else{
if(_3c0.CLASS_NAME=="OpenLayers.Geometry.LineString"){
gml=document.createElementNS(this.georssns,"georss:line");
gml.appendChild(this.buildCoordinatesNode(_3c0));
}else{
if(_3c0.CLASS_NAME=="OpenLayers.Geometry.Point"){
gml=document.createElementNS(this.georssns,"georss:point");
gml.appendChild(this.buildCoordinatesNode(_3c0));
}else{
alert("Couldn't parse "+_3c0.CLASS_NAME);
}
}
}
return gml;
},buildCoordinatesNode:function(_3c2){
var _3c3=null;
if(_3c2.components){
_3c3=_3c2.components;
}
var path="";
if(_3c3){
for(var i=0;i<_3c3.length;i++){
path+=_3c3[i].lat+" "+_3c3[i].lon+" ";
}
}else{
path+=_3c2.lat+" "+_3c2.lon+" ";
}
return document.createTextNode(path);
},CLASS_NAME:"OpenLayers.Format.GeoRSS"});
OpenLayers.Format.WKT=OpenLayers.Class.create();
OpenLayers.Format.WKT.prototype=OpenLayers.Class.inherit(OpenLayers.Format,{initialize:function(_3c6){
this.regExes={"typeStr":/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,"spaces":/\s+/,"parenComma":/\)\s*,\s*\(/,"doubleParenComma":/\)\s*\)\s*,\s*\(\s*\(/,"trimParens":/^\s*\(?(.*?)\)?\s*$/};
OpenLayers.Format.prototype.initialize.apply(this,[_3c6]);
},read:function(wkt){
var _3c8,type,str;
var _3c9=this.regExes.typeStr.exec(wkt);
if(_3c9){
type=_3c9[1].toLowerCase();
str=_3c9[2];
if(this.parse[type]){
_3c8=this.parse[type].apply(this,[str]);
}
}
return _3c8;
},write:function(geom){
var _3cb,geometry,type,data,isCollection;
if(geom.constructor==Array){
_3cb=geom;
isCollection=true;
}else{
_3cb=[geom];
isCollection=false;
}
var _3cc=[];
if(isCollection){
_3cc.push("GEOMETRYCOLLECTION(");
}
for(var i=0;i<_3cb.length;++i){
if(isCollection&&i>0){
_3cc.push(",");
}
geometry=_3cb[i];
type=geometry.CLASS_NAME.split(".")[2].toLowerCase();
if(!this.extract[type]){
return null;
}
data=this.extract[type].apply(this,[geometry]);
_3cc.push(type.toUpperCase()+"("+data+")");
}
if(isCollection){
_3cc.push(")");
}
return _3cc.join("");
},extract:{"point":function(_3ce){
return _3ce.x+" "+_3ce.y;
},"multipoint":function(_3cf){
var _3d0=[];
for(var i=0;i<_3cf.components.length;++i){
_3d0.push(this.extract.point.apply(this,[_3cf.components[i]]));
}
return _3d0.join(",");
},"linestring":function(_3d2){
var _3d3=[];
for(var i=0;i<_3d2.components.length;++i){
_3d3.push(this.extract.point.apply(this,[_3d2.components[i]]));
}
return _3d3.join(",");
},"multilinestring":function(_3d5){
var _3d6=[];
for(var i=0;i<_3d5.components.length;++i){
_3d6.push("("+this.extract.linestring.apply(this,[_3d5.components[i]])+")");
}
return _3d6.join(",");
},"polygon":function(_3d8){
var _3d9=[];
for(var i=0;i<_3d8.components.length;++i){
_3d9.push("("+this.extract.linestring.apply(this,[_3d8.components[i]])+")");
}
return _3d9.join(",");
},"multipolygon":function(_3db){
var _3dc=[];
for(var i=0;i<_3db.components.length;++i){
_3dc.push("("+this.extract.polygon.apply(this,[_3db.components[i]])+")");
}
return _3dc.join(",");
}},parse:{"point":function(str){
var _3df=str.trim().split(this.regExes.spaces);
return new OpenLayers.Geometry.Point(_3df[0],_3df[1]);
},"multipoint":function(str){
var _3e1=str.trim().split(",");
var _3e2=[];
for(var i=0;i<_3e1.length;++i){
_3e2.push(this.parse.point.apply(this,[_3e1[i]]));
}
return new OpenLayers.Geometry.MultiPoint(_3e2);
},"linestring":function(str){
var _3e5=str.trim().split(",");
var _3e6=[];
for(var i=0;i<_3e5.length;++i){
_3e6.push(this.parse.point.apply(this,[_3e5[i]]));
}
return new OpenLayers.Geometry.LineString(_3e6);
},"multilinestring":function(str){
var line;
var _3ea=str.trim().split(this.regExes.parenComma);
var _3eb=[];
for(var i=0;i<_3ea.length;++i){
line=_3ea[i].replace(this.regExes.trimParens,"$1");
_3eb.push(this.parse.linestring.apply(this,[line]));
}
return new OpenLayers.Geometry.MultiLineString(_3eb);
},"polygon":function(str){
var ring,linestring,linearring;
var _3ef=str.trim().split(this.regExes.parenComma);
var _3f0=[];
for(var i=0;i<_3ef.length;++i){
ring=_3ef[i].replace(this.regExes.trimParens,"$1");
linestring=this.parse.linestring.apply(this,[ring]);
linearring=new OpenLayers.Geometry.LinearRing(linestring.components);
_3f0.push(linearring);
}
return new OpenLayers.Geometry.Polygon(_3f0);
},"multipolygon":function(str){
var _3f3;
var _3f4=str.trim().split(this.regExes.doubleParenComma);
var _3f5=[];
for(var i=0;i<_3f4.length;++i){
_3f3=_3f4[i].replace(this.regExes.trimParens,"$1");
_3f5.push(this.parse.polygon.apply(this,[_3f3]));
}
return new OpenLayers.Geometry.MultiPolygon(_3f5);
},"geometrycollection":function(str){
str=str.replace(/,\s*([A-Za-z])/g,"|$1");
var _3f8=str.trim().split("|");
var _3f9=[];
for(var i=0;i<_3f8.length;++i){
_3f9.push(OpenLayers.Format.WKT.prototype.read.apply(this,[_3f8[i]]));
}
return _3f9;
}},CLASS_NAME:"OpenLayers.Format.WKT"});
OpenLayers.Handler.Drag=OpenLayers.Class.create();
OpenLayers.Handler.Drag.prototype=OpenLayers.Class.inherit(OpenLayers.Handler,{started:false,dragging:false,start:null,oldOnselectstart:null,initialize:function(_3fb,_3fc,_3fd){
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},mousedown:function(evt){
if(this.checkModifiers(evt)&&OpenLayers.Event.isLeftClick(evt)){
this.started=true;
this.dragging=false;
this.start=evt.xy.clone();
this.map.div.style.cursor="move";
this.callback("down",[evt.xy]);
OpenLayers.Event.stop(evt);
return false;
}
return true;
},mousemove:function(evt){
if(this.started){
this.dragging=true;
this.callback("move",[evt.xy]);
if(document.onselectstart){
if(!this.oldOnselectstart){
this.oldOnselectstart=document.onselectstart;
document.onselectstart=function(){
return false;
};
}
}
}
return true;
},mouseup:function(evt){
if(this.started){
this.started=false;
this.dragging=false;
this.map.div.style.cursor="";
this.callback("up",[evt.xy]);
if(document.onselectstart){
document.onselectstart=this.oldOnselectstart;
}
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
}
return true;
},click:function(evt){
if(OpenLayers.Event.isLeftClick(evt)&&this.dragging){
this.dragging=true;
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
OpenLayers.Handler.Keyboard=OpenLayers.Class.create();
OpenLayers.Handler.Keyboard.prototype=OpenLayers.Class.inherit(OpenLayers.Handler,{KEY_EVENTS:["keydown","keypress","keyup"],eventListener:null,initialize:function(){
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
OpenLayers.Map=OpenLayers.Class.create();
OpenLayers.Map.TILE_WIDTH=256;
OpenLayers.Map.TILE_HEIGHT=256;
OpenLayers.Map.prototype={Z_INDEX_BASE:{BaseLayer:100,Overlay:325,Popup:750,Control:1000},EVENT_TYPES:["addlayer","removelayer","changelayer","movestart","move","moveend","zoomend","popupopen","popupclose","addmarker","removemarker","clearmarkers","mouseover","mouseout","mousemove","dragstart","drag","dragend","changebaselayer"],id:null,events:null,unloadDestroy:null,div:null,size:null,viewPortDiv:null,layerContainerOrigin:null,layerContainerDiv:null,layers:null,controls:null,popups:null,baseLayer:null,center:null,zoom:0,viewRequestID:0,tileSize:null,projection:"EPSG:4326",units:"degrees",maxResolution:1.40625,minResolution:null,maxScale:null,minScale:null,maxExtent:null,minExtent:null,numZoomLevels:16,theme:null,fallThrough:false,initialize:function(div,_407){
this.setOptions(_407);
this.id=OpenLayers.Util.createUniqueID("OpenLayers.Map_");
this.div=div=OpenLayers.Util.getElement(div);
var id=div.id+"_OpenLayers_ViewPort";
this.viewPortDiv=OpenLayers.Util.createDiv(id,null,null,null,"relative",null,"hidden");
this.viewPortDiv.style.width="100%";
this.viewPortDiv.style.height="100%";
this.viewPortDiv.className="olMapViewport";
this.div.appendChild(this.viewPortDiv);
id=div.id+"_OpenLayers_Container";
this.layerContainerDiv=OpenLayers.Util.createDiv(id);
this.layerContainerDiv.style.zIndex=this.Z_INDEX_BASE["Popup"]-1;
this.viewPortDiv.appendChild(this.layerContainerDiv);
this.events=new OpenLayers.Events(this,div,this.EVENT_TYPES,this.fallThrough);
this.updateSize();
this.events.register("movestart",this,this.updateSize);
if(navigator.appName.contains("Microsoft")){
this.events.register("resize",this,this.updateSize);
}else{
OpenLayers.Event.observe(window,"resize",this.updateSize.bindAsEventListener(this));
}
if(this.theme){
var _409=document.createElement("link");
_409.setAttribute("rel","stylesheet");
_409.setAttribute("type","text/css");
_409.setAttribute("href",this.theme);
document.getElementsByTagName("head")[0].appendChild(_409);
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
this.popups=new Array();
this.unloadDestroy=this.destroy.bindAsEventListener(this);
OpenLayers.Event.observe(window,"unload",this.unloadDestroy);
},destroy:function(){
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
},setOptions:function(_40c){
this.tileSize=new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,OpenLayers.Map.TILE_HEIGHT);
this.maxExtent=new OpenLayers.Bounds(-180,-90,180,90);
this.theme=OpenLayers._getScriptLocation()+"theme/default/style.css";
OpenLayers.Util.extend(this,_40c);
},getTileSize:function(){
return this.tileSize;
},getLayer:function(id){
var _40e=null;
for(var i=0;i<this.layers.length;i++){
var _410=this.layers[i];
if(_410.id==id){
_40e=_410;
}
}
return _40e;
},setLayerZIndex:function(_411,zIdx){
_411.setZIndex(this.Z_INDEX_BASE[_411.isBaseLayer?"BaseLayer":"Overlay"]+zIdx*5);
},addLayer:function(_413){
for(var i=0;i<this.layers.length;i++){
if(this.layers[i]==_413){
return false;
}
}
_413.div.style.overflow="";
this.setLayerZIndex(_413,this.layers.length);
if(_413.isFixed){
this.viewPortDiv.appendChild(_413.div);
}else{
this.layerContainerDiv.appendChild(_413.div);
}
this.layers.push(_413);
_413.setMap(this);
if(_413.isBaseLayer){
if(this.baseLayer==null){
this.setBaseLayer(_413);
}else{
_413.setVisibility(false);
}
}else{
if(this.getCenter()!=null){
_413.moveTo(this.getExtent(),true);
}
}
this.events.triggerEvent("addlayer");
},addLayers:function(_415){
for(var i=0;i<_415.length;i++){
this.addLayer(_415[i]);
}
},removeLayer:function(_417,_418){
if(_418==null){
_418=true;
}
if(_417.isFixed){
this.viewPortDiv.removeChild(_417.div);
}else{
this.layerContainerDiv.removeChild(_417.div);
}
_417.map=null;
OpenLayers.Util.removeItem(this.layers,_417);
if(_418&&(this.baseLayer==_417)){
this.baseLayer=null;
for(i=0;i<this.layers.length;i++){
var _419=this.layers[i];
if(_419.isBaseLayer){
this.setBaseLayer(_419);
break;
}
}
}
this.events.triggerEvent("removelayer");
},getNumLayers:function(){
return this.layers.length;
},getLayerIndex:function(_41a){
return OpenLayers.Util.indexOf(this.layers,_41a);
},setLayerIndex:function(_41b,idx){
var base=this.getLayerIndex(_41b);
if(idx<0){
idx=0;
}else{
if(idx>this.layers.length){
idx=this.layers.length;
}
}
if(base!=idx){
this.layers.splice(base,1);
this.layers.splice(idx,0,_41b);
for(var i=0;i<this.layers.length;i++){
this.setLayerZIndex(this.layers[i],i);
}
this.events.triggerEvent("changelayer");
}
},raiseLayer:function(_41f,_420){
var idx=this.getLayerIndex(_41f)+_420;
this.setLayerIndex(_41f,idx);
},setBaseLayer:function(_422,_423){
var _424=null;
if(this.baseLayer){
_424=this.baseLayer.getExtent();
}
if(_422!=this.baseLayer){
if(OpenLayers.Util.indexOf(this.layers,_422)!=-1){
if(this.baseLayer!=null){
this.baseLayer.setVisibility(false,_423);
}
this.baseLayer=_422;
this.viewRequestID++;
this.baseLayer.setVisibility(true,_423);
var _425=this.getCenter();
if(_425!=null){
if(_424==null){
this.setCenter(_425,this.getZoom(),false,true);
}else{
this.setCenter(_424.getCenterLonLat(),this.getZoomForExtent(_424),false,true);
}
}
if((_423==null)||(_423==false)){
this.events.triggerEvent("changebaselayer");
}
}
}
},addControl:function(_426,px){
this.controls.push(_426);
this.addControlToMap(_426,px);
},addControlToMap:function(_428,px){
_428.outsideViewport=(_428.div!=null);
_428.setMap(this);
var div=_428.draw(px);
if(div){
if(!_428.outsideViewport){
div.style.zIndex=this.Z_INDEX_BASE["Control"]+this.controls.length;
this.viewPortDiv.appendChild(div);
}
}
},addPopup:function(_42b,_42c){
if(_42c){
for(var i=0;i<this.popups.length;i++){
this.removePopup(this.popups[i]);
}
}
_42b.map=this;
this.popups.push(_42b);
var _42e=_42b.draw();
if(_42e){
_42e.style.zIndex=this.Z_INDEX_BASE["Popup"]+this.popups.length;
this.layerContainerDiv.appendChild(_42e);
}
},removePopup:function(_42f){
OpenLayers.Util.removeItem(this.popups,_42f);
if(_42f.div){
try{
this.layerContainerDiv.removeChild(_42f.div);
}
catch(e){
}
}
_42f.map=null;
},getSize:function(){
var size=null;
if(this.size!=null){
size=this.size.clone();
}
return size;
},updateSize:function(){
this.events.element.offsets=null;
var _431=this.getCurrentSize();
var _432=this.getSize();
if(_432==null){
this.size=_432=_431;
}
if(!_431.equals(_432)){
this.size=_431;
for(var i=0;i<this.layers.length;i++){
this.layers[i].onMapResize();
}
if(this.baseLayer!=null){
var _434=new OpenLayers.Pixel(_431.w/2,_431.h/2);
var _435=this.getLonLatFromViewPortPx(_434);
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
},calculateBounds:function(_439,_43a){
var _43b=null;
if(_439==null){
_439=this.getCenter();
}
if(_43a==null){
_43a=this.getResolution();
}
if((_439!=null)&&(_43a!=null)){
var size=this.getSize();
var _43d=size.w*_43a;
var _43e=size.h*_43a;
_43b=new OpenLayers.Bounds(_439.lon-_43d/2,_439.lat-_43e/2,_439.lon+_43d/2,_439.lat+_43e/2);
}
return _43b;
},getCenter:function(){
return this.center;
},getZoom:function(){
return this.zoom;
},pan:function(dx,dy){
var _441=this.getViewPortPxFromLonLat(this.getCenter());
var _442=_441.add(dx,dy);
if(!_442.equals(_441)){
var _443=this.getLonLatFromViewPortPx(_442);
this.setCenter(_443);
}
},setCenter:function(_444,zoom,_446,_447){
if(!this.center&&!this.isValidLonLat(_444)){
_444=this.maxExtent.getCenterLonLat();
}
var _448=_447||((this.isValidZoomLevel(zoom))&&(zoom!=this.getZoom()));
var _449=(this.isValidLonLat(_444))&&(!_444.equals(this.center));
if(_448||_449||!_446){
if(!_446){
this.events.triggerEvent("movestart");
}
if(_449){
if((!_448)&&(this.center)){
this.centerLayerContainer(_444);
}
this.center=_444.clone();
}
if((_448)||(this.layerContainerOrigin==null)){
this.layerContainerOrigin=this.center.clone();
this.layerContainerDiv.style.left="0px";
this.layerContainerDiv.style.top="0px";
}
if(_448){
this.zoom=zoom;
for(var i=0;i<this.popups.length;i++){
this.popups[i].updatePosition();
}
this.viewRequestID++;
}
var _44b=this.getExtent();
this.baseLayer.moveTo(_44b,_448,_446);
for(var i=0;i<this.layers.length;i++){
var _44c=this.layers[i];
if(!_44c.isBaseLayer){
var _44d;
var _44e=_44c.calculateInRange();
if(_44c.inRange!=_44e){
_44c.inRange=_44e;
_44d=true;
this.events.triggerEvent("changelayer");
}else{
_44d=(_44c.visibility&&_44c.inRange);
}
if(_44d){
_44c.moveTo(_44b,_448,_446);
}
}
}
this.events.triggerEvent("move");
if(_448){
this.events.triggerEvent("zoomend");
}
}
if(!_446){
this.events.triggerEvent("moveend");
}
},centerLayerContainer:function(_44f){
var _450=this.getViewPortPxFromLonLat(this.layerContainerOrigin);
var _451=this.getViewPortPxFromLonLat(_44f);
if((_450!=null)&&(_451!=null)){
this.layerContainerDiv.style.left=(_450.x-_451.x)+"px";
this.layerContainerDiv.style.top=(_450.y-_451.y)+"px";
}
},isValidZoomLevel:function(_452){
return ((_452!=null)&&(_452>=0)&&(_452<this.getNumZoomLevels()));
},isValidLonLat:function(_453){
var _454=false;
if(_453!=null){
var _455=this.getMaxExtent();
_454=_455.containsLonLat(_453);
}
return _454;
},getProjection:function(){
var _456=null;
if(this.baseLayer!=null){
_456=this.baseLayer.projection;
}
return _456;
},getMaxResolution:function(){
var _457=null;
if(this.baseLayer!=null){
_457=this.baseLayer.maxResolution;
}
return _457;
},getMaxExtent:function(){
var _458=null;
if(this.baseLayer!=null){
_458=this.baseLayer.maxExtent;
}
return _458;
},getNumZoomLevels:function(){
var _459=null;
if(this.baseLayer!=null){
_459=this.baseLayer.numZoomLevels;
}
return _459;
},getExtent:function(){
var _45a=null;
if(this.baseLayer!=null){
_45a=this.baseLayer.getExtent();
}
return _45a;
},getResolution:function(){
var _45b=null;
if(this.baseLayer!=null){
_45b=this.baseLayer.getResolution();
}
return _45b;
},getScale:function(){
var _45c=null;
if(this.baseLayer!=null){
var res=this.getResolution();
var _45e=this.baseLayer.units;
_45c=OpenLayers.Util.getScaleFromResolution(res,_45e);
}
return _45c;
},getZoomForExtent:function(_45f){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForExtent(_45f);
}
return zoom;
},getZoomForResolution:function(_461){
var zoom=null;
if(this.baseLayer!=null){
zoom=this.baseLayer.getZoomForResolution(_461);
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
},zoomToExtent:function(_464){
this.setCenter(_464.getCenterLonLat(),this.getZoomForExtent(_464));
},zoomToMaxExtent:function(){
this.zoomToExtent(this.getMaxExtent());
},zoomToScale:function(_465){
var res=OpenLayers.Util.getResolutionFromScale(_465,this.baseLayer.units);
var size=this.getSize();
var _468=size.w*res;
var _469=size.h*res;
var _46a=this.getCenter();
var _46b=new OpenLayers.Bounds(_46a.lon-_468/2,_46a.lat-_469/2,_46a.lon+_468/2,_46a.lat+_469/2);
this.zoomToExtent(_46b);
},getLonLatFromViewPortPx:function(_46c){
var _46d=null;
if(this.baseLayer!=null){
_46d=this.baseLayer.getLonLatFromViewPortPx(_46c);
}
return _46d;
},getViewPortPxFromLonLat:function(_46e){
var px=null;
if(this.baseLayer!=null){
px=this.baseLayer.getViewPortPxFromLonLat(_46e);
}
return px;
},getLonLatFromPixel:function(px){
return this.getLonLatFromViewPortPx(px);
},getPixelFromLonLat:function(_471){
return this.getViewPortPxFromLonLat(_471);
},getViewPortPxFromLayerPx:function(_472){
var _473=null;
if(_472!=null){
var dX=parseInt(this.layerContainerDiv.style.left);
var dY=parseInt(this.layerContainerDiv.style.top);
_473=_472.add(dX,dY);
}
return _473;
},getLayerPxFromViewPortPx:function(_476){
var _477=null;
if(_476!=null){
var dX=-parseInt(this.layerContainerDiv.style.left);
var dY=-parseInt(this.layerContainerDiv.style.top);
_477=_476.add(dX,dY);
if(isNaN(_477.x)||isNaN(_477.y)){
_477=null;
}
}
return _477;
},getLonLatFromLayerPx:function(px){
px=this.getViewPortPxFromLayerPx(px);
return this.getLonLatFromViewPortPx(px);
},getLayerPxFromLonLat:function(_47b){
var px=this.getViewPortPxFromLonLat(_47b);
return this.getLayerPxFromViewPortPx(px);
},CLASS_NAME:"OpenLayers.Map"};
OpenLayers.Marker=OpenLayers.Class.create();
OpenLayers.Marker.prototype={icon:null,lonlat:null,events:null,map:null,initialize:function(_47d,icon){
this.lonlat=_47d;
var _47f=(icon)?icon:OpenLayers.Marker.defaultIcon();
if(this.icon==null){
this.icon=_47f;
}else{
this.icon.url=_47f.url;
this.icon.size=_47f.size;
this.icon.offset=_47f.offset;
this.icon.calculateOffset=_47f.calculateOffset;
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
var _482=false;
if(this.map){
var _483=this.map.getExtent();
_482=_483.containsLonLat(this.lonlat);
}
return _482;
},inflate:function(_484){
if(this.icon){
var _485=new OpenLayers.Size(this.icon.size.w*_484,this.icon.size.h*_484);
this.icon.setSize(_485);
}
},setOpacity:function(_486){
this.icon.setOpacity(_486);
},display:function(_487){
this.icon.display(_487);
},CLASS_NAME:"OpenLayers.Marker"};
OpenLayers.Marker.defaultIcon=function(){
var url=OpenLayers.Util.getImagesLocation()+"marker.png";
var size=new OpenLayers.Size(21,25);
var _48a=function(size){
return new OpenLayers.Pixel(-(size.w/2),-size.h);
};
return new OpenLayers.Icon(url,size,null,_48a);
};
OpenLayers.Popup.AnchoredBubble=OpenLayers.Class.create();
OpenLayers.Popup.AnchoredBubble.CORNER_SIZE=5;
OpenLayers.Popup.AnchoredBubble.prototype=OpenLayers.Class.inherit(OpenLayers.Popup.Anchored,{rounded:false,initialize:function(id,_48d,size,_48f,_490,_491){
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
var _494=this.size.clone();
_494.h-=(2*OpenLayers.Popup.AnchoredBubble.CORNER_SIZE);
_494.h-=(2*this.padding);
this.contentDiv.style.height=_494.h+"px";
this.contentDiv.style.width=_494.w+"px";
if(this.map){
this.setRicoCorners(!this.rounded);
this.rounded=true;
}
}
},setBackgroundColor:function(_495){
if(_495!=undefined){
this.backgroundColor=_495;
}
if(this.div!=null){
if(this.contentDiv!=null){
this.div.style.background="transparent";
OpenLayers.Rico.Corner.changeColor(this.contentDiv,this.backgroundColor);
}
}
},setOpacity:function(_496){
if(_496!=undefined){
this.opacity=_496;
}
if(this.div!=null){
if(this.contentDiv!=null){
OpenLayers.Rico.Corner.changeOpacity(this.contentDiv,this.opacity);
}
}
},setBorder:function(_497){
this.border=0;
},setRicoCorners:function(_498){
var _499=this.getCornersToRound(this.relativePosition);
var _49a={corners:_499,color:this.backgroundColor,bgColor:"transparent",blend:false};
if(_498){
OpenLayers.Rico.Corner.round(this.div,_49a);
}else{
OpenLayers.Rico.Corner.reRound(this.contentDiv,_49a);
this.setBackgroundColor();
this.setOpacity();
}
},getCornersToRound:function(){
var _49b=["tl","tr","bl","br"];
var _49c=OpenLayers.Bounds.oppositeQuadrant(this.relativePosition);
OpenLayers.Util.removeItem(_49b,_49c);
return _49b.join(" ");
},CLASS_NAME:"OpenLayers.Popup.AnchoredBubble"});
OpenLayers.Renderer.SVG=OpenLayers.Class.create();
OpenLayers.Renderer.SVG.prototype=OpenLayers.Class.inherit(OpenLayers.Renderer.Elements,{xmlns:"http://www.w3.org/2000/svg",initialize:function(_49d){
if(!this.supported()){
return;
}
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _49e="http://www.w3.org/TR/SVG11/feature#SVG";
var _49f=(document.implementation.hasFeature("org.w3c.svg","1.0")||document.implementation.hasFeature(_49e,"1.1"));
return _49f;
},setExtent:function(_4a0){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _4a1=this.getResolution();
var _4a2=_4a0.left/_4a1+" "+-_4a0.top/_4a1+" "+_4a0.getWidth()/_4a1+" "+_4a0.getHeight()/_4a1;
this.rendererRoot.setAttributeNS(null,"viewBox",_4a2);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.setAttributeNS(null,"width",this.size.w);
this.rendererRoot.setAttributeNS(null,"height",this.size.h);
},getNodeType:function(_4a4){
var _4a5=null;
switch(_4a4.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_4a5="circle";
break;
case "OpenLayers.Geometry.Rectangle":
_4a5="rect";
break;
case "OpenLayers.Geometry.LineString":
_4a5="polyline";
break;
case "OpenLayers.Geometry.LinearRing":
_4a5="polygon";
break;
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_4a5="path";
break;
default:
break;
}
return _4a5;
},reprojectNode:function(node){
this.drawGeometryNode(node);
},setStyle:function(node,_4a8,_4a9){
_4a8=_4a8||node.olStyle;
_4a9=_4a9||node.olOptions;
if(node.geometry.CLASS_NAME=="OpenLayers.Geometry.Point"){
node.setAttributeNS(null,"r",_4a8.pointRadius);
}
if(_4a9.isFilled){
node.setAttributeNS(null,"fill",_4a8.fillColor);
node.setAttributeNS(null,"fill-opacity",_4a8.fillOpacity);
}else{
node.setAttributeNS(null,"fill","none");
}
if(_4a9.isStroked){
node.setAttributeNS(null,"stroke",_4a8.strokeColor);
node.setAttributeNS(null,"stroke-opacity",_4a8.strokeOpacity);
node.setAttributeNS(null,"stroke-width",_4a8.strokeWidth);
}else{
node.setAttributeNS(null,"stroke","none");
}
if(_4a8.pointerEvents){
node.setAttributeNS(null,"pointer-events",_4a8.pointerEvents);
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
var _4b0=this.nodeFactory(id,"svg");
return _4b0;
},createRoot:function(){
var id=this.container.id+"_root";
var root=this.nodeFactory(id,"g");
root.setAttributeNS(null,"transform","scale(1, -1)");
return root;
},drawPoint:function(node,_4b4){
this.drawCircle(node,_4b4,1);
},drawCircle:function(node,_4b6,_4b7){
var _4b8=this.getResolution();
node.setAttributeNS(null,"cx",_4b6.x/_4b8);
node.setAttributeNS(null,"cy",_4b6.y/_4b8);
node.setAttributeNS(null,"r",_4b7);
},drawLineString:function(node,_4ba){
node.setAttributeNS(null,"points",this.getComponentsString(_4ba.components));
},drawLinearRing:function(node,_4bc){
node.setAttributeNS(null,"points",this.getComponentsString(_4bc.components));
},drawPolygon:function(node,_4be){
var d="";
for(var j=0;j<_4be.components.length;j++){
var _4c1=_4be.components[j];
d+=" M";
for(var i=0;i<_4c1.components.length;i++){
d+=" "+this.getShortString(_4c1.components[i]);
}
}
d+=" z";
node.setAttributeNS(null,"d",d);
node.setAttributeNS(null,"fill-rule","evenodd");
},drawRectangle:function(node,_4c4){
node.setAttributeNS(null,"x",_4c4.x/resolution);
node.setAttributeNS(null,"y",_4c4.y/resolution);
node.setAttributeNS(null,"width",_4c4.width);
node.setAttributeNS(null,"height",_4c4.height);
},drawCurve:function(node,_4c6){
var d=null;
for(var i=0;i<_4c6.components.length;i++){
if((i%3)==0&&(i/3)==0){
d="M "+this.getShortString(_4c6.components[i]);
}else{
if((i%3)==1){
d+=" C "+this.getShortString(_4c6.components[i]);
}else{
d+=" "+this.getShortString(_4c6.components[i]);
}
}
}
node.setAttributeNS(null,"d",d);
},drawSurface:function(node,_4ca){
var d=null;
for(var i=0;i<_4ca.components.length;i++){
if((i%3)==0&&(i/3)==0){
d="M "+this.getShortString(_4ca.components[i]);
}else{
if((i%3)==1){
d+=" C "+this.getShortString(_4ca.components[i]);
}else{
d+=" "+this.getShortString(_4ca.components[i]);
}
}
}
d+=" Z";
node.setAttributeNS(null,"d",d);
},getComponentsString:function(_4cd){
var _4ce=[];
for(var i=0;i<_4cd.length;i++){
_4ce.push(this.getShortString(_4cd[i]));
}
return _4ce.join(",");
},getShortString:function(_4d0){
var _4d1=this.getResolution();
return _4d0.x/_4d1+","+_4d0.y/_4d1;
},CLASS_NAME:"OpenLayers.Renderer.SVG"});
OpenLayers.Renderer.VML=OpenLayers.Class.create();
OpenLayers.Renderer.VML.prototype=OpenLayers.Class.inherit(OpenLayers.Renderer.Elements,{xmlns:"urn:schemas-microsoft-com:vml",initialize:function(_4d2){
if(!this.supported()){
return;
}
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
var _4d3=document.createStyleSheet();
_4d3.addRule("v\\:*","behavior: url(#default#VML); "+"position: relative; display: inline-block;");
OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments);
},destroy:function(){
OpenLayers.Renderer.Elements.prototype.destroy.apply(this,arguments);
},supported:function(){
var _4d4=document.namespaces;
return _4d4;
},setExtent:function(_4d5){
OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments);
var _4d6=this.getResolution();
var org=_4d5.left/_4d6+" "+_4d5.top/_4d6;
this.root.setAttribute("coordorigin",org);
var size=_4d5.getWidth()/_4d6+" "+-_4d5.getHeight()/_4d6;
this.root.setAttribute("coordsize",size);
},setSize:function(size){
OpenLayers.Renderer.prototype.setSize.apply(this,arguments);
this.rendererRoot.style.width=this.size.w;
this.rendererRoot.style.height=this.size.h;
this.root.style.width="100%";
this.root.style.height="100%";
},getNodeType:function(_4da){
var _4db=null;
switch(_4da.CLASS_NAME){
case "OpenLayers.Geometry.Point":
_4db="v:oval";
break;
case "OpenLayers.Geometry.Rectangle":
_4db="v:rect";
break;
case "OpenLayers.Geometry.LineString":
case "OpenLayers.Geometry.LinearRing":
case "OpenLayers.Geometry.Polygon":
case "OpenLayers.Geometry.Curve":
case "OpenLayers.Geometry.Surface":
_4db="v:shape";
break;
default:
break;
}
return _4db;
},reprojectNode:function(node){
this.drawGeometryNode(node);
},setStyle:function(node,_4de,_4df){
_4de=_4de||node.olStyle;
_4df=_4df||node.olOptions;
if(node.geometry.CLASS_NAME=="OpenLayers.Geometry.Point"){
this.drawCircle(node,node.geometry,_4de.pointRadius);
}
var _4e0=(_4df.isFilled)?_4de.fillColor:"none";
node.setAttribute("fillcolor",_4e0);
var _4e1=node.getElementsByTagName("fill");
var fill=(_4e1.length==0)?null:_4e1[0];
if(!_4df.isFilled){
if(fill){
node.removeChild(fill);
}
}else{
if(!fill){
fill=this.createNode("v:fill",node.id+"_fill");
node.appendChild(fill);
}
fill.setAttribute("opacity",_4de.fillOpacity);
}
var _4e3=(_4df.isStroked)?_4de.strokeColor:"none";
node.setAttribute("strokecolor",_4e3);
node.setAttribute("strokeweight",_4de.strokeWidth);
var _4e4=node.getElementsByTagName("stroke");
var _4e5=(_4e4.length==0)?null:_4e4[0];
if(!_4df.isStroked){
if(_4e5){
node.removeChild(_4e5);
}
}else{
if(!_4e5){
_4e5=this.createNode("v:stroke",node.id+"_stroke");
node.appendChild(_4e5);
}
_4e5.setAttribute("opacity",_4de.strokeOpacity);
}
},setNodeDimension:function(node,_4e7){
var bbox=_4e7.getBounds();
var _4e9=this.getResolution();
var _4ea=new OpenLayers.Bounds((bbox.left/_4e9).toFixed(),(bbox.bottom/_4e9).toFixed(),(bbox.right/_4e9).toFixed(),(bbox.top/_4e9).toFixed());
node.style.left=_4ea.left;
node.style.top=_4ea.top;
node.style.width=_4ea.getWidth();
node.style.height=_4ea.getHeight();
node.coordorigin=_4ea.left+" "+_4ea.top;
node.coordsize=_4ea.getWidth()+" "+_4ea.getHeight();
},createNode:function(type,id){
var node=document.createElement(type);
if(id){
node.setAttribute("id",id);
}
return node;
},nodeTypeCompare:function(node,type){
var _4f0=type;
var _4f1=_4f0.indexOf(":");
if(_4f1!=-1){
_4f0=_4f0.substr(_4f1+1);
}
var _4f2=node.nodeName;
_4f1=_4f2.indexOf(":");
if(_4f1!=-1){
_4f2=_4f2.substr(_4f1+1);
}
return (_4f0==_4f2);
},createRenderRoot:function(){
var id=this.container.id+"_vmlRoot";
var _4f4=this.nodeFactory(id,"div");
return _4f4;
},createRoot:function(){
var id=this.container.id+"_root";
var root=this.nodeFactory(id,"v:group");
return root;
},drawPoint:function(node,_4f8){
this.drawCircle(node,node.geometry,1);
},drawCircle:function(node,_4fa,_4fb){
var _4fc=this.getResolution();
node.style.left=(_4fa.x/_4fc).toFixed()-_4fb;
node.style.top=(_4fa.y/_4fc).toFixed()-_4fb;
var _4fd=_4fb*2;
node.style.width=_4fd;
node.style.height=_4fd;
},drawLineString:function(node,_4ff){
this.drawLine(node,_4ff,false);
},drawLinearRing:function(node,_501){
this.drawLine(node,_501,true);
},drawLine:function(node,_503,_504){
this.setNodeDimension(node,_503);
var _505=this.getResolution();
var path="m";
for(var i=0;i<_503.components.length;i++){
var x=(_503.components[i].x/_505);
var y=(_503.components[i].y/_505);
path+=" "+x.toFixed()+","+y.toFixed()+" l ";
}
if(_504){
path+=" x";
}
path+=" e";
node.path=path;
},drawPolygon:function(node,_50b){
this.setNodeDimension(node,_50b);
var _50c=this.getResolution();
var path="";
for(var j=0;j<_50b.components.length;j++){
var _50f=_50b.components[j];
path+="m";
for(var i=0;i<_50f.components.length;i++){
var x=_50f.components[i].x/_50c;
var y=_50f.components[i].y/_50c;
path+=" "+x.toFixed()+","+y.toFixed();
if(i==0){
path+=" l";
}
}
path+=" x ";
}
path+="e";
node.path=path;
},drawRectangle:function(node,_514){
var _515=this.getResolution();
node.style.left=_514.x/_515;
node.style.top=_514.y/_515;
node.style.width=_514.width/_515;
node.style.height=_514.height/_515;
},drawCurve:function(node,_517){
this.setNodeDimension(node,_517);
var _518=this.getResolution();
var path="";
for(var i=0;i<_517.components.length;i++){
var x=_517.components[i].x/_518;
var y=_517.components[i].y/_518;
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
},drawSurface:function(node,_51e){
this.setNodeDimension(node,_51e);
var _51f=this.getResolution();
var path="";
for(var i=0;i<_51e.components.length;i++){
var x=_51e.components[i].x/_51f;
var y=_51e.components[i].y/_51f;
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
OpenLayers.Tile.Image=OpenLayers.Class.create();
OpenLayers.Tile.Image.prototype=OpenLayers.Class.inherit(OpenLayers.Tile,{imgDiv:null,frame:null,initialize:function(_524,_525,_526,url,size){
OpenLayers.Tile.prototype.initialize.apply(this,arguments);
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
if(this.imgDiv==null){
this.initImgDiv();
}
this.imgDiv.viewRequestID=this.layer.map.viewRequestID;
this.url=this.layer.getURL(this.bounds);
OpenLayers.Util.modifyDOMElement(this.frame,null,this.position,this.size);
if(this.layer.alpha){
OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,null,null,this.layer.imageSize,this.url);
}else{
this.imgDiv.src=this.url;
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,this.layer.imageSize);
}
this.drawn=true;
return true;
},clear:function(){
OpenLayers.Tile.prototype.clear.apply(this,arguments);
if(this.imgDiv){
this.imgDiv.style.display="none";
}
},moveTo:function(_529,_52a,_52b){
if(this.layer!=this.layer.map.baseLayer&&this.layer.reproject){
_529=this.getBoundsFromBaseLayer(_52a);
}
this.url=this.layer.getURL(_529);
OpenLayers.Tile.prototype.moveTo.apply(this,arguments);
},initImgDiv:function(){
if(this.layer.alpha){
this.imgDiv=OpenLayers.Util.createAlphaImageDiv(null,this.layer.imageOffset,this.layer.imageSize,null,"relative",null,null,null,true);
}else{
this.imgDiv=OpenLayers.Util.createImage(null,this.layer.imageOffset,this.layer.imageSize,null,"relative",null,null,true);
}
this.imgDiv.className="olTileImage";
this.frame.appendChild(this.imgDiv);
this.layer.div.appendChild(this.frame);
if(this.layer.opacity!=null){
OpenLayers.Util.modifyDOMElement(this.imgDiv,null,null,null,null,null,null,this.layer.opacity);
}
this.imgDiv.map=this.layer.map;
},checkImgURL:function(){
if(this.layer){
var _52c=this.layer.alpha?this.imgDiv.firstChild.src:this.imgDiv.src;
if(!OpenLayers.Util.isEquivalentUrl(_52c,this.url)){
this.imgDiv.style.display="none";
}
}
},CLASS_NAME:"OpenLayers.Tile.Image"});
OpenLayers.Tile.WFS=OpenLayers.Class.create();
OpenLayers.Tile.WFS.prototype=OpenLayers.Class.inherit(OpenLayers.Tile,{features:null,url:null,initialize:function(_52d,_52e,_52f,url,size){
var _532=arguments;
_532=[_52d,_52e,_52f,null,size];
OpenLayers.Tile.prototype.initialize.apply(this,_532);
this.url=url;
this.features=new Array();
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
},loadFeaturesForRegion:function(_533,_534){
OpenLayers.loadURL(this.url,null,this,_533);
},requestSuccess:function(_535){
var doc=_535.responseXML;
if(!doc||_535.fileType!="XML"){
doc=OpenLayers.parseXMLString(_535.responseText);
}
if(this.layer.vectorMode){
var gml=new OpenLayers.Format.GML({extractAttributes:this.layer.options.extractAttributes});
this.layer.addFeatures(gml.read(doc));
}else{
var _538=OpenLayers.Ajax.getElementsByTagNameNS(doc,"http://www.opengis.net/gml","gml","featureMember");
this.addResults(_538);
}
},addResults:function(_539){
for(var i=0;i<_539.length;i++){
var _53b=new this.layer.featureClass(this.layer,_539[i]);
this.features.push(_53b);
}
},destroyAllFeatures:function(){
while(this.features.length>0){
var _53c=this.features.shift();
_53c.destroy();
}
},CLASS_NAME:"OpenLayers.Tile.WFS"});
OpenLayers.Control.DragPan=OpenLayers.Class.create();
OpenLayers.Control.DragPan.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,draw:function(){
this.handler=new OpenLayers.Handler.Drag(this,{"move":this.panMap,"up":this.panMapDone});
},panMap:function(xy){
var _53e=this.handler.start.x-xy.x;
var _53f=this.handler.start.y-xy.y;
var size=this.map.getSize();
var _541=new OpenLayers.Pixel(size.w/2+_53e,size.h/2+_53f);
var _542=this.map.getLonLatFromViewPortPx(_541);
this.map.setCenter(_542,null,true);
this.handler.start=xy;
},panMapDone:function(xy){
var _544=this.handler.start.x-xy.x;
var _545=this.handler.start.y-xy.y;
var size=this.map.getSize();
var _547=new OpenLayers.Pixel(size.w/2+_544,size.h/2+_545);
var _548=this.map.getLonLatFromViewPortPx(_547);
this.map.setCenter(_548,null,false);
this.handler.start=xy;
},CLASS_NAME:"OpenLayers.Control.DragPan"});
OpenLayers.Control.KeyboardDefaults=OpenLayers.Class.create();
OpenLayers.Control.KeyboardDefaults.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{slideFactor:50,initialize:function(){
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
this.map.pan(-50,0);
break;
case OpenLayers.Event.KEY_RIGHT:
this.map.pan(50,0);
break;
case OpenLayers.Event.KEY_UP:
this.map.pan(0,-50);
break;
case OpenLayers.Event.KEY_DOWN:
this.map.pan(0,50);
break;
case 33:
case 43:
this.map.zoomIn();
break;
case 45:
case 34:
this.map.zoomOut();
break;
}
},CLASS_NAME:"OpenLayers.Control.KeyboardDefaults"});
OpenLayers.Feature=OpenLayers.Class.create();
OpenLayers.Feature.prototype={events:null,layer:null,id:null,lonlat:null,data:null,marker:null,popup:null,initialize:function(_54a,_54b,data){
this.layer=_54a;
this.lonlat=_54b;
this.data=(data!=null)?data:new Object();
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
var _54d=false;
if((this.layer!=null)&&(this.layer.map!=null)){
var _54e=this.layer.map.getExtent();
_54d=_54e.containsLonLat(this.lonlat);
}
return _54d;
},createMarker:function(){
var _54f=null;
if(this.lonlat!=null){
this.marker=new OpenLayers.Marker(this.lonlat,this.data.icon);
}
return this.marker;
},destroyMarker:function(){
this.marker.destroy();
},createPopup:function(){
if(this.lonlat!=null){
var id=this.id+"_popup";
var _551=(this.marker)?this.marker.icon:null;
this.popup=new OpenLayers.Popup.AnchoredBubble(id,this.lonlat,this.data.popupSize,this.data.popupContentHTML,_551);
}
return this.popup;
},destroyPopup:function(){
this.popup.destroy();
},CLASS_NAME:"OpenLayers.Feature"};
OpenLayers.Geometry=OpenLayers.Class.create();
OpenLayers.Geometry.prototype={id:null,parent:null,bounds:null,feature:null,initialize:function(){
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
},destroy:function(){
this.id=null;
this.bounds=null;
this.feature=null;
},setBounds:function(_552){
if(_552){
this.bounds=_552.clone();
}
},clearBounds:function(){
this.bounds=null;
if(this.parent){
this.parent.clearBounds();
}
},extendBounds:function(_553){
var _554=this.getBounds();
if(!_554){
this.setBounds(_553);
}else{
this.bounds.extend(_553);
}
},getBounds:function(){
if(this.bounds==null){
this.calculateBounds();
}
return this.bounds;
},calculateBounds:function(){
},atPoint:function(_555,_556,_557){
var _558=false;
var _559=this.getBounds();
if((_559!=null)&&(_555!=null)){
var dX=(_556!=null)?_556:0;
var dY=(_557!=null)?_557:0;
var _55c=new OpenLayers.Bounds(this.bounds.left-dX,this.bounds.bottom-dY,this.bounds.right+dX,this.bounds.top+dY);
_558=_55c.containsLonLat(_555);
}
return _558;
},getLength:function(){
return 0;
},getArea:function(){
return 0;
},toString:function(){
return OpenLayers.Format.WKT.prototype.write(this);
},CLASS_NAME:"OpenLayers.Geometry"};
OpenLayers.Layer=OpenLayers.Class.create();
OpenLayers.Layer.prototype={id:null,name:null,div:null,EVENT_TYPES:["loadstart","loadend","loadcancel"],events:null,map:null,isBaseLayer:false,alpha:false,displayInLayerSwitcher:true,visibility:true,inRange:false,imageSize:null,imageOffset:null,options:null,gutter:0,projection:null,units:null,scales:null,resolutions:null,maxExtent:null,minExtent:null,maxResolution:null,minResolution:null,numZoomLevels:null,minScale:null,maxScale:null,displayOutsideMaxExtent:false,initialize:function(name,_55e){
this.options=OpenLayers.Util.extend(new Object(),_55e);
OpenLayers.Util.extend(this,this.options);
this.name=name;
this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_");
if(this.div==null){
this.div=OpenLayers.Util.createDiv();
this.div.style.width="100%";
this.div.style.height="100%";
this.div.id=this.id;
}
this.events=new OpenLayers.Events(this,this.div,this.EVENT_TYPES);
},destroy:function(_55f){
if(_55f==null){
_55f=true;
}
if(this.map!=null){
this.map.removeLayer(this,_55f);
}
this.map=null;
this.name=null;
this.div=null;
this.options=null;
this.events.destroy();
this.events=null;
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer(this.name,this.options);
}
OpenLayers.Util.applyDefaults(obj,this);
obj.map=null;
return obj;
},setName:function(_561){
this.name=_561;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
},addOptions:function(_562){
OpenLayers.Util.extend(this.options,_562);
OpenLayers.Util.extend(this,_562);
},onMapResize:function(){
},moveTo:function(_563,_564,_565){
var _566=this.visibility;
if(!this.isBaseLayer){
_566=_566&&this.inRange;
}
this.display(_566);
},setMap:function(map){
this.map=map;
this.maxExtent=this.maxExtent||this.map.maxExtent;
this.projection=this.projection||this.map.projection;
this.units=this.units||this.map.units;
this.initResolutions();
if(!this.isBaseLayer){
this.inRange=this.calculateInRange();
}
this.setTileSize();
},setTileSize:function(size){
var _569=(size)?size:((this.tileSize)?this.tileSize:this.map.getTileSize());
this.tileSize=_569;
if(this.gutter){
this.imageOffset=new OpenLayers.Pixel(-this.gutter,-this.gutter);
this.imageSize=new OpenLayers.Size(_569.w+(2*this.gutter),_569.h+(2*this.gutter));
}else{
this.imageSize=_569;
this.imageOffset=new OpenLayers.Pixel(0,0);
}
},getVisibility:function(){
return this.visibility;
},setVisibility:function(_56a,_56b){
if(_56a!=this.visibility){
this.visibility=_56a;
this.display(_56a);
if(this.map!=null){
var _56c=this.map.getExtent();
if(_56c!=null){
this.moveTo(_56c,true);
}
}
if((this.map!=null)&&((_56b==null)||(_56b==false))){
this.map.events.triggerEvent("changelayer");
}
}
},display:function(_56d){
if(_56d!=(this.div.style.display!="none")){
this.div.style.display=(_56d)?"block":"none";
}
},calculateInRange:function(){
var _56e=false;
if(this.map){
var _56f=this.map.getResolution();
_56e=((_56f>=this.minResolution)&&(_56f<=this.maxResolution));
}
return _56e;
},setIsBaseLayer:function(_570){
this.isBaseLayer=_570;
if(this.map!=null){
this.map.events.triggerEvent("changelayer");
}
},initResolutions:function(){
var _571=new Array("projection","units","scales","resolutions","maxScale","minScale","maxResolution","minResolution","minExtent","maxExtent","numZoomLevels","maxZoomLevel");
var _572=new Object();
for(var i=0;i<_571.length;i++){
var _574=_571[i];
_572[_574]=this.options[_574]||this.map[_574];
}
if((!_572.numZoomLevels)&&(_572.maxZoomLevel)){
_572.numZoomLevels=_572.maxZoomLevel+1;
}
if((_572.scales!=null)||(_572.resolutions!=null)){
if(_572.scales!=null){
_572.resolutions=new Array();
for(var i=0;i<_572.scales.length;i++){
var _575=_572.scales[i];
_572.resolutions[i]=OpenLayers.Util.getResolutionFromScale(_575,_572.units);
}
}
_572.numZoomLevels=_572.resolutions.length;
}else{
_572.resolutions=new Array();
if(_572.minScale){
_572.maxResolution=OpenLayers.Util.getResolutionFromScale(_572.minScale,_572.units);
}else{
if(_572.maxResolution=="auto"){
var _576=this.map.getSize();
var wRes=_572.maxExtent.getWidth()/_576.w;
var hRes=_572.maxExtent.getHeight()/_576.h;
_572.maxResolution=Math.max(wRes,hRes);
}
}
if(_572.maxScale!=null){
_572.minResolution=OpenLayers.Util.getResolutionFromScale(_572.maxScale);
}else{
if((_572.minResolution=="auto")&&(_572.minExtent!=null)){
var _576=this.map.getSize();
var wRes=_572.minExtent.getWidth()/_576.w;
var hRes=_572.minExtent.getHeight()/_576.h;
_572.minResolution=Math.max(wRes,hRes);
}
}
if(_572.minResolution!=null){
var _579=_572.maxResolution/_572.minResolution;
_572.numZoomLevels=Math.floor(Math.log(_579)/Math.log(2))+1;
}
for(var i=0;i<_572.numZoomLevels;i++){
var res=_572.maxResolution/Math.pow(2,i);
_572.resolutions.push(res);
}
}
_572.resolutions.sort(function(a,b){
return (b-a);
});
this.resolutions=_572.resolutions;
this.maxResolution=_572.resolutions[0];
var _57d=_572.resolutions.length-1;
this.minResolution=_572.resolutions[_57d];
this.scales=new Array();
for(var i=0;i<_572.resolutions.length;i++){
this.scales[i]=OpenLayers.Util.getScaleFromResolution(_572.resolutions[i],_572.units);
}
this.minScale=this.scales[0];
this.maxScale=this.scales[this.scales.length-1];
this.numZoomLevels=_572.numZoomLevels;
},getResolution:function(){
var zoom=this.map.getZoom();
return this.resolutions[zoom];
},getExtent:function(){
return this.map.calculateBounds();
},getZoomForExtent:function(_57f){
var _580=this.map.getSize();
var _581=Math.max(_57f.getWidth()/_580.w,_57f.getHeight()/_580.h);
return this.getZoomForResolution(_581);
},getZoomForResolution:function(_582){
for(var i=1;i<this.resolutions.length;i++){
if(this.resolutions[i]<_582){
break;
}
}
return (i-1);
},getLonLatFromViewPortPx:function(_584){
var _585=null;
if(_584!=null){
var size=this.map.getSize();
var _587=this.map.getCenter();
var res=this.map.getResolution();
var _589=_584.x-(size.w/2);
var _58a=_584.y-(size.h/2);
_585=new OpenLayers.LonLat(_587.lon+_589*res,_587.lat-_58a*res);
}
return _585;
},getViewPortPxFromLonLat:function(_58b){
var px=null;
if(_58b!=null){
var _58d=this.map.getResolution();
var _58e=this.map.getExtent();
px=new OpenLayers.Pixel(Math.round(1/_58d*(_58b.lon-_58e.left)),Math.round(1/_58d*(_58e.top-_58b.lat)));
}
return px;
},adjustBoundsByGutter:function(_58f){
var _590=this.gutter*this.map.getResolution();
_58f=new OpenLayers.Bounds(_58f.left-_590,_58f.bottom-_590,_58f.right+_590,_58f.top+_590);
return _58f;
},setOpacity:function(_591){
this.opacity=_591;
for(var i=0;i<this.div.childNodes.length;++i){
var _593=this.div.childNodes[i].firstChild;
OpenLayers.Util.modifyDOMElement(_593,null,null,null,null,null,null,_591);
}
},setZIndex:function(zIdx){
this.div.style.zIndex=zIdx;
},CLASS_NAME:"OpenLayers.Layer"};
OpenLayers.Marker.Box=OpenLayers.Class.create();
OpenLayers.Marker.Box.prototype=OpenLayers.Class.inherit(OpenLayers.Marker,{bounds:null,div:null,initialize:function(_595,_596,_597){
this.bounds=_595;
this.div=OpenLayers.Util.createDiv();
this.div.style.overflow="hidden";
this.events=new OpenLayers.Events(this,this.div,null);
this.setBorder(_596,_597);
},setBorder:function(_598,_599){
if(!_598){
_598="red";
}
if(!_599){
_599=2;
}
this.div.style.border=_599+"px solid "+_598;
},draw:function(px,sz){
OpenLayers.Util.modifyDOMElement(this.div,null,px,sz);
return this.div;
},onScreen:function(){
var _59c=false;
if(this.map){
var _59d=this.map.getExtent();
_59c=_59d.containsBounds(this.bounds,true,true);
}
return _59c;
},display:function(_59e){
this.div.style.display=(_59e)?"":"none";
},CLASS_NAME:"OpenLayers.Marker.Box"});
OpenLayers.Control.Navigation=OpenLayers.Class.create();
OpenLayers.Control.Navigation.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{dragPan:null,zoomBox:null,wheelHandler:null,activate:function(){
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
var _5a0=this.map.getLonLatFromViewPortPx(evt.xy);
this.map.setCenter(_5a0,this.map.zoom+1);
OpenLayers.Event.stop(evt);
return false;
},wheelChange:function(evt,_5a2){
var _5a3=this.map.getZoom()+_5a2;
if(!this.map.isValidZoomLevel(_5a3)){
return;
}
var size=this.map.getSize();
var _5a5=size.w/2-evt.xy.x;
var _5a6=evt.xy.y-size.h/2;
var _5a7=this.map.baseLayer.resolutions[_5a3];
var _5a8=this.map.getLonLatFromPixel(evt.xy);
var _5a9=new OpenLayers.LonLat(_5a8.lon+_5a5*_5a7,_5a8.lat+_5a6*_5a7);
this.map.setCenter(_5a9,_5a3);
},wheelUp:function(evt){
this.wheelChange(evt,1);
},wheelDown:function(evt){
this.wheelChange(evt,-1);
},CLASS_NAME:"OpenLayers.Control.Navigation"});
OpenLayers.State={UNKNOWN:"Unknown",INSERT:"Insert",UPDATE:"Update",DELETE:"Delete"};
OpenLayers.Feature.Vector=OpenLayers.Class.create();
OpenLayers.Feature.Vector.prototype=OpenLayers.Class.inherit(OpenLayers.Feature,{fid:null,geometry:null,attributes:{},state:null,style:null,initialize:function(_5ac,data,_5ae){
OpenLayers.Feature.prototype.initialize.apply(this,[null,null,data]);
this.lonlat=null;
this.setGeometry(_5ac);
this.state=null;
if(data){
OpenLayers.Util.extend(this.attributes,data);
}
this.style=_5ae?_5ae:null;
},destroy:function(){
if(this.layer){
this.layer.removeFeatures(this);
this.layer=null;
}
this.geometry=null;
OpenLayers.Feature.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Feature(null,this.geometry.clone(),this.data);
}
OpenLayers.Util.applyDefaults(obj,this);
return obj;
},onScreen:function(){
return null;
},createMarker:function(){
return null;
},destroyMarker:function(){
},createPopup:function(){
return null;
},setFid:function(fid){
this.fid=fid;
},setGeometry:function(_5b1,_5b2){
if(_5b1){
this.geometry=_5b1;
this.geometry.feature=this;
if(_5b2!=false){
this._setGeometryFeatureReference(this.geometry,this);
}
}
},_setGeometryFeatureReference:function(_5b3,_5b4){
_5b3.feature=_5b4;
if(_5b3.components){
for(var i=0;i<_5b3.components.length;i++){
this._setGeometryFeatureReference(_5b3.components[i],_5b4);
}
}
},setAttributes:function(_5b6){
this.attributes=_5b6;
},atPoint:function(_5b7,_5b8,_5b9){
var _5ba=false;
if(this.geometry){
_5ba=this.geometry.atPoint(_5b7,_5b8,_5b9);
}
return _5ba;
},destroyPopup:function(){
},toState:function(_5bb){
if(_5bb==OpenLayers.State.UPDATE){
switch(this.state){
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.DELETE:
this.state=_5bb;
break;
case OpenLayers.State.UPDATE:
case OpenLayers.State.INSERT:
break;
}
}else{
if(_5bb==OpenLayers.State.INSERT){
switch(this.state){
case OpenLayers.State.UNKNOWN:
break;
default:
this.state=_5bb;
break;
}
}else{
if(_5bb==OpenLayers.State.DELETE){
switch(this.state){
case OpenLayers.State.INSERT:
break;
case OpenLayers.State.DELETE:
break;
case OpenLayers.State.UNKNOWN:
case OpenLayers.State.UPDATE:
this.state=_5bb;
break;
}
}else{
if(_5bb==OpenLayers.State.UNKNOWN){
this.state=_5bb;
}
}
}
}
},CLASS_NAME:"OpenLayers.Feature.Vector"});
OpenLayers.Feature.Vector.style={"default":{fillColor:"#ee9900",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"#ee9900",strokeOpacity:1,strokeWidth:1,hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"},"select":{fillColor:"blue",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"blue",strokeOpacity:1,strokeWidth:2,hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"},"temporary":{fillColor:"yellow",fillOpacity:0.2,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"yellow",strokeOpacity:1,strokeWidth:4,hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted"}};
OpenLayers.Feature.WFS=OpenLayers.Class.create();
OpenLayers.Feature.WFS.prototype=OpenLayers.Class.inherit(OpenLayers.Feature,{initialize:function(_5bc,_5bd){
var _5be=arguments;
var data=this.processXMLNode(_5bd);
_5be=new Array(_5bc,data.lonlat,data);
OpenLayers.Feature.prototype.initialize.apply(this,_5be);
this.createMarker();
this.layer.addMarker(this.marker);
},destroy:function(){
if(this.marker!=null){
this.layer.removeMarker(this.marker);
}
OpenLayers.Feature.prototype.destroy.apply(this,arguments);
},processXMLNode:function(_5c0){
var _5c1=OpenLayers.Ajax.getElementsByTagNameNS(_5c0,"http://www.opengis.net/gml","gml","Point");
var text=OpenLayers.Util.getXmlNodeValue(OpenLayers.Ajax.getElementsByTagNameNS(_5c1[0],"http://www.opengis.net/gml","gml","coordinates")[0]);
var _5c3=text.split(",");
return {lonlat:new OpenLayers.LonLat(parseFloat(_5c3[0]),parseFloat(_5c3[1])),id:null};
},CLASS_NAME:"OpenLayers.Feature.WFS"});
OpenLayers.Geometry.Collection=OpenLayers.Class.create();
OpenLayers.Geometry.Collection.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry,{components:null,componentTypes:null,initialize:function(_5c4){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.components=new Array();
if(_5c4!=null){
this.addComponents(_5c4);
}
},destroy:function(){
this.components.length=0;
this.components=null;
},clone:function(){
var _5c5=eval("new "+this.CLASS_NAME+"()");
for(var i=0;i<this.components.length;i++){
_5c5.addComponent(this.components[i].clone());
}
OpenLayers.Util.applyDefaults(_5c5,this);
return _5c5;
},getComponents:function(){
return this.components;
},getComponentsString:function(){
var _5c7=[];
for(var i=0;i<this.components.length;i++){
_5c7.push(this.components[i].toShortString());
}
return _5c7.join(",");
},calculateBounds:function(){
this.bounds=null;
if(!this.components||(this.components.length>0)){
this.setBounds(this.components[0].getBounds());
for(var i=1;i<this.components.length;i++){
this.extendBounds(this.components[i].getBounds());
}
}
},addComponents:function(_5ca){
if(!(_5ca instanceof Array)){
_5ca=[_5ca];
}
for(var i=0;i<_5ca.length;i++){
this.addComponent(_5ca[i]);
}
},addComponent:function(_5cc,_5cd){
var _5ce=false;
if(_5cc){
if(this.componentTypes==null||(OpenLayers.Util.indexOf(this.componentTypes,_5cc.CLASS_NAME)>-1)){
if(_5cd!=null&&(_5cd<this.components.length)){
var _5cf=this.components.slice(0,_5cd);
var _5d0=this.components.slice(_5cd,this.components.length);
_5cf.push(_5cc);
this.components=_5cf.concat(_5d0);
}else{
this.components.push(_5cc);
}
_5cc.parent=this;
this.clearBounds();
_5ce=true;
}
}
return _5ce;
},removeComponents:function(_5d1){
if(!(_5d1 instanceof Array)){
_5d1=[_5d1];
}
for(var i=0;i<_5d1.length;i++){
this.removeComponent(_5d1[i]);
}
},removeComponent:function(_5d3){
OpenLayers.Util.removeItem(this.components,_5d3);
this.clearBounds();
},getLength:function(){
var _5d4=0;
for(var i=0;i<this.components.length;i++){
_5d4+=this.components[i].getLength();
}
return _5d4;
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
},equals:function(_5db){
var _5dc=true;
if(!_5db.CLASS_NAME||(this.CLASS_NAME!=_5db.CLASS_NAME)){
_5dc=false;
}else{
if(!(_5db.components instanceof Array)||(_5db.components.length!=this.components.length)){
_5dc=false;
}else{
for(var i=0;i<this.components.length;++i){
if(!this.components[i].equals(_5db.components[i])){
_5dc=false;
break;
}
}
}
}
return _5dc;
},CLASS_NAME:"OpenLayers.Geometry.Collection"});
OpenLayers.Geometry.Point=OpenLayers.Class.create();
OpenLayers.Geometry.Point.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry,{x:null,y:null,initialize:function(x,y){
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
},distanceTo:function(_5e1){
var _5e2=0;
if((this.x!=null)&&(this.y!=null)&&(_5e1!=null)&&(_5e1.x!=null)&&(_5e1.y!=null)){
var dx2=Math.pow(this.x-_5e1.x,2);
var dy2=Math.pow(this.y-_5e1.y,2);
_5e2=Math.sqrt(dx2+dy2);
}
return _5e2;
},equals:function(geom){
var _5e6=false;
if(geom!=null){
_5e6=((this.x==geom.x&&this.y==geom.y)||(isNaN(this.x)&&isNaN(this.y)&&isNaN(geom.x)&&isNaN(geom.y)));
}
return _5e6;
},toShortString:function(){
return (this.x+", "+this.y);
},move:function(x,y){
this.x=this.x+x;
this.y=this.y+y;
},CLASS_NAME:"OpenLayers.Geometry.Point"});
OpenLayers.Geometry.Rectangle=OpenLayers.Class.create();
OpenLayers.Geometry.Rectangle.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry,{x:null,y:null,width:null,height:null,initialize:function(x,y,_5eb,_5ec){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
this.x=x;
this.y=y;
this.width=_5eb;
this.height=_5ec;
},calculateBounds:function(){
this.bounds=new OpenLayers.Bounds(this.x,this.y,this.x+this.width,this.y+this.height);
},getLength:function(){
var _5ed=(2*this.width)+(2*this.height);
return _5ed;
},getArea:function(){
var area=this.width*this.height;
return area;
},CLASS_NAME:"OpenLayers.Geometry.Rectangle"});
OpenLayers.Geometry.Surface=OpenLayers.Class.create();
OpenLayers.Geometry.Surface.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry,{initialize:function(){
OpenLayers.Geometry.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.Surface"});
OpenLayers.Layer.Canvas=OpenLayers.Class.create();
OpenLayers.Layer.Canvas.prototype=OpenLayers.Class.inherit(OpenLayers.Layer,{isBaseLayer:false,isFixed:true,canvas:null,lines:new Array(),initialize:function(name,_5f0){
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
},destroy:function(){
canvas=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},moveTo:function(_5f1,_5f2,_5f3){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
this.redraw();
},setStrokeColor:function(_5f4){
var ctx=this.canvas.getContext("2d");
ctx.strokeStyle=_5f4;
},setStrokeWidth:function(_5f6){
var ctx=this.canvas.getContext("2d");
ctx.lineWidth=_5f6;
},setAlpha:function(_5f8){
var ctx=this.canvas.getContext("2d");
ctx.globalAlpha=_5f8;
},clearCanvas:function(){
if(this.canvas!=null){
this.canvas.getContext("2d").clearRect(0,0,this.map.getSize().w,this.map.getSize().h);
}
},drawLine:function(_5fa,end){
var ctx=this.canvas.getContext("2d");
this.addLine(_5fa,end);
this.lines.push(new Array(_5fa,end,ctx.strokeStyle,ctx.lineWidth,ctx.globalAlpha));
},addLine:function(_5fd,end){
var ctx=this.canvas.getContext("2d");
var _600=this.map.getPixelFromLonLat(_5fd);
var _601=this.map.getPixelFromLonLat(end);
ctx.beginPath();
ctx.moveTo(_600.x,_600.y);
ctx.lineTo(_601.x,_601.y);
ctx.closePath();
ctx.stroke();
},redraw:function(){
if(!this.canvas){
this.canvas=document.createElement("CANVAS");
this.canvas.setAttribute("width",this.map.getSize().w);
this.canvas.setAttribute("height",this.map.getSize().h);
this.div.appendChild(this.canvas);
}else{
this.clearCanvas();
}
for(var i=0;i<this.lines.length;i++){
this.setStrokeColor(this.lines[i][2]);
this.setStrokeWidth(this.lines[i][3]);
this.setAlpha(this.lines[i][4]);
this.addLine(this.lines[i][0],this.lines[i][1]);
}
},CLASS_NAME:"OpenLayers.Layer.Canvas"});
OpenLayers.Layer.EventPane=OpenLayers.Class.create();
OpenLayers.Layer.EventPane.prototype=OpenLayers.Class.inherit(OpenLayers.Layer,{isBaseLayer:true,isFixed:true,pane:null,mapObject:null,initialize:function(name,_604){
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
if(/MSIE/.test(navigator.userAgent)){
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
var _606=this.map.getSize();
msgW=Math.min(_606.w,300);
msgH=Math.min(_606.h,200);
var size=new OpenLayers.Size(msgW,msgH);
var _608=new OpenLayers.Pixel(_606.w/2,_606.h/2);
var _609=_608.add(-size.w/2,-size.h/2);
var div=OpenLayers.Util.createDiv(this.name+"_warning",_609,size,null,null,null,"auto");
div.style.padding="7px";
div.style.backgroundColor="yellow";
div.innerHTML=this.getWarningHTML();
this.div.appendChild(div);
},display:function(_60b){
OpenLayers.Layer.prototype.display.apply(this,arguments);
this.pane.style.display=this.div.style.display;
},setZIndex:function(_60c){
OpenLayers.Layer.prototype.setZIndex.apply(this,arguments);
this.pane.style.zIndex=parseInt(this.div.style.zIndex)+1;
},moveTo:function(_60d,_60e,_60f){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(this.mapObject!=null){
var _610=this.map.getCenter();
var _611=this.map.getZoom();
if(_610!=null){
var _612=this.getMapObjectCenter();
var _613=this.getOLLonLatFromMapObjectLonLat(_612);
var _614=this.getMapObjectZoom();
var _615=this.getOLZoomFromMapObjectZoom(_614);
if(!(_610.equals(_613))||!(_611==_615)){
var _616=this.getMapObjectLonLatFromOLLonLat(_610);
var zoom=this.getMapObjectZoomFromOLZoom(_611);
this.setMapObjectCenter(_616,zoom);
}
}
}
},getLonLatFromViewPortPx:function(_618){
var _619=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _61a=this.getMapObjectPixelFromOLPixel(_618);
var _61b=this.getMapObjectLonLatFromMapObjectPixel(_61a);
_619=this.getOLLonLatFromMapObjectLonLat(_61b);
}
return _619;
},getViewPortPxFromLonLat:function(_61c){
var _61d=null;
if((this.mapObject!=null)&&(this.getMapObjectCenter()!=null)){
var _61e=this.getMapObjectLonLatFromOLLonLat(_61c);
var _61f=this.getMapObjectPixelFromMapObjectLonLat(_61e);
_61d=this.getOLPixelFromMapObjectPixel(_61f);
}
return _61d;
},getOLLonLatFromMapObjectLonLat:function(_620){
var _621=null;
if(_620!=null){
var lon=this.getLongitudeFromMapObjectLonLat(_620);
var lat=this.getLatitudeFromMapObjectLonLat(_620);
_621=new OpenLayers.LonLat(lon,lat);
}
return _621;
},getMapObjectLonLatFromOLLonLat:function(_624){
var _625=null;
if(_624!=null){
_625=this.getMapObjectLonLatFromLonLat(_624.lon,_624.lat);
}
return _625;
},getOLPixelFromMapObjectPixel:function(_626){
var _627=null;
if(_626!=null){
var x=this.getXFromMapObjectPixel(_626);
var y=this.getYFromMapObjectPixel(_626);
_627=new OpenLayers.Pixel(x,y);
}
return _627;
},getMapObjectPixelFromOLPixel:function(_62a){
var _62b=null;
if(_62a!=null){
_62b=this.getMapObjectPixelFromXY(_62a.x,_62a.y);
}
return _62b;
},CLASS_NAME:"OpenLayers.Layer.EventPane"});
OpenLayers.Layer.FixedZoomLevels=OpenLayers.Class.create();
OpenLayers.Layer.FixedZoomLevels.prototype={initialize:function(){
},initResolutions:function(){
var _62c=new Array("minZoomLevel","maxZoomLevel","numZoomLevels");
for(var i=0;i<_62c.length;i++){
var _62e=_62c[i];
this[_62e]=(this.options[_62e]!=null)?this.options[_62e]:this.map[_62e];
}
if((this.minZoomLevel==null)||(this.minZoomLevel<this.MIN_ZOOM_LEVEL)){
this.minZoomLevel=this.MIN_ZOOM_LEVEL;
}
var _62f=this.MAX_ZOOM_LEVEL-this.minZoomLevel+1;
if(this.numZoomLevels!=null){
this.numZoomLevels=Math.min(this.numZoomLevels,_62f);
}else{
if(this.maxZoomLevel!=null){
var _630=this.maxZoomLevel-this.minZoomLevel+1;
this.numZoomLevels=Math.min(_630,_62f);
}else{
this.numZoomLevels=_62f;
}
}
this.maxZoomLevel=this.minZoomLevel+this.numZoomLevels-1;
if(this.RESOLUTIONS!=null){
var _631=0;
this.resolutions=[];
for(var i=this.minZoomLevel;i<this.numZoomLevels;i++){
this.resolutions[_631++]=this.RESOLUTIONS[i];
}
}
},getResolution:function(){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getResolution.apply(this,arguments);
}else{
var _632=null;
var _633=this.map.getSize();
var _634=this.getExtent();
if((_633!=null)&&(_634!=null)){
_632=Math.max(_634.getWidth()/_633.w,_634.getHeight()/_633.h);
}
return _632;
}
},getExtent:function(){
var _635=null;
var size=this.map.getSize();
var tlPx=new OpenLayers.Pixel(0,0);
var tlLL=this.getLonLatFromViewPortPx(tlPx);
var brPx=new OpenLayers.Pixel(size.w,size.h);
var brLL=this.getLonLatFromViewPortPx(brPx);
if((tlLL!=null)&&(brLL!=null)){
_635=new OpenLayers.Bounds(tlLL.lon,brLL.lat,brLL.lon,tlLL.lat);
}
return _635;
},getZoomForResolution:function(_63b){
if(this.resolutions!=null){
return OpenLayers.Layer.prototype.getZoomForResolution.apply(this,arguments);
}else{
var _63c=OpenLayers.Layer.prototype.getExtent.apply(this,[_63b]);
return this.getZoomForExtent(_63c);
}
},getOLZoomFromMapObjectZoom:function(_63d){
var zoom=null;
if(_63d!=null){
zoom=_63d-this.minZoomLevel;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_63f){
var zoom=null;
if(_63f!=null){
zoom=_63f+this.minZoomLevel;
}
return zoom;
},CLASS_NAME:"FixedZoomLevels.js"};
OpenLayers.Layer.HTTPRequest=OpenLayers.Class.create();
OpenLayers.Layer.HTTPRequest.prototype=OpenLayers.Class.inherit(OpenLayers.Layer,{URL_HASH_FACTOR:(Math.sqrt(5)-1)/2,url:null,params:null,reproject:false,initialize:function(name,url,_643,_644){
var _645=arguments;
_645=[name,_644];
OpenLayers.Layer.prototype.initialize.apply(this,_645);
this.url=url;
this.params=OpenLayers.Util.extend(new Object(),_643);
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
},setUrl:function(_647){
this.url=_647;
},mergeNewParams:function(_648){
this.params=OpenLayers.Util.extend(this.params,_648);
},selectUrl:function(_649,urls){
var _64b=1;
for(var i=0;i<_649.length;i++){
_64b*=_649.charCodeAt(i)*this.URL_HASH_FACTOR;
_64b-=Math.floor(_64b);
}
return urls[Math.floor(_64b*urls.length)];
},getFullRequestString:function(_64d,_64e){
var url=_64e||this.url;
var _650=OpenLayers.Util.extend(new Object(),this.params);
_650=OpenLayers.Util.extend(_650,_64d);
var _651=OpenLayers.Util.getParameterString(_650);
if(url instanceof Array){
url=this.selectUrl(_651,url);
}
var _652=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getArgs(url));
for(var key in _650){
if(key.toUpperCase() in _652){
delete _650[key];
}
}
_651=OpenLayers.Util.getParameterString(_650);
var _654=url;
if(_651!=""){
var _655=url.charAt(url.length-1);
if((_655=="&")||(_655=="?")){
_654+=_651;
}else{
if(url.indexOf("?")==-1){
_654+="?"+_651;
}else{
_654+="&"+_651;
}
}
}
return _654;
},CLASS_NAME:"OpenLayers.Layer.HTTPRequest"});
OpenLayers.Layer.Image=OpenLayers.Class.create();
OpenLayers.Layer.Image.prototype=OpenLayers.Class.inherit(OpenLayers.Layer,{isBaseLayer:true,url:null,extent:null,size:null,tile:null,aspectRatio:null,initialize:function(name,url,_658,size,_65a){
this.url=url;
this.extent=_658;
this.size=size;
OpenLayers.Layer.prototype.initialize.apply(this,[name,_65a]);
this.aspectRatio=(this.extent.getHeight()/this.size.h)/(this.extent.getWidth()/this.size.w);
},destroy:function(){
this.tile.destroy();
this.tile=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.Image(this.name,this.url,this.extent,this.size,this.options);
}
obj=OpenLayers.Layer.prototype.clone.apply(this,[obj]);
return obj;
},setMap:function(map){
if(this.options.maxResolution==null){
this.options.maxResolution=this.extent.getWidth()/this.size.w;
}
OpenLayers.Layer.prototype.setMap.apply(this,arguments);
},moveTo:function(_65d,_65e,_65f){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
var _660=(this.tile==null);
if(_65e||_660){
var _661=this.extent.getWidth()/this.map.getResolution();
var _662=this.extent.getHeight()/(this.map.getResolution()*this.aspectRatio);
var _663=new OpenLayers.Size(_661,_662);
var ul=new OpenLayers.LonLat(this.extent.left,this.extent.top);
var ulPx=this.map.getLayerPxFromLonLat(ul);
if(_660){
this.tile=new OpenLayers.Tile.Image(this,ulPx,this.extent,this.url,_663);
}else{
this.tile.size=_663.clone();
this.tile.position=ulPx.clone();
}
this.tile.draw();
}
},setUrl:function(_666){
this.url=_666;
this.draw();
},getURL:function(_667){
return this.url;
},CLASS_NAME:"OpenLayers.Layer.Image"});
OpenLayers.Layer.Markers=OpenLayers.Class.create();
OpenLayers.Layer.Markers.prototype=OpenLayers.Class.inherit(OpenLayers.Layer,{isBaseLayer:false,markers:null,initialize:function(name,_669){
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
this.markers=new Array();
},destroy:function(){
this.clearMarkers();
markers=null;
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
},moveTo:function(_66a,_66b,_66c){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(_66b){
this.redraw();
}
},addMarker:function(_66d){
this.markers.push(_66d);
if(this.map&&this.map.getExtent()){
_66d.map=this.map;
this.drawMarker(_66d);
}
},removeMarker:function(_66e){
OpenLayers.Util.removeItem(this.markers,_66e);
if((_66e.icon!=null)&&(_66e.icon.imageDiv!=null)&&(_66e.icon.imageDiv.parentNode==this.div)){
this.div.removeChild(_66e.icon.imageDiv);
}
},clearMarkers:function(){
if(this.markers!=null){
while(this.markers.length>0){
this.removeMarker(this.markers[0]);
}
}
},redraw:function(){
for(i=0;i<this.markers.length;i++){
this.drawMarker(this.markers[i]);
}
},drawMarker:function(_66f){
var px=this.map.getLayerPxFromLonLat(_66f.lonlat);
if(px==null){
_66f.display(false);
}else{
var _671=_66f.draw(px);
if(!_66f.drawn){
this.div.appendChild(_671);
_66f.drawn=true;
}
}
},CLASS_NAME:"OpenLayers.Layer.Markers"});
OpenLayers.Layer.Vector=OpenLayers.Class.create();
OpenLayers.Layer.Vector.prototype=OpenLayers.Class.inherit(OpenLayers.Layer,{isBaseLayer:false,isFixed:false,isVector:true,features:null,selectedFeatures:[],editing:false,editable:false,reportError:true,style:null,renderers:["SVG","VML"],renderer:null,geometryType:null,drawn:false,initialize:function(name,_673){
OpenLayers.Layer.prototype.initialize.apply(this,arguments);
if(!this.renderer||!this.renderer.supported()){
this.assignRenderer();
}
if(!this.renderer||!this.renderer.supported()){
this.renderer=null;
this.displayError();
}
this.features=new Array();
this.selectedFeatures=new Array();
},destroy:function(){
OpenLayers.Layer.prototype.destroy.apply(this,arguments);
this.features=null;
this.selectedFeatures=null;
this.editing=null;
this.editable=null;
if(this.renderer){
this.renderer.destroy();
}
this.renderer=null;
this.geometryType=null;
this.drawn=null;
},assignRenderer:function(){
for(var i=0;i<this.renderers.length;i++){
var _675=OpenLayers.Renderer[this.renderers[i]];
if(_675&&_675.prototype.supported()){
this.renderer=new _675(this.div);
break;
}
}
},displayError:function(){
if(this.reportError){
var _676="Your browser does not support vector rendering. "+"Currently supported renderers are:\n";
_676+=this.renderers.join("\n");
alert(_676);
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
},moveTo:function(_678,_679,_67a){
OpenLayers.Layer.prototype.moveTo.apply(this,arguments);
if(!_67a){
this.div.style.left=-parseInt(this.map.layerContainerDiv.style.left)+"px";
this.div.style.top=-parseInt(this.map.layerContainerDiv.style.top)+"px";
var _67b=this.map.getExtent();
this.renderer.setExtent(_67b);
}
if(_679){
this.renderer.reproject();
}
if(!this.drawn){
this.drawn=true;
for(var i=0;i<this.features.length;i++){
var _67d=this.features[i];
this.renderer.drawGeometry(_67d.geometry,_67d.style);
}
}
},addFeatures:function(_67e){
if(!(_67e instanceof Array)){
_67e=[_67e];
}
for(var i=0;i<_67e.length;i++){
var _680=_67e[i];
if(this.geometryType&&!(_680.geometry instanceof this.geometryType)){
var _681="addFeatures : component should be an "+this.geometryType.prototype.CLASS_NAME;
throw _681;
}
this.features.push(_680);
_680.layer=this;
if(!_680.style){
if(this.style){
_680.style=OpenLayers.Util.extend({},this.style);
}else{
_680.style=OpenLayers.Util.extend({},OpenLayers.Feature.Vector.style["default"]);
}
}
this.preFeatureInsert(_680);
if(this.drawn){
this.renderer.drawGeometry(_680.geometry,_680.style);
}
this.onFeatureInsert(_680);
}
},removeFeatures:function(_682){
if(!(_682 instanceof Array)){
_682=[_682];
}
for(var i=0;i<_682.length;i++){
var _684=_682[i];
this.features=OpenLayers.Util.removeItem(this.features,_684);
this.renderer.eraseGeometry(_684.geometry);
}
},destroyFeatures:function(){
for(var i=this.features.length-1;i>=0;i--){
this.features[i].destroy();
}
},redrawFeature:function(fid,_687){
for(var i=0;i<this.features.length;i++){
var _689=this.features[i];
if(_689.fid==fid){
this.renderer.drawGeometry(_689.geometry,_687);
}
}
},unlock:function(){
if(this.editable){
this.editing=true;
}
return this.editable;
},lock:function(){
if(this.editing){
this.editing=false;
}
return this.editing;
},onFeatureInsert:function(_68a){
},preFeatureInsert:function(_68b){
},CLASS_NAME:"OpenLayers.Layer.Vector"});
OpenLayers.Control.DrawFeature=OpenLayers.Class.create();
OpenLayers.Control.DrawFeature.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{layer:null,callbacks:{},featureAdded:function(){
},handlerOptions:null,initialize:function(_68c,_68d,_68e){
OpenLayers.Control.prototype.initialize.apply(this,[_68e]);
this.callbacks=OpenLayers.Util.extend({done:this.drawFeature},this.callbacks);
this.layer=_68c;
this.handler=new _68d(this,this.callbacks,this.handlerOptions);
},drawFeature:function(_68f){
var _690=new OpenLayers.Feature.Vector(_68f);
this.layer.addFeatures([_690]);
this.featureAdded(_690);
},CLASS_NAME:"OpenLayers.Control.DrawFeature"});
OpenLayers.Control.NavToolbar=OpenLayers.Class.create();
OpenLayers.Control.NavToolbar.prototype=OpenLayers.Class.inherit(OpenLayers.Control.Panel,{initialize:function(_691){
OpenLayers.Control.Panel.prototype.initialize.apply(this,arguments);
this.addControls([new OpenLayers.Control.Navigation(),new OpenLayers.Control.ZoomBox()]);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.NavToolbar"});
OpenLayers.Control.SelectFeature=OpenLayers.Class.create();
OpenLayers.Control.SelectFeature.prototype=OpenLayers.Class.inherit(OpenLayers.Control,{multiple:false,hover:false,onSelect:function(){
},onUnselect:function(){
},layer:null,callbacks:{},selectStyle:OpenLayers.Feature.Vector.style["select"],handler:null,initialize:function(_693,_694){
OpenLayers.Control.prototype.initialize.apply(this,[_694]);
this.callbacks=OpenLayers.Util.extend({down:this.downFeature,over:this.overFeature,out:this.outFeature},this.callbacks);
this.layer=_693;
this.handler=new OpenLayers.Handler.Feature(this,_693,this.callbacks);
},downFeature:function(_695){
if(this.hover){
return;
}
if(_695.parent){
_695=_695.parent;
}
if(this.multiple){
if(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_695.feature)>-1){
this.unselect(_695);
}else{
this.select(_695);
}
}else{
if(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_695.feature)>-1){
this.unselect(_695);
}else{
if(this.layer.selectedFeatures){
for(var i=0;i<this.layer.selectedFeatures.length;i++){
this.unselect(this.layer.selectedFeatures[i].geometry);
}
}
this.select(_695);
}
}
},overFeature:function(_697){
if(!this.hover){
return;
}
if(_697.parent){
_697=_697.parent;
}
if(!(OpenLayers.Util.indexOf(this.layer.selectedFeatures,_697.feature)>-1)){
this.select(_697);
}
},outFeature:function(_698){
if(!this.hover){
return;
}
if(_698.parent){
_698=_698.parent;
}
this.unselect(_698);
},select:function(_699){
if(_699.feature.originalStyle==null){
_699.feature.originalStyle=_699.feature.style;
}
this.layer.selectedFeatures.push(_699.feature);
this.layer.renderer.drawGeometry(_699,this.selectStyle);
this.onSelect(_699);
},unselect:function(_69a){
if(_69a.feature.originalStyle==null){
_69a.feature.originalStyle=_69a.feature.style;
}
this.layer.renderer.drawGeometry(_69a,_69a.feature.originalStyle);
OpenLayers.Util.removeItem(this.layer.selectedFeatures,_69a.feature);
this.onUnselect(_69a);
},setMap:function(map){
this.handler.setMap(map);
OpenLayers.Control.prototype.setMap.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Control.SelectFeature"});
OpenLayers.Format.GML=OpenLayers.Class.create();
OpenLayers.Format.GML.prototype=OpenLayers.Class.inherit(OpenLayers.Format,{featureNS:"http://mapserver.gis.umn.edu/mapserver",featureName:"featureMember",layerName:"features",geometryName:"geometry",collectionName:"FeatureCollection",gmlns:"http://www.opengis.net/gml",extractAttributes:true,read:function(data){
if(typeof data=="string"){
data=OpenLayers.parseXMLString(data);
}
var _69d=OpenLayers.Ajax.getElementsByTagNameNS(data,this.gmlns,"gml",this.featureName);
if(_69d.length==0){
return [];
}
var dim;
var _69f=OpenLayers.Ajax.getElementsByTagNameNS(_69d[0],this.gmlns,"gml","posList");
if(_69f.length==0){
_69f=OpenLayers.Ajax.getElementsByTagNameNS(_69d[0],this.gmlns,"gml","pos");
}
if(_69f.length>0){
dim=_69f[0].getAttribute("srsDimension");
}
this.dim=(dim=="3"||dim==3)?3:2;
var _6a0=[];
for(var i=0;i<_69d.length;i++){
var _6a2=this.parseFeature(_69d[i]);
if(_6a2){
_6a0.push(_6a2);
}
}
return _6a0;
},parseFeature:function(_6a3){
var geom;
var p;
var _6a6=new OpenLayers.Feature.Vector();
if(_6a3.firstChild.attributes&&_6a3.firstChild.attributes["fid"]){
_6a6.fid=_6a3.firstChild.attributes["fid"].nodeValue;
}
if(OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","MultiPolygon").length!=0){
var _6a7=OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","MultiPolygon")[0];
geom=new OpenLayers.Geometry.MultiPolygon();
var _6a8=OpenLayers.Ajax.getElementsByTagNameNS(_6a7,this.gmlns,"gml","Polygon");
for(var i=0;i<_6a8.length;i++){
polygon=this.parsePolygonNode(_6a8[i],geom);
geom.addComponents(polygon);
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","MultiLineString").length!=0){
var _6aa=OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","MultiLineString")[0];
geom=new OpenLayers.Geometry.MultiLineString();
var _6ab=OpenLayers.Ajax.getElementsByTagNameNS(_6aa,this.gmlns,"gml","LineString");
for(var i=0;i<_6ab.length;i++){
p=this.parseCoords(_6ab[i]);
if(p.points){
var _6ac=new OpenLayers.Geometry.LineString(p.points);
geom.addComponents(_6ac);
}
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","MultiPoint").length!=0){
var _6ad=OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","MultiPoint")[0];
geom=new OpenLayers.Geometry.MultiPoint();
var _6ae=OpenLayers.Ajax.getElementsByTagNameNS(_6ad,this.gmlns,"gml","Point");
for(var i=0;i<_6ae.length;i++){
p=this.parseCoords(_6ae[i]);
geom.addComponents(p.points[0]);
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","Polygon").length!=0){
var _6af=OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","Polygon")[0];
geom=this.parsePolygonNode(_6af);
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","LineString").length!=0){
var _6ac=OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","LineString")[0];
p=this.parseCoords(_6ac);
if(p.points){
geom=new OpenLayers.Geometry.LineString(p.points);
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","Point").length!=0){
var _6b0=OpenLayers.Ajax.getElementsByTagNameNS(_6a3,this.gmlns,"gml","Point")[0];
p=this.parseCoords(_6b0);
if(p.points){
geom=p.points[0];
}
}
}
}
}
}
}
_6a6.setGeometry(geom,false);
if(this.extractAttributes){
_6a6.attributes=this.parseAttributes(_6a3);
}
return _6a6;
},parseAttributes:function(_6b1){
var _6b2=_6b1.childNodes;
var _6b3={};
for(var i=0;i<_6b2.length;i++){
var name=_6b2[i].nodeName;
var _6b6=OpenLayers.Util.getXmlNodeValue(_6b2[i]);
if((name.search(":pos")!=-1)||(name.search(":posList")!=-1)||(name.search(":coordinates")!=-1)){
continue;
}
if((_6b2[i].childNodes.length==1&&_6b2[i].childNodes[0].nodeName=="#text")||(_6b2[i].childNodes.length==0&&_6b2[i].nodeName!="#text")){
_6b3[name]=_6b6;
}
OpenLayers.Util.extend(_6b3,this.parseAttributes(_6b2[i]));
}
return _6b3;
},parsePolygonNode:function(_6b7){
var _6b8=OpenLayers.Ajax.getElementsByTagNameNS(_6b7,this.gmlns,"gml","LinearRing");
var _6b9=[];
var p;
var _6bb;
for(var i=0;i<_6b8.length;i++){
p=this.parseCoords(_6b8[i]);
ring1=new OpenLayers.Geometry.LinearRing(p.points);
_6b9.push(ring1);
}
var poly=new OpenLayers.Geometry.Polygon(_6b9);
return poly;
},parseCoords:function(_6be){
var x,y,left,bottom,right,top,bounds;
var p=[];
if(_6be){
p.points=[];
var _6c1=OpenLayers.Ajax.getElementsByTagNameNS(_6be,this.gmlns,"gml","posList");
if(_6c1.length==0){
_6c1=OpenLayers.Ajax.getElementsByTagNameNS(_6be,this.gmlns,"gml","pos");
}
if(_6c1.length==0){
_6c1=OpenLayers.Ajax.getElementsByTagNameNS(_6be,this.gmlns,"gml","coordinates");
}
var _6c2=OpenLayers.Util.getXmlNodeValue(_6c1[0]);
var nums=(_6c2)?_6c2.split(/[, \n\t]+/):[];
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
}
return p;
},write:function(_6c4){
var _6c5=document.createElementNS("http://www.opengis.net/wfs","wfs:"+this.collectionName);
for(var i=0;i<_6c4.length;i++){
_6c5.appendChild(this.createFeatureXML(_6c4[i]));
}
return _6c5;
},createFeatureXML:function(_6c7){
var _6c8=this.buildGeometryNode(_6c7.geometry);
var _6c9=document.createElementNS(this.featureNS,"feature:"+this.geometryName);
_6c9.appendChild(_6c8);
var _6ca=document.createElementNS(this.gmlns,"gml:"+this.featureName);
var _6cb=document.createElementNS(this.featureNS,"feature:"+this.layerName);
_6cb.appendChild(_6c9);
for(var attr in _6c7.attributes){
var _6cd=document.createTextNode(_6c7.attributes[attr]);
var _6ce=attr;
if(attr.search(":")!=-1){
_6ce=attr.split(":")[1];
}
var _6cf=document.createElementNS(this.featureNS,"feature:"+_6ce);
_6cf.appendChild(_6cd);
_6cb.appendChild(_6cf);
}
_6ca.appendChild(_6cb);
return _6ca;
},buildGeometryNode:function(_6d0){
var gml="";
if(_6d0.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon"||_6d0.CLASS_NAME=="OpenLayers.Geometry.Polygon"){
gml=document.createElementNS(this.gmlns,"gml:MultiPolygon");
var _6d2=document.createElementNS(this.gmlns,"gml:polygonMember");
var _6d3=document.createElementNS(this.gmlns,"gml:Polygon");
var _6d4=document.createElementNS(this.gmlns,"gml:outerBoundaryIs");
var _6d5=document.createElementNS(this.gmlns,"gml:LinearRing");
_6d5.appendChild(this.buildCoordinatesNode(_6d0.components[0]));
_6d4.appendChild(_6d5);
_6d3.appendChild(_6d4);
_6d2.appendChild(_6d3);
gml.appendChild(_6d2);
}else{
if(_6d0.CLASS_NAME=="OpenLayers.Geometry.MultiLineString"||_6d0.CLASS_NAME=="OpenLayers.Geometry.LineString"){
gml=document.createElementNS(this.gmlns,"gml:MultiLineString");
var _6d6=document.createElementNS(this.gmlns,"gml:lineStringMember");
var _6d7=document.createElementNS(this.gmlns,"gml:LineString");
_6d7.appendChild(this.buildCoordinatesNode(_6d0));
_6d6.appendChild(_6d7);
gml.appendChild(_6d6);
}else{
if(_6d0.CLASS_NAME=="OpenLayers.Geometry.Point"||_6d0.CLASS_NAME=="OpenLayers.Geometry.MultiPoint"){
gml=document.createElementNS(this.gmlns,"gml:MultiPoint");
var _6d8="";
if(_6d0.CLASS_NAME=="OpenLayers.Geometry.MultiPoint"){
_6d8=_6d0.components;
}else{
_6d8=[_6d0];
}
for(var i=0;i<_6d8.length;i++){
var _6da=document.createElementNS(this.gmlns,"gml:pointMember");
var _6db=document.createElementNS(this.gmlns,"gml:Point");
_6db.appendChild(this.buildCoordinatesNode(_6d8[i]));
_6da.appendChild(_6db);
gml.appendChild(_6da);
}
}
}
}
return gml;
},buildCoordinatesNode:function(_6dc){
var _6dd=document.createElementNS(this.gmlns,"gml:coordinates");
_6dd.setAttribute("decimal",".");
_6dd.setAttribute("cs",",");
_6dd.setAttribute("ts"," ");
var _6de=null;
if(_6dc.components){
_6de=_6dc.components;
}
var path="";
if(_6de){
for(var i=0;i<_6de.length;i++){
path+=_6de[i].x+","+_6de[i].y+" ";
}
}else{
path+=_6dc.x+","+_6dc.y+" ";
}
var _6e1=document.createTextNode(path);
_6dd.appendChild(_6e1);
return _6dd;
},CLASS_NAME:"OpenLayers.Format.GML"});
OpenLayers.Format.KML=OpenLayers.Class.create();
OpenLayers.Format.KML.prototype=OpenLayers.Class.inherit(OpenLayers.Format,{featureNS:"http://mapserver.gis.umn.edu/mapserver",collectionName:"FeatureCollection",kmlns:"http://earth.google.com/kml/2.0",read:function(data){
if(typeof data=="string"){
data=OpenLayers.parseXMLString(data);
}
var _6e3=OpenLayers.Ajax.getElementsByTagNameNS(data,this.kmlns,"","Placemark");
var _6e4=[];
for(var i=0;i<_6e3.length;i++){
var _6e6=this.parseFeature(_6e3[i]);
if(_6e6){
_6e4.push(_6e6);
}
}
return _6e4;
},parseFeature:function(_6e7){
var geom;
var p;
var _6ea=new OpenLayers.Feature.Vector();
if(OpenLayers.Ajax.getElementsByTagNameNS(_6e7,this.kmlns,"","Point").length!=0){
var _6eb=OpenLayers.Ajax.getElementsByTagNameNS(_6e7,this.kmlns,"","Point")[0];
p=this.parseCoords(_6eb);
if(p.points){
geom=p.points[0];
geom.extendBounds(p.bounds);
}
}else{
if(OpenLayers.Ajax.getElementsByTagNameNS(_6e7,this.kmlns,"","LineString").length!=0){
var _6ec=OpenLayers.Ajax.getElementsByTagNameNS(_6e7,this.kmlns,"","LineString")[0];
p=this.parseCoords(_6ec);
if(p.points){
geom=new OpenLayers.Geometry.LineString(p.points);
geom.extendBounds(p.bounds);
}
}
}
_6ea.setGeometry(geom);
_6ea.attributes=this.parseAttributes(_6e7);
return _6ea;
},parseAttributes:function(_6ed){
var _6ee=_6ed.childNodes;
var _6ef={};
for(var i=0;i<_6ee.length;i++){
var name=_6ee[i].nodeName;
var _6f2=OpenLayers.Util.getXmlNodeValue(_6ee[i]);
if((name.search(":pos")!=-1)||(name.search(":posList")!=-1)||(name.search(":coordinates")!=-1)){
continue;
}
if((_6ee[i].childNodes.length==1&&_6ee[i].childNodes[0].nodeName=="#text")||(_6ee[i].childNodes.length==0&&_6ee[i].nodeName!="#text")){
_6ef[name]=_6f2;
}
OpenLayers.Util.extend(_6ef,this.parseAttributes(_6ee[i]));
}
return _6ef;
},parseCoords:function(_6f3){
var p=[];
p.points=[];
var _6f5=OpenLayers.Ajax.getElementsByTagNameNS(_6f3,this.kmlns,"","coordinates")[0];
var _6f6=OpenLayers.Util.getXmlNodeValue(_6f5);
var _6f7=_6f6.split(" ");
while(_6f7[0]==""){
_6f7.shift();
}
var dim=_6f7[0].split(",").length;
var nums=(_6f6)?_6f6.split(/[, \n\t]+/):[];
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
OpenLayers.Geometry.MultiLineString=OpenLayers.Class.create();
OpenLayers.Geometry.MultiLineString.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LineString"],initialize:function(_6fa){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiLineString"});
OpenLayers.Geometry.MultiPoint=OpenLayers.Class.create();
OpenLayers.Geometry.MultiPoint.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_6fb){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},addPoint:function(_6fc,_6fd){
this.addComponent(_6fc,_6fd);
},removePoint:function(_6fe){
this.removeComponent(_6fe);
},CLASS_NAME:"OpenLayers.Geometry.MultiPoint"});
OpenLayers.Geometry.MultiPolygon=OpenLayers.Class.create();
OpenLayers.Geometry.MultiPolygon.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Polygon"],initialize:function(_6ff){
OpenLayers.Geometry.Collection.prototype.initialize.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Geometry.MultiPolygon"});
OpenLayers.Geometry.Polygon=OpenLayers.Class.create();
OpenLayers.Geometry.Polygon.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LinearRing"],initialize:function(_700){
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
OpenLayers.Handler.Point=OpenLayers.Class.create();
OpenLayers.Handler.Point.prototype=OpenLayers.Class.inherit(OpenLayers.Handler,{point:null,layer:null,drawing:false,mouseDown:false,lastDown:null,lastUp:null,initialize:function(_703,_704,_705){
this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});
OpenLayers.Handler.prototype.initialize.apply(this,arguments);
},activate:function(){
if(!OpenLayers.Handler.prototype.activate.apply(this,arguments)){
return false;
}
var _706={displayInLayerSwitcher:false};
this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,_706);
this.map.addLayer(this.layer);
return true;
},createGeometry:function(){
this.point=new OpenLayers.Geometry.Point();
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
},destroyGeometry:function(){
this.point.destroy();
},finalize:function(){
this.layer.renderer.clear();
this.callback("done",[this.geometryClone()]);
this.destroyGeometry();
this.drawing=false;
this.mouseDown=false;
this.lastDown=null;
this.lastUp=null;
},cancel:function(){
this.layer.renderer.clear();
this.callback("cancel",[this.geometryClone()]);
this.destroyGeometry();
this.drawing=false;
this.mouseDown=false;
this.lastDown=null;
this.lastUp=null;
},dblclick:function(evt){
OpenLayers.Event.stop(evt);
return false;
},drawGeometry:function(){
this.layer.renderer.drawGeometry(this.point,this.style);
},geometryClone:function(){
return this.point.clone();
},mousedown:function(evt){
if(!this.checkModifiers(evt)){
return true;
}
if(this.lastDown&&this.lastDown.equals(evt.xy)){
return true;
}
if(this.lastDown==null){
this.createGeometry();
}
this.lastDown=evt.xy;
this.drawing=true;
var _709=this.map.getLonLatFromPixel(evt.xy);
this.point.x=_709.lon;
this.point.y=_709.lat;
this.drawGeometry();
return false;
},mousemove:function(evt){
if(this.drawing){
var _70b=this.map.getLonLatFromPixel(evt.xy);
this.point.x=_70b.lon;
this.point.y=_70b.lat;
this.drawGeometry();
}
return true;
},mouseup:function(evt){
if(this.drawing){
this.finalize(this.point);
return false;
}else{
return true;
}
},CLASS_NAME:"OpenLayers.Handler.Point"});
OpenLayers.Layer.Boxes=OpenLayers.Class.create();
OpenLayers.Layer.Boxes.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Markers,{initialize:function(){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
},drawMarker:function(_70d){
var _70e=_70d.bounds;
var _70f=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_70e.left,_70e.top));
var _710=this.map.getLayerPxFromLonLat(new OpenLayers.LonLat(_70e.right,_70e.bottom));
if(_710==null||_70f==null){
_70d.display(false);
}else{
var sz=new OpenLayers.Size(Math.max(1,_710.x-_70f.x),Math.max(1,_710.y-_70f.y));
var _712=_70d.draw(_70f,sz);
if(!_70d.drawn){
this.div.appendChild(_712);
_70d.drawn=true;
}
}
},removeMarker:function(_713){
OpenLayers.Util.removeItem(this.markers,_713);
if((_713.div!=null)&&(_713.div.parentNode==this.div)){
this.div.removeChild(_713.div);
}
},CLASS_NAME:"OpenLayers.Layer.Boxes"});
OpenLayers.Layer.GML=OpenLayers.Class.create();
OpenLayers.Layer.GML.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Vector,{loaded:false,format:null,initialize:function(name,url,_716){
var _717=new Array();
_717.push(name,_716);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_717);
this.url=url;
},setVisibility:function(_718,_719){
OpenLayers.Layer.Vector.prototype.setVisibility.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},moveTo:function(_71a,_71b,_71c){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
if(this.visibility&&!this.loaded){
this.loadGML();
}
},loadGML:function(){
if(!this.loaded){
var _71d=OpenLayers.loadURL(this.url,null,this,this.requestSuccess,this.requestFailure);
this.loaded=true;
}
},requestSuccess:function(_71e){
var doc=_71e.responseXML;
if(!doc||_71e.fileType!="XML"){
doc=_71e.responseText;
}
var gml=this.format?new this.format():new OpenLayers.Format.GML();
this.addFeatures(gml.read(doc));
},requestFailure:function(_721){
alert("Error in loading GML file "+this.url);
},CLASS_NAME:"OpenLayers.Layer.GML"});
OpenLayers.Layer.GeoRSS=OpenLayers.Class.create();
OpenLayers.Layer.GeoRSS.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,initialize:function(name,_723){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,[name]);
this.location=_723;
this.features=new Array();
OpenLayers.loadURL(_723,null,this,this.parseData);
},destroy:function(){
this.clearFeatures();
this.features=null;
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
},parseData:function(_724){
var doc=_724.responseXML;
if(!doc||_724.fileType!="XML"){
doc=OpenLayers.parseXMLString(_724.responseText);
}
this.name=null;
try{
this.name=doc.getElementsByTagNameNS("*","title")[0].firstChild.nodeValue;
}
catch(e){
this.name=doc.getElementsByTagName("title")[0].firstChild.nodeValue;
}
var _726=null;
try{
_726=doc.getElementsByTagNameNS("*","item");
}
catch(e){
_726=doc.getElementsByTagName("item");
}
if(_726.length==0){
try{
_726=doc.getElementsByTagNameNS("*","entry");
}
catch(e){
_726=doc.getElementsByTagName("entry");
}
}
for(var i=0;i<_726.length;i++){
var data={};
var _729=OpenLayers.Util.getNodes(_726[i],"georss:point");
var lat=OpenLayers.Util.getNodes(_726[i],"geo:lat");
var lon=OpenLayers.Util.getNodes(_726[i],"geo:long");
if(_729.length>0){
var _72c=_729[0].firstChild.nodeValue.split(" ");
if(_72c.length!=2){
var _72c=_729[0].firstChild.nodeValue.split(",");
}
}else{
if(lat.length>0&&lon.length>0){
var _72c=[parseFloat(lat[0].firstChild.nodeValue),parseFloat(lon[0].firstChild.nodeValue)];
}else{
continue;
}
}
_72c=new OpenLayers.LonLat(parseFloat(_72c[1]),parseFloat(_72c[0]));
var _72d="Untitled";
try{
_72d=OpenLayers.Util.getNodes(_726[i],"title")[0].firstChild.nodeValue;
}
catch(e){
_72d="Untitled";
}
var _72e=null;
try{
_72e=_726[i].getElementsByTagNameNS("*","description");
}
catch(e){
_72e=_726[i].getElementsByTagName("description");
}
if(_72e.length==0){
try{
_72e=_726[i].getElementsByTagNameNS("*","summary");
}
catch(e){
_72e=_726[i].getElementsByTagName("summary");
}
}
var _72f="No description.";
try{
_72f=_72e[0].firstChild.nodeValue;
}
catch(e){
_72f="No description.";
}
try{
var link=OpenLayers.Util.getNodes(_726[i],"link")[0].firstChild.nodeValue;
}
catch(e){
try{
var link=OpenLayers.Util.getNodes(_726[i],"link")[0].getAttribute("href");
}
catch(e){
}
}
data.icon=OpenLayers.Marker.defaultIcon();
data.popupSize=new OpenLayers.Size(250,120);
if((_72d!=null)&&(_72f!=null)){
contentHTML="<div class=\"olLayerGeoRSSClose\">[x]</div>";
contentHTML+="<div class=\"olLayerGeoRSSTitle\">";
if(link){
contentHTML+="<a class=\"link\" href=\""+link+"\" target=\"_blank\">";
}
contentHTML+=_72d;
if(link){
contentHTML+="</a>";
}
contentHTML+="</div>";
contentHTML+="<div style=\"\" class=\"olLayerGeoRSSDescription\">";
contentHTML+=_72f;
contentHTML+="</div>";
data["popupContentHTML"]=contentHTML;
}
var _731=new OpenLayers.Feature(this,_72c,data);
this.features.push(_731);
var _732=_731.createMarker();
_732.events.register("click",_731,this.markerClick);
this.addMarker(_732);
}
},markerClick:function(evt){
sameMarkerClicked=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!sameMarkerClicked)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!sameMarkerClicked){
var _735=this.createPopup();
OpenLayers.Event.observe(_735.div,"click",function(){
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
}.bindAsEventListener(this));
this.layer.map.addPopup(_735);
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _737=this.features[0];
OpenLayers.Util.removeItem(this.features,_737);
_737.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.GeoRSS"});
OpenLayers.Layer.Google=OpenLayers.Class.create();
OpenLayers.Layer.Google.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:19,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125,0.00002145767211914062,0.00001072883605957031,0.00000536441802978515,0.00000268220901489257],type:null,initialize:function(name,_739){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
this.addContainerPxFunction();
},loadMapObject:function(){
try{
this.mapObject=new GMap2(this.div);
var _73a=this.div.lastChild;
this.div.removeChild(_73a);
this.pane.appendChild(_73a);
_73a.className="olLayerGooglePoweredBy gmnoprint";
_73a.style.left="";
_73a.style.bottom="";
var _73b=this.div.lastChild;
this.div.removeChild(_73b);
this.pane.appendChild(_73b);
_73b.className="olLayerGoogleCopyright";
_73b.style.right="";
_73b.style.bottom="";
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
},getOLBoundsFromMapObjectBounds:function(_73d){
var _73e=null;
if(_73d!=null){
var sw=_73d.getSouthWest();
var ne=_73d.getNorthEast();
_73e=new OpenLayers.Bounds(sw.lng(),sw.lat(),ne.lng(),ne.lat());
}
return _73e;
},getMapObjectBoundsFromOLBounds:function(_741){
var _742=null;
if(_741!=null){
var sw=new GLatLng(_741.bottom,_741.left);
var ne=new GLatLng(_741.top,_741.right);
_742=new GLatLngBounds(sw,ne);
}
return _742;
},addContainerPxFunction:function(){
if(typeof GMap2!="undefined"&&!GMap2.fromLatLngToContainerPixel){
GMap2.prototype.fromLatLngToContainerPixel=function(_745){
var _746=this.fromLatLngToDivPixel(_745);
var div=this.b.firstChild.firstChild;
_746.x+=div.offsetLeft;
_746.y+=div.offsetTop;
return _746;
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
},setMapObjectCenter:function(_749,zoom){
this.mapObject.setCenter(_749,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenter();
},getMapObjectZoom:function(){
return this.mapObject.getZoom();
},getMapObjectLonLatFromMapObjectPixel:function(_74b){
return this.mapObject.fromContainerPixelToLatLng(_74b);
},getMapObjectPixelFromMapObjectLonLat:function(_74c){
return this.mapObject.fromLatLngToContainerPixel(_74c);
},getMapObjectZoomFromMapObjectBounds:function(_74d){
return this.mapObject.getBoundsZoomLevel(_74d);
},getLongitudeFromMapObjectLonLat:function(_74e){
return _74e.lng();
},getLatitudeFromMapObjectLonLat:function(_74f){
return _74f.lat();
},getMapObjectLonLatFromLonLat:function(lon,lat){
return new GLatLng(lat,lon);
},getXFromMapObjectPixel:function(_752){
return _752.x;
},getYFromMapObjectPixel:function(_753){
return _753.y;
},getMapObjectPixelFromXY:function(x,y){
return new GPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.Google"});
OpenLayers.Layer.Grid=OpenLayers.Class.create();
OpenLayers.Layer.Grid.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.HTTPRequest,{tileSize:null,grid:null,buffer:2,initialize:function(name,url,_758,_759){
OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this,arguments);
this.grid=new Array();
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
row[iCol].destroy();
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
obj.grid=new Array();
return obj;
},setMap:function(map){
OpenLayers.Layer.HTTPRequest.prototype.setMap.apply(this,arguments);
if(this.tileSize==null){
this.tileSize=this.map.getTileSize();
}
},moveTo:function(_75f,_760,_761){
OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
if(_75f==null){
_75f=this.map.getExtent();
}
if(_75f!=null){
if(!this.grid.length||_760||!this.getGridBounds().containsBounds(_75f,true)){
this._initTiles();
}else{
var _762=(this.buffer)?this.buffer*1.5:1;
while(true){
var _763=this.grid[0][0].position;
var _764=this.map.getViewPortPxFromLayerPx(_763);
if(_764.x>-this.tileSize.w*(_762-1)){
this.shiftColumn(true);
}else{
if(_764.x<-this.tileSize.w*_762){
this.shiftColumn(false);
}else{
if(_764.y>-this.tileSize.h*(_762-1)){
this.shiftRow(true);
}else{
if(_764.y<-this.tileSize.h*_762){
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
if(!tile.drawn&&tile.bounds.intersectsBounds(_75f,false)){
tile.draw();
}
}
}
}
}
}
},getGridBounds:function(){
var _769=this.grid.length-1;
var _76a=this.grid[_769][0];
var _76b=this.grid[0].length-1;
var _76c=this.grid[0][_76b];
return new OpenLayers.Bounds(_76a.bounds.left,_76a.bounds.bottom,_76c.bounds.right,_76c.bounds.top);
},_initTiles:function(){
var _76d=this.map.getSize();
var _76e=Math.ceil(_76d.h/this.tileSize.h)+1;
var _76f=Math.ceil(_76d.w/this.tileSize.w)+1;
var _770=this.map.getExtent();
var _771=this.map.getMaxExtent();
var _772=this.map.getResolution();
var _773=_772*this.tileSize.w;
var _774=_772*this.tileSize.h;
var _775=_770.left-_771.left;
var _776=Math.floor(_775/_773)-this.buffer;
var _777=_775/_773-_776;
var _778=-_777*this.tileSize.w;
var _779=_771.left+_776*_773;
var _77a=_770.top-(_771.bottom+_774);
var _77b=Math.ceil(_77a/_774)+this.buffer;
var _77c=_77b-_77a/_774;
var _77d=-_77c*this.tileSize.h;
var _77e=_771.bottom+_77b*_774;
_778=Math.round(_778);
_77d=Math.round(_77d);
this.origin=new OpenLayers.Pixel(_778,_77d);
var _77f=_778;
var _780=_779;
var _781=0;
do{
var row=this.grid[_781++];
if(!row){
row=new Array();
this.grid.push(row);
}
_779=_780;
_778=_77f;
var _783=0;
do{
var _784=new OpenLayers.Bounds(_779,_77e,_779+_773,_77e+_774);
var x=_778;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_77d;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile=row[_783++];
if(!tile){
tile=this.addTile(_784,px);
row.push(tile);
}else{
tile.moveTo(_784,px,false);
}
_779+=_773;
_778+=this.tileSize.w;
}while((_779<=_770.right+_773*this.buffer)||_783<_76f);
_77e-=_774;
_77d+=this.tileSize.h;
}while((_77e>=_770.bottom-_774*this.buffer)||_781<_76e);
while(this.grid.length>_781){
var row=this.grid.pop();
for(var i=0,l=row.length;i<l;i++){
row[i].destroy();
}
}
while(this.grid[0].length>_783){
for(var i=0,l=this.grid.length;i<l;i++){
var row=this.grid[i];
var tile=row.pop();
tile.destroy();
}
}
this.spiralTileLoad();
},spiralTileLoad:function(){
var _78a=new Array();
var _78b=["right","down","left","up"];
var iRow=0;
var _78d=-1;
var _78e=OpenLayers.Util.indexOf(_78b,"right");
var _78f=0;
while(_78f<_78b.length){
var _790=iRow;
var _791=_78d;
switch(_78b[_78e]){
case "right":
_791++;
break;
case "down":
_790++;
break;
case "left":
_791--;
break;
case "up":
_790--;
break;
}
var tile=null;
if((_790<this.grid.length)&&(_790>=0)&&(_791<this.grid[0].length)&&(_791>=0)){
tile=this.grid[_790][_791];
}
if((tile!=null)&&(!tile.queued)){
_78a.unshift(tile);
tile.queued=true;
_78f=0;
iRow=_790;
_78d=_791;
}else{
_78e=(_78e+1)%4;
_78f++;
}
}
for(var i=0;i<_78a.length;i++){
var tile=_78a[i];
tile.draw();
tile.queued=false;
}
},addTile:function(_794,_795){
},mergeNewParams:function(_796){
OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this,[_796]);
if(this.map!=null){
this._initTiles();
}
},shiftRow:function(_797){
var _798=(_797)?0:(this.grid.length-1);
var _799=this.grid[_798];
var _79a=this.map.getResolution();
var _79b=(_797)?-this.tileSize.h:this.tileSize.h;
var _79c=_79a*-_79b;
var row=(_797)?this.grid.pop():this.grid.shift();
for(var i=0;i<_799.length;i++){
var _79f=_799[i];
var _7a0=_79f.bounds.clone();
var _7a1=_79f.position.clone();
_7a0.bottom=_7a0.bottom+_79c;
_7a0.top=_7a0.top+_79c;
_7a1.y=_7a1.y+_79b;
row[i].moveTo(_7a0,_7a1);
}
if(_797){
this.grid.unshift(row);
}else{
this.grid.push(row);
}
},shiftColumn:function(_7a2){
var _7a3=(_7a2)?-this.tileSize.w:this.tileSize.w;
var _7a4=this.map.getResolution();
var _7a5=_7a4*_7a3;
for(var i=0;i<this.grid.length;i++){
var row=this.grid[i];
var _7a8=(_7a2)?0:(row.length-1);
var _7a9=row[_7a8];
var _7aa=_7a9.bounds.clone();
var _7ab=_7a9.position.clone();
_7aa.left=_7aa.left+_7a5;
_7aa.right=_7aa.right+_7a5;
_7ab.x=_7ab.x+_7a3;
var tile=_7a2?this.grid[i].pop():this.grid[i].shift();
tile.moveTo(_7aa,_7ab);
if(_7a2){
this.grid[i].unshift(tile);
}else{
this.grid[i].push(tile);
}
}
},CLASS_NAME:"OpenLayers.Layer.Grid"});
OpenLayers.Layer.MultiMap=OpenLayers.Class.create();
OpenLayers.Layer.MultiMap.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[9,1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_7ae){
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
},setMapObjectCenter:function(_7b0,zoom){
this.mapObject.goToPosition(_7b0,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCurrentPosition();
},getMapObjectZoom:function(){
return this.mapObject.getZoomFactor();
},getMapObjectLonLatFromMapObjectPixel:function(_7b2){
_7b2.x=_7b2.x-(this.map.getSize().w/2);
_7b2.y=_7b2.y-(this.map.getSize().h/2);
return this.mapObject.getMapPositionAt(_7b2);
},getMapObjectPixelFromMapObjectLonLat:function(_7b3){
return this.mapObject.geoPosToContainerPixels(_7b3);
},getLongitudeFromMapObjectLonLat:function(_7b4){
return _7b4.lon;
},getLatitudeFromMapObjectLonLat:function(_7b5){
return _7b5.lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
return new MMLatLon(lat,lon);
},getXFromMapObjectPixel:function(_7b8){
return _7b8.x;
},getYFromMapObjectPixel:function(_7b9){
return _7b9.y;
},getMapObjectPixelFromXY:function(x,y){
return new MMPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.MultiMap"});
OpenLayers.Layer.Text=OpenLayers.Class.create();
OpenLayers.Layer.Text.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Markers,{location:null,features:null,selectedFeature:null,initialize:function(name,_7bd){
OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);
this.features=new Array();
if(this.location!=null){
OpenLayers.loadURL(this.location,null,this,this.parseData);
}
},destroy:function(){
this.clearFeatures();
this.features=null;
OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);
},parseData:function(_7be){
var text=_7be.responseText;
var _7c0=text.split("\n");
var _7c1;
for(var lcv=0;lcv<(_7c0.length-1);lcv++){
var _7c3=_7c0[lcv].replace(/^\s*/,"").replace(/\s*$/,"");
if(_7c3.charAt(0)!="#"){
if(!_7c1){
_7c1=_7c3.split("\t");
}else{
var vals=_7c3.split("\t");
var _7c5=new OpenLayers.LonLat(0,0);
var _7c6;
var url;
var icon,iconSize,iconOffset;
var set=false;
for(var _7ca=0;_7ca<vals.length;_7ca++){
if(vals[_7ca]){
if(_7c1[_7ca]=="point"){
var _7cb=vals[_7ca].split(",");
_7c5.lat=parseFloat(_7cb[0]);
_7c5.lon=parseFloat(_7cb[1]);
set=true;
}else{
if(_7c1[_7ca]=="lat"){
_7c5.lat=parseFloat(vals[_7ca]);
set=true;
}else{
if(_7c1[_7ca]=="lon"){
_7c5.lon=parseFloat(vals[_7ca]);
set=true;
}else{
if(_7c1[_7ca]=="title"){
_7c6=vals[_7ca];
}else{
if(_7c1[_7ca]=="image"||_7c1[_7ca]=="icon"){
url=vals[_7ca];
}else{
if(_7c1[_7ca]=="iconSize"){
var size=vals[_7ca].split(",");
iconSize=new OpenLayers.Size(parseFloat(size[0]),parseFloat(size[1]));
}else{
if(_7c1[_7ca]=="iconOffset"){
var _7cd=vals[_7ca].split(",");
iconOffset=new OpenLayers.Pixel(parseFloat(_7cd[0]),parseFloat(_7cd[1]));
}else{
if(_7c1[_7ca]=="title"){
_7c6=vals[_7ca];
}else{
if(_7c1[_7ca]=="description"){
description=vals[_7ca];
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
var data=new Object();
if(url!=null){
data.icon=new OpenLayers.Icon(url,iconSize,iconOffset);
}else{
data.icon=OpenLayers.Marker.defaultIcon();
if(iconSize!=null){
data.icon.setSize(iconSize);
}
}
if((_7c6!=null)&&(description!=null)){
data["popupContentHTML"]="<h2>"+_7c6+"</h2><p>"+description+"</p>";
}
var _7cf=new OpenLayers.Feature(this,_7c5,data);
this.features.push(_7cf);
var _7d0=_7cf.createMarker();
if((_7c6!=null)&&(description!=null)){
_7d0.events.register("click",_7cf,this.markerClick);
}
this.addMarker(_7d0);
}
}
}
}
},markerClick:function(evt){
sameMarkerClicked=(this==this.layer.selectedFeature);
this.layer.selectedFeature=(!sameMarkerClicked)?this:null;
for(var i=0;i<this.layer.map.popups.length;i++){
this.layer.map.removePopup(this.layer.map.popups[i]);
}
if(!sameMarkerClicked){
this.layer.map.addPopup(this.createPopup());
}
OpenLayers.Event.stop(evt);
},clearFeatures:function(){
if(this.features!=null){
while(this.features.length>0){
var _7d3=this.features[0];
OpenLayers.Util.removeItem(this.features,_7d3);
_7d3.destroy();
}
}
},CLASS_NAME:"OpenLayers.Layer.Text"});
OpenLayers.Layer.VirtualEarth=OpenLayers.Class.create();
OpenLayers.Layer.VirtualEarth.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:1,MAX_ZOOM_LEVEL:17,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_7d5){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
},loadMapObject:function(){
var _7d6=OpenLayers.Util.createDiv(this.name);
var sz=this.map.getSize();
_7d6.style.width=sz.w;
_7d6.style.height=sz.h;
this.div.appendChild(_7d6);
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
},setMapObjectCenter:function(_7d9,zoom){
this.mapObject.SetCenterAndZoom(_7d9,zoom);
},getMapObjectCenter:function(){
return this.mapObject.GetCenter();
},getMapObjectZoom:function(){
return this.mapObject.GetZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_7db){
return this.mapObject.PixelToLatLong(_7db.x,_7db.y);
},getMapObjectPixelFromMapObjectLonLat:function(_7dc){
return this.mapObject.LatLongToPixel(_7dc);
},getLongitudeFromMapObjectLonLat:function(_7dd){
return _7dd.Longitude;
},getLatitudeFromMapObjectLonLat:function(_7de){
return _7de.Latitude;
},getMapObjectLonLatFromLonLat:function(lon,lat){
return new VELatLong(lat,lon);
},getXFromMapObjectPixel:function(_7e1){
return _7e1.x;
},getYFromMapObjectPixel:function(_7e2){
return _7e2.y;
},getMapObjectPixelFromXY:function(x,y){
return new Msn.VE.Pixel(x,y);
},CLASS_NAME:"OpenLayers.Layer.VirtualEarth"});
OpenLayers.Layer.WFS=OpenLayers.Class.create();
OpenLayers.Layer.WFS.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Vector,OpenLayers.Layer.Markers,{isBaseLayer:false,ratio:2,DEFAULT_PARAMS:{service:"WFS",version:"1.0.0",request:"GetFeature"},featureClass:null,vectorMode:true,initialize:function(name,url,_7e7,_7e8){
if(_7e8==undefined){
_7e8={};
}
if(_7e8.featureClass||!OpenLayers.Layer.Vector||!OpenLayers.Feature.Vector){
this.vectorMode=false;
}
OpenLayers.Util.extend(_7e8,{"reportError":false});
var _7e9=new Array();
_7e9.push(name,_7e8);
OpenLayers.Layer.Vector.prototype.initialize.apply(this,_7e9);
if(!this.renderer||!this.vectorMode){
this.vectorMode=false;
if(!_7e8.featureClass){
_7e8.featureClass=OpenLayers.Feature.WFS;
}
OpenLayers.Layer.Markers.prototype.initialize.apply(this,_7e9);
}
if(this.params&&this.params.typename&&!this.options.typename){
this.options.typename=this.params.typename;
}
if(!this.options.geometry_column){
this.options.geometry_column="the_geom";
}
this.params=_7e7;
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
},moveTo:function(_7eb,_7ec,_7ed){
if(this.vectorMode){
OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
}else{
OpenLayers.Layer.Markers.prototype.moveTo.apply(this,arguments);
}
if(_7ed){
return false;
}
if(_7ec){
if(this.vectorMode){
this.renderer.clear();
}
}
if(this.options.minZoomLevel&&this.map.getZoom()<this.options.minZoomLevel){
return null;
}
if(_7eb==null){
_7eb=this.map.getExtent();
}
var _7ee=(this.tile==null);
var _7ef=(!_7ee&&!this.tile.bounds.containsBounds(_7eb));
if(_7ec||_7ee||(!_7ed&&_7ef)){
var _7f0=_7eb.getCenterLonLat();
var _7f1=_7eb.getWidth()*this.ratio;
var _7f2=_7eb.getHeight()*this.ratio;
var _7f3=new OpenLayers.Bounds(_7f0.lon-(_7f1/2),_7f0.lat-(_7f2/2),_7f0.lon+(_7f1/2),_7f0.lat+(_7f2/2));
var _7f4=this.map.getSize();
_7f4.w=_7f4.w*this.ratio;
_7f4.h=_7f4.h*this.ratio;
var ul=new OpenLayers.LonLat(_7f3.left,_7f3.top);
var pos=this.map.getLayerPxFromLonLat(ul);
var url=this.getFullRequestString();
var _7f8={BBOX:_7f3.toBBOX()};
url+="&"+OpenLayers.Util.getParameterString(_7f8);
if(!this.tile){
this.tile=new OpenLayers.Tile.WFS(this,pos,_7f3,url,_7f4);
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
this.tile=new OpenLayers.Tile.WFS(this,pos,_7f3,url,_7f4);
this.tile.draw();
}
}
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
},getFullRequestString:function(_7fa){
var _7fb=this.map.getProjection();
this.params.SRS=(_7fb=="none")?null:_7fb;
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
var _7fe=this.commitSuccess.bind(this);
var _7ff=this.commitFailure.bind(this);
data=OpenLayers.Ajax.serializeXMLToString(data);
new OpenLayers.Ajax.Request(url,{method:"post",postBody:data,onComplete:_7fe,onFailure:_7ff});
},commitSuccess:function(_800){
var _801=_800.responseText;
if(_801.indexOf("SUCCESS")!=-1){
this.commitReport("WFS Transaction: SUCCESS",_801);
for(var i=0;i<this.features.length;i++){
i.state=null;
}
}else{
if(_801.indexOf("FAILED")!=-1||_801.indexOf("Exception")!=-1){
this.commitReport("WFS Transaction: FAILED",_801);
}
}
},commitFailure:function(_803){
},commitReport:function(_804,_805){
alert(_804);
},refresh:function(){
if(this.tile){
if(this.vectorMode){
this.renderer.clear();
OpenLayers.Util.clearArray(this.features);
}else{
this.clearMarkers();
OpenLayers.Util.clearArray(this.markers);
}
this.tile.draw();
}
},CLASS_NAME:"OpenLayers.Layer.WFS"});
OpenLayers.Layer.Yahoo=OpenLayers.Class.create();
OpenLayers.Layer.Yahoo.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:15,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125],type:null,initialize:function(name,_807){
OpenLayers.Layer.EventPane.prototype.initialize.apply(this,arguments);
OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,arguments);
},loadMapObject:function(){
try{
this.mapObject=new YMap(this.div,this.type);
}
catch(e){
}
},setMap:function(map){
OpenLayers.Layer.EventPane.prototype.setMap.apply(this,arguments);
this.map.events.register("moveend",this,this.fixYahooEventPane);
},fixYahooEventPane:function(){
var _809=OpenLayers.Util.getElement("ygddfdiv");
if(_809!=null){
if(_809.parentNode!=null){
_809.parentNode.removeChild(_809);
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
},getOLZoomFromMapObjectZoom:function(_80b){
var zoom=null;
if(_80b!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getOLZoomFromMapObjectZoom.apply(this,[_80b]);
zoom=18-zoom;
}
return zoom;
},getMapObjectZoomFromOLZoom:function(_80d){
var zoom=null;
if(_80d!=null){
zoom=OpenLayers.Layer.FixedZoomLevels.prototype.getMapObjectZoomFromOLZoom.apply(this,[_80d]);
zoom=18-zoom;
}
return zoom;
},setMapObjectCenter:function(_80f,zoom){
this.mapObject.drawZoomAndCenter(_80f,zoom);
},getMapObjectCenter:function(){
return this.mapObject.getCenterLatLon();
},getMapObjectZoom:function(){
return this.mapObject.getZoomLevel();
},getMapObjectLonLatFromMapObjectPixel:function(_811){
return this.mapObject.convertXYLatLon(_811);
},getMapObjectPixelFromMapObjectLonLat:function(_812){
return this.mapObject.convertLatLonXY(_812);
},getLongitudeFromMapObjectLonLat:function(_813){
return _813.Lon;
},getLatitudeFromMapObjectLonLat:function(_814){
return _814.Lat;
},getMapObjectLonLatFromLonLat:function(lon,lat){
return new YGeoPoint(lat,lon);
},getXFromMapObjectPixel:function(_817){
return _817.x;
},getYFromMapObjectPixel:function(_818){
return _818.y;
},getMapObjectPixelFromXY:function(x,y){
return new YCoordPoint(x,y);
},CLASS_NAME:"OpenLayers.Layer.Yahoo"});
OpenLayers.Control.EditingToolbar=OpenLayers.Class.create();
OpenLayers.Control.EditingToolbar.prototype=OpenLayers.Class.inherit(OpenLayers.Control.Panel,{initialize:function(_81b,_81c){
OpenLayers.Control.Panel.prototype.initialize.apply(this,[_81c]);
this.addControls([new OpenLayers.Control.Navigation()]);
var _81d=[new OpenLayers.Control.DrawFeature(_81b,OpenLayers.Handler.Point,{"displayClass":"olControlDrawFeaturePoint"}),new OpenLayers.Control.DrawFeature(_81b,OpenLayers.Handler.Path,{"displayClass":"olControlDrawFeaturePath"}),new OpenLayers.Control.DrawFeature(_81b,OpenLayers.Handler.Polygon,{"displayClass":"olControlDrawFeaturePolygon"})];
for(var i=0;i<_81d.length;i++){
_81d[i].featureAdded=function(_81f){
_81f.state=OpenLayers.State.INSERT;
};
}
this.addControls(_81d);
},draw:function(){
var div=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);
this.activateControl(this.controls[0]);
return div;
},CLASS_NAME:"OpenLayers.Control.EditingToolbar"});
OpenLayers.Format.WFS=OpenLayers.Class.create();
OpenLayers.Format.WFS.prototype=OpenLayers.Class.inherit(OpenLayers.Format.GML,{layer:null,wfsns:"http://www.opengis.net/wfs",initialize:function(_821,_822){
OpenLayers.Format.GML.prototype.initialize.apply(this,[_821]);
this.layer=_822;
if(this.layer.featureNS){
this.featureNS=this.layer.featureNS;
}
if(this.layer.options.geometry_column){
this.geometryName=this.layer.options.geometry_column;
}
if(this.layer.options.typename){
this.featureName=this.layer.options.typename;
}
},write:function(_823){
var _824=document.createElementNS("http://www.opengis.net/wfs","wfs:Transaction");
for(var i=0;i<_823.length;i++){
switch(_823[i].state){
case OpenLayers.State.INSERT:
_824.appendChild(this.insert(_823[i]));
break;
case OpenLayers.State.UPDATE:
_824.appendChild(this.update(_823[i]));
break;
case OpenLayers.State.DELETE:
_824.appendChild(this.remove(_823[i]));
break;
}
}
return _824;
},createFeatureXML:function(_826){
var _827=this.buildGeometryNode(_826.geometry);
var _828=document.createElementNS(this.featureNS,"feature:"+this.geometryName);
_828.appendChild(_827);
var _829=document.createElementNS(this.featureNS,"feature:"+this.featureName);
_829.appendChild(_828);
for(var attr in _826.attributes){
var _82b=document.createTextNode(_826.attributes[attr]);
var _82c=attr;
if(attr.search(":")!=-1){
_82c=attr.split(":")[1];
}
var _82d=document.createElementNS(this.featureNS,"feature:"+_82c);
_82d.appendChild(_82b);
_829.appendChild(_82d);
}
return _829;
},insert:function(_82e){
var _82f=document.createElementNS(this.wfsns,"wfs:Insert");
_82f.appendChild(this.createFeatureXML(_82e));
return _82f;
},update:function(_830){
if(!_830.fid){
alert("Can't update a feature for which there is no FID.");
}
var _831=document.createElementNS(this.wfsns,"wfs:Update");
_831.setAttribute("typeName",this.layerName);
var _832=document.createElementNS(this.wfsns,"wfs:Property");
var _833=document.createElementNS("http://www.opengis.net/wfs","wfs:Name");
var _834=document.createTextNode(this.geometryName);
_833.appendChild(_834);
_832.appendChild(_833);
var _835=document.createElementNS("http://www.opengis.net/wfs","wfs:Value");
_835.appendChild(this.buildGeometryNode(_830.geometry));
_832.appendChild(_835);
_831.appendChild(_832);
var _836=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _837=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_837.setAttribute("fid",_830.fid);
_836.appendChild(_837);
_831.appendChild(_836);
return _831;
},remove:function(_838){
if(!_838.attributes.fid){
alert("Can't update a feature for which there is no FID.");
return false;
}
var _839=document.createElementNS(this.featureNS,"wfs:Delete");
_839.setAttribute("typeName",this.layerName);
var _83a=document.createElementNS("http://www.opengis.net/ogc","ogc:Filter");
var _83b=document.createElementNS("http://www.opengis.net/ogc","ogc:FeatureId");
_83b.setAttribute("fid",_838.attributes.fid);
_83a.appendChild(_83b);
_839.appendChild(_83a);
return _839;
},destroy:function(){
this.layer=null;
},CLASS_NAME:"OpenLayers.Format.WFS"});
OpenLayers.Geometry.Curve=OpenLayers.Class.create();
OpenLayers.Geometry.Curve.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry.MultiPoint,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_83c){
OpenLayers.Geometry.MultiPoint.prototype.initialize.apply(this,arguments);
},getLength:function(){
var _83d=0;
if(this.components&&(this.components.length>1)){
for(var i=1;i<this.components.length;i++){
_83d+=this.components[i-1].distanceTo(this.components[i]);
}
}
return _83d;
},CLASS_NAME:"OpenLayers.Geometry.Curve"});
OpenLayers.Layer.KaMap=OpenLayers.Class.create();
OpenLayers.Layer.KaMap.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Grid,{isBaseLayer:true,units:null,resolution:OpenLayers.DOTS_PER_INCH,DEFAULT_PARAMS:{i:"jpeg",map:""},initialize:function(name,url,_841,_842){
var _843=new Array();
_843.push(name,url,_841,_842);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_843);
this.params=(_841?_841:{});
if(_841){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},getURL:function(_844){
var _845=this.map.getResolution();
var _846=Math.round((this.map.getScale()*10000))/10000;
var pX=Math.round(_844.left/_845);
var pY=-Math.round(_844.top/_845);
return this.getFullRequestString({t:pY,l:pX,s:_846});
},addTile:function(_849,_84a){
var url=this.getURL(_849);
return new OpenLayers.Tile.Image(this,_84a,_849,url,this.tileSize);
},_initTiles:function(){
var _84c=this.map.getSize();
var _84d=this.map.getExtent();
var _84e=this.map.getMaxExtent();
var _84f=this.map.getResolution();
var _850=_84f*this.tileSize.w;
var _851=_84f*this.tileSize.h;
var _852=_84d.left;
var _853=Math.floor(_852/_850);
var _854=_852/_850-_853;
var _855=-_854*this.tileSize.w;
var _856=_853*_850;
var _857=_84d.top;
var _858=Math.ceil(_857/_851);
var _859=_858-_857/_851;
var _85a=-(_859+1)*this.tileSize.h;
var _85b=_858*_851;
_855=Math.round(_855);
_85a=Math.round(_85a);
this.origin=new OpenLayers.Pixel(_855,_85a);
var _85c=_855;
var _85d=_856;
var _85e=0;
do{
var row;
row=this.grid[_85e++];
if(!row){
row=new Array();
this.grid.push(row);
}
_856=_85d;
_855=_85c;
var _860=0;
do{
var _861=new OpenLayers.Bounds(_856,_85b,_856+_850,_85b+_851);
var x=_855;
x-=parseInt(this.map.layerContainerDiv.style.left);
var y=_85a;
y-=parseInt(this.map.layerContainerDiv.style.top);
var px=new OpenLayers.Pixel(x,y);
var tile;
tile=row[_860++];
if(!tile){
tile=this.addTile(_861,px);
row.push(tile);
}else{
tile.moveTo(_861,px,false);
}
_856+=_850;
_855+=this.tileSize.w;
}while(_856<=_84d.right+_850*this.buffer);
_85b-=_851;
_85a+=this.tileSize.h;
}while(_85b>=_84d.bottom-_851*this.buffer);
this.spiralTileLoad();
},CLASS_NAME:"OpenLayers.Layer.KaMap"});
OpenLayers.Layer.MapServer=OpenLayers.Class.create();
OpenLayers.Layer.MapServer.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{mode:"map",map_imagetype:"png"},initialize:function(name,url,_868,_869){
var _86a=new Array();
_86a.push(name,url,_868,_869);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_86a);
if(arguments.length>0){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
if(_869==null||_869.isBaseLayer==null){
this.isBaseLayer=((this.params.transparent!="true")&&(this.params.transparent!=true));
}
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.MapServer(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},addTile:function(_86c,_86d){
var url=this.getURL(_86c);
return new OpenLayers.Tile.Image(this,_86d,_86c,url,this.tileSize);
},getURL:function(_86f){
if(this.gutter){
_86f=this.adjustBoundsByGutter(_86f);
}
var _870=[_86f.left,_86f.bottom,_86f.right,_86f.top];
var url=this.getFullRequestString({mapext:_870,imgext:_870,map_size:[this.imageSize.w,this.imageSize.h],imgx:this.imageSize.w/2,imgy:this.imageSize.h/2,imgxy:[this.imageSize.w,this.imageSize.h]});
return url;
},getFullRequestString:function(_872,_873){
var url=(_873==null)?this.url:_873;
if(typeof url=="object"){
url=url[Math.floor(Math.random()*url.length)];
}
var _875=url;
var _876=OpenLayers.Util.extend(new Object(),this.params);
_876=OpenLayers.Util.extend(_876,_872);
var _877=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getArgs(url));
for(var key in _876){
if(key.toUpperCase() in _877){
delete _876[key];
}
}
var _879=OpenLayers.Util.getParameterString(_876);
_879=_879.replace(/,/g,"+");
if(_879!=""){
var _87a=url.charAt(url.length-1);
if((_87a=="&")||(_87a=="?")){
_875+=_879;
}else{
if(url.indexOf("?")==-1){
_875+="?"+_879;
}else{
_875+="&"+_879;
}
}
}
return _875;
},CLASS_NAME:"OpenLayers.Layer.MapServer"});
OpenLayers.Layer.TMS=OpenLayers.Class.create();
OpenLayers.Layer.TMS.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Grid,{reproject:false,isBaseLayer:true,tileOrigin:null,initialize:function(name,url,_87d){
var _87e=new Array();
_87e.push(name,url,{},_87d);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_87e);
},destroy:function(){
OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.TMS(this.name,this.url,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_880){
var res=this.map.getResolution();
var x=(_880.left-this.tileOrigin.lon)/(res*this.tileSize.w);
var y=(_880.bottom-this.tileOrigin.lat)/(res*this.tileSize.h);
var z=this.map.getZoom();
var path="1.0.0"+"/"+this.layername+"/"+z+"/"+x+"/"+y+"."+this.type;
var url=this.url;
if(url instanceof Array){
url=this.selectUrl(path,url);
}
return url+path;
},addTile:function(_887,_888){
var url=this.getURL(_887);
return new OpenLayers.Tile.Image(this,_888,_887,url,this.tileSize);
},setMap:function(map){
OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);
if(!this.tileOrigin){
this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom);
}
},CLASS_NAME:"OpenLayers.Layer.TMS"});
OpenLayers.Layer.WMS=OpenLayers.Class.create();
OpenLayers.Layer.WMS.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{service:"WMS",version:"1.1.1",request:"GetMap",styles:"",exceptions:"application/vnd.ogc.se_inimage",format:"image/jpeg"},reproject:true,initialize:function(name,url,_88d,_88e){
var _88f=new Array();
_88d=OpenLayers.Util.upperCaseObject(_88d);
_88f.push(name,url,_88d,_88e);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_88f);
OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
if(_88e==null||_88e.isBaseLayer==null){
this.isBaseLayer=((this.params.TRANSPARENT!="true")&&(this.params.TRANSPARENT!=true));
}
},destroy:function(){
OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.WMS(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.Grid.prototype.clone.apply(this,[obj]);
return obj;
},getURL:function(_891){
if(this.gutter){
_891=this.adjustBoundsByGutter(_891);
}
return this.getFullRequestString({BBOX:_891.toBBOX(),WIDTH:this.imageSize.w,HEIGHT:this.imageSize.h});
},addTile:function(_892,_893){
var url=this.getURL(_892);
return new OpenLayers.Tile.Image(this,_893,_892,url,this.tileSize);
},mergeNewParams:function(_895){
var _896=OpenLayers.Util.upperCaseObject(_895);
var _897=[_896];
OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,_897);
},getFullRequestString:function(_898){
var _899=this.map.getProjection();
this.params.SRS=(_899=="none")?null:_899;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Layer.WMS"});
OpenLayers.Layer.WorldWind=OpenLayers.Class.create();
OpenLayers.Layer.WorldWind.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{},isBaseLayer:true,lzd:null,zoomLevels:null,initialize:function(name,url,lzd,_89d,_89e,_89f){
this.lzd=lzd;
this.zoomLevels=_89d;
var _8a0=new Array();
_8a0.push(name,url,_89e,_89f);
OpenLayers.Layer.Grid.prototype.initialize.apply(this,_8a0);
this.params=(_89e?_89e:{});
if(_89e){
OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);
}
},addTile:function(_8a1,_8a2){
if(this.map.getResolution()<=(this.lzd/512)&&this.getZoom()<=this.zoomLevels){
var url=this.getURL(_8a1);
return new OpenLayers.Tile.Image(this,_8a2,_8a1,url,this.tileSize);
}else{
return new OpenLayers.Tile.Image(this,_8a2,_8a1,OpenLayers.Util.getImagesLocation()+"blank.gif",this.tileSize);
}
},getZoom:function(){
var zoom=this.map.getZoom();
var _8a5=this.map.getMaxExtent();
zoom=zoom-Math.log(this.maxResolution/(this.lzd/512))/Math.log(2);
return zoom;
},getURL:function(_8a6){
var zoom=this.getZoom();
var _8a8=this.map.getMaxExtent();
var deg=this.lzd/Math.pow(2,this.getZoom());
var x=Math.floor((_8a6.left-_8a8.left)/deg);
var y=Math.floor((_8a6.bottom-_8a8.bottom)/deg);
if(this.map.getResolution()<=(this.lzd/512)&&this.getZoom()<=this.zoomLevels){
return this.getFullRequestString({L:zoom,X:x,Y:y});
}else{
return OpenLayers.Util.getImagesLocation()+"blank.gif";
}
},CLASS_NAME:"OpenLayers.Layer.WorldWind"});
OpenLayers.Geometry.LineString=OpenLayers.Class.create();
OpenLayers.Geometry.LineString.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry.Curve,{initialize:function(_8ac){
OpenLayers.Geometry.Curve.prototype.initialize.apply(this,arguments);
},removeComponent:function(_8ad){
if(this.components&&(this.components.length>2)){
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
}
},CLASS_NAME:"OpenLayers.Geometry.LineString"});
OpenLayers.Layer.MapServer.Untiled=OpenLayers.Class.create();
OpenLayers.Layer.MapServer.Untiled.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.HTTPRequest,{default_params:{mode:"map",map_imagetype:"png"},reproject:true,ratio:1,tile:null,doneLoading:false,initialize:function(name,url,_8b0,_8b1){
var _8b2=[];
_8b2.push(name,url,_8b0,_8b1);
OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this,_8b2);
OpenLayers.Util.applyDefaults(this.params,this.default_params);
if((_8b1==null)||(_8b1.isBaseLayer==null)){
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
var _8b5=this.map.getSize();
_8b5.w=_8b5.w*this.ratio;
_8b5.h=_8b5.h*this.ratio;
this.tileSize=_8b5;
this.imageSize=_8b5;
this.imageOffset=new OpenLayers.Pixel(0,0);
},moveTo:function(_8b6,_8b7,_8b8){
if(!this.doneLoading){
this.events.triggerEvent("loadcancel");
this.doneLoading=true;
}
OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
if(_8b6==null){
_8b6=this.map.getExtent();
}
var _8b9=(this.tile==null);
var _8ba=(!_8b9&&!this.tile.bounds.containsBounds(_8b6));
if(_8b7||_8b9||(!_8b8&&_8ba)){
if(this.tile){
this.tile.clear();
}
var _8bb=_8b6.getCenterLonLat();
var _8bc=_8b6.getWidth()*this.ratio;
var _8bd=_8b6.getHeight()*this.ratio;
var _8be=new OpenLayers.Bounds(_8bb.lon-(_8bc/2),_8bb.lat-(_8bd/2),_8bb.lon+(_8bc/2),_8bb.lat+(_8bd/2));
this.setTileSize();
var url=this.getURL(_8be);
var ul=new OpenLayers.LonLat(_8be.left,_8be.top);
var pos=this.map.getLayerPxFromLonLat(ul);
if(this.tile&&!this.tile.size.equals(this.tileSize)){
this.tile.destroy();
this.tile=null;
}
this.events.triggerEvent("loadstart");
this.doneLoading=false;
if(!this.tile){
this.tile=new OpenLayers.Tile.Image(this,pos,_8be,url,this.tileSize);
this.tile.draw();
var _8c2=function(){
this.doneLoading=true;
this.events.triggerEvent("loadend");
};
OpenLayers.Event.observe(this.tile.imgDiv,"load",_8c2.bindAsEventListener(this));
}else{
this.tile.moveTo(_8be,pos);
}
}
},getURL:function(_8c3){
var url=this.getFullRequestString({mapext:_8c3.toBBOX().replace(/,/g," "),imgext:_8c3.toBBOX().replace(/,/g," "),map_size:this.tileSize.w+" "+this.tileSize.h,imgx:this.tileSize.w/2,imgy:this.tileSize.h/2,imgxy:this.tileSize.w+" "+this.tileSize.h});
return url;
},setUrl:function(_8c5){
OpenLayers.Layer.HTTPRequest.prototype.setUrl.apply(this,arguments);
this.moveTo();
},mergeNewParams:function(_8c6){
OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this,[_8c6]);
this.moveTo(null,true);
},getFullRequestString:function(_8c7){
var _8c8=this.map.getProjection();
this.params.srs=(_8c8=="none")?null:_8c8;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Layer.MapServer.Untiled"});
OpenLayers.Layer.WMS.Untiled=OpenLayers.Class.create();
OpenLayers.Layer.WMS.Untiled.prototype=OpenLayers.Class.inherit(OpenLayers.Layer.HTTPRequest,{DEFAULT_PARAMS:{service:"WMS",version:"1.1.1",request:"GetMap",styles:"",exceptions:"application/vnd.ogc.se_inimage",format:"image/jpeg"},reproject:true,ratio:2,tile:null,doneLoading:false,initialize:function(name,url,_8cb,_8cc){
var _8cd=new Array();
_8cb=OpenLayers.Util.upperCaseObject(_8cb);
_8cd.push(name,url,_8cb,_8cc);
OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this,_8cd);
OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
if((_8cc==null)||(_8cc.isBaseLayer==null)){
this.isBaseLayer=((this.params.TRANSPARENT!="true")&&(this.params.TRANSPARENT!=true));
}
},destroy:function(){
if(this.tile){
this.tile.destroy();
this.tile=null;
}
OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this,arguments);
},clone:function(obj){
if(obj==null){
obj=new OpenLayers.Layer.WMS.Untiled(this.name,this.url,this.params,this.options);
}
obj=OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this,[obj]);
return obj;
},setMap:function(map){
OpenLayers.Layer.HTTPRequest.prototype.setMap.apply(this,arguments);
},setTileSize:function(){
var _8d0=this.map.getSize();
_8d0.w=_8d0.w*this.ratio;
_8d0.h=_8d0.h*this.ratio;
this.tileSize=_8d0;
this.imageSize=_8d0;
this.imageOffset=new OpenLayers.Pixel(0,0);
},moveTo:function(_8d1,_8d2,_8d3){
if(!this.doneLoading){
this.events.triggerEvent("loadcancel");
this.doneLoading=true;
}
OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);
if(_8d1==null){
_8d1=this.map.getExtent();
}
var _8d4=(this.tile==null);
var _8d5=(!_8d4&&!this.tile.bounds.containsBounds(_8d1));
if(_8d2||_8d4||(!_8d3&&_8d5)){
if(this.tile){
this.tile.clear();
}
var _8d6=_8d1.getCenterLonLat();
var _8d7=_8d1.getWidth()*this.ratio;
var _8d8=_8d1.getHeight()*this.ratio;
var _8d9=new OpenLayers.Bounds(_8d6.lon-(_8d7/2),_8d6.lat-(_8d8/2),_8d6.lon+(_8d7/2),_8d6.lat+(_8d8/2));
this.setTileSize();
var url=this.getURL(_8d9);
var ul=new OpenLayers.LonLat(_8d9.left,_8d9.top);
var pos=this.map.getLayerPxFromLonLat(ul);
if(this.tile&&!this.tile.size.equals(this.tileSize)){
this.tile.destroy();
this.tile=null;
}
this.events.triggerEvent("loadstart");
this.doneLoading=false;
if(!this.tile){
this.tile=new OpenLayers.Tile.Image(this,pos,_8d9,url,this.tileSize);
this.tile.draw();
var _8dd=function(){
this.doneLoading=true;
this.events.triggerEvent("loadend");
};
OpenLayers.Event.observe(this.tile.imgDiv,"load",_8dd.bindAsEventListener(this));
}else{
this.tile.moveTo(_8d9,pos);
}
}
},getURL:function(_8de){
return this.getFullRequestString({"BBOX":_8de.toBBOX(),"WIDTH":this.tileSize.w,"HEIGHT":this.tileSize.h});
},setUrl:function(_8df){
OpenLayers.Layer.HTTPRequest.prototype.setUrl.apply(this,arguments);
this.moveTo();
},mergeNewParams:function(_8e0){
var _8e1=OpenLayers.Util.upperCaseObject(_8e0);
var _8e2=[_8e1];
OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams.apply(this,_8e2);
this.moveTo(null,true);
},getFullRequestString:function(_8e3){
var _8e4=this.map.getProjection();
this.params.SRS=(_8e4=="none")?null:_8e4;
return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments);
},CLASS_NAME:"OpenLayers.Layer.WMS.Untiled"});
OpenLayers.Geometry.LinearRing=OpenLayers.Class.create();
OpenLayers.Geometry.LinearRing.prototype=OpenLayers.Class.inherit(OpenLayers.Geometry.LineString,{componentTypes:["OpenLayers.Geometry.Point"],initialize:function(_8e5){
OpenLayers.Geometry.LineString.prototype.initialize.apply(this,arguments);
},addComponent:function(_8e6,_8e7){
var _8e8=false;
var _8e9=this.components[this.components.length-1];
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,[_8e9]);
if(_8e7!=null||!_8e6.equals(_8e9)){
_8e8=OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,arguments);
}
var _8ea=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_8ea.clone()]);
return _8e8;
},removeComponent:function(_8eb){
if(this.components.length>4){
var _8ec=this.components[this.components.length-1];
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,[_8ec]);
OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);
var _8ed=this.components[0];
OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[_8ed.clone()]);
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
OpenLayers.Handler.Path=OpenLayers.Class.create();
OpenLayers.Handler.Path.prototype=OpenLayers.Class.inherit(OpenLayers.Handler.Point,{line:null,freehand:false,freehandToggle:"shiftKey",initialize:function(_8f3,_8f4,_8f5){
OpenLayers.Handler.Point.prototype.initialize.apply(this,arguments);
},createGeometry:function(){
this.line=new OpenLayers.Geometry.LineString();
this.point=new OpenLayers.Geometry.Point();
},destroyGeometry:function(){
this.line.destroy();
this.point.destroy();
},addPoint:function(){
this.line.addComponent(this.point.clone(),this.line.components.length);
},freehandMode:function(evt){
return (this.freehandToggle&&evt[this.freehandToggle])?!this.freehand:this.freehand;
},modifyGeometry:function(){
var _8f7=this.line.components.length-1;
this.line.components[_8f7].x=this.point.x;
this.line.components[_8f7].y=this.point.y;
},drawGeometry:function(){
this.layer.renderer.drawGeometry(this.line,this.style);
this.layer.renderer.drawGeometry(this.point,this.style);
},geometryClone:function(){
return this.line.clone();
},mousedown:function(evt){
if(this.lastDown&&this.lastDown.equals(evt.xy)){
return false;
}
if(this.lastDown==null){
this.createGeometry();
}
this.mouseDown=true;
this.lastDown=evt.xy;
var _8f9=this.control.map.getLonLatFromPixel(evt.xy);
this.point.x=_8f9.lon;
this.point.y=_8f9.lat;
if((this.lastUp==null)||!this.lastUp.equals(evt.xy)){
this.addPoint();
}
this.drawGeometry();
this.drawing=true;
return false;
},mousemove:function(evt){
if(this.drawing){
var _8fb=this.map.getLonLatFromPixel(evt.xy);
this.point.x=_8fb.lon;
this.point.y=_8fb.lat;
if(this.mouseDown&&this.freehandMode(evt)){
this.addPoint();
}else{
this.modifyGeometry();
}
this.drawGeometry();
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
this.callback("point",[this.point]);
}
return false;
}
return true;
},dblclick:function(evt){
if(!this.freehandMode(evt)){
var _8fe=this.line.components.length-1;
this.line.removeComponent(this.line.components[_8fe]);
this.finalize(this.line);
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Path"});
OpenLayers.Handler.Polygon=OpenLayers.Class.create();
OpenLayers.Handler.Polygon.prototype=OpenLayers.Class.inherit(OpenLayers.Handler.Path,{polygon:null,initialize:function(_8ff,_900,_901){
OpenLayers.Handler.Path.prototype.initialize.apply(this,arguments);
},createGeometry:function(){
this.polygon=new OpenLayers.Geometry.Polygon();
this.line=new OpenLayers.Geometry.LinearRing();
this.polygon.addComponent(this.line);
this.point=new OpenLayers.Geometry.Point();
},destroyGeometry:function(){
this.polygon.destroy();
this.point.destroy();
},modifyGeometry:function(){
var _902=this.line.components.length-2;
this.line.components[_902].x=this.point.x;
this.line.components[_902].y=this.point.y;
},drawGeometry:function(){
this.layer.renderer.drawGeometry(this.polygon,this.style);
this.layer.renderer.drawGeometry(this.point,this.style);
},geometryClone:function(){
return this.polygon.clone();
},dblclick:function(evt){
if(!this.freehandMode(evt)){
var _904=this.line.components.length-2;
this.line.removeComponent(this.line.components[_904]);
this.finalize(this.line);
}
return false;
},CLASS_NAME:"OpenLayers.Handler.Polygon"});

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
function mkOv(_2f,top,_31,_32){
var a=_31>>1,b=_32>>1,wod=_31&1,hod=(_32&1)+1,cx=_2f+a,cy=top+b,x=0,y=b,ox=0,oy=b,aa=(a*a)<<1,bb=(b*b)<<1,st=(aa>>1)*(1-(b<<1))+bb,tt=(bb>>1)-aa*((b<<1)-1),w,h;
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
function mkOv2D(_34,top,_36,_37){
var s=this.stroke;
_36+=s-1;
_37+=s-1;
var a=_36>>1,b=_37>>1,wod=_36&1,hod=(_37&1)+1,cx=_34+a,cy=top+b,x=0,y=b,aa=(a*a)<<1,bb=(b*b)<<1,st=(aa>>1)*(1-(b<<1))+bb,tt=(bb>>1)-aa*((b<<1)-1);
if(s-4<0&&(!(s-2)||_36-51>0&&_37-51>0)){
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
var _a=(_36-((s-1)<<1))>>1,_b=(_37-((s-1)<<1))>>1,_x=0,_y=_b,_aa=(_a*_a)<<1,_bb=(_b*_b)<<1,_st=(_aa>>1)*(1-(_b<<1))+_bb,_tt=(_bb>>1)-_aa*((_b<<1)-1),pxl=new Array(),pxt=new Array(),_pxb=new Array();
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
function mkOvDott(_3d,top,_3f,_40){
var a=_3f>>1,b=_40>>1,wod=_3f&1,hod=_40&1,cx=_3d+a,cy=top+b,x=0,y=b,aa2=(a*a)<<1,aa4=aa2<<1,bb=(b*b)<<1,st=(aa2>>1)*(1-(b<<1))+bb,tt=(bb>>1)-aa2*((b<<1)-1),drw=true;
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
}else{
this.drawLine=mkLin;
this.mkOv=mkOv;
this.drawRect=mkRect;
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
this.mkDiv(x,y,w,h);
};
this.drawPolygon=function(x,y){
this.drawPolyline(x,y);
this.drawLine(x[x.length-1],y[x.length-1],x[0],y[0]);
};
this.drawEllipse=this.drawOval=function(x,y,w,h){
this.mkOv(x,y,w,h);
};
this.fillEllipse=this.fillOval=function(_60,top,w,h){
var a=(w-=1)>>1,b=(h-=1)>>1,wod=(w&1)+1,hod=(h&1)+1,cx=_60+a,cy=top+b,x=0,y=b,ox=0,oy=b,aa2=(a*a)<<1,aa4=aa2<<1,bb=(b*b)<<1,st=(aa2>>1)*(1-(b<<1))+bb,tt=(bb>>1)-aa2*((b<<1)-1),pxl,dw,dh;
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
this.fillPolygon=function(_65,_66){
var i;
var y;
var _69,maxy;
var x1,y1;
var x2,y2;
var _6c,ind2;
var _6d;
var n=_65.length;
if(!n){
return;
}
_69=_66[0];
maxy=_66[0];
for(i=1;i<n;i++){
if(_66[i]<_69){
_69=_66[i];
}
if(_66[i]>maxy){
maxy=_66[i];
}
}
for(y=_69;y<=maxy;y++){
var _6f=new Array();
_6d=0;
for(i=0;i<n;i++){
if(!i){
_6c=n-1;
ind2=0;
}else{
_6c=i-1;
ind2=i;
}
y1=_66[_6c];
y2=_66[ind2];
if(y1<y2){
x1=_65[_6c];
x2=_65[ind2];
}else{
if(y1>y2){
y2=_66[_6c];
y1=_66[ind2];
x2=_65[_6c];
x1=_65[ind2];
}else{
continue;
}
}
if((y>=y1)&&(y<y2)){
_6f[_6d++]=Math.round((y-y1)*(x2-x1)/(y2-y1)+x1);
}else{
if((y==maxy)&&(y>y1)&&(y<=y2)){
_6f[_6d++]=Math.round((y-y1)*(x2-x1)/(y2-y1)+x1);
}
}
}
_6f.sort(integer_compare);
for(i=0;i<_6d;i+=2){
w=_6f[i+1]-_6f[i];
this.mkDiv(_6f[i],y,_6f[i+1]-_6f[i]+1,1);
}
}
};
this.drawString=function(txt,x,y){
this.htm+="<div style=\"position:absolute;white-space:nowrap;"+"left:"+x+"px;"+"top:"+y+"px;"+"font-family:"+this.ftFam+";"+"font-size:"+this.ftSz+";"+"color:"+this.color+";"+this.ftSty+"\">"+txt+"</div>";
};
this.drawImage=function(_73,x,y,w,h){
this.htm+="<div style=\"position:absolute;"+"left:"+x+"px;"+"top:"+y+"px;"+"width:"+w+";"+"height:"+h+";\">"+"<img src=\""+_73+"\" width=\""+w+"\" height=\""+h+"\">"+"</div>";
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

var MB_IS_MOZ=(document.implementation&&document.implementation.createDocument)?true:false;
function XslProcessor(_1,_2){
this.xslUrl=_1;
this.xslDom=Sarissa.getDomDocument();
this.xslDom.async=false;
this.xslDom.validateOnParse=false;
this.xslDom.load(_1);
if(Sarissa.getParseErrorText(this.xslDom)!=Sarissa.PARSED_OK){
alert(mbGetMessage("errorLoadingStylesheet",_1));
}
this.processor=new XSLTProcessor();
this.processor.importStylesheet(this.xslDom);
this.docNSUri=_2;
this.transformNodeToString=function(_3){
try{
var _4=this.transformNodeToObject(_3);
var s=(new XMLSerializer()).serializeToString(_4);
return Sarissa.unescape(s);
}
catch(e){
alert(mbGetMessage("exceptionTransformingDoc",this.xslUrl));
alert("XSL="+(new XMLSerializer()).serializeToString(this.xslDom));
alert("XML="+(new XMLSerializer()).serializeToString(_3));
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
alert(mbGetMessage("errorLoadingDocument",_b,_e.statusText,_e.responseText));
var _f=Sarissa.getDomDocument();
_f.parseError=-1;
return _f;
}else{
if(null==_e.responseXML){
alert(mbGetMessage("nullXmlResponse",_e.responseText));
}
return _e.responseXML;
}
}
function postGetLoad(_10,_11,_12,dir,_14){
var _15=new XMLHttpRequest();
if(_10.indexOf("http://")==0){
_15.open("POST",config.proxyUrl,false);
_15.setRequestHeader("serverUrl",_10);
}else{
_10=_10+"?dir="+dir+"&fileName="+_14;
_15.open("POST",_10,false);
}
_15.setRequestHeader("content-type","text/xml");
if(_12){
_15.setRequestHeader("content-type",_12);
}
_15.send(_11);
if(_15.status>=400){
alert(mbGetMessage("errorLoadingDocument",_10,_15.statusText,_15.responseText));
var _16=Sarissa.getDomDocument();
_16.parseError=-1;
return _16;
}else{
if(null==_15.responseXML){
alert(mbGetMessage("nullXmlResponse",_15.responseText));
}
return _15.responseXML;
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
function createElementWithNS(doc,_19,_1a){
if(_SARISSA_IS_IE){
var _1b=doc.createElement(_19);
return _1b;
}else{
return doc.createElementNS(_1a,_19);
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
function setISODate(_1c){
var _1d=_1c.match(/(\d{4})-?(\d{2})?-?(\d{2})?T?(\d{2})?:?(\d{2})?:?(\d{2})?\.?(\d{0,3})?(Z)?/);
var res=null;
for(var i=1;i<_1d.length;++i){
if(!_1d[i]){
_1d[i]=(i==3)?1:0;
if(!res){
res=i;
}
}
}
var _20=new Date();
_20.setFullYear(parseInt(_1d[1],10));
_20.setMonth(parseInt(_1d[2],10)-1,parseInt(_1d[3],10));
_20.setDate(parseInt(_1d[3],10));
_20.setHours(parseInt(_1d[4],10));
_20.setMinutes(parseInt(_1d[5],10));
_20.setSeconds(parseFloat(_1d[6],10));
if(!res){
res=6;
}
_20.res=res;
return _20;
}
function getISODate(_21){
var res=_21.res?_21.res:6;
var _23="";
_23+=res>=1?_21.getFullYear():"";
_23+=res>=2?"-"+leadingZeros(_21.getMonth()+1,2):"";
_23+=res>=3?"-"+leadingZeros(_21.getDate(),2):"";
_23+=res>=4?"T"+leadingZeros(_21.getHours(),2):"";
_23+=res>=5?":"+leadingZeros(_21.getMinutes(),2):"";
_23+=res>=6?":"+leadingZeros(_21.getSeconds(),2):"";
return _23;
}
function leadingZeros(num,_25){
var _26=parseInt(num,10);
var _27=Math.pow(10,_25);
if(_26<_27){
_26+=_27;
}
return _26.toString().substr(1);
}
function fixPNG(_28,_29,_2a){
if(_SARISSA_IS_IE){
if(_2a){
var _2b=_2a.style.filter.substring(_2a.style.filter.indexOf("opacity=",0)+8,_2a.style.filter.indexOf(")",0));
var _2c=(_2b)?_2b/100:-1;
}
var _2d="id='"+_29+"' ";
var _2e=(_28.className)?"class='"+_28.className+"' ":"";
var _2f=(_28.title)?"title='"+_28.title+"' ":"title='"+_28.alt+"' ";
var _30="display:inline-block;"+_28.style.cssText;
var _31="<span "+_2d+_2e+_2f;
_31+=" style=\""+"width:"+_28.width+"px; height:"+_28.height+"px;"+_30+";";
if(_2c!=-1){
_31+="opacity="+_2c+";";
}
var src=_28.src;
src=src.replace(/\(/g,"%28");
src=src.replace(/\)/g,"%29");
src=src.replace(/'/g,"%27");
src=src.replace(/%23/g,"%2523");
_31+="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader";
_31+="(src='"+src+"', sizingMethod='scale')";
if(_2a&&_2c!=-1){
_31+=" alpha(opacity="+(_2c*100)+")";
}
_31+="; \"></span>";
return _31;
}
}
function getAbsX(elt){
return (elt.x)?elt.x:getAbsPos(elt,"Left")+2;
}
function getAbsY(elt){
return (elt.y)?elt.y:getAbsPos(elt,"Top")+2;
}
function getAbsPos(elt,_36){
iPos=0;
while(elt!=null){
iPos+=elt["offset"+_36];
elt=elt.offsetParent;
}
return iPos;
}
function getPageX(e){
var _38=0;
if(!e){
var e=window.event;
}
if(e.pageX){
_38=e.pageX;
}else{
if(e.clientX){
_38=e.clientX;
}
}
if(document.body&&document.body.scrollLeft){
_38+=document.body.scrollLeft;
}else{
if(document.documentElement&&document.documentElement.scrollLeft){
_38+=document.documentElement.scrollLeft;
}
}
return _38;
}
function getPageY(e){
var _3a=0;
if(!e){
var e=window.event;
}
if(e.pageY){
_3a=e.pageY;
}else{
if(e.clientY){
_3a=e.clientY;
}
}
if(document.body&&document.body.scrollTop){
_3a+=document.body.scrollTop;
}else{
if(document.documentElement&&document.documentElement.scrollTop){
_3a+=document.documentElement.scrollTop;
}
}
return _3a;
}
function getArgs(){
var _3b=new Object();
var _3c=location.search.substring(1);
var _3d=_3c.split("&");
for(var i=0;i<_3d.length;i++){
var pos=_3d[i].indexOf("=");
if(pos==-1){
continue;
}
var _40=_3d[i].substring(0,pos);
var _41=_3d[i].substring(pos+1);
_3b[_40]=unescape(_41.replace(/\+/g," "));
}
return _3b;
}
window.cgiArgs=getArgs();
function getScreenX(_42,_43){
bbox=_42.getBoundingBox();
width=_42.getWindowWidth();
bbox[0]=parseFloat(bbox[0]);
bbox[2]=parseFloat(bbox[2]);
var _44=(width/(bbox[2]-bbox[0]));
x=_44*(_43-bbox[0]);
return x;
}
function getScreenY(_45,_46){
var _47=_45.getBoundingBox();
var _48=_45.getWindowHeight();
_47[1]=parseFloat(_47[1]);
_47[3]=parseFloat(_47[3]);
var _49=(heighteight/(_47[3]-_47[1]));
var y=_48-(_49*(pt.y-_47[1]));
return y;
}
function getGeoCoordX(_4b,_4c){
var _4d=_4b.getBoundingBox();
var _4e=_4b.getWindowWidth();
_4d[0]=parseFloat(_4d[0]);
_4d[2]=parseFloat(_4d[2]);
var _4f=((_4d[2]-_4d[0])/_4e);
var x=_4d[0]+_4f*(xCoord);
return x;
}
function getGeoCoordY(_51){
var _52=context.getBoundingBox();
var _53=context.getWindowHeight();
_52[1]=parseFloat(_52[1]);
_52[3]=parseFloat(_52[3]);
var _54=((_52[3]-_52[1])/_53);
var y=_52[1]+_54*(_53-_51);
return y;
}
function makeElt(_56){
var _57=document.createElement(_56);
document.getElementsByTagName("body").item(0).appendChild(_57);
return _57;
}
var newWindow="";
function openPopup(url,_59,_5a){
if(_59==null){
_59=300;
}
if(_5a==null){
_5a=200;
}
if(!newWindow.closed&&newWindow.location){
newWindow.location.href=url;
}else{
newWindow=window.open(url,"name","height="+_5a+",width="+_59);
if(!newWindow.opener){
newwindow.opener=self;
}
}
if(window.focus){
newWindow.focus();
}
return false;
}
function debug(_5b){
tarea=makeElt("textarea");
tarea.setAttribute("rows","3");
tarea.setAttribute("cols","40");
tnode=document.createTextNode(_5b);
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
function addEvent(_5e,_5f,_60){
if(document.addEventListener){
_5e.addEventListener(_5f,_60,false);
}else{
if(document.attachEvent){
_5e.attachEvent("on"+_5f,_60);
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
function mbDebugMessage(_64,_65){
if(_64&&_64.debug){
alert(_65);
}
}
function mbGetMessage(_66){
var _67="NoMsgsFound";
if(config.widgetText){
var _68="/mb:WidgetText/mb:messages/mb:"+_66;
var _69=config.widgetText.selectNodes(_68);
if(!_69||_69.length==0){
_67=_66;
}else{
_67=_69.item(_69.length-1).firstChild.nodeValue;
if(arguments[mbGetMessage.length]){
var _6a=[].slice.call(arguments,mbGetMessage.length);
_6a.unshift(_67);
_67=mbFormatMessage.apply(this,_6a);
}
}
}
return _67;
}
function mbFormatMessage(_6b){
var _6c=_6b;
var _6d=[].slice.call(arguments,mbFormatMessage.length);
for(var i in _6d){
var _6f=new RegExp("\\{"+i+"\\}","g");
_6c=_6c.replace(_6f,_6d[i]);
}
return _6c;
}
function getCSSRule(_70,_71){
var _72=document.getElementById("mbGeneratedStyles");
if(!_72){
_72=document.createElement("style");
_72.type="text/css";
_72.title="mbGeneratedStyles";
_72.id="mbGeneratedStyles";
document.getElementsByTagName("head")[0].appendChild(_72);
}
if(document.styleSheets){
for(var i in document.styleSheets){
_72=document.styleSheets[i];
if(_72.title=="mbGeneratedStyles"){
break;
}
}
var moz=_72.cssRules?true:false;
var _75=false;
var _76=moz?_72.cssRules:_72.rules;
for(var ii in _76){
_75=_76[ii];
if(_75){
if(_75.selectorText==_70){
if(_71=="delete"){
if(moz){
_72.deleteRule(ii);
}else{
_72.removeRule(ii);
}
return true;
}else{
return _75;
}
}
}
}
if(_71=="add"){
var idx=_76.length;
if(moz){
_72.insertRule(_70+" { }",idx);
_75=_76[idx];
}else{
_72.addRule(_70,null,idx);
_75=_76[idx];
}
return _75;
}
}
return false;
}
function killCSSRule(_79){
return getCSSRule(_79,"delete");
}
function addCSSRule(_7a){
return getCSSRule(_7a,"add");
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

