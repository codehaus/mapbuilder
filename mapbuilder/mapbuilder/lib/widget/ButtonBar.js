/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * A widget which contains a collection of buttons.  Supports radio buttons,
 * select buttons and simple push buttons.  A radio button can
 * be selected (Eg a ZoomInButton) and will determine how mouse clicks on a
 * MapPane are processed.
 * ButtonBar tools process mouseClicks on behalf of the mouseWidget. The
 * mouseWidget is usually a MapPane.  If the mouseWidget property is not set in 
 * config, then the mouseUp action only happens when the button is click
 * This widget extends WidgetBase.
 * @constructor
 * @param widgetNode  The widget's XML object node from the configuration document.
 * @param model       The model object that this widget belongs to.
 */
function ButtonBar(widgetNode, model) {
  var base = new WidgetBase(widgetNode, model);
  for (sProperty in base) { 
    this[sProperty] = base[sProperty]; 
  } 

  /**
   * Render this widget.
   * This over-rides the default paint() method to transform the config doc 
   * instead of the model.
   */
  this.paint = function() {
    var s = this.stylesheet.transformNode(config.doc);
    this.node.innerHTML=s;
    this.callListeners("paint");
  }

  // if the mouseWidget property is defined for this tool then, a mouseup event 
  // listeners is registered with that widget, otherwise mouseup event is for 
  // the button image itself
  var mouseWidget = widgetNode.selectSingleNode("mouseWidget");
  if (mouseWidget) {
    this.mouseWidget = eval(mouseWidget.firstChild.nodeValue);

    /**
     * Process mouseup event to select a different button.
     * @param objRef      Pointer to this ButtonBar object.
     * @param targetNode  The node for the enclosing HTML tag for this widget
     */
    this.mouseUpHandler = function(objRef,targetNode) {
      objRef.selectedRadioButton.mouseUpHandler(objRef.model,targetNode) 
    }
    this.mouseWidget.addListener('mouseup',this.mouseUpHandler,this);
  }

  /**
   * Called when a user clicks on a button.
   * @param buttonName Name of the button.
   * @param buttonType "RadioButton", "Button" or "SelectBox".
   */
  this.selectButton = function(buttonName, buttonType) {

    switch(buttonType){
      case "RadioButton":
        //disable tools
        //TBD: need a way to not hard code these; loop through xml nodes?
        this.mouseWidget.tools["AoiMouseHandler"].enable(false);
        this.mouseWidget.tools["DragPanHandler"].enable(false);

        // Deselect previous RadioButton
        if (this.selectedRadioButton){
          this.selectedRadioButton.image.src=this.selectedRadioButton.disabledImage.src;
        }
        this.selectedRadioButton=this.tools[buttonName];
        this.selectedRadioButton.image.src = this.selectedRadioButton.enabledImage.src;
        this.selectedRadioButton.selectButton();
        break;
      case "Button":
        this.tools[buttonName].selectButton();
        break;
      case "SelectBox":
        break;
      default:
        alert("ButtonBar.js: Unknown buttonType: "+buttonType);
    }
  }


  /**
   * Initialise the widget after the widget tags have been created by the first paint().
   */
  this.postPaintInit = function() {
    var initialMode = this.widgetNode.selectSingleNode("initialMode").firstChild.nodeValue;
    this.selectButton( initialMode, "RadioButton" );
  }

  config.buttonBar = this;
}
