/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

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

  //stylesheet is fixed to this one
  this.stylesheet = new XslProcessor(baseDir+"/widget/Button.xsl", model.namespace);
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

  WidgetBaseXSL.apply(this, new Array(widgetNode, model));

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
  var cursorNode = this.widgetNode.selectSingleNode("mb:cursor");
  if( cursorNode != null ) {
    var cursor = cursorNode.firstChild.nodeValue;
    this.cursor = cursor;
  } else {
    this.cursor = "default"; // Adding support for customized cursors
  }

  /**
   * Override of widgetBase prePaint to set the doc to be styled as the widget
   * node in config for this button.
   * @param objRef Pointer to this object.
   */
  this.prePaint = function(objRef) {
    objRef.resultDoc = objRef.widgetNode;
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

    //changed 3 lines: this.node -> this.groupnode DVDE       
    if (this.buttonType == "RadioButton") {
      if (this.groupnode.selectedRadioButton) {
        with (this.groupnode.selectedRadioButton) {
          if (disabledImage) image.src = disabledImage.src;
          enabled = false;
          if ( mouseHandler ) mouseHandler.enabled = false;
          link.className = "mbButton";
          doSelect(false,this);
        }
      }
      this.groupnode.selectedRadioButton = this;
      if (this.enabledImage) this.image.src = this.enabledImage.src;
      this.link.className = "mbButtonSelected";
    }
    
    //enable this tool and any dependancies
    this.enabled = true;
    if ( this.mouseHandler ) this.mouseHandler.enabled = true;
    this.doSelect(true,this);
  }

  /**
   * Method overriden by subclasses
   * @param selected True when selected, false when deselected.
   * @param objRef Reference to this object.
   */
  this.doSelect = function(selected, objRef) {
  }

  //a button may be set as selected in the config file
  var selected = widgetNode.selectSingleNode("mb:selected");
  if (selected && selected.firstChild.nodeValue) this.selected = true;

  /**
   * A listener method to initialize the mouse handler, if configured.  This is
   * called as an init event so that the object pointed to is guaranteed to 
   * be instantiated.
   * @param objRef Reference to this object.
   */
  this.initMouseHandler = function(objRef) {
    /** Mouse handler which this tool will register listeners with. */
    var mouseHandler = objRef.widgetNode.selectSingleNode("mb:mouseHandler");
    if (mouseHandler) {
      objRef.mouseHandler = window.config.objects[mouseHandler.firstChild.nodeValue];
      if (!objRef.mouseHandler) {
        alert(mbGetMessage("noMouseHandlerButton", mouseHandler.firstChild.nodeValue, objRef.id));
      }
    } else {
      objRef.mouseHandler = null;
    }
  }

  /**
   * Initialise image for the button and select it if required.
   * @param objRef Reference to this object.
   */
  this.buttonInit = function(objRef) {
    objRef.image = document.getElementById( objRef.id+"_image" );
    objRef.link = document.getElementById( objRef.outputNodeId );
    if (objRef.selected) objRef.select();
  }

  this.model.addListener("refresh",this.buttonInit,this);
  this.model.addListener("init", this.initMouseHandler, this);
}
