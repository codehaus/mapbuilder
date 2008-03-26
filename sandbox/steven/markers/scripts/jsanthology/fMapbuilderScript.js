

var persistmenu="yes" //"yes" or "no". Make sure each SPAN content contains an incrementing ID starting at 1 (id="sub1", id="sub2", etc)
var persisttype="sitewide" //enter "sitewide" for menu to persist across site, "local" for this page only

if (document.getElementById){
document.write('<style type="text/css">\n')
document.write('.submenu{display: none;}\n')
document.write('</style>\n')
}

var ul=new Array(751323,160043);
var lr=new Array(809748,116669);

function test(){
config.objects.mainMap.extent.zoomToBox(ul,lr);
}
/*function SwitchMenu(obj){
        if(document.getElementById){
        var el = document.getElementById(obj);
	//alert(el.style.height);
	var smenu= document.getElementById("smenu4");
	//alert(smenu.id);
        var ar = document.getElementById("masterdiv").getElementsByTagName("span");
                if(el.style.display != "block"){
                        for (var i=0; i<ar.length; i++){
                                if (ar[i].className=="submenu")
                                ar[i].style.display = "none";
                        }
			el.style.display = "block";
			if (el.id=="sub2")
			{
				
				smenu.style.height=smenu.offsetHeight+40+'px';
				//var size=smenu.style.height +60 +"px";
				//smenu.setAttribute("style","height:285px");
			}
			if (el.id=="sub3")
			{
				smenu.style.height=smenu.offsetHeight +50 + 'px';
			}
			if (el.id=="sub4")
			{
				smenu.style.height=smenu.offsetHeight +120 + 'px';
			}
                        
			
                }else{
			if (el.id=="sub2")
			{
				smenu.style.height=smenu.offsetHeight -44 +'px';
			}
			if (el.id=="sub3")
			{
				smenu.style.height=smenu.offsetHeight -54 +'px';
			}
			if (el.id=="sub4")
			{
				smenu.style.height=smenu.offsetHeight -124 +'px';
			}
                        el.style.display = "none";
                }
        }
}*/


/*
function getElementSize(element)
{
	var starShip =document.getElementById(element);
	var pixelWidth = starShip.offsetWidth;
	var pixelHeight = starShip.offsetHeight;
	//alert(pixelHeight);
	return pixelHeight;
}

		function getLayerName()
		{
		var tab= new Array();
		var j=0;
		var racineNode=document.getElementById("layerControl");
		
		var collNoeuds = racineNode.childNodes;
		
		var layerNodes = collNoeuds[0].childNodes;
				
		for(i=0;i<=layerNodes.length-1;i=i+2)
			{				
				tab[j]=layerNodes[i].getAttribute("id");
				j++;				
			}
		return tab;
		}



function addDD(){

buf = getLayerName();
for(l=0;l<=buf.length-1;l++){
	var le=buf[l]+"g";
	//ADD_DHTML(buf[l]+VERTICAL);
	ADD_DHTML(buf[l]+NO_DRAG,le+NO_DRAG);
	//dd.elements[buf[l]].addChild(le);
	}
}*/


function displayLayerName()
{
for (i=0;i<=nbLayer;i++) {alert(monTab[i])};
}


	function eyeOfTiger(layerId,nb)
	{	
	var h=document.getElementById("previewImage"+nb);
	var layer=document.getElementById(layerId);
	//alert(layerId);
	
		if(layer&& (layer.firstChild.src.indexOf("GetMap")!=-1))
		{
			//alert(layer.firstChild.src);
			document.getElementById("previewImage"+nb).src=layer.firstChild.src;
		}	
	}

    function yep()
    {
		return document.getElementById("scaleSel").value; 
		//return config.objects.{$widgetId}.submitForm();
	}
	
	/* context editor */
	function mbOnload() {
        config.objects.mainMap.addListener("loadModel",initWorkspace,null);
        window.onresize = initWorkspace;
      }
      
      function initWorkspace() {
        var pageBody = document.getElementsByTagName("body")[0];
        var workDiv = document.getElementById("workspace");
        var footerDiv = document.getElementById("mbFooter");
        if (_SARISSA_IS_IE) {
          workDiv.style.height = pageBody.offsetHeight - workDiv.offsetTop - footerDiv.offsetHeight - 30;  //20 is a fudge factor
        } else {
          workDiv.style.height = window.innerHeight - workDiv.offsetTop - footerDiv.offsetHeight - 20;  //20 is a fudge factor
        }
      }
    /* enfin editor*/  
    
	/*function yep(){
		
	config.loadModel('featureCollection','http://www.geomatys.fr:8080/geoserver/wms?VERSION=1.1.1&REQUEST=GetMap&LAYERS=cadastre:parcelle&SRS=epsg:27563&BBOX=759811,117241,815932,165589&WIDTH=600&HEIGHT=517&FORMAT=image/png&SLD=http://www.geomatys.fr:8080/geoserver/data/styles/red_polygon.sld');
	}*/
	    var update="null";
function popUp(URL) 
	{
		day = new Date();
		id = day.getTime();
		var top=600;
		update=window.open(URL,id,'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=1260,height=250,left = 0,top=700');
	
	}
//	function url()
//	{    
//		var URL=new String("update.html?");		
//
//		for(i=1;i<nformFeatureList.length;i+=2)
//		{	
//		URL=URL+document.forms["nformFeatureList"].elements[i].name+"="+document.forms["nformFeatureList"].elements[i].value+"&";		
//		}
//		//alert(URL);
//		popUp(URL);	
//	}

	function show(id)
	{
		var temp=new Image();

		if(document.images["lButton"+id].src.indexOf("Disable")!=-1)
		{    
			document.getElementById("layerControl").style.height=document.getElementById("layerControl").offsetHeight+26 + "px";
			document.images["lButton"+id].src="mapbuilder/lib/skin/default/images/LegendEnable.png";
			document.getElementById("div"+id).style.width="28px";
			document.getElementById("div"+id).style.height="28px";
			document.getElementById("div"+id).style.top="0px";
			document.getElementById("div"+id).style.left="1px";
			document.getElementById("div"+id).style.visibility = "visible";
			document.images["legend"+id].src="http://www.geomatys.fr:8080/geoserver/wms/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=28&HEIGHT=28&LAYER="+id;
			for(var i=0;i<classesVisible.length;i++) 
			{
				if(document.getElementById("div"+id).id==classesVisible[i].id)
				{
					//alert(classesVisible[i].id);
					classesVisible[i].style.visibility="visible";
				}
			}
			
		}
		else
		{
			document.images["lButton"+id].src="mapbuilder/lib/skin/default/images/LegendDisable.png";
			document.getElementById("div"+id).style.visibility = "hidden";
			document.getElementById("div"+id).style.width="0px";
			document.getElementById("div"+id).style.height="0px";
			document.getElementById("layerControl").style.height=document.getElementById("layerControl").offsetHeight - 30 +"px";
			for(var i=0;i<classesVisible.length;i++) 
			{
				if(document.getElementById("div"+id).id==classesVisible[i].id)
				{
					//alert(classesVisible[i].id);
					classesVisible[i].style.visibility="hidden";
				}
			}
			
			
		}
		
		
	}
	
	var cptOthers;

	function writeTitle(Title)
	{		
		var nameTitle="t"+Title;
		if (Title=="gml:coordinates")
		{	
			document.getElementById(nameTitle).value="Coordonnees  : ";
			
		}
		else if (Title!="gml:coordinates" )
		{
			document.getElementById(nameTitle).value=nameTitle.substring(nameTitle.indexOf(":")+1,nameTitle.length)+" : " ;
		
		}
		
	}
	
	function modelSwitcher( targetModel, modelUrl ) 
	{
        	config.objects.switcher.switchMap( targetModel, modelUrl );
    }
    
    
  //////////////////////////////////////resize mappane when wuindow is resized  
var ok=false;
var buf=new Array();
var buf1=new Array();
var classesVisible= new Array();

function dynamicMapPane(){
			try
			{	
				  var model=config.objects.mainMap;
				  var widget=config.objects.mainMapWidget;
				  
				  bbox=new Array();
	  			  bbox=model.getBoundingBox();
	
	 			  postBbox=new Array();
	  			  preWindowWidth=model.getWindowWidth();
	  			  preWindowHeight=model.getWindowHeight();
	  			  if (nameBrowser.indexOf("Microsoft")!=-1)
	 			  {  
	 			  	
	  			  		model.setWindowWidth(Math.round(document.body.clientWidth));
	 			  		model.setWindowHeight(Math.round(document.body.clientHeight)-26); 
	 			  }
	 			  else
	 			  {
	  			  		model.setWindowWidth(Math.round(window.innerWidth)-19);
	 			  		model.setWindowHeight(Math.round(window.innerHeight)-45); 
	 			  }
	 			  widget.setContainerWidth(widget);
	       
				  postWindowWidth=Math.round(model.getWindowWidth());
	  			  postWindowHeight=Math.round(model.getWindowHeight());
	     		  var postMaxXMinusMinX=(postWindowWidth*(bbox[2]-bbox[0]))/preWindowWidth;
	    
	   			  var add=(postMaxXMinusMinX-(bbox[2]-bbox[0]));
	        
	  			  postBbox[0]=bbox[0]-(add/2);
	  			  postBbox[2]=bbox[2]+(add/2);
	    
	  		          var postMaxYMinusMinY=(postWindowHeight*(bbox[3]-bbox[1]))/preWindowHeight;
	   			  var add=(postMaxYMinusMinY-(bbox[3]-bbox[1]));
	
	   			  postBbox[1]=bbox[1]-(add/2);
	  			  postBbox[3]=bbox[3]+(add/2);
	  			 
	   			  model.setBoundingBox(postBbox);
	    		  model.setParam("refreshmap");
			}
			catch(err)
			{
				//alert("erreur dans dynamicMapPane");
				
//				for(var i in err)
//				{
//					alert(i+ ' : '+err[i]);
//				}
			}  
    }
    
  function resizeLayerControl()
  //TBD: dit moet worden aangepast
 {		document.getElementById("layerControl").style.height=document.getElementById("sortableLayerControl").offsetHeight+4+16+'px';
	 	document.getElementById("sidebar").style.height=document.getElementById("sortableLayerControl").offsetHeight+document.getElementById("sb-content").offsetHeight+4+16;
		if (document.getElementById("layerControl").style.height=='20px')
		{document.getElementById("layerControl").style.height='116px';}
		
 //document.getElementById("effectToogleLegende").style.height="200px";
 //alert(document.getElementById("effectToogleLegende")+" "+document.getElementById("layerControl"));
 //alert(document.getElementById("effectToogleLegende").style.height+" "+document.getElementById("layerControl").style.height);
 //Effect.toggle('effectToogleLegende','BLIND');
 //document.getElementById("effectToogleLegende").height=document.getElementById("layerControl").height;
 //document.getElementById("layerControlOmbre").style.height=document.getElementById("layerControl").offsetHeight;
 //alert(document.getElementById("effectToogleLegende").style.height+" "+document.getElementById("layerControl").offsetHeight);
 
 }
 /*var id=layer+"id";
 alert(layer+"id"+document.getElementById(id));
 	document.getElementById(id).style.height=60+"px";*/
//////////////////////change la src d'une image avec l' id
 function swapImage(id,src)
{
  var img = document.getElementById(id);

  var newimg = new Image;

  newimg.onload = function()
  {
    img.src = newimg.src;
    img.width = img.width;
    img.height = img.height;
  }

  newimg.src = src;
}
function updateWmsHeight()
{
//alert(document.getElementById("tabBarWmsCap").offsetHeight+" "+document.getElementById("workspace").offsetHeight);

document.getElementById("effectToogleWms").style.height=482+'px';
	
}
function updateLayerControlHeight()
{
//alert(document.getElementById("tabBarWmsCap").offsetHeight+" "+document.getElementById("workspace").offsetHeight);

var liste = $("sortableLayerControl").getElementsByTagName("li");
var height=0;
for (var i = 0; i < liste.length; i++)
  {
    height+=33;
  }
	height+=20;
	$('layerControl').style.height=height+'px';
	//alert(height);
}

////////////////////////////////////affiche le wms toogle
function beforeUpWms(id){
 		turnOffListener();
 		turnOffClickEvent(id);
 		if($('sortableLayerList'))
 			$('sortableLayerList').parentNode.style.overflow="";

 		
 }
 function afterUpWms(id){
 		turnOnClickEvent(id);
 		turnOnListener();
 }
function afterDownWms(id){
 		turnOnClickEvent(id);
 		turnOnListener();
 }
function beforeDownWms(id){
		if($('sortableLayerList'))
 			$('sortableLayerList').parentNode.style.overflow="scroll";
 		turnOffClickEvent(id);
 		turnOffListener();
 		
 }

function setVisibleWms()
 {	//config.loadModel('wmsServers','http://geodiscover.cgdi.ca/ceonetWeb/biz?request=searchForService&language=en&levelOfDetail=brief&serviceType=CgdiMapServices&numResultsPerPage=10&page=1');

	divParent="effectToogleWms";
 	 if(document.getElementById("arrowDownButtonWms").src.indexOf("down")!=-1)
	 {
	 	swapImage("arrowDownButtonWms","images/arrow_up.png");
	 	//new Effect.SlideDown(divParent); 
	 	Effect.toggle('effectToogleWms','blind',{duration:0.5,beforeStart:beforeDownWms('arrowWms'),afterFinish:afterDownWms('arrowWms')});
	 }
	 else
	 {	
	 	
	 	//new Effect.SlideUp(divParent); 
	 	Effect.toggle('effectToogleWms','blind',{duration:0.5,beforeStart:beforeUpWms('arrowWms'),afterFinish:afterUpWms('arrowWms')});
		swapImage("arrowDownButtonWms","images/arrow_down.png");
	 }	
	 //alert(document.getElementById("tabBarWmsCap").offsetHeight+" "+document.getElementById("workspace").offsetHeight);
	//updateWmsHeight();
	 return false;
	 
 }
 function turnOffClickEvent(id)
 {
 	$(id).onclick="";
 }
 
 
 function turnOnClickEvent(id)
 {
 	if (id=='arrowLegende')$(id).onclick=setVisibleLayerControl;
 	if (id=='arrowOutils')$(id).onclick=setVisibleOutils;
 	if (id=='arrowWms')$(id).onclick=setVisibleWms;
 }
 function beforeSlideUpLayerControl(){
 		turnOffListener();
 	//	turnOffClickEvent('arrowLegende');
// 		resizeLayerControl();
 		
 }
 function afterSlideUpLayerControl(){
 //		turnOnClickEvent('arrowLegende');
 		turnOnListener();
 }
function afterSlideDownLayerControl(){
 //		turnOnClickEvent('arrowLegende');
 	//	resizeLayerControl();
 		turnOnListener();
 }
function beforeSlideDownLayerControl(){
 		
 	//	turnOffClickEvent('arrowLegende');
 		turnOffListener();
 }

//affiche le layer control ou le cache
var list=4;

 function setVisibleLayerControl()
 {	
	divParent="layerControl";
 	 if(document.getElementById("arrowDownButtonLegende").src.indexOf("down")!=-1)
	 {	

	 	//heightBeforeOpen=document.getElementById(divParent).offsetHeight;
	 	new Effect.SlideDown(divParent,{duration:0.5,beforeStart:beforeSlideDownLayerControl,afterFinish:afterSlideDownLayerControl}); 
	 	//new Effect.SlideDown(divParent+"Ombre");
	 	//Sortable.create('sortableLayerControl');
	 	//initSortableList();
	 	swapImage("arrowDownButtonLegende","images/arrow_up.png");
	 	//heightBeforeOpen=document.getElementById(divParent).offsetHeight;
	 	//alert(document.getElementById("sortableLayerControl").offsetHeight+" "+document.getElementById("legende").offsetHeight);
		//document.getElementById("layerControl").style.height=document.getElementById("sortableLayerControl").offsetHeight+4+16+'px';
	 }
	 else
	 {	
	 	
	 	new Effect.SlideUp(divParent,{duration:0.5,beforeStart:beforeSlideUpLayerControl,afterFinish:afterSlideUpLayerControl}); 
	 	
		swapImage("arrowDownButtonLegende","images/arrow_down.png");
		//heightBeforeOpen=document.getElementById(divParent).offsetHeight;
	 	document.getElementById("dragLegende").style.height=document.getElementById("legende").offsetHeight+4;
		
	 }	
	//alert(heightBeforeOpen);
	//dragsort.makeListSortable(document.getElementById("sortableLayerControl"), setHandle)
		//document.getElementById("layerControlOmbre").style.height=document.getElementById("sortableLayerControl").offsetHeight;
		//updateLayerControlHeight();
	 return false;
//	 resizeLayerControl(); 
	 
 }
 function setVisibleLegendLayerControl(id)
 {	 //document.getElementById(idToogle).style.display="block";
 	//alert(document.getElementById(idContainer).offsetHeight+" "+document.getElementById(idToogle).offsetHeight)
	 //document.getElementById(idContainer).style.height=(document.getElementById(idContainer).offsetHeight+document.getElementById(idToogle).offsetHeight)+"px";
		li2=id+"li2";
		lbutton="lButton"+id;
		
		if(document.getElementById(li2).style.display=="none")
		{
			document.getElementById(li2).style.display="block";/////////pas definir le height du li
			swapImage(lbutton,"images/LegendEnable.png");
	 		//document.getElementById("dragLegende").style.height=document.getElementById("sortableLayerControl").offsetHeight+document.getElementById("legende").offsetHeight+6;
		
		}
		else
		{
			document.getElementById(li2).style.display="none";
			swapImage(lbutton,"images/LegendDisable.png");
			//document.getElementById("dragLegende").style.height=document.getElementById("legende").offsetHeight+6;
		
		}
		resizeLayerControl();
		//document.getElementById("layerControlOmbre").style.height=document.getElementById("sortableLayerControl").offsetHeight;
		
	 //document.getElementById(idToogle).style.visibility="visible";
 }
 
 
 function beforeEffectToogle(id){
 		turnOffListener();
 		turnOffClickEvent(id);
 
 		
 }
 function afterEffectToogle(id){
 		turnOnClickEvent(id);
 		turnOnListener();
 }
/*function afterSlideDown(id){
 		turnOnClickEvent(id);
 		turnOnListener();
 }
function beforeSlideDown(id){
 		
 		turnOffClickEvent(id);
 		turnOffListener();
 }*/
function setVisibleOutils()
 {	 
// alert(document.getElementById("layerControlOmbre").style.height+" "+document.getElementById("layerControlOmbre").offsetHeight);
// 		
// 		document.getElementById("layerControlOmbre").style.height=document.getElementById("layerControlOmbre").offsetHeight;
// 		document.getElementById("effectToogleLegende").style.height=document.getElementById("layerControlOmbre").offsetHeight;
// 		alert(document.getElementById("layerControlOmbre").style.height+" "+document.getElementById("layerControlOmbre").offsetHeight);
// 

	if(navigator.userAgent.toLowerCase().indexOf('gecko')!=-1)
	{
	 if(document.getElementById("arrowDownButtonOutils").src.indexOf("down")!=-1)
	 {
	 	swapImage("arrowDownButtonOutils","images/arrow_up.png");
	 	Effect.toggle('effectToogleOutils','blind',{duration:0.5,beforeStart:beforeEffectToogle('arrowOutils'),afterFinish:afterEffectToogle('arrowOutils')});
	 	
	 }
	 else
	 {	
		swapImage("arrowDownButtonOutils","images/arrow_down.png");
		Effect.toggle('effectToogleOutils','blind',{duration:0.5,beforeStart:beforeEffectToogle('arrowOutils'),afterFinish:afterEffectToogle('arrowOutils')}); 
	 	
	 }	
	}
	 else
	 {if(document.getElementById("arrowDownButtonOutils").src.indexOf("down")!=-1)
	 {
	 	swapImage("arrowDownButtonOutils","images/arrow_up.png");
	 	Effect.toggle('effectToogleOutils','slide',{duration:0.5,beforeStart:beforeEffectToogle('arrowOutils'),afterFinish:afterEffectToogle('arrowOutils')});
	 	
	 }
	 else
	 {	
		swapImage("arrowDownButtonOutils","images/arrow_down.png");
		Effect.toggle('effectToogleOutils','slide',{duration:0.5,beforeStart:beforeEffectToogle('arrowOutils'),afterFinish:afterEffectToogle('arrowOutils')}); 
	 	
	 }	
	 }
	
	 return false;
//	 resizeLayerControl(); 
	 
 }




/////////////////////////////////////////////////pour le menu outils

var enPlus=5;
 function setVisibleDiv(idToogle)
 {	 //document.getElementById(idToogle).style.display="block";
 	if(document.getElementById(idToogle).style.display=="none")
		{
			document.getElementById(idToogle).style.display="block";/////////pas definir le height du li
	 		
	 		if (idToogle=="locationsSelect")
	 		 {
	 		 	enPlus+=12;
	 		 	var srs=config.objects.mainMap.getSRS();
	 		 	//alert(srs);
	 		 	var file='Global'+srs.substring(srs.indexOf(':')+1,srs.length)+'.xml';
	 		 	config.loadModel('locations',file);
	 		 	config.objects.locations.refresh(config.objects.locations);
	 		 	/*if (srs=="EPSG:4326") 
	 		 	else if(srs=="EPSG:27582") config.objects.locations.loadModel();
	 		 	else if(srs=="EPSG:27563") config.objects.locations.loadModel();*/
	 		 	
	 		 }
			if (idToogle=="mapScaleText")enPlus+=10;
			if (idToogle=="collectionList")enPlus+=5;
	
		}
		else
		{
			document.getElementById(idToogle).style.display="none";
			if (idToogle=="locationsSelect")enPlus-=12;
			if (idToogle=="mapScaleText")enPlus-=10;
			if (idToogle=="collectionList")enPlus-=5;
		}
	document.getElementById("collectionList").style.height=document.getElementById("collectionList").getElementsByTagName("ul")[0].offsetHeight;
		//alert(enPlus);
//alert(enPlus+" "+document.getElementById("locatorMap").offsetHeight+document.getElementById("local").offsetHeight);
document.getElementById("effectToogleOutils").style.height=document.getElementById("locatorMap").offsetHeight+document.getElementById("local").offsetHeight+document.getElementById("locationsSelect").offsetHeight+document.getElementById("zoom").offsetHeight+document.getElementById("mapScaleText").offsetHeight+document.getElementById("listfeature").offsetHeight+document.getElementById("collectionList").offsetHeight+enPlus;
return false;
		
 }
 function addHeight(id,idAdd)
 {
 		alert(document.getElementById(id).offsetHeight+" "+document.getElementById(idAdd).offsetHeight+"px");
 		if(document.getElementById(idAdd).style.display)
 			document.getElementById(id).style.height=(document.getElementById(id).offsetHeight+document.getElementById(idAdd).offsetHeight)+"px";
 		else
 			document.getElementById(id).style.height=(document.getElementById(id).offsetHeight-document.getElementById(idAdd).offsetHeight)+"px";
 		
 }
 
 
 
 
 
 
 
 
 function setVisiblez(id)
 {	 //document.getElementById(idToogle).style.display="block";
 	//alert(document.getElementById(idContainer).offsetHeight+" "+document.getElementById(idToogle).offsetHeight)
	 //document.getElementById(idContainer).style.height=(document.getElementById(idContainer).offsetHeight+document.getElementById(idToogle).offsetHeight)+"px";
		li2=id+"li2";
		if(document.getElementById(li2).style.visibility=="hidden")
		{document.getElementById(li2).style.visibility="visible";
		document.getElementById(id).style.height=document.getElementById(id).offsetHeight+28+"px";
		}
		else
		{document.getElementById(li2).style.visibility="hidden"
			document.getElementById(id).style.height=document.getElementById(id).offsetHeight-28+"px";
		}
		
	 //document.getElementById(idToogle).style.visibility="visible";
 }
 
 function createDroppable(element){

					
					Droppables.add
					(
						element.id,
						{	
							
							onDrop: function(element)
							{	
							
							   config.objects.editContext.addNodeToModel(element.id);
							  // config.objects.myWmsServers.submitForm();
							}
						}
					);
}
 //detache les listener du mapcontainerBase et du cursorTrack pour scriptaculous ne ralentisse pas

 function turnOnListener(){
 	 var containerNode=document.getElementById("mainMapContainer");
 	objRef=config.objects.cursorTrack;
    if(containerNode && objRef)
    {	
    	//createDroppable($("mainMapPane"));
    	//createDroppable($("layerControl"));
    	containerNode.onmousemove = config.objects.mainMapWidget.eventHandler;;
	    containerNode.onmouseout =config.objects.mainMapWidget.eventHandler;
	    containerNode.onmouseover = config.objects.mainMapWidget.eventHandler;
	    containerNode.onmousedown = config.objects.mainMapWidget.eventHandler;
	    objRef.mouseHandler.addListener('mouseover', objRef.mouseOverHandler, objRef);
	    objRef.mouseHandler.addListener('mouseout', objRef.mouseOutHandler, objRef);
    }
 }
 
function turnOffListener(){
 	var containerNode=document.getElementById("mainMapContainer");
 	objRef=config.objects.cursorTrack;
 	if(containerNode && objRef && containerNode.onmousemove != "")
 	{	
  		containerNode.onmousemove = "";
   	 	containerNode.onmouseout = "";
    	containerNode.onmouseover = "";
    	containerNode.onmousedown = "";
    	objRef.mouseHandler.removeListener('mouseover', objRef.mouseOverHandler, objRef);
      	objRef.mouseHandler.removeListener('mouseout', objRef.mouseOutHandler, objRef);
     }
 }
 ////////////////////////si on veut la taille dynamic alors on reinitialise <dynamicSize> et les valeurs width et height du context 
 function initDynamicProperties(){
 
 	if(config.objects.mainMap.dynamicSize && config.objects.mainMap.dynamicSize=="true")
 	{
 		config.objects.mainMap.setDynamicSize("true");
 		config.objects.mainMap.width=0;
 		config.objects.mainMap.height=0;
 		
 	}
 	
 }
 ////////////////////////////////for close menu with cross
 function closeAction(id)
 {
 		var drag="drag"+id;
 		var button="menuDisplay"+id;
 		document.getElementById("drag"+id).style.display="none";
 		if (id=="Legende")
 		config.objects.menuDisplayLegende.image.src=config.objects.menuDisplayLegende.disabledImage.src;
 		else if (id=="Outils")
 		config.objects.menuDisplayOutils.image.src=config.objects.menuDisplayOutils.disabledImage.src;
 		else if (id=="Wms")
 		config.objects.menuDisplayWms.image.src=config.objects.menuDisplayWms.disabledImage.src;
 		
 }
 
 function layerUp(id){
		 var objRef=config.objects.mainMapWidget;
		  var id="locator_mainMapWidget_"+id;
		  document.getElementById( config.objects.mainMapWidget.outputNodeId ).insertBefore(document.getElementById(id).nextSibling,document.getElementById(id));
 }
 
 function layerDown(id){ 

		var id="locator_mainMapWidget_"+id
 		document.getElementById( config.objects.mainMapWidget.outputNodeId ).insertBefore(document.getElementById(id),document.getElementById(id).previousSibling);
 }
  
  ///////////////efface le node de la liste qd une couche a ete dropper
  
  ////////////////a ajouter dans mapbuilder
   function deleteNodeLayerList(id){
   
   		var objRef=config.objects.wmsCapTemplate;
    	var deletedNode = objRef.doc.selectSingleNode("//Layer[Name='"+id+"']");
    	
 
    if (!deletedNode) {
      alert("Impossible de supprimer le noeud : "+id);
      return;
    }
    deletedNode.parentNode.removeChild(deletedNode);
    config.objects.layerList.paint(config.objects.layerList);
    
   }
  ///////////////////fonction appelée qd une couche a ete droppé 
function onDropWmsLayer(targetModel,elementId)
   {

   
//	var exist=Sarissa.serialize(config.objects.mainMap.doc).indexOf(elementId);;
	//if (exist==-1)
	//{ 	//this.targetModel.setParam('addLayer',newNode.documentElement);
		config.objects.editContext.addNodeToModel(elementId);
		//alert('yahoo 761');
		deleteNodeLayerList(elementId);
		//alert('yahoo 763');
//	}
//	else
	//	{
			//deleteNodeLayerList(elementId);
			//alert('La couche est deja affichée');
		//}
   cleanup;
   	initScriptDragNDrop('workspaceCanvas');
   	
   	deleteSortableList('layerControl','mainMap');
   	initSortableList('layerControl','mainMap');
	
   }
   
   function replaceAllAccent(string)
   {			
   				var temp=string;
   				//result.replaceAll("(-|'|,|§|(|))", " ")
		   		/*temp = temp.replace(/Ý/g, 'Y');
                temp = temp.replace(/Ý/g, 'Y');
			    temp = temp.replace(/Ù | Ú | Û | Ü/g, "U");
			    temp = temp.replace(/ù  | Ú | û | ü/g, "u");
			    temp = temp.replace(/Ò | Ó | Ô | Õ | Ö/g, "O");
			    temp = temp.replace(/Ò | Ó | ô | Õ | ö/g, "o");
			    temp = temp.replace(/Ì | Í | Î | Ï/g, "I");
			    temp = temp.replace(/Ì | Í | î | ï/g, "i");
			    temp = temp.replace(/È | É | Ê | Ë/g, "E");
			    temp = temp.replace(/è | é | ê | ë/g, "e");
			    temp = temp.replace(/Ç/g, 'C');
			    temp = temp.replace(/ç/g, 'c');
			    temp = temp.replace(/À | Á | Â | Ã | Ä | Å | Æ/g, "A");*/
			    temp = temp.replace(/à/g, "a");
			    temp = temp.replace(/é/g, "e");
			    temp = temp.replace(/è/g, "e");
			    temp = temp.replace(/>[a-z]'[a-z]</g, " ");
			    //temp = temp.replace(/à | Á | â | Ã | ä | Å | Æ/g, "a");
			    
			    //alert(temp);
			    return temp;
			    
   }
   
   
Position.includeScrollOffsets = true;
var listId;
Draggables.clear = function (event) 
{
	while (Draggables.drags.length) 
	{
		var d = Draggables.drags.pop();
		var e = d.element;
		d.stopScrolling();
		d.destroy();
		d.element = null;
		if (e.parentNode) {e.parentNode.removeChild(e)};
	}
}


function cleanup() 
{
	 //try to remove circular references
	lis = document.getElementsByTagName("li");
	for (i = 0; i < lis.length; i++) 
	{
		if (lis[i].longListItem) {lis[i].longListItem.destroy();}
		else if (lis[i].container) {lis[i].container.destroy();}
	}
	Draggables.clear();
}



function initScriptDragNDrop(id) 
{
	
	var li = document.getElementById(id).getElementsByTagName('li');
	
	if (nameBrowser.indexOf('Microsoft')!=-1){
	
		for (var i = 0; i < li.length; i++) 
		{
			var d = new Draggable
			(
				li[i],
				{
				ghosting: true,
				floating:true,
				revert: false,
				onStart:turnOffListener,
				onEnd:turnOnListener
				}
			);
		}
		Droppables.add
					(
						"layerControl",
						{	
							
							
							onDrop: function(element)
							{	
								if(element.parentNode.id && element.parentNode.id=="sortableLayerList")
							   		onDropWmsLayer(config.objects.layerControl,element.id);
							
							}
						}
					);
					Droppables.add
					(
						"mainMapPane",
						{	
							
						
							onDrop: function(element)
							{	
								if(element.parentNode.id && element.parentNode.id=="sortableLayerList")
							   		onDropWmsLayer(config.objects.mainMapPane,element.id);
							  
							}
						}
					);
	}
	else
	{
		for (var i = 0; i < li.length; i++) 
		{
			var d = new Draggable
			(
				li[i],
				{
				ghosting: true,
				floating:false,
				revert: false,
				onStart:turnOffListener,
				onEnd:turnOnListener
				}
			);
		}
		Droppables.add
					(
						"layerControl",
						{	
							
							containment:$("sortableLayerList"),
							onDrop: function(element)
							{	
								
							   onDropWmsLayer(config.objects.layerControl,element.id);
							
							}
						}
					);
					Droppables.add
					(
						"mainMapPane",
						{	
							
						containment:$("sortableLayerList"),
							onDrop: function(element)
							{	//alert("finde demerde");
								onDropWmsLayer(config.objects.mainMapPane,element.id);
							  
							}
						}
					);
	}
	
					
					
	    
	Event.observe(window, 'unload', cleanup, false);
}