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
 * @author Mike Adair mike.adairATccrs.nrcan.gc.ca
 * @param toolNode The tool node from the Config XML file.
 * @param parentWidget The ButtonBar node from the Config XML file.
 */
function ButtonBase(toolNode, parentWidget) {
  var base = new ToolBase(toolNode, parentWidget);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  this.title = toolNode.selectSingleNode("tooltip").firstChild.nodeValue;
  this.buttonType = toolNode.selectSingleNode("class").firstChild.nodeValue;
  if (this.buttonType == "RadioButton") this.enabled = false;


  //pre-load the button bar images; add them to the config
  this.disabledImage = document.createElement("IMG");
  this.disabledImage.src = config.skinDir + toolNode.selectSingleNode("disabledSrc").firstChild.nodeValue;
  this.disabledImage.title = this.title;         //img.title is for tool tips, alt for images disabled browsers

  var modalImage = toolNode.selectSingleNode("enabledSrc");
  if (modalImage) {
    this.enabledImage = document.createElement("IMG");
    this.enabledImage.src = config.skinDir + modalImage.firstChild.nodeValue;
    this.enabledImage.title = this.title;         //img.title is for tool tips, alt for images disabled browsers
  }

  this.image = document.getElementById( this.id );
  this.image.title = this.title;         //img.title is for tool tips, alt for images disabled browsers

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
          enable(false);
        }
      }
      this.parentWidget.selectedRadioButton = this;
      this.image.src = this.enabledImage.src;
    }

    //enable this tool and any dependancies
    this.enable(true);

    if (this.mouseHandler==null) {
      this.doAction(this);
    }
  }

  var selected = toolNode.selectSingleNode("selected");
  if (selected && selected.firstChild.nodeValue) this.selected = true;
}
