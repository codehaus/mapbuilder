/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Abstract base Button object that all Buttons extend.  
 * A Button is a widget which renders an image and an optional second image 
 * for the enabled state.
 * @constructor
 * @base WidgetBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param button Pointer to the button instance being created.
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

  // Check for cursor override
  //TBD does nothing in MapPaneOL so far
  var cursorNode = this.widgetNode.selectSingleNode("mb:cursor");
  if( cursorNode != null ) {
    var cursor = cursorNode.firstChild.nodeValue;
    this.cursor = cursor;
  } else {
    this.cursor = "default"; // Adding support for customized cursors
  }
  
  //a button may be set as selected in the config file
  var selected = widgetNode.selectSingleNode("mb:selected");
  if (selected && selected.firstChild.nodeValue) this.selected = true;

  /**
   * Gets the css classname for this widget. We use this
   * in Button.xsl to define the button styles.
   * @param objRef Reference to this object.
   * @param state 'Active' or 'Inactive' (case sensitive!)
   */
  this.getCssName = function(objRef, state) {
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
   * Override this in buttons which inherit from this object to carry out the action.
   * This is the function that will be called either when the button is selected
   * via the select() method or on a mouseup event if there is an associated 
   * mouseHandler property in config.
   */
  this.doAction = function() {}

  /**
   * Called when a user clicks on a this.  Switches the image to the enabled 
   * button source, enables and disables associated tools, then calls the 
   * doSelect method defined in derived classes.
   */
  this.select = function() {
  
    // Add support to change cursors in the map area based on:
    // either user selected cursor in config file using <cursor> tag
    // or default tool cursor as defined in constructor   
    var a = document.getElementById("mainMapContainer");
    if( a != null ) {
      // default or user selected cursor
      a.style.cursor = this.cursor;
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
   * Add the OL control for this button to the map when
   * it is loaded. Method overridden by subclasses. Usually
   * just calls the setControl method.
   * @param objRef Reference to this object.
   */
  this.addToMap = function(objRef) {
  	objRef.setControl(objRef.control, objRef);
  }

  /**
   * Sets the OL control for this button and add it
   * to the buttonBar.
   * @param {OpenLayers.Control} control to add.
   * @param objRef Reference to this object.
   */
  this.setControl = function(control, objRef) {
  	var map = objRef.targetModel.map;
  	var panel = objRef.targetModel.buttonBars[objRef.htmlTagId];
  	// create a panel, if we do not have one yet for this buttonBar
    if (!panel) {
    	panel = new OpenLayers.Control.Panel({div: $(objRef.panelHtmlTagId), defaultControl: null});
    	objRef.targetModel.buttonBars[objRef.htmlTagId] = panel;
	    map.addControl(panel);
    }

    panel.addControls(control);
    if (objRef.selected == true) {
		control.activate();
  	}

	// create css
	if (this.buttonType == 'RadioButton') {
		var activeRule = addCSSRule(this.getCssName(this, 'Active'));
		activeRule.style.backgroundImage = "url(\""+this.enabledImage.src+"\")";
	}
	var inactiveRule = addCSSRule(this.getCssName(this, 'Inactive'));
	inactiveRule.style.backgroundImage = "url(\""+this.disabledImage.src+"\")";
  }

  /**
   * Initialise the buttonBars array in the context document
   * and add a listener to the target model for adding controls
   * to the OL map as soon as it is initialized.
   * @param objRef Reference to this object.
   */  
  this.buttonInit = function(objRef) {
    if (!objRef.targetModel.buttonBars) {
    	// this array in the context will hold all
    	// buttonBars used by button widgets
    	objRef.targetModel.buttonBars = new Array();
    }
	// add another event listener for the loaded context,
	// because we need the map to add panel and buttons,
	// and we do not have tha map yet
  	objRef.targetModel.addListener("refresh", objRef.addToMap, objRef);
  }

  this.model.addListener("refresh",this.buttonInit,this);
}
