

	/*	=====================================================================================

		ContentModel

		A particle used in a complex type definition to constrain the validation of the 

		[children] of an element information item;



		complexType.contentType[1]=particle

		modelGroup = contains array of particles

		non top elementDecl = particle

		wildcard = particle

	========================================================================================= */

	function xsContentModel(){

		var _minCount=0

		var _maxCount=1

		this.particles=new Array();

	}

	xsContentModel.prototype.addElementDecl=function(elm){	//no duplicate element name accepted

	}

	xsContentModel.prototype.getElementDecl=function(elname){

	}

	xsContentModel.prototype.addGroup=function(grp){	//no duplicate group name accepted

	}

	xsContentModel.prototype.addModelGroup=function(mgrp){

	}

	xsContentModel.prototype.addWildcard=function(wcard){	//only <any> accepted

	}

	xsContentModel.prototype.addParticle=function(prtc){

		if(this.particles.length>=this.getMaxCount) return;

		var exists=false;

		for(var i=0;i<this.particles.length;i++){

			if(this.particles[i]==prtc) exists=true;

		}

		if(!exists) this.particles.push(prtc);

	}

	xsContentModel.prototype.removeParticle=function(prtc){

		if(this.particles.length<=this.getMinCount) return;

		this.particles.splice(prtc);

	}

	xsContentModel.prototype.getParticle=function(index){

		return this.particles[index];

	}

	xsContentModel.prototype.getParticleCount=function(){

		return this.particles.length;

	}

	xsContentModel.prototype.getMaxCount=function(){

		return _maxCount

	} 

	xsContentModel.prototype.getMinCount=function(){

		return _minCount

	}

	xsContentModel.prototype.enumerate=function(){

	} 



	/*	=====================================================================================

		SCHEMA : <schema>

	========================================================================================= */

	function xsSchema(uri){

		this.uri      = uri;				//schema doc URI

		this.node     = null;			//document element of the schema doc

		this.pfx		  = '';				//prefix for xsd namespace

		this.referer  = this;			//initial : this schema refer to itself

		this.includes = new XMLList();

		this.imports  = new XMLList();

		this.components=new compList(this);

		this.constr

		//var a = {include:'includes',import:'imports',redefine:'redefines',elementDecl:'elementDecls',simpleType:'typeDefs',complexType:'typeDefs',groups:'modelGroups',attributeGroup:'attributeGroups',notation:'notationDecls',annotation:'annotations'}

	}

	xsSchema.prototype.buildXSDTypes=function(){

		buildPrimitives(this);

		buildDerives(this);

		buildXSITypes(this);

	}

	xsSchema.prototype.getXSDTypes=function(){	//return built in data types

		return unionArray([this.components.getByNamespace(xsdNS),this.components.getByNamespace(xsiNS)]);

	}

	xsSchema.prototype.setReferer=function(schemaobj){

		if(schemaobj==null) return;

		if(schemaobj==this.referer) return;

		this.referer = schemaobj.referer;	//pointing to ancestor schema

		this.components.list = unionArray([this.components.list,schemaobj.getXSDTypes()]);	//transfering built in xsd and xsi types

		this.includes.parent = this.referer.includes;

		this.imports.parent  = this.referer.imports;

	}

	xsSchema.prototype.getIncludeImport=function(){

		if(this.node==null) return new Array();

		var pfx  = this.pfx;

		var exts = findXMLNode(this.node,pfx+'include|'+pfx+'import');

		return exts;

	}



/*	=====================================================================================

		ELEMENT Declaration : top level <element>

	========================================================================================= */

	function xsElementDecl(){

		this.name=null;

		this.targetNS=null;

		this.scope='global';

		this.nillable=false;

		this.abstract=false;

		this.typeDef=null;	

		this.valueConstraint = null;

		this.idConstraint=new Array();

		this.substitutionGroupAffiliation=null;

		this.disallowedSubstitutions=null;

		this.substitutionGroupExclusions=null;

		this.annotation=null;

		this.subs=new XMLList();	//array of elementDecl capable of substituting this object

		this.typeName='elementDecl';

	}



	/*	=====================================================================================

		ATTRIBUTE Declaration : <attribute>

	========================================================================================= */

	function xsAttributeDecl(){

		this.name=null;

		this.targetNS=null;

		this.typeDef=null;

		this.scope='global'

		this.valueConstraint = null;

		this.annotation = null;

		this.typeName='attributeDecl';

	}



	/*	=====================================================================================

		ATTRIBUTEUSE

		correspond to all uses of <attribute> which allow a use attribute

	========================================================================================= */

	function xsAttributeUse(req, cnst, attdecl){

		this.required=req;				//boolean;

		this.valueConstraint=cnst;		

		this.attDecl=attdecl;			//An attribute declaration;provides the attribute declaration itself, which will in turn determine the simple type definition used

		this.name = this.attDecl.name;

		this.typeName='attributeUse';

	}



	/*	=====================================================================================

		ATTRIBUTEGROUP Component : <attributeGroup>

	========================================================================================= */

	function xsAttributeGroup(){

		this.name=null;

		this.targetNS=null;

		this.attUses=new Array();

		this.attWildcard=null;

		this.annotation=null;

		this.typeName='attributeGroup';

	}





	/*	=====================================================================================

		GROUP Component : <group>

	========================================================================================= */

	function xsGroup(){

		this.name=null;

		this.targetNS=null;

		this.modelGroup=null;

		this.annotation=null;

		this.typeName='group';

	}



	/*	=====================================================================================

		MODEL GROUP : a <all>, a <choice> or a <sequence>

	========================================================================================= */

	function xsModelGroup(){

		this.compositor=null;

		this.particles=new Array();

		this.annotation=null;

		this.typeName='modelGroup';

		this.isPointless=false;

		this.content=new xsContentModel();

	}



	/*	=====================================================================================

		PARTICLE Component

	========================================================================================= */

	function xsParticle(mno,mxo,term){

		this.minOccurs=mno;		//non negative integer

		this.maxOccurs=mxo;		//non negative integer or unbounded

		this.term=term;			//a (modelGroup|wildcard|elementDecl); which may also contains other particle.

		this.typeName='particle';

		this.content=new xsContentModel();

	}

	xsParticle.prototype.checkPointless=function(){

		var t=this.term;

		if(t.typeName!='modelGroup') return false;

		switch(t.compositor){

			case('all'):

				if(t.particles.length<=1) t.isPointless=true;

				break;

			case('sequence'):

				if(t.particles.length==0) t.isPointless=true;

				if((this.minOccurs==1)&&(this.maxOccurs==1)){

					if(t.particles.length==1) t.isPointless=true;

					for(var i=0;i<t.particles.length;i++){

						var tp=t.particles[i];

						if(tp.term.typeName!='modelGroup') continue

						if((tp.term.compositor='sequence')&&(tp.minOccurs==1)&&(tp.maxOccurs==1)) tp.term.isPointless=true;

					}

				}

				break;

			case('choice'):

				if((t.particles.length==0)&&(this.minOccurs==0)) t.isPointless=true;

				if((this.minOccurs==1)&&(this.maxOccurs==1)){

					if(t.particles.length==1) t.isPointless=true;

					for(var i=0;i<t.particles.length;i++){

						var tp=t.particles[i];

						if(tp.term.typeName!='modelGroup') continue

						if((tp.term.compositor='choice')&&(tp.minOccurs==1)&&(tp.maxOccurs==1)) tp.term.isPointless=true;

					}

				}

				break;

		}

	}



	/*	=====================================================================================

		WILDCARD Component :<any>

	========================================================================================= */

	function xsWildcard(){

		this.NSConstraint=null;

		this.processContents='strict'

		this.annotation=null;

		this.typeName='wildcard';

	}



	/*	=====================================================================================

		URTYPE Component

	========================================================================================= */

	function xsSimpleUrType(){	//built in Simple Type Definition

		this.name='anySimpleType';

		this.targetNS=xsdNS;

		this.baseTypeDef=new xsUrType();

		this.final=new Array();

		this.variety=null;

		this.derivationMethod='restriction';

		this.contentType=this.baseTypeDef.contentType;

		this.attUses=new Array();

		this.attWildcard=this.baseTypeDef.attWildcard;

		this.final=new Array();

		this.prohibitedSubstitution=new Array();

		this.abstract=false;

		this.facets=new xsFacetList()

		this.jsType=String;

		this.valueOf=String;

	}



	function xsUrType(){			//Built-in Complex Type Definition

		this.name='anyType';

		this.targetNS=xsdNS

		this.baseTypeDef=this;

		this.derivationMethod='restriction'

			var wc=new xsWildcard();	wc.NSConstraint='any';

			var p=new xsParticle(0,'unbounded',wc);

			var mdlgrp=new xsModelGroup();	mdlgrp.compositor='sequence';	mdlgrp.particles=[p];

			var prtc=new xsParticle(1,1,mdlgrp);

		this.contentType=['mixed',prtc]

		this.attUses=new Array();

		this.attWildcard=wc;

		this.final=new Array();

		this.prohibitedSubstitution=new Array();

		this.abstract=false;

		this.facets=new xsFacetList();

	}





	/*	=====================================================================================

		SIMPLETYPE Component

	========================================================================================= */

	function xsSimpleType(){

		this.name=null;

		this.targetNS= null;

		this.baseTypeDef=null;

		this.final=null;

		this.variety='atomic';

		this.primitiveTypeDef=null;	//variety=atomic

		this.itemTypeDef=null;			//variety=list

		this.memberTypeDefs=null;		//variety=union

		this.facets=new xsFacetList();

		this.annotation=null;

		this.typeName='simpleType';

	}

	xsSimpleType.prototype.getEnumeration=function(){

		var envals=new Array();

		var fcts=this.facets;

		if(fcts.list.length>0){

			var enums=fcts.getEnum();

			for(var i=0;i<enums.length;i++){

				envals[envals.length]=[enums[i].value,enums[i].value,i];

			}

		}

		return envals;

	}



	/*	=====================================================================================

		COMPLEXTYPE Component

	========================================================================================= */

	function xsComplexType(){

		this.name=null;

		this.targetNS=null

		this.abstract=false;

		this.prohibitedSubstitution=null

		this.final=null

		this.annotations=null

		this.baseTypeDef=null;

		this.derivationMethod=null;

		this.attUses=null;

		this.attWildcard=null;

		this.contentType=null;

		this.typeName='complexType';

		this.content=new xsContentModel();

	}





	/*	=====================================================================================

		IDENTITY-CONSTRAINT

		provide for uniqueness and reference constraints with respect to the contents of multiple elements and attributes.

		either a <key>, a <keyref> or a <unique> element information item

	========================================================================================= */

	function xsIdentityConstraint(schobj,node){

		var pfx=schobj.pfx;

		this.name=node.getAttribute('name');

		this.targetNS=schobj.node.getAttribute('targetNamespace');

		this.category=dropNS(node.nodeName)	//One of key, keyref or unique, depending on the item

		this.selector=null;

			var s= findXMLNode(node,pfx+"selector")

			this.selector=s[0].getAttribute('xpath')

		this.fields=new Array();

			var f= findXMLNode(node,pfx+"field")

			for(var i=0;i<f.length;i++){

				this.fields[this.fields.length]=f[i].getAttribute('xpath');

			}

		this.refKey=null;

			if(dropNS(node.nodeName)=='keyref'){

				this.refKey=resolveComp(schobj,node,'refer'); //this should return a <key> or <unique>

			}

		this.annotation=xsAnnotationUnmarshaller(schobj,node)

		this.typeName='idConstraint';

	}



	/*	=====================================================================================

		NOTATION Component

		<notation> element information item

	========================================================================================= */

	function xsNotation(schobj,node){

		this.name=node.getAttribute('name');

		this.targetNS=schobj.node.getAttribute('targetNamespace');

		this.systemId= node.getAttribute('system');

		this.publicId=node.getAttribute('public');

		this.annotation=xsAnnotationUnmarshaller(schobj,node);

		this.typeName='notation'

	}





	/*	=====================================================================================

		ANNOTATION Component

	========================================================================================= */

	function xsAnnotation(schobj,node){

		var pfx=schobj.pfx

		this.appInfo=findXMLNode(node,pfx+'appinfo');

		this.userInfo=findXMLNode(node,pfx+'documentation');

		this.attributes=findXMLNode(node,pfx+'attribute');

		this.typeName='annotation'

	}



	/*	=====================================================================================

		BUILT IN PRIMITIVE TYPES

	========================================================================================= */

	//mapped to js type: string, number, boolean, array; TO DO : create customized js type as a bridge

	//the more exotic types are mapped to string

	//date etc also mapped to string since js Date object accept different parameter format than the xsd specified

	function buildPrimitives(schemaobj){

		var prims=[

			['string',['false',false,'countably infinite',false],['length','minLength','maxLength','pattern','enumeration','whiteSpace'],String]

			,['boolean',['false',false,'finite',false],['pattern','whiteSpace'],Boolean]

			,['float',['total',true,'finite',true],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],Number]

			,['double',['total',true,'finite',true],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],Number]

			,['decimal',['total',false,'countably infinite',true],['totalDigits','fractionDigits','pattern','whiteSpace','enumeration','maxInclusive','maxExclusive','minInclusive','minExclusive'],Number]

			,['duration',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['dateTime',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['time',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['date',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['gYearMonth',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['gYear',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['gMonthDay',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['gDay',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['gMonth',['partial',false,'countably infinite',false],['pattern','enumeration','whiteSpace','maxInclusive','maxExclusive','minInclusive','minExclusive'],String]

			,['hexBinary',['false',false,'countably infinite',false],['length','minLength','maxLength','pattern','enumeration','whiteSpace'],Number]

			,['base64Binary',['false',false,'countably infinite',false],['length','minLength','maxLength','pattern','enumeration','whiteSpace'],Number]

			,['anyURI',['false',false,'countably infinite',false],['length','minLength','maxLength','pattern','enumeration','whiteSpace'],String]

			,['QName',['false',false,'countably infinite',false],['length','minLength','maxLength','pattern','enumeration','whiteSpace'],String]

			,['NOTATION',['false',false,'countably infinite',false],['length','minLength','maxLength','pattern','enumeration','whiteSpace'],String]

		]

		for (var i=0;i<prims.length;i++){

			var p = prims[i];

			if(schemaobj.components.get(xsdNS,p[0])!=null) continue;

			var a = new xsSimpleType();

			a.name=p[0];

			a.targetNS="http://www.w3.org/2001/XMLSchema";

			a.baseTypeDef=new xsUrType();

			a.variety='atomic';

			a.primitiveTypeDef=a;

			a.fundamentalFacets=new xsFacetList();

				a.fundamentalFacets.add(new xsFacet('ordered',p[1][0],true));

				a.fundamentalFacets.add(new xsFacet('bounded',p[1][1],true));

				a.fundamentalFacets.add(new xsFacet('cardinality',p[1][2],true));

				a.fundamentalFacets.add(new xsFacet('numeric',p[1][3],true));

			a.facets=new xsFacetList();

			a.jsType=p[3];

			a.valueOf=a.jsType;

			schemaobj.components.add(a);

		}

	}

	/*	=====================================================================================

		BUILT IN DERIVED TYPES

	========================================================================================= */

	//Some facets are modified because js can't handle them.

	//'long' should have facets = minInclusive:-9223372036854775808,maxInclusive:9223372036854775807

	//'unsignedLong' should have facets = maxInclusive:18446744073709551615

	var ders;

	function buildDerives(schemaobj){

		ders=[

			['integer',['total',false,'countably infinite',true],'decimal',{fractionDigits:0}]

			,['nonPositiveInteger',['total',false,'countably infinite',true],'integer',{maxInclusive:0}]

			,['long',['total',true,'finite',true],'integer',{minInclusive:Number.MIN_VALUE,maxInclusive:Number.MAX_VALUE}]

			,['nonNegativeInteger',['total',false,'countably infinite',true],'integer',{minInclusive:0}]

			,['negativeInteger',['total',false,'countably infinite',true],'nonPositiveInteger',{maxInclusive:-1}]

			,['int',['total',true,'finite',true],'long',{minInclusive:-2147483648,maxInclusive:2147483647}]

			,['short',['total',true,'finite',true],'int',{minInclusive:-32768,maxInclusive:32767}]

			,['byte',['total',true,'finite',true],'short',{minInclusive:-128,maxInclusive:127}]

			,['unsignedLong',['total',true,'finite',true],'nonNegativeInteger',{maxInclusive:Number.MAX_VALUE}]

			,['positiveInteger',['total',false,'countably infinite',true],'nonNegativeInteger',{}]

			,['unsignedInt',['total',true,'finite',true],'unsignedLong',{minInclusive:1}]

			,['unsignedShort',['total',true,'finite',true],'unsignedInt',{maxInclusive:65535}]

			,['unsignedByte',['total',true,'finite',true],'unsignedShort',{maxInclusive:255}]

			,['normalizedString',['false',false,'countably infinite',false],'string',{}]

			,['token',['false',false,'countably infinite',false],'normalizedString',{}]

			,['language',['false',false,'countably infinite',false],'token',{}]

			,['NMTOKEN',['false',false,'countably infinite',false],'token',{}]

			,['Name',['false',false,'countably infinite',false],'token',{}]

			,['NCName',['false',false,'countably infinite',false],'Name',{}]

			,['ID',['false',false,'countably infinite',false],'NCName',{}]

			,['IDREF',['false',false,'countably infinite',false],'NCName',{}]

			,['ENTITY',['false',false,'countably infinite',false],'NCName',{}]

		]

		for (var i=0;i<ders.length;i++){

			var dt=deriveBuiltType(schemaobj,ders[i],false);

			schemaobj.components.add(dt);

		}

		//name,fFacets,itemType,cfacet values; the constraining facets is the same as the itemtype constrain facet

		var derlist=[

			['IDREFS',['false','false','countably infinite','false'],'IDREF',{}]

			,['NMTOKENS',['false','false','countably infinite','false'],'NMTOKEN',{}]

			,['ENTITIES',['false','false','countably infinite','false'],'ENTITY',{}]

		]

		for (var i=0;i<derlist.length;i++){

			var dt=deriveBuiltType(schemaobj,derlist[i],true);

			schemaobj.components.add(dt);

		}

	}

	function deriveBuiltType(schemaobj,der,aslist){

		var name=der[0];

		var cfv=der[3];

		var parent=null;

		var ittype=null

		var parent=null;

		parent=schemaobj.components.get(xsdNS,der[2]);

		if(parent==null) {	//if parent is another derived type

			for(var j=0;j<ders.length;j++){

				if(ders[j][2]==der[2])	{

					parent=deriveBuiltType(schemaobj,ders[j],false);

				}

			}

		}

		var a = new xsSimpleType();

		a.name=name;

		a.targetNS="http://www.w3.org/2001/XMLSchema";

		a.baseTypeDef=new xsUrType();

		if(aslist) {

			a.itemTypeDef=ittype;

			this.variety='list';

			a.jsType=Array;

		}else{

			a.primitiveTypeDef=a;

			this.variety='atomic';

			a.jsType=parent.jsType;

		}

		a.valueOf=a.jsType;

		a.fundamentalFacets=new xsFacetList();

			a.fundamentalFacets.add(new xsFacet('ordered',der[1][0],true));

			a.fundamentalFacets.add(new xsFacet('bounded',der[1][1],true));

			a.fundamentalFacets.add(new xsFacet('cardinality',der[1][2],true));

			a.fundamentalFacets.add(new xsFacet('numeric',der[1][3],true));



		a.facets=parent.facets;

		var fcts=new xsFacetList();

		for (var fname in cfv){

			fcts.add(new xsFacet(fname,cfv[fname],false))

		}

		a.facets.subset(fcts);

		return a;

	}



	/*	=====================================================================================

		BUILT IN XSI TYPES : built after primitive xsd created;

	========================================================================================= */	

	function buildXSITypes(schemaobj){

		var sltd=new xsSimpleType();

		sltd.targetNS=xsiNS;

		sltd.baseTypeDef=new xsSimpleUrType();

		sltd.variety='list';

		sltd.itemTypeDef=schemaobj.components.get(xsdNS,'anyURI');

		var xsitps=[

			['type',schemaobj.components.get(xsdNS,'QName')],

			['nil',schemaobj.components.get(xsdNS,'boolean')],

			['noNamespaceSchemaLocation',schemaobj.components.get(xsdNS,'anyURI')],

			['schemaLocation',sltd]

		]

		for (var i=0;i<xsitps.length;i++){

			if(schemaobj.components.get(xsiNS,xsitps[i][0])!=null) continue;

			var a=new xsAttributeDecl();

			a.name=xsitps[i][0];

			a.targetNS=xsiNS;

			a.typeDef=xsitps[i][1];

			schemaobj.components.add(a);

		}

	}



	/*	=====================================================================================

		FACET and FACET List

	========================================================================================= */

	function xsFacet(name,value,fixed){

		this.name=name;	//NCName

		this.value=value;	//vary

		this.fixed=false;	//boolean

		if( (fixed=='true')||(fixed==true) ) this.fixed=true;

		this.typeName='facet'

	}

	function xsFacetList(){

		this.list=new Array();

		this.typeName='facetlist'

	}

	xsFacetList.prototype.add=function(afacet){

		this.list[this.list.length]=afacet;

	}

	xsFacetList.prototype.remove=function(afacet){

		var newlist=new Array()

		for (var i=0;i<this.list.length;i++){

			if(this.list[i]!=afacet) newlist=this.list[i];

		}

		this.list=newlist;

	}

	xsFacetList.prototype.getEnum=function(){

		var a=new Array()

		for (var i=0;i<this.list.length;i++){

			if(this.list[i].name=='enumeration') {

				a[a.length]=this.list[i]

			}

		}

		return a;

	}	

	xsFacetList.prototype.getPattern=function(){

		var a=new Array()

		for (var i=0;i<this.list.length;i++){

			if(this.list[i].name=='pattern') {

				a[a.length]=this.list[i]

			}

		}

		return a;

	}	

	xsFacetList.prototype.get=function(afacetname,idx){ //idx = index of facet that may exist multiple times (enumeration, pattern)

		var idxcounter=0	

		for (var i=0;i<this.list.length;i++){

			if(this.list[i].name==afacetname) {

				if(this.list[i].name==afacetname){

					if(idx!=null) {

						if(idxcounter==idx) return this.list[i];

						idxcounter+=1;

					}else{

						return this.list[i];

					}

				}

			}

		}

	}

	xsFacetList.prototype.getIndex=function(facetname,value){

		for (var i=0;i<this.list.length;i++){

			if(this.list[i].name==facetname){

				if(value==null) {

					return i;

				}else{

					if (this.list[i].value==value) return i;

				}

			}

		}

		return null;

	}

	xsFacetList.prototype.subset=function(subfacets){	//subfacets= other facetlist subsetting xsFacetList

			for (var j=0;j<subfacets.list.length;j++){

				if(subfacets.list[j].name=='enumeration') {		//add to the end of the list if value is distinct

					if(this.getIndex('enumeration',subfacets.list[j].value)==null) {

						this.list[this.list.length]=subfacets.list[j];

					}

				}else if(subfacets.list[j].name=='pattern') {	//add to the end of the list if value is distinct

					if(this.getIndex('pattern',subfacets.list[j].value)==null) {

						this.list[this.list.length]=subfacets.list[j];

					}

				}else{					//replace with new facet

					var fctidx=this.getIndex(subfacets.list[j].name);

					if(fctidx==null) {

						this.list[this.list.length]=subfacets.list[j];

					}else{

						this.list[fctidx]=subfacets.list[j];

					}

				}

			}

	}



