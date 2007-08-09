/*
Author:   
License:  LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id:  1
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Tool to edit an SLD.
 * @constructor
 * @base ToolBase
 * @param toolNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function EditSLD(toolNode, model)
{

     ToolBase.apply(this, new Array(toolNode, model));
	 var styleUrl = baseDir+"/tool/xsl/wmc_AddSld.xsl"; //TBD figure out a way to set this for other operations
     this.stylesheet = new XslProcessor(styleUrl);
   
     this.checkThis= function(){
         if (document.getElementById("textStyle").checked == true){   
             this.addNodeToSLD("TextSymbolizer");
             document.getElementById("textStyle").checked=true;
             manageDiv('propertyText',1);
             //alert("checked");
             //alert(Sarissa.serialize(this.model.doc));
         }
         else{
             if(this.model.doc.selectSingleNode("//TextSymbolizer")!=null){   
                  xpath="//FeatureTypeStyle";
                 node = this.model.doc.selectSingleNode(xpath);
                 node.removeChild(this.model.doc.selectSingleNode("//TextSymbolizer").parentNode);
                 this.addNodeToSLD(document.getElementById("choixFeatureType").value+"Symbolizer");
                 manageDiv('propertyText',0);
                 //alert(Sarissa.serialize(this.model.doc));
             }
         }
     }
     //changement 5/5/2007    
     /*
     *update from input to model
     *@param  path   node path
	 */

    this.upadteNode2 =function(Rule,nameofpath,value){
         var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title=\'"+Rule+"\']";
         var node = this.model.doc.selectSingleNode(xpath);
         var node=node.firstChild;
         var temp2="";
         while (node!=null){
            var temp = node.nodeName;
  	        node = node.nextSibling;
  
            switch(temp){
                 case 'LineSymbolizer':temp2=temp;break;
                 case 'PolygonSymbolizer':temp2=temp;break;
                 case 'PointSymbolizer':temp2=temp;break;
                 case 'TextSymbolizer':temp2=temp;break;
                 default:break;
            }
         }
         xpath = xpath+"/"+temp2+"/"+nameofpath;
         this.model.setXpathValue(this.model,xpath,value,false);
     }
     

	/*
	*update from model to input
	* @param  path path
	*/
	this.updateField = function(path){   
 		document.getElementById('couleurchoix').value = this.getValuePath(path,'/Stroke/CssParameter[@name=\'stroke\']');
 		document.getElementById('couleurchoix2').value  = this.getValuePath(path,'/Fill/CssParameter[@name=\'fill\']');
	}

	/*
	*choice between differen kind of legend 
	*@param  legenType type og legend
	*/
	this.LegendTypepics2 = function(legenType){
	 	switch(legenType){
	   		case '80' : document.getElementById("uniqueSymbole").style.display="block";
	                    return;
	   		case '60' : javascript:config.paintWidget(config.objects.addRule);
	                    return;
	   		default   : document.getElementById("uniqueSymbole").style.display="none";
	                    return;
	 	}
	 }
   
  
	/*
	*getvalue of path 
	*
	* @param   path node path 
	* @param   nameofpath  node path end
	* return  the value of node
	*/
	this.getValuePath =function(path,nameofpath){
	  	return this.model.getXpathValue(this.model,path+nameofpath);
    }
    
    /*
	* Set stroke style (mitre,stroke,bevel)
	*
	* @param   titlerule   title of rule to apply this stoke style
	* @param   choosen     style stroke name choosen
	*/
	this.styleOfStroke = function(titlerule,choosen){
	 	var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title='"+titlerule+"']";
	 	var node = this.model.doc.selectSingleNode(xpath);
	 	var node=node.firstChild;
	 	var temp2="";
	 	while (node!=null){
	   		var temp = node.nodeName;
	  		node = node.nextSibling;
	  		switch(temp){
	  			case 'LineSymbolizer'   : temp2=temp;break;
	  			case 'PolygonSymbolizer': temp2=temp;break;
	 	 		case 'PointSymbolizer'  : temp2=temp;break;
	  			case 'TextSymbolizer'   : temp2=temp;break;
	  			default                 : break;
	  		}
	 	}
	 	xpath=xpath+"/"+temp2+"/Stroke";
	 	if(this.model.doc.selectSingleNode(xpath+"/CssParameter[@name='stroke-linejoin']") == null){
	   		this.addNodeWithParam(xpath,"CssParameter","stroke-linejoin");  
	 	}
		 switch(choosen){
	       		case 'mitre' :	this.model.setXpathValue(this.model,xpath+"/CssParameter[@name='stroke-linejoin']","mitre",false);
		   						return;
	       		case 'Stroke':	this.model.setXpathValue(this.model,xpath+"/CssParameter[@name='stroke-linejoin']","Stroke",false);
	       						return;
	       		case 'bevel' :	this.model.setXpathValue(this.model,xpath+"/CssParameter[@name='stroke-linejoin']","bevel",false);
	       						return;
		   		default		 : return;
	 	}
	}

	/*
	*this function allows to choice beetween different creating mode 
	*
	* @param   element   name of layer proprity choose by user  
	* @param   maxi   upper value of layer proprety 
	* @param   mini   lower value of layer proprety 
	* @param   titlerule   tille of rule 
	* @param   nbclass   class number 
	* @param   mode   creating mode(equal interval,one by one,equal interval with color 
	* @param   Cmin   value lower color 
	* @param   Cmax   value upper color 
	*/ 
	this.mode = function(element,maxi,mini,titlerule,nbclass,mode,Cmin,Cmax){
	  var typeofFeature="PolygonSymbolizer";
	  switch(mode){
		    case '1': 	this.createNbRule(element,maxi,mini,titlerule,nbclass);
		    			break;
		    case '2':   this.createRule(titlerule,typeofFeature,Cmin)
		    			this.addFilter(element,maxi,mini,titlerule+i);
		    			break;
		    case '3': 	this.createNbRuleWithColor(element,maxi,mini,titlerule,nbclass,Cmin,Cmax);
		    			break;
		    default :	break;
	  }
}
	/*
	*   Transform decimal number to hexadecimal
	*	@param dec   decimal number
	*	@return  hexadecimal number
	*/ 
	this.DecToHex = function(dec){ 
		return ((hex=dec.toString(16).toUpperCase()).length<2)?"0"+hex:hex; 
	}
	
	/*
	*   Transform decimal  hexadecimal to number 
	*	@param hex   hexadecimal number
	*	@return  decimal number
	*/ 
	this.HexToDec = function(hex){ 
		return parseInt(hex,16); 
	}

	/*
	*   Transform RGB
	*	@param hex   hexadecimal number
	*	@return  decimal number
	*/ 
	this.SetColHex = function(colh){
	  red=this.HexToDec(colh.substr(1,2)); 
	  green=this.HexToDec(colh.substr(3,2)); 
	  blue=this.HexToDec(colh.substr(5,2)); 
	}

	this.calculA = function(Cmax,Cmin,Imax,Imin){
	     return (Cmax-Cmin)/(Imax-Imin)
	}    
      
	this.interpolation = function(minI,MAxI,colormax,colormin,I){
      
      Rmax=this.HexToDec(colormax.substr(1,2));
      Rmin=this.HexToDec(colormin.substr(1,2)); 
      Gmax=this.HexToDec(colormax.substr(3,2)); 
      Gmin=this.HexToDec(colormin.substr(3,2)); 
      Bmax=this.HexToDec(colormax.substr(5,2));
      Bmin=this.HexToDec(colormin.substr(5,2)); 
      var a = this.calculA(Rmax,Rmin,MAxI,minI);
      var b = Rmax - (MAxI*a);
      var R = (a*I) + b ;
       a = this.calculA(Gmax,Gmin,MAxI,minI);
       b = Gmax - (MAxI*a);
      var G = (a*I) + b ;
       a = this.calculA(Bmax,Bmin,MAxI,minI);
       b = Bmax - (MAxI*a);
      var B = (a*I) + b;
      
      return color ="#"+this.DecToHex(parseInt(R, 10))+this.DecToHex(parseInt(G, 10))+this.DecToHex(parseInt(B, 10));
       
	}
	/*
	*create nbclass rule ,calcul an equal interval for each rule and give a color according to the propriety
	*  mini,maxi  -->  cmin,cmax 
	* @param   element   xpath 
	* @param   maxi   lower value 
	* @param   mini   upper value 
	* @param   titlerule   titlerule 
	* @param   nbclass   nbclass 
	* @param   Cmin   lower value color 
	* @param   Cmax   upper value color 
	*/ 
	this.createNbRuleWithColor = function(element,maxi,mini,titlerule,nbclass,Cmin,Cmax){
		  var interval=(maxi-mini)/nbclass;
		  var typeofFeature="PolygonSymbolizer";
		  var temp=parseFloat(mini);
		  for(var i = mini; i < nbclass;i++){
		      temp+=interval;
		      var color=this.interpolation(mini,maxi,Cmax,Cmin,temp)
		      this.createRule(titlerule+i,typeofFeature,color)
		      this.addFilter(element,temp,mini,titlerule+i);
		      mini=temp;
		  }
	}
	/*
	*create nbclass rule ,calcul an equal interval for each rule 
	*
	* @param   element   xpath 
	* @param   maxi   lower value 
	* @param   mini   upper value 
	* @param   titlerule   titlerule 
	* @param   nbclass   nbclass 
	*/ 
      
	this.createNbRule = function(element,maxi,mini,titlerule,nbclass){
	      var interval=(maxi-mini)/nbclass;
	      var typeofFeature="PolygonSymbolizer";
	      //first interval mini + interval
	      var temp=parseFloat(mini);
	      for(var i = mini; i < nbclass;i++){
		      temp+=interval;
		      this.createRule(titlerule+i,typeofFeature,'#CCFF00')
		      this.addFilter(element,temp,mini,titlerule+i);
		      mini=temp;
 		  }
    }
      
	/*create basic rule with TextSymbolizer,you can modify the WellKnownName(star,square,..),the size,the color.
	*
	* @param   size   size of point 
	* @param   color   value color 
	* @param   WellKnownName   square,star 
	* @param   PropertyName   name of propriety layer 
	*/
	this.TextSymbolizer = function(size,color,WellKnownName,PropertyName,locate){      
		 var typeofFeature="/TextSymbolizer"
		 var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle";
		 var rule=this.targetModel.doc.createElement("Rule");   
		 var title=this.targetModel.doc.createElement("Title");
	  	//hack to give a name to the rule
	 	if(title.firstChild){
	    	title.firstChild.nodeValue=titlerule;
	  	}
	  	else{
		    dom=Sarissa.getDomDocument();
		    v=dom.createTextNode(titlerule);
		    title.appendChild(v);
	  	}
	   
		  rule.appendChild(title);  
		  var node = this.model.doc.selectSingleNode(xpath);
		  node.appendChild(rule);     
		  
		  var xpath2=xpath+"/Rule[Title='"+titlerule+"']"
		  this.addNode(xpath2,typeofFeature);
		  xpath2=xpath2+"/"+typeofFeature;
		  this.addNode(xpath2,"Geometry");
		  this.addNodeWithDS(xpath2+"Geometry","PropertyName");
		  this.model.setXpathValue(this.model,xpath2+"/Geometry/ogc:PropertyName",PropertyName,false); 
		  
		  this.addNode(xpath2,"Label");
		  this.addNodeWithDS(xpath2+"Label","PropertyName");
		  this.model.setXpathValue(this.model,xpath2+"/Geometry/ogc:PropertyName",locate,false); 
		  //i must do a hack cause two node have the same name
		  this.addNode(xpath2,"Font"); 
		  this.addNodeWithParam(xpath2+"/Font","CssParameter","font-family");
		  this.model.setXpathValue(this.model,xpath2+"/Fill/CssParameter[@name=\'font-family\']",'arial',false);
		  this.addNodeWithParam(xpath2+"/Font","CssParameter","font-family");
		  this.model.setXpathValue(this.model,xpath2+"/Fill/CssParameter[@name=\'font-family\']",'Sans-Serif',false);
		  this.addNodeWithParam(xpath2+"/Font","CssParameter","font-style");
		  this.model.setXpathValue(this.model,xpath2+"/Fill/CssParameter[@name=\'font-style\']",'arial',false);
		  this.addNodeWithParam(xpath2+"/Font","CssParameter","font-size");
		  this.model.setXpathValue(this.model,xpath2+"/Fill/CssParameter[@name=\'font-size\']",'arial',false);
		
		  this.addNode(xpath2,"Fill"); 
		  this.addNodeWithParam(xpath2+"/Fill","CssParameter","fill");
		  this.model.setXpathValue(this.model,xpath2+"/Fill/CssParameter[@name=\'fill\']",color,false);
		/*
		
		<Font>
		<CssParameter name="font-family">Arial</CssParameter>
		<CssParameter name="font-family">Sans-Serif</CssParameter>
		<CssParameter name="font-style">italic</CssParameter>
		<CssParameter name="font-size">10</CssParameter>
		</Font>
		
		<Fill>
		<CssParameter name="fill">#000000</CssParameter>
		</Fill>
		
		<Halo/>*/

	}
	/*
	*create basic rule with PointSymbolizer,you can modify the WellKnownName(star,square,..),the size,the color.
	*
	* @param   size   size of point 
	* @param   color   value color 
	* @param   WellKnownName   square,star 
	* @param   PropertyName   name of propriety layer 
	*/
	this.graphicSymbol = function(size,color,WellKnownName,PropertyName){
		  var typeofFeature="/PointSymbolizer"
		  var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle";
		  var rule=this.targetModel.doc.createElement("Rule");   
		  var title=this.targetModel.doc.createElement("Title");
		  //hack to give a name to the rule
		  if(title.firstChild){
		    title.firstChild.nodeValue=titlerule;
		  }
		  else{
		    dom=Sarissa.getDomDocument();
		    v=dom.createTextNode(titlerule);
		    title.appendChild(v);
		  }
		   
		  rule.appendChild(title);  
		  var node = this.model.doc.selectSingleNode(xpath);
		  node.appendChild(rule);
		     
		  var xpath2=xpath+"/Rule[Title='"+titlerule+"']"
		  this.addNode(xpath2,typeofFeature);
		  xpath2=xpath2+"/"+typeofFeature;
		  this.addNode(xpath2,"Geometry");
		  this.addNodeWithDS(xpath2+"Geometry","PropertyName");
		  this.model.setXpathValue(this.model,xpath2+"/Geometry/ogc:PropertyName",PropertyName,false);   
		  this.addNode(xpath2,"Graphic"); 
		  this.addNode(xpath2+"/Graphic","Mark"); 
		  this.addNode(xpath2+"/Graphic","Size");
		  this.model.setXpathValue(this.model,xpath2+"/Graphic/Size",size,false);   
		  xpath2=xpath2+"/Graphic/Mark"
		  this.addNode(xpath2,"WellKnownName");
		  this.model.setXpathValue(this.model,xpath2+"WellKnownName",WellKnownName,false);
		  this.addNode(xpath2,"Fill"); 
		  this.addNodeWithParam(xpath2+"/Fill","CssParameter","fill");
		  this.model.setXpathValue(this.model,xpath2+"/Fill/CssParameter[@name=\'fill\']",color,false);
	}   
   
	/*
	*add a node to model et set the value of name's param   
	*
	* @param   xpath   xpath 
	* @param   createElement   new element 
	* @return  node
	*/ 
	this.addNode = function(xpath,createElement){
	      var node = this.model.doc.selectSingleNode(xpath);
	      var nodeAdd=this.targetModel.doc.createElement(createElement);
	      return node.appendChild(nodeAdd);
	}

	/*
	*add a node to model et set the value of name's param   
	*
	* @param   xpath   xpath 
	* @param   createElement   new element 
	* @return  node
	*/ 
	this.addNodeWithDS = function(xpath,createElement){
	      var node = this.model.doc.selectSingleNode(xpath);
	      var nodeAdd=createElementWithNS(this.targetModel.doc,createElement,'http://www.opengis.net/ogc');
	      return node.appendChild(nodeAdd);
	}
	/*
	*add a node to model et set the value of name's param   
	*
	* @param   xpath   xpath 
	* @param   createElement   new element 
	* @param   param   name of param 
	* @return  node
	*/ 
	
	
	this.addNodeWithParam = function(xpath,createElement,param){
	      var node = this.model.doc.selectSingleNode(xpath);
	      var nodeAdd=this.targetModel.doc.createElement(createElement);
	      nodeAdd.setAttribute("name",param);
	      return node.appendChild(nodeAdd);
	}

	/*
	*create basic rule in model
	*
	* @param   Titlerule   name of rule  
	* @param   typeofFeature   line,polygon,text,point 
	* @param   color   color of fill 
	*/ 
	this.createRule = function(titlerule,typeofFeature,color){
	     
	   var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle";
	   var rule=this.targetModel.doc.createElement("Rule");   
	   var title=this.targetModel.doc.createElement("Title");
	   //hack to give a name to the rule
	   if(title.firstChild){
	         title.firstChild.nodeValue=titlerule;
	   }
	   else{
	         dom=Sarissa.getDomDocument();
	         v=dom.createTextNode(titlerule);
	         title.appendChild(v);
	   }
	   
	     rule.appendChild(title);  
	     
	     var node = this.model.doc.selectSingleNode(xpath);
	     node.appendChild(rule);
	     
	     var xpath2=xpath+"/Rule[Title='"+titlerule+"']"
	     this.addNode(xpath2,typeofFeature);
	     xpath2=xpath2+"/"+typeofFeature;
	     
	     
	     if( typeofFeature == "PolygonSymbolizer"){
		     this.addNode(xpath2,"Fill");
		     this.addNodeWithParam(xpath2+"/Fill","CssParameter","fill");
		     this.model.setXpathValue(this.model,xpath2+"/Fill/CssParameter",color,false);   
	     }
	     
	     this.addNode(xpath2,"Stroke"); 
	     this.addNodeWithParam(xpath2+"/Stroke","CssParameter","stroke-width");
	     this.addNodeWithParam(xpath2+"/Stroke","CssParameter","stroke");
	     this.model.setXpathValue(this.model,xpath2+"/Stroke/CssParameter[@name=\'stroke-width\']","1",false);
	     this.model.setXpathValue(this.model,xpath2+"/Stroke/CssParameter[@name=\'stroke\']",color,false);
	     
	}
	     
	/*     
	*delete all the rules 
	*/ 
	this.deleteAllRules = function(){   
	  var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle";
	  if(this.model.doc.selectSingleNode(xpath+"/FeatureTypeStyle") != null){
	     var layerNode=this.model.doc.selectSingleNode(xpath)
	     var node=this.model.doc.selectSingleNode(xpath+"/FeatureTypeStyle")
	     layerNode.removeChild(node);
	     this.addNode(xpath,"FeatureTypeStyle"); 
	  }
	}
	
	/*     
	*delete one rule 
	*
	*@param nameOfRule name of rule which must be deleted
	*
	*/ 
	this.deleteOneRule= function(nameOfRule){
	  var xpath ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/";
	  var xpath2 ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title='"+nameOfRule+"']";
	  if(this.model.doc.selectSingleNode(xpath2) != null){
	     var layerNode=this.model.doc.selectSingleNode(xpath)
	     var node=this.model.doc.selectSingleNode(xpath2)
	     layerNode.removeChild(node);
	      
	  }
	}
     
	/*     
	*create a filter inside a rule  
	*@param  element propriety of a layer
	*@param   up   upper value 
	*@param   low   lower value 
	*@param   Titlerule   name of rule  
	*/ 
	     
	this.addFilter = function(element,up,low,titlerule){
	     
	     var xpath2 ="/StyledLayerDescriptor/NamedLayer/UserStyle/FeatureTypeStyle/Rule[Title='"+titlerule+"']";
	     this.addNodeWithDS(xpath2,"Filter");
	     var path = xpath2+"/ogc:Filter";
	     this.addNodeWithDS(path,"PropertyIsBetween");
	     this.addNodeWithDS(xpath2+"/ogc:Filter/ogc:PropertyIsBetween","PropertyName");
	     this.model.setXpathValue(this.model,xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:PropertyName",element,false);
	     this.addNodeWithDS(xpath2+"/ogc:Filter/ogc:PropertyIsBetween","LowerBoundary");
	     this.addNodeWithDS(xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:LowerBoundary","Literal");
	     this.addNodeWithDS(xpath2+"/ogc:Filter/ogc:PropertyIsBetween","UpperBoundary");
	     this.addNodeWithDS(xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:UpperBoundary","Literal");
	     this.model.setXpathValue(this.model,xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:LowerBoundary/ogc:Literal",low,false);
	     this.model.setXpathValue(this.model,xpath2+"/ogc:Filter/ogc:PropertyIsBetween/ogc:UpperBoundary/ogc:Literal",up,false);
	}
	
	  /**
	 * Update node value
	 * @param xpath
	 * @param value
	 */ 
	 this.updateNode = function(xpath,value){
	      if (xpath=='//MinScaleDenominator2'){
	         node = this.model.doc.selectNodes("//MinScaleDenominator");   
	         node[1].firstChild.nodeValue=value;
	      }
	      else if(xpath=='//MaxScaleDenominator2'){
	         node2 = this.model.doc.selectNodes("//MaxScaleDenominator");
	         node2[1].firstChild.nodeValue=value;
	      
	      }
	      else if((this.model.doc.selectSingleNode(xpath)!=null)&&(value)){   
	         this.model.setXpathValue(this.model,xpath,value,false);
	      }
	  }
	  
	  
    /**
 	* Insert <SLD> tag n Web Map Context document
 	* @param layerName
 	*/  
     
    this.insertSldToWmc= function(layerName){ 
      if(layerName){  
         var feature = this.model.getSldNode();
         var newNode = this.stylesheet.transformNodeToObject(feature);
         Sarissa.setXpathNamespaces(newNode, this.targetModel.namespace);  
         mbDebugMessage(this, newNode.xml);
         legendURLNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList/wmc:Style/wmc:LegendURL");
         layerNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']");
         styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList");
         if(styleNode){
           layerNode.removeChild(styleNode);
         }
         this.targetModel.setParam('addSLD',newNode.documentElement);
         if(legendURLNode){ 
           styleNode=this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList/wmc:Style");   
           styleNode.appendChild(legendURLNode); 
         }
         
     	//console.debug((new XMLSerializer()).serializeToString(this.targetModel.doc.selectSingleNode("//wmc:Layer[wmc:Name='"+layerName+"']/wmc:StyleList/wmc:Style/wmc:SLD")));
         //config.objects.mainMap.setParam("refresh","sld");
     }
       else alert(mbGetMessage("selectLayer"));
   }
} 
