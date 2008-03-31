/*
License: LGPL as per: http://www.gnu.org/copyleft/lesser.html
$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/TipWidgetBase.js");
mapbuilder.loadScript(baseDir+"/util/openlayers/OpenLayers.js");

/**
 * Manages MapTips on the map. This widget works with models that
 * have a FeatureSelectHandler tool.
 * @base TipWidgetBase
 * @author Andreas Hocevar andreas.hocevarATgmail.com
 * @param widgetNode      The tool node from the Config XML file.
 * @param model  The ButtonBar widget.
 */
function TipWidgetOL(widgetNode, model) {
  TipWidgetBase.apply(this, new Array(widgetNode, model));

  /**
   * This method is triggered when a user clicks on a feature.
   * @param objRef reference to this widget
   */
  this.onClick = function(objRef) {
    var evt = objRef.model.getParam("olFeatureSelect");
    var popup = objRef.createPopup(objRef, evt, false);
    evt.feature.layer.mbClickPopup = popup;
  }

  /**
   * This method is triggered when the mouse is over a feature.
   * @param objRef reference to this widget
   */
  this.onMouseover = function(objRef) {
    var evt = objRef.model.getParam("olFeatureHover");
    // only create popup if there is no visible click popup
    if (evt.feature && !evt.feature.layer.mbClickPopup || !evt.feature.layer.mbClickPopup.visible()) {
      var popup = objRef.createPopup(objRef, evt, true);
      evt.feature.layer.mbHoverPopup = popup;
      // if the olFeatureOut event gets lost (eg during drag operation),
      // registering this additional event will help to get rid of the
      // popup quickly
      popup.events.register('mouseover', popup, popup.hide);
    }
  }
  
  /**
   * This method is triggered when the mouse moves out of a feature.
   * @param objRef reference to this widget
   */
  this.onMouseout = function(objRef) {
    var feature = objRef.model.getParam("olFeatureOut");
    if (feature && feature.layer && feature.layer.mbHoverPopup) {
      feature.layer.mbHoverPopup.destroy();
      feature.layer.mbHoverPopup = null;
    }
  }

  /**
   * Creates a popup.
   * @param objRef reference to this widget
   * @param evt OpenLayers.Event that triggered the popup action
   * @param hover true if the popup should be styled as a hover popup,
   * false if it is a click popup.
   * @return reference to the created popup
   */
  this.createPopup = function(objRef, evt, hover) {
    var feature = evt.feature;
    // check if there is a source model linked with this feature
    var sourceNode = objRef.model.doc.selectSingleNode("//*[@fid='"+feature.fid+"']");
    var sourceModel = null;
    if (sourceNode) {
      sourceModel = sourceNode.getAttribute('sourceModel');
    }
    // if so, use the config from the source model
    var widgetConfig = null;
    if (sourceModel && config.objects[sourceModel].config && config.objects[sourceModel].config[objRef.id]) {
      widgetConfig = config.objects[sourceModel].config[objRef.id];
    } else {
      widgetConfig = objRef.config;
    }
    widgetConfig.stylesheet.setParameter('fid', feature.fid);
    var lonlat = feature.layer.map.getLonLatFromPixel(evt.xy);
    var popup = new Mapbuilder.Popup(null, lonlat, new OpenLayers.Size(widgetConfig.width, widgetConfig.height),
        new XMLSerializer().serializeToString(widgetConfig.stylesheet.transformNodeToObject(widgetConfig.model.doc)).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&"),
        null, hover == false);
    popup.setOpacity(widgetConfig.opacity);
    popup.setBackgroundColor(widgetConfig.backgroundColor);
    popup.setBorder(widgetConfig.border);
    var quadrant = feature.layer.map.getExtent().determineQuadrant(lonlat);
    var lonOffset = quadrant.charAt(1) == 'r' ? -5 : 5;
    var latOffset = quadrant.charAt(0) == 't' ? 5 : -5;
    popup.anchor = { size: new OpenLayers.Size(0,0), offset: new OpenLayers.Pixel(lonOffset, latOffset)};    
 
    feature.layer.map.addPopup(popup, true);
    return popup;
  }
  
}

/**
 * Derived from OpenLayers.Popup (svn r6430) and 
 * OpenLayers.Popup.Anchored (svn r5614), this class preserves the
 * functionality of OpenLayers.Popup.Anchored before the new style popups
 * of http://trac.openlayers.org/ticket/926 were introduced.
 */
Mapbuilder.Popup = OpenLayers.Class(OpenLayers.Popup.Anchored, {

  initialize:function(id, lonlat, size, contentHTML, anchor, closeBox,
            closeBoxCallback) {
    if (id == null) {
      id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
    }

    this.id = id;
    this.lonlat = lonlat;
    this.size = (size != null) ? size 
                  : new OpenLayers.Size(
                           OpenLayers.Popup.WIDTH,
                           OpenLayers.Popup.HEIGHT);
    if (contentHTML != null) { 
       this.contentHTML = contentHTML;
    }
    this.backgroundColor = OpenLayers.Popup.COLOR;
    this.opacity = OpenLayers.Popup.OPACITY;
    this.border = OpenLayers.Popup.BORDER;

    this.div = OpenLayers.Util.createDiv(this.id, null, null, 
                       null, null, null, "hidden");
    this.div.className = 'olPopup';
    
    this.groupDiv = OpenLayers.Util.createDiv(null, null, null, 
                          null, "relative", null,
                          "hidden");

    var id = this.div.id + "_contentDiv";
    this.contentDiv = OpenLayers.Util.createDiv(id, null, this.size.clone(), 
                          null, "relative", null,
                          "hidden");
    this.contentDiv.className = 'olPopupContent';                      
    this.groupDiv.appendChild(this.contentDiv);
    this.div.appendChild(this.groupDiv);

    if (closeBox) {
       // close icon
      var closeSize = new OpenLayers.Size(17,17);
      var img = config.skinDir + "/openlayers/img/close.gif";
      this.closeDiv = OpenLayers.Util.createAlphaImageDiv(
        this.id + "_close", null, closeSize, img
      );
      this.closeDiv.style.right = this.padding + "px";
      this.closeDiv.style.top = this.padding + "px";
      this.groupDiv.appendChild(this.closeDiv);

      var closePopup = closeBoxCallback || function(e) {
        this.hide();
        OpenLayers.Event.stop(e);
      };
      OpenLayers.Event.observe(this.closeDiv, "click", 
          OpenLayers.Function.bindAsEventListener(closePopup, this));

    }

    this.registerEvents();

    this.anchor = (anchor != null) ? anchor 
                     : { size: new OpenLayers.Size(0,0),
                       offset: new OpenLayers.Pixel(0,0)};
  },

  destroy: function() {
    if (this.map != null) {
      this.map.removePopup(this);
      this.map = null;
    }
    this.events.destroy();
    this.events = null;
    this.div = null;
  },

  draw: function(px) {
    if (px == null) {
      if ((this.lonlat != null) && (this.map != null)) {
        px = this.map.getLayerPxFromLonLat(this.lonlat);
      }
    }
    
    //calculate relative position
    this.relativePosition = this.calculateRelativePosition(px);

    this.setSize();
    this.setBackgroundColor();
    this.setOpacity();
    this.setBorder();
    this.setContentHTML();
    this.moveTo(px);

    return this.div;
  },

  moveTo: function(px) {
    this.relativePosition = this.calculateRelativePosition(px);
    
    px = this.calculateNewPx(px);
    
    if ((px != null) && (this.div != null)) {
      this.div.style.left = px.x + "px";
      this.div.style.top = px.y + "px";
    }
  },

  toggle: function() {
    OpenLayers.Element.toggle(this.div);
  },

  show: function() {
    OpenLayers.Element.show(this.div);
  },

  hide: function() {
    OpenLayers.Element.hide(this.div);
  },

  setSize:function(size) { 
    if (size != undefined) {
      this.size = size; 
    }
    
    if (this.div != null) {
      this.div.style.width = this.size.w + "px";
      this.div.style.height = this.size.h + "px";
    }
    if (this.contentDiv != null){
      this.contentDiv.style.width = this.size.w + "px";
      this.contentDiv.style.height = this.size.h + "px";
    }

    if ((this.lonlat) && (this.map)) {
      var px = this.map.getLayerPxFromLonLat(this.lonlat);
      this.moveTo(px);
    }
  },  

  setBackgroundColor:function(color) { 
    if (color != undefined) {
      this.backgroundColor = color; 
    }
    
    if (this.div != null) {
      this.div.style.backgroundColor = this.backgroundColor;
    }
  },  
  
  CLASS_NAME: "Mapbuilder.Popup"
});

