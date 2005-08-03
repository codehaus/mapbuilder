<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the cursor coordinates
Author:      Mike Adair
Licence:     LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
-->

  <xsl:output method="xml" encoding="utf-8"/>

  <!-- The common params set for all widgets -->
  <xsl:param name="lang">en</xsl:param>
  
  <!-- text value params -->
  <xsl:param name="longitude">lon:</xsl:param>
  <xsl:param name="latitude">lat:</xsl:param>
  <xsl:param name="xcoord">x:</xsl:param>
  <xsl:param name="ycoord">y:</xsl:param>
  <xsl:param name="showXY">false</xsl:param>
  
  <!-- The name of the form for coordinate output -->
  <xsl:param name="formName"/>

  <!-- Main html -->
  <xsl:template match="/">
    <div>
    <form name="{$formName}" id="{$formName}">
      <xsl:choose>
        <xsl:when test="$showXY='true'">
          <xsl:value-of select="$xcoord"/> <input name="longitude" type="text" size="10" readonly="readonly"/>
          <xsl:value-of select="$ycoord"/> <input name="latitude" type="text" size="10" readonly="readonly"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$longitude"/> <input name="longitude" type="text" SIZE="6" readonly="readonly"/>
          <xsl:value-of select="$latitude"/> <input name="latitude" type="text" SIZE="6" readonly="readonly"/>
        </xsl:otherwise>
      </xsl:choose>
    </form>
    </div>
  </xsl:template>

</xsl:stylesheet>
