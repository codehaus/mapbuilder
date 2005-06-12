<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: a TabbedContent node from config to output some tabs, 
              this requires a CSS file, see skin/default/tablist.css
Author:      adair/stella
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id: TabbedContent.xsl,v 1.1 2005/05/02 18:11:38 fstella Exp $
$Name:  $
-->

<xsl:stylesheet version="1.0" 
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml"/>
  <xsl:strip-space elements="*"/>

  <!-- The coordinates of the DHTML Layer on the HTML page -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>

  <!-- these handled outside of the stylesheet -->
  <xsl:template match="mb:TabbedContent">
    <ul class="tablist">
      <xsl:apply-templates select="mb:tab"/>
    </ul>
  </xsl:template>
  
  <xsl:template match="mb:tab">
    <xsl:variable name="tabWidgetId" select="."/>
    <li>
      <a href="javascript:config.objects.{$widgetId}.selectTab(config.objects.{$tabWidgetId})" id="{$widgetId}_{$tabWidgetId}">
        <xsl:value-of select="@label"/>
      </a>
    </li>
  </xsl:template>
  
</xsl:stylesheet>
