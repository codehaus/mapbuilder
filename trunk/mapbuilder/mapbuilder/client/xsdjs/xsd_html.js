	xsElementDecl.prototype.toHTML=function(doc){

		if(this.typeDef.typeName=='simpleType'){

			var std=this.typeDef.toHTML(doc);

			if(this.valueConstraint!=null){

				readonly= ((this.valueConstraint[0]=='fixed')) ?true:false;

				std.setAttribute('value',this.valueConstraint[1]);

				std.setAttribute('readOnly',readonly)

			}

			return std;

		}else{

			//var ctname=(this.typeDef.name==null)?this.typeDef.baseTypeDef.name:this.typeDef.name;

			var ctname=this.typeDef.name;

			if(ctname==null) ctname=this.typeDef.baseTypeDef.name;

			if(ctname=='anyType') ctname='unnamed type';;

			var bt = createButton(doc,ctname,'button1');

			return bt;

		}

	}



	xsAttributeDecl.prototype.toHTML=function(doc){

		var hw = new htmlWidget();

		hw.init(doc);

		var attname=(this.name!=null)?this.name:'anon';

		var sp=createSpan(doc,attname,'stattrib')

		hw.maindiv.appendChild(sp);

		var std=this.typeDef.toHTML(doc);	//simpleType

		if(this.valueConstraint!=null){

			readonly= ((this.valueConstraint[0]=='fixed')) ?true:false;

			std.setAttribute('value',this.valueConstraint[1]);

			std.setAttribute('readOnly',readonly)

		}

		var attbname=(this.typeDef.name)?this.typeDef.name:this.typeDef.baseTypeDef.name;

		var tp=createSpan(doc,(' '+attbname),'sti')

		hw.widget=hw.maindiv.appendChild(std);

this.widget=hw.widget;

		hw.maindiv.appendChild(tp);

		return hw;

	}



	xsAttributeUse.prototype.toHTML=function(doc){

		var std=this.attDecl.toHTML(doc);

		if(this.required==true){

			var rsp=createSpan(doc,' (required) ',null)

			std.maindiv.appendChild(rsp);

		}

		if(this.valueConstraint!=null){

			readonly= ((this.valueConstraint[0]=='fixed'))? true:false;

			std.widget.setAttribute('value',this.valueConstraint[1]);

			std.widget.setAttribute('readOnly',readonly)

		}

		return std;

	}



	xsAttributeGroup.prototype.toHTML=function(doc){

		var hw = new htmlWidget();

		hw.init(doc);

		for(var i=0;i<this.attUses.length;i++){

			var std=this.attUses[i].attDecl.typeDef.toHTML(doc);	//should be a simpleType

			hw.maindiv.appendChild(std)

		}

		return hw;

	}



	xsGroup.prototype.toHTML=function(doc){

		var mg=this.modelGroup.toHTML(doc);	//should be a xsModelGroup

		return mg

	}



	xsModelGroup.prototype.toHTML=function(doc){

		var hw = new htmlWidget();

		hw.init(doc);

		//hw.maindiv.appendChild(createSpan(doc,this.compositor+' ','stcompositor'))

		switch(this.compositor){

			case('all'):

				for (var i=0;i<this.particles.length;i++){

					var seq=this.particles[i].toHTML(doc)

					hw.maindiv.appendChild(seq.container);

				}

				break;

			case('sequence'):

				for (var i=0;i<this.particles.length;i++){

					var seq=this.particles[i].toHTML(doc)

					hw.maindiv.appendChild(seq.container);

				}

				break;

			case('choice'):

				var tdfs=new Array()

				for (var i=0;i<this.particles.length;i++){

					var pname=(this.particles[i].term.name)?this.particles[i].term.name:'anonymous';

					tdfs[tdfs.length]=[pname,i]

				}

				var sel=createSelect(doc,tdfs);

				sel.setAttribute('className','stelement');

				var prts = this.particles;

				if(autoexpand){

					expandToDiv(prts[sel.value],hw.expdiv,true);

				}else{

					sel.onclick=function(){expandToDiv(prts[sel.value],hw.expdiv,true)};

				}

				hw.widget=hw.maindiv.appendChild(sel)

this.widget=hw.widget;

				break;

		}

		return hw;

	}

	xsParticle.prototype.toHTML=function(doc,stripname){

		var hw = new htmlWidget();

		hw.init(doc);

		var obj=this.term

		switch (obj.typeName){

			case ('elementDecl'):

				var ctname=(obj.typeDef.name==null)?obj.typeDef.baseTypeDef.name:obj.typeDef.name;

				info=createSpan(doc,' '+ctname,'sti');

				var sbl = obj.subs.list.length;

				var wgt = obj.toHTML(doc);

				if(sbl==0){

					hw.namewidget = createSpan(doc,obj.name,'stelement');

					if(obj.typeDef.typeName!='simpleType'){

						info.firstChild.nodeValue='';

						if(autoexpand){

							expandToDiv(obj.typeDef,hw.expdiv);

						}else{

							wgt.onclick=function(){expandToDiv(obj.typeDef,hw.expdiv)}

						}

					}

				}else{

					var sgs = [[obj.name,0]];

					var sbs = [obj]				//TO DO : must check if this is an abstract element

					for (var i=0;i<sbl;i++){

						sgs[sgs.length]=[obj.subs.list[i].name,i+1]

						sbs[sbs.length]=obj.subs.list[i];

					}

					hw.namewidget=createSelect(doc,sgs);

					hw.namewidget.setAttribute('className','stelement');

					if(obj.typeDef.typeName!='simpleType')	info.firstChild.nodeValue='';

					if(autoexpand){

						expandToDiv(sbs[hw.namewidget.value].typeDef,hw.expdiv);

					}else{

						wgt.onclick=function(){expandToDiv(sbs[hw.namewidget.value].typeDef,hw.expdiv)}

						hw.namewidget.onclick=function(){

							var ctname=(sbs[hw.namewidget.value].typeDef.name==null)?sbs[hw.namewidget.value].typeDef.baseTypeDef.name:sbs[hw.namewidget.value].typeDef.name;

							wgt=sbs[hw.namewidget.value].toHTML(doc);

							hw.widget.parentNode.replaceChild(wgt,hw.widget);

							hw.widget=wgt;

							hw.widget.onclick=function(){expandToDiv(sbs[hw.namewidget.value].typeDef,hw.expdiv)}

							if(sbs[hw.namewidget.value].typeDef.typeName!='simpleType') hw.info.firstChild.nodeValue='';

							while(hw.expdiv.childNodes.length>0){

								hw.expdiv.removeChild(hw.expdiv.firstChild);

							}

						}

					}

				}



				if(!stripname){

					if(hw.namewidget) hw.maindiv.appendChild(hw.namewidget);

				}

				hw.widget=hw.maindiv.appendChild(wgt);

				hw.info=hw.maindiv.appendChild(info);

				if((this.minOccurs!=1)||(this.maxOccurs!=1)){

					hw.maindiv.appendChild(createSpan(doc,' ('+this.minOccurs+', '+this.maxOccurs+') ',null));

				}

				if((this.maxOccurs>1)||(this.maxOccurs=='unbounded')){

					var addbt=createButton(doc,'Add','button1')

					if(autoexpand) addbt.onclick=function(){alert('not yet functional')}

					hw.maindiv.appendChild(addbt);

				}

				break;



			case ('wildcard'):

				var obw = obj.toHTML(doc);

				hw.widget=hw.maindiv.appendChild(obw);

				if((this.minOccurs!=1)||(this.maxOccurs!=1)){

					var mmd=createSpan(doc,' ('+this.minOccurs+', '+this.maxOccurs+') ',null);

				}

				hw.widget=hw.maindiv.appendChild(mmd);

				break;



			case ('modelGroup'):

				if((this.minOccurs!=1)||(this.maxOccurs!=1)){

					hw.maindiv.appendChild(createSpan(doc,obj.compositor+' ','stcompositor'))

					var mmd=createSpan(doc,' ('+this.minOccurs+', '+this.maxOccurs+') ',null);

					hw.widget=hw.maindiv.appendChild(mmd);

				}

				var obw = obj.toHTML(doc);

				hw.maindiv.appendChild(obw.container);

				break;

		}

		return hw;

	}



	xsWildcard.prototype.toHTML=function(doc){

		var ta=createTextArea(doc,'',false)

		ta.setAttribute('className','stf')

		return ta

	}



	xsSimpleUrType.prototype.toHTML=function(doc){

		return createTextArea(doc,'anysimpletype',false);

	}

	xsUrType.prototype.toHTML=function(doc){

		var hw = new htmlWidget();

		hw.init(doc);

		var ta=createTextArea(doc,'',false)

		ta.setAttribute('rows',2)

		hw.widget=hw.maindiv.appendChild(ta);

this.widget=hw.widget;

		return hw

	}

	xsSimpleType.prototype.toHTML=function(doc){

		var envals=this.getEnumeration();

		if(envals.length>0) {

			return createSelect(doc,envals);

		}else{

			return createTextArea(doc,null,false);

		}

	}

	xsSimpleType.prototype.toHTMLMemberSelect=function(doc){	//for variety=union

		var tdfs=new Array()

		for(var i=0;i<this.memberTypeDefs.length;i++){

			tdfs[tdfs.length]=[this.memberTypeDefs[i].name,i]

		}

		return createSelect(doc,tdfs);

	}



	xsComplexType.prototype.toHTML=function(doc){

		var hw = new htmlWidget();

		hw.init(doc);

		if(this.attUses.length>0){

			for(var i=0;i<this.attUses.length;i++){

				var au=this.attUses[i].toHTML(doc);

				hw.maindiv.appendChild(au.container);

			}

		}

		//var contval=(this.contentType=='empty')? 'content empty' : 'content' ;

		if(this.contentType!='empty'){

			if(this.contentType.typeName=='simpleType'){

				var ct = this.contentType.toHTML(doc);	//create a textarea/select as widget

				hw.widget=hw.maindiv.appendChild(ct);

				this.widget=hw.widget;

			}else{

				var content=this.contentType[1];

//if(this.name=='FeatureCollectionType') iterateProps(content.term)

				if(content.typeName=='simpleType'){

					//var ct = this.contentType.toHTML(doc);

					//hw.widget=hw.maindiv.appendChild(ct);

					//this.widget=hw.widget;

				}else{

					var ct = content.toHTML(doc);

					hw.maindiv.appendChild(ct.container);

				}

			}

		}else{

			//var span = createSpan(doc,'empty content',null);

			//hw.maindiv.appendChild(span);

			//var ta=createTextArea(doc,null,false)

			//ta.setAttribute('className','str')

			//hw.widget=hw.maindiv.appendChild(ta);

		}

		return hw;

	}



	xsNotation.prototype.toHTML=function(doc){

		return createSpan(doc,'notation',null);

	}

	xsAnnotation.prototype.toHTML=function(doc){

		return createSpan(doc,'annotation',null);

	}

//	*************************************************************************************



	function htmlWidget(){

		this.container=null;		//container

		this.maindiv= null;		//title,widget,info/button

		this.namewidget = null;		

		this.widget = null;		//textarea,input,select if any;

		this.expdiv = null;		//expansion slot for complex type etc;

	}

	htmlWidget.prototype.setWidgetValue=function(value){

		if(widget.getAttribute('readOnly')=='true') return;

		if(this.widget.nodeName=='select') {

			if(this.widget.options==null) return

			for (var i=0;i<this.widget.options.length;i++){

				if(this.widget.options[i].value==value) this.widget.selectedIndex=i

			}

		}else{

			this.widget.value=value

		}

	}

	htmlWidget.prototype.init=function(doc){

		this.container=createDiv(doc,null);

		this.maindiv=createDiv(doc,null);

		this.expdiv=createDiv(doc,'stdexp');

		this.container.appendChild(this.maindiv);

		this.container.appendChild(this.expdiv);

	}

	function createDiv(doc,classname){

		var d=doc.createElement('div');

		if(classname!=null) d.setAttribute('className',classname);

		return d;

	}

	function createSpan(doc,value,classname){

		var sp=doc.createElement('span');

		if(value!=null) sp.appendChild(doc.createTextNode(value));

		if(classname!=null) sp.setAttribute('className',classname);

		return sp;

	}

	function createSelect(doc,vls){

		var sel=doc.createElement('select');

		for(var i=0;i<vls.length;i++){

			var op=document.createElement('option')

			op.setAttribute('text',vls[i][0]);

			op.setAttribute('value',vls[i][1]);

			sel.add(op);

		}

		return sel;

	}

	function createButton(doc,value,classname){

		var w=doc.createElement('button');

		w.setAttribute('type','button');

		if((value==null)&&(value=='')) value='button'

		w.appendChild(doc.createTextNode(value));

		if(classname!=null) w.setAttribute('className',classname);

		return w;

	}

	function createTextArea(doc,value,readonly){

		var ta=doc.createElement('textarea');

		var cols=40;

		if(value==null) value=''

		rows=(value.toString().length>cols)?2:1;

		ta.setAttribute('rows',rows);

		ta.setAttribute('cols',cols);

		if(readonly) ta.setAttribute('readOnly',readonly);

		ta.value=(value!=null)?value:'';

		return ta;

	}



	function expandToDiv(obj,whereto,stripname){

		if(whereto.childNodes.length>0) {

			while(whereto.childNodes.length>0){

				whereto.removeChild(whereto.firstChild);

			}

		}else{

			var hw=obj.toHTML(whereto.ownerDocument,stripname);

			if(hw.container!=null) whereto.appendChild(hw.container);

		}

	}



