

	/*	=====================================================================================

		XMLList	: multipurpose list

	========================================================================================= */

	function XMLList(parentlist){

		this.parent=parentlist; //optional

		this.list=new Array();

		this.length=0;

	}



	XMLList.prototype.add=function(obj){

		for (var i=0;i<this.list.length;i++){

			if(this.list[i]==obj) return; //don't add if exist

		}

		this.list[this.list.length]=obj;

		this.length=this.list.length;

		if((this.parent)&&(this.parent!=this)) this.parent.add(obj);

	}

	XMLList.prototype.get=function(prop,propval){

		for (var i=0;i<this.list.length;i++){

			if(this.list[i][prop]==propval) return this.list[i];

		}

		return null;

	}



	/*	=====================================================================================

		Component List, components storage for a schema

	========================================================================================= */

	function compList(schemaobj){

		this.schema=schemaobj;

		this.list=new Array();

		this.length=0;

	}

	compList.prototype.add=function(acomp){

		if(acomp.name==null) return;	//dont store unnamed type

		for (var i=0;i<this.list.length;i++){

			if(this.list[i]==acomp) return;	//don't add if exist

			//if(this.list[i]==acomp) {	//or replace existing one?

			//	this.list[i]=acomp;

			//	break;

			//}

		}

		//eventually will add component to originating schema

		this.list[this.list.length]=acomp;

		this.length=this.list.length

		if(this.schema.referer!=this.schema) this.schema.referer.components.add(acomp);

	}

	compList.prototype.union=function(cmplist){

		this.list=getUnique(this.list.concat(cmplist.list));

		this.length=this.list.length;

	}

	compList.prototype.remove=function(acomp){

		var newlist=new Array();

		for (var i=0;i<this.list.length;i++){

			if(this.list[i]!=acomp) newlist[newlist.length]=acomp;

		}

		this.list=newlist;

		this.length=this.list.length;

		if(this.schema.referer!=this.schema) this.schema.referer.components.remove(acomp);

	}

	compList.prototype.get=function(targetNS,compname){

		if(compname==null) return;

		//var thelist=this.list;

		var thelist=this.schema.referer.components.list;	//make sure we deal only with the original schema

		for (var i=0;i<thelist.length;i++){

			if((thelist[i].targetNS==targetNS)&&(thelist[i].name==compname)) {

				return thelist[i];

			}

		}

		return null;

	}

	compList.prototype.getByNamespace=function(targetNS){

		var tplist=new Array();

		for (var i=0;i<this.list.length;i++){



			if(this.list[i].targetNS==targetNS) tplist[tplist.length]=this.list[i];

		}

		return tplist;

	}

	compList.prototype.getByType=function(targetNS,typename){

		var tplist=new Array();

		for (var i=0;i<this.list.length;i++){

			if((this.list[i].targetNS==targetNS)&&(this.list[i].typeName==typename)) {

				tplist[tplist.length]=this.list[i];

			}

		}

		return tplist;

	}





	/*	=====================================================================================

		HELPER FUNCTIONS :	Miscelllaneous

	========================================================================================= */

	function getValueConstraint(node){ 

		var def=node.getAttribute('default')

		if(def!=null) return ['default', def];

		var fix=node.getAttribute('fixed')

		if(fix!=null) return ['fixed', fix];

		return null;	//absent instead of empty set;

	}

	function processEBV(schobj,node,parentatt,nodeatt,list){	//process evective block value and return appropriate sets of value

		var ebv=node.getAttribute(nodeatt);

		if((ebv==null)||(ebv=='')) ebv=schobj.node.getAttribute(parentatt);

		if((ebv==null)||(ebv=='')) return new Array();

		if (ebv=='#all') {

			return list

		}else{			//ebv is a space delim.?

			return ebv.split(' ')

		}

		return new Array();

	}

	function findAttributeUses(schobj,node){ //return array of xsAttributeUse, node is the node containing the <attribute>

		var pfx=schobj.pfx;

		var au=new Array();

		var ch=findXMLNode(node,pfx+'attribute');

		for (var i=0;i<ch.length;i++){

			var aui=xsAttributeUnmarshaller(schobj,ch[i])		//this will be attributeUse

			if(aui!=null) au[au.length]=aui;

		}

		return au;

	}

	function findGroupUses(schobj,gnode){ //return array of xsAttributeUse = union of {attUses}, gnode is the node containing the <attributeGroup>

		var pfx=schobj.pfx;

		var ga=new Array();

		var childuses=findXMLNode(gnode,pfx+'attributeGroup'); 

		for (var i=0;i<childuses.length;i++){

			var ag=resolveComp(schobj,childuses[i],'ref');

			if(ag==null) continue;

			for(var k=0;k<ag.attUses.length;k++){

				var agau=ag.attUses[k];

				if(agau!=null) ga[ga.length]=agau;

			}

		}

		return ga;

	}

	function findRestrictingUses(schobj,node,sc){	//sc is a xsComplexType; node is the <restriction> in that complexType

		var pfx= schobj.pfx;

		var a  = new Array();

		for(var i=0;i<sc.baseTypeDef.attUses.length;i++){

			var ause=sc.baseTypeDef.attUses[i];

			var audname = ause.attDecl.name;

			var audtns  = ause.attDecl.targetNS;

			var include=true;

			for(var j=0;j<sc.attUses.length;j++){		//clause 3.1

				var euse=sc.attUses[j];

				if((audname==euse.attDecl.name)&&(audtns==euse.attDecl.targetNS)) {

					include=false;

					break;

				}

			}

			if(include){

				var as=findXMLNode(node,pfx+"attribute[@use='prohibited']");		//clause 3.2

				for (var j=0;j<as.length;j++){

					var attdecl=xsAttributeUnmarshaller(schobj,as[j]);

					if( (audname==attdecl.name)&&(audtns==attdecl.targetNS) ){

						include=false;

						break;

					}

				}

			}

			if(include) a[a.length]=sc.baseTypeDef.attUses[i];

		}

		return a;

	}





	function hasAncestor(schobj,node,ancname){

		var curnode=node;

		while(curnode!=schobj.node){

			if(curnode.parentNode==null) return curnode;

			if(curnode.parentNode.nodeName==ancname) return curnode.parentNode;

			curnode=curnode.parentNode

		}

		return null;

	}







//==========================================================================================

	var oldnn={nod:null,nsn:null,pfx:''};

	var oldpref={nod:null,nsn:null,pfx:''};

	function getNamespaceName(schnode,prefix){

		if(schnode==null) return null;

		if((oldnn.nod==schnode)&&(oldnn.pfx==prefix)) return oldnn.nsn;

		oldnn.nod=schnode;

		oldnn.pfx=prefix;

		for(var i=0;i<schnode.attributes.length;i++){

			if(schnode.attributes[i].nodeName==prefix){

				oldnn.nsn=schnode.attributes[i].nodeValue;

				break;

			}

		}

		return oldnn.nsn;

	}

	function getPrefix(schnode,namespacename){

		if(schnode==null) return '';

		if((oldpref.nod==schnode)&&(oldpref.nsn==namespacename)) return oldpref.pfx;

		oldpref.nod=schnode;

		oldpref.nsn=namespacename;

		for(var i=0;i<schnode.attributes.length;i++){

			if(schnode.attributes[i].nodeValue==namespacename){

				var nsatt=schnode.attributes[i].nodeName;

				var px = extractPart(nsatt);

				if (px==nsatt) {	//xmlns

					oldpref.pfx='';

					break; 

				}

				oldpref.pfx = (px!='')? px+':' : px ;

				break;

			}

		}

		return oldpref.pfx;

	}



	function extractPrefix(str){	//return either empty string or prefix

		if((str==null)||(str=='')) return '';

		//var a = new RegExp('.*(?=:)');

		//str.replace(a,'')

		//return RegExp.lastMatch;

		var colonpos=str.indexOf(':');

		var pfx=str.substring(0,colonpos)

		return pfx

	}

	function extractPart(str){	//return either original string or ns part

		if((str==null)||(str=='')) return '';

		var a = new RegExp('.*?:');

		return str.replace(a,'');

	}



	function unionArray(arrs){	//arrs=array of array; return array including duplicated value

		var uarr=new Array();

		for (var i=0;i<arrs.length;i++){

			if (arrs[i]==null) continue

			for (var j=0;j<arrs[i].length;j++){

				uarr[uarr.length]=arrs[i][j]

			}

		}

		return uarr;

	}





function cloneObject(fromObj){

	if(!fromObj) return;

	var newObj=new Object();

	for(var props in fromObj){

		newObj[props]=fromObj[props];

	}

}





function getUnique(anarray){

	var uarray = new Array();

	for (var i=0;i<anarray.length;i++){

		if(inExist(uarray,anarray[i])){

			uarray[uarray.length]=anarray[i];

		}

	}

	return uarray;

}

function inExist(uarray,thevalue){

	var notexists=true; 

	for(var i=0;i<uarray.length;i++){

		if (uarray[i]==thevalue) notexists = false; 

	}; 

	return notexists;

}

function getDuplicate(anarray){

	var uarray = new Array();

	for (var i=0;i<anarray.length;i++){

		if(inExist(uarray,anarray[i]) == false){

			uarray[uarray.length]=anarray[i];

		}

	}

	return getUnique(uarray);

}





