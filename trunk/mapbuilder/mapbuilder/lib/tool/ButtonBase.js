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
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function ButtonBase(button, toolNode, parentWidget) {
  var base = new ToolBase(button, toolNode, parentWidget);

  //set the button type
  button.buttonType = toolNode.selectSingleNode("mb:class").firstChild.nodeValue;
  if (button.buttonType == "RadioButton") button.enabled = false;

  //pre-load the button bar images; add them to the config
  button.disabledImage = document.createElement("IMG");
  button.disabledImage.src = config.skinDir + toolNode.selectSingleNode("mb:disabledSrc").firstChild.nodeValue;

  var enabledImage = toolNode.selectSingleNode("mb:enabledSrc");
  if (enabledImage) {
    button.enabledImage = document.createElement("IMG");
    button.enabledImage.src = config.skinDir + enabledImage.firstChild.nodeValue;
  }

  /**
   * Override this in buttons which inherit from this object to carry out the action.
   * This is the function that will be called either when the button is selected
   * via the select() method or on a mouseup event if there is an associated 
   * mouseHandler property in config.
   */
  button.doAction = function() {}

  /**
   * Called when a user clicks on a button.  Switches the image to the enabled 
   * button source, enables and disables associated tools, then calls the 
   * doAction method defined in derived classes.
   */
  button.select = function() {
    if (this.buttonType == "RadioButton") {
      if (this.parentWidget.selectedRadioButton) {
        with (this.parentWidget.selectedRadioButton) {
          image.src = disabledImage.src;
          enable(false,this);
        }
      }
      this.parentWidget.selectedRadioButton = this;
      this.image.src = this.enabledImage.src;
    }

    //enable this tool and any dependancies
    this.enable(true,this);

    if (this.mouseHandler) {
      //let the mousehandler call doAction
    } else {
      this.doAction(this);
    }
  }

  var selected = toolNode.selectSingleNode("mb:selected");
  if (selected && selected.firstChild.nodeValue) button.selected = true;

  /**
   * Initialise buttonBase.
   */
  button.buttonInit = function(buttonRef) {
    buttonRef.image = document.getElementById( buttonRef.id );
    if (buttonRef.selected) buttonRef.select();
  }
  button.model.addListener("refresh",button.buttonInit,button);

}
