/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id: ButtonBase.js,v 1.18 2005/09/20 13:16:44 graphrisc Exp $
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

  this.cursor = "default";  // Adding support for customized cursors

  //stylesheet is fixed to this one
  this.stylesheet = new XslProcessor(baseDir+"/widget/Button.xsl");
  var buttonBarNode = widgetNode.selectSingleNode("mb:buttonBar");
  if ( buttonBarNode ) {
    this.htmlTagId = buttonBarNode.firstChild.nodeValue;
  } else {
    alert("buttonBar property required for object:" + widgetNode.nodeName );
  }

  WidgetBaseXSL.apply(this, new Array(widgetNode, model));

  //set the button type
  this.buttonType = widgetNode.selectSingleNode("mb:class").firstChild.nodeValue;
  if (this.buttonType == "RadioButton") this.enabled = false;
  if (this.buttonType == "State3Button") this.state = "0"; // 0=disabled
  
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
  
  //optional third image to be displayed in the paused state
  var pausedImage = widgetNode.selectSingleNode("mb:pausedSrc");
  if (pausedImage) {
    this.pausedImage = document.createElement("IMG");
    this.pausedImage.src = config.skinDir + pausedImage.firstChild.nodeValue;
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
   * State3Button: 0=disabled, 1=enabled, 2=paused
   */   
    this.select = function() {
    if (this.buttonType == "RadioButton") {
        if (this.node.selectedRadioButton) { 
            if(this.node.selectedRadioButton.buttonType =="State3Button"){
                // -------- set state=2 (paused), stop MouseHandler and enable the new button  ---------
                with (this.node.selectedRadioButton) {
                  state="1"; // = paused
                  if (disabledImage) image.src = disabledImage.src;
                  enabled=false;
                  if (mouseHandler) mouseHandler.enabled = false;
                  link.className = "mbButton";
                  doSelect(false,this);
                  this.model.setParam("clearMouseLine");
                } 
                this.enableButton(this);
            } 
            else {
                //-------- disable the selected button and enable the new button ---------
                this.disableButton(this.node.selectedRadioButton);
                this.enableButton(this);
                //this.model.setParam("clearMouseLine");
            }        
        }
        else {
          this.enableButton(this);
        }
    }
    
    if (this.buttonType == "State3Button") {
      if (this.node.selectedRadioButton) { 
        if(this.node.selectedRadioButton.buttonType =="State3Button") {
          if (this.node.selectedRadioButton.id == this.id){ // check if it's the same State3Button: true --> disable it
            this.enableButton(this.node.selectedRadioButton);
            this.state="1";
            
            this.model.setParam("clearMouseLine");
            this.model.setParam("clearMeasurementLine");
          }
          else { // false = different State3Buttons --> selected button to state=pause, check state of new button to set corresponding new state
            /*with (this.node.selectedRadioButton) {
              state="2"; // = paused
              enabled=false;
              if (pausedImage) image.src = pausedImage.src;
              if (mouseHandler) mouseHandler.enabled = false;
              link.className = "mbButton";
              doSelect(false,this);
            } */
            //check state...
            var currentState = this.state;
            switch (currentState) {
              case "0": // = disabled 
                this.state = "1"; // --> enable
                this.enableButton(this); 
                this.model.setParam("clearMeasurementLine");
              break;
              default: // = paused or enabled
                this.enableButton(this);
                this.state = "1"; // --> disable
                this.model.setParam("clearMeasurementLine");
                
              break;
            }
          }           
        } 
        else {
          //-------- disable RadioButton, check state of new button to set corresponding new state ---------
          this.disableButton(this.node.selectedRadioButton);
          var currentState = this.state;
          switch (currentState) {
            case "0": // = disabled
              this.model.setParam("clearMeasurementLine");
              this.state ="1"; // = enable
              this.enableButton(this); 
            break;
            default: // = enabled or paused
              this.model.setParam("clearMeasurementLine"); //set param to the listener in Measurement.js 
              this.enableButton(this);
              this.state = "1"; // --> disabled
            break;
          }
        }
      }
      else {
        this.enableButton(this);
      }
    }
    
    else{   // because the type of e.g. Reset Button is "Button"
        //enable this tool and any dependancies
        this.enabled = true;
        if ( this.mouseHandler ) this.mouseHandler.enabled = true;
        this.doSelect(true,this);
      }
  }
  
   this.enableButton = function(newSelButton){
    //set the current button as selected
    this.node.selectedRadioButton = newSelButton;
    if (newSelButton.enabledImage) newSelButton.image.src = newSelButton.enabledImage.src;
    newSelButton.link.className = "mbButtonSelected";
    //enable this tool and any dependancies
    newSelButton.enabled = true;
    if ( newSelButton.mouseHandler ) newSelButton.mouseHandler.enabled = true;
    newSelButton.doSelect(true,newSelButton);
  }


  this.disableButton = function(disButton){
    with (disButton) {
      if (disabledImage) image.src = disabledImage.src;
      enabled = false;
      if (mouseHandler) mouseHandler.enabled = false;
      link.className = "mbButton";
      doSelect(false,this);
    }
  }
  
  /**
   * Override this function in Buttons to process select/deselect calls.
   * @param selected True when selected, false when deselected.
   * @param objRef Reference to this object.
   */
  this.doSelect = function(selected, objRef) {
     // Add support to change cursors in the map area based on:
     // either user selected cursor in config file
     // or default tool cursor as defined in constructor
     
     if( selected == true ) {
         var a = document.getElementById("mainMapContainer");
         if( a != null ) {
             // default tool cursor
             a.style.cursor = this.cursor;
             
             // Check for user override
             var cursorNode =  objRef.widgetNode.selectSingleNode("mb:cursor");
             if( cursorNode != null ) {
                 var cursor = cursorNode.firstChild.nodeValue;
                 a.style.cursor = cursor;
             }
         }  
     }
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

  this.model.addListener("refresh",this.buttonInit,this);
  this.model.addListener("init", this.initMouseHandler, this);
}
