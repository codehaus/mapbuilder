/*
Author:     
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id:  1
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

function EditSLD(toolNode, model) {

  	ToolBase.apply(this, new Array(toolNode, model));
//  	this.targetModel.doc.namespace="xmlns:context='http://www.opengis.net/context' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'"
//	this.targetModel.namespace = "xmlns:mb='http://mapbuilder.sourceforge.net/mapbuilder' xmlns:wmc='http://www.opengis.net/context' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'";
	
	var styleUrl = baseDir+"/tool/xsl/wmc_AddSld.xsl";   //TBD figure out a way to set this for other operations
    this.stylesheet = new XslProcessor(styleUrl);
	
  	this.checkThis= function(){
  	//alert("checkthis");alert(Sarissa.serialize(this.model.doc));
  		if (document.getElementById("textStyle").checked == true)
    	{	
    		//this.addNodeToSLD("PolygonSymbolizer");
	 			
        	 this.addNodeToSLD("TextSymbolizer");
        	 document.getElementById("textStyle").checked=true;
        	 manageDiv('propertyText',1);
        	 alert("checked");
        	 alert(Sarissa.serialize(this.model.doc));
    	}
  		else 
  		{
  			if(this.model.doc.selectSingleNode("//TextSymbolizer")!=null)
	 		{	xpath="//FeatureTypeStyle";
		 		node = this.model.doc.selectSingleNode(xpath);
	 			node.removeChild(this.model.doc.selectSingleNode("//TextSymbolizer").parentNode);
	 			this.addNodeToSLD(document.getElementById("choixFeatureType").value+"Symbolizer");
	 			manageDiv('propertyText',0);
	 			alert(Sarissa.serialize(this.model.doc));
	 		}
  		}
  	}
  	this.upadteNode2 =function(Rule,nameofpath,value)
  	{
  	 var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title=\'"+Rule+"\']/";
  	//var nameofpath="/Fill/CssParameter"
  	 this.model.setXpathValue(this.model,xpath+nameofpath,value,false);
  	 
  	 
  	
  	}
  	
  	this.fillchamp = function(path){
  	
  	document.getElementById('couleurchoix').value   = this.getvalue(path,'/Stroke/CssParameter[@name=\'stroke\']');
  	document.getElementById('couleurchoix2').value  = this.getvalue(path,'/Fill/CssParameter[@name=\'fill\']');
  	

  	}
  	
  	this.LegendTypepics2 = function(choixlegend)
       {
       
       switch(choixlegend)
       {
      
       case '60' : document.getElementById("choixchamp").style.display="block";
				return;
       default:return;
       }
       
       }
       
  	this.getvalue =function(path,nameofpath)
  	{
  	
  	
  	var test = this.model.getXpathValue(this.model,path+nameofpath);
  	 
  	 return test;
  	
  	}
  	this.changeFill = function(choix)
  	{
  	
  	
  	var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule/PolygonSymbolizer";
  	
  	if(this.model.doc.selectSingleNode(xpath+"/CssParameter[@name='stroke-linejoin']") == null)
  	{
  	
  	node = this.model.doc.selectSingleNode(xpath);
  	var CssParameter=this.targetModel.doc.createElement("CssParameter");    
  	node.appendChild(CssParameter);
  	CssParameter.setAttribute("name","stroke-linejoin"); 
  	}
  	switch(choix)
  	{
  	case '1' :

  	this.model.setXpathValue(this.model,xpath+"/CssParameter[@name='stroke-linejoin']","mitre",false);
  	
  	return;
	case '2' :this.model.setXpathValue(this.model,xpath+"/CssParameter[@name='stroke-linejoin']","Stroke",false);
  	return;
  	case '3' :this.model.setXpathValue(this.model,xpath+"/CssParameter[@name='stroke-linejoin']","bevel",false);
  	return;
  	
  	
  	default: return;
  	
 
  	}
  	
  	
  	
  	}
  	 this.mode = function(element,maxi,mini,titlerule,nbclass,mode)
  	 {
  	   switch(mode)
  	   {
  	   case '1': this.symbole(element,maxi,mini,titlerule,nbclass);
  	   break;
  	   case '2': this.createelementSLD(element,maxi,mini,titlerule);
  	   break;
  	   default:return;
  	   }
  	 
  	 
  	 }
  	 this.symbole = function(element,maxi,mini,titlerule,nbclass)
		{
		var interval=(maxi-mini)/nbclass;
		
		//premier intervall mini + interval
		var temp=parseFloat(mini);
		for(var i = mini; i < nbclass;i++)
		{
		temp+=interval;
	
		javascript:config.objects.editSLD.createelementSLD(element,temp,mini,titlerule+i);
		
		mini=temp;
		}
		
		
		
		}
  	this.couleurcontinu = function(titlerule,typeofFeature){
  	
  	var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle";
  	var feature = this.model.getSldNode();
	var newNode = this.stylesheet.transformNodeToObject(feature);
  	Sarissa.setXpathNamespaces(newNode, this.targetModel.namespace+"xmlns:ogc='http://www.opengis.net/ogc'");
  	 
  	var rule=this.targetModel.doc.createElement("Rule");     
  	var sld=this.targetModel.doc.createElement("Title");
  	
if(sld.firstChild){
sld.firstChild.nodeValue=titlerule;
}else{
 dom=Sarissa.getDomDocument();
 v=dom.createTextNode(titlerule);
 sld.appendChild(v);
}
  	 rule.appendChild(sld);  
  	   	
	var node10 = this.model.doc.selectSingleNode(xpath);
  	node10.appendChild(rule);
  	
  	var poly=this.targetModel.doc.createElement(typeofFeature);
  	
	var xpath2=xpath+"/Rule[Title='"+titlerule+"']"
	var nodepoly = this.model.doc.selectSingleNode(xpath2);
  	nodepoly.appendChild(poly);
  	xpath2=xpath2+"/"+typeofFeature;
  	
  	
  	if( typeofFeature == "PolygonSymbolizer")
  	{
  	
  	var nodepoly1 = this.model.doc.selectSingleNode(xpath2);
	var Fill=this.targetModel.doc.createElement("Fill");
  	nodepoly1.appendChild(Fill);
  	var nodepoly3 = this.model.doc.selectSingleNode(xpath2+"/Fill");
	var CssParameter=this.targetModel.doc.createElement("CssParameter");
	CssParameter.setAttribute("name","fill");
	nodepoly3.appendChild(CssParameter);
	this.model.setXpathValue(this.model,xpath2+"/Fill/CssParameter","#CCFF66",false);
  	}
  	
  	var nodepoly2 = this.model.doc.selectSingleNode(xpath2);
	var Stroke=this.targetModel.doc.createElement("Stroke");
  	   	
	
  	nodepoly2.appendChild(Stroke);
	
	
	
  	
  	var nodepoly4 = this.model.doc.selectSingleNode(xpath2+"/Stroke");
	var CssParameter2=this.targetModel.doc.createElement("CssParameter");
	CssParameter2.setAttribute("name","stroke-width");
	
  	   	
  	nodepoly4.appendChild(CssParameter2);
  	
  	var nodepoly5 = this.model.doc.selectSingleNode(xpath2+"/Stroke");
	var CssParameter3=this.targetModel.doc.createElement("CssParameter");
	CssParameter3.setAttribute("name","stroke");
	   	
  	nodepoly5.appendChild(CssParameter3);
  	
	
	
	this.model.setXpathValue(this.model,xpath2+"/Stroke/CssParameter[@name=\'stroke-width\']","1",false);
	this.model.setXpathValue(this.model,xpath2+"/Stroke/CssParameter[@name=\'stroke\']","#CCFF66",false);
  	
  	}
  	
  	this.createelementSLD = function(element,up,low,titlerule){
  	
  	var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle";
  	var feature = this.model.getSldNode();
	var newNode = this.stylesheet.transformNodeToObject(feature);
  	Sarissa.setXpathNamespaces(newNode, this.targetModel.namespace+"xmlns:ogc='http://www.opengis.net/ogc'");
  	 
  	var rule=this.targetModel.doc.createElement("Rule");     
  	var sld=this.targetModel.doc.createElement("Title");
  	//sld.nodeValue=titlerule;
  	//alert(sld.nodeValue);
if(sld.firstChild){
sld.firstChild.nodeValue=titlerule;
}else{
 dom=Sarissa.getDomDocument();
 v=dom.createTextNode(titlerule);
 sld.appendChild(v);
}
  	 rule.appendChild(sld);  
  	   	//this.model.setXpathValue(rule,"/Rule/Title",titlerule,false);
	var node10 = this.model.doc.selectSingleNode(xpath);
  	node10.appendChild(rule);
  	//var sld=this.targetModel.doc.createElement("Title");                                   
	//var node = this.model.doc.selectSingleNode(xpath+"/Rule");
	//node.appendChild(sld);
	//this.model.setXpathValue(this.model,xpath+"/Rule/Title",titlerule,false);
	
	
	var Filter = createElementWithNS(this.targetModel.doc,"Filter",'http://www.opengis.net/ogc');
	var xpath2=xpath+"/Rule[Title='"+titlerule+"']"
	var node45 = this.model.doc.selectSingleNode(xpath2);
	node45.appendChild(Filter);
    var path = xpath2+"/ogc:Filter"
	
	node1 = this.model.doc.selectSingleNode(path);
	
	var  between = createElementWithNS(this.targetModel.doc,"PropertyIsBetween",'http://www.opengis.net/ogc');
	node1.appendChild(between);
	
	node2 = this.model.doc.selectSingleNode(xpath2+"/ogc:Filter/ogc:PropertyIsBetween");
	
	var  PropertyName = createElementWithNS(this.targetModel.doc,"PropertyName",'http://www.opengis.net/ogc');
	
	node2.appendChild(PropertyName);
	this.model.setXpathValue(this.model,xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:PropertyName",element,false);
	var  LowerBoundary = createElementWithNS(this.targetModel.doc,"LowerBoundary",'http://www.opengis.net/ogc');
	node35 = this.model.doc.selectSingleNode(xpath2+"/ogc:Filter/ogc:PropertyIsBetween");
	node35.appendChild(LowerBoundary);
	
	var Literal=createElementWithNS(this.targetModel.doc,"Literal",'http://www.opengis.net/ogc');
	node3 = this.model.doc.selectSingleNode(xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:LowerBoundary");
	node3.appendChild(Literal);
	
	
	node26 = this.model.doc.selectSingleNode(xpath2+"/ogc:Filter/ogc:PropertyIsBetween");
	
	var  UpperBoundary = createElementWithNS(this.targetModel.doc,"UpperBoundary",'http://www.opengis.net/ogc');
	node26.appendChild(UpperBoundary);
	node4 = this.model.doc.selectSingleNode(xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:UpperBoundary");
	var Literal2=createElementWithNS(this.targetModel.doc,"Literal",'http://www.opengis.net/ogc');
	node4.appendChild(Literal2);
	this.model.setXpathValue(this.model,xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:LowerBoundary/ogc:Literal",low,false);
	this.model.setXpathValue(this.model,xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:UpperBoundary/ogc:Literal",up,false);
	
	
	var poly=this.targetModel.doc.createElement("PolygonSymbolizer");
	
	var nodepoly = this.model.doc.selectSingleNode(xpath2);
  	nodepoly.appendChild(poly);
  	var nodepoly1 = this.model.doc.selectSingleNode(xpath2+"/PolygonSymbolizer");
	var Fill=this.targetModel.doc.createElement("Fill");
  	   	//this.model.setXpathValue(rule,"/Rule/Title",titlerule,false);
	
  	nodepoly1.appendChild(Fill);
  	var nodepoly2 = this.model.doc.selectSingleNode(xpath2+"/PolygonSymbolizer");
	var Stroke=this.targetModel.doc.createElement("Stroke");
  	   	
	
  	nodepoly2.appendChild(Stroke);
	
	
	var nodepoly3 = this.model.doc.selectSingleNode(xpath2+"/PolygonSymbolizer/Fill");
	var CssParameter=this.targetModel.doc.createElement("CssParameter");
	CssParameter.setAttribute("name","fill");
	
  
  	nodepoly3.appendChild(CssParameter);
  	
  	var nodepoly4 = this.model.doc.selectSingleNode(xpath2+"/PolygonSymbolizer/Stroke");
	var CssParameter2=this.targetModel.doc.createElement("CssParameter");
	CssParameter2.setAttribute("name","stroke-width");
	
  	   	
  	nodepoly4.appendChild(CssParameter2);
  	
  	var nodepoly5 = this.model.doc.selectSingleNode(xpath2+"/PolygonSymbolizer/Stroke");
	var CssParameter3=this.targetModel.doc.createElement("CssParameter");
	CssParameter3.setAttribute("name","stroke");
	   	
  	nodepoly5.appendChild(CssParameter3);
  	
	
	this.model.setXpathValue(this.model,xpath2+"/PolygonSymbolizer/Fill/CssParameter","#CCFF66",false);
	this.model.setXpathValue(this.model,xpath2+"/PolygonSymbolizer/Stroke/CssParameter[@name=\'stroke-width\']","1",false);
	this.model.setXpathValue(this.model,xpath2+"/PolygonSymbolizer/Stroke/CssParameter[@name=\'stroke\']","#CCFF66",false);
		
		
		
		

         
  	
  	}
  	
  /**
   * Adds a new LayerName to  the sld document
   * @param 
   */ 
	this.updateNode = function(xpath,value){

		if (xpath=='//MinScaleDenominator2')
		{
			node = this.model.doc.selectNodes("//MinScaleDenominator");	
			node[1].firstChild.nodeValue=value;
		}
		else if(xpath=='//MaxScaleDenominator2')
		{
			node2 = this.model.doc.selectNodes("//MaxScaleDenominator");
			node2[1].firstChild.nodeValue=value;
		
		}
		else if((this.model.doc.selectSingleNode(xpath)!=null)&&(value))
		{	

			this.model.setXpathValue(this.model,xpath,value,false);
			
		}

		
		
	 }
	 /**
   * Adds a new node Symnolizer to  the sld document
   * version 2
   */  
	  
	 this.insertSldToWmc= function(layerName)
	 { 
		if(layerName)
	 	{  
			var feature = this.model.getSldNode();
			
		    var newNode = this.stylesheet.transformNodeToObject(feature);

		    Sarissa.setXpathNamespaces(newNode, this.targetModel.namespace);

			
		    mbDebugMessage(this, newNode.xml);
		    legendURLNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList/wmc:Style/wmc:LegendURL");
		  
		    layerNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']");
			styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList");
		    
		   
		    if(styleNode)
			{
		    	layerNode.removeChild(styleNode);
			}
		    this.targetModel.setParam('addSLD',newNode.documentElement);
		    
		    if(legendURLNode)
		    { 
		    	styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList/wmc:Style")	
		    	styleNode.appendChild(legendURLNode);
		    	
		    }
		     config.objects.mainMap.setParam("refresh");
		    //alert("fin"); 
    	}
	 	else alert(mbGetMessage("selectLayer"));
	 	
	}
    
    
    
    
    

    
    
    
	/**
   * Adds a new node Symnolizer to  the sld document
   * version 1
   */  
	 this.insertSldaToWmc= function(layerName){
	 
	 if(layerName)
	 {
		sl=this.targetModel.doc.createElement("StyleList");
		
		st=this.targetModel.doc.createElement("Style");
		st.setAttribute("current","1");
		
		sld=this.targetModel.doc.createElement("SLD");

		node = this.model.doc.selectSingleNode("//StyledLayerDescriptor").cloneNode('true');
	
		sld.appendChild(node);

		st.appendChild(sld);
		sl.appendChild(st);
	
		layerNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']");
		styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList");

				if(styleNode)
				{
					layerNode.removeChild(styleNode);
					layerNode.appendChild(sl);
					config.objects.mainMap.setParam("refresh");

				}
				else
				{ 	
					layerNode.appendChild(sl);
					config.objects.mainMap.setParam("refresh");
				}
				mbDebugMessage(this, "Apres : "+Sarissa.serialize(this.targetModel.doc));
				
	 }
	 else alert(mbGetMessage("selectLayer"));
	}
	 
	 
	 
	 
	 
/**
   * Valid the sld document
   * 
   */ 	 

this.validSld=function(layerName)
	{	//alert(document.getElementById("selectPropertyCanvas"));
		
	      if(!layerName)
	      {
	      	alert(mbGetMessage("noLayerSelected"));
		  }
	      else if(((document.getElementById("textStyle").checked == true) && (document.getElementById("selectPropertyCanvas")))||(document.getElementById("textStyle").checked == false))
	      {			alert("test le renard");
	      			this.updateNodeCss(document.getElementById("fill").id,'//PolygonSymbolizer/Fill/CssParameter[@name=',document.getElementById('fill').value);
					this.updateNodeCss(document.getElementById('fill').id,'//PointSymbolizer/Graphic/Mark/Fill/CssParameter[@name=',document.getElementById('fill').value);
					this.updateNodeCss(document.getElementById('stroke').id,'//CssParameter[@name=',document.getElementById('stroke').value);
					this.updateNodeCss('fill','//TextSymbolizer/Fill/CssParameter[@name=',document.getElementById('fontColor').value);
	      			this.insertSldToWmc(layerName);
	      			
	      			config.loadModel('mySLD',this.model.url);
	      			
		  }
	      else if (!document.getElementById("selectPropertyCanvas"))
	      {
	      alert(mbGetMessage("noPropertySelected"));
	     
	      }
	    //config.objects.mainMap.setModel('mainMap',config.objects.mainMap.doc);
	}
	
	
} 
