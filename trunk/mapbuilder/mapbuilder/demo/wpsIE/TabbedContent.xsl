<?xml version="1.0" encoding="ISO-8859-1"?>

<!--
Description: parses an OGC context document to generate an array of DHTML layers.
Author:      adair
Licence:     GPL as specified in http://www.gnu.org/copyleft/gpl.html .

$Id: owsMapPane.xsl,v 1.9 2005/03/30 20:27:03 camerons Exp $
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
      <a href="javascript:config.objects.{$widgetId}.selectTab('{$tabWidgetId}')">
        <xsl:value-of select="@label"/>
      </a>
    </li>
  </xsl:template>
  
</xsl:stylesheet>
