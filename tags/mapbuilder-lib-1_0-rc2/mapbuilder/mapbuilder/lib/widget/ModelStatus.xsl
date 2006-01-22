<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:mb="http://mapbuilder.sourceforge.net/mapbuilder" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Widget to display the status of a model
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  <xsl:param name="modelId"/>
  <xsl:param name="modelTitle"/>
  <xsl:param name="widgetId"/>

  <!-- Text params for this widget -->
  <xsl:param name="title"/>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="statusMessage"/>

  <!-- Main html -->
  <xsl:template match="/">
    <DIV>
      <xsl:value-of select="$title"/><xsl:value-of select="$modelTitle"/><xsl:value-of select="$statusMessage"/>
    </DIV>
  </xsl:template>
  
</xsl:stylesheet>
