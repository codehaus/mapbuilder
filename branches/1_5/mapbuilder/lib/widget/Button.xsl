<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!--
Description: Convert Mapbuilder Config to a button image and link.  This stylesheet 
            takes a Button node from config as input.  The link executes two
            Javascript methods:
            - button.select() see ButtonBase
            - config.objects.$action where $action is a objectReference.method() 
              specified in config.
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

ButtonBar.xsl,v 1.5 2004/03/25 21:25:43 madair1 Exp
-->

  <xsl:output method="xml" omit-xml-declaration="yes"/>
  
  <!-- The common params set for all widgets -->
  <xsl:param name="modelId"/>
  <xsl:param name="widgetId"/>
  <xsl:param name="action"/>
  <xsl:param name="skinDir" select="/mb:MapbuilderConfig/mb:skinDir"/>

  <!-- Text params for this widget -->
  <xsl:param name="tooltip">set the tooltip property in WidgetText file</xsl:param>
  <xsl:param name="buttonText"/>
  <xsl:param name="cssName"/>
    
  <xsl:template match="*">
    <xsl:param name="linkUrl">javascript:config.objects.<xsl:value-of select="$widgetId"/>.select()<xsl:if test="$action">;config.objects.<xsl:value-of select="$action"/></xsl:if></xsl:param>
    <xsl:param name="imageID"><xsl:value-of select="@id"/>_image</xsl:param>
    <xsl:param name="disabledSrc"><xsl:value-of select="mb:disabledSrc"/></xsl:param>
    <xsl:param name="enabledSrc"><xsl:value-of select="mb:enabledSrc"/></xsl:param>
    <style>
      .olControlPanel .<xsl:value-of select="$cssName"/>Active {
		background-image: url('<xsl:value-of select="concat($skinDir,$enabledSrc)"/>');
      }
      .olControlPanel .<xsl:value-of select="$cssName"/>Inactive {
		background-image: url('<xsl:value-of select="concat($skinDir,$disabledSrc)"/>');
      }
    </style>
  </xsl:template>

</xsl:stylesheet>
