/*
License: GPL as per: http://www.gnu.org/copyleft/gpl.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/tool/ToolBase.js");

/**
 * Base Button object that all Buttons extend.  A Button is a tool represented
 * by an image and an optional second image for the enabled state.
 * @constructor
 * @base ToolBase
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param button Pointer to the button instance being created.
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function ButtonBase(button, toolNode, parentWidget) {
  var base = new ToolBase(button, toolNode, parentWidget);

  //set the button type
  this.buttonType = toolNode.selectSingleNode("mb:class").firstChild.nodeValue;
  if (this.buttonType == "RadioButton") this.enabled = false;

  //pre-load the button bar images; add them to the config
  this.disabledImage = document.createElement("IMG");
  this.disabledImage.src = config.skinDir + toolNode.selectSingleNode("mb:disabledSrc").firstChild.nodeValue;

  var enabledImage = toolNode.selectSingleNode("mb:enabledSrc");
  if (enabledImage) {
    this.enabledImage = document.createElement("IMG");
    this.enabledImage.src = config.skinDir + enabledImage.firstChild.nodeValue;
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
   * doAction method defined in derived classes.
   */
  this.select = function() {
    if (this.buttonType == "RadioButton") {
      if (this.parentWidget.selectedRadioButton) {
        with (this.parentWidget.selectedRadioButton) {
          image.src = disabledImage.src;
          enable(false,this);
          doSelect(false,this);
        }
      }
      this.parentWidget.selectedRadioButton = this;
      this.image.src = this.enabledImage.src;
    }

    //enable this tool and any dependancies
    this.enable(true,this);
    this.doSelect(true,this);
  }

  /**
   * Override this function in Buttons to process select/deselect calls.
   * @param selected True when selected, false when deselected.
   * @objRef Reference to this object.
   */
  this.doSelect = function(selected, objRef) {
  }

  var selected = toolNode.selectSingleNode("mb:selected");
  if (selected && selected.firstChild.nodeValue) this.selected = true;

  /**
   * Initialise buttonBase.
   * @param objRef Reference to this object.
   */
  this.buttonInit = function(objRef) {
    objRef.image = document.getElementById( objRef.id );
    if (objRef.selected) objRef.select();
  }

  // If this object is being created because a child is extending this object,
  // then child.properties = this.properties
  for (sProperty in this) {
    button[sProperty] = this[sProperty];
  }

  button.model.addListener("refresh",button.buttonInit,button);
}
