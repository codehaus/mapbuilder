<?
/*
Script name: geoclientx.php
Description: Written in XHTML, GeoClientX is a client for web map services (WMSs) 
and web feature services (WFSs) as defined by the Open GIS Consortium.
Date: August 20, 2003
Author: Nedjo Rogers, GroundWorks Learning Centre, nedjo@gworks.ca

Copyright (C) 2003  Nedjo Rogers

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY--without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, see the license at:
http://www.gnu.org

Browser support:
* Netscape 7+
* Mozilla 1+
* Internet Explorer 5.0+

Credits:
This script incorporates elements and approaches of these 
open source projects:
* GeoClient by Amri Rosyada and Nedjo Rogers
* PHPWMS by Refractions Research
* DHTML "Landview" Mapserver client by Steve Lime

*/

// settings--adjust to change look and behaviour

//look--incompletely implemented
$fontFamily = "helvetica,arial,sans-serif"; //font family for body
$bgcolor1 = "#D4E2ED";  //light background color for text to be over
$bgcolor2 = "#739FC4";  //2nd light background color for text to be over
$bgcolor3 = "#D4E2ED"; //darker background color for light text to be over
$bgcolor4 = "#739FC4";
$textcolor1 = "#000000"; //main dark text
$textcolor2 = "#000000"; //lighter text
$mapWidth=300; //initial map width--adjustable by user
$mapHeight=150; //initial map height--adjustable by user
$keyMapWidth=150; //initial keymap width--not adjustable by user
$maptitle="GeoClientX Web Map Browser"; //title for page and for map box

//behaviour
$functionMode="map"; //initial mode: "map" (map display) or "search" (search WFS data)
$kml=1; //number of keymap layers to be loaded
$wmsLayersStatus="true"; //initial status of WMS layers--"true" for on
$wfsFeatureTypesStatus="true"; //initial status of WFS layers--"true" for on
$useTooltips="true"; //display tooltips for user help?
$showForm="true"; //open "add server" form on startup if no WMS already designated?
$useMeters="true"; //assume meters if SRS not lon/lat?
$tryRaster="true"; //try to load raster version if wfs points fail to load
$ptSizeThresh="50"; //feature count threshold above which to reduce size
$useIcons="true"; //use icons
$toolsDef[0]="true"; //show idenfity tool
$toolsDef[1]="true"; //show zoom in tool
$toolsDef[2]="true"; //show zoom out tool
$toolsDef[3]="true"; //show pan tool
$toolsDef[4]="false"; //show label tool (tool not yet functional)
$toolsDef[5]="true"; //show home tool
$toolsDef[6]="false"; //show edit tool (tool not yet functional)
$toolsDef[7]="false"; //show point input tool (tool not yet functional)
$toolsDef[8]="false"; //show line input tool (tool not yet functional)
$toolsDef[9]="false"; //show polygon input tool (tool not yet functional)
//end of settings

$browser=$_SERVER["HTTP_USER_AGENT"];
//test if browser is MSIE
$ismsie = strstr ($browser, 'MSIE');
//if not MSIE, use XHTML
if($ismsie==false){
  $XHTML=true;
}
//otherwise, not
else{
  $XHTML=false;
}

function openScript(){
  global $XHTML;
  echo "<script type=\"text/javascript\">\n";
  if($XHTML==true){
    echo "<![CDATA[\n";
  }
}
function closeScript(){
  global $XHTML;
  if($XHTML==true){
    echo "]]>\n";
  }
  echo "</script>\n";
}
if($XHTML==true){
  header("Content-type: application/xml");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
	   "http://www.w3.org/TR/html4/strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<?
}
else{
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	   "http://www.w3.org/TR/html4/loose.dtd">
<html>
<?
}
?>
<head>
<title id="pageTitle">GeoClientX: Web Map Browser in XHTML</title>
<style type="text/css">

body {font-family:<?=$fontFamily?>; font-size:10pt; color:<?=$textcolor1?>; margin:0px; padding:0px; }

point:circle {stroke:red; stroke-width:1; fill-opacity:0.4;}

td {
  font-size:10pt;
}

#masters {
  position: absolute;
  visibility: hidden;
}

#mapTable {
  position: relative;
  left:10px;
  top:10px;
}

#mapDiv {
  border: solid 1px gray
  color: #000000;
  padding: 0px;
  position: absolute;
  clip: rect(0,100%,100%,0);
}

#mapFrame {
  padding: 0px;
  position: absolute;
  clip: rect(0%,100%,100%,0%);
}

#inputFrame {
  padding: 0px;
  position: absolute;
  clip: rect(0,100%,100%,0);
  visibility: visible;
  z-index:210;
  width=0px;
  height=0px;
}

#formHeader {
  padding: 2px;
  background-color: blue;
  font-weight:bold;
  color: white;
  font-family:<?=$fontFamily?>;
  font-size:8pt;
  cursor: move;
}

#labelsFrame {
  padding: 0px;
  position: absolute;
  clip: rect(0,100%,100%,0);
}

#dragFrame {
  background-image: url(images/blank.gif);
  padding: 0px;
  position: absolute;
  visibility: hidden;
  clip: rect(0,100%,100%,0);
  width: 100px;
  height: 100px;
  z-index:200;
}

#keyMapBox {
  background-image: url(images/blank.gif);
  border-color: red;
  border-width:1px;
  border-style:solid;
  padding: 0px;
  position: absolute;
  width: 100px;
  height: 100px;
  z-index:200;
  visibility:hidden;
  filter: alpha(opacity=75);
  -moz-opacity: 0.75;
  cursor: move;
}

#imageMaster {
  position: absolute;
  top:0px;
  left:0px;
}

#overTitle {
  font-family:helvetica,arial,sans-serif; font-size:10pt;
  color:white;
  font-weight:bold;
  background-color: black;
  padding: 2px;
  width=100%;
}

#overText {
  font-family:helvetica,arial,sans-serif; font-size:10pt; 
  background-color: #ffffcc;
  color: black;
  padding: 2px;
  width=100%;
}

#box {
  z-index:4;
  visibility:hidden;
  position:absolute;
  left:0px; top:0px; width:1px; height:1px;
  border-color:red;
  border-width:1px;
  border-style:solid;
}

#over {
  z-index:2000;
  color:white;
  visibility:hidden;
  position:absolute;
  left:0px; top:0px;
  border-color:#cccccc;
  border-width:1px;
  border-style:solid;
  width:150px;
}

#formShell {
  z-index:1000;
  color:black;
  background-color:silver;
  visibility:hidden;
  position:absolute;
  left:100px; top:100px;
  border-color:black;
  border-width:1px;
  border-style:solid;
  width:200px;
}

#noticeShell {
  z-index:1000;
  color:black;
  background-color:silver;
  visibility:hidden;
  position:absolute;
  left:100px; top:100px;
  border-color:black;
  border-width:1px;
  border-style:solid;
  width:200px;
}

#resize {
  background-image: url(images/resize.gif);
  padding: 0px;
  position: absolute;
  visibility: hidden;
  clip: rect(0px,12px,12px,0px);
  cursor: w-resize;
  width: 12px;
  height: 12px;
  z-index:250;
}

#titleCell {
  background-color: wheat;
  font-weight:bold;
  padding: 4px;
}

#layersDiv {
  overflow: auto;
  width: 150px;
  height: 150px;
}

#infoFormCell {
  background-color: wheat;
  padding: 4px;
}

.mapImg {
  position:absolute;
  left:0px;
  top:0px;
}

.added {
  background-color: #c0a0a0;
  border: solid 1px #000000;
  color: #000000;
  margin: 0px;
  padding: 2px;
  position: absolute;
}

.legend {
  font-family:helvetica,arial,sans-serif; font-size:10pt; 
}
.tool {
  border: solid 1px black;
  background-color:white;
  background-style:solid;
  padding:0px;
}

.label {
  border: solid 1px red;
  background-color:yellow;
  background-style:solid;
}

</style>
<?
openScript();
?>
// Variable to keep track of user's SVG support
var svgSupport = "none";

//adapted from http://wwws.sun.com/software/xml/developers/svg/support/
// Internet Explorer returns 0 as the number of MIME types,
// so this code will not be executed by it. This is our indication
// to use VBScript to detect SVG support.
if (navigator.mimeTypes != null && navigator.mimeTypes.length > 0) {
  if ((navigator.mimeTypes["image/svg-xml"] != null)&&(navigator.mimeTypes["image/svg-xml"].enabledPlugin==null)) {
    svgSupport = "native";
  }
  else if ((navigator.mimeTypes["image/svg-xml"] != null)&&(navigator.mimeTypes["image/svg-xml"].enabledPlugin!=null)) {
    svgSupport = "plugin";
  }
}
var wmss=new Array();
var wfss=new Array();
var inputPoints=new Array();
var currentTool=0; //active tool in toolbar
var prevTool; //previous active tool
var defaultTool=0; //tool to be used by default
var activeWMS;  //active web map server, for editing
var homeBbox; //bounding box on initial load
var bbox; //current bounding box
var srs; //spatial reference system of map
var kml=<?=$kml?>; //number of layers to load from keymap
var wmsLayersStatus=<?=$wmsLayersStatus?>; //true to turn WMS layers on by default
var wfsFeatureTypesStatus=<?=$wfsFeatureTypesStatus?>; //true to turn WFS featureTypes on by default
var getUrl; //url of web map service or web feature service
var linkedWFS=null; //url of web feature service that serves some or all of the same datasets as the web map service; WMS layers and WFS featureTypes must have the same names
var mapWidth=<?=$mapWidth?>; //initial width of map image
var mapHeight=<?=$mapHeight?>; //initial height of map image
var keyMapWidth=<?=$keyMapWidth?>; //width of keymap (not adjustable)
var keyMapHeight; //initial height of keymap
var downPt; //x/y coordinate of user mousedown
var upPt; //x/y coordinate of user mouseup
var useTooltips=<?=$useTooltips?>; //whether tooltips should be shown
var showForm=<?=$showForm?>; //show "add server" form on startup?
var labels=new Array(); //Label objects
var service='wms'; //type of web service to be loaded ("wms" or "wfs")
var ismsie=(document.all); //boolean of whether the browser is MSIE (no support of XHTML in version 5)
var currWFSCall=null; //index of WFS object (in wfss array) that is being loaded through a GetFeature request
var units="metres"; //units of spatial reference system; null for no units
var currentScale; //current map scale; null if no units
var args = getargs(); // nab any URL-based arguments
var wmssPre; //array of onlineresource urls for wmss to be loaded, passed via the page url
var wfssPre; //array of onlineresource urls for wfss to be loaded, passed via the page url
var wmssPreLen = 0; //number of wmss to be preloaded
var wmssPreloaded //number of wmss already preloaded
var wfssPreLen = 0; //number of wfss to be preloaded
var wfssPreloaded //number of wfss already preloaded
var maptitle="<?=$maptitle?>" //used to set page title and title of map browser box
var useMeters=<?=$useMeters?>; //assume meters if SRS not lat/lon?
var functionMode="<?=$functionMode?>";
var panTarg; //target of pan action
var svgdoc; //reference to SVG editing element
var tryRaster=<?=$tryRaster?>;
var useIcons=<?=$useIcons?>;
var ptSizeThresh=<?=$ptSizeThresh?>;
var PixelsPerInch = 72; 
var InchesPerMapUnit;
var searchStr;
var origPos=new Point();
var prevPt=new Point();
var inputType=null; //type of feature being input: "point", "linestring", or "polygon";

var tools=new Array(); //tools for toolbar

//define tools here
tools[0]=new Tool("Id tool","Use to identify features",<?=$toolsDef[0]?>);
tools[1]=new Tool("Zoom in tool","Click and drag a rectangle to zoom in",<?=$toolsDef[1]?>);
tools[2]=new Tool("Zoom out tool","Click to zoom out",<?=$toolsDef[2]?>);
tools[3]=new Tool("Pan tool","Click and drag to move map view around",<?=$toolsDef[3]?>);
tools[4]=new Tool("Label tool","Click on the map to add a label",<?=$toolsDef[4]?>);
tools[5]=new Tool("Home tool","Return to original map view",<?=$toolsDef[5]?>);
tools[6]=new Tool("Data editing tool","Use to edit the geometry of existing features",<?=$toolsDef[6]?>);
tools[7]=new Tool("Point input tool","Use to input the geometry of new point features",<?=$toolsDef[7]?>);
tools[8]=new Tool("Line input tool","Use to input the geometry of new linestring features",<?=$toolsDef[8]?>);
tools[9]=new Tool("Polygon input tool","Use to input the geometry of new polygon features",<?=$toolsDef[9]?>);

// function to preload images

function preload(imgObj,imgSrc) {
	if (document.images) {
		eval(imgObj+' = new Image()')
		eval(imgObj+'.src = "'+imgSrc+'"')
	}
}

//preload images to be used in user interface
preload('x','images/x.gif');
preload('collapse','images/collapse.gif');
preload('expand','images/expand.gif');
preload('layer_info','images/layer_info.gif');

//function to toggle whether tooltips should be shown
function setShowTooltips(elt){
  if(elt.checked==true){
    useTooltips=true;
  }
  else{
    useTooltips=false;
  }
}

//function to show tooltips
function showTooltips(tipText,titleText){
  if(useTooltips==true){
    overText(document.createTextNode(tipText), document.createTextNode(titleText));
  }
}

//function to create an <img> element that a WMS image will be loaded into
function addWMSFrame(i){
  var mapFrame=document.getElementById("mapFrame");
  var newFrame=document.getElementById("wmsFrameMaster").cloneNode(false);
  newFrame.setAttribute("id","wmsFrame"+i);
  newFrame.setAttribute("name","wmsMap"+i);
  newFrame.setAttribute("width",mapWidth);
  newFrame.setAttribute("height",mapHeight);
  mapFrame.appendChild(newFrame);
}

//function to create an <div> element into which features (currently, only point features)
//will be loaded
function addWFSFrame(i){
  var dragFrame=document.getElementById("dragFrame");
  var divMaster=document.getElementById("divMaster");
  var newFrame=divMaster.cloneNode(false);
  newFrame.setAttribute("id","wfsFrame"+i);
  with(newFrame.style){
    height=mapHeight;
    width=mapWidth;
    zIndex=10000;
  }
  var child=divMaster.cloneNode(false);
  newFrame.appendChild(child);
  dragFrame.insertBefore(newFrame,dragFrame.firstChild);
  var featureFrame=divMaster.cloneNode(false);
  featureFrame.setAttribute("id","featureFrame"+i);
  featureFrame.style.visibility="hidden";
  var child2=divMaster.cloneNode(false);
  featureFrame.appendChild(child2);
  var featureMembers=document.getElementById("featureMembers");
  featureMembers.appendChild(featureFrame);
}

//function to find the target element of an event
function returnTarget(evt){
  evt = (evt) ? evt : ((window.event) ? window.event : "");
  var elt=null;
  if(evt.target){
    elt=evt.target;
  }
  else if(evt.srcElement){
    elt=evt.srcElement;
  }
  return elt;
}

//function to indicate that a current web service had been loaded
function showLoaded(eltId){
  var mapFrame=document.getElementById("mapFrame");
  mapFrame.style.visibility="visible";
  if(wmss.length==0){
    return;
  }
  serviceType=eltId.substring(0,3);
  var i= eltId.substring(8,eltId.length);
  switch(serviceType){
    case "wms":
      wmss[i].loaded=true;
      break;
    default:
      break;
  }
  testLoaded();
}

//function to test if all requested services have been loaded, and, if so, hide
//the notice that maps are being loaded
function testLoaded(){
  for(i=0;i<wmss.length;i++){
    if(wmss[i].loaded!=true){
      return;
    }
  }
  for(i=0;i<wfss.length;i++){
    if(wfss[i].loaded!=true){
      return;
    }
  }
  closeShell();
}

//function called when user clicks map with query tool active;
//request to server for feature information, loading results into a new window
function querydownhandler(evt){
  var anchor=document.getElementById("anchor");
  pt=new Point(getPageX(evt)-findPosX(anchor),getPageY(evt)-findPosY(anchor));
  var win_size = "width=280,height=450";
  var win_frame = "status=no,menubar=no,toolbar=no,resizeable=yes,scrollbars=yes";
  layersList="";
  if(wmss[activeWMS].querylayer==""){
    for(i=0;i<wmss[activeWMS].layers.length;i++){
      layersList+=wmss[activeWMS].layers[i].name+"%2C";
    }
  }
  else{
    layersList=wmss[activeWMS].querylayer;
  }
  url=wmss[activeWMS].onlineresource+"VERSION=1.1.0&REQUEST=GetFeatureInfo&LAYERS="+layersList+"&QUERY_LAYERS="+layersList+"&BBOX="+bbox.join('%2C')+"&SRS="+srs+"&X="+pt.x+"&Y="+pt.y+"&WIDTH="+mapWidth+"&HEIGHT="+mapHeight;
  url=escape(url);
  url = url.replace(new RegExp("/","g"),"%2F");
  url='query.php?onlineresource='+url+'&mode=query';
  window.qwin = open(url,"queryframe",win_size + "," + win_frame);
  window.qwin.focus();
}

function editdownhandler(evt){
  if((wmss[activeWMS].activelayer=="")||(wmss[activeWMS].activelayer==null)){
    alert("Choose an editable layer before clicking on the map.");
    return;
  }
  var anchor=document.getElementById("anchor");
  pt=new Point(getPageX(evt)-findPosX(anchor),getPageY(evt)-findPosY(anchor));
  url=wmss[activeWMS].onlineresource+"VERSION=1.1.0&REQUEST=GetFeatureInfo&LAYERS="+wmss[activeWMS].activelayer+"&QUERY_LAYERS="+layersList+"&BBOX="+bbox.join('%2C')+"&SRS="+srs+"&X="+pt.x+"&Y="+pt.y+"&WIDTH="+mapWidth+"&HEIGHT="+mapHeight;
  url=escape(url);
  url = url.replace(new RegExp("/","g"),"%2F");
  url='query.php?onlineresource='+url+'&mode=edit';
  importXML(url,"edit");
}
//function called when user clicks on map with label tool active;
//collects text and coordinates to create a new Label object
function labeldownhandler(evt){
  var anchor=document.getElementById("anchor");
  pt=new Point(getPageX(evt)-findPosX(anchor),getPageY(evt)-findPosY(anchor));
  pt=getGeoCoords(pt);
  str=prompt("Enter the text for your label",null);
  if(str){
    labels[labels.length]=new Label(pt,str);
  }
  writeLabels();
}

//function called when user mousedowns map with zoom in tool active.
//collects down coordinate and makes zoom box visible
function zoomdownhandler(evt) {
  downPt.x = getPageX(evt);
  downPt.y = getPageY(evt);
  document.onmousemove=zoommovehandler;
  document.onmouseup=zoomuphandler;
  var box=document.getElementById("box");
  with(box.style){
    left=downPt.x+"px";
    top=downPt.y+"px";
    visibility="visible";
  }
  return false;
}

//function called when user drags on map with zoom in tool active.
//expands zoom box
function zoommovehandler(evt) {
  movePt=new Point(getPageX(evt),getPageY(evt));
  var box=document.getElementById("box");
  if(downPt.x<movePt.x){
    x1=downPt.x;
    x2=movePt.x;
  }
  else{
    x1=movePt.x;
    x2=downPt.x;
  }
  if(downPt.y<movePt.y){
    y1=downPt.y;
    y2=movePt.y;
  }
  else{
    y1=movePt.y;
    y2=downPt.y;
  }
  with(box.style){
    left=x1+"px";
    top=y1+"px";
    width=(x2-x1)+"px";
    height=(y2-y1)+"px";
    visibility='visible';
  }
  return false;
}

//function called when user mouseups map with zoom in tool active.
//collects up coordinate, adjusts bbox, and calls functions to adjust keymap size and 
//redraw map at new extent.
function zoomuphandler(evt) {
  document.onmousemove=null;
  document.onmouseup=null;
  var anchor=document.getElementById("anchor");
  upPt.x=getPageX(evt)-findPosX(anchor);
  upPt.y=getPageY(evt)-findPosY(anchor);
  downPt.x-=findPosX(anchor);
  downPt.y-=findPosY(anchor);
  var box=document.getElementById("box");
  with(box.style){
    left="0px";
    top="0px";
    width="0px";
    height="0px";
    visibility='hidden';
  }
  if((upPt.x==downPt.x)||(upPt.y==downPt.y)){
    alert("Click and drag a rectangle to zoom.");
    return;
  }
  var pt1=new Point();
  var pt2=new Point();
  if(downPt.x<upPt.x){
    pt1.x=downPt.x;
    pt2.x=upPt.x;
  }
  else{
    pt1.x=upPt.x;
    pt2.x=downPt.x;
  }
  if(downPt.y<upPt.y){
    pt1.y=downPt.y;
    pt2.y=upPt.y;
  }
  else{
    pt1.y=upPt.y;
    pt2.y=downPt.y;
  }
  pt1=getGeoCoords(pt1);
  pt2=getGeoCoords(pt2);
  bbox[0]=pt1.x;
  bbox[2]=pt2.x;
  bbox[1]=pt2.y;
  bbox[3]=pt1.y;
  bbox=wms_scale(bbox);
  getMap();
  positionKeyMapBox();
  writeLabels();
  return false;
}

//function called on user mousdown when pan tool is active
//collects down point
function pandownhandler(evt) {
  downPt.x = getPageX(evt);
  downPt.y = getPageY(evt);
  document.onmousemove=panmovehandler;
  document.onmouseup=panuphandler;
  if(currWFSCall!=null){
    clearFeatures(currWFSCall);
  }
  return false;
}
//function called on user mousemove when pan tool is active
//moves map frame
function panmovehandler(evt) {
  movePt=new Point(getPageX(evt),getPageY(evt));
  var mapFrame=document.getElementById("mapFrame");
  mapFrame.style.left = (movePt.x-(downPt.x))+"px";
  mapFrame.style.top = (movePt.y-(downPt.y))+"px";
  return false;
}

//function called on user mouseup when pan tool is active
//collects up point, converts to SRS coordinates, adjusts bbox, and calls
//map images for new extent
function panuphandler(evt) {
  document.onmousemove=null;
  document.onmouseup=null;
  var mapFrame=document.getElementById("mapFrame");
  downPt.x=downPt.x-findPosX(mapFrame);
  downPt.y=downPt.y-findPosY(mapFrame);
  upPt.x=getPageX(evt)-findPosX(mapFrame);
  upPt.y=getPageY(evt)-findPosY(mapFrame);
  downPt=getGeoCoords(downPt);
  upPt=getGeoCoords(upPt);
  bbox[0]=parseFloat(bbox[0]);
  bbox[1]=parseFloat(bbox[1]);
  bbox[2]=parseFloat(bbox[2]);
  bbox[3]=parseFloat(bbox[3]);
  bbox[0]-=upPt.x-downPt.x;
  bbox[2]-=upPt.x-downPt.x;
  bbox[1]+=downPt.y-upPt.y;
  bbox[3]+=downPt.y-upPt.y;
  with(mapFrame.style){
    visibility='hidden';
    left = "0px";
    top = "0px";
  }
  getMap();
  positionKeyMapBox();
  writeLabels();
  return false;
}

function keymapboxdownhandler(evt) {
  var kmb=document.getElementById("keyMapBox");
  var keymapboxxoffset=parseInt(kmb.style.left);
  var keymapboxyoffset=parseInt(kmb.style.top);
  downPt.x = getPageX(evt)-keymapboxxoffset;
  downPt.y = getPageY(evt)-keymapboxyoffset;
  document.onmousemove=keymapboxmovehandler;
  document.onmouseup=keymapboxuphandler;
  return false;
}

function keymapboxmovehandler(evt) {
  movePt=new Point(getPageX(evt),getPageY(evt));
  var keyMapBox=document.getElementById("keyMapBox");
  var km=document.getElementById("keyMap");
  var keymapxoffset=findPosX(km);
  var keymapyoffset=findPosY(km);
  keyMapBox.style.left = (movePt.x-downPt.x)+"px";
  keyMapBox.style.top = (movePt.y-downPt.y)+"px";
  return false;
}

function keymapboxuphandler(evt){
  document.onmousemove=null;
  document.onmouseup=null;
  var km=document.getElementById("keyMap");
  var kmb=document.getElementById("keyMapBox");
  var keymapxoffset=findPosX(km);
  var keymapyoffset=findPosY(km);
  xf=(parseInt(kmb.style.left)-keymapxoffset)/keyMapWidth;
  yf=(parseInt(kmb.style.top)-keymapyoffset)/keyMapHeight;
  var origBbox=new Array();
  origBbox[0]=parseFloat(homeBbox[0]);
  origBbox[1]=parseFloat(homeBbox[1]);
  origBbox[2]=parseFloat(homeBbox[2]);
  origBbox[3]=parseFloat(homeBbox[3]);
  origBbox=wms_scale(origBbox);
  origwid=origBbox[2]-origBbox[0];
  orighi=origBbox[3]-origBbox[1];
  wid=bbox[2]-bbox[0];
  hi=bbox[3]-bbox[1];
  xmin=origBbox[0]+(origwid*xf);
  ymax=origBbox[3]-(orighi*yf)

  xmax=xmin+wid;
  ymin=ymax-hi;
  bbox[0]=xmin;
  bbox[1]=ymin;
  bbox[2]=xmax;
  bbox[3]=ymax;
  getMap();
}

function keymapboxoverhandler(evt){
  elt=returnTarget(evt);
  elt.style.backgroundColor="pink";
}

function keymapboxouthandler(evt){
  elt=returnTarget(evt);
  elt.style.backgroundColor="";
}

function setPanTarg(targ){
  panTarg=targ;
}

//collects down point
function initpan(evt) {
  panTarg=returnTarget(evt).parentNode.parentNode.parentNode;
  if(ismsie){
    panTarg=panTarg.parentNode;
  }
//  origPos.x=findPosX(panTarg);
//  origPos.y=findPosY(panTarg);
  origPos.x=parseInt(panTarg.style.left);
  origPos.y=parseInt(panTarg.style.top);
  downPt.x = getPageX(evt);
  downPt.y = getPageY(evt);
  document.onmousemove=dopan;
  document.onmouseup=endpan;
  return false;
}
//moves elt
function dopan(evt) {
  movePt=new Point(getPageX(evt),getPageY(evt));
  panTarg.style.left = origPos.x+(movePt.x-(downPt.x))+"px";
  panTarg.style.top = origPos.y+(movePt.y-(downPt.y))+"px";
  return false;
}

//collects up point
function endpan(evt) {
  document.onmousemove=null;
  document.onmouseup=null;
  panTarg=null;
  return false;
}

function getPageX(e){
	var posx = 0;
	if (!e) var e = window.event;
	if (e.pageX)
	{
		posx = e.pageX;
	}
	else if (e.clientX)
	{
		posx = e.clientX;
	}
	return posx;
}

function getPageY(e){
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageY)
	{
		posy = e.pageY;
	}
	else if (e.clientY)
	{
		posy = e.clientY;
	}
	return posy;
}

function Tool(title,description,enabled){
  this.title=title;
  this.description=description;
  this.enabled=enabled;
}

Tool.prototype.remove=removeTool;

function Point(x,y,z){
  this.x=x;
  this.y=y;
  this.z=z;
}

function writeLabels(){
  if(labels.length>0){
    var divMaster=document.getElementById("divMaster");
    var lblsDiv=divMaster.cloneNode(false);
  }
  else{
    return;
  }
  for(i=0;i<labels.length;i++){

    var lblDiv=divMaster.cloneNode(false);
    var lblPt=getScreenCoords(labels[i].pt);
//    alert"ptx: "+lblPt.x+" pty: "+lblPt.y);
    with(lblDiv.style){
      left=lblPt.x;
      top=lblPt.y;
      backgroundColor='pink';
    }
    lblsDiv.appendChild(lblDiv);
    var txtNode=document.createTextNode(labels[i].str);
    lblDiv.appendChild(txtNode);
  }
  var labelsFrame=document.getElementById("labelsFrame");
  labelsFrame.replaceChild(lblsDiv,labelsFrame.firstChild);
}

function getGeoCoords(pt){
  bbox[0]=parseFloat(bbox[0]);
  bbox[1]=parseFloat(bbox[1]);
  bbox[2]=parseFloat(bbox[2]);
  bbox[3]=parseFloat(bbox[3]);
  var xfac = ((bbox[2]-bbox[0]) / mapWidth);
  var yfac = ((bbox[3]-bbox[1]) / mapHeight);
  pt.x=bbox[0] + xfac*(pt.x);
  pt.y=bbox[1] + yfac*(mapHeight-pt.y);
  return pt;
}

// adapted from http://www.xs4all.nl/~ppk/js/index.html?/~ppk/js/importxml.html
function importXML(url,type){
	if (document.implementation && document.implementation.createDocument){
		xmlDoc = document.implementation.createDocument("", "", null);
		switch(type){
			case 'wms':
				xmlDoc.onload = addWMS;
				break;
			case 'wfs':
				xmlDoc.onload = addWFS;
				break;
			case 'GetFeature':
				xmlDoc.onload = addFeatures;
				break;
		}	
	}
	else if (window.ActiveXObject)
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		switch(type){
			case 'wms':
				xmlDoc.onreadystatechange = function () {
					if (xmlDoc.readyState == 4) addWMS()
				}
				break;
			case 'wfs':
				xmlDoc.onreadystatechange = function () {
					if (xmlDoc.readyState == 4) addWFS()
				}
				break;
			case 'GetFeature':
				xmlDoc.onreadystatechange = function () {
					if (xmlDoc.readyState == 4) addFeatures()
				}
				break;
		}	

 	}
	else
	{
		alert('Your browser can\'t handle this script');
		return;
	}
  url=escape(url);
  url = url.replace(new RegExp("/","g"),"%2F");
  url='translate.php?onlineresource='+url+'&contenttype=xml';
//prompt("url",url);
	xmlDoc.load(url);
}
// end from http://www.xs4all.nl/~ppk/js/index.html?/~ppk/js/importxml.html

function getCapabilities(serv,url){
  if(serv=='wfs'){
    if(wmss.length==0){
      alert("You must add a web map server before adding a web feature server");
      return;
    }
  }
  importXML(url+"REQUEST=GetCapabilities&SERVICE="+serv.toUpperCase()+"&VERSION=1.1.1",serv);
  closeForm();
  showWaiting();
  return false;
}


function getPath(node,childNames){
  if(childNames==null){
    return null;
  }
  if(childNames.indexOf("/")!=-1){
    childs=childNames.split("/");
  }
  else{
    var nodes=node.getElementsByTagName(childNames);
    if(nodes.length>0){
      return nodes.item(0);
    }
    else{
      return null;
    }
  }
  var nodes=node.getElementsByTagName(childs[0]);

	if(nodes.length>0){
		node=nodes.item(0);
		for(i=1;i<childs.length;i++){
			var nodes=node.getElementsByTagName(childs[i]);
			if(nodes.length>0){
				node=nodes.item(0);
			}
			else{
				node=null;
				break;
			}
		}
	}
	else{
		node=null;
	}
	return node;
}

//adapted from http://www.xs4all.nl/~ppk/js/findpos.html
function findPosX(obj)
{
	var curleft = 0;

	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft
			if(obj.style.left){
          			curleft+=parseInt(obj.style.left);
			}
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
		if(obj.style.left){
          		curleft+=parseInt(obj.style.left);
		}
	return curleft;
}

function findPosY(obj)
{
	var curtop = 0;

	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop;
			if(obj.style.top){
          			curtop+=parseInt(obj.style.top);
			}
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
		if(obj.style.top){
          		curtop+=parseInt(obj.style.top);
		}
	return curtop;
}
// end from http://www.xs4all.nl/~ppk/js/findpos.html

function showWaiting(){
  txtNode=document.createTextNode("Loading data from server, please wait...");
  openShell(txtNode);
}

function closeShell(){
  var noticeShell=document.getElementById("noticeShell");
  noticeShell.style.visibility="hidden";
}

function openShell(node){
  var noticeShell=document.getElementById("noticeShell");
  noticeShell.replaceChild(node,noticeShell.firstChild);
  noticeShell.style.visibility="visible";
}

function openForm(node){
  var formShell=document.getElementById("formShell");
  formShell.replaceChild(node,formShell.firstChild);
  formShell.style.visibility="visible";
}

function closeForm(){
  var formShell=document.getElementById("formShell");
  formShell.replaceChild(document.createElement("div"),formShell.firstChild);
  formShell.style.visibility="hidden";
}

function openLoadForm(){
  var formMaster=document.getElementById("loadFormMaster");
  var node=formMaster.cloneNode(true);
  node.firstChild.firstChild.onmousedown=initpan;
  openForm(node);
}

function showNoSvgNotice(){
  var noSvgNotice=document.getElementById("noSvgNotice");
  var node=noSvgNotice.cloneNode(true);
  node.firstChild.firstChild.onmousedown=initpan;
  openForm(node);
}
function submitGetCapabilities(){
  getCapabilities(service,getUrl);
}

function setService(node){
  service=node.value;
}

function setGetUrl(node){
  getUrl=node.value;
}

function setSearchStr(node){
  searchStr=node.value;
}
function setLinkedWFS(node){
  linkedWFS=node.value;
}

// these functions adapted from phpwms by Refractions Research
// see http://mapserver.refractions.net

function wms_pan ( bbox, size, click ) {
  //
  // Calculate a new extent based on an image size and image
  // click coordinates. Move extent linearly so that the 
  // click becomes the new spatial center.
  //
  bbox[0]=parseFloat(bbox[0]);
  bbox[1]=parseFloat(bbox[1]);
  bbox[2]=parseFloat(bbox[2]);
  bbox[3]=parseFloat(bbox[3]);
  sw = bbox[2] - bbox[0];
  sh = bbox[3] - bbox[1];
  iw = size[0];
  ih = size[1];
  x = click[0];
  y = ih - click[1] - 1;
  mx = iw / 2;
  my = ih / 2;

  bbox[0] = bbox[0] - sw * (mx - x) / iw;
  bbox[1] = bbox[1] - sh * (my - y) / ih;
  bbox[2] = bbox[2] - sw * (mx - x) / iw;
  bbox[3] = bbox[3] - sh * (my - y) / ih;
  
  return bbox;
}
factor=2;
function wms_zoom (bbox) {
  // 
  // Create a new resized extent based on a spatial extent and 
  // zoom factor.
  //
  bbox[0]=parseFloat(bbox[0]);
  bbox[1]=parseFloat(bbox[1]);
  bbox[2]=parseFloat(bbox[2]);
  bbox[3]=parseFloat(bbox[3]);
  sw = bbox[2] - bbox[0];
  sh = bbox[3] - bbox[1];
  mx = (bbox[2] + bbox[0]) / 2;
  my = (bbox[3] + bbox[1]) / 2;
  bbox[0] = mx - factor * sw / 2;
  bbox[1] = my - factor * sh / 2;
  bbox[2] = mx + factor * sw / 2;
  bbox[3] = my + factor * sh / 2;
  return bbox;
}

function wms_scale ( ext ) {
  // 
  // Resize a spatial extent to have the same aspect ratio
  // as an image size.
  //
  //
  ext[0]=parseFloat(ext[0]);
  ext[1]=parseFloat(ext[1]);
  ext[2]=parseFloat(ext[2]);
  ext[3]=parseFloat(ext[3]);
  sw = ext[2] - ext[0];
  sh = ext[3] - ext[1];
  if(sw/mapWidth>sh/mapHeight){
    ext[1]=ext[1]-(((sw/mapWidth*mapHeight)-sh)/2);
    ext[3]=ext[3]+(((sw/mapWidth*mapHeight)-sh)/2);
  }
  else{
    ext[0]=ext[0]-(((sh/mapHeight*mapWidth)-sw)/2);
    ext[2]=ext[2]+(((sh/mapHeight*mapWidth)-sw)/2);
  }
  return ext;
}

function getSRS(node) {
  // Read the SRS from a WMS capabilities.
  path = "Capability/Layer/BoundingBox";
  srsNode = getPath(node,path);
  if(srsNode!=null) {
    // If there is a BoundingBox, we are using it for default 
    // extent, so get that SRS.
    srs=srsNode.getAttribute("SRS");
  } 
  else {
    // Otherwise we are using WMS standard Lat/Lon for
    // default extent so use WMS standard Lat/Lon.
    srs = "EPSG:4326";
  }
  return srs;
}

function getBBOX(node) {
  path = "Capability/Layer/BoundingBox";
  bboxNode = getPath(node,path);
  if(bboxNode!=null) {
    // If there is a BoundingBox, get its coords 
    minx=bboxNode.getAttribute("minx");
    miny=bboxNode.getAttribute("miny");
    maxx=bboxNode.getAttribute("maxx");
    maxy=bboxNode.getAttribute("maxy");
  } 
  else {
    path = "Capability/Layer/LatLonBoundingBox";
    bboxNode = getPath(node,path);
    if(bboxNode!=null) {
      minx=bboxNode.getAttribute("minx");
      miny=bboxNode.getAttribute("miny");
      maxx=bboxNode.getAttribute("maxx");
      maxy=bboxNode.getAttribute("maxy");
    }
    else{
      minx=-180;
      miny=-90;
      maxx=180;
      maxy=90;
    }
  }
  return new Array(minx,miny,maxx,maxy);
}

function getBBOX2(node) {
  path = "Capability/Layer/BoundingBox";
  bboxNode = getPath(node,path);
  if(bboxNode!=null) {
    // If there is a BoundingBox, get its coords 
    minx=bboxNode.getAttribute("minx");
    miny=bboxNode.getAttribute("miny");
    maxx=bboxNode.getAttribute("maxx");
    maxy=bboxNode.getAttribute("maxy");
  } 
  else {
    path = "Capability/Layer/LatLonBoundingBox";
    bboxNode = getPath(node,path);
    if(bboxNode!=null) {
      minx=bboxNode.getAttribute("minx");
      miny=bboxNode.getAttribute("miny");
      maxx=bboxNode.getAttribute("maxx");
      maxy=bboxNode.getAttribute("maxy");
    }
    else{
      minx=-180;
      miny=-90;
      maxx=180;
      maxy=90;
    }
  }
  return new Array(minx,miny,maxx,maxy);
}
// end adapted from phpwms

function addWMS(){
  openShell(document.createTextNode("Interpreting XML from server..."));
  root=xmlDoc.documentElement;
  if(root){
    if(root.nodeName!="WMT_MS_Capabilities"){
      alert("No suitable response from server");
      closeShell();
      return;
    }
  }
  else{
    alert("No response from server");
    closeShell();
    return;
  }
  getUrlNode=getPath(root,"GetMap/DCPType/HTTP/Get/OnlineResource");
//  getUrl=getUrlNode.getAttribute("xlink:href");
  titleNode=getPath(root,"Service/Title");
  if(titleNode!=null){
    wmsTitle=titleNode.firstChild.nodeValue;
  }
  else{
    wmsTitle=null;
  }
  abstractNode=getPath(root,"Service/Abstract");
  if(abstractNode!=null){
    wmsAbstract=abstractNode.firstChild.nodeValue;
  }
  else{
    wmsAbstract=null;
  }
  contactPersonNode=getPath(root,"Service/ContactInformation/ContactPersonPrimary/ContactPerson");
  if(contactPersonNode!=null){
    wmsContactPerson=contactPersonNode.firstChild.nodeValue;
  }
  else{
    wmsContactPerson=null;
  }
  contactOrganizationNode=getPath(root,"Service/ContactInformation/ContactPersonPrimary/ContactOrganization");
  if(contactOrganizationNode!=null){
    wmsContactOrganization=contactOrganizationNode.firstChild.nodeValue;
  }
  else{
    wmsContactOrganization=null;
  }
  contactPositionNode=getPath(root,"Service/ContactInformation/ContactPosition");
  if(contactPositionNode!=null){
    wmsContactPosition=contactPositionNode.firstChild.nodeValue;
  }
  else{
    wmsContactPosition=null;
  }
  contactContactElectronicMailAddressNode=getPath(root,"Service/ContactInformation/ContactElectronicMailAddress");
  if(contactContactElectronicMailAddressNode!=null){
    wmsContactContactElectronicMailAddress=contactContactElectronicMailAddressNode.firstChild.nodeValue;
  }
  else{
    wmsContactContactElectronicMailAddress=null;
  }
  wmsSRS=getSRS(root);
  if(srs==null){
    srs=wmsSRS;
  }
  wmsBBOX=getBBOX(root);
  if(bbox==null){
    bbox=wms_scale(wmsBBOX);
  }
  if(homeBbox==null){
    homeBbox=getBBOX(root);
  }
  wmss[wmss.length]=new WMS(getUrl,wmsTitle,wmsAbstract,wmsContactPerson,wmsContactOrganization,wmsContactPosition,wmsContactContactElectronicMailAddress,wmsSRS,wmsBBOX,true);
  addWMSFrame(wmss.length-1);
  activeWMS=wmss.length-1;
  childs=root.getElementsByTagName("Layer");
//start with index of 1 to omit first, containing layer
  for(i=1;i<childs.length;i++){
    show=true;
    node=childs.item(i).parentNode;
    //test if this is a nested Layer node, if so don't display
    while(!(node==root)){
      node=node.parentNode;
      if(node.nodeName=="Layer"){
        show=false;
      }
    }
    if(show==true){
      l=childs.item(i);
      layerName=l.getElementsByTagName("Name").item(0).firstChild.nodeValue;
      layerTitle=l.getElementsByTagName("Title").item(0).firstChild.nodeValue;
      layerScaleHintNode=l.getElementsByTagName("ScaleHint");
      if(layerScaleHintNode.length>0){
        layerMinScale=layerScaleHintNode.item(0).getAttribute("min");
        if(layerMinScale==0){
          layerMinScale=null;
        }
        else{
          layerMinScale=layerMinScale*2004.4;
        }
        layerMaxScale=layerScaleHintNode.item(0).getAttribute("max");
        if(layerMaxScale==0){
          layerMaxScale=null;
        }
        else{
          layerMaxScale=layerMaxScale*2004.4;
        }
      }
      else{
        layerMinScale=null;
        layerMaxScale=null;
      }
      layerQueryAtt=l.getAttribute("queryable");
      if(layerQueryAtt==1){
        layerQueryable=true;
      }
      else{
        layerQueryable=false;
      }
      layerOpaqueAtt=l.getAttribute("opaque");
      if(layerOpaqueAtt==1){
        layerOpaque=1;
      }
      else{
        layerOpaque=0;
      }
      if(layerName.indexOf("webuser")==-1){
        wmss[wmss.length-1].layers[wmss[wmss.length-1].layers.length] = new WMSLayer(layerName,layerTitle,layerQueryable,layerOpaque,layerMinScale,layerMaxScale,wmsLayersStatus);
      }
      else{
        wmss[wmss.length-1].webuser=true;
      }
    }
  }
//  resizeMap();
  writeLegend();
  if(wmss.length==1){
    // this is the first wms
    setCurrentTool(defaultTool);
    var dragFrame=document.getElementById("dragFrame");
    dragFrame.onmousemove=showCoords;
    dragFrame.onmouseout=new Function("window.status=''");
    getKeyMap();
    var keyMapBox=document.getElementById("keyMapBox");
    keyMapBox.onmousedown=keymapboxdownhandler;
    keyMapBox.onmouseover=keymapboxoverhandler;
    keyMapBox.onmouseout=keymapboxouthandler;
    keyMapBox.style.visibility="visible";
    positionKeyMapBox();
  }
  closeShell();
  getMap();
  if(linkedWFS!=null){
    getUrl=linkedWFS;
    getCapabilities("wfs",getUrl);
  }
  if(wmssPreloaded<wmssPreLen){
    getUrl=wmssPre[wmssPreloaded-1];
    getCapabilities("wms",getUrl);
    wmssPreloaded++;
  }
  else{
    if(wfssPreloaded<wfssPreLen){
      getUrl=wfssPre[0];
      getCapabilities("wfs",getUrl);
      wfssPreloaded=1;
    }
  }
}

function addWFS(){
  openShell(document.createTextNode("Interpreting XML from server..."));
  root=xmlDoc.documentElement;
  if(root){
    if(root.nodeName!="WFS_Capabilities"){
      alert("No suitable response from server");
      closeShell();
      return;
    }
  }
  else{
    alert("No response from server");
    closeShell();
    return;
  }
  titleNode=getPath(root,"Service/Title");
  wfsTitle=titleNode.firstChild.nodeValue;
  var wfsAbstract=null;
  if(getPath(root,"Service/Abstract")){
    abstractNode=getPath(root,"Service/Abstract");
    wfsAbstract=abstractNode.firstChild.nodeValue;
  }
  wfss[wfss.length]=new WFS(getUrl,wfsTitle,wfsAbstract,true);
  addWFSFrame((wfss.length)-1);
  childs=root.getElementsByTagName("FeatureType");
  for(i=0;i<childs.length;i++){
    f=childs.item(i);
    featureTypeName=f.getElementsByTagName("Name").item(0).firstChild.nodeValue;
    wfss[wfss.length-1].featureTypes[wfss[wfss.length-1].featureTypes.length] = new WFSFeatureType(featureTypeName,wfsFeatureTypesStatus);
  }
  writeLegend();
  closeShell();
  if(linkedWFS!=null){
    for(i=0;i<wmss.length;i++){
      if(wmss[i].wfs==wfss.length-1){
        for(l=0;l<wmss[i].layers.length;l++){
          for(f=0;f<wfss[wfss.length-w].featureTypes.length;f++){
            if(wmss[i].layers[l].name==wfss[wfss.length-w].featureTypes[f].name){
              wmss[i].layers[l].hasWFS=true;
            }
          }
        }
      }
    }
    linkedWFS=null;
  }
  if(wfssPreloaded<wfssPreLen){
    getUrl=wfssPre[wfssPreloaded-1];
    getCapabilities("wfs",getUrl);
    wfssPreloaded++;
  }
}

function showCoords(evt){
  var anchor=document.getElementById("anchor");
  pt=new Point(getPageX(evt)-findPosX(anchor),getPageY(evt)-findPosY(anchor));
  pt=getGeoCoords(pt);
  window.status="x: "+Math.round(pt.x*Math.pow(10,2))/Math.pow(10,2)+", y: "+Math.round(pt.y*Math.pow(10,2))/Math.pow(10,2);
}

function getKeyMap(){
  if(wmss.length==0){
    return;
  }
  var keyMap=document.getElementById("keyMap");
  layersStr="";
  if(wmss[0].layers.length>kml){
    len=kml;
  }
  else{
    len=wmss[0].layers.length;
  }
  for(l=0;l<len;l++){
    layersStr+=wmss[0].layers[l].name+",";
  }
  var origBbox=new Array();
  origBbox[0]=parseFloat(homeBbox[0]);
  origBbox[1]=parseFloat(homeBbox[1]);
  origBbox[2]=parseFloat(homeBbox[2]);
  origBbox[3]=parseFloat(homeBbox[3]);
  url=wmss[0].onlineresource+'VERSION=1.1.0&REQUEST=GetMap&LAYERS='+layersStr+'&SRS='+wmss[0].srs+'&BBOX='+wms_scale(origBbox).join(",")+'&WIDTH='+keyMapWidth+'&HEIGHT='+keyMapHeight;
  mapImg = new Image();
  mapImg.src = url;
  keyMap.setAttribute("src",mapImg.src);
}

function positionKeyMapBox(){
  if(wmss.length==0){
    return;
  }
  keyMapHeight=mapHeight*keyMapWidth/mapWidth;
  var km = document.getElementById("keyMap");
  var kmb = document.getElementById("keyMapBox");
  var keymapxoffset=findPosX(km);
  var keymapyoffset=findPosY(km);
  var origBbox=new Array();
  origBbox[0]=parseFloat(homeBbox[0]);
  origBbox[1]=parseFloat(homeBbox[1]);
  origBbox[2]=parseFloat(homeBbox[2]);
  origBbox[3]=parseFloat(homeBbox[3]);
  origBbox=wms_scale(origBbox);
  x=(((bbox[0]-origBbox[0])/(origBbox[2]-origBbox[0]))*keyMapWidth)+keymapxoffset;
  y=((-(bbox[3]-origBbox[3])/(origBbox[3]-origBbox[1]))*keyMapHeight)+keymapyoffset;
  wid=((bbox[2]-bbox[0])/(origBbox[2]-origBbox[0]))*keyMapWidth;
  if(wid<10){
    wid=10;
  }
  hi=((bbox[3]-bbox[1])/(origBbox[3]-origBbox[1]))*keyMapHeight;
  if(hi<8){
    hi=8;
  }
  with(kmb.style){
    left=x+"px";
    top=y+"px";
    width=wid+"px";
    height=hi+"px";
    clip="rect(0px,"+(wid+2)+"px,"+(hi+2)+"px,0px)";
  }
}

function WFSFeature(featureid,title,coord,atts){
  this.featureid=featureid;
  this.title=title;
  this.coord=coord;
  this.atts=atts;
}

function WFSFeatureAttribute(parameter,value){
  this.parameter=parameter;
  this.value=value;
}

function addFeatures(){
  openShell(document.createTextNode("Interpreting XML from server..."));
  root=xmlDoc.documentElement;

  try {
    if(root.nodeName!="featureCollection"){
      alert("error");
      throw "error";
    }
  }
  catch (e) {
    closeShell();
    if(tryRaster==true){
      wmss[currWFSCall].layers[1].status = true;
      mapImg = new Image();
      for(i=0;i<wmss.length;i++){
        if(wmss[i]!=null){
          layersStr="";
          for(l=0;l<wmss[i].layers.length;l++){
            if(wmss[i].layers[l].status){
              layersStr+=wmss[i].layers[l].name+",";
            }
          }
          url=wmss[i].onlineresource+'VERSION=1.1.0&REQUEST=GetMap&LAYERS='+layersStr+'&SRS='+wmss[i].srs+'&BBOX='+bbox.join(",")+'&WIDTH='+mapWidth+'&HEIGHT='+mapHeight;
          mapImg.src = url;
          document.getElementById("wmsFrame"+i).setAttribute("src",mapImg.src);
        }
      }
    }
    else{
      alert("No suitable response from server");
    }
    return;
  }
  showAlert=false;
// Haven't taken this approach (cacheing FeatureCollections for later use) because
// didn't work in IE 5.  Instead, parsing features as WFSFeature objects.

//  var featureFrame=document.getElementById("featureFrame"+currWFSCall);
//  featureFrame.replaceChild(root,featureFrame.firstChild);
  wfss[currWFSCall].bbox[0]=parseFloat(bbox[0]);
  wfss[currWFSCall].bbox[1]=parseFloat(bbox[1]);
  wfss[currWFSCall].bbox[2]=parseFloat(bbox[2]);
  wfss[currWFSCall].bbox[3]=parseFloat(bbox[3]);
  var features=root.getElementsByTagName("featureMember");
  if(features.length==0){
    closeShell();
    return;
  }
  for(i=0;i<features.length;i++){
    childs=features.item(i).childNodes;
    // make sure this isn't an empty node
    for(j=0;j<childs.length;j++){
      feat=childs.item(j);
      theNodeName=feat.nodeName;
      if(theNodeName!="#text"){
        break;
      }
    }
    featureType=feat.nodeName;
    featureid=feat.getAttribute("fid");
//    featureid=feat.attributes.getNamedItem("fid");
    featureTypeInd=null;
    for(j=0;j<wfss[currWFSCall].featureTypes.length;j++){
      if(wfss[currWFSCall].featureTypes[j].name==featureType){
        featureTypeInd=j;
        break;
      }
    }

    title=null;
    coords=feat.getElementsByTagName("coordinates");
    //if there is only one point, assume that it is a point layer
    if((coords.length==1)&&(coords.item(0).firstChild.nodeValue.indexOf(" ")==-1)){
      geom=coords.item(0).firstChild.nodeValue.split(",");
      coord=new Point(geom[0],geom[1]);
    }
    else{
      showAlert=true;
      break;
    }
    var atts=new Array();
    childs=feat.childNodes;
    var title,iconId,category;
    for(j=0;j<childs.length;j++){
      var childNodeName=childs.item(j).nodeName;
      childNodeNameLength=childNodeName.length;
      periodIndex=childNodeName.indexOf(".");
      if(periodIndex!=-1){
        childNodeName = (childNodeName.substring(periodIndex+1,childNodeNameLength));
      }
      if((childNodeName!="#text")&&(childNodeName.indexOf("geom")==-1)&&(childNodeName.indexOf("Geometry")==-1)&&(childNodeName.indexOf("XMin")==-1)&&(childNodeName.indexOf("XMax")==-1)&&(childNodeName.indexOf("YMin")==-1)&&(childNodeName.indexOf("YMax")==-1)){
        atts[atts.length]=new WFSFeatureAttribute(childNodeName,childs.item(j).firstChild.nodeValue);
      }
      if((childNodeName=="Name")||(childNodeName=="Title")){
        title=childs.item(j).firstChild.nodeValue;
      }
      if(childNodeName=="IconID"){
        iconId=childs.item(j).firstChild.nodeValue;
      }
      if(childNodeName=="Category"){
        category=childs.item(j).firstChild.nodeValue;
      }
    }
    wfss[currWFSCall].featureTypes[featureTypeInd].features[wfss[currWFSCall].featureTypes[featureTypeInd].features.length]=new WFSFeature(featureid,title,iconId,category,coord,atts);
  }
  if(showAlert==true){
    alert("Encountered some non-point data; these were not processed.");
  }
  writeFeatures();
  closeShell();
}

function setEditable(type,ind){
  if(type=="wms"){
    if(svgSupport!="none"){
      editable=true;
    }
    else{
      for(i=0;i<wmss[ind].layers.length;i++){
        if(wmss[ind].layers[i].name.indexOf("webuser")!=-1){
          editable=true;
          break;
        }
      }
    }
    wmss[ind].editable=editable;
  }
}

function writeFeatures(){
  for(i=0;i<wfss.length;i++){
    var small=false;
    var wfsFrame=document.getElementById("wfsFrame"+i);
    //make new div to replace existing div with points
    var newDiv=document.getElementById("divMaster").cloneNode(false);
    wfsFrame.replaceChild(newDiv,wfsFrame.firstChild);
    for(j=0;j<wfss[i].featureTypes.length;j++){
      var visCount=0;
      for(k=0;k<wfss[i].featureTypes[j].features.length;k++){
        if((wfss[i].featureTypes[j].features[k].coord.x>=bbox[0])&&(wfss[i].featureTypes[j].features[k].coord.x<=bbox[2])&&(wfss[i].featureTypes[j].features[k].coord.y>=bbox[1])&&(wfss[i].featureTypes[j].features[k].coord.y<=bbox[3])){
          wfss[i].featureTypes[j].features[k].visible=true;
          visCount++;
        }
        else{
          wfss[i].featureTypes[j].features[k].visible=false;
        }
      }
      if(visCount>ptSizeThresh){
        small=true;
      }
      for(k=0;k<wfss[i].featureTypes[j].features.length;k++){
        if(wfss[i].featureTypes[j].features[k].visible==true){
          addPoint(i,j,k,small);
        }
      }
    }
  }
}

function clearFeatures(i){
  var wfsFrame=document.getElementById("wfsFrame"+i);
  //make new div to replace existing div with points
  var newDiv=document.getElementById("divMaster").cloneNode(false);
  wfsFrame.replaceChild(newDiv,wfsFrame.firstChild);
}

function dropFeatures(i){
  for(j=0;j<wfss[i].featureTypes.length;j++){
    wfss[i].featureTypes[j].features=new Array();
  }
}

function addPoint(wfs,featureType,feature,small) {
  var pointDivMaster=document.getElementById("pointImgMaster");
  var newnode=pointDivMaster.cloneNode(false);
  var featureid="wfs"+wfs+"t"+featureType+"f"+feature;
  var pt=new Point(parseFloat(wfss[wfs].featureTypes[featureType].features[feature].coord.x),parseFloat(wfss[wfs].featureTypes[featureType].features[feature].coord.y));
  coord=getScreenCoords(pt);
  if(small==false){
    newnode.setAttribute("width","17");
    newnode.setAttribute("height","15");
    with(newnode.style){
      left=coord.x-8+"px";
      top=coord.y-7+"px";
    }
    if(useIcons==true){
      if(wfss[wfs].featureTypes[featureType].features[feature].iconId!=null){
        iconImg="images/icons/"+wfss[wfs].featureTypes[featureType].features[feature].iconId+".gif";
      }
      else{
        iconImg="images/icons/large.gif";
      }
      newnode.setAttribute("src",iconImg);
    }
  }
  else{
    with(newnode.style){
      left=coord.x-2+"px";
      top=coord.y-2+"px";
    }
    if(useIcons==true){
      iconImg="images/icons/small.gif";
      newnode.setAttribute("src",iconImg);
    }
  }
  newnode.setAttribute("id", featureid);
  var node = document.getElementById("wfsFrame"+wfs).firstChild;
  node.appendChild(newnode);
}

function getScreenCoords(pt){
  bbox[0]=parseFloat(bbox[0]);
  bbox[1]=parseFloat(bbox[1]);
  bbox[2]=parseFloat(bbox[2]);
  bbox[3]=parseFloat(bbox[3]);
  var xfac = (mapWidth/(bbox[2]-bbox[0]));
  var yfac = (mapHeight/(bbox[3]-bbox[1]));
  pt.x=xfac*(pt.x-bbox[0]);
  pt.y=mapHeight-(yfac*(pt.y-bbox[1]));
  return pt;
}



// adapted from LandView application

function setUnits(str){
  units=str;
}

function setInchesPerMapUnit(){
  switch(units){
    case "metres":
      InchesPerMapUnit = 39.3701;
      break;
    default:
      break;
  }
}


function getScale(){
  if(units==null){
    return null;
  }
  var gd, md;

  md = (mapWidth)/(PixelsPerInch*InchesPerMapUnit);
  gd = bbox[2] - bbox[0];

  return(gd/md);
}

function setScale(){
  currentScale=getScale();
  if(currentScale!=null){
    document.getElementById("scaleInput").setAttribute("value",parseInt(currentScale));
  }
}

function zoomToLayer(elt){
  eltId=elt.parentNode.parentNode.getAttribute("id");
  serviceType=eltId.substring(0,3);
  if(serviceType=='wms'){
    var lindex=eltId.indexOf("l");
    var wms=eltId.substring(3,lindex);
    layer=eltId.substring(lindex+1,eltId.length);
    zoomLayer(wms.layer);
  }
}

function zoomLayer(wms,layer){
  var scale=null;
  var x = (bbox[0] + bbox[2])/2.0;
  var y = (bbox[1] + bbox[3])/2.0;
  for(var i=0; i<wmss[wms].layers.length; i++) {
    if(wmss[wms].layers[i].name==layer){
      wmss[wms].layers[i].status=true;
      if ((wmss[wms].layers[i].maxscale<currentScale)&&(wmss[wms].layers[i].maxscale!=null)){
        scale=wmss[wms].layers[i].maxscale*.99;
      }
      else if ((wmss[wms].layers[i].minscale>currentScale)&&(wmss[wms].layers[i].minscale!=null)){
        scale=wmss[wms].layers[i].minscale;
      }
    }
  }
  if(scale!=null){
    zoomScale(x, y, scale);
  }
  else{
    alert("Scale info missing.");
  }
}

function goToScale(scale){
  var x = (bbox[0] + bbox[2])/2.0;
  var y = (bbox[1] + bbox[3])/2.0;
  zoomScale(x,y,scale);
}

function zoomScale(x,y,scale){
  gw=scale*mapWidth/(PixelsPerInch*InchesPerMapUnit);
  gh=gw*mapHeight/mapWidth;
  bbox[0] = x - gw/2.0;
  bbox[1] = y - gh/2.0;
  bbox[2] = x + gw/2.0;
  bbox[3] = y + gh/2.0;
  getMap();
  positionKeyMapBox();
  writeLabels();
}

function decode(string){
  return unescape(string.replace(/\+/g, " "));
}

/*
** This function parses comma-separated name=value argument pairs from
** the query string of the URL. It stores the name=value pairs in 
** properties of an object and returns that object. 
*/
function getargs(){
  var args = new Object();
  var query = location.search.substring(1);   // Get query string.
  var pairs = query.split("&");               // Break at ampersand.
  for(var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');          // Look for "name=value".
    if (pos == -1) continue;                  // If not found, skip.
    var argname = pairs[i].substring(0,pos);  // Extract the name.
    var value = pairs[i].substring(pos+1);    // Extract the value.
    args[argname] = decode(value);            // Store as a property.
  }
  return args;                                // Return the object.
}

//function to define web map service object with associated properties
function WMS(onlineresource,title,abst,contactPerson,contactOrganization,contactPosition,contactEmail,srs,bbox,status){
  this.onlineresource=onlineresource;
  this.title=title;
  this.abst=abst;
  this.contactPerson=contactPerson;
  this.contactOrganization=contactOrganization;
  this.contactPosition=contactPosition;
  this.contactEmail=contactEmail;
  this.srs=srs;
  this.bbox = bbox;
  this.layers = new Array();
  this.status = status;
  this.querylayer="";
  this.activelayer="";
  if(linkedWFS==null){
    this.wfs=null;
  }
  else{
    this.wfs=wfss.length;
  }
  this.webuser=false;
}

//function to define web map service layer object with associated properties
function WMSLayer(name,title,queryable,opaque,minscale,maxscale,status) {
  this.name = name;
  this.title=title;
  this.queryable=queryable;
  this.opaque=opaque;
  this.minscale=minscale;
  this.maxscale=maxscale;
  this.hasWFS=false;
  this.status = status;
  this.editable = false;
}

//function to define web feature service object with associated properties
function WFS(onlineresource,title,abst,status){
  this.onlineresource=onlineresource;
  this.title=title;
  this.abst=abst;
  this.featureTypes = new Array();
  this.status = status;
  this.bbox=new Array();
}

//function to define web feature service feature type object with associated properties
function WFSFeatureType(name,status) {
  this.name = name;
  this.status = status;
  this.bbox = null;
  this.features = new Array();
}

//function to define web feature service feature object with associated properties
function WFSFeature(id,title,iconId,category,coord,atts){
  this.id=id;
  this.title=title;
  this.iconId=iconId;
  this.category=category;
  this.coord=coord;
  this.atts=atts;
  this.visible=false;
}

//function to define label object with associated properties
function Label(pt,str,style){
  this.pt=pt;
  this.str=str;
  if(this.style==null){
    this.style='label';
  }
  else{
    this.style=style;
  }
}

//function to refresh WMS and WFS information for new map extent
function getMap(){
  openShell(document.createTextNode("Loading map image"));
  mapImg = new Image();
  for(i=0;i<wmss.length;i++){
    if(wmss[i]!=null){
      layersStr="";
      for(l=0;l<wmss[i].layers.length;l++){
        if(wmss[i].layers[l].status){
          layersStr+=wmss[i].layers[l].name+",";
        }
      }
      url=wmss[i].onlineresource+'VERSION=1.1.0&REQUEST=GetMap&LAYERS='+layersStr+'&SRS='+wmss[i].srs+'&BBOX='+bbox.join(",")+'&WIDTH='+mapWidth+'&HEIGHT='+mapHeight;
      prompt("url",url);
      mapImg.src = url;
      document.getElementById("wmsFrame"+i).setAttribute("src",mapImg.src);
    }
  }
  for(i=0;i<wfss.length;i++){
    if(wfss[i]!=null){
      var loadWfs=true;
      //determine if current bbox is entirely within previously loaded one
      if(wfss[i].bbox.length!=0){
        if((bbox[0]>=wfss[i].bbox[0])&&(bbox[1]>=wfss[i].bbox[1])&&(bbox[2]<=wfss[i].bbox[2])&&(bbox[3]<=wfss[i].bbox[3])){
          loadWfs=false;
          writeFeatures();
          closeShell();
        }
      }
      if(loadWfs==true){
        featureTypesStr="";
        for(l=0;l<wfss[i].featureTypes.length;l++){
          if(wfss[i].featureTypes[l].status){
            featureTypesStr+=wfss[i].featureTypes[l].name+",";
          }
        }
        featureTypesStr=featureTypesStr.substr(0,featureTypesStr.length-1);
        url=wfss[i].onlineresource+'VERSION=1.0&REQUEST=GetFeature&TYPENAME='+featureTypesStr+'&SRS='+srs+'&BBOX='+bbox.join(",");
        currWFSCall=i;
        clearFeatures(currWFSCall);
        dropFeatures(currWFSCall);
        importXML(url,'GetFeature');
      }
    }
  }
  if(inputPoints.length>0){
    showInput();
  }
  setScale();
}

function getInputMap(){
  var i = activeWMS;
  if((wmss[i]!=null)&&(wmss[i].editable==true)){
    switch(svgSupport){
      case "none":
        mapImg = new Image();
        pts="";
        for(p=0;p<inputPoints.length;p++){
          pts+=inputPoints[p].x+"+"+inputPoints[p].y+"+";
        }
        url=wmss[i].onlineresource+'MODE=map&LAYERS=webuser&SRS='+wmss[i].srs+'&MAPEXT='+bbox.join("+")+'&MAPSIZE='+mapWidth+'+'+mapHeight+'&map_webuser_feature=new&map_webuser_feature_points='+pts;
        prompt("url",url);
        mapImg.src = url;
        document.getElementById("inputImage").setAttribute("src",mapImg.src);
        break;
      default:
        break;
    }
  }
}

function toggleLayers(elt){
  eltId=elt.parentNode.parentNode.getAttribute("id");
  serviceType=eltId.substring(0,3);
  if(serviceType=='wms'){
    var lindex=eltId.indexOf("l");
    var wms=eltId.substring(3,lindex);
    layer=eltId.substring(lindex+1,eltId.length);
    for(var i=0; i<wmss[wms].layers.length; i++) {
      if(wmss[wms].layers[i].name == layer) {
	if(elt.checked)
          wmss[wms].layers[i].status = true;
        else
          wmss[wms].layers[i].status = false;
	break;
      }
    }
  }
  if(serviceType=='wfs'){
    for(var i=0; i<wfss[index].layers.length; i++) {
      if(wfss[index].featureTypes[i].name == element.value) {
	if(elt.checked)
          wfss[index].layers[i].status = true;
        else
          wfss[index].layers[i].status = false;
	break;
      }
    }
  }
  getMap();
}

function toggleServer(elt){
  eltId=elt.parentNode.parentNode.getAttribute("id");
  serviceType=eltId.substring(0,3);
  var i= eltId.substring(3,eltId.length);

  if(serviceType=='wms'){
    if(wmss[i].status==false){
      wmss[i].status=true;
    }
    else{
      wmss[i].status=false;
    }
  }
  else{
    if(wfss[i].status==false){
      wfss[i].status=true;
    }
    else{
      wfss[i].status=false;
    }
  }
  writeLegend();
  hideOver();
}

function removeServer(elt){
  eltId=elt.parentNode.parentNode.getAttribute("id");
  serviceType=eltId.substring(0,3);
  var i= eltId.substring(3,eltId.length);

  if(serviceType='wms'){
    if(wmss[i].status==false){
      wmss[i].status=true;
    }
    else{
      wmss[i].status=false;
    }
  }

  if(serviceType=="wms"){
    if(document.splice){
      wmss.splice(i,1);
      node=document.getElementById("mapFrame");
      node.removeChild(document.getElementById("wmsFrame"+i));
    }
    else{
      wmss[i]=null;
      var img=document.getElementById("wmsFrame"+i);
      img.setAttribute("id",null);
      img.style.visibility='hidden';
    }
    for(j=i+1;j<wmss.length;j++){
      var img=document.getElementById("wmsFrame"+j);
      img.setAttribute("id","wmsFrame"+(j-1));
    }
  }
  writeLegend();
  hideOver();
}


function writeLegend(){
  var layersDiv=document.getElementById("layersDiv");
  var tbl=document.createElement("table");
  layersDiv.replaceChild(tbl,layersDiv.firstChild);
  tbl.setAttribute("cellspacing","0");
  tbl.setAttribute("cellspacing","1");
  tbl.setAttribute("width","100%");
  var tbody=document.createElement("tbody");
  tbl.appendChild(tbody);
  for(m=0;m<wmss.length;m++){
    if(wmss[m]!=null){
      var legTitleRow=document.getElementById("titleRowMaster");
      var newTitleRow=legTitleRow.cloneNode(true);
      tbody.appendChild(newTitleRow);
      newTitleRow.setAttribute("id","wms"+m);
      var txtNode=document.createTextNode(wmss[m].title);
      newTitleRow.firstChild.firstChild.nextSibling.appendChild(txtNode);
      if(wmss[m].status==false){
        newTitleRow.firstChild.firstChild.setAttribute("src","images/expand.gif");
      }
      else{
        for(var i=0; i<wmss[m].layers.length; i++) {
          var legRow=document.getElementById("wmsRowMaster");
          var newRow=legRow.cloneNode(true);
          newRow.setAttribute("id","wms"+m+"l"+wmss[m].layers[i].name);
          tbody.appendChild(newRow);
          if((((currentScale>=wmss[m].layers[i].minscale)||(wmss[m].layers[i].minscale==null))&&((currentScale<=wmss[m].layers[i].maxscale)||(wmss[m].layers[i].maxscale==null)))||(currentScale==null)){
            if(wmss[m].layers[i].status){
              newRow.firstChild.firstChild.setAttribute("checked","true");
            }
          }
          else{
            var eyeImageMaster=document.getElementById("imageMaster");
            var eyeImage=eyeImageMaster.cloneNode(false);
            newRow.firstChild.replaceChild(eyeImage,newRow.firstChild.firstChild);
          }
          if(wmss[m].layers[i].queryable!=true){
            newRow.firstChild.nextSibling.firstChild.style.visibility="hidden";
          }
          titleSpanNode=newRow.firstChild.nextSibling.nextSibling.firstChild;
          titleSpanNode.appendChild(document.createTextNode(wmss[m].layers[i].title));
        }
      }
    }
  }
  for(f=0;f<wfss.length;f++){
    if(wfss[f]!=null){
      var legTitleRow=document.getElementById("titleRowMaster");
      var newTitleRow=legTitleRow.cloneNode(true);
      tbody.appendChild(newTitleRow);
      newTitleRow.setAttribute("id","wfs"+f);
      var txtNode=document.createTextNode(wfss[f].title);
      newTitleRow.firstChild.firstChild.nextSibling.appendChild(txtNode);
      if(wfss[f].status==false){
        newTitleRow.firstChild.firstChild.setAttribute("src","images/expand.gif");
      }
      else{
        for(var i=0; i<wfss[f].featureTypes.length; i++) {
          var legRow=document.getElementById("wfsRowMaster");
          var newRow=legRow.cloneNode(true);
          newRow.setAttribute("id","wfs"+f+"ft"+wfss[f].featureTypes[i].name);
          tbody.appendChild(newRow);
          if(wfss[f].featureTypes[i].status){
            newRow.firstChild.firstChild.setAttribute("checked","true");
          }
          titleSpanNode=newRow.firstChild.nextSibling.nextSibling.firstChild;
          titleSpanNode.appendChild(document.createTextNode(wfss[f].featureTypes[i].name));
        }
      }
    }
  }
}

function setQueryLayer(elt){
  eltId=elt.parentNode.parentNode.getAttribute("id");
  serviceType=eltId.substring(0,3);
  if(serviceType=='wms'){
    var lindex=eltId.indexOf("l");
    var wms=eltId.substring(3,lindex);
    layer=eltId.substring(lindex+1,eltId.length);
    var prevrowId="wms"+wms+"l"+wmss[wms].querylayer;
    var prevrow = document.getElementById(prevrowId);
    if(prevrow) prevrow.style.backgroundColor="white";
    if(wmss[wms].querylayer==layer){
      wmss[wms].querylayer="";
    }
    else{
      var currentrowId=prevrow="wms"+wms+"l"+layer;
      var currentrow = document.getElementById(currentrowId);
      if(currentrow) currentrow.style.backgroundColor="pink";
      wmss[wms].querylayer=layer;
    }
  }
  setCurrentTool(defaultTool);
}

function setActiveLayer(elt){
  eltId=elt.parentNode.parentNode.getAttribute("id");
  serviceType=eltId.substring(0,3);
  if(serviceType=='wms'){
    var lindex=eltId.indexOf("l");
    var wms=eltId.substring(3,lindex);
    layer=eltId.substring(lindex+1,eltId.length);
    var prevrowId="wms"+wms+"l"+wmss[wms].activelayer;
    var prevrow = document.getElementById(prevrowId);
    if(prevrow) prevrow.style.backgroundColor="white";
    if(wmss[wms].querylayer==layer){
      wmss[wms].querylayer="";
    }
    else{
      var currentrowId=prevrow="wms"+wms+"l"+layer;
      var currentrow = document.getElementById(currentrowId);
      if(currentrow) currentrow.style.backgroundColor="silver";
      wmss[wms].activelayer=layer;
    }
  }
}

function init(){
  if(args.wmss){
    if(args.wmss.indexOf(",")!=-1){
      wmssPre=args.wmss.split(",");
      wmssPreLen=wmssPre.length;
    }
    else{
      wmssPre=new Array();
      wmssPre[0]=args.wmss;
      wmssPreLen=1;
    }
    getUrl=wmssPre[0];
    getCapabilities("wms",getUrl);
    wmssPreLoaded=1;
  }
  if(args.wfss){
    if(args.wfss.indexOf(",")!=-1){
      wfssPre=args.wmss.split(",");
      wfssPreLen=wfssPre.length;
    }
    else{
      wfssPre=new Array();
      wfssPre[0]=args.wfss;
      wfssPreLen=1;
    }
    wfssPreloaded=0;
  }
  if(args.functionMode){
    functionMode=args.functionMode;
  }
  switch(functionMode){
    case "map":
      initMap();
      break;
    case "search":
      initSearch();
      break;
    default:
      break;
  }
  setInchesPerMapUnit();
}

function initMap(){
  for(i=0;i<tools.length;i++){
    if(tools[i].enabled==false){
      tools[i].remove();
    }
  }
  if(args.title){
    maptitle=args.title;
    var newTitle=document.createTextNode(maptitle);
    var titleCell=document.getElementById("titleCell")
    titleCell.replaceChild(newTitle,titleCell.firstChild);
    document.title=maptitle;
  }
  downPt=new Point();
  upPt=new Point();
  var resize=document.getElementById("resize");
  resize.onmousedown=drag;
  resizeMap();
  resize.style.visibility="visible";
  var inputFrame=document.getElementById("inputFrame");
  inputFrame.onclick=inputPt;
//svgSupport="none";
  switch(svgSupport){
    case "native":
      svgdoc=document;
      break;
    case "control":
      inputFrame.innerHTML='<embed name="inputImage" id="inputImage" height="0" width="0" name="Top" type="image/svg+xml" src="embed.svg" wmode="transparent"/>';
      break;
    case "none":
      var imageMaster=document.getElementById("imageMaster");
      var inputImage=imageMaster.cloneNode(false);
      inputImage.setAttribute("id","inputImage");
      inputFrame.replaceChild(inputImage,inputFrame.firstChild);
      break;
    default:
      break;
  }
  //testCirc();
  if((!args.wmss)&&(!args.wfss)){
    openLoadForm();
  }
}

function initSearch(){
  var mapTable=document.getElementById("mapTable");
  mapTable.style.display="none";
  openSearchForm();
}

function openSearchForm(){
  if(wfss.length==0){
    return;
  }
  var input=document.getElementById("inputMaster");
  var formMaster=document.getElementById("searchFormMaster");
  var node=formMaster.cloneNode(true);
  node.firstChild.firstChild.onmousedown=initpan;
  openForm(node);
}

function setFilter(wfs,filterType,propertyName,searchStr){
  switch(filterType){
    case "PropertyIsLike":
      filterStr='<PropertyIsLike wildCard="*" singleChar="#" escapeChar="!"><PropertyName>'+propertyName+'</PropertyName><Literal>*'+searchStr+'*</Literal></PropertyIsLike>';
      break;
    case "PropertyIsEqualTo":
      filterStr='<PropertyIsEqualTo><PropertyName>'+propertyName+'</PropertyName><Literal>'+searchStr+'</Literal></PropertyIsEqualTo>';
      break;
    default:
      return;
  }
  wfss[wfs].filter='<filter>'+filterStr+'</filter>';
}

function doSearch(searchStr){

filterStr=escape('<Filter><PropertyIsLike wildCard="*" singleChar="#" escapeChar="!"><PropertyName>Name</PropertyName><Literal>*'+searchStr+'*</Literal></PropertyIsLike></Filter>');


}

function drag(){
  document.onmousemove=mapDrag;
  document.onmouseup=endMapDrag;
  return false;
}

function resizeMap(){
  var anchor=document.getElementById("anchor");
  anchor.setAttribute("height",mapHeight);
  anchor.setAttribute("width",mapWidth);
  var mapDiv=document.getElementById("mapDiv");
  with(mapDiv.style){
    width=mapWidth;
    height=mapHeight;
    left=findPosX(anchor)+1+"px";
    top=findPosY(anchor)+1+"px";
    clip="rect(0px,"+mapWidth+"px,"+mapHeight+"px,0px)";
  }
  var labelsFrame=document.getElementById("labelsFrame");
  with(labelsFrame.style){
    width=mapWidth;
    height=mapHeight;
    left=findPosX(anchor)+1+"px";
    top=findPosY(anchor)+1+"px";
    clip="rect(0px,"+mapWidth+"px,"+mapHeight+"px,0px)";
  }
  var mapFrame=document.getElementById("mapFrame");
  with(mapFrame.style){
    width=mapWidth;
    height=mapHeight;
    left="0px";
    top="0px";
  }
  var keyMap=document.getElementById("keyMap");
  keyMapHeight=mapHeight*keyMapWidth/mapWidth;
  keyMap.setAttribute("height",keyMapHeight);
  var inputFrame=document.getElementById("inputFrame");
  with(inputFrame.style){
    left=findPosX(anchor)+"px";
    top=findPosY(anchor)+"px";
  }

  var dragFrame=document.getElementById("dragFrame");
  with(dragFrame.style){
    visibility="visible";
    width=mapWidth+"px";
    height=mapHeight+"px";
    left=findPosX(anchor)+"px";
    top=findPosY(anchor)+"px";
    clip="rect(0px,"+mapWidth+"px,"+mapHeight+"px,0px)";
  }
  var formShell=document.getElementById("formShell");
  with(formShell.style){
    left=(((findPosX(anchor))+(mapWidth/3)))+"px";
    top=(((findPosY(anchor))+(mapHeight/3)))+"px";
  }
  var noticeShell=document.getElementById("noticeShell");
  with(noticeShell.style){
    left=(((findPosX(anchor))+(mapWidth/3)))+"px";
    top=(((findPosY(anchor))+(mapHeight/3)))+"px";
  }
  var layersDiv=document.getElementById("layersDiv");
  layersDiv.style.height=(mapHeight+20)-keyMapHeight+"px";
  for(i=0;i<wmss.length;i++){
    var mapImg=document.getElementById("wmsFrame"+i);
    mapImg.setAttribute("height",mapHeight);
    mapImg.setAttribute("width",mapWidth);
  }
  var resize=document.getElementById("resize");
  with(resize.style){
    left=(mapWidth-12)+findPosX(anchor)+"px";
    top=(mapHeight-12)+findPosY(anchor)+"px";
  }
  getKeyMap();
  positionKeyMapBox();
}

function mapDrag(evt){
  var anchor=document.getElementById("anchor");
  mapWidth=(getPageX(evt)-findPosX(anchor));
  mapHeight=(getPageY(evt)-findPosY(anchor));
  resizeMap();
  return false;
}

function endMapDrag(evt){
  document.onmousemove=null;
  document.onmouseup=null;
  if(!(bbox==null)){
    bbox=wms_scale(bbox);
  }
  if(wmss.length>0){
    getMap();
  }
  writeLabels();
  return false;
}

function overText(contentNode,titleNode){
  if(titleNode!=null){
    var title=document.getElementById("overTitle");
    title.replaceChild(titleNode,title.firstChild);
  }
  var over=document.getElementById("overText");
  over.replaceChild(contentNode,over.firstChild);
  document.onmousemove=moveOver;
}

function moveOver(e){
  var over=document.getElementById("over");
  with(over.style){
    left=(getPageX(e)+10)+"px";
    top=(getPageY(e)+10)+"px";
    visibility='visible';
  }
}

function hideOver(){
  var over=document.getElementById("over");
  with(over){
    style.visibility="hidden";
    style.left="0px";
    style.top="0px";
  }
  document.onmousemove=null;
}

function layerInfo(elt){
  var eltId=elt.parentNode.parentNode.getAttribute("id");
  var serviceType=eltId.substring(0,3);
  if(serviceType=='wms'){
    var lindex=eltId.indexOf("l");
    var wms=eltId.substring(3,lindex);
    layer=eltId.substring(lindex+1,eltId.length);
    for(var i=0; i<wmss[wms].layers.length; i++) {
      if(wmss[wms].layers[i].name == layer) {
        if((wmss[wms].layers[i].abst!=null)&&(wmss[wms].layers[i].abst!="undefined")){
          abstText=wmss[wms].layers[i].abst;
        }
        else{
          abstText="";
        }
        overText(document.createTextNode(abstText),document.createTextNode(wmss[wms].layers[i].title));
	break;
      }
    }
  }
}

function featureInfo(elt){
  elt.style.borderColor="red";
  var eltId=elt.getAttribute("id");
  var serviceType=eltId.substring(0,3);
  var tindex=eltId.indexOf("t");
  var findex=eltId.lastIndexOf("f");
  var wfs=eltId.substring(3,tindex);
  featureType=eltId.substring(tindex+1,findex);
  feature=eltId.substring(findex+1,eltId.length);
  feat=wfss[wfs].featureTypes[featureType].features[feature];
  var titleText=wfss[wfs].featureTypes[featureType].name+ ": ";
  if((feat.title!=null)&&(feat.title!="undefined")){
    titleText+=feat.title;
  }
  else if((feat.featureid!=null)&&(feat.featureid!="undefined")){
    titleText+=feat.featureid;
  }
  else{
    titleText+=findex;
  }
  if(!ismsie){
    var newTbl=document.getElementById("featureInfoTableMaster").cloneNode(false);
    for(i=0;i<feat.atts.length;i++){
      var newRow=document.getElementById("featureRowMaster").cloneNode(true);
      newTbl.appendChild(newRow);
      cell1=newRow.firstChild;
      cell1.replaceChild(document.createTextNode(feat.atts[i].parameter),cell1.firstChild);
      cell2=cell1.nextSibling;
      cell2.replaceChild(document.createTextNode(feat.atts[i].value),cell2.firstChild);
    }
  }
  else{
    var newTbl=document.createElement("div");
    str="<table>";
    for(i=0;i<feat.atts.length;i++){
      str+='<tr><td valign="top" bgcolor="pink">';
      str+=feat.atts[i].parameter+'</td><td valign="top">';
      str+=feat.atts[i].value+'</td></tr>';
    }
    str+="</table>";
    newTbl.innerHTML=str;
  }
  overText(newTbl,document.createTextNode(titleText));
}

function featureOut(elt){
  elt.style.borderColor="black";
  hideOver();
}

function removeTool(){
  for(i=0;i<tools.length;i++){
    if(tools[i]==this){
      break;
    }
  }
  var tool=document.getElementById("toolcell"+i);
  tool.style.display="none";
}

function setCurrentTool(tool){
  var dragFrame=document.getElementById("dragFrame");
  hideOver();
  if(wmss.length==0){
    alert("Please add a server before using the tools.")
    return;
  }
  prevTool=currentTool;
  currentTool=tool;
  var prevCell=document.getElementById("toolcell"+prevTool);
  prevCell.setAttribute("class","tool");
  prevCell.style.backgroundColor="white";
  prevCell.style.borderColor="black";
  var toolCell=document.getElementById("toolcell"+tool);
  toolCell.style.backgroundColor="yellow";
  toolCell.style.borderColor="red";
  switch(prevTool){
    case 0:
      dragFrame.onmousedown=null;
      break;
    case 1:
      dragFrame.onmousedown=null;
      break;
    case 2:
      dragFrame.onmousedown=null;
      break;
    case 3:
      dragFrame.onmousedown=null;
      break;
    case 4:
      dragFrame.onmousedown=null;
      break;
    case 5:
      endInput();
      break;
    case 6:
      endInput();
      break;
    default:
      endInput();
      break;
  }
  switch(currentTool){
  case 0:
    dragFrame.style.cursor='help';
    dragFrame.onmousedown=querydownhandler;
    break;
  case 1:
    dragFrame.style.cursor='crosshair';
    dragFrame.onmousedown=zoomdownhandler;
    break;
  case 2:
    bbox=wms_zoom(bbox);
    getMap();
    positionKeyMapBox();
    setCurrentTool(defaultTool);
    break;
  case 3:
    dragFrame.style.cursor='move';
    dragFrame.onmousedown=pandownhandler;
    break;
  case 4:
    dragFrame.style.cursor='crosshair';
    dragFrame.onmousedown=labeldownhandler;
    break;
  case 5:
    setHome();
    positionKeyMapBox();
    setCurrentTool(defaultTool);
    break;
  case 6:
    beginEdit();
    break;
  case 7:
    if(inputType!="point"){
      clearInput();
    }
    inputType="point";
    beginInput();
    break;
  case 8:
    if(inputType!="linestring"){
      clearInput();
    }
    inputType="linestring";
    beginInput();
    break;
  case 9:
    if(inputType!="polygon"){
      clearInput();
    }
    inputType="polygon";
    beginInput();
    break;
  default:
    break;
  }
}

function toolHelp(i){
  showTooltips(tools[i].description,tools[i].title);
}

function setSvgDoc(){
  switch(svgSupport){
    case "native":
      svgdoc=document;
      break;
    case "control":
      svgdoc=document.inputImage.getSVGDocument();
      break;
    default:
      break;
  }
}

function clearInput(){
  if(svgdoc==null){
    return;
  }
  inputPoints=new Array();
  line=svgdoc.getElementById("line");
  line.setAttribute("points","");
  poly=svgdoc.getElementById("poly");
  poly.setAttribute("points","");
}

function beginEdit(){
  if(svgdoc==null){
    setSvgDoc();
  }
  var dragFrame=document.getElementById("dragFrame");
  dragFrame.style.cursor='help';
  dragFrame.onmousedown=editdownhandler;
}

function beginInput(){
  if(svgSupport=="none"){
    showNoSvgNotice();
    return;
  }
  alert("This tool is only roughed in for demo purposes and doesn't yet post data.  To digitize a polygon, click its coordinates and double-click to finish.");
  if(svgdoc==null){
    setSvgDoc();
  }
  var inputFrame=document.getElementById("inputFrame");
  with(inputFrame.style){
    height=mapHeight+"px";
    width=mapWidth+"px";
    visibility="visible";
  }
  var inputImage=inputFrame.firstChild;
  inputImage.setAttribute("width",mapWidth+"px");
  inputImage.setAttribute("height",mapHeight+"px");
  inputFrame.style.cursor="crosshair";
  inputFrame.onmousedown=inputPt;
}

function addSelectPt(coord,ind) {
  var pointDivMaster=document.getElementById("pointImgMaster");
  var newnode=pointDivMaster.cloneNode(false);
  newnode.setAttribute("width","17");
  newnode.setAttribute("height","15");
  with(newnode.style){
    left=coord.x-8+"px";
    top=coord.y-7+"px";
  }
  if(useIcons==true){
    if(wfss[wfs].featureTypes[featureType].features[feature].iconId!=null){
      iconImg="images/icons/"+wfss[wfs].featureTypes[featureType].features[feature].iconId+".gif";
    }
    else{
      iconImg="images/icons/large.gif";
    }
    newnode.setAttribute("src",iconImg);
  }
  newnode.setAttribute("id", ind);
  var node = document.getElementById("imageFrame");
  node.appendChild(newnode);
}

function endInput(){
  var inputFrame=document.getElementById("inputFrame");
  with(inputFrame.style){
    height=0+"px";
    width=0+"px";
    visibility="hidden";
  }
  inputFrame.onmousedown=null;
  var inputImage=inputFrame.firstChild;
  inputImage.setAttribute("width",0+"px");
  inputImage.setAttribute("height",0+"px");
}

function overSelect(evt){
	obj=returnTarget(evt);
	obj.getStyle().setProperty("fill","pink");
}

function outSelect(evt){
	obj=returnTarget(evt);
	obj.getStyle().setProperty("fill","blue");
}
var activePt;

function beginPtDrag(evt){
//alert("begin");
//  targ=returnTarget(evt);
//  activePt=targ.getAttribute("id");
//activePt=0;
//  document.onmousemove=inputPt;
//  document.onmouseup=endPtDrag;
}

function endPtDrag(){
  activePt=null;
  document.onmousemove=null;
  document.onmouseup=null;
}
function inputPt(evt){
  targ=returnTarget(evt);
//  tid=targ.getAttribute("id");
//alert(tid);
  var anchor=document.getElementById("anchor");
  var pt=new Point(getPageX(evt)-findPosX(anchor),getPageY(evt)-findPosY(anchor));
  pt=getGeoCoords(pt);
  if((pt.x==prevPt.x)&&(pt.y==prevPt.y)){
    var dragFrame=document.getElementById("inputFrame");
    inputFrame.onclick=null;
    postFeature();
    return;
  }
  if(activePt!=null){
    inputPoints[activePt]= pt;
  }
  else{
    inputPoints[inputPoints.length]= pt;
  }
  showInput();
  prevPt=pt;
  addSelectPt(getScreenCoords(pt),inputPoints.length-1);
  return false;
}

function showInput(){
  str="";
  for(i=0;i<inputPoints.length;i++){
    var ipt=new Point(inputPoints[i].x,inputPoints[i].y);
    var pt=getScreenCoords(ipt);
    str+=pt.x+","+pt.y+" ";
  }
  gelt.replaceChild(newGelt,gelt.firstChild);
  switch(inputType){
    case "point":
      break;
    case "linestring":
      line=svgdoc.getElementById("line");
      line.setAttribute("points",str);
      break;
    case "polygon":
      poly=svgdoc.getElementById("poly");
      poly.setAttribute("points",str);
      break;
    default:
      break;
  }
}

function postFeature(){
  str="";
  switch(inputType){
    case "point":
      str+="<Point><coordinates>";
      break;
    case "linestring":
      str+="<Polyline><coordinates>";
      break;
    case "polygon":
      str+="<Polygon><outerRing><coordinates>";
      break;
    default:
      break;
  }
  for(i=0;i<inputPoints.length;i++){
    str += inputPoints[i].x+","+inputPoints[i].y+" ";
  }
  switch(inputType){
    case "point":
      str+="</coordinates></Point>";
      break;
    case "linestring":
      str+="</coordinates></Polyline>";
      break;
    case "polygon":
      str+="</coordinates></outerRing></Polygon>";
      break;
    default:
      break;
  }
  alert("Insert geometry: "+str);
}

function setHome(){
  bbox[0]=homeBbox[0];
  bbox[1]=homeBbox[1];
  bbox[2]=homeBbox[2];
  bbox[3]=homeBbox[3];
  bbox=wms_scale(bbox);
  getMap();
}

//all functions from here down just dumped here temporarily from other
//projects--not yet functional

//from http://www.croczilla.com/svg/events2.xml
	  var dx,dy;
	  var circle;

	  function mousedown_listener(evt)
	  {
            circle=document.getElementById("circtest");
alert("circle: "+circle);
	    dx = circle.cx.baseVal.value - evt.clientX;
	    dy = circle.cy.baseVal.value - evt.clientY;
	    document.addEventListener("mousemove", mousemove_listener, true);
	    document.addEventListener("mouseup", mouseup_listener, true);
	  }

	  function mouseup_listener(evt)
	  {
	    document.removeEventListener("mousemove", mousemove_listener, true);
	    document.removeEventListener("mouseup", mouseup_listener, true);
	  }

	  function mousemove_listener(evt)
	  {
	    var id = circle.ownerSVGElement.suspendRedraw(1000);
	    circle.cx.baseVal.value = evt.clientX + dx;
	    circle.cy.baseVal.value = evt.clientY + dy;
// alternatively we could set the corresponding attributes:
// (slower method)
//	    circle.setAttribute("cx", evt.clientX + dx);
//	    circle.setAttribute("cy", evt.clientY + dy);
	    circle.ownerSVGElement.unsuspendRedraw(id);
	  }

function getXSD(){
  theCall="";
  theCall+="<DescribeFeatureType outputFormat=XMLSCHEMA>";
  var thenode = svgdoc.getElementById("capabilities");
  path=thenode.getElementsByTagName("DescribeFeatureType").item(0).getElementsByTagName("Post").item(0).getAttribute("onlineResource");
//if not then simply use relative ref. (Must check wether simple_wfs in the same dir)
  if (!checkDomain(path)) {
    path=wfsPath;
  }
  theFeatureTypes=thenode.getElementsByTagName('FeatureType');
  for (i=0;i<theFeatureTypes.length;i++){
    name=theFeatureTypes.item(i).getElementsByTagName('Name').item(0).firstChild.nodeValue;
    text=svgdoc.createTextNode(name);
    typeName=svgdoc.createElement("TypeName");
    typeName.appendChild(text);
    theCall.appendChild(typeName);    
  }
  nodeText=printNode(theCall);
  if(showCalls==true){
    alert(nodeText);
  }
  result=postXML(path,nodeText,parseXSD,"text/plain",null);
}

function parseXSD(res){
  statusText("response","XML schema");
  text=res.content;
  if((text=="")||(text==null)){
    alert("Empty response from server.");
  }
  else{
    text=dropNS(text,"gml");
    text=dropNS(text,"xsd");
    text=trimHeader(text);
    var thenode = svgdoc.getElementById("xsd");
    newNode = parseXML( text, svgdoc );
    if(showCalls==true){
      prompt("XMLSchema response: ",printNode(newNode));
//      prompt("XMLSchema response: ",text);
    }
    subnode=newNode.firstChild;
    thenode.appendChild (subnode);
    listFields();
  }
}

function listFields(){
  text="";
  var thenode = svgdoc.getElementById("xsd");
  theComplexTypes=thenode.getElementsByTagName('complexType');
  for (i=0;i<theComplexTypes.length;i++){
    table=theComplexTypes.item(i).getAttribute('name');
    nameLength=table.length;
    typeIndex=table.indexOf("_Type");
    if(typeIndex!=-1){
      table = (table.substring(0,nameLength-typeIndex+1));
    }
    text += "table "+i+": "+table+" ";
    theElements=theComplexTypes.item(i).getElementsByTagName('element');
    for(j=0;j<theElements.length;j++){
      fieldName=theElements.item(j).getAttribute("name");
      fieldNameLength=fieldName.length;
      periodIndex=fieldName.indexOf(".");
      if(periodIndex!=-1){
        fieldName = (fieldName.substring(periodIndex,fieldNameLength));
      }
      text += "field "+j+": "+fieldName+" ";
    }
  }
  if(showCalls==true){
    //alert(text);
  }
}
<?
closeScript();
?>
<script language="VBScript">
  On Error Resume Next
  If svgSupport = "none" Then
    If IsObject(CreateObject("Adobe.SVGCtl")) Then
      svgSupport = "control"
    End If
  End If
</script>
</head>
<body onload="init()">

<div id="mapTable">
<table cellpadding="0" cellspacing="0" bgcolor="white" style="border: solid 1px black">
<tr><td colspan="2" id="titleCell">GeoClient</td></tr>
<tr><td valign="top" id="key_legend"><img id="keyMap" src="images/blank.gif" border="1" width="150" height="75" /><br /><div id="layersDiv"><table id="legendTable" width="100%" cellpadding="0" cellspacing="0"></table><div></div></div></td>
<td valign="top" id="main" align="left">
<table border="0" cellspacing="0" cellpadding="0" bgcolor="#000000">
<tr>
            <td class="tool" id="toolcell0"><img border="0" src="images/identify.gif"
              onclick="setCurrentTool(0)" onmouseover="toolHelp(0)" onmouseout="hideOver()" /></td>
            <td class="tool" id="toolcell1"><img border="0" src="images/zoomin.gif"
            onclick="setCurrentTool(1)" onmouseover="toolHelp(1)" onmouseout="hideOver()" /></td>
            <td class="tool" id="toolcell2"><img border="0" src="images/zoomout.gif" 
            onclick="setCurrentTool(2)" onmouseover="toolHelp(2)" onmouseout="hideOver()" id="tool2" /></td>
            <td class="tool" id="toolcell3"><img border="0" src="images/pan.gif"
            onclick="setCurrentTool(3)" onmouseover="toolHelp(3)" onmouseout="hideOver()" /></td>
            <td class="tool" id="toolcell4"><img border="0" src="images/text.gif"
            onclick="setCurrentTool(4)" onmouseover="toolHelp(4)" onmouseout="hideOver()" /></td>
            <td class="tool" id="toolcell5"><img border="0" src="images/home.gif"
            onclick="setCurrentTool(5)" onmouseover="toolHelp(5)" onmouseout="hideOver()" /></td>
            <td class="tool" id="toolcell6"><img border="0" src="images/input.gif"
            onclick="setCurrentTool(6)" onmouseover="toolHelp(6)" onmouseout="hideOver()" /></td>
            <td class="tool" id="toolcell7"><img border="0" src="images/point.gif"
            onclick="setCurrentTool(7)" onmouseover="toolHelp(7)" onmouseout="hideOver()" /></td>
            <td class="tool" id="toolcell8"><img border="0" src="images/line.gif"
            onclick="setCurrentTool(8)" onmouseover="toolHelp(8)" onmouseout="hideOver()" /></td>
            <td class="tool" id="toolcell9"><img border="0" src="images/polygon.gif"
            onclick="setCurrentTool(9)" onmouseover="toolHelp(9)" onmouseout="hideOver()" /></td>
</tr>
</table>
<img id="anchor" name="anchor" border="1" src="images/blank.gif" width="0" height="0" /></td></tr>
<tr><td colspan="2" id="infoFormCell"><input type="button" value="Add Service" onmouseover="showTooltips('Click to bring up the dialogue box for connecting to a web map or web feature service','Add Service')" onmouseout="hideOver()" onclick="openLoadForm()" /> Set Scale 1:<input id="scaleInput" name="scale" value="" type="text" onblur="goToScale(this.value)" style="width:55px" /> <input type="button" value="Go" /> <input type="checkbox" checked="true" onclick="setShowTooltips(this)" /> Show tooltips</td></tr>
</table>
</div>
<div id="mapDiv">
<div id="mapFrame">
</div>
</div>
<div id="box"></div>
<div id="over"><table cellpadding="1" cellspacing="1" width="100%"><tr><td id="overTitle">test</td></tr><tr><td id="overText">text</td></tr></table></div>
<div id="formShell"><div></div></div>
<div id="noticeShell"><div></div></div>
<div id="featureMembers"></div>
<div id="inputFrame" style="-moz-opacity:0.75;"><svg id="inputImage" xmlns="http://www.w3.org/2000/svg" width="0" height="0">
<g id="cont">
<circle id="circ" cx="" cy="" r="3" />
<polygon id="poly" points="" style="stroke:red; stroke-width:2; stroke-opacity:1; fill:yellow; fill-opacity:0.8;" />
<polyline id="line" points="" style="stroke:red; stroke-width:2; stroke-opacity:1; fill:none; fill-opacity:0.8;" />
</g>
<g id="pts" style="fill:blue;">
<g></g>
</g>
</svg></div>
<div id="resize" title="Click and drag to resize map image"></div>
<div id="masters">
<input id="inputMaster" />
<span id="spanMaster" style="display:block"></span>
<img id="pointImgMaster" src="images/blank.gif" border="1px" width="3px" height="3px" onmouseover="featureInfo(this)" onmouseout="featureOut(this)" style="position:absolute;left:0px;top:0px;background-color:pink;border: solid 1px green;z-index:10000" />
<div id="divMaster" style="position:absolute;left:0px;top:0px;width:0px;height:0px;"></div>
<img id="imageMaster" src="images/blank.gif" width="0" height="0" />
<img id="eyeImageMaster" src="images/eye.gif" width="17" height="11" onclick="zoomToLayer(this)"/>
<img id="wmsFrameMaster" src="images/blank.gif" width="0" height="0" onload="showLoaded(this.id);"/>
<table id="loadFormMasterTest" width="100%" cellpadding="0" cellspacing="0"><tr><td id="formHeader">Add Service</td></tr><tr><td style="padding:3px"><form name="serverSettings">Server Type:<br /><input type="radio" name="type" value="wms" checked="true" onclick="setService(this)" /> Web Map Server<br /><input type="radio" name="type" value="wfs" onclick="setService(this)" /> Web Feature Server<br />Address: <input type="text" name="url" onblur="setGetUrl(this)" length="100" value="" /><br /><span onmouseover="showTooltips('Enter the address here of a web feature service that includes one or more of the datasets in a web map service that you are adding.','Add linked WFS');" onmouseout="hideOver();">Linked WFS:</span> <input type="text" name="wfsurl" onblur="setLinkedWFS(this)" length="100" value="" /><br /><span onmouseover="showTooltips('Enter here a filter to be applied to a web feature service that you are adding','Apply WFS Filter');" onmouseout="hideOver();">WFS filter:</span> <input type="text" name="wfsFilter" onblur="setWFSFilter(this)" length="100" value="" /><br /><input type="button" value="Connect" onclick="getCapabilities(service,getUrl)" /><input type="button" value="Cancel" onclick="closeForm()" /></form></td></tr></table>
<table id="loadFormMaster" width="100%" cellpadding="0" cellspacing="0"><tr><td id="formHeader">Add Service</td></tr><tr><td style="padding:3px"><form name="serverSettings">Server Type:<br /><input type="radio" name="type" value="wms" checked="true" onclick="setService(this)" /> Web Map Server<br /><input type="radio" name="type" value="wfs" onclick="setService(this)" /> Web Feature Server<br />Address: <input type="text" name="url" onblur="setGetUrl(this)" length="100" value="" /><br /><input type="button" value="Connect" onclick="getCapabilities(service,getUrl)" /><input type="button" value="Cancel" onclick="closeForm()" /></form></td></tr></table>
<table id="noSvgNotice" width="100%" cellpadding="0" cellspacing="0"><tr><td id="formHeader">No SVG Support</td></tr><tr><td style="padding:3px">Use of this tool requires support for Scaleable Vector Graphics (SVG).  To add SVG support, use an SVG-enabled version of Mozilla (see <a href="http://www.mozilla.org/projects/svg/">Mozilla SVG project</a> page) or download and install the Adobe SVG Viewer from <a href="http://www.adobe.com/svg">Adobe</a>.<input type="button" value="OK" onclick="closeForm()" /></td></tr></table>
<table id="searchFormMaster" width="100%" cellpadding="0" cellspacing="0"><tr><td id="formHeader">Search</td></tr><tr><td style="padding:3px"><form name="searchSettings">Find: <input type="text" name="searchStr" onblur="setSearchStr(this)" length="70px" /><br /><input type="button" value="Search" onclick="doSearch(searchStr)" /><input type="button" value="Cancel" onclick="closeForm()" /></form></td></tr></table>
<table id="legendTableMaster" width="100%"><tbody><tr id="titleRowMaster" style="background-color: salmon"><td id="serverTitleCell" colspan="3" valign="top"><img border="0" hspace="2" onclick="toggleServer(this)" onmouseout="hideOver()" onmouseover="showTooltips('Click to show or hide available layers','Show or Hide')" src="images/collapse.gif" /><span></span><img hspace="2" onclick="removeServer(this)" onmouseout="hideOver()" onmouseover="showTooltips('Click to remove this web server','Remove Server')" src="images/x.gif" /></td></tr><tr id="wmsRowMaster" style="background-color: white;border: solid 1px white"><td valign="top" id="toggleLayerCell"><input onclick="toggleLayers(this);" onmouseover="showTooltips('Click to display or hide layer','Show or hide')" onmouseout="hideOver()" type="checkbox" /></td><td valign="top" id="layerQueryCell"><img src="images/layer_info.gif" onclick="setQueryLayer(this);" onmouseover="showTooltips('Click to set this as the query layer--then click on the map to get information on a feature.','Set Query Layer');" onmouseout="hideOver();" style="cursor:hand;cursor:pointer" /></td><td valign="top" id="layerInfoCell"><span onmouseover="layerInfo(this);" onmouseout="hideOver()" onclick="setActiveLayer(this)" style="color:blue"></span></td></tr><tr id="wfsRowMaster" style="background-color: white;border: solid 1px white"><td valign="top" id="toggleLayerCell"><input onclick="toggleLayers(this);" title="Click to display or hide layer" type="checkbox" /></td><td valign="top" id="layerQueryCell"></td><td valign="top" id="layerInfoCell"><span onmouseover="layerInfo(this);" onmouseout="hideOver()" onclick="setActiveLayer(this)" style="color:blue"></span></td></tr></tbody></table>
<table id="featureInfoTableMaster" width="100%"><tbody><tr id="featureRowMaster"><td id="featureParameterCell" valign="top" style="background-color: pink"><span></span></td><td id="featureValueCell"><span></span></td></tr></tbody></table>
</div>
<div id="labelsFrame"><span></span></div>
<div id="keyMapBox" onmouseover="showTooltips('Click and drag to pan the mapview to a different area','Pan')" onmouseout="hideOver()"></div>
<div id="dragFrame"></div>
</body>
</html>