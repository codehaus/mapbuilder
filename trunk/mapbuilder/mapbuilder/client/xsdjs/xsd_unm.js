	var xsdNS = "http://www.w3.org/2001/XMLSchema";

	var xsiNS = "http://www.w3.org/2001/XMLSchema-instance";



	var loadedSchemas=new XMLList();

	var _schemalocs=new Array();



	function processInstance(adoc){

		var de=adoc.documentElement;

		var xsip=getPrefix(de,xsiNS);

		var sl=de.getAttribute(xsip+'schemaLocation');

		if(sl==null){

			sl = "";

			sl+= "http://www.opengis.net/wfs WFS-capabilities.xsd "

			sl+= "http://www.opengis.net/wfs WFS-basic.xsd "

			alert('cannot find xsi:schemaLocation attribute in root element.'+'\n'+'using default wfs schema :'+'\n'+sl)

		}

		sl=sl.replace(/(^\s*)|(\s*$)/g, "");

		sl=sl.replace(/(\s+)/g,'\x20');

		var abc=sl.split(' ');

		for(var i=0;i<abc.length;i+=2){

			_schemalocs[_schemalocs.length]=[abc[i],abc[i+1]];

		}

		for(var i=0;i<_schemalocs.length;i++){

			processSchema(_schemalocs[i][1])

		}

		processNode(de);

	}

	function processNode(node){

		var pf=extractPrefix(node.nodeName)

		var nm=extractPart(node.nodeName)

		var attname=(pf!='')?'xmlns:'+pf:'xmlns';

		var de=node.ownerDocument.documentElement;

		var ns=de.getAttribute(attname);

		if(ns==null) ns=de.getAttribute('targetNamespace');

		var uri=null;

		for(var i=0;i<_schemalocs.length;i++){

			if(_schemalocs[i][0]==ns) {

				uri=_schemalocs[i][1];

				break;

			}

		}

		//alert(pf+'\n'+nm+'\n'+ns+'\n'+uri);

		var schobj=loadedSchemas.get('uri',uri);

		//var ob=getUnmarshalledComponent(schobj,nm);

		var ob=schobj.components.get(ns,dropNS(node.nodeName));

		js2html(ob,node);

	}





	function processSchema(schemauri,componentName){

		loadResource(null,schemauri,function(){xsSchemaUnmarshaller(schemauri,componentName)})

		window.status=schemauri+' completed'

	}

	function initSchema(){

		loadedSchemas=new XMLList();

	}



	function loadResource(referer,schemauri,callback){

		var schobj=loadedSchemas.get('uri',schemauri)

		if(schobj!=null) {

			callback();

		}else{

			window.status='loading '+schemauri+' ....';

			var oDoc = new ActiveXObject("Microsoft.XmlDom");

			oDoc.load(schemauri);

			if(oDoc.readyState == 4) {

				sch=new xsSchema(schemauri);

				sch.node=oDoc.documentElement;

				if(referer==null) {

					sch.buildXSDTypes();

					referer=sch;

				}

				sch.setReferer(referer);

				loadedSchemas.add(sch);

				if(sch.node!=null){

					sch.pfx=getPrefix(sch.node,xsdNS);	//prefix for xsd namespace in this document

					window.status=schemauri+'  loaded'

				}else{

					window.status=schemauri+'   NOT FOUND'

				}

				callback();

			}

		}

	}

	/*	=====================================================================================

		SCHEMA <schema>

	========================================================================================= */

	function xsSchemaUnmarshaller(schemauri,componentName){

		//if componentName null, will unmarshall schema in bulk, otherwise lazily;

		var schemaobj=loadedSchemas.get('uri',schemauri);

		var exts=schemaobj.getIncludeImport();

		for(var i=0;i<exts.length;i++){

			var node=exts[i];

			switch(dropNS(node.nodeName)){

				case('include'):

					xsIncludeUnmarshaller(schemaobj,node);

					break;

				case('import'):

					xsImportUnmarshaller(schemaobj,node);

					break;

				case('redefine'):

					break;

				default:

					break;

			}

		}

		var cn=(componentName!=null)? "[@name='"+componentName+"']" : "";

		var tps=new Array();

		//if(schemaobj.node!=null) tps=findXMLNode(schemaobj.node,'*'+cn);

		if(schemaobj.node!=null) tps=schemaobj.node.selectNodes('*'+cn);

		if(tps.length>0){

			for(var i=0;i<tps.length;i++){

				var node=tps[i];

				switch(dropNS(node.nodeName)){

					case('element'):

						xsElementUnmarshaller(schemaobj,node);

						break;

					case('attribute'):

						xsAttributeUnmarshaller(schemaobj,node);

						break;

					case('attributeGroup'):

						xsAttributeGroupUnmarshaller(schemaobj,node);

						break;

					case('group'):

						xsGroupUnmarshaller(schemaobj,node);

						break;

					case('simpleType'):

						xsSimpleTypeUnmarshaller(schemaobj,node);

						break;

					case('complexType'):

						xsComplexTypeUnmarshaller(schemaobj,node);

						break;

					case('notation'):

						xsNotationUnmarshaller(schemaobj,node);

						break;

					case('annotation'):

						xsAnnotationUnmarshaller(schemaobj,node);

						break;

					default:

						//should create unknown unmarshaller here

						break;

				}

			}

		}else{

			//no feature found, indirectly load other documents

			var exts=schemaobj.getIncludeImport();

			for(var i=0;i<exts.length;i++){

				var theuri=exts[i].getAttribute('schemaLocation');

				loadResource(schemaobj,theuri,function(){xsSchemaUnmarshaller(theuri,componentName)});

			}

		}

	}



	/*	=====================================================================================

		INCLUDE : <include> 

	========================================================================================= */

	function xsIncludeUnmarshaller(schobj,node){

		var incluri=node.getAttribute('schemaLocation')

		schobj.includes.add(incluri);

	}



	/*	=====================================================================================

		IMPORT :<import> element information item identifies namespaces used in external references. 

	========================================================================================= */

	function xsImportUnmarshaller(schobj,node){

		var loc=node.getAttribute('schemaLocation');

		var ns=node.getAttribute('namespace');

		schobj.imports.add({namespace:ns,uri:loc});

	}



	/*	=====================================================================================

		REDEFINE : rarely used, difficult to construct ; why bother

	========================================================================================= */

	function xsRedefineUnmarshaller(){

	}



	/*	=====================================================================================

		ELEMENT Component

		Content: (	annotation?, (	(simpleType | complexType)?, (unique | key | keyref)*	)	)

	========================================================================================= */

	function xsElementUnmarshaller(schobj,node){

		var pfx=schobj.pfx;

		var name=node.getAttribute('name');

		var parentName = node.parentNode.nodeName

		var ref=node.getAttribute('ref');

		if(parentName==(pfx+'schema')){

			var unmcmp=getUnmarshalledComponent(schobj,name);

			if(unmcmp!=null) return unmcmp;

			//if(schobj.components.get(xsdNS,name)!=null) return schobj.components.get(xsdNS,name);

			var a = new xsElementDecl();

			a.name=node.getAttribute('name');

			a.targetNS=schobj.node.getAttribute('targetNamespace');

			a.nillable=(node.getAttribute('nillable')=='true')?true:false;

			a.abstract=(node.getAttribute('abstract')=='true')?true:false;

			a.typeDef=findElementTypeDef(schobj,node);

			a.idConstraint=findElementIdConstraint(schobj,node);

			a.valueConstraint = getValueConstraint(node);

			var sg=resolveComp(schobj,node,'substitutionGroup');

			if (sg!=null) sg.subs.add(a);

			a.substitutionGroupAffiliation=sg;

			a.disallowedSubstitutions=processEBV(schobj,node,'blockDefault','block',['extension','restriction','substitution']);

			a.substitutionGroupExclusions=processEBV(schobj,node,'finalDefault','final',['extension','restriction']);

			a.annotation=xsAnnotationUnmarshaller(schobj,node);

			schobj.components.add(a);

			return a;

		}else{	//if not <schema> then it should be <complexType> or <group>

			//var ctanc= hasAncestor(schobj,node,pfx+'complexType')

			//var ganc= hasAncestor(schobj,node,pfx+'group')

			//if((ctanc==null)&&(ganc==null)) return null;	//FIX THIS : not working

			var term=null;

			if((ref=='')||(ref==null)){			//[@ref] absent

				term=new xsElementDecl();

				term.name=node.getAttribute('name');

				term.nillable=(node.getAttribute('nillable')=='true')?true:false;

				term.abstract=(node.getAttribute('abstract')=='true')?true:false;

				term.typeDef=findElementTypeDef(schobj,node);

				term.idConstraint=findElementIdConstraint(schobj,node);

				term.valueConstraint = getValueConstraint(node);

				//term.substitutionGroupAffiliation=resolveComp(schobj,node,'substitutionGroup');

			var sg=resolveComp(schobj,node,'substitutionGroup');

			if (sg!=null) sg.subs.add(a);

			term.substitutionGroupAffiliation=sg;

				term.disallowedSubstitutions=processEBV(schobj,node,'blockDefault','block',['extension','restriction','substitution']);

				term.substitutionGroupExclusions=processEBV(schobj,node,'finalDefault','final',['extension','restriction']);

				var frm=node.getAttribute('form'); if(frm==null) frm=''

				var efd=schobj.node.getAttribute('elementFormDefault'); if(efd==null) efd=''

				if( (frm=='qualified')||( (frm=='')&&(efd=='qualified') ) ){

					term.targetNS=schobj.node.getAttribute('targetNamespace')

				}

				//this will cycle the process

				//if(ctanc!=null) term.scope=xsComplexTypeUnmarshaller(schobj,ctanc); //complexType as ancestor

				term.scope='complexType'

				schobj.components.add(term);

			}else{					//[@ref] present

				term=resolveComp(schobj,node,'ref') 	//must return xsElementDecl

				if(term==null) return null;

			}

			var mno=node.getAttribute('minOccurs');		if((mno=='')||(mno==null)) mno=1;

			var mxo=node.getAttribute('maxOccurs');		if((mxo=='')||(mxo==null)) mxo=1;

			if((parseInt(mno)==0)&&(parseInt(mxo)==0)) return null;

			var ptcl = new xsParticle(mno,mxo,term)

			return ptcl;

		}

	}



	function findElementTypeDef(schobj,node){	//find element type definition

		var pfx=schobj.pfx;

		var tdef=null;

		var td=findXMLNode(node,pfx+'simpleType|'+pfx+'complexType');

		if(td.length>0) {		//simpleType or complexType children

			if(td[0].nodeName==(pfx+'simpleType')) tdef=xsSimpleTypeUnmarshaller(schobj,td[0]);

			if(tdef==null) tdef=xsComplexTypeUnmarshaller(schobj,td[0]);	//if not simple then complex

		}else{					//resolved type def by the [@type]

			tdef=resolveComp(schobj,node,'type');

			if(tdef==null)	tdef=resolveComp(schobj,node,'substitutionGroup');	//typeDef of the elementDecl resolved to by the [@substitutionGroup]

			if(tdef==null) tdef=new xsUrType();	//if still null, then anyType

		}

		return tdef;

	}

	function findElementIdConstraint(schobj,node){ //find element identity constraints

		var pfx=schobj.pfx;

		var idconst=new Array();

		var icd=findXMLNode(node,pfx+'key|'+pfx+'unique|'+pfx+'keyref')

		for (var i=0;i<icd.length;i++){

			var idc = new xsIdentityConstraint(schobj.node,icd[i])

			if(idc!=null) idconst[idconst.length]=idc;

		}

		return idconst;

	}



	/*	=====================================================================================

		ATTRIBUTE Component

	========================================================================================= */

	function xsAttributeUnmarshaller(schobj,node){

//alert(schobj.uri)

		var pfx  = schobj.pfx;

		var name = node.getAttribute('name');

		var attref = node.getAttribute('ref');	if(attref==null) attref='';

		if(node.parentNode.nodeName==(pfx+'schema')){

			var unmcmp=getUnmarshalledComponent(schobj,name);

			if(unmcmp!=null) return unmcmp;

			//if(schobj.components.get(xsdNS,name)!=null) return schobj.components.get(xsdNS,name);

			var attdecl = new xsAttributeDecl();

			attdecl.name=name;

			attdecl.targetNS=schobj.node.getAttribute('targetNamespace');

			var td=findXMLNode(node,pfx+"simpleType");

			attdecl.typeDef=(td.length>0)? xsSimpleTypeUnmarshaller(schobj,td[0]) : resolveComp(schobj,node,'type');

				if(attdecl.typeDef==null) attdecl.typeDef=new xsSimpleUrType();

			attdecl.valueConstraint = getValueConstraint(node);

			attdecl.annotation = xsAnnotationUnmarshaller(schobj,node);

			schobj.components.add(attdecl);

			return attdecl;

		}else{

			if(node.getAttribute('use')=='prohibited') return null;

			//var ctanc= hasAncestor(schobj,node,pfx+'complexType');

			//var ganc= hasAncestor(schobj,node,pfx+'group');

			//if((ctanc==null)&&(ganc==null)) return null;	//FIX THIS : not working

			var req=(node.getAttribute('use')=='required')?true:false;

			var cnst=getValueConstraint(node);

			var attdecl= new xsAttributeDecl();



			if(attref==''){			//[@ref] absent

				attdecl.name = name;

				var frm = node.getAttribute('form');						if(frm==null) frm='';

				var efd = schobj.node.getAttribute('elementFormDefault');	if(efd==null) efd='';

				if( (frm=='qualified')||( (frm=='')&&(efd=='qualified') ) ){

					attdecl.targetNS = schobj.node.getAttribute('targetNamespace')

				}

				var td=findXMLNode(node,pfx+"simpleType");

				attdecl.typeDef=(td.length>0)? xsSimpleTypeUnmarshaller(schobj,td[0]) : resolveComp(schobj,node,'type');

				if(attdecl.typeDef==null) attdecl.typeDef=new xsSimpleUrType();

				//if(ctanc!=null) attdecl.scope=xsComplexTypeUnmarshaller(schobj,ctanc); //complexType as ancestor			

				schobj.components.add(attdecl);

				attdecl.scope='complexType'

			}else{					//[@ref] present

				var attdecl=resolveComp(schobj,node,'ref'); 	//should return xsAttributeDecl

				if(attdecl==null) return null				

			}

			var attuse = new xsAttributeUse(req,cnst,attdecl)

			return attuse;

		}

	}



	/*	=====================================================================================

		ATTRIBUTEGROUP Component

	========================================================================================= */

	function xsAttributeGroupUnmarshaller(schobj,node){

		var pfx=schobj.pfx;

		var name=node.getAttribute('name');

		var unmcmp=getUnmarshalledComponent(schobj,name);

		if(unmcmp!=null) return unmcmp;

		//if(schobj.components.get(xsdNS,name)!=null) return schobj.components.get(xsdNS,name);

		var parentName = node.parentNode.nodeName

		if((parentName==(pfx+'schema'))||(parentName==(pfx+'redefine'))) {

			var attgroup = new xsAttributeGroup();

			attgroup.name= node.getAttribute('name')

			attgroup.targetNS = schobj.node.getAttribute('targetNamespace')

			attgroup.attUses=findAttributeUses(schobj,node);

				var guses=findGroupUses(schobj,node);

				attgroup.attUses=unionArray([attgroup.attUses,guses])

			attgroup.attWildcard=determineWildcard(schobj,node)

			attgroup.annotation=xsAnnotationUnmarshaller(schobj,node)

			schobj.components.add(attgroup);

			return attgroup;

		}else{

			return null;

		}

	}



	/*	=====================================================================================

		GROUP: a <group>

	========================================================================================= */

	function xsGroupUnmarshaller(schobj,node){ 

		var name  = node.getAttribute('name');

		var unmcmp=getUnmarshalledComponent(schobj,name);

		if(unmcmp!=null) return unmcmp;

		//if(schobj.components.get(xsdNS,name)!=null) return schobj.components.get(xsdNS,name);

		var modname= node.getAttribute('name'); if(modname==null) modname='';

		var attref = node.getAttribute('ref'); if(attref==null) attref='';

		if(modname!=''){		//[@name] exists

			var a = new xsGroup();

			var pfx = schobj.pfx;

			a.name  = node.getAttribute('name')

			a.targetNS  = schobj.node.getAttribute('targetNamespace')

			a.modelGroup=null;

				var chld=findXMLNode(node,pfx+'all|'+pfx+'choice|'+pfx+'sequence')

				var p = xsModelGroupUnmarshaller(schobj,chld[0])

				a.modelGroup=p.term;

			a.annotation=xsAnnotationUnmarshaller(schobj,node);

			schobj.components.add(a);

			return a;

		}else{					//[@ref] exists

			var grp=resolveComp(schobj,node,'ref'); 	//must return xsGroup

			if(grp==null) return null;

			var mno=node.getAttribute('minOccurs');	if((mno=='')||(mno==null)) mno=1;

			var mxo=node.getAttribute('maxOccurs');	if((mxo=='')||(mxo==null)) mxo=1;

			var term=grp.modelGroup;								//this is a xsModelGroup

			var a = new xsParticle(mno,mxo,term);

			schobj.components.add(a);

			return a;

		}

	}



	/*	=====================================================================================

		MODEL GROUP : a <all>, a <choice> or a <sequence>

	========================================================================================= */

	function xsModelGroupUnmarshaller(schobj,node){

		var pfx=schobj.pfx;

		var mno=node.getAttribute('minOccurs');	if((mno=='')||(mno==null)) mno=1;

		var mxo=node.getAttribute('maxOccurs');	if((mxo=='')||(mxo==null)) mxo=1;

		if((mno=='0')&&(mxo=='0')) return null;

		var term = new xsModelGroup();

		term.compositor=dropNS(node.nodeName);		//(all|choice|sequence) 

		var chld=findXMLNode(node,pfx+'choice|'+pfx+'sequence')

		for(var i=0;i<chld.length;i++){

			var mgi = xsModelGroupUnmarshaller(schobj,chld[i]);	//return a particle

			if(mgi!=null) term.particles[term.particles.length]=mgi;

		}



		var chld=findXMLNode(node,pfx+'any|'+pfx+'group|'+pfx+'element')

		for(var i=0;i<chld.length;i++){	//each should return a particle

			var mgi=null;

			if(dropNS(chld[i].nodeName)=='any') mgi=xsWildcardUnmarshaller(schobj,chld[i]);

			if(dropNS(chld[i].nodeName)=='group') mgi=xsGroupUnmarshaller(schobj,chld[i]);

			if(dropNS(chld[i].nodeName)=='element') mgi=xsElementUnmarshaller(schobj,chld[i]);

			if(mgi!=null) term.particles[term.particles.length]=mgi;

		}

		term.annotation=xsAnnotationUnmarshaller(schobj,node);

		var a = new xsParticle(mno,mxo,term);

		return a;

	}



	/*	=====================================================================================

		WILDCARD Component :<any>

	========================================================================================= */

	function xsWildcardUnmarshaller(schobj,node){

		var mno=node.getAttribute('minOccurs');	if((mno=='')||(mno==null)) mno=1;

		var mxo=node.getAttribute('maxOccurs');	if((mxo=='')||(mxo==null)) mxo=1;

		if((mno=='0')&&(mxo=='0')) return null;

		var term=new xsWildcard();

			var ns=node.getAttribute('namespace');

			if(ns==null) {

				term.NSConstraint='any';

			}else{

				var ptns=schobj.node.getAttribute('targetNamespace');

				if(ptns==null) ptns='';

				if(ns=='##any') term.NSConstraint='any';

				if( (ns=='##other')&&(ptns!='') ) term.NSConstraint='not '+ptns;

				if( (ns.indexOf('##targetNamespace')>-1)&&(ptns!='') ) term.NSConstraint= ptns;

				if( ns.indexOf('##local')>-1 ) term.NSConstraint=null;

			}

			var pc=node.getAttribute('processContents');

			if (pc!=null) term.processContents=pc;

			term.annotation=xsAnnotationUnmarshaller(schobj,node)

		var a = new xsParticle(mno,mxo,term);

		return a;

	}



	/*	=====================================================================================

		SIMPLETYPE Component

	========================================================================================= */

	function xsSimpleTypeUnmarshaller(schobj,node){

		if (node==null) return null;

		var name=node.getAttribute('name');

		var unmcmp=getUnmarshalledComponent(schobj,name);

		if(unmcmp!=null) return unmcmp;

		//if( (name!=null)&&(schobj.components.get(xsdNS,name)!=null) ) {

		//	return schobj.components.get(xsdNS,name);

		//}

		var st=new xsSimpleType();

		st.name=name;

		st.targetNS= schobj.node.getAttribute('targetNamespace');

		st.final=processEBV(schobj,node,'finalDefault','final',['extension', 'restriction', 'list', 'union'])

		var pfx=schobj.pfx;

		var chld=findXMLNode(node,pfx+'restriction|'+pfx+'list|'+pfx+'union');	//must have one of these

		var thechild=chld[0];

		var resFacets=new xsFacetList();

		var alternative=dropNS(thechild.nodeName);

		switch(alternative){

			case('restriction'):

				st.baseTypeDef = xsSimpleTypeRestrictionUnmarshaller(schobj,thechild)	//thechild is a <restriction>

				st.variety = st.baseTypeDef.variety;

				st.facets  = xsFacetUnmarshaller(schobj,thechild); //facets inside <resctriction>

				break;

			case('list'):

				st.baseTypeDef = new xsSimpleUrType();

				st.variety = 'list';

				break;

			case('union'):

				st.baseTypeDef = new xsSimpleUrType();

				st.variety = 'union';

				break;

			default:

				break;

		}

		switch(st.variety){

			case('atomic'):

				st.primitiveTypeDef=st.baseTypeDef.primitiveTypeDef;

				//st.facets=st.baseTypeDef.facets;

				st.facets.subset(st.baseTypeDef.facets);		//dont add facet to primitive type!

				break;

			case('list'):

				if(alternative=='list'){

					st.itemTypeDef=resolveComp(schobj,thechild,'itemType'); //thechild is a <list>

					if(st.itemTypeDef==null){

						var lch=findXMLNode(thechild,pfx+'simpleType');

						st.itemTypeDef=xsSimpleTypeUnmarshaller(schobj,lch[0]);

					}

				}else if(alternative=='restriction'){

					st.itemTypeDef=st.baseTypeDef.itemTypeDef;

					//st.facets=st.baseTypeDef.facets;

					st.facets.subset(st.baseTypeDef.facets);

				}

				break;

			case('union'):

				if(alternative=='union'){

					var mtv=thechild.getAttribute('memberTypes'); if (mtv==null) mtv='';

					var mts=mtv.split(' ');

					var explMembers=new Array();

					for (var i=0;i<mts.length;i++){

						var tpdef=resolveCompVal(schobj,mts[i]);

						if(tpdef!=null) explMembers[explMembers.length]=tpdef;

					}

					var stc = findXMLNode(thechild,pfx+'simpleType');	//thechild is a <union>

					for(var i=0;i<stc.length;i++){

						var tpdef=xsSimpleTypeUnmarshaller(schobj,stc[i]);

						explMembers[explMembers.length]=tpdef.baseTypeDef;

					}					

					st.memberTypeDefs=new Array();

					for(var i=0;i<mtf.length;i++){

						if(mtf[i].variety!='union'){

							st.memberTypeDefs[st.memberTypeDefs.length]=mtf[i];

						}else{	//replace union type with its members

							st.memberTypeDefs=unionArray([st.memberTypeDefs,mtf[i].memberTypeDefs])

						}

					}

				}else if(alternative=='restriction'){

					st.memberTypeDefs=st.baseTypeDef.memberTypeDefs;

					//st.facets=st.baseTypeDef.facets;

					st.facets.subset(st.baseTypeDef.facets);

				}

				break;

			default:

				break;

		}

		schobj.components.add(st)

		return st;

	}



	/*	=====================================================================================

		RESTRICTION : <restriction> in <simpleType>

	========================================================================================= */

	function xsSimpleTypeRestrictionUnmarshaller(schobj,node){	//determine type def for simpleType <restriction>

		var pfx=schobj.pfx;

		var attbase=node.getAttribute('base'); if(attbase==null) attbase='';

		var st = null;

		if(attbase!=''){	//[@base] present

			st = resolvedTypeDef(schobj,node);

		}else{				//[@base] absent

			var sc = findXMLNode(node,pfx+'simpleType')

			if (sc.length==0) return null;

			st = xsSimpleTypeUnmarshaller(schobj,sc[0]);

		}

		return st;

	}



	/*	=====================================================================================

		COMPLEXTYPE : <complexType>

	========================================================================================= */

	function xsComplexTypeUnmarshaller(schobj,node){

		var name=node.getAttribute('name');

		var unmcmp=getUnmarshalledComponent(schobj,name);

		if(unmcmp!=null) return unmcmp;

		//if(schobj.components.get(xsdNS,name)!=null) return schobj.components.get(xsdNS,name);



		var ct  = new xsComplexType();

		ct.name = node.getAttribute('name');

		ct.targetNS = schobj.node.getAttribute('targetNamespace');

		ct.abstract = (node.getAttribute('abstract')=='true')?true:false;;

		ct.prohibitedSubstitution = processEBV(schobj,node,'blockDefault','block',['extension','restriction'])

		ct.final = processEBV(schobj,node,'finalDefault','final',['extension','restriction']);

		ct.annotations=new Array();

			var n0 = findXMLNode(node,pfx+'annotation')

			var n1 = findXMLNode(node,pfx+'simpleContent|'+pfx+'complexContent/'+pfx+'annotation')

			var n2 = findXMLNode(node,pfx+'simpleContent|'+pfx+'complexContent/'+pfx+'restriction|'+pfx+'extension/'+pfx+'notation')

			var ns = unionArray([n0,n1,n2]);

			for (var i=0;i<ns.length;i++){

				ct.annotations[ct.annotations.length] = xsAnnotationUnmarshaller(schobj,ns[i])

			}



		var pfx  = schobj.pfx;

		var chld = findXMLNode(node,pfx+'simpleContent|'+pfx+'complexContent');

		var alternative = null;

		var contentnode = null;

		var mixAttVal=false;



		if (chld.length>0) {	//for simple or complexContent

			contentnode = chld[0];

			alternative = dropNS(contentnode.nodeName);

			var re = findXMLNode(contentnode,pfx+'restriction|'+pfx+'extension');	//must have either <restriction> or <extension>

			var dernode=re[0];

			ct.derivationMethod=dropNS(dernode.nodeName);

			ct.baseTypeDef = resolvedTypeDef(schobj,dernode);

			ct.attWildcard = determineWildcard(schobj,dernode);	//wildcard inside <restriction> or <extension>

			ct.attUses = findAttributeUses(schobj,dernode);			//clause 1

				var guses  = findGroupUses(schobj,dernode);

				ct.attUses = unionArray([ct.attUses,guses]);			//clause 2

		}



		if(alternative=='simpleContent'){	//xsSimpleType as contentType



			if( (ct.derivationMethod=='restriction') && (ct.baseTypeDef.typeName=='complexType') ){

				var ruses  = findRestrictingUses(schobj,dernode,ct);

				ct.attUses = unionArray([ct.attUses,ruses]);							//clause 3

				ct.contentType=xsSimpleContentRestrictionUnmarshaller(schobj,dernode,ct);



			}else if( (ct.derivationMethod=='extension') && (ct.baseTypeDef.typeName=='complexType') ){

				ct.attUses = unionArray([ct.attUses, ct.baseTypeDef.attUses]);	//clause 3

				ct.contentType=ct.baseTypeDef.contentType;



			}else{	//simpleType as content

				ct.contentType=ct.baseTypeDef;

			}



		}else if(alternative=='complexContent'){

			if(contentnode.getAttribute('mixed')=='true') mixAttVal=true;

			if(node.getAttribute('mixed')=='true') mixAttVal=true;

			if(ct.derivationMethod=='restriction'){

				var ruses  = findRestrictingUses(schobj,dernode,ct);

				ct.attUses = unionArray([ct.attUses,ruses]);							//clause 3

				ct.contentType = xsComplexContentRestrictionUnmarshaller(schobj,dernode,ct,mixAttVal);

			}else{

				ct.attUses = unionArray([ct.attUses, ct.baseTypeDef.attUses]);	//clause 3

				ct.contentType = xsComplexContentExtensionUnmarshaller(schobj,dernode,ct,mixAttVal);

			}



		}else{	//shorthand for complex content restricting the ur-type definition

			//var ct=new xsUrType();

			ct.derivationMethod='restriction';

			ct.baseTypeDef = new xsUrType() ;

			ct.attWildcard = determineWildcard(schobj,node);	//wildcards inside <complexType>

			ct.attUses = findAttributeUses(schobj,node);			//clause 1

				var guses  = findGroupUses(schobj,node);

				ct.attUses = unionArray([ct.attUses,guses]);				//clause 2

				var ruses  = findRestrictingUses(schobj,node,ct);

				ct.attUses = unionArray([ct.attUses,ruses]);				//clause 3

			if(node.getAttribute('mixed')=='true') mixAttVal=true;

			//ct.contentType=ct.baseTypeDef.contentType

			ct.contentType=xsComplexContentRestrictionUnmarshaller(schobj,node,ct,mixAttVal)

		}

		schobj.components.add(ct)

		return ct;

	}



	/*	=====================================================================================

		RESTRICTION : <restriction> in <simpleContent>

	========================================================================================= */

	function xsSimpleContentRestrictionUnmarshaller(schobj,dernode,ct){	//return xsSimpleType, ct is a xsComplexType

		var pfx = schobj.pfx;

		var sts = findXMLNode(dernode,pfx+'simpleType');

		var resFacets  = xsFacetUnmarshaller(schobj,dernode); //facets inside <resctriction>

		var stype=null;

		if(sts.length>0) {

			stype = xsSimpleTypeUnmarshaller(schobj,st[0]);

		}else{

			stype = ct.baseTypeDef.contentType;

		}

		stype.facets=stype.baseTypeDef.facets;

		stype.facets.subset(resFacets);

		return stype;

	}



	/*	=====================================================================================

		RESTRICTION : <restriction> in <ComplexContent>

	========================================================================================= */

	function xsComplexContentRestrictionUnmarshaller(schobj,node,ct,mixedVal){ //ct is a complexType Object

		var pfx=schobj.pfx;

		var ctp=null;

		var isempty=isContentEmpty(schobj,node);

		if(isempty){

			ctp='empty';

		}else{

			//deal with model group, wildcards already handled in xsComplexTypeUnmarshaller;

			var mg=findXMLNode(node,pfx+'group|'+pfx+'all|'+pfx+'sequence|'+pfx+'choice');

			if(dropNS(mg[0].nodeName)=='group'){

				var mgo=xsGroupUnmarshaller(schobj,mg[0]);		//return a particle

			}else{

				var mgo=xsModelGroupUnmarshaller(schobj,mg[0]);	//return a particle

			}

			ctp=(mixedVal==true)?['mixed',mgo]:['elementOnly',mgo];

		}

		return ctp

	}



	/*	=====================================================================================

		EXTENSION : <extension> in <ComplexContent>

	========================================================================================= */

	function xsComplexContentExtensionUnmarshaller(schobj,node,ct,mixedVal){ //ct is a complexType Object

		var pfx=schobj.pfx;

		var ctp=null;

		var isempty=isContentEmpty(schobj,node);

		var expcont='empty';

		if(isempty==false){

			//deals only with model group, wildcards already handled in xsComplexTypeUnmarshaller;

			var mg=findXMLNode(node,pfx+'group|'+pfx+'all|'+pfx+'sequence|'+pfx+'choice');

			if(dropNS(mg[0].nodeName)=='group'){

				expcont=xsGroupUnmarshaller(schobj,mg[0]);

			}else{

				expcont=xsModelGroupUnmarshaller(schobj,mg[0]);

			}

		}



		var cty = ct.baseTypeDef.contentType;

		if(expcont=='empty'){		//clause 2.1

			ctp = cty;													

		}else{

			if(cty=='empty'){				//clause 2.2

				ctp =(mixedVal==true)? ['mixed',expcont] : ['elementOnly',expcont];

			}

		}

		if((expcont!='empty')&&(cty!='empty'))	{								//clause 2.3

			var trm=new xsModelGroup(schobj,null);

			trm.compositor='sequence';

			//the particle of the contentType (this must not be 'empty' content type)

			trm.particles=[cty[1],expcont] //list of particle, which may contain other particle

			var prt = new xsParticle(1,1,trm);

			ctp =(mixedVal==true)? ['mixed',prt] : ['elementOnly',prt];

		}

		return ctp;

	}



	function isContentEmpty(schobj,node){

		var pfx=schobj.pfx;

		var mgg=findXMLNode(node,pfx+"group");

		var mga=findXMLNode(node,pfx+"all");

		var mgc=findXMLNode(node,pfx+"choice");

		var mgs=findXMLNode(node,pfx+"sequence");

		var isempty=false;

		if((mgg.length+mga.length+mgc.length+mgs.length)==0) isempty=true;	//clause 1.1.1

		if(mga.length>0) isempty=isContentModelEmpty(mga[0]);

		if(mgs.length>0) isempty=isContentModelEmpty(mgs[0]);

		if(mgc.length>0){

			if(mgc[0].getAttribute('minOccurs')=='0') isempty=isContentModelEmpty(mgc[0]);

		}

		return isempty;

	}

	function isContentModelEmpty(node){

		var cmc=findXMLNode(node,'*');

		if(cmc.length==0){

			return true;															//clause 1.1.2

		}else if(cmc.length==1){

			if(dropNS(cmc[0].nodeName)=='annotation') return true;	//clause 1.1.2

		}

		return false;

	}



	/*	=====================================================================================

		FACET unmarshaller (in <restriction> child of simpleType and complexType with simpleContent)

		return xsFacetList

	========================================================================================= */

	function xsFacetUnmarshaller(schobj,node){ //node is a <restriction>

		var pfx=schobj.pfx;

		var a= new xsFacetList();

		var eps=findXMLNode(node,pfx+'enumeration|'+pfx+'pattern');

		for (var i=0;i<eps.length;i++){

			if(a.getIndex(dropNS(eps[i].nodeName),eps[i].getAttribute('value'))==null) {

				var f=new xsFacet(dropNS(eps[i].nodeName),eps[i].getAttribute('value'),eps[i].getAttribute('fixed'));

				a.add(f);

			}

		}

		var fcs=findXMLNode(node,pfx+'minExclusive|'+pfx+'minInclusive|'+pfx+'maxExclusive|'+pfx+'maxInclusive|'+pfx+'totalDigits|'+pfx+'fractionDigits|'+pfx+'length|'+pfx+'minLength|'+pfx+'maxLength|'+pfx+'whiteSpace');

		for (var i=0;i<fcs.length;i++){

			if(a.getIndex(dropNS(fcs[i].nodeName))==null) {

				var f=new xsFacet(dropNS(fcs[i].nodeName),fcs[i].getAttribute('value'),fcs[i].getAttribute('fixed'));

				a.add(f);

			}

		}

		return a;

	}





	/*	=====================================================================================

		NOTATION

		<annotation> element information item

	========================================================================================= */

	function xsNotationUnmarshaller(schobj,node){

		var pfx=schobj.pfx;

		var name=node.getAttribute('name');

		if(schobj.components.get(xsdNS,name)!=null) return schobj.components.get(xsdNS,name);

		var ann=findXMLNode(node,pfx+'notation');

		if(ann.length>0) {

			var a= new xsNotation(schobj,ann[0]);

			schobj.components.add(a);

			return a;

		}

		return null;

	}

	/*	=====================================================================================

		ANNOTATION Component

		<annotation> element information item

	========================================================================================= */

	function xsAnnotationUnmarshaller(schobj,node){

		var pfx=schobj.pfx;

		var ann=findXMLNode(node,pfx+'annotation');

		if(ann.length>0) {

			var a=new xsAnnotation(schobj,ann[0]);

			return a;

		}

		return null;

	}





	/*	=====================================================================================

	 *																													*

	 *											HELPER FUNCTIONS													*

	 *																													*

	====================================================================================== */

	function getUnmarshalledComponent(schobj,qname){

		if(name==null) return null;

		var npfx=extractPrefix(qname);					//the prefix of ref'ed component

		var nname=extractPart(qname);					//the NCName of ref'ed component

		var nsp=(npfx=='')? 'xmlns': 'xmlns:'+npfx;		//determine namespace prefix

		var nsn=schobj.node.getAttribute('targetNamespace');

		if(nsn==null) nsn = schobj.node.getAttribute(nsp);

		var cmp=schobj.components.get(nsn,nname);

		return cmp;

	}



	/*	=====================================================================================

		HELPER FUNCTIONS :	RESOLVER

		Resolving object and namespace in current schema, included schema or imported schema

	========================================================================================= */

	function resolvedTypeDef(schobj,node){	//must return one ur-type,simpleType,or complexType

		var tpdef=resolveComp(schobj,node,'base');

		if(tpdef==null) return new xsUrType();

		return tpdef;

	}

	function resolveComp(schobj,node,attname){		//search unmarshalled object, or null

		var attval=node.getAttribute(attname);

		if ((attval==null)||(attval=='')) return null;	//no such attribute

		var resolved = resolveCompVal(schobj,attval);

		return resolved;

	}



	function resolveCompVal(schobj,attval){		//return unmarshalled object, or null

		var npfx=extractPrefix(attval);						//the prefix of ref'ed component

		var nname=extractPart(attval);						//the NCName of ref'ed component

		var nsp=(npfx=='')? 'xmlns': 'xmlns:'+npfx;		//determine namespace prefix

		var nsn = schobj.node.getAttribute(nsp);

		var cmp = schobj.components.get(nsn,nname);		//search in current schema for already unmarshalled component

		window.status='resolving : '+attval

		var tns = schobj.node.getAttribute('targetNamespace');

		if((tns==nsn)||(tns==null)) {					//live in same namespace

			if(cmp==null) cmp=resolveNode(schobj,attval);		//not yet unmarshalled, find node in current schema to unmarshall

			if(cmp==null) cmp=resolveInclude(schobj,attval);	//search in included schemas and unmarshall node

		}else{												//live in different namespace, find in imports

			if(cmp==null) cmp=resolveImport(schobj,attval)		//if not already unmarshalled

		}

		if(cmp==null) cmp=resolveSchemaLocations(schobj,attval);		//for instance documents;

		return cmp;																	//return null if nothing found

	}



	function resolveSchemaLocations(schobj,qname){

		var cmp=null;

		var npfx=extractPrefix(qname);						//the prefix of ref'ed component

		var ncname=extractPart(qname);						//the NCName of ref'ed component

		var nsp=(npfx=='')? 'xmlns': 'xmlns:'+npfx;		//determine namespace prefix

		var nsn = schobj.node.getAttribute(nsp);

		var pfx=schobj.pfx;										//prefix for xsd component

		if(schobj!=null) {

			for(var i=0;i<_schemalocs.length;i++){

				var theuri=_schemalocs[i][1];

				if(schobj.uri==theuri) continue;



				loadResource(schobj,theuri,function(){xsSchemaUnmarshaller(theuri,ncname)});

				cmp=schobj.components.get(nsn,ncname);		//the unmarshalled object should already passed to importing schema

				if(cmp!=null) return cmp;

			}

		}

		return null;

	}

	function resolveInclude(schobj,qname){

		var cmp=null

		var npfx=extractPrefix(qname);						//the prefix of ref'ed component

		var ncname=extractPart(qname);						//the NCName of ref'ed component

		var nsp=(npfx=='')? 'xmlns': 'xmlns:'+npfx;		//determine namespace prefix

		var nsn = schobj.node.getAttribute(nsp);

		var pfx=schobj.pfx;										//prefix for xsd component

		if(schobj!=null) {

			var incs=findXMLNode(schobj.node,pfx+'include');

			for (var i=0;i<incs.length;i++){

				var incuri=incs[i].getAttribute('schemaLocation');

				loadResource(schobj,incuri,function(){xsSchemaUnmarshaller(incuri,ncname)}) 	//unmarshall included schema lazily

				cmp=schobj.components.get(nsn,ncname);		//the unmarshalled object should already passed to importing schema

				if(cmp!=null) return cmp;

			}

		}

		return null;

	}

	function resolveImport(schobj,qname){

		var rescmp=null

		var npfx=extractPrefix(qname);						//the prefix of ref'ed component

		var ncname=extractPart(qname);						//the NCName of ref'ed component

		var nsp=(npfx=='')? 'xmlns': 'xmlns:'+npfx;		//determine namespace prefix

		var nsn = schobj.node.getAttribute(nsp);

		var pfx=schobj.pfx;						//prefix for xsd component

		if(schobj!=null) {

			var imp=findXMLNode(schobj.node,pfx+'import');

			for (var i=0;i<imp.length;i++){

				var impuri=imp[i].getAttribute('schemaLocation');

				var impns=imp[i].getAttribute('namespace');

				if((impns==nsn)||(impns==null)) {			//search only in imported schema with same namespace or null ns

					loadResource(schobj,impuri,function(){xsSchemaUnmarshaller(impuri,ncname)})	//unmarshall imported schema lazily

					rescmp=schobj.components.get(impns,ncname);		//the unmarshalled object should already passed to importing schema

					if(rescmp!=null) return rescmp;

				}

			}

		}

		return null;

	}

	function resolveNode(schobj,nameval){

		if((nameval==null)||(nameval=='')) return null;	//no such attribute found

		var obname="//*[@name='"+dropNS(nameval)+"']";	//find node with a specified NCName;

		//var resnod=findXMLNode(schobj.node,obname);

		var resnod=schobj.node.selectNodes(obname);



		if(resnod.length==0) return null;					//node not found

		var foundnode=resnod[0];

		var rnname=dropNS(foundnode.nodeName);

		switch(rnname){

			case 'element':

				return xsElementUnmarshaller(schobj,foundnode);

				break;

			case 'attribute':

				return xsAttributeUnmarshaller(schobj,foundnode);

				break;

			case 'attributeGroup':

				return xsAttributeGroupUnmarshaller(schobj,foundnode);

				break;

			case 'group':

				return xsGroupUnmarshaller(schobj,foundnode);

				break;

			case 'notation':

				return xsNotationUnmarshaller(schobj,foundnode);

				break;

			case 'simpleType':

				return xsSimpleTypeUnmarshaller(schobj,foundnode);

				break;

			case 'complexType':

				return xsComplexTypeUnmarshaller(schobj,foundnode);

				break;

			case 'key':

				return new xsIdentityConstraint(schobj,foundnode);	//use unmarshaller?

				break;

			case 'unique':

				return new xsIdentityConstraint(schobj,foundnode);	//use unmarshaller?

				break;

			default:

				return null;	//should create unknown marshaller

				break;

		}

		return null;

	}

	

	/*	=====================================================================================

		HELPER for attributeWildcard

		determine {attributeWildcard} in xsAttributeGroup, xsSimpleContent and xsComplexContent

	========================================================================================= */

	function determineWildcard(schobj,node){	

		var cw = completeWildcard(schobj,node);

		var bw = baseWildcard(schobj,node)

		if (node.nodeName=='restriction'){

			return cw;

		}else{

			if(bw!=null){

				if (cw==null) return bw;

				cw.NSConstraint=wildcardUnion(cw.NSConstraint,bw.NSConstraint)

				return cw;

			}

			return null;

		}

		return null;

	}

	function baseWildcard(schobj,node){

		var btdef=resolvedTypeDef(schobj,node)

		var btname=btdef.typeName

		if(btname=='complexType'){

			return btdef.attWildcard;

		}else{

			return null;

		}

	}

	function localWildcard(schobj,node){		//node not <any> or <anyAttribute>

		var pfx=schobj.pfx;

		var aas=findXMLNode(node,pfx+'anyAttribute')

		if(aas.length>0) return new xsWildcard(schobj,aas[0])

		return null;

	}

	function completeWildcard(schobj,node){	//node not <any> or <anyAttribute>

		var pfx=schobj.pfx;

		var ags=findXMLNode(node,pfx+'attributeGroup')

		var aas=findXMLNode(node,pfx+'anyAttribute')

		var awabsent=new Array();

		var awnonabsent=new Array();

		var nscnonabsent=new Array();

		for (var i=0;i<ags.length;i++){

			var ag = xsAttributeGroupUnmarshaller(schobj,ags[i])

			if(ag!=null){

			if(ag.attWildcard!=null) {

				awnonabsent[awnonabsent.length]=ag.attWildcard;

				nscnonabsent[nscnonabsent.length]=ag.attWildcard.NSConstraint

			}

			}

		}

		if(awnonabsent.length==0) {

			return localWildcard(schobj,node)	//clause 1 

		}else{

			if(aas.length>0){								//clause 2.1

				var loc=localWildcard(schobj,node)

				var wiv=loc.NSConstraint;

				for(var i=0;i<nscnonabsent.length;i++){

					if (wiv=='notexpressible') break;

					wiv=wildcardIntersection(wiv,nscnonabsent[i])

				}

				loc.NSConstraint=wiv;

				return loc;

			}else{											//clause 2.2

				var loc= new Object();

				loc.processContents=	awnonabsent[0].processContents

				loc.NSConstraint=awnonabsent[0].NSConstraint

				for(var i=1;i<nscnonabsent.length;i++){

					if (loc.NSConstraint=='notexpressible') break;

					loc.NSConstraint=wildcardIntersection(loc.NSConstraint,nscnonabsent[i])

				}

				loc.annotations=null

				return loc;

			}

		}

	}

	function wildcardIntersection(a,b){	//check again with the spec if this is correct

		var wiv;

		if(a==b) {

			wiv=a;

		}else if((a=='any')||(b=='any')) {

			a=='any' ? wiv=b : wiv=a;

		}else if((a.indexOf('not ')>=0) && (b.indexOf('not ')<0)) {

			var c= a.replace('not ','')

			wiv  = b.replace(c,'')

		}else if((a.indexOf('not ')<0) && (b.indexOf('not ')>=0)) {

			var c= b.replace('not ','')

			wiv  = a.replace(c,'')

		}else if((a.indexOf('not ')<0) && (b.indexOf('not ')<0)) {

			var c=a+' '+b;

			var d=c.split(' ');

			wiv=getDuplicate(d).join(' ');

		}else if((a.indexOf('not ')>=0) && (b.indexOf('not ')>=0)) {

			wiv='notexpressible';

		}

		return wiv.replace('  ',' ');

	}

	function wildcardUnion(a,b){ //check again with the spec if this is correct

		var wiv;

		if(a==b) {

			wiv=a;

		}else if((a=='any')||(b=='any')) {

			a=='any' ? wiv=a : wiv=b;

		}else if((a.indexOf('not ')<0) && (b.indexOf('not ')<0)) {

			var c=a+' '+b;

			var d=c.split(' ');

			wiv=getUnique(d).join(' ');

		}else if((a.indexOf('not ')>=0) && (b.indexOf('not ')>=0)) {

			wiv='notexpressible';

		}else if((a.indexOf('not ')>=0) && (b.indexOf('not ')<0)) {

			var c= a.replace('not ','')

			b.indexOf(c)>=0 ? wiv='any' : wiv=a;

		}else if((a.indexOf('not ')<0) && (b.indexOf('not ')>=0)) {

			var c= b.replace('not ','')

			a.indexOf(c)>=0 ? wiv='any' : wiv=b;

		}

		return wiv.replace('  ',' ');

	}

