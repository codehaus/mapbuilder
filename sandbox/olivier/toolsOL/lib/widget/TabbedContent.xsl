<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: a TabbedContent node from config to output some tabs, 
              this requires a CSS file, see skin/default/tablist.css
Author:      adair/stella
Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .

$Id: TabbedContent.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
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
      <xsl:if test="@disabled='true'">
        <xsl:attribute name="class">disabled</xsl:attribute>
      </xsl:if>
      <a href="javascript:config.objects.{$widgetId}.selectTab(config.objects.{$tabWidgetId})" id="{$widgetId}_{$tabWidgetId}">
        <xsl:value-of select="@label"/>
      </a>
    </li>
  </xsl:template>
  
</xsl:stylesheet>
