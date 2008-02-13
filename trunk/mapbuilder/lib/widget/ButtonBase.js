/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/util/Util.js");
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

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
  WidgetBase.apply(this, new Array(widgetNode, model));

  var buttonBarNode = widgetNode.selectSingleNode("mb:buttonBar");
  if ( buttonBarNode ) {
    this.htmlTagId = buttonBarNode.firstChild.nodeValue;
  }
  var htmlTagNode = widgetNode.selectSingleNode("mb:htmlTagId");    
  if (htmlTagNode) {
    this.htmlTagId = htmlTagNode.firstChild.nodeValue;
  }
  if ((!buttonBarNode) && (!htmlTagNode)){
    alert(mbGetMessage("buttonBarRequired", widgetNode.nodeName));
  }
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

  // load controlPanel.css for button base styles
  loadCss('controlPanel.css');

  //set the button type
  var buttonType = widgetNode.selectSingleNode("mb:class")
  this.buttonType = buttonType ? getNodeValue(buttonType).toUpperCase() : null;
  if (this.buttonType == "RADIOBUTTON") this.enabled = false;
  
  // map between MB and OL button types
  this.olButtonType = {
      "RADIOBUTTON" : OpenLayers.Control.TYPE_TOOL,
      "TOOL"        : OpenLayers.Control.TYPE_TOOL,
      "BUTTON"      : OpenLayers.Control.TYPE_BUTTON,
      "TOGGLE"      : OpenLayers.Control.TYPE_TOGGLE
  }

  //set the button action
  var action = widgetNode.selectSingleNode("mb:action");
  if (action) {
    this.action = action.firstChild.nodeValue;
  }
  
  // set the button tooltip
  var tooltip = widgetNode.selectSingleNode("mb:tooltip");
  if (tooltip) {
    this.tooltip = tooltip.firstChild.nodeValue;
  }

  //pre-load the button bar images; add them to the config
  var disabledImage = widgetNode.selectSingleNode("mb:disabledSrc");
  if (disabledImage) {
    this.disabledImage = config.skinDir + disabledImage.firstChild.nodeValue;
  }

  //optional second image to be displayed in the enabled state
  var enabledImage = widgetNode.selectSingleNode("mb:enabledSrc");
  if (enabledImage) {
    this.enabledImage = config.skinDir + enabledImage.firstChild.nodeValue;
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
   * @param objRef Reference to this object.
   * @param selected True when selected, false when deselected.
   */
  this.doSelect = function(objRef, selected) {
  }
  
  /**
   * Attaches the control for this button to OpenLayers
   * and add it to the buttonBar. When this method is called,
   * everything of the OL map is available.
   * @param {OpenLayers.Control} control to add.
   * @param objRef Reference to this object.
   */
  this.attachToOL = function(objRef,refreshId) {
    if (objRef.control) {
      return;
    }
  
    //pass in a widget ID to refresh only that widget
    if (refreshId && (refreshId!=objRef.id)) return;
    
    // nothing to do here if subclass does not have a
    // createControl method
    if (!objRef.createControl) return;

    // override the control from the subclass to add
    // MB-stuff to the activate and deactivate methods
    var SubclassControl = objRef.createControl(objRef);
    var type = objRef.olButtonType[objRef.buttonType] ||
        SubclassControl.prototype.type;
        
    var Control = OpenLayers.Class( SubclassControl, {
      objRef: objRef,
      type: type,
      superclass: SubclassControl.prototype,
      // call objRef.doSelect after OL activate from this control
      trigger: function() {
        if(this.superclass.trigger) {
          this.superclass.trigger.call(this);
        }
        objRef.doSelect(objRef, true);
      },
      activate: function() {
        if (this.superclass.activate.call(this)) {
          this.panel_div.style.backgroundImage = "url(\""+objRef.enabledImage+"\")";
      	  this.map.div.style.cursor = objRef.cursor;
      	  // store the cursor with the map object; this will be applied
      	  // to the map div again when setting the aoi on the
      	  // OpenLayers moveend event
      	  this.map.mbCursor = objRef.cursor;
          objRef.enabled = true;
          this.active = true;
          objRef.doSelect(objRef, true);
        }
      },
      // call objRef.doSelect after OL deactivate from this control
      deactivate: function() {
        if (this.superclass.deactivate.call(this)) {
          this.panel_div.style.backgroundImage = "url(\""+objRef.disabledImage+"\")";
          objRef.enabled = false;
          this.active = false;
          if (map.getControlsBy("active", true).length == 0) {
            this.map.div.style.cursor = "";
            this.map.mbCursor = "";
          }
          objRef.doSelect(objRef, false)
        }
      },
      destroy: function() {
        try {
          this.superclass.destroy.apply(this, arguments);
        } catch(e) {
          OpenLayers.Control.prototype.destroy.apply(this, arguments);
        }
        this.superclass = null;
        OpenLayers.Event.stopObservingElement(this.panel_div);
        this.objRef.panel.div.removeChild(this.panel_div);
        this.objRef.control = null;
        this.objRef = null;
        this.panel_div = null;
        this.div = null;
      }
    });

    // if the subclass provides an instantiateControl() method,
    // use it for instantiation. If not, instantiate directly
    if (!objRef.control) {
      objRef.control = objRef.instantiateControl ? objRef.instantiateControl(objRef, Control) : new Control();
    }
    
    // get the control from the createControl method of the subclass
    //objRef.control = objRef.createControl(objRef);
    var map = objRef.targetContext.map;
    objRef.panel = objRef.targetContext.buttonBars[objRef.htmlTagId];
    // create a panel, if we do not have one yet for this buttonBar
    // or if the old map.panel was destroyed
    if (!objRef.panel || objRef.panel.map == null) {
      // create a dom node for OL to use as panel
      if (!document.getElementById(objRef.panelHtmlTagId)) {
        var olPanelNode = document.createElement('div');
        olPanelNode.setAttribute('id', objRef.panelHtmlTagId);
        olPanelNode.setAttribute('class', 'olControlPanel');
        var parentNode = objRef.getNode();
        parentNode.appendChild(olPanelNode);
        parentNode.innerHTML += " ";
      }
      var Panel = OpenLayers.Class( OpenLayers.Control.Panel, {
        div: document.getElementById(objRef.panelHtmlTagId),
        defaultControl: null,
        destroy: function() {
          parentNode.removeChild(this.div);
          OpenLayers.Control.prototype.destroy.apply(this, arguments);
          this.div = null;
          objRef.panel = null;
        }
      });
      objRef.panel = new Panel();
      objRef.targetContext.buttonBars[objRef.htmlTagId] = objRef.panel;
      map.addControl(objRef.panel);
    }
    
    // add the control to the panel
    if (OpenLayers.Util.indexOf(objRef.control, objRef.panel.controls) == -1) {
      objRef.panel.addControls(objRef.control);
    }
     
    // set tooltip for the button
    if (objRef.tooltip) {
      objRef.control.panel_div.title=objRef.tooltip;
    }
    
    //set default css style properties
    objRef.control.panel_div.style.backgroundImage = "url(\""+objRef.disabledImage+"\")";
          
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
  this.model.removeListener("newNodel", this.clearWidget, this);
}
