

/*========================================================================================

	BEWARE : Veeeeery SLOOOOW

	return array of [object element] or [object attrib]

	thecontext 	: starting node

	nodepath		: xpath like syntax; 

	limitation	: no reverse axis, one predicate per axis;no position; no built in functions

						a predicate should only contains expression that can be evaluated in js

	some examples that works :

	"complexType"								=> any complexType child

	"complexType//*"							=> any node with complexType as ancestor

	"complexType|simpleType//restriction"	=> any restriction with complexType OR simpleType as ancestor

	"complexType[sequence]|simpleType[sequence]"	=> any complexType OR simpleType child which has sequence as child

	"*[@name]"									=> any child node with non null name attribute

	"complexType[@minOccurs>=2]"			=> any complexType child with 'minOccurs' attribute value greater or equal 2

	"complexType[@*='linearRing']"		=> any complexType child with at least one attribute value equal 'linearRing'

	"@*" 											=> any attribute of the current context

	"complexType/@type"						=> all 'type' attribute of any complexType child

===========================================================================================*/

var totalxp=0;

var totalcall=0;



var patharray;

var contexts;



function findXMLNode(thecontext,nodepath){

totalcall+=1;

var dt = new Date();var m1 = dt.getMinutes();var s1 = dt.getSeconds();

	if(thecontext==null) return new Array();

	//no special treatment needed, find the easy way

	if( (nodepath.indexOf('/')<0)&&(nodepath.indexOf('[')<0)&&(nodepath.indexOf('*')<0)) return quickPath(thecontext,nodepath);

	contexts=[thecontext];

	patharray = new Array();

	parsePath(nodepath);

	var what='child';

	axarray= new Array();

	for (var i=patharray.length-1;i>=0;i--){

		var ax=parseOr(patharray[i]);

		if((ax.length==0)||(ax==" ")) {

			what='descendant';

		}else{

			var axt = new Array(ax.length);

			for (var j=0;j<ax.length;j++){

				axt[j]=new Axis(dropAttrib(ax[j])+"",parseAttrib(ax[j]),what)

			}

			axarray[axarray.length]=axt;

			what='child';

		}

	}

	for (var i=0;i<axarray.length;i++){

		//alert(axarray[i][0].name+"\n"+axarray[i][0].role+"\n"+"name : "+axarray[i][0].att.name+"\n"+"op : "+axarray[i][0].att.op+"\n"+"attval : "+axarray[i][0].att.value)

		switch (axarray[i][0].role){

			case 'child' :

				findChilds(axarray[i]);

				break;

			case 'descendant' :

				findDescendants(axarray[i]);

				break;

			case 'attribute' :

				findAttribute(axarray[i]);

				break;

			default :

				break;

		}

	}

var dt2 = new Date(); var m2 = dt2.getMinutes(); var s2 = dt2.getSeconds();

totalxp+=(60*(m2 - m1)+(s2-s1));

	return contexts;

}



function quickPath(thecontext,nodepath){

	var res=new Array();

	var abc=[nodepath];

	if(nodepath.indexOf('|')) abc=nodepath.split('|');

	var cs=thecontext.childNodes;

	for (var i=0;i<cs.length;i++){

		var c=cs.item(i);

		if(c.nodeName=='#text') continue;

		for (var j=0;j<abc.length;j++){

			if(c.nodeName==abc[j]) res[res.length]=c;

		}

	}

	return res;

}





/*

function to hold  properties of an axis

TO DO : accomodate multiple predicate

*/

function Axis(elname,att,what){

	this.role=what;

	if(elname.indexOf("@")>=0)	{

		this.role='attribute';

		elname=elname.substring(elname.indexOf("@")+1,elname.length)

	}

	this.name=elname;

	this.att = att;

}



function att(attname,attop,attval,atttype){

	this.name=attname+"";

	this.op=attop;

	this.value=attval;

	this.type=atttype;

}



//Convert xpath syntax to array of steps

function parsePath(thepath){

	var res = thepath.replace(new RegExp("/.*?","g"),'');

	if(res!=thepath){	

		patharray[patharray.length]=RegExp.rightContext;

		var newpath = RegExp.leftContext

		//workaround for : regexp in batik and win script behave differently when dealing with "//"

		if(RegExp.leftContext.lastIndexOf("/")==RegExp.leftContext.length-1)	{

			newpath = RegExp.leftContext+" ";

		}

		parsePath(newpath);

	}else{

		patharray[patharray.length]=thepath;

	}

}

function parseOr(txt){

	if(txt=='') return new Array();

	if(txt.indexOf("|")<0){

		return [txt];

	}else{

		return txt.split("|");

	}

}

function parseAttrib(txt){

	var nname = txt.replace(new RegExp("\\[.*?\\]","g"),'');

	var elattp = RegExp.lastMatch;

	var attname=''

	if(RegExp.lastMatch.indexOf("@")>=0){

		var elname = txt.replace(new RegExp("(?=@).*?(?=(<|>|!|=|\\s+|])=?)","g"),'');

		if(nname!=txt) attname= RegExp.lastMatch.substring(1,RegExp.lastMatch.length);

		var atttype='attribute';

	}else{

		var elname = txt.replace(new RegExp("(?=\\[).*?(?=(<|>|!|=|\\s+|])=?)","g"),'');

		if(nname!=txt) attname= RegExp.lastMatch.substring(1,RegExp.lastMatch.length);

		var atttype='childvalue';

	}

	var elname = txt.replace(new RegExp("(<|>|!|=)=?","g"),'');

	var attop =(elname!=txt)?RegExp.lastMatch:"";

	var elname= txt.replace(new RegExp("(?=((<|>|!|=)=?)).*?(?=(]|\\s+))","g"),'');

	var attval=(elname!=txt)?dropOperator(RegExp.lastMatch):"";

	return new att(attname,attop,attval,atttype);

}

function dropAttrib(txt){

	return txt.replace(new RegExp("\\[.*?\\]","g"),'');

}

function dropOperator(txt){

	return txt.replace(new RegExp("(<|>|!|=)=?","g"),'');

}

function dropNS(nodename){

	if (nodename==null) return null

	var colonpos=nodename.indexOf(":");

	return nodename.substring(colonpos+1,nodename.length)

}



//TO DO : must also construct findParent for reverse axis

function findChilds(axes){

	var newctx=new Array();

	if (contexts==null) return null;

	for (var c=0;c<contexts.length;c++){

		if(contexts[c]==null) continue;

		var cnodes = contexts[c].childNodes;

		//var cnodes = contexts[c].getChildNodes()

//FIND OUT : why contexts[c].getChildNodes() occasionaly = null ??

		if(cnodes==null) continue;

		for (var i=0;i<cnodes.length;i++){

			for(var j=0;j<axes.length;j++){

				if(cnodes.item(i).nodeType==8) continue;	//comments node

				if((axes[j].name==cnodes.item(i).nodeName)||(axes[j].name=='*')){

					if(processAxis(axes[j],cnodes.item(i))!=null){

						newctx[newctx.length]=processAxis(axes[j],cnodes.item(i))

					}

				}

			}

		}

	}

	contexts=new Array();

	contexts=getUnique(newctx);

}



//TO DO : must also construct findAncestor for reverse axis

function findDescendants(axes){

	var newctx=new Array();

	if (contexts==null) return null;

	for (var c=0;c<contexts.length;c++){

		if (contexts[c]==null) continue;

		for(var j=0;j<axes.length;j++){

			var cnodes = contexts[c].getElementsByTagName(axes[j].name);

			if(cnodes.item(i).nodeType==8) continue;	//comments node

			for (var i=0;i<cnodes.length;i++){

				if(processAxis(axes[j],cnodes.item(i))!=null){

					newctx[newctx.length]=processAxis(axes[j],cnodes.item(i))

				}

			}

		}

	}

	contexts=new Array();

	contexts=getUnique(newctx);

}

function findAttribute(axes){

	var newctx=new Array();

	if (contexts==null) return null;

	for (var c=0;c<contexts.length;c++){

		for(var j=0;j<axes.length;j++){

			for (var a=0;contexts[c].attributes!=null && a<contexts[c].attributes.length;a++){

				if((axes[j].name==contexts[c].attributes.item(a).nodeName)||(axes[j].name=='*')){

					newctx[newctx.length]=contexts[c].attributes.item(a);

				}

			}

		}

	}

	contexts=new Array();

	contexts=getUnique(newctx);

}

function processAxis(anAxis,currNode){

	if(currNode.nodeName=="#text") return null;

	if(anAxis.att.name==''){

		return currNode;

	}else{

		if(anAxis.att.type=='attribute'){

			for (var k=0;k<currNode.attributes.length;k++){

				var rv=processAttrib(anAxis,currNode,currNode.attributes.item(k),currNode.attributes.item(k).nodeValue);

				if(rv!=null) return rv;

			}

		}else{

			//var cns = currNode.getChildNodes();	//sometimes failed

			var cns = currNode.childNodes;

			for (var k=0;k<cns.length;k++){

				if(cns.item(k).nodeName=="#text") continue;

				var ndval='';

				if(cns.item(k).firstChild!=null) ndval=cns.item(k).firstChild.nodeValue

				rv = processAttrib(anAxis,currNode,cns.item(k),ndval);

				if(rv!=null) return rv;

			}

		}

		return null;

	}

}

function processAttrib(anAxis,currNode,ca,caval){

	//if(currNode.nodeName=="#text") return null;

	if(ca.nodeName==anAxis.att.name){

		switch(anAxis.att.op){

			case "=":

				if(caval==eval(anAxis.att.value)) return currNode;

				break;

			case "":

				return currNode;

			default:

				var ev = eval(caval+anAxis.att.op+eval(anAxis.att.value));

				if(ev) return currNode;

				break;

		}

	}

	return null;

}





