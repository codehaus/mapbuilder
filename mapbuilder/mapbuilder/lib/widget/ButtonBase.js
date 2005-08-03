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
function ButtonBase(button, widgetNode, model) {
  //stylesheet is fixed to this one
  button.stylesheet = new XslProcessor(baseDir+"/widget/Button.xsl");
  var buttonBarNode = widgetNode.selectSingleNode("mb:buttonBar");
  if ( buttonBarNode ) {
    button.htmlTagId = buttonBarNode.firstChild.nodeValue;
  } else {
    alert("buttonBar property required for object:" + widgetNode.nodeName );
  }

  var base = new WidgetBase(button, widgetNode, model);

  //set the button type
  button.buttonType = widgetNode.selectSingleNode("mb:class").firstChild.nodeValue;
  if (button.buttonType == "RadioButton") button.enabled = false;

  //pre-load the button bar images; add them to the config
  var disabledImage = widgetNode.selectSingleNode("mb:disabledSrc");
  if (disabledImage) {
    button.disabledImage = document.createElement("IMG");
    button.disabledImage.src = config.skinDir + disabledImage.firstChild.nodeValue;
  }

  //optional second image to be displayed in the enabled state
  var enabledImage = widgetNode.selectSingleNode("mb:enabledSrc");
  if (enabledImage) {
    button.enabledImage = document.createElement("IMG");
    button.enabledImage.src = config.skinDir + enabledImage.firstChild.nodeValue;
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
   * Called when a user clicks on a button.  Switches the image to the enabled 
   * button source, enables and disables associated tools, then calls the 
   * doSelect method defined in derived classes.
   */
  this.select = function() {
    if (this.buttonType == "RadioButton") {
      if (this.node.selectedRadioButton) {
        with (this.node.selectedRadioButton) {
          if (disabledImage) image.src = disabledImage.src;
          enabled = false;
          if ( mouseHandler ) mouseHandler.enabled = false;
          link.className = "mbButton";
          doSelect(false,this);
        }
      }
      this.node.selectedRadioButton = this;
      if (this.enabledImage) this.image.src = this.enabledImage.src;
      this.link.className = "mbButtonSelected";
    }

    //enable this tool and any dependancies
    this.enabled = true;
    if ( this.mouseHandler ) this.mouseHandler.enabled = true;
    this.doSelect(true,this);
  }

  /**
   * Override this function in Buttons to process select/deselect calls.
   * @param selected True when selected, false when deselected.
   * @param objRef Reference to this object.
   */
  this.doSelect = function(selected, objRef) {
  }

  //a button may be set as selected in the config file
  var selected = widgetNode.selectSingleNode("mb:selected");
  if (selected && selected.firstChild.nodeValue) button.selected = true;

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
      objRef.mouseHandler = eval("config.objects." + mouseHandler.firstChild.nodeValue);
      if (!objRef.mouseHandler) {
        alert("error finding mouseHandler:"+mouseHandler.firstChild.nodeValue+" for button:"+objRef.id);
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

  // If this object is being created because a child is extending this object,
  // then child.properties = this.properties
  for (sProperty in this) {
    button[sProperty] = this[sProperty];
  }

  button.model.addListener("refresh",button.buttonInit,button);
  button.model.addListener("init", button.initMouseHandler, button);
}
