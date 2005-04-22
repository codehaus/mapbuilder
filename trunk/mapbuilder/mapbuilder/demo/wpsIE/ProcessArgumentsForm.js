/*
Author:       Mike Adair mike.adairATccrs.nrcan.gc.ca
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");
mapbuilder.loadScript(baseDir+"/model/Proj.js");

/**
 * Widget to display the AOI box coordinates in a form.
 *
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function ProcessArgumentsForm(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);

  this.executeProcess = function(processName) {
    alert("execute not implemented yet");
  }

  /**
   * Initialize dynamic properties.
   * @param toolRef Pointer to this object.
   */
  this.initMapModel = function(objRef) {
    //set the map model
    var mapModel = objRef.widgetNode.selectSingleNode("mb:mapModel");
    if (mapModel) {
      objRef.mapModel = eval("config.objects."+mapModel.firstChild.nodeValue);
      if ( !objRef.mapModel ) {
        alert("error finding mapModel:" + mapModel.firstChild.nodeValue + " for:" + objRef.id);
      }
    }
    objRef.stylesheet.setParameter("mapModelId", objRef.mapModel.id );
  }
  this.model.addListener("init", this.initMapModel, this);

  /**
   * Output the AOI coordinates to the associated form input elements.  This
   * method is registered as an AOI listener on the context doc.
   * @param objRef Pointer to this AoiForm object.
   */
  this.displayAoiCoords = function(objRef) {
    objRef.aoiForm = document.getElementById(objRef.formName);
    var aoi = objRef.mapModel.getParam("aoi");
    objRef.aoiForm.westCoord.value = aoi[0][0];
    objRef.aoiForm.northCoord.value = aoi[0][1];
    objRef.aoiForm.eastCoord.value = aoi[1][0];
    objRef.aoiForm.southCoord.value = aoi[1][1];
  }

  /**
   * Handles user input from the form element.  This is an onblur handler for 
   * the input elements.
   * @param objRef Pointer to this CurorTrack object.
   */
  this.setAoi = function(event) {
    var aoi = this.mapModel.getParam("aoi");
    if (aoi) {
      var ul = aoi[0];
      var lr = aoi[1];
      switch(this.name) {
        case 'westCoord':
          ul[0] = this.value;
          break;
        case 'northCoord':
          ul[1] = this.value;
          break;
        case 'eastCoord':
          lr[0] = this.value;
          break;
        case 'southCoord':
          lr[1] = this.value;
          break;
      }
      this.mapModel.setParam("aoi",new Array(ul,lr) );
    }
  }

  /**
   * Refreshes the form onblur handlers when this widget is painted.
   * @param objRef Pointer to this AoiForm object.
   */
  this.postPaint = function(objRef) {
    objRef.aoiForm = document.getElementById(objRef.formName);
    if (objRef.aoiForm) {
      objRef.aoiForm.westCoord.onblur = objRef.setAoi;
      objRef.aoiForm.northCoord.onblur = objRef.setAoi;
      objRef.aoiForm.eastCoord.onblur = objRef.setAoi;
      objRef.aoiForm.southCoord.onblur = objRef.setAoi;
      objRef.aoiForm.westCoord.model = objRef.model;
      objRef.aoiForm.northCoord.model = objRef.model;
      objRef.aoiForm.eastCoord.model = objRef.model;
      objRef.aoiForm.southCoord.model = objRef.model;
      if (objRef.mapModel) objRef.mapModel.addListener('aoi', objRef.displayAoiCoords, objRef);
    }
    config.objects.dataSelector.node = document.getElementById(objRef.id+"_dataSelector");
    config.objects.dataSelector.paint(config.objects.dataSelector);
  }

  //set some properties for the form output
  this.formName = "AoiForm_";// + mbIds.getId();
  this.stylesheet.setParameter("formName", this.formName);
}

