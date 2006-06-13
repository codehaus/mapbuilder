<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
Description: Output a form for display of the cursor coordinates
Author:      Mike Adair
Licence:     GPL as per: http://www.gnu.org/copyleft/gpl.html

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
    <DIV>
    <FORM NAME="{$formName}" ID="{$formName}">
      <xsl:choose>
        <xsl:when test="$showXY='true'">
          <xsl:value-of select="$xcoord"/> <input NAME="longitude" TYPE="text" SIZE="10" READONLY="true"/>
          <xsl:value-of select="$ycoord"/> <input NAME="latitude" TYPE="text" SIZE="10" READONLY="true"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$longitude"/> <input NAME="longitude" TYPE="text" SIZE="6" READONLY="true"/>
          <xsl:value-of select="$latitude"/> <input NAME="latitude" TYPE="text" SIZE="6" READONLY="true"/>
        </xsl:otherwise>
      </xsl:choose>
    </FORM>
    </DIV>
  </xsl:template>

</xsl:stylesheet>