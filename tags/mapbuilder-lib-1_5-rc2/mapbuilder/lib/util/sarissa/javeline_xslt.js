if(!IS_IE && !self.XSLTProcessor) XSLTProcessor = _Javeline_XSLTProcessor;
	
function _Javeline_XSLTProcessor(){
	this.templates = {};
	this.paramsSet={};
	this.currentTemplate="global";
	
	// list of function xsl
	this.p = {
	
		"value-of" : function(context, xslNode, childStack, result){   
		 
		  var expression = this.lookforVariable(xslNode.getAttribute("select"));
		  var xmlNode = context.selectNodes(expression)[0];// + "[0]"
		  if(xmlNode != null)
		  {
		   if(xmlNode == null ) value = "";
		   else if(xmlNode.nodeType == 1) value = xmlNode.firstChild ? xmlNode.firstChild.nodeValue : "";
		   else value = typeof xmlNode == "object" ? xmlNode.nodeValue : xmlNode;
		  }
		  else
		  {
		   value = expression;
		  }
		  result.appendChild(this.xmlDoc.createTextNode(value));
		},
		
		"copy-of" : function(context, xslNode, childStack, result){
			var xmlNode = XPath.selectNodes(this.lookforVariable(xslNode.getAttribute("select")), context)[0];// + "[0]"
			if(xmlNode) result.appendChild(!IS_IE ? result.ownerDocument.importNode(xmlNode, true) : xmlNode.cloneNode(true));
		},
		
		"if" : function(context, xslNode, childStack, result){
		var test = this.lookforVariable(xslNode.getAttribute("test"));
		
		   if(XPath.selectNodes(test, context)[0]){// + "[0]"
				this.parseChildren(context, xslNode, childStack, result);
			}
		},
		
		"for-each" : function(context, xslNode, childStack, result){
			var nodes = XPath.selectNodes(this.lookforVariable(xslNode.getAttribute("select")), context);
			for(var i=0;i<nodes.length;i++){
				this.parseChildren(nodes[i], xslNode, childStack, result);
			}
		},
		
		"attribute" : function(context, xslNode, childStack, result){
			var nres = this.xmlDoc.createDocumentFragment();
			this.parseChildren(context, xslNode, childStack, nres);
			result.setAttribute(xslNode.getAttribute("name"), nres.xml);
		},
		
		"choose" : function(context, xslNode, childStack, result){
		   
			var nodes = xslNode.childNodes;
			for(var i=0;i<nodes.length;i++){
				if(!nodes[i].tagName) continue;
				if(nodes[i][TAGNAME] == "when")
				{
				 var node = context.selectNodes(this.lookforVariable(nodes[i].getAttribute("test")))[0];
				 if(node == "undefined") return;//safari bug
				}
				if(nodes[i][TAGNAME] == "otherwise" || (nodes[i][TAGNAME] == "when" && node))
					return this.parseChildren(context, nodes[i], childStack[i][2], result);
			}
		},
		"text" : function(context, xslNode, childStack, result)
		{
		   if(xmlNode == null ) value = "";
		   else if(xmlNode.nodeType == 1) value = xmlNode.firstChild ? xmlNode.firstChild.nodeValue : "";
		   else value = typeof xmlNode == "object" ? xmlNode.nodeValue : xmlNode;
		   value = expression;
		   result.appendChild(this.xmlDoc.createTextNode(value));
		   
		},
		"call-template" : function(context, xslNode, childStack, result)
		{
		 var t = this.templates[xslNode.getAttribute("name")];
		 this.currentTemplate=t;
		 if(t){
		  
		  this.parseChildren(context, t[0], t[1], result);
		  this.withparams(xslNode); 
		  this.currentTemplate=t;
		  this.paramsSet[this.currentTemplate]= new Array();
		  }
		},
		"apply-templates" : function(context, xslNode, childStack, result)
		{
		//try if context is a node document else take is child
		if(!xslNode){
		       var childContext = context.childNodes[0];
	           var tagname = childContext.tagName;
	           var test = this.lookforTemplate(tagname);
	           if(test == 0 ) test="/";
	           t = this.templates[test];
			   if(t) {
				this.p["apply-templates"].call(this, context, t[0], t[1], result);
				}
			}else{
		var aux = xslNode.getAttribute("match") || xslNode.getAttribute("select");
		 aux = this.lookforVariable(aux);
		var template = "";
		if(this.templates[aux]) template =aux;
		else
		 template = this.lookforTemplate2(aux);
		if(aux)
		{
	     this.currentTemplate=template;
		 var t = this.templates[template];
		 if(t)
		 {
		  //if(aux == "/") return alert("Something went wrong. The / template was executed as a normal template");
		  var nodes = context.selectNodes(aux);
		  var tabIndex;
		  this.withparams(xslNode); 
		  if(xslNode.firstChild[TAGNAME] == "sort")
		  this.xslSort( xslNode.firstChild, nodes, tabIndex);
		  if(!nodes[0]) return;
		  for(var i=0;i<nodes.length;i++)
		  { 
		   if(xslNode.firstChild[TAGNAME] == "sort")
		   this.parseChildren(nodes[tabIndex[i]], t[0], t[1], result);
		   else
		   this.parseChildren(i , t[0], t[1], result);
		   this.currentTemplate=template;
		   this.paramsSet[this.currentTemplate]= new Array(); 
		  }
		 }
		}
		else if(xslNode.getAttribute("name"))
		{
		 var t = this.templates[xslNode.getAttribute("name")];
		 this.currentTemplate=t;
		 if(t){
		  this.withparams(xslNode); 
		  this.parseChildren(context, t[0], t[1], result);
		  this.currentTemplate=t;
		  this.paramsSet[this.currentTemplate]= new Array();
		  }
		}
		else
		{
				//Copy context
				var ncontext = context.cloneNode(true); //importnode here??
				var nres = this.xmlDoc.createDocumentFragment();
				
				var nodes = ncontext.childNodes;
				if(!nodes[0]) return;
				for(var tName, i=nodes.length-1;i>=0;i--){
					if(nodes[i].nodeType == 3 || nodes[i].nodeType == 4){
						//result.appendChild(this.xmlDoc.createTextNode(nodes[i].nodeValue));
						continue;
					}
					if(!nodes[i].nodeType == 1) continue;
					var n = nodes[i];

					//Loop through all templates
					for(tName in this.templates){
						if(tName == "/") continue;
						var t = this.templates[tName];
						
						var snodes = n.selectNodes("self::" + tName);
						for(var j=snodes.length-1;j>=0;j--){
							var s = snodes[j], p = s.parentNode;
							
							this.parseChildren(s, t[0], t[1], nres);
							this.paramsSet[this.currentTemplate]= new Array();
							 
		  
							if(nres.childNodes){
								for(var k=nres.childNodes.length-1;k>=0;k--){
									p.insertBefore(nres.childNodes[k], s);
								}
							}
							p.removeChild(s);
						}
					}
					
					if(n.parentNode){
						var p = n.parentNode;
						this.p["apply-templates"].call(this, n, xslNode, childStack, nres);
						if(nres.childNodes){
							for(var k=nres.childNodes.length-1;k>=0;k--){
								p.insertBefore(nres.childNodes[k], n);
							}
						}
						p.removeChild(n);
					}
				}
				
				for(var i=ncontext.childNodes.length-1;i>=0;i--){
					result.insertBefore(ncontext.childNodes[i], result.firstChild);
				}
			}
			}
		},
		
		cache : {},
		
		"import" : function(context, xslNode, childStack, result){
			var file = xslNode.getAttribute("href");
			if(!this.cache[file]){
				var data = new HTTP().get(file, false, true);
				this.cache[file] = data;
			}
			
			//compile
			//parseChildren
		},
		
		"include" : function(context, xslNode, childStack, result){
			
		},
		
		"element" : function(context, xslNode, childStack, result){
		    var element = this.xmlDoc.createElement(xslNode.getAttribute("name"));
			this.parseChildren(context, xslNode, childStack,element);
			result.appendChild(element);
		},
		
		"param" : function(context, xslNode, childStack, result){
		  var namePram = xslNode.getAttribute("name");
		  if(!this.paramsSet["params"][namePram] && xslNode.firstChild)
		  {
		  var aux = getNodeValue(xslNode);
		  if(aux == "undefined") aux= false;
		  this.paramsSet["params"][namePram] = aux;
		  }
		},
		"with-param" : function(context, xslNode, childStack, result){
			
		},
		"variable" : function(context, xslNode, childStack, result){
		 var namePram = xslNode.getAttribute("name");
		 var tempValue="";
		 if(!this.paramsSet[this.currentTemplate])//init variable
		 this.paramsSet[this.currentTemplate] = new Array();
		 if(!this.paramsSet[this.currentTemplate][namePram])
		 {
		  var nres = this.xmlDoc.createDocumentFragment();
		  this.parseChildren(context,xslNode,childStack,nres);
		  var nodes = nres.childNodes;//refactorize it
		  var select=xslNode.getAttribute("select");
		  if(select)
		  {
		  select = this.lookforVariable(select);
		  try{
		  var nodeSelect = context.selectNodes(select)[0];
	      if(!nodeSelect) tempValue = "";
		  else if(nodeSelect.nodeType == 1) tempValue = nodeSelect.firstChild ? nodeSelect.firstChild.nodeValue : "";
		  else tempValue = typeof nodeSelect == "object" ? nodeSelect.nodeValue : nodeSelect;
		  if(typeof nodeSelect == "number") tempValue=""+nodeSelect;
		  
		  }
		  catch(e){
		  
		  }
		  }
		  else
		  for(var i = 0; i < nodes.length;i++)
		  {
		  var temp2 = getNodeValue(nodes[i]);
		   if(temp2 != "undefined")
		   tempValue+=temp2;
		  }
		  tempValue = tempValue.replace(/\s/g,"");//maybe need to fix it
		  this.paramsSet[this.currentTemplate][namePram] =tempValue;
		 
		 }
		},
		
		"when" : function(){},
		
		"otherwise" : function(){},
		
		"sort" : function(){},
		
		"copy-clone" : function(context, xslNode, childStack, result){
		
			result = result.appendChild(!IS_IE ? result.ownerDocument.importNode(xslNode, false) : xslNode.cloneNode(false));
			if(result.nodeType == 1){
				for(var i=0;i<result.attributes.length;i++){
					var blah = result.attributes[i].nodeValue; //stupid Safari shit

					if(!IS_SAFARI && result.attributes[i].nodeName.match(/^xmlns/)) continue;
					result.attributes[i].nodeValue = this.variable(result.attributes[i].nodeValue);
					result.attributes[i].nodeValue = result.attributes[i].nodeValue.replace(/\{([^\}]+)\}/g, function(m, xpath){
						var xmlNode = XPath.selectNodes(xpath, context)[0];
						
						if(!xmlNode) value = "";
						else if(xmlNode.nodeType == 1) value = xmlNode.firstChild ? xmlNode.firstChild.nodeValue : "";
						else value = typeof xmlNode == "object" ? xmlNode.nodeValue : xmlNode;
						
						return value;
					});
					
					result.attributes[i].nodeValue; //stupid Safari shit
				}
			}
			
			this.parseChildren(context, xslNode, childStack, result);
			
		}
	}
	/**
     * xslSort , threat the stack
     * 
     * @argument xsl node which transformes
     * @argument Stack from compile
     * @argument the code html
     * @return return the text with the value  from variable or not change the text
     */
	this.xslSort = function( xslsort, nodeSort, tabIndex){
		
		var select = xslsort.getAttribute("select");
		var tabIndex = new Array;
		var tabIndex2 = new Array;
		for(var i=0;i<nodeSort.length;i++)
		{
		  var temp = nodeSort[i].selectNodes(select);
		  tabIndex[i]= temp;
		  tabIndex2[temp]=i;
		}
		tabIndex.sort();
		var tabIndex3 = new Array;
		for(var i=0;i<tabIndex.length;i++)
		{
		  tabIndex3[tabIndex2[tabIndex[i]]] = i;
		}
		tabIndex = tabIndex3;
		
	}
	/**
     * parseChidren , threat the stack
     * 
     * @argument the xml node which will be transformed
     * @argument xsl node which transformes
     * @argument Stack from compile
     * @argument the code html
     * @return return the text with the value  from variable or not change the text
     */
	this.parseChildren = function(context, xslNode, childStack, result){
		if(!childStack){ 
		alert("stack empty");return;
		}
		if(childStack.length == 0) return;
		for(var i=0;i<childStack.length;i++){
			
			childStack[i][0].call(this, context, childStack[i][1], childStack[i][2], result);
		}
	}
	/**
     * compile xsl 
     * 
     * @argument xsl node
     * @return return the stack
     */
	this.compile = function(xslNode){
		var nodes = xslNode.childNodes;
		for(var stack=[],i=0;i<nodes.length;i++)
		{
		  var nType = nodes[i].nodeType;
		  if(nodes[i][TAGNAME] == "template")
		  {
			this.templates[nodes[i].getAttribute("match") || nodes[i].getAttribute("name")] = [nodes[i], this.compile(nodes[i])];
			//stack.push([this.p["apply-templates"], nodes[i], this.compile(nodes[i])]);
		  }
		  else if(nodes[i][TAGNAME] == "stylesheet")
		  {
			stack=this.compile(nodes[i])
		  }
		  else if(nodes[i].prefix == "xsl")
		  {
		   var func = this.p[nodes[i][TAGNAME]];
		   if(!func) alert("xsl:" + nodes[i][TAGNAME] + " is not supported at this time on this platform");
		   else stack.push([func, nodes[i], this.compile(nodes[i])]);
		  }
		  else
		  {
			if( nType != 8) //comment can not have child and useless
			{
			  stack.push([this.p["copy-clone"], nodes[i], this.compile(nodes[i])]);
			}
		  }
	    }
		return stack;
	}
	/**
     * look for a variable in html node
     * 
     * @argument text from html node
     * @return return the text with the value  from variable or not change the text
     */
  this.variable = function(string){
    if(string.indexOf('$') != -1 )
	{
	  var result = string.match(/\$(\w)*/g);
	  for(var i = 0;i<result.length;i++)
	  {
	   var aux=result[i].substring(1);
	   
	   //aux.replace(/\{|\}/,"");
	   for(p in this.paramsSet)
	   if(this.paramsSet[p][aux])
	   string = string.replace("\{"+result[i]+"\}",this.paramsSet[p][aux]);
	  }
	}
	return string;
  }
  
   /**
     * withparam function's xsl
     * 
     * @argument node xsl
     */
  this.withparams = function(nodexsl)
  {
  var nodes = nodexsl.childNodes;
  for(var i = 0;i< nodes.length;i++)
  {
   if(nodes[i][TAGNAME] == "with-param" )
   {       var name=xslNode.getAttribute("name");
          var nodeschild = nodes[i].childNodes;//refactorize it
		  var select=xslNode.getAttribute("select");
		  if(select)
		  {
		    select = this.lookforVariable(select);
		    try{
		    var nodeSelect = context.selectNodes(select)[0];
	        if(!nodeSelect) tempValue = "";
		    else if(nodeSelect.nodeType == 1) tempValue = nodeSelect.firstChild ? nodeSelect.firstChild.nodeValue : "";
		    else tempValue = typeof nodeSelect == "object" ? nodeSelect.nodeValue : nodeSelect;
		    if(typeof nodeSelect == "number") tempValue=""+nodeSelect;
		  
		  }
		  catch(e){
		  
		  }
		  }
		  else{
		  for(var i = 0; i < nodes.length;i++)
		  {
		    var temp2 = getNodeValue(nodes[i]);
		     if(temp2 != "undefined")
		     tempValue+=temp2;
		  }
		  tempValue = tempValue.replace(/\s/g,"");//maybe need to fix it
		  this.paramsSet[this.currentTemplate][name] =tempValue;
		  
   }
   }
  }
  }
   /**
     * look for a variable in xsl node
     * 
     * @argument text from xsl node
     * @return return the text with the value  from variable or not change the text
     */
  this.lookforVariable = function(string){
    if(string.indexOf('$') != -1 ){
	
	 var found = 0;
	 var result = string.match(/(=)?\$(\w*)/);
	 while(result)
	  {  
	     var aux=RegExp.$2
	     
	     for(p in this.paramsSet){
	     if(this.paramsSet[p][aux]){
	     found=1;
	     if( RegExp.$1 == "=" )
	     string = string.replace("$"+aux,"'"+this.paramsSet[p][aux]+"'");
	     else{
	     var data = this.paramsSet;
	     string = string.replace(/\$(\w*)/,function(d,match){
	     if( match == aux ) 
	     return data[p][aux];
	      else 
	      return match;
	     
	     });
	     }
         
	     }
	     }
	    if(found == 0)  string = string.replace("$"+aux,false);
	   result = string.match(/(=)?\$(\w*)/);
	  }
	}
	return string;
  }
  this.lookforTemplate = function(string){
    
    var templat =":"+string;
  for(look in this.templates){
     if(look.match(new RegExp(templat))){
     if(RegExp.rightContext == null)
     return look;
     }
     
  }
  return 0;
  }
   this.lookforTemplate2 = function(string){
   if(string == "/") return "/";
    var temp = string.replace(/\[.*\]/g, "");
     temp = temp.split("/");
     temp = temp[temp.length - 1];
        
  for(look in this.templates){
     if(look.match(new RegExp(temp))){
     if(RegExp.rightContext == null)
     return look;
     }
  }
  return 0;
  }
  
  this.importStylesheet = function(xslDoc){
    this.xslDoc = xslDoc.nodeType == 9 ? xslDoc.documentElement : xslDoc;
	this.xslStack = this.compile(xslDoc);
	this.paramsSet = new Array();
	this.paramsSet["params"] = new Array();
	//var t = this.templates["/"] ? "/" : false;
	//if(!t) for(t in this.templates) if(typeof this.templates[t] == "array") break;
	//this.xslStack.push([[this.p["apply-templates"], {getAttribute : function(n){if(n=="name") return t}}]]);
	this.xslStack.push( [this.p["apply-templates"], null]);
  }
  this.setParameter = function(nsURI, name, value){
   // make value a zero length string if null to allow clearing
   value = value ? value : "";
   this.paramsSet["params"][name] = value;
  };
    /**
     * Gets a parameter if previously set by setParameter. Returns null
     * otherwise
     * @argument name The parameter base name
     * @argument value The new parameter value
     * @return The parameter value if reviously set by setParameter, null otherwise
     */
    this.getParameter = function(nsURI, name){
        nsURI = "" + nsURI;
        if(this.paramsSet["params"][name])
        {
         return this.paramsSet[name];
        }
        else return null;
    };
    /**
     * Clear parameters (set them to default values as defined in the stylesheet itself)
     */
    this.clearParameters = function(){
        
        this.paramsSet = new Array();
        this.paramsSet["params"]= new Array();
    };
	//return nodes
	this.transformToFragment = function(doc, newDoc){
	   
	   this.xmlDoc = newDoc.nodeType != 9 ? newDoc.ownerDocument : newDoc;
	   var docfrag = this.xmlDoc.createDocumentFragment();
       this.paramsSet["global"]= new Array();
	   this.currentTemplate="global";
	   var result = this.parseChildren(doc, this.xslDoc, this.xslStack, docfrag);
	   return docfrag;
	}
	
}