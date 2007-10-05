/*
Author:       Mike Adair/Fedele Stella
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: TabbedContent.js 2511 2007-01-05 11:55:23Z gjvoosten $
*/

// Ensure this object's dependancies are loaded.
mapbuilder.loadScript(baseDir+"/widget/WidgetBaseXSL.js");

/**
 * Widget to display various other widgets by selecting a tab in a tab bar.
 * 
 * @constructor
 * @base WidgetBaseXSL
 * @param widgetNode This widget's object node from the configuration document.
 * @param model The model that this widget is a view of.
 */

function TabbedContent(widgetNode, model) {
  WidgetBaseXSL.apply(this,new Array(widgetNode, model));

  this.selectedTab = null;
  this.tabList = new Array();
  this.textNodeXpath = "/mb:WidgetText/mb:widgets/mb:TabbedContent";

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
        alert(mbGetMessage("tabWidgetNotFound", tabWidgetId));
        return;
      }

      objRef.tabList.push(tabWidget);

      var tabLabel = tab.getAttribute("label"); 
      if (!tabLabel) tabLabel = tabWidgetId;
      var textNode = config.widgetText.selectSingleNode(objRef.textNodeXpath+"/mb:"+tabWidgetId);
      if (textNode) tabLabel = textNode.firstChild.nodeValue;
      tab.setAttribute("label",tabLabel);
      
      tabWidget.model.addListener("refresh",objRef.paint,objRef);
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
    this.tabList.push(tabWidget);

    if (!tabLabel) tabLabel = tabWidget.id;
    var textNode = config.widgetText.selectSingleNode(this.textNodeXpath+"/mb:"+tabWidget.id);
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
    if (!tabWidget.model.doc) {
      alert(mbGetMessage("noDataYet"));
      return;
    }
    var tabBar = config.objects[tabWidget.tabBarId]
    if (tabBar.selectedTab!=null) tabBar.selectedTab.className = '';
    var newAnchor = document.getElementById(tabBar.id+"_"+tabWidget.id);
    if (newAnchor) {
      newAnchor.className = 'current';
      tabBar.selectedTab = newAnchor;
      tabWidget.paint(tabWidget,tabWidget.id);
    }
    if (tabWidget.tabAction) eval(tabWidget.tabAction);
  }

  /**
   * sett the doc to be styled to the TabbedContent node from config
   * @param objRef a pointer to this object
   */
  this.prePaint = function(objRef){
    objRef.resultDoc = objRef.widgetNode;
    for (var i=0; i<objRef.tabList.length; ++i) {
      var tabWidget = objRef.tabList[i];
      tabWidget.tabBarId = this.id;
      var tabNode = objRef.resultDoc.selectSingleNode("mb:tab[text()='"+tabWidget.id+"']");
      if (!tabWidget.model.doc) {
        tabNode.setAttribute("disabled", "true");
      } else {
        tabNode.removeAttribute("disabled");
      }

      //specify an optional action to be performed when the tab is selected
      var tabAction = tabWidget.widgetNode.selectSingleNode("mb:tabAction");
      if (tabAction) tabWidget.tabAction = tabAction.firstChild.nodeValue;
    }
  }

}
