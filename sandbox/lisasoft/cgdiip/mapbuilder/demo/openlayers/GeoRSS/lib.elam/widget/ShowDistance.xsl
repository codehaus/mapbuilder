<?xml version="1.0" encoding="utf-8"?>
<!--
  Description: Output a form for display of the measured distance
  Author:      imke doerge AT Geodan.nl
  Licence:     LGPL as specified in http://www.gnu.org/copyleft/lesser.html .
  
  $Id: ShowDistance.xsl 2956 2007-07-09 12:17:52Z steven $
  $Name:  $
-->

<xsl:stylesheet version="1.0" xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" omit-xml-declaration="yes" />

  <!-- The common params set for all widgets -->
  <xsl:param name="modelId" />
  <xsl:param name="widgetId" />
  <xsl:param name="action" />
  <xsl:param name="skinDir" select="/mb:MapbuilderConfig/mb:skinDir" />

  <!-- The title for the output -->
  <xsl:param name="distance">Distance:</xsl:param>

  <!-- The name of the form for distance output -->
  <xsl:param name="formName" />

  <!-- Main html -->
  <xsl:template match="/">
    <div>
      <form name="{$formName}" id="{$formName}">
        <xsl:value-of select="$distance" />
        <input name="distance" type="text" size="8" readonly="readonly" />
      </form>
    </div>
  </xsl:template>
</xsl:stylesheet>
