xsElementDecl.prototype.bind=function(node){

	if(node==null) alert(this.name+' is null');

	if(this.typeDef.typeName=='simpleType'){

		var ed = this.typeDef.bind();

		ed.name= this.name;

		ed.type= this.typeDef;

		var val = (node.firstChild!=null)? node.firstChild.nodeValue : null;

		if(val) {

			ed.isSet=true;

			ed.setValue(val);

		}

		if(this.valueConstraint!=null){

			ed.fixed=(this.valueConstraint[0]=='fixed')?true:false;

			ed.defaultValue=this.valueConstraint[1];

			ed.setValue(ed.defaultValue);

			ed.isSet=true;

		}

	}else{

		var ed = this.typeDef.bind(node);

		if(this.name) ed.name= this.name;

		ed.type= this.typeDef;

	}

	if(this.subsitutionGroupAffiliation) ed.subs=this.substitutionGroupAffiliation.subs;

	return ed;

}



xsAttributeUse.prototype.bind=function(node,info){

	var att  = new jsAttribute();

	var val=''

	if(node!=null) {

		var val = node.getAttribute(this.name);

	}

	if(val) att.isSet=true;

	att.name = this.attDecl.name;

	att.type = this.attDecl.typeDef;

	att.required = this.required

	att.setValue(val);

	if(this.valueConstraint!=null){

		att.fixed=(this.valueConstraint[0]=='fixed')? true:false;

		att.defaultValue=this.valueConstraint[1];

		att.setValue(att.defaultValue);

		att.isSet=true;

	}

	return att;

}

xsWildcard.prototype.bind=function(node){

	var pr  = new jsProperty();

	var val = (node.firstChild!=null)? node.firstChild.nodeValue : null;

	if(val) pr.isSet = true;

	pr.setValue(val);

	pr.name = 'any';

	pr.type = this;

	return pr;

}

xsSimpleType.prototype.bind=function(){

	var enums=this.facets.getEnum();

	if(enums.length>0) {

		var je=new jsEnumeration();

		je.type=this.baseTypeDef;

		for (var i=0;i<enums.length;i++){

			var val=enums[i].value;

			je.values[i]=val;

		}

		return je;

	}else{

		var jp=new jsProperty();

		return jp;

	}

}

xsComplexType.prototype.bind=function(node){

	var obj=new jsComplexProperty();

	obj.name=this.name

	obj.type=this.baseTypeDef

	if(node!=null) {

		if(node==node.ownerDocument.documentElement){

			obj.minOccurs=1;

			obj.maxOccurs=1;

		}

	}

	for(var i=0;i<this.attUses.length;i++){

		var att = this.attUses[i].bind(node,this.name);

		obj.attributes.push(att);

	}

	if(this.contentType=='empty'){

	}else if(this.contentType.typeName=='simpleType'){

		var p  = this.contentType.bind();

		var val = (node.firstChild!=null)? node.firstChild.nodeValue : null;

		if(val) p.isSet = true;

		p.setValue(val);

		p.name='value'

		p.minOccurs=1;

		p.maxOccurs=1;

		p.type=this.baseTypeDef;

		obj.properties.push(p);

	}else{

		var prtc = this.contentType[1];	//particle

		var ps = prtc.bind(node);			//zero or more properties according to minmaxoccurs

		obj.properties=obj.properties.concat(ps);

	}

	return obj;

}



//must check if minOccurs <= props <= maxOccurs;

xsParticle.prototype.bind=function(node,info){

	var ps=new Array();

	var t=this.term;

	if(t.typeName=='elementDecl'){

		var allsubs=t.subs

		var chld = node.childNodes;

		for(var i=0;i<chld.length;i++){

			chld.item(i).setAttribute('isBound','false');

		}

		if(t.substitutionGroupAffiliation) allsubs=t.substitutionGroupAffiliation.subs;

		for(var j=0;j<allsubs.list.length;j++){

			var si = allsubs.list[j];

			if(si.abstract==true) continue;

			var pfx = getPrefix(node.ownerDocument.documentElement,si.targetNS);

			var chld = findXMLNode(node,pfx+si.name);

			for (var i=0;i<chld.length;i++){

				if(chld[i].getAttribute('isBound')=='true') continue;	//needed to prevent duplicated substitution binding

				chld[i].setAttribute('isBound','true')

				var p = si.bind(chld[i]);

				if(si.substitutionGroupAffiliation) p.subs=si.substitutionGroupAffiliation.subs;

				p.minOccurs = this.minOccurs;

				p.maxOccurs = this.maxOccurs;

				ps.push(p);

			}

		}

		

		var pfx = getPrefix(node.ownerDocument.documentElement,t.targetNS);

		var chld = findXMLNode(node,pfx+t.name);

		for (var i=0;i<chld.length;i++){

			if(chld[i].getAttribute('isBound')=='true') continue;	//needed to prevent duplicate substitution binding

			chld[i].setAttribute('isBound','true')

			var p = t.bind(chld[i]);

			if(t.substitutionGroupAffiliation) p.subs=t.substitutionGroupAffiliation.subs;

			p.minOccurs = this.minOccurs;

			p.maxOccurs = this.maxOccurs;

			ps.push(p);

		}

	}else if(t.typeName=='wildcard'){

		var nsn=t.targetNS

		var pfx=getPrefix(node.ownerDocument.documentElement,nsn);

		var chld = findXMLNode(node,pfx+'any');

		for (var i=0;i<chld.length;i++){

			var p=t.bind(chld[i]);

			p.minOccurs=this.minOccurs

			p.maxOccurs=this.maxOccurs

			ps.push(p);

		}

	}else if(t.typeName=='modelGroup'){		//may return multiple properties according to minmax

		if(t.isPointless==false) this.checkPointless();

		var prtc=this;

		var pms=t.bind(node,prtc);

		ps=ps.concat(pms);

	}

	return ps;

}



xsModelGroup.prototype.bind=function(node){

	var ps=new Array();

	var chld=node.childNodes;

	if((this.compositor=='all')||(this.compositor=='sequence')){

		for (var i=0;i<this.particles.length;i++){

			var pti=this.particles[i];

			var pp=pti.bind(node,this.compositor);

			if(pp.length==0) {	//non set property

				if(hideproperties) continue;

				var p= this.particles[i].term.bind(node);

				p.minOccurs=pti.minOccurs;

				p.maxOccurs=pti.maxOccurs;

				ps.push(p);

			}else{

				ps=ps.concat(pp)

			}

		}

	}else{

		var choices=new XMLList()

		for (var i=0;i<this.particles.length;i++){

			choices.add(this.particles[i].term)

		}

		for (var i=0;i<this.particles.length;i++){

			var pti=this.particles[i];

			var pp=pti.bind(node,this.compositor);

			for (var j=0;j<pp.length;j++){

				var p = pp[j];

				p.subs=choices

			}

			ps=ps.concat(pp)

		}

	}

	return ps;

}



xsGroup.prototype.bind=function(node){

alert('grp')

	var mg=this.modelGroup.bind(node);

	return mg;

}

xsAttributeDecl.prototype.bind=function(node){

alert('attd')

	if(this.valueConstraint!=null){

	}

}

xsAttributeGroup.prototype.bind=function(node){

alert('attg')

	for(var i=0;i<this.attUses.length;i++){

		var std=this.attUses[i].bind(node);

	}

}



xsSimpleUrType.prototype.bind=function(node){

	var jp=new jsProperty();

	jp.type=this.baseTypeDef;

	var val = (node.firstChild!=null)? node.firstChild.nodeValue : null;

	if(val) {

		jp.isSet=true;

		jp.setValue(val);

	}

	return jp;

}

xsUrType.prototype.bind=function(node){

	var jp=new jsProperty();

	jp.type=this.baseTypeDef;

	var val = (node.firstChild!=null)? node.firstChild.nodeValue : null;

	if(val) {

		jp.isSet=true;

		jp.setValue(val);

	}

	return jp;

}

xsIdentityConstraint.prototype.bind=function(node){

}

xsNotation.prototype.bind=function(node){

}

xsAnnotation.prototype.bind=function(node){

}



//******************************************************************************

function jsEnumeration(){

	this.name=null;

	this.type=null;

	this.values=new Array();

	this.defaultValue=null;

	this.index=0;

}

jsEnumeration.prototype.getValue=function(){

	return this.values[this.index];

}

jsEnumeration.prototype.setValue=function(value){

	for (var i;i<this.values.length;i++){

		if(this.values[i]==value) {

			this.index=i;

			break;

		}

	}

}

jsEnumeration.prototype.toHTML=function(doc){

	var nm=createSpan(doc,this.name,'stelement');

	var vv=new Array()

	for(var i=0;i<this.values.length;i++){

		vv.push([this.values[i],i])

	}

	var vl=createSelect(doc,vv);

	var tp=createSpan(doc,this.type.name+' enum','sti');

	var d=createDiv(doc)

	d.appendChild(nm)

	d.appendChild(vl)

	d.appendChild(tp)

	return d;

}

//=============================================================

function jsAttribute(){

	this.name=null;				

	this.type=null;				

	this._value=null;

	this.defaultValue=null;

	this.fixed=false;

	this.required=false;

	this.isSet=false;

}

jsAttribute.prototype.getValue=function(){

	if(this.fixed) return this.defaultValue;

	return this._value

}

jsAttribute.prototype.setValue=function(value){

	if(this.fixed) return;

	this._value=value;

}

jsAttribute.prototype.toHTML=function(doc){

	if(hideattributes){

		if((this.required==false)&&(this.isSet==false)) return null;

	}

	var nm=createSpan(doc,this.name,'stattrib');

	var vl=createTextArea(doc,this.getValue(),this.fixed);

	var tpname=(this.type.name!=null)? this.type.name:this.type.baseTypeDef.name;

	var inf=(this.required)?tpname+' (required)':tpname;

	var tp=createSpan(doc,inf,'sti');

	var d=createDiv(doc);

	d.appendChild(nm)

	d.appendChild(vl)

	d.appendChild(tp)

	return d;

}

//=============================================================

function jsProperty(){

	this.name=null;				//name of the property

	this.type=null;				//type of the value; either primitive type or referenced value

	this._value=null;

	this.defaultValue=null;

	this.fixed=false;

	this.isSet=false;

	this.minOccurs=-99;

	this.maxOccurs=-99;

	this.subs=new XMLList();				//substitutions for this element Declaration

	this.attributes=new Array();

}

jsProperty.prototype.getValue=function(){

	if(this.fixed) return this.defaultValue;

	return this._value;

}

jsProperty.prototype.setValue=function(value){

	if(this.fixed) return;

	this._value=value;

}

jsProperty.prototype.getAttribute=function(attname){

}

jsProperty.prototype.setAttribute=function(attname,attvalue){

}

jsProperty.prototype.toHTML=function(doc){

	if(this.isSet==false) return null;

	var d=createDiv(doc);

	var ex=createDiv(doc,'stdexp');

	if(this.subs.list.length>0){

		var sgs = new Array()

		var si=0;

		for (var i=0;i<this.subs.list.length;i++){

			if(this.subs.list[i].name==this.name) si=i

			sgs.push([this.subs.list[i].name,i])

		}

		var sel=createSelect(doc,sgs)

		sel.setAttribute('className','stelement')

		sel.options.selectedIndex=si

		d.appendChild(sel);

	}else{

		d.appendChild(createSpan(doc,this.name,'stelement'));

	}

	for(var i=0;i<this.attributes.length;i++){

		var w=this.attributes[i].toHTML(doc)

		if(w!=null) ex.appendChild(w);

	}

	var vl=createTextArea(doc,this.getValue(),this.fixed);

	d.appendChild(vl)

	if(this.type){

		var tpname=(this.type.name!=null)? this.type.name:this.type.baseTypeDef.name;

		if((this.minOccurs!=1)||(this.maxOccurs!=1)) tpname+=' ('+this.minOccurs+' to '+this.maxOccurs+')'

		d.appendChild(createSpan(doc,tpname,'sti'))

	}

	d.appendChild(ex)

	return d;

}

//=============================================================

function jsComplexProperty(){

	this.name=null;

	this.type=null;

	this.minOccurs=-99;

	this.maxOccurs=-99;

	this.attributes=new Array();

	this.properties=new Array();

	this.subs=new XMLList();

	this.div=null;					//container for all html elements

	this.expansionSlot=null;	//where all the children properties go

	this.expander=null;			//button for toggling expansion of this property

}

jsComplexProperty.prototype.getProperty=function(propname){

}

jsComplexProperty.prototype.setProperty=function(propname,propvalue){

}

jsComplexProperty.prototype.getAttribute=function(attname){

}

jsComplexProperty.prototype.setAttribute=function(attname,attvalue){

}

jsComplexProperty.prototype.toHTML=function(doc){

	this.div=createDiv(doc);

	this.expansionSlot=createDiv(doc,'stdexp');

	if(this.subs.list.length>0){

		var si=0;

		var sgs = new Array()

		for (var i=0;i<this.subs.list.length;i++){

			if(this.subs.list[i].name==this.name) si=i

			sgs.push([this.subs.list[i].name,i]);

		}

		var sel=createSelect(doc,sgs);

		sel.setAttribute('className','stelement');

		sel.options.selectedIndex=si;

		this.div.appendChild(sel);

	}else{

		this.div.appendChild(createSpan(doc,this.name,'stelement'));

	}



	var tpname=' '

	tpname+=(this.type.name!=null)?this.type.name:tpname+='anonymous type'

	this.expander=createButton(doc,tpname,'button1');

	this.div.appendChild(this.expander);



	if(this.div.parentNode!=null) this.assignExpander(doc);



	if((this.minOccurs!=1)||(this.maxOccurs!=1)){

		var oc=' ('+this.minOccurs+' to '+this.maxOccurs+')';

		this.div.appendChild(createSpan(doc,oc,'sti'));

	}

	this.div.appendChild(this.expansionSlot);

	return this.div;

}

jsComplexProperty.prototype.assignExpander=function(doc){

	var tt=this;

	var ex=this.expansionSlot;

	if(autoexpand){

		expandContent(doc,ex,tt);

	}else{

		if(this.expander) this.expander.onclick=function(){expandContent(doc,ex,tt)};

	}

}



function expandContent(doc,whereto,obj){

	if(whereto.childNodes.length>0) {

		while(whereto.childNodes.length>0){

			whereto.removeChild(whereto.firstChild);

		}

	}else{

		for(var i=0;i<obj.attributes.length;i++){

			var w=obj.attributes[i].toHTML(doc);

			if(w!=null) whereto.appendChild(w);

		}

		for(var i=0;i<obj.properties.length;i++){

			var newobj=obj.properties[i].toHTML(doc)

			if(newobj==null) continue

			whereto.appendChild(newobj);

			if(newobj.expander) newobj.assignExpander(doc);	

			//assign event later in MSIE to prevent memory leaks, not sure if it works

		}

	}

}

