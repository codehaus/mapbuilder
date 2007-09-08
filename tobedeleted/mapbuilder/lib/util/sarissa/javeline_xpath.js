/********* IE XPath Object ************************************************
	Workaround for the lack of having an XPath parser on safari
	It works on Safari's document and XMLDocument object.
	
	It doesn't support the full XPath spec, but just enought for
	the skinning engine which needs XPath on the HTML document.
	
	Supports:
	- Compilation of xpath statements
	- Caching of XPath statements
****************************************************************************/
//Set up the $ method
IS_SAFARI = navigator.userAgent.toLowerCase().indexOf("safari") != -1 || navigator.userAgent.toLowerCase().indexOf("konqueror") != -1;
IS_SAFARI_OLD = IS_SAFARI && parseInt((navigator.userAgent.match(/AppleWebKit\/(\d+)/)||{})[1]) < 420;
IS_GECKO = document.implementation && document.implementation.createDocument && true;
IS_OPERA = navigator.userAgent.toLowerCase().indexOf("opera") != -1;
IS_IE = document.all && !IS_OPERA;
IS_NEW_SAFARI = IS_SAFARI && navigator.userAgent.toLowerCase().indexOf("version/3") != -1;
//This breaks for(x in o) loops in the old Safari
if(IS_SAFARI_OLD && !IS_NEW_SAFARI){
	HTMLHtmlElement = document.createElement("html").constructor;
	Node = HTMLElement = {};
	HTMLElement.prototype = HTMLHtmlElement.__proto__.__proto__;
	HTMLDocument = Document = document.constructor;
	var x = new DOMParser();
	XMLDocument = x.constructor;
	Element = x.parseFromString("<Single />", "text/xml").documentElement.constructor;
	x = null;
}

TAGNAME = IS_IE ? "baseName" : "localName";
var _$ = function(tag, doc, prefix, force){
	return (doc || document).getElementsByTagName(tag);
}
if(IS_SAFARI){
XPath = {
	cache : {},
	
	getChildNode : function(htmlNode, tagName, info, count, num, sResult){
		var numfound = 0, result = null, data = info[count];
		if( tagName != null)
		if(tagName.indexOf(':') > 0)
        tagName = tagName.split(':')[1];
		var nodes = htmlNode.childNodes;
		if(!nodes) return; //Weird bug in Safari
		for(var i=0;i<nodes.length;i++){
			if(tagName && (nodes[i].style ? nodes[i].tagName.toLowerCase() : nodes[i].tagName) != tagName) continue;// || numsearch && ++numfound != numsearch

			if(data) data[0](nodes[i], data[1], info, count+1, numfound++ , sResult);
			else sResult.push(nodes[i]);
		}
		
		//commented out :  && (!numsearch || numsearch == numfound)
	},
	
	doQuery : function(htmlNode, qData, info, count, num, sResult){
		var result = null, data = info[count];
		var query = qData[0];
		var returnResult = qData[1];
		try
		{
		var qResult = eval(query);
		}catch(e){
		alert("eror :"+e+" in query : "+query);
		return;}
		
		if(returnResult) return sResult.push(qResult);
		if( qResult == null || qResult == "undefined" || qResult == "" ) return;
		
		if(data) data[0](htmlNode, data[1], info, count+1, 0, sResult);
		else sResult.push(htmlNode);
	},
	
	getTextNode : function(htmlNode, empty, info, count, num, sResult){
		var result = null, data = info[count];
      
		var nodes = htmlNode.childNodes;
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].nodeType != 3 && nodes[i].nodeType != 4) continue;
			
			if(data) data[0](nodes[i], data[1], info, count+1, i, sResult);
			else sResult.push(nodes[i]);
		}
	},
	
	getAnyNode : function(htmlNode, empty, info, count, num, sResult){
		var result = null, data = info[count];
		var sel = [], nodes = htmlNode.childNodes;
		for(var i=0;i<nodes.length;i++){
			if(data) data[0](nodes[i], data[1], info, count+1, i, sResult);
			else sResult.push(nodes[i]);
		}
	},
	
	getAttributeNode : function(htmlNode, attrName, info, count, num, sResult){
		if(!htmlNode || htmlNode.nodeType != 1) return;
		var result = null, data = info[count];
		var value = htmlNode.getAttributeNode(attrName);//htmlNode.attributes[attrName];//

		if(data) data[0](value, data[1], info, count+1, 0, sResult);
		else if(value) sResult.push(value);
	},
	
	getAllNodes : function(htmlNode, x, info, count, num, sResult){
		var result = null, data = info[count];
		
		var tagName = x[0];
		if( tagName != null)
		if(tagName.indexOf(':') > 0)
        tagName = tagName.split(':')[1];
		
		var inclSelf = x[1];
		var prefix = x[2];
        
		if(inclSelf && (htmlNode.tagName == tagName || tagName == "*")){
			if(data) data[0](htmlNode, data[1], info, count+1, 0, sResult);
			else sResult.push(htmlNode);
		}

		var nodes = _$(tagName, htmlNode, tagName==prefix?"":prefix);//htmlNode.getElementsByTagName(tagName);
		for(var i=0;i<nodes.length;i++){
			if(data) data[0](nodes[i], data[1], info, count+1, i, sResult);
			else sResult.push(nodes[i]);
		}
	},
	
	getParentNode : function(htmlNode, empty, info, count, num, sResult){
		var result = null, data = info[count];
		var node = htmlNode.parentNode;
		if(data) data[0](node, data[1], info, count+1, 0, sResult);
		else if(node) sResult.push(node);
	},
	
	getPrecedingSibling : function(htmlNode, tagName, info, count, num, sResult){
	if(tagName =="*") tagName = htmlNode.tagName;
		var result = null, data = info[count];
		var node = htmlNode.previousSibling;
		while(node){
			if(tagName != "node()" && node.tagName != tagName){
				continue;
			}
			if(node){
				sResult.push(node);
			}
			node = node.previousSibling;
		}
	},
	
	//flwsiblg[3] might not be conform spec
	getFollowingSibling : function(htmlNode, tagName, info, count, num, sResult){
		var result = null, data = info[count];
		if(tagName =="*") tagName = htmlNode.tagName;
		var node = htmlNode.nextSibling;
		while(node){
			if( tagName != "NODE()" && node.tagName != tagName){
				continue;
			}
			if(node != null){
				sResult.push(node);
			}
			node = node.previousSibling;
		}
	},
	
	getPreceding: function(htmlNode, tagName, info, count, num, sResult){
	if(tagName =="*") tagName = htmlNode.tagName;
		var result = null, data = info[count];
		var parent = htmlNode.parentNode;
		var node = htmlNode.previousSibling;
		while(node){
			if(node.parentNode != parent && tagName != "NODE()" && node.tagName != tagName){
				node = node.previousSibling;
				continue;
			}
			if(node){
			 
				sResult.push(node);
				node = node.previousSibling;
				
			}
		}
	},
	
	
	getFollowing : function(htmlNode, tagName, info, count, num, sResult){
	if(tagName =="*") tagName = htmlNode.tagName;
		var result = null, data = info[count];
		var parent = htmlNode.parentNode;
		var node = htmlNode.nextSibling;
		while(node){
			if(node.parentNode != parent && tagName != "NODE()" && node.tagName != tagName){
				node = node.nextSibling;
				continue;
			}
			 if(node){
				sResult.push(node);
				node = node.nextSibling;
			}
		}
	},
	
	multiXpaths : function(contextNode, list, info, count, num, sResult){
		for(var i=list.length;i>0;i--){
			var info = list[i][0];
			var rootNode = (info[3] ? contextNode.ownerDocument.documentElement : contextNode);//document.body
			info[0](rootNode, info[1], list[i], 1, 0, sResult);
		}
		
		sResult.makeUnique();
		
	},
	
	compile : function(sExpr){
	    
	    //
	    
		sExpr = sExpr.replace(/\[(\d+)\]/g, "/##$1");
		sExpr = sExpr.replace(/\|\|(\d+)\|\|\d+/g, "##$1");
		sExpr = sExpr.replace(/\.\|\|\d+/g, ".");
		sExpr = sExpr.replace(/\[([^\]]*)\]/g, "/##$1#");
        
		if(sExpr == "/" || sExpr == ".") return sExpr;
		
		//Mark // elements
		//sExpr = sExpr.replace(/\/\//g, "/[]/self::");
		sExpr = sExpr.replace(/\/\//g, "descendant::");
		
		//Check if this is an absolute query
		
		return this.processXpath(sExpr);
	},
	
	processXpath : function(sExpr){
		var results = new Array();
		sExpr = sExpr.replace(/('[^']*)\|([^']*')/g, "$1_@_$2");
		sExpr = sExpr.split("|");
		for(var i=0;i<sExpr.length;i++) sExpr[i] = sExpr[i].replace(/('[^']*)\_\@\_([^']*')/g, "$1|$2");
		
		if(sExpr.length == 1) sExpr = sExpr[0];
		else{
			for(var i=0;i<sExpr.length;i++) sExpr[i] = this.processXpath(sExpr[i]);
			results.push([this.multiXpaths, sExpr]);
			return results;
		}
		//check if the expression is complexe
		
		if(sExpr.match(/\(/)){
		
		   //sExpr = sExpr.replace(/\#\#(.*)/g, "\[$1\]");
		 
		   results.push([this.doQuery, [this.compileQuery(sExpr), true]]);
		   return results;
		}
		
		
		
		var isAbsolute = sExpr.match(/^\/[^\/]/);
		var sections = sExpr.split("/");
		
		for(var i=0;i<sections.length;i++){
			if(sections[i] == "." || sections[i] == "") continue;
			else if(sections[i].match(/^[\w-_\.]+(?:\:[\w-_\.]+){0,1}$/)) results.push([this.getChildNode, sections[i]]);//.toUpperCase()
			else if(sections[i].match(/^\#\#(\d+)$/)) results.push([this.doQuery, ["num+1 == " + parseInt(RegExp.$1)]]);
			else if(sections[i].match(/^\#\#(.*)$/)){
				
				//FIX THIS CODE
				var query = RegExp.$1;
				var m = [query.match(/\(/g), query.match(/\)/g)];
				if(m[0] || m[1]){
					while(!m[0] && m[1] || m[0] && !m[1] || m[0].length != m[1].length){
						if(!sections[++i]) break;
						query += sections[i];
					}
					
				}
				else{
				   i++;
					while(sections[i]){
					   
					     
					    if(!sections[i]) break;
						if(sections[i-1].match(/.*\#$/) ) 
					    {
					    break;
					    }
						query +="/"+sections[i];
						i++;
						 
					}
					
				}
				query = query.replace(/\#/,"");
				results.push([this.doQuery, [this.compileQuery(query)]]);
			}
			else if(sections[i] == "*") results.push([this.getChildNode, null]); //FIX - put in def function
			else if(sections[i].substr(0,2) == "[]") results.push([this.getAllNodes, ["*", false]]);//sections[i].substr(2) || 
			else if(sections[i].match(/::/)){
			 if(sections[i].match(/descendant-or-self::node\(\)$/)) results.push([this.getAllNodes, ["*", true]]);
			else if(sections[i].match(/descendant-or-self::([^\:]*)(?:\:(.*)){0,1}$/)) results.push([this.getAllNodes, [RegExp.$2 || RegExp.$1, true, RegExp.$1]]);
			else if(sections[i].match(/descendant::([^\:]*)(?:\:(.*)){0,1}$/)) results.push([this.getAllNodes, [RegExp.$2 || RegExp.$1, false, RegExp.$1]]);
			else if(sections[i].match(/following-sibling::(.*)$/)) results.push([this.getFollowingSibling, RegExp.$1.toUpperCase()]);
			else if(sections[i].match(/preceding-sibling::(.*)$/)) results.push([this.getPrecedingSibling, RegExp.$1.toUpperCase()]);
			else if(sections[i].match(/following::(.*)$/)) results.push([this.getFollowing, RegExp.$1.toUpperCase()]);
			else if(sections[i].match(/preceding::(.*)$/)) results.push([this.getPreceding, RegExp.$1.toUpperCase()]);
			else if(sections[i].match(/self::(.*)$/)) results.push([this.doQuery, ["XPath.doXpathFunc('local-name', htmlNode) == '" + RegExp.$1 + "'"]]);}else if(sections[i].match(/^\@(.*)$/)) results.push([this.getAttributeNode, RegExp.$1]);
			else if(sections[i] == "text()") results.push([this.getTextNode, null]);
			else if(sections[i] == "node()") results.push([this.getAnyNode, null]);//FIX - put in def function
			else if(sections[i] == "..") results.push([this.getParentNode, null]);
			else{
				var query = sections[i];
			
				//FIX THIS CODE
				//add some checking here
				var m = [query.match(/\(/g), query.match(/\)/g)];
				if(m[0] || m[1]){
					while(!m[0] && m[1] || m[0] && !m[1] || m[0].length != m[1].length){
						if(!sections[++i]) break;
						query += "/" + sections[i];
						m = [query.match(/\(/g), query.match(/\)/g)];
					}
				}
               
				results.push([this.doQuery, [this.compileQuery(query), true]])
			
				//throw new Error(1503, "---- Javeline Error ----\nMessage : Could not match XPath statement: '" + sections[i] + "' in '" + sExpr + "'");
			}
		}

		results[0][3] = isAbsolute;
		return results;
	},
	
	compileQuery : function(code){
		var c = new CodeCompilation(code);
		var test = c.compile();
		return test;
	},
	
	doXpathFunc : function(type, arg1, arg2, arg3){
	 
		switch(type){
			case "not":if((arg1 == null) || (arg1 == true)) return false; else return true;
			case "position": return parseInt(arg1);
			case "position()":  return num;
			case "format-number": return new String(Math.round(parseFloat(arg1)*100)/100).replace(/(\.\d?\d?)$/, function(m1){return m1.pad(3, "0", PAD_RIGHT)});; //this should actually do something
			case "floor": return Math.floor(arg1);
			case "ceiling": return Math.ceil(arg1);
			case "starts-with": return arg1 ? arg1.substr(0, arg2.length) == arg2 : false;
			case "string-length": return arg1 ? arg1.length : 0;
			case "count": return arg1 ? parseInt(arg1.length) : 0;
			case "last": return arg1 ? arg1[arg1.length-1] : null;
			case "local-name": return arg1 ? arg1.tagName : "";//[TAGNAME]
			case "substring": return arg1 && arg2 ? arg1.substring(arg2, arg3 || 0) : "";
			case "contains": return arg1 && arg2 ? arg1.indexOf(arg2) > -1 : false;
			case "concat": 
				for(var str="",i=1;i<arguments.length;i++){
					if(typeof arguments[i] == "object"){
						str += getNodeValue(arguments[i][0]);
						continue;
					}
					str += arguments[i];
				}
			return str;
		}
	},
	
	selectNodeExtended : function(sExpr, contextNode){
		var sResult = this.selectNodes(sExpr, contextNode);
		//	if(sResult.length == 0) return null;
	if(sResult.length == 1  ){
		sResult = sResult[0];
	   return getNodeValue(sResult);
	     }
		
		return sResult;
	},
	
	selectNodes : function(sExpr, contextNode){
         //sExpr = sExpr.replace(/\s/g,"");//delete space
	   
	     
	     
	    
		if(!this.cache[sExpr]) this.cache[sExpr] = this.compile(sExpr);
		 
		if(typeof this.cache[sExpr] == "string"){
			if(this.cache[sExpr] == ".") return [contextNode];
			if(this.cache[sExpr] == "/") return [contextNode.nodeType == 9 ? contextNode : contextNode.ownerDocument.documentElement];
		}
		
		var info = this.cache[sExpr][0];
		var rootNode = (info[3] && !contextNode.nodeType == 9 ? contextNode.ownerDocument.documentElement : contextNode);//document.body
		var sResult = [];
		 var y = new XMLSerializer()
	     
	    
		info[0](rootNode, info[1], this.cache[sExpr], 1, 0, sResult);
		
		if(sResult == "")
		if(sExpr.indexOf(/\/\//)){
		 
	     while(rootNode.parentNode)if(rootNode)rootNode = rootNode.parentNode;
	     info[0](rootNode, info[1], this.cache[sExpr], 1, 0, sResult);
	     }
	
		return sResult;
	}
}

function getNodeValue(sResult){
	if(sResult.nodeType == 1) return sResult.firstChild ? sResult.firstChild.nodeValue : "";
	if(sResult.nodeType > 1 || sResult.nodeType < 5) return sResult.nodeValue;
	return sResult;
}

function CodeCompilation(code){
	this.data = {
		F : [],
		S : [],
		I : [],
		X : [],
		P : []
	};
	
	this.compile = function(){
		
		code = code.replace(/ or /g, " || ");
		code = code.replace(/ and /g, " && ");
		code = code.replace(/!=/g, "{}");
		code = code.replace(/ mod /g, "%");
		code = code.replace(/=/g, "==");
		code = code.replace(/====/g, "==");
		code = code.replace(/\{\}/g, "!=");
		// Tokenize
		this.tokenize();
		// Insert
		this.insert();
       return code;
	}
	
	this.tokenize = function(){
	    //param
	    	
	    var data = this.data.P;
		code = code.replace(/\((.*\#\#.*[^)])/g, function(d, match){return "("+(data.push(match) - 1) + "P_";});
		//Functions
		var data = this.data.F;
		code = code.replace(/(format-number|contains|substring|local-name|last|node|position|round|starts-with|string|string-length|sum|floor|ceiling|concat|count|not)\s*\(/g, function(d, match){return (data.push(match) - 1) + "F_";});
      
		//Strings
		var data = this.data.S;
		code = code.replace(/'([^']*)'/g, function(d, match){return (data.push(match) - 1) + "S_";});
		code = code.replace(/"([^"]*)"/g, function(d, match){return (data.push(match) - 1) + "S_";});
       
		//Xpath
		var data = this.data.X;
		code = code.replace(/(^|\W|\_)([\@\.\/A-Za-z][\.\@\/\w:-]*(?:\(\)){0,1})/g, function(d, m1, m2){return m1 + (data.push(m2) - 1) + "X_";});
		code = code.replace(/(\.[\.\@\/\w]*)/g, function(d, m1, m2){return (data.push(m1) - 1) + "X_";});
		//Ints
		var data = this.data.I; 
		code = code.replace(/(\d+)(\W)/g, function(d, m1, m2){return (data.push(m1) - 1) + "I_" + m2;});
	
		
	}
	
	this.insert = function(){
		var data = this.data;
		var flagFunction=0;
		code = code.replace(/(\d+)([FISXP])_/g, function(d, nr, type){
			var value = data[type][nr];
			
			if(type == "F"){
			    flagFunction++;
				var test = "XPath.doXpathFunc('" + value + "', ";
				if(value == "position") 
				test+="XPath.selectNodes('count(preceding::'+htmlNode.tagName+')', htmlNode)";//because poition  has not argument
				return test;
			}
			else if(type == "S"){
				return "'" + value + "'";	
			}
			else if(type == "I"){
				return value;
			}
			else if(type == "X"){ if(code.indexOf("X") > code.indexOf(")")) flagFunction=0;//check if it works
			    if(flagFunction > 0 )
			    return "XPath.selectNodes('" + value.replace(/'/g, "\\'") + "', htmlNode)";
			    else
				return "XPath.selectNodeExtended('" + value.replace(/'/g, "\\'") + "', htmlNode)";
			}
			else if(type == "P"){
			 return "XPath.selectNodes('" + value.replace(/'/g, "\\'") + " ', htmlNode)";
			}
			
		});
		
	}
}
}
if(IS_SAFARI ){
	HTMLDocument.prototype.selectNodes = 
	Element.prototype.selectNodes = 
	XMLDocument.prototype.selectNodes = function(sExpr, contextNode){
		return XPath.selectNodes(sExpr, contextNode || this);
	}
	HTMLDocument.prototype.selectSingleNode = 
	Element.prototype.selectSingleNode = 
	XMLDocument.prototype.selectSingleNode = function(sExpr, contextNode){
		return XPath.selectNodes(sExpr, contextNode || this)[0]; // This could be optimized in the XPath object
	}
}