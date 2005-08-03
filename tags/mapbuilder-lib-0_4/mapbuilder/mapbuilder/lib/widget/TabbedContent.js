/*
Author:       Mike Adair/Fedele Stella
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

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
var mbNS = "http://mapbuilder.sourceforge.net/mapbuilder";  //TBD: set this somewhere else

function TabbedContent(widgetNode, model) {
  var base = new WidgetBase(this, widgetNode, model);
  this.selectedTab = null;
  var textNodeXpath = "/mb:WidgetText/mb:widgets/mb:TabbedContent";
  this.tabLabels = config.widgetText.selectNodes(textNodeXpath);

  //find the workspace node controlled by these tabs
  var workspace = widgetNode.selectSingleNode("mb:htmlWorkspace");
  if ( workspace ) {
    this.htmlWorkspace = workspace.firstChild.nodeValue;
  } else {
    alert("htmlWorkspace must be defined for TabbedContent widget");
  }

  /**
   * Initializes the tab list and sets the label for each tab
   * @param objRef a pointer to this object
   */
  this.initTabs = function(objRef) {
    var tabs = objRef.widgetNode.selectNodes("mb:tab");
    for (var i=0; i<tabs.length; ++i) {
      var tab = tabs[i];
      var tabWidgetId = tab.firstChild.nodeValue;
      var tabWidget = config.objects[tabWidgetId];
      if (!tabWidget) {
        alert("tab widget not found:"+tabWidgetId);
        return;
      }

      tabWidget.htmlTagId = objRef.htmlWorkspace;
      tabWidget.outputNodeId = objRef.id+"_workspace";
      tabWidget.node = document.getElementById(tabWidget.htmlTagId);
      tabWidget.tabList = objRef;

      var tabLabel = tab.getAttribute("label"); 
      if (!tabLabel) tabLabel = tabWidgetId;
      var textNode = config.widgetText.selectSingleNode(textNodeXpath+"/mb:"+tabWidgetId);
      if (textNode) tabLabel = textNode.firstChild.nodeValue;
      tab.setAttribute("label",tabLabel);
      
      tabWidget.model.addListener("refresh",objRef.selectTab,tabWidget);
    }
  }
  this.model.addListener("init",this.initTabs,this);

  /**
   * Adds a widget to the list of tabs (TBD: not yet working/tested)
   * @param widget the widget to be added to the list of tabs
   * @param order  the order within the tabs
   */
  this.addWidget = function(tabWidget,tabLabel) {
    tabWidget.htmlTagId = this.htmlWorkspace;
    tabWidget.outputNodeId = this.id+"_workspace";
    tabWidget.node = document.getElementById(tabWidget.htmlTagId);
    tabWidget.tabList = this;

    if (!tabLabel) tabLabel = tabWidget.id;
    var textNode = config.widgetText.selectSingleNode(textNodeXpath+"/mb:"+tabWidget.id);
    if (textNode) tabLabel = textNode.firstChild.nodeValue;

    var tabNode = this.model.doc.createElementNS(mbNS,"tab");
    tabNode.appendChild(this.model.doc.createTextNode(tabWidget.id));
    tabNode.setAttribute("label",tabLabel);
    this.widgetNode.appendChild(tabNode);

    this.paint(this);
    this.selectTab(tabWidget);
  }

  /**
   * Selects a tab, which has the effect of displaying that widget in the 
   * workspace
   * @param tabWidget the widget to be selected
   */
  this.selectTab = function(tabWidget) {
    var tabList = tabWidget.tabList;
    var newAnchor = document.getElementById(tabList.id+"_"+tabWidget.id);
    if (tabList.selectedTab!=null) tabList.selectedTab.className = '';
    newAnchor.className = 'current';
    tabList.selectedTab = newAnchor;
    tabWidget.paint(tabWidget);
    //tabWidget.targetModel.callListeners("refresh");
  }

  /**
   * sett the doc to be styled to the TabbedContent node from config
   * @param objRef a pointer to this object
   */
  this.prePaint = function(objRef){
    objRef.resultDoc = objRef.widgetNode;
  }

}
