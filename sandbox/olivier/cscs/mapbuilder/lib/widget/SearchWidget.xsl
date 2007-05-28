<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Search form
Author:      Pat Cappelaere
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id: SearchWidget.xsl 2546 2007-01-23 12:07:39Z gjvoosten $
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="modelTitle"/>
  <xsl:param name="targetModel"/>
  <xsl:param name="widgetId"/>

  <!-- Text params for this widget -->
  <xsl:param name="title"/>
  <xsl:param name="load"/>

    <!-- The name of the form for coordinate output -->
  <xsl:param name="defaultUrl"/>
  <xsl:param name="formName">SearchInputForm</xsl:param>

  <!-- Main html -->
  <xsl:template match="/">
    <div>
      <form name="{$formName}" id="{$formName}" onsubmit="return config.objects.{$widgetId}.submitForm()">
        <input name="defaultUrl" type="text" size="30" value="{$defaultUrl}"/>
        <input type="button" onclick="javascript:config.objects.{$widgetId}.submitForm();" value="Search" />
      </form>
    </div>
  </xsl:template>
  
</xsl:stylesheet>
