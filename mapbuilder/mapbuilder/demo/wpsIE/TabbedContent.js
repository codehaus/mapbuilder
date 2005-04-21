/*
Author:       Tom Kralidis
License:      GPL as per: http://www.gnu.org/copyleft/gpl.html

$Id$
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBase.js");

/**
 * Widget to display various other widgets by selecting a tab in a tab bar.
 * 
 * @constructor
 * @base WidgetBase
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */
var mbNS = "http://mapbuilder.sourceforge.net/mapbuilder";


function TabbedContent(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);
  this.selectedTab = null;
  var textNodeXpath = "/mb:WidgetText/mb:widgets/mb:TabbedContent/mb:tabLabel";
  this.tabLabels = config.widgetText.selectNodes(textNodeXpath);

  /**
   * 
   * @param widget the widget to be added to the list of tabs
   * @param order  the order within the tabs
   */
  this.initTabs = function(objRef) {
    var tabs = objRef.widgetNode.selectNodes("mb:tab");
    for (var i=0; i<tabs.length; ++i) {
      var tab = tabs[i];
      var tabWidgetId = tab.firstChild.nodeValue;
      var tabWidget = config.objects[tabWidgetId];
      tabWidget.htmlTagId = objRef.htmlTagId;
      tabWidget.outputNodeId = objRef.id+"_workspace";
      tab.setAttribute("label",objRef.tabLabels[i].firstChild.nodeValue);
    }
  }
  this.model.addListener("init",this.initTabs,this);

  /**
   * 
   * @param widget the widget to be added to the list of tabs
   * @param order  the order within the tabs
   */
  this.addWidget = function(widget,order,tabLabel) {
    widget.htmlTagId = this.htmlTagId;
    widget.outputNodeId = this.id+"_workspace";
    this.tabArray[order] = widget;
    var tabLabelNode = this.model.doc.createElementNS(mbNS,"tab");
    tabLabelNode.appendChild(this.model.doc.createTextNode(tabLabel));
    this.widgetNode.appendChild(tabLabelNode);
  }

  /**
   * Change the AOI coordinates from select box choice of prefined locations
   * @param widget the widget to be added to the list of tabs
   * @param order  the order within the tabs
   */
  this.selectTab = function(tabWidgetId) {
    var tabList=document.getElementById(this.outputNodeId);
    if (this.selectedTab!=null) tabList.childNodes[this.selectedTabIndex].firstChild.className = '';
    tabList.childNodes[tabIndex].firstChild.className = 'current';
    this.selectedTabIndex = tabIndex;
    config.paintWidget(this.tabArray[tabIndex]);
  }

  this.prePaint = function(objRef){
    objRef.resultDoc = objRef.widgetNode;
  }

}
