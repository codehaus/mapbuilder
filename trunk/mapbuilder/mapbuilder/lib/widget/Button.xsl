<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!--
Description: Convert Mapbuilder Config to a list of buttons.
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

ButtonBar.xsl,v 1.5 2004/03/25 21:25:43 madair1 Exp
-->

  <xsl:output method="xml" omit-xml-declaration="yes"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="skinDir" select="/mb:MapbuilderConfig/mb:skinDir"/>
  
  <!-- Main html  
  <xsl:template match="/mb:MapbuilderConfig">
    <DIV>
      <xsl:apply-templates select="mb:widgets/*[id='$widgetId']"/>
    </DIV>
  </xsl:template>
 -->
  <xsl:template match="/*[mb:buttonBar]">
    <xsl:param name="linkUrl">javascript:config.<xsl:value-of select="$widgetId"/>.select()</xsl:param>
    <xsl:param name="tooltip"><xsl:value-of select="mb:tooltip[@xml:lang=$lang]"/></xsl:param>
    <A HREF="{$linkUrl}"><IMG SRC="{$skinDir}{mb:disabledSrc}" ID="{@id}" TITLE="{$tooltip}" BORDER="0"/></A>
  </xsl:template>

</xsl:stylesheet>
