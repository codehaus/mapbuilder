/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Abstract base button object that all Buttons extend.  
 * A Button is a widget which renders an image and an optional second image 
 * for the enabled state.
 * @constructor
 * @base WidgetBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param widgetNode The tool node from the Config XML file.
 * @param model The parent model object (optional).
 */
function ButtonBase(widgetNode, model) {
  var buttonBarNode = widgetNode.selectSingleNode("mb:buttonBar");
  if ( buttonBarNode ) {
    this.htmlTagId = buttonBarNode.firstChild.nodeValue;
    //1Row added DVDE  
    this.buttonBarGroup = this.htmlTagId;    
  }
  //3 rows deleted  -7Rows added DVDE      
  var htmlTagNode = widgetNode.selectSingleNode("mb:htmlTagId");    
  if (htmlTagNode) {
    this.htmlTagId = htmlTagNode.firstChild.nodeValue;
  }
  if ((!buttonBarNode) && (!htmlTagNode)){
    alert(mbGetMessage("buttonBarRequired", widgetNode.nodeName));
  }
  //Add a tooltip to the panel_div
  // Set button text values as parameters
  if (config.widgetText) {
    var textNodeXpath = "/mb:WidgetText/mb:widgets/mb:" + widgetNode.nodeName;
    var textParams = config.widgetText.selectNodes(textNodeXpath+"/*");
    for (var j=0;j<textParams.length;j++) {
      this[textParams[j].nodeName]=textParams[j].firstChild.nodeValue;
    }
  }
  // html tag id of the div where OL places its panel code
  this.panelHtmlTagId = this.htmlTagId+'_panel';
  // create a dom node for OL to use as panel
  if (!document.getElementById(this.panelHtmlTagId)) {
	  var parentNode = document.getElementById(this.htmlTagId);
	  var olPanelNode = document.createElement('div');
	  olPanelNode.setAttribute('id', this.panelHtmlTagId);
	  olPanelNode.setAttribute('class', 'olControlPanel');
	  parentNode.appendChild(olPanelNode);
	  // workaround for IE - otherwise nothing is displayed
	  parentNode.innerHTML += ' ';
  }

  //TBD maybe move this to Mapbuilder.js
  //TBD take care of this when compressing Mapbuilder
  // load controlPanel.css for button base styles
  if (!document.getElementById('controlPanelCss')) {
	var cssNode = document.createElement('link');
	cssNode.setAttribute('id', 'controlPanelCss');
	cssNode.setAttribute('rel', 'stylesheet');
	cssNode.setAttribute('type', 'text/css');
	cssNode.setAttribute('href', config.skinDir+'/controlPanel.css');
	document.getElementsByTagName('head')[0].appendChild(cssNode);
  }

  WidgetBase.apply(this, new Array(widgetNode, model));
  
  
  //set the button type
  this.buttonType = widgetNode.selectSingleNode("mb:class").firstChild.nodeValue;
  if (this.buttonType == "RadioButton") this.enabled = false;

  //pre-load the button bar images; add them to the config
  var disabledImage = widgetNode.selectSingleNode("mb:disabledSrc");
  if (disabledImage) {
    this.disabledImage = document.createElement("IMG");
    this.disabledImage.src = config.skinDir + disabledImage.firstChild.nodeValue;
  }

  //optional second image to be displayed in the enabled state
  var enabledImage = widgetNode.selectSingleNode("mb:enabledSrc");
  if (enabledImage) {
    this.enabledImage = document.createElement("IMG");
    this.enabledImage.src = config.skinDir + enabledImage.firstChild.nodeValue;
  }

  this.cursor = 'default';

  // Check for cursor override
  var cursorNode = this.widgetNode.selectSingleNode("mb:cursor");
  if( cursorNode != null ) {
    var cursor = cursorNode.firstChild.nodeValue;
    this.cursor = cursor;
  }

  //a button may be set as selected in the config file
  var selected = widgetNode.selectSingleNode("mb:selected");
  if (selected && selected.firstChild.nodeValue) this.selected = true;

  /**
   * Gets the css classname for this button. We use this
   * to define the button styles.
   * @param objRef Reference to this object.
   * @param state 'Active' or 'Inactive' (case sensitive!)
   */
  this.getButtonClass = function(objRef, state) {
  	var cssName;
  	if (objRef.control.displayClass) {
  		cssName = objRef.control.displayClass;
  	} else {
  		cssName = objRef.control.CLASS_NAME;
	  	cssName = cssName.replace(/OpenLayers/, 'ol').replace(/\./g, '');
  	}
  	cssName += 'Item';
  	return '.' + cssName + state;
  }

  /**
   * Gets the css classname for the map pane that
   * sets the cursor according to the clicked button
   * @param objRef Reference to this object.
   */  
  this.getCursorClass = function(objRef) {
  	return 'mbCursor_'+objRef.cursor.replace(/[^A-Z^a-z]*/g, '');
  }
  
  /**
   * OpenLayers control for this button.
   * This will be filled with the instance of the control
   * by the attachToOL method.
   */
  this.control = null;

  //TBD This is never called, but I think we can drop it
  // if we get rid of MB mouse handlers
  /**
   * Override this in buttons which inherit from this object to carry out the action.
   * This is the function that will be called either when the button is selected
   * via the select() method or on a mouseup event if there is an associated 
   * mouseHandler property in config.
   */
  this.doAction = function() {}

  /**
   * Select this button. Enables and disables associated tools,
   * then the control.trigger()/activate() methods make OL call
   * the doSelect method defined in derived classes.
   */
  this.select = function() {
    if (this.control.type == OpenLayers.Control.TYPE_BUTTON) {
      this.control.trigger();
    } else {
      this.panel.activateControl(this.control);
    }
  }

  /**
   * Method overriden by subclasses
   * @param selected True when selected, false when deselected.
   * @param objRef Reference to this object.
   */
  this.doSelect = function(selected, objRef) {
  }
  
  /**
   * Attaches the control for this button to OpenLayers
   * and add it to the buttonBar. When this method is called,
   * everything of the OL map is available.
   * @param {OpenLayers.Control} control to add.
   * @param objRef Reference to this object.
   */
  this.attachToOL = function(objRef) {
  	// nothing to do here if subclass does not have a
  	// createControl method
  	if (!objRef.createControl) return;

    // DOM div element of the map pane
	  objRef.mapPaneDiv = document.getElementById(objRef.targetContext.map.div.id); 

    // override the control from the subclass to add
    // MB-stuff to the activate and deactivate methods    
    var Control = OpenLayers.Class.create();
    Control.prototype = OpenLayers.Class.inherit( objRef.createControl(objRef), {
      superclass: OpenLayers.Control.prototype,
      // call objRef.doSelect after OL activate from this control
      trigger: function() {
        if(this.superclass.trigger.call(this)) {
          objRef.doSelect(true, objRef);
        }
      },
      activate: function() {
        if (this.superclass.activate.call(this)) {
	        objRef.mapPaneDiv.className = objRef.mapPaneDiv.className.replace(/mbCursor_[a-zA-Z0-9]*/, objRef.getCursorClass(objRef));
          objRef.enabled = true;
          objRef.doSelect(true, objRef);
        }
      },
      // call objRef.doSelect after OL deactivate from this control
      deactivate: function() {
        if (this.superclass.deactivate.call(this)) {
          objRef.enabled = false;
          objRef.doSelect(false, objRef)
        }
      }
    });

    // if the subclass provides an instantiateControl() method,
    // use it for instantiation. If not, instantiate directly
    objRef.control = objRef.instantiateControl ? objRef.instantiateControl(objRef, Control) : new Control();
  	
	  // get the control from the createControl method of the subclass
  	//objRef.control = objRef.createControl(objRef);
  	var map = objRef.targetContext.map;
  	objRef.panel = objRef.targetContext.buttonBars[objRef.htmlTagId];
  	// create a panel, if we do not have one yet for this buttonBar
  	// or if the old map.panel was destroyed
    if (!objRef.panel || objRef.panel.map == null) {
    	objRef.panel = new OpenLayers.Control.Panel({div: $(objRef.panelHtmlTagId), defaultControl: null});
    	objRef.targetContext.buttonBars[objRef.htmlTagId] = objRef.panel;
	    map.addControl(objRef.panel);
    }
    
	  // add the control to the panel
    objRef.panel.addControls(objRef.control);
     
    // set tooltip for the button
    objRef.control.panel_div.title=objRef.tooltip;
    
    // add cursor css classname to map pane div if not set yet
    if (objRef.mapPaneDiv.className.indexOf('mbCursor') == -1) {
		  objRef.mapPaneDiv.className += ' mbCursor_default';
  	}

  	// create css for buttons
  	if (objRef.buttonType == 'RadioButton') {
  		var activeRule = addCSSRule(objRef.getButtonClass(objRef, 'Active'));
  		activeRule.style.backgroundImage = "url(\""+objRef.enabledImage.src+"\")";
  	}
  	var inactiveRule = addCSSRule(objRef.getButtonClass(objRef, 'Inactive'));
  	inactiveRule.style.backgroundImage = "url(\""+objRef.disabledImage.src+"\")";
  	
  	// create css for map cursor
  	var cursorRule = addCSSRule('.'+objRef.getCursorClass(objRef));
  	cursorRule.style.cursor = objRef.cursor;

	  // activate the control if it is defined as selected in config
    if(objRef.selected == true) {
		  objRef.control.activate();    	
    }    
  }

  /**
   * Set the target context for the button, initialise the
   * buttonBars array in the context document and add a
   * listener to the target model for adding controls
   * to the OL map as soon as the map is initialized.
   * @param objRef Reference to this object.
   */  
  this.buttonInit = function(objRef) {
     //set the target context
    var targetContext = objRef.widgetNode.selectSingleNode("mb:targetContext");
    if (targetContext) {
      objRef.targetContext = window.config.objects[targetContext.firstChild.nodeValue];
      if ( !objRef.targetModel ) {
        alert(mbGetMessage("noTargetContext", targetContext.firstChild.nodeValue, objRef.id));
      }
    } else {
      objRef.targetContext = objRef.targetModel;
    }
    
    // initialize button bars for the context
    if (!objRef.targetContext.buttonBars) {
    	// this array in the context will hold all
    	// buttonBars used by button widgets
    	objRef.targetContext.buttonBars = new Array();
    }
    
  	// add another event listener for the loaded context,
  	// because we need the map to add panel and buttons,
  	// and we do not have tha map yet
  	objRef.targetContext.addListener("refresh", objRef.attachToOL, objRef);
  }

  this.model.addListener("init",this.buttonInit,this);
}
